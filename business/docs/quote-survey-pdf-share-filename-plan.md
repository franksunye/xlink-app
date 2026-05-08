# 工单 PDF 预览分享文件名优化

最后更新：2026-05-08

状态：已完成本地小程序端代码改造，待小程序真机验证。

## 目标

优化 `business/subpackages/serviceAppointment/serviceAppointment.vue` 中工单详情的 PDF 查看体验：

- 小程序端不新增显式分享按钮，统一从微信原生“文件预览”页右上角菜单分享。
- 小程序端打开 PDF 时使用可读业务文件名，避免 `tmp_...` 或 `file.pdf`。
- 小程序端档案页签移除重复的“下载”入口，保留并升级“查看”入口。
- App 端不使用微信小程序 `wx.openDocument` 分享菜单；通过条件编译保留 App-Plus 原有打开/下载能力。

主要实现文件：

- `business/subpackages/serviceAppointment/serviceAppointment.vue`：补充入口元数据，统一调用 `download()`。
- `business/resources/js/documentPreview.js`：集中处理文件名生成、图片预览、微信小程序文件预览、App-Plus 文件打开。

## 文件名规则

格式：

```text
{文件类型}_{工单编号}_{客户名称}_{短时间戳}.pdf
```

示例：

```text
报价单_GD20260409077_复制订单测试_04131451.pdf
勘察单_GD20260409077_复制订单测试_04131451.pdf
验收报告_GD20260409077_复制订单测试_04131451.pdf
质保单_GD20260409077_复制订单测试_04131451.pdf
合同_GD20260409077_复制订单测试_04131451.pdf
```

字段来源：

- 文件类型：由入口上的 `data-doctype` 映射为 `报价单`、`勘察单`、`验收报告`、`质保单`、`合同`。
- 工单编号：`SAFormData.orderNum`，缺失时降级为页面 `id` 或当前日期。
- 客户名称：`SAFormData.name`，最多 12 个字符，缺失时省略。
- 短时间戳：入口上的 `data-doctime`，优先 `updateTime || createTime`，格式 `MMddHHmm`，缺失时使用当前时间。

清洗规则：

- 只保留中文、英文、数字、下划线、短横线。
- 空格、斜杠、冒号等特殊字符替换为 `_`。
- 连续 `_` 合并。
- 工单编号最多 24 个字符。
- 短时间戳固定保留在末尾，用于区分同一工单下多份报价、勘察、验收等文件。

## 覆盖范围

已统一升级的小程序端文件查看入口：

- 下单页签：`查看报价单`、`查看质保年限`
- 勘察页签：`查看报告`
- 合同页签：`查看合同`
- 档案页签：`查看文件`、`查看报价单`、`查看质保单`
- 验收节点：`查看/预览文件`

小程序端已移除的档案重复入口：

- `下载文件`
- `下载报价单`
- `下载质保单`

暂不覆盖：

- 复制链接后的下载文件名
- 七牛对象 key 或后端 PDF 生成文件名
- App 端文件分享能力
- H5
- `subpackages2/inspectionAppointment/inspectionAppointment.vue` 巡检单详情页

## 实现要点

- `download()` 保留图片预览；非图片文件按平台条件编译处理。
- 文件命名和平台打开逻辑抽到 `business/resources/js/documentPreview.js`，避免继续膨胀 `serviceAppointment.vue`。
- `MP-WEIXIN`：下载远程 PDF，保存为业务命名文件，再 `wx.openDocument({ showMenu: true, fileType })`。
- `APP-PLUS`：使用 `plus.downloader.createDownload()` 和 `plus.runtime.openFile()`，避免 App 端调用 `wx.*`。
- 小程序端保存同名文件前先 `unlink`，删除成功或失败都继续保存；保存失败时降级打开临时文件。

## 验证清单

小程序真机：

- `查看报价单`、`查看质保年限`、`查看报告`、`查看合同`、档案查看、验收查看均能打开微信“文件预览”页。
- 文件预览页右上角显示三个点菜单。
- 从三个点菜单分享给联系人后，接收方看到的文件名符合规则。
- 档案页签不再显示 `下载文件/下载报价单/下载质保单`。
- 图片仍走图片预览，不进入 PDF 命名逻辑。

App 回归：

- 同一“查看”入口不因 `wx.*` API 报错。
- 文件仍可通过系统能力打开。
