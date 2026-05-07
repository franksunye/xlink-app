<template>
  <view class="home-page">
    <view class="hero">
      <view class="hero-main">
        <view>
          <text class="brand-line">{{ dashboard.company }} | {{ dashboard.channel }}</text>
          <text class="greeting">{{ dashboard.greeting }}</text>
          <view class="service-pill">
            <text class="green-dot"></text>
            <text>{{ dashboard.statusText }}</text>
          </view>
        </view>

        <button class="message-button" @tap="openSecurityAlert">
          <text class="message-dot"></text>
          <x-icon name="message" class="message-bubble" />
        </button>
      </view>

      <view class="hero-circle one"></view>
      <view class="hero-circle two"></view>
    </view>

    <view v-if="homeVariant === 'task'" class="content">
      <view class="card task-panel">
        <view class="card-head">
          <text class="card-title">今日任务</text>
          <button class="all-link" @tap="openTaskFilter('all')">全部任务 ›</button>
        </view>

        <view
          v-for="task in dashboard.homeTasks"
          :key="task.key"
          class="task-row"
          @tap="handleTask(task)"
        >
          <view class="task-icon" :class="[task.tone, task.key]">
            <x-icon :name="task.iconName" class="task-icon-glyph" />
          </view>
          <view class="task-copy">
            <view v-if="task.valueText" class="task-title split">
              <text class="task-value-text">{{ task.valueText }}</text>
              <text class="task-label-text">{{ task.labelText }}</text>
            </view>
            <text v-else class="task-title">{{ task.title }}</text>
            <text v-if="task.subtitle" class="task-subtitle">{{ task.subtitle }}</text>
          </view>
          <text class="task-count" :class="[task.tone, { empty: !task.count }]">{{ task.count || '' }}</text>
          <text class="chevron">›</text>
        </view>
      </view>

      <view class="card result-panel">
        <text class="card-title">今日结果</text>
        <view class="result-grid">
          <view class="result-item">
            <text class="result-label">签单额（元）</text>
            <text class="result-value">{{ dashboard.todayResult.amount }}</text>
          </view>
          <view class="divider"></view>
          <view class="result-item">
            <text class="result-label">签单数（单）</text>
            <text class="result-value">{{ dashboard.todayResult.orders }}</text>
          </view>
        </view>
      </view>

      <view class="card quick-panel">
        <text class="card-title">快捷操作</text>
        <view class="quick-grid">
          <button
            v-for="action in dashboard.quickActions"
            :key="action.label"
            class="quick-action"
            @tap="handleQuickAction(action)"
          >
            <view class="quick-icon" :class="action.tone">
              <x-icon :name="action.iconName" class="quick-icon-glyph" />
            </view>
            <text>{{ action.label }}</text>
          </button>
        </view>
      </view>
    </view>

    <view v-else class="content metrics-home">
      <view class="card overview-panel">
        <view class="card-head">
          <text class="card-title">我的任务</text>
          <button class="all-link" @tap="openTaskFilter('all')">全部任务 ›</button>
        </view>
        <view class="overview-grid">
          <button
            v-for="item in dashboard.taskOverview"
            :key="item.label"
            class="overview-item"
            @tap="openTaskFilter(item.filter)"
          >
            <view class="overview-icon" :class="item.tone">
              <text>{{ item.icon }}</text>
            </view>
            <text class="overview-value" :class="item.tone">{{ item.value }}</text>
            <text class="overview-label">{{ item.label }}</text>
            <text class="overview-delta">较昨日 <text :class="item.deltaTone">{{ item.delta }}</text></text>
          </button>
        </view>
      </view>

      <view class="card data-panel">
        <view class="card-head">
          <text class="card-title">今日关键数据</text>
          <button class="all-link" @tap="handleQuickAction({ toast: '更多数据演示中' })">更多数据 ›</button>
        </view>
        <view class="result-grid">
          <view class="result-item">
            <text class="result-label">签单额（元）</text>
            <text class="result-value">{{ dashboard.todayResult.amount }}</text>
            <text class="result-trend">较昨日 +12.5% ↗</text>
          </view>
          <view class="divider"></view>
          <view class="result-item">
            <text class="result-label">签单数（单）</text>
            <text class="result-value">{{ dashboard.todayResult.orders }}</text>
            <text class="result-trend">较昨日 +2 ↗</text>
          </view>
        </view>
      </view>

      <view class="card compact-quick-panel">
        <text class="card-title">快捷操作</text>
        <view class="compact-quick-grid">
          <button
            v-for="action in dashboard.quickActions"
            :key="action.label"
            class="compact-action"
            @tap="handleQuickAction(action)"
          >
            <view class="compact-icon" :class="action.tone">
              <text>{{ action.icon }}</text>
            </view>
            <view class="compact-copy">
              <text class="compact-title">{{ action.label }}</text>
              <text class="compact-desc">{{ action.desc || action.toast || '快速处理' }}</text>
            </view>
          </button>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { api } from '../../services/api/index.js';
import XIcon from '../../components/x-icon/x-icon.vue';

export default {
  components: {
    XIcon
  },
  data() {
    return {
      dashboard: {
        company: '修链科技',
        channel: '服务商',
        greeting: '上午好， 张工',
        statusText: '服务中',
        homeTasks: [],
        todayResult: {
          amount: '135,450',
          orders: 8
        },
        taskOverview: [],
        quickActions: []
      },
      homeVariant: 'task'
    };
  },
  onShow() {
    this.homeVariant = uni.getStorageSync('business_3_home_variant') || 'task';
    this.load();
  },
  methods: {
    load() {
      api.getDashboard().then((data) => {
        this.dashboard = {
          ...this.dashboard,
          ...data
        };
      });
    },
    handleTask(task) {
      if (task.orderId) {
        this.openOrder(task.orderId);
        return;
      }
      this.openTaskFilter(task.filter || 'all');
    },
    handleQuickAction(action) {
      if (action.route === 'feedback') {
        uni.navigateTo({ url: '/pages/feedback/index' });
        return;
      }
      if (action.route === 'tasks') {
        this.openTaskFilter(action.filter || 'all');
        return;
      }
      uni.showToast({ title: action.toast || '功能演示中', icon: 'none' });
    },
    openOrder(id) {
      uni.navigateTo({ url: '/pages/work-orders/detail?id=' + encodeURIComponent(id) });
    },
    openTaskFilter(filter) {
      uni.setStorageSync('business_3_task_filter', filter);
      uni.switchTab({ url: '/pages/work-orders/index' });
    },
    openSecurityAlert() {
      uni.navigateTo({ url: '/pages/security-alert/index' });
    }
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding-bottom: 34rpx;
  overflow: hidden;
  background: #f5f7fb;
}

.hero {
  position: relative;
  min-height: 448rpx;
  padding: 96rpx 38rpx 58rpx;
  overflow: hidden;
  background:
    linear-gradient(135deg, #0876ff 0%, #0068f4 44%, #0b84ff 100%);
  color: #ffffff;
}

.hero::after {
  content: '';
  position: absolute;
  left: -120rpx;
  right: -120rpx;
  bottom: -92rpx;
  height: 142rpx;
  border-radius: 50% 50% 0 0;
  background: #f5f7fb;
}

.hero-main {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 0;
}

.brand-line {
  display: block;
  color: rgba(255, 255, 255, .92);
  font-size: 27rpx;
  font-weight: 700;
  line-height: 38rpx;
}

.greeting {
  display: block;
  margin-top: 24rpx;
  color: #ffffff;
  font-size: 58rpx;
  font-weight: 900;
  line-height: 70rpx;
  letter-spacing: 0;
}

.service-pill {
  display: inline-flex;
  align-items: center;
  gap: 11rpx;
  min-height: 52rpx;
  margin-top: 22rpx;
  padding: 0 20rpx;
  border: 2rpx solid rgba(255, 255, 255, .48);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, .06);
  color: #ffffff;
  font-size: 23rpx;
  font-weight: 800;
}

.green-dot {
  display: inline-block;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #2ee87b;
}

.message-button {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  margin-top: 6rpx;
}

.message-bubble {
  position: absolute;
  left: 7rpx;
  top: 8rpx;
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #ffffff;
  border-radius: 14rpx;
  color: #ffffff;
  font-size: 34rpx;
  line-height: 1;
}

.message-bubble::after {
  content: '';
  position: absolute;
  right: 11rpx;
  bottom: -10rpx;
  width: 16rpx;
  height: 16rpx;
  border-right: 4rpx solid #ffffff;
  border-bottom: 4rpx solid #ffffff;
  background: transparent;
  transform: rotate(45deg);
}

.message-dot {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  width: 22rpx;
  height: 22rpx;
  border: 4rpx solid #ffffff;
  border-radius: 50%;
  background: #ff3852;
}

.hero-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, .06);
}

.hero-circle.one {
  right: -70rpx;
  bottom: -18rpx;
  width: 330rpx;
  height: 330rpx;
}

.hero-circle.two {
  right: -4rpx;
  bottom: -68rpx;
  width: 238rpx;
  height: 238rpx;
}

.content {
  position: relative;
  z-index: 3;
  margin-top: -72rpx;
  padding: 0 22rpx;
}

.card {
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 18rpx 50rpx rgba(28, 48, 82, .07);
}

.task-panel {
  padding: 30rpx 26rpx 24rpx;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.card-title {
  color: #111827;
  font-size: 36rpx;
  font-weight: 900;
  line-height: 48rpx;
}

.all-link {
  color: #6f7685;
  font-size: 26rpx;
  font-weight: 600;
}

.task-row {
  display: grid;
  grid-template-columns: 108rpx minmax(0, 1fr) auto 28rpx;
  align-items: center;
  gap: 18rpx;
  min-height: 136rpx;
  margin-top: 16rpx;
  padding: 18rpx 20rpx 18rpx 18rpx;
  border: 2rpx solid #eceff4;
  border-radius: 20rpx;
  background: #ffffff;
}

.task-icon,
.quick-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 900;
}

.task-icon {
  width: 82rpx;
  height: 82rpx;
  border-radius: 18rpx;
  font-size: 40rpx;
}

.task-icon-glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-size: 42rpx;
}

.task-icon.blue,
.quick-icon.blue {
  background: linear-gradient(145deg, #258bff 0%, #005ff0 100%);
}

.task-icon.green,
.quick-icon.green {
  background: linear-gradient(145deg, #42da84 0%, #12a95d 100%);
}

.task-icon.orange,
.quick-icon.orange {
  background: linear-gradient(145deg, #ff9b2c 0%, #ff7208 100%);
}

.quick-icon.purple {
  background: linear-gradient(145deg, #8e6df4 0%, #5b3dcc 100%);
}

.overview-panel {
  padding: 28rpx 24rpx 26rpx;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10rpx;
  margin-top: 24rpx;
}

.overview-item {
  min-height: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
  box-shadow: 0 12rpx 32rpx rgba(31, 52, 86, .07);
}

.overview-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 900;
}

.overview-icon.blue,
.compact-icon.blue {
  background: linear-gradient(145deg, #3a91ff 0%, #126fff 100%);
}

.overview-icon.green,
.compact-icon.green {
  background: linear-gradient(145deg, #3bd785 0%, #15a45c 100%);
}

.overview-icon.orange,
.compact-icon.orange {
  background: linear-gradient(145deg, #ff9c2d 0%, #ff760c 100%);
}

.overview-icon.purple,
.compact-icon.purple {
  background: linear-gradient(145deg, #9278fa 0%, #6042dd 100%);
}

.overview-value {
  margin-top: 12rpx;
  font-size: 42rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.overview-value.blue { color: #1478ff; }
.overview-value.green { color: #18ae65; }
.overview-value.orange { color: #ff7a0a; }
.overview-value.purple { color: #6042dd; }

.overview-label {
  margin-top: 4rpx;
  color: #121a2a;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 32rpx;
}

.overview-delta {
  margin-top: 10rpx;
  color: #8b94a3;
  font-size: 20rpx;
  line-height: 28rpx;
}

.up { color: #ff4052; }
.down { color: #18ae65; }
.flat { color: #8b94a3; }

.data-panel,
.compact-quick-panel {
  margin-top: 18rpx;
  padding: 28rpx 28rpx 24rpx;
}

.result-trend {
  display: block;
  margin-top: 8rpx;
  color: #ff4052;
  font-size: 22rpx;
  font-weight: 800;
  line-height: 30rpx;
}

.compact-quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14rpx;
  margin-top: 20rpx;
}

.compact-action {
  min-height: 104rpx;
  display: grid;
  grid-template-columns: 64rpx minmax(0, 1fr);
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 18rpx;
  border: 1rpx solid #e7ecf4;
  border-radius: 14rpx;
  background: #ffffff;
  text-align: left;
}

.compact-icon {
  width: 58rpx;
  height: 58rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13rpx;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 900;
}

.compact-copy {
  min-width: 0;
}

.compact-title {
  display: block;
  color: #111827;
  font-size: 27rpx;
  font-weight: 900;
  line-height: 36rpx;
}

.compact-desc {
  display: block;
  margin-top: 4rpx;
  overflow: hidden;
  color: #8a93a3;
  font-size: 20rpx;
  line-height: 28rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-copy {
  min-width: 0;
}

.task-title {
  display: block;
  color: #0d1320;
  font-size: 38rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.task-title.split {
  display: flex;
  align-items: baseline;
  gap: 14rpx;
}

.task-value-text {
  color: #0d1320;
  font-size: 40rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.task-label-text {
  color: #0d1320;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 48rpx;
}

.task-subtitle {
  display: block;
  margin-top: 6rpx;
  color: #737987;
  font-size: 24rpx;
  line-height: 32rpx;
}

.task-count {
  min-width: 56rpx;
  text-align: center;
  font-size: 78rpx;
  font-weight: 600;
  line-height: 78rpx;
}

.task-count.green {
  color: #1cb860;
}

.task-count.orange {
  color: #ff7a0a;
}

.task-count.empty {
  visibility: hidden;
}

.chevron {
  color: #a6acb8;
  font-size: 54rpx;
  line-height: 54rpx;
  text-align: right;
}

.result-panel,
.quick-panel {
  margin-top: 18rpx;
  padding: 30rpx 28rpx;
}

.result-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2rpx minmax(0, 1fr);
  align-items: center;
  margin-top: 22rpx;
}

.result-item {
  text-align: center;
}

.result-label {
  display: block;
  color: #666d7d;
  font-size: 26rpx;
  line-height: 36rpx;
}

.result-value {
  display: block;
  margin-top: 12rpx;
  color: #090f1e;
  font-size: 62rpx;
  font-weight: 700;
  line-height: 72rpx;
}

.divider {
  width: 2rpx;
  height: 104rpx;
  background: #e1e5ec;
}

.quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx 18rpx;
  margin-top: 20rpx;
}

.quick-action {
  min-height: 108rpx;
  display: grid;
  grid-template-columns: 84rpx minmax(0, 1fr);
  align-items: center;
  gap: 18rpx;
  padding: 16rpx 20rpx;
  border-radius: 16rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 30rpx rgba(31, 52, 86, .07);
  color: #101827;
  font-size: 28rpx;
  font-weight: 900;
  text-align: left;
}

.quick-icon {
  width: 62rpx;
  height: 62rpx;
  border-radius: 16rpx;
  font-size: 34rpx;
}

.quick-icon-glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

</style>
