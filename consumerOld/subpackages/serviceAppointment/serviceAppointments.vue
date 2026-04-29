<template>
  <view>
    <!-- 过滤 -->
    <view class="c-header" style="z-index: 2">
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        use-action-slot
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20"
      >
        <view slot="action" class="c-flex">
          <van-icon
            custom-style="font-size: 44rpx;"
            name="filter-o"
            @click="filterSortingShow = !filterSortingShow"
          ></van-icon>
        </view>
      </van-search>
    </view>
    <van-popup
      :show="filterSortingShow"
      position="top"
      custom-style="width: 100%;"
      @close="filterSortingShow = false"
    >
      <view
        class="c-popup c-flex-between c-item-center"
        style="box-sizing: border-box; padding-bottom: 34rpx"
      >
        <view class="c-w-100 filterSort">
          <van-dropdown-menu active-color="#ee0a24">
            <van-dropdown-item
              title="上门时间"
              @close="dropdownCloseItem(3)"
              @open="dropdownOpenItem(4)"
            >
              <van-cell
                title="开始时间"
                :value="dateTimeData.dateTimeStart"
                @click="onTimeClick"
                :data-keyName="'dateTimeStart'"
                :is-link="true"
              ></van-cell>
              <van-cell
                title="结束时间"
                :value="dateTimeData.dateTimeEnd"
                :data-keyName="'dateTimeEnd'"
                @click="onTimeClick"
                :is-link="true"
              ></van-cell>
              <view class="c-flex c-flex-around c-p-20">
                <van-button
                  round
                  custom-style="min-width:140rpx;height:40px;margin-right:20rpx"
                  plain
                  @click="filterSortingShow = false"
                >
                  关闭
                </van-button>
                <van-button
                  round
                  custom-style="min-width:140rpx;height:40px;margin-right:20rpx"
                  plain
                  @click="
                    dateTimeData.dateTimeStart = '';
                    dateTimeData.dateTimeEnd = '';
                  "
                >
                  清空
                </van-button>
                <van-button
                  round
                  custom-style="width:40vw;height:80rpx;"
                  type="danger"
                  @click="application"
                >
                  应用
                </van-button>
              </view>
            </van-dropdown-item>
            <van-dropdown-item
              popup-style="z-index:300;"
              custom-style="z-index: 300;"
              @change="sortMenuChange"
              :value="sortValue"
              @close="dropdownCloseItem(1)"
              @open="dropdownOpenItem(2)"
              :options="[
                { text: '更新时间降序', value: '' },
                { text: '优先级排序', value: 'priority' },
                { text: '上门时间升序', value: 'upTime' }
              ]"
            ></van-dropdown-item>
          </van-dropdown-menu>
        </view>

        <view
          class="c-flex c-item-center c-flex-between"
          :style="vanDropdownData.open ? '' : 'z-index: 200;'"
        >
          <van-button
            round
            custom-style="min-width:140rpx;height:40px;margin-right:20rpx"
            plain
            @click="filterSortingShow = false"
          >
            关闭
          </van-button>
          <van-button
            round
            custom-style="min-width:140rpx;height:40px;margin-right:20rpx"
            plain
            @click="
              dateTimeData.dateTimeStart = '';
              dateTimeData.dateTimeEnd = '';
            "
          >
            清空
          </van-button>
          <van-button
            round
            custom-style="width:40vw;height:80rpx;"
            type="danger"
            @click="application"
          >
            应用
          </van-button>
        </view>
      </view>
    </van-popup>

    <!-- 列表 -->
    <!-- <view class="c-content">
      <van-tabs
        swipeable
        @change="tabChange"
        :active="active"
        sticky
        offset-top="44"
        v-if="activeShow"
        :ellipsis="false"
        tab-class="tabclass"
      >
        <block v-for="(func, i) in functionList" :key="i">
          <block v-if="func.functionTypeList">
            <van-tab
              v-if="func.functionTypeList.indexOf(functionType) != -1"
              :title="func.name"
              :name="func._id"
              :info="statusMap[func._id]"
            >
              <van-notice-bar
                v-if="dateTimeData.dateTimeStart || dateTimeData.dateTimeEnd"
                wrapable
                :scrollable="false"
                :text="`上门时间在：${dateTimeData.dateTimeStart} ~ ${dateTimeData.dateTimeEnd}`"
              />
              <view>
                <view
                  :id="'listitem-' + func._id + '-' + j"
                  v-for="(listitem, j) in boundings"
                  :key="j"
                  :style="{
                    height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
                    margin: '20rpx 0'
                  }"
                >
                  <view v-if="index - 1 <= j && j <= index + 1">
                    <view
                      class="c-card"
                      v-for="(item, k) in list[j]"
                      :key="k"
                      @tap="doOpen"
                      :data-id="item.data._id"
                    >
                      <view class="c-card-title">
                        <view class="c-flex">
                          <van-icon custom-class="c-card-icon" name="todo-list-o"></van-icon>
                          <text>{{ item.data.orderNum }}</text>
                          <van-tag
                            v-if="item.data && item.data.exts.workflowDefId"
                            :type="
                              item.data.exts.workflowDefId == '8191527117502723955'
                                ? 'danger'
                                : item.data.exts.workflowDefId == '20151276423303110'
                                ? 'primary'
                                : item.data.exts.workflowDefId == '7479703534058845803'
                                ? 'warning'
                                : ''
                            "
                            class="c-m-l-10 c-radius c-flex"
                            plain
                            round
                          >
                            {{
                              codelabel(
                                'select',
                                'serviceType',
                                (item.data && item.data.exts.workflowDefId) || ''
                              ) || ''
                            }}
                          </van-tag>
                          <van-tag
                            v-if="item.data && item.data.priority"
                            :type="renderTagType(item.data.priority)"
                            class="c-m-l-10 c-radius c-flex"
                            plain
                            round
                          >
                            {{
                              codelabel(
                                'select',
                                'priority',
                                (item.data && item.data.priority) || ''
                              ) || ''
                            }}
                          </van-tag>
                        </view>
                        <view class="c-yellow">
                          {{
                            codelabel('select', 'status', (item.data && item.data.status) || '') ||
                            ''
                          }}
                        </view>
                      </view>
                      <view class="c-card-content">
                        <view class="c-flex">
                          <text>客户名称：{{ item.data.name }}</text>
                          <van-icon
                            v-if="!item.data.phone"
                            class="c-red"
                            style="width: 80rpx"
                            @click.native.stop="
                              call(
                                '1',
                                null,
                                item.data.contactIds && item.data.contactIds[0]
                                  ? item.data.contactIds[0]
                                  : '',
                                item.data._id
                              )
                            "
                            name="phone"
                          />
                        </view>
                        <view class="c-flex" v-if="item.data.phone">
                          <text>联系客户：</text>
                          <van-icon
                            class="c-red"
                            style="width: 80rpx"
                            @click.native.stop="makeCall(item.data && item.data.phone)"
                            name="phone"
                          />
                        </view>
                        <view>
                          <text>详细地址：{{ item.data.address || '' }}</text>
                        </view>
                        <view>
                          <text>
                            信息渠道：{{
                              codelabel(
                                'cascade',
                                'channel',
                                (item.data && item.data.channel) || ''
                              ) || ''
                            }}
                          </text>
                        </view>
                        <view v-if="item.data.exts && item.data.exts.workflowDefId">
                          <text>
                            服务类型：{{
                              codelabel(
                                'select',
                                'serviceType',
                                (item.data && item.data.exts.workflowDefId) || ''
                              ) || ''
                            }}
                          </text>
                        </view>
                        <view v-if="item.data.exts && item.data.exts.applyTimeStr">
                          <text>上门时间：{{ item.data.exts.applyTimeStr }}</text>
                        </view>
                        <view v-if="item.data.describe">
                          <text>备注信息：{{ item.data.describe || '' }}</text>
                        </view>
                      </view>
                      <view
                        v-if="
                          item.state == 0 &&
                          (item.nodeDef.nodeType == 'allot' || item.nodeDef.nodeType == 'dispatch')
                        "
                      >
                        <view></view>
                        <van-button
                          v-if="item.nodeDef.nodeType == 'allot'"
                          round
                          custom-style="min-width:140rpx;height:40px;"
                          type="danger"
                          @click.native.stop="openSR(item)"
                        >
                          分单
                        </van-button>
                        <van-button
                          v-if="item.nodeDef.nodeType == 'dispatch'"
                          round
                          custom-style="min-width:140rpx;height:40px;"
                          type="danger"
                          @click.native.stop="openSR(item)"
                        >
                          派单
                        </van-button>
                      </view>
                      <view v-if="item.nodeDef.nodeType == 'accept' && item.state == 0">
                        <van-button
                          round
                          plain
                          custom-style="min-width:140rpx;height:40px;"
                          @click.native.stop="openReject(item.data._id, item._id)"
                        >
                          拒绝
                        </van-button>
                        <van-button
                          round
                          custom-style="min-width:140rpx;height:40px;"
                          type="danger"
                          @click.native.stop="accept(item.data._id, item._id)"
                        >
                          接单
                        </van-button>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </van-tab>
          </block>
        </block>
      </van-tabs>
    </view> -->

    <!-- 新列表 -->
    <view class="c-content">
      <view>
        <view
          :id="'listitem-' + func._id + '-' + j"
          v-for="(listitem, j) in boundings"
          :key="j"
          :style="{
            height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
            margin: '20rpx 0'
          }"
        >
          <view v-if="index - 1 <= j && j <= index + 1">
            <view
              class="c-card"
              v-for="(item, k) in list"
              :key="k"
              @tap="doOpen"
              :data-id="item._id"
            >
              <view class="c-card-title">
                <view class="c-flex">
                  <van-icon custom-class="c-card-icon" name="todo-list-o"></van-icon>
                  <text>{{ item.orderNum }}</text>
                  <!-- <van-tag
                    v-if="item.data && item.data.exts.workflowDefId"
                    :type="
                      item.data.exts.workflowDefId == '8191527117502723955'
                        ? 'danger'
                        : item.data.exts.workflowDefId == '20151276423303110'
                        ? 'primary'
                        : item.data.exts.workflowDefId == '7479703534058845803'
                        ? 'warning'
                        : ''
                    "
                    class="c-m-l-10 c-radius c-flex"
                    plain
                    round
                  >
                    {{
                      codelabel(
                        'select',
                        'serviceType',
                        (item.data && item.data.exts.workflowDefId) || ''
                      ) || ''
                    }}
                  </van-tag> -->
                  <van-tag
                    v-if="item && item.priority"
                    :type="renderTagType(item.priority)"
                    class="c-m-l-10 c-radius c-flex"
                    plain
                    round
                  >
                    {{ codelabel('select', 'priority', (item && item.priority) || '') || '' }}
                  </van-tag>
                </view>
                <view class="c-yellow">
                  {{ codelabel('select', 'status', (item && item.status) || '') || '' }}
                </view>
              </view>
              <view class="c-card-content">
                <view class="c-flex">
                  <text>客户名称：{{ item.name }}</text>
                  <van-icon
                    v-if="!item.phone"
                    class="c-red"
                    style="width: 80rpx"
                    @click.native.stop="
                      call(
                        '1',
                        null,
                        item.contactIds && item.contactIds[0] ? item.contactIds[0] : '',
                        item._id
                      )
                    "
                    name="phone"
                  />
                </view>
                <view class="c-flex" v-if="item.phone">
                  <text>联系客户：</text>
                  <van-icon
                    class="c-red"
                    style="width: 80rpx"
                    @click.native.stop="makeCall(item && item.phone)"
                    name="phone"
                  />
                </view>
                <view>
                  <text>详细地址：{{ item.address || '' }}</text>
                </view>
                <view>
                  <text>
                    信息渠道：{{
                      codelabel('cascade', 'channel', (item && item.channel) || '') || ''
                    }}
                  </text>
                </view>
                <view v-if="item.exts && item.exts.workflowDefId">
                  <text>
                    服务类型：{{
                      codelabel('select', 'serviceType', (item && item.exts.workflowDefId) || '') ||
                      ''
                    }}
                  </text>
                </view>
                <view v-if="item.exts && item.exts.applyTimeStr">
                  <text>上门时间：{{ item.exts.applyTimeStr }}</text>
                </view>
                <view v-if="item.describe">
                  <text>备注信息：{{ item.describe || '' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 分派资源弹出层 -->
    <!-- <van-popup :show="SR.show" position="bottom" custom-style="height: 100%">
      <view class="c-h-1 c-flex c-flex-col sr-popup">
        <view>
          <van-nav-bar
            :title="SR.workflowNode.nodeDef.name"
            left-text="返回"
            right-text="确认"
            left-arrow
            @click-left="cancelSR"
            @click-right="saveSR"
          />
          <van-search
            :value="SR.searchValue"
            clearable
            placeholder="请输入服务资源名称"
            @change="SRSearch"
            @clear="SRSearch"
          />
        </view>
        <view class="c-flex-1 c-auto-y">
          <van-radio-group :value="SR.selectId" @change="SRChange">
            <van-cell-group>
              <block v-for="(item, i) of SR.fpi.data" :key="i">
                <van-cell :title="item.name" clickable @click="SRClick(item)">
                  <van-radio slot="right-icon" :name="item._id" />
                </van-cell>
              </block>
            </van-cell-group>
          </van-radio-group>
        </view>
      </view>
    </van-popup> -->
    <!-- 拒绝接单弹出框 -->
    <!-- <van-dialog
      use-slot
      title="是否拒绝接单"
      :show="rejectObj.show"
      show-cancel-button
      @confirm="reject"
      @close="closeReject"
    >
      <van-field
        :value="rejectObj.remark"
        type="textarea"
        autosize
        placeholder="请输入拒绝原因"
        @change="rejectChange"
      />
    </van-dialog> -->

    <!-- 日期时间 -->
    <!-- <van-popup :show="datetime.show" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        :type="datetime.type"
        :value="datetime.value"
        @confirm="datetimeConfirm"
        @cancel="datetime.show = false"
      ></van-datetime-picker>
    </van-popup> -->
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      currentPhone: '', //当前登录人手机号
      windowHeight: '',
      reachBottom: false, //是否触底 正在刷新
      boundings: [], //外层列表每页数据的边界值
      index: 0, //当前页码
      list: [], //全部已获取数据

      fpi: {
        data: [],
        page: 1,
        rows: 10
      },
      searchValue: '',
      func: {
        count: 0
      },
      formData: {},
      statusMap: {},
      options: {
        codecfg_stage: {
          codeId: 'STAGE'
        },
        codecfg_status: {
          codeId: 'STATUS'
        },
        codecfg_priority: {
          codeId: 'PRIORITY'
        },
        codecfg_serviceType: {
          codeId: 'serviceType'
        },
        cascadeCode_channel: {
          codeId: 'channel'
        }
      },
      SR: {
        show: false,
        fpi: {},
        workflowNode: {
          nodeDef: {}
        },
        selectRow: {},
        selectId: '',
        searchValue: '',
        ids: [], //选择服务区域筛选出的关联的服务资源id
        resourceType: '', //筛选服务资源类型
        nodeType: '', //当前节点类型
        loading: false, //表格数据加载
        saveLoading: false //表格选中行数据提交（分单/派单）
      },
      // 省市区
      areaList: Object.assign({}, areajs.default),

      // 工单状态分类
      active: 'all', //当前激活的tab页
      activeShow: true,
      functionList: [],
      rejectObj: {
        sid: '',
        workflowNodeId: '',
        show: false,
        remark: ''
      },
      // onLoad onShow
      loadType: '',
      sortValue: '', //排序的值
      fields: [], //扩展字段
      tagType: {}, //标签属性
      filterSortingShow: false, //过滤/排序器
      dateTimeData: { dateTimeStart: '', dateTimeEnd: '' }, //时间排序
      // 时间选择器
      datetime: {
        show: false,
        type: '',
        value: new Date().getTime()
      },
      //过滤器的下拉菜单
      vanDropdownData: {
        open: false,
        index: ''
      },
      workflowDefId: '', //工单节点id
      functionType: [] //功能注册上维护的类型类型
    };
  },
  methods: {
    onLoad: function (param) {
      this.loadType = 'onLoad';
      this.doInit(param);
      // this.getData();
    },
    doInit(param) {
      common.osg.init(this, param, app);
      this.activeShow = false;
      this.getFields(() => {
        // this.getFunction();
      });
    },
    onSearch: function (e) {
      this.searchValue = e.detail;
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.getData();
    },
    // dataCount() {
    //   let currentFunctions = common.osg.get('currentFunctions');
    //   common.osg.ajax(
    //     '/function/dataCount',
    //     { functions: JSON.stringify(currentFunctions) },
    //     res => {
    //       this.statusMap = res.data;
    //     }
    //   );
    // },
    // getFunction() {
    //   this.dataCount();
    //   // 补tab页的工单状态值
    //   let functionList = common.osg.get('currentFunctions').filter(item => {
    //     return item.action.indexOf('serviceAppointment') != -1;
    //   });
    //   functionList.map(item => {
    //     let url = item.action;
    //     if (url.indexOf('?') != -1) {
    //       let paramsUrl = url.split('?')[1];
    //       let paramArr = paramsUrl.split('&');
    //       let params = {};
    //       paramArr.map(item => {
    //         params[item.split('=')[0]] = item.split('=')[1];
    //       });
    //       item.orderState = params.orderState;
    //       item.status = params.status || 'all';
    //       item.type = params.type || '';
    //     } else {
    //       item.status = 'all';
    //     }
    //   });
    //   this.functionList = functionList;
    //   this.active = app.globalData.funcId;
    //   // 解决不点击首页菜单直接通过底部导航进入工单列表
    //   if (app.globalData.funcId) {
    //     this.active = app.globalData.funcId;
    //   } else {
    //     this.functionList[0] = this.functionList[0] || {};
    //     this.active = this.functionList[0]._id;
    //   }

    //   for (let func of this.functionList) {
    //     if (func._id == this.active) {
    //       this.func = func;
    //       break;
    //     }
    //   }
    //   if (this.func.type && this.func.type == 'SANode') {
    //     this.getSANode();
    //   } else {
    //     if (this.func.orderState == 'all') {
    //       this.getSA();
    //     } else {
    //       this.getData();
    //     }
    //   }
    //   this.activeShow = true;
    //   this.$forceUpdate();
    // },
    // tabChange(e) {
    //   app.globalData.funcId = e.detail.name;

    //   for (let func of this.functionList) {
    //     if (func._id == e.detail.name) {
    //       this.func = func;
    //       this.active = e.detail.name;
    //       break;
    //     }
    //   }
    //   this.fpi.page = 1;
    //   this.fpi.rows = 10;
    //   this.list = [];
    //   this.boundings = [];
    //   this.index = 0;

    //   if (this.func.type && this.func.type == 'SANode') {
    //     this.getSANode();
    //   } else {
    //     if (this.func.orderState == 'all') {
    //       this.getSA();
    //     } else {
    //       this.getData();
    //     }
    //   }
    // },
    //点击时间
    onTimeClick(e) {
      let field = e.mp.target.dataset.keyname;
      this.datetime = {
        type: 'datetime',
        field,
        value: new Date().getTime(),
        show: true
      };
    },
    /**
     * 选择时间 提交
     */
    // datetimeConfirm(e, key) {
    //   let value = e.detail;
    //   this.dateTimeData[this.datetime.field] = this.formattTime(value);
    //   this.datetime.show = false;
    // },
    //时间格式转化
    // formattTime(dateValue) {
    //   let value = dateValue;
    //   if (typeof dateValue == 'object') {
    //     value == value.valueOf();
    //   }

    //   function zeroFill(num) {
    //     return num < 10 ? '0' + num : num;
    //   }
    //   let date = new Date(dateValue);
    //   let Y = date.getFullYear() + '-';
    //   let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    //   let D = date.getDate();
    //   let h = date.getHours();
    //   let m = date.getMinutes();
    //   let s = date.getSeconds();
    //   return Y + M + zeroFill(D) + ' ' + zeroFill(h) + ':' + zeroFill(m) + ':' + zeroFill(s);
    // },
    //切换排序
    sortMenuChange(e) {
      this.sortValue = e.detail;
    },
    dropdownCloseItem(index) {
      // if (this.vanDropdownData.index!=2 && index!=3){
      this.vanDropdownData.open = false;
      // debugger
      // if(this.vanDropdownData.index == 2) debugger
      // }
      this.vanDropdownData.index = index;
    },
    dropdownOpenItem(index) {
      // if (this.vanDropdownData.index!=1 && index!=4){
      this.vanDropdownData.open = true;
      // debugger
      // }
      this.vanDropdownData.index = index;
    },
    //应用过滤排序条件
    application() {
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.getData();
      this.filterSortingShow = false;
    },
    // getSA: function (type) {
    //   let that = this;

    //   if (this.fpi.page == 1) {
    //     this.list = [];
    //     this.boundings = [];
    //     this.index = 0;
    //   }

    //   var params = {
    //     page: this.fpi.page,
    //     rows: this.fpi.rows,
    //     sortField: 'createTime',
    //     sortOrder: 'desc',
    //     'regex:title|string#or': this.searchValue,
    //     'regex:name|string#or': this.searchValue,
    //     'regex:photo|string#or': this.searchValue,
    //     'regex:address|string#or': this.searchValue,
    //     'regex:describe|string#or': this.searchValue,
    //     'regex:orderNum|string#or': this.searchValue,
    //     'in:status|array#and': this.func.status == 'all' ? null : this.func.status || '',
    //     'is:exts.supervisorPhone|string#and': this.currentPhone
    //   };
    //   //按优先级最高排序
    //   if (this.sortValue == 'priority') {
    //     params['sortField'] = 'priority,createTime';
    //     params['sortOrder'] = 'desc';
    //   } else if (this.sortValue == 'upTime') {
    //     params['sortField'] = 'exts.applyTimeStr,createTime';
    //     params['sortOrder'] = 'asc';
    //   }
    //   params['gte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeStart;
    //   params['lte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeEnd;
    //   common.osg.ajax('basic/serviceAppointment/query.do', params, res => {
    //     this.fpi.pages = res.pages;

    //     let data = [];
    //     res.data.map(item => {
    //       data.push({
    //         data: item
    //       });
    //     });
    //     res.data = data;

    //     if (res.data.length == 0) {
    //       wx.stopPullDownRefresh();
    //       if (this.fpi.page > 1) {
    //         this.fpi.page--;
    //         this.index--;
    //       }
    //       this.$forceUpdate();
    //       this.reachBottom = false;
    //       common.osg.toast('没有更多数据', 'none', 5000);
    //       return;
    //     }
    //     let index = this.fpi.page - 1;
    //     this.list.push(res.data);
    //     this.boundings.push({});

    //     this.$nextTick(() => {
    //       setTimeout(() => {
    //         //计算并记录外层列表数据的边界值
    //         this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
    //         wx.createSelectorQuery()
    //           .select(`#listitem-${this.func._id}-${index}`)
    //           .boundingClientRect(rect => {
    //             if (rect) {
    //               that.boundings[index] = {
    //                 height: rect.height,
    //                 top:
    //                   index == 0
    //                     ? rect.top
    //                     : that.boundings[index - 1].top + that.boundings[index - 1].height,
    //                 bottom:
    //                   index == 0 ? rect.bottom : that.boundings[index - 1].bottom + rect.height
    //               };
    //             }
    //           })
    //           .exec();
    //         wx.stopPullDownRefresh();
    //         this.reachBottom = false;
    //       }, 300);
    //     });
    //   });
    // },
    getData: function (type) {
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }

      var params = {
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('basic/serviceAppointment/query.do', params, res => {
        // this.fpi.pages = res.pages;

        if (res.length == 0) {
          wx.stopPullDownRefresh();
          if (this.fpi.page > 1) {
            this.fpi.page--;
            this.index--;
          }
          this.$forceUpdate();
          this.reachBottom = false;
          common.osg.toast('没有更多数据', 'none', 5000);
          return;
        }
        // let index = this.fpi.page - 1;
        this.list = res;
        this.boundings.push({});

        this.$nextTick(() => {
          setTimeout(() => {
            //计算并记录外层列表数据的边界值
            this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
            wx.createSelectorQuery()
              .select(`#listitem-${this.func._id}-${index}`)
              .boundingClientRect(rect => {
                if (rect) {
                  that.boundings[index] = {
                    height: rect.height,
                    top:
                      index == 0
                        ? rect.top
                        : that.boundings[index - 1].top + that.boundings[index - 1].height,
                    bottom:
                      index == 0 ? rect.bottom : that.boundings[index - 1].bottom + rect.height
                  };
                }
              })
              .exec();
            wx.stopPullDownRefresh();
            this.reachBottom = false;
          }, 300);
        });
      });
    },
    // getSANode: function (process) {
    //   let that = this;

    //   if (this.fpi.page == 1) {
    //     this.list = [];
    //     this.boundings = [];
    //     this.index = 0;
    //   }

    //   var params = {
    //     page: this.fpi.page,
    //     rows: this.fpi.rows,
    //     sortField: 'updateTime',
    //     sortOrder: 'desc',
    //     orderState: this.func.orderState || '',
    //     'regex:title|string#or': this.searchValue,
    //     'regex:name|string#or': this.searchValue,
    //     'regex:photo|string#or': this.searchValue,
    //     'regex:address|string#or': this.searchValue,
    //     'regex:describe|string#or': this.searchValue,
    //     'regex:orderNum|string#or': this.searchValue,
    //     'in:status|array#and': this.func.status == 'all' ? null : this.func.status || '',
    //     // 'is:exts.workflowDefId|string#and': this.functionType
    //     'is:exts.supervisorPhone|string#and': this.currentPhone
    //   };

    //   //按优先级最高排序
    //   if (this.sortValue == 'priority') {
    //     params['sortField'] = 'priority,createTime';
    //     params['sortOrder'] = 'desc';
    //   } else if (this.sortValue == 'upTime') {
    //     params['sortField'] = 'exts.applyTimeStr,createTime';
    //     params['sortOrder'] = 'asc';
    //   }
    //   params['gte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeStart;
    //   params['lte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeEnd;

    //   common.osg.ajax('basic/serviceAppointment/querySAWorkflowNode.do', params, res => {
    //     if (res.data.length == 0) {
    //       wx.stopPullDownRefresh();
    //       if (this.fpi.page > 1) {
    //         this.fpi.page--;
    //         this.index--;
    //       }
    //       // this.fpi.page--;
    //       // if (this.fpi.page <= 1) {
    //       //   this.list = [];
    //       //   this.boundings = [];
    //       //   this.fpi.page = 1;
    //       //   this.index = 0;
    //       //   this.getSANode();
    //       // }
    //       this.$forceUpdate();
    //       this.reachBottom = false;
    //       common.osg.toast('没有更多数据', 'none', 5000);
    //       return;
    //     }
    //     let index = this.fpi.page - 1;
    //     if (process) {
    //       this.list[index] = res.data;
    //       this.boundings[index] = {};
    //     } else {
    //       this.list.push(res.data);
    //       this.boundings.push({});
    //     }
    //     this.$forceUpdate();

    //     this.$nextTick(() => {
    //       setTimeout(() => {
    //         //计算并记录外层列表数据的边界值
    //         this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
    //         wx.createSelectorQuery()
    //           .select(`#listitem-${this.func._id}-${index}`)
    //           .boundingClientRect(rect => {
    //             if (rect) {
    //               that.boundings[index] = {
    //                 height: rect.height,
    //                 top:
    //                   index == 0
    //                     ? rect.top
    //                     : that.boundings[index - 1].top + that.boundings[index - 1].height,
    //                 bottom:
    //                   index == 0 ? rect.bottom : that.boundings[index - 1].bottom + rect.height
    //               };
    //             }
    //           })
    //           .exec();
    //         wx.stopPullDownRefresh();
    //         this.reachBottom = false;
    //       }, 300);
    //     });
    //   });
    // },
    //获取工单扩展
    getFields(callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          colName: 'serviceAppointment',
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          for (let field of res.data) {
            //解析frontEndConfig字段配置
            if (field.frontEndConfig && common.osg.isJson(field.frontEndConfig)) {
              field.frontEndConfig = JSON.parse(field.frontEndConfig);
            } else {
              field.frontEndConfig = {};
            }
            field.showList = field.showList || [];
            //列表展示字段 关联字典表codeType放到options,之后从字典表查询
            // field.showList.indexOf('3') != -1
            if (field.valueOption) {
              if (field.type == 'cascade') {
                this.options['cascadeCode_' + field.valueOption] = {
                  codeId: field.valueOption
                };
              } else {
                this.options['codecfg_' + field.valueOption] = {
                  codeId: field.valueOption
                };
              }
            }
            if (field.frontEndConfig.tagType) this.tagType = field.frontEndConfig.tagType;
            // 过滤器选中项
            field.value = [];
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
    doOpen: function (e) {
      common.osg.open('newServiceAppointment', {
        id: e.currentTarget.dataset.id
      });
    },
    /**
     * 打开分派单弹窗
     */
    // openSR(row) {
    //   this.workflowDefId = row.data.exts.workflowDefId;
    //   if (common.osg.isRepeatClick('openSR')) {
    //     return; //判断是否重复点击
    //   }
    //   this.SR.workflowNode = row;
    //   this.getSRs();
    //   this.SR.show = true;
    // },
    /**
     * 服务资源
     */
    // SRSearch(e) {
    //   this.SR.searchValue = e.detail;
    //   this.SR.selectId = '';
    //   this.SR.selectRow = {};
    //   this.getSRs();
    // },
    // getSRs() {
    //   common.osg.ajax(
    //     'biz/serviceResource/query',
    //     {
    //       _all: '1',
    //       sortField: 'createTime',
    //       sortOrder: 'desc',
    //       'regex:name|string#and': this.SR.searchValue,
    //       'is:state|integer#and': 1,
    //       'in:resourceType|array#and':
    //         this.SR.workflowNode.nodeDef.resourceType &&
    //         this.SR.workflowNode.nodeDef.resourceType.join(),
    //       'in:resourceRoles|array#and':
    //         this.SR.workflowNode.nodeDef.resourceRoles &&
    //         this.SR.workflowNode.nodeDef.resourceRoles.join(),
    //       'in:serviceType|string#and': this.workflowDefId //工单所对应服务类型
    //     },
    //     res => {
    //       this.SR.fpi = res;
    //     }
    //   );
    // },
    // SRClick(row) {
    //   this.SR.selectId = row._id;
    //   this.SR.selectRow = row;
    // },
    // SRChange(e) {
    //   this.SR.selectId = e.detail;
    // },
    // saveSR() {
    //   if (!this.SR.selectId) {
    //     common.osg.toast('请选择服务资源', 'none');
    //     return;
    //   }
    //   common.osg.confirm(
    //     `是否确认选择 ${this.SR.selectRow.name} ？`,
    //     () => {
    //       if (common.osg.isRepeatClick('saveSR')) {
    //         common.osg.toast('操作过于频繁', 'none');
    //         return;
    //       }
    //       this.process();
    //     },
    //     this.SR.workflowNode.nodeDef.name
    //   );
    // },
    // process() {
    //   let params = {
    //     sid: this.SR.workflowNode.data._id,
    //     smodule: 'serviceAppointment',
    //     workflowNodeId: this.SR.workflowNode._id
    //   };
    //   if (
    //     this.SR.selectRow.resourceType == 'partner' ||
    //     this.SR.selectRow.resourceType == 'serviceCrew'
    //   ) {
    //     params.currentOrgId = this.SR.selectRow.serviceCrewId;
    //   } else {
    //     params.handlerId = this.SR.selectRow.relatedRecordId;
    //   }
    //   common.osg.ajax('workflow/process', params, res => {
    //     if (this.func.type && this.func.type == 'SANode') {
    //       this.getSANode('process');
    //     } else {
    //       if (this.func.orderState == 'all') {
    //         this.getSA('process');
    //       } else {
    //         this.getData('process');
    //       }
    //     }
    //     this.cancelSR();
    //   });
    // },
    // cancelSR() {
    //   this.SR = {
    //     show: false,
    //     fpi: {},
    //     workflowNode: {
    //       nodeDef: {}
    //     },
    //     selectRow: {},
    //     selectId: '',
    //     searchValue: '',
    //     ids: [], //选择服务区域筛选出的关联的服务资源id
    //     resourceType: '', //筛选服务资源类型
    //     nodeType: '', //当前节点类型
    //     loading: false, //表格数据加载
    //     saveLoading: false //表格选中行数据提交（分单/派单）
    //   };
    // },
    /**
     * 接单/处理工作流节点
     */
    // accept(sid, workflowNodeId) {
    //   if (common.osg.isRepeatClick('accept')) {
    //     return; //判断是否重复点击
    //   }
    //   common.osg.ajax(
    //     'workflow/process',
    //     {
    //       sid,
    //       workflowNodeId,
    //       smodule: 'serviceAppointment'
    //     },
    //     res => {
    //       if (this.func.type && this.func.type == 'SANode') {
    //         this.getSANode('process');
    //       } else {
    //         if (this.func.orderState == 'all') {
    //           this.getSA('process');
    //         } else {
    //           this.getData('process');
    //         }
    //       }
    //     }
    //   );
    // },
    /**
     * 点击拒绝
     */
    // openReject(sid, workflowNodeId) {
    //   if (common.osg.isRepeatClick('reject')) {
    //     return; //判断是否重复点击
    //   }
    //   this.rejectObj = {
    //     sid,
    //     workflowNodeId,
    //     remark: '',
    //     show: true
    //   };
    // },
    /**
     * 取消拒绝
     */
    // closeReject() {
    //   this.rejectObj.show = false;
    // },
    /**
     * 填写拒绝原因
     */
    // rejectChange(e) {
    //   this.rejectObj.remark = e.detail;
    // },
    /**
     * 确认决绝/工作流回退
     */
    // reject() {
    //   if (!this.rejectObj.remark) {
    //     common.osg.toast('请填写拒绝原因', 'none');
    //     return;
    //   }
    //   let params = {
    //     sid: this.rejectObj.sid,
    //     workflowNodeId: this.rejectObj.workflowNodeId,
    //     remark: this.rejectObj.remark,
    //     smodule: 'serviceAppointment'
    //   };
    //   common.osg.ajax('workflow/rollbackWorkflow', params, res => {
    //     if (this.func.type && this.func.type == 'SANode') {
    //       this.getSANode();
    //     } else {
    //       if (this.func.orderState == 'all') {
    //         this.getSA();
    //       } else {
    //         this.getData();
    //       }
    //     }
    //   });
    // },
    codelabel(type, option, val) {
      if (!val) return;
      if (type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
      }
    },
    /**
     * 拨打电话
     */
    // call(type, callerId, calleeId, sid) {
    //   common.osg.ajax(
    //     'basic/winnerlook/getMiddleNumber',
    //     {
    //       type,
    //       callerId: callerId || common.osg.currentUser()._id,
    //       calleeId: calleeId,
    //       sid
    //     },
    //     res => {
    //       this.makeCall(res.data.phoneNumberX);
    //     }
    //   );
    // },
    // makeCall(phoneNumber) {
    //   wx.makePhoneCall({
    //     phoneNumber: phoneNumber
    //   });
    // },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.fpi.page = 1;
      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all') {
          this.getSA();
        } else {
          this.getData();
        }
      }
    },
    onReachBottom() {
      if (!this.reachBottom) {
        this.reachBottom = true;
        this.fpi.page++;
        this.getData();
        // if (this.func.type && this.func.type == 'SANode') {
        //   this.getSANode();
        // } else {
        //   if (this.func.orderState == 'all') {
        //     this.getSA();
        //   } else {
        //     this.getData();
        //   }
        // }
      }
    },
    //滚动监听
    onPageScroll(e) {
      if (this.reachBottom) return;

      // 窗口高度
      this.windowHeight = this.windowHeight
        ? this.windowHeight
        : wx.getSystemInfoSync().windowHeight;

      // 循环每页高度
      for (let i = 0; i < this.boundings.length; i++) {
        // 如果没有在屏幕中，并且视野的高度小于我的结尾位置距离顶部的距离，也就是说，这个dom是我正在查看的dom
        if (
          this.boundings[i].top < e.scrollTop + this.windowHeight &&
          e.scrollTop + this.windowHeight <= this.boundings[i].bottom
        ) {
          this.index = i;
          break;
        }
      }
    },
    //渲染标签
    renderTagType(value) {
      if (value) {
        return this.tagType[value];
      } else {
        return 'primary';
      }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      let _currentUser = common.osg.get('_currentUser');
      this.currentPhone = _currentUser.user.phone;
      console.log(this.currentPhone, '---this.currentPhone');
      this.getData();
      //   this.functionType = common.osg.get('functionTypeValue');
      //   console.log(this.functionType, '-------拿到缓存中的this.functionType');
      if (this.loadType == 'onLoad') {
        this.loadType = 'onShow';
        return;
      }

      this.doInit({});
    }
  }
};
</script>
<style>
.c-content {
  margin-top: 44px;
}

.sr-popup .van-cell__title,
.van-cell__value {
  -webkit-flex: auto;
  flex: auto;
  max-width: none !important;
}

.tabclass {
  font-size: 18px !important;
  min-width: 20vw !important;
  margin-top: 10rpx;
}
</style>
