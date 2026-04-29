<template>
  <view>
    <van-sticky>
      <!-- header -->
      <view class="header">
        <view class="type">
          <view @click="type = '1'" :class="type == '1' ? 'c-red' : ''">
            券({{ fpi.total || 0 }})
          </view>
          <view @click="type = '2'" :class="type == '2' ? 'c-red' : ''">卡(0)</view>
        </view>
        <view class="filter" v-if="type == '1'">
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
    <view class="content" v-if="type == '1' && fpi.total > 0">
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
                <view class="c-size-12">激活时间：{{ item.activationDate || '未激活' }}</view>
                <view class="c-size-12">失效时间：{{ item.dueDate || '永久有效' }}</view>
                <view class="c-size-12 c-flex c-flex-between c-item-center">
                  <text style="color: #8e8e8e">详细信息</text>
                  <van-icon
                    :name="item.detailShow ? 'arrow-up' : 'arrow-down'"
                    style="border-radius: 50%; padding: 2px; background: #d9d9d9; color: #fff"
                    @click="detailClick(item)"
                  />
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
                  ? 'bg-yellow'
                  : 'bg-red'
              "
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
            </view>
          </view>
          <view class="bottom">
            <view>
              <view>券号：{{ item._id }}</view>
              <view>价格：{{ item.price || 0 }}元</view>
              <view v-if="item.description">使用说明：{{ item.description }}</view>
            </view>
            <view class="c-flex">
              <!-- <view class="btn" style="margin-right: 3vw">修改</view> -->
              <view class="btn" v-if="item.status == 5">退款处理中</view>
              <view class="btn" @click="refund(item)" v-else>退款</view>
            </view>
          </view>
        </view>
      </block>
    </view>
    <van-empty
      description="您还没有优惠券，去卡券中心看看吧~"
      v-if="type == '1' && fpi.total == 0"
      class="empty1"
    />
    <van-empty description="您还没有会员卡，去卡券中心看看吧~" v-if="type == '2'" class="empty1" />

    <view class="footer">
      <view @click="open('mall')">
        <van-icon name="coupon-o" class="c-blue c-m-r-10 c-size-18" />
        卡券中心
      </view>
      <view @click="open('record')">
        <van-icon name="orders-o" class="c-yellow c-m-r-10 c-size-18" />
        使用记录
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      load: false,
      type: '1',
      discountTypes: '',
      fpi: {
        data: []
      },
      options: {
        codecfg_discountType: { codeId: 'CpsDiscountType' },
        discountType: []
      }
    };
  },
  onLoad(params) {
    this.load = true;
    common.osg.init(this, params, app);
    common.osg.codeoption(() => {
      this.getData();
    });
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
          tenantId: '1340835581184723420',
          'is:state|integer#and': 1,
          'in:status|array-integer#and': '2,3,5',
          'in:type|array-integer#and': '1,2',
          userId: common.osg.currentUser()._id,
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
</style>
