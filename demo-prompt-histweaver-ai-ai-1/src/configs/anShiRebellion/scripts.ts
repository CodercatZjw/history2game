import type { DialogueBlock } from "../../types";
import { assets } from "./assets";

const bg = assets.sceneBackgrounds;
const p = assets.portraits;

export const scripts: Record<string, Record<string, DialogueBlock[]>> = {
  "shadow-court": {
    emperor: [
      { id: "sc-e-1", type: "narration", text: "长安仍然热闹，奏章上也还写着太平。但你已经听见裂缝的声音：边镇兵太重，朝臣彼此猜疑，所有人都等你表态。", backgroundImage: bg.court },
      { id: "sc-e-2", type: "fixedDialogue", speakerId: "attendant", speakerName: "高力士", portraitImage: p.attendant, text: "陛下，越是太平的时候，越有人不敢说坏消息。可消息不会因为不说就消失。" },
    ],
    consort: [
      { id: "sc-c-1", type: "narration", text: "宫中灯火很亮，可每一次低声交谈都会在你靠近时停住。你知道，有些怨气已经绕过朝堂，落到了你的名字上。", backgroundImage: bg.court },
      { id: "sc-c-2", type: "fixedDialogue", speakerId: "attendant", speakerName: "高力士", portraitImage: p.attendant, text: "娘子，有些人不敢责怪制度，只敢找一个看得见的人。你要先分清，谁是真担心你，谁只是需要一个出口。" },
    ],
    commander: [
      { id: "sc-m-1", type: "narration", text: "你人在前线，却不断收到长安来的催促。纸上的判断很轻，真正要扛住叛军的，是关隘、粮草和士兵的命。", backgroundImage: bg.frontier },
      { id: "sc-m-2", type: "fixedDialogue", speakerId: "scout", speakerName: "斥候", portraitImage: p.scout, text: "将军，边地的兵不是虚数。若真动起来，不是几封诏书就能按住的。" },
    ],
    guard: [
      { id: "sc-g-1", type: "narration", text: "你在宫门外站岗，听见车马、命令和小道消息一起乱飞。上面说天下太平，可军中已经开始问：若真太平，为什么粮饷越来越紧？", backgroundImage: bg.camp },
      { id: "sc-g-2", type: "fixedDialogue", speakerId: "general", speakerName: "陈玄礼", portraitImage: p.general, text: "少说闲话，先把队伍稳住。但你们听见的怨气，我不是不知道。" },
    ],
  },
  "frontier-break": {
    emperor: [
      { id: "fb-e-1", type: "narration", text: "叛乱的消息终于压不住了。有人说这是权臣逼反，有人说这是蓄谋已久。每一种说法背后，都有人想让你承担不同的代价。", backgroundImage: bg.city },
    ],
    consort: [
      { id: "fb-c-1", type: "narration", text: "叛乱爆发后，宫中每一句话都带着刺。有人把战火说成亲族招来的祸，你第一次清楚感到，荣宠也会变成靶子。", backgroundImage: bg.court },
    ],
    commander: [
      { id: "fb-m-1", type: "narration", text: "叛军行动比朝廷预料更快。你需要判断：是立刻和他们硬拼，还是把每一寸险要地形都用到极致。", backgroundImage: bg.pass },
    ],
    guard: [
      { id: "fb-g-1", type: "narration", text: "叛军逼近的消息传来，军中气氛变了。你们不再只是守宫门的人，而是随时可能被推上逃亡路的人。", backgroundImage: bg.camp },
    ],
  },
  "tong-pass": {
    emperor: [
      { id: "tp-e-1", type: "narration", text: "潼关像一道门，门后是长安。有人催你让守将出战，说拖下去会显得朝廷无能；也有人提醒你，一旦门开，就很难再关上。", backgroundImage: bg.pass },
    ],
    consort: [
      { id: "tp-c-1", type: "narration", text: "前线争论传回宫中。你无法直接决定守关或出战，却知道每一次失败都会让怨气更靠近你和你的亲族。", backgroundImage: bg.court },
    ],
    commander: [
      { id: "tp-m-1", type: "narration", text: "你站在潼关，明白地形就是最后的屏障。可朝廷的命令越来越急，仿佛不出战就是不忠。", backgroundImage: bg.pass },
      { id: "tp-m-2", type: "fixedDialogue", speakerId: "commander", speakerName: "哥舒翰", portraitImage: p.commander, text: "守不是怕，守是把叛军拖在他们最难受的地方。若被逼出去，胜负就不在我们手里了。" },
    ],
    guard: [
      { id: "tp-g-1", type: "narration", text: "你听不懂所有军略，但知道一个事实：若潼关守不住，所有人都要跑。上面争论的是战法，你们担心的是活路。", backgroundImage: bg.camp },
    ],
  },
  "mawei-crisis": {
    emperor: [
      { id: "mw-e-1", type: "narration", text: "逃亡路上，雨、饥饿和恐惧把队伍磨得发狠。马嵬坡前，禁军不愿再走，他们要求有人为这一切负责。", backgroundImage: bg.road },
    ],
    consort: [
      { id: "mw-c-1", type: "narration", text: "马嵬坡的喧闹越来越近。你不再只是宫中被宠爱的人，而是军中怒火最容易指向的名字。", backgroundImage: bg.road },
    ],
    commander: [
      { id: "mw-m-1", type: "narration", text: "潼关之后，前线判断已经变成失败的注脚。你看见自己无法挽回大势，却仍要决定怎样留下证词、保住残兵。", backgroundImage: bg.road },
    ],
    guard: [
      { id: "mw-g-1", type: "narration", text: "你和同袍停在马嵬坡。没人想先动刀，可每个人都觉得，如果今天没有交代，明天就会死在路上。", backgroundImage: bg.road },
    ],
  },
  "new-center": {
    emperor: [
      { id: "nc-e-1", type: "narration", text: "新的权力中心出现，平叛开始有了方向。你还活着，但天下已经不再只围着你的诏令转。", backgroundImage: bg.aftermath },
    ],
    consort: [
      { id: "nc-c-1", type: "narration", text: "故事继续向前。有人被写成祸水，有人被写成忠臣，有人沉默地活下去。你关心的是：自己是否只能被当成解释灾难的名字。", backgroundImage: bg.aftermath },
    ],
    commander: [
      { id: "nc-m-1", type: "narration", text: "战乱还会持续多年。守关的失败不是全部原因，却成了关键转折。你要决定，最后留下些什么：辩解、警示，还是新的安排。", backgroundImage: bg.aftermath },
    ],
    guard: [
      { id: "nc-g-1", type: "narration", text: "你活过了逃亡路，也看见新命令从另一个中心发出。战争还没结束，但你知道，军心再也不是可以随意消耗的东西。", backgroundImage: bg.aftermath },
    ],
  },
};
