<template>
  <view>
    <view class="background"></view>
    <view class="products">
      <view
        class="product"
        v-for="(item, i) in wares"
        :key="i"
        @click="open('./good', { id: item._id, partnerId: partnerId, promoterId: promoterId })"
      >
        <image
          :src="(item.images[0] && item.images[0].url) || 'https://pub.fsgo365.cn/product1.png'"
          mode="aspectFill"
          style="width: 100%; display: flex"
          :style="'height:' + imageSize + 'px'"
        ></image>
        <view class="product-info">
          <view>
            <view class="product-title">{{ item.name }}</view>
            <view class="product-desc">{{ item.description || '' }}</view>
          </view>
          <view>
            <view class="product-area">{{ item.exts.applicableArea || '' }}</view>
            <view class="product-price">¥ {{ item.price }}</view>
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
      partnerId: '',
      promoterId: '',
      wares: [],
      imageSize: 156 // 商品图片宽高相等，根据屏幕宽度计算
    };
  },
  onLoad(params) {
    // 获取系统信息
    let systemInfo = app.globalData.systemInfo;
    // 计算商品照片宽高
    this.imageSize = (systemInfo.windowWidth - 60) / 2;

    common.osg.init(this, params, app);
    this.partnerId = params.partnerId || '';
    this.promoterId = params.promoterId || '';
    this.getWares();
  },
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    },
    // 查询C端服务商品
    getWares() {
      common.osg.ajax(
        '/wares/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.wares = res.data;
        }
      );
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
    display: flex;
    flex-direction: column;
    .product-info {
      padding: 10px;
      color: #393838;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .product-title {
        font-size: 15px;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .product-desc {
        color: #d41e1e;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
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
</style>
