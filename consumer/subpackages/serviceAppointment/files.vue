<template>
  <view class="serviceAppointment-detail">
    <block v-if="loaded">
      <view v-if="phone">
        <view class="top-view">
          <view>项目档案</view>
          <view>轻松管理</view>
        </view>
        <view style="margin: 35px 15px 0px 15px">
          <view class="block-title">勘察阶段</view>
          <view
            style="
              display: grid;
              grid-template-columns: repeat(3, 30%);
              grid-column-gap: 20px;
              grid-row-gap: 20px;
              margin: 20px 0;
            "
          >
            <view class="block-view" @click="open('../../subpackages/survey/surveys', {}, 'auth')">
              <view class="block-view-tab">
                <image
                  class="block-view-img"
                  style="width: 18px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Calendar.png"
                ></image>
              </view>
              <view class="block-view-text">勘察报告</view>
            </view>
            <view class="block-view" @click="open('../../subpackages/order/orders', {}, 'auth')">
              <view class="block-view-tab">
                <image
                  class="block-view-img"
                  style="width: 18px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Document.png"
                ></image>
              </view>
              <view class="block-view-text">报价单</view>
            </view>
          </view>
        </view>
        <view style="margin: 35px 15px 0px 15px">
          <view class="block-title">施工阶段</view>
          <view
            style="
              display: grid;
              grid-template-columns: repeat(3, 30%);
              grid-column-gap: 20px;
              grid-row-gap: 20px;
              margin: 20px 0;
            "
          >
            <view
              class="block-view"
              @click="open('../../subpackages/contract/contracts', {}, 'auth')"
            >
              <view class="block-view-tab">
                <image
                  class="block-view-img"
                  style="width: 18px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Document.png"
                ></image>
              </view>
              <view class="block-view-text">电子合同</view>
            </view>
            <view
              class="block-view"
              @click="open('../../subpackages/contract/AcceptanceForm', {}, 'auth')"
            >
              <view class="block-view-tab">
                <!-- <image
                  class="block-view-img"
                  style="width: 18px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Bookmark.png"
                ></image> -->
                <image
                  class="block-view-img"
                  style="width: 18px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Document.png"
                ></image>
              </view>
              <view class="block-view-text">验收单</view>
            </view>
            <view class="block-view" @click="toast">
              <view class="block-view-tab" style="background-color: #f1f1f1">
                <image
                  class="block-view-img"
                  style="width: 18px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Copy.png"
                ></image>
              </view>
              <view class="block-view-text">材料交割单</view>
            </view>
          </view>
        </view>
        <view style="margin: 35px 15px 0px 15px">
          <view class="block-title">售后阶段</view>
          <view
            style="
              display: grid;
              grid-template-columns: repeat(3, 30%);
              grid-column-gap: 20px;
              grid-row-gap: 20px;
              margin: 20px 0;
            "
          >
            <view
              class="block-view"
              @click="open('../../subpackages/inspection/inspections', {}, 'auth')"
            >
              <view class="block-view-tab">
                <image
                  class="block-view-img"
                  style="width: 18px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Folder.png"
                ></image>
              </view>
              <view class="block-view-text">巡检报告</view>
            </view>
            <view class="block-view" @click="toast">
              <view class="block-view-tab" style="background-color: #f1f1f1">
                <image
                  class="block-view-img"
                  style="width: 18px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Edit2.png"
                ></image>
              </view>
              <view class="block-view-text">我的评价</view>
            </view>
            <view class="block-view" @click="open('../../subpackages/warranty/warranties')">
              <view class="block-view-tab">
                <image
                  class="block-view-img"
                  style="width: 18px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Shield.png"
                ></image>
              </view>
              <view class="block-view-text">质保卡</view>
            </view>
            <view class="block-view" @click="toast">
              <view class="block-view-tab" style="background-color: #f1f1f1">
                <image
                  class="block-view-img"
                  style="width: 20px"
                  mode="widthFix"
                  src="../../static/images/filesIcon/Document2.png"
                ></image>
              </view>
              <view class="block-view-text">开票信息</view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="c-uni-empty">
        <image src="https://pub.fsgo365.cn/empty.png"></image>
        <text>无权查看</text>
        <button
          class="c-uni-button round primary"
          hover-class="hover"
          plain
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          授权手机号查看
        </button>
      </view>
    </block>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
var areajs = require('../../common/area.js');
export default {
  data() {
    return {
      loaded: false,
      phone: '',
      id: '',
      sa: { exts: {} },
      serviceTeamShow: false, // 服务团队是否展示
      areaList: Object.assign({}, areajs.default),
      surveys: [],
      orders: [],
      options: {
        cascadeCode_parts: { codeId: 'parts' },
        codecfg_serviceType: { codeId: 'serviceType' }
      },
      systemInfo: {
        menuButtonObject: {}
      }
    };
  },
  onLoad(params) {
    // 获取系统信息
    this.systemInfo = app.globalData.systemInfo;
    console.log(this.systemInfo, '---获取系统信息');
    common.osg.init(this, params, app);
    this.id = params.id;
    common.osg.doLogin({}, () => {
      this.phone = wx.getStorageSync('user').phone;
      this.loaded = true;
      if (this.phone) {
        common.osg.codeoption();
        this.getServiceAppointments();
      }
    });
  },
  methods: {
    toast() {
      common.osg.toast('暂未开通', 'none');
    },
    open(path, data, auth) {
      if (auth == 'auth' && !this.phone) {
        common.osg.toast('请先授权手机号！', 'none');
        return;
      }
      common.osg.open(path, data);
    },
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.phone = user.phone;
        if (this.phone) {
          common.osg.codeoption();
          this.getServiceAppointments();
        }
      });
    },
    open(path, data) {
      common.osg.open(path, data);
    },
    // 查询最新工单
    getServiceAppointments() {
      common.osg.ajax(
        'basic/serviceAppointment/query',
        {
          page: 1,
          rows: 1,
          _id: this.id
        },
        res => {
          this.sa = res.data[0] || { exts: {} };
          // 勘查中或已勘察时查询勘察单数量
          if (Number(this.sa.status) >= 202) {
            this.getSurveys();
            this.getOrders();
          } else {
            this.surveys = [];
            this.orders = [];
          }
          if (res.data.length == 0) {
            common.osg.toast('您当前还没有订单！', 'none');
          }
        }
      );
    },

    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },

    getSurveys() {
      common.osg.ajax(
        'biz/extForm/query/7971040108398070730.do',
        { tenantId: '1340835581184723420', sid: this.sa._id },
        res => {
          this.surveys = res.data;
        }
      );
    },
    getOrders() {
      common.osg.ajax(
        'basic/order/query',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:serviceAppointmentId|string#and': this.sa._id
        },
        res => {
          this.orders = res.data;
        }
      );
    },

    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    // 预览图片、查看文件
    download(e) {
      if (common.osg.isRepeatClick('download')) {
        return;
      }
      common.osg.download(e);
    }
  }
};
</script>

<style lang="scss" scoped>
.serviceAppointment-detail {
  background: #f7f7f7;
  height: 100vh;
  overflow-y: auto;
  .top-view {
    background-color: #020202;
    width: 100%;
    height: 200px;
    border-radius: 0 0 6% 6%;
    color: #f8f8f8;
    position: relative;
    > view:first-child {
      position: absolute;
      top: 90px;
      left: 40px;
      font-size: 30px;
    }
    > view:last-child {
      position: absolute;
      top: 140px;
      left: 40px;
      font-size: 20px;
    }
  }
  .block-title {
    font-size: 14px;
    font-weight: 600;
  }
  .block-view {
    text-align: center;
    .block-view-tab {
      width: 40px;
      height: 40px;
      // line-height: 50px;
      background-color: #d60f16;
      border-radius: 50%;
      margin-bottom: 10px;
      display: inline-block;
      position: relative;
      .block-view-img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .block-view-text {
      font-size: 12px;
      color: #737373;
    }
  }
  .van-empty {
    height: 100vh;
  }
}
</style>
