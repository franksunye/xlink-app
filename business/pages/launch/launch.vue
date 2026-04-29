<template>
  <view class="launch" @click.capture="track">
    <image style="width: 75vw" mode="widthFix" src="https://pub.fsgo365.cn/launch-logo.png" />
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
  background-image: url('https://pub.fsgo365.cn/launch.png');
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
