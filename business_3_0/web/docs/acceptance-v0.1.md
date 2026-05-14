# Business 3.0 Web v0.1 手动验收脚本

> 对应 [10-release-and-acceptance.md](../../docs/10-release-and-acceptance.md) §4 第 3 条；与 [09-v0.1-scope.md](../../docs/09-v0.1-scope.md)「成功标准」及 [flows/](../../docs/flows/) 主路径一致。执行环境：**本地** `npm run dev` 或 **已部署 HTTPS**（Vercel Production / Preview）。

## 前置

1. 在仓库根目录执行 `cd business_3_0/web && npm install`（若未装依赖）。
2. 本地：`npm run dev`，浏览器打开 `http://localhost:3000`。

## 步骤（8～12 步）

1. **未登录门禁**：直接访问 `/work-orders`，应被重定向到 `/login`（URL 可带 `from` 参数）。
2. **登录失败（协议）**：在登录页不勾选协议点登录，应提示需同意协议（或等价校验），**不**进入首页。
3. **登录失败（桩）**：手机号填 `error`（大小写不敏感），应登录失败且不进入首页。
4. **登录成功**：勾选协议，手机号任意非 `error`，提交后进入 **工作台** `/`。
5. **工作台**：可见指标/今日任务等聚合块；点击跳转到任务列表的链接（若带 `filter` 参数）应进入 `/work-orders?filter=…` 且列表与筛选一致。
6. **任务列表**：在 `/work-orders` 浏览列表；点某一任务进入 `/work-orders/[id]`，可见摘要、进展、跟进、时间线等块。
7. **任务 404**：将地址栏 id 改为不存在的 id，应出现「未找到」或等价错误态，并可返回列表。
8. **项目列表**：通过底部 Tab「项目」进入 `/projects`，可见项目卡片与进度条；加载中应有骨架、失败可重试。
9. **我的 / 退出**：进入 `/account`，点「退出登录」后回到 `/login`；再访问 `/` 应再次要求登录。
10. **401 数据**：清除站点 Cookie 后，在**新标签**直接请求受保护 API（或用开发者工具对 `/api/dashboard` 发未带 Cookie 的请求），应返回 **401**（与 BFF 门禁一致）。
11. **（可选，线上）HTTPS**：在已部署环境重复步骤 4～9，确认地址栏为 **HTTPS** 且无混合内容报错。
12. **（可选）响应头 / SW**：对任意页面与 `/api/dashboard` 各查看一次响应头：页面应有基础安全头（如 `X-Content-Type-Options`）；`/api/*` 的 `Cache-Control` 应为 **非长期 public**（实现为 `private, no-store, must-revalidate`）。若在生产环境启用 SW，`public/sw.js` 对 `/api/*` 为 **network-only**，不做宽泛缓存。

验收通过：以上 **1～9** 无阻塞缺陷；**10** 符合预期；**11～12** 在适用环境执行并通过。
