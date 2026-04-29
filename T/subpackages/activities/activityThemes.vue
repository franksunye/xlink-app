<template>
  <view>
    <!-- 过滤 -->
    <view class="c-header" style="z-index: 2">
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        use-action-slot
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20"
      ></van-search>
    </view>

    <!-- 新列表 -->
    <view class="c-content">
      <view>
        <view
          :id="'listitem-' + func._id + '-' + j"
          v-for="(listitem, j) in boundings"
          :key="j"
          :style="{
            height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
            margin: '20rpx 0'
          }"
        >
          <view class="c-card" v-for="(item, k) in list[j]" :key="k" :data-id="item._id">
            <view
              @click="
                doOpen('./activityThemeDetail', {
                  activityThemeId: item._id
                })
              "
              class="c-card-title"
              style="border-bottom: 0px solid #d4d4d4"
            >
              <view class="c-flex">
                <text style="font-size: 13px">{{ item.name }}</text>
              </view>
              <view style="margin-left: 20px">
                <van-tag color="#1989fa" size="medium">
                  {{ codelabel('state', item.state) || '' }}
                </van-tag>
              </view>
            </view>
            <view style="display: flex">
              <view>
                <van-uploader
                  :deletable="false"
                  accept="image"
                  :file-list="item.tplImageFileid"
                  :max-count="1"
                  data-field="tplImageFileid"
                />
              </view>
              <view class="c-card-content">
                <!-- <view
                  @click="
                    doOpen('./activityThemeDetail', {
                      activityThemeId: item._id
                    })
                  "
                >
                  <view>
                    <text style="font-weight: bolder; font-size: 14px">{{ item.name }}</text>
                  </view>
                  <view style="margin-left: 20px">
                    <van-tag color="#1989fa" size="medium">
                      {{ codelabel('state', item.state) || '' }}
                    </van-tag>
                  </view>
                </view> -->
                <view
                  @click="
                    doOpen('./activityThemeDetail', {
                      activityThemeId: item._id
                    })
                  "
                >
                  <view>
                    <text>开始时间：{{ item.startDate }}</text>
                  </view>
                  <view>
                    <text>结束时间：{{ item.endDate }}</text>
                  </view>
                </view>
                <!-- <view>
                  <text>二维码分享：</text>
                </view> -->
                <view class="c-m-t-20" style="float: right">
                  <image
                    style="width: 30px"
                    src="/static/images/storeMenu-qr.png"
                    mode="widthFix"
                    @click.native.stop="doBackground(item)"
                  ></image>
                </view>
              </view>
            </view>
            <!-- <view class="c-card-content">
              <text>{{ item.startDate }}~{{ item.endDate }}</text>
            </view> -->
            <poster
              id="poster"
              :config="posterConfig"
              @success="onPosterSuccess"
              @fail="onPosterFail"
            ></poster>
          </view>
        </view>
      </view>
    </view>
    <van-dialog use-slot title="活动海报" :show="qrcodeShow" @confirm="closeQrcode">
      <image mode="widthFix" style="width: 100%" :src="savepicRoute" />
      <tki-qrcode
        class="tki-qrcode"
        style="visibility: hidden"
        :val="qrval"
        :size="qrsize"
        ref="qrcode"
        :onval="false"
        @result="doQrcodeRoute"
        :lv="1"
      ></tki-qrcode>
      <view style="display: flex; justify-content: space-around; padding-bottom: 10px">
        <van-button round size="small" @click="share">保存/分享图片</van-button>
      </view>
    </van-dialog>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
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
      phone: '',
      windowHeight: '',
      reachBottom: false, //是否触底 正在刷新
      boundings: [], //外层列表每页数据的边界值
      index: 0, //当前页码
      list: [], //全部已获取数据
      fpi: {
        data: [],
        page: 1,
        rows: 10
      },
      searchValue: '',
      func: {
        count: 0
      },
      formData: {},
      options: {
        codecfg_state: {
          codeId: 'enable'
        },
        cascadeCode_channel: {
          codeId: 'channel'
        }
      },
      // 省市区
      areaList: Object.assign({}, areajs.default),
      user: {},
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
  methods: {
    onLoad: function (option) {
      let user = wx.getStorageSync('user');
      this.userId = user.user._id;
    },
    doInit(param) {
      common.osg.init(this, param, app);
    },
    onSearch: function (e) {
      this.searchValue = e.detail;
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.getData();
    },

    getData() {
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }
      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        'regex:name|string#or': this.searchValue,
        'in:phones|array#or': this.searchValue,
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1
      };
      common.osg.ajax('wmt/biz/activityDef/query ', params, res => {
        res.data.map(item => {
          item.tplImageFileid = JSON.parse(item.tplImageFileid);
        });
        this.fpi.pages = res.pages;

        if (res.data.length == 0) {
          wx.stopPullDownRefresh();
          if (this.fpi.page > 1) {
            this.fpi.page--;
            this.index--;
          }
          this.$forceUpdate();
          this.reachBottom = false;
          common.osg.toast('没有更多数据', 'none', 5000);
          return;
        }
        let index = this.fpi.page - 1;
        // this.list = res.data;
        this.list.push(res.data);
        console.log(this.list, '----this.list');
        this.boundings.push({});

        this.$nextTick(() => {
          setTimeout(() => {
            //计算并记录外层列表数据的边界值
            this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
            wx.createSelectorQuery()
              .select(`#listitem-${this.func._id}-${index}`)
              .boundingClientRect(rect => {
                if (rect) {
                  that.boundings[index] = {
                    height: rect.height,
                    top:
                      index == 0
                        ? rect.top
                        : that.boundings[index - 1].top + that.boundings[index - 1].height,
                    bottom:
                      index == 0 ? rect.bottom : that.boundings[index - 1].bottom + rect.height
                  };
                }
              })
              .exec();
            wx.stopPullDownRefresh();
            this.reachBottom = false;
          }, 300);
        });
      });
    },
    doOpen(path, params) {
      common.osg.open(path, params);
    },

    //反显字典表
    codelabel: function (codeType, codeValue) {
      var opts = this.options[codeType];
      if (opts) {
        for (var i = 0; i < opts.length; i++) {
          if (codeValue == opts[i].value) return opts[i].name;
        }
      }
      if (!codeValue) {
        return codeValue;
      } else {
        return '未知';
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
    // codelabel(type, option, val) {
    //   if (!val) return;
    //   if (type == 'select') {
    //     return common.osg.codelabel(option, val);
    //   } else if (type == 'cascade') {
    //     return common.osg.formatCascade(option, val);
    //   }
    // },

    onPullDownRefresh: function () {
      this.fpi.page = 1;
      this.getData();
    },
    onReachBottom() {
      if (!this.reachBottom) {
        this.reachBottom = true;
        this.fpi.page++;
        this.getData();
      }
    },
    //滚动监听
    onPageScroll(e) {
      if (this.reachBottom) return;

      // 窗口高度
      this.windowHeight = this.windowHeight
        ? this.windowHeight
        : wx.getSystemInfoSync().windowHeight;

      // 循环每页高度
      for (let i = 0; i < this.boundings.length; i++) {
        // 如果没有在屏幕中，并且视野的高度小于我的结尾位置距离顶部的距离，也就是说，这个dom是我正在查看的dom
        if (
          this.boundings[i].top < e.scrollTop + this.windowHeight &&
          e.scrollTop + this.windowHeight <= this.boundings[i].bottom
        ) {
          this.index = i;
          break;
        }
      }
    },

    // 画布
    onCreatePoster() {
      console.log(this.backgroundpicWidth, this.backgroundpicHeight, '--图片的宽高');
      console.log(this.qrcodeRoute, '画布查询qr');
      // setData配置数据
      this.posterConfig = {
        width: this.backgroundpicWidth,
        height: this.backgroundpicHeight,
        backgroundColor: '#ffffff',
        debug: false,
        pixelRatio: 1,
        // pixelRatio: 100,
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
    doBackground(e) {
      this.backgroundpic = e.tplImageFileid[0].url;
      this.qrx = e.tplQrcodex;
      this.qry = e.tplQrcodey;
      this.getBackgroundpicSize();
      this.$nextTick(() => {
        this.showQrcode(e);
      });
      // this.showQrcode(e);
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
    // 展示二维码
    showQrcode(e) {
      /**
       * 注意qrval的域名测试时替换     https://xlinkbate.fsgo365.cn
       */
      //
      this.qrval = `${e.tplQrcode}&shareUserId=${this.userId}&channelType=tg`;
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
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (option) {
      this.doInit();
      common.osg.codeoption(() => {
        this.getData();
      });
      this.user = wx.getStorageSync('user');
    }
  }
};
</script>
<style lang="scss">
.tki-qrcode {
  text-align: center;
  padding: 0rpx;
  height: 0;
}
.c-content {
  margin-top: 54px;
  padding-bottom: 50px;
}

.sr-popup .van-cell__title,
.van-cell__value {
  -webkit-flex: auto;
  flex: auto;
  max-width: none !important;
}

.tabclass {
  font-size: 18px !important;
  min-width: 20vw !important;
  margin-top: 10rpx;
}

.text-content view {
  line-height: 35px;
  border-bottom: 1px solid #ebedf0;
}
.orgUser-add {
  position: fixed;
  bottom: 0;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fff;
  height: 60px;
  box-sizing: border-box;
  border-top: 1px solid #f7f8fa;
  > view {
    text {
      margin-left: 10px;
    }
  }
}
.van-button {
  color: #1989fa !important;
  border-color: #1989fa !important;
}
.c-card-content {
  > view {
    margin: 5px;
  }
}
</style>
