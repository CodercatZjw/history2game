# 乱世回响：安史之乱

一个网页端 MVP：把安史之乱做成“历史视觉小说 + 有限 AI 对话 + 历史推演”的分支叙事游戏。玩家选择唐玄宗、安禄山、哥舒翰或杨贵妃，在潼关之战与马嵬坡兵变中阅读固定剧情、向 NPC 询问、做关键决策，并进入多结局。

## 运行方法

```bash
npm install
npm run dev
```

默认会同时启动：

- Vite 前端：http://localhost:5173
- Express API：http://localhost:8787

## 配置 API

复制 `.env.example` 为 `.env`，然后填写 OpenAI 兼容接口：

```bash
MOCK_MODE=false
OPENAI_API_KEY=你的Key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_BASE_URL` 可以换成任何兼容 `/chat/completions` 的服务地址。

## Mock 模式说明

没有 `OPENAI_API_KEY`，或设置 `MOCK_MODE=true` 时，后端会自动进入 mock 模式。mock 模式已经为不同 NPC 和历史节点准备了角色化回复，所以可以直接演示完整流程。

前端也有兜底：如果 `/api/chat` 请求失败，会使用本地 mock 回复，避免演示中断。

## 游戏流程

1. 首页选择“历史模式 / 推演模式”。
2. 选择扮演角色。
3. 进入历史节点。每个节点会按所选角色加载不同视角脚本、可询问对象、目标和局限。
4. 进入自由询问阶段，每个节点默认 3 次。
5. 玩家选择 NPC 并输入问题，NPC 用视觉小说台词方式回答。
6. 询问用尽或主动结束后，进入关键决策。
7. 决策改变状态变量，并可能触发受状态影响的随机事件。
8. 结果以剧情框展示，进入下一节点或结局页。

## 为什么这是视觉小说式历史推演游戏

它不是普通聊天页面：主线剧情由 `src/data/storyContent.ts` 的统一剧情内容推进，AI 只在“决策前有限询问”中出现。每个历史节点还带有角色视角层，同一个潼关或马嵬坡事件，会因玩家扮演唐玄宗、安禄山、哥舒翰或杨贵妃而出现不同的信息边界、询问对象、目标和决策。界面包含全屏场景背景、底部半透明对话框、说话者姓名、逐句推进、选择按钮、询问输入框、状态面板、剧情记录和结局页。

它也不是百科页面：玩家的选择会改变 `GameState`，随机事件会读取状态变量计算结果，结局由 `endingEngine` 根据决策、状态和随机结果选择。

## 如何替换背景图片

统一入口在 `src/data/assets.ts`：

```ts
export const sceneAssets = {
  palace: "...",
  frontier: "...",
  tongguan: "...",
  changanFall: "...",
  maweipo: "...",
  lingwu: "..."
};
```

当前版本已经接入 Wikimedia Commons 的公开网络图片，并保留 `portraitSvg` 作为少数配角头像的兜底。你可以继续使用网络 URL，也可以把图片放入 `src/assets/backgrounds/`，再在 `assets.ts` 中 import 并替换对应字段。

图片来源集中记录在 `src/data/assets.ts` 的 `imageCredits` 中，当前包含大明宫、潼关古城、唐明皇幸蜀图、杨贵妃墓、安史之乱地图、唐代武士图像、唐玄宗画像、安禄山画像和细田荣之《杨贵妃》等素材。

## 如何让剧情更适合新手

`src/data/historyFacts.ts` 中的 `eventBriefs` 用来给每个节点配置白话导读：

- `plainSummary`：告诉完全不了解历史的玩家，此刻发生了什么。
- `stakes`：解释这个节点为什么危险。
- `playerQuestion`：把复杂历史问题转化为玩家要判断的问题。
- `terms`：解释潼关、禁军、节度使等关键名词。

结局页和剧情记录面板使用 `anshiTimeline` 展示 755 到 763 年的完整安史之乱脉络，所以无论玩家选哪个角色、进入哪个结局，都能看到整场战乱的关键转折。

## 如何修改 Prompt

所有可维护的对话 prompt 都集中在 `prompts/`：

- `npcProfiles.json`：NPC 的说话风格、动机、信息局限和 mock 台词。
- `eventFacts.json`：每个历史节点给 LLM 的背景事实。
- `conversationRules.md`：总的角色扮演规则，约束回答像 VN 台词而不是分析报告。
- `userInstruction.md`：玩家提问后的补充规则。
- `dialogueAccess.md`：每个玩家角色在每个节点能询问谁，以及对方立场复核。

后端 `server/index.js` 会在启动时读取这些文件；前端本地 mock 也会读取同一份 `npcProfiles.json`。

## 如何维护剧情内容

固定旁白、固定台词、角色视角脚本、决策结果、询问前铺垫都集中在 `src/data/storyContent.ts`。旧的 `src/data/events.ts` 只保留兼容导出，方便现有服务继续引用。

对话框统一使用 `DialogueLine` / `VNDialogueLine` 接口，所有剧情来源都可以带上：

- `type`：旁白、台词、玩家提问、AI 回复、结果等。
- `purpose`：剧情、询问铺垫、自由对话、决策、结算。
- `promptHint`：显示在对话框里的小标题。
- `intent`：给后续编辑器或调试用，说明这句话的叙事目的。

每个角色进入询问阶段前的动机提示在 `inquirySetups` 里维护，它决定“为什么现在要问”“建议问什么”，避免玩家还没理解局势就被丢进输入框。推荐问题可以绑定 `npcId`，界面会按当前选中的 NPC 过滤，只显示适合问这个人的话。

## 如何新增角色

在 `src/data/characters.ts` 添加一项：

```ts
{
  id: "new_role",
  name: "新角色",
  identity: "身份",
  background: "一句背景",
  goal: "目标",
  dilemma: "困境",
  portrait: "...",
  accent: "#f0b060"
}
```

角色会自动出现在角色选择页。

## 如何新增历史节点

1. 在 `src/data/storyContent.ts` 添加新的 `StoryEvent`。
2. 为节点配置 `script` 固定剧情、`inquiryNpcs` 可询问 NPC 和 `choices` 决策。
3. 如需角色专属视角，在该节点的 `roleViews` 中按角色 ID 添加 `perspectiveTitle`、`objective`、`limitation`、专属 `script`、`inquiryNpcs` 和 `choices`。
4. 在 `inquirySetups` 里为这个节点和角色添加询问前铺垫与建议问题。
5. 如果需要状态影响的随机结果，在 `src/data/randomEvents.ts` 新增 `RandomEventConfig`。
6. 如果会进入新结局，在 `src/data/endings.ts` 新增 `EndingDefinition`。
7. 在前一个节点的选项里设置 `nextEventId`、`randomEventId` 或 `endingId`。

## 后续扩展方向

- 更多历史节点：范阳起兵、长安陷落、灵武即位、睢阳之围。
- 角色立绘、真实场景图、背景音乐与点击音效。
- 存档/读档、多周目成就、结局图鉴。
- 更细的角色视角差异：同一节点因扮演角色不同出现不同台词。
- 更完整的 AI 约束：NPC 记忆、历史事实检索、节点级知识边界。
- 剧情编辑器：用 JSON 或可视化工具配置节点、脚本、选项和结局。
