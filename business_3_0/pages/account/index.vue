<template>
  <view class="page">
    <view class="profile panel">
      <text class="avatar">B3</text>
      <view class="profile-copy">
        <text class="name">Business 3.0 体验账号</text>
        <text class="muted">当前模式：{{ mode }}</text>
      </view>
    </view>

    <view class="section panel home-switch">
      <view class="switch-head">
        <view>
          <text class="switch-title">首页方案</text>
          <text class="switch-copy">用于测试不同首页对处理效率的影响</text>
        </view>
        <text class="current-choice">{{ currentHomeLabel }}</text>
      </view>

      <view class="option-grid">
        <button
          v-for="option in homeOptions"
          :key="option.value"
          class="home-option"
          :class="{ active: homeVariant === option.value }"
          @tap="setHomeVariant(option.value)"
        >
          <text class="option-title">{{ option.label }}</text>
          <text class="option-copy">{{ option.desc }}</text>
        </button>
      </view>
    </view>

    <view class="section panel menu">
      <view class="menu-row">
        <text>体验版本</text>
        <text class="muted">0.1.0</text>
      </view>
      <view class="menu-row">
        <text>数据来源</text>
        <text class="muted">本地 Mock</text>
      </view>
      <view class="menu-row" @tap="openFeedback">
        <text>提交反馈</text>
        <text class="link">进入</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getRuntimeMode } from '../../services/api/index.js';

export default {
  data() {
    return {
      mode: getRuntimeMode(),
      homeVariant: 'task',
      homeOptions: [
        { value: 'task', label: '方案 A：任务优先', desc: '突出下一步行动和今日任务' },
        { value: 'metrics', label: '方案 B：数据概览', desc: '突出任务总览、关键数据和快捷操作' }
      ]
    };
  },
  computed: {
    currentHomeLabel() {
      const current = this.homeOptions.find((item) => item.value === this.homeVariant);
      return current ? current.label.replace('方案 ', '') : 'A：任务优先';
    }
  },
  onShow() {
    this.homeVariant = uni.getStorageSync('business_3_home_variant') || 'task';
  },
  methods: {
    setHomeVariant(value) {
      this.homeVariant = value;
      uni.setStorageSync('business_3_home_variant', value);
      uni.showToast({ title: '首页方案已切换', icon: 'none' });
    },
    openFeedback() {
      uni.navigateTo({ url: '/pages/feedback/index' });
    }
  }
};
</script>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  gap: 22rpx;
  padding: 26rpx 24rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92rpx;
  height: 92rpx;
  border-radius: 8rpx;
  background: #176b87;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;
}

.profile-copy {
  min-width: 0;
}

.name {
  display: block;
  color: #182338;
  font-size: 32rpx;
  font-weight: 800;
  line-height: 42rpx;
}

.profile-copy .muted {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  line-height: 36rpx;
}

.menu {
  overflow: hidden;
}

.home-switch {
  padding: 24rpx;
}

.switch-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.switch-title {
  display: block;
  color: #182338;
  font-size: 30rpx;
  font-weight: 800;
  line-height: 40rpx;
}

.switch-copy {
  display: block;
  margin-top: 8rpx;
  color: #6b7485;
  font-size: 26rpx;
  line-height: 36rpx;
}

.current-choice {
  flex: none;
  padding: 8rpx 12rpx;
  border-radius: 999rpx;
  background: #eaf3ff;
  color: #1478ff;
  font-size: 24rpx;
  font-weight: 800;
}

.option-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14rpx;
  margin-top: 22rpx;
}

.home-option {
  min-height: 144rpx;
  padding: 20rpx 18rpx;
  border: 1rpx solid #dce3ea;
  border-radius: 12rpx;
  background: #ffffff;
  text-align: left;
}

.home-option.active {
  border-color: #1478ff;
  background: #f4f9ff;
}

.option-title {
  display: block;
  color: #182338;
  font-size: 28rpx;
  font-weight: 800;
  line-height: 38rpx;
}

.home-option.active .option-title {
  color: #1478ff;
}

.option-copy {
  display: block;
  margin-top: 10rpx;
  color: #6b7485;
  font-size: 24rpx;
  line-height: 34rpx;
}

.menu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 104rpx;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #edf1f5;
  color: #182338;
  font-size: 28rpx;
  font-weight: 700;
}

.menu-row:last-child {
  border-bottom: 0;
}

.link {
  color: #176b87;
  font-size: 28rpx;
  font-weight: 800;
}
</style>
