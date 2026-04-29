<template>
  <view class="chats" @click.capture="track">
    <view
      class="chat-item"
      v-for="(item, i) in chats"
      :key="i"
      @click="open('../message/message', { relationId: item._id, sendUserName: item.orgName })"
      :data-event="{ id: 'sv2yOVwPpv' }"
    >
      <view class="chat-item-left" :data-event="{ id: 'sv2yOVwPpv' }">
        <!-- <image class="chat-item-avatar" src="https://pub.fsgo365.cn/headportrait.png" :data-event="{id:'sv2yOVwPpv'}" /> -->
        <!-- name="service-o" -->
        <van-icon
          name="https://pub.fsgo365.cn/kehu.png"
          size="50px"
          :info="item.exts.newCount || ''"
          style="font-size: 26px; background: #f9f9f9; border-radius: 50%"
          :data-event="{ id: 'sv2yOVwPpv' }"
        />
      </view>
      <view class="chat-item-middle" :data-event="{ id: 'sv2yOVwPpv' }"></view>
      <view class="chat-item-right" :data-event="{ id: 'sv2yOVwPpv' }">
        <view class="chat-item-top" :data-event="{ id: 'sv2yOVwPpv' }">
          <text class="chat-item-name" :data-event="{ id: 'sv2yOVwPpv' }">
            {{ item.sendUserName }}
          </text>
          <text class="chat-item-sendTime" :data-event="{ id: 'sv2yOVwPpv' }"></text>
        </view>
        <view class="chat-item-content" :data-event="{ id: 'sv2yOVwPpv' }">
          {{ item.exts.lastMessage || '' }}
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
    open(url, data) {
      common.osg.open(url, data);
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
