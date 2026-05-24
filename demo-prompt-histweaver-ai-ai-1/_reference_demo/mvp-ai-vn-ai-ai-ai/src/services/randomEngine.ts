import type { GameState, RandomOutcome } from "../types";
import { getRandomEventConfig } from "../data/randomEvents";

export const resolveRandomEvent = (randomEventId: string, state: GameState): RandomOutcome => {
  const config = getRandomEventConfig(randomEventId);
  if (!config) {
    throw new Error(`Unknown random event: ${randomEventId}`);
  }

  const threshold = config.threshold(state);
  const roll = Math.random();
  const success = roll <= threshold;
  const branch = success ? config.success : config.failure;

  return {
    eventId: config.id,
    title: config.title,
    success,
    roll,
    threshold,
    narration: branch.narration,
    systemText: branch.systemText,
    stateEffects: branch.stateEffects,
    endingId: branch.endingId
  };
};

export const formatChance = (value: number) => `${Math.round(value * 100)}%`;
