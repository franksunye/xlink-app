<template>
  <view class="couponsList" @click.capture="track">
    <!-- 过滤 -->
    <view class="header-wrapper">
      <van-tabs
        :active="activeTab"
        sticky
        @click="onTabClick"
        :data-event="{ id: 'wvx6jpxyrM', capture: false }"
      >
        <van-tab name="1" title="未发放"></van-tab>
        <van-tab name="2" title="已发放"></van-tab>
        <van-tab name="3" title="已激活"></van-tab>
        <van-tab name="4" title="已使用"></van-tab>
      </van-tabs>
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="
          this.searchValue = '';
          getData(activeTab);
        "
        shape="round"
        placeholder="请输入优惠券编号"
        custom-class="c-p-10 c-p-v-20"
      ></van-search>
    </view>
    <!-- 列表 -->
    <view style="padding-top: 90px">
      <view
        class="c-card"
        v-for="(item, index) in fpi.data"
        :key="index"
        v-if="searchValue == '' || item.userId == searchValue || item.code == searchValue"
      >
        <view class="c-card-title">
          <view class="c-flex">
            <!-- <van-icon custom-class="c-card-icon" name="todo-list-o"></van-icon> -->
            <van-icon name="coupon-o" />
            <text style="margin-left: 12rpx">{{ item.title || '' }}</text>
          </view>
        </view>
        <view>
          <text>
            类型：{{ item.type == '99' ? '兑奖券' : item.type == '1' ? '代金券' : '未知券' }}
          </text>
        </view>
        <view>
          <text>编号：{{ item.code || '' }}</text>
        </view>
        <view>
          <text v-if="item.type != '99'">金额：{{ item.value || '' }}</text>
        </view>
        <view>
          <text>
            有效期至：{{ item.startDate | deleteseconds }} ~ {{ item.endDate | deleteseconds }}
          </text>
          <van-button
            round
            v-if="item.status == '3'"
            size="mini"
            type="warning"
            @click="verification(item)"
            :data-event="{ id: 'tvetD428tf' }"
          >
            核销
          </van-button>
        </view>
        <view :class="item.status == '3' ? 'status-bar' : 'status-bar-failure'" v-if="item.status">
          <!-- <text> -->
          {{ codelabel('couponState', item.status) }}
          <!-- </text> -->
        </view>
      </view>
    </view>
    <!-- <view class="c-text-center c-size-14 c-p-20">没有更多结果</view> -->
    <!-- <u-empty class="fullScreen" v-if="!isEmpty" text="没有优惠券" mode="coupon"></u-empty>
    -->
    <!-- 模态框 消息提示 -->
    <!-- <u-modal v-model="modalShow" :content="modalContent"></u-modal> -->
    <view v-if="!isEmpty" style="height: 40vh">
      <van-empty description="没有优惠券" />
    </view>
    <!-- 悬浮球 扫码核销 -->
    <view class="c-ball c-ball-right" @click="scanCode" :data-event="{ id: 'TCatMkdTR1' }">
      <van-icon name="scan" :data-event="{ id: 'TCatMkdTR1' }"></van-icon>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      fpi: {},
      options: {
        codecfg_couponState: {
          codeId: 'couponState'
        }
      },
      searchValue: '', //过滤userId或优惠券编码
      isEmpty: false,
      modalShow: false, //模态框显示隐藏
      modalContent: '', //模态框提示内容
      activeTab: '1' //当前tab
    };
  },
  mounted: function (param) {
    common.osg.init(this, param, app);
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    onSearch(val) {
      //搜索编号
      this.searchValue = val.detail;
      this.$forceUpdate();
    },
    getData: function (tabVal) {
      let params = {
        // page: this.fpi.page || 1,
        // rows: this.fpi.rows || 20,
        type: 1
      };
      common.osg.ajax('/basic/couponPrinting/workBouny', params, res => {
        let tabIndex = tabVal ? tabVal : '1';
        let show = res[tabIndex] && res[tabIndex].length;
        this.isEmpty = !!show;
        this.fpi.allData = common.osg.deepCopy(res);
        this.fpi.data = this.fpi.allData[tabIndex];
        if (this.fpi.data) {
          this.fpi.data.sort(
            (x, y) => new Date(y.createTime).valueOf() - new Date(x.createTime).valueOf()
          );
        }
        this.$forceUpdate();
      });
    },

    getSearchCodeData() {
      // 搜索
      common.osg.ajax(`/basic/couponPrinting/queryByCode/${this.searchValue}`, null, res => {
        // if (res.data) {
        // 	res.data.sort((x, y) => new Date(y.createTime).valueOf() - new Date(x.createTime).valueOf())
        // }
        if (res.entity) {
          this.fpi.data = [res.entity];
        } else {
          this.fpi.data = [];
        }
        this.isEmpty = !!res.entity;
      });
    },
    //tab 点击
    onTabClick(event) {
      this.activeTab = event.detail.name;
      this.getData(this.activeTab);
    },
    //核销
    verification(item) {
      common.osg.ajax(`/basic/couponPrinting/cancellation/${item._id}`, {}, res => {
        this.getData(this.activeTab);
        common.osg.alert('核销成功！');
        // this.modalShow = true;
        // this.modalContent = '核销成功！';
      });
    },
    // 扫码二维码
    scanCode() {
      common.osg.scanCode(res => {
        let url = res.result;
        this.searchValue = url.split('?')[1].split('=')[1];
        this.$forceUpdate();
      });
    },
    //反显字典表
    codelabel: function (codeType, codeValue) {
      return common.osg.codelabel(codeType, codeValue);
    },
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {
      this.getData(this.activeTab);
    }
  },
  filters: {
    //删除时间后的时分秒
    deleteseconds(dateVal) {
      return dateVal ? dateVal.substr(0, dateVal.indexOf(' ')) : '';
    }
  }
};
</script>

<style lang="scss">
.couponsList {
  .fullScreen {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .c-header {
    box-sizing: border-box;
    padding: 20rpx;
    background: #fff;
    z-index: 2;
  }

  .c-card {
    position: relative;
  }

  .status-bar {
    color: #fff;
    background: #f15352;
    transform: rotate(40deg);
    width: 150rpx;
    font-size: 22rpx;
    display: flex;
    height: 30rpx;
    justify-content: center;
    position: absolute;
    top: 16rpx;
    right: -64rpx;
    padding-left: 111rpx;
    padding-bottom: 4rpx;
    text-align: center;
  }

  .status-bar-failure {
    background: #adadad;
    color: #fff;
    transform: rotate(40deg);
    width: 150rpx;
    font-size: 22rpx;
    display: flex;
    height: 30rpx;
    justify-content: center;
    position: absolute;
    top: 16rpx;
    right: -64rpx;
    padding-left: 111rpx;
    padding-bottom: 4rpx;
    text-align: center;
  }

  .header-wrapper {
    padding: 10rpx;
    background: #fff;
    z-index: 2;
    width: 100%;
    position: fixed;
    margin-top: -20rpx;
  }
}
</style>
