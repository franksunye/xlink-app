"use client";

import { useQuery } from "@tanstack/react-query";
import type { Project } from "@/lib/mock-data";
import { fetchJson } from "@/lib/fetch-json";

type ProjectsResponse = { items: Project[] };

export default function ProjectsPage() {
  const q = useQuery({
    queryKey: ["/api/projects"],
    queryFn: () => fetchJson<ProjectsResponse>("/api/projects"),
  });

  if (q.isPending) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-32 animate-pulse rounded bg-[var(--xlink-panel-soft)]" />
        <div className="h-28 animate-pulse rounded-lg bg-[var(--xlink-panel-soft)]" />
      </div>
    );
  }
  if (q.isError) {
    return (
      <div className="panel p-6 text-center text-[var(--xlink-red)]">
        加载失败
        <button type="button" className="mt-4 block w-full text-[var(--xlink-primary)]" onClick={() => void q.refetch()}>
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold text-[var(--xlink-text)]">项目</h1>
      <ul className="space-y-3">
        {q.data.items.map((p) => (
          <li key={p.id} className="panel p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[var(--xlink-text)]">{p.name}</p>
                <p className="mt-1 text-xs text-[var(--xlink-muted)]">{p.stage} · 负责人 {p.owner}</p>
              </div>
              <span className="text-sm font-bold text-[var(--xlink-primary)]">{p.progress}%</span>
            </div>
            <p className="mt-2 text-xs text-[var(--xlink-amber)]">{p.risk}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--xlink-panel-soft)]">
              <div
                className="h-full rounded-full bg-[var(--xlink-primary)] transition-all"
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
