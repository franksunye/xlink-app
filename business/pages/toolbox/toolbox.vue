<template>
  <view class="storeMenu" @click.capture="track">
    <block v-if="functionListToolbox.length > 0">
      <view class="c-card">
        <view style="font-size: 16px; font-weight: 500">工具箱</view>
        <van-grid :border="false" square clickable column-num="4" icon-size="48px">
          <block v-for="(item, index) in functionListToolbox" :key="index">
            <!-- :badge="functionCountListToolbox[item._id]" -->
            <van-grid-item
              :link-type="item.openType"
              @click="gridClick(item.action)"
              :url="
                item.action != '/subpackages/map/nearbyCustomers' &&
                !item.action.startsWith('/subpackages/web/web') &&
                (item.action && item.action.indexOf('?') != -1
                  ? item.action + '&t=' + new Date().getTime()
                  : item.action + '?t=' + new Date().getTime())
              "
              :icon="item.code"
              :text="item.name"
              :style="'color:' + item.color"
              :data-event="{ id: '668IAlDXmQ' }"
              icon-class="c-grid-item-icon"
            />
          </block>
        </van-grid>
      </view>
    </block>
    <block v-else>
      <van-empty image="search" description="无可用工具" />
    </block>
    <Tabbar></Tabbar>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
var common = require('../../resources/js/common.js');

export default {
  data() {
    return {
      functionListToolbox: []
    };
  },
  onShow() {
    let currentRoleFunctions = wx.getStorageSync('currentRoleFunctions');
    this.findItemByName(currentRoleFunctions, '工具箱');
  },
  onLoad() {},
  methods: {
    findItemByName(items, name) {
      for (let item of items) {
        if (item.name === name) {
          return item; // 找到符合条件的返回
        }
        // 如果当前项有子项，递归查找
        if (item.functionList && item.functionList.length > 0) {
          const found = this.findItemByName(item.functionList, name);
          if (found) {
            this.functionListToolbox = found.functionList;
            return found; // 如果在子项中找到了，返回
          }
        }
      }
      return null; // 如果没有找到，返回 null
    },

    gridClick(url) {
      //如果点击菜单为附近的客户
      if (url == '/subpackages/map/nearbyCustomers') {
        //检查当前环境
        const systemInfo = uni.getSystemInfoSync();
        const platform = systemInfo.platform;

        if (platform === 'android' || platform === 'ios') {
          common.osg.open('/subpackages/map/nearbyCustomers2', {}); //App端口
        } else {
          common.osg.open(url, {}); //微信小程序
        }
      } else if (url.startsWith('/subpackages/web/web')) {
        if (url.indexOf('url=') != -1) {
          let weburl = url.split('url=')[1];
          common.osg.open('/subpackages/web/web', {
            url: weburl
          });
        } else if (url.indexOf('?') != -1) {
          let weburl = url.split('?')[1];
          let params = weburl.split('&');
          let paramsObj = {};
          for (let param of params) {
            let key = param.split('=')[0];
            let value = param.split('=')[1];
            paramsObj[key] = value;
          }
          common.osg.open('/subpackages/web/web', paramsObj);
        } else {
          common.osg.open('/subpackages/web/web');
        }
      } else if (url == 'smartTraining') {
        let user = wx.getStorageSync('user');
        // #ifdef APP-PLUS
        var weixinShare = null;
        plus.share.getServices(function (services) {
          for (var i in services) {
            var service = services[i];
            // 获取微信分享对象
            if (service.id == 'weixin') {
              weixinShare = service;
              break;
            }
          }
          //唤醒微信小程序
          if (weixinShare) {
            weixinShare.launchMiniProgram({
              id: 'gh_67d99ae2b380', // 在微信开放平台绑定的微信小程序的原始id非appid
              type: 0, //小程序版本  0：正式版； 1：测试版； 2：体验版。
              path: `pages/index/index?userId=${user._id}&name=${user.name}&orgName=${user.orgName}` //小程序的页面,用传的参数在小程序接值判断跳转指定页面,可以携带参数
            });
          } else {
            common.osg.toast('请安装微信', 'none');
          }
        });
        // #endif
        // #ifdef MP-WEIXIN
        uni.navigateToMiniProgram({
          appId: 'wx424b0548cd7c7401',
          path: 'pages/index/index?userId=${user._id}&name=${user.name}&orgName=${user.orgName}',
          envVersion: 'release' // develop（开发版），trial（体验版），release（正式版）。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
        });
        // #endif
      }
    }
  }
};
</script>

<style lang="scss">
.storeMenu {
  background: #f7f8fa;
  padding-bottom: 1px;
  .van-grid-item {
    margin-top: 15px;
  }
  .van-grid-item__icon {
    padding: 5px;
  }
  .van-grid-item__icon {
    .van-icon {
      font-size: 48px;
      background: #0078d0;
      color: #fff;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      &::before {
        font-size: 25px;
      }
      image {
        background-color: #fff;
      }
    }
  }
  .c-grid-item-icon {
    .van-icon {
      overflow: hidden;
    }
  }
}
</style>
