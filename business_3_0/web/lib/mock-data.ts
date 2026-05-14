/**
 * Mock payloads aligned with archive concept `services/api/mock.js` shapes
 * (see xlink-app branch archive/business-3-0-wip).
 * Domain vocabulary & field semantics: ../docs/12-domain-glossary.md
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
  /** 方案 B（数据概览）紧凑快捷行展示用，与概念版 `action.icon` 一致 */
  icon: string;
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

/** 单次上门服务预约（工单可挂多段上门 / FSM 子实体占位） */
export type ServiceAppointment = {
  id: string;
  /** 与后端 FSM 对齐的粗粒度状态码，Mock 阶段为可读字符串即可 */
  status: string;
  /** 对外展示的时间窗文案（与历史 `appointment` / `timeText` 一致） */
  windowText: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  /** 与工单默认地址不同时填写 */
  address?: string;
  assignee: string;
  /** 同一工单内排序，数值小靠前 */
  sequence?: number;
  /** 列表卡片与摘要字段以本条为准（唯一主预约） */
  isPrimary?: boolean;
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
  /** 概念版列表「工单附近客户」计数 */
  nearbyCustomers?: number;
  customerInfo?: { label: string; value: string }[];
  orderInfoTitle?: string;
  orderInfo?: { label: string; value: string }[] | null;
  materials?: { title: string; desc: string; tone: string }[];
  /** 服务预约列表（BFF/Mock 真源之一）；缺省时仍可仅用顶层 appointment/timeText。v0.1 详情页可不展示独立区块。 */
  appointments?: ServiceAppointment[];
};

/** 主预约：显式 `isPrimary` 优先，否则取 `sequence` 最小的一条 */
export function primaryAppointment(w: WorkOrder): ServiceAppointment | undefined {
  const list = w.appointments;
  if (!list?.length) return undefined;
  const explicit = list.find((a) => a.isPrimary);
  if (explicit) return explicit;
  return [...list].sort((a, b) => (a.sequence ?? 999) - (b.sequence ?? 999))[0];
}

/** 从主预约同步顶层 `appointment` / `timeText` / `assignee` / `address`，避免双真源漂移 */
function syncWorkOrderFromPrimary(w: WorkOrder): WorkOrder {
  const p = primaryAppointment(w);
  if (!p) return w;
  return {
    ...w,
    appointment: p.windowText,
    timeText: p.windowText,
    assignee: p.assignee,
    address: p.address ?? w.address,
  };
}

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
    id: "WO-3002",
    customer: "李女士",
    title: "防水维修",
    appointment: "今天 14:30",
    address: "北京市朝阳区日坛北路 17 号日坛国际公寓 B 座 806 室",
    distance: "2.3 km",
  },
  homeTasks: [
    {
      key: "visit",
      title: "14:30 上门服务",
      valueText: "14:30",
      labelText: "上门服务",
      subtitle: "李女士 | 日坛北路门店",
      iconName: "appointment",
      tone: "orange",
      orderId: "WO-3002",
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
      icon: "👤",
      tone: "blue",
      desc: "客户管理",
      toast: "客户模块演示中",
    },
    {
      label: "新建工单",
      iconName: "orderAdd",
      icon: "＋",
      tone: "green",
      desc: "创建服务需求",
      route: "tasks",
      filter: "to_accept",
    },
    {
      label: "新建签约",
      iconName: "proposal",
      icon: "📋",
      tone: "orange",
      desc: "创建报价方案",
      toast: "新建方案演示中",
    },
    {
      label: "回款登记",
      iconName: "wallet",
      icon: "￥",
      tone: "purple",
      desc: "记录回款信息",
      route: "feedback",
    },
  ],
  todayResult: { amount: "135,450", orders: 8 },
};

const mockWorkOrdersSeed: WorkOrder[] = [
  {
    id: "WO-3001",
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
    address: "北京市朝阳区日坛东一路 6 号院 2 号楼 1203 室，近朝阳门外大街",
    distance: "2.1 km",
    part: "屋顶",
    nearbyCustomers: 8,
    group: "need_contact",
    icon: "☎",
    tone: "red",
    tags: [
      { text: "2天未联系", tone: "red" },
      { text: "高意向客户", tone: "blue" },
    ],
    customerNo: "C-20260409077",
    customerInfo: [
      { label: "客户姓名", value: "王先生" },
      { label: "客户来源", value: "官网咨询" },
      {
        label: "服务地址",
        value: "北京市朝阳区日坛东一路 6 号院 2 号楼 1203 室，近朝阳门外大街",
      },
      { label: "客户编号", value: "C-20260409077" },
    ],
    orderInfo: null,
    materials: [],
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
        content: "创建任务：需要联系客户。",
        owner: "系统",
        time: "2026-04-13 09:15",
        icon: "♟",
        tone: "blue",
        badge: "系统",
      },
    ],
    appointments: [
      {
        id: "SA-3001-1",
        status: "pending_contact",
        windowText: "今天 10:00 前",
        assignee: "张工",
        sequence: 1,
        isPrimary: true,
      },
    ],
  },
  {
    id: "WO-3002",
    taskType: "上门服务",
    title: "防水维修",
    customer: "李女士",
    project: "日坛北路门店",
    status: "doing",
    statusText: "重要",
    priority: "高",
    assignee: "陈工",
    appointment: "今天 14:30",
    timeText: "今天 14:30",
    address: "北京市朝阳区日坛北路 17 号日坛国际公寓 B 座 806 室",
    distance: "2.3 km",
    part: "窗户",
    nearbyCustomers: 12,
    group: "onsite",
    icon: "♟",
    tone: "orange",
    tags: [
      { text: "预约上门", tone: "blue" },
      { text: "老客户", tone: "green" },
    ],
    customerNo: "C-20260412031",
    customerInfo: [
      { label: "客户姓名", value: "李女士" },
      { label: "客户标签", value: "老客户、已预约" },
      {
        label: "服务地址",
        value: "北京市朝阳区日坛北路 17 号日坛国际公寓 B 座 806 室",
      },
      { label: "客户编号", value: "C-20260412031" },
    ],
    orderInfo: null,
    materials: [
      {
        title: "客户渗漏照片",
        desc: "窗框下沿渗水，客户已上传 3 张照片",
        tone: "orange",
      },
      {
        title: "预约记录",
        desc: "上门时间：今天 14:30，服务人员：陈工",
        tone: "green",
      },
    ],
    context: {
      title: "已预约，待上门",
      desc: "请按照预约时间上门服务",
      badge: "已预约",
      primary: "确认已上门",
      secondary: "修改预约时间",
      tone: "green",
      contextIcon: "▣",
      contextTitle: "已预约时间",
      contextDesc: "2026-04-14（周二）14:00-16:00",
    },
    followRecords: [
      {
        id: "R-2001",
        title: "预约已确认",
        content: "已预约上门服务时间：明天 14:00-16:00。",
        owner: "张工",
        time: "2026-04-13 11:20",
        icon: "▣",
        tone: "green",
        badge: "预约",
      },
      {
        id: "R-2002",
        title: "电话沟通",
        content: "与客户确认上门时间，客户同意明天下午上门。",
        owner: "张工",
        time: "2026-04-13 11:15",
        icon: "☎",
        tone: "blue",
        badge: "电话",
      },
      {
        id: "R-2003",
        title: "电话联系",
        content: "与客户首次电话沟通，了解需求，客户表示方便明天下午。",
        owner: "张工",
        time: "2026-04-13 10:30",
        icon: "☎",
        tone: "blue",
        badge: "电话",
      },
    ],
    appointments: [
      {
        id: "SA-3002-1",
        status: "completed",
        windowText: "4月12日 14:00-16:00（初勘）",
        assignee: "张工",
        scheduledStart: "2026-04-12T14:00:00+08:00",
        scheduledEnd: "2026-04-12T16:00:00+08:00",
        sequence: 1,
        isPrimary: false,
      },
      {
        id: "SA-3002-2",
        status: "scheduled",
        windowText: "今天 14:30",
        assignee: "陈工",
        sequence: 2,
        isPrimary: true,
      },
    ],
  },
  {
    id: "WO-3003",
    taskType: "跟进方案",
    title: "厨房防水 + 阳台防水",
    customer: "张先生",
    project: "东三环中路",
    status: "doing",
    statusText: "跟进中",
    priority: "中",
    assignee: "张工",
    appointment: "明天 11:00",
    timeText: "明天 11:00",
    address: "北京市朝阳区东三环中路 39 号建外 SOHO 西区 12 号楼 1608 室",
    distance: "5.6 km",
    part: "厨房",
    nearbyCustomers: 5,
    group: "following",
    icon: "▣",
    tone: "purple",
    tags: [
      { text: "已报价", tone: "blue" },
      { text: "3天未跟进", tone: "orange" },
    ],
    customerNo: "C-20260414052",
    customerInfo: [
      { label: "客户姓名", value: "张先生" },
      { label: "客户标签", value: "已勘察、待确认方案" },
      {
        label: "服务地址",
        value: "北京市朝阳区东三环中路 39 号建外 SOHO 西区 12 号楼 1608 室",
      },
      { label: "客户编号", value: "C-20260414052" },
    ],
    orderInfoTitle: "方案报价",
    orderInfo: [
      { label: "方案编号", value: "PLAN-14052-V2" },
      { label: "施工范围", value: "厨房防水 + 阳台防水" },
      { label: "报价金额", value: "￥9,960" },
      { label: "方案状态", value: "客户确认中" },
    ],
    materials: [
      { title: "现场勘察照片", desc: "厨房、阳台、墙根共 6 张", tone: "purple" },
      {
        title: "勘察记录",
        desc: "已记录渗漏点、基层状态和建议工法",
        tone: "purple",
      },
      { title: "报价方案 V2", desc: "已生成待客户确认", tone: "orange" },
    ],
    context: {
      title: "方案确认",
      desc: "请与客户确认方案和报价",
      badge: "方案确认中",
      primary: "查看方案",
      secondary: "发送报价",
      tone: "orange",
      contextIcon: "▤",
      contextTitle: "方案与报价",
      contextDesc: "合同金额：￥9,960；方案版本：V2（厨房防水 + 阳台防水）",
    },
    followRecords: [
      {
        id: "R-3001",
        title: "已上门",
        content: "服务人员已上门。",
        owner: "张工",
        time: "2026-04-14 14:05",
        icon: "♟",
        tone: "orange",
        badge: "上门",
      },
      {
        id: "R-3002",
        title: "现场照片",
        content: "上传了 6 张现场照片。",
        owner: "张工",
        time: "2026-04-14 14:10",
        icon: "▧",
        tone: "blue",
        badge: "照片",
        photos: ["厨", "阳", "墙"],
      },
      {
        id: "R-3003",
        title: "勘察记录",
        content: "已完成勘察记录。",
        owner: "张工",
        time: "2026-04-14 14:20",
        icon: "▣",
        tone: "purple",
        badge: "记录",
      },
    ],
    appointments: [
      {
        id: "SA-3003-1",
        status: "scheduled",
        windowText: "明天 11:00",
        assignee: "张工",
        sequence: 1,
        isPrimary: true,
      },
    ],
  },
  {
    id: "WO-3004",
    taskType: "跟进签约",
    title: "卫生间防水",
    customer: "陈先生",
    project: "望京南路",
    status: "todo",
    statusText: "待处理",
    priority: "高",
    assignee: "张工",
    appointment: "今天 16:00 前",
    timeText: "今天 16:00 前",
    address: "北京市朝阳区望京南路 9 号望京新城三区 312 楼 2 单元 1501",
    distance: "8.2 km",
    part: "洗手间",
    nearbyCustomers: 3,
    group: "following",
    icon: "▤",
    tone: "green",
    tags: [],
    customerNo: "C-20260416018",
    customerInfo: [
      { label: "客户姓名", value: "陈先生" },
      { label: "客户标签", value: "已确认方案、待签约" },
      {
        label: "服务地址",
        value: "北京市朝阳区望京南路 9 号望京新城三区 312 楼 2 单元 1501",
      },
      { label: "客户编号", value: "C-20260416018" },
    ],
    orderInfoTitle: "订单信息",
    orderInfo: [
      { label: "订单状态", value: "待提交" },
      { label: "施工范围", value: "卫生间防水维修" },
      { label: "订单金额", value: "￥6,800" },
      { label: "建议提交", value: "今天 16:00 前" },
    ],
    materials: [
      { title: "确认报价单", desc: "客户已确认报价和施工范围", tone: "green" },
      {
        title: "现场勘察照片",
        desc: "卫生间地面、墙角、管根共 8 张",
        tone: "green",
      },
      {
        title: "施工方案",
        desc: "闭水试验与防水维修工艺说明",
        tone: "purple",
      },
    ],
    context: {
      title: "跟进签约",
      desc: "客户已确认方案，请尽快推进签约",
      badge: "待签约",
      primary: "跟进签约",
      secondary: "查看报价",
      tone: "green",
      contextIcon: "▤",
      contextTitle: "报价已确认",
      contextDesc: "订单金额：￥6,800；施工范围：卫生间防水维修",
    },
    followRecords: [
      {
        id: "R-4001",
        title: "报价确认",
        content: "客户确认卫生间防水维修方案和报价，要求今天内提交正式订单。",
        owner: "张工",
        time: "2026-04-16 15:20",
        icon: "▤",
        tone: "green",
        badge: "确认",
      },
      {
        id: "R-4002",
        title: "方案沟通",
        content: "已向客户说明闭水试验、防水层维修和质保范围。",
        owner: "张工",
        time: "2026-04-16 14:40",
        icon: "▣",
        tone: "purple",
        badge: "方案",
      },
      {
        id: "R-4003",
        title: "现场勘察",
        content: "已完成卫生间现场勘察，上传 8 张现场照片。",
        owner: "张工",
        time: "2026-04-16 14:10",
        icon: "▧",
        tone: "blue",
        badge: "勘察",
        photos: ["地面", "墙角", "管根"],
      },
    ],
    appointments: [
      {
        id: "SA-3004-1",
        status: "pending_sign",
        windowText: "今天 16:00 前",
        assignee: "张工",
        sequence: 1,
        isPrimary: true,
      },
    ],
  },
];

export const mockWorkOrders: WorkOrder[] = mockWorkOrdersSeed.map(syncWorkOrderFromPrimary);

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
