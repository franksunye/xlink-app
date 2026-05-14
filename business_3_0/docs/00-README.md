# Business 3.0 设计文档

本目录用于存放 **3.0 产品设计** 相关稿件：信息架构、流程、交互说明、视觉与文案约定等。

**业务边界**应与现网 **`business/`** 所覆盖的能力与规则一致；文档与 POC 的差异应体现在**体验与呈现、信息组织、技术验证**，而不是另定义一套不同的业务语义。

工程实现代码放在 `business_3_0/` 根下其它子目录（**目标栈：Next.js，部署 Vercel；早期为 SPA 式 PWA**）；此处只放与实现分离的说明类文档，便于评审与版本对照。

## 从哪开始

1. 先读 **[01-handoff.md](./01-handoff.md)**：分轮次说明与沟通节奏。
2. 按轮次编辑对应文件（第 1～6 轮），流程类在 **[flows/](./flows/)** 下按文件拆分。

## 文件索引

| 轮次 | 文件 |
| --- | --- |
| 说明 | [01-handoff.md](./01-handoff.md) |
| 第 1 轮 — 定位与边界 | [02-vision.md](./02-vision.md) |
| 第 2 轮 — 人物与场景 | [03-personas-and-scenarios.md](./03-personas-and-scenarios.md) |
| 第 3 轮 — 信息架构与导航 | [04-information-architecture.md](./04-information-architecture.md) |
| 第 4 轮 — 核心流程 | [flows/README.md](./flows/README.md)、[flows/\_template.md](./flows/_template.md) |
| 第 5 轮 — 非功能与技术 POC | [07-nonfunctional-and-poc.md](./07-nonfunctional-and-poc.md) |
| 架构 — 与 cloud 分期 | [05-integration-strategy.md](./05-integration-strategy.md) |
| 低代码拆解与 POC 波次 | [06-evolution-and-poc-waves.md](./06-evolution-and-poc-waves.md) |
| Web v0.1 范围（POC 波次 1） | [09-v0.1-scope.md](./09-v0.1-scope.md) |
| 版本线、验收与文档治理 | [10-release-and-acceptance.md](./10-release-and-acceptance.md) |
| 现场服务域：业界参照与边界 | [11-field-service-reference.md](./11-field-service-reference.md) |
| **领域词汇表（对象与字段真源）** | [12-domain-glossary.md](./12-domain-glossary.md) |
| 设计侧发布变更记录 | [changelog.md](./changelog.md) |

## 沟通时可用的格式（复制）

```text
【轮次】例如：第 1 轮 - 定位与边界
【确定】……
【待定】……
【与 business 必须一致】……
【本轮问题想请你帮我】收敛矛盾 / 补全清单 / 改成 docs 大纲 …
```
