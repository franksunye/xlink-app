<template>
  <view class="storeMenu" @click.capture="track">
    <!-- #ifdef MP-WEIXIN -->
    <view class="report" style="height: 150px; padding: 0px">
      <view
        @click.native="navigateBack"
        :style="
          'position:absolute;z-index:1;top:' +
          systemInfo.statusBarHeight +
          'px;left:' +
          systemInfo.menuButtonObject.marginRight +
          'px;height:' +
          systemInfo.navHeight +
          'px;line-height:' +
          systemInfo.navHeight +
          'px;color:#fff;display:flex;align-items:center;font-weight:500;'
        "
        :data-event="{ id: 'CEWlKs5xEP' }"
      >
        <van-icon
          name="arrow-left"
          style="font-size: 20px; margin-right: 5px"
          :data-event="{ id: 'CEWlKs5xEP' }"
        />
        <view @click="navigateBack" :data-event="{ id: '-0IuHQmLrC' }">
          <text style="font-weight: 600" :data-event="{ id: '-0IuHQmLrC' }">云店铺</text>
        </view>
      </view>
      <view
        @click.native="navigateBack"
        :style="
          'position:absolute;z-index:1;padding-top:' +
          (systemInfo.statusBarHeight + 30) +
          'px;padding-left:' +
          (systemInfo.menuButtonObject.marginRight + 20) +
          'px;height:' +
          systemInfo.navHeight +
          'px;color:#fff;font-size:15px;line-height:30px'
        "
        :data-event="{ id: '2o_K375HCA' }"
      >
        <van-rate :value="5" :size="15" color="#FFCC5A " void-icon="star" void-color="#eee" />
        <!-- 当前登录人归属于服务商才展示服务商地址 -->
        <view style="display: flex" v-if="parnter._id" :data-event="{ id: '2o_K375HCA' }">
          <van-icon name="location-o" size="16px" :data-event="{ id: '2o_K375HCA' }" />
          <view :data-event="{ id: '2o_K375HCA' }">
            <text :data-event="{ id: '2o_K375HCA' }">
              {{ area.areaList.province_list[parnter.province] || '' }}.
            </text>
            <text :data-event="{ id: '2o_K375HCA' }">
              {{ area.areaList.county_list[parnter.district] || '' }}.
            </text>
            <text :data-event="{ id: '2o_K375HCA' }">{{ parnter.address || '' }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <view class="report">
      <uni-rate
        :value="5"
        :size="15"
        color="#eee"
        active-color="#FFCC5A"
        :readonly="true"
        class="c-m-b-10"
      />
      <!-- 当前登录人归属于服务商才展示服务商地址 -->
      <view style="display: flex" v-if="parnter._id">
        <van-icon name="location-o" size="16px" class="c-m-r-10" />
        <view>
          <text>{{ area.areaList.province_list[parnter.province] || '' }}.</text>
          <text>{{ area.areaList.county_list[parnter.district] || '' }}.</text>
          <text>{{ parnter.address || '' }}</text>
        </view>
      </view>
    </view>
    <!-- #endif -->
    <!-- 指标块 -->
    <view v-if="currentRole._id == '8050029062726074247'" class="housekeepReport">
      <view class="housekeepReportBlock">
        <view class="leftBlock" @click="clickTo()" :data-event="{ id: '4ZbtTHlwjM' }">
          <view class="firstBlock" :data-event="{ id: '4ZbtTHlwjM' }">
            <view class="firstBlockNumber" :data-event="{ id: '4ZbtTHlwjM' }">
              {{ SANodeData.dataCount || 0 }}
            </view>
            <view class="firstBlockText" :data-event="{ id: '4ZbtTHlwjM' }">单</view>
          </view>
          <view class="firstBlockText2" :data-event="{ id: '4ZbtTHlwjM' }">待接</view>
        </view>
        <view class="middleBlock"></view>
        <view class="lastBlock">
          <!-- <view class="lastBlockDay">{{ days }} 天</view> -->
          <view v-if="SANodeData.data != ''">
            <view class="lastBlockTiem">{{ hours }}:{{ minutes }}:{{ seconds }}</view>
            <view class="lastBlockText">已等待 {{ days }}天</view>
          </view>
          <view v-else>
            <view class="lastBlockTiem">00:00:00</view>
            <view class="lastBlockText">已等待 0天</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 待处理工单 -->
    <view v-if="functionListTodo != ''" class="c-card">
      <view style="font-size: 16px; font-weight: 500">待处理工单</view>
      <van-grid :border="false" square clickable column-num="4" icon-size="48px">
        <block v-for="(item, index) in functionListTodo.functionList" :key="index">
          <van-grid-item
            @click="gridClickS(functionListTodo, item)"
            :icon="item.code"
            :link-type="item.openType"
            :url="
              item.action && item.action.indexOf('?') != -1
                ? item.action + '&t=' + new Date().getTime()
                : item.action + '?t=' + new Date().getTime()
            "
            :text="item.name"
            :badge="functionCountTodo[item._id]"
            :style="'color:' + item.color"
            :data-event="{ id: '8-Yc8eMFby' }"
          />
        </block>
      </van-grid>
    </view>
    <!-- 待收款项目 -->
    <view v-if="functionListCollection != ''" class="c-card">
      <view style="font-size: 16px; font-weight: 500">待收款项目</view>
      <van-grid :border="false" square clickable column-num="4" icon-size="48px">
        <block v-for="(item, index) in functionListCollection.functionList" :key="index">
          <van-grid-item
            @click="gridClickS(functionListCollection, item)"
            :icon="item.code"
            :link-type="item.openType"
            :url="
              item.action && item.action.indexOf('?') != -1
                ? item.action + '&t=' + new Date().getTime()
                : item.action + '?t=' + new Date().getTime()
            "
            :text="item.name"
            :badge="functionCountCollection[item._id]"
            :style="'color:' + item.color"
            :data-event="{ id: 'KvQV2qdVTH' }"
          />
        </block>
      </van-grid>
    </view>
    <!--需关注项目  -->
    <view v-if="functionListAttention != ''" class="c-card">
      <view style="font-size: 16px; font-weight: 500">需关注项目</view>
      <van-grid :border="false" square clickable column-num="4" icon-size="48px">
        <block v-for="(item, index) in functionListAttention.functionList" :key="index">
          <van-grid-item
            @click="gridClickS(functionListAttention, item)"
            :icon="item.code"
            :link-type="item.openType"
            :url="
              item.action && item.action.indexOf('?') != -1
                ? item.action + '&t=' + new Date().getTime()
                : item.action + '?t=' + new Date().getTime()
            "
            :text="item.name"
            :badge="functionCountAttention[item._id]"
            :style="'color:' + item.color"
            :data-event="{ id: 'OYbK2dOarF' }"
          />
        </block>
      </van-grid>
    </view>
    <!--巡检模块  -->
    <view v-if="functionListInspectionAppointment != ''" class="c-card">
      <view style="font-size: 16px; font-weight: 500">巡检模块</view>
      <van-grid :border="false" square clickable column-num="4" icon-size="48px">
        <block v-for="(item, index) in functionListInspectionAppointment.functionList" :key="index">
          <van-grid-item
            @click="gridClickS(functionListInspectionAppointment, item)"
            :icon="item.code"
            :link-type="item.openType"
            :url="
              item.action && item.action.indexOf('?') != -1
                ? item.action + '&t=' + new Date().getTime()
                : item.action + '?t=' + new Date().getTime()
            "
            :text="item.name"
            :badge="functionCountInspectionAppointment[item._id]"
            :style="'color:' + item.color"
            :data-event="{ id: 'Lh2p2XWnOE' }"
          />
        </block>
      </van-grid>
    </view>
    <!-- 工具箱 -->
    <view v-if="functionListToolbox != ''" class="c-card">
      <view style="font-size: 16px; font-weight: 500">工具箱</view>
      <van-grid :border="false" square clickable column-num="4" icon-size="48px">
        <block v-for="(item, index) in functionListToolbox.functionList" :key="index">
          <van-grid-item
            @click="gridClickS(functionListToolbox, item)"
            :icon="item.code"
            :link-type="item.openType"
            :url="
              item.action === '/subpackages/map/nearbyCustomers'
                ? ''
                : item.action && item.action.indexOf('?') !== -1
                ? item.action + '&t=' + new Date().getTime()
                : item.action + '?t=' + new Date().getTime()
            "
            :text="item.name"
            :badge="functionCountListToolbox[item._id]"
            :style="'color:' + item.color"
            :data-event="{ id: 'BTxMUvK7Q6' }"
          />
        </block>
      </van-grid>
    </view>
    <!-- 功能导航 -->
    <view v-if="currentRole._id == '7100212906800336051'">
      <view class="c-card">
        <van-grid
          v-if="functionList.length > 0"
          :border="false"
          square
          clickable
          column-num="4"
          icon-size="48px"
        >
          <block v-for="(item, index) in functionList" :key="index">
            <van-grid-item
              @click="gridClick(item, $event)"
              :icon="item.code"
              :link-type="item.openType"
              :url="
                item.action && item.action.indexOf('?') != -1
                  ? item.action + '&t=' + new Date().getTime()
                  : item.action + '?t=' + new Date().getTime()
              "
              :text="item.name"
              :badge="functionCount[item._id]"
              :style="'color:' + item.color"
              :data-event="{ id: 'dbs-JLBsld' }"
            />
          </block>
        </van-grid>
      </view>
      <view v-if="currentRole._id == '7100212906800336051'" class="c-card">
        <van-cell
          :border="false"
          icon="/static/images/storeMenu-store.png"
          is-link
          title="店铺装修"
          link-type="navigateTo"
          :url="'../store/storeDecoration?t=' + new Date().getTime()"
        />
        <van-cell
          :border="false"
          icon="/static/images/storeMenu-qr.png"
          is-link
          title="渠道码管理"
          link-type="navigateTo"
          :url="'../channel/channel?t=' + new Date().getTime()"
        />
        <!-- <van-cell
            :border="false"
            icon="hot-o"
            is-link
            title="活动管理"
            link-type="navigateTo"
            url="/subpackages/activities/activities"
            custom-class="c-cell"
          />
          <van-cell
            :border="false"
            icon="comment-o"
            is-link
            title="评价管理"
            link-type="navigateTo"
            url="/subpackages/comment/comments"
            custom-class="c-cell"
          />
          <van-cell
            :border="false"
            icon="newspaper-o"
            is-link
            title="服务案例"
            link-type="navigateTo"
            url="/subpackages/case/cases"
            custom-class="c-cell"
          /> -->
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
const areajs = require('../../resources/js/area.js');
import UniRate from '../uni_modules/uni-rate/components/uni-rate/uni-rate.vue';
export default {
  components: { UniRate },
  data() {
    return {
      functionList: [],
      functionCount: {},
      currentRole: {},
      systemInfo: {
        menuButtonObject: {}
      },
      imageHeight: '',
      // 省市区
      area: {
        areaList: Object.assign({}, areajs.default)
      },
      parnter: {},
      parnterId: '',
      date: {
        show: false,
        data: {}
      },
      user: {},
      functionListTodo: [], //待处理工单块
      functionListCollection: [], //代收款项目块
      functionListAttention: [], //需关注项目
      functionListInspectionAppointment: [], //巡检模块
      functionListToolbox: [], //工具箱
      functionCountTodo: {}, //待处理工单块菜单角标
      functionCountCollection: {}, //代收款项目块菜单角标
      functionCountAttention: {}, //需关注项目菜单角标
      functionCountInspectionAppointment: {}, //巡检模块菜单角标
      functionCountToolbox: {}, //工具箱菜单角标
      SANodeData: {},
      days: '',
      hours: '',
      minutes: '',
      seconds: '',
      functionCountListToolbox: {}
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.systemInfo = app.globalData.systemInfo;
    this.currentRole = wx.getStorageSync('currentRole') || {};
    let user = wx.getStorageSync('user');
    this.parnterId = user.partnerIds[0];
  },
  onShow() {
    if (this.currentRole._id == '8050029062726074247') {
      this.getSANode();
    }
    let menu = wx.getStorageSync('menu');
    wx.setNavigationBarTitle({
      title: menu.name
    });
    let functionList = menu.functionList || [];
    functionList.map(item => {
      let url = item.action;
      if (url) {
        if (url.indexOf('?') != -1) {
          let paramsUrl = url.split('?')[1];
          let paramArr = paramsUrl.split('&');
          let params = {};
          paramArr.map(item => {
            params[item.split('=')[0]] = item.split('=')[1];
          });
          item.orderState = params.orderState;
          item.status = params.status || 'all';
          item.type = params.type || '';
        } else {
          item.status = 'all';
        }
      }
    });
    this.functionList = functionList;
    this.functionList.map(item => {
      if (item.name.includes('待处理工单')) {
        this.functionListTodo = item;
      }
      if (item.name.includes('待收款项目')) {
        this.functionListCollection = item;
      }
      if (item.name.includes('需关注项目')) {
        this.functionListAttention = item;
      }
      if (item.name.includes('巡检模块')) {
        this.functionListInspectionAppointment = item;
      }
      if (item.name.includes('工具箱')) {
        this.functionListToolbox = item;
      }
    });
    this.getFunctionCount();
    this.getParnter();
  },
  onHide() {
    clearInterval(this.timer);
  },
  onUnload() {
    clearInterval(this.timer);
  },
  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    gridClick(func) {
      app.globalData.funcId = func._id;
    },
    clickTo() {
      app.globalData.funcId =
        common.osg.host == 'https://xlinkbeta.fsgo365.cn'
          ? '7860059495079526255'
          : '1438677458489752800';
      wx.setStorageSync('menu', this.functionListTodo);
      common.osg.open('/pages/serviceAppointment/serviceAppointments', {}, { mode: 'switchTab' });
    },
    gridClickS(obj, func) {
      app.globalData.funcId = func._id;
      wx.setStorageSync('menu', obj);

      if (func.action == '/subpackages/map/nearbyCustomers') {
        //检查当前环境
        const systemInfo = uni.getSystemInfoSync();
        const platform = systemInfo.platform;
        if (platform === 'android' || platform === 'ios') {
          common.osg.open('/subpackages/map/nearbyCustomers2', {}); //App端口
        } else {
          common.osg.open(func.action, {}); //微信小程序
        }
      }
    },
    // 查询菜单角标数量
    getFunctionCount() {
      common.osg.ajax(
        '/function/dataCount',
        { functions: JSON.stringify(this.functionList) },
        res => {
          this.functionCount = res.data;
        },
        {
          noload: true
        }
      );
      if (this.functionListTodo != '') {
        common.osg.ajax(
          '/function/dataCount',
          { functions: JSON.stringify(this.functionListTodo.functionList) },
          res => {
            this.functionCountTodo = res.data;
          },
          {
            noload: true
          }
        );
      }
      if (this.functionListCollection != '') {
        common.osg.ajax(
          '/function/dataCount',
          { functions: JSON.stringify(this.functionListCollection.functionList) },
          res => {
            this.functionCountCollection = res.data;
          },
          {
            noload: true
          }
        );
      }
      if (this.functionListAttention != '') {
        common.osg.ajax(
          '/function/dataCount',
          { functions: JSON.stringify(this.functionListAttention.functionList) },
          res => {
            this.functionCountAttention = res.data;
          },
          {
            noload: true
          }
        );
      }
      if (this.functionListInspectionAppointment != '') {
        common.osg.ajax(
          '/function/dataCount',
          { functions: JSON.stringify(this.functionListInspectionAppointment.functionList) },
          res => {
            this.functionCountInspectionAppointment = res.data;
          },
          {
            noload: true
          }
        );
      }
      if (this.functionListToolbox != '') {
        common.osg.ajax(
          '/function/dataCount',
          { functions: JSON.stringify(this.functionListToolbox.functionList) },
          res => {
            this.functionCountListToolbox = res.data;
          },
          {
            noload: true
          }
        );
      }
    },
    // 获取伙伴上的省市区
    getParnter() {
      if (!this.parnterId) {
        this.parnter = {};
        return;
      }
      common.osg.ajax(
        'basic/partner/queryById/' + this.parnterId,
        {},
        res => {
          this.parnter = res;
        },
        {
          noload: true
        }
      );
    },
    onDisplay() {
      this.date.show = true;
    },
    onClose() {
      this.date.show = false;
    },
    formatDate(date) {
      date = new Date(date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm() {
      this.date.show = false;
    },
    getSANode() {
      var params = {
        _all: '1',
        sortField: 'createTime',
        sortOrder: 'asc',
        orderState: 'todo',
        'in:status|array#and': 103
      };
      common.osg.ajax(
        'basic/serviceAppointment/querySAWorkflowNode.do',
        params,
        res => {
          this.SANodeData = res;
          if (this.SANodeData.data.length > 0) {
            // let creatTime = new Date(res.data[0].createTime);
            // 为了确保日期字符串的兼容性，将日期字符串转换为标准的 ISO 8601 格式
            let createTimeStr = res.data[0].createTime.replace(' ', 'T');
            let creatTime = new Date(createTimeStr);

            let didTime = creatTime.getTime();
            let time = new Date();
            let nowTime = time.getTime();
            let str = nowTime - didTime;
            this.getTime(str);
          }
        },
        {
          noload: true
        }
      );
    },
    getTime(str) {
      this.timer = setInterval(() => {
        str = +str + 1000;

        const day = parseInt(str / (1000 * 60 * 60 * 24));
        const hour = parseInt((str % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minute = parseInt((str % (1000 * 60 * 60)) / (1000 * 60));
        const second = ((str % (1000 * 60)) / 1000).toFixed(0);
        (this.days = day < 10 ? '0' + day : day),
          (this.hours = hour < 10 ? '0' + hour : hour),
          (this.minutes = minute < 10 ? '0' + minute : minute),
          (this.seconds = second < 10 ? '0' + second : second);
      }, 1000);
    },
    md(params) {
      common.osg.md(params);
    }
  }
};
</script>

<style lang="scss">
.storeMenu {
  background: #f7f8fa;
  padding-bottom: 1px;
  .van-grid {
    .van-icon--image {
      width: 48px;
      height: 48px;
    }
  }
  .date {
    > view {
      padding: 0;
      background-color: #fed338;
      margin-bottom: 10px;
    }
  }
  .common {
    margin: 15px !important;
    .van_cell {
      padding: 10px 0;
    }
  }
  .van-cell__left-icon-wrap {
    padding: 0 10px;
    .van-icon {
      color: #3079ca;
    }
  }
  .van-grid-item {
    margin-top: 15px;
  }
  .van-grid-item__icon {
    padding: 5px;
  }
  .van-grid-item__text {
    white-space: nowrap;
    height: 30px;
  }
  .menu {
    height: 100vh;
    background-color: #fff;
  }
  .navigation {
    background: #fed338;
    width: calc(100vw - 30px);
    margin: 15px;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 15px;
    margin-top: -40px;
    position: relative;
  }
  .report {
    color: #fff;
    background: #106cff;
    padding: 15px;
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
  .housekeepReport {
    margin: 10px;
    padding: 10px;
    background: #fff;
    border-radius: 8px;
    .housekeepReportBlock {
      padding: 10px 0 10px 0;
      border-radius: 8px;
      font-size: 12px;
      text-align: center;
      background: #f7f8fa;
      display: flex;
      justify-content: space-around;
      .leftBlock {
        width: 20%;
        .firstBlock {
          margin-left: 20px;
          display: flex;
          .firstBlockNumber {
            font-size: 40px;
            color: rgb(197, 29, 29);
          }
          .firstBlockText {
            color: #6d6d6d;
            margin: 20px 0 0 5px;
          }
        }
        .firstBlockText2 {
          color: #6d6d6d;
          margin-top: 5px;
        }
      }
      .middleBlock {
        width: 1px;
        background: #dbd7d7;
        margin: 3px 0 3px 0;
      }
      .lastBlock {
        width: 60%;
        .lastBlockTiem {
          font-size: 40px;
        }
        .lastBlockText {
          color: #6d6d6d;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
