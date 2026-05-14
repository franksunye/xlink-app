#!/usr/bin/env bash
# 验证 v0.2 cloud 读链路与 cloud_ui 一致：POST + *.do + x-www-form-urlencoded + X-Auth-Token
# 用法（在 business_3_0/web 目录）：
#   export XLINK_CLOUD_READ_BASE_URL='http://127.0.0.1:8070/api'
#   export XLINK_CLOUD_READ_AUTH_TOKEN='<与 cloud_ui sessionStorage.token 一致>'
#   bash scripts/verify-cloud-read.sh
set -euo pipefail
BASE="${XLINK_CLOUD_READ_BASE_URL:?set XLINK_CLOUD_READ_BASE_URL (e.g. http://127.0.0.1:8070/api)}"
TOKEN="${XLINK_CLOUD_READ_AUTH_TOKEN:?set XLINK_CLOUD_READ_AUTH_TOKEN (same as cloud_ui X-Auth-Token)}"
BASE="${BASE%/}"

body_list='page=1&rows=5&sortField=createTime&sortOrder=desc&in%3Astate%7Cinteger%23and=1'
echo "== POST ${BASE}/basic/workOrder/query.do =="
code=$(curl -sS -o /tmp/xlink-wolist.json -w "%{http_code}" -X POST "${BASE}/basic/workOrder/query.do" \
  -H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' \
  -H "X-Auth-Token: ${TOKEN}" \
  --data-binary "${body_list}")

echo "HTTP ${code}"
if [[ "${code}" != "200" ]]; then
  head -c 400 /tmp/xlink-wolist.json || true
  echo
  exit 1
fi

if command -v jq >/dev/null 2>&1; then
  typ=$(jq -r '.data | type' /tmp/xlink-wolist.json)
  len=$(jq -r '.data | length' /tmp/xlink-wolist.json)
  echo "JSON .data type=${typ} length=${len}"
  if [[ "${typ}" != "array" ]]; then
    echo "FAIL: expected FlipInfo.data array"
    exit 1
  fi
  if [[ "${len}" -lt 1 ]]; then
    echo "WARN: empty list (auth ok but no rows); still considered HTTP contract OK"
  fi
  first_id=$(jq -r '.data[0]._id // .data[0].id // empty' /tmp/xlink-wolist.json)
  if [[ -n "${first_id}" && "${first_id}" != "null" ]]; then
    echo "== POST ${BASE}/basic/workOrder/findById.do id=${first_id} =="
    code2=$(curl -sS -o /tmp/xlink-woid.json -w "%{http_code}" -X POST "${BASE}/basic/workOrder/findById.do" \
      -H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' \
      -H "X-Auth-Token: ${TOKEN}" \
      --data-urlencode "id=${first_id}")
    echo "HTTP ${code2}"
    st=$(jq -r '.status // empty' /tmp/xlink-woid.json)
    echo "ReturnStatus.status=${st}"
    if [[ "${code2}" != "200" || "${st}" != "1" ]]; then
      echo "FAIL findById"
      head -c 500 /tmp/xlink-woid.json || true
      echo
      exit 1
    fi
  fi
else
  echo "OK (install jq to validate JSON shape and chain findById)"
fi
echo "PASS"
