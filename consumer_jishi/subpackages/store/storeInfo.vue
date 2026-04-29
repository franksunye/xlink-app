<template>
  <view>
    <view>
      <image
        src="https://pub.fsgo365.cn/storeBanner.jpeg"
        mode="aspectFill"
        style="width: 100vw; height: 130px"
      />
      <view class="name">{{ storeData.name }}</view>
      <view class="tabs">
        <text class="tab tab-active" @click="pageScrollTo('section1')">门店信息</text>
        <text class="tab" @click="pageScrollTo('section2')">政策/保障</text>
        <text class="tab" @click="pageScrollTo('section3')">经营信息</text>
      </view>
      <van-divider custom-style="border-color:#D9D9D9;margin-bottom:22px;" />
      <view class="info" id="section1">
        <view class="title">基本信息</view>
        <view style="margin-top: 10px">
          <van-icon name="clock-o" color="#357ABB" size="15px" style="margin-right: 5px" />
          <text class="title">营业时间</text>
        </view>
        <view class="desc">周一到周日 全天</view>
        <van-divider custom-style="border-color:#D9D9D9;margin:8px 23px 8px 0;" />
        <view class="title">门店概览</view>
        <view style="margin: 10px 0 20px">
          <van-icon name="user-o" color="#357ABB" size="15px" style="margin-right: 5px" />
          <text class="title" style="font-size: 14px">
            管家：{{ storeData.exts.housekeeperNumber || 5 }}
          </text>
          <van-icon name="friends-o" color="#357ABB" size="15px" style="margin: 0 5px 0 30px" />
          <text class="title" style="font-size: 14px">
            施工队：{{ storeData.exts.workerNumber || 10 }}
          </text>
        </view>
      </view>
      <view class="gap"></view>
      <view class="info" id="section2">
        <view class="title">经营政策/保障</view>
        <view style="margin-top: 10px">
          <van-icon name="description" color="#357ABB" size="15px" style="margin-right: 5px" />
          <text class="title">经营承诺</text>
        </view>
        <view class="desc" style="color: #000000">投诉快速响应</view>
        <view class="desc">12小时内响应，8小时内解决</view>
      </view>
      <view class="gap"></view>
      <view class="info" id="section3">
        <view class="title">经营信息</view>
        <view style="margin-top: 10px">
          <van-icon name="award-o" color="#357ABB" size="15px" style="margin-right: 5px" />
          <text class="title">荣誉证明</text>
        </view>
        <view style="display: flex; align-items: center; margin-top: 4px">
          <image
            v-if="storeData.exts.businessLicense && storeData.exts.businessLicense[0]"
            :src="storeData.exts.businessLicense[0].url"
            style="width: 77px; height: 48px; margin-left: 20px"
            @click="previewImage(storeData.exts.businessLicense[0].url)"
          />
          <view>
            <view class="desc" style="color: #000000">机构认证</view>
            <view class="desc">营业执照</view>
          </view>
        </view>
        <van-divider custom-style="border-color:#D9D9D9;margin:20px 23px 8px 0;" />
        <block v-if="storeData.exts.serviceScope && storeData.exts.serviceScope.length > 0">
          <view class="title">服务范围</view>
          <view class="scopes">
            <text class="scope" v-for="(item, i) in storeData.exts.serviceScope" :key="i">
              {{ codelabel('select', 'serviceScope', item) }}
            </text>
          </view>
        </block>
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
      params: {},
      storeData: { exts: {} },
      options: {
        codecfg_serviceScope: {
          codeId: 'serviceScope'
        },
        serviceScope: []
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.params = params;
    common.osg.codeoption();
    this.getStore();
  },
  methods: {
    codelabel(type, option, val) {
      if (!val) return;
      if (type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
      }
    },
    // 获取门店详情
    getStore() {
      common.osg.ajax('parnter/queryById/' + this.params.partnerId, {}, res => {
        res.entity.exts = res.entity.exts || {};
        this.storeData = res.entity;
      });
    },
    previewImage(url) {
      wx.previewImage({
        current: url,
        urls: [url]
      });
    },
    pageScrollTo(id) {
      common.osg.pageScrollTo(id);
    }
  }
};
</script>

<style lang="scss" scoped>
.name {
  margin: -35px 25px;
  background: #fff;
  position: absolute;
  width: calc(100vw - 50px);
  text-align: center;
  height: 50px;
  border-radius: 8px;
  line-height: 50px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  font-weight: 600;
}
.tabs {
  margin: 45px 40px 0;
  display: flex;
  justify-content: space-between;
  .tab {
    border-radius: 300px;
    background: #d9d9d9;
    color: #000000;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    padding: 1px 6px;
    height: 24px;
    line-height: 22px;
    text-align: center;
  }
  .tab-active {
    background: #ffd700;
  }
}
.info {
  margin: 20px 0 20px 23px;
  .title {
    font-size: 16px;
    // font-weight: 500;
  }
  .desc {
    color: #6a6a6a;
    font-size: 12px;
    // font-weight: 300;
    margin-left: 20px;
    line-height: 22px;
  }
}
.gap {
  width: 100vw;
  height: 10px;
  background: #efefef;
}
.scopes {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 20px;
  padding-bottom: 30px;
  .scope {
    font-size: 12px;
    line-height: 22px;
    width: 33%;
    margin-bottom: 8px;
  }
}
</style>
