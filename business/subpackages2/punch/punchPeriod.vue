<template>
  <view class="punchPeriod">
    <uni-calendar
      class="uni-calendar--hook"
      :insert="true"
      :showMonth="false"
      :selected="punchedData"
      @change="onDateChange"
      @monthSwitch="onMonthSwitch"
      ref="calendar"
      :lunar="false"
      :range="false"
      :mode="1"
      :collapsible="false"
    />
    <block v-for="(item, i) in data" :key="i">
      <view v-if="selectedDate == item.date" class="c-card">
        <view>
          <view>工单编号：{{ item.candidateSa.find(sa => sa.sid == item.sid).orderNum }}</view>
          <view class="c-card-content-item">开工时间：{{ item.startTime }}</view>
          <view class="c-card-content-item">收工时间：{{ item.endTime }}</view>
          <view class="c-card-content-item">工作时长：{{ item.workTime }}分钟</view>
        </view>
      </view>
    </block>
    <van-empty
      v-if="!data.find(item => item.date == selectedDate)"
      description="当天没有打卡记录"
    />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    var that = this;
    return {
      sid: '',
      data: [],
      punchedDate: {}, // 统计已打卡的日期
      punchedData: [], // 组件显示“已打卡”的数据
      year: '', // 日历当前选中的年
      month: '', // 日历当前选中的月
      selectedDate: '' // 日历当前选中的日期
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.sid = params.serviceAppointmentId;
    let now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth() + 1;
    this.month = this.month < 10 ? '0' + this.month : this.month;
    let today = now.getDate();
    today = today < 10 ? '0' + today : today;
    this.selectedDate = this.year + '-' + this.month + '-' + today;
    if (this.sid) {
      this.getDataBySid();
    } else {
      this.getData();
    }
  },
  methods: {
    getData() {
      common.osg.ajax(
        '/biz/punch/query',
        {
          'gte:createTime|date#and': this.year + '-' + this.month + '-01',
          'lte:createTime|date#and': this.year + '-' + this.month + '-31'
        },
        res => {
          res.data.map(item => {
            item.date = item.createTime.split(' ')[0];
            if (!this.punchedDate[item.date]) {
              this.punchedDate[item.date] = 1;
              this.punchedData.push({
                date: item.date,
                info: '已打卡'
              });
            }
          });
          this.data = res.data;
        }
      );
    },
    getDataBySid() {
      common.osg.ajax('/biz/punch/queryBySid', { sid: this.sid }, res => {
        res.data.map(item => {
          item.date = item.createTime.split(' ')[0];
          if (!this.punchedDate[item.date]) {
            this.punchedDate[item.date] = 1;
            this.punchedData.push({
              date: item.date,
              info: '已打卡'
            });
          }
        });
        this.data = res.data;
      });
    },
    onDateChange(e) {
      this.selectedDate = e.fulldate;
    },
    onMonthSwitch(e) {
      this.year = e.year;
      this.month = e.month < 10 ? '0' + e.month : e.month;
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.punchPeriod {
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 10px;
}
.record {
  margin: 10px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
}
</style>
