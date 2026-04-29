<template>
  <view>
    <view class="top">
      <view class="title">你好，{{ user.name || '销售精英' }}！</view>
      <view class="description">
        今天让我们一起提升销售技巧，通过模拟对话掌握专业话术，成为客户信赖的管家！
      </view>
      <view class="buttons">
        <view>
          <view class="button" @click="customTrainingClick">
            <i class="iconfont icon-bofang" style="color: #106cff"></i>
            开始对练
          </view>
          <text>自定义场景与客户画像</text>
        </view>
        <view>
          <view class="button" @click="randomTraining">
            <i class="iconfont icon-suiji"></i>
            随机对练
          </view>
          <text>随机匹配场景与客户画像</text>
        </view>
      </view>
    </view>
    <view v-if="!loggedIn" class="login">
      <uni-easyinput v-model="userId" placeholder="请输入账号"></uni-easyinput>
      <view class="login-button" @click="loginByUserId">登录</view>
    </view>
    <view class="content">
      <view class="title">
        <i class="iconfont icon-kuaisu"></i>
        <text>快速开始</text>
      </view>
      <view v-for="(item, i) in scenarios" :key="i" class="card">
        <view class="name">
          <text>{{ item.text }}</text>
        </view>
        <view class="description">
          {{ item.description }}
        </view>
        <view class="button" @click="fastTraining(item.value)">
          开始对练
          <uni-icons
            type="arrow-right"
            size="20"
            color="#106cff"
            style="margin-left: 5px; height: 22px"
          ></uni-icons>
        </view>
      </view>
    </view>
    <uni-popup
      ref="popup"
      background-color="#fff"
      border-radius="8px 8px 8px 8px"
      style="width: 100vw"
    >
      <view class="popup-view">
        <view class="title">自定义场景与客户画像</view>
        <uni-data-select
          v-model="scenario_id"
          :localdata="scenarios"
          :clear="false"
          placeholder="请选择场景"
          class="c-data-select"
        ></uni-data-select>
        <uni-data-select
          v-model="profile_id"
          :localdata="profiles"
          placeholder="请选择客户画像"
          :clear="false"
          class="c-data-select"
        ></uni-data-select>
        <button
          style="color: #ffffff; background-color: #106cff; border-color: #106cff"
          @click="customTraining"
        >
          开始对练
        </button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      user: {},
      userId: '',
      loggedIn: true,
      scenario_id: '',
      profile_id: '',
      profileId: '',
      scenarios: [],
      profiles: []
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.login(params);
    this.getScenarios();
    this.getProfiles();
  },
  methods: {
    getScenarios() {
      common.osg.ajax(
        '/scenarios/',
        {
          page: 1,
          per_page: 100
        },
        res => {
          let data = [];
          res.data.map(item => {
            data.push({
              text: item.name,
              value: item._id,
              description: item.description
            });
          });
          this.scenarios = data;
        },
        {
          noload: true,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    getProfiles() {
      common.osg.ajax(
        '/profiles/',
        {
          page: 1,
          per_page: 100,
          source: 'custom'
        },
        res => {
          let data = [];
          res.data.map(item => {
            data.push({
              text: item.name,
              value: item._id
            });
          });
          data.unshift({
            text: '随机生成客户画像',
            value: 'random'
          });
          this.profiles = data;
        },
        {
          noload: true,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    customTrainingClick() {
      if (!this.loggedIn) {
        common.osg.toast('请先登录', 'none');
        return;
      }
      common.osg.open('/subpackages/customTraining/customTraining');
    },
    // 开始对练
    async customTraining() {
      if (!this.scenario_id && !this.profile_id) {
        common.osg.toast('请选择场景和客户画像', 'none');
        return;
      } else if (!this.scenario_id) {
        common.osg.toast('请选择场景', 'none');
        return;
      } else if (!this.profile_id) {
        common.osg.toast('请选择客户画像', 'none');
        return;
      }
      if (this.profile_id == 'random') {
        await this.randomProfile();
      } else {
        this.profileId = this.profile_id;
      }
      common.osg.ajax(
        '/training/start',
        {
          scenario_id: this.scenario_id,
          profile_id: this.profileId,
          staff_id: this.user.userId
        },
        res => {
          this.$refs.popup.close();
          this.scenario_id = '';
          this.profile_id = '';
          this.profileId = '';
          common.osg.open('/subpackages/session/session', { sessionId: res.session_id });
        },
        {
          loadingMsg: '对练生成中...',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    // 随机生成客户画像
    randomProfile() {
      return new Promise(resolve => {
        common.osg.ajax(
          '/profiles/random',
          {},
          res => {
            this.profileId = res._id;
            resolve();
          },
          {
            noload: true
          }
        );
      });
    },
    // 随机对练
    async randomTraining() {
      if (!this.loggedIn) {
        common.osg.toast('请先登录', 'none');
        return;
      }
      let scenario_id;
      if (this.scenarios.length == 0) {
        common.osg.toast('数据加载中，请稍后重试', 'none');
        return;
      } else {
        scenario_id = this.scenarios[Math.floor(Math.random() * this.scenarios.length)].value;
      }
      await this.randomProfile();
      common.osg.ajax(
        '/training/start',
        {
          scenario_id,
          profile_id: this.profileId,
          staff_id: this.user.userId
        },
        res => {
          this.profileId = '';
          common.osg.open('/subpackages/session/session', { sessionId: res.session_id });
        },
        {
          loadingMsg: '对练生成中...',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    // 快速对练
    async fastTraining(scenario_id) {
      if (!this.loggedIn) {
        common.osg.toast('请先登录', 'none');
        return;
      }
      await this.randomProfile();
      common.osg.ajax(
        '/training/start',
        {
          scenario_id,
          profile_id: this.profileId,
          staff_id: this.user.userId
        },
        res => {
          this.profileId = '';
          common.osg.open('/subpackages/session/session', { sessionId: res.session_id });
        },
        {
          loadingMsg: '对练生成中...',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    // 从服务商端跳转到当前小程序，携带了用户信息，更新用户信息
    login(params) {
      this.wxLogin(openid => {
        this.getStaffByOpenid(openid, data => {
          params.openid = openid;
          if (!data.userId && !params.userId) {
            this.loggedIn = false;
            common.osg.toast('请输入账号，登录后使用', 'none');
            return;
          }
          if (params.userId) {
            // 从其他App或其他微信小程序跳转过来，更新用户信息
            this.updateStaffs(data._id ? data._id : '', params);
          } else {
            // 直接从当前微信小程序进入
            params = data;
          }
          this.user = params;
          wx.setStorageSync('user', params);
        });
      });
    },
    wxLogin(callback) {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            common.osg.ajax(
              '/staffs/login_wx',
              { code: res.code },
              res => {
                if (callback) callback(res.openid);
              },
              {
                header: {
                  'Content-Type': 'application/json'
                }
              }
            );
          } else {
            console.log('登录失败！' + res.errMsg);
          }
        }
      });
    },
    loginByUserId() {
      if (!this.userId) {
        common.osg.toast('请输入账号', 'none');
        return;
      }
      common.osg.ajax(
        `/staffs/${this.userId}`,
        {},
        res => {
          if (res.error) {
            common.osg.toast('您输入的账号不存在，请重新输入', 'none');
          } else if (res.userId) {
            wx.setStorageSync('user', res);
            this.loggedIn = true;
            common.osg.toast('登录成功');
          }
        },
        {
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    getStaffByOpenid(openid, callback) {
      common.osg.ajax(
        `/staffs/${openid}`,
        {},
        res => {
          if (callback) callback(res);
        },
        {
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    updateStaffs(staffId, params) {
      common.osg.ajax(`/staffs/${staffId}`, params, () => {}, {
        method: staffId ? 'PUT' : 'POST',
        header: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  margin: 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #165dff 0%, #722ed1 100%);
  padding: 20px 20px 16px;
  .title {
    font-size: 22px;
    font-weight: 600;
    color: #fff;
  }
  .description {
    font-size: 14px;
    margin: 16px 0 20px;
    color: #fff;
  }
  .buttons {
    display: flex;
    > view {
      flex: 1;
      text-align: center;
      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        border-radius: 8px;
        color: #106cff;
        background-color: #fff;
        .iconfont {
          margin-right: 8px;
          font-size: 18px;
        }
      }
      text {
        display: block;
        margin-top: 5px;
        font-size: 10px;
        color: #f5f5f5;
      }
      &:last-child {
        margin-left: 20px;
        .button {
          border: 2px solid #fff;
          background-color: transparent;
          color: #fff;
        }
      }
    }
  }
}
.login {
  display: flex;
  align-items: center;
  margin: 32px 16px 0;
  ::v-deep .uni-easyinput__content {
    border-radius: 12px 0 0 12px;
    height: 44px;
    text-align: center;
  }
  .login-button {
    background: #106cff;
    border-radius: 0 12px 12px 0;
    height: 44px;
    line-height: 44px;
    color: #fff;
    width: 80px;
    text-align: center;
  }
}
.content {
  padding-bottom: 1px;
  .title {
    display: flex;
    align-items: center;
    margin: 32px 16px 16px;
    .iconfont {
      color: #106cff;
      font-size: 20px;
      margin: 0 10px 0 6px;
    }
    text {
      font-size: 20px;
      font-weight: 600;
    }
  }
  .card {
    background-color: #fff;
    margin: 16px;
    padding: 16px 20px;
    border-radius: 16px;
    .name {
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 22px;
        margin-right: 5px;
      }
      text {
        font-weight: 600;
        font-size: 18px;
      }
    }
    .description {
      margin: 10px 0;
      color: #646566;
    }
    .button {
      display: flex;
      align-items: center;
      color: #106cff;
    }
  }
}
.popup-view {
  width: 70vw;
  border-radius: 8px;
  background-color: #fff;
  padding: 16px 20px;
  .title {
    text-align: center;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .c-data-select {
    display: flex;
    margin: 16px 0;
  }
}
</style>
