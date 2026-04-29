<template>
  <view class="ai-follow-up-page c-h-100vh c-flex c-flex-col">
    <!-- Main Content Area -->
    <scroll-view scroll-y class="c-flex-1" style="height: 0">
      <view class="content-container">
        <!-- User Info Header -->
        <view class="c-flex c-items-center c-justify-between c-m-b-30">
          <view class="c-flex c-items-center">
            <van-image
              round
              width="40px"
              height="40px"
              :src="userInfo.avatar || 'https://pub.fsgo365.cn/avatar.png'"
              class="c-m-r-10"
            />
            <view>
              <view class="c-font-16 c-bold c-color-333">
                {{ userInfo.nickname || userInfo.name || "暂无姓名" }}
                <text class="c-font-12 c-color-999 c-font-normal c-m-l-5">{{
                  currentRole.name || "暂无角色"
                }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Welcome Message -->
        <view class="c-m-b-30">
          <view class="c-font-30 c-bold c-color-333 c-m-b-10">{{
            greeting
          }}</view>
          <view class="c-font-14 c-color-666">
            截至 {{ currentTimeStr }}，有以下重要信息汇报
          </view>
        </view>

        <!-- Assistant Info -->
        <view class="c-flex c-items-center c-m-b-20">
          <van-image
            round
            width="24px"
            height="24px"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            class="c-m-r-10"
          />
          <text class="c-font-14 c-color-666">待办助理</text>
        </view>

        <!-- Todo Header -->
        <view class="c-font-16 c-color-333 c-bold c-m-b-20">
          {{ todoList.length }}个待办 建议优先处理
        </view>

        <!-- Todo List Container (Light Theme) -->
        <view class="todo-card-container">
          <block v-for="(item, index) in todoList" :key="index">
            <view
              class="todo-item"
              :class="{ 'c-m-b-30': index !== todoList.length - 1 }"
            >
              <view class="c-flex c-items-start">
                <!-- Interactive Checkbox -->
                <van-checkbox
                  :value="item.checked"
                  @change="onCheckboxChange($event, index)"
                  shape="square"
                  checked-color="#FF6900"
                  icon-size="20px"
                  class="c-m-r-15 c-m-t-2"
                />

                <view class="c-flex-1" @click="toggleCheck(index)">
                  <view
                    class="c-font-16 c-color-333 c-m-b-10"
                    style="line-height: 1.4"
                  >
                    {{ item.text }}
                  </view>
                  <view
                    class="c-font-12"
                    :class="item.isUrgent ? 'c-color-orange' : 'c-color-999'"
                  >
                    截止时间：{{ item.deadline }}
                  </view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      greeting: "",
      currentTimeStr: "",
      userInfo: {},
      currentRole: {},
      todoList: [
        {
          text: "生成一条2023年2026年1月14日的代办任务",
          deadline: "今天 12:00",
          isUrgent: false,
          checked: false,
        },
        {
          text: "测试",
          deadline: "昨天 18:00",
          isUrgent: true,
          checked: false,
        },
        {
          text: "及时创建客户张三的其围裙",
          deadline: "明天 18:00",
          isUrgent: false,
          checked: false,
        },
      ],
    };
  },
  onLoad() {
    this.updateTimeAndGreeting();
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      try {
        const user = uni.getStorageSync("user");
        if (user) {
          this.userInfo = user;
        }
        const role = uni.getStorageSync("currentRole");
        if (role) {
          this.currentRole = role;
        }
      } catch (e) {
        console.error("Failed to get user info from storage", e);
      }
      var def = "";
      var abc = "";
    },
    updateTimeAndGreeting() {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();

      // Update Time String (HH:mm)
      const pad = (n) => (n < 10 ? "0" + n : n);
      this.currentTimeStr = `${pad(hour)}:${pad(minutes)}`;

      // Update Greeting
      if (hour < 5) {
        this.greeting = "夜深了";
      } else if (hour < 9) {
        this.greeting = "早上好";
      } else if (hour < 12) {
        this.greeting = "上午好";
      } else if (hour < 14) {
        this.greeting = "中午好";
      } else if (hour < 18) {
        this.greeting = "下午好";
      } else {
        this.greeting = "晚上好";
      }
    },
    onCheckboxChange(e, index) {
      this.todoList[index].checked = e.detail;
    },
    toggleCheck(index) {
      this.todoList[index].checked = !this.todoList[index].checked;
    },
  },
};
</script>

<style lang="scss" scoped>
.ai-follow-up-page {
  // Linear Gradient Background for AI feel
  background: linear-gradient(180deg, #e6f0ff 0%, #f5f7fa 100%);
  min-height: 100vh;
}

.content-container {
  padding: 30rpx;
}

.c-color-333 {
  color: #333333;
}

.c-color-666 {
  color: #666666;
}

.c-color-999 {
  color: #999999;
}

.c-color-orange {
  color: #ff6900; // Warning color
}

.todo-card-container {
  background-color: #ffffff; // White Card background
  border-radius: 20px;
  padding: 40rpx 30rpx;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05); // More pronounced shadow
}

.c-font-30 {
  font-size: 30px;
}

.c-m-t-2 {
  margin-top: 4rpx;
}
</style>
