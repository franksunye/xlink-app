<template>
  <view class="page">
    <view class="filter panel">
      <input v-model="keyword" class="search" placeholder="搜索客户、项目或工单" confirm-type="search" />
    </view>

    <view class="section order-list">
      <view v-for="order in filteredOrders" :key="order.id" class="order-card panel" @tap="openOrder(order.id)">
        <view class="order-head">
          <text class="order-id">{{ order.id }}</text>
          <text class="status-chip" :class="order.status">{{ order.statusText }}</text>
        </view>
        <text class="order-title">{{ order.title }}</text>
        <view class="meta-grid">
          <text>{{ order.customer }}</text>
          <text>{{ order.project }}</text>
          <text>{{ order.appointment }}</text>
          <text>负责人：{{ order.assignee }}</text>
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
      keyword: '',
      orders: []
    };
  },
  computed: {
    filteredOrders() {
      const keyword = this.keyword.trim();
      if (!keyword) {
        return this.orders;
      }

      return this.orders.filter(function(order) {
        return [
          order.id,
          order.title,
          order.customer,
          order.project,
          order.assignee
        ].join(' ').indexOf(keyword) >= 0;
      });
    }
  },
  onLoad() {
    api.getWorkOrders().then((orders) => {
      this.orders = orders;
    });
  },
  methods: {
    openOrder(id) {
      uni.navigateTo({
        url: '/pages/work-orders/detail?id=' + encodeURIComponent(id)
      });
    }
  }
};
</script>

<style scoped>
.filter {
  padding: 18rpx 22rpx;
}

.search {
  width: 100%;
  min-height: 64rpx;
  color: #182338;
  font-size: 28rpx;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.order-card {
  padding: 24rpx;
}

.order-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.order-id {
  color: #6b7485;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 32rpx;
}

.order-title {
  display: block;
  margin-top: 16rpx;
  color: #182338;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 44rpx;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx 18rpx;
  margin-top: 20rpx;
  color: #6b7485;
  font-size: 24rpx;
  line-height: 32rpx;
}
</style>
