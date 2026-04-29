<script>
//app.js
var common = require('./resources/js/common.js');
import { mapMutations } from 'vuex';
// 解决微信小程序不支持TextEncoder/TextDecoder对象
require('./resources/js/EncoderDecoderTogether.min.js');
export default {
  data() {
    return {
      isAppComponent: true // 用于Vue.mixin判断不触发App.vue页面的onShow、onHide、onUnload
    };
  },
  // 生命周期 小程序初始化完成时触发，全局只触发一次。
  onLaunch(opts) {
    uni.setLocale('zh-Hans'); // 设置语言为简体中文

    // 检查小程序或App版本更新
    // #ifdef MP-WEIXIN
    this.checkForUpdateMP();
    // #endif

    // 获取系统信息
    this.getSystemInfo();

    if (common.osg.isLogined()) {
      // 更新当前角色，用于更新菜单
      this.hasRole();
    }

    //更新底部tabbar
    this.updatTabbarList();

    // #ifdef APP-PLUS
    // 获取App唯一推送标识，如果已登录则更新人员信息
    this.getPushClientId();
    // #endif

    // 埋点上报
    // 监听程序初始化
    let obj = common.osg.deepCopy(opts);
    obj.type = 'appLaunch';
    common.osg.report('lifeCycle', obj);

    // Android当申请权限时，会在页面顶部显示申请权限的目的
    if (this.globalData.systemInfo.deviceBrand == 'huawei') {
      common.osg.setPermissionTips();
      common.osg.registerPermissionTipsListener();
    }
  },
  /**
   * App.vue页面 onShow onHide 触发场景
   * 微信小程序 触发：切微信后台、切微信前台、切手机后台、切手机前台、拨号、拍照、从相册上传图片、查看文件、查看图片；不触发：杀进程；onShow onHide 都有参数；
   * iOS 触发：切后台、切前台、杀进程、拨号；不触发：拍照、从相册上传图片、查看文件、查看图片；onShow有参数，onHide无参数；
   * Android 触发：切后台、切前台、拨号、拍照、从相册上传图片、查看文件（第一次从文件返回到了文件列表，并没有返回到App，但也触发了1次onShow又立即触发了1次onHide）；不触发：杀进程（已触发切后台onHide）、查看图片；onShow有参数，onHide无参数；
   */
  // 生命周期 程序启动/切前台
  onShow(res) {
    common.osg.report('lifeCycle', Object.assign(res || {}, { type: 'appShow' }));
    // #ifdef APP-PLUS
    plus.runtime.setBadgeNumber(0); // 打开App时清除应用角标
    // #endif
  },
  // 生命周期 程序切后台/杀进程
  onHide(res) {
    common.osg.report('lifeCycle', Object.assign(res || {}, { type: 'appHide' }));
  },
  // 全局data
  globalData: {
    common,
    // 导航栏信息
    systemInfo: { menuButtonObject: {} },
    // 设置监听器
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
    // 监听属性 并执行监听函数
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
    },
    // #ifdef APP-PLUS
    permissionState: 0, // 授权管理状态 0：待检查，-1：待授权，1：已授权
    // #endif
    location: '' // 当前定位经纬度
  },
  methods: {
    ...mapMutations(['updatTabbarList']),
    // 检查小程序版本更新
    checkForUpdateMP() {
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
    // 获取系统信息
    getSystemInfo() {
      wx.getSystemInfo({
        success: res => {
          // #ifdef MP-WEIXIN
          let menuButtonObject = wx.getMenuButtonBoundingClientRect(); // 获取小程序胶囊信息，拥有自定义顶部导航栏布局
          let navigationHeight =
            res.statusBarHeight +
            menuButtonObject.height +
            (menuButtonObject.top - res.statusBarHeight) * 2; // 整个导航栏的高度
          let navHeight = navigationHeight - res.statusBarHeight; // 导航栏的高度 = 整个导航栏高度 - 状态栏高度
          menuButtonObject.marginRight = res.windowWidth - menuButtonObject.right; // 胶囊与屏幕右侧边距
          // #endif

          // #ifdef APP-PLUS
          let navigationHeight = res.statusBarHeight; // 整个导航栏的高度
          let navHeight = res.statusBarHeight; // 导航栏的高度 = 整个导航栏高度 - 状态栏高度
          // #endif

          // 赋值到globalData
          this.globalData.systemInfo = Object.assign(res, {
            navigationHeight,
            statusBarHeight: res.statusBarHeight,
            navHeight,
            // #ifdef MP-WEIXIN
            menuButtonObject,
            // #endif
            // #ifdef APP-PLUS
            menuButtonObject: {}
            // #endif
          });

          // 赋值到common.js
          common.osg.systemInfo = this.globalData.systemInfo;
          common.osg.appBaseInfo = uni.getAppBaseInfo();
        }
      });
    },
    // 判断缓存中角色是否存在，如不存在则请求拥有最大权限角色的菜单，如存在更新当前角色菜单
    hasRole() {
      common.osg.ajax('role/queryRoleByPersonInTenant', null, res => {
        let roleList = res.data;
        let currentRole = wx.getStorageSync('currentRole');
        if (roleList.length > 0) {
          // 如果不存在（已取消）缓存中的角色，获取当前账号所有角色
          if (!roleList.find(item => item._id == currentRole._id)) {
            currentRole = res.data[0]; // 默认取第一个角色（数据权限最大）
            // 缓存当前角色
            wx.setStorageSync('currentRole', currentRole);
          }
          // 获取当前角色菜单和按钮
          this.getCurrentRoleFunctions(currentRole);
        } else {
          // 清空当前角色菜单和按钮缓存
          wx.setStorageSync('currentRoleFunctions', []);
          wx.setStorageSync('currentRoleButtons', []);
        }
      });
    },
    // 获取当前角色菜单和按钮，并更新菜单和按钮缓存
    getCurrentRoleFunctions(currentRole) {
      common.osg.ajax(
        'function/changeRole',
        {
          roleIds: currentRole._id
        },
        res => {
          let functionList =
            (res.data.functionList[0] && res.data.functionList[0].functionList) || [];
          functionList.map(item => {
            let url = item.action;
            if (url) {
              if (url.indexOf('?') != -1) {
                let paramsUrl = url.split('?')[1];
                let paramArr = paramsUrl.split('&');
                let params = {};
                paramArr.map(item => {
                  params[item.split('=')[0]] = item.split('=')[1];
                });
                item.orderState = params.orderState;
                item.status = params.status || 'all';
                item.type = params.type || '';
              } else {
                item.status = 'all';
              }
            }
          });
          // 缓存当前角色菜单
          wx.setStorageSync('currentRoleFunctions', functionList);
          // 缓存当前角色在工单列表展示的菜单，并将菜单url参数处理为对象
          let saMenu = common.osg.getSAMenu(functionList);
          wx.setStorageSync('saMenu', saMenu);
          this.globalData.funcId = ''; // 清空当前激活菜单，点击底部导航栏进入工单列表后，默认激活第一个菜单。
          // 缓存当前角色按钮
          let buttonList = (res.data.functionList[0] && res.data.functionList[0].buttonList) || [];
          wx.setStorageSync('currentRoleButtons', buttonList);
        }
      );
    },
    // #ifdef APP-PLUS
    // 获取客户端唯一推送标识，如果已登录则更新人员信息
    getPushClientId() {
      uni.getPushClientId({
        success: res => {
          common.osg.pushClientId = res.cid;
          if (common.osg.isLogined()) {
            common.osg.ajax('user/upsertAppPushClientid', { appPushClientid: res.cid }, () => {
              console.log('appPushClientid', res.cid);
            });
          }
        },
        fail(err) {
          console.log('pushClientId err', err);
        }
      });
    }
    // #endif
  }
};
</script>
<style>
@import './app.css';
@import '/wxcomponents/vant/common/index.wxss';
</style>
