<template>
  <view class="web">
    <web-view :src="weburl" style="width: 100%; height: auto"></web-view>
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
    if (weburl.indexOf('$province') != -1) {
      let user = wx.getStorageSync('user');
      if (user.province) {
        weburl = weburl.replace('$province', user.province);
      }
    }
    weburl += `tenantId=${wx.getStorageSync('user').tenantId}&access_token_h5=${wx.getStorageSync(
      'sessionId'
    )}`;
    this.weburl = weburl;
    console.log('webview:' + weburl);
  },
  onReady() {
    this.clearMuiBack();
  },
  methods: {
    // 关闭mui返回
    clearMuiBack() {
      // #ifdef APP-PLUS
      var currentWebview = this.$scope.$getAppWebview().children()[0];
      console.log('currentWebview:', currentWebview);
      //监听注入的js
      currentWebview.addEventListener('loaded', function () {
        // currentWebview.evalJS('mui.init({keyEventBind: {backbutton: true }});');
        currentWebview.evalJS(`
       mui.init({
         keyEventBind: {
           backbutton: true
         }
       });
       mui.back = function() {
        uni.navigateBack();
         // 这里可以添加自定义的返回逻辑
       };
     `);
      });
      // #endif
    }
  }
};
</script>

<style lang="scss">
.web {
  width: 100vw;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fdfdfd;
  overflow-x: hidden;
}
</style>
