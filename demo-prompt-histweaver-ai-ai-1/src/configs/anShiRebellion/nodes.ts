import type { RoleNodeIntro, StoryNode } from "../../types";
import { assets } from "./assets";
import { decisions } from "./decisions";
import { scripts } from "./scripts";

const bg = assets.sceneBackgrounds;
const roles = ["emperor", "consort", "commander", "guard"];

function intro(
  currentSituation: string,
  informationConflict: string,
  playerPressure: string,
  inquiryPurpose: string,
  playerSituation: string,
  decisionPressure: string,
  stakes: string,
): RoleNodeIntro {
  return {
    currentSituation,
    informationConflict,
    playerPressure,
    inquiryPurpose,
    playerSituation,
    decisionPressure,
    stakes,
  };
}

const commonGlossary = [
  {
    term: "节度使",
    explanation: "唐代边镇长官，掌握地方军事和部分行政权。兵权过重时，会威胁中央。",
  },
  {
    term: "禁军",
    explanation: "负责护卫皇帝和宫廷的军队。危机中，他们既是保护者，也可能成为施压者。",
  },
  {
    term: "潼关",
    explanation: "长安东面的重要关口，地形险要。守住它，叛军很难直接威胁长安。",
  },
];

export const nodes: StoryNode[] = [
  {
    id: "shadow-court",
    title: "盛世阴影",
    year: "天宝年间",
    location: "长安与边镇",
    background: "朝廷表面繁盛，但边镇兵权、朝中猜疑和民间怨气都在累积。",
    conflict: "要不要承认裂缝已经出现，并提前处理权力失衡。",
    backgroundImage: bg.court,
    playableRoleIds: roles,
    dialogueLimit: 3,
    fixedScript: scripts["shadow-court"],
    decisions: decisions["shadow-court"],
    shortContext: "盛世仍在，但权力结构已经出现危险裂缝。",
    detailedContext:
      "天宝后期，朝廷仍有繁华表象，可边镇节度使掌握重兵，朝中权相树敌，皇帝身边消息越来越被筛选。危机并不是突然爆炸，而是在许多人选择回避时慢慢累积。",
    glossary: commonGlossary,
    nodeIntroForRoles: {
      emperor: intro(
        "你收到关于边镇和朝臣互相指责的奏报。",
        "有人说边将有异心，有人说权臣逼人太甚，还有人劝你不要破坏太平表象。",
        "你若压错方向，可能逼出真正的叛乱；若什么都不做，中央威信会继续流失。",
        "先问清楚谁掌握事实、谁在推卸责任，再决定是核查、安抚还是强压。",
        "你是最高决策者，但身边人给你的消息并不完整。",
        "边镇兵权已经不能再只靠信任维持。",
        "这会影响朝廷能否在叛乱前保留调停空间。",
      ),
      consort: intro(
        "宫中流言开始把朝政矛盾和你的亲族绑在一起。",
        "有人说危险来自边镇，有人把所有错都推给杨国忠和宫中荣宠。",
        "你无法直接处理军国大事，却可能成为别人转移怨气的目标。",
        "你需要判断谁会保护你，谁只是想借你的名字争权。",
        "你在权力中心，却缺少正式权力。",
        "如果怨气继续累积，你会越来越难替自己说话。",
        "这会影响你在后续危机中是否还有回旋余地。",
      ),
      commander: intro(
        "你从前线看见边镇力量真实增长。",
        "朝中有人只想要强硬表态，前线斥候却说叛军准备充分。",
        "你若说得太直，会被视为怯战；说得太轻，又会害死士兵。",
        "你要问清朝廷真正想听实情，还是只想听保证。",
        "你掌握军事现实，却受制于远在长安的政治判断。",
        "是否提前把风险说透，会影响后面能否坚持守关。",
        "这会影响军队是否能利用地形守住关键防线。",
      ),
      guard: intro(
        "你在宫门与军营之间听到越来越多抱怨。",
        "上面说局势可控，军中却觉得粮饷和命令都不踏实。",
        "你没有决策权，但怨气会先在你和同袍身上发酵。",
        "你要弄清该继续沉默，还是让将领知道底层已经不稳。",
        "你是执行命令的人，也是最早承受混乱的人。",
        "如果军中声音没人听见，后面可能以更激烈方式爆发。",
        "这会影响护驾队伍在危机中是否还能维持秩序。",
      ),
    },
    availableNPCs: [
      {
        npcId: "minister",
        stanceInThisNode: "强调边镇危险，要求朝廷早下决心。",
        knowledgeInThisNode: "知道朝中对安禄山的指控和派系攻击。",
        canBeAsked: true,
        relationshipToPlayerRole: {
          emperor: "他需要你的支持来压住政敌。",
          consort: "他是你的亲族，也是把怨气带向你的人。",
          commander: "他会怀疑你用军情拖延。",
          guard: "他离你很远，却影响你的命令和粮饷。",
        },
        quickQuestionsByPlayerRole: {
          emperor: ["你判断边镇必反的依据是什么？", "如果按你的办法做，最坏代价是什么？"],
          consort: ["你有没有想过别人会把怨气推到我身上？", "你能为亲族收敛锋芒吗？"],
          commander: ["你要的是实情，还是要我替你证明判断？", "若前线兵力不足，你会承担后果吗？"],
          guard: ["上面知道军中怨气吗？", "继续服从命令能换来粮饷和活路吗？"],
        },
      },
      {
        npcId: "attendant",
        stanceInThisNode: "提醒不要只听顺耳消息。",
        knowledgeInThisNode: "知道宫廷气氛和皇帝身边人的反应。",
        canBeAsked: true,
        relationshipToPlayerRole: {
          emperor: "他了解你的迟疑，也知道哪些话最难说出口。",
          consort: "他能提醒你宫中真实风向。",
          commander: "他是前线通向皇帝身边的少数窗口。",
          guard: "他代表内廷秩序，未必懂底层苦处。",
        },
        quickQuestionsByPlayerRole: {
          emperor: ["现在谁最不敢说实话？", "我若公开核查，会先触怒谁？"],
          consort: ["宫中现在是谁在推我出去挡怨气？", "陛下是否真的能护住我？"],
          commander: ["我的军情能不能直接送到陛下面前？", "朝中会怎样解读固守？"],
          guard: ["内廷知道我们缺什么吗？", "如果军心乱了，谁会先负责？"],
        },
      },
    ],
  },
  {
    id: "frontier-break",
    title: "边镇失控",
    year: "755 年",
    location: "范阳、洛阳方向",
    background: "安禄山起兵，叛军南下速度超出朝廷预料。",
    conflict: "朝廷必须在恐慌中决定是强攻、整防线，还是继续互相追责。",
    backgroundImage: bg.city,
    playableRoleIds: roles,
    dialogueLimit: 3,
    fixedScript: scripts["frontier-break"],
    decisions: decisions["frontier-break"],
    shortContext: "叛乱爆发，朝廷需要从繁华幻觉中醒来。",
    detailedContext:
      "安禄山以讨伐杨国忠为名起兵，叛军迅速推进。朝廷很快发现，过去以为可控的边镇力量已经成为真正威胁。不同人开始争夺解释权：这是个人野心、权臣误国，还是制度失衡的总爆发？",
    glossary: commonGlossary,
    nodeIntroForRoles: {
      emperor: intro("叛乱已经爆发，你必须从互相指责中整理防线。", "有人催你立刻强硬，有人提醒叛军准备充分。", "你不能让朝廷显得无能，但更不能让长安毫无准备。", "询问前线、近臣和权相，判断谁在给你事实，谁在给你情绪。", "你还掌握名义权力，但消息比叛军速度慢。", "防线如何组织，会决定潼关是否成为最后屏障。", "这会影响长安是否直接暴露在叛军面前。"),
      consort: intro("战火让宫中流言更尖锐。", "有人说叛军是野心作乱，有人说这是杨国忠逼出来的灾祸。", "你担心真正的危机还没到，替罪羊的名单已经写好。", "询问身边人和掌权者，判断是否还有人为你说出复杂真相。", "你没有兵权，却被卷进责任争夺。", "如果不能改变叙事，后面的危机会直接压到你身上。", "这会影响你是否只是被动等待审判。"),
      commander: intro("叛军推进很快，你必须准备防线。", "朝廷催战的声音越来越强，前线看到的风险却越来越大。", "你若退让，可能被视为无能；你若冒进，可能失去关隘。", "询问斥候和朝中来信，判断哪些命令能执行，哪些只是政治表态。", "你处在军情和朝命之间。", "是否坚持军事判断，会影响潼关命运。", "这会影响士兵能否依靠地形活下来。"),
      guard: intro("叛乱消息传到军中，所有人都开始担心逃亡。", "上面说会平叛，同袍却问粮草和家人怎么办。", "你必须决定是继续压住不满，还是把问题摊出来。", "询问将领与传令者，判断命令背后有没有实际安排。", "你是小兵，却感到队伍情绪正在变化。", "如果无人处理补给和说法，军心会在路上爆开。", "这会影响之后护驾队伍是否还能听令。"),
    },
    availableNPCs: [
      {
        npcId: "rebel",
        stanceInThisNode: "把起兵包装成被迫反击。",
        knowledgeInThisNode: "知道叛军计划和对朝廷矛盾的利用。",
        canBeAsked: true,
        relationshipToPlayerRole: { emperor: "他名义上仍称臣，却已经用兵威胁你。", consort: "他会利用你亲族的名声为起兵找理由。", commander: "他把你视为必须越过的军事障碍。", guard: "他是让你离家逃亡的远处敌人。" },
        quickQuestionsByPlayerRole: {
          emperor: ["你到底要清君侧，还是要夺天下？", "如果我撤换权臣，你会停兵吗？"],
          consort: ["你为何把我的亲族当成起兵理由？", "你真的在乎百姓，还是只需要借口？"],
          commander: ["你的兵力和粮道能撑多久？", "你最怕我守在哪里？"],
          guard: ["你说替天下出气，那我们这些小兵算什么？", "你会放过沿路百姓吗？"],
        },
      },
      {
        npcId: "scout",
        stanceInThisNode: "只报告看见的推进速度和路况。",
        knowledgeInThisNode: "知道叛军推进、道路混乱和地方反应。",
        canBeAsked: true,
        relationshipToPlayerRole: { emperor: "他给你未经修饰的前线消息。", consort: "他让你知道外面的怨气有多快。", commander: "他是你判断战场的眼睛。", guard: "他和你一样在命令底层奔走。" },
        quickQuestionsByPlayerRole: {
          emperor: ["叛军推进到底有多快？", "地方官兵是在抵抗还是观望？"],
          consort: ["外面的人真把战乱怪到宫中吗？", "逃亡道路现在还安全吗？"],
          commander: ["哪条路最可能被叛军切断？", "士兵亲眼看见叛军后是什么反应？"],
          guard: ["前面还有粮吗？", "路上的散兵会不会冲击队伍？"],
        },
      },
    ],
  },
  {
    id: "tong-pass",
    title: "潼关抉择",
    year: "756 年",
    location: "潼关",
    background: "潼关是长安最后的重要屏障，守与出战的争论推到顶点。",
    conflict: "军事上该固守，政治上却有人急着要一场胜利来证明朝廷威严。",
    backgroundImage: bg.pass,
    playableRoleIds: roles,
    dialogueLimit: 3,
    fixedScript: scripts["tong-pass"],
    decisions: decisions["tong-pass"],
    shortContext: "潼关一旦失守，长安就会暴露。",
    detailedContext:
      "潼关地势险要，适合防守。可朝廷需要胜利来稳定人心，前线将领承受巨大压力。这个节点的关键不是勇敢不勇敢，而是政治焦虑是否会压倒军事现实。",
    glossary: commonGlossary,
    nodeIntroForRoles: {
      emperor: intro("守关和出战的奏报摆在你面前。", "权相催你进攻，守将强调地形和时机。", "你若准许固守，会被说成软弱；若命令出战，可能赌上长安。", "询问守将、权相和斥候，判断谁的建议真正承担后果。", "你必须在威望和现实之间选择。", "潼关选择会直接决定长安安危。", "这会影响叛军是否能迅速进入关中。"),
      consort: intro("前线争论变成宫中压力。", "有人说守将拖延，有人说朝廷催战是在送死。", "你无法下令，却知道失败后怨气会寻找更近的人。", "询问近臣和权相，判断该不该提前为自己争取证词。", "你被困在消息回声里。", "一旦前线失败，个人命运会更危险。", "这会影响你在逃亡路上是否还有人愿意保护。"),
      commander: intro("你面对最直接的军事选择。", "斥候报告叛军势盛，朝廷命令却逼你主动出关。", "抗命会被视为不忠，出关可能输掉最后屏障。", "询问斥候和朝廷使者，确认你还能争取多少时间。", "你是防线负责人，也是替政治焦虑承压的人。", "这一步可能决定你的名声和士兵的生死。", "这会影响长安是否仍有战略缓冲。"),
      guard: intro("你听见潼关的消息，也感到队伍开始准备最坏情况。", "上面说前线会赢，同袍却在问如果输了该往哪跑。", "你不能决定守或攻，但能决定是否提前组织秩序。", "询问将领和斥候，判断该继续相信命令，还是先为撤退做准备。", "你在大决策之外，却会承受它的后果。", "若毫无准备，溃败会变成更大的混乱。", "这会影响你和同袍在逃亡中的生死。"),
    },
    availableNPCs: [
      {
        npcId: "commander",
        stanceInThisNode: "坚持固守，反对仓促出关。",
        knowledgeInThisNode: "知道地形、兵力和士气。",
        canBeAsked: true,
        relationshipToPlayerRole: { emperor: "他需要说服你相信军事现实。", consort: "他无法保护你，但能说明失败不该由宫中承担。", commander: "这是你的内心判断，也是部将对你的提醒。", guard: "他是决定你是否被推上战场的人。" },
        quickQuestionsByPlayerRole: {
          emperor: ["你凭什么断定出关会败？", "如果继续固守，朝廷如何稳定人心？"],
          consort: ["若潼关失守，责任会被推到谁身上？", "你能把真实军情送回宫中吗？"],
          commander: ["我还能拖多久？", "士兵是否真能承受继续固守？"],
          guard: ["将军到底会不会带我们出关？", "如果败了，我们该先保粮还是保驾？"],
        },
      },
      {
        npcId: "minister",
        stanceInThisNode: "要求出战，认为拖延会削弱朝廷威望。",
        knowledgeInThisNode: "知道朝中焦虑和政治压力，但低估前线风险。",
        canBeAsked: true,
        relationshipToPlayerRole: { emperor: "他用威望和责任逼你下令。", consort: "他的选择会把危险推向你。", commander: "他是逼你出关的压力来源。", guard: "他的判断会决定你是否上战场。" },
        quickQuestionsByPlayerRole: {
          emperor: ["你催战的底气来自哪里？", "如果出战失败，你准备承担什么？"],
          consort: ["你是否已经把失败的退路想好了？", "你会保护我，还是先保护自己？"],
          commander: ["你看过潼关地形和兵力吗？", "你要胜利，还是要有人替朝廷背锅？"],
          guard: ["你知道我们还有多少粮吗？", "我们死在关外，谁给家里一个说法？"],
        },
      },
    ],
  },
  {
    id: "mawei-crisis",
    title: "马嵬坡危机",
    year: "756 年",
    location: "马嵬坡",
    background: "长安失守后，皇帝西逃。护驾队伍在饥饿和怨气中停下，要求追责。",
    conflict: "继续逃亡需要军队服从，但军队要求有人为崩溃负责。",
    backgroundImage: bg.road,
    playableRoleIds: roles,
    dialogueLimit: 3,
    fixedScript: scripts["mawei-crisis"],
    decisions: decisions["mawei-crisis"],
    shortContext: "逃亡队伍停下，军中要求立刻追责。",
    detailedContext:
      "潼关失利后，长安失守，皇帝西逃。随驾军士经历饥饿、恐慌和长期怨气，终于在马嵬坡爆发。这里的选择不是简单善恶，而是秩序、责任与个人命运之间的残酷交换。",
    glossary: commonGlossary,
    nodeIntroForRoles: {
      emperor: intro("队伍停在马嵬坡，禁军要求交代。", "有人说不牺牲无法继续前进，也有人说简单牺牲只是在掩盖真正失误。", "你必须决定保人、保权威，还是保队伍继续走。", "询问禁军将领和近臣，判断军心还能不能压住。", "你仍是皇帝，但此刻军队的沉默比诏书更重。", "若不能让队伍动起来，你可能连逃亡都无法继续。", "这会决定个人命运和朝廷残余秩序。"),
      consort: intro("军中怒火已经指向你。", "有人说只要交出你，队伍就能继续；也有人知道这不是全部真相。", "你必须判断求生、辩解或接受安排哪一种还有可能。", "询问皇帝、近臣和禁军将领，判断谁还有能力保护你。", "你成为权力危机中最容易被牺牲的人。", "你必须在极短时间内争取一线生路或留下证词。", "这会决定你是被沉默带走，还是留下另一种解释。"),
      commander: intro("你听到马嵬坡的消息，知道失败正在寻找名字。", "有人只谈宫中责任，有人回避前线被催战的过程。", "你不能回到事发现场，却能决定是否留下证词。", "询问信使和旧部，判断你的话能不能送到后来的记录里。", "你是失败链条中的一环，也可能成为方便的背锅者。", "如果你不说，后人可能只记得最简单的解释。", "这会影响责任是否被复杂地记录。"),
      guard: intro("你站在马嵬坡的人群里，听见同袍要求追责。", "有人要立刻交出权贵，有人担心一动手就再也回不了头。", "你必须决定是推动追责、维持秩序，还是帮人脱身。", "询问陈玄礼和同袍，判断军心到底要什么。", "你不是大人物，但此刻人群的方向会改变大人物命运。", "若没有说法，队伍可能散；若过度动手，秩序也可能碎。", "这会影响护驾队伍能否继续，也影响你是否背上血债。"),
    },
    availableNPCs: [
      {
        npcId: "general",
        stanceInThisNode: "认为必须回应军中怒火，否则护驾队伍会崩。",
        knowledgeInThisNode: "知道禁军怨气、队伍补给和现场压力。",
        canBeAsked: true,
        relationshipToPlayerRole: { emperor: "他仍护你，但也必须面对军中底线。", consort: "他可能成为决定你命运的人。", commander: "他能接收你的证词，却未必有余力细查。", guard: "他是你们愿不愿意继续服从的关键。" },
        quickQuestionsByPlayerRole: {
          emperor: ["军心到底还能压住吗？", "除了牺牲，还有没有别的交代？"],
          consort: ["你是否已经放弃保护我？", "如果我说出真相，军中会听吗？"],
          commander: ["现场是否还容得下复杂解释？", "我的证词能不能送到新权力中心？"],
          guard: ["我们要的交代是什么？", "如果动手之后，谁保证队伍不散？"],
        },
      },
      {
        npcId: "attendant",
        stanceInThisNode: "试图保住最后一点体面和可执行秩序。",
        knowledgeInThisNode: "知道皇帝情绪、宫中关系和现场危险。",
        canBeAsked: true,
        relationshipToPlayerRole: { emperor: "他会说出你最不愿听的现实。", consort: "他可能是最后愿意提醒你的人。", commander: "他能让证词进入内廷耳中。", guard: "他代表旧秩序最后的声音。" },
        quickQuestionsByPlayerRole: {
          emperor: ["我若拒绝，队伍会不会立刻散？", "还有没有办法保住她？"],
          consort: ["陛下真的还能说话算数吗？", "我还有没有离开的机会？"],
          commander: ["旧秩序还愿意听前线解释吗？", "谁会记录这场失败？"],
          guard: ["里面的人知道我们为什么停下吗？", "他们会不会又让小兵背罪？"],
        },
      },
    ],
  },
  {
    id: "new-center",
    title: "新权力中心",
    year: "756-763 年",
    location: "灵武、长安与各地",
    background: "太子在北方即位，平叛进入长期阶段。战乱终会结束，但制度裂缝仍在。",
    conflict: "战后要如何解释灾难，又要不要处理造成灾难的结构性问题。",
    backgroundImage: bg.aftermath,
    playableRoleIds: roles,
    dialogueLimit: 2,
    fixedScript: scripts["new-center"],
    decisions: decisions["new-center"],
    shortContext: "新权力中心组织平叛，个人命运进入历史后果阶段。",
    detailedContext:
      "安史之乱持续多年，最终被平定。但唐朝中央权威受损，地方军权坐大的问题没有消失。对不同角色而言，结局不只是胜负，还包括责任如何被记录、谁被牺牲、谁活下来，以及制度是否被真正看见。",
    glossary: commonGlossary,
    nodeIntroForRoles: {
      emperor: intro("新权力中心已经出现。", "有人希望你承认现实，有人还想维持旧日威严。", "你必须决定如何收束自己的角色。", "询问身边人，判断余下权威该用来保秩序还是争解释。", "你仍有名分，但权力已经转移。", "结局选择会影响历史如何评价这场崩塌。", "这会影响战后是否只追究个人，还是看见制度问题。"),
      consort: intro("你的命运已经被许多说法包围。", "有人把你写成灾难原因，有人知道那只是最省事的解释。", "你必须决定最后留下什么。", "询问仍能说话的人，判断能否保住证词或局部生路。", "你无法主导平叛，却能争取不被单一叙事吞没。", "结局选择会影响个人命运和后世解释。", "这会影响灾难是否被简化成一个人的故事。"),
      commander: intro("战乱继续，前线失败被不断解释。", "有人说你误国，有人知道命令链条更复杂。", "你必须决定是否推动更深的追责和军权约束。", "询问信使与旧部，判断还有没有机会把制度问题说清。", "你掌握经验，也背负失败。", "结局选择会影响战后是否吸取真正教训。", "这会影响同类危机是否继续重演。"),
      guard: intro("你从逃亡路走到新的命令下。", "有人说只要平叛就结束了，你却知道军心的裂缝还在。", "你必须决定是继续沉默，还是把底层经历留下来。", "询问将领和同袍，判断活下来之后还要不要说话。", "你不能左右朝局，却能改变小范围的生死和记忆。", "结局选择会影响你的同袍是否只是被消耗的数字。", "这会影响战争被如何记住。"),
    },
    availableNPCs: [
      {
        npcId: "scout",
        stanceInThisNode: "带来平叛与地方局势的碎片消息。",
        knowledgeInThisNode: "知道道路、城池和军民状态。",
        canBeAsked: true,
        relationshipToPlayerRole: { emperor: "他让你看见诏令之外的真实恢复。", consort: "他能带来外界如何谈论你的消息。", commander: "他能帮助传出证词。", guard: "他和你一样记得路上的普通人。" },
        quickQuestionsByPlayerRole: {
          emperor: ["外面还认旧日诏令吗？", "地方军队现在听谁的？"],
          consort: ["外面的人如何说我？", "还有人愿意听另一种解释吗？"],
          commander: ["我的证词送到了哪里？", "地方军权是否比以前更重了？"],
          guard: ["同袍还有多少人活着？", "百姓会记得我们经历过什么吗？"],
        },
      },
      {
        npcId: "general",
        stanceInThisNode: "认为战后必须记住军心崩裂的教训。",
        knowledgeInThisNode: "知道护驾军和战后秩序的代价。",
        canBeAsked: true,
        relationshipToPlayerRole: { emperor: "他见证你的权威如何被军心限制。", consort: "他知道牺牲背后的秩序交换。", commander: "他理解军令和军心之间的裂缝。", guard: "他知道你们为什么不再盲目服从。" },
        quickQuestionsByPlayerRole: {
          emperor: ["我最后还能补救什么？", "军心为何会走到那一步？"],
          consort: ["你是否承认我只是被推到前面的人？", "你会不会留下真实说法？"],
          commander: ["战后会不会继续逼将领替政治冒险？", "军心教训会被记住吗？"],
          guard: ["我们活下来的人能得到什么？", "以后还会有人听小兵的话吗？"],
        },
      },
    ],
  },
];
