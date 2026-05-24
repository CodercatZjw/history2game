import { BookOpen, Play, Sparkles } from "lucide-react";
import type { GameMode } from "../types";
import { sceneAssets } from "../data/assets";
import { modeDescriptions } from "../data/historyFacts";

type HomePageProps = {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onStart: () => void;
};

export function HomePage({ mode, onModeChange, onStart }: HomePageProps) {
  return (
    <main
      className="vn-bg relative min-h-screen overflow-hidden text-[#fff3d9]"
      style={{ backgroundImage: `url(${sceneAssets.frontier})` }}
    >
      <div className="vn-scrim absolute inset-0" />
      <div className="relative z-10 flex min-h-screen items-center px-5 py-10 sm:px-10">
        <section className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-black/35 px-4 py-2 text-sm text-amber-100">
            <BookOpen size={16} />
            历史视觉小说 · AI 推演引擎 MVP
          </div>
          <h1 className="font-serifcn text-4xl font-semibold leading-tight text-[#ffe8b7] drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)] sm:text-6xl">
            乱世回响：安史之乱
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#f7dfbd] sm:text-lg">
            选择一位历史人物，在潼关与马嵬坡的关键节点中阅读剧情、询问 NPC、权衡军心与皇权，
            让真实历史在你的决策下走向不同分支。
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={onStart}
              className="inline-flex w-full items-center justify-center gap-3 rounded-md bg-[#f0b15d] px-6 py-4 text-base font-semibold text-[#2a130d] shadow-glow transition hover:bg-[#ffd18a] sm:w-auto"
            >
              <Play size={20} fill="currentColor" />
              开始游戏
            </button>

            <div className="glass-panel flex w-full overflow-hidden rounded-md p-1 sm:w-auto">
              <button
                onClick={() => onModeChange("historical")}
                className={`flex-1 rounded px-4 py-3 text-sm transition ${
                  mode === "historical" ? "bg-amber-200 text-[#2b1712]" : "text-amber-100 hover:bg-white/10"
                }`}
              >
                历史模式
              </button>
              <button
                onClick={() => onModeChange("simulation")}
                className={`flex-1 rounded px-4 py-3 text-sm transition ${
                  mode === "simulation" ? "bg-amber-200 text-[#2b1712]" : "text-amber-100 hover:bg-white/10"
                }`}
              >
                推演模式
              </button>
            </div>
          </div>

          <div className="mt-6 flex max-w-2xl items-start gap-3 rounded-md border border-cyan-100/20 bg-[#101819]/65 p-4 text-sm leading-7 text-cyan-50 backdrop-blur">
            <Sparkles className="mt-1 shrink-0 text-cyan-200" size={18} />
            <span>{modeDescriptions[mode]}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
