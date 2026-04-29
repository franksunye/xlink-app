<template>
  <view class="faq" @click.capture="track">
    <view class="c-header">
      <van-search
        :value="searchValue"
        @search="doSearch"
        @clear="doSearch"
        shape="round"
        placeholder="请输入标题搜索"
        custom-class="c-p-10 c-p-v-20"
      ></van-search>
      <van-cell>
        <view slot="title">
          <view class="c-flex c-w-1">
            <view
              v-for="(item, index) in breadcrumb"
              :key="index"
              @tap="breadcrumbClick"
              :data-index="index"
              class="c-flex c-item-center"
            >
              <span :class="index != breadcrumb.length - 1 ? 'c-green' : ''">{{ item.name }}</span>
              <van-icon
                name="arrow"
                class="c-p-v-10"
                v-if="index != breadcrumb.length - 1"
              ></van-icon>
            </view>
          </view>
        </view>
      </van-cell>
    </view>
    <view class="c-content">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in breadcrumb[breadcrumb.length - 1].childrens"
          :key="index"
          is-link
          :title="item.name"
          @click="filter"
          :data-item="item"
        ></van-cell>
      </van-cell-group>
      <van-cell-group custom-class="c-m-t-15">
        <van-cell
          v-for="(item, index) in fpi.data"
          :key="index"
          :title="item.title"
          @click="doOpen"
          :data-item="item"
        >
          <van-icon slot="right-icon" name="eye-o" class="custom-icon"></van-icon>
        </van-cell>
      </van-cell-group>
      <view v-if="fpi.rows >= fpi.total" class="c-text-center c-size-14 c-p-20">没有更多结果</view>
      <van-popup
        round
        :show="faqShow"
        position="bottom"
        custom-style="height: 60%;"
        @close="doClose"
      >
        <view class="c-p-20 c-size-14">
          <view>Q：{{ faqObj.title }}</view>
          <view class="c-m-15 c-green">
            <text>最新编辑时间：{{ faqObj.updateTime }}</text>
          </view>
          <view class="c-m-t-20">A：{{ faqObj.content }}</view>
        </view>
      </van-popup>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      searchValue: '',
      fpi: {},
      options: {
        codecfg_payState: {
          codeId: 'PAYSTATE'
        }
      },
      breadcrumb: [], //,面包屑
      faqShow: false,
      faqObj: {}
    };
  },
  methods: {
    onLoad: function (param) {
      common.osg.init(this, param, app);
      common.osg.codeoption(() => {
        this.getCategory();
        this.getData();
      });
    },
    doSearch: function (e) {
      this.setData({
        searchValue: e.detail,
        'fpi.page': 1
      });
      this.getData();
    },
    /**
     * 选择分类进行筛选
     */
    filter: function (e) {
      let breadcrumb = this.breadcrumb;
      breadcrumb.push(e.currentTarget.dataset.item);
      this.setData({
        breadcrumb: breadcrumb
      });
      this.getData();
    },
    /**
     * 点击面包屑进行筛选
     */
    breadcrumbClick: function (e) {
      let breadcrumb = this.breadcrumb;
      let index = e.currentTarget.dataset.index;
      this.setData({
        breadcrumb: breadcrumb.slice(0, index + 1)
      });
      this.getData();
    },
    getCategory: function () {
      common.osg.ajax(
        'documentCategory/query',
        {
          type: 1,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.setData({
            breadcrumb: [res.entity]
          });
        }
      );
    },
    getData: function () {
      let params = {
        page: this.fpi.page || 1,
        rows: this.fpi.rows || 20,
        'is:type|integer#and': 1,
        'regex:title|string#or': this.searchValue,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      if (this.breadcrumb.length > 1)
        params['is:categoryId|string#and'] = this.breadcrumb[this.breadcrumb.length - 1]._id;
      common.osg.ajax('document/query', params, res => {
        this.setData({
          fpi: res
        });
      });
    },
    doOpen: function (e) {
      this.setData({
        faqObj: e.currentTarget.dataset.item,
        faqShow: true
      });
    },
    doClose: function () {
      this.setData({
        faqShow: false,
        faqObj: {}
      });
    },
    onReachBottom: function () {
      if (this.fpi.rows >= this.fpi.total) return;
      this.fpi.rows += 10;
      this.getData();
    },
    onPullDownRefresh: function () {
      this.getData();
    }
  }
};
</script>

<style>
.c-content {
  margin-top: 180rpx;
}

.faq .van-cell__title {
  max-width: 300px !important;
  flex: 3;
}
</style>
