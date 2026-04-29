<template>
  <view class="recharge" @click.capture="track">
    <van-cell-group inset :border="false">
      <van-cell
        title="修链对公账户"
        value="110943084710501"
        value-class="c-text-left c-color-value"
      >
        <van-icon
          slot="right-icon"
          name="orders-o"
          class="c-m-l-20 c-blue"
          @click="copy('110943084710501')"
          :data-event="{ id: 'PlRLICAnaF' }"
        />
      </van-cell>
      <van-cell
        title="开户行"
        value="招商银行股份有限公司北京建外大街支行"
        value-class="c-text-left c-color-value"
      >
        <van-icon
          slot="right-icon"
          name="orders-o"
          class="c-m-l-20 c-blue"
          @click="copy('招商银行股份有限公司北京建外大街支行')"
          :data-event="{ id: 'SOf9AXXucq' }"
        />
      </van-cell>
      <van-cell
        title="公司名称"
        value="北京修链科技有限公司"
        value-class="c-text-left c-color-value"
        :border="false"
      >
        <van-icon
          slot="right-icon"
          name="orders-o"
          class="c-m-l-20 c-blue"
          @click="copy('北京修链科技有限公司')"
          :data-event="{ id: 'OJTfHEadwJ' }"
        />
      </van-cell>
    </van-cell-group>
    <van-cell-group inset :border="false">
      <block v-for="(f, i) in fields" :key="i">
        <block v-if="f.type == 'checkbox' || f.multiple">
          <van-cell :title="f.nameDisp" :required="f.required == '1'">
            <van-checkbox-group
              :value="formData[f.name]"
              :data-key="f.name"
              @change="onFieldChange"
              class="c-checkbox-group"
            >
              <van-checkbox
                v-for="(item, j) in options[f.valueOption]"
                :key="j"
                :name="item.value"
                shape="square"
                label-class="c-text-left"
              >
                {{ item.name }}
              </van-checkbox>
            </van-checkbox-group>
          </van-cell>
        </block>
        <block v-else-if="f.type == 'select'">
          <van-field
            :label="f.nameDisp"
            :value="codelabel(f.valueOption, formData[f.name])"
            :placeholder="f.frontEndConfig.placeholder || '请选择'"
            :required="f.required == '1' ? true : false"
            :data-key="f.name"
            readonly
            is-link
            @click-input="onClick(f)"
          />
        </block>
        <block v-else-if="f.type == 'file'">
          <view class="c-cell-view c-flex c-flex-between c-item-center c-relative">
            <view class="c-flex c-item-center">
              <text class="c-required" v-if="f.required == '1'">*</text>
              <text>{{ f.nameDisp }}</text>
            </view>
            <text class="c-cell_value" v-if="formData[f.name]">
              （{{ formData[f.name].length || 0 }} / {{ f.frontEndConfig.limit || '不限' }}）
            </text>
          </view>
          <view class="c-cell-view">
            <view v-if="f.frontEndConfig.fileType == 'video'" class="c-flex">
              <video
                v-for="(item, i) in formData[f.name]"
                :key="i"
                style="width: 90px; height: 90px; border-radius: 10px; margin-right: 16px"
                :src="item.url"
                :data-url="item.url"
                :show-play-btn="false"
                :show-center-play-btn="false"
                :show-fullscreen-btn="false"
                @click="openVideo"
                :data-event="{ id: 'JQ3eM2o-zg', capture: false }"
              ></video>
            </view>
            <van-uploader
              v-else
              style="display: flex"
              multiple
              :accept="f.frontEndConfig.fileType || 'image'"
              :upload-text="f.frontEndConfig ? f.frontEndConfig.uploadText || '' : ''"
              :file-list="formData[f.name]"
              @after-read="afterRead($event, f)"
              :data-extField="extField"
              :data-field="f.name"
              @delete="deleteFile($event, f)"
              :max-count="
                f.frontEndConfig.limit || f.frontEndConfig.limit == 0 ? f.frontEndConfig.limit : 20
              "
            />
          </view>
        </block>
        <block v-else-if="f.type == 'date' || f.type == 'time' || f.type == 'datetime'">
          <!-- #ifdef MP-WEIXIN -->
          <van-cell
            :title="f.nameDisp"
            :value="formData[f.name]"
            @click="onClick(f)"
            :data-type="f.type"
            :data-name="f.name"
            :data-fec="f.frontEndConfig"
            :data-valueoption="f.valueOption"
            is-link
            :required="f.required == '1'"
            value-class="c-text-left"
          ></van-cell>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <van-cell
            :title="f.nameDisp"
            :value="formData[f.name]"
            @click="onClick(f)"
            :data-type="f.type"
            :data-name="f.name"
            :data-fec="f.frontEndConfig"
            :data-valueoption="f.valueOption"
            is-link
            :required="f.required == '1'"
            value-class="c-text-left"
          >
            <uni-datetime-picker
              :value="formData[f.name]"
              placeholder=" "
              @change="datetimeConfirm($event, 'uni', f.name)"
            />
          </van-cell>
          <!-- #endif -->
        </block>
        <block v-else>
          <van-field
            :label="f.nameDisp"
            :value="formData[f.name]"
            :placeholder="f.frontEndConfig.placeholder || '请输入'"
            :type="f.type == 'richText' ? 'textarea' : f.type"
            :autosize="f.type == 'textarea' || f.type == 'richText' ? true : false"
            :required="f.required == '1' ? true : false"
            :data-key="f.name"
            @change="onFieldChange"
            @blur="onFieldBlur"
          />
        </block>
      </block>
    </van-cell-group>
    <view class="button-bottom">
      <van-button type="info" round @click="doSave" :data-event="{ id: 'JMJVNzZiPq' }">
        保 存
      </van-button>
    </view>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
    ></van-action-sheet>
    <!-- 日期时间 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-popup :show="datetime.show" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        :type="datetime.type"
        :value="datetime.value"
        @confirm="datetimeConfirm"
        @cancel="datetimeCancel"
      ></van-datetime-picker>
    </van-popup>
    <!-- #endif -->
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      currentRole: {},
      fields: [],
      formData: {
        payAmount: '',
        exts: {}
      },
      options: {},
      actionSheet: {
        show: false,
        actions: [],
        field: {}
      },
      datetime: {
        show: false,
        type: '',
        value: new Date().getTime()
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.currentRole = wx.getStorageSync('currentRole');
    this.getFields();
  },
  methods: {
    doSave() {
      for (let i = 0; i < this.fields.length; i++) {
        let f = this.fields[i];
        // 校验必填
        if (f.required == '1' && !this.formData[f.name] && this.formData[f.name] !== 0) {
          if (f.frontEndConfig.showField) {
            //如果根据其他字段值展示 不展示则不需要必填
            if (
              f.frontEndConfig.showValue == 'exist'
                ? this.formData[f.frontEndConfig.showField]
                : this.formData[f.frontEndConfig.showField] == f.frontEndConfig.showValue
            ) {
              if (f.type == 'dialog') {
                common.osg.alert(f.nameDisp);
                return;
              } else {
                common.osg.alert(f.nameDisp + '为必填项');
                return;
              }
            }
          } else {
            if (f.type == 'dialog') {
              common.osg.alert(f.nameDisp);
              return;
            } else {
              common.osg.alert(f.nameDisp + '为必填项');
              return;
            }
          }
        }
        // 将exts字段值存在exts对象
        if (!f.preset) {
          this.formData.exts[f.name] = this.formData[f.name];
          // delete this.formData[f.name];
        }
      }
      this.formData.voucher = this.formData.exts.voucherList[0].url;
      common.osg.ajax('basic/rechargeForm/upsert', { data: JSON.stringify(this.formData) }, res => {
        common.osg.alert('提交成功，请等待后台人员审核！', () => {
          wx.navigateBack({
            delta: 1
          });
        });
      });
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    getFields(callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          colName: 'partnerCreditRechargeForm',
          _all: '1',
          'i:state|integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          res.data = res.data.filter(item => {
            //解析frontEndConfig字段配置
            if (item.frontEndConfig && common.osg.isJson(item.frontEndConfig)) {
              item.frontEndConfig = JSON.parse(item.frontEndConfig);
            } else {
              item.frontEndConfig = {};
            }
            return (
              (item.showType == '4'
                ? item.roleIds.indexOf(this.currentRole._id) != -1
                  ? true
                  : false
                : true) &&
              item.showList &&
              item.showList.indexOf('4') != -1 &&
              !item.frontEndConfig.mpDetailHide
            );
          });
          for (var f of res.data) {
            //特殊类型字段默认值
            if (
              f.type == 'file' ||
              f.type == 'area' ||
              f.type == 'scan' ||
              f.type == 'addItem' ||
              f.type == 'checkbox' ||
              f.multiple
            ) {
              this.$set(this.formData, f.name, []);
            }
            //关联字典表codeType放到options,之后从字典表查询
            if (f.valueOption) {
              if (f.type == 'cascade') {
                this.options['cascadeCode_' + f.valueOption] = {
                  codeId: f.valueOption
                };
              } else {
                this.options['codecfg_' + f.valueOption] = {
                  codeId: f.valueOption
                };
              }
            }
          }
          common.osg.codeoption(() => {
            this.fields = res.data;
            if (callback) callback();
          });
        },
        {
          noload: true
        }
      );
    },
    // 字段修改
    onFieldChange(e) {
      let key = e.target.dataset.key;
      this.formData[key] = e.detail;
    },
    // 字段失去焦点
    onFieldBlur(e) {
      let key = e.target.dataset.key;
      if (key == 'payAmount' && this.formData[key]) {
        this.formData[key] = parseInt(Number(e.detail.value) * 100) / 100;
      }
    },
    // 点击单元格
    onClick(f) {
      if (f.type == 'date' || f.type == 'time' || f.type == 'datetime') {
        this.datetime = {
          type: f.type,
          field: f.name,
          value: f.type == 'time' ? '12:00' : new Date().getTime(),
          show: true
        };
      } else {
        this.actionSheet = {
          show: true,
          actions: this.options[f.valueOption],
          field: f
        };
      }
    },
    /**
     * 上拉菜单选择
     */
    actionSheetSelect(e) {
      if (this.actionSheet.field.type == 'bizSelect') {
        //选择对象中的选项
        this.formData[this.actionSheet.field.name] = e.detail.value;
        this.formData.label = e.detail.label; //将中文加到存到label字段 上层工作流渲染多记录时返显
      } else {
        //选择字典表选项
        this.formData[this.actionSheet.field.name] = e.detail.value;
      }
      this.$forceUpdate();
    },
    // 上拉菜单取消
    actionSheetClose() {
      this.actionSheet.show = false;
    },
    /**
     * 上传图片
     */
    afterRead(e, f) {
      this.formData[f.name] = this.formData[f.name] || [];
      if (f.frontEndConfig.limit) {
        if (f.frontEndConfig.limit < this.formData[f.name].length + 1) {
          common.osg.alert('只能上传' + f.frontEndConfig.limit + '个！');
          return;
        }
      }
      common.osg.afterRead(e, this);
    },
    // 删除图片
    deleteFile(e, f) {
      this.formData[f.name].splice(e.detail.index, 1);
      this.$forceUpdate();
    },
    /**
     * 选择时间 提交
     */
    datetimeConfirm(e, type, field) {
      // APP端使用uni-datetime-picker组件
      if (type == 'uni') {
        e = { detail: e };
        this.datetime.type = 'datetime';
        this.datetime.field = field;
      }

      // #ifdef MP-WEIXIN
      let value = e.detail;
      // #endif
      // #ifdef APP-PLUS
      let value = e.detail || null; // uni-datetime-picker 清空时赋值为空字符串会显示NaN
      // #endif
      if (this.datetime.type == 'datetime') {
        this.formData[this.datetime.field] = common.osg.readableTime(value);
      } else if (this.datetime.type == 'date') {
        this.formData[this.datetime.field] = common.osg.readableTime(value, 'date');
      } else if (this.datetime.type == 'time') {
        this.formData[this.datetime.field] = common.osg.readableTime(value, time);
      }
      this.datetime.show = false;
    },
    /**
     * 选择时间 取消
     */
    datetimeCancel() {
      this.datetime = {
        show: false,
        type: '',
        field: '',
        value: ''
      };
    },
    // 复制到剪切板
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    }
  }
};
</script>

<style lang="scss">
.recharge {
  padding-bottom: 80px;
  .van-cell-group--inset {
    margin: 10px;
  }
  .button-bottom {
    width: 100vw;
    position: fixed;
    z-index: 2;
    bottom: 30px;
    text-align: center;
  }
  .van-cell__title {
    max-width: 120px !important;
    min-width: 120px !important;
    padding-right: 7px;
    margin-right: 7px;
    .van-field__label {
      color: #323233;
    }
  }
  .van-cell__value {
    color: #323233;
  }
  .c-checkbox-group {
    float: left;
  }
}
</style>
