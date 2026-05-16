export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  // Legacy dev: optional cloud_ui X-Auth-Token in localStorage (not JSESSIONID — session is httpOnly cookie).
  if (typeof window !== "undefined") {
    const t = window.localStorage.getItem("xlink_cloud_read_token")?.trim();
    if (t) headers.set("x-xlink-cloud-token", t);
  }
  const res = await fetch(url, {
    ...init,
    credentials: init?.credentials ?? "include",
    headers,
  });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

export function dashboardQueryKey() {
  return ["/api/dashboard"] as const;
}

export type WorkOrdersListResponse = {
  items: import("@/lib/mock-data").WorkOrder[];
  filter: string | null;
  /** Present on page=1 only; later pages reuse client-held tab badges. */
  tabs?: { key: string; label: string; count: number }[];
  page: number;
  rows: number;
  total: number;
  hasMore: boolean;
};
