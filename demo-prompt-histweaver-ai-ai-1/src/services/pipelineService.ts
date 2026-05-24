import type { DecisionOption, DialogueBlock, GameState, HistoricalGameConfig, StoryNode } from "../types";
import { validateConfig } from "./configValidator";

export interface PipelineStepResult {
  id: string;
  title: string;
  status: "pending" | "running" | "done" | "error";
  summary: string;
}

export interface PipelineGenerateResult {
  config?: HistoricalGameConfig;
  steps: PipelineStepResult[];
  rawText?: string;
  usedMock: boolean;
  issues: string[];
  serverFilePath?: string;
  rawFilePath?: string;
  error?: string;
}

export interface PipelineStreamCallbacks {
  onToken?: (token: string, rawText: string) => void;
  onLog?: (message: string) => void;
  onSteps?: (steps: PipelineStepResult[]) => void;
}

export const pipelineSteps: PipelineStepResult[] = [
  { id: "input", title: "输入历史事件", status: "pending", summary: "读取用户给出的事件名称、背景资料或关键词。" },
  { id: "timeline", title: "整理正史时间线", status: "pending", summary: "提取年份、地点、因果顺序和关键转折。" },
  { id: "nodes", title: "抽取关键决策节点", status: "pending", summary: "把历史弧线拆成可游玩的节点。" },
  { id: "roles", title: "设计可选角色", status: "pending", summary: "为不同身份设计目标、困境、可见信息和路线。" },
  { id: "npcs", title: "设计 NPC 与信息边界", status: "pending", summary: "定义可询问对象、立场、关系和知道/不知道的内容。" },
  { id: "script", title: "生成固定剧情脚本", status: "pending", summary: "生成视觉小说式旁白和固定台词。" },
  { id: "inquiry", title: "生成有限询问", status: "pending", summary: "为 node + role + npc 生成推荐问题和 NPC prompt 数据。" },
  { id: "state", title: "生成状态变量", status: "pending", summary: "定义可被选择、随机事件和结局读取的状态数值。" },
  { id: "random", title: "生成随机事件规则", status: "pending", summary: "让随机结果受状态变量影响，而不是纯随机。" },
  { id: "endings", title: "生成多结局规则", status: "pending", summary: "输出正史与合理反事实结局说明。" },
  { id: "runtime", title: "保存并交给 Runtime", status: "pending", summary: "把配置写成服务器文件，再交给通用 Runtime 运行。" },
];

const stepMarkers: Array<[string, RegExp]> = [
  ["input", /"title"|"period"|"intro"/],
  ["timeline", /"timeline"/],
  ["roles", /"roles"/],
  ["npcs", /"npcs"/],
  ["nodes", /"nodes"/],
  ["script", /"fixedScript"|"resultScript"/],
  ["inquiry", /"quickQuestionsByPlayerRole"|"dialogueLimit"/],
  ["state", /"stateSchema"|"defaultState"/],
  ["random", /"randomEvents"/],
  ["endings", /"endings"|"endingNarration"/],
  ["runtime", /}\s*$/],
];

const DEFAULT_SCENE_BACKGROUND = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#1b1210"/>
        <stop offset=".5" stop-color="#5d2f1f"/>
        <stop offset="1" stop-color="#090605"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#f5cf84" stop-opacity=".9"/>
        <stop offset="1" stop-color="#7b3f23" stop-opacity=".2"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#sky)"/>
    <circle cx="1480" cy="180" r="150" fill="#f5c46d" opacity=".22"/>
    <path d="M0 780 C360 650 690 700 960 620 C1230 540 1500 610 1920 470 L1920 1080 L0 1080 Z" fill="#120d0b" opacity=".72"/>
    <path d="M300 500 L820 330 L1320 500 Z" fill="#1f2937" opacity=".82"/>
    <path d="M230 500 H1410 V720 H230 Z" fill="#6f2f1f" opacity=".84"/>
    <path d="M320 720 H1320 V790 H320 Z" fill="#111827" opacity=".9"/>
    <g fill="url(#gold)" opacity=".72">
      <rect x="455" y="440" width="26" height="280"/>
      <rect x="720" y="440" width="26" height="280"/>
      <rect x="985" y="440" width="26" height="280"/>
      <rect x="1245" y="440" width="26" height="280"/>
    </g>
  </svg>
`)}`;

const DEFAULT_PORTRAIT = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#3b2a1d"/>
        <stop offset=".55" stop-color="#7b3f23"/>
        <stop offset="1" stop-color="#111827"/>
      </linearGradient>
    </defs>
    <rect width="320" height="320" rx="28" fill="url(#bg)"/>
    <circle cx="160" cy="104" r="46" fill="#f7d796"/>
    <path d="M80 260c12-64 48-96 80-96s68 32 80 96H80z" fill="#f8e7b7"/>
    <path d="M95 248c18-42 40-62 65-62s47 20 65 62" fill="#7f3f24" opacity=".45"/>
    <rect x="58" y="278" width="204" height="10" rx="5" fill="#f7d796" opacity=".5"/>
  </svg>
`)}`;

function markSteps(currentIndex: number, finished = false, error = false): PipelineStepResult[] {
  return pipelineSteps.map((step, index) => {
    if (error && index === currentIndex) return { ...step, status: "error" };
    if (finished) return { ...step, status: "done" };
    if (index < currentIndex) return { ...step, status: "done" };
    if (index === currentIndex) return { ...step, status: "running" };
    return { ...step, status: "pending" };
  });
}

function estimateSteps(rawText: string) {
  const index = stepMarkers.reduce((latest, [, marker], markerIndex) => {
    return marker.test(rawText) ? markerIndex : latest;
  }, 0);
  return markSteps(Math.min(index, pipelineSteps.length - 1));
}

function markAllDone(
  config: HistoricalGameConfig,
  usedMock: boolean,
  issues: string[],
  rawText?: string,
  serverFilePath?: string,
  rawFilePath?: string,
): PipelineGenerateResult {
  return {
    config,
    usedMock,
    issues,
    rawText,
    serverFilePath,
    rawFilePath,
    steps: pipelineSteps.map((step) => ({
      ...step,
      status: issues.length ? (step.id === "runtime" ? "error" : "done") : "done",
    })),
  };
}

function markFailed(error: string, rawText?: string): PipelineGenerateResult {
  const runningIndex = Math.max(0, pipelineSteps.findIndex((step) => step.id === "runtime"));
  return {
    steps: markSteps(runningIndex, false, true),
    rawText,
    usedMock: false,
    issues: [error],
    error,
  };
}

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "generated-event"
  );
}

function asText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((item) => asText(item)).filter(Boolean).join(" ");
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return (
      asText(record.text) ||
      asText(record.description) ||
      asText(record.summary) ||
      asText(record.title) ||
      fallback
    );
  }
  return fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => asText(item)).filter(Boolean);
  const text = asText(value);
  return text ? [text] : [];
}

function asRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, asText(item)]),
  );
}

function stripJsonFence(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced?.[1]?.trim() ?? trimmed;
}

function removeTrailingCommas(text: string) {
  return text.replace(/,\s*([}\]])/g, "$1");
}

function extractJsonObject(text: string) {
  const unfenced = stripJsonFence(text);
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  return start >= 0 && end > start ? unfenced.slice(start, end + 1) : unfenced;
}

function parseGeneratedConfigJson(rawText: string): HistoricalGameConfig {
  const candidate = extractJsonObject(rawText);
  try {
    return JSON.parse(candidate) as HistoricalGameConfig;
  } catch (firstError) {
    try {
      return JSON.parse(removeTrailingCommas(candidate)) as HistoricalGameConfig;
    } catch {
      throw firstError;
    }
  }
}

function asUnknownRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function normalizeStateEffects(value: unknown): GameState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, Number(item ?? 0)]));
}

function normalizeRoleIds(value: unknown, fallbackRoleIds: string[]) {
  if (Array.isArray(value)) {
    const roleIds = value.map((item) => asText(item)).filter(Boolean);
    if (roleIds.length) return roleIds;
  }
  const singleRoleId = asText(value);
  return singleRoleId ? [singleRoleId] : fallbackRoleIds;
}

function flattenGeneratedDecisions(decisions: unknown, nodeId: string, fallbackRoleIds: string[]): DecisionOption[] {
  if (!Array.isArray(decisions)) return [];

  return decisions.flatMap((item, decisionIndex): DecisionOption[] => {
    const decision = asUnknownRecord(item);
    const nestedOptions = Array.isArray(decision.options) ? decision.options : null;

    if (nestedOptions) {
      return nestedOptions.map((option, optionIndex) => {
        const nested = asUnknownRecord(option);
        const id = asText(nested.id, `${nodeId}-decision-${decisionIndex + 1}-${optionIndex + 1}`);
        const description = asText(nested.description) || asText(decision.description);
        const resultFallback = description || asText(nested.text) || "选择已经改变局势。";
        return {
          id,
          text: asText(nested.text, "做出选择"),
          description,
          type:
            nested.type === "historical" || nested.type === "counterfactual" || nested.type === "hidden"
              ? nested.type
              : "counterfactual",
          allowedRoleIds: normalizeRoleIds(nested.allowedRoleIds ?? decision.allowedRoleIds ?? decision.roleId, fallbackRoleIds),
          stateEffects: normalizeStateEffects(nested.stateEffects ?? nested.effects),
          nextNodeId: asText(nested.nextNodeId) || undefined,
          randomEventId: asText(nested.randomEventId) || undefined,
          historicalExplanation: asText(nested.historicalExplanation) || asText(decision.historicalExplanation) || description,
          resultScript: normalizeDialogueBlocks(nested.resultScript as DialogueBlock[] | undefined, resultFallback),
        };
      });
    }

    const id = asText(decision.id, `${nodeId}-decision-${decisionIndex + 1}`);
    const description = asText(decision.description);
    const resultFallback = description || asText(decision.text) || "选择已经改变局势。";
    return [
      {
        id,
        text: asText(decision.text, "做出选择"),
        description,
        type:
          decision.type === "historical" || decision.type === "counterfactual" || decision.type === "hidden"
            ? decision.type
            : "counterfactual",
        allowedRoleIds: normalizeRoleIds(decision.allowedRoleIds ?? decision.roleId, fallbackRoleIds),
        stateEffects: normalizeStateEffects(decision.stateEffects ?? decision.effects),
        nextNodeId: asText(decision.nextNodeId) || undefined,
        randomEventId: asText(decision.randomEventId) || undefined,
        historicalExplanation: asText(decision.historicalExplanation),
        resultScript: normalizeDialogueBlocks(decision.resultScript as DialogueBlock[] | undefined, resultFallback),
      },
    ];
  });
}

function placeholderImage(label: string, tone = "#7c2d12") {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#111827"/>
          <stop offset=".55" stop-color="${tone}"/>
          <stop offset="1" stop-color="#020617"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#g)"/>
      <path d="M0 650c260-140 530-160 800-70s520 45 800-110v430H0z" fill="#0f172a" opacity=".62"/>
      <path d="M120 520h1360v120H120z" fill="#2a140f" opacity=".62"/>
      <text x="90" y="130" fill="#fff4c7" opacity=".72" font-family="serif" font-size="54">${label}</text>
    </svg>
  `)}`;
}

function defaultQuestionsFor(nodeTitle: string): string[] {
  return [
    "你现在最担心的风险是什么？",
    "如果我听你的建议，代价会落在谁身上？",
    `关于“${nodeTitle}”，你有什么没明说的判断？`,
  ];
}

function normalizeNodeNpcData(config: HistoricalGameConfig): HistoricalGameConfig {
  const npcsById = new Map(config.npcs.map((npc) => [npc.id, npc]));
  return {
    ...config,
    nodes: config.nodes.map((node) => ({
      ...node,
      backgroundImage: node.backgroundImage || DEFAULT_SCENE_BACKGROUND,
      availableNPCs: node.availableNPCs.map((nodeNpc) => {
        const npc = npcsById.get(nodeNpc.npcId);
        const relationshipToPlayerRole = { ...nodeNpc.relationshipToPlayerRole };
        const quickQuestionsByPlayerRole = { ...nodeNpc.quickQuestionsByPlayerRole };

        config.roles.forEach((role) => {
          if (!relationshipToPlayerRole[role.id]) {
            relationshipToPlayerRole[role.id] = `${npc?.name ?? "此人"}会根据你的身份谨慎回应，可能只说对自己有利的部分。`;
          }
          if (!quickQuestionsByPlayerRole[role.id]?.length) {
            quickQuestionsByPlayerRole[role.id] = defaultQuestionsFor(node.title);
          }
        });

        return {
          ...nodeNpc,
          stanceInThisNode:
            nodeNpc.stanceInThisNode ||
            npc?.globalStance ||
            "态度谨慎，既想影响你的判断，也不愿把全部风险揽到自己身上。",
          knowledgeInThisNode:
            nodeNpc.knowledgeInThisNode ||
            npc?.knowledgeBoundary ||
            `知道与“${node.title}”有关的局部情况，但未必掌握全局，也可能隐瞒不利信息。`,
          relationshipToPlayerRole,
          quickQuestionsByPlayerRole,
        };
      }),
    })),
  };
}

function normalizeState(config: HistoricalGameConfig): HistoricalGameConfig {
  const defaultState: GameState = { ...config.defaultState };
  config.stateSchema.forEach((item) => {
    defaultState[item.key] = Number(defaultState[item.key] ?? item.defaultValue ?? 50);
  });
  return { ...config, defaultState };
}

function normalizeDecisionRoutes(config: HistoricalGameConfig): HistoricalGameConfig {
  const nodesById = new Map(config.nodes.map((node) => [node.id, node]));
  const rolesById = new Map(config.roles.map((role) => [role.id, role]));

  return {
    ...config,
    nodes: config.nodes.map((node) => ({
      ...node,
      decisions: node.decisions.map((decision) => {
        const nextNodeId = decision.nextNodeId;
        if (!nextNodeId) return decision;

        const nextNode = nodesById.get(nextNodeId);
        const isValidForEveryAllowedRole = decision.allowedRoleIds.every((roleId) => {
          const role = rolesById.get(roleId);
          return Boolean(role?.playableNodeIds.includes(nextNodeId) && nextNode?.playableRoleIds.includes(roleId));
        });

        return isValidForEveryAllowedRole ? decision : { ...decision, nextNodeId: undefined };
      }),
    })),
  };
}

function normalizeDialogueBlocks(blocks: DialogueBlock[] | undefined, fallbackText: string): DialogueBlock[] {
  if (Array.isArray(blocks) && blocks.length) {
    return blocks.map((block, index) => ({
      ...block,
      id: asText(block.id, `dialogue-${index + 1}`),
      type:
        block.type === "narration" ||
        block.type === "fixedDialogue" ||
        block.type === "aiDialogue" ||
        block.type === "playerQuestion" ||
        block.type === "systemResult" ||
        block.type === "decisionResult" ||
        block.type === "endingNarration"
          ? block.type
          : "narration",
      speakerId: asText(block.speakerId) || undefined,
      speakerName: asText(block.speakerName) || asText((block as unknown as Record<string, unknown>).speaker) || "旁白",
      targetId: asText(block.targetId) || undefined,
      text: asText(block.text, fallbackText),
      backgroundImage: asText(block.backgroundImage) || undefined,
      portraitImage: asText(block.portraitImage) || undefined,
      emotion: asText(block.emotion) || undefined,
      next: asText(block.next) || undefined,
    }));
  }
  return [
    {
      id: "auto-narration",
      type: "narration",
      speakerName: "旁白",
      text: fallbackText,
    },
  ];
}

function normalizeGeneratedConfig(raw: HistoricalGameConfig, sourceText: string): HistoricalGameConfig {
  const rawRoles = Array.isArray(raw.roles) ? raw.roles : [];
  const rawNpcs = Array.isArray(raw.npcs) ? raw.npcs : [];
  const rawNodes = Array.isArray(raw.nodes) ? raw.nodes : [];
  const rawTimeline = Array.isArray(raw.timeline) ? raw.timeline : [];
  const rawStateSchema = Array.isArray(raw.stateSchema) ? raw.stateSchema : [];
  const rawRandomEvents = Array.isArray(raw.randomEvents) ? raw.randomEvents : [];
  const rawEndings = Array.isArray(raw.endings) ? raw.endings : [];
  const title = asText(raw.title, "生成的历史互动叙事");
  const id = asText(raw.id) || slugify(title || sourceText);
  const coverImage = DEFAULT_SCENE_BACKGROUND;
  const defaultBackground = DEFAULT_SCENE_BACKGROUND;
  const sceneBackgrounds = raw.assets?.sceneBackgrounds || {};
  const portraits = raw.assets?.portraits || {};
  const endingBackgrounds = raw.assets?.endingBackgrounds || {};

  const stateSchema = rawStateSchema.length
    ? rawStateSchema.map((item) => ({
        ...item,
        key: asText(item.key, "state"),
        label: asText(item.label, asText(item.key, "状态")),
        description: asText(item.description),
        min: Number(item.min ?? 0),
        max: Number(item.max ?? 100),
        defaultValue: Number(item.defaultValue ?? 50),
      }))
    : [
        { key: "authority", label: "权威", description: "命令被接受的程度。", min: 0, max: 100, defaultValue: 50 },
        { key: "morale", label: "士气", description: "行动者继续承担风险的意愿。", min: 0, max: 100, defaultValue: 50 },
        { key: "trust", label: "信任", description: "不同群体之间的互信程度。", min: 0, max: 100, defaultValue: 45 },
        { key: "deviation", label: "历史偏离度", description: "选择偏离正史惯性的程度。", min: 0, max: 100, defaultValue: 0 },
      ];

  const nodes = rawNodes.map((node, nodeIndex): StoryNode => {
    const nodeId = asText(node.id, `node-${nodeIndex + 1}`);
    const fallbackRoleIds = rawRoles.map((role) => asText(role.id)).filter(Boolean);
    const backgroundImage =
      asText(node.backgroundImage) ||
      asText(sceneBackgrounds[node.id]) ||
      DEFAULT_SCENE_BACKGROUND;
    const fixedScript = { ...(node.fixedScript || {}) };
    rawRoles.forEach((role) => {
      fixedScript[role.id] = normalizeDialogueBlocks(
        fixedScript[role.id],
        asText(node.shortContext) || asText(node.background) || "局势正在变化，你必须先弄清楚各方立场。",
      );
    });
    return {
      ...node,
      id: nodeId,
      title: asText(node.title, `节点 ${nodeIndex + 1}`),
      year: asText(node.year, "时间待定"),
      location: asText(node.location, "地点待定"),
      background: asText(node.background),
      conflict: asText(node.conflict),
      backgroundImage,
      playableRoleIds: Array.isArray(node.playableRoleIds) ? node.playableRoleIds.map((item) => asText(item)).filter(Boolean) : [],
      dialogueLimit: Number(node.dialogueLimit ?? 3),
      fixedScript,
      glossary: Array.isArray(node.glossary)
        ? node.glossary.map((item) => {
            const glossaryItem = item as unknown as Record<string, unknown>;
            return {
              term: asText(glossaryItem.term),
              explanation: asText(glossaryItem.explanation) || asText(glossaryItem.definition),
            };
          })
        : [],
      availableNPCs: Array.isArray(node.availableNPCs)
        ? node.availableNPCs.map((item) => ({
            ...item,
            npcId: asText(item.npcId),
            stanceInThisNode: asText(item.stanceInThisNode),
            knowledgeInThisNode: asText(item.knowledgeInThisNode),
            relationshipToPlayerRole: asRecord(item.relationshipToPlayerRole),
            canBeAsked: item.canBeAsked !== false,
            quickQuestionsByPlayerRole:
              item.quickQuestionsByPlayerRole && typeof item.quickQuestionsByPlayerRole === "object"
                ? Object.fromEntries(
                    Object.entries(item.quickQuestionsByPlayerRole as Record<string, unknown>).map(([key, value]) => [
                      key,
                      asStringArray(value),
                    ]),
                  )
                : {},
          }))
        : [],
      decisions: flattenGeneratedDecisions((node as unknown as Record<string, unknown>).decisions, nodeId, fallbackRoleIds),
      nodeIntroForRoles:
        node.nodeIntroForRoles && typeof node.nodeIntroForRoles === "object" && !Array.isArray(node.nodeIntroForRoles)
          ? Object.fromEntries(
              Object.entries(node.nodeIntroForRoles).map(([roleId, intro]) => {
                const item = intro as unknown as Record<string, unknown>;
                return [
                  roleId,
                  {
                    currentSituation: asText(item.currentSituation),
                    informationConflict: asText(item.informationConflict),
                    playerPressure: asText(item.playerPressure),
                    inquiryPurpose: asText(item.inquiryPurpose),
                    playerSituation: asText(item.playerSituation),
                    decisionPressure: asText(item.decisionPressure),
                    stakes: asText(item.stakes),
                  },
                ];
              }),
            )
          : {},
      shortContext: asText(node.shortContext),
      detailedContext: asText(node.detailedContext),
    };
  });

  const config: HistoricalGameConfig = normalizeState({
    id,
    title,
    period: asText(raw.period, "历史时期待确认"),
    intro: asText(raw.intro, `围绕「${sourceText.slice(0, 24)}」生成的视觉小说式互动历史游戏。`),
    theme: asText(raw.theme, "人在历史压力中做出选择，并承担结构性后果。"),
    assets: {
      coverImage,
      defaultBackground: DEFAULT_SCENE_BACKGROUND,
      sceneBackgrounds: Object.fromEntries(nodes.map((node) => [node.id, node.backgroundImage || DEFAULT_SCENE_BACKGROUND])),
      portraits: Object.fromEntries([...rawRoles, ...rawNpcs].map((item) => [asText(item.id), DEFAULT_PORTRAIT])),
      endingBackgrounds: asRecord(endingBackgrounds),
    },
    timeline: rawTimeline.map((item, index) => ({
      id: asText(item.id, `timeline-${index + 1}`),
      year: asText(item.year, "时间待定"),
      title: asText(item.title, `事件 ${index + 1}`),
      description: asText(item.description),
      location: asText(item.location, "地点待定"),
      importance: Number(item.importance ?? index + 1),
    })),
    roles: rawRoles.map((role, index) => ({
      ...role,
      id: asText(role.id, `role-${index + 1}`),
      name: asText(role.name, `角色 ${index + 1}`),
      identity: asText(role.identity),
      goal: asText(role.goal),
      dilemma: asText(role.dilemma),
      hiddenMotivation: asText(role.hiddenMotivation),
      routeDescription: asText(role.routeDescription),
      portraitImage: DEFAULT_PORTRAIT,
      playableNodeIds: Array.isArray(role.playableNodeIds)
        ? role.playableNodeIds.map((item) => asText(item)).filter(Boolean)
        : nodes.map((node) => node.id),
      initialStateModifiers:
        role.initialStateModifiers && typeof role.initialStateModifiers === "object" && !Array.isArray(role.initialStateModifiers)
          ? Object.fromEntries(Object.entries(role.initialStateModifiers).map(([key, value]) => [key, Number(value ?? 0)]))
          : {},
      visibleInfo: asStringArray(role.visibleInfo),
    })),
    npcs: rawNpcs.map((npc, index) => ({
      ...npc,
      id: asText(npc.id, `npc-${index + 1}`),
      name: asText(npc.name, `NPC ${index + 1}`),
      identity: asText(npc.identity),
      globalStance: asText(npc.globalStance),
      personality: asText(npc.personality),
      knowledgeBoundary: asText(npc.knowledgeBoundary),
      portraitImage: DEFAULT_PORTRAIT,
      promptProfileKey: asText(npc.promptProfileKey, asText(npc.id, `npc-${index + 1}`)),
    })),
    nodes,
    stateSchema,
    defaultState: raw.defaultState || Object.fromEntries(stateSchema.map((item) => [item.key, item.defaultValue])),
    randomEvents: rawRandomEvents.map((event, index) => ({
      ...event,
      id: asText(event.id, `random-${index + 1}`),
      title: asText(event.title, `随机事件 ${index + 1}`),
      description: asText(event.description),
      relatedStateKeys: asStringArray(event.relatedStateKeys),
      probabilityFormulaDescription: asText(event.probabilityFormulaDescription),
      successText: asText(event.successText),
      failureText: asText(event.failureText),
      successEffects:
        event.successEffects && typeof event.successEffects === "object" && !Array.isArray(event.successEffects)
          ? Object.fromEntries(Object.entries(event.successEffects).map(([key, value]) => [key, Number(value ?? 0)]))
          : {},
      failureEffects:
        event.failureEffects && typeof event.failureEffects === "object" && !Array.isArray(event.failureEffects)
          ? Object.fromEntries(Object.entries(event.failureEffects).map(([key, value]) => [key, Number(value ?? 0)]))
          : {},
    })),
    endings: rawEndings.map((ending, index) => ({
      ...ending,
      id: asText(ending.id, `ending-${index + 1}`),
      title: asText(ending.title, `结局 ${index + 1}`),
      priority: Number(ending.priority ?? index),
      conditionDescription: asText(ending.conditionDescription),
      summary: asText(ending.summary),
      historyComparison: asText(ending.historyComparison),
      counterfactualExplanation: asText(ending.counterfactualExplanation),
      endingNarration: normalizeDialogueBlocks(ending.endingNarration, asText(ending.summary) || "历史走向在此收束。"),
      backgroundImage: asText(ending.backgroundImage) || asText(endingBackgrounds[ending.id]) || DEFAULT_SCENE_BACKGROUND,
    })),
  });

  return normalizeDecisionRoutes(normalizeNodeNpcData(config));
}

function parseSseChunk(chunk: string, carry: string) {
  const text = (carry + chunk).replace(/\r\n/g, "\n");
  const parts = text.split("\n\n");
  return {
    events: parts.slice(0, -1).map((part) => {
      const event = part
        .split("\n")
        .find((line) => line.startsWith("event:"))
        ?.replace(/^event:\s*/, "")
        .trim();
      const data = part
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.replace(/^data:\s*/, ""))
        .join("\n");
      return { event: event || "message", data };
    }),
    carry: parts[parts.length - 1] ?? "",
  };
}

async function saveGeneratedConfig(config: HistoricalGameConfig, rawText: string, usedMock: boolean) {
  const response = await fetch("/api/configs/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config, rawText, usedMock }),
  });
  if (!response.ok) return {};
  return (await response.json()) as { filePath?: string; rawPath?: string };
}

async function saveFailedRaw(rawText: string, error: string, sourceText: string) {
  const response = await fetch("/api/configs/save-failed-raw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText, error, sourceText }),
  });
  if (!response.ok) return {};
  return (await response.json()) as { rawPath?: string; metaPath?: string };
}

export async function fetchSavedGeneratedConfigs(): Promise<HistoricalGameConfig[]> {
  try {
    const response = await fetch("/api/configs");
    if (!response.ok) return [];
    const data = (await response.json()) as { configs?: HistoricalGameConfig[] };
    return (data.configs ?? []).map((config) => normalizeGeneratedConfig(config, asText(config.title, config.id)));
  } catch {
    return [];
  }
}

export async function generateHistoricalGameConfig(
  sourceText: string,
  _fallbackConfig: HistoricalGameConfig,
  callbacks: PipelineStreamCallbacks = {},
): Promise<PipelineGenerateResult> {
  const text = sourceText.trim();
  if (!text) {
    const error = "请输入历史事件资料后再生成。";
    callbacks.onLog?.(`[client:error] ${error}`);
    callbacks.onSteps?.(markSteps(0, false, true));
    return markFailed(error);
  }

  let rawText = "";
  let carry = "";
  callbacks.onSteps?.(markSteps(0));
  callbacks.onLog?.("[client] 开始请求后端流式生成接口。");

  try {
    const response = await fetch("/api/pipeline/generate-stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceText: text }),
    });
    if (!response.ok || !response.body) {
      throw new Error(`Pipeline stream failed: ${response.status}`);
    }

    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let upstreamError = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const parsed = parseSseChunk(decoder.decode(value, { stream: true }), carry);
      carry = parsed.carry;

      for (const item of parsed.events) {
        const data = item.data ? JSON.parse(item.data) : {};
        if (item.event === "token") {
          rawText += String(data.token ?? "");
          callbacks.onToken?.(String(data.token ?? ""), rawText);
          callbacks.onSteps?.(estimateSteps(rawText));
        }
        if (item.event === "heartbeat") {
          callbacks.onToken?.(String(data.token ?? "."), rawText);
        }
        if (item.event === "stage-token") {
          callbacks.onToken?.(String(data.token ?? ""), rawText);
        }
        if (item.event === "log" || item.event === "phase") {
          callbacks.onLog?.(`[server] ${data.message ?? data.id ?? ""}`);
        }
        if (item.event === "error") {
          upstreamError = String(data.message ?? "stream error");
          callbacks.onLog?.(`[server:error] ${upstreamError}`);
        }
      }
    }

    if (upstreamError) {
      throw new Error(upstreamError);
    }

    callbacks.onLog?.("[client] 流式输出结束，开始解析 JSON。");
    const parsed = parseGeneratedConfigJson(rawText);
    const config = normalizeGeneratedConfig(parsed, text);
    const issues = validateConfig(config);
    callbacks.onSteps?.(markAllDone(config, false, issues, rawText).steps);

    const saved = await saveGeneratedConfig(config, rawText, false);
    callbacks.onLog?.(`[client] 已保存配置文件：${saved.filePath ?? "保存接口未返回路径"}`);
    return markAllDone(config, false, issues, rawText, saved.filePath, saved.rawPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    callbacks.onLog?.(`[client:error] ${message}`);
    if (rawText) {
      try {
        const saved = await saveFailedRaw(rawText, message, text);
        callbacks.onLog?.(`[client] 已保存失败原文：${saved.rawPath ?? "保存接口未返回路径"}`);
      } catch {
        callbacks.onLog?.("[client:error] 失败原文保存失败。");
      }
    }
    callbacks.onSteps?.(markSteps(Math.max(0, pipelineSteps.length - 1), false, true));
    return markFailed(message, rawText);
  }
}
