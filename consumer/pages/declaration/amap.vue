<template>
  <view class="content">
    <uni-search-bar
      v-model="searchWords"
      radius="100"
      placeholder="搜索地点"
      clearButton="none"
      @input="searchFn"
    />
    <!-- 地图部分 -->
    <view class="content-map">
      <map
        v-if="mapFlafg"
        style="width: 100%; height: 100%"
        :latitude="latitude"
        :longitude="longitude"
        :markers="markers"
        @tap="tap"
        :scale="16"
        :title="title"
      />
    </view>
    <!-- <view id="container"></view> -->
    <!--  搜索框 -->

    <!--  地点列表部分 -->
    <view class="list">
      <view
        class="item"
        v-for="(add, index) in dataTips"
        :key="add.id"
        @click="select(add, index)"
        :class="selectIndex == index ? 'active' : ''"
      >
        <view class="name">{{ add.name }}</view>
        <view class="address">{{ add.district || '' }}{{ add.address || '' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
const amapFile = require('../../common/amap-wx.js');

var myAmapFun = new amapFile.AMapWX({
  key: '1e633f3e3fafca9b3af9a6870da9afd8'
});
export default {
  data() {
    return {
      mapFlafg: false,
      selectIndex: undefined,
      selectAddr: {},
      searchWords: '',
      id: 1, // 使用 marker点击事件 需要填写id
      title: 'map',
      latitude: 39.91667, // 纬度
      longitude: 116.41667, // 经度

      markers: [
        {
          latitude: 39.91667, // 纬度
          longitude: 116.41667, // 经度
          width: 30,
          height: 30,
          iconPath: ''
          // iconPath: '../../static/images/marker.png'
        }
      ],
      dataTips: [],
      mapdata: {}
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    // this.location();
    var self = this;
    uni.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res, '当前地址定位');
        if (res.errMsg == 'getLocation:ok') {
          console.log(self.mark, 'onload里面看看');
          self.longitude = res.longitude;
          self.latitude = res.latitude;
          self.$set(self.markers[0], 'longitude', res.longitude);
          self.$set(self.markers[0], 'latitude', res.latitude);
          self.mapFlafg = true;
          console.log(self.markers, 'markers');
          // self.markers[0].longitude = res.longitude;
          // self.markers[0].latitude = res.latitude;
        }
      },
      complete: () => {
        // 获取当前位置的地点列表
        myAmapFun.getPoiAround({
          location: self.longitude + ',' + self.latitude,
          success: data => {
            console.log('获取当前的列表', data);
            this.dataTips = data.poisData;
          },
          fail: info => {
            console.log(info, '点击地图错误信息1');
          }
        });
      }
    });
  },
  onShow() {},
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    location(callback) {
      let that = this;
      // 获取地理位置
      wx.getLocation({
        // 获取地理位置成功
        success(res) {
          console.log(res, 'locationRes');
          that.longitude = res.longitude;
          that.latitude = res.latitude;
          that.$set(that.markers, 'longitude', res.longitude);
          that.$set(that.markers, 'latitude', res.latitude);
          that.mapFlafg = true;

          if (callback) callback(res);
        },
        // 获取地理位置失败
        fail(res) {}
      });
    },

    cancel() {
      if (this.searchWords) {
        this.searchWords = '';
        myAmapFun.getPoiAround({
          location: this.markers[0].longitude + ',' + this.markers[0].latitude,
          success: data => {
            console.log('获取当前的列表', data);
            this.$nextTick(() => {
              this.dataTips = data.poisData;
            });
          },
          fail: info => {
            console.log(info);
          }
        });
      }
    },
    reserGeo() {
      myAmapFun.getRegeo({
        success: data => {
          console.log('getRegeo', data);
        },
        fail: info => {
          console.log(info);
        }
      });
    },
    // 根据地址列表中选择某一个地点
    select(add, index) {
      console.log(add, '高德地图选择的地点值');
      if (!add) {
        return;
      }
      this.selectIndex = index;
      var location = add.location.split(',');
      console.log(location, add, '列表地点的经纬度');
      this.selectAddr = {
        adcode: add.typecode,
        address: add.pname ? add.pname + add.cityname + add.adname : add.district + add.address,
        addName: add.name,
        detailAddress: add.address,
        location: add.location,
        latitude: location[1],
        longitude: location[0]
      };

      this.markers[0].latitude = +location[1];
      this.markers[0].longitude = +location[0];
      //   uni.setStorageSync('address', this.selectAddr.address);
      // 选择地点后，将选取的地点传递到前一个页面中
      var pages = getCurrentPages(); // 获取所有的页面栈
      var prevPage = pages[pages.length - 2]; // 找到上一个页面，注意是页面，如果是页面中有组件，则需要通过页面接受到数据后，再次往组件中传递
      //   prevPage.$vm.userAddress.locationAddress = this.selectAddr.address; //在上一个页面中就可以用userAddress进行接收
      //   prevPage.$vm.userAddress.detail = this.selectAddr.detailAddress; //在上一个页面中就可以用userAddress进行接收
      //   prevPage.$vm.selectAddr = this.selectAddr;
      //   prevPage.$vm.address = {
      //     province: add.pname,
      //     city: add.cityname,
      //     district: add.adname
      //   };
      prevPage.setData({
        mapdata: {
          data: this.selectAddr
        }
      });
      console.log(this.selectAddr, '---this.selectAddr');
      wx.navigateBack({
        delta: 1
      });
    },
    // 在地图上点击进行选点，这个选点在地图缩放比例较大时无效，因为精读的问题。
    tap(e) {
      console.log(e, '点击了地图');
      var location = e.detail.longitude + ',' + e.detail.latitude;
      myAmapFun.getRegeo({
        location: location,
        success: data => {
          console.log('获取指定定位信息', data);
          this.selectAddr = {
            address: data[0].regeocodeData.formatted_address,
            latitude: e.detail.latitude,
            longitude: e.detail.longitude
          };
          this.markers[0].latitude = data[0].latitude;
          this.markers[0].longitude = data[0].longitude;
          myAmapFun.getPoiAround({
            location: data[0].longitude + ',' + data[0].latitude,
            success: data => {
              console.log('获取当前的列表', data);
              this.dataTips = data.poisData;
            },
            fail: info => {
              console.log(info, '点击地图错误信息1');
            }
          });
        },
        fail: info => {
          console.log(info, '点击地图错误信息2');
        }
      });
    },
    // 根据内容进行检索
    searchFn() {
      myAmapFun.getInputtips({
        keywords: this.searchWords,
        location: '',
        success: data => {
          if (data && data.tips) {
            this.dataTips = data.tips;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.btns {
  position: fixed;
  top: 0;
  left: 0;
  height: 260upx;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10 !important;

  view {
    border-radius: 10%;
    margin: 100upx 24upx 0;
    font-size: 30upx;

    &:first-child {
      color: #fff;
    }

    &:last-child {
      width: 100upx;
      height: 60upx;
      line-height: 60upx;
      text-align: center;
      border-radius: 10upx;
      background: #20c295;
      color: #fff;
    }
  }
}

.content {
  // position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .content-map {
    width: 100%;
    height: 50vh;
  }

  .list {
    // flex: 0 1 calc(50vh - 10upx);
    border-radius: 30rpx;
    background-color: #fff;
    // position: absolute;
    // bottom:-660rpx;
    height: calc(50vh - 10upx);
    overflow-y: auto;
    width: 100%;
    margin: 0upx auto 0;
    padding-bottom: 20upx;

    .item {
      border-bottom: 2upx solid #f3f3f3;
      padding: 0 30rpx;

      &:last-child {
        border: none;
      }

      .address {
        font-size: 22upx;
        color: #666;
        margin: 10upx 0;
      }

      .name {
        font-size: 30upx;
        color: #333;
        margin-top: 10upx;
      }

      &.active {
        .name {
          font-weight: bold;
          color: #e13500;
        }

        .address {
          color: #e13500;
        }
      }
    }
  }

  .inputCon {
    flex: 0 1 108rpx;
    width: 100%;
    background: #fff;
    // top: -60upx;
    // position: relative;
    z-index: 20;
    // height: 100upx;
    display: flex;
    align-items: center;
    justify-content: center;

    .searchView {
      width: 702upx;
      height: 60upx;
      display: flex;
      align-items: center;
      line-height: 60upx;
      border-radius: 40upx;
      padding: 0 30upx;
      box-sizing: border-box;
      background: #f3f3f3;
      font-size: 26upx;

      .iconfont {
        color: #666;
        margin-right: 20upx;
      }

      input {
        flex: 1;
      }

      view {
        flex-shrink: 0;
      }
    }
  }
}
</style>
