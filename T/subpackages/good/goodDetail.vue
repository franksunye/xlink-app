<template>
  <view class="account">
    <view class="imageBlock">
      <image
        v-if="!bigImg"
        class="imageB"
        mode="widthFix"
        :src="activityDefData.exts.descUrls[0]"
      />
      <image v-else class="imageB" mode="widthFix" :src="bigImg" />
      <view
        class="imageView"
        :style="'position: absolute;right: 25px;top: ' + 80 * (index + 1) + 'px'"
        v-for="(item, index) in activityDefData.exts.descUrls"
        :key="index"
      >
        <image class="imageS" mode="widthFix" :src="item" @click="changeBigImg(item)" />
      </view>
    </view>
    <view class="titleBlock">
      <view>屋顶翻新</view>
      <view>
        <view>预估成交价</view>
        <view>¥{{ activityDefData.exts.estimatePrice }}</view>
      </view>
    </view>
    <view class="contentBlock">
      <view>
        <view>
          <image
            style="width: 12px; margin-top: 2px; padding-right: 5px"
            mode="widthFix"
            src="../../static/images/goodIcon.png"
          />
          <view>有效线索佣金：</view>
          <view>100元/个</view>
        </view>
        <view>
          用户下单购买或预约后，管家会免费上门勘查，确认是漏水原因，则判定为有效线索，无论用户是否选择继续维修服务，修链都将立即支付佣金100元/个。
        </view>
      </view>
      <view>
        <view>
          <image
            style="width: 12px; margin-top: 2px; padding-right: 5px"
            mode="widthFix"
            src="../../static/images/goodIcon.png"
          />
          <view>交付完成佣金：</view>
          <view>合同总价5%（¥500±）</view>
        </view>
        <view>
          用户签订合同后，修链维修服务团队开始维修服务，最终服务完成验收交付后，修链立即支付合同总价金额5%（¥500±）佣金，单项佣金上限10000元，后续消费者产生退款行为，修链不会撤回已支付佣金。
        </view>
      </view>
    </view>
    <view class="goodBlock">
      <view>
        <view>
          <van-icon name="location" size="13px" />
          <view>北京</view>
        </view>
        <view>
          <van-icon name="cart" size="13px" />
          <view>30 已出售</view>
        </view>
        <view>
          <van-icon name="star" color="#FACC15" size="13px" />
          <view>5.0</view>
        </view>
      </view>
      <van-divider />
      <view class="goodBlockTitle">精选服务推荐</view>
      <view v-for="(item, index) in activityDefDatas" :key="index">
        <view
          class="c-flex good"
          @click="doOpen('../../subpackages/good/goodDetail', { _id: item._id })"
        >
          <view style="padding-right: 15px">
            <image style="width: 116px" mode="widthFix" :src="item.exts.goodsImg[0].url" />
          </view>
          <view>
            <view class="c-flex">
              <image
                style="width: 41px; padding-right: 8px"
                mode="widthFix"
                src="../../static/images/goodsLogo.png"
              />
              <text style="color: #000; font-size: 14px; font-weight: 500">{{ item.name }}</text>
            </view>
            <view style="padding: 5px 0">
              <!-- <van-tag style="padding-right: 5px" plain color="#EF3922" text-color="#EF3922">
                19元勘查券
              </van-tag> -->
              <van-tag plain color="#D9D9D9" text-color="#878787">
                {{ format('activityDefTag', item.exts.activityTag, 'multiple') }}
              </van-tag>
            </view>
            <view style="display: flex; padding-bottom: 5px">
              <view style="padding-right: 10px">
                <text class="textTitle">有效线索</text>
                <text class="textIcon">￥</text>
                <text class="textNum">{{ item.exts.effectiveCluesCost }}</text>
              </view>
              <view>
                <text class="textTitle">佣金比例</text>
                <text class="textNum">{{ item.exts.commissionRate }}%</text>
                <text class="textNum2">(￥200±)</text>
              </view>
            </view>
            <view style="position: relative">
              <image
                style="width: 80px; width: 80px; height: 40px; position: absolute; z-index: 1"
                mode="widthFix"
                src="../../static/images/Vector1.png"
              />
              <view style="position: relative; z-index: 2">
                <view style="display: flex">
                  <text
                    style="
                      color: #fff;
                      font-size: 12px;
                      font-weight: 500;
                      position: absolute;
                      left: 3px;
                      top: 12px;
                    "
                  >
                    ￥
                  </text>
                  <text
                    style="
                      color: #fff;
                      font-size: 20px;
                      font-weight: 600;
                      position: absolute;
                      left: 14px;
                      top: 5px;
                    "
                  >
                    {{ item.exts.goodsPrice || '' }}
                  </text>
                </view>
                <view style="position: relative; top: 25px">
                  <text
                    style="
                      color: #fff;
                      font-size: 8px;
                      font-weight: 400;
                      position: absolute;
                      left: 8px;
                      top: 4px;
                      width: 40px;
                    "
                  >
                    {{ item.exts.goodsTitle || '' }}¥{{ item.exts.initialGoodPrice || '' }}
                  </text>
                  <view
                    style="
                      width: 45px;
                      height: 1px;
                      overflow: hidden;

                      background: #fff;
                      position: absolute;
                      top: 10px;
                      left: 5px;
                    "
                  ></view>
                </view>
              </view>

              <image
                style="width: 90px; position: absolute; left: 55px; top: 10px"
                mode="widthFix"
                src="../../static/images/Vector2.png"
              />
              <view style="position: absolute; left: 80px; top: 15px">
                <text
                  style="
                    color: #f03a23;
                    font-size: 10px;
                    font-weight: 500;
                    position: relative;
                    bottom: 4px;
                    right: 4px;
                  "
                >
                  赚￥
                </text>

                <text
                  style="
                    color: #f03a23;
                    font-size: 17px;
                    font-weight: 600;
                    position: relative;
                    right: 4px;
                  "
                >
                  {{ item.exts.earnedPrice }}
                </text>
              </view>
              <image
                style="width: 15px; position: absolute; left: 135px; top: 10px"
                mode="widthFix"
                src="../../static/images/Vector3.png"
              />
              <image
                style="width: 62px; position: absolute; left: 135px; top: 10px"
                mode="widthFix"
                src="../../static/images/Vector4.png"
              />
              <view style="position: absolute; left: 150px; top: 12px">
                <text style="color: #fff; font-size: 11px; font-weight: 400; padding-right: 3px">
                  马上推
                </text>
                <image
                  style="width: 6px"
                  mode="widthFix"
                  src="../../static/images/VectorIcon.png"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottomBtn">
      <van-button @click.native.stop="doBackground()">立即分享</van-button>
    </view>
    <poster
      v-if="qrcodeShow"
      id="poster"
      :config="posterConfig"
      @success="onPosterSuccess"
      @fail="onPosterFail"
    ></poster>
    <van-dialog
      style="overflow: hidden"
      use-slot
      title="分享海报"
      :show="qrcodeShow"
      @confirm="closeQrcode"
      :showConfirmButton="false"
    >
      <view style="overflow-y: auto">
        <image mode="widthFix" style="width: 100%" :src="savepicRoute" />
        <tki-qrcode
          style="visibility: hidden"
          class="tki-qrcode"
          :val="qrval"
          :size="qrsize"
          ref="qrcode"
          :onval="true"
          @result="doQrcodeRoute"
          :lv="1"
        ></tki-qrcode>
        <view style="display: flex; justify-content: space-around; padding-bottom: 10px">
          <van-button round size="small" @click="share">保存/分享</van-button>
          <van-button round size="small" @click="qrcodeShow = false">关闭</van-button>
        </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
import tkiQrcode from '@/wxcomponents/tki-qrcode/tki-qrcode.vue';
import Poster from '../../wxcomponents/miniprogram_dist/poster';
import Poster2 from '../../wxcomponents/miniprogram_dist/poster/poster';
export default {
  components: {
    tkiQrcode,
    Poster
  },
  data() {
    return {
      systemInfo: {
        menuButtonObject: {}
      },
      bigImg: '',
      activityDefId: '',
      activityDefData: {},
      options: {
        codecfg_activityDefTag: { codeId: 'activityDefTag' }
      },
      // 海报二维码参数
      qrcodeShow: false, //是否展示二维码弹窗
      qrval: '', //二维码地址
      qrsize: '', //二维码大小
      qrcodeRoute: '', //二维码图片路径
      qrx: '', //二维码坐标左上角x轴
      qry: '', //二维码坐标左上角y轴
      backgroundpic: '', //背景图片路径
      //获取背景图片的宽高
      backgroundpicWidth: '',
      backgroundpicHeight: '',
      posterConfig: {}, //画布数据
      // savepic: '', //海报路径
      savepicRoute: '', //保存相册
      userId: '',
      activityDefDatas: {} //商品模板
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    let user = wx.getStorageSync('user');
    this.userId = user.user._id;
    this.activityDefId = params._id;
    common.osg.codeoption(() => {
      this.getActivityDefFindById();
      this.getActivityDefs();
    });
  },
  onShow() {},
  methods: {
    doOpen(path, data, options) {
      common.osg.open(path, data, options);
    },
    changeBigImg(e) {
      this.bigImg = e;
    },
    getActivityDefFindById() {
      common.osg.ajax(
        'wmt/biz/activityDef/findById',
        {
          id: this.activityDefId
        },
        res => {
          res.data.tplImageFileid = JSON.parse(res.data.tplImageFileid);
          this.activityDefData = res.data;
          console.log(this.activityDefData, 'this.activityDefData');
        }
      );
    },
    getActivityDefs() {
      common.osg.ajax(
        'wmt/biz/activityDef/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:exts.activityDefType|string#and': '2',
          'is:exts.isRecommend|string#and': '1'
        },
        res => {
          this.activityDefDatas = res.data;
          console.log(this.activityDefDatas, 'this.activityDefDatas');
        }
      );
    },
    //反显字典表
    format(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (!val || val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    // 解析上传七牛云
    filePic(filePath, callback) {
      let downloadUrl = 'https://pub.fsgo365.cn/';
      common.osg.ajax(
        'back/super/file/upToken.do',
        {
          fileName: '12345.' + 'png'
        },
        data => {
          wx.uploadFile({
            url: 'https://up-z1.qiniup.com',
            filePath,
            name: 'file',
            formData: data,
            success: res => {
              callback({ url: downloadUrl + JSON.parse(res.data).key });
            }
          });
        },
        {
          noload: true
        }
      );
    },
    doBackground() {
      this.backgroundpic = this.activityDefData.tplImageFileid[0].url;
      // 坐标去除字符串
      //   this.qrx = JSON.parse(this.activityDefData.tplQrcodex);
      //   this.qry = JSON.parse(this.activityDefData.tplQrcodey);
      this.qrx = this.activityDefData.tplQrcodex;
      this.qry = this.activityDefData.tplQrcodey;
      this.getBackgroundpicSize();
      this.showQrcode();
      console.log(this.backgroundpic, '----backgroundpic');
    },
    onPosterSuccess(e) {
      // const { detail } = e;
      // wx.previewImage({
      //   current: detail,
      //   urls: [detail]
      // });
      this.savepicRoute = e.detail;
      // this.filePic(e.detail, res => {
      //   this.savepic = res.url;
      // });
    },
    // 获取背景图片的大小
    getBackgroundpicSize() {
      let that = this;
      wx.getImageInfo({
        src: this.backgroundpic,
        success(res) {
          that.backgroundpicWidth = res.width;
          that.backgroundpicHeight = res.height;
          console.log(
            that.backgroundpicWidth,
            that.backgroundpicHeight,
            '--this.backgroundpicSize'
          );
          console.log(res.width);
          console.log(res.height);
        }
      });
    },
    // 展示二维码
    showQrcode(e) {
      /**
       * 注意qrval的域名测试时替换     https://xlinkbate.fsgo365.cn
       */
      //shareUserId分享人id

      this.qrval = `${this.activityDefData.tplQrcode}&shareUserId=${this.userId}&activity=${this.activityDefData._id}&channelType=tg`;
      this.qrsize = this.activityDefData.tplQrcodeSize;
      this.qrcodeShow = true;
      this.$nextTick(() => {
        this.$refs.qrcode._makeCode();
      });
    },
    closeQrcode() {
      this.savepicRoute = '';
      this.$refs.qrcode._clearCode();
      this.qrcodeShow = false;
    },
    doQrcodeRoute(e) {
      this.filePic(e, res => {
        this.qrcodeRoute = res.url;
        console.log(this.qrcodeRoute, '---二维码地址');
        this.onCreatePoster();
      });
    },
    // 画布
    onCreatePoster() {
      console.log(this.qrcodeRoute, '画布查询qr');
      console.log('backgroundpic', this.backgroundpic);
      // setData配置数据
      this.posterConfig = {
        // width: 750,
        // height: 1054,
        width: this.backgroundpicWidth,
        height: this.backgroundpicHeight,
        backgroundColor: '#ffffff',
        debug: false,
        pixelRatio: 1,
        // texts: [
        //     {
        //         x:136,
        //         y: 81,
        //         text: '友谊的小船急需你的助力',
        //         fontSize: 30,
        //         fontWeight: '400',
        //         color: '#333',
        //     }
        // ],

        images: [
          // 海报背景图
          {
            // width: 750,
            // height: 1054,
            width: this.backgroundpicWidth,
            height: this.backgroundpicHeight,
            x: 0,
            y: 0,
            url: this.backgroundpic
            // zIndex: 1
          },
          // 海报二维码
          {
            width: this.qrsize,
            height: this.qrsize,
            x: this.qrx,
            y: this.qry,
            url: this.qrcodeRoute,
            zIndex: 1
          }
        ]
      };
      this.$nextTick(() => {
        Poster2.create();
      });

      console.log(this.posterConfig, 'canvas数据', this.qrcodeRoute);
    },
    //分享给朋友
    share() {
      wx.showShareImageMenu({
        path: this.savepicRoute,
        success: res => {
          common.osg.toast('操作成功');
          console.log('分享成功：', res);
        },
        fail: err => {
          console.log('分享取消：', err);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 10px;
  background: #f8f8f8;
}
::v-deep .tki-qrcode {
  height: 0px;
}
.imageBlock {
  position: relative;
  .imageB {
    height: 414px;
    width: 100%;
  }
  .imageView {
  }
  .imageS {
    width: 70px;
    border-radius: 8px;
  }
}
.titleBlock {
  background: #fff;
  > view:first-child {
    color: #111;
    font-size: 32px;
    font-weight: 500;
    padding: 25px 0 10px 25px;
  }
  > view:last-child {
    font-size: 14px;
    font-weight: 500;
    display: flex;
    margin: 0 0 10px 25px;
    > view:first-child {
      margin-top: 6px;
      padding-right: 3px;
    }
    > view:last-child {
      font-size: 24px;
      font-weight: 700;
    }
  }
}
.contentBlock {
  background: #fff;
  margin: 5px 0;
  > view {
    padding: 10px 25px 10px 25px;
    > view:first-child {
      display: flex;
      color: #106cff;
      font-size: 12px;
      font-weight: 600;
    }
    > view:last-child {
      color: #000;
      font-size: 9px;
      font-weight: 400;
    }
  }
}
.goodBlock {
  background: #fff;
  margin: 5px 0 45px 0px;
  > view:first-child {
    padding-top: 20px;
    display: flex;
    justify-content: space-around;
    > view {
      display: flex;
      font-size: 12px;
      font-weight: 500;
      > view:last-child {
        padding-left: 5px;
      }
    }
  }
  .goodBlockTitle {
    font-size: 16px;
    font-weight: 700;
    padding: 5px 25px 10px 25px;
  }
}
.good {
  justify-content: space-around;
  // padding: 10px 0 30px 27px;
  padding-bottom: 20px;
  // padding: 0 10px 20px 10px;

  .textTitle {
    color: #6d6d6d;
    font-family: Inter;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding-right: 2px;
  }
  .textIcon {
    color: #f03a23;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .textNum {
    color: #f03a23;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .textNum2 {
    color: #f03a23;
    font-family: Inter;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
.bottomBtn {
  position: fixed;
  bottom: 0px;
  width: 100%;
  z-index: 99;
  ::v-deep .van-button {
    height: 45px;
    line-height: 45px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    width: 100%;
    background: linear-gradient(219deg, #f75429 0%, #eb2b1e 100%);
    border-color: #eb2b1e;
  }
}
</style>
