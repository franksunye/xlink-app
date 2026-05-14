"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FollowRecord, WorkOrder } from "@/lib/mock-data";
import { displayOrderNo, displayPart } from "@/lib/order-display";
import { fetchJson } from "@/lib/fetch-json";
import {
  currentCardShellClass,
  primaryActionClass,
  sectionEyebrowClass,
} from "@/lib/ui-tones";

const TABS = [
  { key: "records", label: "跟进记录" },
  { key: "customer", label: "客户信息" },
  { key: "order", label: "订单信息" },
  { key: "materials", label: "资料" },
] as const;

export default function WorkOrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("records");

  const q = useQuery({
    queryKey: ["work-order", id],
    queryFn: () => fetchJson<WorkOrder>(`/api/work-orders/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });

  if (!id) {
    return null;
  }

  if (q.isPending) {
    return (
      <div className="animate-pulse px-3.5 pt-4">
        <div className="h-40 rounded-2xl bg-white shadow-sm" />
      </div>
    );
  }
  if (q.isError) {
    const st = (q.error as Error & { status?: number })?.status;
    return (
      <div className="mx-3.5 mt-4 rounded-2xl border border-[#e4e9f1] bg-white p-6 text-center shadow-sm">
        <p className="font-bold text-[var(--xlink-red)]">{st === 404 ? "未找到该任务" : "加载失败"}</p>
        <Link href="/work-orders" className="mt-4 inline-block text-sm font-bold text-[var(--xlink-primary)]">
          返回列表
        </Link>
      </div>
    );
  }

  const w = q.data;
  const part = displayPart(w);
  const no = displayOrderNo(w);
  const ctx = w.context;
  const tone = w.tone ?? "blue";

  return (
    <div className="space-y-4 px-3.5 pb-6 pt-3">
      <Link href="/work-orders" className="inline-flex text-sm font-bold text-[#1478ff]">
        ‹ 返回任务
      </Link>

      <section className="rounded-2xl border border-[#e4e9f1] bg-white p-4 shadow-[0_10px_34px_rgba(22,40,72,0.07)]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h1 className="truncate text-base font-black text-[#101827]">{w.taskType}</h1>
            <span className="shrink-0 rounded-md bg-[#f3f5f7] px-1.5 py-0.5 text-xs font-black text-[#1f2933]">
              {part}
            </span>
            {w.statusText ? (
              <span className="shrink-0 rounded-md bg-[#ffe8e9] px-1.5 py-0.5 text-xs font-black text-[#ff4052]">
                {w.statusText}
              </span>
            ) : null}
          </div>
          <span className="shrink-0 text-right text-xs font-black text-[#ff4052]">{w.timeText}</span>
        </div>
        <p className="mt-2 text-right text-sm font-black text-[#64748b]">#{no}</p>
        <p className="mt-1 text-sm font-bold text-[#252d3d]">{w.customer}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#7c8595]">{w.address}</p>
        <p className="mt-1 text-sm font-bold text-[#252d3d]">{w.title}</p>
        <p className="mt-1 text-right text-xs text-[#64748b]">{w.distance}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {w.tags.map((t) => (
            <span
              key={t.text}
              className={`rounded-md px-2 py-0.5 text-xs font-black ${
                t.tone === "red" ? "bg-[#ffe8e9] text-[#ff4052]" : "bg-[#eef5ff] text-[#2563eb]"
              }`}
            >
              {t.text}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          {["联系客户", "客户资料", "记录跟进", "导航"].map((label) => (
            <button
              key={label}
              type="button"
              className="h-8 flex-1 rounded-lg border border-[#e1e7f0] bg-[#fbfdff] text-xs font-extrabold text-[#1478ff]"
              onClick={() => window.alert(`${label}（演示）`)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section
        className={`rounded-2xl border-2 p-4 shadow-sm ${currentCardShellClass(tone)} ${
          tone === "red"
            ? "border-[#ffd1d7]"
            : tone === "orange"
              ? "border-[#ffd9ad]"
              : tone === "purple"
                ? "border-[#dccfff]"
                : tone === "green"
                  ? "border-[#ccefdc]"
                  : "border-[#cfe3ff]"
        }`}
      >
        <span className={`text-xs font-black ${sectionEyebrowClass(tone)}`}>当前任务</span>
        <h2 className="mt-1 text-lg font-black text-[#101827]">{ctx.title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#697386]">{ctx.desc}</p>
        <button
          type="button"
          className={`mt-4 flex h-10 w-full items-center justify-center rounded-lg text-sm font-black text-white ${primaryActionClass(tone)}`}
          onClick={() => window.alert(ctx.primary)}
        >
          {ctx.primary}
        </button>
      </section>

      <section
        className={`rounded-2xl border-2 border-dashed p-4 ${
          tone === "red"
            ? "border-[#ffd1d7] bg-[#fff8f9]"
            : tone === "orange"
              ? "border-[#ffd9ad] bg-[#fffaf4]"
              : tone === "purple"
                ? "border-[#dccfff] bg-[#fbf8ff]"
                : tone === "green"
                  ? "border-[#ccefdc] bg-[#f7fffa]"
                  : "border-[#cfe3ff] bg-[#fbfdff]"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-black ${sectionEyebrowClass(tone)}`}>任务上下文</span>
          <span className="text-xs font-black text-[#778191]">{ctx.badge}</span>
        </div>
        <div className="mt-3 flex gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-black ${
              tone === "red"
                ? "bg-[#ffe8eb] text-[#ff4052]"
                : tone === "orange"
                  ? "bg-[#fff0dc] text-[#ff8a1a]"
                  : tone === "purple"
                    ? "bg-[#efeaff] text-[#7459e8]"
                    : tone === "green"
                      ? "bg-[#e8f8ef] text-[#18ae65]"
                      : "bg-[#e8f2ff] text-[#1478ff]"
            }`}
          >
            {ctx.contextIcon}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-black text-[#101827]">{ctx.contextTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#687386]">{ctx.contextDesc}</p>
          </div>
        </div>
        <button
          type="button"
          className="relative mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-black text-[#1478ff]"
          style={{
            borderColor: tone === "green" ? "#a6dfc2" : "#b9d6ff",
            background: tone === "green" ? "#f3fff8" : "#fbfdff",
            color: tone === "green" ? "#18ae65" : tone === "red" ? "#ff4052" : "#1478ff",
          }}
          onClick={() => window.alert(ctx.secondary)}
        >
          <span>{ctx.secondary.startsWith("新增") ? "+" : "›"}</span>
          {ctx.secondary}
        </button>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e4e9f1] bg-white shadow-[0_10px_34px_rgba(22,40,72,0.07)]">
        <div className="flex overflow-x-auto border-b border-[#edf1f6]">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`relative shrink-0 px-4 py-3 text-xs font-black ${
                tab === t.key ? "text-[#1478ff]" : "text-[#6f7787]"
              }`}
            >
              {t.label}
              {tab === t.key ? (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#1478ff]" />
              ) : null}
            </button>
          ))}
        </div>
        <div className="p-3">
          {tab === "records" ? <RecordList records={w.followRecords} timeline={w.timeline} /> : null}
          {tab === "customer" ? <CustomerRows w={w} /> : null}
          {tab === "order" ? (
            <EmptyPane title="暂无订单信息" desc="当前任务还未进入下单阶段，确认方案后会生成订单信息。" />
          ) : null}
          {tab === "materials" ? (
            <EmptyPane title="暂无资料" desc="当前任务暂未产生现场照片、勘察记录或报价方案。" />
          ) : null}
        </div>
      </section>
    </div>
  );
}

function RecordList({ records, timeline }: { records: FollowRecord[]; timeline: string[] }) {
  const hasRecords = records.length > 0;
  const hasTimeline = timeline.length > 0;

  if (!hasRecords && !hasTimeline) {
    return <p className="py-6 text-center text-sm text-[#8d95a5]">暂无跟进记录</p>;
  }

  return (
    <div>
      {hasRecords ? (
        <ul className="space-y-0">
          {records.map((r) => (
            <RecordRow key={r.id} r={r} />
          ))}
        </ul>
      ) : (
        <p className="py-4 text-center text-sm text-[#8d95a5]">暂无跟进记录</p>
      )}

      {hasTimeline ? (
        <div className={hasRecords ? "mt-6 border-t border-[#edf1f6] pt-4" : "pt-1"}>
          <h4 className="text-xs font-black text-[#697386]">时间线</h4>
          <ol className="mt-2 space-y-1 pl-4 text-sm text-[#4e596d]">
            {timeline.map((step) => (
              <li key={step} className="list-decimal">
                {step}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function recordDotClass(tone: string) {
  if (tone === "red") return "bg-[#ff4352]";
  if (tone === "orange") return "bg-[#ff8a1a]";
  if (tone === "purple") return "bg-[#7459e8]";
  if (tone === "green") return "bg-[#18ae65]";
  if (tone === "gray") return "bg-[#8b94a3]";
  return "bg-[#1478ff]";
}

function RecordRow({ r }: { r: FollowRecord }) {
  const badgeTone =
    r.tone === "orange"
      ? "bg-[#fff0dc] text-[#ff8a1a]"
      : r.tone === "gray"
        ? "bg-[#edf1f6] text-[#687386]"
        : "bg-[#e8f2ff] text-[#1478ff]";
  return (
    <li className="flex gap-3">
      <div className="flex w-8 flex-col items-center">
        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs text-white ${recordDotClass(r.tone)}`}>
          {r.icon}
        </span>
        <span className="mt-1 w-px flex-1 min-h-[24px] bg-[#e1e7f0]" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-black text-[#101827]">{r.title}</span>
          <span className={`rounded-md px-1.5 py-0.5 text-xs font-black ${badgeTone}`}>{r.badge}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#4e596d]">{r.content}</p>
        <p className="mt-2 text-xs text-[#8d95a5]">
          👷 {r.owner} · {r.time}
        </p>
      </div>
    </li>
  );
}

function CustomerRows({ w }: { w: WorkOrder }) {
  const rows = [
    { label: "客户姓名", value: w.customer },
    { label: "服务地址", value: w.address },
    { label: "客户编号", value: w.customerNo ?? w.id },
  ];
  return (
    <ul>
      {rows.map((row) => (
        <li
          key={row.label}
          className="flex items-center justify-between gap-3 border-b border-[#edf1f6] py-3 text-sm last:border-0"
        >
          <span className="text-[#7a8394]">{row.label}</span>
          <span className="max-w-[60%] text-right font-black text-[#192234]">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

function EmptyPane({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d8e0eb] bg-[#fbfcfe] px-4 py-8 text-center">
      <p className="text-sm font-black text-[#354052]">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-[#7a8394]">{desc}</p>
    </div>
  );
}
