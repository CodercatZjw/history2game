import type { HistoricalGameConfig } from "../types";

interface TimelinePanelProps {
  config: HistoricalGameConfig;
  activeNodeId?: string;
}

export function TimelinePanel({ config, activeNodeId }: TimelinePanelProps) {
  return (
    <aside className="glass-panel rounded-xl p-4 text-stone-100">
      <h3 className="mb-3 text-sm font-semibold text-amber-100">历史弧线</h3>
      <div className="space-y-3">
        {config.timeline.map((item) => (
          <div key={item.id} className="border-l border-amber-100/18 pl-3">
            <p className="text-xs text-amber-100">{item.year} / {item.location}</p>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="mt-1 text-xs leading-5 text-stone-300">{item.description}</p>
          </div>
        ))}
      </div>
      {activeNodeId ? <p className="mt-3 text-xs text-stone-400">当前节点：{activeNodeId}</p> : null}
    </aside>
  );
}
