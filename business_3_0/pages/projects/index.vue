<template>
  <view class="page">
    <view class="project-list">
      <view v-for="project in projects" :key="project.id" class="project-card panel">
        <view class="project-head">
          <view>
            <text class="project-name">{{ project.name }}</text>
            <text class="project-stage">{{ project.stage }}</text>
          </view>
          <text class="owner">{{ project.owner }}</text>
        </view>

        <view class="progress">
          <view class="progress-line">
            <view class="progress-fill" :style="{ width: project.progress + '%' }"></view>
          </view>
          <text class="progress-text">{{ project.progress }}%</text>
        </view>

        <view class="risk-row">
          <text class="muted">当前关注</text>
          <text class="risk">{{ project.risk }}</text>
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
      projects: []
    };
  },
  onLoad() {
    api.getProjects().then((projects) => {
      this.projects = projects;
    });
  }
};
</script>

<style scoped>
.project-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.project-card {
  padding: 24rpx;
}

.project-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.project-name {
  display: block;
  color: #182338;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 44rpx;
}

.project-stage {
  display: block;
  margin-top: 8rpx;
  color: #6b7485;
  font-size: 24rpx;
  line-height: 32rpx;
}

.owner {
  color: #176b87;
  font-size: 26rpx;
  font-weight: 800;
  line-height: 36rpx;
}

.progress {
  display: grid;
  grid-template-columns: 1fr 80rpx;
  align-items: center;
  gap: 18rpx;
  margin-top: 30rpx;
}

.progress-line {
  height: 14rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: #edf1f5;
}

.progress-fill {
  height: 100%;
  border-radius: 999rpx;
  background: #176b87;
}

.progress-text {
  color: #182338;
  font-size: 26rpx;
  font-weight: 800;
  text-align: right;
}

.risk-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 24rpx;
}

.risk-row .muted,
.risk {
  font-size: 24rpx;
  line-height: 34rpx;
}

.risk {
  color: #b7791f;
  font-weight: 700;
  text-align: right;
}
</style>
