# 第 2 轮：人物与场景

> 状态：已定稿（2026-05-14；人物与现状流程来自仓库 `business/` 研读，3.0 为在相同业务下的抽象与体验优化）

## 3.0 对本轮的立场

- **现状**（当前 `business` 实现）与 **3.0 要做的抽象、优化** 是两件事：文档里「现状」用于对齐业务事实；**3.0** 在业务不变前提下优化信息架构、交互与工程实现。
- **核心竖切场景**（与分支 `archive/business-3-0-wip` 中尝试方向一致）：**管家（工程师视角）从接单到办结服务工单的主路径**。
- **早期策略**：**UI/流程即可改版**；业务规则与对外能力仍以现网为准，体验层允许明显优化。

## 主要角色（来自现网 `business` 代码线索）

| 角色 | 说明 | 设备 / 入口假设 |
| --- | --- | --- |
| **管家** | 首页「管家驾驶舱」、接单与签约等指标；待办按工单状态跳转列表（见 `pages/index/index.vue` 中 `currentRole._id == '8050029062726074247'`）。 | **现网**：微信小程序 / App。**3.0**：首期以 **Web（Next.js，Vercel）** 承载同一业务场景，IA 可参照 [archive 概念版](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0)。 |
| **内勤** | 与工单信息渠道等逻辑关联（见 `subpackages/extForm/extForm.vue` 注释中的角色 ID）。 | 同上 |
| **工队** | 服务工单中选工队、施工相关能力（见 `serviceAppointment.vue` 等）。 | 同上 |
| **业主** | 报价单、材料交割单等「发送 / 确认」类交互（见 `serviceAppointment.vue` 文案与流程）。 | 业主侧触点（小程序/H5 等以现网为准） |

角色 ID 仅作**代码参照**，3.0 文档层应使用**业务角色名**；权限与数据范围仍以 `cloud` / 现网契约为准。

## 典型场景

### 管家（核心路径 — 3.0 POC 首选）

1. **从驾驶舱进入待办**  
   **前提**：已登录且当前身份为管家。  
   **行为**：在首页查看待处理统计（如待预约、待上门、待下单、待签约等），点击某一类进入对应筛选条件下的**工单列表**。  
   **成功**：列表与现网数据语义一致，管家能识别「下一步该处理哪一单」。  
   **实现参照**：[`business/pages/index/index.vue`](../../business/pages/index/index.vue)（`housekeepReport2`、`reportNavigateTo`）。

2. **打开一单服务工单并推进流程**  
   **前提**：在工单列表中选中一条服务工单。  
   **行为**：进入工单详情，查看摘要、工单状态、主流程节点与子流程；在权限允许时填写节点表单、提交、推进状态直至当前责任范围办结。  
   **成功**：与现网一致的状态与权限语义下完成「接单后的处理与办结」；**UI/导航可重做**。  
   **实现参照**：[`business/subpackages/serviceAppointment/serviceAppointment.vue`](../../business/subpackages/serviceAppointment/serviceAppointment.vue)（工单状态、节点、表单等）。

3. **协同业主 / 工队（子能力）**  
   **前提**：工单进展到需业主确认或需指定工队等步骤。  
   **行为**：发起报价/交割单、选工队等（具体以工单类型与配置为准）。  
   **成功**：业务结果与现网规则一致；3.0 可优化操作路径与反馈。  
   **实现参照**：同上，`serviceAppointment.vue` 中与业主、工队相关交互。

### 内勤 / 工队（次优先）

- **内勤**：处理渠道、报单类字段等（与管家分工不同，细节以配置与权限为准）。  
- **工队**：接收指派、施工与验收相关节点。

### 业主（非管家 POC 核心，但需在对照中知晓）

- 在关键节点对报价、材料交割等进行确认；3.0 若先做管家端，业主侧可仍以现网为准做**行为对照**，不必第一期重做业主 UI。

## 与现网差异声明（3.0 早期）

| 维度 | 现网（`business`） | 3.0 早期 |
| --- | --- | --- |
| 业务规则与状态语义 | 以后端与工作流配置为准 | **不变** |
| IA、导航、视觉、微交互 | 当前实现 | **允许优化** |
| 数据获取 | 真实 API | 可按 [vision](./vision.md) 采用 mock / 新架构先行，再对齐联调 |

## 代码索引（便于第 4 轮拆流程）

| 主题 | 路径（相对仓库根目录 `xlink-app/`） |
| --- | --- |
| 首页 / 管家驾驶舱 / 待办跳转 | `business/pages/index/index.vue` |
| 服务工单列表（主包页） | `business/pages/serviceAppointment/serviceAppointments`（见 `business/pages.json`） |
| 服务工单详情与主流程 | `business/subpackages/serviceAppointment/serviceAppointment.vue` |
| 售后工单（另一类工单） | `business/subpackages2/workOrder/workOrder.vue` |
| 角色与信息渠道注释 | `business/subpackages/extForm/extForm.vue` |

## 备注

- **售后工单**（`workOrder.vue`）与**服务工单**（`serviceAppointment`）在现网为两条能力线；你指定的「接单—完成」核心是**服务工单 + 管家**，POC 文档与实现应优先绑这一条，避免两条线混写进同一竖切。
- 下一轮（IA）：建议从 **工单列表 → 详情 → 节点/表单** 的信息架构入手，对照现网 Tab/入口，再画 3.0 改版后的导航草案。
