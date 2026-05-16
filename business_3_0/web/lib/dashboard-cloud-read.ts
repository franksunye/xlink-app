import type {
  Dashboard,
  DashboardEntry,
  HomeTask,
  QuickAction,
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

function shortenAddress(address: string, max = 18): string {
  const t = address.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

function visitTaskFromPrimary(primary: Dashboard["primaryTask"]): HomeTask | null {
  if (!primary.id?.trim()) return null;
  const timeMatch = primary.appointment.match(/(\d{1,2}:\d{2})/);
  const hasTime = Boolean(timeMatch?.[1]);
  return {
    key: "visit",
    title: hasTime ? `${timeMatch![1]} 上门服务` : primary.appointment || "上门服务",
    valueText: hasTime ? timeMatch![1] : undefined,
    labelText: hasTime ? "上门服务" : undefined,
    subtitle: `${primary.customer} | ${shortenAddress(primary.address)}`,
    iconName: "appointment",
    tone: "orange",
    orderId: primary.id,
  };
}

export function mapTabTotalsToHomeTasks(
  tabs: { key: string; label: string; count: number }[],
  primary?: Dashboard["primaryTask"] | null
): HomeTask[] {
  const tasks: HomeTask[] = [];
  if (primary) {
    const visit = visitTaskFromPrimary(primary);
    if (visit) tasks.push(visit);
  }

  const contact = tabs.find((t) => t.key === "need_contact");
  const following = tabs.find((t) => t.key === "following");
  const onsite = tabs.find((t) => t.key === "onsite");
  const toAccept = tabs.find((t) => t.key === "to_accept");

  if (contact && contact.count > 0) {
    tasks.push({
      key: "appointment",
      title: "联系客户预约",
      iconName: "phone",
      tone: "green",
      count: contact.count,
      filter: "need_contact",
    });
  }
  if (following && following.count > 0) {
    tasks.push({
      key: "sign",
      title: "跟进方案",
      iconName: "proposal",
      tone: "orange",
      count: following.count,
      filter: "following",
    });
  }
  if (onsite && onsite.count > 0 && !tasks.some((t) => t.filter === "onsite")) {
    tasks.push({
      key: "onsite",
      title: "待上门任务",
      iconName: "appointment",
      tone: "blue",
      count: onsite.count,
      filter: "onsite",
    });
  }
  if (toAccept && toAccept.count > 0) {
    tasks.push({
      key: "accept",
      title: "待接单",
      iconName: "phone",
      tone: "purple",
      count: toAccept.count,
      filter: "to_accept",
    });
  }
  return tasks;
}

export function buildCloudQuickActions(): QuickAction[] {
  return [
    {
      label: "待接单",
      iconName: "orderAdd",
      icon: "▦",
      tone: "green",
      desc: "查看待接单列表",
      route: "tasks",
      filter: "to_accept",
    },
    {
      label: "待联系",
      iconName: "phone",
      icon: "☎",
      tone: "blue",
      desc: "查看待联系客户",
      route: "tasks",
      filter: "need_contact",
    },
    {
      label: "待上门",
      iconName: "appointment",
      icon: "◷",
      tone: "orange",
      desc: "查看待上门任务",
      route: "tasks",
      filter: "onsite",
    },
    {
      label: "全部任务",
      iconName: "customer",
      icon: "≡",
      tone: "purple",
      desc: "查看全部工单",
      route: "tasks",
      filter: "all",
    },
  ];
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
  const byFilter = Object.fromEntries(entries.map((e) => [e.filter, e.value]));
  const onsiteCount = (byFilter.onsite as number) ?? 0;
  const taskOverview = mapTabTotalsToTaskOverview(tabs);

  let primaryTask: Dashboard["primaryTask"] | null = null;
  for (const filter of ["onsite", "need_contact", "to_accept"] as const) {
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

  const homeTasks = mapTabTotalsToHomeTasks(tabs, primaryTask);

  const today = new Date();
  const date = today.toISOString().slice(0, 10);

  return {
    date,
    company: profile?.companyName || mockDashboard.company,
    channel: profile?.roleName || "服务商",
    greeting: greetingForProfile(profile),
    statusText: total > 0 ? `${total} 项待处理` : "暂无待办",
    role: profile?.roleName || "服务商",
    dateText:
      total > 0
        ? `待上门 ${onsiteCount} 单 · 待联系 ${(byFilter.need_contact as number) ?? 0} 单`
        : "暂无待办任务，可稍后再来查看",
    total,
    done: 0,
    progress: 0,
    metrics: buildMetricsFromEntries(entries),
    entries,
    primaryTask: primaryTask ?? {
      id: "",
      customer: "—",
      title: "—",
      appointment: "待定",
      address: "—",
      distance: "",
    },
    homeTasks,
    taskOverview,
    quickActions: buildCloudQuickActions(),
    todayResult: { amount: String(total), orders: onsiteCount },
    todayResultStyle: "work_orders",
  };
}
