<template>
  <view class="inspectionAppointments" @click.capture="track">
    <!-- 过滤 -->
    <view class="c-header" style="z-index: 2; padding-top: 5px; background: #f9f9f9">
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        use-action-slot
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20 c-search"
        background="#f9f9f9"
      >
        <view slot="action" class="c-flex">
          <van-icon
            custom-style="font-size: 44rpx;margin-left:10px;"
            name="filter-o"
            color="#666666"
            @click="filterSortingShow = !filterSortingShow"
            :data-event="{ id: 'ekYrqBTchc' }"
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
      <view class="c-popup c-flex-between c-item-center" style="box-sizing: border-box">
        <view class="c-w-100 filterSort">
          <van-dropdown-menu active-color="#d6000f">
            <van-dropdown-item
              title="上门时间"
              @close="dropdownCloseItem(3)"
              @open="dropdownOpenItem(4)"
            >
              <!-- #ifdef MP-WEIXIN -->
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
              <!-- #endif -->
              <!-- #ifdef APP-PLUS -->
              <van-cell title="开始时间">
                <uni-datetime-picker
                  key="dateTimeStart"
                  :value="dateTimeData.dateTimeStart"
                  placeholder=" "
                  @change="datetimeConfirm($event, 'dateTimeStart')"
                />
              </van-cell>
              <van-cell title="结束时间" data-key="applyTimeEnd" :border="false">
                <uni-datetime-picker
                  key="dateTimeEnd"
                  :value="dateTimeData.dateTimeEnd"
                  placeholder=" "
                  @change="datetimeConfirm($event, 'dateTimeEnd')"
                />
              </van-cell>
              <!-- #endif -->
              <view class="c-flex c-flex-around c-p-20">
                <van-button
                  plain
                  size="small"
                  @click="filterSortingShow = false"
                  :data-event="{ id: '6Z4VK5o11w' }"
                >
                  关 闭
                </van-button>
                <van-button
                  plain
                  size="small"
                  @click="
                    dateTimeData.dateTimeStart = '';
                    dateTimeData.dateTimeEnd = '';
                  "
                  :data-event="{ id: 'LeVG_e2aZK' }"
                >
                  清 空
                </van-button>
                <van-button
                  type="info"
                  size="small"
                  @click="application"
                  color="#ff6900"
                  :data-event="{ id: 'MLPcvgJttx' }"
                >
                  应 用
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
          class="c-flex c-flex-around c-m-20 c-w-100"
          :style="vanDropdownData.open ? '' : 'z-index: 200;'"
        >
          <van-button
            plain
            size="small"
            @click="filterSortingShow = false"
            :data-event="{ id: 'Pg8-kWODtH' }"
          >
            关 闭
          </van-button>
          <van-button
            plain
            size="small"
            @click="
              dateTimeData.dateTimeStart = '';
              dateTimeData.dateTimeEnd = '';
            "
            :data-event="{ id: 'mvGUCqucEG' }"
          >
            清 空
          </van-button>
          <van-button
            type="info"
            size="small"
            color="#ff6900"
            @click="application"
            :data-event="{ id: 'yvWWHDYVn3' }"
          >
            应 用
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
        color="#ff6900"
        title-active-color="#ff6900"
        nav-class="c-bg-default"
        wrap-class="c-line-bottom"
        :data-event="{ id: 'r24jGdwMML', capture: false }"
        class="c-tabs-padding-top"
      >
        <block v-for="(func, i) in functionList" :key="i">
          <!-- <block v-if="func.functionTypeList"> -->
          <!-- v-if="func.functionTypeList.indexOf(functionType) != -1" -->
          <van-tab :title="func.name" :name="func._id" :info="functionCount[func._id] || ''">
            <block v-if="active == func._id">
              <van-notice-bar
                v-if="dateTimeData.dateTimeStart || dateTimeData.dateTimeEnd"
                wrapable
                :scrollable="false"
                :text="`上门时间在：${dateTimeData.dateTimeStart} ~ ${dateTimeData.dateTimeEnd}`"
                :data-event="{ id: 'r24jGdwMML' }"
              />
              <view :data-event="{ id: 'r24jGdwMML' }">
                <view
                  :id="'listitem-' + func._id + '-' + j"
                  v-for="(listitem, j) in boundings"
                  :key="j"
                  :style="{
                    height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
                    margin: '20rpx 0'
                  }"
                  :data-event="{ id: 'r24jGdwMML' }"
                >
                  <view v-if="index - 1 <= j && j <= index + 1" :data-event="{ id: 'r24jGdwMML' }">
                    <view
                      class="c-card"
                      style="padding-top: 10px"
                      v-for="(item, k) in list[j]"
                      :key="k"
                      @tap="
                        doOpen('./inspectionAppointment', {
                          id: item.data._id,
                          extId: item.data.extId
                        })
                      "
                      :data-id="item.data._id"
                      :data-event="{ id: 'r24jGdwMML' }"
                    >
                      <view class="c-card-title" :data-event="{ id: 'r24jGdwMML' }">
                        <view
                          class="c-flex c-card-tag c-bg-green"
                          :data-event="{ id: 'r24jGdwMML' }"
                        >
                          巡检丨{{ item.data.code }}
                        </view>
                        <view class="c-red" :data-event="{ id: 'r24jGdwMML' }">
                          {{
                            codelabel('select', 'status', (item.data && item.data.status) || '') ||
                            ''
                          }}
                        </view>
                      </view>
                      <view class="c-card-content" :data-event="{ id: 'r24jGdwMML' }">
                        <view class="c-m-b-10" :data-event="{ id: 'r24jGdwMML' }">
                          <text :data-event="{ id: 'r24jGdwMML' }">客户名称：</text>
                          <text :data-event="{ id: 'r24jGdwMML' }">{{ item.data.name }}</text>
                        </view>
                        <view
                          class="c-flex c-m-b-10"
                          v-if="item.data.phone"
                          :data-event="{ id: 'r24jGdwMML' }"
                        >
                          <text :data-event="{ id: 'r24jGdwMML' }">联系客户：</text>
                          <view
                            @click.native.stop="makeCall(item.data && item.data.phone)"
                            :data-event="{ id: '0pL1RPu7D5' }"
                          >
                            <text :data-event="{ id: '0pL1RPu7D5' }">{{ item.data.phone }}</text>
                            <van-icon
                              name="phone"
                              style="display: inline; color: #ff6900; margin-left: 10px"
                            ></van-icon>
                          </view>
                        </view>
                        <view class="c-flex c-m-b-10" v-else :data-event="{ id: 'r24jGdwMML' }">
                          <text :data-event="{ id: 'r24jGdwMML' }">联系客户：</text>
                          <view
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
                            :data-event="{ id: 'JlfksSc2PH' }"
                          >
                            <van-icon
                              name="phone"
                              style="display: inline; color: #ff6900"
                            ></van-icon>
                          </view>
                        </view>
                        <view class="c-m-b-10" :data-event="{ id: 'r24jGdwMML' }">
                          <text :data-event="{ id: 'r24jGdwMML' }">部位：</text>

                          <text :data-event="{ id: 'r24jGdwMML' }">
                            {{
                              codelabel(
                                'cascade',
                                'parts',
                                (item.data && item.data.exts.parts) || ''
                              ) || ''
                            }}
                          </text>
                        </view>
                        <view class="c-m-b-10" :data-event="{ id: 'r24jGdwMML' }">
                          <text :data-event="{ id: 'r24jGdwMML' }">项目地址：</text>
                          <text :data-event="{ id: 'r24jGdwMML' }">
                            {{ item.data.inspectionAddress || '' }}
                          </text>
                        </view>
                        <view
                          class="c-m-b-10"
                          v-if="item.data.exts && item.data.exts.applyTimeStr"
                          :data-event="{ id: 'r24jGdwMML' }"
                        >
                          <text :data-event="{ id: 'r24jGdwMML' }">上门时间：</text>
                          <text :data-event="{ id: 'r24jGdwMML' }">
                            {{ item.data.exts.applyTimeStr }}
                          </text>
                        </view>
                        <view
                          class="c-m-b-10"
                          v-if="item.data.describe"
                          :data-event="{ id: 'r24jGdwMML' }"
                        >
                          <text :data-event="{ id: 'r24jGdwMML' }">备注信息：</text>
                          <text :data-event="{ id: 'r24jGdwMML' }">
                            {{ item.data.describe || '' }}
                          </text>
                        </view>
                      </view>
                      <view
                        class="c-m-t-20 c-card-footer c-flex-between"
                        :data-event="{ id: 'r24jGdwMML' }"
                      >
                        <van-button
                          v-if="
                            item.state == 0 &&
                            item.nodeDef &&
                            item.nodeDef.nodeType == 'accept' &&
                            item.handlerIds &&
                            (item.handlerIds.indexOf(user._id) != -1 ||
                              item.handlerIds.indexOf(currentRole._id) != -1 ||
                              item.handlerIds.indexOf(user.orgId + '+' + currentRole._id) != -1)
                          "
                          round
                          plain
                          size="small"
                          @click.native.stop="openReject(item.data._id, item._id)"
                          :data-event="{ id: 'uwcq28TtkV' }"
                        >
                          拒绝
                        </van-button>
                        <view v-else :data-event="{ id: 'r24jGdwMML' }"></view>

                        <view :data-event="{ id: 'r24jGdwMML' }">
                          <van-button
                            v-if="
                              item.state == 0 &&
                              item.nodeDef &&
                              item.nodeDef.nodeType == 'allot' &&
                              item.handlerIds &&
                              (item.handlerIds.indexOf(user._id) != -1 ||
                                item.handlerIds.indexOf(currentRole._id) != -1 ||
                                item.handlerIds.indexOf(user.orgId + '+' + currentRole._id) != -1)
                            "
                            round
                            type="info"
                            size="small"
                            color="#ff6900"
                            @click.native.stop="openSR(item)"
                            :data-event="{ id: 'IkhdsxbcF2' }"
                          >
                            分单
                          </van-button>
                          <van-button
                            v-if="
                              item.state == 0 &&
                              item.nodeDef &&
                              item.nodeDef.nodeType == 'dispatch' &&
                              item.handlerIds &&
                              (item.handlerIds.indexOf(user._id) != -1 ||
                                item.handlerIds.indexOf(currentRole._id) != -1 ||
                                item.handlerIds.indexOf(user.orgId + '+' + currentRole._id) != -1)
                            "
                            round
                            type="info"
                            size="small"
                            color="#ff6900"
                            @click.native.stop="openSR(item)"
                            :data-event="{ id: '8S45Gl5dH1' }"
                          >
                            派单
                          </van-button>
                          <van-button
                            v-if="
                              item.state == 0 &&
                              item.nodeDef &&
                              item.nodeDef.nodeType == 'accept' &&
                              item.handlerIds &&
                              (item.handlerIds.indexOf(user._id) != -1 ||
                                item.handlerIds.indexOf(currentRole._id) != -1 ||
                                item.handlerIds.indexOf(user.orgId + '+' + currentRole._id) != -1)
                            "
                            round
                            type="info"
                            size="small"
                            color="#ff6900"
                            @click.native.stop="acceptClick(item.data._id, item._id)"
                            :data-event="{ id: '3m2dWdy-ij' }"
                          >
                            接单
                          </van-button>
                          <!-- 在103管家接单后，403已完工之前可以扫码绑定监控 -->
                          <!-- <van-button
                            v-if="
                              !item.data.exts.moKanNum &&
                              Number(item.data.status) > 103 &&
                              Number(item.data.status) < 403
                            "
                            custom-class="c-m-l-20"
                            round
                            icon="scan"
                            type="info"
                            size="small"
                            color="#ff6900"
                            @click.native.stop="scanCode(item)" :data-event="{id:'RduMvHn5H8'}">
                            绑定监控
                          </van-button> -->
                          <van-button
                            v-if="
                              item.data.exts.moKanNum &&
                              Number(item.data.status) > 103 &&
                              Number(item.data.status) < 403
                            "
                            custom-class="c-m-l-20"
                            round
                            icon="video-o"
                            type="info"
                            size="small"
                            color="#ff6900"
                            @click.native.stop="toMoKanDetail(item)"
                            :data-event="{ id: '0jOZl_4jJP' }"
                          >
                            查看监控
                          </van-button>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </van-tab>
          <!-- </block> -->
        </block>
      </van-tabs>
    </view>
    <van-empty
      v-if="functionList.length == 0 && !isLogined"
      description="请先登录后再查看工单列表"
      class="c-empty"
    >
      <van-button
        round
        type="info"
        color="#ff6900"
        @click="open('/subpackages/login/loginAuth')"
        :data-event="{ id: 'thuj9CM3Z2' }"
      >
        登 录
      </van-button>
    </van-empty>
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
      :data-event="{ id: 'YldeyVFGCq', capture: false }"
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

    <!-- 重复手机号工单提示 -->
    <van-dialog
      :show="acceptConfirm.show"
      confirmButtonText="确认接单"
      confirm-button-color="#d6000f"
      showCancelButton
      cancelButtonText="取消接单"
      use-slot
      use-title-slot
      @confirm="accept(acceptConfirm.sid, acceptConfirm.workflowNodeId)"
      @close="acceptConfirm = { show: false, sid: '', workflowNodeId: '' }"
      :data-event="{ id: 'e1u-nhA4WO', capture: false }"
    >
      <view slot="title" class="c-red">重复工单提醒</view>
      <view class="c-red" style="padding: 0 16px 16px">
        已存在相同手机号工单，请与本服务商内勤核实是否建单重复，谨慎处理！
      </view>
    </van-dialog>
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
      user: {},
      currentRole: {},
      isLogined: true,
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
      options: {
        codecfg_parts: {
          codeId: 'parts'
        },
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
      functionCount: {},
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
      serviceType: '', //工单服务类型
      functionType: [], //功能注册上维护的类型类型
      showType: '', //触发onShow的类型：如扫码绑定监控
      host: common.osg.host,
      //存在重复手机号工单提示
      acceptConfirm: {
        show: false,
        sid: '',
        workflowNodeId: ''
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
      this.user = wx.getStorageSync('user') || {};
      this.currentRole = wx.getStorageSync('currentRole') || {};
      this.activeShow = false;
      this.getFunction();
    },
    onSearch: function (e) {
      this.searchValue = e.detail;
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;

      if (this.func.type && this.func.type == 'SANode') {
        // 代办查自己
        this.getSANode();
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
          // 全部
          this.getSA();
        } else {
          this.getData();
        }
      }
    },
    getFunctionCount() {
      common.osg.ajax(
        '/function/dataCount',
        { functions: JSON.stringify(this.functionList) },
        res => {
          this.functionCount = res.data;
        }
      );
    },
    getFunction() {
      let menu = wx.getStorageSync('menu');
      if (!menu) return;
      // 补tab页的工单状态值
      let functionList = menu.functionList.filter(item => {
        return (
          item.action &&
          item.action.indexOf('inspectionAppointment/inspectionAppointments') != -1 &&
          !item.openType.startsWith('scan-')
        );
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
            item.template = params.template;
          } else {
            item.status = 'all';
          }
        }
      });
      this.functionList = functionList;
      console.log(this.functionList, '-----functionList');
      // 解决不点击首页菜单直接通过底部导航进入工单列表
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

      this.getFields(() => {
        if (this.active == this.functionList[0]._id) {
          if (this.func.type == 'SANode') {
            this.getSANode();
          } else {
            if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
              this.getSA();
            } else {
              this.getData();
            }
          }
        }
        this.activeShow = true;
        this.$forceUpdate();
      });
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
      if (key) {
        this.dateTimeData[key] = common.osg.readableTime(e);
      } else {
        let value = e.detail;
        this.dateTimeData[this.datetime.field] = this.formattTime(value);
        this.datetime.show = false;
      }
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
        'is:state|integer#and': 1,
        sortField: 'createTime',
        sortOrder: 'desc',
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
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
      params.colName = 'inspectionAppointment';
      common.osg.ajax('/biz/extForm/queryFormWorkflowNode.do', params, res => {
        this.fpi.pages = res.pages;
        console.log('getSA');

        let data = [];
        res.data.map(item => {
          let row = Object.assign(
            (item.workflowNodeList &&
              common.osg.deepCopy(item.workflowNodeList[item.workflowNodeList.length - 1])) ||
              {},
            { data: item }
          );
          data.push(row);
        });
        res.data = data;

        if (res.data.length == 0) {
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
        'is:state|integer#and': 1,
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
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
      params.colName = 'inspectionAppointment';
      common.osg.ajax('/biz/extForm/queryFormWorkflowNode.do', params, res => {
        this.fpi.pages = res.pages;
        console.log('getData', res.pages);
        if (res.data.length == 0) {
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
        let index = this.fpi.page - 1;
        this.list.push(res.data);
        console.log(this.list, '-----DAtaLISt');
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
        'is:state|integer#and': 1,
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
        'in:status|array#and': this.func.status == 'all' ? null : this.func.status || '',
        'is:exts.workflowDefId|string#and': this.functionType
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
      params.colName = 'inspectionAppointment';
      common.osg.ajax('/biz/extForm/queryFormWorkflowNode.do', params, res => {
        console.log('getSANode', res);
        if (res.data.length == 0) {
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
    //获取工单扩展
    getFields(callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          colName: 'inspectionAppointment',
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
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    toMoKanDetail(item) {
      common.osg.open('../web/web', {
        url: `${this.host}/fsgo/wm/h5/mokan/detail/${item.data.exts.moKanNum}?address=${
          this.areaList.province_list[item.data.area[0]] +
          this.areaList.city_list[item.data.area[1]] +
          this.areaList.county_list[item.data.area[2]] +
          item.data.address
        }&startDate=${item.data.exts.startDate || ''}&supervisorName=${
          item.data.exts.supervisorName || ''
        }&headmanName=${item.data.exts.headmanName || ''}&client=b`
      });
    },
    /**
     * 打开分派单弹窗
     */
    openSR(row) {
      this.serviceType = row.data.serviceType;
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
            this.SR.workflowNode.nodeDef.resourceRoles.join(),
          'in:serviceType|string#and': this.serviceType //工单所对应服务类型
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
        smodule: 'inspectionAppointment',
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
          if (this.func.orderState == 'all') {
            this.getSA('process');
          } else {
            this.getData('process');
          }
        }
        this.getFunctionCount();
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
    acceptClick(sid, workflowNodeId) {
      if (common.osg.isRepeatClick('accept')) {
        return; //判断是否重复点击
      }
      // common.osg.ajax('basic/serviceAppointment/selfExamination', { saId: sid }, res => {
      //   if (res.data.length > 0) {
      //     this.acceptConfirm = {
      //       show: true,
      //       sid,
      //       workflowNodeId
      //     };
      //   } else {
      this.accept(sid, workflowNodeId);
      //   }
      // });
    },
    accept(sid, workflowNodeId) {
      common.osg.ajax(
        'workflow/process',
        {
          sid,
          workflowNodeId,
          smodule: 'inspectionAppointment'
        },
        res => {
          if (this.func.type && this.func.type == 'SANode') {
            this.getSANode('process');
          } else {
            if (this.func.orderState == 'all') {
              this.getSA('process');
            } else {
              this.getData('process');
            }
          }
          this.getFunctionCount();
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
        smodule: 'inspectionAppointment'
      };
      common.osg.ajax('workflow/rollbackWorkflow', params, res => {
        if (this.func.type && this.func.type == 'SANode') {
          this.getSANode();
        } else {
          if (this.func.orderState == 'all') {
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
      }
      if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
      }

      if (type == 'CascadeMultiple') {
        return common.osg.formatCascadeMultiple(option, val);
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
      this.showType = 'makeCall';
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    /**
     * 扫码绑定监控
     * 已绑定其他工单时，传binding会绑定到当前工单
     */
    // scanCode(item) {
    //   this.showType = 'scanCode';
    //   common.osg.scanCode(code => {
    //     common.osg.ajax(
    //       'moKan/bind',
    //       { serviceAppointmentId: item.data._id, moKanNum: code.result },
    //       res => {
    //         if (!res.success) {
    //           common.osg.confirm(
    //             '当前设备已被其他工单绑定，是否解绑并绑定到本工单？',
    //             () => {
    //               this.bindingConfirm(item, code, 'binding');
    //             },
    //             {
    //               title: '绑定冲突',
    //               confirmText: '确认替换',
    //               showCancel: true,
    //               cancelText: '放弃绑定'
    //             }
    //           );
    //         } else {
    //           common.osg.alert(`监控设备${code.result} 绑定成功！`);
    //           if (this.func.type && this.func.type == 'SANode') {
    //             this.getSANode('process');
    //           } else {
    //             if (this.func.orderState == 'all') {
    //               this.getSA('process');
    //             } else {
    //               this.getData('process');
    //             }
    //           }
    //         }
    //       }
    //     );
    //   });
    // },
    // bindingConfirm(item, code, binding) {
    //   common.osg.ajax(
    //     'moKan/bind',
    //     { serviceAppointmentId: item.data._id, moKanNum: code.result, binding },
    //     res => {
    //       common.osg.alert(`监控设备${code.result} 绑定成功！`);
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

        if (this.func.type && this.func.type == 'SANode') {
          this.getSANode();
        } else {
          if (this.func.orderState == 'all') {
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
      common.osg.init(this, {}, app);
      // 扫码绑定监控触发的onShow
      if (this.showType == 'scanCode' || this.showType == 'makeCall') {
        this.showType = '';
        return;
      }
      // 查询菜单角标数量
      this.getFunctionCount();
      this.functionType = wx.getStorageSync('functionTypeValue');
      if (!common.osg.isLogined()) {
        this.isLogined = false;
        return;
      } else {
        this.isLogined = true;
      }
      if (this.$refs && this.$refs.filter) {
        this.$refs.filter.filterParams = {};
      }
      if (this.loadType == 'onLoad') {
        this.loadType = 'onShow';
        return;
      }
      this.doInit({});
    }
  }
};
</script>
<style lang="scss">
.inspectionAppointments {
  .c-search {
    .van-search__content {
      background: #fff;
      border: 1rpx solid rgba(195, 195, 205, 0.5);
    }
  }

  .c-content {
    margin-top: 44px;
  }

  .c-card-tag {
    padding: 0 5px;
    border-radius: 2px;
    color: #fff;
  }

  .c-p-r-0 {
    padding-right: 0 !important;
  }

  .sr-popup .van-cell__title,
  .van-cell__value {
    -webkit-flex: auto;
    flex: auto;
    max-width: none !important;
  }

  .sr-title {
    width: calc(100% - 70px);
  }
}
</style>
