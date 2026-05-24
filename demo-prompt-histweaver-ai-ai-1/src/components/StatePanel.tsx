import type { GameState, HistoricalGameConfig } from "../types";

interface StatePanelProps {
  config: HistoricalGameConfig;
  state: GameState;
}

export function StatePanel({ config, state }: StatePanelProps) {
  return (
    <aside className="glass-panel rounded-xl p-4 text-stone-100">
      <h3 className="mb-3 text-sm font-semibold text-amber-100">状态变量</h3>
      <div className="space-y-3">
        {config.stateSchema.map((item) => {
          const value = state[item.key] ?? item.defaultValue;
          const percent = ((value - item.min) / (item.max - item.min)) * 100;
          return (
            <div key={item.key}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span>{item.label}</span>
                <span className="text-stone-300">{value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/35">
                <div className="h-full rounded-full bg-amber-200" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
              </div>
              <p className="mt-1 text-xs leading-5 text-stone-300">{item.description}</p>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
