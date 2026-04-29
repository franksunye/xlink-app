<template>
  <view
    class="account"
    @click.capture="track"
    :style="'padding-top:' + (systemInfo.statusBarHeight + systemInfo.navHeight) + 'px;'"
  >
    <!-- <FloatingBall
      ref="childRef"
      :moveLeft="moveLeft"
      :moveTop="moveTop"
      :navBarHeight="true"
    ></FloatingBall> -->
    <view class="info">
      <block v-if="isLogined">
        <!-- #ifdef MP-WEIXIN -->
        <van-button
          custom-class="avatar-wrapper"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
          custom-style="border: none"
        >
          <van-image
            width="60"
            height="60"
            round
            class="c-flex"
            :src="userInfo.avatar || 'https://pub.fsgo365.cn/avatar.png'"
          />
        </van-button>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <uni-file-picker
          :value="avatar"
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
        <view class="user-view">
          <view class="c-flex c-item-center">
            <text
              class="nickname"
              @click="doOpen('../../subpackages/orgUser/userInfo')"
              :data-event="{ id: 'CDCsY9p2vt' }"
            >
              {{ userInfo.nickname || userInfo.name }}
            </text>
            <text
              class="phone"
              @click="doOpen('../../subpackages/orgUser/userInfo')"
              :data-event="{ id: '8F46kJP5C9' }"
            >
              {{ userInfo.phone }}
            </text>
            <!-- <van-icon
              name="edit"
              color="#646566"
              class="c-m-l-20"
              @click="doOpen('../../subpackages/orgUser/userInfo')" :data-event="{id:'z32ZF9kdiO'}" /> -->
          </view>
          <view class="c-flex">
            <van-button
              round
              type="info"
              size="mini"
              custom-style="padding:0 5px;"
              @click="getUserRoles()"
              :data-event="{ id: 'aOMamG1ckH' }"
            >
              {{ currentRole.name || '请选择角色' }}
            </van-button>
            <van-button
              v-if="serviceResource._id && serviceResource.terminate !== 0"
              round
              size="mini"
              color="#969799"
              class="c-m-l-20"
            >
              已停单
            </van-button>
            <van-button
              v-else-if="serviceResource._id"
              round
              :type="
                serviceResource.workType == 0
                  ? 'info'
                  : serviceResource.workType == -1
                  ? 'default'
                  : ''
              "
              size="mini"
              class="c-m-l-20"
              @click="workingStateShow = true"
              :data-event="{ id: 'GMUMct9Ynq' }"
            >
              {{ formatWorkingState(serviceResource.workType) }}
            </van-button>
            <block v-if="currentRole._id == '6631748470755706348' && partnerSR._id">
              <van-button
                v-if="partnerSR.terminate !== 0"
                round
                size="mini"
                color="#969799"
                class="c-m-l-20"
                custom-style="width:75px;"
              >
                服务商 已停单
              </van-button>
              <van-button
                v-else
                round
                :type="partnerSR.workType == 0 ? 'info' : partnerSR.workType == -1 ? 'default' : ''"
                size="mini"
                class="c-m-l-20"
                custom-style="width:70px;"
                @click="partnerWorkingStateShow = true"
                :data-event="{ id: 'WKM87Qqrwu' }"
              >
                服务商 {{ formatWorkingState(partnerSR.workType) }}
              </van-button>
            </block>
            <van-button
              v-if="currentRole._id == '624497878569009992'"
              icon="sort"
              :type="labour.status === 0 ? 'info' : labour.status == 1 ? 'default' : ''"
              size="mini"
              custom-style="padding:0 5px;"
              class="c-m-l-20"
              @click="labourStatusShow = true"
              :data-event="{ id: 'vDwAToCYHu' }"
            >
              {{ codelabel('labourStatus', String(labour.status)) }}
            </van-button>
          </view>
        </view>
        <van-icon
          name="setting-o"
          size="20px"
          @click="doOpen('../../subpackages/setting/setting')"
          :data-event="{ id: 'AG570FPaWo' }"
        />
      </block>
      <block v-else>
        <van-button
          custom-class="avatar-wrapper"
          @click="loginPrompt"
          :data-event="{ id: 'xUMCfNZedS' }"
        >
          <van-image
            width="60"
            height="60"
            round
            class="c-flex"
            :src="userInfo.avatar"
            :data-event="{ id: 'xUMCfNZedS' }"
          />
        </van-button>
        <van-button
          round
          type="info"
          size="small"
          @click="doOpen('../../subpackages/login/loginAuth')"
          :data-event="{ id: 'lxmrfUL7rO' }"
        >
          登 录
        </van-button>
        <!-- <van-button
          round
          type="default"
          size="small"
          @click="doOpen('../../subpackages/login/register')"
          style="margin-left: 15px"
          :data-event="{ id: '5vklg12boq' }"
        >
          注 册
        </van-button> -->
      </block>
    </view>
    <!-- v-if="currentRoleButtons.find(item => item.code == 'purchaseOrder')" -->
    <!-- 服务商内勤、访客、试用用户、平台管理员 -->
    <view
      class="c-grid"
      v-if="
        currentRole._id == '6631748470755706348' ||
        currentRole._id == '1560452939180360811' ||
        currentRole._id == '4742147504330067121' ||
        currentRole._id == '3025142616514869963'
      "
    >
      <view class="c-flex c-flex-between c-flex-center" style="padding: 15px 15px 5px">
        <text class="title">采购订单</text>
        <view
          class="c-color-value c-size-14"
          @click="doOpen('/subpackages/purchase/purchaseOrders')"
          :data-event="{ id: 'inB2p2R_Bx' }"
        >
          <text :data-event="{ id: 'inB2p2R_Bx' }">全部</text>
          <van-icon name="arrow" :data-event="{ id: 'inB2p2R_Bx' }" />
        </view>
      </view>
      <!-- balance-list-o navigateTo logistics navigateTo-->
      <van-grid :border="false" square clickable icon-size="32px">
        <van-grid-item
          text="已创建"
          icon="https://pub.fsgo365.cn/jishi/yichuangjian.png"
          link-type="navigateTo"
          @click="openPurchaseOrders('/subpackages/purchase/purchaseOrders', 1)"
          :data-event="{ id: 'GJQnf5dqfG' }"
        />
        <van-grid-item
          text="已接单"
          icon="https://pub.fsgo365.cn/jishi/yijiedan.png"
          link-type="navigateTo"
          @click="openPurchaseOrders('/subpackages/purchase/purchaseOrderItems', 201)"
          :data-event="{ id: 'aIsP2Apykg' }"
        />
        <van-grid-item
          text="已发货"
          icon="https://pub.fsgo365.cn/jishi/yifahuo.png"
          link-type="navigateTo"
          @click="openPurchaseOrders('/subpackages/purchase/purchaseOrderItems', 301)"
          :data-event="{ id: 'G9f2HNB3qI' }"
        />
        <van-grid-item
          text="已签收"
          icon="https://pub.fsgo365.cn/jishi/yiqianshou.png"
          link-type="navigateTo"
          @click="openPurchaseOrders('/subpackages/purchase/purchaseOrderItems', 401)"
          :data-event="{ id: 'QL-Wh-jVy5' }"
        />
        <van-grid-item
          text="待支付"
          icon="https://pub.fsgo365.cn/jishi/daizhifu.png"
          link-type="navigateTo"
          @click="openPurchaseOrders('/subpackages/purchase/purchaseOrders', 1, 0)"
          :data-event="{ id: 'OKlytRZ0VP' }"
        />
        <van-grid-item
          text="已退货"
          icon="https://pub.fsgo365.cn/jishi/yituihuo.png"
          link-type="navigateTo"
          @click="openPurchaseOrders('/subpackages/purchase/purchaseOrderItems', 499)"
          :data-event="{ id: 'yAso-apXN4' }"
        />
      </van-grid>
    </view>
    <!-- 2358903041435846552小微服务站管理人员id  9001474127894983394社区门店推广专员-->
    <view
      class="c-grid"
      v-if="
        currentRole._id == '6631748470755706348' ||
        currentRole._id == '1560452939180360811' ||
        currentRole._id == '4742147504330067121' ||
        currentRole._id == '624497878569009992' ||
        currentRole._id == '3481370558631265818' ||
        currentRole._id == '2358903041435846552' ||
        currentRole._id == '9001474127894983394' ||
        userInfo.phone == '18003218811'
      "
    >
      <view class="c-flex c-flex-between c-flex-center" style="padding: 15px 15px 5px">
        <text class="title">常用功能</text>
      </view>
      <!-- v-if="currentRoleButtons.find(item => item.code == 'orgUser')" -->
      <van-grid :border="false" square clickable custom-class="c-grid">
        <van-grid-item
          v-if="userInfo.phone == '18003218811'"
          text="开始送货"
          icon="https://pub.fsgo365.cn/yifahuo.png"
          icon-color="#ff6900"
          icon-class="c-blue"
          link-type="navigateTo"
          :url="'../../subpackages/map/map?t=' + new Date().getTime()"
        />
        <van-grid-item
          v-if="currentRole._id == '6631748470755706348'"
          text="账号管理"
          icon="https://pub.fsgo365.cn/jishi/zhanghaoguanli.png"
          link-type="navigateTo"
          :url="'../../subpackages/orgUser/orgUsers?t=' + new Date().getTime()"
        />
        <van-grid-item
          v-if="currentRole._id == '6631748470755706348'"
          text="工人管理"
          icon="https://pub.fsgo365.cn/jishi/gongrenguanli.png"
          link-type="navigateTo"
          :url="'../../subpackages/orgUser/yWorkers?t=' + new Date().getTime()"
        />
        <van-grid-item
          v-if="currentRole._id == '6631748470755706348'"
          text="服务资源"
          icon="https://pub.fsgo365.cn/jishi/fuwuziyuan.png"
          link-type="navigateTo"
          :url="'../../subpackages2/serviceResource/serviceResource?t=' + new Date().getTime()"
        />

        <van-grid-item
          v-if="currentRole._id == '3481370558631265818'"
          text="服务区域"
          icon="location-o"
          link-type="navigateTo"
          :url="'../../subpackages/serviceTerritory/myServiceTerritories?t=' + new Date().getTime()"
        />
        <van-grid-item
          v-if="
            currentRole._id == '6631748470755706348' || currentRole._id == '3481370558631265818'
          "
          text="资源分布图"
          icon="https://pub.fsgo365.cn/jishi/ziyuanfenbutu.png"
          link-type="navigateTo"
          :url="'../../subpackages/serviceResource/distributionMap?t=' + new Date().getTime()"
        />
        <van-grid-item
          v-if="
            currentRole._id == '6631748470755706348' ||
            currentRole._id == '1560452939180360811' ||
            currentRole._id == '4742147504330067121'
          "
          text="优惠券"
          icon="https://pub.fsgo365.cn/jishi/youhuiquan.png"
          link-type="navigateTo"
          :url="'../../subpackages/coupon/my?t=' + new Date().getTime()"
        />
        <!-- 访客、试用用户、合伙人内勤 -->
        <van-grid-item
          v-if="
            currentRole._id == '1560452939180360811' ||
            currentRole._id == '4276480864482407485' ||
            currentRole._id == '6631748470755706348'
          "
          text="信用账户"
          icon="https://pub.fsgo365.cn/jishi/xinyongzhanghu.png"
          link-type="navigateTo"
          :url="'../../subpackages/wallet/partnerCredit?t=' + new Date().getTime()"
        />
        <van-grid-item
          v-if="currentRole._id == '6631748470755706348'"
          text="分账汇总"
          icon="https://pub.fsgo365.cn/jishi/fenzhanghuizong.png"
          link-type="navigateTo"
          :url="'/subpackages2/settleOptimiz/amount?t=' + new Date().getTime()"
        />
        <van-grid-item
          v-if="currentRole._id == '6631748470755706348'"
          text="分账明细"
          icon="https://pub.fsgo365.cn/jishi/fenzhangmingxi.png"
          link-type="navigateTo"
          :url="'/subpackages2/settleOptimiz/records?t=' + new Date().getTime()"
        />
        <!-- <van-grid-item
          v-if="currentRole._id == '6631748470755706348'"
          text="工人管理"
          icon="manager"
          icon-color="#ffd700"
          icon-class="c-yellow"
          link-type="navigateTo"
          :url="'../../subpackages/orgUser/myWorker?t=' + new Date().getTime()"
        /> -->
        <van-grid-item
          v-if="currentRole._id == '624497878569009992'"
          text="工人信息"
          icon="https://pub.fsgo365.cn/jishi/gongrenguanli.png"
          link-type="navigateTo"
          :url="`../../subpackages/labour/modify?id=${labour._id}&t=` + new Date().getTime()"
        />
        <!-- #ifdef APP-PLUS -->
        <van-grid-item
          v-if="currentRole._id == '3481370558631265818'"
          text="打卡确认"
          icon="completed"
          icon-color="#ff6900"
          icon-class="c-blue"
          link-type="navigateTo"
          :url="'../../subpackages2/punch/punchDetail?t=' + new Date().getTime()"
        />
        <van-grid-item
          v-if="currentRole._id == '3481370558631265818'"
          text="打卡记录"
          icon="completed-o"
          icon-color="#ff6900"
          icon-class="c-blue"
          link-type="navigateTo"
          :url="'../../subpackages2/punch/punchPeriod?t=' + new Date().getTime()"
        />
        <!-- #endif -->
        <van-grid-item
          v-if="
            currentRole._id == '2358903041435846552' || currentRole._id == '9001474127894983394'
          "
          text="渠道绑定"
          icon="scan"
          icon-color="#ff6900"
          icon-class="c-blue"
          link-type="navigateTo"
          :url="'../../subpackages/xiaoV/xiaoVBind?t=' + new Date().getTime()"
        />
      </van-grid>
    </view>

    <view class="line"></view>

    <!-- 选择角色的下拉菜单 -->
    <van-action-sheet
      :show="roleShow"
      :actions="roleList"
      @close="roleShow = false"
      @select="onRoleSelect"
    />

    <!-- 选择技师服务资源工作状态的下拉菜单 -->
    <van-action-sheet
      :show="workingStateShow"
      :actions="options.workingStates"
      @close="workingStateShow = false"
      @select="onWorkingStateSelect"
    />

    <!-- 选择伙伴服务资源工作状态的下拉菜单 -->
    <van-action-sheet
      :show="partnerWorkingStateShow"
      :actions="options.workingStates"
      @close="partnerWorkingStateShow = false"
      @select="onPartnerWorkingStateSelect"
    />

    <!-- 选择工人状态的下拉菜单 -->
    <van-action-sheet
      :show="labourStatusShow"
      :actions="options.labourStatus"
      @close="labourStatusShow = false"
      @select="onLabourStatusSelect"
    />
    <Tabbar></Tabbar>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
//获取应用实例
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      code: null, // 微信登录码
      isLogined: false, // 是否已登录
      // 用户信息
      avatar: { name: 'avatar.png', extname: 'png', url: 'https://pub.fsgo365.cn/avatar.png' },
      userInfo: {
        avatar: '',
        nickname: '',
        name: ''
      },
      roleShow: false, // 切换角色上拉菜单 是否展示
      roleList: [], // 角色列表
      currentRole: {}, // 当前角色
      currentRoleButtons: [], // 当前角色按钮
      serviceResource: {}, // 技师服务资源
      partnerSR: {}, // 伙伴服务资源
      workingStateShow: false, // 技师服务资源工作状态 是否展示
      partnerWorkingStateShow: false, // 伙伴服务资源工作状态 是否展示
      labour: {}, // 劳务资源
      labourStatusShow: false,
      options: {
        workingStates: [],
        codecfg_workingStates: { codeId: 'workState' },
        codecfg_labourStatus: { codeId: 'workerStatus' }
      },
      systemInfo: {}
    };
  },
  // computed: {
  //   ...mapState(['moveLeft', 'moveTop'])
  // },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.systemInfo = app.globalData.systemInfo;
  },
  // onHide() {
  //   this.updatePreviousPageNavBarStatus(true);
  // },
  onShow: function (params) {
    //更新悬浮球位置
    // this.$refs.childRef.UpdateInitialPosition();
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
      // #ifdef APP-PLUS
      if (this.userInfo.avatar) this.avatar.url = this.userInfo.avatar;
      // #endif
      this.currentRole = wx.getStorageSync('currentRole') || {};
      this.currentRoleButtons = wx.getStorageSync('currentRoleButtons') || [];
      // 查询服务资源-工作状态
      if (!this.serviceResource._id || this.options.workingStates.length == 0) {
        common.osg.codeoption(() => {
          this.getServiceResource();
        });
      }
      // 合伙人内勤
      if (this.currentRole._id == '6631748470755706348' && !this.partnerSR._id) {
        this.getPartnerSR();
      }
      // 云用工工人
      if (this.currentRole._id == '624497878569009992') {
        this.getLabour();
      }
    }
  },
  methods: {
    ...mapMutations(['updatePreviousPageNavBarStatus', 'updatTabbarList']),
    // 跳转采购订单、发货单
    openPurchaseOrders(path, status, payState) {
      common.osg.open(path, {
        status: status || null,
        payState: payState || payState == 0 ? payState : null,
        t: new Date().getTime()
      });
    },
    // 路由跳转
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    // 选择头像
    onChooseAvatar(e) {
      // #ifdef MP-WEIXIN
      let filePath = e.detail.avatarUrl;
      // #endif

      // #ifdef APP-PLUS
      let filePath = e.tempFiles[0].path;
      this.avatar.url = e.tempFiles[0].url;
      this.avatar.name = e.tempFiles[0].name;
      this.avatar.extname = e.tempFiles[0].extname;
      // #endif

      common.osg.ajax(
        'back/super/file/upToken.do',
        {
          // #ifdef MP-WEIXIN
          fileName: filePath.split('/')[filePath.split('/').length - 1],
          // #endif
          // #ifdef APP-PLUS
          fileName: this.avatar.name
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
          // #ifdef APP-PLUS
          this.avatar.url = avatar;
          // #endif
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
      this.currentRole = {};
      this.serviceResource = {};
      wx.removeStorageSync('sessionId');
      wx.removeStorageSync('user');
      wx.removeStorageSync('currentRole');
      wx.removeStorageSync('currentRoleFunctions');
      wx.removeStorageSync('currentRoleButtons');
    },
    //选择角色
    onRoleSelect(e) {
      // #ifdef APP-PLUS
      app.globalData.permissionState = 0; // 需要重新检查当前角色授权
      // #endif

      this.getCurrentRoleFunctions(e.detail);
      // 更新data中当前角色
      this.currentRole = e.detail;
      // 缓存当前角色
      wx.setStorageSync('currentRole', this.currentRole);
      if (this.currentRole._id == '624497878569009992') {
        this.getLabour();
      } else {
        this.labour = {};
      }
    },
    // 查询技师服务资源
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
    // 查询伙伴服务资源
    getPartnerSR() {
      common.osg.ajax(
        `biz/serviceResource/query.do`,
        {
          'is:orgId|string#and': this.userInfo.orgId,
          'is:resourceType|string#and': 'partner'
        },
        res => {
          this.partnerSR = res.data[0] || {};
          this.$forceUpdate();
        },
        { noload: true }
      );
    },
    // 选择技师服务资源工作状态
    onWorkingStateSelect(e) {
      common.osg.ajax(
        `biz/serviceResource/upsertWorkType/${this.serviceResource._id}`,
        {
          workType: Number(e.detail.value)
        },
        res => {
          this.serviceResource = res.data || {};
          this.$forceUpdate();
        }
      );
    },
    // 选择伙伴服务资源工作状态
    onPartnerWorkingStateSelect(e) {
      common.osg.ajax(
        `biz/serviceResource/upsertWorkType/${this.partnerSR._id}`,
        {
          workType: Number(e.detail.value)
        },
        res => {
          this.partnerSR = res.data || {};
          this.$forceUpdate();
        }
      );
    },
    // 工作状态返显
    formatWorkingState(value) {
      return common.osg.codelabel('workingStates', String(value));
    },
    // 查询工人信息
    getLabour() {
      common.osg.ajax('/biz/labour/findById', { id: this.userInfo._id }, res => {
        this.labour = res.data;
      });
    },
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
          //更新tabbar 列表
          this.updatTabbarList();
          // 缓存当前角色按钮
          let buttonList = (res.data.functionList[0] && res.data.functionList[0].buttonList) || [];
          wx.setStorageSync('currentRoleButtons', buttonList);
          // 获取/更新伙伴服务资源状态
          if (currentRole._id == '6631748470755706348') {
            this.getPartnerSR();
          }
          // 更新技师服务资源状态
          this.getServiceResource();
        }
      );
    },
    // 删除图片
    deleteFile(e) {
      this.userInfo.avatar.splice(e.detail.index, 1);
    }
  }
};
</script>

<style lang="scss">
.account {
  min-height: 850rpx;
  background-image: url('https://pub.fsgo365.cn/jishi/background.jpg');
  background-size: 100vw auto;
  background-position: top center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100vh;
  .info {
    display: flex;
    align-items: center;
    padding: 15px;
    .avatar-wrapper {
      width: 60px;
      height: 60px !important;
      border-radius: 50% !important;
      margin-right: 15px;
    }
    .user-view {
      height: 60px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .name {
        font-size: 14px;
        color: #444;
        font-weight: 500;
      }
      .phone {
        font-size: 13px;
        color: #646566;
        margin-left: 10px;
      }
    }
    .c-uni-file-picker-avatar.uni-file-picker {
      margin-right: 10px;
      flex: unset !important;
      width: unset !important;
      .uni-file-picker__container {
        margin: 0 !important;
        .file-picker__box {
          width: 60px !important;
          height: 60px !important;
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
}
</style>
