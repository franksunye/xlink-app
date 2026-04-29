<template>
  <view @click.capture="track">
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
          <view
            class="c-card"
            v-for="(item, k) in list[j]"
            :key="k"
            :data-id="item._id"
            @click="
              doOpen('./addChannel', {
                channelId: item._id
              })
            "
            :data-event="{ id: 'iCGelVVZfF' }"
          >
            <view class="c-card-title" :data-event="{ id: 'iCGelVVZfF' }">
              <view class="c-flex" :data-event="{ id: 'iCGelVVZfF' }">
                <van-icon
                  size="20px"
                  custom-class="c-card-icon"
                  name="todo-list-o"
                  :data-event="{ id: 'iCGelVVZfF' }"
                ></van-icon>
                <text style="font-weight: bolder" :data-event="{ id: 'iCGelVVZfF' }">
                  渠道编号：{{ item._id }}
                </text>
              </view>
            </view>

            <view class="c-card-content" :data-event="{ id: 'iCGelVVZfF' }">
              <view :data-event="{ id: 'iCGelVVZfF' }">
                <text :data-event="{ id: 'iCGelVVZfF' }">渠道名称：{{ item.name || '' }}</text>
              </view>
              <view :data-event="{ id: 'iCGelVVZfF' }">
                <text :data-event="{ id: 'iCGelVVZfF' }">
                  渠道用户手机号：{{ item.phones ? item.phones.join('、') : '' }}
                </text>
              </view>
              <view :data-event="{ id: 'iCGelVVZfF' }">
                <text :data-event="{ id: 'iCGelVVZfF' }">访客数量：{{ item.count || '' }}</text>
              </view>
              <view :data-event="{ id: 'iCGelVVZfF' }">
                <text :data-event="{ id: 'iCGelVVZfF' }">渠道服务商：{{ item.orgName || '' }}</text>
              </view>
              <view :data-event="{ id: 'iCGelVVZfF' }">
                <text :data-event="{ id: 'iCGelVVZfF' }">
                  直达服务商：{{ item.serviceResourceName || '' }}
                </text>
              </view>
              <view :data-event="{ id: 'iCGelVVZfF' }">
                <text :data-event="{ id: 'iCGelVVZfF' }">
                  直达管家：{{ item.supervisorName || '' }}
                </text>
              </view>
              <view :data-event="{ id: 'iCGelVVZfF' }">
                <text :data-event="{ id: 'iCGelVVZfF' }">备注：{{ item.memo || '' }}</text>
              </view>
            </view>
            <view class="c-m-t-20 c-flex c-flex-end" :data-event="{ id: 'iCGelVVZfF' }">
              <van-button
                round
                style="color: #106cff; border-color: #106cff"
                size="small"
                @click.native.stop="doQrcode(item)"
                class="c-m-l-20"
                :data-event="{ id: 'A99pP_45oB' }"
              >
                查看二维码
              </van-button>
              <van-button
                round
                style="color: #106cff; border-color: #106cff"
                size="small"
                @click.native.stop="doChoosePic(item)"
                class="c-m-l-20"
                :data-event="{ id: 'XxMzFxLdJr' }"
              >
                查看渠道门店海报
              </van-button>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <!-- 合成海报 -->
            <poster
              v-if="qrcodeShow"
              id="poster"
              :config="posterConfig"
              @success="onPosterSuccess"
              @fail="onPosterFail"
            ></poster>
            <!-- 合成二维码 -->
            <poster
              v-if="tkiQrcodeShow"
              id="poster"
              :config="qrPosterConfig"
              @success="onQrPosterSuccess"
            ></poster>
            <!-- #endif -->
          </view>
        </view>
      </view>
    </view>
    <!-- 添加渠道 -->
    <view class="orgUser-add">
      <!-- <view>
        <van-icon name="add" class="c-green" />
        <text>添加组织</text>
      </view> -->
      <view @click="doOpen('./addChannel', {})" :data-event="{ id: 'iKfBQEkO9Q' }">
        <van-icon name="add" class="c-blue" :data-event="{ id: 'iKfBQEkO9Q' }" />
        <text :data-event="{ id: 'iKfBQEkO9Q' }">添加渠道</text>
      </view>
    </view>
    <!-- <van-dialog use-slot title="获客码" :show="qrcodeShow" @confirm="closeQrcode" :data-event="{id:'HZDk0ObkIc',capture:false}">
      <tki-qrcode
        :val="qrval"
        size="300"
        ref="qrcode"
        :onval="false"
        @result="doQrcodeRoute"
      ></tki-qrcode>
      <view style="display: flex; justify-content: space-around; padding-bottom: 10px">
        <van-button round size="small" @click="share" :data-event="{id:'vYXoXsm5XO'}">保存/分享图片</van-button>
      </view>
    </van-dialog> -->
    <!-- 海报 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-dialog
      use-slot
      title="渠道海报"
      :show="qrcodeShow"
      @confirm="closePosterQrcode"
      :data-event="{ id: 'cWlHoMoprE', capture: false }"
    >
      <image mode="widthFix" style="width: 100%" :src="savepicRoute" />
      <tki-qrcode
        v-if="qrcodeShow"
        class="tki-qrcode"
        style="visibility: hidden"
        :val="qrval"
        :iconSize="qrsize"
        :size="600"
        ref="qrcode"
        :onval="true"
        @result="doPosterQrcodeRoute"
        :lv="1"
      ></tki-qrcode>
      <view style="display: flex; justify-content: space-around; padding-bottom: 10px">
        <van-button round size="small" @click="share" :data-event="{ id: 'yXEXki_gNY' }">
          保存/分享图片
        </van-button>
      </view>
    </van-dialog>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <van-dialog
      use-slot
      title="渠道海报"
      :show="qrcodeShow"
      confirmButtonText="保存海报"
      confirmButtonColor="#106cff"
      showCancelButton
      cancelButtonText="关闭"
      @confirm="
        painterSave('painter');
        qrcodeShow = false;
      "
      @cancel="qrcodeShow = false"
      custom-style="top: unset !important; bottom: 10px; transform: translate3d(-50%, 0, 0);"
      :data-event="{ id: 'n7QJAk7yHt', capture: false }"
    >
      <l-painter ref="painter" style="position: relative">
        <l-painter-image :src="backgroundpic" css="width: 100%; object-fit: contain;" />
        <l-painter-qrcode
          :text="`https://xlink.fsgo365.cn/qrcode/tg/?partnerId=${partnerId}&channelId=${channelId}`"
          :css="`width: ${qrsize}px; height: ${qrsize}px;position:absolute; left:${qrx}px;top:${qry}px;background-color: #fff;`"
        />
        <l-painter-view
          :css="`position:absolute; left:${qrx}px;top:${
            qry + qrsize + 3
          }px;width:${qrsize}px;text-align:center;line-height:10px;`"
        >
          <l-painter-text :text="picName" css="font-size:10px;" />
        </l-painter-view>
      </l-painter>
    </van-dialog>
    <!-- #endif -->

    <!-- 二维码弹框 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-dialog
      use-slot
      title="渠道二维码"
      :show="tkiQrcodeShow"
      @confirm="closePosterQrcode"
      :data-event="{ id: 'mGJyMmg78Z', capture: false }"
    >
      <image mode="widthFix" style="width: 100%" :src="savepicRoute" />
      <tki-qrcode
        v-if="tkiQrcodeShow"
        class="tki-qrcode"
        style="visibility: hidden"
        :val="qrval"
        size="500"
        ref="qrcode"
        :onval="true"
        @result="doQrPosterQrcodeRoute"
        :lv="1"
      ></tki-qrcode>
      <view style="display: flex; justify-content: space-around; padding-bottom: 10px">
        <van-button round size="small" @click="share" :data-event="{ id: 'uiXn2qngV2' }">
          保存/分享图片
        </van-button>
      </view>
    </van-dialog>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <van-dialog
      use-slot
      title="渠道二维码"
      :show="tkiQrcodeShow"
      confirmButtonText="保存二维码"
      confirmButtonColor="#106cff"
      showCancelButton
      cancelButtonText="关闭"
      @confirm="
        painterSave('painter-qrcode');
        tkiQrcodeShow = false;
      "
      @cancel="tkiQrcodeShow = false"
      :data-event="{ id: '5RHgiGdQd6', capture: false }"
    >
      <l-painter ref="painter-qrcode">
        <l-painter-qrcode
          :text="`https://xlink.fsgo365.cn/qrcode/tg/?partnerId=${partnerId}&channelId=${channelId}`"
          css="width:320px; height:320px;"
        />
        <l-painter-view css="text-align:center;">
          <l-painter-text :text="picName" css="font-size:20px;" />
        </l-painter-view>
      </l-painter>
    </van-dialog>
    <!-- #endif -->

    <van-dialog
      use-slot
      title="选择海报"
      :show="choosePicShow"
      show-cancel-button
      confirm-button-color="#106cff"
      @confirm="confirmChoosePic"
      @close="closeChoosePic"
      custom-style="top: unset !important; bottom: 10px; transform: translate3d(-50%, 0, 0);"
      :data-event="{ id: 'zKWviZ11bP', capture: false }"
    >
      <view style="text-align: center">
        <image mode="widthFix" style="width: 260px" :src="backgroundpic"></image>
      </view>
      <view style="display: flex; justify-content: space-around">
        <view
          :class="chooseImgIndex === index ? 'chooseImg' : ''"
          v-for="(item, index) in activityDefData"
          :key="index"
        >
          <image
            mode="widthFix"
            style="width: 60px; height: 100px"
            :src="item.tplImageFileid[0].url"
            @click="getImg(item, index)"
            :data-event="{ id: 'bDqxnHWt0f' }"
          ></image>
        </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
import tkiQrcode from '@/wxcomponents/tki-qrcode/tki-qrcode.vue';
// #ifdef MP-WEIXIN
import Poster from '../../wxcomponents/miniprogram_dist/poster';
import Poster2 from '../../wxcomponents/miniprogram_dist/poster/poster';
// #endif
export default {
  components: {
    tkiQrcode,
    // #ifdef MP-WEIXIN
    Poster
    // #endif
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
        codecfg_stage: {
          codeId: 'STAGE'
        },
        cascadeCode_channel: {
          codeId: 'channel'
        }
      },
      // 省市区
      areaList: Object.assign({}, areajs.default),
      user: {},
      // qrcodeShow: false, //是否展示二维码弹窗
      qrcodeShow: false,
      tkiQrcodeShow: false,
      qrval: 'https://xlink.fsgo365.cn', //二维码地址
      qrcodeRoute: '', //二维码图片路径
      activityDefData: [], //海报模板数据
      userPartnerId: '', //当前登录人的partnerId
      partnerId: '',
      channelId: '',
      qrsize: '', //二维码大小
      backgroundpic: '', //背景图片地址
      qrx: '', //二维码x轴
      qry: '', //二维码y轴
      //获取背景图片的宽高
      backgroundpicWidth: '',
      backgroundpicHeight: '',
      posterConfig: {}, //画布数据
      qrPosterConfig: {}, //二维码画布数据
      // savepic: '', //海报路径
      savepicRoute: '', //保存相册
      chooseImgIndex: '', // 选中的背景图的index
      choosePicShow: false, //选择海报弹框
      partnerData: {},
      filterate: false, //是否过滤雨虹海报模板
      picName: '', //图片名称
      chooseBtnL: ''
    };
  },
  methods: {
    onLoad: function (option) {},
    doInit(param) {
      let _currentUser = wx.getStorageSync('user');
      this.userPartnerId = _currentUser.partnerIds[0];
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
        'regex:memo|string#or': this.searchValue,
        'regex:orgName|string#or': this.searchValue,
        'regex:serviceResourceName|string#or': this.searchValue,
        'regex:supervisorName|string#or': this.searchValue,
        'in:phones|array#or': this.searchValue,
        'is:serviceOrgId|string#and': this.user.orgId || '',
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1
      };
      common.osg.ajax('channel/query.do', params, res => {
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
    // 获取门店
    getPartner() {
      common.osg.ajax('basic/partner/queryById/' + this.userPartnerId, {}, res => {
        this.partnerData = res;
        this.getActivityDef();
      });
    },
    // 获取海报模板
    getActivityDef() {
      if (
        this.partnerData.exts &&
        (this.partnerData.exts.yuhong == '1' || this.partnerData.exts.yuhong == '2')
      ) {
        this.filterate = true;
      }
      console.log(this.filterate, '---this.filterate');
      var params = {
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1
      };
      common.osg.ajax('biz/activityDef/query', params, res => {
        res.data.map(item => {
          item.tplImageFileid = JSON.parse(item.tplImageFileid);
        });
        if (!this.filterate) {
          this.activityDefData = res.data.filter(
            item => item.exts.isYuhong !== '1' && item.exts.isYuhong !== '2'
          );
        } else {
          this.activityDefData = res.data;
        }
        console.log(this.activityDefData, '--this.activityDefData');
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
    // onPageScroll(e) {
    //   if (this.reachBottom) return;

    //   // 窗口高度
    //   this.windowHeight = this.windowHeight
    //     ? this.windowHeight
    //     : wx.getSystemInfoSync().windowHeight;

    //   // 循环每页高度
    //   for (let i = 0; i < this.boundings.length; i++) {
    //     // 如果没有在屏幕中，并且视野的高度小于我的结尾位置距离顶部的距离，也就是说，这个dom是我正在查看的dom
    //     if (
    //       this.boundings[i].top < e.scrollTop + this.windowHeight &&
    //       e.scrollTop + this.windowHeight <= this.boundings[i].bottom
    //     ) {
    //       this.index = i;
    //       break;
    //     }
    //   }
    // },

    // 保存图片  this.$refs.qrcode._saveCode();
    downloadImg() {
      this.$refs.qrcode._saveCode();
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
    // 生成二维码画布
    doQrcode(e) {
      this.chooseBtn = 'qr';
      this.picName = e.name;
      this.partnerId = e.partnerId;
      this.channelId = e._id;
      this.tkiQrcodeShow = true;
      this.$forceUpdate();
      // #ifdef MP-WEIXIN
      this.$nextTick(() => {
        this.showQrcode(e);
      });
      // #endif
    },
    // 展示二维码
    showQrcode(e) {
      // this.partnerId = e.partnerId;
      // this.channelId = e._id;
      /**
       * 注意qrval的域名测试时替换     https://xlinkbate.fsgo365.cn
       */
      //
      this.qrval = `https://xlink.fsgo365.cn/qrcode/tg/?partnerId=${this.partnerId}&channelId=${this.channelId}`;
      if (this.chooseBtn == 'qr') {
        this.tkiQrcodeShow = true;
      }
      if (this.chooseBtn == 'hb') {
        this.qrcodeShow = true;
      }
      this.$nextTick(() => {
        this.$refs.qrcode._makeCode();
      });
    },
    closePosterQrcode() {
      this.savepicRoute = '';
      // this.posterConfig = '';
      // this.qrPosterConfig = '';
      // this.qrcodeRoute = '';
      this.getData();
      this.$refs.qrcode._clearCode();
      if (this.chooseBtn == 'qr') {
        this.tkiQrcodeShow = false;
      }
      if (this.chooseBtn == 'hb') {
        this.qrcodeShow = false;
      }
    },
    // 获取二维码路径
    doPosterQrcodeRoute(e) {
      this.filePic(e, res => {
        this.qrcodeRoute = res.url;
        console.log(this.qrcodeRoute, '---hb二维码地址');

        this.onCreatePoster();
      });
    },
    doQrPosterQrcodeRoute(e) {
      this.filePic(e, res => {
        this.qrcodeRoute = res.url;
        this.onCreateQrPoster();
      });
    },
    doChoosePic(e) {
      this.chooseBtn = 'hb';
      this.partnerId = e.partnerId;
      this.channelId = e._id;
      this.picName = e.name;
      this.chooseImgIndex = '';
      this.choosePicShow = true;
    },
    closeChoosePic() {
      this.choosePicShow = false;
    },
    confirmChoosePic() {
      if (!this.chooseImgIndex && this.chooseImgIndex !== 0) {
        common.osg.toast('请选择海报模板', 'none');
        return;
      }
      this.choosePicShow = false;
      this.doBackground();
    },
    getImg(e, i) {
      this.backgroundpic = e.tplImageFileid[0].url;
      this.qrsize = e.tplQrcodeSize;
      this.qrx = e.tplQrcodex;
      this.qry = e.tplQrcodey;
      this.chooseImgIndex = i;
      this.getBackgroundpicSize();
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
    doBackground(e) {
      this.getBackgroundpicSize();
      // #ifdef MP-WEIXIN
      this.$nextTick(() => {
        this.showQrcode(e);
      });
      // #endif
    },
    // 获取背景图片的大小
    getBackgroundpicSize() {
      let that = this;
      // 👇 显示加载中
      wx.showLoading({
        title: '加载中...',
        mask: true // 可选，防止用户操作
      });
      wx.getImageInfo({
        src: this.backgroundpic,
        success(res) {
          // that.backgroundpicWidth = res.width;
          // that.backgroundpicHeight = res.height;
          // console.log('that.backgroundpicWidth', that.backgroundpicWidth);
          // console.log('that.backgroundpicHeight', that.backgroundpicHeight);
          const originalWidth = res.width;
          const originalHeight = res.height;
          // 目标宽度
          const targetWidth = 320;
          // 缩放比例
          const scale = targetWidth / originalWidth;
          // 等比缩放后的高度
          that.backgroundpicHeight = Math.floor(originalHeight * scale);
          // 保存缩放后的宽
          that.backgroundpicWidth = targetWidth;

          // #ifdef APP-PLUS
          // 背景实际宽度 / 背景显示宽度 = 二维码实际宽度 / 二维码显示宽度；计算二维码显示宽度 = 背景显示宽度 * 二维码实际宽度 / 背景实际宽度
          // that.qrsize = (320 * that.qrsize) / that.backgroundpicWidth;
          // that.qrx = (320 * that.qrx) / that.backgroundpicWidth;
          // that.qry = (320 * that.qry) / that.backgroundpicWidth;
          that.qrcodeShow = true;
          // #endif

          that.$forceUpdate();
          wx.hideLoading();
        },
        fail(err) {
          wx.hideLoading(); // 关闭加载提示
          wx.showModal({
            title: '错误',
            content: '图片加载失败，请检查图片路径或网络状态',
            showCancel: false
          });
        }
      });
    },
    //二维码画布数据
    onCreateQrPoster() {
      // setData配置数据
      this.qrPosterConfig = {
        width: 500,
        height: 550,
        backgroundColor: '#ffffff',
        debug: false,
        pixelRatio: 1,
        // pixelRatio: 100,
        texts: [
          {
            x: 250,
            y: 526,
            text: this.picName,
            fontSize: 30,
            fontWeight: '400',
            color: '#333',
            textAlign: 'center'
          }
        ],
        images: [
          // 海报背景图
          // {
          //   width: this.backgroundpicWidth,
          //   height: this.backgroundpicHeight,
          //   x: 0,
          //   y: 0,
          //   url: this.backgroundpic
          //   // zIndex: 1
          // },
          // 海报二维码
          {
            width: 500,
            height: 500,
            x: 0,
            y: 0,
            url: this.qrcodeRoute,
            zIndex: 1
          }
        ]
      };
      this.$nextTick(() => {
        Poster2.create();
        this.$forceUpdate();
      });
    },
    // APP-PLUS 保存海报图片
    painterSave(painter) {
      this.$refs[painter].canvasToTempFilePathSync({
        fileType: 'jpg',
        pathType: 'url',
        quality: 1,
        success: res => {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              common.osg.toast('已保存到相册', 'none');
            }
          });
        }
      });
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
        pixelRatio: wx.getSystemInfoSync().pixelRatio,

        texts: [
          {
            x: this.qrx + this.qrsize / 2, //加上二维码的宽度 剧中
            y: this.qry - 6, //减去自身的高度
            text: this.picName,
            fontSize: 6,
            fontWeight: '400',
            color: '#fff',
            textAlign: 'center'
          }
        ],
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
        Poster2.create().then(() => {
          wx.hideLoading(); // 关闭加载提示
          setTimeout(() => {
            wx.showLoading({
              title: '海报生成中...',
              mask: true // 可选，防止用户操作
            });
          }, 20);
        });
      });

      console.log(this.posterConfig, 'canvas数据', this.qrcodeRoute);
    },
    onPosterSuccess(e) {
      // const { detail } = e;
      // wx.previewImage({
      //   current: detail,
      //   urls: [detail]
      // });
      this.savepicRoute = e;
      wx.hideLoading(); // 关闭加载提示
      // this.filePic(e, res => {
      //   this.savepic = res.url;
      //   console.log(this.savepic, '---this.savepic');
      // });
    },
    onPosterFail() {
      wx.hideLoading(); // 关闭加载提示
      common.osg.toast('海报生成失败,请稍后重试', 'none');
    },
    onQrPosterSuccess(e) {
      this.savepicRoute = e;
      console.log(this.savepicRoute, '---this.savepicRoute');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (option) {
      this.doInit();
      common.osg.codeoption(() => {
        this.getData();
        this.getPartner();
      });
      // this.user = wx.getStorageSync('user');
    }
  }
};
</script>
<style lang="scss">
// .tki-qrcode {
//   text-align: center;
//   padding: 20rpx;
// }
.chooseImg {
  border: 3px solid #ff9800;
  border-radius: 5px;
}
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
  color: #106cff !important;
  border-color: #106cff !important;
}
.c-card-content {
  > view {
    margin: 5px;
  }
}
</style>
