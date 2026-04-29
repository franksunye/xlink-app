<template>
  <view class="EditShowTemplate" @click.capture="track">
    <template v-if="replaceTemplateIndex !== -1">
      <view v-for="(item, index) in Data" :key="index">
        <!-- 外层盒子 -->
        <view class="RepeatedComponentBox">
          <view v-for="(i, inx) in item" :key="inx">
            <template
              v-if="i.type === 'text' && (item.editable !== undefined ? item.editable : true)"
            >
              <view class="displayCenter">
                <text
                  class="van-cell__title"
                  :style="{
                    maxWidth: `${widthValue}`,
                    minWidth: `${widthValue}`,
                    margin: '0px 12px'
                  }"
                >
                  <text>{{ i.label ? i.label : '文字' }}</text>
                  <text style="color: crimson">*</text>
                </text>
                <view
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: auto;
                  "
                >
                  <!-- <view style="width: 80%"> -->
                  <textarea
                    style="width: 80%"
                    maxlength="150"
                    class="textarea"
                    :value="i.txt"
                    :disabled="i.editable !== undefined ? !i.editable : false"
                    confirm-type="done"
                    placeholder="请输入文本"
                    @input="TextareaChange($event, i)"
                    auto-height
                  ></textarea>
                  <!-- </view> -->
                </view>
              </view>
            </template>

            <template
              v-if="i.type === 'image' && (item.editable !== undefined ? item.editable : true)"
            >
              <view class="displayCenter">
                <text
                  class="van-cell__title"
                  :style="{
                    maxWidth: `${widthValue}`,
                    minWidth: `${widthValue}`,
                    margin: '0px 12px'
                  }"
                >
                  图片
                  <text style="color: crimson">*</text>
                </text>
                <view
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                  "
                >
                  <!-- :file-list="formData[`fileList${inx}`]" -->
                  <van-uploader
                    multiple
                    accept="image"
                    :file-list="i.formData"
                    data-field="formData"
                    @after-read="afterRead($event, i, inx)"
                    @delete="deleteFile($event, i, inx)"
                    :max-count="1"
                  />
                </view>
              </view>
            </template>
          </view>

          <view class="iconClass">
            <van-icon
              @click="editFlag(item, index, 1)"
              style="color: black; margin: 0px 5px"
              name="https://pub.fsgo365.cn/icon-copy.png"
              size="22px"
              :data-event="{ id: 'LFzkW67qBh' }"
            />
            <van-icon
              @click="editFlag(item, index, 0)"
              style="margin: 0px 5px"
              slot="icon"
              name="https://pub.fsgo365.cn/icon-delete.png"
              size="22px"
              :data-event="{ id: '8win4ujjiq' }"
            />
          </view>
        </view>
      </view>
    </template>
    <template v-if="replaceTemplateIndex === -1">
      <view v-for="(item, index) in Data" :key="index">
        <template
          v-if="item.type === 'text' && (item.editable !== undefined ? item.editable : true)"
        >
          <view class="displayCenter">
            <text
              class="van-cell__title"
              :style="{ maxWidth: `${widthValue}`, minWidth: `${widthValue}`, margin: '0px 12px' }"
            >
              <text>{{ item.label ? item.label : '文字' }}</text>
              <text style="color: crimson">*</text>
            </text>
            <!-- <view
							class=""
							style="display: flex; justify-content: space-between; align-items: center; width: 100%"
						> -->
            <!-- <view style="width: 100%"> -->
            <textarea
              class="textarea"
              :value="item.txt"
              :disabled="item.editable !== undefined ? !item.editable : false"
              confirm-type="done"
              auto-height
              maxlength="150"
              @input="TextareaChange($event, item)"
            ></textarea>
            <!-- </view> -->
            <!-- </view> -->
          </view>
        </template>
        <template v-if="item.type === 'image'">
          <view class="displayCenter" v-if="item.editable !== undefined ? item.editable : true">
            <text
              class="van-cell__title"
              :style="{
                maxWidth: `${widthValue}`,
                minWidth: `${widthValue}`,
                margin: '0px 12px'
              }"
            >
              图片
              <text style="color: crimson">*</text>
            </text>
            <view
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              "
            >
              <van-uploader
                multiple
                accept="image"
                :file-list="item.formData"
                data-field="formData"
                @after-read="afterRead($event, item, index)"
                @delete="deleteFile($event, item, index)"
                :max-count="1"
              />
            </view>
          </view>
        </template>
      </view>
    </template>
    <view v-if="Data.length !== 0" class="c-flex c-flex-center c-m-20">
      <van-button
        :loading="loading"
        loading-text="处理中..."
        icon="star-o"
        @click="Submit()"
        type="primary"
        :data-event="{ id: 'qzdcsvcMRl' }"
      >
        保存修改
      </van-button>
    </view>

    <van-toast id="van-toast" />
  </view>
</template>

<script>
var common = require('../../resources/js/common.js');
import Toast from '../../wxcomponents/vant/toast/toast';

export default {
  data() {
    return {
      Data: [],
      widthValue: '4.7em',
      TemplateId: '',
      TemplateIndex: null,
      lastPageUrl: null,
      replaceTemplateIndex: null, //要替换的组件索引,
      // formData: {},
      lastPageUrl: '', //旧的海报地址
      loading: false //是否开启加载效果
    };
  },
  onLoad({ index, TemplateId, imageURL }) {
    this.TemplateIndex = index; //索引
    this.lastPageUrl = imageURL; //图片地址
    common.osg.ajax('/biz/showTemplate/queryById', { id: TemplateId }, res => {
      this.TemplateJSON = res;
      console.log(res);
      //根据上个页面拿到的索引 进行渲染页面
      let Arr = res.def[this.TemplateIndex].def;
      // 检查是不是循环组件 如果找到了就返回索引 没有就返回-1
      this.replaceTemplateIndex = Arr.findIndex(item => item.type === 'dup');

      if (this.replaceTemplateIndex != -1) {
        this.Data = Arr[this.replaceTemplateIndex].def;
      } else {
        this.Data = Arr;
      }
      this.Data.forEach((item, i) => {
        if (Array.isArray(item)) {
          item.forEach((items, itemIndex) => {
            if (items.type === 'image' && items.src !== '') {
              this.$set(items, 'formData', [{ url: common.osg.ProcessPicturePath(items.src) }]);
            }
          });
        } else {
          if (item.type === 'image' && item.src !== '') {
            this.$set(item, 'formData', [{ url: common.osg.ProcessPicturePath(item.src) }]);
          }
        }
      });
    });
  },
  onUnload() {
    // uni.$emit('id', { Pageid: this.TemplateId, lastPageUrl: this.lastPageUrl });
    // 移除监听事件
    uni.$off('id');
  },
  methods: {
    //输入框状态改变事件
    TextareaChange(e, item) {
      item.txt = e.detail.value;
    },
    //操作重复组件的JSON文件
    editFlag(item, index, type) {
      if (type === 1) {
        //插入数据
        this.Data.splice(index, 0, item);
      } else if (type === 0) {
        //删除数据
        this.Data.splice(index, 1);
      }
      this.Data = JSON.parse(JSON.stringify(this.Data));
    },
    //上传图片
    afterRead(e, item, index) {
      if (!item.formData) {
        this.$set(item, 'formData', []);
      }
      if (
        e.detail.file.url ||
        e.detail.file.path ||
        e.detail.file.tempFilePath ||
        e.detail.file.name
      ) {
        if (e.detail.file.url) {
          var strs = e.detail.file.url.split('.');
        } else if (e.detail.file.path) {
          var strs = e.detail.file.path.split('.');
        } else if (e.detail.file.tempFilePath) {
          var strs = e.detail.file.tempFilePath.split('.');
        } else {
          var strs = e.detail.file.name.split('.');
        }
      } else {
        var strs = e.detail.file[0] && e.detail.file[0].url.split('.');
      }
      let suffix = strs[strs.length - 1];
      let filePath;
      if (Array.isArray(e.detail.file)) {
        filePath = e.detail.file[0].thumb || e.detail.file[0].path || e.detail.file[0].tempFilePath;
      } else {
        filePath = e.detail.file.thumb || e.detail.file.path || e.detail.file.tempFilePath;
      }
      common.osg.ajax('back/super/file/upToken.do', { fileName: '12345.' + suffix }, data => {
        wx.uploadFile({
          url: 'https://up-z1.qiniup.com',
          filePath, // 本地文件路径
          name: 'file', // 上传文件的名称
          formData: data, // 附带的额外数据
          success: res => {
            // 上传成功后的处理逻辑
            if (res.statusCode === 200) {
              // 文件上传成功
              const data = JSON.parse(res.data);
              console.log('上传成功，返回的数据为：', data);
              let imgURL = 'https://pub.fsgo365.cn/' + data.key;
              item.src = imgURL + '?imageView2/2/w/400/format/jpg';
              // 在这里做上传成功后的操作，如显示上传成功信息、更新页面等
              this.$set(item, 'formData', [{ url: imgURL }]);
            } else {
              // 文件上传失败
              console.error('上传失败，请检查网络或服务器配置');
              // 在这里处理上传失败的情况，可以给出提示信息或重试等
            }
          },
          fail: err => {
            // 上传失败的处理逻辑
            console.error('上传失败：', err);
            // 在这里处理上传失败的情况，可以给出提示信息或重试等
          }
        });
      });
    },
    //删除图片
    deleteFile(e, item, index) {
      // let deleteFileList = this.formData[`fileList${index}`];
      // deleteFileList.splice(e.detail.index, 1);
      delete item.formData;
      console.log(item);
      item.src = '';
      this.Data = JSON.parse(JSON.stringify(this.Data));
    },

    //处理要给后端的数据 删除数组中不需要的key键
    removeKeysFromObjects(arr, keysToRemove) {
      //要删除的键
      let KeysToRemove = [
        'Checkout',
        'belongTo',
        'collectionName',
        'createTime',
        'createUser',
        'createUserName',
        'value',
        'orgId',
        'orgName',
        'updateUserName',
        'updateUser',
        'updateTime',
        'tenantId',
        'etags',
        'exts',
        'state',
        'formData'
      ];
      if (keysToRemove) {
        KeysToRemove = keysToRemove;
      }
      return arr.map(obj => {
        KeysToRemove.forEach(key => delete obj[key]);
        return obj;
      });
    },
    //以下是用于检查数组中的每个对象是否有空键的方法
    checkEmptyKeysInObjects(array) {
      for (let obj of array) {
        for (let key in obj) {
          if (key === 'flag') {
            delete obj[key]; // 删除 'flag' 属性
          } else if (
            obj[key] === null ||
            obj[key] === undefined ||
            obj[key].toString().trim() === ''
          ) {
            console.log(obj[key], key);

            return { Type: true, Key: key };
          }
        }
      }
      return { Type: false };
    },
    //点击保存按钮
    Submit() {
      const { Type, Key } = this.checkEmptyKeysInObjects(this.Data);
      //第一步效验所有单元格都有值
      if (Type) {
        console.log(Key);
        let Title = Key === 'src' ? '图片填写有误' : '文本填写有误';
        return common.osg.toast(Title, 'none');
      }
      //第二部开启加载效果
      this.loading = true;

      let user = wx.getStorageSync('user'); //当前用户的ID
      //如果type是0，保存时将typeId改为当前登录人userId，将type改为2，删除_id。
      if (this.TemplateJSON && this.TemplateJSON.type === 0) {
        this.$set(this.TemplateJSON, `typeId`, user._id);
        this.TemplateJSON.type = 2;
        this.TemplateJSON.orgId = user.orgId;
        delete this.TemplateJSON._id; // 删除_id 属性
      }

      if (
        this.TemplateJSON &&
        this.TemplateJSON.type === 2 &&
        this.TemplateJSON.typeId === user._id
      ) {
        //是循环组件
        if (this.replaceTemplateIndex !== -1) {
          this.TemplateJSON.def[this.TemplateIndex].def[this.replaceTemplateIndex].def = this.Data;
        } else {
          this.TemplateJSON.def[this.TemplateIndex].def = this.Data;
        }
        let newResObj = this.removeKeysFromObjects([this.TemplateJSON]);
        console.log('修改后', newResObj);
        common.osg.ajax(
          '/biz/showTemplate/upsert',
          { showTemplateStr: JSON.stringify(newResObj[0]) },
          ({ data }) => {
            this.TemplateId = data;
            this.loading = false;
            Toast.loading({
              message: '加载中...',
              forbidClick: true,
              duration: 0
            });
            uni.$emit('id', { Pageid: data, lastPageUrl: this.lastPageUrl });
            return;
          }
        );
      }
    }
  }
};
</script>

<style lang="scss">
.EditShowTemplate {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  background-color: white;
}
/* 如果是重复组件 需要给点边距 */
.RepeatedComponentBox {
  width: 95vw;
  margin: 10px auto;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  .iconClass {
    position: absolute;
    z-index: 20;
    width: auto;
    right: 0;
    bottom: 0;
  }
}
.textarea {
  min-height: 60rpx;
  max-height: 150px;
  width: 70%;
  display: inline-block;
  line-height: 60rpx;
  border-bottom: 1px solid #ccc;
  // #ifdef APP-PLUS
  overflow: auto;
  // #endif
}

.displayCenter {
  display: flex;
  align-items: center;
  padding: 10px 0px;
  min-height: 120rpx;
}
</style>
