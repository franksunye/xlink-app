# Business 3.0 设计侧变更记录

> 与 [10-release-and-acceptance.md](./10-release-and-acceptance.md) 配套：**每行一条可发布版本** 或重要治理变更；不必罗列每次 PR。

| 日期 | 版本 / 主题 | 摘要 |
| --- | --- | --- |
| 2026-05-14 | 领域地基 | [12](./12-domain-glossary.md)：§1 命名分层（展示名 vs 领域实体）；§1.3 工单活动 / `FollowRecord`→`WorkOrderActivity` 演进说明。 |
| 2026-05-14 | 领域地基 | [12-domain-glossary](./12-domain-glossary.md) 增补 §2：`User`、`Account`、`Contact`、`ServiceResource`、`AssignedResource`、`WorkType` 及第二梯队预留；章节重编号。 |
| 2026-05-14 | 领域地基 | 新增 [12-domain-glossary](./12-domain-glossary.md)：工单 / 服务预约 / 跟进 / 工作台聚合等字段真源与变更纪律；索引与 09/11/mock-data 头注释引用。 |
| 2026-05-14 | web 维护 | 生产/Vercel 基 URL 写入 `web/README.md`；`middleware` 对未授权 API 401 补齐 `Cache-Control: private, no-store`；验收脚本第 15～16 步与线上头/SW 对齐说明；`09` 明确 v0.1 不做项目详情路由。 |
| 2026-05-14 | v0.1.0 | POC 波次 1 发布：Next + BFF Mock 管家主路径、TanStack Query、httpOnly 登录壳、安全响应头、PWA manifest、SW 排除 `/api` 宽泛缓存、CI 与验收脚本；范围见 [09-v0.1-scope](./09-v0.1-scope.md)。 |
