# 第 5 轮：非功能与技术 POC 意图

> 状态：部分已定稿（技术栈与部署面，2026-05-14）

## 技术栈与部署（已定稿）

| 项 | 选择 | 说明 |
| --- | --- | --- |
| 框架 | **Next.js** | App Router 等具体约定在脚手架落地时定；与 archive 上 uni-app 概念版解耦。 |
| 托管 | **Vercel** | 主分支与 **Preview 部署**支撑高频迭代；不作为现网 `business` 小程序的替代发布，直至团队另有约定。 |
| 非目标（当前阶段） | **不以微信小程序为主迭代面** | 小程序发版节奏慢；现网 **`business/`** 仍为业务与行为对照基准。 |
| 体验参照 | **`archive/business-3-0-wip` / `business_3_0`** | [GitHub 目录](https://github.com/franksunye/xlink-app/tree/archive/business-3-0-wip/business_3_0)：IA/页面粒度可参考，实现用 Web 重写。 |

## 性能与体积

- Web 首屏与列表：是否对标 `business` 小程序某类网络环境，待定量化指标。
- 

## 可观测与发布

- Vercel 上的 **Analytics / Speed Insights** 是否启用、与现有埋点体系如何对齐，待定。
- 与 `business/` 并行期：默认用户侧交付仍以现网为准；3.0 Web 为实验/内测 URL，待定。

## 技术 POC 方向

对每条 POC 填写：要验证什么、成功标准、失败时是否放弃。

| POC 主题 | 要验证的问题 | 成功标准 | 失败时 |
| --- | --- | --- | --- |
| Next.js 竖切（登录占位 + 工单列表/详情壳） | 路由、布局、Mock 数据层是否与「管家主路径」文档一致 | Vercel Preview 可演示主路径骨架 | 调整目录结构或数据层，不放弃 Next 方向 |
|  |  |  |  |

## 备注

- 若后续需要 **小程序壳** 仅做容器嵌入 Web（Hybrid），可作为独立 POC，不改变「主迭代在 Web」的默认。
