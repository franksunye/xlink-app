<template>
  <view
    style="display: flex; flex-direction: column; height: 100vh; overflow: hidden"
    @click.capture="track"
  >
    <view style="flex: 1; overflow-y: auto">
      <view class="form" v-for="(item, index) in fields" :key="index">
        <!-- 父亲盒子 -->
        <view class="form-item">
          <view class="item-card">
            <!-- 左 边 区 域 -->
            <view class="form-item-left">
              <text v-if="item.required" class="errorColor">*</text>
              <text class="">{{ item.title }}</text>
            </view>

            <!-- 右 边 区 域 -->
            <view class="form-item-right">
              <view class="">
                <!-- 图片 -->
                <view v-if="item.type == 'image'" class="flex-reverse">
                  <van-uploader
                    key="avatar"
                    style="display: flex"
                    multiple
                    accept="image"
                    :file-list="form.avatar == '' ? [] : [{ url: form.avatar }]"
                    @after-read="afterRead($event, 'avatar')"
                    @delete="deleteFile($event, 'avatar')"
                    :max-count="1"
                  />
                </view>
                <!-- 下拉 -->
                <view v-else-if="item.type == 'select'">
                  <view class="flex-reverse" @click="cellclick(item)">
                    <van-icon name="arrow" />
                    <text class="">
                      {{ format(item.options, form[item.key], item.type) }}
                    </text>
                  </view>
                </view>
                <!-- 多选下拉 -->
                <view v-else-if="item.type == 'multiple'">
                  <view class="flex-reverse" @click="cellclick(item)">
                    <van-icon name="arrow" />
                    <text class="">
                      {{ format(item.options, form[item.key], item.type) || '' }}
                    </text>
                  </view>
                </view>
                <!-- 输入框 -->
                <view v-else-if="item.type == 'text'">
                  <input
                    :value="form[item.key]"
                    type="text"
                    @input="onChangeName($event, item.key)"
                  />
                </view>
                <!-- 多行文本输入框 -->
                <view class="" v-else-if="item.type == 'textarea'">
                  <textarea
                    class="textarea"
                    :class="{ textareaFocus: isFocused }"
                    :value="form.memo"
                    confirm-type="done"
                    @input="onInputMemo($event, 'memo')"
                    @focus="onFocus"
                    @blur="onBlur"
                  ></textarea>
                </view>
                <!-- 省市区 -->
                <!-- <view
                class=""
                v-else-if="item.type == 'cascader'" -->
                <view class="flex-reverse" v-else-if="item.type == 'cascader'">
                  <van-icon name="arrow" @click="dataPicker()" />

                  <uni-data-picker
                    popup-title="请选择所在地区"
                    key="uniAreaPickerarea"
                    ref="uniAreaPickerarea"
                    :value="form.area"
                    :localdata="area"
                    :map="{
                      text: 'label',
                      value: 'value'
                    }"
                    @change="areaConfirm($event, item.key)"
                    :clear-icon="false"
                  ></uni-data-picker>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <van-action-sheet
        :close-on-click-action="cellField !== 'abilitys'"
        :show="pickerShow"
        :actions="actions"
        @close="onClose"
        @select="onSelect"
        @cancel="onClose"
        :cancel-text="cellField === 'abilitys' ? '确定' : '取消'"
      />
    </view>
    <view class="button-bottom">
      <van-button
        round
        block
        color="#ff6900"
        @click="upsertWorkers"
        :data-event="{ id: 'j4i5nK7MlH' }"
      >
        确 定
      </van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
import IdentityCodeValid from '../../resources/utils/checkIdent';

export default {
  data() {
    return {
      // 下拉 select 图片 image  options 关联字典项
      //form 表单
      form: {
        avatar: '', //照片
        name: '', //姓名
        sex: '1', //性别
        age: '', //年龄
        status: '0', //工作状态
        state: '0', //认证状态
        phone: '', //联系方式
        otherPhone: '', //其他联系方式
        abilitys: [], //工人技能
        area: [], //省市区
        address: '', //详细地址
        tags: [], //标签
        salary: '', //期望日薪
        memo: '', //简介
        iDCardNumber: '', //身份证号
        gpsPoint: {} //经纬度
      },
      fields: [
        {
          title: '照片',
          key: 'avatar',
          type: 'image',
          required: false
        },
        { title: '姓名', key: 'name', type: 'text', required: true },
        {
          title: '性别',
          key: 'sex',
          type: 'select',
          options: 'SEX',
          required: true
        },
        {
          title: '年龄',
          key: 'age',
          type: 'text',
          required: false
        },
        {
          title: '工作状态',
          key: 'status',
          type: 'select',
          required: false,
          options: 'workerStatus'
        },
        {
          title: '认证状态',
          key: 'state',
          type: 'select',
          required: false,
          options: 'workerState'
        },
        {
          title: '身份证号',
          key: 'iDCardNumber',
          type: 'text',
          required: true
        }, // 身份证号校验
        {
          title: '联系方式',
          key: 'phone',
          type: 'text',
          required: true,
          validation: 'phoneNumber'
        }, // 手机号校验
        {
          title: '其他联系方式',
          key: 'otherPhone',
          type: 'text',
          required: false
        },
        {
          title: '工人技能',
          key: 'abilitys',
          type: 'multiple',
          required: false,
          multiple: true,
          options: 'workerAbilitys'
        },
        {
          title: '省市区',
          key: 'area',
          type: 'cascader',
          required: false
        }, // 动态地区数据
        { title: '详细地址', key: 'address', type: 'text', required: false },
        { title: '标签', key: 'tags', type: 'select', required: false, options: 'userTag' },
        { title: '期望日薪', key: 'salary', type: 'text', required: false },
        { title: '简介', key: 'memo', type: 'textarea', required: false }
      ], //表单字段项
      //字典项目
      options: {
        codecfg_workerAbilitys: { codeId: 'workerAbilitys' },
        codecfg_workerStatus: { codeId: 'workerStatus' },
        codecfg_workerState: { codeId: 'workerState' },
        codecfg_userTag: { codeId: 'userTag' },
        codecfg_SEX: { codeId: 'SEX' }
      },
      isFocused: false, // 用于跟踪文本区域的聚焦状态
      pickerShow: false, //表单选择器
      actions: null, //表单选择器 配置项 姓名 技能 证书
      cellField: '', //单元格点击的那个字段名称
      area: [],
      userId: '' //编辑用户ID,
    };
  },
  onLoad(e) {
    common.osg.init(this, e, app);
    //请求字典项
    this.SearchDictionary().then(() => {
      if (e.userId) {
        this.userId = e.userId;
        this.getUsers(e.userId);
      }
    });
    // 调用联机选择器 级联数据
    common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
      this.area = res.areaList;
    });
  },
  methods: {
    getUsers(userId) {
      common.osg.ajax(
        'biz/labour/query',
        {
          _all: '1',
          'in:state|array-integer#and': '0,1',
          sortField: 'createTime',
          sortOrder: 'asc',
          'is:_id|string#and': userId
        },
        res => {
          // console.log('编辑数据对象', res);
          console.log('编辑数据对象', res.data[0]);
          // 遍历 responseData 对象，将字段赋值给 formData
          Object.keys(this.form).forEach(key => {
            if (key in res.data[0]) {
              this.form[key] = res.data[0][key];
            }
          });
          console.log('回显数据', this.form);
        }
      );
    },
    //请求字典项接口
    SearchDictionary() {
      return new Promise(resolve => {
        //查询字典项目
        common.osg.codeoption(() => {
          resolve();
        });
      });
    },
    //简介编辑事件
    onInputMemo(e) {
      this.form.memo = e.detail.value;
    },
    // 聚焦时设置为 true
    onFocus() {
      this.isFocused = true;
    },
    // 失去焦点时设置为 false
    onBlur() {
      this.isFocused = false;
    },
    // 选择头像
    onChooseAvatar(e) {
      let filePath = e.detail.avatarUrl;
      common.osg.ajax(
        'back/super/file/upToken.do',
        {
          fileName: filePath.split('/')[filePath.split('/').length - 1]
        },
        data => {
          let that = this;
          wx.uploadFile({
            url: 'https://up-z1.qiniup.com',
            filePath: e.detail.avatarUrl,
            name: 'file',
            formData: data,
            success(res) {
              that.form.avatar = common.osg.downloadUrl + JSON.parse(res.data).key;
            },
            fail() {
              common.osg.toast('上传失败', 'error');
            }
          });
        },
        {
          noload: true
        }
      );
    },
    //弹出框配置项
    cellclick(item) {
      switch (item.key) {
        case 'sex':
          this.actions = this.options.SEX;
          break;
        case 'status':
          this.actions = this.options.workerStatus;
          break;
        case 'state':
          this.actions = this.options.workerState;
          break;
        case 'abilitys':
          this.options.workerAbilitys.forEach(i => {
            // 2. 检查 value 是否在 form[cellField] 中
            if (this.form.abilitys.includes(i.value)) {
              // 3. 为匹配的对象添加 color 属性
              i.color = 'red'; // 你可以自定义颜色或其他属性
            }
          });
          console.log('工人技能', this.options.workerAbilitys);

          this.actions = [...this.options.workerAbilitys];
          break;
        case 'tags':
          this.actions = this.options.userTag;
          break;
        default:
      }
      this.pickerShow = true;
      this.cellField = item.key;
    },
    //关闭选择器
    onClose() {
      this.pickerShow = false;
      if (this.cellField == 'abilitys') {
        this.form[this.cellField] = this.actions
          .filter(item => item.color != undefined)
          .map(k => k.value);
        console.log('点击了确定', this.form[this.cellField]);
      }
    },
    //点击后显示
    onSelect(e) {
      // 工人背景支持多选 加深背景
      if (this.cellField == 'abilitys') {
        for (let item of this.actions) {
          if (item.name === e.detail.name) {
            if ('color' in item) {
              delete item.color;
            } else {
              item.color = 'red'; // 这里可以根据您的需求设置具体的颜色值
            }
          }
        }
        console.log('点击了工人技能', this.actions);

        this.actions = [...this.actions];
      } else if (this.cellField == 'tags') {
        this.form[this.cellField] = [e.detail.value];
      } else {
        this.form[this.cellField] = e.detail.value;
      }
    },
    //反显数据
    format(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (!val || val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    //输入框赋值
    onChangeName(e, FieldName) {
      this.form[FieldName] = e.detail.value;
    },
    //提交表单
    async upsertWorkers() {
      common.osg.md({ act: 'workerSubmitForm' });
      if (this.validateRequiredFields()) {
        console.log('表单填写', this.form);
        // 提交表单的代码
      } else {
        console.log('请填写所有必填项');
      }
    },
    //提交表单效验规则
    validateRequiredFields() {
      let errorMessage;
      // 使用 some() 检查是否有必填项未填写
      const errors = this.fields
        .filter(field => field.required) // 只筛选出必填项
        .map(field => ({
          key: field.key,
          title: field.title,
          value: this.form[field.key]
        }))
        .filter(field => !field.value || (Array.isArray(field.value) && field.value.length == 0)) // 判断是否为空
        .map(field => field.title); // 获取未填写的字段名

      if (errors.length > 0) {
        errorMessage = `提交失败，${errors[0]}没有填写`;
        return common.osg.toast(errorMessage, 'none');
      }

      // 效验手机号
      const phonePattern = /^1[3-9]\d{9}$/;
      if (!phonePattern.test(this.form.phone)) {
        errorMessage = `联系方式格式错误`;
        return common.osg.toast(errorMessage, 'none');
      }
      // 效验身份证
      if (!IdentityCodeValid(this.form.iDCardNumber.toUpperCase())) {
        errorMessage = '身份证号格式错误';
        return common.osg.toast(errorMessage, 'none');
      }
      this.SaveForm(this.form);
    },
    //保存表单
    SaveForm(params) {
      if (this.userId) {
        params._id = this.userId;
      }
      common.osg.ajax('biz/labour/upsert', { data: JSON.stringify(params) }, res => {
        this.userId = res.data._id;
        this.getUsers(this.userId);
        common.osg.toast('操作成功', 'success');
      });
    },
    //
    areaConfirm(e, key) {
      let values = e.detail.values || e.detail.value;
      let areaVal = [];
      let name = [];
      console.log(11122, values);

      if (values.length >= 1) {
        areaVal.push(values[0].code || values[0].value);
        name += values[0].text;
      }
      if (values.length >= 2) {
        areaVal.push(values[1].code || values[1].value);
        name += values[1].text;
      }
      if (values.length >= 3) {
        areaVal.push(values[2].code || values[2].value);
        name += values[2].text;
      }
      this.form[key] = areaVal; //adcode的数组
      console.log(name);
      // this.$refs.uniAreaPickerarea[0].hide();
      common.osg.geo(name, res => {
        this.form.gpsPoint = {
          latitude: res.location.split(',')[1],
          longitude: res.location.split(',')[0]
        };
      });
    },
    //打开省市区 选择器
    dataPicker() {
      this.$refs.uniAreaPickerarea[0].show();
    },
    //上传图片
    afterRead(e) {
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
              this.form.avatar = imgURL + '?imageView2/2/w/400';
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
    deleteFile() {
      this.form.avatar = '';
    }
  }
};
</script>

<style lang="scss">
.Flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex-reverse {
  display: flex;
  flex-direction: row-reverse;

  // 修改 uni 省市区选择器的样式
  .input-value-border {
    border: 0px;
    .arrow-area {
      display: none;
    }
  }
}

.form {
  width: 100vw;
  border-radius: 10px;
  background-color: #fff;
  font-size: 14px;
  border-radius: 10px;

  .form-item {
    padding: 0px 30rpx;
    .item-card {
      padding: 30rpx 0px;
      display: flex;
      align-items: center;
      height: auto;
      min-height: 24px;
      justify-content: space-between;
      border-bottom: 2rpx solid #e6e6e6;
      .form-item-left {
        width: fit-content;
        min-width: 100px;
      }
      .form-item-right {
        flex: 1;
        .form-item-image {
          width: 200rpx;
          height: 200rpx;
          position: relative;
        }
        input {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
.textarea {
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  min-height: 200px;
  border: 2px solid #ccc;
  box-sizing: border-box;
  text-align: left;
}
.textareaFocus {
  border: 2px solid #4177f6;
}
.errorColor {
  color: var(--field-error-message-color, #ee0a24);
}
.button-bottom {
  width: calc(100vw - 30px);
  padding: 0 15px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
