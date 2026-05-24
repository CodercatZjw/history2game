import { useEffect, useMemo, useState } from "react";
import { availableConfigs } from "./configs";
import { ConfigSelector } from "./components/ConfigSelector";
import { GameRunner } from "./components/GameRunner";
import { HomePage } from "./components/HomePage";
import { PipelinePage } from "./components/PipelinePage";
import { RoleSelect } from "./components/RoleSelect";
import { validateConfig } from "./services/configValidator";
import { fetchSavedGeneratedConfigs } from "./services/pipelineService";
import type { HistoricalGameConfig } from "./types";

type Page = "home" | "pipeline" | "configs" | "roles" | "game";

function parseHash() {
  const raw = window.location.hash.replace(/^#/, "");
  const [pagePart, query = ""] = raw.split("?");
  const params = new URLSearchParams(query);
  return {
    page: (pagePart as Page) || "home",
    configId: params.get("config") ?? "",
    roleId: params.get("role") ?? "",
    stage: params.get("stage") ?? "script",
  };
}

export default function App() {
  const initial = parseHash();
  const [generatedConfigs, setGeneratedConfigs] = useState<HistoricalGameConfig[]>([]);
  const [page, setPage] = useState<Page>(
    ["pipeline", "configs", "roles", "game"].includes(initial.page) ? initial.page : "home",
  );
  const [selectedConfigId, setSelectedConfigId] = useState(initial.configId || availableConfigs[0]?.id || "");
  const [selectedRoleId, setSelectedRoleId] = useState(initial.roleId);

  const allConfigs = useMemo(() => [...availableConfigs, ...generatedConfigs], [generatedConfigs]);
  const selectedConfig = useMemo(
    () => allConfigs.find((config) => config.id === selectedConfigId) ?? allConfigs[0],
    [allConfigs, selectedConfigId],
  );

  const issues = selectedConfig ? validateConfig(selectedConfig) : ["No config registered."];

  useEffect(() => {
    fetchSavedGeneratedConfigs().then((configs) => {
      setGeneratedConfigs((items) => {
        const merged = [...configs, ...items];
        return merged.filter((config, index) => merged.findIndex((item) => item.id === config.id) === index);
      });
    });
  }, []);

  if (!selectedConfig) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-50">
        <h1 className="text-2xl font-semibold">没有可用配置</h1>
        <p className="mt-3 text-slate-300">请在 src/configs/index.ts 注册至少一个 HistoricalGameConfig。</p>
      </main>
    );
  }

  if (issues.length) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-50">
        <h1 className="text-2xl font-semibold">配置校验失败</h1>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      </main>
    );
  }

  if (page === "pipeline") {
    return (
      <PipelinePage
        demoConfig={selectedConfig}
        onBack={() => setPage("home")}
        onStartDemo={() => setPage("configs")}
        onGeneratedConfig={(config) => {
          setGeneratedConfigs((items) => [config, ...items.filter((item) => item.id !== config.id)]);
          setSelectedConfigId(config.id);
          setSelectedRoleId("");
          setPage("roles");
        }}
      />
    );
  }

  if (page === "configs") {
    return (
      <ConfigSelector
        configs={allConfigs}
        onBack={() => setPage("home")}
        onSelect={(configId) => {
          setSelectedConfigId(configId);
          setSelectedRoleId("");
          setPage("roles");
        }}
      />
    );
  }

  if (page === "roles") {
    return (
      <RoleSelect
        config={selectedConfig}
        onBack={() => setPage("configs")}
        onSelect={(roleId) => {
          setSelectedRoleId(roleId);
          setPage("game");
        }}
      />
    );
  }

  if (page === "game" && selectedRoleId) {
    return (
      <GameRunner
        key={`${selectedConfig.id}-${selectedRoleId}`}
        config={selectedConfig}
        roleId={selectedRoleId}
        initialStage={
          initial.stage === "inquiry" || initial.stage === "decision" || initial.stage === "ending"
            ? initial.stage
            : "script"
        }
        onBack={() => setPage("roles")}
        onRestart={() => {
          setSelectedRoleId("");
          setPage("roles");
        }}
      />
    );
  }

  return (
    <HomePage
      demoConfig={selectedConfig}
      onViewPipeline={() => setPage("pipeline")}
      onStartDemo={() => setPage("configs")}
    />
  );
}
