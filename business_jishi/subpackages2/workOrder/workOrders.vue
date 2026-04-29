<template>
  <view @click.capture="track">
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
            :data-event="{ id: '0_v6FJ3ZgR' }"
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
          <van-dropdown-menu active-color="#d6000f">
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
                  plain
                  @click="filterSortingShow = false"
                  :data-event="{ id: 'pSL99wpy0h' }"
                >
                  关闭
                </van-button>
                <van-button
                  round
                  plain
                  @click="
                    dateTimeData.dateTimeStart = '';
                    dateTimeData.dateTimeEnd = '';
                  "
                  :data-event="{ id: 'KNxzlhzdyL' }"
                >
                  清空
                </van-button>
                <van-button
                  round
                  type="info"
                  @click="application"
                  :data-event="{ id: '3yxW6ia9ZY' }"
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
            :data-event="{ id: 'ky-F-MfAjT' }"
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
            :data-event="{ id: 'ebEzVTEjnB' }"
          >
            清空
          </van-button>
          <van-button
            round
            custom-style="width:40vw;height:80rpx;"
            type="info"
            @click="application"
            :data-event="{ id: 'wR-_3Mu9eG' }"
          >
            应用
          </van-button>
        </view>
      </view>
    </van-popup>

    <!-- 列表 -->
    <view class="c-content">
      <van-tabs
        swipeable
        @change="tabChange"
        :active="active"
        sticky
        offset-top="44"
        v-if="activeShow"
        :ellipsis="false"
        tab-class="tabclass"
        :data-event="{ id: 'sA__IEYCzI', capture: false }"
      >
        <van-tab
          :title="func.name"
          v-for="(func, i) in functionList"
          :key="i"
          :name="func._id"
          :info="functionCount[func._id]"
        >
          <van-notice-bar
            v-if="dateTimeData.dateTimeStart || dateTimeData.dateTimeEnd"
            wrapable
            :scrollable="false"
            :text="`上门时间在：${dateTimeData.dateTimeStart} ~ ${dateTimeData.dateTimeEnd}`"
            :data-event="{ id: 'sA__IEYCzI' }"
          />
          <view :data-event="{ id: 'sA__IEYCzI' }">
            <view
              :id="'listitem-' + func._id + '-' + j"
              v-for="(listitem, j) in boundings"
              :key="j"
              :style="{
                height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
                margin: '20rpx 0'
              }"
              :data-event="{ id: 'sA__IEYCzI' }"
            >
              <view v-if="index - 1 <= j && j <= index + 1" :data-event="{ id: 'sA__IEYCzI' }">
                <view
                  class="c-card"
                  v-for="(item, k) in list[j]"
                  :key="k"
                  @tap="doOpen"
                  :data-id="item.data._id"
                  :data-event="{ id: 'sA__IEYCzI' }"
                >
                  <view class="c-card-title" :data-event="{ id: 'sA__IEYCzI' }">
                    <view class="c-flex" :data-event="{ id: 'sA__IEYCzI' }">
                      <van-icon
                        custom-class="c-card-icon"
                        name="todo-list-o"
                        :data-event="{ id: 'sA__IEYCzI' }"
                      ></van-icon>
                      <text :data-event="{ id: 'sA__IEYCzI' }">{{ item.data.code }}</text>
                      <van-tag
                        v-if="item.data && item.data.priority"
                        :type="renderTagType(item.data.priority)"
                        size="medium"
                        mark
                        custom-class="c-m-l-10 c-radius"
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
                    <view class="c-orange" :data-event="{ id: 'sA__IEYCzI' }">
                      {{
                        codelabel(
                          'select',
                          'workOrderStatus',
                          (item.data && item.data.status) || ''
                        ) || ''
                      }}
                    </view>
                  </view>
                  <view class="c-card-content" :data-event="{ id: 'sA__IEYCzI' }">
                    <view class="c-flex" :data-event="{ id: 'sA__IEYCzI' }">
                      <text :data-event="{ id: 'sA__IEYCzI' }">客户名称：{{ item.data.name }}</text>
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
                        :data-event="{ id: 'yR6UoCIMaN' }"
                      />
                    </view>
                    <view class="c-flex" v-if="item.data.phone" :data-event="{ id: 'sA__IEYCzI' }">
                      <text :data-event="{ id: 'sA__IEYCzI' }">联系客户</text>
                      <van-icon
                        class="c-red"
                        style="width: 80rpx"
                        @click.native.stop="makeCall(item.data && item.data.phone)"
                        name="phone"
                        :data-event="{ id: 'uHefvPjaig' }"
                      />
                    </view>
                    <view :data-event="{ id: 'sA__IEYCzI' }">
                      <text :data-event="{ id: 'sA__IEYCzI' }">
                        详细地址：{{ item.data.address || '' }}
                      </text>
                    </view>
                    <view v-if="item.data.exts.type" :data-event="{ id: 'sA__IEYCzI' }">
                      <text :data-event="{ id: 'sA__IEYCzI' }">
                        工单类型：{{ codelabel('select', 'workOrderType', item.data.exts.type) }}
                      </text>
                    </view>
                    <view v-if="item.data.memo" :data-event="{ id: 'sA__IEYCzI' }">
                      <text :data-event="{ id: 'sA__IEYCzI' }">
                        备注信息：{{ item.data.memo || '' }}
                      </text>
                    </view>
                  </view>
                  <view
                    v-if="
                      item.state == 0 &&
                      (item.nodeDef.nodeType == 'allot' || item.nodeDef.nodeType == 'dispatch')
                    "
                    :data-event="{ id: 'sA__IEYCzI' }"
                  >
                    <view :data-event="{ id: 'sA__IEYCzI' }"></view>
                    <van-button
                      v-if="item.nodeDef.nodeType == 'allot'"
                      round
                      type="info"
                      size="mini"
                      @click.native.stop="openSR(item)"
                      :data-event="{ id: 'c6RZZVYIAG' }"
                    >
                      分单
                    </van-button>
                    <van-button
                      v-if="item.nodeDef.nodeType == 'dispatch'"
                      round
                      type="info"
                      size="mini"
                      @click.native.stop="openSR(item)"
                      :data-event="{ id: 'OU4EeKoUwW' }"
                    >
                      派单
                    </van-button>
                  </view>
                  <view
                    v-if="item.nodeDef.nodeType == 'accept' && item.state == 0"
                    :data-event="{ id: 'sA__IEYCzI' }"
                  >
                    <van-button
                      round
                      plain
                      custom-style="min-width:140rpx;height:40px;"
                      @click.native.stop="openReject(item.data._id, item._id)"
                      :data-event="{ id: 'Pr7TvMdtkc' }"
                    >
                      拒绝
                    </van-button>
                    <van-button
                      round
                      type="info"
                      size="mini"
                      @click.native.stop="accept(item.data._id, item._id)"
                      :data-event="{ id: 'mJEPgSF20Q' }"
                    >
                      接单
                    </van-button>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </van-tab>
      </van-tabs>
    </view>

    <!-- 分派资源弹出层 -->
    <van-popup :show="SR.show" position="bottom" custom-style="height: 100%">
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
    </van-popup>
    <!-- 拒绝接单弹出框 -->
    <van-dialog
      use-slot
      title="是否拒绝接单"
      :show="rejectObj.show"
      show-cancel-button
      @confirm="reject"
      @close="closeReject"
      :data-event="{ id: 'TwlKTJSWP7', capture: false }"
    >
      <van-field
        :value="rejectObj.remark"
        type="textarea"
        autosize
        placeholder="请输入拒绝原因"
        @change="rejectChange"
      />
    </van-dialog>

    <!-- 日期时间 -->
    <van-popup :show="datetime.show" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        :type="datetime.type"
        :value="datetime.value"
        @confirm="datetimeConfirm"
        @cancel="datetime.show = false"
      ></van-datetime-picker>
    </van-popup>
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
      functionCount: {},
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

      // 售后工单状态分类
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
      }
    };
  },
  methods: {
    onLoad: function (param) {
      this.loadType = 'onLoad';
      this.doInit(param);
    },
    doInit(param) {
      common.osg.init(this, param, app);
      this.activeShow = false;
      this.getFields(() => {
        this.getFunction();
      });
    },
    onSearch: function (e) {
      this.searchValue = e.detail;
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;

      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
          this.getSA();
        } else {
          this.getData();
        }
      }
    },
    getFunctionCount() {
      let currentRoleFunctions = wx.getStorageSync('currentRoleFunctions');
      common.osg.ajax(
        '/function/dataCount',
        { functions: JSON.stringify(currentRoleFunctions) },
        res => {
          this.functionCount = res.data;
        }
      );
    },
    getFunction() {
      let menu = wx.getStorageSync('menu');
      if (!menu) return;
      let functionList = menu.functionList.filter(item => {
        return item.action.indexOf('workOrder') != -1;
      });
      functionList.map(item => {
        let url = item.action;
        if (url) {
          if (url.indexOf('?') != -1) {
            let paramsUrl = url.split('?')[1];
            let paramArr = paramsUrl.split('&');
            let params = {};
            paramArr.map(item => {
              params[item.split('=')[0]] = item.split('=')[1];
            });
            item.orderState = params.orderState;
            item.status = params.status || 'all';
            item.type = params.type || '';
          } else {
            item.status = 'all';
          }
        }
      });
      this.functionList = functionList;
      this.active = app.globalData.funcId;
      // 解决不点击首页菜单直接通过底部导航进入售后工单列表
      if (app.globalData.funcId) {
        this.active = app.globalData.funcId;
      } else {
        this.functionList[0] = this.functionList[0] || {};
        this.active = this.functionList[0]._id;
      }

      for (let func of this.functionList) {
        if (func._id == this.active) {
          this.func = func;
          break;
        }
      }
      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
          this.getSA();
        } else {
          this.getData();
        }
      }
      this.activeShow = true;
      this.$forceUpdate();
    },
    tabChange(e) {
      app.globalData.funcId = e.detail.name;

      for (let func of this.functionList) {
        if (func._id == e.detail.name) {
          this.func = func;
          this.active = e.detail.name;
          break;
        }
      }
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;

      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
          this.getSA();
        } else {
          this.getData();
        }
      }
    },
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
    datetimeConfirm(e, key) {
      let value = e.detail;
      this.dateTimeData[this.datetime.field] = this.formattTime(value);
      this.datetime.show = false;
    },
    //时间格式转化
    formattTime(dateValue) {
      let value = dateValue;
      if (typeof dateValue == 'object') {
        value == value.valueOf();
      }

      function zeroFill(num) {
        return num < 10 ? '0' + num : num;
      }
      let date = new Date(dateValue);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      return Y + M + zeroFill(D) + ' ' + zeroFill(h) + ':' + zeroFill(m) + ':' + zeroFill(s);
    },
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
      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
          this.getSA();
        } else {
          this.getData();
        }
      }
      this.filterSortingShow = false;
    },
    getSA: function (type) {
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }

      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'createTime',
        sortOrder: 'desc',
        'in:concernUserIds|array#and':
          this.func.orderState == 'concern' ? wx.getStorageSync('user')._id : null, // 查询我关注的工单
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:photo|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:memo|string#or': this.searchValue,
        'regex:code|string#or': this.searchValue,
        'in:status|array#and': this.func.status == 'all' ? null : this.func.status || ''
      };

      //按优先级最高排序
      if (this.sortValue == 'priority') {
        params['sortField'] = 'priority,createTime';
        params['sortOrder'] = 'desc';
      } else if (this.sortValue == 'upTime') {
        params['sortField'] = 'exts.applyTimeStr,createTime';
        params['sortOrder'] = 'asc';
      }
      params['gte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeStart;
      params['lte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeEnd;
      common.osg.ajax('basic/workOrder/query.do', params, res => {
        this.fpi.pages = res.pages;

        let data = [];
        res.data.map(item => {
          data.push({
            data: item
          });
        });
        res.data = data;

        if (res.data.length == 0) {
          wx.stopPullDownRefresh();
          this.fpi.page--;
          this.reachBottom = false;
          if (this.fpi.page < 1) {
            this.list = [];
            this.boundings = [];
            this.fpi.page = 1;
            this.index = 0;
          }
          this.$forceUpdate();
          common.osg.toast('没有更多数据', 'none', 5000);
          return;
        }
        let index = this.fpi.page - 1;
        this.list.push(res.data);
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
    getData: function (type) {
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }

      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'createTime',
        sortOrder: 'desc',
        orderState: this.func.orderState || 'todo', //'todo'、’done‘、‘’
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:photo|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:memo|string#or': this.searchValue,
        'regex:code|string#or': this.searchValue,
        'in:status|array#and': this.func.status == 'all' ? null : this.func.status || ''
      };
      //按优先级最高排序
      if (this.sortValue == 'priority') {
        params['sortField'] = 'priority,createTime';
        params['sortOrder'] = 'desc';
      } else if (this.sortValue == 'upTime') {
        params['sortField'] = 'exts.applyTimeStr,createTime';
        params['sortOrder'] = 'asc';
      }
      params['gte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeStart;
      params['lte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeEnd;
      common.osg.ajax('basic/workOrder/queryWorkflowNode.do', params, res => {
        this.fpi.pages = res.pages;

        if (res.data.length == 0) {
          wx.stopPullDownRefresh();
          this.fpi.page--;
          this.reachBottom = false;
          if (this.fpi.page <= 1) {
            this.list = [];
            this.boundings = [];
            this.fpi.page = 1;
            this.index = 0;
          }
          this.$forceUpdate();
          common.osg.toast('没有更多数据', 'none', 5000);
          return;
        }
        let index = this.fpi.page - 1;
        this.list.push(res.data);
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
    getSANode: function (process) {
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }

      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'updateTime',
        sortOrder: 'desc',
        orderState: this.func.orderState || '',
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:photo|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:memo|string#or': this.searchValue,
        'regex:code|string#or': this.searchValue,
        'in:status|array#and': this.func.status == 'all' ? null : this.func.status || ''
      };

      //按优先级最高排序
      if (this.sortValue == 'priority') {
        params['sortField'] = 'priority,createTime';
        params['sortOrder'] = 'desc';
      } else if (this.sortValue == 'upTime') {
        params['sortField'] = 'exts.applyTimeStr,createTime';
        params['sortOrder'] = 'asc';
      }
      params['gte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeStart;
      params['lte:exts.applyTimeStr|string#and'] = this.dateTimeData.dateTimeEnd;

      common.osg.ajax('basic/workOrder/querySAWorkflowNode.do', params, res => {
        if (res.data.length == 0) {
          wx.stopPullDownRefresh();
          this.fpi.page--;
          this.reachBottom = false;
          let test = this.fpi;
          if (this.fpi.page <= 1) {
            this.list = [];
            this.boundings = [];
            this.fpi.page = 1;
            this.index = 0;
          }
          this.$forceUpdate();
          common.osg.toast('没有更多数据', 'none', 5000);
          return;
        }
        let index = this.fpi.page - 1;
        if (process) {
          this.list[index] = res.data;
          this.boundings[index] = {};
        } else {
          this.list.push(res.data);
          this.boundings.push({});
        }
        this.$forceUpdate();

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
    //获取售后工单扩展
    getFields(callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          colName: 'workOrder',
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
      common.osg.open('workOrder', {
        id: e.currentTarget.dataset.id
      });
    },
    /**
     * 打开分派单弹窗
     */
    openSR(row) {
      if (common.osg.isRepeatClick('openSR')) {
        return; //判断是否重复点击
      }
      this.SR.workflowNode = row;
      this.getSRs();
      this.SR.show = true;
    },
    /**
     * 服务资源
     */
    SRSearch(e) {
      this.SR.searchValue = e.detail;
      this.SR.selectId = '';
      this.SR.selectRow = {};
      this.getSRs();
    },
    getSRs() {
      common.osg.ajax(
        'biz/serviceResource/query',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'regex:name|string#and': this.SR.searchValue,
          'is:state|integer#and': 1,
          'in:resourceType|array#and':
            this.SR.workflowNode.nodeDef.resourceType &&
            this.SR.workflowNode.nodeDef.resourceType.join(),
          'in:resourceRoles|array#and':
            this.SR.workflowNode.nodeDef.resourceRoles &&
            this.SR.workflowNode.nodeDef.resourceRoles.join()
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
      common.osg.confirm(
        `是否确认选择 ${this.SR.selectRow.name} ？`,
        () => {
          if (common.osg.isRepeatClick('saveSR')) {
            common.osg.toast('操作过于频繁', 'none');
            return;
          }
          this.process();
        },
        {
          title: this.SR.workflowNode.nodeDef.name
        }
      );
    },
    process() {
      let params = {
        sid: this.SR.workflowNode.data._id,
        smodule: 'workOrder',
        workflowNodeId: this.SR.workflowNode._id
      };
      if (
        this.SR.selectRow.resourceType == 'partner' ||
        this.SR.selectRow.resourceType == 'serviceCrew'
      ) {
        params.currentOrgId = this.SR.selectRow.serviceCrewId;
      } else {
        params.handlerId = this.SR.selectRow.relatedRecordId;
      }
      common.osg.ajax('workflow/process', params, res => {
        if (this.func.type && this.func.type == 'SANode') {
          this.getSANode('process');
        } else {
          if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
            this.getSA('process');
          } else {
            this.getData('process');
          }
        }
        this.cancelSR();
      });
    },
    cancelSR() {
      this.SR = {
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
      };
    },
    /**
     * 接单/处理工作流节点
     */
    accept(sid, workflowNodeId) {
      if (common.osg.isRepeatClick('accept')) {
        return; //判断是否重复点击
      }
      common.osg.ajax(
        'workflow/process',
        {
          sid,
          workflowNodeId,
          smodule: 'workOrder'
        },
        res => {
          if (this.func.type && this.func.type == 'SANode') {
            this.getSANode('process');
          } else {
            if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
              this.getSA('process');
            } else {
              this.getData('process');
            }
          }
        }
      );
    },
    /**
     * 点击拒绝
     */
    openReject(sid, workflowNodeId) {
      if (common.osg.isRepeatClick('reject')) {
        return; //判断是否重复点击
      }
      this.rejectObj = {
        sid,
        workflowNodeId,
        remark: '',
        show: true
      };
    },
    /**
     * 取消拒绝
     */
    closeReject() {
      this.rejectObj.show = false;
    },
    /**
     * 填写拒绝原因
     */
    rejectChange(e) {
      this.rejectObj.remark = e.detail;
    },
    /**
     * 确认决绝/工作流回退
     */
    reject() {
      if (!this.rejectObj.remark) {
        common.osg.toast('请填写拒绝原因', 'none');
        return;
      }
      let params = {
        sid: this.rejectObj.sid,
        workflowNodeId: this.rejectObj.workflowNodeId,
        remark: this.rejectObj.remark,
        smodule: 'workOrder'
      };
      common.osg.ajax('workflow/rollbackWorkflow', params, res => {
        if (this.func.type && this.func.type == 'SANode') {
          this.getSANode();
        } else {
          if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
            this.getSA();
          } else {
            this.getData();
          }
        }
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
    /**
     * 拨打电话
     */
    call(type, callerId, calleeId, sid) {
      common.osg.ajax(
        'basic/winnerlook/getMiddleNumberBySid',
        {
          // type,
          // callerId: callerId || wx.getStorageSync('user')._id,
          // calleeId: calleeId,
          sid
        },
        res => {
          this.makeCall(res.data.phoneNumberX);
        }
      );
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.fpi.page = 1;
      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
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

        if (this.func.type && this.func.type == 'SANode') {
          this.getSANode();
        } else {
          if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
            this.getSA();
          } else {
            this.getData();
          }
        }
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
      if (this.loadType == 'onLoad') {
        this.loadType = 'onShow';
        return;
      }
      this.getFunctionCount();
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
