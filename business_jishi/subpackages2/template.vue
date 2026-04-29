<template>
  <view class="leads" @click.capture="track">
    <view class="c-flex c-item-center c-m-t-10">
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        shape="round"
        placeholder="搜索姓名、手机号、地址、工单编号"
        class="c-flex-1"
        custom-class="c-search c-p-t-0"
      ></van-search>
    </view>
    <scroll-view
      scroll-y
      @scrolltolower="scrollToLower"
      @refresherrefresh="refresherRefresh"
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      class="c-cards"
    >
      <view v-for="(item, i) in fpi.data" :key="i" class="c-card">
        <view class="c-card-title">
          <view>{{ item.createTime }}</view>
        </view>
        <view class="c-card-content">
          <view class="c-card-content-item">
            <view class="c-card-content-item-value">
              {{ item.name }}
            </view>
          </view>
        </view>
        <view class="c-card-footer c-flex-between">
          <view></view>
          <view>
            <van-button plain round @click.native.stop="open(item)">编辑</van-button>
          </view>
        </view>
      </view>
    </scroll-view>
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
      loadType: '',
      refresherTriggered: false, // 已触发下拉加载
      reachBottom: false, // 触底
      searchValue: '',
      fpi: {
        page: 1,
        rows: 10,
        data: []
      }
    };
  },
  onLoad(param) {
    this.loadType = 'onLoad';
    common.osg.init(this, param, app);
    this.getData();
  },
  onShow() {
    if (this.loadType == 'onShow') {
      // 非首次进入页面
      common.osg.init(this, {}, app);
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.getData();
    } else {
      // 首次进入页面
      this.loadType = 'onShow';
    }
  },
  methods: {
    onSearch(e) {
      this.searchValue = e.detail;
      this.fpi.page = 1;
      this.getData();
    },
    getData(callback) {
      let params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'createTime',
        sortOrder: 'desc',
        'regex:name|string#or': this.searchValue,
        'is:state|integer#and': 1
      };
      common.osg.ajax('basic/lead/query', params, res => {
        if (this.reachBottom) {
          // 上拉加载时
          if (res.data.length == 0) {
            // 没有更多数据时恢复页码
            this.fpi.page > 0 && this.fpi.page--;
            common.osg.toast('没有更多数据', 'none');
          } else {
            // 有更多数据时插入到当前列表底部
            this.fpi.data = this.fpi.data.concat(res.data);
          }
        } else {
          // 搜索或下拉刷新时将第1页数据直接覆盖整个列表
          this.fpi = res;
        }
        if (callback) callback();
      });
    },
    // 下拉刷新
    refresherRefresh() {
      this.refresherTriggered = true;
      this.fpi.page = 1;
      this.getData(() => {
        this.refresherTriggered = false;
      });
    },
    // 触底价值
    scrollToLower() {
      if (this.reachBottom) return;
      this.reachBottom = true;
      this.fpi.page++;
      this.getData(() => {
        this.reachBottom = false;
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
    }
  }
};
</script>

<style lang="scss">
.leads {
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .c-cards {
    flex: 1;
    overflow: hidden;
    padding: 0;
    background-color: #f7f8fa;
    .c-card-content-item-label {
      min-width: 80px;
    }
  }
}
</style>
