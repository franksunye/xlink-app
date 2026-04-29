# XLink Business 3.0 Concept

`business_3_0/` 是独立的 Business 3.0 UX 概念版小程序骨架，用于快速验证新的前端体验。

## 当前边界

- 不复用现有 `business/App.vue` 的登录、上报、角色、定位和后端启动链路。
- 默认只使用本地 mock 数据，不连接后端。
- 目标优先级是微信小程序体验包，其次才是后续接入真实 API。
- 现有 `business/` 仍作为线上维护版本，不受本目录影响。

## 目录约定

- `pages/`：概念版页面。
- `services/api/`：数据访问入口。当前固定走 mock，后续真实接口只替换这一层。
- `styles/theme.css`：全局视觉 token 和通用组件样式。
- `.env.example`：本地配置模板，真实 `.env.local` 不进入 Git。

## HBuilderX 运行

1. 在 HBuilderX 中导入 `business_3_0/`。
2. 如需上传微信体验版，在 `manifest.json` 的 `mp-weixin.appid` 填入专用体验小程序 AppID。
3. 运行到微信开发者工具。

不要直接使用当前线上 `business` 小程序 AppID 上传概念版，除非已经确认不会覆盖线上发布流程。

## Spec 到位后的落点

Spec 进入后，优先补齐：

- 核心用户角色和首屏任务。
- 页面信息架构和导航。
- 关键流程：工单、项目、预约、反馈。
- mock 数据字段和状态机。
- 微信体验版发布 checklist。
