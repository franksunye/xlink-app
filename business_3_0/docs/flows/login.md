# 流程：登录与身份

> 状态：已定稿（2026-05-15；交互对齐 [archive 概念版 `pages/login/index.vue`](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0)）

## 范围

- **角色**：服务商侧用户（概念版以「张工」等 mock 文案演示）。  
- **与现网**：真实登录语义以 `business` + `cloud` 为准；**首期 Web 以 Mock 跑通 IA**，真对接时经 BFF Adapter 接入（见 [integration-strategy](../05-integration-strategy.md)）。

## 触发与结束条件

- **触发**：冷启动进入 `/login`；或未登录访问受保护路由时重定向至 `/login`。  
- **结束（成功）**：校验通过后进入 **工作台 Tab**（概念版 `uni.switchTab` → `/pages/index/index`；Next 为 `/`）。  
- **结束（失败）**：账号/协议校验失败，停留登录页并提示（概念版：手机号为 `error` 时 toast「登录失败」）。

## 主路径（概念版已实现，Web 复刻）

1. **启动屏 `launch`**：品牌 + 插画；可自动或手动进入「选择登录方式」。  
2. **方式选择 `methods`**：验证码登录（推荐）、密码登录、快捷登录。  
3. **表单屏**（`otp` / `password`）：手机号 + 验证码或密码；协议勾选；获取验证码（mock 直接填充 `268899`）。  
4. **提交 `submitLogin`**：校验手机号、协议；通过后进工作台。  
5. **快捷登录 `quickLogin`**：无表单，直接进入工作台（mock）。

## 与 Mock / BFF 的边界

- 概念版 **无** `mock.js` 内独立 `login()` export；会话由 **前端本地步骤 + switchTab** 完成。  
- **Next 建议**：`POST /api/auth/login`（或 session cookie）由 BFF 返回 **mock 用户上下文**（`userId`、`displayName`、`role`），与 [nonfunctional](../07-nonfunctional-and-poc.md) 缓存策略一致（该接口默认 **不可被 SW 缓存**）。  
- 真接入后：Adapter 调现网登录接口，仍只经 BFF 暴露 3.0 契约字段。

## 异常与边界

| 情况 | 期望行为 |
| --- | --- |
| 未同意协议 | 阻止提交并提示 |
| 手机号为空 | 阻止提交 |
| 演示失败号 `error` | Toast 登录失败 |
| 安全提醒页 | 概念版存在 `security-alert` 路由；**v0.1 Web 不包含**（延至小规模商用就绪）；是否在登录后强制展示由产品与商用阶段再定 |

## 备注

- **身份多角色**（管家/内勤等）：概念版未拆分；Web 后续在 `account` 或工作台增加 **角色上下文**，与 `business` 的 `currentRole` 语义对齐后再接 spec。
