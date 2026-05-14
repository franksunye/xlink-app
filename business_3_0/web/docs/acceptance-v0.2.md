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

## 档位 A — 接 cloud（dev 就绪时必做联调）

### A1 — HTTP 契约（与 cloud_ui 对齐，推荐先做）

1. 在已登录 cloud_ui 的浏览器开发者工具中读取 **`sessionStorage.token`**（即请求头 **`X-Auth-Token`** 的值，不含引号）。  
2. 在 `business_3_0/web` 目录执行：

```bash
export XLINK_CLOUD_READ_BASE_URL='http://<host>:<port>/api'   # 与 cloud_ui src/common/common.js rootUri 一致
export XLINK_CLOUD_READ_AUTH_TOKEN='<上一步的 token>'
npm run verify:cloud-read
```

3. 期望终端输出 **`PASS`**，且 `query.do` 返回 JSON 根级 **`data` 为数组**；若列表非空，脚本会继续请求 **`findById.do`** 且 `status===1`。

### A2 — 经本 Web BFF（端到端）

1. 对运行 `next dev` / 部署实例配置：`USE_CLOUD_READ=1`、`XLINK_CLOUD_READ_BASE_URL`（同 A1）、`XLINK_CLOUD_READ_AUTH_TOKEN`（**或在**浏览器 `localStorage.setItem('xlink_cloud_read_token', '<token>')` 后刷新）。  
2. Mock 登录后打开 `/work-orders`，在开发者工具 Network 中查看 **`GET /api/work-orders`**：响应头 **`X-Xlink-Read-Source: cloud`**，响应体 `items` 与 dev 工单列表一致。  
3. 点进一条详情：同上 **`X-Xlink-Read-Source: cloud`**，且 **「流程节点」** 区与 cloud 工作流节点方向一致（有节点数据时）。

验收通过：**档位 B** 全过；**档位 A** 在目标 dev 上 **A1 + A2** 均通过。
