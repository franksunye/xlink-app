<template>
  <view>
    <block v-if="bgImage">
      <image :src="bgImage" mode="widthFix" style="width: 100vw"></image>
    </block>
    <!-- 表单组件渲染 -->
    <view class="c-radius c-hidden c-m-v-10" :class="bgImage ? 'bgView' : ''">
      <!-- <view class="c-bold c-text-center c-bg-white c-p-15">{{formDef.title}}</view> -->
      <van-cell-group v-if="dataShow">
        <block v-for="(extField, index) in extFields" :key="index">
          <!-- 只展示已启用的字段-->
          <block v-if="extField.state == 1 && !extField.frontEndConfig.mpDetailHide">
            <block v-if="showType(extField, formData)">
              <block v-if="extField.type == 'phone'">
                <van-field
                  :label="extField.nameDisp"
                  :value="formData[extField.name]"
                  @change="onChange"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  type="number"
                  :maxlength="extField.type == 'phone' ? 11 : -1"
                  :required="extField.required == '1'"
                  :readonly="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  input-align="right"
                ></van-field>
              </block>
              <block v-else-if="extField.type == 'switch'">
                <van-cell
                  :title="extField.nameDisp"
                  class="c-cell-switch"
                  :required="extField.required == '1'"
                >
                  <van-switch
                    :checked="formData[extField.name]"
                    @change="onChange"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    active-value="1"
                    inactive-value="0"
                    size="18px"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  ></van-switch>
                </van-cell>
              </block>
              <block
                v-else-if="
                  extField.type == 'date' || extField.type == 'time' || extField.type == 'datetime'
                "
              >
                <van-cell
                  :title="extField.nameDisp"
                  :value="formData[extField.name]"
                  @click="onClick"
                  :data-id="extField._id"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :data-valueoption="extField.valueOption"
                  is-link
                  :required="extField.required == '1'"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'select'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    commonEvent('codelabel', null, {
                      option: extField.valueOption,
                      value: formData[extField.name]
                    })
                  "
                  @click="onClick"
                  :data-id="extField._id"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :data-valueoption="extField.valueOption"
                  is-link
                  :required="extField.required == '1'"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'cascade'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    codelabel(
                      'cascade',
                      extField.valueOption,
                      formData[extField.name],
                      null,
                      extField.frontEndConfig
                    )
                  "
                  @click="onClick"
                  :data-id="extField._id"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :data-valueoption="extField.valueOption"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                  is-link
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'bizSelect'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    commonEvent('codelabel', null, {
                      option: extField.name,
                      value: formData[extField.name]
                    })
                  "
                  @click="onClick"
                  :data-id="extField._id"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :data-valueoption="extField.valueOption"
                  is-link
                  :required="extField.required == '1'"
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'radio'">
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <van-radio-group
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    class="c-radio-group"
                  >
                    <van-radio
                      v-for="(item, i) in options[extField.valueOption]"
                      :key="i"
                      :name="item.value"
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                      "
                    >
                      {{ item.name }}
                    </van-radio>
                  </van-radio-group>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'checkbox'">
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <van-checkbox-group
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    class="c-checkbox-group"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                  >
                    <van-checkbox
                      v-for="(item, i) in options[extField.valueOption]"
                      :key="i"
                      :name="item.value"
                      shape="square"
                    >
                      {{ item.name }}
                    </van-checkbox>
                  </van-checkbox-group>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'rate'">
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <van-rate
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                  ></van-rate>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'file'">
                <view class="c-cell-view c-flex c-flex-between c-border-n c-relative">
                  <view class="c-cell_title">
                    <text class="c-required" v-if="extField.required == '1'">*</text>
                    <text>{{ extField.nameDisp }}</text>
                  </view>
                  <view class="c-cell_value">
                    {{
                      ((formData[extField.name] && formData[extField.name].length) || 0) +
                      ' / ' +
                      (extField.frontEndConfig.max || '10')
                    }}
                  </view>
                </view>
                <view class="c-cell-view">
                  <van-uploader
                    style="display: flex"
                    :file-list="formData[extField.name]"
                    @after-read="afterRead"
                    :data-extField="extField"
                    :data-field="extField.name"
                    @delete="deleteFile"
                    :max-count="
                      extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                        ? extField.frontEndConfig.max
                        : 10
                    "
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  />
                </view>
              </block>
              <block v-else-if="extField.name == 'image'">
                <view class="cell-wrapper-p14">
                  <view class="cell-item">
                    <van-cell :title="extField.nameDisp" :border="false" />
                    <view class="image-sample">
                      <view style="padding: 10rpx; flex: 1">
                        <view
                          style="
                            margin-bottom: 20rpx;
                            width: 100%;
                            text-align: center;
                            font-size: 16px;
                          "
                        >
                          水位刻度标识
                        </view>
                        <image
                          mode="widthFix"
                          style="width: 100%"
                          :src="extField.frontEndConfig.list[0]"
                          :data-src="extField.frontEndConfig.list[0]"
                        ></image>
                      </view>
                      <view style="padding: 10rpx; flex: 1">
                        <view
                          style="
                            margin-bottom: 20rpx;
                            width: 100%;
                            text-align: center;
                            font-size: 16px;
                          "
                        >
                          蓄水后的全景
                        </view>
                        <image
                          mode="widthFix"
                          style="width: 100%"
                          :src="extField.frontEndConfig.list[1]"
                          :data-src="extField.frontEndConfig.list[1]"
                        ></image>
                      </view>
                    </view>
                  </view>
                </view>
              </block>
              <block v-else-if="extField.type == 'title'">
                <view
                  class="c-cell-headline"
                  v-html="
                    (extField.frontEndConfig && extField.frontEndConfig.html) || extField.nameDisp
                  "
                ></view>
              </block>
              <block v-else-if="extField.type == 'gap'">
                <view class="c-cell-gap">
                  {{ extField.frontEndConfig && extField.frontEndConfig.html }}
                </view>
              </block>
              <block v-else-if="extField.type == 'area'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    area.areaList.province_list[formData[extField.name][0]] +
                    area.areaList.city_list[formData[extField.name][1]] +
                    area.areaList.county_list[formData[extField.name][2]]
                  "
                  @click="onClick"
                  :data-id="extField._id"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :data-valueoption="extField.valueOption"
                  is-link
                  :required="extField.required == '1'"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                />
              </block>
              <block v-else-if="extField.type == 'scan'">
                <view class="c-flex c-flex c-flex-between c-item-center c-bg-white c-cell-view">
                  <text class="c-cell_title">{{ extField.nameDisp }}</text>
                  <van-button
                    type="info"
                    round
                    size="mini"
                    @click="commonEvent('scan', extField.name, extField.frontEndConfig)"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  >
                    {{ extField.nameDisp }}
                  </van-button>
                </view>
              </block>
              <block v-else-if="extField.type == 'addItem'">
                <view class="c-cell-view c-flex c-flex-between">
                  <text>
                    <span class="c-red" v-if="extField.required == '1'">*</span>
                    {{ extField.nameDisp }}
                  </text>
                  <van-button
                    @click="commonEvent('addItem', extField.name, extField.frontEndConfig)"
                    :plain="extField.frontEndConfig.plain"
                    :type="extField.frontEndConfig.type"
                    :icon="extField.frontEndConfig.icon"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                    size="mini"
                  >
                    {{ extField.frontEndConfig.buttonName }}
                  </van-button>
                </view>
                <view class="c-cell-view" style="border-bottom: 1px solid #ebedf0">
                  <block v-for="(item, i) in formData[extField.name]" :key="i">
                    <van-tag
                      @close="tagClose(extField.name, i)"
                      :closeable="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                      "
                      round
                      type="primary"
                      size="medium"
                      custom-class="c-m-10"
                      closeable
                    >
                      {{ commonEvent('codelabel', null, { option: extField.name, value: item }) }}
                    </van-tag>
                  </block>
                </view>
              </block>
              <block v-else-if="extField.type == 'button'">
                <van-button
                  @click="commonEvent('button', null, { extField })"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :type="extField.frontEndConfig.type"
                  :color="extField.frontEndConfig.color"
                  :block="extField.frontEndConfig.type"
                  :round="extField.frontEndConfig.round"
                  :plain="extField.frontEndConfig.plain"
                  :disabled="
                    extField.frontEndConfig.disabled ||
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                  "
                >
                  {{ extField.nameDisp }}
                </van-button>
              </block>
              <block v-else-if="extField.type == 'bgImage'"></block>
              <!-- 按类别展示 -->
              <block v-else-if="extField.type == 'sort'">
                <view v-if="extField.frontEndConfig.showName">{{ extField.name }}</view>
                <van-cell-group :border="false">
                  <view
                    v-for="(item, key) in formData[extField.name]"
                    :key="key"
                    class="c-cell-view c-flex c-flex-between"
                    style="padding: 10px 25px"
                  >
                    <view>
                      {{ commonEvent('codelabel', null, { option: extField.option, value: key }) }}
                    </view>
                    <view>
                      <text>{{ item.length }}</text>
                      <text>{{ extField.frontEndConfig.unit }}</text>
                    </view>
                  </view>
                </van-cell-group>
              </block>
              <block v-else-if="extField.type == 'download'">
                <view
                  style="
                    background-color: #fff;
                    padding: 16rpx;
                    display: flex;
                    justify-content: space-between;
                  "
                >
                  <view>{{ extField.nameDisp }}</view>
                  <view>
                    <van-button
                      icon="share"
                      plain
                      size="mini"
                      class="c-m-r-10"
                      round
                      @click="
                        copy(
                          extField.preset ? formData[extField.name] : formData.exts[extField.name]
                        )
                      "
                      custom-style="padding: 0 10rpx"
                    >
                      复制链接
                    </van-button>
                    <van-button
                      icon="eye-o"
                      size="mini"
                      @click="download"
                      plain
                      round
                      custom-style="padding: 0 10rpx"
                      :data-filename="
                        extField.preset ? formData[extField.name] : formData.exts[extField.name]
                      "
                    >
                      查看文件
                    </van-button>
                  </view>
                </view>
              </block>
              <!-- 原生类型 text number idcard digit textarea 自定义计算类型evaluate-->
              <block v-else>
                <van-field
                  :label="extField.nameDisp"
                  :value="formData[extField.name]"
                  @change="onChange"
                  :data-extfield="extField"
                  :data-name="extField.name"
                  :data-type="extField.type == 'evaluate' ? 'digit' : extField.type"
                  :data-fec="extField.frontEndConfig"
                  :type="extField.type"
                  :readonly="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  :required="extField.required == '1'"
                  input-align="right"
                ></van-field>
              </block>
            </block>
          </block>
        </block>
      </van-cell-group>
    </view>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
    ></van-action-sheet>
    <!-- 级联选择器 -->
    <van-popup :show="cascader.show" round position="bottom">
      <van-cascader
        v-if="cascader.show"
        :value="cascader.value"
        title="请选择"
        :options="cascader.options"
        :field-names="{
          text: 'name',
          value: 'value',
          children: 'children'
        }"
        @close="cascader.show = false"
        @finish="onCascaderFinish"
      />
    </van-popup>
    <!-- 日期时间 -->
    <van-popup :show="datetime.show" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        :type="datetime.type"
        :value="datetime.value"
        @confirm="datetimeConfirm"
        @cancel="datetimeCancel"
      ></van-datetime-picker>
    </van-popup>
    <!-- 省市区 -->
    <van-popup :show="area.show" position="bottom">
      <van-area
        title="省市区"
        :area-list="area.areaList"
        @confirm="areaConfirm"
        @cancel="areaCancel"
      />
    </van-popup>
    <!-- loading 遮罩层 -->
    <van-overlay :show="loading">
      <view class="wrapper">
        <van-loading vertical size="50px" class="c-loading">处理中...</van-loading>
      </view>
    </van-overlay>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      urlParams: {
        colName: '', //根据对象名称查询字段
        formDefId: '', //表单定义id
        formDataId: '', //表单数据id
        workflowNodeId: '', //节点id
        tenantId: '', //租户id
        userId: '', //用户id
        smodule: '', //模块
        sid: '' //模块id
      },
      //当前运行时节点
      currentNode: {
        nodeDef: {
          formFieldIdsReadOnly: []
        }
      },
      //表单定义
      formDef: {},
      //表单字段
      extFields: [],
      // 表单数据
      formData: {
        exts: {}
      },
      dataShow: true,
      //组件选项
      options: {},
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: '',
        type: '' //默认为空，type=addItem自定义项
      },
      // 级联选择器
      cascader: {
        show: false,
        actions: [],
        field: ''
      },
      // 时间选择器
      datetime: {
        show: false,
        type: '',
        value: new Date().getTime()
      },
      // 省市区选择
      area: {
        show: false,
        field: '',
        areaList: Object.assign({}, areajs.default)
      },
      //图片
      bgImage: '', //背景图片
      // 是否显示遮罩层
      loading: false,
      user: {}, //当前登陆人（user）的信息
      roleId: '' //当前切换的角色id
    };
  },
  onShow() {
    this.area.areaList = areajs.default;
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    this.roleId = wx.getStorageSync('currentRole')._id;
    this.user = wx.getStorageSync('user');
    this.urlParams = {
      colName: common.osg.param('colName') || '',
      formDefId: common.osg.param('formDefId') || '',
      formDataId: common.osg.param('formDataId') || '',
      workflowNodeId: common.osg.param('workflowNodeId') || '',
      tenantId: common.osg.param('tenantId') || '',
      userId: common.osg.param('userId') || '',
      smodule: common.osg.param('smodule') || '',
      sid: common.osg.param('sid') || ''
    };
    // 动态修改页面标题
    // #ifdef MP-WEIXIN
    if (this.urlParams.colName == 'declaration') {
      uni.setNavigationBarTitle({
        title: '报单'
      });
    }
    // #endif
    this.getFormData();
    // this.getFormDef();
    this.getFields();
    if (this.urlParams.workflowNodeId) this.getNode();
  },
  methods: {
    /**
     * 获取表单信息(标题)
     */
    getFormDef() {
      common.osg.ajax(
        'biz/ext/query.do',
        {
          tenantId: this.urlParams.tenantId,
          'is:_id|string#and': this.urlParams.formDefId
        },
        res => {
          this.formDef = res.data[0];
        }
      );
    },
    /**
     * 获取运行时节点信息
     */
    getNode() {
      common.osg.ajax(
        `workflow/queryWorkflowNode/${this.urlParams.workflowNodeId}.do`,
        null,
        res => {
          this.currentNode = res;
          if (res.state == 10) {
            common.osg.toast('已完成，请勿重复提交！', 'none');
          }
          this.$forceUpdate();
        }
      );
    },
    /**
     * 获取表单字段
     */
    getFields(callback) {
      if (this.urlParams.colName) {
        var url = `s/queryByColName/${this.urlParams.colName}/${this.urlParams.tenantId}.do`;
        var params = {};
      } else {
        var url = 'biz/extField/query.do';
        var params = {
          tenantId: this.urlParams.tenantId,
          extId: this.urlParams.formDefId,
          sortField: 'order',
          sortOrder: 'asc',
          _all: '1'
        };
      }
      common.osg.ajax(
        url,
        params,
        res => {
          if (this.urlParams.colName) {
            var extFields = res.entity.extFieldList;
          } else {
            var extFields = res.data;
          }
          extFields = extFields.filter(
            item => item.state == 1 && item.showList && item.showList.indexOf('4') != -1
          );
          //公式脚本id
          let scriptIds = [];
          for (var extField of extFields) {
            if (!extField.frontEndConfig) {
              extField.frontEndConfig = {};
            }

            //解析frontEndConfig字段配置
            if (extField.frontEndConfig && common.osg.isJson(extField.frontEndConfig)) {
              extField.frontEndConfig = JSON.parse(extField.frontEndConfig);
              if (extField.type == 'bgImage') {
                this.bgImage = extField.frontEndConfig.list[0];
              }
            }

            //特殊类型字段默认值
            if (
              extField.type == 'file' ||
              extField.type == 'area' ||
              extField.type == 'scan' ||
              extField.type == 'addItem' ||
              extField.type == 'bizSelect'
            ) {
              this.formData[extField.name] = [];
            }

            if (extField.type == 'sort') {
              this.formData[extField.name] = {};
              extField.option = extField.frontEndConfig.options;
              this.options['codecfg_' + extField.frontEndConfig.options] = {
                codeId: extField.frontEndConfig.options
              };
            }

            if (extField.type == 'pushItem') {
              this.formData[extField.frontEndConfig.to] = [];
            }

            //关联字典表codeType放到options,之后从字典表查询
            if (extField.valueOption) {
              if (extField.type == 'cascade') {
                this.options['cascadeCode_' + extField.valueOption] = {
                  codeId: extField.valueOption
                };
              } else {
                this.options['codecfg_' + extField.valueOption] = {
                  codeId: extField.valueOption
                };
              }
            }

            //获取公式脚本id
            if (extField.type == 'evaluate') {
              scriptIds.push(extField.frontEndConfig);
            }
          }
          // 解决外部调用
          this.options['codecfg_tenantId'] = {
            eleid: 'tenantId',
            tenantId: this.urlParams.tenantId
          };
          //查询options 赋值extFields
          common.osg.codeoption(() => {
            this.extFields = extFields;
            if (callback) callback();
          }, this.urlParams.tenantId);

          //批量查询公式脚本 并保存到options
          if (scriptIds.length > 0) {
            common.osg.ajax(
              'groovyScript/query.do',
              {
                page: 1,
                rows: scriptIds.length,
                'in:_id|array#and': scriptIds.join()
              },
              res => {
                let script = {};
                res.data.map(item => {
                  if (item.scriptContent && common.osg.isJson(item.scriptContent)) {
                    script[item._id] = JSON.parse(item.scriptContent);
                  }
                });
                this.options.script = script;
              },
              {
                noload: true
              }
            );
          }
        },
        {
          noload: true
        }
      );
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      //当通过colName查询时没有formDefId
      if (!this.urlParams.formDefId) return;
      common.osg.ajax(
        `biz/extForm/query/${this.urlParams.formDefId}.do`,
        {
          tenantId: this.urlParams.tenantId,
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:_id|string#and': this.urlParams.formDataId
        },
        res => {
          res.data[0] = res.data[0] || {};
          // 拼七牛云压缩参数
          for (let extField of this.extFields) {
            if (extField.type == 'file') {
              if (res.data[0][extField.name]) {
                for (let obj of res.data[0][extField.name]) {
                  if (obj.url.indexOf('?') == -1) {
                    obj.url += '?imageView2/0/h/300';
                  }
                }
              }
            }
          }
          this.formData = res.data[0];
        },
        {
          noload: true
        }
      );
    },
    /**
     * 提交表单数据
     */
    saveFormData(frontEndConfig) {
      if (this.currentNode.state == 10) {
        common.osg.alert('已完成，请勿重复提交！', 'none');
        return;
      }
      //检测是否必填
      for (var extField of this.extFields) {
        if (
          extField.required == '1' &&
          (extField.type == 'file' ||
            extField.type == 'area' ||
            extField.type == 'scan' ||
            extField.type == 'addItem' ||
            extField.type == 'bizSelect') &&
          this.formData[extField.name].length == 0
        ) {
          common.osg.alert(extField.nameDisp + '为必填项');
          return;
        }
        if (
          extField.required == '1' &&
          !this.formData[extField.name] &&
          this.formData[extField.name] !== 0
        ) {
          common.osg.alert(extField.nameDisp + '为必填项');
          return;
        }
        if (extField.type == 'phone') {
          if (!this.checkMobile(this.formData[extField.name])) {
            common.osg.alert(extField.nameDisp + '格式错误', 'none');
            return;
          }
        }

        // 需要正则校验
        if (extField.frontEndConfig.verify) {
          if (!this.verify(extField)) {
            common.osg.alert(extField.nameDisp + '格式错误', 'none');
            return;
          }
        }

        // 取消七牛云压缩参数
        if (extField.type == 'file') {
          this.formData[extField.name] = this.formData[extField.name] || [];
          if (this.formData[extField.name]) {
            for (let obj of this.formData[extField.name]) {
              if (obj.url.indexOf('?') != -1) {
                obj.url = obj.url.substring(0, obj.url.indexOf('?'));
              }
            }
          }
        }
      }

      // 显示遮罩层 禁止点击
      this.loading = true;
      let params = this.formData;
      params.tentantId = this.urlParams.tenantId; //租户id
      params.smodule = this.urlParams.smodule || 'serviceAppointment'; //模块
      params.sid = this.urlParams.sid; //模块数据id
      common.osg.ajax(
        `biz/extForm/upsert/${this.urlParams.formDefId}.do`,
        {
          dataStr: JSON.stringify(params)
        },
        res => {
          //处理工作流节点
          if (this.urlParams.workflowNodeId) {
            this.process(res.data._id);
          } else {
            // 隐藏遮罩层
            this.loading = false;

            // 如果配置了提示信息展示提示信息 否则展示"提交成功"
            if (frontEndConfig && frontEndConfig.success) {
              common.osg.alert(frontEndConfig.success, () => {
                // #ifdef H5
                location.reload();
                // #endif

                // #ifdef MP-WEIXIN
                this.formData = {
                  exts: {}
                };
                this.$forceUpdate();
                // #endif
              });
            } else {
              common.osg.alert('提交成功', () => {
                // #ifdef H5
                location.reload();
                // #endif

                // #ifdef MP-WEIXIN
                this.formData = {
                  exts: {}
                };
                this.$forceUpdate();
                // #endif
              });
            }
          }
        }
      );
    },
    /**
     * 处理工作流节点
     */
    process(formDataId) {
      let params = {
        workflowNodeId: this.urlParams.workflowNodeId,
        nodeFormDefId: this.urlParams.formDefId,
        nodeFormDataId: formDataId || this.urlParams.formDataId,
        smodule: this.urlParams.smodule || 'serviceAppointment',
        tenantId: this.urlParams.tenantId,
        userId: this.urlParams.userId,
        context: this.user.orgIds
      };
      console.log(params);
      common.osg.ajax(
        '/s/processWorkflow.do',
        params,
        res => {
          // 隐藏遮罩层
          this.loading = false;

          // 弹窗提示
          common.osg.alert('提交成功', () => {
            //工作流处理成功后不再发请求 修改工作流状态 实现禁止重复点击
            // #ifdef H5
            this.currentNode.state = 10;
            // location.reload();
            // #endif

            // #ifdef MP-WEIXIN
            this.currentNode.state = 10;
            // this.formData = {
            // 	exts: {}
            // };
            // this.$forceUpdate();
            // #endif
          });
        },
        {
          method: 'GET'
        }
      );
    },
    /**
     * 提交表单
     */
    submit() {
      //检测是否必填
      for (var extField of this.extFields) {
        if (extField.required == '1' && !extField.frontEndConfig.mpDetailHide) {
          if (
            (extField.type == 'file' ||
              extField.type == 'area' ||
              extField.type == 'scan' ||
              extField.type == 'addItem') &&
            this.formData[extField.name].length == 0
          ) {
            common.osg.alert(extField.nameDisp + '为必填项', 'none');
            return;
          } else if (!this.formData[extField.name] && this.formData[extField.name] !== 0) {
            if (extField.frontEndConfig.showField) {
              // 如果根据其他字段值展示 不展示则不需要必填
              if (
                this.formData[extField.frontEndConfig.showField] ==
                extField.frontEndConfig.showValue
              ) {
                if (extField.type == 'dialog') {
                  common.osg.alert(extField.nameDisp);
                  this.disabled.saveForm = false; //取消禁用提交表单按钮
                  return;
                } else {
                  common.osg.alert(extField.nameDisp + '为必填项', 'none');
                  this.disabled.saveForm = false; //取消禁用提交表单按钮
                  return;
                }
              }
            } else {
              common.osg.alert(extField.nameDisp + '为必填项', 'none');
              return;
            }
          }
        }

        if (extField.type == 'phone') {
          if (!this.checkMobile(this.formData[extField.name])) {
            common.osg.alert(extField.nameDisp + '格式错误', 'none');
            return;
          }
        }

        // 需要正则校验
        if (extField.frontEndConfig.verify) {
          if (!this.verify(extField)) {
            common.osg.alert(extField.nameDisp + '格式错误', 'none');
            return;
          }
        }

        if (extField.name == 'depth' && !this.checkDeth(this.formData.depth)) {
          common.osg.alert('深度需要在1-10之间，并且只保留一位小数！', 'none');
          return;
        }
      }

      //显示遮罩层 禁止点击
      this.loading = true;

      // 提交表单时扩展移动到formData.exts
      this.formData.exts = this.formData.exts || {};
      for (var extField of this.extFields) {
        if (!extField.preset) {
          this.formData.exts[extField.name] = this.formData[extField.name];
          if (
            extField.type != 'file' &&
            extField.type != 'area' &&
            extField.type != 'scan' &&
            extField.type != 'addItem' &&
            extField.type != 'bizSelect'
          ) {
            delete this.formData[extField.name];
          }
        }
      }

      // 创建工单标题
      this.formData.title = this.formData.name + '的报单';

      // #ifdef MP-WEIXIN
      let roleIds = this.user.roleIds; //查询当前登录人角色
      //赋值工单的信息渠道
      if (roleIds.includes('7100212906800336051')) {
        // 如果有合伙人内勤则信息渠道为
        this.formData.channel = ['46', '4610', '4610070'];
      } else if (roleIds.includes('8050029062726074247')) {
        //如果有管家角色信息渠道则为
        this.formData.channel = ['46', '4610', '4610050'];
      } else if (roleIds.includes('5424993602217461538')) {
        //如果有工队角色信息渠道则为
        this.formData.channel = ['46', '4610', '4610060'];
      }
      //TODO:不通用，如果维修部位单一值则需要改为级联
      if (this.formData.exts.leakagesite) {
        this.formData.exts.leakagesite_copy = common.osg.deepCopy(this.formData.exts.leakagesite);
        this.formData.exts.leakagesite = [this.formData.exts.leakagesite];
      }
      // #endif

      let param = {};
      let header = null;
      let url = '';
      if (this.urlParams.h5UserId) this.formData.exts.h5UserId = this.urlParams.h5UserId;
      // #ifdef H5
      param = JSON.stringify(this.formData);
      url = `s/upsert.do?id=${this.urlParams.userId}`;
      header = {
        'Content-type': 'application/json;charset=utf-8'
      };
      // #endif
      // #ifdef MP-WEIXIN
      param['serviceAppointment'] = JSON.stringify(this.formData);
      url = 'basic/serviceAppointment/upsert.do';
      // #endif

      common.osg.ajax(
        url,
        param,
        res => {
          if (res.success) {
            this.loading = false;
            common.osg.alert('报单成功', () => {
              // #ifdef H5
              location.reload();
              // #endif
              // #ifdef MP-WEIXIN
              this.formData = {
                exts: {}
              };
              this.$forceUpdate();
              // #endif
            });
          } else {
            common.osg.alert('请稍后重试');
          }
        },
        {
          header: header,
          noload: true
        }
      );
    },
    /**
     * 表单组件触发特殊事件
     */
    commonEvent(eventName, field, options) {
      options = options || {};
      if (eventName == 'scan') {
        common.osg.scanCode(res => {
          this.formData[field] = this.formData[field] || [];
          let url = res.result;

          //如果有url校验
          if (options.funcUrl) {
            let keyField = options.key;
            let valueField = options.value;
            let sortField = options.sortField;
            common.osg.ajax(
              options.funcUrl,
              {
                url
              },
              res => {
                if (sortField) {
                  //按分类统计展示
                  let obj = this.formData[sortField] || {};
                  let result = res.data;
                  let key = result[keyField];
                  let value = result[valueField];
                  obj[key] = obj[key] || [];
                  if (obj[key].indexOf(url) != -1) {
                    common.osg.toast('重复扫码', 'none');
                    return;
                  } else {
                    obj[key].push(url);
                  }
                  this.formData[sortField] = obj;
                  this.$forceUpdate();
                } else {
                  // 不按分类统计的情况
                  this.formData[field].push(url);
                }
              }
            );
          } else {
            // 不按分类统计的情况
            this.formData[field].push(url);
            this.$forceUpdate();
          }
        });
      } else if (eventName == 'addItem') {
        common.osg.ajax(
          options.requestUrl,
          {
            page: 1,
            rows: 100,
            'in:state|array-integer#and': '0,1'
          },
          res => {
            //赋值label和value字段供组件使用
            let label = options.label;
            let value = options.value;
            if (label && value) {
              res.data.map(item => {
                item.label = item[label];
                item.value = item[value];
              });
            }
            //返显value用
            this.options[field] = res.data;
            //上拉菜单
            this.actionSheet.actions = res.data;
            this.actionSheet.field = field;
            this.actionSheet.type = 'addItem';
            this.actionSheet.show = true;
          }
        );
      } else if (eventName == 'pushItem') {
        if (!this.formData[field]) {
          common.osg.alert('不允许添加空值');
          return;
        }

        let url = options.url + this.formData[field];

        //如果有url校验
        if (options.funcUrl) {
          let keyField = options.key;
          let valueField = options.value;
          let sortField = options.sortField;
          common.osg.ajax(
            options.funcUrl,
            {
              url
            },
            res => {
              if (sortField) {
                //按分类统计展示
                let obj = this.formData[sortField] || {};
                let result = res.data;
                let key = result[keyField];
                let value = result[valueField];
                obj[key] = obj[key] || [];
                if (obj[key].indexOf(url) != -1) {
                  common.osg.toast('重复扫码', 'none');
                  return;
                } else {
                  obj[key].push(url);
                }
                this.formData[sortField] = obj;
                this.$forceUpdate();

                common.osg.toast('添加成功');
                if (options.clear) {
                  this.formData[field] = '';
                }
              } else {
                // 不按分类统计的情况
                this.formData[sortField].push(url);
              }
            }
          );
        } else {
          // 不按分类统计的情况
          this.formData[field].push(url);
          this.$forceUpdate();
        }
      } else if (eventName == 'codelabel') {
        return common.osg.codelabel(options.option, options.value);
      } else if (eventName == 'button') {
        let func = options.extField.frontEndConfig.func;
        if (func) {
          this[func](options.extField.frontEndConfig);
        }
      }
    },
    codelabel(type, option, val, opts, frontEndConfig) {
      try {
        if (type == 'select') {
          return common.osg.codelabel(option, val, opts);
        } else if (type == 'cascade') {
          if (frontEndConfig && frontEndConfig.multiple) {
            return common.osg.formatCascadeMultiple(option, val);
          } else {
            return common.osg.formatCascade(option, val);
          }
        }
      } catch (e) {}
    },
    /**
     * 表单字段 输入
     */
    onChange(e) {
      let type = e.target.dataset.type;
      let field = e.target.dataset.name;
      let frontEndConfig = e.target.dataset.frontEndConfig;
      let value = e.detail;
      // 字段赋值
      this.formData[field] = value;
      if (type == 'evaluate') {
        //根据脚本id匹配脚本公式
        let scritpId = frontEndConfig;
        let evaluate = this.options.script[scritpId];
        if (evaluate) {
          //变量赋值
          let arr = [];
          for (var item of evaluate.var) {
            arr.push(Number(this.formData[item]));
          }
          //公式计算
          let val = wx.binding.eval(evaluate.eval, arr, evaluate.func);
          if (val || val == 0) {
            this.formData[evaluate.res] = Math.abs((val.toFixed(2) * 100) / 100);
          }
          console.log(evaluate);
          console.log(this.formData[evaluate.res]);

          //计算"结果"关联的公式
          for (var extField of this.extFields) {
            if (extField.name == evaluate.res) {
              let resEvaluate = this.options.script[extField.frontEndConfig];
              if (resEvaluate) {
                //变量赋值
                let resArr = [];
                for (var item of resEvaluate.var) {
                  resArr.push(Number(this.formData[item]));
                }
                //公式计算
                let resVal = wx.binding.eval(resEvaluate.eval, resArr, resEvaluate.func);
                console.log(resVal);
                if (resVal || resVal == 0) {
                  this.formData[resEvaluate.res] = Math.abs((resVal.toFixed(2) * 100) / 100);
                }
                console.log('结果计算');
                console.log(evaluate);
                console.log(this.formData[evaluate.res]);
              }
              break;
            }
          }
        }
      }
      //视图刷新
      this.$forceUpdate();
    },
    /**
     * 表单字段 点击
     */
    onClick(e) {
      let type = e.target.dataset.type;
      let field = e.target.dataset.name;
      let fieldId = e.target.dataset.id;
      let value = e.detail;
      let valueOption = e.target.dataset.valueoption;
      let frontEndConfig = e.target.dataset.fec;
      //只读字段
      if (this.currentNode.nodeDef.formFieldIdsReadOnly.indexOf(fieldId) != -1) {
        return;
      }
      if (type == 'date' || type == 'time' || type == 'datetime') {
        this.datetime = {
          type,
          field,
          value: type == 'time' ? '12:00' : new Date().getTime(),
          show: true
        };
      } else if (type == 'select') {
        this.actionSheet = {
          actions: this.options[valueOption],
          field: field,
          type: '', //默认为空，type=addItem自定义项
          show: true
        };
      } else if (type == 'cascade') {
        this.cascader = {
          options: this.options[valueOption],
          field: field,
          type: '', //默认为空，type=addItem自定义项
          show: true
        };
      } else if (type == 'bizSelect') {
        var url = frontEndConfig.requestUrl;
        common.osg.ajax(
          frontEndConfig.requestUrl,
          {
            page: 1,
            rows: 100,
            'in:state|array-integer#and': '1'
          },
          res => {
            res.data.map(item => {
              item.label = item[frontEndConfig.label];
              item.value = item[frontEndConfig.value];
            });
            this.options[field] = res.data;
            this.actionSheet = {
              actions: this.options[field],
              field: field,
              type: 'bizSelect', //默认为空，type=addItem自定义项 , type=bizSelect选择对象列表
              show: false
            };
            this.actionSheet.show = true;
          }
        );
      } else if (type == 'area') {
        this.area.field = field;
        this.area.show = true;
      }
      this.$forceUpdate();
    },
    /**
     * 上拉菜单选择
     */
    actionSheetSelect(e) {
      if (this.actionSheet.type == 'addItem') {
        //自定义增项
        this.formData[this.actionSheet.field] = this.formData[this.actionSheet.field] || [];
        this.formData[this.actionSheet.field].push(e.detail.value);
      } else if (this.actionSheet.type == 'bizSelect') {
        //选择对象中的选项
        this.formData[this.actionSheet.field] = e.detail.value;
        this.formData.label = e.detail.label; //将中文加到存到label字段 上层工作流渲染多记录时返显
      } else {
        //选择字典表选项
        this.formData[this.actionSheet.field] = e.detail.value;
      }
      this.$forceUpdate();
    },
    /**
     * 上拉菜单取消
     */
    actionSheetClose() {
      this.actionSheet.show = false;
    },
    /**
     * 级联选择器完成
     */
    onCascaderFinish(e) {
      const { selectedOptions } = e.detail;
      // 组合value
      this.formData[this.cascader.field] = selectedOptions.map(item => item.value);
      this.orgShow = false;
    },
    /**
     * 选择时间 提交
     */
    datetimeConfirm(e) {
      let value = e.detail;
      if (this.datetime.type == 'datetime') {
        this.formData[this.datetime.field] = new Date(value)
          .toLocaleString('chinese', {
            hour12: false
          })
          .replace(/\//g, '-');
      } else if (this.datetime.type == 'date') {
        this.formData[this.datetime.field] = new Date(value)
          .toLocaleDateString()
          .replace(/\//g, '-');
      } else if (this.datetime.type == 'time') {
        this.formData[this.datetime.field] = value;
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
    /**
     * 选择省市区 提交
     */
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
      this.formData[this.area.field] = areaVal; //adcode的数组
      this.area.show = false;
      this.$forceUpdate();
      // 查询街道
      common.osg.getSubdistricts(areaVal, res => {
        this.options.subdistricts = res;
      });
    },
    /**
     * 选择省市区 取消
     */
    areaCancel() {
      this.area.field = '';
      this.area.show = false;
    },
    /**
     * 删除标签
     */
    tagClose(field, index) {
      this.formData[field].splice(index, 1);
      this.$forceUpdate();
    },
    /**
     * 上传图片
     */
    afterRead(e) {
      let extfield = e.target.dataset.extfield;
      this.formData[extfield.name] = this.formData[extfield.name]
        ? this.formData[extfield.name]
        : [];
      if (extfield && extfield.frontEndConfig && extfield.frontEndConfig.max) {
        if (extfield.frontEndConfig.max < this.formData[extfield.name].length + 1) {
          common.osg.alert('只能上传' + extfield.frontEndConfig.max + '个！');
          return;
        }
      }
      common.osg.afterRead(
        e,
        this,
        extfield.frontEndConfig.max,
        this.formData[extfield.name].length
      );
    },
    /**
     * 删除图片
     */
    deleteFile(e) {
      let field = e.target.dataset.field;
      let index = e.detail.index;
      this.formData[field].splice(index, 1);
      this.$forceUpdate();
    },
    //验证手机号
    checkMobile(sMobile) {
      if (!/^1[3456789]\d{9}$/.test(sMobile)) {
        return false;
      } else {
        return true;
      }
    },
    //验证 深度 1-10 保留一位小数点
    checkDeth(num) {
      if (!/^([1-9](\.\d)?|10)$/.test(num)) {
        return false;
      } else {
        return true;
      }
    },
    // 正则校验
    verify(extField) {
      //多个正则表达式的对象
      let regexpObj = extField.frontEndConfig.regexpObj;
      if (!regexpObj) return false;
      //根据某字段值选择不同正则表达式
      let verifyField = extField.frontEndConfig.verifyField;
      if (verifyField) {
        let key = this.formData[extField.frontEndConfig.verifyField];
        if (key) {
          let regexp = new RegExp(regexpObj[key]);
          if (regexp) {
            if (regexp.test(this.formData[extField.name])) {
              return true;
            }
          }
        }
      } else {
        // 默认正则表达式，无需根据其他字段值选择不同正则表达式
        let regexp = new RegExp(regexpObj.regexp);
        if (regexp) {
          if (regexp.test(this.formData[extField.name])) {
            return true;
          }
        }
      }
      return false;
    },
    // 复制到剪切板
    copy(data) {
      wx.setClipboardData({
        data: data,
        success(res) {
          wx.getClipboardData({
            success(res) {
              console.log(res.data); // data
            }
          });
        }
      });
    },
    // 查看文件
    download: function (e) {
      var fileName = e.currentTarget.dataset.filename;
      var fileType = fileName.split('.')[fileName.split('.').length - 1];
      var filePath = fileName;
      if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif') {
        //图片预览
        wx.previewImage({
          current: filePath, // 当前显示图片的http链接
          urls: [filePath] // 需要预览的图片http链接列表
        });
      } else {
        //文件下载
        wx.downloadFile({
          url: filePath,
          success: function (res) {
            let filePath = res.tempFilePath;
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log(res);
              },
              fail: function (res) {
                console.log(res);
              },
              complete: function (res) {
                console.log(res);
              }
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    },
    // 业主确认报价单
    confirmQuotation() {
      common.osg.ajax('/i/bjd/quotation.do', { id: this.urlParams.formDataId }, res => {
        this.loading = false;
        common.osg.alert('确认成功', () => {
          // #ifdef H5
          location.reload();
          // #endif
          // #ifdef MP-WEIXIN
          this.$forceUpdate();
          // #endif
        });
      });
    },
    // 字段展示类型
    showType(field, formData) {
      return common.osg.showType(field, formData, this.roleId);
    }
  }
};
</script>

<style>
.bgView {
  margin-top: -30px;
  border-radius: 20rpx;
}

/* 示例图片 */
.cell-wrapper-p14 {
  background-color: #fff;
  padding: 20rpx 14rpx;
}

.cell-title-bottom-30 {
  margin-bottom: 30rpx;
}

.image-sample {
  display: flex;
}

.accordingButton {
  margin: 0;
  margin-right: 16rpx;
}

.c-cell-view {
  border-bottom: 1px solid #ebedf0;
}
</style>
