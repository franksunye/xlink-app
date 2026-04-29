<template>
  <view class="account">
    <view
      @click="navigateBack"
      :style="
        'position:absolute;z-index:1;top:' +
        systemInfo.statusBarHeight +
        'px;left:' +
        systemInfo.menuButtonObject.marginRight +
        'px;height:' +
        systemInfo.navHeight +
        'px;line-height:' +
        systemInfo.navHeight +
        'px;color:#fff;display:flex;align-items:center;font-weight:500;'
      "
    >
      <van-icon name="arrow-left" style="font-size: 20px; margin-right: 5px; position: absolute" />
      <text
        v-if="
          systemInfo.platform == 'ios' ||
          systemInfo.platform == 'mac' ||
          systemInfo.platform == 'devtools'
        "
        :style="
          'width:calc(100vw - ' +
          systemInfo.menuButtonObject.marginRight * 2 +
          'px);text-align:center'
        "
      >
        修链帮帮
      </text>
      <text v-else>修链帮帮</text>
    </view>
    <view class="bg">
      <image
        mode="widthFix"
        :style="
          'position:absolute;z-index:1;top:' +
          (systemInfo.statusBarHeight + 70) +
          'px;left:' +
          (systemInfo.menuButtonObject.marginRight + 17) +
          'px;height:' +
          systemInfo.navHeight +
          'px;line-height:' +
          systemInfo.navHeight +
          'px;width: 210px;'
        "
        src="https://pub.fsgo365.cn/2561921096998602043.png"
      />
    </view>
    <view
      style="display: flex; justify-content: center; position: absolute; width: 100%; top: 190px"
    >
      <image
        style="width: 90%"
        mode="widthFix"
        src="https://pub.fsgo365.cn/tuiguangqun.png"
        show-menu-by-longpress
      />
    </view>
    <!-- <view style="position: absolute; width: 100%; top: 190px">
      <image
        mode="widthFix"
        style="width: 100%"
        src="https://pub.fsgo365.cn/730745520433745820.jpg"
        show-menu-by-longpress
      />
    </view>
    <view style="position: absolute; width: 100%; top: 550px">
      <image
        mode="widthFix"
        style="width: 100%"
        src="https://pub.fsgo365.cn/17849345875133523.jpg"
      />
    </view> -->
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
      myIncomeData: {},
      zhelongAttachmentFlowPath: '', //授权委托书
      zhelongState: '', //签约状态
      zhelongFlowSignPath: '' //
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    console.log(this.systemInfo, '---systemInfo');
    let user = wx.getStorageSync('user');
    //   this.promoterLevel = user.user.promoterLevel;
    common.osg.codeoption(() => {});
  },
  onShow(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
  },
  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    download(e) {
      var fileName = e.currentTarget.dataset.filename;
      var fileType = fileName.substring(
        fileName.lastIndexOf('.') + 1,
        fileName.lastIndexOf('?') != -1 ? fileName.lastIndexOf('?') : fileName.length
      );
      var filePath = fileName;
      if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif') {
        //图片预览
        wx.previewImage({
          current: filePath, // 当前显示图片的http链接
          urls: [filePath] // 需要预览的图片http链接列表
        });
      } else {
        //文件下载
        wx.downloadFile({
          url: filePath,
          success: function (res) {
            let filePath = res.tempFilePath;
            wx.openDocument({
              filePath: filePath,
              fileType,
              showMenu: true,
              success: function (res) {
                console.log(res);
              },
              fail: function (res) {
                console.log(res);
              },
              complete: function (res) {
                console.log(res);
              }
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 10px;
  background: #f8f8f8;
  .bg {
    width: 100vw;
    height: 260px;
    // background: linear-gradient(280deg, #508af6 0%, #1a62f1 100%);
    background: linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%);
    border-radius: 0 0 50% 50%/5%;
  }
}
</style>
