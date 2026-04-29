<template>
  <view>
    <view class="header">
      <view class="userinfo">
        <view class="face">
          <image :src="userinfo.avatar"></image>
        </view>
        <view class="info">
          <view>{{ userinfo.nickname }}</view>
          <view>{{ userinfo.phone }}</view>
        </view>
      </view>
    </view>
    <view class="bg">
      <view class="money">
        <view class="money-header">
          <view>
            <view class="title">可提现余额(元)</view>
            <view class="number">{{ userinfo.wallet }}</view>
          </view>
          <!-- <van-button type="danger" round size="normal" color="#f6c560" @click="toast()">
						立即提现
					</van-button> -->
        </view>
        <view class="card-line"></view>
        <view class="money-content">
          <!-- <text>已提现(元) 693.33</text> -->
          <text>总金额(元) {{ userinfo.totallncome }}</text>
          <view class="c-flex c-blue" @click="toDetail(userinfo._id)">
            <text>资金明细</text>
            <van-icon name="arrow" />
          </view>
        </view>
      </view>
      <!--  <view class="log" @click="toast()">
        <view>
          近期还有
          <text class="c-blue">1</text>
          笔提现中，共
          <text class="c-blue">322.45</text>
          元
        </view>
        <van-icon name="arrow" color="#646566" />
      </view> -->
      <view class="chart">
        <canvas
          canvas-id="canvasRing"
          id="canvasRing"
          class="charts"
          @touchstart="touchRing"
        ></canvas>
        <view></view>
      </view>
    </view>

    <view class="footer-text">
      <view>
        推广业务得佣金的说明：
        <view>
          将防水维修门店或管家推荐给微信好友会获得信息费和成交佣金。信息费的确认是以管家上门为标准，成交佣金将会在合同签订并执行完发放到账户中。请及时关注推广动态和微信的服务通知。
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
import uCharts from '../../wxcomponents/u-charts/u-charts.js';
var _self;
var canvaRing = null;
export default {
  data() {
    return {
      //用户信息
      userinfo: {},

      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      chartData: {
        // series: [{
        // 		name: '推荐奖励',
        // 		data: 1278.8
        // 	},
        // 	{
        // 		name: '成交奖励',
        // 		data: 665.8
        // 	}
        // ]
      }
    };
  },
  onLoad(params) {
    this.init(params);
    _self = this;
    this.cWidth = uni.upx2px(670);
    this.cHeight = uni.upx2px(500);
    this.getData();
  },
  methods: {
    init(params) {
      common.osg.init(this, params || {}, app);
      //用户信息
      this.userinfo = common.osg.currentUser();
    },
    getData() {
      common.osg.ajax('user/find', {}, res => {
        this.userinfo = res;
        // this.chartData = {
        // 	series: [{
        // 			name: '推荐奖励',
        // 			data: 0
        // 		},
        // 		{
        // 			name: '成交奖励',
        // 			data: 0
        // 		}
        // 	]
        // }
        this.getServerData();
      });
    },
    //去详情
    toDetail(id) {
      common.osg.open('walletDetail', {});
    },
    toast() {
      common.osg.toast('开发中', 'none');
    },
    /**
     * 打开页面
     */
    doOpen(url, params, options) {
      common.osg.open(url, params, options);
    },
    /**
     * 渲染字典
     */
    codelabel(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      }
    },
    // 获取图表数据
    getServerData() {
      common.osg.ajax('user/findWalletOne', {}, res => {
        let dataObj = {};
        let dictionary = {};
        res.data.forEach(item => {
          if (dataObj[item.type]) {
            dataObj[item.type] = this.amountToFixed(
              this.amountToFixed(dataObj[item.type]) + this.amountToFixed(item.ammount)
            );
          } else {
            dictionary[item.type] = item.settleRuleName;
            dataObj[item.type] = item.ammount;
          }
        });
        this.chartData.series = [];
        for (let type in dictionary) {
          if (type == -1) continue;
          this.chartData.series.push({
            name: dictionary[type],
            data: dataObj[type]
          });
        }
        console.log(this.chartData.series, dataObj, dictionary);
        this.showRing('canvasRing', this.chartData);
      });
    },
    // 生成图表
    showRing(canvasId, chartData) {
      canvaRing = new uCharts({
        $this: this,
        canvasId: canvasId,
        type: 'ring',
        fontSize: 11,
        legend: true,
        title: {
          name: this.userinfo.totallncome,
          color: '#55a0f8',
          fontSize: 20,
          offsetY: 0
        },
        subtitle: {
          name: '累计收益',
          color: '#646566',
          fontSize: 14,
          offsetY: 0
        },
        extra: {
          pie: {
            offsetAngle: -45,
            ringWidth: 25,
            labelWidth: 15
          }
        },
        background: '#FFFFFF',
        pixelRatio: 1,
        series: chartData.series,
        animation: true,
        width: this.cWidth,
        height: this.cHeight,
        disablePieStroke: true,
        dataLabel: true
      });
    },
    // 点击图表提示
    touchRing(e) {
      canvaRing.showToolTip(e, {
        format: function (item) {
          return item.name + ':' + item.data;
        }
      });
    },
    //保留两位小数的金额
    amountToFixed(money) {
      if (!money) return 0;
      let resultAmount = +(+money).toFixed(2);
      return resultAmount ? resultAmount : 0;
    }
  }
};
</script>

<style lang="scss">
page > view {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    width: 100vw;
    padding: 3vw 3vw 4vw 10vw;
    box-sizing: border-box;
    background-color: #107ad0;
    display: flex;
    align-items: center;

    .userinfo {
      display: flex;

      .face {
        width: 15vw;
        height: 15vw;
        border-radius: 10rpx;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .info {
        padding-left: 4vw;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }
  }

  .bg {
    width: 100vw;
    height: 15vw;
    background-color: #107ad0;

    .money {
      margin: 0 3vw;
      border-radius: 10rpx;
      background-color: #fff;

      .money-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4vw 3vw;

        .title {
          color: #646566;
          font-size: 14px;
        }

        .number {
          color: #55a0f8;
          font-size: 20px;
          font-weight: 500;
        }
      }

      .money-content {
        padding: 3vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #646566;
        font-size: 14px;
      }
    }

    .log {
      margin: 3vw;
      padding: 3vw;
      border-radius: 10rpx;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
    }

    .chart {
      margin: 3vw;
      padding: 3vw;
      border-radius: 10rpx;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
    }
  }

  .card-line {
    height: 1px;
    margin: 0 3vw;
    box-sizing: border-box;
    background-color: #f2f2f2;
  }

  .c-blue {
    color: #55a0f8;
  }

  .charts {
    width: 100%;
    height: 500upx;
    background-color: #ffffff;
  }

  .footer-text {
    position: fixed;
    bottom: -10rpx;
    padding: 40rpx;
    color: #676767;
    font-size: 28rpx;
  }
}
</style>
