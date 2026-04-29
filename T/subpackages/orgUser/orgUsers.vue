<template>
  <view class="orgUsers">
    <view>
      <view class="line-top"></view>
      <van-search
        placeholder="搜索用户"
        disabled
        shape="round"
        @click-input="doOpen('./userSearch')"
      />
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
        <view v-for="(item, i) in users" :key="i" class="user-view">
          <van-image width="45" height="45" class="user-avatar" :src="item.avatar" />
          <view class="user-info">
            <view>
              <text class="c-color-titlec-bold c-m-r-20">{{ item.name }}</text>
              <text class="c-color-value">{{ item.phone }}</text>
            </view>
            <view>
              <van-tag
                v-for="(roleId, j) in item.roleIds"
                :key="j"
                round
                type="primary"
                :color="
                  roleId == '8050029062726074247'
                    ? '#E5EFFB'
                    : roleId == '5424993602217461538'
                    ? '#FFEAC9'
                    : '#E4FFF8'
                "
                :text-color="
                  roleId == '8050029062726074247'
                    ? '#0078D0'
                    : roleId == '5424993602217461538'
                    ? '#AE6C06'
                    : '#4C8F7E'
                "
                class="c-m-r-20"
                custom-class="c-tag"
              >
                {{ formatRole(roleId) }}
              </van-tag>
            </view>
          </view>
          <view>
            <van-icon
              name="edit"
              size="22px"
              color="#8A8A8A"
              @click="
                doOpen('./user', {
                  userId: item._id
                })
              "
              style="margin-right: 15px"
            />
            <!-- <van-icon name="delete-o" size="22px" color="#8A8A8A" style="margin-right: 15px" /> -->
          </view>
        </view>
      </view>
    </view>
    <!-- 添加组织、添加用户 -->
    <view class="c-button-bottom">
      <!-- <view>
        <van-icon name="add" class="c-green" />
        <text>添加组织</text>
      </view> -->
      <van-button
        icon="plus"
        block
        round
        custom-class="c-btn-bottom"
        @click="
          doOpen('./user', {
            orgId: selectedOrgs[selectedOrgs.length - 1]._id,
            orgName: selectedOrgs[selectedOrgs.length - 1].orgName
          })
        "
      >
        新增用户
      </van-button>
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
      flex-direction: column;
      justify-content: space-around;
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
  .c-button-bottom {
    padding: 20px;
    .c-btn-bottom {
      border: 1rpx solid #0078d0;
      background: #e5effb;
      color: #0078d0;
      font-weight: 500;
      font-size: 18px;
      height: 40px;
      .van-button__icon {
        font-size: 10px;
        font-weight: 600;
      }
    }
  }
}
</style>
