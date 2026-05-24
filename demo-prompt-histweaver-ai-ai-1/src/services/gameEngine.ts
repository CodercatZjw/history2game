import type {
  DecisionOption,
  DialogueBlock,
  GameState,
  HistoricalGameConfig,
  NPCProfile,
  PlayableRole,
  StoryNode,
} from "../types";

export function clampState(config: HistoricalGameConfig, state: GameState): GameState {
  return Object.fromEntries(
    config.stateSchema.map((variable) => {
      const value = state[variable.key] ?? variable.defaultValue;
      return [variable.key, Math.min(variable.max, Math.max(variable.min, value))];
    }),
  );
}

export function createInitialState(config: HistoricalGameConfig, role: PlayableRole): GameState {
  return applyStateEffects(config, config.defaultState, role.initialStateModifiers);
}

export function applyStateEffects(
  config: HistoricalGameConfig,
  currentState: GameState,
  effects: GameState,
): GameState {
  const next = { ...currentState };
  Object.entries(effects).forEach(([key, value]) => {
    next[key] = (next[key] ?? 0) + value;
  });
  return clampState(config, next);
}

export function getFirstNodeForRole(config: HistoricalGameConfig, role: PlayableRole) {
  const nodeId = role.playableNodeIds[0];
  return getNodeById(config, nodeId);
}

export function getNodeById(config: HistoricalGameConfig, nodeId?: string): StoryNode {
  const node = config.nodes.find((item) => item.id === nodeId);
  if (!node) {
    const fallback = config.nodes[0];
    if (!fallback) {
      throw new Error("HistoricalGameConfig must contain at least one story node.");
    }
    return fallback;
  }
  return node;
}

export function getRoleById(config: HistoricalGameConfig, roleId: string): PlayableRole {
  const role = config.roles.find((item) => item.id === roleId);
  if (!role) {
    throw new Error(`Unknown role id: ${roleId}`);
  }
  return role;
}

export function getNpcById(config: HistoricalGameConfig, npcId: string): NPCProfile | undefined {
  return config.npcs.find((item) => item.id === npcId);
}

export function getScriptForRole(node: StoryNode, role: PlayableRole): DialogueBlock[] {
  return node.fixedScript[role.id] ?? node.fixedScript.common ?? [];
}

export function getAvailableDecisions(node: StoryNode, role: PlayableRole): DecisionOption[] {
  return node.decisions.filter((decision) => decision.allowedRoleIds.includes(role.id));
}

export function getNodeIndexForRole(role: PlayableRole, nodeId: string) {
  return role.playableNodeIds.findIndex((item) => item === nodeId);
}

export function getNextRoleNodeId(role: PlayableRole, currentNodeId: string) {
  const index = getNodeIndexForRole(role, currentNodeId);
  return index >= 0 ? role.playableNodeIds[index + 1] : undefined;
}

export function getSafeDecisionNextNodeId(
  config: HistoricalGameConfig,
  role: PlayableRole,
  currentNode: StoryNode,
  requestedNextNodeId?: string,
) {
  if (requestedNextNodeId) {
    const requestedNode = config.nodes.find((item) => item.id === requestedNextNodeId);
    const roleRouteContainsNode = role.playableNodeIds.includes(requestedNextNodeId);
    const nodeAllowsRole = requestedNode?.playableRoleIds.includes(role.id);
    if (requestedNode && roleRouteContainsNode && nodeAllowsRole) {
      return requestedNextNodeId;
    }
  }

  return getNextRoleNodeId(role, currentNode.id);
}
