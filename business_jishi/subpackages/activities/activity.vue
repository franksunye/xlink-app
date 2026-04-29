<template>
  <view @click.capture="track">
    <rich-text :nodes="formData.content"></rich-text>
    <view class="button-bottom">
      <van-button v-if="user._id" type="default" round open-type="share">立即分享</van-button>
      <van-button
        v-else
        type="default"
        round
        @click="
          doOpen('/subpackages/login/register', {
            documentId: documentId,
            shareUserId: shareUserId
          })
        "
        :data-event="{ id: 'iKaPxEGps5' }"
      >
        立即注册
      </van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      documentId: '',
      shareUserId: '',
      user: {},
      formData: {}
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    console.log('param', param);
    this.documentId = param.documentId;
    this.user = wx.getStorageSync('user') || {};
    this.shareUserId = this.user._id || param.shareUserId || '';
    this.getData();
    wx.showShareMenu({
      //   withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  onShareAppMessage() {
    return {
      title: this.formData.title,
      path: `/subpackages/activities/activity?documentId=${this.documentId}&shareUserId=${this.shareUserId}`
    };
  },
  methods: {
    getData() {
      common.osg.ajax(
        'index/queryDocumentById',
        {
          id: this.documentId
        },
        res => {
          // 防止图片过宽展示不全
          res.content = res.content.replace(/<img /g, '<img style="max-width:100%;display:flex;" ');
          this.formData = res;
          uni.setNavigationBarTitle({
            title: this.formData.title
          });
        }
      );
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style>
.button-bottom {
  width: 100vw;
  position: fixed;
  z-index: 2;
  bottom: 30px;
  text-align: center;
}
</style>
