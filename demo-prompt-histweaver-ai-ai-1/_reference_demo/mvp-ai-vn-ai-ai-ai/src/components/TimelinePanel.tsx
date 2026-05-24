import { History, X } from "lucide-react";
import { useState } from "react";
import type { DialogueLine } from "../types";
import { anshiTimeline } from "../data/historyFacts";

type TimelinePanelProps = {
  history: DialogueLine[];
};

export function TimelinePanel({ history }: TimelinePanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-md border border-amber-100/25 bg-black/40 px-4 py-2 text-sm text-amber-100 backdrop-blur transition hover:bg-white/10"
      >
        <History size={17} />
        记录
      </button>
      {open && (
        <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-amber-100/20 bg-[#130e0c]/95 p-5 text-[#fff2dc] shadow-vn backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serifcn text-2xl font-semibold text-[#ffe1a8]">剧情记录</h2>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-amber-100/20 p-2 text-amber-100 transition hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
          <div className="thin-scrollbar mt-5 flex-1 space-y-5 overflow-y-auto pr-2">
            <section>
              <h3 className="mb-3 text-sm font-semibold text-cyan-100/80">安史之乱完整脉络</h3>
              <div className="space-y-3">
                {anshiTimeline.map((item) => (
                  <div key={`${item.year}-${item.title}`} className="rounded-md border border-cyan-100/10 bg-cyan-950/20 p-3">
                    <div className="text-sm text-cyan-100/65">{item.year}</div>
                    <div className="font-semibold text-cyan-50">{item.title}</div>
                    <p className="mt-1 text-xs leading-5 text-cyan-50/65">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h3 className="mb-3 text-sm font-semibold text-amber-100/80">已读对话</h3>
              <div className="space-y-3">
                {history.map((line) => (
                  <div key={line.id} className="rounded-md border border-amber-100/10 bg-black/25 p-3">
                    <div className="text-xs text-amber-100/55">{line.speaker ?? "旁白"}</div>
                    <p className="mt-1 text-sm leading-6 text-[#f6dec0]">{line.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>
      )}
    </>
  );
}
