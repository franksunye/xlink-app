export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (typeof window !== "undefined") {
    const t = window.localStorage.getItem("xlink_cloud_read_token")?.trim();
    if (t) headers.set("x-xlink-cloud-token", t);
    const j = window.localStorage.getItem("xlink_cloud_read_jsession")?.trim();
    if (j) headers.set("x-xlink-jsessionid", j);
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
  tabs: { key: string; label: string; count: number }[];
};
