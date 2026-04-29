<script>
//app.js
var common = require('./resources/js/common.js');

export default {
  onLaunch: function (ops) {
    this.checkForUpdate();
  },
  globalData: {
    /**
     * 设置监听器
     */
    setWatcher(page) {
      let data = page.data;
      let watch = page.watch;
      Object.keys(watch).forEach(v => {
        let key = v.split('.'); // 将watch中的属性以'.'切分成数组

        let nowData = data; // 将data赋值给nowData

        for (let i = 0; i < key.length - 1; i++) {
          // 遍历key数组的元素，除了最后一个！
          nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
        }

        let lastKey = key[key.length - 1]; // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'

        let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法

        let deep = watch[v].deep; // 若未设置deep,则为undefine

        this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
      });
    },

    /**
     * 监听属性 并执行监听函数
     */
    observe(obj, key, watchFun, deep, page) {
      var val = obj[key]; // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）

      if (deep && val != null && typeof val === 'object') {
        Object.keys(val).forEach(childKey => {
          // 遍历val对象下的每一个key
          this.observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
        });
      }

      var that = this;
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        set: function (value) {
          // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
          watchFun.call(page, value, val); // value是新值，val是旧值

          val = value;

          if (deep) {
            // 若是深度监听,重新监听该对象，以便监听其属性。
            that.observe(obj, key, watchFun, deep, page);
          }
        },
        get: function () {
          return val;
        }
      });
    }
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
    }
  }
};
</script>
<style>
@import './app.css';
@import '/wxcomponents/vant/common/index.wxss';
</style>
