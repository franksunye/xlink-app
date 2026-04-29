<template>
  <view>
    <van-empty description="请先登录后再查看功能菜单" class="c-empty">
      <van-button
        round
        type="info"
        class="getphonenumber-btn"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        登录
      </van-button>
      <!-- <van-button round type="info" @click="doOpen('/pages/index/indexLogin')">登 录</van-button> -->
      <!-- <van-button round type="info" @click="doOpen('/pages/login/loginAuth')">登 录</van-button> -->
      <!-- <van-button round type="default" @click="doOpen('/subpackages/login/register')">
          注 册   
        </van-button> -->
    </van-empty>
  </view>
</template>
<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      method: '1', // 1验证码 2密码
      hidePassword: true, //密码是否隐藏
      formData: {
        phone: '',
        password: '',
        sms: ''
      },
      sent: false,
      count: 60
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    // this.getPhoneNumber();
    // 自动恢复缓存的账号和密码
    //   let login = wx.getStorageSync('login');
    //   if (login) {
    //     this.formData.phone = login.phone;
    //     this.formData.password = login.password || '';
    //   }
  },
  methods: {
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
      let indexParams = wx.getStorageSync('indexParams') || {};
      common.osg.ajax(
        `~${common.osg.host}/fsgo/i/phone/sendVerifyCode.do`,
        { phone: this.formData.phone, tenantId: '1340835581184723420' },
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
     * 密码或验证码登录
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
      if (this.method == '1') {
        if (!this.formData.sms) {
          common.osg.toast('请输入短信验证码', 'none');
          return;
        }
        if (!/^\d{6}$/.test(this.formData.sms)) {
          common.osg.toast('请输入6位数字的验证码', 'none');
          return;
        }
      }
      if (this.method == '2' && !this.formData.password) {
        common.osg.toast('请输入密码', 'none');
        return;
      }

      common.osg.ajax(
        `index/phoneLogin.do`,
        {
          method: this.method,
          phone: this.formData.phone,
          code: this.method == '1' ? this.formData.sms : this.formData.password,
          orgId: '1340835581184723420',
          tenantId: '1340835581184723420'
        },
        res => {
          common.osg.toast('登录成功', 'none');
          // 缓存sessionId
          wx.setStorageSync('sessionId', res.data.token);
          // 获取当前角色菜单并存到缓存
          //   this.getCurrentRoleFunctions(res.data.currentRole);
          // 缓存用户信息
          wx.setStorageSync('user', res.data.user);
          // 缓存当前角色
          wx.setStorageSync('currentRole', res.data.currentRole);
          // 缓存登录账号和密码
          wx.setStorageSync('login', {
            phone: this.formData.phone,
            password: this.formData.password
          });
        }
      );
    },
    /**
     * 微信授权手机号登录
     */
    getPhoneNumber(e) {
      // 当e.detail.code没值表示用户拒绝了
      if (e.detail.code) {
        let params = {
          code: e.detail.code,
          appID: 'wx424b0548cd7c7401'
        };
        common.osg.ajax('index/getPhoneNumber', params, res => {
          common.osg.toast('登录成功', 'none');
          // 缓存sessionId
          wx.setStorageSync('sessionId', res.data.token);
          // 获取当前角色菜单并存到缓存
          //   this.getCurrentRoleFunctions(res.data.currentRole);
          // 缓存用户信息
          wx.setStorageSync('user', res.data.user);
          // 缓存当前角色
          wx.setStorageSync('currentRole', res.data.currentRole);
          debugger;
          if (res.data.user) {
            common.osg.open('../../pages/index/index', null, {
              mode: 'reLaunch'
            });
          }
        });
      }
    },
    /**
     * 获取当前角色菜单并存到缓存
     */
    getCurrentRoleFunctions(currentRole) {
      common.osg.ajax(
        'function/changeRole',
        {
          roleIds: currentRole._id
        },
        res => {
          let functionList = res.data.functionList.filter(item => {
            return item.openType;
          });
          functionList.map(item => {
            let url = item.action;
            if (url.indexOf('?') != -1) {
              let paramsUrl = url.split('?')[1];
              let paramArr = paramsUrl.split('&');
              let params = {};
              paramArr.map(item => {
                params[item.split('=')[0]] = item.split('=')[1];
              });
              item.orderState = params.orderState;
              item.status = params.status || 'all';
              item.type = params.type || '';
            } else {
              item.status = 'all';
            }
          });
          // 缓存当前角色菜单
          wx.setStorageSync('currentRoleFunctions', functionList);
          let pages = getCurrentPages();
          if (pages.length == 1) {
            // 跳转到首页
            common.osg.open('../../pages/index/index', null, {
              mode: 'reLaunch'
            });
          } else {
            // 返回上一页
            wx.navigateBack({
              delta: 1
            });
          }
        }
      );
    }
  }
};
</script>
<style lang="scss">
page {
  background-color: #fff !important;
  .login {
    .logintype-icon {
      width: 50px;
      text-align: center;
      margin: 0 10px;
      font-size: 12px;
      color: #969799;
    }
    .van-cell {
      height: 50px;
    }
    .getphonenumber-btn {
      width: 50px;
      height: 50px;
      background-color: transparent;
      position: absolute;
      top: 0;
      left: 0;
      &:after {
        border: none !important;
      }
    }
  }
}
</style>
