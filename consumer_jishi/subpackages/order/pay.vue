<template>
  <view class="pay">
    <block v-if="loaded">
      <block v-if="phone">
        <view class="top c-flex">
          <image
            src="https://pub.fsgo365.cn/jishi/pay-logo.png"
            mode="widthFix"
            style="width: 80px; height: 80px"
          ></image>
          <view class="c-flex-1 c-m-l-20">
            <text class="c-m-b-20">防水维修服务</text>
            <view
              style="color: #736e6e"
              class="c-flex c-item-center c-flex-between c-size-14"
              v-for="(order, i) in data.bjProducts.orderList"
              :key="i"
            >
              <text>{{ order.constructionLocation.split(' / ')[0] }}</text>
              <text>面积：{{ order.maintainAreaNum }}㎡</text>
              <view class="tag">{{ codelabel('agelimit', order.agelimit) }}质保</view>
            </view>
          </view>
        </view>
        <view class="content">
          <view class="c-size-20" style="font-weight: 900">在线支付</view>
          <view class="c-flex c-flex-between c-item-center c-size-14">
            <text>服务商品总价</text>
            <text style="font-weight: 500">¥{{ data.originPrice || '' }}</text>
          </view>
          <view
            v-if="data.projPackagesTotalPrice > 0"
            class="c-flex c-flex-between c-item-center c-color-a c-size-12"
          >
            <text>套餐费</text>
            <text>¥{{ data.projPackagesTotalPrice }}</text>
          </view>
          <view
            v-if="data.materialsTotalPrice > 0"
            class="c-flex c-flex-between c-item-center c-color-a c-size-12"
          >
            <text>材料费</text>
            <text>¥{{ data.materialsTotalPrice }}</text>
          </view>
          <view
            v-if="data.proceduresTotalPrice > 0"
            class="c-flex c-flex-between c-item-center c-color-a c-size-12"
          >
            <text>人工费</text>
            <text>¥{{ data.proceduresTotalPrice }}</text>
          </view>
          <view
            v-if="data.measuresTotalPrice > 0"
            class="c-flex c-flex-between c-item-center c-color-a c-size-12"
          >
            <text>机措费</text>
            <text>¥{{ data.measuresTotalPrice }}</text>
          </view>
          <view
            v-if="data.bjProducts.addItems.totalAmount > 0"
            class="c-flex c-flex-between c-item-center c-color-a c-size-12"
          >
            <text>增项</text>
            <text>¥{{ data.bjProducts.addItems.totalAmount }}</text>
          </view>
          <view
            v-if="data.bjProducts.deleteItems.totalAmount < 0"
            class="c-flex c-flex-between c-item-center c-color-a c-size-12"
          >
            <text>减项</text>
            <text>-¥{{ Math.abs(data.bjProducts.deleteItems.totalAmount) }}</text>
          </view>
          <view v-if="data.preferentialAmount > 0 || data.exts.couponsVal > 0" class="line"></view>
          <view
            v-if="data.preferentialAmount > 0"
            class="c-flex c-flex-between c-item-center c-size-14"
          >
            <text>享受优惠</text>
            <text>-¥{{ data.preferentialAmount }}</text>
          </view>
          <view
            v-if="data.exts.couponsVal > 0"
            class="c-flex c-flex-between c-item-center c-size-14"
          >
            <text>优惠券：{{ data.exts.couponsName }}</text>
            <text style="min-width: 50px; text-align: right">-¥{{ data.exts.couponsVal }}</text>
          </view>
          <!-- 已使用优惠与上面优惠券使用方式  不同  -->
          <view
            class="c-flex c-flex-between c-color-a c-item-center c-size-12"
            @click="handleReceiveCoupon(false)"
          >
            <!-- <van-tag plain type="danger">优惠券</van-tag> -->
            <text>优惠券</text>
            <view
              style="min-width: 50px; text-align: right"
              class="c-jishi"
              v-if="couponPopup.discountAmount > 0 || data.exts.couponAmount"
            >
              -¥{{ couponPopup.discountAmount || data.exts.couponAmount }}
              <uni-icons type="right" size="11"></uni-icons>
            </view>
            <view style="min-width: 50px; text-align: right" v-else>
              无可用
              <uni-icons type="right" size="11" color="#aaa"></uni-icons>
            </view>
          </view>

          <!-- <view
            v-else
            class="c-flex c-flex-between c-color-a c-item-center c-size-14"
            @click="handleReceiveCoupon(false)"
          >
            不可用优惠券
            <view style="min-width: 50px; text-align: right">
              2张
              <uni-icons type="right" size="15" color="#aaa"></uni-icons>
            </view>
          </view> -->
        </view>
        <view class="price">
          <view v-if="payStatus.msg1" class="c-size-14">{{ payStatus.msg1 }}</view>
          <view v-if="payStatus.msg4" class="c-size-14">
            {{ payStatus.msg4 }}
          </view>
          <view v-if="payStatus.msg2" class="c-size-14">{{ payStatus.msg2 }}</view>
          <!-- <view v-if="payStatus.msg3" class="c-size-14">{{ payStatus.msg3 }}</view> -->
        </view>
        <view class="c-uni-submit">
          <!-- 当有没有可用的优惠券并且待领取的优惠券存在 -->
          <view
            slot="tip"
            style="
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: space-evenly;
              background-color: #fff7cc;
              padding: 0px 12px;
              color: #f56723;
              font-size: 13px;
              position: absolute;
              left: 0px;
              top: -40px;
              width: 100%;
            "
            v-if="
              couponPopup.hasPendingCoupon &&
              couponPopup.couponList0.length == 0 &&
              !data.exts.couponAmount
            "
          >
            <view>
              <uni-icons type="gift" color="#f56723" size="13" style="margin-right: 10px" />
              您有大额优惠券待领取,下单立省!
            </view>
            <view style="color: #ee0a24" @click="handleReceiveCoupon(true)">
              领取
              <uni-icons type="right" color="#f56723" size="13" />
            </view>
          </view>
          <view>
            <text class="label">本次需支付</text>
            <text class="amount">
              <text class="c-size-12">¥</text>
              <text class="number c-jishi">{{ payStatus.currentPaymentAmount }}</text>
            </text>
          </view>
          <button
            class="c-uni-button round"
            hover-class="hover"
            style="
              width: 110px;
              height: 40px !important;
              background-color: #ff6900;
              border-color: #ff6900;
              color: #ffffff;
            "
            plain
            @click="pay"
          >
            去支付
          </button>
        </view>
      </block>
      <view v-else class="c-uni-empty">
        <image src="https://pub.fsgo365.cn/empty.png"></image>
        <text>无权查看</text>
        <button
          class="c-uni-button round primary"
          hover-class="hover"
          plain
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          授权手机号查看
        </button>
      </view>
    </block>
    <!-- 领取优惠券 弹窗 -->
    <uni-popup
      v-if="couponPopup.isOpen"
      ref="couponPopup"
      borderRadius="20px"
      background-color="#fff"
      type="bottom"
      is-mask-click
      style="position: relative; z-index: 100"
    >
      <view class="couponPopupBox">
        <view class="coupon-title">
          <text style="font-weight: bold">优惠券</text>
          <view v-if="couponPopup.isOpen && couponPopup.isCouponClaimable">
            <uni-segmented-control
              :current="couponPopup.Active"
              :values="['已领取', '待领取']"
              style-type="text"
              activeColor="#007aff"
              inActiveColor="#646566"
              @clickItem="handleTabsChange"
            />
          </view>
        </view>
        <view class="Already-coupon" v-if="couponPopup.Active === 0">
          <view v-for="(KKK, JJJ) in [0, 1]" :key="JJJ">
            <view class="Already-Status">{{ KKK === 0 ? '' : '不' }}可用优惠券</view>
            <block v-if="couponPopup['couponList' + JJJ].length > 0">
              <view
                class="coupon-content"
                v-for="(item, index) in couponPopup['couponList' + JJJ]"
                :key="item._id"
              >
                <view class="c-flex">
                  <view class="coupon-left">
                    <view class="c-size-14 c-flex c-item-center">{{ item.title }}</view>
                    <view class="c-size-12">激活时间：{{ item.activationDate || '未激活' }}</view>
                    <view class="c-size-12">失效时间：{{ item.dueDate || '永久有效' }}</view>
                    <view
                      @click.stop="handledExpandInformation(couponPopup['couponList' + JJJ], index)"
                      class="c-size-12 c-flex c-flex-between c-item-center"
                    >
                      <view style="color: #8e8e8e">详细信息</view>
                      <uni-icons
                        size="12"
                        :type="couponPopup['couponList' + JJJ][index].expandOrNot ? 'up' : 'down'"
                        class="badge"
                      />
                    </view>
                  </view>

                  <view
                    class="coupon-right"
                    :class="
                      item.status == 5
                        ? 'bg-gray'
                        : item.type == '1'
                        ? 'bg-blue'
                        : item.type == '2'
                        ? 'c-bg-reddish-orange'
                        : 'bg-red'
                    "
                  >
                    <view v-if="item.type == 1 || item.type == 4 || item.type == 5">
                      <text class="c-size-12">¥</text>
                      <text class="c-size-20 c-bold">{{ item.value }}</text>
                    </view>
                    <view v-if="item.type == 2">
                      <text class="c-size-20 c-bold" v-if="item.value">
                        {{
                          item.value
                            ? item.value >= 1
                              ? '不打折'
                              : String(item.value).split('.')[1] + '折'
                            : '免费'
                        }}
                      </text>
                    </view>
                    <view class="c-size-12" v-if="item.prerequisites">
                      <!-- couponType满减方式: 1.循环满减 2.阶梯满减 -->
                      <text v-if="item.type == '5' && item.couponType == '1'">
                        每满{{ item.prerequisites }}减{{ item.value }}
                      </text>
                      <text v-else>满{{ item.prerequisites }}元可用</text>
                    </view>
                    <view
                      @click="useCoupon(item)"
                      v-if="JJJ === 0"
                      style="
                        padding: 2px 10px;
                        margin-top: 10px;
                        font-size: 12px;
                        border-radius: 100px;
                        background: #fff;
                        color: rgb(49, 105, 249);
                      "
                      :class="
                        item.type == '1'
                          ? 'c-blue'
                          : item.type == '2'
                          ? 'c-creddish-orange'
                          : 'c-red'
                      "
                    >
                      {{ couponPopup.useCoupomId._id == item._id ? '已选择' : '立即使用' }}
                    </view>
                  </view>
                </view>

                <view class="coupon-bottom" v-if="item.expandOrNot">
                  <view
                    class="c-size-12"
                    style="color: #8e8e8e"
                    v-if="item.exts.disableReason && KKK === 1"
                  >
                    不可用原因： {{ item.exts.disableReason || '' }}
                  </view>
                  <view class="c-size-12" style="color: #8e8e8e">
                    领取规则：优惠券价格为{{ item.price }}
                    <text v-if="item.discountLimit">,优惠上限为{{ item.discountLimit }}元</text>
                  </view>

                  <view class="c-size-12 c-flex" style="color: #8e8e8e">
                    <view>使用规则：</view>
                    <view class="c-flex-1">
                      <view>使用该优惠券时需要满足最低消费金额{{ item.prerequisites }}</view>

                      <view class="c-size-12" style="color: #8e8e8e">
                        该优惠券仅适用于
                        {{ codelabel('regions', item.region) || '' }} 地区
                      </view>
                      <view>每笔订单只能使用一张优惠券，不可叠加使用</view>
                      <view v-if="item.description">描述：{{ item.description }}</view>
                    </view>
                  </view>
                </view>
              </view>
            </block>
            <block v-else>
              <view
                style="display: flex; align-items: center; width: 100vw; justify-content: center"
              >
                <!-- <van-empty image="search" description="暂无优惠券" /> -->
                <view
                  style="
                    width: 200px;
                    height: 200px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  <image
                    style="width: 160px; height: 160px"
                    src="https://img01.yzcdn.cn/vant/empty-image-search.png"
                  ></image>
                  <text style="margin-top: 16px; color: #969799; font-size: 14px">暂无优惠券</text>
                </view>
              </view>
            </block>
          </view>
        </view>
        <!-- 待领取优惠券模块 -->
        <view class="WaitingReceive-coupon" v-if="couponPopup.Active === 1">
          <view class="">
            <view
              class="coupon-content"
              v-for="(I, index) in couponPopup.pendingCoupons"
              :key="I._id"
            >
              <view class="c-flex">
                <view class="coupon-left">
                  <view class="c-size-14 c-flex c-item-center">{{ I.title }}</view>
                  <view class="c-size-12">
                    活动时间：{{
                      I.startDate ? I.startDate.split(' ')[0].replace(/-/g, '.') : ''
                    }}-{{ I.endDate ? I.endDate.split(' ')[0].replace(/-/g, '.') : '' }}
                  </view>
                  <view class="c-size-12">
                    使用时间：{{
                      I.startCouponDate ? I.startCouponDate.split(' ')[0].replace(/-/g, '.') : ''
                    }}-{{ I.endCouponDate ? I.endCouponDate.split(' ')[0].replace(/-/g, '.') : '' }}
                  </view>
                  <view
                    @click="handledExpandInformation(couponPopup.pendingCoupons, index)"
                    class="c-size-12 c-flex c-flex-between c-item-center"
                  >
                    <view style="color: #8e8e8e">详细信息</view>
                    <!-- 显示下箭头图标 -->
                    <uni-icons size="12" :type="I.expandOrNot ? 'up' : 'down'" class="badge" />
                  </view>

                  <image
                    src="../../static/images/have.png"
                    v-if="I.couponPrintCount > 0"
                    mode="widthFix"
                    class="stamp"
                  ></image>
                </view>

                <view
                  class="coupon-right"
                  :class="
                    I.status == 5
                      ? 'bg-gray'
                      : I.type == '1'
                      ? 'bg-blue'
                      : I.type == '2'
                      ? 'c-bg-reddish-orange'
                      : 'bg-red'
                  "
                >
                  <view v-if="I.type == 1 || I.type == 4 || I.type == 5">
                    <text class="c-size-12">¥</text>
                    <text class="c-size-20 c-bold">{{ I.value }}</text>
                  </view>
                  <view v-if="I.type == 2">
                    <text class="c-size-20 c-bold" v-if="I.value">
                      {{
                        I.value
                          ? I.value >= 1
                            ? '不打折'
                            : String(I.value).split('.')[1] + '折'
                          : '免费'
                      }}
                    </text>
                  </view>
                  <view class="c-size-12" v-if="I.prerequisites">
                    <!-- couponType满减方式: 1.循环满减 2.阶梯满减 -->
                    <text v-if="I.type == '5' && I.couponType == '1'">
                      每满{{ I.prerequisites }}减{{ I.value }}
                    </text>
                    <text v-else>满{{ I.prerequisites }}元可用</text>
                  </view>

                  <view
                    v-if="I.stock > 0 && I.couponPrintCount < I.eachDelivery"
                    style="
                      padding: 2px 10px;
                      margin-top: 10px;
                      font-size: 12px;
                      border-radius: 100px;
                      background: #fff;
                      color: rgb(49, 105, 249);
                    "
                    :class="
                      I.type == '1' ? 'c-blue' : I.type == '2' ? 'c-creddish-orange' : 'c-red'
                    "
                    @click="collect(I)"
                  >
                    {{ I.price > 0 ? '立即抢购' : '免费领取' }}
                  </view>
                </view>
              </view>

              <view class="coupon-bottom" v-if="I.expandOrNot">
                <view class="c-size-12" style="color: #8e8e8e">
                  领取规则：优惠券价格为{{ I.price }},每人最多领取{{ I.eachDelivery }}张
                </view>
                <view class="c-size-12 c-flex" style="color: #8e8e8e">
                  <view>使用规则：</view>
                  <view class="c-flex-1">
                    <view>使用该优惠券时需要满足最低消费金额{{ I.prerequisites }}</view>
                    <view class="c-size-12" style="color: #8e8e8e">
                      该优惠券仅适用于
                      {{ codelabel('regions', I.region) || '' }} 地区
                    </view>
                    <view>每笔订单只能使用一张优惠券，不可叠加使用</view>
                    <view v-if="I.description">描述：{{ I.description }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
    <!-- 提示窗示例 -->
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog
        type="error"
        cancelText="退出"
        confirmText="知道了"
        title="提醒"
        content="未查询到订单信息，请联系相关负责人进行核实。系统将退出付款页面。"
        @confirm="dialogClose"
        :showClose="false"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');

export default {
  data() {
    return {
      loaded: false,
      phone: '',
      orderId: '',
      options: {
        codecfg_agelimit: {
          codeId: 'agelimit'
        },
        codecfg_regions: { codeId: 'regions' }
      },
      data: {
        bjProducts: {
          orderList: [],
          addItems: {},
          deleteItems: {}
        }
      },
      payStatus: {},
      couponPopup: {
        isOpen: false, // 表示优惠券弹窗是否打开，初始值为 false，即默认关闭
        isCouponClaimable: true, //是否允许客户领取优惠券
        couponList0: [], // 存放优惠券信息的数组 //可用的
        couponList1: [], // 存放优惠券信息的数组 //不可用的
        pendingCoupons: [], //待领取优惠券列表
        Active: 0, //当前选择的优惠券tab索引 待领取 还是已领取
        useCoupomId: {}, //当前套餐使用优惠券
        discountAmount: 0, //计算出来优惠券优惠金额
        hasPendingCoupon: false //查询到当前是否还有待领取的优惠券
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    let qrCode = getApp().globalData.qrCode;
    if (qrCode) {
      let params = qrCode.split('?')[1].split('&');
      let obj = {};
      params.map(v => (obj[v.split('=')[0]] = v.split('=')[1]));
      this.orderId = obj.orderId;
      this.params = obj;
    } else if (params.q) {
      const decodedOrderId = decodeURIComponent(params.q); // 解码
      // 1. 获取查询字符串部分（即问号后的内容）
      const queryString = decodedOrderId.split('?')[1]; // 获取 "orderId=8909690529275363214&userId=12345"
      // 2. 将查询字符串分割成每个参数对
      const queryParams = queryString.split('&'); // 获取 ["orderId=8909690529275363214", "userId=12345"]
      // 3. 创建一个对象来存储查询参数
      const query = {};
      // 4. 遍历每一个参数对，并存入对象
      queryParams.forEach(param => {
        const [key, value] = param.split('='); // 将 "orderId=8909690529275363214" 分割为 ["orderId", "8909690529275363214"]
        query[key] = value; // 解码并存储
      });
      this.orderId = query.orderId;
      this.params = query;
    } else {
      this.orderId = params.orderId;
      this.params = params;
    }

    common.osg.doLogin({}, () => {
      this.phone = wx.getStorageSync('user').phone;
      this.loaded = true;
      if (this.phone) {
        common.osg.codeoption(() => {
          //查询全部订单
          // this.getData();
          this.getOrderData();
          this.getPayStatus();
        });
      }
    });
  },
  onReady() {
    // 启动定时器，每隔 1 秒执行一次查询
    let queryCount = 0; // 计数器，记录查询次数
    const maxQueries = 10; // 最大查询次数

    this.timer = setInterval(() => {
      if (this.payStatus.currentPaymentAmount) {
        this.queryAvailableCoupons();
        this.queryMineCoupons();
        clearInterval(this.timer); // 如果查询成功，清除定时器
      } else {
        console.log('继续查询');
        queryCount++; // 增加查询次数

        // 如果达到最大查询次数，清除定时器
        if (queryCount >= maxQueries) {
          clearInterval(this.timer);
          console.log('达到最大查询次数，停止查询');
        }
      }
    }, 1000); // 每秒执行一次
  },
  watch: {
    'couponPopup.useCoupomId': {
      handler(newObj, oldObj) {
        console.log('优惠券对象发生变化了', newObj, oldObj);
        this.couponPopup.discountAmount = newObj.exts.discountAmount;
        console.log('优惠金额', this.couponPopup.discountAmount);
        this.getPayStatus('/biz/pay/getPayStatusAndMessageWithDiscount');
      }
    }
  },
  methods: {
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.phone = user.phone;
        if (this.phone) {
          common.osg.codeoption(() => {
            // this.getData();
            this.getOrderData();
            this.getPayStatus();
          });
        }
      });
    },
    getData(params) {
      common.osg.ajax('basic/order/findById', { id: this.orderId }, res => {
        res.data.bjProducts = JSON.parse(res.data.bjProducts);
        res.data.projPackagesTotalPrice = 0;
        res.data.proceduresTotalPrice = 0;
        res.data.materialsTotalPrice = 0;
        res.data.measuresTotalPrice = 0;
        let orderList = res.data.bjProducts.orderList;
        orderList.map(order => {
          res.data.projPackagesTotalPrice += order.projPackages.totalAmount;
          res.data.proceduresTotalPrice += order.procedures.totalAmount;
          res.data.materialsTotalPrice += order.materials.totalAmount;
          res.data.measuresTotalPrice += order.measures.totalAmount;
        });
        this.data = res.data;

        if (this.params.act == 'ykyq') {
          common.osg.md({
            act: 'ykyq_' + this.$mp.page.route,
            supervisorName: res.data.createUserName,
            orgName: res.data.orgName
          });
        }
      });
    },
    getOrderData() {
      common.osg.ajax(
        'basic/order/query',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'in:processState|array-integer#and': '0,-1,1,2,3,4', // 已签约,待开工,待完工,已完工
          'is:_id|string#and': this.orderId
        },
        res => {
          //没有找到
          if (res.data.length > 0) {
            this.getData();
          } else {
            this.$refs.alertDialog.open();
          }
        }
      );
    },
    getPayStatus(useNewApi = '/biz/pay/getPayStatusAndMessage') {
      common.osg.ajax(
        useNewApi,
        { orderId: this.orderId, couponPrintingId: this.couponPopup.useCoupomId._id || null },
        res => {
          res.data.currentPaymentAmount = Number(res.data.msg3.split('：')[1]);
          this.payStatus = res.data;
        }
      );
    },
    dialogClose() {
      this.open('/pages/account/account', {}, { mode: 'switchTab' });
    },
    open(path, data, options) {
      common.osg.open(path, data, options);
    },
    pay() {
      common.osg.ajax(
        '/biz/pay/pay',
        { orderId: this.orderId, couponPrintingId: this.couponPopup.useCoupomId._id || null },
        res => {
          uni.getProvider({
            service: 'oauth',
            success: provider => {
              uni.requestPayment({
                provider: provider.provider[0],
                // #ifdef MP-WEIXIN
                // orderInfo: {
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,
                // },
                // #endif
                // #ifdef MP-ALIPAY
                orderInfo: res.data.tradeNO,
                // #endif
                success: result => {
                  console.log('success', result);
                  common.osg.alert(result.memo || '支付成功', () => {
                    wx.navigateBack({
                      delta: 1
                    });
                  });
                },
                fail: res => {
                  console.log('error', res);
                }
              });
            }
          });
        }
      );
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    // 领取客户优惠券
    handleReceiveCoupon(type) {
      // 检查客户是否用过优惠券了
      if (this.data.exts.couponAmount) return common.osg.toast('该订单已经优惠过了', 'none');

      // 这里编写具体领取优惠券的逻辑，比如发送请求到服务器等
      console.log('执行领取优惠券操作');
      this.couponPopup.isOpen = true;
      // 是否允许客户在领取优惠券？
      this.couponPopup.isCouponClaimable = type;
      setTimeout(() => {
        if (this.$refs && this.$refs.couponPopup) {
          this.$refs.couponPopup.open();
        }
      }, 0);
    },
    //处理优惠券tab 改变事件
    handleTabsChange(e) {
      this.couponPopup.Active = e.currentIndex;
      this.couponPopup.Active ? this.queryAvailableCoupons() : this.queryMineCoupons();
    },
    //查询我的优惠券
    queryMineCoupons() {
      let params = {
        // _all: '1',
        // tenantId: '4670873342363649607',
        // 'is:state|integer#and': 1,
        // 'in:status|array-integer#and': '2,3,5',
        // userId: wx.getStorageSync('user')._id,
        // sortField: 'createTime',
        // sortOrder: 'desc'
        id: this.orderId
      };
      common.osg.ajax(
        // 'basic/couponPrinting/query',
        'basic/couponPrinting/couponPrintingByOrderId',
        params,
        res => {
          //查询之前 先清空数组
          this.couponPopup.couponList0 = [];
          this.couponPopup.couponList1 = [];

          res.data.map(item => {
            // item.type === 1 2 5  //折扣券
            //当前订单总额度大于 优惠券门槛？？？
            // let isValidForCoupon;
            // 判断优惠券类型，满减券 (type === 5) 使用阶梯门槛，其他类型使用普通门槛
            // if (item.type === 5 && item.ladderParts && item.ladderParts.length > 0) {
            //   isValidForCoupon =
            //     this.payStatus.currentPaymentAmount >= item.ladderParts[0].ladderPrerequisite;
            // } else {
            //   isValidForCoupon = this.payStatus.currentPaymentAmount >= item.prerequisites;
            // }

            // 循环/阶梯满减券 5 支付代金券 4 抵扣产品数量券3; 折扣券2 满减券1;
            // let isEligible = [1, 2, 5].includes(item.type);
            //当前区域是否符合
            // console.log('区域', this.data.exts.projectArea[0], item.region);
            // let limitedArea = this.data.exts.projectArea[0] == item.region;
            // console.log('区域是否满足', limitedArea);

            //服务商是否符合
            console.log('订单数据', this.data);

            //测试代码
            // console.log(11111, item.scopeOrgIds);

            // 使用 this.$set 确保响应性
            this.$set(item, 'expandOrNot', false);

            //判断条件
            if (item.exts.useState == '1') {
              const updatedCouponList0 = [...this.couponPopup.couponList0, item];
              this.$set(this.couponPopup, 'couponList0', updatedCouponList0);
              if (
                Object.keys(this.couponPopup.useCoupomId).length === 0 &&
                !this.data.exts.couponAmount
              ) {
                this.couponPopup.useCoupomId = item;
                console.log('默认领取的优惠券', this.couponPopup.useCoupomId);
              }
            } else {
              // 领取数量小于或等于0，放入不可领取的优惠券数组
              const updatedCouponList1 = [...this.couponPopup.couponList1, item];
              this.$set(this.couponPopup, 'couponList1', updatedCouponList1);
            }
          });
          console.log('查询所有优惠券', res.data);
          console.log('查询我的可用优惠券', this.couponPopup.couponList0);
          console.log('查询我的不可用优惠券', this.couponPopup.couponList1);
        },
        {
          noload: true
        }
      );
    },

    // 查询待领取的优惠券
    queryAvailableCoupons() {
      let params = {
        _all: '1',
        tenantId: '4670873342363649607',
        'is:state|integer#and': 1,
        // 'gt:stock|integer#and': 0, //库存大于0 query后过滤
        'lte:startDate|datetime#and': common.osg.formatTime(), //在活动期内
        'gte:endDate|datetime#and': common.osg.formatTime(), //在活动期内
        'ne:scopeType|integer#and': '99',
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax(
        'basic/coupon/query',
        params,
        res => {
          console.log('查询到所有待领取的优惠券', res.data);
          // 查询到所有待领取的优惠券
          this.couponPopup.pendingCoupons = res.data.map(item => ({ ...item, expandOrNot: false }));
          this.couponPopup.hasPendingCoupon = res.data.some(item => item.couponPrintCount <= 0);
          console.log('查询到是否还有有待领取的优惠券', this.couponPopup.hasPendingCoupon);
        },
        {
          noload: true
        }
      );
      // 这里编写具体查询可用优惠券的逻辑，比如发送请求到服务器等
    },
    //使用优惠券
    useCoupon(item) {
      this.couponPopup.useCoupomId = item;
      this.couponPopup.isOpen = false;
      this.$refs.couponPopup.close();
      this.couponPopup.Active = 0;
    },

    //领取优惠券
    collect(item) {
      //支付购买优惠券
      if (item.price > 0) {
        common.osg.ajax('biz/pay/payTicket', { param: JSON.stringify({ [item._id]: 1 }) }, res => {
          let params = res.data;
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success: res => {
              common.osg.toast('买券成功,可返回我的卡券查看~', 'none');
              this.queryAvailableCoupons();
            },
            fail: res => {}
          });
        });
        // 免费领取
      } else if (item.price == 0) {
        common.osg.ajax('/basic/couponPrinting/collect/' + item._id, {}, res => {
          common.osg.toast('领券成功,可返回我的卡券查看~', 'none');
          this.queryAvailableCoupons();
        });
      }
    },
    //展开详细信息
    handledExpandInformation(list, index) {
      list[index].expandOrNot = !list[index].expandOrNot;
    }
  }
};
</script>

<style lang="scss">
.pay {
  background: #f8f8f8;
  height: 100vh;
  overflow-y: auto;
  .van-empty {
    height: 100vh;
  }
  .top {
    background-color: #fff;
    margin: 10px 15px;
    padding: 15px 13px;
    border-radius: 8px;
    font-size: 16px;
    overflow: hidden;
    > view {
      line-height: 30px;
    }
    .tag {
      width: 50px;
      height: 18px;
      flex-shrink: 0;
      border-radius: 80px;
      background: #ff6900;
      color: #fff;
      text-align: center;
      font-family: Inter;
      font-size: 10px;
      font-weight: 500;
      line-height: 18px;
    }
  }
  .content {
    background-color: #fff;
    margin: 10px 15px;
    padding: 15px;
    border-radius: 8px;
    font-size: 16px;
    overflow: hidden;
    .line {
      background: #d1d1d1;
      width: 100%;
      height: 1px;
      margin: 6px 0;
    }
    .c-color-a {
      color: #aaa;
    }
  }
  .price {
    background-color: #fff;
    margin: 10px 15px;
    padding: 15px;
    border-radius: 8px;
    font-size: 16px;
    overflow: hidden;
  }
  .submit-bar-button {
    color: #323233;
    background: #f9de55;
    border-color: #f9de55;
  }
}
// 优惠券弹窗
.couponPopupBox {
  display: flex;
  flex-direction: column;
  height: 75vh;
  width: 100vw;
  .coupon-title {
    font-size: 36rpx;
    margin: 10px 0px;
    text-align: center;
    height: auto;
  }

  //
  .Already-coupon,
  .WaitingReceive-coupon {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    background-color: #f8f8f8;
    .van-empty {
      height: unset;
      padding: 0px;
    }
  }
  .Already-Status {
    margin: 0;
    padding: 8px 16px;
    color: rgba(69, 90, 100, 0.6);
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
  }
  .coupon-content {
    margin: 3vw;
    overflow: hidden;
    height: auto;
    border-radius: 5px 5px 3px 3px;
    background: #fdfdfd;
    .coupon-left {
      padding: 0 3vw;
      width: 70%;
      box-sizing: border-box;
      background-color: #fff;
      position: relative;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
    .stamp {
      position: absolute;
      width: 60px;
      right: 0%;
      top: calc(50% - 40px);
    }
    .coupon-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      position: relative;
    }
    .coupon-bottom {
      padding: 0px 3vw;
      height: auto;
    }
  }
  .coupon-right::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 4px;
    border-radius: 0 0 4px 0;
    background: #f8f8f8;
  }
  .coupon-right::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 4px;
    height: 4px;
    border-radius: 0 4px 0 0;
    background: #f8f8f8;
  }

  .bg-blue {
    background: linear-gradient(to bottom right, rgb(118, 180, 249), rgb(49, 105, 249));
  }
  .bg-red {
    background: linear-gradient(to bottom right, rgb(236, 93, 106), #ee0a24);
  }
  .bg-gray {
    background: linear-gradient(to bottom right, rgb(217, 217, 217), rgb(194, 194, 194));
  }
}
.couponPopupBox .coupon-title .segmented-control {
  overflow: unset;
  .segmented-control__text {
    font-size: 16px;
  }
}
// 适合用在类似徽章、小图标等场景

::v-deep .badge {
  background-color: #d9d9d9;
  width: 17px;
  height: 17px;
  text-align: center;
  border-radius: 50%;
  line-height: 17px;
  .uni-icons {
    color: #fff !important;
  }
}
</style>
