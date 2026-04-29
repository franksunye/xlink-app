<template>
  <view
    :class="['backHome', { RightAdsorbAnimation: ballAnimation }]"
    :style="{
      width: '70px',
      height: '70px',
      left: left + 'px',
      top: top + 'px'
    }"
    @touchstart.prevent="touchstart"
    @touchmove.stop.prevent="touchmove"
    @touchend.prevent="touchend"
  >
    <image @click="JumpChatPage" src="https://pub.fsgo365.cn/setUp.png"></image>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
var common = require('../../resources/js/common.js');
//touchstart事件：当手指触摸屏幕时候触发，即使已经有一个手指放在屏幕上也会触发。
// touchmove事件：当手指在屏幕上滑动的时候连续地触发。在这个事件发生期间，调用preventDefault()事件可以阻止滚动。
// touchend事件：当手指从屏幕上离开的时候触发。
// touchcancel事件：当系统停止跟踪触摸的时候触发。关于这个事件的确切出发时间，文档中并没有具体说明，咱们只能去猜测了。

// clientY：触摸目标在视口中的y坐标。
// identifier：标识触摸的唯一ID。
// pageX：触摸目标在页面中的x坐标。
// pageY：触摸目标在页面中的y坐标。
// screenX：触摸目标在屏幕中的x坐标。
// screenY：触摸目标在屏幕中的y坐标。
// target：触目的DOM节点目标。

export default {
  props: ['moveLeft', 'moveTop', 'navBarHeight'],
  data() {
    return {
      clientWidth: '', //当前用户手机的宽度
      clientHeight: '', //当前用户手机的高度
      left: 0, //悬浮球距离页面左边位置
      top: 0, //悬浮球距离页面上边位置
      NavBarHeight: 48, // ios 44 安卓48 顶部导航栏的高度返回页面的那个导航栏
      StatusbarHeight: '', //手机最顶部 显示信号 时间的那个
      SuspendedState: false, // 选中状态
      ballAnimation: false,
      AllowJumping: false, //是否允许跳转
      timeout: null //清空计时器
    };
  },
  computed: {
    ...mapState(['isNavBarInPrevPage'])
  },
  mounted() {
    //第一步获取当前手机屏幕信息
  },
  methods: {
    ...mapMutations(['SetinitialPosition']),
    touchstart(e) {
      //开启动画
      this.ballAnimation = false;
      //开启悬浮球选中状态
      this.SuspendedState = true;
      //记录了触摸点的初始水平位置（clientX）和垂直位置（clientY）
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    },
    UpdateInitialPosition() {
      this.ballAnimation = false;
      const { system } = wx.getSystemInfoSync();
      const { windowWidth, windowHeight, statusBarHeight } = wx.getWindowInfo();
      // //clientWidth 和 clientHeight 在小程序中就是显示界面的宽度和高度。
      this.clientWidth = windowWidth;
      this.clientHeight = windowHeight;
      this.StatusbarHeight = statusBarHeight; //状态栏的高度

      if (system.indexOf('iOS') > -1) {
        this.NavBarHeight = 44;
      }
      if (this.moveLeft == null && this.moveTop == null) {
        this.left = windowWidth - 70; //第一次加载页面没有操作后的 悬浮球的初始位置
        this.top = windowHeight - 70; //第一次加载页面没有操作后的 悬浮球的位置
      }
      //操作悬浮球 记录悬浮球的位置
      if (this.moveLeft !== null && this.moveTop !== null) {
        //如果当前页面有导航栏的情况下 非非 非有 有非 有有
        //没有导航栏页面 跳转到有导航栏的页面
        if (!this.isNavBarInPrevPage && this.navBarHeight) {
          // console.log('没有导航栏页面 跳转到有导航栏的页面');
          this.top = this.moveTop - (this.NavBarHeight + this.StatusbarHeight) - 0;
        } else if (this.isNavBarInPrevPage && !this.navBarHeight) {
          // console.log('导航栏页面 跳转到有导航栏的页面');
          this.top = this.moveTop + (this.NavBarHeight + this.StatusbarHeight) - 0;
        } else if (!this.isNavBarInPrevPage && !this.navBarHeight) {
          // console.log('导航栏页面跳转到没有导航栏的页面');
          this.top = this.moveTop;
        }
        if (this.top + 70 > this.clientHeight) {
          this.top = this.clientHeight - 70;
        }
        if (this.top < 0) {
          this.top = 0;
        }
        this.left = this.moveLeft;
        this.SetinitialPosition({ left: this.left, top: this.top });
      }
    },
    touchmove(e) {
      e.preventDefault();

      const touch = e.touches[0];
      if (
        (this.SuspendedState && Math.abs(touch.clientX - this.startX) > 12) ||
        Math.abs(touch.clientY - this.startY) > 12
      ) {
        this.SuspendedState = false;
      }
      //计算了水平方向上的偏移量，即当前触摸点的水平坐标（touch.clientX）与触摸开始时记录的水平坐标（this.startX）之间的差值
      const offsetX = touch.clientX - this.startX;
      //计算了垂直方向上的偏移量，即当前触摸点的垂直坐标（touch.clientY）与触摸开始时记录的垂直坐标（this.startY）之间的差值。
      const offsetY = touch.clientY - this.startY;
      //将计算得到的偏移量分别存储在当前对象的 moveX 和 moveY 属性中

      //鼠标移动的时候 移动小球的位置
      let ButtonLeft = this.left + offsetX;
      let ButtonTop = this.top + offsetY;
      this.startX = touch.clientX;
      // 更新触摸开始点的水平坐标为当前触摸点的水平坐标
      this.startY = touch.clientY;
      // 更新触摸开始点的垂直坐标为当前触摸点的垂直坐标

      // 防止小球移出左边屏幕
      if (ButtonLeft < 0) {
        ButtonLeft = 0;
      }
      // 防止小球移出上边屏幕
      if (ButtonTop < 0) {
        ButtonTop = 0;
      }
      // 防止小球移出右边屏幕
      if (ButtonLeft + 70 > this.clientWidth) {
        // 假设小球半径为 25，宽度为 70
        ButtonLeft = this.clientWidth - 70;
      }
      // 防止小球移出下边屏幕
      if (ButtonTop + 70 > this.clientHeight) {
        // 假设小球半径为 25，高度为 70
        ButtonTop = this.clientHeight - 70;
      }
      this.top = ButtonTop;
      this.left = ButtonLeft;
    },

    touchend(e) {
      this.ballAnimation = true;
      //手指松开后 有一个动画吸附效果
      if (this.left + 35 <= this.clientWidth / 2 && !this.SuspendedState) {
        console.log('手指松开后靠左边吸附');
        this.left = -35;
      } else if (this.left + 35 > this.clientWidth / 2 && !this.SuspendedState) {
        console.log('手指松开后靠右边吸附');
        this.left = this.clientWidth - 35;
      } else if (this.left + 35 <= this.clientWidth / 2 && this.SuspendedState) {
        console.log('单点后靠左边');
        this.left = 0;
        this.SuspendedState = false;
      } else if (this.left + 35 > this.clientWidth / 2 && this.SuspendedState) {
        console.log('单点后靠右边');
        this.left = this.clientWidth - 70;
        this.SuspendedState = false;
      }
      this.SetinitialPosition({ left: this.left, top: this.top });
    },
    JumpChatPage() {
      if (this.AllowJumping) {
        common.osg.open('../../subpackages/agent/chat');
      }
    }
  },
  watch: {
    left(newValue, oldValue) {
      if (newValue === this.clientWidth - 70 || newValue === 0) {
        this.jumpTimer = setTimeout(() => {
          this.AllowJumping = true;
        }, 400);
      } else {
        if (this.jumpTimer) {
          clearTimeout(this.jumpTimer);
        }
        this.AllowJumping = false;
      }
    }
  }
};
</script>

<style lang="scss">
/* back-home.wxss */
.backHome {
  position: fixed;
  border-radius: 50%;
  z-index: 998;
  image {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
}
.RightAdsorbAnimation {
  transition: all 0.5s ease; /* 所有属性的过渡，持续时间0.5秒，缓动函数为ease-in-out */
}
</style>
