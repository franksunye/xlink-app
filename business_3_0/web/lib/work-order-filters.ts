import type { WorkOrder } from "@/lib/mock-data";

export const FILTER_TABS = [
  { key: "to_accept", label: "待接单" },
  { key: "need_contact", label: "待联系" },
  { key: "onsite", label: "待上门" },
  { key: "following", label: "待跟进" },
  { key: "all", label: "全部" },
] as const;

export type FilterTabKey = (typeof FILTER_TABS)[number]["key"];

const FILTER_TAB_KEYS = new Set<string>(FILTER_TABS.map((t) => t.key));

export function parseFilterTabKey(raw: string | null | undefined): FilterTabKey {
  if (raw && FILTER_TAB_KEYS.has(raw)) return raw as FilterTabKey;
  return "all";
}

export function matchWorkOrderFilter(order: WorkOrder, key: FilterTabKey): boolean {
  if (key === "all") return true;
  return order.group === key;
}

export function tabCountsForOrders(orders: WorkOrder[]) {
  return FILTER_TABS.map(({ key, label }) => ({
    key,
    label,
    count: orders.filter((o) => matchWorkOrderFilter(o, key)).length,
  }));
}
