# Business 3.0 Web（Next.js）

`business_3_0/web`：**Next.js App Router + BFF（Route Handlers）+ Mock 数据**，v0.1 管家主路径与体验向生产基线。UI 色板、渐变 Hero、卡片阴影、任务列表 Tab/卡片与详情版式 **对齐** archive 概念版（分支 [`archive/business-3-0-wip` / `business_3_0`](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0) 中 `styles/theme.css` 与 `pages/index`、`pages/work-orders` 等）；Tab 图标为矢量近似，非逐像素复刻小程序 PNG。**登录**为启动页 → 选择方式（验证码 / 密码 / 快捷）→ 表单，与概念版 `pages/login` 一致；**工作台**支持「任务优先 / 数据概览」双方案，在 **我的** 中切换，持久化键与小程序相同：`localStorage['business_3_home_variant']`（`task` | `metrics`）。范围见 [../docs/09-v0.1-scope.md](../docs/09-v0.1-scope.md)。

## Vercel（推荐配置）

1. **New Project** 指向本仓库（monorepo 根为仓库根目录）。
2. **Root Directory**：`business_3_0/web`（必填；错配会导致空部署或构建失败）。
3. **Domains**：在 Vercel → Domains 为 Production / Preview 绑定团队域名（可与 `*.vercel.app` 并存）。
4. **环境变量（可选）**：`NEXT_PUBLIC_SITE_URL` = 生产或预览站点的 **https** 基 URL（用于 OG `metadataBase`；勿提交密钥）。

**基 URL（配好后由维护者更新）**

| 环境 | 基 URL |
| --- | --- |
| Production | `https://（团队生产域或 vercel.app）` |
| Preview | `https://（团队预览域或 PR 预览链）` |

## 手动验收

见 [docs/acceptance-v0.1.md](./docs/acceptance-v0.1.md)（对齐 [10-release-and-acceptance.md](../docs/10-release-and-acceptance.md) §4）。

## BFF `Cache-Control`（与 [07-nonfunctional-and-poc.md](../docs/07-nonfunctional-and-poc.md) 一致）

| 路径 | 策略 | 说明 |
| --- | --- | --- |
| `GET /api/dashboard` | `private, no-store, must-revalidate` | 用户态聚合，不公共缓存 |
| `GET /api/work-orders`、`GET /api/work-orders/[id]` | 同上 | 列表/详情 |
| `GET /api/projects` | 同上 | 项目列表 |
| `POST /api/auth/login` | 同上（且 `Set-Cookie`） | 禁止长期 public 缓存 |
| `POST /api/auth/logout` | 同上 | 清 Cookie |

实现：`lib/http.ts` 的 `jsonResponse` 默认注入；登录路由显式同策略。

## Service Worker

- 生产环境注册 `public/sw.js`（见 `components/ServiceWorkerRegister.tsx`）。
- **不对 `/api/*` 做缓存**：`fetch` 使用 `cache: 'no-store'`，其余请求直转发（无 precache 列表）。变更须评审。

## 本地开发

```bash
cd business_3_0/web
npm install
npm run dev
```

浏览器打开 <http://localhost:3000>。

## 质量闸门

```bash
npm run lint
npm run build
```

CI：仓库根目录 `.github/workflows/business-3-0-web.yml`（变更 `business_3_0/web/**` 时跑 lint + build）。
