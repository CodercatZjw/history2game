import { ArrowLeft, CheckCircle2, FileJson, LoaderCircle, Play, Save, Sparkles, Terminal, Workflow } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HistoricalGameConfig } from "../types";
import {
  generateHistoricalGameConfig,
  pipelineSteps,
  type PipelineGenerateResult,
  type PipelineStepResult,
} from "../services/pipelineService";

interface PipelinePageProps {
  demoConfig: HistoricalGameConfig;
  onBack: () => void;
  onStartDemo: () => void;
  onGeneratedConfig: (config: HistoricalGameConfig) => void;
}

const defaultInput =
  "请把一个历史事件改造成视觉小说式互动历史游戏：说明正史时间线、关键节点、多角色视角、NPC 信息边界、有限询问、状态变量、随机事件和多结局规则。";

function getStepClass(status: PipelineStepResult["status"]) {
  if (status === "done") return "border-emerald-200/45 bg-emerald-300/10";
  if (status === "running") return "border-amber-200/70 bg-amber-300/12";
  if (status === "error") return "border-rose-200/60 bg-rose-300/10";
  return "border-white/12 bg-white/6";
}

export function PipelinePage({ demoConfig, onBack, onStartDemo, onGeneratedConfig }: PipelinePageProps) {
  const [sourceText, setSourceText] = useState(defaultInput);
  const [isGenerating, setIsGenerating] = useState(false);
  const [steps, setSteps] = useState<PipelineStepResult[]>(pipelineSteps);
  const [result, setResult] = useState<PipelineGenerateResult | null>(null);
  const [streamText, setStreamText] = useState("");
  const [serverLogs, setServerLogs] = useState<string[]>([]);
  const streamRef = useRef<HTMLPreElement | null>(null);

  const preview = useMemo(() => {
    const config = result?.config;
    if (!config) return null;
    return [
      { label: "角色", value: config.roles.length },
      { label: "节点", value: config.nodes.length },
      { label: "NPC", value: config.npcs.length },
      { label: "结局", value: config.endings.length },
    ];
  }, [result]);

  const progress = useMemo(() => {
    const done = steps.filter((step) => step.status === "done").length;
    const running = steps.some((step) => step.status === "running") ? 0.55 : 0;
    return Math.min(100, Math.round(((done + running) / steps.length) * 100));
  }, [steps]);

  const currentStep = steps.find((step) => step.status === "running") ?? steps.find((step) => step.status === "error");

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [streamText, serverLogs]);

  const runPipeline = async () => {
    setIsGenerating(true);
    setResult(null);
    setStreamText("");
    setServerLogs(["[client] 初始化生成任务。"]);
    setSteps(pipelineSteps.map((step, index) => ({ ...step, status: index === 0 ? "running" : "pending" })));
    try {
      const generated = await generateHistoricalGameConfig(sourceText, demoConfig, {
        onToken: (token) => {
          setStreamText((text) => `${text}${token}`);
        },
        onLog: (message) => {
          setServerLogs((logs) => [...logs.slice(-60), message]);
        },
        onSteps: setSteps,
      });
      setSteps(generated.steps);
      setResult(generated);
    } finally {
      setIsGenerating(false);
    }
  };

  const enterGeneratedGame = () => {
    if (!result?.config || result.issues.length) return;
    onGeneratedConfig(result.config);
  };

  return (
    <main
      className="vn-bg min-h-screen text-[#fff7e6]"
      style={{ backgroundImage: `url("${demoConfig.assets.coverImage}")` }}
    >
      <div className="vn-scrim min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-md border border-amber-100/25 bg-black/25 px-3 py-2 text-sm transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </button>
        </div>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 lg:grid-cols-[1.15fr_.85fr]">
          <div className="glass-panel rounded-xl p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-amber-100/30 bg-amber-300/15">
                  <Workflow className="h-6 w-6 text-amber-100" />
                </span>
                <div>
                  <p className="text-sm text-amber-100/85">Pipeline 层</p>
                  <h1 className="text-3xl font-semibold leading-tight md:text-5xl">历史事件生成工作台</h1>
                </div>
              </div>
              <button
                type="button"
                onClick={onStartDemo}
                className="inline-flex items-center gap-2 rounded-md border border-amber-100/30 px-4 py-3 text-sm transition hover:bg-white/10"
              >
                <Play className="h-4 w-4" />
                直接体验内置 Demo
              </button>
            </div>

            <p className="mt-5 max-w-4xl text-base leading-8 text-stone-100/86">
              这里实现的是一种文字游戏范式接口：LLM 只负责把历史事件分析成稳定的数据字段，Runtime 负责渲染视觉小说、有限询问、选择、状态变化和结局。
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                className="min-h-40 rounded-lg border border-amber-100/25 bg-black/35 px-4 py-3 text-sm leading-7 text-stone-50 outline-none transition placeholder:text-stone-400 focus:border-amber-200"
                placeholder="输入历史事件名称、资料摘要、你想强调的角色或主题……"
              />
              <div className="flex flex-col gap-3 lg:w-52">
                <button
                  type="button"
                  onClick={runPipeline}
                  disabled={isGenerating}
                  className="choice-button inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-amber-50 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  生成游戏数据
                </button>
                <button
                  type="button"
                  onClick={() => setSourceText(demoConfig.intro)}
                  className="rounded-lg border border-amber-100/25 bg-black/25 px-4 py-3 text-sm transition hover:bg-white/10"
                >
                  使用 Demo 摘要填充
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-amber-100/20 bg-black/35 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                  <LoaderCircle className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                  生成进度：{progress}%
                </div>
                <p className="text-xs text-stone-300">
                  当前环节：{currentStep?.title ?? (result ? "生成完成" : "等待开始")}
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/40">
                <div className="h-full rounded-full bg-amber-200 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {steps.map((step, index) => (
                <article key={step.id} className={`rounded-lg border p-4 ${getStepClass(step.status)}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-sm font-semibold text-stone-950">
                      {step.status === "running" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-stone-50">{step.title}</p>
                      <p className="mt-1 text-sm leading-6 text-stone-200/78">{step.summary}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <section className="glass-panel rounded-xl p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                  <Terminal className="h-4 w-4" />
                  LLM 流式输出
                </div>
                <span className="text-xs text-stone-400">{streamText.length} chars</span>
              </div>
              <pre
                ref={streamRef}
                className="thin-scrollbar h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-amber-100/15 bg-black/55 p-3 font-mono text-[11px] leading-5 text-emerald-100"
              >
                {streamText || serverLogs.join("\n") || "等待生成。开始后这里会像调试窗口一样滚动输出 LLM token。"}
              </pre>
              {serverLogs.length ? (
                <div className="thin-scrollbar mt-3 max-h-24 overflow-auto rounded-lg border border-amber-100/10 bg-black/25 p-2 font-mono text-[11px] leading-5 text-stone-300">
                  {serverLogs.slice(-8).map((log, index) => (
                    <p key={`${log}-${index}`}>{log}</p>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="glass-panel rounded-xl p-5">
              <img
                src={result?.config?.assets.coverImage ?? demoConfig.assets.coverImage}
                alt={result?.config?.title ?? demoConfig.title}
                className="aspect-[4/3] w-full rounded-lg border border-amber-100/20 object-cover"
              />
              <p className="mt-4 text-sm text-amber-100/85">
                {result ? (result.error ? "生成失败" : "LLM 生成结果") : "右侧预览"}
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{result?.config?.title ?? demoConfig.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-200/82">
                {result?.error ?? result?.config?.intro ?? "生成后，这里会展示可直接交给 Runtime 的 HistoricalGameConfig 摘要。"}
              </p>
              {preview ? (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {preview.map((item) => (
                    <div key={item.label} className="rounded-md border border-amber-100/18 bg-black/22 p-2 text-center">
                      <p className="text-xl font-semibold text-amber-100">{item.value}</p>
                      <p className="mt-1 text-xs text-stone-300">{item.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            {result ? (
              <section className="glass-panel rounded-xl p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-100">
                  <FileJson className="h-4 w-4" />
                  配置校验
                </div>
                {result.error ? (
                  <div className="rounded-lg border border-rose-200/30 bg-rose-500/10 p-3 text-sm leading-6 text-rose-100">
                    <p className="font-semibold">生成失败，没有回退到 mock。</p>
                    <p className="mt-2 break-words">{result.error}</p>
                  </div>
                ) : result.issues.length ? (
                  <ul className="space-y-2 text-sm leading-6 text-rose-100">
                    {result.issues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm text-emerald-100">
                      <CheckCircle2 className="h-4 w-4" />
                      已生成可运行的 HistoricalGameConfig。
                    </p>
                    {result.serverFilePath ? (
                      <p className="flex items-start gap-2 break-all text-xs leading-5 text-stone-300">
                        <Save className="mt-0.5 h-4 w-4 shrink-0 text-amber-100" />
                        已保存到服务器：{result.serverFilePath}
                      </p>
                    ) : null}
                  </div>
                )}
                <button
                  type="button"
                  disabled={Boolean(result.issues.length)}
                  onClick={enterGeneratedGame}
                  className="choice-button mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-amber-50 transition disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <Play className="h-5 w-5" />
                  进入生成游戏
                </button>
              </section>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}
