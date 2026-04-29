<template>
  <view class="account">
    <view class="orderStateTitle">订单状态</view>
    <view class="orderCard">
      <view class="c-flex">
        <image
          style="width: 68px; padding: 10px 10px 0 10px"
          mode="widthFix"
          :src="'https://pub.fsgo365.cn/7315652511887609320.png'"
        />
        <view>
          <view class="c-flex">
            <image style="width: 61px" mode="widthFix" src="../../static/images/goodsLogo.png" />
            <view class="orderCardTitle">屋顶防水维修服务</view>
          </view>

          <view class="orderCardStateBtn">完成</view>
        </view>
      </view>
      <view class="c-flex totalRevenue">
        <view>收益总计：</view>
        <view>￥500</view>
      </view>
      <view class="orderCardConter">
        <view>有效线索佣金：¥100</view>
        <view>完成交付佣金：¥500</view>
      </view>
      <view class="orderCardConter">
        <view>有效成交金额：¥10000</view>
        <view>佣金比例：5%</view>
      </view>
      <view class="orderCardLast">
        <view>2023年8月1日 18:02完成交付</view>
      </view>
    </view>
    <view></view>
    <!--  -->
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      systemInfo: {
        menuButtonObject: {}
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
  },
  onShow() {},
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 10px;
  background: #f8f8f8;
}

.orderStateTitle {
  color: #000;
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  padding: 17px 0 10px 10px;
}

.orderCard {
  border-radius: 8px;
  margin: 10px;
  background: #fff;
  .orderCardTitle {
    padding-left: 10px;
    color: #000;
    font-size: 14px;
    font-weight: 500;
  }
  .orderCardStateBtn {
    margin-top: 20px;
    width: 68px;
    height: 24px;
    line-height: 24px;
    border-radius: 80px;
    background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
    color: #fff;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
  }
  .totalRevenue {
    line-height: 25px;
    height: 25px;
    padding: 10px 0 5px 10px;
    > view:first-child {
      padding-right: 3px;
      color: #000;
      font-size: 12px;
      font-weight: 500;
    }
    > view:last-child {
      color: #000;
      font-size: 20px;
      font-weight: 500;
    }
  }
  .orderCardConter {
    position: relative;
    padding: 0 10px 10px 10px;
    display: flex;
    justify-content: space-between;
    > view {
      color: #000;
      font-size: 12px;
      font-weight: 500;
    }
    > view:last-child {
      position: absolute;
      left: 180px;
    }
  }
  .orderCardLast {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    > view {
      color: #6d6d6d;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
</style>
