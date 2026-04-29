import { readFile, writeFile } from 'fs/promises';
import generateEventId from './generateEventId.js';

const updateFiles = async () => {
  try {
    // 1. business/subpackages/serviceAppointment/serviceAppointment.vue
    let content = await readFile(
      'business/subpackages/serviceAppointment/serviceAppointment.vue',
      'utf8'
    );

    // 生成所有需要的 ID
    const ids = await Promise.all(
      Array(36)
        .fill()
        .map(() => generateEventId())
    );
    let idIndex = 0;

    // 更精确的替换模式
    content = content
      // 支付状态点击
      .replace(
        /(<view\s+v-if="payment\.payState == 'paying' && payment\.qrval && payment\.obj\.payType != 'FUSION'"\s+class="c-flex c-flex-center c-red c-size-13 c-m-b-30"\s+@click="getPayStatus\(order\.row\._id, '已刷新收款码和支付金额'\)"\s*>)/g,
        `:data-event="{id:'${ids[idIndex++]}'}" $1`
      )
      // 渗漏原因左侧选择
      .replace(
        /(<view\s+v-for="\(item, i\) in leakageCauseSelect\.items"\s+:key="i"\s+:class="leakageCauseSelect\.mainActiveIndex == i \? 'c-tree-select-left-item-active' : ''"\s+@click="leakageCauseSelect\.mainActiveIndex = i"\s*>)/g,
        `:data-event="{id:'${ids[idIndex++]}'}" $1`
      )
      // 渗漏原因右侧选择
      .replace(
        /(<view\s+v-for="\(item, i\) in leakageCauseSelect\.items\[leakageCauseSelect\.mainActiveIndex\]\.children"\s+:key="i"\s+:class="\s*formData\.leakageCause && formData\.leakageCause\.indexOf\(item\.id\) != -1\s*\? 'c-tree-select-right-item-active'\s*: ''"\s+@click="\s*leakageCauseClickItem\(\{\s*detail:\s*\{\s*id: item\.id\s*\}\s*\}\)"\s*>)/g,
        `:data-event="{id:'${ids[idIndex++]}'}" $1`
      )
      // 备注项目左侧选择
      .replace(
        /(<view\s+v-for="\(item, i\) in noteItemsSelect\.items"\s+:key="i"\s+:class="noteItemsSelect\.mainActiveIndex == i \? 'c-tree-select-left-item-active' : ''"\s+@click="noteItemsSelect\.mainActiveIndex = i"\s*>)/g,
        `:data-event="{id:'${ids[idIndex++]}'}" $1`
      )
      // 备注项目右侧选择
      .replace(
        /(<view\s+v-for="\(item, i\) in noteItemsSelect\.items\[noteItemsSelect\.mainActiveIndex\]\.children"\s+:key="i"\s+:class="\s*formData\.noteItems && formData\.noteItems\.indexOf\(item\.id\) != -1\s*\? 'c-tree-select-right-item-active'\s*: ''"\s+@click="\s*noteItemsClickItem\(\{\s*detail:\s*\{\s*id: item\.id\s*\}\s*\}\)"\s*>)/g,
        `:data-event="{id:'${ids[idIndex++]}'}" $1`
      )
      // 维修部件选择
      .replace(
        /(<view\s+v-for="\(item, index\) in options\.repairPartsOne"\s+:key="index"\s+@click="\s*serviceGoods\.repairPart === item\.value\s*\? \$set\(serviceGoods, 'repairPart', ''\)\s*: \$set\(serviceGoods, 'repairPart', item\.value\)"\s+:class="\s*'c-selection-left-item ' \+\s*\(serviceGoods\.repairPart == item\.value \? 'c-bg-white c-left-icon-blue' : ''\)"\s*>)/g,
        `:data-event="{id:'${ids[idIndex++]}'}" $1`
      )
      // 各种按钮
      .replace(
        /(<van-button\s+type="info"\s+plain\s+slot="right"\s+@click="saveRemark"\s*>)/g,
        `<van-button :data-event="{id:'${
          ids[idIndex++]
        }'}" type="info" plain slot="right" @click="saveRemark">`
      )
      .replace(
        /(<van-button\s+type="info"\s+plain\s+slot="right"\s+@click="recordsSave"\s*>)/g,
        `<van-button :data-event="{id:'${
          ids[idIndex++]
        }'}" type="info" plain slot="right" @click="recordsSave">`
      )
      .replace(
        /(<van-button\s+plain\s+round\s+custom-style="width:100px;"\s+@click="reasonCancel"\s*>)/g,
        `<van-button :data-event="{id:'${
          ids[idIndex++]
        }'}" plain round custom-style="width:100px;" @click="reasonCancel">`
      )
      .replace(
        /(<van-button\s+type="info"\s+round\s+custom-style="width:100px;"\s+@click="reasonConfirm"\s*>)/g,
        `<van-button :data-event="{id:'${
          ids[idIndex++]
        }'}" type="info" round custom-style="width:100px;" @click="reasonConfirm">`
      )
      // 图片预览
      .replace(
        /(<image\s+:src="\(item\.exts\.images[^>]*?@click="previewImage[^>]*?>)/g,
        `<image :data-event="{id:'${ids[idIndex++]}'}" $1`
      )
      .replace(
        /(<image\s+style="width: 80px; height: 80px;[^>]*?@click="previewPhoto[^>]*?>)/g,
        `<image :data-event="{id:'${ids[idIndex++]}'}" $1`
      );

    await writeFile(
      'business/subpackages/serviceAppointment/serviceAppointment.vue',
      content,
      'utf8'
    );
    console.log('Updated serviceAppointment.vue');

    // 2. business/subpackages/serviceAppointment/logDetails.vue
    content = await readFile('business/subpackages/serviceAppointment/logDetails.vue', 'utf8');
    const processBoxId = await generateEventId();

    content = content.replace(
      /(<view\s+style="width: 90%; margin: 20rpx auto"\s+class="ProcessBox"\s+@click="\s*handleParentClick\(J\.procedure, I, items\.constructionLocation\)\s*"\s*>)/g,
      `<view :data-event="{id:'${processBoxId}'}" style="width: 90%; margin: 20rpx auto" class="ProcessBox" @click="handleParentClick(J.procedure, I, items.constructionLocation)">`
    );

    await writeFile('business/subpackages/serviceAppointment/logDetails.vue', content, 'utf8');
    console.log('Updated logDetails.vue');
  } catch (error) {
    console.error('Error:', error);
  }
};

updateFiles()
  .then(() => {
    console.log('All files updated successfully');
  })
  .catch(error => {
    console.error('Error updating files:', error);
  });
