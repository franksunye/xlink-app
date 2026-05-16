# Business 3.0 Web（Next.js）

`business_3_0/web`：**Next.js App Router + BFF（Route Handlers）+ Mock 数据**，v0.1 管家主路径与体验向生产基线；**v0.2** 起工单列表/详情支持可选 **cloud 只读 Adapter**（见 [../docs/13-v0.2-scope.md](../docs/13-v0.2-scope.md)）；**v0.2.3** 起支持 **beta 真实登录**（`phoneLogin`）与 Dashboard/Projects/Account 读贯通（见 [../docs/16-v0.2.3-scope.md](../docs/16-v0.2.3-scope.md)）。UI 色板、渐变 Hero、卡片阴影、任务列表 Tab/卡片与详情版式 **对齐** archive 概念版（分支 [`archive/business-3-0-wip` / `business_3_0`](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0) 中 `styles/theme.css` 与 `pages/index`、`pages/work-orders` 等）；Tab 图标为矢量近似，非逐像素复刻小程序 PNG。**登录**为启动页 → 选择方式（验证码 / 密码 / 快捷）→ 表单，与概念版 `pages/login` 一致；**工作台**支持「任务优先 / 数据概览」双方案，在 **我的** 中切换，持久化键与小程序相同：`localStorage['business_3_home_variant']`（`task` | `metrics`）。范围见 [../docs/09-v0.1-scope.md](../docs/09-v0.1-scope.md)（v0.1）与 [../docs/13-v0.2-scope.md](../docs/13-v0.2-scope.md)（v0.2）。

## Vercel（推荐配置）

1. **New Project** 指向本仓库（monorepo 根为仓库根目录）。
2. **Root Directory**：`business_3_0/web`（必填；错配会导致空部署或构建失败）。
3. **Domains**：在 Vercel → Domains 为 Production / Preview 绑定团队域名（可与 `*.vercel.app` 并存）。
4. **项目内约定**：根目录已放 **`vercel.json`**（`framework: nextjs`）；环境变量清单见 **`.env.example`**。
5. **cloud 读默认走 beta（Vercel 运行时）**：当 **`VERCEL=1`** 且未设置 **`XLINK_CLOUD_VERCEL_DEFAULTS=0`** 时，若未显式配置 `USE_CLOUD_READ` / `XLINK_CLOUD_READ_BASE_URL`，则 **自动** `USE_CLOUD_READ` 视为开启、`XLINK_CLOUD_READ_BASE_URL` 为 **`https://xlinkbeta.fsgo365.cn/fsgo/wm`**（与 `code/app/business` 小程序栈一致）。覆盖方式：在 Vercel 环境变量中显式设置上述键，或设置 `XLINK_CLOUD_VERCEL_DEFAULTS=0` 恢复为纯 Mock（直至你自行配置其它 Base）。
6. **环境变量（可选）**：`NEXT_PUBLIC_SITE_URL` = 生产或预览站点的 **https** 基 URL（用于 OG `metadataBase`；勿提交密钥）。
7. **cloud 鉴权（v0.2.3 推荐登录页）**：日常联调在登录页用 beta 手机号 + 验证码（测试码 `999999`）；BFF 将 `phoneLogin.data.token` 写入 httpOnly **`xlink_b3_sess`**，读 API 自动带会话。**可选**：Vercel/CI 配置 **`XLINK_CLOUD_READ_JSESSIONID`**（脚本 `verify:cloud-read` / `dev:cloud`）；`cloud_ui` 栈仍用 **`XLINK_CLOUD_READ_AUTH_TOKEN`**。`fetchJson` 仅 legacy 转发 `localStorage['xlink_cloud_read_token']`（不含 JSESSIONID）。未配置有效会话时 BFF **降级 Mock**（`X-Xlink-Read-Source: mock-fallback`）。

**快速写入非敏感变量（CLI 示例）**：

```bash
cd business_3_0/web
vercel link   # 若尚未关联项目
echo "https://xlinkbeta.fsgo365.cn/fsgo/wm" | vercel env add XLINK_CLOUD_READ_BASE_URL production
echo "https://xlinkbeta.fsgo365.cn/fsgo/wm" | vercel env add XLINK_CLOUD_READ_BASE_URL preview
echo "1" | vercel env add USE_CLOUD_READ production
echo "1" | vercel env add USE_CLOUD_READ preview
# 敏感：在 Dashboard 粘贴或由 CI 注入，勿用 echo 进 shell 历史
# vercel env add XLINK_CLOUD_READ_JSESSIONID production
```

**cloud 只读变量说明**：`USE_CLOUD_READ`；`XLINK_CLOUD_READ_BASE_URL`；`XLINK_CLOUD_TENANT_ID`（默认 `1340835581184723420`）；`XLINK_CLOUD_READ_JSESSIONID`（CI/脚本兜底，非页面登录必需）；`XLINK_CLOUD_READ_AUTH_TOKEN`（仅 `cloud_ui`）。**列表/详情接口真源**：与 **business** `serviceAppointments`（SANode）一致，而非 cloud_ui `WorkOrders`。**获取 / 轮换 `JSESSIONID`（常用）**：[docs/xlink-cloud-read-jsessionid.md](./docs/xlink-cloud-read-jsessionid.md)；账号与工具链细节：`code/app/business/docs/api-test-tooling.md`。本地契约脚本：`npm run verify:cloud-read`。

**基 URL（当前）**

| 环境 | 基 URL |
| --- | --- |
| 生产（自定义域） | `https://app.xiulian.com.cn` |
| Vercel 项目默认域 | `https://xlink-app.vercel.app` |

## 手动验收

见 [docs/acceptance-v0.1.md](./docs/acceptance-v0.1.md)（v0.1）、[docs/acceptance-v0.2.md](./docs/acceptance-v0.2.md)（v0.2）；均对齐 [10-release-and-acceptance.md](../docs/10-release-and-acceptance.md) §4。

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

**带 beta cloud 只读（可选：自动 `api_client` 注入 `JSESSIONID`；v0.2.3 更推荐 `npm run dev` + 页面登录）**：

```bash
cd business_3_0/web
npm run dev:cloud
# 换端口：npm run dev:cloud -- -p 3001
# business 不在默认路径时：export XLINK_BUSINESS_ROOT=/path/to/code/app/business && npm run dev:cloud
```

实现见 `scripts/dev-with-cloud-read.sh`；与 [docs/xlink-cloud-read-jsessionid.md](./docs/xlink-cloud-read-jsessionid.md) 同源约定。

浏览器打开 <http://localhost:3000>。

## 质量闸门

```bash
npm run lint
npm run build
```

CI：仓库根目录 `.github/workflows/business-3-0-web.yml`（变更 `business_3_0/web/**` 时跑 lint + build）。
