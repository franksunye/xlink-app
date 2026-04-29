<template>
  <view class="labour-upsert">
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
        <block v-else-if="f.type == 'area'">
          <van-field
            :label="f.nameDisp"
            :value="
              formData[f.name].length > 0
                ? area.areaList.province_list[formData[f.name][0]] +
                  area.areaList.city_list[formData[f.name][1]] +
                  area.areaList.county_list[formData[f.name][2]]
                : ''
            "
            :placeholder="f.frontEndConfig.placeholder || '请选择省市区'"
            is-link
            readonly
            required
            @click.native="
              area.show = true;
              area.fieldName = f.name;
            "
          />
          <!-- 省市区 -->
          <van-popup :show="area.show" position="bottom">
            <van-area
              title="省市区"
              :area-list="area.areaList"
              @confirm="areaConfirm"
              @cancel="areaCancel"
            />
          </van-popup>
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
          />
        </block>
      </block>
    </van-cell-group>
    <view class="button-bottom">
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
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      type: '',
      fields: [],
      formData: {
        exts: {}
      },
      options: {},
      area: {
        show: false,
        fieldName: '',
        areaList: Object.assign({}, areajs.default)
      },
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: {}
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.id = param.id;
    this.getFields(() => {
      if (this.id) this.getData();
    });
  },
  methods: {
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    getFields(callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          colName: 'labour',
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
              item.showList && item.showList.indexOf('4') != -1 && !item.frontEndConfig.mpDetailHide
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
    getData() {
      common.osg.ajax('biz/labour/findById', { id: this.id }, res => {
        // 将exts字段值存在exts对象
        this.fields.map(f => {
          if (!f.preset) {
            res.entity[f.name] = res.entity.exts[f.name];
          }
        });
        this.formData = res.data;
      });
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

      common.osg.ajax(`biz/labour/upsert`, { data: JSON.stringify(this.formData) }, () => {
        common.osg.alert('保存成功！');
      });
    },
    // 字段修改
    onFieldChange(e) {
      let key = e.target.dataset.key;
      this.formData[key] = e.detail;
      if (key == 'address') {
        common.osg.geo(
          e.detail,
          res => {
            this.formData.gpsPoint = {
              latitude: res.location.split(',')[1],
              longitude: res.location.split(',')[0]
            };
          },
          this.formData.city
        );
      }
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
    },
    areaConfirm(e) {
      let values = e.detail.values;
      let areaVal = [];
      if (values.length >= 1) {
        this.formData.province = values[0].code;
        areaVal.push(values[0].code);
      }
      if (values.length >= 2) {
        this.formData.city = values[1].code;
        areaVal.push(values[1].code);
      }
      if (values.length >= 3) {
        this.formData.district = values[2].code;
        areaVal.push(values[2].code);
      }
      this.formData[this.area.fieldName] = areaVal;
      this.area.show = false;
    },
    areaCancel() {
      this.area.show = false;
    }
  }
};
</script>

<style lang="scss">
.labour-upsert {
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
    max-width: 6.2em;
    min-width: 6.2em;
    padding-right: 7px;
    margin-right: 7px;
  }
  .c-checkbox-group {
    float: left;
  }
}
</style>
