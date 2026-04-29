<template>
  <view class="course">
    <view class="c-flex">
      <video
        v-if="formData.videos"
        class="c-w-1"
        id="myVideo"
        :src="formData.videos[0] && formData.videos[0].url"
        controls
      ></video>
    </view>
    <van-tabs
      :active="activeTab"
      color="#067CD2"
      title-active-color="#067CD2"
      line-width="0"
      line-height="0"
      :ellipsis="false"
      custom-class="c-tabs"
    >
      <van-tab title="课程内容" name="1"></van-tab>
    </van-tabs>
    <rich-text class="content" :nodes="formData.content"></rich-text>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      id: '',
      activeTab: '1',
      formData: {}
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.id = params.id;
    this.getData();
  },
  methods: {
    getData() {
      common.osg.ajax('learnings/findById', { id: this.id }, res => {
        res.data.content = res.data.content.replace(
          /<img /g,
          '<img style="max-width:100%;display:flex;" '
        );
        this.formData = res.data;
        uni.setNavigationBarTitle({
          title: res.data.name
        });
      });
    }
  }
};
</script>

<style lang="scss">
.course {
  background-color: #fff;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .c-tabs {
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
  }
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
}
</style>
