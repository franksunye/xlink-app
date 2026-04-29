<template>
  <scroll-view
    scroll-y="true"
    :scroll-into-view="scrollToId"
    scroll-into-view-offset="-60"
    scroll-with-animation
    class="case"
    @scroll="onScroll"
  >
    <image
      v-if="data.exts.image && data.exts.image.length > 0"
      :src="data.exts.image[0].url"
      mode="widthFix"
      class="c-flex c-w-1"
    ></image>
    <view>
      <view class="slogan">
        <image src="https://pub.fsgo365.cn/jishi/logo-54.png" mode="widthFix"></image>
        <text>漏水找吉柿 省心又省事</text>
      </view>
      <view class="info">
        <view class="top">
          <view>
            <text>部位</text>
            <text>{{ formatRepairParts(data.repairParts, 0) }}</text>
          </view>
          <view>
            <text>类型</text>
            <text>{{ formatRepairParts(data.repairParts, 1) }}</text>
          </view>
          <view>
            <text>维修工期</text>
            <text>{{ data.exts.constructionPeriod }}</text>
          </view>
        </view>
        <view class="center">
          <view class="c-size-24 c-bold">X5升级版-节能降温套餐</view>
          <view class="c-flex c-item-center c-m-t-10 c-m-b-20">
            <view class="c-flex-1 c-flex c-item-center">
              <image
                src="https://pub.fsgo365.cn/jishi/location3.png"
                mode="widthFix"
                style="width: 11px; margin-right: 5px; display: flex"
              ></image>
              <text class="c-size-12 c-gray-7">{{ data.exts.address }}</text>
            </view>
            <text class="c-flex-1 c-size-12 c-gray-7">维修于{{ data.exts.repairTime }}</text>
          </view>
          <view v-if="data.exts.tags && data.exts.tags.length > 0" class="tags">
            <view v-for="(item, i) in data.exts.tags" :key="i" class="tag-view">
              <view class="tag">{{ formatTag(item) }}</view>
            </view>
          </view>
        </view>
        <view class="bottom">
          <view>
            <text>技术工程师：{{ data.exts.serviceResourceIdLabel }}</text>
          </view>
          <view @click="open()">
            <text>算算我的维修报价</text>
            <uni-icons type="right" color="#9e9e9e" size="16"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    <view class="content" id="tab1">
      <view class="tabs" :class="{ sticky: isStickyActive }" id="stickyTabs">
        <view :class="activeTab == 'tab1' ? 'tab-active tab' : 'tab'" @click="tabClick('tab1')">
          渗漏原因
        </view>
        <view :class="activeTab == 'tab2' ? 'tab-active tab' : 'tab'" @click="tabClick('tab2')">
          维修方案
        </view>
        <view :class="activeTab == 'tab3' ? 'tab-active tab' : 'tab'" @click="tabClick('tab3')">
          过程结果
        </view>
      </view>
      <view v-if="data.exts.image1 && data.exts.image1.length > 0">
        <view style="margin-left: 20px">漏水原因分析</view>
        <image :src="data.exts.image1[0].url" mode="widthFix" style="width: 100%"></image>
      </view>
    </view>
    <view v-if="data.exts.image2 && data.exts.image2.length > 0" class="content" id="tab2">
      <view style="margin-left: 20px; margin-top: 8px">维修治理措施</view>
      <image :src="data.exts.image2[0].url" mode="widthFix" style="width: 100%"></image>
    </view>
    <view
      v-if="data.exts.image3 && data.exts.image3.length > 0"
      class="content"
      id="tab3"
      style="margin-bottom: 12px"
    >
      <view style="margin-left: 20px; margin-top: 8px">维修施工过程</view>
      <image :src="data.exts.image3[0].url" mode="widthFix" style="width: 100%"></image>
    </view>
    <view class="bottom-view"></view>
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
  </scroll-view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      id: '',
      data: { exts: {} },
      activeTab: 'tab1',
      isStickyActive: false,
      stickyTabsTop: 0,
      isScrolling: false,
      scrollTimer: null,
      options: {
        caseLocation: [],
        cascadeCode_caseLocation: { codeId: 'caseLocation' },
        codecfg_caseTag: { codeId: 'caseTag' }
      },
      scrollToId: ''
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.id = params.id;
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    getData() {
      common.osg.ajax(
        'basic/caseLibrary/findById.do',
        {
          id: this.id
        },
        res => {
          this.data = res.data;
          this.loaded = true;
          // 在下一帧 DOM 更新后计算位置
          this.$nextTick(() => {
            this.getStickyTabsTop();
          });
        },
        {
          noload: true
        }
      );
    },
    getStickyTabsTop() {
      // 计算 sticky tabs 的初始位置（相对于 scroll-view 内的滚动坐标）
      const query = uni.createSelectorQuery().in(this);
      query.selectViewport().scrollOffset();
      query.select('#stickyTabs').boundingClientRect();
      query.exec(res => {
        // res[0] 是 selectViewport().scrollOffset() 的结果
        // res[1] 是 select('#stickyTabs').boundingClientRect() 的结果
        if (res && res[1]) {
          const rect = res[1];
          // rect.top 是 tabs 相对于视口的距离
          // 由于 tabs 在 .content 内，且 .content 有 padding: 12px，margin: 12px
          // 我们需要的是 tabs 的绝对位置
          this.stickyTabsTop = rect.top || 0;
          console.log('stickyTabsTop calculated:', this.stickyTabsTop);
        }
      });
    },
    tabClick(type) {
      this.activeTab = type;

      // 开始滚动动画，冻结 sticky 状态避免闪烁
      this.isScrolling = true;
      this.scrollToId = type;

      // 清除之前的定时器
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }

      // 等待滚动动画完成后，恢复 sticky 逻辑
      this.scrollTimer = setTimeout(() => {
        this.scrollToId = '';
        this.isScrolling = false;
        // 不重新计算位置，让 onScroll 在下次滚动时自动更新
      }, 500);
    },
    formatRepairParts(value, index) {
      let str = common.osg.codelabelCascade('caseLocation', value);
      return str && str.split(' / ')[index];
    },
    formatTag(value) {
      return common.osg.codelabel('caseTag', value);
    },
    onScroll(e) {
      const scrollTop = e && e.detail ? e.detail.scrollTop : 0;

      // 首次滚动时如果还没计算过位置，则计算一次
      if (!this.stickyTabsTop && scrollTop > 0) {
        this.getStickyTabsTop();
      }

      // 滚动动画期间不更新 sticky 状态，避免闪烁
      if (this.isScrolling) {
        return;
      }

      // 当滚动距离超过 tabs 初始位置时激活吸顶
      // tabs.top 是相对于视口的距离，当 scrollTop >= tabs.top 时，tabs 会到达视口顶部
      if (this.stickyTabsTop > 0) {
        this.isStickyActive = scrollTop >= this.stickyTabsTop - 12;
      }
    },
    makePhoneCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.case {
  height: 100vh;
  overflow-y: auto;
  background-color: #f5f5f5;
  .slogan {
    text-align: center;
    position: relative;
    padding: 12px;
    height: 80px;
    border-radius: 12px;
    background-color: #ff6900;
    margin: -64px 12px 0 12px;
    box-sizing: border-box;
    image {
      position: absolute;
      left: 16px;
      display: flex;
      width: 27px;
      height: 27px;
    }
    text {
      color: #ffffff;
      font-size: 16px;
      font-weight: 500;
      line-height: 27px;
    }
  }
  .info {
    margin: -30px 12px 12px;
    padding: 12px;
    background: #ffffff;
    z-index: 1;
    position: relative;
    border-radius: 12px;
    .top {
      display: flex;
      > view {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 30px;
        text {
          &:first-child {
            font-size: 12px;
            color: #646566;
          }
          &:last-child {
            font-size: 14px;
            color: #323233;
            font-weight: 600;
          }
        }
      }
    }
    .center {
      margin: 10px 0;
      padding: 10px 0;
      border-top: 1px solid #e3e7ec;
      border-bottom: 1px solid #e3e7ec;
      .tags {
        display: flex;
        flex-wrap: wrap;
        row-gap: 10px;
        .tag-view {
          width: calc((100vw - 48px) / 3);
          display: flex;
          justify-content: center;
          .tag {
            width: 83px;
            height: 22px;
            line-height: 22px;
            border-radius: 11px;
            background-color: #fcde75;
            text-align: center;
            font-size: 12px;
            font-weight: 500;
            color: #646566;
          }
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      > view {
        flex: 1;
        text {
          font-size: 14px;
          font-weight: 500;
        }
        &:first-child {
          text-align: center;
        }
        &:last-child {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
  }
  .content {
    background-color: #ffffff;
    border-radius: 12px;
    margin: 12px;
    padding: 12px;
    overflow-y: auto;
    .tabs {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 12px;
      position: relative;
      padding: 10px 12px;
      min-height: 44px;
      box-sizing: border-box;
      background-color: #ffffff;
      transition: all 0.3s ease;
      &.sticky {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
        margin: 0;
      }
      .tab {
        font-weight: 500;
      }
      .tab-active {
        color: #ff6900;
        font-weight: 600;
        &::after {
          content: '';
          display: block;
          width: 50%;
          height: 2px;
          background-color: #ff6900;
          margin: 4px auto 0 auto;
          border-radius: 1px;
        }
      }
    }
  }
  .bottom-view {
    height: 52px;
    padding-bottom: env(safe-area-inset-bottom);
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
