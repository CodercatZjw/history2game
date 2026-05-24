import { MessageCircle, Send, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { InquiryNpc, InquirySetup, InquirySuggestion } from "../types";

type FreeChatPanelProps = {
  npcs: InquiryNpc[];
  setup?: InquirySetup;
  remaining: number;
  loading: boolean;
  onAsk: (npcId: string, message: string) => void;
  onSkip: () => void;
};

export function FreeChatPanel({ npcs, setup, remaining, loading, onAsk, onSkip }: FreeChatPanelProps) {
  const [npcId, setNpcId] = useState(npcs[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const selectedNpc = useMemo(() => npcs.find((npc) => npc.id === npcId) ?? npcs[0], [npcId, npcs]);
  const allSuggestions = useMemo<InquirySuggestion[]>(
    () =>
      (setup?.suggestedQuestions ?? []).map((item) =>
        typeof item === "string" ? { text: item } : item
      ),
    [setup]
  );
  const suggestions = useMemo(() => {
    if (!selectedNpc) return allSuggestions.filter((item) => !item.npcId);
    const targeted = allSuggestions.filter((item) => item.npcId === selectedNpc.id);
    if (targeted.length) return targeted;
    return allSuggestions.filter((item) => !item.npcId);
  }, [allSuggestions, selectedNpc]);

  useEffect(() => {
    setNpcId(npcs[0]?.id ?? "");
    setMessage("");
  }, [npcs]);

  const canAsk = Boolean(selectedNpc && message.trim() && remaining > 0 && !loading);

  const handleAsk = () => {
    if (!canAsk || !selectedNpc) return;
    onAsk(selectedNpc.id, message.trim());
    setMessage("");
  };

  const selectNpc = (nextNpcId: string) => {
    setNpcId(nextNpcId);
    setMessage("");
  };

  const useSuggestedQuestion = (suggestion: InquirySuggestion) => {
    if (loading || remaining <= 0) return;
    if (suggestion.npcId && npcs.some((npc) => npc.id === suggestion.npcId)) {
      setNpcId(suggestion.npcId);
    }
    setMessage(suggestion.text);
  };

  return (
    <section className="glass-panel pointer-events-auto w-full max-w-4xl rounded-lg p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#ffe1a8]">
          <MessageCircle size={18} />
          <h2 className="font-serifcn text-lg font-semibold sm:text-xl">{setup?.title ?? "自由询问"}</h2>
        </div>
        <span className="rounded-full border border-amber-100/25 px-3 py-1 text-xs text-amber-100/75">
          剩余 {remaining} 次
        </span>
      </div>

      {setup && (
        <div className="mt-2 rounded-md border border-amber-100/15 bg-black/25 px-3 py-1.5">
          <p className="text-xs leading-5 text-[#f7dfbb] sm:text-sm sm:leading-6">{setup.question}</p>
        </div>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-[220px_1fr]">
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
          {npcs.map((npc) => (
            <button
              key={npc.id}
              onClick={() => selectNpc(npc.id)}
              className={`flex w-full items-center gap-3 rounded-md border px-3 py-1.5 text-left transition ${
                npcId === npc.id
                  ? "border-amber-200 bg-amber-200/15"
                  : "border-amber-100/15 bg-black/20 hover:bg-white/10"
              }`}
            >
              {npc.portrait && <img src={npc.portrait} alt={npc.name} className="h-8 w-8 rounded object-cover" />}
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#ffe9c3]">{npc.name}</span>
                <span className="block truncate text-xs text-amber-100/60">{npc.identity}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {selectedNpc && (
            <div className="rounded-md border border-cyan-100/15 bg-[#0d1b1d]/65 p-2 text-sm leading-6 text-cyan-50/85">
              <span className="mb-1 block text-xs text-cyan-100/70">对方当前立场</span>
              <p>{selectedNpc.attitude}</p>
            </div>
          )}
          {suggestions.length ? (
            <div>
              {selectedNpc && <div className="mb-1 text-xs text-amber-100/55">可以向 {selectedNpc.name} 追问：</div>}
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.text}
                    type="button"
                    onClick={() => useSuggestedQuestion(suggestion)}
                    className="rounded-md border border-amber-100/15 bg-amber-200/10 px-2.5 py-1 text-left text-xs leading-5 text-amber-50 transition hover:border-amber-200/45 hover:bg-amber-200/18"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={120}
            disabled={loading || remaining <= 0}
            placeholder={suggestions[0]?.text ?? "输入一句想问的话，例如：如果禁军不肯继续护驾，我该怎么办？"}
            className="min-h-[68px] resize-none rounded-md border border-amber-100/20 bg-black/35 p-3 text-sm leading-6 text-[#fff4df] outline-none transition placeholder:text-amber-100/40 focus:border-amber-200"
          />
          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={onSkip}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md border border-amber-100/20 px-3 py-1.5 text-sm text-amber-100 transition hover:bg-white/10 disabled:opacity-60"
            >
              <SkipForward size={16} />
              结束询问
            </button>
            <button
              onClick={handleAsk}
              disabled={!canAsk}
              className="inline-flex items-center gap-2 rounded-md bg-[#f0b15d] px-3 py-1.5 text-sm font-semibold text-[#2a130d] transition hover:bg-[#ffd18a] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Send size={16} />
              {loading ? "等待回应" : "提问"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
