<template>
  <view class="account">
    <view>
      <view class="outerCard" v-for="(data, k) in dataList" :key="k">
        <view>
          <view class="c-card-title">
            <view class="c-flex c-flex-between" style="font-size: 14px; font-weight: 800">
              <view>
                <view class="c-flex">开工时间：{{ data.startTime }}</view>
                <view class="c-flex">完工时间：{{ data.endTime }}</view>
              </view>
              <view>
                <view v-if="data.state == 0" class="c-flex c-red">待确认</view>
                <view v-if="data.state == 1" class="c-flex c-green">已确认</view>
              </view>
            </view>
          </view>
          <view class="c-card-content">
            <text>工时：</text>
            <text>{{ data.workTime }}分钟</text>
          </view>
          <van-divider dashed />
        </view>

        <view
          v-show="data.saId == item.saId"
          style="padding-top: 10px"
          v-for="(item, i) in data.candidateSa"
          :key="i"
        >
          <view class="c-card-content">
            <view class="c-m-b-10">
              <text>工单编号：</text>
              <text>{{ item.orderNum }}</text>
            </view>
            <view class="c-m-b-10">
              <text>工单标题：</text>
              <text>{{ item.title }}</text>
            </view>
            <view class="c-m-b-10">
              <text>地址：</text>
              <text>{{ item.address }}</text>
            </view>
          </view>
          <!-- <view style="display: flex; justify-content: flex-end">
              <van-button
                custom-class="c-m-l-20"
                round
                icon="passed"
                type="info"
                size="small"
                color="#0078D0"
                @click="punchConfirm(data._id, item.saId)"
              >
                确认
              </van-button>
            </view> -->
          <van-divider />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      page: 1, // 当前页数
      rows: 10, // 每页数量
      dataList: [], // 存储数据的数组
      isEnd: false, // 是否到达最后一页
      status: '',
      nowTime: '',
      current_address: '',
      points: {},
      now_time_stop: '' //已打卡时间
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    let user = wx.getStorageSync('user');
    this.getPunchData();
  },
  onShow() {},
  methods: {
    // 路由跳转
    doOpen(path, data) {
      common.osg.open(path, data);
    },

    getPunchData() {
      var params = {
        page: this.page,
        rows: this.rows
        // sortField: 'createTime',
        // sortOrder: 'desc',
      };
      common.osg.ajax('wmt/biz/punch/query', params, res => {
        const newData = res.data;

        if (newData.length > 0) {
          // 如果返回结果不为空，则追加到已有数据中
          const dataList = this.dataList.concat(newData);

          this.setData({
            dataList: dataList,
            page: this.page + 1
          });
        } else {
          // 如果返回结果为空，表示已到达最后一页
          this.$forceUpdate();
          this.setData({ isEnd: true });
          common.osg.toast('没有更多数据', 'none', 5000);
        }
      });
    },
    loadMore() {
      // 加载更多数据，触发下一页查询
      if (!this.isEnd) {
        this.getPunchData();
      }
    },
    onReachBottom() {
      // 监听用户滚动到底部事件，自动触发加载更多数据
      this.loadMore();
    },
    onPullDownRefresh() {
      // 下拉刷新页面，重新加载第一页数据
      this.setData({
        dataList: [],
        page: 1,
        isEnd: false
      });
      this.getPunchData();
      wx.stopPullDownRefresh();
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  background: #f8f8f8;
}
.outerCard {
  background-color: #fff;
  margin: 10px 15px;
  padding: 10px 15px 15px 15px;
  border-radius: 8px;
  font-size: 16px;
  overflow: hidden;
  color: #333333;
}
</style>
