import { GitBranch, Play, Workflow } from "lucide-react";
import type { HistoricalGameConfig } from "../types";

interface HomePageProps {
  demoConfig: HistoricalGameConfig;
  onViewPipeline: () => void;
  onStartDemo: () => void;
}

export function HomePage({ demoConfig, onViewPipeline, onStartDemo }: HomePageProps) {
  return (
    <main className="min-h-screen bg-[#120d0b] text-[#fff7e6]">
      <section
        className="vn-bg min-h-[72vh]"
        style={{
          backgroundImage: `url("${demoConfig.assets.coverImage}")`,
        }}
      >
        <div className="vn-scrim">
        <div className="mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-4 py-12">
          <p className="text-sm font-medium text-amber-100">史境 HistWeaver</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            AI 历史互动叙事生成流水线
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-100/90">
            输入一个历史事件，系统将其拆解为时间线、关键节点、人物立场、AI 对话、决策分支、状态变量和多结局规则，并渲染为视觉小说式互动游戏。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onViewPipeline}
              className="choice-button inline-flex items-center gap-2 rounded-md px-5 py-3 font-medium text-amber-50 transition"
            >
              <Workflow className="h-5 w-5" />
              查看生成流水线
            </button>
            <button
              type="button"
              onClick={onStartDemo}
              className="inline-flex items-center gap-2 rounded-md border border-amber-100/25 bg-black/25 px-5 py-3 font-medium text-stone-50 transition hover:bg-white/10"
            >
              <Play className="h-5 w-5" />
              体验示例 Demo
            </button>
          </div>
        </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-sm text-amber-100">示例 Demo：{demoConfig.title}</p>
            <h2 className="mt-2 text-2xl font-semibold">以下内容用于展示一个历史事件如何被转化为互动视觉小说。</h2>
            <p className="mt-4 leading-7 text-stone-300">{demoConfig.intro}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["时间线", "角色路线", "信息边界", "多结局规则"].map((item) => (
              <div key={item} className="glass-panel rounded-lg p-4">
                <GitBranch className="mb-3 h-5 w-5 text-amber-100" />
                <p className="font-medium">{item}</p>
                <p className="mt-2 text-sm leading-6 text-stone-400">由当前配置提供，运行时不写死具体事件。</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
