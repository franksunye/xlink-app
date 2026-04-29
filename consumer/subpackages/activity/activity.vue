<template>
  <view class="activity">
    <image
      :src="data.exts.descUrl || 'https://pub.fsgo365.cn/activityBanner1.jpeg'"
      mode="widthFix"
      style="width: 100vw; display: flex"
    />
    <view class="activity-products">
      <view class="activity-product">
        <image
          :src="
            (wares.images[0] && wares.images[0].url) || 'https://pub.fsgo365.cn/activityProduct.png'
          "
          mode="widthFix"
          style="width: 116px; height: 116px; display: flex; border-radius: 5px"
        />
        <view class="info">
          <view class="title">{{ wares.name || '' }}</view>
          <view>
            <view class="price">¥{{ wares.price || '' }}</view>
            <view class="buy">
              <view class="buy-surplus">
                <text>仅剩58件</text>
                <view class="buy-progress progress">
                  <view style="width: 70%" class="progress-done"></view>
                </view>
              </view>
              <view
                class="buy-button"
                @click="
                  open('../good/good', {
                    id: waresId,
                    partnerId: partnerId,
                    promoterId: promoterId
                  })
                "
              >
                马上抢
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- <view class="slogan">
      <image
        src="../../static/images/arrow-up.png"
        style="width: 20px; height: 12px; margin-right: 6px"
      />
      <text>专属券益，省薪服务</text>
    </view>
    <view class="coupons">
      <view class="coupon">
        <image src="../../static/images/coupon.png" style="width: 100%; height: 100%" />
        <image
          src="../../static/images/coupon-bottom.png"
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
        <image src="../../static/images/coupon.png" style="width: 100%; height: 100%" />
        <image
          src="../../static/images/coupon-bottom.png"
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
    </view> -->
    <view class="slogan">
      <image
        src="../../static/images/arrow-up.png"
        style="width: 15px; height: 9px; margin-right: 6px; margin-bottom: 4px"
      />
      <text>超值补贴，惊喜低价</text>
      <image
        src="../../static/images/arrow-up.png"
        style="width: 15px; height: 9px; margin-left: 6px; margin-bottom: 4px"
      />
    </view>
    <view class="products">
      <block v-for="(item, i) in waresData" :key="i">
        <view
          class="product"
          @click="
            open('../good/good', { id: item._id, partnerId: partnerId, promoterId: promoterId })
          "
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
      </block>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      id: '',
      partnerId: '',
      data: { exts: {} },
      waresId: '',
      wares: {},
      waresData: [],
      imageSize: 156 // 商品图片宽高相等，根据屏幕宽度计算
    };
  },
  onLoad(params) {
    // 获取系统信息
    let systemInfo = app.globalData.systemInfo;
    // 计算商品照片宽高
    this.imageSize = (systemInfo.windowWidth - 60) / 2;

    common.osg.init(this, params, app);
    this.id = params.id;
    this.partnerId = params.partnerId || ''; // 跳转商品详情页后点立即预约要携带partnerId
    this.promoterId = params.promoterId || ''; // 跳转商品详情页后点立即预约要携带promoterId
    this.getData();
    this.getWaresData();
  },
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    },
    getData() {
      common.osg.ajax('biz/activityDef/findById', { id: this.id }, res => {
        this.data = res.data;

        if (res.data.tplQrcode.indexOf('?') != -1) {
          let str = res.data.tplQrcode.split('?')[0];
          let arr = str.split('&');
          for (let i = 0; i < arr.length; i++) {
            let key = arr[i].split('=')[0];
            let value = arr[i].split('=')[1];
            if (key == 'waresId') {
              this.waresId = value;
              this.getWares();
              return;
            }
          }
        } else {
          this.waresId = res.data.tplQrcode;
          this.getWares();
        }
      });
    },
    // 查询活动绑定的C端服务商品
    getWares() {
      common.osg.ajax(
        '/wares/findById',
        {
          id: this.waresId
        },
        res => {
          this.wares = res.data;
        }
      );
    },
    // 查询所有C端服务商品
    getWaresData() {
      common.osg.ajax(
        '/wares/query',
        {
          page: 1,
          rows: 2,
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.waresData = res.data;
        }
      );
    }
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
  .progress {
    width: 86px;
    height: 4px;
    border-radius: 4px;
    background-color: #ebedf0;
    position: relative;
    .progress-done {
      background-color: #ff2000;
      border-radius: inherit;
      height: 100%;
      left: 0;
      position: absolute;
    }
  }
}
</style>
