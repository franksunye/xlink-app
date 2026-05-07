<template>
  <text class="x-icon" :style="iconStyle">{{ glyph }}</text>
</template>

<script>
const ICONS = {
  workOrder: 61697,
  wallet: 61698,
  sliders: 61699,
  search: 61700,
  proposal: 61701,
  phone: 61702,
  orderAdd: 61703,
  message: 61704,
  location: 61705,
  done: 61706,
  customer: 61707,
  contract: 61708,
  car: 61709,
  appointment: 61710
};

export default {
  name: 'XIcon',
  props: {
    name: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    glyph() {
      const codepoint = ICONS[this.name];
      if (!codepoint) {
        return '';
      }
      return String.fromCharCode(codepoint);
    },
    iconStyle() {
      const style = {};
      if (this.size) {
        style.fontSize = String(this.size).indexOf('rpx') >= 0 ? this.size : this.size + 'rpx';
      }
      if (this.color) {
        style.color = this.color;
      }
      return style;
    }
  }
};
</script>

<style scoped>
.x-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'XLinkIcons' !important;
  color: currentColor;
  font-size: inherit;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  text-rendering: auto;
}
</style>
