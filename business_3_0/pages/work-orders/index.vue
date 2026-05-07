<template>
  <view class="tasks-page">
    <view class="search-row">
      <view class="search-field">
        <x-icon name="search" class="search-field-icon" />
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索客户、门店、地址或任务"
          confirm-type="search"
        />
      </view>
      <button class="search-button" @tap="applySearch">
        <x-icon name="search" class="button-icon" />
        <text>搜索</text>
      </button>
      <button class="filter-button" @tap="toggleFilters">
        <x-icon name="sliders" class="button-icon" />
        <text>筛选</text>
      </button>
    </view>

    <scroll-view class="filter-scroll" scroll-x>
      <view class="filter-row">
        <button
          v-for="item in filters"
          :key="item.key"
          class="filter-tab"
          :class="{ active: activeFilter === item.key }"
          @tap="activeFilter = item.key"
        >
          <text>{{ item.label }}</text>
          <text v-if="item.count !== undefined" class="tab-count">{{ item.count }}</text>
          <view v-if="activeFilter === item.key" class="tab-underline"></view>
        </button>
      </view>
    </scroll-view>

    <view class="task-list">
      <view
        v-for="order in filteredOrders"
        :key="order.id"
        class="task-card"
        :class="order.tone"
        @tap="openOrder(order.id)"
      >
        <view class="task-grid" @tap.stop="openOrder(order.id)" @click.stop="openOrder(order.id)">
          <view class="task-left">
            <view class="task-icon" :class="order.tone">
              <x-icon :name="order.iconName" />
            </view>
          </view>

          <view class="task-content task-main-row">
            <view class="task-name-row">
              <text class="task-type">{{ order.taskType }}</text>
              <text class="chip chip-muted part-chip">{{ order.displayPart }}</text>
            </view>
          </view>

          <text class="order-no">#{{ order.displayOrderNo }}</text>

          <view class="task-left">
            <x-icon name="location" class="pin" />
          </view>
          <view class="address-row">
            <text class="address">{{ order.address }}</text>
          </view>
          <view class="distance-box">
            <text class="distance-text">{{ order.distance }}</text>
            <x-icon name="car" class="car-icon" />
          </view>

          <view class="task-left"></view>
          <view class="customer-row">
            <text class="customer">{{ order.customer }}</text>
          </view>
          <view class="task-distance-spacer"></view>

          <view class="task-left"></view>
          <view class="footer-main">
            <text class="chip chip-info nearby-customer">{{ order.nearbyLabel }}</text>
          </view>
          <button class="phone-button" :class="order.tone" @tap.stop="callCustomer(order)">
            <x-icon name="phone" />
          </button>
        </view>
      </view>

      <view v-if="!filteredOrders.length" class="empty-card">
        <text class="empty-title">暂无匹配任务</text>
        <text class="empty-copy">换个筛选条件，或者清空搜索再试一次</text>
      </view>
    </view>

  </view>
</template>

<script>
import { api } from '../../services/api/index.js';
import XIcon from '../../components/x-icon/x-icon.vue';

const FILTER_MAP = {
  to_accept: function(order) {
    return order.group === 'to_accept'
      || order.status === 'new'
      || order.taskType === '待接单';
  },
  need_contact: function(order) {
    return order.group === 'need_contact'
      || order.status === 'pending_contact'
      || order.taskType === '联系客户';
  },
  onsite: function(order) {
    return order.group === 'onsite'
      || order.status === 'appointed'
      || order.status === 'ready_to_depart'
      || order.taskType === '上门服务';
  },
  following: function(order) {
    return order.group === 'following'
      || order.status === 'pending_complete'
      || order.taskType === '跟进方案'
      || order.taskType === '跟进签约';
  },
  all: function() { return true; },
  today: function(order) { return FILTER_MAP.onsite(order); },
  appointed: function(order) { return FILTER_MAP.onsite(order); },
  doing: function(order) { return FILTER_MAP.following(order); },
  pending: function(order) { return FILTER_MAP.following(order); },
  done: function() { return false; }
};

const FILTERS = [
  { key: 'to_accept', label: '待接单' },
  { key: 'need_contact', label: '待联系' },
  { key: 'onsite', label: '待上门' },
  { key: 'following', label: '待跟进' },
  { key: 'all', label: '全部' }
];

const FILTER_KEYS = FILTERS.map(function(item) { return item.key; });

const FILTER_ALIASES = {
  today: 'onsite',
  appointed: 'onsite',
  doing: 'following',
  pending: 'following',
  done: 'all'
};

const TASK_ICON_MAP = {
  '联系客户': 'phone',
  '上门服务': 'appointment',
  '跟进方案': 'contract',
  '跟进签约': 'contract'
};

function getOrderNo(order) {
  const source = order.customerNo || order.id || '';
  const digits = String(source).replace(/\D/g, '');
  return digits ? digits.slice(-5) : String(order.id || '').slice(-5);
}

function normalizeOrder(order) {
  const displayPart = order.part || '屋顶';
  const nearbyCount = order.nearbyCustomers;
  const nearbyLabel = nearbyCount || nearbyCount === 0
    ? '工单附近客户 ' + nearbyCount
    : '工单附近客户';

  return {
    ...order,
    displayPart,
    displayOrderNo: getOrderNo(order),
    nearbyLabel,
    iconName: TASK_ICON_MAP[order.taskType] || 'workOrder',
    searchText: [
      order.id,
      order.taskType,
      order.title,
      order.customer,
      order.project,
      order.assignee,
      order.address,
      displayPart,
      nearbyLabel
    ].join(' ')
  };
}

export default {
  components: {
    XIcon
  },
  data() {
    return {
      keyword: '',
      activeFilter: 'all',
      navigatingOrderId: '',
      orders: []
    };
  },
  computed: {
    normalizedOrders() {
      return this.orders.map(normalizeOrder);
    },
    filters() {
      const orders = this.normalizedOrders;
      return FILTERS.map(function(item) {
        const matcher = FILTER_MAP[item.key] || FILTER_MAP.all;
        return {
          ...item,
          count: orders.filter(matcher).length
        };
      });
    },
    filteredOrders() {
      const keyword = this.keyword.trim();
      const matcher = FILTER_MAP[this.activeFilter] || FILTER_MAP.all;

      return this.normalizedOrders.filter(function(order) {
        const inFilter = matcher(order);
        const inKeyword = !keyword || order.searchText.indexOf(keyword) >= 0;
        return inFilter && inKeyword;
      });
    }
  },
  onShow() {
    api.getWorkOrders().then((orders) => {
      this.orders = orders;
    });

    const savedFilter = uni.getStorageSync('business_3_task_filter');
    if (savedFilter) {
      const nextFilter = FILTER_ALIASES[savedFilter] || savedFilter;
      this.activeFilter = FILTER_KEYS.indexOf(nextFilter) >= 0 ? nextFilter : 'all';
      uni.removeStorageSync('business_3_task_filter');
    }
  },
  methods: {
    applySearch() {
      uni.showToast({ title: this.keyword.trim() ? '已搜索' : '请输入关键词', icon: 'none' });
    },
    toggleFilters() {
      uni.showToast({ title: '筛选条件演示中', icon: 'none' });
    },
    callCustomer(order) {
      uni.showToast({ title: '联系' + order.customer, icon: 'none' });
    },
    openOrder(id) {
      if (this.navigatingOrderId === id) {
        return;
      }
      this.navigatingOrderId = id;
      const page = this;
      uni.navigateTo({
        url: '/pages/work-orders/detail?id=' + encodeURIComponent(id),
        complete: function() {
          page.navigatingOrderId = '';
        },
        fail: function(error) {
          const message = error && error.errMsg ? error.errMsg : '打开任务详情失败';
          uni.showToast({ title: message, icon: 'none' });
        }
      });
    }
  }
};
</script>

<style scoped>
.tasks-page {
  min-height: 100vh;
  padding: 26rpx 28rpx 34rpx;
  background: #f7f9fc;
}

.search-row,
.task-name-row {
  display: flex;
  align-items: center;
}

.search-row {
  gap: 18rpx;
}

.search-field {
  flex: 1;
  min-width: 0;
  height: 88rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 28rpx;
  border: 1rpx solid #e2e7ef;
  border-radius: 16rpx;
  background: #ffffff;
}

.search-field-icon {
  flex: none;
  color: #64748b;
  font-size: 34rpx;
  font-weight: 700;
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 86rpx;
  color: #101827;
  font-size: 26rpx;
}

.search-button,
.filter-button {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 1;
}

.search-button {
  width: 134rpx;
  background: #1478ff;
  color: #ffffff;
}

.filter-button {
  width: 126rpx;
  border: 1rpx solid #dce5f0;
  background: #ffffff;
  color: #1f2937;
}

.button-icon {
  font-size: 32rpx;
  font-weight: 800;
}

.filter-scroll {
  margin-top: 28rpx;
  border-bottom: 1rpx solid #e6edf6;
  white-space: nowrap;
}

.filter-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0;
}

.filter-tab {
  position: relative;
  height: 66rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  color: #64748b;
  font-size: 28rpx;
  font-weight: 800;
}

.filter-tab.active {
  color: #1478ff;
}

.tab-underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 6rpx;
  border-radius: 999rpx;
  background: #1478ff;
}

.tab-count {
  color: currentColor;
  font-size: 28rpx;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 28rpx;
}

.task-card,
.empty-card {
  position: relative;
  overflow: hidden;
  padding: 28rpx 32rpx 28rpx 36rpx;
  border: 1rpx solid #e8edf4;
  border-radius: 18rpx;
  background: #ffffff;
  box-shadow: 0 16rpx 42rpx rgba(22, 40, 72, .06);
}

.task-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8rpx;
  background: #1478ff;
}

.task-card.red::before {
  background: #ff4052;
}

.task-card.orange::before {
  background: #ff8a1a;
}

.task-card.purple::before {
  background: #7459e8;
}

.task-card.green::before {
  background: #18ae65;
}

.task-grid {
  display: grid;
  grid-template-columns: 64rpx minmax(0, 1fr) 104rpx;
  column-gap: 20rpx;
  row-gap: 12rpx;
  align-items: center;
}

.task-left {
  display: flex;
  justify-content: center;
}

.task-main-row {
  min-width: 0;
}

.task-distance-spacer {
  min-width: 0;
}

.task-icon {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 900;
}

.task-icon.red {
  background: linear-gradient(145deg, #ff5b5d 0%, #f12f43 100%);
}

.task-icon.orange {
  background: linear-gradient(145deg, #ffad3c 0%, #ff7a10 100%);
}

.task-icon.purple {
  background: linear-gradient(145deg, #8e75f8 0%, #5c43d8 100%);
}

.task-icon.green {
  background: linear-gradient(145deg, #45d589 0%, #18a960 100%);
}

.task-content {
  min-width: 0;
}

.task-name-row {
  min-width: 0;
  gap: 10rpx;
}

.task-type {
  min-width: 0;
  overflow: hidden;
  color: #121a2a;
  font-size: 32rpx;
  font-weight: 900;
  line-height: 42rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip {
  flex: none;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  font-weight: 800;
  line-height: 32rpx;
  white-space: nowrap;
}

.chip-muted {
  background: #f3f5f7;
  color: #1f2933;
}

.chip-info {
  background: #eef5ff;
  color: #2563eb;
}

.order-no {
  flex: none;
  justify-self: end;
  color: #64748b;
  font-size: 28rpx;
  font-weight: 800;
  line-height: 38rpx;
  text-align: right;
}

.customer-row {
  min-width: 0;
}

.customer {
  color: #101827;
  font-size: 32rpx;
  font-weight: 900;
  line-height: 42rpx;
  white-space: nowrap;
}

.address-row {
  min-width: 0;
  color: #64748b;
  font-size: 28rpx;
  line-height: 38rpx;
}

.pin {
  color: #64748b;
  font-size: 30rpx;
}

.address {
  min-width: 0;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  white-space: normal;
}

.distance-box {
  align-self: start;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6rpx;
  color: #64748b;
  font-size: 22rpx;
  line-height: 30rpx;
}

.distance-text {
  white-space: nowrap;
}

.car-icon {
  color: #1478ff;
  font-size: 28rpx;
}

.footer-main {
  min-width: 0;
  display: flex;
  align-items: center;
}

.nearby-customer {
  min-width: 0;
  flex: none;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone-button {
  align-self: center;
  justify-self: end;
  width: 92rpx;
  height: 92rpx;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1rpx solid #e5eaf1;
  background: #ffffff;
  color: #1478ff;
  font-size: 42rpx;
  font-weight: 900;
}

.phone-button.red {
  color: #ff4052;
}

.phone-button.orange {
  color: #ff8a1a;
}

.phone-button.purple {
  color: #7459e8;
}

.phone-button.green {
  color: #18ae65;
}

.empty-title {
  display: block;
  color: #18253d;
  font-size: 28rpx;
  font-weight: 900;
}

.empty-copy {
  display: block;
  margin-top: 12rpx;
  color: #7a879b;
  font-size: 26rpx;
  line-height: 32rpx;
}

</style>
