<template>
  <view class="setting">
    <van-cell-group inset :border="false" custom-class="c-cell-group">
      <!-- <van-cell title="修改密码" is-link @click="doOpen('./changePassword')" /> -->
      <van-cell title="退出登录" is-link :border="false" @click="logOut()" />
    </van-cell-group>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {};
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
  },
  methods: {
    // 路由跳转
    doOpen(path) {
      common.osg.open(path);
    },
    // 退出登录
    logOut() {
      wx.removeStorageSync('sessionId');
      wx.removeStorageSync('user');
      wx.removeStorageSync('currentRole');
      wx.removeStorageSync('currentRoleFunctions');
      common.osg.open('/pages/index/index', null, { mode: 'reLaunch' });
    }
  }
};
</script>

<style lang="scss">
.setting {
  .c-cell-group {
    margin: 16px;
  }
}
</style>
