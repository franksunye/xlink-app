<template>
  <view></view>
</template>

<script>
export default {
  data() {
    return {
      type: ''
    };
  },
  onLoad(e) {
    this.type = 'load';
    wx.navigateTo({
      url: '../../pages/declaration/declaration'
    });
  },
  onShow(e) {
    if (!this.type) {
      wx.reLaunch({
        url: '../../pages/index/index'
      });
    } else {
      this.type = '';
    }
  },
  methods: {}
};
</script>

<style></style>
