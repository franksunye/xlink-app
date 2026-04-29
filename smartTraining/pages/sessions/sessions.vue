<template>
  <view>
    <view class="search">
      <view class="search-item c-flex c-item-center">
        <uni-data-select
          v-model="search.status"
          :localdata="status"
          placeholder="筛选对练状态"
          @change="getSessions"
          class="c-flex-1"
        ></uni-data-select>
        <view
          v-if="searchFold"
          class="c-m-l-20 c-flex c-flex-col c-item-center c-gray"
          @click="searchFold = !searchFold"
        >
          <i class="iconfont icon-filter-o"></i>
          <text class="c-size-10">更多</text>
        </view>
      </view>
      <view class="search-item" v-if="!searchFold">
        <uni-easyinput
          v-model="search.scenario_name"
          placeholder="搜索场景名称"
          @input="getSessions"
          @clear="getSessions"
        />
      </view>
      <!-- <view class="search-item" v-if="!searchFold">
        <uni-easyinput
          v-model="search.profile_name"
          placeholder="搜索客户画像名称"
          @input="getSessions"
          @clear="getSessions"
        />
      </view>
      <view class="search-item" v-if="!searchFold">
        <uni-datetime-picker
          type="daterange"
          return-type="string"
          v-model="search.created_at"
          @change="getSessions"
          start-placeholder="创建日期开始"
          end-placeholder="创建日期结束"
        />
      </view> -->
      <view v-if="!searchFold" class="search-fold c-size-14" @click="searchFold = !searchFold">
        <uni-icons type="up" size="20" color="#969799"></uni-icons>
        <text class="c-m-l-20">收起筛选条件</text>
      </view>
    </view>
    <block v-for="(item, i) in data" :key="data">
      <view class="card">
        <view class="c-flex c-flex-between c-item-center">
          <view style="line-height: 35px">
            <view class="c-flex">
              <i
                class="iconfont icon-changjing"
                style="color: #646566; font-size: 22px; margin-right: 8px"
              ></i>
              <text class="c-bold c-size-16">{{ item.scenario_name }}</text>
            </view>
            <view class="c-flex">
              <i
                class="iconfont icon-kehuhuaxiang"
                style="color: #646566; font-size: 18px; margin-left: 2px; margin-right: 11px"
              ></i>
              <text style="color: #646566; font-size: 14px">{{ item.profile_name }}</text>
            </view>
          </view>
          <uni-tag
            :text="item.status == 'completed' ? '已完成' : '进行中'"
            type="primary"
            circle
            :class="item.status == 'completed' ? 'c-uni-tag c-uni-tag-completed' : 'c-uni-tag'"
          />
        </view>
        <view
          v-if="item.total_score || item.total_score === 0"
          class="c-flex c-flex-between c-item-center"
          style="height: 40px; margin-left: 28px"
        >
          <view class="c-flex c-item-center">
            <uni-rate allow-half :value="5 * (item.total_score / 100)" />
            <text class="c-m-l-20 c-size-14 c-gray">{{ item.total_score }}分</text>
          </view>
          <text class="c-blue" @click="doOpen('/subpackages/evaluation/evaluation', data[i].id)">
            评估结果
          </text>
        </view>
        <view
          class="c-flex c-flex-between c-item-center"
          style="margin-left: 30px; margin-top: 5px"
        >
          <text class="c-size-14 c-color-value">{{ item.created_at }}</text>
          <text class="c-blue" @click="doOpen('/subpackages/session/session', data[i].id)">
            {{ item.status == 'completed' ? '对练详情' : '继续对练' }}
          </text>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      user: {},
      search: {},
      searchFold: true,
      data: [],
      status: [
        { text: '已完成', value: 'completed' },
        {
          text: '进行中',
          value: 'in_progress'
        }
      ]
    };
  },
  onLoad() {
    common.osg.init(this, {}, app);
    this.user = uni.getStorageSync('user');
  },
  onShow() {
    common.osg.init(this, {}, app);
    this.getSessions();
  },
  methods: {
    getSessions() {
      let params = { page: 1, per_page: 100, staff_id: this.user.userId };
      if (this.search.scenario_name) {
        params.search = this.search.scenario_name;
      }
      if (this.search.status) {
        params.status = this.search.status;
      }
      if (this.search.created_at) {
      }
      common.osg.ajax(
        '/training/sessions',
        params,
        res => {
          this.data = res.sessions;
        },
        {
          noload: true,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    formatTime(val) {
      return common.osg.readableTime(val, 'shortDatetime');
    },
    doOpen(path, id) {
      common.osg.open(path, { sessionId: id });
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  padding: 2px 16px;
  background-color: #fff;
  .search-item {
    margin: 8px 0;
  }
  .search-fold {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #969799;
    margin-bottom: 6px;
  }
}
.card {
  margin: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  line-height: 27px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .c-uni-tag {
    ::v-deep .uni-tag {
      background-color: rgb(219, 234, 254);
      border-color: rgb(219, 234, 254);
      color: #106cff;
      font-size: 14px;
    }
  }
  .c-uni-tag-completed {
    ::v-deep .uni-tag {
      background-color: rgb(220, 252, 231);
      border-color: rgb(220, 252, 231);
      color: rgb(22, 163, 74);
      font-size: 14px;
    }
  }
}
</style>
