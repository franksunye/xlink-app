<template>
  <view class="conversation" @click.capture="track">
    <scroll-view
      class="scroll-view"
      scroll-y
      :scroll-into-view="viewIndex"
      scroll-with-animation
      enable-back-to-top
      enable-passive
      refresher-enabled
      :refresher-triggered="refresh"
      :enhance="true"
      :fast-deceleration="true"
      :scroll-anchoring="true"
      :paging-enabled="true"
      :enable-flex="true"
      @refresherrefresh="pullDownRefresh"
    >
      <view
        v-for="(item, i) in conversation.messageList.data"
        :key="i"
        :id="'message_' + i"
        class="scroll-item"
      >
        <view :class="'message-role-' + item.role" class="message">
          <!-- 消息内容 -->
          <text v-if="item.content" user-select>
            {{ item.content }}
            <!-- 消息回答中 结尾动画 -->
            <text
              v-if="
                conversation.lastEvent == 'conversation.message.delta' &&
                i == conversation.messageList.data.length - 1
              "
              class="answer-dot"
            ></text>
          </text>
          <!-- 消息回答前 开头动画 -->
          <view v-else-if="i == conversation.messageList.data.length - 1" class="animation-loading">
            <view class="loading-bars">
              <text></text>
              <text></text>
              <text></text>
              <text></text>
              <text></text>
            </view>
          </view>

          <!-- 底部功能按钮区显示条件：1.有消息内容。2.是Agent回答的消息。3.包含跳转关键词。 4.如果是最后一条，需要已回答完成才显示。  -->
          <view
            v-if="
              item.content &&
              item.role == 'assistant' &&
              (item.content.indexOf('工单') != -1 ||
                (i == conversation.messageList.data.length - 1 &&
                  (conversation.lastEvent == '' || conversation.lastEvent == 'done')))
            "
            class="message-buttons"
          >
            <view
              v-if="i == conversation.messageList.data.length - 1"
              class="message-button message-icon"
              @click="copy(item.content)"
              :data-event="{ id: 'RvUUMjw77m' }"
            >
              <van-icon
                name="https://pub.fsgo365.cn/icon_copy.png"
                size="24px"
                :data-event="{ id: 'RvUUMjw77m' }"
              ></van-icon>
            </view>
            <!-- TODO:跳转小程序页面：当前写死包含“工单”文字显示查看按钮。 -->
            <view
              v-if="item.content.indexOf('工单') != -1"
              class="message-button"
              @click="open"
              :data-event="{ id: '9JerJ14xQ5' }"
            >
              查看工单
            </view>
          </view>
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
    <view class="visualize_wrap">
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
      <van-field
        v-if="conversation.inputType == 'keyboard'"
        type="textarea"
        autosize
        :value="conversation.inputValue"
        placeholder="发消息..."
        :border="false"
        @change="onInputValueChange"
        class="keyboard-field"
        input-class="keyboardInput"
      />
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
        <van-icon
          v-if="conversation.inputValue"
          name="https://pub.fsgo365.cn/icon_send.png"
          size="35px"
          class="icon"
          @click="createChat"
          :data-event="{ id: 'RpYagCHfWI' }"
        />
        <block v-else>
          <van-icon
            v-if="conversation.inputType == 'voice'"
            name="https://pub.fsgo365.cn/icon_keyboard.png"
            size="35px"
            class="icon"
            @click="conversation.inputType = 'keyboard'"
            :data-event="{ id: '8s7fXIBbvP' }"
          />
          <van-icon
            v-else
            name="https://pub.fsgo365.cn/icon_voice.png"
            size="35px"
            class="icon"
            @click="conversation.inputType = 'voice'"
            :data-event="{ id: 'iyZhGYGm53' }"
          />
        </block>
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
      user: {},
      urlParams: {},
      conversation: {
        Authorization: '', // 令牌
        conversation_id: '', // 当前会话id
        bot_id: '7384730358849847315', // 会话聊天的 Bot ID
        salt: '', // 发起对话时需要传的加密串
        inputType: 'voice', // voice:语音输入 keyboard:键盘输入
        inputValue: '', // 输入的文本
        lastEvent: '', // 最新接收消息块的事件
        // 会话中的全部消息
        messageList: { data: [] }
      },
      refresh: false, // 是否正在下拉刷新
      viewIndex: '', // 滚动到底部元素的id，不能以数字开头
      scrollTop: 0,
      stStart: false,
      stResult: '',
      RecordingStatus: false, //当前是否处在录音状态
      token: null,
      socketOpen: false,
      socketMsgQueue: [],
      startY: 0, //开始触摸的时候拿到的 Y轴坐标的  endY 结合用于得到滑动距离
      distance: 0, //滑动方向 距离  //大于50 则取消发送
      SendCancellation: false //是否滑动到了取消发送
    };
  },
  onLoad: async function (options) {
    this.urlParams = options;
    let _that = this;
    wx.authorize({
      scope: 'scope.record',
      success() {
        _that.onSave();
      },
      fail(res) {
        // 用户拒绝了获取录音权限
        console.log(res);
      }
    });

    this.user = wx.getStorageSync('user');
    this.getConversationId();
  },
  methods: {
    // 自定义下拉刷新 uni-app存在编译问题，无法获取onPullDownRefresh
    pullDownRefresh() {
      if (!this.refresh && this.conversation.messageList.has_more) {
        this.refresh = true; // 开启下拉刷新状态，不能触发多次。
        this.getMessageList({ type: 'refresh' });
      } else {
        this.refresh = true;
        this.$nextTick(() => {
          this.refresh = false;
          return;
        });
      }
    },
    // 获取token和当前会话id
    getConversationId() {
      common.osg.ajax(
        '/agent/bot/preparation',
        {
          bot_id: '7384730358849847315' // 不指定则后台默认
        },
        res => {
          this.conversation.Authorization = res.data.apiKey;
          this.conversation.conversation_id = res.data.conversationId;
          this.conversation.salt = res.data.salt;
          if (res.data.type != 'new') {
            this.getMessageList();
          }
        }
      );
    },
    // 查询当前会话的消息列表 params type:refresh下拉刷新
    getMessageList(params = {}) {
      common.osg.ajax(
        '~https://api.coze.cn/v1/conversation/message/list?conversation_id=' +
          this.conversation.conversation_id,
        {
          // order:'desc', // 默认创建时间倒序
          // 查询：最新的N条；
          // 下拉刷新：查询之前的N条，因为是倒序所以需要after_id:last_id；
          // 默认：0，表示不指定位置。
          after_id: params.type == 'refresh' ? this.conversation.messageList.last_id : '0',
          limit: 20 // 每次查询返回的数据量。默认为 50，取值范围为 1~50。
        },
        res => {
          res.data.reverse(); // 查询默认创建时间倒序，需要翻转数组。
          if (params.type == 'refresh') {
            let viewIndex = res.data.length - 1;
            res.data = res.data.concat(this.conversation.messageList.data);
            this.conversation.messageList = res;
            this.scrollToBottom(viewIndex); // 滚动到本次查询消息列表的最后一条
            this.refresh = false; // 关闭下拉刷新状态
          } else {
            this.conversation.messageList = res;
            this.scrollToBottom();
          }
        },
        {
          noload: true,
          header: {
            'Content-Type': 'application/json',
            Authorization: this.conversation.Authorization
          }
        }
      );
    },
    // 输入消息
    onInputValueChange(e) {
      this.conversation.inputValue = e.detail;
    },
    // 发起对话
    createChat() {
      let that = this;
      const requstTask = wx.request({
        url: 'https://api.coze.cn/v3/chat?conversation_id=' + this.conversation.conversation_id,
        enableChunked: true,
        header: {
          'Content-Type': 'application/json',
          Authorization: this.conversation.Authorization
        },
        method: 'post',
        data: {
          bot_id: this.conversation.bot_id,
          user_id: this.user._id,
          stream: true,
          custom_variables: Object.assign(this.urlParams, {
            salt: this.conversation.salt
          }),
          auto_save_history: true,
          additional_messages: [
            {
              role: 'user',
              content: this.conversation.inputValue,
              content_type: 'text'
            }
          ]
        },
        success(res) {
          console.log('对话完成', res);
          if (that.conversation.lastEvent == 'error') {
            common.osg.toast(res.errMsg);
          }
        },
        fail(res) {
          console.log('对话失败', res);
        }
      });

      // 将用户发送的消息插入会话中
      this.conversation.messageList.data.push({
        role: 'user',
        content: this.conversation.inputValue
      });

      // 插入回答的空消息到会话中
      let currentMessage = {
        role: 'assistant',
        content: ''
      };
      this.conversation.messageList.data.push(currentMessage);
      this.scrollToBottom();

      // 监听每当接收到新的回答消息时触发
      requstTask.onChunkReceived(res => {
        // 将消息ArrayBuffer转为字符串，并解决中文乱码问题。
        let str = new TextDecoder('utf-8').decode(res.data);
        let messageList = this.parseStreamedString(str);

        // 每次接收到的消息可能有1段或多段文本，将文本处理为数组。
        for (let i = 0; i < messageList.length; i++) {
          let msg = messageList[i];
          this.conversation.lastEvent = msg.event; // 保存最新接受到的消息事件
          console.log(msg.event + '---' + msg.data.type + '：' + msg.data.content);
          if (msg.event == 'conversation.chat.created') {
            // 创建完对话，清空输入框文字。
            this.conversation.inputValue = '';
          } else if (msg.event == 'conversation.message.delta') {
            // 接收到的文本消息包，插入当前消息内。
            currentMessage.content += msg.data.content;
          } else if (msg.event == 'conversation.message.completed' && msg.data.type == 'answer') {
            // 完成回答，将完整回答替换当前消息内容。
            currentMessage.content = msg.data.content;
            this.scrollToBottom();
          } else if (msg.event == 'done') {
            this.scrollToBottom();
          }
        }
      });
    },
    // 响应消息字符串转json
    parseStreamedString(input) {
      const lines = input.trim().split('\n');
      const result = [];

      let currentEvent = null;

      lines.forEach(line => {
        if (line.startsWith('event:')) {
          currentEvent = {
            event: line.slice(6).trim(),
            data: null
          };
          result.push(currentEvent);
        } else if (line.startsWith('data:')) {
          if (currentEvent) {
            currentEvent.data = JSON.parse(line.slice(5).trim());
          }
        }
      });

      return result;
    },
    // 默认滚动到页面底部，传参滚动到指定位置
    scrollToBottom(viewIndex) {
      this.viewIndex = ''; // 解决插入空回答时已赋值，回答完成后值未更新，无法触发滚动。
      this.$nextTick(() => {
        this.viewIndex = 'message_' + (viewIndex || this.conversation.messageList.data.length - 1);
        console.log('viewIndex', this.viewIndex);
      });
    },
    // 跳转小程序页面
    open() {
      common.osg.open('/subpackages/serviceAppointment/serviceAppointment', {
        id: '6008277784387829373'
      });
    },
    copy(data, msg) {
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
        console.log('recording failed:' + res);
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
        console.log('实时语音识别开始');
        // this.stResult = msg;
        this.RecordingStatus = true;
        //开启轻微震动 提示录音开始
        wx.vibrateShort();
      });

      st.on('changed', msg => {
        console.log('实时语音识别中间结果', msg);
        // if (JSON.parse(msg).payload.result) {
        // 	this.stResult += JSON.parse(msg).payload.result;
        // }
      });

      st.on('completed', msg => {
        console.log('实时语音识别完成', JSON.parse(msg));
      });

      st.on('begin', msg => {
        // this.stResult = '正在录音,ninqings';
        console.log('一句话识别开始', msg);
      });

      st.on('end', msg => {
        // this.stResult = msg;
        console.log('提示句子结束。', msg);
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
          this.createChat();
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
        console.log('start failed:' + e);
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
    }
  }
};
</script>

<style lang="scss" scoped>
// 会话
.conversation {
  height: 100vh;
  background-color: #fff;
  overflow-y: hidden;
  padding-bottom: 100px;
  box-sizing: border-box;

  .scroll-view {
    height: 100%;
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
        margin: 10px 10px 0 10px;
        padding: 10px;
        max-width: 85vw;
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

  .input {
    position: fixed;
    bottom: 30px;
    width: calc(100vw - 20px);
    min-height: 60px;
    box-sizing: border-box;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: 0 10px;
    padding: 0 10px;
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
      bottom: 120%;
      text-align: center;
      left: 0;
      font-size: 28rpx;
      color: #888888;
    }
    .IsMoveToCancel {
      color: red;
    }
    .icons {
      display: flex;
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
