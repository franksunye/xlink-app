# 工单详情补充签约信息图片数量方案

最后更新：2026-05-08

## 背景

目标：工单详情“补充签约信息”中，先明确维修部位图片、质保部位图片的真实限制来源，再决定是调整字段配置，还是修复前端默认限制。

当前截图显示：

- `维修部位图片` 显示 `(0 / 2)`。
- `质保部位图片` 显示 `(0 / 4)`。

这说明这两个字段当前不是“未配置上限”，而是已经存在明确的 `frontEndConfig.max` 业务配置。原计划只强调“未配置时默认 20 张”的问题，不足以覆盖当前截图现状，需要修订。

本方案只讨论上传数量限制，不包含图片压缩。

## 代码现状

主文件：

- `business/subpackages/serviceAppointment/serviceAppointment.vue`

同源同步候选：

- `business_jishi/subpackages/serviceAppointment/serviceAppointment.vue`

补充签约信息弹窗位于 `signForm` 区域，标题为“补充签约信息”。字段不是写死在前端模板中，而是来自动态表单：

- `getSignFormFields()` 调用 `biz/extForm/query/{formDefId}` 获取字段定义。
- `signForm.allFields` 保存全部字段。
- `signForm.fields` 根据 `personType` 等前端配置过滤后渲染。
- 文件字段通过 `extField.type == 'file'` 统一渲染 `van-uploader`。
- 提交时 `signFormSubmit()` 将数组图片字段转换为逗号分隔 URL，再写入 `formData.exts`，最后调用 `basic/order/orderConfirm`。

## 限制来源

补充签约信息的限制分两类：

1. 字段配置限制：`extField.frontEndConfig.max` 有明确值，例如截图中的 `2` 和 `4`。
2. 前端默认兜底限制：`extField.frontEndConfig.max` 未配置时，`van-uploader` 当前兜底为 `20`。

补充签约信息的 `van-uploader` 当前逻辑：

```vue
:max-count="
  extField.frontEndConfig.max || extField.frontEndConfig.max == 0
    ? extField.frontEndConfig.max
    : 20
"
```

实际含义：

- 如果 `frontEndConfig.max = 2`，计数显示 `(0 / 2)`，组件最多允许 2 张。
- 如果 `frontEndConfig.max = 4`，计数显示 `(0 / 4)`，组件最多允许 4 张。
- UI 计数处在未配置 `max` 时显示“不限”。
- 但上传组件在未配置 `max` 时实际兜底为 `20`。
- `afterRead()` 里只有 `frontEndConfig.max` 为真值时才拦截数量，因此未配置 `max` 时逻辑层本来接近“不限”。
- 相册回填逻辑已将 `max = field.frontEndConfig.max || 0` 解释为 `0: 不限制`。

现状结论：

- 截图中的 2 张和 4 张不是前端默认 20 导致，而是字段配置明确限制。
- 如果业务目标是“维修部位图片、质保部位图片增加上传数量，最好无限制”，仅改 `van-uploader` 默认 20 不会改变这两个字段的 2/4 限制。
- 当前要先确认产品目标：是把这两个字段的配置从 `2/4` 调大或改为不限，还是只修复“未配置 max 时不应默认限制 20”的通用问题。
- 前端实现仍需修复 `afterRead()` 对补充签约信息的校验容器问题：当前数量校验默认看 `this.formData`，而补充签约信息实际上传结果写入 `signForm.formData`。

## 待确认业务决策

针对截图中的两个字段，业务已明确希望统一调整为最多 8 张。该目标会影响合同 PDF 模板生成，不能只改字段配置；模板影响分析见：

- `business/docs/service-appointment-signform-photo-template-impact.md`

| 字段 | 当前显示 | 推断来源 | 可选目标 |
| --- | ---: | --- | --- |
| 维修部位图片 | `0 / 2` | `frontEndConfig.max = 2` | 改为 `frontEndConfig.max = 8` |
| 质保部位图片 | `0 / 4` | `frontEndConfig.max = 4` | 改为 `frontEndConfig.max = 8` |

推荐执行路径：

1. 先确认合同 PDF 生成逻辑能正确承载两组图片最多各 `8` 张。
2. 再在后台字段配置里修改 `order` 扩展字段，把 `repairPhotos`、`warrantyPhotos` 的 `frontEndConfig.max` 都改为 `8`。
3. 不建议在前端硬编码覆盖这两个字段；字段上限属于动态表单配置，前端应尊重配置。
4. 前端代码仍建议修复未配置 `max` 时默认 20 的兜底问题，以及 `signForm.formData` 校验容器问题。
5. 配置改完后，移动端重新打开补充签约信息，应显示 `(0 / 8)`。

## 技术方案

推荐做法：在页面内抽出 helper，统一计算动态文件字段的最大上传数。

建议语义：

- `frontEndConfig.max > 0`：按配置限制。
- `frontEndConfig.max == 0`：不限。
- `frontEndConfig.max` 未配置、空字符串、`null`、`undefined`：不限。

这套语义本身不会自动把截图中的 `2/4` 放开；因为 `2/4` 属于“明确配置限制”。如果要放开，需要同步调整字段配置或在前端对指定字段做业务 override。优先推荐调整字段配置，不推荐前端硬编码覆盖字段配置。

建议 helper：

```js
getUploadMaxCount(extField) {
  const max = extField && extField.frontEndConfig && extField.frontEndConfig.max;
  const parsed = Number(max);
  return parsed > 0 ? parsed : undefined;
}
```

模板调整：

- 将补充签约信息 `van-uploader` 的 `:max-count` 改为 `getUploadMaxCount(extField)`。
- 建议同步替换同页普通动态文件字段的相同表达式，避免详情显示“不限”但组件仍限制 20 的同类问题。
- 只读展示可以保留当前 `file-list`，不需要设置新的限制。

页面 `afterRead()` 数量校验建议同步修正：

- 仅当 `Number(frontEndConfig.max) > 0` 时拦截。
- 多选上传时按本次选择数量判断，而不是只加 `1`。
- 如果是 `signForm.show`，应检查 `signForm.formData`，不是固定检查 `this.formData`。
- 对截图中的字段，配置改为 `8` 后应严格按 8 张拦截。

补充签约信息虽然复用页面 `afterRead()`，但现有 `afterRead()` 初始化和数量判断默认落在 `this.formData`；真正追加图片是在 `common.osg.uploadToQiniu()` 中按 `signForm.show` 写入 `signForm.formData`。如果后续要对补充签约信息做严格限制，必须区分数据容器。

## 同步策略

`business_jishi` 存在相似文件：

- `business_jishi/subpackages/serviceAppointment/serviceAppointment.vue`

同步策略：

- 不做整文件复制。
- 只同步 helper 和相关 `max-count` 表达式。
- 同步前逐段对比目标文件上下文。
- 同步后单独记录 `business_jishi` 验证状态。

## 风险点

- `van-uploader` 的 `max-count` 如果传 `undefined` 在目标运行端不兼容，需要验证。
- 如果 `undefined` 不兼容，可以退而使用足够大的数，并在文档中标注这不是业务限制。
- `frontEndConfig.max == 0` 目前在部分模板表达式里可能被当成显式限制值，方案实施时要统一解释为“不限”。
- 不能影响已有显式配置了 `frontEndConfig.max > 0` 的字段。
- `repairPhotos`、`warrantyPhotos` 会进入合同 PDF 生成。当前后端模板盖图逻辑只稳定覆盖 4 张维修图和 2 张质保图；放开到 8 前必须完成合同模板生成适配。

## 验证计划

- 合同 PDF：按 `business/docs/service-appointment-signform-photo-template-impact.md` 的样本清单生成并检查图片排版。
- 微信小程序：确认当前维修部位图片、质保部位图片都显示 `0 / 8`。
- 分别上传 8 张可成功；第 9 张应被明确提示阻断。
- 未配置 `frontEndConfig.max` 的文件字段，连续选择超过 20 张图片，不应被前端默认 20 张限制阻断。
- App：同一规则下验证上传、提交、反显。
- 相册回填、删除、提交到 `basic/order/orderConfirm` 的数据格式保持不变。
- 重新进入工单详情，确认补充签约信息图片可正常反显。
