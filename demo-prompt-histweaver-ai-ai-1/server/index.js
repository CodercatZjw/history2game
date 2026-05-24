import { createServer } from "node:http";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "generated-configs");
const port = Number(process.env.PORT || 8790);

const apiBaseUrl = process.env.VITE_API_BASE_URL || "https://api.deepseek.com";
const apiKey = process.env.VITE_API_KEY || "sk-7afab1043f92422c9d18198a54b64375";
const modelName = process.env.VITE_MODEL_NAME || "deepseek-v4-pro";

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function sendSse(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function slugify(input) {
  return (
    String(input || "generated-event")
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 52) || "generated-event"
  );
}

function buildPipelinePrompt(sourceText) {
  return `
你是“史境 HistWeaver”的历史互动叙事数据生成器。
你的任务不是写代码，而是把用户输入的历史事件资料，填充为一个可被视觉小说 Runtime 直接读取的 HistoricalGameConfig JSON。

必须只输出一个合法 JSON 对象：
- 不要 markdown。
- 不要解释。
- 不要注释。
- 不要尾随逗号。
- 字符串必须使用双引号。
- 不要输出 JSON 之外的任何文字。
- JSON 结构标点必须使用英文半角符号：冒号必须是 :，逗号必须是 ,。
- 每个属性都必须写成 "key": value，禁止写成 "key" value。
- 属性名不能多空格，必须完全复制模板里的英文 key，例如只能写 "currentSituation":，不能写 "currentSituation "。
- 输出前在心里逐行检查：每一个以双引号开头的属性名后面，都必须紧跟英文冒号。

核心原则：
- 现代白话，玩家不了解历史也能看懂。
- 每个角色都有不同目标、信息边界、对话对象、推荐问题和决策。
- AI 只用于决策前有限询问，不是无限聊天。
- 所有固定剧情、玩家提问、AI 回答、决策结果、结局旁白都必须使用 DialogueBlock。
- 推荐问题必须写在 node.availableNPCs[].quickQuestionsByPlayerRole[playerRoleId]。
- 角色、节点、NPC、状态、随机事件、结局都要是数据，不要生成代码。
- 正史选项尊重历史，反事实选项要合理，不要爽文改史。

请按以下顶层字段顺序生成：
id,title,period,intro,theme,assets,timeline,roles,npcs,nodes,stateSchema,defaultState,randomEvents,endings

必须使用这个结构：
{
  "id": "event_slug",
  "title": "历史事件标题",
  "period": "时代和年份",
  "intro": "白话介绍",
  "theme": "主题",
  "assets": {
    "coverImage": "",
    "defaultBackground": "",
    "sceneBackgrounds": {},
    "portraits": {},
    "endingBackgrounds": {}
  },
  "timeline": [
    {"id":"timeline_1","year":"年份","title":"事件","description":"白话说明","location":"地点","importance":5}
  ],
  "roles": [
    {
      "id":"role_id",
      "name":"角色名",
      "identity":"身份",
      "goal":"目标",
      "dilemma":"困境",
      "visibleInfo":"玩家可见信息",
      "hiddenMotivation":"隐藏动机",
      "portraitImage":"",
      "initialStateModifiers":{},
      "playableNodeIds":["node_id"],
      "routeDescription":"路线说明"
    }
  ],
  "npcs": [
    {
      "id":"npc_id",
      "name":"NPC 名称",
      "identity":"身份",
      "globalStance":"整体立场",
      "personality":"性格",
      "knowledgeBoundary":"全局信息边界",
      "portraitImage":"",
      "promptProfileKey":"profile_key"
    }
  ],
  "nodes": [
    {
      "id":"node_id",
      "title":"节点标题",
      "year":"年份",
      "location":"地点",
      "background":"当前局势",
      "conflict":"信息冲突",
      "backgroundImage":"",
      "playableRoleIds":["role_id"],
      "availableNPCs":[
        {
          "npcId":"npc_id",
          "stanceInThisNode":"当前节点的具体态度",
          "knowledgeInThisNode":"当前节点知道什么、不知道什么、可能隐瞒什么",
          "relationshipToPlayerRole":{"role_id":"该 NPC 面对该玩家角色的关系"},
          "canBeAsked":true,
          "quickQuestionsByPlayerRole":{"role_id":["推荐问题1","推荐问题2","推荐问题3"]}
        }
      ],
      "dialogueLimit":3,
      "fixedScript":{"role_id":[{"id":"script_1","type":"narration","speakerName":"旁白","text":"白话剧情"}]},
      "decisions":[
        {
          "id":"decision_id",
          "text":"玩家看到的选项文字",
          "description":"这个选择意味着什么",
          "type":"historical",
          "allowedRoleIds":["role_id"],
          "stateEffects":{"state_key":5},
          "nextNodeId":"next_node_id",
          "randomEventId":"",
          "historicalExplanation":"正史或反事实解释",
          "resultScript":[{"id":"result_1","type":"decisionResult","speakerName":"旁白","text":"选择后的剧情结果"}]
        }
      ],
      "nodeIntroForRoles":{"role_id":{"currentSituation":"当前局势","informationConflict":"信息冲突","playerPressure":"玩家压力","inquiryPurpose":"询问目的","playerSituation":"玩家处境","decisionPressure":"为什么必须决策","stakes":"影响什么"}},
      "shortContext":"一句话解释当前局势",
      "detailedContext":"详细背景",
      "glossary":[{"term":"术语","explanation":"通俗解释"}]
    }
  ],
  "stateSchema":[{"key":"state_key","label":"状态名","description":"说明","min":0,"max":100,"defaultValue":50}],
  "defaultState":{"state_key":50},
  "randomEvents":[{"id":"random_1","title":"随机事件","description":"说明","relatedStateKeys":["state_key"],"probabilityFormulaDescription":"如何受状态影响","successText":"成功剧情","failureText":"失败剧情","successEffects":{"state_key":5},"failureEffects":{"state_key":-5}}],
  "endings":[{"id":"ending_1","title":"结局","priority":1,"conditionDescription":"触发条件","summary":"结局摘要","historyComparison":"与正史比较","counterfactualExplanation":"反事实解释","endingNarration":[{"id":"ending_text_1","type":"endingNarration","speakerName":"旁白","text":"结局旁白"}],"backgroundImage":""}]
}

非常重要的结构禁令：
- nodes[].decisions 必须是扁平 DecisionOption[]。
- 禁止在 decisions 中生成 roleId、title、options、effects 字段。
- 禁止生成 {"roleId":"...","options":[...]} 这种“决策组”。
- 每一个可点击选项都必须直接是 decisions 数组里的一个对象。
- 决策影响字段必须叫 stateEffects，不能叫 effects。
- 允许角色字段必须叫 allowedRoleIds，值必须是数组，不能叫 roleId。
- DialogueBlock 必须使用 speakerName，不能只写 speaker。
- glossary 必须使用 explanation，不能使用 definition。
- timeline.importance 必须是 1 到 5 的数字。
- nodeIntroForRoles 的字段名只能是 currentSituation、informationConflict、playerPressure、inquiryPurpose、playerSituation、decisionPressure、stakes，不能改名，不能多空格。

数量控制：
- 生成 4 个 playable roles。
- 生成 5 个 story nodes，覆盖危机酝酿、爆发、重大转折、权力或战局变化、个人命运变化、历史后果。
- 生成 6 个 NPC。
- 每个节点只放 2 个 playableRoleIds，4 个角色要分散到不同节点里，让路线不同，但不要让每个角色都出现在每个节点。
- 每个节点只放 2 个可询问 NPC。
- 每个 NodeNPC 对当前节点 playableRoleIds 中的每个角色只写 2 个推荐问题。
- 每个节点为每个 playableRoleIds 中的角色生成 2 个决策选项。
- 每个节点每个角色 fixedScript 写 2 个 DialogueBlock，每个 DialogueBlock 的 text 不超过 45 个汉字。
- 每个决策 resultScript 写 1 个 DialogueBlock。
- 每个 description、background、conflict、summary、explanation 不超过 60 个汉字。
- assets 里的图片字段请尽量留空字符串，Runtime 会统一补默认图。不要输出很长的 data:image/svg+xml。

NodeNPC 生成硬性要求：
- availableNPCs 中每一项必须包含非空 npcId、stanceInThisNode、knowledgeInThisNode、relationshipToPlayerRole、quickQuestionsByPlayerRole。
- stanceInThisNode 必须是当前节点里的具体态度，例如“主张拖延，希望你先稳住局面”，不能留空，不能只写“支持/反对”。
- knowledgeInThisNode 必须写清楚该 NPC 现在知道什么、不知道什么、可能隐瞒什么，不能留空。
- relationshipToPlayerRole 必须为该节点 playableRoleIds 中的每个 role id 都写一条关系说明。
- quickQuestionsByPlayerRole 必须为该节点 playableRoleIds 中的每个 role id 都写 2 个推荐问题。
- 推荐问题必须面向当前 role + 当前 NPC + 当前 node，不要写泛泛的“你怎么看局势？”。

DialogueBlock.type 只能是：
"narration" | "fixedDialogue" | "aiDialogue" | "playerQuestion" | "systemResult" | "decisionResult" | "endingNarration"

DecisionOption.type 只能是：
"historical" | "counterfactual" | "hidden"

用户输入的历史事件资料：
${sourceText}
`.trim();
}

async function handleGenerateStream(req, res) {
  const { sourceText = "" } = await readBody(req);
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  sendSse(res, "log", { message: "连接生成服务，准备向 LLM 发起流式请求。" });
  sendSse(res, "phase", { id: "input", message: "已读取历史事件输入。" });

  let waitingHeartbeat = null;
  let heartbeatStarted = false;
  let heartbeatEnded = false;
  const stopHeartbeat = () => {
    if (waitingHeartbeat) {
      clearInterval(waitingHeartbeat);
      waitingHeartbeat = null;
    }
    if (heartbeatStarted && !heartbeatEnded) {
      sendSse(res, "heartbeat", { token: "\n" });
      heartbeatEnded = true;
    }
  };

  try {
    waitingHeartbeat = setInterval(() => {
      if (!heartbeatStarted) {
        sendSse(res, "heartbeat", { token: "史官正在谋篇布局中." });
        heartbeatStarted = true;
        return;
      }
      sendSse(res, "heartbeat", { token: "." });
    }, 1000);

    const upstream = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        temperature: 0.15,
        max_tokens: 12000,
        stream: true,
        messages: [
          {
            role: "system",
            content:
              '你是严格 JSON 生成器。只输出一个 JSON 对象。所有属性必须写成 "key": value。禁止 markdown、注释、解释、尾随逗号、中文结构冒号。',
          },
          {
            role: "user",
            content: buildPipelinePrompt(sourceText),
          },
        ],
      }),
    });

    if (!upstream.ok) {
      const errorText = await upstream.text();
      throw new Error(`LLM request failed: ${upstream.status} ${errorText.slice(0, 240)}`);
    }

    if (!upstream.body) {
      throw new Error("LLM response body is empty.");
    }

    sendSse(res, "phase", { id: "timeline", message: "LLM 已开始生成结构化 JSON。" });
    const decoder = new TextDecoder();
    let buffer = "";
    let tokenCount = 0;

    for await (const chunk of upstream.body) {
      buffer += decoder.decode(chunk, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        const dataLines = part
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.replace(/^data:\s*/, ""));

        for (const dataLine of dataLines) {
          if (dataLine === "[DONE]") {
            sendSse(res, "done", { message: "LLM 流式输出结束。" });
            res.end();
            return;
          }

          try {
            const payload = JSON.parse(dataLine);
            const token =
              payload?.choices?.[0]?.delta?.content ??
              payload?.choices?.[0]?.message?.content ??
              "";
            if (token) {
              stopHeartbeat();
              tokenCount += 1;
              if (tokenCount % 80 === 0) {
                sendSse(res, "log", { message: `已接收 ${tokenCount} 个 token 片段。` });
              }
              sendSse(res, "token", { token });
            }
          } catch {
            sendSse(res, "token", { token: dataLine });
          }
        }
      }
    }

    sendSse(res, "done", { message: "LLM 连接结束。" });
    res.end();
  } catch (error) {
    stopHeartbeat();
    sendSse(res, "error", { message: error instanceof Error ? error.message : String(error) });
    res.end();
  }
}

function extractJsonPayload(text) {
  const trimmed = String(text || "").trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const unfenced = fenced?.[1]?.trim() || trimmed;
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  const candidate = start >= 0 && end > start ? unfenced.slice(start, end + 1) : unfenced;
  return candidate.replace(/,\s*([}\]])/g, "$1");
}

function parseStageJson(text, stageName) {
  try {
    return JSON.parse(extractJsonPayload(text));
  } catch (error) {
    throw new Error(`${stageName} JSON parse failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function parseStageJsonWithRepair({ res, raw, stageName, schemaHint }) {
  try {
    return parseStageJson(raw, stageName);
  } catch (error) {
    sendSse(res, "log", {
      message: `${stageName}：JSON 解析失败，启动一次自动修复。${error instanceof Error ? error.message : String(error)}`,
    });
    const repairRaw = await callLlmJsonStage({
      res,
      stageId: "runtime",
      stageName: `${stageName} JSON 修复`,
      maxTokens: Math.min(6500, Math.max(2500, Math.ceil(raw.length / 2))),
      prompt: `
下面是一段格式损坏的 JSON。请只修复 JSON 语法，不要改写内容，不要增加解释。

修复要求：
- 只输出一个合法 JSON 对象。
- 所有属性必须是 "key": value。
- 使用英文半角冒号和逗号。
- 删除尾随逗号。
- 不要 markdown。
- 不要补充 JSON 之外的文字。

对象类型：
${schemaHint}

损坏 JSON：
${raw}
`.trim(),
    });
    return parseStageJson(repairRaw, `${stageName} 修复结果`);
  }
}

function strictJsonSystemPrompt() {
  return [
    "You are a strict JSON generator.",
    "Return exactly one valid JSON object.",
    "Do not write markdown, comments, explanations, or code fences.",
    'Every property must use the form "key": value.',
    "Use ASCII JSON punctuation only. Colon must be :, comma must be ,.",
    "Do not use trailing commas.",
    "Keep all Chinese prose concise and modern.",
  ].join("\n");
}

function buildOutlinePrompt(sourceText, retryReason = "") {
  return `
请把用户输入的历史事件拆成 HistWeaver 游戏配置总纲。只输出 JSON。

这一步只生成总纲，不生成完整 nodes 剧情。

${retryReason ? `上一次输出不合格，原因：${retryReason}\n这一次必须修正这些问题，不允许返回空数组或占位字段。` : ""}

极重要：
- 即使用户只输入一个历史事件名称，也必须根据通史常识补全时间线、角色、NPC、节点计划、状态变量和结局规则。
- 任何关键数组为空都是失败：timeline、roles、npcs、nodePlans、stateSchema、randomEvents、endings 都不能是空数组。
- 禁止输出占位符：不要出现 event_slug、role_id、npc_id、node_id、state_key、事件标题、角色名、NPC名 这类模板词。
- 不要为了避免出错而把数组留空；宁可简短，也必须填满。
- stateSchema 必须是数组，不是对象。
- defaultState 必须包含 stateSchema 中每个 key。

必须输出这个对象：
{
  "id": "event_slug",
  "title": "事件标题",
  "period": "时代和年份",
  "intro": "80字以内白话介绍",
  "theme": "主题",
  "timeline": [
    {"id":"timeline_1","year":"年份","title":"事件","description":"60字以内","location":"地点","importance":5}
  ],
  "roles": [
    {"id":"role_id","name":"角色名","identity":"身份","goal":"目标","dilemma":"困境","visibleInfo":"可见信息","hiddenMotivation":"隐藏动机","portraitImage":"","initialStateModifiers":{},"playableNodeIds":["node_id"],"routeDescription":"路线说明"}
  ],
  "npcs": [
    {"id":"npc_id","name":"NPC名","identity":"身份","globalStance":"整体立场","personality":"性格","knowledgeBoundary":"信息边界","portraitImage":"","promptProfileKey":"profile_key"}
  ],
  "nodePlans": [
    {"id":"node_id","title":"节点标题","year":"年份","location":"地点","background":"60字以内当前局势","conflict":"60字以内信息冲突","playableRoleIds":["role_a","role_b"],"availableNpcIds":["npc_a","npc_b"],"shortContext":"一句话局势","detailedContext":"80字以内背景"}
  ],
  "stateSchema": [
    {"key":"state_key","label":"状态名","description":"说明","min":0,"max":100,"defaultValue":50}
  ],
  "defaultState": {"state_key":50},
  "randomEvents": [
    {"id":"random_1","title":"事件","description":"说明","relatedStateKeys":["state_key"],"probabilityFormulaDescription":"受哪些状态影响","successText":"成功剧情","failureText":"失败剧情","successEffects":{"state_key":5},"failureEffects":{"state_key":-5}}
  ],
  "endings": [
    {"id":"ending_1","title":"结局","priority":1,"conditionDescription":"触发条件","summary":"摘要","historyComparison":"与正史比较","counterfactualExplanation":"反事实解释","endingNarration":[{"id":"ending_1_text","type":"endingNarration","speakerName":"旁白","text":"结局旁白"}],"backgroundImage":""}
  ]
}

硬性数量：
- timeline 必须正好 5 条，不能少，不能空。
- roles 必须正好 4 个，不能少，不能空。
- npcs 必须正好 6 个，不能少，不能空。
- nodePlans 必须正好 5 个，不能少，不能空。
- 每个 nodePlans[].playableRoleIds 只能放 2 个角色 id。
- 每个 nodePlans[].availableNpcIds 只能放 2 个 NPC id。
- stateSchema 必须正好 5 个，不能少，不能空。
- randomEvents 必须正好 2 个，不能少，不能空。
- endings 必须正好 3 个，不能少，不能空。

字段约束：
- nodePlans 中的 role id 必须来自 roles。
- nodePlans 中的 npc id 必须来自 npcs。
- roles[].playableNodeIds 必须来自 nodePlans。
- 不要输出 assets，不要输出 nodes。
- 所有 id 使用小写英文、数字、下划线。

用户输入：
${sourceText}
`.trim();
}

function buildNodePrompt(outline, nodePlan) {
  return `
请根据 HistWeaver 总纲，为单个节点生成完整 StoryNode JSON。只输出这个节点对象，不要输出顶层配置。

总纲：
${JSON.stringify(
  {
    title: outline.title,
    period: outline.period,
    theme: outline.theme,
    roles: outline.roles,
    npcs: outline.npcs,
    stateSchema: outline.stateSchema,
    nodePlan,
  },
  null,
  2,
)}

必须输出这个对象：
{
  "id":"${nodePlan.id}",
  "title":"${nodePlan.title}",
  "year":"${nodePlan.year}",
  "location":"${nodePlan.location}",
  "background":"当前局势",
  "conflict":"信息冲突",
  "backgroundImage":"",
  "playableRoleIds":${JSON.stringify(nodePlan.playableRoleIds || [])},
  "availableNPCs":[
    {
      "npcId":"npc_id",
      "stanceInThisNode":"当前节点的具体态度",
      "knowledgeInThisNode":"当前节点知道什么、不知道什么、可能隐瞒什么",
      "relationshipToPlayerRole":{"role_id":"该 NPC 面对该玩家角色的关系"},
      "canBeAsked":true,
      "quickQuestionsByPlayerRole":{"role_id":["推荐问题1","推荐问题2"]}
    }
  ],
  "dialogueLimit":3,
  "fixedScript":{"role_id":[{"id":"script_1","type":"narration","speakerName":"旁白","text":"白话剧情"}]},
  "decisions":[
    {
      "id":"decision_id",
      "text":"玩家看到的选项文字",
      "description":"这个选择意味着什么",
      "type":"historical",
      "allowedRoleIds":["role_id"],
      "stateEffects":{"state_key":5},
      "nextNodeId":"",
      "randomEventId":"",
      "historicalExplanation":"正史或合理反事实解释",
      "resultScript":[{"id":"result_1","type":"decisionResult","speakerName":"旁白","text":"选择后的剧情结果"}]
    }
  ],
  "nodeIntroForRoles":{"role_id":{"currentSituation":"当前局势","informationConflict":"信息冲突","playerPressure":"玩家压力","inquiryPurpose":"询问目的","playerSituation":"玩家处境","decisionPressure":"为什么必须决策","stakes":"影响什么"}},
  "shortContext":"一句话解释当前局势",
  "detailedContext":"详细背景",
  "glossary":[{"term":"术语","explanation":"通俗解释"}]
}

硬性规则：
- availableNPCs 只能使用 nodePlan.availableNpcIds 中的 NPC。
- relationshipToPlayerRole 和 quickQuestionsByPlayerRole 只为 playableRoleIds 中的角色生成。
- 每个 quickQuestionsByPlayerRole[roleId] 正好 2 个问题。
- fixedScript 必须给 playableRoleIds 中每个角色各 2 个 DialogueBlock。
- decisions 必须是扁平数组，禁止 roleId/title/options/effects 字段。
- 每个 playableRoleIds 中的角色正好 2 个 decision，allowedRoleIds 只放该角色 id。
- decision.nextNodeId 只能指向该 allowedRoleIds 角色 playableNodeIds 里的后续节点。
- 如果不确定后续节点是否属于该角色，nextNodeId 必须写成空字符串 ""，Runtime 会按角色路线自动前进。
- 禁止把某个角色的 decision.nextNodeId 指向不包含该角色的节点。
- stateEffects 的 key 必须来自 stateSchema。
- DialogueBlock 必须使用 speakerName，不能用 speaker。
- glossary 必须用 explanation，不能用 definition。
- 文案白话，每个 text 不超过 55 个汉字。
- 每个属性必须写成 "key": value，不能漏冒号。
`.trim();
}

function validateOutline(outline) {
  const issues = [];
  const exactLengths = [
    ["timeline", 5],
    ["roles", 4],
    ["npcs", 6],
    ["nodePlans", 5],
    ["stateSchema", 5],
    ["randomEvents", 2],
    ["endings", 3],
  ];

  for (const [key, expected] of exactLengths) {
    if (!Array.isArray(outline?.[key])) {
      issues.push(`${key} 必须是数组`);
      continue;
    }
    if (outline[key].length < expected) {
      issues.push(`${key} 数量不足，需要 ${expected} 个，实际 ${outline[key].length} 个`);
    }
  }

  const placeholderPattern = /^(event_slug|role_id|npc_id|node_id|state_key|timeline_1|random_1|ending_1)$/i;
  for (const key of ["id", "title", "period", "theme"]) {
    if (!outline?.[key] || placeholderPattern.test(String(outline[key]))) {
      issues.push(`${key} 为空或仍是模板占位符`);
    }
  }

  const roles = Array.isArray(outline?.roles) ? outline.roles : [];
  const npcs = Array.isArray(outline?.npcs) ? outline.npcs : [];
  const nodePlans = Array.isArray(outline?.nodePlans) ? outline.nodePlans : [];
  const stateSchema = Array.isArray(outline?.stateSchema) ? outline.stateSchema : [];
  const roleIds = new Set(roles.map((role) => role?.id).filter(Boolean));
  const npcIds = new Set(npcs.map((npc) => npc?.id).filter(Boolean));
  const nodeIds = new Set(nodePlans.map((node) => node?.id).filter(Boolean));
  const stateKeys = new Set(stateSchema.map((item) => item?.key).filter(Boolean));

  if (roleIds.size < roles.length) issues.push("roles 中存在空 id 或重复 id");
  if (npcIds.size < npcs.length) issues.push("npcs 中存在空 id 或重复 id");
  if (nodeIds.size < nodePlans.length) issues.push("nodePlans 中存在空 id 或重复 id");
  if (stateKeys.size < stateSchema.length) issues.push("stateSchema 中存在空 key 或重复 key");

  for (const role of roles) {
    if (!role?.id || placeholderPattern.test(String(role.id))) issues.push("roles 中存在模板 role_id");
    const playableNodeIds = Array.isArray(role?.playableNodeIds) ? role.playableNodeIds : [];
    if (!playableNodeIds.length) issues.push(`角色 ${role?.id || "unknown"} 缺少 playableNodeIds`);
    for (const nodeId of playableNodeIds) {
      if (!nodeIds.has(nodeId)) issues.push(`角色 ${role?.id} 的 playableNodeIds 引用了不存在的节点 ${nodeId}`);
    }
  }

  for (const npc of npcs) {
    if (!npc?.id || placeholderPattern.test(String(npc.id))) issues.push("npcs 中存在模板 npc_id");
  }

  for (const nodePlan of nodePlans) {
    if (!nodePlan?.id || placeholderPattern.test(String(nodePlan.id))) issues.push("nodePlans 中存在模板 node_id");
    const playableRoleIds = Array.isArray(nodePlan?.playableRoleIds) ? nodePlan.playableRoleIds : [];
    const availableNpcIds = Array.isArray(nodePlan?.availableNpcIds) ? nodePlan.availableNpcIds : [];
    if (playableRoleIds.length !== 2) issues.push(`节点 ${nodePlan?.id || "unknown"} 必须有 2 个 playableRoleIds`);
    if (availableNpcIds.length !== 2) issues.push(`节点 ${nodePlan?.id || "unknown"} 必须有 2 个 availableNpcIds`);
    for (const roleId of playableRoleIds) {
      if (!roleIds.has(roleId)) issues.push(`节点 ${nodePlan?.id} 引用了不存在的角色 ${roleId}`);
    }
    for (const npcId of availableNpcIds) {
      if (!npcIds.has(npcId)) issues.push(`节点 ${nodePlan?.id} 引用了不存在的 NPC ${npcId}`);
    }
  }

  const defaultState = outline?.defaultState && typeof outline.defaultState === "object" ? outline.defaultState : {};
  for (const key of stateKeys) {
    if (!(key in defaultState)) issues.push(`defaultState 缺少状态 key：${key}`);
  }

  return [...new Set(issues)];
}

function buildFinalConfig(outline, nodes) {
  return {
    id: outline.id || slugify(outline.title),
    title: outline.title || "生成的历史互动叙事",
    period: outline.period || "历史时期",
    intro: outline.intro || "",
    theme: outline.theme || "",
    assets: {
      coverImage: "",
      defaultBackground: "",
      sceneBackgrounds: {},
      portraits: {},
      endingBackgrounds: {},
    },
    timeline: Array.isArray(outline.timeline) ? outline.timeline : [],
    roles: Array.isArray(outline.roles) ? outline.roles : [],
    npcs: Array.isArray(outline.npcs) ? outline.npcs : [],
    nodes,
    stateSchema: Array.isArray(outline.stateSchema) ? outline.stateSchema : [],
    defaultState: outline.defaultState && typeof outline.defaultState === "object" ? outline.defaultState : {},
    randomEvents: Array.isArray(outline.randomEvents) ? outline.randomEvents : [],
    endings: Array.isArray(outline.endings) ? outline.endings : [],
  };
}

async function callLlmJsonStageNonStream({ res, stageName, prompt, maxTokens = 5000 }) {
  sendSse(res, "log", { message: `${stageName}：流式长时间无响应，改用非流式请求获取完整 JSON。` });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(`${stageName}：非流式请求超过 4 分钟。`), 240_000);
  let waitingHeartbeat = null;
  let heartbeatStarted = false;
  let heartbeatEnded = false;

  const stopHeartbeat = () => {
    if (waitingHeartbeat) {
      clearInterval(waitingHeartbeat);
      waitingHeartbeat = null;
    }
    if (heartbeatStarted && !heartbeatEnded) {
      sendSse(res, "heartbeat", { token: "\n" });
      heartbeatEnded = true;
    }
  };

  waitingHeartbeat = setInterval(() => {
    if (!heartbeatStarted) {
      sendSse(res, "heartbeat", { token: `史官正在整理整段文稿（${stageName}）.` });
      heartbeatStarted = true;
      return;
    }
    sendSse(res, "heartbeat", { token: "." });
  }, 1000);

  try {
    const upstream = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        temperature: 0.12,
        max_tokens: maxTokens,
        stream: false,
        messages: [
          { role: "system", content: strictJsonSystemPrompt() },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!upstream.ok) {
      const errorText = await upstream.text();
      throw new Error(`LLM non-stream request failed: ${upstream.status} ${errorText.slice(0, 240)}`);
    }

    const payload = await upstream.json();
    const content = payload?.choices?.[0]?.message?.content ?? payload?.choices?.[0]?.delta?.content ?? "";
    if (!content) throw new Error(`${stageName}：非流式请求没有返回内容。`);

    stopHeartbeat();
    clearTimeout(timeout);
    sendSse(res, "log", { message: `${stageName}：非流式结果已返回，开始写入调试窗口。` });
    for (let index = 0; index < content.length; index += 1500) {
      sendSse(res, "stage-token", { token: content.slice(index, index + 1500) });
    }
    return content;
  } catch (error) {
    stopHeartbeat();
    clearTimeout(timeout);
    throw error;
  }
}

async function callLlmJsonStage({ res, stageId, stageName, prompt, maxTokens = 5000, maxAttempts = 1 }) {
  sendSse(res, "phase", { id: stageId, message: `${stageName}：开始请求 LLM。` });

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let waitingHeartbeat = null;
    let heartbeatStarted = false;
    let heartbeatEnded = false;
    let firstTokenSeen = false;
    let timeoutReason = "";
    let firstTokenTimer = null;
    let idleTimer = null;
    let overallTimer = null;
    const controller = new AbortController();

    const stopHeartbeat = () => {
      if (waitingHeartbeat) {
        clearInterval(waitingHeartbeat);
        waitingHeartbeat = null;
      }
      if (heartbeatStarted && !heartbeatEnded) {
        sendSse(res, "heartbeat", { token: "\n" });
        heartbeatEnded = true;
      }
    };

    const clearTimers = () => {
      if (firstTokenTimer) clearTimeout(firstTokenTimer);
      if (idleTimer) clearTimeout(idleTimer);
      if (overallTimer) clearTimeout(overallTimer);
      firstTokenTimer = null;
      idleTimer = null;
      overallTimer = null;
    };

    const abortStage = (reason) => {
      timeoutReason = reason;
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
    };

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => abortStage(`${stageName}：75 秒没有收到新数据。`), 75_000);
    };

    waitingHeartbeat = setInterval(() => {
      if (!heartbeatStarted) {
        sendSse(res, "heartbeat", { token: `史官正在谋篇布局中（${stageName}，第 ${attempt} 次）.` });
        heartbeatStarted = true;
        return;
      }
      sendSse(res, "heartbeat", { token: "." });
    }, 1000);

    firstTokenTimer = setTimeout(() => abortStage(`${stageName}：45 秒内没有收到第一个 token。`), 45_000);
    overallTimer = setTimeout(() => abortStage(`${stageName}：单段生成超过 4 分钟。`), 240_000);
    resetIdleTimer();

    try {
      if (attempt > 1) {
        sendSse(res, "log", { message: `${stageName}：正在自动重试第 ${attempt} 次。` });
      }

      const upstream = await fetch(`${apiBaseUrl}/chat/completions`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          temperature: 0.12,
          max_tokens: maxTokens,
          stream: true,
          messages: [
            { role: "system", content: strictJsonSystemPrompt() },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!upstream.ok) {
        const errorText = await upstream.text();
        throw new Error(`LLM request failed: ${upstream.status} ${errorText.slice(0, 240)}`);
      }
      if (!upstream.body) throw new Error("LLM response body is empty.");

      const decoder = new TextDecoder();
      let buffer = "";
      let tokenCount = 0;
      let raw = "";

      for await (const chunk of upstream.body) {
        resetIdleTimer();
        buffer += decoder.decode(chunk, { stream: true });
        buffer = buffer.replace(/\r\n/g, "\n");
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const dataLines = part
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.replace(/^data:\s*/, ""));

          for (const dataLine of dataLines) {
            if (dataLine === "[DONE]") {
              stopHeartbeat();
              clearTimers();
              sendSse(res, "log", { message: `${stageName}：LLM 流式输出结束。` });
              return raw;
            }

            try {
              const payload = JSON.parse(dataLine);
              const token = payload?.choices?.[0]?.delta?.content ?? payload?.choices?.[0]?.message?.content ?? "";
              if (token) {
                if (!firstTokenSeen) {
                  firstTokenSeen = true;
                  if (firstTokenTimer) clearTimeout(firstTokenTimer);
                  firstTokenTimer = null;
                }
                stopHeartbeat();
                tokenCount += 1;
                raw += token;
                if (tokenCount % 80 === 0) {
                  sendSse(res, "log", { message: `${stageName}：已接收 ${tokenCount} 个 token 片段。` });
                }
                sendSse(res, "stage-token", { token });
              }
            } catch {
              if (!firstTokenSeen) {
                firstTokenSeen = true;
                if (firstTokenTimer) clearTimeout(firstTokenTimer);
                firstTokenTimer = null;
              }
              stopHeartbeat();
              raw += dataLine;
              sendSse(res, "stage-token", { token: dataLine });
            }
          }
        }
      }

      stopHeartbeat();
      clearTimers();
      if (raw) return raw;
      throw new Error(`${stageName}：连接结束但没有收到内容。`);
    } catch (error) {
      stopHeartbeat();
      clearTimers();
      const message = timeoutReason || (error instanceof Error ? error.message : String(error));
      if (attempt < maxAttempts) {
        sendSse(res, "log", { message: `${message} 准备自动重试。` });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
      sendSse(res, "log", { message: `${message} 不再生成替代内容，改用同一 prompt 的非流式请求。` });
      return await callLlmJsonStageNonStream({ res, stageName, prompt, maxTokens });
    }
  }

  throw new Error(`${stageName}：请求失败。`);
}

async function handleGenerateStreamMulti(req, res) {
  const { sourceText = "" } = await readBody(req);
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  try {
    sendSse(res, "log", { message: "连接生成服务，准备分段请求 LLM。" });
    sendSse(res, "phase", { id: "input", message: "已读取历史事件输入。" });

    let outline = null;
    let outlineIssues = [];
    for (let outlineAttempt = 1; outlineAttempt <= 2; outlineAttempt += 1) {
      const retryReason = outlineIssues.length ? outlineIssues.slice(0, 8).join("；") : "";
      const outlineRaw = await callLlmJsonStage({
        res,
        stageId: "timeline",
        stageName: `总纲、角色、时间线${outlineAttempt > 1 ? `（第 ${outlineAttempt} 次）` : ""}`,
        prompt: buildOutlinePrompt(sourceText, retryReason),
        maxTokens: 9000,
      });
      outline = await parseStageJsonWithRepair({
        res,
        raw: outlineRaw,
        stageName: "总纲",
        schemaHint:
          "HistWeaver outline object with id,title,period,intro,theme,timeline,roles,npcs,nodePlans,stateSchema,defaultState,randomEvents,endings",
      });
      outlineIssues = validateOutline(outline);
      if (!outlineIssues.length) break;
      sendSse(res, "log", {
        message: `总纲结构不完整：${outlineIssues.slice(0, 6).join("；")}。${outlineAttempt < 2 ? "准备重新生成总纲。" : ""}`,
      });
    }

    if (outlineIssues.length) {
      throw new Error(`总纲结构不完整：${outlineIssues.slice(0, 10).join("；")}`);
    }

    const nodePlans = Array.isArray(outline.nodePlans) ? outline.nodePlans.slice(0, 5) : [];
    if (!nodePlans.length) throw new Error("总纲没有生成 nodePlans，无法继续。");

    const nodes = [];
    for (let index = 0; index < nodePlans.length; index += 1) {
      const nodePlan = nodePlans[index];
      const nodeRaw = await callLlmJsonStage({
        res,
        stageId: index < 2 ? "nodes" : index < 4 ? "script" : "inquiry",
        stageName: `节点 ${index + 1}/${nodePlans.length}：${nodePlan.title || nodePlan.id}`,
        prompt: buildNodePrompt(outline, nodePlan),
        maxTokens: 5200,
      });
      nodes.push(
        await parseStageJsonWithRepair({
          res,
          raw: nodeRaw,
          stageName: `节点 ${index + 1}`,
          schemaHint: "StoryNode object with id,title,year,location,background,conflict,availableNPCs,fixedScript,decisions,nodeIntroForRoles,shortContext,detailedContext,glossary",
        }),
      );
    }

    const finalConfig = buildFinalConfig(outline, nodes);
    const finalText = JSON.stringify(finalConfig, null, 2);
    sendSse(res, "phase", { id: "runtime", message: "分段生成完成，后端已组装 HistoricalGameConfig。" });
    sendSse(res, "log", { message: `最终配置 ${finalText.length} 字符，开始发送给前端解析保存。` });

    for (let index = 0; index < finalText.length; index += 3000) {
      sendSse(res, "token", { token: finalText.slice(index, index + 3000) });
    }

    sendSse(res, "done", { message: "分段生成结束。" });
    res.end();
  } catch (error) {
    sendSse(res, "error", { message: error instanceof Error ? error.message : String(error) });
    res.end();
  }
}

async function handleSaveConfig(req, res) {
  const { config, rawText = "", usedMock = false } = await readBody(req);
  if (!config || typeof config !== "object") {
    sendJson(res, 400, { error: "config is required." });
    return;
  }

  await mkdir(outputDir, { recursive: true });
  const id = slugify(config.id || config.title);
  const jsonPath = path.join(outputDir, `${id}.json`);
  const rawPath = path.join(outputDir, `${id}.raw.txt`);
  const payload = {
    savedAt: new Date().toISOString(),
    usedMock,
    config,
  };

  await writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  if (rawText) await writeFile(rawPath, rawText, "utf8");

  sendJson(res, 200, {
    id,
    filePath: jsonPath,
    rawPath: rawText ? rawPath : "",
  });
}

async function handleSaveFailedRaw(req, res) {
  const { rawText = "", error = "", sourceText = "" } = await readBody(req);
  if (!rawText) {
    sendJson(res, 400, { error: "rawText is required." });
    return;
  }

  await mkdir(outputDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const id = `failed-${stamp}`;
  const rawPath = path.join(outputDir, `${id}.raw.txt`);
  const metaPath = path.join(outputDir, `${id}.error.json`);

  await writeFile(rawPath, rawText, "utf8");
  await writeFile(
    metaPath,
    `${JSON.stringify({ savedAt: new Date().toISOString(), error, sourceText }, null, 2)}\n`,
    "utf8",
  );

  sendJson(res, 200, { id, rawPath, metaPath });
}

async function handleListConfigs(_req, res) {
  try {
    await mkdir(outputDir, { recursive: true });
    const files = (await readdir(outputDir)).filter((file) => file.endsWith(".json"));
    const configs = [];
    for (const file of files) {
      const content = await readFile(path.join(outputDir, file), "utf8");
      const parsed = JSON.parse(content);
      if (parsed?.config) configs.push(parsed.config);
    }
    sendJson(res, 200, { configs });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    });
    res.end();
    return;
  }

  try {
    if (req.method === "POST" && req.url === "/api/pipeline/generate-stream") {
      await handleGenerateStreamMulti(req, res);
      return;
    }
    if (req.method === "POST" && req.url === "/api/configs/save") {
      await handleSaveConfig(req, res);
      return;
    }
    if (req.method === "POST" && req.url === "/api/configs/save-failed-raw") {
      await handleSaveFailedRaw(req, res);
      return;
    }
    if (req.method === "GET" && req.url === "/api/configs") {
      await handleListConfigs(req, res);
      return;
    }
    sendJson(res, 404, { error: "Not found." });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[histweaver-api] listening on http://127.0.0.1:${port}`);
  console.log(`[histweaver-api] generated configs: ${outputDir}`);
});
