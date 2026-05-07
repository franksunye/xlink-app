<template>
  <view class="alert-page">
    <view class="status-bar">
      <text>9:41</text>
      <view class="signal">
        <text></text>
        <text></text>
        <text></text>
      </view>
    </view>

    <button class="back-button" @tap="goBack">‹</button>

    <view class="content">
      <view class="shield">
        <text>!</text>
      </view>
      <text class="title">安全提醒</text>
      <text class="subtitle">检测到您的账号在新设备登录</text>

      <view class="info-card">
        <view class="info-row">
          <text>登录时间</text>
          <text>2024-04-24 10:30</text>
        </view>
        <view class="info-row">
          <text>登录地点</text>
          <text>北京市朝阳区</text>
        </view>
        <view class="info-row">
          <text>设备信息</text>
          <text>iPhone 15 Pro</text>
        </view>
      </view>
    </view>

    <view class="bottom-actions">
      <text class="question">这不是我的设备？</text>
      <button class="danger-button" @tap="protectAccount">不是我的，立即保护账户</button>
      <button class="plain-button" @tap="continueLogin">是我的设备，继续登录</button>
      <text class="support">如有疑问，请联系客服：<text>400-888-9999</text></text>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goBack() {
      uni.navigateBack();
    },
    protectAccount() {
      uni.showToast({ title: '已进入账户保护流程', icon: 'none' });
    },
    continueLogin() {
      uni.switchTab({ url: '/pages/index/index' });
    }
  }
};
</script>

<style scoped>
.alert-page {
  min-height: 100vh;
  padding: 22rpx 34rpx 36rpx;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 50% 20%, rgba(255, 55, 74, .08), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48rpx;
  color: #050b18;
  font-size: 24rpx;
  font-weight: 700;
}

.signal {
  display: flex;
  align-items: flex-end;
  gap: 5rpx;
}

.signal text {
  display: block;
  width: 7rpx;
  border-radius: 6rpx;
  background: #0b1020;
}

.signal text:nth-child(1) { height: 11rpx; }
.signal text:nth-child(2) { height: 15rpx; }
.signal text:nth-child(3) { height: 20rpx; }

.back-button {
  width: 58rpx;
  height: 58rpx;
  margin-top: 28rpx;
  color: #16243d;
  font-size: 56rpx;
  line-height: 50rpx;
  text-align: left;
}

.content {
  margin-top: 70rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.shield {
  position: relative;
  width: 150rpx;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffe8eb;
}

.shield::before {
  content: "";
  position: absolute;
  width: 82rpx;
  height: 94rpx;
  border-radius: 42rpx 42rpx 46rpx 46rpx;
  background: linear-gradient(180deg, #ff4151 0%, #f20f28 100%);
  clip-path: polygon(50% 0, 92% 16%, 82% 78%, 50% 100%, 18% 78%, 8% 16%);
}

.shield text {
  position: relative;
  z-index: 1;
  color: #fff;
  font-size: 48rpx;
  font-weight: 900;
}

.title {
  margin-top: 48rpx;
  color: #11213a;
  font-size: 36rpx;
  font-weight: 900;
  line-height: 48rpx;
}

.subtitle {
  margin-top: 18rpx;
  color: #7d899b;
  font-size: 25rpx;
  line-height: 36rpx;
}

.info-card {
  width: 100%;
  margin-top: 54rpx;
  padding: 22rpx 24rpx;
  border: 1rpx solid #e1e9f5;
  border-radius: 14rpx;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 18rpx 46rpx rgba(36, 78, 135, .08);
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  min-height: 58rpx;
  color: #6f7d91;
  font-size: 24rpx;
  line-height: 34rpx;
}

.info-row text:last-child {
  color: #394861;
  text-align: right;
}

.bottom-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question {
  color: #546176;
  font-size: 24rpx;
  line-height: 34rpx;
}

.danger-button,
.plain-button {
  width: 100%;
  height: 86rpx;
  margin-top: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  font-size: 26rpx;
  font-weight: 900;
}

.danger-button {
  background: linear-gradient(90deg, #f80f2e 0%, #ff263b 100%);
  color: #fff;
  box-shadow: 0 18rpx 38rpx rgba(248, 15, 46, .22);
}

.plain-button {
  border: 1rpx solid #dce5f0;
  background: #fff;
  color: #26364f;
}

.support {
  margin-top: 48rpx;
  color: #8996aa;
  font-size: 24rpx;
  line-height: 34rpx;
}

.support text {
  color: #1478f2;
  font-weight: 800;
}
</style>
