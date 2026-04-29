<template>
  <view class="good">
    <swiper
      v-if="data.images.length > 0"
      :autoplay="false"
      :interval="4000"
      :duration="500"
      :style="'height:' + systemInfo.windowWidth + 'px'"
      circular
      indicator-dots
      indicator-active-color="#fff"
    >
      <swiper-item v-for="(item, i) in data.images" :key="i">
        <video
          v-if="['mp4', 'MP4'].indexOf(item.name.split('.')[1]) != -1"
          class="c-video"
          id="video"
          :src="item.url"
          show-center-play-btn
          :autoplay="false"
          :controls="true"
          bindplay="play"
          bindpause="pause"
          bindended="ended"
          :style="'height:' + systemInfo.windowWidth + 'px'"
        ></video>
        <image
          v-else
          :src="item.url"
          style="width: 100vw; display: flex; margin: 0 auto"
          :style="'height:' + systemInfo.windowWidth + 'px'"
          mode="aspectFill"
        />
      </swiper-item>
    </swiper>
    <view class="info">
      <view>
        <text class="title">{{ data.name }}</text>
        <text class="subtitle">{{ data.exts.applicableArea || '' }}</text>
      </view>
      <view class="info-contain">
        <view v-if="data.exts.contain" class="info-contain-in">
          <view style="margin-right: 10px; width: 30%; white-space: nowrap">包含项</view>
          <view class="info-contain-in-block">
            <view
              v-for="(itemIn, i) in data.exts.contain"
              :key="i"
              class="c-flex c-item-center"
              style="white-space: nowrap"
            >
              <image
                src="https://pub.fsgo365.cn/jishi/include.png"
                mode="widthFix"
                style="width: 11px; margin-right: 2px"
              />
              {{ codelabel('wareItem', itemIn) }}
            </view>
          </view>
        </view>
        <view v-if="data.exts.unContain" class="info-contain-un">
          <view style="margin-right: 10px; width: 30%; white-space: nowrap">不包含</view>
          <view class="info-contain-in-block">
            <view
              v-for="(itemUn, i) in data.exts.unContain"
              :key="i"
              class="c-flex c-item-center"
              style="white-space: nowrap"
            >
              <image
                src="https://pub.fsgo365.cn/jishi/notInclude.png"
                mode="widthFix"
                style="width: 11px; height: 11px; margin-right: 2px"
              />
              {{ codelabel('wareItem', itemUn) }}
            </view>
          </view>
        </view>
      </view>
      <view class="c-size-12">
        <view class="c-flex" style="line-height: 20px; margin: 10px 0 8px">
          <view class="c-flex c-item-center c-m-r-30">
            <image
              src="https://pub.fsgo365.cn/jishi/ware-list.png"
              mode="widthFix"
              style="width: 11px; margin-right: 5px"
            />
            <text>套餐配置清单</text>
          </view>
          <view
            class="c-flex-1 c-flex c-item-center c-flex-between"
            @click="alert(data.exts.list, '套餐配置清单')"
          >
            <text style="color: #8f8f8f">只选国标材料，均可出具质保</text>
            <uni-icons type="right" color="#8f8f8f" size="12"></uni-icons>
          </view>
        </view>
        <view class="c-flex" style="line-height: 20px">
          <view class="c-flex c-item-center c-m-r-30">
            <image
              src="https://pub.fsgo365.cn/jishi/commitment.png"
              mode="widthFix"
              style="width: 10px; margin-right: 5px"
            />
            <text>吉柿修房承诺</text>
          </view>
          <view
            class="c-flex-1 c-flex c-item-center c-flex-between"
            @click="alert(data.exts.commitment, '吉柿修房承诺')"
          >
            <text style="color: #8f8f8f">无恶意增项、材料包真、服务准时</text>
            <uni-icons type="right" color="#8f8f8f" size="12"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    <view class="content">
      <view v-if="caseLibrary.length > 0" class="case" style="margin-bottom: 10px">
        <view class="c-flex c-item-center c-flex-between">
          <text>真实案例</text>
          <view>
            <text class="c-size-12 c-color-value" @click="open('/subpackages/case/cases')">
              查看更多
            </text>
            <uni-icons type="right" color="#969799" size="12"></uni-icons>
          </view>
        </view>
        <view class="c-flex" style="gap: 10px; margin-top: 10px">
          <view class="c-flex-2" style="height: 140px; border-radius: 8px; overflow: hidden">
            <image
              :src="caseLibrary[0].exts.image[0] && caseLibrary[0].exts.image[0].url"
              mode="aspectFill"
              style="width: 100%; height: 140px"
            ></image>
          </view>
          <view
            v-if="caseLibrary.length > 1"
            class="c-flex-1 c-flex c-flex-col c-w-100"
            style="gap: 10px"
          >
            <view class="c-flex-1" style="border-radius: 8px; overflow: hidden">
              <image
                :src="caseLibrary[1].exts.image[0] && caseLibrary[1].exts.image[0].url"
                mode="aspectFill"
                style="width: 100%"
                :style="caseLibrary.length > 2 ? 'height: 65px' : 'height: 140px'"
              ></image>
            </view>
            <view
              v-if="caseLibrary.length > 2"
              class="c-flex-1"
              style="border-radius: 8px; overflow: hidden"
            >
              <image
                :src="caseLibrary[2].exts.image[0] && caseLibrary[2].exts.image[0].url"
                mode="aspectFill"
                style="width: 100%; height: 65px"
              ></image>
            </view>
          </view>
        </view>
      </view>
      <view>
        <view class="c-uni-tabs">
          <view
            class="c-uni-tab"
            :class="activeTab == 'section1' ? 'c-uni-tab-active' : ''"
            @click="pageScrollTo('section1')"
          >
            常见问题
            <view
              v-if="activeTab == 'section1'"
              class="c-uni-tabs-line"
              style="background-color: #ffd700"
            ></view>
          </view>
          <view
            class="c-uni-tab"
            :class="activeTab == 'section3' ? 'c-uni-tab-active' : ''"
            @click="pageScrollTo('section3')"
          >
            服务内容
            <view
              v-if="activeTab == 'section3'"
              class="c-uni-tabs-line"
              style="background-color: #ffd700"
            ></view>
          </view>
        </view>
        <view class="questions" id="section1">
          <view class="c-flex c-flex-items-center c-flex-between questions-top">
            <view class="c-flex c-flex-items-center">
              <image
                src="https://pub.fsgo365.cn/jishi/problem.png"
                mode="widthFix"
                class="c-flex"
                style="width: 11px"
              ></image>
              <text style="margin-left: 5px">常见问题</text>
            </view>
          </view>
          <view v-for="(item, i) in data.exts.qa" class="question">
            <view class="q">
              <view class="icon">
                <image
                  src="https://pub.fsgo365.cn/jishi/question.png"
                  style="width: 18px; height: 18px; display: flex"
                />
                <text>问</text>
              </view>
              <text>{{ item.q }}</text>
            </view>
            <view class="a">
              <view class="icon">
                <image
                  src="https://pub.fsgo365.cn/jishi/answer.png"
                  style="width: 18px; height: 18px; display: flex"
                />
                <text>答</text>
              </view>
              <text>{{ item.a }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view id="section3" v-if="data.exts.imagesDetail && data.exts.imagesDetail.length > 0">
      <image
        v-for="(item, i) in data.exts.imagesDetail"
        :key="i"
        :src="item.url"
        style="width: 100%; display: flex"
        mode="widthFix"
      />
    </view>
    <view class="button-bottom">
      <view class="button-h" @click="open('/pages/declaration/declaration')">
        <image src="/static/images/icon/yuyue.png" mode="widthFix"></image>
        <text>免费预约</text>
      </view>
      <view class="button-h" @click="makePhoneCall('4007001918')">
        <image src="/static/images/icon/dianhua.png" mode="widthFix" style="width: 18px"></image>
        <text>电话咨询</text>
      </view>
      <view class="button-v">
        <image src="/static/images/icon/zaixiankefu.png" mode="widthFix"></image>
        <text>在线客服</text>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
var areajs = require('../../common/area.js');
export default {
  data() {
    return {
      id: '',
      systemInfo: {
        menuButtonObject: {}
      },
      activityType: '',
      promoterId: '',
      partnerId: '',
      data: { images: [], exts: { imagesDetail: [] } },
      areaList: Object.assign({}, areajs.default),
      address: {},
      contactNumber: '',
      wares: [],
      loadType: '',
      caseLibrary: [],
      options: {
        cascadeCode_parts: { codeId: 'parts' },
        cascadeCode_UNIT: { codeId: 'UNIT' },
        codecfg_wareItem: { codeId: 'wareItem' }
      },
      activeTab: 'section1'
    };
  },
  onLoad(params) {
    // 获取系统信息
    this.systemInfo = app.globalData.systemInfo;
    this.loadType = 'onLoad';

    // 扫二维码进入
    if (params.q) {
      // 解析链接携带参数
      var url = decodeURIComponent(params.q);
      if (url.indexOf('?') != -1) {
        let str = url.split('?')[1];
        if (str) {
          let arr = str.split('&');
          if (arr) {
            let obj = {};
            for (let item of arr) {
              obj[item.split('=')[0]] = item.split('=')[1];
            }
            params = obj;
          }
        }
      }
      this.params = params;
    } else {
      this.params = params;
    }
    common.osg.init(this, this.params, app);
    console.log('good-params', params);

    // 静默登录
    common.osg.doLogin(
      {
        shareType: this.params.shareType || '1', //运营商
        shareTypeId: this.params.shareTypeId || this.params.partnerId, //运营商id
        shareUserId: this.params.shareUserId || '',
        channelId: this.params.channelId || '', //运营商报单码渠道
        allotOrgId: this.params.allotOrgId
      },
      () => {
        if (this.params.id) {
          this.id = this.params.id;
          this.getData();
        } else if (this.params.activityType) {
          this.activityType = this.params.activityType;
          this.getActivityData();
        }
        this.getWares();
        // 推广大使id
        this.promoterId = this.params.promoterId || '';
        // 如果是从门店详情页进入
        this.partnerId = this.params.partnerId || '';
        this.contactNumber = wx.getStorageSync('contactNumber');

        // 获取地址
        let address = wx.getStorageSync('address');
        if (address) {
          this.address = address;
          wx.removeStorageSync('address');
        } else {
          this.getAddress();
        }
      }
    );
    common.osg.codeoption(() => {});
  },
  // 设置转发内容
  onShareAppMessage() {
    return {
      title: this.data.name,
      path: `/subpackages/good/good?id=${this.params.id || ''}&activityType=${
        this.params.activityType || ''
      }`
    };
  },
  // 设置分享朋友圈内容
  onShareTimeline() {
    return {
      title: this.data.name,
      query: ''
    };
  },
  onShow() {
    // 避免重复执行
    if (this.loadType == 'onLoad') {
      this.loadType = '';
      return;
    }
    let address = wx.getStorageSync('address');
    if (address) {
      this.address = address;
      wx.removeStorageSync('address');
    } else {
      this.getAddress();
    }
  },
  methods: {
    open(path, data, options) {
      common.osg.open(path, data, options);
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    goodsClick(e) {
      console.log('goodsClick', e);
      if (e.index == 0) {
        this.open('../message/messages');
      } else if (e.index == 1) {
        this.makeCall(this.contactNumber);
      } else if (e.index == 2) {
        this.chatEntry();
      }
    },
    declaration() {
      wx.setStorageSync('declarationParams', {
        waresId: this.id,
        promoterId: this.promoterId,
        partnerId: this.partnerId
      });
      common.osg.open('../../pages/declaration/declaration', {}, { mode: 'switchTab' });
    },
    getData() {
      common.osg.ajax('/wares/findById.do', { id: this.id }, res => {
        this.data = res.data;
        common.osg.md({ act: '查看商品', name: res.data.name });
        common.osg.codeoption(() => {
          this.getCaseLibrary();
        });
      });
    },
    getActivityData() {
      common.osg.ajax(
        '/wares/query.do',
        { 'in:exts.activityType|array#and': this.activityType },
        res => {
          this.data = res.data[0] || {};
        }
      );
    },
    getAddress() {
      common.osg.ajax(
        'basic/address/query',
        {
          _all: '1',
          userId: wx.getStorageSync('user')._id,
          'is:state|integer#and': 1,
          sortField: 'isDefault',
          sortOrder: 'desc'
        },
        res => {
          this.address = res.data[0] || {};
        }
      );
    },
    previewImage(url, urls) {
      wx.previewImage({
        current: url,
        urls: urls
      });
    },
    pageScrollTo(activeTab) {
      this.activeTab = activeTab;
      common.osg.pageScrollTo(activeTab);
    },
    // 查询C端服务商品
    getWares() {
      common.osg.ajax(
        '/wares/query',
        {
          page: 1,
          rows: 4,
          'in:state|integer#and': 1,
          'ne:_id|string#and': this.id,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.wares = res.data;
        }
      );
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    // 发起聊天
    chatEntry() {
      common.osg.ajax('chatMessage/entry', {}, res => {
        common.osg.open('/subpackages/message/message', {
          relationId: res.data._id,
          sendUserName: '平台客服'
        });
      });
    },
    getCaseLibrary() {
      common.osg.ajax(
        '/basic/caseLibrary/query',
        {
          _all: '1',
          'is:exts.wareId|string#and': this.id,
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.caseLibrary = res.data;
        },
        {
          noload: true
        }
      );
    },
    alert(msg, title) {
      if (msg) {
        common.osg.alert(msg, null, title);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.good {
  padding-bottom: env(safe-area-inset-bottom);
  .c-video {
    width: 100vw;
    height: 100%;
  }
  .c-uni-tab-active {
    color: #ff5400;
  }

  .activity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(90deg, #f75429 0%, #eb2b1e 100%);
    color: #fff;
    padding: 10px 15px 10px 25px;
    .activity-left {
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      .text {
        margin-right: 7px;
      }
      .price {
        font-size: 28px;
        font-style: normal;
        font-weight: 500;
      }
    }
    .activity-right {
      .text-top {
        font-size: 14px;
        font-weight: 600;
      }
      .text-bottom {
        font-size: 12px;
        display: flex;
        justify-content: flex-end;
        > text {
          margin-left: 5px;
        }
      }
      .group {
        width: 120px;
        height: 25px;
        position: relative;
        border-radius: 50px;
        background: rgba(255, 255, 255, 0.3);
        .group-image {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 1px solid #fff;
          display: flex;
          position: absolute;
          box-sizing: border-box;
        }
        .group-text {
          margin-left: 70px;
          font-size: 12px;
          line-height: 25px;
        }
      }
    }
  }
  .c-flex {
    display: flex;
  }
  .c-flex-items-center {
    align-items: center;
  }
  .c-flex-between {
    justify-content: space-between;
  }
  .c-flex-wrap {
    flex-wrap: wrap;
  }
  .info {
    padding: 25px 25px 12px;
    .price {
      font-size: 24px;
      font-weight: 700;
      line-height: 32px;
    }
    .button {
      margin-left: 20px;
      padding: 3px 10px;
      background: #ff6900;
      color: #fff;
      border-radius: 50px;
      font-size: 12px;
      line-height: 20px;
    }
    .title {
      font-size: 24px;
      line-height: 26px;
      font-weight: 600;
    }
    .subtitle {
      font-size: 18px;
    }
    .tool {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 0;
      border-bottom: 1px solid #e3e7ec;
      > view {
        display: flex;
        align-items: center;
        > text {
          margin-left: 8px;
          font-size: 12px;
          line-height: 20px;
        }
      }
    }
    .guarantee {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 13px 0 0;
      color: #736e6e;
      font-size: 12px;
      line-height: 22px;
    }
    .location {
      display: flex;
      justify-content: space-between;
      // border-bottom: 1px solid #e3e7ec;
      // padding-bottom: 15px;
      // margin-bottom: 15px;
      .address {
        display: flex;
        align-items: center;
        .text {
          font-size: 14px;
          margin-left: 5px;
        }
      }
      .remind {
        display: flex;
        align-items: center;
        margin-left: 20px;
        .text {
          color: #736e6e;
          font-size: 12px;
        }
      }
    }
    .datetime {
      display: flex;
      justify-content: space-between;
      > view {
        > view {
          .text {
            font-size: 14px;
            margin-left: 5px;
          }
        }
      }
    }
    .info-contain {
      font-size: 12px;
      margin-top: 10px;
      border-top: 1px solid #e3e7ec;
      border-bottom: 1px solid #e3e7ec;
      padding: 10px 0;

      .info-contain-in {
        display: flex;
        margin-bottom: 10px;
      }
      .info-contain-un {
        display: flex;
      }
      .info-contain-in-block {
        display: grid;
        grid-template-columns: repeat(3, 30%);
        grid-column-gap: 15px;
        grid-row-gap: 10px;
        color: #736e6e;
        width: 100vh;
      }
    }
  }
  .content {
    padding: 8px;
    background: #efefef;
    .case {
      padding: 16px;
      image {
        display: flex;
      }
    }
    > view {
      border-radius: 6px;
      overflow: hidden;
      background: #fff;
      .questions {
        padding: 20px;
        .questions-top {
          font-size: 14px;
        }
        .question {
          margin-top: 15px;
          .q {
            display: flex;
            align-items: flex-start;
            > text {
              color: #000;
              font-size: 12px;
              line-height: 22px;
              margin-left: 10px;
            }
          }
          .a {
            display: flex;
            align-items: flex-start;
            margin-top: 6px;
            > text {
              font-size: 10px;
              font-style: normal;
              line-height: 15px;
              margin-left: 10px;
            }
          }
          .icon {
            width: 18px;
            height: 18px;
            position: relative;
            margin-top: 3px;
            > text {
              color: #fff;
              font-size: 10px;
              font-weight: 600;
              position: absolute;
              top: 0px;
              left: 4px;
              z-index: 1;
            }
          }
        }
      }
    }
  }
  .services {
    padding: 25px 25px 100px;
  }
  .good ::v-deep .van-goods-action {
    z-index: 1;
    padding: 20px;
  }
  .good ::v-deep .c-goods-action-button-red {
    color: #fff !important;
    background: linear-gradient(90deg, #f75429 0%, #eb2b1e 100%) !important;
  }
  .good ::v-deep .c-goods-action-button {
    color: #000 !important;
  }
  .more {
    display: flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 2px;
    font-size: 14px;
    color: #8f8f8f;
    background: #efefef;
    margin: 15px;
  }

  #section3 {
    margin-bottom: 42px;
  }

  .button-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: #fff;
    display: flex;
    align-items: center;
    border-top: 1px solid #d9d9d9;
    padding-top: 10px;
    padding-bottom: env(safe-area-inset-bottom);
    .button-h {
      flex: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ff6900;
      border-radius: 12px;
      height: 42px;
      margin-left: 12px;
      image {
        width: 20px;
        margin-right: 10px;
      }
      text {
        color: #fff;
        font-size: 14px;
      }
    }
    .button-v {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 42px;
      margin: 0 12px;
      image {
        width: 18px;
      }
      text {
        font-size: 10px;
        color: #736e6e;
        margin-top: 3px;
      }
    }
  }
}
</style>
