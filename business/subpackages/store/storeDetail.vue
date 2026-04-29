<template>
  <view @click.capture="track">
    <!-- 通知 -->
    <view class="header">
      <!-- banner  https://pub.fsgo365.cn/1752711429204168578.jpeg -->
      <view v-if="params && params.images.length !== 0">
        <swiper :autoplay="true" :circular="true" :style="'height:' + bannerHeight">
          <swiper-item v-for="(item, i) in params.images" :key="i">
            <image :src="item.url" mode="widthFix" @load="getHeight"></image>
          </swiper-item>
        </swiper>
      </view>
      <view v-else>
        <swiper :autoplay="true" :circular="true" :style="'height:' + bannerHeight">
          <swiper-item>
            <image
              src="https://pub.fsgo365.cn/1752711429204168578.jpeg"
              mode="widthFix"
              @load="getHeight"
            ></image>
          </swiper-item>
        </swiper>
      </view>

      <!-- 名称 简介 地址 -->
    </view>

    <!-- 服务介绍 -->
    <van-tabs
      :active="activeName"
      @click="tabClick"
      :data-event="{ id: '28rpynhSQf', capture: false }"
    >
      <van-tab title="收费标准" name="1">
        <!-- <view :data-event="{id:'28rpynhSQf'}">
          <view style="background-color: #f5f5f5; padding: 2vw 3vw" :data-event="{id:'28rpynhSQf'}">防水维修收费标准</view>
          <view style="padding: 3vw" :data-event="{id:'28rpynhSQf'}">
            <view class="lines line1" :style="{ height: chargeFlag ? '60px' : 'auto' }" :data-event="{id:'28rpynhSQf'}">
              <view :data-event="{id:'28rpynhSQf'}">
                {{ params.exts.chargeStandard || '' }}
              </view>
            </view>
            <view v-if="chargeNum > 3" class="lineBtn" :data-event="{id:'28rpynhSQf'}">
              <view class="more" v-if="chargeFlag" :data-event="{id:'28rpynhSQf'}">
                <text class="c-m-r-10" @click="chargeFlag = !chargeFlag" :data-event="{id:'iai8LMW_Ft'}">更多内容</text>
                <van-icon name="arrow-down" :data-event="{id:'28rpynhSQf'}" />
              </view>
              <view class="more" v-else :data-event="{id:'28rpynhSQf'}">
                <text class="c-m-r-10" @click="chargeFlag = !chargeFlag" :data-event="{id:'FS6LgK0aos'}">收起</text>
                <van-icon name="arrow-up" :data-event="{id:'28rpynhSQf'}" />
              </view>
            </view>
          </view>
        </view> -->
      </van-tab>
      <!-- <image
        src="https://pub.fsgo365.cn/5697011006402180594.jpg"
        style="width: 100vw"
        mode="widthFix" :data-event="{id:'28rpynhSQf'}" /> -->
      <van-tab title="服务介绍" name="2"></van-tab>
      <van-tab title="店铺管家" name="3"></van-tab>
    </van-tabs>

    <!-- 收费标准chargeStandard -->
    <view class="chargeStandard card">
      <view v-if="params && params.exts.chargeStandard">
        <view style="padding: 2vw 3vw; font-size: 16px; font-weight: 600; color: #41414d">
          防水维修收费标准
        </view>
        <view style="padding: 3vw">
          <view class="charge" :style="{ height: chargesUp ? '60px' : 'auto' }">
            <view>
              {{ params.exts.chargeStandard || '' }}
            </view>
          </view>
          <view class="lineBtn" v-if="params.exts.chargeStandard">
            <view class="more" v-if="chargesUp">
              <text
                class="c-m-r-10"
                @click="chargesUp = !chargesUp"
                :data-event="{ id: 'UPRu-yIiEj' }"
              >
                更多内容
              </text>
              <van-icon name="arrow-down" />
            </view>
            <view class="more" v-else>
              <text
                class="c-m-r-10"
                @click="chargesUp = !chargesUp"
                :data-event="{ id: 'rFd31PDJPX' }"
              >
                收起
              </text>
              <van-icon name="arrow-up" />
            </view>
          </view>
        </view>
      </view>
      <view v-else>
        <view style="padding: 2vw 3vw; font-size: 16px; font-weight: 600; color: #41414d">
          防水维修收费标准
        </view>
        <view style="padding: 3vw">
          <view
            v-if="params && params.exts.yuhong == '1'"
            class="charge"
            :style="{ height: chargeFlag ? '60px' : 'auto' }"
          >
            <view>
              专业管家会为您上门进行现场勘查，给出维修方案和并通过专业系统生成电子定制报价。报价由不同维修部位的施工工艺、使用的材料、质保的年限以及相关的工作环节费用组成。您可以现场查看报价单明细或登录“修链科技丨防水补漏”查看自己的报价信息。
            </view>
            <view>
              【注意事项】
              1.为了保障您的合法权益和服务质量，避免不必要的损失，请您切勿与工作人员进行私下交易，我们无法对私下交易提供保障。
              2. 如有其他疑问，请联系雨虹防水维修服务全国服务热线：400-700-5756。
            </view>
          </view>
          <view v-if="chargeNum > 3" class="lineBtn">
            <view class="more" v-if="chargeFlag">
              <text
                class="c-m-r-10"
                @click="chargeFlag = !chargeFlag"
                :data-event="{ id: 'SFlHQGykmA' }"
              >
                更多内容
              </text>
              <van-icon name="arrow-down" />
            </view>
            <view class="more" v-else>
              <text
                class="c-m-r-10"
                @click="chargeFlag = !chargeFlag"
                :data-event="{ id: 'q_Pbtj2llr' }"
              >
                收起
              </text>
              <van-icon name="arrow-up" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 服务介绍introduction -->
    <view class="introduction card">
      <view style="padding: 2vw 3vw; font-size: 16px; font-weight: 600; color: #41414d">
        防水维修服务介绍
      </view>
      <view style="padding: 3vw">
        <view v-if="params && params.exts.introduction">
          <view class="charge" :style="{ height: serviceUp ? '60px' : 'auto' }">
            {{ params.exts.introduction || '' }}
          </view>
          <view class="lineBtn" v-if="params.exts.introduction">
            <view class="more" v-if="serviceUp">
              <text
                class="c-m-r-10"
                @click="serviceUp = !serviceUp"
                :data-event="{ id: 'PdM-Cqc_bB' }"
              >
                更多内容
              </text>
              <van-icon name="arrow-down" />
            </view>
            <view class="more" v-else>
              <text
                class="c-m-r-10"
                @click="serviceUp = !serviceUp"
                :data-event="{ id: '6qjRI7Y40M' }"
              >
                收起
              </text>
              <van-icon name="arrow-up" />
            </view>
          </view>
        </view>
        <viwe v-else>
          <view style="padding: 3vw">
            <view
              v-if="params && params.exts.yuhong == '1'"
              class="charge"
              :style="{ height: chargeFlag ? '60px' : 'auto' }"
            >
              我们专注于为客户提供标准化、专业化的家庭防水维修服务，服务范围包括屋面、外墙、卫生间、窗户和地下室等。
            </view>
          </view>
          <view v-if="lineNum > 3" class="lineBtn">
            <view class="more" v-if="lineFlag">
              <text
                class="c-m-r-10"
                @click="lineFlag = !lineFlag"
                :data-event="{ id: 'zlKtnCLH8A' }"
              >
                更多内容
              </text>
              <van-icon name="arrow-down" />
            </view>
            <view class="more" v-else>
              <text
                class="c-m-r-10"
                @click="lineFlag = !lineFlag"
                :data-event="{ id: 'yHXvdDhPmE' }"
              >
                收起
              </text>
              <van-icon name="arrow-up" />
            </view>
          </view>
        </viwe>
        <view v-if="params && params.introductionImg.length !== 0">
          <view v-for="(item, index) in params.introductionImg" :key="index">
            <image :src="item.url" style="width: 100vw" mode="widthFix" />
          </view>
        </view>
        <view v-else>
          <image
            v-if="params && params.exts.yuhong == '1'"
            src="https://pub.fsgo365.cn/5697011006402180594.jpg"
            style="width: 100vw"
            mode="widthFix"
          />
        </view>
      </view>
    </view>
    <!-- 管家列表 -->
    <view class="users card">
      <view style="padding: 2vw 3vw; font-size: 16px; font-weight: 600; color: #41414d">
        店铺管家
      </view>
      <view style="display: block" class="list-item">
        <view style="display: flex">
          <view class="list-item-left" style="width: 52px">
            <image :src="normalImg" mode="widthFix"></image>
          </view>
          <view class="list-item-right">
            <!-- 姓名 服务数量 -->
            <view>
              <text style="font-weight: 600" class="c-size-16">管家姓名</text>
            </view>
            <!-- 标签 -->
          </view>
        </view>
        <view>
          <!-- 服务 -->
          <view
            style="display: flex; justify-content: space-between; text-align: center; margin: 10px"
          >
            <view>
              <view style="font-weight: normal" class="c-size-10 c-c-2">服务数量</view>
              <view style="font-size: 13px" class="c-c-9">服务数量(单)</view>
            </view>
            <view>
              <view style="font-weight: normal" class="c-size-10 c-c-2">服务年限</view>
              <view style="font-size: 13px" class="c-c-9">服务年限(年)</view>
            </view>
            <view>
              <view style="font-weight: normal" class="c-size-10 c-c-2">服务分</view>
              <view style="font-size: 13px" class="c-c-9">服务分</view>
            </view>
          </view>
        </view>
        <div
          style="
            position: absolute;
            top: 4vw;
            right: 15vw;
            float: right;
            width: 0.5px;
            height: 35px;
            background: #dedede;
          "
        ></div>
        <view class="call">
          <van-icon name="phone" />
        </view>
      </view>
    </view>

    <!-- FAQ -->
    <view class="card" style="padding-bottom: 130rpx">
      <view
        style="
          padding: 2vw 3vw;
          font-size: 16px;
          font-weight: 600;
          color: #41414d;
          margin-bottom: 3vw;
        "
      >
        常见问题
      </view>
      <block v-for="(item, i) in faq" :key="i">
        <view class="faq-item" v-if="packup ? i < 1 : true">
          <view style="color: #106cff" class="c-weight-600">
            <text>Q：</text>
            <text class="c-size-16">{{ item.q }}</text>
          </view>
          <view class="c-c-9">
            <text>A：</text>
            <text>{{ item.a }}</text>
          </view>
        </view>
      </block>
      <view class="lineBtn" style="padding-bottom: 30px; padding-top: 0">
        <view class="more" v-if="packup">
          <text class="c-m-r-10" @click="packup = !packup" :data-event="{ id: 'dZNjbHfKQX' }">
            更多内容
          </text>
          <van-icon name="arrow-down" />
        </view>
        <view class="more" v-else>
          <text class="c-m-r-10" @click="packup = !packup" :data-event="{ id: 'if7cClRA1X' }">
            收起
          </text>
          <van-icon name="arrow-up" />
        </view>
      </view>
    </view>
    <!-- 底部按钮群 -->

    <!-- 回到顶部 -->
    <view
      class="fab"
      style="bottom: 200px"
      @click="scrollTo(0)"
      v-if="backTopShow"
      :data-event="{ id: '-5VGrCfWFc' }"
    >
      <van-icon name="arrow-up" class="c-size-24" :data-event="{ id: '-5VGrCfWFc' }" />
      <text class="c-size-14" :data-event="{ id: '-5VGrCfWFc' }">顶部</text>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
const areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      bannerHeight: '',
      options: {
        codecfg_userTag: {
          codeId: 'userTag'
        },
        codecfg_serviceYears: {
          codeId: 'serviceYears'
        },
        codecfg_banner: { codeId: 'banner' }
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
      params: {}, //预览内容
      storeData: {},
      butlerList: [],
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
      chargesUp: true, //收起收费标准
      serviceUp: true, //收起服务介绍
      packup: true, //收起常见问题
      // 省市区
      area: {
        areaList: Object.assign({}, areajs.default)
      },
      // 返回顶部按钮
      backTopShow: false,
      activeName: '1',
      // 收费标准
      chargeStandardH: '',
      // 服务介绍
      introductionH: '',
      // 店铺管家
      usersH: ''
    };
  },
  onLoad(params) {
    this.doInit(params);
  },

  methods: {
    /**
     * 页面初始化
     */
    doInit(params) {
      // 收起服务内容
      // this.tabClick('1');
      // 收起收费标准
      this.chargeChange();
      this.chargeH();
      // this.getData();
      // this.params = params;
      this.params = wx.getStorageSync('preview');
      common.osg.init(this, params, app);

      // 分享
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage']
      });
      // this.data();
    },
    scroll: function (e) {
      this.old.scrollTop = e.detail.scrollTop;
    },
    lower: function (e) {},
    upper: function (e) {},
    // open(url, params, options) {
    //   if (url.indexOf('declaration/declaration') != -1) {
    //     var u = common.osg.currentUser();
    //     if (u && u._id && u.nickname && u.phone) {
    //       common.osg.open(url, params, options);
    //     } else {
    //       common.osg.confirm('请先授权用户信息', () => {
    //         // console.log(Object.assign(this.initParams, { url: '../store/storeDetail' }));
    //         common.osg.open(
    //           '../authorize/authorize',
    //           Object.assign(this.initParams, { url: '../store/storeDetail' }),
    //           {
    //             mode: 'redirect'
    //           }
    //         );
    //       });
    //     }
    //   } else {
    //     common.osg.open(url, params, options);
    //   }
    // },
    // toCoupon(url) {
    //   if (url && url.indexOf('partnerCoupon') != -1) {
    //     common.osg.open('../coupon/mall');
    //   }
    // },
    //分享按钮
    // toShare() {
    //   this.showShare = true;
    // },
    // 获取门店详情
    getData() {
      common.osg.ajax('basic/partner/queryById/' + '3904066108544797157', {}, res => {
        res.entity.exts = res.entity.exts || {};
        this.storeData = res.entity;

        // 通知栏
        if (this.storeData.notice && this.storeData.notice.length > 0) {
          var timer = setInterval(() => {
            if (this.noticeIndex + 1 > this.storeData.notice.length - 1) {
              this.noticeIndex = 0;
            } else {
              this.noticeIndex += 1;
            }
          }, 3000);
        }

        // 详情页标题
        // wx.setNavigationBarTitle({
        //   title: res.entity.exts.title || res.entity.name
        // });
        // 解析门店banner
        if (res.entity.exts && res.entity.exts.images && res.entity.exts.images.length > 0) {
          this.bannerList = res.entity.exts.images;
        } else {
          this.bannerList = [
            {
              url: 'https://pub.fsgo365.cn/1752711429204168578.jpeg'
            }
          ];
        }
        if (res.entity.tenantId == '1340835581184723420') {
          for (var banner of this.options.banner) {
            if (banner.value.indexOf('partnerCoupon') != -1) {
              this.bannerList.push({ url: 'https://pub.fsgo365.cn/' + banner.value });
            }
          }
        }
        // 获取管家列表
        // common.osg.ajax(
        //   'parnter/queryhousekeeper',
        //   {
        //     orgId: res.entity.orgId,
        //     resourceType: 'technician',
        //     'in:resourceRoles|array#and': '1', //只查管家
        //     'ne:workType|integer#and': '-1', // 不展示离线管家
        //     'is:state|integer#and': 1,
        //     sortField: 'workType',
        //     sortOrder: 'desc'
        //   },
        //   res2 => {
        //     // 解析照片
        //     res2.data.map(item => {
        //       item.users = item.users || {};
        //       if (item.users.profileImg && common.osg.isJson(item.users.profileImg)) {
        //         item.users.profileImg = JSON.parse(item.users.profileImg);
        //       } else {
        //         item.users.profileImg = [];
        //       }
        //     });
        //     // 赋值
        //     this.butlerList = res2.data;
        //   }
        // );
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
      this.chargeH();
      if (e.detail && e.detail.name == '1') {
        this.scrollTo(30);
      } else if (e.detail && e.detail.name == '2') {
        this.scrollTo(this.chargeStandardH);
      } else if (e.detail && e.detail.name == '3') {
        this.scrollTo(this.introductionH);
      }
    },
    // 获取元素的高
    chargeH() {
      let query = wx.createSelectorQuery();
      query
        .select('.chargeStandard')
        .boundingClientRect(rect => {
          this.chargeStandardH = rect.height;
        })
        .exec();
      query
        .select('.introduction')
        .boundingClientRect(rect => {
          this.introductionH = rect.height + this.chargeStandardH;
        })
        .exec();
      query
        .select('.users')
        .boundingClientRect(rect => {
          this.usersH = rect.height + this.chargeStandardH + this.introductionH;
        })
        .exec();
    },
    chargeChange() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('.charge')
          .boundingClientRect(data => {
            this.chargeNum = data.height / 20;
            this.chargeNum > 3 ? (this.chargeFlag = true) : (this.chargeFlag = false);
          })
          .exec();
      });
    },
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
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #fbfbfb;
}
.listItem {
  padding: 3vw;
  border-bottom: 1px solid #f2f2f2;
  position: relative;
}
.card {
  background-color: #ffffff;
  // margin: 20rpx;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 16px;
  overflow: hidden;
}
.van-tabs__line {
  background: #106cff !important;
}
.van-tabs__track {
  min-height: 0 !important;
  padding: 1vw !important;
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
  background: #106cff;
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
  border: 1px solid #106cff;
  background-color: rgba(255, 255, 255, 0.7);
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #106cff;
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
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #28c941;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #28c941;
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
</style>
