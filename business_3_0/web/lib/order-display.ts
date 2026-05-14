import type { WorkOrder } from "@/lib/mock-data";

/** 与概念版 `pages/work-orders/*.vue` 中 `getOrderNo` 一致：取客户编号或 id 中数字末 5 位。 */
export function displayOrderNo(order: Pick<WorkOrder, "id" | "customer"> & { customerNo?: string }): string {
  const source = order.customerNo ?? order.id ?? "";
  const digits = String(source).replace(/\D/g, "");
  if (digits) return digits.slice(-5);
  return String(order.id ?? "").slice(-5);
}

export function displayPart(order: Pick<WorkOrder, "title"> & { part?: string }): string {
  return order.part ?? "屋顶";
}
