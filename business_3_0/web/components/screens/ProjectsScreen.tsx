"use client";

import { useQuery } from "@tanstack/react-query";
import type { Project } from "@/lib/mock-data";
import { fetchJson } from "@/lib/fetch-json";
import { isInitialQueryLoad } from "@/lib/query-display";

type ProjectsResponse = { items: Project[] };

export default function ProjectsScreen() {
  const q = useQuery({
    queryKey: ["/api/projects"],
    queryFn: () => fetchJson<ProjectsResponse>("/api/projects"),
  });

  if (isInitialQueryLoad(q.isPending, q.data)) {
    return (
      <div className="space-y-4 px-3.5 pt-4">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-white/80" />
        <div className="h-28 animate-pulse rounded-2xl bg-white/80 shadow" />
      </div>
    );
  }
  if (q.isError || !q.data) {
    return (
      <div className="mx-3.5 mt-4 rounded-2xl border border-[#e8edf4] bg-white p-6 text-center text-[var(--xlink-red)] shadow-sm">
        加载失败
        <button type="button" className="mt-4 block w-full font-bold text-[var(--xlink-primary)]" onClick={() => void q.refetch()}>
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-3.5 pb-4 pt-4">
      <h1 className="text-xl font-black text-[#111827]">项目</h1>
      <ul className="flex flex-col gap-3">
        {q.data.items.map((p) => (
          <li
            key={p.id}
            className="rounded-[14px] border border-[#e8edf4] bg-white p-4 shadow-[0_12px_28px_rgba(22,40,72,0.06)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-base font-black text-[#101827]">{p.name}</p>
                <p className="mt-1 text-xs font-semibold text-[#64748b]">
                  {p.stage} · 负责人 {p.owner}
                </p>
              </div>
              <span className="shrink-0 text-lg font-black text-[#1478ff]">{p.progress}%</span>
            </div>
            <p className="mt-2 text-xs font-bold text-[#b7791f]">{p.risk}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eef2f8]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#258bff] to-[#005ff0]"
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
