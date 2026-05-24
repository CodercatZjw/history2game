import { MessageCircle, Send, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { DialogueBlock, HistoricalGameConfig, InquiryTurn, NodeNPC, PlayableRole, StoryNode } from "../types";
import { getNpcById } from "../services/gameEngine";

interface InquiryPanelProps {
  config: HistoricalGameConfig;
  node: StoryNode;
  role: PlayableRole;
  remaining: number;
  history: InquiryTurn[];
  isAsking: boolean;
  onAsk: (nodeNpc: NodeNPC, message: string) => void;
  onFinish: () => void;
}

export function InquiryPanel({ config, node, role, remaining, history, isAsking, onAsk, onFinish }: InquiryPanelProps) {
  const askable = node.availableNPCs.filter((item) => item.canBeAsked);
  const [activeNpcId, setActiveNpcId] = useState(askable[0]?.npcId ?? "");
  const [message, setMessage] = useState("");

  const activeNodeNpc = useMemo(
    () => askable.find((item) => item.npcId === activeNpcId) ?? askable[0],
    [activeNpcId, askable],
  );
  const activeNpc = activeNodeNpc ? getNpcById(config, activeNodeNpc.npcId) : undefined;
  const questions = activeNodeNpc?.quickQuestionsByPlayerRole[role.id]?.length
    ? activeNodeNpc.quickQuestionsByPlayerRole[role.id]
    : [
        "你现在最担心的风险是什么？",
        "如果我听你的建议，代价会落在谁身上？",
        "你有什么还没有明说的判断？",
      ];

  const ask = (text: string) => {
    if (!activeNodeNpc || !text.trim() || remaining <= 0 || isAsking) return;
    onAsk(activeNodeNpc, text.trim());
    setMessage("");
  };

  const renderTurn = (block: DialogueBlock) => (
    <div key={block.id} className="rounded-md border border-amber-100/15 bg-black/22 p-3">
      <p className="text-xs text-amber-100">{block.speakerName}</p>
      <p className="mt-1 text-sm leading-6 text-stone-100">{block.text}</p>
    </div>
  );

  return (
    <section className="glass-panel thin-scrollbar grid max-h-[44vh] min-w-0 gap-4 overflow-x-hidden overflow-y-auto rounded-xl p-4 text-stone-100 lg:grid-cols-[220px_1fr]">
      <div className="thin-scrollbar min-h-0 min-w-0 overflow-y-auto pr-1">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-100">
          <Users className="h-4 w-4" />
          可询问对象
        </div>
        <div className="space-y-2">
          {askable.map((nodeNpc) => {
            const npc = getNpcById(config, nodeNpc.npcId);
            if (!npc) return null;
            return (
              <button
                key={nodeNpc.npcId}
                type="button"
                onClick={() => setActiveNpcId(nodeNpc.npcId)}
                className={`flex w-full items-center gap-3 rounded-md border p-2 text-left transition ${
                  activeNodeNpc?.npcId === nodeNpc.npcId
                    ? "border-amber-200 bg-amber-300/15"
                    : "border-amber-100/15 bg-black/20 hover:bg-white/10"
                }`}
              >
                <img src={npc.portraitImage} alt={npc.name} className="h-10 w-10 rounded-md object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{npc.name}</span>
                  <span className="block truncate text-xs text-stone-300">{npc.identity}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="thin-scrollbar min-h-0 min-w-0 overflow-y-auto pr-1">
        {activeNpc && activeNodeNpc ? (
          <>
            <div className="flex items-start gap-3">
              <img src={activeNpc.portraitImage} alt={activeNpc.name} className="h-16 w-16 rounded-md object-cover" />
              <div>
                <p className="text-lg font-semibold">{activeNpc.name}</p>
                <p className="text-sm text-stone-300">{activeNpc.identity}</p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  态度：{activeNodeNpc.stanceInThisNode || activeNpc.globalStance || "态度谨慎，正在观察你的判断。"}
                </p>
                <p className="text-sm leading-6 text-stone-300">
                  信息边界：{activeNodeNpc.knowledgeInThisNode || activeNpc.knowledgeBoundary || "只掌握局部信息，可能隐瞒不利内容。"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-amber-100/15 bg-black/22 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-100">
                <MessageCircle className="h-4 w-4" />
                推荐问题
              </div>
              <div className="flex flex-wrap gap-2">
                {questions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    disabled={remaining <= 0 || isAsking}
                    onClick={() => ask(question)}
                    className="rounded-md border border-amber-100/20 bg-white/10 px-3 py-2 text-xs text-stone-100 transition hover:border-amber-200 hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
              <input
                value={message}
                disabled={remaining <= 0 || isAsking}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={`输入你想问【${activeNpc.name}】的问题……`}
                className="min-w-0 rounded-md border border-amber-100/20 bg-black/35 px-3 py-3 text-sm outline-none transition placeholder:text-stone-500 focus:border-amber-200"
              />
              <button
                type="button"
                disabled={!message.trim() || remaining <= 0 || isAsking}
                onClick={() => ask(message)}
                className="choice-button inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-amber-50 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                向【{activeNpc.name}】提问
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-stone-300">剩余询问次数：{remaining}</p>
              <button
                type="button"
                onClick={onFinish}
                className="rounded-md border border-amber-200/60 px-4 py-2 text-sm text-amber-100 transition hover:bg-amber-200/10"
              >
                结束询问，进入决策
              </button>
            </div>

            {history.length ? (
              <div className="mt-4 space-y-2">
                {history.map((turn) => (
                  <div key={turn.id} className="space-y-2">
                    {renderTurn(turn.question)}
                    {renderTurn(turn.answer)}
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
