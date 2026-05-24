import { GitBranch } from "lucide-react";
import type { ChoiceOption } from "../types";

type ChoicePanelProps = {
  choices: ChoiceOption[];
  onChoose: (choice: ChoiceOption) => void;
  disabled?: boolean;
};

export function ChoicePanel({ choices, onChoose, disabled }: ChoicePanelProps) {
  return (
    <section className="glass-panel pointer-events-auto w-full max-w-3xl rounded-lg p-4">
      <div className="mb-3 flex items-center gap-2 text-[#ffe1a8]">
        <GitBranch size={18} />
        <h2 className="font-serifcn text-xl font-semibold">关键决策</h2>
      </div>
      <div className="grid gap-3">
        {choices.map((choice) => (
          <button
            key={choice.id}
            disabled={disabled}
            onClick={() => onChoose(choice)}
            className="choice-button rounded-md p-4 text-left transition disabled:cursor-wait disabled:opacity-60"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#ffe8bf]">{choice.label}</span>
              {choice.historicalTag && (
                <span className="rounded-full border border-amber-100/25 px-2 py-0.5 text-xs text-amber-100/70">
                  {choice.historicalTag}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-[#ead5bc]">{choice.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
