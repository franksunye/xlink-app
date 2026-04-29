// 生产
// var _host = 'https://www.fsgo365.cn'; // http://192.168.3.57:8080/xlink
// var _host = 'https://xlinkbeta.fsgo365.cn';
// var _host = 'https://beta.fsgo365.cn';
var _host = 'https://xlink.fsgo365.cn';
// 演示
// var _host = 'https://demo.fsgo365.cn';
// var _host = 'https://demobishui.fsgo365.cn';

// var _host = 'http://192.168.1.13:8080'; //健哥
// 开发
// var _host = 'http://dev.fsgo365.cn';

// 本地开发
// var _host = 'http://localhost:8080';

// #ifdef MP-WEIXIN
var rootUri = _host + '/fsgo/wmz/';
// var rootUri = _host + '/xlink/wmz/';
// #endif

// #ifdef H5
var rootUri = '/fsgo/';
// #endif

var linkMiniPrefix = _host + '/wmz/';

// 是否debug模式
var debug = false;

// 缓存相关key
var cacheKeys = {
  user: '_currentUser',
  settings: '_settings'
};
//管家暂无图片默认图片
var _butlerNorImg = 'https://pub.fsgo365.cn/1751394223822192042.jpg';
var osg = {
  host: _host,
  login: rootUri + 'index/login',
  app: null,
  _cthis: null,
  _param: null,
  // 新增默认管家头像
  butlerNorImg: _butlerNorImg,
  init: function (t, p, a) {
    var that = this;
    this._cthis = t;
    this._param = p;
    this.app = a;

    if (t) {
      t.evtCallListener = function (d) {
        that.evtCallListener(d);
      };
    }
  },
  // 事件机制实现
  evtCallbacks: [],

  /**
   * 注册事件监听
   * @param {Object} func
   */
  evtAddListener: function (func) {
    this.evtCallbacks.push(func);
  },

  /**
   * 调用当前界面所有事件监听回调
   * @param {Object} d
   */
  evtCallListener: function (d) {
    for (var i = 0; i < this.evtCallbacks.length; i++) this.evtCallbacks[i](d);
  },

  /**
   * 触发所有界面的事件监听
   * @param {Object} d
   */
  evtFireEvent: function (d) {
    var wvs = getCurrentPages();

    for (var i = 0; i < wvs.length; i++) {
      var wv = wvs[i];
      if (wv.evtCallListener) wv.evtCallListener(d);
    }
  },

  /**
   * 退出当前用户登陆
   */
  logout: function () {
    this.currentUserSet(null);
    this.evtFireEvent('logout');
  },

  /**
   * 获取用户设置存储
   *
   * @return {Object} 用户设置存储对象
   */
  setting: function () {
    return this.getObj(cacheKeys.settings) || {};
  },

  /**
   * 获取用户设置某个key的值
   *
   * @param {Object} key
   * @return {String} 指定key的用户设置值
   */
  settingValue: function (key) {
    return this.setting()[key];
  },

  /**
   * 设置用户设置选项
   *
   * @param {Object} key
   * @param {Object} val
   */
  settingSet: function (key, val) {
    var s = this.setting();
    s[key] = val;
    this.set(cacheKeys.settings, s);
  },

  /*
   * 删除用户设置选项
   *
   * @param {Object} key
   */
  settingRemove: function (key) {
    var s = this.setting();
    delete s[key];
    this.set(cacheKeys.settings, s);
  },

  /**
   * 获取本地持久化存储数据，Object格式
   *
   * @param {Object} key
   * @return {Object} 根据key获取持久化存储value对象格式
   */
  getObj: function (key) {
    var s = this.get(key); // if (s)
    //   s = JSON.parse(s);

    return s;
  },

  /**
   * 获取本地持久化存储数据，String格式
   *
   * @param {Object} key
   * @return {String} 根据key获取持久化存储value字符串格式
   */
  get: function (key) {
    return wx.getStorageSync(key);
  },

  /**
   * 设置本地持久化存储数据，Object类型值将转换为JSON格式字符串存储
   *
   * @param {Object} key
   * @param {Object} val
   */
  set: function (key, val) {
    if (!val) wx.removeStorageSync(key);
    else {
      wx.setStorageSync(key, val);
    }
  },

  /**
   * 当前是否已登陆
   */
  // isLogined: function () {
  //   let user = wx.getStorageSync('user');
  //   if (user && user._id) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },

  /**
   * 当前是否已登陆
   */
  isLogined: function () {
    var u = this.currentUser();
    if (u && u._id) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 静默登录
   */
  doLogin(params, callback) {
    params = params || {};
    params['appID'] = 'wx424b0548cd7c7401';
    wx.login({
      success(res) {
        params.code = res.code;
        osg.ajax('index/login', params, res => {
          // 缓存访客信息
          osg.currentUserSet(res.data.data);
          // 缓存sessionId
          wx.setStorageSync('sessionId', res.data.data.token);
          if (callback) callback(res.data.data);
        });
      },
      fail() {
        osg.doLogin();
      }
    });
  },
  /**
   * 获取当前登陆用户信息
   *
   * @return {Object}
   * @return {Object} 当前登录用户对象
   **/
  currentUser: function () {
    var u = this.getObj(cacheKeys.user);

    if (u) {
      return u.user;
    }

    return u;
  },

  /**
   * 获取当前登陆用户token信息
   *
   * @return {Object}
   * @return {Object} 当前登录用户token信息
   **/
  currentToken: function () {
    var u = this.getObj(cacheKeys.user); //_currentUser

    if (u) {
      return u.token;
    }

    return u;
  },

  /**
   * 持久化存储当前登录用户信息对象
   *
   * @param {Object} u
   */
  currentUserSet: function (u) {
    return this.set(cacheKeys.user, u);
  },

  /**
   * 网络连接api
   *
   * @param {Object} url 网络请求的url，'~'开头则保留原始url
   * @param {Object} data
   * @param {Object} callback
   * @param {Object} options
   *        -method        GET or POST
   *        -noload        是否不显示加载中
   *    -header     请求头信息数据
   */
  ajax: function (url, data, callback, options) {
    var data = data || {};
    var options = options || {};
    var noload = options.noload;

    if (!url.startsWith('~')) {
      if (url.startsWith('/')) url = url.substring(1);
      url = rootUri + url;
    } else {
      url = url.substring(1);
    }

    var method = method || 'POST';
    var dataType = 'json';
    var responseType = 'text';

    var success = callback || function () {};

    var fail = options.fail || function () {};

    var complete = options.complete || function () {};

    var header = options.header || {};
    // if (!options.header) {
    if (method == 'POST') {
      header = Object.assign(
        {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        header
      );
    } else {
      header = Object.assign(
        {
          'Content-Type': 'application/json'
        },
        header
      );
    }
    // }

    let sessionId = this.currentToken();
    if (sessionId) {
      header = Object.assign(
        {
          Cookie: 'JSESSIONID=' + sessionId
        },
        header
      );
    }

    if (!noload) this.loading();

    let _this = this;

    if (debug) {
      console.log(method + ';' + (sessionId ? 'sessionId=' + sessionId + ';' : '') + url);
      var ds = JSON.stringify(data);
      if (ds != '{}') console.log(ds);
    }

    wx.request({
      url: url,
      data: data,
      header: header,
      method: method,
      dataType: dataType,
      responseType: responseType,
      success: function (data) {
        if (data.statusCode == 200) {
          if (data.data == 'restart') {
            // 公众号需要授权
            if (!window) return;
            let urlParams = osg.getUrlParams();
            let str = '';
            str += urlParams.tenantId ? `&tenantId=${urlParams.tenantId}` : '';
            str += urlParams.wxtype ? `&wxtype=${urlParams.wxtype}` : '';
            str += '&href=' + window.location.href.split('?')[0];
            str = str.substring(1); //去掉第一个&
            let href = osg.host + '/fsgo/w/index/login?' + str;
            window.location.href = osg.host + '/fsgo/w/index/login?' + str;

            // if (url.indexOf('/index/authorize') != -1 || url.indexOf('/index/phone') != -1) {
            //   osg.alert('登录信息已过期，请重新授权登录！', () => {
            //     osg.open('../../subpackages/authorize/authorize', null, {
            //       mode: 'redirect'
            //     });
            //   });
            // } else {
            //   osg.doLogin();
            // }
          }
          if (url.substring(url.length - 5) != 'login') {
            data = data.data;
          }
          if (debug) console.log('请求返回：' + JSON.stringify(data));

          if (data && data.message && !data.success) {
            _this.alert(data.message);
          } else success(data);
        } else if (data.statusCode == 500) {
          if (_this.currentUser() && _this.currentUser().tenantId == '0') {
            _this.alert('您当前为游客身份，请先在系统中注册并维护信息！');
          } else {
            _this.alert('服务端错误！');
          }
        } else _this.alert(data.errMsg);
      },
      fail: function (res) {
        fail(res);
        console.log('请求失败：' + JSON.stringify(res));
      },
      complete: function () {
        complete();
        if (!noload) _this.unload();
      }
    });
  },

  /**
   * toast消息组件
   *
   * @param {Object} msg
   */
  toast: function (msg, icon, duration) {
    wx.showToast({
      title: msg,
      icon: icon || 'success',
      duration: duration || 2000
    });
  },

  /**
   * alert提示框组件
   *
   * @param {Object} msg
   * @param {Object} callback
   */
  alert: function (msg, callback, title) {
    wx.showModal({
      title: title || '提示',
      content: msg,
      showCancel: false,

      success(res) {
        if (res.confirm) {
          if (callback) callback();
        } else if (res.cancel) {
        }
      }
    });
  },

  /**
   * confirm确认框组件
   *
   * @param {Object} msg
   * @param {Object} callback
   */
  confirm: function (msg, callback, title) {
    wx.showModal({
      title: title || '确认',
      content: msg,

      success(res) {
        if (res.confirm) {
          if (callback) callback();
        } else if (res.cancel) {
        }
      }
    });
  },

  /**
   * 显示加载中
   *
   * @param {Object} msg
   */
  loading: function (msg) {
    if (!msg) msg = '处理中...';
    wx.showLoading({
      title: msg
    });
  },

  /**
   * 隐藏加载中
   */
  unload: function () {
    wx.hideLoading();
  },

  /**
   * 打开新窗口
   *
   * @example osg.open('regist.html');
   *
   * @param {Object} url
   * @param {Object} data 打开窗口传参
   * @param {Object} options
   *        -mode        打开窗口模式，redirect为关闭当前窗口打开新窗口，默认：navigate
   */
  open: function (url, data, options) {
    if (!options) options = {};
    var mode = options.mode || 'navigate';
    var d = '';
    if (data) {
      for (var v in data) {
        if (data[v] && String(data[v]).startsWith('http')) {
          d += encodeURI(v) + '=' + encodeURIComponent(data[v]) + '&';
        } else {
          d += encodeURI(v) + '=' + encodeURI(data[v]) + '&';
        }
      }

      if (d.endsWith('&')) d = d.substring(0, d.length - 1);

      if (url.indexOf('?') == -1) {
        url += '?';
      } else url += '&';

      url += d;
    }

    if (mode == 'navigate') {
      wx.navigateTo({
        url: url
      });
    } else if (mode == 'redirect') {
      wx.redirectTo({
        url: url
      });
    } else if (mode == 'switchTab') {
      wx.switchTab({
        url: url
      });
    } else if (mode == 'reLaunch') {
      wx.reLaunch({
        url: url
      });
    }
  },

  /**
   * 小程序扫码
   */
  scanCode(callback) {
    wx.scanCode({
      success(res) {
        if (callback) callback(res);
      },
      fail(res) {
        osg.toast('无法识别', 'none');
      }
    });
  },

  /**
   * 关闭窗口
   */
  closeMe: function (d) {
    if (!d) d = 1;
    wx.navigateBack({
      delta: d
    });
  },

  /**
   * 获取传入页面参数
   *
   * @param {Object} key
   */
  param: function (key) {
    var data = this._param;
    if (data) return data[key];
    else return null;
  },

  /**
   * 获取小程序链接传入参数
   *
   * @param {Object} name
   */
  getQueryString: function (name) {
    var p = this._param;

    if (p && p.q) {
      const url = decodeURIComponent(p.q);
      var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
      var r = url.substr(1).match(reg);

      if (r != null) {
        return r[2];
      }
    }

    return null;
  },

  /**
   * 生成普通链接打开小程序
   *
   * @param {Object} data 链接参数
   */
  generateLinkMini(data) {
    var url = linkMiniPrefix + '?';
    var d = '';

    if (data) {
      for (var v in data) {
        d += encodeURI(v) + '=' + encodeURI(data[v]) + '&';
      }
    }

    if (d.endsWith('&')) d = d.substring(0, d.length - 1);
    return url + d;
  },

  /**
   * codecfg代码表组件，根据data中options内codecfg_开头的代码表组件配置进行批量初始化
   *
   * @param {*} callback 代码表组件初始化之后的回调，比如进行表格数据的加载和利用formater进行代码表数据转换展现
   */
  codeoption: async function (callback) {
    var $this = osg._cthis;
    var opts = $this.options;
    if (opts) {
      var cfgArr = [];
      var cascadeTypes = []; //级联的代码类型
      for (var o in opts) {
        if (o.startsWith('codecfg_')) {
          var cfg = opts[o];
          cfg['eleid'] = o.substring(8);
          cfgArr.push(cfg);
        }
        //组合级联代码类型
        if (o.startsWith('cascadeCode_')) {
          let type = o.substring(12);
          cascadeTypes.push(type);
        }
      }
      await new Promise(resolve => {
        if (cfgArr.length > 0) {
          let params = JSON.stringify(cfgArr);
          let url = 'i/code/selectCode.do.do';
          // #ifdef H5
          url = `~${osg.host}/fsgo/i/code/selectCode.do.do`;
          // #endif
          this.ajax(
            url,
            {
              jsonPara: params,
              tenantId:
                (osg.getObj('_currentUser') && osg.getObj('_currentUser').user.tenantId) ||
                '1340835581184723420'
            },
            res => {
              if (res) {
                // res = JSON.parse(res);
                for (var i = 0; i < res.length; i++) {
                  var opts = res[i],
                    os = opts.options;
                  var osArr = [];

                  for (var opt in os) {
                    osArr.push({
                      name: os[opt],
                      value: opt
                    });
                  }
                  $this.options[opts.eleid] = osArr;
                }
                resolve();
                // if (callback) callback();
              }
            },
            {
              noload: true
            }
          );
        } else {
          resolve();
        }
      });
      await new Promise(resolve => {
        //查询级联代码表数据
        if (cascadeTypes.length > 0) {
          let url = 'i/code/selectMultistageCode.do';
          // #ifdef H5
          url = `~${osg.host}/fsgo/i/code/selectMultistageCode.do`;
          // #endif
          this.ajax(
            url,
            {
              types: cascadeTypes.join(),
              tenantId:
                (osg.getObj('_currentUser') && osg.getObj('_currentUser').user.tenantId) ||
                '1340835581184723420'
            },
            res => {
              if (res) {
                res.map(item => {
                  $this.options[item.type] = item.children;
                });
              }
              resolve();
            },
            {
              noload: true
            }
          );
        } else {
          resolve();
        }
      });
      if (callback) callback();
    }
  },

  /**
   * 代码表组件，将代码表value转换为label，比如用于表格formatter进行数据列值的代码表转换
   *
   * @param {*} codeType 代码表类型，data中options中代码表key，也可以是是codecfg_组件生成(需在codeoptions初始化之后)
   * @param {*} codeValue 需要转换为名称的的代码表值
   */
  codelabel: function (codeType, codeValue, opts) {
    var $this = osg._cthis;
    var opts = opts || $this.options[codeType];
    opts = osg.cascadeFlat(opts);
    if (opts) {
      if (opts.constructor != Array) return;
      for (var i = 0; i < opts.length; i++) {
        if (codeValue == opts[i].value) return opts[i].name;
      }
    }

    if (!codeValue) {
      return codeValue;
    } else {
      return '未知';
    }
  },
  //value为数组、opt.value为字符串
  codelabelForArray: function (codeType, codeValue, opts) {
    var $this = osg._cthis;
    if (!$this || !$this.options || !codeType || !codeValue) {
      return;
    }
    var opts = $this.options[codeType] || $this.options[codeType.toLowerCase()]; // 避免有些字典表codeType是大写,预置没有
    if (opts && codeValue) {
      if (opts.constructor != Array) return;
      var str = '';
      for (var i = 0; i < opts.length; i++) {
        for (var j = 0; j < codeValue.length; j++) {
          if (codeValue[j] == opts[i].value) str += opts[i].label + '、';
        }
      }
      str = str.substring(0, str.length - 1);
      return str;
    }
    if (!codeValue) {
      return codeValue;
    } else {
      return '未知';
    }
  },
  // 返显单选级联
  codelabelCascade(option, arr) {
    if (arr && arr.length > 0) {
      if (osg.isJson(arr)) {
        arr = JSON.parse(arr);
      }
      var $this = osg._cthis;
      let str = '';
      let opts = osg.deepCopy($this.options[option]);
      if (!opts) return;
      if (opts.constructor != Array) return;
      // 单选级联 有几级循环几次
      for (var i = 0; i < arr.length; i++) {
        for (var opt of opts) {
          if (opt.value == arr[i]) {
            str += (opt.label || opt.name) + ' / ';
            opts = osg.deepCopy(opt.children);
            break;
          }
        }
      }
      return str.slice(0, str.length - 2);
    }
  },
  // 返显多选级联
  codelabelCascadeMultiple(option, array) {
    if (!array) {
      return;
    }
    if (osg.isJson(array)) {
      array = JSON.parse(array);
    }
    var $this = osg._cthis;
    let string = '';
    // 多选级联 有几个循环几次
    for (let arr of array) {
      let str = '';
      let opts = osg.deepCopy($this.options[option]);
      if (!opts) return;
      if (opts.constructor != Array) return;
      //有几级循环几次
      for (let i = 0; i < arr.length; i++) {
        for (let opt of opts) {
          if (opt.value == arr[i]) {
            str += (opt.label || opt.name) + ' / ';
            opts = osg.deepCopy(opt.children);
            break;
          }
        }
      }
      string += str.slice(0, str.length - 2) + '、';
    }
    return string.slice(0, string.length - 1);
  },
  /**
   * 扁平化带有children的数组
   *
   */
  cascadeFlat: function (source) {
    if (Array.isArray(source)) {
      let flatArr = [];

      function fn(source) {
        source.forEach(el => {
          flatArr.push(el);
          if (el.children && el.children.length > 0) fn(el.children);
        });
      }
      fn(source);
      return flatArr;
    } else {
      return source;
    }
  },
  /**
   * 渲染单选级联
   *
   */
  formatCascade(option, arr) {
    if (arr && arr.length > 0) {
      if (osg.isJson(arr)) {
        arr = JSON.parse(arr);
      }
      var $this = osg._cthis;
      let str = '';
      let opts = osg.deepCopy($this.options[option]);
      if (!opts) return;
      // 单选级联 有几级循环几次
      for (var i = 0; i < arr.length; i++) {
        for (var opt of opts) {
          if (opt.value == arr[i]) {
            str += (opt.label || opt.name) + ' / ';
            opts = osg.deepCopy(opt.children);
            break;
          }
        }
      }
      return str.slice(0, str.length - 2);
    }
  },
  /**
   * 数组对象深拷贝
   *
   */
  deepCopy: function (data) {
    let o = {
      run: function (val) {
        let result = '';

        if (val instanceof Array) {
          result = this.copyArr(val);
        } else {
          result = this.copyObj(val);
        }

        return result;
      },
      copyArr: function (arr) {
        var arr_temp = [];

        if (arr) {
          for (let i = 0, j = arr.length; i < j; i++) {
            if (arr[i] instanceof Array) {
              arr_temp[i] = this.copyArr(arr[i]);
            } else if (arr[i] instanceof Object) {
              arr_temp[i] = this.copyObj(arr[i]);
            } else arr_temp[i] = arr[i];
          }
        }

        return arr_temp;
      },
      copyObj: function (obj) {
        let obj_temp = {};

        for (let key in obj) {
          if (obj[key] instanceof Array) {
            obj_temp[key] = this.copyArr(obj[key]);
          } else if (obj[key] instanceof Object) {
            obj_temp[key] = this.copyObj(obj[key]);
          } else obj_temp[key] = obj[key];
        }

        return obj_temp;
      }
    };
    return o.run(data);
  },

  /**
   * 判断字符串是否为json格式
   *
   */
  isJson: function ($string) {
    try {
      if (typeof JSON.parse($string) == 'object') return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * 获取登录用户小程序地理位置
   */
  location(callback) {
    // 获取地理位置
    wx.getLocation({
      // 获取地理位置成功
      success(res) {
        if (callback) callback(res);
      },
      // 获取地理位置失败
      fail() {}
    });
  },
  getLocation: function (callback, fail) {
    wx.authorize({
      scope: 'scope.userLocation',
      // 授权-获取地理位置
      success() {
        // 获取地理位置
        osg.location(callback);
      },
      // 拒绝-获取地理位置
      fail() {
        // 获取用户当前设置
        wx.getSetting({
          // 获取用户当前设置-成功
          success(res) {
            // 没有授权-则请求设置
            if (!res.authSetting['scope.userLocation']) {
              // 提示需求授权
              wx.showModal({
                title: '请求授权当前位置',
                content: '需要获取你的地理位置来查询附近门店',
                // 确认-打开设置
                success: function (result) {
                  if (result.confirm) {
                    // 打开设置(不管是否授权，返回后都会执行onShow)
                    wx.openSetting({
                      success(res) {
                        wx.getSetting({
                          success() {
                            if (!res.authSetting['scope.userLocation']) {
                              if (fail) fail();
                            } else {
                              osg.location(callback);
                            }
                          }
                        });
                      }
                    });
                  } else {
                    // 取消打开设置
                    if (fail) fail();
                  }
                }
              });
            } else {
              // 已经授权-则直接获取地理位置
              osg.location(callback);
            }
          }
        });
      }
    });
  },
  // 使用微信内置地图查看位置
  openLocation(latitude, longitude, scale, name, address, success, fail) {
    wx.openLocation({
      latitude,
      longitude,
      scale: scale || 18,
      name,
      address,
      success(res) {
        if (success) success(res);
      },
      fail(res) {
        if (fail) {
          fail(res);
        } else {
          osg.toast('定位失败，请稍后重试。');
        }
      }
    });
  },
  /**
   * 逆地理编码
   * @param {*} location 传入内容规则：经度在前，纬度在后，经纬度间以“,”分割，经纬度小数点后不要超过 6 位。如果需要解析多个经纬度的话，请用"|"进行间隔，并且将 batch 参数设置为 true，最多支持传入 20 对坐标点。每对点坐标之间用"|"分割。
   */
  regeo(location, callback) {
    if (!location || location.indexOf(',') == -1) return;
    osg.ajax(
      '~https://restapi.amap.com/v3/geocode/regeo?parameters',
      {
        key: '222af85515a49668992817ba7d564425',
        location
      },
      res => {
        if (res.status == '1') {
          if (callback) callback(res.regeocode);
        } else {
          osg.toast(res.info);
          return;
        }
      },
      {
        noload: true
      }
    );
  },
  /**
   * 保存登录用户信息
   *
   */
  upsertUser(user) {
    user['gpsPoint.longitude'] = user.gpsPoint.longitude;
    user['gpsPoint.latitude'] = user.gpsPoint.latitude;
    delete user.gpsPoint;
    osg.ajax('user/upsert', user, res => {}, {
      noload: true
    });
  },

  /**
   * 加密
   *
   */
  Base64: {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    encode: function (input) {
      var output = '';
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = this._utf8_encode(input);
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output =
          output +
          this._keyStr.charAt(enc1) +
          this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) +
          this._keyStr.charAt(enc4);
      }
      return output;
    },
    decode: function (input) {
      var output = '';
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9+/=]/g, '');
      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = this._utf8_decode(output);
      return output;
    },
    _utf8_encode: function (string) {
      string = string.replace(/\r\n/g, '\n');
      var utftext = '';
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    },
    _utf8_decode: function (utftext) {
      var string = '';
      var i = 0;
      var c,
        c2,
        c3 = 0;
      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    },
    //上传图片文件转base64
    imgFile: function (file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = '';
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    }
  },
  cookieRelative: {
    basic: 'Basic',
    authorization: 'Authorization',
    token: 'X-Auth-Token',
    token_encode: 'X-Auth-Token-Encode',
    userid: 'X-Userid',
    username: 'X-Username',
    userpwd: 'X-Password',
    userrole: 'role',
    tokenTime: '_tokenTime',
    internal: 'message',
    referrer: 'referrer',
    quitsecond: 3000,
    tokenExpires: 1200000,
    pending_confirm: 15,
    pending_kypay_confirmed: 23
  },
  cookie: {
    set: function (key, value, expires) {
      var date = new Date(),
        s = location.protocol === 'https:' ? '; secure' : '',
        day = /^[1-9]([0-9]+)?d$/.test(expires),
        hour = /^[1-9]([0-9]+)?h$/.test(expires),
        second = /^[1-9]([0-9]+)?s$/.test(expires);
      if (!expires || !(day || hour || second)) {
        expires = '';
      } else {
        expires = parseInt(expires.substr(0, expires.length - 1), 10);
        if (day) {
          date.setDate(date.getDate() + expires);
        } else if (hour) {
          date.setHours(date.getHours() + expires);
        } else if (second) {
          date.setSeconds(date.getSeconds() + expires);
        }
        expires = '; expires=' + date.toGMTString();
      }
      return (document.cookie = [
        key,
        '=',
        !value ? '' : encodeURIComponent(value.toString()),
        expires,
        '; path=/',
        '; domain=' + document.domain,
        s
      ].join(''));
    },
    get: function (key) {
      var value = [];
      return new RegExp('(?:^|; )' + key + '=([^;]*)').exec(document.cookie) ? value[1] : null;
    },
    deleteCookie: function (key) {
      if (!key) {
        return false;
      }
      var val = this.get(key);
      if (val != null) this.set(key, val, -1);
      window.location.href = '/';
    }
  },
  token: {
    quit: function () {
      util.cookie.deleteCookie(util.cookieRelative.token);
      // util.cookie.deleteCookie(cookieRelative.token_encode);
      // util.cookie.deleteCookie(cookieRelative.userid);
      // util.cookie.deleteCookie(cookieRelative.username);
      // util.cookie.deleteCookie(cookieRelative.userpwd);
      // util.cookie.deleteCookie(cookieRelative.userrole);
    }
  },
  /**
   * 七牛云存储
   */
  //七牛云下载地址
  downloadUrl: 'https://pub.fsgo365.cn/',
  afterRead(event, that) {
    const { file } = event.detail;
    //判断是否为数组，是则循环上传
    if (Array.isArray(file)) {
      for (let item of file) {
        osg.fileUpToken(that, event, item.path);
      }
    } else {
      osg.fileUpToken(that, event, file.path);
    }
  },
  //上传
  fileUpToken(that, event, filePath) {
    osg.ajax(
      'back/super/file/upToken.do',
      {
        fileName: '12345.jpg'
      },
      data => {
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://up-z1.qiniup.com',
          filePath,
          name: 'file',
          formData: data,
          success: res => {
            console.log(data, event, filePath);
            that.formData[event.target.dataset.field.name] =
              that.formData[event.target.dataset.field.name] || [];
            that.formData[event.target.dataset.field.name].push({
              url: osg.downloadUrl + JSON.parse(res.data).key
            });
            that.$forceUpdate();
          }
        });
      },
      {
        noload: true
      }
    );
  },
  /**
   * 限制重复点击
   */
  clickTime: {},
  isRepeatClick(btn) {
    let clickTime = new Date().getTime();
    if (osg.clickTime[btn]) {
      if (clickTime - osg.clickTime[btn] < 3000) {
        osg.toast('操作过于频繁', 'none');
        return true;
      } else {
        osg.clickTime[btn] = clickTime;
        return false;
      }
    } else {
      osg.clickTime[btn] = clickTime;
      return false;
    }
  },
  /**
   * 图片预览、查看文件
   */
  download: function (e) {
    var fileName = e.currentTarget.dataset.filename;
    var fileType = fileName.split('.')[1];
    var filePath = fileName;
    if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif') {
      //图片预览
      wx.previewImage({
        current: filePath, // 当前显示图片的http链接
        urls: [filePath] // 需要预览的图片http链接列表
      });
    } else {
      //文件下载
      wx.downloadFile({
        url: filePath,
        success: function (res) {
          let filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) {
              console.log(res);
            }
          });
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    }
  },
  /**
   * 订阅
   * tmplIds：需要订阅的消息模板的id的集合，一次调用最多可订阅3条消息（注意：iOS客户端7.0.6版本、Android客户端7.0.7版本之后的一次性订阅/长期订阅才支持多个模板消息，iOS客户端7.0.5版本、Android客户端7.0.6版本之前的一次订阅只支持一个模板消息）消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置
   */
  subscribeMessage(tmplIds) {
    // 获取用户当前设置
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log(res.subscriptionsSetting);
        // 选了不在询问
        if (res.subscriptionsSetting.itemSettings) {
          let acceptAll = true;
          for (var tmplId of tmplIds) {
            if (res.subscriptionsSetting.itemSettings[tmplId] != 'accept') {
              acceptAll = false;
              break;
            }
          }
          // 有未订阅的消息
          if (!acceptAll) {
            wx.showModal({
              title: '消息订阅',
              content: '您有消息未订阅',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    withSubscriptions: true,
                    success() {},
                    fail() {}
                  });
                }
              }
            });
          } else {
            // 全部订阅了
            osg.toast('订阅成功');
          }
        } else {
          // 没有选择不再询问
          wx.requestSubscribeMessage({
            tmplIds,
            success(res) {
              console.log(res);
            }
          });
        }
      }
    });
  },
  /**
   * 时间转换
   */
  formatTime(dateValue) {
    let value = dateValue;
    if (typeof dateValue == 'object') {
      value == value.valueOf();
    }

    function zeroFill(num) {
      return num < 10 ? '0' + num : num;
    }

    let date = dateValue ? new Date(dateValue) : new Date();
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return Y + M + zeroFill(D) + ' ' + zeroFill(h) + ':' + zeroFill(m) + ':' + zeroFill(s);
  },
  /**
   * 获取url参数
   */
  getUrlParams(href) {
    let urlParams = {};
    if (href || (window && window.location && window.location.href)) {
      let href = href || window.location.href;
      if (href.indexOf('?') != -1) {
        let string = href.split('?')[1];
        if (string) {
          let array = string.split('&');
          for (let str of array) {
            if (str.indexOf('=') != -1) {
              urlParams[str.split('=')[0]] = str.split('=')[1];
            }
          }
        }
      }
    }
    delete urlParams[1];
    return urlParams;
  },
  /**
   * 查询区下级街道
   */
  getSubdistricts(arr, callback) {
    if (arr && arr.length >= 3) {
      osg.ajax(
        'area/query.do',
        {
          _all: '1',
          notFilterOrgId: '1',
          notFilterTenantId: '1',
          parentCode: arr[2],
          level: '4',
          sortField: 'code',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.value = item.code;
            item.label = item.name;
            item.leaf = true;
          });
          if (callback) {
            callback(res.data);
          }
        },
        {
          noload: true
        }
      );
    } else {
      if (callback) {
        callback([]);
      }
    }
  }
};
module.exports.osg = osg;
