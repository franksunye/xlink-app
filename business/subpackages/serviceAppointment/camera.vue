<template>
  <view class="camera-view" @click.capture="track">
    <camera
      :device-position="parameter['device-position']"
      :flash="parameter.flash"
      @error="error"
      class="camera"
    ></camera>
    <view class="photos">
      <view v-for="(item, i) in photos" :key="i" class="photo-view">
        <van-image
          width="80"
          height="80"
          fit="cover"
          class="image-view"
          image-class="image-item"
          :src="item.url"
        ></van-image>
        <van-icon
          name="cross"
          size="14px"
          custom-class="image-delete"
          @click="deletePhoto(item.url, i)"
          :data-event="{ id: '-EqADEZl2m' }"
        />
      </view>
    </view>
    <!-- <view class="c-w-1 c-flex c-flex-center"> -->
    <van-tabs
      v-if="label != 'default'"
      :active="subLabel"
      color="transparent"
      title-active-color="#ffd700"
      title-inactive-color="#fff"
      class="c-flex c-flex-center"
      custom-class="tabs-subLabel"
      tab-class="c-bg-transparent"
      :ellipsis="false"
      @change="subLabelChange"
      :data-event="{ id: 'V4pcHP_lac', capture: false }"
    >
      <van-tab
        v-for="(item, i) in options[label]"
        :key="i"
        :title="item.name"
        :name="item.value"
      ></van-tab>
    </van-tabs>
    <!-- </view>  -->
    <van-tabs
      :active="label"
      color="transparent"
      title-active-color="#ffd700"
      title-inactive-color="#fff"
      custom-class="tabs-label"
      tab-class="c-bg-black"
      @change="labelChange"
      :data-event="{ id: 'xbe7lWlxtv', capture: false }"
    >
      <van-tab
        v-for="(item, i) in options.albumLabel"
        :key="i"
        :title="item.name"
        :name="item.value"
      ></van-tab>
    </van-tabs>
    <view class="buttons">
      <view class="button-side" @click="flashClick" :data-event="{ id: '-_jR0WkCfd' }">
        <view class="button-icon-view" :data-event="{ id: '-_jR0WkCfd' }">
          <image
            :style="parameter.flash == 'auto' ? 'margin-left:8px' : ''"
            class="button-icon"
            mode="aspectFill"
            :src="`https://pub.fsgo365.cn/flash-${parameter.flash}.png`"
            :data-event="{ id: '-_jR0WkCfd' }"
          ></image>
        </view>
        <text class="button-text" :data-event="{ id: '-_jR0WkCfd' }">
          {{ parameter.flash == 'auto' ? '自动' : parameter.flash == 'on' ? '打开' : '关闭' }}
        </text>
      </view>
      <view class="button-middle" @click="takePhoto" :data-event="{ id: 'JOV3PvsId2' }">
        <view class="button-icon-view" :data-event="{ id: 'JOV3PvsId2' }">
          <van-icon
            name="photograph"
            color="#202020"
            size="40px"
            custom-class="button-icon"
            :data-event="{ id: 'JOV3PvsId2' }"
          />
        </view>
        <text class="button-text" :data-event="{ id: 'JOV3PvsId2' }">拍照</text>
      </view>
      <view class="button-side" @click="devicePositionClick" :data-event="{ id: '2KJ25isU35' }">
        <view class="button-icon-view" :data-event="{ id: '2KJ25isU35' }">
          <image
            class="button-icon"
            mode="aspectFill"
            src="https://pub.fsgo365.cn/camera-flip.png"
            :data-event="{ id: '2KJ25isU35' }"
          ></image>
        </view>
        <text class="button-text" :data-event="{ id: '2KJ25isU35' }">
          {{ parameter['device-position'] == 'back' ? '后置' : '前置' }}
        </text>
      </view>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      bizId: '',
      photos: [],
      label: 'default', // 一级标签 表单名
      subLabel: 'default', // 二级标签 字段名
      options: {
        codecfg_albumLabel: { codeId: 'albumLabel' },
        albumLabel: []
      },
      parameter: {
        flash: 'auto', // 闪光灯 auto:自动 on:打开 off:关闭 torch:常亮
        'device-position': 'back' // 摄像头朝向 front:前置 back:后置
      },
      alertTimes: 0 // 提示次数
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.bizId = param.bizId; // 工单id
    if (param.serviceType && param.serviceType != '11' && param.serviceType != '12') {
      this.options.codecfg_albumLabel = { codeId: 'albumLabel' + param.serviceType };
    }
    common.osg.codeoption(() => {
      let colNames = [];
      // 赋值子标签组空数组
      this.options.albumLabel.map(item => {
        let colName = item.value;
        colNames.push(colName);
        this.$set(this.options, colName, []);
      });
      // 查询所有子标签
      common.osg.ajax(
        'biz/extField/query',
        {
          _all: '1',
          'in:colName|array#and': colNames.join(),
          'is:type|string#and': 'file',
          sortField: 'order',
          sortOrder: 'asc',
          'is:state|integer#and': 1
        },
        res => {
          // 将所有子标签分组保存
          res.data.map(item => {
            this.options[item.colName].push({ name: item.nameDisp, value: item.name });
          });
          // 插入一级默认标签
          this.options.albumLabel.unshift({ name: '默认', value: 'default' });
          // 没有子标签或大于1个子标签的，插入默认子标签
          colNames.map(colName => {
            if (this.options[colName].length != 1) {
              this.options[colName].unshift({ name: '默认', value: 'default' });
            }
          });
        },
        { noload: true }
      );
    });
  },
  onUnload() {
    if (this.photos.length > 0) {
      common.osg.md({ act: 'photograph', photosCount: this.photos.length });
    }
  },
  methods: {
    labelChange(e) {
      this.label = e.detail.name;
      // 默认赋值子标签
      if (this.label == 'default') {
        this.subLabel = '';
        return;
      }
      let subLabelData = this.options[this.label];
      if (subLabelData.length == 1) {
        this.subLabel = subLabelData[0].value;
      } else {
        this.subLabel = 'default';
      }
    },
    subLabelChange(e) {
      this.subLabel = e.detail.name;
    },
    takePhoto() {
      const ctx = wx.createCameraContext();
      ctx.takePhoto({
        quality: 'high',
        success: res => {
          // 上传拍照的图片到七牛云
          common.osg.uploadFile(res.tempImagePath, url => {
            // 保存照片
            this.savePhoto(
              this.label == 'default' ? 'default' : this.label + '-' + this.subLabel,
              url
            );
          });
          this.doSaveImageToAlbum(res.tempImagePath);
        }
      });
    },
    error(e) {
      console.log(e.detail);
    },
    savePhoto(label, url) {
      common.osg.ajax(
        'biz/album/album',
        {
          data: JSON.stringify({
            bizType: 'serviceAppointment', // 业务对象
            bizId: this.bizId, // 业务单据id
            labelName: label, // 标签名称
            handle: 'add', // add:新增照片
            photos: [url]
          })
        },
        res => {
          this.photos.push({ id: res._id, label, url });
        },
        { noload: true }
      );
    },
    deletePhoto(url, index) {
      common.osg.ajax(
        'biz/album/album',
        {
          data: JSON.stringify({
            bizType: 'serviceAppointment', // 业务对象
            bizId: this.bizId, // 业务单据id
            labelName: '', // 标签名称
            handle: 'del', // add:新增照片
            photos: [url]
          })
        },
        res => {
          this.photos.splice(index, 1);
        },
        { noload: true }
      );
    },
    // 闪光灯切换
    flashClick() {
      if (this.parameter.flash == 'auto') {
        this.parameter.flash = 'on';
      } else if (this.parameter.flash == 'on') {
        this.parameter.flash = 'off';
      } else if (this.parameter.flash == 'off') {
        this.parameter.flash = 'auto';
      }
    },
    // 摄像头朝向切换
    devicePositionClick() {
      if (this.parameter['device-position'] == 'back') {
        this.parameter['device-position'] = 'front';
      } else {
        this.parameter['device-position'] = 'back';
      }
    },
    // 保存图片到手机相册
    doSaveImageToAlbum(path) {
      // 向用户发起授权请求
      uni.authorize({
        scope: 'scope.writePhotosAlbum',
        success: () => {
          // 已授权，保存到手机相册
          uni.saveImageToPhotosAlbum({
            filePath: path
          });
        },
        fail: () => {
          // 拒绝授权，获取当前设置
          uni.getSetting({
            success: result => {
              if (!result.authSetting['scope.writePhotosAlbum']) {
                // 每次进入页面只提示1次
                if (this.alertTimes == 0) {
                  this.alertTimes = 1;
                } else {
                  return;
                }
                uni.showModal({
                  content: '如需保存到手机相册，请点击确定按钮，打开“添加到相册”。',
                  success: res => {
                    if (res.confirm) {
                      uni.openSetting({
                        success: result => {
                          if (result.authSetting['scope.writePhotosAlbum']) {
                            // 已授权，保存到手机相册
                            uni.saveImageToPhotosAlbum({
                              filePath: path
                            });
                          }
                        }
                      });
                    }
                  }
                });
              } else {
                // 已授权，保存到手机相册
                uni.saveImageToPhotosAlbum({
                  filePath: path
                });
              }
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" slot="coped">
.camera-view {
  background-color: #030303;
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .camera {
    width: 100vw;
    flex: 1;
  }
  .photos {
    position: absolute;
    bottom: 250px;
    display: flex;
    width: 100vw;
    padding-right: 10px;
    box-sizing: border-box;
    overflow-x: auto;
    .photo-view {
      display: flex;
      position: relative;
      height: 80px;
      .image-view {
        display: flex;
        margin-left: 10px;
        .image-item {
          border-radius: 3px;
          overflow: hidden;
        }
      }
      .image-delete {
        position: absolute;
        top: 0;
        right: 0;
        padding: 4px;
        color: #fff;
        background: #d6000f;
        border-radius: 50%;
      }
    }
  }
  .tabs-subLabel {
    max-width: calc(100vw - 20px);
    margin: 0 10px;
    position: absolute !important;
    bottom: 198px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 22px;
    display: flex;
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .van-tabs__scroll {
      background-color: transparent;
      .van-tabs__nav {
        height: 44px;
        padding: 0 3px;
        .van-tab {
          white-space: nowrap;
          padding: 0;
          display: flex;
          align-items: center;
          > view {
            padding: 0 8px;
            margin: 5px 5px;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 15px;
            height: 30px;
            line-height: 30px;
            display: inline-flex;
            font-size: 14px;
          }
        }
        .van-tab--active {
          > view {
            font-size: 16px;
          }
        }
      }
    }
  }
  .tabs-label {
    width: 250px;
    margin: 0 auto;
    .van-tabs__scroll {
      background-color: transparent;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px 0 30px;
    .button-middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      .button-icon-view {
        background-color: #fff;
      }
      > view {
        width: 70px;
        height: 70px;
      }
    }
    .button-side {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
      .button-icon-view {
        background-color: #202020;
      }
      > view {
        width: 40px;
        height: 40px;
        .button-icon {
          width: 30px;
          height: 30px;
        }
      }
    }
    .button-icon-view {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      .button-icon {
        color: #fff;
      }
    }
    .button-text {
      font-size: 12px;
      margin-top: 5px;
      color: #fff;
    }
  }
}
</style>
