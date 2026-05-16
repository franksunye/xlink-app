const DEFAULT_TENANT_ID = "1340835581184723420";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CodeOptions = Record<string, string>;

let statusMap: CodeOptions = {};
let partMap: CodeOptions = {};
let loadedAt = 0;
let loadPromise: Promise<void> | null = null;

function cloudReadBaseUrl(): string | null {
  const u = process.env.XLINK_CLOUD_READ_BASE_URL?.trim();
  if (!u) return null;
  try {
    return new URL(u.endsWith("/") ? u.slice(0, -1) : u).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function buildCookie(
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

type CodeRow = { eleid?: string; options?: Record<string, string> };

function ingestRows(rows: unknown): void {
  if (!Array.isArray(rows)) return;
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const r = row as CodeRow;
    const eleid = typeof r.eleid === "string" ? r.eleid : "";
    const opts = r.options;
    if (!opts || typeof opts !== "object") continue;
    if (eleid === "status") statusMap = { ...opts };
    if (eleid === "repairParts") partMap = { ...opts };
  }
}

async function fetchSelectCode(
  cookie: string | null,
  forwardedJSessionId: string | null | undefined
): Promise<boolean> {
  const base = cloudReadBaseUrl();
  if (!base) return false;
  const tenantId =
    process.env.XLINK_CLOUD_READ_TENANT_ID?.trim() || DEFAULT_TENANT_ID;
  const jsonPara = JSON.stringify([
    { eleid: "status", codeId: "STATUS" },
    { eleid: "repairParts", codeId: "repairParts" },
  ]);
  const body = new URLSearchParams();
  body.set("jsonPara", jsonPara);
  body.set("tenantId", tenantId);

  const headers: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };
  const cookieHeader = buildCookie(cookie, forwardedJSessionId);
  if (cookieHeader) headers.Cookie = cookieHeader;

  const url = `${base.replace(/\/$/, "")}/i/code/selectCode.do`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: body.toString(),
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) return false;
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
    // beta 在 Accept: application/json 时返回 JSON 字符串而非数组，需二次 parse
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
  } catch {
    return false;
  }
  if (Array.isArray(json)) {
    ingestRows(json);
    return Object.keys(statusMap).length > 0;
  }
  if (json && typeof json === "object" && Array.isArray((json as { data?: unknown }).data)) {
    ingestRows((json as { data: unknown[] }).data);
    return Object.keys(statusMap).length > 0;
  }
  return false;
}

/** 拉取 STATUS / repairParts 码表；进程内缓存 24h */
export async function loadCodeLabels(
  cookie: string | null,
  forwardedJSessionId?: string | null
): Promise<void> {
  if (Date.now() - loadedAt < CACHE_TTL_MS && Object.keys(statusMap).length > 0) {
    return;
  }
  if (loadPromise) {
    await loadPromise;
    return;
  }
  loadPromise = (async () => {
    const ok = await fetchSelectCode(cookie, forwardedJSessionId ?? null);
    if (ok) loadedAt = Date.now();
  })();
  try {
    await loadPromise;
  } finally {
    loadPromise = null;
  }
}

export function statusLabel(code: string | null | undefined): string {
  if (code == null || code === "") return "";
  const key = String(code).split(/,/)[0]?.trim() ?? "";
  return statusMap[key] ?? key;
}

export function partLabel(code: string | null | undefined): string {
  if (code == null || code === "") return "";
  const key = String(code).trim();
  return partMap[key] ?? key;
}
