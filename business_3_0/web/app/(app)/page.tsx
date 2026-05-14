"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dashboard, HomeTask, QuickAction, TaskOverview } from "@/lib/mock-data";
import { dashboardQueryKey, fetchJson } from "@/lib/fetch-json";
import {
  deltaTextClass,
  overviewIconClass,
  overviewValueClass,
  quickIconClass,
  taskIconWrapClass,
} from "@/lib/ui-tones";

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
      <div className="mx-3.5 mt-4 rounded-xl border border-[var(--xlink-line)] bg-white p-6 text-center shadow-sm">
        <p className="text-[var(--xlink-red)]">加载失败，请稍后重试。</p>
        <button
          type="button"
          className="mt-4 text-sm font-bold text-[var(--xlink-primary)]"
          onClick={() => void q.refetch()}
        >
          重试
        </button>
      </div>
    );
  }
  const d = q.data;

  return (
    <div className="pb-2">
      <section className="xlink-hero">
        <div className="xlink-hero-circles" aria-hidden>
          <span className="xlink-hero-circle -bottom-4 -right-16 h-52 w-52" />
          <span className="xlink-hero-circle -bottom-11 -right-1 h-36 w-36" />
        </div>
        <div className="xlink-hero-inner flex justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold leading-snug text-white/90">
              {d.company} | {d.channel}
            </p>
            <h1 className="mt-3 text-[1.65rem] font-black leading-tight tracking-tight text-white">
              {d.greeting}
            </h1>
            <p className="mt-2 text-[13px] font-semibold leading-relaxed text-white/85">{d.dateText}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-white/45 bg-white/[0.06] px-3 py-1.5 text-[12px] font-extrabold text-white">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#2ee87b]" aria-hidden />
              {d.statusText}
            </div>
          </div>
          <button
            type="button"
            className="relative mt-1 h-11 w-11 shrink-0 rounded-2xl border-[3px] border-white text-lg font-bold text-white"
            aria-label="消息（演示）"
            onClick={() => window.alert("消息中心演示中")}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-white text-sm">
              💬
            </span>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#ff3852]" aria-hidden />
          </button>
        </div>
      </section>

      <div className="relative z-10 -mt-9 space-y-4 px-3.5">
        <section className="xlink-card p-4 pt-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-[var(--xlink-text-strong)]">今日任务</h2>
            <Link href="/work-orders" className="text-[13px] font-semibold text-[#6f7685]">
              全部任务 ›
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {d.homeTasks.map((task) => (
              <HomeTaskRow key={task.key} task={task} router={router} />
            ))}
          </ul>
        </section>

        <section className="xlink-card p-4">
          <h2 className="text-lg font-black text-[var(--xlink-text-strong)]">今日结果</h2>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="text-center">
              <span className="block text-[13px] text-[#666d7d]">签单额（元）</span>
              <span className="mt-2 block text-3xl font-bold tabular-nums text-[#090f1e]">
                {d.todayResult.amount}
              </span>
              <span className="mt-1 text-[11px] font-extrabold text-[#ff4052]">较昨日 +12.5% ↗</span>
            </div>
            <div className="h-24 w-px bg-[#e1e5ec]" />
            <div className="text-center">
              <span className="block text-[13px] text-[#666d7d]">签单数（单）</span>
              <span className="mt-2 block text-3xl font-bold tabular-nums text-[#090f1e]">
                {d.todayResult.orders}
              </span>
              <span className="mt-1 text-[11px] font-extrabold text-[#ff4052]">较昨日 +2 ↗</span>
            </div>
          </div>
        </section>

        <section className="xlink-card p-4">
          <h2 className="text-lg font-black text-[var(--xlink-text-strong)]">快捷操作</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {d.quickActions.map((a) => (
              <QuickActionTile key={a.label} action={a} router={router} />
            ))}
          </div>
        </section>

        <section className="xlink-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-[var(--xlink-text-strong)]">我的任务</h2>
            <Link href="/work-orders" className="text-[13px] font-semibold text-[#6f7685]">
              全部任务 ›
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {d.taskOverview.map((item) => (
              <OverviewCell key={item.filter} item={item} />
            ))}
          </div>
        </section>

        <section className="xlink-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-[var(--xlink-text-strong)]">今日关键数据</h2>
            <span className="text-[13px] font-semibold text-[#6f7685]">更多数据 ›</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#e7ecf4] bg-white px-3 py-3">
              <p className="text-[13px] text-[#666d7d]">签单额（元）</p>
              <p className="mt-1 text-2xl font-bold text-[#090f1e]">{d.todayResult.amount}</p>
              <p className="mt-1 text-[11px] font-bold text-[#ff4052]">较昨日 +12.5% ↗</p>
            </div>
            <div className="rounded-xl border border-[#e7ecf4] bg-white px-3 py-3">
              <p className="text-[13px] text-[#666d7d]">签单数（单）</p>
              <p className="mt-1 text-2xl font-bold text-[#090f1e]">{d.todayResult.orders}</p>
              <p className="mt-1 text-[11px] font-bold text-[#ff4052]">较昨日 +2 ↗</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function HomeTaskRow({
  task,
  router,
}: {
  task: HomeTask;
  router: ReturnType<typeof useRouter>;
}) {
  const tone = task.tone ?? "blue";
  const inner = (
    <>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-lg text-white ${taskIconWrapClass(tone)}`}
      >
        <span className="leading-none">{task.iconName === "phone" ? "☎" : task.orderId ? "◷" : "◇"}</span>
      </div>
      <div className="min-w-0 flex-1">
        {task.valueText && task.labelText ? (
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-xl font-bold text-[#0d1320]">{task.valueText}</span>
            <span className="text-lg font-extrabold text-[#0d1320]">{task.labelText}</span>
          </div>
        ) : null}
        <p className={`font-bold text-[#0d1320] ${task.valueText ? "mt-1 text-[15px]" : "text-lg"}`}>
          {task.title}
        </p>
        {task.subtitle ? (
          <p className="mt-1 text-[12px] leading-snug text-[#737987]">{task.subtitle}</p>
        ) : null}
      </div>
      {task.count != null ? (
        <span
          className={`min-w-[2.5rem] text-center text-4xl font-semibold leading-none ${
            tone === "green" ? "text-[#1cb860]" : tone === "orange" ? "text-[#ff7a0a]" : "text-[#1478ff]"
          }`}
        >
          {task.count}
        </span>
      ) : (
        <span className="w-8" />
      )}
      <span className="text-2xl font-light text-[#a6acb8]">›</span>
    </>
  );

  const rowClass =
    "grid grid-cols-[44px_minmax(0,1fr)_auto_28px] items-center gap-2.5 rounded-[10px] border-2 border-[#eceff4] bg-white px-3 py-3 transition active:scale-[0.99]";

  if (task.orderId) {
    return (
      <li>
        <Link href={`/work-orders/${task.orderId}`} className={rowClass}>
          {inner}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        className={`${rowClass} w-full text-left`}
        onClick={() => {
          if (task.filter) router.push(`/work-orders?filter=${encodeURIComponent(task.filter)}`);
        }}
      >
        {inner}
      </button>
    </li>
  );
}

function QuickActionTile({
  action,
  router,
}: {
  action: QuickAction;
  router: ReturnType<typeof useRouter>;
}) {
  const glyphs: Record<string, string> = {
    customer: "👤",
    orderAdd: "＋",
    proposal: "📋",
    wallet: "￥",
  };
  const g = glyphs[action.iconName] ?? "◇";
  return (
    <button
      type="button"
      className="flex min-h-[4.5rem] items-center gap-3 rounded-xl border border-[#e7ecf4] bg-white px-3 py-2.5 text-left shadow-sm transition active:bg-[#f8faff]"
      onClick={() => {
        if (action.toast) {
          window.alert(action.toast);
          return;
        }
        if (action.route === "tasks" && action.filter) {
          router.push(`/work-orders?filter=${encodeURIComponent(action.filter)}`);
        }
      }}
    >
      <span
        className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[13px] text-xl text-white ${quickIconClass(action.tone)}`}
      >
        {g}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-black text-[#111827]">{action.label}</span>
        <span className="mt-0.5 block truncate text-[11px] text-[#8a93a3]">{action.desc}</span>
      </span>
    </button>
  );
}

function OverviewCell({ item }: { item: TaskOverview }) {
  return (
    <Link
      href={`/work-orders?filter=${encodeURIComponent(item.filter)}`}
      className="flex min-h-[5.5rem] flex-col items-center justify-center rounded-[10px] bg-gradient-to-b from-white to-[#f8faff] px-1 py-2 text-center shadow-[0_8px_20px_rgba(31,52,86,0.07)] transition active:scale-[0.98]"
    >
      <span
        className={`flex h-[30px] w-[30px] items-center justify-center rounded-[7px] text-sm text-white ${overviewIconClass(item.tone)}`}
      >
        {item.icon}
      </span>
      <span className={`mt-2 text-lg font-bold tabular-nums ${overviewValueClass(item.tone)}`}>{item.value}</span>
      <span className="mt-0.5 text-center text-[11px] font-extrabold leading-tight text-[#121a2a]">
        {item.label}
      </span>
      <span className={`mt-1 text-[9px] font-semibold ${deltaTextClass(item.deltaTone)}`}>较昨日 {item.delta}</span>
    </Link>
  );
}

function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-52 bg-gradient-to-br from-blue-500 to-blue-600" />
      <div className="-mt-8 space-y-4 px-3.5">
        <div className="h-48 rounded-2xl bg-white/90 shadow" />
        <div className="h-32 rounded-2xl bg-white/90 shadow" />
      </div>
    </div>
  );
}
