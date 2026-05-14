import type { ReadonlyWorkflowNode, WorkOrder } from "@/lib/mock-data";

/** business / beta 小程序 API 根（与 `code/app/business` 一致） */
const DEFAULT_BETA_WM_API_ROOT = "https://xlinkbeta.fsgo365.cn/fsgo/wm";

function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1" || process.env.VERCEL === "true";
}

/** 设为 `0` / `false` 时，不在 Vercel 上自动启用 cloud 读、也不自动填 beta Base URL */
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

/**
 * Base URL 须与目标前端一致，例如：
 * - cloud_ui 本地：`http://host:8070/api`
 * - business / beta：`https://xlinkbeta.fsgo365.cn/fsgo/wm`（见 `code/app/business/docs/architecture/env-topology.md`）
 */
export function isCloudReadConfigured(): boolean {
  return cloudReadEnabledFromEnv() && Boolean(cloudReadBaseUrl());
}

/** 合并 Cookie：支持 beta `JSESSIONID`（`phoneLogin` 的 `data.token`，见 business `api_client.py`） */
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

type FlipLike = { data?: unknown[] };
type ReturnStatusLike = { status?: number; data?: unknown };

function pickId(row: Record<string, unknown>): string {
  const id = row._id ?? row.id;
  return typeof id === "string" ? id : id != null ? String(id) : "";
}

function joinAddress(row: Record<string, unknown>): string {
  const parts = [row.province, row.city, row.district, row.address]
    .filter((x) => typeof x === "string" && (x as string).trim().length > 0) as string[];
  return parts.join("") || "—";
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

/** 将 cloud `WorkOrder` JSON 映射为 BFF `WorkOrder`（缺省 UI 字段用占位补齐） */
export function mapCloudRowToWorkOrder(
  row: Record<string, unknown>,
  extras?: { workflowNodes?: unknown }
): WorkOrder {
  const id = pickId(row);
  const title = typeof row.title === "string" ? row.title : "工单";
  const name = typeof row.name === "string" ? row.name : "—";
  const status = typeof row.status === "string" ? row.status : "";
  const stage = typeof row.stage === "string" ? row.stage : "";
  const statusText = stage || status || "进行中";
  const priority = typeof row.priority === "string" ? row.priority : "普通";
  const code = typeof row.code === "string" ? row.code : id;

  const readonlyWorkflowNodes =
    mapWorkflowNodes(extras?.workflowNodes) ??
    (stage ? [{ id: "stage", label: stage, state: "current" as const }] : undefined);

  return {
    id: id || code,
    part: "屋顶",
    customerNo: code,
    taskType: title,
    title,
    customer: name,
    project: typeof row.community === "string" ? row.community : "—",
    status,
    statusText,
    priority,
    assignee: "—",
    appointment: "待定",
    timeText: "—",
    address: joinAddress(row),
    distance: "—",
    group: "following",
    icon: "▦",
    tone: "blue",
    tags: [{ text: statusText, tone: "blue" }],
    context: defaultContext(),
    activities: [],
    readonlyWorkflowNodes,
  };
}

function authTokenForCloud(forwardedToken: string | null | undefined): string | null {
  const envTok = process.env.XLINK_CLOUD_READ_AUTH_TOKEN?.trim();
  if (envTok) return envTok;
  const t = forwardedToken?.trim();
  return t || null;
}

/** POST + `application/x-www-form-urlencoded` + `.do`（cloud_ui / business 一致） */
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

/** 与 cloud_ui `WorkOrders.vue` getSA 一致的最小查询参数（仅读列表） */
function workOrderQueryBody(): URLSearchParams {
  const p = new URLSearchParams();
  p.set("page", "1");
  p.set("rows", "50");
  p.set("sortField", "createTime");
  p.set("sortOrder", "desc");
  p.set("in:state|integer#and", "1");
  return p;
}

/** 分页查询 cloud 工单列表，映射为 `WorkOrder[]` */
export async function cloudFetchWorkOrders(
  cookie: string | null,
  forwardedAuthToken?: string | null,
  forwardedJSessionId?: string | null
): Promise<WorkOrder[] | null> {
  if (!isCloudReadConfigured()) return null;
  const { ok, json } = await fetchCloudForm(
    "basic/workOrder/query.do",
    workOrderQueryBody(),
    cookie,
    forwardedAuthToken ?? null,
    forwardedJSessionId ?? null
  );
  if (!ok || !json || typeof json !== "object") return null;
  const data = (json as FlipLike).data;
  if (!Array.isArray(data)) return null;
  const out: WorkOrder[] = [];
  for (const item of data) {
    if (item && typeof item === "object") {
      out.push(mapCloudRowToWorkOrder(item as Record<string, unknown>));
    }
  }
  return out;
}

/** findById：合并 workOrder + workflowNode 列表 */
export async function cloudFetchWorkOrderById(
  id: string,
  cookie: string | null,
  forwardedAuthToken?: string | null,
  forwardedJSessionId?: string | null
): Promise<WorkOrder | null> {
  if (!isCloudReadConfigured()) return null;
  const body = new URLSearchParams();
  body.set("id", id);
  const { ok, json } = await fetchCloudForm(
    "basic/workOrder/findById.do",
    body,
    cookie,
    forwardedAuthToken ?? null,
    forwardedJSessionId ?? null
  );
  if (!ok || !json || typeof json !== "object") return null;
  const rs = json as ReturnStatusLike;
  if (rs.status !== 1) return null;
  const data = rs.data;
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const wo = d.workOrder;
  if (!wo || typeof wo !== "object") return null;
  return mapCloudRowToWorkOrder(wo as Record<string, unknown>, {
    workflowNodes: d.workflowNode,
  });
}
