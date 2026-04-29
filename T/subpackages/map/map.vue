<template>
  <view style="height: 100vh; display: flex; flex-direction: column">
    <van-notice-bar
      wrapable
      :scrollable="false"
      text="①请您在带好商品后出发时，点击“开始送货”。②在送达商品时，点击“到达目的地”。③后台调度人员可在PC端查看您当前位置和每次的配送路径，便于商品的配送调度。"
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
      <van-button type="info" round @click="start" v-if="!running">开始送货</van-button>
      <van-button type="primary" round @click="end" v-else>到达目的地</van-button>
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
