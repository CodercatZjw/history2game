import { ArrowLeft, Play } from "lucide-react";
import type { HistoricalGameConfig } from "../types";

interface ConfigSelectorProps {
  configs: HistoricalGameConfig[];
  onBack: () => void;
  onSelect: (configId: string) => void;
}

export function ConfigSelector({ configs, onBack, onSelect }: ConfigSelectorProps) {
  return (
    <main className="min-h-screen bg-[#120d0b] px-4 py-6 text-[#fff7e6]">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-md border border-amber-100/25 bg-black/25 px-3 py-2 text-sm transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>
        <div className="mt-8">
          <p className="text-sm text-amber-100">Demo 选择页</p>
          <h1 className="mt-2 text-3xl font-semibold">选择一个 HistoricalGameConfig</h1>
          <p className="mt-3 max-w-2xl text-stone-300">
            Runtime 将读取所选配置中的时间线、角色、节点、图片、状态变量、随机事件和结局规则。
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {configs.map((config) => (
            <article key={config.id} className="glass-panel overflow-hidden rounded-xl">
              <img src={config.assets.coverImage} alt={config.title} className="h-52 w-full object-cover" />
              <div className="p-5">
                <p className="text-sm text-amber-100">配置包</p>
                <h2 className="mt-1 text-2xl font-semibold">{config.title}</h2>
                <p className="mt-2 text-sm text-stone-400">{config.period}</p>
                <p className="mt-3 leading-7 text-stone-300">{config.intro}</p>
                <button
                  type="button"
                  onClick={() => onSelect(config.id)}
                  className="choice-button mt-5 inline-flex items-center gap-2 rounded-md px-4 py-3 font-medium text-amber-50 transition"
                >
                  <Play className="h-4 w-4" />
                  选择此配置
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
