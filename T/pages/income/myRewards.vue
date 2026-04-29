<template>
  <view class="account">
    <view class="card">
      <!-- <view class="billDetails" @click="doOpen('../../subpackages/income/withdrawalDetails')">
        <view>账单明细</view>
        <image
          style="width: 5px; padding: 4px 0 0px 3px"
          mode="widthFix"
          src="../../static/images/vectorIcon3.png"
        />
      </view> -->
      <view class="number">￥ {{ myIncomeData.surplus / 100 || 0 }}</view>
      <view class="rules">
        <view>提现规则</view>
        <view class="rules2">?</view>
      </view>
      <view class="rulesBtn">
        <van-button round color="#d7000d" plain @click="doOpen('../../subpackages/income/cashOut')">
          提现
        </van-button>
      </view>
      <view class="rulesBottom">
        <view>
          <view class="rulesBottomNumber">￥{{ myIncomeData.allIncome / 100 || 0 }}</view>
          <view class="title">累计获得佣金</view>
        </view>
        <view>
          <view class="rulesBottomNumber">￥{{ myIncomeData.allCash / 100 || 0 }}</view>
          <view class="title">累计提现金额</view>
        </view>
        <!-- <view>
          <view class="rulesBottomNumber">￥0.00</view>
          <view class="title">预估收益金额</view>
        </view> -->
      </view>
    </view>
    <view class="remark">
      <text>*单次提现金额最高上限为200元，每日提现上限20000元</text>
    </view>
    <view class="bottoomBtn">
      <van-button plain @click="doOpen('../../subpackages/income/revenueDetails')">
        收益明细
      </van-button>
    </view>
    <view class="bottoomBtn">
      <van-button plain @click="doOpen('../../subpackages/income/withdrawalDetails')">
        提现明细
      </van-button>
    </view>
    <view class="bottoomBtn">
      <van-button plain @click="doOpen('../../subpackages/income/promoteOrders')">
        推广订单
      </van-button>
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
      },
      myIncomeData: {}
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    common.osg.codeoption(() => {
      this.getMyIncome();
    });
  },
  onShow() {
    this.getMyIncome();
  },
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    getMyIncome() {
      common.osg.ajax('wmt/basic/income/myIncome', {}, res => {
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
  height: 183px;
  background: linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%);
  position: relative;
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
    position: absolute;
    top: 52px;
    left: 240px;
    ::v-deep .van-button {
      width: 78px;
      height: 32px;
      font-size: 14px;
      font-weight: 600;
    }
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
