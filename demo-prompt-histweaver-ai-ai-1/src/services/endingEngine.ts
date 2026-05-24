import type { EndingRule, GameState, HistoricalGameConfig, PlayableRole } from "../types";

export function resolveEnding(
  config: HistoricalGameConfig,
  state: GameState,
  role: PlayableRole,
  visitedNodeIds: string[],
): EndingRule {
  const sorted = [...config.endings].sort((a, b) => b.priority - a.priority);
  return (
    sorted.find((ending) => {
      if (!ending.condition) return false;
      return ending.condition(state, role, visitedNodeIds);
    }) ?? sorted[sorted.length - 1]
  );
}
