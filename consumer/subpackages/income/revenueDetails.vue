<template>
  <view class="account">
    <view class="card">
      <!-- <view class="accumulate">累计获得佣金</view>
      <view class="number">￥ {{ myIncomeData.allIncome }}</view> -->
      <view>
        <view class="cardNumber">{{ myIncomeData.surplus }}</view>
        <view class="cardTitle">当前积分</view>
      </view>
      <view>
        <view class="cardNumber">{{ myIncomeData.allIncome }}</view>
        <view class="cardTitle">累计获得积分</view>
      </view>
    </view>
    <view class="block" v-for="(item, index) in IncomeData" :key="index">
      <view class="dateBlock">
        <view class="tittle">{{ item.eventName }}</view>
        <view class="date">{{ item.createTime }}</view>
      </view>

      <view class="numberBlock">
        <view class="number">+{{ item.count }}</view>
        <view class="value">积分</view>
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
      myIncomeData: {},
      IncomeData: {} //明细
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    this.getMyIncome();
    this.getIncomeQuery();
  },
  onShow() {},

  methods: {
    getMyIncome() {
      common.osg.ajax('basic/income/myIncome', {}, res => {
        this.myIncomeData = res.data;
        console.log(this.myIncomeData, 'this.myIncomeData');
      });
    },
    getIncomeQuery() {
      common.osg.ajax(
        'basic/income/query',
        {
          'is:state|integer#and': 1,
          'is:ioe|integer#and': 0
        },
        res => {
          this.IncomeData = res.data;
          console.log(this.IncomeData, 'this.IncomeData');
        }
      );
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
  // border-radius: 8px;
  // margin: 16px 16px 0 16px;
  height: 87px;
  background: #fff;
  position: relative;
  display: flex;
  justify-content: space-around;
  .cardNumber {
    color: #f03a23;
    text-align: center;
    font-size: 26px;
    font-weight: 600;
    padding-bottom: 5px;
  }
  .cardTitle {
    color: #000;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }
  .accumulate {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    position: absolute;
    top: 19px;
    left: 40px;
  }
  .number {
    color: #fff;
    font-size: 30px;
    font-weight: 500;
    position: absolute;
    top: 36px;
    left: 35px;
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
.block {
  height: 42px;
  // line-height: 42px;
  margin: 10px 16px;
  border-radius: 3px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0px 10px;
  .date {
    color: #6d6d6d;
    font-size: 12px;
    font-weight: 500;
  }
  .dateBlock {
  }
  .time {
    color: #6d6d6d;
    font-size: 12px;
    font-weight: 500;
    padding-left: 8px;
  }
  .tittle {
    color: #000;
    font-size: 14px;
    font-weight: 500;
  }
  .numberBlock {
    display: flex;
    line-height: 42px;
  }
  .number {
    color: #f03a23;
    font-size: 16px;
    font-weight: 600;
  }
  .value {
    color: #000;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
