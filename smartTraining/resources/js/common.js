import permision from './permission.js';
import md5Encode from './md5.js';
import areajs from './area.js';
// var _host = 'https://xlinkbeta.fsgo365.cn';
// var _host = 'https://xlink.fsgo365.cn';
// var _host = 'http://localhost:8080';
// var _host = 'http://192.168.1.24:8081'; // wgd
// var _host = 'http://192.168.1.25:8080'; // zj
var _host = 'https://xlinkbeta.fsgo365.cn:7443/';

var rootUri = _host;
// var rootUri = _host + '/fsgo/wm/';
// var rootUri = _host + '/xlink/wm/';

var linkMiniPrefix = _host + '/wm/';

// #ifdef APP-PLUS
import { createEventCalendar, getEventCalendar } from '@/uni_modules/bw-calendar-event';
let systemInfo = uni.getSystemInfoSync();
let osName = systemInfo.osName;
let deviceBrand = systemInfo.deviceBrand;
if (osName == 'android') {
  // 动态引入，避免ios报错
  var { KeepLive } = require('@/uni_modules/android-keeplive');
  if (deviceBrand == 'huawei') {
    var {
      registerRequestPermissionTipsListener,
      unregisterRequestPermissionTipsListener,
      setRequestPermissionTips
    } = require('@/uni_modules/uni-registerRequestPermissionTips');
    var permissionTips = {
      'android.permission.CAMERA':
        '<font>拍照权限使用说明：</font><br><font>用于拍摄工作照片或上传头像等场景</font>',
      'android.permission.CALL_PHONE':
        '<font>拨号权限使用说明：</font><br><font>用于拨号联系客户</font>',
      'android.permission.READ_CALENDAR':
        '<font>日程权限使用说明：</font><br><font>用于查询预约提醒的日程</font>',
      'android.permission.WRITE_CALENDAR':
        '<font>日程权限使用说明：</font><br><font>用于添加预约提醒的日程</font>',
      'android.permission.ACCESS_COARSE_LOCATION':
        '<font>定位权限使用说明：</font><br><font>用于工单导航</font>',
      'android.permission.ACCESS_FINE_LOCATION':
        '<font>定位权限使用说明：</font><br><font>用于工单导航</font>',
      'android.permission.ACCESS_BACKGROUND_LOCATION':
        '<font>后台定位权限使用说明：</font><br><font>用于app后台运行时工单导航</font>',
      'android.permission.ACCESS_NETWORK_STATE':
        '<font>网络状态权限使用说明：</font><br><font>用于查看当前网络连接是否正常</font>',
      'android.permission.READ_EXTERNAL_STORAGE':
        '<font>读取照片或文件权限使用说明：</font><br><font>用于从相册选择照片上传</font>',
      'android.permission.WRITE_EXTERNAL_STORAGE':
        '<font>读写照片或文件权限使用说明：</font><br><font>用于查看或保存手机照片或文件</font>'
    };
  }
}
// #endif

// 是否debug模式
var debug = false;

var osg = {
  host: _host,
  login: rootUri + 'index/login',
  user: {},
  systemInfo: {}, // 系统信息
  appBaseInfo: {}, // App基础信息
  app: null,
  _cthis: null,
  _param: null,
  pushClientId: '', // 客户端唯一推送标识
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
    if (user && user._id) {
      osg.user = user;
      return true;
    } else {
      return false;
    }
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
  timeout: false, // 是否登录过期，多个请求过期，只显示1个弹窗
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

    if (!noload) this.loading(options.loadingMsg || '');

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
        if (data.statusCode == 200 || data.statusCode == 201) {
          if (data.data == 'restart') {
            wx.removeStorageSync('sessionId');
            wx.removeStorageSync('user');
            wx.removeStorageSync('currentRole');
            wx.removeStorageSync('currentRoleFunctions');
            wx.removeStorageSync('menu');
            wx.removeStorageSync('address');
            let pages = getCurrentPages();
            if (
              pages[pages.length - 1] &&
              pages[pages.length - 1].route != 'subpackages/login/loginAuth'
            ) {
              if (!osg.timeout) {
                osg.timeout = true;
                osg.alert('登录信息已过期，请重新登录！', () => {
                  osg.timeout = false;
                  osg.open('/subpackages/login/loginAuth');
                });
              }
              return;
            }
          }
          if (data.data == 9001) {
            osg.alert('用户已锁定无法登陆请与管理员联系！');
            return;
          }
          if (url.substring(url.length - 5) != 'login') {
            data = data.data;
          }
          if (debug) console.log('请求返回：' + JSON.stringify(data));
          if (data && data.message && data.success === false) {
            // 解绑中继号
            if (data.data && data.data.event == 'WinnerLookBusy') {
              osg.confirm(
                data.message,
                () => {
                  osg.unBindPrivateNumber();
                },
                {
                  title: '提示',
                  confirmText: '解绑'
                }
              );
            } else {
              _this.alert(data.message, error);
              if (failCallback) failCallback();
            }
          } else success(data);
        } else if (data.statusCode == 500) {
          if (wx.getStorageSync('user') && wx.getStorageSync('user').tenantId == '0') {
            _this.alert('您当前为游客身份，请先在系统中注册并维护信息！');
          } else {
            _this.alert('系统开小差了，请稍后重试');
          }
        } else if (data.statusCode == 404 && url.indexOf('staffs/') != -1 && data && data.data) {
          success(data.data);
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
  alert: function (msg, callback, title, confirmButtonText) {
    // #ifdef MP-WEIXIN
    wx.showModal({
      title: title || '提示',
      content: msg,
      showCancel: false,
      confirmColor: '#106cff',
      success(res) {
        if (res.confirm) {
          if (callback) callback();
        } else if (res.cancel) {
        }
      }
    });
    // #endif
    // #ifdef APP-PLUS
    osg._cthis.$dialog
      .alert({
        title: title || '提示',
        message: msg,
        confirmButtonColor: '#106cff',
        confirmButtonText: confirmButtonText || '确认'
      })
      .then(() => {
        if (callback) callback();
      });
    // #endif
  },

  /**
   * confirm确认框组件
   *
   * @param {Object} msg
   * @param {Object} callback
   */
  confirm: function (msg, callback, options) {
    options = options || {};
    // #ifdef MP-WEIXIN
    wx.showModal({
      title: options.title || '',
      content: msg,
      confirmText: options.confirmText || '确认',
      confirmColor: options.confirmColor || '#106cff',
      showCancel: options.showCancel == 'hide' ? false : true,
      cancelText: options.cancelText || '取消',
      cancelColor: options.cancelColor || '#323232',
      success(res) {
        if (res.confirm) {
          if (callback) callback();
        } else if (res.cancel) {
          if (options.fail) options.fail();
        }
      }
    });
    // #endif
    // #ifdef APP-PLUS
    osg._cthis.$dialog
      .confirm({
        title: options.title || '',
        message: msg,
        confirmButtonText: options.confirmText || '确认',
        confirmButtonColor: options.confirmColor || '#106cff',
        showCancelButton: options.showCancel == 'hide' ? false : true,
        cancelButtonText: options.cancelText || '取消',
        cancelButtonColor: options.cancelColor || '#323232'
      })
      .then(() => {
        // on confirm
        if (callback) callback();
      })
      .catch(() => {
        // on cancel
        if (options.fail) options.fail();
      });
    // #endif
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

    // #ifdef APP-PLUS
    // App重复页面无法调整
    if (url.indexOf('?') == -1) {
      url += '?t=' + new Date().getTime();
    } else {
      url += '&t=' + new Date().getTime();
    }
    // #endif

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
              tenantId: wx.getStorageSync('user').tenantId
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
    if (!$this || (!opts && !$this.options)) return;
    var opts = opts || $this.options[codeType];
    opts = osg.cascadeFlat(opts);
    if (opts && Array.isArray(opts)) {
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
  codelabelForArray: function (codeType, codeValue, separator) {
    var $this = osg._cthis;
    if (!$this || !$this.options || !codeType || !codeValue) {
      return;
    }
    var opts = $this.options[codeType] || $this.options[codeType.toLowerCase()]; // 避免有些字典表codeType是大写,预置没有
    if (opts && Array.isArray(opts) && codeValue) {
      var str = '';
      for (var i = 0; i < opts.length; i++) {
        for (var j = 0; j < codeValue.length; j++) {
          if (codeValue[j] == opts[i].value) str += opts[i].name + (separator || '、');
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
  formatCascade(option, arr, opts) {
    if (arr && arr.length > 0) {
      if (osg.isJson(arr)) {
        arr = JSON.parse(arr);
      }
      var $this = osg._cthis;
      let str = '';
      opts = osg.deepCopy(opts || $this.options[option]);
      if (!opts && isEmptyObject(opts)) return;
      // 单选级联 有几级循环几次
      if (Array.isArray(opts)) {
        for (var i = 0; i < arr.length; i++) {
          for (var opt of opts) {
            if (opt.value == arr[i]) {
              str += (opt.label || opt.name) + ' / ';
              opts = osg.deepCopy(opt.children);
              break;
            }
          }
        }
      }
      return str.slice(0, str.length - 3);
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
      if (opts && Array.isArray(opts)) {
        for (let i = 0; i < arr.length; i++) {
          for (let opt of opts) {
            if (opt.value == arr[i]) {
              str += (opt.label || opt.name) + ' / ';
              opts = osg.deepCopy(opt.children);
              break;
            }
          }
        }
      }
      string += str.slice(0, str.length - 2) + '、';
    }
    return string.slice(0, string.length - 1);
  },
  /**
   * 数组对象深拷贝
   *  app端 instanceof Array返回false，instanceof prototype属性可修改导致。
   */
  deepCopy: function (data) {
    let o = {
      run: function (val) {
        let result = '';
        if (Array.isArray(val)) {
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
            if (Array.isArray(arr[i])) {
              arr_temp[i] = this.copyArr(arr[i]);
            } else if (Object.prototype.toString.call(arr[i]) === '[object Object]') {
              arr_temp[i] = this.copyObj(arr[i]);
            } else arr_temp[i] = arr[i];
          }
        }

        return arr_temp;
      },
      copyObj: function (obj) {
        let obj_temp = {};

        for (let key in obj) {
          if (Array.isArray(obj[key])) {
            obj_temp[key] = this.copyArr(obj[key]);
          } else if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
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
      osg.cookie.deleteCookie(common.osg.cookieRelative.token);
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
  // 检查网络状态
  checkNetworkShow: false, // 控制不重复弹窗
  checkNetwork(success, fail) {
    wx.getNetworkType({
      success(res) {
        console.log('res.networkType', res.networkType);
        if (res.networkType === 'none') {
          wx.showToast({
            title: '无网络连接，请检查网络',
            icon: 'none',
            duration: 3000
          });
          return false; // 网络异常，终止上传
        } else {
          if (!osg.checkNetworkShow && (res.networkType == '2g' || res.networkType == '3g')) {
            // osg.alert(
            //   `当前网络状况为${res.networkType}，会影响上传速度，建议切换为wifi或更好的网络再上传！`
            // );
            // osg.checkNetworkShow = true;
            wx.showToast({
              title: `当前网络状况为${res.networkType}，会影响上传速度，建议切换为wifi或更好的网络再上传！`,
              icon: 'none',
              duration: 3000
            });
          }
          if (!osg.checkNetworkShow && res.networkType == 'wifi') {
            // osg.alert(`当前连接网络为wifi，一些wifi会有上传限制，建议切换为流量后重试！`);
            // osg.checkNetworkShow = true;
            wx.showToast({
              title: `当前连接网络为wifi，一些wifi会有上传限制，建议切换为流量后重试！`,
              icon: 'none',
              duration: 3000
            });
          }
          if (success) success(res.networkType); // 网络正常，继续上传
        }
      },
      fail() {
        wx.showToast({
          title: '获取网络状态失败',
          icon: 'none',
          duration: 3000
        });
        if (fail) fail();
        return false;
      }
    });
  },
  //七牛云下载地址
  downloadUrl: 'https://pub.fsgo365.cn/',
  afterRead(event, that, longitude, latitude, callback) {
    osg.checkNetworkShow = false;
    const { file } = event.detail;
    //判断是否为数组，是则循环上传
    if (Array.isArray(file)) {
      for (let i = 0; i < file.length; i++) {
        let item = file[i];
        osg.fileUpToken(
          that,
          event,
          item.path,
          longitude,
          latitude,
          event.detail.capture,
          callback,
          item,
          0,
          3,
          i
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
        {},
        0,
        3
      );
    }
  },
  //上传
  fileUpToken(
    that,
    event,
    filePath,
    longitude,
    latitude,
    capture,
    callback,
    currentFile,
    retryCount,
    maxRetryCount,
    fileIndex
  ) {
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
        osg.uploadToQiniu(
          that,
          event,
          filePath,
          longitude,
          latitude,
          capture,
          callback,
          data,
          retryCount,
          maxRetryCount,
          fileIndex
        );
      },
      {
        noload: true,
        fail() {
          if (callback) callback();
          osg.toast('上传失败：无法获取七牛云token', 'none');
        }
      }
    );
  },
  uploadToQiniu(
    that,
    event,
    filePath,
    longitude,
    latitude,
    capture,
    callback,
    data,
    retryCount,
    maxRetryCount,
    fileIndex
  ) {
    wx.uploadFile({
      url: 'https://up-z1.qiniup.com',
      filePath,
      name: 'file',
      formData: data,
      success: res => {
        let fileTypeConfig = event.target.dataset?.extfield?.frontEndConfig?.fileType || '';
        let currentFileType = event.detail.file[0].fileType || event.detail.file[0].type;
        // van-upload未指定文件类型时，默认值是image，只支持上传图片。此处解决部分设备限制不住仍能选到视频的问题。
        if (!fileTypeConfig && currentFileType != 'image') {
          console.log(fileTypeConfig, event.detail.file);
          osg.toast('只支持上传图片', 'none');
          if (callback) callback('fail');
          return;
        }
        // 上传图片拼接七牛云压缩和格式转换参数
        let imageView = '';
        if (currentFileType == 'image') {
          imageView = '!convert.jpg';
        }
        if (capture) {
          if ('album' == capture[0]) {
            if (that.signForm && that.signForm.show) {
              that.signForm.formData[event.target.dataset.field] =
                that.signForm.formData[event.target.dataset.field] || [];
              that.signForm.formData[event.target.dataset.field].push({
                url: osg.downloadUrl + JSON.parse(res.data).key + imageView,
                name: JSON.parse(res.data).key,
                extname: JSON.parse(res.data).key.split('.')[1]
              });
            } else {
              that.formData[event.target.dataset.field] =
                that.formData[event.target.dataset.field] || [];
              that.formData[event.target.dataset.field].push({
                url: osg.downloadUrl + JSON.parse(res.data).key + imageView,
                name: JSON.parse(res.data).key,
                extname: JSON.parse(res.data).key.split('.')[1]
              });
            }

            if (callback)
              callback({
                url: osg.downloadUrl + JSON.parse(res.data).key + imageView,
                name: JSON.parse(res.data).key,
                extname: JSON.parse(res.data).key.split('.')[1]
              });
            osg.toast('上传成功');
            that.$forceUpdate();
          }
          if ('camera' == capture[0]) {
            // 解析经纬度
            let qiniuImagePath = osg.downloadUrl + JSON.parse(res.data).key + imageView;
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
                if (that.signForm && that.signForm.show) {
                  that.signForm.formData[event.target.dataset.field] =
                    that.signForm.formData[event.target.dataset.field] || [];
                  that.signForm.formData[event.target.dataset.field].push({
                    url: osg.downloadUrl + res.field + imageView,
                    name: JSON.parse(res.data).key,
                    extname: JSON.parse(res.data).key.split('.')[1]
                  });
                } else {
                  that.formData[event.target.dataset.field] =
                    that.formData[event.target.dataset.field] || [];
                  that.formData[event.target.dataset.field].push({
                    url: osg.downloadUrl + res.field + imageView,
                    name: JSON.parse(res.data).key,
                    extname: JSON.parse(res.data).key.split('.')[1]
                  });
                }
                console.log('that.formData:===' + that.formData.url);
                if (callback)
                  callback({
                    url: osg.downloadUrl + res.field + imageView,
                    name: JSON.parse(res.data).key,
                    extname: JSON.parse(res.data).key.split('.')[1]
                  });
                osg.toast('上传成功');
                that.$forceUpdate();
              }
            );
          }
        } else {
          if (that.signForm && that.signForm.show) {
            that.signForm.formData[event.target.dataset.field] =
              that.signForm.formData[event.target.dataset.field] || [];
            that.signForm.formData[event.target.dataset.field].push({
              url: osg.downloadUrl + JSON.parse(res.data).key + imageView,
              name: JSON.parse(res.data).key,
              path: osg.downloadUrl + JSON.parse(res.data).key + imageView,
              extname: JSON.parse(res.data).key.split('.')[1]
            });
          } else {
            that.formData[event.target.dataset.field] =
              that.formData[event.target.dataset.field] || [];
            that.formData[event.target.dataset.field].push({
              url: osg.downloadUrl + JSON.parse(res.data).key + imageView,
              name: JSON.parse(res.data).key,
              path: osg.downloadUrl + JSON.parse(res.data).key + imageView,
              extname: JSON.parse(res.data).key.split('.')[1]
            });
          }

          if (callback)
            callback({
              url: osg.downloadUrl + JSON.parse(res.data).key + imageView,
              name: JSON.parse(res.data).key,
              path: osg.downloadUrl + JSON.parse(res.data).key + imageView,
              extname: JSON.parse(res.data).key.split('.')[1]
            });
          that.$forceUpdate();
        }
      },
      fail() {
        retryCount++;
        if (retryCount === 1) {
          // 第一次失败后检查网络状态
          osg.checkNetwork(
            () => {
              if (retryCount < maxRetryCount) {
                wx.showToast({
                  title:
                    (fileIndex || fileIndex === 0 ? `第${fileIndex + 1}张` : '') +
                    `上传失败，正在重试 (${retryCount}/${maxRetryCount})`,
                  icon: 'none',
                  duration: 3000
                });
                // 继续重试上传，传递更新后的retryCount
                console.log('触发index-retryCount', fileIndex, retryCount);
                osg.uploadToQiniu(
                  that,
                  event,
                  filePath,
                  longitude,
                  latitude,
                  capture,
                  callback,
                  data,
                  retryCount,
                  maxRetryCount,
                  fileIndex
                );
              }
            },
            () => {
              if (callback) callback('fail');
            }
          );
        } else if (retryCount <= maxRetryCount) {
          wx.showToast({
            title:
              (fileIndex || fileIndex === 0 ? `第${fileIndex + 1}张` : '') +
              `上传失败，正在重试 (${retryCount}/${maxRetryCount})`,
            icon: 'none',
            duration: 3000
          });
          console.log('触发index-retryCount', fileIndex, retryCount);
          osg.uploadToQiniu(
            that,
            event,
            filePath,
            longitude,
            latitude,
            capture,
            callback,
            data,
            retryCount,
            maxRetryCount,
            fileIndex
          );
        } else {
          wx.showToast({
            title: '上传失败，请稍后重新上传',
            icon: 'none',
            duration: 3000
          });
          if (callback) callback('fail');
        }
      }
    });
  },
  // 上传本地文件到七牛
  uploadFile(filePath, callback) {
    let lastIndex = filePath.lastIndexOf('/'); // 用作截取文件名
    osg.ajax(
      'back/super/file/upToken.do',
      {
        fileName: filePath.substring(lastIndex + 1)
      },
      data => {
        wx.uploadFile({
          url: 'https://up-z1.qiniup.com',
          filePath,
          name: 'file',
          formData: data,
          success: res => {
            if (callback) {
              // 上传图片拼接七牛云压缩和格式转换参数
              let suffix = JSON.parse(res.data).key.split('.')[1];
              let imageView = '';
              if (
                ['jpg', 'jpeg', 'png', 'webp', 'heif', 'heic', 'avif'].indexOf(
                  suffix.toLowerCase()
                ) != -1
              ) {
                imageView = '!convert.jpg';
              }
              callback(osg.downloadUrl + JSON.parse(res.data).key + imageView);
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
  addPhoneCalendar(formData, callback, failMsg) {
    // #ifdef MP-WEIXIN
    wx.getSetting({
      success(res) {
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
                title: formData.title, // 日程标题，必填项
                startTime: new Date(formData.startTime).getTime() / 1000, // 日程开始时间，必填项
                endTime: (new Date(formData.startTime).getTime() + 2 * 60 * 60 * 1000) / 1000, // 日程结束时间，必填项
                alarmOffset: formData.alarmOffset, // 提醒提前量，单位秒，默认 0 表示开始时提醒
                location: formData.location || '', // 日程地点，非必填项
                description: formData.description || '', // 日程事件说明，非必填项
                success(res) {
                  console.log('addPhoneCalendar:success');
                  console.log(res); // 日程添加成功的回调函数
                  osg.toast('添加日程成功', 'none');
                  if (callback) callback();
                },
                fail(res) {
                  console.log('addPhoneCalendar:fail');
                  console.log(res); // 日程添加失败的回调函数
                  if (res.errMsg.indexOf('authorization refuesed') != -1) {
                    osg.alert(
                      '请打开手机“设置-隐私与安全-日历”，允许微信添加日程！之后可手动点击工单预约页签底部添加日程提醒。'
                    );
                  } else if (res.errMsg.indexOf('TAP gesture') != -1) {
                    // errMsg: "addPhoneCalendar:fail can only be invoked by user TAP gesture."
                    // 不能直接调用wx.addPhoneCalendar，只能通过用户手动操作触发
                    osg.alert(
                      failMsg || '您已授权添加到日历，可返回预约页签，点击底部添加日程提醒！'
                    );
                  }
                }
              });
            },
            fail() {
              console.log('wx.authorize:fail');
              // 提示需求授权
              wx.showModal({
                title: '授权',
                content: '需要授权微信向系统日历添加日程',
                confirmColor: '#106cff',
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
                              osg.alert(
                                '您已授权添加到日历，可返回预约页签，点击底部添加日程提醒！'
                              );
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
            title: formData.title, // 日程标题，必填项
            startTime: new Date(formData.startTime).getTime() / 1000, // 日程开始时间，必填项
            endTime: (new Date(formData.startTime).getTime() + 2 * 60 * 60 * 1000) / 1000, // 日程结束时间，必填项
            alarmOffset: formData.alarmOffset, // 提醒提前量，单位秒，默认 0 表示开始时提醒
            location: formData.location, // 日程地点，非必填项
            description: formData.description || '', // 日程事件说明，非必填项
            success(res) {
              console.log('addPhoneCalendar:success');
              console.log(res); // 日程添加成功的回调函数
              osg.toast('添加日程成功', 'none');
              if (callback) callback();
            },
            fail(res) {
              console.log('addPhoneCalendar:fail');
              console.log(res); // 日程添加失败的回调函数
              // errMsg: "addPhoneCalendar:fail cancel 取消
              if (res.errMsg.indexOf('authorization refuesed') != -1) {
                osg.alert(
                  '请打开手机“设置-隐私与安全-日历”，允许微信添加日程！之后可手动点击工单预约页签底部添加日程提醒。'
                );
              }
            }
          });
        }
      }
    });
    // #endif

    // #ifdef APP-PLUS
    if (plus.os.name === 'Android') {
      let permissions = ['android.permission.READ_CALENDAR', 'android.permission.WRITE_CALENDAR'];
      // 检查权限
      plus.android.requestPermissions(permissions, function (result) {
        if (result.granted) {
          let main = plus.android.runtimeMainActivity();
          let context = main.getApplicationContext();
          let Uri = plus.android.importClass('android.net.Uri');
          let ContentResolver = plus.android.importClass('android.content.ContentResolver');
          let Cursor = plus.android.importClass('android.database.Cursor');
          // 获取 ContentResolver 实例
          let resolver = context.getContentResolver();
          // 日历 URI
          const CALENDAR_URI = 'content://com.android.calendar/calendars';
          let uri = Uri.parse(CALENDAR_URI);
          let cursor = plus.android.invoke(resolver, 'query', uri, null, null, null, null);
          if (cursor !== null && cursor.moveToFirst()) {
            do {
              let id = cursor.getString(cursor.getColumnIndex('_id')); // 获取日历 ID
              let CalendarContract_Events = plus.android.importClass(
                'android.provider.CalendarContract$Events'
              );
              let CalendarContract_Reminders = plus.android.importClass(
                'android.provider.CalendarContract$Reminders'
              );
              let ContentValues = plus.android.importClass('android.content.ContentValues');
              let eventValues = new ContentValues();
              eventValues.put(CalendarContract_Events.CALENDAR_ID, id); // 日历ID
              eventValues.put(CalendarContract_Events.TITLE, formData.title); // 标题
              eventValues.put(CalendarContract_Events.EVENT_LOCATION, formData.location || ''); // 地址
              eventValues.put(CalendarContract_Events.DESCRIPTION, formData.description || ''); // 描述
              eventValues.put(
                CalendarContract_Events.DTSTART,
                new Date(formData.startTime).getTime()
              ); // 开始时间
              eventValues.put(
                CalendarContract_Events.DTEND,
                new Date(formData.startTime).getTime() + 2 * 60 * 60 * 1000
              ); // 结束时间
              eventValues.put(CalendarContract_Events.EVENT_TIMEZONE, 'Asia/Shanghai'); // 时区
              eventValues.put(CalendarContract_Events.HAS_ALARM, 1); // 是否有提醒
              let eventUri = resolver.insert(CalendarContract_Events.CONTENT_URI, eventValues);
              // 插入提醒
              let reminderValues = new ContentValues();
              reminderValues.put(
                CalendarContract_Reminders.EVENT_ID,
                '' + parseInt(eventUri.getLastPathSegment())
              );
              reminderValues.put(CalendarContract_Reminders.MINUTES, 10); // 提前10分钟提醒
              reminderValues.put(
                CalendarContract_Reminders.METHOD,
                CalendarContract_Reminders.METHOD_ALERT
              );
              resolver.insert(CalendarContract_Reminders.CONTENT_URI, reminderValues);
              osg.toast('已添加日程提醒', 'none');
              if (callback) callback();
            } while (cursor.moveToNext());
            cursor.close();
          } else {
            osg.toast('未找到日历或无法访问日历，无法为您添加日程提醒。', 'none');
          }
        } else {
          osg.toast('没有授权日历权限，无法为您添加日程提醒。', 'none');
        }
      });
    } else if (plus.os.name === 'iOS') {
      try {
        const isSartTime = formData.startTime; // "2024-12-31 15:57:17"
        // 将施工时间转换为 Date 对象
        const isoStartTime = isSartTime.replace(' ', 'T');
        const constructionDate = new Date(isoStartTime);
        const timeStamp = Date.parse(isoStartTime);

        if (isNaN(timeStamp)) {
          console.error('无效的施工时间:', isSartTime);
          osg.toast('无效的施工时间，请检查输入。', 'none');
          return; // 退出当前函数
        }

        // 设置提醒时间为施工前1小时
        const reminderTime = new Date(constructionDate.getTime() - 1 * 60 * 60 * 1000);

        // 格式化提醒开始时间（施工前1小时）
        const startTime = `${reminderTime.getFullYear()}-${String(
          reminderTime.getMonth() + 1
        ).padStart(2, '0')}-${String(reminderTime.getDate()).padStart(2, '0')} ${String(
          reminderTime.getHours()
        ).padStart(2, '0')}:${String(reminderTime.getMinutes()).padStart(2, '0')}:${String(
          reminderTime.getSeconds()
        ).padStart(2, '0')}`;

        // 设置结束时间为开始时间后1分钟
        const endDate = new Date(reminderTime.getTime() + 60 * 1000);
        const endTime = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(endDate.getDate()).padStart(2, '0')} ${String(endDate.getHours()).padStart(
          2,
          '0'
        )}:${String(endDate.getMinutes()).padStart(2, '0')}:${String(endDate.getSeconds()).padStart(
          2,
          '0'
        )}`;

        console.log('startDate:', startTime, 'endDate:', endTime);

        createEventCalendar({
          title: formData.title,
          notes: `${formData.location}\n${formData.note || ''}`,
          startDate: startTime,
          endDate: endTime,
          alarmOffset: [0],
          isAllDay: false,
          weeks: [],
          success: e => {
            console.log('创建成功:', e);
            this.getEventCalendar();
          },
          fail: e => {
            console.error('创建失败:', e);
            osg.toast(e.message, 'none');
          }
        });
      } catch (error) {
        console.error('发生错误:', error);
        osg.toast('发生未知错误，请稍后重试。', 'none');
      }
    }
    // #endif
  },
  /**
   * 获取登录用户小程序地理位置
   */
  location(callback, setting) {
    // #ifdef APP-PLUS
    uni.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: (setting && setting.isHighhighAccuracyExpireTimeAccuracy) || 4000,
      success: res => {
        if (res.errMsg == 'getLocation:ok') {
          if (callback) callback(res);
        }
      },
      complete: () => {}
    });
    return;
    // #endif
    // 获取地理位置
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: (setting && setting.isHighhighAccuracyExpireTimeAccuracy) || 4000,
      // 获取地理位置成功
      success(res) {
        if (callback) callback(res);
      },
      // 获取地理位置失败
      fail() {}
    });
  },
  checkPush(callback) {
    setTimeout(() => {
      let self = this;
      if (plus.os.name == 'Android') {
        // 判断是Android
        var main = plus.android.runtimeMainActivity();
        var NotificationManagerCompat = plus.android.importClass(
          'android.support.v4.app.NotificationManagerCompat'
        );
        //android.support.v4升级为androidx
        if (NotificationManagerCompat == null) {
          NotificationManagerCompat = plus.android.importClass(
            'androidx.core.app.NotificationManagerCompat'
          );
        }
        var areNotificationsEnabled =
          NotificationManagerCompat.from(main).areNotificationsEnabled();
        // 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置
        if (callback) callback(areNotificationsEnabled);
      } else if (plus.os.name == 'iOS') {
        // 判断是ISO
        var isOn = undefined;
        var types = 0;
        var app = plus.ios.invoke('UIApplication', 'sharedApplication');
        var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
        if (settings) {
          types = settings.plusGetAttribute('types');
          plus.ios.deleteObject(settings);
        } else {
          types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
        }
        plus.ios.deleteObject(app);
        isOn = 0 != types;
        if (callback) callback(isOn);
      } else {
        if (callback) callback(true);
      }
    }, 50);
  },
  checkPushConfirm() {
    var main = plus.android.runtimeMainActivity();
    var pkName = main.getPackageName();
    var uid = main.getApplicationInfo().plusGetAttribute('uid');
    if (plus.os.name == 'Android') {
      var Intent = plus.android.importClass('android.content.Intent');
      var Build = plus.android.importClass('android.os.Build');
      //android 8.0引导
      if (Build.VERSION.SDK_INT >= 26) {
        var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
        intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
      } else if (Build.VERSION.SDK_INT >= 21) {
        //android 5.0-7.0
        var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
        intent.putExtra('app_package', pkName);
        intent.putExtra('app_uid', uid);
      } else {
        //(<21)其他--跳转到该应用管理的详情页
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        var uri = Uri.fromParts('package', mainActivity.getPackageName(), null);
        intent.setData(uri);
      }
      // 跳转到该应用的系统通知设置页
      main.startActivity(intent);
    } else if (plus.os.name == 'iOS') {
      var app = plus.ios.invoke('UIApplication', 'sharedApplication');
      var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:');
      plus.ios.invoke(app, 'openURL:', setting);
      plus.ios.deleteObject(setting);
      plus.ios.deleteObject(app);
    }
  },
  // 检查定位权限
  checkLocation(callback) {
    setTimeout(() => {
      if (plus.os.name == 'Android') {
        // Android 检查定位权限
        var Context = plus.android.importClass('android.content.Context');
        var LocationManager = plus.android.importClass('android.location.LocationManager');
        var main = plus.android.runtimeMainActivity();
        var locationManager = main.getSystemService(Context.LOCATION_SERVICE);

        // 检查GPS和网络定位是否开启
        var isGPSEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        var isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        if (callback) callback(isGPSEnabled || isNetworkEnabled);
      } else if (plus.os.name == 'iOS') {
        // iOS 检查定位权限
        var cllocationMgr = plus.ios.import('CLLocationManager');
        var location = new cllocationMgr();
        var enable = cllocationMgr.locationServicesEnabled();
        var status = cllocationMgr.authorizationStatus();
        plus.ios.deleteObject(location);

        // status:
        // 0 = NotDetermined 未决定
        // 1 = Restricted 受限
        // 2 = Denied 拒绝
        // 3 = AuthorizedAlways 始终允许
        // 4 = AuthorizedWhenInUse 使用期间允许
        if (callback) callback(enable && (status === 3 || status === 4));
      } else {
        if (callback) callback(true);
      }
    }, 50);
  },
  // 跳转到系统定位设置页面
  checkLocationConfirm() {
    if (plus.os.name == 'Android') {
      // Android 跳转到系统定位设置页面
      var Intent = plus.android.importClass('android.content.Intent');
      var Settings = plus.android.importClass('android.provider.Settings');

      var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
      var main = plus.android.runtimeMainActivity();
      main.startActivity(intent);

      // 申请后台定位权限
      var permissions = ['android.permission.ACCESS_FINE_LOCATION'];
      plus.android.requestPermissions(permissions, function (result) {
        console.log('requestPermissions', result);
        if (result.granted) {
          console.log('已获得前台定位权限');
          var permissions = ['android.permission.ACCESS_BACKGROUND_LOCATION'];
          plus.android.requestPermissions(permissions, result => {
            if (result.granted) {
              console.log('已获得后台定位权限');
            } else {
              console.log('未获得后台定位权限');
            }
          });
        } else {
          console.log('未获得前台定位权限');
        }
      });
    } else if (plus.os.name == 'iOS') {
      // iOS 跳转到系统设置页面
      var app = plus.ios.invoke('UIApplication', 'sharedApplication');
      var setting = plus.ios.invoke(
        'NSURL',
        'URLWithString:',
        'App-Prefs:root=Privacy&path=LOCATION'
      );
      plus.ios.invoke(app, 'openURL:', setting);
      plus.ios.deleteObject(setting);
      plus.ios.deleteObject(app);
    }
    // if (plus.os.name == 'Android') {
    //   // Android 跳转到系统定位设置页面
    //   var Intent = plus.android.importClass('android.content.Intent');
    //   var Settings = plus.android.importClass('android.provider.Settings');

    //   var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
    //   var main = plus.android.runtimeMainActivity();
    //   main.startActivity(intent);
    // } else if (plus.os.name == 'iOS') {
    //   // iOS 跳转到系统设置页面
    //   var app = plus.ios.invoke('UIApplication', 'sharedApplication');
    //   var setting = plus.ios.invoke(
    //     'NSURL',
    //     'URLWithString:',
    //     'App-Prefs:root=Privacy&path=LOCATION'
    //   );
    //   plus.ios.invoke(app, 'openURL:', setting);
    //   plus.ios.deleteObject(setting);
    //   plus.ios.deleteObject(app);
    // }
  },
  getLocation: function (callback, fail, setting) {
    let that = this;
    // #ifdef MP-WEIXIN
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
              // 判断是否需要提示
              if (setting && setting.doNotRemind) return;
              // 提示需求授权
              wx.showModal({
                title: '请求授权当前位置',
                content: '获取您的位置信息将用于工单导航',
                confirmColor: '#106cff',
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
    // #endif
    // #ifdef APP-PLUS
    uni.getSystemInfo({
      success: async res => {
        // 1.获取当前手机是否开启或关闭了定位服务
        if (!permision.checkSystemEnableLocation()) {
          // 1.1 关闭了定位服务
          osg.confirm(
            '请打开手机的定位服务，可尝试在手机顶部下拉的控制中心或手机设置中打开。',
            async () => {
              if (!permision.checkSystemEnableLocation()) {
                osg.toast('未打开手机的定位服务，无法获取当前定位。', 'none');
                return;
              }
              if (res.osName == 'android') {
                // Android是动态权限，请求权限状态时会触发弹框询问是否赋权（如果已经同意或永久禁止则不会询问），所以必须使用异步方式来处理
                // 返回值为数字，包括-1:被永久拒绝授权、0:未获取授权、1:已获取授权
                let result = await permision.requestAndroidPermission(
                  'android.permission.ACCESS_FINE_LOCATION'
                );
                let strStatus;
                if (result == 1) {
                  strStatus = '已获得授权';
                  this.location(callback, setting);
                } else if (result == 0) {
                  strStatus = '未获得授权';
                  // 打开当前App的权限设置界面。可用于引导用户赋权
                  osg.confirm('请在设置中打开App的定位权限，获取您的位置信息将工单导航。', () => {
                    permision.gotoAppPermissionSetting();
                  });
                } else {
                  strStatus = '被永久拒绝权限';
                }
              } else if (res.osName == 'ios') {
                //判断iOS上是否给予位置权限，有权限返回true，否则返回false
                if (permision.judgeIosPermission('location')) {
                  this.location(callback, setting);
                  console('已获得定位授权');
                } else {
                  // 打开当前App的权限设置界面。可用于引导用户赋权
                  osg.confirm('请在设置中打开App的定位权限，获取您的位置信息将工单导航。', () => {
                    permision.gotoAppPermissionSetting();
                  });
                  console('未获得定位授权');
                }
              }
            },
            {
              confirmText: '已打开手机定位'
            }
          );
          return;
        } else {
          // 1.2 开启了定位服务
          if (res.osName == 'android') {
            // Android是动态权限，请求权限状态时会触发弹框询问是否赋权（如果已经同意或永久禁止则不会询问），所以必须使用异步方式来处理
            // 返回值为数字，包括-1:被永久拒绝授权、0:未获取授权、1:已获取授权
            let result = await permision.requestAndroidPermission(
              'android.permission.ACCESS_FINE_LOCATION'
            );
            let strStatus;
            if (result == 1) {
              strStatus = '已获得定位授权';
              this.location(callback, setting);
            } else if (result == 0) {
              strStatus = '未获得定位授权';
              // 打开当前App的权限设置界面。可用于引导用户赋权
              osg.confirm('请在设置中打开App的定位权限，获取您的位置信息将用于工单导航。', () => {
                permision.gotoAppPermissionSetting();
              });
            } else {
              strStatus = '被永久拒绝权限';
            }
            console.log('strStatus', strStatus);
          } else if (res.osName == 'ios') {
            //判断iOS上是否给予位置权限，有权限返回true，否则返回false
            if (permision.judgeIosPermission('location')) {
              this.location(callback, setting);
              console('已获得定位授权');
            } else {
              // 打开当前App的权限设置界面。可用于引导用户赋权
              osg.confirm('请在设置中打开App的定位权限，获取您的位置信息将用于工单导航。', () => {
                permision.gotoAppPermissionSetting();
              });
              console('未获得定位授权');
            }
          }
        }
      }
    });
    // #endif
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
                confirmColor: '#106cff',
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
            showCancel: false,
            confirmColor: '#106cff'
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
  //高德根据定位当前城市
  getGeolocationInfo(callback) {
    // 高德地图API的URL
    const url = `~https://restapi.amap.com/v3/ip?parameters`;
    osg.ajax(
      url,
      {
        key: '222af85515a49668992817ba7d564425'
      }, // 请求参数，这里可以扩展为 POST 请求时发送的数据
      res => {
        if (res.status) {
          if (callback) callback(res);
        } else {
          osg.toast('请求出现错误', 'error');
          return;
        }
      },
      {
        noload: true // 请求配置
      }
    );
  },
  // 腾讯批量距离计算
  distance(from, to, callback) {
    osg.ajax(
      '~https://apis.map.qq.com/ws/distance/v1/matrix?mode=driving',
      {
        key: 'MTZBZ-3DY64-QGYUI-K2YLU-U7CWH-2SFL5',
        from: Array.isArray(from) ? from.join('|') : from,
        to: to.join(';')
      },
      res => {
        if (
          callback &&
          res.status == 0 &&
          res.result &&
          res.result.rows &&
          res.result.rows[0] &&
          res.result.rows[0].elements
        )
          callback(res.result.rows[0].elements);
      },
      {
        noload: true
      }
    );
  },
  // 高德驾车路径规划
  driving(points, callback) {
    osg.ajax(
      `~https://restapi.amap.com/v3/direction/driving?key=222af85515a49668992817ba7d564425&origin=${
        points[0].longitude
      },${points[0].latitude}&destination=${points[points.length - 1].longitude},${
        points[points.length - 1].latitude
      }&waypoints=${points
        .slice(1, points.length - 1)
        .map(item => `${item.longitude},${item.latitude}`)
        .join(';')}`,
      {},
      res => {
        if (callback) callback(res.route.paths[0]);
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
  clearRepeatClick(btn) {
    delete osg.clickTime[btn];
  },
  //返回可读时间
  readableTime(val, type) {
    // 判断是否是日期格式 如果是就不需要处理了 iOS 真机调试 NAN
    const formattedDatePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (typeof val === 'string' && formattedDatePattern.test(val)) {
      if (type == 'date') {
        return val.slice(0, val.indexOf(' '));
      } else if (type == 'time') {
        return val.slice(val.indexOf(' ') + 1);
      } else if (type == 'shortDatetime') {
        const [datePart, timePart] = val.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        return `${month}月${day}日 ${hour}:${minute}`;
      } else if (type == 'shortTime') {
        return val.substring(11, 16);
      } else {
        return val;
      }
    }

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
    } else if (type == 'time') {
      return dateStr.slice(dateStr.indexOf(' ') + 1);
    } else if (type == 'shortDatetime') {
      return (
        osg.fillZero(month) +
        '月' +
        osg.fillZero(day) +
        '日 ' +
        osg.fillZero(hour) +
        ':' +
        osg.fillZero(minute)
      );
    } else if (type == 'shortTime') {
      return osg.fillZero(hour) + ':' + osg.fillZero(minute);
    } else {
      return dateStr;
    }
  },
  fillZero(num) {
    return num < 10 ? '0' + num : num;
  },
  // 字段展示类型
  // showType(field, formData, roleId) {
  //   if (field.frontEndConfig.showField) {
  //     let showField = field.frontEndConfig.showField;
  //     if (showField.indexOf('.') != -1) showField = showField.split('.')[1];
  //     let showValue = field.frontEndConfig.showValue;
  //     if (showValue == '$exist') {
  //       if (formData[showField]) {
  //         if (Array.isArray(formData[showField])) {
  //           if (formData[showField].length > 0) {
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         } else {
  //           return true;
  //         }
  //       } else {
  //         return false;
  //       }
  //     } else {
  //       if (formData[showField]) {
  //         if (Array.isArray(formData[showField])) {
  //           if (formData[showField].indexOf(showValue) != -1) {
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         } else {
  //           if (formData[showField] == showValue) {
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         }
  //       } else {
  //         return false;
  //       }
  //     }
  //   } else if (field.showType != '1') {
  //     let showField = field.showField;
  //     let showValue = field.showValue;
  //     // 有值就展示
  //     if (field.showType == '2') {
  //       if (formData[showField]) {
  //         if (Array.isArray(formData[showField])) {
  //           if (formData[showField].length > 0) {
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         } else {
  //           return true;
  //         }
  //       } else {
  //         return false;
  //       }
  //     }
  //     // 根据其他字段展示
  //     if (field.showType == '3') {
  //       if (formData[showField]) {
  //         if (Array.isArray(formData[showField])) {
  //           if (Array.isArray(showValue)) {
  //             if (showValue.find(item => item.join() == formData[showField].join())) {
  //               return true;
  //             } else {
  //               return false;
  //             }
  //           } else {
  //             if (formData[showField].indexOf(showValue) != -1) {
  //               return true;
  //             } else {
  //               return false;
  //             }
  //           }
  //         } else {
  //           if (Array.isArray(showValue)) {
  //             if (showValue.indexOf(formData[showField]) != -1) {
  //               return true;
  //             } else {
  //               return false;
  //             }
  //           } else {
  //             if (formData[showField] == showValue) {
  //               return true;
  //             } else {
  //               return false;
  //             }
  //           }
  //         }
  //       } else {
  //         return false;
  //       }
  //     }
  //     // 指定角色可见
  //     if (field.showType == '4') {
  //       if (field.roleIds.indexOf(roleId) != -1) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }
  //     // 指定角色不可见
  //     if (field.showType == '5') {
  //       if (field.roleIds.indexOf(roleId) == -1) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }
  //   } else {
  //     // field.showType == '1'
  //     return true;
  //   }
  // },
  showType(field, formData, roleId) {
    // 兼容旧版frontEndConfig配置
    if (field.frontEndConfig.showField) {
      let showField = field.frontEndConfig.showField;
      let showValue = field.frontEndConfig.showValue;
      if (showValue == '$exist') {
        if (showField.indexOf('.') != -1) {
          let key = showField.split('.')[0];
          let subkey = showField.split('.')[1];
          if (formData[key] && formData[key][subkey]) {
            if (Array.isArray(formData[key][subkey])) {
              if (formData[key][subkey].length > 0) {
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
      } else {
        if (showField.indexOf('.') != -1) {
          let key = showField.split('.')[0];
          let subkey = showField.split('.')[1];
          if (formData[key] && formData[key][subkey]) {
            if (Array.isArray(formData[key][subkey])) {
              if (formData[key][subkey].indexOf(showValue) != -1) {
                return true;
              } else {
                return false;
              }
            } else {
              if (formData[key][subkey] == showValue) {
                return true;
              } else {
                return false;
              }
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
              if (Array.isArray(showValue)) {
                if (showValue.indexOf(formData[showField]) != -1) {
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
            }
          } else {
            return false;
          }
        }
      }
    } else if (field.showType != '1') {
      let showField = field.showField;
      let showFieldPreset = field.showFieldPreset;
      let showValue = field.showValue || field.exts.showValue;
      // 有值就展示
      if (field.showType == '2') {
        if (showFieldPreset) {
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
          if (formData.exts && formData.exts[showField]) {
            if (Array.isArray(formData.exts[showField])) {
              if (formData.exts[showField].length > 0) {
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
      }
      // 根据其他字段展示
      if (field.showType == '3') {
        if (showFieldPreset) {
          if (formData[showField]) {
            if (Array.isArray(formData[showField])) {
              if (Array.isArray(showValue)) {
                if (showValue.find(item => item.join() == formData[showField].join())) {
                  return true;
                } else {
                  return false;
                }
              } else {
                if (formData[showField].indexOf(showValue) != -1) {
                  return true;
                } else {
                  return false;
                }
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
        } else {
          if (formData.exts && formData.exts[showField]) {
            if (Array.isArray(formData.exts[showField])) {
              if (formData.exts[showField].indexOf(showValue) != -1) {
                return true;
              } else {
                return false;
              }
            } else {
              if (formData.exts[showField] == showValue) {
                return true;
              } else {
                return false;
              }
            }
          } else {
            return false;
          }
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
    let url = 'index/md';
    if (params.path) url += '/' + params.path;
    osg.ajax(url, params || {}, res => {}, {
      noload: true
    });
  },
  // 埋点上报
  report(type, params) {
    if (!osg.isLogined()) return;
    let act = ''; //Elastic Search参数
    let event_type = ''; //Amplitude事件类型
    let event_properties = {}; //Amplitude事件属性
    if (type == 'lifeCycle') {
      if (params.type == 'appLaunch' || params.type == 'appShow') {
        act = `${params.path}#${params.type}#${params.scene}`;
        event_properties.eventID = params.scene;
      } else if (params.type == 'appRoute') {
        act = `${params.path}#${params.type}#${params.openType}`;
        event_properties.eventID = params.openType;
      } else if (params.type == 'appHide') {
        act = `${params.path}#${params.type}#${params.reason}`;
        event_properties.eventID = params.reason;
      } else {
        act = `${params.path}#${params.type}#`;
      }
      event_type = params.type;
      event_properties.path = params.path;
    } else if (type == 'pageTrack') {
      act = `${params.currentRoute}#pageTrack#${params.duration}`;
      event_type = type;
      event_properties = params;
      event_properties.path = params.currentRoute;
    } else if (type && params && params.id) {
      let pages = getCurrentPages();
      if (pages.length == 0) return;
      let currentPage = pages[pages.length - 1];
      let currentRoute = currentPage.route;
      act = `${currentRoute}#${type}#${params.id}`;
      event_type = type;
      event_properties.eventID = params.id;
      event_properties.path = currentRoute;
      event_properties.keywords = params.keywords || '';
    }
    if (!act) return;
    // 上报至Elastic Search
    let reportParams = {
      act
    };
    // 页面停留时长监控埋点增加上报其他参数
    if (type == 'pageTrack') {
      reportParams = Object.assign(reportParams, params);
    }
    osg.ajax('index/md', reportParams, () => {}, {
      noload: true
    });

    // 上报至Amplitude
    osg.ajax(
      '~https://api2.amplitude.com/2/httpapi',
      {
        api_key:
          osg.host == 'https://xlinkbeta.fsgo365.cn'
            ? '22396c23df48e97285e2670011de66e7' // 测试环境
            : '31e95f099298af17687ac0b3798c09d2', // 正式环境
        events: [
          {
            user_id: osg.user.name + ' ' + osg.user.phone,
            event_type: event_type,
            user_properties: {
              _id: osg.user._id,
              name: osg.user.name,
              phone: osg.user.phone,
              orgId: osg.user.orgId,
              orgName: osg.user.orgName,
              tenantId: osg.user.tenantId,
              state: osg.user.state,
              serviceType: osg.user.serviceType,
              serviceResourceId: osg.user.serviceResourceId,
              roleIds: osg.user.roleIds,
              appPushClientid: osg.user.appPushClientid,
              province: osg.user.province,
              city: osg.user.city,
              district: osg.user.district
            },
            event_properties: Object.assign(event_properties, {
              appId: osg.appBaseInfo.appId,
              appName: osg.appBaseInfo.appName,
              uniPlatform: osg.appBaseInfo.uniPlatform,
              hostName: osg.appBaseInfo.hostName,
              hostVersion: osg.appBaseInfo.hostVersion,
              hostSDKVersion: osg.appBaseInfo.hostSDKVersion
            }),
            app_version: osg.appBaseInfo.appVersion,
            platform: osg.systemInfo.platform,
            os_name: osg.systemInfo.platform,
            os_version: osg.systemInfo.system,
            device_brand: osg.systemInfo.brand,
            device_model: osg.systemInfo.model,
            region: osg.user.province ? areajs.province_list[osg.user.province] : '',
            city: osg.user.city ? areajs.city_list[osg.user.city] : '',
            dma: osg.user.district ? areajs.county_list[osg.user.district] : ''
          }
        ]
      },
      res => {},
      {
        header: { 'Content-Type': 'application/json' },
        noload: true
      }
    );
  },
  //保留两位小数的金额
  amountToFixed(money) {
    if (!money) return 0;
    let resultAmount = +(+money).toFixed(2);
    return resultAmount ? resultAmount : 0;
  },
  // 复制到剪切板
  setClipboardData(data, msg) {
    wx.setClipboardData({
      data: data,
      success() {
        osg.toast(msg || '已复制', 'none');
      }
    });
  },
  // 节流
  throttle(fn, interval) {
    var enterTime = 0; //触发的时间
    var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
    return function () {
      var context = this;
      var backTime = new Date(); //第一次函数return即触发的时间
      if (backTime - enterTime > gapTime) {
        fn.call(context, arguments);
        enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
      }
    };
  },
  //图片前缀统一处理
  ProcessPicturePath(src) {
    if (!src.startsWith(osg.downloadUrl)) {
      return `${osg.downloadUrl}${src}`;
    }
    return src;
  },
  //获取工单扩展
  getFields(colName, callback, options) {
    var $this = osg._cthis;
    let params = {
      colName,
      _all: '1',
      'is:state|integer#and': 1,
      sortField: 'order',
      sortOrder: 'asc'
    };
    // 传过滤参数
    if (options && options.params) {
      params = Object.assign(params, options.params);
    }
    osg.ajax(
      'biz/extField/query',
      params,
      res => {
        for (let field of res.data) {
          //解析frontEndConfig字段配置
          if (field.frontEndConfig && osg.isJson(field.frontEndConfig)) {
            field.frontEndConfig = JSON.parse(field.frontEndConfig);
          } else {
            field.frontEndConfig = {};
          }
          field.showList = field.showList || [];
          //列表展示字段 关联字典表codeType放到options,之后从字典表查询
          if (field.valueOption) {
            if (field.type == 'cascade') {
              $this.options['cascadeCode_' + field.valueOption] = {
                codeId: field.valueOption
              };
            } else {
              $this.options['codecfg_' + field.valueOption] = {
                codeId: field.valueOption
              };
            }
          }
          if (field.frontEndConfig.tagType) $this.tagType = field.frontEndConfig.tagType;
        }
        osg.codeoption(() => {
          $this.fields = res.data;
          if (callback) callback();
        });
      },
      {
        noload: true
      }
    );
  },
  // 检查是否有新的wgt资源包
  checkWgt(callback) {
    plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
      osg.ajax(
        '/user/appResume',
        {
          cv: wgtinfo.version,
          tid: 'ptpress',
          tenantId: '1340835581184723420'
        },
        data => {
          if (data) {
            let isPublish; // 是否正在审核中 '0':非审核中 '1':审核中；审核中不更新，防止审核人员更新后测试。
            switch (osg.systemInfo.platform) {
              case 'android':
                isPublish = data.isPublishAndroid;
                break;
              case 'ios':
                isPublish = data.isPublishIos;
                break;
              case 'devtools':
                isPublish = data.isPublishAndroid;
                break;
              default:
                isPublish = 0;
            }
            // 当维护的wgt升级包版本与当前版本一致时不反回fileidUrl，不更新。
            if (
              isPublish != 1 &&
              osg.versionCompare(data.version, wgtinfo.version) == 1 &&
              data.fileidUrl
            ) {
              let st = osg.networkState(); // 当前设备网络状态
              if (callback) callback(data, st);
            } else {
              if (callback) callback();
            }
          } else {
            if (callback) callback();
          }
        },
        {
          noload: false
        }
      );
    });
  },
  // 下载wgt升级包
  downloadWgt(fileid, url, callback, complete) {
    this.downloading = true;
    //下载包
    const downloadTask = uni.downloadFile({
      url: url,
      success: res => {
        if (res.statusCode == 200) {
          uni.hideLoading();
          plus.io.resolveLocalFileSystemURL(res.tempFilePath, function (file) {
            plus.io.resolveLocalFileSystemURL('_downloads', function (dir) {
              file.moveTo(dir, fileid);
              var ul = '_downloads/' + fileid;
              let type = ul.split('.').pop();
              if (type == 'wgt') {
                plus.runtime.install(
                  ul,
                  {
                    force: true
                  },
                  function () {
                    if (complete) complete();
                  },
                  function (e) {
                    alert('更新失败(' + e.code + '): ' + e.message);
                  }
                );
              } else {
                plus.runtime.install(ul, {
                  force: true
                });
              }
            });
          });
        } else {
          //下载失败
          uni.hideLoading();
          plus.downloader.clear(); //清除下载任务
          osg.toast('下载失败，请稍后重试', 'none');
        }
      }
    });

    downloadTask.onProgressUpdate(res => {
      let downLoadPercent = res.progress;
      let downloadedSize = (res.totalBytesWritten / Math.pow(1024, 2)).toFixed(2);
      let packageFileSize = (res.totalBytesExpectedToWrite / Math.pow(1024, 2)).toFixed(2);
      if (callback) callback(downLoadPercent, downloadedSize, packageFileSize);
    });
  },
  // 获取当前设备网络状态
  networkState() {
    var types = {};
    types[plus.networkinfo.CONNECTION_UNKNOW] = 'unknown';
    types[plus.networkinfo.CONNECTION_NONE] = 'none';
    types[plus.networkinfo.CONNECTION_ETHERNET] = 'ethernet';
    types[plus.networkinfo.CONNECTION_WIFI] = 'wifi';
    types[plus.networkinfo.CONNECTION_CELL2G] = '2g';
    types[plus.networkinfo.CONNECTION_CELL3G] = '3g';
    types[plus.networkinfo.CONNECTION_CELL4G] = '4g';
    return types[plus.networkinfo.getCurrentType()];
  },
  /**
   * 对比版本号，如需要，请自行修改判断规则
   * 支持比对	("3.0.0.0.0.1.0.1", "3.0.0.0.0.1")	("3.0.0.1", "3.0")	("3.1.1", "3.1.1.1") 之类的
   * @param {Object} v1
   * @param {Object} v2
   * v1 > v2 return 1
   * v1 < v2 return -1
   * v1 == v2 return 0
   */
  versionCompare(v1 = '0', v2 = '0') {
    v1 = String(v1).split('.');
    v2 = String(v2).split('.');
    const minVersionLens = Math.min(v1.length, v2.length);

    let result = 0;
    for (let i = 0; i < minVersionLens; i++) {
      const curV1 = Number(v1[i]);
      const curV2 = Number(v2[i]);

      if (curV1 > curV2) {
        result = 1;
        break;
      } else if (curV1 < curV2) {
        result = -1;
        break;
      }
    }

    if (result === 0 && v1.length !== v2.length) {
      const v1BiggerThenv2 = v1.length > v2.length;
      const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
      for (let i = minVersionLens; i < maxLensVersion.length; i++) {
        const curVersion = Number(maxLensVersion[i]);
        if (curVersion > 0) {
          v1BiggerThenv2 ? (result = 1) : (result = -1);
          break;
        }
      }
    }

    return result;
  },
  md5(str) {
    return md5Encode(str);
  },
  // #ifdef APP-PLUS
  // 应用保活
  keep: {}, // keepLive实例
  keep2: {}, // keepLive实例2 只用到了原生定时器
  keepLive(callback) {
    // 判断服务是否已运行
    if (osg.keep.isRunning && osg.keep.isRunning()) return;

    // 创建KeepLive实例
    osg.keep = new KeepLive();

    // 设置通知栏
    osg.keep.setTitle('修链app正在后台提供服务'); // 设置通知标题
    osg.keep.setContent('请不要关闭app，以免影响派单'); // 设置通知内容
    // osg.keep.setLargeIcon("icon"); // 设置通知大图标名称
    osg.keep.setSmallIcon('icon'); // 设置通知小图标名称  图标路径uni_modules/android-keeplive/utssdk/app-android/res/drawable/
    osg.keep.hideNotification(false); // 隐藏通知提醒
    // TODO：当前不设置单独的推送通道，否则还需要对单独通道授权。待测试和正常的推送通知相互交叉时，是否会出现覆盖或重复等异常情况。
    // osg.keep.setChannelId('keeplive'); // 设置通知栏ChannelId
    osg.keep.setNotifaicationSoundEnable(false); // 关闭通知栏弹出声音

    // 使用WorkManager（Android推荐的后台任务管理工具）
    osg.keep.setWorkerEnabled(true);

    // 设置唤醒cpu类型 1：保持CPU运转，屏幕和键盘灯有可能是关闭的。
    osg.keep.setWakeLock(1, 'keeptag');

    osg.keep.register(); // 运行服务

    // TODO：当前不设置单独的推送通道，否则还需要对单独通道授权。待测试和正常的推送通知相互交叉时，是否会出现覆盖或重复等异常情况。
    // 检测是否开启了通知栏通知权限，需要在register和setChannelId之后判断
    // if (!osg.keep.checkAppNotification('keeplive')) {
    //   osg.keep.goNotificationSetting(); // 打开通知设置
    // }

    // 实测去掉忽略电池优化权限仍可以保活
    // if (!osg.keep.isIgnoringBatteryOptimizations()) {
    //   osg.keep.requestIgnoreBatteryOptimizations();
    // }

    setTimeout(() => {
      // 获取手机品牌，不同品牌对唤醒CPU和更新通知更新频率有要求
      // 华为 荣耀：不能快于20分钟1次
      // 小米 VIVO：不能快于3分钟1次
      let times = 3 * 60 * 1000;
      if (deviceBrand == 'huawei' || deviceBrand == 'honor') {
        times = 25 * 60 * 1000;
      }

      // 监听App前台/后台运行变更
      osg.keep.onAddBackgroundCallback(res => {
        // 删除日志
        console.log(res ? 'App正在前台运行' : 'App正在后台运行（含锁屏）');
        if (res) {
          // 前台运行时 取消定时
          osg.keep.cancleAleraTask();
        } else {
          // 后台运行时 添加定时
          osg.keep.startAleraTask(0, times, () => {
            // 定时唤醒CPU（超时锁）
            osg.keep.acquire(1000); // 1秒后唤醒CPU
            osg.keep.onExecThreadTask(() => {
              osg.keep.releaseAcquire(); // 释放cpu
              // 如果是通过acquire(long timeout)方法申请的超时锁，则会在到达时间后自动去释放。
              // 如果是通过acquire()方法申请的永久锁，则必须进行显式的释放，否则由于系统一直持有wakelock锁，将导致无法进入休眠状态，从而导致耗电过快等功耗问题。
            });

            // 定时更新通知栏
            osg.keep.hideNotification(false);
            osg.keep.setTitle('修链app正在后台提供服务');
            osg.keep.setContent('请不要关闭app，以免影响派单');
            osg.keep.setSmallIcon('icon');
            osg.keep.updateNotification();
          });
        }
      });

      // 每隔5分钟，检查是否有待上报离线数据
      osg.keep2 = new KeepLive();
      // android原生定时器 第1个参数 0：表示立即执行；第2个参数：循环时间，低于60秒有误差，建议70秒。
      // TODO:每隔5分钟检查一次待上报，定位5分钟才更新1次
      osg.keep2.startAleraTask(4 * 60 * 1000, 5 * 60 * 1000, () => {
        if (callback) callback();
      });
    }, 500);
  },
  // App权限判断
  // 支持android.permission全部值、支持其他自定义name
  checkPermission(name) {
    switch (name) {
      case 'notification':
        // 通知
        if (osName == 'ios') {
          return permision.judgeIosPermission('push'); // true,false
        } else {
          var main = plus.android.runtimeMainActivity();
          var NotificationManagerCompat = plus.android.importClass(
            'android.support.v4.app.NotificationManagerCompat'
          );
          //android.support.v4升级为androidx
          if (NotificationManagerCompat == null) {
            NotificationManagerCompat = plus.android.importClass(
              'androidx.core.app.NotificationManagerCompat'
            );
          }
          return NotificationManagerCompat.from(main).areNotificationsEnabled(); // true,false
        }
      case 'locationService':
        // 是否已开启定位服务，不区分android和ios
        return permision.checkSystemEnableLocation();
      case 'location':
        // 是否开启定位权限，仅ios进入此判断
        // permision.judgeIosPermission('push'); // 无法区分是”使用App期间“还是”始终“允许
        // let res = uni.getAppAuthorizeSetting().locationAuthorized; // 无法区分是”使用App期间“还是”始终“允许
        var CLLocationManager = plus.ios.import('CLLocationManager');
        var manager = new CLLocationManager();
        var res = CLLocationManager.authorizationStatus();
        plus.ios.deleteObject(manager);
        plus.ios.deleteObject(CLLocationManager);
        console.log('location', res);
        // 位置授权状态 res 0：下次询问（未选择） 1：应用定位功能被系统限制 2：永不（已拒绝） 3：始终 4：使用App期间
        // 当res为0时，由于未申请过定位权限，即使跳转至应用设置页面也看不到定位权限，无法开启，所以不展示授权项。
        // 当locationService为false时，res始终为2，所以return true不展示授权项。
        if (res == 0) {
          // 未选择过
          uni.getLocation({
            type: 'gcj02',
            isHighAccuracy: true,
            complete: () => {
              // 此处通过CLLocationManager.authorizationStatus()获取授权状态值res不准确，所以不获取具体值。
              // 无论成功或失败均返回false，目的是请求一次定位，才能在应用设置页面看到位置选项。
              return false;
            }
          });
        } else if (res != 3) {
          // 只要未选择“始终允许”，必须手动设置为始终允许。
          // 此处API有问题：当getLocation弹出授权窗口，选择“使用App时允许”后，会自动将授权状态改为3（其实值应该是4），即使杀掉app重新进入，res仍是3，除非手动切换授权状态才会更新为正确的值。
          // 上面问题会导致，无法判断是选择了“使用App期间”还是“始终”。
          // 目前只能做到首次授权弹窗，不管选择任何值都return false，引导到位置设置页面选择“始终”，即使未修改为“始终”，返回App页面弹窗判断值为3也会自动关闭。
          return false;
        } else {
          return true;
        }
      default:
        // 其他（支持android.permission全部值、支持其他自定义name）
        if (osName == 'ios') {
        } else {
          // 获取当前活动的上下文
          let context = plus.android.runtimeMainActivity();
          // 调用checkSelfPermission来检查权限，返回值 0：已授权 -1：未授权
          let res = context.checkSelfPermission('android.permission.' + name);
          if (res == 0) {
            res = true;
          } else if (res == -1) {
            res = false;
          }
          console.log('检查权限 ' + name, res);
          return res;
        }
    }
  },
  async requestPermission(name) {
    switch (name) {
      case 'systemSetting':
        // 系统设置
        if (osName == 'ios') {
          var UIApplication = plus.ios.import('UIApplication');
          var application2 = UIApplication.sharedApplication();
          var NSURL2 = plus.ios.import('NSURL');
          var setting2 = NSURL2.URLWithString('app-settings:');
          application2.openURL(setting2);

          plus.ios.deleteObject(setting2);
          plus.ios.deleteObject(NSURL2);
          plus.ios.deleteObject(application2);
        } else {
          var main = plus.android.runtimeMainActivity(); //获取activity
          var Intent = plus.android.importClass('android.content.Intent');
          var Settings = plus.android.importClass('android.provider.Settings');
          var intent = new Intent(Settings.ACTION_SETTINGS); //可设置表中所有Action字段
          main.startActivity(intent);
        }
        break;
      case 'appSetting':
        // 应用设置
        permision.gotoAppPermissionSetting();
        break;
      case 'notification':
        // 通知
        if (osName == 'ios') {
          uni.openAppAuthorizeSetting();
        } else {
          var main = plus.android.runtimeMainActivity();
          var pkName = main.getPackageName();
          var uid = main.getApplicationInfo().plusGetAttribute('uid');
          // 未开通‘允许通知’权限，跳转到系统设置页面进行设置
          var Intent = plus.android.importClass('android.content.Intent');
          var Build = plus.android.importClass('android.os.Build');
          //android 8.0引导
          if (Build.VERSION.SDK_INT >= 26) {
            var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
            intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
          } else if (Build.VERSION.SDK_INT >= 21) {
            //android 5.0-7.0
            var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
            intent.putExtra('app_package', pkName);
            intent.putExtra('app_uid', uid);
          } else {
            //(<21)其他--跳转到该应用管理的详情页
            var Settings = plus.android.importClass('android.provider.Settings');
            var Uri = plus.android.importClass('android.net.Uri');
            var intent = new Intent();
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            var uri = Uri.fromParts('package', main.getPackageName(), null);
            intent.setData(uri);
          }
          main.startActivity(intent); // 跳转到系统设置中此应用的通知设置页面
        }
        break;
      case 'locationService':
        // 定位服务
        if (osName == 'ios') {
          // 从iOS10开始，苹果禁止了通过URL Scheme直接跳转到系统设置的具体页面，只能跳转到系统设置页面
          var UIApplication = plus.ios.import('UIApplication');
          var NSURL = plus.ios.import('NSURL');
          var application = UIApplication.sharedApplication();
          var settingUrl = NSURL.URLWithString('App-Prefs:');
          // 使用新的 API
          var options = plus.ios.newObject('NSDictionary');
          plus.ios.invoke(
            application,
            'openURL:options:completionHandler:',
            settingUrl,
            options,
            null
          );
          // 清理内存
          plus.ios.deleteObject(options);
          plus.ios.deleteObject(settingUrl);
          plus.ios.deleteObject(application);
          plus.ios.deleteObject(UIApplication);
          plus.ios.deleteObject(NSURL);
        } else {
          var main = plus.android.runtimeMainActivity();
          var Intent = plus.android.importClass('android.content.Intent');
          var Settings = plus.android.importClass('android.provider.Settings');
          var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
          main.startActivity(intent);
        }
        break;
      case 'location':
        // 开启定位权限 仅ios进入此判断
        console.log('location');
        uni.openAppAuthorizeSetting();
        // permision.gotoAppPermissionSetting(); // 实测iOS18无效
        break;
      default:
        // 其他（支持android.permission全部值、支持其他自定义name）
        if (osName == 'ios') {
          var app = plus.ios.invoke('UIApplication', 'sharedApplication');
          // 打开系统定位服务设置页面
          var setting = plus.ios.invoke(
            'NSURL',
            'URLWithString:',
            'App-Prefs:root=Privacy&path=LOCATION'
          );
          plus.ios.invoke(app, 'openURL:', setting);
          plus.ios.deleteObject(setting);
          plus.ios.deleteObject(app);
        } else {
          let res = await permision.requestAndroidPermission('android.permission.' + name); // 1：已授权，0：未授权，其他值：永久拒绝
          console.log('request ' + name, res);
          // 始终拒绝时跳转应用设置页面
          if (res != 1 && res != 0) {
            osg.alert(
              '由于您拒绝过此授权，需要在弹出的应用设置页面中，找到「权限管理」再手动打开对应权限。',
              () => {
                permision.gotoAppPermissionSetting();
              }
            );
          }
          return res;
        }
    }
  },
  // Android当申请权限时，会在页面顶部显示申请权限的目的
  setPermissionTips(tips) {
    setRequestPermissionTips(tips || permissionTips);
  },
  registerPermissionTipsListener() {
    registerRequestPermissionTipsListener({
      onRequest: e => {},
      onConfirm: e => {},
      onComplete: e => {
        if (true) {
          setRequestPermissionTips(); // 更新弹框提醒，防止华为手机不出现权限申请框时权限提醒框闪烁的情况
        }
      }
    });
  },
  unregisterPermissionTipsListener() {
    unregisterRequestPermissionTipsListener();
  },
  // #endif
  // 查找在工单列表展示的菜单，并将菜单url参数处理为对象
  getSAMenu(items) {
    let results = [];
    for (let item of items) {
      if (item.functionList && item.functionList.length > 0) {
        // 递归查找末级菜单
        results = results.concat(osg.getSAMenu(item.functionList));
      } else if (item.exts && item.exts.tabDisplay === '1') {
        // 找到在列表展示的工单菜单，处理url参数为对象
        if (item.action && item.action.indexOf('/serviceAppointment/serviceAppointments') != -1) {
          let params = {};
          if (item.action.indexOf('?') != -1) {
            let paramsString = item.action.split('?')[1];
            let paramArray = paramsString.split('&');
            paramArray.map(item => {
              params[item.split('=')[0]] = item.split('=')[1];
            });
          }
          item.orderState = params.orderState || '';
          item.status = params.status || '';
          item.type = params.type || '';
          results.push(item);
        }
      }
    }
    results.sort((a, b) => a.order - b.order); // 按菜单编号正序排序
    return results;
  },
  pushEventState: false, // 防止tabbar刷新后重复监听
  // 监听消息推送
  pushEvent(res) {
    if (osg.pushEventState) return;
    osg.pushEventState = true;
    uni.onPushMessage(res => {
      if (res.type == 'click' && res.data.payload && res.data.payload.url) {
        switch (res.data.payload.routerMode) {
          case 'switchTab':
            uni.switchTab({
              url: res.data.payload.url
            });
            break;
          case 'redirectTo':
            uni.redirectTo({
              url: res.data.payload.url
            });
            break;
          case 'reLaunch':
            uni.reLaunch({
              url: res.data.payload.url
            });
            break;
          default:
            uni.navigateTo({
              url: res.data.payload.url
            });
        }
      }
    });
  }
};
module.exports.osg = osg;
