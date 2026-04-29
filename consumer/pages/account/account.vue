<template>
  <view class="account">
    <view
      :style="
        'position:absolute;z-index:1;top:' +
        (systemInfo.statusBarHeight + 2) +
        'px;left:' +
        (systemInfo.menuButtonObject.left - 70) +
        'px;height:' +
        systemInfo.navHeight +
        'px;line-height:' +
        systemInfo.navHeight +
        'px;color:#fff;display:flex;align-items:center;font-weight:500;position: fixed;'
      "
    >
      <view @click="open('../../subpackages/user/userInfo')">
        <uni-icons type="gear" size="22" />
      </view>
    </view>
    <view>
      <view class="user-info">
        <view>
          <image
            :src="userInfo.avatar || 'https://pub.fsgo365.cn/littlesix.png'"
            style="width: 85px; height: 85px; border-radius: 50%; display: flex"
            mode="widthFix"
          />
          <view class="text">
            <view class="name">
              {{ userInfo.nickname || userInfo.name }}
              <text v-if="userInfo.phone" class="c-m-l-10">{{ userInfo.phone }}</text>
            </view>
          </view>
        </view>

        <button
          v-if="isLogined && !userInfo.phone"
          class="icon-button"
          style="background-color: #f3f3f3 !important"
          plain
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          授权手机号
        </button>
        <!-- <button
          v-if="isLogined && userInfo.phone"
          color="#F3F3F3"
          class="icon-button"
          style="background-color: #f3f3f3 !important"
          plain
          open-type="getPhoneNumber"
          @getphonenumber="changePhoneNumber"
          custom-class="c-black"
        >
          修改手机号
        </button> -->
      </view>
      <view class="order" v-if="!userInfo.phone || sa._id">
        <view class="service-top">
          <view style="flex: 1; font-size: 14px; font-weight: 600; margin-right: 5px">
            {{ sa.address || '' }}
          </view>
          <view
            v-if="userInfo.phone"
            class="c-uni-button text"
            @click="open('../../subpackages/serviceAppointment/serviceAppointments')"
          >
            <text>查看全部工单</text>
            <uni-icons type="right" color="#666666" size="12"></uni-icons>
          </view>
          <button
            v-else
            class="c-uni-button round small default"
            plain
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            <image
              src="../../static/images/click.png"
              style="width: 12px; height: 12px; margin-right: 5px"
            />
            <text>授权手机号查看</text>
          </button>
        </view>
        <view
          v-if="ordersBjProducts.length > 0"
          style="color: #999999; font-size: 10px; margin: 5px"
        >
          {{
            codelabel(
              'parts',
              ordersBjProducts.orderList && ordersBjProducts.orderList[0].repairParts[0],
              'cascade'
            )
          }}
          {{ ordersBjProducts.orderList[0].maintainAreaNum }}㎡
        </view>
        <view class="content" v-if="userInfo.phone">
          <view class="progress">
            <!-- 待上门 -->
            <view class="progress-item" style="flex: none">
              <view class="progress-icon">
                <view
                  class="progress-center"
                  :class="Number(sa.status) <= 202 ? 'progress-center-white' : ''"
                ></view>
              </view>
            </view>
            <!-- 待签约 -->
            <view class="progress-item">
              <view class="progress-icon">
                <view
                  class="progress-line"
                  :class="
                    Number(sa.status) == 206
                      ? 'progress-line-doing'
                      : Number(sa.status) < 205
                      ? 'progress-line-todo'
                      : 'progress-line-done'
                  "
                ></view>
                <view
                  class="progress-center"
                  :class="
                    Number(sa.status) == 206 || Number(sa.status) < 205
                      ? 'progress-center-white'
                      : ''
                  "
                ></view>
              </view>
            </view>
            <!-- 待支付 -->
            <view class="progress-item">
              <view class="progress-icon">
                <view
                  class="progress-line"
                  :class="
                    Number(sa.status) == 205
                      ? 'progress-line-doing'
                      : Number(sa.status) == 206 || Number(sa.status) < 205
                      ? 'progress-line-todo'
                      : 'progress-line-done'
                  "
                ></view>
                <view
                  class="progress-center"
                  :class="Number(sa.status) <= 206 ? 'progress-center-white' : ''"
                ></view>
              </view>
            </view>
            <!-- 施工中 -->
            <view class="progress-item">
              <view class="progress-icon">
                <view
                  class="progress-line"
                  :class="
                    Number(sa.status) == 302
                      ? 'progress-line-doing'
                      : Number(sa.status) < 302
                      ? 'progress-line-todo'
                      : 'progress-line-done'
                  "
                ></view>
                <view
                  class="progress-center"
                  :class="Number(sa.status) < 302 ? 'progress-center-white' : ''"
                ></view>
              </view>
            </view>
            <!-- 待验收 -->
            <view class="progress-item">
              <view class="progress-icon">
                <view
                  class="progress-line"
                  :class="
                    Number(sa.status) == 401
                      ? 'progress-line-doing'
                      : Number(sa.status) < 401
                      ? 'progress-line-todo'
                      : 'progress-line-done'
                  "
                ></view>
                <view
                  class="progress-center"
                  :class="Number(sa.status) < 401 ? 'progress-center-white' : ''"
                ></view>
              </view>
            </view>
            <!-- 待完工 -->
            <view class="progress-item">
              <view class="progress-icon">
                <view
                  class="progress-line"
                  :class="
                    Number(sa.status) == 402
                      ? 'progress-line-doing'
                      : Number(sa.status) < 402
                      ? 'progress-line-todo'
                      : 'progress-line-done'
                  "
                ></view>
                <view
                  class="progress-center"
                  :class="Number(sa.status) <= 402 ? 'progress-center-white' : ''"
                ></view>
              </view>
            </view>
            <!-- 待评价 -->
            <view class="progress-item">
              <view class="progress-icon">
                <view
                  class="progress-line"
                  :class="
                    Number(sa.status) == 403 || Number(sa.status) == 407
                      ? 'progress-line-doing'
                      : Number(sa.status) < 403
                      ? 'progress-line-todo'
                      : 'progress-line-done'
                  "
                ></view>
                <view
                  class="progress-center"
                  :class="Number(sa.status) < 502 ? 'progress-center-white' : ''"
                ></view>
              </view>
            </view>
          </view>
          <view class="progress-text">
            <text
              :class="
                Number(sa.status) == 202
                  ? 'progress-text-doing'
                  : Number(sa.status) < 202
                  ? 'progress-text-todo'
                  : 'progress-text-done'
              "
            >
              {{ Number(sa.status) <= 202 ? '待上门' : '已上门' }}
            </text>
            <text
              :class="
                Number(sa.status) == 206
                  ? 'progress-text-doing'
                  : Number(sa.status) < 205
                  ? 'progress-text-todo'
                  : 'progress-text-done'
              "
            >
              {{ Number(sa.status) == 206 || Number(sa.status) < 205 ? '待签约' : '已签约' }}
            </text>
            <text
              :class="
                Number(sa.status) == 205
                  ? 'progress-text-doing'
                  : Number(sa.status) == 206 || Number(sa.status) < 205
                  ? 'progress-text-todo'
                  : 'progress-text-done'
              "
            >
              {{ Number(sa.status) <= 206 ? '待付款' : '已付款' }}
            </text>
            <text
              :class="
                Number(sa.status) == 302
                  ? 'progress-text-doing'
                  : Number(sa.status) < 302
                  ? 'progress-text-todo'
                  : 'progress-text-done'
              "
            >
              {{
                Number(sa.status) < 302 ? '待施工' : Number(sa.status) == 302 ? '施工中' : '已施工'
              }}
            </text>
            <text
              :class="
                Number(sa.status) == 401
                  ? 'progress-text-doing'
                  : Number(sa.status) < 401
                  ? 'progress-text-todo'
                  : 'progress-text-done'
              "
            >
              {{ Number(sa.status) <= 401 ? '待验收' : '已验收' }}
            </text>
            <text
              :class="
                Number(sa.status) == 402
                  ? 'progress-text-doing'
                  : Number(sa.status) < 402
                  ? 'progress-text-todo'
                  : 'progress-text-done'
              "
            >
              {{ Number(sa.status) <= 402 ? '待完工' : '已完工' }}
            </text>
            <text
              :class="
                Number(sa.status) == 403 || Number(sa.status) == 407
                  ? 'progress-text-doing'
                  : Number(sa.status) < 403
                  ? 'progress-text-todo'
                  : 'progress-text-done'
              "
            >
              {{ Number(sa.status) < 502 ? '待评价' : '已评价' }}
            </text>
          </view>
          <view class="buttons">
            <view
              class="c-flex c-flex-center"
              v-if="sa.status == '205' || sa.status == '407'"
              @click="toPay"
            >
              <image
                src="../../static/images/click.png"
                style="width: 10px; height: 10px; margin-right: 3px"
              />
              <text>去支付</text>
            </view>
            <view
              class="c-flex c-flex-center"
              v-if="sa.exts.supervisorName && sa.exts.supervisorPhone"
              @click="$refs.serviceTeamPopup.open()"
            >
              <image
                src="../../static/images/click.png"
                style="width: 10px; height: 10px; margin-right: 3px"
              />
              <text>服务团队</text>
            </view>
            <view
              class="c-flex c-flex-center"
              v-if="sa.exts.moKanNum && Number(sa.status) > 103 && Number(sa.status) < 403"
              @click="toMoKanDetail(sa)"
            >
              <image
                src="../../static/images/click.png"
                style="width: 10px; height: 10px; margin-right: 3px"
              />
              <text>施工视频</text>
            </view>
            <view
              class="c-flex c-flex-center"
              v-if="surveys.length > 0"
              :data-filename="surveys[0].surveyPDFUrl"
              @click="surveyClick"
            >
              <image
                src="../../static/images/click.png"
                style="width: 10px; height: 10px; margin-right: 3px"
              />
              <text>勘察报告</text>
            </view>
            <view
              class="c-flex c-flex-center"
              v-if="
                Number(sa.status) == 403 || Number(sa.status) == 407 || Number(sa.status) == 501
              "
              @click="toEvaluate(sa)"
            >
              <image
                src="../../static/images/click.png"
                style="width: 10px; height: 10px; margin-right: 3px"
              />
              <text>去评价</text>
            </view>
          </view>
        </view>
        <!-- 服务团队 -->
        <uni-popup ref="serviceTeamPopup" type="dialog">
          <uni-popup-dialog
            ref="serviceTeamDialog"
            title="服务团队"
            :showClose="false"
            type="info"
            @confirm="$refs.serviceTeamPopup.close()"
          >
            <view style="width: 100%">
              <view
                class="c-flex c-item-center c-flex-between"
                style="background: #f6f8fe; border-radius: 8px; padding: 10px 15px"
              >
                <view>
                  <view class="c-flex c-item-center">
                    <text>{{ sa.exts.supervisorName }}</text>
                  </view>
                  <view class="c-flex c-item-center">
                    <uni-tag
                      text="管家"
                      type="primary"
                      size="mini"
                      custom-style="background-color: #F9DE55; border-color: #F9DE55;margin-right:5px;"
                    />
                    <uni-rate readonly :value="5" color="#eee" active-color="#F9DE55" />
                  </view>
                </view>
                <view class="phone-button" @click="makeCall(sa.exts.supervisorPhone)">
                  <image
                    src="../../static/images/phone.png"
                    style="width: 15px; display: flex"
                    mode="widthFix"
                  ></image>
                </view>
              </view>
              <view
                class="c-flex c-item-center c-flex-between"
                style="
                  background: #f6f8fe;
                  border-radius: 8px;
                  padding: 10px 15px;
                  margin-top: 10px;
                "
                v-if="sa.exts.headmanName && sa.exts.headmanPhone"
              >
                <view>
                  <view class="c-flex c-item-center">
                    <text>{{ sa.exts.headmanName }}</text>
                  </view>
                  <view class="c-flex c-item-center">
                    <view class="c-flex c-item-center">
                      <uni-tag
                        text="工队"
                        type="primary"
                        size="mini"
                        custom-style="background-color: #F9DE55; border-color: #F9DE55;margin-right:10px;"
                      />
                      <uni-rate readonly :value="5" color="#eee" active-color="#F9DE55" />
                    </view>
                  </view>
                </view>
                <view class="phone-button" @click="makeCall(sa.exts.headmanPhone)">
                  <image
                    src="../../static/images/phone.png"
                    style="width: 15px; display: flex"
                    mode="widthFix"
                  ></image>
                </view>
              </view>
            </view>
          </uni-popup-dialog>
        </uni-popup>
      </view>
      <block v-for="(item, i) in orders" :key="i">
        <view
          v-if="
            [1, 2, 3, -1].indexOf(item.processState) != -1 &&
            (item.payState == 0 || item.payState == 2)
          "
          class="progress-pay"
          style="margin: 10px 15px"
        >
          <view class="c-flex c-item-center c-flex-between c-m-b-20">
            <view>
              <text class="c-size-14">在线支付：</text>
              <text class="c-red c-bold">
                ¥{{ (item.totalPrice - item.paidAmount).toFixed(2) }}
              </text>
            </view>
            <button
              class="icon-button"
              style="background-color: #f3f3f3 !important"
              plain
              @click="open('../../subpackages/order/pay', { orderId: item._id })"
            >
              去支付
            </button>
          </view>
          <view class="c-flex c-item-center c-hidden" style="border-radius: 8px">
            <view
              v-if="item.paidAmount"
              class="c-size-12 c-text-center c-white-space-nowrap"
              style="color: #000; background: #b6b6b6; padding: 0 3px; min-width: 110px"
              :style="'width:' + (item.paidAmount / item.totalPrice) * 100 + '%'"
            >
              已付：¥{{ item.paidAmount }}
            </view>
            <view
              v-if="item.paidAmount != item.totalPrice"
              class="c-size-12 c-text-center c-white-space-nowrap"
              style="color: #000; flex: 1; background: #f7f7f7; padding: 5px"
            >
              总额：¥{{ item.totalPrice }}
            </view>
          </view>
        </view>
      </block>
      <!-- 档案管理 -->
      <view style="display: flex; margin: 10px 15px 0px 15px">
        <view class="file" style="margin-right: 10px">
          <view class="file-title">分享管理</view>
          <view class="file-content">可提现</view>
          <view style="display: flex; align-items: center">
            <view class="file-number">{{ (myIncomeData.surplus || 0) / 100 }}</view>
            <view class="file-unit">元</view>
          </view>
          <view style="text-align: -webkit-center; margin-top: 25px; margin-left: -5px">
            <view class="file-button" @click="open('../../subpackages/income/myRewards')">
              去提现
            </view>
          </view>
        </view>
        <view class="file">
          <view class="file-title">项目档案</view>
          <view class="file-content">档案袋</view>
          <view style="text-align: -webkit-center; margin-top: 55px; margin-left: -5px">
            <view @click="open('../../subpackages/serviceAppointment/files')" class="file-button">
              去查看
            </view>
          </view>
        </view>
      </view>
      <view class="c-cell-group">
        <view class="c-cell" @click="open('../../subpackages/coupon/my', {}, 'auth')">
          <text>我的卡券</text>
          <uni-icons type="right" color="#969799"></uni-icons>
        </view>
        <view class="c-cell" @click="open('../../subpackages/order/orders', {}, 'auth')">
          <text>我的订单</text>
          <uni-icons type="right" color="#969799"></uni-icons>
        </view>
        <view
          class="c-cell"
          @click="open('../../subpackages/contract/AcceptanceForm', { type: 1 }, 'auth')"
        >
          <text>确认验收</text>
          <uni-icons type="right" color="#969799"></uni-icons>
        </view>
        <!-- <view class="c-cell">
          <text>建议反馈</text>
          <uni-icons type="right" color="#969799"></uni-icons>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
var areajs = require('../../common/area.js');
export default {
  data() {
    return {
      systemInfo: {
        menuButtonObject: {}
      },
      isLogined: false, // 是否已登录
      // 用户信息
      userInfo: {
        avatar: '',
        nickname: '',
        name: '',
        phone: ''
      },
      couponTotal: 0,
      surveyTotal: 0,
      warrantyTotal: 0,
      sa: { exts: {} },
      areaList: Object.assign({}, areajs.default),
      surveys: [],
      orders: [],
      ordersBjProducts: {},
      contracts: [],
      warranties: [],
      options: {
        cascadeCode_parts: { codeId: 'parts' },
        codecfg_unit: { codeId: 'UNIT' },
        codecfg_serviceType: { codeId: 'serviceType' }
      },
      wares: [],
      myIncomeData: {}
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    common.osg.doLogin({}, () => {
      this.isLogined = true;
      this.$set(this, 'userInfo', wx.getStorageSync('user'));
      if (this.userInfo.phone) {
        common.osg.codeoption(() => {});
        this.getServiceAppointments();
        this.getSurveyTotal();
        this.getWarrantyTotal();
        this.getMyIncome();
      }
    });
  },
  onShow(params) {
    // 通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
    if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
      this.$mp.page.getTabBar().setData({
        active: process.env.UNI_PLATFORM === 'mp-weixin' ? 4 : 3
      });
    }

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
      this.userInfo = wx.getStorageSync('user');
      if (this.userInfo.phone) {
        this.getServiceAppointments();
        this.getCouponTotal();
      }
    }
  },
  methods: {
    open(path, data, auth) {
      if (auth == 'auth' && !this.userInfo.phone) {
        common.osg.toast('请先授权手机号！', 'none');
        return;
      }
      common.osg.open(path, data);
    },
    toast() {
      common.osg.toast('暂未开通', 'none');
    },
    // 查询专属管家
    getMyHousekeeper() {
      common.osg.ajax('basic/serviceAppointment/query', {}, res => {
        let housekeeperId = '';
        for (let i = 0; i < res.length; i++) {
          if (res[i].exts.supervisorId) {
            housekeeperId = res[i].exts.supervisorId;
            common.osg.open('../../subpackages/housekeeper/myHousekeeper', { id: housekeeperId });
            return;
          }
        }
        common.osg.toast('您目前还没有专属管家', 'none');
      });
    },
    /**
     * 微信授权手机号登录
     */
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.$set(this, 'userInfo', user);
        this.getServiceAppointments();
        this.getSurveyTotal();
        this.getWarrantyTotal();
        this.getCouponTotal();
      });
    },
    /**
     * 微信修改手机号登录
     */
    changePhoneNumber(e) {
      common.osg.changePhoneNumber(e, user => {
        this.$set(this, 'userInfo', res.data.user);
        this.getServiceAppointments();
        this.getSurveyTotal();
        this.getWarrantyTotal();
        this.getCouponTotal();
      });
    },
    // 查询最新工单
    getServiceAppointments() {
      common.osg.ajax(
        'basic/serviceAppointment/query',
        {
          page: 1,
          rows: 1,
          sortField: 'updateTime',
          sortOrder: 'desc'
          // 'is:state|integer#and': 1
        },
        res => {
          this.sa = res.data[0] || { exts: {} };
          // if (res.data[0]) {
          //   let sa = res.data[0];
          //   let nodes = [];
          //   let defNodes = sa.workflow.def.nodes;
          //   let runNodes = sa.workflowNodeList.filter(
          //     node => node.nodeId != '0' && (node.state == 1 || node.state == 10)
          //   );
          //   for (let i = 0; i < defNodes.length; i++) {
          //     nodes.push(runNodes[i] || { nodeDef: defNodes[i] });
          //   }
          //   this.nodes = nodes;
          // } else {
          //   this.sa = {exts:{}};
          //   this.nodes = [];
          // }
          // 勘查中或已勘察时查询勘察单数量
          if (Number(this.sa.status) >= 202) {
            this.surveys = [];
            this.getSurveys();
            this.getOrders();
          } else {
            this.surveys = [];
            this.orders = [];
          }
          // 查询合同
          if (Number(this.sa.status) >= 205) {
            this.getContracts();
          }
          // 查质保
          if (Number(this.sa.status) >= 403) {
            this.getWarranties();
          }
          if (res.data.length == 0) {
            common.osg.toast('您当前还没有订单！', 'none');
          }
        }
      );
    },
    // 去支付
    toPay() {
      common.osg.ajax(
        'basic/order/query',
        {
          'is:serviceAppointmentId|string#and': this.sa._id,
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          let payData = res.data.filter(item => item.payState == 0 || item.payState == 2);
          if (payData.length == 0) {
            common.osg.alert('未查询到需要支付的订单！', 'none');
          } else if (payData.length == 1) {
            this.open('/subpackages/order/pay', {
              orderId: payData[0]._id
            });
          } else {
            this.open('/subpackages/order/orders', { serviceAppointmentId: this.sa._id });
          }
        },
        {
          noload: true
        }
      );
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    toMoKanDetail(item) {
      common.osg.open('../../subpackages/web/web', {
        url: `${common.osg.host}/fsgo/wm/h5/mokan/detail/${item.exts.moKanNum}?address=${
          this.areaList.province_list[item.area[0]] +
          this.areaList.city_list[item.area[1]] +
          this.areaList.county_list[item.area[2]] +
          item.address
        }&startDate=${item.exts.startDate || ''}&supervisorName=${
          item.exts.supervisorName || ''
        }&headmanName=${item.exts.headmanName || ''}&client=b`
      });
    },
    getSurveys() {
      common.osg.ajax(
        'basic/survey/querySurvey',
        { sid: this.sa._id },
        result => {
          common.osg.ajax(
            'basic/survey/querySurvey20',
            { sid: this.sa._id },
            res => {
              this.surveys = result.data.concat(res.data);
              let serviceGoods = [];
              if (
                result.data[0] &&
                result.data[0].serviceGoods &&
                result.data[0].serviceGoods.length > 0
              ) {
                serviceGoods = result.data[0].serviceGoods;
              }
              if (res.data[0] && res.data[0].serviceGoods && res.data[0].serviceGoods.length > 0) {
                serviceGoods = serviceGoods.concat(res.data[0].serviceGoods);
              }
              if (serviceGoods.length > 0) {
                this.getWares(res.data[0].serviceGoods);
              } else {
                this.wares = [];
              }
            },
            { noload: true }
          );
        },
        { noload: true }
      );
    },
    surveyClick(e) {
      if (this.surveys.length == 1) {
        common.osg.md({ act: '勘察报告文件' });
        common.osg.download(e);
      } else if (this.surveys.length > 1) {
        this.open('../../subpackages/survey/surveys', {
          serviceAppointmentId: this.sa._id
        });
      }
    },
    toEvaluate(sa) {
      let node = sa.workflowNodeList[sa.workflowNodeList.length - 1];
      common.osg.open('/subpackages/extForm/extForm', {
        formDefId: node.nodeDef.formDefId,
        formDataId: node.formDataId,
        workflowNodeId: node._id,
        tenantId: node.tenantId,
        sid: sa._id
      });
    },
    // 查询勘察单推荐的服务商品
    getWares(ids) {
      common.osg.ajax(
        '/wares/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:type|string#and': '3',
          'in:typeId|array#and': ids.join(),
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.wares = res.data;
        }
      );
    },
    getOrders() {
      common.osg.ajax(
        'basic/order/query',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:serviceAppointmentId|string#and': this.sa._id
        },
        res => {
          this.orders = res.data;

          const bjProducts = this.orders[0]?.bjProducts;
          console.log(112223, bjProducts);
          this.ordersBjProducts = bjProducts ? JSON.parse(bjProducts) : '';
          // this.ordersBjProducts = JSON.parse(this.orders[0].bjProducts);
        }
      );
    },
    orderClick(e) {
      if (this.orders.length == 1) {
        common.osg.md({ act: '报价单文件' });
        common.osg.download(e);
      } else if (this.orders.length > 1) {
        this.open('../../subpackages/order/orders', {
          serviceAppointmentId: this.sa._id
        });
      }
    },
    getContracts() {
      common.osg.ajax(
        '/basic/contract/myContract',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:serviceAppointmentId|string#and': this.sa._id
        },
        res => {
          this.contracts = res.data;
        }
      );
    },
    contractClick(e) {
      if (this.contracts.length == 1) {
        common.osg.md({ act: '合同文件' });
        common.osg.download(e);
      } else if (this.contracts.length > 1) {
        this.open('../../subpackages/contract/contracts', {
          serviceAppointmentId: this.sa._id
        });
      }
    },
    getWarranties() {
      common.osg.ajax(
        '/document/myWarrantys',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:sid|string#and': this.sa._id
        },
        res => {
          this.warranties = res.data;
        }
      );
    },
    warrantyClick(e) {
      if (this.warranties.length == 1) {
        common.osg.md({ act: '质保单文件' });
        common.osg.download(e);
      } else if (this.warranties.length > 1) {
        this.open('../../subpackages/warranty/warranties', {
          serviceAppointmentId: this.sa._id
        });
      }
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    // 预览图片、查看文件
    download(e) {
      if (common.osg.isRepeatClick('download')) {
        return;
      }
      common.osg.download(e);
    },
    getSurveyTotal() {
      common.osg.ajax('basic/survey/querySurvey', { page: 1, rows: 1 }, result => {
        common.osg.ajax('basic/survey/querySurvey20', { page: 1, rows: 1 }, res => {
          this.surveyTotal = result.total + res.total;
        });
      });
    },
    getWarrantyTotal() {
      common.osg.ajax(
        '/document/myWarrantys',
        {
          page: 1,
          rows: 1
        },
        res => {
          this.warrantyTotal = res.total;
        }
      );
    },
    getCouponTotal() {
      common.osg.ajax(
        'basic/couponPrinting/query',
        {
          page: 1,
          rows: 1,
          tenantId: '1340835581184723420',
          'is:state|integer#and': 1,
          'in:status|array-integer#and': '2,3,5',
          'in:type|array-integer#and': '1,2',
          userId: wx.getStorageSync('user')._id
        },
        res => {
          this.couponTotal = res.total;
        }
      );
    },
    // 查询积分
    getMyIncome() {
      common.osg.ajax('basic/income/myIncome', {}, res => {
        this.myIncomeData = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  height: calc(100vh - 50px);
  box-sizing: border-box;
  overflow-y: auto;
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom);
  .c-cell-group {
    margin: 0 15px 0px 15px;
    .c-cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f7f7f7;
      box-sizing: border-box;
      color: #323233;
      font-size: 14px;
      line-height: 24px;
      padding: 10px 16px;
      width: 100%;
      margin: 10px 0;
      border-radius: 8px;
      font-weight: 600;
    }
  }
  ::v-deep .van-cell {
    background-color: #f7f7f7;
    margin: 10px 0;
    border-radius: 8px;
    font-weight: 600;
  }
  ::v-deep .van-cell__title {
    font-size: 14px;
  }
}
.bg {
  width: 100vw;
  height: 260px;
  background-color: #fff;
  background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
}
.user-info {
  margin: 90px 15px 15px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 15px 35px 0;
  // margin-top: -150px;
  .text {
    color: #000000;
    margin: 10px 0 0 10px;
    display: flex;
    flex-direction: column;
    .name {
      color: #000000;
      font-size: 14px;
      font-weight: 600;
    }
    .change {
      margin-top: 5px;
      color: #000000;
      font-size: 12px;
    }
  }
}
.statistics {
  margin: 15px 15px 10px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  > view {
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
      font-size: 30px;
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
.grids {
  margin: 0 15px 10px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  .grid-title {
    padding: 15px 15px 5px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > view {
      font-weight: 400;
      font-size: 14px;
      color: #646566;
    }
  }
  .grid {
    padding-bottom: 10px;
  }
  ::v-deep .van-grid-item__content {
    padding: 0;
  }
}
.order {
  margin: 10px 15px;
  padding: 6px;
  box-sizing: border-box;
  width: calc(100vw - 32px);
  border-radius: 8px;
  // background: linear-gradient(316deg, #f8d7a1 0%, #ffc658 97.8%);
  background-color: #f7f7f7;
  .service-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px;
  }
  .content {
    border-radius: 2px;
    padding: 6px;
    background: #f7f7f7;
    .progress {
      margin: 5px 0;
      background-color: #fff;
      border-radius: 8px;
      position: relative;
      display: flex;
      // padding: 0 calc((((100vw - 56px) / 6) - 11px) / 2);
      .progress-item {
        opacity: 0.7;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .progress-icon {
          width: 100%;
          display: flex;
          align-items: center;
          .progress-line {
            flex: 1;
            height: 0;
          }
          .progress-line-todo {
            border-bottom: 0.8px solid #b6b6b6;
          }
          .progress-line-doing {
            border-bottom: 1px dashed #e50012;
          }
          .progress-line-done {
            border-bottom: 1px solid #e50012;
          }
          .progress-center {
            width: 8px;
            height: 8px;
            box-sizing: border-box;
            border: 1px solid #e50012;
            background-color: #e50012;
            // background: linear-gradient(316deg, #f8d7a1 0%, #ffc658 97.8%);
            border-radius: 50%;
            margin: 5px;
          }
          .progress-center-white {
            border: 1px solid #b2b2b2;
            background: #fff;
          }
        }
      }
    }
    .progress-text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      .progress-text-todo {
        color: #b6b6b6;
      }
      .progress-text-doing {
        color: #d60f16;
      }
      .progress-text-done {
        color: #666666;
      }
    }
    .buttons {
      // color: #fff;
      display: flex;
      margin-top: 10px;
      > view {
        margin-right: 10px;
        width: 65px;
        text-align: center;
        height: 18px;
        line-height: 18px;
        border-radius: 50px;
        background: linear-gradient(316deg, #e89093 0%, #ec6064 97.8%);
        font-size: 10px;
      }
    }
  }
  .phone-button {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.sa-detail {
  background: #fff;
  margin: 0 15px 10px;
  padding: 8px;
  border-radius: 8px;
  .sa-detail-card {
    border: 1px solid #ebedf0;
    border-radius: 8px;
    padding: 8px;
  }
  .phone-button {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.banner {
  width: calc(100vw - 32px);
  margin: 0 15px 10px;
  display: flex;
  border-radius: 8px;
}
.product {
  .product-image {
    margin-right: 8px;
    border-radius: 8px;
    overflow: hidden;
  }
  .product-info {
    color: #393838;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    .product-title-view {
      display: flex;
      align-items: center;
      .product-title {
        color: #000;
        font-size: 16px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      .tag {
        border-radius: 4px;
        border: 0.8px solid #d9d9d9;
        padding: 2px 5px;
        color: #878787;
        text-align: center;
        font-family: Inter;
        font-size: 10px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
      .tag-recommend {
        background-color: #f9de55;
        border-color: #f9de55;
      }
    }
    .product-info-bottom {
      color: #f75429;
      font-size: 16px;
      font-weight: 600;
      .product-area {
        font-size: 12px;
      }
    }
  }
}
.file {
  background-color: #f7f7f7;
  border-radius: 8px;
  width: 100vh;
  padding: 10px 10px 10px 15px;
  > view {
    margin-bottom: 5px;
  }
  .file-title {
    color: #fff;
    background-color: #e50012;
    border-radius: 50px;
    font-size: 9px;
    text-align: center;
    width: 50px;
    height: 15px;
    line-height: 15px;
  }
  .file-content {
    font-size: 14px;
    font-weight: 600;
  }
  .file-number {
    font-size: 18px;
    color: #d60f16;
  }
  .file-unit {
    font-size: 10px;
    color: #b6b6b6;
    padding: 5px 0 0 2px;
  }
  .file-button {
    font-size: 12px;
    font-weight: 600;
    border: 1px solid black;
    width: 60px;
    border-radius: 50px;
    text-align: center;
  }
}
</style>
