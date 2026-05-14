"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dashboard } from "@/lib/mock-data";
import { dashboardQueryKey, fetchJson } from "@/lib/fetch-json";

export default function HomePage() {
  const router = useRouter();
  const q = useQuery({
    queryKey: dashboardQueryKey(),
    queryFn: () => fetchJson<Dashboard>("/api/dashboard"),
  });

  if (q.isPending) {
    return <HomeSkeleton />;
  }
  if (q.isError) {
    return (
      <div className="panel p-6 text-center">
        <p className="text-[var(--xlink-red)]">加载失败，请下拉刷新或稍后重试。</p>
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-[var(--xlink-primary)]"
          onClick={() => void q.refetch()}
        >
          重试
        </button>
      </div>
    );
  }
  const d = q.data;

  return (
    <div className="space-y-4 pb-4">
      <header>
        <p className="text-sm text-[var(--xlink-muted)]">{d.company} · {d.channel}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--xlink-text)]">{d.greeting}</h1>
        <p className="mt-1 text-sm text-[var(--xlink-muted)]">{d.dateText}</p>
      </header>

      <section className="panel p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--xlink-muted)]">
          今日概览
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {d.metrics.map((m) => (
            <div key={m.label} className="rounded-lg bg-[var(--xlink-panel-soft)] p-3 text-center">
              <div className="text-2xl font-bold text-[var(--xlink-text)]">{m.value}</div>
              <div className="text-xs text-[var(--xlink-muted)]">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-4">
        <p className="text-sm font-semibold text-[var(--xlink-text)]">待办入口</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {d.entries.map((e) => (
            <Link
              key={e.filter}
              href={`/work-orders?filter=${encodeURIComponent(e.filter)}`}
              className="flex flex-col rounded-lg border border-[var(--xlink-line)] bg-[var(--xlink-panel-soft)] p-3 text-left transition active:scale-[0.99]"
            >
              <span className="text-lg">{e.icon}</span>
              <span className="text-lg font-bold text-[var(--xlink-text)]">{e.value}</span>
              <span className="text-xs text-[var(--xlink-muted)]">{e.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel p-4">
        <p className="text-sm font-semibold text-[var(--xlink-text)]">今日任务</p>
        <ul className="mt-3 space-y-2">
          {d.homeTasks.map((t) => (
            <li key={t.key}>
              {t.orderId ? (
                <Link
                  href={`/work-orders/${t.orderId}`}
                  className="block rounded-lg border border-[var(--xlink-line)] p-3 active:bg-[var(--xlink-panel-soft)]"
                >
                  <div className="font-medium text-[var(--xlink-text)]">{t.title}</div>
                  {t.subtitle ? (
                    <div className="mt-1 text-xs text-[var(--xlink-muted)]">{t.subtitle}</div>
                  ) : null}
                </Link>
              ) : (
                <button
                  type="button"
                  className="w-full rounded-lg border border-[var(--xlink-line)] p-3 text-left active:bg-[var(--xlink-panel-soft)]"
                  onClick={() => {
                    if (t.filter) router.push(`/work-orders?filter=${encodeURIComponent(t.filter)}`);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--xlink-text)]">{t.title}</span>
                    {t.count != null ? (
                      <span className="rounded-full bg-[var(--xlink-primary)] px-2 py-0.5 text-xs text-white">
                        {t.count}
                      </span>
                    ) : null}
                  </div>
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-4">
        <p className="text-sm font-semibold text-[var(--xlink-text)]">快捷操作</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {d.quickActions.map((a) => (
            <button
              key={a.label}
              type="button"
              className="rounded-lg border border-[var(--xlink-line)] p-3 text-left text-sm active:bg-[var(--xlink-panel-soft)]"
              onClick={() => {
                if (a.toast) {
                  window.alert(a.toast);
                  return;
                }
                if (a.filter) {
                  router.push(`/work-orders?filter=${encodeURIComponent(a.filter)}`);
                }
              }}
            >
              <div className="font-semibold text-[var(--xlink-text)]">{a.label}</div>
              <div className="mt-0.5 text-xs text-[var(--xlink-muted)]">{a.desc}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-16 rounded-lg bg-[var(--xlink-panel-soft)]" />
      <div className="h-36 rounded-lg bg-[var(--xlink-panel-soft)]" />
      <div className="h-48 rounded-lg bg-[var(--xlink-panel-soft)]" />
    </div>
  );
}
