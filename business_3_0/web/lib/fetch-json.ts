export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
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

export type WorkOrdersListResponse = { items: import("@/lib/mock-data").WorkOrder[]; filter: string | null };
