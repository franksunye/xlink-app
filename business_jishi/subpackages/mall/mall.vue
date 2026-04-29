<template>
  <view class="mall" @click.capture="track">
    <view class="c-line"></view>
    <view class="c-flex c-flex c-bg-white">
      <van-search
        placeholder="搜索"
        shape="round"
        :value="searchValue"
        @search="onSearch"
        @clear="onSearchClear"
        class="c-flex-1"
        custom-class="c-search"
      />
      <!-- <van-icon
        name="cart-o"
        size="20px"
        style="width: 30px; margin-right: 10px"
        @click="doOpen('./cart')"
        :info="cartTotal || ''" :data-event="{id:'cJw6m97y0Z'}" />
      <van-icon
        name="balance-list-o"
        size="20px"
        style="width: 30px; margin-right: 10px"
        @click="doOpen('../purchase/purchaseOrders')" :data-event="{id:'xgOQP4qn-R'}" /> -->
    </view>
    <van-notice-bar style="margin-top: -10px" custom-class="c-bg-white" left-icon="bullhorn-o">
      具体价格请与
      <text
        @click="makePhoneCall('13522846713')"
        style="margin: 0 5px"
        :data-event="{ id: 'kgI_XzFpdO' }"
      >
        王爽 13522846713
      </text>
      最终确认！
    </van-notice-bar>
    <van-tabs
      v-if="selectedClassify[0] && selectedClassify[0].children.length > 0"
      :active="activeClassify2"
      @change="classifyChange2"
      color="#ff6900"
      title-active-color="#ff6900"
      :data-event="{ id: 'MSEhhn9bz5', capture: false }"
    >
      <block v-for="(item, i) in selectedClassify[0].children" :key="i">
        <van-tab v-if="item._id != '6239294986987325343'" :title="item.name" :name="i"></van-tab>
      </block>
    </van-tabs>
    <!-- <view class="classify-top">
      <view
        class="classify-view"
        :class="item._id == selectedClassify[0]._id ? 'classify-view-active' : ''"
        v-for="(item, i) in classify"
        :key="i"
        @click="classifyClick(item)" :data-event="{id:'4eT356a1h4'}">
        <image class="classify-image" :src="item.imageUrl" :data-event="{id:'4eT356a1h4'}" />
        <text class="classify-text" :data-event="{id:'4eT356a1h4'}">{{ item.name }}</text>
      </view>
    </view> -->
    <view class="classify-content">
      <!-- 不展示赠品分类 -->
      <!-- <view
        class="classify-left"
        v-if="selectedClassify[0] && selectedClassify[0].children.length > 0"
      >
        <block v-for="(item, i) in selectedClassify[0].children" :key="i">
          <view
            v-if="item._id != '6239294986987325343'"
            class="classify-left-item"
            :class="item._id == selectedClassify[1]._id ? 'classify-left-item-active' : ''"
            @click="classifyClick2(item)" :data-event="{id:'HNC2ByUtAr'}">
            {{ item.name }}
          </view>
        </block>
      </view> -->
      <view class="classify-goods">
        <view
          class="classify-right"
          v-if="selectedClassify[1] && selectedClassify[1].children.length > 0"
        >
          <view
            class="classify-right-item"
            :class="item._id == selectedClassify[2]._id ? 'classify-right-item-active' : ''"
            v-for="(item, i) in selectedClassify[1].children"
            :key="i"
            @click="classifyClick3(item)"
            :data-event="{ id: 'FrbUdQ17Jl' }"
          >
            {{ item.name }}
          </view>
        </view>
        <block v-for="(item, i) in data" :key="i">
          <view
            class="classify-goods-item"
            v-if="
              searchValue ? item.name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1 : true
            "
            @click="doOpen('./good', { _id: item._id })"
            :data-event="{ id: 'JCZAyBhZBX' }"
          >
            <image
              :src="
                (item.images && JSON.parse(item.images)[0].url) ||
                'https://pub.fsgo365.cn/logo_jishi.jpg'
              "
              class="classify-image"
              :data-event="{ id: 'JCZAyBhZBX' }"
            />
            <view class="classify-goods-item-view" :data-event="{ id: 'JCZAyBhZBX' }">
              <view :data-event="{ id: 'JCZAyBhZBX' }">
                <view class="title" :data-event="{ id: 'JCZAyBhZBX' }">
                  {{ item.name }}
                  <van-icon
                    v-if="item.desc"
                    class="c-m-l-10"
                    name="info-o"
                    color="#ff6900"
                    @click="openMaterialDetail(item.name, item.desc)"
                    :data-event="{ id: 'qM9Jd2MMqG' }"
                  />
                </view>
                <view :data-event="{ id: 'JCZAyBhZBX' }">
                  <!-- <text class="desc-tag" v-if="item.code" :data-event="{id:'JCZAyBhZBX'}">编号：{{ item.code || '' }}</text>
                  <text class="desc-tag" v-if="item.type" :data-event="{id:'JCZAyBhZBX'}">
                    类型：{{ codelabel('materialType', String(item.type)) }}
                  </text>
                  <text class="desc-tag" v-if="item.exts.brand" :data-event="{id:'JCZAyBhZBX'}">
                    品牌：{{ item.exts.brand || '' }}
                  </text> -->
                  <text class="spec" v-if="item.spec" :data-event="{ id: 'JCZAyBhZBX' }">
                    规格：{{ item.spec || ''
                    }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
                  </text>
                  <!-- <text class="desc-tag" v-if="item.model" :data-event="{id:'JCZAyBhZBX'}">型号：{{ item.model || '' }}</text> -->
                  <!-- <text
                    class="spec"
                    v-if="item.desc"
                    @click="openMaterialDetail(item.name, item.desc)"
                    style="border: 1px solid #ff6900; color: #ff6900" :data-event="{id:'IiWytFQ1bC'}">
                    材料介绍
                  </text> -->
                </view>
              </view>
              <view class="c-flex c-flex-between c-item-end" :data-event="{ id: 'JCZAyBhZBX' }">
                <view class="c-red c-bold" :data-event="{ id: 'JCZAyBhZBX' }">
                  <text v-if="item.price || item.price === 0" :data-event="{ id: 'JCZAyBhZBX' }">
                    ¥{{ item.price }}
                  </text>
                </view>
                <van-stepper
                  v-if="item.exts.count > 0"
                  :min="0"
                  :value="item.exts.count"
                  input-class="input-class"
                  plus-class="plus-class"
                  minus-class="minus-class"
                  button-size="24"
                  @change="onNumberChange($event, item)"
                />
                <view v-else class="c-plus" @click="onAdd(item)" :data-event="{ id: 'uWr7Fjk72m' }">
                  <van-icon name="plus" :data-event="{ id: 'uWr7Fjk72m' }" />
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>
    <van-tabbar style="height: 50px" placeholder inactive-color="#333333">
      <van-tabbar-item icon="cart-o" :info="cartTotal || ''" @click.native="doOpen('./cart')">
        购物车
      </van-tabbar-item>
      <van-tabbar-item icon="balance-list-o" @click.native="doOpen('../purchase/purchaseOrders')">
        采购订单
      </van-tabbar-item>
    </van-tabbar>
    <!-- 展示材料介绍  -->
    <van-dialog
      :title="material.currentName"
      :show="material.openMaterialDetail"
      use-slot
      @confirm="material.openMaterialDetail = false"
      confirm-button-color="#ff6900"
      :data-event="{ id: '2wjLVRVeuV', capture: false }"
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
      classify: [],
      selectedClassify: [],
      activeClassify2: 0, // 当前激活的二级分类标签页在二级分类数组中的index
      searchValue: '',
      data: [],
      cart: [],
      cartTotal: 0,
      options: {
        codecfg_materialType: { codeId: 'type1' },
        codecfg_unit: { codeId: 'company' }
      },
      material: {
        openMaterialDetail: false,
        currentName: '',
        currentDetail: ''
      }
    };
  },
  onLoad(param) {
    console.log('mall-onLoad');
    common.osg.init(this, param, app);
    this.phone = wx.getStorageSync('user').phone;
    this.getClassify();
    common.osg.codeoption(() => {
      this.$forceUpdate();
    });
  },
  onShow() {
    console.log('mall-onShow');
    common.osg.init(this, {}, app);
    this.cart = wx.getStorageSync(`cart_${this.phone}`) || [];
    this.total();
    this.getGoods(
      this.selectedClassify.length > 0 &&
        this.selectedClassify[this.selectedClassify.length - 1]._id
    );
  },
  onHide() {
    console.log('mall-onHide');
    wx.setStorageSync(`cart_${this.phone}`, this.cart);
  },
  onUnload() {
    console.log('mall-onUnload');
    wx.setStorageSync(`cart_${this.phone}`, this.cart);
  },
  methods: {
    doOpen(path) {
      common.osg.open(path);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    openMaterialDetail(name, detail) {
      this.material.currentName = name;
      this.material.currentDetail = detail.replace(/<img /g, '<br><img style="max-width:100%" ');
      this.material.openMaterialDetail = true;
    },
    onSearch(e) {
      this.searchValue = e.detail;
    },
    onSearchClear() {
      this.searchValue = '';
    },
    getClassify() {
      common.osg.ajax(
        'biz/classify/queryClassify',
        {
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          this.classify = res.data;
          // 目前商城默认展示分类是材料的商品
          if (res.data.length > 0) this.classifyClick(res.data[0]);
        }
      );
    },
    // 点击一级分类
    classifyClick(item) {
      this.$set(this, 'selectedClassify', [item]);
      this.$forceUpdate();
      if (item.children.length > 0) {
        // 默认请求材料分类下第一个二级分类的商品
        this.selectedClassify.push(item.children[0]);
        this.getGoods(item.children[0]._id);
      } else {
        this.getGoods(item._id);
      }
    },
    // 顶部标签栏切换二级分类，并删除如果已经存在的三级分类
    classifyChange2(e) {
      let item = this.selectedClassify[0].children[e.detail.name];
      this.selectedClassify[1] = item;
      this.selectedClassify.splice(2, 1);
      this.getGoods(item._id);
    },
    // 点击二级分类
    classifyClick2(item) {
      this.selectedClassify[1] = item;
      this.selectedClassify.splice(2, 1);
      this.getGoods(item._id);
    },
    // 点击三级分类
    classifyClick3(item) {
      if (this.selectedClassify[2] && this.selectedClassify[2]._id == item._id) {
        this.selectedClassify.splice(2, 1);
        this.getGoods(this.selectedClassify[1]._id);
      } else {
        this.selectedClassify[2] = item;
        this.getGoods(item._id);
      }
    },
    // 传分类id查该分类的商品
    getGoods(classifyId) {
      common.osg.ajax(
        'biz/goods/queryGoods',
        {
          _all: '1',
          classifyId: classifyId,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.exts = item.exts || {};
            item.exts.count = 0;
            item.checked = false;
            // 如果购物车中已经存在此商品，取购物内的数量赋值到此商品，将此商品替换到购物车中（加减数量时自动同步修改）
            for (let i = 0; i < this.cart.length; i++) {
              if (item._id == this.cart[i]._id) {
                item.exts.count = this.cart[i].exts.count;
                this.cart[i] = item;
                break;
              }
            }
          });
          this.data = res.data;
        },
        {
          noload: true
        }
      );
    },
    // 点击加号添加商品
    onAdd(item) {
      item.exts.count = 1;
      // 将商品添加到购物车
      this.cart.unshift(item);
      this.total();
    },
    // 修改商品数量
    onNumberChange(e, item) {
      item.exts.count = Number(e.detail) || 0;
      // 当数量减为0时，将购物车内对应的商品删除
      if (item.exts.count == 0) {
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
      let cartTotal = 0;
      this.cart.map(item => {
        cartTotal += item.exts.count;
      });
      this.cartTotal = cartTotal;
    },
    makePhoneCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
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
        border: 1px solid #ff6900;
      }
      .classify-text {
        background-color: #ff6900;
        color: #fff;
      }
    }
  }
  .classify-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    .classify-left {
      background-color: #fff;
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
        color: #ff6900;
      }
    }
    .classify-goods {
      flex: 1;
      overflow-y: auto;
      padding: 5px 0 5px;
      .classify-right {
        display: flex;
        padding: 10px;
        box-sizing: border-box;
        overflow-x: auto;
        background-color: #fff;
        .classify-right-item {
          white-space: nowrap;
          margin-right: 10px;
          padding: 5px 10px;
          background-color: #f7f8fa;
          font-size: 12px;
          border-radius: 20px;
        }
        .classify-right-item-active {
          color: #ff6900;
        }
      }
      .classify-goods-item {
        display: flex;
        align-items: center;
        width: calc(100% - 30px);
        margin: 10px 15px;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 8px;
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
    }
  }
  .c-plus {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #ff6900;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    margin: 1px;
    padding: 4px;
    box-sizing: border-box;
    font-size: 11.7px;
  }
}
</style>
