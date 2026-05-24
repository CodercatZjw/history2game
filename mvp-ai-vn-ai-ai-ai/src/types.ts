export type GameMode = "historical" | "simulation";

export type GamePhase = "script" | "inquiry" | "decision" | "resolution";

export type DialogueType = "narration" | "dialogue" | "system" | "player" | "ai" | "result";

export type DialoguePurpose = "story" | "inquiry_setup" | "free_chat" | "decision" | "resolution";

export type GameState = {
  centralAuthority: number;
  emperorPrestige: number;
  frontierDiscontent: number;
  rebellionRisk: number;
  militaryMorale: number;
  publicAnger: number;
  courtCorruption: number;
  yangGuifeiSafety: number;
  yangGuozhongPower: number;
  anLushanAmbition: number;
  tangMilitaryStrength: number;
  politicalTrust: number;
  historyDeviation: number;
};

export type GameStateKey = keyof GameState;

export type Character = {
  id: string;
  name: string;
  identity: string;
  background: string;
  goal: string;
  dilemma: string;
  portrait?: string;
  accent: string;
};

export type DialogueLine = {
  id: string;
  speaker: string | null;
  text: string;
  type: DialogueType;
  purpose?: DialoguePurpose;
  intent?: string;
  promptHint?: string;
  sourceId?: string;
  backgroundImage?: string;
  mood?: "calm" | "tense" | "urgent" | "tragic" | "hopeful";
};

export type VNDialogueLine = DialogueLine;

export type InquirySuggestion = {
  text: string;
  npcId?: string;
};

export type InquirySetup = {
  title: string;
  urgency: string;
  question: string;
  suggestedQuestions: Array<string | InquirySuggestion>;
};

export type InquiryNpc = {
  id: string;
  name: string;
  identity: string;
  attitude: string;
  portrait?: string;
};

export type ChoiceOption = {
  id: string;
  label: string;
  description: string;
  historicalTag?: "正史方向" | "反事实" | "高风险" | "隐秘线";
  stateEffects: Partial<GameState>;
  resultLines: DialogueLine[];
  nextEventId?: string;
  randomEventId?: string;
  endingId?: string;
};

export type EventRoleView = {
  perspectiveTitle: string;
  objective: string;
  limitation: string;
  backgroundImage?: string;
  defaultInquiryLimit?: number;
  inquirySetup?: InquirySetup;
  script?: DialogueLine[];
  inquiryNpcs?: InquiryNpc[];
  choices?: ChoiceOption[];
};

export type StoryEvent = {
  id: string;
  chapter: string;
  title: string;
  summary: string;
  year: string;
  backgroundImage: string;
  defaultInquiryLimit: number;
  script: DialogueLine[];
  inquiryNpcs: InquiryNpc[];
  choices: ChoiceOption[];
  inquirySetup?: InquirySetup;
  roleViews?: Record<string, EventRoleView>;
};

export type ChatRequest = {
  npcId: string;
  eventId: string;
  playerRole: string;
  playerRoleName?: string;
  playerRoleIdentity?: string;
  npcName?: string;
  npcIdentity?: string;
  npcAttitude?: string;
  eventTitle?: string;
  eventSummary?: string;
  perspectiveTitle?: string;
  playerObjective?: string;
  perspectiveLimitation?: string;
  decisionQuestion?: string;
  decisionOptions?: Array<Pick<ChoiceOption, "id" | "label" | "description" | "historicalTag">>;
  message: string;
  gameState: GameState;
};

export type ChatResponse = {
  reply: string;
  mock?: boolean;
};

export type RandomOutcome = {
  eventId: string;
  title: string;
  success: boolean;
  roll: number;
  threshold: number;
  narration: string;
  systemText: string;
  stateEffects: Partial<GameState>;
  endingId?: string;
};

export type RandomEventConfig = {
  id: string;
  title: string;
  description: string;
  threshold: (state: GameState) => number;
  success: Omit<RandomOutcome, "eventId" | "title" | "success" | "roll" | "threshold">;
  failure: Omit<RandomOutcome, "eventId" | "title" | "success" | "roll" | "threshold">;
};

export type EndingDefinition = {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  closeoutLines: DialogueLine[];
  description: string;
  historicalComparison: string;
  deviationLabel: string;
};

export type DecisionRecord = {
  eventId: string;
  eventTitle: string;
  choiceId: string;
  choiceLabel: string;
  outcomeTitle?: string;
  success?: boolean;
};

export type EndingPayload = {
  endingId: string;
  state: GameState;
  decisions: DecisionRecord[];
  history: DialogueLine[];
};
