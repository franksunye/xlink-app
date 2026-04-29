var common = require('../js/common.js');

export default {
  data() {
    return {
      systemInfo: {},
      user: {},
      // 地理位置上报
      position: {
        debug: false, // 是否开启调试
        logShow: false, // 是否显示调试日志
        log: [], // 调试日志
        isConnected: true, // 当前是否有网络连接
        longitude: null, // 最新经度
        latitude: null, // 最新维度
        reReportList: [], // 待上报数据
        isReReporting: false, // 是否正在重新上报
        reRePortTimer: null // iOS主动定时检查待上报
      },
      // 授权管理
      permission: {
        show: true,
        data: [
          // order：排序
          // permission：权限名称（必填，支持android.permission全部值、支持其他自定义name）
          // prePermission：需先开启指定权限才能开启此权限（非必填）
          // request：是否必须授权，不授权不允许关闭
          // granted：是否已授权（true：已授权，false：未授权，'check'：无法判断，需要自行检查，点击按钮打开系统设置页面）
          // title：权限明细
          // description：权限描述
          // icon：vant图标
          // showType：判断是否展示（unauthorized：未授权才展示）
          // osName：适用的操作系统名称（ios、android）
          // osIOSVersion：适用的iOS系统版本（值为数组，数组第1位表示系统版本最小值，数组第2位表示系统版本最大值，如果值为null表示不限制；如果数组值超过2个，表示仅指定的系统版本适用。）
          // osAndroidVersion：适用的Android系统版本（值为数组，数组第1位表示系统版本最小值，数组第2位表示系统版本最大值，如果值为null表示不限制；如果数组值超过2个，表示仅指定的系统版本适用。）
          // osAndroidAPILevel：适用的Android系统API库的版本（当前1~35；值为数组，数组第1位表示APILevel最小值，数组第2位表示APILevel最大值，如果值为null表示不限制；如果数组值超过2个，表示仅指定的APILevel适用。）
          // deviceBrand：适用的设备品牌
          // roleIds：指定角色id需要授权
          // excludedRoleIds：指定角色id不需要授权：指定角色id不需要授权
          {
            order: 1,
            permission: 'notification',
            request: true,
            granted: false,
            showType: 'unauthorized',
            excludedRoleIds: ['7508867733715728438', '2502061015987080147'], // 测试和正式环境的“管家App”角色id
            title: '通知',
            description: '用于接收派单和提醒等消息通知',
            icon: 'volume-o'
          },
          {
            order: 2,
            permission: 'systemSetting',
            osName: ['android'],
            request: true,
            granted: 'check',
            showType: 'unauthorized',
            deviceBrand: ['huawei', 'honor'],
            roleIds: ['3481370558631265818'],
            title: '应用启动管理',
            description:
              '请在「手机设置-应用-应用启动管理-找到吉柿修房」关闭自动管理、打开“允许后台活动”（如已设置请忽略）',
            icon: 'setting-o'
          },
          {
            order: 3,
            permission: 'locationService',
            osName: ['android'],
            request: true,
            granted: false,
            showType: 'unauthorized',
            roleIds: ['3481370558631265818'],
            title: 'GPS定位服务',
            description: '用于工单导航',
            icon: 'guide-o'
          },
          {
            order: 3,
            permission: 'locationService',
            osName: ['ios'],
            request: true,
            granted: false,
            showType: 'unauthorized',
            roleIds: ['3481370558631265818'],
            title: 'GPS定位服务',
            description: '请在「设置-隐私与安全性-定位服务」开启定位服务',
            icon: 'guide-o'
          },
          {
            order: 4,
            permission: 'location',
            prePermission: ['locationService'],
            osName: ['ios'],
            request: true,
            granted: false,
            showType: 'unauthorized',
            roleIds: ['3481370558631265818'],
            title: '定位权限',
            description: '请在「应用设置-位置」选择“始终”',
            icon: 'location-o'
          },
          {
            order: 4,
            permission: 'ACCESS_FINE_LOCATION',
            osName: ['android'],
            request: true,
            granted: false,
            showType: 'unauthorized',
            roleIds: ['3481370558631265818'],
            title: 'app打开时定位',
            description: '需选择“仅使用期间允许”，app才能够获取定位信息',
            icon: 'location-o'
          },
          {
            order: 5,
            permission: 'ACCESS_BACKGROUND_LOCATION',
            prePermission: ['locationService', 'ACCESS_FINE_LOCATION'],
            osName: ['android'],
            osAndroidVersion: [10, null],
            request: true,
            granted: false,
            showType: 'unauthorized',
            title: 'app后台运行时定位',
            roleIds: ['3481370558631265818'],
            description: '需选择“始终允许”，app后台运行时才能够获取定位信息',
            icon: 'location-o'
          }
        ]
      }
    };
  },
  methods: {
    onNetworkStatusChange(res) {
      this.position.isConnected = res.isConnected; // 更新网络连接状态
      if (res.isConnected) {
        // 日志-网络状态变更
        if (this.position.debug) {
          this.position.log.push(
            `${common.osg.readableTime(null, 'time')} 网络恢复连接，尝试重新上报离线数据`
          );
          console.log(
            `${common.osg.readableTime(null, 'time')} 网络恢复连接，尝试重新上报离线数据`
          );
        }

        this.checkReReportPosition();
      }

      // 日志-当前网络状态
      if (this.position.debug) {
        this.position.log.push(
          `${common.osg.readableTime(null, 'time')} 当前网络：${res.networkType} ${
            res.isConnected ? '已连接' : '未连接'
          }`
        );
        console.log(
          `${common.osg.readableTime(null, 'time')} 当前网络：${res.networkType} ${
            res.isConnected ? '已连接' : '未连接'
          }`
        );
      }
    },
    // 监听设备位置变化信息
    startWatchPosition() {
      const app = getApp(); // 在方法中重新获取app实例
      this.systemInfo = app.globalData.systemInfo;
      this.user = wx.getStorageSync('user');
      this.position.debug = (this.user.exts && this.user.exts.positionDebug) || false;

      // 不重复监听位置变更
      if (app.globalData.watchId) {
        return;
      }

      // 开启监听时，检查缓存中有没有待上报离线数据
      if (this.position.reReportList.length == 0) {
        this.position.reReportList = uni.getStorageSync('reReportPositionList') || [];
        this.checkReReportPosition();
      }

      // 监听网络状态变更，支持离线获取 在线上传（避免多个网络监听器，所以先取消监听再设置监听）
      uni.offNetworkStatusChange(this.onNetworkStatusChange);
      uni.onNetworkStatusChange(this.onNetworkStatusChange);

      // 监听设备位置变化信息
      // 位置信息将通过手机GPS设备或其它信息如IP地址、移动网络信号获取。
      let lastTime = 0; // 节流
      app.globalData.watchId = plus.geolocation.watchPosition(
        position => {
          // 华为、荣耀、苹果手机有同时触发2次的问题，此处节流处理；节流时间要小于更新时间maximumAge；
          if (
            this.systemInfo.deviceBrand == 'huawei' ||
            this.systemInfo.deviceBrand == 'honor' ||
            this.systemInfo.deviceBrand == 'apple'
          ) {
            let currentTime = new Date().getTime();
            if (currentTime - lastTime < 1000 * 60 * 4.5) {
              return;
            } else {
              lastTime = currentTime;
            }
          }

          // 经纬度保留5位小数，约精确到米。
          let latitude = position.coords.latitude.toFixed(5);
          let longitude = position.coords.longitude.toFixed(5);

          // 即使未变更也上报，Android即使未变更也会定时触发，iOS变更才会触发
          // if (this.position.latitude != latitude || this.position.longitude != longitude) {
          this.position.latitude = latitude;
          this.position.longitude = longitude;
          this.reportPosition(latitude, longitude);
          // }
        },
        err => {
          // 日志-监听位置变更失败
          if (this.position.debug) {
            this.position.log.push(
              `${common.osg.readableTime(null, 'time')} 监听位置变更失败 原因：${JSON.stringify(
                err
              )}`
            );
            console.log(
              `${common.osg.readableTime(null, 'time')} 监听位置变更失败 原因：${JSON.stringify(
                err
              )}`
            );
          }

          // 先停止监听设备位置变更，再重新启动（主动重启监听，解决实测多次失败后，无法再次激活 watchPosition）
          // setTimeout解决定位服务关闭时，会频繁触发err频繁启动startWatchPosition
          setTimeout(() => {
            plus.geolocation.clearWatch(app.globalData.watchId);
            app.globalData.watchId = null;
            this.startWatchPosition();
          }, 60000);
        },
        {
          enableHighAccuracy: true, // 是否高精度获取位置信息
          // timeout: 1000 * 60 * 10, // 获取位置信息的超时时间 单位为毫秒（ms），默认值为不超时。如果在指定的时间内没有获取到位置信息则触发错误回调函数。
          // maximumAge: 1000 * 60, // 获取（更新）位置信息的间隔时间 单位为毫秒（ms），默认值为1000。iOS平台根据设备位置变化自动计算回调更新的间隔时间。
          maximumAge: 1000 * 60 * 5, // 获取（更新）位置信息的间隔时间 单位为毫秒（ms），默认值为1000。iOS平台根据设备位置变化自动计算回调更新的间隔时间。
          provider: 'amap', // 优先使用的定位模块，默认值按以下优先顺序获取（amap>baidu>system），若指定的provider不存在或无效则返回错误回调
          coordsType: 'gcj02', // 指定获取的定位数据坐标系类型 amap：gcj02，baidu：支持gcj02/bd09/bd09ll，system：wgs84
          geocode: false // 是否解析地址信息
        }
      );
      if (this.systemInfo.osName == 'ios') {
        clearInterval(this.position.reRePortTimer);
        this.position.reRePortTimer = setInterval(() => {
          this.reRePortTimer();
        }, 1000 * 60 * 5);
      } else {
        common.osg.keepLive(() => {
          this.reRePortTimer();
        });
      }

      // #ifdef MP-WEIXIN
      // common.osg.startLocationUpdateBackground(() => {
      //   console.log('startLocationUpdateBackground');
      //   // 控制地理位置变更触发频率
      //   this.timer = setInterval(() => {
      //     wx.onLocationChange(res => {
      //       console.log('onLocationChange');
      //       this.position.latitude.toFixed(5), res.position.longitude.toFixed(5));
      //       wx.offLocationChange();
      //     });
      //   }, 30000);
      // });
      // #endif
    },
    // 位置上报
    // 测试位置：日坛国际 '39.919768','116.441518'；朝阳门 '39.91634','116.43317'；天安门 '39.90882','116.39747'
    reportPosition(latitude, longitude) {
      // 当前没有网络连接，不调用后台接口，直接插入待上报队列
      if (!this.position.isConnected) {
        // 日志-当前无网络连接
        if (this.position.debug) {
          this.position.log.push(
            `${common.osg.readableTime(null, 'time')} 当前无网络连接：${latitude},${longitude}`
          );
          console.log(
            `${common.osg.readableTime(null, 'time')} 当前无网络连接：${latitude},${longitude}`
          );
        }

        this.position.reReportList.push({
          latitude,
          longitude,
          ts: common.osg.readableTime(),
          // errorMessage: '当前无网络连接',
          reported: false
        });
        // TODO:不在此缓存待上报的数据，由原生定时器缓存
        // uni.setStorageSync('reReportPositionList', this.position.reReportList);
        return;
      }
      common.osg.ajax(
        '/biz/punch/dot',
        {
          longitude,
          latitude,
          ts: common.osg.readableTime()
        },
        () => {
          // 日志-上报成功
          if (this.position.debug) {
            this.position.log.push(
              `${common.osg.readableTime(null, 'time')} 上报成功：${latitude},${longitude}`
            );
            console.log(
              `${common.osg.readableTime(null, 'time')} 上报成功：${latitude},${longitude}`
            );
          }
        },
        {
          noload: true,
          fail: err => {
            // 保存待上报的数据
            this.position.reReportList.push({
              latitude,
              longitude,
              ts: common.osg.readableTime(),
              // errorMessage: '请求失败 ' + JSON.stringify(err),
              reported: false
            });
            // TODO:不再此缓存待上报的数据，由原生定时器缓存
            // uni.setStorageSync('reReportPositionList', this.position.reReportList);

            // 日志-上报失败
            if (this.position.debug) {
              this.position.log.push(
                `${common.osg.readableTime(
                  null,
                  'time'
                )} 上报失败：${latitude},${longitude} ${JSON.stringify(err)}`
              );
              console.log(
                `${common.osg.readableTime(
                  null,
                  'time'
                )} 上报失败：${latitude},${longitude} ${JSON.stringify(err)}`
              );
            }
          }
        }
      );
    },
    // 定时检查网络、离线上报
    reRePortTimer() {
      // 日志-定时唤醒
      if (this.position.debug) {
        this.position.log.push(
          `${common.osg.readableTime(null, 'time')} 5分钟定时器 检查网络和待上报`
        );
        console.log(`${common.osg.readableTime(null, 'time')} 5分钟定时器 检查网络和待上报`);
      }

      // 原生定时器 每隔5分钟执行1次
      // 1.检查当前网络状态是否连接，避免网络变更监听器未正常触发
      // 2.检查是否有待上报的离线数据 进行上报，上报后仍不成功的会进行缓存
      uni.getNetworkType({
        success: res => {
          this.position.isConnected = res.networkType !== 'none';
          // 日志-当前网络状态
          if (this.position.debug) {
            this.position.log.push(
              `${common.osg.readableTime(null, 'time')} 当前网络：${res.networkType} ${
                this.position.isConnected ? '已连接' : '未连接，不检查待上报'
              }`
            );
            console.log(
              `${common.osg.readableTime(null, 'time')} 当前网络：${res.networkType} ${
                this.position.isConnected ? '已连接' : '未连接，不检查待上报'
              }`
            );
          }

          if (this.position.isConnected) {
            this.checkReReportPosition();
          }
        }
      });
    },
    // 循环上报离线数据
    async checkReReportPosition() {
      if (this.position.isReReporting) return; // 正在异常上报中不执行
      if (this.position.reReportList.length == 0) {
        // 日志-没有待上报的数据
        if (this.position.debug) {
          this.position.log.push(`${common.osg.readableTime(null, 'time')} 没有待上报的数据`);
          console.log(`${common.osg.readableTime(null, 'time')} 没有待上报的数据`);
        }

        return;
      }

      this.position.isReReporting = true; // 正在重新上报

      // 日志-开始重新上报
      if (this.position.debug) {
        this.position.log.push(`${common.osg.readableTime(null, 'time')} 开始重新上报`);
        console.log(`${common.osg.readableTime(null, 'time')} 开始重新上报`);
      }

      for (let item of this.position.reReportList) {
        // 未上报成功的
        if (!item.reported && this.position.isConnected) {
          await this.reReportPosition(item);
        }
      }

      // 过滤剩余仍未上报成功的数据，并缓存
      let total = this.position.reReportList.length;
      this.position.reReportList = this.position.reReportList.filter(item => !item.reported);
      let failNumber = this.position.reReportList.length;
      let successNumber = total - failNumber;
      // 缓存待上报的数据
      uni.setStorageSync('reReportPositionList', this.position.reReportList);
      this.position.isReReporting = false;

      // 日志-结束重新上报
      if (this.position.debug) {
        this.position.log.push(
          `${common.osg.readableTime(
            null,
            'time'
          )} 结束重新上报 成功${successNumber}条，失败${failNumber}条`
        );
        console.log(
          `${common.osg.readableTime(
            null,
            'time'
          )} 结束重新上报 成功${successNumber}条，失败${failNumber}条`
        );
      }
    },
    // 上报离线数据
    reReportPosition(item) {
      return new Promise((resolve, reject) => {
        common.osg.ajax(
          '/biz/punch/dot',
          {
            longitude: item.longitude,
            latitude: item.latitude,
            ts: item.ts
            // errorMessage: item.errorMessage
          },
          () => {
            item.reported = true; // 重新上报成功

            // 日志-重新上报成功
            if (this.position.debug) {
              this.position.log.push(
                `${common.osg.readableTime(null, 'time')} 重新上报 成功：${item.latitude},${
                  item.longitude
                }`
              );
              console.log(
                `${common.osg.readableTime(null, 'time')} 重新上报 成功：${item.latitude},${
                  item.longitude
                }`
              );
            }

            resolve();
          },
          {
            noload: true,
            fail: err => {
              // 日志-重新上报失败
              if (this.position.debug) {
                this.position.log.push(
                  `${common.osg.readableTime(null, 'time')} 重新上报 失败：${item.latitude},${
                    item.longitude
                  } ${JSON.stringify(err)}`
                );
                console.log(
                  `${common.osg.readableTime(null, 'time')} 重新上报 失败：${item.latitude},${
                    item.longitude
                  } ${JSON.stringify(err)}`
                );
              }

              resolve();
            }
          }
        );
      });
    }
  }
};
