# 史境 HistWeaver

> AI 历史互动叙事生成流水线  
> 将真实历史事件转化为可选角色、可对话、可决策、多结局的视觉小说式互动体验。

## 项目简介

**史境 HistWeaver** 是一个面向 AI + 文旅、历史教育和互动叙事场景的历史事件游戏化项目。

它并不是单个历史小游戏，而是一套“历史事件 → 互动视觉小说”的生成流水线。系统会将一个历史事件拆解为：

- 正史时间线
- 关键决策节点
- 可选历史角色
- 人物目标与信息边界
- 固定剧情脚本
- 决策前有限 AI 对话
- 状态变量
- 随机事件
- 正史与非正史多结局

最终生成一个类似橙光 / 视觉小说的互动历史体验。用户可以扮演历史人物，进入关键历史现场，与不同立场的角色对话，在有限信息中做出选择，并走向正史或符合历史逻辑的非正史结局。

## 在线体验

### 安史之乱 Demo

访问地址：

```text
https://demo.codercat.site
```

该部分对应仓库目录：

```text
demo.codercat.site/
```

这是面向最终用户的互动视觉小说 Demo。用户可以在 Demo 中选择历史人物身份，进入安史之乱的关键节点，阅读剧情、询问 NPC、做出决策，并体验不同历史分支。

### 历史事件生成工作台

访问地址：

```text
https://gamefac.codercat.site
```

该部分对应仓库目录：

```text
gamefac.codercat.site/
```

工作台用于管理历史事件配置、角色、节点、剧情脚本、图片素材、Prompt 规则和运行入口，是后续扩展更多历史事件的基础。

## 仓库结构

```text
.
├── demo.codercat.site/       # 安史之乱互动 Demo
├── gamefac.codercat.site/   # 历史事件生成工作台
├── README.md
└── ...
```

## 当前 Demo：乱世回响：安史之乱

当前内置 Demo 以 **安史之乱** 为例，展示流水线如何将真实历史事件转化为互动视觉小说。

### 可选角色

Demo 中包含多个历史角色视角，例如：

- 唐玄宗：皇权、长安局势、军心与个人情感之间的权衡
- 安禄山：边镇节度使的野心、恐惧与叛乱抉择
- 哥舒翰：前线将领在军事判断与政治命令之间的挣扎
- 杨贵妃：被历史风暴裹挟的个体，在危局中的求生与选择

不同角色拥有不同的：

- 目标
- 困境
- 可见信息
- 对话对象
- 决策选项
- 结局解释

## 核心玩法

### 1. 固定剧情推进

每个历史节点会先通过旁白和固定台词交代当前局势，让不了解历史的用户也能理解：

- 现在是什么时间
- 当前地点在哪里
- 发生了什么
- 玩家扮演谁
- 当前角色面对什么压力
- 为什么必须做出决策

### 2. 多角色有限视角

同一个历史事件，不同人物看到的信息不同，目标不同，能做出的选择也不同。

例如：

- 统治者关心皇权、军心和政权稳定
- 将领关心军事判断、前线风险和政治命令
- 被裹挟者关心求生、情感和政治牺牲
- 士兵 / 百姓关心生存压力、怨气和秩序崩塌

### 3. 决策前有限询问

玩家不能无限聊天，而是在关键节点前拥有有限询问次数。玩家需要向不同立场的角色提问，判断谁在说真话，谁在推卸责任，谁掌握关键情报。

### 4. AI 角色对话

NPC 会根据以下上下文生成回答：

- 当前历史事件
- 当前年份和地点
- 当前剧情节点
- NPC 身份和立场
- 玩家扮演的角色
- NPC 与玩家角色的关系
- NPC 当前知道什么、不知道什么
- 当前决策压力

AI 输出不是历史分析报告，而是角色在当前局势下对玩家说的一段话。

### 5. 状态变量与多结局

玩家选择会影响状态变量，例如：

- 军心
- 民怨
- 权威
- 信任
- 政治压力
- 历史偏离度

最终系统会根据玩家路线和状态变量导向正史结局或合理的非正史分支。

## 技术思路

### Config 驱动

史境的核心不是写死某一个历史故事，而是通过结构化配置驱动游戏运行。

核心抽象可以理解为：

```ts
type HistoricalGameConfig = {
  id: string;
  title: string;
  period: string;
  intro: string;
  timeline: TimelineEvent[];
  roles: PlayableRole[];
  npcs: NPCProfile[];
  nodes: StoryNode[];
  stateSchema: GameStateVariable[];
  randomEvents: RandomEventRule[];
  endings: EndingRule[];
};
```

只要替换历史事件配置，理论上就可以生成新的互动历史故事。

### Runtime 运行器

视觉小说运行器负责读取 `HistoricalGameConfig`，并渲染为：

- 背景图
- 角色头像 / 立绘
- 旁白
- 对话框
- 询问阶段
- 决策选项
- 状态面板
- 结局页面

### 工作台

总工作台用于把历史事件转化为结构化配置，未来可以支持：

- 输入历史事件资料
- 自动整理正史时间线
- 抽取关键决策节点
- 生成角色与 NPC
- 生成剧情脚本
- 生成 Prompt
- 配置图片素材
- 生成状态变量与结局规则
- 预览互动 Demo

## 技术栈

项目主要使用：

- React
- TypeScript
- Vite
- Node.js
- OpenAI 兼容 API
- Nginx
- systemd
- 静态网页部署

具体以各子目录中的 `package.json` 为准。

## 本地运行

分别进入对应子项目目录。

### 运行安史之乱 Demo

```bash
cd demo.codercat.site
npm install
npm run dev
```

构建：

```bash
npm run build
```

### 运行总工作台

```bash
cd gamefac.codercat.site
npm install
npm run dev
```

构建：

```bash
npm run build
```

如果项目包含后端服务，请根据对应目录中的 `package.json` 启动，例如：

```bash
npm run server
```

或：

```bash
node server/index.js
```

## 环境变量

如果使用 OpenAI 兼容 API，可以配置环境变量。

前端直连方式示例：

```env
VITE_API_BASE_URL=https://your-api-base-url/v1
VITE_API_KEY=your_api_key
VITE_MODEL_NAME=your_model_name
```

后端代理方式示例：

```env
API_BASE_URL=https://your-api-base-url/v1
API_KEY=your_api_key
MODEL_NAME=your_model_name
PORT=8788
```

正式部署时，建议使用后端代理保护 API Key，避免将密钥暴露在浏览器前端。

## 部署说明

### 前端静态部署

以安史之乱 Demo 为例：

```bash
cd demo.codercat.site
npm install
npm run build

sudo mkdir -p /var/www/demo.codercat.site/html
sudo rm -rf /var/www/demo.codercat.site/html/*
sudo cp -r dist/* /var/www/demo.codercat.site/html/
```

Nginx 示例：

```nginx
server {
    listen 80;
    server_name demo.codercat.site;

    root /var/www/demo.codercat.site/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

总工作台类似：

```bash
cd gamefac.codercat.site
npm install
npm run build

sudo mkdir -p /var/www/gamefac.codercat.site/html
sudo rm -rf /var/www/gamefac.codercat.site/html/*
sudo cp -r dist/* /var/www/gamefac.codercat.site/html/
```

Nginx 示例：

```nginx
server {
    listen 80;
    server_name gamefac.codercat.site;

    root /var/www/gamefac.codercat.site/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 后端服务部署

如果项目包含 Node 后端，建议使用 systemd 管理。

示例：

```ini
[Unit]
Description=HistWeaver API
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/histweaver/demo.codercat.site
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=8788
Environment=API_BASE_URL=https://your-api-base-url/v1
Environment=API_KEY=your_api_key
Environment=MODEL_NAME=your_model_name

[Install]
WantedBy=multi-user.target
```

重载并启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable histweaver-api
sudo systemctl restart histweaver-api
```

Nginx 代理后端接口：

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8788/;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_buffering off;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
}
```

## 适用场景

### 1. 博物馆互动展项

将某一段历史事件转化为角色扮演式互动展项，让观众从“看展板”变成“进入历史现场”。

### 2. 景区文旅导览

把古城、遗址、战场、名人故居等文旅资源转化为可对话、可选择、可传播的互动 H5 或小程序。

### 3. 历史教育

让学生通过角色选择、信息判断和决策后果理解历史因果，而不是只背时间、人物和结论。

### 4. 研学课程

作为研学任务工具，让学生在参观前后完成角色推演、分支选择和历史复盘。

### 5. 地方文化 IP

将地方历史故事转化为可传播、可二创、可持续更新的数字互动内容。

## 商业价值

史境的商业价值主要体现在：

### 目标客户

- 博物馆 / 纪念馆
- 历史文化景区
- 研学机构
- 学校历史教育场景
- 地方文旅和城市文化 IP 项目

### 交付形式

- 网页 H5
- 展厅互动屏
- 文旅小程序
- 研学课程任务
- 地方历史 IP 互动故事
- 历史事件互动内容包

### 商业模式

短期：

- 面向博物馆、景区、研学机构做 B 端定制交付
- 为具体展览、景区路线或研学课程定制互动内容

中期：

- 将总工作台产品化
- 提供历史事件配置、剧情生成、素材管理和 Demo 预览能力
- 向内容方提供 SaaS 授权

长期：

- 沉淀历史互动内容平台
- 支持更多历史事件、地方故事和用户创作
- 形成可复用的历史互动内容资产库

## 项目创新点

### 1. 从历史问答到历史推演

用户不是简单询问“某个历史事件是什么”，而是站在历史人物的位置上做选择。

### 2. 从单向导览到角色参与

用户不只是听讲解，而是以角色身份进入历史现场，与不同立场的人对话。

### 3. 从单个 Demo 到通用流水线

安史之乱只是示例，核心是可以复用到更多历史事件的生成结构。

### 4. 从随意改史到正史约束下的合理分支

系统尊重正史，同时允许符合历史逻辑的非正史结局，帮助用户理解历史结构，而不是简单爽文改写。

### 5. AI 服务于决策，而不是替代叙事

AI 被限制在决策前有限询问阶段，既保留生成式交互的灵活性，又避免剧情完全失控。

## 未来规划

### 阶段一：MVP

- 完成安史之乱 Demo
- 完成总工作台基础形态
- 实现视觉小说运行器
- 支持有限 AI 对话与多结局展示

### 阶段二：半自动生成

- 支持上传历史资料
- 辅助生成时间线、人物、节点和剧情脚本
- 支持人工编辑和校对

### 阶段三：文旅产品化

- 接入博物馆、景区和研学机构真实资料
- 支持网页 H5、小程序、展厅互动屏等多端交付

### 阶段四：多模态体验

- 接入语音
- 接入数字人
- 接入地图导览
- 接入 AR 场景
- 支持多人协作剧情

## 项目状态

当前项目处于 MVP 阶段。

已完成：

- 安史之乱互动 Demo
- 历史事件生成工作台初版
- 视觉小说式交互界面
- 多角色选择
- 决策前有限询问
- 正史 / 非正史分支设计
- 路演展示页

仍在完善：

- 更多历史事件配置
- 更稳定的 AI Prompt 规则
- 更完整的工作台编辑能力
- 历史资料自动抽取
- 更精细的状态变量与结局推演

## 作者

Created by **CoderCat**

## License

This project is for hackathon demonstration and research prototype purposes.
