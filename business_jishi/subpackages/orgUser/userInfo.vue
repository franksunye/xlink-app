<template>
  <view class="userInfo" @click.capture="track">
    <view class="c-text-center">
      <!-- #ifdef MP-WEIXIN -->
      <van-button
        custom-class="avatar-wrapper"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
      >
        <van-image round image-class="avatar" :src="avatar" />
      </van-button>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <uni-file-picker
        :value="avatarObj"
        return-type="object"
        fileMediatype="image"
        mode="grid"
        :disable-preview="true"
        :del-icon="false"
        :auto-upload="false"
        :limit="1"
        class="c-uni-file-picker-avatar"
        @select="onChooseAvatar"
      />
      <!-- #endif -->
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
      <van-button type="info" round @click="upsertUserInfo" :data-event="{ id: 'VYCeEDEtDF' }">
        确 认
      </van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      avatarObj: { name: 'avatar.png', extname: 'png', url: 'https://pub.fsgo365.cn/avatar.png' },
      avatar: '',
      nickname: '',
      systemInfo: {}
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.systemInfo = app.globalData.systemInfo;
    let userInfo = wx.getStorageSync('user');
    this.avatar = userInfo.avatar;
    // #ifdef APP-PLUS
    this.avatarObj.url = this.avatar || 'https://pub.fsgo365.cn/avatar.png';
    // #endif
    this.nickname = userInfo.nickname;
  },
  onShow: function (params) {
    common.osg.init(this, params, app);
  },
  methods: {
    onChooseAvatar(e) {
      // #ifdef MP-WEIXIN
      let filePath = e.detail.avatarUrl;
      // #endif

      // #ifdef APP-PLUS
      let filePath = e.tempFiles[0].path;
      this.avatarObj.url = e.tempFiles[0].url;
      this.avatarObj.name = e.tempFiles[0].name;
      this.avatarObj.extname = e.tempFiles[0].extname;
      // #endif

      common.osg.ajax(
        'back/super/file/upToken.do',
        {
          // #ifdef MP-WEIXIN
          fileName: filePath.split('/')[filePath.split('/').length - 1],
          // #endif
          // #ifdef APP-PLUS
          fileName: this.avatarObj.name
          // #endif
        },
        data => {
          let that = this;
          wx.uploadFile({
            url: 'https://up-z1.qiniup.com',
            // #ifdef MP-WEIXIN
            filePath: e.detail.avatarUrl,
            // #endif
            // #ifdef APP-PLUS
            filePath: filePath,
            // #endif
            name: 'file',
            formData: data,
            success(res) {
              // #ifdef MP-WEIXIN
              that.avatar = common.osg.downloadUrl + JSON.parse(res.data).key;
              // #endif
              // #ifdef APP-PLUS
              that.avatarObj.url = common.osg.downloadUrl + JSON.parse(res.data).key;
              // #endif
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
          // #ifdef MP-WEIXIN
          avatar: this.avatar,
          // #endif
          // #ifdef APP-PLUS
          avatar: this.avatarObj.url,
          // #endif
          nickname: this.nickname
        },
        () => {
          let user = wx.getStorageSync('user');
          // #ifdef MP-WEIXIN
          user.avatar = this.avatar;
          // #endif
          // #ifdef APP-PLUS
          user.avatar = this.avatarObj.url;
          // #endif
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
  .c-uni-file-picker-avatar.uni-file-picker {
    flex: unset !important;
    width: unset !important;
    display: flex;
    justify-content: center;
    margin: 30px;
    .uni-file-picker__container {
      margin: 0 !important;
      .file-picker__box {
        width: 100px !important;
        height: 100px !important;
        box-sizing: border-box !important;
        padding-top: 0 !important;
        .file-picker__box-content {
          border-radius: 50% !important;
          .file-picker__progress {
            display: none !important;
          }
        }
      }
    }
  }
}
</style>
