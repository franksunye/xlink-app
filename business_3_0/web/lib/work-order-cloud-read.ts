import type { ReadonlyWorkflowNode, WorkOrder, WorkOrderActivity } from "@/lib/mock-data";
import { buildCloudCookieHeaderFromSession } from "@/lib/cloud-session";
import { loadCodeLabels, partLabel, statusLabel } from "@/lib/cloud-code-labels";
import { formatServiceAddress } from "@/lib/format-district";
import {
  currentNodeDefName,
  resolveDetailContext,
} from "@/lib/sa-detail-context";
import {
  iconForTaskType,
  resolveCardTone,
  resolveGroup,
  resolveListTags,
  resolveSourceTypeCode,
  resolveTaskType,
  statusCodesForFilter,
} from "@/lib/sa-list-display-map";
import type { UiTone } from "@/lib/ui-tones";
import {
  FILTER_TABS,
  type FilterTabKey,
} from "@/lib/work-order-filters";

/** business / beta 小程序 API 根（与 `code/app/business` 一致） */
const DEFAULT_BETA_WM_API_ROOT = "https://xlinkbeta.fsgo365.cn/fsgo/wm";

function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1" || process.env.VERCEL === "true";
}

function vercelCloudDefaultsDisabled(): boolean {
  const d = process.env.XLINK_CLOUD_VERCEL_DEFAULTS?.toLowerCase();
  return d === "0" || d === "false" || d === "no";
}

function cloudReadEnabledFromEnv(): boolean {
  const v = process.env.USE_CLOUD_READ?.toLowerCase();
  if (v === "0" || v === "false" || v === "no") return false;
  if (v === "1" || v === "true" || v === "yes") return true;
  if (isVercelRuntime() && !vercelCloudDefaultsDisabled()) return true;
  return false;
}

export function cloudReadBaseUrl(): string | null {
  let u = process.env.XLINK_CLOUD_READ_BASE_URL?.trim();
  if (!u && isVercelRuntime() && !vercelCloudDefaultsDisabled()) {
    u = DEFAULT_BETA_WM_API_ROOT;
  }
  if (!u) return null;
  try {
    return new URL(u.endsWith("/") ? u.slice(0, -1) : u).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function isCloudReadConfigured(): boolean {
  return cloudReadEnabledFromEnv() && Boolean(cloudReadBaseUrl());
}

/** @param jsessionId Resolved session (login cookie / header / env via resolveCloudJSessionId). */
export function buildCloudCookieHeader(
  incomingCookie: string | null | undefined,
  jsessionId: string | null | undefined
): string | null {
  return buildCloudCookieHeaderFromSession(jsessionId, incomingCookie);
}

type FlipLike = { data?: unknown[]; total?: number };
type ReturnStatusLike = { status?: number; data?: unknown };

function pickId(row: Record<string, unknown>): string {
  const id = row._id ?? row.id;
  return typeof id === "string" ? id : id != null ? String(id) : "";
}

function statusHead(statusRaw: string): string {
  return statusRaw.split(/,/)[0]?.trim() ?? "";
}

function nodeDefNameFromFlip(flip: Record<string, unknown>): string | undefined {
  const nodeDef = flip.nodeDef;
  if (nodeDef && typeof nodeDef === "object" && nodeDef !== null) {
    const name = (nodeDef as Record<string, unknown>).name;
    if (typeof name === "string" && name.trim()) return name.trim();
  }
  return undefined;
}

function formatApplyTimeShort(applyTimeStr: unknown): string | null {
  if (typeof applyTimeStr !== "string" || !applyTimeStr.trim()) return null;
  const s = applyTimeStr.trim();
  if (s.length >= 16) return s.slice(5, 16);
  return s;
}

function resolvePart(sa: Record<string, unknown>, exts: Record<string, unknown> | null): string {
  if (exts?.leakagesite_copy && Array.isArray(exts.leakagesite_copy) && exts.leakagesite_copy.length > 0) {
    const first = exts.leakagesite_copy[0];
    if (typeof first === "string" && first.trim()) {
      const code = first.trim();
      return partLabel(code) || code;
    }
  }
  const tag = exts?.ujTag;
  if (typeof tag === "string" && tag.trim()) return tag.trim();
  return "屋顶";
}

function mapWorkflowNodes(raw: unknown): ReadonlyWorkflowNode[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const rows = raw.filter((x): x is Record<string, unknown> => x !== null && typeof x === "object");
  const sorted = [...rows].sort((a, b) => {
    const ta = typeof a.createTime === "string" ? Date.parse(a.createTime) : 0;
    const tb = typeof b.createTime === "string" ? Date.parse(b.createTime) : 0;
    return ta - tb;
  });
  let currentAssigned = false;
  return sorted.map((node, idx) => {
    const id = pickId(node) || `wn-${idx}`;
    const stateNum = typeof node.state === "number" ? node.state : Number(node.state);
    const done = stateNum === 10;
    let state: ReadonlyWorkflowNode["state"];
    if (done) state = "done";
    else if (!currentAssigned) {
      state = "current";
      currentAssigned = true;
    } else state = "pending";

    const nodeDef = node.nodeDef;
    let label = `节点 ${idx + 1}`;
    if (nodeDef && typeof nodeDef === "object" && nodeDef !== null) {
      const nd = nodeDef as Record<string, unknown>;
      const name = nd.name ?? nd.title ?? nd.label;
      if (typeof name === "string" && name.trim()) label = name.trim();
    }
    if (typeof node.nodeId === "string" && node.nodeId && label.startsWith("节点 ")) {
      label = `${label} · ${node.nodeId}`;
    }
    return { id, label, state };
  });
}

const ACTION_TYPES_ALL = "1,2,3,4,5,6";

type ActionTypeMeta = {
  title: string;
  badge: string;
  icon: string;
  tone: UiTone;
  titleFromName?: boolean;
};

const ACTION_TYPE_META: Record<number, ActionTypeMeta> = {
  1: { title: "跟进笔记", badge: "笔记", icon: "☎", tone: "blue" },
  2: { title: "系统记录", badge: "系统", icon: "▦", tone: "gray", titleFromName: true },
  3: { title: "通话记录", badge: "电话", icon: "☎", tone: "blue" },
  4: { title: "施工日志", badge: "施工", icon: "♟", tone: "green" },
  5: { title: "调度记录", badge: "调度", icon: "▦", tone: "orange" },
  6: { title: "跟进记录", badge: "跟进", icon: "☎", tone: "blue" },
};

function listStubContext(
  taskType: string,
  statusText: string,
  tone: UiTone
): WorkOrder["context"] {
  return {
    title: taskType,
    desc: "",
    badge: statusText,
    primary: "",
    secondary: "",
    tone,
    contextIcon: iconForTaskType(taskType),
    contextTitle: taskType,
    contextDesc: "",
  };
}

function parseCloudJsonBody(json: unknown): unknown {
  if (typeof json === "string") {
    try {
      return JSON.parse(json);
    } catch {
      return json;
    }
  }
  return json;
}

function unwrapReturnStatus(json: unknown): ReturnStatusLike | null {
  const parsed = parseCloudJsonBody(json);
  if (parsed && typeof parsed === "object") return parsed as ReturnStatusLike;
  return null;
}

function actionSortKey(row: Record<string, unknown>): string {
  const st = row.sortTime ?? row.createTime;
  return typeof st === "string" ? st.trim() : "";
}

function photosFromMediaContent(mediaContent: unknown): string[] | undefined {
  if (!mediaContent) return undefined;
  let items: unknown[] | null = null;
  if (Array.isArray(mediaContent)) {
    items = mediaContent;
  } else if (typeof mediaContent === "string" && mediaContent.trim()) {
    try {
      const parsed = JSON.parse(mediaContent);
      if (Array.isArray(parsed)) items = parsed;
    } catch {
      return undefined;
    }
  }
  if (!items?.length) return undefined;
  const urls: string[] = [];
  for (const item of items) {
    if (typeof item === "string" && item.trim()) {
      urls.push(item.trim());
      continue;
    }
    if (item && typeof item === "object") {
      const u =
        (item as Record<string, unknown>).url ??
        (item as Record<string, unknown>).path ??
        (item as Record<string, unknown>).src;
      if (typeof u === "string" && u.trim()) urls.push(u.trim());
    }
  }
  return urls.length > 0 ? urls : undefined;
}

/** 将 biz/action/query.do 单行映射为 WorkOrderActivity */
export function mapActionRowToWorkOrderActivity(
  row: Record<string, unknown>
): WorkOrderActivity | null {
  const typeNum =
    typeof row.type === "number" ? row.type : Number.parseInt(String(row.type ?? ""), 10);
  if (!Number.isFinite(typeNum) || !ACTION_TYPE_META[typeNum]) return null;

  const meta = ACTION_TYPE_META[typeNum];
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const title =
    meta.titleFromName && name ? name : meta.title;
  let content =
    typeof row.content === "string"
      ? row.content
      : typeof row.data === "string"
        ? row.data
        : "";
  if (typeNum === 3) {
    const dur = row.callDuration ?? row.duration;
    if (dur != null && String(dur).trim() && !content.includes("秒")) {
      const suffix = `通话 ${String(dur).trim()} 秒`;
      content = content ? `${content}（${suffix}）` : suffix;
    }
  }
  const owner =
    typeof row.createUserName === "string" && row.createUserName.trim()
      ? row.createUserName.trim()
      : "—";
  const time =
    typeof row.createTime === "string" && row.createTime.trim()
      ? row.createTime.trim()
      : "—";
  const typeId = row.typeId;
  const id =
    typeId != null && String(typeId).trim()
      ? String(typeId).trim()
      : `${typeNum}-${time}`;

  const activity: WorkOrderActivity = {
    id,
    title,
    content,
    owner,
    time,
    icon: meta.icon,
    tone: meta.tone,
    badge: meta.badge,
  };
  if (typeNum === 1) {
    const photos = photosFromMediaContent(row.mediaContent);
    if (photos) activity.photos = photos;
  }
  return activity;
}

function sortActivitiesNewestFirst(rows: Record<string, unknown>[]): WorkOrderActivity[] {
  const sorted = [...rows].sort((a, b) => actionSortKey(b).localeCompare(actionSortKey(a)));
  const out: WorkOrderActivity[] = [];
  for (const row of sorted) {
    const mapped = mapActionRowToWorkOrderActivity(row);
    if (mapped) out.push(mapped);
  }
  return out;
}

export async function cloudFetchActivities(
  serviceAppointmentId: string,
  cookie: string | null,
  forwardedAuthToken?: string | null,
  forwardedJSessionId?: string | null
): Promise<WorkOrderActivity[]> {
  const body = new URLSearchParams();
  body.set("bizType", "serviceAppointment");
  body.set("sid", serviceAppointmentId);
  body.set("actionType", ACTION_TYPES_ALL);

  const { ok, json } = await fetchCloudForm(
    "biz/action/query.do",
    body,
    cookie,
    forwardedAuthToken ?? null,
    forwardedJSessionId ?? null
  );
  if (!ok) return [];

  const rs = unwrapReturnStatus(json);
  if (!rs || rs.status !== 1) return [];

  let data = rs.data;
  data = parseCloudJsonBody(data);
  if (!Array.isArray(data)) return [];

  const rows = data.filter((x): x is Record<string, unknown> => x !== null && typeof x === "object");
  return sortActivitiesNewestFirst(rows);
}

function buildCustomerInfo(
  sa: Record<string, unknown>,
  name: string,
  address: string,
  orderNum: string
): WorkOrder["customerInfo"] {
  const exts =
    sa.exts && typeof sa.exts === "object" ? (sa.exts as Record<string, unknown>) : null;
  const phoneRaw =
    sa.contactPhone ??
    sa.phone ??
    sa.mobile ??
    exts?.contactPhone ??
    exts?.phone;
  const phone =
    typeof phoneRaw === "string" && phoneRaw.trim() ? phoneRaw.trim() : "—";
  return [
    { label: "客户姓名", value: name },
    { label: "服务地址", value: address },
    { label: "工单编号", value: orderNum || "—" },
    { label: "联系电话", value: phone },
  ];
}

function pickContactPhone(
  sa: Record<string, unknown>,
  exts: Record<string, unknown> | null
): string | undefined {
  const phoneRaw =
    sa.contactPhone ??
    sa.phone ??
    sa.mobile ??
    exts?.contactPhone ??
    exts?.phone;
  if (typeof phoneRaw !== "string" || !phoneRaw.trim()) return undefined;
  const v = phoneRaw.trim();
  return v === "—" ? undefined : v;
}

function buildWorkOrderFromSa(
  sa: Record<string, unknown>,
  opts?: {
    nodeDefName?: string;
    workflowNodes?: unknown;
    context?: WorkOrder["context"];
    activities?: WorkOrderActivity[];
    includeCustomerInfo?: boolean;
    /** cloud 路径：不写入假距离/同小区 */
    omitDemoMetrics?: boolean;
  }
): WorkOrder {
  const id = pickId(sa);
  const title = typeof sa.title === "string" ? sa.title : "工单";
  const name = typeof sa.name === "string" ? sa.name : "—";
  const status =
    typeof sa.status === "string" ? sa.status : sa.status != null ? String(sa.status) : "";
  const codeHead = statusHead(status);
  const statusText = statusLabel(status) || codeHead || "进行中";
  const taskType = resolveTaskType(status, opts?.nodeDefName, statusText);
  const priority = typeof sa.priority === "string" ? sa.priority : "普通";
  const orderNum =
    typeof sa.orderNum === "string"
      ? sa.orderNum
      : typeof sa.code === "string"
        ? sa.code
        : "";
  const code = orderNum || id;

  const exts = sa.exts && typeof sa.exts === "object" ? (sa.exts as Record<string, unknown>) : null;
  const part = resolvePart(sa, exts);
  const sourceTypeCode = resolveSourceTypeCode(sa, exts);
  const group = resolveGroup(status);
  const tone = resolveCardTone(status, sourceTypeCode);
  const icon = iconForTaskType(taskType);
  const districtRaw = sa.district;
  const district =
    typeof districtRaw === "string" || typeof districtRaw === "number"
      ? districtRaw
      : null;
  const addressLine =
    typeof sa.address === "string" ? sa.address : typeof sa.address === "number" ? String(sa.address) : "";
  const address = formatServiceAddress(district, addressLine);

  const applyShort = formatApplyTimeShort(sa.applyTimeStr);
  const appointment = applyShort ? `预约 ${applyShort}` : "待定";
  const timeText = applyShort ?? "—";

  const tags = resolveListTags({
    status,
    statusText,
    cardTone: tone,
    applyTimeStr: sa.applyTimeStr,
    updateTime: sa.updateTime,
    sourceTypeCode,
  });

  const supervisor = exts?.supervisorName;
  const assignee =
    typeof supervisor === "string" && supervisor.trim() ? supervisor.trim() : "—";

  const readonlyWorkflowNodes =
    mapWorkflowNodes(opts?.workflowNodes) ?? undefined;

  const contactPhone = pickContactPhone(sa, exts);

  const order: WorkOrder = {
    id: id || code,
    activeNodeName: opts?.nodeDefName,
    part,
    customerNo: code,
    taskType,
    title,
    customer: name,
    project: typeof sa.community === "string" ? sa.community : "—",
    status,
    statusText,
    priority,
    assignee,
    appointment,
    timeText,
    address,
    ...(opts?.omitDemoMetrics
      ? {}
      : { distance: "2.3 km", nearbyCustomers: 2 }),
    ...(contactPhone ? { contactPhone } : {}),
    group,
    icon,
    tone,
    tags,
    context: opts?.context ?? listStubContext(taskType, statusText, tone),
    activities: opts?.activities ?? [],
    readonlyWorkflowNodes,
  };

  if (opts?.includeCustomerInfo) {
    order.customerInfo = buildCustomerInfo(sa, name, address, orderNum || code);
  }

  return order;
}

export function mapServiceAppointmentRecordToWorkOrder(
  sa: Record<string, unknown>,
  extras?: { workflowNodes?: unknown; nodeDefName?: string }
): WorkOrder {
  return buildWorkOrderFromSa(sa, extras);
}

export function mapCloudRowToWorkOrder(
  row: Record<string, unknown>,
  extras?: { workflowNodes?: unknown; nodeDefName?: string }
): WorkOrder {
  return mapServiceAppointmentRecordToWorkOrder(row, extras);
}

function mapSaWorkflowFlipRowToWorkOrder(raw: Record<string, unknown>): WorkOrder | null {
  const inner = raw.data;
  if (!inner || typeof inner !== "object") return null;
  return buildWorkOrderFromSa(inner as Record<string, unknown>, {
    nodeDefName: nodeDefNameFromFlip(raw),
    omitDemoMetrics: true,
  });
}

function authTokenForCloud(forwardedToken: string | null | undefined): string | null {
  const envTok = process.env.XLINK_CLOUD_READ_AUTH_TOKEN?.trim();
  if (envTok) return envTok;
  const t = forwardedToken?.trim();
  return t || null;
}

async function fetchCloudForm(
  path: string,
  body: URLSearchParams,
  incomingCookie: string | null,
  forwardedAuthToken: string | null,
  forwardedJSessionId: string | null
): Promise<{ ok: boolean; json: unknown }> {
  const base = cloudReadBaseUrl();
  if (!base) return { ok: false, json: null };
  const url = new URL(path.startsWith("/") ? path.slice(1) : path, `${base}/`);
  const headers: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };
  const cookie = buildCloudCookieHeader(incomingCookie, forwardedJSessionId);
  if (cookie) headers.Cookie = cookie;
  const tok = authTokenForCloud(forwardedAuthToken);
  if (tok) headers["X-Auth-Token"] = tok;

  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: body.toString(),
    cache: "no-store",
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
  } catch {
    json = null;
  }
  return { ok: res.ok, json };
}

function serviceAppointmentSanodeListBody(
  filter?: FilterTabKey | null,
  page = 1,
  rows = "10"
): URLSearchParams {
  const p = new URLSearchParams();
  p.set("page", String(page));
  p.set("rows", rows);
  p.set("sortField", "updateTime");
  p.set("sortOrder", "desc");
  p.set("orderState", "all");
  p.set("is:state|integer#and", "1");
  const codes = statusCodesForFilter(filter ?? null);
  if (codes) p.set("in:status|array#and", codes);
  return p;
}

async function fetchSaListFlip(
  filter: FilterTabKey | null | undefined,
  page: number,
  rows: string,
  cookie: string | null,
  forwardedAuthToken: string | null,
  forwardedJSessionId: string | null
): Promise<FlipLike | null> {
  const { ok, json } = await fetchCloudForm(
    "basic/serviceAppointment/querySAWorkflowNode.do",
    serviceAppointmentSanodeListBody(filter, page, rows),
    cookie,
    forwardedAuthToken,
    forwardedJSessionId
  );
  if (!ok || !json || typeof json !== "object") return null;
  return json as FlipLike;
}

function mapFlipRowsToWorkOrders(flip: FlipLike): WorkOrder[] {
  if (!flip?.data || !Array.isArray(flip.data)) return [];
  const out: WorkOrder[] = [];
  for (const item of flip.data) {
    if (item && typeof item === "object") {
      const mapped = mapSaWorkflowFlipRowToWorkOrder(item as Record<string, unknown>);
      if (mapped) out.push(mapped);
    }
  }
  return out;
}

export async function cloudFetchWorkOrdersPage(
  cookie: string | null,
  forwardedAuthToken: string | null | undefined,
  forwardedJSessionId: string | null | undefined,
  filter: FilterTabKey | null | undefined,
  page: number,
  rows: number
): Promise<import("@/lib/work-order-list-page").WorkOrderListPage | null> {
  if (!isCloudReadConfigured()) return null;
  const flip = await fetchSaListFlip(
    filter,
    page,
    String(rows),
    cookie,
    forwardedAuthToken ?? null,
    forwardedJSessionId ?? null
  );
  if (!flip) return null;
  const items = mapFlipRowsToWorkOrders(flip);
  const total = typeof flip.total === "number" ? flip.total : items.length;
  return {
    items,
    page,
    rows,
    total,
    hasMore: page * rows < total,
  };
}

/** 单页拉取（如 Dashboard 取首条）；默认第 1 页、50 条以兼容旧调用 */
export async function cloudFetchWorkOrders(
  cookie: string | null,
  forwardedAuthToken?: string | null,
  forwardedJSessionId?: string | null,
  filter?: FilterTabKey | null
): Promise<WorkOrder[] | null> {
  const page = await cloudFetchWorkOrdersPage(
    cookie,
    forwardedAuthToken,
    forwardedJSessionId,
    filter,
    1,
    50
  );
  return page?.items ?? null;
}

export type WorkOrderTabTotals = ReturnType<
  typeof import("@/lib/work-order-filters").tabCountsForOrders
>;

/** Align with React Query default staleTime — tab badges change less often than list rows. */
const TAB_TOTALS_CACHE_TTL_MS = 60_000;

let tabTotalsCache: {
  sessionKey: string;
  at: number;
  tabs: WorkOrderTabTotals;
} | null = null;

function tabTotalsSessionKey(
  forwardedJSessionId: string | null | undefined
): string {
  return forwardedJSessionId?.trim() || "no-jsession";
}

export function clearWorkOrderTabTotalsCache(): void {
  tabTotalsCache = null;
}

async function fetchWorkOrderTabTotalsFromCloud(
  cookie: string | null,
  forwardedAuthToken: string | null,
  forwardedJSessionId: string | null
): Promise<WorkOrderTabTotals> {
  const tabKeys = FILTER_TABS.map((t) => t.key);
  const requests = tabKeys.map((key) =>
    fetchSaListFlip(
      key === "all" ? null : key,
      1,
      "1",
      cookie,
      forwardedAuthToken,
      forwardedJSessionId
    )
  );
  const results = await Promise.all(requests);
  return FILTER_TABS.map(({ key, label }, i) => {
    const flip = results[i];
    const total = typeof flip?.total === "number" ? flip.total : 0;
    return { key, label, count: total };
  });
}

/** Five lightweight FlipInfo totals (rows=1). Cached per session ~60s. */
export async function cloudFetchWorkOrderTabTotals(
  cookie: string | null,
  forwardedAuthToken?: string | null,
  forwardedJSessionId?: string | null
): Promise<WorkOrderTabTotals | null> {
  if (!isCloudReadConfigured()) return null;

  const sessionKey = tabTotalsSessionKey(forwardedJSessionId ?? null);
  const now = Date.now();
  if (
    tabTotalsCache &&
    tabTotalsCache.sessionKey === sessionKey &&
    now - tabTotalsCache.at < TAB_TOTALS_CACHE_TTL_MS
  ) {
    return tabTotalsCache.tabs;
  }

  const tabs = await fetchWorkOrderTabTotalsFromCloud(
    cookie,
    forwardedAuthToken ?? null,
    forwardedJSessionId ?? null
  );
  tabTotalsCache = { sessionKey, at: now, tabs };
  return tabs;
}

async function enrichWorkOrderDetail(
  sa: Record<string, unknown>,
  workflowNodes: unknown,
  id: string,
  cookie: string | null,
  forwardedAuthToken: string | null,
  forwardedJSessionId: string | null,
  nodeDefHint?: string | null
): Promise<WorkOrder> {
  const nodeDefName = currentNodeDefName(workflowNodes, nodeDefHint);
  const status =
    typeof sa.status === "string" ? sa.status : sa.status != null ? String(sa.status) : "";
  const codeHead = statusHead(status);
  const statusText = statusLabel(status) || codeHead || "进行中";
  const taskType = resolveTaskType(status, nodeDefName, statusText);
  const exts = sa.exts && typeof sa.exts === "object" ? (sa.exts as Record<string, unknown>) : null;
  const sourceTypeCode = resolveSourceTypeCode(sa, exts);
  const tone = resolveCardTone(status, sourceTypeCode);
  const context = resolveDetailContext({ sa, taskType, statusText, tone });
  const activities = await cloudFetchActivities(
    id,
    cookie,
    forwardedAuthToken,
    forwardedJSessionId
  );

  return buildWorkOrderFromSa(sa, {
    nodeDefName,
    workflowNodes,
    context,
    activities,
    includeCustomerInfo: true,
    omitDemoMetrics: true,
  });
}

export async function cloudFetchWorkOrderById(
  id: string,
  cookie: string | null,
  forwardedAuthToken?: string | null,
  forwardedJSessionId?: string | null,
  nodeDefHint?: string | null
): Promise<WorkOrder | null> {
  if (!isCloudReadConfigured()) return null;

  await loadCodeLabels(cookie, forwardedJSessionId ?? null);

  const authTok = forwardedAuthToken ?? null;
  const jsess = forwardedJSessionId ?? null;

  const saBody = new URLSearchParams();
  saBody.set("type", "query");
  const saPath = `basic/serviceAppointment/queryById/${encodeURIComponent(id)}.do`;
  const { ok, json } = await fetchCloudForm(saPath, saBody, cookie, authTok, jsess);
  if (ok) {
    const rs = unwrapReturnStatus(json);
    if (rs?.status === 1 && rs.data && typeof rs.data === "object") {
      const d = rs.data as Record<string, unknown>;
      const sa = d.serviceAppointment;
      if (sa && typeof sa === "object") {
        const saId = pickId(sa as Record<string, unknown>) || id;
        return enrichWorkOrderDetail(
          sa as Record<string, unknown>,
          d.workflowNode,
          saId,
          cookie,
          authTok,
          jsess,
          nodeDefHint
        );
      }
    }
  }

  const body = new URLSearchParams();
  body.set("id", id);
  const legacy = await fetchCloudForm(
    "basic/workOrder/findById.do",
    body,
    cookie,
    authTok,
    jsess
  );
  if (!legacy.ok) return null;
  const rs2 = unwrapReturnStatus(legacy.json);
  if (!rs2 || rs2.status !== 1) return null;
  const data2 = rs2.data;
  if (!data2 || typeof data2 !== "object") return null;
  const d2 = data2 as Record<string, unknown>;
  const wo = d2.workOrder;
  if (!wo || typeof wo !== "object") return null;
  const woId = pickId(wo as Record<string, unknown>) || id;
  return enrichWorkOrderDetail(
    wo as Record<string, unknown>,
    d2.workflowNode,
    woId,
    cookie,
    authTok,
    jsess,
    nodeDefHint
  );
}
