<template>
  <view class="speech-text" @click.capture="track">
    <block v-if="recordUrl">
      <view class="c-p-20 c-flex">
        <van-icon
          v-if="callRecord.state != 'playing'"
          name="play-circle"
          class="c-blue c-m-r-20"
          custom-style="font-size: 66rpx"
          @click="callPlay()"
          :data-event="{ id: '5diG7KvHpw' }"
        />
        <van-icon
          v-else
          name="pause-circle"
          class="c-blue c-m-r-20"
          custom-style="font-size: 66rpx"
          @click="callPause()"
          :data-event="{ id: 'sJwLggE_j7' }"
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
    </block>
    <view class="c-cards-view c-flex-1 c-auto-y">
      <view
        v-for="(item, i) in data"
        :key="i"
        class="c-card"
        @click="callSeek({ detail: item.BeginTime / 1000, callPlay: true })"
        :data-event="{ id: 'gw8v65id70' }"
      >
        <view class="c-card-title c-gray" :data-event="{ id: 'gw8v65id70' }">
          <view class="c-flex c-weight-normal" :data-event="{ id: 'gw8v65id70' }">
            <van-icon
              name="user-circle-o"
              size="20px"
              class="c-m-r-10"
              :style="'color:' + (color[item.SpeakerId] ? color[item.SpeakerId] : '#646566')"
              :data-event="{ id: 'gw8v65id70' }"
            />
            <text :data-event="{ id: 'gw8v65id70' }">用户{{ item.SpeakerId }}</text>
          </view>
          <view class="c-weight-normal" :data-event="{ id: 'gw8v65id70' }">
            {{ formatCallRecordCurrentTime(item.BeginTime / 1000) }}
          </view>
        </view>
        <view class="c-card-content c-p-b-0 c-p-t-20" :data-event="{ id: 'gw8v65id70' }">
          <text :data-event="{ id: 'gw8v65id70' }">{{ item.Text || '' }}</text>
        </view>
      </view>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      colId: '', // 通话id
      audioTitle: '', // 通话标题
      recordUrl: '', // 通话录音文件链接
      formData: {},
      data: [],
      color: ['#646566', '#ff6900', '#d6000f', '#ffd700', '#07c160'], // 讲话用户icon颜色
      // 通话录音播放
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
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.colId = param.colId;
    this.audioTitle = decodeURIComponent(param.audioTitle);
    this.recordUrl = decodeURIComponent(param.recordUrl);
    this.getData();
    common.osg.md({ act: 'speechText' });

    const audio = uni.createInnerAudioContext(); // wx.createInnerAudioContext
    audio.title = this.audioTitle || '通话录音';
    audio.src = this.recordUrl; // 设置了 src 之后会自动播放
    this.callRecord.audio = audio;
    console.log('audio', audio);
    // 监听背景音频播放事件
    audio.onPlay(() => {
      this.callRecord.state = 'playing';
      console.log('onPlay');
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
        console.log('onTimeUpdate', this.callRecord.max);
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
  },
  // 页面卸载时清理音频实例和事件监听
  onUnload() {
    if (this.callRecord.audio) {
      // 停止音频播放
      this.callRecord.audio.stop();
      // 清理音频实例
      this.callRecord.audio.destroy();
      console.log('音频监听已清除，音频已停止');
    }
  },
  methods: {
    getData() {
      common.osg.ajax('/basic/speechText/subtitle', { colId: this.colId }, res => {
        this.data = res.data;
      });
    },
    /**
     * 通话录音
     */
    // 播放
    callPlay() {
      if (
        this.callRecord.audio &&
        (this.callRecord.state == 'paused' || this.callRecord.state == 'end')
      ) {
        this.callRecord.audio.play();
        return;
      }
      this.callRecord.recordUrl = this.recordUrl;
      // const audio = wx.getBackgroundAudioManager(); // wx.createInnerAudioContext
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

    // sliderChange(e) {
    //   this.callRecord.seek = true;
    //   this.callRecord.currentTime = this.formatCallRecordCurrentTime(e.detail.value);
    // },
    // sliderDrag(e) {
    //   if (this.callRecord.state == 'paused' && e.callPlay) {
    //     this.callPlay();
    //   }
    //   this.callRecord.seek = false;
    //   this.callRecord.audio.seek(e.detail.value);
    // },

    // 停止
    // callStop() {
    //   this.callRecord.audio.stop();
    // },
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
    }
  }
};
</script>

<style lang="scss" slot="coped">
.speech-text {
  height: 100vh;
  display: flex;
  flex-direction: column;
  // 通话录音

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
  .c-cards-view :first-child {
    margin-top: 0;
  }
}
</style>
