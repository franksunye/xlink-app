<template>
  <view class="labour" @click.capture="track">
    <view style="background: #067cd2; height: 120px"></view>
    <view class="info" v-if="formData._id">
      <view class="info-card">
        <view class="info-card-top">
          <van-image
            width="64px"
            height="64px"
            custom-class="c-card-image"
            :src="formData.avatar"
          />
          <view class="c-flex c-flex-col c-flex-1">
            <view class="c-flex c-item-center c-flex-between">
              <view class="c-flex c-item-center">
                <text style="font-size: 20px; font-weight: 600; color: #333333; margin-right: 3px">
                  {{ formData.name }}
                </text>
                <view class="c-tag-warning" v-if="formData.state === 1">
                  <van-icon
                    name="youzan-shield"
                    style="font-size: 10px; color: #09c161; margin-right: 2px"
                  ></van-icon>
                  {{ codelabel('workerState', formData.state) }}
                </view>
              </view>
              <view class="c-flex c-item-center">
                <van-icon
                  name="location"
                  style="font-size: 13px; margin-right: 7rpx; color: #666666"
                ></van-icon>
                <text style="color: #666666; font-size: 14px">
                  距离您{{ String(formData.distance).substring(0, 3) }}km
                </text>
              </view>
            </view>
            <view style="color: #666; font-size: 14px">
              {{ codelabel('sex', formData.sex) }}·{{ formData.age }}岁
            </view>
          </view>
        </view>
        <view
          class="c-flex c-item-center c-flex-between"
          style="padding: 8px 15px; background: #d9f0ff; position: relative"
        >
          <view class="c-flex c-item-center">
            <van-icon name="phone" style="color: #28ff42; margin-right: 4px"></van-icon>
            <text v-if="formData.phone">
              {{
                formData.phone.substring(0, 3) +
                '****' +
                formData.phone.substr(formData.phone.length - 4)
              }}
            </text>
          </view>
          <van-button
            round
            size="small"
            color="#0078D0"
            @click="makePhoneCall(formData.phone)"
            :data-event="{ id: 'vduN0fUqew' }"
          >
            免费拨打
          </van-button>
          <!-- <view class="c-tag-time">5次</view> -->
        </view>
      </view>
      <view class="info-content">
        <view style="margin: 15px 0 12px; font-size: 16px; font-weight: 500">找活期望</view>
        <view v-if="formData.tags.length > 0" class="c-flex">
          <view v-for="(item, j) in formData.tags" :key="j" class="c-tag-info">
            {{ codelabel('userTag', item) }}
          </view>
        </view>
        <view
          v-if="formData.salary || formData.salary === 0"
          style="color: #333333; height: 25px; margin: 12px 0 5px; font-size: 14px"
        >
          期望工资：{{ formData.salary }}元/日丨随时进场
        </view>
        <view
          v-if="formData.abilitys.length > 0"
          class="c-flex"
          style="justify-content: normal; margin-top: 5px"
        >
          <view
            v-for="(item, j) in formData.abilitys"
            :key="j"
            class="c-tag-info"
            style="background: rgba(249, 193, 12, 0.14); color: #675f47"
          >
            {{ codelabel('workerAbilitys', item) }}
          </view>
        </view>
        <view class="memo" v-if="formData.memo">
          {{ formData.memo }}
        </view>
        <view style="margin: 15px 0 13px; font-size: 16px; font-weight: 500">服务案例</view>
        <view class="c-flex" style="margin-bottom: 7rpx">
          <van-image
            :width="imgWidth"
            :height="imgWidth"
            src="https://pub.fsgo365.cn/8095982541802353065.png"
            custom-class="case-image"
          />
          <van-image
            :width="imgWidth"
            :height="imgWidth"
            src="https://pub.fsgo365.cn/1379123871745983039.png"
            custom-class="case-image"
          />
          <van-image
            :width="imgWidth"
            :height="imgWidth"
            src="https://pub.fsgo365.cn/7659275687228783698.png"
            custom-class="case-image"
          />
        </view>
      </view>
    </view>
    <van-divider
      contentPosition="center"
      custom-style="border-color: #D6D6D6;color:#666666;margin: 15rpx;font-weight: 500;"
    >
      附近适合的
    </van-divider>
    <view class="c-cards" style="padding: 0 15px 80px">
      <view
        class="c-card"
        v-for="(item, i) in fpi.data"
        :key="i"
        @click="doOpen('labour', { id: item._id })"
        :data-event="{ id: 'mpRwLEeOdA' }"
      >
        <view class="c-flex c-item-start" :data-event="{ id: 'mpRwLEeOdA' }">
          <view class="c-flex" :data-event="{ id: 'mpRwLEeOdA' }">
            <van-image
              width="50px"
              height="50px"
              custom-class="c-card-image"
              :src="item.avatar"
              :data-event="{ id: 'mpRwLEeOdA' }"
            />
            <view class="c-flex c-flex-col c-flex-between" :data-event="{ id: 'mpRwLEeOdA' }">
              <view class="c-flex c-item-center" :data-event="{ id: 'mpRwLEeOdA' }">
                <text style="margin-right: 3px" :data-event="{ id: 'mpRwLEeOdA' }">
                  {{ item.name }}
                </text>
                <view
                  class="c-tag-warning"
                  v-if="item.state === 1"
                  :data-event="{ id: 'mpRwLEeOdA' }"
                >
                  <van-icon
                    name="youzan-shield"
                    style="font-size: 10px; color: #09c161; margin-right: 2px"
                  ></van-icon>
                  {{ codelabel('workerState', item.state) }}
                </view>
              </view>
              <view style="color: #888888; font-size: 14px" :data-event="{ id: 'mpRwLEeOdA' }">
                {{ codelabel('sex', item.sex) }}·{{ item.age }}岁
              </view>
            </view>
          </view>
          <view
            class="status"
            :style="item.status == '1' ? 'color:#07c160' : ''"
            :data-event="{ id: 'mpRwLEeOdA' }"
          >
            {{ codelabel('workerStatus', String(item.status)) }}
          </view>
        </view>
        <view
          v-if="item.tags.length > 0"
          class="c-flex"
          style="justify-content: normal; margin-top: 25rpx"
          :data-event="{ id: 'mpRwLEeOdA' }"
        >
          <view
            v-for="(item, j) in item.tags"
            :key="j"
            class="c-tag-info"
            :data-event="{ id: 'mpRwLEeOdA' }"
          >
            {{ codelabel('userTag', item) }}
          </view>
        </view>
        <view
          v-if="item.salary || item.salary === 0"
          style="color: #333333; height: 25px; margin-top: 7px; font-size: 14px"
          :data-event="{ id: 'mpRwLEeOdA' }"
        >
          期望工资：{{ item.salary }}元/日丨随时进场
        </view>
        <view
          v-if="item.abilitys.length > 0"
          class="c-flex"
          style="justify-content: normal; margin-top: 5px"
          :data-event="{ id: 'mpRwLEeOdA' }"
        >
          <view
            v-for="(item, j) in item.abilitys"
            :key="j"
            class="c-tag-info"
            style="background: rgba(249, 193, 12, 0.14); color: #675f47"
            :data-event="{ id: 'mpRwLEeOdA' }"
          >
            {{ codelabel('workerAbilitys', item) }}
          </view>
        </view>
        <view class="memo" v-if="item.memo" :data-event="{ id: 'mpRwLEeOdA' }">
          {{ item.memo }}
        </view>
        <view style="margin-top: 10px; align-items: center" :data-event="{ id: 'mpRwLEeOdA' }">
          <view class="c-flex c-item-center" :data-event="{ id: 'mpRwLEeOdA' }">
            <van-icon
              name="location"
              style="font-size: 13px; margin-right: 7rpx; color: #666666"
            ></van-icon>
            <text style="color: #666666; font-size: 14px" :data-event="{ id: 'mpRwLEeOdA' }">
              距离您{{ String(item.distance).substring(0, 3) }}km
            </text>
          </view>
          <!-- <van-button
            plain
            type="info"
            round
            size="small"
            color="#0078D0"
            @click="makePhoneCall(item.phone)" :data-event="{id:'jBR1oBOCcx'}">
            我要联系
          </van-button> -->
        </view>
      </view>
    </view>
    <view class="bottom">
      <view></view>
      <van-button
        round
        color="#0078D0"
        custom-style="width: 322rpx; height: 76rpx;font-size:16px;"
        @click="makePhoneCall(formData.phone)"
        :data-event="{ id: 'sMskIQBHaC' }"
      >
        免费拨打
      </van-button>
      <!-- <view class="c-tag-time">5次</view> -->
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      id: '',
      latitude: '',
      longitude: '',
      imgWidth: '',
      options: {
        codecfg_workerAbilitys: { codeId: 'workerAbilitys' },
        codecfg_workerStatus: { codeId: 'workerStatus' },
        codecfg_workerState: { codeId: 'workerState' },
        codecfg_sex: { codeId: 'SEX' },
        codecfg_userTag: { codeId: 'userTag' }
      },
      formData: {
        tags: [],
        abilitys: []
      },
      fpi: { data: [] }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.id = param.id;
    common.osg.codeoption(() => {});
    common.osg.getLocation(res => {
      this.latitude = res.latitude;
      this.longitude = res.longitude;
      this.getData(() => {
        this.getNearbyData();
      });
    });
    this.imgWidth = (wx.getSystemInfoSync().windowWidth - 50) / 3 + 'px';
  },
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    makePhoneCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    getData(callback) {
      common.osg.ajax(
        '/biz/labour/findById',
        { id: this.id, latitude: this.latitude, longitude: this.longitude },
        res => {
          this.formData = res.data;
          if (callback) callback();
        }
      );
    },
    getNearbyData() {
      common.osg.ajax(
        'biz/labour/query',
        {
          'ne:_id|string#and': this.id,
          latitude: this.latitude,
          longitude: this.longitude,
          'in:abilitys|array#and': this.formData.abilitys
        },
        res => {
          this.fpi = res;
        }
      );
    }
  }
};
</script>

<style lang="scss">
.labour {
  .info {
    background-color: #fff;
    border-radius: 8px 8px 0 0;
    margin-top: -10px;
    padding: 15px;
    .info-card {
      border-radius: 8px;
      overflow: hidden;
      margin-top: -80px;
      .info-card-top {
        width: 100%;
        padding: 15px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        background: linear-gradient(180deg, #f0f9ff 0%, #e8f4fc 100%);
        .c-card-image {
          display: flex;
          border-radius: 5px;
          overflow: hidden;
          margin-right: 11px;
        }
        .c-tag-warning {
          height: 15px;
          display: flex;
          align-items: center;
          padding: 0 5px;
          border-radius: 15rpx;
          background: #e1f9c7;
          font-size: 10px;
          font-weight: 500;
          color: #09c161;
          height: 28rpx;
          line-height: 28rpx;
        }
      }
      .c-tag-time {
        position: absolute;
        background-color: #fd401c;
        border: 1px solid #fff;
        color: #ffffff;
        border-radius: 11rpx 11rpx 11rpx 0rpx;
        padding: 0 2px;
        font-size: 10px;
        top: 3px;
        right: 3px;
      }
    }
    .info-content {
      padding: 0 2px;
      .c-tag-warning {
        height: 15px;
        display: flex;
        align-items: center;
        padding: 0 5px;
        border-radius: 15rpx;
        background: #e1f9c7;
        font-size: 10px;
        font-weight: 500;
        color: #09c161;
        height: 28rpx;
        line-height: 28rpx;
      }
      .c-tag-info {
        height: 15px;
        background: #e5effb;
        border-radius: 15rpx;
        height: 14px;
        line-height: 14px;
        font-size: 10px;
        font-weight: 500;
        color: #0078d0;
        margin-right: 5rpx;
        padding: 1rpx 15rpx;
      }
      .memo {
        margin-top: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
      }
      .case-image {
        display: flex;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 10px;
      }
    }
  }
  .c-card {
    margin: 0 0 10px;
    .c-card-image {
      display: flex;
      border-radius: 5px;
      overflow: hidden;
      margin-right: 7px;
    }
    .c-tag-warning {
      height: 15px;
      display: flex;
      align-items: center;
      padding: 0 5px;
      border-radius: 15rpx;
      background: #e1f9c7;
      font-size: 10px;
      font-weight: 500;
      color: #09c161;
      height: 28rpx;
      line-height: 28rpx;
    }
    .c-tag-info {
      height: 15px;
      background: #e5effb;
      border-radius: 15rpx;
      height: 14px;
      line-height: 14px;
      font-size: 10px;
      font-weight: 500;
      color: #0078d0;
      margin-right: 5rpx;
      padding: 1rpx 15rpx;
    }
    .status {
      font-size: 14px;
      color: #999999;
      font-weight: 600;
      height: 20px;
      line-height: 20px;
    }
    .memo {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    box-sizing: border-box;
    border-top: 1rpx solid #e4e4e4;
    background-color: #fff;
    .c-tag-time {
      position: absolute;
      background-color: #fd401c;
      border: 1px solid #fff;
      color: #ffffff;
      border-radius: 11rpx 11rpx 11rpx 0rpx;
      padding: 0 2px;
      font-size: 12px;
      right: 10px;
      top: 5px;
    }
  }
}
</style>
