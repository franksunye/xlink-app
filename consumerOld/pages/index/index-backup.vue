<template>
  <view class="container" v-if="show">
    <!-- <view id="nav" class="fix">
      <view class="c-flex c-flex-start c-item-center">
        <van-search
          :value="searchval"
          @search="onSearch"
          @cancel="onCancel"
          shape="round"
          placeholder="请输入您遇到的漏水问题,渗漏部位"
          class="c-w"
        />
      </view>
    </view> -->
    <view id="banner" class="navigation">
      <view class="c_clear">
        <swiper
          class="swiper"
          :indicator-dots="indicatorDots"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
        >
          <swiper-item v-for="(item, i) in options.banner" :key="i">
            <image class="bannerImg c_rt swiper-item" :src="item.value" mode="scaleToFill"></image>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view id="functionWrap" class="topBg">
      <view class="funcItem c-flex c-flex-around">
        <view class="funcItemLeft">
          <image
            class="funcItemLeftImg"
            src="../../static/images/funcitem1.png"
            mode="widthFix"
          ></image>
        </view>
        <view class="funcItemCont" @click="toAsk">
          <view class="">
            <text class="c-size-20 otherInfoTitle">智能问诊</text>
          </view>
          <text class="otherInfoTitle c-m-t-20 c-size-12 fcol-cf5">
            迅速诊断渗漏问题并为您匹配维修管家
          </text>
        </view>
        <view class="funcItemRight c-flex c-flex-end c-item-center">
          <image
            class="funcItemRightImg"
            src="../../static/images/rightarrow.png"
            mode="widthFix"
          ></image>
        </view>
      </view>
      <view class="funcItem c-flex c-flex-around" @click="toStore">
        <view class="funcItemLeft">
          <image
            class="funcItemLeftImg"
            src="../../static/images/funcitem3.png"
            mode="widthFix"
          ></image>
        </view>
        <view class="funcItemCont">
          <view class="">
            <text class="c-size-20 otherInfoTitle">找维修门店</text>
          </view>
          <text class="otherInfoTitle c-m-t-20 c-size-12 fcol-cf5">
            搜寻附近实体门店，快速解决渗漏问题
          </text>
        </view>
        <view class="funcItemRight c-flex c-flex-end c-item-center">
          <image
            class="funcItemRightImg"
            src="../../static/images/rightarrow.png"
            mode="widthFix"
          ></image>
        </view>
      </view>
      <view class="funcItem c-flex c-flex-around">
        <view class="funcItemBotLeft c-w-half c-flex c-flex-between" @click="tobutler">
          <view class="funcItemBotLeftLeft">
            <image
              class="funcItemBotLeftImg"
              src="../../static/images/funcitem2.png"
              mode="widthFix"
            ></image>
          </view>
          <view class="funcItemBotLeftRight">
            <view class="">
              <text class="c-size-16 otherInfoTitle">人员查询</text>
            </view>
            <text class="otherInfoTitle c-m-t-20 c-size-12 fcol-cf5">搜索附近管家</text>
          </view>
        </view>
        <view class="funcItemBotRight c-w-half c-flex c-flex-between">
          <view class="funcItemBotRightLeft">
            <image
              class="funcItemBotRightImg"
              src="../../static/images/funcitem4.png"
              mode="widthFix"
            ></image>
          </view>
          <view class="funcItemBotRightRight" @click="makeCall('4007005756')">
            <view class="">
              <text class="c-size-16 otherInfoTitle">400-700-5756</text>
            </view>
            <text class="otherInfoTitle c-m-t-20 c-size-12 fcol-cf5">一键呼叫官方客服</text>
          </view>
        </view>
      </view>
    </view>
    <view id="mnyWrap">
      <view class="mnyTitle col-cf5 c-flex c-item-center c-flex-between">
        <view class="c-size-18 c-bold">防水维修收费标准</view>
      </view>
      <view style="padding: 3vw; color: #676767">
        <view class="charge" :style="{ height: chargeFlag ? '60px' : 'auto' }">
          <view>
            专业管家会为您上门进行现场勘查，给出维修方案和并通过专业系统生成电子定制报价。报价由不同维修部位的施工工艺、使用的材料、质保的年限以及相关的工作环节费用组成。您可以现场查看报价单明细或登录“修链科技丨防水补漏”查看自己的报价信息。
          </view>
          <view>
            【注意事项】
            1.为了保障您的合法权益和服务质量，避免不必要的损失，请您切勿与工作人员进行私下交易，我们无法对私下交易提供保障。
            2. 如有其他疑问，请联系雨虹防水维修服务全国服务热线：400-700-5756。
          </view>
        </view>
        <view v-if="chargeNum > 3" class="lineBtn" style="padding-top: 3vw">
          <view class="more" v-if="chargeFlag">
            <text class="c-m-r-10" @click="chargeFlag = !chargeFlag">更多内容</text>
            <van-icon name="arrow-down" />
          </view>
          <view class="more" v-else>
            <text class="c-m-r-10" @click="chargeFlag = !chargeFlag">收起</text>
            <van-icon name="arrow-up" />
          </view>
        </view>
      </view>
    </view>
    <view>
      <view class="custRepHead col-cf5 c-size-18 c-bold" style="margin-bottom: 3vw">常见问题</view>
      <block v-for="(item, i) in faq" :key="i">
        <view class="faq-item" v-if="packup ? i < 1 : true">
          <view class="c-red c-weight-600">
            <text>Q：</text>
            <text class="c-size-16">{{ item.q }}</text>
          </view>
          <view class="c-c-9">
            <text>A：</text>
            <text>{{ item.a }}</text>
          </view>
        </view>
      </block>
      <view class="lineBtn" style="padding-bottom: 30px">
        <view class="more" v-if="packup">
          <text class="c-m-r-10" @click="packup = !packup">更多内容</text>
          <van-icon name="arrow-down" />
        </view>
        <view class="more" v-else>
          <text class="c-m-r-10" @click="packup = !packup">收起</text>
          <van-icon name="arrow-up" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      show: false,
      showMore: false,
      searchval: '',
      repContList: [1, 2, 3],
      custRepTagList: [1, 2],
      custRepImgList: [1, 2, 3],
      scrollTop: 0,
      old: {
        scrollTop: 0
      },
      problemContList: [1],
      indicatorDots: false,
      autoplay: true,
      interval: 3000,
      duration: 500,
      options: {
        codecfg_banner: { codeId: 'banner' },
        banner: [
          // { value: 'https://pub.fsgo365.cn/banner11.jpeg' },
          // { value: 'https://pub.fsgo365.cn/banner12.jpeg' },
          // { value: 'https://pub.fsgo365.cn/banner14.jpeg' }
        ]
      },
      faq: [
        {
          q: '什么是防水维修服务？',
          a: '雨虹防水维修服务是东方雨虹集团子公司北京顶之美建筑科技有限责任公司推出的家庭渗漏维修服务。为消费者家庭的卫生间、厨房、阳台、露台及屋顶等漏水部位提供专业上门维修服务。'
        },
        {
          q: '屋顶常见的渗漏部位?',
          a: '90%的渗漏水出现在1%的细部节点部位，屋顶常见的渗漏部位包括:防水的立面收头、分格缝、变形缝、落水口、檐口、屋面出入口、女儿墙根、烟囱根、设备基座根、排气管根等。'
        },
        {
          q: '屋顶出现渗漏水问题后,局部处理?还是整体维修?',
          a: '局部处理:优势是价格便宜,工期短。劣势是屋顶结构层次复杂,内部存在窜水现象,漏水点无法准确治理,较难彻底根治漏水问题,虽然能够降低初次维修成本,但后期维护成本均较高,长期费用高。整体维修:优势是能够根据不同的建筑类型提供针对性的维修方案,选取高品质维修材料,消除窜水隐患,彻底解决漏水问题。劣势是工期偏长。'
        },
        {
          q: '雨虹屋顶防水材料的使用寿命?',
          a: '雨虹使用的维修材料由自主科研团队研发并执行国家标准的防水材料,其本身的耐候、耐久、抗老化性能满足屋顶的需求，防水涂膜、防水卷材的厚度达到屋顶需求其材料本身的使用寿命一般不少于30年,结合雨虹标准化施工从定制化设计、施工、维护等,甚至可以和建筑结构同寿命。'
        },
        {
          q: '窗户常见渗漏部位有哪些?',
          a: '窗户本身的推拉槽内积水、窗户下沿与窗台交接处、窗户两侧、顶部与墙体连接处、窗户周边的墙体渗水。'
        },
        {
          q: '窗户发生渗漏选择什么防水材料进行维修?',
          a: '发泡填充材料封堵窗框与结构之间的物理间隙;底涂型防水材料提升结构基层与后续密封防水材料的粘结强度;专用密封胶带对窗户周圈做好增强处理，二次增强封堵效果;外露型防水材料具备长期外露使用有效抵抗老化、紫外线的性能。'
        },
        {
          q: '卫生间常见渗漏部位有哪些?',
          a: '上水管道根部、地漏排水管根部、马桶排污管周边、洗手盆排水管根部、过门石外侧墙面、过门石下部、淋浴墙背面等。'
        },
        {
          q: '卫生间的管根周边渗漏可以局部拆砖维修么?',
          a: '卫生间渗漏不建议局部拆砖维修，如果免拆可以治理就不必拆砖，如果非拆砖不可建议整体拆除,因为局部拆砖势必破坏防水层，新老防水层不能有效搭接，存在渗漏隐患,不如整体拆除地面面砖,墙面至少拆除300mm高,重新做防水。'
        },
        {
          q: '阳光房常见渗漏部位及原因分析？',
          a: '渗漏部位:透光玻璃板材拼缝部位、采光顶与结构交接处等。解决方案:阳光房与结构交接部位视情况而定是否开槽,非搭建错误则不用开槽，直接对结构交界处做密封处理;采用耐候密封材料+专用密封胶带+外露型防水涂料对板材接缝进行密封。'
        }
      ],
      chargeNum: 0,
      chargeFlag: false,
      packup: true //收起常见问题
    };
  },
  onLoad: function (params) {
    this.init(params);
  },
  onShow() {
    common.osg.init(this, {}, app);
  },
  //设置分享的参数
  onShareAppMessage: function (res) {
    return {
      title: '修链科技丨防水补漏',
      path: `../../pages/index/index`
    };
  },
  methods: {
    init(params) {
      common.osg.init(this, params, app);
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage']
      });
      this.chargeChange();
    },
    // 搜索按钮
    onSearch: function () {
      console.log(this.data.searchval);
    },
    onCancel: function () {
      console.log(this.data.searchval);
    },
    scroll: function (e) {
      console.log(e);
      this.old.scrollTop = e.detail.scrollTop;
    },
    lower: function (e) {},
    upper: function (e) {},
    // 跳转管家列表
    tobutler: function () {
      common.osg.open('../../subpackages/butler/butler', null, {
        mode: ''
      });
    },
    toStore: function () {
      common.osg.open('../../subpackages/store/store', null, {
        mode: ''
      });
    },
    // 智能诊断
    toAsk() {
      common.osg.open('../../pages/declaration/declaration', { title: '智能问诊' });
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    chargeChange() {
      setTimeout(() => {
        const query = uni.createSelectorQuery().in(this).select('.charge');
        query
          .boundingClientRect(data => {
            this.chargeNum = data.height / 20;
            this.chargeNum > 3 ? (this.chargeFlag = true) : (this.chargeFlag = false);
          })
          .exec();
      }, 1);
    }
  },
  onShow() {
    // 判断是否登录
    // if (!common.osg.isLogined()) {
    common.osg.doLogin({}, res => {
      common.osg.codeoption(() => {
        this.options.banner.map(item => {
          item.value =
            'https://pub.fsgo365.cn/' + item.value.replace('https://pub.fsgo365.cn/', '');
        });
      });
      // 私域流量锁定
      // shareType 分享类型：0无，1运营商，2直营门店，3服务商，4推广大使(user)，99小微
      // shareTypeId 分享类型id（对应shareType的实体id）：shareType=1/2/3/99时为partnerId，4时为userId
      if (res.user.shareType == 1) {
        // 运营商报单码
        // if (res.user.shareTypeId) {
        //   wx.setStorageSync('shareParams', {
        //     type: 'bd',
        //     partnerId: res.user.shareTypeId
        //   });
        // }
      } else if (res.user.shareType == 2 || res.user.shareType == 3) {
        if (res.user.shareTypeId) {
          wx.setStorageSync('shareParams', {
            type: 'tg',
            partnerId: res.user.shareTypeId
          });
        }
      } else if (res.user.shareType == 99) {
        if (res.user.shareTypeId) {
          wx.setStorageSync('shareParams', {
            type: 'tgx',
            partnerId: res.user.shareTypeId
          });
        }
      }

      // 获取缓存信息
      if (wx.getStorageSync('shareParams')) {
        let shareParams = wx.getStorageSync('shareParams');
        // 扫码或分享进入门店首页，锁定，不允许返回首页，直接跳转门店详情页
        if (shareParams.type == 'tg' || shareParams.type == 'tgx') {
          common.osg.open(
            '../store/storeDetail',
            {
              type: shareParams.type,
              partnerId: shareParams.partnerId
            },
            {
              mode: 'redirect'
            }
          );
        } else {
          this.show = true;
        }
      } else {
        this.show = true;
      }
    });
    // }
  }
};
</script>

<style lang="scss">
page {
  font-size: 14px;
  background: #ffffff;
}

.bg_hover {
  background: rgb(211, 210, 210) !important;
}

#nav.fix {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* height: 170rpx; */
  z-index: 50;
}

.nav-seat {
  height: 170rpx;
}

.navigation {
  background: #fff;
  padding: 0 20rpx;
  /* margin-top: 110rpx; 隐藏了搜索框 */
  margin-top: 20rpx;
}

.topBg {
  background: #fff;
  padding: 0 20rpx;
}

.navigation .search {
  position: absolute;
  bottom: 13rpx;
  left: 20rpx;
}

.navigation input {
  height: 54rpx;
  border: 1px solid #f8f8f8;
  border-radius: 55rpx;
  background: #f8f8f8;
  padding: 0 30rpx;
  padding-left: 65rpx;
  font-size: 28rpx;
}

.bannerImg {
  width: 100%;
}

.funcItemLeft {
  width: 10%;
}

.funcItemCont {
  width: 70%;
  margin-left: 2%;
}

.funcItemRight {
  width: 15%;
}

.funcItemRightImg {
  width: 50%;
}

.funcItem {
  padding: 20rpx 0;
}

.funcItemBotLeftLeft,
.funcItemBotRightLeft {
  width: 20%;
}

.funcItemBotLeftRight,
.funcItemBotRightRight {
  width: 70%;
}

image {
  max-width: 100%;
  display: inline-block;
  position: relative;
  z-index: 0;
}

.c-w-half {
  width: 50%;
}

.van-search {
  padding: 0;
}

.mnyTitle {
  padding: 20rpx;
}

.mnyCont {
  width: 95%;
  margin: 20rpx auto;
  border-radius: 10rpx;
  background: #fafbfd;
}

.col-cf5 {
  background: #f5f5f5;
}
.fcol-cf5 {
  // color: #959595;
  color: #676767;
}
.mnyContTitle {
  padding: 20rpx;
}

.c-padul-20 {
  padding: 20rpx 0;
}

.mnyContItemType {
  width: 20%;
}

.mnyContItemCont {
  width: 70%;
}

.mnyMore {
  width: 50%;
  margin: 20rpx auto;
  border-radius: 50rpx;
  padding: 10rpx;
  text-align: center;
}

.mnyContItemContOneL {
}

.mnyContItemContOneR {
}

.custRepHead {
  padding: 20rpx;
}

.custRepContItem {
  background: #fff;
  margin-left: 10px;
  width: 65%;
  padding: 30rpx;
}

.custImgWrap {
  /* width: 30%; */
  width: 30%;
}
.custImg {
  border-radius: 50%;
}
.custRepCont {
}

.custOtherInfo {
  width: 66%;
}

.custRepImgOne {
  width: 30%;
}

.scroll-view_H {
  white-space: nowrap;
}

.scroll-view-item {
  height: 200rpx;
}

.scroll-view-item_H {
  display: inline-block;
}
.custRepTagOne {
  border: 1px solid #bfbfbf;
  border-radius: 10%;
  padding: 5rpx 10rpx;
  margin: 20rpx 20rpx 10rpx 0;
}
.custRepImgWrapContDetail {
  margin: 20rpx 0;
}
.comProblemItemL {
  width: 15%;
}
.comProblemItemR {
}
.problemItemRAns {
  /* height: 100rpx; */
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  /* -webkit-line-clamp: 4; */
  color: #9b9b9b;
}
.comProblemCont {
  width: 90%;
  margin: 40rpx auto 0;
}
.comProblemItemL {
  background: Red;
  width: 20px;
  height: 20px;
  color: #fff;
  margin-right: 15px;
  padding: 6rpx;
}
.problemItemRTitle {
  margin-bottom: 10px;
}
.faq-item {
  padding: 0 3vw 3vw;
  > view {
    display: flex;
  }
}

.lineBtn {
  font-size: 14px;
  color: #676767;
  height: 20px;
  line-height: 20px;
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
</style>
