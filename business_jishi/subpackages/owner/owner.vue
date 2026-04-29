<template>
  <view @click.capture="track">
    <!-- 过滤 -->
    <view class="c-header" style="z-index: 2">
      <van-search
        class="search"
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        use-action-slot
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20"
      >
        <!-- <view slot="action" class="c-flex">
            <van-icon
              custom-style="font-size: 44rpx;"
              name="filter-o"
              @click="filterSortingShow = !filterSortingShow" :data-event="{id:'BjamWlONNP'}"></van-icon>
          </view> -->
      </van-search>
    </view>

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
            <view style="margin: 15px" class="c-card" v-for="(item, k) in list[j]" :key="k">
              <view class="c-card-content">
                <view class="c-flex">
                  <text>客户名称：</text>
                  <text>{{ item.name }}</text>
                </view>
                <view class="c-flex">
                  <text>联系电话：</text>
                  <text>{{ item.phone }}</text>
                </view>
                <view class="c-flex">
                  <text>客户地址：</text>
                  <text>{{ item.address }}</text>
                </view>
              </view>
              <view
                style="justify-content: center"
                @click="doDetail(item)"
                :data-event="{ id: 'R2qNSWuzvA' }"
              >
                <text style="font-size: 12px" :data-event="{ id: 'R2qNSWuzvA' }">合同详情</text>
                <van-icon name="arrow-down" :data-event="{ id: 'R2qNSWuzvA' }" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <van-popup
      custom-style="height: 50%"
      :show="detailShow"
      position="bottom"
      closeable
      @close="detailShow = false"
    >
      <van-nav-bar title="详情" />
      <view>
        <block v-for="(item, i) in contractDetail" :key="i">
          <view class="c-card">
            <view class="c-card-content">
              <view class="cFlex">
                <text>合同编号</text>
                <text>{{ item.contractdocNum || '' }}</text>
              </view>
              <view class="cFlex">
                <text>委托方手机号</text>
                <text>{{ item.contactsPhone || '' }}</text>
              </view>
              <view class="cFlex">
                <text>签约时间</text>
                <text>{{ item.exts.signedDateExts || '' }}</text>
              </view>
              <view class="cFlex">
                <text>合同额</text>
                <text>{{ item.adjustRefundMoney || '' }}</text>
              </view>
              <view class="cFlex">
                <text>管家</text>
                <text>{{ item.serviceHousekeeper || '' }}</text>
              </view>
              <view class="cFlex">
                <text>项目经理</text>
                <text>{{ item.teamLeader || '' }}</text>
              </view>
              <blocl
                style="width: 100%; padding: 10px 0px"
                v-for="(exts, index) in item.exts.partDetails"
                :key="index"
              >
                <view class="cFlex">
                  <text>部位一</text>
                  <text>{{ exts.part || '' }}</text>
                </view>
                <view class="cFlex">
                  <text>施工量</text>
                  <text>{{ exts.maintainAreaNum || '' }}</text>
                </view>
                <view class="cFlex">
                  <text>质保年限</text>
                  <text>{{ exts.agelimit || '' }}</text>
                </view>
                <view class="cFlex">
                  <text>质保开始时间</text>
                  <text>{{ exts.warrantyStartTime || '' }}</text>
                </view>
                <view class="cFlex">
                  <text>质保结束时间</text>
                  <text>{{ exts.warrantyEndTime || '' }}</text>
                </view>
              </blocl>
              <!-- #ifdef MP-WEIXIN -->
              <van-collapse
                :border="false"
                style="width: 100%"
                :value="activeNames"
                @change="onChange"
              >
                <van-collapse-item
                  class="ttt"
                  color="#666666"
                  :border="false"
                  :name="item._id"
                  @click.native="collapseDo(item._id)"
                >
                  <!-- #endif -->
                  <!-- #ifdef APP-PLUS -->
                  <uni-collapse :value="activeNames" @change="onChange">
                    <uni-collapse-item
                      :title="item._id"
                      name="1"
                      :border="false"
                      title-border="none"
                      @click.native="collapseDo(item._id)"
                    >
                      <!-- #endif -->
                      <view style="color: #666666" slot="title">查看PDF</view>
                      <view class="pdfButtom" v-if="item.qiniuUrls">
                        <text style="color: #666666">合同PDF</text>
                        <!-- #ifdef MP-WEIXIN -->
                        <van-button
                          color="#ff6900"
                          size="small"
                          plain
                          round
                          @click="download"
                          :data-filename="item.qiniuUrls[item.qiniuUrls.length - 1]"
                          :data-event="{ id: 'FrYAipPBhB' }"
                        >
                          查看
                        </van-button>
                        <!-- #endif -->
                        <!-- #ifdef APP-PLUS -->
                        <button
                          class="c-uni-button"
                          size="small"
                          plain
                          round
                          :data-filename="item.qiniuUrls[item.qiniuUrls.length - 1]"
                          @click="download"
                          :data-event="{ id: '3B-khHYr1p' }"
                        >
                          查看
                        </button>
                        <!-- #endif -->
                      </view>
                      <block
                        v-for="(addAttachment, j) in attachmentData.addAttachmentList"
                        :key="j"
                      >
                        <view class="pdfButtom" v-if="ddAttachment.contractSupplementTreatypdf">
                          <text style="color: #666666">增项协议PDF</text>
                          <!-- #ifdef MP-WEIXIN -->
                          <van-button
                            color="#ff6900"
                            size="small"
                            plain
                            round
                            @click="download"
                            :data-filename="addAttachment.contractSupplementTreatypdf"
                            :data-event="{ id: 'WTF6atKPvB' }"
                          >
                            查看
                          </van-button>
                          <!-- #endif -->
                          <!-- #ifdef APP-PLUS -->
                          <button
                            class="c-uni-button"
                            color="#ff6900"
                            size="small"
                            plain
                            round
                            @click="download"
                            :data-filename="addAttachment.contractSupplementTreatypdf"
                            :data-event="{ id: 'fisv20FVZJ' }"
                          >
                            查看
                          </button>
                          <!-- #endif -->
                        </view>
                      </block>
                      <block
                        v-for="(deductionAttachment, j) in attachmentData.deductionAttachmentList"
                        :key="j"
                      >
                        <view
                          class="pdfButtom"
                          v-if="deductionAttachment.contractSupplementTreatypdf"
                        >
                          <text style="color: #666666">减项协议PDF</text>
                          <!-- #ifdef MP-WEIXIN -->
                          <van-button
                            color="#ff6900"
                            size="small"
                            plain
                            round
                            @click="download"
                            :data-filename="deductionAttachment.contractSupplementTreatypdf"
                            :data-event="{ id: 'ltLV978523' }"
                          >
                            查看
                          </van-button>
                          <!-- #endif -->
                          <!-- #ifdef APP-PLUS -->
                          <button
                            class="c-uni-button"
                            color="#ff6900"
                            size="small"
                            plain
                            round
                            @click="download"
                            :data-filename="deductionAttachment.contractSupplementTreatypdf"
                            :data-event="{ id: 'Nm39zX5cuY' }"
                          >
                            查看
                          </button>
                          <!-- #endif -->
                        </view>
                      </block>
                      <block v-for="(pdf, j) in attachmentData.refundDataList" :key="j">
                        <view class="pdfButtom" v-if="pdf.refundUrl">
                          <text style="color: #666666">退款说明PDF</text>
                          <!-- #ifdef MP-WEIXIN -->
                          <van-button
                            color="#ff6900"
                            size="small"
                            plain
                            round
                            @click="download"
                            :data-filename="pdf.refundUrl"
                            :data-event="{ id: 'Ssol0nud9z' }"
                          >
                            查看
                          </van-button>
                          <!-- #endif -->
                          <!-- #ifdef APP-PLUS -->
                          <button
                            class="c-uni-button"
                            color="#ff6900"
                            size="small"
                            plain
                            round
                            @click="download"
                            :data-filename="pdf.refundUrl"
                            :data-event="{ id: 'YEHfmyKF9A' }"
                          >
                            查看
                          </button>
                          <!-- #endif -->
                        </view>
                      </block>
                      <block
                        v-for="(
                          singleSupplementTreaty, j
                        ) in attachmentData.singleSupplementTreatyList"
                        :key="j"
                      >
                        <view
                          class="pdfButtom"
                          v-if="singleSupplementTreaty.singleSupplementTreatypdf"
                        >
                          <text style="color: #666666">补充协议PDF</text>
                          <!-- #ifdef MP-WEIXIN -->
                          <van-button
                            color="#ff6900"
                            size="small"
                            plain
                            round
                            @click="download"
                            :data-filename="singleSupplementTreaty.singleSupplementTreatypdf"
                            :data-event="{ id: '7fI8AOGxA1' }"
                          >
                            查看
                          </van-button>
                          <!-- #endif -->
                          <!-- #ifdef APP-PLUS -->
                          <!-- #endif -->
                        </view>
                      </block>
                      <!-- #ifdef APP-PLUS -->
                    </uni-collapse-item>
                  </uni-collapse>
                  <!-- #endif -->
                  <!-- #ifdef MP-WEIXIN -->
                </van-collapse-item>
              </van-collapse>
              <!-- #endif -->
            </view>
            <van-divider dashed />
          </view>
        </block>

        <!-- :disabled="item.status !== '201' && currentRole_id == '3025142616514869963' -->
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
      activeNames: [],
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
        cascadeCode_channel: {
          codeId: 'channel'
        }
      },

      // 省市区
      areaList: Object.assign({}, areajs.default),

      // 工单状态分类
      active: 'all', //当前激活的tab页
      functionList: [],
      rejectObj: {
        sid: '',
        workflowNodeId: '',
        show: false,
        remark: ''
      },
      tagType: {}, //标签属性
      detailShow: false, //合同详情弹窗框
      userOrgId: '', //当前登录人的orgid
      contractDetail: {},
      contractData: [],
      attachmentData: {
        addAttachmentList: [], //增项列表
        deductionAttachmentList: [], //减项列表
        refundDataList: [], //退款资料列表
        singleSupplementTreatyList: [] //补充协议列表
      },
      roleId: '' //当前登录人角色的_id
    };
  },
  methods: {
    onLoad: function (param) {
      let user = wx.getStorageSync('user');
      let currentRole = wx.getStorageSync('currentRole');
      this.roleId = currentRole._id;
      this.userOrgId = user.orgId;
      this.doInit(param);
    },
    doInit(param) {
      common.osg.init(this, param, app);

      this.getData();
      // this.getFields(() => {
      //   // this.getFunction();
      // });
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
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    onChange(event) {
      // #ifdef MP-WEIXIN
      this.activeNames = event.detail;
      // #endif
      // #ifdef APP-PLUS
      this.activeNames = event;
      // #endif
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
        roleId: this.roleId,
        'regex:name|string#or': this.searchValue,
        'in:state|integer#and': 1,
        'is:orgId|string#and': this.userOrgId,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      //
      common.osg.ajax('basic/contacts/query2.do', params, res => {
        this.fpi.pages = res.pages;

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
    getContract: function (id) {
      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        orgId: this.userOrgId,
        'regex:name|string#or': this.searchValue,
        'in:state|integer#and': 1,
        'is:contactsId|string#and': id,
        'ne:exts.contractStatus|string#and': '-2',
        // 'is:orgId|string#and': this.userOrgId,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax(
        'basic/contract/query.do',
        params,
        res => {
          this.contractData = res.data;
        },
        {
          noload: true
        }
      );
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
    // 合同详情
    doDetail(e) {
      this.detailShow = true;
      common.osg.ajax(
        'basic/contract/queryByContactsId.do',
        {
          contactsId: e._id,
          orgId: e.orgId,
          // exts.contractStatus: '10'
          'is:exts.contractStatus|string#and': '10'
        },
        res => {
          this.contractDetail = res.data;
          console.log(this.contractDetail, 'contractDetail');
          // this.getContract(this.contractDetail._id);
          // this.getExtForm(this.contractDetail._id);
        },
        {
          noload: true
        }
      );
    },
    // 查看文件
    download: function (e) {
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
    },
    /* 获取合同列表 */
    // getContracts(id) {
    //   if (this.contractTimer) {
    //     clearTimeout(this.contractTimer);
    //     this.contractTimer = null;
    //   }
    //   common.osg.ajax(
    //     'basic/contract/query.do',
    //     {
    //       _all: '1',
    //       // 'is:serviceAppointmentId|string#and': serviceAppointmentId,
    //       'is:_id|string#and': id,
    //       'is:state|integer#or': '1',
    //       'is:exts.contractStatus|string#or': '-2',
    //       sortField: 'createTime',
    //       sortOrder: 'desc'
    //     },
    //     res => {
    //       this.contractData = res.data;
    //       this.$forceUpdate();
    //     }
    //   );
    // },

    // 获取增减项列表、退款说明列表
    getExtForm(id) {
      //获取增减项列表
      common.osg.ajax(
        'basic/contract/querySupplementTreaty.do',
        { contractId: id },
        res => {
          this.attachmentData.addAttachmentList = [];
          this.attachmentData.deductionAttachmentList = [];
          if (Array.isArray(res.data)) {
            // 1减项、0增项
            res.data.forEach(item => {
              if (item.type == '1') {
                this.attachmentData.deductionAttachmentList.push(item); //增项列表
              } else {
                this.attachmentData.addAttachmentList.push(item); //减项列表
              }
            });
          }
        },
        {
          noload: true
        }
      );
      //退款说明列表
      common.osg.ajax('basic/contract/queryContractRefund.do', { contractId: id }, res => {
        this.attachmentData.refundDataList = [];
        if (Array.isArray(res.data)) {
          this.attachmentData.refundDataList = res.data;
        }
      });
      // 补充协议列表
      common.osg.ajax('basic/contract/querySingleSupplementTreaty.do', { contractId: id }, res => {
        this.attachmentData.singleSupplementTreatyList = [];
        if (Array.isArray(res.data)) {
          res.data.forEach(item => {
            this.attachmentData.singleSupplementTreatyList.push(item); //增项列表
          });
        }
      });
    },
    collapseDo(item) {
      this.getContract(item);
      this.getExtForm(item);
    }
    /**
     * 生命周期函数--监听页面显示
     */
    // onShow: function () {
    //   debugger;
    //   let _currentUser = common.osg.get('_currentUser');
    //   this.currentPhone = _currentUser.user.phone;
    //   console.log(this.currentPhone, '---this.currentPhone');
    //   this.getData();
    //   //   this.functionType = common.osg.get('functionTypeValue');
    //   //   console.log(this.functionType, '-------拿到缓存中的this.functionType');
    //   if (this.loadType == 'onLoad') {
    //     this.loadType = 'onShow';
    //     return;
    //   }

    //   this.doInit({});
    // }
  }
};
</script>
<style lang="scss" scoped>
.search::v-deep {
  background: #f9f9f9;
  > .van-search {
    background: #f9f9f9 !important;
    > .van-search__content {
      background: #ffffff;
    }
  }
}
.ttt::v-deep {
  .van-collapse-item {
    .van-collapse-item__title {
      .van-cell {
        padding: 0 5px !important;
      }
    }
  }
}
.c-flex {
  padding: 5px;
}
.cFlex {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
}
.pdfButtom {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
}
.cFlex :first-child {
  color: #666666;
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
