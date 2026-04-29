<template>
  <view class="uni-calendar">
    <view
      v-if="!insert && show"
      class="uni-calendar__mask"
      :class="{ 'uni-calendar--mask-show': aniMaskShow }"
      @click="clean"
    ></view>
    <view
      v-if="insert || show"
      class="uni-calendar__content"
      :class="{
        'uni-calendar--fixed': !insert,
        'uni-calendar--ani-show': aniMaskShow
      }"
    >
      <view v-if="!insert" class="uni-calendar__header uni-calendar--fixed-top">
        <view class="uni-calendar__header-btn-box" @click="close">
          <text class="uni-calendar__header-text uni-calendar--fixed-width">{{ cancelText }}</text>
        </view>
        <view class="uni-calendar__header-btn-box" @click="confirm">
          <text class="uni-calendar__header-text uni-calendar--fixed-width">{{ okText }}</text>
        </view>
      </view>
      <view class="uni-calendar__header">
        <!-- 切换月份 -->
        <view style="display: flex; align-items: center; height: 40px">
          <view class="uni-calendar__header-btn-box" style="margin-right: 10px" @click.stop="pre">
            <uni-icons type="left" color="#969799" size="16"></uni-icons>
          </view>
          <picker mode="date" :value="date" fields="month" @change="bindDateChange">
            <text class="uni-calendar__header-text">
              {{ (nowDate.year || '') + ' / ' + (nowDate.month || '') }}
            </text>
          </picker>
          <view class="uni-calendar__header-btn-box" style="margin-left: 10px" @click.stop="next">
            <uni-icons type="right" color="#969799" size="16"></uni-icons>
          </view>
        </view>
        <!-- 日历设置 -->
        <view v-if="collapsible" class="uni-calendar__mode__view">
          <view
            class="uni-calendar__mode"
            :style="mode == 1 ? 'color:#ff6900' : ''"
            @click="modeChange(1)"
          >
            <image
              :src="
                mode == 1
                  ? 'https://pub.fsgo365.cn/icon-calendar-1-check.png'
                  : 'https://pub.fsgo365.cn/icon-calendar-1.png'
              "
              class="uni-calendar__mode__image"
            ></image>
          </view>
          <view
            class="uni-calendar__mode"
            :style="mode == 2 ? 'color:#ff6900' : ''"
            @click="modeChange(2)"
          >
            <image
              :src="
                mode == 2
                  ? 'https://pub.fsgo365.cn/icon-calendar-2-check.png'
                  : 'https://pub.fsgo365.cn/icon-calendar-2.png'
              "
              class="uni-calendar__mode__image"
            ></image>
          </view>
          <view
            class="uni-calendar__mode"
            :style="mode == 3 ? 'color:#ff6900' : ''"
            @click="modeChange(3)"
          >
            <image
              :src="
                mode == 3
                  ? 'https://pub.fsgo365.cn/icon-calendar-3-check.png'
                  : 'https://pub.fsgo365.cn/icon-calendar-3.png'
              "
              class="uni-calendar__mode__image"
            ></image>
          </view>
          <!-- <view class="uni-calendar__mode" @click="toggleCollapse">
            <image
              src="https://pub.fsgo365.cn/icon-calendar-31.png"
              class="uni-calendar__mode__image"
            ></image>
            <text>月</text>
          </view>
          <view class="uni-calendar__mode" @click="backToday">
            <image
              src="https://pub.fsgo365.cn/icon-calendar-today.png"
              class="uni-calendar__mode__image"
            ></image>
            <text>回到今天</text>
          </view> -->
        </view>
      </view>
      <view
        class="uni-calendar__box"
        :class="{ 'uni-calendar__box--collapsed': isCollapsed }"
        :style="{
          height: currentHeight + 'px',
          transition: transitionEnabled ? 'height 0.3s ease' : 'none'
        }"
      >
        <view v-if="showMonth && !isCollapsed" class="uni-calendar__box-bg">
          <text class="uni-calendar__box-bg-text">{{ nowDate.month }}</text>
        </view>
        <view
          class="uni-calendar__weeks"
          :class="{ 'uni-calendar__weeks-three-mode': isCollapsed && mode === 3 }"
        >
          <!-- 当折叠且3日模式时只显示3个日期对应的周几 -->
          <template v-if="isCollapsed && mode === 3">
            <view
              v-for="(dateStr, idx) in getSortedSelectedDates()"
              :key="dateStr"
              class="uni-calendar__weeks-day"
            >
              <text class="uni-calendar__weeks-day-text">
                {{ getWeekDayTextByDate(dateStr) }}
              </text>
            </view>
          </template>
          <!-- 其他情况显示完整周几 -->
          <template v-else>
            <view
              class="uni-calendar__weeks-day"
              v-for="(text, index) in [
                SUNText,
                monText,
                TUEText,
                WEDText,
                THUText,
                FRIText,
                SATText
              ]"
              :key="index"
            >
              <text class="uni-calendar__weeks-day-text">{{ text }}</text>
            </view>
          </template>
        </view>
        <view
          class="uni-calendar__weeks-container"
          :style="containerStyle"
          :class="{ 'cross-week-mode': isInCrossWeekMode && isCollapsed && mode === 3 }"
        >
          <view v-if="isCollapsed && mode === 3" class="uni-calendar__three-days-container">
            <view
              v-for="(dateStr, idx) in getSortedSelectedDates()"
              :key="dateStr"
              class="uni-calendar__three-days-item"
            >
              <view class="uni-calendar__weeks-item">
                <calendar-item
                  class="uni-calendar-item--hook"
                  :weeks="getWeeksByDate(dateStr)"
                  :calendar="calendar"
                  :selected="selected"
                  :lunar="lunar"
                  @change="choiceDate"
                ></calendar-item>
              </view>
            </view>
          </view>
          <view
            v-else
            v-for="(item, key) in weeks"
            :key="key"
            class="uni-calendar__weeks"
            :style="{
              transform: isCollapsed ? `translateY(${-currentWeekIndex * 50}px)` : 'none'
            }"
          >
            <view class="uni-calendar__weeks-item" v-for="(weeks, index) in item" :key="index">
              <calendar-item
                class="uni-calendar-item--hook"
                :weeks="weeks"
                :calendar="calendar"
                :selected="selected"
                :lunar="lunar"
                @change="choiceDate"
              ></calendar-item>
            </view>
          </view>
        </view>
      </view>
      <view
        v-if="insert && collapsible"
        class="uni-calendar__drag-area"
        :class="{
          'uni-calendar__drag-area--active': isDragging,
          'uni-calendar__drag-area--dragging': isDragging && dragOffset !== 0
        }"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <view class="uni-calendar__drag-indicator"></view>
      </view>
    </view>
  </view>
</template>

<script>
import Calendar from './util.js';
import CalendarItem from './uni-calendar-item.vue';

import { initVueI18n } from '@dcloudio/uni-i18n';
import i18nMessages from './i18n/index.js';
const { t } = initVueI18n(i18nMessages);

import UniIcons from '../../../uni-icons/components/uni-icons/uni-icons.vue';

/**
 * Calendar 日历
 * @description 日历组件可以查看日期，选择任意范围内的日期，打点操作。常用场景如：酒店日期预订、火车机票选择购买日期、上下班打卡等
 * @tutorial https://ext.dcloud.net.cn/plugin?id=56
 * @property {String} date 自定义当前时间，默认为今天
 * @property {Boolean} lunar 显示农历
 * @property {String} startDate 日期选择范围-开始日期
 * @property {String} endDate 日期选择范围-结束日期
 * @property {Boolean} range 范围选择
 * @property {Boolean} insert = [true|false] 插入模式,默认为false
 * 	@value true 弹窗模式
 * 	@value false 插入模式
 * @property {Boolean} clearDate = [true|false] 弹窗模式是否清空上次选择内容
 * @property {Array} selected 打点，期待格式[{date: '2019-06-27', info: '签到', data: { custom: '自定义信息', name: '自定义消息头',xxx:xxx... }}]
 * @property {Boolean} showMonth 是否选择月份为背景
 * @event {Function} change 日期改变，`insert :ture` 时生效
 * @event {Function} confirm 确认选择`insert :false` 时生效
 * @event {Function} monthSwitch 切换月份时触发
 * @example <uni-calendar :insert="true":lunar="true" :start-date="'2019-3-2'":end-date="'2019-5-20'"@change="change" />
 */
export default {
  components: {
    CalendarItem,
    UniIcons
  },
  emits: ['close', 'confirm', 'change', 'monthSwitch', 'modeChange'],
  props: {
    date: {
      type: String,
      default: ''
    },
    selected: {
      type: Array,
      default() {
        return [];
      }
    },
    lunar: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    },
    range: {
      type: Boolean,
      default: false
    },
    insert: {
      type: Boolean,
      default: true
    },
    showMonth: {
      type: Boolean,
      default: true
    },
    clearDate: {
      type: Boolean,
      default: true
    },
    // 控制日历是否可以折叠
    collapsible: {
      type: Boolean,
      default: false
    },
    // 日历模式 1:1天 3:3天
    mode: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      show: false,
      weeks: {},
      calendar: {},
      nowDate: '',
      aniMaskShow: false,
      isCollapsed: true,
      currentWeekIndex: 0,
      touchStartY: 0,
      touchMoveY: 0,
      isDragging: false,
      dragThreshold: 30,
      dragOffset: 0,
      isInCrossWeekMode: false,
      dragHeight: 0,
      isDraggingTransition: false,
      boxHeight: 350, // 默认展开高度
      minHeight: 100, // 折叠状态高度
      maxHeight: 350, // 展开状态高度
      animationData: {}, // 动画数据
      currentHeight: 100, // 当前高度(px)
      collapsedHeight: 100, // 折叠状态高度
      expandedHeight: 350, // 展开状态高度
      transitionEnabled: true // 是否启用过渡效果
    };
  },
  computed: {
    /**
     * for i18n
     */

    okText() {
      return t('uni-calender.ok');
    },
    cancelText() {
      return t('uni-calender.cancel');
    },
    todayText() {
      return t('uni-calender.today');
    },
    monText() {
      return t('uni-calender.MON');
    },
    TUEText() {
      return t('uni-calender.TUE');
    },
    WEDText() {
      return t('uni-calender.WED');
    },
    THUText() {
      return t('uni-calender.THU');
    },
    FRIText() {
      return t('uni-calender.FRI');
    },
    SATText() {
      return t('uni-calender.SAT');
    },
    SUNText() {
      return t('uni-calender.SUN');
    },
    containerStyle() {
      if (this.isDraggingTransition) {
        const baseHeight = this.isCollapsed ? 50 : 350; // 假设完整展开高度约350px
        const currentHeight = baseHeight + (this.isCollapsed ? this.dragHeight : -this.dragHeight);
        return {
          height: `${currentHeight}px`,
          overflow: 'hidden',
          transition: 'none' // 拖拽时不使用过渡，以实现即时反馈
        };
      } else if (this.isCollapsed) {
        return {
          height: '50px',
          overflow: 'hidden',
          transition: 'height 0.3s ease'
        };
      }
      return {
        transition: 'height 0.3s ease'
      };
    },
    selectedWeekLabels() {
      if (this.cale && this.cale.multipleStatus && this.cale.multipleStatus.data) {
        const weekDays = [
          this.SUNText, // 0 - 周日
          this.monText, // 1 - 周一
          this.TUEText, // 2 - 周二
          this.WEDText, // 3 - 周三
          this.THUText, // 4 - 周四
          this.FRIText, // 5 - 周五
          this.SATText // 6 - 周六
        ];

        // 对选中的日期按顺序排序并获取对应的周几
        return this.cale.multipleStatus.data
          .sort((a, b) => new Date(a.replace(/-/g, '/')) - new Date(b.replace(/-/g, '/')))
          .map(dateStr => {
            const date = new Date(dateStr.replace(/-/g, '/'));
            const dayOfWeek = date.getDay(); // 0是周日，1-6是周一至周六
            return weekDays[dayOfWeek];
          });
      }

      return [this.monText, this.TUEText, this.WEDText]; // 默认值
    },
    boxDragStyle() {
      if (this.isDragging) {
        // 计算拖拽时的高度
        const baseHeight = this.isCollapsed ? 100 : 350; // 基础高度（折叠或展开状态）
        let newHeight;

        if (this.isCollapsed) {
          // 从折叠状态向下拖动，高度增加
          newHeight = Math.min(350, baseHeight + this.dragOffset);
        } else {
          // 从展开状态向上拖动，高度减少
          newHeight = Math.max(100, baseHeight + this.dragOffset);
        }

        return {
          height: `${newHeight}px`,
          transition: 'none' // 拖动时不需要过渡
        };
      }

      return {
        transition: 'height 0.3s ease' // 松手后的过渡效果
      };
    }
  },
  watch: {
    date(newVal) {
      this.init(newVal);
    },
    startDate(val) {
      this.cale.resetSatrtDate(val);
      this.cale.setDate(this.nowDate.fullDate);
      this.weeks = this.cale.weeks;
    },
    endDate(val) {
      this.cale.resetEndDate(val);
      this.cale.setDate(this.nowDate.fullDate);
      this.weeks = this.cale.weeks;
    },
    selected(newVal) {
      this.cale.setSelectInfo(this.nowDate.fullDate, newVal);
      this.weeks = this.cale.weeks;
    },
    currentWeekIndex: {
      immediate: true,
      handler(newVal) {
        // console.log('周索引变化:', newVal);
        // console.log('对应的周数据:', this.weeks[newVal]);
      }
    },
    isCollapsed: {
      immediate: true,
      handler(newVal) {
        // console.log('折叠状态变化:', newVal);
        // console.log('当前周索引:', this.currentWeekIndex);
      }
    },
    mode(newVal) {
      if (!this.collapsible) return;

      // 清除选中状态
      this.cale.cleanMultipleStatus();

      // 确保range属性设置正确
      if (newVal > 1) {
        this.cale.range = true;
      } else {
        this.cale.range = false;
      }

      // 重新初始化日期
      const today = new Date();
      const currentDate = this.cale.getDate(today).fullDate;

      if (newVal > 1) {
        // 范围选择模式
        if (newVal == 2) {
          // 选中今天作为开始
          this.calendar = this.cale.getInfo(currentDate);

          // 设置结束日期为明天
          const endDay = new Date(today);
          endDay.setDate(today.getDate() + 1);
          const endDate = this.cale.getDate(endDay).fullDate;

          // 设置完整的日期范围
          this.cale.multipleStatus.before = currentDate;
          this.cale.multipleStatus.after = endDate;

          // 直接设置数据，而不是使用generateMultipleDays方法
          this.cale.multipleStatus.data = [currentDate, endDate];
        } else if (newVal === 3) {
          // 选中今天作为开始
          this.calendar = this.cale.getInfo(currentDate);

          // 设置结束日期为两天后
          const endDay = new Date(today);
          endDay.setDate(today.getDate() + 2);
          const endDate = this.cale.getDate(endDay).fullDate;

          // 手动创建中间日期（明天）
          const middleDay = new Date(today);
          middleDay.setDate(today.getDate() + 1);
          const middleDate = this.cale.getDate(middleDay).fullDate;

          // 设置完整的日期范围
          this.cale.multipleStatus.before = currentDate;
          this.cale.multipleStatus.after = endDate;

          // 直接设置数据，而不是使用generateMultipleDays方法
          this.cale.multipleStatus.data = [currentDate, middleDate, endDate];
        }

        // 更新周视图
        this._getWeek(currentDate);

        // 强制遍历所有日期，更新其multiple状态
        for (const weekKey in this.cale.weeks) {
          const week = this.cale.weeks[weekKey];
          week.forEach(day => {
            if (this.cale.multipleStatus.data.includes(day.fullDate)) {
              day.multiple = true;
            }
          });
        }

        this.weeks = this.cale.weeks; // 更新视图

        // 更新当前选中周的索引，确保折叠时显示正确的周
        this.updateCurrentWeekIndex(this.calendar);
      } else {
        // 单选模式，只选中当天
        this.init(currentDate);
      }

      // 触发选择变化事件
      this.change();
    },
    selectedWeekLabels: {
      handler(val) {
        console.log('selectedWeekLabels changed:', val);
      },
      immediate: true
    }
  },
  created() {
    this.cale = new Calendar({
      selected: this.selected,
      startDate: this.startDate,
      endDate: this.endDate,
      range: this.range
    });
    this.init(this.date);

    // 初始化高度
    this.currentHeight = this.isCollapsed ? this.collapsedHeight : this.expandedHeight;
  },
  methods: {
    touchStart(e) {
      if (!this.collapsible || !this.insert) return;
      this.touchStartY = e.touches[0].clientY;
      this.isDragging = true;
      this.dragOffset = 0;

      // 禁用过渡效果，以便实时更新高度
      this.transitionEnabled = false;

      e.stopPropagation();
    },

    touchMove(e) {
      if (!this.isDragging || !this.collapsible || !this.insert) return;

      this.touchMoveY = e.touches[0].clientY;
      this.dragOffset = this.touchMoveY - this.touchStartY;

      // 计算当前高度
      if (this.isCollapsed) {
        // 从折叠状态下拉
        if (this.dragOffset > 0) {
          this.currentHeight = this.collapsedHeight + this.dragOffset;
          // 限制最大高度
          if (this.currentHeight > this.expandedHeight) {
            this.currentHeight = this.expandedHeight;
          }
        }
      } else {
        // 从展开状态上拉
        if (this.dragOffset < 0) {
          this.currentHeight = this.expandedHeight + this.dragOffset;
          // 限制最小高度
          if (this.currentHeight < this.collapsedHeight) {
            this.currentHeight = this.collapsedHeight;
          }
        }
      }

      e.stopPropagation();
      e.preventDefault();
    },

    touchEnd(e) {
      if (!this.isDragging || !this.collapsible || !this.insert) return;

      // 重新启用过渡效果
      this.transitionEnabled = true;

      const moveDistance = this.touchMoveY - this.touchStartY;

      if (Math.abs(moveDistance) > this.dragThreshold) {
        if (moveDistance < 0 && !this.isCollapsed) {
          // 从展开状态上拉到阈值，需要折叠
          this.currentHeight = this.collapsedHeight;
          this.isCollapsed = true;
          this.collapse();
        } else if (moveDistance > 0 && this.isCollapsed) {
          // 从折叠状态下拉到阈值，需要展开
          this.currentHeight = this.expandedHeight;
          this.isCollapsed = false;
          this.expand();
        } else {
          // 回弹到原始状态
          this.currentHeight = this.isCollapsed ? this.collapsedHeight : this.expandedHeight;
        }
      } else {
        // 拖动距离不够，回弹
        this.currentHeight = this.isCollapsed ? this.collapsedHeight : this.expandedHeight;
      }

      // 重置拖拽状态
      this.isDragging = false;
      this.dragOffset = 0;
      this.touchStartY = 0;
      this.touchMoveY = 0;

      e.stopPropagation();
    },

    choiceDate(weeks) {
      if (weeks.disable) return;

      // 记录当前选择的日期
      this.calendar = weeks;

      // 如果是范围选择模式且是3天模式
      if (this.range) {
        // 清除之前的选择状态
        this.cale.cleanMultipleStatus();
        // 设置当前选择日期为开始日期
        const startDate = weeks.fullDate;
        // 计算后两天的日期
        const startDay = new Date(startDate.replace(/-/g, '/'));
        const endDay = new Date(startDay);
        let endDate = null;
        if (this.mode === 2) {
          // 获取后天（第3天）
          endDay.setDate(startDay.getDate() + 1);
          endDate = this.cale.getDate(endDay).fullDate;
        } else if (this.mode === 3) {
          // 获取后天（第3天）
          endDay.setDate(startDay.getDate() + 2);
          endDate = this.cale.getDate(endDay).fullDate;
        }

        // 设置范围的起始和结束
        this.cale.multipleStatus.before = startDate;
        this.cale.multipleStatus.after = endDate;

        // 生成连续3天的日期数组
        this.cale.multipleStatus.data = this.cale.geDateAll(startDate, endDate);

        // 更新日历视图
        this.cale._getWeek(startDate);
        this.weeks = this.cale.weeks;
      } else {
        // 原有的单选处理逻辑
        this.cale.setMultiple(this.calendar.fullDate);
        this.weeks = this.cale.weeks;
      }

      // 更新当前周索引和触发change事件
      this.updateCurrentWeekIndex(weeks);
      this.change();

      // 在选择日期后，检查并强制更新 selectedWeekLabels
      if (this.mode > 1 && this.isCollapsed) {
        this.$forceUpdate();
      }
    },

    updateCurrentWeekIndex(selectedWeeks) {
      if (!selectedWeeks || !selectedWeeks.fullDate) return;

      const weekKeys = Object.keys(this.weeks);
      for (const key of weekKeys) {
        const week = this.weeks[key];
        const found = week.some(day => day.fullDate === selectedWeeks.fullDate);
        if (found) {
          this.currentWeekIndex = parseInt(key);
          // console.log('设置周索引为:', this.currentWeekIndex);
          return;
        }
      }
    },

    clean() {},
    bindDateChange(e) {
      const value = e.detail.value + '-1';
      this.setDate(value);

      const { year, month } = this.cale.getDate(value);
      this.$emit('monthSwitch', {
        year,
        month
      });
    },
    init(date) {
      this.cale.setDate(date);
      this.weeks = this.cale.weeks;
      this.nowDate = this.calendar = this.cale.getInfo(date);

      if (this.calendar.fullDate) {
        this.updateCurrentWeekIndex(this.calendar);
      }
    },
    open() {
      if (this.clearDate && !this.insert) {
        this.cale.cleanMultipleStatus();
        this.init(this.date);
      }
      this.show = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.aniMaskShow = true;
        }, 50);
      });
    },
    close() {
      this.aniMaskShow = false;
      this.$nextTick(() => {
        setTimeout(() => {
          this.show = false;
          this.$emit('close');
        }, 300);
      });
    },
    confirm() {
      this.setEmit('confirm');
      this.close();
    },
    change() {
      if (!this.insert) return;
      this.setEmit('change');
    },
    monthSwitch() {
      let { year, month } = this.nowDate;
      this.$emit('monthSwitch', {
        year,
        month: Number(month)
      });
    },
    setEmit(name) {
      let { year, month, date, fullDate, lunar, extraInfo } = this.calendar;
      this.$emit(name, {
        range: this.cale.multipleStatus,
        year,
        month,
        date,
        fulldate: fullDate,
        lunar,
        extraInfo: extraInfo || {}
      });
    },
    backToday() {
      const date = this.cale.getDate(new Date()).fullDate;

      // 如果是范围选择模式且是3天模式
      if (this.range) {
        // 清除之前的选择状态
        this.cale.cleanMultipleStatus();

        // 设置今天为开始日期
        const startDate = date;

        // 计算后两天的日期
        const today = new Date();

        if (this.mode === 2) {
          // 获取后天（第3天）
          const endDay = new Date(today);
          endDay.setDate(today.getDate() + 1);
          const endDate = this.cale.getDate(endDay).fullDate;
          // 设置范围的起始和结束
          this.cale.multipleStatus.before = startDate;
          this.cale.multipleStatus.after = endDate;
          this.cale.multipleStatus.data = [startDate, endDate];
        } else if (this.mode === 3) {
          // 获取后天（第3天）
          const endDay = new Date(today);
          endDay.setDate(today.getDate() + 2);
          const endDate = this.cale.getDate(endDay).fullDate;

          // 获取明天（第2天）
          const middleDay = new Date(today);
          middleDay.setDate(today.getDate() + 1);
          const middleDate = this.cale.getDate(middleDay).fullDate;

          // 设置范围的起始和结束
          this.cale.multipleStatus.before = startDate;
          this.cale.multipleStatus.after = endDate;
          this.cale.multipleStatus.data = [startDate, middleDate, endDate];
        }

        // 初始化日历并设置当前日期
        this.init(date);
        this.calendar = this.cale.getInfo(date);

        // 更新视图
        this._getWeek(startDate);
        this.weeks = this.cale.weeks;
      } else {
        // 原有的单选处理逻辑
        const oldDate = this.calendar.fullDate;
        this.init(date);
        if (oldDate) {
          this.updateCurrentWeekIndex(this.calendar);
        }
      }

      // 触发change事件
      this.change();
    },
    _getWeek(dateString) {
      const date = this.cale.getDate(dateString);
      this.cale.setDate(dateString);
      this.weeks = this.cale.weeks;
      this.nowDate = date;
    },
    modeChange(value) {
      this.mode = value;

      // 清除选中状态
      this.cale.cleanMultipleStatus();

      // 更新日历range属性
      this.cale.range = value > 1;

      // 重新渲染日历
      const today = new Date();
      const currentDate = this.cale.getDate(today).fullDate;
      this.init(currentDate);

      // 根据模式设置选中状态
      if (value === 2) {
        // 先选中今天
        this.choiceDate(this.calendar);

        // 获取明天
        const endDay = new Date(today);
        endDay.setDate(today.getDate() + 1);
        const endDate = this.cale.getDate(endDay).fullDate;

        // 手动模拟选中明天
        const endDateInfo = this.cale.getInfo(endDate);
        if (endDateInfo) {
          // 设置结束日期
          this.cale.multipleStatus.after = endDate;

          this.cale.multipleStatus.data = [currentDate, endDate];

          // 重新渲染
          this.weeks = this.cale.weeks;

          // 触发change事件
          this.change();
        }
      }

      // 根据模式设置选中状态
      if (value === 3) {
        // 先选中今天
        this.choiceDate(this.calendar);

        // 获取后天
        const endDay = new Date(today);
        endDay.setDate(today.getDate() + 2);
        const endDate = this.cale.getDate(endDay).fullDate;

        // 手动模拟选中后天
        const endDateInfo = this.cale.getInfo(endDate);
        if (endDateInfo) {
          // 设置结束日期
          this.cale.multipleStatus.after = endDate;

          // 手动生成所有日期（今天、明天、后天）
          const middleDay = new Date(today);
          middleDay.setDate(today.getDate() + 1);
          const middleDate = this.cale.getDate(middleDay).fullDate;

          this.cale.multipleStatus.data = [currentDate, middleDate, endDate];

          // 重新渲染
          this.weeks = this.cale.weeks;

          // 触发change事件
          this.change();
        }
      }

      // 通知外部
      this.$emit('modeChange', value);

      // 确保模式变化后更新视图
      if (value > 1) {
        this.$nextTick(() => {
          // 可能需要强制刷新计算属性
          this.$forceUpdate();
        });
      }
    },
    pre() {
      const preDate = this.cale.getDate(this.nowDate.fullDate, -1, 'month').fullDate;
      this.setDate(preDate);
      this.monthSwitch();
    },
    next() {
      const nextDate = this.cale.getDate(this.nowDate.fullDate, +1, 'month').fullDate;
      this.setDate(nextDate);
      this.monthSwitch();
    },
    setDate(date) {
      const oldDate = this.calendar.fullDate;

      this.cale.setDate(date);
      this.weeks = this.cale.weeks;
      this.nowDate = this.cale.getInfo(date);

      if (oldDate) {
        this.updateCurrentWeekIndex(this.calendar);
      }
    },
    collapse() {
      if (this.calendar && this.calendar.fullDate) {
        this.updateCurrentWeekIndex(this.calendar);
      }

      // 启用过渡效果
      this.transitionEnabled = true;
      // 设置折叠高度
      this.currentHeight = this.collapsedHeight;
      this.isCollapsed = true;

      // 3天模式下折叠时，单独处理布局
      if (this.mode === 3 && this.cale.multipleStatus && this.cale.multipleStatus.data) {
        this.$nextTick(() => {
          // 处理跨周的情况
          this.adjustCrossWeekDisplay();
        });
      }
    },
    expand() {
      // 启用过渡效果
      this.transitionEnabled = true;
      // 设置展开高度
      this.currentHeight = this.expandedHeight;
      this.isCollapsed = false;

      // 移除跨周模式样式
      this.$nextTick(() => {
        // 使用标志位而不是DOM操作
        this.isInCrossWeekMode = false;
      });

      // 3天模式下展开时，恢复完整月视图
      if (this.mode === 3) {
        this.$nextTick(() => {
          // 强制更新视图
          this.weeks = { ...this.weeks };
        });
      }
    },
    scrollToSelectedWeek() {
      if (this.isCollapsed && this.currentWeekIndex !== '0') {
        const weekElements = this.$el.querySelectorAll('.uni-calendar__weeks');
        if (weekElements[this.currentWeekIndex]) {
          weekElements[this.currentWeekIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    },
    shouldShowWeek(weekIndex) {
      return !this.isCollapsed || weekIndex === this.currentWeekIndex;
    },
    // 添加处理跨周情况的方法
    adjustCrossWeekDisplay() {
      // 确保有选择的日期
      if (
        !this.cale.multipleStatus ||
        !this.cale.multipleStatus.data ||
        this.cale.multipleStatus.data.length === 0
      ) {
        return;
      }

      // 排序选中的日期
      const sortedDates = [...this.cale.multipleStatus.data].sort(
        (a, b) => new Date(a.replace(/-/g, '/')) - new Date(b.replace(/-/g, '/'))
      );

      // 检查日期是否跨周
      let crossWeek = false;
      let weekIndices = [];

      // 查找每个日期所在的周索引
      for (const date of sortedDates) {
        for (const weekKey in this.weeks) {
          const week = this.weeks[weekKey];
          const found = week.some(day => day.fullDate === date);
          if (found) {
            weekIndices.push(parseInt(weekKey));
            break;
          }
        }
      }

      // 如果有多个不同周索引，说明跨周了
      crossWeek = new Set(weekIndices).size > 1;

      if (crossWeek) {
        // 单独为跨周模式添加特殊样式 - 使用标志位控制
        this.$nextTick(() => {
          this.isInCrossWeekMode = true;
        });
      }
    },
    getSelectedDaysOfWeek() {
      if (!this.cale || !this.cale.multipleStatus || !this.cale.multipleStatus.data) {
        return [this.monText, this.TUEText, this.WEDText];
      }

      const weekDays = [
        this.SUNText, // 周日
        this.monText, // 周一
        this.TUEText, // 周二
        this.WEDText, // 周三
        this.THUText, // 周四
        this.FRIText, // 周五
        this.SATText // 周六
      ];

      // 按日期排序并获取对应的周几
      return this.getSortedSelectedDates().map(dateStr => {
        const date = new Date(dateStr.replace(/-/g, '/'));
        const dayOfWeek = date.getDay(); // 0是周日，1-6是周一至周六
        return weekDays[dayOfWeek];
      });
    },
    getSortedSelectedDates() {
      if (!this.cale || !this.cale.multipleStatus || !this.cale.multipleStatus.data) {
        return [];
      }

      // 对日期进行排序
      return [...this.cale.multipleStatus.data].sort(
        (a, b) => new Date(a.replace(/-/g, '/')) - new Date(b.replace(/-/g, '/'))
      );
    },
    getWeeksByDate(dateStr) {
      for (const weekKey in this.weeks) {
        const week = this.weeks[weekKey];
        for (const day of week) {
          if (day.fullDate === dateStr) {
            return day;
          }
        }
      }
      return null;
    },
    getWeekDayTextByDate(dateStr) {
      if (!dateStr) return '';

      const weekDays = [
        this.SUNText, // 0 - 周日
        this.monText, // 1 - 周一
        this.TUEText, // 2 - 周二
        this.WEDText, // 3 - 周三
        this.THUText, // 4 - 周四
        this.FRIText, // 5 - 周五
        this.SATText // 6 - 周六
      ];

      const date = new Date(dateStr.replace(/-/g, '/'));
      const dayOfWeek = date.getDay(); // 0是周日，1-6是周一至周六
      return weekDays[dayOfWeek];
    },
    toggleCollapse() {
      if (this.isCollapsed) {
        // 如果当前是折叠状态，则展开
        this.expand();
      } else {
        // 如果当前是展开状态，则折叠
        this.collapse();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$uni-bg-color-mask: rgba(
  $color: #000000,
  $alpha: 0.4
);
$uni-border-color: #ededed;
$uni-text-color: #333;
$uni-bg-color-hover: #f1f1f1;
$uni-font-size-base: 14px;
$uni-text-color-placeholder: #808080;
$uni-color-subtitle: #555555;
$uni-text-color-grey: #999;
.uni-calendar {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}

.uni-calendar__mask {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color: $uni-bg-color-mask;
  transition-property: opacity;
  transition-duration: 0.3s;
  opacity: 0;
  /* #ifndef APP-NVUE */
  z-index: 99;
  /* #endif */
}

.uni-calendar--mask-show {
  opacity: 1;
}

.uni-calendar--fixed {
  position: fixed;
  /* #ifdef APP-NVUE */
  bottom: 0;
  /* #endif */
  left: 0;
  right: 0;
  transition-property: transform;
  transition-duration: 0.3s;
  transform: translateY(460px);
  /* #ifndef APP-NVUE */
  bottom: calc(var(--window-bottom));
  z-index: 99;
  /* #endif */
}

.uni-calendar--ani-show {
  transform: translateY(0);
}

.uni-calendar__content {
  background-color: #fff;
  position: relative;
  z-index: 1;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
}

.uni-calendar__drag-area {
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #fff;
  transition: all 0.2s ease;
}

.uni-calendar__drag-indicator {
  width: 40px;
  height: 3px;
  background-color: #ebedf0;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
}

.uni-calendar__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom-color: $uni-border-color;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.uni-calendar--fixed-top {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: space-between;
  border-top-color: $uni-border-color;
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-calendar--fixed-width {
  width: 50px;
}

.uni-calendar__mode__view {
  display: flex;
  align-items: center;
  width: 100vw;
  height: 40px;
  font-size: 16px;
}

.uni-calendar__mode {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
}

.uni-calendar__mode__image {
  width: 30px;
  height: 30px;
}

.uni-calendar__header-text {
  text-align: center;
  width: 100px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.uni-calendar__header-btn-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #f5f5f5;
  border-radius: 50%;
}

.uni-calendar__header-btn {
  width: 10px;
  height: 10px;
  border-left-color: #969799;
  border-left-style: solid;
  border-left-width: 2px;
  border-top-color: #969799;
  border-top-style: solid;
  border-top-width: 2px;
}

.uni-calendar--left {
  transform: rotate(-45deg);
}

.uni-calendar--right {
  transform: rotate(135deg);
}

.uni-calendar__weeks {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  height: 50px;
  transition: all 0.3s ease;
}

.uni-calendar__weeks-item {
  flex: 1;
  position: relative;
  z-index: 2;
}

.uni-calendar__weeks-day {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-bottom-color: #f5f5f5;
  border-bottom-style: solid;
  border-bottom-width: 0px; // 不显示周一至周日底部边框
}

.uni-calendar__weeks-day-text {
  font-size: 14px;
}

.uni-calendar__box {
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 350px; /* 展开状态的默认高度 */
}

.uni-calendar__box--collapsed {
  height: 100px; /* 折叠状态的高度 */
}

.uni-calendar__box-bg {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.uni-calendar__box-bg-text {
  font-size: 200px;
  font-weight: bold;
  color: $uni-text-color-grey;
  opacity: 0.1;
  text-align: center;
  /* #ifndef APP-NVUE */
  line-height: 1;
  /* #endif */
}

.uni-calendar__drag-area--active .uni-calendar__drag-indicator {
  background-color: #969799;
}

.uni-calendar__drag-area--dragging {
  opacity: 0.8;
}

.uni-calendar__weeks-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  transition: height 0.3s ease;
}

.uni-calendar__weeks {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 50px;
  transition: transform 0.3s ease;
}

.uni-calendar__weeks-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.uni-calendar__weeks-day {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.uni-calendar__weeks-day-text {
  font-size: 14px;
}

// 添加过渡动画
.uni-calendar__weeks-enter-active,
.uni-calendar__weeks-leave-active {
  transition: opacity 0.3s ease;
}

.uni-calendar__weeks-enter,
.uni-calendar__weeks-leave-to {
  opacity: 0;
}

/* 添加3天模式下的特殊样式 */
.uni-calendar__weeks-container.three-day-mode {
  .uni-calendar__weeks {
    justify-content: space-around;
  }

  .uni-calendar__weeks-item {
    flex: 0 0 33%;
  }
}

/* 添加跨周模式样式 */
.uni-calendar__weeks-container.cross-week-mode {
  height: auto !important;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;

  .uni-calendar__weeks {
    display: inline-flex;
    width: auto;
    transform: none !important;
    height: 50px;
    justify-content: center;
  }

  .uni-calendar__weeks-item {
    width: 33% !important;
    flex: 0 0 33% !important;
  }
}

/* 修改三天视图的容器样式，确保和上方周几标签对齐 */
.uni-calendar__three-days-container {
  display: flex;
  justify-content: space-between;
  padding: 0;
  height: 50px;
  width: 100%;
}

/* 修改每个日期项，使其平分宽度 */
.uni-calendar__three-days-item {
  flex: 1;
  display: flex;
  justify-content: center;
  width: 33.33%;
}

/* 调整日历项的宽度，确保日期在中间显示 */
.uni-calendar-item__weeks-box-item {
  width: 100%;
  height: 100rpx;
}

/* 修改三天视图的容器样式，确保和上方周几标签对齐 */
.uni-calendar__three-days-container {
  display: flex;
  justify-content: space-between;
  padding: 0;
  height: 50px;
  width: 100%;
}

/* 修改每个日期项，使其平分宽度 */
.uni-calendar__three-days-item {
  flex: 1;
  display: flex;
  justify-content: center;
  width: 33.33%;
}

/* 调整日历项的宽度，确保日期在中间显示 */
.uni-calendar-item__weeks-box-item {
  width: 100%;
  height: 100rpx;
}

/* 修改跨周模式样式 */
.uni-calendar__weeks-container.cross-week-mode {
  height: 50px !important;
  overflow: visible;

  .uni-calendar__three-days-container {
    padding: 0;
  }

  .uni-calendar__weeks {
    display: none;
  }
}

/* 确保周标签在3日模式下平均分布 */
.uni-calendar__weeks {
  justify-content: space-between;
}

.uni-calendar__weeks-day {
  flex: 1;
  text-align: center;
}

/* 添加3天模式下的特殊样式 */
.uni-calendar__weeks-container.three-day-mode {
  .uni-calendar__weeks {
    justify-content: space-around;
  }

  .uni-calendar__weeks-item {
    flex: 0 0 33%;
  }
}

/* 添加跨周模式样式 */
.uni-calendar__weeks-container.cross-week-mode {
  height: auto !important;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;

  .uni-calendar__weeks {
    display: inline-flex;
    width: auto;
    transform: none !important;
    height: 50px;
    justify-content: center;
  }

  .uni-calendar__weeks-item {
    width: 33% !important;
    flex: 0 0 33% !important;
  }
}

/* 三天模式下的特殊容器 */
.uni-calendar__three-days-container {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  height: 50px;
  box-sizing: border-box;
}

.uni-calendar__three-days-item {
  flex: 1;
  display: flex;
  justify-content: center;
}

/* 修改跨周模式样式 */
.uni-calendar__weeks-container.cross-week-mode {
  height: 50px !important;
  overflow: visible;

  .uni-calendar__three-days-container {
    padding: 0;
  }

  .uni-calendar__weeks {
    display: none;
  }
}

/* 确保周标签在3日模式下平均分布 */
.uni-calendar__weeks {
  justify-content: space-between;
}

.uni-calendar__weeks-day {
  flex: 1;
  text-align: center;
}

/* 三日模式下的周几标签样式 */
.uni-calendar__weeks-three-mode {
  justify-content: space-between;
  padding: 0 4px;
}

.uni-calendar__weeks-three-mode .uni-calendar__weeks-day {
  flex: 1;
  width: 33.33%;
}

/* 使用更强的选择器和!important来强制覆盖背景色 */
.uni-calendar
  .uni-calendar__box--collapsed
  .uni-calendar__three-days-container
  .uni-calendar__three-days-item
  .uni-calendar-item__weeks-box {
  background-color: transparent !important;
}

/* 覆盖所有可能的状态类 */
.uni-calendar
  .uni-calendar__box--collapsed
  .uni-calendar__three-days-container
  .uni-calendar__three-days-item
  .uni-calendar-item__weeks-box.uni-calendar-item--multiple,
.uni-calendar
  .uni-calendar__box--collapsed
  .uni-calendar__three-days-container
  .uni-calendar__three-days-item
  .uni-calendar-item__weeks-box.uni-calendar-item--before-checked,
.uni-calendar
  .uni-calendar__box--collapsed
  .uni-calendar__three-days-container
  .uni-calendar__three-days-item
  .uni-calendar-item__weeks-box.uni-calendar-item--after-checked,
.uni-calendar
  .uni-calendar__box--collapsed
  .uni-calendar__three-days-container
  .uni-calendar__three-days-item
  .uni-calendar-item__weeks-box.uni-calendar-item--checked,
.uni-calendar
  .uni-calendar__box--collapsed
  .uni-calendar__three-days-container
  .uni-calendar__three-days-item
  .uni-calendar-item__weeks-box.uni-calendar-item--isDay {
  background-color: transparent !important;
}

/* 修改文本颜色 */
.uni-calendar .uni-calendar__box--collapsed .uni-calendar-item__weeks-box-text,
.uni-calendar .uni-calendar__box--collapsed .uni-calendar-item__weeks-lunar-text {
  color: #333 !important;
}
</style>
