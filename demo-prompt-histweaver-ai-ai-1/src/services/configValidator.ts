import type { HistoricalGameConfig } from "../types";

export function validateConfig(config: HistoricalGameConfig): string[] {
  const issues: string[] = [];
  if (!config.id) issues.push("config.id is required.");
  if (!config.title) issues.push("config.title is required.");
  if (!config.roles.length) issues.push("At least one playable role is required.");
  if (!config.nodes.length) issues.push("At least one story node is required.");
  config.roles.forEach((role) => {
    role.playableNodeIds.forEach((nodeId) => {
      if (!config.nodes.some((node) => node.id === nodeId)) {
        issues.push(`Role ${role.id} references missing node ${nodeId}.`);
      }
    });
  });
  config.nodes.forEach((node) => {
    node.availableNPCs.forEach((nodeNpc) => {
      if (!config.npcs.some((npc) => npc.id === nodeNpc.npcId)) {
        issues.push(`Node ${node.id} references missing NPC ${nodeNpc.npcId}.`);
      }
    });
  });
  return issues;
}
