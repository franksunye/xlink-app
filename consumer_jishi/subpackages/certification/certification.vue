<template>
  <view class="certification">
    <view class="top">
      <view class="text">认证工人 持证上岗</view>
      <view class="c-flex c-item-center input">
        <uni-search-bar
          v-model="keyword"
          radius="100"
          placeholder="请输入手机号或工号"
          @blur="search"
          class="c-flex-1"
        />
        <uni-icons
          type="scan"
          size="34"
          color="#ffffff"
          clearButton="none"
          cancelButton="none"
          @click="scanCode"
        ></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      keyword: ''
    };
  },
  onLoad() {
    common.osg.init(this, {}, app);
  },
  methods: {
    search() {
      if (!this.keyword) {
        // common.osg.toast('请输入手机号或工号', 'none');
        return;
      }
      common.osg.ajax(
        `/biz/serviceResource/certification/${this.keyword}`,
        {},
        res => {
          if (res.data.length > 0) {
            common.osg.open('/subpackages/certification/serviceResource', { id: res.data[0]._id });
          } else {
            common.osg.alert('未查询到信息，请检查您输入的内容是否正确。');
          }
        },
        {
          noload: true
        }
      );
    },
    scanCode() {
      common.osg.scanCode(res => {
        if (res) {
          this.keyword = res.result;
          this.search();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.certification {
  .top {
    background-color: #ff6900;
    text-align: center;
    height: 220px;
    .text {
      font-size: 36px;
      color: #fff;
      padding: 50px 0 40px;
    }
    .input {
      width: 80vw;
      margin: 0 auto;
    }
  }
}
</style>
<style lang="scss">
.certification {
  .uni-searchbar__cancel {
    display: none;
  }
}
</style>
