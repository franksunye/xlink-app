<template>
  <view class="body" @click.capture="track">
    <view :style="{ height: blockHeight + 10 + 'px', width: '100vw' }">
      <view
        :style="{
          backgroundColor: '#525ff6',
          height: blockHeight - 50 + 'px',
          width: '100vw'
        }"
      >
        <view class="blockBox" style="height: auto; width: 100vw">
          <!-- #ifdef MP-WEIXIN -->
          <view class="" style="width: 95vw; margin: 0 auto">
            <van-search
              :value="searchValue"
              @change="searchChange"
              @search="handleSearch"
              shape="round"
              use-left-icon-slot
              background="#525ff6"
              placeholder="请输入合同遍号/核查单号/创建人"
              placeholder-style="font-size: 26rpx;"
            >
              <view slot="left-icon">
                <view
                  class="c-flex c-flex-center"
                  style="margin-right: 5px"
                  @click="isShowBirth = !isShowBirth"
                  :data-event="{ id: 'nQ2LTuVvzL' }"
                >
                  <van-icon
                    name="calendar-o"
                    style="margin: 0px 5px; font-size: 40rpx"
                    :data-event="{ id: 'nQ2LTuVvzL' }"
                  />
                  {{ timestampToYearMonth(this.currentDate) }}
                </view>
              </view>
            </van-search>
          </view>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <view class="custom-view fontSize-12">
            <view>
              <view
                class="c-flex c-flex-center"
                style="margin-right: 5px"
                @click="$refs.datetimePicker.show()"
                :data-event="{ id: 'wTuiH1GvhB' }"
              >
                <van-icon
                  name="calendar-o"
                  style="margin: 0px 5px; font-size: 40rpx"
                  :data-event="{ id: 'wTuiH1GvhB' }"
                />
                {{ timestampToYearMonth(this.currentDate) }}
              </view>
            </view>
            <view style="flex: 1">
              <view style="flex: 1; display: flex; justify-content: space-between">
                <van-search
                  :value="searchValue"
                  @change="searchChange"
                  @search="handleSearch"
                  right-icon
                  use-left-icon-slot
                  :clearable="false"
                  placeholder="请输入合同遍号/核查单号/创建人"
                  input-class="fontSize-12  inputflex"
                ></van-search>
                <van-icon name="close" @click="searchChange" :data-event="{ id: 'BoeNZD58SU' }" />
              </view>
            </view>
          </view>
          <!-- #endif -->

          <!-- 标签页切换 -->
          <van-tabs
            custom-class="vanTabs"
            @change="tabsChange"
            title-inactive-color="#cccc"
            title-active-color="#fff"
            :data-event="{ id: 'JjXPVhxS68', capture: false }"
          >
            <van-tab :name="false" title=" 已提交 "></van-tab>
            <van-tab :name="true" title=" 待核查 "></van-tab>
          </van-tabs>
          <!-- 数字显示 -->
          <view class="content">
            <view
              class="top"
              v-for="(item, index) in ButtonType"
              :key="index"
              @click="toggleActive(item, index)"
              :data-event="{ id: 'bnOYKDn3bB' }"
            >
              <view
                :class="{ active: activeIndex === index }"
                :style="{ color: activeIndex === index ? item.color : '' }"
                :data-event="{ id: 'bnOYKDn3bB' }"
              >
                {{ item.title }}
              </view>
              <view class="count" :data-event="{ id: 'bnOYKDn3bB' }">
                {{ saveStatus ? '0' : item.count }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <scroll-view scroll-y class="cardBox" @scrolltolower="scrolltolower">
      <block v-if="hasMoreData.dataList.length > 0">
        <view class="card" v-for="(item, index) in hasMoreData.dataList" :key="index">
          <view style="position: relative">
            <text class="taskTitle">{{ item.contractNum }}</text>
            <text
              class="c-size-13 c-weight-normar"
              @click="copy(item.contractNum)"
              :data-event="{ id: 'iy2Yq-UAgn' }"
            >
              丨复制
            </text>
            <view class="tag-container">
              <van-tag plain :color="tabType[item.checklistStatus].color">
                {{ tabType[Number(item.checklistStatus)].title }}
              </van-tag>
            </view>
          </view>
          <view class="creatorName">
            <van-icon name="label-o" style="margin-right: 5px" />
            <text class="name">核查单号：{{ item._id }}</text>
            <text
              class="c-size-13 c-weight-normar"
              style="float: right"
              @click="copy(item._id)"
              :data-event="{ id: 'E8r0JYxyvZ' }"
            >
              复制
            </text>
          </view>
          <view class="creatorName">
            <van-icon name="contact-o" style="margin-right: 5px" />
            <text class="name">创建人：{{ item.createUserName }}</text>
          </view>
          <view class="creatorName">
            <van-icon name="location-o" style="margin-right: 5px" />
            <text class="name">施工地址：{{ item.projectAddress }}</text>
          </view>
          <view class="creatorName">
            <van-icon name="clock-o" style="margin-right: 5px" />
            <text class="name">创建时间：{{ item.createTime }}</text>
          </view>
          <view class="creatorName">
            <van-icon name="underway-o" style="margin-right: 5px" />
            <text class="name">最近一次编辑时间：{{ item.updateTime }}</text>
          </view>

          <view class="c-card-content-item BtnBox">
            <van-button
              size="small"
              @click="
                doOpen('/subpackages/check/checkSheet', {
                  checkId: item._id,
                  _id: item.contractId
                })
              "
              round
              type="info"
              custom-class="c-m-l-20"
              :data-event="{ id: '_1gTD9Ce_R' }"
            >
              查看
            </van-button>
            <van-button
              v-if="item.checklistPDFUrl"
              @click="viewPdf(item.checklistPDFUrl)"
              size="small"
              plain
              round
              custom-class="c-m-l-20"
              :data-event="{ id: '_SGKdkQN3d' }"
            >
              查看核查单
            </van-button>
            <van-button
              v-if="item.exts.contractPDFUrl"
              @click="viewPdf(item.exts.contractPDFUrl)"
              size="small"
              plain
              round
              custom-class="c-m-l-20"
              :data-event="{ id: 'YPr6kqoxBI' }"
            >
              查看合同
            </van-button>
            <van-button
              v-if="item.exts.bjdPDFUrl"
              @click="viewPdf(item.exts.bjdPDFUrl)"
              size="small"
              plain
              round
              custom-class="c-m-l-20"
              :data-event="{ id: 'OP7haKlnJr' }"
            >
              查看报价单
            </van-button>
          </view>
        </view>
      </block>
      <block v-else>
        <van-empty class="custom-image" image="search" description="暂无数据" />
      </block>
    </scroll-view>
    <!-- #ifdef MP-WEIXIN -->
    <van-popup
      :show="isShowBirth"
      close-on-click-overlay
      @close="isShowBirth = false"
      position="bottom"
    >
      <van-datetime-picker
        :value="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        type="year-month"
        title="选择核查单日期"
        show-toolbar
        cancel-button-text="重置"
        @confirm="handleDatetimePopup($event, 'confirm')"
        @cancel="handleDatetimePopup($event, 'reset')"
      />
    </van-popup>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <uni-datetime-picker
      :border="false"
      :value="currentDate"
      ref="datetimePicker"
      :showSlot="false"
      type="date"
      placeholder=" "
      @change="handleDatetimePopup($event)"
    ></uni-datetime-picker>
    <!-- #endif -->

    <!-- 日期选择控件 -->
  </view>
</template>

<script>
var common = require('../../resources/js/common.js');

var throttledGetData; //防抖函数
export default {
  data() {
    return {
      contractId: null, //合同Id
      ButtonType: [
        { title: '核查通过', type: '2,3', color: '#07c160', count: 0 },
        { title: '核查不通过', type: '4', color: '#ee0a24', count: 0 },
        { title: '核查部分通过', type: '1', color: '#ff976a', count: 0 }
      ],
      ButtonCounts: {},
      activeIndex: 0, // 存储当前激活的索引
      saveStatus: false, //标签页的状态 当前是看保存的还是提交的
      checkStatus: '2,3', //当前查看的核查单状态 默认是查看通过的
      tabType: [
        { title: '待核查', color: '#ccc' },
        { title: '部分通过', color: '#ff976a' },
        { title: '整改后通过', color: '#1989fa' },
        { title: '全部通过', color: '#07c160' },
        { title: '不通过', color: '#ee0a24' }
      ],
      intervalId: null, //定时器的回调函数
      blockHeight: 0, //顶部高度自适应
      isShowBirth: false, // 显示时间选择器
      minDate: new Date(2023, 0, 1).getTime(), //时间选择器最小的日期
      maxDate: new Date().getTime(), //时间选择器最大选择的日期
      currentDate: new Date().getTime(), // 当前日期
      searchValue: '', //输入框输入的内容
      hasMoreData: {
        total: 0, //总条数
        page: 1, // 当前页码
        rows: 30,
        dataList: [] // 清空数据列表
      }
    };
  },
  onLoad(e) {
    //合同ID
    const { _id } = e;
    this.contractId = _id ? _id : ''; //合同Id
    // console.log('合同id', this.contractId);
    //创建防抖函数
    throttledGetData = common.osg.throttle(this.getData, 800);
    this.$nextTick(() => {
      const query = uni.createSelectorQuery().in(this); // 创建选择器
      query.select('.blockBox').boundingClientRect(); // 选择类名为 box 的元素
      query.exec(res => {
        // console.log('是否查询成功了', res);
        if (res[0]) {
          this.blockHeight = res[0].height; // 获取 block 的高度
          console.log('block 的高度是:', this.blockHeight);
        } else {
          console.log('没有拿到block 的高度');
        }
      });
    });
  },
  onShow() {
    //重置分页器
    this.resetPagination();
    this.getData();
  },
  watch: {
    saveStatus(newValue, oldValue) {
      console.log('saveStatus 发生变化:', newValue);
      if (newValue) {
        this.checkStatus = '2,3';
        this.activeIndex = null;
      } else {
        this.activeIndex = 0;
      }
    }
  },
  methods: {
    //标签页的状态
    getData() {
      const { rows, page } = this.hasMoreData;
      const startOfMonth = this.timestampToYearMonth(this.currentDate) + '-01 00:00:00';
      const startOfNextMonth = this.timestampToYearMonth(this.currentDate, 1) + '-01 00:00:00';
      let params = {
        'is:state|integer#and': 1,
        sortField: 'updateTime',
        sortOrder: 'desc',
        rows,
        page,
        'is:contractId|string#and': this.contractId, //合同id

        'regex:createUserName|string#or': this.searchValue, //创建人
        'regex:_id|string#or': this.searchValue, //核查单号id
        'regex:contractNum|string#or': this.searchValue, //合同编号
        'gte:createTime|datetime#and': startOfMonth,
        'lt:createTime|datetime#and': startOfNextMonth
      };
      if (this.contractId) {
        params['notFilterBelongTo'] = '1';
        params['notFilterOrgId'] = '1';
      }
      // 查看已经提交的了的核查单 更详细的状态
      if (this.checkStatus) {
        params['in:checklistStatus|array-integer#and'] = this.checkStatus; //查看已经提交的了的核查单
      }

      // 当前选择的是已经保存了的状态;
      if (this.saveStatus) {
        // params['ne:checklistStatus|integer#and'] = 0; //提交过滤出来不等于0的
        params['is:checklistStatus|integer#and'] = 0; //提交过滤出来不等于0的
        params['in:checklistStatus|array-integer#and'] = 0;
      }

      common.osg.ajax('/basic/checklist/query', params, ({ data, total }) => {
        //拿到总条数
        this.hasMoreData.total = total;
        this.hasMoreData.page++; // 自增 page 值

        this.getChecklistData();
        //是否需要重置分页
        if (!data.length) {
          wx.showToast({
            title: '数据为空',
            icon: 'none',
            duration: 2000
          });
          //是否需要清空原书组
        } else {
          this.hasMoreData.dataList = [...this.hasMoreData.dataList, ...data];
        }
      });
    },
    //标签页切换
    tabsChange(e) {
      const { name } = e.detail;
      this.saveStatus = name;
      this.resetPagination();
      this.getData();
    },
    //如果点击项与当前激活项一致，取消激活；否则激活该项
    toggleActive(item, index) {
      console.log('为啥没反应', this.checkStatus);
      if (this.saveStatus) {
        wx.showToast({
          icon: 'error',
          title: '待核查', // 提示的内容
          duration: 2000 // 提示的持续时间，单位是毫秒
        });
        return;
      }

      this.activeIndex = this.activeIndex === index ? null : index;
      this.checkStatus = item.type;
      if (this.activeIndex === null) {
        this.checkStatus = '1,2,3,4';
      }
      this.resetPagination();
      this.getData();
    },

    //跳转的方法
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    //查询统计核查单数量
    getChecklistData() {
      const startOfMonth = this.timestampToYearMonth(this.currentDate) + '-01 00:00:00';
      const startOfNextMonth = this.timestampToYearMonth(this.currentDate, 1) + '-01 00:00:00';
      let params = {
        'is:state|integer#and': 1,
        'regex:createUserName|string#or': this.searchValue, //创建人
        'regex:_id|string#or': this.searchValue, //核查单id
        'regex:contractNum|string#or': this.searchValue, //合同编号
        'gte:createTime|datetime#and': startOfMonth, //开始时间
        'lt:createTime|datetime#and': startOfNextMonth //结束时间
      };
      if (this.contractId) {
        params['is:contractId|string#and'] = this.contractId; //合同id
        params['notFilterBelongTo'] = '1';
        params['notFilterOrgId'] = '1';
      }
      common.osg.ajax('/basic/checklist/queryCount', params, res => {
        console.log(res);

        const { combinedPassedCount = 0, partiallyPassedCount = 0, notPassedCount = 0 } = res;
        this.ButtonType = [
          { title: '核查通过', type: '2,3', color: '#07c160', count: combinedPassedCount },
          { title: '核查不通过', type: '4', color: '#ee0a24', count: notPassedCount },
          { title: '核查部分通过', type: '1', color: '#ff976a', count: partiallyPassedCount }
        ];
        // console.log('整改后通过和全部通过的数量: ', combinedPassedCount);
        // console.log('部分通过的数量: ', partiallyPassedCount);
        // console.log('不通过的数量: ', notPassedCount);
        // this.ButtonCounts = data;
      });
    },

    // 复制到剪切板÷
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    //查看合同
    viewPdf(filePath) {
      if (this.intervalId !== null) {
        clearTimeout(this.intervalId); // 改为 clearTimeout
        console.log('定时器已清除');
      }
      wx.setClipboardData({
        data: filePath,
        success: () => {
          wx.showToast({
            title: '正在打开PDF,并且同时自动复制了该PDF链接到您的剪贴板',
            icon: 'none',
            duration: 2000
          });
          this.intervalId = setTimeout(() => {
            // 将定时器的返回值赋给 this.intervalId
            wx.downloadFile({
              url: filePath,
              success: res => {
                wx.openDocument({
                  filePath: res.tempFilePath
                });
              }
            });
          }, 1500);
        }
      });
    },
    //时间处理函数  timestamp 1727314912540 --->  YYYY-MM”格式
    timestampToYearMonth(timestamp, offset = 0) {
      const date = new Date(timestamp);
      // 增加偏移月份（offset=0表示当前月，offset=1表示下个月，offset=-1表示上个月）
      date.setMonth(date.getMonth() + offset);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 格式化成两位数的月份
      // 返回 "YYYY-MM" 格式
      return `${year}-${month}`;
    },
    //输入框改变事件
    searchChange(e) {
      this.searchValue = e.detail;
    },
    //确认搜索事件
    handleSearch() {
      this.resetPagination();
      this.getData(true);
    },
    //操作时间选择器
    handleDatetimePopup(e, action) {
      if (action === 'confirm') {
        // 处理确认逻辑
        this.currentDate = e.detail;
      } else if (action === 'reset') {
        // 处理取消逻辑
        this.currentDate = new Date().getTime();
      } else {
        const originalDate = new Date(e);
        // 创建目标日期，设为 2024-12-01
        const targetDate = new Date(originalDate.getFullYear(), originalDate.getMonth(), 1);
        // 获取时间戳（单位：毫秒）
        this.currentDate = targetDate.getTime();
      }
      this.resetPagination();
      this.getData();
      this.isShowBirth = false;
    },
    //触底事件
    scrolltolower() {
      if (this.hasMoreData.dataList.length === this.hasMoreData.total) {
        wx.showToast({
          title: '暂无更多',
          icon: 'none',
          duration: 2000
        });
        return; // 防止重复调用
      }

      //走的是搜索拿数据还是基础的拿数据
      throttledGetData();
    },
    // 重置分页器
    resetPagination() {
      this.hasMoreData.page = 1; // 重置页码
      this.hasMoreData.dataList = []; // 清空数据列表
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .content {
    width: 95vw;
    height: 200rpx;
    padding: 10px 40rpx;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    margin: 10px auto;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    // box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
    .top {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      color: #b7b9c3;
      font-size: 26rpx;
      .count {
        font-size: 50rpx;
        font-weight: bolder;
        transform: scale(1, 1.5);
        letter-spacing: 3px;
        color: #5c5c67;
      }

      .active {
        transform: scale(1.15);
        font-weight: bolder;
        transform-origin: center;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .cardBox {
    position: relative;
    flex: 1;
    overflow-y: scroll;
    .custom-image {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .card {
      width: 95vw;
      height: auto;
      margin: 10px auto;
      background-color: #fff;
      border-radius: 10px;
      padding: 10px 16rpx;
      font-size: 26rpx;
      color: #585858;
      box-sizing: border-box;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .tag-container {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .taskTitle {
        font-size: 30rpx;
        color: black;
        font-weight: bolder;
      }
      .TimeView {
        display: flex;
      }
      .bottomView {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .BtnBox {
        flex-direction: row-reverse;
      }
    }
  }
}
//#ifdef APP-PLUS
.fontSize-12 {
  font-size: 12px !important;
}
.inputflex {
  flex: 1;
  background-color: transparent !important;
}
.custom-view {
  width: 95vw;
  margin: 0 auto;
  height: 34px;
  border-radius: 100px;
  background-color: #f7f8fa;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.uni-date {
  flex: none;
}
::v-deep .vanTabs .van-tabs__content {
  margin-top: 0px;
}
//#endif
::v-deep .van-tabs__nav {
  background-color: #525ff6;
}

::v-deep .van-tabs__line {
  background-color: #fff;
}
::v-deep .van-ellipsis {
  font-size: 26rpx;
}
::v-deep .blockBox {
  .van-search {
    padding: 10px 0px;
  }
}
</style>
