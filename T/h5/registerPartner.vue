<template>
  <view class="registerPartern">
    <block v-if="bgImage">
      <image :src="bgImage" mode="widthFix" style="width: 100vw; display: flex"></image>
    </block>
    <van-cell-group :border="false">
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
            :placeholder="f.placeholder || '请选择'"
            :required="f.required == '1' ? true : false"
            :data-key="f.name"
            is-link
            @click-input="onClick(f)"
          />
        </block>
        <block v-else-if="f.type == 'file'">
          <view class="c-cell-view c-flex c-flex-between c-relative">
            <text>
              {{ f.nameDisp }}
            </text>
            <text class="c-cell_value" v-if="formData[f.name]">
              （{{ formData[f.name].length || 0 }} / {{ f.frontEndConfig.max || '不限' }}）
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
              ></video>
            </view>
            <van-uploader
              v-else
              style="display: flex"
              multiple
              :accept="f.frontEndConfig.fileType || 'image'"
              :upload-text="f.frontEndConfig ? f.frontEndConfig.uploadText : ''"
              :file-list="formData[f.name]"
              @after-read="afterRead($event, f)"
              :data-extField="extField"
              :data-field="f.name"
              @delete="deleteFile($event, f)"
              :max-count="
                f.frontEndConfig.max || f.frontEndConfig.max == 0 ? f.frontEndConfig.max : 20
              "
            />
          </view>
        </block>
        <block v-else-if="f.type == 'sendVerificationCode'">
          <van-field
            :value="formData[f.name]"
            :data-key="f.name"
            @change="onFieldChange"
            center
            label="短信验证码"
            placeholder="请输入验证码"
            clearable
            use-button-slot
            type="number"
            :maxlength="6"
            :required="f.required == '1' ? true : false"
          >
            <van-button slot="button" size="small" type="info" @click="getSms" v-if="!sent">
              获取验证码
            </van-button>
            <van-button slot="button" size="small" type="info" v-else>
              {{ count }}s后重新获取
            </van-button>
          </van-field>
        </block>
        <block v-else-if="f.type == 'bgImage'"></block>
        <block v-else-if="f.type == 'phone'">
          <van-field
            :label="f.nameDisp"
            :value="formData[f.name]"
            :placeholder="f.placeholder || '请输入'"
            type="number"
            :autosize="f.type == 'textarea' || f.type == 'richText' ? true : false"
            :required="f.required == '1' ? true : false"
            :data-key="f.name"
            @change="onFieldChange"
            :maxlength="11"
            :readonly="f.name == 'recommender' && recommend ? true : false"
          />
        </block>
        <block v-else>
          <van-field
            :label="f.nameDisp"
            :value="formData[f.name]"
            :placeholder="f.placeholder || '请输入'"
            :type="f.type == 'richText' ? 'textarea' : f.type"
            :autosize="f.type == 'textarea' || f.type == 'richText' ? true : false"
            :required="f.required == '1' ? true : false"
            :data-key="f.name"
            @change="onFieldChange"
          />
        </block>
      </block>
    </van-cell-group>
    <view style="margin-top: 50px; text-align: center">
      <van-button type="info" round @click="doSave">保 存</van-button>
    </view>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
    ></van-action-sheet>
  </view>
</template>

<script>
const app = getApp();
var common = require('../resources/js/common.js');
export default {
  data() {
    return {
      recommend: false,
      colName: '',
      fields: [],
      bgImage: '',
      formData: {
        tenantId: '1340835581184723420',
        exts: {}
      },
      options: {},
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: {}
      },
      sent: false,
      count: 60
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    if (param.r) {
      this.formData.recommender = param.r;
      this.recommend = true;
    }
    this.getFields();
  },
  onShow() {
    var v = document.getElementsByClassName('uni-page-head-btn');
    v[0].style.display = 'none';
  },
  methods: {
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    getFields() {
      common.osg.ajax(
        `s/queryByColName/registerPartner/1340835581184723420.do`,
        {
          colName: 'registerPartner',
          _all: '1',
          'i:state|integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          res.entity.extFieldList = res.entity.extFieldList.filter(item => {
            //解析frontEndConfig字段配置
            if (item.frontEndConfig && common.osg.isJson(item.frontEndConfig)) {
              item.frontEndConfig = JSON.parse(item.frontEndConfig);
            } else {
              item.frontEndConfig = {};
            }
            return (
              item.showList && item.showList.indexOf('4') != -1 && !item.frontEndConfig.mpDetailHide
            );
          });
          for (var f of res.entity.extFieldList) {
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
            // 获取背景图片
            if (f.type == 'bgImage') {
              this.bgImage = f.frontEndConfig.list[0];
            }
          }
          common.osg.codeoption(() => {
            this.fields = res.entity.extFieldList;
          });
        },
        {
          noload: true
        }
      );
    },
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
          delete this.formData[f.name];
        }
      }
      common.osg.ajax(`~${common.osg.host}/fsgo/i/register/partner.do`, this.formData, () => {
        common.osg.alert('注册成功！', () => {
          this.formData = {
            tenantId: '1340835581184723420',
            exts: {}
          };
        });
      });
    },
    /**
     * 获取验证码
     */
    getSms() {
      if (!this.formData.phone) {
        common.osg.toast('请输入手机号', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请输入正确格式的手机号', 'none');
        return;
      }
      let indexParams = wx.getStorageSync('indexParams') || {};
      common.osg.ajax(
        `~${common.osg.host}/fsgo/i/phone/sendRegisterCode.do`,
        { phone: this.formData.phone },
        res => {
          // 验证码已发送
          this.sent = true;
          // 倒计时60s
          this.count = 60;
          var timer = setInterval(() => {
            --this.count;
            if (this.count == 0) {
              clearInterval(timer);
              this.sent = false;
            }
          }, 1000);
        }
      );
    },
    // 字段修改
    onFieldChange(e) {
      let key = e.target.dataset.key;
      this.formData[key] = e.detail;
    },
    // 点击单元格
    onClick(f) {
      this.actionSheet = {
        show: true,
        actions: this.options[f.valueOption],
        field: f
      };
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
      if (f.frontEndConfig.max) {
        if (f.frontEndConfig.max < this.formData[f.name].length + 1) {
          common.osg.alert('只能上传' + f.frontEndConfig.max + '个！');
          return;
        }
      }
      common.osg.afterRead(e, this);
    },
    // 删除图片
    deleteFile(e, f) {
      this.formData[f.name].splice(e.detail.index, 1);
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #fff;
  height: 100vh;
}
.registerPartern {
  padding-bottom: 80px;
  .bgView {
    margin-top: -30px;
    border-radius: 20rpx;
  }
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
    max-width: 100px !important;
    min-width: 100px !important;
    width: 100px;
    padding-right: 7px;
    margin-right: 7px;
  }
  .c-checkbox-group {
    float: left;
  }
}
</style>
