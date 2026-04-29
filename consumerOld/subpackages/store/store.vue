<template>
  <!-- 门店列表页 -->
  <view class="container" v-if="show">
    <view id="banner" class="navigation">
      <view class="c_clear">
        <swiper
          class="swiper"
          :indicator-dots="indicatorDots"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
        >
          <swiper-item v-for="(item, i) in options.banner" :key="i">
            <image class="bannerImg c_rt swiper-item" :src="item.value" mode="scaleToFill"></image>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view class="banner-check">
      <image src="../../static/images/check.png" mode="widthFix"></image>
    </view>
    <van-sticky style="box-shadow: 0 8px 12px #ebedf0">
      <!-- 搜索 -->
      <van-search
        :value="searchval"
        shape="round"
        placeholder="请输入门店名称"
        @search="onSearch"
        @clear="onClear"
      />
      <!-- 筛选 -->
      <van-dropdown-menu style="box-shadow: 0 8px 12px #ebedf0">
        <van-dropdown-item
          :value="province"
          :options="options.provinceList"
          @change="filter"
          data-key="province"
        />
        <!-- <van-dropdown-item
          :value="maxDistance"
          :options="options.maxDistanceList"
          @change="filter"
          data-key="maxDistance"
        /> -->
        <van-dropdown-item
          :value="sortField"
          :options="options.sortFieldList"
          @change="filter"
          data-key="sortField"
        />
      </van-dropdown-menu>
    </van-sticky>
    <!-- 门店列表 -->
    <view class="otherStores">
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
                <view class="c-size-18">{{ item.exts.title || item.name }}</view>
              </view>
              <view>
                <view class="c-flex c-item-center">
                  <image
                    src="../../static/images/star-fill.png"
                    mode="widthFix"
                    style="width: 20px; height: 20px; margin-right: 2px"
                    v-for="(item, i) in Number(item.rate) || 5"
                    :key="i"
                  ></image>
                  <text style="color: #ffc000; margin-left: 4rpx">{{ item.rate || '5' }}</text>
                </view>
                <view class="c-c-yh c-weight-600">
                  已服务:{{ item.exts.serviceAppointCount || 0 }}单
                </view>
              </view>
              <view>
                <view class="c-c-9 c-size-12 ellipsis" style="line-height: 14px">
                  <text v-if="!province">
                    {{ area.areaList.province_list[item.province] || '' }}
                  </text>
                  <text v-if="['110100', '120100', '310100', '500100'].indexOf(item.city) == -1">
                    {{ area.areaList.city_list[item.city] || '' }}
                  </text>
                  <text>{{ area.areaList.county_list[item.district] || '' }}</text>
                  <text>{{ item.address || '' }}</text>
                </view>
                <view class="c-flex c-c-9 c-size-12">
                  <van-icon name="location-o" class="c-size-12 c-c-9" />
                  <text>{{ item.distance && item.distance.toFixed(2) }}km</text>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
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
      show: false,
      options: {
        codecfg_banner: { codeId: 'banner' },
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
      }
    };
  },
  onLoad: function (params) {
    this.doInit(params);
    common.osg.doLogin({}, res => {
      // 私域流量锁定
      // shareType 分享类型：1.服务商 2.虚拟服务商
      // shareTypeId 分享类型对应实体id：当分享类型为1或2时，shareTypeId为partnerId
      if (res.user.shareType == 1 || res.user.shareType == 2) {
        wx.setStorageSync('shareParams', {
          shareType: res.user.shareType,
          shareTypeId: res.user.shareTypeId,
          allotOrgId: this.params.allotOrgId,
          shareUserId: res.user.shareUserId,
          channelId: res.user.channelId
        });
      }

      // 获取缓存信息
      let shareParams = wx.getStorageSync('shareParams');
      if (shareParams) {
        // 扫码或分享进入门店首页锁定，不允许返回首页，直接跳转门店详情页
        if (shareParams.shareType == 1 || shareParams.shareType == 2) {
          common.osg.open(
            '../../subpackages/store/storeDetail',
            {
              partnerId: shareParams.partnerId,
              shareType: shareParams.shareType,
              shareTypeId: shareParams.shareTypeId,
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
      });
    });
  },
  onShow: function () {
    this.doInit();
  },
  methods: {
    doInit(params) {
      common.osg.init(this, params, app);
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
    }
  }
};
</script>

<style lang="scss">
page {
  height: 100%;
}
.navigation {
  background: #fff;
  padding: 0 20rpx;
}
.banner-check {
  background: #fff;
  padding: 3vw 3vw 0;
}
.banner-check image {
  width: 100%;
}
.otherStores,
.recStores {
  width: 100vw;
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

.card-item {
  background: #fff;
  margin: 1vw 0;
  padding: 2vw 3vw;
  display: flex;
  .card-item-left {
    width: 25vw;
    display: flex;
    .storeTag {
      width: 100%;
      display: flex;
      // background: #d42d26;
      border-radius: 1px;
      // padding: 1vw;
      box-sizing: border-box;
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
  padding-bottom: 0 !important;
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
