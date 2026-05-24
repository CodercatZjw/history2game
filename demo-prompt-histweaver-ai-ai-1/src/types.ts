export type DialogueType =
  | "narration"
  | "fixedDialogue"
  | "aiDialogue"
  | "playerQuestion"
  | "systemResult"
  | "decisionResult"
  | "endingNarration";

export type DecisionType = "historical" | "counterfactual" | "hidden";

export type GameState = Record<string, number>;

export interface HistoricalGameConfig {
  id: string;
  title: string;
  period: string;
  intro: string;
  theme: string;
  assets: GameAssets;
  timeline: TimelineEvent[];
  roles: PlayableRole[];
  npcs: NPCProfile[];
  nodes: StoryNode[];
  stateSchema: GameStateVariable[];
  defaultState: GameState;
  randomEvents: RandomEventRule[];
  endings: EndingRule[];
}

export interface GameAssets {
  coverImage: string;
  defaultBackground: string;
  sceneBackgrounds: Record<string, string>;
  portraits: Record<string, string>;
  endingBackgrounds: Record<string, string>;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  location: string;
  importance: number;
}

export interface PlayableRole {
  id: string;
  name: string;
  identity: string;
  goal: string;
  dilemma: string;
  visibleInfo: string[];
  hiddenMotivation: string;
  portraitImage: string;
  initialStateModifiers: GameState;
  playableNodeIds: string[];
  routeDescription: string;
}

export interface NPCProfile {
  id: string;
  name: string;
  identity: string;
  globalStance: string;
  personality: string;
  knowledgeBoundary: string;
  portraitImage: string;
  promptProfileKey: string;
}

export interface StoryNode {
  id: string;
  title: string;
  year: string;
  location: string;
  background: string;
  conflict: string;
  backgroundImage: string;
  playableRoleIds: string[];
  availableNPCs: NodeNPC[];
  dialogueLimit: number;
  fixedScript: Record<string, DialogueBlock[]>;
  decisions: DecisionOption[];
  nodeIntroForRoles: Record<string, RoleNodeIntro>;
  shortContext: string;
  detailedContext: string;
  glossary: GlossaryItem[];
}

export interface RoleNodeIntro {
  currentSituation: string;
  informationConflict: string;
  playerPressure: string;
  inquiryPurpose: string;
  playerSituation: string;
  decisionPressure: string;
  stakes: string;
}

export interface GlossaryItem {
  term: string;
  explanation: string;
}

export interface NodeNPC {
  npcId: string;
  stanceInThisNode: string;
  knowledgeInThisNode: string;
  relationshipToPlayerRole: Record<string, string>;
  canBeAsked: boolean;
  quickQuestionsByPlayerRole: Record<string, string[]>;
}

export interface DialogueBlock {
  id: string;
  type: DialogueType;
  speakerId?: string;
  speakerName?: string;
  targetId?: string;
  text: string;
  backgroundImage?: string;
  portraitImage?: string;
  emotion?: string;
  next?: string;
}

export interface DecisionOption {
  id: string;
  text: string;
  description: string;
  type: DecisionType;
  allowedRoleIds: string[];
  stateEffects: GameState;
  nextNodeId?: string;
  randomEventId?: string;
  historicalExplanation: string;
  resultScript: DialogueBlock[];
}

export interface GameStateVariable {
  key: string;
  label: string;
  description: string;
  min: number;
  max: number;
  defaultValue: number;
}

export interface RandomEventRule {
  id: string;
  title: string;
  description: string;
  relatedStateKeys: string[];
  probabilityFormulaDescription: string;
  successText: string;
  failureText: string;
  successEffects: GameState;
  failureEffects: GameState;
}

export interface EndingRule {
  id: string;
  title: string;
  priority: number;
  conditionDescription: string;
  summary: string;
  historyComparison: string;
  counterfactualExplanation: string;
  endingNarration: DialogueBlock[];
  backgroundImage?: string;
  condition?: (state: GameState, role: PlayableRole, visitedNodeIds: string[]) => boolean;
}

export interface InquiryTurn {
  id: string;
  question: DialogueBlock;
  answer: DialogueBlock;
}

export interface RuntimeSnapshot {
  config: HistoricalGameConfig;
  playerRole: PlayableRole;
  currentNode: StoryNode;
  gameState: GameState;
  visitedNodeIds: string[];
}
