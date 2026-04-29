<template>
  <view class="userInfo">
    <view class="c-text-center">
      <van-button
        custom-class="avatar-wrapper"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
      >
        <van-image round image-class="avatar" :src="avatar" />
      </van-button>
    </view>
    <van-cell-group>
      <van-field
        label="昵称"
        :value="nickname"
        type="nickname"
        @blur="onNicknameBlur"
        placeholder="请输入昵称"
      />
    </van-cell-group>
    <view class="submit">
      <van-button type="info" round @click="upsertUserInfo">确 认</van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      avatar: '',
      nickname: ''
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    let userInfo = wx.getStorageSync('user');
    this.avatar = userInfo.avatar;
    this.nickname = userInfo.nickname;
  },
  onShow: function (params) {
    common.osg.init(this, params, app);
  },
  methods: {
    onChooseAvatar(e) {
      let filePath = e.detail.avatarUrl;
      common.osg.ajax(
        'back/super/file/upToken.do',
        {
          fileName: filePath.split('/')[filePath.split('/').length - 1]
        },
        data => {
          let that = this;
          wx.uploadFile({
            url: 'https://up-z1.qiniup.com',
            filePath: e.detail.avatarUrl,
            name: 'file',
            formData: data,
            success(res) {
              that.avatar = common.osg.downloadUrl + JSON.parse(res.data).key;
            },
            fail() {
              common.osg.toast('上传失败', 'error');
            }
          });
        },
        {
          noload: true
        }
      );
    },
    // 点击微信昵称无法触发change事件
    onNicknameBlur(e) {
      this.nickname = e.detail.value;
    },
    upsertUserInfo() {
      common.osg.ajax(
        'user/upsertAvatarOrNickname.do',
        {
          avatar: this.avatar,
          nickname: this.nickname
        },
        () => {
          let user = wx.getStorageSync('user');
          user.avatar = this.avatar;
          user.nickname = this.nickname;
          wx.setStorageSync('user', user);
          wx.navigateBack({
            delta: 1
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
.userInfo {
  .avatar-wrapper {
    width: 100px;
    height: 100px !important;
    border-radius: 50% !important;
    margin: 30px;
    > .van-button__text {
      height: 100px;
    }
  }
  .avatar {
    width: 100px !important;
    height: 100px !important;
  }
  .submit {
    position: fixed;
    bottom: 100px;
    width: 100%;
    text-align: center;
  }
}
</style>
