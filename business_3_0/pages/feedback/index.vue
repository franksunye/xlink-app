<template>
  <view class="page">
    <view class="panel form">
      <text class="section-title">体验反馈</text>
      <text class="hint">用于概念版多人体验收集，不连接后台。</text>

      <view class="score-row">
        <button
          v-for="item in scores"
          :key="item"
          class="score"
          :class="{ active: score === item }"
          @tap="score = item"
        >
          {{ item }}
        </button>
      </view>

      <textarea
        v-model="content"
        class="textarea"
        maxlength="500"
        placeholder="记录你觉得顺手或别扭的地方"
      />

      <button class="primary-button submit" @tap="submit">提交</button>
    </view>
  </view>
</template>

<script>
import { api } from '../../services/api/index.js';

export default {
  data() {
    return {
      score: 4,
      scores: [1, 2, 3, 4, 5],
      content: ''
    };
  },
  methods: {
    submit() {
      api.submitFeedback({
        score: this.score,
        content: this.content
      }).then(() => {
        uni.showToast({
          title: '已保存',
          icon: 'success'
        });
        this.content = '';
      });
    }
  }
};
</script>

<style scoped>
.form {
  padding: 28rpx 24rpx;
}

.hint {
  display: block;
  margin-top: 10rpx;
  color: #6b7485;
  font-size: 26rpx;
  line-height: 36rpx;
}

.score-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12rpx;
  margin-top: 28rpx;
}

.score {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80rpx;
  border: 1rpx solid #dce3ea;
  border-radius: 8rpx;
  color: #6b7485;
  font-size: 28rpx;
  font-weight: 800;
}

.score.active {
  border-color: #176b87;
  background: #e6f4f8;
  color: #176b87;
}

.textarea {
  width: 100%;
  min-height: 220rpx;
  margin-top: 24rpx;
  padding: 20rpx;
  border: 1rpx solid #dce3ea;
  border-radius: 8rpx;
  background: #ffffff;
  color: #182338;
  font-size: 28rpx;
  line-height: 40rpx;
}

.submit {
  margin-top: 24rpx;
}
</style>
