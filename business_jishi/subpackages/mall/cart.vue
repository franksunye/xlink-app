<template>
  <view class="cart" @click.capture="track">
    <!-- <van-cell
      is-link
      title="配送至"
      :value="address.address || ''"
      icon="location-o"
      link-type="navigateTo"
      :url="'/subpackages/mall/addresses?selectedAddressId=' + address._id"
      title-style="flex:none"
      :border="false"
    /> -->
    <view
      class="c-flex c-flex-between c-item-center c-bg-white"
      style="padding: 0 10px; height: 45px"
    >
      <view class="c-size-14" @click="edit = !edit" :data-event="{ id: '6YeYG2HjAf' }">
        <van-icon name="bars" class="c-m-r-10" :data-event="{ id: '6YeYG2HjAf' }" />
        <text v-if="edit" :data-event="{ id: '6YeYG2HjAf' }">退出管理</text>
        <text v-else :data-event="{ id: '6YeYG2HjAf' }">管理</text>
      </view>
      <van-button
        v-if="edit"
        plain
        round
        type="danger"
        size="mini"
        @click="batchDeletion"
        :data-event="{ id: 'U38qdRQ1RZ' }"
      >
        删除
      </van-button>
    </view>
    <view class="c-flex-1 c-auto-y" style="padding: 5px 0 55px">
      <!-- <van-swipe-cell
        :right-width="60"
        v-for="(item, i) in cart"
        :key="i"
        style="margin: 10px"
      > -->
      <view class="classify-goods-item" v-for="(item, i) in cart" :key="i">
        <van-checkbox :value="item.checked" @change="onCheck($event, item)"></van-checkbox>
        <image
          :src="
            (item.images && JSON.parse(item.images)[0].url) ||
            'https://pub.fsgo365.cn/logo_jishi.jpg'
          "
          class="classify-image"
        />
        <view class="classify-goods-item-view">
          <view>
            <view class="title">
              {{ item.name || item.content }}
              <van-icon
                v-if="item.desc"
                class="c-m-l-10"
                name="info-o"
                color="#ff6900"
                @click="openMaterialDetail(item.name, item.desc)"
                :data-event="{ id: 'qoidjff4BM' }"
              />
            </view>
            <view>
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
                style="border: 1px solid #ff6900; color: #ff6900" :data-event="{id:'BWC1q8QPmb'}">
                材料介绍
              </text> -->
            </view>
          </view>
          <view class="c-flex c-flex-between c-item-end">
            <view class="c-red c-bold">
              <text v-if="item.price || item.price === 0">¥{{ item.price }}</text>
            </view>
            <van-stepper
              v-if="item.exts.count > 0"
              :min="0"
              :value="item.exts.count"
              input-class="input-class"
              plus-class="plus-class"
              minus-class="minus-class"
              button-size="24"
              @change="onNumberChange($event, item, i)"
            />
          </view>
        </view>
      </view>
      <!-- <view slot="right" class="c-flex c-flex-center c-h-100" style="width: 50px">
          <van-icon name="delete" class="c-red" size="20px" />
        </view>
      </van-swipe-cell> -->
      <van-empty description="还没有添加商品" v-if="cart.length == 0" />
    </view>
    <van-submit-bar
      :price="totalAmount * 100"
      button-text="去结算"
      @submit="toSettle"
      button-class="c-submit-button"
      :data-event="{ id: 'nU6YKNE-vh', capture: false }"
    >
      <van-checkbox :value="selectAll" @change="selectAllChange">全选</van-checkbox>
    </van-submit-bar>
    <!-- 展示材料介绍  -->
    <van-dialog
      :title="material.currentName"
      :show="material.openMaterialDetail"
      use-slot
      @confirm="material.openMaterialDetail = false"
      confirm-button-color="#ff6900"
      :data-event="{ id: 'pW4QzQ_A9G', capture: false }"
    >
      <view style="height: 50vh; overflow-y: auto; font-size: 14px; padding: 20rpx">
        <rich-text :nodes="material.currentDetail"></rich-text>
      </view>
    </van-dialog>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      phone: '',
      // address: {},
      edit: false, // 编辑购物车
      cart: [],
      totalAmount: 0,
      selectAll: false,
      options: {
        codecfg_materialType: { codeId: 'type1' },
        codecfg_unit: { codeId: 'company' },
        unit: []
      },
      material: {
        openMaterialDetail: false,
        currentName: '',
        currentDetail: ''
      }
    };
  },
  onLoad(param) {
    console.log('cart-onLoad');
    common.osg.init(this, param, app);
    this.phone = wx.getStorageSync('user').phone;
    common.osg.codeoption();
  },
  onShow() {
    common.osg.init(this, {}, app);
    console.log('cart-onShow');
    this.cart = wx.getStorageSync(`cart_${this.phone}`) || [];
    if (this.cart.length == 0) {
      this.selectAll = false;
    }
    this.total();
  },
  onHide() {
    console.log('cart-onHide');
    wx.setStorageSync(`cart_${this.phone}`, this.cart);
  },
  onUnload() {
    console.log('cart-onUnload');
    wx.setStorageSync(`cart_${this.phone}`, this.cart);
  },
  methods: {
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
    openMaterialDetail(name, detail) {
      this.material.currentName = name;
      this.material.currentDetail = detail.replace(/<img /g, '<br><img style="max-width:100%" ');
      this.material.openMaterialDetail = true;
    },
    // 修改购物车内商品数量
    onNumberChange(e, item, i) {
      item.exts.count = Number(e.detail) || 0;
      // 当数量减为0时，将购物车内对应的商品删除
      if (item.exts.count == 0) {
        this.cart.splice(i, 1);
      }
      if (item.checked) this.total();
    },
    // 计算购物车内商品总金额
    total() {
      let totalAmount = 0;
      this.cart.map(item => {
        if (item.checked) {
          totalAmount += item.exts.count * (item.price || 0);
        }
      });
      this.totalAmount = totalAmount;
    },
    onCheck(e, item) {
      item.checked = e.detail;
      this.total();
      // 全选标识
      for (let i = 0; i < this.cart.length; i++) {
        if (!this.cart[i].checked) {
          this.selectAll = false;
          return;
        }
      }
      this.selectAll = true;
    },
    selectAllChange(e) {
      this.selectAll = e.detail;
      if (this.selectAll) {
        this.cart.map(item => {
          item.checked = true;
        });
      } else {
        this.cart.map(item => {
          item.checked = false;
        });
      }
      this.total();
    },
    // 批量删除购物车内商品
    batchDeletion() {
      let selectedList = []; // 已选中数组
      let unSelectedList = []; // 未选中数组
      this.cart.map(item => {
        if (item.checked) {
          selectedList.push(item);
        } else {
          unSelectedList.push(item);
        }
      });
      if (selectedList.length == 0) {
        common.osg.toast('请先选择商品！', 'none');
        return;
      }
      this.cart = unSelectedList;
      wx.setStorageSync(`cart_${this.phone}`, unSelectedList);
    },
    toSettle() {
      if (this.cart.length == 0) {
        common.osg.toast('请先在商城添加要下单的商品！', 'none');
        return;
      }
      let materialList = []; // 已选中数组
      let unSelectedList = []; // 未选中数组
      this.cart.map(item => {
        if (item.checked) {
          materialList.push(item);
        } else {
          unSelectedList.push(item);
        }
      });
      if (materialList.length == 0) {
        common.osg.toast('请勾选要下单的商品！', 'none');
        return;
      }
      wx.setStorageSync('orderGoods', materialList);
      common.osg.open('./placeOrder');
    }
  }
};
</script>

<style lang="scss">
.cart {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .classify-goods-item {
    display: flex;
    align-items: center;
    width: calc(100% - 30px);
    margin: 10px 15px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: #fff;
    .classify-image {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      margin-right: 10px;
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
      .input-class {
        border-radius: 12px;
        min-width: 42px;
      }
      .minus-class {
        background: #fff;
      }
      .plus-class {
        background: #fff;
      }
    }
  }
  .van-submit-bar {
    // .van-submit-bar__text {
    //   visibility: hidden;
    // }
    .c-submit-button {
      background: #ff6900;
      border-color: #ff6900;
    }
  }
}
</style>
