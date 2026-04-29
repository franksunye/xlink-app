<template>
  <view class="account">
    <view>
      <van-tabs color="#106CFF" :active="active" @change="onChange">
        <van-tab title="海报" name="a">
          <view class="tab">
            <viwe style="display: flex">
              <view
                :class="btnValue == '1' ? 'doTabClick' : 'unDoTabClick'"
                @click="topBtnClick(1)"
              >
                节日问候
              </view>
              <!-- <view
                :class="btnValue == '2' ? 'doTabClick' : 'unDoTabClick'"
                @click="topBtnClick(2)"
              >
                产品推广
              </view> -->
            </viwe>
          </view>
          <view style="display: flex; justify-content: space-around">
            <view v-for="(item, index) in activityDefData" :key="index" style="width: 100%">
              <view class="btnValue1" v-if="btnValue == 1">
                <view>
                  <view>
                    <image style="width: 100%" mode="widthFix" :src="item.tplImageFileid[0].url" />
                  </view>
                  <view class="content">{{ item.name }}</view>
                  <view class="bottomBtn">
                    <!-- <van-button>分享</van-button> -->
                    <view @click.native.stop="doBackground(item)">
                      <image
                        style="width: 10px; padding-right: 5px"
                        mode="widthFix"
                        src="../../static/images/sourceIcon.png"
                      />

                      分享
                    </view>
                  </view>
                </view>
              </view>
              <poster
                v-if="qrcodeShow"
                id="poster"
                :config="posterConfig"
                @success="onPosterSuccess"
                @fail="onPosterFail"
              ></poster>
            </view>
            <!--  -->
            <!-- <view class="btnValue1" v-if="btnValue == 1">
              <view>
                <view>
                  <image
                    style="width: 100%"
                    mode="widthFix"
                    :src="'https://pub.fsgo365.cn/5978917237375483073.png'"
                  />
                </view>
                <view class="content">春夏秋冬春夏秋冬春夏秋冬春夏秋冬</view>
                <view class="bottomBtn">
                  <view>
                    <image
                      style="width: 10px; padding-right: 5px"
                      mode="widthFix"
                      src="../../static/images/sourceIcon.png"
                    />

                    分享
                  </view>
                </view>
              </view>
            </view> -->
          </view>
          <view v-if="btnValue == 2"></view>
        </van-tab>
        <van-tab title="朋友圈" name="b">
          <view class="tab">
            <view
              :class="tabClick == item.value ? 'doTabClick' : 'unDoTabClick'"
              v-for="(item, index) in options.repairPartsOne"
              :key="index"
              @click="tabChange(item.value)"
            >
              {{ item.name }}
            </view>
            <!-- <view :class="btnValue == '2' ? 'doBtnClick' : ''" @click="topBtnClick(2)">
              产品推广
            </view> -->
          </view>
        </van-tab>
      </van-tabs>
    </view>
    <van-dialog
      style="overflow: hidden"
      use-slot
      title="素材海报"
      :show="qrcodeShow"
      @confirm="closeQrcode"
      :showConfirmButton="false"
    >
      <view style="overflow-y: auto">
        <image mode="widthFix" style="width: 100%" :src="savepicRoute" />
        <!-- style="visibility: hidden" -->
        <!-- class="tki-qrcode" -->
        <tki-qrcode
          style="visibility: hidden"
          class="tki-qrcode"
          :val="qrval"
          :size="qrsize"
          ref="qrcode"
          :onval="false"
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
      options: {
        codecfg_repairPartsOne: { codeId: 'repairPartsOne' } // 维修部位一级
      },
      active: 'a',
      btnValue: '1',
      tabClick: '',
      activityDefData: {},
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
      picShow: false,
      userId: ''
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
  },
  onShow() {
    let user = wx.getStorageSync('user');
    this.userId = user.user._id;
    common.osg.codeoption(() => {});
  },
  methods: {
    onChange(e) {
      if (e.detail.name == 'b') {
        this.getActivityDef();
      }
    },
    topBtnClick(e) {
      this.btnValue = e;
      console.log(this.btnValue, '--this.btnValue');
    },
    tabChange(e) {
      this.tabClick = e;
      // console.log(this.tabClick, '---this.tabClick');
      this.getActivityDef(e);
    },
    getActivityDef(e) {
      common.osg.ajax(
        'wmt/biz/activityDef/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:exts.activityDefType|string#and': '3',
          'is:exts.repairPartsOne|string#and': e || ''
        },
        res => {
          res.data.map(item => {
            item.tplImageFileid = JSON.parse(item.tplImageFileid);
          });
          this.activityDefData = res.data;
          console.log(this.activityDefData, 'this.activityDefData');
        }
      );
    },
    doBackground(e) {
      this.backgroundpic = e.tplImageFileid[0].url;
      // 坐标去除字符串
      this.qrx = JSON.parse(e.tplQrcodex);
      this.qry = JSON.parse(e.tplQrcodey);
      this.getBackgroundpicSize();
      this.showQrcode(e);
      console.log(this.backgroundpic, '----backgroundpic');
    },
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

      this.qrval = `${e.tplQrcode}&shareUserId=${this.userId}&activity=${e._id}&channelType=tg`;
      this.qrsize = e.tplQrcodeSize;
      this.qrcodeShow = true;
      this.$nextTick(() => {
        this.$refs.qrcode._makeCode();
      });
    },
    closeQrcode() {
      this.savepicRoute = '';
      this.getData();
      this.$refs.qrcode._clearCode();
      this.qrcodeShow = false;
    },
    // 获取二维码路径
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
.topBtn {
  background: #fff;
  display: flex;
  height: 30px;
  line-height: 30px;
  > view {
    margin-left: 25px;
    width: 70px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 4px;
    background: #f7f7f7;
    font-size: 12px;
    font-weight: 400;
  }
  .doBtnClick {
    margin-left: 25px;
    width: 70px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #106cff;
    background: #fff;
    font-size: 12px;
    font-weight: 400;
    color: #106cff;
  }
}
.btnValue1 {
  padding: 5px;
  > view {
    width: 100%;
    // margin: 5px;
    background: #fff;
    border-radius: 8px 8px 0px 0px;
  }
  .content {
    color: #000;
    font-size: 12px;
    font-weight: 400;
    padding: 9px 15px 15px 15px;
  }
}
.bottomBtn {
  text-align: center;
  > view:last-child {
    width: 159px;
    height: 27px;
    line-height: 27px;
    border-radius: 3px;
    background: #f3f3f3;
    color: #000;
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 10px;
    display: inline-block;
  }
  // ::v-deep .van-button {
  //   width: 159px;
  //   height: 27px;
  //   line-height: 27px;
  //   border-radius: 3px;
  //   background: #f3f3f3;
  //   color: #000;
  //   font-size: 12px;
  //   font-weight: 400;
  //   margin-bottom: 10px;
  // }
}
.tab {
  background: #fff;
  // display: flex;
  line-height: 24px;
  text-align: center;
  width: 100%;
  overflow-x: scroll;
  white-space: nowrap;
  // > view {
  //   display: inline-block;
  //   margin: 5px;
  //   height: 24px;
  //   width: 47px;
  //   border-radius: 4px;
  //   background: #f7f7f7;
  //   color: #000;
  //   font-size: 12px;
  //   font-weight: 400;
  // }
  .unDoTabClick {
    display: inline-block;
    margin: 5px;
    height: 24px;
    width: 47px;
    border-radius: 4px;
    background: #f7f7f7;
    color: #000;
    font-size: 12px;
    font-weight: 400;
  }
  .doTabClick {
    display: inline-block;
    margin: 5px;
    height: 24px;
    width: 47px;
    border-radius: 4px;
    color: #106cff;
    border: 1px solid #106cff;
    background: #fff;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
