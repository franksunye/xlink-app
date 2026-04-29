<template>
  <view class="menu" @click.capture="track">
    <!-- 功能导航 -->
    <van-grid
      v-if="functionList.length > 0"
      :border="false"
      square
      clickable
      column-num="4"
      icon-size="48px"
    >
      <block v-for="(item, index) in functionList" :key="index">
        <van-grid-item
          @click="gridClick(item, $event)"
          :icon="item.code"
          :link-type="item.openType"
          :url="
            item.action && item.action.indexOf('?') != -1
              ? item.action + '&t=' + new Date().getTime()
              : item.action + '?t=' + new Date().getTime()
          "
          :text="item.name"
          :badge="functionCount[item._id]"
          :style="'color:' + item.color"
          :data-event="{ id: 'T9hivs9_If' }"
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
      menuOrder: '', // 当前主菜单编号
      functionList: [],
      functionCount: {}
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    let menu = wx.getStorageSync('menu');
    wx.setNavigationBarTitle({
      title: menu.name
    });
    this.menuOrder = menu.order;
    let functionList = menu.functionList || [];
    functionList.map(item => {
      let url = item.action;
      if (url) {
        if (url.indexOf('?') != -1) {
          let paramsUrl = url.split('?')[1];
          let paramArr = paramsUrl.split('&');
          let params = {};
          paramArr.map(item => {
            params[item.split('=')[0]] = item.split('=')[1];
          });
          item.orderState = params.orderState;
          item.status = params.status || 'all';
          item.type = params.type || '';
        } else {
          item.status = 'all';
        }
      }
    });
    this.functionList = functionList;
  },
  onShow() {
    this.getFunctionCount();
  },
  methods: {
    gridClick(func) {
      app.globalData.funcId = func._id;
      common.osg.md({ path: this.menuOrder + '-' + func.order });
    },
    // 查询菜单角标数量
    getFunctionCount() {
      common.osg.ajax(
        '/function/dataCount',
        { functions: JSON.stringify(this.functionList) },
        res => {
          this.functionCount = res.data;
        },
        {
          noload: true
        }
      );
    }
  }
};
</script>

<style lang="scss">
.menu {
  height: 100vh;
  background-color: #fff;
  .van-grid-item {
    margin-top: 15px;
  }
  .van-grid-item__icon {
    padding: 5px;
  }
  .van-grid-item__text {
    height: 30px;
  }
  .van-icon--image {
    width: 48px;
    height: 48px;
  }
}
</style>
