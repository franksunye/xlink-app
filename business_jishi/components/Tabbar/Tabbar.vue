<template>
  <view>
    <van-tabbar
      :active="active"
      fixed
      :placeholder="true"
      active-color="#323333"
      inactive-color="#b9b9b9"
    >
      <!--  :info="item.text === '消息' ? index : undefined" -->
      <van-tabbar-item
        v-for="(item, index) in tabbarList"
        :key="index"
        @click="onChange('/' + item.pagePath, index)"
      >
        <image
          slot="icon"
          :src="item.iconPath"
          mode="aspectFit"
          style="width: 27px; height: 27px"
        />
        <image
          slot="icon-active"
          :src="item.selectedIconPath"
          mode="aspectFit"
          style="width: 27px; height: 27px"
        />
        {{ item.text }}
      </van-tabbar-item>
    </van-tabbar>
    <app-upgrade ref="appUpgrade" />
  </view>
</template>

<script>
var common = require('../../resources/js/common.js');
import { mapState, mapMutations } from 'vuex';
import AppUpgrade from '../AppUpgrade/AppUpgrade.vue';
export default {
  components: {
    AppUpgrade
  },
  props: {
    // 接收父组件传入的 pagesRouter 数据
    // lll: {
    //   type: Array // 类型可以根据实际需要设为 String, Number, Object, Array 等
    // }
  },
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  },
  data() {
    return {};
  },
  mounted() {
    wx.hideTabBar();
    // #ifdef APP-PLUS
    common.osg.pushEvent(); // 监听消息推送并自动跳转
    this.$refs.appUpgrade.checkWgt(); // 检查App版本更新
    // #endif
  },
  computed: {
    ...mapState(['active', 'tabbarList'])
  },
  methods: {
    ...mapMutations(['updatAactive']),
    onChange(url, index) {
      //工单列表单独处理 拿节点
      // if (url === '/pages/serviceAppointment/serviceAppointments') {
      //   console.log('Tabbar.vue onChange', index);
      //   let currentRoleFunctions = wx.getStorageSync('currentRoleFunctions');
      //   const itemWithTabDisplay = this.findItemByTabDisplay(currentRoleFunctions, '1');
      //   if (itemWithTabDisplay) {
      //     console.log('找到符合条件的项目:', itemWithTabDisplay);
      //     wx.setStorageSync('Tabs', itemWithTabDisplay);
      //   } else {
      //     console.log('没有找到的项目。');
      //   }
      // }
      //更新方法
      this.updatAactive(index);
      uni.switchTab({ url });
    }
    // 递归查找目标对象
    //找到符合条件的项目 exts.tabDisplay 的值
    // findItemByTabDisplay(items, tabDisplayValue) {
    //   let results = [];
    //   for (let item of items) {
    //     // 检查是否有 `exts` 并且 `exts.tabDisplay` 符合指定值
    //     if (item.exts && item.exts.tabDisplay === tabDisplayValue) {
    //       results.push(item);
    //     }
    //     // 如果当前项目有子项，递归查找子项
    //     if (item.functionList && item.functionList.length > 0) {
    //       results = results.concat(this.findItemByTabDisplay(item.functionList, tabDisplayValue));
    //     }
    //   }
    //   results.sort((a, b) => a.order - b.order);
    //   return results; // 如果没有找到符合条件的项目，返回 null
    // }
  }
};
</script>

<style lang="scss">
::v-deep .van-tabbar {
  height: 70px !important;
  position: fixed !important;
}
</style>
