"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { WorkOrder } from "@/lib/mock-data";
import { fetchJson } from "@/lib/fetch-json";

export default function WorkOrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const q = useQuery({
    queryKey: ["work-order", id],
    queryFn: () => fetchJson<WorkOrder>(`/api/work-orders/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });

  if (!id) {
    return null;
  }

  if (q.isPending) {
    return <div className="h-48 animate-pulse rounded-lg bg-[var(--xlink-panel-soft)]" />;
  }
  if (q.isError) {
    const st = (q.error as Error & { status?: number })?.status;
    return (
      <div className="panel p-6 text-center">
        <p className="text-[var(--xlink-red)]">{st === 404 ? "未找到该任务" : "加载失败"}</p>
        <Link href="/work-orders" className="mt-4 inline-block text-[var(--xlink-primary)]">
          返回列表
        </Link>
      </div>
    );
  }

  const w = q.data;

  return (
    <div className="space-y-4">
      <Link href="/work-orders" className="text-sm text-[var(--xlink-primary)]">
        ← 返回任务
      </Link>
      <div className="panel p-4">
        <p className="text-xs text-[var(--xlink-muted)]">{w.id}</p>
        <h1 className="mt-1 text-lg font-bold text-[var(--xlink-text)]">{w.title}</h1>
        <p className="mt-2 text-sm text-[var(--xlink-muted)]">{w.customer}</p>
        <p className="mt-1 text-sm text-[var(--xlink-muted)]">{w.address}</p>
      </div>
      <div className="panel p-4">
        <h2 className="text-sm font-semibold text-[var(--xlink-text)]">当前进展</h2>
        <p className="mt-2 text-sm text-[var(--xlink-text)]">{w.context.title}</p>
        <p className="mt-1 text-xs text-[var(--xlink-muted)]">{w.context.desc}</p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-[var(--xlink-panel-soft)] px-3 py-1 text-xs">
            {w.context.primary}
          </span>
          <span className="rounded-full border border-[var(--xlink-line)] px-3 py-1 text-xs text-[var(--xlink-muted)]">
            {w.context.secondary}
          </span>
        </div>
      </div>
      <div className="panel p-4">
        <h2 className="text-sm font-semibold text-[var(--xlink-text)]">跟进记录</h2>
        <ul className="mt-3 space-y-3">
          {w.followRecords.map((r) => (
            <li key={r.id} className="border-l-2 border-[var(--xlink-primary)] pl-3">
              <p className="text-sm font-medium text-[var(--xlink-text)]">{r.title}</p>
              <p className="mt-1 text-xs text-[var(--xlink-muted)]">{r.time} · {r.owner}</p>
              <p className="mt-1 text-sm text-[var(--xlink-text)]">{r.content}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="panel p-4">
        <h2 className="text-sm font-semibold text-[var(--xlink-text)]">时间线</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--xlink-muted)]">
          {w.timeline.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
