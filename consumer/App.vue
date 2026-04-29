<script>
var common = require('./common/common.js');
export default {
  globalData: {
    // 导航栏信息
    systemInfo: { menuButtonObject: {} },
    qrCode: ''
  },
  onLaunch: function (options) {
    console.log('App Launch');
    if (options.query && options.query.qrCode) {
      this.globalData.qrCode = options.query.qrCode;
    }
    this.checkForUpdate();
    this.getSystemInfo();
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
  methods: {
    checkForUpdate() {
      //判断微信版本是否支持自动更新
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function () {
              // 新版本下载失败
              wx.showModal({
                title: '更新提示',
                content: '请您删除当前小程序，重新搜索小程序打开。'
              });
            });
          }
        });
      }
    },
    getSystemInfo() {
      /**
       * 获取胶囊信息
       * width height top right bottom left
       * 单位px
       */
      let menuButtonObject = wx.getMenuButtonBoundingClientRect();
      /**
       * 获取设备信息
       */
      wx.getSystemInfo({
        success: res => {
          // 整个导航栏的高度
          let navigationHeight =
            res.statusBarHeight +
            menuButtonObject.height +
            (menuButtonObject.top - res.statusBarHeight) * 2;
          // 导航栏的高度 = 整个导航栏高度 - 状态栏高度
          let navHeight = navigationHeight - res.statusBarHeight;
          // 胶囊与屏幕右侧边距
          menuButtonObject.marginRight = res.windowWidth - menuButtonObject.right;
          // 挂载到globalData
          this.globalData.systemInfo = Object.assign(res, {
            navigationHeight,
            statusBarHeight: res.statusBarHeight,
            navHeight,
            menuButtonObject
          });
        },
        fail: err => {
          console.log(err);
        }
      });
    }
  }
};
</script>

<style>
/*每个页面公共css */
@import './app.css';
</style>
