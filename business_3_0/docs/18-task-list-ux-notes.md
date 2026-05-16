# 任务列表 UX 备忘（Tab 筛选 + 分页懒加载）

> **状态**：v0.2.4+；**布局与卡片结构不变**。  
> **实现**：`WorkOrdersInner.tsx`、`/api/work-orders`、`work-order-cloud-read.ts`、`work-order-list-page.ts`

## UX 真源（必读）

**不自行发明交互。** 任务列表的分页、触底加载、Tab 切换、底部加载文案，以 XLink 已上线 **`business` 小程序** 为准（其交互对齐 Salesforce Field Service Mobile / `van-tabs` + `uni-load-more`）：

| 真源文件 | 行为 |
|----------|------|
| `code/app/business/pages/serviceAppointment/serviceAppointments.vue` | `fpi.page` / `fpi.rows: 10`；`scrollToLower` / `onReachBottom` 递增页码；`loadStatus`: `more` \| `loading` \| `noMore`；`tabChange` 时 `page=1`、清空列表再拉取 |
| Cloud API | `basic/serviceAppointment/querySAWorkflowNode.do`，`page` + `rows` + `FlipInfo.total` |

Web 3.0 映射：

- BFF：`GET /api/work-orders?page=&rows=10&filter=`
- 前端：`useInfiniteQuery` + `IntersectionObserver` 触底（等同 `onReachBottom`）
- 页大小：**10**（`WORK_ORDER_LIST_ROWS`）

FSL 在此仓库指 **Salesforce Field Service 领域**；UI 以 **business 已验证实现** 为规范，而非通用前端动效方案。

## 可执行规则

| 维度 | 约定 |
|------|------|
| **Tab 切换** | 对齐 `tabChange`：搜索栏 + `FilterTabBar` **始终可见**；`page=1`、清空列表、列表区「加载中…」；**不**整屏骨架、不保留上一筛列表 |
| **首屏** | 仅组件首次挂载且无数据时整屏骨架；之后筛 Tab 切换只动列表区 |
| **分页** | 每页 10 条；`hasMore` 由 `page * rows < total` 判定 |
| **触底** | 哨兵进入视口触发下一页；底部 `uni-load-more` 等价文案：加载中 / 没有更多了 |
| **搜索** | v0.2.4 仍客户端过滤 **已加载** 条目；服务端 `regex:` 搜索属后续 |
| **空态** | 无数据：白卡片 + 简短说明 |

## 明确不做

- 自定义滑动 Tab 指示条、列表 crossfade、行级 shimmer（非 business 既有行为）
- 不改首页布局、底部 TabBar、任务卡片 DOM
- View Transitions、虚拟列表、写路径
