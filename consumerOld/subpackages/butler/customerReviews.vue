<template>
  <view>
    <!-- 客户评价 -->
    <view class="custEval">
      <!-- <view class="custEvalHead itemHead col-cf5 c-size-18">客户评价</view> -->
      <view class="custEvalCont c-size-14">
        <van-tabs :active="activeTab" @change="tabChange" sticky>
          <van-tab
            :title="item.name + '(' + item.number + ')'"
            :name="item.value"
            v-for="(item, index) in tabList"
            :key="index"
          ></van-tab>
          <view class="custEvalContList">
            <scroll-view
              :scroll-top="scrollTop"
              scroll-y="true"
              style="height: 100%"
              class="scroll-Y"
              @scrolltoupper="upper"
              @scrolltolower="lower"
              @scroll="scroll"
            >
              <van-empty v-if="!custEval.data.length" description="还没有评论!" />
              <view
                id=""
                class="uni-bg-red custEvalItem"
                v-for="(item, i) in custEval.data"
                :key="i"
              >
                <view class="">
                  <view class="c-flex c-flex-between c-padul-10">
                    <view class="custEvalItemL c-size-18 c-m-r-10">
                      <van-icon
                        v-for="index of item.rate"
                        :key="index"
                        name="star"
                        color="#f7c85b"
                      />
                      <van-icon
                        v-for="index of 5 - item.rate"
                        :key="index"
                        name="star"
                        color="#ccc"
                      />
                    </view>
                    <view class="custEvalItemR fcol-cf999">
                      <!-- <text>{{ item.leakagesite }}</text> -->
                      <text>
                        {{
                          codelabel('cascade', 'repairParts', item.leakagesite, null, {
                            multiple: true
                          })
                        }}
                      </text>
                    </view>
                  </view>
                  <view class="c-padul-10">
                    <view style="margin-bottom: 15rpx">
                      {{ item.memo || '暂无评价' }}
                    </view>
                    <view class="c-flex c-flex-between" v-if="Array.isArray(item.image)">
                      <view
                        :style="'width: ' + viewWidth + 'px;' + 'height:' + viewWidth + 'px;'"
                        v-for="(imgItem, index) in item.image"
                        :key="index"
                      >
                        <image
                          class="commentImage"
                          mode="cover"
                          :src="imgItem.url"
                          @click="openImgDialog(imgItem)"
                        ></image>
                      </view>
                    </view>
                  </view>
                  <view class="c-flex c-flex-between c-padul-10">
                    <view class="custEvalItemL fcol-cf999">
                      <text>
                        {{
                          item.phone.substr(0, 3) +
                          item.phone.substr(3).replace(item.phone.substr(3, 4), '****')
                        }}
                      </text>
                    </view>
                    <view class="custEvalItemR fcol-cf999">
                      <text>{{ item.createTime }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </scroll-view>
            <view style="height: 130rpx"></view>
          </view>
        </van-tabs>
      </view>
    </view>

    <!-- 查看大图 -->
    <van-popup
      closeable
      custom-style="height:100%;background: #000;z-index: 999;width: 100%;"
      :show="imgDialog.show"
      @close="imgDialog.show = false"
    >
      <view class="c-w" style="height: 100%; display: flex; align-items: center">
        <image
          style="min-width: 100%"
          :src="imgDialog.data"
          mode="widthFix"
          @click="imgDialog.show = false"
        ></image>
      </view>
    </van-popup>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      options: {
        codecfg_score: {
          codeId: 'score'
        },
        codecfg_userTag: {
          codeId: 'userTag'
        },
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        }
      },
      custEval: {},
      activeTab: '',
      tabList: [],
      //查看大图
      imgDialog: {
        show: false,
        data: ''
      },
      viewWidth: 0, //屏幕宽度
      params: {}, //地址栏参数
      userId: ''
    };
  },
  onLoad: function (params) {
    this.doInit(params);
  },
  methods: {
    doInit(params) {
      this.viewWidth = ((wx.getSystemInfoSync().windowWidth * 0.9) / 2).toFixed(2) - 4;
      this.params = params;
      common.osg.init(this, params, app);
      this.userId = this.params.userId;
      common.osg.codeoption(() => {
        this.getCustEvalData(this.userId, true);
        this.getInitCustEvalData(this.userId, true); //初始化tabs
      });
    },
    /**
     * 查看图片
     */
    openImgDialog(imgData) {
      this.imgDialog.data = imgData.url;
      this.imgDialog.show = true;
    },
    // 获取客户评价
    getCustEvalData(userId, isIndex) {
      if (isIndex) {
        this.custEval.rows = 10;
      } else {
        this.custEval.rows = this.custEval.rows + 10;
      }
      common.osg.ajax(
        'evaluation/query.do',
        {
          supervisorId: userId,
          'in:rate|array-integer#and': this.activeTab,
          rows: this.custEval.rows
        },
        res => {
          this.custEval = res;
        }
      );
    },
    //初始化客户评价的tabs
    getInitCustEvalData(userId) {
      common.osg.ajax(
        'evaluation/query.do',
        {
          supervisorId: userId,
          _all: '1'
        },
        res => {
          this.tabList = this.options.score
            .sort((a, b) => b.value.length - a.value.length)
            .map(item => {
              item.number = 0;
              res.data.forEach(cItem => {
                if (item.value.indexOf(cItem.rate) != -1) item.number = +item.number + 1;
              });
              return item;
            });
          this.activeTab = this.activeTab || this.tabList[0].value;
        }
      );
    },
    tabChange(e) {
      this.activeTab = e.detail.name;
      this.getCustEvalData(this.userId, true);
    },
    scroll: function (e) {
      this.old.scrollTop = e.detail.scrollTop;
    },
    lower: function (e) {
      if (this.custEval.rows >= this.custEval.total) {
        common.osg.toast('没有更多数据', 'none');
        return;
      }
      this.getCustEvalData(this.userId, false);
      console.log('lower', e);
    },
    upper: function (e) {
      console.log('upper', e);
    },
    codelabel(type, option, val, opts, frontEndConfig) {
      if (type == 'select') {
        return common.osg.codelabel(option, val, opts);
      } else if (type == 'cascade') {
        if (frontEndConfig && frontEndConfig.multiple) {
          return common.osg.codelabelCascadeMultiple(option, val);
        } else {
          console.log(common.osg.formatCascade(option, val));
          return common.osg.formatCascade(option, val);
        }
      }
    }
  }
};
</script>

<style>
page {
  background: #fff;
}

image {
  max-width: 100%;
  display: inline-block;
  position: relative;
  z-index: 0;
}

.butlerDetail {
  width: 85%;
  margin: 10rpx auto 0;
  padding: 30rpx;
  background: #ffffff;
  /* height: 850rpx; */
  /* height: 74vh; */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1rpx solid #d3d3d3;
  border-radius: 8rpx;
  position: relative;
  padding-bottom: 48rpx;
}

.butlerDetailLeft {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.butlerDetailRight {
  width: 65%;
}

.rowOneScore {
  border-radius: 12px;
  background: #ffcbcf;
  padding: 2px 20rpx;
  height: 20px;
}

.rowOneScoreKey {
  border-radius: 10px 0 0 10px;
  background: #ffff;
  width: 40px;
  text-align: center;
}

.rowOneScoreNum {
  margin-left: 5px;
  color: red;
  font-weight: bold;
}

.butlerDetailIntroduce {
  color: #9b9b9b;
  font-size: 12px;
  padding-left: 30rpx;
}

.butlerDetailContact {
  width: 50px;
  font-size: 20px;
  border-radius: 10px;
  background: #e60012;
  color: #ffffff;
  text-align: center;
  padding: 2px;
  font-weight: bold;
}

.itemHead {
  /* padding: 20rpx; */
  padding: 40rpx 56rpx 40rpx 56rpx;
}

.c-padul-10 {
  padding: 10rpx 0;
}

.porjectListCont {
  margin-top: 20rpx;
}

.porjectOne {
  width: 40%;
  border-radius: 20rpx;
  position: relative;
  margin-left: 10px;
}

.porjectOneDesc {
  position: absolute;
  bottom: 0;
  background: #dbdbe1;
  width: 100%;
  padding: 10rpx 0;
  opacity: 0.6;
}

.scroll-view_H {
  white-space: nowrap;
}

.scroll-view-item_H {
  display: inline-block;
}

.custEval {
  /* margin-bottom: 130rpx; */
}

.porjectList {
  margin-bottom: 130rpx;
}

.custEvalCont {
  background: #ffffff;
}

.c-border-rad20 {
  border-radius: 20rpx;
}

.showMoreProject {
  padding: 20rpx 0;
}

.custEvalContList {
  width: 90%;
  margin: auto;
}

.custEvalItem {
  border-bottom: 1px solid #f1f1f1;
}

.fcol-cf999 {
  color: #676767;
}

.bottBtns {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #f2f2f2;
  height: 130rpx;
  z-index: 9;
  background: #ffffff;
}

.bottomBtnWrap {
  width: 35%;
  color: #ffffff;
  border-radius: 45px;
  height: 90rpx;
  font-size: 18px;
  font-weight: bold;
  line-height: 90rpx;
}

.corred {
  background: #ff3a3a;
}

.corgreen {
  background: #56ba5d;
}

.porjectOneImg {
  padding: 0 !important;
}

.toShare {
  width: 15%;
}

.toShareImgWrap {
  margin: auto;
  width: 45%;
}

/* 分享面板 */
.shareBox {
  padding: 20rpx;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}

.shareBox-wrapper {
  margin-right: 30rpx;
}

.shareBox-wrapper button::after {
  border: none;
}

.shareBox-wrapper button {
  /* height: 80rpx; */
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #07c160;
}

.commentImage {
  border-radius: 20rpx;
  width: 100%;
  height: 100%;
}
.c-h-200rpx {
  height: 200rpx;
}
.butlerDetailWrap {
  margin: 44rpx 30rpx 0 30rpx;
}
.redBgbox {
  background: red;
  height: 300rpx;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -10;
}
.butlerDetailWrap .van-cell:after {
  border-bottom: 0 !important;
}
</style>
