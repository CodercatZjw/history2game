import { ChevronRight } from "lucide-react";
import type { DialogueBlock } from "../types";
import { useTypewriter } from "../hooks/useTypewriter";

interface DialogueBoxProps {
  block?: DialogueBlock;
  onContinue?: () => void;
  continueLabel?: string;
  disabled?: boolean;
}

export function DialogueBox({ block, onContinue, continueLabel = "继续", disabled }: DialogueBoxProps) {
  const { visibleText, done, skip } = useTypewriter(block?.text ?? "");

  if (!block) return null;
  const isThinking = block.emotion === "thinking";

  const handleClick = () => {
    if (isThinking) return;
    if (!done) {
      skip();
      return;
    }
    onContinue?.();
  };

  return (
    <div className={`glass-panel w-full rounded-xl p-4 md:p-5 ${onContinue ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div className="flex gap-4">
        {block.portraitImage ? (
          <img
            src={block.portraitImage}
            alt={block.speakerName ?? "speaker"}
            className="h-16 w-16 shrink-0 rounded-md border border-amber-100/25 object-cover"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-amber-100">{block.speakerName ?? "旁白"}</p>
              {block.emotion ? <p className="text-xs text-stone-300">{block.emotion}</p> : null}
            </div>
            {onContinue && !isThinking ? (
              <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className="choice-button inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-amber-50 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {done ? continueLabel : "显示全部"}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          {isThinking ? (
            <div className="min-h-[4.5rem] text-base leading-8 text-stone-50 md:text-lg">
              <span>{block.text}</span>
              <span className="thinking-dots ml-1" aria-hidden="true">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          ) : (
            <p className="min-h-[4.5rem] text-base leading-8 text-stone-50 md:text-lg">{visibleText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
