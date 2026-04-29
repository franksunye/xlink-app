<template>
  <view class="page">
    <view class="topbar">
      <view>
        <text class="eyebrow">{{ dashboard.date }}</text>
        <text class="title">{{ dashboard.greeting }}</text>
      </view>
      <button class="feedback-entry" @tap="openFeedback">反馈</button>
    </view>

    <view class="summary-grid section">
      <view v-for="item in dashboard.summary" :key="item.label" class="summary-card panel">
        <text class="summary-value" :class="item.tone">{{ item.value }}</text>
        <text class="summary-label">{{ item.label }}</text>
      </view>
    </view>

    <view class="quick-actions section">
      <button class="primary-button" @tap="goWorkOrders">处理工单</button>
      <button class="secondary-button" @tap="goProjects">查看项目</button>
    </view>

    <view class="section">
      <view class="section-heading">
        <text class="section-title">今日重点</text>
        <text class="muted">按风险和时效排序</text>
      </view>
      <view class="focus-list panel">
        <view v-for="item in dashboard.focus" :key="item.title" class="focus-row">
          <view class="focus-main">
            <text class="focus-title">{{ item.title }}</text>
            <text class="focus-meta">{{ item.meta }}</text>
          </view>
          <text class="status-chip" :class="item.status">{{ statusLabel(item.status) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '../../services/api/index.js';

export default {
  data() {
    return {
      dashboard: {
        date: '',
        greeting: '',
        summary: [],
        focus: []
      }
    };
  },
  onLoad() {
    this.load();
  },
  methods: {
    load() {
      api.getDashboard().then((data) => {
        this.dashboard = data;
      });
    },
    statusLabel(status) {
      const labels = {
        todo: '待处理',
        doing: '跟进中',
        done: '已完成'
      };
      return labels[status] || status;
    },
    goWorkOrders() {
      uni.switchTab({ url: '/pages/work-orders/index' });
    },
    goProjects() {
      uni.switchTab({ url: '/pages/projects/index' });
    },
    openFeedback() {
      uni.navigateTo({ url: '/pages/feedback/index' });
    }
  }
};
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.eyebrow {
  display: block;
  color: #6b7485;
  font-size: 24rpx;
  line-height: 34rpx;
}

.title {
  display: block;
  margin-top: 8rpx;
  color: #182338;
  font-size: 44rpx;
  font-weight: 800;
  line-height: 56rpx;
}

.feedback-entry {
  width: 116rpx;
  min-height: 64rpx;
  border: 1rpx solid #dce3ea;
  border-radius: 8rpx;
  color: #176b87;
  font-size: 26rpx;
  font-weight: 700;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-card {
  min-height: 152rpx;
  padding: 22rpx 18rpx;
}

.summary-value {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  line-height: 58rpx;
}

.summary-value.primary {
  color: #176b87;
}

.summary-value.green {
  color: #2f855a;
}

.summary-value.amber {
  color: #b7791f;
}

.summary-label {
  display: block;
  margin-top: 12rpx;
  color: #6b7485;
  font-size: 23rpx;
  line-height: 30rpx;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.section-heading .muted {
  font-size: 24rpx;
  line-height: 34rpx;
}

.focus-list {
  overflow: hidden;
}

.focus-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  min-height: 128rpx;
  padding: 22rpx 24rpx;
  border-bottom: 1rpx solid #edf1f5;
}

.focus-row:last-child {
  border-bottom: 0;
}

.focus-main {
  min-width: 0;
}

.focus-title {
  display: block;
  color: #182338;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 40rpx;
}

.focus-meta {
  display: block;
  margin-top: 8rpx;
  color: #6b7485;
  font-size: 24rpx;
  line-height: 32rpx;
}
</style>
