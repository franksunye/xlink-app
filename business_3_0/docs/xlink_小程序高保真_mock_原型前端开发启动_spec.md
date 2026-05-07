# XLink 小程序高保真 Mock 原型前端开发启动 Spec

## 1. 文档目的

本文档用于指导前端开发启动 XLink 小程序高保真动态原型开发。

本阶段目标不是构建正式生产系统，而是构建一个可以在真实手机环境中运行、可点击、可体验、可演示、可用于用户反馈收集的高保真 Mock 小程序。

前端开发应基于已有 UX 设计稿与核心 UX Spec，实现核心流程的动态交互闭环。

## 2. 项目阶段定义

### 2.1 当前阶段

当前阶段为：

> 高保真 Mock 原型开发阶段

### 2.2 阶段目标

本阶段目标包括：

1. 将已有 UX 设计稿转化为可运行的小程序页面。
2. 打通登录、首页、任务列表、任务详情的核心路径。
3. 使用 Mock 数据模拟真实任务、客户、预约和状态变化。
4. 支持核心状态流转，让试用用户可以体验完整任务处理流程。
5. 支持内部评审、客户试用、销售演示和交互迭代。

### 2.3 非目标

本阶段不包含以下内容：

1. 不接入真实后端 API。
2. 不实现真实账号体系。
3. 不实现真实权限控制。
4. 不实现真实地图导航。
5. 不实现真实电话记录采集。
6. 不实现真实消息推送。
7. 不实现真实文件上传。
8. 不实现复杂审批流。
9. 不实现生产级异常处理。
10. 不实现完整数据持久化。

## 3. 开发原则

### 3.1 体验优先

本阶段以体验验证为核心，优先保证页面观感、交互路径、状态变化和使用流畅度。

### 3.2 Mock 真实化

虽然不接后端，但 Mock 数据必须尽量接近真实业务数据，避免出现“演示假数据感”。

### 3.3 状态驱动

任务详情页、首页任务卡、列表卡片的主按钮和展示内容，必须由任务状态驱动。

### 3.4 信息减法

页面应遵循现场服务人员使用场景：字号更大、字段更少、动作更明确。

### 3.5 先闭环，后扩展

优先完成一个完整可体验闭环，再补充次要页面和边缘状态。

## 4. 技术边界

### 4.1 运行形态

目标形态：微信小程序或同等小程序形态。

如当前前端技术栈未最终确定，可先按小程序页面结构组织。

### 4.2 数据来源

所有业务数据均来自前端本地 Mock。

建议方式：

1. 本地 mock 文件。
2. 前端状态管理。
3. localStorage / 小程序 storage 模拟轻量持久化，可选。

### 4.3 后端接口

本阶段不调用真实后端接口。

可以预留 service 层，例如：

```ts
services/taskService.ts
services/authService.ts
services/appointmentService.ts
```

但 service 内部调用 Mock 数据，不发起真实网络请求。

### 4.4 数据持久化

建议最低要求：

- 页面内状态切换应立即生效。
- 从详情页返回首页或列表后，状态变化应可见。
- 刷新或重新进入小程序后是否保留变化，可根据开发成本决定。

推荐实现：

- Demo 期间使用本地状态 + storage 保存任务状态。
- 提供“重置 Mock 数据”能力，方便演示恢复初始状态。

## 5. 本期开发范围

### 5.1 必须开发页面

| 页面 | 说明 | 优先级 |
|---|---|---|
| 登录页 | 模拟登录入口 | P0 |
| 首页 | 今日任务驾驶舱 | P0 |
| 任务列表页 | 任务查看、筛选、进入详情 | P0 |
| 任务详情页 | 客户信息、动态状态区、信息 Tab、核心操作 | P0 |
| 添加/修改预约 | 可为页面、弹窗或抽屉 | P0 |
| 服务记录填写 | 可为页面、弹窗或抽屉 | P1 |

### 5.2 可选页面

| 页面 | 说明 | 优先级 |
|---|---|---|
| 消息页 | 静态展示即可 | P2 |
| 我的页 | 静态展示即可 | P2 |
| 客户详情页 | 可暂不独立开发，由任务详情承载客户信息 | P2 |

### 5.3 不开发页面

本阶段不开发：

- 后台管理页
- 数据报表页
- 管理员配置页
- 权限管理页
- 真实登录绑定页
- 复杂客户画像页

## 6. 路由结构

建议路由如下：

```text
/pages/login/index
/pages/home/index
/pages/tasks/index
/pages/task-detail/index
/pages/appointment-edit/index
/pages/service-record/index
/pages/messages/index       可选
/pages/profile/index        可选
```

### 6.1 路由说明

| 路由 | 页面 | 说明 |
|---|---|---|
| /pages/login/index | 登录页 | 模拟登录，点击登录进入首页 |
| /pages/home/index | 首页 | 展示今日任务、待处理任务和核心入口 |
| /pages/tasks/index | 任务列表页 | 展示所有任务，支持状态筛选 |
| /pages/task-detail/index | 任务详情页 | 根据 taskId 展示任务详情 |
| /pages/appointment-edit/index | 添加/修改预约 | 通过 taskId 进入，保存后更新任务状态 |
| /pages/service-record/index | 服务记录 | 通过 taskId 进入，保存后更新任务状态 |

### 6.2 页面跳转规则

```text
登录页
  点击「登录」
  → 首页

首页
  点击主任务卡
  → 任务详情页

首页
  点击任务分组入口
  → 任务列表页，并带入状态筛选

任务列表页
  点击任务卡片
  → 任务详情页

任务详情页
  点击「添加预约」
  → 添加预约页/弹窗

任务详情页
  点击「填写服务记录」
  → 服务记录页/弹窗
```

## 7. 底部导航

建议底部 Tab：

| Tab | 页面 | 是否本期必须 |
|---|---|---|
| 首页 | /pages/home/index | 是 |
| 任务 | /pages/tasks/index | 是 |
| 消息 | /pages/messages/index | 可选 |
| 我的 | /pages/profile/index | 可选 |

如果本期只做最小闭环，可仅实现：

1. 首页
2. 任务
3. 我的

其中“我的”可以为静态页面。

## 8. 核心业务对象

### 8.1 Task 任务

```ts
type TaskStatus =
  | 'new'
  | 'pending_contact'
  | 'pending_appointment'
  | 'appointed'
  | 'ready_to_depart'
  | 'in_service'
  | 'pending_complete'
  | 'completed'
  | 'cancelled'
  | 'exception';

interface Task {
  id: string;
  taskNo: string;
  status: TaskStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: string;
  title: string;
  description: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  appointmentId?: string;
  serviceRecordId?: string;
  lastContactAt?: string;
  lastContactResult?: string;
  address: string;
  distanceText?: string;
  dueAt?: string;
}
```

### 8.2 Customer 客户

```ts
interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  tags?: string[];
  customerType?: 'new' | 'existing' | 'vip';
  note?: string;
}
```

### 8.3 Appointment 预约

```ts
interface Appointment {
  id: string;
  taskId: string;
  customerId: string;
  startTime: string;
  endTime?: string;
  timeText: string;
  address: string;
  note?: string;
  status: 'active' | 'changed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

### 8.4 FollowUpRecord 跟进记录

```ts
interface FollowUpRecord {
  id: string;
  taskId: string;
  customerId: string;
  type: 'call' | 'sms' | 'visit' | 'note' | 'system';
  title: string;
  content: string;
  result?: string;
  createdAt: string;
}
```

### 8.5 ServiceRecord 服务记录

```ts
interface ServiceRecord {
  id: string;
  taskId: string;
  customerId: string;
  serviceResult: 'completed' | 'pending_follow_up' | 'failed';
  summary: string;
  photos?: string[];
  customerFeedback?: string;
  nextStep?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 9. Mock 数据要求

### 9.1 数据量

建议至少准备 12 条任务 Mock 数据。

其中必须覆盖以下状态：

| 状态 | 最少数量 |
|---|---:|
| new | 1 |
| pending_contact | 2 |
| pending_appointment | 2 |
| appointed | 2 |
| ready_to_depart | 1 |
| in_service | 1 |
| pending_complete | 1 |
| completed | 2 |
| exception | 1 |

### 9.2 数据真实性要求

Mock 数据应包含：

- 真实感客户姓名
- 真实感地址
- 不同任务类型
- 不同时间状态
- 不同优先级
- 不同跟进记录
- 至少一条异常任务
- 至少一条已完成任务

### 9.3 推荐任务类型

```text
空调安装咨询
热水器维修评估
全屋净水方案上门沟通
智能门锁安装确认
售前测量服务
客户回访
设备故障排查
安装条件确认
```

### 9.4 Mock 数据文件建议

```text
/mock/customers.ts
/mock/tasks.ts
/mock/appointments.ts
/mock/followUpRecords.ts
/mock/serviceRecords.ts
/mock/index.ts
```

## 10. 任务状态机

### 10.1 主状态流

```text
new
  ↓
pending_contact
  ↓
pending_appointment
  ↓
appointed
  ↓
ready_to_depart
  ↓
in_service
  ↓
pending_complete
  ↓
completed
```

### 10.2 异常分支

```text
pending_contact → exception
pending_appointment → exception
appointed → cancelled
in_service → exception
任意未完成状态 → cancelled
```

### 10.3 状态显示文案

| 状态值 | 中文显示 | 含义 |
|---|---|---|
| new | 新任务 | 新分配任务，尚未处理 |
| pending_contact | 待联系 | 需要联系客户 |
| pending_appointment | 待预约 | 已联系客户，但未确认预约时间 |
| appointed | 已预约 | 已确认预约时间 |
| ready_to_depart | 待出发 | 临近预约，需要出发或准备服务 |
| in_service | 服务中 | 已开始现场服务或拜访 |
| pending_complete | 待完成 | 服务记录未提交或待确认 |
| completed | 已完成 | 任务已闭环 |
| cancelled | 已取消 | 任务取消 |
| exception | 异常 | 无法联系、客户暂缓或其他异常 |

### 10.4 状态与主操作映射

| 状态 | 详情页主按钮 | 详情页次按钮 | 点击后行为 |
|---|---|---|---|
| new | 联系客户 | 稍后处理 | 模拟拨号，之后进入联系结果弹窗 |
| pending_contact | 联系客户 | 标记无法联系 | 模拟拨号，之后进入联系结果弹窗 |
| pending_appointment | 添加预约 | 继续联系 | 进入预约编辑 |
| appointed | 导航 | 修改预约 / 联系客户 | 模拟导航或进入预约编辑 |
| ready_to_depart | 导航 | 开始服务 / 联系客户 | 点击开始服务后进入 in_service |
| in_service | 填写服务记录 | 联系客户 | 进入服务记录填写 |
| pending_complete | 提交完成 | 编辑记录 | 校验后进入 completed |
| completed | 查看服务记录 | 无 | 查看服务记录 |
| cancelled | 查看记录 | 无 | 只读 |
| exception | 重新联系 | 查看记录 | 模拟重新联系 |

## 11. 核心交互流转

### 11.1 登录流程

#### 入口

登录页。

#### 操作

用户输入手机号/账号，点击登录。

#### Mock 行为

不校验真实账号密码。

默认点击登录后进入首页。

可选：

- 输入为空时提示“请输入手机号或账号”。
- 输入 `error` 时模拟登录失败。

#### 跳转

```text
/pages/login/index → /pages/home/index
```

### 11.2 首页查看任务流程

#### 首页展示内容

1. 问候语。
2. 今日任务数量。
3. 当前最重要任务卡。
4. 任务分组入口。
5. 今日完成进度。

#### 当前最重要任务规则

从未完成任务中选择行动优先级最高的一条。

排序建议：

```text
ready_to_depart
appointed 且预约时间为今天
pending_contact
pending_appointment
in_service
pending_complete
new
```

#### 首页点击行为

| 操作 | 行为 |
|---|---|
| 点击主任务卡 | 进入任务详情 |
| 点击“今日任务” | 进入任务列表，并筛选今日任务 |
| 点击“待联系” | 进入任务列表，并筛选 pending_contact/new |
| 点击“待预约” | 进入任务列表，并筛选 pending_appointment |
| 点击“进行中” | 进入任务列表，并筛选 in_service/pending_complete |

### 11.3 任务列表流程

#### 列表筛选

支持筛选：

```text
全部
今日
待联系
待预约
已预约
进行中
已完成
异常
```

#### 卡片展示字段

每张卡片展示：

1. 状态标签
2. 客户名称
3. 任务类型/标题
4. 时间信息
5. 地址或距离
6. 主操作按钮，可选

#### 列表排序

默认按行动优先级排序，不按创建时间排序。

排序建议：

1. ready_to_depart
2. appointed 今日预约
3. pending_contact
4. pending_appointment
5. in_service
6. pending_complete
7. new
8. appointed 非今日
9. exception
10. completed
11. cancelled

### 11.4 联系客户流程

#### 触发位置

- 首页任务卡
- 列表任务卡
- 任务详情动态状态区
- 客户卡片电话按钮

#### Mock 行为

点击“联系客户”后，不需要真实拨号。

建议出现一个联系结果弹窗。

弹窗选项：

```text
已接通，客户同意预约
已接通，客户暂不确定
未接通
号码无效
取消
```

#### 状态变化规则

| 用户选择 | 状态变化 | 记录 |
|---|---|---|
| 已接通，客户同意预约 | pending_appointment | 新增电话跟进记录 |
| 已接通，客户暂不确定 | pending_contact 或 exception | 新增电话跟进记录 |
| 未接通 | pending_contact | 新增未接通记录 |
| 号码无效 | exception | 新增异常记录 |
| 取消 | 不变化 | 不新增记录 |

### 11.5 添加预约流程

#### 触发条件

任务状态为：

- pending_appointment
- appointed，作为修改预约

#### 表单字段

| 字段 | 是否必填 | 说明 |
|---|---|---|
| 预约日期 | 是 | 日期选择 |
| 预约时间段 | 是 | 上午/下午/具体时间 |
| 预约地址 | 是 | 默认使用客户地址 |
| 备注 | 否 | 预约说明 |

#### 保存行为

点击保存后：

1. 创建或更新 Appointment。
2. task.appointmentId 更新。
3. task.status 更新为 appointed。
4. 新增一条系统跟进记录。
5. 返回任务详情。

#### 保存后反馈

展示 Toast：

> 预约已保存

### 11.6 修改预约流程

#### 触发条件

任务状态为 appointed 或 ready_to_depart。

#### 行为

与添加预约相同，但表单中预填原预约信息。

保存后：

1. 更新 Appointment。
2. 保持 task.status 为 appointed 或 ready_to_depart。
3. 新增一条预约变更记录。

### 11.7 开始服务流程

#### 触发条件

任务状态为：

- appointed
- ready_to_depart

#### 行为

点击“开始服务”后：

1. task.status 更新为 in_service。
2. 新增系统记录：已开始服务。
3. 当前时间记录为服务开始时间。

### 11.8 填写服务记录流程

#### 触发条件

任务状态为 in_service。

#### 表单字段

| 字段 | 是否必填 | 说明 |
|---|---|---|
| 服务结果 | 是 | 已完成/需后续跟进/未完成 |
| 服务摘要 | 是 | 文本输入 |
| 客户反馈 | 否 | 文本输入 |
| 下一步计划 | 否 | 文本输入 |
| 图片 | 否 | 本阶段可使用占位上传 |

#### 保存行为

点击保存后：

1. 创建 ServiceRecord。
2. task.serviceRecordId 更新。
3. task.status 更新为 pending_complete。
4. 返回任务详情。

#### 保存后反馈

Toast：

> 服务记录已保存

### 11.9 提交完成流程

#### 触发条件

任务状态为 pending_complete。

#### 校验规则

提交前检查：

1. 是否存在服务记录。
2. 服务摘要是否填写。
3. 服务结果是否选择。

#### 成功行为

点击提交完成后：

1. task.status 更新为 completed。
2. task.updatedAt 更新。
3. 新增系统记录：任务已完成。
4. 详情页动态区切换为已完成状态。

#### 失败行为

如果缺少必填内容，提示：

> 请先完善服务记录

## 12. 页面详细规格

## 12.1 登录页

### 页面目标

让用户进入高保真原型，并建立专业品牌感。

### 页面内容

1. Logo。
2. 产品名称。
3. 产品定位语。
4. 账号输入框。
5. 密码或验证码输入框。
6. 登录按钮。
7. 辅助说明。

### 推荐文案

产品定位语：

```text
连接客户、任务与现场服务
```

登录按钮：

```text
登录
```

辅助说明：

```text
高效处理现场任务，及时跟进客户服务
```

### 交互

| 操作 | 结果 |
|---|---|
| 点击登录 | 进入首页 |
| 输入为空点击登录 | 提示请输入账号 |
| 输入 error 点击登录 | 提示登录失败 |

## 12.2 首页

### 页面目标

首页是现场人员的“今日任务驾驶舱”。

用户打开首页后，应立即知道：

1. 今天有多少任务。
2. 当前最重要任务是什么。
3. 下一步应该做什么。

### 页面模块

#### 模块一：顶部问候区

展示：

- 用户姓名
- 今日日期
- 今日任务概览

示例：

```text
上午好，张师傅
今天有 5 个任务需要处理
```

#### 模块二：当前主任务卡

展示当前最重要任务。

字段：

- 状态标签
- 客户名称
- 任务标题
- 预约时间或最近联系时间
- 地址/距离
- 主操作按钮

#### 模块三：任务分组入口

建议入口：

- 今日任务
- 待联系
- 待预约
- 进行中

每个入口展示数量。

#### 模块四：今日进度

展示：

```text
今日已完成 2 / 5
```

可使用简单进度条，不使用复杂图表。

### 首页主任务卡按钮文案

| 状态 | 按钮文案 |
|---|---|
| new | 查看任务 |
| pending_contact | 联系客户 |
| pending_appointment | 添加预约 |
| appointed | 查看预约 |
| ready_to_depart | 导航 |
| in_service | 填写记录 |
| pending_complete | 提交完成 |
| completed | 查看记录 |

## 12.3 任务列表页

### 页面目标

帮助用户快速找到并处理任务。

### 页面模块

1. 顶部标题。
2. 搜索框。
3. 状态筛选 Tab。
4. 任务卡片列表。
5. 空状态。

### 筛选项

```text
全部 / 今日 / 待联系 / 待预约 / 已预约 / 进行中 / 已完成 / 异常
```

### 搜索范围

支持搜索：

- 客户姓名
- 手机号
- 地址关键词
- 任务标题

### 任务卡片字段

```text
[状态标签] 客户名称
任务标题
时间信息
地址/距离
[主按钮]
```

### 空状态

| 场景 | 文案 |
|---|---|
| 今日无任务 | 今日暂无任务 |
| 无待联系任务 | 暂无待联系客户 |
| 无搜索结果 | 未找到相关任务 |
| 全部完成 | 当前任务已全部完成 |

## 12.4 任务详情页

### 页面目标

任务详情页是任务处理主工作台。

用户进入详情页后，应清楚看到：

1. 客户是谁。
2. 当前任务处于什么状态。
3. 下一步应该做什么。
4. 预约、跟进、记录等信息在哪里查看。

### 页面结构

```text
顶部导航
客户核心卡片
动态任务状态区
信息 Tab
底部操作栏，可选
```

### 客户核心卡片

展示：

- 客户名称
- 手机号
- 地址
- 客户标签

操作：

- 电话
- 导航

### 动态任务状态区

这是详情页核心模块。

它根据任务状态展示不同 UI。

#### new / pending_contact

标题：

```text
待联系客户
```

说明：

```text
请先与客户确认需求和可预约时间
```

主按钮：

```text
联系客户
```

次按钮：

```text
标记无法联系
```

#### pending_appointment

标题：

```text
待添加预约时间
```

说明：

```text
已联系客户，请记录双方确认的预约时间
```

主按钮：

```text
添加预约
```

次按钮：

```text
继续联系
```

#### appointed

标题：

```text
已预约
```

展示：

- 预约时间
- 预约地址
- 预约备注

主按钮：

```text
导航
```

次按钮：

```text
修改预约
```

补充按钮，可选：

```text
开始服务
```

#### ready_to_depart

标题：

```text
即将开始
```

展示：

- 预约时间
- 地址
- 距当前时间提示

主按钮：

```text
导航
```

次按钮：

```text
开始服务
```

#### in_service

标题：

```text
服务中
```

展示：

- 开始时间
- 服务要求

主按钮：

```text
填写服务记录
```

次按钮：

```text
联系客户
```

#### pending_complete

标题：

```text
待提交完成
```

说明：

```text
请确认服务记录、客户反馈等信息已填写完整
```

主按钮：

```text
提交完成
```

次按钮：

```text
编辑记录
```

#### completed

标题：

```text
已完成
```

展示：

- 完成时间
- 服务结果
- 服务摘要

主按钮：

```text
查看服务记录
```

#### exception

标题：

```text
任务异常
```

展示：

- 异常原因
- 最近一次跟进记录

主按钮：

```text
重新联系
```

次按钮：

```text
查看记录
```

### 信息 Tab

建议 Tab：

```text
任务信息 / 预约记录 / 跟进记录
```

如空间允许，可增加：

```text
客户信息
```

### 任务信息 Tab

展示：

- 任务编号
- 任务类型
- 任务来源
- 任务描述
- 创建时间
- 优先级

### 预约记录 Tab

展示：

- 当前预约
- 历史预约
- 预约变更记录

### 跟进记录 Tab

展示：

- 电话记录
- 系统记录
- 服务记录
- 异常记录

按时间倒序排列。

## 12.5 添加/修改预约页

### 页面目标

让用户快速记录与客户确认的预约时间。

### 页面标题

新增时：

```text
添加预约
```

编辑时：

```text
修改预约
```

### 字段

1. 预约日期。
2. 预约时间段。
3. 预约地址。
4. 备注。

### 默认值

- 地址默认使用客户地址。
- 如果是修改预约，预填原预约数据。

### 操作

| 操作 | 结果 |
|---|---|
| 保存 | 更新预约，返回详情页 |
| 取消 | 返回详情页，不保存 |

## 12.6 服务记录页

### 页面目标

让用户填写现场服务或拜访结果。

### 字段

1. 服务结果。
2. 服务摘要。
3. 客户反馈。
4. 下一步计划。
5. 图片，占位即可。

### 服务结果选项

```text
已完成
需要后续跟进
未完成
```

### 操作

| 操作 | 结果 |
|---|---|
| 保存 | 生成服务记录，状态变为 pending_complete |
| 取消 | 返回详情页，不保存 |

## 13. 组件清单

建议抽象以下组件：

| 组件 | 用途 |
|---|---|
| TaskCard | 首页和列表任务卡片 |
| StatusTag | 任务状态标签 |
| CustomerCard | 详情页客户卡片 |
| DynamicTaskPanel | 详情页动态任务状态区 |
| TaskTabs | 详情页信息 Tab |
| AppointmentForm | 添加/修改预约表单 |
| ServiceRecordForm | 服务记录表单 |
| EmptyState | 空状态 |
| ContactResultModal | 联系客户结果弹窗 |
| BottomActionBar | 底部操作栏，可选 |

## 14. 组件行为说明

### 14.1 TaskCard

输入：

```ts
interface TaskCardProps {
  task: Task;
  customer: Customer;
  appointment?: Appointment;
  onClick: () => void;
  onPrimaryAction?: () => void;
}
```

行为：

- 点击卡片进入详情。
- 点击主按钮执行当前状态对应动作。
- 状态标签根据 task.status 显示。

### 14.2 DynamicTaskPanel

输入：

```ts
interface DynamicTaskPanelProps {
  task: Task;
  customer: Customer;
  appointment?: Appointment;
  serviceRecord?: ServiceRecord;
  onContact: () => void;
  onAddAppointment: () => void;
  onEditAppointment: () => void;
  onNavigate: () => void;
  onStartService: () => void;
  onEditServiceRecord: () => void;
  onSubmitComplete: () => void;
}
```

行为：

- 根据 task.status 渲染不同内容。
- 每个状态只能有一个最突出的主按钮。
- 次操作按钮弱化展示。

### 14.3 ContactResultModal

选项：

```text
已接通，客户同意预约
已接通，客户暂不确定
未接通
号码无效
取消
```

输出：

```ts
type ContactResult =
  | 'agreed_to_appointment'
  | 'not_sure'
  | 'no_answer'
  | 'invalid_number'
  | 'cancel';
```

## 15. Mock Service 设计

建议封装为 service，而不是在页面中直接修改 mock 数据。

### 15.1 authService

```ts
login(account: string, password?: string): Promise<User>
logout(): Promise<void>
getCurrentUser(): Promise<User | null>
```

### 15.2 taskService

```ts
getTasks(filter?: TaskFilter): Promise<Task[]>
getTaskById(taskId: string): Promise<TaskDetail>
updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task>
contactCustomer(taskId: string, result: ContactResult): Promise<Task>
startService(taskId: string): Promise<Task>
submitComplete(taskId: string): Promise<Task>
resetMockData(): Promise<void>
```

### 15.3 appointmentService

```ts
createAppointment(input: AppointmentInput): Promise<Appointment>
updateAppointment(appointmentId: string, input: AppointmentInput): Promise<Appointment>
getAppointmentsByTaskId(taskId: string): Promise<Appointment[]>
```

### 15.4 serviceRecordService

```ts
createServiceRecord(input: ServiceRecordInput): Promise<ServiceRecord>
updateServiceRecord(recordId: string, input: ServiceRecordInput): Promise<ServiceRecord>
getServiceRecordByTaskId(taskId: string): Promise<ServiceRecord | null>
```

## 16. 首页统计规则

首页统计全部来自 Mock 数据实时计算。

### 16.1 今日任务

满足任一条件：

1. 预约时间为今天。
2. dueAt 为今天。
3. 状态为 ready_to_depart。
4. 状态为 in_service。

### 16.2 待联系

包含状态：

```text
new
pending_contact
```

### 16.3 待预约

包含状态：

```text
pending_appointment
```

### 16.4 进行中

包含状态：

```text
ready_to_depart
in_service
pending_complete
```

### 16.5 已完成

包含状态：

```text
completed
```

## 17. 视觉实现要求

### 17.1 总体要求

实现应尽量贴近 UX 设计稿。

重点保证：

1. 字号较大。
2. 信息密度较低。
3. 主操作突出。
4. 卡片层级清晰。
5. 状态标签容易识别。
6. 页面适合现场人员快速操作。

### 17.2 字号倾向

| 元素 | 要求 |
|---|---|
| 页面标题 | 明显，强识别 |
| 客户名称 | 大字号，突出 |
| 任务标题 | 清晰可读 |
| 辅助信息 | 不抢主信息 |
| 主按钮 | 大尺寸，易点击 |

### 17.3 触控要求

所有主按钮和卡片点击区域应适合移动端触控。

建议：

- 主按钮高度不低于 44px。
- 卡片之间有足够间距。
- 避免过小图标单独作为关键操作入口。

## 18. 异常与空状态

### 18.1 网络异常

本阶段无真实网络，可不实现真实网络异常。

但可以预留一个 Mock 异常态用于体验。

### 18.2 数据为空

必须实现以下空状态：

1. 今日暂无任务。
2. 暂无待联系客户。
3. 暂无待预约任务。
4. 未找到相关任务。

### 18.3 表单校验

预约表单校验：

- 预约日期必填。
- 预约时间段必填。
- 预约地址必填。

服务记录表单校验：

- 服务结果必填。
- 服务摘要必填。

## 19. 演示数据重置

建议在“我的”页面或隐藏入口中提供：

```text
重置演示数据
```

点击后：

1. 清空本地 storage 中变更。
2. 恢复初始 Mock 数据。
3. 返回首页。
4. Toast 提示“演示数据已重置”。

该能力非常重要，方便销售演示和多轮用户试用。

## 20. 验收标准

### 20.1 总体验收

本阶段验收重点：

1. 页面视觉与 UX 设计稿基本一致。
2. 核心路径可以完整点击。
3. 状态流转符合本文档。
4. Mock 数据变化后，首页、列表、详情同步更新。
5. 在真实手机上体验流畅。

### 20.2 登录验收

- 用户点击登录后进入首页。
- 登录页有明确品牌和产品定位。
- 空输入有基础提示。

### 20.3 首页验收

- 首页展示今日任务概览。
- 首页展示当前最重要任务。
- 当前主任务卡可进入详情。
- 首页统计来自 Mock 数据。
- 任务状态变化后，首页展示同步变化。

### 20.4 列表验收

- 任务列表可展示全部任务。
- 状态筛选可用。
- 搜索可用，至少支持客户名和任务标题。
- 点击任务卡进入详情。
- 空状态可触发。

### 20.5 详情验收

- 客户卡片固定展示核心信息。
- 动态任务状态区根据任务状态变化。
- 待联系状态可模拟联系客户。
- 待预约状态可添加预约。
- 已预约状态可查看预约并修改。
- 服务中状态可填写服务记录。
- 待完成状态可提交完成。
- 已完成状态为只读结果展示。

### 20.6 Mock 状态流转验收

必须支持以下闭环：

```text
pending_contact
→ 联系客户
→ pending_appointment
→ 添加预约
→ appointed
→ 开始服务
→ in_service
→ 填写服务记录
→ pending_complete
→ 提交完成
→ completed
```

### 20.7 数据同步验收

以下场景必须同步：

1. 在详情页添加预约后，返回首页，主任务卡状态更新。
2. 在详情页提交完成后，返回列表，任务进入已完成分组。
3. 修改预约后，详情页和列表时间同步更新。
4. 重置演示数据后，所有状态恢复初始值。

## 21. 开发优先级建议

### 21.1 第一阶段：页面骨架与路由

目标：能跑起来，能跳转。

包括：

1. 登录页。
2. 首页。
3. 任务列表页。
4. 任务详情页。
5. 底部导航。
6. Mock 数据初始化。

### 21.2 第二阶段：核心状态流转

目标：动态体验成立。

包括：

1. 联系客户弹窗。
2. 添加预约。
3. 修改预约。
4. 开始服务。
5. 填写服务记录。
6. 提交完成。
7. 首页/列表/详情同步更新。

### 21.3 第三阶段：视觉打磨与演示优化

目标：可用于试用和演示。

包括：

1. 贴近 UX 设计稿。
2. 补齐空状态。
3. 补齐异常状态。
4. 增加演示数据重置。
5. 优化页面动效和反馈。
6. 修复真实手机上的交互问题。

## 22. 建议交付物

前端本阶段交付应包含：

1. 可运行小程序项目代码。
2. Mock 数据文件。
3. 状态机实现逻辑。
4. 核心页面截图。
5. 可体验二维码或预览包。
6. 简短 README，说明如何运行、如何重置 Mock 数据。

## 23. README 建议内容

```text
# XLink 小程序高保真 Mock 原型

## 项目说明
本项目为 XLink 现场服务小程序高保真 Mock 原型，不接入真实后端。

## 启动方式
...

## 核心页面
- 登录
- 首页
- 任务列表
- 任务详情
- 添加预约
- 服务记录

## Mock 数据
Mock 数据位于 /mock 目录。

## 演示数据重置
可在“我的”页面点击“重置演示数据”。

## 注意事项
当前版本仅用于体验验证，不代表最终生产实现。
```

## 24. 当前版本结论

本阶段前端开发的核心不是实现完整业务系统，而是实现一个“足够真实、足够顺畅、足够可试用”的动态小程序原型。

前端开发应优先保证以下三点：

1. 核心页面完整。
2. 任务状态流转真实。
3. Mock 数据驱动首页、列表、详情同步变化。

只要用户可以完整体验从“待联系客户”到“添加预约”再到“完成任务”的流程，该阶段目标即基本成立。

