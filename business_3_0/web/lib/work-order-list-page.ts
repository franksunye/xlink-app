import type { WorkOrder } from "@/lib/mock-data";

/** 与 `business/pages/serviceAppointment/serviceAppointments.vue` 的 `fpi.rows` 一致 */
export const WORK_ORDER_LIST_ROWS = 10;

export type WorkOrderListPage = {
  items: WorkOrder[];
  page: number;
  rows: number;
  total: number;
  hasMore: boolean;
};

export function parseListPageParams(
  pageRaw: string | null,
  rowsRaw: string | null
): { page: number; rows: number } {
  const page = Math.max(1, parseInt(pageRaw ?? "1", 10) || 1);
  const rows = Math.min(
    50,
    Math.max(1, parseInt(rowsRaw ?? String(WORK_ORDER_LIST_ROWS), 10) || WORK_ORDER_LIST_ROWS)
  );
  return { page, rows };
}

export function paginateWorkOrders(
  items: WorkOrder[],
  page: number,
  rows: number
): WorkOrderListPage {
  const total = items.length;
  const start = (page - 1) * rows;
  const slice = items.slice(start, start + rows);
  return {
    items: slice,
    page,
    rows,
    total,
    hasMore: start + slice.length < total,
  };
}
