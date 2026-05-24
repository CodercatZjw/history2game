import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { GameState } from "../types";
import { coreStateDisplays, detailedStateDisplays } from "../services/gameEngine";

type StatePanelProps = {
  state: GameState;
};

export function StatePanel({ state }: StatePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const displays = expanded ? detailedStateDisplays : coreStateDisplays;

  return (
    <section className="glass-panel pointer-events-auto w-full rounded-lg p-4 lg:w-80">
      <button
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left text-[#ffe1a8]"
      >
        <span className="inline-flex items-center gap-2 font-serifcn text-lg font-semibold">
          <Activity size={18} />
          状态面板
        </span>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <div className={`${expanded ? "mt-4 space-y-3" : "hidden sm:mt-4 sm:block sm:space-y-3"}`}>
        {displays.map((item) => {
          const value = state[item.key];
          const bar =
            item.tone === "good"
              ? "bg-emerald-300"
              : item.tone === "bad"
                ? "bg-rose-300"
                : "bg-amber-300";
          return (
            <div key={item.key}>
              <div className="mb-1 flex items-center justify-between text-xs text-amber-100/75">
                <span>{item.label}</span>
                <span>{value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/45">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
