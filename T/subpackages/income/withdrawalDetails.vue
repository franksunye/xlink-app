<template>
  <view class="account">
    <view class="card">
      <view class="accumulate">累计提现金额</view>
      <view class="number">￥ {{ myIncomeData.allCash / 100 || 0 }}</view>
    </view>
    <view class="block" v-for="(item, index) in IncomeData" :key="index">
      <view class="leftBlock">
        <view class="title">修链提现</view>
        <view class="dateBlock">
          <view class="date">{{ item.createTime }}</view>
          <!-- <view class="time">{{ item.ioeDateTime }}</view> -->
        </view>
      </view>
      <view class="rightBlock">
        <view class="number">￥{{ item.count / 100 || 0 }}</view>
        <view class="state">{{ format('ioestate', item.ioestate, 'select') }}</view>
      </view>
    </view>

    <!--  -->
    <!-- <view class="block">
      <view class="leftBlock">
        <view class="title">修链提现</view>
        <view class="dateBlock">
          <view class="date">2023.02.22</view>
          <view class="time">11:45</view>
        </view>
      </view>
      <view class="rightBlock">
        <view class="number">￥6000</view>
        <view class="state">打款中</view>
      </view>
    </view>
    <view class="block">
      <view class="leftBlock">
        <view class="title">修链提现</view>
        <view class="dateBlock">
          <view class="date">2023.02.22</view>
          <view class="time">11:45</view>
        </view>
      </view>
      <view class="rightBlock">
        <view class="number">￥6000</view>
        <view class="state">提现成功</view>
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
      options: {
        codecfg_ioestate: { codeId: 'ioestate' }
      },
      myIncomeData: {},
      IncomeData: {}
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    common.osg.codeoption(() => {
      this.getMyIncome();
      this.getIncomeQuery();
      this.$forceUpdate();
    });
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
          'is:ioe|integer#and': 1
        },
        res => {
          this.IncomeData = res.data;
          console.log(this.IncomeData, 'this.IncomeData');
        }
      );
    },
    //反显字典表
    format(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (!val || val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
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
}
.block {
  height: 64px;
  margin: 6px 16px;
  border-radius: 3px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0px 17px;
  .leftBlock {
    padding: 15px 0px 10px 0px;
  }
  .rightBlock {
    padding: 15px 0px 10px 0px;
  }
  .title {
    color: #000;
    font-size: 14px;
    font-weight: 500;
  }
  .dateBlock {
    display: flex;
    padding-top: 5px;
  }
  .date {
    color: #6d6d6d;
    font-size: 12px;
    font-weight: 500;
  }
  .time {
    padding-left: 5px;
    color: #6d6d6d;
    font-size: 12px;
    font-weight: 500;
  }
  .number {
    color: #f03a23;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
  }
  .state {
    color: #6d6d6d;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
  }
}
</style>
