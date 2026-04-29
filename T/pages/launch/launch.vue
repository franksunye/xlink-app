<template>
  <view class="launch">
    <image style="width: 100vw; height: 100vh" src="../../static/images/launch.png" />
    <view class="launch-logo">
      <image
        :style="
          'width: 226px; height: 231.5px;margin-top:' + systemInfo.windowHeight * 0.282 + 'px'
        "
        src="../../static/images/launch-logo.png"
      />
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      systemInfo: {}
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.systemInfo = app.globalData.systemInfo;
    let timer = setTimeout(() => {
      clearTimeout(timer);
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 2000);
  },
  methods: {}
};
</script>

<style lang="scss">
.launch {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  .launch-logo {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    text-align: center;
  }
}
</style>
