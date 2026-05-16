# 任务列表 UX 备忘（Tab 筛选 + 列表切换）

> **状态**：v0.2.4+ 体验抛光；布局与卡片结构不变。  
> **实现**：`business_3_0/web/app/(app)/work-orders/WorkOrdersInner.tsx`、`app/globals.css`（`wo-filter-*` / `wo-list-*`）。

## FSL 参照说明

本仓库 **FSL = Salesforce Field Service**（领域与数据模型对照），**无**公开的「FSL 任务列表动效规范」全文。设计决策综合以下来源：

| 来源 | 用途 |
|------|------|
| [Field Service Core Data Model](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_core.htm) | 工单/预约概念边界（非 UI） |
| [11-field-service-reference](./11-field-service-reference.md)、[12-domain-glossary](./12-domain-glossary.md) | XLink 词汇与 FSL 概念对齐 |
| [Trailhead: Work From Anywhere](https://trailhead.salesforce.com/content/learn/modules/field-service-mobile/work-from-anywhere) | 移动端：日程列表为主、点项进详情、地图/日历辅助；切换视图时信息稳定、反馈克制 |
| [Salesforce Help: Using the Field Service Mobile App](https://help.salesforce.com/s/articleView?id=mfs_use_app.htm) | 企业现场 App：列表可读性、状态清晰、避免娱乐化动效 |
| v0.2.4 地基（[17-v0.2.4-scope](./17-v0.2.4-scope.md)） | `keepPreviousData`、有缓存不骨架、Tab 保活 |

## 可执行 UX 规则（任务列表）

| 维度 | 约定 |
|------|------|
| **Tab 切换** | URL `?filter=` 为真源；激活态靠字重/色 + **2px** 下划线指示条；指示条 **200ms ease** 位移，无弹跳 |
| **列表切换** | React Query `placeholderData: keepPreviousData`；切换筛选时 **不**全屏骨架；内容 **220ms** 轻 opacity 淡入（0.92→1） |
| **加载反馈** | 顶栏 **1.5px** 细进度条（低对比、慢速 indeterminate）；并行 **行级** 极低幅度 shimmer（仅刷新中） |
| **动效时长** | 交互反馈 **180–240ms**；禁止 >1s 循环「跑马灯」式强动画 |
| **密度/字阶** | Tab：`text-sm`，激活 `font-semibold`，未激活 `font-medium`；空态一句标题 + 一行说明，避免过重黑体 |
| **空态** | 有数据筛选/搜索零结果：白卡片 + 简短文案 + 可操作建议（换筛选/清空搜索） |
| **无障碍** | 列表 `aria-busy`；`prefers-reduced-motion: reduce` 下关闭位移/淡入/ shimmer，进度条改为静态细线 |

## 明确不做（本屏）

- 不改首页布局、底部 TabBar、任务卡片 DOM 结构
- 不引入 View Transitions / 共享元素（见 v0.2.4 范围外）
- 不把 `WorkOrder.status` 与支付/合同 UI 混在同一列表行
