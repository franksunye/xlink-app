import type { Project } from "@/lib/mock-data";
import { buildCloudCookieHeaderFromSession } from "@/lib/cloud-session";
import { cloudReadBaseUrl, isCloudReadConfigured } from "@/lib/work-order-cloud-read";

type FlipLike = { data?: unknown[]; total?: number };

const PROJECT_STATUS_LABELS: Record<string, string> = {
  accept: "已接单",
  construct: "施工中",
  complete: "已完工",
  close: "已关闭",
};

function pickId(row: Record<string, unknown>): string {
  const id = row._id ?? row.id;
  return typeof id === "string" ? id : id != null ? String(id) : "";
}

function projectNameFromRow(row: Record<string, unknown>): string {
  const title =
    (typeof row.serviceAppointmentTitle === "string" &&
      row.serviceAppointmentTitle.trim()) ||
    (typeof row.contractdocNum === "string" && row.contractdocNum.trim()) ||
    (typeof row.company === "string" && row.company.trim());
  return title || "未命名项目";
}

function stageFromRow(row: Record<string, unknown>): string {
  const raw =
    typeof row.projectStatus === "string"
      ? row.projectStatus.trim()
      : row.projectStatus != null
        ? String(row.projectStatus)
        : "";
  return PROJECT_STATUS_LABELS[raw] ?? (raw || "进行中");
}

function ownerFromRow(row: Record<string, unknown>): string {
  const pm =
    typeof row.projectManagerName === "string"
      ? row.projectManagerName.trim()
      : "";
  if (pm) return pm;
  const hk =
    typeof row.serviceHousekeeper === "string"
      ? row.serviceHousekeeper.trim()
      : "";
  return hk || "—";
}

function progressFromRow(row: Record<string, unknown>): number {
  const p = row.progress ?? row.completePercent;
  if (typeof p === "number" && Number.isFinite(p)) {
    return Math.min(100, Math.max(0, Math.round(p)));
  }
  return 0;
}

function riskFromRow(row: Record<string, unknown>): string {
  const num =
    typeof row.contractdocNum === "string" && row.contractdocNum.trim()
      ? row.contractdocNum.trim()
      : "";
  return num ? `合同 ${num}` : "—";
}

export function mapCloudProjectRow(row: Record<string, unknown>): Project {
  return {
    id: pickId(row) || "unknown",
    name: projectNameFromRow(row),
    stage: stageFromRow(row),
    owner: ownerFromRow(row),
    progress: progressFromRow(row),
    risk: riskFromRow(row),
  };
}

async function fetchCloudForm(
  path: string,
  body: URLSearchParams,
  cookieHeader: string | null,
  jsessionId: string | null,
  authToken: string | null
): Promise<{ ok: boolean; json: unknown }> {
  const base = cloudReadBaseUrl();
  if (!base) return { ok: false, json: null };
  const url = new URL(path.startsWith("/") ? path.slice(1) : path, `${base}/`);
  const headers: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };
  const cookie = buildCloudCookieHeaderFromSession(jsessionId, cookieHeader);
  if (cookie) headers.Cookie = cookie;
  if (authToken) headers["X-Auth-Token"] = authToken;

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
    if (typeof json === "string") json = JSON.parse(json);
  } catch {
    json = null;
  }
  return { ok: res.ok, json };
}

export async function cloudFetchProjects(
  cookieHeader: string | null,
  jsessionId: string | null,
  authToken?: string | null
): Promise<Project[] | null> {
  if (!isCloudReadConfigured()) return null;

  const body = new URLSearchParams();
  body.set("page", "1");
  body.set("rows", "20");
  body.set("sortField", "createTime");
  body.set("sortOrder", "desc");
  body.set("is:state|integer#and", "1");

  const { ok, json } = await fetchCloudForm(
    "biz/project/queryProject",
    body,
    cookieHeader,
    jsessionId,
    authToken ?? null
  );
  if (!ok || !json || typeof json !== "object") return null;

  const flip = json as FlipLike;
  if (!flip.data || !Array.isArray(flip.data)) return [];

  const out: Project[] = [];
  for (const item of flip.data) {
    if (item && typeof item === "object") {
      out.push(mapCloudProjectRow(item as Record<string, unknown>));
    }
  }
  return out;
}
