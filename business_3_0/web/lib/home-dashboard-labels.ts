import type { Dashboard } from "@/lib/mock-data";

export function todayResultColumnLabels(d: Dashboard): {
  left: string;
  right: string;
} {
  if (d.todayResultStyle === "work_orders") {
    return { left: "待办合计（单）", right: "待上门（单）" };
  }
  return { left: "签单额（元）", right: "签单数（单）" };
}

export function todayResultSectionTitle(d: Dashboard): string {
  return d.todayResultStyle === "work_orders" ? "任务概览" : "今日结果";
}

export function metricsSectionTitle(d: Dashboard): string {
  return d.todayResultStyle === "work_orders" ? "任务分布" : "今日关键数据";
}
