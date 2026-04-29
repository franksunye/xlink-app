<template>
  <view class="cart">
    <van-cell
      is-link
      title="配送至"
      :value="address.address || ''"
      icon="location-o"
      link-type="navigateTo"
      :url="'/subpackages/mall/addresses?selectedAddressId=' + address._id"
      title-style="flex:none"
      :border="false"
    />
    <view class="c-flex-1 c-auto-y" style="padding-bottom: 60px">
      <!-- <van-swipe-cell
        :right-width="60"
        v-for="(item, i) in cart"
        :key="i"
        style="margin: 10px"
      > -->
      <view class="classify-goods-item" v-for="(item, i) in cart" :key="i">
        <van-checkbox :value="item.checked" @change="onCheck($event, item)"></van-checkbox>
        <image
          :src="(item.images && JSON.parse(item.images)[0].url) || '../../static/images/logo.png'"
          class="classify-image"
        />
        <view class="classify-goods-item-view">
          <view>
            <view>{{ item.name || item.content }}</view>
            <view>
              <text class="desc-tag" v-if="item.code">编号：{{ item.code || '' }}</text>
              <text class="desc-tag" v-if="item.type">
                类型：{{ codelabel('materialType', String(item.type)) }}
              </text>
              <text class="desc-tag" v-if="item.exts.brand">品牌：{{ item.exts.brand || '' }}</text>
              <text class="desc-tag" v-if="item.spec">
                规格：{{ item.spec || ''
                }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
              </text>
              <text class="desc-tag" v-if="item.model">型号：{{ item.model || '' }}</text>
            </view>
          </view>
          <view class="c-flex c-flex-between c-item-end c-m-t-20">
            <text class="c-red c-bold"></text>
            <van-stepper
              v-if="item.number > 0"
              :min="0"
              :value="item.number"
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
    <van-submit-bar :price="0.0" button-text="提交订单" @submit="placeOrder">
      <van-checkbox :value="selectAll" @change="selectAllChange">全选</van-checkbox>
    </van-submit-bar>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      address: {},
      cart: [],
      totalAmount: 0,
      selectAll: false,
      options: {
        codecfg_materialType: { codeId: 'type1' },
        codecfg_unit: { codeId: 'company' }
      }
    };
  },
  onLoad(param) {
    console.log('cart-onLoad');
    common.osg.init(this, param, app);
    common.osg.codeoption(() => {
      this.cart = wx.getStorageSync('cart') || [];
    });
  },
  onShow() {
    common.osg.init(this, {}, app);
    console.log('cart-onShow');
    let address = wx.getStorageSync('address');
    if (address) {
      this.address = address;
    } else {
      this.getAddress();
    }
  },
  onHide() {
    console.log('cart-onHide');
    wx.setStorageSync('cart', this.cart);
  },
  onUnload() {
    console.log('cart-onUnload');
    wx.setStorageSync('cart', this.cart);
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
      console.log('changeAddress', this.address);
    },
    // 修改购物车内商品数量
    onNumberChange(e, item, i) {
      item.number = Number(e.detail) || 0;
      // 当数量减为0时，将购物车内对应的商品删除
      if (item.number == 0) {
        this.cart.splice(i, 1);
      }
      // this.total();
    },
    // 计算购物车内商品总金额
    total() {
      let totalAmount = 0;
      this.cart.map(item => {
        totalAmount += item.number * item.price;
      });
      this.totalAmount = totalAmount;
    },
    onCheck(e, item) {
      item.checked = e.detail;
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
    },
    placeOrder() {
      if (this.cart.length == 0) {
        common.osg.toast('请先在商城添加要下单的商品！', 'none');
        return;
      }
      let materialList = []; // 已选中数组
      let unselectedCart = []; // 未选中数组
      this.cart.map(item => {
        item.exts.count = item.number;
        if (item.checked) {
          materialList.push(item);
        } else {
          unselectedCart.push(item);
        }
      });
      if (materialList.length == 0) {
        common.osg.toast('请勾选要下单的商品！', 'none');
        return;
      }
      if (!this.address._id) {
        common.osg.toast('请选项收货地址！', 'none');
        return;
      }
      common.osg.ajax(
        'basic/purchaseOrder/upsert',
        {
          data: JSON.stringify({
            area: this.address.area,
            province: this.address.province,
            city: this.address.city,
            district: this.address.district,
            subdistrict: this.address.subdistrict,
            address: this.address.address,
            purchaseAdress: this.address.address,
            materialList: materialList
          })
        },
        res => {
          // 清楚购物车中已下单的商品
          this.cart = unselectedCart;
          common.osg.alert('下单成功！', () => {
            wx.removeStorage('address');
            console.log('navigateBack');
            wx.navigateBack({
              delta: 1
            });
          });
        }
      );
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
    width: calc(100% - 20px);
    margin: 10px;
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
      .desc-tag {
        margin: 6px 6px 0 0;
        padding: 2px 5px;
        border-radius: 4px;
        font-size: 11px;
        display: inline-flex;
        border: 1px solid #ebedf0;
        color: #646566;
      }
    }
  }
  .c-plus {
    background: #f2f3f5;
    margin: 1px;
    border-radius: 4px;
    padding: 4px;
    font-size: 11px;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
  }
  .van-submit-bar {
    .van-submit-bar__text {
      visibility: hidden;
    }
  }
}
</style>
