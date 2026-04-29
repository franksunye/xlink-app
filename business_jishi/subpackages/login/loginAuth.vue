<template>
  <view class="login" @click.capture="track">
    <view class="c-flex c-flex-center">
      <image
        style="width: 200px; height: 200px"
        src="https://pub.fsgo365.cn/logo_jishi.jpg"
        mode="widthFix"
      ></image>
    </view>
    <van-field
      key="phone"
      :value="formData.phone"
      label="手机号"
      placeholder="请输入手机号"
      type="text"
      :clearable="false"
      data-key="phone"
      :maxlength="11"
      class="c-field"
      @change="onChange"
    />
    <van-field
      v-if="method == '3'"
      key="newPassword"
      :value="formData.newPassword"
      data-key="newPassword"
      @change="onChange"
      center
      label="新密码"
      placeholder="请输入新密码"
      :clearable="false"
      :password="hidePassword ? true : false"
      :right-icon="hidePassword ? 'closed-eye' : 'eye-o'"
      @click-icon="hidePassword = !hidePassword"
      @blur="newPasswordBlur"
      :error-message="newPasswordRules ? '' : '8-16位大小写字母、数字、特殊字符组成'"
      class="c-field"
    ></van-field>
    <van-field
      v-if="method == '3'"
      :value="formData.newPassword2"
      data-key="newPassword2"
      @change="onChange"
      center
      label="确认新密码"
      placeholder="请再次输入新密码"
      :clearable="false"
      :password="hidePassword ? true : false"
      :right-icon="hidePassword ? 'closed-eye' : 'eye-o'"
      @blur="newPassword2Blur"
      @click-icon="hidePassword = !hidePassword"
      :error-message="newPassword2Rules ? '' : '两次输入密码不一致!'"
      class="c-field"
    ></van-field>
    <van-field
      key="sms"
      v-if="method == '1' || method == '3'"
      :value="formData.sms"
      data-key="sms"
      @change="onChange"
      center
      label="验证码"
      placeholder="请输入短信验证码"
      :clearable="false"
      use-button-slot
      :maxlength="6"
      class="c-field"
      right-icon=""
    >
      <van-button
        slot="button"
        size="small"
        type="info"
        @click="getSms"
        v-if="!sent"
        :data-event="{ id: 'hnyzlSbotO' }"
      >
        获取验证码
      </van-button>
      <van-button slot="button" size="small" type="info" v-else>{{ count }}s后重新获取</van-button>
    </van-field>
    <van-field
      key="password"
      v-else-if="method == '2'"
      :value="formData.password"
      data-key="password"
      @change="onChange"
      center
      label="密码"
      placeholder="请输入密码"
      :clearable="false"
      :password="hidePassword ? true : false"
      :right-icon="hidePassword ? 'closed-eye' : 'eye-o'"
      @click-icon="hidePassword = !hidePassword"
      class="c-field"
      :maxlength="16"
    ></van-field>

    <van-button
      v-if="method == '3'"
      type="info"
      round
      custom-style="margin:50px 16px 30px;width:calc(100% - 32px);box-sizing:border-box;"
      @click="updatePassword"
      :data-event="{ id: '6fVeWXAyyS' }"
    >
      确 认
    </van-button>
    <van-button
      v-else
      type="info"
      custom-style="margin:50px 16px 30px;width:calc(100% - 32px);box-sizing:border-box;"
      @click="login"
      :data-event="{ id: 'yEDr1NZ6D1' }"
    >
      登 录
    </van-button>
    <view style="margin-left: 30px; margin-bottom: 50px">
      <van-checkbox :value="loginRead" shape="square" @change="loginReadChange">
        阅读并同意
        <text
          class="color-blue"
          @click.stop="
            doOpen('../../subpackages/web/web', {
              url: 'https://pub.fsgo365.cn/privacyAgreement-jishi.html'
            })
          "
          :data-event="{ id: '66SxxTJiyd' }"
        >
          隐私政策、
        </text>
        <text
          class="color-blue"
          @click.stop="
            doOpen('../../subpackages/web/web', {
              url: 'https://pub.fsgo365.cn/userAgreement-jishi.html'
            })
          "
          :data-event="{ id: 'fn8BMXUYuZ' }"
        >
          用户协议
        </text>
      </van-checkbox>
    </view>

    <van-divider contentPosition="center">其他登录方式</van-divider>
    <view class="c-flex c-flex-center">
      <!-- #ifdef MP-WEIXIN -->
      <view class="logintype-icon c-relative">
        <view
          style="
            width: 50px;
            height: 50px;
            background-color: #ff6900;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
          "
        >
          <image
            src="https://pub.fsgo365.cn/jishi/login_phone.png"
            mode="widthFix"
            style="width: 12px"
          ></image>
        </view>
        <button
          class="getphonenumber-btn"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        ></button>
        <view>快捷登录</view>
      </view>
      <!-- #endif -->
      <view
        class="logintype-icon"
        v-show="method == '1' || method == '3'"
        @click="
          method = '2';
          $forceUpdate();
        "
        :data-event="{ id: 'ynNkgWLV_m' }"
      >
        <view
          style="
            width: 50px;
            height: 50px;
            background-color: #1f2024;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
          "
          :data-event="{ id: 'ynNkgWLV_m' }"
        >
          <image
            src="https://pub.fsgo365.cn/jishi/login_password.png"
            mode="widthFix"
            style="width: 15px"
            :data-event="{ id: 'ynNkgWLV_m' }"
          ></image>
        </view>
        <view :data-event="{ id: 'ynNkgWLV_m' }">密码登录</view>
      </view>
      <view
        class="logintype-icon"
        v-show="method == '2'"
        @click="
          method = '1';
          $forceUpdate();
        "
        :data-event="{ id: 'OFLI5gHGo2' }"
      >
        <view style="width: 50px; height: 50px; margin: 0 auto" :data-event="{ id: 'OFLI5gHGo2' }">
          <image
            src="https://pub.fsgo365.cn/login_code.png"
            mode="widthFix"
            style="width: 40px; height: 40px"
            :data-event="{ id: 'OFLI5gHGo2' }"
          ></image>
        </view>
        <view :data-event="{ id: 'OFLI5gHGo2' }">验证码登录</view>
      </view>
      <!-- <view class="logintype-icon" @click="method = '3'" :data-event="{id:'G2m8IMdbLt'}">
        <view style="width: 50px; height: 50px; margin: 0 auto" :data-event="{id:'G2m8IMdbLt'}">
          <image
            src="../../static/images/updatePassword.png"
            mode="widthFix"
            style="width: 40px; height: 40px" :data-event="{id:'G2m8IMdbLt'}"></image>
        </view>
        <view :data-event="{id:'G2m8IMdbLt'}">修改密码</view>
      </view> -->
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>
<script>
const app = getApp();
var common = require('../../resources/js/common.js');
import { mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {
      method: '1', // 1验证码 2密码
      hidePassword: true, //密码是否隐藏
      formData: {
        phone: '',
        password: '',
        sms: '',
        newPassword: '',
        newPassword2: ''
      },
      sent: false,
      count: 60,
      newPasswordRules: false, //新密码校验
      newPassword2Rules: false, //再次输入新密码校验
      loginRead: false //勾选隐私政策和用户协议
    };
  },
  computed: {
    ...mapState(['tabbarList'])
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    // 自动恢复缓存的账号和密码
    let login = wx.getStorageSync('login');
    if (login) {
      this.formData.phone = login.phone;
      this.formData.password = login.password || '';
    }
  },
  methods: {
    ...mapMutations(['updatTabbarList']),
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
      let timestamp = new Date().getTime();
      let phone = this.formData.phone;
      common.osg.ajax(
        `~${common.osg.host}/fsgo/i/phone/sendVerifyCode.do`,
        {
          tenantId: '4670873342363649607',
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
      if (!this.loginRead) {
        common.osg.toast('请阅读并勾选隐私政策和用户协议', 'none');
        return;
      }

      common.osg.ajax(
        `index/phoneLogin.do`,
        {
          method: this.method,
          phone: this.formData.phone,
          code: this.method == '1' ? this.formData.sms : this.formData.password,
          tenantId: '4670873342363649607'
        },
        res => {
          common.osg.toast('登录成功', 'none');
          // 缓存sessionId
          wx.setStorageSync('sessionId', res.data.token);
          // 获取当前角色菜单并存到缓存
          this.getCurrentRoleFunctions(res.data.currentRole);
          // 缓存用户信息
          wx.setStorageSync('user', res.data.user);
          // 缓存当前角色
          wx.setStorageSync('currentRole', res.data.currentRole);
          // 缓存登录账号和密码
          wx.setStorageSync('login', {
            phone: this.formData.phone,
            password: this.formData.password
          });
          // 绑定用户推送标识
          if (common.osg.pushClientId) {
            common.osg.ajax(
              'user/upsertAppPushClientid',
              { appPushClientid: common.osg.pushClientId },
              () => {}
            );
          }
          // 获取并更新管家定位
          // if (res.data.currentRole._id == '3481370558631265818') {
          //   common.osg.getLocation(
          //     res => {
          //       wx.setStorageSync('gpsPoint', {
          //         createtime: new Date().getTime(),
          //         latitude: res.latitude,
          //         longitude: res.longitude
          //       });
          //     },
          //     null,
          //     { doNotRemind: true }
          //   );
          // }
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
          appID: 'wx2ca406853244755a'
        };
        common.osg.ajax('index/getPhoneNumber', params, res => {
          common.osg.toast('登录成功', 'none');
          // 缓存sessionId
          wx.setStorageSync('sessionId', res.data.token);
          // 获取当前角色菜单并存到缓存
          setTimeout(() => {
            console.log('延时获取角色菜单');
            this.getCurrentRoleFunctions(res.data.currentRole);
          }, 30000);
          // this.getCurrentRoleFunctions(res.data.currentRole);
          // 缓存用户信息
          wx.setStorageSync('user', res.data.user);
          // 缓存当前角色
          wx.setStorageSync('currentRole', res.data.currentRole);
          // 绑定用户推送标识
          if (common.osg.pushClientId) {
            common.osg.ajax(
              'user/upsertAppPushClientid',
              { appPushClientid: common.osg.pushClientId },
              () => {}
            );
          }
          // 获取并更新管家定位
          // if (res.data.currentRole._id == '3481370558631265818') {
          //   common.osg.getLocation(
          //     res => {
          //       common.osg.ajax(
          //         '/biz/serviceResource/dot',
          //         { latitude: String(res.latitude), longitude: String(res.longitude) },
          //         () => {
          //           wx.setStorageSync('gpsPoint', {
          //             createtime: new Date().getTime(),
          //             latitude: res.latitude,
          //             longitude: res.longitude
          //           });
          //         }
          //       );
          //     },
          //     null,
          //     { doNotRemind: true }
          //   );
          // }
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
          // 缓存当前角色菜单
          let functionList =
            (res.data.functionList[0] && res.data.functionList[0].functionList) || [];
          functionList.map(item => {
            let url = item.action;
            if (url) {
              if (url.indexOf('?') != -1) {
                let paramsString = url.split('?')[1];
                let paramArray = paramsString.split('&');
                let params = {};
                paramArray.map(item => {
                  params[item.split('=')[0]] = item.split('=')[1];
                });
                item.orderState = params.orderState;
                item.status = params.status || 'all';
                item.type = params.type || '';
              } else {
                item.status = 'all';
              }
            }
          });
          wx.setStorageSync('currentRoleFunctions', functionList);
          // 缓存当前角色在工单列表展示的菜单，并将菜单url参数处理为对象
          let saMenu = common.osg.getSAMenu(functionList);
          wx.setStorageSync('saMenu', saMenu);
          app.globalData.funcId = ''; // 清空当前激活菜单，点击底部导航栏进入工单列表后，默认激活第一个菜单。
          // 缓存当前角色按钮
          let buttonList = (res.data.functionList[0] && res.data.functionList[0].buttonList) || [];
          wx.setStorageSync('currentRoleButtons', buttonList);
          let pages = getCurrentPages();
          this.updatTabbarList(); //跳转到首页 把首页路径传递过去
          if (pages.length == 1) {
            // 跳转到首页
            common.osg.open(
              this.tabbarList[0]?.pagePath
                ? '/' + this.tabbarList[0].pagePath
                : '/pages/index/index',
              null,
              {
                mode: 'reLaunch'
              }
            );
          } else {
            // 返回上一页
            let prePage = pages[pages.length - 2];
            if (prePage.route.indexOf('pages/index/index') != -1 && this.tabbarList[0]?.pagePath) {
              common.osg.open('/' + this.tabbarList[0].pagePath, null, {
                mode: 'reLaunch'
              });
            } else {
              wx.navigateBack({
                delta: 1
              });
            }
          }
        }
      );
    },
    newPasswordBlur(e) {
      if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,16}$/.test(e.detail.value)) {
        this.newPasswordRules = true;
      } else {
        this.newPasswordRules = false;
      }
      if (e.detail.value == this.formData.newPassword2) {
        this.newPassword2Rules = true;
      } else {
        this.newPassword2Rules = false;
      }
    },
    newPassword2Blur(e) {
      if (e.detail.value == this.formData.newPassword) {
        this.newPassword2Rules = true;
      } else {
        this.newPassword2Rules = false;
      }
    },
    // 修改密码
    updatePassword() {
      if (!this.formData.phone) {
        common.osg.toast('请输入手机号', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请输入正确格式的手机号', 'none');
        return;
      }
      if (
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,16}$/.test(this.formData.newPassword)
      ) {
        common.osg.toast('新密码必须由8-16位大小写字母、数字、特殊字符组成', 'none');
        return;
      }
      if (this.formData.newPassword !== this.formData.newPassword2) {
        common.osg.toast('两次输入密码不一致!', 'none');
        return;
      }
      common.osg.ajax(
        `~${common.osg.host}/fsgo/i/phone/changePassword.do`,
        {
          phone: this.formData.phone,
          newPassword: this.formData.newPassword,
          code: this.formData.sms,
          tenantId: '4670873342363649607'
        },
        () => {
          this.updatePasswordShow = false;
          this.formData.newPassword = '';
          this.formData.newPassword2 = '';
          this.formData.sms = '';
          this.method = '2';
          common.osg.alert('密码修改成功，请重新登录！', () => {});
        }
      );
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    loginReadChange(e) {
      this.loginRead = e.detail;
    }
  }
};
</script>
<style lang="scss">
page {
  background-color: #fff !important;
  .login {
    .logintype-icon {
      width: 60px;
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
    .c-field {
      .van-cell__title {
        max-width: 60px;
      }
    }
  }
}
</style>
