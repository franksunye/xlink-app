# Business 3.0 设计文档

本目录用于存放 **3.0 产品设计** 相关稿件：信息架构、流程、交互说明、视觉与文案约定等。

**业务边界**应与现网 **`business/`** 所覆盖的能力与规则一致；文档与 POC 的差异应体现在**体验与呈现、信息组织、技术验证**，而不是另定义一套不同的业务语义。

工程实现代码放在 `business_3_0/` 根下其它子目录（**目标栈：Next.js，部署 Vercel**）；此处只放与实现分离的说明类文档，便于评审与版本对照。

## 从哪开始

1. 先读 **[handoff.md](./handoff.md)**：分轮次说明与沟通节奏。
2. 按轮次编辑对应文件（第 1～6 轮），流程类在 **[flows/](./flows/)** 下按文件拆分。

## 文件索引

| 轮次 | 文件 |
| --- | --- |
| 说明 | [handoff.md](./handoff.md) |
| 第 1 轮 — 定位与边界 | [vision.md](./vision.md) |
| 第 2 轮 — 人物与场景 | [personas-and-scenarios.md](./personas-and-scenarios.md) |
| 第 3 轮 — 信息架构与导航 | [information-architecture.md](./information-architecture.md) |
| 第 4 轮 — 核心流程 | [flows/README.md](./flows/README.md)、[flows/\_template.md](./flows/_template.md) |
| 第 5 轮 — 非功能与技术 POC | [nonfunctional-and-poc.md](./nonfunctional-and-poc.md) |
| 第 6 轮 — 里程碑与落点 | [milestones.md](./milestones.md) |

## 沟通时可用的格式（复制）

```text
【轮次】例如：第 1 轮 - 定位与边界
【确定】……
【待定】……
【与 business 必须一致】……
【本轮问题想请你帮我】收敛矛盾 / 补全清单 / 改成 docs 大纲 …
```
