import type { FilterTabKey } from "@/lib/work-order-filters";

/** status → Mock 风格列表主标题（产品确认，见 docs/14-v0.2.1-list-mapping.md §3.2） */
export const STATUS_TO_TASK_TYPE: Record<string, string> = {
  "101": "待接单",
  "102": "待接单",
  "103": "待接单",
  "104": "联系客户",
  "105": "预约上门",
  "200": "暂不上门",
  "201": "暂不上门",
  "202": "上门服务",
  "203": "待下单",
  "204": "上门跟进",
  "205": "跟进方案",
  "206": "跟进签约",
  "207": "待确认",
  "300": "现场服务",
  "301": "现场服务",
  "302": "现场服务",
  "401": "验收回款",
  "402": "验收回款",
  "403": "已完工",
  "407": "验收回款",
  "501": "待评价",
  "502": "待评价",
  "999": "跟进超时",
};

/** nodeDef.name → taskType（仅当 status 未命中表 ①） */
export const NODE_DEF_TO_TASK_TYPE: Record<string, string> = {
  建单: "创建工单",
  下单: "确认下单",
  预约: "预约上门",
  服务: "上门服务",
  勘察: "现场勘察",
  分派工队: "分派工队",
  工队接单: "工队接单",
};

/** status → Web Tab group（§4.2 全量 23 码） */
export const STATUS_TO_GROUP: Record<string, FilterTabKey> = {
  "101": "to_accept",
  "102": "to_accept",
  "103": "to_accept",
  "104": "need_contact",
  "105": "onsite",
  "200": "following",
  "201": "following",
  "202": "onsite",
  "203": "following",
  "204": "following",
  "205": "following",
  "206": "following",
  "207": "following",
  "300": "following",
  "301": "following",
  "302": "following",
  "401": "following",
  "402": "following",
  "403": "following",
  "407": "following",
  "501": "following",
  "502": "following",
  "999": "following",
};

/** Tab filter → cloud `in:status|array#and` 逗号分隔值 */
export const FILTER_TAB_STATUSES: Record<Exclude<FilterTabKey, "all">, string> = {
  to_accept: "101,102,103",
  need_contact: "104",
  onsite: "105,202",
  following:
    "200,201,203,204,205,206,207,300,301,302,401,402,403,407,501,502,999",
};

function statusHead(statusRaw: string): string {
  return statusRaw.split(/,/)[0]?.trim() ?? "";
}

function shortenStatusLabel(label: string): string {
  const s = label.trim();
  if (!s) return "处理中";
  if (s.length <= 8) return s;
  const trimmed = s.replace(/^待/, "").trim();
  return trimmed || s;
}

export function resolveTaskType(
  statusRaw: string,
  nodeDefName: string | null | undefined,
  statusLabelFallback?: string
): string {
  const code = statusHead(statusRaw);
  if (code && STATUS_TO_TASK_TYPE[code]) return STATUS_TO_TASK_TYPE[code];
  const node = nodeDefName?.trim();
  if (node && NODE_DEF_TO_TASK_TYPE[node]) return NODE_DEF_TO_TASK_TYPE[node];
  if (statusLabelFallback?.trim()) return shortenStatusLabel(statusLabelFallback);
  return "处理中";
}

export function resolveGroup(statusRaw: string): FilterTabKey {
  const code = statusHead(statusRaw);
  return STATUS_TO_GROUP[code] ?? "following";
}

/** `all` / null → 不传 status 限制；否则返回逗号分隔 status 列表 */
export function statusCodesForFilter(filter: FilterTabKey | null | undefined): string | null {
  if (!filter || filter === "all") return null;
  return FILTER_TAB_STATUSES[filter] ?? null;
}

/** Mock 风格字符图标（按 taskType） */
export function iconForTaskType(taskType: string): string {
  if (taskType.includes("联系")) return "☎";
  if (taskType.includes("上门") || taskType === "上门服务") return "♟";
  if (taskType.includes("签约") || taskType.includes("方案")) return "▣";
  if (taskType.includes("接单")) return "▦";
  return "▦";
}
