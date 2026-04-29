<template>
  <view></view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShow() {
    let url = location.href;
    console.log('url', url);
    if (url.indexOf('?') != -1) {
      let scheme = url.substring(url.indexOf('?') + 1);
      location.href = scheme;
    } else {
      location.href = 'weixin://dl/business/?t=OQV3FdYDO6a';
    }
  },
  methods: {}
};
</script>

<style></style>
