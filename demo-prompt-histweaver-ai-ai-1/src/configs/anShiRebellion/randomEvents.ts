import type { RandomEventRule } from "../../types";

export const randomEvents: RandomEventRule[] = [
  {
    id: "troop-accepts-compromise",
    title: "军心是否接受妥协",
    description: "军队是否愿意暂时服从安排，取决于军心、民怨和政治信任。",
    relatedStateKeys: ["militaryMorale", "factionTrust", "centralAuthority"],
    probabilityFormulaDescription: "军心、政治信任和中央权威越高，妥协越可能成功；民怨会间接压低信任。",
    successText: "队伍里仍有人不满，但将领压住了声音。命令还能传下去，只是每个人都知道，裂缝没有消失。",
    failureText: "人群没有散开，抱怨变成了喊声。有人开始要求立刻给出交代，再拖下去，护驾队伍会先乱。",
    successEffects: { militaryMorale: 6, factionTrust: 4, publicResentment: -5 },
    failureEffects: { militaryMorale: -8, factionTrust: -8, publicResentment: 10 },
  },
  {
    id: "message-breaks-through",
    title: "消息是否送达",
    description: "关键消息能否穿过混乱道路，取决于军心、中央权威和局势稳定度。",
    relatedStateKeys: ["militaryMorale", "centralAuthority"],
    probabilityFormulaDescription: "军心和中央权威越高，基层越愿意冒险送信。",
    successText: "信使绕过乱军，把消息送到了该到的人手里。它不能立刻改变大势，却让下一步选择少了一点黑暗。",
    failureText: "信使没能回来。路上到处是散兵和流言，没人知道消息是丢了，还是被人故意压住。",
    successEffects: { factionTrust: 6, historicalDrift: 4 },
    failureEffects: { factionTrust: -6, historicalDrift: 8 },
  },
];
