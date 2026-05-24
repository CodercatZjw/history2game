import type { PlayableRole } from "../../types";
import { assets } from "./assets";

const allNodes = ["shadow-court", "frontier-break", "tong-pass", "mawei-crisis", "new-center"];

export const roles: PlayableRole[] = [
  {
    id: "emperor",
    name: "唐玄宗",
    identity: "大唐皇帝，仍握有最高名义权力，但判断越来越依赖身边人。",
    goal: "保住朝廷威望，尽量避免局势全面崩塌。",
    dilemma: "你能下令，却未必还能让所有人相信你的命令。",
    visibleInfo: ["边镇兵力过重", "朝中互相猜疑", "前线消息常被修饰后送来"],
    hiddenMotivation: "不愿承认盛世已经失控，也不愿公开切割身边亲近的人。",
    portraitImage: assets.portraits.emperor,
    initialStateModifiers: { centralAuthority: 8, factionTrust: -4 },
    playableNodeIds: allNodes,
    routeDescription: "最高权力视角：你能调动资源，但每一次犹豫都会被别人解释成软弱。",
  },
  {
    id: "consort",
    name: "杨贵妃",
    identity: "宫廷中心的人物，被爱护，也被许多人当成怨气的出口。",
    goal: "在权力倾轧中保住自己和亲族，判断谁还愿意出手。",
    dilemma: "你离权力很近，却不能直接指挥军队；别人谈局势时，常把责任推到你身上。",
    visibleInfo: ["宫中气氛紧绷", "杨国忠树敌很多", "皇帝仍想保护你"],
    hiddenMotivation: "希望有人承认危机不是一个人造成的，但也知道怨气需要一个出口。",
    portraitImage: assets.portraits.consort,
    initialStateModifiers: { publicResentment: 8, factionTrust: -6 },
    playableNodeIds: allNodes,
    routeDescription: "被牺牲者视角：你看见权力如何寻找替罪羊，也要寻找有限的生路。",
  },
  {
    id: "commander",
    name: "哥舒翰",
    identity: "前线将领，守着关键关隘，清楚兵力与地形的真实风险。",
    goal: "守住防线，避免被朝廷命令逼进不利战场。",
    dilemma: "你知道该守，但抗命会被说成怯战；出战则可能把屏障交出去。",
    visibleInfo: ["关隘地形有利于防守", "叛军气势很强", "朝中有人急于逼你进攻"],
    hiddenMotivation: "宁愿承担骂名，也不想让军队在错误时机被消耗干净。",
    portraitImage: assets.portraits.commander,
    initialStateModifiers: { militaryMorale: 8, factionTrust: -2 },
    playableNodeIds: allNodes,
    routeDescription: "前线军事视角：你知道真实战况，但未必能让后方相信。",
  },
  {
    id: "guard",
    name: "禁军士兵",
    identity: "随驾军士，站在命令最底层，也最先承受饥饿、恐惧和怨气。",
    goal: "活下去，并让上面的人给军中一个说法。",
    dilemma: "你需要服从命令，可同袍已经不相信权贵会承担责任。",
    visibleInfo: ["军中补给紧张", "逃亡路上怨气升高", "陈玄礼能影响军心"],
    hiddenMotivation: "想保住同袍，也想知道继续卖命还能换来什么。",
    portraitImage: assets.portraits.guard,
    initialStateModifiers: { militaryMorale: -6, publicResentment: 8 },
    playableNodeIds: allNodes,
    routeDescription: "基层军士视角：你改变不了天下大势，却能影响军心、冲突和个人命运。",
  },
];
