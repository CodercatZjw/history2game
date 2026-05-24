import type { DialogueBlock, GameState, HistoricalGameConfig, RandomEventRule } from "../types";
import { applyStateEffects } from "./gameEngine";

export interface RandomEventResult {
  rule: RandomEventRule;
  success: boolean;
  text: string;
  effects: GameState;
  dialogue: DialogueBlock;
  nextState: GameState;
}

export function runRandomEvent(
  config: HistoricalGameConfig,
  ruleId: string | undefined,
  state: GameState,
): RandomEventResult | undefined {
  if (!ruleId) return undefined;
  const rule = config.randomEvents.find((item) => item.id === ruleId);
  if (!rule) return undefined;

  const related = rule.relatedStateKeys
    .map((key) => {
      const schema = config.stateSchema.find((item) => item.key === key);
      const value = state[key] ?? schema?.defaultValue ?? 0;
      if (!schema || schema.max === schema.min) return 0.5;
      return (value - schema.min) / (schema.max - schema.min);
    })
    .filter((value) => Number.isFinite(value));

  const score = related.length ? related.reduce((sum, value) => sum + value, 0) / related.length : 0.5;
  const probability = Math.min(0.9, Math.max(0.1, 0.2 + score * 0.6));
  const success = Math.random() < probability;
  const text = success ? rule.successText : rule.failureText;
  const effects = success ? rule.successEffects : rule.failureEffects;

  return {
    rule,
    success,
    text,
    effects,
    nextState: applyStateEffects(config, state, effects),
    dialogue: {
      id: `${rule.id}-${success ? "success" : "failure"}`,
      type: "systemResult",
      speakerName: rule.title,
      text,
    },
  };
}
