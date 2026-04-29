import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    // 定义状态
    moveLeft: null,
    moveTop: null,
    isNavBarInPrevPage: false, //上一个页面是否有导航栏
    active: 0, //底部导航栏激活项
    tabbarList: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: '/static/images/tabBar/homePage.png',
        selectedIconPath: '/static/images/tabBar/HomePage-o.png'
      },
      {
        pagePath: 'pages/account/account',
        text: '我的',
        iconPath: '/static/images/tabBar/mine.png',
        selectedIconPath: '/static/images/tabBar/Mine-o.png'
      }
      // {
      //   pagePath: 'pages/index/index',
      //   text: '首页',
      //   iconPath: '/static/images/tabBar/homePage.png',
      //   selectedIconPath: '/static/images/tabBar/HomePage-o.png'
      // },
      // {
      //   pagePath: 'pages/message/message',
      //   text: '消息',
      //   iconPath: '/static/images/tabBar/homePage.png',
      //   selectedIconPath: '/static/images/tabBar/HomePage-o.png'
      // },
      // {
      //   pagePath: 'pages/serviceAppointment/serviceAppointments',
      //   text: '工单',
      //   iconPath: '/static/images/tabBar/homePage.png',
      //   selectedIconPath: '/static/images/tabBar/HomePage-o.png'
      // },
      // {
      //   pagePath: 'pages/toolbox/toolbox',
      //   text: '工具箱',
      //   iconPath: '/static/images/tabBar/homePage.png',
      //   selectedIconPath: '/static/images/tabBar/HomePage-o.png'
      // },
      // {
      //   pagePath: 'pages/account/account',
      //   text: '我的',
      //   iconPath: '/static/images/tabBar/mine.png',
      //   selectedIconPath: '/static/images/tabBar/Mine-o.png'
      // }
    ] //根据角色变化tabbar 导航栏
  },
  mutations: {
    // 定义修改状态的方法 存储上一个页面的top根left
    SetinitialPosition(state, obj) {
      state.moveLeft = obj.left;
      state.moveTop = obj.top;
    },
    // 定义修改上一个页面是否有导航栏的方法
    updatePreviousPageNavBarStatus(state, modifyState) {
      state.isNavBarInPrevPage = modifyState;
    },
    // 更新导航栏的值
    updatAactive(state, index) {
      state.active = index;
    },
    //更改tabbar导航栏个数
    updatTabbarList(state) {
      //默认tabbar
      const defaultTabbarList = [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: '/static/images/tabBar/homePage.png',
          selectedIconPath: '/static/images/tabBar/HomePage-o.png'
        },
        {
          pagePath: 'pages/account/account',
          text: '我的',
          iconPath: '/static/images/tabBar/mine.png',
          selectedIconPath: '/static/images/tabBar/Mine-o.png'
        }
      ];

      const currentRoleFunctions = wx.getStorageSync('currentRoleFunctions');
      // 如果没有缓存，直接使用默认tabbarList
      if (!currentRoleFunctions) {
        state.tabbarList = defaultTabbarList;
        return;
      }
      //检查有没有工单列表缓存 如果有工单节点缓存 如果有就存了
      const cloudStoreItem = currentRoleFunctions.find(item => item.name === '底部导航');

      // 使用三元运算符简化赋值逻辑
      state.tabbarList =
        cloudStoreItem?.functionList.map(i => ({
          pagePath: i.action,
          text: i.name,
          iconPath: i.exts.iconPath,
          selectedIconPath: i.exts.selectedIconPath
        })) || defaultTabbarList;

      const pages = getCurrentPages(); // 获取当前页面栈
      if (pages.length > 0) {
        const currentPagePath = pages[pages.length - 1].route; // 获取当前页面路径
        const matchedIndex = state.tabbarList.findIndex(item => item.pagePath === currentPagePath);
        //找到了
        if (matchedIndex !== -1) {
          state.active = matchedIndex;
        } else {
          const previousPagePath = pages[pages.length - 2].route;
          const i = state.tabbarList.findIndex(item => item.pagePath === previousPagePath);
          state.active = i !== -1 ? i : 0;
        }
      }
    }
  },
  actions: {
    // 定义异步操作的方法
  },
  getters: {
    // 定义计算属性
  }
});
export default store;
