<template>
  <view class="account">
    <view class="order" v-for="(item, index) in serviceAppointmentData" :key="index">
      <view class="orderBlock1">
        <view style="display: flex; font-weight: 600">
          <view style="margin-right: 5px"><van-icon name="contact" color="#D80111" /></view>
          <view>{{ item.title.slice(0, 1) }}**</view>
        </view>

        <view>{{ codelabel('STATUS', item.status) || '' }}</view>
      </view>

      <view class="orderBlock2">
        <view style="display: flex">
          <view style="margin-right: 5px"><van-icon name="location" color="#D80111" /></view>
          <view>{{ item.address || '' }}</view>
        </view>
        <view>{{ item.createTime }}</view>
      </view>

      <view class="orderBlock3">
        <view style="display: flex">
          <view class="circle"></view>
          <view>
            <view>
              {{
                codelabel('repairParts', item.exts && item.exts.leakagesite_copy[0]) || ''
              }}漏水维修
            </view>
            <view>已付款金额</view>
          </view>
        </view>
        <view>￥{{ paidAmountSum || '' }}</view>
      </view>
    </view>

    <view class="orderDetails" v-for="(item, index) in contractData" :key="index">
      <view class="content">
        <view class="contentLable">合同编号</view>
        <view class="contentValue">{{ item.contractdocNum || '' }}</view>
      </view>
      <view class="content">
        <view class="contentLable">合同签约日期</view>
        <view class="contentValue">{{ item.exts.signedDateExts || '' }}</view>
      </view>
      <view class="content">
        <view class="contentLable">合同状态</view>
        <view class="contentValue">
          {{ codelabel('contractStatus', item.exts.contractStatus) || '' }}
        </view>
      </view>
      <view class="content">
        <view class="contentLable">合同签约日期</view>
        <view class="contentValue">{{ item.exts.signedDateExts }}</view>
      </view>
      <view class="content">
        <view class="contentLable">合同金额</view>
        <view class="contentValue">￥{{ item.exts.couponContractMoney || '' }}</view>
      </view>
      <view class="content">
        <view class="contentLable">已付款金额</view>
        <view class="contentValue">￥{{ item.paidAmount || '' }}</view>
      </view>
      <view class="content">
        <view class="contentLable">待支付金额</view>
        <view class="contentValue">￥{{ item.difference || '' }}</view>
      </view>
      <view class="content">
        <view class="contentLable">完工日期</view>
        <view class="contentValue">{{ item.exts.endDateExts || '' }}</view>
      </view>
      <!-- <view class="content">
        <view class="contentLable">佣金比例</view>
        <view class="contentValue">{{item.exts.signedDateExts}}</view>
      </view> -->
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      options: {
        codecfg_STATUS: { codeId: 'STATUS' },
        // cascadeCode_repairParts: { codeId: 'repairParts' },
        codecfg_repairParts: { codeId: 'repairPartsOne' },
        codecfg_contractStatus: { codeId: 'contractStatus' }
      },
      // 省市区
      areaList: Object.assign({}, areajs.default),
      systemInfo: {
        menuButtonObject: {}
      },
      params: '',
      serviceAppointmentData: {},
      contractData: {},
      paidAmountSum: null //已支付金额总和
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    this.params = params;
    console.log(this.params, '----this.params');
    common.osg.codeoption(() => {
      this.getServiceAppointment();
      this.getContract();
    });
  },
  onShow() {},

  methods: {
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else if (type == 'multiple') {
        return common.osg.codelabelForArray(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },

    getServiceAppointment() {
      let params = {
        'is:state|integer#and': 1,
        'is:_id|string#and': this.params.saId
      };
      common.osg.ajax('wmt/basic/serviceAppointment/query.do', params, res => {
        this.serviceAppointmentData = res.data;
        console.log(this.serviceAppointmentData, 'this.serviceAppointmentData');
      });
    },
    getContract() {
      let params = {
        'is:state|integer#and': 1,
        'is:serviceAppointmentId|string#and': this.params.saId
      };
      common.osg.ajax('wmt/basic/contract/query.do', params, res => {
        // 已支付金额总和 paidAmountSum
        res.data.map(item => {
          if (item.paidAmount) {
            this.paidAmountSum += item.paidAmount;
          }
        });
        console.log(this.paidAmountSum, '----this.paidAmountSum');
        this.contractData = res.data;
        console.log(this.contractData, 'this.contract');
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
.order {
  margin: 10px 16px;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  .orderBlock1 {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #000000;
    margin-bottom: 10px;
  }
  .orderBlock2 {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #8c8c8c;
    margin-bottom: 20px;
  }
  .orderBlock3 {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    font-size: 12px;
    color: #000000;
    .circle {
      width: 30px;
      height: 30px;
      background-color: #d80111;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
}
.orderDetails {
  margin: 10px 16px;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  .content {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    > view {
      margin-bottom: 10px;
    }
    .contentLable {
      color: #8c8c8c;
    }
    .contentValue {
      color: #000000;
    }
  }
}
</style>
