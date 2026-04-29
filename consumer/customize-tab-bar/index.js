Component({
  data: {
    active: 0,
    color: '#919191',
    selectedColor: '#231815',
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        iconPath: '/static/images/tabBar/index-o.png',
        selectedIconPath: '/static/images/tabBar/index.png'
      },
      {
        pagePath: '/pages/classification/classification',
        text: '分类',
        iconPath: '/static/images/tabBar/classificationNew-o.png',
        selectedIconPath: '/static/images/tabBar/classificationNew.png'
      },
      {
        pagePath: '/pages/declaration/declaration',
        text: '快速下单',
        iconPath: '/static/images/tabBar/declaration.png',
        selectedIconPath: '/static/images/tabBar/declaration-active.png'
      },
      // {
      //   pagePath: '/pages/message/message',
      //   text: '客服',
      //   iconPath: '/static/images/tabBar/serviceNew-o.png',
      //   selectedIconPath: '/static/images/tabBar/serviceNew.png'
      // },
      {
        pagePath: '/pages/account/account',
        text: '我的',
        iconPath: '/static/images/tabBar/myNew.png',
        selectedIconPath: '/static/images/tabBar/myNew-o.png'
      }
    ]
  },
  methods: {
    switchTab(e) {
      this.setData({
        active: e.currentTarget.dataset.index
      });
      my.switchTab({
        url: e.currentTarget.dataset.pagepath
      });
    },
    openCustomerServiceChat() {
      this.setData({
        active: e.currentTarget.dataset.index
      });
      // VIP客服修修 https://work.weixin.qq.com/kfid/kfc9f975e9e814a10df
      // 修链科技客服 https://work.weixin.qq.com/kfid/kfcfe0104cc3194d18b
      // 修链房屋维修官方客服 https://work.weixin.qq.com/kfid/kfc5dd7ee01d88fcf16
      // 雨虹防水维修服务 https://work.weixin.qq.com/kfid/kfcdeb769981babb4e2 // 营客科技AI接管
      // 修链房屋维修官方客服 https://work.weixin.qq.com/kfid/kfc5dd7ee01d88fcf16
      my.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfcdeb769981babb4e2' },
        corpId: 'wwb580bbf2548e6123',
        success(res) {
          console.log('success', res);
        },
        fail(res) {
          console.log('fail', res);
        }
      });
    }
  }
});
