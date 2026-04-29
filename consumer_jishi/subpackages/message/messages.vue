<template>
  <view class="chats">
    <view
      class="chat-item"
      v-for="(item, i) in chats"
      :key="i"
      @click="
        open('./message', {
          relationId: item._id,
          sendUserName: item.orgId == '4670873342363649607' ? '平台客服' : item.orgName
        })
      "
    >
      <view class="chat-item-left">
        <!-- :info="item.exts.newCount || ''" -->
        <image
          src="https://pub.fsgo365.cn/kefu.png"
          style="width: 40px; height: 40px; border-radius: 50%"
        ></image>
      </view>
      <view class="chat-item-middle"></view>
      <view class="chat-item-right">
        <view class="chat-item-top">
          <text class="chat-item-name">
            {{ item.orgId == '4670873342363649607' ? '平台客服' : item.orgName }}
          </text>
          <text class="chat-item-sendTime"></text>
        </view>
        <view class="chat-item-content">{{ item.exts.lastMessage || '' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      chats: [],
      newMessageCount: 0, //未读消息数量
      lastMessage: '' //最新一条消息内容
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
  },
  onShow() {
    this.chatRelationList();
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.chatRelationList();
    }, 10000);
  },
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    },
    // 获取会话列表
    chatRelationList() {
      common.osg.ajax(
        'chatMessage/relationList',
        {},
        res => {
          this.chats = res.data;
        },
        {
          noload: true
        }
      );
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
.chats {
  .chat-item {
    width: 100vw;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ebedf0;
    .chat-item-left {
      padding: 3vw;
      display: flex;
      .chat-item-avatar {
        width: 50px;
        height: 50px;
        border-radius: 5px;
      }
    }
    .chat-item-right {
      height: 50px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      overflow: hidden;
      padding: 3vw 3vw 3vw 0;
      border-bottom: 1px solid #ededed;
      .chat-item-top {
        display: flex;
        justify-content: space-between;
        .chat-item-sendTime {
          color: #a1a1a1;
          font-size: 12px;
        }
      }
      .chat-item-content {
        color: #a1a1a1;
        font-size: 14px;
        background-color: #fff;
        border-radius: 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .chat-item-right:last-child {
      border-bottom: none;
    }
  }
  .chat-item.sendByMe {
    flex-direction: row-reverse;
    .chat-item-top {
      flex-direction: row-reverse;
    }
  }
}
</style>
