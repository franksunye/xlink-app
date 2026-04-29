<template>
  <view class="orgUsers">
    <view>
      <van-search placeholder="搜索用户" disabled @click-input="doOpen('./userSearch')" />
      <!-- 当前组织 -->
      <view class="selectedOrg-view">
        <block v-for="(item, i) in selectedOrgs" :key="i">
          <block v-if="i == selectedOrgs.length - 1">
            <text class="c-color-title">{{ item.orgName }}</text>
            <van-icon name="arrow" class="c-color-title" />
          </block>
          <block v-else>
            <text class="c-blue" @click="selectedOrgClick(i)">{{ item.orgName }}</text>
            <van-icon name="arrow" class="c-color-title" />
          </block>
        </block>
      </view>
    </view>
    <view class="orgUser">
      <!-- 下级组织 -->
      <block v-for="(item, i) in selectedOrgs" :key="i">
        <block v-if="i == selectedOrgs.length - 1">
          <van-cell
            v-for="(org, j) in item.orgList"
            :key="j"
            value-class="org-cell-value"
            :title="org.orgName"
            is-link
            @click="orgClick(org)"
          />
        </block>
      </block>
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
        >
          <van-image width="60" height="60" class="user-avatar" :src="item.avatar" />
          <view class="user-info">
            <view>
              <text class="c-color-titlec-bold c-m-r-20">{{ item.name }}</text>
              <text class="c-color-value">{{ item.phone }}</text>
            </view>
            <view>
              <van-tag
                v-for="(roleId, j) in item.roleIds"
                :key="j"
                plain
                type="primary"
                class="c-m-r-20"
              >
                {{ formatRole(roleId) }}
              </van-tag>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 添加组织、添加用户 -->
    <view class="orgUser-add">
      <!-- <view>
        <van-icon name="add" class="c-green" />
        <text>添加组织</text>
      </view> -->
      <view
        @click="
          doOpen('./user', {
            orgId: selectedOrgs[selectedOrgs.length - 1]._id,
            orgName: selectedOrgs[selectedOrgs.length - 1].orgName
          })
        "
      >
        <van-icon name="add" class="c-blue" />
        <text>添加用户</text>
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
      selectedOrgs: [],
      orgs: {},
      users: [],
      options: {
        roles: []
      }
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    this.getOrgs();
    this.getRoles();
  },
  onShow() {
    if (this.selectedOrgs.length > 0) {
      this.getUsers();
    }
  },
  methods: {
    doOpen(path, params) {
      common.osg.open(path, params);
    },
    getOrgs() {
      common.osg.ajax(
        '/org/queryCascade.do',
        {
          notFilterOrgId: 1,
          sortField: 'order'
        },
        res => {
          this.orgs = res.data;
          this.selectedOrgs = [
            {
              _id: res.data._id,
              orgName: res.data.orgName || wx.getStorageSync('user').orgName,
              orgList: res.data.orgList
            }
          ];
          this.getUsers();
        }
      );
    },
    selectedOrgClick(i) {
      this.selectedOrgs = this.selectedOrgs.slice(0, i + 1);
      this.getUsers();
    },
    orgClick(org) {
      this.selectedOrgs.push({
        _id: org._id,
        orgName: org.orgName,
        orgList: org.orgList
      });
      this.getUsers();
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
          'is:orgId|string#and': this.selectedOrgs[this.selectedOrgs.length - 1]._id,
          sortField: 'createTime',
          sortOrder: 'asc'
        },
        res => {
          this.users = res.data;
        }
      );
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
  .orgUser-add {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #fff;
    height: 60px;
    box-sizing: border-box;
    border-top: 1px solid #f7f8fa;
    > view {
      text {
        margin-left: 10px;
      }
    }
  }
}
</style>
