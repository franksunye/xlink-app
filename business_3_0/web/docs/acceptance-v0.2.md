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

### A0 — Beta（business / `fsgo/wm`）契约（已在本机用默认测试账号跑通）

> **日常获取 `JSESSIONID` 填 Vercel / `.env.local`**：见 [xlink-cloud-read-jsessionid.md](./xlink-cloud-read-jsessionid.md)（脚本一键、浏览器、可选 shell 函数）。

前置知识（`code/app/business` 仓库，与 `xlink-app` 同工作区时常为兄弟目录）：

- 环境拓扑：`code/app/business/docs/architecture/env-topology.md`（API 根 **`/fsgo/wm/`**；beta host **`https://xlinkbeta.fsgo365.cn`**）。
- 自动冒烟与账号约定：`code/app/business/docs/api-test-tooling.md`（默认手机号 / 验证码 / 租户；脚本 **`business/scripts/run_api_smoke.sh`**）。

**已执行验证（联网环境）**：

1. `code/app/business/scripts/run_api_smoke.sh`：**全部 PASS**（登录、服务工单列表/详情、项目、合同等）。  
2. `business_3_0/web`：`XLINK_CLOUD_READ_BASE_URL=https://xlinkbeta.fsgo365.cn/fsgo/wm`，用 **`api_client` 登录得到的 `JSESSIONID`** 运行 **`npm run verify:cloud-read`**：**PASS**（`querySAWorkflowNode.do` 返回 `FlipInfo`，`data` 为数组；与小程序 **SANode** 主链路一致，见 [13-v0.2-scope.md](../../docs/13-v0.2-scope.md) §3.1）。

获取 `JSESSIONID` 示例（需在 `code/app/business` 已创建 `.venv-api-tools`）：

```bash
/path/to/business/.venv-api-tools/bin/python -c "
import sys
sys.path.insert(0, '/path/to/business/scripts')
from api_client import XLinkApiClient, DEFAULT_HOSTS, DEFAULT_TENANT_ID, DEFAULT_PHONE, DEFAULT_CODE
c = XLinkApiClient(host=DEFAULT_HOSTS['beta'], tenant_id=DEFAULT_TENANT_ID, phone=DEFAULT_PHONE, code=DEFAULT_CODE)
c.login()
print(c.session_id)
"
```

将输出粘贴为环境变量 **`XLINK_CLOUD_READ_JSESSIONID`**，再于 `business_3_0/web` 执行 **`npm run verify:cloud-read`**。

### A1 — HTTP 契约（cloud_ui：`/api` + `X-Auth-Token`，可选）

1. 在已登录 cloud_ui 的浏览器开发者工具中读取 **`sessionStorage.token`**（即 **`X-Auth-Token`**）。  
2. 在 `business_3_0/web` 目录执行：

```bash
export XLINK_CLOUD_READ_BASE_URL='http://<host>:<port>/api'
export XLINK_CLOUD_READ_AUTH_TOKEN='<上一步的 token>'
npm run verify:cloud-read
```

3. 期望终端输出 **`PASS`**，且 `querySAWorkflowNode.do` 返回 JSON 根级 **`data` 为数组**；若列表非空，脚本会继续请求 **`queryById/{id}.do`**（`type=query`）且 `status===1`。

### A2 — 经本 Web BFF（端到端）

1. 对运行 `next dev` / 部署实例配置：`USE_CLOUD_READ=1`、`XLINK_CLOUD_READ_BASE_URL`（beta 用 **`https://xlinkbeta.fsgo365.cn/fsgo/wm`**）、以及 **`XLINK_CLOUD_READ_JSESSIONID`** 或 **`XLINK_CLOUD_READ_AUTH_TOKEN`**（或在浏览器写入 `localStorage` 见 [README](../README.md)）。  
2. Mock 登录后打开 `/work-orders`，在 Network 中查看 **`GET /api/work-orders`**：响应头 **`X-Xlink-Read-Source: cloud`**（列表可为空）。  
3. 若有 **服务预约** 数据，点进详情同上 **`cloud`** 且 **「流程节点」** 区与 **`queryById` + `workflowNode`** 映射一致。

验收通过：**档位 B** 全过；**档位 A** 在目标环境上 **A0 或 A1 + A2** 按所用栈勾选通过。
