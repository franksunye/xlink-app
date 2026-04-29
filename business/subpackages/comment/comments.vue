<template>
  <view class="commons" @click.capture="track">
    <!-- 过滤 -->
    <view class="c-header" style="z-index: 2; padding: 5px 0; background: #f9f9f9">
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        use-action-slot
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20 c-search"
        background="#f9f9f9"
      ></van-search>
    </view>
    <!-- 列表 -->
    <view class="c-content">
      <view class="c-card" style="padding-top: 10px" v-for="(item, i) in 5" :key="i">
        <view class="c-card-title">
          <view class="c-flex">
            <text>工单编号：</text>
            <text>GD20230700010</text>
          </view>
        </view>
        <view class="c-card-content">
          <view class="c-m-b-10">
            <text>评价用户：</text>
            <text>aglaia</text>
          </view>
          <view class="c-m-b-10">
            <text>评价内容：</text>
            <text>师傅专业技术能力强，服务态度好，强烈推荐给有需求的小伙伴哦。</text>
          </view>
        </view>
        <view class="c-m-t-20">
          <van-rate
            :value="5"
            color="#F9DE55"
            void-icon="star"
            void-color="#eee"
            style="display: flex"
          />
          <van-switch :checked="false" size="20px" inactive-color="#efefef" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      searchValue: '',
      data: []
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
  },
  methods: {}
};
</script>
<style lang="scss">
.commons {
  .c-search {
    .van-search__content {
      background: #fff;
      border: 1rpx solid rgba(195, 195, 205, 0.5);
    }
  }
  .c-content {
    margin-top: 56px;
    padding-bottom: 30px;
  }
}
</style>
