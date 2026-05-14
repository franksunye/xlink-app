# 现场服务领域：业界参照与 XLink 边界

> **状态**：跨版本设计备忘；与 [02-vision](./02-vision.md)「FSM 基线」及 [09-v0.1-scope](./09-v0.1-scope.md) 领域段落互补，**不**替代现网 `business` / `cloud` 行为对齐义务。

## 主要参考

现场服务（Field Service）领域在**数据模型与概念拆分**上的主要参考为 Salesforce 官方文档中的 **Field Service Core Data Model**（SOAP 核心对象说明）：

[Field Service Core Data Model (Developer Guide)](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_core.htm)

该文档对「工单、服务预约、资源、技能、资产」等对象的关系与职责有成熟归纳，适合作为**对照阅读**与评审时的共同语言，而非实现清单。

## 与 XLink 的关系：不 1:1、选择性借鉴、产品化落地

XLink **不**按 Salesforce 做 **1:1 复刻或兼容**。我们**有选择地借鉴**其中经行业验证的**概念边界**（例如 **Work Order** 与 **Service Appointment** 的职责分离：计划/业务载体 vs 可调度、可到场执行的时间片），并在路线图上有节制地对照 **Territory（服务区域）**、**Operating Hours（营业时间/可服务窗口）** 等扩展维度——是否纳入、以何种粒度纳入，均以 XLink 现网流程、角色与合规要求为准。

**命名、对外 API、BFF 契约与数据库模型**一律以 **XLink 产品语言与既有域** 为真源做**本地化**；参照文档仅用于澄清「为何拆对象」「边界放哪里」，避免把厂商对象名或 SOAP 形态原样搬进自有系统。

## 如何使用该参考（避免厂商锁定）

团队在**领域设计评审**、**与终局 FSM 对齐的命名/聚合讨论**、以及**中长期路线图**（哪些概念值得单独建模、哪些可延后或以内嵌属性表达）中主动引用上述文档，与 [02-vision](./02-vision.md) 要求的「点名参照物」一致。引用目的是**吸收建模取舍与反模式教训**，保持可演进、可测试的领域结构；**不**承担对该商业产品的 API、许可或数据结构的依赖，也**不**将「与某厂商一致」作为验收标准。

## XLink 侧词汇与字段真源

与 Salesforce 的**概念对照**在本文前半；**对象命名、字段含义、派生规则** 以 **[12-domain-glossary](./12-domain-glossary.md)** 为 **XLink 管家侧规范真源**（工单 / 服务预约 / 跟进 / 工作台聚合等）。评审实现或 BFF 契约时，先对齐词汇表再对齐本参照文档。
