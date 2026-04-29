<template>
  <view class="schedule" :class="'calendar-mode-' + calendarMode" @click.capture="track">
    <!-- 手机状态栏 -->
    <view
      :style="'width:100vw;height:' + systemInfo.statusBarHeight + 'px;background-color:#ffffff'"
    ></view>
    <!-- 标题栏 -->
    <van-icon
      name="arrow-left"
      :style="{
        position: 'absolute',
        'z-index': 2,
        top: systemInfo.statusBarHeight + 'px',
        left: '10px',
        height: systemInfo.navHeight + 'px',
        'line-height': systemInfo.navHeight + 'px',
        'font-size': '20px'
      }"
      @click.native="navigateBack"
    />
    <!-- 日历 -->
    <view class="calendar">
      <uni-calendar-custom
        ref="calendar"
        :insert="true"
        :lunar="false"
        :range="range"
        :mode="calendarMode"
        collapsible
        :selected="SANumber"
        @change="dateChange"
        @modeChange="modeChange"
        @monthSwitch="monthChange"
      />
    </view>
    <view v-if="currentSA.id && currentSA.show" class="current-sa">
      <view class="c-flex c-item-center c-flex-between">
        <view>
          <van-icon name="todo-list-o" color="#646566" class="c-m-r-10"></van-icon>
          <text>工单 #{{ currentSA.data.orderNum.slice(5) }} 屋面</text>
        </view>
        <van-icon
          name="cross"
          color="#646566"
          class="c-m-r-10"
          @click="currentSA.show = false"
        ></van-icon>
      </view>
      <view class="c-flex c-item-center">
        <van-icon name="location-o" color="#646566" class="c-m-r-10"></van-icon>
        <text class="c-nowrap">{{ currentSA.data.address }}</text>
      </view>
    </view>
    <scroll-view
      id="schedule"
      scroll-y
      enhanced
      :show-scrollbar="false"
      :scroll-top="firstIdleTop"
      scroll-with-animation
    >
      <view class="calendar-view">
        <view class="time-column">
          <view
            v-for="(hour, index) in hours"
            :key="index"
            class="time-item"
            :style="{ height: hourHight + 'px' }"
          >
            <text v-if="timePeriodMode == 1 ? index % 2 == 0 : true">
              {{ hour < 10 ? '0' + hour : hour }}:00
            </text>
          </view>
        </view>
        <!-- 日期列 -->
        <view
          v-for="(dateColumn, columnIndex) in dateColumns"
          :key="columnIndex"
          class="time-period-column"
        >
          <!-- 时间段 -->
          <view
            v-for="(hour, index) in hours"
            :key="index"
            class="time-period-item"
            :style="{ height: hourHight + 'px' }"
          >
            <view v-if="timePeriodMode == 1 ? index % 2 == 0 : true" class="line"></view>
          </view>
          <!-- 当前时间线 -->
          <view
            v-if="dateColumn.date == today && currentTime >= workingHoursStart"
            class="timeline"
            :style="{ top: hourHight * (currentTime - workingHoursStart + 0.5) - 2.5 + 'px' }"
          >
            <view class="timeline-dot"></view>
            <view class="timeline-line"></view>
          </view>
          <!-- 工单卡片 -->
          <view
            v-for="(sa, saIndex) in dateColumn.busyList"
            :key="`${columnIndex}-${saIndex}`"
            class="schedule-item"
            :style="{
              top: hourHight * (sa.startTime - workingHoursStart + 0.5) + 'px',
              height: cardHeight + 'px',
              border: sa.conflict ? '1px solid #d6000f' : 'none',
              'background-color': sa.status == 202 ? '#e0f1fe' : '#f5f5f5'
            }"
            @click="copy(sa.orderNum, '已复制工单编号 ' + sa.orderNum)"
          >
            <text
              v-if="calendarMode != 1"
              class="address"
              :style="{
                '-webkit-line-clamp': lineClamp,
                'line-clamp': lineClamp
              }"
            >
              {{
                (sa.district ? formatDistrict(Number(sa.district)) + ' ' : '') + (sa.address || '')
              }}
            </text>
            <block v-else>
              <view class="c-flex c-flex-between">
                <view class="c-flex c-flex-1 c-m-r-20">
                  <view style="display: inline-flex; height: 22px; align-items: center">
                    <van-icon name="location-o" color="#646566" class="c-m-r-10"></van-icon>
                  </view>
                  <text
                    class="address c-bold"
                    :style="{
                      '-webkit-line-clamp': visitDuration,
                      'line-clamp': visitDuration
                    }"
                  >
                    {{ sa.district ? formatDistrict(Number(sa.district)) + ' ' : '' }}
                    {{ sa.address }}
                  </text>
                </view>
                <text>{{ formatLeakagesite(sa.leakagesite) }}</text>
              </view>
              <view class="c-flex c-item-center c-flex-between">
                <view class="c-flex c-item-center">
                  <van-icon name="clock-o" color="#646566" class="c-m-r-10"></van-icon>
                  <text>{{ sa.startTimeStr }}</text>
                </view>
                <text>{{ codelabel('select', 'status', sa.status) }}</text>
              </view>
            </block>
          </view>
          <!-- 冲突卡片 -->
          <view
            v-for="(conflict, conflictIndex) in dateColumn.conflictList"
            :key="`${columnIndex}-${conflictIndex}`"
            class="conflict-view"
            :style="{
              top: hourHight * (conflict.startTime - workingHoursStart + 0.5) + 'px',
              height: hourHight * conflict.duration - 6 + 'px'
            }"
          >
            <view
              v-for="(sa, saIndex) in conflict.children"
              :key="`${columnIndex}-${conflictIndex}-${saIndex}`"
              class="schedule-item schedule-item-conflict"
              :style="{
                'margin-top': hourHight * (sa.startTime - conflict.startTime) + 'px',
                height: cardHeight + 'px',
                'background-color': sa.status == 202 ? '#e0f1fe' : '#f5f5f5',
                'margin-left': saIndex == 0 ? 0 : '3px'
              }"
              @click="copy(sa.orderNum, '已复制工单编号 ' + sa.orderNum)"
            >
              <text
                class="address"
                :style="{
                  '-webkit-line-clamp': lineClamp,
                  'line-clamp': lineClamp
                }"
              >
                <text :class="calendarMode > 1 ? 'c-text-vertical' : ''">
                  {{ sa.district ? formatDistrict(Number(sa.district)) + ' ' : '' }}
                </text>
                <text v-if="calendarMode == 1">{{ sa.address || '' }}</text>
              </text>
            </view>
          </view>
          <!-- 空闲卡片 -->
          <block
            v-for="(item, idelIndex) in dateColumn.idleList"
            :key="`${columnIndex}-${idelIndex}`"
          >
            <view
              v-if="item.duration >= 0.5"
              :id="`idle-${columnIndex}-${idelIndex}`"
              class="schedule-item c-flex-center"
              :style="{
                top: hourHight * (item.startTime - workingHoursStart + 0.5) + 'px',
                height: hourHight * item.duration - 6 + 'px',
                'background-color': '#FFEACD'
              }"
            >
              空闲
            </view>
          </block>
        </view>
      </view>
    </scroll-view>
    <view :style="{ height: `${mapHeight}px` }"></view>
    <view
      class="map-container"
      :class="{ 'map-dragging': dragging, 'map-fully-expanded': mapFullyExpanded }"
      :style="{ height: `${mapHeight}px` }"
    >
      <view
        class="map-drag-handle"
        @touchstart="mapTouchStart"
        @touchmove="mapTouchMove"
        @touchend="mapTouchEnd"
        @click="handleMapClick"
      >
        <view class="map-drag-line"></view>
      </view>
      <map
        v-if="latitude && longitude"
        class="map"
        :latitude="latitude"
        :longitude="longitude"
        :markers="currentSA.marker ? markers.concat([currentSA.marker]) : markers"
        :include-points="currentSA.marker ? markers.concat([currentSA.marker]) : markers"
        :polyline="polyline"
      >
        <!-- <cover-view slot="callout">
            <block v-for="(marker, index) in markers" :key="index">
              <cover-view :marker-id="marker.id" class="customCallout">
                <cover-view>自定义{{ marker.id }}</cover-view>
                <cover-image
                  src="https://pub.fsgo365.cn/icon-car.png"
                  style="width: 20px; height: 20px"
                  :data-event="{ id: '9c142Y5468' }"
                ></cover-image>
              </cover-view>
            </block>
          </cover-view> -->

        <!-- #ifdef APP-PLUS -->
        <!-- 添加导航按钮 -->
        <cover-view
          v-if="passingPoints.length >= 2 && mapHeight > 82"
          class="nav-button"
          :style="{
            'line-height': systemInfo.platform == 'ios' ? '30px' : '28px'
          }"
          @click="openMapNavigation"
        >
          开始导航
        </cover-view>
        <!-- #endif -->
      </map>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
import UniCalendarCustom from '../uni_modules/uni-calendar-custom/components/uni-calendar-custom/uni-calendar.vue';
export default {
  components: {
    UniCalendarCustom
  },
  data() {
    let tpm = 1;
    return {
      systemInfo: {},
      timePeriodMode: tpm, // 1.时间段紧凑模式（1屏展示更多信息）：每小时占页面高度40px、2个小时作为1个时间段、每日起止时间8~22（只显示双数线）；2.宽松模式（1屏展示更少信息）：每小时占页面高度50px、1个小时作为1个时间段、每日起止时间7~22；
      calendarMode: 2, // 日历展示模式 1:1日 3:3日
      range: true, // 范围选择，当日历展示模式为3时，range为true
      selectedDate: '', // 日历单日模式下的选择的日期
      startDate: '', // 日历范围模式下可选择的开始日期
      endDate: '', // 日历范围模式下可选择的结束日期
      rangeDate: [], // 日历范围模式下选择的所有日期
      workingHoursStartDefaultStr: tpm == 1 ? '08:00' : '07:00', // 默认最早上门时间（时）
      workingHoursEndDefaultStr: '22:00', // 默认最晚上门时间（时）
      workingHoursStartDefault: tpm == 1 ? 8 : 7, // 默认最早上门时间（时）
      workingHoursEndDefault: 22, // 默认最晚上门时间（时）
      workingHoursStart: tpm == 1 ? 8 : 7, // 最早上门时间（时）
      workingHoursEnd: 22, // 最晚上门时间（时） // TODO:约到22点卡片能否正常展示,如果已预约的在工作时间范围外,更新data中的开始和结束工作时间
      currentYear: '', // 当前年 如:2025
      currentMonth: '', // 当前月份 如:'04'
      today: '', // 今天 如:'2025-04-01'
      todayTime: new Date().setHours(0, 0, 0, 0),
      currentTimeStr: '', // 当前时间
      currentTime: this.getTimeNumber(), // 当前时间（时）
      visitDuration: 2, // 上门时长（小时）
      firstIdleTop: 0, // 第一个空闲且足够上门时长的空闲时间段卡片的高度。不用滚动到id，因为需要向上50px，否则左侧时间无法完整显示。
      hourHight: tpm == 1 ? 40 : 50, // 每小时占页面高度（px）
      dateColumns: [], // 忙闲冲突数据按日期分组
      SANumber: [], // 每天工单数
      options: {
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        },
        codecfg_status: {
          codeId: 'STATUS'
        }
      },
      areaList: Object.assign({}, areajs.default),
      currentSA: {
        id: '', // 当前工单id
        show: false,
        data: {}
        // marker: {} // 当前工单标记点 默认为空，有值才在地图上展示
      },
      longitude: '',
      latitude: '',
      // 地图相关数据
      mapHeight: 0,
      initialMapHeight: 0,
      mapTranslateY: 0,
      touchStartTime: 0,
      lastClickTime: 0, // 记录最后点击时间，避免重复触发
      hasDragged: false, // 标记是否已经拖拽过
      minMapHeight: 0, // 最小高度改为0
      maxMapHeight: 0, // 最大高度，会在onLoad中设置
      defaultMapHeight: 0, // 默认高度，会在onLoad中设置为屏幕高度的30%
      mapFullyExpanded: false, // 地图是否完全展开
      statusBarHeight: 0, // 新增状态栏高度记录
      markers: [], // 地图标记点
      polyline: [], // 地图路线
      passingPoints: [] // 导航途经点
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.currentSA.id = param.id || '';
    this.systemInfo = app.globalData.systemInfo;

    if (app.globalData.location) {
      this.latitude = app.globalData.location.split(',')[0];
      this.longitude = app.globalData.location.split(',')[1];
    } else {
      common.osg.getLocation(
        res => {
          app.globalData.location = res.latitude + ',' + res.longitude;
          this.latitude = res.latitude;
          this.longitude = res.longitude;
        },
        null,
        {
          doNotRemind: true
        }
      );
    }

    // 获取缓存中的日历模式，设置模式和默认范围
    this.calendarMode = wx.getStorageSync('calendarMode') || 2;
    this.range = this.calendarMode > 1;

    this.today = common.osg.readableTime(null, 'date');
    this.selectedDate = this.today;
    this.currentTimeStr = common.osg.readableTime(null, 'shortTime');
    common.osg.codeoption();

    // 设置地图高度相关参数
    this.screenHeight = this.systemInfo.windowHeight;
    this.statusBarHeight = this.systemInfo.statusBarHeight; // 记录状态栏高度
    this.defaultMapHeight = Math.floor(this.screenHeight * 0.25); // 20%屏幕高度
    this.minMapHeight = 60;
    this.maxMapHeight = this.screenHeight - this.statusBarHeight; //  - this.systemInfo.navHeight; // 最高到状态栏下方
    this.mapHeight = this.defaultMapHeight;
    this.initialMapHeight = this.defaultMapHeight;
    this.mapTranslateY = 0; // 初始无位移

    setTimeout(() => {
      // 找到日历组件引用
      const calendar = this.$refs.calendar;
      if (calendar) {
        // #ifdef MP-WEIXIN
        // 日历模式为1日时，微信小程序端会自动触发dateChange。否则需要主动触发点击今日。
        if (this.calendarMode != 1) {
          calendar.backToday();
        }
        // #endif

        // #ifdef APP-PLUS
        // 日历模式为1日时，App端不会自动触发dateChange，需要主动触发点击今日。
        calendar.backToday();
        // #endif

        this.getSANumber();
      }
    }, 300); // 稍微延迟确保组件已完全挂载
    if (this.currentSA.id) this.getCurrentSA();
  },
  computed: {
    // 获取每天工作时间段的小时
    hours() {
      const hours = [];
      for (let i = this.workingHoursStart; i <= this.workingHoursEnd; i++) {
        hours.push(i);
      }
      return hours;
    },
    // 计算工单卡片高度 1小时页面高度 * 上门时长 - 卡片顶部和底部外边距 = 卡片高度
    cardHeight() {
      return this.hourHight * this.visitDuration - 6;
    },
    // 计算工单卡片地址文字行数 向下取整(卡片高度 / 文本行号) = 地址文本行数
    lineClamp() {
      return Math.floor(this.cardHeight / 22);
    }
  },
  methods: {
    modeChange(calendarMode) {
      // 设置日历模式（注意：这里需要使用字符串，与组件props定义保持一致）
      this.calendarMode = calendarMode;
      wx.setStorageSync('calendarMode', calendarMode);
      // 设置range值
      this.range = calendarMode > 1;

      // 当前日期
      const today = new Date();
      this.selectedDate = common.osg.readableTime(today, 'date');

      if (this.range) {
        if (this.calendarMode == 2) {
          // 对于2天模式，设置开始和结束日期
          this.startDate = this.selectedDate;

          const endDay = new Date(today);
          endDay.setDate(today.getDate() + 1);
          this.endDate = common.osg.readableTime(endDay, 'date');

          // 创建rangeDate数组
          this.rangeDate = [this.startDate, this.endDate];
        }
        if (this.calendarMode == 3) {
          // 对于3天模式，设置开始和结束日期
          this.startDate = this.selectedDate;

          const endDay = new Date(today);
          endDay.setDate(today.getDate() + 2);
          this.endDate = common.osg.readableTime(endDay, 'date');

          // 创建rangeDate数组
          this.rangeDate = [this.startDate];
          for (let i = 1; i <= 2; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() + i);
            this.rangeDate.push(common.osg.readableTime(day, 'date'));
          }
        }
      }
    },
    dateChange(e) {
      if (this.range && e.range.before && e.range.after) {
        this.startDate = e.range.data[0];
        this.endDate = e.range.data[e.range.data.length - 1];
        this.rangeDate = e.range.data;
        this.getData();
      } else if (!this.range) {
        this.selectedDate = e.fulldate;
        this.getData();
      }
      this.currentYear = e.year;
      this.currentMonth = e.month;
    },
    monthChange(e) {
      this.currentYear = e.year;
      this.currentMonth = e.month < 10 ? '0' + e.month : e.month;
      this.getSANumber();
    },
    // 截取预约时间的时间，转为数字，如8:30转为8.5，用于工单卡片定位
    getTimeNumber(datetime) {
      if (datetime) {
        let hour = Number(datetime.split(' ')[1].split(':')[0]);
        let minute = Number(datetime.split(' ')[1].split(':')[1]);
        return hour + Number((minute / 60).toFixed(2));
      } else {
        let now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        return hour + Number((minute / 60).toFixed(2));
      }
    },
    getData() {
      common.osg.ajax(
        'basic/serviceAppointment/querySAWorkflowNode',
        {
          _all: '1',
          sortField: 'exts.applyTimeStr',
          sortOrder: 'asc',
          orderState: 'all',
          'is:state|integer#and': 1,
          'gte:exts.applyTimeStr|string#and': this.range
            ? this.startDate + ' 00:00:00'
            : this.selectedDate + ' 00:00:00',
          'lte:exts.applyTimeStr|string#and': this.range
            ? this.endDate + ' 23:59:59'
            : this.selectedDate + ' 23:59:59'
        },
        res => {
          let dateColumns = [];
          // 我的位置（起点）、全部工单（待上门）、当前工单（不参与）
          // 路径规划：待上门状态的工单

          // 起点（我的定位）
          let startingPoint = {
            id: 123,
            label: {
              content: '我的位置',
              textAlign: 'center',
              bgColor: '#ffffff',
              color: '#323233',
              borderRadius: 4,
              padding: 4,
              anchorX: -28
            },
            latitude: this.latitude,
            longitude: this.longitude,
            iconPath: '/static/images/map/point-my.png',
            // #ifdef APP-PLUS
            width: 60, // App端放大图标
            height: 60,
            // #endif
            // #ifdef MP-WEIXIN
            width: 30, // 小程序保持原尺寸
            height: 30
            // #endif
          };
          // 全部标记点
          let markers = [startingPoint];
          // 途径点（含起点和终点）
          let passingPoints = [startingPoint];

          // 根据选择天数赋值dateColumns默认值，避免某天没有工单无法插入列
          if (this.range) {
            this.rangeDate.map(date => {
              dateColumns.push({
                date: date,
                busyList: [],
                idleList: []
              });
            });
          } else {
            dateColumns.push({
              date: this.selectedDate,
              busyList: [],
              idleList: []
            });
          }

          // 将全部数据按日期分组
          res.data.map((item, index) => {
            let startTime = this.getTimeNumber(item.data.exts.applyTimeStr);
            let sa = {
              orderNum: item.data.orderNum,
              district: item.data.district,
              address: item.data.address,
              leakagesite: item.data.exts.leakagesite,
              applyTimeStr: item.data.exts.applyTimeStr,
              status: item.data.status,
              gpsPoint: item.data.gpsPoint || {},
              date: item.data.exts.applyTimeStr.split(' ')[0], // 上门日期
              startTimeStr: this.getTimeStr(item.data.exts.applyTimeStr.split(' ')[1], 0), // 上门开始时间，如 "08:30"
              endTimeStr: this.getTimeStr(
                item.data.exts.applyTimeStr.split(' ')[1],
                this.visitDuration
              ), // 上门结束时间，如 "10:30"
              startTime: startTime, // 上门开始时间，如 8.5
              endTime: startTime + this.visitDuration > 24 ? 24 : startTime + this.visitDuration // 上门结束时间，如 10.5
            };

            // 保存地图标记点
            if (sa.gpsPoint.latitude && sa.gpsPoint.longitude) {
              let point = {
                id: Number(sa._id),
                label: {
                  content: sa.address || '',
                  textAlign: 'center',
                  bgColor: '#ffffff',
                  color: '#323233',
                  borderRadius: 4,
                  padding: 4,
                  anchorX: sa.address ? 0 - sa.address.length * 7 : 0
                },
                latitude: sa.gpsPoint.latitude,
                longitude: sa.gpsPoint.longitude,
                iconPath:
                  sa.status == '202'
                    ? '/static/images/map/point-blue.png'
                    : '/static/images/map/point-gray.png',
                // #ifdef APP-PLUS
                width: 60, // App端放大图标
                height: 60,
                // #endif
                // #ifdef MP-WEIXIN
                width: 40, // 小程序保持原尺寸
                height: 40
                // #endif
              };
              // 保存标记点
              markers.push(point);
              // 保存途径点
              if (sa.status == '202') {
                passingPoints.push(point);
              }
            }

            // 将工单按照日期分组放到dateColumns
            if (this.range) {
              let dateIndex = this.rangeDate.indexOf(sa.date);
              dateColumns[dateIndex].busyList.push(sa);
            } else {
              dateColumns[0].busyList.push(sa);
            }
          });

          // 将地图标记点赋值给markers
          this.markers = markers;
          // 保存途经点信息用于导航
          this.passingPoints = passingPoints;
          common.osg.driving(passingPoints, res => {
            let polyline = [];
            res.steps.map(item => {
              polyline.push({
                points: item.polyline.split(';').map(item => {
                  return {
                    longitude: item.split(',')[0],
                    latitude: item.split(',')[1]
                  };
                }),
                color: '#00c86d',
                // #ifdef APP-PLUS
                width: this.systemInfo.osName == 'ios' ? 5 : 15,
                // #endif
                // #ifdef MP-WEIXIN
                width: this.systemInfo.osName == 'ios' ? 5 : 5,
                // #endif
                arrowLine: true
              });
            });
            this.polyline = polyline;
          });

          let workingHoursStart = this.workingHoursStartDefault;
          let workingHoursEnd = this.workingHoursEndDefault;
          // 获取每天的空闲时间段、标记预约时间冲突、更新日历起止时间
          dateColumns.map(dateColumn => {
            let currentDateTime = new Date(dateColumn.date).setHours(0, 0, 0);
            if (dateColumn.busyList.length > 0) {
              dateColumn.busyList.map((sa, saIndex) => {
                if (currentDateTime < this.todayTime) {
                  // 1.过去日期，需要判断预约时间冲突、需要更新日历起止时间，不需要插入空闲卡片，不需要判断当前时间
                  if (saIndex == 0) {
                    if (sa.startTime < workingHoursStart) {
                      workingHoursStart = sa.startTime;
                    }
                  } else {
                    let preSA = dateColumn.busyList[saIndex - 1];
                    let preEndTime = preSA.endTime;
                    if (sa.startTime < preEndTime) {
                      preSA.conflict = true;
                      sa.conflict = true;
                    }
                  }
                  if (saIndex == dateColumn.busyList.length - 1) {
                    if (sa.endTime > workingHoursEnd) {
                      workingHoursEnd = sa.endTime;
                    }
                  }
                } else if (currentDateTime == this.todayTime) {
                  // 2.今天，需要插入空闲卡片，需要判断预约时间冲突、更新日历起止时间、需要判断当前日期
                  if (saIndex == 0) {
                    // 当天第一个工单
                    if (
                      sa.startTime > this.workingHoursStartDefault &&
                      this.currentTime < sa.startTime &&
                      this.currentTime < this.workingHoursEndDefault
                    ) {
                      if (sa.startTime < this.workingHoursEndDefault) {
                        // 如果晚于默认开工时间，且早于默认完工时间，且晚于当前时间，前面增加空闲卡片。
                        dateColumn.idleList.push({
                          date: dateColumn.date,
                          startTimeStr:
                            this.currentTime < this.workingHoursStartDefault
                              ? this.workingHoursStartDefaultStr
                              : this.currentTimeStr,
                          startTime:
                            this.currentTime < this.workingHoursStartDefault
                              ? this.workingHoursStartDefault
                              : this.currentTime,
                          endTime: sa.startTime,
                          duration:
                            this.currentTime < this.workingHoursStartDefault
                              ? Number((sa.startTime - this.workingHoursStartDefault).toFixed(2))
                              : Number((sa.startTime - this.currentTime).toFixed(2))
                        });
                      } else {
                        // 如果晚于默认完工时间，前面增加空闲卡片。
                        dateColumn.idleList.push({
                          date: dateColumn.date,
                          startTimeStr:
                            this.currentTime < this.workingHoursStartDefault
                              ? this.workingHoursStartDefaultStr
                              : this.currentTimeStr,
                          startTime:
                            this.currentTime < this.workingHoursStartDefault
                              ? this.workingHoursStartDefault
                              : this.currentTime,
                          endTime: this.workingHoursEndDefault,
                          duration:
                            this.currentTime < this.workingHoursStartDefault
                              ? Number(
                                  (
                                    this.workingHoursEndDefault - this.workingHoursStartDefault
                                  ).toFixed(2)
                                )
                              : Number((this.workingHoursEndDefault - this.currentTime).toFixed(2))
                        });
                      }
                    }
                    // 如果早于默认开工时间和现有最早开工时间，更新最早开工时间，用于延伸日历开始时间段
                    if (sa.startTime < workingHoursStart) {
                      workingHoursStart = sa.startTime;
                    }
                  } else {
                    // 非当天第一个工单
                    let preSA = dateColumn.busyList[saIndex - 1];
                    let preEndTime = preSA.endTime; // 上一个工单的上门结束时间
                    // 1.如果晚于上一个工单的上门结束时间
                    if (sa.startTime > preEndTime) {
                      /**
                       * 2.当前时间早于当前工单上门时间
                       * 且当前时间早于默认完工时间
                       * 且上一工单的上门结束时间早于默认完工时间
                       * 且当前工单开工时间晚于最早上门时间
                       * 则和上一工单之间增加空闲卡片
                       */
                      if (
                        this.currentTime < sa.startTime &&
                        this.currentTime < this.workingHoursEndDefault &&
                        preEndTime < this.workingHoursEndDefault &&
                        sa.startTime > this.workingHoursStartDefault
                      ) {
                        if (sa.startTime < this.workingHoursEndDefault) {
                          // 3.1 如果当前工单上门开始时间早于默认完工时间，空闲卡片起止时间正常
                          dateColumn.idleList.push({
                            date: dateColumn.date,
                            startTimeStr:
                              this.currentTime < preEndTime
                                ? preSA.endTimeStr
                                : this.currentTimeStr,
                            startTime:
                              this.currentTime < preEndTime ? preEndTime : this.currentTime,
                            endTime: sa.startTime,
                            duration:
                              this.currentTime < preEndTime
                                ? Number((sa.startTime - preEndTime).toFixed(2))
                                : Number((sa.startTime - this.currentTime).toFixed(2))
                          });
                        } else {
                          // 3.2 如果当前工单上门开始时间晚于默认完工时间，空闲卡片结束时间取默认完工时间
                          dateColumn.idleList.push({
                            date: dateColumn.date,
                            startTimeStr:
                              this.currentTime < preEndTime
                                ? preSA.endTimeStr
                                : this.currentTimeStr,
                            startTime:
                              this.currentTime < preEndTime ? preEndTime : this.currentTime,
                            endTime: this.workingHoursEndDefault,
                            duration:
                              this.currentTime < preEndTime
                                ? Number((this.workingHoursEndDefault - preEndTime).toFixed(2))
                                : Number(
                                    (this.workingHoursEndDefault - this.currentTime).toFixed(2)
                                  )
                          });
                        }
                      }
                    } else if (sa.startTime < preEndTime) {
                      // 如果早于上一个工单的上门结束时间，标记冲突
                      preSA.conflict = true;
                      sa.conflict = true;
                    }
                  }
                  // 当天最后一个工单
                  if (saIndex == dateColumn.busyList.length - 1) {
                    if (sa.endTime < this.workingHoursEndDefault) {
                      // 如果当前工单完工时间早于默认完工时间，在最后增加空闲卡片
                      if (sa.endTime < this.workingHoursStartDefault) {
                        // 如果当前工单完工时间早于默认开工时间，在最后增加空闲卡片
                        dateColumn.idleList.push({
                          date: dateColumn.date,
                          startTimeStr:
                            this.currentTime < this.workingHoursStartDefault
                              ? this.workingHoursStartDefaultStr
                              : this.currentTimeStr,
                          startTime:
                            this.currentTime < this.workingHoursStartDefault
                              ? this.workingHoursStartDefault
                              : this.currentTime,
                          endTime: this.workingHoursEndDefault,
                          duration:
                            this.currentTime < this.workingHoursStartDefault
                              ? Number(
                                  (
                                    this.workingHoursEndDefault - this.workingHoursStartDefault
                                  ).toFixed(2)
                                )
                              : Number((this.workingHoursEndDefault - this.currentTime).toFixed(2))
                        });
                      } else {
                        // 如果当前工单完工时间晚于默认开工时间，在最后增加空闲卡片
                        dateColumn.idleList.push({
                          date: dateColumn.date,
                          startTimeStr:
                            this.currentTime < sa.endTime ? sa.endTimeStr : this.currentTimeStr,
                          startTime: this.currentTime < sa.endTime ? sa.endTime : this.currentTime,
                          endTime: this.workingHoursEndDefault,
                          duration:
                            this.currentTime < sa.endTime
                              ? Number((this.workingHoursEndDefault - sa.endTime).toFixed(2))
                              : Number((this.workingHoursEndDefault - this.currentTime).toFixed(2))
                        });
                      }
                    } else if (sa.endTime > workingHoursEnd)
                      // 如果当前工单完工时间晚于默认完工时间和现有最晚完工时间，更新最晚完工时间，用于延伸日历起止时间段
                      workingHoursEnd = sa.endTime;
                  }
                } else {
                  // 3.今天以后，需要插入空闲卡片，需要判断预约时间冲突、更新日历起止时间，不需要判断当前时间
                  if (saIndex == 0) {
                    // 当天第一个工单
                    if (sa.startTime > this.workingHoursStartDefault) {
                      // 如果晚于默认开工时间，且早于默认完工时间，前面增加空闲卡片。
                      dateColumn.idleList.push({
                        date: dateColumn.date,
                        startTimeStr: this.workingHoursStartDefaultStr,
                        startTime: this.workingHoursStartDefault,
                        endTime:
                          sa.startTime < this.workingHoursEndDefault
                            ? sa.startTime
                            : this.workingHoursEndDefault,
                        duration:
                          sa.startTime < this.workingHoursEndDefault
                            ? Number((sa.startTime - this.workingHoursStartDefault).toFixed(2))
                            : Number(
                                (
                                  this.workingHoursEndDefault - this.workingHoursStartDefault
                                ).toFixed(2)
                              )
                      });
                    } else if (sa.startTime < workingHoursStart) {
                      // 如果早于默认开工时间和现有最早开工时间，更新最早开工时间，用于延伸日历开始时间段
                      workingHoursStart = sa.startTime;
                    }
                  } else {
                    // 非当天第一个工单
                    let preSA = dateColumn.busyList[saIndex - 1];
                    let preEndTime = preSA.endTime; // 上一个工单的上门结束时间
                    // 1.如果晚于上一个工单的上门结束时间
                    if (sa.startTime > preEndTime) {
                      // 2.上一工单的上门结束时间早于默认完工时间，和上一工单之间增加空闲卡片
                      if (preEndTime < this.workingHoursEndDefault) {
                        if (sa.startTime < this.workingHoursEndDefault) {
                          // 3.1 如果当前工单上门开始时间早于默认完工时间，空闲卡片起止时间正常
                          dateColumn.idleList.push({
                            date: dateColumn.date,
                            startTimeStr: preSA.endTimeStr,
                            startTime: preEndTime,
                            endTime: sa.startTime,
                            duration: Number((sa.startTime - preEndTime).toFixed(2))
                          });
                        } else {
                          // 3.2 如果当前工单上门开始时间晚于默认完工时间，空闲卡片结束时间取默认完工时间
                          dateColumn.idleList.push({
                            date: dateColumn.date,
                            startTimeStr: preSA.endTimeStr,
                            startTime: preEndTime,
                            endTime: this.workingHoursEndDefault,
                            duration: Number((this.workingHoursEndDefault - preEndTime).toFixed(2))
                          });
                        }
                      }
                    } else if (sa.startTime < preEndTime) {
                      // 如果早于上一个工单的上门结束时间，标记冲突
                      preSA.conflict = true;
                      sa.conflict = true;
                    }
                  }
                  // 当天最后一个工单
                  if (saIndex == dateColumn.busyList.length - 1) {
                    if (sa.endTime < this.workingHoursEndDefault) {
                      // 如果当前工单完工时间早于默认完工时间，在最后增加空闲卡片
                      dateColumn.idleList.push({
                        date: dateColumn.date,
                        startTimeStr: sa.endTimeStr,
                        startTime: sa.endTime,
                        endTime: this.workingHoursEndDefault,
                        duration: Number((this.workingHoursEndDefault - sa.endTime).toFixed(2))
                      });
                    } else if (sa.endTime > workingHoursEnd)
                      // 如果当前工单完工时间晚于默认完工时间和现有最晚完工时间，更新最晚完工时间，用于延伸日历起止时间段
                      workingHoursEnd = sa.endTime;
                  }
                }
              });
            } else {
              // 当天没有工单，增加整天空闲卡片
              // 今日空闲需要判断当前时间，今日以后不需要判断当前时间
              if (currentDateTime >= this.todayTime) {
                if (
                  dateColumn.date != this.today ||
                  this.currentTime < this.workingHoursStartDefault
                ) {
                  // 当前时间早于默认开工时间
                  dateColumn.idleList.push({
                    date: dateColumn.date,
                    startTimeStr: this.workingHoursStartDefaultStr,
                    startTime: this.workingHoursStartDefault,
                    endTime: this.workingHoursEndDefault,
                    duration: Number(
                      (this.workingHoursEndDefault - this.workingHoursStartDefault).toFixed(2)
                    )
                  });
                } else if (
                  this.currentTime >= this.workingHoursStartDefault &&
                  this.currentTime <= this.workingHoursEndDefault
                ) {
                  // 当前时间晚于默认开工时间，且早于默认完工时间
                  dateColumn.idleList.push({
                    date: dateColumn.date,
                    startTimeStr: this.currentTimeStr,
                    startTime: this.currentTime,
                    endTime: this.workingHoursEndDefault,
                    duration: Number((this.workingHoursEndDefault - this.currentTime).toFixed(2))
                  });
                }
              }
            }
          });

          dateColumns.map(dateColumn => {
            let busyList = [];
            let conflictData = [];
            dateColumn.busyList.map((sa, saIndex) => {
              if (sa.conflict) {
                conflictData.push(sa);
              } else {
                busyList.push(sa);
              }
            });
            let conflictList = [];
            conflictData.map((sa, saIndex) => {
              if (saIndex == 0) {
                conflictList.push({
                  startTime: sa.startTime,
                  endTime: sa.startTime + this.visitDuration,
                  duration: Number(this.visitDuration.toFixed(2)),
                  children: [sa]
                });
              } else {
                let preSA = conflictData[saIndex - 1];
                let lastConflict = conflictList[conflictList.length - 1];
                if (sa.startTime < preSA.endTime) {
                  lastConflict.children.push(sa);
                  lastConflict.endTime = sa.endTime;
                  lastConflict.duration = Number(
                    (lastConflict.endTime - lastConflict.startTime).toFixed(2)
                  );
                } else {
                  conflictList.push({
                    startTime: sa.startTime,
                    endTime: sa.startTime + this.visitDuration,
                    duration: Number(this.visitDuration.toFixed(2)),
                    children: [sa]
                  });
                }
              }
            });
            // 拆分工单列表和冲突列表
            dateColumn.busyList = busyList;
            dateColumn.conflictList = conflictList;
          });

          // 更新日历起止时间段
          this.workingHoursStart = workingHoursStart;
          this.workingHoursEnd = workingHoursEnd;

          // 渲染忙闲卡片数据
          this.dateColumns = dateColumns;

          // 查找第一个空闲的且够上门时长的时间段，自动滚动到该空闲卡片
          let firstIdleTime;
          for (let i = 0; i < dateColumns.length; i++) {
            for (let j = 0; j < dateColumns[i].idleList.length; j++) {
              let item = dateColumns[i].idleList[j];
              // 超过上门时长的才推荐
              if (item && item.duration >= this.visitDuration) {
                firstIdleTime = item.startTime;
                // if (firstIdleTime > this.workingHoursStartDefault) {
                //   common.osg.toast(`推荐首个空闲时间 ${item.date} ${item.startTimeStr}`, 'none');
                // }
                this.firstIdleTop = this.hourHight * (item.startTime - this.workingHoursStart); // 向上偏移半个小时，能够完整显示左侧时间
                setTimeout(() => {
                  this.firstIdleTop = this.firstIdleTop + 0.0001; // 因为firstIdleTop没有随滚动变更，解决firstIdleTop赋值相同值不自动滚动的问题
                }, 50);
                break;
              }
            }
            if (firstIdleTime || firstIdleTime == 0) break;
          }
        },
        {
          noload: true
        }
      );
    },
    getTimeStr(timeStr, duration) {
      let hour = timeStr.split(':')[0];
      let minute = timeStr.split(':')[1];
      let newHour = Number(hour) + duration;
      let newTimeStr =
        newHour < 10
          ? '0' + newHour + ':' + minute
          : newHour > 24
          ? '24:00'
          : newHour + ':' + minute;
      return newTimeStr;
    },
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    codelabel(type, option, val) {
      if (!val) return;
      if (type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
      }
    },
    formatLeakagesite(value) {
      if (!value || value.length == 0 || !Array.isArray(value)) return '';
      let leakagesite1 = [];
      value.map(item => {
        leakagesite1.push(item[0]);
      });
      if (leakagesite1.length > 0) {
        let str = common.osg.codelabelForArray('repairParts', leakagesite1, ' ');
        if (str && str.length > 7) {
          return str.substring(0, 7) + '...';
        } else {
          return str;
        }
      } else {
        return '';
      }
    },
    formatDistrict(value) {
      return this.areaList.county_list[value];
    },
    navigateBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    // 获取本月每天的工单数量
    getSANumber() {
      common.osg.ajax(
        'basic/serviceAppointment/querySAWorkflowNode',
        {
          _all: '1',
          sortField: 'exts.applyTimeStr',
          sortOrder: 'asc',
          orderState: 'all',
          'is:state|integer#and': 1,
          'gte:exts.applyTimeStr|string#and': `${this.currentYear}-${this.currentMonth}-01 00:00:00`,
          'lte:exts.applyTimeStr|string#and': `${this.currentYear}-${this.currentMonth}-31 23:59:59`
        },
        res => {
          let dateObj = {};
          for (let i = 1; i <= 31; i++) {
            let date = `${this.currentYear}-${this.currentMonth}-${i < 10 ? '0' + i : i}`;
            dateObj[date] = 0;
          }
          res.data.map(item => {
            let date = item.data.exts.applyTimeStr.split(' ')[0];
            dateObj[date]++;
          });
          let dateList = [];
          for (let date in dateObj) {
            dateList.push({
              date,
              info:
                date == this.today
                  ? `今日${dateObj[date]}单`
                  : dateObj[date] > 0
                  ? dateObj[date] + '单'
                  : ' '
            });
          }
          this.SANumber = dateList;
        }
      );
    },
    getCurrentSA() {
      common.osg.ajax(
        'basic/serviceAppointment/queryById/' + this.currentSA.id,
        { type: 'query' },
        res => {
          this.currentSA.data = res.data.serviceAppointment;
          this.currentSA.show = true;
          // 加入当前待预约工单定位点到地图上
          if (
            this.currentSA.data.gpsPoint &&
            this.currentSA.data.gpsPoint.longitude &&
            this.currentSA.data.gpsPoint.latitude
          ) {
            this.currentSA.marker = {
              id: Number(this.currentSA.data._id),
              label: {
                content: '待预约' + (' ' + this.currentSA.data.address || ''),
                textAlign: 'center',
                bgColor: '#ffffff',
                color: '#323233',
                borderRadius: 4,
                padding: 4,
                anchorX: this.currentSA.data.address
                  ? 0 - this.currentSA.data.address.length * 7
                  : 0
              },
              latitude: this.currentSA.data.gpsPoint.latitude,
              longitude: this.currentSA.data.gpsPoint.longitude,
              iconPath: '/static/images/map/point-yellow.png',
              // #ifdef APP-PLUS
              width: 60, // App端放大图标
              height: 60,
              // #endif
              // #ifdef MP-WEIXIN
              width: 40, // 小程序保持原尺寸
              height: 40
              // #endif
            };
          }
        },
        {
          noload: true
        }
      );
    },
    handleMapClick(e) {
      // 避免与触摸结束事件重复触发
      const now = Date.now();
      if (now - this.lastClickTime < 300) return;
      this.lastClickTime = now;

      // 如果刚刚有拖拽操作，不触发点击
      if (this.hasDragged) {
        this.hasDragged = false;
        return;
      }

      // 执行点击操作
      this.mapDragLineClick();
    },
    mapTouchStart(e) {
      if (e.touches.length !== 1) return;
      this.touchStartTime = Date.now();
      this.dragStartY = e.touches[0].clientY;
      this.dragStartHeight = this.mapHeight;
      this.hasDragged = false; // 重置拖拽标记

      // 我们不立即设置dragging为true，而是等待确认是拖拽操作

      // 防止触摸事件被吞掉
      e.stopPropagation && e.stopPropagation();
    },
    mapTouchMove(e) {
      if (e.touches.length !== 1) return;

      // 计算移动距离
      const moveDistance = Math.abs(this.dragStartY - e.touches[0].clientY);

      // 只有当移动距离超过阈值时才认为是拖拽
      if (moveDistance > 5) {
        this.dragging = true;
        this.hasDragged = true; // 标记已经拖拽

        // 防止页面滚动
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();

        // 计算拖拽距离并应用于高度
        const deltaY = this.dragStartY - e.touches[0].clientY;
        let newHeight = this.dragStartHeight + deltaY;

        // 限制高度范围
        newHeight = Math.max(this.minMapHeight, Math.min(this.maxMapHeight, newHeight));

        // 设置地图高度
        this.mapHeight = newHeight;

        // 根据高度变化设置状态
        this.mapFullyExpanded = newHeight >= this.maxMapHeight * 0.8;
      }
    },
    mapTouchEnd(e) {
      // 记录最后触摸结束时间，用于防止click事件重复触发
      this.lastClickTime = Date.now();

      if (!this.dragging) {
        // 如果没有拖拽，可能是点击，在这里也触发点击事件
        // 但要检查是否是短暂触摸
        if (Date.now() - this.touchStartTime < 300) {
          this.mapDragLineClick();
        }
        return;
      }

      this.dragging = false;

      if (this.mapHeight > this.maxMapHeight * 0.8) {
        this.mapHeight = this.maxMapHeight;
      }
    },
    mapDragLineClick() {
      if (this.mapHeight === this.maxMapHeight) {
        this.mapHeight = this.defaultMapHeight;
        this.mapFullyExpanded = false;
      } else {
        this.mapHeight = this.maxMapHeight;
        this.mapFullyExpanded = true;
      }
    },
    openMapNavigation() {
      // 起点（当前位置）
      const startPoint = this.passingPoints[0];
      // 终点（最后一个途经点）
      const endPoint = this.passingPoints[this.passingPoints.length - 1];
      // 下一个待上门的地点（高德和苹果地图不支持设置途经点，将下一个待上门工单地址作为终点）
      const nextPoint = this.passingPoints[1];
      // 途经点（中间点）
      const wayPoints = this.passingPoints.slice(1, this.passingPoints.length - 1);

      // Android App不支持苹果地图
      let buttons = [{ title: '高德地图' }, { title: '百度地图' }, { title: '腾讯地图' }];
      if (this.systemInfo.osName == 'ios') {
        buttons.push({ title: '苹果地图' });
      }
      plus.nativeUI.actionSheet(
        {
          title: '选择导航应用',
          cancel: '取消',
          buttons
        },
        e => {
          if (e.index > 0) {
            let url = '';

            // 根据用户选择，构建不同地图应用的URL
            switch (e.index) {
              case 1: // 高德地图
                url = this.getAmapUrl(startPoint, nextPoint, wayPoints);
                plus.runtime.openURL(url, err => {
                  if (err) {
                    if (this.systemInfo.osName == 'ios') {
                      uni.showModal({
                        title: '提示',
                        content: '未安装高德地图，否前往App Store下载？',
                        confirmText: '去下载',
                        confirmColor: '#106cff',
                        cancelColor: '#323233',
                        success: res => {
                          if (res.confirm) {
                            plus.runtime.openURL(
                              'https://itunes.apple.com/cn/app/id461703208',
                              function (err) {
                                if (err) {
                                  uni.showToast({
                                    title: '打开App Store失败',
                                    icon: 'none'
                                  });
                                }
                              }
                            );
                          }
                        }
                      });
                    } else {
                      uni.showModal({
                        title: '提示',
                        content: '未安装高德地图，是否前往官网下载？',
                        confirmText: '去下载',
                        confirmColor: '#106cff',
                        cancelColor: '#323233',
                        success: res => {
                          if (res.confirm) {
                            plus.runtime.openURL('https://wap.amap.com/');
                          }
                        }
                      });
                    }
                  }
                });
                break;

              case 2: // 百度地图
                url = this.getBaiduMapUrl(startPoint, endPoint, wayPoints);
                plus.runtime.openURL(url, err => {
                  if (err) {
                    if (this.systemInfo.osName == 'ios') {
                      uni.showModal({
                        title: '',
                        content: '未安装百度地图，是否前往App Store下载？',
                        confirmText: '去下载',
                        confirmColor: '#106cff',
                        cancelColor: '#323233',
                        success: res => {
                          if (res.confirm) {
                            plus.runtime.openURL(
                              'https://itunes.apple.com/cn/app/id452186370',
                              function (err) {
                                if (err) {
                                  uni.showToast({
                                    title: '打开App Store失败',
                                    icon: 'none'
                                  });
                                }
                              }
                            );
                          }
                        }
                      });
                    } else {
                      uni.showModal({
                        title: '提示',
                        content: '未安装百度地图，是否前往官网下载？',
                        confirmText: '去下载',
                        confirmColor: '#106cff',
                        cancelColor: '#323233',
                        success: res => {
                          if (res.confirm) {
                            plus.runtime.openURL('https://map.baidu.com/zt/client/index/');
                          }
                        }
                      });
                    }
                  }
                });
                break;

              case 3: // 腾讯地图
                url = this.getTencentMapUrl(startPoint, endPoint, wayPoints);
                plus.runtime.openURL(url, err => {
                  if (err) {
                    if (this.systemInfo.osName == 'ios') {
                      uni.showModal({
                        title: '提示',
                        content: '未安装腾讯地图，是否前往App Store下载？',
                        confirmText: '去下载',
                        confirmColor: '#106cff',
                        cancelColor: '#323233',
                        success: res => {
                          if (res.confirm) {
                            plus.runtime.openURL(
                              'https://itunes.apple.com/cn/app/id481623196',
                              function (err) {
                                if (err) {
                                  uni.showToast({
                                    title: '打开App Store失败',
                                    icon: 'none'
                                  });
                                }
                              }
                            );
                          }
                        }
                      });
                    } else {
                      uni.showModal({
                        title: '提示',
                        content: '未安装腾讯地图，是否前往下载？',
                        confirmText: '去下载',
                        confirmColor: '#106cff',
                        cancelColor: '#323233',
                        success: res => {
                          if (res.confirm) {
                            plus.runtime.openURL('https://sj.qq.com/appdetail/com.tencent.map');
                          }
                        }
                      });
                    }
                  }
                });
                break;

              case 4: // 苹果地图（仅iOS可用）
                if (this.systemInfo.osName == 'ios') {
                  url = this.getAppleMapUrl(startPoint, nextPoint, wayPoints);
                  plus.runtime.openURL(url, function (err) {
                    if (err) {
                      uni.showModal({
                        title: '提示',
                        content: '未安装苹果地图，是否前往App Store下载？',
                        confirmText: '去下载',
                        confirmColor: '#106cff',
                        cancelColor: '#323233',
                        success: res => {
                          if (res.confirm) {
                            plus.runtime.openURL(
                              'https://itunes.apple.com/cn/app/id915056765',
                              function (err) {
                                if (err) {
                                  uni.showToast({
                                    title: '打开App Store失败',
                                    icon: 'none'
                                  });
                                }
                              }
                            );
                          }
                        }
                      });
                    }
                  });
                }
                break;
            }
          }
        }
      );
    },
    // 高德地图URI API
    getAmapUrl(startPoint, nextPoint, wayPoints) {
      let url = '';

      if (this.systemInfo.osName == 'ios') {
        url = 'iosamap://path?sourceApplication=XLink&';
      } else {
        url = 'androidamap://route?sourceApplication=XLink&';
      }

      // 起点
      url += `slat=${startPoint.latitude}&slon=${startPoint.longitude}&sname=我的位置`;

      // 终点（由于高德不支持指定途经点，将下一个待上门的地点作为终点）
      url += `&dlat=${nextPoint.latitude}&dlon=${nextPoint.longitude}&dname=${
        nextPoint.label?.content || '终点'
      }`;

      // 导航模式：驾车
      url += '&t=0'; // t=0表示驾车模式

      return url;
    },
    // 构建百度地图URL
    getBaiduMapUrl(startPoint, endPoint, wayPoints) {
      let url = 'baidumap://map/direction?';

      // 起点
      url += `origin=name:我的位置|latlng:${startPoint.latitude},${startPoint.longitude}`;

      // 终点
      url += `&destination=name:${endPoint.label?.content || '终点'}|latlng:${endPoint.latitude},${
        endPoint.longitude
      }`;

      // 导航模式：驾车导航，gcj02坐标系
      url += '&mode=driving&coord_type=gcj02&src=ios.Xiulian.XLink';

      // 途经点 - 百度地图支持途经点
      if (wayPoints && wayPoints.length) {
        let waypointList = [];
        wayPoints.forEach((point, index) => {
          waypointList.push({
            name: point.label?.content || `途经点${index + 1}`,
            lat: point.latitude,
            lng: point.longitude
          });
        });
        url += `&viaPoints=${JSON.stringify({ viaPoints: waypointList })}`;
      }

      return url;
    },

    // 腾讯地图URI API
    getTencentMapUrl(startPoint, endPoint, wayPoints) {
      let url = 'qqmap://map/routeplan?';

      // 起点
      url += `from=我的位置&fromcoord=${startPoint.latitude},${startPoint.longitude}`;

      // 终点
      url += `&to=${endPoint.label?.content || '终点'}&tocoord=${endPoint.latitude},${
        endPoint.longitude
      }`;

      // 导航模式：驾车
      url += '&type=drive&referer=XLink';

      // 途经点 - 腾讯地图支持途经点
      if (wayPoints && wayPoints.length) {
        let waypointStr = '';
        wayPoints.forEach((point, index) => {
          waypointStr += `name:${point.label?.content};coord:${point.latitude},${point.longitude};|`;
        });
        if (waypointStr) {
          url += `&passes=${waypointStr}`;
        }
      }

      return url;
    },

    // 苹果地图URI API
    getAppleMapUrl(startPoint, nextPoint, wayPoints) {
      let url = 'http://maps.apple.com/?';

      // 起点 - 苹果地图使用saddr参数，起点定位不准所以注释
      // url += `saddr=${startPoint.latitude},${startPoint.longitude}`;

      // 终点 - 苹果地图使用daddr参数
      url += `daddr=${nextPoint.latitude},${nextPoint.longitude}`;

      // 导航类型：d=驾车
      url += '&dirflg=d';

      return url;
    }
  }
};
</script>

<style lang="scss">
.schedule {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .calendar {
    box-shadow: 0 4px 8px -4px rgba(100, 101, 102, 0.12); // 只保留底部阴影，避免App端顶部影响状态栏样式
    border-radius: 0 0 16px 16px;
    overflow: hidden;
    background: #fefefe;
  }
  #schedule {
    background-color: #fefefe;
  }
  .current-sa {
    margin: 10px 10px 0;
    background-color: #e0f8d6;
    padding: 5px 5px 5px 10px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
  }
  #schedule {
    flex: 1;
    overflow-y: auto;
    .calendar-view {
      display: flex;
      .time-column {
        width: 55px;
        .time-item {
          justify-content: center;
          height: 50px;
          display: flex;
          align-items: center;
          color: #969799;
          font-size: 14px;
        }
      }
      .time-period-column {
        flex: 1;
        position: relative;
        .time-period-item {
          height: 50px;
          display: flex;
          align-items: center;
          .line {
            width: 100%;
            border-bottom: 1px solid #ebedf0;
            margin-right: 10px;
          }
        }
        .timeline {
          position: absolute;
          width: calc(100% - 10px);
          display: flex;
          align-items: center;
          .timeline-dot {
            width: 5px;
            height: 5px;
            background-color: #106cff;
            border-radius: 50%;
          }
          .timeline-line {
            flex: 1;
            border-bottom: 1px solid #106cff;
          }
        }
        .schedule-item {
          position: absolute;
          width: calc(100% - 10px);
          margin: 3px 0px;
          padding: 0 5px;
          border-radius: 8px;
          box-sizing: border-box;
          font-size: 14px;
          opacity: 0.8;
          display: flex;
          justify-content: space-evenly;
          flex-direction: column;
          .address {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
            line-height: 22px;
          }
        }
        .schedule-item-conflict {
          flex: 1;
          position: unset;
        }
        .conflict-view {
          position: absolute;
          width: calc(100% - 10px);
          margin: 3px 0px;
          box-sizing: border-box;
          display: flex;
          .schedule-item {
            margin: 0;
          }
        }
      }
    }
  }
  // 日期下方信息样式
  .uni-calendar-item__weeks-box-circle {
    display: none;
  }
  .uni-calendar-item--extra {
    color: #106cff !important;
  }
  .uni-calendar-item--checked {
    color: #ffffff !important;
  }
  .uni-calendar-item--multiple {
    color: #ffffff !important;
  }
  .uni-calendar-item--isDay {
    color: #ffffff !important;
  }
  .uni-calendar-item__weeks-lunar-text {
    min-height: 19px;
  }
  // 地图容器相关样式
  .map-container {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color: #fff;
    box-shadow: 0 -4px 12px 0 rgba(100, 101, 102, 0.2);
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &.map-dragging {
      transition: none; /* 拖拽时无过渡效果 */
    }

    &.map-fully-expanded {
      border-radius: 0; /* 全屏时取消圆角 */
      box-shadow: none;
    }

    .map-drag-handle {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 30px; /* 增大拖拽区域高度 */
      z-index: 200;
      background: rgba(255, 255, 255, 0.8); /* 半透明背景确保拖拽条可见 */
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px 16px 0 0;

      .map-drag-line {
        width: 50px;
        height: 6px;
        background-color: #969799;
        border-radius: 3px;
      }
    }

    .map {
      width: 100%;
      height: calc(100% - 30px); /* 留出一些空间给拖拽条 */
      margin-top: 30px;
    }

    .nav-button {
      position: absolute;
      z-index: 100;
      bottom: 8px;
      right: 8px;
      width: 60px;
      height: 32px;
      text-align: center;
      color: #fff;
      background-color: #106cff;
      border-radius: 4px;
      font-size: 12px;
    }
  }
}

.uni-calendar__three-days-container {
  display: flex;
  justify-content: space-between;
  padding: 0;
  height: 50px;
  width: 100%;
}

.uni-calendar__three-days-item {
  flex: 1;
  display: flex;
  justify-content: center;
  width: 33.33%;
}

/* 新增样式，处理3日模式收起时不显示背景色 */
.calendar-mode-3 .uni-calendar__box--collapsed .uni-calendar-item--multiple,
.calendar-mode-3 .uni-calendar__box--collapsed .uni-calendar-item--before-checked,
.calendar-mode-3 .uni-calendar__box--collapsed .uni-calendar-item--after-checked,
.calendar-mode-3 .uni-calendar__box--collapsed .uni-calendar-item--checked {
  background-color: transparent !important;
  color: #323233 !important;
  font-weight: 600;
  font-size: 16px !important;
}
.calendar-mode-3 .uni-calendar__box--collapsed .uni-calendar-item__weeks-lunar-text {
  font-weight: normal;
  font-size: 12px !important;
  color: #646566 !important;
}
.customCallout {
  width: 200px;
  height: 44px;
  font-size: 24rpx;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
