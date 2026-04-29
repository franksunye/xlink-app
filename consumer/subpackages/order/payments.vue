<template>
  <view class="payments">
    <view v-for="(item, i) in data" :key="i" class="c-card">
      <view class="c-card-title">
        <view>订单编号：{{ orderId }}</view>
      </view>
      <view class="c-card-content">
        <view>
          <text>合同编号：</text>
          <text>{{ item.contractNum }}</text>
        </view>
        <view>
          <text>款项类型：</text>
          <text>{{ codelabel('orderPayType', item.orderType) }}</text>
        </view>
        <view>
          <text>支付类型</text>
          <text>{{ codelabel('tradeIn', item.tradeIn) }}</text>
        </view>
        <view>
          <text>支付方式：</text>
          <text>{{ codelabel('payType', item.payType) }}</text>
        </view>
        <!-- <view>
          <text>合同总额</text>
          <text class="c-red">¥{{ item.allPrice }}</text>
        </view> -->
        <view>
          <text>本次支付：</text>
          <text class="c-red">¥{{ item.price }}</text>
        </view>
        <view>
          <text>支付时间：</text>
          <text>{{ item.payTime }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      orderId: '',
      options: {
        codecfg_orderPayType: { codeId: 'orderPayType' },
        codecfg_tradeIn: { codeId: 'tradeIn' },
        codecfg_payType: { codeId: 'payType' }
      },
      data: []
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.orderId = params.orderId;
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    },
    getData() {
      common.osg.ajax(
        '/biz/pay/payment',
        { _all: '1', sortField: 'createTime', sortOrder: 'asc', orderId: this.orderId },
        res => {
          this.data = res.data;
        }
      );
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    }
  }
};
</script>

<style lang="scss">
.payments {
  background: #f8f8f8;
  height: 100vh;
  overflow-y: auto;
  .c-card-content {
    > view {
      display: flex;
      line-height: 26px;
      > text:first-child {
        min-width: 70px;
      }
      > text:last-child {
        color: #646566;
      }
    }
  }
  .c-card-footer {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
