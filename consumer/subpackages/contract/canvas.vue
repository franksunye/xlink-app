<template>
  <view>
    <view class="canvasModuleData">
      <view class="canvas_btnBox">
        <view class="canvas_btn1" @tap="clearClick">
          <text style="transform: rotate(90deg); white-space: nowrap; display: inline-block">
            重签
          </text>
        </view>
        <view class="canvas_btn2" @tap="overSign">
          <text style="transform: rotate(90deg); white-space: nowrap; display: inline-block">
            完成签名
          </text>
        </view>
      </view>
      <view class="CanvasBox" style="width: calc(100vw - 140px)">
        <canvas
          style="z-index: 2; height: 100%; width: 100%"
          canvas-id="firstCanvas"
          @touchmove="move"
          @touchstart="start($event)"
          @touchend="end"
          @touchcancel="cancel"
          disable-scroll="true"
          @error="error"
        ></canvas>

        <view class="Landscape" v-if="!canvas.isEnd">
          <view>请</view>
          <view class="line"></view>
          <view>签</view>
          <view class="line"></view>
          <view>字</view>
        </view>
      </view>
      <view class="textReminder">
        <view class="">
          <text style="transform: rotate(90deg); white-space: nowrap; display: inline-block">
            您的签名将由系统生成在申请文书中，视同对申请文书的电子签名。
          </text>
        </view>
        <view class="">
          <text
            style="
              transform: rotate(90deg);
              color: yellow;
              white-space: nowrap;
              display: inline-block;
            "
          >
            请在线进行手写签名（请逆时针旋转手机至横屏签名）
          </text>
        </view>
      </view>
    </view>
    <!-- <van-overlay :z-index="19999" :show="canvas.showCanvasLoading">
      <view>
        <van-loading vertical size="32px" class="c-loading">处理中...</van-loading>
      </view>
    </van-overlay> -->
  </view>
</template>

<script>
var common = require('../../common/common.js');
// canvas 相关变量
var content = null;
var touchs = [];
var canvasw = 0;
var canvash = 0;
var _that;

export default {
  data() {
    return {
      _id: null, //其他页面传递过来的表单ID 用来生成PDF
      canvas: {
        isEnd: false, // 是否签名
        acceptanceId: '', //签订的PDF 签字ID
        showCanvasLoading: false
      }
    };
  },
  onHide() {
    //清空画布
    this.clearClick();
  },
  onLoad(e) {
    //传给后端的表单ID 用来生产PDF
    console.log(e);
    this._id = e._id;
    // 画布相关代码
    _that = this;
    let dev = uni.getSystemInfoSync();
    console.log('获取横屏的宽高 设置画布的大小', dev); // 获取横屏的宽高 设置画布的大小 // screenWidth windowHeight
    canvasw = dev.screenWidth - 20;
    canvash = dev.screenHeight - 70;
    content = wx.createCanvasContext('firstCanvas');
    content.setStrokeStyle('#000');
    content.setLineWidth(5); //设置线两端端点样式更加圆润
    content.setLineCap('round'); //设置两条线连接处更加圆润
    content.setLineJoin('round');
    content.setFillStyle('white'); //填充白色
    content.fillRect(0, 0, canvasw, canvash); //画出矩形白色背景
    content.restore();
    content.save();
    setTimeout(() => {
      this.clearClick();
    }, 100);
  },
  methods: {
    // 画布的触摸移动开始手势响应
    start(event) {
      // console.log("触摸开始" + event.changedTouches[0].x)
      // console.log("触摸开始" + event.changedTouches[0].y)
      //获取触摸开始的 x,y
      // 设置为已经签名
      this.canvas.isEnd = true;
      let point = {
        x: event.changedTouches[0].x,
        y: event.changedTouches[0].y
      }; // console.log(point)
      touchs.push(point);
    }, // 画布的触摸移动手势响应

    move(e) {
      let point = {
        x: e.touches[0].x,
        y: e.touches[0].y
      }; // console.log(point)
      touchs.push(point);
      if (touchs.length >= 2) {
        this.draw(touchs);
      }
    },
    // 画布的触摸移动结束手势响应
    end(e) {
      // console.log("触摸结束" + e)

      // 清空轨迹数组
      for (let i = 0; i < touchs.length; i++) {
        touchs.pop();
      }
    }, // 画布的触摸取消响应
    cancel(e) {
      console.log('触摸取消' + e);
    },
    error(e) {
      console.log('画布触摸错误' + e);
    },
    //绘制
    draw(touchs) {
      // console.log(touchs[0], touchs[1])
      let point1 = touchs[0];
      let point2 = touchs[1];
      touchs.shift();
      content.moveTo(point1.x, point1.y);
      content.lineTo(point2.x, point2.y);
      content.stroke();
      content.draw(true);
    },
    //清除操作
    clearClick() {
      // 设置为未签名
      this.canvas.isEnd = false; //清除画布
      content.clearRect(0, 0, canvasw, canvash);
      content.draw(true);
    },
    overSign() {
      if (this.canvas.isEnd) {
        this.canvas.showCanvasLoading = true;
        content.draw(
          true,
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'firstCanvas',
              fileType: 'png',
              success: res => {
                //打印图片路径
                let url = res.tempFilePath;
                console.log('完成签名:', url); // 可以再次进行直接保存图片到本地，这个保存就不写了可参考之前的canvas图片保存到本地 // 一般签名都是要返回前一页进行提交，所以在此将图片写到微信内部文件（不会出现在手机相册中）返回上一页获取，在上一页提交后在将图片删除

                // wx.previewImage({
                //   urls: [url] // 传入需要预览的图片的路径
                // });
                common.osg.ajax(
                  'back/super/file/upToken.do',
                  {
                    fileName: url
                  },
                  data => {
                    wx.uploadFile({
                      url: 'https://up-z1.qiniup.com',
                      filePath: url,
                      name: 'file',
                      formData: data,
                      success(res) {
                        if (res.statusCode === 200) {
                          // 文件上传成功
                          const data = JSON.parse(res.data);
                          console.log('上传成功，返回的数据为：', data);
                          let imgURL =
                            'https://pub.fsgo365.cn/' + data.key + '?imageMogr2/rotate/-90';
                          // 在这里做上传成功后的操作，如显示上传成功信息、更新页面等
                          _that.generateAcceptanceReportPDF(_that._id, imgURL);
                        } else {
                          _that.canvas.showCanvasLoading = false;
                          // 文件上传失败
                          console.error('上传失败，请检查网络或服务器配置');
                          // 在这里处理上传失败的情况，可以给出提示信息或重试等
                        }
                      },
                      fail(error) {
                        console.log(error);
                        _that.canvas.showCanvasLoading = false;
                        common.osg.toast('上传失败', 'error');
                      }
                    });
                  },
                  {
                    noload: true
                  }
                );
              },
              fail(error) {
                console.log('失败了', error);
                _that.canvas.showCanvasLoading = false;
              }
            });
          }, 100)
        );
      } else {
        uni.showToast({
          title: '请先完成签名',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      }
    },
    //上传图片
    generateAcceptanceReportPDF(acceptanceId, signImageUrl) {
      console.log(acceptanceId, signImageUrl);
      common.osg.ajax(
        '/basic/acceptance/generateAcceptanceReportPDF',
        { signImageUrl, acceptanceId },
        data => {
          this.canvas.showCanvasLoading = false;
          if (data.success) {
            //清空画布
            this.clearClick();
            //返回上个页面 显示一个操作成功的弹窗
            uni.$emit('showToast', true);
            //返回上一页面
            wx.navigateBack({ delta: 1 });
          }
        },
        {
          noload: true
        }
      );
    }
    // 到此结束 canvas 签字相关的函数方法变量
  }
};
</script>

<style lang="scss" scoped>
// 客户签字相关模块样式
.canvasModuleData {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: #808080;
  // 设置按钮盒子和文本提醒的固定宽度
  .canvas_btnBox {
    width: 70px; // 设置固定宽度
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  .textReminder {
    width: 70px; // 设置固定宽度
    height: 100%;
    display: flex;
    view {
      width: 50%;
      height: 100%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      //   transform: rotate(90deg);
    }
  }

  .firstCanvas,
  .CanvasBox {
    // 画布应填充剩余宽度
    flex-grow: 1; // 允许画布增长，填充剩余空间
    height: 90%;
    background-color: #efefef;
  }

  .canvas_btnBox view {
    // 这两个容器内部内容的统一样式
    width: 70%; // 完全占据容器的宽度
    height: 15%; // 按钮盒子中每个按钮的高度
    display: flex;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color: #fff;
  }

  .canvas_btn1 {
    background-color: var(--button-plain-background-color, #f09e38);
  }

  .canvas_btn2 {
    background-color: var(--button-info-background-color, #ad2e33);
  }

  .Landscape {
    font-size: 260rpx;
    font-weight: 500;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%) rotate(90deg);
    transform: translate(-50%, -50%) rotate(90deg);
    display: flex;
    color: #fff;
    width: 100vh;
    justify-content: space-evenly;

    .line {
      width: 1px;
      background-color: #ccc;
    }
  }
}
// 签字加载提示 状态 旋转90度
.c-loading {
  transform: rotate(90deg);
}
</style>
