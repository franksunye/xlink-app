<template>
  <van-popup
    :show="isLogined && permission.state == -1"
    closeable
    :close-on-click-overlay="false"
    round
    position="bottom"
    lock-scroll
    custom-style="z-index:100"
    @close="closePermission"
  >
    <van-nav-bar title="授权管理" />
    <view class="c-m-t-30 c-text-center c-gray c-size-14">请开启以下权限，以使用完整功能</view>
    <view class="popup-cards">
      <block v-for="(item, i) in permission.data" :key="i">
        <!-- 已授权权限不展示 -->
        <block v-if="item.granted != true">
          <!-- 校验当前角色 -->
          <block v-if="checkRole(item)">
            <!-- 校验设备系统 -->
            <block v-if="checkOsName(item)">
              <!-- 校验设备品牌 -->
              <block v-if="checkDeviceBrand(item)">
                <!-- 校验系统版本 -->
                <block v-if="checkOsVersion(item)">
                  <!-- 校验android API Level -->
                  <block v-if="checkOsAndroidAPILevel(item)">
                    <view class="popup-card">
                      <view class="popup-card-left">
                        <van-icon :name="item.icon" class="c-blue" />
                      </view>
                      <view class="popup-card-center">
                        <view class="popup-card-title">{{ item.title }}</view>
                        <view class="popup-card-content c-ellipsis3">
                          {{ item.description }}
                        </view>
                      </view>
                      <view class="popup-card-right c-text-center">
                        <van-button
                          v-if="item.granted == 'check'"
                          round
                          size="small"
                          type="info"
                          plain
                          @click="requestPermission(item.permission)"
                        >
                          去检查
                        </van-button>
                        <van-button v-else-if="item.granted" round size="small" type="warning">
                          已授权
                        </van-button>
                        <!-- disable 校验是否需要先授权指定权限，才能授权此权限 -->
                        <van-button
                          v-else
                          round
                          size="small"
                          type="info"
                          :disabled="checkPrePermission(item)"
                          @click="requestPermission(item.permission)"
                        >
                          去授权
                        </van-button>
                      </view>
                    </view>
                  </block>
                </block>
              </block>
            </block>
          </block>
        </block>
      </block>
    </view>
  </van-popup>
</template>
<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      isLogined: true,
      currentRole: {},
      systemInfo: {},
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
            excludedRoleIds: ['7508867733715728438', '101454081026144584'], // 测试和正式环境的“管家App”角色id
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
            roleIds: ['8050029062726074247'],
            title: '应用启动管理',
            description:
              '请在「手机设置-应用-应用启动管理-找到XLink」关闭自动管理、打开“允许后台活动”（如已设置请忽略）',
            icon: 'setting-o'
          },
          {
            order: 3,
            permission: 'locationService',
            osName: ['android'],
            request: true,
            granted: false,
            showType: 'unauthorized',
            roleIds: ['8050029062726074247'],
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
            roleIds: ['8050029062726074247'],
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
            roleIds: ['8050029062726074247'],
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
            roleIds: ['8050029062726074247'],
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
            roleIds: ['8050029062726074247'],
            description: '需选择“始终允许”，app后台运行时才能够获取定位信息',
            icon: 'location-o'
          }
        ]
      }
    };
  },
  mounted() {
    this.currentRole = wx.getStorageSync('currentRole') || {};
    this.systemInfo = app.globalData.systemInfo;
  },
  methods: {
    initPermissions() {
      // #ifdef APP-PLUS
      // 检查授权管理
      this.permission.state = app.globalData.permissionState; // 从全局状态更新，用于在个人中心页切换角色，回首页后重新检查当前角色的授权
      // 授权管理状态 0：待检查，-1：待授权，1：已授权
      if (this.permission.state != 1) {
        this.checkPermissions(); // 检查授权管理，并更新授权状态
      }
      if (this.permission.state != 1) return; // 必要权限全部授权完成后，才执行后续逻辑
      // #endif
    },
    /* 权限管理 */
    // 校验当前角色
    checkRole(item) {
      if (
        (item.excludedRoleIds &&
          item.excludedRoleIds.length > 0 &&
          item.excludedRoleIds.indexOf(this.currentRole._id) != -1) ||
        !this.currentRole._id
      ) {
        return false;
      }

      if (item.roleIds && item.roleIds.length > 0) {
        return item.roleIds.indexOf(this.currentRole._id) != -1;
      } else {
        return true;
      }
    },
    // 校验设备系统
    checkOsName(item) {
      if (item.osName && item.osName.length > 0) {
        return item.osName.indexOf(this.systemInfo.osName) != -1;
      } else {
        return true;
      }
    },
    // 校验设备品牌
    checkDeviceBrand(item) {
      if (item.deviceBrand && item.deviceBrand.length > 0) {
        return item.deviceBrand.indexOf(this.systemInfo.deviceBrand) != -1;
      } else {
        return true;
      }
    },
    // 校验当前系统版本是否需要授权
    checkOsVersion(item) {
      let osVersion = [];
      if (this.systemInfo.osName == 'android') {
        if (item.osAndroidVersion && item.osAndroidVersion.length > 1) {
          osVersion = item.osAndroidVersion;
        } else {
          return true;
        }
      } else {
        if (item.osIOSVersion && item.osIOSVersion.length > 1) {
          osVersion = item.osIOSVersion;
        } else {
          return true;
        }
      }

      if (osVersion.length > 2) {
        return osVersion.indexOf(this.systemInfo.osVersion) != -1;
      } else {
        // min和max值为null，表示不限制
        let min = osVersion[0];
        if (min != null && this.systemInfo.osVersion < min) {
          return false;
        }
        let max = osVersion[1];
        if (max != null && this.systemInfo.osVersion > max) {
          return false;
        }
        return true;
      }
    },
    // 校验当前Android系统API库的版本是否需要授权
    checkOsAndroidAPILevel(item) {
      if (this.systemInfo.osName == 'android') {
        if (item.osAndroidAPILevel && item.osAndroidAPILevel.length > 1) {
          if (item.osAndroidAPILevel.length > 2) {
            return item.osAndroidAPILevel.indexOf(this.systemInfo.osAndroidAPILevel) != -1;
          } else {
            // min和max值为null，表示不限制
            let min = item.osAndroidAPILevel[0];
            if (min != null && this.systemInfo.osAndroidAPILevel < min) {
              return false;
            }
            let max = item.osAndroidAPILevel[1];
            if (max != null && this.systemInfo.osAndroidAPILevel > max) {
              return false;
            }
            return true;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    // 校验是否需要先授权其他权限，才运行授权此权限
    checkPrePermission(item) {
      if (item.prePermission && item.prePermission.length > 0) {
        let prePermissions = this.permission.data.filter(
          obj =>
            this.checkOsName(obj) &&
            item.prePermission.indexOf(obj.permission) != -1 &&
            !obj.granted
        );
        // 当依赖的权限中，有1个未授权的，则当前权限不允许授权
        if (prePermissions.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    // 检查所有权限是否已授权，如有未授权，打开权限管理弹出层
    // permissionState 授权管理状态 0：待检查，-1：待授权，1：已授权
    checkPermissions() {
      let permissionState = 1; // 已授权
      for (let item of this.permission.data) {
        if (item.granted == 'check') continue; // 无法判断是否授权，需要自行检查
        // 获取授权状态，并判断是否打开权限管理
        // 只获取和判断适用当前角色和设备的权限，判断条件 1.当前适用的权限（校验角色、校验品牌、校验系统版本、校验Android系统API库版本） 2.有未授权且必须授权的
        if (
          this.checkRole(item) &&
          this.checkOsName(item) &&
          this.checkDeviceBrand(item) &&
          this.checkOsVersion(item) &&
          this.checkOsAndroidAPILevel(item)
        ) {
          item.granted = common.osg.checkPermission(item.permission);
          if (!item.granted && item.request) {
            permissionState = -1; // 有未授权且必须授权
          }
        }
      }
      this.permission.state = permissionState;
      app.globalData.permissionState = permissionState;
    },
    // 去授权
    requestPermission(name) {
      common.osg.requestPermission(name);
    },
    // 关闭权限管理
    closePermission() {
      // 是否允许关闭权限管理判断：1.当前适用的权限（校验品牌、校验系统版本、校验Android系统API库版本） 2.有未授权且必须授权的
      this.checkPermissions(); // 如果没有待授权的会直接关闭
      if (this.permission.state == -1) {
        common.osg.toast('请开启以下权限，以使用完整功能', 'none');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// 权限管理弹出层列表
.popup-cards {
  .popup-card {
    padding: 10px 0;
    margin: 15px;
    border: 1px solid #ebedf0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    .popup-card-left {
      width: 40px;
      text-align: center;
    }
    .popup-card-center {
      flex: 1;
      .popup-card-title {
        font-weight: 700;
        margin-bottom: 5px;
      }
      .popup-card-content {
        font-size: 14px;
        columns: #646566;
      }
    }
    .popup-card-right {
      width: 80px;
    }
  }
}
</style>
