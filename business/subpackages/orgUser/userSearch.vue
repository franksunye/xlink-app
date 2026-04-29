<template>
  <view class="userSearch" @click.capture="track">
    <view class="c-m-b-20">
      <van-search
        :value="searchValue"
        placeholder="搜索用户"
        :focus="true"
        show-action
        @search="onSearch"
        @cancel="onCancel"
        @clear="onClear"
      />
    </view>
    <view class="orgUser">
      <!-- 当前组织用户 -->
      <view class="c-bg-white">
        <view
          v-for="(item, i) in users"
          :key="i"
          class="user-view"
          @click="
            doOpen('./user', {
              userId: item._id
            })
          "
          :data-event="{ id: 'zAjRCHIwkF' }"
        >
          <van-image
            width="60"
            height="60"
            class="user-avatar"
            :src="item.avatar"
            :data-event="{ id: 'zAjRCHIwkF' }"
          />
          <view class="user-info" :data-event="{ id: 'zAjRCHIwkF' }">
            <view :data-event="{ id: 'zAjRCHIwkF' }">
              <text class="c-bold c-m-r-20" :data-event="{ id: 'zAjRCHIwkF' }">
                {{ item.name }}
              </text>
              <text class="c-color-value" :data-event="{ id: 'zAjRCHIwkF' }">{{ item.phone }}</text>
            </view>
            <view class="c-size-14 c-color-value" :data-event="{ id: 'zAjRCHIwkF' }">
              {{ item.orgName }}
            </view>
            <view :data-event="{ id: 'zAjRCHIwkF' }">
              <van-tag
                v-for="(roleId, j) in item.roleIds"
                :key="j"
                plain
                type="primary"
                class="c-m-r-20 c-inline-flex"
              >
                {{ formatRole(roleId) }}
              </van-tag>
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
      searchValue: '',
      users: [],
      options: {
        roles: []
      }
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    this.getRoles();
  },
  methods: {
    doOpen(path, params) {
      common.osg.open(path, params);
    },
    getRoles() {
      common.osg.ajax(
        'role/query',
        {
          _all: 1,
          'is:state|integer#and': 1,
          notFilterOrgId: '1',
          notFilterBelongTo: '1'
        },
        res => {
          res.data.map(item => {
            item.value = item._id;
          });
          this.options.roles = res.data;
        }
      );
    },
    formatRole(value) {
      return common.osg.codelabel('roles', value);
    },
    getUsers() {
      common.osg.ajax(
        'user/query',
        {
          _all: '1',
          'in:state|array-integer#and': '0,1',
          'regex:code|string#or': this.searchValue,
          'regex:name|string#or': this.searchValue,
          'regex:phone|string#or': this.searchValue,
          sortField: 'createTime',
          sortOrder: 'asc'
        },
        res => {
          this.users = res.data;
        }
      );
    },
    onSearch(e) {
      this.searchValue = e.detail;
      if (this.searchValue) {
        this.getUsers();
      } else {
        this.users = [];
      }
    },
    onCancel() {
      wx.navigateBack({
        delta: 1
      });
    },
    onClear() {
      this.users = [];
    }
  }
};
</script>

<style lang="scss">
.userSearch {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .user-view {
    padding: 10px 20px 10px;
    display: flex;
    align-items: center;
    .user-avatar {
      display: flex;
      margin-right: 20px;
      > view {
        border-radius: 5px;
        overflow: hidden;
      }
    }
    .user-info {
      flex: 1;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
  .orgUser {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 10px;
  }
}
</style>
