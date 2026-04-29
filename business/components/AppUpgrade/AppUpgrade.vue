<template>
  <van-overlay :show="wgt.show" class="upgrade-overlay" custom-style="z-index:999;">
    <view class="upgrade-view">
      <image src="https://pub.fsgo365.cn/upgrade.png" mode="widthFix" class="upgrade-image"></image>
      <!-- <van-icon name="close" class="upgrade-close" @click="wgtClose()" :data-event="{id:'TcizyFjYxY'}" /> -->
      <view class="upgrade-title">发现新版本 v{{ wgt.data.version }}</view>
      <view v-if="wgt.data.memo" v-html="wgt.data.memo" class="upgrade-memo"></view>
      <view v-if="wgt.download.downloading === true" class="upgrade-progress-box flex-column">
        <progress
          class="upgrade-progress"
          :percent="wgt.download.downLoadPercent"
          activeColor="#106cff"
          show-info
          stroke-width="10"
          border-radius="10"
        />
        <view style="width: 100%; font-size: 28rpx; display: flex; justify-content: center">
          <text>安装包下载中，请稍后</text>
          <text>（{{ wgt.download.downloadedSize }}/{{ wgt.download.packageFileSize }}M）</text>
        </view>
      </view>
      <van-button
        v-else-if="wgt.download.downloading === 'restart'"
        round
        block
        type="info"
        custom-style="margin-top:10vw;"
        @click="restart"
        :data-event="{ id: 'pg75rLhjM6' }"
      >
        更新完成，点击立即重启
      </van-button>
      <view v-else>
        <van-button
          round
          block
          type="info"
          custom-style="margin-top:10vw;"
          @click="downloadWgt"
          :data-event="{ id: 'udz2tq3N2j' }"
        >
          立即下载升级
        </van-button>
        <view v-if="wgt.st && wgt.st != 'wifi'" class="c-gray-6 c-size-12 c-m-t-20 c-text-center">
          当前的网络环境是
          <text class="c-m-l-5 c-bold">{{ wgt.st }}</text>
        </view>
      </view>
    </view>
  </van-overlay>
</template>
<script>
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      wgt: {
        show: false,
        data: {},
        st: '',
        download: {
          downloading: false,
          downLoadPercent: '',
          downloadedSize: '',
          packageFileSize: ''
        }
      }
    };
  },
  methods: {
    async checkWgt() {
      await new Promise(resolve => {
        common.osg.checkWgt((data, st) => {
          if (data) {
            this.wgt.st = st;
            this.wgt.data = data;
            this.wgt.show = true;
            this.wgt.download = {};
          }
          resolve();
        });
      });
      // 必须升级完成，才执行后续逻辑
      if (this.wgt.show) return;
    },
    downloadWgt() {
      common.osg.downloadWgt(
        this.wgt.data.fileid,
        this.wgt.data.fileidUrl,
        (downLoadPercent, downloadedSize, packageFileSize) => {
          this.wgt.download = {
            downloading: true,
            downLoadPercent,
            downloadedSize,
            packageFileSize
          };
        },
        () => {
          this.wgt.download.downloading = 'restart';
        }
      );
    },
    restart() {
      setTimeout(function () {
        plus.runtime.restart();
      }, 1000);
    }
  }
};
</script>
<style lang="scss">
.upgrade-overlay {
  position: relative;
  z-index: 9999;

  .upgrade-view {
    position: absolute;
    width: 90vw;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 16px;
    padding: 18vw 5vw 5vw;
    box-sizing: border-box;

    .upgrade-image {
      position: absolute;
      left: 50%;
      width: 50%;
      top: -30vw;
      transform: translate(-50%, 0);
    }

    .upgrade-close {
      color: #969799;
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 25px;
    }

    .upgrade-title {
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      color: #106cff;
    }

    .upgrade-memo {
      color: #646566;
      margin-top: 10vw;
      white-space: pre-wrap;
    }

    .upgrade-progress-box {
      width: 100%;
      margin-top: 10vw;
    }

    .upgrade-progress {
      margin-bottom: 10px;
      width: 100%;
      height: 40rpx;
      border-radius: 10px;
    }

    .uni-progress-bar {
      border-radius: 10px;
    }

    .uni-progress-inner-bar {
      border-radius: 10px;
    }
  }
}
</style>
