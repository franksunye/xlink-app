<template>
  <view class="search-page">
    <view class="c-uni-search">
      <uni-search-bar
        v-model="searchValue"
        radius="5"
        placeholder="搜索名称"
        clearButton="auto"
        cancelButton="none"
        @confirm="getWares()"
        class="c-uni-search-bar"
      />
      <view class="search-button c-m-r-20" @click="getWares()">搜索</view>
    </view>
    <view class="products">
      <view
        v-for="(item, i) in wares"
        :key="i"
        class="product"
        @click="open('./good', { id: item._id })"
      >
        <image
          :src="(item.images[0] && item.images[0].url) || 'https://pub.fsgo365.cn/product1.png'"
          mode="aspectFill"
          class="product-image"
        />
        <view class="product-info">
          <view class="product-info-top">
            <view class="product-title-view">
              <image
                src="../../static/images/slogan-logo.png"
                mode="widthFix"
                style="width: 37px; display: flex; margin-right: 7px"
              />
              <view class="product-title">{{ item.name }}</view>
            </view>
            <view class="tags">
              <text class="tag">免费上门出具方案</text>
              <text class="tag" v-if="item.agelimit && item.agelimit != '0'">
                {{ item.agelimit }}年质保
              </text>
            </view>
          </view>

          <view class="product-info-bottom">
            <text class="product-price">{{ item.price }}</text>
            <text class="product-area">
              元
              <text v-if="item.exts.applicableArea">/{{ item.exts.applicableArea || '' }}</text>
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      focus: false,
      searchValue: '',
      wares: []
    };
  },
  onLoad(params) {
    common.osg.init(params);
    this.focus = true;
  },
  methods: {
    onSearchChange(e) {
      this.searchValue = e.detail;
    },
    getWares() {
      if (!this.searchValue) {
        this.wares = [];
        return;
      }
      common.osg.ajax(
        '/wares/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'regex:name|string#and': this.searchValue,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.wares = res.data;
        }
      );
    },
    open(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style lang="scss" scoped>
.search-page {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  .products {
    flex: 1;
    overflow-y: auto;
    padding: 58px 0 30px 0;
    display: flex;
    flex-wrap: wrap;
    .product {
      margin: 10px 16px 0 16px;
      padding: 10px 16px;
      width: calc(100% - 32px);
      height: 125px;
      box-sizing: border-box;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      background: #fff;
      .product-image {
        width: 105px;
        min-width: 105px;
        height: 105px;
        display: flex;
        margin-right: 16px;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
        overflow: hidden;
      }
      .product-info {
        color: #393838;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .product-title-view {
          display: flex;
          align-items: center;
          .product-title {
            color: #000;
            font-size: 16px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .tags {
          margin-top: 15px;
          .tag {
            border-radius: 4px;
            border: 0.8px solid #d9d9d9;
            padding: 2px 5px;
            color: #878787;
            text-align: center;
            font-family: Inter;
            font-size: 10px;
            margin-right: 5px;
          }
        }
        .product-info-bottom {
          color: #f75429;
          font-size: 16px;
          font-weight: 600;
          .product-area {
            font-size: 12px;
          }
        }
      }
    }
  }
}
.c-uni-search {
  position: fixed;
  top: 16px;
  width: calc(100vw - 32px);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 0 16px;
  background: #fff;
  border-radius: 50px;
  overflow: hidden;
  ::v-deep .uni-searchbar {
    flex: 1;
    padding: 0;
    .uni-searchbar__box {
      background: #fff !important;
    }
  }
}
</style>
