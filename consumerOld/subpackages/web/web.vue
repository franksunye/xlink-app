<template>
  <view class="web">
    <web-view :src="weburl"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      weburl: ''
    };
  },
  onLoad(param) {
    let weburl = decodeURIComponent(param.url);
    if (weburl.indexOf('?') == -1) {
      weburl += '?';
    } else {
      weburl += '&';
    }
    weburl += `tenantId=${
      wx.getStorageSync('_currentUser').user.tenantId
    }&access_token_h5=${wx.getStorageSync('sessionId')}`;
    this.weburl = weburl;
    console.log('webview:' + weburl);
  },
  methods: {}
};
</script>

<style lang="scss">
.web {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fdfdfd;
  overflow-x: hidden;
}
</style>
