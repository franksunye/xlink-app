<template>
  <view class="serviceAppointment c-box" :class="openForm ? 'c-hidden c-h-50rpx' : ''">
    <!-- 摘要信息 -->
    <view class="c-abstract">
      <view class="c-flex-between">
        <text>
          <text>工单编号：</text>
          <text>{{ SAFormData.orderNum || '' }}</text>
        </text>
        <text class="c-red">
          {{ codelabel('select', 'status', SAFormData.status, opts.status) || '' }}
        </text>
      </view>
      <view>
        <text>客户姓名：</text>
        <text>{{ SAFormData.name || '' }}</text>
      </view>
      <view>
        <text>详细地址：</text>
        <text>{{ SAFormData.address || '' }}</text>
      </view>
      <view v-if="SAFormData.exts.workflowDefId">
        <text>服务类型：</text>
        <text>
          {{
            codelabel('select', 'serviceType', SAFormData.exts.workflowDefId, opts.serviceType) ||
            ''
          }}
        </text>
      </view>
      <view>
        <text>创建时间：</text>
        <text>{{ SAFormData.createTime || '' }}</text>
      </view>
    </view>
    <!-- tab标签页 -->
    <view>
      <van-tabs
        v-if="nodesShow"
        :active="activeTab.detail.name"
        swipeable
        sticky
        animated
        lazy-render="false"
        @change="tabChange"
        custom-class="c-h-1"
        :ellipsis="false"
        ref="tabs"
      >
        <!-- 渲染工作流节点 -->
        <block v-for="(node, index) in nodes" :key="index">
          <block>
            <!-- 节点 下单(订单合同) -->
            <van-tab
              v-if="node.nodeDef.nodeType == 'placeOrder'"
              :title="node.nodeDef.name"
              :name="node"
            >
              <van-tabs
                ref="placeOrder"
                @change="placeOrderTabChange"
                :active="placeOrderPage.active"
                custom-class="placeorder-tabs-card"
                wrap-class="placeorder-tabs-wrap"
              >
                <van-tab title="订单" name="order">
                  <view
                    class="c-card c-relative"
                    v-for="(item, i) in order.data"
                    :key="i"
                    @click="toOrder(item._id)"
                  >
                    <view class="c-card-title">
                      <view class="c-flex c-flex-between c-w">
                        <view>
                          <text>订单编号：{{ item._id }}</text>
                        </view>
                        <view class="c-red">
                          <text>{{ item.state == '1' ? '有效' : '无效' }}</text>
                        </view>
                      </view>
                    </view>
                    <!-- //processState 订单进展状态 0:未开工（待签约）;1:待开工;2:已开工（待完工）;3:已完工 -->
                    <view>
                      <text>
                        <text style="min-width: 100px; display: inline-block">委托方：</text>
                        <text>
                          {{ item.exts.companyName || item.exts.clientname || item.ownerName }}
                        </text>
                      </text>
                      <text class="c-red" v-if="item.type == '1'">
                        {{
                          commonEvent('codelabel', null, {
                            option: 'processState',
                            value: item.processState
                          })
                        }}
                        <text
                          v-if="
                            item.exts.isAgain &&
                            (item.processState == '0' || item.processState == '4')
                          "
                        >
                          {{ '(可编辑)' }}
                        </text>
                      </text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 100px">委托方手机：</text>
                      <text>
                        {{
                          item.exts.agentPhone ||
                          item.exts.telphone ||
                          (item.ownerPhone &&
                            String(
                              item.exts.agentPhone || item.exts.telphone || item.ownerPhone
                            ).replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')) ||
                          ''
                        }}
                      </text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 100px">产品总额：</text>
                      <text>¥ {{ item.originPrice || 0 }}</text>
                    </view>
                    <view
                      v-if="
                        amountToFixed(
                          item.originPrice - amountToFixed(item.originPrice * item.discount)
                        )
                      "
                      class="c-flex-start"
                    >
                      <text style="min-width: 100px">折扣金额：</text>
                      <text>
                        - ¥{{
                          amountToFixed(
                            item.originPrice - amountToFixed(item.originPrice * item.discount)
                          ) || 0
                        }}
                      </text>
                    </view>
                    <view v-if="item.preferentialAmount" class="c-flex-start">
                      <text style="min-width: 100px">优惠金额：</text>
                      <text>- ¥ {{ item.preferentialAmount }}</text>
                    </view>
                    <view v-if="item.exts && item.exts.couponsVal" class="c-flex-start">
                      <text style="min-width: 100px">活动优惠金额：</text>
                      <text>- ¥ {{ item.exts.couponsVal }}</text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 100px">实际金额：</text>
                      <text class="c-red">¥ {{ item.totalPrice }}</text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 100px">实付金额：</text>
                      <text class="c-red">¥ {{ item.paidAmount || 0 }}</text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 100px">下单时间：</text>
                      <text>{{ item.createTime }}</text>
                    </view>
                    <!-- <view>
                      <text v-if="item.exts.confirm == '0'">报价单状态：等待业主确认</text>
                      <text v-else-if="item.exts.confirm == '1'">报价单状态：业主已确认</text>
                    </view> -->
                    <view
                      v-if="
                        item.exts.deliveryOrderState == '1' || item.exts.deliveryOrderState == '2'
                      "
                      style="justify-content: start; margin-top: 10px"
                    >
                      <text v-if="item.exts.deliveryOrderState == '1'">
                        材料交割单状态：等待业主确认
                      </text>
                      <text v-else-if="item.exts.deliveryOrderState == '2'">
                        材料交割单状态：业主已确认
                      </text>
                      <text
                        class="c-blue c-m-l-10"
                        @click.native.stop="openDeliveryOrder(item._id)"
                      >
                        点击查看
                      </text>
                    </view>
                    <view
                      v-if="item.exts.bjdPDFurl"
                      style="justify-content: flex-end; margin-top: 10px"
                    >
                      <!-- <van-button
                        round
                        type="info"
                        size="small"
                        plain
                        v-if="item.type == '1' && item.exts.bjdPDFurl && item.exts.confirm != '1'"
                        @click.native.stop="sendQuotation(item._id)"
                      >
                        {{ item.exts.confirm == '0' ? '重新发送报价单给业主' : '发送报价单给业主' }}
                      </van-button> -->
                      <van-button
                        custom-style="margin-left:20rpx;"
                        type="default"
                        size="small"
                        round
                        plain
                        @click.native.stop="copy(item.exts.bjdPDFurl)"
                      >
                        复制报价单链接
                      </van-button>
                      <van-button
                        custom-style="margin-left:20rpx;"
                        type="default"
                        size="small"
                        icon="orders-o"
                        round
                        plain
                        :data-filename="item.exts.bjdPDFurl"
                        @click.native.stop="download"
                      >
                        查看报价单
                      </van-button>
                    </view>
                    <view
                      v-if="
                        (item.type == '1' &&
                          (item.exts.deliveryOrderState == '0' ||
                            item.exts.deliveryOrderState == '1')) ||
                        item.exts.contractType == '1' ||
                        (item.type == '0' && placeOrderBtn) ||
                        (item.type == '1' && item.processState == '0') ||
                        (item.type == 1 &&
                          (item.exts.isAgain == 1 || !item.contractId) &&
                          (item.processState == '0' || item.processState == '4') &&
                          !item.exts.confirm)
                      "
                      style="justify-content: flex-end; margin-top: 10px"
                    >
                      <van-button
                        custom-style="margin-left:20rpx;"
                        type="info"
                        size="small"
                        round
                        plain
                        v-if="
                          item.type == '1' &&
                          (item.exts.deliveryOrderState == '0' ||
                            item.exts.deliveryOrderState == '1')
                        "
                        @click.native.stop="sendDeliveryOrder(item._id)"
                      >
                        {{
                          item.exts.deliveryOrderState == '1'
                            ? '重新发送材料交割单给业主'
                            : '发送材料交割单给业主'
                        }}
                      </van-button>

                      <!-- 支付首付款与支付尾款按钮：合同类型为签署成功1的展示，其余的不展示。 -->
                      <block v-if="item.exts.contractType == '1'">
                        <van-button
                          custom-style="margin-left:20rpx;"
                          type="info"
                          size="small"
                          round
                          plain
                          @click.native.stop="paymentLimitOpen(item)"
                          v-if="
                            item.workflowNodeList[item.workflowNodeList.length - 1] &&
                            item.workflowNodeList[item.workflowNodeList.length - 1].nodeDef
                              .nodeType == 'pay' &&
                            item.payState != 1 &&
                            item.workflowNodeList[item.workflowNodeList.length - 1].state != -1
                          "
                        >
                          <!-- {{ item.payState == 2 ? '支付尾款':'支付首付款'}} -->
                          {{ item.workflowNodeList[item.workflowNodeList.length - 1].nodeDef.name }}
                        </van-button>
                      </block>

                      <van-button
                        v-if="item.type == '0' && placeOrderBtn"
                        custom-style="margin-left:20rpx;"
                        type="info"
                        size="small"
                        round
                        plain
                        @click.native.stop="turnOrder(item)"
                      >
                        转为订单
                      </van-button>

                      <!--  && item.exts.confirm == '1' 业主确认报价单后才允许签约 -->
                      <block v-if="item.type == '1' && item.processState == '0'">
                        <!-- v-if="item.exts.contractStatus < 1" -->
                        <van-button
                          custom-style="margin-left:20rpx;"
                          plain
                          type="info"
                          size="small"
                          round
                          @click.native.stop="offlineSign(item)"
                          v-if="item.exts.isAgain != 1"
                        >
                          线下签约
                        </van-button>
                        <!-- v-if="item.contractType != '5' && item.exts.contractStatus != '10'" -->
                        <van-button
                          custom-style="margin-left:20rpx;"
                          type="info"
                          size="small"
                          round
                          plain
                          @click.native.stop="sign(item)"
                          v-if="item.exts.contractType != '5' && item.exts.isAgain != 1"
                        >
                          电子签约
                        </van-button>
                      </block>
                      <van-button
                        custom-style="margin-left:20rpx;"
                        type="info"
                        size="small"
                        round
                        plain
                        v-if="
                          item.type == 1 &&
                          (item.exts.isAgain == 1 || !item.contractId) &&
                          (item.processState == '0' || item.processState == '4') &&
                          !item.exts.confirm
                        "
                        @click.native.stop="openEditOrder(1, item)"
                      >
                        编辑
                      </van-button>
                    </view>
                  </view>
                </van-tab>
                <van-tab title="合同" name="contract">
                  <view class="c-card c-relative" v-for="(item, i) in contract.data" :key="i">
                    <view class="c-card-title">
                      <view class="c-flex c-flex-between c-flex-center c-w">
                        <view class="c-flex c-flex-center">
                          <van-icon custom-class="c-card-icon" name="description"></van-icon>
                          <text>{{ item.contractdocNum }}</text>
                        </view>
                        <text class="c-red">
                          {{
                            commonEvent('codelabel', null, {
                              option: 'contractStatus',
                              value: item.exts.contractStatus
                            })
                          }}
                        </text>
                      </view>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 150px">委托方：</text>
                      <text>
                        {{ item.contactsName || item.client || '' }}
                      </text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 150px">委托方手机：</text>
                      <text>
                        {{
                          (item.contactsPhone &&
                            String(item.contactsPhone).replace(
                              /^(\d{3})\d{4}(\d{4})$/,
                              '$1****$2'
                            )) ||
                          ''
                        }}
                      </text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 150px">合同类型：</text>
                      <text>
                        {{
                          commonEvent('codelabel', null, {
                            option: 'contractType',
                            value: item.contractType
                          })
                        }}
                      </text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 150px">增减项后合同金额：</text>
                      <text>¥ {{ item.adjustRefundMoney }}</text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 150px">登记时间：</text>
                      <text>{{ item.createTime }}</text>
                    </view>
                    <view class="c-flex-start">
                      <text style="min-width: 150px">签约时间：</text>
                      <text>{{ item.signedDate || '' }}</text>
                    </view>
                    <view v-if="item.examinStatus !== undefined" class="c-flex-start">
                      <text style="min-width: 150px">审核状态：</text>
                      <text>
                        {{
                          commonEvent('codelabel', null, {
                            option: 'examinStatus',
                            value: item.examinStatus
                          })
                        }}
                      </text>
                    </view>
                    <view
                      class="c-m-t-20"
                      v-if="
                        item.state == 1 &&
                        (item.contractType == '1' ||
                          item.contractType == '7' ||
                          item.contractType == '11' ||
                          item.contractType == '21')
                      "
                    >
                      <!-- supplementTreatyStatus 合同协议状态不等于0，0：待签约  -->
                      <!-- singleSupplementTreatyStatus 补充协议状态不等于0，0：待签约  -->
                      <!-- contractRefundStatus 合同退款状态不等于0，0：退全款  -->
                      <!-- contractStatus 合同状态等于10，10：签署成功，-2：已作废 -->
                      <!-- payState 支付状态，0：未支付，1：已付清，2/3：部分支付 -->
                      <!-- contractType等于1时：必须付清或部分支付才展示 -->
                      <van-collapse
                        :value="activeNames"
                        style="width: 100%"
                        @change="contractCollapse"
                        v-if="
                          item.exts.supplementTreatyStatus !== 0 &&
                          item.exts.singleSupplementTreatyStatus !== 0 &&
                          item.exts.contractRefundStatus !== 0 &&
                          (item.exts.contractStatus == '10' || item.exts.contractStatus == '-2') &&
                          (item.contractType == '1' ? item.payState && item.payState != 0 : true)
                        "
                      >
                        <van-collapse-item title="更改合同操作" :name="item._id">
                          <view
                            style="
                              display: flex;
                              flex-wrap: wrap;
                              justify-content: space-between;
                              width: 100%;
                            "
                          >
                            <!-- proportion 是否需要付款(需要付款比例)，值：0~1 -->
                            <!-- payState 支付状态，0：未支付，1：已付清，2/3：部分支付 -->
                            <!-- 需要付款时：已付款才展示增减项；不需要付款时，付没付都展示增减项。 -->
                            <block
                              v-if="
                                item.exts.contractStatus == '10' &&
                                (item.proportion > 0 ? item.payState > 0 : true)
                              "
                            >
                              <van-button
                                round
                                plain
                                type="default"
                                size="small"
                                custom-style="margin:10rpx 0;"
                                @click="openContractExt(2, item, 'contractDeductionForm')"
                              >
                                <view class="c-flex c-flex-center">－减项</view>
                              </van-button>
                              <!-- settleMark 合同结算标记，1：已结算，2：已结算需退款 -->
                              <van-button
                                round
                                plain
                                type="default"
                                size="small"
                                custom-style="margin:10rpx 0;"
                                @click="openContractExt(1, item, 'contractAddForm')"
                                v-if="item.exts.settleMark != '1' && item.exts.settleMark != '2'"
                              >
                                <view class="c-flex c-flex-center">＋增项</view>
                              </van-button>
                            </block>
                            <!-- 需要付款时：已付款，且合同状态为签署成功10，才展示退款 -->
                            <!-- 不需要付款时：合同没有付款，合同状态为已作废-2，才展示退款 -->
                            <!-- 不需要付款时：合同已付款，合同状态为10或-2，才展示退款 -->
                            <van-button
                              v-if="
                                item.proportion
                                  ? item.payState > 0 && item.exts.contractStatus == '10'
                                  : !item.payState
                                  ? item.exts.contractStatus == '-2'
                                  : true
                              "
                              round
                              plain
                              type="default"
                              size="small"
                              @click="openContractExt(3, item, 'refundApplication')"
                            >
                              <view class="c-flex c-flex-center">
                                <van-icon name="refund-o" />
                                退款
                              </view>
                            </van-button>
                            <van-button
                              round
                              plain
                              type="default"
                              size="small"
                              custom-style="margin:10rpx 0;"
                              @click="openContractExt(4, item, 'appendix')"
                            >
                              <view class="c-flex c-flex-center">合同附件</view>
                            </van-button>
                            <!-- 合同类型不等于1，且合同状态为签署成功10才展示 -->
                            <van-button
                              v-if="item.contractType != '1' && item.exts.contractStatus == '10'"
                              round
                              plain
                              type="default"
                              size="small"
                              custom-style="margin:10rpx 0;"
                              @click="openContractExt(6, item, 'SideAgreement')"
                            >
                              <view class="c-flex c-flex-center">补充协议</view>
                            </van-button>
                          </view>
                        </van-collapse-item>
                      </van-collapse>
                    </view>
                    <view class="c-m-t-20">
                      <van-button
                        round
                        size="small"
                        @click="cancelContract(item)"
                        v-if="
                          item.state == '1' &&
                          !item.endDate &&
                          (item.exts.contractStatus == '10' ||
                            item.exts.contractStatus == '2' ||
                            item.exts.contractStatus == '-3')
                        "
                      >
                        取消合同
                      </van-button>
                      <view v-else style="width: 160rpx"></view>
                      <van-button
                        round
                        size="small"
                        @click="signAgain(item._id)"
                        v-if="item.exts.contractStatus == '-3'"
                      >
                        再次签约
                      </van-button>
                      <van-button
                        round
                        size="small"
                        @click="sendAgain(item._id)"
                        v-if="item.exts.contractStatus == '2'"
                      >
                        再次发送契约锁短信
                      </van-button>
                      <van-button
                        round
                        size="small"
                        icon="orders-o"
                        @click="download"
                        :data-filename="item.qiniuUrls[item.qiniuUrls.length - 1]"
                        v-if="
                          item.contractType != '5' &&
                          item.qiniuUrls &&
                          item.qiniuUrls[item.qiniuUrls.length - 1]
                        "
                      >
                        查看文件
                      </van-button>
                      <view v-else></view>
                    </view>
                  </view>
                </van-tab>
              </van-tabs>
            </van-tab>
            <!-- 节点 关联子流程列表 -->
            <van-tab
              v-else-if="node.nodeDef.nodeType == 'subflows'"
              :title="node.nodeDef.name"
              :name="node"
            >
              <view style="padding-bottom: 140rpx">
                <block v-for="(subflow, index1) in subflows" :key="index1">
                  <view v-if="subflow.state != '-1'" class="c-card">
                    <view class="c-card-title c-flex c-flex-between">
                      <view class="c-flex">
                        <text class="c-nowrap">{{ subflow.title }}</text>
                      </view>
                      <view class="c-red c-nowrap">
                        {{
                          subflow.workflowNodeList[subflow.workflowNodeList.length - 1].state == 10
                            ? '已完成'
                            : '待' +
                              subflow.workflowNodeList[subflow.workflowNodeList.length - 1].nodeDef
                                .name
                        }}
                      </view>
                    </view>
                    <view class="c-card-content">
                      <view>订单编号：{{ subflow.formDataId }}</view>
                      <view>添加时间：{{ subflow.createTime }}</view>
                    </view>
                    <view style="margin-top: 10px">
                      <view></view>
                      <van-button
                        @click="getSubWorkflow(subflow.defId, subflow._id)"
                        :data-subflow="subflow"
                        round
                        type="info"
                        size="small"
                      >
                        查看
                      </van-button>
                    </view>
                  </view>
                </block>
              </view>
            </van-tab>
            <!-- 节点关联多个表单 -->
            <van-tab
              v-else-if="node.nodeDef.nodeType == 'forms'"
              :title="node.nodeDef.name"
              :name="node"
            >
              <view style="padding-bottom: 140rpx">
                <view v-for="(form, index2) in formList" :key="index2" class="c-card">
                  <view class="c-card-title c-flex c-flex-between">
                    <view class="c-flex">
                      <text class="c-nowrap">{{ form.formTitle }}</text>
                    </view>
                    <view class="c-red c-nowrap">
                      <text v-if="form.state == -1" class="c-red">已删除</text>
                      <text v-else>已完成</text>
                    </view>
                  </view>
                  <view class="c-card-content">
                    <van-cell title="创建时间" :value="form.createTime" :border="false"></van-cell>
                  </view>
                  <view style="margin-top: 10px">
                    <van-button
                      v-if="form.state != -1"
                      @click="removeForm(form)"
                      round
                      size="small"
                    >
                      删除
                    </van-button>
                    <view v-else></view>
                    <van-button
                      @click="viewAddForm(form.formDefId, form.formTitle, form._id, form)"
                      round
                      type="info"
                      size="small"
                    >
                      查看
                    </van-button>
                  </view>
                </view>
              </view>
            </van-tab>
            <!-- 子流程 可重复提交类型节点 -->
            <van-tab
              v-else-if="node.nodeDef.nodeType == 'repeat'"
              :title="node.nodeDef.name"
              :name="node"
            >
              <view style="padding-bottom: 140rpx">
                <view v-for="(form, index2) in formList" :key="index2" class="c-card">
                  <view class="c-card-title c-flex c-flex-between">
                    <view class="c-flex">
                      <van-icon custom-class="c-card-icon" name="description"></van-icon>
                      <text class="c-nowrap">{{ form.formTitle }}</text>
                    </view>
                    <view class="c-red c-nowrap">
                      <text v-if="currentNode.state == 10 || form.nodeId == currentNode._id">
                        已完成
                      </text>
                      <text v-else>待填写</text>
                    </view>
                  </view>
                  <view class="c-flex c-flex-center">
                    <view class="c-card-content">
                      <van-cell
                        title="创建时间"
                        :value="form.createTime"
                        :border="false"
                      ></van-cell>
                      <van-cell
                        title="更新时间"
                        :value="form.updateTime"
                        :border="false"
                      ></van-cell>
                    </view>
                    <van-button
                      @click="
                        viewAddForm(
                          activeTab.detail.name.nodeDef.formDefId,
                          form.formTitle,
                          form._id,
                          form
                        )
                      "
                      round
                      type="info"
                      size="small"
                    >
                      查看
                    </van-button>
                  </view>
                </view>
              </view>
            </van-tab>
            <!-- 节点 关联表单 -->
            <van-tab v-else :title="node.nodeDef.name" :name="node">
              <van-cell-group :border="false" custom-class="c-tab-content">
                <block v-for="(extField, index2) in extFields" :key="index2">
                  <block v-if="showType(extField, formData)">
                    <block v-if="extField.type == 'select'">
                      <!-- 根据其他字段值展示，如“不需要上门原因” -->

                      <van-cell
                        :title="extField.nameDisp"
                        :value="
                          commonEvent('codelabel', null, {
                            option: extField.valueOption,
                            value: formData[extField.name]
                          })
                        "
                      ></van-cell>
                    </block>
                    <block v-else-if="extField.type == 'bizSelect'">
                      <van-cell
                        :title="extField.nameDisp"
                        :value="
                          commonEvent('codelabel', null, {
                            option: extField.name,
                            value: formData[extField.name]
                          })
                        "
                      ></van-cell>
                    </block>
                    <block v-else-if="extField.type == 'cascade'">
                      <van-cell
                        :title="extField.nameDisp"
                        :value="
                          codelabel(
                            'cascade',
                            extField.valueOption,
                            formData[extField.name],
                            null,
                            extField.frontEndConfig
                          )
                        "
                      ></van-cell>
                    </block>
                    <block v-else-if="extField.type == 'radio'">
                      <van-cell :title="extField.nameDisp">
                        <van-radio-group
                          :value="formData[extField.name]"
                          disabled
                          class="c-radio-group"
                        >
                          <van-radio
                            v-for="(item, i) in options[extField.valueOption]"
                            :key="i"
                            :name="item.value"
                          >
                            {{ item.name }}
                          </van-radio>
                        </van-radio-group>
                      </van-cell>
                    </block>
                    <block v-else-if="extField.type == 'checkbox'">
                      <van-cell :title="extField.nameDisp">
                        <van-checkbox-group
                          :value="formData[extField.name]"
                          disabled
                          class="c-checkbox-group"
                        >
                          <van-checkbox
                            v-for="(item, i) in options[extField.valueOption]"
                            :key="i"
                            :name="item.value"
                            shape="square"
                            label-class="c-text-left"
                          >
                            {{ item.name }}
                          </van-checkbox>
                        </van-checkbox-group>
                      </van-cell>
                    </block>
                    <block v-else-if="extField.type == 'switch'">
                      <van-cell :title="extField.nameDisp" class="c-cell-switch">
                        <van-switch
                          :checked="formData[extField.name]"
                          disabled
                          active-value="1"
                          inactive-value="0"
                          :size="extField.frontEndConfig.size || '24px'"
                        ></van-switch>
                      </van-cell>
                    </block>
                    <block v-else-if="extField.type == 'rate'">
                      <van-cell :title="extField.nameDisp">
                        <van-rate :value="formData[extField.name]" readonly></van-rate>
                      </van-cell>
                    </block>
                    <block v-else-if="extField.type == 'file'">
                      <view class="c-cell-view c-flex c-flex-between">
                        <view class="c-cell_title">{{ extField.nameDisp }}</view>
                        <view class="c-cell_value" v-if="formData[extField.name]">
                          （{{ formData[extField.name].length || 0 }} /
                          {{
                            extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                              ? extField.frontEndConfig.max
                              : '不限'
                          }}）
                        </view>
                      </view>
                      <view class="c-cell-view">
                        <view v-if="extField.frontEndConfig.fileType == 'video'" class="c-flex">
                          <video
                            v-for="(item, i) in formData[extField.name]"
                            :key="i"
                            style="
                              width: 90px;
                              height: 90px;
                              border-radius: 10px;
                              margin-right: 16px;
                            "
                            :src="item.url"
                            :data-url="item.url"
                            :show-play-btn="false"
                            :show-center-play-btn="false"
                            :show-fullscreen-btn="false"
                            @click="openVideo"
                          ></video>
                        </view>
                        <van-uploader
                          style="display: flex"
                          v-else
                          multiple
                          :accept="extField.frontEndConfig.fileType || 'image'"
                          :upload-text="
                            extField.frontEndConfig ? extField.frontEndConfig.uploadText : ''
                          "
                          disabled
                          :deletable="false"
                          :file-list="formData[extField.name]"
                          :max-count="
                            extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                              ? extField.frontEndConfig.max
                              : 20
                          "
                        />
                      </view>
                    </block>
                    <block v-else-if="extField.type == 'title'">
                      <view
                        class="c-cell-headline"
                        v-html="
                          (extField.frontEndConfig && extField.frontEndConfig.html) ||
                          extField.nameDisp
                        "
                      ></view>
                    </block>
                    <block v-else-if="extField.type == 'gap'">
                      <view class="c-cell-gap">
                        {{ (extField.frontEndConfig && extField.frontEndConfig.html) || '' }}
                      </view>
                    </block>
                    <block v-else-if="extField.type == 'area'">
                      <van-cell
                        :title="extField.nameDisp"
                        :value="
                          area.areaList.province_list[formData[extField.name][0]] +
                          area.areaList.city_list[formData[extField.name][1]] +
                          area.areaList.county_list[formData[extField.name][2]]
                        "
                      />
                    </block>
                    <block v-else-if="extField.type == 'button'">
                      <van-button
                        disabled
                        @click="commonEvent('button', null, { extField })"
                        :data-type="extField.type"
                        :data-name="extField.name"
                        :data-fec="extField.frontEndConfig"
                        :type="extField.frontEndConfig.type"
                        :color="extField.frontEndConfig.color"
                        :block="extField.frontEndConfig.type"
                        :round="extField.frontEndConfig.round"
                        :plain="extField.frontEndConfig.plain"
                      >
                        {{ extField.nameDisp }}
                      </van-button>
                    </block>
                    <block v-else-if="extField.type == 'scan'">
                      <view class="c-flex c-flex-between c-item-center c-bg-white c-cell-view">
                        <text class="c-cell_title">{{ extField.nameDisp }}</text>
                        <van-button
                          disabled
                          :plain="extField.frontEndConfig.plain"
                          :type="extField.frontEndConfig.type"
                          :color="extField.frontEndConfig.color"
                          :icon="extField.frontEndConfig.icon"
                          :size="extField.frontEndConfig.size || 'small'"
                          @click="commonEvent('scan', extField.name, extField.frontEndConfig)"
                        >
                          {{ extField.frontEndConfig.buttonName }}
                        </van-button>
                      </view>
                    </block>
                    <block v-else-if="extField.type == 'addItem'">
                      <view class="c-cell-view c-flex c-flex-between">
                        <text>{{ extField.nameDisp }}</text>
                        <van-button
                          disabled
                          @click="commonEvent('addItem', extField.name, extField.frontEndConfig)"
                          :plain="extField.frontEndConfig.plain"
                          :type="extField.frontEndConfig.type"
                          :color="extField.frontEndConfig.color"
                          :icon="extField.frontEndConfig.icon"
                          :size="extField.frontEndConfig.size || 'small'"
                        >
                          {{ extField.frontEndConfig.buttonName }}
                        </van-button>
                      </view>
                      <view class="c-cell-view" style="border-bottom: 1px solid #ebedf0">
                        <block v-for="(item, i) in formData[extField.name]" :key="i">
                          <van-tag
                            @close="tagClose(extField.name, i)"
                            type="primary"
                            round
                            size="large"
                            custom-class="c-m-10 c-opacity-5"
                          >
                            {{
                              commonEvent('codelabel', null, {
                                option: extField.valueOption,
                                value: item
                              })
                            }}
                          </van-tag>
                        </block>
                      </view>
                    </block>
                    <block v-else-if="extField.type == 'pushItem'">
                      <van-cell-group>
                        <van-field
                          disabled
                          :label="extField.nameDisp"
                          :value="formData[extField.name]"
                          center
                          clearable
                          :border="false"
                          use-button-slot
                        >
                          <van-button
                            disabled
                            slot="button"
                            :plain="extField.frontEndConfig.plain"
                            :type="extField.frontEndConfig.type"
                            :color="extField.frontEndConfig.color"
                            :icon="extField.frontEndConfig.icon"
                            :size="extField.frontEndConfig.size || 'small'"
                          >
                            {{ extField.frontEndConfig.buttonName }}
                          </van-button>
                        </van-field>
                      </van-cell-group>
                    </block>
                    <block v-else-if="extField.type == 'sort'">
                      <!-- 按类别展示 -->
                      <view v-if="extField.frontEndConfig.showName">
                        {{ extField.name }}
                      </view>
                      <van-cell-group :border="false">
                        <view
                          v-for="(item, key) in formData[extField.name]"
                          :key="key"
                          class="c-cell-view c-flex c-flex-between"
                          style="padding: 10px 25px"
                        >
                          <view>
                            {{
                              commonEvent('codelabel', null, {
                                option: extField.option,
                                value: key
                              })
                            }}
                          </view>
                          <view>
                            <text>{{ item.length }}</text>
                            <text>{{ extField.frontEndConfig.unit }}</text>
                          </view>
                        </view>
                      </van-cell-group>
                    </block>
                    <block v-else-if="extField.type == 'dialog'">
                      <view class="c-cell-view c-flex" @click="onClick" :data-extfield="extField">
                        <van-icon
                          custom-class="c-green"
                          name="checked"
                          v-if="formData[extField.name]"
                        />
                        <rich-text :nodes="extField.frontEndConfig.text"></rich-text>
                      </view>
                    </block>
                    <block v-else-if="extField.type == 'bgImage'"></block>
                    <block v-else>
                      <!-- text number idcard digit textarea phone IDNumber date time datetime evaluate-->
                      <van-cell
                        :title="extField.nameDisp"
                        :value="formData[extField.name]"
                      ></van-cell>
                    </block>
                  </block>
                </block>
              </van-cell-group>
            </van-tab>
          </block>
        </block>
        <van-tab title="动态" name="log">
          <view class="c-card" v-for="(item, index) in log.data" :key="index">
            <view class="c-card-title">
              <view class="c-flex">
                <van-icon custom-class="c-card-icon" name="todo-list-o"></van-icon>
                <text>{{ item.title }}</text>
              </view>
            </view>
            <view class="c-p-20">
              <text>{{ item.content }}</text>
            </view>
            <view class="c-p-v-20 c-flex c-flex-between">
              <view>操作人：{{ item.createUserName || '系统' }}</view>
              <view class="c-size-14">{{ item.createTime }}</view>
            </view>
          </view>
        </van-tab>
      </van-tabs>
    </view>

    <!-- 工作流底部按钮 撤回 回退 填表单 -->
    <view
      class="c-button-group-bottom"
      v-if="
        takebackShow ||
        rollbackShow ||
        fabShow ||
        activeTab.detail.name.nodeDef.nodeType == 'subflows' ||
        activeTab.detail.name.nodeDef.nodeType == 'placeOrder' ||
        activeTab.detail.name.nodeDef.nodeType == 'forms'
      "
    >
      <!-- 撤回 -->
      <view
        v-if="takebackShow"
        @click="takebackWorkflow(activeTab.detail.name._id)"
        class="c-button-group-item c-m-r-10 c-bg-gray-button"
      >
        <view>修改</view>
      </view>
      <!-- 回退 -->
      <view
        v-if="rollbackShow"
        @click="rollbackWorkflow(activeTab.detail.name._id)"
        class="c-button-group-item c-m-r-10 c-bg-gray-button"
      >
        <view>删除{{ activeTab.detail.name.nodeDef.name }}</view>
      </view>
      <!-- 编辑表单 -->
      <view
        v-if="
          activeTab.detail.name.nodeDef.nodeType != 'subflows' &&
          activeTab.detail.name.nodeDef.nodeType != 'forms' &&
          activeTab.detail.name.nodeDef.nodeType != 'placeOrder' &&
          activeTab.detail.name.nodeDef.nodeType != 'repeat'
        "
        :class="fabShow ? '' : 'c-no-pointer'"
        @click="openForm = true"
        class="c-button-group-item c-bg-blue"
      >
        <view class="c-white">填表单</view>
        <van-icon
          v-if="!fabShow"
          class="c-icon-disable"
          name="https://pub.fsgo365.cn/7527232764334981828.png"
        ></van-icon>
      </view>
      <!-- 关联多表单 新增表单 -->
      <view
        v-if="activeTab.detail.name.nodeDef.nodeType == 'forms' && addFormBtn"
        @click="addForm"
        class="c-button-group-item c-bg-blue"
      >
        <view class="c-white">新增{{ activeTab.detail.name.nodeDef.name }}</view>
      </view>
      <!-- 重复提交表单 新增表单 -->
      <view
        v-if="activeTab.detail.name.nodeDef.nodeType == 'repeat' && newFormBtn"
        @click="newForm"
        class="c-button-group-item c-bg-blue"
        :class="activeTab.detail.name.state == 10 ? 'c-no-pointer' : ''"
      >
        <view class="c-white">新增表单</view>
        <van-icon
          v-if="activeTab.detail.name.state == 10"
          class="c-icon-disable"
          name="https://pub.fsgo365.cn/7527232764334981828.png"
        ></van-icon>
      </view>
      <!-- 完成表单 -->
      <view
        v-if="activeTab.detail.name.nodeDef.nodeType == 'repeat'"
        @click="process('complate')"
        :class="activeTab.detail.name.state == 10 ? 'c-no-pointer' : ''"
        class="c-button-group-item c-m-l-10 c-bg-blue"
      >
        <view class="c-white">完成{{ activeTab.detail.name.nodeDef.name }}</view>
        <van-icon
          v-if="activeTab.detail.name.state == 10"
          class="c-icon-disable"
          name="https://pub.fsgo365.cn/7527232764334981828.png"
        ></van-icon>
      </view>
      <!-- 下单 -->
      <view
        v-if="activeTab.detail.name.nodeDef.nodeType == 'placeOrder' && placeOrderBtn"
        @click="placeOrder"
        class="c-button-group-item c-bg-blue"
      >
        <view class="c-white">下单</view>
      </view>
      <!-- 新增服务项 -->
      <view
        v-if="
          activeTab.detail.name.nodeDef.nodeType == 'subflows' &&
          activeTab.detail.name.nodeDef.addProductShow == '1'
        "
        @click="addProduct"
        :class="activeTab.detail.name.state != 10 ? '' : 'c-no-pointer'"
        class="c-button-group-item c-m-l-10 c-m-r-10 c-bg-blue"
      >
        <view class="c-white">新增服务</view>
      </view>
      <!-- 完成该节点 -->
      <view
        v-if="activeTab.detail.name.nodeDef.nodeType == 'subflows'"
        @click="process('complate')"
        :class="activeTab.detail.name.state != 10 && canIComplate ? '' : 'c-no-pointer'"
        class="c-button-group-item c-m-l-10 c-bg-blue"
      >
        <view class="c-white">完成{{ activeTab.detail.name.nodeDef.name }}</view>
        <van-icon
          v-if="activeTab.detail.name.state == 10 || !canIComplate"
          class="c-icon-disable"
          name="https://pub.fsgo365.cn/7527232764334981828.png"
        ></van-icon>
      </view>
    </view>

    <!-- 子流程节点列表弹出层 -->
    <van-popup
      :show="subWorkflow.show"
      position="bottom"
      round
      custom-style="height: 96%;background-color:#f0f3f6;"
      closeable
      close-icon-position="top-right"
      @close="closeSubWorkflow"
      :z-index="99"
    >
      <!-- 原渲染节点 -->
      <view class="c-tab-content">
        <view style="font-size: 16px; padding: 10rpx 20rpx; border-bottom: 1px solid #ebedf0">
          {{ subWorkflow.title }}
        </view>
        <block v-for="(subNode, index2) in subWorkflow.def.nodes" :key="index2">
          <!-- 子流程节点 -->
          <view class="c-card" style="margin: 20rpx 0">
            <view class="c-card-title">
              <view class="c-flex">
                <text class="c-m-r-10">{{ index2 + 1 }}</text>
                <text>{{ subNode.nodeDef.name }}</text>
              </view>
            </view>
            <view style="min-height: 60rpx; padding: 20rpx">
              <view>
                <view v-if="subNode.nodeDef.desc">描述：{{ subNode.nodeDef.desc }}</view>
                <view v-if="subNode.updateTime">修改时间：{{ subNode.updateTime }}</view>
              </view>
            </view>
            <view style="margin-top: 10px">
              <view v-if="subNode.visible">
                <van-button
                  round
                  type="default"
                  size="small"
                  v-if="subNode.state == 10 && subWorkflow.def.nodes[index2 + 1].state == 0"
                  @click="takebackWorkflow(subNode._id)"
                >
                  修改
                </van-button>
                <van-button
                  round
                  type="default"
                  size="small"
                  v-if="subNode.state == 0 && index2 != 0"
                  @click="rollbackWorkflow(subNode._id)"
                >
                  删除
                </van-button>
              </view>
              <view v-else></view>
              <view v-if="subNode.visible">
                <van-button
                  v-if="subNode.state == 0 || subNode.state == 10"
                  :type="subNode.state == '0' ? 'info' : 'default'"
                  round
                  size="small"
                  @click="viewForm(subNode, { edit: true, isQuickly: false })"
                >
                  {{
                    subNode.state == '0'
                      ? subNode.nodeDef.nodeType == 'disable'
                        ? '等待处理'
                        : '处理'
                      : '查看'
                  }}
                </van-button>
              </view>
              <view v-if="!subNode.visible && (subNode.state == 0 || subNode.state == 10)">
                <van-button
                  type="info"
                  round
                  size="small"
                  @click="viewForm(subNode, { edit: true, isQuickly: false })"
                >
                  查看
                </van-button>
              </view>
            </view>
          </view>
        </block>
      </view>
    </van-popup>

    <!-- 表单弹出层 -->
    <van-popup :show="openForm" position="bottom" round custom-style="height: 90%;">
      <view class="c-popup form-popup">
        <van-nav-bar custom-class="c-size-16" title="表单" left-text="取消" @click-left="closeForm">
          <van-button
            type="info"
            plain
            slot="right"
            @click="saveForm"
            custom-class="c-border-n"
            :disabled="disabled.saveForm"
            v-if="activeTab.detail.name == 'log' || activeTab.detail.name == 'order'"
          >
            提交
          </van-button>
          <van-button
            type="info"
            plain
            slot="right"
            @click="saveForm"
            custom-class="c-border-n"
            :disabled="disabled.saveForm"
            v-else-if="
              activeTab.detail.name.nodeDef &&
              activeTab.detail.name.nodeDef.nodeType == 'placeOrder'
            "
          >
            提交
          </van-button>
          <van-button
            type="info"
            plain
            slot="right"
            @click="saveForm"
            custom-class="c-border-n"
            :disabled="disabled.saveForm"
            v-else-if="
              currentNode &&
              workflow.state == 0 &&
              currentNode.state == 0 &&
              currentNode.nodeDef.nodeType != 'disable' &&
              currentNode.visible
            "
          >
            提交
          </van-button>
          <van-button
            type="info"
            plain
            slot="right"
            @click="saveForm"
            custom-class="c-border-n"
            :disabled="disabled.saveForm"
            v-else-if="currentNode.nodeDef.nodeType == 'forms' && currentForm.state != -1"
          >
            提交
          </van-button>
        </van-nav-bar>
        <van-cell-group class="c-popup-cells">
          <block v-for="(extField, index) in extFields" :key="index">
            <block v-if="showType(extField, formData)">
              <block v-if="extField.type == 'phone' || extField.type == 'IDNumber'">
                <van-field
                  :label="extField.nameDisp"
                  :value="formData[extField.name]"
                  @change="onChange"
                  :data-extfield="extField"
                  type="number"
                  :maxlength="extField.type == 'phone' ? 11 : -1"
                  :disabled="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? true
                      : false
                  "
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                  input-align="right"
                ></van-field>
              </block>
              <block v-else-if="extField.type == 'switch'">
                <van-cell
                  :title="extField.nameDisp"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled c-cell-switch'
                      : 'c-cell-switch'
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                >
                  <van-switch
                    :checked="formData[extField.name]"
                    @change="onChange"
                    :data-extfield="extField"
                    active-value="1"
                    inactive-value="0"
                    :size="extField.frontEndConfig.size || '24px'"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  ></van-switch>
                </van-cell>
              </block>
              <block
                v-else-if="
                  extField.type == 'date' || extField.type == 'time' || extField.type == 'datetime'
                "
              >
                <van-cell
                  :title="extField.nameDisp"
                  :value="formData[extField.name]"
                  @click="onClick"
                  :data-extfield="extField"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                  is-link
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'select'">
                <!-- 根据其他字段值展示，如“不需要上门原因” -->
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    commonEvent('codelabel', null, {
                      option: extField.name == 'workType' ? 'workTypes' : extField.valueOption,
                      value: formData[extField.name]
                    })
                  "
                  @click="onClick"
                  :data-extfield="extField"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                  is-link
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'cascade'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    codelabel(
                      'cascade',
                      extField.valueOption,
                      formData[extField.name],
                      null,
                      extField.frontEndConfig
                    )
                  "
                  @click="onClick"
                  :data-extfield="extField"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                  is-link
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'bizSelect'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    commonEvent('codelabel', null, {
                      option: extField.name,
                      value: formData[extField.name]
                    })
                  "
                  @click="onClick"
                  :data-extfield="extField"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                  is-link
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'image'">
                <view class="cell-wrapper-p14">
                  <view class="cell-item">
                    <van-cell :title="extField.nameDisp" :border="false" />
                    <view class="image-sample">
                      <view style="padding: 10rpx; flex: 1">
                        <view>
                          <image
                            v-for="(item, index) in extField.frontEndConfig.list"
                            :key="index"
                            mode="widthFix"
                            style="width: 30%; margin-right: 1%; margin-top: 1%"
                            :src="item"
                            :data-src="item"
                          ></image>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </block>
              <block v-else-if="extField.type == 'radio'">
                <van-cell
                  :title="extField.nameDisp"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                >
                  <van-radio-group
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-extfield="extField"
                    class="c-radio-group c-rt"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  >
                    <van-radio
                      v-for="(item, i) in options[extField.valueOption]"
                      :key="i"
                      :name="item.value"
                    >
                      {{ item.name }}
                    </van-radio>
                  </van-radio-group>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'checkbox'">
                <van-cell
                  :title="extField.nameDisp"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                >
                  <van-checkbox-group
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-extfield="extField"
                    class="c-checkbox-group"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  >
                    <van-checkbox
                      v-for="(item, i) in options[extField.valueOption]"
                      :key="i"
                      :name="item.value"
                      shape="square"
                      label-class="c-text-left"
                    >
                      {{ item.name }}
                    </van-checkbox>
                  </van-checkbox-group>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'rate'">
                <van-cell
                  :title="extField.nameDisp"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                >
                  <van-rate
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-extfield="extField"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  ></van-rate>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'file'">
                <view class="c-cell-view c-flex c-flex-between c-relative">
                  <view
                    :class="
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        ? 'c-disable c-cell_title'
                        : 'c-cell_title'
                    "
                  >
                    <span
                      class="c-required"
                      v-if="
                        extField.required == '1' &&
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                      "
                    >
                      *
                    </span>
                    {{ extField.nameDisp }}
                  </view>
                  <view class="c-cell_value" v-if="formData[extField.name]">
                    （{{ formData[extField.name].length || 0 }} /
                    {{ extField.frontEndConfig.max || '不限' }}）
                  </view>
                </view>
                <view class="c-cell-view">
                  <view v-if="extField.frontEndConfig.fileType == 'video'" class="c-flex">
                    <video
                      v-for="(item, i) in formData[extField.name]"
                      :key="i"
                      style="width: 90px; height: 90px; border-radius: 10px; margin-right: 16px"
                      :src="item.url"
                      :data-url="item.url"
                      :show-play-btn="false"
                      :show-center-play-btn="false"
                      :show-fullscreen-btn="false"
                      @click="openVideo"
                    ></video>
                  </view>
                  <van-uploader
                    style="display: flex"
                    v-else
                    multiple
                    :accept="extField.frontEndConfig.fileType || 'image'"
                    :upload-text="extField.frontEndConfig ? extField.frontEndConfig.uploadText : ''"
                    :file-list="formData[extField.name]"
                    @after-read="afterRead"
                    :data-extField="extField"
                    :data-field="extField.name"
                    @delete="deleteFile"
                    :max-count="
                      extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                        ? extField.frontEndConfig.max
                        : 20
                    "
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  />
                </view>
              </block>
              <block v-else-if="extField.type == 'title'">
                <view
                  class="c-cell-headline"
                  v-html="
                    (extField.frontEndConfig && extField.frontEndConfig.html) || extField.nameDisp
                  "
                ></view>
              </block>
              <block v-else-if="extField.type == 'gap'">
                <view
                  class="c-cell-gap"
                  v-html="extField.frontEndConfig && extField.frontEndConfig.html"
                ></view>
              </block>
              <block v-else-if="extField.type == 'area'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    area.areaList.province_list[formData[extField.name][0]] +
                    area.areaList.city_list[formData[extField.name][1]] +
                    area.areaList.county_list[formData[extField.name][2]]
                  "
                  @click="onClick"
                  :data-extfield="extField"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                  is-link
                />
              </block>
              <block v-else-if="extField.type == 'button'">
                <van-button
                  @click="commonEvent('button', null, { extField })"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :type="extField.frontEndConfig.type"
                  :size="extField.frontEndConfig.size || 'small'"
                  :color="extField.frontEndConfig.color"
                  :block="extField.frontEndConfig.type"
                  :round="extField.frontEndConfig.round"
                  :plain="extField.frontEndConfig.plain"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                >
                  {{ extField.nameDisp }}
                </van-button>
              </block>
              <block v-else-if="extField.type == 'scan'">
                <view class="c-flex c-flex c-flex-between c-item-center c-bg-white c-cell-view">
                  <view class="c-cell_title">
                    <text class="c-required" v-if="extField.required == '1'">*</text>
                    {{ extField.nameDisp }}
                  </view>
                  <van-button
                    :plain="extField.frontEndConfig.plain"
                    :type="extField.frontEndConfig.type"
                    :color="extField.frontEndConfig.color"
                    :icon="extField.frontEndConfig.icon"
                    :size="extField.frontEndConfig.size || 'small'"
                    @click="commonEvent('scan', extField.name, extField.frontEndConfig)"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  >
                    {{ extField.frontEndConfig.buttonName }}
                  </van-button>
                </view>
              </block>
              <block v-else-if="extField.type == 'addItem'">
                <view class="c-cell-view c-flex c-flex-between">
                  <view>
                    <text class="c-required" v-if="extField.required == '1'">*</text>
                    {{ extField.nameDisp }}
                  </view>
                  <van-button
                    @click="commonEvent('addItem', extField.name, extField.frontEndConfig)"
                    :plain="extField.frontEndConfig.plain"
                    :type="extField.frontEndConfig.type"
                    :color="extField.frontEndConfig.color"
                    :icon="extField.frontEndConfig.icon"
                    :size="extField.frontEndConfig.size || 'small'"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  >
                    {{ extField.frontEndConfig.buttonName }}
                  </van-button>
                </view>
                <view class="c-cell-view" style="border-bottom: 1px solid #ebedf0">
                  <block v-for="(item, i) in formData[extField.name]" :key="i">
                    <van-tag
                      @close="tagClose(extField.name, i)"
                      round
                      type="primary"
                      size="large"
                      custom-class="c-m-10"
                      :closeable="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                      "
                    >
                      {{
                        commonEvent('codelabel', null, {
                          option: extField.valueOption,
                          value: item
                        })
                      }}
                    </van-tag>
                  </block>
                </view>
              </block>
              <block v-else-if="extField.type == 'pushItem'">
                <van-cell-group>
                  <van-field
                    :label="extField.nameDisp"
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-extfield="extField"
                    :type="extField.type"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                    :required="extField.required == '1'"
                    center
                    clearable
                    :border="false"
                    use-button-slot
                  >
                    <van-button
                      @click="commonEvent('pushItem', extField.name, extField.frontEndConfig)"
                      slot="button"
                      :plain="extField.frontEndConfig.plain"
                      :type="extField.frontEndConfig.type"
                      :color="extField.frontEndConfig.color"
                      :icon="extField.frontEndConfig.icon"
                      :size="extField.frontEndConfig.size || 'small'"
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                    >
                      {{ extField.frontEndConfig.buttonName }}
                    </van-button>
                  </van-field>
                </van-cell-group>
              </block>
              <block v-else-if="extField.type == 'bgImage'"></block>
              <block v-else-if="extField.type == 'sort'">
                <!-- 按类别展示 -->
                <view v-if="extField.frontEndConfig.showName">{{ extField.name }}</view>
                <van-cell-group :border="false">
                  <view
                    v-for="(item, key) in formData[extField.name]"
                    :key="key"
                    class="c-cell-view c-flex c-flex-between"
                    style="padding: 10px 25px"
                  >
                    <view>
                      {{
                        commonEvent('codelabel', null, {
                          option: extField.option,
                          value: key
                        })
                      }}
                    </view>
                    <view>
                      <text>{{ item.length }}</text>
                      <text>{{ extField.frontEndConfig.unit }}</text>
                    </view>
                  </view>
                </van-cell-group>
              </block>
              <block v-else-if="extField.type == 'evaluate'">
                <van-field
                  :label="extField.nameDisp"
                  :value="formData[extField.name]"
                  @change="onChange"
                  :data-extfield="extField"
                  type="digit"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  :required="extField.required == '1'"
                  input-align="right"
                ></van-field>
              </block>
              <block v-else-if="extField.type == 'dialog'">
                <view
                  class="c-cell-view c-flex"
                  :data-extfield="extField"
                  :type="extField.type"
                  @click="onClick"
                >
                  <van-icon custom-class="c-green" name="checked" v-if="formData[extField.name]" />
                  <rich-text :nodes="extField.frontEndConfig.text"></rich-text>
                </view>
              </block>
              <block v-else>
                <!-- 原生类型 text number idcard digit textarea 自定义计算类型evaluate-->
                <van-field
                  :label="extField.nameDisp"
                  :value="formData[extField.name]"
                  @change="onChange"
                  :data-extfield="extField"
                  :type="extField.type"
                  :autosize="extField.type == 'textarea' ? true : false"
                  :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                  :class="
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      ? 'c-disabled'
                      : ''
                  "
                  :required="
                    extField.required == '1' &&
                    currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                  "
                  input-align="right"
                  :placeholder="extField.frontEndConfig.placeholder || '请输入'"
                ></van-field>
              </block>
            </block>
          </block>
        </van-cell-group>
      </view>
    </van-popup>

    <!-- 支付弹出层 -->
    <van-popup
      :show="payment.open"
      position="bottom"
      custom-style="height: 80%"
      closeable
      round
      @close="closePay"
    >
      <view class="c-flex c-flex-col c-flex-center">
        <view style="padding: 30rpx 0 30rpx">聚合收款码</view>

        <!-- 已付金额大于等于需付金额 则不展示收款码 -->
        <view
          v-if="payment.obj.paid >= payment.obj.total"
          style="width: 350rpx; height: 350rpx; text-align: center; line-height: 350rpx"
          class="c-green"
        >
          支付成功
        </view>
        <!-- 已付金额小于需付金额 展示收款码  -->
        <view v-else style="text-align: center">
          <van-loading
            size="24px"
            v-if="payment.payState != 'close' && !payment.qrval"
            class="c-m-b-30"
          >
            正在获取收款码...
          </van-loading>
          <view
            v-if="payment.payState == 'paying' && payment.qrval"
            class="c-flex c-flex-center c-red c-size-13 c-m-b-30"
            @click="getPayStatus(order.row._id, '已刷新收款码和支付金额')"
          >
            <van-icon name="replay" class="c-red c-m-r-10" />
            刷新收款码和支付金额
          </view>
          <van-tag plain v-if="payment.payState == 'close'" type="primary" class="c-m-b-30">
            当前支付已关闭
          </van-tag>

          <!-- onval:true 监听val值变化自动重新生成二维码 -->
          <canvas
            style="width: 200px; height: 200px"
            canvas-id="qrcode"
            v-show="payment.payState == 'paying' && payment.open"
          ></canvas>
          <div
            v-if="payment.payState != 'paying'"
            style="width: 200px; height: 200px; margin-top: 30rpx"
          ></div>

          <view
            v-if="payment.qrval && (payment.countDown || payment.countDown === 0)"
            class="c-flex c-flex-center c-m-t-10"
          >
            <text class="c-size-12 c-m-r-10">收款码有效期</text>
            <van-count-down :time="payment.countDown" />
          </view>
        </view>
        <view style="padding-top: 30rpx">
          <view class="c-p-10" v-if="payment.obj.msg1">{{ payment.obj.msg1 }}</view>
          <view class="c-p-10" v-if="payment.obj.msg2">{{ payment.obj.msg2 }}</view>
          <view class="c-p-10" v-if="payment.obj.msg2">{{ payment.obj.msg3 }}</view>
          <view class="c-p-10" v-if="order.row._id">订单编号：{{ order.row._id }}</view>
          <view class="c-p-10" v-if="payment.obj.payId">指令编号：{{ payment.obj.payId }}</view>
        </view>
        <view
          v-if="!(payment.obj.paid >= payment.obj.total) && payment.payState == 'paying'"
          style="
            min-width: 50vw;
            display: flex;
            justify-content: space-around;
            margin-top: 30rpx;
            font-size: 13px;
          "
        >
          <text class="c-red" @click="closePayment(order.row._id)">关闭当前支付</text>
          <view style="width: 1px; background-color: #ebedf0"></view>
          <text class="c-red" @click="payAgain(order.row)">重新发起支付</text>
        </view>
      </view>
    </van-popup>

    <!-- 选择产品 上拉菜单 -->
    <van-action-sheet
      :show="product.show"
      :actions="product.actions"
      @select="addSubWorkflow"
      @close="product.show = false"
      close-on-click-action
      description="请选择产品"
    ></van-action-sheet>

    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
    ></van-action-sheet>

    <!-- 级联选择器 -->
    <van-popup :show="cascader.show" round position="bottom">
      <van-cascader
        v-if="cascader.show"
        :value="cascader.value"
        title="请选择"
        :options="cascader.options"
        :field-names="{
          text: 'name',
          value: 'value',
          children: 'children'
        }"
        @close="cascader.show = false"
        @finish="onCascaderFinish"
      />
    </van-popup>

    <!-- 日期时间 -->
    <van-popup :show="datetime.show" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        :type="datetime.type"
        :value="datetime.value"
        @confirm="datetimeConfirm"
        @cancel="datetimeCancel"
      ></van-datetime-picker>
    </van-popup>

    <!-- 省市区 -->
    <van-popup :show="area.show" position="bottom">
      <van-area
        title="省市区"
        :area-list="area.areaList"
        @confirm="areaConfirm"
        @cancel="areaCancel"
      />
    </van-popup>

    <!-- 富文本弹出框(阅读协议) -->
    <van-dialog
      use-slot
      :title="dialog.title"
      :class="dialog.countdown ? 'countdown' : ''"
      :show="dialog.show"
      :show-cancel-button="dialog.showCancelButton && !formData[dialog.extField.name]"
      :confirm-button-text="
        dialog.confirmText + (dialog.countdown ? '（' + dialog.countdown + 's）' : '')
      "
      confirm-button-color="#1989fa"
      :cancel-button-text="dialog.cancelText"
      @confirm="dialogConfirm"
      @cancel="dialogCancel"
    >
      <view style="height: 60vh; overflow-y: auto; font-size: 14px; padding: 20rpx">
        <rich-text :nodes="dialog.content"></rich-text>
      </view>
    </van-dialog>

    <!-- 视频播放 -->
    <van-dialog use-slot :show="video.show" width="100vw" @confirm="closeVideo">
      <video
        :src="video.url"
        controls
        autoplay
        show-progress="100px"
        style="width: 100%; height: 300px"
        :show-fullscreen-btn="false"
      ></video>
    </van-dialog>

    <!-- loading 遮罩层 -->
    <van-overlay :show="loading" style="position: fixed; top: 0; left: 0; z-index: 999">
      <view class="wrapper">
        <van-loading vertical size="50px" class="c-loading">处理中...</van-loading>
      </view>
    </van-overlay>

    <!-- 单笔支付限额 -->
    <van-dialog
      use-slot
      title="请选择单笔支付限额"
      :show="paymentLimit.show"
      show-cancel-button
      @confirm="paymentLimitConfirm"
      @cancel="paymentLimitCancel"
    >
      <van-radio-group :value="paymentLimit.limit" @change="paymentLimitChange">
        <van-cell-group>
          <block v-for="(item, i) in options.paymentLimit" :key="i">
            <van-cell :title="item.name" clickable @click="paymentLimitClick(item.value)">
              <van-radio slot="right-icon" :name="item.value" />
            </van-cell>
          </block>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>

    <!-- 节点添加表单 -->
    <van-action-sheet
      :show="addForms.show"
      :actions="addForms.actions"
      cancel-text="取消"
      @cancel="addForms.show = false"
      @select="addFormsSelect"
    />

    <!-- 取消合同原因 -->
    <van-popup :show="cancellationShow" position="bottom" round custom-style="height: 70%;">
      <van-nav-bar
        custom-class="c-size-16"
        title="取消合同原因"
        left-text="取消"
        @click-left="
          cancellationShow = false;
          cancelContractData.reasonCancellation = '';
        "
      >
        <van-button
          type="info"
          plain
          slot="right"
          @click="cancelContractAjax"
          custom-class="c-border-n"
        >
          提交
        </van-button>
      </van-nav-bar>
      <van-cell-group>
        <van-field
          input-align="right"
          :value="cancelContractData.reasonCancellation"
          @change="reasonCancellationChange"
          label="取消合同原因"
          placeholder="请输入取消合同原因"
        />
      </van-cell-group>
    </van-popup>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
require('../../resources/js/binding.js');
import drawQrcode from '@/resources/js/weapp.qrcode.esm.js';

export default {
  data() {
    return {
      id: '', //工单id
      userId: '', //当前登录用户id
      roleId: '', //当前切换的角色id
      roleIds: [], //当前登录用户的所有角色id
      workflow: {},
      SAFormData: {
        contactIds: [],
        phone: '',
        exts: {}
      }, //工单表单数据
      openForm: false, //工单编辑
      nodesShow: false,
      nodes: [], //主流程运行时节点记录
      subWorkflow: {}, //子流程定义加运行记录（已完成节点记录已覆盖）
      subflows: [], //节点关联的子流程列表
      extFields: [], //表单字段
      formData: {
        exts: {}
      }, //表单数据
      options: {
        codecfg_serviceType: { codeId: 'serviceType' },
        codecfg_status: { codeId: 'STATUS' }
      }, //字典表
      opts: {
        serviceType: [],
        status: []
      },
      openForm: false, //是否弹出编辑表单

      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: '',
        type: '' //默认为空，type=addItem自定义项
      },
      // 级联选择器
      cascader: {
        show: false,
        actions: [],
        field: ''
      },
      // 时间选择器
      datetime: {
        show: false,
        type: '',
        value: new Date().getTime()
      },
      // 省市区选择
      area: {
        show: false,
        field: '',
        areaList: Object.assign({}, areajs.default)
      },
      // 增加服务项 选择产品
      product: {
        show: false,
        actions: []
      },

      abstractForm: {}, //摘要信息
      //动态
      log: {
        open: false,
        data: []
      },
      //笔记
      note: {
        open: false,
        data: [],
        content: ''
      },
      //合同
      contract: {
        data: []
      },
      //订单
      order: {
        open: false,
        data: [],
        row: {}, //订单对象数据
        active: false //判断是否转订单
      },
      payment: {
        open: false, //收款弹出层
        qrval: '', //二维码链接
        obj: {}, //返回的支付结果
        timer: null, //定时刷新收款码和支付金额
        payState: '', //标记当前操作动作，用于判断按钮展示
        countDown: null //二维码有效期倒计时
      },
      fabShow: false, //当前页面是否显示修改表单悬浮球
      takebackShow: false, //当前页面是否显示撤回悬浮球
      rollbackShow: false, //当前页面是否显示回退悬浮球
      //当前激活标签页name（特定业务对象名称或工作流运行时节点）
      activeTab: {
        detail: {
          name: ''
        }
      },
      //当前查的子流程节点
      currentNode: {
        nodeDef: {
          formFieldIdsReadOnly: []
        }
      },
      // 是否允许点击完成工作流按钮
      canIComplate: true,
      //验证手机号
      checkMobile(sMobile) {
        if (!/^1[3456789]\d{9}$/.test(sMobile)) {
          return false;
        } else {
          return true;
        }
      },
      // 校验证件号
      checkIDNumber(IDNumber) {
        if (
          /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(
            IDNumber
          )
        ) {
          return true;
        } else {
          return false;
        }
      },
      loading: false,
      disabled: {
        saveForm: false
      },
      // 弹窗(如阅读协议)
      dialog: {
        show: false,
        extField: {
          // frontEndConfig:{
          // confirmText:"同意",
          // cancelText:"不同意",
          // time:10, //至少阅读多少秒
          // must:true, //是否必须同意
          // title:"",
          // text:"",
          // content:""
        }
      },
      placeOrderBtn: true, //是否展示下单按钮
      addFormBtn: true,
      newFormBtn: true,
      placeOrderPage: {
        active: 'order'
      },
      // 工单状态关联字典表(如不需要上门原因)
      reasons: {
        show: false,
        title: '',
        status: '', //选择的工单状态
        value: '', //选择的原因
        memo: '', //其他备注
        actions: []
      },
      /**
       * 节点添加表单
       */
      addForms: {
        show: false,
        actions: []
      },
      formList: [], //节点挂的表单
      currentForm: {}, //当前查看的表单

      // 视频播放
      video: {
        show: false,
        url: ''
      },
      orderTimer: null, //订单轮询定时器
      cancellationShow: false,
      cancelContractData: {}, //取消合同数据
      contractTimer: null, //更新合同列表定时器
      activeNames: [],
      // 单笔支付限额
      paymentLimit: {
        order: {},
        show: false,
        limit: '20000'
      },
      longitude: '',
      latitude: ''
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    this.roleId = wx.getStorageSync('currentRole')._id;
    this.roleIds = wx.getStorageSync('user').roleIds;
    this.id = common.osg.param('id');
    this.userId = wx.getStorageSync('user')._id;
    this.getSAData();
    common.osg.codeoption(() => {
      this.opts.serviceType = common.osg.deepCopy(this.options.serviceType);
      this.opts.status = common.osg.deepCopy(this.options.status);
    });
    // 获取定位
    // common.osg.getLocation(location => {
    //   this.longitude = location.longitude;
    //   this.latitude = location.latitude;
    // });
  },
  onShow() {
    common.osg.init(this, {}, app);
    if (
      this.activeTab.detail.name &&
      this.activeTab.detail.name.nodeDef &&
      this.activeTab.detail.name.nodeDef.nodeType == 'placeOrder'
    ) {
      this.refreshPlaceOrder();
    }
  },
  methods: {
    //调用vant组件内部的onTap事件
    vantTabsOntap(index) {
      this.$nextTick(() => {
        this.$refs.tabs.onTap({ currentTarget: { dataset: { index: index } }, data: {} });
        this.$refs.tabs.resize();
      });
    },
    /**
     * 获取工单信息、主流程记录
     */
    getSAData(callback) {
      common.osg.ajax(
        'basic/serviceAppointment/queryById/' + this.id,
        { type: 'query' },
        res => {
          // 赋值摘要信息和工单状态
          this.SAFormData = res.data.serviceAppointment;
          this.SAFormData.exts = this.SAFormData.exts || {};
          // 赋值工作流
          this.workflow = res.data.workflow;
          // 赋值节点
          this.nodesShow = false;
          let nodes = [];
          for (let i = 0; i < res.data.workflowNode.length; i++) {
            let node = res.data.workflowNode[i];
            // 不展示：第一个虚拟节点、已删除的节点、分单派单接单节点
            if (
              node.nodeId == '0' ||
              node.state == -1 ||
              node.nodeDef.nodeType == 'accept' ||
              node.nodeDef.nodeType == 'allot' ||
              node.nodeDef.nodeType == 'dispatch' ||
              node.nodeDef.nodeTypeOld == 'accept' ||
              node.nodeDef.nodeTypeOld == 'allot' ||
              node.nodeDef.nodeTypeOld == 'dispatch'
            ) {
              continue;
            }
            // 建单节点都允许查看
            if (i == 1) {
              nodes.push(node);
              continue;
            }
            // 展示有查看权限的主节点（处理人id有当前角色id 或 待处理人id是当前登录人id）
            for (let defRoleId of node.nodeDef.userChoose) {
              if (this.roleIds.indexOf(defRoleId) != -1) {
                node.visible = true;
                break;
              }
            }
            if (node.handlerIds && node.handlerIds.indexOf(this.userId) != -1) {
              node.visible = true;
            }
            if (node.visible) nodes.push(node);
          }
          this.nodes = nodes;
          this.nodesShow = true;
          // 自动跳转最新节点标签页
          this.vantTabsOntap(this.nodes.length - 1);
          // 节点不切换时vantTabsOntap无效，需调用tabChange触发页面视图更新
          if (callback) callback();
          // 当只有1个节点时，vantTabsOntap方法无法刷新tab-content内视图，需要调用tabChange触发
          if (this.nodes.length == 1) {
            this.tabChange({
              detail: {
                name: this.nodes[this.nodes.length - 1]
              }
            });
          }
        },
        {
          noload: true
        }
      );
    },
    /**
     * 标签栏切换
     */
    tabChange(e) {
      //保存当前激活标签页
      this.activeTab = e;
      let node = e.detail.name;
      console.log('当前tab节点');
      console.log(node);
      this.fabShow = false;
      this.takebackShow = false;
      this.rollbackShow = false;
      if (node == 'log') {
        this.getLog();
      } else {
        //以下情况是主流程节点

        //保存当前节点
        this.currentNode = node;

        // 编辑表单悬浮球 条件:处理人有我 && 节点未处理 && 非子工作流和工作流列表
        if (
          node.handlerIds &&
          node.handlerIds.indexOf(this.userId) != -1 &&
          node.state == 0 &&
          node.nodeDef.nodeType != 'subflow' &&
          node.nodeDef.nodeType != 'subflows' &&
          node.nodeDef.nodeType != 'forms' &&
          node.nodeDef.nodeType != 'placeOrder'
        ) {
          this.fabShow = true;
        }
        // 撤回、回退悬浮球 条件:处理人有我
        if (node.handlerIds && node.handlerIds.indexOf(this.userId) != -1) {
          if (node.nodeDef.rollbackShow != '2') {
            //1:允许回退 2:不允许回退
            //当前节点未完成,才可以回退
            if (node.state == 0 && node.nodeDef.nodeType != 'placeOrder') {
              this.rollbackShow = true;
            }
          }

          let nodes = this.nodes;

          if (node.nodeDef.takebackShow != '2') {
            //1:允许撤回 2:不允许撤回
            //当前节点已完成,下一节点未完成,才可以撤回
            for (let i = 0; i < nodes.length - 1; i++) {
              if (node._id == nodes[i]._id) {
                if (node.state == 10 && nodes[i + 1].state == 0) {
                  this.takebackShow = true;
                  break;
                }
              }
            }
          }
        }

        //节点关联子流程列表
        if (node.nodeDef.nodeType == 'subflows') {
          console.log('关联子流程列表的节点');
          console.log(node);
          this.getSubflows(node._id);
          // 根据其他节点预存的子流程id来动态生成子流程
          if (node.nodeDef.workflowDefIds && node.nodeDef.workflowDefIds.length > 0) {
            this.addSubWorkflow(null, node.nodeDef.workflowDefIds[0]);
          }
        } else {
          // 主流程节点关联的表单
          this.extFields = []; //清除上一标签页的字段展示
          this.formData = {}; //清除上一标签页的字段数据展示
          this.viewForm(node, {
            edit: false
          });

          // 判断是否展示下单按钮
          if (node.nodeDef.nodeType == 'placeOrder') {
            let hideNodeId = node.nodeDef.hideNodeId;
            if (hideNodeId) {
              for (let node of this.nodes) {
                if (node.nodeDef.nodeId == hideNodeId) {
                  if (node.state == 10) {
                    this.placeOrderBtn = false;
                  }
                  break;
                }
              }
            }
            // 获取订单列表、合同列表
            this.refreshPlaceOrder();
            this.$refs.placeOrder[0].resize();
          }

          // 判断是否展示新增表单按钮
          if (node.nodeDef.nodeType == 'forms') {
            let hideNodeId = node.nodeDef.hideNodeId;
            if (hideNodeId) {
              for (let node of this.nodes) {
                if (node.nodeDef.nodeId == hideNodeId) {
                  if (node.state == 10) {
                    this.addFormBtn = false;
                  }
                  break;
                }
              }
            }
          }

          // 获取多个表单
          if (node.nodeDef.nodeType == 'forms') {
            this.getForms();
          }

          // 关联重复提交表单
          if (node.nodeDef.nodeType == 'repeat') {
            this.getFormList();
          }
        }
      }
    },
    /**
     * 新增服务项 选择产品
     */
    addProduct() {
      common.osg.ajax(
        'basic/product/query',
        {
          page: 1,
          rows: 100,
          'is:productType|string#and': '2'
        },
        res => {
          res.data.map(item => {
            item.label = item.name;
            item.value = item._id;
          });
          this.product.actions = res.data;
          this.product.show = true;
        }
      );
    },
    /**
     * 新增服务项(添加子流程到当前节点)
     */
    addSubWorkflow(e, workflowDefId) {
      let currentNode = this.activeTab.detail.name;
      if (workflowDefId) {
        var workflowDefId = workflowDefId;
      } else {
        var workflowDefId = e.detail.workflowDefId;
      }
      common.osg.ajax(
        'workflow/startSubWorkflow',
        {
          workflowDefId: workflowDefId, //产品关联的工作流定义id
          parentFlowNodeId: currentNode._id, //当前节点运行时id
          formDataId: '' //添加工作流的关联表单数据id
        },
        res => {
          //动态生成的子流程 去掉父节点该子流程id
          if (workflowDefId) {
            if (this.activeTab.detail.name.nodeDef.workflowDefIds.length > 0) {
              this.activeTab.detail.name.nodeDef.workflowDefIds.splice(0, 1);
            }
          }
          this.tabChange(this.activeTab);
        },
        {
          noload: true
        }
      );
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
          if (this.subflows.length > 0) {
            for (var subflow of this.subflows) {
              this.canIComplate = true;
              if (subflow.state == 0) {
                this.canIComplate = false;
                return;
              }
            }
          } else {
            this.canIComplate = false;
          }
          this.$forceUpdate();
        },
        {
          noload: true
        }
      );
    },
    /**
     * 关闭子流程弹出层
     */
    closeSubWorkflow() {
      this.subWorkflow.show = false;
      common.osg.ajax(
        'basic/serviceAppointment/queryById/' + this.id,
        { type: 'query' },
        res => {
          this.SAFormData.status = res.data.serviceAppointment.status;
        },
        {
          noload: true
        }
      );
      this.tabChange(this.activeTab);
    },
    /**
     * 查询工作流定义并覆盖运行时工作流节点
     */
    getSubWorkflow(defId, runId) {
      common.osg.ajax(
        'workflowDef/queryById/' + defId,
        null,
        res => {
          let subWorkflow = res.entity;
          let defNodes = subWorkflow.def.nodes;
          //查询工作流运行时节点记录
          common.osg.ajax(
            'workflow/queryNode/' + runId,
            null,
            res => {
              //将运行时节点记录覆盖工作流定义节点（为了同时展示已执行的节点数据和未进行的节点表单）
              let runNodes = res.data.filter(item => {
                return item.state != -1;
              });
              for (let i = 0; i < runNodes.length; i++) {
                defNodes[i] = runNodes[i];
              }
              for (let i = 0; i < defNodes.length; i++) {
                if (!defNodes[i].nodeDef) {
                  defNodes[i] = {
                    nodeDef: defNodes[i]
                  };
                }
              }
              subWorkflow.show = true;
              subWorkflow.defId = defId;
              subWorkflow.runId = runId;

              // 操作权限
              for (let node of subWorkflow.def.nodes) {
                for (let defRoleId of node.nodeDef.userChoose) {
                  if (this.roleIds.indexOf(defRoleId) != -1) {
                    node.visible = true;
                    break;
                  }
                }
              }

              this.subWorkflow = subWorkflow;
              this.$forceUpdate();
              console.log('子流程定义节点+运行时节点');
              console.log(subWorkflow);
            },
            {
              noload: true
            }
          );
        },
        {
          noload: true
        }
      );
    },
    /**
     * 查看运行时节点表单
     * 	edit:true 点击按钮如查看子流程表单 需要弹出表单编辑框
     *  edit:false 点击标签栏查看页面数据 不需要弹出表单编辑框
     */
    viewForm(node, options, formDataItemId) {
      //options   edit用来判断是否编辑
      // if (edit) {
      // 	//子流程节点 保存当前子流程节点 保存表单时需要用到
      // 	this.currentNode = node;
      // 	console.log("当前查看的子流程运行时节点");
      // 	console.log(this.currentNode);
      // }
      //子流程节点 保存当前子流程节点 保存表单时需要用到
      this.currentNode = node;
      console.log('当前查看的子流程运行时节点');
      console.log(this.currentNode);

      //获取表单字段 传运行节点关联表单id 如果已关联表单数据id获取表单数据
      if (node.nodeDef.formDefId) {
        //防止未关联表单的节点 反而获取了所有字段
        this.getFields(node.nodeDef.formDefId, () => {
          if ((formDataItemId || node.formDataId) && formDataItemId != 'addFormData') {
            //formDataItemId 查询子流程节点-子记录表单 ;   addFormData重复提交子流程节点记录 不获取formData
            this.getFormData(
              node.nodeDef.formDefId,
              formDataItemId || node.formDataId,
              options.edit
            );
          } else {
            this.formData = {
              exts: {}
            };
            if (options.edit) this.openForm = true;
          }
        });
      }
    },
    /**
     * 获取表单字段
     */
    getFields(formDefId, callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          extId: formDefId,
          sortField: 'order',
          sortOrder: 'asc',
          'i:state|integer#and': 1,
          _all: '1'
        },
        res => {
          //公式脚本id
          let scriptIds = [];
          res.data = res.data.filter(item => {
            return (
              item.showList && item.showList.indexOf('4') != -1 && !item.frontEndConfig.mpDetailHide
            );
          });
          for (var extField of res.data) {
            //解析frontEndConfig字段配置
            if (extField.frontEndConfig && common.osg.isJson(extField.frontEndConfig)) {
              extField.frontEndConfig = JSON.parse(extField.frontEndConfig);
            } else {
              extField.frontEndConfig = {};
            }

            //特殊类型字段默认值
            if (
              extField.type == 'file' ||
              extField.type == 'area' ||
              extField.type == 'scan' ||
              extField.type == 'addItem' ||
              extField.type == 'bizSelect'
            ) {
              this.formData[extField.name] = [];
            }
            if (extField.type == 'sort') {
              this.formData[extField.name] = {};
              extField.option = extField.frontEndConfig.options;
              this.options['codecfg_' + extField.frontEndConfig.options] = {
                codeId: extField.frontEndConfig.options
              };
            }
            if (extField.type == 'pushItem') {
              this.formData[extField.frontEndConfig.to] = [];
            }

            //关联字典表codeType放到options,之后从字典表查询
            if (extField.valueOption) {
              if (extField.type == 'cascade') {
                this.options['cascadeCode_' + extField.valueOption] = {
                  codeId: extField.valueOption
                };
              } else {
                this.options['codecfg_' + extField.valueOption] = {
                  codeId: extField.valueOption
                };
              }
            }
            //获取公式脚本id
            if (extField.type == 'evaluate') {
              scriptIds.push(extField.frontEndConfig);
            }
          }
          common.osg.codeoption(() => {
            this.extFields = res.data;
            if (callback) callback();
          });
          //批量查询公式脚本 并保存到options
          if (scriptIds.length > 0) {
            common.osg.ajax(
              'groovyScript/query',
              {
                page: 1,
                rows: scriptIds.length,
                'in:_id|array#and': scriptIds.join()
              },
              res => {
                let script = {};
                res.data.map(item => {
                  if (item.scriptContent && common.osg.isJson(item.scriptContent)) {
                    script[item._id] = JSON.parse(item.scriptContent);
                  }
                });
                this.options.script = script;
              },
              {
                noload: true
              }
            );
          }
        },
        {
          noload: true
        }
      );
    },
    /**
     * 获取表单数据
     * edit:true 点击按钮如查看子流程表单 需要弹出表单编辑框
     * edit:false 点击标签栏查看页面数据 不需要弹出表单编辑框
     **/
    getFormData(formDefId, formDataId, edit) {
      common.osg.ajax(
        'biz/extForm/query/' + formDefId,
        {
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:_id|string#and': formDataId
        },
        res => {
          // 将扩展字段拿出来供列表返显
          let formData = res.data[0];
          formData.exts = formData.exts || {};
          for (let key in formData.exts) {
            formData[key] = formData.exts[key];
          }

          // 将文件类型字段值拼七牛云压缩参数，获取压缩后的图片。
          for (let extField of this.extFields) {
            if (extField.type == 'file') {
              if (formData[extField.name] && Array.isArray(formData[extField.name])) {
                for (let obj of formData[extField.name]) {
                  if (obj.url && obj.url.startsWith('blob:')) {
                    obj.url = obj.url.substring(5);
                  }
                  if (obj.url && obj.url.indexOf('?') == -1) {
                    let videoTypes = ['avi', 'baimov', 'rmvb', 'rm', 'flv', 'mp4', '3gp', 'mov'];
                    let arr = obj.url.split('.') || [];
                    let suffix =
                      (arr[arr.length - 1] && arr[arr.length - 1].toLocaleLowerCase()) || '';
                    if (videoTypes.indexOf(suffix) == -1) {
                      obj.url += '?imageView2/0/h/300';
                    }
                  }
                }
              }
            }
          }

          // 如果街道字段有值且为数字时，查询街道数组后返显
          if (formData.subdistrict && formData.subdistrict == parseInt(formData.subdistrict)) {
            common.osg.getSubdistricts(this.SAFormData.area, res => {
              this.$set(this.options, 'subdistricts', res);
              this.$forceUpdate();
            });
          }

          this.formData = formData;
          if (edit) this.openForm = true;
        },
        {
          noload: true
        }
      );
    },
    /**
     * 保存表单
     */
    saveForm() {
      if (common.osg.isRepeatClick('saveForm')) {
        return; //判断是否重复点击
      } else {
        this.disabled.saveForm = true; //禁用提交表单按钮 非重复点击
      }

      //检测是否必填
      for (var extField of this.extFields) {
        if (extField.type == 'switch' && !this.formData[extField.name]) {
          this.formData[extField.name] = '0';
        }
        if (
          extField.required == '1' &&
          !this.formData[extField.name] &&
          this.formData[extField.name] !== 0 &&
          this.currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1 &&
          this.activeTab.detail.name.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
        ) {
          if (extField.frontEndConfig.showField) {
            //如果根据其他字段值展示 不展示则不需要必填
            if (
              extField.frontEndConfig.showValue == 'exist'
                ? this.formData[extField.frontEndConfig.showField]
                : this.formData[extField.frontEndConfig.showField] ==
                  extField.frontEndConfig.showValue
            ) {
              if (extField.type == 'dialog') {
                common.osg.alert(extField.nameDisp);
                this.disabled.saveForm = false; //取消禁用提交表单按钮
                return;
              } else {
                common.osg.alert(extField.nameDisp + '为必填项');
                this.disabled.saveForm = false; //取消禁用提交表单按钮
                return;
              }
            }
          } else {
            if (extField.type == 'dialog') {
              common.osg.alert(extField.nameDisp);
              this.disabled.saveForm = false; //取消禁用提交表单按钮
              return;
            } else {
              common.osg.alert(extField.nameDisp + '为必填项');
              this.disabled.saveForm = false; //取消禁用提交表单按钮
              return;
            }
          }
        }

        if (extField.type == 'phone' && this.formData[extField.name]) {
          if (!this.checkMobile(this.formData[extField.name])) {
            common.osg.toast(extField.nameDisp + '格式错误', 'none');
            this.disabled.saveForm = false; //取消禁用提交表单按钮
            return;
          }
        } else if (extField.type == 'IDNumber' && this.formData[extField.name]) {
          if (!this.checkIDNumber(this.formData[extField.name])) {
            common.osg.toast(extField.nameDisp + '格式错误', 'none');
            this.disabled.saveForm = false; //取消禁用提交表单按钮
            return;
          }
        }

        // 取消七牛云压缩参数
        if (extField.type == 'file') {
          this.formData[extField.name] = this.formData[extField.name] || [];
          if (this.formData[extField.name]) {
            for (let obj of this.formData[extField.name]) {
              if (obj.url && obj.url.startsWith('blob:')) {
                obj.url = obj.url.substring(5);
              }
              console.log(obj.url);
              if (obj.url && obj.url.indexOf('?') != -1) {
                obj.url = obj.url.substring(0, obj.url && obj.url.indexOf('?'));
              }
            }
          }
        }
      }
      //如果当前点击的是报价单转订单，那么调保存订单
      if (this.order.active) {
        let workflowData = this.activeTab.detail.name;
        this.openForm = false;
        //启动小流程
        this.startWorkflow(
          {
            collectionName: 'order', //单据名称
            formDataId: this.order.row._id, //表单数据id
            workflowFormDefId: workflowData.nodeDef.nodeTypeDef //小流程定义id
          },
          workflowSet => {
            this.order.row.workflowId = workflowSet._id; //小流程定义id，存储到订单上
            //这里的this.formData其实是订单里的exts，因为是扩展表单的formData
            this.formData.orphanId = workflowData._id; //下单业务节点的数据id
            this.doSaveOrder(this.formData);
          }
        );
        return;
      }

      //当前是扩展表单（运行主流程节点表单或子流程运行节点表单）
      var params = this.formData;
      params.sid = this.id;
      params.smodule = 'serviceAppointment';

      /*重复提交表单 子流程 子流程列表*/
      if (
        this.activeTab.detail.name.nodeDef.nodeType == 'repeat' ||
        this.activeTab.detail.name.nodeDef.nodeType == 'subflow' ||
        this.activeTab.detail.name.nodeDef.nodeType == 'subflows'
      ) {
        var nodeFormDefId = this.currentNode.nodeDef.formDefId;
        params.workflowId = this.currentNode.workflowId; //运行时子流程_id
        params.nodeId = this.currentNode._id; //运行时子流程节点_id

        //重复提交节点 删掉_id 否则不是新增是更新
        if (this.currentNode.nodeDef.nodeType == 'repeat') {
          // delete params._id;
          if (this.extFields[0] && this.extFields[0].name) {
            params.formTitle = params.formTitle || params[this.extFields[0].name];
          }
        }
      } else {
        //主流程节点关联表单 或 关联多个表单的节点
        var nodeFormDefId = this.activeTab.detail.name.nodeDef.formDefId;
        params.workflowId = this.activeTab.detail.name.workflowId; //运行时主流程_id
        params.nodeId = this.activeTab.detail.name._id; //运行时主流程节点_id
      }
      // 保存表单
      common.osg.ajax(
        `biz/extForm/upsert/${nodeFormDefId}`,
        {
          dataStr: JSON.stringify(params)
        },
        res => {
          //处理工作流
          if (
            this.activeTab.detail.name.nodeDef.nodeType == 'repeat' ||
            this.currentNode.nodeDef.nodeType == 'repeat'
          ) {
            // 重复提交节点需要单独调用工作流处理

            //刷新当前页面-刷新子流程
            this.tabChange(this.activeTab);
          } else {
            if (this.activeTab.detail.name.nodeDef.nodeType == 'forms') {
              this.saveNodeExts(res.data);
            } else {
              //主流程节点关联表单
              this.process(res.data._id);
            }
          }
          this.openForm = false;
          this.disabled.saveForm = false; //取消禁用提交表单按钮
        },
        {
          noload: true
        }
      );
    },
    /**
     * 关闭form表单
     */
    closeForm() {
      this.openForm = false;
      if (this.activeTab.detail.name == 'turnOrder') {
        return;
      } else {
        this.tabChange(this.activeTab);
      }
      if (this.order.active) this.order.active = false;
    },
    /**
     * 处理工作流
     */
    process(nodeFormDataId) {
      if (nodeFormDataId == 'complate') {
        if (this.activeTab.detail.name.nodeDef.nodeType == 'repeat') {
          if (!this.formList || this.formList.length == 0) {
            common.osg.alert('请至少填写1份表单！');
            return;
          }
        }
        //完成当前工作流
        var params = {
          workflowNodeId: this.activeTab.detail.name._id, //当前节点运行时_id
          nodeFormDefId: this.activeTab.detail.name.nodeDef.formDefId, //节点表单定义id formDefId
          nodeFormDataId: '', //关联子流程列表的节点无数据id
          smodule: 'serviceAppointment', //来源模块
          sid: this.id //工单id
        };
      } else {
        var params = {
          workflowNodeId: '', //当前节点运行时_id
          nodeFormDefId: '', //节点表单定义id formDefId
          nodeFormDataId: nodeFormDataId, //节点表单数据_id（就是填完表单后，返回的_id）
          smodule: 'serviceAppointment', //来源模块
          sid: this.id //工单id
        };
        if (
          this.activeTab.detail.name.nodeDef.nodeType == 'subflow' ||
          this.activeTab.detail.name.nodeDef.nodeType == 'subflows'
        ) {
          //子流程或子流程列表下 节点关联表单
          params.nodeFormDefId = this.currentNode.nodeDef.formDefId;
          params.workflowNodeId = this.currentNode._id;
        } else {
          //主流程节点关联表单
          params.nodeFormDefId = this.activeTab.detail.name.nodeDef.formDefId;
          params.workflowNodeId = this.activeTab.detail.name._id;

          if (this.activeTab.detail.name.nodeDef.nodeType == 'forms') {
            params.nodeFormDefId = '';
            params.nodeFormDataId = '';
          }
          //主流程节点 刷新表单需要提供表单数据id activeTab.detail.name.formDataId ,否则需要重新getSAData重新获取主流程
          this.activeTab.detail.name.formDataId = nodeFormDataId;
        }
      }

      common.osg.ajax('workflow/process', params, res => {
        //修改当前节点的工作流状态 禁用新增服务项和完成按钮
        if (nodeFormDataId == 'complate') {
          this.activeTab.detail.name.state = 10;
          //更新主工作流tab
          this.getSAData();
        } else if (this.activeTab.detail.name.nodeDef.nodeType == 'subflows') {
          // 子流程列表内 某子流程的节点表单提交后 刷新当前子流程
          this.getSubWorkflow(this.subWorkflow.defId, this.subWorkflow.runId);
        } else if (this.activeTab.detail.name.nodeDef.nodeType == 'forms') {
          // 更新右上角工单状态
          this.getSAData();
        } else {
          //主流程节点 更新主工作流tab
          this.getSAData();
        }
      });
    },
    /**
     * 重复提交节点 批量提交一次 传该节点的多条记录
     */
    doProcess(subNode) {
      var params = {
        workflowNodeId: subNode._id, //当前节点运行时_id
        nodeFormDefId: subNode.nodeDef.formDefId, //节点表单定义id formDefId
        nodeFormDataId: '', //节点表单数据_id（就是填完表单后，返回的_id，重复提交节点多表单记录_id逗号隔开）
        smodule: 'serviceAppointment', //来源模块
        sid: this.id //工单id
      };

      //重复提交表单 传所有表单记录id 逗号隔开
      let nodeFormDataIds = [];
      for (var formDataItem of subNode.formDataList) {
        nodeFormDataIds.push(formDataItem._id);
      }
      params.nodeFormDataId = nodeFormDataIds.join();

      common.osg.ajax('workflow/process', params, res => {
        //刷新当前页面
        this.tabChange(this.activeTab);
        //更新主工作流tab
        this.getSAData();
      });
    },
    /**
     * 工作流回退
     */
    rollbackWorkflow(workflowNodeId) {
      common.osg.confirm('是否确认删除？', () => {
        let params = {
          workflowNodeId: workflowNodeId,
          smodule: 'serviceAppointment',
          sid: this.id
        };
        common.osg.ajax('workflow/rollbackWorkflow', params, res => {
          if (
            (this.activeTab.detail.name.nodeDef.nodeType == 'subflow' ||
              this.activeTab.detail.name.nodeDef.nodeType == 'subflows') &&
            this.subWorkflow.show
          ) {
            this.getSubWorkflow(this.subWorkflow.defId, this.subWorkflow.runId);
          } else {
            this.getSAData();
          }
        });
      });
    },
    /**
     * 工作流撤回
     */
    takebackWorkflow(workflowNodeId) {
      common.osg.confirm('修改此步将删除下一步的数据', () => {
        let params = {
          workflowNodeId: workflowNodeId,
          smodule: 'serviceAppointment',
          sid: this.id
        };
        common.osg.ajax('workflow/takebackWorkflow', params, res => {
          if (
            this.activeTab.detail.name.nodeDef.nodeType == 'subflow' ||
            this.activeTab.detail.name.nodeDef.nodeType == 'subflows'
          ) {
            this.getSubWorkflow(this.subWorkflow.defId, this.subWorkflow.runId);
          } else {
            this.getSAData(() => {
              // 更新到最新节点（当前节点），由于没有切换节点导致vantTabsOntap方法无法刷新tab-content内视图，需要调用tabChange触发
              this.tabChange({
                detail: {
                  name: this.nodes[this.nodes.length - 1]
                }
              });
            });
          }
        });
      });
    },
    /**
     * 取消工作流
     */
    cancelWorkflow(subflow) {
      common.osg.confirm('是否确认删除？', () => {
        let params = {
          workflowId: subflow._id,
          smodule: 'serviceAppointment',
          sid: this.id
        };
        common.osg.ajax('workflow/cancelWorkflow', params, res => {
          subflow.state = -1;
          this.$forceUpdate();
        });
      });
    },
    /**
     * 触发事件
     */
    commonEvent(eventName, field, options) {
      options = options || {};
      if (eventName == 'scan') {
        common.osg.scanCode(res => {
          this.formData[field] = this.formData[field] || [];
          let url = res.result;

          //如果有url校验
          if (options.funcUrl) {
            let keyField = options.key;
            let valueField = options.value;
            let sortField = options.sortField;
            common.osg.ajax(
              options.funcUrl,
              {
                url
              },
              res => {
                if (sortField) {
                  //按分类统计展示
                  let obj = this.formData[sortField] || {};
                  let result = res.data;
                  let key = result[keyField];
                  let value = result[valueField];
                  obj[key] = obj[key] || [];
                  if (obj[key].indexOf(url) != -1) {
                    common.osg.toast('重复扫码', 'none');
                    return;
                  } else {
                    obj[key].push(url);
                  }
                  this.formData[sortField] = obj;
                  this.$forceUpdate();
                } else {
                  // 不按分类统计的情况
                  this.formData[field].push(url);
                }
              }
            );
          } else {
            // 不按分类统计的情况
            this.formData[field].push(url);
            this.$forceUpdate();
          }
        });
      } else if (eventName == 'addItem') {
        if (options.requestUrl) {
          // 请求业务档案列表
          common.osg.ajax(
            options.requestUrl,
            {
              page: 1,
              rows: 100,
              'in:state|array-integer#and': '0,1'
            },
            res => {
              //赋值label和value字段供组件使用
              let label = options.label;
              let value = options.value;
              if (label && value) {
                res.data.map(item => {
                  item.label = item[label];
                  item.value = item[value];
                });
              }
              //返显value用
              this.options[field] = res.data;
              //上拉菜单
              this.actionSheet.actions = res.data;
              this.actionSheet.field = field;
              this.actionSheet.type = 'addItem';
              this.actionSheet.show = true;
            }
          );
        } else if (options.valueOption) {
          // 请求代码表
          common.osg.ajax(
            'code/query',
            {
              'is:type|string#and': options.valueOption,
              'in:state|array-integer#and': '1',
              page: 1,
              rows: 100
            },
            res => {
              //赋值label和value字段供组件使用
              let label = options.label;
              let value = options.value;
              if (label && value) {
                res.data.map(item => {
                  item.label = item[label];
                  item.value = item[value];
                });
              }
              //返显value用
              this.options[field] = res.data;
              //上拉菜单
              this.actionSheet.actions = res.data;
              this.actionSheet.field = field;
              this.actionSheet.type = 'addItem';
              this.actionSheet.show = true;
            },
            {
              noload: true
            }
          );
        }
      } else if (eventName == 'pushItem') {
        if (!this.formData[field]) {
          common.osg.alert('不允许添加空值');
          return;
        }

        let url = options.url + this.formData[field];

        //如果有url校验
        if (options.funcUrl) {
          let keyField = options.key;
          let valueField = options.value;
          let sortField = options.sortField;
          common.osg.ajax(
            options.funcUrl,
            {
              url
            },
            res => {
              if (sortField) {
                //按分类统计展示
                let obj = this.formData[sortField] || {};
                let result = res.data;
                let key = result[keyField];
                let value = result[valueField];
                obj[key] = obj[key] || [];
                if (obj[key].indexOf(url) != -1) {
                  common.osg.toast('重复扫码', 'none');
                  return;
                } else {
                  obj[key].push(url);
                }
                this.formData[sortField] = obj;
                this.$forceUpdate();

                common.osg.toast('添加成功');
                if (options.clear) {
                  this.formData[field] = '';
                }
              } else {
                // 不按分类统计的情况
                this.formData[sortField].push(url);
              }
            }
          );
        } else {
          // 不按分类统计的情况
          this.formData[field].push(url);
          this.$forceUpdate();
        }
      } else if (eventName == 'codelabel') {
        return common.osg.codelabel(options.option, options.value);
      } else if (eventName == 'button') {
        let func = options.extField.frontEndConfig.func;
        if (func) {
          this[func]();
        }
      }
    },
    /**
     * 表单字段 输入
     */
    onChange(e) {
      let type = e.target.dataset.extfield.type;
      let field = e.target.dataset.extfield.name;
      let value = e.detail;
      // 字段赋值
      this.formData[field] = value;
      if (type == 'evaluate') {
        //根据脚本id匹配脚本公式
        let scritpId = e.target.dataset.extfield.frontEndConfig;
        let evaluate = this.options.script[scritpId];
        if (evaluate) {
          //变量赋值
          let arr = [];
          for (var item of evaluate.var) {
            arr.push(Number(this.formData[item]));
          }
          //公式计算
          let val = wx.binding.eval(evaluate.eval, arr, evaluate.func);
          if (val || val == 0) {
            this.formData[evaluate.res] = Math.abs((val.toFixed(2) * 100) / 100);
          }
          console.log(evaluate);
          console.log(this.formData[evaluate.res]);

          //计算"结果"关联的公式
          for (var extField of this.extFields) {
            if (extField.name == evaluate.res) {
              let resEvaluate = this.options.script[extField.frontEndConfig];
              if (resEvaluate) {
                //变量赋值
                let resArr = [];
                for (var item of resEvaluate.var) {
                  resArr.push(Number(this.formData[item]));
                }
                //公式计算
                let resVal = wx.binding.eval(resEvaluate.eval, resArr, resEvaluate.func);
                console.log(resVal);
                if (resVal || resVal == 0) {
                  this.formData[resEvaluate.res] = Math.abs((resVal.toFixed(2) * 100) / 100);
                }
                console.log('结果计算');
                console.log(evaluate);
                console.log(this.formData[evaluate.res]);
              }
              break;
            }
          }
        }
      }
      //视图刷新
      this.$forceUpdate();
    },
    /**
     * 表单字段 点击
     */
    onClick(e) {
      let extField = e.target.dataset.extfield || e.currentTarget.dataset.extfield;
      let type = extField.type;
      let field = extField.name;
      let value = e.detail;
      let valueOption = extField.valueOption;
      let frontEndConfig = extField.frontEndConfig;
      // 只读字段
      if (this.currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1) {
        return;
      }

      if (type == 'date' || type == 'time' || type == 'datetime') {
        this.datetime = {
          type,
          field,
          value: type == 'time' ? '12:00' : new Date().getTime(),
          show: true
        };
      } else if (type == 'select') {
        this.actionSheet = {
          actions: this.options[valueOption],
          field: field,
          type: '', //默认为空，type=addItem自定义项
          show: true
        };
      } else if (type == 'cascade') {
        this.cascader = {
          options: this.options[valueOption],
          field: field,
          type: '', //默认为空，type=addItem自定义项
          show: true
        };
      } else if (type == 'bizSelect') {
        var url = frontEndConfig.requestUrl;
        common.osg.ajax(
          frontEndConfig.requestUrl,
          {
            page: 1,
            rows: 100,
            'in:state|array-integer#and': '1'
          },
          res => {
            res.data.map(item => {
              item.label = item[frontEndConfig.label];
              item.value = item[frontEndConfig.value];
            });
            this.options[field] = res.data;
            this.actionSheet = {
              actions: this.options[field],
              field: field,
              type: 'bizSelect', //默认为空，type=addItem自定义项 , type=bizSelect选择对象列表
              show: false
            };
            this.actionSheet.show = true;
          }
        );
      } else if (type == 'area') {
        this.area.field = field;
        this.area.show = true;
        // this.area.show = true;
      } else if (type == 'dialog') {
        if (!common.osg.isRepeatClick('dialog')) {
          this.dialog.extField = extField;
          Object.assign(this.dialog, extField.frontEndConfig);
          this.dialog.timer = setInterval(() => {
            this.dialog.countdown--;
            this.$forceUpdate();
            if (this.dialog.countdown <= 0) {
              clearInterval(this.dialog.timer);
            }
          }, 1000);
          this.dialog.show = true;
        }
      }
      this.$forceUpdate();
    },
    /**
     * 上拉菜单选择
     */
    actionSheetSelect(e) {
      if (this.actionSheet.type == 'addItem') {
        //自定义增项
        this.formData[this.actionSheet.field] = this.formData[this.actionSheet.field] || [];
        this.formData[this.actionSheet.field].push(e.detail.value);
      } else if (this.actionSheet.type == 'bizSelect') {
        //选择对象中的选项
        this.formData[this.actionSheet.field] = e.detail.value;
        this.formData.label = e.detail.label; //将中文加到存到label字段 上层工作流渲染多记录时返显
      } else {
        //选择字典表选项
        this.formData[this.actionSheet.field] = e.detail.value;
      }
      this.$forceUpdate();
    },
    /**
     * 上拉菜单取消
     */
    actionSheetClose() {
      this.actionSheet.show = false;
    },
    /**
     * 级联选择器完成
     */
    onCascaderFinish(e) {
      const { selectedOptions } = e.detail;
      // 组合value
      this.formData[this.cascader.field] = selectedOptions.map(item => item.value);
      this.orgShow = false;
    },
    /**
     * 选择时间 提交
     */
    datetimeConfirm(e) {
      let value = e.detail;
      if (this.datetime.type == 'datetime') {
        // this.formData[this.datetime.field] = new Date(value)
        // 	.toLocaleString("chinese", {
        // 		hour12: false
        // 	})
        // 	.replace(/\//g, "-");
        // if (typeof this.formData[this.datetime.field] == "object") {
        this.formData[this.datetime.field] = this.formattTime(value);
        // }
        console.log(this.formData[this.datetime.field]);
      } else if (this.datetime.type == 'date') {
        this.formData[this.datetime.field] = new Date(value)
          .toLocaleDateString()
          .replace(/\//g, '-');
      } else if (this.datetime.type == 'time') {
        this.formData[this.datetime.field] = value;
      }
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
    /**
     * 选择时间 取消
     */
    datetimeCancel() {
      this.datetime = {
        show: false,
        type: '',
        field: '',
        value: ''
      };
    },
    /**
     * 选择省市区 提交
     */
    areaConfirm(e) {
      let values = e.detail.values;
      let areaVal = [];
      if (values.length >= 1) {
        this.formData.province = values[0].code;
        areaVal.push(values[0].code);
      }
      if (values.length >= 2) {
        this.formData.city = values[1].code;
        areaVal.push(values[1].code);
      }
      if (values.length >= 3) {
        this.formData.district = values[2].code;
        areaVal.push(values[2].code);
      }
      this.formData[this.area.field] = areaVal; //adcode的数组
      this.area.show = false;
      // this.area.show = false;
      this.$forceUpdate();
      // 查询街道
      common.osg.getSubdistricts(areaVal, res => {
        this.options.subdistricts = res;
      });
    },
    /**
     * 选择省市区 取消
     */
    areaCancel() {
      this.area.field = '';
      this.area.show = false;
      // this.area.show = false;
    },
    /**
     * 删除标签
     */
    tagClose(field, index) {
      this.formData[field].splice(index, 1);
      this.$forceUpdate();
    },
    /**
     * 上传图片
     */
    afterRead(e) {
      let extfield = e.target.dataset.extfield;
      this.formData[extfield.name] = this.formData[extfield.name]
        ? this.formData[extfield.name]
        : [];
      if (extfield && extfield.frontEndConfig && extfield.frontEndConfig.max) {
        if (extfield.frontEndConfig.max < this.formData[extfield.name].length + 1) {
          common.osg.alert('只能上传' + extfield.frontEndConfig.max + '个！');
          return;
        }
      }
      common.osg.afterRead(e, this, this.longitude, this.latitude);
    },
    /**
     * 删除图片
     */
    deleteFile(e) {
      let field = e.target.dataset.field;
      let index = e.detail.index;
      this.formData[field].splice(index, 1);
      this.$forceUpdate();
    },
    /**
     * 监听用户下拉动作
     */
    onPullDownRefresh() {
      this.tabChange(this.activeTab);
    },

    /**
     * 获取动态
     */
    getLog() {
      common.osg.ajax(
        'biz/tenantLog/query.do',
        {
          sid: this.id,
          smodule: 'serviceAppointment'
        },
        res => {
          this.setData({
            'log.data': res.data
          });
        },
        {
          noload: true
        }
      );
    },
    /**
     * 获取订单
     */
    getOrders(noload) {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      // if (this.orderTimer && window) window.clearTimeout(this.orderTimer);
      let params = {
        _all: '1',
        serviceAppointmentId: this.id,
        sortField: 'createTime',
        sortOrder: 'desc',
        // 'ne:processState|integer#and': '-2',//审核通过已作废，则不能签约查询了
        'in:state|array-integer#and': '0,1'
      };
      common.osg.ajax(
        'basic/order/query',
        params,
        res => {
          let isReload = false;
          //过滤订单流程state-1的（流程已经被删除的就不展示了）
          this.order.data = res.data.map(item => {
            item.workflowNodeList = item.workflowNodeList.filter(node => node.state != -1);
            if (item.processState == '0' || item.processState == '4') isReload = true; //有签约中或待签约的才轮询调用接口
            return item;
          });
          isReload =
            currentPage.route == 'subpackages/serviceAppointment/serviceAppointment' ? true : false;
          console.log('isReload', isReload);
          // 当前停留在订单列表
          if (
            isReload &&
            this.activeTab.detail.name &&
            this.activeTab.detail.name.nodeDef &&
            this.activeTab.detail.name.nodeDef.nodeType == 'placeOrder'
          ) {
            if (this.placeOrderPage.active == 'order') {
              this.orderTimer = setTimeout(() => {
                this.getOrders(true);
                if (this.orderTimer && window) window.clearTimeout(this.orderTimer);
              }, 4000);
            }
          }
          // this.$forceUpdate();
        },
        {
          noload: noload || false
        }
      );
    },
    //TODO:暂时的，获取转订单所需要填写的字段
    getTurnOrderFields(callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          colName: 'order',
          _all: '1',
          'is:state|integer#and': 1,
          'nin:preset|array-integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          for (let [index, extField] of res.data.entries()) {
            if (extField.createUser == '0') {
              extField.preset = true;
            }
            //解析frontEndConfig字段配置
            if (extField.frontEndConfig && common.osg.isJson(extField.frontEndConfig)) {
              extField.frontEndConfig = JSON.parse(extField.frontEndConfig);
            }
            //关联字典表codeType放到options,之后从字典表查询
            if (extField.valueOption && extField.type != 'cascade') {
              this.options['codecfg_' + extField.valueOption] = {
                codeId: extField.valueOption
              };
            }
            //级联
            if (extField.type == 'cascade') {
              this.options['cascadeCode_' + extField.valueOption] = {
                codeId: extField.valueOption
              };
            }
          }
          // console.log(this.options);
          //过滤字段配置为 isQuotation或listHide的字段
          let formExtFields = res.data.filter(
            item =>
              item.frontEndConfig &&
              item.frontEndConfig.isQuotation &&
              !item.frontEndConfig.listHide
          );
          if (callback) callback(formExtFields);
        },
        {
          noload: true
        }
      );
    },
    //转为订单
    turnOrder(row) {
      if (this.orderTimer && window) window.clearTimeout(this.orderTimer);
      this.openPlaceOrder(row);
    },
    //打开订单
    openPlaceOrder(row) {
      let workflowData = this.activeTab.detail.name;
      common.osg.open('../order/placeOrder', {
        editType: '1', //修改订单的类型，1编辑，2增项，3减项
        orderId: row._id,
        id: row.serviceAppointmentId,
        workflowFormDefId: workflowData.nodeDef.nodeTypeDef, //小流程的定义id
        orphanId: workflowData._id, //下单业务节点的数据id
        turnOpenForm: true
      });
    },
    //保存订单
    doSaveOrder(exts) {
      this.order.row.exts = this.order.row.exts ? this.order.row.exts : {};
      this.order.row.exts = Object.assign(this.order.row.exts, exts);
      let params = this.order.row;
      params.type = '1'; //type 0是报价 1为订单
      // params.ownerId = '4029667635856491098'; //TODO:临时写死联系人id
      this.order.active = false;
      common.osg.ajax(
        'basic/order/upsert',
        {
          order: JSON.stringify(params)
        },
        res => {
          this.order.row = {};
          this.formData = {};
          // common.osg.toast("操作成功");
          this.getOrders();
        },
        {
          noload: true
        }
      );
    },
    //启动工作流
    startWorkflow(param, callback) {
      let params = {
        collectionName: param.collectionName,
        formDataId: param.formDataId,
        workflowFormDefId: param.workflowFormDefId
      };
      common.osg.ajax(
        `workflow/startWorkflow/${params.collectionName}/${params.formDataId}/${params.workflowFormDefId}`,
        {},
        res => {
          common.osg.toast('工作流启动成功!');
          if (callback) callback(res.entity);
        },
        {
          noload: true
        }
      );
    },
    /**
     * 查看订单详情
     */
    toOrder(id) {
      if (this.orderTimer && window) window.clearTimeout(this.orderTimer);
      common.osg.open('../order/order', {
        id: id,
        isEdit: true,
        serviceType: this.SAFormData.exts.workflowDefId
      });
    },
    //编辑订单按钮
    openEditOrder(state, orderData) {
      common.osg.confirm('确定编辑订单吗？', () => {
        // let path = '../order/placeOrder';
        // if (this.SAFormData.exts.workflowDefId != '8191527117502723955') {
        let path = '../order/placeOrders';
        // }
        common.osg.open(path, {
          editType: state, //修改订单的类型，1编辑，2增项，3减项
          orderId: orderData._id,
          id: orderData.serviceAppointmentId,
          workflowFormDefId: orderData.workflowId, //小流程的定义id
          orphanId: orderData.exts && orderData.exts.orphanId ? orderData.exts.orphanId : '', //下单业务节点的数据id
          serviceType: this.SAFormData.exts.workflowDefId
        });
      });
    },
    /**
     * 下单
     */
    placeOrder() {
      let workflowSet = this.activeTab.detail.name;
      // let path = '../order/placeOrder';
      // if (this.SAFormData.exts.workflowDefId != '8191527117502723955') {
      let path = '../order/placeOrders';
      // }
      common.osg.open(path, {
        id: this.id,
        workflowFormDefId: workflowSet.nodeDef.nodeTypeDef, //小流程的定义id
        orphanId: workflowSet._id, //下单业务节点的数据id
        serviceType: this.SAFormData.exts.workflowDefId
      });
    },
    /**
     * 拨打电话
     */
    call(type, callerId, calleeId, sid) {
      common.osg.ajax(
        'basic/winnerlook/getMiddleNumber',
        {
          type,
          callerId: callerId || wx.getStorageSync('user')._id,
          calleeId,
          sid: this.SAFormData._id
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
    placeOrderTabChange(e) {
      this.placeOrderPage.active = e.detail.name;
      if (e.detail.name == 'contract') {
        this.getContracts(false, 4);
      } else if (e.detail.name == 'order') {
        this.getOrders();
      }
      this.updateSAStatus();
    },
    /**
     * 选择单笔支付限额
     */
    paymentLimitOpen(item) {
      this.paymentLimit.order = item;
      this.paymentLimit.show = true;
    },
    paymentLimitChange(e) {
      this.paymentLimit.limit = e.detail;
    },
    paymentLimitClick(limit) {
      this.paymentLimit.limit = limit;
    },
    paymentLimitConfirm() {
      this.paymentLimit.show = false;
      this.pay(this.paymentLimit.order);
    },
    paymentLimitCancel() {
      this.paymentLimit.order = {};
      this.paymentLimit.show = false;
    },
    /**
     * 去支付
     */
    pay(item) {
      // 判断是否重复点击
      if (common.osg.isRepeatClick('pay')) {
        return;
      }

      // if (item.exts.contractType == '5') {
      //   common.osg.alert('服务商双方合同，不允许线上支付，请进行线下支付！', res => {
      //     return;
      //   });
      //   return;
      // }

      //查询合同状态，如果未签约则提示先签约再支付。 -1:已签约
      if (item.processState == '0') {
        common.osg.alert('您有合同未签约，请签约后再支付！', res => {
          return;
        });
        return;
      }

      this.order.row = item;

      // 数据初始化
      if (this.payment.timer) clearInterval(this.payment.timer);
      this.payment = {
        open: false,
        qrval: '',
        obj: {},
        timer: null,
        payState: '',
        countDown: null
      };
      this.payment.open = true;

      // 定时刷新收款码和支付金额
      this.getPayStatus(item._id);
      this.payment.timer = setInterval(() => {
        this.getPayStatus(item._id);
      }, 20000);
    },
    /**
     * 定时刷新收款码和支付金额
     */
    getPayStatus(id, msg) {
      // 有msg即手动点击刷新按钮的情况 判断是否重复点击
      if (msg && common.osg.isRepeatClick('getPayStatus')) {
        return;
      }

      common.osg.ajax(
        'basic/pay/getPayStatusAndMessage.do',
        {
          orderIds: id,
          quota: this.paymentLimit.limit
        },
        res => {
          res.data.paid = Number(res.data.paid);
          res.data.total = Number(res.data.total);

          if (msg) common.osg.toast(msg, 'none', 3000);

          // 标记支付中 更新收款码
          this.payment.payState = 'paying';

          // 更新支付结果
          this.payment.obj = res.data;

          // 已付金额大于等于需付金额 无需定时刷新
          if (res.data.paid >= res.data.total && this.payment.timer) {
            clearInterval(this.payment.timer);
            this.payment.timer = null;
          }

          // 更新收款码
          if (this.payment.open) {
            this.payment.qrval = res.data.qrcodeUrl;
            drawQrcode({
              width: 200,
              height: 200,
              canvasId: 'qrcode',
              // ctx: wx.createCanvasContext('qrcode'),
              text: res.data.qrcodeUrl
            });
          }

          // 更新收款码有效期倒计时
          this.payment.countDown =
            2 * 60 * 60 * 1000 - (new Date().getTime() - new Date(res.data.timeStr).getTime());
          console.log('countDown', this.payment.countDown);
        },
        {
          noload: true
        }
      );
    },
    /**
     * 重新发起支付
     */
    payAgain(item) {
      //判断是否重复点击
      if (common.osg.isRepeatClick('payAgain')) {
        return;
      }

      let msg = '重新发起支付后，原二维码失效，请确认！';

      common.osg.confirm(msg, () => {
        common.osg.ajax(
          '/basic/pay/handleFingardUpdateQRCode.do',
          {
            orderId: item._id,
            quota: this.paymentLimit.limit
          },
          res => {
            res.data.paid = Number(res.data.paid);
            res.data.total = Number(res.data.total);

            common.osg.toast('重新发起支付成功', 'none', 3000);

            // 标记支付中
            this.payment.payState = 'paying';

            // 更新支付结果
            this.payment.obj = res.data;

            // 如果已关闭当前支付，已经清除定时刷新了；
            if (this.payment.timer) {
              clearInterval(this.payment.timer);
              this.payment.timer = null;
            }
            // 如果未关闭当前支付，判断是否需要定时刷新：已付金额大于等于需付金额 无需定时刷新，否则需要定时刷新
            if (res.data.paid < res.data.total) {
              this.payment.timer = setInterval(() => {
                this.getPayStatus(item._id);
              }, 20000);
            }

            // 更新收款码
            if (this.payment.open) {
              this.payment.qrval = res.data.qrcodeUrl;
              drawQrcode({
                width: 200,
                height: 200,
                // ctx: wx.createCanvasContext('qrcode'),
                canvasId: 'qrcode',
                text: res.data.qrcodeUrl
              });
            }

            // 更新收款码有效期倒计时
            this.payment.countDown =
              2 * 60 * 60 * 1000 - (new Date().getTime() - new Date(res.data.timeStr).getTime());
            console.log('countDown', this.payment.countDown);
          }
        );
      });
    },
    /**
     * 关闭当前支付
     */
    closePayment(id) {
      //判断是否重复点击
      if (common.osg.isRepeatClick('closePayment')) {
        return;
      }

      common.osg.confirm('关闭当前支付后，原二维码失效，请确认！', () => {
        common.osg.ajax(
          '/basic/pay/handleFingardCloseOrder.do',
          {
            orderId: id
          },
          res => {
            common.osg.toast('当前支付已关闭', 'none', 3000);

            // 标记已关闭当前支付
            this.payment.payState = 'close';

            // 取消收款码
            // if (this.$refs.qrcode)
            //  this.$refs.qrcode._clearCode();
            this.payment.qrval = '';

            // 取消查询定时刷新收款码和支付金额
            if (this.payment.timer) {
              clearInterval(this.payment.timer);
              this.payment.timer = null;
            }

            // 更新视图防止二维码不展示
            this.$forceUpdate();
          }
        );
      });
    },
    /**
     * 关闭支付弹出层
     */
    closePay() {
      this.payment.open = false;

      // 取消定时刷新收款码和支付金额
      if (this.payment.timer) {
        clearInterval(this.payment.timer);
      }

      this.payment = {
        open: false,
        qrval: '',
        obj: {},
        timer: null,
        payState: '',
        countDown: null
      };

      // 取消二维码
      // if (this.$refs.qrcode)
      // this.$refs.qrcode._clearCode();
      this.payment.qrval = '';

      // 刷新工单列表
      this.getOrders();

      // 更新右上角工单状态
      this.updateSAStatus();
    },
    // 更新右上角工单状态
    updateSAStatus() {
      common.osg.ajax(
        'basic/serviceAppointment/queryById/' + this.id,
        { type: 'query' },
        res => {
          this.SAFormData.status = res.data.serviceAppointment.status;
          this.$forceUpdate();
        },
        {
          noload: true
        }
      );
    },
    refreshPlaceOrder() {
      this.options = {
        codecfg_payState: {
          codeId: 'PAYSTATE'
        },
        codecfg_contractType: {
          codeId: 'allContractType'
        },
        codecfg_contractStatus: {
          codeId: 'contractStatus'
        },
        codecfg_processState: {
          codeId: 'processState'
        },
        codecfg_examinStatus: {
          codeId: 'examinStatus'
        },
        codecfg_paymentLimit: {
          codeId: 'paymentLimit'
        },
        codecfg_serviceType: { codeId: 'serviceType' }
      };
      common.osg.codeoption(() => {
        if (this.placeOrderPage.active == 'order') {
          this.getOrders();
        } else if (this.placeOrderPage.active == 'contract') {
          this.getContracts(false, 5);
        }
        // 更新工单状态(切换到其他页面签约后返回小程序页面)
        this.updateSAStatus();
      });
    },
    /* 获取合同列表 */
    getContracts(noload, num) {
      console.log(num);
      if (this.contractTimer) {
        clearTimeout(this.contractTimer);
        this.contractTimer = null;
      }
      common.osg.ajax(
        'basic/contract/query.do',
        {
          _all: '1',
          'is:serviceAppointmentId|string#and': this.id,
          'is:state|integer#or': '1',
          'is:exts.contractStatus|string#or': '-2',
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          let request = false;
          res.data.map(item => {
            item.exts = item.exts || {};
            item.exts.contractStatus = item.exts.contractStatus || '0';
            // 检查有没有上传文件的就需要重新刷新
            if (
              (item.qiniuUrls && item.qiniuUrls.length == 0) ||
              !item.qiniuUrls ||
              item.exts.contractStatus == '-3'
            ) {
              request = true;
            }
          });
          this.contract.data = res.data;
          this.$forceUpdate();

          let pages = getCurrentPages();
          let currentPage = pages[pages.length - 1];
          let isReload =
            currentPage.route == 'subpackages/serviceAppointment/serviceAppointment' ? true : false;

          // 需要重新加载列表
          if (request || isReload) {
            // 当前停留在下单节点
            if (
              this.activeTab.detail.name &&
              this.activeTab.detail.name.nodeDef &&
              this.activeTab.detail.name.nodeDef.nodeType == 'placeOrder'
            ) {
              // 当前停留在合同列表
              if (this.placeOrderPage.active == 'contract') {
                this.contractTimer = setTimeout(() => {
                  this.getContracts(true, 1);
                  // if(contractTimer && window)
                  // if (window && this.contractTimer) window.clearTimeout(this.contractTimer);
                }, 5000);
              }
            }
          }
        },
        {
          noload: noload
        }
      );
    },
    //线下签约
    offlineSign(item) {
      if (common.osg.isRepeatClick('offlineSign')) {
        return; //判断是否重复点击
      }
      common.osg.confirm('是否确认线下签约', () => {
        let params = {
          orderId_thread: item._id, //来源模块
          type: 1 //有值代表激活合同
        };
        common.osg.ajax('signature/applyForElectronicSignature.do', params, res => {
          this.getOrders(false);
        });
      });
    },
    /* 去签约 */
    sign(item) {
      if (common.osg.isRepeatClick('sign' + item._id, 120000, '已发起签约，请勿重复点击！')) {
        return; //判断是否重复点击
      }
      common.osg.confirm(
        '请再次与客户确认合同文本内容，确认后点选"确定"按钮，电子合同即刻生效，是否确定？',
        () => {
          common.osg.ajax(
            'signature/applyForElectronicSignature',
            {
              orderId_thread: item._id
            },
            res => {
              common.osg.alert('已发送签约短信给签约方，请签约方通过短信链接进行签约。', () => {
                this.getOrders(false);
              });
            }
          );
        }
      );
    },
    codelabel(type, option, val, opts, frontEndConfig) {
      try {
        if (type == 'select') {
          return common.osg.codelabel(option, val, opts);
        } else if (type == 'cascade') {
          if (frontEndConfig && frontEndConfig.multiple) {
            return common.osg.formatCascadeMultiple(option, val);
          } else {
            return common.osg.formatCascade(option, val);
          }
        }
      } catch (e) {}
    },
    /**
     * 确认阅读协议
     */
    dialogConfirm() {
      if (this.dialog.timer) {
        clearInterval(this.dialog.timer);
      }
      this.formData[this.dialog.extField.name] = true;
      this.dialog.show = false;
    },
    // 关闭阅读协议
    dialogCancel() {
      if (this.dialog.timer) {
        clearInterval(this.dialog.timer);
      }
      this.dialog.show = false;
    },
    //保留两位小数的金额
    amountToFixed(money) {
      if (!money) return 0;
      let resultAmount = +(+money).toFixed(2);
      return resultAmount ? resultAmount : 0;
    },
    //合同原因change事件
    reasonCancellationChange(e) {
      this.cancelContractData.reasonCancellation = e.detail;
    },
    //取消合同
    cancelContract(data) {
      let message = '是否确认取消合同？';
      //如果契约锁平台签约失败，提示文本修改
      if (data.exts && data.exts.contractStatus == '5')
        message = '您可以修改订单后再次签约，确定取消合同吗？';
      common.osg.confirm(message, () => {
        this.cancellationShow = true;
        this.cancelContractData.id = data._id;
        this.cancelContractData.workType =
          data.exts && data.exts.workType ? data.exts.workType : null;
      });
    },
    //取消合同接口
    cancelContractAjax() {
      if (this.cancelContractData.workType == '2' && !this.cancelContractData.reasonCancellation) {
        common.osg.toast('取消合同原因不能为空!', 'none');
        return;
      }
      this.cancellationShow = false;
      common.osg.ajax(
        'basic/contract/remove',
        {
          id: this.cancelContractData.id,
          cancelReason: this.cancelContractData.reasonCancellation
        },
        res => {
          this.cancelContractData.reasonCancellation = '';
          common.osg.alert('操作成功');
          this.getContracts(true, 2);
        }
      );
    },
    //再次签约
    signAgain(id) {
      common.osg.confirm('是否确认再次签约合同？', () => {
        common.osg.ajax(
          'signature/againApplyForElectronicSignature',
          {
            contractId: id
          },
          res => {
            common.osg.alert('操作成功');
            this.getContracts(true, 3);
          }
        );
      });
    },
    //再次发送契约锁短信
    sendAgain(id) {
      common.osg.confirm('是否确认再次发送契约锁签约短信？', () => {
        common.osg.ajax(
          'signature/handleReminderContract',
          {
            contractId: id
          },
          res => {
            common.osg.alert('发送成功');
            this.getContracts(true, 6);
          }
        );
      });
    },
    //打开合同表单页面，合同增项、减项、退款
    openContractExt(type, row, colName) {
      let url = type == '4' ? '../contract/appendixes' : '../contract/extForm';
      common.osg.open(url, {
        type, //类型，1增项，2减项，3退款 4 合同附件 5合同变更
        sid: row._id,
        colName,
        row: JSON.stringify({
          contractType: row.contractType,
          contactsName: row.contactsName,
          contactsPhone: row.contactsPhone,
          partyB: row.partyB,
          contractdocNum: row.contractdocNum,
          orderId: row.orderId,
          contactsName: row.contactsName,
          serviceAppointmentId: row.serviceAppointmentId,
          contactsId: row.contactsId,
          adjustRefundMoney: row.adjustRefundMoney ? row.adjustRefundMoney : row.afterRefundMoney, //有增减项金额取增减项金额，如果没有则取优惠后合同金额
          afterRefundMoney: row.afterRefundMoney,
          paidAmount: row.paidAmount,
          _id: row._id
        }),
        tenantId: '1340835581184723420'
      });
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
    /**
     * 动态添加表单
     */
    addForm() {
      let currentNode = this.activeTab.detail.name;
      let codeId = currentNode.nodeDef.addFormCodeId;
      // 获取添加表单选项
      if (!this.addForms.actions || this.addForms.actions.length == 0) {
        common.osg.ajax(
          'code/query',
          {
            parentId: codeId,
            'is:state|integer#and': 1,
            _all: '1'
          },
          res => {
            this.addForms.actions = res.data;
            this.addForms.show = true;
          }
        );
      } else {
        this.addForms.show = true;
      }
    },
    // 选择表单
    addFormsSelect(e) {
      let obj = e.detail;
      obj.exts = obj.exts || {};
      let formDefId = obj.exts.formDefId;
      let formTitle = obj.name + this.activeTab.detail.name.nodeDef.name;
      this.viewAddForm(formDefId, formTitle);
    },
    // 重复提交表单 新增表单
    newForm() {
      let formDefId = this.activeTab.detail.name.nodeDef.formDefId;
      let formTitle = this.activeTab.detail.name.nodeDef.name;
      this.viewAddForm(formDefId, formTitle);
    },
    // 查看单个表单
    viewAddForm(formDefId, formTitle, formDataId, form) {
      if (formDataId) {
        this.currentForm = form;
      } else {
        this.currentForm = {};
      }

      // this.options = []
      //获取表单字段 传运行节点关联表单id 如果已关联表单数据id获取表单数据
      this.getFields(formDefId, () => {
        // 保存表单需要用到当前表单定义id和表单标题
        this.activeTab.detail.name.nodeDef.formDefId = formDefId;
        this.activeTab.detail.name.nodeDef.formTitle = formTitle;

        if (formDataId) {
          this.getFormData(formDefId, formDataId, true);
        } else {
          // 未填写的表单
          this.formData = {
            exts: {}
          };
          this.openForm = true;
        }
        this.addForms.show = false;
      });
    },
    // 保存/更新节点exts
    saveNodeExts(formData) {
      formData.formDefId = formData.formDefId || this.activeTab.detail.name.nodeDef.formDefId; //数据中存表单定义id
      formData.formTitle = formData.formTitle || this.activeTab.detail.name.nodeDef.formTitle; //数据中存表单标题
      formData.state = formData.state || 1; //补状态字段 1:完成 -1:删除

      let currentNode = this.activeTab.detail.name;
      let exts = currentNode.exts || {};
      let formList = exts.formList || [];
      // 新建表单插入数据，修改表单更新数据
      let formIds = [];
      formList.map(item => {
        formIds.push(item._id);
        if (item._id == formData._id) item = formData;
      });
      if (formIds.indexOf(formData._id) == -1) formList.push(formData);
      exts.formList = formList;

      common.osg.ajax(
        `/workflowNode/updateExts/${currentNode._id}`,
        exts,
        res => {
          // 重复提交表单只处理一次工作流
          if (this.activeTab.detail.name.state == 0) {
            this.process(formData._id);
          } else {
            this.getForms();
          }
        },
        {
          header: {
            'Content-Type': 'application/json'
          },
          noload: true
        }
      );
    },
    // 获取多表单节点的表单
    getForms() {
      let currentNode = this.activeTab.detail.name;
      console.log('当前节点');
      console.log(currentNode);
      currentNode.exts = currentNode.exts || {};
      this.formList = currentNode.exts.formList || [];
      console.log('当前节点关联表单：');
      console.log(this.formList);
    },
    // 获取统一表单多条数据
    getFormList() {
      let currentNode = this.activeTab.detail.name;
      console.log('当前节点', currentNode);
      common.osg.ajax(
        'biz/extForm/query/' + currentNode.nodeDef.formDefId,
        {
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:workflowId|string#and': currentNode.workflowId
        },
        res => {
          this.formList = res.data;
        },
        {
          noload: true
        }
      );
    },
    // 删除表单
    removeForm(form) {
      common.osg.confirm('是否确认删除' + form.formTitle, () => {
        // 修改状态
        let currentNode = this.activeTab.detail.name;
        currentNode.exts = currentNode.exts || {};
        let formList = currentNode.exts.formList || [];
        let newFormList = [];
        // 修改node.exts内表单状态
        for (let item of formList) {
          if (item._id == form._id) {
            item.state = -1;
            this.saveNodeExts(form);
            this.getForms();
            common.osg.toast('删除成功');
            break;
          }
        }
        //更新表单状态
        form.state = -1;
        common.osg.ajax(
          `biz/extForm/upsert/${form.formDefId}`,
          {
            dataStr: JSON.stringify(form)
          },
          res => {},
          {
            noload: true
          }
        );
      });
    },
    // 视频全屏播放
    openVideo(e) {
      this.video.url = e.target.dataset.url;
      this.video.show = true;
    },
    // 关闭视频播放
    closeVideo() {
      this.video.url = '';
      this.video.show = false;
    },
    //合同按钮折叠change
    contractCollapse(event) {
      this.activeNames = event.detail;
    },
    // 发送报价单给业主
    sendQuotation(orderId) {
      common.osg.ajax('/basic/order/sendMessage', { orderId }, res => {
        common.osg.toast('发送成功', 'none');
      });
    },
    // 发送材料交割单给业主
    sendDeliveryOrder(orderId) {
      common.osg.ajax(
        '~' + common.osg.host + '/fsgo/i/deliveryOrder/sendMessage.do',
        { orderId },
        res => {
          common.osg.toast('发送成功', 'none');
        }
      );
    },
    // 查看材料交割单
    openDeliveryOrder(orderId) {
      common.osg.open('../webView/webView', {
        href: `${common.osg.host}/h5/#/subpackages/order/deliveryOrder?orderId=${orderId}&tenantId=1340835581184723420`
      });
    },
    // 复制到剪切板
    copy(data) {
      wx.setClipboardData({
        data: data,
        success(res) {
          wx.getClipboardData({
            success(res) {
              console.log(res.data); // data
            }
          });
        }
      });
    },
    // 字段展示类型
    showType(field, formData) {
      return common.osg.showType(field, formData, this.roleId);
    }
  }
};
</script>
<style>
.serviceAppointment .van-cell__title {
  width: 115px !important;
  max-width: 115px !important;
  min-width: 115px !important;
  margin-right: 5px !important;
  flex: none !important;
}

.serviceAppointment .van-cell__value {
  text-align: left !important;
}

.serviceAppointment .van-cell__value .van-field__control {
  text-align: left;
}

.serviceAppointment .c-radio-group,
.c-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  float: left;
}

.hidden {
  display: none;
}

.quicklyFill-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  margin-top: 10rpx;
}

.countdown .van-dialog__footer .van-dialog__button:last-child {
  pointer-events: none;
}

.placeorder-tabs-card {
  padding-bottom: 120rpx;
}
.placeorder-tabs-card .placeorder-tabs-wrap {
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
}

.placeorder-tabs-card .van-tabs__scroll--card {
  margin: 0 11px !important;
}

/* 原因上拉菜单 */
.reason-radio {
  padding: 10rpx 0;
}

.reason-sheet .van-icon-close {
  display: none;
}

/* 示例图片 */
.cell-wrapper-p14 {
  background-color: #fff;
  padding: 20rpx 14rpx;
}

.image-sample {
  display: flex;
}
</style>
