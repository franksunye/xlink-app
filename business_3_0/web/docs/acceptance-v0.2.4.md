# Business 3.0 Web v0.2.4 手动验收脚本

> 对应 [17-v0.2.4-scope.md](../../docs/17-v0.2.4-scope.md) §E；在 [acceptance-v0.2.md](./acceptance-v0.2.md) **档位 B 全过 + A4（v0.2.3 登录读贯通）** 之后执行。

## 前置

1. `cd business_3_0/web && npm install`
2. `npm run build` 与 `npm run test:unit` 已通过（发版门禁）

## Tab 壳与读缓存（必过）

| # | 步骤 | 期望 |
|---|------|------|
| T1 | 登录后依次打开四 Tab，再快速切换 2 轮 | 无整页白屏；**二次**进入各 Tab **无全屏骨架** |
| T2 | 任务列表向下滚动 →「我的」→「任务」 | 滚动位置大致保留；`?filter=` 筛选保留 |
| T3 | 任务列表 → 某条详情 → 浏览器后退 | 列表仍在；有缓存时 **无全屏骨架** |
| T4 | 打开 DevTools Network，60s 内四 Tab 来回切换 | 无重复的 `GET /api/dashboard`、列表等（与 `staleTime` 一致） |
| T5 | 生产构建部署后断网刷新（可选） | 不展示 SW 缓存的私有 API 假数据 |
| T6 | 「我的」页版本号 | 显示 **0.2.4** |

## PWA（抽查）

1. `GET /manifest.webmanifest` 返回 `display: standalone`
2. `public/sw.js` 存在且对 `/api/*` 使用 `cache: no-store`（见 v0.1 验收第 16 步）

验收通过：**T1–T4、T6** 全过；T5 在已部署 HTTPS 环境可选。
