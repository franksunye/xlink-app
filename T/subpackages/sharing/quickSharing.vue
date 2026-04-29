<template>
  <view class="quickSharing">
    <view class="c-flex-1">
      <poster
        v-if="qrcodeShow"
        id="poster"
        :config="posterConfig"
        @success="onPosterSuccess"
        @fail="onPosterFail"
      ></poster>
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
      <image
        v-if="savepicRoute"
        mode="heightFix"
        style="height: 100%; display: flex; max-width: 100vw"
        :src="savepicRoute"
      />
      <van-empty v-else description="海报正在生成中" />
    </view>
    <van-button
      round
      type="danger"
      color="#d60f16"
      :style="systemInfo.platform == 'ios' ? 'margin: 10px 0 20px' : 'margin: 10px 0'"
      @click="share"
    >
      保存/分享图片
    </van-button>
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
      activityData: {},
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
      activityDefId: '' //活动模板id
    };
  },
  onLoad(params) {
    let user = wx.getStorageSync('user');
    this.userId = user.user._id;
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    common.osg.codeoption(() => {});
    this.getActivity();
  },
  onShow() {},
  methods: {
    getActivity() {
      if (common.osg.host.indexOf('https://xlinkbeta.fsgo365.cn') != -1) {
        this.activityDefId = '6193843641629063147'; //测试活动ID
      } else {
        this.activityDefId = '7258555612346860978'; //正式活动ID
      }

      common.osg.ajax(
        'wmt/biz/activityDef/findById',
        {
          id: this.activityDefId
        },
        res => {
          res.data.tplImageFileid = JSON.parse(res.data.tplImageFileid);
          this.activityData = res.data;
          console.log(this.activityData, '--this.activityData');
          this.doBackground();
        }
      );
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
      this.backgroundpic = this.activityData.tplImageFileid[0].url;
      // 坐标去除字符串
      //   this.qrx = JSON.parse(this.activityData.tplQrcodex);
      //   this.qry = JSON.parse(this.activityData.tplQrcodey);
      this.qrx = this.activityData.tplQrcodex;
      this.qry = this.activityData.tplQrcodey;
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
      this.qrval = `${this.activityData.tplQrcode}&shareUserId=${this.userId}&activity=${this.activityData._id}&channelType=tg`;
      this.qrsize = this.activityData.tplQrcodeSize;
      console.log(this.qrval, '----this.qrval');
      console.log(this.qrsize, '----- this.qrsize');
      this.qrcodeShow = true;
      this.$nextTick(() => {
        this.$refs.qrcode._makeCode();
      });
    },
    closeQrcode() {
      this.savepicRoute = '';
      this.$refs.qrcode._clearCode();
      this.qrcodeShow = false;
      wx.navigateBack({
        delta: 1
      });
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
.quickSharing {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  ::v-deep .tki-qrcode {
    height: 0px;
  }
}
</style>
