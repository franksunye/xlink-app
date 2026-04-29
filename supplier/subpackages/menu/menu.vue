<template>
  <view class="menu">
    <!-- 功能导航 -->
    <van-grid v-if="functionList.length > 0" :border="true" square clickable column-num="3">
      <block v-for="(item, index) in functionList" :key="index">
        <van-grid-item
          @click="gridClick(item, $event)"
          :icon="item.code"
          :link-type="item.openType"
          :url="item.action"
          :text="item.name"
          :badge="statusMap[item._id]"
          :style="'color:' + item.color"
        />
      </block>
    </van-grid>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      functionList: []
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.functionList = wx.getStorageSync('menu');
  },
  methods: {
    gridClick(func) {
      app.globalData.funcId = func._id;
    }
  }
};
</script>

<style lang="scss"></style>
