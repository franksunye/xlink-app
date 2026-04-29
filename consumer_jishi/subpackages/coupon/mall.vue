<template>
  <view class="mall">
    <!-- 当选择的是优惠券的时候 -->
    <view class="content" v-if="!empty">
      <block v-for="(item, i) in fpi.data" :key="i">
        <view
          class="coupon"
          :style="item.detailShow ? '' : 'height:100px'"
          v-if="(discountTypes ? discountTypes == item.type : true) && item.stock > 0"
        >
          <view class="top">
            <view class="coupon-left">
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
                <view class="c-size-12">
                  活动时间：{{
                    item.startDate ? item.startDate.split(' ')[0].replace(/-/g, '.') : ''
                  }}-{{ item.endDate ? item.endDate.split(' ')[0].replace(/-/g, '.') : '' }}
                </view>
                <view class="c-size-12">
                  使用时间：{{
                    item.startCouponDate
                      ? item.startCouponDate.split(' ')[0].replace(/-/g, '.')
                      : ''
                  }}-{{
                    item.endCouponDate ? item.endCouponDate.split(' ')[0].replace(/-/g, '.') : ''
                  }}
                </view>
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
                    @click="iconClick(item)"
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
                item.type == '1' ? 'bg-blue' : item.type == '2' ? 'c-bg-reddish-orange' : 'bg-red'
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
                v-if="item.stock > 0 && item.couponPrintCount < item.eachDelivery"
                style="
                  padding: 2px 10px;
                  margin-top: 10px;
                  font-size: 12px;
                  border-radius: 100px;
                  background: #fff;
                  color: rgb(49, 105, 249);
                "
                :class="
                  item.type == '1' ? 'c-blue' : item.type == '2' ? 'c-creddish-orange' : 'c-red'
                "
                @click="buy(item, '1')"
              >
                {{ item.price > 0 ? '立即抢购' : '免费领取' }}
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
            <view>优惠券价格：{{ item.price || 0 }}元</view>
            <view v-if="item.duration">
              有效时长：{{ item.duration ? `领取后${item.duration}天内有效` : '永久有效' }}
            </view>
            <view v-if="item.eachDelivery">领取规则：每人最多领取{{ item.eachDelivery }}张</view>
            <view v-if="item.description">使用说明：{{ item.description }}</view>
          </view>
        </view>
      </block>
      <!-- 当选择的是服务券的时候 -->
      <block v-for="(item, i) in serviceVoucherList.data" :key="i">
        <view
          class="coupon"
          v-if="(discountTypes ? discountTypes == item.type : true) && item.stock > 0"
          :style="item.detailShow ? '' : 'height:100px'"
        >
          <view class="top">
            <view class="coupon-left">
              <view class="info">
                <view class="c-size-14 c-flex c-item-center">
                  <text class="tag c-bg-golden-orange">
                    {{ format('serviceVoucherType', item.type) }}
                  </text>
                  <text>{{ item.title }}</text>
                </view>
                <!-- <view class="c-size-12">活动时间：2025.03.01-2025.04.30</view>
                  <view class="c-size-12">使用时间：2025.03.01-2025.04.30</view> -->
                <view class="c-size-12">
                  活动时间：{{
                    item.exts.startDate ? item.exts.startDate.split(' ')[0].replace(/-/g, '.') : ''
                  }}-{{
                    item.exts.endDate ? item.exts.endDate.split(' ')[0].replace(/-/g, '.') : ''
                  }}
                </view>
                <view class="c-size-12">
                  使用时间：{{
                    item.exts.useStartDate
                      ? item.exts.useStartDate.split(' ')[0].replace(/-/g, '.')
                      : ''
                  }}-{{
                    item.exts.useEndDate
                      ? item.exts.useEndDate.split(' ')[0].replace(/-/g, '.')
                      : ''
                  }}
                </view>
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
                    @click="iconClick(item)"
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
                v-if="item.stock > 0 && item.receiveCount < item.eachDelivery"
                style="
                  padding: 2px 10px;
                  margin-top: 10px;
                  font-size: 12px;
                  border-radius: 100px;
                  background: #fff;
                  color: rgb(49, 105, 249);
                "
                class="c-yellow"
                @click="buy(item, '2')"
              >
                {{ item.price > 0 ? '立即抢购' : '免费领取' }}
              </view>
            </view>
            <image
              src="../../static/images/have.png"
              v-if="item.receiveCount > 0"
              mode="widthFix"
              class="stamp"
            ></image>
          </view>
          <view class="bottom">
            <view>服务券价格：{{ item.price || 0 }}元</view>
            <view v-if="item.duration">
              有效时长：{{ item.duration ? `领取后${item.duration}天内有效` : '永久有效' }}
            </view>
            <view v-if="item.eachDelivery">领取规则：每人最多领取{{ item.eachDelivery }}张</view>
            <view v-if="item.memo">使用说明：{{ item.memo }}</view>
          </view>
        </view>
      </block>
    </view>
    <view v-else class="c-uni-empty">
      <image src="https://pub.fsgo365.cn/empty.png"></image>
      <text>还没有上架优惠券</text>
    </view>

    <uni-popup ref="cartPopup" type="bottom" :safe-area="false" @close="cancel">
      <view class="buy c-bg-white">
        <view>
          <block v-if="type == '1'">
            <text
              class="tag"
              :class="
                cart.formData.type == '1'
                  ? 'c-bg-blue'
                  : cart.formData.type == '2'
                  ? 'c-bg-reddish-orange'
                  : 'c-bg-red'
              "
            >
              {{ format('discountType', cart.formData.type) }}
            </text>
          </block>
          <block v-if="type == '2'">
            <text class="tag c-bg-golden-orange">
              {{ format('serviceVoucherType', cart.formData.type) }}
            </text>
          </block>
          <text class="c-black-dark c-bold">{{ cart.formData.title }}</text>
        </view>
        <view>
          活动时间：{{
            cart.formData.startDate ? cart.formData.startDate.split(' ')[0].replace(/-/g, '.') : ''
          }}-{{
            cart.formData.endDate ? cart.formData.endDate.split(' ')[0].replace(/-/g, '.') : ''
          }}
        </view>

        <view v-if="type == 1">
          使用时间：{{
            cart.formData.startCouponDate
              ? cart.formData.startCouponDate.split(' ')[0].replace(/-/g, '.')
              : ''
          }}-{{
            cart.formData.endCouponDate
              ? cart.formData.endCouponDate.split(' ')[0].replace(/-/g, '.')
              : ''
          }}
        </view>
        <view v-else="type == 2">
          使用时间：{{
            cart.formData.useStartDate
              ? cart.formData.useStartDate.split(' ')[0].replace(/-/g, '.')
              : ''
          }}-{{
            cart.formData.useEndDate
              ? cart.formData.useEndDate.split(' ')[0].replace(/-/g, '.')
              : ''
          }}
        </view>

        <view v-if="cart.formData.duration">
          有效时长：{{
            cart.formData.duration ? `领取后${cart.formData.duration}天内有效` : '永久有效'
          }}
        </view>
        <view v-if="cart.formData.eachDelivery">
          领取规则：每人最多领取{{ cart.formData.eachDelivery }}张
        </view>
        <view v-if="cart.formData.description || cart.formData.memo">
          使用说明：{{ cart.formData.description || cart.formData.memo }}
        </view>
        <view>提示：领取{{ type == '1' ? '优惠' : '服务' }}券所填手机号需与留咨手机号一致。</view>
        <view class="c-flex-between" style="margin-top: 30px">
          <view>
            总计：
            <text class="c-size-12">¥</text>
            <text class="c-red">
              {{ Number(cart.formData.price || 0) }}
            </text>
          </view>
          <view
            v-if="cart.formData.price == 0 || !cart.formData.price"
            class="btn"
            @click="collect"
          >
            免费领取
          </view>
          <view v-else class="btn" @click="pay">去支付</view>
        </view>
      </view>
    </uni-popup>

    <!-- 提示窗示例 -->
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog
        type="error"
        cancelText="暂不需要"
        confirmText="立即预约"
        title="领取成功"
        content="请前往【我的卡券】中预约使用（路径：我的 > 我的卡券> 服务券）"
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
      empty: true,
      discountTypes: '',
      fpi: {
        data: []
      },
      options: {
        codecfg_discountType: { codeId: 'CpsDiscountType' },
        codecfg_serviceVoucherType: { codeId: 'serviceVoucherType' }, //服务券的字典项
        discountType: [], //优惠券
        serviceVoucherType: [] //服务券
      },
      cart: {
        show: false,
        formData: { num: 1, exts: {} }
      },
      privateCouponIds: '',
      tabList: [
        { type: '1', label: '优惠券', options: 'discountType' },
        { type: '2', label: '服务券', options: 'serviceVoucherType' }
      ],
      type: '1', //标识 区分 服务区还是优惠券 还是卡
      serviceVoucherList: {
        data: [] //服务券列表
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    //扫码进来的时候，传privateCouponIds表示查询私密优惠活动id
    let paramsUrl = decodeURIComponent(params.q);
    let isQuery = true; //扫码查询私密优惠券时，如果是新用户进行静默登录，防止重复调用query接口
    if (paramsUrl) {
      let pUrl = paramsUrl.substring(paramsUrl.lastIndexOf('?') + 1);
      let pData = {};
      pUrl.split('&').forEach(item => (pData[item.split('=')[0]] = item.split('=')[1]));
      this.privateCouponIds = pData.privateCouponIds || '';
      if (pData.privateCouponIds) {
        var u = wx.getStorageSync('user');
        if (!(u && u._id && u.phone)) {
          isQuery = false;
          common.osg.doLogin({}, res => {
            common.osg.codeoption(() => {
              this.getData();
            });
          });
        }
      }
    }
    if (isQuery) {
      common.osg.doLogin({}, () => {
        common.osg.codeoption(() => {
          this.getData();
          this.getServiceVoucherData();
        });
      });
    }
  },
  methods: {
    doInit(params) {
      console.log(params);
    },
    // getData() {
    //   let params = {
    //     _all: '1',
    //     tenantId: '4670873342363649607',
    //     'is:state|integer#and': 1,
    //     // 'gt:stock|integer#and': 0, //库存大于0 query后过滤
    //     'lte:startDate|datetime#and': common.osg.formatTime(), //在活动期内
    //     'gte:endDate|datetime#and': common.osg.formatTime(), //在活动期内
    //     sortField: 'createTime',
    //     sortOrder: 'desc'
    //   };
    //   if (this.privateCouponIds) {
    //     params['in:_id|array#and'] = this.privateCouponIds;
    //     params['is:scopeType|integer#and'] = 99;
    //   } else {
    //     params['ne:scopeType|integer#and'] = 99;
    //   }
    //   common.osg.ajax(
    //     'basic/coupon/query',
    //     params,
    //     res => {
    //       // res.data.map(item => {
    //       //   item.exts = item.exts || {};
    //       //   item.detailShow = false;
    //       // });

    //       res.data.map(item => {
    //         item.exts = item.exts || {};
    //         item.detailShow = false;
    //         item.num = 1;
    //         if (item.stock > 0) {
    //           this.empty = false;
    //         }
    //       });
    //       this.fpi = res;
    //     },
    //     {
    //       noload: true
    //     }
    //   );
    // },

    getData() {
      let params = {
        _all: '1',
        tenantId: '4670873342363649607',
        'is:state|integer#and': 1,
        // 'gt:stock|integer#and': 0, //库存大于0 query后过滤
        'lte:startDate|datetime#and': common.osg.formatTime(), //在活动期内
        'gte:endDate|datetime#and': common.osg.formatTime(), //在活动期内
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      if (this.privateCouponIds) {
        params['in:_id|array#and'] = this.privateCouponIds;
        params['is:scopeType|integer#and'] = 99;
      } else {
        params['ne:scopeType|integer#and'] = 99;
      }
      common.osg.ajax(
        'basic/coupon/query',
        params,
        res => {
          let validStockCount = 0;
          res.data.map(item => {
            item.exts = item.exts || {};
            item.detailShow = false;
            item.num = 1;
            if (item.stock > 0) {
              validStockCount++;
              this.empty = false;
            }
          });

          this.fpi = res;
          this.fpi.validStockCount = validStockCount;
          console.log('this.fpi', this.fpi);
        },
        {
          noload: true
        }
      );
    },
    //获取服务券列表数据
    getServiceVoucherData() {
      let params = {
        _all: '1',
        tenantId: '4670873342363649607',
        'is:state|integer#and': 1,
        'gt:stock|integer#and': 0, //库存大于0 query后过滤
        'lte:startDate|datetime#and': common.osg.formatTime(), //在活动期内
        'gte:endDate|datetime#and': common.osg.formatTime(), //在活动期内
        sortField: 'createTime',
        sortOrder: 'desc'
      };

      if (this.privateCouponIds) {
        params['in:_id|array#and'] = this.privateCouponIds;
        params['is:scopeType|integer#and'] = 99;
      } else {
        params['ne:scopeType|integer#and'] = 99;
      }
      common.osg.ajax(
        'basic/serviceCouponDef/query',
        params,
        res => {
          let validStockCount = 0;
          res.data.map(item => {
            item.exts = item.exts || {};
            item.detailShow = false;
            item.num = 1;
            if (item.stock > 0) {
              validStockCount++;
            }
          });
          this.serviceVoucherList = res;
          this.serviceVoucherList.validStockCount = validStockCount;
        },
        {
          noload: true
        }
      );
    },
    iconClick(item) {
      item.detailShow = !item.detailShow;
    },
    open(url, params) {
      common.osg.open(url, params);
    },
    buy(item, type) {
      this.type = type;
      var u = wx.getStorageSync('user');
      if (u && u._id && u.phone) {
        this.cart.formData = item;
        this.$refs.cartPopup.open();
      } else {
        common.osg.confirm('请先授权用户信息', () => {
          common.osg.open(
            '../authorize/authorize',
            { url: '../coupon/mall' },
            {
              mode: 'redirect'
            }
          );
        });
      }
    },
    cancel() {
      this.$refs.cartPopup.close();
    },
    format(option, val, type) {
      if (!option) return;
      common.osg._cthis = this;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    discountTypeClick(val) {
      if (this.discountTypes == val) {
        this.discountTypes = '';
      } else {
        this.discountTypes = val;
      }
    },
    numChange(e) {
      this.cart.formData.num = e.detail;
    },
    // 免费领取
    collect() {
      const { _id, type } = this.cart.formData;
      let params = this.type == '1' ? {} : { scdId: _id };
      let url =
        this.type == '1'
          ? `/basic/couponPrinting/collect/${_id}`
          : '/basic/serviceCoupon/freeToReceive';

      common.osg.ajax(url, params, res => {
        //优惠券
        if (this.type == 2 && type == 1) {
          //打开弹出层
          this.$refs.alertDialog.open();
        } else {
          common.osg.toast('抢券成功，可返回我的卡券查看~', 'none');
        }

        this.$refs.cartPopup.close();
        this.cart.formData.couponPrintCount += this.cart.formData.num; //已购买数量
        this.cart.formData.stock -= this.cart.formData.num; //库存数量
        this.cart = {
          formData: { num: 1, exts: {} }
        };

        //查询一下
        this.getServiceVoucherData();
      });
    },
    pay() {
      common.osg.ajax(
        'biz/pay/payTicket',
        { param: JSON.stringify({ [this.cart.formData._id]: this.cart.formData.num }) },
        res => {
          let params = res.data;
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success: res => {
              common.osg.toast('抢券成功，可返回我的卡券查看~', 'none');
              this.cart.formData.couponPrintCount += this.cart.formData.num; //已购买数量
              this.cart.formData.stock -= this.cart.formData.num; //库存数量
              this.cart = {
                formData: { num: 1, exts: {} }
              };
              this.$refs.cartPopup.close();
            },
            fail: res => {}
          });
        }
      );
    },
    handleClick(type) {
      this.type = type;
    },
    //取消 跳转到我的卡券
    dialogClose() {
      this.$refs.alertDialog.close();
    },
    //确定 跳转到我的卡券
    dialogConfirm() {
      common.osg.open('/subpackages/coupon/my', { type: '2' });
    }
  }
};
</script>

<style lang="scss">
.mall {
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
      // box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
      .bottom {
        background: rgb(253, 253, 253);
        margin-top: 3px;
        padding: 3vw;
        font-size: 12px;
        color: #aaa;
      }
      .top {
        height: 100px;
        display: flex;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
        position: relative;
        > view {
          position: relative;
          display: flex;
        }
        .stamp {
          position: absolute;
          width: 60px;
          right: 30%;
          top: calc(50% - 40px);
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
      }
      .bg-blue {
        background: linear-gradient(to bottom right, rgb(118, 180, 249), rgb(49, 105, 249));
      }
      .bg-yellow {
        background: linear-gradient(to bottom right, rgb(237, 205, 139), rgb(218, 172, 107));
      }
      .bg-red {
        background: linear-gradient(to bottom right, rgb(236, 93, 106), #ee0a24);
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
    > view {
      flex: 1;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
  .buy {
    padding: 3vw;
    // padding-bottom: env(safe-area-inset-bottom);
    font-size: 14px;
    color: #999;
    > view {
      min-height: 30px;
      display: flex;
      align-items: center;
    }
    .btn {
      color: #fff;
      border-radius: 999px;
      padding: 5px 10px;
      background: #f3bb62;
    }
  }
  .empty1 .van-empty {
    height: calc(100vh - 40px);
  }
  .phone {
    background: #f2f3f5;
    border-radius: 4px;
    padding: 3px;
    text-align: center;
    width: 110px;
  }
}
</style>
