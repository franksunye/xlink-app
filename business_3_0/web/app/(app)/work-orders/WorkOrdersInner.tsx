"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { WorkOrder } from "@/lib/mock-data";
import { fetchJson, type WorkOrdersListResponse } from "@/lib/fetch-json";

function workOrdersKey(filter: string | null) {
  return ["/api/work-orders", filter] as const;
}

export function WorkOrdersInner() {
  const search = useSearchParams();
  const filter = search.get("filter");

  const q = useQuery({
    queryKey: workOrdersKey(filter),
    queryFn: () => {
      const q = filter ? `?filter=${encodeURIComponent(filter)}` : "";
      return fetchJson<WorkOrdersListResponse>(`/api/work-orders${q}`);
    },
  });

  if (q.isPending) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-10 w-40 rounded bg-[var(--xlink-panel-soft)]" />
        <div className="h-24 rounded-lg bg-[var(--xlink-panel-soft)]" />
        <div className="h-24 rounded-lg bg-[var(--xlink-panel-soft)]" />
      </div>
    );
  }
  if (q.isError) {
    return (
      <div className="panel p-6 text-center text-[var(--xlink-red)]">
        列表加载失败
        <button type="button" className="mt-4 block w-full text-[var(--xlink-primary)]" onClick={() => void q.refetch()}>
          重试
        </button>
      </div>
    );
  }

  const items = q.data.items;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[var(--xlink-text)]">任务</h1>
        {filter ? (
          <Link href="/work-orders" className="text-sm text-[var(--xlink-primary)]">
            清除筛选
          </Link>
        ) : null}
      </div>
      {filter ? (
        <p className="text-xs text-[var(--xlink-muted)]">
          筛选：<span className="font-mono">{filter}</span>
        </p>
      ) : null}
      {items.length === 0 ? (
        <div className="panel p-8 text-center text-[var(--xlink-muted)]">暂无任务</div>
      ) : (
        <ul className="space-y-3">
          {items.map((w: WorkOrder) => (
            <li key={w.id}>
              <Link
                href={`/work-orders/${w.id}`}
                className="panel block p-4 transition active:bg-[var(--xlink-panel-soft)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-[var(--xlink-muted)]">{w.taskType}</p>
                    <p className="font-semibold text-[var(--xlink-text)]">{w.title}</p>
                    <p className="mt-1 text-sm text-[var(--xlink-muted)]">
                      {w.customer} · {w.project}
                    </p>
                  </div>
                  <span className="shrink-0 text-lg" aria-hidden>
                    {w.icon}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-[var(--xlink-muted)]">{w.address}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
