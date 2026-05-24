import { RotateCcw, ScrollText } from "lucide-react";
import { useMemo, useState } from "react";
import type { Character, EndingPayload } from "../types";
import { resolveEnding } from "../services/endingEngine";
import { anshiTimeline } from "../data/historyFacts";
import { sceneAssets } from "../data/assets";
import { DialogueBox } from "./DialogueBox";

type EndingPageProps = {
  payload: EndingPayload;
  playerRole: Character;
  onRestart: () => void;
};

export function EndingPage({ payload, playerRole, onRestart }: EndingPageProps) {
  const ending = useMemo(() => resolveEnding(payload.endingId), [payload.endingId]);
  const [lineIndex, setLineIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(ending.closeoutLines.length === 0);
  const currentLine = ending.closeoutLines[lineIndex] ?? null;
  const backgroundImage = currentLine?.backgroundImage ?? ending.backgroundImage;

  const continueEnding = () => {
    if (lineIndex < ending.closeoutLines.length - 1) {
      setLineIndex((current) => current + 1);
      return;
    }
    setShowSummary(true);
  };

  return (
    <main className="vn-bg relative min-h-screen overflow-y-auto text-[#fff3dc]" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="vn-scrim absolute inset-0" />
      <div className="relative z-10 flex min-h-screen flex-col px-5 py-6 sm:px-8">
        {!showSummary ? (
          <section className="mt-auto mx-auto w-full max-w-5xl pb-4">
            <DialogueBox line={currentLine} phase="resolution" canContinue onContinue={continueEnding} />
          </section>
        ) : (
          <section className="glass-panel mx-auto my-auto w-full max-w-5xl rounded-lg p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-100/25 px-3 py-1 text-sm text-amber-100/75">
                  <ScrollText size={16} />
                  结局 · {ending.deviationLabel}
                </div>
                <h1 className="font-serifcn text-3xl font-semibold text-[#ffe3ad] sm:text-5xl">{ending.title}</h1>
                <p className="mt-3 text-lg text-cyan-50/80">{ending.subtitle}</p>
              </div>
              <button
                onClick={onRestart}
                className="inline-flex items-center gap-2 rounded-md bg-[#f0b15d] px-4 py-3 font-semibold text-[#2a130d] transition hover:bg-[#ffd18a]"
              >
                <RotateCcw size={18} />
                重新开始
              </button>
            </div>

            <div className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <section className="rounded-md border border-amber-100/15 bg-black/28 p-4">
                  <h2 className="mb-2 font-serifcn text-xl font-semibold text-[#ffe1a8]">结局说明</h2>
                  <p className="leading-8 text-[#f7dec0]">{ending.description}</p>
                </section>
                <section className="rounded-md border border-cyan-100/15 bg-cyan-950/20 p-4">
                  <h2 className="mb-2 font-serifcn text-xl font-semibold text-cyan-50">与正史对比</h2>
                  <p className="leading-8 text-cyan-50/80">{ending.historicalComparison}</p>
                </section>
                <section className="rounded-md border border-cyan-100/15 bg-black/30 p-4">
                  <h2 className="mb-3 font-serifcn text-xl font-semibold text-[#ffe1a8]">安史之乱完整脉络</h2>
                  <div className="grid gap-4 md:grid-cols-[13rem_1fr]">
                    <img
                      src={sceneAssets.map}
                      alt="安史之乱路线示意图"
                      className="h-40 w-full rounded-md border border-amber-100/15 object-cover md:h-full"
                    />
                    <div className="thin-scrollbar max-h-64 space-y-3 overflow-y-auto pr-2">
                      {anshiTimeline.map((item) => (
                        <div key={`${item.year}-${item.title}`} className="border-l border-amber-100/25 pl-3">
                          <div className="text-xs text-amber-100/60">{item.year}</div>
                          <div className="text-sm font-semibold text-cyan-50">{item.title}</div>
                          <p className="mt-1 text-xs leading-5 text-cyan-50/70">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-5">
                <section className="rounded-md border border-amber-100/15 bg-black/28 p-4">
                  <h2 className="mb-3 font-serifcn text-xl font-semibold text-[#ffe1a8]">本局记录</h2>
                  <div className="space-y-2 text-sm leading-6 text-[#f5ddbf]">
                    <p>
                      <span className="text-amber-200">扮演角色：</span>
                      {playerRole.name} · {playerRole.identity}
                    </p>
                    <p>
                      <span className="text-amber-200">历史偏离度：</span>
                      {payload.state.historyDeviation}
                    </p>
                    <p>
                      <span className="text-amber-200">最终中央权威：</span>
                      {payload.state.centralAuthority}
                    </p>
                    <p>
                      <span className="text-amber-200">最终军心：</span>
                      {payload.state.militaryMorale}
                    </p>
                  </div>
                </section>

                <section className="rounded-md border border-amber-100/15 bg-black/28 p-4">
                  <h2 className="mb-3 font-serifcn text-xl font-semibold text-[#ffe1a8]">关键决策</h2>
                  <div className="space-y-3">
                    {payload.decisions.map((decision) => (
                      <div key={`${decision.eventId}-${decision.choiceId}`} className="rounded-md bg-white/5 p-3">
                        <div className="text-xs text-amber-100/55">{decision.eventTitle}</div>
                        <div className="mt-1 text-sm font-semibold text-[#ffe8bf]">{decision.choiceLabel}</div>
                        {decision.outcomeTitle && (
                          <div className="mt-1 text-xs text-cyan-50/70">
                            {decision.outcomeTitle}：{decision.success ? "通过" : "失败"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
