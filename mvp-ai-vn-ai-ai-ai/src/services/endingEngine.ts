import type { ChoiceOption, GameState, RandomOutcome, StoryEvent } from "../types";
import { getEnding } from "../data/endings";

type EndingContext = {
  event: StoryEvent;
  choice: ChoiceOption;
  state: GameState;
  randomOutcome?: RandomOutcome;
};

export const selectEndingId = ({ event, choice, state, randomOutcome }: EndingContext): string | undefined => {
  if (randomOutcome?.endingId) {
    return randomOutcome.endingId;
  }

  if (choice.endingId) {
    return choice.endingId;
  }

  if (event.id === "maweipo_mutiny") {
    if (choice.id === "execute_yang_guifei") {
      if (state.tangMilitaryStrength < 28 || state.rebellionRisk > 88) {
        return "an_lushan_expanded";
      }
      if (state.politicalTrust < 30 || state.emperorPrestige < 34) {
        return "suzong_early_power";
      }
      return "history_reenacted";
    }

    if (choice.id === "protect_yang_guifei") {
      return state.publicAnger > 70 ? "maweipo_mutiny_expanded" : "reform_success_costly";
    }

    if (choice.id === "make_yang_nun") {
      return state.publicAnger > 64 ? "maweipo_mutiny_expanded" : "suzong_early_power";
    }

    if (choice.id === "fake_death_escape") {
      return state.yangGuifeiSafety > 80 ? "yang_guifei_survives_hidden" : "maweipo_mutiny_expanded";
    }
  }

  if (state.rebellionRisk > 90 && state.centralAuthority < 35) {
    return "an_lushan_expanded";
  }

  if (state.historyDeviation > 55 && state.politicalTrust > 48) {
    return "reform_success_costly";
  }

  return undefined;
};

export const resolveEnding = (endingId: string) => {
  const ending = getEnding(endingId);
  if (!ending) {
    throw new Error(`Unknown ending: ${endingId}`);
  }
  return ending;
};
