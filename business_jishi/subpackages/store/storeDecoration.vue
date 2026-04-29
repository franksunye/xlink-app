<template>
  <view class="storeDecoration" @click.capture="track">
    <!-- 通知 -->
    <view class="header" @click="doSwiper()" :data-event="{ id: '2HvHYy_SHw' }">
      <!-- banner -->
      <swiper :autoplay="true" :circular="true" :style="'height:' + bannerHeight">
        <swiper-item v-for="(item, i) in bannerList" :key="i" :data-event="{ id: '2HvHYy_SHw' }">
          <image
            :src="item.url"
            mode="widthFix"
            @load="getHeight"
            :data-event="{ id: '2HvHYy_SHw' }"
          ></image>
        </swiper-item>
      </swiper>
      <!-- 名称 简介 地址 -->
    </view>

    <!-- 收费标准 -->

    <van-tabs
      :active="activeName"
      @click="tabClick"
      :data-event="{ id: 'GcLq2xSbi9', capture: false }"
    >
      <block v-if="isDataReadyToShow">
        <van-tab title="服务介绍" name="1">
          <view :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <view class="c-flex" :data-event="{ id: 'GcLq2xSbi9' }">
                <van-field
                  label="店铺名称"
                  :value="storeData.exts.title"
                  placeholder="请输入"
                  input-align="right"
                  :border="false"
                  @change="titleChange"
                  class="c-flex-1"
                />
              </view>
            </view>
          </view>
          <view :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <van-field
                label="简介"
                :value="storeData.description"
                placeholder="请输入"
                input-align="right"
                :border="false"
                type="textarea"
                autosize
                @change="descriptionChange"
              />
            </view>
          </view>
          <view :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <view class="c-flex" :data-event="{ id: 'GcLq2xSbi9' }">
                <van-field
                  label="联系电话"
                  :value="storeData.phone"
                  placeholder="请输入"
                  input-align="right"
                  :border="false"
                  @change="phoneChange"
                  class="c-flex-1"
                />
              </view>
            </view>
          </view>
          <view :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <!-- #ifdef MP-WEIXIN -->
              <van-cell
                title="省市区"
                is-link
                :value="
                  area.areaList.province_list[storeData.province] +
                  area.areaList.city_list[storeData.city] +
                  area.areaList.county_list[storeData.district]
                "
                @click="area.show = true"
                input-align="right"
              />
              <!-- #endif -->
              <!-- #ifdef APP-PLUS -->
              <van-cell title="省市区" :border="false">
                <uni-data-picker
                  key="uniAreaPickerarea"
                  ref="uniAreaPickerarea"
                  :value="storeData.area"
                  placeholder="请选择"
                  popup-title="请选择"
                  :localdata="area.areaList"
                  :map="{
                    text: 'label',
                    value: 'value'
                  }"
                  data-name="area"
                  @change="areaConfirm"
                  :clear-icon="false"
                ></uni-data-picker>
              </van-cell>
              <!-- #endif -->
            </view>
          </view>
          <view :data-event="{ id: 'GcLq2xSbi9' }">
            <!-- @change="addressChange" -->
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <view class="c-flex" :data-event="{ id: 'GcLq2xSbi9' }">
                <van-field
                  label="详细地址"
                  :value="storeData.address"
                  placeholder="请输入"
                  input-align="right"
                  :border="false"
                  @blur="addressChange"
                  class="c-flex-1"
                />
              </view>
            </view>
          </view>
          <view :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <van-field
                label="服务介绍"
                :value="storeData.exts.introduction"
                placeholder="请输入"
                input-align="right"
                :border="false"
                type="textarea"
                autosize
                @change="introductionChange"
              />
            </view>
          </view>
          <view :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <view class="c-flex" :data-event="{ id: 'GcLq2xSbi9' }">
                <view class="c-flex" style="padding: 10px 16px" :data-event="{ id: 'GcLq2xSbi9' }">
                  <text style="color: #c2c0c0" :data-event="{ id: 'GcLq2xSbi9' }">
                    服务介绍图片（长图）
                  </text>
                  <van-uploader
                    style="display: flex; padding-left: 100px"
                    multiple
                    max-count="1"
                    :file-list="formData['introductionImg']"
                    data-field="introductionImg"
                    upload-text="上传"
                    @after-read="afterRead"
                    @delete="deleteFile"
                  />
                </view>
              </view>
            </view>
          </view>
          <view :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <view class="c-flex" :data-event="{ id: 'GcLq2xSbi9' }">
                <van-field
                  label="管家数量"
                  :value="storeData.exts.housekeeperNumber"
                  placeholder="请输入"
                  input-align="right"
                  :border="false"
                  @change="housekeeperNumberChange"
                  class="c-flex-1"
                />
              </view>
            </view>
          </view>
          <view style="padding-bottom: 100rpx" :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <view class="c-flex" :data-event="{ id: 'GcLq2xSbi9' }">
                <van-field
                  label="工人数量"
                  :value="storeData.exts.workerNumber"
                  placeholder="请输入"
                  input-align="right"
                  :border="false"
                  @change="workerNumberChange"
                  class="c-flex-1"
                />
              </view>
            </view>
          </view>
        </van-tab>
        <van-tab title="经营信息" name="2">
          <view :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <view class="c-flex" style="padding: 10px 16px" :data-event="{ id: 'GcLq2xSbi9' }">
                <text style="color: #c2c0c0" :data-event="{ id: 'GcLq2xSbi9' }">营业执照</text>
                <van-uploader
                  style="display: flex; flex: 1; justify-content: flex-end"
                  multiple
                  max-count="1"
                  :file-list="formData['businessLicense']"
                  data-field="businessLicense"
                  upload-text="上传"
                  @after-read="afterRead"
                  @delete="deleteFile"
                />
              </view>
            </view>
          </view>
          <view style="padding-bottom: 100rpx" :data-event="{ id: 'GcLq2xSbi9' }">
            <view class="card" :data-event="{ id: 'GcLq2xSbi9' }">
              <view
                class="c-flex c-flex-between"
                style="padding: 10px 16px"
                :data-event="{ id: 'GcLq2xSbi9' }"
              >
                <view style="color: #c2c0c0" :data-event="{ id: 'GcLq2xSbi9' }">服务范围</view>
                <van-checkbox-group
                  :value="storeData.exts.serviceScope"
                  @change="serviceScopeChange"
                >
                  <van-checkbox
                    v-for="(item, i) in options.serviceScope"
                    :key="i"
                    :name="item.value"
                    shape="square"
                    custom-class="c-m-t-10"
                  >
                    {{ item.name }}
                  </van-checkbox>
                </van-checkbox-group>
              </view>
            </view>
          </view>
        </van-tab>
      </block>
    </van-tabs>

    <!-- 底部按钮群 -->
    <view class="bottBtns c-flex c-item-center" v-if="swiper.show == false">
      <view>
        <van-button
          round
          type="info"
          size="normal"
          @click="doOpen('../../subpackages/store/storeDetail')"
          :data-event="{ id: 'vaHZx0HACK' }"
        >
          预 览
        </van-button>
      </view>
      <!-- <view>
        <van-button round type="info" @click="showQrcode" :data-event="{id:'zxZRcwFw8-'}">门店码</van-button>
      </view> -->
      <view>
        <van-button round type="info" @click="doChoosePic" :data-event="{ id: '7UjAXY98k2' }">
          门店海报
        </van-button>
      </view>
      <view>
        <van-button round color="#FFD13A" @click="dosave" :data-event="{ id: 'A9LBn78ehx' }">
          保 存
        </van-button>
      </view>
    </view>

    <!-- 回到顶部 -->
    <view
      class="fab"
      style="bottom: 200px"
      @click="scrollTo(0)"
      v-if="backTopShow"
      :data-event="{ id: 'sKlu_Zfzwv' }"
    >
      <van-icon name="arrow-up" class="c-size-24" :data-event="{ id: 'sKlu_Zfzwv' }" />
      <text class="c-size-14" :data-event="{ id: 'sKlu_Zfzwv' }">顶部</text>
    </view>
    <!-- 轮播编辑弹窗 -->
    <van-popup :show="swiper.show" position="bottom">
      <!-- <view class="c-h-1 c-flex c-flex-col sr-popup"> -->
      <view>
        <van-nav-bar title="编辑轮播图" left-text="返回" left-arrow @click-left="cancelSwiper" />
        <view>
          <view class="c-card">
            <view class="c-flex" style="padding: 10px 16px">
              <van-uploader
                style="display: flex"
                multiple
                :file-list="formData['images']"
                data-field="images"
                upload-text="上传"
                @after-read="afterRead"
                @delete="deleteFile"
              />
            </view>
          </view>
        </view>
      </view>
      <!-- </view> -->
    </van-popup>
    <!-- #ifdef MP-WEIXIN -->
    <poster
      id="poster"
      :config="posterConfig"
      @success="onPosterSuccess"
      @fail="onPosterFail"
      v-if="qrcodeShow"
    ></poster>
    <!-- #endif -->
    <!-- 海报弹框 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-dialog
      use-slot
      title="门店海报"
      :show="qrcodeShow"
      @confirm="closeQrcode"
      :data-event="{ id: 'UYzLEVEQ6L', capture: false }"
    >
      <image mode="widthFix" style="width: 100%" :src="savepicRoute" />
      <tki-qrcode
        v-if="qrcodeShow"
        class="tki-qrcode"
        style="visibility: hidden"
        :val="qrval"
        :size="600"
        :iconSize="qrsize"
        ref="qrcode"
        :onval="true"
        @result="doQrcodeRoute"
        :lv="1"
      ></tki-qrcode>
      <view style="display: flex; justify-content: space-around; padding-bottom: 10px">
        <van-button round size="small" @click="qrShare" :data-event="{ id: 'UYnG6N2kqT' }">
          保存/分享图片
        </van-button>
      </view>
    </van-dialog>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <van-dialog
      use-slot
      title="门店海报"
      :show="qrcodeShow"
      confirmButtonText="保存海报"
      confirmButtonColor="#ff6900"
      showCancelButton
      cancelButtonText="关闭"
      @confirm="
        painterSave();
        qrcodeShow = false;
      "
      @cancel="qrcodeShow = false"
      custom-style="top: unset !important; bottom: 10px; transform: translate3d(-50%, 0, 0);"
      :data-event="{ id: 'B_kuLK-7ag', capture: false }"
    >
      <l-painter ref="painter" style="position: relative">
        <l-painter-image :src="backgroundpic" css="width: 100%; object-fit: contain;" />
        <l-painter-qrcode
          :text="`https://xlink.fsgo365.cn/qrcode/tg/?partnerId=${partnerId}`"
          :css="`width: ${qrsize}px; height: ${qrsize}px;position:absolute; left:${qrx}px;top:${qry}px;background-color: #fff;`"
        />
        <l-painter-view
          :css="`position:absolute; left:${qrx}px;top:${
            qry + qrsize + 3
          }px;width:${qrsize}px;text-align:center;line-height:10px`"
        >
          <l-painter-text :text="storeData.name" css="font-size:10px;" />
        </l-painter-view>
      </l-painter>
    </van-dialog>
    <!-- #endif -->
    <van-dialog
      use-slot
      title="选择海报"
      :show="choosePicShow"
      show-cancel-button
      confirm-button-color="#ff6900"
      @confirm="confirmChoosePic"
      @close="closeChoosePic"
      custom-style="top: unset !important; bottom: 10px; transform: translate3d(-50%, 0, 0);"
      :data-event="{ id: 'Q0JhsjeKai', capture: false }"
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
            :data-event="{ id: 'xx_i-KMfsC' }"
          ></image>
        </view>
      </view>
    </van-dialog>
    <van-popup :show="area.show" position="bottom">
      <van-area :area-list="area.areaList" @confirm="areaConfirm" @cancel="area.show = false" />
    </van-popup>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
// #ifdef MP-WEIXIN
import tkiQrcode from '@/wxcomponents/tki-qrcode/tki-qrcode.vue';
import Poster from '../../wxcomponents/miniprogram_dist/poster';
import Poster2 from '../../wxcomponents/miniprogram_dist/poster/poster';
// #endif
export default {
  // #ifdef MP-WEIXIN
  components: {
    tkiQrcode,
    Poster
  },
  // #endif
  data() {
    return {
      bannerHeight: '',
      options: {
        // codecfg_userTag: {
        //   codeId: 'userTag'
        // },
        // codecfg_serviceYears: {
        //   codeId: 'serviceYears'
        // },
        // codecfg_banner: { codeId: 'banner' },
        codecfg_serviceScope: { codeId: 'serviceScope' }
      },

      scrollTop: 0,
      old: {
        scrollTop: 0
      },
      // 分享面板
      share: {
        show: false,
        options: [
          {
            name: '微信',
            icon: 'wechat'
          },
          // { name: '微博', icon: 'weibo' },
          {
            name: '复制链接',
            icon: 'link'
          },
          // { name: '分享海报', icon: 'poster' },
          {
            name: '二维码',
            icon: 'qrcode'
          }
        ]
      },
      // initParams: {}, //页面初始参数
      params: {}, //页面参数
      storeData: {
        exts: {
          images: [], //banner图
          introductionImg: [], //服务介绍图片
          introduction: '', //服务介绍
          chargeStandard: '', //收费标准
          serviceScope: [], //服务范围
          businessLicense: [] //营业执照
        }
      },
      bannerList: [],
      showShare: false, //分享面板
      userinfo: {}, //user对象
      normalImg: 'https://pub.fsgo365.cn/1751394223822192042.jpg',
      collapseNames: [],
      noticeIndex: 0, //当前通知下标
      faq: [
        {
          q: '管家多久与我联系？',
          a: '当天18:00前预约，2个半小时内管家会与您联系。'
        },
        {
          q: '管家多久可以上门？',
          a: '因管家日程已提前安排好，具体上门勘察时间由管家与您沟通确定。'
        },
        {
          q: '如何查看自己的订单？',
          a: '打开【雨虹防水维修服务小店】，右下角找到【我的】，打开【我的订单】。'
        },
        {
          q: ' 勘察会提供哪些服务？',
          a: '上门勘察找到渗漏点，提供维修方案及报价。'
        },
        {
          q: '上门勘察是否收费？',
          a: '全国免费上门。'
        },
        {
          q: '维修时使用什么材料？',
          a: '具体使用哪款材料按照选用服务产品套餐决定。防水主材均使用符合国标的正规材料，并且支持验证真伪。'
        },
        {
          q: '维修价格',
          a: '因每家情况不同、方案报价都是单独定制的，需要我们的专业管家看过现场后给您出。我们的工作人员全部是通过线上系统操作，综合您家的应用方案选择的材料/质保等按单平米（延米）进行整体报价的，不会出现管家乱报价的情况。'
        },
        {
          q: '如何查看自己的电子保单？',
          a: '雨虹防水维修服务小店小程序——我的——我的订单——质保——查看质保。'
        },
        {
          q: '售后问题',
          a: '渗漏部位:透光玻璃板材拼缝部位、采光顶与结构交接处等。解决方案:阳光房与结构交接部位视情况而定是否开槽,非搭建错误则请联系全国服务热线400-700-5756或关注雨虹防水维修服务公众号在线咨询。'
        },
        {
          q: '维修后保险如何报险？',
          a: '我司服务（除地下室外）因使用的防水材料（卷材/涂料）产品未达到防水应有功能导致第三方的财产损失均由中国大地保险承保；发现问题后48小时内拨打400-700-5756进行报险，我们会有相关负责人及时为您处理。'
        }
      ],
      lineNum: 0,
      lineFlag: false,
      chargeNum: 0,
      chargeFlag: false,
      packup: true, //收起常见问题
      // 省市区
      area: {
        show: false,
        areaList: Object.assign({}, areajs.default)
      },
      // 返回顶部按钮
      backTopShow: false,
      activeName: '1',
      partnerId: '', //当前登陆人的伙伴ID
      swiper: {
        show: false
      },
      formData: {
        introductionImg: [], //服务介绍图片
        introductionImg: [], //营业执照
        images: [],
        exts: {
          introduction: '', //服务介绍
          chargeStandard: '', //收费标准
          yuhong: '' //是否和雨虹签约
        }
      },
      qrcodeShow: false, //是否展示二维码弹窗
      qrval: 'https://xlink.fsgo365.cn', //二维码地址
      filterate: false, //是否过滤雨虹海报模板
      choosePicShow: false, //选择海报弹框
      activityDefData: [], //模板数据
      qrsize: '', //二维码大小
      backgroundpic: '', //背景图片地址
      qrx: '', //二维码x轴
      qry: '', //二维码y轴
      //获取背景图片的宽高
      backgroundpicWidth: '',
      backgroundpicHeight: '',
      posterConfig: {}, //画布数据
      savepic: '', //海报路径
      savepicRoute: '', //保存相册
      chooseImgIndex: '', // 选中的背景图的index
      isDataReadyToShow: false //等数据更新了在显示 在App端数据显示有问题
    };
  },
  onLoad(params) {
    this.doInit(params);
    common.osg.codeoption();
    // #ifdef APP-PLUS
    this.getArea();
    // #endif
  },

  methods: {
    /**
     * 页面初始化
     */
    doInit(params) {
      // 收起服务内容
      // this.tabClick('1');
      // 收起收费标准
      // this.chargeChange();
      let _currentUser = wx.getStorageSync('user');
      this.partnerId = _currentUser.partnerIds[0];
      this.params = params;
      common.osg.init(this, params, app);

      // #ifdef MP-WEIXIN
      // 分享
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage']
      });
      // #endif

      this.getData();
    },
    scroll: function (e) {
      this.old.scrollTop = e.detail.scrollTop;
    },
    lower: function (e) {},
    upper: function (e) {},
    open(url, params, options) {
      if (url.indexOf('declaration/declaration') != -1) {
        var u = common.osg.currentUser();
        if (u && u._id && u.nickname && u.phone) {
          common.osg.open(url, params, options);
        } else {
          common.osg.confirm('请先授权用户信息', () => {
            common.osg.open(
              '../authorize/authorize',
              Object.assign(this.initParams, { url: '../store/storeDetail' }),
              {
                mode: 'redirect'
              }
            );
          });
        }
      } else {
        common.osg.open(url, params, options);
      }
    },
    toCoupon(url) {
      if (url && url.indexOf('partnerCoupon') != -1) {
        common.osg.open('../coupon/mall');
      }
    },
    //分享按钮
    toShare() {
      this.showShare = true;
    },
    // 获取门店详情    3904066108544797157 partnerId
    getData() {
      common.osg.ajax('basic/partner/queryById/' + this.partnerId, {}, res => {
        this.storeData = res;
        this.$nextTick(() => {
          this.isDataReadyToShow = true;
        });
        this.formData.introductionImg = res.exts.introductionImg;
        this.formData.businessLicense = res.exts.businessLicense;
        this.formData.exts.introduction = res.exts.introduction;
        this.formData.exts.chargeStandard = res.exts.chargeStandard;
        this.formData.images = res.exts.images;
        // 详情页标题
        // wx.setNavigationBarTitle({
        //   title: res.entity.exts.title || res.entity.name
        // });
        // 解析门店banner
        if (res.exts && res.exts.images && res.exts.images.length > 0) {
          this.bannerList = res.exts.images;
        } else {
          this.bannerList = [
            {
              url: 'https://pub.fsgo365.cn/1752711429204168578.jpeg'
            }
          ];
        }
        console.log('storeData', this.storeData);
        this.getActivityDef();
      });
    },
    // 获取海报模板
    getActivityDef() {
      if (
        this.storeData.exts &&
        (this.storeData.exts.yuhong == '1' || this.storeData.exts.yuhong == '2')
      ) {
        this.filterate = true;
      }
      var params = {
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1
      };
      common.osg.ajax('biz/activityDef/query', params, res => {
        res.data.map(item => {
          item.tplImageFileid = JSON.parse(item.tplImageFileid);
        });
        // filter
        if (!this.filterate) {
          this.activityDefData = res.data.filter(
            item => item.exts.isYuhong !== '1' && item.exts.isYuhong !== '2'
          );
        } else {
          this.activityDefData = res.data;
        }
      });
    },
    // 打开微信小程序内置地图
    // openLocation(latitude, longitude, scale, name, address) {
    //   common.osg.openLocation(latitude, longitude, scale, name, address);
    // },
    codelabel(type, option, val, opts, frontEndConfig) {
      if (type == 'select') {
        return common.osg.codelabel(option, val, opts);
      } else if (type == 'cascade') {
        if (frontEndConfig && frontEndConfig.multiple) {
          return common.osg.codelabelCascadeMultiple(option, val);
        } else {
          return common.osg.formatCascade(option, val);
        }
      }
    },
    collapseChange(e) {
      this.collapseNames = e.detail;
    },
    alert(msg, title) {
      common.osg.alert(msg, null, title);
    },
    tabClick(e) {
      // this.lineFlag = false;
      // this.$nextTick(() => {
      //   let lineClass = '.line' + (e.detail ? e.detail.name : e);
      //   const query = uni.createSelectorQuery().in(this);
      //   query
      //     .select(lineClass)
      //     .boundingClientRect(data => {
      //       if (data) {
      //         this.lineNum = data.height / 20;
      //         this.lineNum > 3 ? (this.lineFlag = true) : (this.lineFlag = false);
      //       }
      //     })
      //     .exec();
      // });
      // if (e.detail && e.detail.name == '1') {
      //   this.scrollTo(350);
      // } else if (e.detail && e.detail.name == '2') {
      //   this.scrollTo(2261);
      // } else if (e.detail && e.detail.name == '3') {
      //   this.scrollTo(2714);
      // }
    },
    // chargeChange() {
    //   this.$nextTick(() => {
    //     const query = uni.createSelectorQuery().in(this);
    //     query
    //       .select('.charge')
    //       .boundingClientRect(data => {
    //         this.chargeNum = data.height / 20;
    //         this.chargeNum > 3 ? (this.chargeFlag = true) : (this.chargeFlag = false);
    //       })
    //       .exec();
    //   });
    // },
    // 获取滚动条当前位置
    onPageScroll(e) {
      if (e.scrollTop > 1000) {
        this.backTopShow = true;
      } else {
        this.backTopShow = false;
      }
      if (e.scrollTop < 2261) {
        this.activeName = '1';
      } else if (e.scrollTop >= 2261 && e.scrollTop < 2700) {
        this.activeName = '2';
      } else {
        this.activeName = '3';
      }
    },
    //回到顶部
    scrollTo(num) {
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: num || 0,
          duration: 600
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        });
      }
    },
    // 获取banner高度
    getHeight: function (e) {
      //获取可使用窗口宽度
      var width = wx.getSystemInfoSync().windowWidth * 0.94;
      //获取图片实际高度
      var imgheight = e.detail.height;
      //获取图片实际宽度
      var imgwidth = e.detail.width;
      //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      var height = (width * imgheight) / imgwidth;
      this.bannerHeight = height > 150 ? '150px' : height + 'px';
    },
    // 轮播编辑弹窗
    doSwiper() {
      this.swiper.show = true;
    },
    cancelSwiper() {
      this.swiper.show = false;
    },
    saveSwiper() {
      this.swiper.show = false;
    },
    // 上传轮播图
    // afterReadBannerList(e) {
    //   common.osg.afterRead(e, this);
    //   // this.bannerList.push()
    // },
    // // 删除轮播图
    // deleteBannerList(e) {
    //   let field = e.target.dataset.field;
    //   let index = e.detail.index;
    //   this.bannerList.splice(index, 1);
    //   this.$forceUpdate();
    // },
    // 上传图片
    afterRead(e) {
      common.osg.afterRead(e, this);
    },
    deleteFile(e) {
      let field = e.target.dataset.field;
      let index = e.detail.index;
      this.formData[field].splice(index, 1);
      this.$forceUpdate();
    },
    // 收费标准赋值
    chargeStandardChange(e) {
      this.formData.exts.chargeStandard = e.detail;
    },
    introductionChange(e) {
      this.formData.exts.introduction = e.detail;
    },
    titleChange(e) {
      this.storeData.exts.title = e.detail;
    },
    descriptionChange(e) {
      this.storeData.description = e.detail;
    },
    phoneChange(e) {
      this.storeData.phone = e.detail;
    },
    addressChange(e) {
      this.storeData.address = e.detail.value;
      let str = '';
      let ciry = '';
      str =
        this.area.areaList.province_list[this.storeData.province] +
        this.area.areaList.city_list[this.storeData.city] +
        this.area.areaList.county_list[this.storeData.district];
      ciry = this.area.areaList.city_list[this.storeData.city];
      common.osg.geo(
        str + e.detail.value,
        res => {
          this.storeData.gpsPoint = {
            latitude: res.location.split(',')[1],
            longitude: res.location.split(',')[0]
          };
        },
        ciry
      );
    },
    housekeeperNumberChange(e) {
      this.storeData.exts.housekeeperNumber = e.detail;
    },
    workerNumberChange(e) {
      this.storeData.exts.workerNumber = e.detail;
    },
    serviceScopeChange(e) {
      this.$set(this.storeData.exts, 'serviceScope', e.detail);
    },
    doOpen(path) {
      this.formData.exts.yuhong = this.storeData.exts.yuhong || '';
      wx.setStorageSync('preview', this.formData);
      common.osg.open(path);
    },
    // 保存
    dosave() {
      // this.storeData.address = this.formData.address;
      this.storeData.exts.images = this.formData.images;
      this.storeData.exts.introductionImg = this.formData.introductionImg;
      this.storeData.exts.businessLicense = this.formData.businessLicense;
      this.storeData.exts.introduction = this.formData.exts.introduction;
      this.storeData.exts.chargeStandard = this.formData.exts.chargeStandard;

      let params = this.storeData;
      if (!/^1[3456789]\d{9}$/.test(this.storeData.phone)) {
        common.osg.toast('手机号格式有误！', 'none');
        return;
      }
      common.osg.ajax('basic/partner/upsert.do', { partnerStr: JSON.stringify(params) }, res => {
        common.osg.alert('保存成功');
      });
    },
    // 展示二维码
    showQrcode() {
      /**
       * 注意qrval的域名测试时替换     https://xlinkbate.fsgo365.cn
       */
      //
      this.qrval = `https://xlink.fsgo365.cn/qrcode/tg/?partnerId=${this.partnerId}`;
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
      console.log('二维码e', e);
      this.filePic(e, res => {
        this.qrcodeRoute = res.url;
        console.log('二维码', this.qrcodeRoute);

        this.onCreatePoster();
      });
    },
    // 保存图片  this.$refs.qrcode._saveCode();
    downloadImg() {
      this.$refs.qrcode._saveCode();
    },
    //分享给朋友
    qrShare() {
      wx.showShareImageMenu({
        path: this.savepicRoute,
        success: res => {
          common.osg.toast('操作成功');
        },
        fail: err => {}
      });
    },
    /**
     * 选择省市区 确认
     */
    areaConfirm(e) {
      let values = e.detail.values || e.detail.value;
      let areaVal = [];
      if (values.length >= 1) {
        this.storeData.province = values[0].code || values[0].value;
        areaVal.push(values[0].code || values[0].value);
      }
      if (values.length >= 2) {
        this.storeData.city = values[1].code || values[1].value;
        areaVal.push(values[1].code || values[1].value);
      }
      if (values.length >= 3) {
        this.storeData.district = values[2].code || values[2].value;
        areaVal.push(values[2].code || values[2].value);
      }
      this.storeData.area = areaVal; //adcode的数组
      this.area.show = false;
    },
    doChoosePic() {
      this.chooseImgIndex = '';
      this.choosePicShow = true;
    },
    closeChoosePic() {
      this.choosePicShow = false;
    },
    confirmChoosePic() {
      this.choosePicShow = false;
      this.doBackground();
    },
    // 获取选中图片的数据
    getImg(e, i) {
      console.log('选择海报');
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
              callback({ url: downloadUrl + JSON.parse(res.data).key + '!convert.jpg' });
            }
          });
        },
        {
          noload: true
        }
      );
    },
    doBackground() {
      this.getBackgroundpicSize();
      // #ifdef MP-WEIXIN
      this.$nextTick(() => {
        this.showQrcode();
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
    // APP-PLUS 保存海报图片
    painterSave() {
      this.$refs.painter.canvasToTempFilePathSync({
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
      console.log('拿到的实际', this.backgroundpicWidth, this.backgroundpicHeight);

      // setData配置数据
      this.posterConfig = {
        width: this.backgroundpicWidth,
        height: this.backgroundpicHeight,
        backgroundColor: '#ffffff',
        debug: false,
        pixelRatio: wx.getSystemInfoSync().pixelRatio,
        // pixelRatio: 100,
        texts: [
          {
            // x: this.qrx + this.qrsize / 2,
            // y: this.qry + this.qrsize + 90,
            x: this.qrx + this.qrsize / 2, //加上二维码的宽度 剧中
            y: this.qry - 6, //减去自身的高度
            text: this.storeData.name,
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
    },
    onPosterSuccess(e) {
      this.savepicRoute = e;
      wx.hideLoading(); // 关闭加载提示
    },
    onPosterFail() {
      wx.hideLoading(); // 关闭加载提示
      common.osg.toast('海报生成失败,请稍后重试', 'none');
    },
    // 获取省市区字典
    getArea() {
      common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
        this.area = res;
      });
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #fff;
}

.chooseImg {
  border: 3px solid #ff9800;
  border-radius: 5px;
}
.tki-qrcode {
  text-align: center;
  padding: 0rpx;
  height: 0;
}
.van-field__label {
  color: #c2c0c0 !important;
}
.van-cell__title {
  color: #c2c0c0 !important;
}
.van-cell__value {
  color: #323233 !important;
}
.van-button {
  width: 100px;
}
.card {
  border: 1px solid #c2c0c0;
  background-color: #fff;
  padding: 20rpx;
  margin: 20rpx;
  border-radius: 10rpx;
  font-size: 16px;
  // overflow: hidden;
}
.c-p-v-3vw {
  padding: 0 3vw;
}

.header {
  padding: 3vw;
}

image {
  max-width: 100%;
  display: inline-block;
  position: relative;
  z-index: 0;
}

/* 分享按钮 */
.bottBtns {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #f2f2f2;
  height: 130rpx;
  z-index: 999;
  background: #ffffff;
  display: flex;
  justify-content: space-around;
}

.bottomBtnWrap {
  width: 35%;
  color: #ffffff;
  border-radius: 45px;
  height: 90rpx;
  font-size: 18px;
  font-weight: bold;
  line-height: 90rpx;
}

.corred {
  background: #ff3a3a;
  margin: 0 3vw;
}

.corgreen {
  background: #56ba5d;
}

.porjectOneImg {
  padding: 0 !important;
}

/* 悬浮球 */
.fab {
  position: fixed;
  z-index: 1;
  bottom: 80px;
  left: 10px;
  border-radius: 50%;
  border: 1px solid #e60012;
  background-color: rgba(255, 255, 255, 0.7);
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e60012;
}

/* 分享面板 */
.shareBox {
  padding: 20rpx;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}

.shareBox-wrapper {
  margin-right: 30rpx;
}

.shareBox-wrapper button::after {
  border: none;
}

.shareBox-wrapper button {
  /* height: 80rpx; */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #07c160;
}

/* .shareBox > button {
    width: 114rpx;
    height: 100rpx;
    backdrop-filter: ;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    font-size: 22rpx;
    background: transparent;
  }

   */

.list-item {
  padding: 3vw;
  display: flex;
  border-bottom: 1px solid #f2f2f2;
  position: relative;
  .list-item-left {
    width: 25vw;
    border-radius: 10rpx;
    overflow: hidden;
    image {
      display: flex;
    }
  }
  .list-item-right {
    flex: 1;
    padding-left: 3vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    > view {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 25px;
    }
  }
  .call {
    position: absolute;
    top: 4vw;
    right: 4vw;
    // right: 3vw;
    // top: calc(50% - 40px);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #d42e26;
    display: flex;
    van-icon {
      margin: 0 auto;
      font-size: 20px;
      color: #fff;
    }
  }
}
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
  // text-indent: 2vw;
}
.faq-item {
  padding: 0 3vw 3vw;
  > view {
    display: flex;
  }
}

.van-tabs__nav {
  background: #f5f5f5;
}
.van-tabs__track {
  min-height: 60px;
  padding: 3vw;
  box-sizing: border-box;
}
.lines {
  line-height: 20px;
  font-size: 14px;
  color: #676767;
  overflow: hidden;
  text-align: left;
}
.lineBtn {
  font-size: 14px;
  color: #676767;
  height: 20px;
  line-height: 20px;
  padding-top: 3vw;
  > view {
    display: flex;
    justify-content: center;
  }
}
.charge {
  line-height: 20px;
  font-size: 14px;
  color: #676767;
  overflow: hidden;
  text-align: left;
}
.call {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #d42e26;
  display: flex;
  van-icon {
    margin: 0 auto;
    font-size: 20px;
    color: #fff;
  }
}
.action-sheet-index--van-action-sheet {
  z-index: 999 !important;
}

.storeDecoration .van-uploader__upload {
  margin: 0;
}

.storeDecoration {
  .van-dialog__footer {
    .van-dialog__button {
      text-align: center;
    }
  }
}
</style>
