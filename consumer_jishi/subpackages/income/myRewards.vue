<template>
  <view class="account">
    <view class="card">
      <view class="c-flex c-item-center c-flex-between">
        <view class="c-flex" style="padding: 20px">
          <view class="cardTitle">
            <view>可用积分</view>
            <view>100积分=1元</view>
          </view>
          <view class="surplus">
            {{ myIncomeData.surplus }}
          </view>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="rulesBtn">
          <button
            class="c-uni-button round mini default"
            hover-class="hover"
            plain
            color="#f03a23"
            @click="doOpen('../income/cashOut')"
          >
            兑换现金
          </button>
        </view>
        <!-- #endif -->
      </view>
      <view class="cardBtn">
        <view class="c-flex" @click="doOpen('../income/revenueDetails')">
          <image
            style="width: 17px"
            mode="widthFix"
            src="../../static/images/pointsDetails-Icon.png"
          />
          <view class="cardBtnTitle">积分明细</view>
        </view>
        <view class="c-flex" @click="doOpen('../income/withdrawalDetails')">
          <image style="width: 18px" mode="widthFix" src="../../static/images/exchange-icon.png" />
          <view class="cardBtnTitle">兑换记录</view>
        </view>
        <view class="c-flex">
          <image
            style="width: 16px"
            mode="widthFix"
            src="../../static/images/pointsRule-icon.png"
          />
          <view class="cardBtnTitle">积分规则</view>
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
      systemInfo: {
        menuButtonObject: {}
      },
      myIncomeData: {}
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    common.osg.codeoption(() => {
      this.$forceUpdate();
    });
    this.getMyIncome();
  },
  onShow() {},
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    getMyIncome() {
      common.osg.ajax('basic/income/myIncome', {}, res => {
        this.myIncomeData = res.data;
        console.log(this.myIncomeData, 'this.myIncomeData');
      });
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
  margin: 16px 16px 0 16px;
  height: 122px;
  background: linear-gradient(219deg, #eb2b1e 0%, #f75429 100%);
  position: relative;
  .cardTitle {
    padding-right: 6px;
    > view:first-child {
      color: #fff;
      font-size: 18px;
      font-weight: 500;
    }
    > view:last-child {
      color: #fff;
      font-size: 10px;
      font-weight: 500;
    }
  }
  .surplus {
    color: #fff;
    text-align: center;
    font-size: 36px;
    font-weight: 500;
  }
  .cardBtn {
    display: flex;
    justify-content: space-around;
  }
  .cardBtnTitle {
    padding-left: 2px;
    color: #fff;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
  }
  .billDetails {
    display: flex;
    position: absolute;
    left: 260px;
    top: 19px;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
  }
  .number {
    color: #fff;
    font-size: 30px;
    font-weight: 500;
    position: absolute;
    top: 36px;
    left: 35px;
  }
  .rules {
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    display: flex;
    position: absolute;
    top: 91px;
    left: 27px;
  }
  .rules2 {
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    border-radius: 50%;
    background: #fff;
    color: #da1705;
    font-size: 10px;
    font-weight: 500;
    margin-left: 4px;
  }
  .rulesBtn {
    color: #f03a23;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    margin-right: 20px;
  }
  .rulesBottom {
    height: 50px;
    border-radius: 0px 0px 8px 8px;
    background: rgba(99, 99, 99, 0.2);
    position: absolute;
    width: 100%;
    bottom: 0px;
    display: flex;
    justify-content: space-around;
    > view {
      margin-top: 5px;
    }
    .rulesBottomNumber {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
    }
    .title {
      color: #fff;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
.remark {
  margin: 6px 16px;
  color: #736e6e;
  font-size: 11px;
  font-weight: 400;
  text-align: center;
}
.bottoomBtn {
  margin: 0px 16px 13px 16px;
  ::v-deep .van-button {
    width: 100%;
    height: 36px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 8px;
    color: #000;
    border-color: #fff;
  }
}
</style>
