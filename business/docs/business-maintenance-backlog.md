# Business Maintenance Backlog

最后更新：2026-05-08

## 维护原则

- 先定位真实代码路径，再做改动；不要用经验判断替代代码验证。
- 每次改动都要明确影响面：App、微信小程序、H5、`business_jishi` 是否需要同步。
- 优先小范围防御性修复；涉及页面结构、权限、定位、地图、滚动、全局请求逻辑时，需要扩大回归范围。
- `business/wxcomponents/` 视为工具链生成内容，默认不作为业务源码维护对象。
- 维护资产和业务源码分开管理：脚本、文档、验证样本属于维护资产，不应和业务功能变更混在一起描述。

## 维护入口

- 主项目：`/Users/yesun/Code/xlink-app/business`
- 参考工作流：`/Users/yesun/Code/xlink/.agents/workflows/cloud_ui_smoke_test.md`
- 关联后端/管理端样本验证目录：`/Users/yesun/Code/xlink/code/cloud_ui`
- 建议补充护栏文档：`business/docs/business-maintenance-guardrails.md`

## 高风险文件

- `business/resources/js/common.js`：全局接口、登录态、环境、请求封装，任何修改都需要全链路回归。
- `business/pages.json`：页面路由、分包、平台条件编译，影响入口和跳转。
- `business/manifest.json`：App/小程序能力、权限、插件、定位和构建配置。
- `business/resources/mixins/watchPositionMixin.js`：定位、地图、后台保活相关风险较高。
- `business/pages/serviceAppointment/serviceAppointments.vue`：主工单列表，属于高频业务入口。
- `business/pages/project/projects.vue`：主项目列表，属于高频业务入口。

## 验证基线

- 静态检查：确认目标页面、分包、公共方法和平台条件编译路径。
- API 契约校准：按 `.agents` 工作流在 `cloud_ui` 中执行 Beta API smoke test，更新或查看 `tmp/api_samples` 下样本。
- 手工回归：至少覆盖登录、首页、工单列表、工单详情、项目列表、定位/地图相关流程。
- 同步检查：如果公共逻辑或业务页面存在 `business_jishi` 复制实现，需要标记同步状态。

## Backlog

### P0 - 工单详情补充签约信息图片上传数量放开

- 状态：已确认目标上限为 8 张，已发现合同 PDF 生成前置风险，待模板生成适配后再改生产字段配置
- 目标：工单详情的“补充签约信息”中，把维修部位图片、质保部位图片都调整为最多 `8` 张；同时修复未配置 `max` 时前端默认 20 张的兜底问题，并确保合同 PDF 能正确承载新增图片。
- 技术方案：`business/docs/service-appointment-signform-upload-limit-plan.md`
- 模板影响：`business/docs/service-appointment-signform-photo-template-impact.md`
- 影响面：`business/subpackages/serviceAppointment/serviceAppointment.vue`、`business_jishi/subpackages/serviceAppointment/serviceAppointment.vue` 同步评估。
- 验收标准：
  - 当前截图里的维修部位图片 `0 / 2`、质保部位图片 `0 / 4` 能追溯到字段 `frontEndConfig.max` 配置。
  - 合同 PDF 生成对 `repairPhotos`、`warrantyPhotos` 的图片排版已适配最多各 8 张。
  - 两个字段的 `frontEndConfig.max` 都调整为 `8`。
  - 补充签约信息弹窗中两个字段都显示 `0 / 8`。
  - 两个字段分别上传 8 张可成功，第 9 张明确阻断。
  - 未配置 `frontEndConfig.max` 的文件字段显示“不限”时，前端上传组件不再按 20 张截断。
  - `frontEndConfig.max` 显式大于 0 时仍尊重配置限制。
  - 相册回填、删除、提交到 `basic/order/orderConfirm` 的数据格式保持不变。

### P2 - 图片上传前压缩以提升上传性能

- 状态：已完成生产 bucket 盘点，非小程序阶段紧急项，暂缓实施
- 目标：工单详情上传图片时，在上传七牛前进行合理压缩，降低上传体积和失败率。
- 技术方案：`business/docs/image-upload-compression-plan.md`
- 影响面：`business/resources/js/common.js` 全局上传入口；如同步，涉及 `business_jishi/resources/js/common.js`。
- 当前判断：
  - 小程序阶段可先依赖平台选图压缩候选和七牛下载侧瘦身，图片压缩不是当前阻塞项。
  - 七牛 `fs-go` 全空间 2024-2025 图片对象 P90 为 `2.4MB`、P95 为 `3.9MB`，说明存在大图，但不影响当前小程序优先事项排序。
  - 后续进入 App 上传体验优化或大图失败率治理时再恢复实施。
- 验收标准：
  - 图片上传走统一压缩入口，视频和非图片文件不压缩。
  - 压缩失败时保留原图上传兜底，不阻断业务提交。
  - App 与微信小程序上传路径均有手工验证记录。

### P1 - 报价单和勘察报告单文件分享与命名优化

- 状态：已完成 `business` 微信小程序第一阶段代码改造；已补充显式分享按钮，待真机验证分享文件名
- 目标：解决报价单、勘察报告单预览/分享时显示 `tmp_...` 临时文件名的问题，改为可识别的业务文件名。
- 技术方案：`business/docs/quote-survey-pdf-share-filename-plan.md`
- 影响面：`business/subpackages/serviceAppointment/serviceAppointment.vue`、`business/subpackages2/inspectionAppointment/inspectionAppointment.vue`。本阶段只处理 `business` 微信小程序，`business_jishi` 暂不纳入，避免干扰首轮验证。
- 当前判断：
  - 小程序截图中的 `tmp_...` 主要来自 `wx.downloadFile` 后直接 `wx.openDocument(res.tempFilePath)`。
  - 小程序 `saveFile` 分支当前固定保存为 `file.pdf`，也不利于多文件分享识别。
- 验收标准：
  - `查看报价单`、`查看报告` 可正常进入微信“文件预览”页。
  - 页面提供 `分享报告` / `分享文件` / `分享报价单` 入口。
  - 勘察报告/验收报告类 PDF 分享给微信联系人后，接收方看到的文件名可识别。
  - 右上角文件菜单保留可分享能力。
  - 图片预览、复制链接不回归。

### P0 - 建立接管护栏文档

- 状态：待办
- 目标：补充 `business/docs/business-maintenance-guardrails.md`，明确可改/慎改/不可随意改的模块、验证命令、平台回归清单。
- 验收标准：
  - 覆盖 App、微信小程序、H5 的基础回归范围。
  - 明确 `common.js`、`pages.json`、`manifest.json`、定位/地图链路的变更要求。
  - 明确什么场景必须检查 `business_jishi`。

### P0 - 建立现状地图

- 状态：待办
- 目标：梳理 `business` 页面、分包、公共 JS、mixins、关键接口调用关系，形成维护索引。
- 验收标准：
  - 输出页面入口和主要业务模块清单。
  - 标记高频路径：登录、首页、工单、项目、联系人、库存、订单、定位。
  - 标记疑似重复实现和跨端差异。

### P1 - API 契约样本接入维护流程

- 状态：待办
- 目标：把 `.agents/workflows/cloud_ui_smoke_test.md` 的 API 样本流程纳入 `business` 维护验证步骤。
- 验收标准：
  - 明确什么时候需要跑 smoke test。
  - 明确样本文件如何用于前端字段校准。
  - 明确 smoke test 失败时不能直接做前端假设。

### P1 - `business_jishi` 同步边界确认

- 状态：待办
- 目标：确认 `business` 与 `business_jishi` 的代码复用/复制关系，避免只修一端导致回归。
- 验收标准：
  - 标记必须同步的公共文件或页面。
  - 标记可以独立演进的模块。
  - 每次维护任务都能记录同步结论：不涉及、已同步、待同步。

### P1 - 构建和运行验证方式固化

- 状态：待办
- 目标：确认本地 HBuilderX、uni-app、Node 14.21.3、App/小程序构建方式，形成可重复验证命令或手工步骤。
- 验收标准：
  - 写明本地依赖安装方式和 Node 版本要求。
  - 写明 App 和微信小程序的验证入口。
  - 记录无法自动化验证的人工检查项。

### P2 - 全局请求与登录态风险审计

- 状态：待办
- 目标：审计 `common.js` 中环境、token、错误处理、重试、跳登录逻辑。
- 验收标准：
  - 输出当前请求生命周期说明。
  - 标记高风险分支和可防御性修复点。
  - 不改变行为前提下补充必要注释或局部封装建议。

### P2 - 定位/地图链路回归清单

- 状态：待办
- 目标：梳理定位权限、持续定位、地图 SDK、后台保活、工单/项目使用点。
- 验收标准：
  - 标记平台差异：App、微信小程序、H5。
  - 标记权限失败、定位失败、地图加载失败时的用户路径。
  - 形成每次触碰定位相关代码时的回归清单。

### P2 - 依赖与平台升级评估

- 状态：待办
- 目标：评估 `markdown-it`、`vuex`、uni-app/HBuilderX、App 插件和小程序基础库升级风险。
- 验收标准：
  - 先给出风险评估，不直接升级。
  - 区分安全补丁、构建兼容、运行行为变化。
  - 每个升级项都有回滚方式和验证路径。

## 任务记录模板

```text
日期：
任务：
类型：bugfix / regression-review / handoff / upgrade / docs
影响面：App / 微信小程序 / H5 / business_jishi
涉及文件：
验证方式：
同步状态：不涉及 / 已同步 / 待同步
结论：
```
