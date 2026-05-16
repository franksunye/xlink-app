import type { ReadonlyWorkflowNode, WorkOrder } from "@/lib/mock-data";
import { partLabel, statusLabel } from "@/lib/cloud-code-labels";
import { formatServiceAddress } from "@/lib/format-district";
import {
  iconForTaskType,
  resolveCardTone,
  resolveGroup,
  resolveListTags,
  resolveSourceTypeCode,
  resolveTaskType,
  statusCodesForFilter,
} from "@/lib/sa-list-display-map";
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

function cloudReadBaseUrl(): string | null {
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

export function buildCloudCookieHeader(
  incomingCookie: string | null | undefined,
  forwardedJSessionId: string | null | undefined
): string | null {
  const fromEnv = process.env.XLINK_CLOUD_READ_JSESSIONID?.trim();
  const sid = fromEnv || forwardedJSessionId?.trim();
  let c = (incomingCookie ?? "").trim();
  if (sid) {
    c = c.replace(/(?:^|;)\s*JSESSIONID=[^;]*/gi, "").replace(/^;\s*|\s*;\s*$/g, "").trim();
    c = (c ? `${c}; ` : "") + `JSESSIONID=${sid}`;
  }
  return c.length > 0 ? c : null;
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

function defaultContext(): WorkOrder["context"] {
  return {
    title: "当前阶段",
    desc: "流程详情以现网为准；此处为 POC 占位。",
    badge: "只读",
    primary: "下步动作（演示）",
    secondary: "查看资料（演示）",
    tone: "blue",
    contextIcon: "◎",
    contextTitle: "任务上下文",
    contextDesc: "开启 cloud 读且会话有效时，标题与客户等字段来自 Adapter 映射。",
  };
}

function buildWorkOrderFromSa(
  sa: Record<string, unknown>,
  opts?: { nodeDefName?: string; workflowNodes?: unknown }
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

  return {
    id: id || code,
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
    distance: "2.3 km",
    nearbyCustomers: 2,
    group,
    icon,
    tone,
    tags,
    context: { ...defaultContext(), tone },
    activities: [],
    readonlyWorkflowNodes,
  };
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
  } catch {
    json = null;
  }
  return { ok: res.ok, json };
}

function serviceAppointmentSanodeListBody(
  filter?: FilterTabKey | null,
  rows = "50"
): URLSearchParams {
  const p = new URLSearchParams();
  p.set("page", "1");
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
  rows: string,
  cookie: string | null,
  forwardedAuthToken: string | null,
  forwardedJSessionId: string | null
): Promise<FlipLike | null> {
  const { ok, json } = await fetchCloudForm(
    "basic/serviceAppointment/querySAWorkflowNode.do",
    serviceAppointmentSanodeListBody(filter, rows),
    cookie,
    forwardedAuthToken,
    forwardedJSessionId
  );
  if (!ok || !json || typeof json !== "object") return null;
  return json as FlipLike;
}

export async function cloudFetchWorkOrders(
  cookie: string | null,
  forwardedAuthToken?: string | null,
  forwardedJSessionId?: string | null,
  filter?: FilterTabKey | null
): Promise<WorkOrder[] | null> {
  if (!isCloudReadConfigured()) return null;
  const flip = await fetchSaListFlip(
    filter,
    "50",
    cookie,
    forwardedAuthToken ?? null,
    forwardedJSessionId ?? null
  );
  if (!flip?.data || !Array.isArray(flip.data)) return null;
  const out: WorkOrder[] = [];
  for (const item of flip.data) {
    if (item && typeof item === "object") {
      const mapped = mapSaWorkflowFlipRowToWorkOrder(item as Record<string, unknown>);
      if (mapped) out.push(mapped);
    }
  }
  return out;
}

export async function cloudFetchWorkOrderTabTotals(
  cookie: string | null,
  forwardedAuthToken?: string | null,
  forwardedJSessionId?: string | null
): Promise<ReturnType<typeof import("@/lib/work-order-filters").tabCountsForOrders> | null> {
  if (!isCloudReadConfigured()) return null;

  const tabKeys = FILTER_TABS.map((t) => t.key);
  const requests = tabKeys.map((key) =>
    fetchSaListFlip(
      key === "all" ? null : key,
      "1",
      cookie,
      forwardedAuthToken ?? null,
      forwardedJSessionId ?? null
    )
  );
  const results = await Promise.all(requests);
  return FILTER_TABS.map(({ key, label }, i) => {
    const flip = results[i];
    const total = typeof flip?.total === "number" ? flip.total : 0;
    return { key, label, count: total };
  });
}

export async function cloudFetchWorkOrderById(
  id: string,
  cookie: string | null,
  forwardedAuthToken?: string | null,
  forwardedJSessionId?: string | null
): Promise<WorkOrder | null> {
  if (!isCloudReadConfigured()) return null;
  const saBody = new URLSearchParams();
  saBody.set("type", "query");
  const saPath = `basic/serviceAppointment/queryById/${encodeURIComponent(id)}.do`;
  const { ok, json } = await fetchCloudForm(
    saPath,
    saBody,
    cookie,
    forwardedAuthToken ?? null,
    forwardedJSessionId ?? null
  );
  if (ok && json && typeof json === "object") {
    const rs = json as ReturnStatusLike;
    if (rs.status === 1 && rs.data && typeof rs.data === "object") {
      const d = rs.data as Record<string, unknown>;
      const sa = d.serviceAppointment;
      if (sa && typeof sa === "object") {
        return mapServiceAppointmentRecordToWorkOrder(sa as Record<string, unknown>, {
          workflowNodes: d.workflowNode,
        });
      }
    }
  }

  const body = new URLSearchParams();
  body.set("id", id);
  const legacy = await fetchCloudForm(
    "basic/workOrder/findById.do",
    body,
    cookie,
    forwardedAuthToken ?? null,
    forwardedJSessionId ?? null
  );
  if (!legacy.ok || !legacy.json || typeof legacy.json !== "object") return null;
  const rs2 = legacy.json as ReturnStatusLike;
  if (rs2.status !== 1) return null;
  const data2 = rs2.data;
  if (!data2 || typeof data2 !== "object") return null;
  const d2 = data2 as Record<string, unknown>;
  const wo = d2.workOrder;
  if (!wo || typeof wo !== "object") return null;
  return mapServiceAppointmentRecordToWorkOrder(wo as Record<string, unknown>, {
    workflowNodes: d2.workflowNode,
  });
}
