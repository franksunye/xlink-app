<template>
  <view class="detail-page">
    <view class="summary-card">
      <view class="summary-top">
        <view class="summary-title-group">
          <view class="task-type-row">
            <text class="task-type">{{ order.customer }}</text>
            <text class="part-chip">{{ order.displayPart }}</text>
          </view>
        </view>
        <text class="order-no">#{{ order.displayOrderNo }}</text>
      </view>

      <view class="address-row">
        <text class="address">{{ order.address }}</text>
        <text class="distance">{{ order.distance }}</text>
      </view>

      <view class="quick-actions">
        <button @tap="contactCustomer">
          <x-icon name="phone" class="quick-action-icon" />
          <text>联系客户</text>
        </button>
        <button @tap="showToast('客户资料')">
          <x-icon name="workOrder" class="quick-action-icon" />
          <text>客户资料</text>
        </button>
        <button @tap="showToast('记录跟进')">
          <x-icon name="contract" class="quick-action-icon" />
          <text>记录跟进</text>
        </button>
        <button @tap="showToast('导航')">
          <x-icon name="location" class="quick-action-icon" />
          <text>导航</text>
        </button>
      </view>
    </view>

    <view class="current-card" :class="taskTone">
      <view class="current-copy">
        <text class="section-eyebrow">当前任务</text>
        <text class="current-title">{{ context.title }}</text>
        <text class="current-desc">{{ context.desc }}</text>
      </view>
      <button class="primary-action" :class="taskTone" @tap="handlePrimary">{{ context.primary }}</button>
    </view>

    <view class="context-card" :class="taskTone">
      <view class="context-head">
        <text class="section-eyebrow">任务上下文</text>
        <text class="context-state">{{ context.badge }}</text>
      </view>
      <view class="context-body">
        <view class="context-icon" :class="taskTone">
          <text>{{ context.contextIcon }}</text>
        </view>
        <view class="context-main">
          <text class="context-title">{{ context.contextTitle }}</text>
          <text class="context-desc">{{ context.contextDesc }}</text>
          <view v-if="context.photos && context.photos.length" class="photo-row">
            <view v-for="photo in context.photos" :key="photo" class="photo-thumb">{{ photo }}</view>
          </view>
        </view>
      </view>
      <button class="context-action" :class="taskTone" @tap="handleSecondary">
        <text v-if="contextActionIcon" class="context-action-icon">{{ contextActionIcon }}</text>
        <text class="context-action-text">{{ context.secondary }}</text>
        <text v-if="showContextChevron" class="context-action-arrow">›</text>
      </button>
    </view>

    <view class="tab-card">
      <scroll-view class="tab-scroll" scroll-x>
        <view class="tab-row">
          <button
            v-for="(tab, index) in tabs"
            :key="tab.key || index"
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            @tap="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </view>
      </scroll-view>

      <view v-if="activeTab === 'records'" class="record-list">
        <view v-for="record in visibleRecords" :key="record.id" class="record-row">
          <view class="record-rail">
            <view class="record-icon" :class="record.tone">{{ record.icon }}</view>
            <view class="record-line"></view>
          </view>
          <view class="record-content">
            <view class="record-title-row">
              <text class="record-title">{{ record.title }}</text>
              <text v-if="record.badge" class="record-badge" :class="record.tone">{{ record.badge }}</text>
            </view>
            <text class="record-copy">{{ record.content }}</text>
            <view v-if="record.photos && record.photos.length" class="record-photos">
              <view v-for="photo in record.photos" :key="photo" class="record-photo">{{ photo }}</view>
            </view>
            <view class="record-meta">
              <text>👷 {{ record.owner || order.assignee }}</text>
              <text>{{ record.time }}</text>
            </view>
          </view>
        </view>
        <button class="more-records" @tap="showToast('展开更多')">展开更多 ›</button>
      </view>

      <view v-else-if="activeTab === 'customer'" class="info-list">
        <view v-for="item in customerRows" :key="item.label" class="info-row">
          <text>{{ item.label }}</text>
          <text>{{ item.value }}</text>
        </view>
      </view>

      <view v-else-if="activeTab === 'order'" class="info-list">
        <view v-if="!orderRows.length" class="empty-state">
          <text class="empty-state-title">暂无订单信息</text>
          <text class="empty-state-desc">当前任务还未进入下单阶段，确认方案后会生成订单信息。</text>
        </view>
        <view v-for="item in orderRows" :key="item.label" class="info-row">
          <text>{{ item.label }}</text>
          <text>{{ item.value }}</text>
        </view>
      </view>

      <view v-else-if="activeTab === 'materials'" class="materials">
        <view v-if="!materialRows.length" class="empty-state">
          <text class="empty-state-title">暂无资料</text>
          <text class="empty-state-desc">当前任务暂未产生现场照片、勘察记录或报价方案。</text>
        </view>
        <view v-for="item in materialRows" :key="item.title" class="material-card" :class="item.tone">
          <text class="material-title">{{ item.title }}</text>
          <text class="material-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { api } from '../../services/api/index.js';
import XIcon from '../../components/x-icon/x-icon.vue';

const DEFAULT_CONTEXT = {
  title: '需要联系客户',
  desc: '请尽快与客户沟通需求，确认上门意向',
  badge: '未预约',
  primary: '联系客户',
  secondary: '新增预约时间',
  tone: 'blue',
  contextIcon: '▣',
  contextTitle: '暂无预约时间',
  contextDesc: '请与客户沟通上门时间，完成首次预约'
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
  const normalized = order || {};
  return {
    ...normalized,
    displayPart: normalized.part || '屋顶',
    displayOrderNo: getOrderNo(normalized),
    iconName: TASK_ICON_MAP[normalized.taskType] || 'workOrder'
  };
}

export default {
  components: {
    XIcon
  },
  data() {
    return {
      order: {
        id: '',
        tone: 'blue',
        icon: '☎',
        iconName: 'workOrder',
        displayPart: '屋顶',
        displayOrderNo: '',
        customer: '',
        title: '',
        tags: [],
        customerInfo: [],
        orderInfoTitle: '',
        orderInfo: null,
        materials: [],
        followRecords: [],
        context: DEFAULT_CONTEXT
      },
      activeTab: 'records',
      tabs: [
        { key: 'records', label: '跟进记录' },
        { key: 'customer', label: '客户信息' },
        { key: 'order', label: '订单信息' },
        { key: 'materials', label: '资料' }
      ]
    };
  },
  computed: {
    context() {
      return {
        ...DEFAULT_CONTEXT,
        ...(this.order.context || {})
      };
    },
    visibleRecords() {
      return this.order.followRecords || [];
    },
    taskTone() {
      return this.order.tone || this.context.tone || 'blue';
    },
    customerRows() {
      if (this.order.customerInfo && this.order.customerInfo.length) {
        return this.order.customerInfo;
      }
      return [
        { label: '客户姓名', value: this.order.customer },
        { label: '客户标签', value: this.tagText },
        { label: '服务地址', value: this.order.address },
        { label: '客户编号', value: this.order.customerNo || this.order.id }
      ];
    },
    orderRows() {
      return this.order.orderInfo || [];
    },
    materialRows() {
      return this.order.materials || [];
    },
    tagText() {
      const tags = this.order.tags || [];
      if (!tags.length) {
        return '普通客户';
      }
      return tags.map(function(tag) {
        return tag.text;
      }).join('、');
    },
    contextActionIcon() {
      const label = this.context.secondary || '';
      if (label.indexOf('新增') >= 0) {
        return '+';
      }
      if (label.indexOf('修改') >= 0) {
        return '✎';
      }
      if (label.indexOf('查看') >= 0) {
        return '';
      }
      return '';
    },
    showContextChevron() {
      const label = this.context.secondary || '';
      return label.indexOf('新增') < 0;
    }
  },
  onLoad(query) {
    const id = query && query.id ? query.id : '';
    const page = this;
    api.getWorkOrder(id).then(function(order) {
      page.order = {
        ...page.order,
        ...normalizeOrder(order)
      };
    });
  },
  methods: {
    contactCustomer() {
      uni.showToast({ title: '联系' + this.order.customer, icon: 'none' });
    },
    handlePrimary() {
      uni.showToast({ title: this.context.primary, icon: 'none' });
    },
    handleSecondary() {
      uni.showToast({ title: this.context.secondary, icon: 'none' });
    },
    showToast(title) {
      uni.showToast({ title, icon: 'none' });
    }
  }
};
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 18rpx 20rpx 34rpx;
  background: #f7f9fc;
}

.summary-top,
.task-type-row,
.address-row,
.quick-actions,
.context-head,
.context-body,
.tab-row,
.record-title-row,
.record-meta,
.info-row {
  display: flex;
  align-items: center;
}

.summary-card,
.current-card,
.context-card,
.tab-card {
  border: 1rpx solid #e4e9f1;
  border-radius: 16rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 34rpx rgba(22, 40, 72, .07);
}

.summary-card {
  margin-top: 12rpx;
  padding: 20rpx 20rpx 18rpx;
}

.record-icon.red {
  background: #ff4352;
}

.record-icon.orange {
  background: #ff8a1a;
}

.record-icon.purple {
  background: #7459e8;
}

.record-icon.green {
  background: #18ae65;
}

.record-icon.blue {
  background: #1478ff;
}

.summary-top {
  justify-content: space-between;
  gap: 16rpx;
}

.summary-title-group,
.task-type-row {
  display: flex;
  align-items: center;
}

.summary-title-group {
  flex: 1;
  min-width: 0;
}

.task-type-row {
  min-width: 0;
  gap: 8rpx;
}

.task-type {
  min-width: 0;
  overflow: hidden;
  color: #101827;
  font-size: 32rpx;
  font-weight: 900;
  line-height: 42rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.part-chip {
  flex: none;
  padding: 5rpx 10rpx;
  border-radius: 6rpx;
  background: #f3f5f7;
  color: #1f2933;
  font-size: 24rpx;
  font-weight: 900;
  line-height: 30rpx;
  white-space: nowrap;
}

.alert-chip,
.status-chip {
  padding: 5rpx 10rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 900;
}

.alert-chip {
  background: #ffe8e9;
  color: #ff4052;
}

.status-chip {
  background: #eef2f8;
  color: #778191;
}

.time-text {
  flex: none;
  color: #ff4052;
  font-size: 24rpx;
  font-weight: 900;
  text-align: right;
  white-space: nowrap;
}

.time-text.orange { color: #ff8a1a; }
.time-text.purple { color: #7459e8; }
.time-text.green { color: #18ae65; }
.time-text.blue { color: #1478ff; }

.order-no {
  flex: none;
  color: #64748b;
  font-size: 26rpx;
  font-weight: 900;
  line-height: 36rpx;
  text-align: right;
  white-space: nowrap;
}

.title {
  min-width: 0;
  overflow: hidden;
  color: #252d3d;
  font-size: 26rpx;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.address-row {
  align-items: flex-start;
  gap: 12rpx;
  margin-top: 12rpx;
  color: #7c8595;
  font-size: 26rpx;
  line-height: 36rpx;
}

.address {
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  white-space: normal;
}

.distance {
  flex: none;
  color: #64748b;
  font-size: 24rpx;
  line-height: 36rpx;
  white-space: nowrap;
}

.quick-actions {
  gap: 12rpx;
  margin-top: 16rpx;
}

.quick-actions button {
  flex: 1;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  border: 1rpx solid #e1e7f0;
  border-radius: 10rpx;
  background: #fbfdff;
  color: #1478ff;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 1;
}

.quick-action-icon {
  font-size: 24rpx;
}

.current-card,
.context-card,
.tab-card {
  margin-top: 16rpx;
}

.current-card {
  position: relative;
  min-height: 156rpx;
  padding: 18rpx 18rpx 20rpx;
  overflow: hidden;
  border-color: #cfe3ff;
  background: #f7fbff;
}

.current-card.red { border-color: #ffd1d7; background: #fff8f9; }
.current-card.orange { border-color: #ffd9ad; background: #fffaf4; }
.current-card.purple { border-color: #dccfff; background: #fbf8ff; }
.current-card.green { border-color: #ccefdc; background: #f7fffa; }
.current-card.gray { border-color: #d8dde6; background: #fbfcfe; }

.section-eyebrow {
  display: block;
  color: #1478ff;
  font-size: 24rpx;
  font-weight: 900;
}

.current-card.red .section-eyebrow,
.context-card.red .section-eyebrow { color: #ff4052; }
.current-card.orange .section-eyebrow,
.context-card.orange .section-eyebrow { color: #ff8a1a; }
.current-card.purple .section-eyebrow,
.context-card.purple .section-eyebrow { color: #7459e8; }
.current-card.green .section-eyebrow,
.context-card.green .section-eyebrow { color: #18ae65; }
.current-card.gray .section-eyebrow,
.context-card.gray .section-eyebrow { color: #687386; }

.current-title {
  display: block;
  margin-top: 8rpx;
  color: #101827;
  font-size: 30rpx;
  font-weight: 900;
  line-height: 40rpx;
}

.current-desc {
  display: block;
  margin-top: 6rpx;
  color: #697386;
  font-size: 26rpx;
  line-height: 36rpx;
}

.primary-action {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9rpx;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 1;
}

.primary-action {
  width: 100%;
  margin-top: 18rpx;
  background: #1478ff;
}

.primary-action.red { background: #ff4052; }
.primary-action.orange { background: #ff8a1a; }
.primary-action.purple { background: #7459e8; }
.primary-action.green { background: #18ae65; }
.primary-action.gray { background: #8b94a3; }

.context-card {
  padding: 18rpx;
  border-style: dashed;
  border-color: #cfe3ff;
  background: #fbfdff;
}

.context-card.red { border-color: #ffd1d7; background: #fff8f9; }
.context-card.orange { border-color: #ffd9ad; background: #fffaf4; }
.context-card.purple { border-color: #dccfff; background: #fbf8ff; }
.context-card.green { border-color: #ccefdc; background: #f7fffa; }
.context-card.gray { border-color: #d8dde6; background: #fbfcfe; }

.context-head {
  justify-content: space-between;
}

.context-state {
  color: #1478ff;
  font-size: 24rpx;
  font-weight: 900;
}

.context-card.red .context-state { color: #ff4052; }
.context-card.orange .context-state { color: #ff8a1a; }
.context-card.purple .context-state { color: #7459e8; }
.context-card.green .context-state { color: #18ae65; }
.context-card.gray .context-state { color: #687386; }

.context-body {
  align-items: flex-start;
  gap: 16rpx;
  margin-top: 14rpx;
}

.context-icon {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10rpx;
  background: #e8f2ff;
  color: #1478ff;
  font-size: 24rpx;
  font-weight: 900;
}

.context-icon.red { background: #ffe8eb; color: #ff4052; }
.context-icon.orange { background: #fff0dc; color: #ff8a1a; }
.context-icon.purple { background: #efeaff; color: #7459e8; }
.context-icon.green { background: #e8f8ef; color: #18ae65; }
.context-icon.gray { background: #edf1f6; color: #687386; }

.context-main {
  flex: 1;
  min-width: 0;
}

.context-title {
  display: block;
  color: #101827;
  font-size: 28rpx;
  font-weight: 900;
}

.context-desc {
  display: block;
  margin-top: 8rpx;
  color: #687386;
  font-size: 26rpx;
  line-height: 36rpx;
}

.photo-row,
.record-photos,
.materials {
  display: flex;
  gap: 10rpx;
}

.photo-thumb,
.record-photo {
  width: 72rpx;
  height: 54rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  background: linear-gradient(135deg, #d9e0e8 0%, #f5f7fa 100%);
  color: #7d8797;
  font-size: 24rpx;
}

.photo-row {
  margin-top: 10rpx;
}

.context-action {
  position: relative;
  width: 100%;
  height: 72rpx;
  margin-top: 16rpx;
  padding: 0 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  border: 1rpx solid #b9d6ff;
  border-radius: 9rpx;
  background: #fbfdff;
  color: #1478ff;
  font-size: 26rpx;
  font-weight: 900;
  line-height: 1;
}

.context-action.green {
  border-color: #a6dfc2;
  background: #f3fff8;
  color: #18ae65;
}

.context-action.red {
  border-color: #ffc6cf;
  background: #fff8f9;
  color: #ff4052;
}

.context-action.orange {
  border-color: #ffd6a6;
  background: #fffaf4;
  color: #ff8a1a;
}

.context-action.purple {
  border-color: #d6c8ff;
  background: #fbf8ff;
  color: #7459e8;
}

.context-action.gray {
  border-color: #d8dde6;
  background: #fbfcfe;
  color: #687386;
}

.context-action-icon {
  min-width: 28rpx;
  color: currentColor;
  font-size: 30rpx;
  line-height: 1;
  text-align: center;
}

.context-action-text {
  color: currentColor;
}

.context-action-arrow {
  position: absolute;
  right: 22rpx;
  color: currentColor;
  font-size: 36rpx;
  line-height: 1;
}

.tab-card {
  overflow: hidden;
}

.tab-scroll {
  white-space: nowrap;
  border-bottom: 1rpx solid #edf1f6;
}

.tab-row {
  display: inline-flex;
  min-width: 100%;
}

.tab-item {
  position: relative;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 22rpx;
  color: #6f7787;
  font-size: 26rpx;
  font-weight: 900;
  line-height: 1;
}

.tab-item.active {
  color: #1478ff;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  left: 22rpx;
  right: 22rpx;
  bottom: 0;
  height: 4rpx;
  border-radius: 999rpx;
  background: #1478ff;
}

.record-list {
  padding: 20rpx 18rpx 10rpx;
}

.record-row {
  display: flex;
  gap: 14rpx;
}

.record-row:last-child .record-line {
  display: none;
}

.record-rail {
  width: 42rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.record-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 900;
}

.record-line {
  width: 2rpx;
  flex: 1;
  margin-top: 6rpx;
  background: #e1e7f0;
}

.record-content {
  flex: 1;
  min-width: 0;
  padding-bottom: 24rpx;
}

.record-title-row {
  gap: 10rpx;
}

.record-title {
  color: #101827;
  font-size: 28rpx;
  font-weight: 900;
}

.record-badge {
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
  background: #e8f2ff;
  color: #1478ff;
  font-size: 24rpx;
  font-weight: 900;
}

.record-badge.orange { background: #fff0dc; color: #ff8a1a; }
.record-badge.purple { background: #efeaff; color: #7459e8; }
.record-badge.green { background: #e8f8ef; color: #18ae65; }
.record-badge.red { background: #ffe8e9; color: #ff4052; }

.record-copy {
  display: block;
  margin-top: 8rpx;
  color: #4e596d;
  font-size: 26rpx;
  line-height: 36rpx;
}

.record-photos {
  margin-top: 10rpx;
}

.record-meta {
  gap: 22rpx;
  margin-top: 9rpx;
  color: #8d95a5;
  font-size: 24rpx;
}

.more-records {
  width: 100%;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1478ff;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 1;
}

.info-list {
  padding: 10rpx 20rpx 18rpx;
}

.info-row {
  justify-content: space-between;
  gap: 20rpx;
  min-height: 72rpx;
  border-bottom: 1rpx solid #edf1f6;
  color: #7a8394;
  font-size: 26rpx;
}

.info-row text:last-child {
  color: #192234;
  font-weight: 800;
  text-align: right;
}

.materials {
  flex-direction: column;
  padding: 20rpx;
}

.empty-state {
  width: 100%;
  padding: 34rpx 26rpx;
  border: 1rpx dashed #d8e0eb;
  border-radius: 12rpx;
  background: #fbfcfe;
  text-align: center;
}

.empty-state-title {
  display: block;
  color: #354052;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 38rpx;
}

.empty-state-desc {
  display: block;
  margin-top: 8rpx;
  color: #7a8394;
  font-size: 24rpx;
  line-height: 34rpx;
}

.material-card {
  padding: 18rpx;
  border: 1rpx solid #e3eaf3;
  border-radius: 12rpx;
  background: #fbfdff;
}

.material-card + .material-card {
  margin-top: 14rpx;
}

.material-card.orange { border-color: #ffd9ad; background: #fffaf4; }
.material-card.purple { border-color: #dccfff; background: #fbf8ff; }
.material-card.green { border-color: #ccefdc; background: #f7fffa; }
.material-card.red { border-color: #ffd1d7; background: #fff8f9; }

.material-title {
  display: block;
  color: #101827;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 38rpx;
}

.material-desc {
  display: block;
  margin-top: 6rpx;
  color: #697386;
  font-size: 26rpx;
  line-height: 36rpx;
}
</style>
