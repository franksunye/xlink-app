import type { ReadonlyWorkflowNode, WorkOrder } from "@/lib/mock-data";

function cloudReadEnabledFromEnv(): boolean {
  const v = process.env.USE_CLOUD_READ?.toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function cloudReadBaseUrl(): string | null {
  const u = process.env.XLINK_CLOUD_READ_BASE_URL?.trim();
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

async function fetchJson(
  path: string,
  cookie: string | null
): Promise<{ ok: boolean; json: unknown }> {
  const base = cloudReadBaseUrl();
  if (!base) return { ok: false, json: null };
  const url = new URL(path.startsWith("/") ? path.slice(1) : path, `${base}/`);
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (cookie) headers.Cookie = cookie;
  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
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

/** 分页查询 cloud 工单列表，映射为 `WorkOrder[]` */
export async function cloudFetchWorkOrders(cookie: string | null): Promise<WorkOrder[] | null> {
  if (!isCloudReadConfigured()) return null;
  const { ok, json } = await fetchJson("basic/workOrder/query?page=1&size=50", cookie);
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
  cookie: string | null
): Promise<WorkOrder | null> {
  if (!isCloudReadConfigured()) return null;
  const { ok, json } = await fetchJson(
    `basic/workOrder/findById?id=${encodeURIComponent(id)}`,
    cookie
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
