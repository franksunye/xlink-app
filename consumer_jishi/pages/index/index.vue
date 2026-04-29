<template>
  <view class="index">
    <image src="https://pub.fsgo365.cn/jishi/banner.png" mode="widthFix" class="c-w-1"></image>
    <view class="logo-view">
      <image src="https://pub.fsgo365.cn/jishi/logo.png" mode="widthFix"></image>
      <text>漏水找吉柿，省心又省事！</text>
    </view>
    <view class="parts">
      <block v-for="(item, i) in options.classifications" :key="i">
        <view v-if="i < 5" @click="partClick(item._id)" class="part">
          <image
            :src="item.imageUrl"
            mode="widthFix"
            :style="'width:' + (item.exts.width || '24') + 'px'"
          ></image>
          <text>{{ item.name }}</text>
        </view>
      </block>
    </view>
    <view class="content">
      <image
        src="https://pub.fsgo365.cn/jishi/yuyue.png"
        mode="widthFix"
        @click="open('/pages/declaration/declaration')"
      ></image>
      <image
        src="https://pub.fsgo365.cn/jishi/lianxi.png"
        mode="widthFix"
        @click="makePhoneCall('4007001918')"
      ></image>
    </view>
    <view class="kefu">
      <view class="title">自助查询</view>
      <image src="https://pub.fsgo365.cn/jishi/kefu.png" mode="heightFix"></image>
    </view>
    <view class="c-grid-box">
      <view class="c-grid-view">
        <uni-grid :column="4" :show-border="false" @change="gridChange">
          <uni-grid-item v-for="(item, index) in grid" :index="index" :key="index">
            <view class="c-grid-item-box" style="background-color: #fff" :showBorder="false">
              <image :src="item.url" class="image" mode="widthFix" :style="'width:' + item.width" />
              <text>{{ item.text }}</text>
            </view>
          </uni-grid-item>
        </uni-grid>
      </view>
    </view>
    <view class="logo-bottom">
      <image src="https://pub.fsgo365.cn/jishi/logo-gray.png" mode="widthFix"></image>
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
      options: {
        classifications: []
      },
      grid: [
        {
          url: 'https://pub.fsgo365.cn/jishi/youhuikaquan.png',
          path: '/subpackages/coupon/my',
          text: '优惠卡券',
          width: '25px'
        },
        {
          url: 'https://pub.fsgo365.cn/jishi/zhenshianli.png',
          path: '/subpackages/case/cases',
          text: '真实案例',
          width: '26px'
        },
        {
          url: 'https://pub.fsgo365.cn/jishi/zhibaopingzheng.png',
          path: '/subpackages/warranty/warranties',
          text: '质保凭证',
          width: '20px'
        },
        {
          url: 'https://pub.fsgo365.cn/jishi/fenxiangtixian.png',
          path: '/subpackages/income/withdrawalDetails',
          text: '分享提现',
          width: '25px'
        },
        {
          url: 'https://pub.fsgo365.cn/jishi/weixiugujia.png',
          path: '/subpackages/quotationCalculator/quotationCalculator',
          text: '维修估价',
          width: '26px'
        },
        {
          url: 'https://pub.fsgo365.cn/jishi/renyuanyanzheng.png',
          path: '/subpackages/certification/certification',
          text: '人员验证',
          width: '27px'
        },
        {
          url: 'https://pub.fsgo365.cn/jishi/fuwujindu.png',
          path: '/subpackages/serviceAppointment/serviceAppointmentDetail',
          text: '服务进度',
          width: '27px'
        }
        // {
        //   url: 'https://pub.fsgo365.cn/jishi/xianxiamendian.png',
        //   path: '/subpackages/serviceStore/serviceStores',
        //   text: '线下门店',
        //   width: '22px'
        // }
      ],
      sa: {}
    };
  },
  onLoad(params) {
    this.params = params;
    common.osg.init(this, this.params, app);
    if (params.act == 'ykyq') {
      common.osg.md({ act: 'ykyq_' + this.$mp.page.route });
    }

    // 静默登录
    common.osg.doLogin(
      {
        shareType: this.params.shareType,
        shareTypeId: this.params.shareTypeId,
        allotOrgId: this.params.allotOrgId,
        shareUserId: this.params.shareUserId,
        channelId: this.params.channelId,
        tenantId: '4670873342363649607'
      },
      res => {
        this.phone = wx.getStorageSync('user').phone;
        this.getClassifications();
        this.getServiceAppointments();
        common.osg.codeoption();
      }
    );
  },
  // 设置转发内容
  onShareAppMessage() {
    return {
      title: '吉柿修房',
      path: '/pages/index/index'
    };
  },
  // 设置分享朋友圈内容
  onShareTimeline() {
    return {
      title: '吉柿修房',
      query: ''
    };
  },
  methods: {
    openCustomerServiceChat() {
      wx.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfcf989046233f2979c' },
        corpId: 'ww9da5be52fcf5b613',
        success(res) {
          console.log('openCustomerServiceChat success', res);
        },
        fail(res) {
          console.log('openCustomerServiceChat fail', res);
        }
      });
    },
    open(path, data, options) {
      common.osg.open(path, data, options);
    },
    getClassifications() {
      common.osg.ajax(
        'wares/queryClassify.do',
        {
          page: 1,
          rows: 4,
          parentId: '16584636204531009545', // C端小程序部位
          'is:state|integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          this.options.classifications = res.data;
        }
      );
    },
    partClick(id) {
      wx.setStorageSync('classificationId', id);
      common.osg.open('../classification/classification', { id });
    },
    makePhoneCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    gridChange(e) {
      let path = this.grid[e.detail.index].path;
      if (path == '/subpackages/serviceAppointment/serviceAppointmentDetail') {
        if (this.sa._id) {
          this.open(path, { id: this.sa._id });
        } else {
          common.osg.toast('当前没有进行中的工单', 'none');
          return;
        }
      } else {
        this.open(path);
      }
    },
    // 查询最新工单
    getServiceAppointments() {
      common.osg.ajax(
        'basic/serviceAppointment/query',
        {
          page: 1,
          rows: 1,
          sortField: 'updateTime',
          sortOrder: 'desc'
        },
        res => {
          this.sa = res.data[0] || { exts: {} };
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.index {
  height: 100vh;
  overflow-y: auto;
  background-color: #f7f7f7;
  .logo-view {
    position: absolute;
    top: 100px;
    left: 20px;
    display: flex;
    flex-direction: column;
    image {
      width: 140px;
    }
    text {
      color: #fff;
      margin: 10px 0 0 5px;
      font-size: 18px;
    }
  }
  .parts {
    margin-top: -114px;
    width: 100vw;
    display: flex;
    justify-content: space-evenly;
    .part {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background-color: #f3f3f3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      text {
        font-size: 12px;
      }
    }
  }
  .content {
    margin-top: 24px;
    border-radius: 12px 12px 0 0;
    background-color: #f7f7f7;
    z-index: 999;
    position: relative;
    padding: 12px 12px 0;
    > image {
      width: 100%;
      display: flex;
      margin-bottom: 12px;
      box-sizing: border-box;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .kefu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 12px;
    .title {
      font-weight: 600;
    }
    image {
      height: 60px;
    }
  }
  .c-grid-box {
    padding: 0 12px;
    .c-grid-view {
      border-radius: 12px;
      overflow: hidden;
      background-color: #ffffff;
      .c-grid-item-box {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text {
          font-size: 12px;
          color: #555555;
          margin-top: 8px;
        }
      }
    }
  }
  .uni-grid {
    margin: 0 12px;
    border-radius: 12px;
  }
  .logo-bottom {
    margin: 24px auto;
    display: flex;
    justify-content: center;
    image {
      width: 90px;
    }
  }
}
</style>
