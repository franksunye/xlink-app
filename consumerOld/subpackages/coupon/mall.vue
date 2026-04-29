<template>
  <view>
    <van-sticky>
      <!-- header -->
      <view class="header">
        <!-- <view class="type">
        <view>券({{ fpi.total || 0 }})</view>
        <view>卡(0)</view>
      </view> -->
        <view class="filter">
          <block v-for="(item, i) in options.discountType" :key="i">
            <view
              v-if="item.value == 1 || item.value == 2"
              @click="discountTypeClick(item.value)"
              :style="discountTypes == item.value ? 'border-color:red' : ''"
            >
              {{ item.name }}
            </view>
          </block>
        </view>
      </view>
    </van-sticky>
    <view class="content" v-if="!empty">
      <block v-for="(item, i) in fpi.data" :key="i">
        <view
          class="coupon"
          :style="item.detailShow ? '' : 'height:100px'"
          v-if="(discountTypes ? discountTypes == item.type : true) && item.stock > 0"
        >
          <view class="top">
            <view class="coupon-left">
              <!-- <view class="img">
                <image src="../../static/images/store.jpg"></image>
              </view> -->
              <view class="info">
                <view class="c-size-14 c-flex c-item-center">
                  <text
                    class="tag"
                    :class="
                      item.type == '1' ? 'c-bg-blue' : item.type == '2' ? 'c-bg-yellow' : 'c-bg-red'
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
                  <van-icon
                    :name="item.detailShow ? 'arrow-up' : 'arrow-down'"
                    style="border-radius: 50%; padding: 2px; background: #d9d9d9; color: #fff"
                    @click="iconClick(item)"
                  />
                </view>
              </view>
            </view>
            <view
              class="coupon-right"
              :class="item.type == '1' ? 'bg-blue' : item.type == '2' ? 'c-bg-yellow' : 'bg-red'"
            >
              <view v-if="item.type == 1">
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
                满{{ item.prerequisites }}元可用
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
                :class="item.type == '1' ? 'c-blue' : item.type == '2' ? 'c-yellow' : 'c-red'"
                @click="buy(item)"
              >
                立即抢购
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
            <view v-if="item.eachDelivery">领取规则：最多领取{{ item.eachDelivery }}张</view>
            <view v-if="item.description">使用说明：{{ item.description }}</view>
          </view>
        </view>
      </block>
    </view>
    <van-empty description="还没有上架优惠券" v-else class="empty1" />
    <!-- <view class="footer">
      <view @click="open('my')">
        <van-icon name="paid" class="c-green c-m-r-10 c-size-18" />
        我的卡券
      </view>
    </view> -->
    <van-popup position="bottom" :show="cart.show" closeable close-icon="close" @close="cancel">
      <view class="buy">
        <view>
          <text
            class="tag"
            :class="
              cart.formData.type == '1'
                ? 'c-bg-blue'
                : cart.formData.type == '2'
                ? 'c-bg-yellow'
                : 'c-bg-red'
            "
          >
            {{ format('discountType', cart.formData.type) }}
          </text>
          <text class="c-black-dark c-bold">{{ cart.formData.title }}</text>
        </view>
        <view>
          活动时间：{{
            cart.formData.startDate ? cart.formData.startDate.split(' ')[0].replace(/-/g, '.') : ''
          }}-{{
            cart.formData.endDate ? cart.formData.endDate.split(' ')[0].replace(/-/g, '.') : ''
          }}
        </view>
        <view>
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
        <view v-if="cart.formData.duration">
          有效时长：{{
            cart.formData.duration ? `领取后${cart.formData.duration}天内有效` : '永久有效'
          }}
        </view>
        <view v-if="cart.formData.eachDelivery">
          领取规则：最多领取{{ cart.formData.eachDelivery }}张
        </view>
        <view v-if="cart.formData.description">使用说明：{{ cart.formData.description }}</view>
        <view v-if="cart.formData.description">提示：购买优惠券手机号需与留咨手机号一致</view>
        <!-- <view class="c-flex-between">
          <text>绑定手机号：</text>
          <input value="13788888888" class="phone" />
        </view> -->
        <!-- <view class="c-flex-between"> -->
        <!-- <text>
            单价：
            <text class="c-size-12">¥</text>
            {{ cart.formData.price || 0 }}
          </text> -->
        <!-- 库存小于可购买数量 最多购买库存数量 -->
        <!-- <van-stepper
            v-if="cart.formData.eachDelivery != 1"
            :value="cart.formData.num"
            :max="
              cart.formData.stock >=
              cart.formData.eachDelivery - (cart.formData.couponPrintCount || 0)
                ? cart.formData.eachDelivery - (cart.formData.couponPrintCount || 0)
                : cart.formData.stock
            "
            integer
            button-size="28px"
            @change="numChange"
          /> -->
        <!-- </view> -->
        <view class="c-flex-between" style="margin-top: 30px">
          <view>
            总计：
            <text class="c-size-12">¥</text>
            <text class="c-red">
              {{ Number(cart.formData.price || 0) }}
            </text>
          </view>
          <view class="btn" @click="pay">去支付</view>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
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
        discountType: []
      },
      cart: {
        show: false,
        formData: { num: 1, exts: {} }
      },
      scopeId: ''
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    //扫码进来的时候，scopeId 来查询私密活动
    let paramsUrl = decodeURIComponent(params.q);
    let isQuery = true; //扫码查询私密优惠券时，如果是新用户进行静默登录，防止重复调用query接口
    if (paramsUrl) {
      let pUrl = paramsUrl.substr(paramsUrl.lastIndexOf('?') + 1);
      let pData = {};
      pUrl.split('&').forEach(item => (pData[item.split('=')[0]] = item.split('=')[1]));
      if (pData.scopeId) {
        var u = common.osg.currentUser();
        if (!(u && u._id && u.nickname && u.phone)) {
          isQuery = false;
          common.osg.doLogin({}, res => {
            common.osg.codeoption(() => {
              this.getData();
            });
          });
        }
        this.scopeId = pData.scopeId;
      }
    }
    if (isQuery) {
      if (params.type == 'scheme') {
        common.osg.doLogin({}, () => {
          common.osg.codeoption(() => {
            this.getData();
          });
        });
      } else {
        common.osg.codeoption(() => {
          this.getData();
        });
      }
    }
  },
  methods: {
    doInit(params) {
      console.log(params);
    },
    getData() {
      common.osg.ajax(
        'basic/coupon/query',
        {
          _all: '1',
          tenantId: '1340835581184723420',
          'is:state|integer#and': 1,
          // 'gt:stock|integer#and': 0, //库存大于0 query后过滤
          'lte:startDate|datetime#and': common.osg.formatTime(), //在活动期内
          'gte:endDate|datetime#and': common.osg.formatTime(), //在活动期内
          'in:type|array-integer#and': '1,2',
          'ne:scopeType|integer#or': '99',
          'is:_id|string#or': this.scopeId,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          res.data.map(item => {
            item.exts = item.exts || {};
            item.detailShow = false;
            item.num = 1;
            if (item.stock > 0) {
              this.empty = false;
            }
          });
          this.fpi = res;
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
    buy(item) {
      var u = common.osg.currentUser();
      if (u && u._id && u.nickname && u.phone) {
        this.cart.formData = item;
        this.cart.show = true;
      } else {
        common.osg.confirm('请先授权用户信息', () => {
          common.osg.open(
            '../../subpackages/authorize/authorize',
            { url: '../../subpackages/coupon/mall' },
            {
              mode: 'redirect'
            }
          );
        });
      }
    },
    cancel() {
      this.cart.show = false;
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
                show: false,
                formData: { num: 1, exts: {} }
              };
            },
            fail: res => {}
          });
        }
      );
    }
  }
};
</script>

<style lang="scss">
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
  .filter > view {
    padding: 1vw 3vw;
    margin-right: 3vw;
    border: 1px solid transparent;
    background-color: #f5f5f5;
    border-radius: 999px;
    font-size: 12px;
  }
}
.content {
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
}
.buy {
  padding: 3vw;
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
</style>
