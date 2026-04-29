<template>
  <div class="part-imgshow" v-show="ispart_imgshow" @click="imgshow_close">
    <div class="part-imgshow-bg"></div>
    <div class="part-imgshow-content">
      <img :src="imgshow_url" alt="" mode="widthFix" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'c-imgshow',
  data: function () {
    return {
      // imgshow_url: '' ,
      // ispart_imgshow: false,
    };
  },
  props: {
    imgshow_url: String,
    ispart_imgshow: {
      type: Boolean,
      default: false
    }
  },
  mounted: function () {
    // this.imgshow_url = this.imgshow_url;
    // this.ispart_imgshow = this.ispart_imgshow;
  },
  methods: {
    imgshow_close: function () {
      this.$emit('part_close', false);
    }
  }
};
</script>

<style scoped>
/*图片显示*/
.part-imgshow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.part-imgshow .part-imgshow-content,
.part-imgshow .part-imgshow-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 110;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}

.part-imgshow .part-imgshow-content {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 120;
}

.part-imgshow img {
  width: 100vw;
}
</style>
