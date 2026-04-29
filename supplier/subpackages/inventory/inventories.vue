<template>
  <view class="c-box">
    <van-tabs swipeable sticky active="0" @change="ownerChange" style="padding-bottom: 110rpx">
      <van-tab title="我上架的" name="0">
        <view class="scroll-view-item uni-bg-red c-card" v-for="(item, i) in fpi.data" :key="i">
          <view class="c-card-title">
            <view class="c-flex c-item-center">
              <van-icon name="send-gift-o" />
              <text class="c-m-v-10">{{ item.primaryCode }}</text>
            </view>
          </view>
          <view>
            <text>产品名称：{{ item.name }}</text>
          </view>
          <view>
            <text>上架人员：{{ item.createUserName }}</text>
          </view>
          <view>
            <text>上架时间：{{ item.createTime }}</text>
          </view>
        </view>
      </van-tab>
      <van-tab title="门店上架的" name="1">
        <view class="scroll-view-item uni-bg-red c-card" v-for="(item, i) in fpi.data" :key="i">
          <view class="c-card-title">
            <view class="c-flex c-item-center">
              <van-icon name="send-gift-o" />
              <text class="c-m-v-10">{{ item.primaryCode }}</text>
            </view>
          </view>
          <view>
            <text>产品名称：{{ item.name }}</text>
          </view>
          <view>
            <text>上架人员：{{ item.createUserName }}</text>
          </view>
          <view>
            <text>上架时间：{{ item.createTime }}</text>
          </view>
        </view>
      </van-tab>
    </van-tabs>
    <view class="c-button-bottom c-bg-purple">
      <van-button @click="scanCode" type="info" block icon="scan">扫码录入</van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      fpi: {
        page: 1,
        rows: 20
      },
      tabIndex: '0'
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.getData();
  },
  methods: {
    ownerChange(e) {
      this.tabIndex = e.detail.index;
      this.$forceUpdate();
      this.getData();
    },
    getData() {
      let param = {
        'in:state|array-integer#and': '1',
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      if (this.tabIndex == '0') {
        param['is:userId|string#and'] = wx.getStorageSync('user')._id;
      } else if (this.tabIndex == '1') {
        param['in:partnerId|array#and'] = wx.getStorageSync('user').partnerIds.join();
      }
      common.osg.ajax('basic/productInventoryItem/query', param, res => {
        this.fpi = res;
        this.$forceUpdate();
      });
    },
    // 扫码二维码
    scanCode() {
      common.osg.scanCode(res => {
        this.doSave(res.result);
      });
    },
    doSave(url) {
      if (!url) {
        common.osg.toast('未获取到产品信息', 'error');
        return;
      }
      common.osg.ajax(
        'basic/productInventoryItem/verifyAndUpsert',
        {
          url
        },
        res => {
          common.osg.toast('上架成功');
          this.getData();
        }
      );
    },
    onReachBottom() {
      this.fpi.rows += 10;
      this.getData();
    }
  }
};
</script>
<style>
.c-card {
  min-height: 120px;
}
</style>
