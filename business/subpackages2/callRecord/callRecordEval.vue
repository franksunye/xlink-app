<template>
  <scroll-view v-if="data._id" class="call-record-eval" scroll-y>
    <view class="card c-flex c-flex-col c-item-center">
      <view
        style="
          font-size: 48px;
          line-height: 1;
          font-weight: 700;
          color: #106cff;
          margin-bottom: 8px;
        "
      >
        {{ data.score }}
      </view>
      <uni-rate :size="22" :value="data.score" style="margin-bottom: 16px" />
      <view class="c-size-14">基于最近10次通话记录的综合评估</view>
      <view class="c-flex c-flex-wrap" style="gap: 16px; margin-top: 24px">
        <view class="card-item">
          <text class="type">沟通能力</text>
          <text class="score" :class="data.evalScore1 >= data.score ? 'c-green' : 'c-yellow'">
            {{ data.evalScore1 }}
          </text>
        </view>
        <view class="card-item">
          <text class="type">问题解决</text>
          <text class="score" :class="data.evalScore2 >= data.score ? 'c-green' : 'c-yellow'">
            {{ data.evalScore2 }}
          </text>
        </view>
        <view class="card-item">
          <text class="type">专业知识</text>
          <text class="score" :class="data.evalScore3 >= data.score ? 'c-green' : 'c-yellow'">
            {{ data.evalScore3 }}
          </text>
        </view>
        <view class="card-item">
          <text class="type">服务态度</text>
          <text class="score" :class="data.evalScore4 >= data.score ? 'c-green' : 'c-yellow'">
            {{ data.evalScore4 }}
          </text>
        </view>
        <view class="card-item">
          <text class="type">响应速度</text>
          <text class="score" :class="data.evalScore5 >= data.score ? 'c-green' : 'c-yellow'">
            {{ data.evalScore5 }}
          </text>
        </view>
        <view class="card-item">
          <text class="type">跟进能力</text>
          <text class="score" :class="data.evalScore6 >= data.score ? 'c-green' : 'c-yellow'">
            {{ data.evalScore6 }}
          </text>
        </view>
      </view>
      <qiun-data-charts
        type="radar"
        canvasId="radar1"
        :canvas2d="true"
        :opts="{
          padding: [20, 10, 0, 10],
          legend: { show: false },
          extra: { radar: { border: true, max: 5, gridCount: 5, borderWidth: 3, axisLabel: false } }
        }"
        :chartData="chartData"
      />
    </view>
    <view class="card">
      <view class="c-flex c-item-center" style="margin-bottom: 16px">
        <!-- <image
          src="https://pub.fsgo365.cn/icon-line-chart.png"
          style="width: 20px; height: 20px; margin: 0 5px 1px 0"
        ></image> -->
        <text style="font-size: 18px; line-height: 28px; font-weight: 500">近10次通话评分趋势</text>
      </view>
      <view style="height: 150px">
        <qiun-data-charts
          type="line"
          canvasId="line1"
          :canvas2d="true"
          :opts="{
            padding: [10, 5, 0, 0],
            legend: { show: false },
            extra: { line: { type: 'curve', width: 3 } }
          }"
          :chartData="chartData2"
        />
      </view>
      <view class="c-flex c-flex-wrap" style="gap: 16px; margin-top: 24px">
        <view class="card-item" style="min-width: 50px">
          <text class="type">最高分</text>
          <text class="score c-green">{{ maxScore }}</text>
        </view>
        <view class="card-item" style="min-width: 50px">
          <text class="type">最低分</text>
          <text class="score c-yellow">{{ minScore }}</text>
        </view>
        <view class="card-item" style="min-width: 50px">
          <text class="type">提升幅度</text>
          <text class="score" :class="improvementRate > 0 ? 'c-blue' : 'c-red'">
            {{ improvementRate > 0 ? '+' + improvementRate : improvementRate }}%
          </text>
        </view>
      </view>
    </view>
    <view class="card">
      <view style="font-size: 18px; line-height: 28px; margin-bottom: 10px; font-weight: 500">
        改进建议
      </view>
      <mp-html :tag-style="tagStyle" scroll-table :content="data.answer" />
    </view>
    <view style="height: 1px"></view>
  </scroll-view>
  <van-empty v-else description="当前账号没有数据" />
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
import UniRate from '../uni_modules/uni-rate/components/uni-rate/uni-rate.vue';
import MarkdownIt from 'markdown-it';
import qiunDataCharts from '../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue';
import mpHtml from '../uni_modules/mp-html/components/mp-html/mp-html.vue';
export default {
  components: {
    'qiun-data-charts': qiunDataCharts,
    'mp-html': mpHtml,
    'uni-rate': UniRate
  },
  data() {
    return {
      userId: '',
      data: {},
      tagStyle: {
        // 文本与段落
        p: 'margin: 16px 0;',
        span: '',
        strong: 'font-weight: bold;',
        b: 'font-weight: bold;',
        i: 'font-style: italic;',
        em: 'font-style: italic;',
        u: 'text-decoration: underline;',
        del: 'text-decoration: line-through;',
        mark: 'background-color: yellow;',
        small: 'font-size: 80%;',
        sub: 'vertical-align: sub; font-size: smaller;',
        sup: 'vertical-align: super; font-size: smaller;',
        br: '',

        // 标题
        h1: 'margin: 16px 0;font-weight: bold;font-size: 2em;',
        h2: 'margin: 16px 0;font-weight: bold;font-size: 1.5em;',
        h3: 'margin: 16px 0;font-weight: bold;font-size: 1.17em;',
        h4: 'margin: 16px 0;font-weight: bold;font-size: 1em;',
        h5: 'margin: 16px 0;font-weight: bold;font-size: 0.83em;',
        h6: 'margin: 16px 0;font-weight: bold;font-size: 0.67em;',

        // 列表
        ul: 'margin: 1em 0;padding-left: 2em;list-style-type: disc;',
        ol: 'margin: 1em 0;padding-left: 2em;list-style-type: decimal;',
        li: 'margin: 0.6em 0;',

        // 图片和媒体
        img: 'max-width: 100%;height: auto;display: block;',
        video: 'max-width: 100%;display: block;',
        audio: 'width: 100%;',

        // 表格
        table: 'border-collapse: collapse;border-spacing: 0;width: auto;min-width:100%',
        thead: '',
        tbody: '',
        tfoot: '',
        th: 'white-space: nowrap; max-width: 500px;text-align: left;padding: 8px;border: 1px solid #ddd;',

        tr: 'white-space: normal; max-width: 700px;padding: 8px;border: 1px solid #ddd;',
        td: 'white-space: normal; max-width: 700px;padding: 8px;border: 1px solid #ddd;',

        // 链接
        a: 'color: #007aff;text-decoration: underline;',

        // 引用 & 分隔
        blockquote: 'margin: 16px 0;padding-left: 1em;border-left: 4px solid #ccc;color: #666;',
        hr: 'border: none;border-top: 1px solid #ccc;margin: 16px 0;',

        // 代码
        pre: 'background-color: #f5f5f5;padding: 1em;overflow: auto;',
        code: 'font-family: monospace;background-color: #f5f5f5;padding: 0.2em 0.4em;border-radius: 4px;',

        // 表单基础（非核心）
        input: 'font: inherit;',
        textarea: 'font: inherit;',
        button: 'font: inherit;cursor: pointer;'
      },
      chartData: {
        categories: [],
        series: [
          {
            name: '综合评估',
            color: '#106cff',
            data: []
          }
        ]
      },
      chartData2: {
        categories: [],
        series: [
          {
            name: '最近10次通话水平评估',
            lineType: 'solid',
            color: '#106cff',
            data: []
          }
        ]
      },
      minScore: 0,
      maxScore: 0,
      improvementRate: 0
    };
  },
  onLoad({}) {
    common.osg.init(this, {}, app);
    this.userId = wx.getStorageSync('user')._id;
    this.getAiSpeechRecentEval();
    this.getAiSpeechEval();
  },
  methods: {
    getAiSpeechRecentEval(callback) {
      common.osg.ajax(
        'biz/extForm/queryByColName/AiSpeechRecentEval',
        {
          'is:userId|string#and': this.userId,
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          page: 1,
          rows: 1
        },
        res => {
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

          const answer = this.data.answer;
          if (answer && answer.trim()) {
            let md = new MarkdownIt({
              html: false, // 禁用 HTML 标签，避免 XSS
              linkify: true, // 自动将链接文本转为 <a>
              typographer: true, // 更好的排版，比如自动替换引号等
              breaks: true
            });
            this.data.answer = md.render(answer);
          }
          this.$forceUpdate();
          if (callback) callback();
        }
      );
    },
    getAiSpeechEval() {
      common.osg.ajax(
        'biz/extForm/queryByColName/AiSpeechEval',
        {
          'is:userId|string#and': this.userId,
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          page: 1,
          rows: 10
        },
        res => {
          let minScore = 0;
          let maxScore = 0;
          let scoreData = res.data
            .map((item, i) => {
              if (i == 0) {
                minScore = item.score;
                maxScore = item.score;
              } else {
                if (item.score < minScore) {
                  minScore = item.score;
                } else if (item.score > maxScore) {
                  maxScore = item.score;
                }
              }
              this.chartData2.categories.push(i + 1);
              return item.score;
            })
            .reverse();
          this.minScore = minScore;
          this.maxScore = maxScore;
          let firstScore = scoreData[0];
          let lastScore = scoreData[scoreData.length - 1];
          this.improvementRate = Number((((lastScore - firstScore) / firstScore) * 100).toFixed(1));
          this.chartData2.series[0].data = scoreData;
          this.$forceUpdate();
        }
      );
    }
  }
};
</script>
<style lang="scss">
.call-record-eval {
  height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
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
    .card-item {
      padding: 12px;
      background-color: rgb(249, 250, 251);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      min-width: 50px;
      .type {
        font-size: 14px;
        line-height: 20px;
        color: rgb(134, 144, 156);
      }
      .score {
        font-size: 20px;
        line-height: 28px;
        font-weight: 600;
        margin-top: 4px;
      }
    }
  }
}
</style>
