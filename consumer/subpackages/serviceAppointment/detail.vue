<template>
  <view class="serviceAppointment-detail">
    <block v-if="loaded">
      <view v-if="phone" class="sa-detail">
        <view class="c-bold" style="margin: 0 0 8px 2px">
          工单详情
          <text v-if="sa.serviceType" class="c-size-12 c-m-v-10">\\\</text>
          <text v-if="sa.serviceType" class="c-size-10">
            {{ codelabel('serviceType', sa.serviceType) }}
          </text>
        </view>
        <view class="sa-detail-card">
          <view class="c-flex c-flex-between">
            <text>工单编号：{{ sa.orderNum || '' }}</text>
            <view class="c-red" style="min-width: 80px" @click="open('./serviceAppointments')">
              <text>全部工单</text>
              <van-icon name="arrow" />
            </view>
          </view>
          <view class="c-m-t-10">
            地址：{{
              areaList.province_list[sa.area[0]] +
                areaList.city_list[sa.area[1]] +
                areaList.county_list[sa.area[2]] +
                sa.address || ''
            }}
          </view>
          <view
            class="c-flex c-item-center c-flex-between"
            style="
              background: #f6f8fe;
              color: #736e6e;
              border-radius: 8px;
              padding: 10px 15px;
              margin-top: 10px;
            "
          >
            <view>
              <view class="c-flex c-item-center">
                <text>{{ sa.exts.supervisorName || '' }}</text>
                <!-- <text class="c-m-l-20">{{ sa.exts.supervisorPhone || '' }}</text> -->
              </view>
              <view class="c-flex c-item-center">
                <van-tag color="#F9DE55" class="c-flex">管家</van-tag>
                <van-rate
                  :value="5"
                  color="#F9DE55"
                  void-icon="star"
                  void-color="#eee"
                  style="display: flex; margin-left: 10px"
                  readonly
                />
              </view>
            </view>
            <view class="phone-button" @click="makeCall(sa.exts.supervisorPhone)">
              <image
                src="../../static/images/phone.png"
                style="width: 15px; display: flex"
                mode="widthFix"
              ></image>
            </view>
          </view>
          <view
            class="c-flex c-item-center c-flex-between"
            style="
              background: #f6f8fe;
              color: #736e6e;
              border-radius: 8px;
              padding: 10px 15px;
              margin-top: 10px;
            "
            v-if="sa.exts.headmanName && sa.exts.headmanPhone"
          >
            <view>
              <view class="c-flex c-item-center">
                <text>{{ sa.exts.headmanName || '' }}</text>
                <!-- <text class="c-m-l-20">{{ sa.exts.headmanPhone || '' }}</text> -->
              </view>
              <view class="c-flex c-item-center">
                <van-tag color="#F9DE55" class="c-flex">工队</van-tag>
                <van-rate
                  :value="5"
                  color="#F9DE55"
                  void-icon="star"
                  void-color="#eee"
                  style="display: flex; margin-left: 10px"
                  disabled
                />
              </view>
            </view>
            <view class="phone-button" @click="makeCall(sa.exts.headmanPhone)">
              <image
                src="../../static/images/phone.png"
                style="width: 15px; display: flex"
                mode="widthFix"
              ></image>
            </view>
          </view>
          <view class="c-card-content"></view>
        </view>
        <view
          class="sa-detail-card"
          style="margin-top: 8px; color: #736e6e"
          v-if="surveys.length > 0"
        >
          <view>勘察报告编号：{{ surveys[0].surveyNum || '' }}</view>
          <view>
            勘察部位：{{
              item.constructionLocation || codelabel('parts', surveys[0].part, 'cascade')
            }}
          </view>
          <view>勘察时间：{{ surveys[0].createTime }}</view>
          <view class="c-flex c-flex-between c-m-t-20">
            <view></view>
            <van-button
              type="info"
              round
              size="small"
              :data-filename="surveys[0].surveyPDFUrl"
              @click="surveyClick"
            >
              查看勘察报告
            </van-button>
          </view>
        </view>
        <view
          class="sa-detail-card"
          style="margin-top: 8px; color: #736e6e"
          v-if="orders.length > 0"
        >
          <view>报价单编号：{{ orders[0]._id || '' }}</view>
          <view>报价时间：{{ orders[0].createTime }}</view>
          <view class="c-flex c-flex-between c-m-t-20">
            <view></view>
            <van-button
              type="info"
              round
              size="small"
              :data-filename="orders[0].surveyPDFUrl"
              @click="orderClick"
            >
              查看报价单
            </van-button>
          </view>
        </view>
      </view>
      <van-empty v-else description="无权查看">
        <van-button round type="info" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
          授权手机号查看
        </van-button>
      </van-empty>
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
      }
    };
  },
  onLoad(params) {
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
    // 去支付
    toPay() {
      common.osg.ajax(
        'basic/order/query',
        {
          'is:serviceAppointmentId|string#and': this.sa._id,
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          let payData = res.data.filter(item => item.payState == 0 || item.payState == 2);
          if (payData.length == 0) {
            common.osg.alert('未查询到需要支付的订单！', 'none');
          } else if (payData.length == 1) {
            this.open('/subpackages/order/pay', {
              orderId: payData[0]._id
            });
          } else {
            this.open('/subpackages/order/orders', { serviceAppointmentId: this.sa._id });
          }
        },
        {
          noload: true
        }
      );
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    toMoKanDetail(item) {
      common.osg.open('../../subpackages/web/web', {
        url: `${common.osg.host}/fsgo/wm/h5/mokan/detail/${item.exts.moKanNum}?address=${
          this.areaList.province_list[item.area[0]] +
          this.areaList.city_list[item.area[1]] +
          this.areaList.county_list[item.area[2]] +
          item.address
        }&startDate=${item.exts.startDate || ''}&supervisorName=${
          item.exts.supervisorName || ''
        }&headmanName=${item.exts.headmanName || ''}&client=b`
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
    surveyClick(e) {
      if (this.surveys.length == 1) {
        common.osg.download(e);
      } else if (this.surveys.length > 1) {
        this.open('../../subpackages/survey/surveys', {
          sid: this.sa._id
        });
      }
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
    orderClick(e) {
      if (this.orders.length == 1) {
        common.osg.download(e);
      } else if (this.orders.length > 1) {
        this.open('../../subpackages/order/orders', {
          serviceAppointmentId: this.sa._id
        });
      }
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

<style lang="scss">
.serviceAppointment-detail {
  background: #f8f8f8;
  height: 100vh;
  overflow-y: auto;
  .van-empty {
    height: 100vh;
  }
  .sa-detail {
    background: #fff;
    margin: 10px 15px 10px;
    padding: 8px;
    border-radius: 8px;
    .sa-detail-card {
      border: 1px solid #ebedf0;
      border-radius: 8px;
      padding: 8px;
    }
    .phone-button {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
