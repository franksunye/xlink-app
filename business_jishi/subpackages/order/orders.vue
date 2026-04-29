<template>
  <view @click.capture="track">
    <view class="c-header">
      <van-search
        :value="searchValue"
        @search="doSearch"
        @clear="doSearch"
        shape="round"
        :placeholder="type == '0' ? '搜索订单编号' : '搜索订单编号/姓名/手机号'"
        custom-class="c-p-10 c-p-v-20"
      ></van-search>
    </view>
    <view class="c-content">
      <view
        class="c-card"
        v-for="(item, index) in fpi.data"
        :key="index"
        @tap="doOpen"
        :data-id="item._id"
      >
        <view class="c-card-title">
          <view
            class="c-card-tag-default"
            @click.native.stop="copy(item._id)"
            :data-event="{ id: 'Dgw6vHUH-7' }"
          >
            <text :data-event="{ id: 'Dgw6vHUH-7' }">{{ item._id || '' }}</text>
            <text class="c-size-13 c-weight-normar" :data-event="{ id: 'Dgw6vHUH-7' }">丨复制</text>
          </view>
          <view class="c-red" v-if="type == 1">
            {{ codelabel('payState', String(item.payState)) || '' }}
          </view>
        </view>
        <view class="c-card-content">
          <view class="c-card-content-item" v-if="type == 1">
            <view class="c-card-content-item-label">客户姓名：</view>
            <view>{{ item.ownerName || '' }}</view>
          </view>
          <view class="c-card-content-item" v-if="type == 1">
            <view class="c-card-content-item-label">客户手机：</view>
            <view>{{ item.ownerPhone || '' }}</view>
          </view>
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">产品总额：</view>
            <view>¥ {{ item.originPrice || '' }}</view>
          </view>
          <view class="c-card-content-item" v-if="item.otherAmount">
            <view class="c-card-content-item-label">其他费用：</view>
            <view>¥ {{ item.otherAmount }}</view>
          </view>
          <view class="c-card-content-item" v-if="item.discount != 1">
            <view class="c-card-content-item-label">折扣金额：</view>
            <view>
              ¥ -{{
                amountToFixed(item.originPrice - amountToFixed(item.originPrice * item.discount))
              }}
            </view>
          </view>
          <view class="c-card-content-item" v-if="item.preferentialAmount">
            <view class="c-card-content-item-label">优惠金额：</view>
            <view>¥ -{{ item.preferentialAmount }}</view>
          </view>
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">合计金额：</view>
            <view class="c-red">¥ {{ item.totalPrice || '' }}</view>
          </view>
          <view class="c-card-content-item">
            <view class="c-card-content-item-label" v-if="type == '0'">报价时间：</view>
            <view class="c-card-content-item-label" v-else>下单时间：</view>
            <view>{{ item.createTime || '' }}</view>
          </view>
        </view>
        <view class="c-card-footer" v-if="item.exts.bjdPDFurl">
          <van-button
            round
            @click.native.stop="copy(item.exts.bjdPDFurl)"
            :data-event="{ id: 'Ea0gPCDMmj' }"
          >
            复制报价单链接
          </van-button>
          <van-button
            type="info"
            round
            class="c-m-l-20"
            :data-filename="item.exts.bjdPDFurl"
            @click.native.stop="download"
            :data-event="{ id: '0OFqIaJDrw' }"
          >
            查看报价单
          </van-button>
        </view>
      </view>
      <view v-if="fpi.rows >= fpi.total" class="c-text-center c-size-14 c-p-20">没有更多结果</view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      type: '', // 0:报价单 1:订单
      searchValue: '',
      fpi: { page: 1, rows: 10 },
      options: {
        codecfg_payState: {
          codeId: 'PAYSTATE'
        }
      }
    };
  },
  methods: {
    onLoad(params) {
      common.osg.init(this, params, app);
      this.type = params.type;
      if (this.type == '0') {
        uni.setNavigationBarTitle({
          title: '报价单'
        });
      } else {
        uni.setNavigationBarTitle({
          title: '订单'
        });
      }
      common.osg.codeoption(() => {
        this.getData();
      });
    },
    doSearch(e) {
      this.searchValue = e.detail;
      this.getData();
    },
    getData(e) {
      common.osg.ajax(
        'basic/order/query',
        {
          page: this.fpi.page || 1,
          rows: this.fpi.rows || 10,
          'is:type|integer#and': this.type == '0' ? 0 : null,
          'regex:ownerName|string#or': this.searchValue,
          'regex:ownerPhone|string#or': this.searchValue,
          'regex:_id|string#or': this.searchValue,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.fpi = res;
        }
      );
    },
    doOpen(e) {
      common.osg.open('order', {
        id: e.currentTarget.dataset.id,
        type: this.type || 1
      });
    },
    onReachBottom() {
      if (this.fpi.rows >= this.fpi.total) return;
      this.fpi.rows += 10;
      this.getData();
    },
    onPullDownRefresh() {
      this.getData();
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    //保留两位小数的金额
    amountToFixed(money) {
      if (!money) return 0;
      let resultAmount = +(+money).toFixed(2);
      return resultAmount ? resultAmount : 0;
    },
    // 查看文件
    download(e) {
      if (common.osg.isRepeatClick('download')) {
        return;
      }
      var fileName = e.currentTarget.dataset.filename;
      var fileType = fileName.split('.')[1];
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
    }
  }
};
</script>

<style scoped>
.c-content {
  margin-top: 54px;
}
</style>
