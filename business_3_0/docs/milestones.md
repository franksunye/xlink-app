# 第 6 轮：里程碑与文档落点

> 状态：草稿

## POC 竖切顺序

（先做 1～2 个能证明 **Next.js + Vercel** 架构选择的切片；体验可对齐 [archive `business_3_0`](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0)，实现为 Web 重写。）

| 顺序 | 切片内容 | 目标产出 | 对应文档 / 代码落点 |
| --- | --- | --- | --- |
| 1 | Next.js **SPA + PWA** 脚手架 + Vercel 预览；Mock 数据层；**管家**「待办 → 工单列表 → 详情壳」客户端路由与布局 | 每次 push 可打开 Preview；可安装/可登记最小 PWA 能力（按迭代加深） | 代码落点：待在本仓库 `business_3_0/` 下或后续约定的子目录创建（实现阶段定） |
| 2 | 与第 4 轮流程文档对齐的节点/表单占位或只读展示 | 可对照 `business` 服务工单语义走通 UI 空壳 | [flows/](./flows/) 定稿后对齐 |

## 文档目录约定（本仓库）

| 主题 | 文件 |
| --- | --- |
| 分步说明与沟通节奏 | [handoff.md](./handoff.md) |
| 第 1 轮 | [vision.md](./vision.md) |
| 第 2 轮 | [personas-and-scenarios.md](./personas-and-scenarios.md) |
| 第 3 轮 | [information-architecture.md](./information-architecture.md) |
| 第 4 轮 | [flows/](./flows/) |
| 第 5 轮 | [nonfunctional-and-poc.md](./nonfunctional-and-poc.md) |
| 第 6 轮 | 本文件 |
| 与 cloud 分期与脱离 | [integration-strategy.md](./integration-strategy.md) |

## 备注

- 与 **cloud / cloud_ui 分期接入与脱离** 的策略见 [integration-strategy.md](./integration-strategy.md)。
