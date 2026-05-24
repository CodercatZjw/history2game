import type { GameState, GameStateVariable } from "../../types";

export const stateSchema: GameStateVariable[] = [
  {
    key: "centralAuthority",
    label: "中央权威",
    description: "朝廷命令被各方接受的程度。",
    min: 0,
    max: 100,
    defaultValue: 62,
  },
  {
    key: "militaryMorale",
    label: "军心",
    description: "军队是否愿意继续服从并承受风险。",
    min: 0,
    max: 100,
    defaultValue: 54,
  },
  {
    key: "publicResentment",
    label: "民怨",
    description: "民间与军中对权贵、战事和逃亡的怨气。",
    min: 0,
    max: 100,
    defaultValue: 46,
  },
  {
    key: "factionTrust",
    label: "政治信任",
    description: "不同派系之间是否还愿意互相信任。",
    min: 0,
    max: 100,
    defaultValue: 42,
  },
  {
    key: "historicalDrift",
    label: "历史偏离度",
    description: "玩家选择偏离正史路径的程度。",
    min: 0,
    max: 100,
    defaultValue: 8,
  },
];

export const defaultState: GameState = Object.fromEntries(
  stateSchema.map((item) => [item.key, item.defaultValue]),
);
