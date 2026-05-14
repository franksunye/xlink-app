# XLink Business 3.0

本目录为 **Business 3.0** 在主干上的独立工程落点：在**业务与现网 `business/` 保持一致**的前提下，对**架构与技术实现**做有节制的演进与验证。

## 原则

- **业务一致**：领域对象、流程能力、与后端契约所承载的业务语义，与现有系统对齐；不因 3.0 另起一套「平行宇宙」业务规则。
- **技术可变**：工程结构、运行时选型、分层方式、性能与可维护性等，允许并鼓励通过 **POC → 收敛 → 落地** 的方式逐步推进，避免一次性大改无法验证。
- **演进节奏**：以可演示、可回滚的小步为主；每一步应能说明「相对 `business/` 解决了什么技术问题或债务」，而不是仅换栈。

## 交付形态与技术选型（当前共识）

- **体验与 IA 的第一步参照**：分支 [`archive/business-3-0-wip`](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0) 上的 `business_3_0/`（uni-app 概念小程序）已接近「想改动的第一步样子」，用于对照页面与流程，**不作为最终技术栈**。
- **主技术栈**：**Next.js**，部署在 **Vercel**（利用预览环境、迭代节奏优于以微信小程序为主交付）。
- **早期应用形态**：**单页应用（SPA）** 式交互，并作为 **PWA**（`manifest`、Service Worker 等按阶段启用）。**缓存与失效策略须从第一天与 PWA 一并设计**（避免仅后期补缓存导致源站压力与复杂重构），详见 **[docs/07-nonfunctional-and-poc.md](docs/07-nonfunctional-and-poc.md)** 中「缓存与 PWA」一节。
- **不以小程序为 3.0 主迭代面**：现网 **`business/`** 仍以小程序/App 为准做**业务与行为对照**；3.0 工程以 Web 为主推进，后续若需要小程序形态再作为单独发布面评估。

## 文档

设计类说明放在 **`docs/`**，与实现代码分开维护。分轮补全与沟通节奏见 **[docs/01-handoff.md](docs/01-handoff.md)**；与现网 **cloud 分期、脱离方式**见 **[docs/05-integration-strategy.md](docs/05-integration-strategy.md)**；**低代码拆解与 POC 波次**见 **[docs/06-evolution-and-poc-waves.md](docs/06-evolution-and-poc-waves.md)**；入口索引见 **[docs/00-README.md](docs/00-README.md)**。

## 工程实现（Next.js）

- 应用目录：**[web/](web/)**（`create-next-app` 默认模板；后续按 [docs/08-milestones.md](docs/08-milestones.md) 补路由、BFF、Mock 与 PWA 基线）。  
- 本地开发：`cd web && npm run dev`。

## 与历史尝试的关系

此前基于「概念版 / mock 优先」方向的探索代码保留在分支 **`archive/business-3-0-wip`**（[GitHub 上 `business_3_0` 目录](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0)）：适合作为**页面与流程的第一步参照**；主干上的新实现改为 **Next.js + Vercel**，不再沿用该分支的 uni-app / 小程序技术栈。新 3.0 路线以**业务对齐现网**为前提，历史分支不预设为最终架构。

## 与 `business/` 的关系

- **线上与既有协作**：在 3.0 未成为默认交付物之前，仍以 **`business/`** 为准；本目录的实验不应破坏现有发布与分支策略。
- **对照方式**：实现与联调时，以现网行为与同一后端能力为基准做对照测试，避免「新前端自说自话」偏离业务。
