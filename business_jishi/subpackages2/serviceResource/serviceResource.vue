<template>
  <view class="orgUsers">
    <view>
      <view class="line-top"></view>
      <van-search
        :value="searchValue"
        :focus="true"
        @change="onChange"
        @search="onSearch"
        placeholder="搜索服务资源"
        shape="round"
      />
    </view>
    <view class="orgUser">
      <!-- 当前组织用户 -->
      <view class="c-bg-white">
        <view v-for="(item, i) in users" :key="i" class="user-view">
          <view class="user-info">
            <view>
              <view>
                <text class="c-bold c-m-r-20">{{ item.name }}</text>
                <text class="c-color-value">{{ item.phone }}</text>
              </view>
              <view>
                <van-tag
                  round
                  type="primary"
                  :color="'#E4FFF8'"
                  :text-color="'#4C8F7E'"
                  class="c-m-r-20"
                  custom-class="c-tag"
                  v-for="item in item.serviceType"
                  :key="item"
                >
                  {{ codelabel('serviceType', item) }}
                </van-tag>
              </view>
            </view>
            <view style="display: flex; align-items: center; font-weight: bolder">
              <view
                :class="['status-dot', item.workType == '0' ? 'dot-online' : 'dot-offline']"
              ></view>
              <view
                :class="[item.workType == '0' ? 'status-online' : 'status-offline']"
                style="width: max-content; margin-left: 5px"
              >
                {{ item.workType == '0' ? '在线' : '离线' }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      users: [],
      searchValue: '', //搜索内容
      options: {
        codecfg_serviceType: {
          codeId: 'serviceType'
        }
      }
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
  },
  onShow() {
    this.getUsers();
    common.osg.codeoption();
  },
  methods: {
    //确定搜索时触发
    onSearch() {
      this.getUsers();
    },
    //搜索框改变事件
    onChange(e) {
      this.searchValue = e.detail;
      this.getUsers();
    },
    getUsers() {
      common.osg.ajax(
        'biz/serviceResource/query',
        {
          _all: '1',
          'in:state|array-integer#and': '0,1',
          'is:resourceType|string': 'technician',
          sortField: 'workType',
          sortOrder: 'desc', //

          'regex:code|string#or': this.searchValue,
          'regex:name|string#or': this.searchValue,
          'regex:phone|string#or': this.searchValue
        },
        res => {
          console.log(1111222, res.data);

          this.users = res.data;
        }
      );
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    }
  }
};
</script>

<style lang="scss">
.orgUsers {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .selectedOrg-view {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 0 16px 10px;
    overflow-x: auto;
    white-space: nowrap;
  }
  .org-cell-value {
    flex: 0;
  }
  .user-view {
    padding: 15px 0;
    display: flex;
    align-items: center;
    position: relative;
    // border-bottom: 1rpx solid #e6e6e6;
    &:after {
      position: absolute;
      content: '';
      border-bottom: 2rpx solid #e6e6e6;
      width: 200%;
      height: 0;
      bottom: 0;
      left: 0;
      transform: scale(0.5);
      transform-origin: 0 0;
      opacity: 0.9;
    }
    .user-avatar {
      display: flex;
      margin-right: 15px;
      > view {
        border-radius: 5px;
        overflow: hidden;
      }
    }
    .user-info {
      flex: 1;
      min-height: 45px;
      display: flex;
      //   flex-direction: column;
      justify-content: space-between;
      .c-tag {
        font-size: 10px;
        font-weight: 500;
      }
    }
  }
  .orgUser {
    flex: 1;
    overflow-y: auto;
    padding: 0 15px 80px;
    background: #fff;
  }
}

.status-dot {
  width: 12px; // 圆点的宽度
  height: 12px; // 圆点的高度
  border-radius: 50%; // 圆形
  margin-right: 5px; // 圆点与文本之间的间距
}

.dot-online {
  background-color: green; // 在线状态的圆点颜色
}

.dot-offline {
  background-color: red; // 离线状态的圆点颜色
}
</style>
