#!/usr/bin/env bash
# 本地启动 Next dev，并自动用 api_client 拉取 beta JSESSIONID 注入 cloud 只读（避免每次手 export）。
# 可选：XLINK_BUSINESS_ROOT — business 仓库根目录（默认 ~/Code/xlink/code/app/business）
# 可选：XLINK_CLOUD_READ_BASE_URL — 未设置时默认 beta wm
# 其余参数原样传给 next dev，例如：npm run dev:cloud -- -p 3001
set -euo pipefail
WEB="$(cd "$(dirname "$0")/.." && pwd)"
cd "$WEB"

BUSINESS_ROOT="${XLINK_BUSINESS_ROOT:-${HOME}/Code/xlink/code/app/business}"
VENV="${BUSINESS_ROOT}/.venv-api-tools/bin/python"
if [[ ! -x "$VENV" ]]; then
  echo "dev-with-cloud-read: 未找到可执行 Python: ${VENV}" >&2
  echo "请先创建 business 侧 .venv-api-tools，或 export XLINK_BUSINESS_ROOT=你的 code/app/business 路径" >&2
  exit 1
fi

JSESSION="$(cd "$BUSINESS_ROOT" && "$VENV" -c "
import sys
sys.path.insert(0, 'scripts')
from api_client import XLinkApiClient, DEFAULT_HOSTS, DEFAULT_TENANT_ID, DEFAULT_PHONE, DEFAULT_CODE
c = XLinkApiClient(host=DEFAULT_HOSTS['beta'], tenant_id=DEFAULT_TENANT_ID, phone=DEFAULT_PHONE, code=DEFAULT_CODE)
c.login()
print(c.session_id)
")"

export USE_CLOUD_READ=1
export XLINK_CLOUD_READ_BASE_URL="${XLINK_CLOUD_READ_BASE_URL:-https://xlinkbeta.fsgo365.cn/fsgo/wm}"
export XLINK_CLOUD_READ_JSESSIONID="$JSESSION"

echo "dev-with-cloud-read: USE_CLOUD_READ=1 BASE=${XLINK_CLOUD_READ_BASE_URL} (JSESSIONID 已注入，长度 ${#XLINK_CLOUD_READ_JSESSIONID})" >&2
exec npm run dev -- "$@"
