# 流程：项目（Tab「工具」）

> 状态：已定稿（2026-05-15；对齐 [archive `getProjects`](https://github.com/franksunye/xlink-app/blob/archive/business-3-0-wip/business_3_0/services/api/mock.js) 与 [`pages/projects`](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0)）

## 范围

- **入口**：底部 Tab（概念版文案为「工具」，建议 Web 改为「项目」）。  
- **数据**：项目卡片列表 — `id`、`name`、`stage`、`owner`、`progress`、`risk`。

## 触发与结束条件

- **触发**：用户切换到「项目」Tab。  
- **结束**：浏览列表；点击进入某项目详情（概念版若仅有列表，则 Web 首期可只做列表 + 点击 toast「演示中」或占位详情页）。

## 主路径

1. 进入 `/projects`。  
2. 请求 BFF `GET /api/projects` → Mock 返回 `projects` 数组。  
3. （可选）点击卡片 → `/projects/[id]` 详情壳。

## 与现网一致项

- 项目作为业务实体时的字段与权限与 `business` 项目列表对齐；mock 数据仅用于演示 **IA 与加载形态**。

## 异常与边界

| 情况 | 期望行为 |
| --- | --- |
| 空列表 | 空状态 |
| 错误 | Toast 或错误边界；**不缓存**敏感错误正文 |

## 备注

- 与 **低代码拆解** 中的「报表/块」区分：本列表为 **领域项目列表**，非通用报表块。
