<template>
  <view class="projects" @click.capture="track">
    <view class="header">
      <!-- #ifdef APP-PLUS -->
      <!-- 手机状态栏 -->
      <view
        :style="'width:100vw;height:' + systemInfo.statusBarHeight + 'px;background-color:#fff'"
      ></view>
      <!-- #endif -->
      <!-- 搜索栏 -->
      <view v-if="tabShow && !chatId" class="c-w-1 c-bg-white c-flex c-item-center">
        <van-search
          :value="searchValue"
          @clear="onSearch"
          @blur="onSearch"
          placeholder="搜索编号/姓名/地址/手机号"
          clear-trigger="always"
          custom-class="c-search"
          class="c-flex-1"
        ></van-search>
      </view>
      <!-- 工单状态栏 -->
      <block v-if="tabShow && !chatId">
        <van-tabs
          @change="tabChange"
          :active="projectStatus"
          v-if="tabShow"
          :ellipsis="false"
          line-width="40px"
          line-height="3px"
          :data-event="{ id: '_Dt0zd9111', capture: false }"
          id="tabs"
        >
          <block v-for="(item, i) in options.projectStatus" :key="i">
            <van-tab
              :title="
                item.name + (functionCount[item.value] ? '(' + functionCount[item.value] + ')' : '')
              "
              :name="item.value"
            ></van-tab>
          </block>
        </van-tabs>
        <view v-else-if="isLogined" style="height: 44px; background-color: #fff"></view>
        <view v-else style="height: 10px; background-color: #fff"></view>
      </block>
    </view>
    <!-- 项目列表 -->
    <scroll-view
      id="content"
      scroll-y
      @scrolltolower="scrollToLower"
      @refresherrefresh="refresherRefresh"
      @scroll="scroll"
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      refresher-background="#f7f8fa"
    >
      <view
        :id="'listitem-' + active + '-' + j"
        v-for="(listitem, j) in boundings"
        :key="j"
        :style="{
          height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
          margin:
            list[j] &&
            list[j].length > 0 &&
            list[j][list[j].length - 1].data &&
            list[j][list[j].length - 1].data.leadIds &&
            list[j][list[j].length - 1].data.leadIds.length > 0
              ? '10px 0px 44px 0px'
              : '10px 0px'
        }"
      >
        <block v-if="index - 1 <= j && j <= index + 1 && list[j]">
          <view
            :class="{
              card: true,
              'mb-44': item.leadIds && item.leadIds.length > 0 && isAfterApril21(item.createTime)
            }"
            v-for="(item, k) in list[j]"
            :key="k"
            @tap="toDetail(item._id, j, k, item)"
            :data-id="item._id"
            :id="'sa-' + item._id"
          >
            <view class="card-view c-flex c-flex-between">
              <view class="c-flex">
                <view
                  class="card-icon-view"
                  :class="['1', '2', '5'].includes(item.exts.sourceType) ? 'c-bg-red' : 'c-bg-blue'"
                >
                  <image
                    :src="
                      'https://pub.fsgo365.cn/icon-' +
                      (item.exts.serviceType == '40' ? 'shuazi.png' : 'fangshui.png')
                    "
                  />
                </view>
                <text
                  @click.stop="
                    copy(item.contractdocNum, '已复制完整项目编号 ' + item.contractdocNum)
                  "
                  :data-event="{ id: '9cXxYY5Zz8' }"
                  class="c-m-l-20"
                >
                  {{ '#' + item.contractdocNum.slice(15) }}
                </text>
                <text
                  class="c-m-l-20"
                  v-if="
                    item.exts.leakagesite_copy &&
                    item.exts.leakagesite_copy[0] &&
                    item.exts.leakagesite_copy[0][0]
                  "
                >
                  {{ formatLeakagesite([item.exts.leakagesite_copy[0][0]]) }}
                </text>
              </view>
              <text class="c-blue c-flex-nowrap">
                {{ codelabel('select', 'projectStatus', item.projectStatus) }}
              </text>
            </view>
            <view v-if="item.district || item.address" class="card-view c-flex c-flex-between">
              <view class="c-flex-1 c-size-18 c-weight-600 c-ellipsis2">
                {{ item.address || '' }}
              </view>
            </view>
            <view class="card-view" v-if="item.describe">
              <view class="card-memo" @click.stop="describeClick(item.describe)">
                <van-icon name="comment-o" color="#646566" style="margin-right: 8px" />
                <view class="card-memo-text c-ellipsis2">备注：{{ item.describe }}</view>
              </view>
            </view>
            <view class="card-view c-flex c-flex-wrap" style="margin: -5px">
              <view class="c-flex c-item-center c-m-10">
                <view class="card-icon-view card-icon-border c-m-r-20">
                  <image
                    v-if="!item.exts.gender"
                    src="https://pub.fsgo365.cn/icon-character-unknown.png"
                    style="width: 22px; height: 24px"
                  ></image>
                  <image
                    v-else
                    :src="
                      item.exts.gender == '1'
                        ? 'https://pub.fsgo365.cn/icon-character-man.png'
                        : 'https://pub.fsgo365.cn/icon-character-woman.png'
                    "
                  ></image>
                </view>
                <text class="c-size-14">
                  {{
                    item.contactsName &&
                    item.contactsName.length > 4 &&
                    item.serviceHousekeeper &&
                    item.projectManagerName
                      ? item.contactsName.substring(0, 4) + '...'
                      : item.contactsName
                  }}
                </text>
              </view>
              <view v-if="item.serviceHousekeeper" class="c-flex c-item-center c-m-10">
                <view class="card-icon-view card-icon-border c-m-r-20">
                  <image src="https://pub.fsgo365.cn/icon-character-supervisor.png"></image>
                </view>
                <text class="c-size-14">{{ item.serviceHousekeeper }}</text>
              </view>
              <view v-if="item.projectManagerName" class="c-flex c-item-center c-m-10">
                <view class="card-icon-view card-icon-border c-m-r-20">
                  <image src="https://pub.fsgo365.cn/icon-character-headman.png"></image>
                </view>
                <text class="c-size-14">{{ item.projectManagerName }}</text>
              </view>
            </view>
            <view class="card-view card-buttons">
              <block v-if="currentRole._id == '7100212906800336051'">
                <van-button
                  plain
                  icon="orders-o"
                  block
                  class="c-flex-1"
                  @click.native.stop="
                    doOpen('/subpackages2/project/projectProfit', { projectId: item._id })
                  "
                  :data-event="{ id: 'B43eOJ123q' }"
                >
                  查看项目明细
                </van-button>
              </block>
              <block v-else>
                <!-- 联系客户 -->
                <block v-if="item.projectStatus != 'accept'">
                  <van-button
                    v-if="item.contactsPhone"
                    plain
                    icon="phone"
                    block
                    class="c-flex-1"
                    @click.native.stop="makeCall(item.contactsPhone)"
                    :data-event="{ id: 'B43eOJcj6q' }"
                  >
                    联系客户
                  </van-button>
                  <van-button
                    v-else
                    plain
                    icon="phone"
                    block
                    class="c-flex-1"
                    @click.native.stop="
                      call(
                        '1',
                        null,
                        item.contactIds && item.contactIds[0] ? item.contactIds[0] : '',
                        item.serviceAppointmentId
                      )
                    "
                    :data-event="{ id: 'k5NVc60iAz' }"
                  >
                    联系客户
                  </van-button>
                </block>
                <!-- 接单 拒绝 -->
                <block v-if="item.projectStatus == 'accept' && item.projectManagerId == user._id">
                  <!-- <van-button
                  plain
                  icon="cross"
                  block
                  class="c-flex-1"
                  @click.native.stop="openReject(item.data._id, item._id, item.nodeDef.rejectMode)"
                  :data-event="{ id: 'vhAG22kzz3' }"
                >
                  拒绝
                </van-button> -->
                  <van-button
                    icon="success"
                    type="info"
                    block
                    class="c-flex-1"
                    @click.native.stop="acceptClick(item._id)"
                    :data-event="{ id: 'REM-KkIrYZ' }"
                  >
                    接单
                  </van-button>
                </block>
              </block>
            </view>
          </view>
        </block>
      </view>
      <uni-load-more
        v-if="boundings.length > 0 && list.length > 0 && list[0] && list[0].length > 3"
        :status="loadStatus"
      ></uni-load-more>
    </scroll-view>
    <van-empty
      v-if="functionList.length == 0 && !isLogined"
      description="请先登录后再查看项目列表"
      class="c-empty"
    >
      <van-button
        round
        type="info"
        @click="doOpen('/subpackages/login/loginAuth')"
        :data-event="{ id: '4Sof4-nppN' }"
      >
        登 录
      </van-button>
    </van-empty>
    <!-- 拒绝接单弹出框 -->
    <van-dialog
      use-slot
      title="是否拒绝接单"
      :show="rejectObj.show"
      show-cancel-button
      @confirm="reject"
      @close="closeReject"
      :data-event="{ id: 'UY9Psml-6z', capture: false }"
    >
      <van-field
        :value="rejectObj.remark"
        type="textarea"
        autosize
        placeholder="请输入拒绝原因"
        @change="rejectChange"
      />
    </van-dialog>
    <van-dialog id="van-dialog" />
    <Tabbar></Tabbar>
    <!-- #ifdef APP-PLUS -->
    <permission ref="permission" />
    <!-- #endif -->
  </view>
</template>

<script>
const app = getApp();
import { mapMutations } from 'vuex';
import Permission from '../../components/Permission/Permission.vue';
import watchPositionMixin from '../../resources/mixins/watchPositionMixin.js';
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  components: {
    Permission
  },
  mixins: [watchPositionMixin],
  data() {
    return {
      projectStatus: 'all',
      user: {},
      currentRole: {},
      isLogined: true,
      systemInfo: {},
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
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        },
        codecfg_status: {
          codeId: 'STATUS'
        },
        tags: [],
        codecfg_projectStatus: {
          codeId: 'projectStatus'
        },
        projectStatus: []
      },
      SR: {
        show: false,
        type: '',
        formData: {},
        reassign: '',
        fpi: { data: [] },
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
      active: '', //当前激活的tab页
      tabShow: false,
      functionList: [],
      functionCount: {},
      // 拒单
      rejectObj: {
        sid: '',
        workflowNodeId: '',
        show: false,
        remark: ''
      },
      // 重启工单
      restoreObj: {
        show: false,
        sid: '',
        remark: ''
      },
      fields: [], //扩展字段
      tagType: {}, //标签属性
      // 过滤器
      filter: {
        show: false,
        applyTimeStart: '', // 上门时间开始
        applyTimeEnd: '', // 上门时间结束
        sort: '', // 排序
        etags: [], // 已选中客户标签
        tagTypeData: [], // 客户标签组
        tagData: [], // 客户标签
        tagTarget: 'project', // 客户标签对象
        // 应用的过滤条件
        conditions: {
          applyTimeStart: '', // 上门时间开始
          applyTimeEnd: '', // 上门时间结束
          sort: '', // 排序
          etags: [] // 已选中客户标签
        }
      },
      // 时间选择器
      datetime: {
        show: false,
        type: '',
        value: new Date().getTime()
      },
      serviceType: '', //工单服务类型
      showType: '', //触发onShow的类型：如扫码绑定监控
      clickSA: {}, // 点击的工单，从工单详情返回时更新此工单数据
      host: common.osg.host,
      //存在重复手机号工单提示
      acceptConfirm: {
        show: false,
        sid: '',
        workflowNodeId: ''
      },
      // 工单地图
      map: {
        show: false,
        zoom: 'shrink', // shrink:缩小 expand:放大
        longitude: '', // 地图中心点经度
        latitude: '', // 地图中心点纬度
        markers: [],
        first: '', // 工单列表滚动到第一位的工单_id
        enterTime: 0, // 监听页面滚动节流触发时间
        region: null // 地图视野范围经纬度
      },
      currentRoleButtons: [],
      isAutoY: true, //时间过滤器是否允许滚动 overflow-y
      refresherTriggered: false, // 已触发下拉加载
      loadStatus: 'more', // 上拉加载状态
      environment: '',
      chatId: ''
    };
  },
  onLoad(param) {
    common.osg.init(this, {}, app);
    this.systemInfo = app.globalData.systemInfo;
    this.user = wx.getStorageSync('user') || {};
    // 检查小程序运行环境
    // 在企业微信中调用此接口时，会额外返回一个 environment 字段（微信中不返回），如此字段值为 wxwork，则表示当前小程序运行在企业微信环境中。注意：只有运行在企业微信环境中，才能调用wx.qy的接口。
    wx.getSystemInfo({
      success: res => {
        if (res.environment == 'wxwork') {
          this.environment = res.environment;
          // 检查session_key是否过期
          // this.checkSession(() => {
          // 获取企业微信派发的临时登录凭证
          this.qwLogin(code => {
            this.qwMiniLogin(code, () => {
              this.isLogined = true;
              this.user = wx.getStorageSync('user') || {};
              this.getContext(entry => {
                // 外部群聊工具栏
                if (entry == 'group_chat_tools') {
                  this.getCurExternalChat(chatId => {
                    this.chatId = chatId;
                    common.osg.codeoption(() => {
                      this.getData();
                    });
                  });
                }
              });
            });
          });
          // });
        } else {
          common.osg.codeoption(() => {
            this.tabShow = true;
          });
          this.chatId = '';
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    common.osg.init(this, {}, app);
    //更新tabbar 列表
    this.updatTabbarList();

    if (this.showType == 'keep') {
      this.showType = '';
      return;
    }
    // 从工单详情页返回触发的onShow
    if (this.showType == 'detail') {
      common.osg.ajax(
        '/biz/project/queryProject',
        { 'is:_id|string#and': this.clickSA.id },
        res => {
          // 将工单详情数据结构处理成工单列表数据结构
          this.$set(this.list[this.clickSA.index1], this.clickSA.index2, res.data[0]);
          // 更新此工单最新信息
          this.showType = '';
          this.clickSA = {
            id: '',
            index1: 0,
            index2: 0
          };
        },
        {
          noload: true
        }
      );
      return;
    }

    // 验证登录状态
    if (!common.osg.isLogined()) {
      this.isLogined = false;
      return;
    } else {
      this.isLogined = true;
      // #ifdef APP-PLUS
      // 检查授权管理
      this.$nextTick(() => {
        this.$refs.permission && this.$refs.permission.initPermissions();
        // App上架审核角色“管家App”角色，不弹窗
        if (
          this.currentRole._id != '7508867733715728438' &&
          this.currentRole._id != '101454081026144584'
        ) {
          // 获取当前定位，用于查询当前定位到工单地址的距离
          common.osg.getLocation(
            res => {
              app.globalData.location = res.latitude + ',' + res.longitude;
            },
            null,
            {
              doNotRemind: true
            }
          );
          // 开启定位监听，用于自动打卡
          this.startWatchPosition();
        }
      });
      // #endif
    }

    // 清空过滤条件
    if (this.$refs && this.$refs.filter) {
      this.$refs.filter.filterParams = {};
    }

    // 保存当前角色、当前角色按钮
    this.currentRole = wx.getStorageSync('currentRole') || {};
    this.currentRoleButtons = wx.getStorageSync('currentRoleButtons') || [];
    this.getFunctionsCount();
    if (this.environment == 'wxwork') return;
    this.getData();
  },
  methods: {
    ...mapMutations(['updatTabbarList']),
    // 获取当前角色工单列表菜单
    getFunctions() {
      this.tabShow = false;
      let saMenu = wx.getStorageSync('saMenu');
      if (!saMenu || saMenu.length == 0) {
        common.osg.toast('当前角色没有查询权限', 'none');
        return;
      }
      this.functionList = saMenu;
    },
    // 获取不同页签的工单数
    getFunctionsCount(callback) {
      common.osg.ajax(
        '/biz/project/dataCount',
        {},
        res => {
          if (res.data) {
            res.data.all = Object.values(res.data).reduce((acc, val) => acc + val, 0);
          } else {
            res.data = { all: 0 };
          }
          this.functionCount = res.data;
          this.$nextTick(() => {
            if (this.selectComponent('#tabs')) {
              this.selectComponent('#tabs').resize();
            }
          });
          if (callback) callback();
        },
        {
          noload: true
        }
      );
    },
    // 激活菜单;
    activateFunction() {
      // 已有激活菜单，判断当前激活的菜单是否在工单列表展示
      if (app.globalData.funcId)
        var func = this.functionList.find(item => app.globalData.funcId == item._id);
      if (app.globalData.funcId && func) {
        /**
         * 找到了已激活菜单，默认激活该菜单
         * 场景：1.非首次点击底部导航栏进入工单列表。2.从其他页面跳转到工单列表。
         */
        this.func = func;
      } else {
        /**
         * 没有找到已激活菜单，默认激活第1个菜单
         * 场景：1.直接点击底部导航栏首次进入工单列表。2.登录或切换角色后会清空app.globalData.funcId。
         */
        this.func = this.functionList[0];
        app.globalData.funcId = this.func._id;
      }
      this.active = this.func._id;
      this.tabShow = true;
      // 由于标签栏组件默认激活第1个页签，所以进入页面时如果当前激活的是第1个标签，标签栏组件就不会触发tabChange，所以需要主动请求工单列表数据。
      if (this.func._id == this.functionList[0]._id) {
        this.boundings = [];
        this.index = 0;
        this.fpi.page = 1;
        this.fpi.rows = 10;
        this.getData();
      }
    },
    tabChange(e) {
      app.globalData.projectStatus = e.detail.name;
      console.log('tabChange', e);
      // for (let func of this.functionList) {
      //   if (func._id == e.detail.name) {
      //     this.func = func;
      //     this.active = this.func._id;
      //     break;
      //   }
      // }
      this.projectStatus = e.detail.name;
      this.loadStatus = 'more';
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.map.region = null; // 不过滤视野范围

      this.getData();
      this.getFunctionsCount(); // 从工单详情返回工单列表，仍保留当前工单卡片，不更新页签角标，所以切换页签时需要更新角标
    },
    onSearch(e) {
      this.searchValue = e && e.detail && e.detail.value ? e.detail.value.trim() : '';
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.map.region = null; // 不过滤视野范围
      this.getData();
      // this.getMarkers();
      // 搜索埋点
      if (e.detail)
        common.osg.report('search', {
          id: 'saOnSearch',
          keywords: e.detail
        });
    },
    filterOpen() {
      this.getTagTypeData();
      this.getTagData();
      // 每次打开过滤器将应用的过滤条件返显。
      this.filter.applyTimeStart = this.filter.conditions.applyTimeStart;
      this.filter.applyTimeEnd = this.filter.conditions.applyTimeEnd;
      this.filter.sort = this.filter.conditions.sort;
      this.filter.etags = common.osg.deepCopy(this.filter.conditions.etags);
      this.filter.show = true;
    },
    filterClose() {
      this.filter.show = false;
    },
    filterTimeClick(e) {
      this.datetime = {
        type: 'datetime',
        field: e.target.dataset.key,
        value: new Date(common.osg.readableTime(null, 'date') + ' 12:00:00').getTime(),
        show: true
      };
    },
    filterTimeConfirm(e) {
      this.filter[this.datetime.field] = common.osg.readableTime(e.detail);
      this.datetime.show = false;
    },
    getTagTypeData() {
      common.osg.ajax(
        'basic/tagType/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:target|string#and': this.filter.tagTarget,
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          sortField: 'type',
          sortOrder: 'asc'
        },
        res => {
          this.filter.tagTypeData = res.data || [];
        },
        { noload: true }
      );
    },
    getTagData() {
      common.osg.ajax(
        'basic/tag/query',
        { _all: '1', 'is:state|integer#and': 1, notFilterBelongTo: '1', notFilterOrgId: '1' },
        res => {
          this.filter.tagData = res.data || [];
        },
        { noload: true }
      );
    },
    tagClick(tagId) {
      let index = this.filter.etags.indexOf(tagId);
      if (index == -1) {
        this.filter.etags.push(tagId);
      } else {
        this.filter.etags.splice(index, 1);
      }
    },
    filterReset() {
      this.filter.applyTimeStart = '';
      this.filter.applyTimeEnd = '';
      this.filter.sort = '';
      this.filter.etags = [];
    },
    filterSave() {
      // 保存应用的过滤条件，每次打开过滤器将应用的过滤条件返显。
      this.filter.conditions = {
        applyTimeStart: this.filter.applyTimeStart,
        applyTimeEnd: this.filter.applyTimeEnd,
        sort: this.filter.sort,
        etags: common.osg.deepCopy(this.filter.etags)
      };
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.map.region = null; // 不过滤视野范围
      this.getData();
      this.filter.show = false;
      // this.getMarkers();
    },
    getData() {
      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1,
        'regex:contractdocNum|string#or': this.searchValue,
        'regex:contactsName|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:contactsPhone|string#or': this.searchValue,
        'is:projectStatus|string#and': this.projectStatus == 'all' ? null : this.projectStatus
      };
      let url = 'biz/project/queryProject';
      if (this.chatId) {
        url = 'biz/project/queryProjectByChatId';
        params = {
          chatId: this.chatId
        };
      }
      common.osg.ajax(
        url,
        params,
        async res => {
          let dataList = [];
          res.data.map(item => {
            dataList.push({
              _id: item._id,
              contractdocNum: item.contractdocNum,
              projectStatus: item.projectStatus,
              district: item.district,
              address: item.address.slice(item.address.indexOf(item.area)),
              describe: item.describe,
              contactsName: item.contactsName,
              serviceHousekeeper: item.serviceHousekeeper,
              projectManagerName: item.projectManagerName,
              projectManagerId: item.projectManagerId,
              serviceAppointmentId: item.serviceAppointmentId,
              exts: {
                sourceType: item.exts.sourceType,
                leakagesite_copy: item.exts.leakagesite_copy,
                province: item.exts.province,
                city: item.exts.city
              }
            });
          });
          // 将数据更新到工单列表
          if (this.reachBottom) {
            // 上拉加载更多（至少有1屏数据时才能触发上拉加载）
            if (res.data.length == 0) {
              if (this.list[this.list.length - 1].length == this.fpi.rows) {
                // 当最后1页数据等于10条时，本次请求的是下一页数据，下一页数据为0时，则页码恢复上一页，不需要更新列表数据。
                this.fpi.page--;
                this.reachBottom = false;
                this.loadStatus = 'noMore';
                this.$forceUpdate();
                return;
              } else {
                // 当最后1页数据不足10条时，请求的是最后一页数据，最后下一页数据为0时，则页码需要恢复上一页，需要删除最后一页的数据。
                this.fpi.page--;
                this.index--;
                this.list.pop();
                this.boundings.pop();
                this.reachBottom = false;
                this.loadStatus = 'noMore';
                this.$forceUpdate();
                return;
              }
            } else {
              // 请求到数据
              let lastPageIndex = this.fpi.page - 1;
              this.list[lastPageIndex] = dataList;
              this.boundings[lastPageIndex] = {};
              if (this.list.flat().length == res.total) {
                this.loadStatus = 'noMore';
              }
              this.$forceUpdate();
              this.getClientBounding();
            }
          } else {
            // onShow、下拉加载、搜索、处理工作流（请求数据时页码始终为1）
            if (res.data.length == 0) {
              this.list = [];
              this.boundings = [];
              this.index = 0;
              this.$forceUpdate();
              if (this.refresherTriggered) {
                common.osg.toast('当前列表没有数据', 'none');
                this.refresherTriggered = false;
              }
              return; // 直接清空列表数据，清空计算高度
            } else {
              this.list = [dataList];
              this.boundings = [{}];
              this.index = 0;
              this.$forceUpdate();
              this.getClientBounding();
              if (this.refresherTriggered) this.refresherTriggered = false; // 取消下拉刷新状态
            }
          }
          // 如果当前群聊只关联了1个项目，且该项目已接单，则自动跳转到项目详情页，减少用户点击操作
          if (this.chatId && dataList.length == 1 && dataList[0].projectStatus != 'accept') {
            common.osg.open('/subpackages2/project/project', { projectId: dataList[0]._id });
          }
        },
        { noload: true }
      );
    },
    // 计算当前工单列表最后一页高度
    getClientBounding() {
      this.$nextTick(() => {
        setTimeout(
          () => {
            let that = this;
            let index = this.fpi.page - 1; // 避免页面滚动时this.index变化影响
            this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
            uni
              .createSelectorQuery()
              .select(`#listitem-${this.func._id}-${index}`)
              .boundingClientRect(rect => {
                if (rect) {
                  // 解决列表最后一页数据未渲染出的问题
                  if (rect.height == 0) {
                    this.list.pop();
                    this.boundings.pop();
                    this.fpi.page--;
                    this.reachBottom = false;
                    this.loadStatus = 'more';
                    common.osg.toast('加载失败，请重新上拉加载', 'none');
                    return;
                  }
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
            this.reachBottom = false;
          },
          common.osg.appBaseInfo.uniPlatform == 'app' ? 500 : 200
        );
      });
    },
    toDetail(id, index1, index2) {
      this.showType = 'detail';
      this.clickSA = {
        id,
        index1,
        index2
      };
      if (this.currentRole._id == '7100212906800336051') {
        this.doOpen('/subpackages2/project/projectProfit', { projectId: id });
      } else {
        this.doOpen('/subpackages2/project/project', { projectId: id });
      }
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    /**
     * 接单
     */
    acceptClick(id) {
      if (common.osg.isRepeatClick('accept')) {
        return; //判断是否重复点击
      }
      common.osg.ajax('biz/project/acceptProject', { projectId: id }, res => {
        this.fpi.page = 1;
        this.getData();
        this.getFunctionsCount();
      });
    },
    /**
     * 点击拒绝
     */
    openReject(sid, workflowNodeId, rejectMode) {
      if (common.osg.isRepeatClick('reject')) {
        return; //判断是否重复点击
      }
      this.rejectObj = {
        sid,
        workflowNodeId,
        rejectMode,
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
     * 确认拒绝/工作流回退
     */
    reject() {
      if (!this.rejectObj.remark || this.rejectObj.remark.trim().length == 0) {
        common.osg.toast('请填写拒绝原因', 'none');
        return;
      }
      let url = '';
      let params = {};
      // 拒单逻辑
      if (this.rejectObj.rejectMode == 1) {
        // 后台判断
        url = 'basic/serviceAppointment/handleRefused';
        params = {
          sid: this.rejectObj.sid,
          remark: this.rejectObj.remark
        };
      } else {
        // 退回节点
        url = 'workflow/rollbackWorkflow';
        params = {
          sid: this.rejectObj.sid,
          workflowNodeId: this.rejectObj.workflowNodeId,
          remark: this.rejectObj.remark,
          smodule: 'serviceAppointment'
        };
      }
      common.osg.ajax(url, params, res => {
        this.map.region = null; // 不过滤视野范围
        this.getData();
        // this.getMarkers();
      });
    },
    /**
     * 点击拒绝
     */
    openRestore(sid) {
      this.restoreObj = {
        show: true,
        sid,
        remark: ''
      };
    },
    /**
     * 取消拒绝
     */
    cancelRestore() {
      this.restoreObj.show = false;
    },
    /**
     * 填写拒绝原因
     */
    restoreChange(e) {
      this.restoreObj.remark = e.detail;
    },
    codelabel(type, option, val) {
      if (!val) return;
      if (type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
      }
    },
    formatLeakagesite(value) {
      if (!value || value.length == 0 || !Array.isArray(value)) return '';
      let leakagesite1 = [];
      value.map(item => {
        leakagesite1.push(item[0]);
      });
      if (leakagesite1.length > 0) {
        let str = common.osg.codelabelForArray('repairParts', leakagesite1, ' ');
        if (str && str.length > 7) {
          return str.substring(0, 7) + '...';
        } else {
          return str;
        }
      } else {
        return '';
      }
    },
    formatDistrict(value) {
      return this.areaList.county_list[value];
    },
    formatApplyTime(value) {
      return common.osg.readableTime(value, 'shortDatetime');
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
      this.showType = 'keep';
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    scrollToLower() {
      if (!this.reachBottom && !this.chatId) {
        this.loadStatus = 'loading';
        this.reachBottom = true;
        if (this.list[this.list.length - 1].length == this.fpi.rows) {
          // 当最后一页数据条数不足时，不请求下一页，仍然请求当前页数据
          this.fpi.page++;
        }
        this.getData();
      }
    },
    refresherRefresh() {
      if (this.chatId) return;
      this.refresherTriggered = true;
      this.fpi.page = 1;
      this.getData();
    },
    //滚动监听
    scroll(e) {
      if (this.reachBottom) return;
      let now = new Date().getTime();
      if (now - this.map.enterTime > 200) {
        this.map.enterTime = now;
        if (!this.windowHeight) {
          uni
            .createSelectorQuery()
            .select('#content')
            .boundingClientRect(rect => {
              if (rect) {
                this.windowHeight = rect.height;
              }
            })
            .exec();
        }

        // 循环每页高度
        for (let i = 0; i < this.boundings.length; i++) {
          // 如果没有在屏幕中，并且视野的高度小于我的结尾位置距离顶部的距离，也就是说，这个dom是我正在查看的dom
          if (
            this.boundings[i].top < e.detail.scrollTop + this.windowHeight &&
            e.detail.scrollTop + this.windowHeight <= this.boundings[i].bottom
          ) {
            this.index = i;
            break;
          }
        }

        // 获取地图下方第一个工单
        if (this.map.show && this.map.zoom == 'shrink') {
          let data = this.list[this.index < 0 ? 0 : this.index];
          if (this.index > 0) {
            data = this.list[this.index - 1].concat(data);
          }

          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            uni
              .createSelectorQuery()
              .select(`#sa-${item.data._id}`)
              .boundingClientRect(rect => {
                if (rect) {
                  if (rect.top >= 178 && rect.top <= 400) {
                    if (this.map.first != item.data._id) {
                      this.map.first = item.data._id;
                      // 查找工单对应角标改为蓝色
                      if (
                        item.data.gpsPoint &&
                        item.data.gpsPoint.longitude &&
                        item.data.gpsPoint.latitude
                      ) {
                        let markers = common.osg.deepCopy(this.map.markers);
                        markers.map(marker => {
                          if (marker.id == item.data._id) {
                            marker.iconPath = '../../static/images/location-blue.png';
                            marker.callout.display = 'ALWAYS';
                            marker.zIndex = 10;
                            marker.joinCluster = false; // 不参与点聚合
                            let map = uni.createMapContext('SAMap', this);
                            map.moveToLocation({
                              longitude: item.data.gpsPoint.longitude,
                              latitude: item.data.gpsPoint.latitude
                            });
                          } else {
                            marker.iconPath = '../../static/images/location-red.png';
                            marker.callout.display = 'BYCLICK';
                            marker.zIndex = 1;
                            marker.joinCluster = true; // 参与点聚合
                          }
                        });
                        this.map.markers = markers;
                      }
                    }
                  }
                }
              })
              .exec();
          }
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
    // 复制到剪切板
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    getProjectById(id, callback) {
      common.osg.ajax(
        'biz/project/queryProject/',
        { _id: id },
        res => {
          if (callback) callback(res.data);
        },
        {
          noload: true
        }
      );
    },
    // 点击备注内容
    describeClick(str) {
      common.osg.toast(str, 'none', 4000);
    },
    describeClick(msg) {
      if (msg.length > 30) {
        common.osg.alert(msg, null, '备注');
      }
    },
    //检查一下当前参数日期 是否大于4月21日
    isAfterApril21(dateStr) {
      const inputDate = new Date(dateStr);
      const targetDate = new Date('2025-04-21T00:00:00');
      // 判断是否为有效日期
      if (isNaN(inputDate.getTime())) {
        return false;
      }
      return inputDate > targetDate;
    },
    // 查询当前登录人所有角色
    getUserRoles(callback) {
      return new Promise((resolve, reject) => {
        common.osg.ajax('role/queryRoleByPersonInTenant', null, res => {
          let currentRole = res.data.find(item => item._id == '5424993602217461538');
          if (currentRole) {
            if (callback) callback(currentRole);
            resolve();
          } else {
            common.osg.alert('当前当前登录用户没有项目管理权限');
            reject();
          }
        });
      });
    },
    // 获取当前角色菜单并存到缓存
    getCurrentRoleFunctions(currentRole) {
      common.osg.ajax(
        'function/changeRole',
        {
          roleIds: currentRole._id
        },
        res => {
          // 缓存当前角色菜单
          let functionList =
            (res.data.functionList[0] && res.data.functionList[0].functionList) || [];
          functionList.map(item => {
            let url = item.action;
            if (url) {
              if (url.indexOf('?') != -1) {
                let paramsString = url.split('?')[1];
                let paramArray = paramsString.split('&');
                let params = {};
                paramArray.map(item => {
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
          wx.setStorageSync('currentRoleFunctions', functionList);
          // 缓存当前角色在工单列表展示的菜单，并将菜单url参数处理为对象
          let saMenu = common.osg.getSAMenu(functionList);
          wx.setStorageSync('saMenu', saMenu);
          app.globalData.funcId = ''; // 清空当前激活菜单，点击底部导航栏进入工单列表后，默认激活第一个菜单。
          // 缓存当前角色按钮
          let buttonList = (res.data.functionList[0] && res.data.functionList[0].buttonList) || [];
          wx.setStorageSync('currentRoleButtons', buttonList);
          this.updatTabbarList();
        }
      );
    },
    checkSession(callback) {
      wx.qy.checkSession({
        success: () => {
          if (callback) callback();
          console.log('checkSession 未过期');
        },
        fail: () => {
          if (callback) callback();
          console.log('checkSession 已过期');
        }
      });
    },
    qwLogin(callback) {
      wx.qy.login({
        success: res => {
          // code 用户登录凭证（有效期五分钟）
          if (callback) callback(res.code);
          console.log('login success ' + JSON.stringify(res));
        },
        fail: err => {
          common.osg.alert(err.message);
        }
      });
    },
    qwMiniLogin(code, callback) {
      common.osg.ajax(
        'index/qwMiniLogin',
        { code, state: '1340835581184723420,wwb580bbf2548e6123,1000016' },
        async res => {
          // 缓存sessionId
          wx.setStorageSync('sessionId', res.data.token);
          // 当前角色不是工队时
          if (res.data.currentRole._id != '5424993602217461538') {
            await this.getUserRoles(currentRole => {
              // 自动切换为工队角色
              res.data.currentRole = currentRole;
            });
          }
          this.getCurrentRoleFunctions(res.data.currentRole);
          // 缓存用户信息
          wx.setStorageSync('user', res.data.user);
          // 缓存当前角色
          wx.setStorageSync('currentRole', res.data.currentRole);
          if (callback) callback();
          // 绑定用户推送标识
          if (common.osg.pushClientId) {
            common.osg.ajax(
              'user/upsertAppPushClientid',
              { appPushClientid: common.osg.pushClientId },
              () => {}
            );
          }
        }
      );
    },
    getContext(callback) {
      console.log('getContext');
      wx.qy.getContext({
        success: res => {
          if (callback) callback(res.entry);
          console.log(`getContext ${res.entry}`);
        },
        fail: err => {
          common.osg.alert(err.message);
          console.log('getContext fail' + JSON.stringify(err));
        }
      });
    },
    getCurExternalChat(callback) {
      wx.qy.getCurExternalChat({
        success: res => {
          this.chatId = res.chatId;
          if (callback) callback(res.chatId);
          console.log('getCurCorpGroupChat success ' + JSON.stringify(res));
        },
        fail: err => {
          console.log('getCurCorpGroupChat err ' + JSON.stringify(err));
          common.osg.alert(err.message);
        }
      });
    }
  }
};
</script>
<style lang="scss">
.projects {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .header {
    // background-color: #ffffff;
    .c-search {
      padding: 0 16px;
      .van-search__content {
        background-color: #f7f8fa;
        border-radius: 8px;
        .van-icon-search {
          color: #c8c9cc;
        }
      }
    }

    .map-view {
      position: relative;
      display: flex;
      flex-direction: column;
      .map {
        width: 100vw;
        border-radius: 0 8px 8px 0;
      }
      .map-zoom {
        position: absolute;
        bottom: 55px;
        left: 5px;
      }
      .map-bottom {
        text-align: center;
        background: #f7f8fa;
        font-weight: 600;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
        z-index: 1;
      }
    }
  }
  #content {
    flex: 1;
    overflow-y: auto;
  }

  // 服务资源
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

.card {
  background-color: #fff;
  width: calc(100vw - 32px);
  margin: 16px;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
  display: grid;
  row-gap: 12px;
  position: relative;
  .card-view {
    line-height: 22px;
    .card-icon-view {
      width: 24px;
      height: 24px;
      box-sizing: border-box;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 20px;
        height: 20px;
      }
    }
    .card-icon-border {
      border: 1px solid #ebedf0;
      border-radius: 4px;
    }
    .card-memo {
      border: 1px solid #e0c697;
      border-radius: 4px;
      background-color: #fff9e6;
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      .card-memo-text {
        font-size: 14px;
        line-height: 20px;
        color: #646566;
      }
    }
  }
  .card-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    gap: 16px;
    .van-button {
      border-radius: 4px;
    }
  }
}
::v-deep .innerView-tag .van-tag {
  margin-right: 5px;
  padding: 2px 5px;
  opacity: 0.6;
}
.customer_profile {
  position: absolute;
  left: 0px;
  bottom: -28px;
  width: 100%;
  height: 32px;
  font-size: 12px;
  padding: 4px 16px 0px 16px;
  display: flex;
  box-sizing: border-box;
  border-radius: 0px 0px 8px 8px;
  align-items: center;
  z-index: 10;
  // background-color: #ebedf0;
  background: linear-gradient(to top, #ebedf0 0%, rgba(235, 237, 240, 0) 99%);

  image {
    width: 12px;
    height: 12px;
  }
}
.mb-44 {
  margin-bottom: 44px;
}
</style>
