<template>
  <view class="partnerCreditItem" @click.capture="track">
    <van-cell
      class="datetime"
      :title="formatCurrentDate()"
      is-link
      arrow-direction="down"
      :border="false"
      @click="datetime.show = true"
    />
    <view class="creditItem" v-for="(item, index) in data" :key="index">
      <view>
        <view>{{ item.eventName }}</view>
        <view class="ioeDateTime">{{ item.ioeDateTime }}</view>
      </view>
      <view class="amount" :class="item.ioe === 0 ? 'c-orange' : ''">
        <text class="c-size-20">{{ item.ioe === 0 ? '+' : item.ioe === 1 ? '-' : '' }}</text>
        <text class="c-size-22 c-m-l-10">{{ item.amount }}</text>
      </view>
    </view>
    <!-- 选择年月 -->
    <van-popup :show="datetime.show" position="bottom" :close-on-click-overlay="false" round>
      <!-- #ifdef MP-WEIXIN -->
      <van-datetime-picker
        type="year-month"
        :value="datetime.currentDate"
        @confirm="onDatetimeConfirm"
        :min-date="datetime.minDate"
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <view class="">
        <view class="action-bar">
          <view class="action-cancel" @click="handleCancel">取消</view>
          <view class="action-title">选择年月</view>
          <view class="action-confirm" @click="handleConfirm">确定</view>
        </view>
        <picker-view
          style="width: 100%; height: 300px"
          :value="picker.value"
          @change="onPickerChange"
        >
          <picker-view-column>
            <view
              v-for="(item, index) in picker.years"
              :key="index"
              style="line-height: 30px; text-align: center; font-size: 16px"
            >
              {{ item }}年
            </view>
          </picker-view-column>
          <picker-view-column>
            <view
              v-for="(item, index) in picker.months"
              :key="index"
              style="line-height: 30px; text-align: center; font-size: 16px"
            >
              {{ item }}月
            </view>
          </picker-view-column>
          <!-- 需要月份解开这段代码 -->
          <!-- <picker-view-column>
            <view
              v-for="(item, index) in picker.days"
              :key="index"
              style="line-height: 30px; text-align: center; font-size: 16px"
            >
              {{ item }}日
            </view>
          </picker-view-column> -->
        </picker-view>
      </view>
      <!-- #endif -->
    </van-popup>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      data: [],
      datetime: {
        show: false,
        currentDate: new Date().getTime(),
        minDate: new Date('2023/12/01').getTime()
      },
      picker: {
        selectedTimestamp: 0, //时间戳
        value: [0, 0], // 默认选中的值 年 月
        years: this.generateYears(),
        months: Array.from({ length: 12 }, (v, k) => k + 1) // 生成时间选择器的选择器 12个月份
        // days: this.generateDays(new Date().getFullYear(), new Date().getMonth() + 1)   // 默认当前年份和月份
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.getPartnerCreditItem();
  },
  methods: {
    getPartnerCreditItem() {
      common.osg.ajax(
        '/basic/partnerCreditItem/query',
        {
          _all: '1',
          sortField: 'ioeDateTime',
          sortOrder: 'desc',
          'gte:ioeDateTime|datetime#and': this.formatStartDate(),
          'lte:ioeDateTime|datetime#and': this.formatEndDate()
        },
        res => {
          this.data = res.data;
        }
      );
    },
    onDatetimeConfirm(event) {
      this.datetime.currentDate = event.detail;
      this.datetime.show = false;
      this.getPartnerCreditItem();
    },
    formatCurrentDate() {
      let year = new Date(this.datetime.currentDate).getFullYear();
      let month = new Date(this.datetime.currentDate).getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      return year + '年' + month + '月';
    },
    formatStartDate() {
      let year = new Date(this.datetime.currentDate).getFullYear();
      let month = new Date(this.datetime.currentDate).getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      return year + '-' + month + '-01 00:00:00';
    },
    formatEndDate() {
      let year = new Date(this.datetime.currentDate).getFullYear();
      let month = new Date(this.datetime.currentDate).getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      return year + '-' + month + '-31 00:00:00';
    },
    //生成时间选择器的选择器年数
    generateYears() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear - 5; i <= currentYear + 10; i++) {
        years.push(i);
      }
      return years;
    },
    //根据月份选择生成对应的天数
    generateDays(year, month) {
      const daysInMonth = new Date(year, month, 0).getDate(); // 获取该月的天数
      return Array.from({ length: daysInMonth }, (v, k) => k + 1); // 生成 1 到 天数 的数组
    },

    onPickerChange(e) {
      const [yearIndex, monthIndex] = e.detail.value;
      this.picker.value = [yearIndex, monthIndex];
    },
    //时间选择器 确定按钮
    handleConfirm() {
      const [yearIndex, monthIndex] = this.picker.value;
      const year = this.picker.years[yearIndex];
      const month = this.picker.months[monthIndex];
      // 转换为时间戳
      const selectedDate = new Date(year, month - 1); // month - 1，因为月份是从 0 开始的
      this.picker.selectedTimestamp = selectedDate.getTime(); // 获取时间戳（毫秒数）
      //复用之前的方法
      this.onDatetimeConfirm({ detail: this.picker.selectedTimestamp });
    },
    //取消时间选择器的按钮
    handleCancel() {
      this.datetime.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.partnerCreditItem {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
  padding-top: 44px;
  .datetime {
    position: fixed;
    width: 100vw;
    top: 0;
  }
  .creditItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    margin: 10px;
    padding: 16px;
    border-radius: 8px;
    font-weight: 500;
    .ioeDateTime {
      color: #6d6d6d;
      font-size: 12px;
    }
    .amount {
      color: #f03a23;
      display: flex;
      font-weight: 600;
    }
  }
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  text-align: center;
  background-color: #fff;
}

.action-cancel {
  color: #969799;
  width: 50px;
  font-size: 16px;
}

.action-confirm {
  color: #576b95;
  width: 50px;
  font-size: 16px;
}

.action-title {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
}
</style>
