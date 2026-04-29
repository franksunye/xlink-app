<template>
  <view class="serviceAppointment-detail">
    <block v-if="loaded">
      <image
        class="block-view-img c-m-b-20"
        style="width: 100vw"
        mode="widthFix"
        src="https://pub.fsgo365.cn/jishi/slogan.png"
      ></image>
      <view v-if="phone" class="sa-detail">
        <view style="margin: 30px 20px 20px 20px">
          <view class="progress" v-for="(item, i) in nodes" :key="i">
            <view style="display: flex; justify-content: space-between">
              <view style="display: flex; align-items: center">
                <view v-if="item.state == 10" class="progress-icon-done">
                  <image
                    style="
                      width: 16px;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    "
                    mode="widthFix"
                    src="https://pub.fsgo365.cn/jishi/fuwuyiwancheng.png"
                  ></image>
                </view>
                <view v-else-if="item.state == 0" class="progress-icon-doing">
                  <image
                    style="
                      width: 16px;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    "
                    mode="widthFix"
                    src="https://pub.fsgo365.cn/jishi/jinxingzhong.png"
                  ></image>
                </view>
                <view v-else class="progress-icon"></view>
                <view
                  v-if="item.nodeDef.nodeType == 'placeOrder'"
                  class="progress-title"
                  :class="item.state ? 'progress-title-done' : ''"
                >
                  合同签约
                </view>
                <view
                  v-else
                  class="progress-title"
                  :class="item.state ? 'progress-title-done' : ''"
                >
                  {{ item.nodeDef.name }}
                </view>
              </view>
              <view v-if="item.state == 10" style="color: #999999; font-size: 14px">已完成</view>
              <view v-if="item.state == 0" style="color: #222222; font-size: 14px">进行中</view>
            </view>
            <view style="display: flex">
              <view v-if="item.state == 10" class="progress-line-solid"></view>
              <view v-else class="progress-line-dashed"></view>
              <!-- 派单 -->
              <view
                v-if="item.state == 10 && item.nodeDef.nodeType == 'dispatch'"
                class="progress-content-block"
              >
                <view class="progress-content-card">
                  <view class="progress-content-card-time">{{ item.createTime }}</view>
                  <view class="progress-content-card-content">已分派技术工程师</view>
                </view>
              </view>
              <!-- 接单 -->
              <view
                v-else-if="item.state == 10 && item.nodeDef.nodeType == 'accept'"
                class="progress-content-block"
              >
                <view class="progress-content-card">
                  <view class="progress-content-card-time">{{ item.createTime }}</view>
                  <view class="progress-content-card-content">派技术工程师已接单</view>
                </view>
              </view>
              <!-- 预约 -->
              <view
                v-else-if="item.state == 10 && item.nodeDef.formDefId == '8675820106849042193'"
                class="progress-content-block"
              >
                <view class="progress-content-card">
                  <view class="progress-content-card-time">{{ item.createTime }}</view>
                  <view class="progress-content-card-content">您已完成在线预约</view>
                </view>
              </view>
              <!-- 勘察 -->

              <view
                v-else-if="item.state == 10 && item.nodeDef.formDefId == '2960554871510251003'"
                class="progress-content-block"
              >
                <view class="progress-content-card">
                  <!-- <view class="progress-content-card-time">{{ item.createTime }}</view> -->
                  <view class="progress-content-card-content">
                    <view class="commitment">
                      <image
                        style="width: 12px; margin-right: 5px"
                        mode="widthFix"
                        src="https://pub.fsgo365.cn/jishi/fuwuchengnuo.png"
                      ></image>
                      <view style="font-weight: 600">服务承诺</view>
                    </view>
                    <view class="c-size-12">
                      分派技术工程师2小时内会与您取得联系，沟通确认具体上门勘察时间
                    </view>
                  </view>
                </view>

                <view class="progress-content-card" v-for="(itemSurveys, i) in surveys" :key="i">
                  <view style="display: flex; justify-content: space-between">
                    <view class="progress-content-card-time">{{ itemSurveys.createTime }}</view>
                    <!--          @click="
                        open('/subpackages/housekeeper/myHousekeeper', {
                          id: sa.exts.supervisorId
                        })
                      " -->
                    <view class="progress-content-card-housekeeper">
                      <text>管家 {{ sa.exts.supervisorName }}</text>
                      <text class="c-m-l-10" style="margin-bottom: 1px">＞</text>
                    </view>
                  </view>
                  <view class="progress-content-card-content">
                    <view class="c-flex c-flex-between c-item-center">
                      <view>技术工程师已完成上门勘察</view>
                      <view
                        v-if="itemSurveys.surveyPDFUrl"
                        class="progress-content-card-button"
                        @click="download"
                        :data-filename="itemSurveys.surveyPDFUrl"
                      >
                        勘察报告
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <!-- 下单 ——合同 -->
              <view
                v-else-if="item.state == 10 && item.nodeDef.nodeType == 'placeOrder'"
                class="progress-content-block"
              >
                <view class="progress-content-card">
                  <!-- <view class="progress-content-card-time">{{ item.createTime }}</view> -->
                  <view class="progress-content-card-content">
                    <view class="commitment">
                      <image
                        style="width: 12px; margin-right: 5px"
                        mode="widthFix"
                        src="../../static/images/commitmentIcon.png"
                      ></image>
                      <view style="font-weight: 600">服务承诺</view>
                    </view>
                    <view class="c-size-12">
                      签订闭口合同，承诺报价标准透明、工程师持证上岗、材料保证国标、质保真实可靠、无恶意增项。
                    </view>
                  </view>
                </view>

                <view
                  class="progress-content-card c-flex c-flex-between"
                  v-for="(itemContracts, i) in contracts"
                  :key="i"
                >
                  <view class="c-flex c-flex-col c-flex-between">
                    <view class="progress-content-card-time">{{ itemContracts.createTime }}</view>
                    <view>您已完成合同签约</view>
                  </view>
                  <view class="progress-content-card-content">
                    <view class="c-flex c-flex-col c-flex-between">
                      <view
                        style="margin-bottom: 10px"
                        v-if="itemContracts.qiniuUrls && itemContracts.qiniuUrls.length > 0"
                        class="progress-content-card-button"
                        @click="download"
                        :data-filename="itemContracts.qiniuUrls[contracts[0].qiniuUrls.length - 1]"
                      >
                        电子合同
                      </view>
                      <view
                        v-if="itemContracts.bjdPDFurl && itemContracts.bjdPDFurl.length > 0"
                        class="progress-content-card-button"
                        @click="download"
                        :data-filename="itemContracts.bjdPDFurl"
                      >
                        报价明细
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 服务 -->
              <view
                v-else-if="item._id && item.nodeDef.name == '服务'"
                class="progress-content-block"
              >
                <view class="progress-content-card" v-for="(itemSubflows, i) in subflows" :key="i">
                  <view style="display: flex; justify-content: space-between">
                    <view class="progress-content-card-time">{{ itemSubflows.createTime }}</view>
                    <view v-if="itemSubflows.state == 10" style="font-size: 12px">已完成</view>
                    <view v-else style="color: #999999; font-size: 12px">进行中</view>
                  </view>
                  <view
                    class="progress-content-card-content"
                    style="display: flex; justify-content: space-between"
                  >
                    <view>
                      {{ itemSubflows.title }}
                    </view>
                    <view
                      class="progress-content-card-content-view"
                      @click="getQueryNode(itemSubflows._id)"
                    >
                      查看
                    </view>
                  </view>
                  <view
                    v-if="queryNodeId == itemSubflows._id"
                    class="progress-content-card-content-queryNode"
                  >
                    <view
                      v-for="(queryNodesItem, i) in queryNodes"
                      :key="i"
                      class="progress-content-card"
                      style="margin: 15px 0"
                    >
                      <view class="c-flex c-flex-between c-m-b-20">
                        <text class="progress-content-card-time">
                          {{ queryNodesItem.createTime }}
                        </text>
                        <text>{{ queryNodesItem.state == 10 ? '已完成' : '未完成' }}</text>
                      </view>
                      <view class="progress-content-card-content">
                        <view class="c-flex c-flex-between c-item-center">
                          <view>{{ queryNodesItem.nodeDef.name }}</view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <!-- 评价 -->
              <view
                v-else-if="item._id && item.nodeDef.formDefId == '1979684403468939361'"
                class="progress-content-block"
              >
                <view class="progress-content-card">
                  <!-- <view > -->

                  <view class="progress-content-card-content" v-if="item.state == 10">
                    <view style="display: flex; justify-content: space-between">
                      <view class="progress-content-card-time">
                        {{ item.updateTime }}
                      </view>
                      <view style="font-size: 12px">已评价</view>
                    </view>
                  </view>
                  <!-- </view> -->
                  <view v-else class="progress-content-card-content">
                    <view style="display: flex; justify-content: space-between">
                      <view class="progress-content-card-time">
                        {{ item.createTime }}
                      </view>
                      <view style="color: #999999; font-size: 12px">未评价</view>
                    </view>
                  </view>
                  <view class="c-flex c-flex-between">
                    <view></view>
                    <view class="progress-content-card-button" @click="toEvaluate(item)">评价</view>
                  </view>
                </view>
              </view>

              <view v-else class="progress-content-block">
                <view class="progress-content-card">
                  <view class="progress-content-card-time">{{ item.createTime }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="c-uni-empty">
        <image src="https://pub.fsgo365.cn/empty.png"></image>
        <text>无权查看</text>
        <button
          class="c-uni-button round primary"
          hover-class="hover"
          plain
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          授权手机号查看
        </button>
      </view>
    </block>
  </view>
</template>

<script>
import classificationVue from '../../pages/classification/classification.vue';
const app = getApp();
var common = require('../../common/common.js');
var areajs = require('../../common/area.js');
export default {
  data() {
    return {
      loaded: false,
      phone: '',
      id: '',
      nodes: [],
      sa: { exts: {} },
      serviceTeamShow: false, // 服务团队是否展示
      areaList: Object.assign({}, areajs.default),
      surveys: [],
      orders: [],
      options: {
        cascadeCode_parts: { codeId: 'parts' },
        codecfg_serviceType: { codeId: 'serviceType' }
      },
      ordersBjProducts: {},
      surveysId: '', //勘察id
      contracts: [],
      subflows: [], //子流程列表数据
      queryNodes: [], //子流程数据
      queryNodeId: '' //服务流程id
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.id = params.id;
    common.osg.doLogin({}, () => {
      this.phone = wx.getStorageSync('user').phone;
      this.loaded = true;
      if (this.phone) {
        common.osg.codeoption();
        this.getServiceAppointments();
        this.getFormData();
      }
    });
  },
  onShow(params) {
    this.getServiceAppointments();
  },
  methods: {
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.phone = user.phone;
        if (this.phone) {
          common.osg.codeoption();
          this.getServiceAppointments();
        }
      });
    },
    open(path, data) {
      common.osg.open(path, data);
    },
    // 查询最新工单
    getServiceAppointments() {
      common.osg.ajax(
        'basic/serviceAppointment/query',
        {
          page: 1,
          rows: 1,
          _id: this.id
        },
        res => {
          this.sa = res.data[0] || { exts: {} };
          let defNodes = res.data[0].workflow.def.nodes;
          let runNodes = res.data[0].workflowNodeList.slice(1);
          this.nodes = [];

          for (let i = 0; i < defNodes.length; i++) {
            // 合并定义节点和运行时节点
            this.nodes.push(runNodes[i] || { nodeDef: defNodes[i] });
            console.log(this.nodes, '---this.nodes');
            // let node = this.nodes[i];
            // node.nodeDef.handleButtons = node.nodeDef.handleButtons || [];
            // node.nodeDef.userChooseRule = node.nodeDef.userChooseRule || ''; //防止undefined报错关联
            if (runNodes[i]) {
              if (defNodes[i].name == '勘察') {
                this.surveysId = defNodes[i].formDefId;
                this.getSurveys();
              }
              if (runNodes[i] && runNodes[i].nodeDef.name == '服务') {
                let parentNodeId = runNodes[i]._id;
                this.getSubflows(parentNodeId);
              }
            }
          }
          // 勘查中或已勘察时查询勘察单数量
          //   if (Number(this.sa.status) >= 202) {

          this.getOrders();
          this.getContracts();

          //   } else {
          //     this.surveys = [];
          //     this.orders = [];
          //   }
          if (res.data.length == 0) {
            common.osg.toast('您当前还没有订单！', 'none');
          }
        }
      );
    },
    getSurveys() {
      common.osg.ajax(
        `biz/extForm/query/${this.surveysId}.do`,
        { tenantId: '4670873342363649607', sid: this.sa._id },
        res => {
          this.surveys = res.data;
        }
      );
    },
    getContracts() {
      this.orders;
      common.osg.ajax(
        '/basic/contract/myContract',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:serviceAppointmentId|string#and': this.sa._id
        },
        res => {
          // for (let i = 0; i < res.data; i++) {
          //   for (let o = 0; o < this.orders; o++) {
          //     if (res.data[i].orderId == this.orders[o]._id) {
          //       debugger;
          //       res.data[i].push(this.order[o].exts.bjdPDFurl);
          //     }
          //   }
          // }
          res.data.map(item => {
            this.orders.map(oItem => {
              if (item.orderId == oItem._id) {
                item.bjdPDFurl = oItem.exts.bjdPDFurl;
              }
            });
          });
          this.contracts = res.data;
          // console.log(this.contracts, '-----this.contracts');
        }
      );
    },
    // 去支付
    toPay() {
      common.osg.ajax(
        'basic/order/query',
        {
          'is:serviceAppointmentId|string#and': this.sa._id,
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          let payData = res.data.filter(item => item.payState == 0 || item.payState == 2);
          if (payData.length == 0) {
            common.osg.alert('未查询到需要支付的订单！', 'none');
          } else if (payData.length == 1) {
            this.open('/subpackages/order/pay', {
              orderId: payData[0]._id
            });
          } else {
            this.open('/subpackages/order/orders', { serviceAppointmentId: this.sa._id });
          }
        },
        {
          noload: true
        }
      );
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    toMoKanDetail(item) {
      common.osg.open('../../subpackages/web/web', {
        url: `${common.osg.host}/fsgo/wm/h5/mokan/detail/${item.exts.moKanNum}?address=${
          this.areaList.province_list[item.area[0]] +
          this.areaList.city_list[item.area[1]] +
          this.areaList.county_list[item.area[2]] +
          item.address
        }&startDate=${item.exts.startDate || ''}&supervisorName=${
          item.exts.supervisorName || ''
        }&headmanName=${item.exts.headmanName || ''}&client=b`
      });
    },
    surveyClick(e) {
      if (this.surveys.length == 1) {
        common.osg.download(e);
      } else if (this.surveys.length > 1) {
        this.open('../../subpackages/survey/surveys', {
          sid: this.sa._id
        });
      }
    },
    getOrders() {
      common.osg.ajax(
        'basic/order/query',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:serviceAppointmentId|string#and': this.sa._id
        },
        res => {
          this.orders = res.data;
          if (this.orders.length > 0 && this.orders[0].bjProducts) {
            this.ordersBjProducts = JSON.parse(this.orders[0].bjProducts);
          } else {
            this.ordersBjProducts = '';
          }
          console.log(this.ordersBjProducts, '---this.ordersBjProducts');
        }
      );
    },
    orderClick(e) {
      if (this.orders.length == 1) {
        common.osg.download(e);
      } else if (this.orders.length > 1) {
        this.open('../../subpackages/order/orders', {
          serviceAppointmentId: this.sa._id
        });
      }
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    // 预览图片、查看文件
    download(e) {
      if (common.osg.isRepeatClick('download')) {
        return;
      }
      common.osg.download(e);
    },
    /**
     * 查询节点的子流程列表
     */
    getSubflows(parentNodeId) {
      common.osg.ajax(
        `/workflow/queryByParentWorkflowNodeId/${parentNodeId}`,
        {},
        res => {
          //被删除的子流程不在页面展示
          this.subflows = res.data.filter(subNode => subNode.state != -1);
          console.log('子流程列表');
          console.log(this.subflows);
          this.$forceUpdate();
        },
        {
          noload: true
        }
      );
    },
    getQueryNode(queryNodeId) {
      this.queryNodeId = queryNodeId;
      common.osg.ajax(
        `workflow/queryNode/${queryNodeId}`,
        {},
        res => {
          //被删除的子流程不在页面展示
          this.queryNodes = res.data;
          console.log('子流程中的流程');
          console.log(this.queryNodes);
          this.$forceUpdate();
        },
        {
          noload: true
        }
      );
    },
    toEvaluate(item) {
      debugger;
      let node = item;
      common.osg.open('/subpackages/extForm/extForm', {
        formDefId: node.nodeDef.formDefId,
        formDataId: node.formDataId,
        workflowNodeId: node._id,
        tenantId: node.tenantId,
        sid: this.sa._id
      });
    },
    getFormData() {
      common.osg.ajax(
        `biz/extForm/query/4111671741587344175.do`,
        { tenantId: '4670873342363649607', _id: '1653875091200230484' },
        res => {
          console.log('formData', res.data);
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.serviceAppointment-detail {
  background: #ffffff;
  height: 100vh;
  overflow-y: auto;
  .top-view {
    background-color: #f3f3f3;
    width: 100%;
    height: 200px;
    border-radius: 0 0 6% 6%;
    position: relative;
  }
  .progress {
    .progress-icon {
      width: 8px;
      height: 8px;
      box-sizing: border-box;
      border: 1px solid #999999;
      border-radius: 50%;
      margin-right: 8px;
      margin-left: 2px;
    }
    .progress-icon-done {
      width: 13px;
      height: 30px;
      box-sizing: border-box;
      margin-right: 10px;
      position: relative;
    }
    .progress-icon-doing {
      width: 13px;
      height: 30px;
      box-sizing: border-box;
      margin-right: 10px;
      color: #fff;
      position: relative;
    }
    .progress-title {
      color: #999999;
      font-size: 16px;
    }
    .progress-title-done {
      color: #000000;
      font-size: 16px;
      font-weight: 500;
    }
    .progress-line-solid {
      width: 1px;
      border-right: 1px solid #eeeeee;
      margin: -4px 0 -4px 6px;
    }
    .progress-line-dashed {
      width: 1px;
      border-right: 1px dashed #eeeeee;
      margin: -4px 0 -4px 6px;
    }
    .progress-content-block {
      width: 100vh;
    }
    .progress-content-card {
      border: 1px solid #eeeeee;
      border-radius: 8px;
      padding: 15px 15px 5px 15px;
      margin: 15px 0 15px 15px;
      > view {
        margin-bottom: 10px;
      }
    }
    // .progress-content-card-todo {
    //   width: 100vh;
    //   border: 0px solid #eeeeee;
    //   border-radius: 8px;
    //   padding: 15px;
    //   margin: 15px;
    // }
    .progress-content-card-time {
      color: #999999;
      font-size: 12px;
    }
    .progress-content-card-housekeeper {
      color: #ff6900;
      background-color: #f8f8f8;
      width: 100px;
      height: 20px;
      line-height: 20px;
      border-radius: 50px;
      text-align: center;
      font-size: 12px;
    }
    .progress-content-card-content {
      color: #000000;
      font-size: 14px;
      .progress-content-card-content-view {
        background-color: #f8f8f8;
        border-radius: 50px;
        width: 100px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #ff6900;
      }
    }
    .progress-content-card-content-queryNode {
      margin-top: 10px;
      // background-color: #f8f8f8;
      font-size: 12px;
    }
    .progress-content-card-button {
      font-size: 12px;
      border: 1px solid #231815;
      width: 80px;
      height: 28px;
      line-height: 28px;
      border-radius: 50px;
      text-align: center;
    }
  }
  .commitment {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .van-empty {
    height: 100vh;
  }
}
</style>
