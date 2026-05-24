import { GitBranch } from "lucide-react";
import type { DecisionOption } from "../types";

interface ChoicePanelProps {
  decisions: DecisionOption[];
  onChoose: (decision: DecisionOption) => void;
  onContinueWithoutChoice?: () => void;
}

export function ChoicePanel({ decisions, onChoose, onContinueWithoutChoice }: ChoicePanelProps) {
  return (
    <section className="glass-panel rounded-xl p-4 text-stone-100">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-100">
        <GitBranch className="h-4 w-4" />
        做出选择
      </div>
      {!decisions.length && (
        <div className="rounded-lg border border-amber-100/20 bg-black/20 p-4">
          <p className="text-sm leading-6 text-stone-200">
            当前节点没有匹配到这个角色的选项。系统会跳过这段串线内容，继续沿当前角色路线推进。
          </p>
          {onContinueWithoutChoice && (
            <button
              type="button"
              onClick={onContinueWithoutChoice}
              className="mt-3 rounded-md border border-amber-200/50 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-100/10"
            >
              继续当前角色路线
            </button>
          )}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {decisions.map((decision) => (
          <button
            key={decision.id}
            type="button"
            onClick={() => onChoose(decision)}
            className="choice-button group rounded-lg p-4 text-left transition"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-stone-50">{decision.text}</p>
              <span className="rounded-md bg-black/25 px-2 py-1 text-xs text-amber-100">{decision.type}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-200">{decision.description}</p>
            <p className="mt-3 text-xs leading-5 text-stone-300/75">{decision.historicalExplanation}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
