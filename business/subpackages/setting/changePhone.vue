<template>
  <view class="changePhone" @click.capture="track">
    <van-cell-group :border="false">
      <van-field
        :value="formData.phone"
        required
        type="number"
        :maxlength="11"
        clearable
        label="新手机号"
        placeholder="请输入新手机号"
        data-key="phone"
        class="c-field"
        @change="onChange"
      />
      <van-field
        :value="formData.code"
        required
        type="number"
        :maxlength="6"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
        use-button-slot
        data-key="code"
        class="c-field"
        @change="onChange"
      >
        <van-button
          slot="button"
          size="small"
          type="info"
          @click="getSms"
          v-if="!sent"
          :data-event="{ id: 'vw8BJgON1z' }"
        >
          获取验证码
        </van-button>
        <van-button slot="button" size="small" type="info" v-else>
          {{ count }}s后重新获取
        </van-button>
      </van-field>
    </van-cell-group>
    <view class="c-text-center c-m-t-100">
      <van-button type="info" round @click="submit" :data-event="{ id: 'VOQef02RrK' }">
        确 认
      </van-button>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      formData: { phone: '', code: '' },
      sent: false,
      count: 60
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
  },
  methods: {
    onChange(e) {
      this.formData[e.target.dataset.key] = e.detail;
    },
    /**
     * 获取验证码
     */
    getSms() {
      if (!this.formData.phone) {
        common.osg.toast('请输入新手机号', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请输入正确格式的手机号', 'none');
        return;
      }
      let timestamp = new Date().getTime();
      let phone = this.formData.phone;
      common.osg.ajax(
        `~${common.osg.host}/fsgo/i/phone/sendRegisterCode.do`,
        {
          tenantId: '1340835581184723420',
          timestamp,
          phone,
          m: common.osg.md5('xlink*api*md5' + timestamp + phone)
        },
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
    submit() {
      if (!this.formData.phone) {
        common.osg.toast('请输入新手机号', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请输入正确格式的手机号', 'none');
        return;
      }
      if (!this.formData.code) {
        common.osg.toast('新输入短信验证码', 'none');
        return;
      }
      common.osg.ajax(
        'user/upsertPhoneOfOneself',
        {
          phone: this.formData.phone,
          code: this.formData.code
        },
        res => {
          common.osg.alert('手机号修改成功，请使用新手机号登录', () => {
            // 缓存登录账号和密码
            let login = wx.getStorageSync('login');
            if (login) {
              login.phone = this.formData.phone;
              wx.setStorageSync('login', login);
            }
            // 重新登陆
            common.osg.open('../login/loginAuth', null, { mode: 'reLaunch' });
          });
        }
      );
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #fff !important;
  .changePhone {
    .c-field {
      .van-cell__title {
        max-width: 90px;
      }
    }
  }
}
</style>
