<template>
  <view class="account">
    <view class="card">
      <view>
        <view>
          <view class="firstTitle">上门勘察</view>
          <view class="firstNumber">0</view>
        </view>
        <view>
          <view class="firstTitle">有效线索</view>
          <view class="firstNumber">0</view>
        </view>
        <view>
          <view class="firstTitle">有效线索佣金</view>
          <view class="c-flex">
            <view class="firstIcon">￥</view>
            <view class="firstNumber">0</view>
          </view>
        </view>
      </view>
      <view class="c-flex">
        <view>线索数：0</view>
        <view>无效线索：0</view>
      </view>
      <!-- <view class="c-flex">
        <view>累计有效线索：200</view>
        <view>累计有效线索佣金：¥10000</view>
      </view> -->
    </view>
    <view class="card2" style="height: 176px">
      <view>
        <view>
          <view class="firstTitle">有效成交金额</view>
          <view class="firstNumber">0</view>
        </view>
        <view>
          <view class="firstTitle">有效佣金</view>
          <view class="firstNumber">0</view>
        </view>
        <view>
          <view class="firstTitle">有效成交订单</view>
          <view class="c-flex">
            <view class="firstIcon">￥</view>
            <view class="firstNumber">0</view>
          </view>
        </view>
      </view>
      <view class="c-flex">
        <view>
          <view>已签约：</view>
          <view>已交付完成：</view>
        </view>

        <view>
          <view>已失效：</view>
          <view>预估佣金：</view>
        </view>
      </view>

      <!-- <view class="c-flex">
        <view>累计交付完成：50</view>
        <view>累计成交佣金：¥25000</view>
      </view> -->
    </view>
    <!-- <view class="goodDetail">
      <view class="c-flex">
        <image
          style="width: 55px; padding: 8px 8px 0 8px"
          mode="widthFix"
          :src="'https://pub.fsgo365.cn/7315652511887609320.png'"
        />
        <view>
          <view class="firstBlock">
            <image
              style="width: 41px; margin-top: 3px"
              mode="widthFix"
              src="../../static/images/goodsLogo.png"
            />
            <view class="title">屋顶防水维修服务</view>
            <view class="detailBtn" @click="doOpen('../income/incomeDetail')">
              <view>明细</view>
              <image
                style="width: 7px; margin-top: 3px"
                mode="widthFix"
                src="../../static/images/VectorIcon2.png"
              />
            </view>
          </view>
          <view class="lastBlock">
            <view>
              <view>点击量：</view>
              <view>1000</view>
            </view>
            <view>
              <view>有效线索：</view>
              <view>10条</view>
            </view>
            <view>
              <view>有效成交订单：</view>
              <view>1条</view>
            </view>
          </view>
        </view>
      </view>
      <view class="c-flex" style="justify-content: space-around">
        <view class="conter">
          <view>有效线索金额</view>
          <view>¥100</view>
        </view>
        <view class="conter">
          <view>付款金额</view>
          <view>¥10000</view>
        </view>
        <view class="conter">
          <view>佣金比</view>
          <view>%5</view>
        </view>
        <view class="conter">
          <view>预估佣金</view>
          <view>500</view>
        </view>
        <view class="conter">
          <view>总收益</view>
          <view style="color: #f03a23">¥600</view>
        </view>
      </view>
    </view> -->

    <!--  -->
    <!-- <view class="goodDetail">
      <view class="c-flex">
        <image
          style="width: 55px; padding: 8px 8px 0 8px"
          mode="widthFix"
          :src="'https://pub.fsgo365.cn/7315652511887609320.png'"
        />
        <view>
          <view class="firstBlock">
            <image
              style="width: 41px; margin-top: 3px"
              mode="widthFix"
              src="../../static/images/goodsLogo.png"
            />
            <view class="title">屋顶防水维修服务</view>
            <view class="detailBtn" @click="doOpen('../income/orderDetail')">
              <view>明细</view>
              <image
                style="width: 7px; margin-top: 3px"
                mode="widthFix"
                src="../../static/images/VectorIcon2.png"
              />
            </view>
          </view>
          <view class="lastBlock">
            <view>
              <view>点击量：</view>
              <view>1000</view>
            </view>
            <view>
              <view>有效线索：</view>
              <view>10条</view>
            </view>
            <view>
              <view>有效成交订单：</view>
              <view>1条</view>
            </view>
          </view>
        </view>
      </view>
      <view class="c-flex" style="justify-content: space-around">
        <view class="conter">
          <view>有效线索金额</view>
          <view>¥100</view>
        </view>
        <view class="conter">
          <view>付款金额</view>
          <view>¥10000</view>
        </view>
        <view class="conter">
          <view>佣金比</view>
          <view>%5</view>
        </view>
        <view class="conter">
          <view>预估佣金</view>
          <view>500</view>
        </view>
        <view class="conter">
          <view>总收益</view>
          <view style="color: #f03a23">¥600</view>
        </view>
      </view>
    </view> -->
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
  background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
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
    margin-top: 15px;
    > view {
      color: #fff;
      font-size: 12px;
      font-weight: 500;
    }
    > view:first-child {
      padding-left: 30px;
    }
    > view:last-child {
      padding-left: 91px;
    }
  }

  // > view:last-child {
  //   padding: 20px 0 0 30px;
  //   color: #ffe559;
  //   font-size: 12px;
  //   font-weight: 500;
  //   > view:first-child {
  //     padding-right: 48px;
  //   }
  // }
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
.card2 {
  border-radius: 8px;
  margin: 10px;
  height: 168px;
  background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
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
    > view {
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      > view:first-child {
        padding-bottom: 10px;
      }
    }
    > view:first-child {
      padding: 0px 0px 0px 30px;
    }
    > view:last-child {
      padding-left: 91px;
    }
  }

  // > view:last-child {
  //   padding: 10px 0 0 30px;
  //   color: #ffe559;
  //   font-size: 12px;
  //   font-weight: 500;
  //   > view:first-child {
  //     padding-right: 48px;
  //   }
  // }
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
.goodDetail {
  margin: 10px;
  background: #fff;
  .title {
    color: #000;
    font-size: 14px;
    font-weight: 500;
    padding: 0 70px 0 8px;
  }
  .firstBlock {
    display: flex;
    height: 20px;
    line-height: 20px;
    padding-top: 15px;
  }
  .detailBtn {
    display: flex;
    color: #736e6e;
    font-size: 12px;
    font-weight: 400;
    > view:first-child {
      padding-right: 3px;
    }
  }
  .lastBlock {
    display: flex;
    justify-content: space-between;
    padding: 8px 0 8px 0;
    > view {
      display: flex;
      border-radius: 4px;
      border: 0.8px solid #d9d9d9;
      text-align: center;
      > view:first-child {
        color: #736e6e;
        font-size: 10px;
        font-weight: 500;
      }
      > view:last-child {
        color: #106cff;
        font-size: 10px;
        font-weight: 500;
      }
    }
  }
  .conter {
    text-align: center;

    > view:first-child {
      color: #6d6d6d;
      font-size: 12px;
      font-weight: 400;
    }
    > view:last-child {
      color: #000;
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>
