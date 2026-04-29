<template>
  <view class="index" @click.capture="track">
    <!-- <FloatingBall
			v-if="functionList.length !== 0 && isLogined"
			ref="childRef"
			:moveLeft="moveLeft"
			:moveTop="moveTop"
			:navBarHeight="false"
		></FloatingBall> -->
    <view
      :style="
        'position:absolute;z-index:1;top:' +
        systemInfo.statusBarHeight +
        'px;left:' +
        (systemInfo.menuButtonObject.marginRight || 10) +
        'px;height:' +
        systemInfo.navHeight +
        'px;line-height:' +
        systemInfo.navHeight +
        'px;color:#fff;display:flex;align-items:center;font-weight:500;'
      "
    >
      <text
        v-if="
          systemInfo.osName == 'ios' ||
          systemInfo.osName == 'mac' ||
          systemInfo.osName == 'devtools'
        "
        :style="
          'width:calc(100vw - ' +
          systemInfo.menuButtonObject.marginRight * 2 +
          'px);text-align:center'
        "
        :class="!isLogined ? 'c-gray-8' : ''"
      >
        修链科技丨服务商
      </text>
      <text v-else :class="!isLogined ? 'c-gray-8' : ''">修链科技丨服务商</text>
    </view>
    <view>
      <!-- 轮播图 -->
      <swiper
        v-if="notice.data.find(item => item.isTop && item.fileids && item.fileids[0])"
        autoplay="true"
        :interval="4000"
        :duration="500"
        :style="'height:' + bannerHeight"
        circular
      >
        <block v-for="(item, index) in notice.data" :key="index">
          <swiper-item
            v-if="item.isTop && item.fileids && item.fileids[0]"
            @click="toNotice(item)"
            :data-event="{ id: 'EdWCEEhhc4' }"
          >
            <image
              :src="downloadUrl + '' + item.fileids[0]"
              mode="widthFix"
              @load="getHeight"
              :data-id="item._id"
              :data-event="{ id: 'EdWCEEhhc4' }"
            ></image>
          </swiper-item>
        </block>
      </swiper>
      <image
        v-else-if="isLogined"
        src="https://pub.fsgo365.cn/3285368961307229301.png"
        mode="widthFix"
        class="c-w-1"
      ></image>
      <!-- 公告 -->
      <van-notice-bar
        v-if="notice.data.length > 0"
        scrollable
        left-icon="bullhorn-o"
        :text="notice.data[noticeIndex].title"
        @click="toNotice(notice.data[noticeIndex])"
        custom-class="c-notice-bar"
        :data-event="{ id: '_ps1XXuuRi' }"
      >
        <view
          slot="right-icon"
          class="c-notice-bar__right-icon"
          @click.native.stop="doOpen('/subpackages/noticeManage/noticeManage')"
          :data-event="{ id: 'Gm4xgAN8Yh' }"
        >
          <text :data-event="{ id: 'Gm4xgAN8Yh' }">全部</text>
          <van-icon name="arrow" :data-event="{ id: 'Gm4xgAN8Yh' }" />
        </view>
      </van-notice-bar>
      <!-- 管家驾驶舱 -->
      <!-- 关键经营指标 -->
      <view class="housekeepReport" v-if="isLogined && currentRole._id == '8050029062726074247'">
        <view class="HRFirstBlok">
          <view>
            <view>平台排名</view>
            <view>{{ supervisorData.rankList }}</view>
            <view></view>
            <!-- 转化率 {{ supervisorData.turnoverRate }} -->
          </view>
        </view>
        <view class="HRLastBlok">
          <view class="statisticsBlok1">
            <view>
              <view class="statisticsTitle">接单</view>
              <view class="statisticsNumber">{{ supervisorData.accept || 0 }}</view>
              <view class="statisticsTitle">
                <view>上月 {{ supervisorData.lastAccept || 0 }}</view>
              </view>
            </view>
            <view>
              <view class="statisticsTitle">签合同</view>
              <view class="statisticsNumber">{{ supervisorData.sign || 0 }}</view>
              <view class="statisticsTitle">
                <view>上月 {{ supervisorData.lastSign || 0 }}</view>
              </view>
            </view>
            <view>
              <view class="statisticsTitle">签约额（万元）</view>
              <view class="statisticsNumber">
                {{ (parseInt((supervisorData.contractAmount || 0) / 100) / 100).toFixed(2) || 0 }}
              </view>
              <view class="statisticsTitle">
                <view>
                  上月
                  {{
                    (parseInt((supervisorData.lastContractAmount || 0) / 100) / 100).toFixed(2) || 0
                  }}
                </view>
              </view>
            </view>
          </view>
          <van-divider />
          <view class="statisticsBlok2">当月数据与上月数据对比</view>
        </view>
      </view>
      <!-- 关键待做事宜统计 -->
      <view class="housekeepReport2" v-if="isLogined && currentRole._id == '8050029062726074247'">
        <view class="title">待处理事宜数据</view>
        <view class="block1">
          <view class="square" @click="reportNavigateTo('105')" :data-event="{ id: 'nnyrLEK6bY' }">
            <view class="number" :data-event="{ id: 'nnyrLEK6bY' }">
              {{ supervisorTodoData.appointment || 0 }}
            </view>
            <view class="state" :data-event="{ id: 'nnyrLEK6bY' }">待预约</view>
          </view>
          <view class="square" @click="reportNavigateTo('202')" :data-event="{ id: '0gCueuWy5H' }">
            <view class="number" :data-event="{ id: '0gCueuWy5H' }">
              {{ supervisorTodoData.meet || 0 }}
            </view>
            <view class="state" :data-event="{ id: '0gCueuWy5H' }">待上门</view>
          </view>
          <view class="square" @click="reportNavigateTo('203')" :data-event="{ id: '_FkyBIwGIi' }">
            <view class="number" :data-event="{ id: '_FkyBIwGIi' }">
              {{ supervisorTodoData.order || 0 }}
            </view>
            <view class="state" :data-event="{ id: '_FkyBIwGIi' }">待下单</view>
          </view>
          <view class="square" @click="reportNavigateTo('206')" :data-event="{ id: 'IldyAkZ7bU' }">
            <view class="number" :data-event="{ id: 'IldyAkZ7bU' }">
              {{ supervisorTodoData.sign || 0 }}
            </view>
            <view class="state" :data-event="{ id: 'IldyAkZ7bU' }">待签约</view>
          </view>
        </view>
        <view class="block2">
          <view class="square2" @click="reportNavigateTo('201')" :data-event="{ id: '-iRhFZxZw6' }">
            <view class="number" :data-event="{ id: '-iRhFZxZw6' }">
              {{ supervisorTodoData.notMeet || 0 }}
            </view>
            <view class="state" :data-event="{ id: '-iRhFZxZw6' }">不需要上门</view>
          </view>
          <view class="square2" @click="reportNavigateTo('204')" :data-event="{ id: '1Oiy8EPJtB' }">
            <view class="number" :data-event="{ id: '1Oiy8EPJtB' }">
              {{ supervisorTodoData.notOrder || 0 }}
            </view>
            <view class="state" :data-event="{ id: '1Oiy8EPJtB' }">上门未成交</view>
          </view>
          <view class="rectangle">
            <view class="number">{{ supervisorTodoData.paid || 0 }}</view>
            <view class="rectangleState">待回款金额（万元）</view>
          </view>
        </view>
      </view>
      <!-- 功能导航 -->
      <van-grid
        v-if="functionList.length > 0"
        :border="false"
        clickable
        column-num="3"
        icon-size="58px"
      >
        <block v-for="(item, index) in functionList" :key="index">
          <van-grid-item
            v-if="item.memo != 'Tabbar'"
            @click="gridClick(item, $event)"
            :icon="item.code"
            :link-type="item.openType"
            :url="
              item.name == '成长通' && currentRole._id == '8050029062726074247'
                ? '/subpackages2/myIndicatorScore/myIndicatorScore?t=' + new Date().getTime()
                : item.action && item.action.indexOf('?') != -1
                ? item.action + '&t=' + new Date().getTime()
                : item.action + '?t=' + new Date().getTime()
            "
            :text="item.name"
            :badge="
              item.action && item.action.indexOf('message/messages') != -1 && newMessageCount > 0
                ? newMessageCount
                : funtionCount[item._id]
            "
            :style="'color:' + item.color"
            content-class="c-grid-item-content"
            :data-event="{ id: 'rGGSg-KgHd' }"
          />
        </block>
      </van-grid>
      <van-image
        v-if="isLogined && notice.data.length > 0"
        width="100%"
        custom-class="c-banner-bottom"
        fit="widthFix"
        src="https://pub.fsgo365.cn/banner-bottom.png"
        @click="toNotice({ _id: '7357891758563675010' })"
        :data-event="{ id: 'Xp9xhYHC0d' }"
      />
      <van-empty
        v-if="functionList.length == 0 && !isLogined"
        description="请先登录后再查看功能菜单"
        class="c-empty"
      >
        <view>
          <view class="c-flex c-flex-center">
            <van-button
              round
              type="info"
              color="#106cff"
              @click="doOpen('/subpackages/login/loginAuth')"
              :data-event="{ id: 'c2LvY-xbia' }"
            >
              去登录
            </van-button>
            <!-- <van-button
              style="margin-left: 20px"
              round
              type="default"
              @click="doOpen('/subpackages/login/register')"
              :data-event="{ id: 'fRKt47T2Bq' }"
            >
              注 册
            </van-button> -->
          </view>
          <!-- <view style="margin-top: 20px">
            <van-checkbox :value="loginRead" shape="square" @change="loginReadChange">
              阅读并同意
              <text
                class="c-blue"
                @click.stop="
                  doOpen('../../subpackages/web/web', {
                    url: 'https://pub.fsgo365.cn/privacyAgreement.html'
                  })
                "
                :data-event="{ id: 'uefl6B6CN9' }"
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
                :data-event="{ id: 'oiGm7bzHPm' }"
              >
                用户协议
              </text>
            </van-checkbox>
          </view> -->
        </view>
      </van-empty>
    </view>
    <view class="line"></view>
    <!-- 开通提示 -->
    <van-dialog
      :show="dialogShow"
      use-slot
      use-title-slot
      @confirm="modulesApplication()"
      confirmButtonText="提交申请"
      confirm-button-color="#1989fa"
      showCancelButton
      cancel-button-text="拨号联系"
      @cancel="
        makePhoneCall('13522846713');
        dialogShow = false;
      "
      :data-event="{ id: 'yfd1yAzJ1u', capture: false }"
    >
      <view slot="title" style="position: relative; padding: 0 14px">
        <text>功能开通申请表</text>
        <van-icon
          name="cross"
          @click="dialogShow = false"
          style="position: absolute; top: 4px; right: 10px"
          :data-event="{ id: 'K3M46MJN8x' }"
        />
      </view>
      <van-cell-group>
        <van-notice-bar text="请提交申请表单，或联系13522846713开通。" />
        <van-field
          label="申请人"
          :value="formData.name"
          placeholder="请输入"
          required
          data-key="name"
          @change="onFieldChange"
        />
        <van-field
          label="联系方式"
          :value="formData.phone"
          placeholder="请输入"
          required
          data-key="phone"
          @change="onFieldChange"
        />
        <van-cell title="想要了解的功能" :border="false" required />
        <van-checkbox-group
          :value="formData.modules"
          data-key="modules"
          @change="onFieldChange"
          class="c-checkbox-group-modules"
        >
          <van-checkbox
            v-for="(item, i) in options.modules"
            :key="i"
            :name="item.value"
            shape="square"
            class="c-checkbox"
          >
            {{ item.name }}
          </van-checkbox>
        </van-checkbox-group>
        <view style="height: 10px"></view>
      </van-cell-group>
    </van-dialog>
    <!-- 公告弹窗 App端无法获取顶部状态栏和导航栏高度，样式变更。 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-dialog
      width="90vw"
      use-slot
      use-title-slot
      :title="notice.dialog.title"
      :show="notice.dialog.show"
      confirm-button-color="#0078d0"
      :custom-style="
        'margin-top:' + (systemInfo.statusBarHeight + systemInfo.navHeight - 5) + 'px;'
      "
      :data-event="{ id: 'WLzRyvy2ET', capture: false }"
    >
      <view class="c-m-15 c-bold c-text-center">
        {{ notice.dialog.title }}
      </view>
      <view
        class="c-p-v-20"
        :style="
          'overflow: auto; height: calc(100vh - ' +
          (systemInfo.statusBarHeight + systemInfo.navHeight + 140) +
          'px)'
        "
      >
        <rich-text :nodes="notice.dialog.content"></rich-text>
      </view>
    </van-dialog>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <van-dialog
      key="notice-dialog"
      width="90vw"
      use-slot
      use-title-slot
      :title="notice.dialog.title"
      v-if="notice.dialog.show"
      :show="notice.dialog.show"
      @close="noticeClose()"
      confirm-button-color="#0078d0"
      custom-style="height:80vh;display:flex;flex-direction:column;"
      :data-event="{ id: 'qfiHJZkOvt', capture: false }"
    >
      <view class="c-m-15 c-bold c-text-center">
        {{ notice.dialog.title }}
      </view>
      <view class="c-p-v-20" style="flex: 1; overflow-y: auto">
        <rich-text
          v-if="notice.dialog.show"
          key="notice-rich"
          :nodes="notice.dialog.content"
        ></rich-text>
      </view>
    </van-dialog>
    <!-- #endif -->
    <!-- </movable-area> -->
    <van-dialog id="van-dialog" />
    <!-- 对已经超出预约时间12小时未填写提交勘察报告的工单对于符合条件的进行弹框提示 -->
    <!-- 通知弹窗 -->
    <van-overlay
      :show="messagePopup.outTimeNotify && currentRole._id == '8050029062726074247'"
      :lock-scroll="false"
    >
      <view class="out-of-time-notify-modal">
        <view class="overdue-notification-box">
          <van-icon
            @click="handleOutTimeNotify"
            name="close"
            size="22px"
            style="position: absolute; color: #fff; right: -20px; top: -20px; font-size: 22px"
            :data-event="{ id: 'i_DAD7G13R' }"
          />
          <view class="reminder-view">
            <image src="https://pub.fsgo365.cn/icon-reminder.png"></image>
          </view>
        </view>
        <view class="notification-list">
          <view class="top">
            <view class="triangle">
              <view class="triangle-small"></view>
            </view>
          </view>
          <view class="bottom">
            <view
              class="timeout-Msg"
              v-for="(item, index) in messagePopup.outTimeList"
              :key="index"
              @click="handleOpen(item._id)"
              :data-event="{ id: 'QTz8W1kTys' }"
            >
              <view class="left" :data-event="{ id: 'QTz8W1kTys' }">
                <view :data-event="{ id: 'QTz8W1kTys' }">
                  <van-icon name="notes-o" :data-event="{ id: 'QTz8W1kTys' }" />
                  {{ item.orderNum }}
                </view>

                <view :data-event="{ id: 'QTz8W1kTys' }">
                  <van-icon name="manager-o" :data-event="{ id: 'QTz8W1kTys' }" />
                  {{ item.name }}
                </view>

                <view :data-event="{ id: 'QTz8W1kTys' }">
                  <van-icon name="underway-o" :data-event="{ id: 'QTz8W1kTys' }" />
                  {{ item.exts.datetime }}
                </view>

                <view :data-event="{ id: 'QTz8W1kTys' }">
                  <van-icon name="location-o" :data-event="{ id: 'QTz8W1kTys' }" />
                  {{ item.address || null }}
                </view>
              </view>
              <view class="right" :data-event="{ id: 'QTz8W1kTys' }">
                <view style="width: 100%; text-align: center" :data-event="{ id: 'QTz8W1kTys' }">
                  <text style="color: red; font-size: 24rpx" :data-event="{ id: 'QTz8W1kTys' }">
                    已超时
                  </text>
                </view>
                <view class="Timeout" :data-event="{ id: 'QTz8W1kTys' }">
                  <block v-if="item.days > 0">
                    <text
                      class="timeout-text-large"
                      style="color: red"
                      :data-event="{ id: 'QTz8W1kTys' }"
                    >
                      {{ item.days }}
                    </text>
                    <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">天</text>
                    <text
                      class="timeout-text-large"
                      style="font-size: 36rpx"
                      :data-event="{ id: 'QTz8W1kTys' }"
                    >
                      {{ item.hours }}
                    </text>
                    <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">小时</text>
                  </block>
                  <block v-else-if="item.hours > 0">
                    <text class="timeout-text-large" :data-event="{ id: 'QTz8W1kTys' }">
                      {{ item.hours }}
                    </text>
                    <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">小时</text>
                    <text
                      class="timeout-text-large"
                      style="font-size: 36rpx"
                      :data-event="{ id: 'QTz8W1kTys' }"
                    >
                      {{ item.remainingMinutes }}
                    </text>
                    <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">分钟</text>
                  </block>
                  <block v-else>
                    <text class="timeout-text-large" :data-event="{ id: 'QTz8W1kTys' }">
                      {{ item.remainingMinutes }}
                    </text>
                    <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">分钟</text>
                  </block>
                </view>
                <view class="handle" :data-event="{ id: 'QTz8W1kTys' }">
                  <text style="color: #2c5bec; font-size: 24rpx" :data-event="{ id: 'QTz8W1kTys' }">
                    去处理
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="more">请填写勘查单或者修改预约时间</view>
      </view>
    </van-overlay>
    <Tabbar></Tabbar>
    <!-- #ifdef APP-PLUS -->
    <permission ref="permission" />
    <!-- #endif -->
  </view>
</template>

<script>
const app = getApp();
// import { mapState, mapMutations } from 'vuex';
var common = require('../../resources/js/common.js');
import Permission from '../../components/Permission/Permission.vue';
import watchPositionMixin from '../../resources/mixins/watchPositionMixin.js';
export default {
  components: {
    Permission
  },
  mixins: [watchPositionMixin],
  data() {
    return {
      loadType: '', // 进入页面的方式是onLoad,onShow，只有首次加载会有onLoad的状态。
      isLogined: false,
      downloadUrl: common.osg.downloadUrl,
      notice: {
        data: [],
        dialog: {
          show: false
        }
      },
      noticeIndex: 0,
      functionList: [],
      funtionCount: {},
      bannerHeight: '',
      options: {
        codecfg_modules: {
          codeId: 'modules'
        },
        modules: []
      },
      formData: {
        modules: []
      },
      dialogShow: false, //开通提示
      systemInfo: {
        menuButtonObject: {}
      },
      newMessageCount: 0, //未读消息数量
      currentRole: {}, //当前登录人数据
      supervisorData: {}, //指标数据
      supervisorTodoData: {}, //工作数据指标
      functionData: {
        functionList: []
      },
      messagePopup: {
        outTimeNotify: false, //是否显示超时提醒
        outTimeList: [] //超时数据列表
      },
      loginRead: false, //勾选隐私政策和用户协议
      push: {
        show: false
      },
      location: {
        show: false,
        checkOnShow: false // true：需要等设置完定位后再出发init请求
      },
      user: {} // 当前登录人
    };
  },
  // computed: {
  // 	...mapState(['moveLeft', 'moveTop'])
  // },
  watch: {
    functionList: {
      handler(newVal, oldVal) {
        // this.updateChildRefPosition();
      },
      immediate: true
    },
    isLogined: {
      handler(newVal, oldVal) {
        // this.updateChildRefPosition();
      },
      immediate: true
    }
  },
  onLoad(param) {
    this.loadType = 'onLoad';
    common.osg.init(this, param, app);

    // 赋值系统信息
    this.systemInfo = app.globalData.systemInfo;

    // 处理页面传参并缓存
    let url = decodeURIComponent(param.q);
    let params = url.split('?')[1];
    let obj = {};
    if (params) {
      let arr = params.split('&');
      for (let item of arr) {
        if (item.indexOf('=') != -1) {
          obj[item.split('=')[0]] = item.split('=')[1];
        }
      }
      wx.setStorageSync('indexParams', obj);
    }
  },
  async onShow() {
    common.osg.init(this, {}, app);
    this.loadType = 'onShow';
    if (!common.osg.isLogined()) {
      this.isLogined = false;
      this.notice.data = [];
      this.functionList = [];
      return;
    } else {
      this.isLogined = true;

      // 获取登录人信息，用于自动赋值“功能开通申请表单”
      this.user = wx.getStorageSync('user');
      // 获取登录人当前角色，用于展示特殊角色功能
      this.currentRole = wx.getStorageSync('currentRole') || {};

      //获取登录人当前角色导航菜单
      this.getCurrentFunction();

      this.$nextTick(() => {
        // #ifdef APP-PLUS
        // 检查授权管理，不授权不往后执行
        this.$refs.permission && this.$refs.permission.initPermissions();
        // #endif
        // App上架审核角色“管家App”角色，不弹窗
        if (
          this.currentRole._id != '7508867733715728438' &&
          this.currentRole._id != '101454081026144584'
        ) {
          // 获取当前定位，用于查询当前定位到工单地址的距离
          common.osg.getLocation(
            res => {
              app.globalData.location = res.latitude + ',' + res.longitude;
            },
            null,
            {
              doNotRemind: true
            }
          );
          // #ifdef APP-PLUS
          // 开启定位监听，用于自动打卡
          this.startWatchPosition();
          // #endif
        }
      });

      this.getNotice(); // 获取公告
      this.getSupervisor(); // 获取结果数据指标数据
      this.getSupervisorTodo(); // 获取工作数据指标数据

      // 管家 独有功能
      if (this.currentRole._id == '8050029062726074247') {
        this.getTimeoutWorkOrderList(); // 获取工单预约超时数据
      }
    }

    // this.$nextTick(() => {
    // 	// 执行依赖于组件创建完成的操作
    // 	// 比如调用某个方法或者访问组件的属性等
    // 	this.$refs.childRef.UpdateInitialPosition();
    // });
  },
  methods: {
    // ...mapMutations(['updatePreviousPageNavBarStatus']),
    //监听组件是否创建完成
    // updateChildRefPosition() {
    //   this.$nextTick(() => {
    //     if (this.$refs.childRef) {
    //       this.$refs.childRef.UpdateInitialPosition();
    //     }
    //   });
    // },
    // 统计待处理数据跳转
    reportNavigateTo(val) {
      // 待预约
      if (val == '105') {
        app.globalData.funcId =
          common.osg.host == 'https://xlinkbeta.fsgo365.cn'
            ? '353929779116097321'
            : '8747970992021850192';
        this.doOpen('/pages/serviceAppointment/serviceAppointments', {}, { mode: 'switchTab' });
      }
      // 待上门
      if (val == '202') {
        app.globalData.funcId =
          common.osg.host == 'https://xlinkbeta.fsgo365.cn'
            ? '934720456712829574'
            : '4687069102891155940';
        this.doOpen('/pages/serviceAppointment/serviceAppointments', {}, { mode: 'switchTab' });
      }
      // 待下单
      if (val == '203') {
        app.globalData.funcId =
          common.osg.host == 'https://xlinkbeta.fsgo365.cn'
            ? '8604958082658974659'
            : '8388049620398551543';
        this.doOpen('/pages/serviceAppointment/serviceAppointments', {}, { mode: 'switchTab' });
      }
      // 待签约
      if (val == '206') {
        app.globalData.funcId =
          common.osg.host == 'https://xlinkbeta.fsgo365.cn'
            ? '8917457374324240975'
            : '8847531276836519568';
        this.doOpen('/pages/serviceAppointment/serviceAppointments', {}, { mode: 'switchTab' });
      }
      // 不需要上门
      if (val == '201') {
        app.globalData.funcId =
          common.osg.host == 'https://xlinkbeta.fsgo365.cn'
            ? '3283578690134362002'
            : '5702987970254228365';
        this.doOpen('/pages/serviceAppointment/serviceAppointments', {}, { mode: 'switchTab' });
      }
      // 上门未成交
      if (val == '204') {
        app.globalData.funcId =
          common.osg.host == 'https://xlinkbeta.fsgo365.cn'
            ? '3958787214850408855'
            : '8634327071558186870';
        this.doOpen('/pages/serviceAppointment/serviceAppointments', {}, { mode: 'switchTab' });
      }
    },
    doOpen(path, data, options) {
      common.osg.open(path, data, options);
    },
    // 获取公告
    getNotice: function () {
      let params = {
        page: 1,
        rows: 10,
        'is:type|integer#and': 3,
        'is:exts.chooseApplet|string#and': '1',
        sortField: 'isTop,createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax(
        'document/query',
        params,
        res => {
          wx.stopPullDownRefresh();
          // 赋值全部公告
          this.notice.data = res.data || [];
          // 置顶公告弹窗
          let topNotices = res.data.filter(item => item.isTop == '1' && item.content); // 查找置顶公告
          if (app.globalData.readNotice || topNotices.length == 0) return; // 已读或无置顶公告return
          this.notice.dialog = topNotices[0];
          this.notice.dialog.content = this.notice.dialog.content.replace(
            /<img /g,
            '<img style="max-width:100%" '
          ); // 防止图片过宽展示不全
          this.notice.dialog.content = `<div class="ql-editor">${this.notice.dialog.content}</div>`; //去掉image
          this.notice.dialog.show = true; // 弹出弹窗
          app.globalData.readNotice = '1'; // 标记为已读
        },
        {
          noload: true
        }
      );
    },
    // 查看公告
    toNotice(item) {
      if (item.path) {
        common.osg.open(item.path, {
          documentId: item._id
        });
      } else if (item._id) {
        common.osg.open('../../subpackages/noticeManage/detail', {
          id: item._id
        });
      }
    },
    // 获取当前角色菜单
    getCurrentFunction() {
      let currentRoleFunctions = wx.getStorageSync('currentRoleFunctions');
      if (currentRoleFunctions && currentRoleFunctions.length != 0) {
        this.functionList = currentRoleFunctions;
      }
    },
    gridClick(func) {
      app.globalData.funcId = func._id; // 工单列表激活当前菜单页签
      common.osg.md({
        path: func.order
      });

      if (!func.action) {
        if (func.name == '云店铺') {
          common.osg.open('/subpackages/partner/partnerApplication');
        } else {
          if (this.options.modules.length == 0) {
            common.osg.codeoption(() => {
              this.$forceUpdate();
            });
          }
          let user = wx.getStorageSync('user');
          this.formData.name = user.name;
          this.formData.phone = user.phone;
          this.formData.modules = [func.name];
          this.dialogShow = true;
        }
      } else if (
        (func.action && func.action.indexOf('/menu/menu') != -1) ||
        (func.action && func.action.indexOf('/menu/storeMenu') != -1)
      ) {
        // 缓存二级菜单
        wx.setStorageSync('menu', func);
      }
    },
    scan(func) {
      common.osg.scanCode(code => {
        common.osg.ajax(
          '/basic/qrcode/scan',
          {
            param: code.result
          },
          res => {
            common.osg.open(
              func.action,
              {
                id: res.data._id
              },
              {
                mode: func.openType.split('-')[1]
              }
            );
          },
          {
            noload: true
          }
        );
      });
    },
    onPullDownRefresh: function () {
      if (!this.isLogined) return;
      this.getNotice(); //全部
    },
    // 获取banner高度
    getHeight(e) {
      //获取可使用窗口宽度
      var width = this.systemInfo.windowWidth;
      //获取图片实际高度
      var imgheight = e.detail.height;
      //获取图片实际宽度
      var imgwidth = e.detail.width;
      //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      var height = (width * imgheight) / imgwidth;
      // if (height >= 200) height = 200;
      height += 'px';
      this.bannerHeight = height;
    },
    makePhoneCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    onFieldChange(e) {
      let key = e.target.dataset.key;
      this.formData[key] = e.detail;
    },
    // 开通模块申请
    modulesApplication() {
      if (!this.formData.name) {
        common.osg.toast('请填写申请人');
        return;
      }
      if (!this.formData.phone) {
        common.osg.toast('请填写联系方式');
        return;
      }
      if (this.formData.modules.length == 0) {
        common.osg.toast('请至少勾选1个功能');
        return;
      }
      this.formData.state = 1;
      this.formData.status = '1'; // 待处理
      common.osg.ajax(
        'biz/extForm/upsert/2740509195179410307',
        {
          dataStr: JSON.stringify(this.formData)
        },
        () => {
          common.osg.alert('提交成功！', () => {
            this.dialogShow = false;
          });
        },
        {
          noload: true
        }
      );
    },
    //获取工单预约超时列表
    getTimeoutWorkOrderList() {
      common.osg.ajax(
        '/basic/serviceAppointment/surveyTimeoutQuery',
        {},
        ({ data }) => {
          data.map(item => {
            item.days = Math.floor(item.exts.surveyTimeout / 1440);
            item.hours = Math.floor((item.exts.surveyTimeout % 1440) / 60);
            item.remainingMinutes = item.exts.surveyTimeout % 60;
          });
          this.messagePopup.outTimeList = data;
          this.messagePopup.outTimeNotify = data.length > 0;
        },
        {
          noload: true
        }
      );
    },
    // 超时提醒关闭窗口   埋点
    handleOutTimeNotify() {
      this.messagePopup.outTimeNotify = false;
      const { name, orgName } = wx.getStorageSync('user');
      common.osg.md({
        act: 'timeoutReminder_close',
        supervisorName: name,
        orgName: orgName
      });
    },
    //超时提醒点击去处理   埋点
    handleOpen(id) {
      this.doOpen('/subpackages/serviceAppointment/serviceAppointment', { id });
      const { name, orgName } = wx.getStorageSync('user');
      common.osg.md({
        act: 'timeoutReminder_handle',
        supervisorName: name,
        orgName: orgName
      });
    },
    // 管家驾驶舱-管家关键结果数据指标区域
    getSupervisor() {
      common.osg.ajax(
        '/biz/cc/supervisor',
        {},
        res => {
          this.supervisorData = res.data;
        },
        {
          noload: true
        }
      );
    },
    // 管家驾驶舱-管家待做工作数据指标区域（6个指标）
    getSupervisorTodo() {
      common.osg.ajax(
        '/biz/cc/supervisorTodo',
        {},
        res => {
          // res.data.paid = parseInt(res.paid);
          this.supervisorTodoData = res.data;
        },
        {
          noload: true
        }
      );
    },
    loginReadChange(e) {
      this.loginRead = e.detail;
    },
    onHide() {
      //当前页面是否有导航栏
      //   this.updatePreviousPageNavBarStatus(false);
      clearInterval(this.timer);
    },
    onUnload() {
      clearInterval(this.timer);
    },
    noticeClose() {
      this.notice.dialog.show = false;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss">
page {
  background: #fff;
}
/* 宫格内文字样式 */
.van-grid-item__text {
  font-size: 12px !important;
  margin-top: 20rpx;
}

.index {
  min-height: 100vh;
  background: #f7f8fa;
  .c-notice-bar {
    padding: 0 10px;
    height: 50px;
    background: #fff;
    border-radius: 15px 15px 0 0;
    margin-top: -15px;
    position: relative;
    .van-notice-bar__left-icon {
      margin-right: 10px;
    }
    .c-notice-bar__right-icon {
      margin-left: 10px;
    }
  }
  .c-checkbox-group-modules {
    .van-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      padding-left: 6px;
      .c-checkbox {
        margin: 10px;
      }
    }
  }
  .c-grid-item-content {
    padding: 10px 8px;
    .van-grid-item__icon {
      width: 60px;
      height: 60px;
      position: relative;
      justify-content: center;
      // 缩放解决真机1rpx太粗的问题
      &::after {
        position: absolute;
        content: '';
        border: 2rpx solid #967c7c;
        border-radius: 50%;
        width: 200%;
        height: 200%;
        top: 0;
        left: 0;
        transform: scale(0.5);
        transform-origin: 0 0;
        opacity: 0.9;
      }
      .van-icon__image {
        border-radius: 50%;
      }
      .van-icon--image {
        width: 60px;
        height: 60px;
      }
    }
    .van-grid-item__text {
      font-size: 14px !important;
      line-height: 20px;
      color: #666 !important;
      opacity: 0.8;
    }
  }
  .c-banner-bottom {
    margin: 0px 10px 10px;
    width: calc(100% - 20px) !important;
    box-sizing: border-box;
  }
  .line-top {
    width: calc(100vw - 36px);
    margin: 0 18px 15px;
    position: relative;
    // 缩放解决真机1rpx太粗的问题
    &::after {
      position: absolute;
      content: '';
      border: 2rpx solid #efefef;
      width: 200%;
      height: 200%;
      top: 0;
      left: 0;
      transform: scale(0.5);
      transform-origin: 0 0;
      opacity: 0.99;
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
.housekeepReport {
  background: #fff;
  margin: 10px;
  border-radius: 8px;
  display: flex;
  .HRFirstBlok {
    margin: 10px;
    width: 35%;
    background: #106cff;
    border-radius: 8px;
    text-align: center;
    // line-height: 100px;
    > view:first-child {
      margin-top: 6px;
      > view:first-child {
        font-size: 14px;
        font-weight: 400;
        color: #d9d9d9;
      }
      > view:nth-child(2) {
        font-size: 50px;
        color: #fff;
      }
      > view:last-child {
        font-size: 14px;
        font-weight: 400;
        color: #d9d9d9;
      }
    }
  }
  .HRLastBlok {
    width: 60%;
    padding: 12px 10px 10px 10px;
    // padding: 10px;
    .statisticsBlok1 {
      display: flex;
      justify-content: space-around;
      text-align: center;
      .statisticsTitle {
        color: #6d6d6d;
        font-size: 12px;
        font-weight: 500;
      }
      .statisticsNumber {
        font-size: 30px;
        color: #000;
        // font-weight: 600;
      }
    }
    .statisticsBlok2 {
      color: #a0a0a0;
      font-size: 12px;
      font-weight: 500;
      padding-left: 10px;
    }
  }
  ::v-deep .van-divider {
    margin: 10px 0 !important;
  }
}
.van-grid {
  background: #fff;
  border-radius: 8px;
  background: #fff;
  margin: 10px;
}
.housekeepReport2 {
  background: #fff;
  margin: 10px;
  border-radius: 8px;
  .title {
    font-size: 16px;
    font-weight: 500;
    padding: 10px;
  }
  .block1 {
    padding: 0 6px;
    display: flex;
    justify-content: space-around;
    .square {
      background: #f0f0f0;
      text-align: center;
      border-radius: 8px;
      width: 23%;
      .number {
        font-size: 30px;
        color: #000;
        // font-weight: 600;
        margin-top: 10px;
      }
      .state {
        color: #6d6d6d;
        font-size: 12px;
        margin-bottom: 10px;
      }
    }
  }
  .block2 {
    display: flex;
    justify-content: space-around;
    padding: 10px 6px;
    .square2 {
      background: #fff;
      border-radius: 8px;
      border: 1px solid #eeecec;
      text-align: center;
      width: 22%;
      .number {
        font-size: 30px;
        color: #000;
        // font-weight: 600;
        margin-top: 10px;
      }
      .state {
        color: #6d6d6d;
        font-size: 12px;
        margin-bottom: 10px;
      }
    }
    .rectangle {
      background: #ffd700;
      border-radius: 8px;
      text-align: center;
      width: 48%;
      .number {
        font-size: 30px;
        color: #000;
        // font-weight: 600;
        margin-top: 10px;
      }
      .rectangleState {
        color: #6d6d6d;
        font-size: 12px;
        margin-bottom: 10px;
      }
    }
  }
}
.housekeepReport3 {
  background: #fff;
  margin: 10px;
  border-radius: 8px;
  .title {
    font-size: 16px;
    font-weight: 500;
    padding: 10px;
  }
  .housekeepReport3Block {
    display: flex;
    justify-content: space-around;
    .block1 {
      width: 40%;
      .weelBlock {
        padding-left: 20px;
      }
      .week {
        font-size: 14px;
        color: #106cff;
        font-weight: 300;
      }
      .number {
        font-size: 30px;
        color: #000;
        // font-weight: 600;
      }
      .todayEvent {
        .block2Remark {
          display: flex;

          margin: 5px 0;
          .block2RemarkLeft {
            background: #ffd700;
            width: 5px;
            margin-right: 3px;
            border-radius: 8px;
          }
          .block2RemarkOther {
            color: #a0a0a0;
            font-size: 12px;
            font-weight: 500;
          }
          .block2RemarkRight {
            background: #f6e592;
            width: 100%;
            border-radius: 4px;
            padding: 5px;
            .block2Address {
              color: #000;
              font-size: 12px;
              // font-weight: 600;
            }
            .block2Time {
              color: #000;
              font-size: 12px;
            }
          }
        }
      }
      .weelBlock2 {
        padding: 30px 0 40px 20px;
        .None {
          color: #a0a0a0;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .block2 {
      width: 40%;
      padding-bottom: 5px;
      .block2Date {
        color: #a0a0a0;
        font-size: 11px;
        font-weight: 500;
      }
      .block2Remark {
        display: flex;

        margin: 5px 0;
        .block2RemarkLeft {
          background: #ffd700;
          width: 5px;
          margin-right: 3px;
          border-radius: 8px;
        }
        .block2RemarkOther {
          color: #a0a0a0;
          font-size: 11px;
          font-weight: 500;
        }
        .block2RemarkRight {
          background: #f6e592;
          width: 100%;
          border-radius: 4px;
          padding: 5px;
          .block2Address {
            color: #000;
            font-size: 11px;
            font-weight: 600;
          }
          .block2Time {
            color: #000;
            font-size: 10px;
          }
        }
      }
    }
  }
}
.levitateBall {
  border-radius: 1em;

  width: 30px;
  height: 30px;
  // background-color: #f03a23;
  z-index: 99;
}

.out-of-time-notify-modal {
  width: 85vw;
  height: auto;
  max-height: 60vh;
  border-radius: 0.5em;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  background: linear-gradient(#3b66e0, #6589e7);
  .overdue-notification-box {
    position: relative;
    min-height: 140rpx;
    width: 100%;
    border-radius: 10px 10px 0px 0px;
    .reminder-view {
      width: 180rpx;
      height: 180rpx;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -40%);
      border-radius: 50%;
      background-color: aliceblue;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .notification-list {
    max-height: calc(60vh - (140rpx + 100rpx));
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10px 10px 0px 0px;
    .top {
      position: relative;
      .triangle {
        width: 10px;
        height: 10px;
        box-sizing: border-box;
        border-left: 10px solid #5376db;
        border-bottom: 10px solid #5376db;
        border-top: 10px solid transparent;
        border-right: 10px solid transparent;
        transform: rotate(-45deg);
        position: absolute;
        top: -10px;
        left: calc(50% - 10px);
        border-radius: 0 0 0 5px;
        .triangle-small {
          width: 6px;
          height: 6px;
          box-sizing: border-box;
          border-left: 6px solid #0f193b;
          border-bottom: 6px solid #0f193b;
          border-top: 6px solid transparent;
          border-right: 6px solid transparent;
          position: absolute;
          top: -6px;
          left: calc(50% - 6px);
          border-radius: 3px;
        }
      }
    }
    .bottom {
      flex: 1;
      padding: 0px 10px;
      overflow-y: scroll;
      .timeout-Msg {
        display: flex;
        padding: 20rpx 16rpx;
        margin: 10px 0px;
        border-radius: 10px;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
        .left {
          flex: 2;
          font-size: 28rpx;
          height: 170rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          color: #646566;
          overflow: hidden;
          .van-icon {
            margin-right: 16rpx;
          }
          view {
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f6f6f6;
          position: relative;
          border-radius: 10px;
          .Timeout {
            .timeout-text-large {
              font-size: 40rpx;
              font-weight: bolder;
            }

            .timeout-text-small {
              font-size: 20rpx;
              margin: 0px 6rpx;
            }
          }
        }
      }
    }
    .bottom::-webkit-scrollbar {
      display: none;
    }
  }
  .more {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    min-height: 80rpx;
    color: #2c5bec;
    background-color: #fff;
    border-radius: 0px 0px 10px 10px;
  }
}

// 弹出层居中
.van-popup--center {
  top: 50% !important;
}

// 权限管理弹出层列表
.popup-cards {
  .popup-card {
    padding: 10px 0;
    margin: 15px;
    border: 1px solid #ebedf0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    .popup-card-left {
      width: 40px;
      text-align: center;
    }
    .popup-card-center {
      flex: 1;
      .popup-card-title {
        font-weight: 700;
        margin-bottom: 5px;
      }
      .popup-card-content {
        font-size: 14px;
        columns: #646566;
      }
    }
    .popup-card-right {
      width: 80px;
    }
  }
}
</style>
