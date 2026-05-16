"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { WorkOrder } from "@/lib/mock-data";
import { displayOrderNo, displayPart } from "@/lib/order-display";
import { fetchJson, type WorkOrdersListResponse } from "@/lib/fetch-json";
import {
  listTagClass,
  phoneButtonTextClass,
  taskCardStripeClass,
  taskIconWrapClass,
} from "@/lib/ui-tones";
import type { FilterTabKey } from "@/lib/work-order-filters";

function workOrdersKey(filter: string | null) {
  return ["/api/work-orders", filter] as const;
}

export function WorkOrdersInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") as FilterTabKey | null;
  const activeTab: FilterTabKey =
    filter && ["to_accept", "need_contact", "onsite", "following", "all"].includes(filter)
      ? filter
      : "all";

  const [keyword, setKeyword] = useState("");

  const q = useQuery({
    queryKey: workOrdersKey(activeTab === "all" ? null : activeTab),
    queryFn: () => {
      const qstr = activeTab === "all" ? "" : `?filter=${encodeURIComponent(activeTab)}`;
      return fetchJson<WorkOrdersListResponse>(`/api/work-orders${qstr}`);
    },
  });

  const visible = useMemo(() => {
    if (!q.data) return [];
    const k = keyword.trim().toLowerCase();
    if (!k) return q.data.items;
    return q.data.items.filter((o) => {
      const hay = [
        o.id,
        o.taskType,
        o.title,
        o.customer,
        o.project,
        o.address,
        displayPart(o),
        o.customerNo,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(k);
    });
  }, [q.data, keyword]);

  function setTab(key: FilterTabKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") params.delete("filter");
    else params.set("filter", key);
    const s = params.toString();
    router.push(s ? `/work-orders?${s}` : "/work-orders");
  }

  if (q.isPending) {
    return (
      <div className="animate-pulse space-y-4 px-3.5 pt-4">
        <div className="h-11 rounded-2xl bg-white" />
        <div className="h-28 rounded-2xl bg-white" />
      </div>
    );
  }
  if (q.isError) {
    return (
      <div className="mx-3.5 mt-4 rounded-2xl border border-[#e8edf4] bg-white p-6 text-center text-[var(--xlink-red)] shadow-sm">
        列表加载失败
        <button type="button" className="mt-4 block w-full font-bold text-[var(--xlink-primary)]" onClick={() => void q.refetch()}>
          重试
        </button>
      </div>
    );
  }

  const tabs = q.data.tabs;

  return (
    <div className="px-3.5 pb-4 pt-4">
      <div className="flex gap-2">
        <div className="flex min-h-11 flex-1 items-center gap-2 rounded-2xl border border-[#e2e7ef] bg-white px-3.5">
          <span className="text-base text-[#64748b]" aria-hidden>
            ⌕
          </span>
          <input
            className="h-11 min-w-0 flex-1 bg-transparent text-sm text-[#101827] outline-none placeholder:text-[#94a3b8]"
            placeholder="搜索任务、客户、地址"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="flex h-11 w-[4.25rem] shrink-0 items-center justify-center rounded-2xl bg-[#1478ff] text-sm font-black text-white"
          onClick={() => {
            if (!keyword.trim()) window.alert("请输入关键词");
            else window.alert("已搜索");
          }}
        >
          搜索
        </button>
        <button
          type="button"
          className="flex h-11 w-20 shrink-0 items-center justify-center gap-1 rounded-2xl border border-[#dce5f0] bg-white text-sm font-black text-[#1f2937]"
          onClick={() => window.alert("筛选条件演示中")}
        >
          <span>▤</span>
          筛选
        </button>
      </div>

      <div className="mt-4 -mx-1 overflow-x-auto border-b border-[#e6edf6] pb-0">
        <div className="flex min-w-max justify-between gap-1 px-1">
          {tabs.map((t) => {
            const active = t.key === activeTab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key as FilterTabKey)}
                className={`relative flex shrink-0 items-center justify-center gap-1 px-2 py-2 text-sm font-extrabold ${
                  active ? "text-[#1478ff]" : "text-[#64748b]"
                }`}
              >
                <span>{t.label}</span>
                <span className="tabular-nums">{t.count}</span>
                {active ? (
                  <span className="absolute bottom-0 left-2 right-2 h-1 rounded-full bg-[#1478ff]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-4">
        {visible.length === 0 ? (
          <li className="rounded-[14px] border border-[#e8edf4] bg-white p-6 text-center shadow-[0_12px_28px_rgba(22,40,72,0.06)]">
            <p className="text-sm font-black text-[#18253d]">暂无匹配任务</p>
            <p className="mt-2 text-[13px] leading-snug text-[#7a879b]">换个筛选条件，或者清空搜索再试一次</p>
          </li>
        ) : (
          visible.map((w) => <TaskCard key={w.id} order={w} />)
        )}
      </ul>
    </div>
  );
}

function TaskCard({ order }: { order: WorkOrder }) {
  const part = displayPart(order);
  const no = displayOrderNo(order);
  const stripe = taskCardStripeClass(order.tone);
  const iconBg = taskIconWrapClass(order.tone);
  const phoneC = phoneButtonTextClass(order.tone);

  return (
    <li className="relative">
      <Link
        href={`/work-orders/${order.id}`}
        className="relative flex gap-2.5 overflow-hidden rounded-[14px] border border-[#e8edf4] bg-white py-3.5 pl-2 pr-[3.75rem] shadow-[0_12px_28px_rgba(22,40,72,0.06)] transition active:scale-[0.99]"
      >
        <span className={`absolute bottom-0 left-0 top-0 w-1 shrink-0 ${stripe}`} aria-hidden />
        <div className={`ml-1 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl text-base text-white ${iconBg}`}>
          {order.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-base font-black text-[#121a2a]">{order.taskType}</span>
              <span className="shrink-0 rounded-md bg-[#f3f5f7] px-1.5 py-0.5 text-xs font-black text-[#1f2933]">
                {part}
              </span>
            </div>
            <span className="shrink-0 text-sm font-extrabold text-[#64748b]">#{no}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-snug text-[#64748b]">
            <span aria-hidden>📍 </span>
            {order.address}
          </p>
          {order.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {order.tags.slice(0, 2).map((t) => (
                <span
                  key={t.text}
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${listTagClass(t.tone)}`}
                >
                  {t.text}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="truncate text-base font-black text-[#101827]">{order.customer}</span>
            <span className="shrink-0 text-[11px] text-[#64748b]">
              工单附近客户 {order.nearbyCustomers ?? 2}
            </span>
          </div>
          <p className="mt-1 text-right text-[11px] text-[#64748b]">🚗 {order.distance}</p>
        </div>
      </Link>
      <button
        type="button"
        className={`absolute right-3 top-1/2 z-10 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5eaf1] bg-white text-xl font-black shadow-sm ${phoneC}`}
        onClick={() => window.alert(`联系 ${order.customer}`)}
        aria-label={`联系${order.customer}`}
      >
        ☎
      </button>
    </li>
  );
}
