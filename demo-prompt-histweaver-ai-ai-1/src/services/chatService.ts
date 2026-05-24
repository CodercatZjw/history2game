import type {
  GameState,
  HistoricalGameConfig,
  NodeNPC,
  NPCProfile,
  PlayableRole,
  StoryNode,
} from "../types";
import { buildNpcPrompt } from "../prompts/buildNpcPrompt";
import { createMockNpcReply } from "./mockChatService";

interface AskNpcInput {
  config: HistoricalGameConfig;
  currentNode: StoryNode;
  playerRole: PlayableRole;
  npc: NPCProfile;
  nodeNpcContext: NodeNPC;
  gameState: GameState;
  userMessage: string;
}

export async function askNpc(input: AskNpcInput): Promise<string> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.deepseek.com";
  const apiKey = import.meta.env.VITE_API_KEY || "sk-7afab1043f92422c9d18198a54b64375";
  const modelName = import.meta.env.VITE_MODEL_NAME || "deepseek-v4-pro";

  if (!apiKey) {
    return createMockNpcReply(
      input.currentNode,
      input.playerRole,
      input.npc,
      input.nodeNpcContext,
      input.userMessage,
    );
  }

  const prompt = buildNpcPrompt(input);
  try {
    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: input.userMessage },
        ],
        temperature: 0.65,
        max_tokens: 220,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM request failed: ${response.status}`);
    }
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || createMockNpcReply(input.currentNode, input.playerRole, input.npc, input.nodeNpcContext, input.userMessage);
  } catch {
    return createMockNpcReply(input.currentNode, input.playerRole, input.npc, input.nodeNpcContext, input.userMessage);
  }
}
