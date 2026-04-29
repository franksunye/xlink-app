<template>
  <view class="amap" @click.capture="track">
    <!-- 搜索 -->
    <van-search
      :value="searchValue"
      placeholder="搜索地点"
      show-action
      shape="round"
      @change="onChange"
      @search="onSearch"
      @cancel="onCancel"
    />
    <view
      class="content"
      style="height: calc(100vh - 54px); overflow-y: auto; display: flex; flex-direction: column"
    >
      <!-- 地图 -->
      <map
        v-if="mapShow"
        class="map"
        :latitude="latitude"
        :longitude="longitude"
        :markers="markers"
        @tap="onTap"
        :scale="16"
        title="map"
      />
      <!--  地点列表 -->
      <view class="list">
        <van-cell
          v-for="(add, index) in poisData"
          :key="add.id"
          :title="add.name"
          :label="(add.district || '') + (add.address || '')"
          size="large"
          value-class="cell-value"
          @click="onSelect(add, index)"
        />
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
const amapFile = require('../../resources/js/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({
  key: '1e633f3e3fafca9b3af9a6870da9afd8'
});
export default {
  data() {
    return {
      mapShow: false,
      searchValue: '',
      longitude: null, // 经度
      latitude: null, // 纬度
      markers: [], // 地图标记点
      poisData: [] // 地图列表
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    // 获取当前定位点
    uni.getLocation({
      type: 'gcj02',
      geocode: false, // 是否解析地址信息
      success: res => {
        if (res.errMsg == 'getLocation:ok') {
          this.longitude = res.longitude;
          this.latitude = res.latitude;
          this.$set(this.markers, 0, {
            longitude: res.longitude,
            latitude: res.latitude
          });
          this.mapShow = true;
        }
      },
      complete: () => {
        // 获取当前位置的地点列表
        myAmapFun.getPoiAround({
          location: this.longitude + ',' + this.latitude,
          success: res => {
            this.poisData = res.poisData;
          },
          fail: error => {
            console.log('getPoiAroundError', error);
          }
        });
      }
    });
  },
  methods: {
    // 修改关键词
    onChange(e) {
      this.searchValue = e.detail;
    },
    // 根据关键词搜索地点
    onSearch() {
      myAmapFun.getInputtips({
        keywords: this.searchValue,
        location: this.longitude + ',' + this.latitude,
        success: data => {
          if (data && data.tips) {
            this.poisData = data.tips;
          }
        },
        fail: error => {
          console.log('getInputtipsError', error);
        }
      });
    },
    // 取消关键词搜索，返回附近地点
    onCancel() {
      if (this.searchValue) {
        this.searchValue = '';
        myAmapFun.getPoiAround({
          location: this.markers[0].longitude + ',' + this.markers[0].latitude,
          success: data => {
            this.poisData = data.poisData;
          },
          fail: error => {
            console.log('getPoiAroundError', error);
          }
        });
      }
    },
    // 选择地址列表中的地点
    onSelect(add, index) {
      if (!add) return;
      // 更新标记点
      let location = add.location.split(',');
      this.markers[0].longitude = +location[0];
      this.markers[0].latitude = +location[1];
      // 将选取的地点信息传回到上一个页面
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.$vm.mapData = {
        address: add.name,
        location: add.location
      };
      wx.navigateBack({
        delta: 1
      });
    },
    // 在地图上点击选点
    onTap(e) {
      // 更新标记点
      this.markers[0].latitude = e.detail.latitude;
      this.markers[0].longitude = e.detail.longitude;
      // 查询标记点附近的地点列表
      myAmapFun.getPoiAround({
        location: e.detail.longitude + ',' + e.detail.latitude,
        success: data => {
          this.poisData = data.poisData;
        },
        fail: error => {
          console.log('getPoiAroundError', error);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.amap {
  .content {
    height: calc(100vh - 54px);
    display: flex;
    flex-direction: column;
    .map {
      width: 100vw;
      flex: 1;
    }
    .list {
      flex: 1;
      overflow-y: auto;
      ::v-deep .cell-value {
        display: none !important;
      }
    }
  }
}
</style>
