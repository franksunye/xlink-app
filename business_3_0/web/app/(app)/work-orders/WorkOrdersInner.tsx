"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { WorkOrder } from "@/lib/mock-data";
import { displayOrderNo, displayPart } from "@/lib/order-display";
import {
  extractContactPhone,
  showDistanceLine,
  showNearbyCount,
  telHref,
} from "@/lib/work-order-contact";
import { fetchJson, type WorkOrdersListResponse } from "@/lib/fetch-json";
import { shouldShowWorkOrdersFullSkeleton } from "@/lib/query-display";
import {
  listTagClass,
  phoneButtonTextClass,
  taskCardStripeClass,
  taskIconWrapClass,
} from "@/lib/ui-tones";
import { WORK_ORDER_LIST_ROWS } from "@/lib/work-order-list-page";
import { parseFilterTabKey, type FilterTabKey } from "@/lib/work-order-filters";

function workOrdersKey(filter: string | null) {
  return ["/api/work-orders", filter] as const;
}

function readFilterFromLocation(): FilterTabKey {
  if (typeof window === "undefined") return "all";
  return parseFilterTabKey(new URLSearchParams(window.location.search).get("filter"));
}

function buildListUrl(filter: FilterTabKey, page: number): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("rows", String(WORK_ORDER_LIST_ROWS));
  if (filter !== "all") params.set("filter", filter);
  return `/api/work-orders?${params.toString()}`;
}

type LoadStatus = "more" | "loading" | "noMore";

function resolveLoadStatus(
  itemCount: number,
  hasNextPage: boolean,
  isFetchingNextPage: boolean
): LoadStatus | null {
  if (itemCount <= 3) return null;
  if (isFetchingNextPage) return "loading";
  if (!hasNextPage) return "noMore";
  return "more";
}

export function WorkOrdersInner() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTabKey>("all");
  const [keyword, setKeyword] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const shellMountedRef = useRef(false);
  const lastTabsRef = useRef<FilterTab[]>([]);

  useEffect(() => {
    setActiveTab(readFilterFromLocation());
  }, []);

  useEffect(() => {
    const onPopState = () => setActiveTab(readFilterFromLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const filterKey = activeTab === "all" ? null : activeTab;

  const q = useInfiniteQuery({
    queryKey: workOrdersKey(filterKey),
    queryFn: ({ pageParam }) =>
      fetchJson<WorkOrdersListResponse>(buildListUrl(activeTab, pageParam)),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    staleTime: 60_000,
  });

  const pageTabs = q.data?.pages[0]?.tabs;
  if (pageTabs?.length) lastTabsRef.current = pageTabs;
  const tabs = pageTabs?.length ? pageTabs : lastTabsRef.current;

  const allItems = useMemo(
    () => q.data?.pages.flatMap((p) => p.items) ?? [],
    [q.data?.pages]
  );

  const visible = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return allItems;
    return allItems.filter((o) => {
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
  }, [allItems, keyword]);

  function setTab(key: FilterTabKey) {
    setActiveTab(key);
    const params = new URLSearchParams(window.location.search);
    if (key === "all") params.delete("filter");
    else params.set("filter", key);
    const s = params.toString();
    router.replace(s ? `/work-orders?${s}` : "/work-orders", { scroll: false });
  }

  if (q.data !== undefined) shellMountedRef.current = true;

  const showFullSkeleton = shouldShowWorkOrdersFullSkeleton(
    shellMountedRef.current,
    q.isPending,
    q.data
  );
  const listLoading = q.isFetching && !q.isFetchingNextPage;
  const loadStatus = resolveLoadStatus(
    allItems.length,
    Boolean(q.hasNextPage),
    q.isFetchingNextPage
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !q.hasNextPage || q.isFetchingNextPage) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void q.fetchNextPage();
      },
      { rootMargin: "120px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [q.hasNextPage, q.isFetchingNextPage, q.fetchNextPage]);

  /** Prefetch page N+1 after page N settles — smoother scroll, one cloud call only. */
  useEffect(() => {
    if (!q.isSuccess || !q.hasNextPage || q.isFetching || q.isFetchingNextPage) return;
    const prefetch = () => {
      void q.fetchNextPage();
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(prefetch, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(prefetch, 400);
    return () => window.clearTimeout(t);
  }, [
    q.isSuccess,
    q.hasNextPage,
    q.isFetching,
    q.isFetchingNextPage,
    q.fetchNextPage,
    q.data?.pages.length,
  ]);

  if (showFullSkeleton) {
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

      <FilterTabBar tabs={tabs} activeTab={activeTab} onTab={setTab} />

      <div className="relative mt-5" aria-busy={listLoading || q.isFetchingNextPage}>
        <ul className="flex flex-col gap-4">
          {visible.length === 0 ? (
            <li className="rounded-[14px] border border-[#e8edf4] bg-white p-6 text-center shadow-[0_12px_28px_rgba(22,40,72,0.06)]">
              <p className="text-sm font-semibold text-[#18253d]">
                {listLoading ? "加载中…" : "暂无匹配任务"}
              </p>
              {!listLoading ? (
                <p className="mt-2 text-[13px] leading-snug text-[#7a879b]">
                  换个筛选条件，或者清空搜索再试一次
                </p>
              ) : null}
            </li>
          ) : (
            visible.map((w) => <TaskCard key={w.id} order={w} />)
          )}
        </ul>
        <div ref={loadMoreRef} className="h-1" aria-hidden />
        {loadStatus ? <ListLoadMore status={loadStatus} /> : null}
      </div>
    </div>
  );
}

type FilterTab = { key: string; label: string; count: number };

/** 对齐 business `van-tabs`：底边激活态，无自定义滑动指示条 */
function FilterTabBar({
  tabs,
  activeTab,
  onTab,
}: {
  tabs: FilterTab[];
  activeTab: FilterTabKey;
  onTab: (key: FilterTabKey) => void;
}) {
  return (
    <div className="mt-4 -mx-1 overflow-x-auto border-b border-[#e6edf6]">
      <div className="flex min-w-max justify-between gap-1 px-1">
        {tabs.map((t) => {
          const active = t.key === activeTab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onTab(t.key as FilterTabKey)}
              className={`shrink-0 border-b-2 px-2 py-2 text-sm ${
                active
                  ? "border-[var(--xlink-primary)] font-semibold text-[var(--xlink-primary)]"
                  : "border-transparent font-medium text-[var(--xlink-tab-inactive)]"
              }`}
            >
              <span>{t.label}</span>
              <span className="tabular-nums"> {t.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ListLoadMore({ status }: { status: LoadStatus }) {
  return (
    <div className="wo-load-more" role="status" aria-live="polite">
      {status === "loading" ? (
        <span className="wo-load-more-spinner" aria-hidden />
      ) : null}
      <span className="text-[13px] text-[#7a879b]">
        {status === "loading" ? "加载中…" : status === "noMore" ? "没有更多了" : "上拉加载更多"}
      </span>
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
        href={
          order.activeNodeName
            ? `/work-orders/${order.id}?node=${encodeURIComponent(order.activeNodeName)}`
            : `/work-orders/${order.id}`
        }
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
            {showNearbyCount(order.nearbyCustomers) ? (
              <span className="shrink-0 text-[11px] text-[#64748b]">
                工单附近客户 {order.nearbyCustomers}
              </span>
            ) : null}
          </div>
          {showDistanceLine(order) ? (
            <p className="mt-1 text-right text-[11px] text-[#64748b]">🚗 {order.distance}</p>
          ) : null}
        </div>
      </Link>
      {(() => {
        const phone = extractContactPhone(order);
        const cls = `absolute right-3 top-1/2 z-10 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5eaf1] bg-white text-xl font-black shadow-sm transition active:scale-95 ${phoneC}`;
        return phone ? (
          <a href={telHref(phone)} className={cls} aria-label={`联系${order.customer}`}>
            ☎
          </a>
        ) : (
          <span
            className={`${cls} cursor-not-allowed opacity-45`}
            aria-label="暂无联系电话"
            title="暂无联系电话"
          >
            ☎
          </span>
        );
      })()}
    </li>
  );
}
