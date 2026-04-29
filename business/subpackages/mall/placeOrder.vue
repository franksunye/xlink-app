<template>
  <view class="placeOrder" @click.capture="track">
    <view
      class="address-view"
      @click="doOpen('addresses', { selectedAddressId: address._id })"
      :data-event="{ id: 'xQ3DcTCy-9' }"
    >
      <view v-if="address._id" class="c-flex-1" :data-event="{ id: 'xQ3DcTCy-9' }">
        <view class="area" :data-event="{ id: 'xQ3DcTCy-9' }">
          {{
            address.area
              ? areaList.province_list[address.area[0]] +
                  areaList.city_list[address.area[1]] +
                  areaList.county_list[address.area[2]] || ''
              : ''
          }}{{ address.subdistrictName }}
        </view>
        <view class="address" :data-event="{ id: 'xQ3DcTCy-9' }">{{ address.address }}</view>
        <view
          class="c-flex c-item-center"
          style="line-height: 30px"
          :data-event="{ id: 'xQ3DcTCy-9' }"
        >
          <text class="name" :data-event="{ id: 'xQ3DcTCy-9' }">{{ address.name }}</text>
          <text class="phone" :data-event="{ id: 'xQ3DcTCy-9' }">{{ address.phone }}</text>
          <van-button
            v-if="address.isDefault"
            round
            size="mini"
            color="#E5EFFB"
            custom-style="color:#106cff;font-size:10px;height: 15px;line-height: 15px;min-width: 35px;display:flex;"
            :data-event="{ id: 'xQ3DcTCy-9' }"
          >
            默认
          </van-button>
        </view>
      </view>
      <view
        v-else
        class="c-flex-1"
        style="font-size: 32rpx; font-weight: 700; color: #333333"
        :data-event="{ id: 'xQ3DcTCy-9' }"
      >
        请选择收货地址
      </view>

      <van-icon name="arrow" color="#969799" :data-event="{ id: 'xQ3DcTCy-9' }" />
    </view>
    <view class="box">
      <view class="goods">
        <view class="estimated-delivery-time" @tap="showTimePicker(true)">
          <view class="">送达时间</view>
          <view class="">
            <text v-if="deliveryTimePicker.estimatedTime" style="color: #ee0a24">
              预计{{ deliveryTimePicker.estimatedTime }}送达
            </text>
            <van-icon name="arrow" color="#969799" />
          </view>
        </view>
        <view class="classify-goods-item" v-for="(item, i) in data" :key="i">
          <image
            :src="
              (item.images && JSON.parse(item.images)[0].url) ||
              'https://pub.fsgo365.cn/logo_square.png'
            "
            class="classify-image"
          />
          <view class="classify-goods-item-view">
            <view>
              <view class="c-flex title">
                {{ item.name || item.content }}
                <van-icon
                  v-if="item.desc"
                  class="c-m-l-10"
                  name="info-o"
                  color="#106cff"
                  @click="openMaterialDetail(item.name, item.desc)"
                  :data-event="{ id: '9yyrvTJYlG' }"
                />
              </view>
              <view>
                <text
                  v-if="item.classifyId == '6239294986987325343'"
                  class="desc-tag"
                  style="border: 1px solid #106cff; color: #fff; background-color: #106cff"
                >
                  赠品
                </text>
                <!-- <text class="desc-tag" v-if="item.code">编号：{{ item.code || '' }}</text>
              <text class="desc-tag" v-if="item.type">
                类型：{{ codelabel('materialType', String(item.type)) }}
              </text>
              <text class="desc-tag" v-if="item.exts.brand">品牌：{{ item.exts.brand || '' }}</text> -->
                <text class="spec" v-if="item.spec">
                  规格：{{ item.spec || ''
                  }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
                </text>
                <!-- <text class="desc-tag" v-if="item.model">型号：{{ item.model || '' }}</text> -->
                <!-- <text
                class="desc-tag"
                v-if="item.desc"
                @click="openMaterialDetail(item.name, item.desc)"
                style="border: 1px solid #106cff; color: #106cff" :data-event="{id:'KlfQUhsWtc'}">
                材料介绍
              </text> -->
              </view>
            </view>
            <view class="c-flex c-flex-between c-item-end c-m-t-20">
              <text class="c-red c-bold"></text>
              <text class="c-size-14" style="color: #888888">× {{ item.exts.count }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="voucher">
      <van-tabs wrap-class="c-tabs-wrap" color="#106cff" title-active-color="#106cff">
        <view class="c-line" style="margin: 0 15px"></view>
        <van-tab :title="`可用优惠券(${availableVouchers.length})`">
          <block v-for="(item, i) in availableVouchers" :key="i">
            <view class="coupon">
              <view class="top" :class="item.detailShow ? 'detailShow' : ''">
                <view class="coupon-left">
                  <van-checkbox
                    :value="checkedVoucher._id == item._id"
                    class="c-flex"
                    @change="voucherChange($event, item)"
                  ></van-checkbox>
                  <view class="info">
                    <view class="c-size-14">
                      <!-- 1满赠(满N件赠M件) 2满赠(满N件返费用) 3满赠(满N件返积分) 4满减(满N件减费用) 5满折(满N件折扣) -->
                      <text class="conditionType-tag">
                        {{ format('conditionType', Number(item.conditionType)) }}
                      </text>
                      <text class="title">{{ item.title }}</text>
                    </view>
                    <view class="c-size-12" style="color: #666666; line-height: 19px">
                      使用时间：{{ item.useStartDate.split(' ')[0].replace(/-/g, '.') }}~{{
                        item.useEndDate.split(' ')[0].replace(/-/g, '.')
                      }}
                    </view>
                    <view class="c-size-12" style="color: #666666; line-height: 19px">
                      剩余数量：{{ item.currentCount }}张（每单最多用1张）
                    </view>
                    <view class="c-size-10 c-flex c-item-center" style="margin-top: 8px">
                      <van-icon
                        :name="item.detailShow ? 'arrow-up' : 'arrow-down'"
                        style="
                          border-radius: 50%;
                          padding: 1px;
                          background: #d8d8d8;
                          color: #fff;
                          font-size: 10px;
                          margin-right: 5px;
                        "
                        @click="detailClick(item)"
                        :data-event="{ id: 'Y26_ZDJDKB' }"
                      />
                      <text style="color: #888888">详细信息</text>
                    </view>
                  </view>
                </view>
                <view class="coupon-right bg-blue">
                  <view>
                    <text class="c-size-12">赠</text>
                    <text style="font-size: 45px; margin: 0 5px">{{ item.present }}</text>
                    <text class="c-size-12">件</text>
                  </view>
                  <view class="c-size-12" v-if="item.condition || item.condition === 0">
                    满{{ item.condition }}件可用
                  </view>
                </view>
              </view>
              <view class="bottom" v-if="item.detailShow">
                <view>
                  <view>编号：{{ item.code }}</view>
                  <view v-if="item.memo">使用说明：{{ item.memo }}</view>
                  <view v-if="item.type == '1'" class="c-flex">
                    <text class="c-white-space-nowrap">适用商品：</text>
                    <text>{{ format('goods', item.typeIds, 'multiple') }}</text>
                  </view>
                  <view v-else-if="item.type == '3'" class="c-flex">
                    <text class="c-white-space-nowrap">适用商品类别：</text>
                    <text>{{ format('allClassify', item.typeIds, 'multiple') }}</text>
                  </view>
                  <view v-else-if="item.type == '4'">店铺通用</view>
                  <view v-if="item.conditionType == '1' && item.presentId">
                    赠送商品：{{ format('goods', item.presentId) }}
                  </view>
                </view>
              </view>
            </view>
          </block>
        </van-tab>
        <van-tab :title="`不可用优惠券(${unavailableVouchers.length})`">
          <block v-for="(item, i) in unavailableVouchers" :key="i">
            <view class="coupon" style="opacity: 0.4">
              <view class="top" :class="item.detailShow ? 'detailShow' : ''">
                <view class="coupon-left">
                  <view class="info">
                    <view class="c-size-14">
                      <!-- 1满赠(满N件赠M件) 2满赠(满N件返费用) 3满赠(满N件返积分) 4满减(满N件减费用) 5满折(满N件折扣) -->
                      <text class="conditionType-tag">
                        {{ format('conditionType', Number(item.conditionType)) }}
                      </text>
                      <text>{{ item.title }}</text>
                    </view>
                    <view class="c-size-12" style="color: #666666; line-height: 19px">
                      使用时间：{{ item.useStartDate.split(' ')[0].replace(/-/g, '.') }}~{{
                        item.useEndDate.split(' ')[0].replace(/-/g, '.')
                      }}
                    </view>
                    <view class="c-size-12" style="color: #666666; line-height: 19px">
                      剩余数量：{{ item.currentCount }}张（每单最多用1张）
                    </view>
                    <view class="c-size-12 c-red" style="line-height: 19px">
                      不可用原因：{{ item.unavailabilityReason }}
                    </view>
                    <view class="c-size-12 c-flex c-item-center" style="margin-top: 8px">
                      <van-icon
                        :name="item.detailShow ? 'arrow-up' : 'arrow-down'"
                        style="
                          border-radius: 50%;
                          padding: 1px;
                          background: #d8d8d8;
                          color: #fff;
                          font-size: 10px;
                          margin-right: 5px;
                        "
                        @click="detailClick(item)"
                        :data-event="{ id: 'UjFDIU6wz3' }"
                      />
                      <text style="color: #888888">详细信息</text>
                    </view>
                  </view>
                </view>
                <view class="coupon-right bg-blue">
                  <view>
                    <text class="c-size-12">赠</text>
                    <text style="font-size: 45px; margin: 0 5px">{{ item.present }}</text>
                    <text class="c-size-12">件</text>
                  </view>
                  <view class="c-size-12" v-if="item.condition || item.condition === 0">
                    满{{ item.condition }}件可用
                  </view>
                </view>
              </view>
              <view class="bottom c-m-l-0" v-if="item.detailShow">
                <view>
                  <view>编号：{{ item.code }}</view>
                  <view v-if="item.memo">使用说明：{{ item.memo }}</view>
                  <view v-if="item.type == '1'" class="c-flex">
                    <text class="c-white-space-nowrap">适用商品：</text>
                    <text>{{ format('goods', item.typeIds, 'multiple') }}</text>
                  </view>
                  <view v-else-if="item.type == '3'" class="c-flex">
                    <text class="c-white-space-nowrap">适用商品类别：</text>
                    <text>{{ format('allClassify', item.typeIds, 'multiple') }}</text>
                  </view>
                  <view v-else-if="item.type == '4'">店铺通用</view>
                  <view v-if="item.conditionType == '1' && item.presentId">
                    赠送商品：{{ format('goods', item.presentId) }}
                  </view>
                </view>
              </view>
            </view>
          </block>
        </van-tab>
      </van-tabs>
    </view>
    <van-submit-bar
      :price="totalAmount * 100"
      button-text="提交订单"
      @submit="placeOrder"
      button-class="c-submit-button"
      :data-event="{ id: 'dPkUuTnZiy', capture: false }"
    ></van-submit-bar>
    <!-- 展示材料介绍  -->
    <van-dialog
      :title="material.currentName"
      :show="material.openMaterialDetail"
      use-slot
      @confirm="material.openMaterialDetail = false"
      confirm-button-color="#106cff"
      :data-event="{ id: '7vVwcGPjoZ', capture: false }"
    >
      <view style="height: 50vh; overflow-y: auto; font-size: 14px; padding: 20rpx">
        <rich-text :nodes="material.currentDetail"></rich-text>
      </view>
    </van-dialog>
    <!-- 支付 -->
    <van-popup closeable :show="payment.show" round position="bottom" @close="onPaymentClose()">
      <view class="address-info">
        <view class="Picker-title">请核对订单信息</view>
        <text class="Picker-lable">请仔细核对地址信息，避免误送</text>
      </view>

      <view style="padding: 0px 16px">
        <view class="c-flex c-flex-between c-item-center">
          <text>订单编号：</text>
          <text
            class="c-bold"
            @click="copy(payment.purchaseOrderId)"
            :data-event="{ id: 'eSzgCASNqg' }"
          >
            {{ payment.purchaseOrderId }}
          </text>
        </view>
        <view class="c-flex c-flex-between c-item-center c-m-t-10">
          <text>订单金额：</text>
          <text class="c-bold c-red">¥ {{ payment.totalPrice }}</text>
        </view>
        <view class="c-flex c-flex-between c-item-center c-m-t-10">
          <text>我的信用额度：</text>
          <text class="c-bold">¥ {{ payment.creditLimit }}</text>
        </view>
        <view class="c-flex c-flex-between c-item-center c-m-t-10">
          <text>我的返利额度：</text>
          <text class="c-bold">¥ {{ payment.rewardLimit }}</text>
        </view>
        <view class="c-flex c-flex-between c-item-center c-m-t-10">
          <view>
            最大可用返利额度：
            <van-icon
              name="info"
              class="c-gray"
              @click="toast('最大可用返利额度 = 订单金额 * 可使用返利比例', 'none', 4000)"
              :data-event="{ id: '7oxuHAZ9Oi' }"
            />
          </view>
          <text>
            <text class="c-m-r-10">{{ payment.totalPrice }} * {{ payment.type }}% =</text>
            <text class="c-bold">¥ {{ payment.availableRewardLimit }}</text>
          </text>
        </view>
      </view>

      <view
        class="address-detail"
        @click="doOpen('addresses', { selectedAddressId: address._id })"
        :data-event="{ id: '3a_V0xd2CX' }"
      >
        <view style="margin-right: 8px; min-width: max-content" :data-event="{ id: '3a_V0xd2CX' }">
          <!-- <van-icon name="location-o" :data-event="{id:'3a_V0xd2CX'}" /> -->
          <van-tag type="primary" size="large">配送地址</van-tag>
        </view>
        <view :data-event="{ id: '3a_V0xd2CX' }">
          <!-- <van-tag type="primary">当前地址</van-tag> -->

          <!-- {{
            address.area
              ? areaList.province_list[address.area[0]] +
                areaList.city_list[address.area[1]] +
                areaList.county_list[address.area[2]]
              : ''
          }} -->
          {{ address.subdistrictName }} {{ address.address }}
        </view>
      </view>

      <view class="c-flex c-flex-end c-item-center" style="padding: 0px 16px 10px">
        <van-button
          @click="doOpen('addresses', { selectedAddressId: address._id })"
          round
          type="default"
          custom-style="height:40px;margin-right: 10px;"
          :data-event="{ id: 'I612we5UxC' }"
        >
          切换地址
        </van-button>
        <van-button
          v-if="
            payment.availableRewardLimit >= payment.rewardLimit
              ? payment.rewardLimit + payment.creditLimit >= payment.totalPrice
              : payment.availableRewardLimit + payment.creditLimit >= payment.totalPrice
          "
          round
          type="info"
          custom-style="height:40px"
          color="#106cff"
          @click="payPurchaseOrder()"
          :data-event="{ id: '3mKaepsVir' }"
        >
          确认支付
        </van-button>
        <van-button
          v-else
          round
          type="danger"
          custom-style="height:40px"
          @click="doOpen('/subpackages/wallet/recharge')"
          :data-event="{ id: 'mEq2F_HHSl' }"
        >
          去充值
        </van-button>
      </view>
    </van-popup>
    <van-dialog id="van-dialog" />
    <!-- 配送时间选择器 -->
    <van-popup
      custom-class="deliveryTimePicker-class"
      :show="deliveryTimePicker.show"
      round
      position="bottom"
      closeable
      @close="showTimePicker(false)"
    >
      <view class="address-info">
        <view style="text-align: center" class="Picker-title">预计送达时间</view>
        <view style="text-align: center" class="Picker-lable unfold">
          <view :class="{ 'text-ellipsis': !deliveryTimePicker.isExpanded }" style="flex: 1">
            <!-- 16点前下单预计次日6-8点送达,16点后则为12-14点,节假日配送时效可能变动,实际时间以库房确认为准,加急需求请线下联系业务人员。 -->
            16点前下单送达时间最早可以选择次日上午6-8点，16点后下单则为12-14点，节假日配送时效可能变动，实际时间以库房确认为准，加急需求请线下联系业务人员。
          </view>
          <view
            style="margin-left: 10px"
            @click="deliveryTimePicker.isExpanded = !deliveryTimePicker.isExpanded"
            :data-event="{ id: 'rYRSWfn_9Y' }"
          >
            {{ deliveryTimePicker.isExpanded ? '收起' : '展开' }}
          </view>
        </view>
      </view>
      <view class="scrollToItem">
        <view class="left">
          <view
            @tap="selectTime('date', index)"
            class="leftList"
            :style="{
              backgroundColor: index === deliveryTimePicker.dateIndex ? '#fff' : '',
              color: index === deliveryTimePicker.dateIndex ? '#ee0a24' : ''
            }"
            v-for="(item, index) in deliveryTimePicker.next30Days"
            :key="index"
          >
            {{ item.date }} {{ item.weekday }}
          </view>
        </view>
        <view class="right">
          <view
            class="rightList"
            @tap="selectTime('timer', inx, item.disabled)"
            v-for="(item, inx) in deliveryTimePicker.timeSlots"
            :key="inx"
          >
            <view
              class="time-slot"
              :style="{
                color: item.disabled ? '#ccc' : inx === deliveryTimePicker.timerIndex ? 'red' : ''
              }"
            >
              {{ item.slot }}
              <view class="disabled-message" v-if="item.disabled">该时间段不可选择</view>
            </view>
            <view style="width: 30px; height: 30px">
              <van-icon
                size="22px"
                style="color: red"
                v-if="!item.disabled && inx === deliveryTimePicker.timerIndex"
                name="success"
              />
            </view>
          </view>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
var CutoffTime = 17;
export default {
  data() {
    return {
      phone: '',
      address: {},
      data: [],
      selectAll: false,
      options: {
        codecfg_materialType: { codeId: 'type1' },
        codecfg_unit: { codeId: 'company' },
        codecfg_conditionType: { codeId: 'conditionType' },
        goods: [],
        allClassify: []
      },
      material: {
        openMaterialDetail: false,
        currentName: '',
        currentDetail: ''
      },
      areaList: Object.assign({}, areajs.default),
      availableVouchers: [],
      unavailableVouchers: [],
      checkedVoucher: {},
      totalAmount: 0,
      payment: {
        show: false,
        creditLimit: 0, // 信用额度
        rewardLimit: 0, // 返利额度
        type: 0, // 使用返利比例
        availableRewardLimit: 0, // 可使用返利比例
        totalPrice: 0,
        purchaseOrderId: ''
      },
      timer: null,
      deliveryTimePicker: {
        isExpanded: false, //是否展开
        show: false,
        next30Days: [],
        timeSlots: [
          { slot: '06:00 - 08:00', disabled: true },
          { slot: '10:00 - 12:00', disabled: true },
          { slot: '12:00 - 14:00' },
          { slot: '14:00 - 16:00' },
          { slot: '16:00 - 18:00' },
          { slot: '18:00 - 20:00' }
        ],
        dateIndex: 0, //选择的日期索引
        timerIndex: 0, //选择的时间段索引
        estimatedTime: null //预计送达时间
      }
    };
  },
  onLoad(param) {
    console.log('placeOrder-onLoad');
    common.osg.init(this, param, app);
    this.phone = wx.getStorageSync('user').phone;
    common.osg.codeoption(() => {
      this.data = wx.getStorageSync('orderGoods');
      this.total();
      this.getGoods(() => {
        this.getVouchers();
      });
      this.getAllClassify();
    });
    //查询往后30天的日期 星期几
    this.getNext30Days();
    //更新当前时间 状态
    this.updateTimeSlots(new Date().getHours(), 0);
    //调用一下关闭弹窗按钮
    this.showTimePicker(false);
  },
  watch: {
    'deliveryTimePicker.dateIndex'(newIndex) {
      // this.deliveryTimePicker.timerIndex = 0;
      const currentHour = new Date().getHours();
      // const currentHour = new Date().getMinutes(); // 方便测试;

      this.updateTimeSlots(currentHour, newIndex);
    }
  },
  onShow() {
    common.osg.init(this, {}, app);
    let address = wx.getStorageSync('address');
    if (address) {
      this.address = address;
      wx.removeStorageSync('address');
    } else {
      this.getAddress();
    }
    // 每隔10秒刷新可用额度，防止停留在当前页面时 在其他设备上消耗额度当前页面没有及时刷新问题。同时在充值返回当前页面后，后台审核通过后，能够及时刷新可用额度。
    clearInterval(this.timer);
    this.getPartnerCredit();
    this.timer = setInterval(() => {
      this.getPartnerCredit();
    }, 10000);
  },
  onHide() {
    clearInterval(this.timer);
  },
  onUnload() {
    clearInterval(this.timer);
  },
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    getAddress() {
      common.osg.ajax(
        'basic/address/query',
        {
          _all: '1',
          userId: wx.getStorageSync('user')._id,
          'is:state|integer#and': 1,
          sortField: 'isDefault',
          sortOrder: 'desc'
        },
        res => {
          this.address = res.data[0] || {};
        }
      );
    },
    changeAddress(item) {
      this.address = item;
    },
    getGoods(callback) {
      common.osg.ajax(
        'biz/goods/queryGoods',
        {
          _all: '1',
          classifyId: '1928070664098434877', // 材料
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.label = item.name;
            item.value = item._id;
          });
          this.options.goods = res.data;
          if (callback) callback();
        },
        {
          noload: true
        }
      );
    },
    getAllClassify() {
      common.osg.ajax(
        '/biz/classify/queryWithSmooth',
        {
          'is:state|integer#and': 1
        },
        res => {
          res.data.map(item => {
            item.label = item.name;
            item.value = item._id;
          });
          this.options.allClassify = res.data;
        },
        {
          noload: true
        }
      );
    },
    openMaterialDetail(name, detail) {
      this.material.currentName = name;
      this.material.currentDetail = detail.replace(/<img /g, '<br><img style="max-width:100%" ');
      this.material.openMaterialDetail = true;
    },
    getVouchers() {
      common.osg.ajax(
        'biz/voucher/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          let availableVouchers = [];
          let unavailableVouchers = [];
          res.data.map(item => {
            item.detailShow = false;
          });
          // for (let i = 0; i < res.data.length; i++) {
          //   let item = res.data[i];
          //   item.detailShow = false;
          //   item.unavailabilityReason = '';

          //   // 判断使用时间
          //   let verify1 = true;
          //   let now = new Date().getTime();
          //   let useStartDate = new Date(item.useStartDate).getTime();
          //   let useEndDate = new Date(item.useEndDate).getTime();
          //   if (now < useStartDate || now > useEndDate) {
          //     verify1 = false;
          //     item.unavailabilityReason = '当前时间不在优惠券使用时间范围内；';
          //   }

          //   // 判断使用范围和对应数量 1：适用材料 2：机措 3：商品分类 4：店铺通用
          //   let verify2 = true;
          //   if (item.type == 1 || item.type == 2) {
          //     // 1按材料 2按机措匹配
          //     // 满赠
          //     if (item.conditionType == 1) {
          //       let availableTotal = 0;
          //       this.data.map(good => {
          //         if (item.typeIds.indexOf(good._id) != -1) {
          //           availableTotal += good.exts.count;
          //         }
          //       });
          //       if (availableTotal == 0) {
          //         verify2 = false;
          //         item.unavailabilityReason += '当前订单内没有适用此优惠券的商品；';
          //       } else if (availableTotal < item.condition) {
          //         verify2 = false;
          //         item.unavailabilityReason += `当前订单内适用此优惠券的商品数为${availableTotal}个，少于${item.condition}个；`;
          //       }
          //     }
          //   } else if (item.type == 3) {
          //     // 3按商品分类匹配
          //     // 满赠
          //     if (item.conditionType == 1) {
          //       let availableTotal = 0;
          //       this.data.map(good => {
          //         if (item.typeIds.indexOf(good.classifyId) != -1) {
          //           availableTotal += good.exts.count;
          //         }
          //       });
          //       if (availableTotal == 0) {
          //         verify2 = false;
          //         item.unavailabilityReason += '当前订单内没有适用此优惠券商品分类的商品；';
          //       } else if (availableTotal < item.condition) {
          //         verify2 = false;
          //         item.unavailabilityReason += `当前订单内适用此优惠券商品分类的商品数为${availableTotal}个，少于${item.condition}个；`;
          //       }
          //     }
          //   } else if (item.type == 4) {
          //     // 4店铺通用
          //     // 满赠
          //     if (item.conditionType == 1) {
          //       let availableTotal = 0;
          //       this.data.map(good => {
          //         availableTotal += good.exts.count;
          //       });
          //       if (availableTotal < item.condition) {
          //         verify2 = false;
          //         item.unavailabilityReason += `当前订单商品总数为${availableTotal}个，少于${item.condition}个；`;
          //       }
          //     }
          //   }

          //   // 以上条件均满足 此优惠券可用
          //   if (verify1 && verify2) {
          //     availableVouchers.push(item);
          //   } else {
          //     unavailableVouchers.push(item);
          //   }
          // }
          this.availableVouchers = res.data || availableVouchers;
          this.unavailableVouchers = res.data || unavailableVouchers;

          // 默认选中第一张可用优惠券，并将赠品放入商品列表
          if (this.availableVouchers.length > 0) {
            let voucher = this.availableVouchers[0];
            this.checkedVoucher = voucher;
            if (voucher.conditionType == 1 && voucher.presentId) {
              for (let i = 0; i < this.options.goods.length; i++) {
                let good = this.options.goods[i];
                // 查找赠品
                if (voucher.presentId == good._id) {
                  good.exts = good.exts || {};
                  good.exts.count = voucher.present; // 赠送件数
                  this.data.push(good);
                  break;
                }
              }
            }
          }
        }
      );
    },
    detailClick(item) {
      item.detailShow = !item.detailShow;
    },
    voucherChange(e, item) {
      // 从商品列表删除上次优惠券的赠品
      if (this.checkedVoucher.conditionType == 1 && this.checkedVoucher.presentId) {
        if (
          this.data[this.data.length - 1].exts &&
          this.data[this.data.length - 1].classifyId == '6239294986987325343'
        ) {
          this.data = this.data.splice(0, this.data.length - 1);
        }
      }
      if (e.detail) {
        this.checkedVoucher = item;
        // 选择满赠类型优惠券，将赠品放入商品列表
        let voucher = this.checkedVoucher;
        if (voucher.conditionType == 1 && voucher.presentId) {
          for (let i = 0; i < this.options.goods.length; i++) {
            let good = this.options.goods[i];
            // 查找赠品
            if (voucher.presentId == good._id) {
              good.exts = good.exts || {};
              good.exts.count = voucher.present; // 赠送件数
              this.data.push(good);
              break;
            }
          }
        }
      } else {
        this.checkedVoucher = {};
      }
    },
    format(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    total() {
      let totalAmount = 0;
      this.data.map(item => {
        if (item.classifyId != '6239294986987325343')
          totalAmount += item.exts.count * (item.price || 0);
      });
      this.totalAmount = totalAmount;
    },
    placeOrder() {
      if (!this.address._id) {
        common.osg.toast('请选择收货地址！', 'none');
        return;
      }

      if (!this.deliveryTimePicker.estimatedTime) {
        return common.osg.toast('请填写送达时间！', 'none');
      }

      common.osg.ajax(
        'basic/purchaseOrder/upsert',
        {
          data: JSON.stringify({
            purchaseName: this.address.name,
            purchasePhone: this.address.phone,
            purchaseAdress: this.address.address,
            area: this.address.area,
            province: this.address.province,
            city: this.address.city,
            district: this.address.district,
            subdistrict: this.address.subdistrict,
            address: this.address.address,
            materialList: this.data,
            voucherId: this.checkedVoucher._id,
            totalPrice: this.totalAmount,
            payState: 0, // 支付状态: 0未支付
            exts: {
              expectedArrivalime: this.deliveryTimePicker.estimatedTime //预计送达时间
            }
          })
        },
        res => {
          // 清楚购物车中已下单的商品
          let cart = wx.getStorageSync(`cart_${this.phone}`);
          let newCart = [];
          let materialIds = this.data.map(item => item._id);
          cart.map(item => {
            if (materialIds.indexOf(item._id) == -1) {
              newCart.push(item);
            }
          });
          wx.setStorageSync(`cart_${this.phone}`, newCart);
          this.payment.purchaseOrderId = res.entity._id;
          this.payment.totalPrice = this.totalAmount;
          this.payment.show = true;
          this.getPartnerCredit();
        }
      );
    },
    // 获取信用账户可用额度
    getPartnerCredit() {
      common.osg.ajax(
        '/basic/partnerCredit/show',
        {},
        res => {
          this.payment.creditLimit = res.data.creditLimit;
          this.payment.rewardLimit = res.data.rewardLimit || 0;
          this.payment.type = res.data.type || 0;
          this.payment.availableRewardLimit = Number(
            (parseInt(this.payment.totalPrice * this.payment.type) / 100).toFixed(2)
          );
        },
        { noload: true }
      );
    },
    // 支付采购订单
    payPurchaseOrder() {
      const { dateIndex, timerIndex } = this.deliveryTimePicker;
      let message = '支付成功！';
      if (dateIndex === 0 && (timerIndex === 0 || timerIndex === 1)) {
        //检查一下 当前选择的时间 是否是明天 并且 当前时间是否是16点后
        const shouldDisable = new Date().getHours() >= CutoffTime;
        //const shouldDisable = new Date().getMinutes() >= CutoffTime; //方便测试
        if (shouldDisable) {
          this.deliveryTimePicker.timerIndex = 2;
          let Date = this.deliveryTimePicker.next30Days[this.deliveryTimePicker.dateIndex].date;
          let TimeSlot = this.deliveryTimePicker.timeSlots[this.deliveryTimePicker.timerIndex].slot;
          let endTime = TimeSlot.split(' - ')[1];
          this.deliveryTimePicker.estimatedTime = `${Date} ${TimeSlot}`;
          message = `支付成功！由于您提交订单时间较晚，送货时间已更新为次日中午 ${endTime}`;
        }
      }
      common.osg.ajax(
        '/basic/partnerCreditItem/payPurchaseOrder',
        { purchaseOrderId: this.payment.purchaseOrderId },
        res => {
          this.payment.show = false;
          common.osg.alert(message, () => {
            wx.navigateBack({
              delta: 1
            });
          });
        }
      );
    },
    // 关闭(取消)支付窗口
    onPaymentClose() {
      this.payment.show = false;
      common.osg.alert('取消支付，可在采购订单列表继续支付！', () => {
        wx.navigateBack({
          delta: 1
        });
      });
    },
    // 复制到剪切板
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    toast(msg, icon, duration) {
      common.osg.toast(msg, icon, duration);
    },

    //打开 关闭预计送达时间选择器
    showTimePicker(type) {
      this.deliveryTimePicker.show = type;
      if (!type) {
        let Date = this.deliveryTimePicker.next30Days[this.deliveryTimePicker.dateIndex].date;
        let TimeSlot = this.deliveryTimePicker.timeSlots[this.deliveryTimePicker.timerIndex].slot;
        // let endTime = TimeSlot.split(' - ')[1];
        this.deliveryTimePicker.estimatedTime = `${Date} ${TimeSlot}`;
        console.log(this.deliveryTimePicker.estimatedTime);
      }
    },
    //是否更新前两个时间段的禁用状态
    updateTimeSlots(currentHour, newIndex) {
      //日期选择的是今天 并且当前已经超出下午四点了
      const shouldDisable = currentHour >= CutoffTime && newIndex === 0;
      // const shouldDisable = currentHour >= CutoffTime && newIndex === 0;
      //然后默认更改时间段为2
      if (shouldDisable) {
        this.deliveryTimePicker.timerIndex = 2;
      }
      // 禁用掉一些 时间段
      this.deliveryTimePicker.timeSlots = this.deliveryTimePicker.timeSlots.map((item, index) => {
        if (index === 0 || index === 1) {
          return { ...item, disabled: shouldDisable };
        }
        return item;
      });
    },
    //选择的时间段
    selectTime(type, i, disabled = false) {
      if (disabled) return this.toast('当前时间段不可以选择', 'none');
      //给对应的参数赋值
      this.deliveryTimePicker[`${type}Index`] = i;
      // 当选择时间段段段时候  调用一下关闭弹窗按钮
      if (type == 'timer') {
        this.showTimePicker(false);
      }
    },
    //计算当前时间 推算出往后三十天的日子
    getNext30Days() {
      const today = new Date();
      const next30Days = [];
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

      for (let i = 1; i < 30; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        const month = (futureDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
        const day = futureDate.getDate().toString().padStart(2, '0');
        let weekday;
        switch (i) {
          case 1:
            weekday = '明天';
            break;
          case 2:
            weekday = '后天';
            break;
          default:
            weekday = weekdays[futureDate.getDay()];
        }
        next30Days.push({
          date: `${month}月${day}日`,
          weekday: weekday
        });
      }
      this.deliveryTimePicker.next30Days = next30Days;
      // return next30Days;
    }
  }
};
</script>

<style lang="scss">
.placeOrder {
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
  .address-view {
    display: flex;
    align-items: center;
    background: #fff;
    width: 100vw;
    padding: 10px;
    position: relative;
    box-sizing: border-box;
    .area {
      font-size: 17px;
      font-weight: 500;
    }
    .address {
      font-size: 17px;
      font-weight: 500;
    }
    .name {
      font-size: 13px;
      margin-right: 20px;
    }
    .phone {
      font-size: 13px;
      margin-right: 20px;
    }
    van-tag {
      display: flex;
    }
  }
  // .address-view::before {
  //   position: absolute;
  //   right: 0;
  //   bottom: 0;
  //   left: 0;
  //   height: 2px;
  //   background: repeating-linear-gradient(
  //     -45deg,
  //     #ffd700 0,
  //     #ffd700 20%,
  //     transparent 0,
  //     transparent 25%,
  //     #106cff 0,
  //     #106cff 45%,
  //     transparent 0,
  //     transparent 50%
  //   );
  //   background-size: 80px;
  //   content: '';
  // }
  .box {
    .goods {
      padding: 5px 10px;
      background-color: #fff;
      margin: 10px auto;
      padding: 10px;

      .estimated-delivery-time {
        font-size: 32rpx;
        font-weight: 700;
        color: #333333;
        display: flex;
        justify-content: space-between;
      }
      .classify-goods-item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 10px 15px;
        .classify-image {
          width: 80px;
          height: 80px;
          margin-right: 10px;
          border-radius: 5px;
        }
        .classify-goods-item-view {
          flex: 1;
          min-height: 80px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .title {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 19px;
          }
          .spec {
            font-size: 11px;
            line-height: 15px;
            color: #888888;
          }
          .desc-tag {
            margin: 6px 6px 0 0;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 11px;
            display: inline-flex;
            border: 1px solid #ebedf0;
            color: #646566;
          }
        }
      }
      .classify-goods-item:last-child {
        border: none;
      }
    }
  }

  .deliveryTimePicker-class {
    height: 60vh;
    display: flex;
    flex-direction: column;
    .address-info {
      padding: 0px 20px;
      .unfold {
        display: flex;
        justify-content: space-between;
        .text-ellipsis {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .scrollToItem {
      flex: 1;
      display: flex;
      background-color: #f1f1f1;
      font-size: 34rpx;
      font-weight: 600;
      overflow-y: auto;
      .left {
        width: 45vw;
        height: 100%;
        font-size: 32rpx;
        overflow-y: auto;
        .leftList {
          padding: 44rpx 0px;
          text-align: center;
        }
      }
      .right {
        width: 70vw;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        .rightList {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .time-slot {
            width: 300rpx;
            text-align: center;
            .disabled-message {
              font-size: 26rpx;
            }
          }
        }
      }
    }
  }

  .Picker-title {
    font-weight: bolder;
    font-size: 36rpx;
    color: #000;
  }
  .Picker-lable {
    margin-top: 10rpx;
    font-size: 26rpx;
    color: #ccc;
  }
  .address-info {
    margin: 10px 0px;
    text-align: center;
  }

  .address-detail {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    margin: 15px 8px;
    padding: 10px 8px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 34rpx;
    color: #000;
  }

  .voucher {
    margin: 0 15px 15px;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    .coupon {
      margin: 10px 15px;
      overflow: hidden;
      border-radius: 10px;
      background: #f1f3f8;
      .bottom {
        // background: rgb(253, 253, 253);
        margin-left: 30px;
        margin-top: 3px;
        padding: 6px 10px;
        font-size: 10px;
        color: #888888;
        line-height: 28rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn {
          padding: 2px 10px;
          font-size: 12px;
          border: 1px solid #646566;
          border-radius: 100px;
        }
      }
      .top {
        display: flex;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.06);
        > view {
          position: relative;
          display: flex;
        }
      }
      .coupon-left {
        padding: 10px;
        width: 75%;
        box-sizing: border-box;
        // background-color: #fff;
        > view {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
        .img {
          margin-right: 10px;
          image {
            width: 60px;
            height: 60px;
          }
        }
        .info {
          flex: 1;
        }
        .conditionType-tag {
          width: 75rpx;
          height: 30rpx;
          color: #106cff;
          background: #d1e6fe;
          box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.06);
          border: 1rpx solid #106cff;
          border-radius: 15rpx;
          margin-right: 5px;
          font-size: 10px;
          padding: 0 8px;
        }
        .title {
          font-size: 15px;
          font-weight: 500;
          color: #333333;
          line-height: 42rpx;
        }
      }
      .coupon-left::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 4px;
        height: 4px;
        border-radius: 0 0 0 4px;
        background: #fff;
      }
      .coupon-left::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 4px;
        height: 4px;
        border-radius: 4px 0 0 0;
        background: #fff;
      }
      .detailShow .coupon-left::after {
        background: #f1f3f8;
      }
      .coupon-right {
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
      .bg-blue {
        background: linear-gradient(to bottom right, rgb(118, 180, 249), rgb(49, 105, 249));
      }
      .bg-yellow {
        background: linear-gradient(to bottom right, rgb(237, 205, 139), rgb(218, 172, 107));
      }
      .bg-red {
        background: linear-gradient(to bottom right, rgb(236, 93, 106), #d6000f);
      }
      .bg-gray {
        background: linear-gradient(to bottom right, rgb(217, 217, 217), rgb(194, 194, 194));
      }
      .coupon-right::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 4px;
        border-radius: 0 0 4px 0;
        background: #fff;
      }
      .coupon-right::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 4px;
        height: 4px;
        border-radius: 0 4px 0 0;
        background: #fff;
      }
      .detailShow .coupon-right::after {
        background: #f1f3f8;
      }
    }
  }
  .van-submit-bar {
    // .van-submit-bar__text {
    //   visibility: hidden;
    // }
    .c-submit-button {
      background: #106cff;
      border-color: #106cff;
    }
  }
}
</style>
