<template>
  <view class="data" @click.capture="track">
    <van-tabs
      :active="activeTab"
      @change="onTabChange"
      color="#FF6900"
      :data-event="{ id: 'ZVIV2FRoHE', capture: false }"
    >
      <van-tab title="按天" name="day"></van-tab>
      <van-tab title="按月" name="month"></van-tab>
      <van-tab title="按年" name="year"></van-tab>
    </van-tabs>
    <view class="card">
      <view class="title">
        <view
          class="label"
          @click="onCalendarDisplay"
          v-if="activeTab == 'day'"
          :data-event="{ id: '5KNxtGpxyu' }"
        >
          <van-icon name="notes-o" :data-event="{ id: '5KNxtGpxyu' }" />
          <text style="margin-left: 5px" :data-event="{ id: '5KNxtGpxyu' }">{{ day }}</text>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <view
          class="label"
          @click="onMonthDisplay"
          v-if="activeTab == 'month'"
          :data-event="{ id: 'V0i7x3WeA0' }"
        >
          <van-icon name="notes-o" :data-event="{ id: 'V0i7x3WeA0' }" />
          <text style="margin-left: 5px" :data-event="{ id: 'V0i7x3WeA0' }">{{ monthStr }}</text>
        </view>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <view class="label" v-if="activeTab == 'month'">
          <picker
            mode="date"
            fields="month"
            :value="monthStr"
            start="2023-04"
            :end="endMonth"
            @change="onMonthConfirm"
          >
            <van-icon name="notes-o" />
            <text style="margin-left: 5px">{{ monthStr }}</text>
          </picker>
        </view>
        <!-- #endif -->
        <view
          class="label"
          @click="onYearDisplay"
          v-if="activeTab == 'year'"
          :data-event="{ id: 'GGUIU_GZS-' }"
        >
          <van-icon name="notes-o" :data-event="{ id: 'GGUIU_GZS-' }" />
          <text style="margin-left: 5px" :data-event="{ id: 'GGUIU_GZS-' }">{{ year }}</text>
        </view>
      </view>
      <!-- 老板通 -->
      <view class="content" v-if="type == 'boss'">
        <view>
          <text class="label">合同额</text>
          <text class="value">
            {{ formData.allMoney || '' }}
            <text class="c-c-6 c-m-l-10">元</text>
          </text>
        </view>
        <view>
          <text class="label">合同数</text>
          <text class="value">
            {{ formData.count || '' }}
            <text class="c-c-6 c-m-l-10">个</text>
          </text>
        </view>
        <view>
          <text class="label">客单价</text>
          <text class="value">
            {{ formData.unitPrice || '' }}
            <text class="c-c-6 c-m-l-10">元</text>
          </text>
        </view>
        <view>
          <text class="label">收款额</text>
          <text class="value">
            {{ formData.payMoney || '' }}
            <text class="c-c-6 c-m-l-10">元</text>
          </text>
        </view>
        <view>
          <text class="label">进场数</text>
          <text class="value">
            {{ formData.approach || '' }}
            <text class="c-c-6 c-m-l-10">个</text>
          </text>
        </view>
        <view>
          <text class="label">交付验收数</text>
          <text class="value">
            {{ formData.acceptance || '' }}
            <text class="c-c-6 c-m-l-10">个</text>
          </text>
        </view>
        <view>
          <text class="label">完工数</text>
          <text class="value">
            {{ formData.finish || '' }}
            <text class="c-c-6 c-m-l-10">个</text>
          </text>
        </view>
        <view>
          <text class="label">工单数</text>
          <text class="value">
            {{ formData.saCount || '' }}
            <text class="c-c-6 c-m-l-10">个</text>
          </text>
        </view>
        <view>
          <text class="label">雨虹平台单转化率</text>
          <text class="value">{{ formData.yhRate || '' }}%</text>
        </view>
        <view>
          <text class="label">平台单转化率</text>
          <text class="value">{{ formData.xlRate || '' }}%</text>
        </view>
        <view>
          <text class="label">雨虹自引单转化率</text>
          <text class="value">{{ formData.zyRate || '' }}%</text>
        </view>
        <view>
          <text class="label">服务商自有单转化率</text>
          <text class="value">{{ formData.zjRate || '' }}%</text>
        </view>
      </view>
      <block v-if="type == 'growth'">
        <!-- 内勤 -->
        <view class="content" v-if="currentRoleId == '6631748470755706348'">
          <view>
            <text class="label">工单数</text>
            <text class="value">
              {{ formData.saCount || '' }}
              <text class="c-c-6 c-m-l-10">个</text>
            </text>
          </view>
          <view>
            <text class="label">雨虹平台单转化率</text>
            <text class="value">{{ formData.yhRate || '' }}%</text>
          </view>
          <view>
            <text class="label">修链平台单转化率</text>
            <text class="value">{{ formData.xlRate || '' }}%</text>
          </view>
          <view>
            <text class="label">雨虹自引单转化率</text>
            <text class="value">{{ formData.zyRate || '' }}%</text>
          </view>
          <view>
            <text class="label">服务商自有单转化率</text>
            <text class="value">{{ formData.zjRate || '' }}%</text>
          </view>
        </view>
        <!-- 管家 -->
        <view class="content" v-if="currentRoleId == '3481370558631265818'">
          <view>
            <text class="label">创建订单数</text>
            <text class="value">
              {{ formData.orderCount || '' }}
              <text class="c-c-6 c-m-l-10">个</text>
            </text>
          </view>

          <view>
            <text class="label">创建合同数</text>
            <text class="value">
              {{ formData.count || '' }}
              <text class="c-c-6 c-m-l-10">个</text>
            </text>
          </view>

          <view>
            <text class="label">合同签约数</text>
            <text class="value">
              {{ formData.signedCount || '' }}
              <text class="c-c-6 c-m-l-10">个</text>
            </text>
          </view>

          <view>
            <text class="label">创建合同金额</text>
            <text class="value">
              {{ formData.allMoney || '' }}
              <text class="c-c-6 c-m-l-10">元</text>
            </text>
          </view>

          <view>
            <text class="label">合同签约金额</text>
            <text class="value">
              {{ formData.signedMoney || '' }}
              <text class="c-c-6 c-m-l-10">元</text>
            </text>
          </view>

          <view>
            <text class="label">签约客单价</text>
            <text class="value">
              {{ formData.unitPrice || '' }}
              <text class="c-c-6 c-m-l-10">元</text>
            </text>
          </view>

          <view>
            <text class="label">收款额</text>
            <text class="value">
              {{ formData.paidMoney || '' }}
              <text class="c-c-6 c-m-l-10">元</text>
            </text>
          </view>
        </view>
        <!-- 工队 -->
        <view class="content" v-if="currentRoleId == '1259263938717893739'">
          <view>
            <text class="label">进场数</text>
            <text class="value">
              {{ formData.approach || '' }}
              <text class="c-c-6 c-m-l-10">个</text>
            </text>
          </view>
          <view>
            <text class="label">交付验收数</text>
            <text class="value">
              {{ formData.acceptance || '' }}
              <text class="c-c-6 c-m-l-10">个</text>
            </text>
          </view>
          <view>
            <text class="label">完工数</text>
            <text class="value">
              {{ formData.finish || '' }}
              <text class="c-c-6 c-m-l-10">个</text>
            </text>
          </view>
        </view>
      </block>
    </view>
    <!-- 微信小程序 日历 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-calendar
      :show="calendarShow"
      :show-confirm="false"
      @close="onCalendarClose"
      @confirm="onCalendarConfirm"
      :first-day-of-week="1"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="defaultDate"
      color="#0068b0"
    />
    <!-- #endif -->
    <!-- App端 日历 -->
    <!-- #ifdef APP-PLUS -->
    <uni-calendar
      ref="calendar"
      :insert="false"
      :date="day"
      startDate="2023-04-01"
      :endDate="endDate"
      @confirm="onCalendarConfirm"
    />
    <!-- #endif -->
    <!-- 年月 -->
    <van-popup :show="monthShow" position="bottom">
      <van-datetime-picker
        type="year-month"
        :value="month"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onMonthConfirm"
        @cancel="onMonthCancel"
        :formatter="formatMonthPicker"
      />
    </van-popup>
    <!-- 年 -->
    <van-action-sheet
      :show="yearShow"
      :actions="years"
      cancel-text="取消"
      @select="onYearSelect"
      @close="onYearCancel"
      @cancel="onYearCancel"
    />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      type: '', // boss老板通 growth成长通
      url: 'basic/boss/quota', // 老板通
      currentRoleId: '',

      activeTab: 'day',
      formData: {},

      day: this.formatDate(new Date().getTime() - 24 * 60 * 60 * 1000),
      month: null,
      monthStr: '',
      year: '',

      minDate: new Date('2023/04/01').getTime(), // 可选择的最小日期
      maxDate: new Date().getTime() - 24 * 60 * 60 * 1000, // 可选择的最大日期 昨天
      endDate: '',
      endMonth: '',
      defaultDate: new Date().getTime() - 24 * 60 * 60 * 1000, // 默认选中的日期 昨天

      calendarShow: false,
      monthShow: false,
      yearShow: false,

      years: [{ name: 2023 }]
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.type = params.type;
    // 老板通和成长通接口不同
    if (this.type == 'growth') {
      // 成长通
      let currentRole = wx.getStorageSync('currentRole');
      this.currentRoleId = currentRole._id;
      // 内勤 查看工单数和转化率
      if (currentRole._id == '6631748470755706348') {
        this.url = 'basic/growth/saStatistics';
      }
      // 管家 查看合同额、合同数、客单价
      if (currentRole._id == '3481370558631265818') {
        this.url = 'basic/growth/contractStatistics';
      }
      // 工队 查看进场数、交付验收数、完工数
      if (currentRole._id == '1259263938717893739') {
        this.url = 'basic/growth/constructionStatistics';
      }
    }

    // 获取昨日
    this.day = this.formatDate(new Date().getTime() - 24 * 60 * 60 * 1000);
    // #ifdef APP-PLUS
    this.endDate = this.day;
    // #endif

    // 获取昨日年月
    this.month = new Date().getTime() - 24 * 60 * 60 * 1000;
    this.monthStr = this.formatMonth(new Date().getTime() - 24 * 60 * 60 * 1000);
    // #ifdef APP-PLUS
    this.endMonth = this.monthStr;
    // #endif

    // 获取昨日年
    this.year = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).getFullYear();
    // 获取年的选项
    for (let i = 0; i < this.year - 2023; i++) {
      this.years.push({ name: 2023 + i + 1 });
    }
    this.getData();
  },
  methods: {
    onTabChange(e) {
      this.activeTab = e.detail.name;
      this.getData();
    },
    getData() {
      let timeType, timeValue;
      switch (this.activeTab) {
        case 'day':
          timeType = 1;
          timeValue = this.day.replace(/\//g, '-');
          break;
        case 'month':
          timeType = 2;
          timeValue = this.monthStr.replace(/\//g, '-');
          break;
        case 'year':
          timeType = 3;
          timeValue = String(this.year);
          break;
      }
      common.osg.ajax(
        this.url,
        {
          timeType,
          timeValue
        },
        res => {
          this.formData = res.data;
        }
      );
    },
    /**
     * 日历
     */
    formatDate(date) {
      date = new Date(date);
      // #ifdef MP-WEIXIN
      return `${date.getFullYear()}/${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }/${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      // #endif
      // #ifdef APP-PLUS
      return `${date.getFullYear()}-${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      // #endif
    },
    onCalendarDisplay() {
      // #ifdef MP-WEIXIN
      this.calendarShow = true;
      // #endif
      // #ifdef APP-PLUS
      this.$refs.calendar.open();
      // #endif
    },
    onCalendarConfirm(event) {
      // #ifdef MP-WEIXIN
      this.calendarShow = false;
      this.day = this.formatDate(event.detail);
      // #endif
      // #ifdef APP-PLUS
      this.day = event.fulldate;
      // #endif
      console.log('onCalendarConfirm-this.data', this.day);
      this.getData();
    },
    onCalendarClose() {
      this.calendarShow = false;
    },
    /**
     * 年月
     */
    formatMonthPicker(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    formatMonth(date) {
      date = new Date(date);
      // #ifdef MP-WEIXIN
      return `${date.getFullYear()}/${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }`;
      // #endif
      // #ifdef APP-PLUS
      return `${date.getFullYear()}-${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }`;
      // #endif
    },
    onMonthDisplay() {
      this.monthShow = true;
    },
    onMonthConfirm(event) {
      // #ifdef MP-WEIXIN
      this.monthShow = false;
      this.month = event.detail;
      this.monthStr = this.formatMonth(event.detail);
      // #endif
      // #ifdef APP-PLUS
      this.monthStr = event.detail.value;
      // #endif
      this.getData();
    },
    onMonthCancel() {
      this.monthShow = false;
    },
    /**
     * 年
     */
    onYearDisplay() {
      this.years.map(item => {
        if (item.name == this.year) {
          item.color = '#0068b0';
        } else {
          delete item.color;
        }
      });
      this.yearShow = true;
    },
    onYearSelect(event) {
      this.yearShow = false;
      this.year = event.detail.name;
      this.getData();
    },
    onYearCancel() {
      this.yearShow = false;
    }
  }
};
</script>

<style lang="scss">
.data {
  .card {
    width: calc(100vw - 20px);
    margin: 10px;
    box-sizing: border-box;
    border-radius: 8px;
    background: #fff;
    font-size: 14px;
    border: 1rpx solid #ebebeb;
    .title {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      border-bottom: 1rpx solid #ebebeb;
      .label {
        color: #0068b0;
      }
      .value {
        color: #666;
      }
    }
    .content {
      padding: 0 15px;
      > view {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .label {
      color: #666;
    }
    .value {
      color: #000;
    }
  }
  // 日历组件不显示今日快捷按钮，不允许选择今日
  .uni-calendar__backtoday {
    display: none;
  }
}
</style>
