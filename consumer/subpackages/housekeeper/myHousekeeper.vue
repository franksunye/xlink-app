<template>
  <view class="myHousekeeper">
    <view class="card">
      <!-- <image
        src="https://pub.fsgo365.cn/myHousekeeper-bg.png"
        mode="widthFix"
        style="width: 358px; display: flex"
      /> -->
      <view class="card-bg">
        <image
          src="https://pub.fsgo365.cn/myHousekeeper-logo.png"
          mode="heightFix"
          class="housekeeper-logo"
        />
      </view>
      <view class="avatar-view">
        <image src="https://pub.fsgo365.cn/housekeeper-avatar.png" class="avatar" />
      </view>
      <view class="info">
        <view class="c-flex c-flex-center">
          <text>小杨</text>
          <text class="tag">已认证</text>
        </view>
        <view class="c-flex c-flex-center c-m-t-10">
          <van-rate
            :value="5"
            color="#F9DE55"
            void-icon="star"
            void-color="#eee"
            style="display: flex"
          />
        </view>
        <view class="buttons">
          <view class="button-view">
            <view class="button">
              <image
                src="../../static/images/IDcard.png"
                style="width: 25px; height: 19.34px; display: flex"
              ></image>
            </view>
            <text>管家信息</text>
          </view>
          <view class="button-view">
            <view class="button">
              <image
                src="../../static/images/phone.png"
                style="width: 25px; height: 19.34px; display: flex"
              ></image>
            </view>
            <text>电话沟通</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {};
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.userId = params.id;
    this.getHousekeepers();
  },
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    getHousekeepers() {
      common.osg.ajax(
        'parnter/queryhousekeeper',
        {
          'is:relatedRecordId|string#and': this.userId,
          resourceType: 'technician',
          'in:resourceRoles|array#and': '1', //只查管家
          'ne:workType|integer#and': '-1', // 不展示离线管家
          'is:state|integer#and': 1,
          sortField: 'workType',
          sortOrder: 'desc'
        },
        res => {
          // 解析照片
          res.data.map(item => {
            item.users = item.users || {};
            if (item.users.profileImg && common.osg.isJson(item.users.profileImg)) {
              item.users.profileImg = JSON.parse(item.users.profileImg);
            } else {
              item.users.profileImg = [];
            }
          });
          debugger;
          this.housekeepers = res.data;
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.myHousekeeper {
  height: 100vh;
  background: #f8f8f8;
  padding: 16px;
  .card {
    background: #fff;
    width: 100%;
    border-radius: 10px;
    .card-bg {
      width: 100%;
      height: 220px;
      border-radius: 10px;
      background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
      position: relative;
      .housekeeper-logo {
        width: 183px;
        height: 175px;
        position: absolute;
        right: 0;
        bottom: -16px;
      }
    }
    .avatar-view {
      width: 90px;
      height: 90px;
      margin: -48px auto;
      position: relative;
      &::before {
        content: '';
        width: 24px;
        height: 24px;
        background-color: transparent;
        position: absolute;
        z-index: 10;
        top: 25px;
        left: -20px;
        border-bottom-right-radius: 24px;
        box-shadow: 6px 6px #fff;
      }
      &::after {
        content: '';
        width: 24px;
        height: 24px;
        background-color: transparent;
        position: absolute;
        z-index: 10;
        top: 25px;
        right: -26px;
        border-bottom-left-radius: 24px;
        box-shadow: -6px 6px #fff;
      }
      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        border: 8px solid #fff;
        margin: -45px auto;
      }
    }
    .info {
      margin-top: 60px;
      text-align: center;
      .tag {
        padding: 2px 7px;
        border-radius: 300px 200px 200px 0px;
        background: linear-gradient(316deg, #f8d7a1 0%, #ffc658 100%);
        color: #883b00;
        font-size: 8px;
        font-weight: 500;
        margin-left: 5px;
      }
      .buttons {
        margin-top: 30px;
        padding-bottom: 35px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        .button-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          > text {
            color: #736e6e;
            font-size: 12px;
            margin-top: 10px;
          }
          .button {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
