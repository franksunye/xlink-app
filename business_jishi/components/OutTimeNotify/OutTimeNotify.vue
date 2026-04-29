<template>
  <!-- 通知弹窗 -->
  <van-overlay
    :show="messagePopup.outTimeNotify && currentRole._id == '3481370558631265818'"
    :lock-scroll="false"
  >
    <view class="out-of-time-notify-modal">
      <view class="overdue-notification-box">
        <van-icon
          @click="handleOutTimeNotify"
          name="close"
          size="22px"
          style="position: absolute; color: #fff; right: -20px; top: -20px; font-size: 22px"
          :data-event="{ id: 'i_DAD7G13R' }"
        />
        <view class="reminder-view">
          <image src="https://pub.fsgo365.cn/icon-reminder.png"></image>
        </view>
      </view>
      <view class="notification-list">
        <view class="top">
          <view class="triangle">
            <view class="triangle-small"></view>
          </view>
        </view>
        <view class="bottom">
          <view
            class="timeout-Msg"
            v-for="(item, index) in messagePopup.outTimeList"
            :key="index"
            @click="handleOpen(item._id)"
            :data-event="{ id: 'QTz8W1kTys' }"
          >
            <view class="left" :data-event="{ id: 'QTz8W1kTys' }">
              <view :data-event="{ id: 'QTz8W1kTys' }">
                <van-icon name="notes-o" :data-event="{ id: 'QTz8W1kTys' }" />
                {{ item.orderNum }}
              </view>

              <view :data-event="{ id: 'QTz8W1kTys' }">
                <van-icon name="manager-o" :data-event="{ id: 'QTz8W1kTys' }" />
                {{ item.name }}
              </view>

              <view :data-event="{ id: 'QTz8W1kTys' }">
                <van-icon name="underway-o" :data-event="{ id: 'QTz8W1kTys' }" />
                {{ item.exts.datetime }}
              </view>

              <view :data-event="{ id: 'QTz8W1kTys' }">
                <van-icon name="location-o" :data-event="{ id: 'QTz8W1kTys' }" />
                {{ item.address || null }}
              </view>
            </view>
            <view class="right" :data-event="{ id: 'QTz8W1kTys' }">
              <view style="width: 100%; text-align: center" :data-event="{ id: 'QTz8W1kTys' }">
                <text style="color: red; font-size: 24rpx" :data-event="{ id: 'QTz8W1kTys' }">
                  已超时
                </text>
              </view>
              <view class="Timeout" :data-event="{ id: 'QTz8W1kTys' }">
                <block v-if="item.days > 0">
                  <text
                    class="timeout-text-large"
                    style="color: red"
                    :data-event="{ id: 'QTz8W1kTys' }"
                  >
                    {{ item.days }}
                  </text>
                  <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">天</text>
                  <text
                    class="timeout-text-large"
                    style="font-size: 36rpx"
                    :data-event="{ id: 'QTz8W1kTys' }"
                  >
                    {{ item.hours }}
                  </text>
                  <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">小时</text>
                </block>
                <block v-else-if="item.hours > 0">
                  <text class="timeout-text-large" :data-event="{ id: 'QTz8W1kTys' }">
                    {{ item.hours }}
                  </text>
                  <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">小时</text>
                  <text
                    class="timeout-text-large"
                    style="font-size: 36rpx"
                    :data-event="{ id: 'QTz8W1kTys' }"
                  >
                    {{ item.remainingMinutes }}
                  </text>
                  <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">分钟</text>
                </block>
                <block v-else>
                  <text class="timeout-text-large" :data-event="{ id: 'QTz8W1kTys' }">
                    {{ item.remainingMinutes }}
                  </text>
                  <text class="timeout-text-small" :data-event="{ id: 'QTz8W1kTys' }">分钟</text>
                </block>
              </view>
              <view class="handle" :data-event="{ id: 'QTz8W1kTys' }">
                <text style="color: #2c5bec; font-size: 24rpx" :data-event="{ id: 'QTz8W1kTys' }">
                  去处理
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="more">请填写勘查单或者修改预约时间</view>
    </view>
  </van-overlay>
</template>
<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      currentRole: {},
      messagePopup: {
        outTimeNotify: false, //是否显示超时提醒
        outTimeList: [] //超时数据列表
      }
    };
  },
  mounted() {},
  methods: {
    //获取工单预约超时列表
    getTimeoutWorkOrderList() {
      common.osg.ajax(
        '/basic/serviceAppointment/surveyTimeoutQuery',
        {},
        ({ data }) => {
          data.map(item => {
            item.days = Math.floor(item.exts.surveyTimeout / 1440);
            item.hours = Math.floor((item.exts.surveyTimeout % 1440) / 60);
            item.remainingMinutes = item.exts.surveyTimeout % 60;
          });
          this.messagePopup.outTimeList = data;
          this.messagePopup.outTimeNotify = data.length > 0;
        },
        {
          noload: true
        }
      );
    },
    // 超时提醒关闭窗口   埋点
    handleOutTimeNotify() {
      this.messagePopup.outTimeNotify = false;
      const { name, orgName } = wx.getStorageSync('user');
      common.osg.md({
        act: 'timeoutReminder_close',
        supervisorName: name,
        orgName: orgName
      });
    },
    //超时提醒点击去处理   埋点
    handleOpen(id) {
      this.doOpen('/subpackages/serviceAppointment/serviceAppointment', { id });
      const { name, orgName } = wx.getStorageSync('user');
      common.osg.md({
        act: 'timeoutReminder_handle',
        supervisorName: name,
        orgName: orgName
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
