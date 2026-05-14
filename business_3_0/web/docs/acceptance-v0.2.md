# Business 3.0 Web v0.2 手动验收脚本

> 对应 [10-release-and-acceptance.md](../../docs/10-release-and-acceptance.md) §4 第 3 条；与 [13-v0.2-scope.md](../../docs/13-v0.2-scope.md)「成功标准」及 v0.1 主路径叠加。执行环境：**本地** `npm run dev` 或 **已部署 HTTPS**。

## 前置

1. 已完成 v0.1 验收脚本 [acceptance-v0.1.md](./acceptance-v0.1.md) 步骤 **1～14**（本版在其之上增量验收）。
2. `cd business_3_0/web && npm install`（若未装依赖）。

## 档位 B — Mock-only / 契约完成（必过）

1. **不配置 cloud**：不设 `USE_CLOUD_READ` 或设为 `0`；启动 `npm run dev`。
2. **任务详情 — 流程节点区**：登录后进入任一 `/work-orders/[id]`，在首屏摘要卡片与「当前任务」卡片之间应看到 **「流程节点」** 只读区块，含 **≥2** 个阶段 pill（Mock 默认演示数据）。
3. **构建**：`npm run build` 无错误退出；`npm run lint` 无新增阻塞问题。
4. **缓存头**：`GET /api/work-orders` 与 `GET /api/work-orders/[id]` 仍为 **`Cache-Control: private, no-store, must-revalidate`**（与 v0.1 一致）。

## 档位 A — 接 cloud（可选，dev 就绪时）

1. 配置环境变量：`USE_CLOUD_READ=1`，`XLINK_CLOUD_READ_BASE_URL` = 可访问的 cloud 网关根（**含**应用与模块路径前缀，无尾斜杠；须与现网实际路径拼接后可达 `basic/workOrder/query`）。
2. 浏览器先以 **cloud 有效会话** 登录同一 dev 域（使请求携带 cloud Cookie），再打开本 Web 的 `/login` 完成 Mock 登录后访问 `/work-orders`（注意：Mock 会话 Cookie 与 cloud 会话 **未必**同源；若列表仍为 Mock 数据，查看响应头 **`X-Xlink-Read-Source`**：`mock-fallback` 为预期降级）。
3. 当 **`X-Xlink-Read-Source: cloud`** 时：列表字段与 cloud 工单一致；点进详情后节点区与 cloud `findById` 映射一致或合理近似。

验收通过：**档位 B** 全过；档位 A 按团队 dev 就绪情况勾选记录。
