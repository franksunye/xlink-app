<template>
  <view class="addWorker">
    <view class="addWorker-top">
      <view class="searchStyle">
        <uni-easyinput
          clearSize="22"
          class="uni-easyinput"
          prefixIcon="search"
          v-model="searchValue"
          placeholder="搜索工人姓名/手机号"
          @confirm="onSearch"
          @clear="onClear"
          primaryColor="#c0c4cc"
        ></uni-easyinput>
      </view>

      <view class="worker-actions">
        <view class="action-group">
          <view class="action-item" @tap="doOpen('/subpackages2/addWorker/newWorker')">
            <button type="default" plain="true" style="justify-content: normal">
              <uni-icons color="#316bf6" type="contact" size="30"></uni-icons>
              创建工人账号
            </button>
          </view>
          <!-- <view class="action-item">
            <button type="default" plain="true">
              <uni-icons color="#07c160" type="weixin" size="30"></uni-icons>
              微信邀请加入
            </button>
          </view> -->
        </view>
      </view>

      <view class="worker-list">
        <view
          class="worker-item"
          v-for="(item, index) in workerAccounts"
          :key="index"
          @tap="toggleCheck(item)"
        >
          <view class="checkbox-container">
            <view class="checkbox-box" :class="{ checked: item.isChecked }">
              <uni-icons
                v-if="item.isChecked"
                type="checkmarkempty"
                size="14"
                color="#fff"
              ></uni-icons>
            </view>
          </view>
          <view class="worker-info">
            <image
              style="width: 50px; height: 50px; border-radius: 5px; margin: 0px 15px"
              :src="item.avatar || 'https://pub.fsgo365.cn/logo_square.png'"
            ></image>
            <view>
              <view class="worker-name">{{ item.name }}</view>
              <text class="worker-phone" style="color: var(--gray-6)">{{ item.phone }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-bar">
      <view>已选择:{{ selectedCount }}人</view>
      <van-button
        v-if="projectTaskStatus != 2"
        @click="submit"
        style="width: 200px"
        type="info"
        block
      >
        确定
      </van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
import UniIcons from '../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
export default {
  components: {
    UniIcons
  },
  data() {
    return {
      projectId: '',
      projectTaskStatus: '',
      searchValue: '', //输入框名称
      workerAccounts: []
    };
  },
  //计算属性 来计算当前勾选了多少个
  computed: {
    selectedCount() {
      return this.workerAccounts.filter(item => item.isChecked).length;
    }
  },
  onLoad(param) {
    this.projectId = param.projectId;
    this.projectTaskStatus = param.status;
  },
  onShow() {
    this.getMyLabours(() => {
      this.getProjectLabours();
    });
  },
  methods: {
    //获取本服务商工人
    getMyLabours(callback) {
      common.osg.ajax(
        'biz/labour/myLabour',
        {
          _all: '1',
          'in:state|array-integer#and': '0,1',
          sortField: 'createTime',
          sortOrder: 'asc',
          'regex:name|string#or': this.searchValue,
          'regex:phone|string#or': this.searchValue
        },
        res => {
          res.data.map(item => {
            item.isChecked = false;
          });
          this.workerAccounts = res.data;
          if (callback) callback();
        }
      );
    },
    // 获取本项目工人
    getProjectLabours() {
      common.osg.ajax(
        'biz/labour/findByProjectId',
        {
          projectId: this.projectId
        },
        res => {
          let projectLabourIds = res.data.map(item => item._id);
          this.workerAccounts.map(item => {
            if (projectLabourIds.indexOf(item._id) == -1) {
              item.isChecked = false;
            } else {
              item.isChecked = true;
            }
          });
        }
      );
    },
    //确定搜索时触发
    onSearch() {
      this.getMyLabours();
    },
    onClear() {
      this.searchValue = '';
      this.getMyLabours();
    },
    doOpen(path, data, options) {
      common.osg.open(path, data, options);
    },
    toggleCheck(item) {
      if (this.projectTaskStatus == 2) return;
      this.$set(item, 'isChecked', !item.isChecked);
    },
    submit() {
      let selectedWorkerIds = this.workerAccounts
        .filter(item => item.isChecked)
        .map(item => item._id);
      common.osg.ajax(
        'biz/labour/adjust',
        {
          projectId: this.projectId,
          data: selectedWorkerIds.join()
        },
        res => {
          common.osg.toast('添加成功', 'none');
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000);
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.addWorker {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.addWorker-top {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.worker-list {
  flex: 1;
  background: #fff;
  padding: 0 15px;
  overflow-y: auto;
}

::v-deep .bottom-bar {
  width: 100vw;
  height: 75px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0px 15px 15px;
  justify-content: space-between;
  border-top: 1rpx solid var(--gray-2);
  color: #1989fa;
  font-size: 14px;
  .van-button {
    border-radius: 6px;
  }
}

::v-deep .searchStyle {
  width: 100vw;
  padding: 10px 15px;
  box-sizing: border-box;
  background-color: #fff;
  .uni-easyinput > view {
    border-radius: 8px;
    border: none;
    background-color: var(--gray-2) !important;
  }
}
.worker-actions {
  background-color: #fff;
  margin: 10px 0px;
  padding: 5px 15px;
  position: relative;
  width: 100vw;
  box-sizing: border-box;
  .action-group {
    display: flex;
    justify-content: space-between;
    justify-content: center;
    .action-item {
      // width: 38vw;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      height: 30px;
      // &:first-child::after {
      //   content: '';
      //   position: absolute;
      //   right: 50%;
      //   top: 50%;
      //   transform: translate(-50%, -50%);
      //   height: 40%;
      //   width: 2px;
      //   background-color: var(--gray-1);
      // }
    }
    button {
      all: unset;
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-around;
      position: relative;
      z-index: 10;
    }
  }
}

.worker-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  border: 1px solid #dcdee0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &.checked {
    border-color: #1989fa;
    background-color: #1989fa;
  }
}

.worker-info {
  display: flex;
  align-items: center;
}
</style>
