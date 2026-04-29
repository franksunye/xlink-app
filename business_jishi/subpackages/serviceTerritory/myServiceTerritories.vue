<template>
  <view class="myServiceTerritories" @click.capture="track">
    <!-- 过滤 -->
    <view class="c-header" style="z-index: 2; padding-top: 5px; background: #f9f9f9">
      <van-search
        :value="searchValue"
        @change="onSearchChange"
        @search="getData()"
        @clear="
          searchValue = '';
          getData();
        "
        shape="round"
        placeholder="搜索服务区域名称"
        custom-class="c-p-10 c-p-v-20 c-search"
        background="#f9f9f9"
      ></van-search>
    </view>
    <!-- 列表 -->
    <view class="c-content">
      <van-tabs
        swipeable
        @change="tabChange"
        :active="activeTab"
        sticky
        offset-top="44"
        :ellipsis="false"
        color="#ff6900"
        title-active-color="#ff6900"
        nav-class="c-bg-default"
        wrap-class="c-line-bottom"
        :data-event="{ id: '4oFBVWrRav', capture: false }"
      >
        <van-tab title="已绑定服务区域" name="1">
          <view class="padding-top" :data-event="{ id: '4oFBVWrRav' }">
            <block v-for="(item, i) in bindData" :key="i">
              <view
                v-if="item.bindRelatedIds.indexOf(serviceResourceId) != -1"
                class="c-card"
                style="padding-top: 10px"
                :data-event="{ id: '4oFBVWrRav' }"
              >
                <view class="c-card-title c-flex-start" :data-event="{ id: '4oFBVWrRav' }">
                  <text :data-event="{ id: '4oFBVWrRav' }">{{ item.name }}</text>
                </view>
                <view class="c-card-content" :data-event="{ id: '4oFBVWrRav' }">
                  <!-- <view class="c-m-b-10" :data-event="{id:'4oFBVWrRav'}">
                  <text :data-event="{id:'4oFBVWrRav'}">服务类型：</text>
                  <text :data-event="{id:'4oFBVWrRav'}">{{ codelabel('serviceType', item.serviceType) }}</text>
                </view>
                <view class="c-m-b-10" :data-event="{id:'4oFBVWrRav'}">
                  <text :data-event="{id:'4oFBVWrRav'}">省：</text>
                  <text :data-event="{id:'4oFBVWrRav'}">{{ formatProvince(item.province) }}</text>
                </view>
                <view class="c-m-b-10" :data-event="{id:'4oFBVWrRav'}">
                  <text :data-event="{id:'4oFBVWrRav'}">市：</text>
                  <text :data-event="{id:'4oFBVWrRav'}">{{ formatCity(item.city) }}</text>
                </view>
                <view class="c-m-b-10 c-ellipsis2" :data-event="{id:'4oFBVWrRav'}">
                  <text :data-event="{id:'4oFBVWrRav'}">区：</text>
                  <text :data-event="{id:'4oFBVWrRav'}">{{ formatDistrict(item.district) }}</text>
                </view> -->
                </view>
                <view :data-event="{ id: '4oFBVWrRav' }">
                  <van-button
                    round
                    size="small"
                    @click="viewStreet(item)"
                    :data-event="{ id: 'vs59gde89c' }"
                  >
                    查看街道
                  </van-button>
                  <van-button
                    v-if="item.bindRelatedIds.indexOf(serviceResourceId) == -1"
                    round
                    size="small"
                    type="danger"
                    @click="cancelSR(item)"
                    :data-event="{ id: 'JdR4gdn2xX' }"
                  >
                    取消绑定
                  </van-button>
                </view>
              </view>
            </block>
            <block v-for="(item, i) in bindData" :key="i">
              <view
                v-if="
                  item.relatedIds.indexOf(serviceResourceId) != -1 &&
                  item.bindRelatedIds.indexOf(serviceResourceId) == -1
                "
                class="c-card"
                style="padding-top: 10px"
                :data-event="{ id: '4oFBVWrRav' }"
              >
                <view class="c-card-title c-flex-start" :data-event="{ id: '4oFBVWrRav' }">
                  <text :data-event="{ id: '4oFBVWrRav' }">{{ item.name }}</text>
                </view>
                <view class="c-card-content" :data-event="{ id: '4oFBVWrRav' }">
                  <!-- <view class="c-m-b-10" :data-event="{id:'4oFBVWrRav'}">
                  <text :data-event="{id:'4oFBVWrRav'}">服务类型：</text>
                  <text :data-event="{id:'4oFBVWrRav'}">{{ codelabel('serviceType', item.serviceType) }}</text>
                </view>
                <view class="c-m-b-10" :data-event="{id:'4oFBVWrRav'}">
                  <text :data-event="{id:'4oFBVWrRav'}">省：</text>
                  <text :data-event="{id:'4oFBVWrRav'}">{{ formatProvince(item.province) }}</text>
                </view>
                <view class="c-m-b-10" :data-event="{id:'4oFBVWrRav'}">
                  <text :data-event="{id:'4oFBVWrRav'}">市：</text>
                  <text :data-event="{id:'4oFBVWrRav'}">{{ formatCity(item.city) }}</text>
                </view>
                <view class="c-m-b-10 c-ellipsis2" :data-event="{id:'4oFBVWrRav'}">
                  <text :data-event="{id:'4oFBVWrRav'}">区：</text>
                  <text :data-event="{id:'4oFBVWrRav'}">{{ formatDistrict(item.district) }}</text>
                </view> -->
                </view>
                <view
                  class="c-flex c-flex-between c-item-center"
                  :data-event="{ id: '4oFBVWrRav' }"
                >
                  <van-button
                    round
                    size="small"
                    @click="viewStreet(item)"
                    :data-event="{ id: '80j6lq1HNI' }"
                  >
                    查看街道
                  </van-button>
                  <van-button
                    v-if="item.bindRelatedIds.indexOf(serviceResourceId) == -1"
                    round
                    size="small"
                    type="danger"
                    @click="cancelSR(item)"
                    :data-event="{ id: 'a-mgzaRffi' }"
                  >
                    取消绑定
                  </van-button>
                </view>
              </view>
            </block>
          </view>
        </van-tab>
        <van-tab title="未绑定服务区域" name="2">
          <view class="padding-top" :data-event="{ id: '4oFBVWrRav' }">
            <view
              v-for="(item, i) in unBindData"
              :key="i"
              class="c-card"
              style="padding-top: 10px"
              :data-event="{ id: '4oFBVWrRav' }"
            >
              <view class="c-card-title c-flex-start" :data-event="{ id: '4oFBVWrRav' }">
                <text :data-event="{ id: '4oFBVWrRav' }">{{ item.name }}</text>
              </view>
              <view class="c-card-content" :data-event="{ id: '4oFBVWrRav' }">
                <!-- <view class="c-m-b-10" :data-event="{id:'4oFBVWrRav'}">
                <text :data-event="{id:'4oFBVWrRav'}">服务类型：</text>
                <text :data-event="{id:'4oFBVWrRav'}">{{ codelabel('serviceType', item.serviceType) }}</text>
              </view>
              <view class="c-m-b-10" :data-event="{id:'4oFBVWrRav'}">
                <text :data-event="{id:'4oFBVWrRav'}">省：</text>
                <text :data-event="{id:'4oFBVWrRav'}">{{ formatProvince(item.province) }}</text>
              </view>
              <view class="c-m-b-10" :data-event="{id:'4oFBVWrRav'}">
                <text :data-event="{id:'4oFBVWrRav'}">市：</text>
                <text :data-event="{id:'4oFBVWrRav'}">{{ formatCity(item.city) }}</text>
              </view>
              <view class="c-m-b-10 c-ellipsis2" :data-event="{id:'4oFBVWrRav'}">
                <text :data-event="{id:'4oFBVWrRav'}">区：</text>
                <text :data-event="{id:'4oFBVWrRav'}">{{ formatDistrict(item.district) }}</text>
              </view> -->
              </view>
              <view class="c-flex c-flex-between c-item-center" :data-event="{ id: '4oFBVWrRav' }">
                <van-button
                  round
                  size="small"
                  @click="viewStreet(item)"
                  :data-event="{ id: 'tTb--RKkmy' }"
                >
                  查看街道
                </van-button>
                <van-button
                  round
                  size="small"
                  color="#ff6900"
                  type="info"
                  @click="bindSR(item._id)"
                  :data-event="{ id: 'mX__lFTCEU' }"
                >
                  绑定服务区域
                </van-button>
              </view>
            </view>
          </view>
        </van-tab>
      </van-tabs>
    </view>
    <!-- 查看街道 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-popup :show="street.show" round position="bottom">
      <van-cascader
        v-if="street.show"
        :title="street.formData.name"
        :options="street.options"
        @close="closeStreet"
        placeholder="点击查看"
      />
    </van-popup>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <uni-data-picker
      v-if="street.show"
      ref="uniDataPicker"
      :localdata="street.options"
      :map="{
        text: 'text',
        value: 'value'
      }"
      :clear-icon="false"
    ></uni-data-picker>
    <!-- #endif -->
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      serviceResourceId: '',
      searchValue: '',
      activeTab: '1',
      bindData: [],
      unBindData: [],
      options: {
        // codecfg_serviceType: { codeId: 'serviceType' }
      },
      areaList: Object.assign({}, areajs.default),
      street: {
        show: false,
        formData: {},
        options: []
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.serviceResourceId = wx.getStorageSync('user').serviceResourceId;
    if (!this.serviceResourceId) {
      common.osg.alert('当前登录的用户不是服务资源，请先添加为服务资源再绑定服务区域。');
      return;
    }
    // common.osg.codeoption(() => {
    this.getData();
    // });
  },
  methods: {
    onSearchChange(e) {
      this.searchValue = e.detail;
    },
    tabChange(e) {
      this.activeTab = e.detail.name;
      this.getData();
    },
    getData() {
      let params;
      if (this.activeTab == '1') {
        // 查询已绑定
        params = {
          _all: '1',
          'is:state|integer#and': 1,
          'in:bindRelatedIds|string#or': this.serviceResourceId,
          'in:relatedIds|string#or': this.serviceResourceId,
          'regex:name|string#and': this.searchValue,
          sortField: 'territoryNum,createTime',
          sortOrder: 'asc'
        };
      } else {
        // 查询未绑定
        params = {
          _all: '1',
          'is:state|integer#and': 1,
          'nin:bindRelatedIds|string#and': this.serviceResourceId,
          'nin:relatedIds|string#and': this.serviceResourceId,
          'regex:name|string#and': this.searchValue,
          sortField: 'territoryNum,createTime',
          sortOrder: 'asc'
        };
      }
      common.osg.ajax(
        'basic/serviceTerritoryCustom/query',
        params,
        res => {
          if (this.activeTab == '1') {
            this.bindData = res.data;
          } else {
            this.unBindData = res.data;
          }
        },
        {
          noload: true
        }
      );
    },
    bindSR(id) {
      common.osg.ajax(
        'basic/serviceTerritoryCustom/chooseSR',
        { stcId: id },
        () => {
          this.getData();
          common.osg.toast('绑定成功', 'none');
        },
        { noload: true }
      );
    },
    cancelSR(item) {
      common.osg.confirm(`是否确认取消绑定“${item.name}”？`, () => {
        common.osg.ajax(
          'basic/serviceTerritoryCustom/cancelSR',
          { stcId: item._id },
          () => {
            this.getData();
            common.osg.toast('取消绑定成功', 'none');
          },
          { noload: true }
        );
      });
    },
    getSubdistricts(arr, callback) {
      common.osg.ajax(
        'area/query.do',
        {
          _all: '1',
          notFilterOrgId: '1',
          notFilterTenantId: '1',
          'in:code|array#and': arr.join(),
          level: '4',
          sortField: 'code',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.value = item.code;
            item.text = item.name;
            item.disabled = true;
          });
          if (callback) {
            callback(res.data);
          }
        },
        {
          noload: true
        }
      );
    },
    viewStreet(row) {
      this.street.formData = row;
      this.street.show = true;
      // 处理级联数据
      let list = JSON.parse(row.area);
      let province = {};
      let city = {};
      let district = {};
      let subdistrict = {};
      let area = [];
      row.province.map(item => {
        province[item] = {
          text: this.areaList.province_list[item],
          value: item,
          children: []
        };
      });
      row.city.map(item => {
        city[item] = {
          text: this.areaList.city_list[item],
          value: item,
          children: []
        };
      });
      row.district.map(item => {
        district[item] = {
          text: this.areaList.county_list[item],
          value: item,
          children: []
        };
      });
      this.getSubdistricts(row.subdistrict, data => {
        data.map(item => {
          subdistrict[item.value] = item;
        });
        // 将街道移入区的childrens
        list.map(item => {
          district[item[2]].children.push(subdistrict[item[3]]);
          delete subdistrict[item[3]];
        });
        // 如果区未移入，将区移入市的childrens
        list.map(item => {
          if (district[item[2]]) {
            city[item[1]].children.push(district[item[2]]);
            delete district[item[2]];
          }
        });
        // 如果市未移入，将市移入省的childrens
        list.map(item => {
          if (city[item[1]]) {
            province[item[0]].children.push(city[item[1]]);
            delete city[item[1]];
          }
        });
        for (let value in province) {
          area.push(province[value]);
        }
        // 将整理好的级联数据赋值给组件
        this.street.options = area;
        // #ifdef APP-PLUS
        this.$refs.uniDataPicker.show();
        // #endif
      });
    },
    closeStreet() {
      this.$set(this, 'street', {
        show: false,
        formData: {},
        options: []
      });
    },
    codelabel(type, value) {
      return common.osg.codelabel(type, value);
    },
    formatProvince(arr) {
      let str = '';
      arr.map(item => {
        str += this.areaList.province_list[item] + '、';
      });
      return str.substring(0, str.length - 1);
    },
    formatCity(arr) {
      let str = '';
      arr.map(item => {
        str += this.areaList.city_list[item] + '、';
      });
      return str.substring(0, str.length - 1);
    },
    formatDistrict(arr) {
      let str = '';
      arr.map(item => {
        str += this.areaList.county_list[item] + '、';
      });
      return str.substring(0, str.length - 1);
    }
  }
};
</script>
<style lang="scss">
.myServiceTerritories {
  .c-search {
    .van-search__content {
      background: #fff;
      border: 1rpx solid rgba(195, 195, 205, 0.5);
    }
  }

  .c-content {
    margin-top: 44px;
    padding-bottom: 20px;
  }

  // #ifdef APP-PLUS
  .padding-top {
    padding-top: 44px;
  }
  // #endif

  .c-card-tag {
    padding: 0 5px;
    border-radius: 2px;
    color: #fff;
  }

  .c-p-r-0 {
    padding-right: 0 !important;
  }

  .sr-popup .van-cell__title,
  .van-cell__value {
    -webkit-flex: auto;
    flex: auto;
    max-width: none !important;
  }

  .sr-title {
    width: calc(100% - 70px);
  }

  // 级联选择器不显示，只显示弹出层
  .uni-data-tree-input {
    display: none;
  }
}
</style>
