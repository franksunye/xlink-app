<template>
  <view class="bodyBox">
    <!-- <view class="querySearchBox">
      <van-search
        :value="addressValue"
        placeholder="请输入搜索关键词"
        use-action-slot
        use-left-icon-slot
        @change="onChange"
        @search="queryCommunityData"
      >
        <view slot="label" class="label" @click="showPicker = true">
          {{ province.text }}
          <van-icon name="arrow-down" />
        </view>
        <view slot="action" @tap="queryCommunityData">搜索</view>
      </van-search>
      <block v-if="showSearchSuggestions">
        <view class="" style="padding: 8px 12px" v-if="filteredPoints.length > 0">
          <view
            class="querySearchList"
            v-for="(item, index) in filteredPoints"
            :key="index"
            @click="navigateToMarker(item)"
          >
            <view style="width: 24px; height: 24px">
              <image
                style="width: 100%; height: 100%; border-radius: 5px"
                src="https://pub.fsgo365.cn/logo_icon.jpg"
              ></image>
            </view>
            <view class="list-item">
              <view class="item-name" v-html="highlightText(item.name)"></view>
              <view class="item-district">{{ item.districtStr }}</view>
            </view>
          </view>
        </view>
        <view v-else>
          <van-empty image="search" description="未找到该地址" />
        </view>
      </block>
    </view> -->
    <map
      id="myMap"
      :longitude="mapObj.longitude"
      :latitude="mapObj.latitude"
      :show-location="true"
      max-scale="14"
      min-scale="12"
      :scale="mapObj.scale"
      @regionchange="regionchange"
      :markers="mapObj.markers"
      @callouttap="callouttap"
    >
      <cover-view slot="callout">
        <block v-for="(item, index) in mapObj.markers" :key="index">
          <cover-view
            :class="[
              item.count ? 'customCallout' : 'communityBox',
              { activeCallout: item.id == activeMarkerId }
            ]"
            :marker-id="item.id"
          >
            <cover-view>{{ item.name }}</cover-view>
            <cover-view v-if="item.count">{{ item.count }}(套)</cover-view>
          </cover-view>
        </block>
      </cover-view>
    </map>
    <view class="">
      <van-popup
        show
        round
        :overlay="false"
        position="bottom"
        :custom-style="`height: ${popupHeight}px;transition: height 0.4s ease;`"
        @close="onClose"
      >
        <view class="popup">
          <view class="popup-content" @click="togglePopup">
            <view class="popup-icon">
              <image
                src="https://pub.fsgo365.cn/icon-up.jpg"
                :style="{
                  transform: `rotate(${isPopupOpen ? '180deg' : '0deg'})`,
                  height: '100%'
                }"
                mode="heightFix"
              ></image>
            </view>
            <view class="title">
              <text class="" v-if="activeMarkerId">
                该小区共
                <text style="color: #3072f6">
                  {{ fpi.total }}
                </text>
                个工单
              </text>
              <text class="" v-else>未选择小区</text>
            </view>
          </view>
          <scroll-view scroll-y class="popup-list" @scrolltolower="scrolltolower">
            <view v-if="fpi.total > 0" style="overflow: hidden">
              <view
                :class="{ card: true }"
                v-for="(item, k) in workOrderList"
                :key="k"
                @tap="toDetail(item.data._id)"
              >
                <view class="card-view c-flex c-flex-between">
                  <view class="c-flex">
                    <view
                      class="card-icon-view"
                      :class="
                        ['1', '2', '5'].includes(item.data.exts.sourceType)
                          ? 'c-bg-red'
                          : 'c-bg-blue'
                      "
                    >
                      <image
                        :src="
                          'https://pub.fsgo365.cn/icon-' +
                          (item.data.serviceType == '40' ? 'shuazi.png' : 'fangshui.png')
                        "
                      />
                    </view>
                    <text
                      @click.stop="
                        copy(item.data.orderNum, '已复制完整工单编号 ' + item.data.orderNum)
                      "
                      :data-event="{ id: '9cXxYY5Zz8' }"
                      class="c-m-l-20"
                    >
                      {{ '#' + item.data.orderNum.slice(5) }}
                    </text>
                    <!-- <text class="c-m-l-20">
                  {{ ['1', '2', '5'].includes(item.data.exts.sourceType) ? '雨虹' : '修链' }}
                </text> -->
                    <text class="c-m-l-20">
                      <!-- {{ formatLeakagesite(item.data.exts.leakagesite) }} -->
                    </text>
                  </view>
                  <text :class="item.state != 10 && 'c-blue'" class="c-flex-nowrap">
                    {{ codelabel('select', 'status', item.data.status) }}
                  </text>
                </view>
                <view
                  v-if="item.data.district || item.data.address"
                  class="card-view c-flex c-flex-between"
                >
                  <view class="c-flex-1 c-size-18 c-weight-600 c-ellipsis2">
                    {{
                      (item.data.district ? formatDistrict(Number(item.data.district)) : '') +
                      ' ' +
                      (item.data.address || '')
                    }}
                  </view>
                  <view
                    v-if="
                      item.data.gpsPoint &&
                      item.data.gpsPoint.longitude &&
                      item.data.gpsPoint.latitude
                    "
                    class="c-m-l-20 c-flex c-item-center"
                    style="height: 22px; line-height: 22px"
                    @click.stop="
                      openLocation(item.data.gpsPoint, item.data.area, item.data.address)
                    "
                    :data-event="{ id: '9c142Y5468' }"
                  >
                    <text
                      v-if="item.data.exts.distance || item.data.exts.distance == 0"
                      class="c-size-12 c-gray c-m-r-10"
                      :data-event="{ id: '9c142Y5468' }"
                    >
                      {{ item.data.exts.distance }}
                      <text class="c-m-l-5">km</text>
                    </text>
                    <image
                      src="https://pub.fsgo365.cn/icon-car.png"
                      style="width: 20px; height: 20px"
                      :data-event="{ id: '9c142Y5468' }"
                    ></image>
                  </view>
                </view>

                <view
                  class="card-view"
                  v-if="item.data.describe"
                  @click.stop="describeClick(item.data.describe)"
                >
                  <view class="card-memo">
                    <van-icon name="comment-o" color="#646566" style="margin-right: 8px" />
                    <view class="card-memo-text c-ellipsis2">备注：{{ item.data.describe }}</view>
                  </view>
                </view>
                <view class="card-view c-flex c-flex-wrap" style="margin: -5px">
                  <view class="c-flex c-item-center c-m-10">
                    <view class="card-icon-view card-icon-border c-m-r-20">
                      <image
                        v-if="!item.data.exts.gender"
                        src="https://pub.fsgo365.cn/icon-character-unknown.png"
                        style="width: 22px; height: 24px"
                      ></image>
                      <image
                        v-else
                        :src="
                          item.data.exts.gender == '1'
                            ? 'https://pub.fsgo365.cn/icon-character-man.png'
                            : 'https://pub.fsgo365.cn/icon-character-woman.png'
                        "
                      ></image>
                    </view>
                    <text class="c-size-14">
                      {{
                        item.data.name &&
                        item.data.name.length > 4 &&
                        item.data.exts.supervisorName &&
                        item.data.exts.headmanName
                          ? item.data.name.substring(0, 4) + '...'
                          : item.data.name
                      }}
                    </text>
                  </view>
                  <view v-if="item.data.exts.supervisorName" class="c-flex c-item-center c-m-10">
                    <view class="card-icon-view card-icon-border c-m-r-20">
                      <image src="https://pub.fsgo365.cn/icon-character-supervisor.png"></image>
                    </view>
                    <text class="c-size-14">{{ item.data.exts.supervisorName }}</text>
                  </view>
                  <view v-if="item.data.exts.headmanName" class="c-flex c-item-center c-m-10">
                    <view class="card-icon-view card-icon-border c-m-r-20">
                      <image src="https://pub.fsgo365.cn/icon-character-headman.png"></image>
                    </view>
                    <text class="c-size-14">{{ item.data.exts.headmanName }}</text>
                  </view>
                </view>
                <view class="card-view card-buttons">
                  <!-- 联系客户 -->
                  <block v-if="Number(item.data.status) > 103">
                    <van-button
                      v-if="item.data && item.data.phone"
                      plain
                      icon="phone"
                      block
                      class="c-flex-1"
                      @click.native.stop="makeCall(item.data.phone)"
                      :data-event="{ id: 'B43eOJcj6q' }"
                    >
                      联系客户
                    </van-button>
                    <van-button
                      v-else
                      plain
                      icon="phone"
                      block
                      class="c-flex-1"
                      @click.native.stop="
                        call(
                          '1',
                          null,
                          item.data.contactIds && item.data.contactIds[0]
                            ? item.data.contactIds[0]
                            : '',
                          item.data._id
                        )
                      "
                      :data-event="{ id: 'k5NVc60iAz' }"
                    >
                      联系客户
                    </van-button>
                  </block>
                </view>
              </view>
            </view>
            <block v-else>
              <van-empty image="search" description="该小区没有查询到工单" />
            </block>
          </scroll-view>
        </view>
      </van-popup>
    </view>
    <!-- 热门城市 选择 -->
    <view style="position: absolute; bottom: 0; left: 0px; z-index: 100; width: 100vw">
      <van-picker
        v-if="showPicker"
        show-toolbar
        title="选择城市"
        @cancel="handleCancel"
        @confirm="handleConfirm"
        :columns="provinceArray"
      />
    </view>
  </view>
</template>

<script>
var common = require('../../resources/js/common.js');
import area from '../../resources/js/area'; // 注意要调整路径
var areajs = require('../../resources/js/area.js');

const app = getApp(); // 获取应用实例

let popupContentHeight;
let popupMaxHeight = 500;
let formattedDate;
export default {
  data() {
    return {
      mapObj: {
        // longitude: 116.404, // 默认经度 地图中心点
        // latitude: 39.915, // 默认纬度    地图中心点

        longitude: 116.44355, // 默认经度 地图中心点
        latitude: 39.9219, // 默认纬度    地图中心点

        northeast: {},
        eastsouth: {},
        requestType: 'name', //值为“city”时发送区域城市请求；当值为district时，表示是区域请求。。。。
        markers: [],
        mapContext: null, //map上下文
        scale: 14 //默认缩放级别
      },
      centerLocation: [116.404, 39.915], //当前地图中心点
      diagonalDistanceKm: 0, // 半径  单位km
      existingIds: new Set(), // 用于记录已加载标记点的 id
      addressValue: '', //搜索框输入的内容
      provinceArray: [], //搜索区域数据列表
      filteredPoints: [], //收缩框检索出来的数据
      fpi: {
        total: 0, //总条数
        page: 1, // 当前页码
        rows: 30
      },
      workOrderList: [], //工单列表
      showSearchSuggestions: false, //是否显示收缩检索框
      showPicker: false, //是否显示热门城市选择器
      province: { code: '120000', text: '北京市' }, //
      params: {}, //父亲元素传递过来的参数
      activeMarkerId: '', //激活项
      activatedItems: [], //已经激活了的数组
      options: {
        codecfg_repairParts: {
          codeId: 'repairParts'
        },
        codecfg_status: {
          codeId: 'STATUS'
        }
      },
      popupHeight: 0, // 初始化高度
      isPopupOpen: false, // 弹出层初始为关闭状态
      debounceTimeout: null, // 用于存储防抖的定时器
      areaList: Object.assign({}, areajs.default)
    };
  },
  onShow() {},
  onLoad(options) {
    common.osg.init(this, {}, app);

    let User = wx.getStorageSync('user');
    this.user_id = User._id;
    console.log('当前登录人', this.user_id);
    console.log('app.globalData', app.globalData);
    // 示例：调用函数获取今天的时间
    this.formattedDate = this.getTodayStartTime();
    console.log(app.globalData);
    console.log('传递过来的参数', options);
    if (options.data) {
      const data = options.data;
      const decodedData = decodeURIComponent(data); // 解码 URL 编码
      this.params = JSON.parse(decodedData); // 解析 JSON 字符串
    }

    if (area) {
      // 转换成包含 code 和 text 的对象
      this.provinceArray = Object.entries(area.province_list).map(([code, text]) => {
        if (code == this.params.area) {
          this.province = { code, text };
        }
        return { code, text };
      });
    }

    //获取map上下文
    const mapContext = uni.createMapContext('myMap', this);
    this.mapObj.mapContext = mapContext;
    console.log('map 上下文', this.mapObj.mapContext);
    common.osg.codeoption();
    this.getCurrentLocation();
    // console.log('nhId', this.params.nhId);

    // 获取 popup-content 的高度
    this.$nextTick(() => {
      uni
        .createSelectorQuery()
        .select('.popup-content')
        .boundingClientRect(({ height }) => {
          popupContentHeight = height;
          this.popupHeight = height;
        })
        .exec();
    });

    this.newGetListData();
  },

  methods: {
    // 防抖函数
    debounce(func, wait) {
      return (...args) => {
        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      };
    },
    // 搜索框输入内容改变的时候触发
    onChange(e) {
      // 如果输入框为空，直接 return，不做任何操作
      if (e.detail.trim() === '') {
        this.showSearchSuggestions = false;
        this.filteredPoints = []; // 清空之前的搜索结果
        return;
      }
      this.showSearchSuggestions = e.detail.trim() !== '';
      this.addressValue = e.detail;
      this.debounce(this.queryCommunityData, 500)();
    },

    // 使用正则匹配搜索词 标红
    highlightText(text) {
      if (!this.addressValue) return text;
      const regex = new RegExp(`(${this.addressValue})`, 'gi');
      return text.replace(regex, '<span style="color: red;">$1</span>');
    },
    //点击提示词 定位到目标点
    navigateToMarker(item) {
      this.resetPagination();
      this.addressValue = item.name;
      //关闭搜索提示词
      this.showSearchSuggestions = false;
      console.log('点击拿到当前的点击项', item);
      this.moveMarkerToCenter(item);
      // this.activeMarkerId = this.concatenateLatLng(item.latitude, item.longitude);
      this.activeMarkerId = item._id;

      this.getServiceAppointment(item);
    },
    //小区地图数据
    // getListData() {
    //   let params = {
    //     groupType: this.mapObj.requestType, //当前等级
    //     maxLatitude: this.northeast.latitude, // 西北的纬度是最大纬度
    //     minLatitude: this.southwest.latitude, // 东南的纬度是最小纬度
    //     maxLongitude: this.northeast.longitude, // 西北的经度是最大经度
    //     minLongitude: this.southwest.longitude // 东南的经度是最小经度
    //   };
    //   common.osg.ajax(
    //     '/basic/neighborhood/queryNeighborhoodByLatitudeAndLongitude',
    //     params,
    //     ({ data }) => {
    //       for (let index = 0; index < data.length; index++) {
    //         let item = data[index];
    //         let id = this.concatenateLatLng(item.lnglat[1], item.lnglat[0]);
    //         //
    //         let markerItem = {
    //           id, // 为每个元素添加 id 属性，值为当前经纬度
    //           _id: item.id || null,
    //           longitude: item.lnglat[0],
    //           latitude: item.lnglat[1],
    //           width: 1,
    //           height: 1,
    //           name: item.name,
    //           count: item.count,
    //           iconPath: 'https://pub.fsgo365.cn/poi-marker-technician.png',
    //           customCallout: {
    //             anchorX: 0,
    //             anchorY: 15,
    //             display: 'ALWAYS'
    //           }
    //         };
    //         if (item.id && item.id == this.params.nhId && !this.activeMarkerId) {
    //           this.activeMarkerId = id; // 设置为当前点击的 markerId
    //           this.activatedItems = markerItem;
    //           this.getServiceAppointment(markerItem);
    //         }

    //         if (!this.existingIds.has(id)) {
    //           this.existingIds.add(id); // 将新的 id 加入到 existingIds 中
    //           this.mapObj.markers.push(markerItem);
    //         }
    //       }
    //     },
    //     { noload: true }
    //   );
    // },

    //新接口
    newGetListData() {
      console.log('计算对角线直线距离(米)', this.diagonalDistanceKm);

      let aggr = [
        {
          $match: {
            // 'exts.supervisorId': '5657371232200144010',
            'exts.supervisorId': this.user_id,
            state: 1,
            status: { $gt: '204' },
            gpsPoint: {
              $geoWithin: {
                $centerSphere: [
                  this.centerLocation,
                  Math.round(this.diagonalDistanceKm * 10) / 10 / 6378.1
                ]
              }
            }
          }
        },
        {
          $addFields: {
            leakagesite: { $first: '$exts.leakagesite_copy' }
          }
        },
        {
          $group: {
            _id: {
              leakagesite: '$leakagesite',
              nhId: '$exts.nhId'
            },
            scount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'neighborhood',
            let: { nhId: '$_id.nhId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$_id', '$$nhId'] }]
                  }
                }
              },
              {
                $project: {
                  name: '$name',
                  gpsPoint: '$originGpsPoint'
                }
              }
            ],
            as: 'nhData'
          }
        },
        {
          $unwind: '$nhData'
        }
      ];

      common.osg.ajax(
        '/stat/aggr/serviceAppointment.do',
        { aggr: JSON.stringify(aggr) },
        res => {
          console.log('新接口拿到的数据', res);

          for (let index = 0; index < res.length; index++) {
            let item = res[index];
            const { _id, name, gpsPoint } = item.nhData;
            //   let id = this.concatenateLatLng(item.lnglat[1], item.lnglat[0]);
            //
            let markerItem = {
              id: Number(_id), // 为每个元素添加 id 属性，值为当前经纬度
              _id: _id || null,
              longitude: gpsPoint.longitude,
              latitude: gpsPoint.latitude,
              width: 1,
              height: 1,
              name: name,
              iconPath: 'https://pub.fsgo365.cn/poi-marker-technician.png',
              customCallout: {
                anchorX: 0,
                anchorY: 15,
                display: 'ALWAYS'
              }
            };
            //   if (_id && _id == this.params.nhId && !this.activeMarkerId) {
            //     this.activeMarkerId = id; // 设置为当前点击的 markerId
            //     this.activatedItems = markerItem;
            //     this.getServiceAppointment(markerItem);
            //   }

            if (!this.existingIds.has(_id)) {
              this.existingIds.add(_id); // 将新的 id 加入到 existingIds 中
              this.mapObj.markers.push(markerItem);
            }
          }
        },
        { noload: true }
      );
    },
    // 将经纬度转换为字符串id
    // concatenateLatLng(lat, lng) {
    //   let latStr = lat.toString();
    //   let lngStr = lng.toString();

    //   // 去除小数点
    //   latStr = latStr.replace('.', '');
    //   lngStr = lngStr.replace('.', '');
    //   // 拼接经纬度字符串
    //   let concatenatedStr = latStr + lngStr;
    //   // 将拼接后的字符串转换为数字
    //   let concatenatedNum = Number(concatenatedStr);
    //   return concatenatedNum;
    // },
    // 地图视野发生改变的时候
    regionchange(e) {
      if (e.type === 'end') {
        const { scale } = e.target;
        const { northeast, southwest } = e.target.region;
        const { latitude, longitude } = e.target.centerLocation;
        this.centerLocation = [longitude, latitude];
        this.northeast = northeast;
        this.southwest = southwest;
        console.log('当前地图缩放等级', e.target);

        // 传递当前地图缩放等级
        // this.getMapDetails(scale);
        // console.log('当前地图缩放的等级', scale, this.mapObj.requestType);

        // 获取东北角和西南角坐标
        let lat1 = this.northeast.latitude;
        let lon1 = this.northeast.longitude;
        let lat2 = this.southwest.latitude;
        let lon2 = this.southwest.longitude;
        // 计算对角线直线距离
        this.diagonalDistanceKm = this.getDistance(lat1, lon1, lat2, lon2);

        // this.debounce(this.getListData, 300)();
        this.debounce(this.newGetListData, 300)();
      }
    },
    //更改缩放等级
    // getMapDetails(scale) {
    //   switch (true) {
    //     case scale >= 7 && scale < 10.5:
    //       this.mapObj.requestType = 'city';
    //       break;
    //     case scale >= 10.5 && scale < 12.5:
    //       this.mapObj.requestType = 'district';
    //       break;
    //     case scale >= 12.5 && scale < 14.5:
    //       this.mapObj.requestType = 'subdistrict';
    //       break;
    //     case scale >= 14.5 && scale < 22:
    //       this.mapObj.requestType = 'name';
    //       break;
    //     default:
    //   }
    // },
    // 计算下一个层级
    // getNextZoomLevel() {
    //   switch (this.mapObj.requestType) {
    //     case 'city':
    //       return 11; // 下一层级是district
    //     case 'district':
    //       return 13; // 下一层级是subdistrict
    //     case 'subdistrict':
    //       return 16; // 下一层级是name
    //     case 'name':
    //       return 16.1;
    //     default:
    //       return false; // 如果没有匹配的类型，则返回最小层级
    //   }
    // },

    getDistance(lat1, lon1, lat2, lon2) {
      //   const R = 6371e3; // 地球半径，单位：米
      const R = 6378.1; // 地球半径，单位：公里
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // 返回单位：KM
    },
    //根据经纬度进行定位
    getCurrentLocation() {
      // 传递过来的经纬度无效
      // const { longitude, latitude } = this.params.gpsPoint || {};

      let latitude = '';
      let longitude = '';

      // 优先使用传入参数
      let options = this.params.gpsPoint;
      // 优先使用传入参数
      if (options && options.latitude && options.longitude) {
        latitude = options.latitude;
        longitude = options.longitude;
        console.log('传入的参数');
      } else if (app.globalData.location) {
        // 其次尝试用全局默认位置
        const [lat, lng] = app.globalData.location.split(',');
        latitude = lat;
        longitude = lng;
      }

      // const [latitude, longitude] = app.globalData.location.split(',');
      console.log(app.globalData.location);

      //如果有经纬度 直接 定位的
      if (longitude && latitude) {
        this.mapObj.latitude = latitude;
        this.mapObj.longitude = longitude;
      } else {
        //通过定位来解决
        wx.getLocation({
          type: 'gcj02', // 默认为 'gcj02' 坐标系，适用于大多数情况
          isHighAccuracy: true,
          success: res => {
            // 成功获取位置
            const { longitude: lng, latitude: lat } = res;
            this.mapObj.latitude = lat;
            this.mapObj.longitude = lng;
            // 高亮标记点
          },
          fail: error => {
            // 失败处理
            console.error('获取位置失败:', error);
          }
        });
      }
    },
    // 点击地图自定义气泡的时候触发
    callouttap(e) {
      this.resetPagination();
      const { markerId } = e.detail;
      console.log('点击地图自定义气泡的时候触发', e);

      //拿到点击的那个自定义气泡Id
      this.activatedItems = this.mapObj.markers.find(m => m._id == markerId);
      console.log('拿到点击的那个自定义气泡', this.activatedItems);
      if (this.activatedItems) {
        this.activeMarkerId = markerId; // 设置为当前点击的 markerId
        console.log(this.activeMarkerId);

        this.moveMarkerToCenter(this.activatedItems); // 保持原有的逻辑

        this.getServiceAppointment(this.activatedItems);
      }
    },
    //将marker移动至中心点
    moveMarkerToCenter(marker) {
      const { longitude: lng, latitude: lat } = marker;
      if (lng && lat) {
        this.mapObj.mapContext.moveToLocation({
          longitude: lng,
          latitude: lat
          // success: () => {
          //这里加300ms的延时是为了防止和moveToLocation功能冲突，保留地图移动的动画
          // const timer = setTimeout(() => {
          //   this.mapObj.longitude = lng;
          //   this.mapObj.latitude = lat;
          //   clearTimeout(timer);
          //   this.mapObj.mapContext.getScale({
          //     success: ({ scale }) => {
          //       let nextZoomLevel = this.getNextZoomLevel();
          //       let zoom = zoomLevel ? zoomLevel : nextZoomLevel ? nextZoomLevel : scale;
          //       this.mapObj.scale = zoom + 0.001;
          //       this.$nextTick(() => {
          //         this.mapObj.scale = zoom;
          //       });
          //     }
          //   });
          // }, 300);
          // }
        });
      } else {
        console.log('经纬度缺失');
      }
    },
    //展开弹出层
    togglePopup() {
      this.isPopupOpen = !this.isPopupOpen;
      if (this.isPopupOpen) {
        this.popupHeight = popupMaxHeight;
      } else {
        this.popupHeight = popupContentHeight;
      }
    },
    //查询工单列列表 接口
    getServiceAppointment(item) {
      common.osg.ajax(
        '/basic/serviceAppointment/querySAWorkflowNode',
        {
          //   'is:community|string#or': item.name,
          'is:exts.nhId|string#or': item._id,
          //   'lt:createTime|datetime#and': this.formattedDate,
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          page: this.fpi.page,
          rows: this.fpi.rows
        },
        ({ data, total }) => {
          // this.workOrderList = data;
          this.fpi.page++; // 自增 page 值
          this.fpi.total = total;
          console.log('查询工单列列表', data);
          this.workOrderList = [...this.workOrderList, ...data];
        },
        { noload: true }
      );
    },

    // codelabel(options, value) {
    //   return common.osg.codelabel(options, value);
    // },
    codelabel(type, option, val) {
      if (!val) return;
      if (type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
      }
    },
    formatDistrict(value) {
      return this.areaList.county_list[value];
    },
    //地区选择器 处理取消事件
    handleCancel() {
      this.showPicker = false;
    },
    //地区选择器 处理确认事件
    handleConfirm(e) {
      const { value, index } = e.detail;
      this.showPicker = false;
      this.province = value;
      this.resetPagination();
      this.fpi.total = 0;
      this.activeMarkerId = '';
      this.locateCityCenter(this.province.text, this.province.text);
    },
    //根据城市定位当前地图中心的点
    locateCityCenter(address, city) {
      common.osg.geo(
        address,
        res => {
          const { location } = res;
          console.log(res);
          console.log(location);
          this.mapObj.longitude = location.split(',')[0];
          this.mapObj.latitude = location.split(',')[1];
          this.mapObj.scale = 8;
        },
        city
      );
    },
    //查询小区数据
    queryCommunityData() {
      common.osg.ajax(
        '/basic/neighborhood/query',
        {
          'regex:name|string#and': this.addressValue,
          'is:city|string#and': '',
          'is:province|string#and': this.province.code,
          'is:province|string#and': this.params._id || '',
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          rows: 10
        },
        ({ data }) => {
          this.filteredPoints = data;
        },
        { noload: true }
      );
    },
    //触底事件
    scrolltolower() {
      if (this.workOrderList.length === this.fpi.total) {
        wx.showToast({
          title: '暂无更多',
          icon: 'none',
          duration: 2000
        });
        return; // 防止重复调用
      }

      this.getServiceAppointment(this.activatedItems);
    },
    // 重置分页器
    resetPagination() {
      this.fpi.page = 1; // 重置页码
      this.workOrderList = []; // 清空数据列表
    },
    getTodayStartTime() {
      // 获取今天的日期
      let today = new Date();
      // 将时间设置为 00:00:00
      today.setHours(0, 0, 0, 0);
      // 获取本地时间并格式化为 "YYYY-MM-DD HH:mm:ss" 格式
      let year = today.getFullYear();
      let month = String(today.getMonth() + 1).padStart(2, '0'); // 月份从0开始
      let day = String(today.getDate()).padStart(2, '0');
      let hours = String(today.getHours()).padStart(2, '0');
      let minutes = String(today.getMinutes()).padStart(2, '0');
      let seconds = String(today.getSeconds()).padStart(2, '0');

      // 生成最终日期格式
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    /**
     * 拨打电话
     */
    call(type, callerId, calleeId, sid) {
      common.osg.ajax(
        'basic/winnerlook/getMiddleNumberBySid',
        {
          // type,
          // callerId: callerId || wx.getStorageSync('user')._id,
          // calleeId: calleeId,
          sid
        },
        res => {
          if (res.data && res.data.phoneNumberX) {
            this.makeCall(res.data.phoneNumberX);
          } else {
            const modal = weex.requireModule('modal');

            modal.toast({
              message: '获取手机号失败'
            });
          }
        }
      );
    },
    makeCall(phoneNumber) {
      this.showType = 'makeCall';
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    openLocation(gpsPoint, area, address) {
      uni.openLocation({
        latitude: gpsPoint.latitude,
        longitude: gpsPoint.longitude,
        name: address || '',
        address:
          (area.length == 3
            ? this.areaList.city_list[area[1]] + this.areaList.county_list[area[2]]
            : '') + address
      });
    },
    // 复制到剪切板
    copy(data, msg) {
      wx.setClipboardData({
        data: data,
        success() {
          if (msg) common.osg.toast(msg, 'none');
        }
      });
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    toDetail(id) {
      this.doOpen('/subpackages/serviceAppointment/serviceAppointment', { id });
    }
  },
  watch: {
    // 监听 mapObj.requestType 的变化
    'mapObj.requestType'() {
      // 清空已有的标记点
      this.mapObj.markers = [];
      // 清空 existingIds，避免重复标记点的加载
      this.existingIds = new Set(); // 重新初始化为一个新的空 Set
      console.log(this.existingIds, '初始化');
    }
  }
};
</script>

<style lang="scss" scoped>
.bodyBox {
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  overflow-y: hidden;
  position: relative;
}
#myMap {
  width: 100vw;
  flex: 1;
}
.customCallout {
  width: 100px;
  height: 50px;
  font-size: 28rpx;
  border-radius: 10px;
  background-color: #3072f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bolder;
  font-family: PingFangSC-Semibold;
  line-height: 1;
}

.communityBox {
  width: max-content;
  height: auto;
  padding: 5px 8px;
  font-size: 28rpx;
  border-radius: 50px;
  background-color: #3072f6;
  text-align: center;
  font-weight: bolder;
  color: #fff;
}
.querySearchBox {
  position: absolute;
  left: 0px;
  width: 100vw;
  height: auto;
  top: 0;
  z-index: 10;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin-right: 8px;
  }
  .querySearchList {
    box-sizing: border-box;
    display: flex;
    margin: 8px 0px;
    .list-item {
      flex: 1;
      display: flex;
      margin-left: 6px;
      align-items: center;
      justify-content: space-between;
      .item-name {
        font-weight: bolder;
      }
      .item-district {
        color: #ccc;
      }
    }
  }
}

.activeCallout {
  background-color: #fa5741;
}
.popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100vw;

  .popup-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    .popup-icon {
      width: 100vw;
      height: 30px;
      display: flex;
      justify-content: center;
    }
    .title {
      font-size: 35rpx;
      color: #000;
      font-weight: bolder;
    }
  }
  .popup-list {
    flex: 1;
    overflow-y: auto;
    .card {
      //   width: 90vw;
      //   height: auto;
      //   background: #fff;
      //   box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      //   margin: 10rpx auto;
      //   border-radius: 10px;
      //   padding: 10px;

      background-color: #fff;
      width: calc(100vw - 32px);
      margin: 16px;
      padding: 16px;
      box-sizing: border-box;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
      display: grid;
      row-gap: 12px;
      position: relative;
    }
  }
}

.card-view {
  line-height: 22px;
  .card-icon-view {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      width: 20px;
      height: 20px;
    }
  }
  .card-icon-border {
    border: 1px solid #ebedf0;
    border-radius: 4px;
  }
  .card-memo {
    border: 1px solid #e0c697;
    border-radius: 4px;
    background-color: #fff9e6;
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    .card-memo-text {
      font-size: 14px;
      line-height: 20px;
      color: #646566;
    }
  }
}

::v-deep .van-search__action {
  margin: 0px 8px;
}
::v-deep .van-search {
  padding: 5px;
}
</style>
