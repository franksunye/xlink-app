<template>
  <view class="card-group">
    <view class="card">
      <view class="card-header">
        <view class="card-title">订单信息</view>
      </view>
      <view class="card-content">
        <view class="c-flex c-flex-between c-item-center">
          <text>订单编号：</text>
          <text>{{ formData._id || '' }}</text>
        </view>
        <view class="c-flex c-flex-between c-item-center">
          <text>下单时间：</text>
          <text>{{ formData.createTime || '' }}</text>
        </view>
        <view class="c-flex c-flex-between c-item-center">
          <text>支付状态：</text>
          <text>{{ codelabel('payState', formData.payState) || '' }}</text>
        </view>
        <view class="c-flex c-flex-between c-item-center">
          <text>产品总额：</text>
          <text v-if="formData.originPrice || formData.originPrice == 0" class="c-red">
            ¥ {{ formData.originPrice || '' }}
          </text>
        </view>
        <view
          v-if="formData.discount && formData.discount != 1"
          class="c-flex c-flex-between c-item-center"
        >
          <text>折扣金额：</text>
          <text class="c-red">
            - ¥
            {{ (formData.originPrice - formData.originPrice * formData.discount).toFixed(2) || '' }}
          </text>
        </view>
        <view v-if="formData.preferentialAmount" class="c-flex c-flex-between c-item-center">
          <text>优惠金额：</text>
          <text class="c-red">- ¥ {{ formData.preferentialAmount || '' }}</text>
        </view>
        <view
          v-if="(formData.discount && formData.discount != 1) || formData.preferentialAmount"
          class="c-flex c-flex-between c-item-center"
        >
          <text>实际金额：</text>
          <text class="c-red">¥ {{ formData.totalPrice || '' }}</text>
        </view>
      </view>
      <view class="card-footer"></view>
    </view>
    <view class="card">
      <view class="card-header">
        <view class="card-title">订单明细</view>
        <view class="c-flex" @click="originalOrderShow = !originalOrderShow">
          <van-icon :name="originalOrderShow ? 'arrow-up' : 'arrow-down'"></van-icon>
        </view>
      </view>
      <view class="card-content" v-if="originalOrderShow">
        <block v-for="(item, index) in originalOrder.productsDetail" :key="index">
          <view class="c-p-20">
            <view class="c-black-dark c-flex c-flex-between c-flex-center">
              <view>{{ item.product.name }}</view>
              <view>
                <text class="c-red">¥{{ sum(item.product.price, item.product.materials) }}</text>
                <text>/{{ codelabel('unit', item.product.unit) }}</text>
              </view>
            </view>
            <view class="c-flex c-flex-between c-flex-center">
              <view
                class="c-blue"
                v-if="item.product.materials.length > 0"
                @click="openDialog(item.product.materials)"
              >
                查看材料
              </view>
              <view v-else></view>
              <view>× {{ item.number }}</view>
            </view>
          </view>
        </block>
      </view>
      <view class="card-footer" v-if="originalOrderShow"></view>
    </view>
    <view class="card" v-if="newOrder.productsDetail && newOrder.productsDetail.length > 0">
      <view class="card-header">
        <view class="card-title">订单增减项明细</view>
        <view class="c-flex" @click="newOrderShow = !newOrderShow">
          <van-icon :name="newOrderShow ? 'arrow-up' : 'arrow-down'"></van-icon>
        </view>
      </view>
      <view class="card-content" v-if="newOrderShow">
        <block v-for="(item, index) in newOrder.productsDetail" :key="index">
          <view class="c-p-20">
            <view class="c-black-dark c-flex c-flex-between c-flex-center">
              <view>{{ item.product.name }}</view>
              <view>
                <text class="c-red">¥{{ sum(item.product.price, item.product.materials) }}</text>
                <text>/{{ codelabel('unit', item.product.unit) }}</text>
              </view>
            </view>
            <view class="c-flex c-flex-between c-flex-center">
              <view class="c-blue" @click="openDialog(item.product.materials)">查看材料</view>
              <view>× {{ item.number }}</view>
            </view>
          </view>
        </block>
      </view>
      <view class="card-footer" v-if="newOrderShow"></view>
    </view>
    <!-- 材料弹出框 -->
    <van-dialog use-slot :show="dialog.show" @close="dialog.show = false">
      <view class="c-p-20">
        <view v-for="(item, i) in dialog.data" :key="i" class="c-p-10 c-size-14">
          {{ item.material.name }}
        </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
const app = getApp();
let common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      id: '',
      formData: {},
      originalOrder: {},
      newOrder: {},
      options: {
        // codecfg_payState: {
        // 	codeId: "PAYSTATE"
        // },
        payState: [
          {
            name: '未支付',
            value: 0
          },
          {
            name: '已结清',
            value: 1
          },
          {
            name: '部分支付',
            value: 2
          }
        ],
        // codecfg_unit: {
        // 	codeId: "UNIT"
        // },
        unit: [
          {
            name: '个',
            value: '1'
          },
          {
            name: '米',
            value: '2'
          },
          {
            name: '平米',
            value: '3'
          },
          {
            name: '立方米',
            value: '4'
          },
          {
            name: '升',
            value: '5'
          },
          {
            name: '千克',
            value: '6'
          },
          {
            name: '箱',
            value: '7'
          },
          {
            name: '处',
            value: '8'
          },
          {
            name: '桶',
            value: '9'
          },
          {
            name: '次',
            value: 'CI'
          },
          {
            name: '卷',
            value: '11'
          }
        ]
      },

      originalOrderShow: true, //初始订单展开
      newOrderShow: true, //增减项订单展开

      dialog: {
        show: false,
        data: []
      }
    };
  },
  methods: {
    onLoad(params) {
      this.doInit(params);
    },
    /**
     * 页面初始化
     */
    doInit(params) {
      common.osg.init(this, params, app);
      this.id = common.osg.param('id');
      // common.osg.codeoption(()=>{
      this.getData();
      // })
    },
    /**
     * 获取详情
     */
    getData: function () {
      common.osg.ajax(
        'order/queryById',
        {
          id: this.id
        },
        res => {
          let formData = res;
          // 拆分初始订单和增减项订单
          if (common.osg.isJson(formData.productIds)) {
            formData.productIds = JSON.parse(formData.productIds);
            this.originalOrder = {
              productIds: [],
              productsDetail: [],
              materialDetail: []
            };
            this.newOrder = {
              productIds: [],
              productsDetail: [],
              materialDetail: []
            };
            formData.productsDetail.forEach(item => {
              if (item.product.exts && item.product.exts.laterItem) {
                this.newOrder.productsDetail.push(item);
              } else {
                this.originalOrder.productsDetail.push(item);
              }
            });
          }
          this.formData = formData;
        }
      );
    },
    /**
     * 计算产品单价和所有材料单价之和
     */
    sum(price, materials) {
      let total = price;
      if (materials && materials.length > 0) {
        materials.map(item => {
          total += item.material.price * (item.consumption || 0);
        });
      }
      return total.toFixed(2);
    },
    /**
     * 弹出框
     */
    openDialog(rows) {
      if (!rows || rows.length == 0) {
        common.osg.toast('暂无数据');
      }
      this.dialog.data = rows;
      this.dialog.show = true;
    },
    /**
     * 渲染字典
     */
    codelabel(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      }
    }
  }
};
</script>
<style lang="scss">
.card-group {
  padding: 0 3vw;

  .card {
    background: #fff;
    border-radius: 10px;
    margin-top: 3vw;

    .card-header {
      padding: 3vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #323233;

      .card-title {
        font-weight: 500;
      }
    }

    .card-content {
      padding: 0 3vw;
      color: #646566;
      font-size: 14px;
    }

    .card-footer {
      padding: 3vw;
      display: flex;
      justify-content: space-between;
      align-items: center;

      van-button:not(:first-child) {
        margin-left: 3vw;
      }
    }
  }
}
</style>
