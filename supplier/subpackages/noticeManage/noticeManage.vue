<template>
  <view class="c-content">
    <van-collapse :value="activeNames" @change="activeChange">
      <van-collapse-item title="置顶公告" name="1">
        <view>
          <view
            v-for="(item, index) in topNotice.data"
            :key="index"
            @tap="doOpen"
            :data-item="item"
            :class="
              index != topNotice.data.length - 1 ? 'c-border-b c-flex c-p-20' : 'c-flex c-p-20'
            "
          >
            <view class="view-image">
              <image :src="downloadUrl + '' + item.fileids[0]" mode="aspectFit"></image>
            </view>
            <view class="c-flex c-flex-col c-m-l-20 c-hidden c-size-14" style="height: 120rpx">
              <view class="c-black c-bold c-p-b-5">{{ item.title }}</view>
              <view class="c-green c-size-12">最近更新时间：{{ item.updateTime }}</view>
              <rich-text class="c-nowrap" :nodes="item.content"></rich-text>
            </view>
          </view>
        </view>
      </van-collapse-item>
      <van-collapse-item title="企业公告" name="2">
        <view>
          <view
            v-for="(item, index) in notice.data"
            :key="index"
            @tap="doOpen"
            :data-item="item"
            :class="index != notice.data.length - 1 ? 'c-border-b c-flex c-p-20' : 'c-flex c-p-20'"
          >
            <view class="view-image">
              <image :src="downloadUrl + '' + item.fileids[0]" mode="aspectFit"></image>
            </view>
            <view class="c-flex c-flex-col c-m-l-20 c-hidden c-size-14" style="height: 120rpx">
              <view class="c-black c-bold c-p-b-5">{{ item.title }}</view>
              <view class="c-green c-size-12">最近更新时间：{{ item.updateTime }}</view>
              <rich-text class="c-nowrap" :nodes="item.content"></rich-text>
            </view>
          </view>
        </view>
      </van-collapse-item>
    </van-collapse>

    <view v-if="fpi.rows >= fpi.total" class="c-text-center c-size-14 c-p-20">没有更多结果</view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      downloadUrl: common.osg.downloadUrl,
      activeNames: ['1', '2'],
      topNotice: {},
      notice: {}
    };
  },
  methods: {
    onLoad: function (param) {
      common.osg.init(this, param, app);
      // common.osg.codeoption(() => {
      this.getData(1);
      this.getData();
      // });
    },
    getData: function (isTop) {
      let params = {
        page: 1,
        rows: 20,
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:type|integer#and': 3,
        'is:isTop|integer#and': isTop || ''
      };
      common.osg.ajax('document/query', params, res => {
        if (isTop) {
          //1置顶
          this.setData({
            topNotice: res
          });
        } else {
          this.setData({
            notice: res
          });
        }
      });
    },
    activeChange: function (e) {
      this.setData({
        activeNames: e.detail
      });
    },
    doOpen: function (e) {
      common.osg.open('detail', {
        id: e.currentTarget.dataset.item._id
      });
    },
    onReachBottom: function () {
      if (this.notice.rows >= this.notice.total) return;
      this.notice.rows += 10;
      this.getData();
    },
    onPullDownRefresh: function () {
      this.getData();
    }
  }
};
</script>

<style>
page {
  background-color: #fff;
}

.c-content {
  margin-top: 0rpx;
}
</style>
