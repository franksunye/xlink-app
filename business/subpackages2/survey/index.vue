<template>
  <view>
    <scroll-view
      @click="doBtn('toolHide')"
      @scroll="doScroll"
      :scroll-top="canTop * -1 + 'px'"
      :scroll-left="canLeft * -1 + 'px'"
      scroll-x="true"
      scroll-y="true"
      class="container"
      :style="{ width: '100vw', height: '100vh' }"
    >
      <canvas
        canvas-id="myCanvas"
        id="myCanvas"
        :style="{
          width: canWidth + 'px',
          height: canHeight + 'px',
          display: canShow ? '' : 'none'
        }"
      ></canvas>
    </scroll-view>
    <canvas
      canvas-id="canDummy"
      id="myCanvas"
      :style="{
        width: canDummyWidth + 'px',
        height: canDummyHeight + 'px',
        display: canDummyShow ? '' : 'none'
      }"
    ></canvas>
    <view
      id="meImage"
      :style="{
        left: meLeft + 'px',
        top: meTop + 'px',
        display: meDisp,
        'z-index': turnShow ? 5001 : 1
      }"
    >
      <image
        mode="aspectFit"
        src="https://pub.fsgo365.cn/me.png"
        :style="{
          width: '40rpx',
          height: '40rpx',
          transform: 'rotate(' + rotateMe + 'deg);',
          'border-radius': '50%'
        }"
      ></image>
      <text>{{ currentDistance }}cm</text>
    </view>
    <view @tap="doBtn('turn')" style="position: fixed; top: 20rpx; right: 20rpx; text-align: right">
      <image
        class="m-compassbg"
        src="https://pub.fsgo365.cn/compass.png"
        :style="'transform:rotate(' + rotate + 'deg);'"
      ></image>
    </view>
    <image
      v-if="overviewShow"
      @tap="doBtn('overview')"
      mode="aspectFit"
      id="fullImage"
      :src="canvasImage"
    ></image>
    <view class="sidebar" v-if="sidebarShow">
      <image @tap="doBtn('overviewShow')" class="toolImage" src="/static/preview.png" />
      <view class="toolDivider"></view>
      <image
        v-for="item in toolsFlag"
        :key="item.id"
        @tap="doBtn('tf_' + item.id)"
        class="toolImage"
        :src="item.toolIcon"
      />
      <text @tap="doBtn('note')" class="toolImage toolText">文字</text>
      <view class="toolDivider"></view>
      <text @tap="doBtn('goShow')" class="toolImage toolText">移动</text>
    </view>
    <view class="toolsBottom">
      <!-- 直线/弧线 -->
      <view>
        <image
          v-if="drawingArc"
          @tap="doBtn('arc')"
          class="toolImage"
          src="/static/curve_white.png"
          style="background: #106cff"
        />
        <image
          v-else
          @tap="doBtn('arc')"
          class="toolImage"
          src="/static/straight_line_white.png"
          style="background: #106cff"
        />
      </view>
      <!-- 结构类型 -->
      <view>
        <view class="toolsLine" v-if="toolsLineShow">
          <block v-for="item in toolsLine" v-bind:key="item.id">
            <image
              @tap="doBtn('tl_' + item.id)"
              :class="item.class ? 'toolImage toolBtnActive' : 'toolImage'"
              :src="item.class ? item.iconWhite : item.icon"
              :style="item.icon.indexOf('parapet') != -1 ? 'padding:5px 4px 4px 8px' : ''"
            />
          </block>
        </view>
        <image
          @tap="doBtn('toolsLineShow')"
          class="toolImage"
          src="/static/wall_white.png"
          style="background: #106cff; padding: 5px 7px"
        />
      </view>
      <!-- 开始/暂停 -->
      <view>
        <image
          v-if="pause"
          @tap="doBtn('start')"
          class="toolImage"
          src="/static/play_white.png"
          style="width: 140rpx; height: 140rpx; padding: 10px 6px 10px 14px; background: #106cff"
        />
        <image
          v-else
          @tap="doBtn('start')"
          class="toolImage"
          src="/static/pause_white.png"
          style="width: 140rpx; height: 140rpx; background: #106cff"
        />
      </view>
      <!-- 设置 -->
      <view>
        <view class="more" v-if="moreShow">
          <text @tap="doBtn('clearCanvas')" class="toolImage toolText">清空</text>
          <text @tap="doBtn('dostat')" class="toolImage toolText">统计</text>
          <text @tap="doBtn('save')" class="toolImage toolText">保存</text>
          <text
            @tap="doBtn('initBlue')"
            class="toolImage toolText"
            :class="blueIndex >= 0 ? 'toolBtnActive' : ''"
          >
            蓝牙
          </text>
          <image @tap="doBtn('setting')" class="toolImage" src="https://pub.fsgo365.cn/setUp.png" />
        </view>
        <image
          @tap="doBtn('moreShow')"
          class="toolImage"
          src="/static/more_white.png"
          style="background: #106cff; padding: 0"
        />
      </view>
      <!-- 调试 -->
      <view>
        <view class="debug" v-if="debugShow">
          <text
            @tap="doBtn('golog')"
            class="toolImage toolText"
            :class="showLog ? 'toolBtnActive' : ''"
          >
            日志
          </text>
          <text @tap="doBtn('gensui')" class="toolImage toolText toolBtnActive">
            {{ gensui ? '跟随' : '固定' }}
          </text>
          <text @tap="doBtn('curPosition')" class="toolImage toolText">当前</text>
          <text @tap="doBtn('huaxian')" class="toolImage toolText toolBtnActive">
            {{ drawing ? '画图' : '移动' }}
          </text>
          <text @tap="doBtn('addRadius')" class="toolImage toolText">半径</text>
          <text
            @tap="doBtn('doLockDegree')"
            class="toolImage toolText"
            :class="lockDegree != -1 ? 'toolBtnActive' : ''"
          >
            锁角
          </text>
          <text
            @tap="doBtn('dummy')"
            class="toolImage toolText"
            :class="dummyEnable ? 'toolBtnActive' : ''"
          >
            模拟
          </text>
        </view>
        <image
          @tap="doBtn('debugShow')"
          class="toolImage"
          src="/static/debug_white.png"
          style="background: #106cff; padding: 10px"
        />
      </view>
    </view>
    <mp-half-screen-dialog @close="doBtn('golog')" :show="showLog" title="日志">
      <view slot="desc">
        <view v-for="d in bdata" v-bind:key="d.id" style="height: 100; overflow-y: auto">
          {{ d.id }} -> {{ d.v }}
        </view>
      </view>
    </mp-half-screen-dialog>
    <mp-half-screen-dialog
      @close="doBtn('popupStatisticClose')"
      :show="statisticShow"
      title="统计数据"
      extClass="mp-half-screen-dialog-statistic"
    >
      <view slot="desc">
        <textarea
          :value="statisticTxt"
          :disabled="true"
          :maxlength="-1"
          style="width: 100%; height: 400px"
        ></textarea>
      </view>
    </mp-half-screen-dialog>
    <mp-half-screen-dialog
      @buttontap="noteConfirm"
      @close="doBtn('popupNoteClose')"
      :show="noteShow"
      title="添加文字标注"
      :buttons="[
        {
          type: 'default',
          className: 'dialogCancel',
          text: '取消',
          value: 0
        },
        {
          type: 'primary',
          className: 'dialogConfirm',
          text: '确认',
          value: 1
        }
      ]"
    >
      <view slot="desc">
        <mp-cells>
          <mp-cell title="标准内容：">
            <input class="uni-input" type="text" v-model="noteContent" placeholder="请输入" />
          </mp-cell>
        </mp-cells>
      </view>
    </mp-half-screen-dialog>
    <mp-half-screen-dialog
      @buttontap="fanConfirm"
      @close="doBtn('fanShow')"
      :show="fanShow"
      title="指定上/下翻距离"
      subTitle="请选择需要上/下翻的距离（单位厘米）。"
      :buttons="[
        {
          type: 'default',
          className: 'dialogCancel',
          text: '取消',
          value: 0
        },
        {
          type: 'primary',
          className: 'dialogConfirm',
          text: '确定',
          value: 1
        }
      ]"
    >
      <view slot="desc">
        <uni-number-box
          :min="0"
          :max="9999"
          :value="curFanVal"
          class="uni-number-box"
          @change="fanChange"
        />
      </view>
    </mp-half-screen-dialog>
    <mp-half-screen-dialog
      @buttontap="goConfirm"
      @close="doBtn('goShow')"
      :show="goShow"
      title="手动移动指定距离"
      subTitle="请选择需要移动的距离（单位厘米）。"
      :buttons="[
        {
          type: 'default',
          className: 'dialogCancel',
          text: '取消',
          value: 0
        },
        {
          type: 'primary',
          className: 'dialogConfirm',
          text: '移动',
          value: 1
        }
      ]"
    >
      <view slot="desc">
        <uni-number-box :min="1" :max="9999" :value="1" class="uni-number-box" @change="goChange" />
      </view>
    </mp-half-screen-dialog>
    <mp-half-screen-dialog
      @buttontap="turnConfirm"
      @close="doBtn('turn')"
      :show="turnShow"
      maskClosable
      title="模拟手机转向"
      subTitle="点击左或右将锁定方向，手机转向失效。"
      :desc="'当前方向：' + area + ' ' + detailArea + '°'"
      extClass="mp-half-screen-dialog-turn"
      :buttons="[
        {
          type: 'primary',
          className: 'dialogConfirm',
          text: '左',
          value: 'turnLeft'
        },
        {
          type: 'primary',
          className: 'dialogConfirm',
          text: '取消',
          value: 'turnOff'
        },
        {
          type: 'primary',
          className: 'dialogConfirm',
          text: '右',
          value: 'turnRight'
        }
      ]"
    ></mp-half-screen-dialog>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showLog: false, // 日志区域显示状态
      noteContent: '', // 自定义标注内容
      canvasImage: null, // 全局预览图片对象
      rotate: 0,
      rotateMe: 0,
      goDistance: 1, // 手动前进距离
      area: '东偏北',
      detailArea: 90,
      defaultLineWidth: 2, // 默认划线粗细
      defaultLineColor: '#808080', // 默认划线颜色
      iconPaishuikou: null, // 排水口图标
      iconChuqikou: null, // 出气口图标
      canBorderSize: 6, // 画布边框尺寸
      canSize: 2500, // 画布尺寸px, 测试：700
      canWidth: 0, // 画布宽度
      canHeight: 0, // 画布高度
      canShow: true, // 画布是否显示
      canLeft: 0, // 画布left（scroll向右滚动）
      canTop: 0, // 画布top（scroll向下滚动）
      canScale: 1, // 画布缩放比例
      meLeft: -100, // 我当前位置图标left
      meTop: -100, // 我当前位置图标top
      meDisp: 'visible', // 我当前位置display样式
      ctx: null, // 画布上下文Context
      ctxDummy: null, // 临时画布上下文Context
      canDummyWidth: 0,
      canDummyHeight: 0,
      canDummyShow: false,
      currentDistance: 0, // 当前移动距离，用于“我”右侧显示
      x: 0, // 当前位置点x坐标px
      y: 0, // 当前位置点y坐标px
      maxX: 0, // 最大x坐标
      minX: 0, // 最小x坐标
      maxY: 0, // 最大y坐标
      minY: 0, // 最小y坐标
      distance: 0, // 当前累积距离
      lastDistance: 0, // 上次累积距离
      degree: 0.0, // 0度：正北，90度：正东，180度：正南，270度：正西
      lastDegree: -1, // 缓存上次角度数据
      lockDegree: -1, // 锁定的当前角度，-1为取消锁定角度
      lockDegreeLastTime: 0, // 锁定角度按钮上次点击时间，2秒内双连击取消角度锁定
      windowWidth: 0, // 手机屏幕宽度px
      windowHeight: 0, // 手机屏幕高度px
      pixelRatio: 0, // 手机屏幕像素比
      gensui: true, // 是否跟随
      drawing: true, // 是否划线
      scrollTopOld: 0, // 滚动顶部位置缓存
      scrollLeftOld: 0, // 滚动左侧位置缓存
      inter1: null, // 模拟距离刷新Interval
      dummyDistanceStep: 2, // 模拟位置移动步长像素值
      dummyEnable: false, // 是否启用模拟
      pause: true, // 是否暂停模拟
      deviation: 15, // 罗盘精确度
      markDegree: 45, // 罗盘角度刻度
      statLast: null, // 统计用上一数据，degree:罗盘角度,distance:累计距离,x,y,toolsLine[id,name,x,y,ex,ey,dis],toolsLineCur{id:{id,name,x,y,ex,ey,dis}},toolsFlag[id,name,x,y]
      stat: [], // 除statLast字段外，增加结束节点的edistance;ex;ey;dis距离
      statHis: [], // 图形统计数组
      statisticData: {}, // 统计信息数据
      statisticTxt: '', // 统计信息文本
      statToolsFlag: [], // 标记类工具明细列表[id,name,x,y]
      startPosition: 0, // 设置项，起点位置：0中央1西北2东北3东南4西南
      cmPerPx: 1, // 设置项，绘图每像素厘米数
      startPointX: 0, // 起点x坐标
      startPointY: 0, // 起点y坐标
      startPointGap: 10, // 起点闭环误差间隙(像素)
      turnHand: false, // 是否手动转动方向
      drawClosed: false, // 是否划线闭环结束
      wheelRadius: 15, // 滚轮半径长度（单位：cm）
      toolsLineActiveClass: 'act', // 划线类工具激活样式名称
      toolsFlag: [
        {
          // 标记类工具
          id: 'iconChushui',
          name: '排水口',
          width: 28,
          height: 28,
          icon: 'https://pub.fsgo365.cn/paishuikou.png',
          toolIcon: 'https://pub.fsgo365.cn/survey_outfall.png'
        },
        {
          id: 'iconTongqi',
          name: '出气口',
          width: 28,
          height: 28,
          icon: 'https://pub.fsgo365.cn/chuqikou.png',
          toolIcon: 'https://pub.fsgo365.cn/survey_airOutlet.png'
        }
      ],
      toolsLine: [
        {
          // 划线类工具
          id: 'kaicao',
          name: '开槽',
          type: 'lline',
          width: 1, // 宽度
          color: '#66bffa', // 颜色
          gap: 3, // 与主线条的距离
          // mainWidth: 2, // 主线条宽度
          // mainColor: '#5c94fd', // 主线条颜色
          icon: 'https://pub.fsgo365.cn/survey_slotting.png',
          iconWhite: 'https://pub.fsgo365.cn/survey_slotting_white.png',
          class: ''
        },
        {
          id: 'nver',
          name: '女儿墙',
          type: 'rline',
          width: 1,
          color: '#ff0000',
          gap: 3,
          // mainWidth: 2,
          // mainColor: '#8c0000',
          fan: 1, // 是否存在上/下翻，0否1是
          icon: 'https://pub.fsgo365.cn/survey_parapet.png',
          iconWhite: 'https://pub.fsgo365.cn/survey_parapet_white.png',
          class: ''
        },
        {
          id: 'chengzhong',
          name: '承重墙',
          type: 'line',
          width: 4,
          color: '#000000',
          icon: 'https://pub.fsgo365.cn/survey_bearingWall.jpg',
          iconWhite: 'https://pub.fsgo365.cn/survey_bearingWall_white.jpg',
          class: ''
        }
      ],
      blueOpen: false, // 蓝牙是否打开状态
      blueDevices: [], // 蓝牙设备列表
      blueIndex: -1, // 蓝牙设备选择索引
      blueDeviceCur: null, // 连接的蓝牙设备, deviceId,serviceId,characteristicId
      blueDistance: 0, // 缓存蓝牙接收的距离数据
      drawingArc: false, // 是否正在绘制弧线
      overviewShow: true, // 预览图展示
      sidebarShow: true, // 左侧工具栏展示
      toolsLineShow: false, // 底部结构类型工具栏展开
      moreShow: false, // 底部更多工具栏展开
      debugShow: false, // 底部调试工具栏展示
      noteShow: false, // 文字标注展示
      statisticShow: false, // 统计数据展示
      curFanVal: 0, // 当前上/下翻距离
      fanShow: false, // 上/下翻距离显示
      goShow: false, // 手动前进指定距离展示
      turnShow: false, // 模拟手机转向控制展示
      bdataId: 1, // 日志记录自增id
      bdata: [], // 日志记录数据
      funcF1: 'doLockDegree', // f1快捷键
      funcF2: 'turnLeft', // f2快捷键
      funcF3: 'turnRight', // f3快捷键
      markTxtSize: 12, // 标记文本字体大小（线长度、面积文本）
      noDrawStartDistance: 0 // 移动模式时的起始距离数据缓存，用于移动模式时的移动距离计算
    };
  },
  onReady() {
    let _this = this;
    // 启动罗盘事件监听
    this.compassStart();

    this.canWidth = this.canSize;
    this.canHeight = this.canSize;
    this.minX = this.canSize;
    this.minY = this.canSize;

    // 图标预加载
    for (let i = 0; i < this.toolsFlag.length; i++)
      this.doLoadImage(this.toolsFlag[i].id, this.toolsFlag[i].icon);
    // 加载图例图标
    this.doLoadImage('_north', 'https://pub.fsgo365.cn/north.jpeg');

    // 多边形面积计算测试
    // let sstat = [{x:3000,y:3000},{x:3020,y:3000},{x:3010,y:3010},{x:3000,y:3010}];
    // console.log(this.doArea(sstat));

    // Canvas画布初始化
    let ctx = uni.createCanvasContext('myCanvas', this);
    this.ctx = ctx;
    // 临时Canvas初始化
    let ctxDummy = uni.createCanvasContext('canDummy', this);
    this.ctxDummy = ctxDummy;

    // 根据手机屏幕尺寸，调整相应尺寸数据
    uni.getSystemInfo({
      success: function (res) {
        // 屏幕宽高，单位：px
        _this.windowWidth = res.windowWidth;
        _this.windowHeight = res.windowHeight;
        _this.pixelRatio = res.pixelRatio;
        // uni.showToast({
        // 	title:'像素比:' + res.pixelRatio,
        // 	icon:'success'
        // });

        _this.doInit();
      }
    });

    // 设置参数初始化
    let obj = uni.getStorageSync('deviation');
    if (obj) this.deviation = parseInt(obj);
    obj = uni.getStorageSync('markDegree');
    if (obj) this.markDegree = parseInt(obj);
    obj = uni.getStorageSync('distance');
    if (obj) this.dummyDistanceStep = parseInt(obj);
    // obj = uni.getStorageSync('startPosition');
    // if(obj)
    // 	this.startPosition = parseInt(obj);
    // obj = uni.getStorageSync('cmPerPx');
    // if(obj)
    // 	this.cmPerPx = parseInt(obj);
    obj = uni.getStorageSync('markTxtSize');
    if (obj) this.markTxtSize = parseInt(obj);
    obj = uni.getStorageSync('startPointGap');
    if (obj) this.startPointGap = parseInt(obj);
    obj = uni.getStorageSync('wheelRadius');
    if (obj) this.wheelRadius = parseInt(obj);
    obj = uni.getStorageSync('funcF1');
    if (obj) this.funcF1 = obj;
    obj = uni.getStorageSync('funcF2');
    if (obj) this.funcF2 = obj;
    obj = uni.getStorageSync('funcF3');
    if (obj) this.funcF3 = obj;
    obj = uni.getStorageSync('inter');
    let interTime = 50;
    if (obj) interTime = parseInt(obj);

    // 启动模拟位置移动定时
    this.inter1 = setInterval(function () {
      _this.doInterEvent();
    }, interTime);

    // 全局预览图片生成定时
    let inter2 = setInterval(function () {
      _this.doCanvasImageFull();
    }, 5000);

    // 监听设置界面参数设置，调整相应参数
    uni.$on('osg', function (msg) {
      if (msg == 'setting') {
        let i = parseInt(uni.getStorageSync('deviation'));
        _this.deviation = i;
        i = parseInt(uni.getStorageSync('markDegree'));
        _this.markDegree = i;
        // i = parseInt(uni.getStorageSync('startPosition'));
        // _this.startPosition = i;
        // i = parseInt(uni.getStorageSync('cmPerPx'));
        // _this.cmPerPx = i;
        i = parseInt(uni.getStorageSync('markTxtSize'));
        _this.markTxtSize = i;
        i = parseInt(uni.getStorageSync('startPointGap'));
        _this.startPointGap = i;
        i = parseInt(uni.getStorageSync('wheelRadius'));
        _this.wheelRadius = i;

        var obj = uni.getStorageSync('funcF1');
        _this.funcF1 = obj;
        obj = uni.getStorageSync('funcF2');
        _this.funcF2 = obj;
        obj = uni.getStorageSync('funcF3');
        _this.funcF3 = obj;

        i = parseInt(uni.getStorageSync('inter'));
        clearInterval(_this.inter1);
        _this.inter1 = setInterval(function () {
          _this.dummyDistanceStep = parseInt(uni.getStorageSync('distance'));
          _this.doInterEvent();
        }, i);

        // 修改罗盘刻度和精确度则需要重置当前角度
        _this.doTurn(0);
      } else if (msg == 'clearCanvas') {
        // 延迟清空画布并初始化，避免真机失效问题
        setTimeout(function () {
          _this.doInit();
        }, 500);
      } else if (msg == 'appShow') {
        _this.compassStart();
      } else if (msg == 'appHide') {
        _this.compassStop();
      }
    });
  },
  onUnload() {
    // 离开页面时断开蓝牙连接
    if (this.blueOpen) this.doInitBlue();
  },
  filters: {
    sumStat(item) {
      let sum = 0;
      item.forEach(item1 => {
        sum += item1.dis;
      });
      return sum;
    }
  },
  methods: {
    doInit() {
      let _this = this;

      _this.ctx.translate(0, 0);

      // 清空画布
      _this.ctx.clearRect(0, 0, _this.canSize, _this.canSize);
      _this.ctx.draw();

      // 起点位置：0中央1西北2东北3东南4西南
      let gap = 30; // 非0时默认起点边距30像素
      switch (_this.startPosition) {
        case 1:
          _this.x = gap;
          _this.y = gap;
          break;
        case 2:
          _this.x = _this.canSize - gap;
          _this.y = gap;
          break;
        case 3:
          _this.x = _this.canSize - gap;
          _this.y = _this.canSize - gap;
          break;
        case 4:
          _this.x = gap;
          _this.y = _this.canSize - gap;
          break;
        default:
          _this.x = _this.canSize / 2;
          _this.y = _this.canSize / 2;
          break;
      }

      _this.ctx.moveTo(_this.x, _this.y);

      // 显示当前位置图标
      _this.doCurrentPosition();

      // 当前位置图标显示位置计算
      _this.meLeft = _this.x - 10 - _this.scrollLeftOld + _this.canBorderSize / 2;
      _this.meTop = _this.y - 10 - _this.scrollTopOld + _this.canBorderSize / 2;

      // 绘制起始点
      _this.drawStartPoint();

      // 绘图初始化
      _this.ctx.setLineCap('round');
      _this.ctx.setLineJoin('round');
      _this.ctx.setStrokeStyle(this.defaultLineColor);
      _this.ctx.beginPath();

      // 变量初始化
      _this.lastDegree = -1;
      _this.statLast = null;
      _this.stat = [];
      _this.statHis = [];
      _this.statToolsFlag = [];
      _this.maxX = 0;
      _this.maxY = 0;
      _this.minX = _this.canSize;
      _this.minY = _this.canSize;
      _this.cmPerPx = 1;
    },
    /**
			 * 绘制起始点图形

			 * @param {Object} notclear 是否绘制前不清空画布
			 */
    drawStartPoint(notclear) {
      this.doDrawPoint(this.x, this.y, 4, '#00ff00', !notclear);

      this.startPointX = this.x;
      this.startPointY = this.y;

      this.drawClosed = false;
    },
    doInterEvent() {
      if (this.dummyEnable) this.doDraw(this.dummyDistanceStep);
    },
    /**
			 * 手动拖拽画布位置滚动事件

			 * @param {Object} e
			 */
    doScroll(e) {
      if (!this.canShow) return; // 解决弹出窗展示时，定位图标不在屏幕内的问题
      let d = e.detail;
      this.meLeft -= d.scrollLeft - this.scrollLeftOld;
      this.meTop -= d.scrollTop - this.scrollTopOld;
      this.scrollLeftOld = d.scrollLeft;
      this.scrollTopOld = d.scrollTop;
    },
    /**
     * 全局预览图片生成函数
     */
    doCanvasImageFull() {
      let _this = this;
      this.doExportImage(function (path) {
        _this.canvasImage = path;
      });
    },
    /**
     * 导出图片函数，可以指定是否生成图例，以及图例显示在图形顶部还是右侧
     *
     * @param {Object} func 回调函数
     * @param {Object} useDummy 是否显示图例
     * @param {Object} rightDummy 是否显示图例到右侧
     */
    doExportImage(func, useDummy, rightDummy) {
      if (!func) return;
      let minWidth = 300,
        minHeight = 300;
      let _this = this,
        margin = 20;
      let x = this.minX - margin;
      let y = this.minY - margin;
      let width = this.maxX - this.minX + margin * 2;
      let height = this.maxY - this.minY + margin * 2;
      if (width < minWidth) {
        let gap = minWidth - width;
        x -= gap / 2;
        width += gap;
      }
      if (height < minHeight) {
        let gap = minHeight - height;
        y -= gap / 2;
        height += gap;
      }
      if (x < 0) x = 0;
      if (y < 0) y = 0;

      uni.canvasToTempFilePath(
        {
          canvasId: 'myCanvas',
          x: x,
          y: y,
          width: width,
          height: height,
          success: function (res) {
            if (!useDummy) {
              func(res.tempFilePath, width, height);
              return;
            }

            let cHeight = 80,
              cWidth = 0;
            let rightDummyOffset = 0;
            if (rightDummy) {
              rightDummyOffset = width + 20;
              cHeight = 10;
              cWidth = 150;
            }

            // 绘制使用的线图例
            var toolsLineIds = [],
              toolsFlagIds = [];
            for (var m = 0; m < _this.statHis.length; m++) {
              for (var i = 0; i < _this.statHis[m].length; i++) {
                for (var j = 0; j < _this.statHis[m][i].toolsLine.length; j++) {
                  if (!_this.contains(toolsLineIds, _this.statHis[m][i].toolsLine[j].id))
                    toolsLineIds.push(_this.statHis[m][i].toolsLine[j].id);
                }
              }
            }
            for (var i = 0; i < _this.stat.length; i++) {
              for (var j = 0; j < _this.stat[i].toolsLine.length; j++) {
                if (!_this.contains(toolsLineIds, _this.stat[i].toolsLine[j].id))
                  toolsLineIds.push(_this.stat[i].toolsLine[j].id);
              }
            }
            if (_this.statLast) {
              for (var j = 0; j < _this.statLast.toolsLine.length; j++) {
                if (!_this.contains(toolsLineIds, _this.statLast.toolsLine[j].id))
                  toolsLineIds.push(_this.statLast.toolsLine[j].id);
              }
              for (var tl in _this.statLast.toolsLineCur) {
                if (!_this.contains(toolsLineIds, tl)) toolsLineIds.push(tl);
              }
            }
            // 绘制使用的图标图例
            for (var i = 0; i < _this.statToolsFlag.length; i++) {
              if (!_this.contains(toolsFlagIds, _this.statToolsFlag[i].id))
                toolsFlagIds.push(_this.statToolsFlag[i].id);
            }

            if (rightDummy) {
              if (toolsLineIds.length > 0) cWidth += 120;
              if (toolsFlagIds.length > 0) cWidth += 120;
            } else {
              var addHeight = 0;
              if (toolsLineIds.length > 3) addHeight = (toolsLineIds.length - 3) * 22;
              if (toolsFlagIds.length > 3) addHeight = (toolsFlagIds.length - 3) * 25;
              cHeight += addHeight;
            }

            if (rightDummy && cWidth < 220) cWidth = 220;

            _this.canDummyHeight = height + cHeight;
            _this.canDummyWidth = width + cWidth;
            _this.canDummyShow = true;
            _this.ctxDummy.draw(); // 先清空图形
            _this.doDrawImage(
              _this.ctxDummy,
              res.tempFilePath,
              0,
              rightDummy ? 0 : cHeight,
              width,
              height
            );
            if (rightDummy)
              _this.doDrawLine(
                _this.ctxDummy,
                rightDummyOffset - 2,
                0,
                rightDummyOffset - 2,
                height,
                '#bfbfbf',
                1,
                true
              );
            else
              _this.doDrawLine(
                _this.ctxDummy,
                0,
                cHeight - 12,
                width,
                cHeight - 12,
                '#bfbfbf',
                1,
                true
              );
            // 绘制指北针图标
            _this.doDrawImage(
              _this.ctxDummy,
              _this['icon__north'],
              width + cWidth - 60,
              10,
              50,
              50
            );
            // 绘制文本，单位:cm
            _this.doDrawText(
              _this.ctxDummy,
              '单位:cm',
              { x: width + cWidth - 60, y: 86 },
              12,
              '#404040'
            );
            // 比例文本输出
            //_this.doDrawText(_this.ctxDummy, '比例:1:' + _this.cmPerPx,{x:width + cWidth - 60,y:106}, 12, '#404040');

            // 右侧显示图例时，绘制统计数据
            if (rightDummy) {
              var data = _this.doStatisticData();
              var lineX = rightDummyOffset + 10;
              var lineY = 106,
                lineHeight = 20;

              function _doDrawStatToDummy(txt, leftTab) {
                var xp = lineX;
                if (leftTab && leftTab > 0) xp += leftTab;
                _this.doDrawText(_this.ctxDummy, txt, { x: xp, y: lineY }, 12, '#404040');
                lineY = lineY + lineHeight;
              }

              _doDrawStatToDummy('图形数量：' + data.graphCount);

              if (data.graphs) {
                for (var i = 0; i < data.graphs.length; i++) {
                  let graph = data.graphs[i];

                  var fanArea = 0;
                  // 计算上/下翻面积
                  if (graph.fans) {
                    for (var j = 0; j < graph.fans.length; j++)
                      fanArea += graph.fans[j].fan * graph.fans[j].dis;
                  }

                  var fanTxt = '';
                  if (fanArea > 0)
                    fanTxt += '，含上/下翻：' + (fanArea / 10000).toFixed(2) + '平米';

                  _doDrawStatToDummy('图形' + graph.id + ':');
                  if (graph.area == -1) _doDrawStatToDummy('面积：未闭环' + fanTxt, 20);
                  else
                    _doDrawStatToDummy(
                      '面积：' + ((graph.area + fanArea) / 10000).toFixed(2) + '平米' + fanTxt,
                      20
                    );
                  _doDrawStatToDummy('边/角数量：' + graph.edgeCount, 20);
                  _doDrawStatToDummy('总边长：' + graph.edgeLength, 20);

                  for (var j = 0; j < graph.arcs.length; j++)
                    _doDrawStatToDummy(
                      '弧' + graph.arcs[j].id + '面积：' + (graph.arcs[j].area / 10000).toFixed(2),
                      20
                    );

                  if (graph.lines) {
                    _doDrawStatToDummy('线条数量：' + graph.lineCount, 20);
                    for (var j = 0; j < graph.lines; j++)
                      _doDrawStatToDummy(
                        graph.lines[i].name +
                          '数量：' +
                          graph.lines[i].count +
                          ';长度：' +
                          graph.lines[i].length,
                        40
                      );
                  }

                  if (graph.fans) {
                    _doDrawStatToDummy('上/下翻线条数量：' + graph.fans.length, 20);
                    for (var j = 0; j < graph.fans.length; j++)
                      _doDrawStatToDummy(
                        graph.fans[j].name +
                          '上/下翻：' +
                          graph.fans[j].fan +
                          ';长度：' +
                          graph.fans[j].dis,
                        40
                      );
                  }
                }
              }
              if (data.lines) {
                _doDrawStatToDummy('线条数量：' + data.lineCount);
                for (var i = 0; i < data.lines.length; i++)
                  _doDrawStatToDummy(
                    data.lines[i].name +
                      '数量：' +
                      data.lines[i].count +
                      ';长度：' +
                      data.lines[i].length,
                    20
                  );
              }
              if (data.flags) {
                _doDrawStatToDummy('标记数量：' + data.flagCount);
                for (var i = 0; i < data.flags.length; i++)
                  _doDrawStatToDummy(data.flags[i].name + '数量：' + data.flags[i].count, 20);
              }
            }

            for (var i = 0; i < toolsLineIds.length; i++) {
              for (var j = 0; j < _this.toolsLine.length; j++) {
                var tl = _this.toolsLine[j];
                if (tl.id == toolsLineIds[i]) {
                  _this.doDrawText(
                    _this.ctxDummy,
                    _this.toolsLine[j].name,
                    { x: 54 + rightDummyOffset, y: 10 + 20 * i },
                    12,
                    '#f1aa00'
                  );
                  let lwidth = _this.defaultLineWidth;
                  let lcolor = _this.defaultLineColor;
                  let loffset = 0;
                  if (tl.type == 'line') {
                    // 主线条变化
                    if (tl.width) lwidth = tl.width;
                    if (tl.color) lcolor = tl.color;
                  } else if (tl.type == 'lline' || tl.type == 'rline') {
                    // 左侧/右侧线条
                    let lgap = 3,
                      color = _this.defaultLineColor,
                      width = _this.defaultLineWidth;
                    if (tl.gap) lgap = tl.gap;
                    if (tl.color) color = tl.color;
                    if (tl.width) width = tl.width;
                    // 主线条宽度和颜色样式改变
                    if (tl.mainWidth) lwidth = tl.mainWidth;
                    if (tl.mainColor) lcolor = tl.mainColor;

                    if (tl.type == 'lline')
                      _this.doDrawLine(
                        _this.ctxDummy,
                        10 + rightDummyOffset,
                        4 + 20 * i + lgap,
                        50 + rightDummyOffset,
                        4 + 20 * i + lgap,
                        color,
                        width
                      );
                    else {
                      _this.doDrawLine(
                        _this.ctxDummy,
                        10 + rightDummyOffset,
                        4 + 20 * i,
                        50 + rightDummyOffset,
                        4 + 20 * i,
                        color,
                        width
                      );
                      loffset = lgap;
                    }
                  }

                  // 绘制主线条
                  _this.doDrawLine(
                    _this.ctxDummy,
                    10 + rightDummyOffset,
                    4 + 20 * i + loffset,
                    50 + rightDummyOffset,
                    4 + 20 * i + loffset,
                    lcolor,
                    lwidth
                  );
                  continue;
                }
              }
            }

            for (var i = 0; i < toolsFlagIds.length; i++) {
              for (var j = 0; j < _this.toolsFlag.length; j++) {
                var tf = _this.toolsFlag[j];
                if (tf.id == toolsFlagIds[i]) {
                  _this.doDrawImage(
                    _this.ctxDummy,
                    _this['icon_' + tf.id],
                    130 + rightDummyOffset - (toolsLineIds.length == 0 ? 120 : 0),
                    0 + 24 * i,
                    20,
                    20
                  );
                  _this.doDrawText(
                    _this.ctxDummy,
                    tf.name,
                    {
                      x: 154 + rightDummyOffset - (toolsLineIds.length == 0 ? 120 : 0),
                      y: 14 + 24 * i
                    },
                    12,
                    '#f1aa00'
                  );
                  continue;
                }
              }
            }
            setTimeout(function () {
              uni.canvasToTempFilePath(
                {
                  canvasId: 'canDummy',
                  x: 0,
                  y: 0,
                  width: width + cWidth,
                  height: height + cHeight,
                  success: function (res2) {
                    func(res2.tempFilePath, width + cWidth, height + cHeight);
                    _this.canDummyShow = false;
                  },
                  fail(err) {
                    console.log('err: ' + JSON.stringify(err));
                  }
                },
                _this
              );
            }, 100);
          },
          fail(err) {
            console.log('err: ' + JSON.stringify(err));
          }
        },
        this
      );
    },
    contains: function (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          return true;
        }
      }
    },
    /**
			 * 所有的按钮点击事件处理

			 * @param {Object} id 按钮标识
			 */
    doBtn(id) {
      let _this = this;
      /**
       * 自由式移动
       */
      function _moveFree(force) {
        if (!_this.turnHand || force) {
          // 移动模式非手动旋转角度时，禁用偏离修复，固定为5度
          _this.deviation = 5;
          _this.markDegree = 5;
        }
      }
      /**
       * 调整式移动
       */
      function _moveAdjusted() {
        let obj = uni.getStorageSync('markDegree');
        if (obj) _this.markDegree = parseInt(obj);
        else _this.markDegree = 45;
        obj = uni.getStorageSync('deviation');
        if (obj) _this.deviation = parseInt(obj);
        else _this.deviation = 15;
      }
      function _doBtnTurn(isTurnleft) {
        var mdegree = _this.markDegree;
        if (!_this.drawing) {
          let obj = uni.getStorageSync('markDegree');
          if (obj) mdegree = parseInt(obj);
          else mdegree = 45;
        }

        if (!_this.turnHand) _this.degree = 0;
        _this.turnHand = true;
        if (!isTurnleft) mdegree = -1 * mdegree;
        let d = _this.degree - mdegree;
        if (d < 0) d += 360;
        if (d > 360) d -= 360;
        _this.doTurn(d);
        _this.lockDegree = -1; // 取消角度锁定
      }
      if (id == 'dummy') {
        this.dummyEnable = !this.dummyEnable;
      } else if (id == 'turn') {
        // 点击罗盘展示手动转向
        this.turnShow = !this.turnShow;
        this.onDialogChange(this.turnShow);
      } else if (id == 'golog') {
        this.showLog = !this.showLog;
        this.debugShow = !this.debugShow;
        this.onDialogChange(this.showLog);
      } else if (id == 'toolsLineShow') {
        this.toolsLineShow = !this.toolsLineShow;
        this.moreShow = false;
        this.debugShow = false;
      } else if (id == 'start') {
        if (this.pause) {
          this.pause = false;
        } else {
          this.pause = true;
        }
        this.toolsLineShow = false;
        this.moreShow = false;
        this.debugShow = false;
      } else if (id == 'moreShow') {
        // 展示/隐藏更多工具栏
        this.moreShow = !this.moreShow;
        this.toolsLineShow = false;
        this.debugShow = false;
      } else if (id == 'debugShow') {
        // 展示/隐藏调试工具栏
        this.debugShow = !this.debugShow;
        this.toolsLineShow = false;
        this.moreShow = false;
      } else if (id == 'toolHide') {
        this.toolsLineShow = false;
        this.moreShow = false;
        this.debugShow = false;
      } else if (id.startsWith('tl_')) {
        // 线条工具按钮
        id = id.substring(3);
        for (let i = 0; i < this.toolsLine.length; i++) {
          if (this.toolsLine[i].id == id) {
            if (!this.toolsLine[i].class) {
              this.toolsLine[i].class = this.toolsLineActiveClass;
              if (this.toolsLine[i].fan == 1) {
                // 当前线条支持上/下翻，则弹出设置窗口
                this.curFanVal = 0;
                this.fanShow = true;
              }
            } else {
              if (this.toolsLine[i].fan == 1)
                // 当前线条支持上/下翻，则重置距离值为0
                this.curFanVal = 0;
              this.toolsLine[i].class = '';
              // 存在当前线条统计数据，则放入历史列表
              if (this.statLast && this.statLast.toolsLineCur[id]) {
                this.statLast.toolsLine.push(this.statLast.toolsLineCur[id]);
                delete this.statLast.toolsLineCur[id];
              }
            }
            break;
          }
          // TODO:不需要多条线同时绘制时
          // if(this.toolsLine[i].id == id) {
          // 	this.toolsLine[i].class = this.toolsLineActiveClass;
          // }else{
          // 	if(this.toolsLine[i].class){
          // 		this.toolsLine[i].class = '';
          // 		// 存在当前线条统计数据，则放入历史列表
          // 		if(this.statLast && this.statLast.toolsLineCur[id]) {
          // 			this.statLast.toolsLine.push(this.statLast.toolsLineCur[id])
          // 			delete this.statLast.toolsLineCur[id];
          // 		}
          // 	}
          // }
        }
      } else if (id.startsWith('tf_')) {
        // 标记工具按钮
        id = id.substring(3);
        for (let i = 0; i < this.toolsFlag.length; i++) {
          let tf = this.toolsFlag[i];
          if (tf.id == id) {
            let w = tf.width;
            let h = tf.height;
            if (!w) w = 20;
            if (!h) h = 20;
            // 根据每像素厘米数缩放图标
            // w = w / this.cmPerPx;
            // h = h / this.cmPerPx;

            this.doDrawImage(this.ctx, this['icon_' + tf.id], this.x, this.y, w, h);

            // 添加标记工具统计信息
            let tfdata = {
              id: tf.id,
              name: tf.name,
              x: this.x,
              y: this.y
            };
            if (this.statLast) this.statLast.toolsFlag.push(tfdata);
            this.statToolsFlag.push(tfdata);
            if (this.maxX < this.x + w) this.maxX = this.x + w;
            if (this.maxY < this.y + h) this.maxY = this.y + h;
            break;
          }
        }
      } else if (id == 'gensui') {
        // 跟随
        this.gensui = !this.gensui;
        if (this.gensui) this.doCurrentPosition();
      } else if (id == 'huaxian') {
        // 划线/移动
        this.drawing = !this.drawing;
        if (this.drawing) {
          // 切换回划线模式绘制新起点
          if (this.x != this.startPointX || this.y != this.startPointY) this.drawStartPoint(true);
          _moveAdjusted();
        } else {
          this.noDrawStartDistance = this.distance; // 缓存当前距离，用于移动距离实时计算
          this.lockDegree = -1; // 取消角度锁定
          this.turnHand = false; // 取消手动调整角度
          _moveFree();
        }
      } else if (id == 'arc') {
        // 绘制弧线/直线切换
        if (!this.drawingArc) {
          // 开始绘制弧线
          this.turnHand = false; // 绘制弧线时停止手动转向模式
          this.lockDegree = -1; // 取消角度锁定
          this.drawingArc = true;
          _moveFree(true);
        } else {
          // 弧线绘制结束
          this.drawingArc = false;
          _moveAdjusted();
        }
        this.doBtn('toolHide');
      } else if (id == 'setting') {
        // 进入设置界面
        this.moreShow = !this.moreShow;
        uni.navigateTo({
          url: './setting'
        });
      } else if (id == 'curPosition') {
        // 当前位置
        this.doCurrentPosition();
        this.debugShow = !this.debugShow;
      } else if (id == 'turnLeft') {
        // 手动向左转动角度
        _doBtnTurn(true);
      } else if (id == 'turnRight') {
        // 手动向右转动角度
        _doBtnTurn(false);
      } else if (id == 'turnOff') {
        // 停止手动转动角度，开启罗盘监听模式
        this.turnHand = false;
      } else if (id == 'addRadius') {
        // 添加半径长度
        this.doDraw(parseInt(this.wheelRadius), true);
      } else if (id == 'dostat') {
        // 显示统计信息
        this.doStatistic();
        // this.$refs.popupStatistic.open('bottom');
        this.statisticShow = !this.statisticShow;
        this.moreShow = !this.moreShow;
        this.onDialogChange(this.statisticShow);
      } else if (id == 'overview') {
        // 进入预览界面
        this.doExportImage(function (path, width, height) {
          uni.navigateTo({
            url: './overview?path=' + path + '&width=' + width + '&height=' + height
          });
        }, true);
      } else if (id == 'overviewShow') {
        // 展示/隐藏预览区域
        this.overviewShow = !this.overviewShow;
      } else if (id == 'gogogo') {
        // 手动移动指定距离
        this.doDraw(parseInt(this.goDistance), true);
        uni.showToast({
          title: '已移动' + parseInt(this.goDistance) + '厘米'
        });
      } else if (id == 'initBlue') {
        // 初始化蓝牙设备
        this.doInitBlue();
      } else if (id == 'save') {
        // 保存
        this.doSaveImageToAlbum();
        this.moreShow = !this.moreShow;
      } else if (id == 'clearCanvas') {
        // 清空画布
        uni.showModal({
          content: '是否确认清空绘图？',
          success: res => {
            if (res.confirm) {
              _this.moreShow = false;
              _this.currentDistance = 0;
              // 延迟清空画布并初始化，避免真机失效问题
              setTimeout(function () {
                _this.doInit();
              }, 100);
            }
          }
        });
      } else if (id == 'note') {
        // 标注
        // this.$refs.popupNote.open('bottom');
        this.noteShow = true;
        this.onDialogChange(this.noteShow);
      } else if (id == 'noteSave') {
        // 标注
        this.doDrawText(
          this.ctx,
          this.noteContent,
          { x: this.x, y: this.y },
          this.markTxtSize,
          '#f1aa00'
        );
        this.noteContent = '';
        // this.$refs.popupNote.close();
        this.noteShow = false;
        this.onDialogChange(this.noteShow);
      } else if (id == 'fanShow') {
        // 移动指定距离
        this.fanShow = !this.fanShow;
        this.onDialogChange(this.fanShow);
      } else if (id == 'goShow') {
        // 移动指定距离
        this.goShow = !this.goShow;
        this.onDialogChange(this.goShow);
      } else if (id == 'popupStatisticClose') {
        // 关闭统计popup
        // this.$refs.popupStatistic.close();
        this.statisticShow = false;
        this.onDialogChange(this.statisticShow);
      } else if (id == 'popupNoteClose') {
        // 关闭标注popup
        // this.$refs.popupNote.close();
        this.noteShow = false;
        this.onDialogChange(this.noteShow);
      } else if (id == 'doLockDegree') {
        // 锁定角度按钮
        this.turnHand = false; // 取消
        // 2秒内双连击取消角度锁定
        let t = new Date().getTime();
        if (t - this.lockDegreeLastTime <= 1000 && this.lockDegree != -1) {
          this.lockDegree = -1;
          this.turnHand = false; // 停止手动转向模式
          uni.showToast({
            title: '已取消锁角'
          });
        } else {
          this.lockDegree = this.degree;
          if (this.lockDegree != -1) {
            uni.showToast({
              title: '已锁定当前角度，双击按钮可取消锁角',
              icon: 'none',
              duration: 4000
            });
          }
        }
        this.lockDegreeLastTime = t;
      }
    },
    /**
     * 保存图片到相册
     */
    doSaveImageToAlbum() {
      let that = this;
      this.doExportImage(
        function (path) {
          // 向用户发起授权请求
          uni.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              // 已授权
              //保存图片至相册
              uni.saveImageToPhotosAlbum({
                filePath: path,
                success: function () {
                  uni.showToast({
                    title: '保存成功'
                  });
                  // 缓存图片路径和统计数据
                  that.doStatistic();
                  wx.setStorageSync('surveyData', {
                    fieldName: wx.getStorageSync('surveyField').name,
                    path,
                    statisticData: that.statisticData,
                    statisticTxt: that.statisticTxt
                  });
                },
                fail: function () {
                  uni.showToast({
                    title: '保存失败，请稍后重试'
                  });
                }
              });
            },
            fail: () => {
              // 拒绝授权，获取当前设置
              uni.getSetting({
                success: result => {
                  if (!result.authSetting['scope.writePhotosAlbum']) {
                    uni.showModal({
                      content: '由于您还没有允许保存图片到您相册里,无法进行保存,请点击确定允许授权',
                      success: res => {
                        if (res.confirm) {
                          uni.openSetting({
                            success: result => {
                              console.log(result.authSetting);
                            }
                          });
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        },
        true,
        true
      );
    },
    /**
     * 定位到当前位置
     */
    doCurrentPosition() {
      let _this = this;
      // 延迟设置滚动位置，避免不生效问题
      setTimeout(function () {
        let cleft = _this.windowWidth / 2 - _this.x;
        if (_this.canLeft == cleft)
          // 如相等则会失效，因此加1
          cleft += 1;
        _this.canLeft = cleft;
        setTimeout(function () {
          let ctop = _this.windowHeight / 2 - _this.y;
          if (_this.canTop == ctop)
            // 如相等则会失效，因此加1
            ctop += 1;
          _this.canTop = ctop;
        }, 100);
      }, 100);
    },
    async doLoadImage(dataName, url) {
      this['icon_' + dataName] = await this.handleNetworkImgaeTransferTempImage(url);
    },
    handleNetworkImgaeTransferTempImage(url) {
      return new Promise(resolve => {
        if (url.indexOf('http') === 0) {
          uni.downloadFile({
            url,
            success: res => {
              if (res.statusCode === 200) {
                resolve(res.tempFilePath);
              }
            },
            fail: res => {
              uni.showModal({
                title: '提示',
                content: '下载失败:' + JSON.stringify(res)
              });
            }
          });
        } else resolve(url);
      });
    },
    doRedraw() {
      var _this = this;
      var opp = this.cmPerPx,
        npp = opp + 1;
      if (opp > 1)
        // 确保可被整除的偶数倍数
        npp = opp + 2;
      var scale = opp / npp;
      this.cmPerPx = npp;
      // 清空画布
      this.ctx.clearRect(0, 0, this.canSize, this.canSize);
      this.ctx.draw();
      function _scaleXy(xy) {
        return _this.canSize / 2 + (xy - _this.canSize / 2) * scale;
      }
      function _drawStat(st, doMark) {
        var nx = _scaleXy(st.x);
        var ny = _scaleXy(st.y);
        var nex, ney;
        if (st.ex) nex = _scaleXy(st.ex);
        else nex = _this.x;
        if (st.ey) ney = _scaleXy(st.ey);
        else ney = _this.y;
        let lwidth = _this.defaultLineWidth;
        let lcolor = _this.defaultLineColor;
        console.log(
          st.x +
            ':' +
            nx +
            ';' +
            st.y +
            ':' +
            ny +
            ';' +
            st.ex +
            ':' +
            nex +
            ':' +
            st.ey +
            ':' +
            ney
        );
        st.x = nx;
        st.y = ny;
        if (st.ex) st.ex = nex;
        if (st.ey) st.ey = ney;

        // 画主线条
        _this.doDrawLine(_this.ctx, nx, ny, nex, ney, lcolor, lwidth);
        if (doMark) _this.doMarkLine(st);

        var toolsLineList = [];
        for (var i = 0; i < st.toolsLine.length; i++) toolsLineList.push(st.toolsLine[i]);
        for (var tln in st.toolsLineCur) toolsLineList.push(st.toolsLineCur[tln]);

        for (var j = 0; j < toolsLineList.length; j++) {
          var stl = toolsLineList[j];

          // 坐标缩放转换
          stl.x = _scaleXy(stl.x);
          stl.y = _scaleXy(stl.y);
          stl.ex = _scaleXy(stl.ex);
          stl.ey = _scaleXy(stl.ey);

          // 划线工具判断和处理
          for (let i = 0; i < _this.toolsLine.length; i++) {
            let tl = _this.toolsLine[i];
            if (tl.id == stl.id) {
              // type、width、color、gap
              if (tl.type == 'line') {
                // 主线条变化
                if (tl.width) lwidth = tl.width;
                if (tl.color) lcolor = tl.color;
                // 覆盖主线条绘制
                _this.doDrawLine(_this.ctx, stl.x, stl.y, stl.ex, stl.ey, lcolor, lwidth);
              } else if (tl.type == 'lline' || tl.type == 'rline') {
                // 左侧/右侧线条
                let lgap = 3,
                  color = _this.defaultLineColor,
                  width = _this.defaultLineWidth;
                if (tl.gap) lgap = tl.gap;
                if (tl.color) color = tl.color;
                if (tl.width) width = tl.width;
                // 主线条宽度和颜色样式改变
                if (tl.mainWidth) lwidth = tl.mainWidth;
                if (tl.mainColor) lcolor = tl.mainColor;
                // 覆盖主线条绘制
                if (tl.mainWidth || tl.mainColor)
                  _this.doDrawLine(_this.ctx, stl.x, stl.y, stl.ex, stl.ey, lcolor, lwidth);

                var dir = stl.dir,
                  dirGap = stl.dirGap;

                let q = 1;
                if ((dir >= 0 && dir <= 90) || (dir >= 270 && dir <= 360)) q = -1;
                if (tl.type == 'rline') q = q * -1;

                let gapx = 0;
                let gapy = 0;
                if (dirGap == 0) {
                  gapy = lgap;
                  if (dir == 270) gapy = gapy * -1;
                } else {
                  gapx = lgap / Math.sin((dirGap * Math.PI) / 180);
                  if (dirGap <= 30) {
                    gapx = 0;
                    gapy = lgap * q;
                    if ((tl.type == 'rline' && dir > 180) || (tl.type == 'lline' && dir < 180))
                      gapy *= -1;
                  }
                }

                _this.doDrawLine(
                  _this.ctx,
                  stl.x + gapx * q,
                  stl.y + gapy * q,
                  stl.ex + gapx * q,
                  stl.ey + gapy * q,
                  color,
                  width
                );
              }
            }
          }
        }
      }
      this.x = _scaleXy(this.x);
      this.y = _scaleXy(this.y);
      this.meLeft = _scaleXy(this.meLeft);
      this.meTop = _scaleXy(this.meTop);
      this.maxX = _scaleXy(this.maxX);
      this.maxY = _scaleXy(this.maxY);
      this.minX = _scaleXy(this.minX);
      this.minY = _scaleXy(this.minY);
      // 重新定位到当前位置
      this.doCurrentPosition();

      _drawStat(this.statLast);
      if (this.stat.length == 0)
        this.doDrawPoint(this.statLast.x, this.statLast.y, 4, '#00ff00', false);
      for (var i = 0; i < this.stat.length; i++) {
        var st = this.stat[i];
        if (i == 0) this.doDrawPoint(st.x, st.y, 4, '#00ff00', false);
        _drawStat(st, true);
      }
      for (var j = 0; j < this.statHis.length; j++) {
        for (var i = 0; i < this.statHis[j].length; i++) {
          var st = this.statHis[j][i];
          if (i == 0) this.doDrawPoint(st.x, st.y, 4, '#00ff00', false);
          _drawStat(st, true);
        }
      }
      for (var j = 0; j < this.statToolsFlag.length; j++) {
        var stf = this.statToolsFlag[j];
        for (let i = 0; i < this.toolsFlag.length; i++) {
          let tf = this.toolsFlag[i];
          if (tf.id == stf.id) {
            let w = tf.width;
            let h = tf.height;
            if (!w) w = 20;
            if (!h) h = 20;
            // 根据每像素厘米数缩放图标
            // w = w / this.cmPerPx;
            // h = h / this.cmPerPx;

            stf.x = _scaleXy(stf.x);
            stf.y = _scaleXy(stf.y);

            this.doDrawImage(this.ctx, this['icon_' + tf.id], stf.x, stf.y, w, h);
            break;
          }
        }
      }
    },
    /**
			 * 图形绘制函数

			 * @param {Object} dd 绘制移动距离，单位：cm
			 */
    doDraw(dd, ignorePause) {
      if (this.pause && !ignorePause) return;

      // 起点闭环后则停止绘画
      if (this.drawing && this.drawClosed) return;

      // 距离保留一位小数并转换为数值
      dd = parseFloat(dd.toFixed(1));

      // 恢复缩放状态，并显示当前位置图标
      this.canScale = 1;
      this.meDisp = 'visible';

      this.distance += dd;

      let ctx = this.ctx,
        _this = this;
      let curDis = this.distance;
      let lastDis = this.lastDistance;
      let dis = curDis - lastDis;
      // 移动距离换算成像素值
      let dispx = parseInt((dis / this.cmPerPx).toFixed(0));
      // 移动距离为0则返回
      if (dis <= 0 || dispx <= 0) {
        // 当移动距离不足划线一个像素单位，但角度发生变化时，依然统计角度线段
        if (dis > 0 && dispx <= 0) this.doAdjustDegree(this.degree);
        return;
      }
      this.lastDistance = curDis;
      let dir = this.doAdjustDegree(this.degree);
      let dx = 1,
        dy = 1;
      let ax, ay, dirDegree, dirGap;
      if (dir <= 90) {
        dy = -1;
        dirDegree = dir;
        dirGap = 90 - dir;
      } else if (dir <= 180) {
        dirDegree = 180 - dir;
        dirGap = dir - 90;
      } else if (dir <= 270) {
        dx = -1;
        dirDegree = dir - 180;
        dirGap = 270 - dir;
      } else {
        dx = -1;
        dy = -1;
        dirDegree = 360 - dir;
        dirGap = dir - 270;
      }
      ax = Math.sin((dirDegree * Math.PI) / 180) * dispx;
      ay = Math.cos((dirDegree * Math.PI) / 180) * dispx;

      // 当前拐角后，则判断是否指向并返回起点做闭环(目前仅支持正东南西北方向闭环，即0、90、180、270、360)
      let sl = this.statLast;
      if (
        this.startPointGap > 0 &&
        this.drawing &&
        sl &&
        this.x == sl.x &&
        this.y == sl.y &&
        sl.degree % 90 == 0
      ) {
        let xx = Math.abs(this.startPointX - this.x);
        let xy = Math.abs(this.startPointY - this.y);
        if (xx <= this.startPointGap) {
          if ((sl.degree == 0 || sl.degree == 360) && this.y > this.startPointY) {
            ctx.moveTo(this.x, this.y);
            this.x = this.startPointX;
            sl.x = this.x;
            ctx.lineTo(this.x, this.y);
          } else if (sl.degree == 180 && this.y < this.startPointY) {
            ctx.moveTo(this.x, this.y);
            this.x = this.startPointX;
            sl.x = this.x;
            ctx.lineTo(this.x, this.y);
          }
        } else if (xy <= this.startPointGap) {
          if (sl.degree == 90 && this.y < this.startPointY) {
            ctx.moveTo(this.x, this.y);
            this.y = this.startPointY;
            sl.y = this.y;
            ctx.lineTo(this.x, this.y);
          } else if (sl.degree == 270 && this.y > this.startPointY) {
            ctx.moveTo(this.x, this.y);
            this.y = this.startPointY;
            sl.y = this.y;
            ctx.lineTo(this.x, this.y);
          }
        }
      }

      let oldx = this.x;
      let oldy = this.y;

      this.x += ax * dx;
      this.y += ay * dy;

      if (this.drawing) {
        let closeDraw = false;
        // 起点闭环判断
        if (!this.drawingArc && this.startPointGap > 0 && this.stat.length >= 1 && this.statLast) {
          let gx = Math.abs(this.x - this.startPointX) <= this.startPointGap;
          let gy = Math.abs(this.y - this.startPointY) <= this.startPointGap;
          if (gx && gy) {
            this.x = this.startPointX;
            this.y = this.startPointY;

            closeDraw = true;
          }
        }

        let lwidth = this.defaultLineWidth;
        let lcolor = this.defaultLineColor;
        // 划线工具判断和处理
        for (let i = 0; i < this.toolsLine.length; i++) {
          let tl = this.toolsLine[i];
          if (tl.class == this.toolsLineActiveClass) {
            // type、width、color、gap
            if (tl.type == 'line') {
              // 主线条变化
              if (tl.width) lwidth = tl.width;
              if (tl.color) lcolor = tl.color;
            } else if (tl.type == 'lline' || tl.type == 'rline') {
              // 左侧/右侧线条
              let lgap = 3,
                color = this.defaultLineColor,
                width = this.defaultLineWidth;
              if (tl.gap) lgap = tl.gap;
              if (tl.color) color = tl.color;
              if (tl.width) width = tl.width;
              // 主线条宽度和颜色样式改变
              if (tl.mainWidth) lwidth = tl.mainWidth;
              if (tl.mainColor) lcolor = tl.mainColor;

              let q = 1;
              if ((dir >= 0 && dir <= 90) || (dir >= 270 && dir <= 360)) q = -1;
              if (tl.type == 'rline') q = q * -1;

              let gapx = 0;
              let gapy = 0;
              if (dirGap == 0) {
                gapy = lgap;
                if (dir == 270) gapy = gapy * -1;
              } else {
                gapx = lgap / Math.sin((dirGap * Math.PI) / 180);
                if (dirGap <= 30) {
                  gapx = 0;
                  gapy = lgap * q;
                  if ((tl.type == 'rline' && dir > 180) || (tl.type == 'lline' && dir < 180))
                    gapy *= -1;
                }
              }

              //console.log("dir-" + dir + ":dirGap-" + dirGap + ":gapx-" + gapx + ":gapy-" + gapy)
              this.doDrawLine(
                this.ctx,
                oldx + gapx * q,
                oldy + gapy * q,
                this.x + gapx * q,
                this.y + gapy * q,
                color,
                width
              );
            }
            // 划线工具统计
            let tlc = sl.toolsLineCur[tl.id];
            if (!tlc) {
              tlc = {
                id: tl.id,
                name: tl.name,
                x: oldx,
                y: oldy,
                dir: dir,
                dirGap: dirGap,
                dis: 0
              };
              sl.toolsLineCur[tl.id] = tlc;
            }
            // 当前线条支持上/下翻，则增加fan字段存储距离
            if (tl.fan == 1) tlc['fan'] = this.curFanVal;
            tlc['ex'] = this.x;
            tlc['ey'] = this.y;
            tlc['dis'] = tlc['dis'] + dd;
          }
        }

        // 绘制主线条
        this.doDrawLine(this.ctx, oldx, oldy, this.x, this.y, lcolor, lwidth);

        // 是否需要缩图
        if (
          this.x > this.canSize - this.windowWidth / 2 ||
          this.x < this.windowWidth / 2 ||
          this.y > this.canSize - this.windowHeight / 2 ||
          this.y < this.windowHeight / 2
        )
          this.doRedraw();

        // 弧线模式则记录所有绘画终点坐标、距离、角度等信息
        if (sl.type == 'arc') {
          sl.points.push({
            x: this.x,
            y: this.y,
            distance: this.distance,
            degree: dir
          });
        }

        if (closeDraw) {
          // 起点闭环后，结束边统计
          this.doCloseDraw();

          // 闭环图形计算面积
          let sh = this.statHis[this.statHis.length - 1];
          let area = this.doArea(sh);
          sh[0].area = area;
        }
      } else if (this.statLast) {
        // 未闭环后移动，则清空之前图形数据
        this.doCloseDraw();
      }

      if (this.drawing) {
        // 画图模式（非移动模式）时才更新图形最大尺寸数据
        if (this.x > this.maxX) this.maxX = this.x;
        if (this.x < this.minX) this.minX = this.x;
        if (this.y > this.maxY) this.maxY = this.y;
        if (this.y < this.minY) this.minY = this.y;
      }
      if (this.gensui) {
        _this.canTop -= ay * dy;
        _this.canLeft -= ax * dx;
      }

      this.meLeft = this.x - 10 - this.scrollLeftOld + this.canBorderSize / 2;
      this.meTop = this.y - 10 - this.scrollTopOld + this.canBorderSize / 2;

      // 当前移动距离显示更新
      let st = this.statLast;
      if (st) {
        // 画图模式时
        let d = parseInt(
          (this.cmPerPx * this.doCalLineLength(st.x, st.y, this.x, this.y)).toFixed(0)
        );
        this.currentDistance = d;
      } else if (!this.drawing) {
        // 移动模式时
        this.currentDistance = this.distance - this.noDrawStartDistance;
      } // 图形闭环后，清零当前距离
      else this.currentDistance = 0;
    },
    /**
			 * 角度纠偏计算函数，根据罗盘角度刻度和罗盘精确度，计算确定当前角度朝向

			 * @param {Object} degree 实际罗盘角度
			 * @param {boolean} undoStat 是否仅做角度计算，不开启线条统计计算
			 * @param {boolean} ignoreLock 是否忽略角度锁定
			 */
    doAdjustDegree(degree, undoStat, ignoreLock) {
      // 存在锁定角度则以锁定角度为准
      if (this.lockDegree != -1 && !ignoreLock) degree = this.lockDegree;
      let _this = this;
      let cd = 0,
        deviation = this.deviation,
        rcd = degree,
        markDegree = this.markDegree;
      let dd = degree - this.lastDegree;

      if (this.lastDegree != -1 && dd > -1 * deviation && dd < deviation && this.statLast) {
        if (this.statLast.type == 'line' && !this.drawingArc) return this.statLast.degree;
      }
      while (cd <= 360) {
        if (degree >= cd && degree <= cd + markDegree) {
          let g1 = degree - cd;
          let g2 = cd + markDegree - degree;
          if (g1 <= g2) {
            rcd = cd;
            break;
          } else {
            rcd = cd + markDegree;
            break;
          }
        }
        cd += markDegree;
      }
      // 360度固定为0度，避免角度差异导致线条断开
      if (rcd == 360) rcd = 0;

      // 不做统计线段标记
      if (undoStat) return rcd;

      if (this.statLast) {
        let doStat = false,
          doClear = false;
        if (this.drawing) {
          let slt = this.drawingArc ? 'arc' : 'line';
          if (
            (this.statLast.type == 'line' && this.statLast.degree != rcd) ||
            this.statLast.type != slt
          )
            doStat = true;
        } else {
          // 移动时进行统计，并且清除之前的统计状态
          doStat = true;
          doClear = true;
        }
        if (doStat) {
          this.doCloseDraw(true);

          _newStatLast(rcd);
        }
        if (doClear) {
          // 移动之后缓存之前的线段数据，并清理当前线段统计状态
          this.statHis.push(this.stat);

          this.lastDegree = -1;
          this.statLast = null;
          this.stat = [];
        }
      } else {
        if (this.drawing) {
          _newStatLast(rcd);
        }
      }
      function _newStatLast(cdegree) {
        _this.statLast = {
          type: _this.drawingArc ? 'arc' : 'line',
          degree: cdegree,
          distance: _this.distance,
          x: _this.x,
          y: _this.y,
          toolsLine: [],
          toolsFlag: [],
          toolsLineCur: {}
        };
        if (_this.statLast.type == 'arc') _this.statLast.points = [];

        _this.lastDegree = degree;
      }

      return rcd;
    },
    /**
     * 绘图标记线段长度
     *
     * @param {Object} st
     */
    doMarkLine(st) {
      // 计算相关数据
      let inf = this.doCalInfo(st, true);
      if (!inf || inf.dis == 0) return;
      let distance = inf.dis,
        x = inf.x,
        y = inf.y,
        degree = inf.degree;

      // 绘制文本需与直线平行绘制
      let rotateDegree = degree - 90;
      if (rotateDegree < 0) rotateDegree = 360 + rotateDegree;
      else if (rotateDegree > 90 && rotateDegree < 270)
        // 防止倒立数字
        rotateDegree -= 180;

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate((rotateDegree * Math.PI) / 180);

      let txt = distance + '';
      let textWidth = this.ctx.measureText(txt).width;
      this.doDrawText(
        this.ctx,
        txt,
        { x: 0 - textWidth / 2, y: 0 - 5 },
        this.markTxtSize,
        '#0000ff'
      );

      this.ctx.rotate(((360 - rotateDegree) * Math.PI) / 180);
      this.ctx.translate(0, 0);
      this.ctx.restore();
    },
    /**
     * 计算线条相关信息，包括长度、中心点坐标、角度等
     *
     * @param {Object} st
     */
    doCalInfo(st, drawArcArea) {
      let ex = this.x,
        ey = this.y,
        edistance = this.distance,
        dis = edistance - st.distance;
      if (st.ex) ex = st.ex;
      if (st.ey) ey = st.ey;
      if (st.edistance) edistance = st.edistance;
      if (st.dis) dis = st.dis;
      if (st.type == 'arc') {
        return this.doCalArcInfo(st, ex, ey, edistance, dis, drawArcArea);
      } else if (st.type == 'line') {
        return this.doCalLineInfo(st, ex, ey, edistance, dis);
      } else return null;
    },
    /**
     * 计算直线长度、中心点坐标、角度信息
     *
     * @param {Object} st
     */
    doCalLineInfo(st, ex, ey, edistance, dis) {
      // 寻找两点间的中心点
      let c = this.doCalCenterPoint(st.x, st.y, ex, ey);
      // 勾股定理，计算两点间距离
      let d = parseInt((this.cmPerPx * this.doCalLineLength(st.x, st.y, ex, ey)).toFixed(0));
      return { dis: d, x: c.x, y: c.y, degree: st.degree };
    },
    /**
     * 计算弧线长度、中心点坐标和角度、以及面积信息
     *
     * @param {Object} st
     */
    doCalArcInfo(st, ex, ey, edistance, dis, drawArcArea) {
      // 中间点时的距离
      let d = st.distance + dis / 2;
      // 查找距离中间点最近的点
      let points = st.points;
      let gap = Number.MAX_VALUE,
        cp = null;
      for (var i = 0; i < points.length; i++) {
        let g = Math.abs(points[i].distance - d);
        if (g < gap) {
          gap = g;
          cp = points[i];
        }
      }
      if (cp) {
        // 计算弧面积
        let area = this.doCalArcArea(st, ex, ey, cp, drawArcArea);
        return { dis: dis, x: cp.x, y: cp.y, degree: cp.degree, area: area };
      } else return null;
    },
    /**
     * 计算弧面积
     */
    doCalArcArea(st, ex, ey, cp, drawArcArea) {
      let x1 = st.x,
        y1 = st.y,
        x2 = ex,
        y2 = ey,
        x3 = cp.x,
        y3 = cp.y;
      // 求圆心点坐标
      let c = this.doCalArcCenterPoint(x1, y1, x2, y2, x3, y3);
      // 求半径
      let radius = this.doCalLineLength(x1, y1, c.x, c.y);
      // 求两段弧角度之和
      let a1 = this.doCalArcAngle(cp, st, c);
      let a2 = this.doCalArcAngle({ x: ex, y: ey }, cp, c);
      let al = a1 + a2;

      // 计算扇形面积S=nπR^2/360
      let area = (al * Math.PI * Math.pow(radius, 2)) / 360;
      // 计算起止点与圆心点的三角形面积
      let triArea = this.doCalTriangleArea(x1, y1, x2, y2, c.x, c.y);

      // console.log('a1:' + a1 + ';a2:' + a2 + ';al:' + al)
      // console.log('radius:' + radius + ';area:' + area + ';triArea:' + triArea)
      // 计算最终弧面积，角度小于180度则减三角面积，大于则加三角面积
      if (al < 180) area -= triArea;
      else if (al > 180) area += triArea;

      // 像素转厘米
      area = area * Math.pow(this.cmPerPx, 2);
      area = parseInt(area.toFixed(0));

      if (drawArcArea) {
        st.area = area;

        // 计算文本绘制位置点，起止点中间点到弧线中间点之间的中间点
        let cc = this.doCalCenterPoint(x1, y1, x2, y2);
        cc = this.doCalCenterPoint(x3, y3, c.x, c.y);
        this.doDrawText(this.ctx, area + '', cc, this.markTxtSize, '#fc0280', true);

        this.doDrawPoint(x1, y1, 2, '#fc0280');
        this.doDrawPoint(ex, ey, 2, '#fc0280');
        //this.doDrawPoint(cp.x, cp.y, 2, '#fc0280');
        //this.doDrawPoint(c.x, c.y, 2, '#fc0280');
        this.doDrawLine(this.ctx, x1, y1, x2, y2, '#f29b9e', 1, true);
      }

      return area;
    },
    /**
     * 计算两点之间的长度（勾股定理）
     */
    doCalLineLength(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    /**
     * 计算两个点的中心点坐标
     */
    doCalCenterPoint(x1, y1, x2, y2) {
      // 寻找两点间的中心点
      let sx = x1 > x2 ? x1 : x2;
      let sy = y1 > y2 ? y1 : y2;
      let xx = Math.abs((x2 - x1) / 2);
      let yx = Math.abs((y2 - y1) / 2);
      let x = sx - xx,
        y = sy - yx;
      return { x: x, y: y };
    },
    /**
     * 计算三角形面积（海伦公式）
     */
    doCalTriangleArea(x1, y1, x2, y2, x3, y3) {
      let d1 = this.doCalLineLength(x1, y1, x2, y2);
      let d2 = this.doCalLineLength(x2, y2, x3, y3);
      let d3 = this.doCalLineLength(x1, y1, x3, y3);
      // 根据三角形的三条边长，计算面积（海伦公式）
      let p = (d1 + d2 + d3) / 2;
      let area = Math.sqrt(p * (p - d1) * (p - d2) * (p - d3));
      return area;
    },
    /**
     * 计算两点p0和p1，与中心点c形成的角度
     */
    doCalArcAngle(p0, p1, c) {
      var p0c = Math.sqrt(Math.pow(c.x - p0.x, 2) + Math.pow(c.y - p0.y, 2)); // p0->c (b)
      var p1c = Math.sqrt(Math.pow(c.x - p1.x, 2) + Math.pow(c.y - p1.y, 2)); // p1->c (a)
      var p0p1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)); // p0->p1 (c)
      // 余弦定理
      var cosA = (p1c * p1c + p0c * p0c - p0p1 * p0p1) / (2 * p1c * p0c);
      // 返回余弦值为指定数字的角度
      let arcA = Math.acos(cosA);

      let degree = (arcA * 180) / Math.PI;

      // 画弧线
      // var startAngle = Math.atan2(p0.y - c.y, p0.x - c.x),
      //     endAngle   = Math.atan2(p1.y - c.y, p1.x - c.x);
      // console.log('startAngle:' + startAngle + ';endAngle:' + endAngle);
      // console.log('startAngle:' + startAngle*180/Math.PI + ';endAngle:' + endAngle*180/Math.PI);

      // var radius = this.doCalLineLength(p0.x, p0.y, c.x, c.y);

      // this.ctx.save();
      // this.ctx.arc(c.x, c.y, radius, startAngle, endAngle);
      // this.ctx.setStrokeStyle('#ff0000');
      // this.ctx.stroke();
      // this.ctx.draw(true);
      // this.ctx.restore();

      return degree;
    },
    /**
     * 计算三点形成的圆形中心点坐标
     */
    doCalArcCenterPoint(x1, y1, x2, y2, x3, y3) {
      var a, b;
      if (x2 == x1) a = 0;
      else a = (y2 - y1) / (x2 - x1);
      b = y1 - a * x1;

      var xMiddle = (x1 + x2) / 2;
      var yMiddle = (y1 + y2) / 2;
      var c, lastX, lastY;
      if (a != 0) {
        c = yMiddle - (-1 / a) * xMiddle;
        lastX =
          (Math.pow(x1, 2) +
            Math.pow(y1, 2) -
            Math.pow(x3, 2) -
            Math.pow(y3, 2) -
            2 * c * y1 +
            2 * c * y3) /
          (2 * (x1 - x3 - (1 / a) * (y1 - y3)));
        lastY = (-1 / a) * lastX + c;
      } else {
        lastX = c = xMiddle;
        lastY =
          (Math.pow(x1, 2) +
            Math.pow(y1, 2) -
            Math.pow(x3, 2) -
            Math.pow(y3, 2) +
            2 * lastX * (x3 - x1)) /
          (2 * (y1 - y3));
      }
      return { x: lastX, y: lastY };
    },
    /**
     * 计算多边形面积（鞋带公式，高斯面积公式）
     *
     * @param {Object} stat
     */
    doArea(stat) {
      let n = stat.length,
        area = 0.0;
      let logObj = [];
      let minx = this.canSize,
        miny = this.canSize,
        maxx = 0,
        maxy = 0;
      for (let i = 0; i < n; i++) {
        logObj.push([stat[i].x, stat[i].y, stat[i].ex, stat[i].ey]);
        if (stat[i].x < minx) minx = stat[i].x;
        if (stat[i].x > maxx) maxx = stat[i].x;
        if (stat[i].y < miny) miny = stat[i].y;
        if (stat[i].y > maxy) maxy = stat[i].y;
        let j = (i + 1) % n;
        area += stat[i].x * stat[j].y;
        area -= stat[j].x * stat[i].y;
      }
      //console.log(JSON.stringify(logObj));
      area = Math.abs(area) / 2.0;
      // 像素转厘米
      area = area * Math.pow(this.cmPerPx, 2);
      area = parseInt(area.toFixed(0));

      // 居中绘制面积文本
      this.doDrawText(
        this.ctx,
        area + '',
        { x: minx + (maxx - minx) / 2, y: miny + (maxy - miny) / 2 },
        this.markTxtSize,
        '#fc0280',
        true
      );

      return area;
    },
    doDrawLine(ctx, x1, y1, x2, y2, color, width, dash) {
      if (width) ctx.setLineWidth(width);
      if (color) ctx.setStrokeStyle(color);
      if (dash)
        // 第一个参数为线段长度、间隔距离数组，第二个参数为虚线绘制便宜长度
        ctx.setLineDash([4, 4], 0);
      else ctx.setLineDash([], 0);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.draw(true);
    },
    doDrawPoint(x, y, radius, color, clear) {
      this.ctx.save();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      if (color) this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.draw(!clear);
      this.ctx.restore();
    },
    doDrawText(ctx, txt, point, size, color, alignc) {
      txt = txt + '';
      if (size) ctx.setFontSize(size);
      if (color) ctx.fillStyle = color;
      let dx = point.x;
      if (alignc) {
        let textWidth = ctx.measureText(txt).width;
        dx -= textWidth / 2;
      }

      ctx.fillText(txt, dx, point.y);
      ctx.draw(true);
    },
    doDrawImage(ctx, img, x, y, w, h) {
      ctx.drawImage(img, x, y, w, h);
      ctx.draw(true);
    },
    /**
     * 结束当前图形绘制
     *
     * @param {boolean} closeCurStatLastOnly 是否仅关闭当前线条，不关闭当前图形
     */
    doCloseDraw(closeCurStatLastOnly) {
      let sl = this.statLast;
      sl['edistance'] = this.distance;
      sl['ex'] = this.x;
      sl['ey'] = this.y;
      sl['dis'] = this.distance - sl.distance;
      for (let i in sl.toolsLineCur) sl.toolsLine.push(sl.toolsLineCur[i]);
      delete sl.toolsLineCur;
      this.stat.push(sl);

      if (!closeCurStatLastOnly) {
        this.statHis.push(this.stat);
        this.stat = [];
        this.lastDegree = -1;
        this.statLast = null;
        this.drawClosed = true;
      }

      // 标记线段长度
      this.doMarkLine(sl);
    },
    /**
     * 生成和显示统计信息
     */
    doStatistic() {
      let data = this.doStatisticData();
      this.statisticData = data;
      this.statisticTxt = '图形数量：' + data.graphCount;

      if (data.graphs) {
        for (var i = 0; i < data.graphs.length; i++) {
          let graph = data.graphs[i];

          var fanTxt = '',
            fanArea = 0;
          // 计算上/下翻面积
          if (graph.fans) {
            fanTxt += '\n\t上/下翻线条数量：' + graph.fans.length;
            for (var j = 0; j < graph.fans.length; j++) {
              fanTxt +=
                '\n\t\t' +
                graph.fans[j].name +
                '上/下翻：' +
                graph.fans[j].fan +
                ';长度：' +
                graph.fans[j].dis;
              fanArea += graph.fans[j].fan * graph.fans[j].dis;
            }
          }

          this.statisticTxt += '\n图形' + graph.id + ':';
          if (graph.area == -1) this.statisticTxt += '\n\t面积：未闭环';
          else this.statisticTxt += '\n\t面积：' + ((fanArea + graph.area) / 10000).toFixed(2);
          if (fanArea > 0)
            this.statisticTxt += '，含上/下翻：' + (fanArea / 10000).toFixed(2) + '平米';
          this.statisticTxt += '\n\t边/角数量：' + graph.edgeCount;
          this.statisticTxt += '\n\t总边长：' + graph.edgeLength;

          for (var j = 0; j < graph.arcs.length; j++)
            this.statisticTxt +=
              '\n\t弧' + graph.arcs[j].id + '面积：' + (graph.arcs[j].area / 10000).toFixed(2);

          if (graph.lines) {
            this.statisticTxt += '\n\t线条数量：' + graph.lineCount;
            for (var j = 0; j < graph.lines; j++)
              this.statisticTxt +=
                '\n\t\t' +
                graph.lines[j].name +
                '数量：' +
                graph.lines[j].count +
                ';长度：' +
                graph.lines[j].length;
          }
          this.statisticTxt += fanTxt;
        }
      }
      if (data.lines) {
        this.statisticTxt += '\n线条数量：' + data.lineCount;
        for (var i = 0; i < data.lines.length; i++)
          this.statisticTxt +=
            '\n\t' +
            data.lines[i].name +
            '数量：' +
            data.lines[i].count +
            ';长度：' +
            data.lines[i].length;
      }
      if (data.flags) {
        this.statisticTxt += '\n标记数量：' + data.flagCount;
        for (var i = 0; i < data.flags.length; i++)
          this.statisticTxt += '\n\t' + data.flags[i].name + '数量：' + data.flags[i].count;
      }
    },
    /**
     * 生成统计信息数据，包括graphCount,lineCount,flagCount,lines[name,count,length],flags[name,count],graphs[id,area,edgeCount,edgeLength,arcs[id,area],lines[name,count,length]]
     *
     * @@return {Object} 统计信息数据结构
     */
    doStatisticData() {
      let _this = this;
      let data = {}; // graphCount,lineCount,flagCount,lines[name,count,length],flags[name,count]
      let graphCount = this.statHis.length;
      if (this.stat.length > 0) graphCount++;
      else if (this.statLast) graphCount++;
      data.graphCount = graphCount;

      let line = {}; // 线条统计(距离)
      let lineCount = {}; // 线条统计(数量)
      let lineTotal = 0;
      for (var i = 0; i < this.statHis.length; i++) {
        let stat = this.statHis[i];
        lineTotal = lineTotal + _doStat(i, stat, line, lineCount, data);
      }
      let stat = [];
      for (var i = 0; i < this.stat.length; i++) stat.push(this.stat[i]);
      if (this.statLast) stat.push(this.statLast);
      if (stat.length > 0)
        lineTotal = lineTotal + _doStat(this.statHis.length, stat, line, lineCount, data);
      // 线条统计
      if (lineTotal > 0) {
        data.lineCount = lineTotal;
        data.lines = [];
        for (var f in line) data.lines.push({ name: f, count: lineCount[f], length: line[f] });
      }
      // 标记统计
      let stf = this.statToolsFlag;
      data.toolsFlag = stf;
      if (stf.length > 0) {
        data.flagCount = stf.length;
        data.flags = [];

        let flag = {};
        for (var i = 0; i < stf.length; i++) {
          if (!flag[stf[i].name]) flag[stf[i].name] = 0;
          flag[stf[i].name] = flag[stf[i].name] + 1;
        }
        for (var f in flag) data.flags.push({ name: f, count: flag[f] });
      }

      function _doStat(i, stat, cline, clineCount, cdt) {
        if (!cdt.graphs) cdt.graphs = [];
        let lineTotal = 0,
          line = {},
          lineCount = {},
          graph = {};
        cdt.graphs.push(graph);

        graph.rawData = stat; // 原始数据保留
        graph.id = i + 1;
        let area = stat[0].area;
        if (area) graph.area = area;
        else graph.area = -1;

        graph.edgeCount = stat.length;
        let disTotal = 0,
          arcs = [];
        for (var j = 0; j < stat.length; j++) {
          let stl = stat[j];
          if (stl.type == 'arc') arcs.push(stl);
          disTotal += _this.doCalInfo(stl).dis;
          for (var m = 0; m < stl.toolsLine.length; m++) {
            let cm = stl.toolsLine[m];
            if (!line[cm.name]) line[cm.name] = 0;
            line[cm.name] = line[cm.name] + cm.dis;
            if (!lineCount[cm.name]) lineCount[cm.name] = 0;
            lineCount[cm.name] = lineCount[cm.name] + 1;
            lineTotal++;

            if (cm.fan && cm.fan > 0) {
              if (!graph.fans) graph.fans = [];
              graph.fans.push({
                name: cm.name,
                fan: cm.fan,
                dis: cm.dis
              });
            }
          }
          if (stl.toolsLineCur) {
            for (var k in stl.toolsLineCur) {
              let cm = stl.toolsLineCur[k];
              if (!line[cm.name]) line[cm.name] = 0;
              line[cm.name] = line[cm.name] + cm.dis;
              if (!lineCount[cm.name]) lineCount[cm.name] = 0;
              lineCount[cm.name] = lineCount[cm.name] + 1;
              lineTotal++;

              if (cm.fan && cm.fan > 0) {
                if (!graph.fans) graph.fans = [];
                graph.fans.push({
                  name: cm.name,
                  fan: cm.fan,
                  dis: cm.dis
                });
              }
            }
          }
        }
        graph.edgeLength = disTotal;

        graph.arcs = [];
        for (var i = 0; i < arcs.length; i++) graph.arcs.push({ id: i + 1, area: arcs[i].area });

        if (lineTotal > 0) {
          graph.lineCount = lineTotal;
          graph.lines = [];
          for (var f in line) graph.lines.push({ name: f, count: lineCount[f], length: line[f] });
        }
        for (var v in line) {
          if (!cline[v]) cline[v] = 0;
          cline[v] += line[v];
        }
        for (var v in lineCount) {
          if (!clineCount[v]) clineCount[v] = 0;
          clineCount[v] += lineCount[v];
        }
        return lineTotal;
      }
      return data;
    },
    /**
			 * 罗盘图标和当前位置指针角度转向
			
			 * @param {Object} degree 转向角度
			 */
    doTurn(degree) {
      if (degree == 0) degree = 360;
      let _this = this;
      _this.degree = degree;

      var rotate = 360 - degree;
      var area = parseInt(rotate / 90);
      var detailArea = rotate % 90;
      _this.rotate = rotate;
      _this.rotateMe = _this.doAdjustDegree(360 - rotate, true, true);
      if (area == 0) {
        _this.area = '西偏北';
        _this.detailArea = 90 - detailArea;
      } else if (area == 1) {
        _this.area = '西偏南';
        _this.detailArea = detailArea;
      } else if (area == 2) {
        _this.area = '东偏南';
        _this.detailArea = 90 - detailArea;
      } else {
        _this.area = '东偏北';
        _this.detailArea = detailArea;
      }
    },
    /**
     * fan区域uni-number-box输入值变化事件
     *
     * @param {Object} v
     */
    fanChange(v) {
      this.curFanVal = v;
    },
    /**
			 * go区域uni-number-box输入值变化事件

			 * @param {Object} v
			 */
    goChange(v) {
      this.goDistance = v;
    },
    onPopupChange(e) {
      if (e.show) this.canShow = false;
      else {
        this.canShow = true;
        this.doCurrentPosition();
      }
    },
    onDialogChange(show) {
      if (show) this.canShow = false;
      else {
        this.canShow = true;
        this.doCurrentPosition();
      }
    },
    compassStart() {
      let _this = this;
      uni.onCompassChange(res => {
        if (!_this.turnHand) _this.doTurn(parseInt(res.direction.toFixed(0)));
      });
      uni.startCompass();
      uni.showToast({
        title: '罗盘已启动',
        icon: 'success'
      });
    },
    compassStop() {
      uni.stopCompass();
    },
    bindBluePickerChange(e) {
      this.blueIndex = e.detail.value;
      this.blueConnect(this.blueDevices[this.blueIndex]);
    },
    /**
     * 开启蓝牙
     */
    doInitBlue() {
      let _this = this;
      if (this.blueOpen) {
        // 已经打开蓝牙，则关闭
        if (this.blueDeviceCur) {
          // 断开与低功耗蓝牙设备的连接
          uni.closeBLEConnection({
            deviceId: _this.blueDeviceCur.deviceId,
            success(res) {
              console.log(res);
            }
          });
        }
        this.blueStopDiscovery();
        uni.closeBluetoothAdapter();
        this.blueOpen = false;
        this.blueIndex = -1;
        this.blueDevices = [];
        this.blueDeviceCur = null;
      } else {
        uni.openBluetoothAdapter({
          success(res) {
            console.log(res);
            _this.blueOpen = true;
            uni.showToast({ title: '初始化蓝牙成功' });
            discovery();
          },
          fail(err) {
            console.log(err);
            if (err && err.errMsg.indexOf('fail already opened') != -1) {
              _this.blueOpen = true;
              uni.showToast({ title: '蓝牙已初始化' });
              discovery();
            } else {
              uni.showToast({ title: '蓝牙初始化失败' });
            }
          }
        });
      }
      // 搜索蓝牙设备
      function discovery() {
        _this.blueDevices = [];
        uni.startBluetoothDevicesDiscovery({
          //services: ['FEE7'], // 要搜索的蓝牙设备主 service 的 uuid 列表
          //interval: 0, // 上报设备的间隔。0 表示找到新设备立即上报
          success(res) {
            console.log('开始搜索蓝牙设备...');
            // 开启监听回调，找到新蓝牙设备就触发该方法
            uni.onBluetoothDeviceFound(res => {
              console.log(res);
              for (var i = 0; i < res.devices.length; i++) {
                let device = res.devices[i],
                  memo = '',
                  c = true;
                for (var v in device) {
                  if (v == 'connectable') {
                    if (!device[v]) c = false;
                  }
                }
                if (!c) continue;
                if (device.name) memo += device.name + ';';
                memo += device.deviceId + ';' + device.RSSI;
                device.memo = memo;

                // 可连接蓝牙设备名称以XLINK开头
                if (device.name) {
                  _this.blueDevices.push(device);
                  if (device.name == 'XLINK WHEEL') {
                    let idx = _this.blueDevices.length;
                    _this.blueIndex = idx - 1;
                    _this.blueConnect(_this.blueDevices[_this.blueIndex]);
                  }
                }
              }
            });
          },
          fail(err) {
            console.log('搜索蓝牙设备失败');
            console.error(err);
          }
        });
      }
    },
    /**
			 * 连接蓝牙设备并开启监听

			 * @param {Object} data
			 */
    blueConnect(data) {
      let _this = this;
      this.blueDeviceCur = null;
      uni.createBLEConnection({
        deviceId: data.deviceId,
        success(res) {
          console.log('连接成功');
          console.log(res);
          // 停止搜索
          _this.blueStopDiscovery();
          let deviceId = data.deviceId;
          uni.getBLEDeviceServices({
            deviceId: deviceId,
            success(res) {
              console.log(res);
              // 0783B03E-8535-B5A0-7140-A304D2495CB7
              let serviceId = res.services[0].uuid;
              console.log('serviceId:' + serviceId);
              uni.getBLEDeviceCharacteristics({
                deviceId: deviceId,
                serviceId: serviceId,
                success(res) {
                  console.log(res);
                  // 0783B03E-8535-B5A0-7140-A304D2495CB8
                  let characteristicId = res.characteristics[0].uuid;
                  console.log('characteristicId:' + characteristicId);
                  // 开启消息监听
                  uni.notifyBLECharacteristicValueChange({
                    deviceId: deviceId,
                    serviceId: serviceId,
                    characteristicId: characteristicId,
                    state: true,
                    success(res) {
                      console.log(res);
                      // 当前成功连接的蓝牙设备信息
                      _this.blueDeviceCur = {
                        deviceId: deviceId,
                        serviceId: serviceId,
                        characteristicId: characteristicId
                      };
                      console.log('监听中：' + JSON.stringify(_this.blueDeviceCur));
                      uni.showToast({ title: '设备连接成功' });

                      // 接受消息的方法
                      uni.onBLECharacteristicValueChange(res => {
                        // 结果
                        console.log(res);

                        // 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
                        // ArrayBuffer转16进度字符串
                        const hexArr = Array.prototype.map.call(
                          new Uint8Array(res.value),
                          function (bit) {
                            return ('00' + bit.toString(16)).slice(-2);
                          }
                        );
                        let resHex = hexArr.join('');

                        // 最后将16进制转换为ascii码，就能看到对应的结果
                        var trimedStr = resHex.trim();
                        var rawStr =
                          trimedStr.substr(0, 2).toLowerCase() === '0x'
                            ? trimedStr.substr(2)
                            : trimedStr;
                        var len = rawStr.length;
                        if (len % 2 !== 0) {
                          console.log('存在非法字符!');
                        } else {
                          var curCharCode;
                          var resultStr = [];
                          for (var i = 0; i < len; i = i + 2) {
                            curCharCode = parseInt(rawStr.substr(i, 2), 16);
                            resultStr.push(String.fromCharCode(curCharCode));
                          }
                          let result = resultStr.join('');

                          if (result && result.trim()) {
                            if (result.indexOf('f1') != -1) {
                              _this.doBtn(_this.funcF1);
                            } else if (result.indexOf('f2') != -1) {
                              _this.doBtn(_this.funcF2);
                            } else if (result.indexOf('f3') != -1) {
                              _this.doBtn(_this.funcF3);
                            } else {
                              let dist = parseFloat(result) * 100;
                              let distCur = parseFloat((dist - _this.blueDistance).toFixed(0));
                              dolog(
                                'r:' +
                                  result +
                                  ';a:' +
                                  dist.toFixed(1) +
                                  ';b:' +
                                  _this.blueDistance.toFixed(1) +
                                  ';c:' +
                                  distCur
                              );
                              if (!dist || distCur == 0 || distCur > 2000) return;
                              else if (distCur < 0) {
                                // 滚轮后退或重置的情况则重置蓝牙当前距离数据
                                _this.blueDistance = dist;
                                return;
                              }

                              let deg = _this.doAdjustDegree(_this.degree, true);
                              if (distCur > 0) {
                                dolog(
                                  deg +
                                    '度走' +
                                    distCur +
                                    'cm;ct:' +
                                    dist.toFixed(0) +
                                    ';lt:' +
                                    _this.blueDistance.toFixed(1)
                                );
                                _this.doDraw(distCur);
                                _this.blueDistance = dist;
                              }
                            }
                          }
                          function dolog(str) {
                            _this.bdata.push({
                              id: _this.bdataId,
                              v: str
                            });
                            _this.bdataId = _this.bdataId + 1;
                          }
                        }
                      });
                    },
                    fail(err) {
                      // notifyBLECharacteristicValueChange
                      console.error(err);
                      uni.showToast({ title: '设备连接失败:4' });
                    }
                  });
                },
                fail(err) {
                  // getBLEDeviceCharacteristics
                  console.error(err);
                  uni.showToast({ title: '设备连接失败:3' });
                }
              });
            },
            fail(err) {
              // getBLEDeviceServices
              console.error(err);
              uni.showToast({ title: '设备连接失败:2' });
            }
          });
        },
        fail(err) {
          // createBLEConnection
          console.error(err);
          uni.showToast({ title: '设备连接失败:1' });
        }
      });
    },
    /**
     * 停止搜索蓝牙设备
     */
    blueStopDiscovery() {
      uni.stopBluetoothDevicesDiscovery({
        success(res) {
          console.log(res);
        },
        fail(err) {
          console.error(err);
        }
      });
    },
    /**
     * 写入蓝牙设备数据
     *
     * @param {String} msg
     */
    blueSend(msg) {
      if (!this.blueDeviceCur) return;

      // 向蓝牙设备发送一个0x00的16进制数据
      const buffer = new ArrayBuffer(msg.length);
      const dataView = new DataView(buffer);
      // dataView.setUint8(0, 0)
      for (var i = 0; i < msg.length; i++) {
        dataView.setUint8(i, msg.charAt(i).charCodeAt());
      }

      uni.writeBLECharacteristicValue({
        deviceId: this.blueDeviceCur.deviceId,
        serviceId: this.blueDeviceCur.serviceId,
        characteristicId: this.blueDeviceCur.characteristicId,
        value: buffer,
        success(res) {
          console.log(res);
        },
        fail(err) {
          console.error(err);
        }
      });
    },
    /**
     * 读取蓝牙设备数据指令
     */
    blueRead() {
      if (!this.blueDeviceCur) return;
      uni.readBLECharacteristicValue({
        deviceId: this.blueDeviceCur.deviceId,
        serviceId: this.blueDeviceCur.serviceId,
        characteristicId: this.blueDeviceCur.characteristicId,
        success(res) {
          console.log('读取指令发送成功');
          console.log(res);
        },
        fail(err) {
          console.log('读取指令发送失败');
          console.error(err);
        }
      });
    },
    // 文字标记弹窗 确认/取消按钮
    noteConfirm(e) {
      if (e.detail.index == 1) {
        this.doBtn('noteSave');
      } else {
        this.doBtn('popupNoteClose');
      }
    },
    // 上/下翻距离 确认/取消按钮
    fanConfirm(e) {
      this.doBtn('fanShow');
    },
    // 指定前进距离弹窗 确认/取消按钮
    goConfirm(e) {
      if (e.detail.index == 1) {
        this.doBtn('gogogo');
      } else {
        this.doBtn('goShow');
      }
    },
    // 模拟手机转向确认
    turnConfirm(e) {
      this.doBtn(e.detail.item.value);
    }
  }
};
</script>

<style>
.container {
  overflow: hidden;
}
canvas {
  position: absolute;
  border: 4px solid #c8eda4;
  background: #fff;
}
button {
  font-size: 20rpx;
}
.m-compassbg {
  width: 100rpx;
  height: 100rpx;
}
.compassStyle {
  text-align: center;
  font-size: 24rpx;
}
#fullImage {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  width: 200rpx;
  height: 300rpx;
  border: 4rpx solid #ebedf0;
  border-radius: 32rpx;
  padding: 4rpx;
  box-sizing: border-box;
}
#meImage {
  position: fixed;
  display: flex;
}
#meImage > text {
  margin-left: 6rpx;
  color: #fd8008;
}
.turnRegion {
  right: 0px;
  top: 232rpx;
  position: fixed;
  display: flex;
}
.turnRegion button {
  /* font-size: 16rpx; */
  padding: 2rpx 20rpx;
  margin: 0 4rpx;
}
.toolsLineRegion button.act {
  color: red !important;
  border-color: red !important;
}
.popupStatistic textarea {
  font-size: 24rpx;
  background: #d1f9cb;
  width: 100vw;
  height: calc(100vh - 500rpx);
}
.popupStatistic button {
  margin: 10rpx;
}
.popupNote .popup-content {
  padding: 20rpx;
}
.popupNote input {
  margin-bottom: 20rpx;
}
.goRegion {
  right: 0px;
  top: 620rpx;
  position: fixed;
  display: flex;
}
.goRegion uni-number-box {
  border: 1px solid #1aad19;
}
.goRegion button {
  padding: 0rpx 20rpx;
  margin: 0 2rpx;
}
.blueRegion {
  right: 0px;
  top: 700rpx;
  position: fixed;
  display: flex;
}
.curPositionRegion {
  right: 0px;
  top: 770rpx;
  position: fixed;
  display: flex;
  width: 310rpx;
  flex-wrap: wrap;
}
.sidebar {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 20rpx;
  top: 340rpx;
  border-radius: 32rpx;
  border: 4rpx solid #ebedf0;
  padding-bottom: 20rpx;
  background: #fff;
}
.sidebar .toolImage {
  margin: 10px 6px 0px 6px;
}
.toolsBottom {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 40rpx;
  right: 0;
}
.toolsBottom > view {
  position: relative;
}
.toolsBottom-left {
  display: flex;
}
.toolsBottom-left > view:first-child {
  margin-right: 12px;
}
.toolsBottom-right {
  width: 100px;
}
.toolsLine {
  position: absolute;
  top: -357rpx;
}
.toolsLine .toolImage {
  margin-bottom: 20rpx;
}
.more {
  position: absolute;
  top: -597rpx;
}
.more .toolImage {
  margin-bottom: 20rpx;
}
.debug {
  position: absolute;
  top: -840rpx;
}
.debug .toolImage {
  margin-bottom: 20rpx;
}
.toolImage {
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  color: #106cff;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 4rpx solid #106cff;
  background: #fff;
  padding: 5px;
  box-sizing: border-box;
}
.toolText {
  padding: 2px;
}
.toolDivider {
  margin: 10px 10px 0 10px;
  border-top: 1px solid #ebedf0;
}
.toolBtnActive {
  background: #106cff;
  color: #fff;
}
.mp-half-screen-dialog-statistic {
  overflow-y: auto;
}
.mp-half-screen-dialog-statistic .weui-half-screen-dialog__bd {
  padding-bottom: 0;
  min-height: 400px;
}
.mp-half-screen-dialog-statistic .weui-half-screen-dialog__ft {
  display: none;
}
.mp-half-screen-dialog-turn .weui-half-screen-dialog__desc {
  text-align: center;
}
.mp-half-screen-dialog-turn .weui-half-screen-dialog__tips {
  text-align: center;
}
.dialogConfirm {
  background: #106cff !important;
}
.dialogConfirm::after {
  border: none;
}
.dialogCancel::after {
  border: none;
}
.uni-number-box {
  display: flex;
  justify-content: center;
}
.uni-numbox-btns {
  padding: 0 12px !important;
}
.uni-numbox__value {
  height: 36px !important;
}
</style>
