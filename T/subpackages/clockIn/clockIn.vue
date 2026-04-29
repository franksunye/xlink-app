<template>
  <view class="account">
    <view class="blockCard">
      <view class="signRecord">
        <view class="signInfo1" @click="doOpen('../../subpackages/clockIn/clockInDetails')">
          上班打卡
          <text class="text-green">{{ record[0].times ? record[0].times : '未打卡' }}</text>
          <view class="sign_address">
            <view class="">{{ record[0].address ? record[0].address : '暂无打卡地址' }}</view>
          </view>
        </view>
        <view class="signInfo2">
          下班打卡
          <text class="text-green">{{ record[1].times ? record[1].times : '未打卡' }}</text>
          <view class="sign_address">
            <view class="">{{ record[1].address ? record[1].address : '暂无打卡地址' }}</view>
          </view>
        </view>
      </view>
      <view class="c_clock">
        <view
          :class="status == 1 ? 'c1 clock_time' : 'clock_time'"
          @click="clockInStart(1)"
          style="text-align: center"
        >
          <view style="margin-top: 65px">
            <text style="display: block">上班打卡</text>
            <text style="display: block">{{ nowTime }}</text>
          </view>
        </view>
        <view
          :class="status == 1 ? 'c2 clock_time_over' : 'clock_time_over'"
          @click="clockInStart"
          style="text-align: center"
        >
          <view style="margin-top: 65px">
            <text style="display: block">已打卡</text>
            <text style="display: block">{{ now_time_stop }}</text>
          </view>
        </view>
      </view>
      <view class="clock_address">
        <van-icon name="location" color="#508AF6" />
        <text>{{ current_address }}</text>
      </view>
      <view class="refresh" @click="refreshAdd">刷新位置</view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      status: '',
      nowTime: '',
      current_address: '',
      points: {},
      now_time_stop: '' //已打卡时间
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    let user = wx.getStorageSync('user');
    this.getCurrentTime();
    this.location();
    // if (app.globalData.points) {
    //   this.getGDcode();
    // }
  },
  onShow() {},
  onHide() {
    clearInterval(this.timer);
  },
  onUnload() {
    clearInterval(this.timer);
  },
  methods: {
    // 路由跳转
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    clockInStart(val) {
      wx.vibrateLong({
        success: function () {
          // 在成功回调中递归调用自身，以实现震动的连续效果
        },
        fail: function (err) {}
      });
      //使手机震动400ms
      if (val == 1) {
        common.osg.ajax('wmt/biz/punch/dot ', { point: this.points }, res => {
          this.setData({
            status: 1, //上班已打卡
            now_time_stop: this.nowTime
          });
          console.log(res, '---打卡res');
        });
      }
    },
    getPunch() {
      debugger;
      common.osg.ajax('wmt/biz/punch/dot ', { point: this.points }, res => {
        console.log(res, '---打卡res');
      });
    },
    getCurrentTime: function () {
      this.timer = setInterval(() => {
        this.setData({
          nowTime: this.getTime()
        });
        console.log('定时器111', this.nowTime);
      }, 1000);
    },

    getTime() {
      let dateTime = '';
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
      dateTime = hh + ':' + mf + ':' + ss;
      return dateTime;
    },
    location() {
      let that = this;
      // 获取地理位置
      wx.getLocation({
        // 获取地理位置成功
        success(res) {
          console.log(res, '---res');
          that.points = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          that.getGDcode();
        },
        // 获取地理位置失败
        fail(res) {}
      });
    },
    getGDcode() {
      common.osg.ajax(
        '~https://restapi.amap.com/v3/geocode/regeo',
        {
          key: '4ff32da422dedb48160965b8780536f3',
          location: `${this.points.longitude},${this.points.latitude}`,
          extensions: 'base', // 返回结果控制
          batch: false //batch=true为批量查询。batch=false为单点查询
        },
        res => {
          this.current_address = res.regeocode.formatted_address;
        }
      );
    },
    refreshAdd() {
      this.location();
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  background: #f8f8f8;
}
.blockCard {
  height: 100vh;
  border-radius: 8px;
  background: #fff;
  margin: 15px;
}
.c_clock {
  margin: 200rpx auto 0;
  width: 350rpx;
  height: 380rpx;
  perspective: 1500;
  -webkit-perspective: 1500;
  -moz-perspective: 1500;
}

.clock_time {
  width: 350rpx;
  height: 350rpx;
  margin-bottom: 30rpx;
  position: absolute;
  transition: all 1s;
  backface-visibility: hidden;
}

.clock_time::after {
  content: '';
  top: 0;
  left: 0;
  width: 350rpx;
  height: 350rpx;
  border-radius: 50%;
  position: absolute;
  z-index: 9;
  background: rgba(48, 124, 237, 0.08);
  animation: scale 1s infinite alternate-reverse;
}

/* 已打卡 */
.clock_time_over {
  width: 350rpx;
  height: 350rpx;
  margin-bottom: 30rpx;
  border-radius: 50%;
  background: rgba(48, 124, 237, 0.08);
  position: absolute;
  transition: all 1s;
  backface-visibility: hidden;
  transform: rotateY(-180deg);
}

.clock_time_over::after {
  position: absolute;
  z-index: 11;
  content: '';
  width: 320rpx;
  height: 320rpx;
  background: #c6ced9;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.clock_time_over text {
  position: relative;
  z-index: 13;
  color: #ffffff;
}

.clock_time_over text:first-child {
  font-size: 36rpx;
  margin-bottom: 14rpx;
}

.clock_time_over text:last-child {
  font-size: 28rpx;
}
@keyframes scale {
  0% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.clock_time::before {
  position: absolute;
  z-index: 11;
  content: '';
  width: 320rpx;
  height: 320rpx;
  background: rgba(48, 124, 237, 0.79);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.clock_time text {
  position: relative;
  z-index: 13;
  color: #ffffff;
}

.clock_time text:first-child {
  font-size: 36rpx;
  margin-bottom: 14rpx;
}

.clock_time text:last-child {
  font-size: 28rpx;
}

.c1 {
  transform: rotateY(180deg);
}

.c1::after {
  animation: none !important;
}

.c2 {
  transform: rotateY(0deg);
}

.clock_address {
  text-align: center;
  font-size: 30rpx;
  color: #333333;
  width: 80%;
  margin: 20px auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clock_address text {
  white-space: normal;
}
.refresh {
  padding: 25px 0;
  color: #307ced;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signRecord {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  font-size: 14px;
}

.signInfo1 {
  width: 48%;
  // height: 65px;
  background: #f1f1f1;
  padding: 10px;
  margin: 10px 5px 10px 10px;
  border-radius: 5px;
}
.signInfo2 {
  width: 48%;
  // height: 65px;
  background: #f1f1f1;
  padding: 10px;
  margin: 10px 10px 10px 5px;
  border-radius: 5px;
}
.signInfo text {
  float: inline-end;
}

.sign_address {
  display: flex;
  margin-top: 5px;
}

.sign_address view {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  margin-top: 1px !important;
  color: #5f5a5a;
}

.text-green {
  color: green;
  padding-left: 20px;
}

// .clock_address {
//   font-size: 28rpx;
//   color: #333333;
//   width: 450rpx;
//   margin: 0 auto;
// }

// .clock_address text {
//   vertical-align: middle;
// }
</style>
