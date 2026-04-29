<template>
  <view class="punchDetail">
    <scroll-view
      v-if="fpi.data.length > 0"
      scroll-y
      @scrolltolower="scrollToLower"
      @refresherrefresh="refresherRefresh"
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      class="c-cards"
    >
      <view class="card" v-for="(data, k) in fpi.data" :key="k">
        <view>
          <view class="c-flex c-item-center c-flex-between">
            <view>
              <view>工作时长：{{ data.workTime }}分钟</view>
              <view>开工时间：{{ data.startTime }}</view>
              <view>完工时间：{{ data.endTime }}</view>
            </view>
            <view class="c-red">
              {{ data.state == 0 ? '待确认' : data.state == 1 ? '已确认' : '' }}
            </view>
          </view>
        </view>
        <view class="line" style="border: 1px dashed #ebedf0"></view>
        <view class="card-content" v-for="(item, i) in data.candidateSa" :key="i">
          <view>
            <view class="c-card-content-item">
              <text class="c-card-content-item-label">工单编号：</text>
              <text class="c-card-content-item-value">{{ item.orderNum }}</text>
            </view>
            <view class="c-card-content-item">
              <text class="c-card-content-item-label">工单标题：</text>
              <text class="c-card-content-item-value">{{ item.title }}</text>
            </view>
            <view class="c-card-content-item">
              <text class="c-card-content-item-label">工单地址：</text>
              <text class="c-card-content-item-value">{{ item.address }}</text>
            </view>
          </view>
          <view class="c-flex c-flex-end">
            <van-button
              round
              icon="passed"
              type="info"
              size="small"
              @click="confirm(data._id, item.saId)"
            >
              确认
            </van-button>
          </view>
          <view class="line" v-if="i != data.candidateSa.length - 1"></view>
        </view>
      </view>
    </scroll-view>
    <van-empty class="c-h-1 c-flex c-flex-center" v-else description="没有待确认的打卡记录" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      refresherTriggered: false, // 已触发下拉加载
      reachBottom: false, // 触底
      fpi: {
        page: 1,
        rows: 10,
        data: []
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.getData();
  },
  methods: {
    getData() {
      common.osg.ajax(
        'biz/punch/toBeConfirmed',
        {
          page: this.fpi.page,
          rows: this.fpi.rows,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
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
        }
      );
    },
    confirm(id, sid) {
      common.osg.ajax('biz/punch/confirm', { id: id, sid: sid }, res => {
        this.fpi.page = 1;
        this.getData();
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
    }
  }
};
</script>

<style lang="scss" scoped>
.punchDetail {
  .c-cards {
    box-sizing: border-box;
  }
  .card {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #fff;
    padding: 14px;
    border: 1px solid #fff;
    .card-content {
      display: flex;
      flex-direction: column;
    }
    .line {
      border-bottom: 1px solid #ebedf0;
      margin: 12px 0;
    }
  }
}
</style>
