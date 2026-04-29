<template>
  <view class="amount" @click.capture="track">
    <uni-forms :modelValue="formData">
      <uni-forms-item label="分账日期" name="daterange">
        <!-- 清空时后台默认查询当月数据，所以不允许清空 -->
        <uni-datetime-picker
          v-model="formData.daterange"
          type="daterange"
          :clear-icon="false"
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
              getData();
            }
          "
        ></uni-data-select>
      </uni-forms-item>
    </uni-forms>
    <scroll-view
      v-if="fpi.data.length > 0"
      scroll-y
      @refresherrefresh="refresherRefresh"
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      class="c-cards"
      style="padding-top: 10px"
    >
      <view
        v-for="(item, i) in fpi.data"
        :key="i"
        class="c-card c-flex c-flex-between c-item-center c-m-t-0"
        @click="
          doOpen('./records', {
            userId: item._id,
            daterange: formData.daterange
          })
        "
        :data-event="{ id: 'hRUlHXgOXi' }"
      >
        <view class="c-card-content-item-value" :data-event="{ id: 'hRUlHXgOXi' }">
          <text style="display: inline-block; min-width: 60px" :data-event="{ id: 'hRUlHXgOXi' }">
            {{ item.name }}
          </text>
          <text :data-event="{ id: 'hRUlHXgOXi' }">{{ item.phone }}</text>
        </view>
        <view>
          <text class="c-size-22 c-red c-bold c-m-r-10" :data-event="{ id: 'hRUlHXgOXi' }">
            {{ item.exts.settleOptimizeAmount }}
          </text>
          <text class="c-size-14" :data-event="{ id: 'hRUlHXgOXi' }">元</text>
          <van-icon
            name="arrow"
            class="c-m-l-20"
            color="#646566"
            :data-event="{ id: 'hRUlHXgOXi' }"
          />
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
    // 默认赋值分账日期范围为本月
    const now = new Date();
    this.formData.daterange = [
      common.osg.readableTime(new Date(now.getFullYear(), now.getMonth(), 1), 'date'),
      common.osg.readableTime(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'date')
    ];
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
        this.getData();
      }, 100);
    },
    getData(callback) {
      console.log(JSON.stringify(this.formData));
      common.osg.ajax(
        'biz/settleOptimiz/queryByUserId',
        {
          startDate: this.formData.daterange[0] || null,
          endDate: this.formData.daterange[1] || null,
          userId: this.formData.userId || null
        },
        res => {
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
        }
      );
    },
    // 下拉刷新
    refresherRefresh() {
      this.refresherTriggered = true;
      this.fpi.page = 1;
      this.getData(() => {
        this.refresherTriggered = false;
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
    doOpen(path, params) {
      common.osg.open(path, params);
    }
  }
};
</script>

<style lang="scss">
.amount {
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
