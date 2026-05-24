import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 8787);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.resolve(__dirname, "..", "prompts");

const readPromptFile = (fileName) => fs.readFileSync(path.join(promptsDir, fileName), "utf-8");
const npcPromptProfiles = JSON.parse(readPromptFile("npcProfiles.json"));
const npcProfiles = Object.fromEntries(npcPromptProfiles.map((profile) => [profile.npcId, profile]));
const eventFacts = JSON.parse(readPromptFile("eventFacts.json"));
const conversationRules = readPromptFile("conversationRules.md").trim();
const userInstruction = readPromptFile("userInstruction.md").trim();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const stateLabels = {
  centralAuthority: "中央权威",
  emperorPrestige: "皇帝威望",
  militaryMorale: "军心",
  publicAnger: "民怨",
  tangMilitaryStrength: "唐军战力",
  politicalTrust: "政治互信",
  yangGuifeiSafety: "贵妃安全",
  yangGuozhongPower: "杨国忠权势",
  anLushanAmbition: "安禄山野心",
  rebellionRisk: "叛乱风险",
  historyDeviation: "历史偏离度"
};

const trimReply = (text) => {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  if (normalized.length <= 130) return normalized;
  return `${normalized.slice(0, 126)}……`;
};

const summarizeState = (gameState = {}) =>
  Object.entries(stateLabels)
    .filter(([key]) => typeof gameState[key] === "number")
    .map(([key, label]) => `${label}${gameState[key]}`)
    .join("，");

const formatDecisionOptions = (options = []) => {
  if (!Array.isArray(options) || options.length === 0) {
    return "没有明确选项。仍需围绕当前节点的下一步危险回答。";
  }

  return options
    .map((choice, index) => {
      const tag = choice.historicalTag ? `，${choice.historicalTag}` : "";
      return `${index + 1}. ${choice.label}${tag}：${choice.description}`;
    })
    .join("\n");
};

const selectDecisionAnchor = (payload = {}) => {
  const options = Array.isArray(payload.decisionOptions) ? payload.decisionOptions : [];
  if (options.length === 0) return undefined;

  const message = String(payload.message ?? "");
  const keywords = ["坚守", "出关", "决战", "拖延", "上书", "削弱", "赐死", "保护", "出家", "假死", "逃离", "追击", "长安", "太子", "公开", "承认"];
  const matchedKeyword = keywords.find((keyword) => message.includes(keyword));
  if (matchedKeyword) {
    const matchedChoice = options.find((choice) => `${choice.label}${choice.description}`.includes(matchedKeyword));
    if (matchedChoice) return matchedChoice;
  }

  const seed = Array.from(`${payload.npcId}-${payload.eventId}-${payload.playerRole}-${payload.message}`).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  return options[seed % options.length];
};

const mockDecisionLine = (profile, anchor) => {
  if (!anchor) return "";

  if (profile.npcId?.startsWith("rebel") || profile.npcId === "yan_zhuang") {
    return "可兵和粮都在路上，不能只看眼前的便宜。";
  }

  if (["geshu_han", "field_officer", "scout", "soldier", "frontier_messenger"].includes(profile.npcId)) {
    return "前线现在最怕急令，军心一乱，关门再险也守不稳。";
  }

  if (["yang_guifei", "gao_lishi", "chen_xuanli", "imperial_guard", "li_heng", "palace_attendant"].includes(profile.npcId)) {
    return "外面的人已经不听漂亮话，只看眼前有没有交代。";
  }

  return "这话说出去容易，真正难的是让人相信。";
};

const addressForPlayer = (payload = {}) => {
  const role = payload.playerRole;
  if (role === "tang_xuanzong") return "皇上";
  if (role === "an_lushan") return "大帅";
  if (role === "geshu_han") return "老帅";
  if (role === "yang_guifei") return "娘子";
  return payload.playerRoleName ?? "";
};

const purposeForDialogue = (profile, payload = {}) => {
  if (profile.npcId === "geshu_han" && payload.playerRole === "tang_xuanzong") {
    return "劝皇上不要催战，同时守住臣子的分寸。";
  }
  if (profile.npcId === "yang_guozhong") return "把压力推向前线，维护自己的权位。";
  if (profile.npcId === "chen_xuanli") return "让对方明白军心快压不住了。";
  if (profile.npcId === "yang_guifei") return "安抚对方，也为自己求一线生路。";
  if (profile.npcId?.startsWith("rebel") || profile.npcId === "yan_zhuang") return "试探战机，提醒风险。";
  return "提醒对方眼前最危险的事。";
};

const cleanupNpcReply = (reply, profile, payload = {}) => {
  const address = addressForPlayer(payload);
  const selfNamePattern = new RegExp(profile.name, "g");
  let text = trimReply(reply)
    .replace(new RegExp(`${profile.name}的`, "g"), "我的")
    .replace(selfNamePattern, "我")
    .replace(/这话说到底，/g, "")
    .replace(/当前抉择/g, "眼下这事")
    .replace(/代价是/g, "难就难在");

  if (address && profile.npcId !== payload.playerRole && !text.startsWith(address) && !text.startsWith(`陛下`) && !text.startsWith(`皇上`)) {
    text = `${address}，${text}`;
  }

  return trimReply(text);
};

const pickMockReply = (payload = {}) => {
  const profile = npcProfiles[payload.npcId];
  if (!profile) {
    return "现在局势太乱，我知道的也有限。真要判断下一步，只能先看军心稳不稳、粮道还能不能撑住。";
  }

  const seed = Array.from(`${payload.npcId}-${payload.eventId}-${payload.playerRole}-${payload.message}`).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  const base = profile.mockReplies[seed % profile.mockReplies.length];
  const anchor = selectDecisionAnchor(payload);
  const extra = mockDecisionLine(profile, anchor);
  return cleanupNpcReply(extra ? `${base} ${extra}` : base, profile, payload);
};

const createSystemPrompt = (payload = {}) => {
  const profile = npcProfiles[payload.npcId] ?? npcProfiles.tang_xuanzong;
  const playerName = payload.playerRoleName
    ? `${payload.playerRoleName}（${payload.playerRoleIdentity ?? payload.playerRole}）`
    : payload.playerRole;
  const stateSummary = summarizeState(payload.gameState);
  const address = addressForPlayer(payload);
  const purpose = purposeForDialogue(profile, payload);

  return [
    conversationRules,
    "",
    `你正在扮演：${profile.name}`,
    payload.npcIdentity ? `当前身份：${payload.npcIdentity}` : "",
    payload.npcAttitude ? `当前状态/情绪：${payload.npcAttitude}` : "",
    `说话风格：${profile.voice}`,
    `人物动机：${profile.motive}`,
    `信息局限：${profile.limitation}`,
    address ? `你面对的人：${playerName}。你应当称呼对方为“${address}”。` : `你面对的人：${playerName}`,
    `你这次说话的目的：${purpose}`,
    "",
    `当前历史节点：${payload.eventTitle ?? payload.eventId}`,
    `节点背景：${payload.eventSummary ?? eventFacts[payload.eventId] ?? "安史之乱关键节点。"}`,
    `玩家扮演：${playerName}`,
    `玩家当前视角：${payload.perspectiveTitle ?? "当前节点视角"}`,
    `玩家目标：${payload.playerObjective ?? "在当前历史节点中做出决策。"}`,
    `玩家信息局限：${payload.perspectiveLimitation ?? "只能依据当前身份能接触到的信息判断。"}`,
    stateSummary ? `当前状态数值：${stateSummary}` : "",
    payload.decisionQuestion ? `节点核心问题：${payload.decisionQuestion}` : "",
    "",
    "后台走向上下文，只用于理解局势，禁止逐条复述、照抄选项名或照抄选项描述：",
    formatDecisionOptions(payload.decisionOptions)
  ]
    .filter(Boolean)
    .join("\n");
};

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    mock: process.env.MOCK_MODE === "true" || !process.env.OPENAI_API_KEY
  });
});

app.post("/api/chat", async (request, response) => {
  const payload = request.body ?? {};
  const useMock = process.env.MOCK_MODE === "true" || !process.env.OPENAI_API_KEY;

  if (useMock) {
    response.json({
      reply: pickMockReply(payload),
      mock: true
    });
    return;
  }

  try {
    const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
    const apiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.75,
        max_tokens: 240,
        messages: [
          {
            role: "system",
            content: createSystemPrompt(payload)
          },
          {
            role: "user",
            content: [`玩家提问：${String(payload.message ?? "")}`, userInstruction].join("\n\n")
          }
        ]
      })
    });

    if (!apiResponse.ok) {
      throw new Error(`OpenAI-compatible API returned ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    const reply = cleanupNpcReply(data?.choices?.[0]?.message?.content || pickMockReply(payload), npcProfiles[payload.npcId] ?? npcProfiles.tang_xuanzong, payload);

    response.json({
      reply,
      mock: false
    });
  } catch (error) {
    console.error(error);
    response.json({
      reply: pickMockReply(payload),
      mock: true
    });
  }
});

app.listen(port, () => {
  console.log(`VN chat API listening on http://localhost:${port}`);
});
