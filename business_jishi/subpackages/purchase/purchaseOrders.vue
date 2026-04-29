<template>
  <view class="purchaseOrders" @click.capture="track">
    <!-- 过滤 -->
    <van-search
      :value="searchValue"
      @search="onSearch"
      @clear="onSearch"
      use-action-slot
      shape="round"
      placeholder="请输入搜索关键词"
      custom-class="c-p-20"
    ></van-search>

    <!-- 新列表 -->
    <scroll-view
      class="c-flex-1 c-auto-y"
      lower-threshold="300"
      enable-passive
      scroll-y
      @scrolltolower="handleScroll"
    >
      <view style="padding-bottom: 40px">
        <!-- <view
          :id="'listitem-' + func._id + '-' + j"
          v-for="(listitem, j) in boundings"
          :key="j"
          :style="{
            height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
            margin: '20rpx 0'
          }"
        >
          <view
            class="c-card"
            v-for="(item, k) in list[j]"
            :key="k"
            :data-id="item._id"
            @tap="doOpen('purchaseOrderItems', { purchaseOrderId: item._id })"
          > -->
        <view
          class="c-card"
          v-for="(item, k) in list"
          :key="k"
          :data-id="item._id"
          @tap="doOpen('purchaseOrderItems', { purchaseOrderId: item._id })"
        >
          <view class="c-card-title">
            <view @click.stop="copy(item._id)" :data-event="{ id: 'JiWmf91Loz' }">
              单号：{{ item._id }}
            </view>
            <view class="c-red">
              {{ codelabel('purchaseOrderStatus', item.state) }}
            </view>
          </view>

          <view class="c-card-content">
            <view class="c-card-content-item">
              <view class="c-card-content-item-label">创建人：</view>
              <view>{{ item.createUserName || '' }}</view>
            </view>
            <view class="c-card-content-item">
              <view>创建时间：</view>
              <view>{{ item.createTime || '' }}</view>
            </view>
            <view class="c-card-content-item">
              <view>收货人：</view>
              <view>{{ item.purchaseName || '' }}</view>
            </view>
            <view class="c-card-content-item">
              <view>收货地址：</view>
              <view>{{ item.purchaseAdress || '' }}</view>
            </view>
            <view class="c-card-content-item">
              <view>预约配送：</view>
              <view>预计{{ item.exts.expectedArrivalime || '' }}送达</view>
            </view>
            <view class="c-card-content-item">
              <view>订单总价：</view>
              <view>¥ {{ item.totalPrice || '' }}</view>
            </view>
            <view class="c-card-content-item">
              <view>支付状态：</view>
              <view>
                {{ item.payState == 0 ? '待支付' : item.payState == '1' ? '已付清' : '未知' }}
              </view>
            </view>
          </view>
          <view class="c-card-footer">
            <van-button
              v-if="item.payState == 0"
              plain
              round
              size="small"
              class="c-m-l-20"
              @click.native.stop="onPaymentClick(item)"
              :data-event="{ id: 'PqFkv02bSt' }"
            >
              支付
            </van-button>
            <van-button
              plain
              round
              size="small"
              @click.native.stop="reorder(item)"
              class="c-m-l-20"
              :data-event="{ id: 'sxi_wS9nFH' }"
            >
              再来一单
            </van-button>
            <van-button
              plain
              round
              size="small"
              @click.native.stop="doOpen('purchaseOrderItems', { purchaseOrderId: item._id })"
              class="c-m-l-20"
              :data-event="{ id: 'fbvJe7Qih9' }"
            >
              查看
            </van-button>
          </view>
        </view>
        <uni-load-more v-if="reachBottom" iconType="circle" status="loading" />
      </view>
      <!-- </view> -->
    </scroll-view>
    <!-- 支付 -->
    <van-popup
      :show="payment.show"
      round
      position="bottom"
      @close="onPaymentClose()"
      custom-style="padding:16px 16px 30px"
    >
      <view class="c-flex c-flex-between c-item-center">
        <text>订单编号：</text>
        <text
          class="c-bold"
          @click="copy(payment.purchaseOrderId)"
          :data-event="{ id: 'd0B4ilsHBR' }"
        >
          {{ payment.purchaseOrderId }}
        </text>
      </view>
      <view class="c-flex c-flex-between c-item-center c-m-t-10 c-red">
        <text>订单金额：</text>
        <text class="c-bold">¥ {{ payment.totalPrice }}</text>
      </view>
      <view class="c-flex c-flex-between c-item-center c-m-t-10">
        <text>我的信用额度：</text>
        <text class="c-bold">¥ {{ payment.creditLimit }}</text>
      </view>
      <view class="c-flex c-flex-between c-item-center c-m-t-10">
        <text>我的返利额度：</text>
        <text class="c-bold">¥ {{ payment.rewardLimit }}</text>
      </view>
      <view class="c-flex c-flex-between c-item-center c-m-t-10">
        <view>
          最大可用返利额度：
          <van-icon
            name="info"
            class="c-gray"
            @click="toast('最大可用返利额度 = 订单金额 * 可使用返利比例', 'none', 4000)"
            :data-event="{ id: 'cJ8ELtiMFD' }"
          />
        </view>
        <text>
          <text class="c-m-r-10">{{ payment.totalPrice }} * {{ payment.type }}% =</text>
          <text class="c-bold">¥ {{ payment.availableRewardLimit }}</text>
        </text>
      </view>
      <view class="c-flex c-flex-end c-item-center c-m-t-30">
        <van-button
          v-if="
            payment.availableRewardLimit >= payment.rewardLimit
              ? payment.rewardLimit + payment.creditLimit >= payment.totalPrice
              : payment.availableRewardLimit + payment.creditLimit >= payment.totalPrice
          "
          round
          type="info"
          custom-style="height:40px"
          color="#ff6900"
          @click="payPurchaseOrder()"
          :data-event="{ id: 'q2dk9bcCaK' }"
        >
          确认支付
        </van-button>
        <van-button
          v-else
          round
          type="danger"
          custom-style="height:40px"
          @click="doOpen('/subpackages/wallet/recharge')"
          :data-event="{ id: '5JIPl_pgLD' }"
        >
          去充值
        </van-button>
      </view>
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
      phone: '',
      windowHeight: '',
      reachBottom: false, //是否触底 正在刷新
      boundings: [], //外层列表每页数据的边界值
      index: 0, //当前页码
      list: [], //全部已获取数据
      lastLoadTime: 0, //上次加载时间
      fpi: {
        data: [],
        page: 1,
        rows: 20,
        total: 0 //总条数
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
        codecfg_purchaseOrderStatus: {
          codeId: 'purchaseOrderStatus'
        },
        codecfg_priority: {
          codeId: 'PRIORITY'
        },
        cascadeCode_channel: {
          codeId: 'channel'
        }
      },
      // 省市区
      areaList: Object.assign({}, areajs.default),

      // 工单状态分类
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
      currentOrgid: '', //user上的orgid
      purchaseOrderStatus: '', //采购订单状态
      purchaseOrderPayState: '', //采购订单支付状态
      currentRole_id: '', //当前登录人的_id  3025142616514869963  伙伴服务商平台管理员ID
      payment: {
        show: false,
        creditLimit: 0, // 信用额度
        rewardLimit: 0, // 返利额度
        type: 0, // 使用返利比例
        availableRewardLimit: 0, // 可使用返利比例
        totalPrice: 0,
        purchaseOrderId: ''
      },
      timer: null
    };
  },
  onLoad: function (option) {
    this.purchaseOrderStatus = option.status != 'null' ? option.status : null;
    this.purchaseOrderPayState = option.payState != 'null' ? option.payState : null;
    this.phone = wx.getStorageSync('user').phone;
  },
  onHide() {
    clearInterval(this.timer);
  },
  onUnload() {
    clearInterval(this.timer);
  },
  methods: {
    doInit(param) {
      common.osg.init(this, param, app);
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

    getData() {
      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }
      if (this.currentRole_id == '3025142616514869963') {
        var params = {
          page: this.fpi.page,
          rows: this.fpi.rows,
          sortField: 'createTime',
          sortOrder: 'desc',
          'regex:createUserName|string#or': this.searchValue,
          'regex:_id|string#or': this.searchValue,
          'regex:createTime|string#or': this.searchValue,
          // 'regex:purchaseName|string#or': this.searchValue,
          'regex:purchaseAdress|string#or': this.searchValue,
          'is:state|integer#and': this.purchaseOrderStatus,
          'is:payState|integer#and': this.purchaseOrderPayState
        };
      } else {
        var params = {
          page: this.fpi.page,
          rows: this.fpi.rows,
          sortField: 'createTime',
          sortOrder: 'desc',
          orgId: this.currentOrgid,
          'regex:purchaseAdress|string#or': this.searchValue,
          'regex:_id|string#or': this.searchValue,
          'regex:createUserName|string#or': this.searchValue,
          'regex:photo|string#or': this.searchValue,
          'regex:address|string#or': this.searchValue,
          'regex:describe|string#or': this.searchValue,
          'regex:orderNum|string#or': this.searchValue,
          'is:state|integer#and': this.purchaseOrderStatus,
          'is:payState|integer#and': this.purchaseOrderPayState
        };
      }
      common.osg.ajax('basic/purchaseOrder/query.do', params, res => {
        this.fpi.pages = res.pages;
        this.fpi.total = res.total;
        //关闭加载提示
        this.reachBottom = false;
        //去掉重复数据
        const newData = res.data;
        this.list = [
          ...this.list,
          ...newData.filter(item => !this.list.some(oldItem => oldItem._id === item._id))
        ];

        console.log(this.list, '----this.list');
        this.boundings.push({});
      });
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    //反显字典表
    codelabel: function (codeType, codeValue) {
      var opts = this.options[codeType];
      if (opts) {
        for (var i = 0; i < opts.length; i++) {
          if (codeValue == opts[i].value) return opts[i].name;
        }
      }
      if (!codeValue) {
        return codeValue;
      } else {
        return '未知';
      }
    },
    // codelabel(type, option, val) {
    //   if (!val) return;
    //   if (type == 'select') {
    //     return common.osg.codelabel(option, val);
    //   } else if (type == 'cascade') {
    //     return common.osg.formatCascade(option, val);
    //   }
    // },

    onPullDownRefresh: function () {
      this.fpi.page = 1;
      this.getData();
    },
    onReachBottom() {
      if (!this.reachBottom) {
        this.reachBottom = true;
        this.fpi.page++;
        this.getData();
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
    // 再来一单
    reorder(item) {
      let cart = wx.getStorageSync(`cart_${this.phone}`) || [];
      let materialList = item.materialList;
      for (let i = 0; i < materialList.length; i++) {
        let material = materialList[i];
        if (material.classifyId == '6239294986987325343') continue; // 不添加赠品
        let find = false;
        for (let j = 0; j < cart.length; j++) {
          let item = cart[j];
          if (material._id == item._id) {
            item.exts.count += material.exts.count;
            find = true;
            break;
          }
        }
        if (!find) {
          cart.push(material);
        }
      }
      wx.setStorageSync(`cart_${this.phone}`, cart);
      common.osg.open('../mall/cart');
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (option) {
      this.doInit();
      common.osg.codeoption(() => {
        this.getData();
      });
      let _currentUser = wx.getStorageSync('user');
      let _currentRole = wx.getStorageSync('currentRole');
      this.currentOrgid = _currentUser.orgId;
      this.currentRole_id = _currentRole._id;
      console.log(this.currentRole_id, '----this.currentRole_id');
      // 每隔10秒刷新可用额度，防止停留在当前页面时 在其他设备上消耗额度当前页面没有及时刷新问题。同时在充值返回当前页面后，后台审核通过后，能够及时刷新可用额度。
      clearInterval(this.timer);
      this.getPartnerCredit();
      this.timer = setInterval(() => {
        this.getPartnerCredit();
      }, 10000);
    },
    // 获取信用账户可用额度
    getPartnerCredit() {
      common.osg.ajax(
        '/basic/partnerCredit/show',
        {},
        res => {
          this.payment.creditLimit = res.data.creditLimit;
          this.payment.rewardLimit = res.data.rewardLimit || 0;
          this.payment.type = res.data.type || 0;
          this.payment.availableRewardLimit = Number(
            (parseInt(this.payment.totalPrice * this.payment.type) / 100).toFixed(2)
          );
        },
        { noload: true }
      );
    },
    onPaymentClick(item) {
      this.payment.purchaseOrderId = item._id;
      this.payment.totalPrice = item.totalPrice;
      this.payment.show = true;
    },
    // 关闭(取消)支付窗口
    onPaymentClose() {
      this.payment.show = false;
      common.osg.toast('取消支付', 'none');
    },
    // 支付采购订单
    payPurchaseOrder() {
      common.osg.ajax(
        '/basic/partnerCreditItem/payPurchaseOrder',
        { purchaseOrderId: this.payment.purchaseOrderId },
        res => {
          this.payment.show = false;
          common.osg.alert('支付成功！', () => {
            this.getData();
            this.getPartnerCredit(); // 刷新可用额度
          });
        }
      );
    },
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    toast(msg, icon, duration) {
      common.osg.toast(msg, icon, duration);
    },
    //下拉加载更多
    handleScroll() {
      if (this.fpi.total == this.list.length) {
        common.osg.toast('全部数据已经加载完成', 'none', 3000);
        return;
      }

      const now = Date.now();
      if (now - this.lastLoadTime < 1000) {
        return; // 如果距离上次加载不到1秒，直接返回
      }

      this.lastLoadTime = now;
      this.reachBottom = true;
      this.fpi.page++;
      setTimeout(() => {
        this.getData();
      }, 500);
    }
  }
};
</script>
<style lang="scss" scoped>
.purchaseOrders {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.c-content {
  flex: 1;
  overflow-y: auto;
  margin-top: 0;
}
</style>
