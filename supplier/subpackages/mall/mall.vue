<template>
  <view class="mall">
    <view class="c-flex c-bg-white">
      <van-search
        placeholder="搜索"
        shape="round"
        :value="searchValue"
        @search="onSearch"
        @clear="onSearchClear"
        class="c-flex-1"
      />
      <van-icon
        name="cart-o"
        size="20px"
        style="width: 30px; margin-right: 10px"
        @click="doOpen('./cart')"
        :info="cartTotal || ''"
      />
      <van-icon
        name="balance-list-o"
        size="20px"
        style="width: 30px; margin-right: 10px"
        @click="doOpen('../purchase/purchaseOrderItems')"
      />
    </view>
    <!-- <view class="classify-top">
      <view
        class="classify-view"
        :class="item._id == selectedClassify[0]._id ? 'classify-view-active' : ''"
        v-for="(item, i) in classify"
        :key="i"
        @click="classifyClick(item)"
      >
        <image class="classify-image" :src="item.imageUrl" />
        <text class="classify-text">{{ item.name }}</text>
      </view>
    </view> -->
    <view class="classify-content">
      <!-- <view
        class="classify-left"
        v-if="selectedClassify[0] && selectedClassify[0].children.length > 0"
      >
        <view
          class="classify-left-item"
          :class="item._id == selectedClassify[1]._id ? 'classify-left-item-active' : ''"
          v-for="(item, i) in selectedClassify[0].children"
          :key="i"
          @click="classifyClick2(item)"
        >
          {{ item.name }}
        </view>
      </view> -->
      <view class="classify-goods">
        <!-- <view
          class="classify-right"
          v-if="selectedClassify[1] && selectedClassify[1].children.length > 0"
        >
          <view
            class="classify-right-item"
            :class="item._id == selectedClassify[2]._id ? 'classify-right-item-active' : ''"
            v-for="(item, i) in selectedClassify[1].children"
            :key="i"
            @click="classifyClick3(item)"
          >
            {{ item.name }}
          </view>
        </view> -->
        <block v-for="(item, i) in data" :key="i">
          <view
            class="classify-goods-item"
            v-if="
              searchValue ? item.name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1 : true
            "
          >
            <image
              :src="
                (item.images && JSON.parse(item.images)[0].url) || '../../static/images/logo.png'
              "
              class="classify-image"
            />
            <view class="classify-goods-item-view">
              <view>
                <view>{{ item.name }}</view>
                <view>
                  <text class="desc-tag" v-if="item.code">编号：{{ item.code || '' }}</text>
                  <text class="desc-tag" v-if="item.type">
                    类型：{{ codelabel('materialType', String(item.type)) }}
                  </text>
                  <text class="desc-tag" v-if="item.exts.brand">
                    品牌：{{ item.exts.brand || '' }}
                  </text>
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
                  @change="onNumberChange($event, item)"
                />
                <van-icon v-else name="plus" class="c-plus" @click="onAdd(item)" />
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      classify: [],
      selectedClassify: [],
      searchValue: '',
      data: [],
      cart: [],
      cartTotal: 0,
      options: {
        codecfg_materialType: { codeId: 'type1' },
        codecfg_unit: { codeId: 'company' }
      }
    };
  },
  onLoad(param) {
    console.log('mall-onLoad');
    common.osg.init(this, param, app);
    // this.getClassify();
    common.osg.codeoption();
  },
  onShow() {
    console.log('mall-onShow');
    this.cart = wx.getStorageSync('cart') || [];
    this.total();
    this.getGoods();
  },
  onHide() {
    console.log('mall-onHide');
    wx.setStorageSync('cart', this.cart);
  },
  onUnload() {
    console.log('mall-onUnload');
    wx.setStorageSync('cart', this.cart);
  },
  methods: {
    doOpen(path) {
      common.osg.open(path);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    onSearch(e) {
      this.searchValue = e.detail;
    },
    onSearchClear() {
      this.searchValue = '';
    },
    // getClassify() {
    //   common.osg.ajax(
    //     'biz/classify/queryClassify',
    //     {
    //       _all: '1',
    //       'is:state|integer#and': 1,
    //       sortField: 'order',
    //       sortOrder: 'asc'
    //     },
    //     res => {
    //       this.classify = res.data;
    //       if (res.data.length > 0) this.classifyClick(res.data[0]);
    //     }
    //   );
    // },
    // classifyClick(item) {
    //   this.$set(this, 'selectedClassify', [item]);
    //   console.log(this.selectedClassify);
    //   this.$forceUpdate();
    //   if (item.children.length > 0) {
    //     this.selectedClassify.push(item.children[0]);
    //     this.getGoods(item.children[0]._id);
    //   } else {
    //     this.getGoods(item._id);
    //   }
    // },
    // classifyClick2(item) {
    //   this.selectedClassify[1] = item;
    //   this.selectedClassify.splice(2, 1);
    //   this.getGoods(item._id);
    // },
    // classifyClick3(item) {
    //   this.selectedClassify[2] = item;
    //   this.getGoods(item._id);
    // },
    getGoods(classifyId) {
      common.osg.ajax(
        'biz/goods/queryGoods',
        {
          _all: '1',
          classifyId: '1928070664098434877',
          sortField: 'type,_id',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.number = 0;
            item.checked = false;
            // 如果购物车中已经存在此商品，取购物内的数量赋值到此商品，将此商品替换到购物车中（加减数量时自动同步修改）
            for (let i = 0; i < this.cart.length; i++) {
              if (item._id == this.cart[i]._id) {
                item.number = this.cart[i].number;
                this.cart[i] = item;
                break;
              }
            }
          });
          this.data = res.data;
          console.log('this.data', this.data);
          console.log('this.cart', this.cart);
        },
        {
          noload: true
        }
      );
    },
    // 点击加号添加商品
    onAdd(item) {
      item.number = 1;
      // 将商品添加到购物车
      this.cart.unshift(item);
      this.total();
    },
    // 修改商品数量
    onNumberChange(e, item) {
      item.number = Number(e.detail) || 0;
      // 当数量减为0时，将购物车内对应的商品删除
      if (item.number == 0) {
        for (let i = 0; i < this.cart.length; i++) {
          if (item._id == this.cart[i]._id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
      this.total();
    },
    // 计算购物车内商品总数
    total() {
      console.log('this.cart', this.cart);
      let cartTotal = 0;
      this.cart.map(item => {
        cartTotal += item.number;
      });
      this.cartTotal = cartTotal;
    }
  }
};
</script>

<style lang="scss">
.mall {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .classify-top {
    font-size: 14px;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    box-shadow: 0 1px 2px 0 #ebedf0;
    z-index: 1;
    .classify-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      .classify-image {
        width: 50px !important;
        height: 50px !important;
        border-radius: 20px;
        border: 1px solid #ebedf0;
        padding: 5px;
        box-sizing: border-box;
      }
      .classify-text {
        margin: 8px 0;
        padding: 0 10px;
        border-radius: 30px;
      }
    }
    .classify-view-active {
      .classify-image {
        border: 1px solid #1989fa;
      }
      .classify-text {
        background-color: #1989fa;
        color: #fff;
      }
    }
  }
  .classify-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    .classify-left {
      background-color: #f5f6f9;
      width: 90px;
      overflow-y: auto;
      font-size: 14px;
      .classify-left-item {
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
      .classify-left-item-active {
        background-color: #fff;
        color: #1989fa;
      }
    }
    .classify-goods {
      flex: 1;
      overflow-y: auto;
      .classify-right {
        display: flex;
        padding: 10px;
        box-sizing: border-box;
        overflow-x: auto;
        .classify-right-item {
          white-space: nowrap;
          margin-right: 10px;
          padding: 5px 10px;
          background: #f5f6f9;
          border-radius: 20px;
        }
        .classify-right-item-active {
          background: #1989fa;
          color: #fff;
        }
      }
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
}
</style>
