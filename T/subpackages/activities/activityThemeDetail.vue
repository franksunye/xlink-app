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
        <!-- <view
            :id="'listitem-' + func._id + '-' + j"
            v-for="(listitem, j) in boundings"
            :key="j"
            :style="{
              height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
              margin: '20rpx 0'
            }"
          > -->
        <view class="c-card">
          <view style="margin: 5px 0">
            <!-- <view class="c-flex"> -->
            <!-- <van-uploader
                :deletable="false"
                accept="image"
                :file-list="activityDefData.tplImageFileid"
                :max-count="1"
                data-field="tplImageFileid"
              /> -->
            <!-- <view style="display: flex"> -->
            <view>
              <text style="font-weight: bolder; font-size: 14px">
                {{ activityDefData.name }}
              </text>
            </view>
            <view style="margin-left: 20px; float: right">
              <van-tag color="#1989fa" size="medium">
                {{ codelabel('state', activityDefData.state) || '' }}
              </van-tag>
            </view>
            <!-- </view> -->

            <!-- <view class="c-m-t-20" style="float: right; margin-top: 30px">
                    <image
                      style="width: 30px"
                      src="/static/images/storeMenu-qr.png"
                      mode="widthFix"
                    ></image>
                  </view> -->
            <!-- </view> -->
          </view>
          <view class="c-card-content" style="margin: 5px 0">
            <text>开始时间：{{ activityDefData.startDate }}</text>
          </view>
          <view class="c-card-content" style="margin: 5px 0">
            <text>结束时间：{{ activityDefData.endDate }}</text>
          </view>
          <!-- <view class="c-card-content" style="margin: 5px 0">
            <text>{{ activityDefData.startDate }}~{{ activityDefData.endDate }}</text>
          </view> -->
          <view v-for="(item, index) in activityDefData.exts.desc" :key="index">
            <image style="width: 100%" :src="item.url" mode="widthFix" />
          </view>
        </view>
        <!-- </view> -->
      </view>
    </view>
    <view class="orgUser-add">
      <!-- <view>
          <van-icon name="add" class="c-green" />
          <text>添加组织</text>
        </view> -->
      <view @click="doOpen()">
        <van-icon name="add" class="c-blue" />
        <text>创建活动</text>
      </view>
    </view>

    <van-dialog use-slot title="获客码" :show="qrcodeShow" @confirm="closeQrcode">
      <tki-qrcode
        :val="qrval"
        size="300"
        ref="qrcode"
        :onval="true"
        @result="doQrcodeRoute"
      ></tki-qrcode>
      <view style="display: flex; justify-content: space-around; padding-bottom: 10px">
        <!-- <van-button round size="small" @click="downloadImg">保存图片</van-button> -->
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
export default {
  components: {
    tkiQrcode
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
      qrval: 'https://xlink.fsgo365.cn', //二维码地址
      qrcodeRoute: '', //二维码图片路径
      activityDefData: {}
    };
  },
  methods: {
    onLoad: function (param) {
      this.activityThemeId = param.activityThemeId;
      console.log(this.activityThemeId, '---this.activityThemeId');
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
      common.osg.ajax(
        'wmt/biz/activityDef/findById',
        {
          id: this.activityThemeId
        },
        res => {
          res.data.tplImageFileid = JSON.parse(res.data.tplImageFileid);
          this.activityDefData = res.data;
          console.log(this.formData, '--this.formData');
        }
      );
    },
    doOpen(path, params) {
      common.osg.open('./activityTheme', {
        activityThemeId: this.activityThemeId
      });
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
    // 展示二维码
    showQrcode(e) {
      let partnerId = e.partnerId;
      let channelId = e._id;
      /**
       * 注意qrval的域名测试时替换     https://xlinkbate.fsgo365.cn
       */
      //
      this.qrval = `https://xlink.fsgo365.cn/qrcode/tg/?partnerId=${partnerId}&channelId=${channelId}`;
      this.qrcodeShow = true;
      this.$nextTick(() => {
        this.$refs.qrcode._makeCode();
      });
    },
    closeQrcode() {
      this.getData();
      this.$refs.qrcode._clearCode();
      this.qrcodeShow = false;
    },
    // 获取二维码路径
    doQrcodeRoute(e) {
      this.qrcodeRoute = e;
    },
    // 保存图片  this.$refs.qrcode._saveCode();
    downloadImg() {
      this.$refs.qrcode._saveCode();
    },
    //分享给朋友
    share() {
      wx.showShareImageMenu({
        path: this.qrcodeRoute,
        success: res => {
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
    }
  }
};
</script>
<style lang="scss">
.tki-qrcode {
  text-align: center;
  padding: 20rpx;
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
