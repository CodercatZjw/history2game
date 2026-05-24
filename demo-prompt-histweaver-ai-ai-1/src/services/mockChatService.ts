import type { NodeNPC, NPCProfile, PlayableRole, StoryNode } from "../types";

const tones = ["稳住局面", "看清代价", "别急着表态", "先保住能保住的人", "别让消息乱飞"];

export function createMockNpcReply(
  currentNode: StoryNode,
  playerRole: PlayableRole,
  npc: NPCProfile,
  nodeNpcContext: NodeNPC,
  userMessage: string,
) {
  const relation = nodeNpcContext.relationshipToPlayerRole[playerRole.id] ?? "我得先判断你真正想要什么";
  const tone = tones[Math.floor(Math.random() * tones.length)];
  return `你问得正是要害。${relation}，所以我不能把话说满。眼下${currentNode.conflict}，最怕的是一边催、一边瞒。若要${tone}，先看谁会为这个选择付出代价；我能说的，只到这里。`;
}
