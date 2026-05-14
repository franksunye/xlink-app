# 获取 `XLINK_CLOUD_READ_JSESSIONID`（beta / `fsgo/wm`）

BFF 在 **`XLINK_CLOUD_READ_BASE_URL`** 指向 **business 小程序栈**（例如 `https://xlinkbeta.fsgo365.cn/fsgo/wm`）时，用环境变量 **`XLINK_CLOUD_READ_JSESSIONID`** 携带与浏览器一致的 **`Cookie: JSESSIONID=…`**。值来自 **`index/phoneLogin.do`** 成功响应里的 **`data.token`**，与 `code/app/business/scripts/api_client.py` 里 `login()` 后的 **`session_id`** 相同。

**会话会过期**：过期后 `/api/work-orders` 可能回到 **`X-Xlink-Read-Source: mock-fallback`**，按下面任一路径重新取一串，更新 Vercel（或本地 `.env.local`）并 **重新部署**。

---

## 方式 A：脚本一键打印（推荐）

依赖：本机已有 **`code/app/business`** 仓库，且已按该仓库内 **`docs/api-test-tooling.md`** 约定准备好 **`.venv-api-tools`**。

在终端执行（把 `BUSINESS_ROOT` 换成你本机 **`business` 仓库根目录** 的绝对路径）：

```bash
BUSINESS_ROOT="/path/to/code/app/business"
cd "$BUSINESS_ROOT" && .venv-api-tools/bin/python -c "
import sys
sys.path.insert(0, 'scripts')
from api_client import XLinkApiClient, DEFAULT_HOSTS, DEFAULT_TENANT_ID, DEFAULT_PHONE, DEFAULT_CODE
c = XLinkApiClient(host=DEFAULT_HOSTS['beta'], tenant_id=DEFAULT_TENANT_ID, phone=DEFAULT_PHONE, code=DEFAULT_CODE)
c.login()
print(c.session_id)
"
```

终端**最后一行输出**即为当前可用的 **`JSESSIONID`**，复制到：

- **一键本地 dev（推荐）**：在 `business_3_0/web` 执行 **`npm run dev:cloud`**（脚本自动登录并注入环境变量，见 `scripts/dev-with-cloud-read.sh`）。
- **Vercel**：Project → Settings → Environment Variables → `XLINK_CLOUD_READ_JSESSIONID`（建议 **Sensitive**；改完 **Redeploy**）。
- **本地**：`business_3_0/web/.env.local` 里 `XLINK_CLOUD_READ_JSESSIONID=...`（该文件勿提交）。

默认 beta 账号与覆盖方式见 `code/app/business/scripts/api_client.py` 中的 `DEFAULT_*` / `XLINK_BETA_*` 环境变量；验收步骤 **A0** 见 [acceptance-v0.2.md](./acceptance-v0.2.md) 中「档位 A」一节。

**本机校验（可选）**：

```bash
cd business_3_0/web
export XLINK_CLOUD_READ_BASE_URL='https://xlinkbeta.fsgo365.cn/fsgo/wm'
export XLINK_CLOUD_READ_JSESSIONID='<上一步粘贴>'
npm run verify:cloud-read
```

---

## 方式 B：浏览器里复制

1. 浏览器打开 beta，用**与接口一致的账号**完成登录（可与脚本默认账号相同，见 `api_client.py` / `api-test-tooling.md`）。
2. 开发者工具 → **Application** → **Cookies** → 选中 beta 站点域名。
3. 找到 **`JSESSIONID`**，复制其 **Value**，粘贴到 Vercel 或 `.env.local`。

---

## 近期频繁使用：可选 shell 函数

把 `BUSINESS_ROOT` 改成你本机路径后，可写入 `~/.zshrc`，新开终端执行 **`xlink-cloud-read-jsessionid`** 即可打印新一串：

```bash
export XLINK_BUSINESS_ROOT="$HOME/Code/xlink/code/app/business"
xlink-cloud-read-jsessionid() {
  (cd "$XLINK_BUSINESS_ROOT" && .venv-api-tools/bin/python -c "
import sys
sys.path.insert(0, 'scripts')
from api_client import XLinkApiClient, DEFAULT_HOSTS, DEFAULT_TENANT_ID, DEFAULT_PHONE, DEFAULT_CODE
c = XLinkApiClient(host=DEFAULT_HOSTS['beta'], tenant_id=DEFAULT_TENANT_ID, phone=DEFAULT_PHONE, code=DEFAULT_CODE)
c.login()
print(c.session_id)
")
}
```

---

## Vercel CLI（敏感值）

避免把密钥写进 shell 历史时，优先用 **Dashboard** 粘贴。若必须用 CLI：

```bash
cd business_3_0/web
vercel env add XLINK_CLOUD_READ_JSESSIONID production
# 按提示粘贴值；生产环境建议勾 Sensitive
```

若本机存在失效的 **`VERCEL_TOKEN`**，可先 `env -u VERCEL_TOKEN vercel ...` 再走设备登录。

---

## 与 `XLINK_CLOUD_READ_AUTH_TOKEN` 的区别

**`XLINK_CLOUD_READ_AUTH_TOKEN`** 用于 **`XLINK_CLOUD_READ_BASE_URL`** 指向 **cloud_ui**（`…/api`）且走 **`X-Auth-Token`** 的场景；**beta `fsgo/wm` 只读联调通常只需 `JSESSIONID`**，见 [README § Vercel](../README.md#vercel推荐配置)。
