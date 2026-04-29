<template>
  <view class="noticeManage">
    <block v-for="(item, i) in data" :key="i">
      <view v-if="i == 0" class="notice-top" @click="noticeClick(item)">
        <van-image
          fit="widthFix"
          width="100%"
          :src="downloadUrl + '' + item.fileids[0]"
          class="c-flex"
        ></van-image>
        <view class="title c-ellipsis2">{{ item.title }}</view>
      </view>
      <view v-else class="notice" @click="noticeClick(item)">
        <van-image
          fit="widthFix"
          width="150px"
          hight="80px"
          :src="downloadUrl + '' + item.fileids[0]"
          class="c-flex"
          custom-class="image"
        ></van-image>
        <view class="info" :style="i == data.length - 1 ? 'border:none' : ''">
          <view class="c-ellipsis2">{{ item.title }}</view>
          <view class="c-color-value c-size-14">{{ item.updateTime }}</view>
        </view>
      </view>
    </block>
    <van-empty v-if="data.length == 0" description="暂无公告" class="c-empty"></van-empty>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      downloadUrl: common.osg.downloadUrl,
      data: []
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.getData();
  },
  methods: {
    getData(isTop) {
      let params = {
        _all: '1',
        'is:type|integer#and': 3,
        'is:exts.chooseApplet|string#and': '3',
        sortField: 'isTop,createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('wmt/document/query', params, res => {
        this.data = res.data;
      });
    },
    noticeClick(item) {
      if (item.path) {
        common.osg.open(item.path, {
          documentId: item._id
        });
      } else {
        common.osg.open('detail', {
          id: item._id
        });
      }
    },
    onPullDownRefresh() {
      this.getData();
    }
  }
};
</script>

<style lang="scss">
page {
  padding-bottom: 1px;
}
.noticeManage {
  margin: 12px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  .notice-top {
    position: relative;
    .title {
      position: absolute;
      left: 15px;
      bottom: 10px;
      color: #fff;
      margin-right: 15px;
    }
  }
  .notice {
    display: flex;
    justify-content: space-between;
    .image {
      padding: 10px;
      .van-image__img {
        border-radius: 3px;
      }
    }
    .info {
      flex: 1;
      padding: 10px 0;
      margin-right: 10px;
      border-bottom: 1px solid #ebedf0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
}
</style>
