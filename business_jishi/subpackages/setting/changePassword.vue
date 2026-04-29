<template>
  <view class="changePassword" @click.capture="track">
    <van-cell-group :border="false">
      <van-field
        :value="formData.oldPassword"
        clearable
        label="旧密码"
        placeholder="请输入旧密码"
        @change="onChange"
        data-key="oldPassword"
      />
      <van-field
        :value="formData.newPassword"
        required
        clearable
        label="新密码"
        placeholder="请输入新密码"
        @change="onChange"
        data-key="newPassword"
        :password="hidePassword ? true : false"
        :right-icon="hidePassword ? 'closed-eye' : 'eye-o'"
        @click-icon="hidePassword = !hidePassword"
      />
      <van-field
        :value="formData.newPassword2"
        required
        clearable
        label="确认新密码"
        placeholder="请再次输入新密码"
        @change="onChange"
        data-key="newPassword2"
        :password="hidePassword2 ? true : false"
        :right-icon="hidePassword2 ? 'closed-eye' : 'eye-o'"
        @click-icon="hidePassword2 = !hidePassword2"
      />
    </van-cell-group>
    <view class="c-text-center c-m-t-100">
      <van-button type="info" round @click="submit" :data-event="{ id: 'iAHQqWvbHQ' }">
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
      formData: {},
      hidePassword: true, //密码是否隐藏
      hidePassword2: true //确认密码是否隐藏
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
  },
  methods: {
    onChange(e) {
      this.formData[e.target.dataset.key] = e.detail;
    },
    submit() {
      // if (!this.formData.oldPassword) {
      //   common.osg.toast('请输入旧密码', 'none');
      //   return;
      // }
      if (!this.formData.newPassword) {
        common.osg.toast('请输入新密码', 'none');
        return;
      }
      if (!this.formData.newPassword2) {
        common.osg.toast('请再次输入新密码', 'none');
        return;
      }
      if (this.formData.oldPassword == this.formData.newPassword) {
        common.osg.toast('新密码不能和旧密码相同', 'none');
        return;
      }
      if (this.formData.newPassword != this.formData.newPassword2) {
        common.osg.toast('两次输入新密码不一致', 'none');
        return;
      }
      common.osg.ajax(
        'account/changePasswd',
        {
          oldPasswd: this.formData.oldPassword
            ? common.osg.Base64.encode(this.formData.oldPassword)
            : '',
          newPasswd: common.osg.Base64.encode(this.formData.newPassword),
          newPasswd2: common.osg.Base64.encode(this.formData.newPassword2)
        },
        () => {
          common.osg.alert('密码修改成功，请重新登录', () => {
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
}
</style>
