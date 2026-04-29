const today = '2026-04-29';

const dashboard = {
  date: today,
  greeting: '上午好，体验官',
  summary: [
    { label: '待处理工单', value: 8, tone: 'primary' },
    { label: '今日预约', value: 12, tone: 'green' },
    { label: '风险提醒', value: 3, tone: 'amber' }
  ],
  focus: [
    { title: '漏水返修待确认', meta: '佛山禅城 A12 项目', status: 'doing' },
    { title: '材料到场时间变更', meta: '广州番禺 B08 项目', status: 'todo' },
    { title: '客户验收资料补齐', meta: '深圳南山 C21 项目', status: 'done' }
  ]
};

const workOrders = [
  {
    id: 'WO-3001',
    title: '卫生间防水返修',
    customer: '李先生',
    project: '佛山禅城 A12',
    status: 'doing',
    statusText: '处理中',
    priority: '高',
    assignee: '陈工',
    appointment: '今天 14:30',
    address: '佛山市禅城区季华五路',
    timeline: [
      '客户提交渗漏照片',
      '客服完成初筛',
      '维修师傅已确认上门时间'
    ]
  },
  {
    id: 'WO-3002',
    title: '闭水试验预约',
    customer: '王女士',
    project: '广州番禺 B08',
    status: 'todo',
    statusText: '待派单',
    priority: '中',
    assignee: '未分配',
    appointment: '明天 09:00',
    address: '广州市番禺区汉溪大道',
    timeline: [
      '项目经理发起预约',
      '等待客服确认业主时间'
    ]
  },
  {
    id: 'WO-3003',
    title: '验收资料复核',
    customer: '赵先生',
    project: '深圳南山 C21',
    status: 'done',
    statusText: '已完成',
    priority: '低',
    assignee: '梁工',
    appointment: '昨天 16:00',
    address: '深圳市南山区科技园',
    timeline: [
      '上传验收照片',
      '资料复核通过',
      '客户确认完成'
    ]
  }
];

const projects = [
  {
    id: 'PRJ-A12',
    name: '佛山禅城 A12',
    stage: '维修跟进',
    owner: '陈工',
    progress: 68,
    risk: '2 个待确认事项'
  },
  {
    id: 'PRJ-B08',
    name: '广州番禺 B08',
    stage: '施工排期',
    owner: '黄工',
    progress: 42,
    risk: '材料到场变更'
  },
  {
    id: 'PRJ-C21',
    name: '深圳南山 C21',
    stage: '验收归档',
    owner: '梁工',
    progress: 91,
    risk: '资料待归档'
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getDashboard() {
  return Promise.resolve(clone(dashboard));
}

export function getWorkOrders() {
  return Promise.resolve(clone(workOrders));
}

export function getWorkOrder(id) {
  const order = workOrders.find(function(item) {
    return item.id === id;
  }) || workOrders[0];

  return Promise.resolve(clone(order));
}

export function getProjects() {
  return Promise.resolve(clone(projects));
}

export function submitFeedback(payload) {
  const list = uni.getStorageSync('business_3_feedback') || [];
  list.unshift({
    ...payload,
    createdAt: new Date().toISOString()
  });
  uni.setStorageSync('business_3_feedback', list.slice(0, 20));
  return Promise.resolve({ ok: true });
}
