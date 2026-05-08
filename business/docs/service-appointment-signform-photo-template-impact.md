# 补充签约信息图片数量对合同模板生成的影响

最后更新：2026-05-08

## 结论

`维修部位图片`、`质保部位图片`如果从当前 `2/4` 张调整到最多 `8` 张，会影响合同 PDF 生成。

不能只改字段配置里的 `frontEndConfig.max = 8`。当前后端合同生成逻辑会读取这两个字段并把图片盖到合同模板的固定位置，但现有排版只显式支持：

- `warrantyPhotos`：最多渲染前 `2` 张。
- `repairPhotos`：只定义了前 `4` 张的位置。

因此，如果前端允许上传 8 张：

- 订单扩展字段可以保存 8 张图片 URL。
- 合同生成时，`warrantyPhotos` 第 3-8 张不会出现在 PDF。
- `repairPhotos` 第 5-8 张没有明确坐标，存在重叠、默认位置异常或 PDF 生成不可控的风险。

## 数据链路

前端入口：

- `business/subpackages/serviceAppointment/serviceAppointment.vue`

链路：

1. 补充签约信息通过 `getOrderFields()` 拉取 `order` 扩展字段配置。
2. 文件字段通过动态表单渲染，提交前把图片数组转换为逗号分隔 URL。
3. `signFormSubmit()` 调用 `basic/order/orderConfirm`。
4. 后端 `OrderController.orderConfirm()` 把所有 `exts.*` 写入 `Order.exts`。
5. 后续合同生成读取 `Order.exts.repairPhotos` 和 `Order.exts.warrantyPhotos`，把图片写入合同 PDF。

关键后端文件：

- `/Users/yesun/Code/xlink/code/cloud/src/main/java/com/fsgo/modulemini/basic/OrderController.java`
- `/Users/yesun/Code/xlink/code/cloud/src/main/java/com/fsgo/service/basic/ContractServiceImpl.java`

## 合同模板选择

合同生成入口在 `ContractServiceImpl.transContractAndPDF()`。模板优先从 `Template` 表按 `tenantId + state = 1 + name` 查找，查不到才使用本地 PDF fallback。

### 数据库模板名称

`sourceType` 为 `1/2/5` 时，按合同类型映射：

| contractType | Template.name | 图片生成影响 |
| --- | --- | --- |
| `7` | `防水维修合同模板(雨虹)` | 受影响 |
| `8` | `防水维修清包服务合同(雨虹)` | 受影响 |
| `21` | `防水施工双包服务合同(雨虹)` | 当前 `createPhotos()` 跳过，不受这两个字段图片盖章影响 |
| `22` | `防水施工清包服务合同(雨虹)` | 受影响 |
| `30` | `闭水验收服务合同(雨虹)` | 受影响 |

`sourceType` 为 `4/8` 且 `serviceType = 40` 时：

| 场景 | Template.name | 图片生成影响 |
| --- | --- | --- |
| 刷新服务 | `刷新服务合同模板` | 当前 `createPhotos()` 跳过 `40`，不受这两个字段图片盖章影响 |

其他来源：

| 场景 | Template.name | 图片生成影响 |
| --- | --- | --- |
| 自有单 | `自有单合同模板(修链)` | 取决于合同类型；如果合同类型没有被 `createPhotos()` 跳过，则受影响 |

### 本地 fallback 模板文件

如果数据库没有可用模板，会回退到：

```text
/WEB-INF/template/contract{contractType}.pdf
```

当前仓库可见的相关本地文件：

| 文件 | 说明 |
| --- | --- |
| `/Users/yesun/Code/xlink/code/cloud/src/main/webapp/WEB-INF/template/contract7.pdf` | contractType 7 fallback |
| `/Users/yesun/Code/xlink/code/cloud/src/main/webapp/WEB-INF/template/contract8.pdf` | contractType 8 fallback |
| `/Users/yesun/Code/xlink/code/cloud/src/main/webapp/WEB-INF/template/contract21.pdf` | contractType 21 fallback，当前图片盖章跳过 |
| `/Users/yesun/Code/xlink/code/cloud/src/main/webapp/WEB-INF/template/contract22.pdf` | contractType 22 fallback |
| `/Users/yesun/Code/xlink/code/cloud/src/main/webapp/WEB-INF/template/contract11.pdf` | contractType 11 fallback，当前图片盖章跳过 |
| `/Users/yesun/Code/xlink/code/cloud/src/main/webapp/WEB-INF/template/xlink自有单合同模版.pdf` | 自有单模板资产，但当前 `transContractAndPDF()` fallback 不是直接按这个文件名取 |

同目录下的 `survey/勘查单...模板.pdf`、`inspectionAppointment/巡检单...模板.pdf` 属于勘查/巡检报告类模板，不是这次 `repairPhotos/warrantyPhotos` 合同图片盖章链路的直接模板。

## 当前排版逻辑

`ContractServiceImpl.createPhotos()`：

- 对 `contractType = 11/21/40` 直接跳过图片盖章。
- 其他合同类型读取：
  - `Order.exts.warrantyPhotos`
  - `Order.exts.repairPhotos`
- 图片统一盖到 PDF 的倒数第二页：`stamp.getOverContent(pdfReader.getNumberOfPages() - 1)`。

`createImage(warrantyPhotos, under, 480)`：

- 强制 `len = 2`。
- 每张图固定 `200 x 150`。
- 只会渲染前两张。

`createImage2(repairPhotos, under)`：

- 没有数量上限。
- 但只写了 `i = 0/1/2/3` 的坐标：
  - `(100, 280)`
  - `(320, 280)`
  - `(100, 90)`
  - `(320, 90)`
- `i >= 4` 时没有 `setAbsolutePosition()`，仍然执行 `under.addImage(img)`，这是放开到 8 张前必须处理的风险。

## 对“最多 8 张”的建议

如果产品目标是两个字段都最多 8 张，推荐先完成合同生成适配，再调整字段配置。

推荐方案：

1. 前端字段配置目标仍为：
   - `repairPhotos.frontEndConfig.max = 8`
   - `warrantyPhotos.frontEndConfig.max = 8`
2. 后端合同 PDF 不继续依赖最后一页固定坐标硬塞图片。
3. 为这两组照片增加“图片附页”生成逻辑：
   - 每页 2 列 x 2 行，最多 4 张。
   - 每组最多 8 张时，单组最多 2 页。
   - 标题区明确区分“维修部位图片”和“质保部位图片”。
   - 原合同模板主体不需要为更多图片预留空间，降低模板改版风险。
4. 生成样例 PDF 后，再变更动态字段配置到 8。

备选方案：

- 继续使用现有模板最后一页，但必须为 `repairPhotos` 和 `warrantyPhotos` 都补齐 8 张坐标，并确认所有受影响模板最后一页都有足够空间。
- 这个方案对模板版式依赖更强，不建议作为优先方案。

## 验证清单

放开到 8 张前，需要至少验证以下样本：

- contractType `7`：`0/2/4/8` 张维修部位图片，`0/2/4/8` 张质保部位图片。
- contractType `8`：同上。
- contractType `22`：同上。
- contractType `30`：同上。
- 自有单路径：至少选一个实际会走 `自有单合同模板(修链)` 且未被 `createPhotos()` 跳过的合同类型。
- contractType `11/21/40`：确认仍按当前规则跳过图片盖章，不因字段增量导致生成失败。

每个样本需要确认：

- 合同 PDF 生成成功。
- 图片不重叠、不丢失、不覆盖签章/签约字段。
- 契约锁签署流程不受影响。
- 七牛上传后的合同 URL 可预览。
- 重新打开工单详情，补充签约信息图片仍可反显。

## 当前决策建议

在合同生成适配完成前，不建议直接把生产字段配置改为 `8`。

短期可以先保持现有 `2/4` 限制，或只在测试环境把两个字段改成 `8` 做样例 PDF 验证。等合同 PDF 生成确认能稳定展示 8 张图片后，再切生产配置。
