import type { TimelineEvent } from "../../types";

export const timeline: TimelineEvent[] = [
  {
    id: "prosperity-shadow",
    year: "天宝年间",
    title: "盛世下的裂缝",
    description: "朝廷表面繁盛，但边镇权力膨胀、朝中派系互斗，危机已经累积。",
    location: "长安与边镇",
    importance: 3,
  },
  {
    id: "rebellion-begins",
    year: "755 年",
    title: "边镇起兵",
    description: "安禄山以讨伐权臣为名起兵，叛军迅速南下。",
    location: "范阳、洛阳方向",
    importance: 5,
  },
  {
    id: "tong-pass",
    year: "756 年",
    title: "潼关转折",
    description: "守关还是出战成为关键。防线一旦崩溃，长安将暴露在叛军面前。",
    location: "潼关",
    importance: 5,
  },
  {
    id: "capital-falls",
    year: "756 年",
    title: "长安失守",
    description: "皇帝西逃，随驾队伍的恐惧、饥饿和怨气迅速升高。",
    location: "长安至蜀道",
    importance: 5,
  },
  {
    id: "mawei",
    year: "756 年",
    title: "马嵬坡危机",
    description: "禁军要求追责，皇帝、权贵与军队之间的信任接近断裂。",
    location: "马嵬坡",
    importance: 5,
  },
  {
    id: "new-power",
    year: "756-763 年",
    title: "新权力中心与平叛后果",
    description: "太子即位组织平叛，战乱最终结束，但地方军权坐大的问题并未消失。",
    location: "灵武、长安与各地",
    importance: 4,
  },
];
