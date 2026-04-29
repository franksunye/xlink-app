var _host = 'https://xlinkbeta.fsgo365.cn';
// var _host = 'https://xlink.fsgo365.cn';
// var _host = 'http://localhost:8080';
// var _host = 'http://192.168.1.3:8081'; // wgd
// var _host = 'http://192.168.1.10:8080'; // zj

// #ifdef MP-WEIXIN
var rootUri = _host + '/fsgo/';
// var rootUri = _host + '/xlink/wmt/';
// #endif

// #ifdef H5
var rootUri = '/fsgo/';
// #endif

var linkMiniPrefix = _host + '/wmt/';

// 是否debug模式
var debug = false;

var osg = {
  host: _host,
  login: rootUri + 'index/login',
  app: null,
  _cthis: null,
  _param: null,
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

  /**
   * 当前是否已登陆
   */
  isLogined: function () {
    let user = wx.getStorageSync('user');
    if (user && user.user._id) {
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
    params['appID'] = 'wx8501876977010e44';
    params['tenantId'] = '1340835581184723420';
    wx.login({
      success(res) {
        params.code = res.code;
        osg.ajax('wmt/index/login', params, res => {
          // 缓存访客信息
          wx.setStorageSync('user', res.data.data);
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
    var options = options || {};
    var method = options.method,
      noload = options.noload;
    var data = data || {};

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
    var failCallback = options.failCallback || function () {};
    var error = options.error || function () {};

    var complete = options.complete || function () {};

    var header = options.header || {};
    if (!options.header) {
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
    }

    let sessionId = wx.getStorageSync('sessionId');

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
            if (failCallback) failCallback();
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
    // wx.request({
    //   url: url,
    //   data: data,
    //   header: header,
    //   method: method,
    //   dataType: dataType,
    //   responseType: responseType,
    //   success: function (data) {
    //     if (data.statusCode == 200) {
    //       if (data.data == 'restart') {
    //         wx.removeStorageSync('sessionId');
    //         wx.removeStorageSync('user');
    //         wx.removeStorageSync('currentRole');
    //         wx.removeStorageSync('currentRoleFunctions');
    //         wx.removeStorageSync('menu');
    //         wx.removeStorageSync('address');
    //         let pages = getCurrentPages();
    //         if (pages[pages.length - 1].route != 'subpackages/login/loginAuth') {
    //           osg.alert('登录信息已过期，请重新登录！', () => {
    //             osg.open('/subpackages/login/loginAuth');
    //           });
    //           return;
    //         }
    //       }
    //       if (data.data == 9001) {
    //         osg.alert('用户已锁定无法登陆请与管理员联系！');
    //         return;
    //       }
    //       if (url.substring(url.length - 5) != 'login') {
    //         data = data.data;
    //       }
    //       if (debug) console.log('请求返回：' + JSON.stringify(data));
    //       if (data && data.message && !data.success) {
    //         // 解绑中继号
    //         if (data.data && data.data.event == 'WinnerLookBusy') {
    //           osg.confirm(
    //             data.message,
    //             () => {
    //               osg.unBindPrivateNumber();
    //             },
    //             '提示',
    //             '解绑'
    //           );
    //         } else {
    //           _this.alert(data.message, error);
    //         }
    //       } else success(data);
    //     } else if (data.statusCode == 500) {
    //       if (wx.getStorageSync('user') && wx.getStorageSync('user').tenantId == '0') {
    //         _this.alert('您当前为游客身份，请先在系统中注册并维护信息！');
    //       } else {
    //         _this.alert('服务端错误！');
    //       }
    //     } else _this.alert(data.errMsg);
    //   },
    //   fail: function (res) {
    //     fail(res);
    //     console.log('请求失败：' + JSON.stringify(res));
    //   },
    //   complete: function () {
    //     complete();
    //     if (!noload) _this.unload();
    //   }
    // });
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
  alert: function (msg, callback) {
    wx.showModal({
      title: '提示',
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
  confirm: function (msg, callback, title, confirmText, showCancel, cancelText) {
    wx.showModal({
      title: title || '确认',
      content: msg,
      confirmText: confirmText || '确认',
      showCancel: showCancel == 'hide' ? false : true,
      cancelText: cancelText || '取消',
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
    var mode = options.mode || 'navigateTo';
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

    if (mode == 'navigateTo') {
      wx.navigateTo({
        url: url
      });
    } else if (mode == 'redirectTo') {
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
          this.ajax(
            'i/code/selectCode.do',
            {
              jsonPara: params,
              tenantId: '1340835581184723420'
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
          this.ajax(
            'i/code/selectMultistageCode.do',
            {
              types: cascadeTypes.join(),
              tenantId: wx.getStorageSync('user').user.tenantId
            },
            res => {
              if (res) {
                res.map(item => {
                  // 删除children为空数组的key，否则vant级联组件最后一级始终显示“请选择”
                  function deleteEmptyChildren(obj) {
                    if (obj.children.length == 0) {
                      delete obj.children;
                    } else {
                      obj.children.map(child => {
                        deleteEmptyChildren(child);
                      });
                    }
                  }
                  item.children.map(child => {
                    deleteEmptyChildren(child);
                  });

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
    } else {
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
    if (!$this) return;
    var opts = opts || $this.options[codeType];
    opts = osg.cascadeFlat(opts);
    if (opts) {
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
  /**
   * 返显值为数组的字典
   */
  codelabelForArray: function (codeType, codeValue) {
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
          if (codeValue[j] == opts[i].value) str += opts[i].name + '、';
        }
      }
      str = str.substring(0, str.length - 1);
      return str;
    }
    if (!codeValue) {
      return codeValue || '';
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
      let opts = $this.options && osg.deepCopy($this.options[option]);
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
      if (!opts && isEmptyObject(opts)) return;
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
  //是否为空对象
  isEmptyObject(obj) {
    for (var key in obj) {
      //返回false，不为空对象
      return false;
    }
    return true; //返回true，为空对象
  },
  // 返显多选级联
  formatCascadeMultiple(option, array) {
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
   * 解绑中继号
   */
  unBindPrivateNumber() {
    osg.ajax('/basic/winnerlook/handleMiddleNumberSelfUnBind');
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
      common.osg.cookie.deleteCookie(common.osg.cookieRelative.token);
      // common.osg.cookie.deleteCookie(cookieRelative.token_encode);
      // common.osg.cookie.deleteCookie(cookieRelative.userid);
      // common.osg.cookie.deleteCookie(cookieRelative.username);
      // common.osg.cookie.deleteCookie(cookieRelative.userpwd);
      // common.osg.cookie.deleteCookie(cookieRelative.userrole);
    }
  },
  /**
   * 七牛云存储
   */
  //七牛云下载地址
  downloadUrl: 'https://pub.fsgo365.cn/',
  afterRead(event, that, longitude, latitude, callback) {
    const { file } = event.detail;
    //判断是否为数组，是则循环上传
    if (Array.isArray(file)) {
      for (let item of file) {
        osg.fileUpToken(
          that,
          event,
          item.path,
          longitude,
          latitude,
          event.detail.capture,
          callback,
          item
        );
      }
    } else {
      osg.fileUpToken(
        that,
        event,
        file.path,
        longitude,
        latitude,
        event.detail.capture,
        callback,
        item
      );
    }
  },
  //上传
  fileUpToken(that, event, filePath, longitude, latitude, capture, callback, currentFile) {
    if (
      event.detail.file.url ||
      event.detail.file.path ||
      event.detail.file.tempFilePath ||
      event.detail.file.name
    ) {
      if (event.detail.file.url) {
        var strs = event.detail.file.url.split('.');
      } else if (event.detail.file.path) {
        var strs = event.detail.file.path.split('.');
      } else if (event.detail.file.tempFilePath) {
        var strs = event.detail.file.tempFilePath.split('.');
      } else {
        var strs = event.detail.file.name.split('.');
      }
    } else {
      var strs = event.detail.file[0] && event.detail.file[0].url.split('.');
    }
    let suffix = strs[strs.length - 1];
    osg.ajax(
      'back/super/file/upToken.do',
      {
        fileName: '12345.' + suffix
      },
      data => {
        filePath = Array.isArray(event.detail.file)
          ? currentFile.thumb || currentFile.url || currentFile.path
          : filePath ||
            event.detail.file.thumb ||
            event.detail.file.path ||
            event.detail.file.tempFilePath;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://up-z1.qiniup.com',
          filePath,
          name: 'file',
          formData: data,
          success: res => {
            if (capture) {
              if ('album' == capture[0]) {
                that.formData[event.target.dataset.field] =
                  that.formData[event.target.dataset.field] || [];
                that.formData[event.target.dataset.field].push({
                  url: osg.downloadUrl + JSON.parse(res.data).key
                });
                if (callback)
                  callback({
                    url: osg.downloadUrl + JSON.parse(res.data).key
                  });
                osg.toast('上传成功');
                that.$forceUpdate();
              }
              if ('camera' == capture[0]) {
                // 解析经纬度
                let qiniuImagePath = osg.downloadUrl + JSON.parse(res.data).key;
                console.log('qiniuImagePath:===' + qiniuImagePath);
                // 1.3 将获取到的 经纬度传值给 getAddress 解析出 具体的地址.
                osg.ajax(
                  '/biz/image/uploadAddLogo.do',
                  {
                    qiniuImagePath: qiniuImagePath,
                    address: res,
                    latitude: latitude,
                    longitude: longitude
                  },
                  res => {
                    console.log('res.field:===' + res.field);
                    that.formData[event.target.dataset.field] =
                      that.formData[event.target.dataset.field] || [];
                    that.formData[event.target.dataset.field].push({
                      url: osg.downloadUrl + res.field
                    });
                    console.log('that.formData:===' + that.formData.url);
                    if (callback)
                      callback({
                        url: osg.downloadUrl + res.field
                      });
                    osg.toast('上传成功');
                    that.$forceUpdate();
                  }
                );
              }
            } else {
              that.formData[event.target.dataset.field] =
                that.formData[event.target.dataset.field] || [];
              that.formData[event.target.dataset.field].push({
                url: osg.downloadUrl + JSON.parse(res.data).key,
                name: JSON.parse(res.data).key
              });
              if (callback)
                callback({
                  url: osg.downloadUrl + JSON.parse(res.data).key,
                  name: JSON.parse(res.data).key
                });
              that.$forceUpdate();
            }
          }
        });
      },
      {
        noload: true
      }
    );
  },
  /**
   * 向系统日历添加事件
   */
  addPhoneCalendar(callback) {
    wx.getSetting({
      success(res) {
        console.log('wx.getSetting:success');
        // 判断是否已经授权
        if (!res.authSetting['scope.addPhoneCalendar']) {
          console.log('小程序内authSetting:未授权');
          // 授权
          wx.authorize({
            scope: 'scope.addPhoneCalendar',
            success() {
              console.log('wx.authorize:success');
              // 用户已授权
              wx.addPhoneCalendar({
                title: '服务商沟通会', // 日程标题，必填项
                startTime: new Date('2023/07/25 15:00').getTime() / 1000, // 日程开始时间，必填项
                endTime: new Date('2023/07/25 17:00').getTime() / 1000, // 日程结束时间，必填项
                location: '北京市朝阳区日坛国际贸易中心A座801', // 日程地点，非必填项
                notes: '请大家准时参加会议', // 日程备注，非必填项
                success(res) {
                  console.log('addPhoneCalendar:success');
                  console.log(res); // 日程添加成功的回调函数
                  if (callback) callback();
                },
                fail(res) {
                  console.log('addPhoneCalendar:fail');
                  console.log(res); // 日程添加失败的回调函数
                  osg.alert('请打开手机“设置-隐私-日历”中允许微信使用日历');
                }
              });
            },
            fail() {
              console.log('wx.authorize:fail');
              // 提示需求授权
              wx.showModal({
                title: '授权',
                content: '需要授权微信向系统日历添加日程',
                success(result) {
                  if (result.confirm) {
                    console.log('允许openSetting');
                    wx.openSetting({
                      success(res) {
                        wx.getSetting({
                          success() {
                            if (!res.authSetting['scope.addPhoneCalendar']) {
                              console.log('openSetting后仍未授权');
                            } else {
                              console.log('openSetting后已授权');
                              // 不能直接调用wx.addPhoneCalendar，只能通过用户手动操作触发
                            }
                          }
                        });
                      }
                    });
                  } else {
                    console.log('拒绝openSetting');
                  }
                }
              });
            }
          });
        } else {
          console.log('小程序内authSetting:已授权');
          // 已经授权，调用添加日程 API
          wx.addPhoneCalendar({
            title: '服务商沟通会', // 日程标题，必填项
            startTime: new Date('2023/07/25 15:00').getTime() / 1000, // 日程开始时间，必填项
            endTime: new Date('2023/07/25 17:00').getTime() / 1000, // 日程结束时间，必填项
            location: '北京市朝阳区日坛国际贸易中心A座801', // 日程地点，非必填项
            notes: '请大家准时参加会议', // 日程备注，非必填项
            success(res) {
              console.log('addPhoneCalendar:success');
              console.log(res); // 日程添加成功的回调函数
              if (callback) callback();
            },
            fail(res) {
              console.log('addPhoneCalendar:fail');
              console.log(res); // 日程添加失败的回调函数
              osg.alert('请打开手机“设置-隐私-日历”中允许微信使用日历');
            }
          });
        }
      }
    });
  },
  /**
   * 获取登录用户小程序地理位置
   */
  location(callback, setting) {
    // 获取地理位置
    wx.getLocation({
      isHighAccuracy: (setting && setting.isHighAccuracy) || false,
      highAccuracyExpireTime: (setting && setting.isHighhighAccuracyExpireTimeAccuracy) || 4000,
      // 获取地理位置成功
      success(res) {
        if (callback) callback(res);
      },
      // 获取地理位置失败
      fail() {}
    });
  },
  getLocation: function (callback, fail, setting) {
    let that = this;
    wx.authorize({
      scope: 'scope.userLocation',
      // 授权-获取地理位置
      success() {
        // 获取地理位置
        that.location(callback, setting);
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
                content: '需要获取你的地理位置来查询附近门店或工人',
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
                              that.location(callback, setting);
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
              that.location(callback, setting);
            }
          }
        });
      }
    });
  },
  // 开启实时地理位置监听
  startLocationUpdateBackground(callback, fail, setting) {
    let that = this;
    wx.authorize({
      scope: 'scope.userLocationBackground',
      success() {
        console.log('authorize-success');
        wx.startLocationUpdateBackground({
          success() {
            if (callback) callback();
          },
          fail(err) {
            console.log(err);
          }
        });
      },
      // 拒绝-获取地理位置
      fail() {
        console.log('authorize-fail');
        // 获取用户当前设置
        wx.getSetting({
          // 获取用户当前设置-成功
          success(res) {
            // 没有授权-则请求设置
            if (!res.authSetting['scope.userLocationBackground']) {
              // 提示需求授权
              wx.showModal({
                title: '请求授权后台实时监听地理位置',
                content: '将用于记录您的上下班打卡',
                // 确认-打开设置
                success: function (result) {
                  if (result.confirm) {
                    // 打开设置(不管是否授权，返回后都会执行onShow)
                    wx.openSetting({
                      success(res) {
                        wx.getSetting({
                          success() {
                            if (!res.authSetting['scope.userLocationBackground']) {
                              if (fail) fail();
                            } else {
                              wx.startLocationUpdateBackground({
                                success() {
                                  if (callback) callback();
                                },
                                fail(err) {
                                  console.log(err);
                                }
                              });
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
              wx.startLocationUpdateBackground({
                success() {
                  if (callback) callback();
                },
                fail(err) {
                  console.log(err);
                }
              });
            }
          }
        });
      }
    });
  },
  // 判断手机定位是否开启
  checkGPS() {
    wx.getSystemInfo({
      success: res => {
        if (!res.locationEnabled) {
          wx.showModal({
            title: '提示',
            content: '请先开启手机GPS定位',
            showCancel: false
          });
          return;
        }
      }
    });
  },
  /**
   * 地理编码
   */
  geo(address, callback, city) {
    osg.ajax(
      '~https://restapi.amap.com/v3/geocode/geo?parameters',
      {
        key: '222af85515a49668992817ba7d564425',
        address,
        city
      },
      res => {
        if (res.status) {
          if (callback) callback(res.geocodes && res.geocodes[0]);
        } else {
          osg.toast('请补充地址信息', 'error');
          return;
        }
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
  isRepeatClick(btn, duration, msg) {
    duration = duration || 5000;
    let clickTime = new Date().getTime();
    if (osg.clickTime[btn]) {
      if (clickTime - osg.clickTime[btn] < duration) {
        osg.toast(msg || '操作过于频繁', 'none');
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
  //返回可读时间
  readableTime(val, type) {
    let date = val ? new Date(val) : new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let dateStr =
      year +
      '-' +
      osg.fillZero(month) +
      '-' +
      osg.fillZero(day) +
      ' ' +
      osg.fillZero(hour) +
      ':' +
      osg.fillZero(minute) +
      ':' +
      osg.fillZero(second);
    if (type == 'date') {
      return dateStr.slice(0, dateStr.indexOf(' '));
    } else {
      return dateStr;
    }
  },
  fillZero(num) {
    return num < 10 ? '0' + num : num;
  },
  // 字段展示类型
  showType(field, formData, roleId) {
    if (field.frontEndConfig.showField) {
      let showField = field.frontEndConfig.showField;
      if (showField.indexOf('.') != -1) showField = showField.split('.')[1];
      let showValue = field.frontEndConfig.showValue;
      if (showValue == '$exist') {
        if (formData[showField]) {
          if (Array.isArray(formData[showField])) {
            if (formData[showField].length > 0) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        } else {
          return false;
        }
      } else {
        if (formData[showField]) {
          if (Array.isArray(formData[showField])) {
            if (formData[showField].indexOf(showValue) != -1) {
              return true;
            } else {
              return false;
            }
          } else {
            if (formData[showField] == showValue) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      }
    } else if (field.showType != '1') {
      let showField = field.showField;
      let showValue = field.showValue;
      // 有值就展示
      if (field.showType == '2') {
        if (formData[showField]) {
          if (Array.isArray(formData[showField])) {
            if (formData[showField].length > 0) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        } else {
          return false;
        }
      }
      // 根据其他字段展示
      if (field.showType == '3') {
        if (formData[showField]) {
          if (Array.isArray(formData[showField])) {
            if (formData[showField].indexOf(showValue) != -1) {
              return true;
            } else {
              return false;
            }
          } else {
            if (formData[showField] == showValue) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      }
      // 指定角色可见
      if (field.showType == '4') {
        if (field.roleIds.indexOf(roleId) != -1) {
          return true;
        } else {
          return false;
        }
      }
      // 指定角色不可见
      if (field.showType == '5') {
        if (field.roleIds.indexOf(roleId) == -1) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      // field.showType == '1'
      return true;
    }
  },
  // 埋点
  md(params) {
    osg.ajax(
      'index/md',
      params || {},
      res => {
        console.log('mdres', res);
      },
      {
        noload: true
      }
    );
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
  }
};
module.exports.osg = osg;
