/**
 * Mock payloads aligned with archive concept `services/api/mock.js` shapes
 * (see xlink-app branch archive/business-3-0-wip).
 */

export type DashboardEntry = {
  icon: string;
  value: number;
  label: string;
  filter: string;
};

export type HomeTask = {
  key: string;
  title: string;
  valueText?: string;
  labelText?: string;
  subtitle?: string;
  iconName?: string;
  tone?: string;
  orderId?: string;
  count?: number;
  filter?: string;
};

export type TaskOverview = {
  label: string;
  value: number;
  delta: string;
  deltaTone: string;
  icon: string;
  tone: string;
  filter: string;
};

export type QuickAction = {
  label: string;
  iconName: string;
  tone: string;
  desc: string;
  toast?: string;
  route?: string;
  filter?: string;
};

export type Dashboard = {
  date: string;
  company: string;
  channel: string;
  greeting: string;
  statusText: string;
  role: string;
  dateText: string;
  total: number;
  done: number;
  progress: number;
  metrics: { label: string; value: number }[];
  entries: DashboardEntry[];
  primaryTask: {
    id: string;
    customer: string;
    title: string;
    appointment: string;
    address: string;
    distance: string;
  };
  homeTasks: HomeTask[];
  taskOverview: TaskOverview[];
  quickActions: QuickAction[];
  /** 与概念版工作台「今日结果」一致 */
  todayResult: { amount: string; orders: number };
};

export type FollowRecord = {
  id: string;
  title: string;
  content: string;
  owner: string;
  time: string;
  icon: string;
  tone: string;
  badge: string;
  photos?: string[];
};

export type WorkOrder = {
  id: string;
  /** 概念版「部位」chip，默认屋顶 */
  part?: string;
  customerNo?: string;
  taskType: string;
  title: string;
  customer: string;
  project: string;
  status: string;
  statusText: string;
  priority: string;
  assignee: string;
  appointment: string;
  timeText: string;
  address: string;
  distance: string;
  group: string;
  icon: string;
  tone: string;
  tags: { text: string; tone: string }[];
  context: {
    title: string;
    desc: string;
    badge: string;
    primary: string;
    secondary: string;
    tone: string;
    contextIcon: string;
    contextTitle: string;
    contextDesc: string;
  };
  followRecords: FollowRecord[];
  timeline: string[];
};

export type Project = {
  id: string;
  name: string;
  stage: string;
  owner: string;
  progress: number;
  risk: string;
};

export const mockDashboard: Dashboard = {
  date: "2026-05-15",
  company: "修链科技",
  channel: "服务商",
  greeting: "上午好，张工",
  statusText: "服务中",
  role: "服务商",
  dateText: "今天是高效工作的一天，继续加油！",
  total: 12,
  done: 3,
  progress: 25,
  metrics: [
    { label: "待处理任务", value: 8 },
    { label: "今日上门", value: 3 },
    { label: "跟进中", value: 12 },
    { label: "待完成", value: 2 },
  ],
  entries: [
    { icon: "▦", value: 8, label: "待接单", filter: "to_accept" },
    { icon: "☎", value: 3, label: "待联系", filter: "need_contact" },
    { icon: "◷", value: 12, label: "待上门", filter: "onsite" },
    { icon: "✓", value: 2, label: "待跟进", filter: "following" },
  ],
  primaryTask: {
    id: "WO-3001",
    customer: "李女士",
    title: "防水维修",
    appointment: "今天 14:00",
    address: "日坛北路17号，朝阳区",
    distance: "2.3 km",
  },
  homeTasks: [
    {
      key: "visit",
      title: "10:30 上门服务",
      valueText: "10:30",
      labelText: "上门服务",
      subtitle: "王先生 | 中央公园店",
      iconName: "appointment",
      tone: "blue",
      orderId: "WO-3001",
    },
    {
      key: "appointment",
      title: "联系客户预约",
      iconName: "phone",
      tone: "green",
      count: 3,
      filter: "need_contact",
    },
    {
      key: "sign",
      title: "跟进方案",
      iconName: "proposal",
      tone: "orange",
      count: 2,
      filter: "following",
    },
  ],
  taskOverview: [
    {
      label: "待上门",
      value: 16,
      delta: "+5",
      deltaTone: "up",
      icon: "✓",
      tone: "blue",
      filter: "onsite",
    },
    {
      label: "待接单",
      value: 3,
      delta: "+1",
      deltaTone: "up",
      icon: "▤",
      tone: "green",
      filter: "to_accept",
    },
    {
      label: "待确认方案",
      value: 2,
      delta: "-1",
      deltaTone: "down",
      icon: "★",
      tone: "orange",
      filter: "following",
    },
    {
      label: "待联系",
      value: 0,
      delta: "+0",
      deltaTone: "flat",
      icon: "●",
      tone: "purple",
      filter: "need_contact",
    },
  ],
  quickActions: [
    {
      label: "客户",
      iconName: "customer",
      tone: "blue",
      desc: "客户管理",
      toast: "客户模块演示中",
    },
    {
      label: "新建工单",
      iconName: "orderAdd",
      tone: "green",
      desc: "创建服务需求",
      route: "tasks",
      filter: "to_accept",
    },
    {
      label: "新建签约",
      iconName: "proposal",
      tone: "orange",
      desc: "创建报价方案",
      toast: "新建方案演示中",
    },
    {
      label: "回款登记",
      iconName: "wallet",
      tone: "purple",
      desc: "记录回款信息",
      route: "feedback",
    },
  ],
  todayResult: { amount: "135,450", orders: 8 },
};

export const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-3001",
    part: "屋顶",
    customerNo: "C10003001",
    taskType: "联系客户",
    title: "装修防水咨询",
    customer: "王先生",
    project: "中央公园店",
    status: "todo",
    statusText: "紧急",
    priority: "高",
    assignee: "张工",
    appointment: "今天 10:00 前",
    timeText: "今天 10:00 前",
    address: "北京市朝阳区日坛东一路 6 号院 2 号楼 1203 室",
    distance: "2.1 km",
    group: "need_contact",
    icon: "☎",
    tone: "red",
    tags: [
      { text: "2天未联系", tone: "red" },
      { text: "高意向客户", tone: "blue" },
    ],
    context: {
      title: "需要联系客户",
      desc: "请尽快与客户沟通需求，确认上门意向",
      badge: "未预约",
      primary: "联系客户",
      secondary: "新增预约时间",
      tone: "blue",
      contextIcon: "▣",
      contextTitle: "暂无预约时间",
      contextDesc: "请与客户沟通上门时间，完成首次预约",
    },
    followRecords: [
      {
        id: "R-1001",
        title: "电话联系",
        content:
          "与客户首次电话沟通，了解需求，客户表示方便明天上午联系确认上门时间。",
        owner: "张工",
        time: "2026-04-13 10:30",
        icon: "☎",
        tone: "blue",
        badge: "电话",
      },
      {
        id: "R-1002",
        title: "任务创建",
        content: "系统生成任务，等待管家联系客户。",
        owner: "系统",
        time: "2026-04-12 09:00",
        icon: "▦",
        tone: "gray",
        badge: "系统",
      },
    ],
    timeline: ["待联系客户", "待预约上门", "待现场勘察"],
  },
  {
    id: "WO-3002",
    part: "屋面",
    customerNo: "C10003002",
    taskType: "待上门",
    title: "屋面渗漏检修",
    customer: "赵女士",
    project: "望京 SOHO",
    status: "doing",
    statusText: "进行中",
    priority: "中",
    assignee: "张工",
    appointment: "今天 15:30",
    timeText: "今天 15:30",
    address: "北京市朝阳区阜通东大街望京 SOHO T3",
    distance: "4.2 km",
    group: "onsite",
    icon: "◷",
    tone: "blue",
    tags: [{ text: "材料已到场", tone: "green" }],
    context: {
      title: "上门施工中",
      desc: "按预约时间上门，完成渗漏点检查与拍照记录。",
      badge: "已预约",
      primary: "开始服务",
      secondary: "改约",
      tone: "green",
      contextIcon: "▧",
      contextTitle: "预约已确认",
      contextDesc: "客户已确认今日 15:30 上门",
    },
    followRecords: [],
    timeline: ["已预约", "待上门", "待完工确认"],
  },
];

export const mockProjects: Project[] = [
  {
    id: "PRJ-A12",
    name: "佛山禅城 A12",
    stage: "维修跟进",
    owner: "陈工",
    progress: 68,
    risk: "2 个待确认事项",
  },
  {
    id: "PRJ-B08",
    name: "广州番禺 B08",
    stage: "施工排期",
    owner: "黄工",
    progress: 42,
    risk: "材料到场变更",
  },
  {
    id: "PRJ-C21",
    name: "深圳南山 C21",
    stage: "验收归档",
    owner: "梁工",
    progress: 91,
    risk: "资料待归档",
  },
];

export function filterWorkOrders(
  list: WorkOrder[],
  filter: string | null
): WorkOrder[] {
  if (!filter) return list;
  return list.filter((w) => w.group === filter);
}

export function getWorkOrderById(id: string): WorkOrder | undefined {
  return mockWorkOrders.find((w) => w.id === id);
}

export const mockUser = {
  userId: "user-mock-1",
  displayName: "张工",
  role: "服务商",
};
