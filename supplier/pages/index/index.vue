<template>
  <view class="container">
    <view>
      <!-- 轮播图 -->
      <swiper
        v-if="notice.data.length > 0"
        :indicator-dots="notice.data.filter(item => item.isTop && item.fileids[0]).length > 1"
        autoplay="true"
        :interval="3000"
        :duration="500"
        @tap.stop="toNotice"
        :style="'height:' + bannerHeight"
      >
        <block v-for="(item, index) in notice.data" :key="index">
          <swiper-item v-if="item.isTop && item.fileids[0]" bingtap="toNotice">
            <image
              :src="downloadUrl + '' + item.fileids[0]"
              mode="widthFix"
              @load="getHeight"
              :data-id="item._id"
            ></image>
          </swiper-item>
        </block>
      </swiper>
      <!-- 公告 -->
      <van-notice-bar
        v-if="notice.data.length > 0"
        scrollable="false"
        left-icon="bullhorn-o"
        :text="notice.data[noticeIndex].title"
        @click="toNotice"
      ></van-notice-bar>
      <!-- 功能导航 -->
      <van-grid v-if="functionList.length > 0" :border="true" square clickable column-num="3">
        <block v-for="(item, index) in functionList" :key="index">
          <van-grid-item
            v-if="item.openType.startsWith('scan-')"
            @click.prevent="scan(item)"
            :icon="item.code"
            :text="item.name"
            :style="'color:' + item.color"
          />
          <van-grid-item
            v-else
            @click="gridClick(item, $event)"
            :icon="item.code"
            :link-type="item.openType"
            :url="item.action"
            :text="item.name"
            :badge="statusMap[item._id]"
            :style="'color:' + item.color"
          />
        </block>
      </van-grid>
      <van-empty
        v-if="functionList.length == 0 && !isLogined"
        description="请先登录后再查看功能菜单"
        class="function-empty"
      >
        <van-button round type="info" @click="open('/subpackages/login/loginAuth')">
          登 录
        </van-button>
      </van-empty>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      isLogined: true,
      downloadUrl: common.osg.downloadUrl,
      notice: {
        data: []
      },
      noticeIndex: 0,
      functionList: [],
      statusMap: {},
      bannerHeight: ''
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    let url = decodeURIComponent(param.q);
    let params = url.split('?')[1];
    let obj = {};
    if (params) {
      let arr = params.split('&');
      for (let item of arr) {
        if (item.indexOf('=') != -1) {
          obj[item.split('=')[0]] = item.split('=')[1];
        }
      }
      wx.setStorageSync('indexParams', obj);
    }
  },
  onShow: function () {
    if (!common.osg.isLogined()) {
      this.isLogined = false;
      this.notice.data = [];
      this.functionList = [];
      return;
    } else {
      this.isLogined = true;
      this.getNotice(); //全部
      this.getFunction(); //获取导航菜单
    }
  },
  methods: {
    getNotice: function () {
      let params = {
        page: 1,
        rows: 10,
        'is:type|integer#and': 3,
        'is:exts.chooseApplet|string#and': '1',
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('document/query', params, res => {
        this.notice.data = res.data || [];
      });
    },
    toNotice(e) {
      let id = e.target.dataset.id;
      if (id) {
        common.osg.open('../../subpackages/noticeManage/detail', {
          id: id
        });
      } else {
        common.osg.open('../../subpackages/noticeManage/noticeManage');
      }
    },
    todoClick(e) {
      let item = e.currentTarget.dataset.item;
      getApp().globalData.orderState = item.data;
      wx.switchTab({
        url: item.url,
        success: e => {
          let page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      });
    },
    getFunction() {
      let currentRoleFunctions = wx.getStorageSync('currentRoleFunctions');
      if (currentRoleFunctions && currentRoleFunctions.length != 0) {
        this.functionList = currentRoleFunctions;

        // 查询角标
        common.osg.ajax(
          '/function/dataCount',
          { functions: JSON.stringify(this.functionList) },
          res => {
            this.statusMap = res.data;
          }
        );
      } else {
        // 获取当前角色菜单
        common.osg.ajax(
          '/function/query',
          { roleIds: JSON.stringify([wx.getStorageSync('currentRole')._id]) },
          res => {
            this.functionList = res.data.functionList.filter(item => {
              return item.openType;
            });

            // 获取菜单角标
            common.osg.ajax(
              '/function/dataCount',
              { functions: JSON.stringify(this.functionList) },
              res => {
                this.statusMap = res.data;
              }
            );

            // 缓存菜单
            wx.setStorageSync('currentRoleFunctions', this.functionList);
            // 缓存用户信息
            wx.setStorageSync('user', res.data.user);
          }
        );
      }

      wx.stopPullDownRefresh();
    },
    open(url, type) {
      common.osg.open(url, null, {
        mode: type
      });
    },
    gridClick(func) {
      app.globalData.funcId = func._id;
      if (func.action && func.action.indexOf('/menu/menu') != -1) {
        wx.setStorageSync('menu', func.functionList);
      }
    },
    scan(func) {
      common.osg.scanCode(code => {
        common.osg.ajax('/basic/qrcode/scan', { param: code.result }, res => {
          common.osg.open(func.action, { id: res.data._id }, { mode: func.openType.split('-')[1] });
        });
      });
    },
    onPullDownRefresh: function () {
      if (!this.isLogined) return;
      this.getNotice(); //全部
      this.getFunction(); //获取导航菜单
    },
    // 获取banner高度
    getHeight(e) {
      //获取可使用窗口宽度
      var width = wx.getSystemInfoSync().windowWidth;
      //获取图片实际高度
      var imgheight = e.detail.height;
      //获取图片实际宽度
      var imgwidth = e.detail.width;
      //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      var height = (width * imgheight) / imgwidth;
      // if (height >= 200) height = 200;
      height += 'px';
      this.bannerHeight = height;
    }
  }
};
</script>

<style>
page {
  background: #fff;
}

.bg .img {
  width: 100%;
}

.btn {
  position: fixed;
  bottom: 30rpx;
}

.btn button {
  width: 200rpx;
}

/* 宫格内文字样式 */
.van-grid-item__text {
  font-size: 12px !important;
  margin-top: 20rpx;
}

.function-empty {
  position: fixed;
  bottom: 100px;
  width: 100vw;
}
.function-empty .van-empty__bottom {
  margin-top: 50px;
}
</style>
