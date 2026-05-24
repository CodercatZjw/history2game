import type { EndingRule } from "../../types";
import { assets } from "./assets";

export const endings: EndingRule[] = [
  {
    id: "structural-reform",
    title: "看见裂缝的人",
    priority: 30,
    conditionDescription: "历史偏离度较高，政治信任或中央权威仍有修复空间。",
    summary: "你没有让危机变成单纯的替罪羊故事，而是把边镇兵权、朝廷误判和军心裂缝都摆上桌面。",
    historyComparison: "正史中战乱虽被平定，但中央权威受损，藩镇问题长期延续。",
    counterfactualExplanation: "这个结局并不代表轻松改写盛唐。即使更早追责与约束军权，财政、地方军事化和朝廷互信仍会长期拉扯。",
    backgroundImage: assets.endingBackgrounds.counterfactual,
    condition: (state) => state.historicalDrift >= 45 && state.factionTrust >= 40,
    endingNarration: [
      {
        id: "ending-reform-1",
        type: "endingNarration",
        speakerName: "旁白",
        text: "战火没有因为一个选择就停止，但你让更多人承认：灾难不是一个名字造成的。有人开始讨论军权、粮道、命令和责任，而不是只寻找最方便的牺牲品。",
      },
    ],
  },
  {
    id: "local-survival",
    title: "局部被改变的命运",
    priority: 20,
    conditionDescription: "历史偏离度较高，但整体权威不足以推动制度修复。",
    summary: "大历史仍按沉重方向前进，但你改变了少数人的生死、证词和关系。",
    historyComparison: "正史中许多个人命运被大叙事吞没，只留下最简化的责任解释。",
    counterfactualExplanation: "这个结局承认个人力量有限。你不能单独修复帝国结构，但能让局部命运不再完全沉默。",
    backgroundImage: assets.endingBackgrounds.survival,
    condition: (state) => state.historicalDrift >= 35,
    endingNarration: [
      {
        id: "ending-survival-1",
        type: "endingNarration",
        speakerName: "旁白",
        text: "大势没有彻底改写，可几封信、几句证词、几次克制改变了某些人的结局。历史仍然沉重，却不再只剩一个声音。",
      },
    ],
  },
  {
    id: "historical-weight",
    title: "盛世转身之后",
    priority: 10,
    conditionDescription: "选择更接近正史，中央权威和军心在危机中明显受损。",
    summary: "叛乱终会被平定，但盛世的自信已经破裂。个人牺牲换来短暂秩序，制度问题继续留下。",
    historyComparison: "这更接近正史轨迹：长安失守、马嵬坡事变、新权力中心出现，战后藩镇问题延续。",
    counterfactualExplanation: "如果只用牺牲解释灾难，局势能暂时稳定，却难以处理造成灾难的深层结构。",
    backgroundImage: assets.endingBackgrounds.historical,
    endingNarration: [
      {
        id: "ending-history-1",
        type: "endingNarration",
        speakerName: "旁白",
        text: "战争后来结束了，可很多东西回不到从前。朝廷还在，威严却被削薄；故事还会被讲起，但讲述者常常只记住最容易理解的那部分。",
      },
    ],
  },
];
