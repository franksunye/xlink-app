<template>
  <view class="authorize">
    <view v-if="canIUse">
      <view class="header">
        <image class="logo-fs" src="/static/images/favicon.ico" mode="aspectFit"></image>
      </view>
      <view class="c-text-center c-size-14 c-p-v-20 c-indent">
        修链帮帮，修链房屋维修服务推广人员专用小程序。可支持领取任务、转发任务、推广活动、赚取佣金！
      </view>
      <!-- <view class="step c-flex c-flex-center">
        <view
          :class="
            'item ' + (infoState == 1 ? 'c-bg-gray' : infoState == 2 ? 'c-bg-yellow' : 'c-bg-green')
          "
        >
          1
        </view>
        <view class="border"></view>
        <view
          :class="
            'item ' +
            (phoneState == 1 ? 'c-bg-gray' : phoneState == 2 ? 'c-bg-yellow' : 'c-bg-green')
          "
        >
          2
        </view>
      </view> -->
      <view class="content c-text-center">
        <view>申请获取以下权限</view>
        <!-- <view :class="phoneState > 1 ? 'c-none' : ''">获取您的公开信息(昵称、头像等)</view> -->
        <view style="margin-top: 40px">绑定手机号</view>
      </view>
      <!-- <button
        :class="'bottom ' + (phoneState > 1 ? 'c-none' : '')"
        type="primary"
        open-type="getUserInfo"
        lang="zh-CN"
        @getuserinfo="getUserInfo"
      >
        授权用户信息
      </button> -->
      <!-- <view class="userInfo">
        <view class="c-text-center">
          <text style="display: block; margin-top: 20px">获取头像</text>
          <view style="text-align: center; display: flex; justify-content: center">
            <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
              <image class="avatar" :src="avatar"></image>
            </button>
          </view>
        </view>
        <van-cell-group>
          <van-field
            label="获取昵称"
            :value="nickname"
            type="nickname"
            @blur="onNicknameBlur"
            placeholder="请输入昵称"
          />
        </van-cell-group>
        <view class="submit">
          <button
            style="color: white"
            :class="'bottom ' + (phoneState > 1 ? 'c-none' : '')"
            type="info"
            round
            @click="getUserInfo"checkbo
          >
            授权用户信息
          </button>
        </view>
      </view> -->
      <button
        :disabled="agree == false"
        :class="'bottom '"
        type="primary"
        open-type="getPhoneNumber"
        lang="zh-CN"
        @getphonenumber="getPhoneNumber"
      >
        绑定手机号并登录
      </button>
      <view></view>
      <label class="checkbox">
        <!-- <checkbox-group @change="checkboxChange">
          <checkbox value="agree" checked="true" />
          我已阅读并同意
        </checkbox-group> -->
        <van-checkbox checked-color="#d7000d" :value="agree" @change="checkboxChange">
          我已阅读并同意
        </van-checkbox>
        <label style="color: #ff737c" @tap="toprotocol(1)">《用户协议》</label>
        <label style="color: #ff737c" @tap="toprotocol(2)">《隐私政策》</label>
      </label>
    </view>
    <view v-else>请升级微信版本</view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      //判断小程序的API，回调，参数，组件等是否在当前版本可用。
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      infoState: 2,
      phoneState: 1,
      user: '',
      password: '',
      params: {},
      avatar: '', //用户头像
      nickname: '', //用户昵称
      userinfo: {},
      agree: false
    };
  },
  onLoad: function (params) {
    common.osg.doLogin();
    // this.userinfo = common.osg.user();
    // this.nickname = (this.userinfo && this.userinfo.nickname) || '';
    // this.avatar = (this.userinfo && this.userinfo.avatar) || '';
    // 页面参数
    this.params = params;
    if (params.q) {
      params.q = decodeURI(params.q);
    }
  },
  methods: {
    checkboxChange(e) {
      if (e.detail == false) {
        this.agree = false;
      } else {
        this.agree = true;
      }
    },
    toprotocol(val) {
      if (val == 1) {
        var url = 'https://pub.fsgo365.cn/yonghuxieyi.pdf '; //用户协议
      }
      if (val == 2) {
        var url = 'https://pub.fsgo365.cn/yinsizhengce.pdf'; //隐私政策
      }
      wx.downloadFile({
        url: url,
        success: function (res) {
          let filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) {
              console.log(res);
            }
          });
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    },
    // download: function (e) {
    //   var fileName = e.currentTarget.dataset.filename;
    //   var fileType = fileName.split('.')[1];
    //   var filePath = fileName;
    //   if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif') {
    //     //图片预览
    //     wx.previewImage({
    //       current: filePath, // 当前显示图片的http链接
    //       urls: [filePath] // 需要预览的图片http链接列表
    //     });
    //   } else {
    //     //文件下载
    //     wx.downloadFile({
    //       url: filePath,
    //       success: function (res) {
    //         let filePath = res.tempFilePath;
    //         wx.openDocument({
    //           filePath: filePath,
    //           success: function (res) {
    //             console.log(res);
    //           },
    //           fail: function (res) {
    //             console.log(res);
    //           },
    //           complete: function (res) {
    //             console.log(res);
    //           }
    //         });
    //       },
    //       fail: function (res) {
    //         console.log(res);
    //       },
    //       complete: function (res) {
    //         console.log(res);
    //       }
    //     });
    //   }
    // },
    onChooseAvatar(e) {
      let filePath = e.detail.avatarUrl;
      console.log(filePath, 'filePath');
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
              console.log(that.avatar, '头像');
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
    onNicknameBlur(e) {
      this.nickname = e.detail.value;
      console.log(this.nickname, '昵称');
    },
    getUserInfo: function (e) {
      //用户按了允许授权按钮
      common.osg.ajax(
        'index/authorize',
        {
          // code: encodeURI(code),
          // iv: '',
          nickname: this.nickname,
          avatar: this.avatar
          // appID: 'wx424b0548cd7c7401'
        },
        res => {
          let currentUser = wx.getStorageSync('_currentUser');
          currentUser.user = res.data;
          wx.setStorageSync('_currentUser', currentUser);
          // common.osg.currentUserSet(res);
          this.infoState = 3;
          this.phoneState = 2;
          //获取地理位置
          // common.osg.getLocation();
        }
      );
    },

    getPhoneNumber(e) {
      // 当e.detail.code没值表示用户拒绝了
      if (e.detail.code) {
        let params = {
          appID: 'wx8501876977010e44',
          tenantId: '1340835581184723420',
          code: e.detail.code
        };
        common.osg.ajax('wmt/index/getPhoneNumber', params, res => {
          common.osg.toast('登录成功', 'none');
          // 缓存用户信息
          wx.setStorageSync('user', res.data);
          // 缓存当前角色
          wx.navigateBack({
            delta: 1
          });
        });
      }
    }
    // getPhoneNumber: function (e) {
    //   if (e.detail.encryptedData) {
    //     //用户按了允许授权按钮
    //     this.doLogin('index/phone', false, e.detail, data => {
    //       common.osg.currentUserSet(data);
    //       this.infoState = 3;
    //       this.phoneState = 3;
    //       // 返回到原页面 或 跳转到个人中心页面
    //       if (this.params.url) {
    //         common.osg.open(this.params.url, this.params, {
    //           mode: 'redirect'
    //         });
    //       } else {
    //         common.osg.open('../../pages/account/account', this.params, {
    //           mode: 'reLaunch'
    //         });
    //       }
    //     });
    //   } else {
    //     //用户按了拒绝按钮
    //     common.osg.confirm(
    //       '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
    //       function (res) {
    //         if (res.confirm) {
    //           console.log('用户点击了“返回授权”');
    //         }
    //       }
    //     );
    //   }
    //   common.osg.open('../../pages/account/account', this.params, {
    //     mode: 'reLaunch'
    //   });
    // },
    // doLogin: function (uri, bool, res, callback) {
    //   wx.login({
    //     success: r => {
    //       let code = r.code;
    //       if (code) {
    //         common.osg.ajax(
    //           uri,
    //           {
    //             code: encodeURI(code),
    //             iv: encodeURI(res.iv),
    //             encryptedData: encodeURI(res.encryptedData),
    //             appID: 'wx8501876977010e44'
    //           },
    //           data => {
    //             if (callback) callback(data.data);
    //           }
    //         );
    //       }
    //     }
    //   });
    // }
  }
};
</script>

<style lang="scss">
.submit {
  text-align: center;
}
.avatar-wrapper {
  // width: 50px;
  // height: 50px !important;
  // border-radius: 50% !important;
  width: 100px;
  height: 100px;
  padding: 0;
  margin: 30px;
  > .van-button__text {
    height: 100px;
  }
}
.avatar {
  width: 100px !important;
  height: 100px !important;
}
.authorize .login-group {
  margin-top: 30vh;
}

page {
  background: #fff;
  font-size: 30rpx;
}

.header {
  height: 100rpx;
  overflow: hidden;
  margin: 30rpx auto 50rpx;
  text-align: center;
}

.logo {
  width: 250rpx;
  height: 100rpx;
}

.logo-fs {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.step {
  margin: 50rpx 100rpx;
}

.step .item {
  width: 50rpx;
  height: 50rpx;
  line-height: 52rpx;
  border-radius: 50%;
  overflow: hidden;
  color: #fff;
  margin: 0 30rpx;
  text-align: center;
}

.step .border {
  width: 200rpx;
  height: 2px;
  background: var(--gray);
  position: relative;
}

.step .border::after {
  content: '';
  display: block;
  position: absolute;
  top: -5px;
  right: -8px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-left-color: var(--gray);
}

.bottom {
  width: 80vw;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 20rpx;
  font-size: 34rpx;
  background: #d7000d !important;
  margin-top: 200rpx;
}
.checkbox {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
