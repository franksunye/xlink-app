<template>
  <view @click.capture="track">
    <view class="background"></view>
    <view class="products">
      <view
        class="product"
        v-for="(item, i) in 9"
        :key="i"
        @click="open('./good', { id: item._id })"
        :data-event="{ id: 'dUk4NETrEa' }"
      >
        <image
          src="https://pub.fsgo365.cn/product1.png"
          mode="aspectFill"
          style="width: 100%; height: 156px; display: flex"
          :data-event="{ id: 'dUk4NETrEa' }"
        ></image>
        <view class="product-info" :data-event="{ id: 'dUk4NETrEa' }">
          <view class="product-title" :data-event="{ id: 'dUk4NETrEa' }">日坛贸易大厦屋顶翻新</view>
          <view
            class="c-flex c-item-center c-flex-between c-m-t-20"
            :data-event="{ id: 'dUk4NETrEa' }"
          >
            <view class="case-like" :data-event="{ id: 'dUk4NETrEa' }">
              <van-icon name="like-o" color="#B1B1B1" :data-event="{ id: 'dUk4NETrEa' }" />
              <text class="case-like-total" :data-event="{ id: 'dUk4NETrEa' }">800</text>
            </view>
            <van-switch
              :checked="false"
              size="20px"
              inactive-color="#efefef"
              style="display: flex"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style lang="scss" scoped>
.background {
  width: 100vw;
  height: 116px;
  background: #ffd700;
  position: absolute;
  top: 0;
  z-index: -1;
}
.products {
  padding: 30px 10px;
  display: flex;
  flex-wrap: wrap;
  .product {
    margin: 10px;
    width: calc(50% - 20px);
    box-sizing: border-box;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 3px 5px 2px 0px rgba(0, 0, 0, 0.08);
    .product-info {
      padding: 10px;
      color: #393838;
      .product-title {
        font-size: 15px;
        font-weight: 700;
      }
      .product-desc {
        color: #d41e1e;
        font-size: 12px;
      }
      .product-area {
        font-size: 14px;
      }
      .product-price {
        font-size: 14px;
        font-weight: 600;
        margin-top: 10px;
      }
    }
  }
}
.case-like {
  .case-like-total {
    color: #a8a8a8;
    margin-left: 5px;
  }
}
</style>
