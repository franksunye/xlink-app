<template>
  <view class="evaluation">
    <qiun-data-charts
      type="radar"
      :opts="{
        legend: { position: 'bottom' },
        extra: { radar: { border: true, max: 20, gridCount: 4, axisLabel: true } }
      }"
      :chartData="chartData"
    />
    <view class="top" style="margin-top: 0">
      <uni-collapse>
        <uni-collapse-item
          titleBorder="none"
          :border="false"
          style="padding-bottom: 10px; background-color: #f7f7f7; border-bottom: 1px solid #e0e0e0"
        >
          <template v-slot:title>
            <view class="c-flex c-item-center">
              <i
                class="iconfont icon-changjing"
                style="color: #646566; font-size: 20px; margin-right: 8px"
              ></i>
              <text>
                <text>对练场景：</text>
                <text style="color: #646566">{{ session.scenario.name || '' }}</text>
              </text>
            </view>
          </template>
          <view class="c-collapse-content">
            <text class="text">
              {{ session.scenario.description || '没有描述内容' }}
            </text>
          </view>
        </uni-collapse-item>
        <uni-collapse-item
          titleBorder="none"
          :border="false"
          style="padding-top: 10px; background-color: #f7f7f7"
        >
          <template v-slot:title>
            <view class="c-flex c-item-center">
              <i
                class="iconfont icon-kehuhuaxiang"
                style="color: #646566; font-size: 18px; margin-right: 8px"
              ></i>
              <text>客户画像：</text>
              <text style="color: #646566">
                {{ session.profile.name || '' }}
              </text>
              <text class="c-m-l-20" style="color: #646566">
                {{ session.profile.gender || '' }}
              </text>
            </view>
          </template>
          <view class="c-collapse-content">
            <view style="color: #969799; margin: 0 0 5px 0">基本信息</view>
            <view>
              <text v-if="session.profile.age">{{ session.profile.age }}岁</text>
              <text v-if="session.profile.residence_type" class="c-m-l-20">
                {{ session.profile.residence_type }}
              </text>
              <text v-if="session.profile.profession" class="c-m-l-20">
                {{ session.profile.profession }}
              </text>
              <text v-if="session.profile.personality" class="c-m-l-20">
                性格{{ session.profile.personality }}
              </text>
            </view>
            <view style="color: #969799; margin: 10px 0 5px 0">客户需求</view>
            <view>
              <text style="font-weight: 600">{{ session.profile.leak_location }}漏水</text>
              <text v-if="session.profile.is_question" style="margin-left: 10px">仅咨询</text>
            </view>
            <view style="color: #969799; margin: 10px 0 5px 0">房产信息</view>
            <view>
              <text>{{ session.profile.property_info.is_villa ? '别墅' : '非别墅' }}</text>
              <text v-if="session.profile.property_info.structure" class="c-m-l-20">
                {{ session.profile.property_info.structure }}
              </text>
              <text
                v-if="
                  session.profile.property_info.building_age ||
                  session.profile.property_info.building_age == 0
                "
                class="c-m-l-20"
              >
                房龄{{ session.profile.property_info.building_age }}年
              </text>
              <text v-if="session.profile.property_info.price_per_sqm" class="c-m-l-20">
                房价{{ session.profile.property_info.price_per_sqm }}元/㎡
              </text>
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
    <view class="top">
      <uni-collapse>
        <uni-collapse-item
          titleBorder="none"
          :border="false"
          disabled
          class="c-collapse-item-score"
          style="padding-bottom: 10px; background-color: #f7f7f7; border-bottom: 1px solid #e0e0e0"
        >
          <template v-slot:title>
            <view class="c-flex c-item-center">
              <i
                class="iconfont icon-completed"
                style="color: #646566; font-size: 20px; margin-right: 8px"
              ></i>
              <text>
                综合评分：
                <text class="c-bold c-size-22">{{ evaluation.total_score }}</text>
                <text class="c-size-14 c-m-l-10">分</text>
              </text>
            </view>
          </template>
        </uni-collapse-item>
        <uni-collapse-item
          titleBorder="none"
          :border="false"
          open
          style="
            padding-top: 10px;
            padding-bottom: 10px;
            background-color: #f7f7f7;
            border-bottom: 1px solid #e0e0e0;
          "
        >
          <template v-slot:title>
            <view class="c-flex c-item-center">
              <i
                class="iconfont icon-good-job"
                style="color: #106cff; font-size: 18px; margin-right: 8px"
              ></i>
              <text>优点</text>
            </view>
          </template>
          <view class="c-collapse-content">
            <view v-for="(item, i) in evaluation.overall_assessment.strengths" class="c-flex">
              <text class="point"></text>
              <text>{{ item }}</text>
            </view>
          </view>
        </uni-collapse-item>
        <uni-collapse-item
          titleBorder="none"
          :border="false"
          open
          style="padding-top: 10px; background-color: #f7f7f7"
        >
          <template v-slot:title>
            <view class="c-flex c-item-center">
              <i
                class="iconfont icon-smile-comment"
                style="color: #d6000f; font-size: 18px; margin-right: 8px"
              ></i>
              <text>
                <text>建议</text>
              </text>
            </view>
          </template>
          <view class="c-collapse-content">
            <view v-for="(item, i) in evaluation.overall_assessment.suggestions" class="c-flex">
              <text class="point"></text>
              <text>{{ item }}</text>
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      session: {},
      evaluation: {},
      chartData: {
        categories: [],
        series: [
          {
            name: '能力评估',
            data: []
          }
        ]
      }
    };
  },
  onLoad: async function (options) {
    common.osg.init(this, options, app);
    if (options.sessionId) this.sessionId = options.sessionId;
    this.getSession();
  },
  methods: {
    getSession() {
      common.osg.ajax(
        '/training/session/' + this.sessionId,
        {},
        res => {
          this.session = res.session;
          this.evaluation = res.evaluation;
          this.chartData.categories = res.evaluation.radar_chart_data.labels;
          this.chartData.series[0].data = res.evaluation.radar_chart_data.data;
        },
        {
          noload: true,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.evaluation {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 1px;
  .top {
    border-radius: 12px;
    margin: 16px;
    padding: 12px;
    box-sizing: border-box;
    text-align: justify;
    overflow: hidden;
    align-self: flex-start;
    background-color: rgb(247, 247, 247);
    .c-collapse-content {
      font-size: 14px;
      line-height: 24px;
      padding: 10px 0 0 0;
      background-color: rgb(247, 247, 247);
    }
    .c-collapse-item-score {
      ::v-deep .uni-collapse-item__title-arrow {
        display: none;
      }
    }
  }
  .point {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #969799;
    margin: 10px 16px 0 6px;
  }
}
</style>
