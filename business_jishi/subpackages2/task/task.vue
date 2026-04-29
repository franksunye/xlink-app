<template>
  <view class="task">
    <view class="c-font-16 c-color-333 c-m-b-20 c-flex c-flex-between c-item-center">
      <text class="c-bold c-size-18">{{ data.name }}</text>
      <view
        v-if="data.priority == '2'"
        style="
          color: #ff6900;
          background-color: rgba(255, 105, 0, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
        "
      >
        紧急
      </view>
    </view>
    <view
      v-if="data.memo"
      class="c-flex c-items-center"
      style="
        line-height: 30px;
        margin-bottom: 10px;
        background-color: #f2f2f2;
        border-radius: 8px;
        padding: 4px 8px;
        font-size: 14px;
      "
    >
      <text class="c-ellipsis-1">{{ data.memo }}</text>
    </view>
    <view class="c-flex c-items-center" style="line-height: 30px">
      <van-icon name="clock-o" color="#999" size="16px" style="margin-right: 12px" />
      <text class="c-jishi">{{ data.requiredDate }} 截止</text>
    </view>
    <view class="c-flex c-items-center" style="line-height: 30px">
      <van-icon name="orders-o" color="#999" size="16px" style="margin-right: 12px" />
      <text>{{ data.saCode }}</text>
    </view>
    <view class="c-flex c-items-center" style="line-height: 30px">
      <van-icon name="contact-o" color="#999" size="16px" style="margin-right: 12px" />
      <text>{{ data.contactName }}</text>
    </view>
    <view class="c-flex c-items-center" style="line-height: 30px; margin-bottom: 10px">
      <van-icon name="location-o" color="#999" size="16px" style="margin-right: 12px" />
      <text class="c-ellipsis-1">{{ data.contactAddress }}</text>
    </view>
    <van-button v-if="data.status == 0" block color="#FF6900" icon="success" @click="handleTask">
      <view class="c-flex c-items-center c-justify-center">
        <text>完成任务</text>
      </view>
    </van-button>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      id: '',
      data: {}
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.id = param.id;
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      common.osg.ajax(
        'basic/followingUpTask/findById',
        { id: this.id },
        res => {
          this.data = res.data;
        },
        {
          noload: true
        }
      );
    },
    handleTask() {
      common.osg.ajax(
        'basic/followingUpTask/handleTask',
        { id: this.id },
        () => {
          this.getData();
        },
        {
          noload: true
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.task {
  margin: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
}
.border-box {
  box-sizing: border-box;
}
.van-icon {
  vertical-align: middle;
}
</style>
