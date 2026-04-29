<template>
  <view>
    <view class="header">
      <view class="userinfo c-flex-1" v-if="isLogined && userinfo.phone">
        <view class="face" @click="doLogin">
          <image :src="userinfo.avatar"></image>
        </view>
        <view class="info c-flex-1">
          <view>{{ userinfo.nickname }}</view>
          <view>{{ userinfo.phone }}</view>
        </view>
        <van-icon
          name="chat-o"
          size="28px"
          color="#fff"
          style="margin-right: 15px"
          :info="newMessageCount || ''"
          @click="doOpen('/subpackages/message/messages')"
        />
      </view>
      <view v-else>
        <van-button plain size="normal" round color="#1989fa" @click="doLogin">登录</van-button>
      </view>
    </view>
    <view class="content">
      <view class="list-group">
        <view class="list">
          <van-cell-group>
            <van-cell
              title="我的订单"
              is-link
              link-type="navigateTo"
              url="../../subpackages/serviceAppointment/serviceAppointment"
            />
            <!-- <van-cell
              title="我的订单2"
              is-link
              link-type="navigateTo"
              url="../../subpackages/serviceAppointment/serviceAppointments"
            /> -->
            <van-cell title="我的账户" is-link @click="toWallet" />
            <van-cell title="推广动态" is-link @click="toActivity" />
            <van-cell title="我的卡券" is-link @click="toCoupon" />
          </van-cell-group>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      userinfo: {},
      isLogined: false,
      newMessageCount: 0
    };
  },
  onLoad(params) {
    this.init(params);
  },
  methods: {
    init(params) {
      common.osg.init(this, params || {}, app);
    },
    doLogin() {
      common.osg.open('../../subpackages/authorize/authorize', {
        mode: 'redirect'
      });
    },
    toOrder() {
      var u = common.osg.currentUser();
      if (u && u._id && u.nickname && u.phone) {
        common.osg.open('../../subpackages/order/orders');
      } else {
        common.osg.alert('请您先登录授权再查看订单');
      }
    },
    toWallet() {
      var u = common.osg.currentUser();
      if (u && u._id && u.nickname && u.phone) {
        common.osg.open('../../subpackages/wallet/wallet');
      } else {
        common.osg.alert('请您先登录授权再查看账户');
      }
    },
    toActivity() {
      common.osg.open('../../subpackages/activity/activity');
    },
    toCoupon() {
      var u = common.osg.currentUser();
      if (u && u._id && u.nickname && u.phone) {
        common.osg.open('../../subpackages/coupon/my');
      } else {
        common.osg.alert('请您先登录授权再查看账户');
      }
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    // 获取消息中心消息数量
    getNewMessageCount() {
      common.osg.ajax(
        '/chatMessage/getNewMessageCount',
        {},
        res => {
          this.newMessageCount = res.data.newCount;
        },
        { noload: true }
      );
    },

    onHide() {
      clearInterval(this.timer);
    },
    onUnload() {
      clearInterval(this.timer);
    }
  },
  onShow: function () {
    var u = common.osg.currentUser();
    // if (u && u._id && u.nickname && u.phone)
    if (u && u._id) {
      //用户信息
      this.userinfo = common.osg.currentUser();
      this.isLogined = true;
      //获取未读消息数量
      this.getNewMessageCount();
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.getNewMessageCount();
      }, 20000);
    } else {
      this.isLogined = false;
    }
  }
};
</script>

<style lang="scss">
.header {
  width: 100vw;
  // height: 30vw;
  // padding: 0 4vw;
  padding: 3vw 3vw 6vw 10vw;
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

.content {
  width: 100vw;
  height: 10vw;
  padding: 0 3vw;
  box-sizing: border-box;
  border-radius: 0 0 100% 100%;
  background-color: #107ad0;

  .list-group {
    // height: 100vh;
    // overflow-y: auto;
    .list {
      border-radius: 20rpx;
      overflow: hidden;
    }
  }
}
</style>
