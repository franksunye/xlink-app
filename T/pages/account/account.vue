<template>
  <view class="account">
    <view
      :style="
        'position:absolute;z-index:1;top:' +
        systemInfo.statusBarHeight +
        'px;left:' +
        systemInfo.menuButtonObject.marginRight +
        'px;height:' +
        systemInfo.navHeight +
        'px;line-height:' +
        systemInfo.navHeight +
        'px;color:#fff;display:flex;align-items:center;font-weight:500;'
      "
    >
      <text
        v-if="
          systemInfo.platform == 'ios' ||
          systemInfo.platform == 'mac' ||
          systemInfo.platform == 'devtools'
        "
        :style="
          'width:calc(100vw - ' +
          systemInfo.menuButtonObject.marginRight * 2 +
          'px);text-align:center'
        "
      >
        修链帮帮
      </text>
      <text v-else>修链帮帮</text>
    </view>
    <view class="bg"></view>
    <view class="user-info">
      <block v-if="isLogined">
        <!-- <van-button
          custom-class="avatar-wrapper"
          custom-style="border: none"
          @click="doOpen('../../subpackages/orgUser/userInfo')"
        > -->
        <image
          :src="userInfo.avatar || 'https://pub.fsgo365.cn/littlesix.png'"
          style="width: 50px; height: 50px; border-radius: 50%; display: flex"
          mode="widthFix"
          @click="doOpen('../../subpackages/orgUser/userInfo')"
        />
        <!-- </van-button> -->
        <view style="position: relative">
          <div style="display: flex">
            <view class="name" @click="doOpen('../../subpackages/orgUser/userInfo')">
              {{ userInfo.nickname || userInfo.name }}
            </view>
            <div v-if="promoterLevel" class="tag">
              <text>{{ format('promoterLevel', promoterLevel, 'select') }}</text>
            </div>

            <!-- <van-tag color="#f2826a">团长</van-tag> -->
          </div>
          <view v-if="userInfo.phone" class="c-flex c-item-center">
            {{ userInfo.phone }}
            <van-button
              plain
              size="mini"
              open-type="getPhoneNumber"
              @getphonenumber="changePhoneNumber"
              custom-style="margin-left:10px;background:transparent;color:#fff;padding:0 5px;"
            >
              修改手机号
            </van-button>
          </view>
          <van-button
            v-else
            plain
            color="#FFF"
            size="mini"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
            custom-style="background:transparent;color:#fff;padding:0 5px;"
          >
            授权手机号
          </van-button>
        </view>
        <view>
          <div class="tagAuthentication" @click="doOpen('../../subpackages/orgUser/userT')">
            <text v-if="promoterLevel" style="color: #883b00">已认证</text>
            <text v-else style="color: #883b00">未认证</text>
          </div>
        </view>
        <!-- <view class="user-view">
          <view>
            <text class="nickname" @click="doOpen('../../subpackages/orgUser/userInfo')">
              {{ userInfo.nickname || userInfo.name }}
            </text>
            <text class="phone" @click="doOpen('../../subpackages/orgUser/userInfo')">
              {{ userInfo.phone }}
            </text>
          </view>
        </view> -->
        <!-- <van-icon
          name="setting-o"
          size="20px"
          class="c-p-10"
          @click="doOpen('../../subpackages/setting/setting')"
        /> -->
      </block>
      <block v-else>
        <van-button custom-class="avatar-wrapper" @click="loginPrompt">
          <van-image width="60" height="60" round class="c-flex" :src="userInfo.avatar" />
        </van-button>
        <van-button
          round
          type="info"
          size="small"
          @click="doOpen('../../subpackages/login/loginAuth')"
        >
          登 录
        </van-button>
        <!-- <van-button
          round
          type="default"
          size="small"
          @click="doOpen('../../subpackages/login/register')"
          style="margin-left: 15px"
        >
          注 册
        </van-button> -->
      </block>
    </view>
    <!-- <view class="statistics">
      <view style="display: flex; justify-content: space-between; padding: 18px 18px 5px 18px">
        <view class="statisticsTit">修链推广收益</view>
        <view
          style="display: flex"
          @click="doOpen('../income/myRewards', '', { mode: 'switchTab' })"
        >
          <view class="statisticsTitS">查看收益详情</view>
          <image
            style="width: 5px; padding: 4px 0 0px 3px"
            mode="widthFix"
            src="../../static/images/VectorIcon2.png"
          />
        </view>
      </view>
      <view style="display: flex">
        <view class="statisticsView">
          <view class="value">￥{{ myIncomeData.surplus / 100 || 0 }}</view>
          <view class="title">可提现金额</view>
        </view>
        <view class="statisticsView">
          <view class="value">￥{{ myIncomeData.allCash / 100 || 0 }}</view>
          <view class="title">累计提现金额</view>
        </view>
        <view class="statisticsView">
          <view class="value">￥{{ myIncomeData.allIncome / 100 || 0 }}</view>
          <view class="title">累计获得佣金</view>
        </view>
      </view>
    </view> -->

    <view class="grids">
      <view class="grid-title">服务与工具</view>
      <van-grid column-num="4" :border="false" square custom-class="c-grid">
        <van-grid-item
          text="我的客服"
          icon="service"
          icon-color="#ea0513"
          link-type="navigateTo"
          @click="callService"
        />
        <van-grid-item
          text="消息中心"
          icon="comment"
          icon-color="#ea0513"
          link-type="navigateTo"
          @click="doOpen('../../subpackages/assist/notYetOpened')"
        />
        <van-grid-item
          text="我的协议"
          icon="column"
          icon-color="#ea0513"
          link-type="navigateTo"
          @click="doOpen('../../subpackages/assist/myAgreement')"
        />
        <van-grid-item
          @click="doOpen('../../subpackages/assist/notYetOpened')"
          text="意见反馈"
          icon="todo-list"
          icon-color="#ea0513"
          link-type="navigateTo"
        />
      </van-grid>
    </view>

    <view class="joinGroup" @click="doOpen('../account/cluster')">
      <image
        mode="widthFix"
        style="width: 100%; border-radius: 8px"
        src="https://pub.fsgo365.cn/jiarugaoyongqun.png"
      />
      <!-- src="https://pub.fsgo365.cn/jiarugaoyongqun.png" -->
      <!-- <text class="text">加入高佣群——</text>
      <text class="text2">跳转页面留企微拉群</text> -->
    </view>
    <van-cell-group inset :border="false">
      <!-- <van-cell title="年度数据" is-link @click="doOpen('../../subpackages/assist/notYetOpened')" /> -->
      <van-cell
        title="推广规则"
        is-link
        @click="doOpen('../../subpackages/assist/promotionGuide')"
      />
      <van-cell
        title="常见问题"
        is-link
        @click="doOpen('../../subpackages/assist/commonProblem')"
      />
      <!-- <van-cell title="打卡确认" is-link @click="doOpen('../../subpackages/punch/toBeConfirmed')" /> -->
      <!-- <van-cell title="打卡记录" is-link @click="doOpen('../../subpackages/punch/punchQuery')" /> -->
      <!-- <van-cell
        title="活动模板"
        is-link
        @click="doOpen('../../subpackages/activities/activityThemes')"
      /> -->
      <!-- <van-cell
        title="活动列表"
        is-link
        @click="doOpen('../../subpackages/activities/activitys')"
      /> -->
      <van-cell
        title="设置"
        is-link
        :border="false"
        @click="doOpen('../../subpackages/orgUser/userInfo')"
      />
    </van-cell-group>
    <!-- <view class="c-grid">
      <view class="c-flex c-flex-between c-flex-center" style="padding: 15px 15px 5px">
        <text class="title">常用功能</text>
      </view>
      <van-grid :border="false" square clickable custom-class="c-grid">
        <van-grid-item
          text="推客认证"
          icon="friends"
          icon-color="#1989fa"
          link-type="navigateTo"
          url="../../subpackages/orgUser/userT"
        />
        <van-grid-item
          text="工人认证"
          icon="friends"
          icon-color="#F9C10C"
          link-type="navigateTo"
          url="../../subpackages/orgUser/orgUsers"
        />
      </van-grid>
    </view> -->
    <!-- <view class="content" style="margin: 0 15px">
      <view class="list-group">
        <view class="list">
          <van-cell-group>
            <van-cell
              title="我的活动"
              is-link
              link-type="navigateTo"
              url="../../subpackages/activities/activitys"
            />
          </van-cell-group>
        </view>
      </view>
    </view> -->

    <!-- 选择角色的下拉菜单 -->
    <!-- <van-action-sheet
      :show="roleShow"
      :actions="roleList"
      @close="roleShow = false"
      @select="onRoleSelect"
    /> -->

    <!-- 选择工作状态的下拉菜单 -->
    <van-action-sheet
      :show="workingStateShow"
      :actions="options.workingStates"
      @close="workingStateShow = false"
      @select="onWorkingStateSelect"
    />

    <!-- 选择工人状态的下拉菜单 -->
    <van-action-sheet
      :show="labourStatusShow"
      :actions="options.labourStatus"
      @close="labourStatusShow = false"
      @select="onLabourStatusSelect"
    />
  </view>
</template>

<script>
//获取应用实例
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      systemInfo: {
        menuButtonObject: {}
      },
      code: null, // 微信登录码
      isLogined: false, // 是否已登录
      // 用户信息
      userInfo: {
        avatar: '',
        nickname: '',
        name: ''
      },
      roleShow: false, // 切换角色上拉菜单 是否展示
      roleList: [], // 角色列表
      // currentRole: {}, // 当前角色
      // currentRoleButtons: [], // 当前角色按钮
      serviceResource: {}, // 服务资源
      workingStateShow: false, // 工作状态 是否展示
      labour: {}, // 劳务资源
      labourStatusShow: false,
      options: {
        workingStates: [],
        codecfg_workingStates: { codeId: 'workState' },
        codecfg_labourStatus: { codeId: 'workerStatus' },
        codecfg_promoterLevel: { codeId: 'promoterLevel' }
      },
      promoterLevel: '', //推广等级,用来判断认证
      myIncomeData: {}
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
  },
  onShow: function (params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    // 判断登录状态
    if (!common.osg.isLogined()) {
      this.isLogined = false;
      this.userInfo = {
        avatar: '',
        nickname: '',
        name: ''
      };
    } else {
      this.isLogined = true;
      let user = wx.getStorageSync('user');
      this.promoterLevel = user.user.promoterLevel || '';
      this.$set(this, 'userInfo', user.user);

      // this.currentRole = wx.getStorageSync('currentRole') || {};
      // this.currentRoleButtons = wx.getStorageSync('currentRoleButtons') || [];
      // 查询服务资源-工作状态
      // if (!this.serviceResource._id || this.options.workingStates.length == 0) {
      common.osg.codeoption(() => {
        this.getMyIncome();
      });
      // }
      // if (this.currentRole._id == '829896304553774967') {
      //   this.getLabour();
      // }
    }
  },
  methods: {
    // 跳转采购订单、发货单
    openPurchaseOrders(path, val) {
      common.osg.open(path, {
        status: val
      });
    },
    // 路由跳转
    doOpen(path, data, options) {
      common.osg.open(path, data, options);
    },
    // 选择头像
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
              let avatar = common.osg.downloadUrl + JSON.parse(res.data).key;
              that.upsertUserInfo(avatar);
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
    // 更新用户信息
    upsertUserInfo(avatar) {
      common.osg.ajax(
        'user/upsertAvatarOrNickname.do',
        {
          avatar
        },
        () => {
          this.userInfo.avatar = avatar;
          this.$forceUpdate();
          let user = wx.getStorageSync('user');
          user.avatar = avatar;
          wx.setStorageSync('user', user);
        }
      );
    },
    // 未登录提示
    loginPrompt() {
      common.osg.toast('请先登录！', 'none');
    },
    // 退出登录
    logOut() {
      this.isLogined = '';
      this.userInfo = {};
      // this.currentRole = {};
      this.serviceResource = {};
      wx.removeStorageSync('sessionId');
      wx.removeStorageSync('user');
      // wx.removeStorageSync('currentRole');
      wx.removeStorageSync('currentRoleFunctions');
      // wx.removeStorageSync('currentRoleButtons');
    },
    //选择角色
    // onRoleSelect(e) {
    //   this.getCurrentRoleFunctions(e.detail);
    //   // 更新data中当前角色
    //   this.currentRole = e.detail;
    //   // 缓存当前角色
    //   wx.setStorageSync('currentRole', this.currentRole);
    //   if (this.currentRole._id == '829896304553774967') {
    //     this.getLabour();
    //   } else {
    //     this.labour = {};
    //   }
    // },
    // 查询服务资源
    // getServiceResource() {
    //   common.osg.ajax(
    //     `biz/serviceResource/findByRelatedRecordId/${this.userInfo._id}.do`,
    //     {},
    //     res => {
    //       this.serviceResource = res || {};
    //       this.$forceUpdate();
    //     },
    //     { noload: true }
    //   );
    // },
    // 选择工作状态
    onWorkingStateSelect(e) {
      common.osg.ajax(
        `biz/serviceResource/upsertWorkType/${this.serviceResource._id}`,
        {
          workType: Number(e.detail.value)
        },
        res => {
          this.serviceResource = res.entity || {};
          this.$forceUpdate();
        }
      );
    },
    // 工作状态返显
    formatWorkingState(value) {
      return common.osg.codelabel('workingStates', String(value));
    },
    // 查询工人信息
    // getLabour() {
    //   common.osg.ajax('/biz/labour/findById', { id: this.userInfo._id }, res => {
    //     this.labour = res.data;
    //   });
    // },
    // 选择工人状态
    onLabourStatusSelect(e) {
      this.labour.status = Number(e.detail.value);
      common.osg.ajax(
        'biz/labour/upsert',
        {
          data: JSON.stringify(this.labour)
        },
        res => {
          this.labour = res.data;
        }
      );
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    format(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (!val || val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    // 查询当前登录人所有角色
    getUserRoles() {
      if (!this.isLogined) {
        common.osg.toast('请先登录！', 'none');
        return;
      }
      this.roleShow = true;
      common.osg.ajax('role/queryRoleByPersonInTenant', null, res => {
        this.roleList = res.data;
      });
    },
    // 获取当前角色菜单并换成
    // getCurrentRoleFunctions(currentRole) {
    //   common.osg.ajax(
    //     'function/changeRole',
    //     {
    //       roleIds: currentRole._id
    //     },
    //     res => {
    //       // 缓存当前角色菜单
    //       let functionList =
    //         (res.data.functionList[0] && res.data.functionList[0].functionList) || [];
    //       functionList.map(item => {
    //         let url = item.action;
    //         if (url) {
    //           if (url.indexOf('?') != -1) {
    //             let paramsUrl = url.split('?')[1];
    //             let paramArr = paramsUrl.split('&');
    //             let params = {};
    //             paramArr.map(item => {
    //               params[item.split('=')[0]] = item.split('=')[1];
    //             });
    //             item.orderState = params.orderState;
    //             item.status = params.status || 'all';
    //             item.type = params.type || '';
    //           } else {
    //             item.status = 'all';
    //           }
    //         }
    //       });
    //       wx.setStorageSync('currentRoleFunctions', functionList);
    //       // 缓存当前角色按钮
    //       let buttonList = (res.data.functionList[0] && res.data.functionList[0].buttonList) || [];
    //       wx.setStorageSync('currentRoleButtons', buttonList);
    //     }
    //   );
    // }
    //客服会话
    chatEntry() {
      common.osg.ajax('wmz/chatMessage/entry', {}, res => {
        console.log('res', res);
        common.osg.open('/subpackages/message/message', {
          relationId: res.data._id,
          sendUserName: '平台客服'
        });
      });
    },
    getMyIncome() {
      common.osg.ajax('wmt/basic/income/myIncome', {}, res => {
        this.myIncomeData = res.data;
        console.log(this.myIncomeData, 'this.myIncomeData');
      });
    },
    callService() {
      wx.makePhoneCall({
        phoneNumber: '13898448806' //客服手机号
      });
    },
    /**
     * 微信授权手机号登录
     */
    getPhoneNumber(e) {
      // 当e.detail.code没值表示用户拒绝了
      if (e.detail.code) {
        let params = {
          code: e.detail.code,
          appID: 'wx8501876977010e44'
        };
        common.osg.ajax('wmt/index/getPhoneNumber', params, res => {
          common.osg.toast('授权成功', 'none');
          this.isLogined = true;
          wx.setStorageSync('user', res.data.user);
          this.$set(this, 'userInfo', res.data.user);
          this.promoterLevel = res.data.user.promoterLevel || '';
          common.osg.codeoption(() => {
            this.getMyIncome();
          });
        });
      }
    },
    /**
     * 微信修改手机号登录
     */
    changePhoneNumber(e) {
      // 当e.detail.code没值表示用户拒绝了
      if (e.detail.code) {
        let params = {
          code: e.detail.code,
          appID: 'wx8501876977010e44'
        };
        common.osg.ajax('wmt/index/changePhone', params, res => {
          common.osg.alert('手机号修改成功');
          this.isLogined = true;
          wx.setStorageSync('user', res.data.user);
          this.$set(this, 'userInfo', res.data.user);
          this.promoterLevel = user.user.promoterLevel || '';
          common.osg.codeoption(() => {
            this.getMyIncome();
          });
        });
      }
    }
  }
};
</script>

<style lang="scss">
.account {
  position: relative;
  // min-height: 850rpx;
  // background: linear-gradient(360deg, rgba(246, 246, 246, 0) 0%, #bee3ff 100%);
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 10px;
  background: #f8f8f8;
  .bg {
    border-radius: 3%;
    width: 100vw;
    height: 260px;
    // background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
    background: linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%);
  }
  .user-info {
    display: flex;
    align-items: center;
    padding: 15px 25px 0;
    margin-top: -150px;
    > view {
      color: #fff;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      .name {
        color: #fff;
        font-size: 14px;
        font-weight: 600;
      }
      .change {
        margin-top: 5px;
        color: #fff;
        font-size: 12px;
      }
    }
  }
  .info {
    display: flex;
    align-items: center;
    padding: 20px;
    .avatar-wrapper {
      width: 60px;
      height: 60px !important;
      border-radius: 50% !important;
      margin-right: 20px;
    }
    // .user-view {
    //   height: 60px;
    //   flex: 1;
    //   display: flex;
    //   flex-direction: column;
    //   justify-content: space-around;
    //   .name {
    //     font-size: 14px;
    //     color: #444;
    //     font-weight: 500;
    //   }
    //   .phone {
    //     font-size: 13px;
    //     color: #969799;
    //     margin-left: 10px;
    //   }
    // }
  }
  .c-grid {
    margin: 0 15px 10px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #fff;
    .title {
      color: #444;
      font-weight: 500;
    }
    .van-grid-item__content {
      padding: 8px;
    }
  }
  .line {
    width: 200vw;
    position: fixed;
    bottom: 0;
    border-bottom: 2rpx solid #d9d9d9;
    transform: scale(0.5);
    transform-origin: 0 0;
    opacity: 0.9;
  }
  .tag {
    // width: 26px;
    height: 12px;
    border-radius: 3px;
    background: linear-gradient(219deg, #f75429 0%, #eb2b1e 100%);
    font-size: 9px;
    text-align: center;
    margin: 3px 0 0 5px;
    // position: absolute;
    // left: 40px;
    // top: 3px;
  }
  .tagAuthentication {
    font-size: 14px;
    text-align: center;
    width: 63px;
    height: 26px;
    line-height: 26px;
    border-radius: 80px;
    background: linear-gradient(219deg, #f8d7a1 0%, #ffc658 100%);
    position: absolute;
    top: 135px;
    right: 20px;
  }
  .statistics {
    margin: 15px 15px 10px;
    background: #fff;
    border-radius: 8px;
    // display: flex;
    .statisticsTit {
      font-size: 16px;
      font-weight: 600;
    }
    .statisticsTitS {
      font-size: 12px;
      font-weight: 500;
      color: #767676;
    }
    .statisticsView {
      text-align: center;
      position: relative;
      flex: 1;
      ::after {
        content: '';
        position: absolute;
        border-left: 1px solid #d9d9d9;
        height: 28px;
        right: 0;
        top: calc(50% - 14px);
      }
      &:last-child {
        ::after {
          display: none;
        }
      }
      .value {
        color: #000;
        font-size: 20px;
        font-weight: 600;
        margin: 15px 0 0;
      }
      .title {
        color: #736e6e;
        font-size: 14px;
        margin-bottom: 20px;
      }
    }
  }
  .joinGroup {
    border-radius: 8px;
    margin: 15px 15px 10px;
    // width: 358px;
    // height: 60px;
    // line-height: 60px;
    // text-align: center;
    // background: linear-gradient(219deg, #f75429 0%, #eb2b1e 100%);
    // .text {
    //   color: #fff;
    //   font-size: 20px;
    //   font-weight: 500;
    // }
    // .text2 {
    //   color: #fff;
    //   font-size: 14px;
    //   font-weight: 500;
    // }
  }
  .grids {
    margin: 35px 15px 10px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    .grid-title {
      padding: 15px 15px 0;
      font-size: 16px;
      font-weight: 600;
    }
    .grid {
      padding-bottom: 10px;
    }
    .van-grid-item__text {
      color: #000;
      font-size: 11px;
      font-weight: 400;
    }
  }
  .van-cell__title {
    color: #000;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
