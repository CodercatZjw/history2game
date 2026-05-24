import type { ChoiceOption, DialogueLine, EventRoleView, GameMode, GameState, GameStateKey, StoryEvent } from "../types";
import { getInquirySetup, storyEvents } from "../data/events";

export const initialGameState: GameState = {
  centralAuthority: 62,
  emperorPrestige: 58,
  frontierDiscontent: 74,
  rebellionRisk: 82,
  militaryMorale: 54,
  publicAnger: 66,
  courtCorruption: 78,
  yangGuifeiSafety: 58,
  yangGuozhongPower: 80,
  anLushanAmbition: 90,
  tangMilitaryStrength: 56,
  politicalTrust: 42,
  historyDeviation: 0
};

export const coreStateDisplays: Array<{ key: GameStateKey; label: string; tone: "good" | "bad" | "neutral" }> = [
  { key: "centralAuthority", label: "中央权威", tone: "good" },
  { key: "emperorPrestige", label: "皇帝威望", tone: "good" },
  { key: "militaryMorale", label: "军心", tone: "good" },
  { key: "publicAnger", label: "民怨", tone: "bad" },
  { key: "tangMilitaryStrength", label: "唐军战力", tone: "good" },
  { key: "historyDeviation", label: "历史偏离度", tone: "neutral" }
];

export const detailedStateDisplays: Array<{ key: GameStateKey; label: string; tone: "good" | "bad" | "neutral" }> = [
  ...coreStateDisplays,
  { key: "frontierDiscontent", label: "边镇不满", tone: "bad" },
  { key: "rebellionRisk", label: "叛乱风险", tone: "bad" },
  { key: "courtCorruption", label: "朝政腐败", tone: "bad" },
  { key: "yangGuifeiSafety", label: "贵妃安全", tone: "good" },
  { key: "yangGuozhongPower", label: "杨国忠权势", tone: "bad" },
  { key: "anLushanAmbition", label: "安禄山野心", tone: "bad" },
  { key: "politicalTrust", label: "政治互信", tone: "good" }
];

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const applyStateEffects = (state: GameState, effects: Partial<GameState> = {}): GameState => {
  const next = { ...state };
  Object.entries(effects).forEach(([key, delta]) => {
    const stateKey = key as GameStateKey;
    next[stateKey] = clamp(next[stateKey] + Number(delta ?? 0));
  });
  return next;
};

export const getEventById = (eventId: string): StoryEvent => {
  const event = storyEvents.find((item) => item.id === eventId);
  if (!event) {
    throw new Error(`Unknown story event: ${eventId}`);
  }
  return event;
};

export const getChoiceById = (event: StoryEvent, choiceId: string): ChoiceOption | undefined =>
  event.choices.find((choice) => choice.id === choiceId);

export const getEventRoleView = (event: StoryEvent, roleId: string): Required<EventRoleView> => {
  const roleView = event.roleViews?.[roleId];
  return {
    perspectiveTitle: roleView?.perspectiveTitle ?? event.title,
    objective: roleView?.objective ?? "在当前历史节点中，尽量让局势朝有利于你的方向发展。",
    limitation: roleView?.limitation ?? "你只能根据自己身份能接触到的信息判断，不能提前知道未来。",
    backgroundImage: roleView?.backgroundImage ?? event.backgroundImage,
    defaultInquiryLimit: roleView?.defaultInquiryLimit ?? event.defaultInquiryLimit,
    inquirySetup: roleView?.inquirySetup ?? event.inquirySetup ?? getInquirySetup(event.id, roleId),
    script: roleView?.script ?? event.script,
    inquiryNpcs: roleView?.inquiryNpcs ?? event.inquiryNpcs,
    choices: roleView?.choices ?? event.choices
  };
};

export const makeSystemLine = (
  id: string,
  text: string,
  backgroundImage?: string,
  meta: Pick<DialogueLine, "purpose" | "intent" | "promptHint" | "sourceId"> = {}
): DialogueLine => ({
  id,
  speaker: null,
  text,
  type: "system",
  backgroundImage,
  mood: "calm",
  ...meta
});

export const modeStateAdjustments = (mode: GameMode): Partial<GameState> => {
  if (mode === "historical") {
    return {
      historyDeviation: -4,
      rebellionRisk: 4,
      publicAnger: 4
    };
  }

  return {
    historyDeviation: 6,
    politicalTrust: 4,
    emperorPrestige: 2
  };
};

export const createInitialState = (mode: GameMode) => applyStateEffects(initialGameState, modeStateAdjustments(mode));

export const formatDelta = (delta: number) => {
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
};

export const getStateDiffs = (effects: Partial<GameState>) =>
  Object.entries(effects)
    .filter(([, value]) => Number(value ?? 0) !== 0)
    .map(([key, value]) => ({
      key: key as GameStateKey,
      value: Number(value)
    }));
