<template>
  <view class="account">
    <view class="btn" v-if="zhelongState == 2">
      <van-button
        color="#D32D26"
        plain
        round
        size="small"
        @click="download"
        :data-filename="zhelongAttachmentFlowPath"
      >
        《查看蛰龙授权委托书》
      </van-button>
      <van-button
        color="#D32D26"
        plain
        round
        size="small"
        @click="download"
        :data-filename="zhelongFlowSignPath"
      >
        《查看蛰龙服务协议》
      </van-button>
    </view>
    <van-empty v-else description="提现账户暂未开通！" />
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
    let user = wx.getStorageSync('user');
    this.zhelongAttachmentFlowPath = user.user.zhelongAttachmentFlowPath;
    this.zhelongState = user.user.zhelongState;
    this.zhelongFlowSignPath = user.user.zhelongFlowSignPath;
    console.log(this.zhelongAttachmentFlowPath, '--zhelongAttachmentFlowPath');
    //   this.promoterLevel = user.user.promoterLevel;
    common.osg.codeoption(() => {});
  },
  onShow() {},
  methods: {
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
  color: #fff;
  background: #fff;
}
.btn {
  margin-top: 10px;
  ::v-deep .van-button {
    font-size: 18px;
    color: #fff;
    width: 100%;
    border-color: #fff;
    border: 0;
  }
}
</style>
