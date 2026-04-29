<template>
  <view>
    <view style="width: 50%; margin: 0 auto">
      <image
        style="width: 100%; height: 300rpx"
        src="/static/images/logo-bs.jpg"
        mode="aspectFit"
      ></image>
    </view>
    <van-field
      :value="formData.phone"
      label="手机号"
      placeholder="请输入手机号"
      :border="false"
      data-key="phone"
      @change="onChange"
    />
    <van-field
      :value="formData.sms"
      data-key="sms"
      @change="onChange"
      center
      label="验证码"
      placeholder="请输入短信验证码"
      :border="false"
      use-button-slot
      :maxlength="6"
    >
      <van-button slot="button" size="small" color="#D32D26" @click="getSms" v-if="!sent">
        获取验证码
      </van-button>
      <van-button slot="button" size="small" color="#D32D26" v-else>
        {{ count }}s后重新获取
      </van-button>
    </van-field>
    <van-button
      color="#D32D26"
      custom-style="margin:16px;width:calc(100% - 32px);box-sizing:border-box;"
      @click="login"
    >
      登录
    </van-button>
  </view>
</template>
<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      formData: {
        phone: '',
        sms: ''
      },
      sent: false,
      count: 60
    };
  },
  onLoad(params) {},
  onShow() {
    this.doInit();
  },
  methods: {
    doInit(params) {
      common.osg.init(this, params, app);
      // 1天内无需重复登录
      let login = wx.getStorageSync('login');
      if (login && new Date().getTime() - login.time <= 1000 * 60 * 60 * 24 * 1) {
        common.osg.confirm('您24小时内登录过，是否直接跳转到我的质保页面？', () => {
          common.osg.open('../../subpackages/warranty/warrantys');
        });
        return;
      }
    },
    /**
     * 字段赋值
     */
    onChange(e) {
      this.formData[e.target.dataset.key] = e.detail;
    },
    /**
     * 获取验证码
     */
    getSms() {
      if (!this.formData.phone) {
        common.osg.toast('请输入手机号', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请输入正确格式的手机号', 'none');
        return;
      }
      common.osg.ajax(
        `~${common.osg.host}/fsgo/i/zDocument/zSendCode.do`,
        { phone: this.formData.phone },
        res => {
          // 验证码已发送
          this.sent = true;
          // 倒计时60s
          this.count = 60;
          var timer = setInterval(() => {
            --this.count;
            if (this.count == 0) {
              clearInterval(timer);
              this.sent = false;
            }
          }, 1000);
        }
      );
    },
    /**
     * 验证码登录
     */
    login() {
      if (!this.formData.phone) {
        common.osg.toast('请输入手机号', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请输入正确格式的手机号', 'none');
        return;
      }
      if (!this.formData.sms) {
        common.osg.toast('请输入短信验证码', 'none');
        return;
      }
      if (!/^\d{6}$/.test(this.formData.sms)) {
        common.osg.toast('请输入6位数字的验证码', 'none');
        return;
      }

      common.osg.ajax(
        `~${common.osg.host}/fsgo/i/zDocument/zLogin.do`,
        { phone: this.formData.phone, code: this.formData.sms },
        () => {
          wx.setStorageSync('login', {
            phone: this.formData.phone,
            time: new Date().getTime()
          });
          common.osg.open('../../subpackages/warranty/warrantys');
        }
      );
    }
  }
};
</script>
<style>
page {
  background-color: #fff !important;
}
</style>
