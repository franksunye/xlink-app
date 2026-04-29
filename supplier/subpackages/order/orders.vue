<template>
  <view>
    <view class="c-header">
      <van-search
        :value="searchValue"
        @search="doSearch"
        @clear="doSearch"
        shape="round"
        placeholder="请输入姓名/手机/订单编号搜索"
        custom-class="c-p-10 c-p-v-20"
      ></van-search>
      <view class="c-filterBar">
        <view class="c-filterBar-tabs">
          <view
            @click="getData"
            data-paystate="-1"
            :class="payState == '-1' ? 'c-line-bottom' : ''"
          >
            我创建的
          </view>
          <view @click="getData" data-paystate="0" :class="payState == '0' ? 'c-line-bottom' : ''">
            未支付
          </view>
          <view @click="getData" data-paystate="1" :class="payState == '1' ? 'c-line-bottom' : ''">
            已支付
          </view>
        </view>
        <view class="c-flex" v-if="false">
          <van-icon name="filter-o" custom-class="c-m-v-10"></van-icon>
          筛选
        </view>
      </view>
    </view>
    <view class="c-content">
      <view
        class="c-card"
        v-for="(item, index) in fpi.data"
        :key="index"
        @tap="doOpen"
        :data-id="item._id"
      >
        <view class="c-card-title">
          <view class="c-flex">
            <van-icon custom-class="c-card-icon" name="balance-list-o"></van-icon>
            <text>{{ item._id }}</text>
          </view>
        </view>
        <view>
          <text>客户姓名：{{ item.ownerName }}</text>
        </view>
        <view>
          <text>客户手机：{{ item.ownerPhone }}</text>
        </view>
        <view>
          <text>
            产品总额：
            <text>¥ {{ item.originPrice }}</text>
          </text>
        </view>
        <view>
          <text>
            其他费用：
            <text>¥ {{ item.otherAmount }}</text>
          </text>
        </view>
        <view>
          <text>
            优惠金额：
            <text>¥ -{{ item.preferentialAmount }}</text>
          </text>
        </view>
        <view>
          <text>
            合计金额：
            <text class="c-red">¥ {{ item.totalPrice }}</text>
          </text>
        </view>
        <view>
          <text>支付状态：{{ common.osg.codelabel(options.payState, item.payState) }}</text>
        </view>
        <view>
          <text>下单时间：{{ item.createTime }}</text>
        </view>
      </view>
      <view v-if="fpi.rows >= fpi.total" class="c-text-center c-size-14 c-p-20">没有更多结果</view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      searchValue: '',
      fpi: {},
      options: {
        codecfg_payState: {
          codeId: 'PAYSTATE'
        }
      },
      payState: ''
    };
  },
  methods: {
    onLoad: function (param) {
      common.osg.init(this, param, app);
      common.osg.codeoption(() => {
        this.getData();
      });
    },
    doSearch: function (e) {
      this.setData({
        searchValue: e.detail,
        'fpi.page': 1
      });
      this.getData();
    },
    getData: function (e) {
      if (e) this.payState = e.currentTarget.dataset.paystate;

      var params = {
        page: this.fpi.page || 1,
        rows: this.fpi.rows || 10,
        'regex:ownerName|string#or': this.searchValue,
        'regex:ownerPhone|string#or': this.searchValue,
        'regex:_id|string#or': this.searchValue,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      switch (this.payState) {
        case '0':
          params['is:payState|integer#and'] = 0;
          break;
        case '1':
          params['is:payState|integer#and'] = 1;
          break;
        default:
      }
      common.osg.ajax('basic/order/query', params, res => {
        this.setData({
          fpi: res
        });
      });
    },
    doOpen: function (e) {
      common.osg.open('order', {
        id: e.currentTarget.dataset.id
      });
    },
    onReachBottom: function () {
      if (this.fpi.rows >= this.fpi.total) return;
      this.fpi.rows += 10;
      this.getData();
    },
    onPullDownRefresh: function () {
      this.getData();
    }
  }
};
</script>

<style>
.c-content {
  margin-top: 170rpx;
}
</style>
