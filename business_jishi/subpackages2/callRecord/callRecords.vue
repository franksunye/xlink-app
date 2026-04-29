<template>
  <view class="call-records" @click.capture="track">
    <scroll-view scroll-y="true" @scrolltolower="scrollToLower" class="c-h-1">
      <view class="c-relative">
        <swiper
          v-if="data._id"
          indicator-dots
          autoplay
          indicator-active-color="#ff6900"
          class="records-swiper"
          @click="open('/subpackages2/callRecord/callRecordEval')"
        >
          <swiper-item class="records-swiper-item">
            <view style="padding-bottom: 5px">
              <view class="c-flex c-flex-between c-item-center" style="padding: 0 10px">
                <view class="c-flex c-item-center">
                  <image
                    src="https://pub.fsgo365.cn/icon-radar-chart.png"
                    style="width: 20px; height: 20px; margin: 0 5px 1px 0"
                  ></image>
                  <text class="c-bold">能力维度评估</text>
                </view>
                <van-button
                  type="info"
                  size="mini"
                  round
                  custom-style="color:#ff6900;background-color:rgba(22, 93, 255, 0.10);border:none;padding-left:8px;padding-right:8px;display:flex;font-weight:bold;font-size:12px;"
                >
                  综合评分：{{ data.score }}
                </van-button>
              </view>
              <view style="height: 150px">
                <qiun-data-charts
                  type="radar"
                  canvasId="radar"
                  :canvas2d="true"
                  :opts="{
                    padding: [10, 0, 10, 0],
                    legend: { show: false },
                    extra: {
                      radar: {
                        border: true,
                        max: 5,
                        gridCount: 5,
                        borderWidth: 3,
                        axisLabel: false
                      }
                    }
                  }"
                  :chartData="chartData"
                />
              </view>
            </view>
          </swiper-item>
          <swiper-item class="records-swiper-item">
            <view class="c-flex c-flex-between c-item-center" style="padding: 0 10px">
              <view class="c-flex c-item-center">
                <image
                  src="https://pub.fsgo365.cn/icon-line-chart.png"
                  style="width: 20px; height: 20px; margin: 0 5px 1px 0"
                ></image>
                <text class="c-bold">评分趋势分析</text>
              </view>
              <van-button
                type="info"
                size="mini"
                round
                custom-style="color:#00b42a;background-color:rgba(0, 180, 42, 0.1);border:none;padding-left:8px;padding-right:8px;display:flex;font-weight:bold;font-size:12px;"
              >
                {{ improvementRate > 0 ? '呈上升趋势' : '呈下降趋势' }}
              </van-button>
            </view>
            <view style="height: 150px">
              <qiun-data-charts
                type="line"
                canvasId="line"
                :canvas2d="true"
                :opts="{
                  padding: [15, 15, 15, 15],
                  legend: { show: false },
                  extra: { line: { type: 'curve', width: 3 } }
                }"
                :chartData="chartData2"
              />
            </view>
          </swiper-item>
        </swiper>
        <view
          @click="open('/subpackages2/callRecord/callRecordEval')"
          style="position: absolute; bottom: 5px; right: 28px; font-size: 14px; color: #ff6900"
        >
          c
        </view>
      </view>
      <!-- <view class="search">
        <van-search
          :value="searchValue"
          @clear="onSearch"
          @blur="onSearch"
          placeholder="搜索工单编号、客户姓名、地址"
        />
      </view> -->
      <view
        v-for="(item, i) in fpi.data"
        class="card"
        @click="open('./callRecord', { id: item._id })"
      >
        <view class="c-flex c-flex-between c-item-center c-flex-wrap" style="gap: 8px">
          <view>
            <text class="c-bold c-size-18 c-m-r-10">{{ item.saData.name }}</text>
            <text>#{{ item.saData.orderNum.slice(5) }}</text>
          </view>
          <view class="c-flex c-item-center">
            <view
              class="c-m-r-10"
              v-if="item.saData.exts.leakagesite_copy && item.saData.exts.leakagesite_copy[0]"
            >
              <van-icon name="list-switching" class="c-m-r-10 c-gray-6" />
              <text>{{ formatLeakagesite([item.saData.exts.leakagesite_copy[0]]) }}</text>
            </view>
            <view>
              <van-icon name="flag-o" class="c-m-r-10 c-gray-6" />
              <text>
                {{ codelabel('select', 'status', item.saData.status) || '' }}
              </text>
            </view>
          </view>
        </view>
        <view
          style="margin-top: 8px"
          v-if="item.saData.district || item.saData.address"
          class="c-nowrap"
        >
          <van-icon name="location-o" class="c-m-r-10 c-gray-6" />
          <text>
            {{
              (item.saData.district ? formatDistrict(Number(item.saData.district)) : '') +
              (item.saData.address || '')
            }}
          </text>
        </view>
        <view
          style="margin-top: 10px; padding-top: 7px; border-top: 1px dashed #e5e6eb"
          class="c-flex c-flex-between c-item-center"
        >
          <view>
            <van-icon name="phone-o" class="c-m-r-10 c-gray-6" />
            <text>{{ formatCallStartTime(item.callCreateTime) }}</text>
          </view>
          <view>
            <van-icon name="clock-o" class="c-m-r-10 c-gray-6" />
            <text>{{ formatCallDuration(item.bizDuration) }}</text>
          </view>
        </view>
        <view style="margin-top: 8px" class="c-flex c-flex-between c-item-center">
          <view class="c-flex c-item-center">
            <uni-rate
              :size="18"
              :value="((item.evalData.score / 100) * 5).toFixed(1)"
              class="c-m-r-10"
            />
            <text>{{ ((item.evalData.score / 100) * 5).toFixed(1) }}</text>
          </view>
          <view>
            <van-button
              type="info"
              icon="play-circle-o"
              size="small"
              custom-style="color:#ff6900;background-color:rgba(22, 93, 255, 0.10);border:none;"
              @click.native.stop="open('./callRecord', { id: item._id, type: 'play' })"
              :data-event="{ id: 'B43eOJ13ay' }"
            >
              播放
            </van-button>
            <van-button
              type="info"
              icon="orders-o"
              size="small"
              custom-style="color:#ff6900;background-color:rgba(22, 93, 255, 0.10);border:none;margin-left:16px"
              @click.native.stop="open('./callRecord', { id: item._id, type: 'speechText' })"
              :data-event="{ id: 'B4323ecord' }"
            >
              文本
            </van-button>
          </view>
        </view>
      </view>
      <uni-load-more v-if="fpi.data.length > 5" :status="loadStatus"></uni-load-more>
      <van-empty
        v-if="fpi.data.length == 0"
        description="没有数据"
        class="c-empty c-empty-center"
      ></van-empty>
    </scroll-view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
import UniRate from '../uni_modules/uni-rate/components/uni-rate/uni-rate.vue';
import qiunDataCharts from '../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue';
export default {
  components: {
    'qiun-data-charts': qiunDataCharts,
    'uni-rate': UniRate
  },
  data() {
    return {
      user: {},
      options: {
        codecfg_repairParts: {
          codeId: 'allPartsOne'
        },
        codecfg_status: {
          codeId: 'STATUS'
        }
      },
      areaList: Object.assign({}, areajs.default),
      fpi: {
        page: 1,
        rows: 10,
        data: []
      },
      loadStatus: 'more',
      reachBottom: false,
      chartData: {
        categories: [],
        series: [
          {
            name: '综合评估',
            color: '#ff6900',
            data: []
          }
        ]
      },
      opts: {
        color: [
          '#1890FF',
          '#91CB74',
          '#FAC858',
          '#EE6666',
          '#73C0DE',
          '#3CA272',
          '#FC8452',
          '#9A60B4',
          '#ea7ccc'
        ],
        padding: [15, 10, 0, 15],
        enableScroll: false,
        legend: {},
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2
        },
        extra: {
          line: {
            type: 'curve',
            width: 2,
            activeType: 'hollow'
          }
        }
      },
      chartData2: {
        categories: [],
        series: [
          {
            name: '最近10次通话水平评估',
            lineType: 'solid',
            color: '#ff6900',
            data: []
          }
        ]
      },
      data: {},
      improvementRate: 0
    };
  },
  onLoad() {
    common.osg.init(this, {}, app);
    this.user = wx.getStorageSync('user');
    this.getAiSpeechRecentEval();
    this.getAiSpeechEval();
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    onSearch(e) {
      this.searchValue = e && e.detail && e.detail.value ? e.detail.value.trim() : '';
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.getData();
    },
    getData() {
      common.osg.ajax(
        'stat/aggr/speechText',
        {
          aggr: JSON.stringify([
            {
              $match: {
                userId: this.user._id,
                serviceAppointmentCallCount: 1
              }
            },
            {
              $project: {
                result: 0
              }
            },
            {
              $lookup: {
                from: 'serviceAppointment',
                let: { sid: '$serviceAppointmentId' },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ['$_id', '$$sid'] } }
                  }
                ],
                as: 'saData'
              }
            },
            {
              $unwind: '$saData'
            },
            {
              $lookup: {
                from: 'frm_4670873342363649607_AiSpeechEval',
                let: { sid: '$serviceAppointmentId' },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ['$serviceAppointmentId', '$$sid'] } }
                  },
                  {
                    $project: { answer: 0 }
                  }
                ],
                as: 'evalData'
              }
            },
            {
              $unwind: '$evalData'
            },
            {
              $sort: { callCreateTime: -1 }
            },
            {
              $skip: this.fpi.rows * (this.fpi.page - 1)
            },
            {
              $limit: this.fpi.rows
            }
          ])
        },
        res => {
          if (res.length == 0 && this.fpi.page > 1) {
            this.fpi.page--;
            this.loadStatus = 'noMore';
          } else {
            this.fpi.data = this.fpi.data.concat(res);
            this.loadStatus = 'more';
          }
          this.reachBottom = false;
        }
      );
    },
    getAiSpeechRecentEval(callback) {
      common.osg.ajax(
        'biz/extForm/queryByColName/AiSpeechRecentEval',
        {
          'is:userId|string#and': this.user._id,
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          page: 1,
          rows: 1
        },
        res => {
          if (res.data.length == 0) return;
          this.data = res.data[0];
          this.chartData.categories = [
            '沟通能力 ' + this.data.evalScore1,
            '问题解决 ' + this.data.evalScore2,
            '专业知识 ' + this.data.evalScore3,
            '服务态度 ' + this.data.evalScore4,
            '响应速度 ' + this.data.evalScore5,
            '跟进能力 ' + this.data.evalScore6
          ];
          this.chartData.series[0].data = [
            this.data.evalScore1,
            this.data.evalScore2,
            this.data.evalScore3,
            this.data.evalScore4,
            this.data.evalScore5,
            this.data.evalScore6
          ];
        }
      );
    },
    getAiSpeechEval() {
      common.osg.ajax(
        'biz/extForm/queryByColName/AiSpeechEval',
        {
          'is:userId|string#and': this.user._id,
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          page: 1,
          rows: 10
        },
        res => {
          if (res.data.length == 0) return;
          let scoreData = res.data
            .map((item, i) => {
              this.chartData2.categories.push(i + 1);
              return item.score;
            })
            .reverse();
          let firstScore = scoreData[0];
          let lastScore = scoreData[scoreData.length - 1];
          this.improvementRate = Number((((lastScore - firstScore) / firstScore) * 100).toFixed(1));
          this.chartData2.series[0].data = scoreData;
        }
      );
    },
    scrollToLower() {
      if (!this.reachBottom) {
        this.loadStatus = 'loading';
        this.reachBottom = true;
        this.fpi.page++;
        this.getData();
      }
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
      if (value.length > 0) {
        let str = common.osg.codelabelForArray('repairParts', value, ' ');
        return str;
      } else {
        return '';
      }
    },
    formatDistrict(value) {
      return this.areaList.county_list[value];
    },
    formatCallStartTime(value) {
      return common.osg.readableTime(value, 'semantic');
    },
    formatCallDuration(value) {
      return common.osg.readableTime(value, 'duration');
    },
    open(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>
<style lang="scss">
.call-records {
  .card {
    margin: 16px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e6eb;
    border-radius: 12px;
    width: calc(100vw - 32px);
    background-color: #fff;
    box-sizing: border-box;
    line-height: 24px;
  }

  .van-search {
    margin: 0 16px;
    border: 1px solid #e5e6eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    padding: 0;
    height: 44px;
    .van-search__content {
      background-color: #fff;
    }
  }
}

// 操作区
.records-swiper {
  margin: 16px;
  height: 200px;
  padding: 10px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e6eb;
  border-radius: 12px;
  width: calc(100vw - 32px);
  background-color: #fff;
  box-sizing: border-box;
  .wx-swiper-dots {
    margin-top: 10px !important;
    margin-bottom: -10px;
    .wx-swiper-dot {
      width: 6px;
      height: 6px;
      border-radius: 3px;
    }
    .wx-swiper-dot-active {
      width: 20px;
      border-radius: 8px;
    }
  }
}
</style>
