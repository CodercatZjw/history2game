import { BookOpen, Goal, Scale } from "lucide-react";
import type { PlayableRole, StoryNode } from "../types";

interface ContextPanelProps {
  node: StoryNode;
  role: PlayableRole;
}

export function ContextPanel({ node, role }: ContextPanelProps) {
  const intro = node.nodeIntroForRoles[role.id];

  return (
    <section className="glass-panel min-w-0 overflow-x-hidden rounded-xl p-4 text-stone-100">
      <div className="mb-3">
        <p className="text-xs text-amber-100">{node.year} / {node.location}</p>
        <h3 className="text-lg font-semibold">{node.title}</h3>
        <p className="mt-1 text-sm leading-6 text-stone-200">{node.shortContext}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="min-w-0 break-words rounded-md border border-amber-100/15 bg-black/22 p-3">
          <BookOpen className="mb-2 h-4 w-4 text-amber-100" />
          <p className="text-xs font-semibold text-stone-100">局势说明</p>
          <p className="mt-1 text-xs leading-5 text-stone-300">{intro?.currentSituation ?? node.detailedContext}</p>
        </div>
        <div className="min-w-0 break-words rounded-md border border-amber-100/15 bg-black/22 p-3">
          <Scale className="mb-2 h-4 w-4 text-amber-100" />
          <p className="text-xs font-semibold text-stone-100">信息冲突</p>
          <p className="mt-1 text-xs leading-5 text-stone-300">{intro?.informationConflict ?? node.conflict}</p>
        </div>
        <div className="min-w-0 break-words rounded-md border border-amber-100/15 bg-black/22 p-3">
          <Goal className="mb-2 h-4 w-4 text-amber-100" />
          <p className="text-xs font-semibold text-stone-100">当前压力</p>
          <p className="mt-1 text-xs leading-5 text-stone-300">{intro?.playerPressure ?? role.dilemma}</p>
        </div>
      </div>
      <details className="mt-3 rounded-md border border-amber-100/15 bg-black/22 p-3">
        <summary className="cursor-pointer text-sm font-medium text-amber-100">展开背景与术语</summary>
        <p className="mt-3 text-sm leading-6 text-stone-200">{node.detailedContext}</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {node.glossary.map((item) => (
            <div key={item.term} className="rounded-md border border-amber-100/15 p-3">
              <p className="text-xs font-semibold text-amber-100">{item.term}</p>
              <p className="mt-1 text-xs leading-5 text-stone-300">{item.explanation}</p>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
