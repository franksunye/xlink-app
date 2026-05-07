<template>
  <view class="login-page">
    <view class="status-bar">
      <text>9:41</text>
      <view class="signal">
        <text></text>
        <text></text>
        <text></text>
      </view>
    </view>

    <view v-if="step === 'launch'" class="launch-screen" @tap="goMethods">
      <view class="brand-block">
        <view class="brand-logo">
          <view class="brand-mark">
            <view class="brand-sun"></view>
            <view class="brand-check"></view>
            <view class="brand-diamond"></view>
          </view>
          <view class="brand-type">
            <text class="brand-title">修链</text>
            <text class="brand-subtitle">量顶维修</text>
          </view>
        </view>
        <text class="launch-copy">让屋顶维修更专业、更高效</text>
      </view>

      <view class="worker-scene">
        <view class="scene-building left-back"></view>
        <view class="scene-building left-front"></view>
        <view class="scene-building right-back"></view>
        <view class="scene-building right-front"></view>
        <view class="scene-road main"></view>
        <view class="scene-road side"></view>
        <view class="scene-box left"></view>
        <view class="scene-box right"></view>
        <view class="worker-shadow"></view>
        <view class="worker">
          <view class="worker-helmet"></view>
          <view class="worker-head"></view>
          <view class="worker-body"></view>
          <view class="worker-vest"></view>
          <view class="worker-arm left"></view>
          <view class="worker-arm right"></view>
          <view class="worker-leg left"></view>
          <view class="worker-leg right"></view>
          <view class="worker-shoe left"></view>
          <view class="worker-shoe right"></view>
        </view>
      </view>

      <view class="trust-row">
        <view v-for="item in trustItems" :key="item.label" class="trust-item">
          <text class="trust-icon">{{ item.icon }}</text>
          <text>{{ item.label }}</text>
        </view>
      </view>
      <button class="enter-button" @tap.stop="goMethods">进入登录</button>
      <text class="version">版本号：v2.1.0</text>
    </view>

    <view v-else-if="step === 'methods'" class="method-screen">
      <view class="method-logo-wrap">
        <view class="brand-logo compact">
          <view class="brand-mark">
            <view class="brand-sun"></view>
            <view class="brand-check"></view>
            <view class="brand-diamond"></view>
          </view>
          <view class="brand-type">
            <text class="brand-title">修链</text>
            <text class="brand-subtitle">量顶维修</text>
          </view>
        </view>
      </view>

      <text class="screen-title center">选择登录方式</text>

      <view class="method-list">
        <button class="method-card" @tap="step = 'otp'">
          <view class="method-icon">▣</view>
          <view class="method-copy">
            <text class="method-title">验证码登录</text>
            <text class="method-desc">通过手机号验证登录</text>
          </view>
          <text class="recommend">推荐</text>
        </button>

        <button class="method-card" @tap="step = 'password'">
          <view class="method-icon lock">▥</view>
          <view class="method-copy">
            <text class="method-title">密码登录</text>
            <text class="method-desc">使用账号密码登录</text>
          </view>
          <text class="arrow">›</text>
        </button>

        <button class="method-card" @tap="quickLogin">
          <view class="method-icon fast">◒</view>
          <view class="method-copy">
            <text class="method-title">快捷登录</text>
            <text class="method-desc">一键登录，安全便捷</text>
          </view>
          <text class="arrow">›</text>
        </button>
      </view>

      <text class="agreement">登录即表示同意《用户协议》与《隐私政策》</text>
    </view>

    <view v-else class="form-screen">
      <button class="back-button" @tap="step = 'methods'">‹</button>
      <text class="screen-title">{{ formTitle }}</text>
      <text class="screen-subtitle">{{ formSubtitle }}</text>

      <view class="form-block">
        <text class="field-label">手机号</text>
        <input v-model="phone" class="field-input" type="text" maxlength="13" placeholder="请输入手机号" />

        <text class="field-label">{{ secondFieldLabel }}</text>
        <view class="code-row">
          <input
            v-model="code"
            class="code-input"
            :type="step === 'password' ? 'password' : 'number'"
            maxlength="12"
            :placeholder="secondFieldPlaceholder"
          />
          <button v-if="step !== 'password'" class="code-button" @tap="requestCode">获取验证码</button>
        </view>
      </view>

      <button class="login-button" @tap="submitLogin">登录</button>

      <label class="check-line">
        <checkbox :checked="agreed" color="#1478F2" @tap="agreed = !agreed" />
        <text>我已阅读并同意《用户协议》与《隐私政策》</text>
      </label>

      <view class="divider">
        <text></text>
        <text>其他登录方式</text>
        <text></text>
      </view>

      <view class="other-methods">
        <button @tap="step = 'password'">
          <text class="mini-icon">▤</text>
          <text>密码登录</text>
        </button>
        <button @tap="quickLogin">
          <text class="mini-icon">▥</text>
          <text>快捷登录</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      step: 'launch',
      launchTimer: null,
      phone: '180 0321 8877',
      code: '',
      agreed: false,
      trustItems: [
        { icon: '♢', label: '专业可靠' },
        { icon: '◴', label: '高效便捷' },
        { icon: '♙', label: '安全保障' }
      ]
    };
  },
  computed: {
    formTitle() {
      return this.step === 'password' ? '密码登录' : '验证码登录';
    },
    formSubtitle() {
      return this.step === 'password'
        ? '使用手机号或员工账号登录'
        : '未注册的手机号验证后将自动创建账户';
    },
    secondFieldLabel() {
      return this.step === 'password' ? '密码' : '验证码';
    },
    secondFieldPlaceholder() {
      return this.step === 'password' ? '请输入登录密码' : '请输入短信验证码';
    }
  },
  onLoad(query) {
    this.step = query.step || 'launch';
    if (this.step === 'launch') {
      this.launchTimer = setTimeout(() => {
        this.step = 'methods';
      }, 1200);
    }
  },
  onUnload() {
    if (this.launchTimer) {
      clearTimeout(this.launchTimer);
    }
  },
  methods: {
    goMethods() {
      if (this.launchTimer) {
        clearTimeout(this.launchTimer);
        this.launchTimer = null;
      }
      this.step = 'methods';
    },
    requestCode() {
      uni.showToast({ title: '验证码已发送', icon: 'none' });
      this.code = '268899';
    },
    submitLogin() {
      if (!this.phone.trim()) {
        uni.showToast({ title: '请输入手机号', icon: 'none' });
        return;
      }
      if (this.phone.trim().toLowerCase() === 'error') {
        uni.showToast({ title: '登录失败', icon: 'none' });
        return;
      }
      if (!this.agreed) {
        uni.showToast({ title: '请先同意协议', icon: 'none' });
        return;
      }
      uni.switchTab({ url: '/pages/index/index' });
    },
    quickLogin() {
      uni.switchTab({ url: '/pages/index/index' });
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 22rpx 34rpx 40rpx;
  background:
    radial-gradient(circle at 50% 16%, rgba(20, 120, 242, .08), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 57%, #f4f8ff 100%);
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

.launch-screen {
  min-height: calc(100vh - 110rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-block {
  margin-top: 188rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.brand-logo.compact {
  transform: scale(.9);
}

.brand-mark {
  position: relative;
  width: 134rpx;
  height: 112rpx;
}

.brand-sun {
  position: absolute;
  top: 8rpx;
  left: 4rpx;
  width: 86rpx;
  height: 86rpx;
  border-radius: 50%;
  background: #ffca1b;
}

.brand-check {
  position: absolute;
  left: 24rpx;
  top: 40rpx;
  width: 92rpx;
  height: 42rpx;
  border-left: 24rpx solid #1f77f0;
  border-bottom: 24rpx solid #1f77f0;
  transform: rotate(-45deg);
}

.brand-diamond {
  position: absolute;
  right: 2rpx;
  bottom: 16rpx;
  width: 28rpx;
  height: 28rpx;
  background: #0a46a8;
  transform: rotate(45deg);
}

.brand-type {
  display: flex;
  flex-direction: column;
}

.brand-title {
  color: #1f77f0;
  font-size: 62rpx;
  font-weight: 900;
  line-height: 1;
}

.brand-subtitle {
  margin-top: 16rpx;
  color: #1f77f0;
  font-size: 24rpx;
  font-weight: 800;
  letter-spacing: 10rpx;
}

.launch-copy {
  margin-top: 96rpx;
  color: #102340;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 40rpx;
}

.worker-scene {
  position: relative;
  width: 520rpx;
  height: 344rpx;
  margin-top: 76rpx;
  overflow: hidden;
  border-radius: 28rpx 28rpx 0 0;
  background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 58%, #e9f1ff 100%);
}

.scene-building,
.scene-road,
.scene-box,
.worker-shadow,
.worker,
.worker view {
  position: absolute;
}

.scene-building {
  bottom: 84rpx;
  background: #d8e7fb;
}

.scene-building.left-back {
  left: 36rpx;
  width: 78rpx;
  height: 118rpx;
}

.scene-building.left-front {
  left: 58rpx;
  width: 98rpx;
  height: 154rpx;
  background: #c8dcf9;
}

.scene-building.right-back {
  right: 78rpx;
  width: 88rpx;
  height: 132rpx;
}

.scene-building.right-front {
  right: 34rpx;
  width: 110rpx;
  height: 188rpx;
  background: #c2d8f7;
}

.scene-road {
  left: 130rpx;
  bottom: 108rpx;
  border-radius: 999rpx;
}

.scene-road.main {
  width: 270rpx;
  height: 12rpx;
  background: #9fc9ff;
  transform: rotate(-10deg);
}

.scene-road.side {
  width: 232rpx;
  height: 10rpx;
  background: #c8ddff;
  transform: rotate(-8deg) translateY(34rpx);
}

.scene-box {
  bottom: 40rpx;
  width: 64rpx;
  height: 48rpx;
  background: #afcdf2;
}

.scene-box.left {
  left: 50rpx;
}

.scene-box.right {
  right: 38rpx;
}

.worker-shadow {
  left: 220rpx;
  bottom: 22rpx;
  width: 170rpx;
  height: 28rpx;
  border-radius: 50%;
  background: rgba(162, 190, 227, .36);
}

.worker {
  left: 252rpx;
  bottom: 40rpx;
  width: 126rpx;
  height: 220rpx;
}

.worker-helmet {
  top: 0;
  left: 30rpx;
  width: 72rpx;
  height: 36rpx;
  border-radius: 70rpx 70rpx 12rpx 12rpx;
  background: #ffc500;
}

.worker-helmet::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -7rpx;
  width: 72rpx;
  height: 10rpx;
  background: #eeab00;
}

.worker-head {
  top: 28rpx;
  left: 45rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #ffd2ae;
}

.worker-body {
  top: 66rpx;
  left: 30rpx;
  width: 70rpx;
  height: 96rpx;
  border-radius: 18rpx 18rpx 8rpx 8rpx;
  background: #1f77f0;
}

.worker-vest {
  top: 68rpx;
  left: 55rpx;
  width: 22rpx;
  height: 46rpx;
  background: #f7fbff;
  clip-path: polygon(0 0, 100% 0, 66% 100%, 34% 100%);
}

.worker-arm {
  top: 76rpx;
  width: 22rpx;
  height: 74rpx;
  border-radius: 14rpx;
  background: #155fca;
}

.worker-arm.left {
  left: 12rpx;
  transform: rotate(34deg);
}

.worker-arm.right {
  right: 6rpx;
  transform: rotate(-34deg);
}

.worker-arm::after {
  content: '';
  position: absolute;
  bottom: -14rpx;
  width: 22rpx;
  height: 24rpx;
  border-radius: 8rpx;
  background: #ffd2ae;
}

.worker-arm.left::after {
  left: 0;
}

.worker-arm.right::after {
  right: 0;
}

.worker-leg {
  bottom: 20rpx;
  width: 24rpx;
  height: 82rpx;
  background: #1f77f0;
}

.worker-leg.left {
  left: 44rpx;
}

.worker-leg.right {
  right: 34rpx;
}

.worker-shoe {
  bottom: 0;
  width: 40rpx;
  height: 16rpx;
  border-radius: 6rpx;
  background: #173f79;
}

.worker-shoe.left {
  left: 32rpx;
}

.worker-shoe.right {
  right: 20rpx;
}

.trust-row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10rpx;
  margin-top: 34rpx;
  padding-top: 28rpx;
  border-top: 1rpx solid #eaf0f8;
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  color: #31415b;
  font-size: 24rpx;
  font-weight: 600;
}

.trust-icon,
.mini-icon {
  color: #1478f2;
  font-size: 34rpx;
  font-weight: 800;
}

.version {
  margin-top: auto;
  color: #9aa7bb;
  font-size: 24rpx;
}

.enter-button {
  width: 100%;
  height: 78rpx;
  margin-top: 28rpx;
  border-radius: 12rpx;
  background: rgba(20, 120, 242, .08);
  color: #1478f2;
  font-size: 25rpx;
  font-weight: 800;
}

.method-screen,
.form-screen {
  min-height: calc(100vh - 110rpx);
  display: flex;
  flex-direction: column;
}

.method-logo-wrap {
  display: flex;
  justify-content: center;
  margin-top: 138rpx;
}

.screen-title {
  display: block;
  margin-top: 46rpx;
  color: #111b31;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 46rpx;
}

.screen-title.center {
  text-align: center;
  margin-top: 96rpx;
}

.screen-subtitle {
  display: block;
  margin-top: 18rpx;
  color: #8a95a8;
  font-size: 24rpx;
  line-height: 36rpx;
}

.method-list {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
  margin-top: 48rpx;
}

.method-card {
  min-height: 114rpx;
  padding: 22rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 22rpx;
  border: 1rpx solid #e0e9f5;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, .9);
  box-shadow: 0 16rpx 42rpx rgba(29, 78, 145, .06);
  text-align: left;
}

.method-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  background: #ecf5ff;
  color: #1478f2;
  font-size: 30rpx;
  font-weight: 800;
}

.method-icon.lock { background: #eef6ff; }
.method-icon.fast { background: #fff8e4; color: #b88700; }

.method-copy {
  flex: 1;
  min-width: 0;
}

.method-title {
  display: block;
  color: #17233d;
  font-size: 27rpx;
  font-weight: 800;
  line-height: 36rpx;
}

.method-desc {
  display: block;
  margin-top: 8rpx;
  color: #8b97aa;
  font-size: 24rpx;
  line-height: 34rpx;
}

.recommend {
  padding: 7rpx 13rpx;
  border-radius: 999rpx;
  background: #dff8e8;
  color: #19b66a;
  font-size: 24rpx;
  font-weight: 800;
}

.arrow {
  color: #b7c1d2;
  font-size: 42rpx;
  line-height: 42rpx;
}

.agreement {
  margin-top: auto;
  color: #9aa7bb;
  font-size: 24rpx;
  line-height: 34rpx;
  text-align: center;
}

.back-button {
  width: 58rpx;
  height: 58rpx;
  margin-top: 28rpx;
  color: #16243d;
  font-size: 56rpx;
  line-height: 50rpx;
  text-align: left;
}

.form-block {
  margin-top: 54rpx;
}

.field-label {
  display: block;
  margin: 28rpx 0 14rpx;
  color: #526079;
  font-size: 24rpx;
  font-weight: 700;
}

.field-input,
.code-row {
  height: 88rpx;
  border: 1rpx solid #dbe5f2;
  border-radius: 12rpx;
  background: #fff;
  box-shadow: 0 12rpx 34rpx rgba(30, 75, 125, .04);
}

.field-input {
  width: 100%;
  padding: 0 24rpx;
  color: #19253d;
  font-size: 28rpx;
}

.code-row {
  display: flex;
  align-items: center;
  padding: 0 18rpx 0 24rpx;
}

.code-input {
  flex: 1;
  min-width: 0;
  height: 84rpx;
  color: #19253d;
  font-size: 28rpx;
}

.code-button {
  min-width: 142rpx;
  color: #1478f2;
  font-size: 24rpx;
  font-weight: 800;
}

.login-button {
  height: 90rpx;
  margin-top: 58rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  background: linear-gradient(90deg, #006cff 0%, #1382ff 100%);
  color: #fff;
  font-size: 28rpx;
  font-weight: 800;
  box-shadow: 0 18rpx 38rpx rgba(0, 108, 255, .26);
}

.check-line {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 22rpx;
  color: #8995a7;
  font-size: 24rpx;
  line-height: 34rpx;
}

.divider {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-top: 96rpx;
  color: #a0aabb;
  font-size: 24rpx;
}

.divider text:first-child,
.divider text:last-child {
  flex: 1;
  height: 1rpx;
  background: #e6edf6;
}

.other-methods {
  display: flex;
  justify-content: center;
  gap: 72rpx;
  margin-top: 30rpx;
}

.other-methods button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  color: #48566e;
  font-size: 24rpx;
}
</style>
