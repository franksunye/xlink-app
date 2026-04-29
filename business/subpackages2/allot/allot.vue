<template>
  <view class="leads" @click.capture="track">
    <!-- <view class="c-flex c-item-center c-m-t-10">
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        shape="round"
        placeholder="搜索关键词"
        class="c-flex-1"
        custom-class="c-search c-p-t-0"
      ></van-search>
      <van-icon
        name="filter-o"
        size="24"
        :info="filter.count ? filter.count : ''"
        color="#666768"
        style="margin: 0 12px 10px 0"
        @click="filterOpen" :data-event="{id:'HwmkukngK7'}" />
    </view> -->
    <van-notice-bar
      v-if="fpi.data.length > 0"
      left-icon="volume-o"
      mode="closeable"
      text="查询超时未分派的线索和工单"
    />
    <scroll-view
      v-if="fpi.data.length > 0"
      scroll-y
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      class="c-cards"
    >
      <view
        v-for="(item, i) in fpi.data"
        :key="i"
        class="c-card"
        @click="openDetail(item)"
        :data-event="{ id: 'X4anR2jeS-' }"
      >
        <view class="c-card-title c-weight-normal" :data-event="{ id: 'X4anR2jeS-' }">
          <view
            :class="
              item.bizType == 'lead'
                ? 'c-red'
                : item.bizType == 'serviceAppointment'
                ? 'c-blue'
                : 'c-gray'
            "
            :data-event="{ id: 'X4anR2jeS-' }"
          >
            {{
              item.bizType == 'lead'
                ? '线索'
                : item.bizType == 'serviceAppointment'
                ? '工单'
                : '其他'
            }}
          </view>
          <view v-if="item.createTime" :data-event="{ id: 'X4anR2jeS-' }">
            {{ item.createTime }}
          </view>
        </view>
        <view class="c-card-content" :data-event="{ id: 'X4anR2jeS-' }">
          <block v-for="(field, index) in fields" :key="index">
            <view
              v-if="
                field.showList &&
                field.showList.indexOf('3') != -1 &&
                (field.preset ? item[field.name] : item.exts[field.name])
              "
              class="c-card-content-item"
              :data-event="{ id: 'X4anR2jeS-' }"
            >
              <view class="c-card-content-item-label" :data-event="{ id: 'X4anR2jeS-' }">
                {{ field.nameDisp }}：
              </view>
              <view
                v-if="field.valueOption"
                class="c-card-content-item-value"
                :data-event="{ id: 'X4anR2jeS-' }"
              >
                {{ formatValue(field, field.preset ? item[field.name] : item.exts[field.name]) }}
              </view>
              <view
                v-else-if="field.type == 'area'"
                class="c-card-content-item-value"
                :data-event="{ id: 'X4anR2jeS-' }"
              >
                {{ formatArea(field.preset ? item[field.name] : item.exts[field.name]) }}
              </view>
              <view v-else class="c-card-content-item-value" :data-event="{ id: 'X4anR2jeS-' }">
                {{ field.preset ? item[field.name] : item.exts[field.name] }}
              </view>
            </view>
          </block>
        </view>
        <view class="c-card-footer c-flex-between" :data-event="{ id: 'X4anR2jeS-' }">
          <view :data-event="{ id: 'X4anR2jeS-' }"></view>
          <view :data-event="{ id: 'X4anR2jeS-' }">
            <van-button
              v-if="item.phone"
              plain
              round
              icon="phone-o"
              @click.native.stop="makeCall(item.phone)"
              :data-event="{ id: 'tJYAksIPLM' }"
            >
              联系
            </van-button>
            <van-button
              plain
              round
              icon="replay"
              custom-class="c-m-l-20"
              @click.native.stop="resetExcludeSchedulingPolicy(item.bizId)"
              :data-event="{ id: 'M0I12I5fRp' }"
            >
              自动分派
            </van-button>
            <van-button
              type="info"
              round
              icon="friends-o"
              custom-class="c-m-l-20"
              @click.native.stop="openSR(item)"
              :data-event="{ id: 'M0IGSI5fRp' }"
            >
              手动分派
            </van-button>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 分派服务资源弹出层 -->
    <van-popup :show="SR.show" position="bottom" custom-style="height: 100vh">
      <view class="c-h c-flex c-flex-col">
        <view>
          <van-nav-bar
            title=" "
            left-text="返回"
            right-text="确认"
            left-arrow
            @click-left="cancelSR"
            @click-right="saveSR"
          />
          <van-search
            :value="SR.searchValue"
            clearable
            shape="round"
            placeholder="请输入服务资源名称"
            @change="SRSearch"
            @clear="SRSearch"
          />
          <view class="c-flex c-item-center" style="padding: 0 12px 10px 16px">
            <text class="c-m-r-20">资源类型筛选：</text>
            <view class="c-flex" style="gap: 16px">
              <van-checkbox
                v-for="(item, i) in options.resourceType"
                :key="i"
                :name="item.value"
                :value="SR.resourceType == item.value"
                @change="resourceTypeChange($event, item.value)"
              >
                {{ item.name }}
              </van-checkbox>
            </view>
          </view>
        </view>
        <view class="c-flex-1 c-auto-y">
          <van-radio-group :value="SR.selectId" @change="SRChange">
            <van-cell-group>
              <block v-for="(item, i) of SR.fpi.data" :key="i">
                <van-cell
                  :title="item.name"
                  clickable
                  @click="SRClick(item)"
                  value-class="sr-cell-value"
                >
                  <van-radio slot="right-icon" :name="item._id" />
                </van-cell>
              </block>
            </van-cell-group>
          </van-radio-group>
        </view>
      </view>
    </van-popup>
    <!-- 过滤器 -->
    <van-popup
      :show="filter.show"
      position="top"
      round
      custom-style="display:flex;flex-direction:column;"
      @close="filterClose"
    >
      <view class="c-flex-1 c-auto-y filters">
        <van-cell-group :border="false">
          <block v-for="(extField, index) in fields" :key="index">
            <block v-if="extField.showList && extField.showList.indexOf('7') != -1">
              <block v-if="extField.type == 'date' || extField.type == 'datetime'">
                <view class="c-cell">
                  <text class="c-cell-title">{{ extField.nameDisp }}</text>
                  <view
                    v-if="formData[extField.name + 'Start'] || formData[extField.name + 'End']"
                    class="c-cell-value"
                    @click="datetimeClear(extField.name)"
                    :data-event="{ id: 'Gl_l66N0q9' }"
                  >
                    <text :data-event="{ id: 'Gl_l66N0q9' }">清空</text>
                    <van-icon name="cross" color="#969799" :data-event="{ id: 'Gl_l66N0q9' }" />
                  </view>
                </view>
                <view class="filter-tags c-item-center c-p-b-0">
                  <van-tag
                    class="filter-tag"
                    :color="formData[extField.name + 'Start'] ? '#e0edfd' : '#f2f3f4'"
                    :text-color="formData[extField.name + 'Start'] ? '#2a80f0' : '#3b4045'"
                    size="large"
                    @click.native="dateTimeClick"
                    :data-key="extField.name + 'Start'"
                  >
                    {{ formData[extField.name + 'Start'] || '开始日期' }}
                  </van-tag>
                  <text>~</text>
                  <van-tag
                    class="filter-tag"
                    :color="formData[extField.name + 'End'] ? '#e0edfd' : '#f2f3f4'"
                    :text-color="formData[extField.name + 'End'] ? '#2a80f0' : '#3b4045'"
                    size="large"
                    @click.native="dateTimeClick"
                    :data-key="extField.name + 'End'"
                  >
                    {{ formData[extField.name + 'End'] || '结束日期' }}
                  </van-tag>
                </view>
                <view class="filter-tag-border-bottom" style="margin-top: 10px"></view>
              </block>
              <block
                v-else-if="
                  extField.type == 'select' ||
                  extField.type == 'radio' ||
                  extField.type == 'checkbox'
                "
              >
                <view>
                  <view class="c-cell">
                    <text class="c-cell-title">{{ extField.nameDisp }}</text>
                    <view
                      class="c-cell-value"
                      @click="arrowClick(extField)"
                      :data-event="{ id: 'aCgDJRoKvm' }"
                    >
                      <text :data-event="{ id: 'aCgDJRoKvm' }">更多</text>
                      <van-icon
                        :name="extField.arrowDirection || 'arrow-down'"
                        color="#969799"
                        :data-event="{ id: 'aCgDJRoKvm' }"
                      />
                    </view>
                  </view>
                  <view
                    class="filter-tags"
                    :class="extField.arrowDirection == 'arrow-up' ? 'filter-tags-all' : ''"
                  >
                    <van-tag
                      v-for="(item, j) in options[extField.valueOption]"
                      :key="j"
                      class="filter-tag"
                      :color="
                        formData[extField.name] && formData[extField.name].indexOf(item.value) != -1
                          ? '#e0edfd'
                          : '#f2f3f4'
                      "
                      :text-color="
                        formData[extField.name] && formData[extField.name].indexOf(item.value) != -1
                          ? '#2a80f0'
                          : '#3b4045'
                      "
                      size="large"
                      @click.native="optionClick(extField.name, item.value)"
                    >
                      {{ item.name }}
                    </van-tag>
                  </view>
                  <view class="filter-tag-border-bottom"></view>
                </view>
              </block>
              <block v-else-if="extField.type == 'cascade'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="codelabel('cascade', extField.valueOption, formData[extField.name])"
                  @click="onClick"
                  :data-field="extField"
                  :data-id="extField._id"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :data-valueoption="extField.valueOption"
                  :is-link="
                    formData[extField.name] && formData[extField.name].length > 0 ? false : true
                  "
                >
                  <van-icon
                    v-if="formData[extField.name] && formData[extField.name].length > 0"
                    slot="right-icon"
                    name="cross"
                    color="#969799"
                    size="16px"
                    style="margin-left: 4px"
                    @click.native.stop="filterClear(extField)"
                    :data-event="{ id: 'ddim3vLLN4' }"
                  />
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'area'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    area.areaList.province_list[
                      formData[extField.name] && formData[extField.name][0]
                    ] +
                    area.areaList.city_list[formData[extField.name] && formData[extField.name][1]] +
                    area.areaList.county_list[formData[extField.name] && formData[extField.name][2]]
                  "
                  @click="onClick"
                  :data-field="extField"
                  :data-id="extField._id"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :data-valueoption="extField.valueOption"
                  :is-link="
                    formData[extField.name] && formData[extField.name].length > 0 ? false : true
                  "
                >
                  <van-icon
                    v-if="formData[extField.name] && formData[extField.name].length > 0"
                    slot="right-icon"
                    name="cross"
                    color="#969799"
                    size="16px"
                    style="margin-left: 4px"
                    @click.native.stop="filterClear(extField)"
                    :data-event="{ id: 'AXBbGuY3Gq' }"
                  />
                </van-cell>
              </block>
              <!-- 原生类型 text number idcard digit textarea 自定义计算类型evaluate-->
              <block v-else>
                <van-field
                  :label="extField.nameDisp"
                  :value="formData[extField.name]"
                  @change="onChange"
                  :data-extfield="extField"
                  :data-name="extField.name"
                  input-align="right"
                  :data-fec="extField.frontEndConfig"
                  placeholder="搜索关键词"
                  :icon="formData[extField.name] ? 'cross' : ''"
                  @click-icon="filterClear(extField)"
                ></van-field>
              </block>
            </block>
          </block>
        </van-cell-group>
      </view>
      <view class="c-flex c-p-30">
        <van-button
          plain
          block
          class="c-flex-1 c-m-r-30"
          @click="filterReset"
          :data-event="{ id: 'pX28lG_sgM' }"
        >
          重置
        </van-button>
        <van-button
          type="info"
          block
          class="c-flex-1"
          @click="filterSave"
          :data-event="{ id: 'rxisgm6q7s' }"
        >
          保存
        </van-button>
      </view>
    </van-popup>
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
    <van-empty v-if="!isLogined && loaded" description="请先登录后再查看" class="c-flex c-flex-1">
      <van-button
        round
        type="info"
        @click="doOpen('/subpackages/login/loginAuth')"
        :data-event="{ id: 'xZElWwePki' }"
      >
        登 录
      </van-button>
    </van-empty>
    <van-empty
      v-if="isLogined && loaded && fpi.data.length == 0"
      description="没有超时未分派的线索和工单"
      class="c-flex c-flex-1"
    />
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      isLogined: false,
      loaded: false,
      refresherTriggered: false, // 已触发下拉加载
      reachBottom: false, // 触底
      searchValue: '',
      fpi: {
        page: 1,
        rows: 20,
        data: []
      },
      fields: {},
      options: {
        codecfg_resourceType: { codeId: 'resourceType' }
      },
      SR: {
        show: false,
        formData: {},
        searchValue: '',
        resourceType: '',
        fpi: { data: [] },
        selectRow: {},
        selectId: ''
      },
      formData: {},
      filter: {
        show: false,
        params: {},
        count: 0
      },
      //组件选项
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
        field: '',
        value: new Date().getTime()
      },
      // 省市区选择
      area: {
        show: false,
        field: '',
        areaList: Object.assign({}, areajs.default)
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    if (!common.osg.isLogined()) {
      this.loaded = true;
      common.osg.open('/subpackages/login/loginAuth');
    } else {
      this.isLogined = true;
      common.osg.getFields('allot', () => {
        this.getData();
      });
    }
  },
  onShow() {
    common.osg.init(this, {}, app);
    // 当从登录页或其他页面返回时，如果登录且列表没有数据，则查询列表
    if (common.osg.isLogined() && this.loaded && this.fpi.data.length == 0) {
      this.isLogined = true;
      common.osg.getFields('allot', () => {
        this.getData();
      });
    }
  },
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    onSearch(e) {
      this.searchValue = e.detail;
      this.fpi.page = 1;
      this.getData();
    },
    getData(callback) {
      let params = {
        // page: this.fpi.page,
        // rows: this.fpi.rows,
        // sortField: 'createTime',
        // sortOrder: 'desc',
        // 'regex:name|string#or': this.searchValue,
        // 'regex:phone|string#or': this.searchValue,
        // 'regex:address|string#or': this.searchValue,
        // 'regex:code|string#or': this.searchValue
      };
      params = Object.assign(params, this.filter.params);
      common.osg.ajax('biz/operationTool/queryToBeAssignedData', params, res => {
        this.fpi = res;
        this.loaded = true;
        if (callback) callback();
      });
    },
    codelabel(type, option, val) {
      if (!val) return;
      if (type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
      }
    },
    // 反显字段值
    formatValue(field, value) {
      if (!value || value.length == 0) return '';
      if (field.type == 'cascade') {
        if (field.multiple) {
          return common.osg.formatCascadeMultiple(field.valueOption, value);
        } else {
          return common.osg.formatCascade(field.valueOption, value);
        }
      } else {
        if (field.multiple) {
          return common.osg.codelabelForArray(field.valueOption, value);
        } else {
          return common.osg.codelabel(field.valueOption, value);
        }
      }
    },
    formatArea(value) {
      if (!value || value.length == 0) return '';
      return (
        (value[0] != '110000' &&
        value[0] != '120000' &&
        value[0] != '310000' &&
        value[0] != '500000'
          ? this.area.areaList.province_list[value[0]] + ' / '
          : '') +
        this.area.areaList.city_list[value[1]] +
        ' / ' +
        this.area.areaList.county_list[value[2]]
      );
    },
    // 拨号
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    // 分派
    openSR(formData) {
      if (common.osg.isRepeatClick('openSR')) return;
      this.SR.formData = formData;
      this.getSRs();
      this.SR.show = true;
    },
    SRSearch(e) {
      this.SR.searchValue = e.detail;
      this.SR.selectId = '';
      this.SR.selectRow = {};
      this.getSRs();
    },
    resourceTypeChange(e, value) {
      if (e.detail) {
        this.SR.resourceType = value;
      } else {
        this.SR.resourceType = '';
      }
      this.getSRs();
    },
    getSRs() {
      common.osg.ajax(
        'biz/serviceResource/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc',
          'regex:name|string#and': this.SR.searchValue,
          'in:serviceType|array#and': this.SR.formData.serviceType,
          'is:resourceType|string#and': this.SR.resourceType
        },
        res => {
          this.SR.fpi = res;
        }
      );
    },
    SRClick(row) {
      this.SR.selectId = row._id;
      this.SR.selectRow = row;
    },
    SRChange(e) {
      this.SR.selectId = e.detail;
    },
    saveSR() {
      if (!this.SR.selectId) {
        common.osg.toast('请选择服务资源', 'none');
        return;
      }
      common.osg.confirm(`是否确认分派给 ${this.SR.selectRow.name} ？`, () => {
        if (common.osg.isRepeatClick('saveSR')) {
          common.osg.toast('操作过于频繁', 'none');
          return;
        }
        let params = {
          id: this.SR.formData.bizId
        };
        if (this.SR.formData.bizType == 'lead') {
          params.bizId = this.SR.selectRow._id;
        } else {
          params.currentOrgId = this.SR.selectRow._id;
        }
        common.osg.ajax(
          `basic/${this.SR.formData.bizType}/allot.do`,
          params,
          () => {
            this.cancelSR();
            common.osg.alert('分派成功', () => {
              this.getData();
            });
          },
          { noload: true }
        );
      });
    },
    cancelSR() {
      this.SR = {
        show: false,
        formData: {},
        searchValue: '',
        fpi: { data: [] },
        selectRow: {},
        selectId: ''
      };
    },
    // 查看线索
    openDetail(item) {
      if (item.bizType == 'lead') {
        common.osg.open('/subpackages2/lead/lead?activeTab=log&id=' + item.bizId);
      } else if (item.bizType == 'serviceAppointment') {
        common.osg.open('/subpackages/serviceAppointment/serviceAppointment?id=' + item.bizId);
      }
    },
    /**
     * 过滤器
     */
    filterOpen() {
      this.filter.show = true;
      uni.setNavigationBarTitle({
        title: '筛选'
      });
    },
    filterClose() {
      this.filter.show = false;
      uni.setNavigationBarTitle({
        title: '待分派'
      });
    },
    filterClear(field) {
      if (field.type == 'cascade' || field.type == 'area') {
        this.$set(this.formData, field.name, []);
      } else {
        this.$set(this.formData, field.name, '');
      }
      this.$forceUpdate();
    },
    filterReset() {
      this.filter.show = false;
      uni.setNavigationBarTitle({
        title: '待分派'
      });
      this.filter.params = {};
      this.filter.count = 0;
      this.formData = {};

      // this.fpi.page = 1;
      // this.fpi.rows = 10;
      this.getData();
    },
    filterSave() {
      let params = {};
      let count = 0;
      for (let i = 0; i < this.fields.length; i++) {
        let field = this.fields[i];
        let value = this.formData[field.name];
        if (field.showList && field.showList.indexOf('7') != -1) {
          if (
            (field.type == 'datetime' || field.type == 'date') &&
            (this.formData[field.name + 'Start'] || this.formData[field.name + 'End'])
          ) {
            count++;
            if (this.formData[field.name + 'Start']) {
              params[`gte:${field.preset ? field.name : 'exts.' + field.name}|date#and`] =
                this.formData[field.name + 'Start'];
            }
            if (this.formData[field.name + 'End']) {
              params[`lte:${field.preset ? field.name : 'exts.' + field.name}|datetime#and`] =
                this.formData[field.name + 'End'] + ' 23:59:59';
            }
          } else if (field.type == 'select' || field.type == 'radio' || field.type == 'checkbox') {
            if (value && value.length > 0) {
              count++;
              params[`in:${field.preset ? field.name : 'exts.' + field.name}|array#and`] =
                value.join();
            }
          } else if (field.type == 'cascade') {
            if (value && value.length > 0) {
              count++;
              params[`in:${field.preset ? field.name : 'exts.' + field.name}|string#and`] =
                value[value.length - 1];
            }
          } else if (field.type == 'area') {
            if (value && value.length > 0) {
              count++;
              params[`is:province|string#and`] = value[0];
              params[`is:city|string#and`] = value[1];
              params[`is:district|string#and`] = value[2];
            }
          } else {
            if (value) {
              count++;
              params[`regex:${field.preset ? field.name : 'exts.' + field.name}|string#and`] =
                value;
            }
          }
        }
      }
      this.filter.params = params;
      this.filter.count = count;

      // this.fpi.page = 1;
      // this.fpi.rows = 10;
      this.getData();
      this.filter.show = false;
      uni.setNavigationBarTitle({
        title: '待分派'
      });
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
    onChange(e) {
      let field = e.target.dataset.name;
      let value = e.detail;
      this.formData[field] = value;
      this.$forceUpdate();
    },
    onClick(e) {
      let type = e.target.dataset.type;
      let field = e.target.dataset.name;
      let valueOption = e.target.dataset.valueoption;
      let frontEndConfig = e.target.dataset.fec;

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
        common.osg.ajax(frontEndConfig.url, frontEndConfig.params, res => {
          res.data.map(item => {
            item.label = item[frontEndConfig.label];
            item.value = item[frontEndConfig.value];
          });
          this.options[field] = res.data;
          this.bizSelect = {
            show: true,
            field: field,
            data: this.options[field],
            searchValue: ''
          };
        });
      } else if (type == 'area') {
        this.area.field = field;
        this.area.show = true;
      }
      this.$forceUpdate();
    },
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
    actionSheetClose() {
      this.actionSheet.show = false;
    },
    onCascaderFinish(e) {
      const { selectedOptions } = e.detail;
      this.formData[this.cascader.field] = selectedOptions.map(item => item.value);
      this.cascader.show = false;
    },
    dateTimeClick(e) {
      this.datetime = {
        type: 'date',
        field: e.target.dataset.key,
        value: new Date().getTime(),
        show: true
      };
    },
    datetimeClear(fileName) {
      this.$set(this.formData, fileName + 'Start', '');
      this.$set(this.formData, fileName + 'End', '');
      this.$forceUpdate();
    },
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
    datetimeCancel() {
      this.datetime = {
        show: false,
        type: '',
        field: '',
        value: ''
      };
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
      this.formData[this.area.field] = areaVal; //adcode的数组
      this.area.show = false;
      this.$forceUpdate();
      common.osg.getSubdistricts(areaVal, res => {
        this.options.subdistricts = res;
      });
    },
    areaCancel() {
      this.area.field = '';
      this.area.show = false;
    },
    arrowClick(extField) {
      if (extField.arrowDirection == 'arrow-up') {
        this.$set(extField, 'arrowDirection', 'arrow-down');
      } else {
        this.$set(extField, 'arrowDirection', 'arrow-up');
      }
    },
    optionClick(fieldName, value) {
      if (!this.formData[fieldName]) {
        this.$set(this.formData, fieldName, [value]);
      } else {
        let valueIndex = this.formData[fieldName].indexOf(value);
        if (valueIndex != -1) {
          this.formData[fieldName].splice(valueIndex, 1);
        } else {
          this.formData[fieldName].push(value);
        }
      }
    },
    resetExcludeSchedulingPolicy(id) {
      common.osg.confirm('将会根据调度策略自动分派', () => {
        common.osg.ajax('/biz/operationTool/resetExcludeSchedulingPolicy', { id }, () => {
          common.osg.toast('操作成功', 'none', 4000);
        });
      });
    }
  }
};
</script>

<style lang="scss">
.leads {
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .van-notice-bar {
    padding: 0 10px;
  }
  .van-notice-bar__right-icon {
    top: 12px;
  }
  .van-empty {
    width: 100vw;
  }
  .c-cards {
    flex: 1;
    overflow: hidden;
    padding: 0;
    background-color: #f7f8fa;
    .c-card-content-item-label {
      min-width: 80px;
    }
  }
  // 服务资源单元格值不占位
  ::v-deep .sr-cell-value {
    display: none !important;
  }
  .sr-popup .van-cell__title,
  .van-cell__value {
    -webkit-flex: auto;
    flex: auto;
    max-width: none !important;
  }

  .filters {
    .van-cell {
      .van-cell__title {
        flex: unset !important;
        margin-right: 0 !important;
        min-width: 70px !important;
        max-width: unset !important;
      }
    }
    .van-field__icon-container {
      padding-left: 4px;
    }
  }
}
</style>
