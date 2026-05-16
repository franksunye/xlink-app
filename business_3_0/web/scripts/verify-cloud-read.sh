#!/usr/bin/env bash
# 验证 v0.2 cloud 读链路：POST + *.do + x-www-form-urlencoded
# 鉴权二选一（与目标前端一致）：
#   - cloud_ui：X-Auth-Token → 设置 XLINK_CLOUD_READ_AUTH_TOKEN
#   - business / beta（/fsgo/wm）：JSESSIONID（phoneLogin 的 data.token）→ 设置 XLINK_CLOUD_READ_JSESSIONID
#
# v0.2.3 端到端登录读：需 dev server，curl POST /api/auth/login 后带 cookie 请求 /api/work-orders（见 acceptance A4）。
# Beta 直连示例（在 business_3_0/web 目录）：
#   export XLINK_CLOUD_READ_BASE_URL='https://xlinkbeta.fsgo365.cn/fsgo/wm'
#   export XLINK_CLOUD_READ_JSESSIONID='<python api_client login 后 session_id>'
#   npm run verify:cloud-read
# 校验路径：basic/serviceAppointment/querySAWorkflowNode.do（与 business 小程序 `serviceAppointments` SANode 一致）
set -euo pipefail
BASE="${XLINK_CLOUD_READ_BASE_URL:?set XLINK_CLOUD_READ_BASE_URL (e.g. https://xlinkbeta.fsgo365.cn/fsgo/wm)}"
BASE="${BASE%/}"
TOKEN="${XLINK_CLOUD_READ_AUTH_TOKEN:-}"
JSESS="${XLINK_CLOUD_READ_JSESSIONID:-}"

if [[ -z "${TOKEN}" && -z "${JSESS}" ]]; then
  echo "Set XLINK_CLOUD_READ_AUTH_TOKEN (cloud_ui) and/or XLINK_CLOUD_READ_JSESSIONID (business beta)" >&2
  exit 1
fi

AUTH_HEADERS=()
if [[ -n "${TOKEN}" ]]; then
  AUTH_HEADERS+=(-H "X-Auth-Token: ${TOKEN}")
fi
if [[ -n "${JSESS}" ]]; then
  AUTH_HEADERS+=(-H "Cookie: JSESSIONID=${JSESS}")
fi

# 与 business 小程序 `serviceAppointments.vue` SANode 列表一致（非 cloud_ui `workOrder/query`）
body_list='page=1&rows=5&sortField=updateTime&sortOrder=desc&orderState=all&is%3Astate%7Cinteger%23and=1'
echo "== POST ${BASE}/basic/serviceAppointment/querySAWorkflowNode.do =="
code=$(curl -sS -o /tmp/xlink-wolist.json -w "%{http_code}" -X POST "${BASE}/basic/serviceAppointment/querySAWorkflowNode.do" \
  -H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' \
  "${AUTH_HEADERS[@]}" \
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
  else
    title=$(jq -r '.data[0].data.title // empty' /tmp/xlink-wolist.json)
    status=$(jq -r '.data[0].data.status // empty' /tmp/xlink-wolist.json)
    district=$(jq -r '.data[0].data.district // empty' /tmp/xlink-wolist.json)
    echo "sample row: status=${status} district=${district} title_len=${#title}"
    if [[ -z "${title}" ]]; then
      echo "FAIL: expected nested data.title on first row"
      exit 1
    fi
    total=$(jq -r '.total // empty' /tmp/xlink-wolist.json)
    echo "Flip.total=${total}"
    if [[ -n "${status}" && "${status}" != "null" ]]; then
      echo "== filtered list in:status|array#and=${status} (rows=1, expect total) =="
      filter_body="page=1&rows=1&sortField=updateTime&sortOrder=desc&orderState=all&is%3Astate%7Cinteger%23and=1&in%3Astatus%7Carray%23and=${status}"
      code_f=$(curl -sS -o /tmp/xlink-wolist-filter.json -w "%{http_code}" -X POST "${BASE}/basic/serviceAppointment/querySAWorkflowNode.do" \
        -H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' \
        "${AUTH_HEADERS[@]}" \
        --data-binary "${filter_body}")
      echo "HTTP ${code_f}"
      ft=$(jq -r '.total // empty' /tmp/xlink-wolist-filter.json)
      echo "filtered Flip.total=${ft}"
    fi
  fi
  first_id=$(jq -r '.data[0].data._id // .data[0]._id // .data[0].id // empty' /tmp/xlink-wolist.json)
  if [[ -n "${first_id}" && "${first_id}" != "null" ]]; then
    echo "== POST ${BASE}/basic/serviceAppointment/queryById/${first_id}.do type=query =="
    code2=$(curl -sS -o /tmp/xlink-woid.json -w "%{http_code}" -X POST "${BASE}/basic/serviceAppointment/queryById/${first_id}.do" \
      -H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' \
      "${AUTH_HEADERS[@]}" \
      --data-urlencode "type=query")
    echo "HTTP ${code2}"
    st=$(jq -r '.status // empty' /tmp/xlink-woid.json)
    echo "ReturnStatus.status=${st}"
    if [[ "${code2}" != "200" || "${st}" != "1" ]]; then
      echo "FAIL queryById"
      head -c 500 /tmp/xlink-woid.json || true
      echo
      exit 1
    fi
    echo "== POST ${BASE}/biz/action/query.do (serviceAppointment, actionType 1-6) =="
    action_body="bizType=serviceAppointment&sid=${first_id}&actionType=1%2C2%2C3%2C4%2C5%2C6"
    code3=$(curl -sS -o /tmp/xlink-woactions.json -w "%{http_code}" -X POST "${BASE}/biz/action/query.do" \
      -H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' \
      "${AUTH_HEADERS[@]}" \
      --data-binary "${action_body}")
    echo "HTTP ${code3}"
    st3=$(jq -r '.status // empty' /tmp/xlink-woactions.json)
    data_typ=$(jq -r '.data | type' /tmp/xlink-woactions.json)
    echo "ReturnStatus.status=${st3} data.type=${data_typ}"
    if [[ "${code3}" != "200" || "${st3}" != "1" || "${data_typ}" != "array" ]]; then
      echo "FAIL biz/action/query.do"
      head -c 500 /tmp/xlink-woactions.json || true
      echo
      exit 1
    fi
    action_len=$(jq -r '.data | length' /tmp/xlink-woactions.json)
    echo "action rows=${action_len}"
  fi
else
  echo "OK (install jq to validate JSON shape and chain findById)"
fi
echo "PASS"
