import type { DialogueLine, InquiryNpc, InquirySetup, StoryEvent } from "../types";
import { portraitAssets, sceneAssets } from "./assets";

const line = (
  id: string,
  speaker: string | null,
  text: string,
  type: DialogueLine["type"],
  backgroundImage?: string,
  mood?: DialogueLine["mood"],
  meta: Pick<DialogueLine, "purpose" | "intent" | "promptHint" | "sourceId"> = {}
): DialogueLine => ({
  id,
  speaker,
  text,
  type,
  backgroundImage,
  mood,
  ...meta
});

const tongguanNpcs: InquiryNpc[] = [
  {
    id: "tang_xuanzong",
    name: "唐玄宗",
    identity: "长安城里的皇帝",
    attitude: "焦虑、犹豫，一边担心长安，一边不愿承认自己判断错了。",
    portrait: portraitAssets.tangXuanzong
  },
  {
    id: "yang_guozhong",
    name: "杨国忠",
    identity: "宰相",
    attitude: "急着催前线出战，把政治上的不信任压到军事决策上。",
    portrait: portraitAssets.minister
  },
  {
    id: "geshu_han",
    name: "哥舒翰",
    identity: "潼关守将",
    attitude: "坚持防守，清楚现在出关决战非常危险。",
    portrait: portraitAssets.geshuHan
  },
  {
    id: "field_officer",
    name: "部将",
    identity: "前线军官",
    attitude: "更关心士兵、粮草和关外地形，不太理会长安的争吵。",
    portrait: portraitAssets.soldier
  },
  {
    id: "scout",
    name: "斥候",
    identity: "前沿侦察",
    attitude: "只说自己亲眼看见的敌情，不会替任何人粉饰。",
    portrait: portraitAssets.soldier
  },
  {
    id: "soldier",
    name: "士兵",
    identity: "守关士卒",
    attitude: "愿意守关，但害怕被仓促推到关外送死。",
    portrait: portraitAssets.soldier
  }
];

const maweipoNpcs: InquiryNpc[] = [
  {
    id: "yang_guifei",
    name: "杨贵妃",
    identity: "贵妃",
    attitude: "害怕但努力保持平静，知道自己已经成了所有人发泄怒火的对象。",
    portrait: portraitAssets.yangGuifei
  },
  {
    id: "gao_lishi",
    name: "高力士",
    identity: "内侍老臣",
    attitude: "忠于唐玄宗，最担心护送皇帝的队伍会在这里散掉。",
    portrait: portraitAssets.minister
  },
  {
    id: "chen_xuanli",
    name: "陈玄礼",
    identity: "禁军将领",
    attitude: "夹在皇帝和士兵之间，语气沉重，但已经不敢再轻易保证什么。",
    portrait: portraitAssets.soldier
  },
  {
    id: "imperial_guard",
    name: "禁军士兵",
    identity: "疲惫的禁军",
    attitude: "又饿又累又愤怒，想要一个能解释眼前苦难的答案。",
    portrait: portraitAssets.soldier
  },
  {
    id: "li_heng",
    name: "太子李亨",
    identity: "皇太子",
    attitude: "谨慎克制，已经看见权力重新分配的可能。",
    portrait: portraitAssets.tangXuanzong
  },
  {
    id: "tang_xuanzong",
    name: "唐玄宗",
    identity: "逃亡中的皇帝",
    attitude: "疲惫、悲伤，还想保住最后一点皇帝的体面。",
    portrait: portraitAssets.tangXuanzong
  }
];

const rebelNpcs: InquiryNpc[] = [
  {
    id: "yan_zhuang",
    name: "严庄",
    identity: "叛军谋士",
    attitude: "冷静算计，关心政治宣传和长安人心。",
    portrait: portraitAssets.minister
  },
  {
    id: "rebel_general",
    name: "叛军将领",
    identity: "前线将领",
    attitude: "只看战机和伤亡，愿意冒险，但不想白白攻关。",
    portrait: portraitAssets.soldier
  },
  {
    id: "rebel_scout",
    name: "叛军斥候",
    identity: "叛军前沿侦察",
    attitude: "只报告唐军守备、道路和城中风声，不替主帅做决定。",
    portrait: portraitAssets.soldier
  },
  {
    id: "rebel_soldier",
    name: "叛军士兵",
    identity: "普通士兵",
    attitude: "跟着大军南下，既兴奋也害怕，最关心粮草和赏赐。",
    portrait: portraitAssets.soldier
  }
];

const frontierMessenger: InquiryNpc = {
  id: "frontier_messenger",
  name: "前线使者",
  identity: "潼关来的传令使",
  attitude: "带着前线战报入宫，只敢说亲眼见到的军情，不敢公开评判宰相和皇帝。",
  portrait: portraitAssets.soldier
};

const yangPalaceNpcs: InquiryNpc[] = [
  tongguanNpcs[0],
  tongguanNpcs[1],
  {
    id: "gao_lishi",
    name: "高力士",
    identity: "内侍老臣",
    attitude: "看得出宫里风向，提醒杨贵妃不要只依赖宠爱。",
    portrait: portraitAssets.minister
  },
  {
    id: "palace_attendant",
    name: "宫人",
    identity: "宫中侍从",
    attitude: "听见许多流言，但不敢说得太明白。",
    portrait: portraitAssets.yangGuifei
  },
  frontierMessenger
];

const setup = (
  title: string,
  urgency: string,
  question: string,
  suggestedQuestions: InquirySetup["suggestedQuestions"]
): InquirySetup => ({
  title,
  urgency,
  question,
  suggestedQuestions
});

const defaultInquirySetup = setup(
  "先问清楚，再落子",
  "眼前的人各有立场，也各有隐瞒。你未必能问到完整真相，但能听出谁在害怕、谁在催促、谁想把责任推走。",
  "你现在最该问谁？问出口之前，先想清楚这句话是试探、安抚，还是逼对方表态。",
  [
    { text: "你现在最担心的是什么？" },
    { text: "你觉得哪一步最危险？" },
    { text: "如果我照你的意思做，你能承担什么后果？" }
  ]
);

export const inquirySetups: Record<string, Record<string, InquirySetup>> = {
  tongguan_battle: {
    tang_xuanzong: setup(
      "问清前线，再落圣旨",
      "你坐在长安，却要决定潼关守军的生死。杨国忠急着要一个听话的前线，哥舒翰要的是时间，传回来的每句话都带着立场。",
      "在催战之前，你需要先确认：谁在夸大风险，谁在遮掩责任，谁真的知道关外发生了什么。",
      [
        { text: "杨国忠为什么这么急着催战？", npcId: "yang_guozhong" },
        { text: "如果朕暂准坚守，你能接受吗？", npcId: "yang_guozhong" },
        { text: "哥舒翰到底为什么不肯出关？", npcId: "geshu_han" },
        { text: "如果再给你几天，你能守出什么结果？", npcId: "geshu_han" },
        { text: "关外叛军现在有什么动静？", npcId: "scout" },
        { text: "前线士兵现在还能打吗？", npcId: "soldier" }
      ]
    ),
    geshu_han: setup(
      "抗命之前，先摸清军心",
      "你知道出关危险，但长安已经把“不出战”看成“不听命”。前线士兵能不能稳住，朝廷会不会继续信你，决定你能拖多久。",
      "你现在要问的不是大道理，而是：军心还能撑几天，敌情有没有变化，长安那边还有没有解释空间。",
      [
        { text: "如果我继续不出，长安会怎么处置我？", npcId: "tang_xuanzong" },
        { text: "皇上是否还愿意相信前线判断？", npcId: "tang_xuanzong" },
        { text: "你为何非要我出关决战？", npcId: "yang_guozhong" },
        { text: "如果我抗命，你会怎样向长安说？", npcId: "yang_guozhong" },
        { text: "军中粮草和弓弩还能撑几日？", npcId: "field_officer" },
        { text: "士兵愿意继续守关吗？", npcId: "soldier" },
        { text: "叛军最近有什么异动？", npcId: "scout" }
      ]
    ),
    an_lushan: setup(
      "逼开潼关，先看裂缝",
      "潼关硬打很难，但唐廷内部已经开始互相怀疑。你要弄清楚，哪里最容易被撬开：皇帝的恐慌、宰相的私怨，还是守军的疲惫。",
      "你现在的每个问题，都是为了让唐军主动离开地利，而不是让叛军白白撞上关门。",
      [
        { text: "长安是不是已经急了？", npcId: "yan_zhuang" },
        { text: "我们该打军心，还是打城关？", npcId: "yan_zhuang" },
        { text: "强攻潼关要付出多少伤亡？", npcId: "rebel_general" },
        { text: "示弱诱敌这招，前线能演得真实吗？", npcId: "rebel_general" },
        { text: "唐军为什么还不出关？", npcId: "rebel_scout" },
        { text: "军中还愿意继续耗在关前吗？", npcId: "rebel_soldier" }
      ]
    ),
    yang_guifei: setup(
      "宫墙里听风向",
      "你不在潼关，也没有军权。可潼关若败，宫里需要一个能被责怪的人，杨家的名字已经被人放在舌尖上。",
      "你要问清楚：皇上还听得进谁的话，杨国忠会把局势推到哪一步，宫里的人心是不是已经变了。",
      [
        { text: "皇上现在最怕什么？", npcId: "tang_xuanzong" },
        { text: "若我劝你再听前线一次，你会怪我吗？", npcId: "tang_xuanzong" },
        { text: "杨国忠为什么非要前线出战？", npcId: "yang_guozhong" },
        { text: "如果潼关失败，你会把责任推给谁？", npcId: "yang_guozhong" },
        { text: "宫里是不是已经有人怪到杨家身上？", npcId: "palace_attendant" },
        { text: "高力士，宫里现在谁还敢说真话？", npcId: "gao_lishi" },
        { text: "前线使者，哥舒翰到底缺什么？", npcId: "frontier_messenger" }
      ]
    )
  },
  maweipo_mutiny: {
    tang_xuanzong: setup(
      "禁军停下了，皇命也停下了",
      "你仍是皇帝，可驿站外饥饿的禁军已经不再只等命令。杨国忠死了，怒火没有散，下一句话可能决定杨贵妃能不能活。",
      "你必须问清楚：谁还能安抚禁军，谁已经无法退让，杨贵妃还有没有不死的余地。",
      [
        { text: "如果朕让你暂时离队，你愿意吗？", npcId: "yang_guifei" },
        { text: "若局势无法挽回，你最希望朕做什么？", npcId: "yang_guifei" },
        { text: "高力士，现在还有不用杀人的退路吗？", npcId: "gao_lishi" },
        { text: "若让贵妃出家，禁军会不会接受？", npcId: "gao_lishi" },
        { text: "陈玄礼，你还能压住禁军多久？", npcId: "chen_xuanli" },
        { text: "若朕拒绝处置贵妃，你的人会不会失控？", npcId: "chen_xuanli" },
        { text: "你们要怎样的交代才肯继续护驾？", npcId: "imperial_guard" },
        { text: "太子，你能不能替朕稳住队伍？", npcId: "li_heng" }
      ]
    ),
    yang_guifei: setup(
      "所有目光都压到你身上",
      "外面的人不只是恨杨国忠，他们要一个能看见的交代。你越靠近皇上，越容易被认为还在拖住整个队伍。",
      "你要问清楚：谁愿意帮你说话，谁只想让队伍继续走，哪一种退让还有可能换来生路。",
      [
        { text: "高力士还能帮我争取什么？", npcId: "gao_lishi" },
        { text: "若我主动出家，外面会信吗？", npcId: "gao_lishi" },
        { text: "陈将军，禁军是不是已经容不下我？", npcId: "chen_xuanli" },
        { text: "禁军是不是真的只要我死？", npcId: "imperial_guard" },
        { text: "太子殿下，如果我退让，队伍能继续走吗？", npcId: "li_heng" },
        { text: "如果我主动退让，皇上会不会更危险？", npcId: "tang_xuanzong" }
      ]
    ),
    an_lushan: setup(
      "唐廷裂开了，但别让它重新合上",
      "探子说玄宗逃到马嵬坡，禁军逼着皇帝处置杨家。这是机会，也是危险：混乱可能拖垮唐廷，也可能逼出新的权力中心。",
      "你要问清楚：唐军会不会趁乱重组，长安该不该先稳住，追击是不是会把叛军拉得太长。",
      [
        { text: "唐廷会不会在马嵬坡换一个主心骨？", npcId: "yan_zhuang" },
        { text: "我们要不要把太子夺权的风声放出去？", npcId: "yan_zhuang" },
        { text: "我们该追击玄宗，还是先稳住长安？", npcId: "rebel_general" },
        { text: "探子，马嵬坡那边到底乱到什么程度？", npcId: "rebel_scout" },
        { text: "叛军内部还能继续远追吗？", npcId: "rebel_soldier" }
      ]
    ),
    geshu_han: setup(
      "败因会被谁写下",
      "你离马嵬坡很远，却会被那里的怒火重新审判。潼关一败，所有人都想找一个简单答案，而真相往往最先被压住。",
      "你要问清楚：前线证词还能不能送出去，部下能不能保住，长安会怎样把失败写成别人的罪名。",
      [
        { text: "部下还能替我证明什么？", npcId: "field_officer" },
        { text: "潼关败因会被谁改写？", npcId: "scout" },
        { text: "我现在该保人，还是保真相？", npcId: "soldier" },
        { text: "你们叛军会怎样利用潼关败局？", npcId: "rebel_general" }
      ]
    )
  }
};

export const getInquirySetup = (eventId: string, roleId: string): InquirySetup =>
  inquirySetups[eventId]?.[roleId] ?? inquirySetups[eventId]?.default ?? defaultInquirySetup;

export const storyEvents: StoryEvent[] = [
  {
    id: "tongguan_battle",
    chapter: "天宝十五载 · 潼关",
    title: "潼关之战",
    summary: "叛军逼近潼关，长安不断催哥舒翰出关决战。守还是战，一道命令可能改变长安的命运。",
    year: "756",
    backgroundImage: sceneAssets.tongguan,
    defaultInquiryLimit: 3,
    script: [
      line(
        "tg-001",
        null,
        "潼关卡在山河之间，是长安最后一道门。关外烟尘整天不散，叛军的骑兵就压在山谷尽头。",
        "narration",
        sceneAssets.tongguan,
        "tense"
      ),
      line(
        "tg-002",
        null,
        "前线的战报一封封送进长安。城里人心不稳，官员们也慌了。所有人都知道，潼关一破，长安就会暴露在叛军面前。",
        "narration",
        sceneAssets.palace,
        "urgent"
      ),
      line(
        "tg-003",
        "唐玄宗",
        "潼关一直守着不动，长安怎么安心？我需要的是能稳住局面的消息，不是又一封说只能防守的奏报。",
        "dialogue",
        sceneAssets.palace,
        "tense"
      ),
      line(
        "tg-004",
        "杨国忠",
        "皇上，哥舒翰手里有重兵，却一直不肯出关。外面会怎么看？难道朝廷连自己的将领都指挥不动了吗？",
        "dialogue",
        sceneAssets.palace,
        "urgent"
      ),
      line(
        "tg-005",
        "哥舒翰",
        "叛军想要速战，我们就更不能急。现在出关，是把潼关的地利白白送掉，也是在拿长安冒险。",
        "dialogue",
        sceneAssets.tongguan,
        "calm"
      ),
      line(
        "tg-006",
        null,
        "催战的命令到了军营。帐篷里一下安静下来，灯光照在盔甲上，每个人都知道，接下来没有轻松的选择。",
        "narration",
        sceneAssets.tongguan,
        "tense"
      ),
      line(
        "tg-007",
        null,
        "现在可以在决策前询问相关人物。每次询问都会消耗一次机会，机会用完后必须做出选择。",
        "system",
        sceneAssets.tongguan,
        "urgent"
      )
    ],
    inquiryNpcs: tongguanNpcs,
    choices: [
      {
        id: "march_out",
        label: "听从长安命令，出关决战",
        description: "能维护朝廷权威，但会放弃潼关地利，战场风险极高。",
        historicalTag: "正史方向",
        stateEffects: {
          centralAuthority: -20,
          emperorPrestige: -16,
          militaryMorale: -28,
          tangMilitaryStrength: -34,
          publicAnger: 12,
          rebellionRisk: 18,
          politicalTrust: -12,
          historyDeviation: -2
        },
        nextEventId: "maweipo_mutiny",
        resultLines: [
          line(
            "tg-march-001",
            null,
            "关门打开，唐军离开有利地形。车阵和步骑在山道外艰难展开，队伍还没站稳，压力就已经从四面压来。",
            "result",
            sceneAssets.tongguan,
            "urgent"
          ),
          line(
            "tg-march-002",
            null,
            "叛军骑兵从侧翼冲来，旗帜被冲散，鼓声乱成一片。潼关失守的消息，很快传回长安。",
            "result",
            sceneAssets.changanFall,
            "tragic"
          )
        ]
      },
      {
        id: "hold_tongguan",
        label: "坚守潼关，拒绝出关",
        description: "保留军事优势，但要承受来自长安的政治压力。",
        historicalTag: "反事实",
        stateEffects: {
          centralAuthority: -8,
          emperorPrestige: -8,
          militaryMorale: 12,
          tangMilitaryStrength: 14,
          politicalTrust: -14,
          rebellionRisk: -12,
          historyDeviation: 30
        },
        randomEventId: "tongguan_trust_check",
        resultLines: [
          line(
            "tg-hold-001",
            "哥舒翰",
            "如果只看长安的命令，不看眼前的战场，潼关就守不住。责任我来担，但这道关门不能开。",
            "result",
            sceneAssets.tongguan,
            "calm"
          ),
          line(
            "tg-hold-002",
            null,
            "军中先是沉默，随后有人轻轻松了一口气。士兵们知道，至少今晚他们没有被仓促送到关外。",
            "result",
            sceneAssets.tongguan,
            "hopeful"
          )
        ]
      },
      {
        id: "petition_emperor",
        label: "写信给玄宗，请求重新判断",
        description: "争取合法性和时间，但也可能被看成推脱、不敢打。",
        historicalTag: "反事实",
        stateEffects: {
          centralAuthority: -4,
          emperorPrestige: 4,
          militaryMorale: 5,
          tangMilitaryStrength: 6,
          politicalTrust: 10,
          rebellionRisk: -5,
          historyDeviation: 16
        },
        nextEventId: "maweipo_mutiny",
        resultLines: [
          line(
            "tg-petition-001",
            null,
            "信连夜送往长安。哥舒翰没有直接说自己要抗命，只把地形、军心和叛军诱战的迹象一条条写清楚。",
            "result",
            sceneAssets.palace,
            "tense"
          ),
          line(
            "tg-petition-002",
            "唐玄宗",
            "如果前线说的都是真的，就再给他几天。但几天之后，我要看到能让长安安心的结果。",
            "result",
            sceneAssets.palace,
            "calm"
          ),
          line(
            "tg-petition-003",
            null,
            "这几天没能彻底扭转局势，但至少让唐军少打一场仓促的败仗。长安依旧不安，逃亡的阴影已经逼近宫门。",
            "result",
            sceneAssets.changanFall,
            "tragic"
          )
        ]
      },
      {
        id: "delay_secretly",
        label: "假装备战，实际拖延时间",
        description: "用整军备战的名义争取时间；一旦被识破，会同时失去长安和军中的信任。",
        historicalTag: "高风险",
        stateEffects: {
          centralAuthority: -10,
          emperorPrestige: -6,
          militaryMorale: 8,
          tangMilitaryStrength: 10,
          politicalTrust: -18,
          rebellionRisk: -8,
          historyDeviation: 24
        },
        randomEventId: "delay_exposed_check",
        nextEventId: "maweipo_mutiny",
        resultLines: [
          line(
            "tg-delay-001",
            null,
            "军营开始大张旗鼓整理车阵、校验弓弩。使者看见的是忙碌，老兵看见的却是拖延。",
            "result",
            sceneAssets.tongguan,
            "tense"
          ),
          line(
            "tg-delay-002",
            "部将",
            "如果能再拖三天，叛军的补给会更吃紧。只是长安要是看穿了，先来的可能不是敌兵，而是问罪的人。",
            "result",
            sceneAssets.tongguan,
            "urgent"
          )
        ]
      }
    ],
    roleViews: {
      tang_xuanzong: {
        perspectiveTitle: "皇帝视角：长安催战",
        objective: "稳住长安和朝廷权威，同时避免把潼关推向必败。",
        limitation: "你不在前线，只能依靠奏报、宰相和使者判断真实军情。",
        script: [
          line("tg-xz-001", null, "你在长安。地图上的潼关只是一道线，可那道线后面就是京城和你的皇位。", "narration", sceneAssets.palace, "tense"),
          line("tg-xz-002", "杨国忠", "皇上，哥舒翰一直守着不出，外面已经有人说前线不听朝廷了。", "dialogue", sceneAssets.palace, "urgent"),
          line("tg-xz-003", "唐玄宗", "我需要一个能让长安安心的结果。可是催他出关，万一败了，后果也会落到我身上。", "dialogue", sceneAssets.palace, "tense"),
          line("tg-xz-004", null, "你的问题不是单纯打不打，而是怎样在军情、权威和用人错误之间选择最小的损失。", "narration", sceneAssets.palace, "calm"),
          line("tg-xz-005", null, "现在可以询问宫中和前线相关人物。你能问到的不是全部真相，而是他们愿意让皇帝听见的版本。", "system", sceneAssets.palace, "urgent")
        ],
        inquiryNpcs: [tongguanNpcs[1], tongguanNpcs[2], tongguanNpcs[4], tongguanNpcs[5]],
        choices: [
          {
            id: "xz_force_march",
            label: "继续催哥舒翰出关决战",
            description: "维护皇帝命令的权威，但前线将失去潼关地利。",
            historicalTag: "正史方向",
            stateEffects: {
              centralAuthority: -20,
              emperorPrestige: -16,
              militaryMorale: -28,
              tangMilitaryStrength: -34,
              publicAnger: 12,
              rebellionRisk: 18,
              politicalTrust: -12,
              historyDeviation: -2
            },
            nextEventId: "maweipo_mutiny",
            resultLines: [
              line("xz-force-001", null, "催战命令再次送出。长安暂时安静了，潼关却被推向最危险的选择。", "result", sceneAssets.palace, "urgent"),
              line("xz-force-002", null, "不久后，败报传来。你终于明白，皇帝的命令可以让军队出关，却不能让错误变成胜利。", "result", sceneAssets.changanFall, "tragic")
            ]
          },
          {
            id: "xz_allow_hold",
            label: "暂准坚守，要求前线给出期限",
            description: "承认哥舒翰的军事判断，但需要承受朝廷内部的质疑。",
            historicalTag: "反事实",
            stateEffects: {
              centralAuthority: -6,
              emperorPrestige: 4,
              militaryMorale: 10,
              tangMilitaryStrength: 12,
              rebellionRisk: -12,
              politicalTrust: 10,
              historyDeviation: 28
            },
            randomEventId: "tongguan_trust_check",
            resultLines: [
              line("xz-hold-001", "唐玄宗", "告诉哥舒翰，可以继续守。但我要期限，也要能说服长安的战报。", "result", sceneAssets.palace, "calm"),
              line("xz-hold-002", null, "这道命令没有让所有人满意，却让潼关暂时保住了主动权。", "result", sceneAssets.tongguan, "hopeful")
            ]
          },
          {
            id: "xz_clip_yang_power",
            label: "削弱杨国忠对军令的影响",
            description: "把军事判断从宰相私怨中拉出来，但会公开承认朝政出了问题。",
            historicalTag: "反事实",
            stateEffects: {
              centralAuthority: -8,
              emperorPrestige: 6,
              courtCorruption: -18,
              yangGuozhongPower: -28,
              politicalTrust: 18,
              militaryMorale: 8,
              historyDeviation: 32
            },
            endingId: "reform_success_costly",
            resultLines: [
              line("xz-clip-001", null, "你没有立刻撤换杨国忠，但把前线军令交给更多将领共同判断。宫里一片震动。", "result", sceneAssets.palace, "tense"),
              line("xz-clip-002", null, "这不是漂亮的胜利，却让朝廷第一次承认：真正危险的不只是叛军，还有失控的用人和决策。", "result", sceneAssets.palace, "hopeful")
            ]
          },
          {
            id: "xz_double_order",
            label: "明面催战，暗中准许拖延",
            description: "试图同时保住面子和前线地利，但一旦走漏，会让所有人都不再相信你。",
            historicalTag: "高风险",
            stateEffects: {
              centralAuthority: -12,
              emperorPrestige: -8,
              politicalTrust: -14,
              militaryMorale: 8,
              tangMilitaryStrength: 8,
              historyDeviation: 24
            },
            randomEventId: "delay_exposed_check",
            nextEventId: "maweipo_mutiny",
            resultLines: [
              line("xz-double-001", null, "公开命令仍然催战，密信却让前线谨慎行事。你想两边都稳住，却也把信任押在了秘密上。", "result", sceneAssets.palace, "tense")
            ]
          }
        ]
      },
      geshu_han: {
        perspectiveTitle: "守将视角：潼关不能开",
        objective: "守住潼关，用地形和时间拖住叛军。",
        limitation: "你掌握前线军情，却无法控制长安对你的猜疑。",
        script: [
          line("tg-gh-001", null, "你在潼关。关外的叛军不断试探，像是在等你离开这道险关。", "narration", sceneAssets.tongguan, "tense"),
          line("tg-gh-002", "部将", "老帅，长安的使者又来了。还是催我们出关。", "dialogue", sceneAssets.tongguan, "urgent"),
          line("tg-gh-003", "哥舒翰", "他们看的是朝堂脸色，我看的是关外地形。出了这道门，胜负就不是我们说了算。", "dialogue", sceneAssets.tongguan, "calm"),
          line("tg-gh-004", null, "你的处境很清楚：军事上越该守，政治上越像抗命。", "narration", sceneAssets.tongguan, "tense"),
          line("tg-gh-005", null, "现在可以询问前线人员。你能得到真实战场信息，但很难知道长安下一道命令会有多重。", "system", sceneAssets.tongguan, "urgent")
        ],
        inquiryNpcs: [tongguanNpcs[0], tongguanNpcs[1], tongguanNpcs[3], tongguanNpcs[4], tongguanNpcs[5]]
      },
      an_lushan: {
        perspectiveTitle: "叛军视角：逼开潼关",
        objective: "打破潼关，让长安失去最后屏障，同时维持叛军攻势。",
        limitation: "你看不见唐廷内部所有争吵，只能通过探子和降官判断对方裂缝。",
        backgroundImage: sceneAssets.frontier,
        script: [
          line("tg-al-001", null, "你在叛军大营。潼关横在前面，像一扇关上的铁门。门后就是长安。", "narration", sceneAssets.frontier, "tense"),
          line("tg-al-002", "严庄", "唐军守着不出，我们强攻会很难。但长安那边急，他们也许会逼哥舒翰出来。", "dialogue", sceneAssets.frontier, "calm"),
          line("tg-al-003", "安禄山", "那就让他们更急。潼关不一定要硬打，人的疑心有时候比刀更快。", "dialogue", sceneAssets.frontier, "urgent"),
          line("tg-al-004", null, "你的目标不是守住谁，而是利用唐廷的猜疑和急躁，把潼关从内部撬开。", "narration", sceneAssets.frontier, "tense"),
          line("tg-al-005", null, "现在可以询问谋士、前线将领和斥候。你得到的是叛军视角的信息，不会知道唐玄宗心里真正怎么想。", "system", sceneAssets.frontier, "urgent")
        ],
        inquiryNpcs: rebelNpcs,
        choices: [
          {
            id: "al_press_attack",
            label: "持续强攻，制造长安恐慌",
            description: "用军事压力逼唐廷催哥舒翰出关，但叛军也会付出伤亡。",
            historicalTag: "正史方向",
            stateEffects: {
              rebellionRisk: 12,
              anLushanAmbition: 8,
              tangMilitaryStrength: -18,
              militaryMorale: -14,
              publicAnger: 10,
              historyDeviation: 0
            },
            nextEventId: "maweipo_mutiny",
            resultLines: [
              line("al-press-001", null, "叛军不断压向潼关，长安的恐慌被一点点放大。你没有立刻破关，却把唐廷逼得更急。", "result", sceneAssets.frontier, "urgent")
            ]
          },
          {
            id: "al_feign_weakness",
            label: "故意示弱，引唐军出关",
            description: "让探子看见叛军疲态，诱使唐军放弃地利。",
            historicalTag: "高风险",
            stateEffects: {
              anLushanAmbition: 4,
              rebellionRisk: 10,
              tangMilitaryStrength: -24,
              politicalTrust: -14,
              historyDeviation: 16
            },
            nextEventId: "maweipo_mutiny",
            resultLines: [
              line("al-feign-001", null, "你让营火分散、后队故意拖慢。唐军斥候看见了疲态，也把这个消息带回潼关。", "result", sceneAssets.frontier, "tense"),
              line("al-feign-002", null, "真正的刀藏在后面。只要唐军离开关门，局势就会向你倾斜。", "result", sceneAssets.tongguan, "urgent")
            ]
          },
          {
            id: "al_spread_rumor",
            label: "散布杨国忠误国的流言",
            description: "攻击唐廷内部信任，让长安、前线和百姓互相怀疑。",
            historicalTag: "反事实",
            stateEffects: {
              publicAnger: 18,
              politicalTrust: -22,
              courtCorruption: 8,
              rebellionRisk: 14,
              historyDeviation: 22
            },
            nextEventId: "maweipo_mutiny",
            resultLines: [
              line("al-rumor-001", null, "流言比骑兵更快。杨国忠的名字和长安的恐惧绑在一起，唐廷内部的裂缝被你继续撕开。", "result", sceneAssets.changanFall, "tense")
            ]
          },
          {
            id: "al_secure_supply",
            label: "暂缓攻势，先稳住补给",
            description: "降低前线风险，但可能错过逼开潼关的窗口。",
            historicalTag: "反事实",
            stateEffects: {
              rebellionRisk: -8,
              anLushanAmbition: -6,
              militaryMorale: 6,
              tangMilitaryStrength: 10,
              historyDeviation: 30
            },
            endingId: "tongguan_held_changan_saved",
            resultLines: [
              line("al-supply-001", null, "你选择先稳住补给，没有把压力推到极限。叛军少付出了一些代价，也给了唐军喘息的机会。", "result", sceneAssets.frontier, "calm")
            ]
          }
        ]
      },
      yang_guifei: {
        perspectiveTitle: "贵妃视角：宫里的风向",
        objective: "保护玄宗，也尽量让杨家不要继续激化众怒。",
        limitation: "你不掌握军权，能影响的只有皇帝的情绪、宫中信息和少数亲近的人。",
        backgroundImage: sceneAssets.palace,
        script: [
          line("tg-yg-001", null, "你在长安宫里。前线战报送来时，殿外的人声比平时低很多。", "narration", sceneAssets.palace, "tense"),
          line("tg-yg-002", "宫人", "娘子，外面都在说潼关。如果潼关出事，大家可能会把怨气算到杨家头上。", "dialogue", sceneAssets.palace, "urgent"),
          line("tg-yg-003", "杨贵妃", "我没有见过潼关的战场，却能感觉到，宫里每个人都在等一个可以推卸责任的人。", "dialogue", sceneAssets.palace, "tragic"),
          line("tg-yg-004", null, "你的选择不是直接调兵，而是在皇帝、杨国忠和宫中流言之间，尽量给自己和玄宗留后路。", "narration", sceneAssets.palace, "tense"),
          line("tg-yg-005", null, "现在可以询问宫中人物和前线消息。你能知道人心变化，却很难看到完整军情。", "system", sceneAssets.palace, "urgent")
        ],
        inquiryNpcs: yangPalaceNpcs,
        choices: [
          {
            id: "yg_advise_delay",
            label: "劝玄宗暂缓催战",
            description: "以担心长安安危为由，让玄宗再听一次前线判断。",
            historicalTag: "反事实",
            stateEffects: {
              emperorPrestige: 4,
              politicalTrust: 10,
              militaryMorale: 8,
              yangGuifeiSafety: 8,
              rebellionRisk: -8,
              historyDeviation: 24
            },
            nextEventId: "maweipo_mutiny",
            resultLines: [
              line("yg-delay-001", "杨贵妃", "皇上，战场上的人比宫里的人更清楚关外有多险。再听一次哥舒翰，也许不是软弱。", "result", sceneAssets.palace, "calm"),
              line("yg-delay-002", null, "玄宗没有立刻改口，但催战的速度慢了下来。你为前线争到一点时间，也让杨国忠更不满。", "result", sceneAssets.palace, "tense")
            ]
          },
          {
            id: "yg_support_yang",
            label: "支持杨国忠催战",
            description: "维护杨家和宰相权势，但如果前线失败，怨气会更集中。",
            historicalTag: "正史方向",
            stateEffects: {
              yangGuozhongPower: 12,
              yangGuifeiSafety: -16,
              publicAnger: 16,
              politicalTrust: -16,
              tangMilitaryStrength: -24,
              historyDeviation: -2
            },
            nextEventId: "maweipo_mutiny",
            resultLines: [
              line("yg-support-001", null, "你的沉默被当成支持。杨国忠的声音更大，潼关被推向出战。", "result", sceneAssets.palace, "urgent"),
              line("yg-support-002", null, "当败报传来时，宫里看向杨家的目光也变了。", "result", sceneAssets.changanFall, "tragic")
            ]
          },
          {
            id: "yg_distance_family",
            label: "主动和杨国忠切开距离",
            description: "保护自己和玄宗，但会得罪杨家势力。",
            historicalTag: "反事实",
            stateEffects: {
              yangGuifeiSafety: 18,
              yangGuozhongPower: -24,
              publicAnger: -8,
              courtCorruption: -10,
              politicalTrust: 8,
              historyDeviation: 28
            },
            nextEventId: "maweipo_mutiny",
            resultLines: [
              line("yg-distance-001", null, "你开始减少替杨国忠说话，也让高力士把一些宫中流言压下去。杨家不满，但你为自己留下一点余地。", "result", sceneAssets.palace, "tense")
            ]
          },
          {
            id: "yg_prepare_escape",
            label: "私下请高力士准备退路",
            description: "不改变潼关局势，但会提高你在后续危机中的生存机会。",
            historicalTag: "隐秘线",
            stateEffects: {
              yangGuifeiSafety: 24,
              politicalTrust: -6,
              emperorPrestige: -4,
              historyDeviation: 30
            },
            nextEventId: "maweipo_mutiny",
            resultLines: [
              line("yg-escape-001", "高力士", "我明白。若真到不可收拾的时候，至少要有人知道后门在哪里。", "result", sceneAssets.palace, "tense")
            ]
          }
        ]
      }
    }
  },
  {
    id: "maweipo_mutiny",
    chapter: "天宝十五载 · 马嵬坡",
    title: "马嵬坡兵变",
    summary: "长安失守后，唐玄宗带着随从西逃。禁军疲惫、饥饿、愤怒，要求处置杨氏。",
    year: "756",
    backgroundImage: sceneAssets.maweipo,
    defaultInquiryLimit: 3,
    script: [
      line(
        "mw-001",
        null,
        "长安的火光已经远了，逃亡的队伍沿着泥泞山路往西走。雨打在旗面上，原本耀眼的金线也暗了下来。",
        "narration",
        sceneAssets.changanFall,
        "tragic"
      ),
      line(
        "mw-002",
        null,
        "到了马嵬坡，禁军终于停下。饥饿、疲惫、恐惧和愤怒挤在一起，驿站外的声音越来越低，也越来越危险。",
        "narration",
        sceneAssets.maweipo,
        "tense"
      ),
      line(
        "mw-003",
        "唐玄宗",
        "我已经离开长安了。你们还不肯走，是要在这里逼我做决定吗？",
        "dialogue",
        sceneAssets.maweipo,
        "tragic"
      ),
      line(
        "mw-004",
        "高力士",
        "皇上，杨国忠已经死了，可军中还是不动。再拖下去，护送皇上的名义也压不住他们了。",
        "dialogue",
        sceneAssets.maweipo,
        "urgent"
      ),
      line(
        "mw-005",
        "陈玄礼",
        "我不想逼皇上。但士兵们都在说一句话：“祸根还没除掉，队伍怎么能继续走？”",
        "dialogue",
        sceneAssets.maweipo,
        "tense"
      ),
      line(
        "mw-006",
        "杨贵妃",
        "皇上，我听见外面的声音了。如果我一个人能换你平安，我可以认。可我怕的是，就算这样也未必能换来平安。",
        "dialogue",
        sceneAssets.maweipo,
        "tragic"
      ),
      line(
        "mw-007",
        null,
        "现在可以在决策前询问相关人物。马嵬坡没有太多时间，士兵的耐心正在耗尽。",
        "system",
        sceneAssets.maweipo,
        "urgent"
      )
    ],
    inquiryNpcs: maweipoNpcs,
    choices: [
      {
        id: "execute_yang_guifei",
        label: "下令处死杨贵妃，换禁军继续护驾",
        description: "最接近正史。军心可以暂时稳住，但皇帝威望和个人情感都会被重创。",
        historicalTag: "正史方向",
        stateEffects: {
          centralAuthority: -12,
          emperorPrestige: -18,
          militaryMorale: 12,
          publicAnger: -18,
          yangGuifeiSafety: -100,
          yangGuozhongPower: -40,
          politicalTrust: -10,
          historyDeviation: -4
        },
        resultLines: [
          line(
            "mw-execute-001",
            null,
            "驿站里的帘幕放了下来，外面的风声像忽然断掉。高力士领命离开，唐玄宗很久都没有抬头。",
            "result",
            sceneAssets.maweipo,
            "tragic"
          ),
          line(
            "mw-execute-002",
            null,
            "军中的喊声慢慢低了，队伍终于重新移动。只是从这一刻起，所谓盛世彻底变成了回忆。",
            "result",
            sceneAssets.lingwu,
            "tragic"
          )
        ]
      },
      {
        id: "protect_yang_guifei",
        label: "坚决保护杨贵妃，与禁军对峙",
        description: "保住贵妃，但可能让禁军认为皇帝仍在袒护杨家，兵变风险极高。",
        historicalTag: "高风险",
        stateEffects: {
          centralAuthority: -24,
          emperorPrestige: -20,
          militaryMorale: -18,
          publicAnger: 24,
          yangGuifeiSafety: 26,
          politicalTrust: -22,
          rebellionRisk: 18,
          historyDeviation: 34
        },
        randomEventId: "guard_mutiny_check",
        resultLines: [
          line(
            "mw-protect-001",
            "唐玄宗",
            "她不是带兵打仗的人，也不是掌权的宰相。我不能用一个女人的死，去堵住天下所有人的怨气。",
            "result",
            sceneAssets.maweipo,
            "urgent"
          ),
          line(
            "mw-protect-002",
            null,
            "这句话说完，驿站外没有安静下来。相反，压着的怒火像被风吹开，冒出更多声音。",
            "result",
            sceneAssets.maweipo,
            "tense"
          )
        ]
      },
      {
        id: "make_yang_nun",
        label: "让杨贵妃出家，试图平息军心",
        description: "用切断杨家权势来代替死亡处置，看看禁军能不能接受这个让步。",
        historicalTag: "反事实",
        stateEffects: {
          centralAuthority: -14,
          emperorPrestige: -8,
          militaryMorale: -4,
          publicAnger: -6,
          yangGuifeiSafety: 12,
          yangGuozhongPower: -35,
          politicalTrust: 6,
          historyDeviation: 28
        },
        randomEventId: "guard_acceptance_check",
        resultLines: [
          line(
            "mw-nun-001",
            null,
            "唐玄宗让人取来素衣，宣布杨贵妃从此出家，削去贵妃名号，不再跟随皇帝参与朝局。",
            "result",
            sceneAssets.maweipo,
            "tense"
          ),
          line(
            "mw-nun-002",
            "陈玄礼",
            "如果士兵相信这代表杨家的权势断了，我会立刻整队继续走。可如果他们不信，我也没有第二次机会劝他们。",
            "result",
            sceneAssets.maweipo,
            "urgent"
          )
        ]
      },
      {
        id: "fake_death_escape",
        label: "假装处死，暗中安排杨贵妃逃离",
        description: "开启隐藏线。成功后杨贵妃得以存活；失败则会被禁军视为欺骗。",
        historicalTag: "隐秘线",
        stateEffects: {
          centralAuthority: -18,
          emperorPrestige: -14,
          militaryMorale: -10,
          publicAnger: 4,
          yangGuifeiSafety: 34,
          politicalTrust: -18,
          historyDeviation: 44
        },
        randomEventId: "secret_escape_check",
        resultLines: [
          line(
            "mw-secret-001",
            null,
            "高力士低声领命，驿站后门的马重新套上鞍具。帘幕里面，生和死都被装进同一个谎言里。",
            "result",
            sceneAssets.maweipo,
            "tense"
          ),
          line(
            "mw-secret-002",
            null,
            "如果这场戏能骗过禁军，史书上会少写一个真相；如果骗不过，马嵬坡就再没有退路。",
            "result",
            sceneAssets.maweipo,
            "urgent"
          )
        ]
      }
    ],
    roleViews: {
      tang_xuanzong: {
        perspectiveTitle: "皇帝视角：马嵬坡停下了",
        objective: "让禁军重新前行，同时决定是否牺牲杨贵妃。",
        limitation: "你名义上仍是皇帝，但此刻真正握着刀的是疲惫愤怒的禁军。",
        inquiryNpcs: [maweipoNpcs[0], maweipoNpcs[1], maweipoNpcs[2], maweipoNpcs[3], maweipoNpcs[4]]
      },
      yang_guifei: {
        perspectiveTitle: "贵妃视角：所有人都在看你",
        objective: "尽量活下去，也尽量不要让玄宗被禁军拖垮。",
        limitation: "你没有兵权，也很难为自己辩解；越解释，越可能被看作杨家仍在操控皇帝。",
        script: [
          line("mw-yg-001", null, "你在驿站里，外面的雨声和士兵的喊声混在一起。每一次脚步靠近，屋里的人都会停下呼吸。", "narration", sceneAssets.maweipo, "tragic"),
          line("mw-yg-002", "宫人", "娘子，外面不只是要杨国忠的命。他们还在问，贵妃怎么办。", "dialogue", sceneAssets.maweipo, "urgent"),
          line("mw-yg-003", "杨贵妃", "原来一个人被宠爱过，也会变成所有人愤怒时最容易看见的靶子。", "dialogue", sceneAssets.maweipo, "tragic"),
          line("mw-yg-004", "高力士", "娘子，皇上护你，可禁军不一定还听皇上的。你要想清楚，什么话能救人，什么话会害人。", "dialogue", sceneAssets.maweipo, "tense"),
          line("mw-yg-005", null, "现在可以询问相关人物。你能听见他们的态度，却不能要求他们替你承担后果。", "system", sceneAssets.maweipo, "urgent")
        ],
        inquiryNpcs: [maweipoNpcs[1], maweipoNpcs[2], maweipoNpcs[3], maweipoNpcs[4], maweipoNpcs[5]],
        choices: [
          {
            id: "yg_accept_death",
            label: "接受死亡，换玄宗继续西行",
            description: "最接近正史。你牺牲自己，让护驾队伍重新动起来。",
            historicalTag: "正史方向",
            stateEffects: {
              yangGuifeiSafety: -100,
              publicAnger: -18,
              militaryMorale: 12,
              emperorPrestige: -18,
              centralAuthority: -12,
              historyDeviation: -4
            },
            endingId: "history_reenacted",
            resultLines: [
              line("mw-yg-death-001", "杨贵妃", "如果只有这样你才能继续走，那我认。只是皇上以后不要再把所有错都一个人扛着。", "result", sceneAssets.maweipo, "tragic"),
              line("mw-yg-death-002", null, "雨声盖住了屋里的哭声。外面的队伍终于重新整列。", "result", sceneAssets.lingwu, "tragic")
            ]
          },
          {
            id: "yg_request_nun",
            label: "主动请求出家，切断杨家名分",
            description: "用退让争取生路，但禁军未必相信这足够。",
            historicalTag: "反事实",
            stateEffects: {
              yangGuifeiSafety: 16,
              yangGuozhongPower: -34,
              publicAnger: -6,
              politicalTrust: 8,
              historyDeviation: 28
            },
            randomEventId: "guard_acceptance_check",
            resultLines: [
              line("mw-yg-nun-001", "杨贵妃", "我可以不要贵妃的名号，也不再跟随皇上参与任何朝中安排。请让他们知道，杨家到这里为止。", "result", sceneAssets.maweipo, "tense")
            ]
          },
          {
            id: "yg_public_confession",
            label: "公开承认杨家误国，请玄宗削杨氏余势",
            description: "保不保证你能活，但能把怨气从玄宗身上移开一部分。",
            historicalTag: "高风险",
            stateEffects: {
              yangGuifeiSafety: -18,
              yangGuozhongPower: -45,
              publicAnger: -16,
              politicalTrust: 14,
              emperorPrestige: 4,
              historyDeviation: 34
            },
            endingId: "suzong_early_power",
            resultLines: [
              line("mw-yg-confess-001", null, "你把杨家的错公开说出来，驿站外安静了一瞬。太子和诸将接住了这个机会，开始重组护驾队伍。", "result", sceneAssets.maweipo, "tense")
            ]
          },
          {
            id: "yg_fake_death",
            label: "配合高力士假死逃离",
            description: "只有极少数人知道真相。成功则活下去，失败会彻底激怒禁军。",
            historicalTag: "隐秘线",
            stateEffects: {
              yangGuifeiSafety: 38,
              politicalTrust: -18,
              emperorPrestige: -12,
              historyDeviation: 44
            },
            randomEventId: "secret_escape_check",
            resultLines: [
              line("mw-yg-fake-001", null, "你换下华服，跟着高力士安排的人走向后门。前厅的帘幕已经落下，所有人都在等一个死亡的答案。", "result", sceneAssets.maweipo, "tense")
            ]
          }
        ]
      },
      an_lushan: {
        perspectiveTitle: "叛军视角：长安已经乱了",
        objective: "利用唐廷逃亡和马嵬坡兵变，让叛军扩大优势。",
        limitation: "你得到的是探子送来的消息，无法直接控制马嵬坡现场。",
        backgroundImage: sceneAssets.changanFall,
        script: [
          line("mw-al-001", null, "你在长安附近的叛军营地。探子送来消息：唐玄宗西逃，队伍在马嵬坡停下了。", "narration", sceneAssets.changanFall, "tense"),
          line("mw-al-002", "严庄", "禁军在逼皇帝处置杨家。唐廷自己裂开了，这是机会。", "dialogue", sceneAssets.changanFall, "calm"),
          line("mw-al-003", "安禄山", "他们越乱，长安越容易拿住。可乱也会逼出新的皇帝和新的军心。", "dialogue", sceneAssets.frontier, "urgent"),
          line("mw-al-004", null, "你不关心杨贵妃能不能活。你关心的是唐廷会不会在混乱里重新组织起来。", "narration", sceneAssets.frontier, "tense"),
          line("mw-al-005", null, "现在可以询问谋士、将领和探子。你看到的是叛军的机会，也要面对叛军内部的贪婪和疲惫。", "system", sceneAssets.frontier, "urgent")
        ],
        inquiryNpcs: rebelNpcs,
        choices: [
          {
            id: "al_chase_west",
            label: "趁唐廷混乱，立刻向西追击",
            description: "扩大战果，但战线会被拉长，叛军内部压力上升。",
            historicalTag: "高风险",
            stateEffects: {
              rebellionRisk: 22,
              anLushanAmbition: 14,
              tangMilitaryStrength: -18,
              militaryMorale: -10,
              historyDeviation: 20
            },
            endingId: "an_lushan_expanded",
            resultLines: [
              line("mw-al-chase-001", null, "你下令追击。叛军的旗帜继续向西压去，唐廷还没喘过气，就被迫面对新的压力。", "result", sceneAssets.frontier, "urgent")
            ]
          },
          {
            id: "al_control_changan",
            label: "先控制长安，安插官员",
            description: "稳住已得成果，但给唐廷北方力量整合的时间。",
            historicalTag: "反事实",
            stateEffects: {
              anLushanAmbition: 8,
              rebellionRisk: 8,
              publicAnger: 10,
              politicalTrust: -10,
              historyDeviation: 18
            },
            endingId: "history_reenacted",
            resultLines: [
              line("mw-al-control-001", null, "你没有继续盲目追击，而是先控制长安。城里安静了些，但远处新的唐军旗帜也开始聚拢。", "result", sceneAssets.changanFall, "tense")
            ]
          },
          {
            id: "al_split_tang",
            label: "散布太子要夺权的消息",
            description: "继续撕裂唐廷父子关系，让唐军难以合流。",
            historicalTag: "反事实",
            stateEffects: {
              politicalTrust: -24,
              publicAnger: 10,
              rebellionRisk: 16,
              centralAuthority: -18,
              historyDeviation: 32
            },
            endingId: "an_lushan_expanded",
            resultLines: [
              line("mw-al-split-001", null, "流言顺着逃亡路线散开。唐廷还没决定谁来收拾残局，就先开始互相防备。", "result", sceneAssets.changanFall, "urgent")
            ]
          },
          {
            id: "al_internal_purge",
            label: "怀疑部下抢功，先清洗内部",
            description: "短期稳住权力，长期会消耗叛军战斗力。",
            historicalTag: "高风险",
            stateEffects: {
              anLushanAmbition: 12,
              militaryMorale: -22,
              rebellionRisk: -4,
              tangMilitaryStrength: 10,
              historyDeviation: 28
            },
            endingId: "reform_success_costly",
            resultLines: [
              line("mw-al-purge-001", null, "你开始怀疑身边人。叛军营地安静下来，但这种安静不像胜利，更像每个人都在等下一把刀。", "result", sceneAssets.frontier, "tragic")
            ]
          }
        ]
      },
      geshu_han: {
        perspectiveTitle: "败将视角：消息传到马嵬坡",
        objective: "尽量让真实军情被看见，不让潼关失败只变成某个人背锅的借口。",
        limitation: "你已经失去主动权。无论被俘、受困还是重伤，你能影响的只剩下证词和名声。",
        backgroundImage: sceneAssets.tongguan,
        script: [
          line("mw-gh-001", null, "潼关一败，消息比人跑得更快。你离马嵬坡很远，却知道那里的怒火会烧向所有被认为误国的人。", "narration", sceneAssets.tongguan, "tragic"),
          line("mw-gh-002", "部将", "老帅，长安那边一定要找人承担责任。杨国忠死了，下一个可能就是前线。", "dialogue", sceneAssets.tongguan, "tense"),
          line("mw-gh-003", "哥舒翰", "我可以认败，但不能让他们忘了，是谁逼前线离开潼关。", "dialogue", sceneAssets.tongguan, "calm"),
          line("mw-gh-004", null, "你不在马嵬坡现场，却被这场兵变重新审判。你的选择会影响后人如何理解潼关。", "narration", sceneAssets.maweipo, "tense"),
          line("mw-gh-005", null, "现在可以询问部将、斥候和士兵。你能得到前线证词，但很难改变已经爆发的众怒。", "system", sceneAssets.tongguan, "urgent")
        ],
        inquiryNpcs: [tongguanNpcs[3], tongguanNpcs[4], tongguanNpcs[5], rebelNpcs[1]],
        choices: [
          {
            id: "gh_accept_blame",
            label: "承认战败，把责任揽到自己身上",
            description: "保护部分部下，但潼关失败的真正原因会被掩盖。",
            historicalTag: "正史方向",
            stateEffects: {
              militaryMorale: -8,
              politicalTrust: -8,
              emperorPrestige: -6,
              historyDeviation: -2
            },
            endingId: "history_reenacted",
            resultLines: [
              line("mw-gh-blame-001", null, "你把战败写成自己的判断失败。部下保住了一些，真相却被压进更深的尘土里。", "result", sceneAssets.tongguan, "tragic")
            ]
          },
          {
            id: "gh_expose_orders",
            label: "公开催战经过，留下完整战报",
            description: "可能激化朝廷矛盾，但能让潼关失败不只变成前线背锅。",
            historicalTag: "反事实",
            stateEffects: {
              politicalTrust: 12,
              emperorPrestige: -8,
              yangGuozhongPower: -20,
              historyDeviation: 26
            },
            endingId: "reform_success_costly",
            resultLines: [
              line("mw-gh-expose-001", null, "你把催战、地形、军心和败因全部写清楚。它救不了潼关，却让后来的人无法只用一句“前线无能”盖过真相。", "result", sceneAssets.tongguan, "hopeful")
            ]
          },
          {
            id: "gh_send_warning",
            label: "设法把军心警告送往马嵬坡",
            description: "提醒玄宗禁军已经不能再被简单命令压住。",
            historicalTag: "反事实",
            stateEffects: {
              politicalTrust: 8,
              militaryMorale: 6,
              publicAnger: -6,
              historyDeviation: 24
            },
            endingId: "suzong_early_power",
            resultLines: [
              line("mw-gh-warning-001", null, "你的警告辗转送出。它来得太晚，不能阻止马嵬坡停下，却让太子和诸将更早意识到必须重组权力。", "result", sceneAssets.lingwu, "tense")
            ]
          },
          {
            id: "gh_surrender_mask",
            label: "假意配合叛军，换取继续传递情报",
            description: "极高风险。一旦被看作投降，你的名声会彻底崩塌。",
            historicalTag: "高风险",
            stateEffects: {
              politicalTrust: -24,
              tangMilitaryStrength: 6,
              rebellionRisk: -4,
              historyDeviation: 34
            },
            endingId: "tongguan_political_failure",
            resultLines: [
              line("mw-gh-mask-001", null, "你试图用屈辱换情报，但外界只看见你和叛军站在一起。真相还没送出去，名声先被撕碎。", "result", sceneAssets.frontier, "tragic")
            ]
          }
        ]
      }
    }
  }
];

export const timelineOutline = [
  {
    id: "fanyang_rebellion",
    year: "755",
    title: "范阳起兵",
    description: "安禄山打着讨伐杨国忠的名义起兵，河北各地开始震动。",
    backgroundImage: sceneAssets.frontier
  },
  {
    id: "tongguan_battle",
    year: "756",
    title: "潼关之战",
    description: "唐军是否离开潼关出战，决定长安还能不能继续被保护。",
    backgroundImage: sceneAssets.tongguan
  },
  {
    id: "changan_fall",
    year: "756",
    title: "长安陷落",
    description: "正史中潼关失守后，唐玄宗仓皇西逃。",
    backgroundImage: sceneAssets.changanFall
  },
  {
    id: "maweipo_mutiny",
    year: "756",
    title: "马嵬坡兵变",
    description: "禁军要求处置杨家，皇权与军心在这里发生断裂。",
    backgroundImage: sceneAssets.maweipo
  },
  {
    id: "lingwu_enthronement",
    year: "756",
    title: "灵武即位",
    description: "太子李亨在灵武即位，大唐的权力中心开始转移。",
    backgroundImage: sceneAssets.lingwu
  }
];

export const getStoryEvent = (eventId: string) => storyEvents.find((event) => event.id === eventId);
