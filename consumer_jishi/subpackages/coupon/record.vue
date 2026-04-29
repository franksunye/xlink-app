<template>
  <view>
    <view class="content" style="height: 100vh">
      <view class="c-uni-tabs">
        <view
          v-for="(tab, j) in tabs"
          :key="j"
          class="c-uni-tab"
          :class="activeTab == tab.name ? 'c-uni-tab-active' : ''"
          @click="tabClick(tab.name)"
        >
          {{ tab.title }}
          <view v-if="activeTab == tab.name" class="c-uni-tabs-line"></view>
        </view>
      </view>
      <block v-if="type == 1 && fpi.data.length > 0">
        <view
          v-for="(item, i) in fpi.data"
          :key="i"
          class="coupon"
          :style="item.detailShow ? '' : 'height:100px'"
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
                      item.type == '1' ? 'c-bg-blue' : item.type == '2' ? 'c-bg-yellow' : 'c-bg-red'
                    "
                  >
                    {{ format('discountType', item.type) }}
                  </text>
                  <text>{{ item.title }}</text>
                </view>
                <view class="c-size-12">
                  {{
                    item.activationDate ? item.activationDate.split(' ')[0].replace(/-/g, '.') : ''
                  }}-{{ item.dueDate ? item.dueDate.split(' ')[0].replace(/-/g, '.') : '' }}
                </view>
                <!-- <view class="c-size-12">使用时间：{{ item.activationDate }}</view>
                  <view class="c-size-12">失效时间：{{ item.dueDate }}</view>
                  <view class="c-size-12">退款时间：{{ item.dueDate }}</view> -->
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
            <view class="coupon-right">
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
            <image
              src="../../static/images/used.png"
              v-if="activeTab == 4"
              mode="widthFix"
              class="stamp"
            ></image>
            <image
              src="../../static/images/expired.png"
              v-else
              mode="widthFix"
              class="stamp"
            ></image>
          </view>
          <view class="bottom">
            <view>
              <view>优惠券价格：{{ item.price || 0 }}元</view>
              <view v-if="item.description">使用说明：{{ item.description }}</view>
            </view>
            <view class="btn" v-if="item.status == -2" @click="refund(item)">退款</view>
            <view class="btn" v-if="item.status == 5">退款处理中</view>
          </view>
        </view>
      </block>
      <block v-if="type == 2 && fpi.data.length > 0">
        <view
          v-for="(item, i) in fpi.data"
          :key="i"
          class="coupon"
          :style="item.detailShow ? '' : 'height:105px'"
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
            <view :class="['coupon-right', activeTab != 5 ? 'c-bg-golden-orange' : '']">
              <view>
                <text class="c-size-20 c-bold">
                  {{ format('serviceVoucherType', item.type) }}
                </text>
              </view>
              <!-- <view
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
              </view> -->
            </view>
            <image
              v-if="activeTab == 5"
              src="../../static/images/used.png"
              mode="widthFix"
              class="stamp"
            ></image>
          </view>
          <view class="bottom">
            <view>
              <view>服务券价格：{{ item.price || 0 }}元</view>
              <view v-if="item.description">使用说明：{{ item.description }}</view>
            </view>
          </view>
        </view>
      </block>

      <view v-if="fpi.data.length == 0" class="c-uni-empty" style="height: calc(100% - 44px)">
        <image src="https://pub.fsgo365.cn/empty.png"></image>
        <text>您当前还没有使用记录！</text>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../common/common.js');
export default {
  data() {
    return {
      tabs: [
        { title: '已使用', name: '4' },
        { title: '已失效', name: '-2,5' },
        { title: '已退款', name: '-1' }
      ],
      activeTab: '4',
      fpi: {
        data: []
      },
      options: {
        codecfg_discountType: {
          codeId: 'CpsDiscountType'
        },
        codecfg_serviceVoucherType: { codeId: 'serviceVoucherType' } //服务券的字典项
      },
      type: 1 // 1 优惠券使用记录 2是服务券
    };
  },
  onLoad(params) {
    const { type } = params;
    console.log('type', type);
    this.type = type;
    common.osg.init(this, params, app);
    common.osg.codeoption(() => {
      // if (type == 2) {
      //   this.tabs = this.options.serviceVoucherStatus.map(item => ({
      //     title: item.text,
      //     name: item.value
      //   }));
      //   //重新定义激活项
      //   this.activeTab = 1;
      //   console.log('拿到的数据结构', this.tabs);
      // }

      if (type == 2) {
        let tab = [
          { title: '待确认', name: '3' },
          { title: '服务中', name: '4' },
          { title: '已核销', name: '5' }
        ];
        this.tabs = tab;
        this.serviceCoupon();
      } else {
        //查询优惠券使用记录
        this.getData();
      }
    });
  },
  methods: {
    doInit(params) {},
    getData() {
      common.osg.ajax(
        'basic/couponPrinting/query',
        {
          _all: '1',
          tenantId: '4670873342363649607',
          'in:status|array-integer#and': this.activeTab,
          userId: wx.getStorageSync('user')._id,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          res.data.map(item => {
            item.detailShow = false;
          });
          this.fpi = res;
          console.log('1223344', this.fpi);
        }
      );
    },
    serviceCoupon() {
      common.osg.ajax(
        '/basic/serviceCoupon/query',
        {
          _all: '1',
          tenantId: '4670873342363649607',
          'in:status|array-integer#and': this.activeTab,
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
    refund(item) {
      common.osg.confirm(`您选择了"${item.title}"，是否确认退款？`, () => {
        common.osg.ajax(`/basic/couponPrinting/refund/${item._id}`, {}, res => {
          common.osg.toast('您已申请退款，请耐心等待业务人员处理。', 'none');
          this.getData();
        });
      });
    },
    iconClick(item) {
      item.detailShow = !item.detailShow;
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
    tabClick(name) {
      this.activeTab = name;

      if (this.type == 2) {
        this.serviceCoupon();
      } else if (this.type == 1) {
        this.getData();
      }
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
      .tag {
        color: #fff;
        background: #c2c2c2;
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
      background: #c2c2c2;
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
</style>
