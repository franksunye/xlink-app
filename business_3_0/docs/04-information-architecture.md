# 第 3 轮：信息架构与导航

> 状态：已定稿（2026-05-15；IA 对齐 [archive/business-3-0-wip 概念版 `business_3_0`](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0) 的 `pages.json` 与 Tab 结构；落地为 **Next.js** 路由）

## 参照来源

- 概念版页面注册与 TabBar：分支 `archive/business-3-0-wip` 下 [`business_3_0/pages.json`](https://github.com/franksunye/xlink-app/blob/archive/business-3-0-wip/business_3_0/pages.json)（GitHub 浏览）。  
- 与现网 `business/` 的差异：**业务语义仍以后者为准**；本 IA 描述的是 **3.0 Web 首期** 的导航与页面壳，名称可在 Web 上优化，但能力边界需可映射回工单/项目等真实对象。

## 全局路由顺序（非 Tab，栈式）

概念版 `pages` 数组顺序（首屏为登录栈，主应用为 Tab）：

| 顺序 | 概念路径 | 标题 / 用途 | Next.js 建议路由 | v0.1 Web |
| --- | --- | --- | --- | --- |
| 1 | `pages/login/index` | 登录（启动页 → 方式选择 → 表单） | `/login` | **含**：主路径与视觉验收对齐概念版 |
| 2 | `pages/security-alert/index` | 安全提醒 | `/security-alert` | **不含**：延至 **小规模商用就绪**（商用准备阶段再评估）；[09](./09-v0.1-scope.md) 已从 v0.1 划出 |
| 3 | `pages/index/index` | 工作台 | `/` 或 `/home` | **含** |
| 4 | `pages/work-orders/index` | 任务列表 | `/work-orders` | **含** |
| 5 | `pages/work-orders/detail` | 任务详情 | `/work-orders/[id]` | **含** |
| 6 | `pages/projects/index` | Tab 文案为「工具」，页面标题为「项目」 | `/projects`（或 Web 上统一为「项目」命名） | **含** |
| 7 | `pages/account/index` | 我的 | `/account` | **含**（壳） |
| 8 | `pages/feedback/index` | 体验反馈 | `/feedback` | **不含**：延至商用准备阶段（同 security-alert）；[09](./09-v0.1-scope.md) 已从 v0.1 划出 |

## 顶层导航（Tab → Web 底部或侧栏）

与概念版 `tabBar.list` 一致（仅 Tab 四项；登录与反馈等走栈式入口）：

| Tab 文案（概念版） | 概念 `pagePath` | 指向能力 | Next 路由 | 与现网 `business` 对照 |
| --- | --- | --- | --- | --- |
| 首页 | `pages/index/index` | 工作台：指标、今日任务、快捷入口 | `/`（Tab） | 对应管家首页「驾驶舱 + 待办」的 **信息聚合方式**；数据字段对齐见 mock `dashboard` |
| 任务 | `pages/work-orders/index` | 工单/任务列表与筛选 | `/work-orders`（Tab） | 对应服务工单列表 `serviceAppointments`；筛选维度概念版用 `filter`（如 `to_accept`、`need_contact`） |
| 工具 | `pages/projects/index` | 概念版为 **项目列表**（`getProjects`） | `/projects`（Tab） | Tab 名「工具」与内容「项目」不一致：**Web 首期建议统一为「项目」**，避免用户认知分裂 |
| 我的 | `pages/account/index` | 账号与设置入口 | `/account`（Tab） | 对应 `business`「我的」；具体子项随迭代补 |

**非 Tab 入口（整机 IA 图景；v0.1 是否落地另见「v0.1 Web」列）**

- **体验反馈** `/feedback`：**概念版与设计参照**中为工作台快捷入口之一；**v0.1 不交付**该路由与流程，延至商用准备阶段。  
- **安全提醒** `/security-alert`：与登录栈衔接；**v0.1 不交付**，延至商用准备阶段。

## 关键列表与详情

### 任务（工单）

- **列表页**：`/work-orders`；支持概念版 mock 中的 `group` / `filter`（如 `need_contact`、`to_accept`、`onsite`、`following`），与首页 `entries`、`taskOverview` 跳转对齐。  
- **详情页**：`/work-orders/[id]`；展示摘要、`context`、`followRecords`、`timeline` 等块（概念版 `getWorkOrder` 数据结构）。  
- **与现网一致项（语义）**：工单标识、客户、地址、状态类信息、跟进记录的业务含义应对齐 `business` 服务工单；**展示分块可与概念版一致**，字段名在 BFF/Adapter 层映射。

### 项目

- **列表页**：`/projects`；项目卡片（名称、阶段、负责人、进度、风险文案）对齐 `getProjects`。  
- **与现网一致项**：项目作为业务对象存在时，与 `business` 项目列表语义对齐；概念版为 **只读演示** 时以 mock 为准。

### 工作台（首页）

- **指标卡片、今日任务、快捷操作**：对齐 `getDashboard` 结构；快捷项里部分为 `toast` 演示、部分 `route` 跳转任务；若概念版指向 **反馈**路由，Web v0.1 按 [09](./09-v0.1-scope.md)**不实现跳转**或 **toast**，保持 **交互类型**可辨（占位 vs 真跳转）。

## 外部稿（可选）

- 概念版仓库：[archive `business_3_0` 目录](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0) 的 `pages/`、`static/tabBar/`。  
- 线框 / 高保真：可后续补链接。

## 备注

- **cloud_ui（管理端）**：不纳入本期 IA 必交付；现网旧版可用，优先级靠后（见 [02-vision](./02-vision.md)）。  
- **命名**：第三 Tab 概念版为「工具」、导航栏标题为「项目」——定稿建议 Web 统一为 **「项目」** 并在文档与代码中一致。
