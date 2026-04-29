<template>
  <view class="uni-common-mt">
    <mp-form :inline="false">
      <mp-cells>
        <mp-cell title="模拟移动定时间隔时间(毫秒)">
          <input type="number" v-model="inter" />
        </mp-cell>
        <mp-cell title="模拟移动步长">
          <input type="number" v-model="distance" />
        </mp-cell>
        <mp-cell title="罗盘精确度">
          <input type="number" v-model="deviation" />
        </mp-cell>
        <mp-cell title="罗盘角度刻度">
          <input type="number" v-model="markDegree" />
        </mp-cell>
        <!-- <mp-cell title="起点(0中央1西北2东北3东南4西南)">
					<input type="number" v-model="startPosition" />
				</mp-cell>
				<mp-cell title="绘图每像素厘米数">
					<input type="number" v-model="cmPerPx" />
				</mp-cell> -->
        <mp-cell title="起点闭环误差间隙(像素),小于等于0为禁用">
          <input type="number" v-model="startPointGap" />
        </mp-cell>
        <mp-cell title="滚轮半径长度(单位：cm)">
          <input type="number" v-model="wheelRadius" />
        </mp-cell>
        <mp-cell title="线长和面积文本字体尺寸">
          <input type="number" v-model="markTxtSize" />
        </mp-cell>
        <mp-cell title="F1快捷键" ext-class="cell-picker">
          <uni-data-picker
            :clear-icon="false"
            class="picker-single"
            placeholder="请选择快捷键"
            popup-title="请选择快捷键"
            :localdata="funcArray"
            v-model="funcF1"
          ></uni-data-picker>
        </mp-cell>
        <mp-cell title="F2快捷键" ext-class="cell-picker">
          <uni-data-picker
            :clear-icon="false"
            class="picker-single"
            placeholder="请选择快捷键"
            popup-title="请选择快捷键"
            :localdata="funcArray"
            v-model="funcF2"
          ></uni-data-picker>
        </mp-cell>
        <mp-cell title="F3快捷键" ext-class="cell-picker">
          <uni-data-picker
            :clear-icon="false"
            class="picker-single"
            placeholder="请选择快捷键"
            popup-title="请选择快捷键"
            :localdata="funcArray"
            v-model="funcF3"
          ></uni-data-picker>
        </mp-cell>
      </mp-cells>
      <view class="buttons">
        <button @tap="doBtn('cancel')">取消</button>
        <button @tap="doBtn('ok')" style="background: #ff6900; color: #fff">确定</button>
        <!-- <button @tap="doBtn('clearCanvas')" style="background: #07c160;color: #fff">清空画布</button> -->
      </view>
    </mp-form>
  </view>
</template>

<script>
export default {
  data() {
    return {
      distance: 2,
      inter: 50,
      deviation: 15,
      markDegree: 45,
      startPosition: 0,
      cmPerPx: 1,
      markTxtSize: 12,
      startPointGap: 10, // 起点闭环误差间隙(像素)，<=0为禁用
      wheelRadius: 15, // 滚轮半径长度（单位：cm）
      funcF1: 'doLockDegree', // f1快捷键
      funcF2: 'turnLeft', // f2快捷键
      funcF3: 'turnRight', // f3快捷键
      funcArray: [
        { text: '开始/暂停', value: 'start' },
        { text: '划图/移动', value: 'huaxian' },
        { text: '跟随模式', value: 'gensui' },
        { text: '锁定角度', value: 'doLockDegree' },
        { text: '手动左转', value: 'turnLeft' },
        { text: '手动右转', value: 'turnRight' },
        { text: '停止手动转向', value: 'turnOff' },
        { text: '直线/弧线', value: 'arc' },
        { text: '加半径', value: 'addRadius' }
      ]
    };
  },
  onReady() {
    if (uni.getStorageSync('distance')) this.distance = uni.getStorageSync('distance');
    if (uni.getStorageSync('inter')) this.inter = uni.getStorageSync('inter');
    if (uni.getStorageSync('deviation')) this.deviation = uni.getStorageSync('deviation');
    if (uni.getStorageSync('markDegree')) this.markDegree = uni.getStorageSync('markDegree');
    // if(uni.getStorageSync('startPosition'))
    // 	this.startPosition = uni.getStorageSync('startPosition');
    // if(uni.getStorageSync('cmPerPx'))
    // 	this.cmPerPx = uni.getStorageSync('cmPerPx');
    if (uni.getStorageSync('markTxtSize')) this.markTxtSize = uni.getStorageSync('markTxtSize');
    if (uni.getStorageSync('startPointGap'))
      this.startPointGap = uni.getStorageSync('startPointGap');
    if (uni.getStorageSync('wheelRadius')) this.wheelRadius = uni.getStorageSync('wheelRadius');
    if (uni.getStorageSync('funcF1')) this.funcF1 = uni.getStorageSync('funcF1');
    if (uni.getStorageSync('funcF2')) this.funcF2 = uni.getStorageSync('funcF2');
    if (uni.getStorageSync('funcF3')) this.funcF3 = uni.getStorageSync('funcF3');
  },
  methods: {
    doBtn(id) {
      if (id == 'ok') {
        if (!this.funcF1 || !this.funcF2 || !this.funcF3) {
          uni.showToast({ title: '快捷键不能为空' });
          return;
        }

        uni.setStorageSync('inter', this.inter);
        uni.setStorageSync('distance', this.distance);
        uni.setStorageSync('deviation', this.deviation);
        uni.setStorageSync('markDegree', this.markDegree);
        // uni.setStorageSync('startPosition', this.startPosition);
        // uni.setStorageSync('cmPerPx', this.cmPerPx);
        uni.setStorageSync('markTxtSize', this.markTxtSize);
        uni.setStorageSync('startPointGap', this.startPointGap);
        uni.setStorageSync('wheelRadius', this.wheelRadius);
        uni.setStorageSync('funcF1', this.funcF1);
        uni.setStorageSync('funcF2', this.funcF2);
        uni.setStorageSync('funcF3', this.funcF3);
        uni.$emit('osg', 'setting');
        uni.navigateBack({
          delta: 1
        });
      } else if (id == 'cancel') {
        uni.navigateBack({
          delta: 1
        });
      } else if (id == 'clearCanvas') {
        uni.$emit('osg', 'clearCanvas');
        uni.navigateBack({
          delta: 1
        });
      }
    }
  }
};
</script>

<style>
.weui-cells {
  margin-top: 0;
}
.weui-cells__group {
  padding-bottom: 200rpx;
}
.weui-label {
  width: auto;
}
.weui-cell__bd input {
  text-align: right;
}
.buttons {
  position: fixed;
  bottom: 0;
  width: 100vw;
  display: flex;
  justify-content: space-evenly;
  padding-bottom: 60rpx;
  padding-top: 30rpx;
  background: #fff;
  z-index: 2;
}
.buttons > button::after {
  border: none;
}
.cell-picker .weui-cell__bd {
  margin-left: 16px;
}
</style>
