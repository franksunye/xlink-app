<template>
  <view @click.capture="track">
    <view class="content">
      <van-tabs
        :active="activeTab"
        @change="tabChange"
        sticky
        :data-event="{ id: 'syLfcSLNTf', capture: false }"
      >
        <van-tab :title="tab.title" :name="tab.name" v-for="(tab, j) in tabs" :key="j">
          <!-- #ifdef APP-PLUS -->
          <view style="margin-top: 55px" :data-event="{ id: 'syLfcSLNTf' }">
            <!-- #endif -->
            <block v-for="(item, i) in fpi.data" :key="i">
              <view class="coupon" :data-event="{ id: 'syLfcSLNTf' }">
                <view class="top" :data-event="{ id: 'syLfcSLNTf' }">
                  <view class="coupon-left" :data-event="{ id: 'syLfcSLNTf' }">
                    <view class="info" :data-event="{ id: 'syLfcSLNTf' }">
                      <view class="c-size-14" :data-event="{ id: 'syLfcSLNTf' }">
                        <!-- 1满赠(满N件赠M件) 2满赠(满N件返费用) 3满赠(满N件返积分) 4满减(满N件减费用) 5满折(满N件折扣) -->
                        <text class="conditionType-tag" :data-event="{ id: 'syLfcSLNTf' }">
                          {{ format('conditionType', Number(item.conditionType)) }}
                        </text>
                        <text :data-event="{ id: 'syLfcSLNTf' }">{{ item.title }}</text>
                      </view>
                      <block v-if="activeTab == 'used'">
                        <view class="c-size-12" :data-event="{ id: 'syLfcSLNTf' }">
                          使用时间：{{ item.useStartDate.split(' ')[0] }} ~
                          {{ item.useEndDate.split(' ')[0] }}
                        </view>
                        <view class="c-size-12" :data-event="{ id: 'syLfcSLNTf' }">
                          使用数量：{{ item.currentCount }}张
                        </view>
                      </block>
                      <block v-if="activeTab == 'expire'">
                        <view class="c-size-12" :data-event="{ id: 'syLfcSLNTf' }">
                          过期时间：{{ item.useStartDate.split(' ')[0] }} ~
                          {{ item.useEndDate.split(' ')[0] }}
                        </view>
                        <view class="c-size-12" :data-event="{ id: 'syLfcSLNTf' }">
                          过期数量：{{ item.currentCount }}张
                        </view>
                      </block>
                      <block v-if="activeTab == 'inactive'">
                        <view class="c-size-12" :data-event="{ id: 'syLfcSLNTf' }">
                          失效时间：{{ item.useStartDate.split(' ')[0] }} ~
                          {{ item.useEndDate.split(' ')[0] }}
                        </view>
                        <view class="c-size-12" :data-event="{ id: 'syLfcSLNTf' }">
                          失效数量：{{ item.currentCount }}张
                        </view>
                      </block>
                      <view
                        class="c-size-12 c-flex c-flex-between c-item-center"
                        :data-event="{ id: 'syLfcSLNTf' }"
                      >
                        <text style="color: #8e8e8e" :data-event="{ id: 'syLfcSLNTf' }">
                          详细信息
                        </text>
                        <van-icon
                          :name="item.detailShow ? 'arrow-up' : 'arrow-down'"
                          style="border-radius: 50%; padding: 2px; background: #d9d9d9; color: #fff"
                          @click="detailClick(item)"
                          :data-event="{ id: 'LQ_q_spjN5' }"
                        />
                      </view>
                    </view>
                  </view>
                  <view
                    class="coupon-right"
                    style="background: #c2c2c2"
                    :data-event="{ id: 'syLfcSLNTf' }"
                  >
                    <view :data-event="{ id: 'syLfcSLNTf' }">
                      <text class="c-size-12" :data-event="{ id: 'syLfcSLNTf' }">赠</text>
                      <text
                        class="c-size-20 c-bold"
                        style="margin: 0 5px"
                        :data-event="{ id: 'syLfcSLNTf' }"
                      >
                        {{ item.present }}
                      </text>
                      <text class="c-size-12" :data-event="{ id: 'syLfcSLNTf' }">件</text>
                    </view>
                    <!-- <view v-if="item.type == 2" :data-event="{id:'syLfcSLNTf'}">
                <text class="c-size-20 c-bold" v-if="item.value" :data-event="{id:'syLfcSLNTf'}">
                  {{
                    item.value
                      ? item.value >= 1
                        ? '不打折'
                        : String(item.value).split('.')[1] + '折'
                      : '免费'
                  }}
                </text>
              </view> -->
                    <view
                      class="c-size-12"
                      v-if="item.condition || item.condition === 0"
                      :data-event="{ id: 'syLfcSLNTf' }"
                    >
                      满{{ item.condition }}件可用
                    </view>
                  </view>
                </view>
                <view class="bottom" v-if="item.detailShow" :data-event="{ id: 'syLfcSLNTf' }">
                  <view :data-event="{ id: 'syLfcSLNTf' }">
                    <view :data-event="{ id: 'syLfcSLNTf' }">编号：{{ item.code }}</view>
                    <view v-if="item.memo" :data-event="{ id: 'syLfcSLNTf' }">
                      使用说明：{{ item.memo }}
                    </view>
                    <view v-if="item.type == '1'" class="c-flex" :data-event="{ id: 'syLfcSLNTf' }">
                      <text class="c-white-space-nowrap" :data-event="{ id: 'syLfcSLNTf' }">
                        适用商品：
                      </text>
                      <text :data-event="{ id: 'syLfcSLNTf' }">
                        {{ format('goods', item.typeIds, 'multiple') }}
                      </text>
                    </view>
                    <view
                      v-else-if="item.type == '3'"
                      class="c-flex"
                      :data-event="{ id: 'syLfcSLNTf' }"
                    >
                      <text class="c-white-space-nowrap" :data-event="{ id: 'syLfcSLNTf' }">
                        适用商品类别：
                      </text>
                      <text :data-event="{ id: 'syLfcSLNTf' }">
                        {{ format('allClassify', item.typeIds, 'multiple') }}
                      </text>
                    </view>
                    <view v-else-if="item.type == '4'" :data-event="{ id: 'syLfcSLNTf' }">
                      店铺通用
                    </view>
                    <view
                      v-if="item.conditionType == '1' && item.presentId"
                      :data-event="{ id: 'syLfcSLNTf' }"
                    >
                      赠送商品：{{ format('goods', item.presentId) }}
                    </view>
                  </view>
                  <!-- <view class="c-flex" :data-event="{id:'syLfcSLNTf'}">
              <view class="btn" style="margin-right: 10px" :data-event="{id:'syLfcSLNTf'}">修改</view>
              <view class="btn" v-if="item.status == 5" :data-event="{id:'syLfcSLNTf'}">退款处理中</view>
              <view class="btn" @click="refund(item)" v-else :data-event="{id:'HcOuM5DEH_'}">退款</view>
            </view> -->
                </view>
              </view>
            </block>
            <!-- #ifdef APP-PLUS -->
          </view>
          <!-- #endif -->
          <van-empty description="您还没有使用记录" v-if="fpi.data.length == 0" class="empty1" />
        </van-tab>
      </van-tabs>
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      tabs: [
        { title: '已使用', name: 'used' },
        { title: '已过期', name: 'expire' },
        { title: '已失效', name: 'inactive' }
      ],
      activeTab: 'used',
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
          tag: this.activeTab,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          res.data.map(item => {
            item.detailShow = false;
          });
          this.fpi = res;
        },
        {
          noload: true
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
    },
    tabChange(e) {
      this.activeTab = e.detail.name;
      this.getData();
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
