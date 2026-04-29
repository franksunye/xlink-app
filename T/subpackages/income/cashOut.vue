<template>
  <view class="account">
    <view class="topBlock">
      <view>
        <view>可提现金额：{{ myIncomeData.surplus / 100 || 0 }}</view>
        <!-- <view>100积分=x元</view> -->
      </view>
    </view>
    <view class="middleBlock">
      <!-- @click="doPaymentMethod() -->
      <view class="paymentMethod" @click="doPaymentMethod()">
        <view>选择提现方式</view>
        <view
          class="c-flex"
          v-if="paymentMethod.value == 'weChat'"
          style="position: absolute; left: 200px; color: #f75429"
        >
          <view style="margin: 2px 5px 0 0">
            <image style="width: 15px" mode="widthFix" src="../../static/images/iconWeChat.png" />
          </view>
          <view>微信提现</view>
        </view>
        <view
          class="c-flex"
          v-if="paymentMethod.value == 'bankCard'"
          style="position: absolute; left: 200px; color: #f75429"
        >
          <view style="margin: 2px 5px 0 0">
            <image style="width: 15px" mode="widthFix" src="../../static/images/iconBankCard.png" />
          </view>
          <view>银行卡提现</view>
        </view>
      </view>
      <!-- <view class="middleBlockMoney">最高兑换金额：20元</view> -->
      <view class="c-flex middleBlockInput">
        <view>￥</view>
        <!-- <van-cell-group :border="false">
 
            <van-field
              type="digit"
              :value="priceAll"
              :border="false"
              @input="handlePrice"
              @blur="blurPrice"
              placeholder="请输入提现金额"
            />
          </van-cell-group> -->
        <!-- :value="priceOne" -->
        <input
          style="margin-top: 10px"
          @input="handlePrice"
          v-model="priceValue"
          type="digit"
          placeholder="请输入提现金额"
        />
      </view>
      <van-divider class="divider" customStyle="width: 327px; " />
      <view v-if="paymentMethod.value == 'weChat'" class="middleBlockRemark">
        *单次提现至微信钱包金额限额为200元/笔，提现至微信钱包限800元/月，提现金额800元以上。
      </view>
      <view v-if="paymentMethod.value == 'bankCard'" class="middleBlockRemark">
        *首次提现需填写银行账户信息并完成签约。
      </view>
    </view>
    <view class="firstBtn" v-if="paymentMethod.value == 'weChat'">
      <van-button @click="takeCash('2')">确认提现</van-button>
    </view>
    <view class="firstBtn" v-if="paymentMethod.value == 'bankCard'">
      <van-button @click="takeCash('1')">确认提现</van-button>
    </view>
    <!-- zhelongState: 1签约中 2已签约 -->
    <view class="middleBtn" v-if="paymentMethod.value == 'bankCard' && !zhelongState">
      <van-button @click="doOpen('../income/sing')">开通提现账户</van-button>
    </view>
    <view class="middleBtn" v-if="zhelongState == 1">
      <van-button
        @click="
          doOpen('../web/web', {
            url: zhelongSignUrl
          })
        "
      >
        开通提现账户
      </van-button>
    </view>
    <view class="lasteBtn">
      <van-button @click="doOpen('../income/withdrawalDetails')">提现明细</van-button>
    </view>
    <!--  -->
    <van-popup
      :show="paymentMethod.show"
      position="bottom"
      closeable
      close-icon-position="top-left"
      @close="onClose"
    >
      <van-cell-group>
        <van-cell class="vanTitle" style="text-align: center" title="请选择提现方式" value="" />
      </van-cell-group>
      <view class="popupConter" @click="changePaymentMethod('weChat')">
        <view class="c-flex">
          <view>
            <image style="width: 15px" mode="widthFix" src="../../static/images/iconWeChat.png" />
          </view>
          <view>
            <view class="popupConterT">微信提现</view>
            <view class="popupConterR">
              *单次提现至微信钱包金额限额为200元/笔，提现至微信钱包限800元/月。
            </view>
          </view>
        </view>
      </view>
      <view class="popupConter" @click="changePaymentMethod('bankCard')">
        <view class="c-flex">
          <view>
            <image style="width: 15px" mode="widthFix" src="../../static/images/iconBankCard.png" />
          </view>
          <view>
            <view class="popupConterT">银行卡提现</view>
            <view class="popupConterR">*首次提现需填写银行账户信息并完成签约。</view>
          </view>
        </view>
      </view>

      <view></view>
    </van-popup>
  </view>
</template>

<script>
import detailVue from '../noticeManage/detail.vue';
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      systemInfo: {
        menuButtonObject: {}
      },
      priceValue: '',
      paymentMethod: {
        show: false,
        value: 'bankCard' //weChat微信支付  bankCard银行卡支付
      },
      priceShow: false,
      myIncomeData: {},
      zhelongState: '',
      zhelongSignUrl: ''
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    let user = wx.getStorageSync('user');
    this.zhelongState = user.user.zhelongState;
    this.zhelongSignUrl = user.user.zhelongSignUrl;
    console.log(this.zhelongState, '---this.zhelongState');
    this.getMyIncome();
    this.systemInfo = app.globalData.systemInfo;
  },
  onShow() {},
  methods: {
    doOpen(path, data, options) {
      common.osg.open(path, data, options);
    },
    // 操作支付方式
    doPaymentMethod() {
      this.paymentMethod.show = true;
    },
    onClose() {
      this.setData({
        'paymentMethod.show': false
      });
    },
    changePaymentMethod(e) {
      this.paymentMethod.value = e;
      this.paymentMethod.show = false;
      console.log(this.paymentMethod.value, '支付方式');
    },
    validator(val) {
      console.log(val);
      return /^[1-9]\d{0,11}(\.\d{1,2})?$|^0(\.\d{1,2})?$/.test(val);
    },
    num() {
      this.$refs.form
        .validate()
        .then(() => {
          this.show = false;
        })
        .catch(() => {});
    },
    // (([1-9][0-9]*)\.([0-9]{3}))|[0]\.([0-9]{3})
    handlePrice(e) {
      e.target.value = String(e.target.value);
      e.target.value = e.target.value.replace(/[^\d.]/g, ''); //清除“数字”和“.”以外的字符
      e.target.value = e.target.value.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
      e.target.value = e.target.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      e.target.value = e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
      e.target.value = e.target.value.replace(/^\./g, ''); //首位不能输入“.”
      if (e.target.value.indexOf('.') < 0 && e.target.value != '') {
        //如果没有小数点，首位不能为0，如01、02...
        e.target.value = parseFloat(e.target.value);
      }

      this.$nextTick(() => {
        this.priceValue = e.target.value;
        // console.log(this.priceValue, '--this.priceValue');
      });
    },
    zhelongSing() {
      common.osg.ajax('wmt/biz/zhelong/sign', {}, res => {
        this.doOpen('../web/web', {
          url: res.data
        });
        this.activityDefData = res.data;
      });
    },
    takeCash(val) {
      if (common.osg.isRepeatClick('takeCash')) {
        return;
      }
      // val   1蛰龙  2微信
      if (val == 1 && this.priceValue < 50) {
        common.osg.alert('最低提现金额为50元');
        return;
      }
      let type = val;
      let count = this.priceValue.toString();
      console.log(typeof count, typeof val, '---typeof');
      common.osg.ajax('wmt/basic/income/takeCash', { type, count }, res => {
        common.osg.alert('提现成功');
      });
      this.priceValue = '';
    },
    getMyIncome() {
      common.osg.ajax('wmt/basic/income/myIncome', {}, res => {
        this.myIncomeData = res.data;
        console.log(this.myIncomeData, 'this.myIncomeData');
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
.topBlock {
  background: #fff;
  margin: 18px 15px 15px 15px;

  border-radius: 8px;
  > view {
    padding: 0px 11px;
    height: 48px;
    line-height: 48px;
    display: flex;
    justify-content: space-between;
  }
  > view:first-child {
    color: #8f8f8f;
    font-size: 14px;
    font-weight: 400;
  }
  > view:last-child {
    color: #8f8f8f;
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
  }
}
.middleBlock {
  background: #fff;
  margin: 0 15px;
  > .paymentMethod {
    position: relative;
    color: #8f8f8f;
    font-size: 14px;
    font-weight: 400;
    padding: 11px;
    display: flex;
    justify-content: space-between;
  }
  > .middleBlockMoney {
    color: #8f8f8f;
    font-size: 14px;
    font-weight: 400;
    padding: 9px 0 0 11px;
  }
  > .middleBlockInput {
    padding: 17px 0 0 16px;
    > view:first-child {
      margin-top: 3px;
      color: #000;
      font-size: 26px;
      font-weight: 600;
    }
  }
  ::v-deep.van-divider {
    margin: 0 0 0 10px;
  }
  > .middleBlockRemark {
    color: #6d6d6d;
    font-size: 10px;
    font-weight: 400;
    padding: 13px 0 13px 19px;
  }
  ::v-deep .van-cell {
    padding: 10px 10px 10px 0px;
  }
}
.firstBtn {
  margin: 11px 15px;
  ::v-deep .van-button {
    width: 100%;
    border-radius: 100px;
    background: linear-gradient(219deg, #f75429 0%, #eb2b1e 100%);
    height: 41px;
    line-height: 41px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
  }
}
.middleBtn {
  margin: 0px 15px;

  ::v-deep .van-button {
    width: 100%;
    border-radius: 100px;
    border-color: #fff;
    background: #fff;
    height: 36px;
    line-height: 36px;
    color: #000;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }
}
.lasteBtn {
  margin: 11px 15px;
  ::v-deep .van-button {
    width: 100%;
    border-radius: 100px;
    border-color: #fff;
    background: #fff;
    height: 36px;
    line-height: 36px;
    color: #000;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }
}
.vanTitle {
  ::v-deep .van-cell__title {
    padding-left: 110px;
  }
}
.popupConter {
  margin: 10px;
  border-bottom: 1px solid #ebedf0;
  .popupConterT {
    padding: 0 10px 10px 10px;
    color: #000;
    font-size: 14px;
    font-weight: 500;
  }
  .popupConterR {
    padding: 0 10px 10px 10px;
    color: #6d6d6d;
    font-size: 12px;
    font-weight: 500;
  }
}
.donghua {
  width: 30px;
  height: 30px;
  background-color: #eb2b1e;
  animation: blink 1s 5;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
.shanshuo {
  position: relative;
  animation: mydeamon 1s infinite; //1s值一秒内完成动画
  -webkit-animation: mydeamon 1s infinite; /* Safari and Chrome */
}

@keyframes mydeamon {
  0% {
    transform: scale(3); //scale代表闪烁的体型变化，其他倾斜等样式自行搜索
    opacity: 1; //透明程度
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
