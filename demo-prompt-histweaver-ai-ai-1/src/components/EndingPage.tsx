import { RotateCcw } from "lucide-react";
import type { EndingRule, GameState, HistoricalGameConfig, PlayableRole } from "../types";
import { StatePanel } from "./StatePanel";

interface EndingPageProps {
  config: HistoricalGameConfig;
  role: PlayableRole;
  ending: EndingRule;
  state: GameState;
  onRestart: () => void;
}

export function EndingPage({ config, role, ending, state, onRestart }: EndingPageProps) {
  return (
    <main
      className="vn-bg min-h-screen text-[#fff7e6]"
      style={{ backgroundImage: `url("${ending.backgroundImage ?? config.assets.defaultBackground}")` }}
    >
      <div className="vn-scrim">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_320px]">
        <section className="glass-panel self-center rounded-xl p-6">
          <p className="text-sm text-amber-100">{config.title} / {role.name} 路线结局</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{ending.title}</h1>
          <p className="mt-5 text-lg leading-8 text-stone-100">{ending.summary}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-amber-100/15 bg-black/22 p-4">
              <p className="text-sm font-semibold text-amber-100">与正史对照</p>
              <p className="mt-2 text-sm leading-6 text-stone-300">{ending.historyComparison}</p>
            </div>
            <div className="rounded-md border border-amber-100/15 bg-black/22 p-4">
              <p className="text-sm font-semibold text-amber-100">反事实说明</p>
              <p className="mt-2 text-sm leading-6 text-stone-300">{ending.counterfactualExplanation}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRestart}
            className="choice-button mt-6 inline-flex items-center gap-2 rounded-md px-4 py-3 font-medium text-amber-50 transition"
          >
            <RotateCcw className="h-4 w-4" />
            重新选择角色
          </button>
        </section>
        <div className="self-center">
          <StatePanel config={config} state={state} />
        </div>
      </div>
      </div>
    </main>
  );
}
