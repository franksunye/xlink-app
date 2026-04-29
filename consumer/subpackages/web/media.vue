<template>
  <view>
    <video
      v-if="fileType == 'video'"
      class="c-w-1"
      id="myVideo"
      :src="'https://pub.fsgo365.cn/' + fileName"
      controls
      autoplay
    ></video>
    <image
      v-else
      :src="'https://pub.fsgo365.cn/' + fileName"
      mode="widthFix"
      style="width: 100vw; display: flex"
    />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      fileName: '',
      fileType: ''
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.fileName = params.fileName;
    this.fileType = params.fileType;
    uni.setNavigationBarTitle({
      title: decodeURIComponent(params.title)
    });
  }
};
</script>

<style></style>
