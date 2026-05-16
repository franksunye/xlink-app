import type { WorkOrder } from "@/lib/mock-data";

const PLACEHOLDER_DISTANCE = "2.3 km";

export function extractContactPhone(w: WorkOrder): string | null {
  if (w.contactPhone?.trim()) return w.contactPhone.trim();
  const row = w.customerInfo?.find((r) => r.label === "联系电话");
  const v = row?.value?.trim();
  if (!v || v === "—") return null;
  return v;
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function mapsHref(address: string): string {
  const q = encodeURIComponent(address.trim());
  return `https://uri.amap.com/marker?position=&name=${q}&src=xlink-b3`;
}

export function isDemoDistance(distance: string | undefined): boolean {
  if (!distance?.trim()) return false;
  return distance.trim() === PLACEHOLDER_DISTANCE;
}

export function showDistanceLine(w: Pick<WorkOrder, "distance">): boolean {
  const d = w.distance?.trim();
  return Boolean(d) && !isDemoDistance(d);
}

export function showNearbyCount(n: number | undefined): boolean {
  return n != null && n > 0;
}

export type CtaKind = "call" | "navigate" | "tab_customer" | "tab_records" | "pending_write";

export function classifyCtaLabel(label: string): CtaKind {
  const t = label.trim();
  if (/联系/.test(t)) return "call";
  if (/导航/.test(t)) return "navigate";
  if (/客户资料|客户信息/.test(t)) return "tab_customer";
  if (/跟进|记录/.test(t)) return "tab_records";
  return "pending_write";
}
