<template>
  <view style="height: 100vh; display: flex; flex-direction: column" @click.capture="track">
    <van-notice-bar
      wrapable
      :scrollable="false"
      text="①请您在接到订货电话后，带好货物，点击“开始送货”。②在送达货物时，点击“到达目的地”。③后台调度人员可在PC端查看您当前位置和每次的配送路径，便于货物的配送调度。"
    />
    <map
      style="width: 100vw; flex: 1"
      :longitude="longitude"
      :latitude="latitude"
      :includePoints="markers"
      :markers="markers"
      :polyline="polyline"
    ></map>
    <view style="text-align: center; padding: 5px">
      <van-button
        type="info"
        round
        @click="start"
        v-if="!running"
        :data-event="{ id: 'RQOwHWLDGb' }"
      >
        开始送货
      </van-button>
      <van-button type="primary" round @click="end" v-else :data-event="{ id: 'f1KELSGG1O' }">
        到达目的地
      </van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      running: false,
      longitude: '',
      latitude: '',
      polyline: [
        {
          color: '#FB8337',
          width: 5,
          points: []
        }
      ],
      markers: []
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    // 以当前定位设置地图中心经纬度
    common.osg.getLocation(res => {
      this.latitude = res.latitude;
      this.longitude = res.longitude;
      this.markers.push({
        latitude: res.latitude,
        longitude: res.longitude,
        width: '20',
        height: '30'
      });
    });
  },
  onShow() {
    console.log('onShow');
  },
  onHide() {
    console.log('onHide');
  },
  onUnload() {
    console.log('onUnload');
  },
  methods: {
    // 出发后，将当前位置存入polyline的points，开启实时地理位置监听
    start() {
      let that = this;
      common.osg.getLocation(res => {
        console.log('获取当前位置', res);
        that.polyline = [
          {
            color: '#FB8337',
            width: 5,
            points: [
              {
                longitude: res.longitude,
                latitude: res.latitude
              }
            ]
          }
        ];
        that.markers = [
          {
            latitude: res.latitude,
            longitude: res.longitude,
            width: '20',
            height: '30'
          }
        ];
        // 开启实时地理位置监听
        // #ifdef MP-WEIXIN
        common.osg.startLocationUpdateBackground(() => {
          that.running = true;
          wx.onLocationChange(result => {
            let now = new Date();
            console.log(
              `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} 位移返回值 latitude:${
                result.latitude
              },longitude:${result.longitude}`
            );
            that.polyline[0].points.push({
              latitude: result.latitude,
              longitude: result.longitude
            });
          });
        });
        // #endif

        // #ifdef APP-PLUS
        // 不重复监听位置变更
        if (app.globalData.watchId) {
          return;
        }
        // 监听设备位置变化信息
        let lastTime = 0; // 节流
        app.globalData.watchId = plus.geolocation.watchPosition(
          position => {
            that.running = true;
            // 经纬度保留5位小数，约精确到米。
            let latitude = position.coords.latitude.toFixed(5);
            let longitude = position.coords.longitude.toFixed(5);

            let now = new Date();
            console.log(
              `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} 位移返回值 latitude:${latitude},longitude:${longitude}`
            );
            common.osg.toast(latitude + ',' + longitude, 'none');
            that.polyline[0].points.push({
              latitude: latitude,
              longitude: longitude
            });
          },
          err => {
            // 日志-监听位置变更失败
            console.log(
              `${common.osg.readableTime(null, 'time')} 监听位置变更失败 原因：${JSON.stringify(
                err
              )}`
            );

            // 先停止监听设备位置变更，再重新启动（主动重启监听，解决实测多次失败后，无法再次激活 watchPosition）
            // setTimeout解决定位服务关闭时，会频繁触发err频繁启动startWatchPosition
            setTimeout(() => {
              plus.geolocation.clearWatch(app.globalData.watchId);
              app.globalData.watchId = null;
              this.start();
            }, 60000);
          },
          {
            enableHighAccuracy: true, // 是否高精度获取位置信息
            // timeout: 1000 * 60 * 10, // 获取位置信息的超时时间 单位为毫秒（ms），默认值为不超时。如果在指定的时间内没有获取到位置信息则触发错误回调函数。
            maximumAge: 1000 * 10, // 获取（更新）位置信息的间隔时间 单位为毫秒（ms），默认值为1000。iOS平台根据设备位置变化自动计算回调更新的间隔时间。
            // maximumAge: 1000 * 60 * 5, // 获取（更新）位置信息的间隔时间 单位为毫秒（ms），默认值为1000。iOS平台根据设备位置变化自动计算回调更新的间隔时间。
            provider: 'amap', // 优先使用的定位模块，默认值按以下优先顺序获取（amap>baidu>system），若指定的provider不存在或无效则返回错误回调
            coordsType: 'gcj02', // 指定获取的定位数据坐标系类型 amap：gcj02，baidu：支持gcj02/bd09/bd09ll，system：wgs84
            geocode: false // 是否解析地址信息
          }
        );
        // #endif
      });
    },
    end() {
      let that = this;
      this.running = false;
      wx.offLocationChange();
      wx.stopLocationUpdate();
      that.markers.push(
        Object.assign(that.polyline[0].points[that.polyline[0].points.length - 1], {
          width: '20',
          height: '30'
        })
      );
    }
  }
};
</script>

<style></style>
