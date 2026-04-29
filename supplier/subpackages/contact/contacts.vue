<template>
  <view>
    <view class="c-header">
      <van-search
        :value="searchValue"
        @search="doSearch"
        @clear="doSearch"
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20"
      ></van-search>
      <view class="c-filterBar" v-if="false">
        <view class="c-filterBar-tabs">
          <text>全部</text>
          <text>待预约</text>
          <text>待服务</text>
          <text>待回执</text>
          <text>待评价</text>
          <text>已完成</text>
          <text>已完成</text>
          <text>已完成</text>
        </view>
        <view class="c-flex">
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
            <van-icon custom-class="c-card-icon" name="contact"></van-icon>
            <text>{{ item.name }}</text>
          </view>
        </view>
        <view>
          <text>手机：{{ item.phone }}</text>
        </view>
        <view>
          <text>地址：{{ item.address }}</text>
        </view>
        <view>
          <text>创建：{{ item.createTime }}</text>
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
  /**
   * 页面的初始数据
   */
  data() {
    return {
      searchValue: '',
      fpi: {}
    };
  },
  methods: {
    onLoad: function (param) {
      common.osg.init(this, param, app);
      this.getData();
    },
    doSearch: function (e) {
      this.setData({
        searchValue: e.detail,
        'fpi.page': 1
      });
      this.getData();
    },
    getData: function () {
      var params = {
        page: this.fpi.page || 1,
        rows: this.fpi.rows || 10,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('basic/contacts/query', params, res => {
        this.setData({
          fpi: res
        });
        wx.stopPullDownRefresh();
      });
    },
    doOpen: function (e) {
      common.osg.open('contact', {
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
