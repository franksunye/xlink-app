<template>
  <view class="account">
    <!-- https://pub.fsgo365.cn/5657901710334969385.jpg -->
    <image
      mode="widthFix"
      style="width: 100%"
      :src="'https://pub.fsgo365.cn/xlbbtuiguangguize.jpg'"
    />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      systemInfo: {
        menuButtonObject: {}
      },
      myIncomeData: {}
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    common.osg.codeoption(() => {});
  },
  onShow() {},
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 10px;
  color: #fff;
}
</style>
