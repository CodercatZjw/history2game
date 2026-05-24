import { ArrowLeft, Info } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  DecisionOption,
  DialogueBlock,
  GameState,
  HistoricalGameConfig,
  InquiryTurn,
} from "../types";
import { askNpc } from "../services/chatService";
import {
  applyStateEffects,
  createInitialState,
  getAvailableDecisions,
  getFirstNodeForRole,
  getNextRoleNodeId,
  getNodeById,
  getNpcById,
  getRoleById,
  getSafeDecisionNextNodeId,
  getScriptForRole,
} from "../services/gameEngine";
import { resolveEnding } from "../services/endingEngine";
import { runRandomEvent } from "../services/randomEngine";
import { ChoicePanel } from "./ChoicePanel";
import { ContextPanel } from "./ContextPanel";
import { DialogueBox } from "./DialogueBox";
import { EndingPage } from "./EndingPage";
import { GameScene } from "./GameScene";
import { InquiryPanel } from "./InquiryPanel";
import { StatePanel } from "./StatePanel";
import { TimelinePanel } from "./TimelinePanel";

type Phase = "script" | "inquiry" | "decision" | "result" | "endingNarration" | "ending";

interface GameRunnerProps {
  config: HistoricalGameConfig;
  roleId: string;
  initialStage?: "script" | "inquiry" | "decision" | "ending";
  onBack: () => void;
  onRestart: () => void;
}

function buildInquiryLead(nodeTitle: string, text: string): DialogueBlock {
  return {
    id: `${nodeTitle}-inquiry-lead`,
    type: "narration",
    speakerName: "旁白",
    text,
  };
}

export function GameRunner({ config, roleId, initialStage = "script", onBack, onRestart }: GameRunnerProps) {
  const role = useMemo(() => getRoleById(config, roleId), [config, roleId]);
  const [currentNodeId, setCurrentNodeId] = useState(() => getFirstNodeForRole(config, role).id);
  const currentNode = useMemo(() => getNodeById(config, currentNodeId), [config, currentNodeId]);
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(config, role));
  const [visitedNodeIds, setVisitedNodeIds] = useState<string[]>([currentNodeId]);
  const [phase, setPhase] = useState<Phase>(initialStage === "ending" ? "ending" : initialStage);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [remainingQuestions, setRemainingQuestions] = useState(currentNode.dialogueLimit);
  const [inquiryHistory, setInquiryHistory] = useState<InquiryTurn[]>([]);
  const [activeBlock, setActiveBlock] = useState<DialogueBlock | undefined>(() => {
    if (initialStage === "inquiry" || initialStage === "decision") {
      const stageIntro = currentNode.nodeIntroForRoles[role.id];
      return buildInquiryLead(
        currentNode.id,
        [
          stageIntro?.currentSituation,
          stageIntro?.informationConflict,
          stageIntro?.playerPressure,
          stageIntro?.inquiryPurpose,
          `你还有 ${currentNode.dialogueLimit} 次询问机会，必须判断谁在说真话，谁在推卸责任，谁在试图影响你的选择。`,
        ]
          .filter(Boolean)
          .join(" "),
      );
    }
    return getScriptForRole(currentNode, role)[0];
  });
  const [resultQueue, setResultQueue] = useState<DialogueBlock[]>([]);
  const [resultIndex, setResultIndex] = useState(0);
  const [isAsking, setIsAsking] = useState(false);
  const [ending, setEnding] = useState(() => resolveEnding(config, gameState, role, visitedNodeIds));
  const [endingIndex, setEndingIndex] = useState(0);

  const intro = currentNode.nodeIntroForRoles[role.id];
  const availableDecisions = useMemo(() => getAvailableDecisions(currentNode, role), [currentNode, role]);
  const backgroundImage = activeBlock?.backgroundImage ?? currentNode.backgroundImage ?? config.assets.defaultBackground;

  const goToNode = (nodeId: string) => {
    const nextNode = getNodeById(config, nodeId);
    setCurrentNodeId(nextNode.id);
    setVisitedNodeIds((items) => [...items, nextNode.id]);
    setScriptIndex(0);
    setRemainingQuestions(nextNode.dialogueLimit);
    setInquiryHistory([]);
    setResultQueue([]);
    setResultIndex(0);
    setPhase("script");
    setActiveBlock(getScriptForRole(nextNode, role)[0]);
  };

  const startInquiry = () => {
    const text = [
      intro?.currentSituation,
      intro?.informationConflict,
      intro?.playerPressure,
      intro?.inquiryPurpose,
      `你还有 ${currentNode.dialogueLimit} 次询问机会，必须判断谁在说真话，谁在推卸责任，谁在试图影响你的选择。`,
    ]
      .filter(Boolean)
      .join(" ");
    setPhase("inquiry");
    setActiveBlock(buildInquiryLead(currentNode.id, text));
  };

  const continueScript = () => {
    if (phase === "script") {
      const script = getScriptForRole(currentNode, role);
      const nextIndex = scriptIndex + 1;
      if (nextIndex < script.length) {
        setScriptIndex(nextIndex);
        setActiveBlock(script[nextIndex]);
      } else {
        startInquiry();
      }
      return;
    }

    if (phase === "result") {
      const nextIndex = resultIndex + 1;
      if (nextIndex < resultQueue.length) {
        setResultIndex(nextIndex);
        setActiveBlock(resultQueue[nextIndex]);
        return;
      }
      const lastDecision = resultQueue.find((block) => block.next);
      if (lastDecision?.next) {
        goToNode(lastDecision.next);
        return;
      }
      const nextNodeId = getNextRoleNodeId(role, currentNode.id);
      if (nextNodeId) {
        goToNode(nextNodeId);
        return;
      }
      const resolved = resolveEnding(config, gameState, role, visitedNodeIds);
      setEnding(resolved);
      setPhase("endingNarration");
      setEndingIndex(0);
      setActiveBlock(resolved.endingNarration[0]);
      return;
    }

    if (phase === "endingNarration") {
      const nextIndex = endingIndex + 1;
      if (nextIndex < ending.endingNarration.length) {
        setEndingIndex(nextIndex);
        setActiveBlock(ending.endingNarration[nextIndex]);
      } else {
        setPhase("ending");
      }
    }
  };

  const handleAsk = async (nodeNpcContext: (typeof currentNode.availableNPCs)[number], userMessage: string) => {
    const npc = getNpcById(config, nodeNpcContext.npcId);
    if (!npc || remainingQuestions <= 0) return;
    setIsAsking(true);
    const question: DialogueBlock = {
      id: `question-${Date.now()}`,
      type: "playerQuestion",
      speakerId: role.id,
      speakerName: role.name,
      portraitImage: role.portraitImage,
      targetId: npc.id,
      text: userMessage,
    };
    setActiveBlock(question);

    const thinkingBlock: DialogueBlock = {
      id: `thinking-${Date.now()}`,
      type: "systemResult",
      speakerId: npc.id,
      speakerName: npc.name,
      portraitImage: npc.portraitImage,
      targetId: role.id,
      text: `${npc.name}思考中`,
      emotion: "thinking",
    };
    const thinkingTimer = window.setTimeout(() => {
      setActiveBlock(thinkingBlock);
    }, 450);

    let answerText = "";
    try {
      answerText = await askNpc({
        config,
        currentNode,
        playerRole: role,
        npc,
        nodeNpcContext,
        gameState,
        userMessage,
      });
    } finally {
      window.clearTimeout(thinkingTimer);
    }

    const answer: DialogueBlock = {
      id: `answer-${Date.now()}`,
      type: "aiDialogue",
      speakerId: npc.id,
      speakerName: npc.name,
      portraitImage: npc.portraitImage,
      targetId: role.id,
      text: answerText,
    };
    setInquiryHistory((items) => [...items, { id: `${question.id}-${answer.id}`, question, answer }]);
    setRemainingQuestions((count) => Math.max(0, count - 1));
    setActiveBlock(answer);
    setIsAsking(false);
  };

  const chooseDecision = (decision: DecisionOption) => {
    const stateAfterDecision = applyStateEffects(config, gameState, decision.stateEffects);
    const randomResult = runRandomEvent(config, decision.randomEventId, stateAfterDecision);
    const nextState = randomResult?.nextState ?? stateAfterDecision;
    const safeNextNodeId = getSafeDecisionNextNodeId(config, role, currentNode, decision.nextNodeId);
    setGameState(nextState);

    const queue = [
      ...decision.resultScript.map((block) => ({
        ...block,
        next: safeNextNodeId,
      })),
      ...(randomResult ? [randomResult.dialogue] : []),
    ];
    if (!queue.length) {
      queue.push({
        id: `${decision.id}-empty`,
        type: "decisionResult",
        speakerName: "旁白",
        text: decision.historicalExplanation,
        next: safeNextNodeId,
      });
    }
    setResultQueue(queue);
    setResultIndex(0);
    setPhase("result");
    setActiveBlock(queue[0]);
  };

  const continueWithoutDecision = () => {
    const nextNodeId =
      getNextRoleNodeId(role, currentNode.id) ?? role.playableNodeIds.find((nodeId) => !visitedNodeIds.includes(nodeId));

    if (nextNodeId) {
      goToNode(nextNodeId);
      return;
    }

    const resolved = resolveEnding(config, gameState, role, visitedNodeIds);
    setEnding(resolved);
    setPhase("endingNarration");
    setEndingIndex(0);
    setActiveBlock(resolved.endingNarration[0]);
  };

  if (phase === "ending") {
    return <EndingPage config={config} role={role} ending={ending} state={gameState} onRestart={onRestart} />;
  }

  return (
    <GameScene backgroundImage={backgroundImage}>
      <div className="safe-bottom mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-4">
        <header className="glass-panel grid grid-cols-[auto_1fr] items-center gap-3 rounded-xl px-4 py-3 sm:grid-cols-[auto_1fr_auto]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-md border border-amber-100/25 px-3 py-2 text-sm text-stone-100 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </button>
          <div className="min-w-0 text-center">
            <p className="text-xs text-amber-100">{config.title} / {role.name}</p>
            <h1 className="text-lg font-semibold text-stone-50">{currentNode.title}</h1>
          </div>
          <div className="hidden items-center gap-2 text-xs text-stone-300 sm:inline-flex">
            <Info className="h-4 w-4 text-amber-100" />
            {phase === "inquiry" ? "有限询问阶段" : phase === "decision" ? "决策阶段" : "视觉小说剧情"}
          </div>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[280px_1fr_280px]">
          <div className="hidden space-y-4 lg:block">
            <StatePanel config={config} state={gameState} />
          </div>

          <div className="flex min-h-[72vh] min-w-0 flex-col justify-between gap-4">
            <div className="space-y-4 pb-44">
              {(phase === "inquiry" || phase === "decision") && <ContextPanel node={currentNode} role={role} />}
              {phase === "inquiry" && (
                <InquiryPanel
                  config={config}
                  node={currentNode}
                  role={role}
                  remaining={remainingQuestions}
                  history={inquiryHistory}
                  isAsking={isAsking}
                  onAsk={handleAsk}
                  onFinish={() => setPhase("decision")}
                />
              )}
              {phase === "decision" && (
                <ChoicePanel
                  decisions={availableDecisions}
                  onChoose={chooseDecision}
                  onContinueWithoutChoice={continueWithoutDecision}
                />
              )}
            </div>

            <div className="fixed inset-x-4 bottom-4 z-30 mx-auto max-w-3xl">
              <DialogueBox
                block={activeBlock}
                onContinue={
                  phase === "script" || phase === "result" || phase === "endingNarration" ? continueScript : undefined
                }
                continueLabel={phase === "endingNarration" ? "查看结局" : "继续"}
              />
            </div>
          </div>

          <div className="hidden space-y-4 lg:block">
            <TimelinePanel config={config} activeNodeId={currentNode.id} />
          </div>
        </div>
      </div>
    </GameScene>
  );
}
