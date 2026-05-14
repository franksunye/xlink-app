# 流程：任务（工单）主路径

> 状态：已定稿（2026-05-15；数据与区块对齐 [archive `services/api/mock.js`](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0) 中 `getDashboard` / `getWorkOrders` / `getWorkOrder`）

## 范围

- **角色**：管家 / 服务商工程师（与 [personas](../03-personas-and-scenarios.md) 一致）。  
- **对象**：概念版 **任务** = 3.0 首期对齐的 **服务工单** 体验壳；字段语义最终对齐 `business` + `cloud`。

## 触发与结束条件

- **触发**：从 Tab「任务」或首页入口进入列表；从列表点击一行进入详情。  
- **结束（单任务视角）**：详情内完成当前 mock 所定义的「主行动」（如联系客户、查看记录）；真工作流节点待 [spec](../05-integration-strategy.md) 与 cloud 对齐后补。

## 主路径

1. **工作台** `/`：`getDashboard` — 指标、`entries` / `taskOverview` 带 `filter` 跳转列表。  
2. **任务列表** `/work-orders`：`getWorkOrders` — 支持按 `group` / `filter` 筛选（与 mock 中 `need_contact`、`to_accept` 等一致）。  
3. **任务详情** `/work-orders/[id]`：`getWorkOrder(id)` — 客户信息、`context`（主副行动）、`followRecords`；响应可含结构化 `appointments[]`（主预约映射到顶层 `appointment`/`timeText` 等）。**v0.1 Web 详情不渲染独立「服务预约」区块**；概念版 `timeline` 字符串列表亦不在 Web 展示。

## 与现网一致的状态 / 字段（对齐方向）

- 概念版使用 `status`、`statusText`、`group`、`priority` 等：**映射表**须在 BFF 或 spec 中定义到现网工单状态码（如 `business` 中 104/105/… 类语义），**不得**在 UI 层自创第二套状态机。  
- 列表排序、默认筛选：首期与 mock 一致；与现网对齐时在文档本段更新「默认策略」。

## 异常与边界

| 情况 | 期望行为 |
| --- | --- |
| 未知 `id` | mock 回退到第一条；Web 可改为 404 页 |
| 空列表 | 展示空状态；可链到创建工单（若后续开放） |
| 网络失败 | 与 PWA 缓存策略一致：列表类可按 [nonfunctional](../07-nonfunctional-and-poc.md) 使用短 stale + 重试 |

## 备注

- **售后工单**（`business` 中 `workOrder.vue`）不在本流程首期范围；若进 IA，须单独路由如 `/after-sales` 并单独流程文档。
