import type { ChatRequest, ChatResponse } from "../types";
import { getNpcProfile } from "../data/npcPrompts";

const selectDecisionAnchor = (request: ChatRequest) => {
  const options = request.decisionOptions ?? [];
  if (options.length === 0) return undefined;

  const keywords = ["坚守", "出关", "决战", "拖延", "上书", "削弱", "赐死", "保护", "出家", "假装", "逃离", "追击", "长安", "太子", "公开", "承认"];
  const matchedKeyword = keywords.find((keyword) => request.message.includes(keyword));
  if (matchedKeyword) {
    const matchedChoice = options.find((choice) => `${choice.label}${choice.description}`.includes(matchedKeyword));
    if (matchedChoice) return matchedChoice;
  }

  const seed = Array.from(`${request.npcId}-${request.eventId}-${request.playerRole}-${request.message}`).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  return options[seed % options.length];
};

const trimReply = (text: string) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= 130) return normalized;
  return `${normalized.slice(0, 126)}……`;
};

const mockDecisionLine = (npcId: string, hasAnchor: boolean) => {
  if (!hasAnchor) return "";
  if (npcId.startsWith("rebel") || npcId === "yan_zhuang") {
    return "可兵和粮都在路上，不能只看眼前的便宜。";
  }
  if (["geshu_han", "field_officer", "scout", "soldier", "frontier_messenger"].includes(npcId)) {
    return "前线现在最怕急令，军心一乱，关门再险也守不稳。";
  }
  return "外面的人已经不听漂亮话，只看眼前有没有交代。";
};

const addressForPlayer = (request: ChatRequest) => {
  if (request.playerRole === "tang_xuanzong") return "皇上";
  if (request.playerRole === "an_lushan") return "大帅";
  if (request.playerRole === "geshu_han") return "老帅";
  if (request.playerRole === "yang_guifei") return "娘子";
  return request.playerRoleName ?? "";
};

const cleanupNpcReply = (reply: string, npcName: string, request: ChatRequest) => {
  const address = addressForPlayer(request);
  const selfNamePattern = new RegExp(npcName, "g");
  let text = trimReply(reply)
    .replace(new RegExp(`${npcName}的`, "g"), "我的")
    .replace(selfNamePattern, "我")
    .replace(/这话说到底，/g, "")
    .replace(/当前抉择/g, "眼下这事")
    .replace(/代价是/g, "难就难在");

  if (address && request.npcId !== request.playerRole && !text.startsWith(address) && !text.startsWith("陛下") && !text.startsWith("皇上")) {
    text = `${address}，${text}`;
  }

  return trimReply(text);
};

const pickMockReply = (request: ChatRequest) => {
  const profile = getNpcProfile(request.npcId);
  if (!profile) {
    return "现在局势太乱，我知道的也有限。真要判断下一步，只能先看军心稳不稳、粮道还能不能撑住，以及长安那边会不会继续逼前线冒险。";
  }

  const seed = Array.from(`${request.eventId}-${request.message}-${request.playerRole}`).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  const base = profile.mockReplies[seed % profile.mockReplies.length];
  const anchor = selectDecisionAnchor(request);
  return cleanupNpcReply(`${base} ${mockDecisionLine(profile.npcId, Boolean(anchor))}`, profile.name, request);
};

export const askNpc = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Chat API failed: ${response.status}`);
    }

    return (await response.json()) as ChatResponse;
  } catch (error) {
    console.warn("Falling back to local mock reply", error);
    return {
      reply: pickMockReply(request),
      mock: true
    };
  }
};
