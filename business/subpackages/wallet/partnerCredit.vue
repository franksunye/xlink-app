<template>
  <view class="partnerCredit" @click.capture="track">
    <view class="card">
      <view>{{ formData.name || '我的信用账户' }}</view>
      <view class="c-flex c-flex-around c-item-center c-flex-wrap c-m-t-30 c-m-b-30">
        <view class="c-flex c-flex-col c-item-center">
          <text class="c-size-14">信用额度</text>
          <view>
            <text class="c-m-r-10">¥</text>
            <text class="c-size-24">{{ formData.creditLimit || 0 }}</text>
          </view>
        </view>
        <view class="c-flex c-flex-col c-item-center">
          <text class="c-size-14">返利额度</text>
          <view>
            <text class="c-m-r-10">¥</text>
            <text class="c-size-24">{{ formData.rewardLimit || 0 }}</text>
          </view>
        </view>
      </view>
      <!-- <van-button size="small" round color="#F03A23" plain @click="doOpen('./recharge')" :data-event="{id:'kJfcQx_F40'}">
          账户充值
        </van-button> -->
      <view class="c-w-100 c-flex c-flex-around c-item-center card-bottom">
        <view
          class="c-flex c-item-center"
          @click="doOpen('./recharge')"
          :data-event="{ id: 'cw0dNFQHbh' }"
        >
          <van-icon name="gold-coin-o" class="c-m-r-10" :data-event="{ id: 'cw0dNFQHbh' }" />
          <text class="c-size-14" :data-event="{ id: 'cw0dNFQHbh' }">充值</text>
        </view>
        <view
          class="c-flex c-item-center"
          @click="doOpen('./rechargeRecord')"
          :data-event="{ id: 'LaMWzQaUXs' }"
        >
          <van-icon name="balance-list-o" class="c-m-r-10" :data-event="{ id: 'LaMWzQaUXs' }" />
          <text class="c-size-14" :data-event="{ id: 'LaMWzQaUXs' }">充值记录</text>
        </view>
        <view
          class="c-flex c-item-center"
          @click="doOpen('./partnerCreditItem')"
          :data-event="{ id: 'lPX0RWMQn-' }"
        >
          <van-icon name="balance-list-o" class="c-m-r-10" :data-event="{ id: 'lPX0RWMQn-' }" />
          <text class="c-size-14" :data-event="{ id: 'lPX0RWMQn-' }">金额明细</text>
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
      formData: {}
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.getPartnerCredit();
  },
  onShow() {},
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    getPartnerCredit() {
      common.osg.ajax('/basic/partnerCredit/show', {}, res => {
        this.formData = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.partnerCredit {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
  .card {
    border-radius: 8px;
    margin: 16px;
    padding: 16px 16px 8px;
    background: linear-gradient(219deg, #eb2b1e 0%, #f75429 100%);
    color: #fff;
    .card-bottom {
      border-top: 1px solid #fff;
      padding-top: 8px;
    }
  }
}
</style>
