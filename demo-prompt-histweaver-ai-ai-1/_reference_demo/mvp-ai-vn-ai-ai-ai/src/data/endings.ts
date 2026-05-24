import type { EndingDefinition } from "../types";
import { sceneAssets } from "./assets";

export const endings: EndingDefinition[] = [
  {
    id: "history_reenacted",
    title: "历史重演",
    subtitle: "潼关失守，马嵬坡留下无法挽回的伤口",
    backgroundImage: sceneAssets.lingwu,
    closeoutLines: [
      {
        id: "end-history-1",
        speaker: null,
        type: "narration",
        text: "队伍继续往蜀地走，长安在烟尘里陷落。唐玄宗保住了性命，却失去了盛世最后的光。",
        backgroundImage: sceneAssets.lingwu,
        mood: "tragic"
      },
      {
        id: "end-history-2",
        speaker: null,
        type: "narration",
        text: "太子李亨在北方得到越来越多支持。大唐还会反攻，但再也回不到开元年间那种从容的日子。",
        backgroundImage: sceneAssets.lingwu,
        mood: "calm"
      }
    ],
    description:
      "你的选择大体沿着正史前进：潼关失败导致长安失守，马嵬坡以杨贵妃之死换取禁军继续护驾。大唐得以延续，但皇帝威望和中央控制力被严重削弱。",
    historicalComparison:
      "正史中，哥舒翰被迫出关大败，杨贵妃死于马嵬坡，肃宗随后在灵武即位。这个结局与历史主线最接近。",
    deviationLabel: "低偏离"
  },
  {
    id: "tongguan_held_changan_saved",
    title: "潼关守住，长安暂时安全",
    subtitle: "一次拒绝出关，换来了帝国喘息的时间",
    backgroundImage: sceneAssets.tongguan,
    closeoutLines: [
      {
        id: "end-tongguan-1",
        speaker: null,
        type: "narration",
        text: "潼关没有打开。叛军在关前久攻不下，补给线被越拖越长。",
        backgroundImage: sceneAssets.tongguan,
        mood: "hopeful"
      },
      {
        id: "end-tongguan-2",
        speaker: null,
        type: "narration",
        text: "长安还是紧张，但没有马上陷落。朝廷终于有时间整军、清查边镇，也重新考虑宰相的权力。",
        backgroundImage: sceneAssets.palace,
        mood: "hopeful"
      }
    ],
    description:
      "你让军事判断压过了催战命令，并成功维持了最低限度的政治信任。潼关守住后，叛军攻势放缓，帝国有机会以较小代价重整。",
    historicalComparison:
      "正史中潼关没有守住，长安很快失陷。这个结局是明显的反事实，但建立在哥舒翰原本主张坚守的历史逻辑之上。",
    deviationLabel: "高偏离"
  },
  {
    id: "tongguan_political_failure",
    title: "潼关输给了政治互疑",
    subtitle: "战场还没崩，信任先崩了",
    backgroundImage: sceneAssets.changanFall,
    closeoutLines: [
      {
        id: "end-political-1",
        speaker: null,
        type: "narration",
        text: "潼关的军阵还没真正被打垮，长安和前线之间的信任却先一步破裂。",
        backgroundImage: sceneAssets.tongguan,
        mood: "tragic"
      },
      {
        id: "end-political-2",
        speaker: null,
        type: "narration",
        text: "将领互相猜疑，命令反复变化。叛军没有立刻赢下一场大战，却等来了唐军内部的裂缝。",
        backgroundImage: sceneAssets.changanFall,
        mood: "tragic"
      }
    ],
    description:
      "你试图改变潼关命运，但没有解决前线军事判断和长安政治压力之间的冲突。防线在猜忌、催战和问罪中失稳，长安仍然难逃陷落。",
    historicalComparison:
      "正史的失败来自错误催战和战场溃败；这个结局把失败提前放在政治信任层面，仍符合天宝后期朝政失衡的逻辑。",
    deviationLabel: "中偏离"
  },
  {
    id: "maweipo_mutiny_expanded",
    title: "马嵬坡兵变扩大",
    subtitle: "队伍停在雨里，皇帝的命令失去了重量",
    backgroundImage: sceneAssets.maweipo,
    closeoutLines: [
      {
        id: "end-mutiny-1",
        speaker: null,
        type: "narration",
        text: "驿站外的喊声压过了军令。陈玄礼再也无法把禁军压回队列。",
        backgroundImage: sceneAssets.maweipo,
        mood: "urgent"
      },
      {
        id: "end-mutiny-2",
        speaker: null,
        type: "narration",
        text: "唐玄宗仍在车队里，却第一次清楚意识到，皇帝的命令也会在饥饿和愤怒面前失去力量。",
        backgroundImage: sceneAssets.maweipo,
        mood: "tragic"
      }
    ],
    description:
      "你没有给禁军一个足以平息众怒的结果，或者试图用欺骗、强压维持旧局。兵变扩大后，唐玄宗的实际控制力迅速崩塌，太子和军中将领被迫接管局面。",
    historicalComparison:
      "正史中马嵬坡兵变被控制在处置杨氏的范围内，队伍随后继续西行。这个结局放大了兵变风险，体现军心失控后的连锁反应。",
    deviationLabel: "高危偏离"
  },
  {
    id: "yang_guifei_survives_hidden",
    title: "杨贵妃存活隐藏线",
    subtitle: "白绫留给了众人，真正的人影消失在雨夜",
    backgroundImage: sceneAssets.maweipo,
    closeoutLines: [
      {
        id: "end-yang-1",
        speaker: null,
        type: "narration",
        text: "白绫的故事留给了军中，真正的马蹄声消失在雨夜的小路上。",
        backgroundImage: sceneAssets.maweipo,
        mood: "tense"
      },
      {
        id: "end-yang-2",
        speaker: null,
        type: "narration",
        text: "唐玄宗继续西行，心里多了一个永远不能公开说出的秘密。史书写下死亡，民间却开始流传另一个版本。",
        backgroundImage: sceneAssets.lingwu,
        mood: "tragic"
      }
    ],
    description:
      "你冒着极高风险制造了假死局面，让杨贵妃从正史中的死亡点脱身。禁军得到看得见的交代，皇帝却从此背负无法公开的政治秘密。",
    historicalComparison:
      "正史记载杨贵妃死于马嵬坡。这个隐藏线借用了民间传说的想象空间，但仍要求成功骗过禁军并承担政治代价。",
    deviationLabel: "隐藏偏离"
  },
  {
    id: "suzong_early_power",
    title: "肃宗提前掌权",
    subtitle: "太子先稳住了军心，也提前拿到了主动权",
    backgroundImage: sceneAssets.lingwu,
    closeoutLines: [
      {
        id: "end-suzong-1",
        speaker: null,
        type: "narration",
        text: "禁军接受了新的安排，但他们看向太子的目光已经不同。谁能安抚军心，谁就能汇聚权力。",
        backgroundImage: sceneAssets.maweipo,
        mood: "calm"
      },
      {
        id: "end-suzong-2",
        speaker: null,
        type: "narration",
        text: "灵武的旗帜比正史更早升起。唐玄宗仍是父皇，但帝国的重心已经开始转向北方。",
        backgroundImage: sceneAssets.lingwu,
        mood: "hopeful"
      }
    ],
    description:
      "你用折中方案暂时稳住马嵬坡，却也让太子和军方成为新秩序的核心。大唐反攻可能更早整合，但唐玄宗的权威提前旁落。",
    historicalComparison:
      "正史中李亨在灵武即位，形成父子两套权力。这个结局让权力转移更早、更顺滑，也更明确。",
    deviationLabel: "中高偏离"
  },
  {
    id: "an_lushan_expanded",
    title: "安禄山叛乱扩大线",
    subtitle: "中央失序，更多地方开始观望",
    backgroundImage: sceneAssets.frontier,
    closeoutLines: [
      {
        id: "end-an-1",
        speaker: null,
        type: "narration",
        text: "唐军在几个关键节点连续失序，叛军获得了比正史更大的战略空间。",
        backgroundImage: sceneAssets.frontier,
        mood: "urgent"
      },
      {
        id: "end-an-2",
        speaker: null,
        type: "narration",
        text: "更多州县开始观望，边镇将领也在计算自己的生路。叛乱不再只是安禄山的野心，而成了帝国裂缝的集中爆发。",
        backgroundImage: sceneAssets.changanFall,
        mood: "tragic"
      }
    ],
    description:
      "连续的低威望、低军心和高民怨让叛乱获得扩张窗口。中央无法组织有效反击，地方势力开始重新选择站队。",
    historicalComparison:
      "正史中唐廷虽遭重创，但仍能依靠朔方、河西和地方力量反攻。这个结局中中央协调能力更差，战乱范围扩大。",
    deviationLabel: "恶化偏离"
  },
  {
    id: "reform_success_costly",
    title: "改革成功，但代价巨大",
    subtitle: "旧局被打破，新秩序带着伤口开始",
    backgroundImage: sceneAssets.palace,
    closeoutLines: [
      {
        id: "end-reform-1",
        speaker: null,
        type: "narration",
        text: "危机没有立刻吞没朝廷，却逼它承认旧有的用人、边镇和外戚结构都已经不能再维持。",
        backgroundImage: sceneAssets.palace,
        mood: "hopeful"
      },
      {
        id: "end-reform-2",
        speaker: null,
        type: "narration",
        text: "新的军政约束开始推行，很多人因此失势，也有很多人死在改革真正开始之前。",
        backgroundImage: sceneAssets.lingwu,
        mood: "calm"
      }
    ],
    description:
      "你在高风险节点保住了部分关键人物或制度弹性，但代价是皇权威望、军心和朝局信任被严重消耗。改革得以启动，却不再有盛世时期的从容。",
    historicalComparison:
      "正史中的唐廷在战后也逐渐面对藩镇、财政和军制问题。这个结局把改革压力提前集中爆发，成功更早，伤口也更深。",
    deviationLabel: "高代价偏离"
  }
];

export const getEnding = (endingId: string) => endings.find((ending) => ending.id === endingId);
