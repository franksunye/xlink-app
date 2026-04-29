<template>
  <view class="container">
    <!-- Header Background & Content -->
    <view class="header-bg">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- Custom Navbar -->
      <view class="custom-navbar">
        <view class="nav-left">
          <text class="brand-text">修链科技 | 服务商</text>
        </view>
        <view class="nav-right">
          <view class="location-box">
            <uni-icons type="location-filled" size="20" color="#333"></uni-icons>
            <uni-icons type="circle" size="18" color="#333" class="target-icon"></uni-icons>
          </view>
        </view>
      </view>

      <!-- Slogan Area -->
      <view class="slogan-container">
        <view class="slogan-row">
          <text class="slogan-highlight">多</text><text class="slogan-text">商机</text>
          <text class="slogan-spacer"></text>
          <text class="slogan-highlight">快</text><text class="slogan-text">发展</text>
        </view>
        <view class="slogan-row">
          <text class="slogan-highlight">好</text><text class="slogan-text">施工</text>
          <text class="slogan-spacer"></text>
          <text class="slogan-highlight">省</text><text class="slogan-text">成本</text>
        </view>
      </view>
    </view>

    <!-- Main Body Content -->
    <view class="body-content">
      <!-- Notification Bar -->
      <view class="notification-card">
        <view class="notice-left">
          <uni-icons type="sound" size="20" color="#FF8C00"></uni-icons>
          <text class="notice-title">系统升级通知</text>
        </view>
        <view class="notice-right">
          <text class="notice-more">全部</text>
          <uni-icons type="arrowright" size="14" color="#FF8C00"></uni-icons>
        </view>
      </view>

      <!-- Menu Grid -->
      <view class="grid-container">
        <uni-grid :column="3" :show-border="false" :highlight="false" @change="onGridClick">
          <uni-grid-item v-for="(item, index) in menuItems" :index="index" :key="index">
            <view class="grid-item">
              <view class="icon-wrapper">
                <image :src="item.icon" mode="aspectFit" class="grid-image"></image>
              </view>
              <text class="grid-label">{{ item.text }}</text>
            </view>
          </uni-grid-item>
        </uni-grid>
      </view>

      <!-- Guide Banner -->
      <view class="banner-box">
        <view class="banner-content">
          <view class="banner-text">
            <text class="banner-title">服务商指南</text>
            <text class="banner-subtitle">方便服务商了解服务策略</text>
          </view>
          <view class="banner-btn">
            <text>查看</text>
          </view>
        </view>
        <image class="banner-img" src="https://static.vecteezy.com/system/resources/previews/004/636/909/original/construction-worker-holding-blueprint-cartoon-vector.jpg" mode="aspectFit"></image>
      </view>

      <!-- To-Do List Section -->
      <view class="todo-container">
        <view class="todo-header">
          <text class="todo-title">待办任务</text>
          <text class="todo-count">{{ todoList.filter(t => !t.completed).length }} 项待办</text>
        </view>
        
        <view class="todo-input-box">
          <input 
            class="todo-input" 
            v-model="newTodoText" 
            placeholder="添加新任务..." 
            confirm-type="done"
            @confirm="addTodo"
          />
          <view class="add-btn" @click="addTodo">
            <uni-icons type="plus" size="20" color="#fff"></uni-icons>
          </view>
        </view>

        <view class="todo-list">
          <view 
            class="todo-item" 
            v-for="(item, index) in todoList" 
            :key="item.id"
            @click="toggleTodo(index)"
          >
            <view class="todo-check">
              <uni-icons v-if="item.completed" type="checkbox-filled" size="22" color="#4cd964"></uni-icons>
              <uni-icons v-else type="circle" size="22" color="#ccc"></uni-icons>
            </view>
            <text class="todo-text" :class="{ 'todo-completed': item.completed }">{{ item.text }}</text>
            <view class="todo-delete" @click.stop="removeTodo(index)">
              <uni-icons type="trash" size="18" color="#999"></uni-icons>
            </view>
          </view>
          
          <view v-if="todoList.length === 0" class="todo-empty">
            <text>暂无待办任务</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Bottom Tab Bar (Custom) -->
    <view class="custom-tabbar">
      <view class="tab-item active">
        <uni-icons type="home-filled" size="24" color="#007AFF"></uni-icons>
        <text class="tab-text active-text">首页</text>
      </view>
      <view class="tab-item">
        <uni-icons type="list" size="24" color="#999"></uni-icons>
        <text class="tab-text">工单</text>
      </view>
      <view class="tab-item">
        <uni-icons type="person" size="24" color="#999"></uni-icons>
        <text class="tab-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20,
      menuItems: [
        { text: '云订货', icon: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png' }, // Cart
        { text: '云店铺', icon: 'https://cdn-icons-png.flaticon.com/512/869/869636.png' }, // Shop
        { text: '云施工', icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png' }, // Roller
        { text: '云用工', icon: 'https://cdn-icons-png.flaticon.com/512/1995/1995449.png' }, // Worker
        { text: '云客服', icon: 'https://cdn-icons-png.flaticon.com/512/4233/4233830.png' }, // Headset
        { text: '成长通', icon: 'https://cdn-icons-png.flaticon.com/512/6573/6573752.png' }, // Medal
        { text: '老板通', icon: 'https://cdn-icons-png.flaticon.com/512/456/456212.png' }, // Person tie
        { text: '学习通', icon: 'https://cdn-icons-png.flaticon.com/512/2997/2997322.png' }, // Graduation
        { text: '业主通', icon: 'https://cdn-icons-png.flaticon.com/512/838/838417.png' }  // Person
      ],
      todoList: [
        { id: 1, text: '联系供应商询价', completed: false },
        { id: 2, text: '核对上月账单', completed: true }
      ],
      newTodoText: ''
    };
  },
  onLoad() {
    this.initStatusBar();
  },
  methods: {
    initStatusBar() {
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight || 20;
    },
    onGridClick(e) {
      const index = e.detail.index;
      uni.showToast({
        title: '点击了: ' + this.menuItems[index].text,
        icon: 'none'
      });
    },
    addTodo() {
      if (!this.newTodoText.trim()) return;
      this.todoList.unshift({
        id: Date.now(),
        text: this.newTodoText,
        completed: false
      });
      this.newTodoText = '';
    },
    toggleTodo(index) {
      this.todoList[index].completed = !this.todoList[index].completed;
    },
    removeTodo(index) {
      this.todoList.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* Header */
.header-bg {
  background-color: #0084ff; /* Main Blue */
  width: 100%;
  padding-bottom: 60px; /* Space for overlap */
  position: relative;
}

.custom-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  height: 44px; /* Standard nav height */
}

.brand-text {
  color: #fff;
  font-size: 16px;
  opacity: 0.9;
}

.nav-right {
  .location-box {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 4px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.slogan-container {
  padding: 20px 0 30px;
  text-align: center;
  
  .slogan-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .slogan-highlight {
    font-size: 24px;
    font-weight: bold;
    color: #ffd700; /* Gold/Yellow */
    margin-right: 4px;
    font-style: italic;
  }

  .slogan-text {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    font-style: italic;
  }
  
  .slogan-spacer {
    width: 20px;
  }
}

/* Body */
.body-content {
  flex: 1;
  margin-top: -50px; /* Overlap effect */
  padding: 0 15px 80px; /* Bottom padding for tabbar */
  position: relative;
  z-index: 10;
}

/* Notification */
.notification-card {
  background-color: #fff;
  border-radius: 12px 12px 0 0; /* Top rounded only like in image maybe? or full rounded */
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);

  .notice-left {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .notice-title {
      font-size: 14px;
      color: #ff6600;
      font-weight: 500;
    }
  }
  
  .notice-right {
    display: flex;
    align-items: center;
    gap: 2px;
    
    .notice-more {
      font-size: 12px;
      color: #999;
    }
  }
}

/* Grid */
.grid-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 15px 0;
  margin-bottom: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90px;
  
  .icon-wrapper {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    /* Circular bg for icons if needed
    background: #f0f8ff;
    border-radius: 50%;
    */
  }
  
  .grid-image {
    width: 100%;
    height: 100%;
  }
  
  .grid-label {
    font-size: 13px;
    color: #333;
  }
}

/* Banner */
.banner-box {
  background: linear-gradient(90deg, #0055aa 0%, #0088ff 100%); /* Deep Blue Gradient */
  border-radius: 12px;
  height: 100px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0,85,170,0.3);

  .banner-content {
    z-index: 2;
    flex: 1;
  }
  
  .banner-title {
    font-size: 18px;
    font-weight: bold;
    display: block;
    margin-bottom: 4px;
  }
  
  .banner-subtitle {
    font-size: 12px;
    opacity: 0.8;
    display: block;
    margin-bottom: 10px;
  }
  
  .banner-btn {
    background-color: #ffd700;
    color: #333;
    font-size: 12px;
    padding: 4px 16px;
    border-radius: 20px;
    display: inline-block;
    font-weight: bold;
  }
  
  .banner-img {
    position: absolute;
    right: 10px;
    bottom: 0;
    width: 80px;
    height: 90px;
    z-index: 1;
  }
}

/* To-Do List */
.todo-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-top: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);

  .todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .todo-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    
    .todo-count {
      font-size: 12px;
      color: #999;
    }
  }

  .todo-input-box {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    
    .todo-input {
      flex: 1;
      height: 36px;
      background-color: #f5f7fa;
      border-radius: 18px;
      padding: 0 15px;
      font-size: 14px;
    }
    
    .add-btn {
      width: 36px;
      height: 36px;
      background-color: #007AFF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .todo-list {
    .todo-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .todo-check {
        margin-right: 10px;
        display: flex;
        align-items: center;
      }
      
      .todo-text {
        flex: 1;
        font-size: 14px;
        color: #333;
        
        &.todo-completed {
          color: #bbb;
          text-decoration: line-through;
        }
      }
      
      .todo-delete {
        padding: 4px;
      }
    }
    
    .todo-empty {
      text-align: center;
      padding: 20px 0;
      color: #999;
      font-size: 13px;
    }
  }
}

/* Tab Bar */
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 100;
  
  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .tab-text {
      font-size: 10px;
      margin-top: 4px;
      color: #999;
      
      &.active-text {
        color: #007AFF;
      }
    }
  }
}
</style>
