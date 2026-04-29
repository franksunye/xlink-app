<template>
  <view class="container">
    <van-sticky style="box-shadow: 0 8px 12px #ebedf0">
      <!-- 搜索 -->
      <van-search
        :value="searchval"
        shape="round"
        placeholder="请输入管家姓名"
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
    <!-- 列表 -->
    <view class="list">
      <view
        class="list-item"
        v-for="(item, i) in fpi.data"
        :key="i"
        @click="
          open('../subpackages/butler/butlerdetail', {
            serviceResourceId: item._id,
            from: 'butler'
          })
        "
      >
        <view class="list-item-left">
          <image
            v-if="item.users.profileImg.length > 0"
            :src="item.users.profileImg[0].url"
            mode="widthFix"
          ></image>
          <image v-else :src="normalImg" mode="widthFix"></image>
        </view>
        <view class="list-item-right">
          <!-- 姓名 服务数量 -->
          <view>
            <text class="c-size-18">
              {{ item.users.name || '' }}
            </text>
          </view>
          <!-- 门店 距离 -->
          <view>
            <view class="c-flex">
              <van-icon name="shop-o" />
              <text class="c-size-14">{{ item.users.partnerName || '' }}</text>
              <van-icon name="location-o" class="c-m-l-20" />
              <text class="c-size-14">{{ item.distance && item.distance.toFixed(2) }}km</text>
            </view>
          </view>
          <!-- 标签 -->
          <view v-if="item.users.tags">
            <view class="c-h-100 c-flex c-flex-wrap">
              <view v-for="(val, j) in item.users.tags" :key="j" style="margin-right: 10rpx">
                <van-tag plain type="primary">
                  {{ codelabel('select', 'userTag', val) }}
                </van-tag>
              </view>
            </view>
          </view>
          <!-- 服务 -->
          <view class="c-text-center">
            <view>
              <view class="c-weight-600 c-size-16 c-c-2">
                {{ item.exts.serviceAppointCount || 0 }}单
              </view>
              <view class="c-c-9">服务数量</view>
            </view>
            <view>
              <view class="c-weight-600 c-size-16 c-c-2">
                {{ codelabel('select', 'serviceYears', item.users.serviceYears) || '1-2年' }}
              </view>
              <view class="c-c-9">服务年限</view>
            </view>
            <view>
              <view class="c-weight-600 c-size-16 c-c-2">{{ item.users.score || 0 }}</view>
              <view class="c-c-9">技术服务分</view>
            </view>
          </view>
        </view>
        <!-- type=2:c端客户联系管家 type=7:联系管家转到内勤 -->
        <!-- <view class="call">
          <van-icon
            name="phone"
            v-if="item.users.phone && item.workType != -1"
            @click.native.stop="makeCall(item.users.phone)"
          />
          <van-icon
            name="phone"
            v-else-if="item.workType != -1"
            @click.native.stop="call('7', null, item.users._id, null)"
          />
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      initParams: {}, //页面初始参数
      options: {
        codecfg_userTag: {
          codeId: 'userTag'
        },
        codecfg_serviceYears: {
          codeId: 'serviceYears'
        },
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
          // { text: '服务年限优先', value: 'serviceYears' },
          { text: '服务数量优先', value: 'serviceAppointCount' },
          { text: '服务分优先', value: 'score' }
        ]
      },
      searchval: '',
      fpi: {
        page: 1,
        rows: 10,
        data: [],
        total: 0
      },
      normalImg: 'https://pub.fsgo365.cn/2197289627261056275.jpg',
      longitude: '',
      latitude: '',
      province: '',
      maxDistance: '',
      sortField: ''
    };
  },
  onLoad: function (params) {
    this.doInit(params);
  },
  methods: {
    doInit(params) {
      common.osg.init(this, params, app);
      // 保存初始参数 跳转到授权页携带 授权后返回此页面时携带
      this.initParams = common.osg.deepCopy(params);

      common.osg.getLocation(location => {
        this.longitude = location.longitude;
        this.latitude = location.latitude;
        common.osg.codeoption(() => {
          // 定位当前省
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
        });
      });
    },
    filter(e) {
      let key = e.target.dataset.key;
      this[key] = e.detail;
      // 距离排序和其他排序二选一
      if (key == 'sortField' && e.detail) this.maxDistance = '';
      if (key == 'maxDistance' && e.detail) this.sortField = '';
      this.getData(true);
    },
    getData(isIndex) {
      // 上拉加载
      if (isIndex) {
        this.fpi.rows = 10;
      } else {
        this.fpi.rows = this.fpi.rows + 10;
      }

      var params = {
        resourceType: 'technician',
        'in:resourceRoles|array#and': '1',
        'ne:orgId|string#and': '4492904560384753860', // TODO:不展示香港测试门店的管家
        'ne:workType|integer#and': '-1', // 不展示离线管家
        'is:state|integer#and': 1,
        'in:resourceRoles|array#and': '1', //只查管家
        'regex:name|string#and': this.searchval || '', //搜索
        longitude: this.longitude,
        latitude: this.latitude,
        rows: this.fpi.rows,
        province: this.province, //省份过滤
        maxDistance: this.maxDistance, //范围
        sortField: this.sortField, //排序
        sortOrder: 'desc',
        serviceAppointCount: this.sortField == 'serviceAppointCount' ? '1' : null,
        serviceYears: this.sortField == 'serviceYears' ? '1' : null,
        baseScore: this.sortField == 'score' ? '1' : null
      };

      // 从运营商报单码返回首页后找管家
      // if (wx.getStorageSync('shareParams')) {
      //   let shareParams = wx.getStorageSync('shareParams');
      //   if (shareParams.type == 'bd') {
      //     params.partnerId = shareParams.partnerId;
      //   }
      // }

      common.osg.ajax('parnter/queryhousekeeper', params, res => {
        res.data.map(item => {
          item.users = item.users || {};
          if (item.users.profileImg && common.osg.isJson(item.users.profileImg)) {
            item.users.profileImg = JSON.parse(item.users.profileImg);
          } else {
            item.users.profileImg = [];
          }
        });
        this.fpi = res;
        this.$forceUpdate();
      });
    },
    open(url, params, options) {
      common.osg.open(url, params, options);
    },
    call(type, callerId, calleeId, sid) {
      var u = common.osg.currentUser();
      if (u && u._id && u.nickname && u.phone) {
        common.osg.ajax(
          'basic/winnerlook/getMiddleNumber',
          {
            type,
            callerId: callerId || common.osg.currentUser()._id,
            calleeId: calleeId || '',
            sid: sid || ''
          },
          res => {
            this.makeCall(res.data.phoneNumberX);
          }
        );
      } else {
        common.osg.confirm('请先授权用户信息', () => {
          common.osg.open(
            '../../subpackages/authorize/authorize',
            Object.assign(this.initParams, { url: '../../subpackages/butler/butler' }),
            {
              mode: 'redirect'
            }
          );
        });
      }
    },
    makeCall(phoneNumber) {
      var u = common.osg.currentUser();
      if (u && u._id && u.nickname && u.phone) {
        wx.makePhoneCall({
          phoneNumber: phoneNumber
        });
      } else {
        common.osg.confirm('请先授权用户信息', () => {
          common.osg.open(
            '../../subpackages/subpackages/authorize/authorize',
            Object.assign(this.initParams, { url: '../../subpackages/butler/butler' }),
            {
              mode: 'redirect'
            }
          );
        });
      }
    },
    // 上拉加载
    onReachBottom: function () {
      if (this.fpi.rows >= this.fpi.total) {
        common.osg.toast('没有更多数据', 'none');
        return;
      }
      this.getData(false);
    },
    // 下拉刷新
    onPullDownRefresh: function () {
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
    codelabel(type, option, val, opts, frontEndConfig) {
      if (type == 'select') {
        return common.osg.codelabel(option, val, opts);
      } else if (type == 'cascade') {
        if (frontEndConfig && frontEndConfig.multiple) {
          return common.osg.codelabelCascadeMultiple(option, val);
        } else {
          console.log(common.osg.formatCascade(option, val));
          return common.osg.formatCascade(option, val);
        }
      }
    }
  }
};
</script>

<style lang="scss">
page {
  background: #ffffff;
  font-size: 14px;
  height: 100%;
}

image {
  max-width: 100%;
  display: inline-block;
  position: relative;
  z-index: 0;
}
.list {
  .list-item {
    padding: 3vw;
    display: flex;
    border-bottom: 1px solid #f2f2f2;
    position: relative;
    .list-item-left {
      width: 25vw;
      border-radius: 10rpx;
      overflow: hidden;
      image {
        display: flex;
      }
    }
    .list-item-right {
      flex: 1;
      padding-left: 3vw;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      > view {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 25px;
      }
    }
    .call {
      position: absolute;
      top: 4vw;
      right: 4vw;
      // right: 3vw;
      // top: calc(50% - 40px);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f4f7fe;
      display: flex;
      van-icon {
        margin: 0 auto;
        font-size: 20px;
        color: #d42d26;
      }
    }
  }
}
.van-search {
  padding-bottom: 0 !important;
}
.van-search__field .van-cell__value.van-cell__value {
  width: calc(100% - 21px);
}
</style>
