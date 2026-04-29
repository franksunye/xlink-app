<template>
  <view>
    <!-- 过滤 -->
    <view class="c-header" style="z-index: 2">
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearchClear"
        use-action-slot
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20"
      >
        <!-- <view slot="action" class="c-flex">
          <van-icon
            custom-style="font-size: 44rpx;"
            name="filter-o"
            @click="filterSortingShow = !filterSortingShow"
          ></van-icon>
        </view> -->
      </van-search>
    </view>

    <!-- 新列表 -->
    <view class="c-content">
      <!-- style="display: flex; justify-content: space-between" -->
      <view class="checkAll" v-if="purchaseOrderItemStatus !== '401'">
        <van-checkbox
          style="padding: 10px 20px 0 20px"
          :value="selectAll"
          @change="selectAllChange"
        >
          全选
        </van-checkbox>
        <!-- <van-checkbox
          style="padding: 10px 20px 0 20px"
          v-model="checkAllFlag"
          @change="checkAll(val)"
        >
          全选
        </van-checkbox> -->

        <view style="padding-right: 15px">
          <van-button class="batchBtn" round type="info" size="small" @click="clickBatch()">
            批量操作
          </van-button>
        </view>
      </view>
      <view style="padding-bottom: 50px">
        <view style="margin: 20rpx" v-for="(newListItem, j) in newList" :key="j">
          <div class="c-card" v-if="item.status !== '401'">
            <van-checkbox
              :value="checkedobj[j]"
              @change="selectNewListChange($event, j, newListItem)"
            ></van-checkbox>
            <view class="c-card-title" style="border-bottom: 1px solid ##f3f3f3">
              <view class="c-flex">
                <van-icon
                  custom-class="c-card-icon"
                  name="balance-list-o"
                  color="#1989fa"
                ></van-icon>
                <text style="font-weight: 600; font-size: 14px">
                  采购单号：{{ newListItem[0].purchaseOrderId }}
                </text>
              </view>
            </view>
            <view class="c-card-content">
              <!-- <view class="c-flex">
                <text>采购订单id：{{ newListItem[0].purchaseOrderId }}</text>
              </view> -->
              <!-- <view class="c-flex">
                <van-icon custom-class="c-card-icon" name="balance-list-o"></van-icon>
                <text>采购单号：{{ newListItem[0].purchaseOrderId }}</text>
              </view> -->
              <view class="c-flex">
                <text>收货人：{{ newListItem[0].purchaseName || '' }}</text>
              </view>
              <view class="c-flex">
                <text>收货电话：{{ newListItem[0].purchasePhone || '' }}</text>
              </view>
              <view class="c-flex">
                <text>收货地址：{{ newListItem[0].purchaseAdress || '' }}</text>
              </view>
              <view class="c-flex">
                <text>采购订单创建时间：{{ newListItem[0].updateTime }}</text>
              </view>
            </view>
            <van-divider dashed />
          </div>
          <view class="c-card" v-for="(item, k) in newListItem" :key="k">
            <view class="c-card-title" style="border-bottom: 0px solid #d4d4d4">
              <view class="c-flex">
                <div class="list-checkbox" v-if="item.status !== '401'">
                  <van-checkbox
                    :value="item.checked"
                    @change="onCheck($event, item)"
                  ></van-checkbox>
                </div>
                <text style="font-size: 13px">发货单状态</text>
              </view>
              <view
                :style="
                  'font-size: 14px;font-weight: 600;' +
                  (item.status == 301 ? 'color:#57A901' : 'color:#0078D0')
                "
              >
                {{
                  codelabel('select', 'purchaseOrderItemStatus', (item && item.status) || '') || ''
                }}
              </view>
            </view>

            <view style="display: flex">
              <view>
                <!--     (item.exts.material && JSON.parse(item.exts.material.images)[0].url) ||
                    '../../static/images/200_200.png' -->
                <!--    :src="
                    item.exts.material.images
                      ? JSON.parse(item.exts.material.images)[0].url
                      : '../../static/images/200_200.png'
                  " -->
                <van-image
                  width="100"
                  height="100"
                  :src="
                    item.exts.material && item.exts.material.images
                      ? JSON.parse(item.exts.material.images)[0].url
                      : '../../static/images/200_200.png'
                  "
                />
                <!-- <image
                    :src="
                      (item.exts.material.images && JSON.parse(item.exts.material.images)[0].url) ||
                      '../../static/images/200_200.png'
                    "
                  /> -->
              </view>
              <view class="c-card-content">
                <!-- <view class="c-flex">
                <text>客户名称：姓名测试{{ item.data.name }}</text>
              </view> -->
                <view class="c-flex">
                  <text style="font-weight: 600">{{ item.productName }}</text>
                  <text v-if="item.exts.present" class="present-tag">赠品</text>
                </view>
                <view class="c-flex materialDetails">
                  <text>单号：{{ item._id }}</text>
                </view>
                <view class="c-flex materialDetails" v-if="item.status == '499'">
                  <text>退货数量：{{ item.count }}</text>
                </view>
                <!-- <view>
                  <text>发货地址：{{ item.sendAddress || '' }}</text>
                </view> -->
                <!-- <view>
                  <text>收货地址：{{ item.deliveryAddress }}</text>
                </view> -->
                <!-- <view>
                  <text>供应商：{{ item.supplierName || '' }}</text>
                </view> -->
                <!-- <view>
                <text>状态：{{ item.status }}</text>
              </view> -->
              </view>
            </view>
            <!--状态值101  待派单  102 已派单 201 已接单  301 已发货 401 已签收 901已作废  -->
            <view class="c-m-t-20">
              <view v-if="item.status !== '499'">
                <van-stepper
                  :value="item.nowCount"
                  :min="0"
                  plus-class="plus-class"
                  minus-class="minus-class"
                  @change="onChange($event, item)"
                  :disabled="
                    (item.status !== '201' && item.status !== '301') || item.exts.present == '赠品'
                  "
                />
              </view>
              <!-- 操作按钮 -->
              <view style="display: flex">
                <!-- <view class="dispatchBtn" v-if="item.status == '102'">
                <van-button round type="danger" size="small" @click="doOperate(item, 901)">
                  作废
                </van-button>
              </view> -->
                <!-- <view class="dispatchBtn" v-if="item.status == '102'">
                <van-button round color="#A9A9A9" size="small" @click="doOperate(item, 101)">
                  撤回
                </van-button>
              </view> -->
                <view class="dispatchBtn" v-if="item.status == '102'">
                  <van-button
                    plain
                    round
                    color="#A9A9A9"
                    size="small"
                    @click="doOperate(item, 101)"
                  >
                    拒单
                  </van-button>
                </view>
                <!-- <view class="dispatchBtn" v-if="item.status == '101'">
                <van-button round type="info" size="small" @click="dispatch(item)">派单</van-button>
              </view> -->
                <view class="dispatchBtn" v-if="item.status == '102'">
                  <van-button
                    plain
                    round
                    type="info"
                    size="small"
                    @click="doOperate(item, 201, newListItem)"
                  >
                    接单
                  </van-button>
                </view>
                <view class="dispatchBtn" v-if="item.status == '201'">
                  <van-button
                    plain
                    round
                    color="#A9A9A9"
                    size="small"
                    @click="doOperate(item, 101, newListItem)"
                  >
                    拒单
                  </van-button>
                </view>
                <view class="dispatchBtn" v-if="item.status == '201'">
                  <van-button
                    plain
                    round
                    color="#A9A9A9"
                    size="small"
                    @click="doOperate(item, 901, newListItem)"
                  >
                    作废
                  </van-button>
                </view>
                <view class="dispatchBtn" v-if="item.status == '201'">
                  <van-button
                    plain
                    round
                    type="info"
                    size="small"
                    @click="doOperate(item, 301, newListItem)"
                  >
                    发货
                  </van-button>
                </view>
                <view class="dispatchBtn" v-if="item.status == '301'">
                  <van-button
                    plain
                    round
                    type="info"
                    size="small"
                    @click="openSignFor(item, 401, newListItem)"
                  >
                    签收
                  </van-button>
                </view>
                <view class="dispatchBtn" v-if="item.status == '401' && item.images">
                  <van-button
                    plain
                    round
                    type="info"
                    size="small"
                    @click="openView(item, 401, newListItem)"
                  >
                    查看
                  </van-button>
                </view>
                <view
                  class="dispatchBtn"
                  v-if="item.status == '401' && item.exts.present !== '赠品'"
                >
                  <van-button
                    plain
                    round
                    type="danger"
                    size="small"
                    @click="openReturnedPurchase(item, newListItem)"
                  >
                    退货
                  </van-button>
                </view>
              </view>
            </view>
            <van-divider customStyle=" border-color: #d4d4d4; "></van-divider>
          </view>
        </view>

        <!-- </view> -->
        <!-- </view> -->
      </view>
    </view>
    <!-- <van-popup :show="supplier.show" position="bottom" custom-style="height: 100%">
      <view class="c-h-1 c-flex c-flex-col sr-popup">
        <view>
          <van-nav-bar
            title="选择供应商"
            left-text="返回"
            right-text="确认"
            left-arrow
            @click-left="cancelSupplier"
            @click-right="saveSupplier"
          />
          <van-search
            :value="supplier.searchValue"
            clearable
            placeholder="请输入供应商名称"
            @change="supplierSearchValue"
            @clear="supplierSearchValue"
          />
        </view>
        <view class="c-flex-1 c-auto-y">
          <van-radio-group :value="supplier.selectId" @change="supplierChange">
            <van-cell-group>
              <block v-for="(item, i) of supplier.data" :key="i">
                <van-cell :title="item.name" clickable>
                  <van-radio slot="right-icon" :name="item._id" />
                </van-cell>
              </block>
            </van-cell-group>
          </van-radio-group>
        </view>
      </view>
    </van-popup> -->
    <van-action-sheet
      :show="batch.show"
      :actions="batch.actions"
      @close="batch.show = false"
      @select="onSelect"
    />
    <van-popup :show="signFor.show" position="bottom">
      <!-- <view class="c-h-1 c-flex c-flex-col sr-popup"> -->
      <view>
        <van-nav-bar
          title="签收"
          left-text="返回"
          right-text="确认"
          left-arrow
          @click-left="cancelSignFor"
          @click-right="saveSignFor"
        />
        <view>
          <div class="c-card">
            <view class="c-flex" style="padding: 10px 16px">
              <text>签收照片</text>
              <van-uploader
                style="display: flex"
                multiple
                :file-list="formData['image']"
                data-field="image"
                upload-text="上传"
                @after-read="afterRead"
                @delete="deleteFile"
              />
            </view>
            <view class="c-flex">
              <!-- <van-cell-group> -->
              <van-field
                label="签收描述"
                :value="textarea"
                placeholder="请输入签收描述"
                input-align="right"
                :border="false"
                @change="changeTextarea"
              />
              <!-- </van-cell-group> -->
            </view>
          </div>
        </view>
      </view>
      <!-- </view> -->
    </van-popup>
    <van-popup :show="view.show" position="bottom">
      <!-- <view class="c-h-1 c-flex c-flex-col sr-popup"> -->
      <view v-if="view.data.images">
        <van-nav-bar title="查看" left-text="返回" left-arrow @click-left="cancelView" />
        <view>
          <div class="c-card">
            <view
              class="c-flex"
              style="padding: 10px 16px; justify-content: space-between; flex-flow: wrap"
            >
              <text style="padding-right: 10px">签收照片：</text>
              <van-image
                v-for="(item, i) in view.data.images.split(',')"
                :key="i"
                width="100"
                height="100"
                :src="item"
                @click="previewSqs(item)"
              />
            </view>
            <view class="c-flex" style="padding: 10px 16px">
              <text>签收描述：{{ view.data.textarea || '' }}</text>
            </view>
          </div>
        </view>
      </view>
      <!-- </view> -->
    </van-popup>
    <van-popup :show="returnedPurchase.show" position="bottom">
      <van-nav-bar
        title="退货"
        left-text="返回"
        right-text="确认"
        left-arrow
        @click-left="cancelReturnedPurchase"
        @click-right="saveReturnedPurchase"
      />
      <view>
        <div>
          <view class="c-card">
            <view style="margin-bottom: 20px">
              <text>产品名称：{{ returnedPurchase.data.productName || '' }}</text>
            </view>
            <view style="display: flex; justify-content: space-between">
              <text>退货数量：</text>
              <van-stepper
                :value="returnedPurchase.data.nowCount"
                :min="0"
                :max="returnedPurchase.data.nowCount"
                plus-class="plus-class"
                minus-class="minus-class"
                @change="returnedPurchaseChange($event, returnedPurchase.data)"
              />
            </view>
          </view>
        </div>

        <!-- :disabled="item.status !== '201' && currentRole_id == '2449148386138867771' -->
      </view>
    </van-popup>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
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
        codecfg_stage: {
          codeId: 'STAGE'
        },
        codecfg_status: {
          codeId: 'purchaseOrderItemStatus'
        },
        codecfg_purchaseOrderItemStatus: {
          codeId: 'purchaseOrderItemStatus'
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
      // 省市区
      areaList: Object.assign({}, areajs.default),

      // 工单状态分类
      active: 'all', //当前激活的tab页
      activeShow: true,
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
      purchaseOrderId: '',
      checkAllFlag: false, //全选判断标识
      CheckedAllArr: [], //全选数组
      supplier: {
        show: false,
        data: [],
        searchValue: '',
        selectId: '',
        list: []
      },
      //批量操作弹框
      batch: {
        show: false,
        actions: [
          {
            name: '批量接单'
          },
          {
            name: '批量发货'
          },
          {
            name: '批量签收'
          }
        ]
      },
      allRowList: [], //勾选上的全部数据
      rowList: [], //勾选上的单个数据id
      supplierOrgId: '', //供应商ID
      supplierId: '',
      purchaseOrderItemStatus: '', //发货单状态
      handleCheckedList: [], //单选选中的数据
      selectAll: false,
      newList: [], //按照创建时间排序后的数据
      selectNewList: false, //重组排序后的按钮
      //签收上传图片
      signFor: {
        show: false,
        list: []
      },
      textarea: '', //签收描述
      // 查看弹窗
      view: {
        show: false,
        data: {}
      },
      checkedobj: {},
      returnedPurchase: {
        show: false,
        data: {},
        upsertCount: '',
        newListItem: []
      },
      purchaseOrderItemMaterial: [], //作废订单查询所有发货单数据
      returnedPurchaseOrderItemMaterial: [], //退货查询所有发货单数据
      page: 1, // 当前页数
      rows: 20, // 每页数量
      newListData: [], // 存储数据的数组
      isEnd: false // 是否到达最后一页
    };
  },
  methods: {
    onLoad: function (option) {
      this.purchaseOrderItemStatus = option.purchaseOrderItemStatus;
      let _currentUser = wx.getStorageSync('user');
      this.supplierOrgId = _currentUser.orgId;
      this.doInit();
      common.osg.codeoption(() => {
        this.getData();
      });
    },
    doInit(param) {
      common.osg.init(this, param, app);
      this.page = 1;
      this.rows = 20;
      this.list = [];
      this.newList = [];
      // this.getSupplier();
      common.osg.codeoption(() => {
        this.getData();
      });
    },
    onSearch: function (e) {
      this.searchValue = e.detail;
      this.page = 1;
      this.rows = 20;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.getData();
    },
    onSearchClear: function (e) {
      this.searchValue = e.detail;
      this.page = 1;
      this.rows = 20;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.getData();
      // wx.startPullDownRefresh();
      this.isEnd = false;
    },
    getData() {
      this.checkAllFlag = false;
      this.CheckedAllArr = [];
      let that = this;
      var params = {
        // _all: '1',
        page: this.page,
        rows: this.rows,
        sortField: 'createTime',
        sortOrder: 'desc',
        // orgId: this.supplierOrgId,
        // notFilterOrgId: 1,
        supplierId: this.supplierId,
        notFilterBelongTo: 1,
        'regex:_id|string#or': this.searchValue,
        'regex:purchaseName|string#or': this.searchValue,
        'regex:purchasePhone|string#or': this.searchValue,
        'regex:purchaseAdress|string#or': this.searchValue,
        'regex:purchaseOrderId|string#or': this.searchValue,
        'regex:productName|string#or': this.searchValue,
        'is:status|string#and': this.purchaseOrderItemStatus || ''
      };
      common.osg.ajax('basic/purchaseOrder/queryPurchaseOrderItem.do', params, res => {
        res.data.map(item => {
          item.checked = false;
        });
        // this.list = res.data;
        const newData = res.data;

        if (newData.length > 0) {
          const list = this.list.concat(newData);
          this.setData({
            list: list,
            page: this.page + 1
          });

          this.newList = [];
          for (let i = 0; i < this.list.length; i++) {
            let find = false;
            let obj = this.list[i];
            for (let j = 0; j < this.newList.length; j++) {
              let newArr = this.newList[j];
              if (newArr[0].purchaseOrderId == obj.purchaseOrderId) {
                newArr.push(obj);
                find = true;
                break;
              }
            }
            if (!find) {
              this.newList.push([obj]);
            }
          }
        } else {
          // 如果返回结果为空，表示已到达最后一页
          this.$forceUpdate();
          this.setData({ isEnd: true });
          common.osg.toast('没有更多数据', 'none', 5000);
        }
      });
    },

    loadMore() {
      // 加载更多数据，触发下一页查询
      if (!this.isEnd) {
        this.getData();
      }
    },
    onReachBottom() {
      // 监听用户滚动到底部事件，自动触发加载更多数据
      this.loadMore();
    },
    onPullDownRefresh() {
      // 下拉刷新页面，重新加载第一页数据
      this.setData({
        dataList: [],
        page: 1,
        isEnd: false
      });
      this.getData();
      wx.stopPullDownRefresh();
    },
    codelabel(type, option, val) {
      if (!val) return;
      if (type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
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
    onCheck(e, item) {
      item.checked = e.detail;
      // 全选标识
      for (let i = 0; i < this.list.length; i++) {
        if (!this.list[i].checked) {
          this.selectAll = false;
          return;
        }
      }
      this.selectAll = true;
      // console.log(this.newList, '222this.newList');
    },
    selectAllChange(e) {
      this.selectAll = e.detail;
      if (this.selectAll) {
        this.list.map(item => {
          item.checked = true;
        });
      } else {
        this.list.map(item => {
          item.checked = false;
        });
      }
    },
    // 采后订单上的全选按钮  event.detail
    selectNewListChange(e, j, newListItem) {
      this.$set(this.checkedobj, j, e.detail);
      if (e.detail == true) {
        newListItem.map(item => {
          item.checked = true;
        });
      }
      if (e.detail == false) {
        newListItem.map(item => {
          item.checked = false;
        });
      }
    },
    onChange(e, item) {
      item.count = e.detail;
      // console.log(e.detail);
    },
    // 单个操作
    async doOperate(e, val, newListItem) {
      let voucherId = '';
      let arr = [];
      // 901取消订单的时候走退还优惠卷逻辑
      if (val == 901) {
        // 查询所有发货订单
        await new Promise(resolve => {
          var params = {
            _all: '1',
            sortField: 'createTime',
            sortOrder: 'desc',
            purchaseOrderId: e.purchaseOrderId,
            notFilterBelongTo: 1
          };
          common.osg.ajax('basic/purchaseOrder/queryPurchaseOrderItem.do', params, res => {
            this.purchaseOrderItemMaterial = res.data;
            resolve();
          });
        });
        // 取消赠品时，退还优惠券
        if (e.exts.voucherId && e.exts.present) {
          voucherId = e.exts.voucherId;
        }

        // 判断剩余未取消商品是否仍满足优惠券使用条件，不满足则将赠品同步退回
        if (e.exts.voucherId && !e.exts.present) {
          await new Promise(resolve => {
            common.osg.ajax('biz/voucher/findById', { id: e.exts.voucherId }, res => {
              let voucher = res.data;
              // 判断使用范围和对应数量 1：适用材料 2：机措 3：商品分类 4：店铺通用
              let verify2 = true;
              if (voucher.type == 1 || voucher.type == 2) {
                // 1按材料 2按机措匹配
                // 满赠
                if (voucher.conditionType == 1) {
                  let availableTotal = 0;
                  this.purchaseOrderItemMaterial.map(item => {
                    let good = item.exts.material;
                    if (
                      e.exts.material._id != good._id &&
                      !item.exts.present &&
                      // item.status != '901' &&
                      voucher.typeIds.indexOf(good._id) != -1
                    ) {
                      availableTotal += good.exts.count;
                    }
                  });
                  if (availableTotal < voucher.condition) {
                    verify2 = false;
                  }
                }
              } else if (voucher.type == 3) {
                // 3按商品分类匹配
                // 满赠
                if (voucher.conditionType == 1) {
                  let availableTotal = 0;
                  this.purchaseOrderItemMaterial.map(item => {
                    let good = item.exts.material;
                    if (
                      e.exts.material._id != good._id &&
                      !item.exts.present &&
                      // item.status != '901' &&
                      voucher.typeIds.indexOf(good.classifyId) != -1
                    ) {
                      availableTotal += good.exts.count;
                    }
                  });
                  if (availableTotal < voucher.condition) {
                    verify2 = false;
                  }
                }
              } else if (voucher.type == 4) {
                // 4店铺通用
                // 满赠
                if (voucher.conditionType == 1) {
                  let availableTotal = 0;
                  this.purchaseOrderItemMaterial.map(item => {
                    let good = item.exts.material;
                    if (
                      e.exts.material._id != good._id &&
                      !item.exts.present
                      // &&
                      // item.status != '901'
                    ) {
                      availableTotal += good.exts.count;
                    }
                  });
                  if (availableTotal < voucher.condition) {
                    verify2 = false;
                  }
                }
              }
              // 不满足使用条件 classifyId: "6239294986987325343"(商品分类赠品id)

              if (!verify2) {
                voucherId = e.exts.voucherId;
                // 找到赠品，插入要取消的商品数组
                for (let i = 0; i < this.purchaseOrderItemMaterial.length; i++) {
                  if (this.purchaseOrderItemMaterial[i].exts.present) {
                    arr.push(this.purchaseOrderItemMaterial[i]);
                    break;
                  }
                }
              }

              // if (!verify2) {
              //   voucherId = e.exts.voucherId;
              //   // 找到赠品，插入要取消的商品数组
              //   for (let i = 0; i < newListItem.length; i++) {
              //     if (newListItem[i].exts.present) {
              //       arr.push(newListItem[i]);
              //       break;
              //     }
              //   }
              // }
              resolve();
            });
          });
        }
      }
      let msg = '';
      if (val == 901) {
        msg = '是否确认取消此订单？';
      }
      if (val == 301) {
        msg = '是否确认发货？';
      }
      if (val == 101) {
        msg = '是否确认拒单？';
      }
      if (val == 201) {
        msg = '是否确认接单？';
      }
      if (arr.length > 0) {
        msg = `赠品“${arr[0].productName}”也会同时取消，是否确认取消此订单？`;
      }
      common.osg.confirm(msg, () => {
        arr.push(e);
        var params = {
          purchaseOrderItemList: arr,
          newStatus: val,
          voucherId: voucherId || ''
        };
        console.log(params, 'params');
        common.osg.ajax(
          'basic/purchaseOrder/batchingPurchaseOrderItem.do',
          { data: JSON.stringify(params) },
          res => {
            common.osg.toast('操作成功');
            this.purchaseOrderItemMaterial = [];
            this.doInit();
          }
        );
      });
    },
    // 单个操作

    // doOperate(e, val) {
    //   common.osg.confirm('请确认操作', () => {
    //     // 判断有赠品标识，退货时多传voucherId参数
    //     let voucherId = '';
    //     if (e.exts.present == '赠品') {
    //       voucherId = e.exts.voucherId;
    //     }
    //     let arr = [];
    //     arr.push(e);
    //     var params = {
    //       purchaseOrderItemList: arr,
    //       newStatus: val,
    //       voucherId: voucherId || ''
    //     };
    //     // console.log(params, 'params');
    //     common.osg.ajax(
    //       'basic/purchaseOrder/batchingPurchaseOrderItem.do',
    //       { data: JSON.stringify(params) },
    //       res => {
    //         common.osg.toast('操作成功', 'none');
    //         this.getData();
    //       }
    //     );
    //   });
    // },
    // 派单

    // 派单操作
    dispatch(e) {
      this.supplier.list = e;
      // this.getSupplier();
      this.supplier.show = true;
    },
    // 批量操作
    onSelect(e) {
      // console.log(e.detail);
      this.doBatch(e.detail);
    },
    clickBatch() {
      this.batch.show = true;
    },

    doBatch(val) {
      let checkList = []; //选中的数据
      let rightArr = []; //过滤出正确的数据
      let errorCount = []; //过滤出错误的条数
      this.list.map(item => {
        if (item.checked) {
          checkList.push(item);
        }
      });
      if (checkList.length == 0) {
        common.osg.toast('请先勾选', 'none');
        return;
      }
      common.osg.confirm('请确认操作', () => {
        if (val.name == '批量接单') {
          checkList.map(item => {
            if (item.status.includes('102')) {
              rightArr.push(item);
            }
          });
          if (rightArr.length == 0) {
            common.osg.toast('您选中的状态不是待接单', 'none');
            return;
          }
          errorCount = checkList.length - rightArr.length;
          var params = {
            purchaseOrderItemList: rightArr,
            newStatus: '201'
          };
        }
        if (val.name == '批量发货') {
          checkList.map(item => {
            if (item.status.includes('201')) {
              rightArr.push(item);
            }
          });
          if (rightArr.length == 0) {
            common.osg.toast('您选中的状态不是待发货', 'none');
            return;
          }
          errorCount = checkList.length - rightArr.length;
          var params = {
            purchaseOrderItemList: rightArr,
            newStatus: '301'
          };
        }
        if (val.name == '批量签收') {
          checkList.map(item => {
            if (item.status.includes('301')) {
              rightArr.push(item);
            }
          });
          if (rightArr.length == 0) {
            common.osg.toast('您选中的状态不是待签收', 'none');
            return;
          }
          for (let item of rightArr) {
            if (item.supplierId.indexOf(rightArr[0].supplierId) == -1) {
              common.osg.toast('请选择相同供应商', 'none');
              return;
            }
          }
          errorCount = checkList.length - rightArr.length;
          var params = {
            purchaseOrderItemList: rightArr,
            newStatus: '401'
          };
          this.openSignFor(rightArr);
          return;
        }

        common.osg.ajax(
          'basic/purchaseOrder/batchingPurchaseOrderItem.do',
          { data: JSON.stringify(params) },
          res => {
            common.osg.alert(`成功数据${rightArr.length}条，失败${errorCount}条`);
            errorCount = '';
            rightArr = [];
            checkList = [];
            this.checkedobj = {};
            this.selectAll = false;
            this.getData();
          }
        );
      });
    },
    cancelSignFor() {
      this.signFor.show = false;
      this.signFor.list = [];
      this.formData.image = [];
      this.textarea = '';
    },
    // 签收上传图片
    openSignFor(e) {
      if (e.constructor === Array) {
        this.signFor.list = e;
      } else {
        this.signFor.list.push(e);
      }
      this.signFor.show = true;
    },
    saveSignFor() {
      let str = '';
      this.formData.image.map(item => {
        str += item.url + ',';
      });
      str = str.substring(0, str.length - 1);
      // console.log(str, '---str');
      var params = {
        purchaseOrderItemList: this.signFor.list,
        newStatus: '401',
        images: str,
        textarea: this.textarea
      };
      // console.log(params, 'params');
      common.osg.ajax(
        'basic/purchaseOrder/batchingPurchaseOrderItem.do',
        { data: JSON.stringify(params) },
        res => {
          common.osg.toast('操作成功', 'none');
          this.doInit();
          this.signFor.show = false;
          this.signFor.list = [];
          this.formData.image = [];
          this.textarea = '';
          this.checkedobj = {};
          this.selectAll = false;
        }
      );
    },
    // 上传图片
    afterRead(e) {
      common.osg.afterRead(e, this);
    },
    deleteFile(e) {
      let field = e.target.dataset.field;
      let index = e.detail.index;
      this.formData[field].splice(index, 1);
      this.$forceUpdate();
    },

    changeTextarea(e) {
      this.setData({
        textarea: e.detail
      });
    },
    /**
     * 查看弹窗
     */
    cancelView() {
      this.view.show = false;
      this.view.data = [];
    },
    openView(e) {
      this.view.data = e;
      // console.log(this.view.data, 'this.view.data');
      this.view.show = true;
    },
    // 图片点击事件
    previewSqs(e) {
      // 拿到图片的地址url
      let currentUrl = e;
      // 微信预览图片的方法
      wx.previewImage({
        current: currentUrl, // 图片的地址url
        urls: [currentUrl] // 预览的地址url
      });
    },
    // 退货
    openReturnedPurchase(e, newListItem) {
      this.returnedPurchase.show = true;
      this.returnedPurchase.data = e;
      this.returnedPurchase.upsertCount = e.nowCount;
      // this.returnedPurchase.newListItem = newListItem;
    },
    cancelReturnedPurchase() {
      this.returnedPurchase.show = false;
      this.returnedPurchase.data = {};
      // this.returnedPurchase.newListItem = [];
    },
    returnedPurchaseChange(e, item) {
      if (Number(e.detail) > Number(this.returnedPurchase.data.nowCount)) {
        this.returnedPurchase.upsertCount = this.returnedPurchase.data.nowCount;
      } else {
        this.returnedPurchase.upsertCount = e.detail;
      }
      console.log(this.returnedPurchase.upsertCount, 'this.returnedPurchase.upsertCount');
    },
    async saveReturnedPurchase() {
      // 判断退货为0时 弹窗提醒 return
      if (this.returnedPurchase.upsertCount == 0) {
        common.osg.toast('请选择退货数量', 'none');
        return;
      }
      let voucherId = '';
      let arr = [];
      // 查询所有发货订单
      await new Promise(resolve => {
        var params = {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          purchaseOrderId: this.returnedPurchase.data.purchaseOrderId,
          notFilterBelongTo: 1
        };
        common.osg.ajax('basic/purchaseOrder/queryPurchaseOrderItem.do', params, res => {
          this.returnedPurchaseOrderItemMaterial = res.data;
          resolve();
        });
      });
      // if (e.exts.voucherId && e.exts.present) {
      //     voucherId = e.exts.voucherId;
      //   }

      // 判断剩余未取消商品是否仍满足优惠券使用条件，不满足则将赠品同步退回
      if (this.returnedPurchase.data.exts.voucherId && !this.returnedPurchase.data.exts.present) {
        await new Promise(resolve => {
          common.osg.ajax(
            'biz/voucher/findById',
            { id: this.returnedPurchase.data.exts.voucherId },
            res => {
              let voucher = res.data;
              // 判断使用范围和对应数量 1：适用材料 2：机措 3：商品分类 4：店铺通用
              let verify2 = true;
              if (voucher.type == 1 || voucher.type == 2) {
                // 1按材料 2按机措匹配
                // 满赠
                if (voucher.conditionType == 1) {
                  let availableTotal = 0;
                  this.returnedPurchaseOrderItemMaterial.map(item => {
                    let good = item.exts.material;
                    if (
                      // this.returnedPurchase.data.exts.material._id != good._id &&
                      !item.exts.present &&
                      // item.status != '901' &&
                      voucher.typeIds.indexOf(good._id) != -1
                    ) {
                      availableTotal += Number(item.nowCount);
                      // console.log(availableTotal, '----availableTotal');
                    }
                  });
                  availableTotal = availableTotal - this.returnedPurchase.upsertCount;
                  if (availableTotal < voucher.condition) {
                    verify2 = false;
                  }
                }
              } else if (voucher.type == 3) {
                // 3按商品分类匹配
                // 满赠
                if (voucher.conditionType == 1) {
                  let availableTotal = 0;
                  this.returnedPurchaseOrderItemMaterial.map(item => {
                    let good = item.exts.material;
                    if (
                      // this.returnedPurchase.data.exts.material._id != good._id &&
                      !item.exts.present &&
                      // item.status != '901' &&
                      voucher.typeIds.indexOf(good.classifyId) != -1
                    ) {
                      availableTotal += Number(item.nowCount);
                      // console.log(availableTotal, '----availableTotal');
                    }
                  });
                  availableTotal = availableTotal - this.returnedPurchase.upsertCount;
                  if (availableTotal < voucher.condition) {
                    verify2 = false;
                  }
                }
              } else if (voucher.type == 4) {
                // 4店铺通用
                // 满赠
                if (voucher.conditionType == 1) {
                  let availableTotal = 0;
                  this.returnedPurchaseOrderItemMaterial.map(item => {
                    let good = item.exts.material;
                    if (
                      // this.returnedPurchase.data.exts.material._id != good._id &&
                      !item.exts.present
                      // &&
                      // item.status != '901'
                    ) {
                      availableTotal += Number(item.nowCount);

                      // console.log(availableTotal, '----availableTotal');
                    }
                  });
                  availableTotal = availableTotal - this.returnedPurchase.upsertCount;
                  if (availableTotal < voucher.condition) {
                    verify2 = false;
                  }
                }
              }
              // 不满足使用条件
              if (!verify2) {
                voucherId = this.returnedPurchase.data.exts.voucherId;
                // 找到赠品，插入要取消的商品数组
                for (let i = 0; i < this.returnedPurchaseOrderItemMaterial.length; i++) {
                  if (this.returnedPurchaseOrderItemMaterial[i].exts.present) {
                    arr.push(this.returnedPurchaseOrderItemMaterial[i]);
                    break;
                  }
                }
              }
              resolve();
            }
          );
        });
      }

      if (this.returnedPurchase.upsertCount !== '') {
        this.returnedPurchase.data.count = `-${this.returnedPurchase.upsertCount}`;
      }
      let msg = '是否确认取消此订单？';
      if (arr.length > 0) {
        msg = `赠品“${arr[0].productName}”也会同时取消，是否确认取消此订单？`;
      }
      common.osg.confirm(msg, () => {
        arr.push(this.returnedPurchase.data);
        var params = {
          purchaseOrderItemList: arr,
          newStatus: '498',
          voucherId: voucherId || ''
        };
        common.osg.ajax(
          'basic/purchaseOrder/batchingPurchaseOrderItem.do',
          { data: JSON.stringify(params) },
          res => {
            common.osg.toast('操作成功', 'none');

            this.returnedPurchase.data = {};
            this.returnedPurchaseOrderItemMaterial = [];
            this.doInit();
            this.returnedPurchase.show = false;
          }
        );
      });
    }

    /**
     * 生命周期函数--监听页面显示
     */
    // onShow: function () {
    //   let _currentUser = wx.getStorageSync('user');
    //   console.log(_currentUser, '---_currentUser');
    //   this.currentOrgid = _currentUser.orgId;
    //   console.log(this.currentOrgid, '---this.currentOrgid');
    //   this.getData();
    //   if (this.loadType == 'onLoad') {
    //     this.loadType = 'onShow';
    //     return;
    //   }

    //   // this.doInit({});
    // }
  }
};
</script>
<style lang="scss">
.materialDetails {
  color: #888888;
  font-size: 11px;
}
.batchBtn {
  > button {
    height: 38px;
    width: 103.5px;
  }
}
.c-card-content {
  > view {
    padding: 5px;
    > text {
      font-size: 13px;
    }
  }
}
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

.text-content view {
  line-height: 35px;
  border-bottom: 1px solid #ebedf0;
}
.checkAll {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
  line-height: 45px;
  z-index: 99;
}
.dispatchBtn {
  padding: 0 5px;
}
.c-card {
  margin: 0rpx;
}

.present-tag {
  margin-left: 5px;
  padding: 1px 1px;
  border-radius: 3px;
  font-size: 10px !important;
  display: inline-flex;
  border: 1px solid #1989fa;
  color: #1989fa;
  /* background-color: #1989fa; */
}
/* .plus-class {
  border-radius: 50%;
  overflow: hidden;
  background: #f3bb62;
}
.minus-class {
  border-radius: 50%;
  overflow: hidden;
  background-color: #f7f8fa;
} */
</style>
