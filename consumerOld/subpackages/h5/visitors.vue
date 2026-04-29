<template>
  <view style="padding: 1px 0 20px">
    <block v-if="fpi.data && fpi.data.length > 0">
      <view v-for="(item, i) in fpi.data" :key="i" class="c-card">
        <view class="c-card-title">
          <view style="height: 50px; display: flex; align-items: center">
            <image
              round
              fit="cover"
              :src="item.avatar ? item.avatar : '../../static/images/user.png'"
              style="width: 50px; height: 50px; border-radius: 50%"
            />
            <text class="c-m-l-20">{{ item.name || item.nickname || '' }}</text>
            <text style="margin-left: 20px">
              {{ item.sex == '1' ? '男' : item.sex == '2' ? '女' : '' }}
            </text>
          </view>
          <van-tag type="danger" size="medium" v-if="item.serviceAppointmentStatus">
            {{ codelabel('select', 'status', item.serviceAppointmentStatus) }}
          </van-tag>
        </view>
        <view class="c-card-content c-p-0">
          <view>访客编号：{{ item._id }}</view>
          <view>访问时间：{{ item.createTime }}</view>
          <view v-if="item.shareUserName">推荐人：{{ item.shareUserName }}</view>
          <view v-if="item.sharedUserCount">推荐人数：{{ item.sharedUserCount }}</view>
        </view>
        <view class="c-card-footer"></view>
      </view>
    </block>
    <van-empty v-else description="暂无数据" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      urlParams: {},
      id: '',
      fpi: {
        data: []
      },
      options: {
        codecfg_status: { codeId: 'STATUS' }
      }
    };
  },
  onLoad(params) {},
  onShow() {
    this.urlParams = common.osg.getUrlParams();
    this.id = this.urlParams.id;
    if (!this.id) {
      return;
    }
    delete this.urlParams.id;
    this.doInit();
  },
  methods: {
    doInit(params) {
      common.osg.init(this, params, app);
      common.osg.codeoption(() => {
        this.getData();
      });
    },
    getData() {
      common.osg.ajax(
        `~${common.osg.host}/fsgo/w/channel/queryZuser`,
        {
          page: this.fpi.page || 1,
          rows: this.fpi.rows || 10,
          channelId: this.id
        },
        res => {
          this.fpi = res;
        },
        {
          header: this.urlParams
        }
      );
    },
    onReachBottom() {
      this.fpi.rows += 10;
      this.getData();
    },
    codelabel(type, option, val, opts, frontEndConfig) {
      if (type == 'select') {
        return common.osg.codelabel(option, val, opts);
      } else if (type == 'cascade') {
        if (frontEndConfig && frontEndConfig.multiple) {
          return common.osg.codelabelCascadeMultiple(option, val);
        } else {
          console.log(common.osg.formatCascade(option, val));
          return common.osg.formatCascade(option, val);
        }
      }
    }
  }
};
</script>

<style>
.c-card-title {
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 10px;
  padding-bottom: 10px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.van-empty {
  height: 100vh;
}
</style>
