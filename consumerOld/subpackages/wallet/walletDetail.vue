<template>
  <view>
    <view class="card-group">
      <view class="card" v-for="(item, i) in fpi.data" :key="i">
        <view class="card-header" style="justify-content: space-between">
          <view class="card-title c-flex" style="margin-left: 0">
            <view class="c-m-r-25" style="margin-right: 25rpx">
              <image
                class="card-image"
                style="width: 80rpx; height: 80rpx"
                src="../../static/images/logo-fs.png"
              />
            </view>
            <view style="display: flex; flex-direction: column; justify-content: space-around">
              {{ item.memo }}
              <view style="color: #888; font-size: 26rpx">{{ item.createTime }}</view>
            </view>
          </view>
          <view style="font-weight: 520">
            <text v-if="item.ammount > 0" style="color: #f0ad4e">
              {{ '+' + item.ammount }}
            </text>
            <text v-else style="color: #000">
              {{ item.ammount }}
            </text>
          </view>
        </view>
      </view>
      <van-empty v-if="!fpi.data.length" description="还没有资金明细,快分享给身边的好友吧!" />
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      subscribe: false,
      // fpi: {
      // 	data: [{
      // 		name: '雨虹防水维修服务',
      // 		avatar: '../../static/images/logo-fs.png',
      // 		createTime: '昨天 14:00',
      // 		content: '恭喜，你推荐的客户 库克 已下单防水维修服务'
      // 	}]
      // },
      fpi: {
        page: 1,
        rows: 10,
        data: []
      },
      rows: 20
    };
  },
  onLoad(params) {
    this.init(params);
  },
  methods: {
    init(params) {
      common.osg.init(this, params, app);
      this.getData(true);
    },
    // 获取门店列表
    getData(isIndex) {
      // 是首页获取门店列表数据
      if (isIndex) {
        this.rows = 20;
      } else {
        this.rows = this.rows + 20;
      }
      var params = {
        rows: this.rows
      };
      common.osg.ajax('user/findWallet', params, res => {
        console.log(res);
        this.fpi.data = res;
        this.total = res.total;
        console.log(this.total);
      });
    },
    open(url, params, options) {
      common.osg.open(url, params, options);
    },
    /**
     * 订阅消息
     */
    subscribeMessage() {
      // 来访提醒
      common.osg.subscribeMessage(['TNddcL8nIqphzeChCQn262o-1JvUf9OEQmlW9RZBC80'], res => {
        console.log(res);
        if (res['TNddcL8nIqphzeChCQn262o-1JvUf9OEQmlW9RZBC80'] == 'accept') {
          // 订阅后隐藏订阅按钮
          this.subscribe = true;
        }
      });
    },
    // 上拉加载
    onReachBottom: function () {
      console.log('bot');
      if (this.rows >= this.total) {
        common.osg.toast('没有更多数据');
        return;
      }
      this.getData(false);
    },
    // 下拉刷新
    onPullDownRefresh: function () {
      console.log('up');
      this.getData(true);
    }
  },
  onShow() {
    // 获取用户当前设置
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log(res.subscriptionsSetting);
      }
    });
  }
};
</script>

<style lang="scss">
.card-group {
  .card {
    background: #fff;
    border-radius: 10rpx;
    margin: 3vw;

    .card-header {
      padding: 3vw;
      display: flex;
      align-items: center;
      color: #323233;

      .card-image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
      }

      .card-title {
        font-weight: 500;
        margin-left: 3vw;
      }
    }

    .card-content {
      padding: 0 3vw;
      color: #646566;
      // font-size: 14px;
    }

    .card-footer {
      padding: 3vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #107ad0;
    }

    .card-line {
      height: 1px;
      margin: 3vw 3vw 0;
      box-sizing: border-box;
      background-color: #f2f2f2;
    }
  }
}
</style>
