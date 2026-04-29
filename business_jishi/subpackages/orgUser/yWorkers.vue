<template>
  <view class="orgUsers" @click.capture="track">
    <view>
      <view class="line-top"></view>
      <van-search
        :value="searchValue"
        :focus="true"
        @change="onChange"
        @search="onSearch"
        placeholder="搜索工人"
        shape="round"
      />
    </view>
    <view class="orgUser">
      <!-- 当前组织用户 -->
      <view class="c-bg-white">
        <view v-for="(item, i) in users" :key="i" class="user-view">
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
                round
                type="primary"
                :color="'#E4FFF8'"
                :text-color="'#4C8F7E'"
                class="c-m-r-20"
                custom-class="c-tag"
              >
                云用工
              </van-tag>
            </view>
          </view>
          <view>
            <van-icon
              name="edit"
              size="22px"
              color="#8A8A8A"
              @click="
                doOpen('./workers', {
                  userId: item._id
                })
              "
              style="margin-right: 15px"
              :data-event="{ id: 'IR1d6aFLv9' }"
            />
            <van-icon
              @click="deleteWorker(item)"
              name="delete-o"
              size="22px"
              color="#8A8A8A"
              style="margin-right: 15px"
              :data-event="{ id: 'R8eOiTL3I1' }"
            />
          </view>
        </view>
      </view>
    </view>
    <!-- 添加组织、添加用户 -->
    <view class="c-button-bottom">
      <van-button
        icon="plus"
        block
        round
        custom-class="c-btn-bottom"
        @click="doOpen('./workers')"
        :data-event="{ id: '9iJP5TILki' }"
      >
        新增用户
      </van-button>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import Dialog from '../../wxcomponents/vant/dialog/dialog';

const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      users: [],
      searchValue: '' //搜索内容
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
  },
  onShow() {
    this.getUsers();
  },
  methods: {
    //跳转接口
    doOpen(path, params) {
      common.osg.open(path, params);
    },
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
        'biz/labour/query',
        {
          _all: '1',
          'in:state|array-integer#and': '0,1',
          sortField: 'createTime',
          sortOrder: 'asc',
          'regex:code|string#or': this.searchValue,
          'regex:name|string#or': this.searchValue,
          'regex:phone|string#or': this.searchValue
        },
        res => {
          this.users = res.data;
        }
      );
    },
    //删除
    deleteWorker(item) {
      console.log(item);
      Dialog.confirm({
        title: '删除操作',
        message: `是否确认删除“${item.name}用户”？`,
        dataEvent: { id: 'HZgqWt5R7G' }
      })
        .then(() => {
          common.osg.ajax('biz/labour/delete', { id: item._id }, () => {
            common.osg.toast('操作成功', 'success');
            this.getUsers();
          });
        })
        .catch(err => {
          console.log(err);
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
}
</style>
