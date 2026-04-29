<template>
  <view class="register" @click.capture="track">
    <view>
      <!-- src="https://pub.fsgo365.cn/4283523791999644673.png" -->
      <image
        style="width: 100%"
        src="https://pub.fsgo365.cn/5626658595717232721.jpg"
        mode="widthFix"
      ></image>
    </view>
    <van-field
      :value="formData.phone"
      label="手机号"
      placeholder="请输入手机号"
      :clearable="false"
      data-key="phone"
      :maxlength="11"
      class="c-field"
      @change="onChange"
    />
    <van-field
      key="sms"
      v-if="method == '1'"
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
    >
      <van-button
        slot="button"
        size="small"
        type="info"
        @click="getSms"
        v-if="!sent"
        :data-event="{ id: '1jHzZTtMtE' }"
      >
        获取验证码
      </van-button>
      <van-button slot="button" size="small" type="info" v-else>{{ count }}s后重新获取</van-button>
    </van-field>
    <van-field
      v-else
      key="password"
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
      type="info"
      round
      custom-style="margin:50px 16px 30px;width:calc(100% - 32px);box-sizing:border-box;"
      @click="register"
      :data-event="{ id: 'zmRs_4L8TU' }"
    >
      注 册
    </van-button>
    <view style="margin-left: 30px; margin-bottom: 50px">
      <van-checkbox :value="loginRead" shape="square" @change="loginReadChange">
        阅读并同意
        <text
          class="c-blue"
          @click.stop="
            doOpen('../../subpackages/web/web', {
              url: 'https://pub.fsgo365.cn/privacyAgreement.html'
            })
          "
          :data-event="{ id: 'XEIFmOpkF4' }"
        >
          隐私政策、
        </text>
        <text
          class="c-blue"
          @click.stop="
            doOpen('../../subpackages/web/web', {
              url: 'https://pub.fsgo365.cn/userAgreement.html'
            })
          "
          :data-event="{ id: 'kNdNJXhGwv' }"
        >
          用户协议
        </text>
      </van-checkbox>
    </view>
    <!-- <van-divider contentPosition="center">其他注册方式</van-divider> -->
    <view class="c-flex c-flex-center">
      <!-- <view class="registertype-icon c-relative">
        <view style="width: 50px; height: 50px; margin: 0 auto">
          <image
            src="https://pub.fsgo365.cn/login_phone.png"
            mode="widthFix"
            style="width: 40px; height: 40px"
          ></image>
        </view>
        <button
          class="getphonenumber-btn"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        ></button>
        <view>快捷登录</view>
      </view> -->
      <!-- <view class="registertype-icon" v-show="method == '1'" @click="method = '2'" :data-event="{id:'GJQn2sIrz1'}">
        <view style="width: 50px; height: 50px; margin: 0 auto" :data-event="{id:'GJQn2sIrz1'}">
          <image
            src="https://pub.fsgo365.cn/login_password.png"
            mode="widthFix"
            style="width: 100%" :data-event="{id:'GJQn2sIrz1'}"></image>
        </view>
        <view :data-event="{id:'GJQn2sIrz1'}">密码登录</view>
      </view> -->
      <!-- <view class="registertype-icon" v-show="method == '2'" @click="method = '1'" :data-event="{id:'MVlYuDo7wO'}">
        <view style="width: 50px; height: 50px; margin: 0 auto" :data-event="{id:'MVlYuDo7wO'}">
          <image
            src="https://pub.fsgo365.cn/login_code.png"
            mode="widthFix"
            style="width: 40px; height: 40px" :data-event="{id:'MVlYuDo7wO'}"></image>
        </view>
        <view :data-event="{id:'MVlYuDo7wO'}">验证码登录</view>
      </view> -->
    </view>
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
      count: 60,
      documentId: '', // 分享公告id
      shareUserId: '', // 分享人id
      loginRead: false //勾选隐私政策和用户协议
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.documentId = params.documentId || '';
    this.shareUserId = params.shareUserId || '';
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
    /**
     * 密码或验证码登录
     */
    register() {
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
        `index/phoneRegister.do`,
        {
          // method: this.method,
          phone: this.formData.phone,
          code: this.method == '1' ? this.formData.sms : this.formData.password,
          tenantId: '1340835581184723420',
          // recommender: '13801311229',
          documentId: this.documentId,
          shareUserId: this.shareUserId
        },
        res => {
          common.osg.toast('注册并登录成功', 'none');
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
            phone: this.formData.phone
            // password: this.formData.password
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
          appID: 'wx2ca406853244755a',
          tenantId: '1340835581184723420',
          recommender: '13801311229',
          documentId: this.documentId,
          shareUserId: this.shareUserId
        };
        common.osg.ajax('index/getPhoneNumberForRegister', params, res => {
          common.osg.toast('注册并登录成功', 'none');
          // 缓存sessionId
          wx.setStorageSync('sessionId', res.data.token);
          // 获取当前角色菜单并存到缓存
          this.getCurrentRoleFunctions(res.data.currentRole);
          // 缓存用户信息
          wx.setStorageSync('user', res.data.user);
          // 缓存当前角色
          wx.setStorageSync('currentRole', res.data.currentRole);
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
          if (pages.length == 1) {
            // 跳转到首页
            common.osg.open('/pages/index/index', null, {
              mode: 'reLaunch'
            });
          } else {
            if (
              pages.length > 1 &&
              pages[pages.length - 2].route.indexOf('subpackages/activities/activity') != -1
            ) {
              // 从活动页来注册成功后 跳转到首页
              common.osg.open('/pages/index/index', null, {
                mode: 'reLaunch'
              });
            } else {
              // 返回上一页
              wx.navigateBack({
                delta: 1
              });
            }
          }
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
  .register {
    .registertype-icon {
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
