import type {
  Dashboard,
  DashboardEntry,
  HomeTask,
  TaskOverview,
} from "@/lib/mock-data";
import type { UserProfile } from "@/lib/cloud-session";
import { mockDashboard } from "@/lib/mock-data";
import {
  cloudFetchWorkOrders,
  cloudFetchWorkOrderTabTotals,
} from "@/lib/work-order-cloud-read";
import type { FilterTabKey } from "@/lib/work-order-filters";

const ENTRY_META: Record<
  Exclude<FilterTabKey, "all">,
  { icon: string; label: string }
> = {
  to_accept: { icon: "▦", label: "待接单" },
  need_contact: { icon: "☎", label: "待联系" },
  onsite: { icon: "◷", label: "待上门" },
  following: { icon: "✓", label: "待跟进" },
};

const OVERVIEW_TONES: Record<
  Exclude<FilterTabKey, "all">,
  { icon: string; tone: string }
> = {
  onsite: { icon: "✓", tone: "blue" },
  to_accept: { icon: "▤", tone: "green" },
  need_contact: { icon: "☎", tone: "orange" },
  following: { icon: "◷", tone: "purple" },
};

function greetingForProfile(profile: UserProfile | null): string {
  const hour = new Date().getHours();
  const part =
    hour < 12 ? "上午好" : hour < 18 ? "下午好" : "晚上好";
  const name = profile?.displayName?.trim() || "管家";
  return `${part}，${name}`;
}

export function mapTabTotalsToEntries(
  tabs: { key: string; label: string; count: number }[]
): DashboardEntry[] {
  const keys: Exclude<FilterTabKey, "all">[] = [
    "to_accept",
    "need_contact",
    "onsite",
    "following",
  ];
  return keys.map((key) => {
    const tab = tabs.find((t) => t.key === key);
    const meta = ENTRY_META[key];
    return {
      icon: meta.icon,
      value: tab?.count ?? 0,
      label: meta.label,
      filter: key,
    };
  });
}

export function mapTabTotalsToTaskOverview(
  tabs: { key: string; label: string; count: number }[]
): TaskOverview[] {
  const keys: Exclude<FilterTabKey, "all">[] = [
    "onsite",
    "to_accept",
    "need_contact",
    "following",
  ];
  return keys.map((key) => {
    const tab = tabs.find((t) => t.key === key);
    const meta = ENTRY_META[key];
    const toneMeta = OVERVIEW_TONES[key];
    return {
      label: meta.label,
      value: tab?.count ?? 0,
      delta: "—",
      deltaTone: "neutral",
      icon: toneMeta.icon,
      tone: toneMeta.tone,
      filter: key,
    };
  });
}

export function mapTabTotalsToHomeTasks(
  tabs: { key: string; label: string; count: number }[]
): HomeTask[] {
  const contact = tabs.find((t) => t.key === "need_contact");
  const following = tabs.find((t) => t.key === "following");
  const tasks: HomeTask[] = [];
  if ((contact?.count ?? 0) > 0) {
    tasks.push({
      key: "appointment",
      title: "联系客户预约",
      iconName: "phone",
      tone: "green",
      count: contact?.count,
      filter: "need_contact",
    });
  }
  if ((following?.count ?? 0) > 0) {
    tasks.push({
      key: "sign",
      title: "跟进方案",
      iconName: "proposal",
      tone: "orange",
      count: following?.count,
      filter: "following",
    });
  }
  return tasks;
}

export function buildMetricsFromEntries(entries: DashboardEntry[]) {
  const byFilter = Object.fromEntries(entries.map((e) => [e.filter, e.value]));
  return [
    { label: "待处理任务", value: (byFilter.to_accept as number) ?? 0 },
    { label: "今日上门", value: (byFilter.onsite as number) ?? 0 },
    { label: "跟进中", value: (byFilter.following as number) ?? 0 },
    { label: "待联系", value: (byFilter.need_contact as number) ?? 0 },
  ];
}

export async function cloudFetchDashboard(
  cookieHeader: string | null,
  jsessionId: string | null,
  profile: UserProfile | null,
  cloudToken?: string | null
): Promise<Dashboard | null> {
  const tabs = await cloudFetchWorkOrderTabTotals(
    cookieHeader,
    cloudToken ?? null,
    jsessionId
  );
  if (!tabs) return null;

  const entries = mapTabTotalsToEntries(tabs);
  const total = entries.reduce((sum, e) => sum + e.value, 0);
  const taskOverview = mapTabTotalsToTaskOverview(tabs);
  const homeTasks = mapTabTotalsToHomeTasks(tabs);

  let primaryTask = mockDashboard.primaryTask;
  for (const filter of ["need_contact", "onsite"] as const) {
    const list = await cloudFetchWorkOrders(
      cookieHeader,
      cloudToken ?? null,
      jsessionId,
      filter
    );
    const first = list?.[0];
    if (first) {
      primaryTask = {
        id: first.id,
        customer: first.customer,
        title: first.title,
        appointment: first.appointment,
        address: first.address,
        distance: first.distance?.trim() || "—",
      };
      break;
    }
  }

  const today = new Date();
  const date = today.toISOString().slice(0, 10);

  return {
    date,
    company: profile?.displayName ? "修链科技" : mockDashboard.company,
    channel: profile?.roleName || "服务商",
    greeting: greetingForProfile(profile),
    statusText: "服务中",
    role: profile?.roleName || "服务商",
    dateText: "今天是高效工作的一天，继续加油！",
    total,
    done: 0,
    progress: total > 0 ? 0 : 0,
    metrics: buildMetricsFromEntries(entries),
    entries,
    primaryTask,
    homeTasks,
    taskOverview,
    quickActions: mockDashboard.quickActions,
    todayResult: { amount: "—", orders: 0 },
  };
}
