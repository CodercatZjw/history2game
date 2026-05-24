import { ChevronRight, MessageSquareText } from "lucide-react";
import type { GamePhase, VNDialogueLine } from "../types";
import { useTypewriter } from "../hooks/useTypewriter";

type DialogueBoxProps = {
  line: VNDialogueLine | null;
  phase: GamePhase;
  canContinue: boolean;
  onContinue: () => void;
  compact?: boolean;
};

const typeLabel: Record<VNDialogueLine["type"], string> = {
  narration: "旁白",
  dialogue: "台词",
  system: "系统",
  player: "你的提问",
  ai: "自由询问",
  result: "后果"
};

export function DialogueBox({ line, phase, canContinue, onContinue, compact = false }: DialogueBoxProps) {
  const text = line?.text ?? "";
  const { displayedText, isComplete, skip } = useTypewriter(text, 16);
  const speaker =
    line?.speaker ??
    (line?.purpose === "inquiry_setup"
      ? "抉择前"
      : line?.type === "narration" || line?.type === "result"
        ? "旁白"
        : "系统");
  const lineLabel = line ? line.promptHint ?? typeLabel[line.type] : "等待剧情";

  const handleAdvance = () => {
    if (!line) return;
    if (!isComplete) {
      skip();
      return;
    }
    if (canContinue) {
      onContinue();
    }
  };

  return (
    <section
      onClick={handleAdvance}
      className={`glass-panel safe-bottom pointer-events-auto w-full rounded-lg text-[#fff3da] ${
        compact ? "px-4 py-3 sm:px-5 sm:py-3" : "px-5 py-4 sm:px-7 sm:py-5"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleAdvance();
        }
      }}
    >
      <div className={`${compact ? "mb-2" : "mb-3"} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#f1b866] text-[#2a130d]">
            <MessageSquareText size={19} />
          </span>
          <div className="min-w-0">
            <div className={`truncate font-serifcn font-semibold text-[#ffe2aa] ${compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"}`}>
              {speaker}
            </div>
            <div className="text-xs text-amber-100/65">{lineLabel}</div>
          </div>
        </div>
        <div className="rounded-full border border-amber-100/20 px-3 py-1 text-xs text-amber-100/70">
          {phase === "inquiry" ? "询问阶段" : phase === "decision" ? "决策阶段" : "剧情推进"}
        </div>
      </div>

      <p
        className={`whitespace-pre-wrap break-words text-[#fff7e9] ${
          compact ? "min-h-[3.5rem] text-sm leading-7 sm:text-base sm:leading-7" : "min-h-[6.5rem] text-base leading-8 sm:text-lg sm:leading-9"
        }`}
      >
        {displayedText}
        {!isComplete && <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-amber-200 align-middle" />}
      </p>

      <div className="mt-3 flex justify-end">
        {canContinue && (
          <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-amber-100 transition hover:bg-white/10">
            {isComplete ? "继续" : "跳过动画"}
            <ChevronRight size={17} />
          </button>
        )}
      </div>
    </section>
  );
}
