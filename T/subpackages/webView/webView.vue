<template>
  <view>
    <web-view :src="href"></web-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      href: ''
    };
  },
  methods: {
    onLoad(params) {
      this.href = decodeURIComponent(params.href);
    }
  }
};
</script>
