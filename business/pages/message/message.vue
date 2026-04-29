<template>
  <view @click.capture="track">
    <view class="noticeManage">
      <block v-for="(item, i) in data" :key="i">
        <view class="notice" @click="noticeClick(item)" :data-event="{ id: 'ivQEIgIMfM' }">
          <view class="notice_image" :data-event="{ id: 'ivQEIgIMfM' }">
            <image :src="downloadUrl + item.fileids[0]" :data-event="{ id: 'ivQEIgIMfM' }"></image>
          </view>
          <view
            class="info"
            :style="i == data.length - 1 ? 'border:none' : ''"
            :data-event="{ id: 'ivQEIgIMfM' }"
          >
            <view class="c-ellipsis2" :data-event="{ id: 'ivQEIgIMfM' }">{{ item.title }}</view>
            <view class="c-color-value c-size-14" :data-event="{ id: 'ivQEIgIMfM' }">
              {{ item.updateTime }}
            </view>
          </view>
        </view>
      </block>
    </view>
    <van-empty v-if="data.length == 0" description="暂无公告" class="c-empty"></van-empty>
    <Tabbar></Tabbar>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      downloadUrl: common.osg.downloadUrl,
      data: [],
      TabbarShow: false
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.getData();
  },
  onShow() {},
  onHide() {},
  methods: {
    getData(isTop) {
      let params = {
        _all: '1',
        'is:type|integer#and': 3,
        'is:exts.chooseApplet|string#and': '1',
        sortField: 'isTop,createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('document/query', params, res => {
        this.data = res.data;
      });
    },
    noticeClick(item) {
      console.log(item);
      if (item.path) {
        common.osg.open(item.path, {
          documentId: item._id
        });
      } else {
        common.osg.open('/subpackages/noticeManage/detail', {
          id: item._id
        });
      }
    },
    onPullDownRefresh() {
      this.getData();
    },
    abc(url) {
      console.log(this.downloadUrl + url);
      return this.downloadUrl + url;
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
  .notice {
    display: flex;
    justify-content: space-between;
    .notice_image {
      width: 150px;
      height: 85px;
      border-radius: 3px;
      margin: 12px;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      flex: 1;
      padding: 12px 0;
      margin-right: 12px;
      border-bottom: 1px solid #ebedf0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
}
</style>
