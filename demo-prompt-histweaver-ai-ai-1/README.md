# 史境 HistWeaver

史境 HistWeaver 是一个通用的“历史事件 → 视觉小说式互动游戏”生成流水线 / 引擎，不是单个历史事件游戏。内置示例 Demo 只用于证明同一套 `HistoricalGameConfig` 数据协议可以驱动完整视觉小说体验。

## 如何运行

```bash
npm install
npm run dev
```

`npm run dev` 会同时启动两部分：

- Vite 前端开发服务
- 本地 Node API 服务，默认监听 `http://127.0.0.1:8790`

构建检查：

```bash
npm run build
```

## API 配置

项目使用 OpenAI 兼容的 `/chat/completions` 接口。可新建 `.env.local` 覆盖默认配置：

```env
VITE_API_BASE_URL=https://aiping.cn/api/v1
VITE_API_KEY=你的 API Key
VITE_MODEL_NAME=GLM-5
```

代码统一读取：

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const apiKey = import.meta.env.VITE_API_KEY;
const modelName = import.meta.env.VITE_MODEL_NAME;
```

当前实现提供两类调用：

- Pipeline 生成：把输入的历史事件资料转成 `HistoricalGameConfig`。
- Runtime 询问：玩家在决策前有限询问 NPC，NPC 根据当前配置和状态回答。

Pipeline 使用后端代理发起流式请求，前端会显示：

- 当前大致生成环节
- 估算进度条
- LLM token 流式输出调试窗口
- 服务端日志

生成完成后，后端会把结果保存到 `generated-configs/<config-id>.json`，同时把原始 LLM 输出保存到 `generated-configs/<config-id>.raw.txt`。当生成接口不可用、输入为空或请求失败时，Pipeline 会回退到内置 Demo 配置并同样保存，保证界面可运行。

## 两层架构

- Pipeline 层：把历史事件拆解为时间线、关键节点、角色、NPC 信息边界、剧情脚本、有限 AI 对话、状态变量、随机事件和多结局规则。
- Runtime 层：只读取 `HistoricalGameConfig`，渲染为带背景图、头像、底部对话框、有限询问、选择和结局页的视觉小说式游戏。

## HistoricalGameConfig

核心字段：

- `id`、`title`、`period`、`intro`、`theme`
- `assets`：封面、默认背景、节点背景、头像、结局背景
- `timeline`：正史时间线
- `roles`：可选玩家角色
- `npcs`：可询问 NPC 与信息边界
- `nodes`：剧情节点、固定脚本、询问配置、决策
- `stateSchema`、`defaultState`：动态状态变量
- `randomEvents`：受状态变量影响的随机事件
- `endings`：多结局规则与解释

所有旁白、固定台词、AI 回答、决策结果、随机事件结果和结局旁白都统一使用 `DialogueBlock`。

## 新增历史事件

1. 新增 `src/configs/newEvent/`。
2. 在目录内拆分 `meta.ts`、`assets.ts`、`timeline.ts`、`roles.ts`、`npcs.ts`、`nodes.ts`、`scripts.ts`、`decisions.ts`、`randomEvents.ts`、`endings.ts`、`stateSchema.ts`、`prompts.ts`。
3. 导出 `newEventConfig`。
4. 在 `src/configs/index.ts` 加入 `availableConfigs`。

理论上不需要修改 `GameRunner`、`InquiryPanel`、`chatService` 或 `buildNpcPrompt`。

## 生成结果文件

通过 Pipeline 页面生成的新配置会被写入服务器本地目录：

```text
generated-configs/
  <config-id>.json
  <config-id>.raw.txt
```

`.json` 文件包含保存时间、是否使用 mock、以及完整 `HistoricalGameConfig`。刷新页面后，前端会调用 `/api/configs` 读取这些已保存配置，并把它们加入配置选择页。

## 扩展内容

- 新增角色：在对应 config 的 `roles.ts` 添加 `PlayableRole`，配置目标、困境、可见信息、初始状态修正和可游玩节点。
- 新增节点：在 `nodes.ts` 添加 `StoryNode`，并在 `scripts.ts`、`decisions.ts` 补充脚本和选项。
- 新增 NPC：在 `npcs.ts` 添加 `NPCProfile`，再在节点 `availableNPCs` 中配置当前立场、信息边界和关系。
- 新增剧情脚本：统一写成 `DialogueBlock`，放入 `scripts.ts`、节点脚本、决策结果或结局旁白。
- 新增推荐问题：在 `NodeNPC.quickQuestionsByPlayerRole` 中按 `nodeId + playerRoleId + npcId` 配置。
- 新增 promptProfile：放在具体 demo 目录的 `prompts.ts` 中；通用 prompt 构建器只负责拼装。
- 新增随机事件：在 `randomEvents.ts` 中配置相关状态变量、成功/失败文本与状态影响。
- 新增结局：在 `endings.ts` 中配置结局条件、视觉小说收束旁白、正史对照和反事实解释。
- 替换图片素材：只改对应 config 的 `assets.ts`，组件中不散落图片 URL。

## 通用层边界

通用层不能写具体历史事件或具体历史人物名。具体人物、节点、台词、prompt、图片都必须存在于某个 `src/configs/<event>/` 目录中。这样换一个历史事件 config，Runtime 仍能运行。

## 内置 Demo

`src/configs/anShiRebellion/` 是内置 Demo。它展示了一个历史事件如何拥有完整历史弧线、多角色视角、有限询问、状态变量、随机事件和多结局解释。它不是项目本体。
