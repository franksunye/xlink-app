# 图片上传前压缩技术方案

最后更新：2026-05-08

## 背景

目标：图片上传前做合理压缩，提升上传性能，降低大图上传耗时和失败率。

本方案只讨论上传前压缩，不包含工单详情补充签约信息的上传数量调整。

## 代码现状

全局上传入口：

- `business/resources/js/common.js`
- `common.osg.afterRead(event, that, longitude, latitude, callback)`
- `common.osg.fileUpToken(...)`
- `common.osg.uploadToQiniu(...)`

工单详情调用入口：

- `business/subpackages/serviceAppointment/serviceAppointment.vue`
- 页面 `afterRead()` 完成字段数量和特殊业务校验后，调用 `common.osg.afterRead()`。

同源同步候选：

- `business_jishi/resources/js/common.js`

## 上传流程现状

当前流程：

1. `van-uploader` 触发 `after-read`。
2. 页面 `afterRead()` 做字段数量和特殊业务校验。
3. 调用 `common.osg.afterRead()`。
4. `common.osg.fileUpToken()` 获取七牛 token。
5. `common.osg.uploadToQiniu()` 直接用本地 `filePath` 调 `wx.uploadFile()`。
6. 成功后拼接 `!convert.jpg`。

结论：

- 当前业务主链路没有统一、可控的上传前压缩 helper，也没有直接调用 `wx.compressImage` / `uni.compressImage`。
- 但选图层已经把 `sizeType: ['original', 'compressed']` 传给微信/运行端 API，因此 App、iOS、Android、小程序拿到的临时文件可能已经是平台压缩后的版本。
- 上传层没有再压缩：`common.js` 直接把选图 API 返回的临时 `filePath` 上传七牛。
- `!convert.jpg` 是下载侧转换参数，不减少选图临时文件到上传七牛之前的本地体积。
- 因此，当前生产扫描结果只能说明“七牛可访问对象/下载侧图片”的体积分布，不能直接等同于“用户手机原始相机图”或“上传瞬间真实上行字节”。

### 现有压缩/瘦身机制澄清

这次追加代码核查后，现有链路可以分成三层：

1. 选图层：`business/wxcomponents/vant/uploader/shared.js` 默认 `sizeType: ['original', 'compressed']`，并在 `utils.js` 中透传给 `wx.chooseImage()` / `wx.chooseMedia()`。这意味着微信/运行端可能返回压缩后的临时文件。生产样本大部分不大的现象，更可能主要来自这一层。
2. 上传层：`business/resources/js/common.js` 的 `uploadToQiniu()` 仍然直接使用传入的临时 `filePath` 调 `wx.uploadFile()`。这里没有二次压缩、尺寸限制、体积对比和失败回退策略。
3. 下载/存储访问层：七牛 URL 返回头可见 `IMAGESLIM` / `x-slim-origin`，并且业务保存/反显常拼接 `!convert.jpg`。这会显著降低反显下载体积，但不等价于业务端已经做了上传前压缩。

所以，更准确的结论是：

- 代码里已有“平台选图压缩候选”和“七牛下载侧/访问侧瘦身”。
- 代码里还没有我们要新增的“统一上传前压缩策略”：明确尺寸、质量、阈值、压缩后更小才替换、失败回退原临时文件。
- 极少数大于 1MB 的生产图片，不能证明业务代码已经做了统一压缩；它更可能是平台选图默认行为、七牛瘦身、历史服务端图片处理共同作用后的结果。

为了衡量真实上传性能，后续实施前还需要补一个上传端验证：在测试包里记录 `after-read` 阶段拿到的 `file.size` / `file.url` 临时文件大小，再记录压缩后临时文件大小和 `wx.uploadFile()` 耗时。这个数据才是“上传速度提升多少”的直接证据。

## 生产基线调研

可以调研，但要把数据来源分成三层：

1. Beta/生产业务样本：先从 Beta 只读 API 抽取订单图片 URL，验证采样脚本和指标口径；再用生产只读 API 做最终确认。
2. 对象存储样本：对图片 URL 做 HEAD/下载采样，统计七牛可访问对象大小、下载侧 `!convert.jpg` 大小、尺寸、格式。
3. 本地压缩样本：对同一批七牛可访问对象用候选压缩参数跑本地压缩，估算压缩收益上限。

当前已有证据：

- 生产 host 在本地代码中存在：`https://xlink.fsgo365.cn`。
- 现有 `cloud_ui/scripts/api_smoke.py` 默认只支持 Beta：`https://xlinkbeta.fsgo365.cn`。
- Beta 环境同样使用七牛图片域名 `https://pub.fsgo365.cn`，可先作为低风险样本来源。
- Beta 样本 `order-sample.json` 已包含目标字段形态：
  - `exts.repairPhotos`
  - `exts.warrantyPhotos`
- 样本 URL 使用 `https://pub.fsgo365.cn/{key}.jpg!convert.jpg`。
- 抽样验证：同一张图去掉 `!convert.jpg` 后，七牛可访问对象约 `1084x2412 / 132KB`；带 `!convert.jpg` 的下载图约 `449x1000 / 44KB`。

这说明目前下载侧已有七牛瘦身能力。上传侧会把选图 API 返回的本地临时文件直接传到七牛；这个临时文件可能已经被平台压缩，但不是业务代码可控的压缩结果。上传前压缩的目标应该按“本地临时文件上传体积”来定，而不是按用户最终看到的 `!convert.jpg` 下载体积来定。

### 只读采样方案

建议补一个只读统计脚本，放在维护资产目录，默认不写业务数据、不改业务数据。

输入：

- 环境：`beta` / `prod`，默认 `beta`
- 只读账号或已有 token
- 采样范围：最近 N 天或最近 N 条订单
- 目标字段：
  - `basic/order/query.do` 的 `exts.repairPhotos`
  - `basic/order/query.do` 的 `exts.warrantyPhotos`
  - 可选：`mediaContent`、动态表单 file 字段、工序步骤图片

输出：

- URL 数量、去重 URL 数量。
- 七牛可访问对象字节数：去掉 `!convert.jpg` 后的 HEAD `Content-Length`。
- 下载图字节数：保留 `!convert.jpg` 后的 HEAD `Content-Length`。
- 七牛可访问对象尺寸、下载图尺寸：必要时下载图片后读取元数据。
- 估算压缩后字节数：使用候选压缩策略本地压缩后统计。
- P50 / P75 / P90 / P95 / max。

建议样本规模：

- 第一轮：Beta 最近 30 天或最近 200 张图片，用来验证 URL 提取、HEAD、尺寸读取、压缩对比和耗时估算。
- 第二轮：生产最近 7 天，最多 200 张图片，用来确认 Beta 结论是否适用于真实用户上传分布。
- 第三轮：生产最近 30 天，最多 1000 张图片，用来固化最终压缩目标。
- 每个字段分别统计，避免维修部位图片和质保部位图片混在一起。

### 指标口径

需要同时记录五个口径：

- `selected_file_bytes`：用户选图后、上传前，本地临时文件真实大小；这是上传性能评估的核心口径，需要在测试包或本地调试中采集。
- `original_bytes`：去掉 `!convert.jpg` 后七牛可访问对象的响应体大小；受七牛瘦身/CDN 影响，不能直接等同于手机原始图或上传瞬间字节。
- `download_bytes`：`!convert.jpg` 下载侧大小，代表用户预览/反显成本。
- `compressed_bytes`：客户端候选压缩后的上传体积。
- `upload_time_estimate`：按弱网/普通网速估算上传耗时。

建议网络估算：

- 弱网：0.5 Mbps 上行。
- 普通移动网络：2 Mbps 上行。
- 较好网络：5 Mbps 上行。

估算公式：

```text
upload_seconds = bytes * 8 / uplink_bps
```

最终要回答的问题：

- P90 上传前本地临时文件有多大？
- P90 七牛可访问对象有多大？
- 当前 `!convert.jpg` 下载侧已经压到什么程度？
- 上传前压缩后，P90 上传体积能下降多少？
- 单张图在 0.5 Mbps / 2 Mbps 上行下分别能省多少秒？
- 多图场景，例如 10 张、20 张，整体能省多少上传时间？

### 实施目标建议

当前已经完成 Beta/生产七牛对象样本扫描，但还没有完成真机上传端 `after-read` 临时文件采样。因此实施目标需要分两层：

对象样本层目标：

- 候选参数先用长边 `1000px`、`quality: 70`。
- 压缩后必须小于原对象才替换。
- 原对象低于 `150KB` 时默认不强制压缩，除非压缩后至少小 `10%`。
- 以生产 200 张样本为参考，条件替换后总体对象字节下降约 `42.0%`，可作为方案收益上限参考。

上传端目标：

- 先在真机测试包采集 `after-read` 临时文件大小和上传耗时。
- 如果临时文件 P90 已经低于 `300KB`，首轮压缩目标应偏保守，重点处理异常大图和跨端一致性。
- 如果临时文件仍存在大量 MB 级图片，再启用更强的压缩参数或强制压缩图策略。
- 最终收益以 `selected_file_bytes` 和 `wx.uploadFile()` 耗时为准，而不是以七牛访问 URL 的 `Content-Length` 为准。

### Beta 小样本结果

已补只读基线脚本：

- `business/scripts/image_upload_baseline.py`

已跑 Beta 小样本：

- 订单数：20
- 图片数：40
- 采样字段：`repairPhotos`、`warrantyPhotos`、其他订单内七牛图片 URL
- 候选参数：长边 `1000px`，质量 `70`
- 输出：
  - `business/tmp/image_upload_baseline_edge1000_q70/beta_image_upload_baseline.json`
  - `business/tmp/image_upload_baseline_edge1000_q70/beta_image_upload_baseline.md`

复跑命令：

```bash
python3 business/scripts/image_upload_baseline.py --env beta --rows 20 --pages 12 --max-images 40 --max-edge 1000 --quality 70 --out-dir business/tmp/image_upload_baseline_edge1000_q70
```

总体结果：

| 指标 | P50 | P90 | max | avg |
| --- | ---: | ---: | ---: | ---: |
| 七牛可访问对象体积 | 53,730 B | 135,144 B | 382,958 B | 72,711.7 B |
| `!convert.jpg` 下载体积 | 53,645 B | 53,645 B | 134,855 B | 47,489.7 B |
| 候选压缩体积 | 122,377 B | 122,377 B | 193,412 B | 104,947.1 B |
| 条件替换后体积 | 53,730 B | 65,461 B | 193,412 B | 57,166.1 B |

关键结论：

- 不能无条件压缩后替换。当前 Beta 样本里很多图片已经很小，直接重压缩会变大。
- 采用“压缩后更小才替换原对象”的策略时，40 张中 9 张受益，总体对象体积从 `2,908,469 B` 降到 `2,286,643 B`，下降 `21.4%`。
- P90 体积从 `135,144 B` 降到 `65,461 B`。
- 按 P90 估算，0.5 Mbps 上行单图节省约 `1.11s`，2 Mbps 上行单图节省约 `0.28s`。
- `repairPhotos` / `warrantyPhotos` 的 Beta 样本体积整体不大，收益主要来自少量较大的图；生产样本仍需要确认是否有更多大图。
- 这个 Beta 分布和真实智能手机相机常见的几 MB 原始照片不一致，因此不能用 Beta 小样本代替生产决策。必须结合生产对象样本和真机上传端样本后再定压缩策略。

据此，实施目标应调整为：

- 第一原则：压缩结果必须小于选图临时文件才替换上传路径。
- 推荐候选参数先从长边 `1000px`、质量 `70` 开始，而不是 `1600px`、质量 `80`。
- 增加保护阈值：选图临时文件低于某个体积，例如 `150KB`，可以先跳过压缩，或压缩后必须至少小 `10%` 才替换。
- 真机上传端确认前，不把“P90 降低 50%”作为硬目标；更合理的首轮目标是整体上传字节下降 `20%+` 且不增加任何单图上传体积。

### 生产扫描命令

脚本已加保护：`--env prod` 不会使用 Beta 默认账号，必须显式传生产只读账号/验证码，或设置环境变量。

如果生产账号走 `cloud_ui` PC 登录，登录接口会要求图形验证码。不要在脚本里绕过验证码；推荐先在浏览器正常登录生产后台，然后使用已登录会话的 `x-auth-token` / Cookie 做只读扫描。

已登录会话扫描命令：

```bash
XLINK_AUTH_TOKEN="浏览器里的 x-auth-token" \
XLINK_COOKIE="浏览器请求里的 Cookie，可选但建议带上" \
python3 business/scripts/image_upload_baseline.py \
  --env prod \
  --rows 20 \
  --pages 20 \
  --max-images 200 \
  --max-edge 1000 \
  --quality 70 \
  --out-dir business/tmp/image_upload_baseline_prod_edge1000_q70
```

推荐命令：

```bash
XLINK_PROD_PHONE="生产只读账号手机号" \
XLINK_PROD_PWD="生产验证码或密码" \
python3 business/scripts/image_upload_baseline.py \
  --env prod \
  --rows 20 \
  --pages 20 \
  --max-images 200 \
  --max-edge 1000 \
  --quality 70 \
  --out-dir business/tmp/image_upload_baseline_prod_edge1000_q70
```

如果要先跑更小样本：

```bash
XLINK_PROD_PHONE="生产只读账号手机号" \
XLINK_PROD_PWD="生产验证码或密码" \
python3 business/scripts/image_upload_baseline.py \
  --env prod \
  --rows 10 \
  --pages 5 \
  --max-images 50 \
  --max-edge 1000 \
  --quality 70 \
  --out-dir business/tmp/image_upload_baseline_prod_smoke
```

### 生产样本结果

已用已登录生产会话完成生产只读扫描：

- 订单数：120
- 图片数：200
- 候选参数：长边 `1000px`，质量 `70`
- 输出：
  - `business/tmp/image_upload_baseline_prod_edge1000_q70/prod_image_upload_baseline.json`
  - `business/tmp/image_upload_baseline_prod_edge1000_q70/prod_image_upload_baseline.md`

总体结果：

| 指标 | P50 | P75 | P90 | P95 | max | avg |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 七牛可访问对象体积 | 131,274 B | 198,822 B | 296,414 B | 364,021 B | 5,982,633 B | 199,414.2 B |
| `!convert.jpg` 下载体积 | 59,427 B | 92,144 B | 129,262 B | 157,749 B | 191,575 B | 69,653.3 B |
| 候选压缩体积 | 112,896 B | 149,551 B | 201,154 B | 265,420 B | 307,304 B | 122,941.2 B |
| 条件替换后体积 | 99,513 B | 149,551 B | 201,154 B | 265,420 B | 307,304 B | 115,724.3 B |

图片大小分布：

- `>= 500KB`：8 / 200
- `>= 1MB`：3 / 200
- 最大可访问对象：`5,982,633 B`，尺寸 `5000x5000`
- `repairPhotos` 最大：`699,586 B`
- `warrantyPhotos` 最大：`699,586 B`

条件压缩收益：

- 200 张中 128 张压缩后更小。
- 总对象体积从 `39,882,832 B` 降到 `23,144,851 B`。
- 总体下降 `42.0%`。
- P90 从 `296,414 B` 降到 `201,154 B`。
- 如果上传端临时文件大小接近该对象体积，则 0.5 Mbps 上行下，P90 单图约节省 `1.52s`；2 Mbps 上行下约节省 `0.39s`。这仍需真机 `after-read` 采样确认。

生产结论：

- 生产七牛可访问对象里确实存在少量 MB 级图片，但不是主流分布；主流对象在 100KB 到 300KB 区间。
- 即使如此，条件压缩仍有明确对象体积收益，主要来自中大图和少量异常大图。
- 必须保留“压缩后更小才替换”的策略，否则小图重压缩仍可能倒退。
- 对 `repairPhotos` / `warrantyPhotos`，P90 可访问对象约 293KB/297KB，条件压缩后约 217KB/265KB；收益存在但不如异常 PNG/其他图明显。
- 上传性能优化可以进入上传端验证和实施准备，但不应只依赖压缩；多图上传数量、并发和 token 获取也应继续作为后续优化项。

### 七牛 `fs-go` 全空间清单结果

为避免业务 API 抽样偏小，已用七牛 `qshell listbucket2` 对生产空间 `fs-go` 做 2024-2025 图片对象清单扫描。

扫描命令口径：

```bash
qshell listbucket2 \
  --start 2024-01-01-00-00-00 \
  --end 2026-01-01-00-00-00 \
  --mimetypes 'image/*' \
  --show-fields Key,FileSize,PutTime,MimeType \
  --output-file-max-lines 500000 \
  fs-go \
  -o business/tmp/qiniu_fs_go_scan/images_2024_2025.tsv
```

输出文件：

- `business/tmp/qiniu_fs_go_scan/images_2024_2025-0.tsv`
- `business/tmp/qiniu_fs_go_scan/images_2024_2025-1.tsv`
- `business/tmp/qiniu_fs_go_scan/images_2024_2025_stats.json`
- `business/tmp/qiniu_fs_go_scan/images_2024_2025_stats.md`

统计脚本：

- `business/scripts/qiniu_image_inventory_stats.py`

总体结果：

| 指标 | 值 |
| --- | ---: |
| 图片对象数 | 523,006 |
| 总体积 | 448.2 GB |
| 平均 | 898.6 KB |
| P50 | 194.9 KB |
| P75 | 661.0 KB |
| P90 | 2.4 MB |
| P95 | 3.9 MB |
| P99 | 13.8 MB |
| 最大 | 45.1 MB |

体积分布：

| 区间 | 数量 | 占比 |
| --- | ---: | ---: |
| `<100KB` | 185,913 | 35.5% |
| `100KB-300KB` | 128,765 | 24.6% |
| `300KB-500KB` | 56,695 | 10.8% |
| `500KB-1MB` | 42,793 | 8.2% |
| `1MB-2MB` | 41,824 | 8.0% |
| `2MB-5MB` | 51,919 | 9.9% |
| `>=5MB` | 15,097 | 2.9% |

按年份：

| 年份 | 数量 | P50 | P90 | P95 | 最大 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2024 | 244,179 | 148.1 KB | 2.8 MB | 4.2 MB | 45.1 MB |
| 2025 | 278,827 | 208.2 KB | 2.1 MB | 3.8 MB | 30.3 MB |

按 MIME 看，`image/jpeg` 是主要对象类型，数量 `463,442`，P90 约 `1.75MB`；`image/png` 数量 `57,874`，P90 约 `10.1MB`，大图主要集中在 PNG。

这个结果修正了前面的业务 API 抽样判断：

- 工单业务字段抽样偏小，只能代表当前抽到的工单图片，不代表整个生产 bucket。
- `fs-go` 空间在 App 发布后的 2024-2025 年确实存在大量 MB 级图片对象。
- 如果这些对象主要来自 App/移动端上传，则只依赖平台选图默认压缩不足以控制上传体积。
- 首轮压缩策略应至少覆盖 JPEG/PNG 大图，并重点防止 PNG 大图原样上传。
- 仍需进一步把 bucket 对象和业务字段关联起来，否则全空间结果可能混入非工单、后台、历史工具或其他业务上传图片。

### 优先级判断

当前维护阶段以小程序为重点，图片压缩不作为紧急实施项。

原因：

- 小程序上传链路已经通过 `sizeType: ['original', 'compressed']` 利用平台选图压缩候选。
- 当前工单业务字段抽样里的 `repairPhotos` / `warrantyPhotos` 体积不大，直接阻塞小程序体验的证据不足。
- `fs-go` 全空间确实存在大量 MB 级图片，但还没有证明这些大图集中来自当前小程序工单上传路径。
- 改动 `business/resources/js/common.js` 会影响全局上传入口，回归面覆盖 App、小程序、多个页面和 `business_jishi` 同步，当前收益不足以支撑立即改动。

因此：

- 本任务从当前小程序阶段的 P0 实施项降级为 P2 观察/准备项。
- 保留 qshell 清单、统计脚本和技术方案，后续进入 App 上传体验优化、大图失败率治理、或确认小程序大图问题后再实施。
- 当前更优先处理“补充签约信息上传数量限制”这类明确业务阻塞项。

## 技术方案

推荐落点：`business/resources/js/common.js` 的全局上传入口。

新增 helper：

- `isUploadImageFile(file, filePath, event)`
- `compressImageBeforeUpload(filePath, fileInfo, callback)`
- `getUploadFilePath(...)` 可选，用于收敛当前 `thumb/url/path/tempFilePath` 取值。

推荐压缩策略：

- 只压缩图片；视频和非图片文件保持原路径。
- 微信小程序可以继续利用 `sizeType` 的平台压缩候选，同时在上传前增加体积判断；必要时再使用 `wx.compressImage` 做业务可控二次压缩。
- App/iOS/Android 侧当前没有业务压缩代码，优先验证 `uni.compressImage` 或 `wx.compressImage` 兼容调用；不可用时必须回退原临时文件。
- 压缩参数建议先从长边 `1000px`、`quality: 70` 验证。
- 压缩失败时回退原 `filePath` 上传。
- 压缩后如果不小于选图临时文件，继续上传原临时文件，避免性能倒退。
- 压缩后如果只小幅下降，例如不足 `10%`，可继续上传原临时文件，避免画质损失换不到明显收益。
- 不改变七牛回传 URL 数据结构，仍保持 `{ url, name, path, extname }`。

建议调用位置：

```text
common.osg.fileUpToken()
  -> 解析最终 filePath
  -> compressImageBeforeUpload()
  -> common.osg.uploadToQiniu()
```

这样可以覆盖工单详情内通过 `common.osg.afterRead()` 进入的上传路径，同时减少页面级重复实现。

## 第一阶段范围

建议第一阶段只覆盖通过 `common.osg.afterRead()` 进入的图片上传：

- 工单详情动态表单文件字段。
- 补充签约信息文件字段。
- 其他已复用 `common.osg.afterRead()` 的页面。

暂不处理：

- `canvasToTempFilePath()` 后的客户签字图。
- 工序步骤 `afterReadForStep()` 中直接 `wx.uploadFile()` 的独立路径。
- 施工记录 `recordsAfterRead()` 的独立上传路径。

这些路径可进入第二阶段，否则首轮改动会扩大回归面。

## 同步策略

`business_jishi` 存在相似文件：

- `business_jishi/resources/js/common.js`

同步策略：

- 不做整文件复制。
- 只同步压缩 helper 和 `fileUpToken()` 中的调用点。
- 同步前对比 `common.osg.afterRead()`、`fileUpToken()`、`uploadToQiniu()` 的差异。
- 同步后单独验证 `business_jishi` 的图片上传。

## 风险点

- `common.js` 是全局上传入口，改动会影响所有复用 `common.osg.afterRead()` 的上传场景。
- 压缩 helper 必须只影响图片，不能影响视频或普通文件。
- 多图上传是循环并发获取 token、上传；压缩后总耗时可能由 CPU 和上传网络共同决定。
- 压缩后的临时路径、扩展名和七牛 token 的 `fileName` 后缀要保持兼容。
- 弱网下仍需要保留现有上传失败重试和提示逻辑。

## 验证计划

- 微信小程序：上传大图，确认压缩后仍能成功上传并反显。
- App：上传大图，确认压缩 API 可用；如果不可用，应回退原临时文件上传。
- 视频或非图片文件字段，不应进入图片压缩。
- 断网/弱网：压缩失败或上传失败时仍显示原有失败提示和重试行为。
- 提交后检查数据格式：图片字段仍为 URL 或 URL 对象结构，不改变业务提交格式。

## 建议实施顺序

1. 先补 Beta 只读图片基线统计脚本，输出体积、尺寸、压缩后体积和上传耗时估算。
2. 用 Beta 样本确定候选压缩参数。
3. 用生产只读样本确认七牛可访问对象分布和候选收益。
4. 在测试包补上传端采样日志，确认 `after-read` 本地临时文件大小和真实上传耗时。
5. 在 `business/resources/js/common.js` 增加图片识别和压缩 helper。
6. 在 `fileUpToken()` 解析最终 `filePath` 后、调用 `uploadToQiniu()` 前接入压缩。
7. 保留压缩失败回退原临时文件上传。
8. 手工验证微信小程序和 App。
9. 按差异同步 `business_jishi/resources/js/common.js`。
