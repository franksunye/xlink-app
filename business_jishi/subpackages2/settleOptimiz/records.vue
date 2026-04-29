<template>
  <view class="records" @click.capture="track">
    <uni-forms :modelValue="formData">
      <uni-forms-item label="分账日期" name="daterange">
        <!-- 清空时后台默认查询当月数据，所以不允许清空 -->
        <uni-datetime-picker
          v-model="formData.daterange"
          type="daterange"
          @change="daterangeChange"
        />
      </uni-forms-item>
      <uni-forms-item label="收款员工" name="userId">
        <uni-data-select
          v-model="formData.userId"
          :localdata="options.users"
          placeholder=" "
          @change="
            () => {
              fpi.page = 1;
              fpi.rows = 10;
              getData();
            }
          "
        ></uni-data-select>
      </uni-forms-item>
    </uni-forms>
    <scroll-view
      v-if="fpi.data.length > 0"
      scroll-y
      @scrolltolower="scrollToLower"
      @refresherrefresh="refresherRefresh"
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      class="c-cards"
      style="padding-top: 10px"
    >
      <view v-for="(item, i) in fpi.data" :key="i" class="c-card c-m-t-0">
        <view class="c-card-content">
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">收款员工：</view>
            <view>{{ item.typeName }}</view>
          </view>
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">分账金额：</view>
            <view>
              <text class="c-red c-bold c-m-r-10">{{ item.settleItemAmount }}</text>
              元
            </view>
          </view>
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">分账时间：</view>
            <view>
              {{ item.createTime }}
            </view>
          </view>
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">合同编号：</view>
            <view
              @click="copy(item.contractdocNum, '已复制合同编号')"
              :data-event="{ id: 'deUQDP5O5J' }"
            >
              {{ item.contractdocNum }}
            </view>
          </view>
          <view v-if="item.serviceAppointmentNum" class="c-card-content-item">
            <view class="c-card-content-item-label">工单编号：</view>
            <view
              @click="copy(item.serviceAppointmentNum, '已复制工单编号')"
              :data-event="{ id: 'NY8-4x990F' }"
            >
              {{ item.serviceAppointmentNum }}
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <van-empty v-if="loaded && fpi.data.length == 0" description="暂无数据" />
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      loaded: false,
      loadType: '',
      refresherTriggered: false, // 已触发下拉加载
      reachBottom: false, // 触底
      formData: {
        daterange: [],
        userId: ''
      },
      fpi: {
        page: 1,
        rows: 10,
        data: []
      },
      options: {
        users: []
      }
    };
  },
  onLoad(param) {
    this.loadType = 'onLoad';
    common.osg.init(this, param, app);
    if (param.userId) {
      this.formData.userId = param.userId;
    }
    if (param.daterange) {
      // 从员工分账金额页面进入
      this.formData.daterange = param.daterange.split(',');
    } else {
      // 默认赋值分账日期范围为本月
      const now = new Date();
      this.formData.daterange = [
        common.osg.readableTime(new Date(now.getFullYear(), now.getMonth(), 1), 'date'),
        common.osg.readableTime(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'date')
      ];
    }
    this.getData();
    this.getUsers();
  },
  onShow() {
    if (this.loadType == 'onShow') {
      // 非首次进入页面
      common.osg.init(this, {}, app);
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.getData();
      this.getUsers();
    } else {
      // 首次进入页面
      this.loadType = 'onShow';
    }
  },
  methods: {
    // 清空时间时，立即获取组件值并没有被清空
    daterangeChange() {
      setTimeout(() => {
        this.fpi.page = 1;
        this.fpi.rows = 10;
        this.getData();
      }, 100);
    },
    getData(callback) {
      let params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:type|integer#and': 0, // 分账类型：0.服务商指定员工
        'is:settleItemState|integer#and': 2, // 分账状态：2.分账成功
        'gte:createTime|date#and': this.formData.daterange[0] || null,
        'lte:createTime|date#and': this.formData.daterange[1] || null,
        'is:typeId|string#and': this.formData.userId || null
      };
      common.osg.ajax('biz/settleOptimiz/query', params, res => {
        if (this.reachBottom) {
          // 上拉加载时
          if (res.data.length == 0) {
            // 没有更多数据时恢复页码
            this.fpi.page > 0 && this.fpi.page--;
            common.osg.toast('没有更多数据', 'none');
          } else {
            // 有更多数据时插入到当前列表底部
            this.fpi.data = this.fpi.data.concat(res.data);
          }
        } else {
          // 搜索或下拉刷新时将第1页数据直接覆盖整个列表
          this.fpi = res;
        }
        this.loaded = true;
        if (callback) callback();
      });
    },
    // 下拉刷新
    refresherRefresh() {
      this.refresherTriggered = true;
      this.fpi.page = 1;
      this.getData(() => {
        this.refresherTriggered = false;
      });
    },
    // 触底价值
    scrollToLower() {
      if (this.reachBottom) return;
      this.reachBottom = true;
      this.fpi.page++;
      this.getData(() => {
        this.reachBottom = false;
      });
    },
    getUsers() {
      common.osg.ajax(
        'user/query',
        {
          page: 1,
          rows: 100,
          'in:state|array-integer#and': '0,1',
          'exists:exts.douGong_huifuId|boolean#and': true,
          sortField: 'createTime',
          sortOrder: 'asc'
        },
        res => {
          let users = [];
          res.data.map(item => {
            users.push({
              text: item.name,
              value: item._id
            });
          });
          this.options.users = users;
        },
        {
          noload: true
        }
      );
    },
    codelabel(type, option, val, opts, frontEndConfig) {
      try {
        if (type == 'select') {
          return common.osg.codelabel(option, val, opts);
        } else if (type == 'cascade') {
          if (frontEndConfig && frontEndConfig.multiple) {
            return common.osg.formatCascadeMultiple(option, val);
          } else {
            return common.osg.formatCascade(option, val);
          }
        }
      } catch (e) {}
    },
    // 复制到剪切板
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    }
  }
};
</script>

<style lang="scss">
.records {
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .uni-forms {
    margin: 0 16px;
    .uni-forms-item {
      margin-bottom: 10px;
    }
    .uni-date-editor--x {
      .uniui-clear {
        font-size: 24px !important;
        margin-right: 2px;
      }
    }
  }
  .c-cards {
    flex: 1;
    overflow: hidden;
    padding: 0;
    background-color: #f7f8fa;
    .c-card-content-item-label {
      min-width: 80px;
    }
  }
}
</style>
