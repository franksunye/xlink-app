# 第 6 轮：里程碑与文档落点

> 状态：草稿

## POC 竖切顺序

（先做 1～2 个能证明 **Next.js + Vercel** 架构选择的切片；体验对齐 [archive `business_3_0`](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0)；**低代码拆解与外部集成波次**见 [06-evolution-and-poc-waves.md](./06-evolution-and-poc-waves.md)。**POC 波次 1 的验收范围**见 [09-v0.1-scope.md](./09-v0.1-scope.md)。**版本线、范围冻结、验收清单与打标前文档**见 [10-release-and-acceptance.md](./10-release-and-acceptance.md)。）

| 顺序 | 切片内容 | 目标产出 | 对应文档 / 代码落点 |
| --- | --- | --- | --- |
| 1 | Next.js **SPA + PWA** 脚手架 + Vercel 预览；Mock 数据层；**管家**主路径壳；**首轮即含缓存基线**（BFF `Cache-Control` 分类、客户端数据层 stale/去重、SW 对 `/api` 的默认排除或显式规则） | Preview 可演示 + 文档化缓存策略（见 [07-nonfunctional-and-poc](./07-nonfunctional-and-poc.md)「缓存与 PWA」）；**v0.1 条目化范围**见 [09-v0.1-scope](./09-v0.1-scope.md) | 代码落点：**[web/](../web/)** — **v0.1.0 已释放**（路由、BFF Mock、Query、PWA/SW 基线、CI、验收脚本见 `web/README.md` 与 `web/docs/acceptance-v0.1.md`） |
| 2 | 与第 4 轮流程文档对齐的节点/表单占位或只读展示 | 可对照 `business` 服务工单语义走通 UI 空壳 | [flows/](./flows/) 定稿后对齐 |

## 文档目录约定（本仓库）

| 主题 | 文件 |
| --- | --- |
| 分步说明与沟通节奏 | [01-handoff.md](./01-handoff.md) |
| 第 1 轮 | [02-vision.md](./02-vision.md)（含 **FSM 核心领域**与领域设计对标业界最佳实践之基线） |
| 第 2 轮 | [03-personas-and-scenarios.md](./03-personas-and-scenarios.md) |
| 第 3 轮 | [04-information-architecture.md](./04-information-architecture.md) |
| 第 4 轮 | [flows/](./flows/) |
| 第 5 轮 | [07-nonfunctional-and-poc.md](./07-nonfunctional-and-poc.md) |
| 第 6 轮 | 本文件 |
| 与 cloud 分期与脱离 | [05-integration-strategy.md](./05-integration-strategy.md) |
| 低代码拆解与 POC 波次 | [06-evolution-and-poc-waves.md](./06-evolution-and-poc-waves.md) |
| Web v0.1 范围 | [09-v0.1-scope.md](./09-v0.1-scope.md) |
| 版本线、验收与文档治理 | [10-release-and-acceptance.md](./10-release-and-acceptance.md) |
| 设计侧发布变更记录 | [changelog.md](./changelog.md) |

## 版本 · 范围文档 · 验收

> 流程、清单与出口门禁详见 **[10-release-and-acceptance.md](./10-release-and-acceptance.md)**。

| 版本 | 范围文档（冻结快照） | 验收 |
| --- | --- | --- |
| v0.1（POC / 波次 1） | [09-v0.1-scope.md](./09-v0.1-scope.md)（已发布） | [10 §4](./10-release-and-acceptance.md#4-验收清单模板可发布版本)；手动脚本 [web/docs/acceptance-v0.1.md](../web/docs/acceptance-v0.1.md) |
| v0.2（建议 / POC 波次 2） | `NN-v0.2-scope.md`（发布前新建） | 同 [10](./10-release-and-acceptance.md) |

## 备注

- 与 **cloud / cloud_ui 分期接入与脱离** 的策略见 [05-integration-strategy.md](./05-integration-strategy.md)。
