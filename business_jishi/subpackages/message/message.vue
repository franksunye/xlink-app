<template>
  <view class="messages" @click.capture="track">
    <view
      class="chat-item"
      v-for="(item, i) in chats"
      :key="i"
      :class="userId == item.sendUserId ? 'sendByMe' : ''"
      :id="'id' + item._id"
      :style="!show ? 'visibility:hidden' : ''"
    >
      <view class="chat-item-left">
        <image
          v-if="userId == item.sendUserId"
          class="chat-item-avatar"
          width="40px"
          height="40px"
          :src="item.sendUserAvatar || 'https://pub.fsgo365.cn/kefu_b.png'"
        />
        <van-icon
          v-else
          :name="item.sendUserAvatar || '../../static/images/kehu.png'"
          size="40px"
          custom-style="background: #fff; border-radius: 50%;overflow:hidden"
        />
      </view>
      <view class="chat-item-middle"></view>
      <view class="chat-item-right">
        <view class="chat-item-top">
          <text class="chat-item-name c-m-r-20">{{ item.sendUserName }}</text>
          <text class="chat-item-sendTime">{{ item.createTime }}</text>
        </view>
        <view class="chat-item-content">{{ item.message }}</view>
      </view>
    </view>

    <van-search
      :clearable="false"
      :use-action-slot="true"
      :use-left-icon-slot="false"
      class="chat-input c-flex-1"
      :value="message"
      placeholder="请输入"
      custom-class="c-p-10"
      @change="messageInput"
      @onSearch="sendMessage"
    >
      <van-button
        slot="action"
        @click="sendMessage"
        size="small"
        type="primary"
        custom-style="height:34px;border-radius:0 2px 2px 0;"
        :data-event="{ id: '5-MmqsgL_4' }"
      >
        发送
      </van-button>
    </van-search>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      show: true,
      userId: '',
      chats: [],
      relationId: '',
      message: '',
      page: 1,
      rows: 10,
      total: null,
      scrollIntoId: ''
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    uni.setNavigationBarTitle({
      title: decodeURIComponent(params.sendUserName)
    });
    this.relationId = params.relationId;
    this.userId = wx.getStorageSync('user')._id;

    // 每隔10秒查询下对方回复
    this.getMessage();
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.getMessage();
    }, 10000);
  },
  methods: {
    getMessage() {
      common.osg.ajax(
        '/chatMessage/query',
        {
          relationId: this.relationId || '',
          // notFilterBelongTo: '1',
          // notFilterOrgId: '1',
          page: this.page,
          rows: this.rows,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.total = res.total;
          if (res.data.length == 0) {
            this.show = true;
            return;
          }

          let id = '#id' + res.data[this.rows - 11 < 0 ? 0 : this.rows - 11]._id;
          if (this.rows != 10) this.show = false;
          this.chats = res.data.reverse();
          uni.stopPullDownRefresh();
          this.scrollTo(id);
        },
        { noload: true }
      );
    },
    messageInput(e) {
      this.message = e.detail;
    },
    sendMessage() {
      if (!this.message) return;
      common.osg.ajax(
        '/chatMessage/sendMessage',
        { message: this.message, relationId: this.relationId || '' },
        () => {
          this.message = '';
          this.rows = 10;
          this.getMessage();
        },
        { noload: true }
      );
    },
    scrollTo(selector) {
      this.$nextTick(function () {
        setTimeout(() => {
          uni.pageScrollTo({
            selector,
            duration: 0
          });
          this.show = true;
        }, 200); // 要加点延迟, 不然有几率不生效
      });
    },
    onPullDownRefresh() {
      if (this.rows >= this.total) {
        common.osg.toast('没有更多了', 'none');
        uni.stopPullDownRefresh();
        return;
      }
      this.rows += 10;
      this.getMessage();
    },
    onHide() {
      clearInterval(this.timer);
    },
    onUnload() {
      clearInterval(this.timer);
    }
  }
};
</script>

<style scoped lang="scss">
.messages {
  padding-bottom: 80px;
  .chat-item {
    width: 100vw;
    padding: 3vw 2vw;
    box-sizing: border-box;
    display: flex;
    .chat-item-left {
      .chat-item-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .chat-item-middle {
      width: 2vw;
    }
    .chat-item-right {
      max-width: 60vw;
      .chat-item-top {
        display: flex;
        justify-content: space-between;
        color: #a1a1a1;
        font-size: 12px;
      }
      .chat-item-content {
        background-color: #fff;
        margin-top: 1vw;
        padding: 2vw;
        border-radius: 5px;
      }
    }
  }
  .chat-item.sendByMe {
    flex-direction: row-reverse;
    .chat-item-top {
      flex-direction: row-reverse;
    }
  }
  .chat-input {
    width: 100vw;
    position: fixed;
    bottom: 0;
    padding-bottom: 20px;
    background-color: #fff;
  }
}
</style>
<style lang="scss">
.messages {
  .van-cell__left-icon-wrap {
    display: none !important;
  }
  .van-search__action {
    padding-left: 0;
    padding-right: 2px;
    height: 35px;
  }
}
</style>
