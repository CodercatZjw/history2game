import { ArrowLeft, Play } from "lucide-react";
import type { HistoricalGameConfig } from "../types";

interface RoleSelectProps {
  config: HistoricalGameConfig;
  onBack: () => void;
  onSelect: (roleId: string) => void;
}

export function RoleSelect({ config, onBack, onSelect }: RoleSelectProps) {
  return (
    <main
      className="vn-bg min-h-screen px-4 py-6 text-[#fff7e6]"
      style={{ backgroundImage: `url("${config.assets.coverImage}")` }}
    >
      <div className="vn-scrim pointer-events-none fixed inset-0" />
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onBack}
          className="relative inline-flex items-center gap-2 rounded-md border border-amber-100/25 bg-black/25 px-3 py-2 text-sm backdrop-blur-md transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          返回 Demo 选择
        </button>
        <div className="relative mt-8">
          <p className="text-sm text-amber-100">{config.title}</p>
          <h1 className="mt-2 text-3xl font-semibold">选择你的视角</h1>
          <p className="mt-3 max-w-2xl text-stone-300">
            每个角色拥有不同可见信息、对话对象、推荐问题、局限和决策。你不是换头像，而是在不同位置承受同一场历史压力。
          </p>
        </div>
        <div className="relative mt-8 grid gap-5 md:grid-cols-2">
          {config.roles.map((role) => (
            <article key={role.id} className="glass-panel rounded-xl p-5">
              <div className="flex gap-4">
                <img src={role.portraitImage} alt={role.name} className="h-20 w-20 rounded-md border border-amber-100/20 object-cover" />
                <div>
                  <h2 className="text-2xl font-semibold">{role.name}</h2>
                  <p className="mt-1 text-sm leading-6 text-stone-300">{role.identity}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-amber-100/15 bg-black/22 p-3">
                  <p className="text-xs font-semibold text-amber-100">目标</p>
                  <p className="mt-1 text-sm leading-6 text-stone-300">{role.goal}</p>
                </div>
                <div className="rounded-md border border-amber-100/15 bg-black/22 p-3">
                  <p className="text-xs font-semibold text-amber-100">困境</p>
                  <p className="mt-1 text-sm leading-6 text-stone-300">{role.dilemma}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-stone-300">{role.routeDescription}</p>
              <button
                type="button"
                onClick={() => onSelect(role.id)}
                className="choice-button mt-5 inline-flex items-center gap-2 rounded-md px-4 py-3 font-medium text-amber-50 transition"
              >
                <Play className="h-4 w-4" />
                进入此路线
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
