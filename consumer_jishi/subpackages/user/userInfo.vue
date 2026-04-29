<template>
  <view class="userInfo">
    <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
      <image round image-class="avatar" :src="avatar" />
    </button>
    <uni-easyinput
      class="nickname"
      v-model="nickname"
      focus
      placeholder="请输入昵称"
      style="margin: 0 20px"
    ></uni-easyinput>
    <button class="c-uni-button round primary" hover-class="hover" plain @click="upsertUserInfo">
      确 认
    </button>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
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
          uni.uploadFile({
            url: 'https://up-z1.qiniup.com',
            filePath: e.detail.avatarUrl,
            name: 'file',
            // #ifdef MP-ALIPAY
            fileType: 'image',
            // #endif
            formData: data,
            success(res) {
              that.avatar = common.osg.downloadUrl + JSON.parse(res.data).key;
            },
            fail(res) {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  .avatar-wrapper {
    width: 100px;
    height: 100px !important;
    border-radius: 50% !important;
    margin: 30px;
    background-color: #f7f8fa;
    > .van-button__text {
      height: 100px;
    }
  }
  .avatar {
    width: 100px !important;
    height: 100px !important;
  }
  .uni-easyinput {
    width: 80%;
  }
  .c-uni-button {
    margin-top: 100px;
  }
}
</style>
