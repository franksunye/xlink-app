<template>
  <view class="body" @click.capture="track">
    <scroll-view class="list" scroll-y :min-drag-distance="0" enable-passive>
      <block v-for="(i, idx) in dataList" :key="idx">
        <view class="checklist-container">
          <view class="">
            <view class="button-54" v-if="i[0] && i[0][0]">
              <text style="color: black">{{ Datadisplay('partsOne', i[0][0].part) }}</text>
            </view>
          </view>

          <block v-for="(item, index) in i" :key="index">
            <view class="card" v-if="item && item[0]">
              <view>
                <!-- <text style="color: black">{{ Datadisplay('checkType', item[0].type) }}</text> -->
                <van-tag plain size="large" type="primary">
                  {{ Datadisplay('checkType', item[0].type) }}
                </van-tag>
              </view>
              <view
                style="display: flex; margin: 10px 0px"
                v-for="(j, k) in item"
                :key="k"
                :id="`ID${j._id}`"
              >
                <view class="title" style="position: relative">
                  <text style="margin-right: 12rpx">{{ k + 1 >= 10 ? k + 1 : `0${k + 1}` }}、</text>
                  <text
                    v-if="j.required == '1'"
                    style="position: absolute; right: 4rpx; top: 0px; color: red"
                  >
                    *
                  </text>
                </view>
                <van-radio-group :value="j.validation.check" style="flex: 1">
                  <view class="title">
                    {{ j.name }}
                  </view>
                  <view
                    class="title"
                    v-if="j.required == '1' && j.validation.check === null && errorShow"
                    style="color: red"
                  >
                    必填项
                  </view>
                  <van-cell-group>
                    <van-cell
                      :border="false"
                      v-for="option in ButtonType"
                      :key="option.value"
                      :title="option.label"
                      clickable
                      title-class="cell-title"
                      custom-style="margin-right:0px"
                      @click="radioChange(j.validation, 'check', option.value)"
                    >
                      <van-radio
                        :disabled="!isEditAllowed || j.validation.reason.trim() !== ''"
                        icon-size="40rpx"
                        slot="icon"
                        :name="option.value"
                      />
                    </van-cell>

                    <view v-if="j.validation.check === 0">
                      <view class="flexBox">
                        <view class="label" style="position: relative">
                          <text class="required_star">*</text>
                          <text class="">不合格图片</text>
                        </view>
                        <view class="cell-uploader">
                          <van-uploader
                            :deletable="isEditAllowed"
                            multiple
                            :max-count="3"
                            :file-list="j.validation.beforeFileList"
                            @after-read="afterRead($event, j.validation.beforeFileList)"
                            @delete="deleteFile($event, j.validation.beforeFileList)"
                          />
                        </view>
                      </view>
                      <view class="negate" style="position: relative">
                        <text class="required_star">*</text>
                        <van-field
                          :value="j.validation.reason"
                          label="不合格原因"
                          custom-class="cell-custom"
                          label-class="cell-label"
                          type="textarea"
                          title-width="180rpx"
                          autosize
                          :border="false"
                          @input="fieldChange($event, j.validation, 'reason')"
                        />
                      </view>
                      <view class="negate">
                        <van-field
                          :value="j.validation.norm"
                          label="整改要求"
                          custom-class="cell-custom"
                          label-class="cell-label"
                          type="textarea"
                          autosize
                          title-width="180rpx"
                          :border="false"
                          @input="fieldChange($event, j.validation, 'norm')"
                        />
                      </view>
                      <!-- #ifdef MP-WEIXIN -->
                      <view
                        @click="rectificationTime(j.validation)"
                        :data-event="{ id: 'nN7VE1Lyel' }"
                      >
                        <van-field
                          :value="j.validation.rectifyTime"
                          label="整改时间"
                          readonly
                          is-link
                          custom-class="cell-custom"
                          label-class="cell-label"
                          title-width="180rpx"
                          :border="false"
                          placeholder="请选择整改时间范围"
                          placeholder-style="font-size: 26rpx;"
                        />
                      </view>
                      <!-- #endif -->

                      <!-- #ifdef APP-PLUS -->
                      <view style="display: flex" @click="rectificationTime(j.validation)">
                        <view class="label">整改时间</view>
                        <view
                          style="
                            flex: 1;
                            font-size: 28rpx;
                            border-bottom: 1rpx solid #ccc;
                            margin-bottom: 2px;
                          "
                        >
                          {{ j.validation.rectifyTime }}
                        </view>
                      </view>
                      <!-- #endif -->
                      <view class="flexBox">
                        <view class="label">整改后图片</view>
                        <view class="cell-uploader">
                          <van-uploader
                            :deletable="isEditAllowed"
                            multiple
                            :max-count="3"
                            :file-list="j.validation.afterfileList"
                            @after-read="afterRead($event, j.validation.afterfileList, true)"
                            @delete="deleteFile($event, j.validation.afterfileList)"
                          />
                        </view>
                      </view>

                      <view class="flexBox" v-if="j.validation.afterfileList.length > 0">
                        <view class="label" style="position: relative">
                          <text class="required_star">*</text>
                          <view>整改后结果</view>
                        </view>
                        <van-radio-group
                          :value="j.validation.reformCheck"
                          direction="horizontal"
                          @change="radioChange(j.validation, 'reformCheck', $event.detail)"
                        >
                          <van-radio :name="1">合格</van-radio>
                          <van-radio :name="0">不合格</van-radio>
                        </van-radio-group>
                      </view>
                    </view>
                  </van-cell-group>
                </van-radio-group>
              </view>
            </view>
          </block>
        </view>
      </block>
      <canvas
        class="myCanvas"
        canvas-id="myCanvas"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
      ></canvas>
    </scroll-view>

    <view class="button-bottom" v-if="isEditAllowed">
      <van-button
        @click="submit(0)"
        icon="edit"
        block
        class="c-button-group-item c-m-r-10"
        :data-event="{ id: 'tgy0LSPlhR' }"
      >
        保存
      </van-button>
      <van-button
        @click="submit(1)"
        type="info"
        icon="completed-o"
        block
        class="c-button-group-item c-m-l-20"
        :data-event="{ id: 'CbpD3D0_HN' }"
      >
        提交
      </van-button>
    </view>

    <!-- 日期选择 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-calendar
      :show="dateShow"
      type="range"
      allow-same-day
      @close="this.dateShow = false"
      @confirm="handleCalendarConfirm"
    />
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <uni-datetime-picker
      :border="false"
      ref="datetimePicker"
      :showSlot="false"
      type="daterange"
      placeholder=" "
      @change="handleCalendarConfirm($event)"
    ></uni-datetime-picker>
    <!-- #endif -->
  </view>
</template>

<script>
var common = require('../../resources/js/common.js');
const app = getApp();
export default {
  data() {
    return {
      dataObj: {}, //根据核查单Id 查询出来的初始数据
      dataList: [], //对数据进行分组处理
      dataJSON: [], //修改后的数据
      ButtonType: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      options: {
        cascadeCode_partsOne: { codeId: 'partsOne' },
        cascadeCode_checkType: { codeId: 'checkType' }
        // codecfg_parts: { codeId: 'parts' }
      },
      contractId: null, //合同Id
      checkId: null, //核查单的Id
      dateShow: false, //是否显示核查单
      selectedDateObj: {}, //要选择日期的对象
      errorShow: false, //是否显示错误提醒
      isEditAllowed: true, //是否允许保存提交
      canvasWidth: 0,
      canvasHeight: 0
    };
  },
  onLoad(e) {
    console.log('页面跳转的时候拿到参数', e);
    //合同ID  维修一级部位
    const { _id, leakagesite_copy: part, checkId } = e;
    this.contractId = _id; //合同Id
    this.checkId = checkId; //核查单的Id
    console.log('合同Id', this.contractId);
    console.log('核查单的Id', this.checkId);

    common.osg.init(this, {}, app);
    common.osg.codeoption(() => {
      if (checkId) {
        this.showDataByChecklistId(checkId);
      } else {
        this.getData(part);
      }
    });
  },
  onShow() {},
  methods: {
    //单元格点击勾选 事件
    radioChange(item, name, newCheck) {
      //如果填写不合格原因 就不允许它修改
      if (!this.isEditAllowed || (item.reason.trim() !== '' && name !== 'reformCheck')) return;
      item[name] = newCheck;
    },
    //单元格输入框 改变事件
    fieldChange(e, item, name) {
      item[name] = e.detail;
    },
    //查询接口
    getData(part) {
      let params = {
        'is:state|integer#and': 1,
        sortField: 'partOrder',
        sortOrder: 'asc',
        'in:part|array#and': part
      };

      common.osg.ajax('/biz/extForm/queryByColName/check', params, res => {
        // 检查是否存在 validation 字段
        this.dataList = this.processDataList(res.data);
        console.log('排序后的数据', this.dataList);
      });
    },
    //根据核查单Id 进行数据反显
    showDataByChecklistId(id) {
      let params = {
        'is:state|integer#and': 1,
        sortField: 'partOrder',
        sortOrder: 'asc',
        'is:_id|string#and': id,
        notFilterBelongTo: '1',
        notFilterOrgId: '1'
      };
      return new Promise((resolve, reject) => {
        common.osg.ajax('/basic/checklist/query', params, ({ data }) => {
          // 根据核查单Id 查询出来的数据
          this.dataObj = data[0];
          console.log('根据核查单Id 查询出来的数据', this.dataObj);
          let user = wx.getStorageSync('user');
          this.dataList = this.processDataList(data[0].inspectionItemList);
          console.log('当前登陆人', this.dataObj.createUserName === user.name);
          this.isEditAllowed = this.dataObj.createUserName === user.name;
          console.log(this.isEditAllowed);

          resolve(true);
        });
      });
    },
    //数据按照
    processDataList(MsgList) {
      //清空原来的数组
      this.dataJSON = [];
      const newDataList = MsgList.reduce((acc, item) => {
        if (!item.validation) {
          // 如果没有 validation 字段，则添加该字段
          item.validation = {
            check: null,
            reason: '',
            norm: '',
            reformCheck: null,
            afterfileList: [],
            beforeFileList: [],
            rectifyTime: ''
          };
        }
        this.dataJSON.push(item);
        // 第一层按 'part' 分组
        const partGroup = acc[item.part] || [];
        // 第二层按 'type' 分组
        const typeGroup = partGroup[item.type] || [];
        // 将当前项目添加到对应的类型组中
        typeGroup.push(item);
        // 更新部分组中的类型组
        partGroup[item.type] = typeGroup;
        // 更新累加器中的部分组
        acc[item.part] = partGroup;
        return acc;
      }, {});

      return newDataList;
    },
    //图片上传前
    async afterRead(e, item, Watermark = false) {
      const file = e.detail.file;
      if (Array.isArray(file)) {
        for (const [index, i] of file.entries()) {
          // 提取图片临时路径
          let photoUrl = i.url;
          let lastDotIndex = photoUrl.lastIndexOf('.');
          // 获取文件后缀名
          const extension = photoUrl.slice(lastDotIndex + 1);
          console.log('文件后缀名', extension);
          if (Watermark) {
            // 上传文件
            await this.watermark(photoUrl, extension, item, index);
          } else {
            this.uploadFile(photoUrl, extension, item);
          }
        }
      }
    },
    watermark(photoUrl, extension, item, index) {
      return new Promise((resolve, reject) => {
        let _that = this;
        // 获取图片详细信息
        wx.getImageInfo({
          src: photoUrl,
          success: res => {
            const { width, height } = res;
            const ctx = wx.createCanvasContext(`myCanvas`); // 确保这里是当前的 canvasId
            const aspectRatio = parseFloat((height / width).toFixed(2)); // 计算宽高比
            const viewportWidth = wx.getSystemInfoSync().windowWidth;
            // 设置 Canvas 大小
            _that.canvasWidth = viewportWidth;
            _that.canvasHeight = parseFloat((viewportWidth * aspectRatio).toFixed(2));

            // 设置文字样式
            const text = _that.getCurrentDateTime();
            const fontSize = 10;
            ctx.setFontSize(fontSize);
            ctx.setFillStyle('red'); // 设置水印颜色
            // 计算文本宽度
            const textWidth = ctx.measureText(text).width;
            // 设置文本在右下角的位置
            const x = _that.canvasWidth - textWidth - 10; // X坐标，距右边缘20px
            const y = _that.canvasHeight - 10; // Y坐标，距底边缘20px

            // 清空 Canvas
            // ctx.clearRect(0, 0, _that.canvasWidth, _that.canvasHeight);
            // 绘制画布图片
            ctx.drawImage(photoUrl, 0, 0, width, height, 0, 0, viewportWidth, _that.canvasHeight);

            // 在图片上添加文字
            ctx.fillText(text, x, y);
            ctx.draw(false, () => {
              // 生成处理后的图片并获取临时路径
              setTimeout(() => {
                wx.canvasToTempFilePath({
                  canvasId: `myCanvas`,
                  success: res => {
                    console.log('处理后的图片路径:', res.tempFilePath);
                    this.uploadFile(res.tempFilePath, extension, item);
                    resolve(); // 返回处理后的路径
                  },
                  fail: err => {
                    console.error('生成处理后的图片失败:', err);
                    reject(err); // 拒绝 Promise
                  }
                });
              }, 200);

              console.log('当前图片的宽度和高度', _that.canvasWidth, _that.canvasHeight); // 获取 Canvas 高度);
            });
          },
          fail: err => {
            console.error('获取图片信息失败:', err);
            reject(err); // 拒绝 Promise
          }
        });
      });
    },
    uploadFile(filePath, extension, item) {
      common.osg.ajax('back/super/file/upToken.do', { fileName: '12345.' + extension }, data => {
        wx.uploadFile({
          url: 'https://up-z1.qiniup.com',
          filePath, // 本地文件路径
          name: 'file', // 上传文件的名称
          formData: data, // 附带的额外数据
          success: res => {
            if (res.statusCode === 200) {
              const data = JSON.parse(res.data);
              let imgURL = 'https://pub.fsgo365.cn/' + data.key + '!convert.jpg';
              item.push({ url: imgURL, imageUploadTime: Date.now() });
            } else {
              console.error('上传失败，请检查网络或服务器配置');
            }
          },
          fail: err => {
            console.error('上传失败：', err);
          }
        });
      });
    },
    //删除图片的时候
    deleteFile(e, item) {
      const file = e.detail.file;
      console.log(e, item);
      const index = item.findIndex(i => i.url === file.url);
      // 如果找到，使用 splice 删除该项目
      if (index !== -1) {
        item.splice(index, 1);
      }
    },
    //保存提交按钮
    submit(type) {
      //提交
      if (type === 1) {
        //是否显示必填提醒
        this.errorShow = true;
        // 检查数组中是否存在 required == 1 且 check 为 false 的对象，返回不符合条件的对象
        const invalidRequiredCheckItem = this.dataJSON.find(
          item => item.required == '1' && item.validation.check === null
        );
        // 检查选择“否”时的 不合格原因 和 不合格图片是否上传，返回不符合条件的对象
        const invalidChoiceCheckItem = this.dataJSON.find(item => {
          const { check, beforeFileList, reason, afterfileList, reformCheck } = item.validation; // 抽取 validation 字段

          let isAfterFileListValid = afterfileList.length > 0 && reformCheck === null;
          console.log(isAfterFileListValid);
          return check === 0 && (!beforeFileList.length || !reason.trim() || isAfterFileListValid);
        });

        // 输出不符合条件的对象
        if (invalidRequiredCheckItem) {
          console.log('发现不符合条件的必填项:', invalidRequiredCheckItem);
          this.scrollToElementById(invalidRequiredCheckItem._id);
          wx.showToast({
            title: '请确保所有必填项已正确填写。',
            icon: 'none', // 使用 'none' 表示只有文字提示
            duration: 2000 // 提示框持续时间
          });
          return;
        } else if (invalidChoiceCheckItem) {
          console.log('发现选择“否”时的不合格项:', invalidChoiceCheckItem);
          this.scrollToElementById(invalidChoiceCheckItem._id);
          wx.showToast({
            title: '请确保所有必填项已正确填写。',
            icon: 'none', // 使用 'none' 表示只有文字提示
            duration: 2000 // 提示框持续时间
          });
          return;
        }
      }
      this.processAndSaveForm(type);
    },
    //跳转到指定区域
    scrollToElementById(elementId) {
      const query = wx.createSelectorQuery();

      query
        .select(`#ID${elementId}`) // 选择目标元素
        .boundingClientRect(); // 获取目标元素的位置信息

      query
        .selectViewport() // 选择视口
        .scrollOffset(); // 获取视口的滚动位置

      query.exec(res => {
        const rect = res[0]; // 获取目标元素的矩形信息
        const viewport = res[1]; // 获取视口的滚动偏移信息

        if (rect && viewport) {
          // 计算目标位置相对于整个页面的滚动距离
          const targetScrollTop = rect.top + viewport.scrollTop;
          console.log(targetScrollTop);

          // 滚动到目标位置
          wx.pageScrollTo({
            scrollTop: targetScrollTop,
            duration: 300
          });
        } else {
          console.error('无法找到指定元素或视口');
        }
      });
    },
    //返显施工部位函数
    Datadisplay(type, msg) {
      let newVlaue = common.osg.formatCascade(type, msg);
      return newVlaue;
    },
    //保存提交表单接口
    processAndSaveForm(type) {
      let params;
      //空对象
      if (Object.keys(this.dataObj).length === 0) {
        params = {
          contractId: this.contractId, //合同Id
          inspectionItemList: this.dataJSON, //检查项目
          _id: this.checkId //核查单的id 是否生成新的核查单
        };
      } else {
        params = this.dataObj;
      }
      params.formStatus = type; //0是保存   1是提交

      console.log('保存提交表dataObj', this.dataObj);
      console.log('保存提交表单接口params', params);

      common.osg.ajax(
        '/basic/checklist/upsert',
        { data: JSON.stringify(params) },
        async ({ entity }) => {
          // const { inspectionItemList, _id } = entity;
          const { _id } = entity;
          //保存后生成核查单的id
          this.checkId = _id;
          // this.dataList = this.processDataList(inspectionItemList);
          //根据核查单进行数据反显
          await this.showDataByChecklistId(this.checkId);
          wx.showToast({
            title: type === 0 ? '保存成功' : '提交成功', // 提示的内容
            icon: 'success', // 图标类型
            duration: 2000 // 提示的持续时间，单位是毫秒
          });
        }
      );
    },
    // handleformatDate(inputDate) {
    //   let [year, month, day] = inputDate.split('-');
    //   return `${parseInt(month, 10)}月${day.padStart(2, '0')}日`;
    // },
    //日期的选择
    handleCalendarConfirm(e) {
      console.log(333333, e);
      // #ifdef APP-PLUS
      const [Start, End] = e;
      this.selectedDateObj.rectifyTime = `${this.formatDate(Start)} —— ${this.formatDate(End)}`;
      console.log(this.selectedDateObj.rectifyTime);
      // #endif

      // #ifdef MP-WEIXIN
      console.log('小程序执行代码 是否触发');
      const [start, end] = e.detail;
      this.selectedDateObj.rectifyTime = `${this.formatDate(start)} —— ${this.formatDate(end)}`;
      // #endif

      this.dateShow = false;
    },
    //时间处理函数
    formatDate(date) {
      // #ifdef APP-PLUS
      let [year, month, day] = date.split('-');
      return `${parseInt(month, 10)}月${day.padStart(2, '0')}日`;
      // #endif

      //小程序代码
      // #ifdef MP-WEIXIN
      date = new Date(date);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
      // #endif
    },
    //输出格式: YYYY-MM-DD HH:mm:ss
    getCurrentDateTime() {
      const now = new Date();
      const year = now.getFullYear(); // 获取年份
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 获取月份（注意：月份从0开始，所以要加1）
      const day = String(now.getDate()).padStart(2, '0'); // 获取日期
      const hours = String(now.getHours()).padStart(2, '0'); // 获取小时
      const minutes = String(now.getMinutes()).padStart(2, '0'); // 获取分钟
      const seconds = String(now.getSeconds()).padStart(2, '0'); // 获取秒数
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 拼接成需要的格式
    },
    //选择时间的时候 拿到当前要操作的对象
    rectificationTime(obj) {
      // #ifdef APP-PLUS
      this.$refs.datetimePicker.show();
      // #endif

      this.selectedDateObj = obj;
      this.dateShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
  flex-direction: column;
  .list {
    flex: 1;
    padding-bottom: 10px;
    background-color: #fff;
    .checklist-container {
      width: 90vw;
      margin: 0px auto;
      padding: 40rpx 10rpx;
      .button-54 {
        min-width: 100px;
        width: fit-content;
        max-width: 50vw;
        height: 35px;
        margin: 0 auto;
        text-align: center;
        font-family: 'Open Sans', sans-serif;
        font-size: 34rpx;
        letter-spacing: 7px;
        color: #1989fa;
        border: 3px solid #1989fa;
        box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px,
          5px 5px 0px 0px;
      }
      .card {
        padding: 20px;
        box-sizing: border-box;
        margin-top: 20px;
        border-radius: 10px;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
        .title {
          font-size: 28rpx;
          font-weight: bold;
        }
        .flexBox {
          position: relative;
          display: flex;
          align-items: center;
        }
      }
    }
    .myCanvas {
      position: absolute; /* 绝对定位 */
      left: -9999px; /* 将元素移到屏幕左侧外部 */
    }
  }

  .button-bottom {
    display: flex;
    padding: 10rpx 20rpx 30rpx;
    position: sticky;
    bottom: 0px;
    left: 0px;
    background-color: #fff;
    z-index: 10;
  }
}
.required_star {
  position: absolute;
  left: -20rpx;
  top: 50%;
  transform: translateY(-50%);
  color: red;
}

// #ifdef APP-PLUS
::v-deep .van-cell__title {
  flex: none;
  min-width: 170rpx;
}
// #endif

::v-deep .van-hairline--top-bottom:after {
  border: none;
}
::v-deep .cell-label,
::v-deep .cell-title,
.label {
  font-size: 28rpx;
  min-width: 170rpx;
}
::v-deep .negate .van-cell__value {
  border-bottom: 1rpx solid #ccc;
}
::v-deep .van-cell {
  padding: 14rpx 0px;
}
::v-deep .cell-custom > view {
  margin: 0px !important;
  font-size: 28rpx;
}
::v-deep .card .van-uploader__preview {
  width: 150rpx !important;
  height: 150rpx !important;
}
</style>
