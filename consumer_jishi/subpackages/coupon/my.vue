<template>
  <view class="my">
    <view class="content">
      <!-- 优惠券 -->
      <block v-for="(item, i) in fpi.data" :key="i">
        <view
          class="coupon"
          :style="item.detailShow ? '' : 'height:100px'"
          v-if="discountTypes ? discountTypes == item.type : true"
        >
          <view class="top">
            <view class="coupon-left">
              <!-- <view class="img">
                <image src="../../static/images/store.jpg"></image>
              </view> -->
              <view class="info">
                <view class="c-size-14 c-flex c-item-center">
                  <text class="tag c-bg-red" v-if="item.type == '5'">
                    {{ item.couponType == '1' ? '循环满减券' : '阶梯满减券' }}
                  </text>
                  <text
                    v-else
                    class="tag"
                    :class="
                      item.type == '1'
                        ? 'c-bg-blue'
                        : item.type == '2'
                        ? 'c-bg-reddish-orange'
                        : 'c-bg-red'
                    "
                  >
                    {{ format('discountType', item.type) }}
                  </text>
                  <text>{{ item.title }}</text>
                </view>
                <view class="c-size-12">激活时间：{{ item.activationDate || '未激活' }}</view>
                <view class="c-size-12">失效时间：{{ item.dueDate || '永久有效' }}</view>
                <view class="c-size-12 c-flex c-flex-between c-item-center">
                  <text style="color: #8e8e8e">详细信息</text>
                  <view
                    style="
                      border-radius: 50%;
                      padding: 2px;
                      background: #d9d9d9;
                      display: flex;
                      align-items: center;
                      width: 12px;
                      height: 12px;
                    "
                    @click="detailClick(item)"
                  >
                    <uni-icons
                      :type="item.detailShow ? 'up' : 'down'"
                      color="#fff"
                      size="12"
                    ></uni-icons>
                  </view>
                </view>
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
            </view>
          </view>
          <view class="bottom">
            <view>
              <view>券号：{{ item._id }}</view>
              <view>价格：{{ item.price || 0 }}元</view>
              <view v-if="item.description">使用说明：{{ item.description }}</view>
            </view>
            <view class="c-flex" v-if="item.price > 0">
              <!-- <view class="btn" style="margin-right: 3vw">修改</view> -->
              <view class="btn" v-if="item.status == 5">退款处理中</view>
              <view class="btn" @click="refund(item)" v-else>退款</view>
            </view>
          </view>
        </view>
      </block>
      <!-- 服务券 -->
      <block v-for="(item, i) in serviceVoucherList.data" :key="i">
        <view class="coupon" :style="item.detailShow ? '' : 'height:100px'">
          <view class="top">
            <view class="coupon-left">
              <view class="info">
                <view class="c-size-14 c-flex c-item-center">
                  <text class="tag c-bg-golden-orange">
                    {{ format('serviceVoucherType', item.type) }}
                  </text>
                  <text>{{ item.title }}</text>
                </view>
                <view class="c-size-12">激活时间：{{ item.updateTime || '未激活' }}</view>
                <view class="c-size-12">失效时间：{{ item.useEndDate || '永久有效' }}</view>

                <view class="c-size-12 c-flex c-flex-between c-item-center">
                  <text style="color: #8e8e8e">详细信息</text>
                  <view
                    style="
                      border-radius: 50%;
                      padding: 2px;
                      background: #d9d9d9;
                      display: flex;
                      align-items: center;
                      width: 12px;
                      height: 12px;
                    "
                    @click="detailClick(item)"
                  >
                    <uni-icons
                      :type="item.detailShow ? 'up' : 'down'"
                      color="#fff"
                      size="12"
                    ></uni-icons>
                  </view>
                </view>
              </view>
            </view>
            <view class="coupon-right c-bg-golden-orange">
              <view>
                <text class="c-size-20 c-bold">
                  {{ format('serviceVoucherType', item.type) }}
                </text>
              </view>
              <view
                style="
                  padding: 2px 10px;
                  margin-top: 10px;
                  font-size: 12px;
                  border-radius: 100px;
                  background: #fff;
                  color: rgb(49, 105, 249);
                "
                class="c-yellow"
                @click="onBookNowClick(item)"
              >
                {{ item.status == '2' ? '立即预约' : '取消预约' }}
              </view>

              <view class="ribbon">
                {{ format('serviceVoucherStatus', item.status) }}
              </view>
            </view>
            <image
              src="../../static/images/have.png"
              v-if="item.couponPrintCount > 0"
              mode="widthFix"
              class="stamp"
            ></image>
          </view>

          <view class="bottom">
            <view class="">
              <view>服务券价格：{{ item.price || 0 }}元</view>
              <view v-if="item.duration">
                有效时长：{{ item.duration ? `领取后${item.duration}天内有效` : '永久有效' }}
              </view>
              <view v-if="item.eachDelivery">领取规则：每人最多领取{{ item.eachDelivery }}张</view>
              <view v-if="item.memo">使用说明：{{ item.memo }}</view>
            </view>
          </view>
        </view>
      </block>
    </view>

    <view v-if="fpi.total == 0 && serviceVoucherList.total == 0" class="c-uni-empty">
      <image src="https://pub.fsgo365.cn/empty.png"></image>
      <text>您还没有优惠券，去领券中心看看吧~</text>
    </view>

    <view class="footer">
      <view @click="open('mall')">
        <image
          src="https://pub.fsgo365.cn/icon-coupon-primary.png"
          mode="widthFix"
          class="c-m-r-10"
          style="width: 16px"
        ></image>
        领券中心
      </view>
      <view @click="open('record', { type })">
        <image
          src="https://pub.fsgo365.cn/icon-orders-primary.png"
          mode="widthFix"
          class="c-m-r-10"
          style="width: 16px"
        ></image>
        使用记录
      </view>
    </view>

    <!-- 服务券预约弹窗 -->
    <uni-popup ref="popup" background-color="#fff" is-mask-click>
      <view class="popup-content">
        <view class="contentBox">
          <image
            style="width: 130rpx; height: 130rpx; margin: 10px 0px 20px"
            src="https://pub.fsgo365.cn/icon-appointment.png"
          ></image>
          <view class="c-size-18" style="margin: 10px 0px; font-weight: bolder">服务预约</view>
          <view class="c-size-14 c-gray-7">我们将会在十分钟内联系您</view>
        </view>
        <view class="form-group">
          <view class="form-item">
            <view class="label c-gray-7">姓名</view>
            <view class="value">
              <input type="text" v-model="formData.name" />
            </view>
          </view>
          <view class="form-item">
            <view class="label c-gray-7">联系方式</view>
            <view class="value">
              <input type="number" maxlength="11" v-model="formData.phone" />
            </view>
          </view>
          <view class="form-item" @click.native.stop="dataPickerShow()">
            <view class="label c-gray-7">省市区</view>
            <view class="value">{{ formData.areaName }}</view>
          </view>
          <view class="form-item">
            <view class="label c-gray-7">服务地址</view>
            <view class="value">
              <input type="text" v-model="formData.address" />
            </view>
          </view>
        </view>
        <view class="button-group">
          <view class="btn cancel" @click="onCancel">取消</view>
          <view class="btn confirm" @click="onConfirm">立即预约</view>
        </view>
      </view>
    </uni-popup>

    <block v-if="show">
      <uni-data-picker
        key="uniAreaPicker"
        ref="uniAreaPicker"
        :value="formData.area"
        popup-title="省市区"
        :localdata="area.areaList"
        :map="{
          text: 'label',
          value: 'value'
        }"
        @change="areaConfirm($event, 'area')"
        class="c-data-picker"
      >
        <view class=""></view>
      </uni-data-picker>
    </block>
    <!-- 提示窗示例 -->
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog
        type="error"
        cancelText="取消"
        confirmText="确定"
        title="提醒"
        content="确定要取消预约吗"
        @confirm="dialogConfirm"
        @close="dialogClose"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../common/common.js');
export default {
  data() {
    return {
      load: false,
      type: '1',
      discountTypes: '',
      fpi: {
        data: []
      },
      serviceVoucherList: {
        data: [] //服务券列表
      },
      options: {
        codecfg_discountType: { codeId: 'CpsDiscountType' },
        codecfg_serviceVoucherType: { codeId: 'serviceVoucherType' }, //服务券的字典项
        codecfg_serviceVoucherStatus: { codeId: 'serviceVoucherStatus' }, //服务券的状态
        discountType: []
      },
      tabList: [
        { type: '1', label: '优惠券', options: 'discountType' },
        { type: '2', label: '服务券', options: 'serviceVoucherType' }
      ],
      formData: {
        area: []
      },
      // 省市区选择
      area: {
        areaList: []
      },
      //预约对象
      reservationObj: {},
      show: false
    };
  },
  onLoad(params) {
    this.load = true;
    common.osg.init(this, params, app);

    console.log('112233', params);
    const { type } = params;
    if (type) {
      this.type = type;
      console.log(112233, this.type);
    }
    common.osg.codeoption(() => {
      this.getData();
      this.getServiceVoucherData();
    });
    this.getArea();
  },
  onShow() {
    if (this.load) {
      this.load = false;
    } else {
      common.osg.init(this, {}, app);
      // common.osg.codeoption(() => {
      this.getData();
      // });
    }
  },
  methods: {
    getData() {
      common.osg.ajax(
        'basic/couponPrinting/query',
        {
          _all: '1',
          tenantId: '4670873342363649607',
          'is:state|integer#and': 1,
          'in:status|array-integer#and': '2,3,5',
          userId: wx.getStorageSync('user')._id,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          res.data.map(item => {
            item.detailShow = false;
          });
          this.fpi = res;
        }
      );
    },
    detailClick(item) {
      item.detailShow = !item.detailShow;
    },
    discountTypeClick(val) {
      if (this.discountTypes == val) {
        this.discountTypes = '';
      } else {
        this.discountTypes = val;
      }
    },
    open(url, params) {
      common.osg.open(url, params);
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
    refund(item) {
      common.osg.confirm(`您选择了"${item.title}"，是否确认退款？`, () => {
        common.osg.ajax(`/basic/couponPrinting/refund/${item._id}`, {}, res => {
          common.osg.toast('您已申请退款，请耐心等待业务人员处理。', 'none');
          this.getData();
        });
      });
    },
    //优惠券 还是服务券 切换
    handleClick(type) {
      this.type = type;
    },
    //获取服务券列表数据
    getServiceVoucherData() {
      let params = {
        _all: '1',
        tenantId: '4670873342363649607',
        'is:state|integer#and': 1,
        'in:status|array-integer#and': '2,3,4',
        userId: wx.getStorageSync('user')._id,
        sortField: 'createTime',
        sortOrder: 'desc'
      };

      common.osg.ajax(
        '/basic/serviceCoupon/query',
        params,
        res => {
          res.data.map(item => {
            item.exts = item.exts || {};
            item.detailShow = false;
            item.num = 1;
          });
          this.serviceVoucherList = res;
        },
        {
          noload: true
        }
      );
    },
    //点击服务券 立即预约
    onBookNowClick(item) {
      this.reservationObj = item;
      if (item.status == 2) {
        this.formData.scId = item._id;
        this.$refs.popup.open();
      } else {
        //打开弹出层
        this.$refs.alertDialog.open();
      }
    },
    //预约弹窗取消事件
    onCancel() {
      this.$refs.popup.close();
      this.formData = {
        area: []
      };
    },
    //确定取消预约
    dialogConfirm() {
      const { _id } = this.reservationObj;
      let params = {
        scId: _id,
        appointment: 'cancel'
      };
      //取消预约
      common.osg.ajax(
        '/basic/serviceCoupon/appointment',
        { data: JSON.stringify(params) },
        res => {
          common.osg.toast('取消预约成功~', 'success');
          this.getServiceVoucherData();
        },
        {
          noload: true
        }
      );
    },
    //取消 取消预约弹窗
    dialogClose() {
      this.$refs.alertDialog.close();
    },
    //预约表单立即预约时间
    onConfirm() {
      if (!this.validateForm()) {
        return;
      }

      common.osg.ajax(
        '/basic/serviceCoupon/appointment',
        { data: JSON.stringify(this.formData) },
        res => {
          common.osg.toast('预约成功~', 'success');
          this.getServiceVoucherData();
        },
        {
          noload: true
        }
      );
      this.onCancel();
    },

    // 表单验证
    validateForm() {
      switch (true) {
        case !this.formData.name:
          common.osg.toast('请输入姓名', 'none');
          return false;

        case !this.formData.phone:
          common.osg.toast('请输入联系方式', 'none');
          return false;

        case !/^1[3-9]\d{9}$/.test(this.formData.phone):
          common.osg.toast('请输入正确的手机号码', 'none');
          return false;

        case !this.formData.areaName:
          common.osg.toast('请选择省市区', 'none');
          return false;

        case !this.formData.address:
          common.osg.toast('请输入服务地址', 'none');
          return false;

        default:
          return true;
      }
    },

    //拿到省市区的数据
    getArea() {
      common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
        this.area = res;
      });
    },
    //联机选择器 状态改变时间
    areaConfirm(e) {
      const { detail } = e;
      this.formData.areaName = '';
      this.formData.area = [];
      ['province', 'city', 'district'].forEach((key, index) => {
        this.formData[key] = detail.value[index].value;
        this.formData.area.push(detail.value[index].value);

        this.formData.areaName += detail.value[index].text;
      });
      console.log('223344', this.formData);

      this.$refs.uniAreaPicker.hide();
      this.show = false;
    },
    dataPickerShow() {
      this.show = true;
      setTimeout(() => {
        this.$refs.uniAreaPicker.show();
      }, 10);
    }
  }
};
</script>

<style lang="scss">
.my {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .header {
    background: #fff;
    > view {
      display: flex;
      padding: 0 3vw;
      height: 40px;
      box-sizing: border-box;
      align-items: center;
      border-bottom: 1px solid #f5f5f5;
    }
    .type {
      > view {
        margin-right: 3vw;
      }
    }
    .filter {
      white-space: nowrap;
      overflow-x: auto;
      > view {
        padding: 1vw 3vw;
        margin-right: 3vw;
        border: 1px solid transparent;
        background-color: #f5f5f5;
        border-radius: 999px;
        font-size: 12px;
      }
    }
  }
  .content {
    flex: 1;
    overflow-y: auto;
    background: #f8f8f8;
    padding-bottom: 80px;
    .coupon {
      margin: 3vw;
      overflow: hidden;
      border-radius: 5px 5px 3px 3px;
      background: rgb(253, 253, 253);
      .bottom {
        background: rgb(253, 253, 253);
        margin-top: 3px;
        padding: 3vw;
        font-size: 12px;
        color: #aaa;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn {
          padding: 2px 10px;
          font-size: 12px;
          border: 1px solid #aaa;
          border-radius: 100px;
        }
      }
      .top {
        height: 100px;
        display: flex;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
        > view {
          position: relative;
          display: flex;
        }
      }
      .coupon-left {
        padding: 3vw;
        width: 70%;
        box-sizing: border-box;
        background-color: #fff;
        > view {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
        .img {
          margin-right: 3vw;
          image {
            width: 60px;
            height: 60px;
          }
        }
        .info {
          flex: 1;
        }
        .tag {
          color: #fff;
          background: rgb(49, 105, 249);
          font-size: 10px;
          border-radius: 100px;
          padding: 0 4px;
          margin-right: 5px;
          white-space: nowrap;
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
        background: #f8f8f8;
      }
      .coupon-left::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 4px;
        height: 4px;
        border-radius: 4px 0 0 0;
        background: #f8f8f8;
      }
      .coupon-right {
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        position: relative;
        overflow: hidden;

        .ribbon {
          position: absolute;
          top: 10px;
          right: -30px;
          width: 100px;
          height: 20px;
          background: #ff4d4f;
          transform: rotate(45deg);
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          color: #fff;
          font-size: 10px;
        }
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
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    display: flex;
    background-color: #fff;
    width: 100vw;
    padding-bottom: env(safe-area-inset-bottom);
    > view {
      flex: 1;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .empty1 .van-empty {
    height: calc(100vh - 140px);
  }
  .empty2 .van-empty {
    height: calc(100vh - 100px);
  }
}

.popup-content {
  width: 75vw;
  height: auto;
  background-color: #fff;
  border-radius: 20px;
  padding: 25px;
  box-sizing: border-box;
  .contentBox {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #fff;
  }
  .form-group {
    padding: 5px 0px;
    font-size: 14px;
    .form-item {
      padding: 10px 0px;
      margin: 10px 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #646566;
      .label {
        width: max-content;
        min-width: 120rpx;
        text-align-last: justify;

        position: relative;
        font-weight: 400;
      }
      .label::after {
        position: absolute;
        content: ':';
        right: -10px;
        top: 0px;
      }
      .value {
        margin-left: 12px;
        flex: 1;
        text-align: right;
      }
    }
  }
  .button-group {
    display: flex;
    justify-content: space-between;

    .btn {
      width: max-content;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 10px;
      font-size: 14px;
      margin-top: 10px;

      &.cancel {
        padding: 0px 20px;
        line-height: 36px;
        border: 1px solid #646566;
        color: #646566;
        box-sizing: border-box;
      }

      &.confirm {
        padding: 0px 40px;
        background: linear-gradient(to right, #f8616a, #e42430);
        color: #fff;
      }
    }
  }
}
</style>
