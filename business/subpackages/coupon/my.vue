<template>
  <view @click.capture="track">
    <view class="content">
      <block v-for="(item, i) in fpi.data" :key="i">
        <view class="coupon">
          <view class="top">
            <view class="coupon-left">
              <view class="info">
                <view class="c-size-14">
                  <!-- 1满赠(满N件赠M件) 2满赠(满N件返费用) 3满赠(满N件返积分) 4满减(满N件减费用) 5满折(满N件折扣) -->
                  <text class="conditionType-tag">
                    {{ format('conditionType', Number(item.conditionType)) }}
                  </text>
                  <text>{{ item.title }}</text>
                </view>
                <view class="c-size-12">
                  使用时间：{{ item.useStartDate.split(' ')[0] }} ~
                  {{ item.useEndDate.split(' ')[0] }}
                </view>
                <view class="c-size-12">剩余数量：{{ item.currentCount }}张</view>
                <view class="c-size-12 c-flex c-flex-between c-item-center">
                  <text style="color: #8e8e8e">详细信息</text>
                  <van-icon
                    :name="item.detailShow ? 'arrow-up' : 'arrow-down'"
                    style="border-radius: 50%; padding: 2px; background: #d9d9d9; color: #fff"
                    @click="detailClick(item)"
                    :data-event="{ id: 'uvFa3WaVW6' }"
                  />
                </view>
              </view>
            </view>
            <view class="coupon-right bg-blue">
              <view>
                <text class="c-size-12">赠</text>
                <text class="c-size-20 c-bold" style="margin: 0 5px">{{ item.present }}</text>
                <text class="c-size-12">件</text>
              </view>
              <!-- <view v-if="item.type == 2">
                <text class="c-size-20 c-bold" v-if="item.value">
                  {{
                    item.value
                      ? item.value >= 1
                        ? '不打折'
                        : String(item.value).split('.')[1] + '折'
                      : '免费'
                  }}
                </text>
              </view> -->
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
            <!-- <view class="c-flex">
              <view class="btn" style="margin-right: 10px">修改</view>
              <view class="btn" v-if="item.status == 5">退款处理中</view>
              <view class="btn" @click="refund(item)" v-else :data-event="{id:'2YH4tm06Fy'}">退款</view>
            </view> -->
          </view>
        </view>
      </block>
    </view>
    <van-empty description="您还没有优惠券" v-if="fpi.data.length == 0" class="empty1" />
    <view class="footer">
      <!-- <view @click="open('mall')" :data-event="{id:'M-BjPYQtLP'}">
        <van-icon name="coupon-o" class="c-blue c-m-r-10 c-size-18" :data-event="{id:'M-BjPYQtLP'}" />
        卡券中心
      </view> -->
      <view @click="open('record')" :data-event="{ id: 'M4CB3InERy' }">
        <van-icon
          name="records"
          class="c-blue c-m-r-10 c-size-18"
          :data-event="{ id: 'M4CB3InERy' }"
        />
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
      fpi: {
        data: []
      },
      options: {
        codecfg_conditionType: { codeId: 'conditionType' },
        goods: [],
        allClassify: []
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    common.osg.codeoption(() => {
      this.getData();
      this.getGoods();
      this.getAllClassify();
    });
  },
  methods: {
    getGoods() {
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
    getData() {
      common.osg.ajax(
        'biz/voucher/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
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
    }
  }
};
</script>

<style lang="scss">
.header {
  background: #fff;
  > view {
    display: flex;
    padding: 0 10px;
    height: 40px;
    box-sizing: border-box;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
  }
  .type {
    > view {
      margin-right: 10px;
    }
  }
  .filter > view {
    padding: 1vw 10px;
    margin-right: 10px;
    border: 1px solid transparent;
    background-color: #f5f5f5;
    border-radius: 999px;
    font-size: 12px;
  }
}
.content {
  padding-bottom: 80px;
  .coupon {
    margin: 10px;
    overflow: hidden;
    border-radius: 5px 5px 3px 3px;
    background: rgb(253, 253, 253);
    .bottom {
      background: rgb(253, 253, 253);
      margin-top: 3px;
      padding: 10px;
      font-size: 12px;
      color: #646566;
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
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
      > view {
        position: relative;
        display: flex;
      }
    }
    .coupon-left {
      padding: 10px;
      width: 75%;
      box-sizing: border-box;
      background-color: #fff;
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
        border: 1px solid #106cff;
        color: #106cff;
        margin-right: 5px;
        font-size: 12px;
        padding: 0 4px;
        border-radius: 2px;
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
      background: #f7f8fa;
    }
    .coupon-left::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 4px;
      height: 4px;
      border-radius: 4px 0 0 0;
      background: #f7f8fa;
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
      background: #f7f8fa;
    }
    .coupon-right::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: 0 4px 0 0;
      background: #f7f8fa;
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
