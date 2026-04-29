<template>
  <view id="coupons-wrapper" @click.capture="track">
    <view
      v-for="(item, index) in list"
      :key="index"
      @click="showQrcode"
      :data-code="item.code"
      :data-event="{ id: '4xe_HpFp0J' }"
    >
      <view
        class="coupons-card"
        v-if="item.type == '99' && item.status != '3'"
        :data-event="{ id: '4xe_HpFp0J' }"
      >
        <view class="card-left overdue-bg" :data-event="{ id: '4xe_HpFp0J' }">
          <view class="sawtooth" :data-event="{ id: '4xe_HpFp0J' }">
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
          </view>
          <view style="font-size: 84rpx; margin-left: 8rpx" :data-event="{ id: '4xe_HpFp0J' }">
            兑
          </view>
        </view>
        <view class="card-right" :data-event="{ id: '4xe_HpFp0J' }">
          <view class="card-right-title" :data-event="{ id: '4xe_HpFp0J' }">
            <view class="title-icon ticket-bg" :data-event="{ id: '4xe_HpFp0J' }">兑奖券</view>
            <view class="title-text" :data-event="{ id: '4xe_HpFp0J' }">{{ item.title }}</view>
            <view
              class="title-state overdue-title"
              v-if="item.status"
              :data-event="{ id: '4xe_HpFp0J' }"
            >
              {{ codelabel('couponState', item.status) }}
            </view>
          </view>
          <view :data-event="{ id: '4xe_HpFp0J' }">
            <view :data-event="{ id: '4xe_HpFp0J' }">编号：{{ item.code }}</view>
          </view>
          <view :data-event="{ id: '4xe_HpFp0J' }">
            <view :data-event="{ id: '4xe_HpFp0J' }">
              有效期至：{{ item.startDate | deleteseconds }} ~ {{ item.endDate | deleteseconds }}
            </view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
          </view>
        </view>
      </view>
      <view
        class="coupons-card"
        v-if="item.type == '99' && item.status == '3'"
        :data-event="{ id: '4xe_HpFp0J' }"
      >
        <view class="card-left overdue-line-bg" :data-event="{ id: '4xe_HpFp0J' }">
          <view class="sawtooth" :data-event="{ id: '4xe_HpFp0J' }">
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
          </view>
          <view style="font-size: 84rpx; margin-left: 8rpx" :data-event="{ id: '4xe_HpFp0J' }">
            兑
          </view>
        </view>
        <view class="card-right" :data-event="{ id: '4xe_HpFp0J' }">
          <view class="card-right-title" :data-event="{ id: '4xe_HpFp0J' }">
            <view class="title-icon ticket-bg" :data-event="{ id: '4xe_HpFp0J' }">兑奖券</view>
            <view class="title-text" :data-event="{ id: '4xe_HpFp0J' }">{{ item.title }}</view>
            <view class="title-state" v-if="item.status" :data-event="{ id: '4xe_HpFp0J' }">
              {{ codelabel('couponState', item.status) }}
            </view>
          </view>
          <view :data-event="{ id: '4xe_HpFp0J' }">
            <view :data-event="{ id: '4xe_HpFp0J' }">编号：{{ item.code }}</view>
          </view>
          <view :data-event="{ id: '4xe_HpFp0J' }">
            <view :data-event="{ id: '4xe_HpFp0J' }">
              有效期至：{{ item.startDate | deleteseconds }} ~ {{ item.endDate | deleteseconds }}
            </view>
            <view :data-event="{ id: '4xe_HpFp0J' }"></view>
          </view>
        </view>
      </view>
    </view>
    <van-dialog
      use-slot
      :title="content"
      :show="qrcodeShow"
      @confirm="closeQrcode"
      :data-event="{ id: 'T3III-rY3b', capture: false }"
    >
      <tki-qrcode :val="qrval" size="300" ref="qrcode" :onval="true"></tki-qrcode>
    </van-dialog>
    <view v-if="!isEmpty" style="width: 40vh">
      <van-empty description="没有优惠券" />
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
import tkiQrcode from '@/wxcomponents/tki-qrcode/tki-qrcode.vue';
export default {
  components: {
    tkiQrcode
  },
  data() {
    return {
      list: [],
      options: {
        codecfg_couponState: {
          codeId: 'couponState'
        }
      },
      isEmpty: false,
      qrcodeShow: false, //是否展示二维码弹窗
      qrval: 'https://www.fsgo365.cn', //二维码地址
      cid: '', //二维码id
      content: '' //二维码展示兑奖券编码
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    common.osg.codeoption(() => {
      this.getData();
    });
  },

  methods: {
    getData: function () {
      // 0没启用
      // 1可以使用，可以核销
      // -1 已使用
      let params = {
        type: 2
      };
      common.osg.ajax('/basic/couponPrinting/workBouny', params, res => {
        let list = [];
        for (var key in res) {
          list = list.concat(res[key]);
        }
        list.sort((x, y) => new Date(y.createTime).valueOf() - new Date(x.createTime).valueOf());
        this.list = list;
        this.isEmpty = list.length == 0;
        this.$forceUpdate();
      });
    },
    //获取当前租户信息
    getProfile: function () {
      return new Promise(resolve => {
        common.osg.ajax(`s/find/${this.id}.do`, {}, res => {
          if (res.entity) this.profile = res.entity;
          // console.log(this.profile);
          //设置主题色（按钮...）
          this.$util.customizeMenuChange(res.entity.menuBarBgColor);
          //设置浏览器icon图标/title
          document.querySelector('#titleBroswer').innerHTML = !this.profile.browserTitle
            ? 'FSGO'
            : this.profile.browserTitle;
          document.querySelector('#iconTitleBroswer').href = !this.profile.browserIcon
            ? './favicon.ico'
            : this.profile.browserIcon;
        });
        resolve();
      });
    },
    //反显字典表
    codelabel: function (codeType, codeValue) {
      var opts = this.options[codeType];
      if (opts) {
        for (var i = 0; i < opts.length; i++) {
          if (codeValue == opts[i].value) return opts[i].name;
        }
      }
      if (!codeValue) {
        return codeValue;
      } else {
        return '未知';
      }
    },
    //展示二维码
    showQrcode(e) {
      let code = e.currentTarget.dataset.code;
      this.content = code;
      this.qrval = 'https://www.fsgo365.cn?code=' + code;
      this.qrcodeShow = true;
      this.$nextTick(() => {
        this.$refs.qrcode._makeCode();
      });
    },
    closeQrcode() {
      this.getData();
      this.$refs.qrcode._clearCode();
      this.qrcodeShow = false;
    }
  },
  filters: {
    deleteseconds(dateVal) {
      return dateVal ? dateVal.substr(0, dateVal.indexOf(' ')) : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.fullScreen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.coupons-card {
  width: 100%;
  height: 220rpx;
  // border: 1rpx red solid;
  display: flex;
  padding: 8rpx 16rpx;
  box-sizing: border-box;

  .card-left {
    width: 234rpx;
    width: 244rpx;
    // background-color: rgba(250, 173, 82, 1);
    // background: -webkit-gradient(linear, 0 0, 0 100%, from(red), to(blue));

    // background: linear-gradient(-45deg, rgba(250, 173, 82, 1), rgba(254, 50, 103, 1));
    background: linear-gradient(-45deg, #f5aa26, #ff04c9);

    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding-left: 16rpx;

    .sawtooth {
      position: absolute;
      left: -5px;
      top: 0px;
      width: 10px;
      height: 100%;
      display: flex;
      flex-direction: column;

      view {
        width: 100%;
        height: 40rpx;
        border-radius: 50%;
        // background: #fff;
        background: #eff2f5;
      }
    }
  }

  .overdue-line-bg {
    background: linear-gradient(-45deg, #ffa600, #ff0000);
  }

  .overdue-bg {
    background: #adadad;
  }

  .card-left view {
    color: #fff;
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin-right: 20rpx;
  }

  .card-right {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    padding: 14rpx;
    flex: 1;
    overflow: hidden;

    .card-right-title {
      height: 58rpx;
      display: flex;
      justify-content: flex-start;

      .title-icon {
        background-color: #faad52;
        font-size: 24rpx;
        padding: 3rpx 10rpx;
        color: #fff;
        height: 40rpx;
        line-height: 40rpx;
        border-radius: 4rpx;
      }

      .ticket-bg {
        background: #fd4264;
      }

      .title-text {
        font-size: 26rpx;
        color: #888888;
        text-align: left;
        height: 40rpx;
        line-height: 40rpx;
        margin-left: 10rpx;
        width: 260rpx;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .title-state {
        color: #fff;
        background: #f15352;
        transform: rotate(40deg);
        width: 150rpx;
        font-size: 22rpx;
        display: flex;
        height: 37rpx;
        line-height: 37rpx;
        padding: 0 10rpx;
        justify-content: center;
        position: absolute;
        top: 18rpx;
        right: -40rpx;
      }

      .overdue-title {
        background: #adadad;
      }
    }

    view {
      display: flex;
      justify-content: space-between;
      font-size: 22rpx;
      color: #adadad;

      view {
        font-size: 22rpx;
        color: #adadad;
      }
    }
  }
}
</style>
<style>
.tki-qrcode {
  text-align: center;
  padding: 20rpx;
}
</style>
