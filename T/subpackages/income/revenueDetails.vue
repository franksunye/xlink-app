<template>
  <view class="account">
    <view class="card">
      <view class="accumulate">累计获得佣金</view>
      <view class="number">￥ {{ myIncomeData.allIncome / 100 || 0 }}</view>

      <!-- <view class="rulesBottom">
        <view>
          <view class="rulesBottomNumber">￥0.00</view>
          <view class="title">昨日获得佣金</view>
        </view>
        <view>
          <view class="rulesBottomNumber">￥0.00</view>
          <view class="title">本月获得佣金</view>
        </view>
      </view> -->
    </view>
    <view class="block" v-for="(item, index) in IncomeData" :key="index">
      <view class="dateBlock">
        <view class="date">{{ item.createTime }}</view>
        <!-- <view class="time">{{ item.ioeDateTime }}</view> -->
      </view>
      <view class="tittle">{{ item.eventName }}</view>
      <view class="numberBlock">
        <view class="number">+{{ item.count / 100 || 0 }}</view>
        <view class="value">元</view>
      </view>
    </view>

    <!--  -->
    <!-- <view class="block">
      <view class="dateBlock">
        <view class="date">2023.02.22</view>
        <view class="time">11:45</view>
      </view>
      <view class="tittle">完成交付佣金</view>
      <view class="numberBlock">
        <view class="number">+500</view>
        <view class="value">元</view>
      </view>
    </view>
    <view class="block">
      <view class="dateBlock">
        <view class="date">2023.02.22</view>
        <view class="time">11:45</view>
      </view>
      <view class="tittle">有效线索佣金</view>
      <view class="numberBlock">
        <view class="number">+100</view>
        <view class="value">元</view>
      </view>
    </view>
    <view class="block">
      <view class="dateBlock">
        <view class="date">2023.02.22</view>
        <view class="time">11:45</view>
      </view>
      <view class="tittle">完成交付佣金</view>
      <view class="numberBlock">
        <view class="number">+500</view>
        <view class="value">元</view>
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
      common.osg.ajax('wmt/basic/income/myIncome', {}, res => {
        this.myIncomeData = res.data;
        console.log(this.myIncomeData, 'this.myIncomeData');
      });
    },
    getIncomeQuery() {
      common.osg.ajax(
        'wmt/basic/income/query',
        {
          'is:state|integer#and': 1,
          'is:ioe|integer#and': 0,
          'in:ioestate|array-integer#and': '1,3'
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
  border-radius: 8px;
  margin: 16px 16px 0 16px;
  height: 87px;
  background: linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%);
  position: relative;

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
  line-height: 42px;
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
    display: flex;
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
