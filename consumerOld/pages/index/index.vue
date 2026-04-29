<template>
  <!-- 门店列表页 -->
  <view class="container">
    <view>
      <view id="banner" class="navigation">
        <view class="c_clear">
          <!-- <swiper class="swiper" :autoplay="true" :style="'height:' + bannerHeight">
            <block v-for="(item, i) in notice.data" :key="i">
              <swiper-item>
                <image
                  :src="downloadUrl + '' + item.fileids[0]"
                  mode="widthFix"
                  @load="getHeight"
                  :data-id="item._id"
                ></image>
              </swiper-item>
            </block>
          </swiper> -->
          <swiper
            class="swiper"
            v-if="notice.data.length > 0"
            :indicator-dots="
              notice.data.filter(item => item.isTop && item.fileids && item.fileids[0]).length > 1
            "
            autoplay="true"
            :interval="4000"
            :duration="500"
            :style="'height:' + bannerHeight"
          >
            <block v-for="(item, index) in notice.data" :key="index">
              <swiper-item>
                <image
                  :src="downloadUrl + '' + item.fileids[0]"
                  mode="widthFix"
                  @load="getHeight"
                  :data-id="item._id"
                ></image>
              </swiper-item>
            </block>
          </swiper>
        </view>
      </view>
    </view>
    <view class="banner-check">
      <image src="../../static/images/check.png" mode="widthFix"></image>
    </view>
    <view>
      <van-grid column-num="6" :border="false">
        <block v-for="(item, index) in gridPart" :key="index">
          <van-grid-item
            @click="doOpen('/pages/index/indexWares', item)"
            :icon="item.imageUrl"
            :text="item.name"
          >
            <!-- <image :src="item.imageUrl" /> -->
          </van-grid-item>
        </block>
      </van-grid>
    </view>
    <!-- 公告 -->
    <van-notice-bar
      v-if="notice.data.length > 0"
      scrollable
      left-icon="bullhorn-o"
      :text="notice.data[noticeIndex].title"
      @click="toNotice(notice.data[noticeIndex])"
      custom-class="c-notice-bar"
    >
      <view
        slot="right-icon"
        class="c-notice-bar__right-icon"
        @click.native.stop="doOpen('/subpackages/noticeManage/noticeManage')"
      >
        <text>全部</text>
        <van-icon name="arrow" />
      </view>
    </van-notice-bar>
    <!-- 搜索 -->
    <!-- 筛选 -->
    <!-- <van-sticky style="box-shadow: 0 8px 12px #ebedf0">
      <van-search
        :value="searchval"
        shape="round"
        placeholder="请输入你要搜索的门店"
        @search="onSearch"
        @clear="onClear"
      />
      <van-dropdown-menu style="box-shadow: 0 8px 12px #ebedf0">
        <van-dropdown-item
          :value="province"
          :options="options.provinceList"
          @change="filter"
          data-key="province"
        />
        <van-dropdown-item
          :value="sortField"
          :options="options.sortFieldList"
          @change="filter"
          data-key="sortField"
        />
      </van-dropdown-menu>
    </van-sticky> -->
    <view class="otherStores">
      <view class="storeList">
        <!-- @click="open(item._id, 'store')" -->
        <block v-for="(item, index) in wares" :key="index">
          <view class="card-item" @click="doOpen('/pages/index/indexWaresDetail', item)">
            <view class="card-item-left">
              <view class="storeTag">
                <van-image
                  width="88px"
                  height="88px"
                  :src="item.images[0].url"
                  fit="cover"
                ></van-image>
              </view>
            </view>

            <view class="card-item-right">
              <view>
                <view class="c-size-16">{{ item.name }}</view>
              </view>
              <view style="justify-content: initial">
                <van-tag plain type="primary" v-if="item.layer">
                  {{ codelabel('select', 'layer', item.layer) || '' }}
                </van-tag>
                <van-tag style="padding-left: 5px" plain type="primary" v-if="item.agelimit">
                  {{ codelabel('select', 'agelimit', item.agelimit) || '' }}
                </van-tag>
              </view>
              <view>
                <view class="c-flex c-size-13 c-item-center">
                  <text style="color: #c2c0c0">{{ item.description }}</text>
                </view>
              </view>
              <view>
                <view class="c-flex c-item-center">
                  <text style="color: red">￥{{ item.price }}</text>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>

    <!-- 门店列表 -->
    <!-- <view class="otherStores">
      <view class="storeList">
        <block v-for="(item, i) in recStoreList" :key="i">
          <view class="card-item" @click="open(item._id, 'store')">
            <view class="card-item-left">
              <view class="storeTag">
                <image src="../../static/images/store.jpg" mode="widthFix"></image>
              </view>
            </view>
            <view class="card-item-right">
              <view>
                <view class="c-size-13">{{ item.exts.title || item.name }}</view>
              </view>
              <view>
                <view class="c-flex c-item-center">
                  <image
                    src="../../static/images/star-fill.png"
                    mode="widthFix"
                    style="width: 12px; height: 12px; margin-right: 2px"
                    v-for="(item, i) in item.rate || 5"
                    :key="i"
                  ></image>
                  <text style="color: #c62922; font-size: 12px; margin-left: 4rpx">
                    {{ item.rate || '5' }}
                  </text>
                </view>
                <view class="c-c-yh c-size-13">
                  已服务:{{ item.exts.serviceAppointCount || 0 }}单
                </view>
              </view>
              <view>
                <view class="c-size-13 ellipsis" style="line-height: 14px; color: #8a8a8a">
                  <text v-if="!province">
                    {{ area.areaList.province_list[item.province] || '' }}
                  </text>
                  <text v-if="['110100', '120100', '310100', '500100'].indexOf(item.city) == -1">
                    {{ area.areaList.city_list[item.city] || '' }}
                  </text>
                  <text>{{ area.areaList.county_list[item.district] || '' }}</text>
                </view>
                <view class="c-flex c-size-13" style="color: #8a8a8a">
                  <van-icon name="location-o" class="c-size-13" color="#8a8a8a" />
                  <text>{{ item.distance && item.distance.toFixed(1) }}km</text>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view> -->
    <!-- <image
      mode="widthFix"
      style="width: 100vw"
      src="https://pub.fsgo365.cn/428862993609375340.png"
    /> -->

    <!-- 联系客服 悬浮按钮 -->
    <view class="c-fab" @click="chatEntry">
      <!-- <van-icon name="service-o" color="#fff" size="22px" /> -->
      <image src="https://pub.fsgo365.cn/yunkefu.png" width="40px" height="40px"></image>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
const areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      downloadUrl: common.osg.downloadUrl,
      noticeIndex: 0,
      bannerHeight: '',
      show: false,
      options: {
        codecfg_banner: { codeId: 'banner' },
        codecfg_layer: { codeId: 'layer' },
        codecfg_agelimit: { codeId: 'agelimit' },
        banner: [],
        codecfg_provinceList: {
          codeId: 'openArea'
        },
        provinceList: [{ text: '全国', value: '' }],
        maxDistanceList: [
          { text: '附近', value: '40' },
          { text: '10km', value: '10' },
          { text: '30km', value: '30' },
          { text: '50km', value: '50' },
          { text: '100km', value: '100' },
          { text: '全部范围', value: '' }
        ],
        sortFieldList: [
          { text: '按距离排序', value: '' },
          { text: '按星级排序', value: 'score' },
          { text: '按服务数量排序', value: 'serviceAppointCount' }
        ]
      },
      recStoreList: [],
      ohterStoreList: [],
      fpi: {
        page: 1,
        rows: 10,
        data: []
      },
      longitude: '',
      latitude: '',
      province: '',
      maxDistance: '',
      sortField: '',
      rows: 20,
      total: 0,
      // 省市区
      area: {
        areaList: Object.assign({}, areajs.default)
      },
      isLogined: true,
      gridPart: [], //宫格中的展示部位
      wares: [], //商品
      // 轮播图公告
      notice: {
        data: []
      },
      userinfo: {}
    };
  },
  onLoad: function (params) {
    this.userinfo = common.osg.currentUser();
    // let currentUser = wx.getStorageSync('_currentUser');
    // console.log(currentUser, 'currentUser');
    // currentUser.data = this.userinfo;
    // _currentUser
    if (
      typeof (this.userinfo.phone == 'undefined') &&
      (this.userinfo.phone == '' || this.userinfo.nickname == '微信用户')
    ) {
      common.osg.open('../../subpackages/authorize/authorize', null, {
        mode: 'redirect'
      });
    }
    this.doInit(params);
    common.osg.doLogin({}, res => {
      // 私域流量锁定
      // shareType 分享类型：1.服务商 2.虚拟服务商
      // shareTypeId 分享类型对应实体id：当分享类型为1或2时，shareTypeId为partnerId
      if (res.user.shareType == 1 || res.user.shareType == 2) {
        wx.setStorageSync('shareParams', {
          shareType: res.user.shareType,
          shareTypeId: res.user.shareTypeId,
          allotOrgId: res.user.allotOrgId,
          shareUserId: res.user.shareUserId,
          channelId: res.user.channelId
        });
      }

      // 获取缓存信息;
      let shareParams = wx.getStorageSync('shareParams');
      if (shareParams) {
        // 扫码或分享进入门店首页锁定，不允许返回首页，直接跳转门店详情页
        if (shareParams.shareType == 1 || shareParams.shareType == 2) {
          common.osg.open(
            '../store/storeDetail',
            {
              shareType: shareParams.shareType,
              shareTypeId: shareParams.shareTypeId,
              allotOrgId: shareParams.allotOrgId,
              shareUserId: shareParams.shareUserId,
              channelId: shareParams.channelId
            },
            {
              mode: 'redirect'
            }
          );
        } else {
          this.show = true;
        }
      } else {
        this.show = true;
      }
      common.osg.codeoption(() => {
        // 处理图片路径
        this.options.banner.map(item => {
          item.value =
            'https://pub.fsgo365.cn/' + item.value.replace('https://pub.fsgo365.cn/', '');
        });
        // 定位当前省
        common.osg.getLocation(
          location => {
            this.longitude = location.longitude;
            this.latitude = location.latitude;
            common.osg.regeo(location.longitude + ',' + location.latitude, res => {
              let adcode = res.addressComponent.adcode;
              let province = adcode && adcode.substring(0, 2) + '0000';
              this.options.provinceList.map(item => {
                // 数据格式处理
                item.text = item.name;
                // 指定当前省
                if (province == item.value) {
                  this.province = province;
                }
              });
              this.options.provinceList.unshift({ text: '全国', value: '' });
              this.getData(true);
            });
          },
          fail => {
            this.options.provinceList = [{ text: '未授权', value: '' }];
            this.options.sortFieldList = [{ text: '按距离排序', value: '' }];
          }
        );
        this.getPart();
        this.getWares();
        this.getNotice();
      });
    });
  },

  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    toNotice(item) {
      if (item.path) {
        common.osg.open(item.path, {
          documentId: item._id
        });
      } else if (item._id) {
        common.osg.open('../../subpackages/noticeManage/detail', {
          id: item._id
        });
      }
    },
    getNotice: function () {
      let params = {
        page: 1,
        rows: 10,
        'is:type|integer#and': 3,
        'is:exts.chooseApplet|string#and': '2',
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('document/query', params, res => {
        this.notice.data = res.data || [];
      });
    },
    doInit(params) {
      common.osg.init(this, params, app);
      // common.osg.codeoption(() => {
      //   this.options.banner.map(item => {
      //     item.value =
      //       'https://pub.fsgo365.cn/' + item.value.replace('https://pub.fsgo365.cn/', '');
      //   });
      // });
    },
    filter(e) {
      let key = e.target.dataset.key;
      this[key] = e.detail;
      // 距离排序和其他排序二选一
      if (key == 'sortField' && e.detail) this.maxDistance = '';
      if (key == 'maxDistance' && e.detail) this.sortField = '';
      this.getData(true);
    },
    onSearch(e) {
      this.searchval = e.detail;
      this.getData(true);
    },
    onClear() {
      this.searchval = '';
      this.getData(true);
    },
    // 获取门店列表
    getData(isIndex) {
      if (!this.longitude || !this.latitude) {
        common.osg.toast('请允许获取地理位置', 'none');
        return;
      }
      // 上拉加载
      if (isIndex) {
        this.rows = 20;
      } else {
        this.rows = this.rows + 20;
      }

      var params = {
        longitud: this.longitude,
        latitude: this.latitude,
        'is:state|integer#and': 1,
        'in:partnerType|array-integer#and': '2,3', // 直营门店、加盟门店
        rows: this.rows,
        'regex:name|string#or': this.searchval || '', //搜索
        'regex:exts.title|string#or': this.searchval || '', //搜索
        province: this.province, //省份过滤
        maxDistance: this.maxDistance, //范围
        sortField: this.sortField,
        sortOrder: 'desc',
        serviceAppointCount: this.sortField == 'serviceAppointCount' ? '1' : null
      };

      // 从运营商报单码返回首页后找管家
      // if (wx.getStorageSync('shareParams')) {
      //   let shareParams = wx.getStorageSync('shareParams');
      //   if (shareParams.type == 'bd') {
      //     params.partnerId = shareParams.partnerId;
      //   }
      // }

      common.osg.ajax('parnter/query', params, res => {
        res.data.map(item => {
          item.rate = Number(item.rate);
          item.exts = item.exts || {};
        });
        this.recStoreList = res.data;
        this.total = res.total;
      });
    },
    // 跳转
    open(partnerId, from) {
      common.osg.open('../../subpackages/store/storeDetail', {
        partnerId,
        from
      });
    },
    toCoupon(url) {
      if (url && url.indexOf('coupon') != -1) {
        common.osg.open('../../subpackages/coupon/mall');
      }
    },
    // 上拉加载
    onReachBottom: function () {
      if (this.rows >= this.total) {
        common.osg.toast('没有更多数据', 'none');
        return;
      }
      this.getData(false);
    },
    // 下拉刷新
    onPullDownRefresh: function () {
      this.getData(true);
    },
    // 获取banner高度
    getHeight: function (e) {
      //获取可使用窗口宽度
      var width = wx.getSystemInfoSync().windowWidth * 0.94;
      //获取图片实际高度
      var imgheight = e.detail.height;
      //获取图片实际宽度
      var imgwidth = e.detail.width;
      //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      var height = (width * imgheight) / imgwidth + 'px';
      this.bannerHeight = height;
    },
    // biz/classify/queryClassify.do   /wares/queryClassify
    getPart() {
      var params = {
        _all: '1',
        // parentId: '2296182678310466046',Partners
        parentId: '4417047658598871409',
        'is:state|integer#and': 1,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('/wares/queryClassify.do', params, res => {
        this.gridPart = res.data;
        console.log(this.gridPart);
      });
    },
    getWares() {
      var params = {
        // _all: '1',
        page: 1,
        rows: 10,
        'is:state|integer#and': 1,
        'is:popular|string#and': '1',
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('/wares/query.do', params, res => {
        this.wares = res.data;
      });
    },
    codelabel(type, option, val, opts, frontEndConfig) {
      try {
        if (type == 'select') {
          return common.osg.codelabel(option, val, opts);
        } else if (type == 'cascade') {
          if (frontEndConfig && frontEndConfig.multiple) {
            return common.osg.formatCascadeMultiple(option, val);
          } else {
            return common.osg.formatCascade(option, val);
          }
        }
      } catch (e) {}
    },
    // 发起聊天
    chatEntry() {
      common.osg.ajax('chatMessage/entry', {}, res => {
        console.log('res', res);
        common.osg.open('/subpackages/message/message', {
          relationId: res.data._id,
          sendUserName: '平台客服'
        });
      });
    }
  }
};
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #f5f5f5;
}
.van-icon--image {
  width: 40px !important;
  height: 40px !important;
  background-color: #107ad0;
  border-radius: 20px !important;
}
.van-grid-item__text {
  font-weight: lighter;
  padding-top: 10px;
}
.navigation {
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  padding: 3vw 3vw 0;
  background-color: #fff;
}
.banner-check {
  background: #fff;
  padding: 3vw 8vw;
  margin-bottom: 5px;
}
.banner-check image {
  width: 100%;
  display: flex;
}
.otherStores,
.recStores {
  width: 100vw;
}
.van-dropdown-menu {
  background-color: #f5f5f5 !important;
  height: 35px !important;
}
.showDetail {
  color: #7187b9;
}
image {
  max-width: 100%;
  display: inline-block;
  position: relative;
  z-index: 0;
}
.card-item:first-child {
  margin-top: 0 !important;
}
.card-item {
  background: #fff;
  margin: 5px 0;
  padding: 5px 3vw;
  display: flex;
  .card-item-left {
    width: 90px;
    display: flex;
    .storeTag {
      width: 100%;
      height: 90px;
      display: flex;
      // border-radius: 1px;
      box-sizing: border-box;
      // border: 1px solid #bfbfbf;
    }
  }
  .card-item-right {
    flex: 1;
    padding-left: 3vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .num {
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      font-size: 14px;
    }
    > view {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.van-search {
  padding: 2vw 3vw !important;
}
.van-search__content {
  background-color: #f5f5f5 !important;
  input {
    font-size: 13px !important;
  }
}
.van-search__field .van-cell__value.van-cell__value {
  width: calc(100% - 21px);
}
.van-rate,
.van-rate__icon {
  display: flex !important;
}

.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}
</style>
