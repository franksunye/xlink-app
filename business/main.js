import Vue from 'vue';
import App from './App';
import FloatingBall from './components/FloatingBall/FloatingBall.vue';
import store from './Vuex/index.js';
Vue.config.productionTip = false;
Vue.component('FloatingBall', FloatingBall);
// 引入 Vant Weapp 的 Dialog 组件
import Dialog from './wxcomponents/vant/dialog/dialog';

import VueCompositionAPI from '@vue/composition-api';
Vue.use(VueCompositionAPI);

Vue.config.productionTip = false;

// 将 Dialog 组件挂载到 Vue 原型上
Vue.prototype.$dialog = Dialog;

Vue.mixin({
  methods: {
    setData: function (obj, callback) {
      let that = this;
      let keys = [];
      let val, data;
      Object.keys(obj).forEach(function (key) {
        keys = key.split('.');
        val = obj[key];
        data = that.$data;
        keys.forEach(function (key2, index) {
          if (index + 1 == keys.length) {
            that.$set(data, key2, val);
          } else {
            if (!data[key2]) {
              that.$set(data, key2, {});
            }
          }
          data = data[key2];
        });
      });
      callback && callback();
    }
  }
});

import globalMixin from './resources/mixins/globalMixin.js';
Vue.mixin(globalMixin);

App.mpType = 'app';

const app = new Vue({
  ...App,
  store
});
app.$mount();
