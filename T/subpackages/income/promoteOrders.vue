<template>
  <view class="account">
    <view class="tab">
      <view
        style="text-align: center"
        :class="tabClick == item.value ? 'doTabClick' : 'unDoTabClick'"
        v-for="(item, index) in OrderState"
        :key="index"
        @click="tabChange(item.value)"
      >
        {{ item.name }}
      </view>
    </view>

    <view class="block" v-for="(item, index) in processData" :key="index">
      <view>
        <view style="display: flex; justify-content: space-between">
          <view class="blockTitle">{{ item.title }}</view>
          <view v-if="item.price" style="display: flex; font-weight: 600">
            <view style="color: #f03a23">+{{ item.price }}</view>
            <view>元</view>
          </view>
        </view>
        <view class="blockContent">
          <view>{{ item.name.slice(0, 1) }}****</view>
          <view>{{ item.address }}</view>
          <view
            @click="doOpen('../../subpackages/income/promoteOrdersDetails', item)"
            v-if="item.saId"
            style="color: #000000; font-weight: 600"
          >
            {{ item.status }}>
          </view>
          <view v-else style="color: #000000; font-weight: 600">{{ item.status }}</view>
        </view>
        <view class="blockTime">{{ item.updateTime }}</view>
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
      },
      myIncomeData: {},
      processData: {}, //推广订单数据
      // 测试数据
      // demoData: [
      //   {
      //     address: '北京市市辖区顺义区',
      //     name: '徐国婷',
      //     updateTime: '2024-03-14 10:48',
      //     title: '卫生间漏水维修',
      //     status: '不需要上门'
      //   },
      //   {
      //     address: '北京市市辖区平谷区11',
      //     price: '175.00',
      //     name: '何立猛',
      //     updateTime: '2024-03-22 18:05',
      //     title: '屋面漏水维修',
      //     saId: '8944128299643389828',
      //     status: '完成交付佣金'
      //   },
      //   {
      //     address: '北京市市辖区平谷区22',
      //     allPrice: '840.52',
      //     price: '420.26',
      //     name: '赵',
      //     updateTime: '2024-04-07 19:01',
      //     title: '屋面漏水维修',
      //     saId: '815269768818112262',
      //     status: '完成交付佣金'
      //   }
      // ],

      tabClick: 'ALL',
      OrderState: [
        {
          value: 'ALL',
          name: '全部'
        },
        {
          value: '待确认',
          name: '待确认'
        },
        {
          value: 'enable',
          name: '有效'
        },
        {
          value: '无效',
          name: '无效'
        }
      ]
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    this.getPromoteOrders();
  },
  onShow() {},

  methods: {
    getMyIncome() {
      common.osg.ajax('wmt/basic/income/myIncome', {}, res => {
        this.myIncomeData = res.data;
        console.log(this.myIncomeData, 'this.myIncomeData');
      });
    },
    getPromoteOrders() {
      common.osg.ajax(
        'wmt/biz/process/data',
        {
          type: this.tabClick
        },
        res => {
          this.processData = res.data;
          console.log(this.processData, 'this.processData');
        }
      );
    },
    // 路由跳转
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    tabChange(e) {
      this.tabClick = e;
      this.getPromoteOrders();
      // console.log(this.tabClick, '---this.tabClick');
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
  background: linear-gradient(219deg, #eb2b1e 0%, #f75429 100%);
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
  // height: 42px;
  // line-height: 42px;
  margin: 10px 16px;
  border-radius: 3px;
  background: #fff;
  // display: flex;
  // justify-content: space-between;
  padding: 10px 10px 0 10px;
  > view {
    padding-bottom: 10px;
  }
  .blockTitle {
    font-weight: 600;
    font-size: 14px;
    color: #000000;
  }
  .blockContent {
    display: flex;
    justify-content: space-between;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;

    color: #6d6d6d;
  }
  .blockTime {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    color: #6d6d6d;
  }
}
.tab {
  background: #f8f8f8;
  // display: flex;
  line-height: 24px;
  // text-align: center;
  width: 100%;
  overflow-x: scroll;
  white-space: nowrap;
  margin: 10px 16px 0 16px;
  // > view {
  //   display: inline-block;
  //   margin: 5px;
  //   height: 24px;
  //   width: 47px;
  //   border-radius: 4px;
  //   background: #f7f7f7;
  //   color: #000;
  //   font-size: 12px;
  //   font-weight: 400;
  // }
  .unDoTabClick {
    border-radius: 11px;
    display: inline-block;
    margin: 5px;
    height: 24px;
    width: 47px;
    background: #ffffff;
    color: #6d6d6d;
    font-size: 12px;
    font-weight: 400;
  }
  .doTabClick {
    display: inline-block;
    margin: 5px;
    height: 24px;
    width: 47px;
    border-radius: 11px;
    color: #ffffff;
    background: linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%);
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
