<template>
  <view class="orgUsers" @click.capture="track">
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
            <text>{{ item.orgName }}</text>
            <van-icon name="arrow" />
          </block>
          <block v-else>
            <text class="c-blue" @click="selectedOrgClick(i)" :data-event="{ id: 'mypCf1_mO4' }">
              {{ item.orgName }}
            </text>
            <van-icon name="arrow" />
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
          <view class="user">
            <!-- #ifdef MP-WEIXIN -->
            <van-image width="45" height="45" class="user-avatar" :src="item.avatar" />
            <!-- #endif -->
            <!-- #ifdef APP-PLUS -->
            <image
              style="width: 45px; height: 45px"
              mode="aspectFill"
              class="user-avatar"
              :src="item.avatar"
            />
            <!-- #endif -->
            <view class="user-info">
              <view>
                <text class="c-bold c-m-r-20">{{ item.name }}</text>
                <text class="c-color-value">{{ item.phone }}</text>
              </view>
              <view>
                <van-tag
                  v-for="(roleId, j) in item.roleIds"
                  :key="j"
                  round
                  type="primary"
                  :color="
                    roleId == '3481370558631265818'
                      ? '#E5EFFB'
                      : roleId == '1259263938717893739'
                      ? '#FFEAC9'
                      : '#E4FFF8'
                  "
                  :text-color="
                    roleId == '3481370558631265818'
                      ? '#ff6900'
                      : roleId == '1259263938717893739'
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
              :data-event="{ id: 'u27UddyhoN' }"
            />
          </view>
          <view class="buttons">
            <van-button
              v-if="item.exts.douGong_huifuId && settleOptimizeUserId != item._id"
              key="set"
              size="small"
              round
              icon="debit-pay"
              class="c-m-r-20"
              @click="setSettleOptimizer(item)"
              :data-event="{ id: '6JTfyAjycO' }"
            >
              设为分账接收人
            </van-button>
            <van-button
              v-if="settleOptimizeUserId == item._id"
              key="cancel"
              size="small"
              type="danger"
              plain
              round
              icon="debit-pay"
              class="c-m-r-20"
              @click="cancelSettleOptimizer(item)"
              :data-event="{ id: 'C1kfzH1N6n' }"
            >
              取消分账接收人
            </van-button>
            <van-button
              v-if="item.exts.douGong_huifuId"
              size="small"
              round
              icon="balance-pay"
              class="c-m-r-20"
              @click="
                doOpen('/subpackages2/settleOptimiz/amount', {
                  userId: item._id
                })
              "
              :data-event="{ id: 'SbJUu--EYz' }"
            >
              分账汇总
            </van-button>
            <van-button
              v-if="item.exts.douGong_huifuId"
              size="small"
              round
              icon="balance-list-o"
              class="c-m-r-20"
              @click="
                doOpen('/subpackages2/settleOptimiz/records', {
                  userId: item._id
                })
              "
              :data-event="{ id: '7ixtB25UDB' }"
            >
              分账明细
            </van-button>
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
        :data-event="{ id: '7NLQsD8YaU' }"
      >
        新增用户
      </van-button>
    </view>
    <van-dialog id="van-dialog" />
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
      },
      settleOptimizeUserId: '' // 分账接收人userId
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    this.getOrgs();
    this.getRoles();
    this.getPartner();
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
    },
    setSettleOptimizer(user) {
      common.osg.confirm(`是否确认将“${user.name}”设置为分账接收人？`, () => {
        common.osg.ajax('/biz/settleOptimiz/changeSettleOptimizer', { userId: user._id }, res => {
          this.settleOptimizeUserId = user._id;
          common.osg.toast('设置成功', 'none');
        });
      });
    },
    cancelSettleOptimizer(user) {
      common.osg.confirm(`是否取消“${user.name}”分账接收人？`, () => {
        common.osg.ajax('/biz/settleOptimiz/changeSettleOptimizer', { userId: '' }, res => {
          this.settleOptimizeUserId = '';
          common.osg.toast('取消成功', 'none');
        });
      });
    },
    // 获取当前分账接收人userId
    getPartner() {
      let partnerId = wx.getStorageSync('user').partnerIds[0];
      if (!partnerId) return;
      common.osg.ajax('basic/partner/queryById/' + partnerId, {}, res => {
        this.settleOptimizeUserId = res.exts.settleOptimizeUserId || '';
      });
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
    position: relative;
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
    .user {
      display: flex;
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
    .buttons {
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
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
      border: 1rpx solid #ff6900;
      background: #e5effb;
      color: #ff6900;
      font-weight: 500;
      font-size: 18px;
      height: 40px;
      .van-button__icon {
        font-size: 10px;
        font-weight: 600;
      }
    }
  }
  .operation {
    text {
      color: #8a8a8a;
      font-size: 14px;
    }
  }
}
</style>
