<template>
  <view class="tasks">
    <view class="header c-bg-white">
      <view class="c-p-l-30 c-p-r-30 c-p-t-20 c-p-b-10">
        <van-search
          :value="searchValue"
          placeholder="搜索任务标题/工单编号/客户/地址"
          input-align="left"
          background="#ffffff"
          @search="onSearch"
          @clear="onSearch"
        />
      </view>
      <van-tabs
        :active="activeTab"
        @change="onTabChange"
        color="#FF6900"
        title-active-color="#FF6900"
        line-width="40px"
      >
        <van-tab title="今日待办" name="TODOTODAY"></van-tab>
        <van-tab title="全部待办" name="TODO"></van-tab>
        <van-tab title="已完成" name="DONE"></van-tab>
      </van-tabs>
    </view>

    <scroll-view
      scroll-y
      class="list"
      @scrolltolower="scrollToLower"
      @refresherrefresh="refresherRefresh"
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      refresher-background="#f7f8fa"
    >
      <view style="padding: 16px">
        <block v-for="(item, index) in fpi.data" :key="index">
          <view
            class="card-group c-bg-white c-radius-8 border-box c-p-30"
            style="margin-bottom: 16px"
          >
            <view class="c-font-16 c-color-333 c-m-b-20 c-flex c-flex-between c-item-center">
              <text class="c-bold c-size-18">{{ item.name }}</text>
              <view
                v-if="item.priority == '2'"
                style="
                  color: #ff6900;
                  background-color: rgba(255, 105, 0, 0.2);
                  padding: 2px 6px;
                  border-radius: 4px;
                  font-size: 14px;
                "
              >
                紧急
              </view>
            </view>
            <view class="c-flex c-items-center" style="line-height: 30px">
              <van-icon name="clock-o" color="#999" size="16px" style="margin-right: 12px" />
              <text class="c-jishi">{{ item.requiredDate }} 截止</text>
            </view>
            <view class="c-flex c-items-center" style="line-height: 30px">
              <van-icon name="orders-o" color="#999" size="16px" style="margin-right: 12px" />
              <text>{{ item.saCode }}</text>
            </view>
            <view class="c-flex c-items-center" style="line-height: 30px">
              <van-icon name="contact-o" color="#999" size="16px" style="margin-right: 12px" />
              <text>{{ item.contactName }}</text>
            </view>
            <view class="c-flex c-items-center" style="line-height: 30px; margin-bottom: 10px">
              <van-icon name="location-o" color="#999" size="16px" style="margin-right: 12px" />
              <text class="c-ellipsis-1">{{ item.contactAddress }}</text>
            </view>
            <van-button
              block
              color="#FF6900"
              @click="open('/subpackages2/task/task', { id: item._id })"
            >
              <view class="c-flex c-items-center c-justify-center">
                <text>去处理</text>
              </view>
            </van-button>
          </view>
        </block>

        <!-- Empty State -->
        <view
          v-if="fpi.data.length === 0"
          class="c-flex c-flex-col c-items-center c-justify-center c-p-t-50"
        >
          <van-empty description="暂无任务" />
        </view>
      </view>
      <uni-load-more v-if="fpi.data.length >= 3" :status="loadStatus"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      searchValue: '',
      activeTab: 'TODOTODAY',
      fpi: {
        page: 1,
        rows: 20,
        data: []
      },
      refresherTriggered: false, // 已触发下拉加载
      reachBottom: false,
      loadStatus: 'more' // 上拉加载状态
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    onSearch(e) {
      this.searchValue = e.detail;
    },
    onTabChange(e) {
      this.loadStatus = 'more';
      this.activeTab = e.detail.name;
      this.fpi.page = 1;
      this.fpi.data = [];
      this.getData();
    },
    getData(callback) {
      common.osg.ajax(
        'basic/followingUpTask/myTasks',
        { page: this.fpi.page, rows: this.fpi.rows, param: this.activeTab },
        res => {
          if (this.reachBottom) {
            // 上拉加载时
            if (res.data.length == 0) {
              this.loadStatus = 'noMore';
              // 没有更多数据时恢复页码
              this.fpi.page > 0 && this.fpi.page--;
              // common.osg.toast('没有更多数据了', 'none');
            } else {
              // 有更多数据时插入到当前列表底部
              this.fpi.data = this.fpi.data.concat(res.data);
            }
            this.reachBottom = false;
          } else {
            // 搜索或下拉刷新时将第1页数据直接覆盖整个列表
            this.fpi = res;
          }
          if (callback) callback();
        },
        {
          noload: true
        }
      );
    },
    refresherRefresh() {
      this.refresherTriggered = true;
      this.fpi.page = 1;
      this.getData(() => {
        this.refresherTriggered = false;
      });
    },
    scrollToLower() {
      if (this.reachBottom) return;
      this.reachBottom = true;
      this.loadStatus = 'loading';
      this.fpi.page++;
      this.getData(() => {
        this.reachBottom = false;
      });
    },
    open(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style lang="scss" scoped>
.tasks {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  .list {
    flex: 1;
    overflow: hidden;
    .card-group {
      &:last-child {
        margin-bottom: 0 !important;
      }
    }
  }
}
.border-box {
  box-sizing: border-box;
}
/* Ensure icons align nicely with text */
.van-icon {
  vertical-align: middle;
}
</style>
