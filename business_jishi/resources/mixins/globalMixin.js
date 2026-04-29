import common from '../js/common.js';
export default {
  data() {
    return {
      // 页面停留时间记录对象
      pageTrack: {
        enterTime: 0, // 1.进入时间戳
        leaveTime: 0, // 2.离开时间戳
        duration: 0, // 3.停留时长（秒）
        preRoute: '', // 4.来源页面
        currentRoute: '', // 5.当前页面
        currentOptions: {}, // 6.当前页面参数
        leaveType: '' // 7.离开方式 hide:跳转,unload:返回
      }
    };
  },
  onShow() {
    if (this.isAppComponent) return; // App.vue页面不重复触发
    // 获取路由信息
    const pages = getCurrentPages();
    if (pages.length == 0) return; // 刚启动时触发1次onShow，页面为undefined，不会触发onHide和onUnload。随后才进入首页。

    // 返回当前页面时清空之前数据重新计算
    this.pageTrack = {
      enterTime: 0, // 1.进入时间戳
      leaveTime: 0, // 2.离开时间戳
      duration: 0, // 3.停留时长（秒）
      preRoute: '', // 4.来源页面
      currentRoute: '', // 5.当前页面
      currentOptions: {}, // 6.当前页面参数
      leaveType: '' // 7.离开方式 hide:跳转,unload:返回
    };

    this.pageTrack.enterTime = Date.now(); // 1.进入时间戳
    this.pageTrack.preRoute = pages.length < 2 ? '' : pages[pages.length - 2]?.route; // 4.来源页面
    this.pageTrack.currentRoute = pages[pages.length - 1]?.route; // 5.当前页面
    this.pageTrack.currentOptions = pages[pages.length - 1]?.options || {}; // 6.当前页面参数
  },
  // 隐藏
  onHide() {
    /**
     * 触发场景:
     * navigateTo
     * 点击底部tabBar触发原生switchTab
     */
    if (this.isAppComponent) return; // App.vue页面不重复触发
    this.pageLeave('hide');
  },
  // 卸载销毁
  onUnload() {
    /**
     * 触发场景:
     * navigateBack（上一页面的preRoute为原始值，不会修改为当前页面）
     * 主动调用switchTab（跳转到tabBar页面，并关闭其他所有非tabBar页面）
     * reLaunch（当使用reLaunch关闭所有页面打开新页面时，原来已经hide的页面会再次触发unload，hide时已上报，unload时不需要重复上报。如点击退出登录时。）
     * redirectTo（关闭当前页面2，跳转到应用内的某个页面3。但是不允许跳转到 tabbar 页面。在打开的新页面3点击返回时，由于关闭了当前页面2，新页面3的preRoute会变成页面1的路由。系统中目前没有使用redirectTo，一般页面超过10个才会使用redirectTo。）
     */
    if (this.isAppComponent) return; // App.vue页面不重复触发
    this.pageLeave('unload');
  },
  methods: {
    // 离开页面上报
    pageLeave(leaveType) {
      // 当使用reLaunch关闭所有页面打开新页面时，原来已经hide的页面会再次触发unload，hide时已上报，unload时不需要重复上报。如点击退出登录时。
      if (this.pageTrack.leaveType == 'hide') {
        return;
      }

      let now = Date.now();
      let duration = Number(((now - this.pageTrack.enterTime) / 1000).toFixed(0));
      if (duration < 0.1) return; // android查看文件返回时，会返回到wps列表，此时并没有返回到App，但会触发1次onShow和onHide，不上报.

      this.pageTrack.leaveTime = now; // 2.离开时间
      this.pageTrack.duration = duration; // 3.停留时长（秒）
      this.pageTrack.leaveType = leaveType; // 7.离开方式

      common.osg.report('pageTrack', this.pageTrack);
    },
    track(e) {
      // video van-dialog van-tabs van-submit-bar 组件源码中直接调用 report，为避免触发track，需要过滤capture:false
      if (
        e.target.dataset.event &&
        e.target.dataset.event.id &&
        e.target.dataset.event.capture !== false
      ) {
        common.osg.report('click', e.target.dataset.event);
      }
    },
    videoPlay(e) {
      common.osg.report('videoPlay', e.target.dataset.event);
    },
    videoPause(e) {
      common.osg.report('videoPause', e.target.dataset.event);
    },
    videoEnded(e) {
      common.osg.report('videoEnded', e.target.dataset.event);
    }
  }
};
