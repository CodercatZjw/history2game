import { ArrowLeft, Flag } from "lucide-react";
import type { Character, GameMode } from "../types";
import { sceneAssets } from "../data/assets";

type CharacterSelectProps = {
  characters: Character[];
  mode: GameMode;
  onSelect: (characterId: string) => void;
  onBack: () => void;
};

export function CharacterSelect({ characters, mode, onSelect, onBack }: CharacterSelectProps) {
  return (
    <main
      className="vn-bg relative min-h-screen overflow-y-auto text-[#fff4df]"
      style={{ backgroundImage: `url(${sceneAssets.palace})` }}
    >
      <div className="vn-scrim absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-7 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-md border border-amber-100/25 bg-black/35 px-4 py-2 text-sm text-amber-100 transition hover:bg-white/10"
          >
            <ArrowLeft size={17} />
            返回
          </button>
          <div className="rounded-full border border-amber-100/25 bg-black/35 px-4 py-2 text-sm text-amber-100">
            当前模式：{mode === "historical" ? "历史模式" : "推演模式"}
          </div>
        </header>

        <section className="mt-10 max-w-3xl">
          <h1 className="font-serifcn text-3xl font-semibold text-[#ffe6b0] sm:text-5xl">选择你的身份</h1>
          <p className="mt-4 text-base leading-8 text-[#f3dcc1]">
            同一段乱世，会因立场不同而显出不同的重量。身份不会改变史实基础，但会影响你的提问视角与代入感。
          </p>
        </section>

        <section className="mt-8 grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {characters.map((character) => (
            <article
              key={character.id}
              className="glass-panel flex min-h-[520px] flex-col overflow-hidden rounded-lg transition hover:-translate-y-1 hover:border-amber-200/60"
            >
              <div className="relative h-56 overflow-hidden bg-black/30">
                {character.portrait ? (
                  <img src={character.portrait} alt={character.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-amber-100/70">暂无立绘</div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <Flag size={18} style={{ color: character.accent }} />
                  <span className="text-sm text-amber-100/75">{character.identity}</span>
                </div>
                <h2 className="mt-2 font-serifcn text-3xl font-semibold text-[#ffe4ae]">{character.name}</h2>
                <p className="mt-3 text-sm leading-7 text-[#f2d8bb]">{character.background}</p>
                <div className="mt-4 space-y-3 text-sm leading-6">
                  <p>
                    <span className="text-amber-200">目标：</span>
                    {character.goal}
                  </p>
                  <p>
                    <span className="text-rose-200">困境：</span>
                    {character.dilemma}
                  </p>
                </div>
                <button
                  onClick={() => onSelect(character.id)}
                  className="mt-auto rounded-md bg-[#f0b15d] px-4 py-3 font-semibold text-[#2a130d] transition hover:bg-[#ffd18a]"
                >
                  以此身份进入乱世
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
