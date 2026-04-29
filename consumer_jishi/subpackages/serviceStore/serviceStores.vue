<template>
  <view class="serviceStores">
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
          <view class="c-jishi" style="font-weight: 500">
            {{ item.name }}
          </view>
        </view>
        <view class="c-card-content">
          <view class="c-m-b-10 c-flex c-item-center">
            <image
              src="https://pub.fsgo365.cn/jishi/location.png"
              mode="widthFix"
              style="width: 9.2px"
              class="c-m-r-10"
            ></image>
            <text>{{ item.address }}</text>
          </view>
          <view class="c-w-100 c-flex c-flex-between c-item-center">
            <view class="c-flex c-item-center">
              <image
                src="https://pub.fsgo365.cn/jishi/time.png"
                mode="widthFix"
                style="width: 12.3px"
                class="c-m-r-10"
              ></image>
              <text>{{ item.businessHours }}</text>
            </view>
            <image
              v-if="item.phone"
              src="/static/images/icon/phone.png"
              mode="widthFix"
              style="width: 22px"
              @click.stop="makePhoneCall(item.phone)"
            ></image>
          </view>
        </view>
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
      data: [],
      options: {}
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
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
        'biz/extForm/queryByColName/serviceStore.do',
        {
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.data = res.data;
          this.loaded = true;
        }
      );
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
.serviceStores {
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
