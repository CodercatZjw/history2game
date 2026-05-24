import type {
  GameState,
  HistoricalGameConfig,
  NodeNPC,
  NPCProfile,
  PlayableRole,
  StoryNode,
} from "../types";
import { baseRules } from "./baseRules";
import { historicalBoundaryRules } from "./historicalBoundaryRules";
import { outputRules } from "./outputRules";
import { styleRules } from "./styleRules";

interface BuildNpcPromptInput {
  config: HistoricalGameConfig;
  currentNode: StoryNode;
  playerRole: PlayableRole;
  npc: NPCProfile;
  nodeNpcContext: NodeNPC;
  gameState: GameState;
  userMessage: string;
}

export function buildNpcPrompt({
  config,
  currentNode,
  playerRole,
  npc,
  nodeNpcContext,
  gameState,
  userMessage,
}: BuildNpcPromptInput) {
  const stateText = config.stateSchema
    .map((item) => `${item.label}:${gameState[item.key] ?? item.defaultValue}`)
    .join("，");

  const relationship =
    nodeNpcContext.relationshipToPlayerRole[playerRole.id] ?? "关系未明，需要谨慎判断对方意图";

  return [
    baseRules,
    "",
    "【当前历史事件】",
    `${config.title}（${config.period}）`,
    "",
    "【当前节点】",
    `年份：${currentNode.year}`,
    `地点：${currentNode.location}`,
    `节点背景：${currentNode.background}`,
    `冲突：${currentNode.conflict}`,
    `当前局势摘要：${currentNode.shortContext}`,
    "",
    "【玩家扮演角色】",
    `姓名：${playerRole.name}`,
    `身份：${playerRole.identity}`,
    `目标：${playerRole.goal}`,
    `困境：${playerRole.dilemma}`,
    `可见信息：${playerRole.visibleInfo.join("；")}`,
    "",
    "【当前 NPC】",
    `姓名：${npc.name}`,
    `身份与地位：${npc.identity}`,
    `总体立场：${npc.globalStance}`,
    `性格与说话倾向：${npc.personality}`,
    `信息边界：${npc.knowledgeBoundary}`,
    `当前节点立场：${nodeNpcContext.stanceInThisNode}`,
    `当前节点知道的信息：${nodeNpcContext.knowledgeInThisNode}`,
    `与玩家角色的关系：${relationship}`,
    "",
    "【当前状态变量】",
    stateText || "暂无状态变量",
    "",
    "【玩家刚刚问的问题】",
    userMessage,
    "",
    "【历史边界】",
    historicalBoundaryRules,
    "",
    "【输出风格】",
    styleRules,
    "",
    "【输出规则】",
    outputRules,
  ].join("\n");
}
