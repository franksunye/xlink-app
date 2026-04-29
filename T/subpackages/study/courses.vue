<template>
  <view class="courses">
    <view class="top">
      <van-search
        placeholder="搜课程/培训"
        shape="round"
        :value="searchValue"
        @search="onSearch"
        @clear="onSearchClear"
        custom-class="c-search"
      />
      <van-tabs
        :active="activeTab"
        @change="onTabChange"
        color="#067CD2"
        title-active-color="#067CD2"
        line-width="25px"
        :ellipsis="false"
      >
        <van-tab title="推荐" name="recommend"></van-tab>
        <van-tab
          v-for="(item, i) in options.TcourseType"
          :key="i"
          :title="item.name"
          :name="item.value"
        ></van-tab>
      </van-tabs>
    </view>
    <view class="cards">
      <view class="card" v-for="(item, i) in fpi.data" :key="i">
        <!-- item.images && item.images[0] && item.images[0].url -->
        <van-image
          width="130px"
          height="100%"
          fit="cover"
          custom-class="card-image"
          :src="item.images && item.images[0] && item.images[0].url"
        />
        <view class="content">
          <view>
            <view class="title c-nowrap">{{ item.name }}</view>
            <view class="desc c-ellipsis2" @click="toast(item.intro)">
              {{ item.intro }}
            </view>
          </view>
          <van-button
            type="info"
            round
            size="small"
            @click="
              doOpen(
                item.type == '1' ? '../web/web' : 'course',
                item.type == '1'
                  ? { url: `${host}/fsgo/wm/learnings/findByIdH5?id=${item._id}` }
                  : { id: item._id }
              )
            "
            class="c-text-right"
            custom-class="button"
          >
            去学习
          </van-button>
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
      currentRoleId: '',
      searchValue: '',
      activeTab: 'recommend',
      fpi: {
        data: []
      },
      options: {
        codecfg_courseType: { codeId: 'courseType' },
        codecfg_TcourseType: { codeId: 'TcourseType' },
        courseType: []
      },
      host: common.osg.host
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.currentRoleId = wx.getStorageSync('currentRole')._id;
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    toast(msg) {
      common.osg.toast(msg, 'none', 5000);
    },
    onSearch(e) {
      this.searchValue = e.detail;
      this.getData();
    },
    onSearchClear() {
      this.searchValue = '';
      this.getData();
    },
    onTabChange(e) {
      this.activeTab = e.detail.name;
      this.getData();
    },
    getData() {
      common.osg.ajax(
        'wm/learnings/query',
        {
          _all: '1',
          'is:exts.tCourseType|string#and': this.activeTab == 'recommend' ? null : this.activeTab,
          'is:state|integer#and': 1,
          'is:exts.learningType|string#and': 't',
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          'regex:name|string#or': this.searchValue,
          'regex:intro|string#or': this.searchValue,
          'is:recommend|string#and': this.activeTab == 'recommend' ? '1' : null,
          'in:roleIds|array#and': this.currentRoleId
        },
        res => {
          this.fpi = res;
        }
      );
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style lang="scss">
.courses {
  background-color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .top {
    border-top: 1rpx solid rgba(0, 0, 0, 0.1);
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
    .c-search {
      padding: 10px 15px 8px;
    }
  }
  .cards {
    flex: 1;
    overflow-y: auto;
    .card {
      margin: 15px;
      display: flex;
      height: 100px;
      .card-image {
        display: flex;
        border-radius: 8px;
        overflow: hidden;
        margin-right: 10px;
      }
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        .title {
          font-size: 14px;
          font-weight: 600;
          height: 25px;
          line-height: 25px;
        }
        .desc {
          font-size: 11px;
          color: #666666;
          line-height: 34rpx;
          margin: 1px 0 5px;
        }
        .button {
          background-color: #edf5fd;
          border-color: #edf5fd;
          color: #0988f3;
          width: 85px;
          height: 30px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
