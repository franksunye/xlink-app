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
            <text>活动名称：</text>
            <text>卫生间防水一口价999元</text>
          </view>
        </view>
        <view class="c-flex c-flex-start">
          <image
            style="width: 80px; height: 80px; display: flex; border-radius: 8px; margin-right: 15px"
            fit="aspectFill"
            custom-class="card-image"
            src="https://pub.fsgo365.cn/case2.png"
            @click="previewImage('https://pub.fsgo365.cn/case2.png')"
            :data-event="{ id: 'Q9DT9xXHZM' }"
          />
          <view class="c-card-content">
            <view class="c-m-b-10">
              <text>活动价格：</text>
              <text>999元</text>
            </view>
            <view class="c-m-b-10">
              <text>开始时间：</text>
              <text>2023-07-11 00:00:00</text>
            </view>
            <view class="c-m-b-10">
              <text>结束时间：</text>
              <text>2023-08-31 00:00:00</text>
            </view>
          </view>
        </view>
        <view class="c-m-t-20">
          <view></view>
          <van-button
            custom-class="c-m-l-20"
            round
            type="info"
            size="small"
            color="#F9C10C"
            @click="open('./activityDetail', { id: item._id })"
            :data-event="{ id: 'jFLiLUgvll' }"
          >
            参与活动
          </van-button>
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
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    },
    previewImage(url, urls) {
      wx.previewImage({
        current: url,
        urls: urls || [url]
      });
    }
  }
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
