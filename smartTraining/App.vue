<script>
// 解决微信小程序不支持TextEncoder/TextDecoder对象
require('./resources/js/EncoderDecoderTogether.min.js');
export default {
  onLaunch: function (params) {},
  onShow: function () {},
  onHide: function () {}
};
</script>

<style lang="scss">
@import './app.css';
@import './static/font/iconfont.css';
// @import './static/font/iconfont2.css';
/*每个页面公共css */
@import '@/uni_modules/uni-scss/index.scss';
/* #ifndef APP-NVUE */
@import '@/static/customicons.css';
// 设置整个项目的背景色
page {
  background-color: #f5f5f5;
}

/* #endif */
.example-info {
  font-size: 14px;
  color: #333;
  padding: 10px;
}
</style>
