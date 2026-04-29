<template>
  <view class="activity" @click.capture="track">
    <image
      src="https://pub.fsgo365.cn/activityBanner1.jpeg"
      mode="widthFix"
      style="width: 100vw; display: flex"
    />
    <view class="activity-products">
      <view class="activity-product">
        <image
          src="https://pub.fsgo365.cn/activityProduct.png"
          mode="widthFix"
          style="width: 116px; height: 116px; display: flex; border-radius: 5px"
        />
        <view class="info">
          <view class="title">卫生间防水补漏</view>
          <view>
            <view class="price">¥999.00</view>
            <view class="buy">
              <view class="buy-surplus">
                <text>仅剩58件</text>
                <van-progress
                  percentage="70"
                  pivot-text=" "
                  color="#FF2000"
                  custom-class="buy-progress"
                />
              </view>
              <view class="buy-button">马上抢</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="slogan">
      <image
        src="../../static/images/arrow-up.png"
        style="width: 20px; height: 12px; margin-right: 6px"
      />
      <text>专属券益，省薪服务</text>
    </view>
    <view class="coupons">
      <view class="coupon">
        <image src="https://pub.fsgo365.cn/coupon.png" style="width: 100%; height: 100%" />
        <image
          src="https://pub.fsgo365.cn/coupon-bottom.png"
          style="width: 100%; height: 34px; position: absolute; left: 0; bottom: 0"
        />
        <view class="coupon-info">
          <view class="coupon-price">
            60
            <text class="coupon-unit">元</text>
          </view>
          <view class="coupon-condition">满300元可用</view>
          <view class="coupon-desc">仅可购买生间防水类服务商品</view>
        </view>
        <view class="coupon-info-bottom">已领取</view>
      </view>
      <view class="coupon">
        <image src="https://pub.fsgo365.cn/coupon.png" style="width: 100%; height: 100%" />
        <image
          src="https://pub.fsgo365.cn/coupon-bottom.png"
          style="width: 100%; height: 34px; position: absolute; left: 0; bottom: 0"
        />
        <view class="coupon-info">
          <view class="coupon-price">
            60
            <text class="coupon-unit">元</text>
          </view>
          <view class="coupon-condition">满300元可用</view>
          <view class="coupon-desc">仅可购买生间防水类服务商品</view>
        </view>
        <view class="coupon-info-bottom">已领取</view>
      </view>
    </view>
    <view class="slogan">
      <image
        src="../../static/images/arrow-up.png"
        style="width: 20px; height: 12px; margin-right: 6px"
      />
      <text>超值补贴，惊喜低价</text>
    </view>
    <view class="products">
      <block v-for="(item, i) in 5" :key="i">
        <view class="product">
          <image
            src="https://pub.fsgo365.cn/product1.png"
            mode="aspectFill"
            style="width: 100%; height: 156px; display: flex"
          ></image>
          <view class="product-info">
            <view class="product-title">屋顶翻新</view>
            <view class="product-desc">一次维修，终身无忧</view>
            <view class="product-area">80～100㎡</view>
            <view class="product-price">¥ 20000.00</view>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.activity {
  min-height: 100vh;
  background: #fad749;
  .activity-products {
    margin-bottom: 25px;
    .activity-product {
      display: flex;
      background: #fff;
      display: flex;
      margin: 15px 20px;
      padding: 10px;
      border-radius: 8px;
      .info {
        flex: 1;
        padding: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          color: #333;
          font-size: 15px;
          font-weight: 600;
        }
        .price {
          color: #ff2000;
          font-size: 20px;
          margin-bottom: 7px;
        }
        .buy {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .buy-surplus {
            color: #333;
            font-size: 10px;
            width: 86px;
            ::v-deep .buy-progress {
              margin-top: 6px;
            }
          }
          .buy-button {
            border-radius: 100px;
            background: #ff0505;
            color: #fff;
            text-align: center;
            font-size: 13px;
            font-weight: 600;
            padding: 2px 16px;
          }
        }
      }
    }
  }
  .slogan {
    color: #6b4205;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
  }
  .coupons {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: 20px 0 30px;
    .coupon {
      width: 158px;
      height: 102px;
      position: relative;
    }
    .coupon-info {
      position: absolute;
      left: 0;
      top: 0;
      text-align: center;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .coupon-price {
        color: #fff;
        font-size: 26px;
        font-weight: 600;
        .coupon-unit {
          font-size: 14px;
          font-weight: 400;
        }
      }
      .coupon-condition {
        border-radius: 16px;
        background: #f9de55;
        width: 64px;
        height: 13px;
        line-height: 13px;
        color: #010101;
        font-size: 8px;
        font-weight: 300;
        margin-bottom: 2px;
      }
      .coupon-desc {
        color: #fff;
        font-size: 10px;
        font-weight: 400;
      }
    }
    .coupon-info-bottom {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 13px;
    }
  }
  .products {
    padding: 10px 10px 30px;
    display: flex;
    flex-wrap: wrap;
    .product {
      background: #fff;
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
}
</style>
