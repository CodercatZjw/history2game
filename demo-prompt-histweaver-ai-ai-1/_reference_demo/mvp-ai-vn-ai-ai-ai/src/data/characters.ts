import type { Character } from "../types";
import { portraitAssets } from "./assets";

export const characters: Character[] = [
  {
    id: "tang_xuanzong",
    name: "唐玄宗",
    identity: "大唐皇帝",
    background: "开元盛世的缔造者，如今却被天宝乱局推到风暴中心。",
    goal: "保住皇权，稳定帝国，并尽量挽回长安局势。",
    dilemma: "宠信杨氏，误判安禄山，军政命令不断失真。",
    portrait: portraitAssets.tangXuanzong,
    accent: "#f0b060"
  },
  {
    id: "an_lushan",
    name: "安禄山",
    identity: "范阳节度使",
    background: "兼领边镇兵权的重臣，在朝廷猜忌与个人野心之间越走越远。",
    goal: "扩大权力，争取主动，避免被朝廷先手清算。",
    dilemma: "一旦被召入长安，生死难测；如果起兵，就再也没有回头路。",
    portrait: portraitAssets.anLushan,
    accent: "#89a7d8"
  },
  {
    id: "geshu_han",
    name: "哥舒翰",
    identity: "潼关守将",
    background: "名将暮年，奉命守住通往长安的最后关门。",
    goal: "守住潼关，拖住叛军，为朝廷争取重整时间。",
    dilemma: "军事判断与朝廷催战相冲突，抗命亦可能先败于政治。",
    portrait: portraitAssets.geshuHan,
    accent: "#9bc29b"
  },
  {
    id: "yang_guifei",
    name: "杨贵妃",
    identity: "贵妃",
    background: "盛宠之下，她既是帝王情感的中心，也是众怒汇聚的象征。",
    goal: "求生，并尽力保护玄宗不被乱局吞没。",
    dilemma: "杨氏一族成为众矢之的，个人命运被军心与朝局撕扯。",
    portrait: portraitAssets.yangGuifei,
    accent: "#e9a3b3"
  }
];

export const getCharacterById = (id: string) => characters.find((character) => character.id === id);
