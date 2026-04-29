<template>
  <view class="launch" @click.capture="track">
    <image class="launch-img" mode="widthFix" src="https://pub.fsgo365.cn/jishi/launch.jpg" />
  </view>
</template>

<script>
const app = getApp();
import { mapState } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(['tabbarList'])
  },
  onLoad() {
    setTimeout(() => {
      wx.switchTab({
        url: '/' + (this.tabbarList[0] && this.tabbarList[0].pagePath) || '/pages/index/index'
      });
    }, 1500);
  }
};
</script>

<style lang="scss" scoped>
.launch {
  width: 100vw;
  height: 100vh;
  background-color: #fff0e8;
  position: relative;
  overflow: hidden;
}

.launch-img {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: auto;
  display: block;
}
</style>
