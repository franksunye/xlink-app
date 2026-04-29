<template>
  <view>
    <view class="header">
      <view class="bg">
        <view class="card">
          <view class="card-header">
            <image class="headImg" :src="formData.avatar || '../../static/images/logo-fs.png'" />
            <view class="card-info">
              <view>{{ formData.name }}</view>
              <view>{{ formData.phone || '' }}</view>
            </view>
          </view>
          <view class="card-content">
            <text>来源：推广分享</text>
            <!-- <text>状态：</text> -->
          </view>
        </view>

        <view class="card-group">
          <view class="card" v-for="(item, i) in formData.tenantLogList" :key="i">
            <view class="card-header">
              <view class="card-title">{{ item.createTime }}</view>
            </view>
            <view class="card-content">{{ item.title }}</view>
          </view>
          <van-empty
            v-if="!formData.tenantLogList.length"
            description="还没有推广动态,快分享给身边的好友吧!"
          />
        </view>
      </view>
      <!-- <van-tabs active="1">
        <van-tab title="动态" name="1"></van-tab>
      </van-tabs> -->
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      formData: {
        name: '库克',
        phone: '13733386085',
        avatar: '../../static/images/lead1.jpg'
      },
      fpi: {
        data: []
      }
    };
  },
  onLoad(params) {
    this.init(params);
    console.log(params);
    this.getData(params.id);
  },
  methods: {
    init(params) {
      common.osg.init(this, params, app);
    },
    // 获取门店列表
    getData(id) {
      common.osg.ajax(
        'user/query',
        {
          'is:_id|string#and': id
        },
        res => {
          this.formData = res.data[0];
        }
      );
    },
    open(url, params, options) {
      common.osg.open(url, params, options);
    }
  }
};
</script>

<style lang="scss">
.header {
  .bg {
    height: 15vw;
    background-color: #107ad0;
    padding-top: 3vw;

    .card {
      margin: 0 3vw 3vw;
      border-radius: 10rpx;
      background-color: #fff;

      // box-shadow: 2px 8px 12px #ebedf0;
      .card-header {
        padding: 3vw;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;

        .card-info {
          margin-left: 3vw;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
      }

      .card-content {
        padding: 2vw 3vw;
        display: flex;
        justify-content: space-between;
        color: #646566;
      }
    }
  }
}

.card-group {
  .card {
    background: #fff;
    border-radius: 10rpx;
    margin: 3vw;

    .card-header {
      padding: 3vw;
      display: flex;
      align-items: center;
      border-bottom: none !important;

      .card-image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
      }

      .card-title {
        color: #646566;
        font-weight: 500;
      }
    }

    .card-content {
      padding: 0 3vw 3vw !important;
    }
  }
}

.headImg {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}
</style>
