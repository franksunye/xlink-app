<script>
export default {
  onLaunch() {
    if (uni.setLocale) {
      uni.setLocale('zh-Hans');
    }
  }
};
</script>

<style>
@import './styles/theme.css';

page {
  background: #f5f7fa;
  color: #182338;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
}

view,
text,
button,
input,
textarea {
  box-sizing: border-box;
}

button {
  padding: 0;
  margin: 0;
  line-height: 1;
  background: transparent;
}

button::after {
  border: 0;
}
</style>
