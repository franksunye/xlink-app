<template>
  <view class="conversation">
    <view class="top">
      <uni-collapse>
        <uni-collapse-item
          titleBorder="none"
          :border="false"
          style="padding-bottom: 10px; background-color: #f5f5f5; border-bottom: 1px solid #e0e0e0"
        >
          <template v-slot:title>
            <view class="c-flex c-item-center">
              <i class="iconfont icon-changjing" style="font-size: 20px; margin-right: 8px"></i>
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
          style="padding-top: 10px; background-color: #f5f5f5"
        >
          <template v-slot:title>
            <view class="c-flex c-item-center">
              <i class="iconfont icon-kehuhuaxiang" style="font-size: 18px; margin-right: 8px"></i>
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
    <scroll-view
      class="scroll-view"
      scroll-y
      :scroll-into-view="viewIndex"
      scroll-with-animation
      enable-back-to-top
      enable-passive
      :enhance="true"
      :fast-deceleration="true"
      :scroll-anchoring="true"
      :paging-enabled="true"
      :enable-flex="true"
    >
      <view v-for="(item, i) in session.messages" :key="i" :id="'message_' + i" class="scroll-item">
        <view :class="'message-role-' + item.role" class="message">
          <!-- 消息内容 -->
          <text v-if="item.content" user-select>
            {{ item.content }}
            <!-- 消息回答中 结尾动画 -->
            <!-- <text
              v-if="
                conversation.lastEvent == 'conversation.message.delta' &&
                i == session.messages.length - 1
              "
              class="answer-dot"
            ></text> -->
          </text>
          <!-- 消息回答前 开头动画 -->
          <view v-else-if="i == session.messages.length - 1" class="animation-loading">
            <view class="loading-bars">
              <text></text>
              <text></text>
              <text></text>
              <text></text>
              <text></text>
            </view>
          </view>

          <!-- 底部功能按钮区显示条件：1.有消息内容。2.是Agent回答的消息。3.包含跳转关键词。 4.如果是最后一条，需要已回答完成才显示。  -->
          <!-- <view
            v-if="
              item.content &&
              item.role == 'assistant' &&
              (item.content.indexOf('工单') != -1 ||
                (i == session.messages.length - 1 &&
                  (conversation.lastEvent == '' || conversation.lastEvent == 'done')))
            "
            class="message-buttons"
          >
            <view
              v-if="i == session.messages.length - 1"
              class="message-button message-icon"
              @click="copy(item.content)"
            >
              <image
                src="https://pub.fsgo365.cn/icon_copy.png"
                mode="widthFix"
                style="width: 24px; height: 24px"
              ></image>
            </view>
          </view> -->
        </view>
      </view>
    </scroll-view>
    <!-- 录音过程中 麦克风效果 -->
    <view class="MicrophoneEffect" v-if="RecordingStatus">
      <view class="record-btn"></view>
      <view class="border-wrapper">
        <view class="record-wrapper first"></view>
        <view class="record-wrapper second"></view>
        <view class="record-wrapper third"></view>
      </view>
    </view>
    <!-- <view class="visualize_wrap">
      <view
        style="
          display: flex;
          position: absolute;
          top: 50%;
          width: 100vw;
          height: 100px;
          align-items: center;
        "
      >
        <view
          id="audio_canvas"
          v-for="(item, index) in dataArray"
          :key="index"
          :style="{
            margin: '0px 4px',
            width: '7px',
            height: item + 'px',
            minHeight: '10px',
            backgroundColor: 'red'
          }"
        ></view>
      </view>
    </view> -->
    <view class="bottom">
      <view class="tools">
        <view v-if="session.status == 'in_progress'" class="tool" @click="trainingEnd">
          <i class="iconfont icon-jieshuduihua" style="font-size: 18px; margin-right: 8px"></i>
          <text>结束对练</text>
        </view>
        <view
          v-if="
            session.status == 'completed' &&
            (evaluation.total_score || evaluation.total_score === 0)
          "
          class="tool"
          @click="doOpen('/subpackages/evaluation/evaluation', { sessionId: sessionId })"
        >
          <i class="iconfont icon-star-o" style="font-size: 18px; margin-right: 8px"></i>
          <text>{{ evaluation.total_score }}分 评估结果</text>
        </view>
      </view>
      <!-- 录音过程中 麦克风效果 -->
      <view
        class="input"
        :class="
          conversation.lastEvent &&
          conversation.lastEvent != 'done' &&
          conversation.lastEvent != 'error'
            ? 'c-no-pointer'
            : ''
        "
      >
        <uni-easyinput
          v-if="conversation.inputType == 'keyboard'"
          type="textarea"
          :inputBorder="false"
          autoHeight
          :trim="true"
          v-model="conversation.inputValue"
          placeholder="发消息..."
          class="keyboard-field"
          input-class="keyboardInput"
          :styles="{
            minHeight: '22px !important'
          }"
          :placeholderStyle="{
            fontSize: '18px !important'
          }"
        ></uni-easyinput>
        <view
          v-else
          @touchstart="onSrStart"
          @touchmove.stop.prevent="touchmove"
          @touchend="onSrStop"
          :class="['voiceInput', { IsMoveToCancel: SendCancellation }]"
        >
          按住说话
        </view>
        <view v-if="RecordingStatus" :class="['cancel', { IsMoveToCancel: SendCancellation }]">
          {{ SendCancellation ? '取消发送' : '松手发送 上移取消' }}
        </view>
        <view class="icons">
          <image
            v-if="conversation.inputValue"
            src="https://pub.fsgo365.cn/icon_send.png"
            mode="widthFix"
            style="width: 30px; height: 30px"
            @click="sendMessage"
          ></image>
          <block v-else>
            <image
              v-if="conversation.inputType == 'voice'"
              src="https://pub.fsgo365.cn/icon_keyboard.png"
              mode="widthFix"
              style="width: 30px; height: 30px"
              @click="conversation.inputType = 'keyboard'"
            ></image>
            <image
              v-else
              src="https://pub.fsgo365.cn/icon_voice.png"
              mode="widthFix"
              style="width: 30px; height: 30px"
              @click="conversation.inputType = 'voice'"
            ></image>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');

const env = typeof process !== 'undefined' && process.env ? process.env : {};
const AKID = env.VUE_APP_ALIBABA_CLOUD_ACCESS_KEY_ID || '';
const AKKEY = env.VUE_APP_ALIBABA_CLOUD_ACCESS_KEY_SECRET || '';
const APPKEY = env.VUE_APP_ALIBABA_CLOUD_APP_KEY || '';
const getToken = require('../../resources/utils/token.js').getToken;
const sleep = require('../../resources/utils/util.js').sleep;
const uploadToSaver = require('../../resources/utils/util.js').uploadToSaver;
const SpeechTranscription = require('../../resources/utils/st.js');
//到此结束

export default {
  data() {
    return {
      dataArray: [],
      sessionId: '',
      session: {
        profile: {
          property_info: {}
        },
        scenario: {}
      },
      conversation: {
        inputType: 'voice', // voice:语音输入 keyboard:键盘输入
        inputValue: '', // 输入的文本
        lastEvent: '' // 最新接收消息块的事件
      },
      evaluation: {},
      viewIndex: '', // 滚动到底部元素的id，不能以数字开头
      stStart: false,
      stResult: '',
      RecordingStatus: false, //当前是否处在录音状态
      token: null,
      startY: 0, //开始触摸的时候拿到的 Y轴坐标的  endY 结合用于得到滑动距离
      distance: 0, //滑动方向 距离  //大于50 则取消发送
      SendCancellation: false //是否滑动到了取消发送
    };
  },
  onLoad: async function (options) {
    common.osg.init(this, options, app);
    if (options.sessionId) this.sessionId = options.sessionId;
    // 获取录音权限
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        this.onSave();
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  onShow() {
    this.getSession();
  },
  methods: {
    // 查询当前会话的消息列表
    getSession() {
      common.osg.ajax(
        '/training/session/' + this.sessionId,
        {},
        res => {
          uni.setNavigationBarTitle({
            title: res.session.profile.name
          });
          this.session = res.session;
          this.evaluation = res.evaluation || {};
          this.scrollToBottom();
        },
        {
          noload: true,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    // 发起消息
    sendMessage() {
      let that = this;
      const requstTask = wx.request({
        url: `${common.osg.host}training/chat?session_id=${this.sessionId}&message=${this.conversation.inputValue}`,
        enableChunked: true,
        header: {
          'Content-Type': 'text/event-stream; charset=utf-8'
        },
        method: 'get',
        success(res) {
          console.log('对话完成', res);
        },
        fail(res) {
          console.log('对话失败', res);
        }
      });

      // 将用户发送的消息插入会话中
      this.session.messages.push({
        role: 'user',
        content: this.conversation.inputValue
      });

      // 插入回答的空消息到会话中
      let currentMessage = {
        role: 'assistant',
        content: ''
      };
      this.session.messages.push(currentMessage);
      this.scrollToBottom();

      // 监听每当接收到新的回答消息时触发
      requstTask.onChunkReceived(res => {
        this.conversation.inputValue = '';
        // 将消息ArrayBuffer转为字符串，并解决中文乱码问题。
        let str = new TextDecoder('utf-8').decode(res.data);
        // 每次接收到的消息可能有1段或多段文本，将文本处理为数组。
        let messageList = this.parseStreamedString(str);
        this.scrollToBottom();
        for (let i = 0; i < messageList.length; i++) {
          let msg = messageList[i];
          currentMessage.content += msg.content;
        }
      });
    },
    // 响应消息字符串转json
    parseStreamedString(input) {
      const result = [];
      const regex = /data:\s*({[^}]+})/g;
      let match;
      while ((match = regex.exec(input)) !== null) {
        result.push(JSON.parse(match[1]));
      }
      return result;
    },
    // 默认滚动到页面底部，传参滚动到指定位置
    scrollToBottom(viewIndex) {
      this.viewIndex = ''; // 解决插入空回答时已赋值，回答完成后值未更新，无法触发滚动。
      this.$nextTick(() => {
        this.viewIndex = 'message_' + (viewIndex || this.session.messages.length - 1);
      });
    },
    copy(data, msg) {
      console.log('copy', data, msg);
      common.osg.setClipboardData(data, msg);
    },
    //授权用户开启录音权限 创建长链接 监听器
    onSave: async function () {
      wx.getRecorderManager().onFrameRecorded(res => {
        if (res.isLastFrame) {
          console.log('record done');
        }
        if (this.st && this.stStart) {
          console.log('send ' + res.frameBuffer.byteLength);
          this.st.sendAudio(res.frameBuffer);
        }
      });
      wx.getRecorderManager().onStart(() => {
        console.log('start recording...');
      });
      wx.getRecorderManager().onStop(res => {
        console.log('stop recording...');
        if (res.tempFilePath) {
          wx.removeSavedFile({
            filePath: res.tempFilePath
          });
        }
      });
      wx.getRecorderManager().onError(res => {
        console.log('recording failed:' + JSON.stringify(res));
      });

      try {
        this.token = await getToken(AKID, AKKEY);
      } catch (e) {
        console.log('token出错了', JSON.stringify(e));
        return;
      }
      let st = new SpeechTranscription({
        url: 'wss://nls-gateway-cn-shanghai.aliyuncs.com/ws/v1',
        appkey: APPKEY,
        token: this.token
      });
      //实时语音识别开始
      st.on('started', msg => {
        console.log('实时语音识别 开始');
        this.RecordingStatus = true;
        //开启轻微震动 提示录音开始
        wx.vibrateShort();
      });

      st.on('changed', msg => {
        console.log('实时语音识别 更新', JSON.parse(msg).payload.result);
        // if (JSON.parse(msg).payload.result) {
        // this.stResult += JSON.parse(msg).payload.result;
        // }
      });

      st.on('completed', msg => {
        console.log('实时语音识别 完成', JSON.parse(msg));
      });

      st.on('begin', msg => {
        console.log('一句话识别 开始', msg);
      });

      st.on('end', msg => {
        console.log('一句话识别 结束。', JSON.parse(msg).payload.result);
        if (JSON.parse(msg).payload.result) {
          this.stResult += JSON.parse(msg).payload.result;
        }
      });
      //监听关闭事件 如果识别出来的文字 不为空则发送消息
      st.on('closed', () => {
        console.log('监听关闭事件');
        this.RecordingStatus = false;
        // 判断滑动方向和距离
        if (this.distance > 50) {
          //清空识别文字的内容
          this.stResult = '';
          console.log('用户取消了发送');
          return;
        }
        //并且 识别出来的内容不能为空
        if (this.stResult.trim() !== '') {
          this.conversation.inputValue = this.stResult;
          console.log('识别内容', this.stResult);
          this.sendMessage();
        }
        this.stResult = '';
      });
      //这个地方有点问题 点击一下就关闭
      st.on('failed', msg => {
        console.log('failed', msg);
        this.stResult = msg;
      });

      this.st = st;
    },

    //开始录音
    onSrStart: async function (e) {
      console.log('onSrStart');
      this.startY = e.touches[0].clientY;
      //资源
      if (!this.st) {
        console.log('st is null');
        return;
      }

      if (this.stStart) {
        console.log('st is started!');
        return;
      }
      let st = this.st;
      try {
        await st.start(st.defaultStartParams());
        this.stStart = true;
      } catch (e) {
        console.log('start failed:' + JSON.stringify(e));
        return;
      }

      wx.getRecorderManager().start({
        duration: 600000,
        numberOfChannels: 1,
        sampleRate: 16000,
        format: 'PCM',
        frameSize: 50
      });
    },
    //按住说话并且移动过程中禁止页面滚动
    touchmove(e) {
      e.preventDefault();
      const endY = e.changedTouches[0].clientY;
      this.distance = this.startY - endY;
      //滑动到了取消发送位置
      this.SendCancellation = this.distance > 50 ? true : false;
    },
    //结束录音
    onSrStop: async function (e) {
      this.RecordingStatus = false;
      //恢复为原来的样式
      this.SendCancellation = false;
      // 记录触摸结束点的 Y 轴坐标
      const endY = e.changedTouches[0].clientY;
      this.distance = this.startY - endY;
      wx.getRecorderManager().stop();
      await sleep(500);
      if (this.stStart && this.st) {
        try {
          await this.st.close();
          this.stStart = false;
        } catch (e) {
          console.log('close st failed:' + e);
        }
      }
    },
    trainingEnd() {
      common.osg.confirm('是否确认结束对练？结束对练后将生成评估结果', () => {
        common.osg.ajax(
          '/training/end',
          { session_id: this.sessionId },
          () => {
            common.osg.ajax(
              '/evaluation/evaluate',
              { session_id: this.sessionId },
              () => {
                common.osg.open('/subpackages/evaluation/evaluation', {
                  sessionId: this.sessionId
                });
              },
              {
                loadingMsg: '生成评估结果中',
                header: {
                  'Content-Type': 'application/json'
                }
              }
            );
          },
          {
            noload: true,
            header: {
              'Content-Type': 'application/json'
            }
          }
        );
      });
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style lang="scss" scoped>
// 会话
.conversation {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow-y: hidden;
  box-sizing: border-box;
  .top {
    border-radius: 12px;
    margin: 16px 16px 0 16px;
    border: 1px solid #ebebeb;
    padding: 12px;
    width: 85vw;
    box-sizing: border-box;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
    text-align: justify;
    overflow: hidden;
    align-self: flex-start;
    background-color: rgb(247, 247, 247);
    .c-collapse-content {
      font-size: 14px;
      padding: 10px 0 0 0;
      background-color: rgb(247, 247, 247);
    }
  }
  .scroll-view {
    // height: 100vh;
    flex: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    .scroll-item {
      display: flex;
      flex-direction: column;
      box-sizing: border-box; // 优化自动滚动到指定元素
      .message {
        border-radius: 12px;
        margin: 16px 16px 0 16px;
        padding: 12px;
        max-width: 85vw;
        box-sizing: border-box;
        text-align: justify;
        overflow: hidden;
        .message-buttons {
          margin-top: 5px;
          border-top: 1px solid #e6e6e6;
          display: flex;
          .message-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            height: 40px;
            margin: 10px 10px 0 0;
            padding: 0 10px;
            border-radius: 12px;
            background-color: #e8f0f7;
            color: #106cff;
          }
          .message-icon {
            padding: 0;
          }
        }
      }

      .message-role-assistant {
        align-self: flex-start;
        background-color: rgb(247, 247, 247);
      }

      .message-role-user {
        align-self: flex-end;
        background-color: #106cff;
        color: #fff;
      }
    }
  }
  .bottom {
    padding-bottom: env(safe-area-inset-bottom);
    background-color: rgba(255, 255, 255, 0.8);
    .tools {
      width: 100vw;
      display: flex;
      overflow-x: auto;
      margin: 12px 0;
      .tool {
        display: inline-flex;
        border: 1px solid #ebebeb;
        padding: 8px;
        border-radius: 8px;
        margin: 0 16px;
      }
    }
    .input {
      position: relative;
      width: calc(100vw - 30px);
      min-height: 60px;
      box-sizing: border-box;
      border-radius: 12px;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      margin: 0 16px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // overflow: hidden;
      .keyboard-field {
        flex: 1;
        ::v-deep .van-cell {
          padding: 10px 10px 10px 5px;
        }
        ::v-deep .keyboardInput {
          font-size: 18px;
        }
      }

      .voiceInput {
        flex: 1;
        text-align: center;
        font-weight: 600;
        font-size: 18px;
        position: relative;
      }
      .cancel {
        width: 100%;
        position: absolute;
        bottom: 82px;
        text-align: center;
        left: 0;
        font-size: 28rpx;
        color: #888888;
        z-index: 999;
      }
      .IsMoveToCancel {
        color: red;
      }
      .icons {
        display: flex;
      }
    }
  }
}

// 回答前 开头动画
.animation-loading {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.loading-bars {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-bars text {
  display: inline-block;
  width: 4px;
  height: 18px;
  margin: 0 4px;
  /* 增大间距 */
  background-color: #000;
  border-radius: 2px;
  /* 添加圆角 */
  animation: loading 1.5s infinite;
  /* 调整动画持续时间 */
}

.loading-bars text:nth-child(2) {
  animation-delay: 0.15s;
  /* 调整延迟以适应新的动画持续时间 */
}

.loading-bars text:nth-child(3) {
  animation-delay: 0.3s;
  /* 调整延迟以适应新的动画持续时间 */
}

.loading-bars text:nth-child(4) {
  animation-delay: 0.45s;
  /* 调整延迟以适应新的动画持续时间 */
}

.loading-bars text:nth-child(5) {
  animation-delay: 0.6s;
  /* 调整延迟以适应新的动画持续时间 */
}

@keyframes loading {
  0%,
  100% {
    transform: scaleY(0.5);
    opacity: 0.3;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

// 回答中 结尾动画
.answer-dot {
  width: 10px;
  height: 10px;
  background-color: #000;
  border-radius: 50%;
  display: inline-block;
  margin-left: 5px;
  animation: answerDotChange 2s infinite;
}

@keyframes answerDotChange {
  0%,
  100% {
    background-color: #000;
  }
  50% {
    background-color: #ccc;
  }
}

// 绝对定位 抽离
@mixin position {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

// 语音转文本
.MicrophoneEffect {
  width: 200rpx;
  height: 200rpx;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);

  // 录音麦克风css样式效果
  .record-btn {
    @include position;
    border-radius: 50%;
    background: url(https://imagev2.xmcdn.com/storages/bb7b-audiofreehighqps/93/D6/GMCoOSQFwEJIAAA9ygEPjfgY.png)
      no-repeat center/100%;
    margin: 0 auto;
    z-index: 2;
  }

  .border-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  .record-wrapper.first {
    @include position;
    background: rgba(234, 90, 54, 0.3);
    opacity: 0.1;
    border-radius: 50%;
    animation: first 3s infinite linear;
  }

  .record-wrapper.second {
    @include position;
    background: rgba(234, 90, 54, 0.3);
    opacity: 0.1;
    border-radius: 50%;
    animation: first 3s infinite linear;
    animation-delay: 1s;
  }

  .record-wrapper.third {
    @include position;
    background: rgba(234, 90, 54, 0.3);
    opacity: 0.1;
    border-radius: 50%;
    animation: first 3s infinite linear;
    animation-delay: 2s;
  }
}

@keyframes first {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  33% {
    opacity: 0.66;
    transform: scale(1.33);
  }

  66% {
    opacity: 0.33;
    transform: scale(1.67);
  }

  100% {
    opacity: 0;
    transform: scale(2);
  }
}
</style>
<style lang="scss">
.uni-easyinput__content-textarea {
  min-height: 22px !important;
  margin-left: 6px !important;
}
.uni-easyinput__placeholder-class {
  font-size: 14px !important;
  line-height: 22px !important;
}
</style>
