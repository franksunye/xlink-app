<template>
  <view style="padding: 1px 0 20px">
    <block v-if="fpi.data && fpi.data.length > 0">
      <view v-for="(item, i) in fpi.data" :key="i" class="c-card">
        <view class="c-card-title">{{ item.name }}</view>
        <view class="c-card-content">
          <view>
            访客数量：
            <text class="c-red">{{ item.count }}</text>
          </view>
          <view v-if="item.orgName">服务商：{{ item.orgName }}</view>
          <view v-if="item.memo">备注：{{ item.memo }}</view>
          <view>创建时间：{{ item.createTime }}</view>
        </view>
        <view class="c-card-footer">
          <view></view>
          <van-button plain round type="danger" size="small" @click="doOpen(item._id)">
            查看渠道访客
          </van-button>
        </view>
      </view>
    </block>
    <van-empty v-else description="暂无数据" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      urlParams: {},
      fpi: {
        data: []
      }
    };
  },
  onLoad(params) {},
  onShow() {
    this.urlParams = common.osg.getUrlParams();
    this.doInit();
  },
  methods: {
    doInit(params) {
      common.osg.init(params);
      this.getData();
    },
    getData() {
      common.osg.ajax(
        `~${common.osg.host}/fsgo/w/channel/queryByOpenId`,
        { _all: '1', 'is:state|integer#and': 1, sortField: 'createTime', sortOrder: 'desc' },
        res => {
          this.fpi = res;
        },
        { header: this.urlParams }
      );
    },
    doOpen(id) {
      common.osg.open('visitors', Object.assign(this.urlParams, { id }));
    }
  }
};
</script>

<style>
.van-empty {
  height: 100vh;
}
</style>
