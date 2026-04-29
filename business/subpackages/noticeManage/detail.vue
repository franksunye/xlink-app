<template>
  <view @click.capture="track">
    <view>
      <swiper
        :indicator-dots="formData.fileids && formData.fileids.length > 1"
        autoplay="true"
        :interval="3000"
        :duration="500"
        :style="'height:' + bannerHeight"
      >
        <block v-for="(item, index) in formData.fileids" :key="index">
          <swiper-item>
            <image :src="downloadUrl + '' + item" mode="widthFix" @load="getHeight"></image>
          </swiper-item>
        </block>
      </swiper>
    </view>
    <view style="padding: 10px">
      <view class="c-bold">{{ formData.title || '' }}</view>
      <view class="c-color-value c-size-14" style="margin: 10px 0">
        更新时间：{{ formData.updateTime || '' }}
      </view>
      <view style="margin: 10px">
        <rich-text :nodes="formData.content"></rich-text>
      </view>
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
      formData: {},
      downloadUrl: common.osg.downloadUrl,
      bannerHeight: ''
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.id = common.osg.param('id');
    this.getData();
  },
  methods: {
    getData() {
      common.osg.ajax('document/queryById', { id: this.id }, res => {
        // 防止图片过宽展示不全
        res.content = res.content.replace(/<img /g, '<img style="max-width:100%;display:flex;" ');
        this.formData = res;
      });
    },
    onPullDownRefresh() {
      this.getData();
    },
    // 获取banner高度
    getHeight(e) {
      //获取可使用窗口宽度
      var width = wx.getSystemInfoSync().windowWidth;
      //获取图片实际高度
      var imgheight = e.detail.height;
      //获取图片实际宽度
      var imgwidth = e.detail.width;
      //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      var height = (width * imgheight) / imgwidth;
      // if (height >= 250) height = 250;
      height += 'px';
      this.bannerHeight = height;
    }
  }
};
</script>

<style>
page {
  background: #fff;
}
</style>
