<template>
  <web-view :src="iframeUrl"></web-view>
</template>

<script>
const app = getApp();
let common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      iframeUrl: ''
    };
  },
  onLoad(paramObj) {
    this.getIframeUrl(paramObj);
  },
  methods: {
    getIframeUrl(paramObj) {
      // TODO:需执行npm install jsonwebtoken后解开注释。
      var jwt;
      // var jwt = require('jsonwebtoken');
      var METABASE_SITE_URL = 'https://mb.fsgo365.cn';
      var METABASE_SECRET_KEY = '96056b90e2a3e0a2f47dbc7c349c0314e06ebb61e625e22f88487d30449c480d';

      // 从地址栏获取看板编号和传参
      let dashboard = paramObj.dashboard;
      let lockedParameters = {}; // 锁定参数 固定值
      let editableParameters = {}; // 可编辑参数 默认值
      let user = wx.getStorageSync('user');
      for (let key in paramObj) {
        // 非参数不做处理
        if (!key.startsWith('lp_') && !key.startsWith('ep_')) continue;
        // value有值转数组，无值赋值为null
        let value = paramObj[key];
        if (value.startsWith('$')) {
          // 参数值为变量时
          value = value.substring(1);
          if (value == 'optId') {
            // 获取登录人所属运营商id
            value = user.operationIds.length > 0 ? user.operationIds : null;
          } else {
            // 获取登录人user中其他字段
            value =
              user[value] || user[value] == 0
                ? Array.isArray(user[value])
                  ? user[value]
                  : [user[value]]
                : null;
          }
        } else {
          // 参数值非变量时
          value = value ? value.split(',') : null;
        }
        // 区分锁定参数(固定值)和可编辑参数(默认值)
        if (key.startsWith('lp_')) {
          lockedParameters[encodeURI(key.substring(3))] = value;
        } else if (key.startsWith('ep_')) {
          editableParameters[encodeURI(encodeURI(key.substring(3)))] = value;
        }
      }

      // 组装加密参数
      var payload = {
        resource: { dashboard: Number(dashboard) },
        params: lockedParameters,
        exp: Math.round(Date.now() / 1000) + 10 * 60 // 10 minute expiration
      };
      console.log('payload', payload);

      // 加密转token
      var token = jwt.sign(payload, METABASE_SECRET_KEY);

      // 拼接可编辑参数(默认值)
      let defaultValues = '';
      for (let key in editableParameters) {
        let value = editableParameters[key];
        if (Array.isArray(value)) {
          // 当可编辑参数(默认值)值为数组时，需要转为字符串拼接多次
          value.map(val => {
            defaultValues += `&${key}=${val}`;
          });
        } else if (value) {
          // 有值拼接，没值不传默认值
          defaultValues += `&${key}=${value}`;
        }
      }
      if (defaultValues) defaultValues = '?' + defaultValues.substring(1); // 前面拼接?并去掉第一个&

      // 拼接iframeUrl
      this.iframeUrl =
        METABASE_SITE_URL +
        '/embed/dashboard/' +
        token +
        defaultValues +
        '#bordered=false&titled=true';

      console.log('iframeUrl', this.iframeUrl);
    }
  }
};
</script>
