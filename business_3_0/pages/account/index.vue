<template>
  <view class="page">
    <view class="profile panel">
      <text class="avatar">B3</text>
      <view class="profile-copy">
        <text class="name">Business 3.0 体验账号</text>
        <text class="muted">当前模式：{{ mode }}</text>
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
      mode: getRuntimeMode()
    };
  },
  methods: {
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
  font-size: 24rpx;
  line-height: 32rpx;
}

.menu {
  overflow: hidden;
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
  font-size: 26rpx;
  font-weight: 800;
}
</style>
