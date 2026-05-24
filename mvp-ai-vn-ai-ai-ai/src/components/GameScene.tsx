import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpenText, Crown, Hourglass, MapPinned, Target, UserRound } from "lucide-react";
import type {
  Character,
  ChoiceOption,
  DecisionRecord,
  DialogueLine,
  EndingPayload,
  GameMode,
  GamePhase,
  GameState,
  RandomOutcome,
  StoryEvent
} from "../types";
import { askNpc } from "../services/chatService";
import {
  applyStateEffects,
  createInitialState,
  getEventById,
  getEventRoleView,
  makeSystemLine
} from "../services/gameEngine";
import { resolveRandomEvent, formatChance } from "../services/randomEngine";
import { selectEndingId } from "../services/endingEngine";
import { eventBriefs } from "../data/historyFacts";
import { sceneAssets } from "../data/assets";
import { DialogueBox } from "./DialogueBox";
import { ChoicePanel } from "./ChoicePanel";
import { FreeChatPanel } from "./FreeChatPanel";
import { StatePanel } from "./StatePanel";
import { TimelinePanel } from "./TimelinePanel";

type ResolutionTarget = {
  endingId?: string;
  nextEventId?: string;
};

type GameSceneProps = {
  playerRole: Character;
  mode: GameMode;
  onFinish: (payload: EndingPayload) => void;
};

const firstEventId = "tongguan_battle";

export function GameScene({ playerRole, mode, onFinish }: GameSceneProps) {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(mode));
  const [currentEvent, setCurrentEvent] = useState<StoryEvent>(() => getEventById(firstEventId));
  const [phase, setPhase] = useState<GamePhase>("script");
  const [pendingLines, setPendingLines] = useState<DialogueLine[]>([]);
  const [currentLine, setCurrentLine] = useState<DialogueLine | null>(null);
  const [history, setHistory] = useState<DialogueLine[]>([]);
  const [remainingQuestions, setRemainingQuestions] = useState(3);
  const [backgroundImage, setBackgroundImage] = useState(currentEvent.backgroundImage);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [resolutionTarget, setResolutionTarget] = useState<ResolutionTarget | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [thinkingNpcName, setThinkingNpcName] = useState<string | null>(null);
  const startedRef = useRef(false);
  const currentView = useMemo(() => getEventRoleView(currentEvent, playerRole.id), [currentEvent, playerRole.id]);
  const eventBrief = useMemo(() => eventBriefs[currentEvent.id], [currentEvent.id]);

  const appendAndShowLine = useCallback((line: DialogueLine) => {
    setCurrentLine(line);
    if (line.backgroundImage) {
      setBackgroundImage(line.backgroundImage);
    }
    setHistory((items) => [...items, line]);
  }, []);

  const enterEvent = useCallback(
    (eventId: string, reset = false) => {
      const event = getEventById(eventId);
      const view = getEventRoleView(event, playerRole.id);
      setCurrentEvent(event);
      setPhase("script");
      setResolutionTarget(null);
      setRemainingQuestions(view.defaultInquiryLimit);
      setBackgroundImage(view.backgroundImage);
      setPendingLines(view.script.slice(1));
      if (reset) {
        setHistory([]);
        setDecisions([]);
      }
      appendAndShowLine(view.script[0]);
    },
    [appendAndShowLine, playerRole.id]
  );

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    enterEvent(firstEventId, true);
  }, [enterEvent]);

  const finishWithEnding = useCallback(() => {
    if (!resolutionTarget?.endingId) return;
    onFinish({
      endingId: resolutionTarget.endingId,
      state: gameState,
      decisions,
      history
    });
  }, [decisions, gameState, history, onFinish, resolutionTarget]);

  const continueLine = () => {
    if (pendingLines.length > 0) {
      const [nextLine, ...rest] = pendingLines;
      setPendingLines(rest);
      appendAndShowLine(nextLine);
      return;
    }

    if (phase === "script") {
      appendAndShowLine({
        id: `inquiry-setup-${currentEvent.id}-${playerRole.id}`,
        speaker: null,
        text: `${currentView.inquirySetup.urgency}\n\n${currentView.inquirySetup.question}`,
        type: "system",
        purpose: "inquiry_setup",
        intent: "让玩家带着明确问题进入有限询问",
        promptHint: currentView.inquirySetup.title,
        sourceId: `${currentEvent.id}:${playerRole.id}:inquiry_setup`,
        backgroundImage,
        mood: "urgent"
      });
      setPhase("inquiry");
      return;
    }

    if (phase === "resolution") {
      if (resolutionTarget?.endingId) {
        finishWithEnding();
        return;
      }
      if (resolutionTarget?.nextEventId) {
        enterEvent(resolutionTarget.nextEventId);
      }
    }
  };

  const canContinue = phase === "script" || phase === "resolution";

  const enterDecisionPhase = (reason: "skip" | "exhausted") => {
    const text =
      reason === "skip"
        ? "你主动结束了询问。军情与人心都不会再等待，必须作出决策。"
        : "询问次数已经用尽。所有犹疑都被推到刀锋之前，必须作出决策。";
    const line = makeSystemLine(`decision-${currentEvent.id}-${Date.now()}`, text, backgroundImage, {
      purpose: "decision",
      intent: "收束有限询问并进入关键选择",
      promptHint: "进入决策",
      sourceId: `${currentEvent.id}:${playerRole.id}:decision`
    });
    appendAndShowLine(line);
    setPhase("decision");
  };

  const handleAskNpc = async (npcId: string, message: string) => {
    if (remainingQuestions <= 0 || loadingChat) return;

    const npc = currentView.inquiryNpcs.find((item) => item.id === npcId);
    const playerLine: DialogueLine = {
      id: `player-${Date.now()}`,
      speaker: playerRole.name,
      text: message,
      type: "player",
      purpose: "free_chat",
      promptHint: "你的提问",
      backgroundImage
    };

    appendAndShowLine(playerLine);
    setThinkingNpcName(npc?.name ?? "对方");
    setLoadingChat(true);

    const response = await askNpc({
      npcId,
      eventId: currentEvent.id,
      playerRole: playerRole.id,
      playerRoleName: playerRole.name,
      playerRoleIdentity: playerRole.identity,
      npcName: npc?.name,
      npcIdentity: npc?.identity,
      npcAttitude: npc?.attitude,
      eventTitle: currentEvent.title,
      eventSummary: currentEvent.summary,
      perspectiveTitle: currentView.perspectiveTitle,
      playerObjective: currentView.objective,
      perspectiveLimitation: currentView.limitation,
      decisionQuestion: eventBrief?.playerQuestion,
      decisionOptions: currentView.choices.map((choice) => ({
        id: choice.id,
        label: choice.label,
        description: choice.description,
        historicalTag: choice.historicalTag
      })),
      message,
      gameState
    });

    const replyLine: DialogueLine = {
      id: `ai-${npcId}-${Date.now()}`,
      speaker: npc?.name ?? "对方",
      text: response.reply,
      type: "ai",
      purpose: "free_chat",
      promptHint: "对方回应",
      backgroundImage,
      mood: "calm"
    };

    appendAndShowLine(replyLine);
    setLoadingChat(false);
    setThinkingNpcName(null);

    const nextRemaining = remainingQuestions - 1;
    setRemainingQuestions(nextRemaining);
    if (nextRemaining <= 0) {
      setPhase("decision");
    }
  };

  const makeRandomLines = (choice: ChoiceOption, outcome: RandomOutcome): DialogueLine[] => [
    {
      id: `${choice.id}-${outcome.eventId}-narration`,
      speaker: null,
      text: outcome.narration,
      type: "result",
      backgroundImage,
      mood: outcome.success ? "hopeful" : "urgent"
    },
    {
      id: `${choice.id}-${outcome.eventId}-system`,
      speaker: null,
      text: `${outcome.systemText}（成功阈值 ${formatChance(outcome.threshold)}，本次掷出 ${formatChance(
        outcome.roll
      )}。）`,
      type: "system",
      backgroundImage,
      mood: outcome.success ? "hopeful" : "tense"
    }
  ];

  const handleChoose = (choice: ChoiceOption) => {
    let nextState = applyStateEffects(gameState, choice.stateEffects);
    let randomOutcome: RandomOutcome | undefined;

    if (choice.randomEventId) {
      randomOutcome = resolveRandomEvent(choice.randomEventId, nextState);
      nextState = applyStateEffects(nextState, randomOutcome.stateEffects);
    }

    const endingId = selectEndingId({
      event: currentEvent,
      choice,
      state: nextState,
      randomOutcome
    });

    const nextDecision: DecisionRecord = {
      eventId: currentEvent.id,
      eventTitle: currentEvent.title,
      choiceId: choice.id,
      choiceLabel: choice.label,
      outcomeTitle: randomOutcome?.title,
      success: randomOutcome?.success
    };

    const resolutionLines = [
      ...choice.resultLines,
      ...(randomOutcome ? makeRandomLines(choice, randomOutcome) : [])
    ];

    if (!endingId && choice.nextEventId) {
      const nextEvent = getEventById(choice.nextEventId);
      const nextView = getEventRoleView(nextEvent, playerRole.id);
      resolutionLines.push(
        makeSystemLine(
          `${choice.id}-next-${choice.nextEventId}`,
          `局势继续推进：下一节点将进入「${nextEvent.title}」，视角为「${nextView.perspectiveTitle}」。`,
          nextView.backgroundImage
        )
      );
    }

    setGameState(nextState);
    setDecisions((items) => [...items, nextDecision]);
    setPhase("resolution");
    setResolutionTarget({
      endingId,
      nextEventId: endingId ? undefined : choice.nextEventId
    });
    setPendingLines(resolutionLines.slice(1));
    appendAndShowLine(resolutionLines[0]);
  };

  const headerMeta = useMemo(
    () => [
      { icon: MapPinned, label: currentEvent.chapter },
      { icon: Hourglass, label: currentEvent.title },
      { icon: UserRound, label: `扮演：${playerRole.name}` },
      { icon: Crown, label: `询问：${remainingQuestions}` }
    ],
    [currentEvent.chapter, currentEvent.title, playerRole.name, remainingQuestions]
  );

  return (
    <main className="vn-bg relative min-h-screen overflow-hidden text-[#fff3dc]" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="vn-scrim absolute inset-0 transition-opacity duration-500" />

      <div className="pointer-events-none relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-6">
        <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-3">
          <div className="glass-panel flex flex-wrap items-center gap-2 rounded-lg px-3 py-2">
            {headerMeta.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-md bg-black/20 px-3 py-1.5 text-xs text-amber-100/85 sm:text-sm"
                >
                  <Icon size={15} />
                  {item.label}
                </span>
              );
            })}
          </div>
          <TimelinePanel history={history} />
        </header>

        <div className="mt-4 flex flex-col items-start justify-between gap-4 lg:flex-row">
          <div className="pointer-events-auto flex max-w-3xl flex-col gap-3">
            <section className="glass-panel rounded-lg p-4">
              <div className="mb-2 flex items-center gap-2 text-[#ffe1a8]">
                <Target size={18} />
                <h2 className="font-serifcn text-lg font-semibold">{currentView.perspectiveTitle}</h2>
              </div>
              <p className="text-sm leading-6 text-[#f6dec0]">
                <span className="text-amber-200">目标：</span>
                {currentView.objective}
              </p>
              <p className="mt-1 text-sm leading-6 text-cyan-50/80">
                <span className="text-cyan-100">视角局限：</span>
                {currentView.limitation}
              </p>
            </section>

            {eventBrief && (
              <section
                className={`glass-panel max-h-[38vh] overflow-y-auto rounded-lg p-4 ${
                  phase === "script" ? "hidden md:block" : "hidden 2xl:block"
                }`}
              >
                <div className="mb-3 flex items-center gap-2 text-[#ffe1a8]">
                  <BookOpenText size={18} />
                  <h2 className="font-serifcn text-lg font-semibold">{eventBrief.title}</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
                  <div>
                    <p className="text-sm leading-6 text-[#f6dec0]">{eventBrief.plainSummary}</p>
                    <div className="mt-3 space-y-2 text-xs leading-5 text-cyan-50/78">
                      {eventBrief.stakes.map((item) => (
                        <p key={item}>• {item}</p>
                      ))}
                    </div>
                    <p className="mt-3 rounded-md border border-amber-100/15 bg-amber-900/18 px-3 py-2 text-sm leading-6 text-amber-100">
                      {eventBrief.playerQuestion}
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-md border border-cyan-100/15 bg-black/20">
                    <img src={sceneAssets.map} alt="安史之乱路线示意图" className="h-32 w-full object-cover md:h-full" />
                    <div className="space-y-1 px-3 py-2 text-xs leading-5 text-cyan-50/75">
                      {eventBrief.terms.slice(0, 2).map((item) => (
                        <p key={item.term}>
                          <span className="text-cyan-100">{item.term}：</span>
                          {item.explanation}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
          <StatePanel state={gameState} />
        </div>

        <section className="pointer-events-none mx-auto mt-auto flex w-full max-w-5xl flex-col items-center gap-4 pb-4">
          {phase === "inquiry" && (
            <DialogueBox
              line={currentLine}
              phase={phase}
              canContinue={canContinue}
              onContinue={continueLine}
              compact
              thinkingName={loadingChat ? thinkingNpcName : null}
            />
          )}

          {phase === "inquiry" && (
            <FreeChatPanel
              npcs={currentView.inquiryNpcs}
              setup={currentView.inquirySetup}
              remaining={remainingQuestions}
              loading={loadingChat}
              onAsk={handleAskNpc}
              onSkip={() => enterDecisionPhase("skip")}
            />
          )}

          {phase === "decision" && <ChoicePanel choices={currentView.choices} onChoose={handleChoose} />}

          {phase !== "inquiry" && (
            <DialogueBox line={currentLine} phase={phase} canContinue={canContinue} onContinue={continueLine} />
          )}
        </section>
      </div>
    </main>
  );
}
