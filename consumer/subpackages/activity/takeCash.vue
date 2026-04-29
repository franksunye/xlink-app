<template>
  <view class="takeCash">
    <!-- <view class="top">
      <image
        src="../../static/images/logo-white.png"
        mode="widthFix"
        style="width: 60px; display: flex"
      ></image>
      <view class="detailedRules">详细规则</view>
    </view> -->
    <image
      src="https://pub.fsgo365.cn/takeCash1.jpg"
      mode="widthFix"
      style="width: 100vw; display: flex"
    ></image>
    <button class="button" openType="share">立即分享</button>
    <image
      src="https://pub.fsgo365.cn/takeCash2.jpg"
      mode="widthFix"
      style="width: 100vw; display: flex"
    ></image>
    <view class="button" @click="open('../income/myRewards')">积分兑换</view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      userId: ''
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    common.osg.doLogin({}, () => {
      this.userId = wx.getStorageSync('user')._id;
    });
  },
  //设置分享的参数
  onShareAppMessage() {
    return {
      title: '修链房屋维修',
      path: `pages/declaration/declaration?cUserId=${this.userId}` //这里是被分享的人点击进来之后的页面
      // imageUrl: '../../images/icon-logo.png'//这里是图片的路径
    };
  },
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style lang="scss" scoped>
.takeCash {
  width: 100vw;
  background: linear-gradient(90deg, #f75429 0%, #eb2b1e 100%);
  padding-bottom: 30px;
  .top {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
    .detailedRules {
      width: 51px;
      height: 16px;
      border-radius: 50px;
      border: 1px solid #fff;
      text-align: center;
      color: #fff;
      font-size: 10px;
      position: absolute;
      right: 16px;
    }
  }
  .button {
    width: calc(100vw - 32px);
    margin: 0 16px;
    height: 44px;
    border-radius: 80px;
    background: linear-gradient(180deg, #fee479 0%, #fbc426 100%);
    color: #6c480f;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    line-height: 44px;
  }
}
</style>
