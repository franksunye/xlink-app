<template>
  <scroll-view
    class="call-record"
    scroll-y
    :scroll-top="scrollTop"
    :scroll-with-animation="true"
    @click.capture="track"
  >
    <view
      v-if="data.saData.orderNum"
      class="card"
      @click="open('/subpackages/callRecords/callRecord', { id: data._id })"
    >
      <view class="c-flex c-flex-between c-item-center c-flex-wrap" style="gap: 8px">
        <view>
          <text class="c-bold c-size-18 c-m-r-20">{{ data.saData.name }}</text>
          <text>#{{ data.saData.orderNum && data.saData.orderNum.slice(5) }}</text>
        </view>
        <view class="c-flex c-item-center">
          <view
            class="c-m-r-20"
            v-if="data.saData.exts.leakagesite_copy && data.saData.exts.leakagesite_copy[0]"
          >
            <van-icon name="list-switching" class="c-m-r-10 c-gray-6" />
            <text>{{ formatLeakagesite([data.saData.exts.leakagesite_copy[0]]) }}</text>
          </view>
          <view>
            <van-icon name="flag-o" class="c-m-r-10 c-gray-6" />
            <text>
              {{ codelabel('select', 'status', data.saData.status) || '' }}
            </text>
          </view>
        </view>
      </view>
      <view
        style="margin-top: 8px"
        v-if="data.saData.district || data.saData.address"
        class="c-nowrap"
      >
        <van-icon name="location-o" class="c-m-r-10 c-gray-6" />
        <text>
          {{
            (data.saData.district ? formatDistrict(Number(data.saData.district)) : '') +
            (data.saData.address || '')
          }}
        </text>
      </view>
      <view
        style="margin-top: 10px; padding-top: 7px; border-top: 1px dashed #e5e6eb"
        class="c-flex c-flex-between c-item-center"
      >
        <view>
          <van-icon name="phone-o" class="c-m-r-10 c-gray-6" />
          <text>{{ formatCallStartTime(data.callCreateTime) }}</text>
        </view>
        <view>
          <van-icon name="clock-o" class="c-m-r-10 c-gray-6" />
          <text>{{ formatCallDuration(data.bizDuration) }}</text>
        </view>
      </view>
      <view style="margin-top: 8px" class="c-flex c-flex-between c-item-center">
        <view class="c-flex c-item-center">
          <uni-rate
            :size="18"
            :value="((data.evalData.score / 100) * 5).toFixed(1)"
            class="c-m-r-10"
          />
          <text>{{ ((data.evalData.score / 100) * 5).toFixed(1) }}</text>
        </view>
      </view>
    </view>
    <view
      v-if="aiLeadEval.answer"
      class="aiLeadEval card"
      :class="aiLeadEvalExpanded ? 'expanded' : ''"
      style="padding: 0 16px"
    >
      <view class="feedback">
        <view
          class="c-flex c-item-center"
          @click="feedbackClick('AiLeadEval', aiLeadEval._id)"
          :data-event="{ id: '_frf1359dN' }"
        >
          <van-icon name="comment-o" color="#ff6900" :data-event="{ id: '_frf1359dN' }" />
          <text
            class="c-blue c-m-l-10 c-size-14"
            style="margin-right: 25px"
            :data-event="{ id: '_frf1359dN' }"
          >
            {{ feedback.AiLeadEval._id ? '已反馈' : '反馈' }}
          </text>
        </view>
        <van-icon
          name="arrow-down"
          style="transition: transform 0.3s ease"
          :class="aiLeadEvalExpanded ? 'rotate-180' : ''"
          size="20px"
          color="#646566"
          @click="aiLeadEvalExpanded = !aiLeadEvalExpanded"
          :data-event="{ id: aiLeadEvalExpanded ? '_frfcollapse' : '_frf1expand' }"
        />
      </view>
      <mp-html :tag-style="tagStyle" scroll-table :content="aiLeadEval.answer" />
      <view
        v-if="aiLeadEvalExpanded"
        @click="aiLeadEvalExpanded = false"
        class="c-flex c-flex-center c-p-b-20 c-gray-6"
      >
        <van-icon name="arrow-up" class="c-m-r-20" size="20px" />
        <text>收起</text>
      </view>
    </view>
    <view
      v-if="aiSpeechEval.answer"
      class="aiLeadEval card"
      :class="aiSpeechEvalExpanded ? 'expanded' : ''"
      style="padding: 0 16px"
    >
      <view class="c-flex c-flex-between">
        <view
          style="
            margin: 16px 0;
            height: 24px;
            line-height: 24px;
            font-size: 20px;
            font-weight: bold;
          "
        >
          <text>通话分析</text>
          <text class="c-m-l-20 c-weight-normal">{{ aiSpeechEval.score }}</text>
          <text class="c-size-18 c-weight-normal">分</text>
        </view>
        <view class="feedback">
          <view
            class="c-flex c-item-center"
            @click="feedbackClick('AiSpeechEval', aiSpeechEval._id)"
            :data-event="{ id: '_f12f_O9dN' }"
          >
            <van-icon name="comment-o" color="#ff6900" :data-event="{ id: '_f12f_O9dN' }" />
            <text
              class="c-blue c-m-l-10 c-size-14"
              style="margin-right: 25px"
              :data-event="{ id: '_f12f_O9dN' }"
            >
              {{ feedback.AiSpeechEval._id ? '已反馈' : '反馈' }}
            </text>
          </view>
          <van-icon
            name="arrow-down"
            style="transition: transform 0.3s ease"
            :class="aiSpeechEvalExpanded ? 'rotate-180' : ''"
            size="20px"
            color="#646566"
            @click="aiSpeechEvalExpanded = !aiSpeechEvalExpanded"
            :data-event="{ id: aiSpeechEvalExpanded ? '_11fcollapse' : '_11frf1expand' }"
          />
        </view>
      </view>
      <scroll-view scroll-x style="width: 100%">
        <mp-html :tag-style="tagStyle" scroll-table :content="aiSpeechEval.answer" />
      </scroll-view>
      <view
        v-if="aiSpeechEvalExpanded"
        @click="aiSpeechEvalExpanded = false"
        class="c-flex c-flex-center c-p-b-20 c-gray-6"
      >
        <van-icon name="arrow-up" class="c-m-r-20" size="20px" />
        <text>收起</text>
      </view>
    </view>

    <view
      v-if="aiSpeechDiffEval._id"
      class="diffEval card"
      :class="diffEvalExpanded ? 'expanded' : ''"
    >
      <view class="c-flex c-flex-between c-item-center" style="margin-bottom: 16px">
        <view style="height: 24px; line-height: 24px; font-size: 20px; font-weight: bold">
          异议处理能力分析
        </view>
        <van-icon
          name="arrow-down"
          style="transition: transform 0.3s ease"
          :class="diffEvalExpanded ? 'rotate-180' : ''"
          size="20px"
          color="#646566"
          @click="diffEvalExpanded = !diffEvalExpanded"
          :data-event="{ id: diffEvalExpanded ? '_12fcollapse' : '_12frf1expand' }"
        />
      </view>
      <view class="metrics">
        <view class="metric c-flex c-flex-col c-flex-1 c-m-b-20">
          <view class="c-flex c-flex-between c-item-center c-m-b-10">
            <text class="c-size-16 c-bold">总体评分</text>
            <text class="c-size-16 c-bold">{{ aiSpeechDiffEval.score }}分</text>
          </view>
          <van-progress
            :percentage="aiSpeechDiffEval.score"
            :show-pivot="false"
            stroke-width="8"
            :color="aiSpeechDiffEval.score >= 85 ? '#07c160' : '#ff976a'"
          />
        </view>
        <view class="c-flex c-flex-between c-item-center c-m-b-20">
          <view class="metric c-flex-1">
            <view class="c-flex c-flex-between c-item-center c-m-b-6">
              <text class="c-size-14">异议识别速度</text>
              <text class="c-size-14">{{ aiSpeechDiffEval.evalSpeed }}分</text>
            </view>
            <van-progress
              :percentage="aiSpeechDiffEval.evalSpeed"
              :show-pivot="false"
              stroke-width="6"
              :color="aiSpeechDiffEval.evalSpeed >= 85 ? '#07c160' : '#ff976a'"
            />
          </view>
          <view class="metric c-flex-1 c-m-l-30">
            <view class="c-flex c-flex-between c-item-center c-m-b-6">
              <text class="c-size-14">解决方案相关性</text>
              <text class="c-size-14">{{ aiSpeechDiffEval.evalRelevant }}分</text>
            </view>
            <van-progress
              :percentage="aiSpeechDiffEval.evalRelevant"
              :show-pivot="false"
              stroke-width="6"
              :color="aiSpeechDiffEval.evalRelevant >= 85 ? '#07c160' : '#ff976a'"
            />
          </view>
        </view>
        <view class="c-flex c-flex-between c-item-center">
          <view class="metric c-flex-1">
            <view class="c-flex c-flex-between c-item-center c-m-b-6">
              <text class="c-size-14">客户情绪安抚</text>
              <text class="c-size-14">{{ aiSpeechDiffEval.evalEmotion }}分</text>
            </view>
            <van-progress
              :percentage="aiSpeechDiffEval.evalEmotion"
              :show-pivot="false"
              stroke-width="6"
              :color="aiSpeechDiffEval.evalEmotion >= 85 ? '#07c160' : '#ff976a'"
            />
          </view>
          <view class="metric c-flex-1 c-m-l-30">
            <view class="c-flex c-flex-between c-item-center c-m-b-6">
              <text class="c-size-14">异议转化成功率</text>
              <text class="c-size-14">{{ aiSpeechDiffEval.evalSuccess }}分</text>
            </view>
            <van-progress
              :percentage="aiSpeechDiffEval.evalSuccess"
              :show-pivot="false"
              stroke-width="6"
              :color="aiSpeechDiffEval.evalSuccess >= 80 ? '#07c160' : '#ff976a'"
            />
          </view>
        </view>
      </view>

      <view v-if="aiSpeechDiffEval.qa && aiSpeechDiffEval.qa.length > 0" class="case c-m-t-30">
        <view class="c-size-16 c-bold c-m-b-10">异议处理记录</view>
        <view style="background-color: #f9fafc; padding: 10px; border-radius: 12px">
          <view v-for="(item, i) in aiSpeechDiffEval.qa" :key="i">
            <view v-if="i != 0" style="border-top: 1px dashed #ccc; margin: 8px 0"></view>
            <view class="quote">
              <view>
                <text class="quote-title c-blue">客户异议：</text>
                <text class="quote-content">“{{ item['客户异议'] }}”</text>
              </view>
            </view>
            <view class="quote c-m-t-10">
              <view>
                <text class="quote-title c-red">您的回应：</text>
                <text class="quote-content">“{{ item['您的回应'] }}”</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="suggestions c-m-t-30">
        <view class="c-size-16 c-bold c-m-b-10">改进建议</view>
        <view style="background-color: #f9fafc; padding: 10px; border-radius: 12px">
          <view v-for="(item, i) in aiSpeechDiffEval.suggest" :key="i" class="suggestion">
            <view v-if="i != 0" style="border-top: 1px dashed #ccc; margin: 8px 0"></view>
            <view class="c-orange">{{ item['改进领域'] }}</view>
            <view>
              <!-- <text>{{ i + 1 }}、</text> -->
              {{ item['具体建议'] }}
            </view>
          </view>
        </view>
        <!-- <view class="suggestion">
          <van-icon name="good-job" class="c-m-r-10" color="#ff976a" />
          <text>
            <text class="c-orange">优点：</text>
            在客户表达异议时，可以先使用更多共情语句，如”我非常理解您的感受"，增强客户信任感
          </text>
        </view>
        <view class="suggestion">
          <van-icon name="warning" class="c-m-r-10" color="#ff976a" />
          <text>
            <text class="c-orange">缺点：</text>
            可以准备2-3个不同价位的解决方案，给客户更多选择空间，提高异议处理成功率
          </text>
        </view>
        <view class="suggestion">
          <van-icon name="comment" class="c-m-r-10" color="#ff976a" />
          <text>
            <text class="c-orange">建议：</text>
            处理价格异议时，可以更详细地解释服务价值构成，帮助客户理解价格合理性
          </text>
        </view> -->
      </view>

      <view
        v-if="diffEvalExpanded"
        @click="diffEvalExpanded = false"
        class="c-flex c-flex-center c-p-t-20 c-gray-6"
      >
        <van-icon name="arrow-up" class="c-m-r-20" size="20px" />
        <text>收起</text>
      </view>
    </view>

    <view v-if="callRecord.recordUrl" class="card">
      <view
        style="
          margin-bottom: 16px;
          height: 24px;
          line-height: 24px;
          font-size: 20px;
          font-weight: bold;
        "
      >
        通话录音
      </view>
      <view class="c-flex">
        <van-icon
          v-if="callRecord.state != 'playing'"
          key="playing"
          name="play-circle"
          class="c-blue c-m-r-20"
          custom-style="font-size: 50px"
          @click="callPlay()"
          :data-event="{ id: '5diG7Kplay' }"
        />
        <van-icon
          v-else
          key="pause"
          name="pause-circle"
          class="c-blue c-m-r-20"
          custom-style="font-size: 50px"
          @click="callPause()"
          :data-event="{ id: 'sJwLgpause' }"
        />
        <view class="audio-wrapper">
          <view class="audio-slider">
            <slider
              :value="callRecord.value"
              :max="callRecord.max"
              @changing="callProgressDrag"
              @change="callSeek"
              step="1"
              block-size="20"
            />
            <view class="audio-time-container">
              <view class="audio-current-time">{{ callRecord.currentTime }}</view>
              <view class="audio-end-time">{{ callRecord.endTime }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="speechText.length > 0" class="card">
      <view
        style="
          margin-bottom: 16px;
          height: 24px;
          line-height: 24px;
          font-size: 20px;
          font-weight: bold;
        "
      >
        通话文本
      </view>
      <scroll-view scroll-y class="chats">
        <view
          v-for="(item, i) in speechText"
          :key="i"
          :class="item.SpeakerId == '1' ? 'chat-right' : 'chat-left'"
        >
          <view class="text">
            {{ formatCallRecordCurrentTime(item.BeginTime / 1000) }}
            {{
              item.SpeakerId == '1'
                ? '管家 - ' + data.saData.exts.supervisorName
                : '客户 - ' + data.saData.name
            }}
          </view>
          <view class="chat">{{ item.Text }}</view>
        </view>
      </scroll-view>
    </view>
    <view v-if="callRecord.recordUrl && speechText.length > 0" class="card card-last">
      <view class="c-flex c-item-center">
        <image
          style="width: 48px; height: 48px; border-radius: 50%; margin-right: 16px"
          src="https://pub.fsgo365.cn/xiaolianzhushou.jpeg"
        ></image>
        <view>
          <view class="c-white">小链助手</view>
          <view class="c-size-12" style="color: rgba(255, 255, 255, 0.8)">
            通过模拟对话快速提升销售技巧
          </view>
        </view>
      </view>
      <view class="button" @click="openMiniProgram" :data-event="{ id: 'openxlzs' }">打开</view>
    </view>
    <van-empty
      v-if="!data.saData.orderNum"
      description="没有数据"
      class="c-empty c-empty-center"
    ></van-empty>
    <view style="height: 1px"></view>
    <van-dialog
      use-slot
      :title="'反馈 - ' + (feedback.type == 'AiLeadEval' ? '客户画像分析' : '通话分析')"
      :show="feedback.show"
      :show-cancel-button="true"
      confirm-button-text="提交反馈"
      confirm-button-color="#ff6900"
      cancel-button-text="取消"
      @confirm="feedbackConfirm"
      @cancel="feedbackCancel"
      :before-close="feedbackBeforeClose"
      :data-event="{
        id: feedback.type == 'AiLeadEval' ? 'cWlxx2oprE' : '_1ZQXmHkV',
        capture: false
      }"
    >
      <view style="padding: 0 16px 16px">
        <view class="c-m-b-20">您认为AI给出的分析内容如何？</view>
        <view class="c-flex c-flex-between">
          <view
            class="feedback-button"
            :class="feedback.formData.rating == 3 ? 'feedback-button-active' : ''"
            @click="feedback.formData.rating = 3"
          >
            <van-icon name="cross" size="20px" color="#d6000f" />
            <text class="c-size-14">不准确</text>
          </view>
          <view
            class="feedback-button"
            :class="feedback.formData.rating == 2 ? 'feedback-button-active' : ''"
            @click="feedback.formData.rating = 2"
            style="margin: 0 16px"
          >
            <van-icon name="minus" size="20px" color="#ffd700" />
            <text class="c-size-14">部分准确</text>
          </view>
          <view
            class="feedback-button"
            :class="feedback.formData.rating == 1 ? 'feedback-button-active' : ''"
            @click="feedback.formData.rating = 1"
          >
            <van-icon name="success" size="20px" color="#07c160" />
            <text class="c-size-14">准确</text>
          </view>
        </view>
        <view style="margin: 20px 0 10px">请补充说明（可选）</view>
        <uni-easyinput
          type="textarea"
          autoHeight
          v-model="feedback.formData.content"
          placeholder="请输入您的反馈意见..."
        ></uni-easyinput>
      </view>
    </van-dialog>
  </scroll-view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
import UniRate from '../uni_modules/uni-rate/components/uni-rate/uni-rate.vue';
import MarkdownIt from 'markdown-it';
import mpHtml from '../uni_modules/mp-html/components/mp-html/mp-html.vue';
export default {
  components: {
    'mp-html': mpHtml,
    'uni-rate': UniRate
  },
  data() {
    return {
      id: '',
      type: '',
      scrollTop: 0,
      options: {
        codecfg_repairParts: {
          codeId: 'allPartsOne'
        },
        codecfg_status: {
          codeId: 'STATUS'
        }
      },
      areaList: Object.assign({}, areajs.default),
      data: { evalData: {}, saData: { exts: {} } },
      aiLeadEval: {},
      aiLeadEvalExpanded: false,

      aiSpeechEval: {},
      aiSpeechEvalExpanded: false,
      feedback: {
        show: false,
        type: '',
        formData: {},
        AiLeadEval: {
          rating: 0,
          content: '',
          state: 1
        },
        AiSpeechEval: {
          rating: 0,
          content: '',
          state: 1
        }
      },
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
      diffEvalExpanded: false,
      aiSpeechDiffEval: {},
      callRecord: {
        recordUrl: '', // 当前通话录音地址
        audio: null, // 背景音频实例
        currentTime: '00:00', // 当前播放时间 格式00:00
        endTime: '00:00', // 结束时间 格式00:00
        duration: 0, //  总时间 单位秒
        // progress: 0, // 滑块当前进度
        max: 100, //最大值
        state: 'paused', // 当前播放状态
        seek: false // 是否正在拖拽滑块
      },
      speechText: []
    };
  },
  onLoad(params) {
    common.osg.init(this, {}, app);
    this.id = params.id;
    this.type = params.type;
    this.user = wx.getStorageSync('user');
  },
  onShow() {
    common.osg.codeoption(() => {
      this.getData(() => {
        this.getAiLeadEval();
        this.getAiSpeechEval();
        this.getAiSpeechDiffEval();
        this.getSpeechText();
        this.getSobotById(() => {
          this.initAudio();
        });
      });
    });
  },
  onUnload() {
    if (this.callRecord.audio) {
      // 停止音频播放
      this.callRecord.audio.stop();
      // 清理音频实例
      this.callRecord.audio.destroy();
    }
  },
  methods: {
    getData(callback) {
      common.osg.ajax(
        'stat/aggr/speechText',
        {
          aggr: JSON.stringify([
            {
              $match: {
                userId: this.user._id,
                serviceAppointmentCallCount: 1,
                _id: this.id
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
              $skip: 0
            },
            {
              $limit: 20
            }
          ])
        },
        res => {
          this.data = res[0];
          if (this.data) {
            if (callback) callback();
          } else {
            this.data = { evalData: {}, saData: { exts: {} } };
            common.osg.alert('没有查询到数据');
          }
        }
      );
    },
    getAiLeadEval() {
      common.osg.ajax(
        'biz/extForm/queryByColName/AiLeadEval',
        {
          _all: 1,
          notFilterBelongTo: 1,
          notFilterOrgId: 1,
          'in:serviceAppointIds|array#and': this.data.serviceAppointmentId
        },
        res => {
          this.aiLeadEval = res.data[0] || {};
          if (res.data[0]) {
            this.getFeedback('AiLeadEval', res.data[0]._id);
          }
          const answer = this.aiLeadEval.answer;
          if (answer && answer.trim()) {
            let md = new MarkdownIt({
              html: false, // 禁用 HTML 标签，避免 XSS
              linkify: true, // 自动将链接文本转为 <a>
              typographer: true, // 更好的排版，比如自动替换引号等
              breaks: true
            });
            this.aiLeadEval.answer = md.render(answer);
          }
        },
        {
          noload: true
        }
      );
    },
    getAiSpeechEval() {
      common.osg.ajax(
        'biz/extForm/queryByColName/AiSpeechEval',
        {
          _all: 1,
          notFilterBelongTo: 1,
          notFilterOrgId: 1,
          'is:serviceAppointmentId|string#and': this.data.serviceAppointmentId
        },
        res => {
          this.aiSpeechEval = res.data[0] || {};
          if (res.data[0]) {
            this.getFeedback('AiSpeechEval', res.data[0]._id);
          }
          const answer = this.aiSpeechEval.answer;
          if (answer && answer.trim()) {
            let md = new MarkdownIt({
              html: false, // 禁用 HTML 标签，避免 XSS
              linkify: true, // 自动将链接文本转为 <a>
              typographer: true, // 更好的排版，比如自动替换引号等
              breaks: true
            });
            this.aiSpeechEval.answer = md.render(answer);
          }
        },
        {
          noload: true
        }
      );
    },
    getAiSpeechDiffEval() {
      common.osg.ajax(
        'biz/extForm/queryByColName/AiSpeechDiffEval',
        {
          _all: 1,
          notFilterBelongTo: 1,
          notFilterOrgId: 1,
          // TODO
          'is:serviceAppointmentId|string#and': '3432630374541053406' // this.data.serviceAppointmentId
        },
        res => {
          this.aiSpeechDiffEval = res.data[0] || {};
        },
        {
          noload: true
        }
      );
    },
    getSpeechText() {
      common.osg.ajax(
        'basic/speechText/subtitle',
        { colId: this.data.colId },
        res => {
          this.speechText = res.data;
          if (this.type === 'speechText') {
            setTimeout(() => {
              this.scrollTop = 99999;
            }, 500);
          }
        },
        {
          noload: true
        }
      );
    },
    getSobotById(callback) {
      common.osg.ajax('basic/sobot/findById', { id: this.data.colId }, res => {
        this.callRecord.recordUrl = res.data.recordUrl;
        if (callback) callback();
      });
    },
    getFeedback(type, typeId) {
      common.osg.ajax(
        'biz/extForm/queryByColName/feedback',
        { type, typeId },
        res => {
          if (res.data.length > 0) {
            this.feedback[type] = res.data[0];
            console.log(type, this.feedback[type]);
          }
        },
        {
          noload: true
        }
      );
    },
    feedbackClick(type, typeId) {
      this.feedback.show = true;
      this.feedback.type = type;
      // this.$set(this.feedback, 'formData', common.osg.deepCopy(this.feedback[type]));
      this.feedback.formData = common.osg.deepCopy(this.feedback[type]);
      this.feedback.formData.type = type;
      this.feedback.formData.typeId = typeId;
    },
    feedbackBeforeClose(action) {
      return new Promise(resolve => {
        setTimeout(() => {
          if (action === 'confirm') {
            // 拦截确认操作
            resolve(false);
          } else {
            resolve(true);
          }
        }, 0);
      });
    },
    feedbackConfirm() {
      if (!this.feedback.formData.rating) {
        common.osg.toast('请选择评级', 'none');
        return;
      }
      common.osg.ajax(
        'biz/extForm/upsert/1340105575545024711',
        {
          dataStr: JSON.stringify(this.feedback.formData)
        },
        res => {
          this.feedback.show = false;
          this.feedback[this.feedback.type] = res.data;
          common.osg.toast('提交成功', 'none');
        },
        { noload: true }
      );
    },
    feedbackCancel() {
      this.feedback.show = false;
    },
    /**
     * 通话录音
     */
    initAudio() {
      const audio = uni.createInnerAudioContext(); // wx.createInnerAudioContext
      audio.title = this.data.saData.name + '的通话录音';
      audio.src = this.callRecord.recordUrl; // 设置了 src 之后会自动播放
      this.callRecord.audio = audio;
      // 监听背景音频播放事件
      audio.onPlay(() => {
        this.callRecord.state = 'playing';
        this.$forceUpdate();
      });
      // 监听背景音频暂停事件
      audio.onPause(() => {
        this.callRecord.state = 'paused';
        console.log('onPause');
      });

      // 监听背景音频完成跳转操作事件
      // #ifdef MP-WEIXIN
      audio.onSeeked(() => {
        this.callRecord.seek = false;
        console.log('onSeeked');
      });
      // #endif
      // 监听背景音频自然播放结束事件
      audio.onEnded(() => {
        this.callRecord.state = 'end';
        console.log('onEnded');
      });
      // 监听背景音频停止事件
      audio.onStop(() => {
        this.callRecord.state = 'stop';
        console.log('onStop');
      });
      // 监听背景音频播放进度更新事件，只有小程序在前台时会回调。
      audio.onTimeUpdate(() => {
        // 拖拽时不更新播放进度
        if (!this.callRecord.seek) {
          // 当前进度(s)
          this.callRecord.value = Math.floor(this.callRecord.audio.currentTime);
          // 当前时间
          this.callRecord.currentTime = this.formatCallRecordCurrentTime(
            this.callRecord.audio.currentTime
          );
        }
      });
      //监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
      audio.onCanplay(() => {
        if (audio.duration > 0) {
          this.callRecord.max = Math.floor(audio.duration);
          this.callRecord.endTime = this.formatCallRecordCurrentTime(audio.duration);
          console.log(this.callRecord.endTime);
        } else {
          // 如果 duration 无效，则再次检查或延时操作
          let checkDuration = setInterval(() => {
            if (audio.duration > 0) {
              clearInterval(checkDuration); // 确保只执行一次
              this.callRecord.max = Math.floor(audio.duration);
              this.callRecord.endTime = this.formatCallRecordCurrentTime(audio.duration);
              console.log(this.callRecord.endTime);
            }
          }, 100); // 每100ms检查一次
        }
      });
      // 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
      // audio.onWaiting(res => {
      //   console.log('onWaiting');
      // });
      // 监听背景音频播放错误事件
      audio.onError(res => {
        common.osg.alert('通话录音播放权限已超时，已为您自动最新，请点击播放按钮重试。');
        console.log('onError', res);
      });

      if (this.type === 'play') {
        setTimeout(() => {
          this.scrollTop = 99999;
        }, 500);
        this.callPlay();
      }
    },
    // 播放
    callPlay() {
      if (
        this.callRecord.audio &&
        (this.callRecord.state == 'paused' || this.callRecord.state == 'end')
      ) {
        this.callRecord.audio.play();
      }
    },
    // 暂停
    callPause() {
      this.callRecord.audio.pause();
    },
    // 拖拽当前时间进度条
    callProgressDrag(e) {
      this.callRecord.seek = true;
      this.callRecord.currentTime = this.formatCallRecordCurrentTime(e.detail.value);
    },
    // 跳转到指定位置 单位s，精确到小数点后3位，即支持ms级别精确度。
    callSeek(e) {
      if (this.callRecord.state == 'paused' && e.callPlay) {
        this.callPlay();
      }
      this.callRecord.seek = false;
      this.callRecord.audio.seek(e.detail.value);
    },
    // 将秒转换为“天时:分:秒”
    formatCallRecordCurrentTime(s) {
      s = Math.floor(s);
      let str = '';
      let day = Math.floor(s / (60 * 60 * 24));
      if (day > 0) {
        str = day + '天';
        s = s % (60 * 60 * 24);
      }
      let hour = Math.floor(s / (60 * 60));
      if (hour > 0) {
        str += (hour < 10 ? '0' + hour : hour) + ':';
        s = s % (60 * 60);
      } else if (day > 0) {
        str += '00:';
      }
      let minute = Math.floor(s / 60);
      if (minute > 0) {
        str += (minute < 10 ? '0' + minute : minute) + ':';
        s = s % 60;
      } else {
        str += '00:';
      }
      str += s < 10 ? '0' + s : s;
      return str;
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
      if (value && value.length > 0) {
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
    },
    openMiniProgram() {
      let user = wx.getStorageSync('user');
      // #ifdef APP-PLUS
      var weixinShare = null;
      plus.share.getServices(function (services) {
        for (var i in services) {
          var service = services[i];
          // 获取微信分享对象
          if (service.id == 'weixin') {
            weixinShare = service;
            break;
          }
        }
        //唤醒微信小程序
        if (weixinShare) {
          weixinShare.launchMiniProgram({
            id: 'gh_67d99ae2b380', // 在微信开放平台绑定的微信小程序的原始id非appid
            type: 0, //小程序版本  0：正式版； 1：测试版； 2：体验版。
            path: `pages/index/index?userId=${user._id}&name=${user.name}&orgName=${user.orgName}` //小程序的页面,用传的参数在小程序接值判断跳转指定页面,可以携带参数
          });
        } else {
          common.osg.toast('请安装微信', 'none');
        }
      });
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateToMiniProgram({
        appId: 'wx424b0548cd7c7401',
        path: `pages/index/index?userId=${user._id}&name=${user.name}&orgName=${user.orgName}`,
        envVersion: 'release' // develop（开发版），trial（体验版），release（正式版）。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
      });
      // #endif
    }
  }
};
</script>
<style lang="scss">
.call-record {
  height: 100vh;
  overflow-y: auto;
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
  .aiLeadEval {
    position: relative;
    max-height: 220px;
    overflow: hidden;
    &.expanded {
      max-height: none;
      &::after {
        display: none;
      }
    }
    .arrow {
      position: absolute;
      top: 20px;
      right: 16px;
      transition: transform 0.3s ease;
    }
    .rotate-180 {
      transform: rotate(180deg);
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    }
  }
  .feedback {
    position: absolute;
    z-index: 1;
    top: 16px;
    right: 16px;
    display: flex;
  }
  .feedback-button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #e5e6eb;
    border-radius: 8px;
    padding: 12px 0;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    .van-icon {
      line-height: 28px;
      margin-bottom: 4px;
    }
  }
  .feedback-button-active {
    border-color: #165dff;
    background-color: rgb(22 93 255 / 0.05);
  }
  .chats {
    max-height: 300px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    .chat-left {
      margin-bottom: 20px;
      width: 80%;
      align-self: flex-start;
      .text {
        margin-bottom: 4px;
        color: rgb(134, 144, 156);
        font-size: 14px;
        text-align: left;
      }
      .chat {
        border-radius: 0 8px 8px 8px;
        color: rgb(22, 93, 255);
        background: rgba(22, 93, 255, 0.1);
        padding: 8px 12px;
      }
    }
    .chat-right {
      margin-bottom: 20px;
      width: 80%;
      align-self: flex-end;
      margin-left: auto;
      .text {
        margin-bottom: 4px;
        color: rgb(134, 144, 156);
        font-size: 14px;
        text-align: right;
      }
      .chat {
        border-radius: 8px 0 8px 8px;
        background: rgb(242, 243, 245);
        padding: 8px 12px;
      }
    }
  }
  .audio-wrapper {
    display: flex;
    align-items: center;
    flex: 1;
    .audio-slider {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end; /* 将内容对齐到底部 */
      .audio-time-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        position: absolute;
        bottom: -12px;
        padding: 0px 18px;
        box-sizing: border-box;
      }

      .audio-current-time,
      .audio-end-time {
        font-size: 14px;
      }
    }
  }
  .card-last {
    background-image: linear-gradient(to right, #165dff, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .button {
      padding: 8px 16px;
      color: #ff6900;
      background-color: #fff;
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      border-radius: 20px;
    }
  }
  .diffEval {
    position: relative;
    max-height: 220px;
    overflow: hidden;
    &.expanded {
      max-height: none;
      &::after {
        display: none;
      }
    }
    .arrow {
      position: absolute;
      top: 20px;
      right: 16px;
      transition: transform 0.3s ease;
    }
    .rotate-180 {
      transform: rotate(180deg);
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    }
  }
}
</style>
