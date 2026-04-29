<template>
  <view class="setting" @click.capture="track">
    <van-cell-group inset :border="false" custom-class="c-cell-group">
      <van-cell
        title="查看隐私政策"
        is-link
        @click="
          doOpen('../web/web', {
            url: 'https://pub.fsgo365.cn/privacyAgreement.html'
          })
        "
      />
      <van-cell
        title="查看用户协议"
        is-link
        @click="
          doOpen('../web/web', {
            url: 'https://pub.fsgo365.cn/userAgreement.html'
          })
        "
      />
      <van-cell title="修改密码" is-link @click="doOpen('./changePassword')" />
      <!-- #ifdef MP-WEIXIN -->
      <van-cell title="修改手机号" is-link @click="doOpen('./changePhone')" />
      <!-- #endif -->
      <van-cell title="注销账号" is-link @click="signOut()" />
      <van-cell title="退出登录" is-link :border="false" @click="logOut()" />
    </van-cell-group>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
import { mapMutations } from 'vuex';
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {};
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
  },
  methods: {
    ...mapMutations(['updatTabbarList']),

    // 路由跳转
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    // 注销账号
    signOut() {
      common.osg.confirm(
        '您正在申请注销XLink修链服务商端账号，注销前我们将对以下信息进行审核，以保证您的账号安全：账号当前为有效状态、账号内无未完成的订单。申请注销即表示您自愿放弃账号内所有虚拟资产；账号注销后，与您相关的个人信息、第三方账号信息、关联订单相关信息、虚拟资产都将被清空；',
        () => {
          wx.showLoading({
            title: '处理中...'
          });
          setTimeout(() => {
            wx.hideLoading();
            common.osg.alert('已收到您的账号注销申请，我们将会在24小时内处理您的注销申请！');
          }, 1000);
        },
        {
          confirmText: '确认注销',
          confirmColor: '#d6000f',
          cancelText: '继续使用',
          cancelColor: '#106cff'
        }
      );
    },
    // 退出登录
    logOut() {
      wx.removeStorageSync('sessionId');
      wx.removeStorageSync('user');
      wx.removeStorageSync('currentRole');
      wx.removeStorageSync('currentRoleFunctions');
      common.osg.open('/pages/index/index', null, { mode: 'reLaunch' });

      //更新tabbar 列表
      this.updatTabbarList();
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
