<template>
  <view class="account">
    <view class="info">
      <block v-if="isLogined">
        <van-button
          custom-class="avatar-wrapper"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
        >
          <van-image width="60" height="60" round class="c-flex" :src="userInfo.avatar" />
        </van-button>
        <view class="user-view">
          <view>
            <text class="c-bold" @click="doOpen('../../subpackages/orgUser/userInfo')">
              {{ userInfo.nickname || userInfo.name }}
            </text>
            <text
              class="c-m-l-20 c-color-value"
              @click="doOpen('../../subpackages/orgUser/userInfo')"
            >
              {{ userInfo.phone }}
            </text>
            <!-- <van-icon
              name="edit"
              color="#646566"
              class="c-m-l-20"
              @click="doOpen('../../subpackages/orgUser/userInfo')"
            /> -->
          </view>
          <view class="c-flex c-flex-between c-flex-end">
            <view>
              <van-button
                icon="sort"
                type="info"
                size="mini"
                custom-style="padding:0 5px;"
                @click="getUserRoles()"
              >
                {{ currentRole.name || '请选择角色' }}
              </van-button>
              <van-button
                v-if="serviceResource._id"
                icon="sort"
                :type="
                  serviceResource.workType == 0
                    ? 'primary'
                    : serviceResource.workType == -1
                    ? 'danger'
                    : ''
                "
                size="mini"
                class="c-m-l-20"
                @click="workingStateShow = true"
              >
                {{ formatWorkingState(serviceResource.workType) }}
              </van-button>
            </view>
            <!-- <text class="c-color-value c-size-14" @click="logOut">退出登录</text> -->
          </view>
        </view>
        <van-icon
          name="setting-o"
          size="20px"
          class="c-p-10"
          @click="doOpen('../../subpackages/setting/setting')"
        />
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
      </block>
    </view>

    <view class="c-grid">
      <view class="c-flex c-flex-between c-flex-center" style="padding: 10px">
        <text>发货订单</text>
        <view
          class="c-color-value c-size-14"
          @click="doOpen('/subpackages/purchase/purchaseOrderItems')"
        >
          <text>全部</text>
          <!-- <van-button>全部</van-button> -->
          <van-icon name="arrow" color="#646566" />
        </view>
      </view>
      <van-grid :border="false" square clickable>
        <van-grid-item
          text="待接单"
          icon="balance-list-o"
          link-type="navigateTo"
          @click="openPurchaseOrderItems('/subpackages/purchase/purchaseOrderItems', 102)"
        />
        <van-grid-item
          text="待发货"
          icon="flag-o"
          link-type="navigateTo"
          @click="openPurchaseOrderItems('/subpackages/purchase/purchaseOrderItems', 201)"
        />
        <!-- logistics -->
        <van-grid-item
          text="待签收"
          icon="logistics"
          link-type="navigateTo"
          @click="openPurchaseOrderItems('/subpackages/purchase/purchaseOrderItems', 301)"
        />
        <van-grid-item
          text="已完成"
          icon="sign"
          link-type="navigateTo"
          @click="openPurchaseOrderItems('/subpackages/purchase/purchaseOrderItems', 401)"
        />
        <van-grid-item
          text="已退货"
          icon="refund-o"
          link-type="navigateTo"
          @click="openPurchaseOrderItems('/subpackages/purchase/purchaseOrderItems', 499)"
        />
      </van-grid>
    </view>

    <van-grid :border="false" square clickable custom-class="c-grid">
      <!-- <van-grid-item
        text="用户管理"
        icon="friends"
        icon-color="#1989fa"
        link-type="navigateTo"
        url="../../subpackages/orgUser/orgUsers"
      /> -->
      <!-- <van-grid-item
        text="门店管理"
        icon="shop"
        icon-color="#07c160"
        link-type="navigateTo"
        url="../../subpackages/orgUser/orgUsers"
      />
      <van-grid-item
        text="门店推广"
        icon="share"
        icon-color="#ff976a"
        link-type="navigateTo"
        url="../../subpackages/orgUser/orgUsers"
      /> -->
    </van-grid>

    <!-- 选择角色的下拉菜单 -->
    <van-action-sheet
      :show="roleShow"
      :actions="roleList"
      @close="roleShow = false"
      @select="onRoleSelect"
    />

    <!-- 选择工作状态的下拉菜单 -->
    <van-action-sheet
      :show="workingStateShow"
      :actions="options.workingStates"
      @close="workingStateShow = false"
      @select="onWorkingStateSelect"
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
      currentRole: {}, // 当前角色
      serviceResource: {}, // 服务资源
      options: {
        workingStates: [],
        codecfg_workingStates: { codeId: 'workState' }
      },
      workingStateShow: false // 工作状态 是否展示
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
  },
  onShow: function (params) {
    common.osg.init(this, params, app);
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
      this.$set(this, 'userInfo', wx.getStorageSync('user'));
      this.currentRole = wx.getStorageSync('currentRole') || {};
      // 查询服务资源-工作状态
      if (!this.serviceResource._id || this.options.workingStates.length == 0) {
        common.osg.codeoption(() => {
          this.getServiceResource();
        });
      }
    }
  },
  methods: {
    // 跳转采购订单
    openPurchaseOrderItems(path, val) {
      common.osg.open(path, {
        purchaseOrderItemStatus: val
      });
    },
    // 路由跳转
    doOpen(path) {
      common.osg.open(path);
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
      this.currentRole = {};
      this.serviceResource = {};
      wx.removeStorageSync('sessionId');
      wx.removeStorageSync('user');
      wx.removeStorageSync('currentRole');
      wx.removeStorageSync('currentRoleFunctions');
    },
    //选择角色
    onRoleSelect(e) {
      this.getCurrentRoleFunctions(e.detail);
      // 更新data中当前角色
      this.currentRole = e.detail;
      // 缓存当前角色
      wx.setStorageSync('currentRole', this.currentRole);
    },
    // 查询服务资源
    getServiceResource() {
      common.osg.ajax(
        `biz/serviceResource/findByRelatedRecordId/${this.userInfo._id}.do`,
        {},
        res => {
          this.serviceResource = res || {};
          this.$forceUpdate();
        },
        { noload: true }
      );
    },
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
        }
      );
    }
  }
};
</script>

<style lang="scss">
.account {
  .info {
    display: flex;
    align-items: center;
    padding: 10px;
    background: #fff;
    .avatar-wrapper {
      width: 60px;
      height: 60px !important;
      border-radius: 50% !important;
      margin-right: 20px;
    }
    .user-view {
      height: 60px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
  .c-grid {
    margin: 10px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #fff;
    .van-grid-item__content {
      padding: 8px;
    }
  }
}
</style>
