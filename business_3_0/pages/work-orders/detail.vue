<template>
  <view class="page">
    <view class="detail-card panel">
      <view class="detail-head">
        <text class="order-id">{{ order.id }}</text>
        <text class="status-chip" :class="order.status">{{ order.statusText }}</text>
      </view>
      <text class="title">{{ order.title }}</text>
      <text class="address">{{ order.address }}</text>

      <view class="info-grid">
        <view>
          <text class="info-label">客户</text>
          <text class="info-value">{{ order.customer }}</text>
        </view>
        <view>
          <text class="info-label">负责人</text>
          <text class="info-value">{{ order.assignee }}</text>
        </view>
        <view>
          <text class="info-label">预约</text>
          <text class="info-value">{{ order.appointment }}</text>
        </view>
        <view>
          <text class="info-label">优先级</text>
          <text class="info-value">{{ order.priority }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">处理进度</text>
      <view class="timeline panel">
        <view v-for="(item, index) in order.timeline" :key="item" class="timeline-row">
          <text class="dot">{{ index + 1 }}</text>
          <text class="timeline-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <view class="actions section">
      <button class="primary-button" @tap="markDone">标记已跟进</button>
      <button class="secondary-button" @tap="openFeedback">反馈体验</button>
    </view>
  </view>
</template>

<script>
import { api } from '../../services/api/index.js';

export default {
  data() {
    return {
      order: {
        timeline: []
      }
    };
  },
  onLoad(query) {
    api.getWorkOrder(query.id).then((order) => {
      this.order = order;
    });
  },
  methods: {
    markDone() {
      uni.showToast({
        title: '已记录',
        icon: 'success'
      });
    },
    openFeedback() {
      uni.navigateTo({ url: '/pages/feedback/index' });
    }
  }
};
</script>

<style scoped>
.detail-card {
  padding: 28rpx 24rpx;
}

.detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-id {
  color: #6b7485;
  font-size: 24rpx;
  font-weight: 700;
}

.title {
  display: block;
  margin-top: 18rpx;
  color: #182338;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 48rpx;
}

.address {
  display: block;
  margin-top: 12rpx;
  color: #6b7485;
  font-size: 26rpx;
  line-height: 36rpx;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-top: 28rpx;
}

.info-label {
  display: block;
  color: #8790a0;
  font-size: 22rpx;
  line-height: 30rpx;
}

.info-value {
  display: block;
  margin-top: 6rpx;
  color: #182338;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 38rpx;
}

.timeline {
  margin-top: 16rpx;
  padding: 10rpx 0;
}

.timeline-row {
  display: flex;
  gap: 18rpx;
  padding: 18rpx 24rpx;
}

.dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-radius: 999rpx;
  background: #e6f4f8;
  color: #176b87;
  font-size: 22rpx;
  font-weight: 800;
}

.timeline-text {
  flex: 1;
  color: #182338;
  font-size: 28rpx;
  line-height: 40rpx;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
</style>
