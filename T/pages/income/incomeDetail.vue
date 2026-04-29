<template>
  <view class="account">
    <view class="card">
      <view>
        <view>
          <view class="firstTitle">上门勘察</view>
          <view class="firstNumber">10</view>
        </view>
        <view>
          <view class="firstTitle">有效线索</view>
          <view class="firstNumber">5</view>
        </view>
        <view>
          <view class="firstTitle">有效线索佣金</view>
          <view class="c-flex">
            <view class="firstIcon">￥</view>
            <view class="firstNumber">500</view>
          </view>
        </view>
      </view>
      <view class="c-flex">
        <view>点击量：1000</view>
        <view>线索数：10</view>
      </view>
      <view class="c-flex">
        <view>上门勘察：7</view>
        <view>无效线索：3</view>
      </view>
    </view>
    <view class="card">
      <view>
        <view>
          <view class="firstTitle">有效成交金额</view>
          <view class="c-flex">
            <view class="firstIcon">￥</view>
            <view class="firstNumber">2500</view>
          </view>
        </view>
        <view>
          <view class="firstTitle">有效佣金</view>
          <view class="c-flex">
            <view class="firstIcon">￥</view>
            <view class="firstNumber">2000</view>
          </view>
        </view>
        <view>
          <view class="firstTitle">有效成交订单</view>
          <view class="firstNumber">5</view>
        </view>
      </view>
      <view class="c-flex">
        <view>已签约：</view>
        <view>已交付完成：</view>
      </view>
      <view class="c-flex">
        <view>已失效：</view>
        <view>预估佣金：</view>
      </view>
    </view>
    <view class="orderStateTitle">订单状态</view>
    <view class="stateBtn">
      <view class="stateBtnHighlight">全部</view>
      <view>线索</view>
      <view>已上门</view>
      <view>无效线索</view>
      <view>有效线索</view>
      <view>已签约</view>
      <view>已完成</view>
    </view>
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
        <view class="c-flex" @click="doOpen('../income/orderDetail')">
          <view>订单明细</view>
          <image
            style="width: 6px; margin: 3px 0px 0px 3px"
            mode="widthFix"
            src="../../static/images/VectorIcon2.png"
          />
        </view>
      </view>
    </view>
    <!--  -->
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
        <view>￥100</view>
      </view>
      <view class="orderCardConter">
        <view>有效线索佣金：¥100</view>
        <view>完成交付佣金：0</view>
      </view>
      <view class="orderCardConter">
        <view>有效成交金额：0</view>
        <view>佣金比例：0</view>
      </view>
      <view class="orderCardLast">
        <view>2023年8月1日 18:02上门</view>
        <view class="c-flex">
          <view>订单明细</view>
          <image
            style="width: 6px; margin: 3px 0px 0px 3px"
            mode="widthFix"
            src="../../static/images/VectorIcon2.png"
          />
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
.card {
  border-radius: 8px;
  margin: 10px;
  height: 168px;
  background: linear-gradient(219deg, #f75429 0%, #eb2b1e 100%);
  position: relative;
  > view:first-child {
    display: flex;
    justify-content: space-around;
    > view {
      padding-top: 18px;
      text-align: center;
    }
  }
  > view:nth-child(2) {
    padding: 10px 0 0 30px;
    justify-content: space-between;
    > view {
      color: #fff;
      font-size: 12px;
      font-weight: 500;
    }
    > view:first-child {
    }
    > view:last-child {
      position: absolute;
      left: 200px;
    }
  }

  > view:last-child {
    padding: 10px 0 0 30px;
    justify-content: space-between;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    > view:last-child {
      position: absolute;
      left: 200px;
    }
  }
  .firstTitle {
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    padding-bottom: 11px;
  }
  .firstNumber {
    color: #ffe559;
    font-size: 30px;
    font-weight: 500;
  }
  .firstIcon {
    color: #ffe559;
    font-size: 20px;
    font-weight: 500;
    line-height: 50px;
  }
}
.orderStateTitle {
  color: #000;
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  padding: 17px 0 10px 10px;
}
.stateBtn {
  padding: 0 10px;
  background: #f8f8f8;
  display: flex;
  justify-content: space-between;
  > view {
    text-align: center;
    border-radius: 3px;
    background: #fff;
    height: 27px;
    line-height: 27px;
    width: 50px;
    color: #6d6d6d;
    font-size: 11px;
    font-weight: 500;
  }
  .stateBtnHighlight {
    color: #fff;
    width: 50px;
    height: 27px;
    border-radius: 3px;
    background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
  }
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
