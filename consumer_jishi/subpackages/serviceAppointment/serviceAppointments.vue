<template>
  <view class="serviceAppointments">
    <view v-if="loaded && !data.length" class="c-uni-empty">
      <image src="https://pub.fsgo365.cn/empty.png"></image>
      <text>暂无数据</text>
    </view>
    <block v-if="data.length > 0">
      <view
        class="c-card"
        style="padding-top: 10px"
        v-for="(item, i) in data"
        :key="i"
        @tap="open('./serviceAppointmentDetail', { id: item._id })"
        :data-id="item._id"
      >
        <view class="c-flex c-flex-between c-m-t-10 c-m-b-20">
          <view :class="item.status != '403' ? 'c-jishi' : ''" style="font-weight: 500">
            {{ codelabel('status', item.status || '') || '' }}
          </view>
          <view class="c-flex c-item-center">
            <text style="color: #666; font-size: 12px">查看明细</text>
            <uni-icons type="right" size="16" color="#666666" style="margin-left: 5px"></uni-icons>
          </view>
        </view>
        <view class="c-card-content">
          <view class="c-m-b-10">
            <text>工单编号</text>
            <text>{{ item.orderNum }}</text>
          </view>
          <view class="c-m-b-10">
            <text>维修地址</text>
            <text>{{ item.address || '' }}</text>
          </view>
          <view class="c-m-b-10 c-flex c-flex-between c-item-center c-w-100">
            <view>
              <text>专属管家</text>
              <text>{{ item.exts.supervisorName || '' }}</text>
            </view>
            <image
              v-if="item.exts.supervisorPhone"
              src="/static/images/icon/phone.png"
              mode="widthFix"
              style="width: 22px"
              @click.stop="makePhoneCall(item.exts.supervisorPhone)"
            ></image>
          </view>
        </view>
        <!-- <view class="c-m-t-20">
          <view>
            <button
              v-if="item.exts.moKanNum && Number(item.status) > 103 && Number(item.status) < 403"
              class="c-uni-button round small primary"
              hover-class="hover"
              plain
              @click.native.stop="toMoKanDetail(item)"
            >
              <uni-icons type="videocam" color="#fff" size="14"></uni-icons>
              <text>查看监控</text>
            </button>
          </view>
        </view> -->
      </view>
    </block>
    <view v-else class="c-uni-empty">
      <image src="https://pub.fsgo365.cn/empty.png"></image>
      <text>没有数据</text>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      loaded: false,
      status: '',
      data: [],
      options: {
        codecfg_status: {
          codeId: 'STATUS'
        },
        cascadeCode_channel: {
          codeId: 'channel'
        },
        codecfg_serviceType: {
          codeId: 'serviceType'
        }
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.status = params.status;
    common.osg.codeoption(() => {
      this.getServiceAppointments();
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
    getServiceAppointments() {
      common.osg.ajax(
        'basic/serviceAppointment/query',
        {
          page: 1,
          rows: 100,
          sortField: 'createTime',
          sortOrder: 'desc',
          'in:status|array#and': this.status
        },
        res => {
          this.data = res.data;
          this.loaded = true;
        }
      );
    },
    // 跳转监控详情
    toMoKanDetail(item) {
      common.osg.open('../web/web', {
        url: `${this.host}/fsgo/wm/h5/mokan/detail/${item.exts.moKanNum}?address=${
          this.area.areaList.province_list[item.area[0]] +
          this.area.areaList.city_list[item.area[1]] +
          this.area.areaList.county_list[item.area[2]] +
          item.address
        }&startDate=${item.exts.startDate || ''}&supervisorName=${
          item.exts.supervisorName || ''
        }&headmanName=${item.exts.headmanName || ''}&client=c`
      });
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
.serviceAppointments {
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  background: #f7f7f7;
  .c-card {
    margin: 12px;
    padding: 12px;
    .c-card-content {
      color: #646464;

      > view {
        text {
          &:first-child {
            margin-right: 20px;
          }
        }
      }
      .phone-view {
        padding: 3px;
        border-radius: 50%;
        background-color: #ff6900;
        display: flex;
      }
    }
  }
}
</style>
