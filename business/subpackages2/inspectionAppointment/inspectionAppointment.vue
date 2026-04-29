<template>
  <view class="inspectionAppointment c-box" :class="openForm ? 'c-hidden c-h-50rpx' : ''">
    <!-- 摘要信息 -->
    <view class="c-card c-m-b-0">
      <view class="c-card-title">
        <view class="c-card-tag" @click="copy(SAFormData.code)">
          <view class="c-card-tag-title c-bg-green">巡检</view>
          <view class="c-card-tag-info c-green c-border-green">
            <text>{{ SAFormData.code || '' }}</text>
            <text class="c-size-13 c-weight-normar">丨复制</text>
          </view>
        </view>
        <view class="c-red">
          {{ codelabel('select', 'status', SAFormData.status, opts.status) || '' }}
        </view>
        <!-- 当工单状态为104“待联系”、105“待预约”时，支持将工单状态修改为“暂时不需要上门”（200）。 -->
        <!-- 当工单状态为203“待下单”、206“待签约”、205“待支付首付款”时，支持将工单状态修改为“上门未成交”（204）。 -->
        <!-- <van-button
			  v-if="['104', '105', '203', '206', '205'].indexOf(SAFormData.status) != -1"
			  @click="changeStatus.statusShow = true"
			  icon="edit"
			  size="mini"
			  custom-style="display:flex"
			  custom-class="c-m-l-10"
			>
			  修改
			</van-button> -->
        <!-- 修改工单状态 -->
        <!-- <van-action-sheet
			  :show="changeStatus.statusShow"
			  :actions="
				SAFormData.status == '104' || SAFormData.status == '105'
				  ? [{ name: '暂时不需要上门', value: '200' }]
				  : [{ name: '上门未成交', value: '204' }]
			  "
			  cancel-text="取消"
			  @cancel="changeStatus.statusShow = false"
			  @select="statusSelect"
			/> -->
      </view>
      <view class="c-card-content">
        <view class="c-card-content-item">
          <view class="c-card-content-item-label">客户名称：</view>
          <view>{{ SAFormData.name || '' }}</view>
        </view>
        <view
          class="c-card-content-item"
          v-if="SAFormData.phone"
          @click="makeCall(SAFormData.phone)"
        >
          <view class="c-card-content-item-label">客户电话：</view>
          <view>
            {{ SAFormData.phone || '' }}
            <van-icon
              name="phone"
              style="display: inline; color: #106cff; margin-left: 10px"
            ></van-icon>
          </view>
        </view>
        <view class="c-card-content-item">
          <view class="c-card-content-item-label">详细地址：</view>
          <view>{{ SAFormData.address || '' }}</view>
        </view>
        <view class="c-card-content-item">
          <view class="c-card-content-item-label">建单时间：</view>
          <view>{{ SAFormData.createTime || '' }}</view>
        </view>
      </view>
      <!-- <swiper
          v-if="Number(SAFormData.status) > 103"
          class="actions-swiper"
          :indicator-dots="true"
          indicator-active-color="#106cff"
          indicator-spacing="0"
          indicator-radius="8"
      >
        <swiper-item>
          <view class="c-card-quick-actions">
            <view
                class="quick-actions"
                v-if="SAFormData.phone"
                @click="
                makeCall(SAFormData.phone);
                md({ act: 'SAOperation_call' });
              "
            >
              <view class="quick-actions-icon">
                <van-icon name="phone-o" />
              </view>
              <text>联系客户</text>
            </view>
            <view
                class="quick-actions"
                v-else
                @click="
                call(
                  '1',
                  null,
                  SAFormData.contactIds && SAFormData.contactIds[0] ? SAFormData.contactIds[0] : '',
                  SAFormData._id
                );
                md({ act: 'SAOperation_call' });
              "
            >
              <view class="quick-actions-icon">
                <van-icon name="phone-o" />
              </view>
              <text>联系客户</text>
            </view>
            <view
                class="quick-actions"
                @click="
                md({ act: 'SAOperation_tag' });
                doOpen('/subpackages/tag/tag', {
                  target: 'inspectionAppointment',
                  id: SAFormData._id
                });
              "
            >
              <view class="quick-actions-icon">
                <van-icon name="label-o" />
              </view>
              <text>客户标签</text>
            </view>
            <view
                class="quick-actions"
                @click="
                openRemark();
                md({ act: 'SAOperation_remark' });
              "
            >
              <view class="quick-actions-icon">
                <van-icon name="edit" />
              </view>
              <text>编辑备注</text>
            </view>
            <view
                class="quick-actions"
                @click="
                recordsShow();
                md({ act: 'SAOperation_followUpRecords' });
              "
            >
              <view class="quick-actions-icon">
                <van-icon name="records-o" />
              </view>
              <text>跟进记录</text>
            </view>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="c-card-quick-actions">
            <view
                class="quick-actions"
                @click="
                md({ act: 'SAOperation_photo' });
                photograph();
              "
            >
              <view class="quick-actions-icon">
                <van-icon name="photograph" />
              </view>
              <text>工单拍照</text>
            </view>
            <view
                class="quick-actions"
                @click="
                md({ act: 'SAOperation_addContacts' });
                doOpen('/subpackages/serviceAppointment/addContacts', { id: id });
              "
            >
              <view class="quick-actions-icon">
                <van-icon name="friends-o" />
              </view>
              <text>附加联系人</text>
            </view>
            <view
                class="quick-actions"
                @click="
                QRcordShow = true;
                md({ act: 'SAOperation_shareToC' });
              "
            >
              <view class="quick-actions-icon">
                <van-icon name="miniprogram-o" />
              </view>
              <text>客户分享</text>
            </view>
            <view
                v-if="SAFormData.status >= 302"
                class="quick-actions"
                @click="JumpConstructionLog"
            >
              <view class="quick-actions-icon">
                <van-icon name="miniprogram-o" />
              </view>
              <text>施工日志</text>
            </view>
          </view>
        </swiper-item>
      </swiper> -->
    </view>
    <!-- tab标签页 -->
    <view>
      <van-tabs
        v-if="nodesShow"
        :active="activeTab.detail && activeTab.detail.name"
        swipeable
        sticky
        animated
        lazy-render="false"
        @change="tabChange"
        custom-class="c-h-1"
        :ellipsis="false"
        ref="tabs"
        color="#106cff"
        title-active-color="#106cff"
        title-inactive-color="#323232"
        tab-class="c-bg-default"
        nav-class="c-bg-default"
        wrap-class="c-line-bottom"
        :z-index="0"
      >
        <!-- 渲染工作流节点 -->
        <block v-for="(node, index) in nodes" :key="index">
          <block>
            <!-- 节点 下单(订单合同) -->
            <van-tab
              v-if="node.nodeDef && node.nodeDef.nodeType == 'placeOrder'"
              :title="node.nodeDef && node.nodeDef.name"
              :name="node"
            >
              <van-tabs
                ref="placeOrder"
                @change="placeOrderTabChange"
                :active="placeOrderPage.active"
                custom-class="placeorder-tabs-card"
                wrap-class="placeorder-tabs-wrap"
                color="#106cff"
                title-active-color="#106cff"
                title-inactive-color="#000000"
                tab-class="c-bg-default"
              >
                <van-tab title="订单" name="order">
                  <view
                    class="c-card c-relative"
                    v-for="(item, i) in order.data"
                    :key="i"
                    @click="toOrder(item._id)"
                  >
                    <view class="c-card-title c-weight-normal">
                      <view @click.native.stop="copy(item._id)">
                        <text>{{ item._id || '' }}</text>
                        <text>丨复制</text>
                      </view>
                      <text class="c-red">
                        <!-- //processState 订单进展状态 0:未开工（待签约）;1:待开工;2:已开工（待完工）;3:已完工 -->
                        {{ item.state == '1' ? '有效' : '无效' }}·{{
                          commonEvent('codelabel', null, {
                            option: 'processState',
                            value: item.processState
                          })
                        }}
                      </text>
                    </view>
                    <view class="c-card-content">
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label" style="min-width: 80px">
                          委托方：
                        </view>
                        <view>
                          {{ item.exts.companyName || item.exts.clientname || item.ownerName }}
                        </view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label" style="min-width: 80px">
                          手机号：
                        </view>
                        <view>
                          {{
                            item.exts.agentPhone ||
                            item.exts.telphone ||
                            (item.ownerPhone &&
                              String(
                                item.exts.agentPhone || item.exts.telphone || item.ownerPhone
                              ).replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')) ||
                            ''
                          }}
                        </view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label">产品总额：</view>
                        <view>¥ {{ item.originPrice || 0 }}</view>
                      </view>
                      <view
                        v-if="
                          amountToFixed(
                            item.originPrice - amountToFixed(item.originPrice * item.discount)
                          )
                        "
                        class="c-card-content-item"
                      >
                        <view class="c-card-content-item-label">折扣金额：</view>
                        <view>
                          - ¥{{
                            amountToFixed(
                              item.originPrice - amountToFixed(item.originPrice * item.discount)
                            ) || 0
                          }}
                        </view>
                      </view>
                      <view v-if="item.preferentialAmount" class="c-card-content-item">
                        <view class="c-card-content-item-label">优惠金额：</view>
                        <view>- ¥ {{ item.preferentialAmount }}</view>
                      </view>
                      <view v-if="item.exts && item.exts.couponsVal" class="c-card-content-item">
                        <view class="c-card-content-item-label">活动优惠金额：</view>
                        <view>- ¥ {{ item.exts.couponsVal }}</view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label">实际金额：</view>
                        <view class="c-red">¥ {{ item.totalPrice }}</view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label">实付金额：</view>
                        <view class="c-red">¥ {{ item.paidAmount || 0 }}</view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label">下单时间：</view>
                        <view>{{ item.createTime }}</view>
                      </view>
                    </view>
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
                    <view class="c-card-footer">
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
                        v-if="item.exts.bjdPDFurl"
                        size="small"
                        round
                        plain
                        :data-filename="item.exts.bjdPDFurl"
                        custom-class="c-m-l-20"
                        @click.native.stop="download"
                      >
                        查看报价单
                      </van-button>
                      <van-button
                        v-if="item.exts.bjdPDFurl"
                        size="small"
                        round
                        plain
                        custom-class="c-m-l-20"
                        @click.native.stop="copy(item.exts.bjdPDFurl)"
                      >
                        复制链接
                      </van-button>
                      <van-button
                        v-if="item.exts.warrentyYearPDFurl"
                        size="small"
                        round
                        plain
                        :data-filename="item.exts.warrentyYearPDFurl"
                        custom-class="c-m-l-20"
                        @click.native.stop="download"
                      >
                        查看质保年限
                      </van-button>
                    </view>
                    <view
                      v-if="
                        [-1, 1, 2, 3].indexOf(item.processState) != -1 ||
                        (item.type == '1' &&
                          (item.exts.deliveryOrderState == '0' ||
                            item.exts.deliveryOrderState == '1')) ||
                        item.exts.contractType == '7' ||
                        (item.type == '0' && placeOrderBtn) ||
                        (item.type == '1' && item.processState == '0') ||
                        (item.type == 1 &&
                          (item.exts.isAgain == 1 || !item.contractId) &&
                          (item.processState == '0' || item.processState == '4') &&
                          !item.exts.confirm)
                      "
                      class="c-card-footer c-m-t-20"
                    >
                      <!-- <van-button
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
                      </van-button> -->

                      <!-- 支付首付款与支付尾款按钮：合同类型为签署成功1的展示，其余的不展示。 -->
                      <van-button
                        v-if="
                          isHandler &&
                          item.workflowNodeList[item.workflowNodeList.length - 1] &&
                          item.workflowNodeList[item.workflowNodeList.length - 1].nodeDef &&
                          item.workflowNodeList[item.workflowNodeList.length - 1].nodeDef
                            .nodeType == 'pay' &&
                          item.payState != 1 &&
                          item.workflowNodeList[item.workflowNodeList.length - 1].state != -1
                        "
                        type="info"
                        size="small"
                        round
                        custom-class="c-m-l-20"
                        @click.native.stop="paymentLimitOpen(item)"
                      >
                        <!-- {{ item.payState == 2 ? '支付尾款':'支付首付款'}} -->
                        {{ item.workflowNodeList[item.workflowNodeList.length - 1].nodeDef.name }}
                      </van-button>

                      <!-- <van-button
                        v-if="item.type == '0' && placeOrderBtn"
                        custom-style="margin-left:5px;"
                        type="info"
                        size="small"
                        round
                        plain
                        @click.native.stop="turnOrder(item)"
                      >
                        转为订单
                      </van-button> -->
                      <van-button
                        v-if="
                          item.type == 1 &&
                          (item.exts.isAgain == 1 || !item.contractId) &&
                          (item.processState == '0' || item.processState == '4') &&
                          !item.exts.confirm &&
                          isHandler
                        "
                        size="small"
                        round
                        plain
                        custom-class="c-m-l-20"
                        @click.native.stop="openEditOrder(1, item)"
                      >
                        编辑
                      </van-button>
                      <!--  && item.exts.confirm == '1' 业主确认报价单后才允许签约 -->
                      <block v-if="item.type == '1' && item.processState == '0'">
                        <!-- v-if="item.exts.contractStatus < 1" -->
                        <van-button
                          v-if="item.exts.isAgain != 1 && isHandler"
                          type="info"
                          size="small"
                          round
                          custom-class="c-m-l-20"
                          @click.native.stop="signClick(item, 1)"
                        >
                          线下签约
                        </van-button>
                        <!-- 4.27修改信息来源 3自有单、4修链平台单 的时候不展示电子签约 -->
                        <van-button
                          v-if="item.exts.isAgain != 1 && isHandler"
                          type="info"
                          size="small"
                          round
                          custom-class="c-m-l-20"
                          @click.native.stop="signClick(item)"
                        >
                          电子签约
                        </van-button>
                      </block>
                    </view>
                  </view>
                </van-tab>
                <van-tab title="合同" name="contract">
                  <view class="c-card c-relative" v-for="(item, i) in contract.data" :key="i">
                    <view class="c-card-title c-weight-normal">
                      <view @click.native.stop="copy(item.contractdocNum)">
                        <text>{{ item.contractdocNum || '' }}</text>
                        <text>丨复制</text>
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
                    <view class="c-card-content">
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label" style="min-width: 80px">
                          委托方：
                        </view>

                        <view>
                          {{ item.contactsName || item.client || '' }}
                        </view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label" style="min-width: 80px">
                          手机号：
                        </view>
                        <view>
                          {{
                            (item.contactsPhone &&
                              String(item.contactsPhone).replace(
                                /^(\d{3})\d{4}(\d{4})$/,
                                '$1****$2'
                              )) ||
                            ''
                          }}
                        </view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label">合同类型：</view>
                        <view>
                          {{
                            commonEvent('codelabel', null, {
                              option: 'contractType',
                              value: item.contractType
                            })
                          }}
                        </view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label">合同金额：</view>
                        <view>¥ {{ item.adjustRefundMoney }}（增减项后的）</view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label">登记时间：</view>
                        <view>{{ item.createTime }}</view>
                      </view>
                      <view class="c-card-content-item">
                        <view class="c-card-content-item-label">签约时间：</view>
                        <view>{{ item.signedDate || '' }}</view>
                      </view>
                      <view v-if="item.examinStatus !== undefined" class="c-card-content-item">
                        <view class="c-card-content-item-label">审核状态：</view>
                        <view>
                          {{
                            commonEvent('codelabel', null, {
                              option: 'examinStatus',
                              value: item.examinStatus
                            })
                          }}
                        </view>
                      </view>
                    </view>
                    <!-- supplementTreatyStatus 合同协议状态不等于0，0：待签约  -->
                    <!-- singleSupplementTreatyStatus 补充协议状态不等于0，0：待签约  -->
                    <!-- contractRefundStatus 合同退款状态不等于0，0：退全款  -->
                    <!-- contractStatus 合同状态等于10，10：签署成功，-2：已作废 -->
                    <!-- payState 支付状态，0：未支付，1：已付清，2/3：部分支付 -->
                    <!-- <van-collapse
                        :value="activeNames"
                        style="width: 100%"
                        @change="contractCollapse"

                      >
                        <van-collapse-item title="更改合同操作" :name="item._id">

                        </van-collapse-item>
                      </van-collapse> -->
                    <view
                      v-if="
                        item.state == 1 &&
                        item.exts.supplementTreatyStatus !== 0 &&
                        item.exts.singleSupplementTreatyStatus !== 0 &&
                        item.exts.contractRefundStatus !== 0 &&
                        (item.exts.contractStatus == '10' || item.exts.contractStatus == '-2')
                      "
                      class="c-card-footer"
                    >
                      <!-- contractStatus 合同状态 10:签署成功 -->
                      <!-- proportion 是否需要付款(需要付款比例)，值：0~1 -->
                      <!-- payState 支付状态，0：未支付，1：已付清，2/3：部分支付 -->
                      <!-- 需要付款时：已付款才展示增减项；不需要付款时，付没付都展示增减项。 -->
                      <block
                        v-if="item.exts.contractStatus == '10' && item.proportion > 0 && isHandler"
                      >
                        <van-button
                          round
                          plain
                          type="default"
                          size="small"
                          icon="minus"
                          @click="openContractExt(2, item, 'contractDeductionForm')"
                        >
                          减项
                        </van-button>
                        <!-- settleMark 合同结算标记，1：已结算，2：已结算需退款 -->
                        <van-button
                          round
                          plain
                          type="default"
                          size="small"
                          icon="plus"
                          custom-class="c-m-l-20"
                          @click="openContractExt(1, item, 'contractAddForm')"
                          v-if="item.exts.settleMark != '1' && item.exts.settleMark != '2'"
                        >
                          增项
                        </van-button>
                      </block>
                      <!-- 需要付款时：已付款，且合同状态为签署成功10，才展示退款 -->
                      <!-- 不需要付款时：合同没有付款，合同状态为已作废-2，才展示退款 -->
                      <!-- 不需要付款时：合同已付款，合同状态为10或-2，才展示退款 -->
                      <van-button
                        v-if="
                          (item.proportion
                            ? item.payState > 0 && item.exts.contractStatus == '10'
                            : !item.payState
                            ? item.exts.contractStatus == '-2'
                            : true) && isHandler
                        "
                        round
                        plain
                        type="default"
                        size="small"
                        icon="refund-o"
                        custom-class="c-m-l-20"
                        @click="openContractExt(3, item, 'refundApplication')"
                      >
                        退款
                      </van-button>
                      <!-- 合同类型不等于1，且合同状态为签署成功10才展示 -->
                      <van-button
                        v-if="item.exts.contractStatus == '10' && isHandler"
                        round
                        plain
                        type="default"
                        size="small"
                        custom-class="c-m-l-20"
                        @click="openContractExt(6, item, 'singleSupplementTreaty')"
                      >
                        <view class="c-flex c-flex-center">补充协议</view>
                      </van-button>
                    </view>
                    <view class="c-card-footer c-m-t-20">
                      <!-- 合同状态 不是已经刷新 -->
                      <van-button
                        v-if="checkContractStatus(item)"
                        round
                        size="small"
                        @click="contractStatusRefresh(item._id)"
                      >
                        刷新合同状态
                      </van-button>

                      <van-button
                        round
                        size="small"
                        @click="cancelContract(item)"
                        custom-class="c-m-l-20"
                        v-if="
                          item.state == '1' &&
                          !item.endDate &&
                          (item.exts.contractStatus == '10' || item.exts.contractStatus == '2') &&
                          isHandler
                        "
                      >
                        取消合同
                      </van-button>
                      <van-button
                        round
                        size="small"
                        @click="signAgain(item._id)"
                        v-if="item.exts.contractStatus == '-3' && isHandler"
                        custom-class="c-m-l-20"
                      >
                        再次签约
                      </van-button>
                      <van-button
                        round
                        size="small"
                        @click="sendAgain(item._id)"
                        v-if="item.exts.contractStatus == '2' && isHandler"
                        custom-class="c-m-l-20"
                      >
                        再次发送契约锁短信
                      </van-button>
                      <!-- workType 签约方式 1:无 2:电子 3:线下-->
                      <!-- contractStatus 合同状态 2:签约中 -->
                      <van-button
                        round
                        size="small"
                        @click="getSignatureUrl(item._id)"
                        v-if="
                          (item.exts.workType == '1' || item.exts.workType == '2') &&
                          item.exts.contractStatus == '2' &&
                          isHandler
                        "
                        custom-class="c-m-l-20"
                      >
                        签约二维码
                      </van-button>
                      <van-button
                        round
                        size="small"
                        @click="download"
                        :data-filename="item.qiniuUrls[item.qiniuUrls.length - 1]"
                        v-if="item.qiniuUrls && item.qiniuUrls[item.qiniuUrls.length - 1]"
                        custom-class="c-m-l-20"
                      >
                        查看合同
                      </van-button>
                      <van-button
                        round
                        plain
                        type="default"
                        size="small"
                        custom-class="c-m-l-20"
                        @click="openContractExt(4, item, 'appendix')"
                      >
                        <view class="c-flex c-flex-center">合同附件</view>
                      </van-button>
                    </view>
                  </view>
                </van-tab>
              </van-tabs>
            </van-tab>
            <!-- 节点 关联子流程列表 -->
            <van-tab
              v-else-if="node.nodeDef && node.nodeDef.nodeType == 'subflows'"
              :title="node.nodeDef && node.nodeDef.name"
              :name="node"
            >
              <view style="padding-bottom: 140rpx">
                <block v-for="(subflow, index1) in subflows" :key="index1">
                  <view v-if="subflow.state != '-1'" class="c-card">
                    <view class="c-card-title">
                      <view class="c-nowrap">
                        {{ subflow.title }}
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
                      <view @click="copy(subflow.formDataId)">
                        订单编号：{{ subflow.formDataId }}
                      </view>
                      <view>添加时间：{{ subflow.createTime }}</view>
                    </view>
                    <view class="c-card-footer">
                      <van-button
                        :data-subflow="subflow"
                        type="info"
                        :icon="subflow && subflow.state == 0 ? 'edit' : ''"
                        round
                        size="small"
                        custom-class="c-m-l-20"
                        @click="getSubWorkflow(subflow.defId, subflow._id)"
                      >
                        {{ subflow && subflow.state == 0 ? '编辑' : '查看' }}
                      </van-button>
                    </view>
                  </view>
                </block>
              </view>
            </van-tab>
            <!-- 节点关联多个表单 -->
            <van-tab
              v-else-if="node.nodeDef && node.nodeDef.nodeType == 'forms'"
              :title="node.nodeDef && node.nodeDef.name"
              :name="node"
            >
              <view style="padding-bottom: 140rpx">
                <view v-for="(form, index2) in formList" :key="index2" class="c-card">
                  <view class="c-card-title c-flex c-flex-between">
                    <view class="c-nowrap">
                      {{ form.formTitle }}
                    </view>
                    <view class="c-red c-nowrap">
                      {{ form.state == -1 ? '已删除' : '已完成' }}
                    </view>
                  </view>
                  <view class="c-card-content">创建时间：{{ form.createTime }}</view>
                  <view class="c-card-footer">
                    <van-button
                      v-if="form.state != -1"
                      @click="removeForm(form)"
                      round
                      size="small"
                      icon="delete-o"
                    >
                      删除
                    </van-button>
                    <van-button
                      @click="viewAddForm(form.formDefId, form.formTitle, form._id, form)"
                      round
                      type="info"
                      size="small"
                      icon="edit"
                      custom-class="c-m-l-20"
                    >
                      查看
                    </van-button>
                  </view>
                </view>
              </view>
            </van-tab>
            <!-- 子流程 可重复提交类型节点 -->
            <van-tab
              v-else-if="node.nodeDef && node.nodeDef.nodeType == 'repeat'"
              :title="node.nodeDef && node.nodeDef.name"
              :name="node"
            >
              <view style="padding-bottom: 60px">
                <view
                  v-for="(form, index2) in formList"
                  :key="index2"
                  class="c-card"
                  style="padding-top: 10px"
                >
                  <view
                    v-if="
                      form.surveyNum &&
                      activeTab.detail.name &&
                      activeTab.detail.name.nodeDef &&
                      activeTab.detail.name.nodeDef.formDefId == '3807435364983262382'
                    "
                    class="c-card-title c-weight-normal"
                  >
                    <view @click.native.stop="copy(form.surveyNum)">
                      <text>{{ form.surveyNum || '' }}</text>
                      <text>丨复制</text>
                    </view>
                  </view>
                  <view v-else class="c-card-title c-weight-normal">
                    <view>
                      <van-icon custom-class="c-card-icon" name="description"></van-icon>
                      <text class="c-nowrap">{{ form._id }}</text>
                    </view>
                  </view>
                  <view class="c-card-content">
                    <view
                      v-if="
                        activeTab.detail &&
                        activeTab.detail.name &&
                        activeTab.detail.name.nodeDef &&
                        activeTab.detail.name.nodeDef.formDefId == '3807435364983262382'
                      "
                      class="c-card-content-item"
                    >
                      <view class="c-card-content-item-label">巡检部位：</view>
                      <view>
                        {{ codelabel('cascade', 'parts', form.part) || '' }}
                      </view>
                    </view>
                    <view class="c-card-content-item">
                      <view class="c-card-content-item-label">创建时间：</view>
                      <view>{{ form.createTime }}</view>
                    </view>
                    <view class="c-card-content-item">
                      <view class="c-card-content-item-label">更新时间：</view>
                      <view>{{ form.updateTime }}</view>
                    </view>
                  </view>
                  <view class="c-card-footer">
                    <van-button
                      style="margin-left: 10px"
                      v-if="
                        form.inspectionAppointmentUrl &&
                        (SAFormData.status == 501 || SAFormData.status == 502)
                      "
                      @click="download()"
                      round
                      type="default"
                      size="small"
                      :data-filename="form.inspectionAppointmentUrl"
                    >
                      查看报告
                    </van-button>
                    <van-button
                      style="margin-left: 10px"
                      v-if="
                        form.inspectionAppointmentUrl &&
                        (SAFormData.status == 501 || SAFormData.status == 502)
                      "
                      @click.native.stop="copy(form.inspectionAppointmentUrl)"
                      round
                      type="default"
                      size="small"
                      :data-filename="form.inspectionAppointmentUrl"
                      custom-class="c-m-l-20"
                    >
                      复制链接
                    </van-button>
                    <van-button
                      v-if="
                        SAFormData.status != 501 &&
                        SAFormData.status != 502 &&
                        SAFormData.status != 207
                      "
                      @click="
                        viewAddForm(
                          activeTab.detail.name.nodeDef.formDefId,
                          form.formTitle,
                          form._id,
                          form
                        )
                      "
                      round
                      plain
                      size="small"
                      type="info"
                      custom-class="c-m-l-20"
                    >
                      编辑
                    </van-button>
                    <van-button
                      v-if="SAFormData.status != 202"
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
                      custom-class="c-m-l-20"
                    >
                      查看
                    </van-button>
                    <van-button
                      style="margin-left: 10px"
                      v-if="false && (SAFormData.status == 501 || SAFormData.status == 502)"
                      @click="doChoosePic(SAFormData)"
                      round
                      type="default"
                      size="small"
                      :data-filename="form.inspectionAppointmentUrl"
                      custom-class="c-m-l-20"
                    >
                      分享海报
                    </van-button>
                  </view>
                  <van-progress
                    v-if="
                      activeTab.detail.name &&
                      activeTab.detail.name.nodeDef &&
                      activeTab.detail.name.nodeDef.formDefId == '3807435364983262382' &&
                      form.progressShow
                    "
                    :percentage="form.progress"
                    stroke-width="8"
                    custom-class="c-progress"
                  />
                </view>
              </view>
            </van-tab>
            <!-- 节点 关联表单 -->
            <van-tab v-else :title="node.nodeDef && node.nodeDef.name" :name="node">
              <van-cell-group :border="false" custom-class="c-tab-content">
                <block v-for="(extField, index2) in extFields" :key="index2">
                  <block v-if="showType(extField, formData)">
                    <block v-if="extField.type == 'select'">
                      <!-- 根据其他字段值展示，如“不需要上门原因” -->

                      <van-cell
                        :key="extField._id"
                        :title="extField.nameDisp"
                        :value="
                          commonEvent('codelabel', null, {
                            option: extField.valueOption,
                            value: formData[extField.name]
                          })
                        "
                      >
                        <van-tag
                          v-if="
                            extField.exts &&
                            extField.exts.replicable &&
                            commonEvent('codelabel', null, {
                              option: extField.valueOption,
                              value: formData[extField.name]
                            })
                          "
                          slot="right-icon"
                          plain
                          custom-class="tag-copy"
                          @click.native="
                            copy(
                              commonEvent('codelabel', null, {
                                option: extField.valueOption,
                                value: formData[extField.name]
                              })
                            )
                          "
                        >
                          复制
                        </van-tag>
                      </van-cell>
                    </block>
                    <block v-else-if="extField.type == 'bizSelect'">
                      <van-cell
                        :key="extField._id"
                        :title="extField.nameDisp"
                        :value="
                          commonEvent('codelabel', null, {
                            option: extField.name,
                            value: formData[extField.name]
                          })
                        "
                      >
                        <van-tag
                          v-if="
                            extField.exts &&
                            extField.exts.replicable &&
                            commonEvent('codelabel', null, {
                              option: extField.name,
                              value: formData[extField.name]
                            })
                          "
                          slot="right-icon"
                          plain
                          custom-class="tag-copy"
                          @click.native="
                            copy(
                              commonEvent('codelabel', null, {
                                option: extField.name,
                                value: formData[extField.name]
                              })
                            )
                          "
                        >
                          复制
                        </van-tag>
                      </van-cell>
                    </block>
                    <block v-else-if="extField.type == 'cascade'">
                      <van-cell
                        :key="extField._id"
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
                      >
                        <van-tag
                          v-if="
                            extField.exts &&
                            extField.exts.replicable &&
                            codelabel(
                              'cascade',
                              extField.valueOption,
                              formData[extField.name],
                              null,
                              extField.frontEndConfig
                            )
                          "
                          slot="right-icon"
                          plain
                          custom-class="tag-copy"
                          @click.native="
                            copy(
                              codelabel(
                                'cascade',
                                extField.valueOption,
                                formData[extField.name],
                                null,
                                extField.frontEndConfig
                              )
                            )
                          "
                        >
                          复制
                        </van-tag>
                      </van-cell>
                    </block>
                    <block v-else-if="extField.type == 'radio'">
                      <van-cell :key="extField._id" :title="extField.nameDisp">
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
                      <van-cell :key="extField._id" :title="extField.nameDisp">
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
                      <van-cell
                        :key="extField._id"
                        :title="extField.nameDisp"
                        class="c-cell-switch"
                      >
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
                      <van-cell :key="extField._id" :title="extField.nameDisp">
                        <van-rate :value="formData[extField.name]" readonly></van-rate>
                      </van-cell>
                    </block>
                    <block v-else-if="extField.type == 'file'">
                      <view class="c-cell-view c-flex c-flex-between c-p-b-0">
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
                      <view :key="extField._id" class="c-cell-view c-p-b-0">
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
                            extField.frontEndConfig && extField.frontEndConfig.uploadText
                              ? extField.frontEndConfig.uploadText
                              : ' '
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
                        :key="extField._id"
                        class="c-cell-headline"
                        v-html="
                          (extField.frontEndConfig && extField.frontEndConfig.html) ||
                          extField.nameDisp
                        "
                      ></view>
                    </block>
                    <block v-else-if="extField.type == 'gap'">
                      <view :key="extField._id" class="c-cell-gap">
                        {{ (extField.frontEndConfig && extField.frontEndConfig.html) || '' }}
                      </view>
                    </block>
                    <block v-else-if="extField.type == 'area'">
                      <!-- #ifdef MP-WEIXIN -->
                      <van-cell
                        :key="extField._id"
                        :title="extField.nameDisp"
                        :value="
                          area.areaList.province_list[formData[extField.name][0]] +
                          area.areaList.city_list[formData[extField.name][1]] +
                          area.areaList.county_list[formData[extField.name][2]]
                        "
                      >
                        <van-tag
                          v-if="
                            extField.exts &&
                            extField.exts.replicable &&
                            area.areaList.province_list[formData[extField.name][0]] +
                              area.areaList.city_list[formData[extField.name][1]] +
                              area.areaList.county_list[formData[extField.name][2]]
                          "
                          slot="right-icon"
                          plain
                          custom-class="tag-copy"
                          @click.native="
                            copy(
                              area.areaList.province_list[formData[extField.name][0]] +
                                area.areaList.city_list[formData[extField.name][1]] +
                                area.areaList.county_list[formData[extField.name][2]]
                            )
                          "
                        >
                          复制
                        </van-tag>
                      </van-cell>
                      <!-- #endif -->
                      <!-- #ifdef APP-PLUS -->
                      <van-cell
                        :key="extField._id"
                        :title="extField.nameDisp"
                        :value="
                          area.province_list[formData[extField.name][0]] +
                          area.city_list[formData[extField.name][1]] +
                          area.county_list[formData[extField.name][2]]
                        "
                      >
                        <van-tag
                          v-if="
                            extField.exts &&
                            extField.exts.replicable &&
                            area.province_list[formData[extField.name][0]] +
                              area.city_list[formData[extField.name][1]] +
                              area.county_list[formData[extField.name][2]]
                          "
                          slot="right-icon"
                          plain
                          custom-class="tag-copy"
                          @click.native="
                            copy(
                              area.province_list[formData[extField.name][0]] +
                                area.city_list[formData[extField.name][1]] +
                                area.county_list[formData[extField.name][2]]
                            )
                          "
                        >
                          复制
                        </van-tag>
                      </van-cell>
                      <!-- #endif -->
                    </block>
                    <block v-else-if="extField.type == 'button'">
                      <van-button
                        :key="extField._id"
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
                      <view
                        :key="extField._id"
                        class="c-flex c-flex-between c-item-center c-bg-white c-cell-view"
                      >
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
                      <view :key="extField._id + '1'" class="c-cell-view c-flex c-flex-between">
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
                      <view
                        :key="extField._id + '2'"
                        class="c-cell-view"
                        style="border-bottom: 1px solid #ebedf0"
                      >
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
                      <van-cell-group :key="extField._id">
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
                      <van-cell-group :key="extField._id" :border="false">
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
                      <view
                        :key="extField._id"
                        class="c-cell-view c-flex"
                        @click="onClick"
                        :data-extfield="extField"
                      >
                        <text
                          class="c-required"
                          v-if="
                            extField.required == '1' &&
                            currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                          "
                        >
                          *
                        </text>
                        <van-icon
                          custom-class="c-blue"
                          name="checked"
                          v-if="formData[extField.name]"
                        />
                        <rich-text :nodes="extField.frontEndConfig.text"></rich-text>
                      </view>
                    </block>
                    <block v-else-if="extField.type == 'canvas'">
                      <view class="canvas-view">
                        <view class="canvas-title" style="background-color: #f7f8fa">
                          {{ extField.nameDisp }}
                        </view>
                        <img
                          v-if="
                            formData._id &&
                            (extField.preset
                              ? formData[extField.name]
                              : formData.exts[extField.name])
                          "
                          :src="
                            extField.preset ? formData[extField.name] : formData.exts[extField.name]
                          "
                          :style="'width: 100%;height:' + canvas[extField.name].height + 'px'"
                        />
                      </view>
                    </block>
                    <block v-else-if="extField.type == 'bgImage'"></block>
                    <block v-else>
                      <!-- text number idcard digit textarea phone IDNumber date time datetime evaluate-->
                      <!-- #ifdef MP-WEIXIN -->
                      <van-cell
                        :key="extField._id"
                        :title="extField.nameDisp"
                        :value="formData[extField.name]"
                      >
                        <van-tag
                          v-if="
                            extField.exts && extField.exts.replicable && formData[extField.name]
                          "
                          slot="right-icon"
                          plain
                          custom-class="tag-copy"
                          @click.native="copy(formData[extField.name])"
                        >
                          复制
                        </van-tag>
                      </van-cell>
                      <!-- #endif -->
                      <!-- #ifdef APP-PLUS -->
                      <van-cell
                        v-if="extField.exts && extField.exts.replicable && formData[extField.name]"
                        :key="extField._id"
                        :title="extField.nameDisp"
                        :value="formData[extField.name] + ' 点击复制'"
                        @click.native="copy(formData[extField.name])"
                      ></van-cell>
                      <van-cell
                        v-if="extField.name != 'orderNum'"
                        :key="extField._id"
                        :title="extField.nameDisp"
                        :value="formData[extField.name]"
                      ></van-cell>
                      <!-- #endif -->
                    </block>
                  </block>
                </block>
              </van-cell-group>
            </van-tab>
          </block>
        </block>
        <van-tab title="动态" name="log">
          <!-- #ifdef MP-WEIXIN -->
          <van-collapse
            :value="log.collapse"
            @change="logCollapseChange"
            thumb="list"
            custom-class="collapse-type"
          >
            <van-collapse-item
              title="筛选类型"
              name="1"
              icon="list-switch"
              content-class="collapse-item-type"
              :value="formatLogType()"
            >
              <van-checkbox-group :value="log.type" @change="logTypeChange">
                <van-cell-group :border="false" custom-class="cell-group-log">
                  <block v-for="(myActionType, i) in log.myActionTypes" :key="i">
                    <van-cell
                      :title="myActionType.name"
                      :data-index="myActionType.type"
                      @click="logTypeClick"
                    >
                      <van-checkbox
                        :class="'logType-' + myActionType.type"
                        shape="square"
                        :name="myActionType.type"
                        @click.native.stop
                      />
                    </van-cell>
                  </block>
                </van-cell-group>
              </van-checkbox-group>
            </van-collapse-item>
          </van-collapse>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <uni-collapse
            :value="log.collapse"
            @change="logCollapseChange"
            custom-class="collapse-type"
          >
            <uni-collapse-item
              title="筛选类型"
              name="1"
              icon="list-switch"
              content-class="collapse-item-type"
              :border="false"
              title-border="none"
            >
              <uni-data-checkbox
                style="padding: 0 0 10px 10px"
                multiple
                :value="log.type"
                :localdata="log.myActionTypes"
                @change="logTypeChange"
              ></uni-data-checkbox>
            </uni-collapse-item>
          </uni-collapse>
          <!-- #endif -->
          <view style="height: calc(100% - 44px); overflow-y: auto">
            <block v-for="(item, index) in log.data" :key="index">
              <view
                v-if="log.type.length == 0 || log.type.indexOf(item.type) != -1"
                class="c-card"
                @click="JumplogDetails(item.type, item.typeId)"
              >
                <view class="c-card-title">
                  <view class="c-flex">
                    <van-icon
                      v-if="item.type == '1'"
                      name="edit"
                      size="20px"
                      class="c-blue c-m-r-10"
                    ></van-icon>
                    <van-icon
                      v-else-if="item.type == '2'"
                      name="description"
                      size="20px"
                      class="c-blue c-m-r-10"
                    ></van-icon>
                    <van-icon
                      v-else-if="item.type == '3'"
                      name="phone-circle"
                      size="20px"
                      class="c-blue c-m-r-10"
                    ></van-icon>
                    <van-icon
                      v-else-if="item.type == '4'"
                      name="notes"
                      size="20px"
                      class="c-blue c-m-r-10"
                    ></van-icon>
                    <van-icon
                      v-else-if="item.type == '5'"
                      name="map-marked"
                      size="20px"
                      class="c-blue c-m-r-10"
                    ></van-icon>
                    <van-icon v-else name="records" size="20px" class="c-blue c-m-r-10"></van-icon>
                    <text>{{ item.name }}</text>
                  </view>
                  <view v-if="item.type == '1' && item.taskTime">{{ item.taskTime }}</view>
                  <view
                    v-if="item.type == '3' && item.typeId && item.recordUrl"
                    class="c-blue c-weight-normal"
                    @click="
                      doOpen('./speechText', {
                        colId: item.typeId,
                        audioTitle: SAFormData.name + '的通话录音' + item.createTime,
                        recordUrl: item.recordUrl
                      })
                    "
                  >
                    录音文本
                  </view>
                </view>
                <view class="c-card-content" style="color: #646566">
                  <view v-if="item.type == '3' && item.recordUrl" class="c-flex c-item-center">
                    <van-icon
                      v-if="callRecord.recordUrl != item.recordUrl || callRecord.state != 'playing'"
                      name="play-circle"
                      class="call-button c-blue c-m-r-20"
                      size="40px"
                      @click="callPlay(item)"
                    />
                    <van-icon
                      v-else
                      name="pause-circle"
                      class="call-button c-blue c-m-r-20"
                      size="40px"
                      @click="callPause()"
                    />
                    <view
                      v-if="callRecord.recordUrl == item.recordUrl && callRecord.max"
                      class="audio-wrapper"
                    >
                      <van-slider
                        class="audio-slider"
                        block-size="16"
                        :value="callRecord.value"
                        :max="callRecord.max"
                        use-button-slot
                        active-color="#106cff"
                        @drag="callProgressDrag"
                        @change="callSeek"
                      >
                        <view class="slider-button" slot="button">
                          {{ callRecord.currentTime }}
                        </view>
                      </van-slider>
                      <view>{{ callRecord.endTime }}</view>
                    </view>
                  </view>
                  <text v-else>
                    {{ item.content || '' }}
                  </text>
                </view>
                <view class="c-log-footer">
                  <text>
                    {{ item.createUserName || '系统' }}
                  </text>
                  <text class="c-m-l-20">
                    {{ item.createTime }}
                  </text>
                </view>
              </view>
            </block>
          </view>
        </van-tab>
        <van-tab v-if="false" title="相册" name="album">
          <van-collapse
            :value="album.activeName"
            accordion
            custom-class="collapse-item-album"
            @change="albumLabelChange"
          >
            <van-collapse-item
              v-for="(label, i) in opts.albumLabel"
              :key="i"
              :title="label.name"
              :name="label.value"
              :border="false"
              content-class="collapse-item-content-album"
            >
              <!-- 有子标签 -->
              <block v-if="albumSubLabel[label.value]">
                <block v-for="(subLabel, j) in albumSubLabel[label.value]" :key="j">
                  <view
                    v-if="
                      album.data[label.value + '-' + subLabel.value] &&
                      album.data[label.value + '-' + subLabel.value].length > 0
                    "
                  >
                    <view class="album-subLabelName">{{ subLabel.name }}</view>
                    <view
                      class="photos"
                      :style="
                        systemInfo.platform == 'ios' ||
                        systemInfo.platform == 'android' ||
                        systemInfo.platform == 'devtools'
                          ? 'padding-bottom:0'
                          : ''
                      "
                    >
                      <view
                        v-for="(url, k) in album.data[label.value + '-' + subLabel.value]"
                        :key="k"
                        class="photo-view"
                      >
                        <!-- #ifdef MP-WEIXIN -->
                        <van-image
                          width="80"
                          height="80"
                          fit="cover"
                          class="image-view"
                          image-class="image-item"
                          :src="url"
                          :data-url="url"
                          @click="
                            previewPhoto($event, album.data[label.value + '-' + subLabel.value])
                          "
                        ></van-image>
                        <!-- #endif -->
                        <!-- #ifdef APP-PLUS -->
                        <image
                          style="
                            width: 100px;
                            height: 100px;
                            margin-bottom: 10px;
                            border-radius: 8px;
                          "
                          mode="aspectFill"
                          class="image-view image-item"
                          :src="url"
                          :data-url="url"
                          @click="
                            previewPhoto($event, album.data[label.value + '-' + subLabel.value])
                          "
                        ></image>
                        <!-- #endif -->
                        <van-icon
                          name="cross"
                          size="16px"
                          custom-class="image-delete"
                          :data-url="url"
                          @click="deletePhoto($event, label.value + '-' + subLabel.value, k)"
                        />
                      </view>
                    </view>
                  </view>
                </block>
                <view
                  v-if="labelPhotoCount(label.value, albumSubLabel[label.value]) == 0"
                  class="c-p-b-20 c-gray"
                >
                  没有照片
                </view>
              </block>
              <!-- 只有一级标签 如default -->
              <block v-else>
                <view v-if="album.data[label.value] && album.data[label.value].length > 0">
                  <view
                    class="photos c-p-t-0"
                    :style="
                      systemInfo.platform == 'ios' ||
                      systemInfo.platform == 'android' ||
                      systemInfo.platform == 'devtools'
                        ? 'padding-bottom:0'
                        : ''
                    "
                  >
                    <view v-for="(url, k) in album.data[label.value]" :key="k" class="photo-view">
                      <!-- #ifdef MP-WEIXIN -->
                      <van-image
                        width="100"
                        height="100"
                        fit="cover"
                        class="image-view"
                        image-class="image-item"
                        :src="url"
                        :data-url="url"
                        @click="previewPhoto($event, album.data[label.value])"
                      ></van-image>
                      <!-- #endif -->
                      <!-- #ifdef APP-PLUS -->
                      <image
                        style="width: 100px; height: 100px; margin-bottom: 10px; border-radius: 8px"
                        mode="aspectFill"
                        class="image-view image-item"
                        :src="url"
                        :data-url="url"
                        @click="previewPhoto($event, album.data[label.value])"
                      ></image>
                      <!-- #endif -->
                      <van-icon
                        name="cross"
                        size="16px"
                        custom-class="image-delete"
                        :data-url="url"
                        @click="deletePhoto($event, label.value, k)"
                      />
                    </view>
                  </view>
                </view>
                <view v-else class="c-p-b-20 c-gray">没有照片</view>
              </block>
            </van-collapse-item>
          </van-collapse>
        </van-tab>
        <van-tab v-if="false" title="档案" name="archives" icon="search">
          <view v-for="(item, i) in archivesData" :key="i">
            <view class="c-card">
              <view class="c-card-title c-weight-normal">
                <view @click="copy(item.id)">{{ item ? item.name : '' }}：{{ item.id || '' }}</view>
              </view>
              <view class="c-card-footer c-m-t-20" key="c-uni-button">
                <view v-if="item.surveyPDFUrl">
                  <van-button
                    plain
                    round
                    size="small"
                    icon="down"
                    :data-filename="item.surveyPDFUrl"
                    @click="saveFile"
                  >
                    下载文件
                  </van-button>
                  <van-button
                    plain
                    round
                    size="small"
                    icon="orders-o"
                    custom-class="c-m-l-20"
                    :data-filename="item.surveyPDFUrl"
                    @click="download"
                  >
                    查看文件
                  </van-button>
                  <van-button
                    plain
                    round
                    size="small"
                    icon="link-o"
                    custom-class="c-m-l-20"
                    @click.native.stop="copy(item.surveyPDFUrl)"
                  >
                    复制链接
                  </van-button>
                </view>
                <view v-if="item.qiniuUrl">
                  <van-button
                    size="small"
                    round
                    plain
                    icon="down"
                    @click="saveFile"
                    :data-filename="item.qiniuUrl"
                  >
                    下载文件
                  </van-button>
                  <van-button
                    size="small"
                    round
                    plain
                    icon="orders-o"
                    custom-class="c-m-l-20"
                    @click="download"
                    :data-filename="item.qiniuUrl"
                  >
                    查看文件
                  </van-button>
                  <van-button
                    size="small"
                    round
                    plain
                    icon="link-o"
                    custom-class="c-m-l-20"
                    @click.native.stop="copy(item.qiniuUrl)"
                  >
                    复制链接
                  </van-button>
                </view>
                <view v-if="item.bjdPDFurl" style="margin-bottom: 10px">
                  <van-button
                    size="small"
                    round
                    plain
                    icon="down"
                    @click="saveFile"
                    :data-filename="item.bjdPDFurl"
                  >
                    下载报价单
                  </van-button>
                  <van-button
                    size="small"
                    round
                    plain
                    icon="orders-o"
                    custom-class="c-m-l-20"
                    @click="download"
                    :data-filename="item.bjdPDFurl"
                  >
                    查看报价单
                  </van-button>
                  <van-button
                    size="small"
                    round
                    plain
                    icon="link-o"
                    custom-class="c-m-l-20"
                    @click.native.stop="copy(item.bjdPDFurl)"
                  >
                    复制链接
                  </van-button>
                </view>
                <view v-if="item.warrentyYearPDFurl">
                  <van-button
                    size="small"
                    round
                    plain
                    icon="down"
                    @click="saveFile"
                    :data-filename="item.warrentyYearPDFurl"
                  >
                    下载质保单
                  </van-button>
                  <van-button
                    size="small"
                    round
                    plain
                    icon="orders-o"
                    custom-class="c-m-l-20"
                    @click="download"
                    :data-filename="item.warrentyYearPDFurl"
                  >
                    查看质保单
                  </van-button>
                  <van-button
                    size="small"
                    round
                    plain
                    icon="link-o"
                    custom-class="c-m-l-20"
                    @click.native.stop="copy(item.warrentyYearPDFurl)"
                  >
                    复制链接
                  </van-button>
                </view>
              </view>
            </view>
          </view>
        </van-tab>
      </van-tabs>
    </view>

    <!-- 工作流底部按钮 撤回 回退 填表单 -->
    <view
      class="c-button-group-bottom"
      style="z-index: 2"
      v-if="
        takebackShow ||
        rollbackShow ||
        fabShow ||
        (activeTab &&
          activeTab.detail &&
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          (activeTab.detail.name.nodeDef.nodeType == 'subflows' ||
            activeTab.detail.name.nodeDef.nodeType == 'placeOrder' ||
            activeTab.detail.name.nodeDef.nodeType == 'forms' ||
            activeTab.detail.name.nodeDef.nodeType == 'repeat'))
      "
      key="c-button-group"
    >
      <!-- 撤回 -->
      <van-button
        v-if="takebackShow"
        plain
        icon="edit"
        block
        class="c-button-group-item c-m-r-10"
        @click="takebackWorkflow(activeTab.detail.name._id)"
      >
        修改
      </van-button>
      <!-- 回退 -->
      <van-button
        v-if="rollbackShow"
        plain
        icon="delete-o"
        block
        class="c-button-group-item c-m-r-20"
        @click="rollbackWorkflow(activeTab.detail.name._id)"
      >
        删除
      </van-button>
      <!-- 预约节点 当工单状态为104“待联系”、105“待预约”时，支持将工单状态修改为“暂时不需要上门”（200）。 -->
      <van-button
        v-if="
          activeTab.detail.name.nodeDef.formDefId == '2522989775781119510' &&
          activeTab.detail.name.state == 0 &&
          (SAFormData.status == '104' || SAFormData.status == '105')
        "
        plain
        icon="info-o"
        block
        class="c-button-group-item c-m-r-20"
        @click="statusSelect({ detail: { value: '200' } })"
      >
        暂不上门
      </van-button>
      <!-- 编辑表单 -->
      <van-button
        v-if="
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          activeTab.detail.name.nodeDef.nodeType != 'subflows' &&
          activeTab.detail.name.nodeDef.nodeType != 'forms' &&
          activeTab.detail.name.nodeDef.nodeType != 'placeOrder' &&
          activeTab.detail.name.nodeDef.nodeType != 'repeat' &&
          fabShow
        "
        type="info"
        icon="edit"
        block
        class="c-button-group-item"
        @click="getTemporaryForm"
      >
        填{{ activeTab.detail.name.nodeDef && activeTab.detail.name.nodeDef.name }}单
      </van-button>
      <!-- 预约节点 -->
      <van-button
        v-if="
          activeTab.detail.name.nodeDef.formDefId == '2522989775781119510' &&
          activeTab.detail.name.state == 10 &&
          formData.need == '1'
        "
        plain
        icon="calendar-o"
        block
        class="c-button-group-item c-m-l-10"
        @click="addPhoneCalendar"
      >
        添加日程提醒
      </van-button>
      <!-- 关联多表单 新增表单 -->
      <van-button
        v-if="
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          activeTab.detail.name.nodeDef.nodeType == 'forms' &&
          addFormBtn
        "
        type="info"
        icon="add"
        block
        class="c-button-group-item"
        @click="addForm"
      >
        新增{{ activeTab.detail.name.nodeDef && activeTab.detail.name.nodeDef.name }}单
      </van-button>
      <!-- 重复提交表单 新增表单 -->
      <van-button
        v-if="
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          activeTab.detail.name.nodeDef.nodeType == 'repeat' &&
          newFormBtn
        "
        type="info"
        icon="add"
        block
        class="c-button-group-item"
        @click="newForm"
      >
        新增{{ activeTab.detail.name.nodeDef && activeTab.detail.name.nodeDef.name }}单
      </van-button>
      <!-- 完成表单 -->
      <block
        v-if="
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          (activeTab.detail.name.nodeDef.nodeType == 'repeat' ||
            activeTab.detail.name.nodeDef.nodeType == 'forms') &&
          formList.length > 0 &&
          activeTab.detail.name.state == 0
        "
      >
        <van-button
          type="info"
          :icon="
            activeTab.detail.name &&
            activeTab.detail.name.nodeDef &&
            activeTab.detail.name.nodeDef.formDefId == '7971040108398070730'
              ? 'cart'
              : 'checked'
          "
          block
          class="c-button-group-item c-m-l-20"
          @click="process('complate')"
        >
          <text
            v-if="
              activeTab.detail.name &&
              activeTab.detail.name.nodeDef &&
              activeTab.detail.name.nodeDef.formDefId == '7971040108398070730'
            "
          >
            去下单
          </text>
          <text v-else>完成</text>
        </van-button>
      </block>
      <!-- 下单节点 -->
      <!-- 当工单状态为203“待下单”、206“待签约”、205“待支付首付款”时，支持将工单状态修改为“上门未成交”（204）。 -->
      <van-button
        v-show="
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          activeTab.detail.name.nodeDef.nodeType == 'placeOrder' &&
          (SAFormData.status == '203' || SAFormData.status == '206' || SAFormData.status == '205')
        "
        key="204"
        plain
        icon="close"
        block
        class="c-button-group-item c-m-r-20"
        @click="statusSelect({ detail: { value: '204' } })"
      >
        上门未成交
      </van-button>
      <van-button
        v-show="
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          activeTab.detail.name.nodeDef.nodeType == 'placeOrder' &&
          placeOrderBtn &&
          isHandler
        "
        key="placeOrder"
        type="info"
        icon="cart"
        block
        class="c-button-group-item"
        @click="placeOrder"
      >
        下单
      </van-button>
      <!-- 新增服务项 -->
      <van-button
        v-if="
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          activeTab.detail.name.nodeDef.nodeType == 'subflows' &&
          activeTab.detail.name.nodeDef.addProductShow == '1' &&
          SAFormData.serviceType != '30'
        "
        type="info"
        icon="add"
        block
        class="c-button-group-item"
        @click="addProduct"
      >
        新增服务
      </van-button>
      <!-- 新增验收 -->
      <van-button
        v-if="
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          activeTab.detail.name.nodeDef.nodeType == 'subflows' &&
          activeTab.detail.name.nodeDef.addProductShow == '1' &&
          SAFormData.serviceType == '30' &&
          activeTab.detail.name.state != 10
        "
        type="info"
        icon="add"
        block
        class="c-button-group-item"
        @click="
          addSubWorkflow(
            null,
            activeTab.detail.name &&
              activeTab.detail.name.nodeDef &&
              activeTab.detail.name.nodeDef.nodeTypeDef
          )
        "
      >
        新增验收
      </van-button>
      <!-- 完成该节点 -->
      <van-button
        v-if="
          activeTab.detail.name &&
          activeTab.detail.name.nodeDef &&
          activeTab.detail.name.nodeDef.nodeType == 'subflows' &&
          activeTab.detail.name.state != 10 &&
          canIComplate
        "
        type="info"
        icon="checked"
        block
        class="c-button-group-item"
        @click="process('complate')"
      >
        完成{{ activeTab.detail.name.nodeDef && activeTab.detail.name.nodeDef.name }}
      </van-button>
    </view>

    <!-- 子流程节点列表弹出层 -->
    <van-popup
      :show="subWorkflow.show"
      position="bottom"
      round
      custom-style="background-color:#f0f3f6;height: 90%;z-index:99"
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
              <text>{{ index2 + 1 + ' ' + subNode.nodeDef.name }}</text>
            </view>
            <view class="c-card-content" style="min-height: 15px">
              <view v-if="subNode.nodeDef.desc">描述：{{ subNode.nodeDef.desc }}</view>
              <view v-if="subNode.updateTime">修改时间：{{ subNode.updateTime }}</view>
            </view>
            <view class="c-card-footer c-flex-between">
              <view>
                <van-button
                  v-if="
                    subNode.visible &&
                    subNode.state == 10 &&
                    subWorkflow.def.nodes[index2 + 1] &&
                    subWorkflow.def.nodes[index2 + 1].state == 0
                  "
                  icon="edit"
                  size="small"
                  plain
                  round
                  @click="takebackWorkflow(subNode._id)"
                >
                  修改
                </van-button>
                <van-button
                  v-else-if="subNode.visible && subNode.state == 0 && index2 != 0"
                  icon="delete-o"
                  size="small"
                  plain
                  round
                  @click="rollbackWorkflow(subNode._id)"
                >
                  删除
                </van-button>
                <van-button
                  v-if="subNode.state == 0 || subNode.state == 10"
                  type="info"
                  :icon="subNode.state == 0 ? 'edit' : ''"
                  size="small"
                  round
                  custom-class="c-m-l-20"
                  @click="viewForm(subNode, { edit: true, isQuickly: false })"
                >
                  {{
                    subNode.visible && subNode.state == '0'
                      ? subNode.nodeDef.nodeType == 'disable'
                        ? '等待处理'
                        : '处理'
                      : '查看'
                  }}
                </van-button>
              </view>
            </view>
          </view>
        </block>
      </view>
    </van-popup>

    <!-- 表单弹出层 -->
    <van-popup :show="openForm" position="bottom" round custom-style="height: 90%;z-index:100">
      <view class="c-popup form-popup">
        <van-nav-bar
          :title="activeTab.detail.name.nodeDef && activeTab.detail.name.nodeDef.name"
          left-text="取消"
          @click-left="closeForm"
        >
          <van-button
            type="info"
            plain
            slot="right"
            @click="saveForm"
            :disabled="disabled.saveForm"
            v-if="
              activeTab.detail &&
              (activeTab.detail.name == 'log' || activeTab.detail.name == 'order')
            "
          >
            提交
          </van-button>
          <van-button
            type="info"
            plain
            slot="right"
            @click="saveForm"
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
            @click="saveFormConfirm"
            :disabled="disabled.saveForm"
            v-else-if="
              currentNode &&
              workflow.state == 0 &&
              currentNode.state == 0 &&
              currentNode.nodeDef &&
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
            :disabled="disabled.saveForm"
            v-else-if="
              currentNode.nodeDef &&
              currentNode.nodeDef.nodeType == 'forms' &&
              currentForm.state != -1
            "
          >
            提交
          </van-button>
          <van-button
            type="info"
            plain
            slot="right"
            @click="saveForm"
            :disabled="disabled.saveForm"
            v-else-if="
              currentNode.nodeDef &&
              currentNode.nodeDef.nodeType == 'repeat' &&
              newFormSubmitBtn &&
              SAFormData.status != 501 &&
              SAFormData.status != 502
            "
          >
            提交
          </van-button>
        </van-nav-bar>
        <van-cell-group class="c-popup-cells">
          <block v-for="(extField, index) in extFields" :key="index">
            <block v-if="showType(extField, formData)">
              <block v-if="extField.type == 'phone' || extField.type == 'IDNumber'">
                <van-field
                  :key="'edit' + extField._id"
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
                  :key="'edit' + extField._id"
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
                <!-- #ifdef MP-WEIXIN -->
                <van-cell
                  :key="'edit' + extField._id"
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
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <van-cell
                  :key="'edit' + extField._id"
                  :title="extField.nameDisp"
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
                >
                  <uni-datetime-picker
                    :value="formData[extField.name]"
                    placeholder=" "
                    @change="datetimeConfirm($event, 'uni', extField.name)"
                  />
                </van-cell>
                <!-- #endif -->
              </block>
              <block v-else-if="extField.type == 'select'">
                <!-- 根据其他字段值展示，如“不需要上门原因” -->
                <van-cell
                  :key="'edit' + extField._id"
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
                <!-- #ifdef MP-WEIXIN -->
                <van-cell
                  :key="'edit' + extField._id"
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
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <van-cell
                  :key="'edit' + extField._id"
                  :title="extField.nameDisp"
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
                >
                  <uni-data-picker
                    ref="uniDataPicker"
                    v-model="formData[extField.name]"
                    placeholder="请选择"
                    popup-title="请选择"
                    :localdata="options[extField.valueOption]"
                    :map="{
                      text: 'name',
                      value: 'value'
                    }"
                    @change="onCascaderFinish"
                    :clear-icon="false"
                  ></uni-data-picker>
                </van-cell>
                <!-- #endif -->
              </block>
              <block v-else-if="extField.type == 'bizSelect'">
                <van-cell
                  :key="'edit' + extField._id"
                  :title="extField.nameDisp"
                  :value="
                    commonEvent('codelabel', extField.name, {
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
                <view :key="'edit' + extField._id" class="cell-wrapper-p14">
                  <view class="cell-item">
                    <van-cell :title="extField.nameDisp" :border="false" />
                    <view class="image-sample">
                      <view style="padding: 10rpx; flex: 1">
                        <view>
                          <image
                            v-for="(item, i) in extField.frontEndConfig.list"
                            :key="i"
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
                  :key="'edit' + extField._id"
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
                    class="c-radio-group"
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
                  :key="'edit' + extField._id"
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
                  :key="'edit' + extField._id"
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
                <view
                  :key="'edit' + extField._id"
                  class="c-cell-view c-flex c-flex-between c-relative c-p-b-0"
                >
                  <view
                    :class="
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        ? 'c-disable c-cell_title'
                        : 'c-cell_title'
                    "
                  >
                    <text
                      class="c-required"
                      v-if="
                        extField.required == '1' &&
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                      "
                    >
                      *
                    </text>
                    {{ extField.nameDisp }}
                  </view>
                  <!-- #ifdef MP-WEIXIN -->
                  <view
                    v-if="extField.frontEndConfig.surveyTool"
                    @click="surveyToolClick(extField)"
                    class="c-flex"
                  >
                    <van-icon name="edit" color="#106cff" class="c-m-r-10" />
                    <text class="c-blue">测绘工具</text>
                  </view>
                  <!-- #endif -->
                  <view class="c-cell_value">
                    （{{ (formData[extField.name] && formData[extField.name].length) || 0 }} /
                    {{ extField.frontEndConfig.max || '不限' }}）
                  </view>
                </view>
                <view class="c-cell-view c-p-b-0">
                  <van-uploader
                    style="display: flex"
                    multiple
                    :accept="extField.frontEndConfig.fileType || 'image'"
                    :upload-text="
                      extField.frontEndConfig && extField.frontEndConfig.uploadText
                        ? extField.frontEndConfig.uploadText
                        : ' '
                    "
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
                    @click.native="uploaderClick(extField)"
                  />
                </view>
              </block>
              <block v-else-if="extField.type == 'title'">
                <view
                  :key="'edit' + extField._id"
                  class="c-cell-headline"
                  v-html="
                    (extField.frontEndConfig && extField.frontEndConfig.html) ||
                    formData[extField.name] ||
                    extField.nameDisp
                  "
                ></view>
              </block>
              <block v-else-if="extField.type == 'gap'">
                <view
                  :key="'edit' + extField._id"
                  class="c-cell-gap"
                  v-html="extField.frontEndConfig && extField.frontEndConfig.html"
                ></view>
              </block>
              <block v-else-if="extField.type == 'area'">
                <!-- #ifdef MP-WEIXIN -->
                <van-cell
                  :key="'edit' + extField._id"
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
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <van-cell
                  :key="'edit' + extField._id"
                  :title="extField.nameDisp"
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
                >
                  <uni-data-picker
                    :key="'uniAreaPicker' + extField.name"
                    :ref="'uniAreaPicker' + extField.name"
                    :value="formData[extField.name]"
                    placeholder="请选择"
                    popup-title="请选择"
                    :localdata="area.areaList"
                    :map="{
                      text: 'label',
                      value: 'value'
                    }"
                    @change="areaConfirm"
                    :clear-icon="false"
                  ></uni-data-picker>
                </van-cell>
                <!-- #endif -->
              </block>
              <block v-else-if="extField.type == 'button'">
                <van-button
                  :key="'edit' + extField._id"
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
                <view
                  :key="'edit' + extField._id"
                  class="c-flex c-flex c-flex-between c-item-center c-bg-white c-cell-view"
                >
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
                <view :key="'edit' + extField._id" class="c-cell-view c-flex c-flex-between">
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
                <van-cell-group :key="'edit' + extField._id">
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
                <van-cell-group :key="'edit' + extField._id" :border="false">
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
                  :key="'edit' + extField._id"
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
                  :key="'edit' + extField._id"
                  class="c-cell-view c-flex"
                  :data-extfield="extField"
                  :type="extField.type"
                  @click="onClick"
                >
                  <text
                    class="c-required"
                    v-if="
                      extField.required == '1' &&
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                    "
                  >
                    *
                  </text>
                  <van-icon custom-class="c-blue" name="checked" v-if="formData[extField.name]" />
                  <rich-text :nodes="extField.frontEndConfig.text"></rich-text>
                </view>
              </block>
              <block v-else-if="extField.type == 'data'">
                <view
                  style="margin: 0 16px"
                  :style="
                    extField.frontEndConfig.border === false
                      ? ''
                      : 'border-bottom: 1px solid rgb(235, 237, 240);'
                  "
                >
                  <view class="c-flex c-flex-between c-item-center" style="padding: 10px 0">
                    <text class="c-required" v-if="extField.required == '1'">*</text>
                    <text>{{ extField.nameDisp }}</text>
                    <view
                      class="c-flex c-item-center"
                      v-if="formData[extField.name] && formData[extField.name].length > 0"
                      @click="dataClick(extField.name, formData[extField.name])"
                    >
                      <text class="c-m-r-5 c-color-value">查看全部</text>
                      <van-icon name="arrow" class="c-color-value" />
                    </view>
                  </view>
                  <view
                    v-if="formData[extField.name] && formData[extField.name].length > 0"
                    class="c-ellipsis2"
                    style="margin-bottom: 10px"
                  >
                    <text v-for="(item, i) in formData[extField.name]" :key="i" class="c-m-r-10">
                      {{ i + 1 }}.{{ item }}
                    </text>
                  </view>
                </view>
              </block>
              <block v-else-if="inspectionSOP && extField.name == 'inspectionSOP'">
                <block v-for="(item, i) in inspectionSOPData" :key="i">
                  <view>
                    <view style="padding: 10px 16px">序号 {{ i + 1 }}</view>
                    <van-field
                      label="巡检内容"
                      disabled
                      type="textarea"
                      autosize
                      :value="item.content"
                      placeholder="请输入"
                      @change="inspectionSOPChange($event, i)"
                      input-align="right"
                      class="c-disabled"
                      data-extfield="content"
                    ></van-field>
                    <van-field
                      label="质量要求"
                      disabled
                      type="textarea"
                      autosize
                      :value="item.requirement"
                      placeholder="请输入"
                      @change="inspectionSOPChange($event, i)"
                      input-align="right"
                      class="c-disabled"
                      data-extfield="requirement"
                    ></van-field>
                    <van-cell
                      title="是否合格"
                      :required="item.required == '1'"
                      input-align="right"
                      :value="format('qualified', item.isQualified, 'select')"
                      @click="isQualifiedClick(item, i)"
                      is-link
                    ></van-cell>
                    <!-- 不合格原因 -->
                    <van-cell
                      v-if="item.isQualified && item.isQualified == 0"
                      title="不合格原因"
                      input-align="right"
                      :value="formatT(item.reason)"
                      @click="reasonClickDo(item, i)"
                      is-link
                    ></van-cell>
                    <!-- 其他原因 -->
                    <van-field
                      v-if="item.isQualified && item.isQualified == 0"
                      label="其他原因"
                      type="textarea"
                      autosize
                      :value="item.otherReason"
                      placeholder="请输入"
                      @change="otherCauseChange"
                      input-align="right"
                      class="c-disabled"
                      data-extfield="content"
                    ></van-field>
                    <!-- 图片 -->
                    <!-- c-disable c-cell_title -->
                    <block v-if="item.isQualified">
                      <view class="c-cell-view c-flex c-flex-between c-relative c-p-b-0">
                        <view class="c-cell_title">
                          <span class="c-required">*</span>
                          巡检图片
                        </view>
                        <view class="c-cell_value" v-if="item.inspectionImg">（最多上传 / 3）</view>
                      </view>
                      <view class="c-cell-view c-p-b-0">
                        <van-uploader
                          style="display: flex"
                          multiple
                          accept="image"
                          :upload-text="
                            extField.frontEndConfig && extField.frontEndConfig.uploadText
                              ? extField.frontEndConfig.uploadText
                              : ' '
                          "
                          :file-list="item.inspectionImg"
                          @after-read="inspectionAfterRead($event, i)"
                          data-extField="inspectionImg"
                          :data-field="extField.name"
                          @delete="inspectionDeleteFile($event, i)"
                          max-count="3"
                          :disabled="
                            currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                          "
                        />
                      </view>
                    </block>

                    <van-divider />
                  </view>
                </block>
              </block>
              <block v-else-if="extField.name == 'suggest'">
                <van-cell
                  title="巡检建议"
                  required
                  input-align="right"
                  :value="formatT(formData.suggest)"
                  @click="suggestClickDo()"
                  is-link
                ></van-cell>
              </block>

              <!-- 签字 -->
              <block v-else-if="extField.type == 'canvas'">
                <view class="canvas-view">
                  <view class="canvas-title" style="background-color: #f7f8fa">
                    {{ extField.nameDisp }}
                  </view>
                  <img
                    v-if="formData._id && formData[extField.name]"
                    :src="formData[extField.name]"
                    :style="'width: 100%;height:' + canvas[extField.name].height + 'px'"
                  />
                  <canvas
                    v-show="!formData._id || !formData[extField.name]"
                    class="canvas"
                    :canvas-id="extField.name + 'Canvas'"
                    @touchstart="start($event, extField)"
                    @touchmove="move($event, extField)"
                    @touchend="end($event, extField)"
                    @touchcancel="cancel($event, extField)"
                    @longtap="tap($event, extField)"
                    @error="error"
                    :disable-scroll="true"
                    style="width: 100%; height: 300px"
                  ></canvas>
                  <view class="canvas-btns" v-if="!formData._id || !currentNode.state">
                    <van-button
                      plain
                      type="default"
                      size="small"
                      @click="canvasClear(extField)"
                      class="canvas-btn"
                      :data-event="{ id: 'V6FGwpbN6e' }"
                    >
                      清除
                    </van-button>
                    <van-button
                      plain
                      type="default"
                      size="small"
                      @click="canvasSave(extField)"
                      class="canvas-btn"
                      :data-event="{ id: 'TDrxj8mMvd' }"
                    >
                      保存
                    </van-button>
                  </view>
                </view>
              </block>
              <block v-else>
                <!-- 原生类型 text number idcard digit textarea 自定义计算类型evaluate-->
                <van-field
                  :key="'edit' + extField._id"
                  v-if="openForm"
                  :label="extField.nameDisp"
                  :value="formData[extField.name]"
                  @blur="onBlur"
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
                  :placeholder="extField.placeholder || '请输入'"
                  :border="extField.frontEndConfig.border === false ? false : true"
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
      custom-style="height: 80%;z-index:100"
      closeable
      round
      @close="closePay"
    >
      <view class="c-flex c-flex-col c-flex-center">
        <view style="padding: 30rpx 0 30rpx">
          {{
            payment.obj.payType == 'WX'
              ? '微信收款码'
              : payment.obj.payType == 'ALi'
              ? '支付宝收款码'
              : '聚合收款码'
          }}
        </view>

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
            v-if="payment.payState == 'paying' && payment.qrval && payment.obj.payType != 'FUSION'"
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
            key="qrcode"
            style="width: 200px; height: 200px"
            canvas-id="qrcode"
            v-show="payment.payState == 'paying' && payment.open"
          ></canvas>
          <div
            v-if="payment.payState != 'paying'"
            key="qrcode-div"
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
          <view class="c-p-10" v-if="payment.obj.msg3">{{ payment.obj.msg3 }}</view>
          <view class="c-p-10" v-if="order.row._id">订单编号：{{ order.row._id }}</view>
          <view class="c-p-10" v-if="payment.obj.payId">指令编号：{{ payment.obj.payId }}</view>
        </view>
        <view
          v-if="
            !(payment.obj.paid >= payment.obj.total) &&
            payment.payState == 'paying' &&
            payment.obj.payType != 'FUSION'
          "
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
      :z-index="101"
    ></van-action-sheet>

    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
      :z-index="101"
    ></van-action-sheet>
    <!-- 是否合格 -->
    <van-action-sheet
      :show="isQualified.show"
      :actions="options.qualified"
      @select="isQualifiedSelect"
      cancel-text="取消"
      @cancel="isQualifiedClose"
    ></van-action-sheet>

    <van-popup
      @click-overlay="inspectionReason.show = false"
      :show="inspectionReason.show"
      position="bottom"
      round
      custom-style="height: 70%;"
    >
      <van-cell title="不合格原因">
        <!-- #ifdef MP-WEIXIN -->
        <van-checkbox-group
          key="reasonChangeData"
          :value="reasonChangeData"
          @change="reasonChangeDo"
          class="c-checkbox-group"
        >
          <van-checkbox
            v-for="(item, i) in inspectionReason.unCauseData"
            :key="item.name"
            :name="item.name"
            shape="square"
          >
            {{ item.name }}
          </van-checkbox>
        </van-checkbox-group>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <uni-data-checkbox
          multiple
          v-model="reasonChangeData"
          @change="reasonChangeDo"
          :localdata="inspectionReason.unCauseData"
        ></uni-data-checkbox>
        <!-- #endif -->
      </van-cell>
      <!-- <van-field
        label="其他原因"
        type="textarea"
        autosize
        :value="otherReason"
        placeholder="请输入"
        @change="otherCauseChange"
        input-align="right"
        class="c-disabled"
        data-extfield="content"
      ></van-field> -->
    </van-popup>
    <van-popup
      @click-overlay="inspectionSuggest.show = false"
      :show="inspectionSuggest.show"
      position="bottom"
      round
      custom-style="height: 70%;"
    >
      <van-cell title="巡检建议">
        <!-- #ifdef MP-WEIXIN -->
        <van-checkbox-group
          :value="suggestChangeData"
          @change="suggestChangeDo"
          data-extfield="suggest"
          class="c-checkbox-group"
        >
          <van-checkbox
            v-for="(item, i) in inspectionSuggest.suggestData"
            :key="i"
            :name="item.name"
            shape="square"
          >
            {{ item.name }}
          </van-checkbox>
        </van-checkbox-group>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <uni-data-checkbox
          multiple
          :value="suggestChangeData"
          :localdata="inspectionSuggest.suggestData"
          @change="suggestChangeDo"
        ></uni-data-checkbox>
        <!-- #endif -->
      </van-cell>
    </van-popup>
    <!-- 级联选择器 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-popup
      v-if="cascader.show"
      :show="cascader.show"
      round
      position="bottom"
      :z-index="9999"
      custom-style="z-index:9999"
    >
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
    <!-- #endif -->

    <!-- 日期时间 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-popup
      :show="datetime.show"
      position="bottom"
      :close-on-click-overlay="false"
      :z-index="999"
      custom-style="999"
    >
      <van-datetime-picker
        :type="datetime.type"
        :value="datetime.value"
        @confirm="datetimeConfirm"
        @cancel="datetimeCancel"
      ></van-datetime-picker>
    </van-popup>
    <!-- #endif -->

    <!-- 省市区 -->
    <!-- #ifdef MP-WEIXIN -->
    <van-popup :show="area.show" position="bottom" custom-style="z-index:100">
      <van-area
        title="省市区"
        :area-list="area.areaList"
        @confirm="areaConfirm"
        @cancel="areaCancel"
      />
    </van-popup>
    <!-- #endif -->

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
      confirm-button-color="#106cff"
      :cancel-button-text="dialog.cancelText"
      @confirm="dialogConfirm"
      @cancel="dialogCancel"
    >
      <view style="height: 60vh; overflow-y: auto; padding: 20rpx">
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
      :beforeClose="paymentLimitBeforeClose"
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
          <van-cell title="其他" clickable @click="paymentLimitClick('other')">
            <van-radio slot="right-icon" name="other" />
          </van-cell>
          <van-field
            v-if="paymentLimit.limit == 'other'"
            :value="paymentLimit.customLimit"
            placeholder="请输入自定义限额"
            :border="false"
            @change="customLimitChange"
          />
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
      :z-index="101"
    />

    <!-- 取消合同原因 -->
    <van-popup
      :show="cancellationShow"
      position="bottom"
      round
      custom-style="height: 70%;z-index:100"
    >
      <van-nav-bar
        title="取消合同原因"
        left-text="取消"
        @click-left="
          cancellationShow = false;
          cancelContractData.reasonCancellation = '';
        "
      >
        <van-button type="info" plain slot="right" @click="cancelContractAjax">提交</van-button>
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

    <!-- 去签约提交表单 -->
    <van-popup
      :show="signForm.show"
      position="bottom"
      round
      :z-index="5"
      custom-style="height: 90%;z-index:100"
    >
      <view class="c-popup">
        <van-nav-bar title="补充签约信息" left-text="取消" @click-left="signForm.show = false">
          <van-button type="info" plain slot="right" @click="signFormSubmit">提交</van-button>
        </van-nav-bar>
        <!-- :class="!editType || editType<=1 ?'c-popup-cells-form':'c-popup-cells-form c-no-pointer'" -->
        <van-cell-group class="c-popup-cells">
          <view style="overflow-y: none">
            <block v-for="(extField, index) in signForm.fields" :key="index">
              <block v-if="extField.type == 'phone' || extField.type == 'IDNumber'">
                <van-field
                  :label="extField.nameDisp"
                  :value="signForm.formData[extField.name]"
                  @change="onSignFormChange"
                  :required="extField.required == '1'"
                  :data-extfield="extField"
                  input-align="right"
                ></van-field>
              </block>
              <block v-else-if="extField.type == 'textarea'">
                <van-field
                  :label="extField.nameDisp"
                  :value="signForm.formData[extField.name]"
                  @change="onSignFormChange"
                  :required="extField.required == '1'"
                  :data-extfield="extField"
                  input-align="right"
                  autosize
                  type="textarea"
                ></van-field>
              </block>
              <block v-else-if="extField.type == 'switch'">
                <van-cell
                  :title="extField.nameDisp"
                  class="c-cell-switch"
                  :required="extField.required == '1'"
                >
                  <van-switch
                    :checked="signForm.formData[extField.name]"
                    @change="onSignFormChange"
                    :data-extfield="extField"
                    active-value="1"
                    inactive-value="0"
                    :size="extField.frontEndConfig.size || '24px'"
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
                  :value="signForm.formData[extField.name]"
                  @click="onSignFormClick"
                  :data-extfield="extField"
                  :required="extField.required == '1'"
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'select'">
                <van-cell
                  :title="extField.nameDisp"
                  is-link
                  :value="
                    commonEvent(extField.frontEndConfig.coupons ? 'coupons' : 'codelabel', null, {
                      option: extField.valueOption,
                      value: signForm.formData[extField.name]
                    })
                  "
                  @click="onSignFormClick"
                  :data-extfield="extField"
                  :required="extField.required == '1'"
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'bizSelect'">
                <van-cell
                  :title="extField.nameDisp"
                  is-link
                  :value="
                    commonEvent('codelabel', null, {
                      option: extField.name,
                      value: signForm.formData[extField.name]
                    })
                  "
                  @click="onSignFormClick"
                  :data-extfield="extField"
                  :required="extField.required == '1'"
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'radio'">
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <van-radio-group
                    :value="signForm.formData[extField.name]"
                    @change="onSignFormChange"
                    :data-extfield="extField"
                    class="c-radio-group"
                  >
                    <van-radio
                      checked-color="#106cff"
                      v-for="(item, i) in signForm.options[extField.valueOption]"
                      :key="i"
                      :name="item.value"
                    >
                      {{ item.name }}
                    </van-radio>
                  </van-radio-group>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'checkbox'">
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <van-checkbox-group
                    :value="signForm.formData[extField.name]"
                    @change="onSignFormChange"
                    :data-extfield="extField"
                    class="c-checkbox-group"
                  >
                    <van-checkbox
                      v-for="(item, i) in signForm.options[extField.valueOption]"
                      :key="i"
                      :name="item.value"
                      shape="square"
                    >
                      {{ item.name }}
                    </van-checkbox>
                  </van-checkbox-group>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'rate'">
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <van-rate
                    :value="signForm.formData[extField.name]"
                    @change="onSignFormChange"
                    :data-extfield="extField"
                  ></van-rate>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'file'">
                <view class="c-cell-view c-flex c-flex-between c-p-b-0">
                  <view class="c-cell_title">
                    <text class="c-required" v-if="extField.required == '1'">*</text>
                    {{ extField.nameDisp }}
                  </view>
                  <view class="c-cell_value">
                    （{{
                      (signForm.formData[extField.name] &&
                        signForm.formData[extField.name].length) ||
                      0
                    }}
                    /
                    {{
                      extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                        ? extField.frontEndConfig.max
                        : '不限'
                    }}）
                  </view>
                </view>
                <view class="c-cell-view c-p-b-0">
                  <van-uploader
                    style="display: flex"
                    multiple
                    :upload-text="
                      extField.frontEndConfig && extField.frontEndConfig.uploadText
                        ? extField.frontEndConfig.uploadText
                        : ' '
                    "
                    :file-list="signForm.formData[extField.name]"
                    @after-read="afterRead"
                    :data-extField="extField"
                    :data-field="extField.name"
                    @delete="deleteFile"
                    :max-count="
                      extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                        ? extField.frontEndConfig.max
                        : 20
                    "
                    @click.native="uploaderClick(extField)"
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
                  v-html="
                    (extField.frontEndConfig && extField.frontEndConfig.html) || extField.nameDisp
                  "
                ></view>
              </block>
              <block v-else-if="extField.type == 'area'">
                <!-- #ifdef MP-WEIXIN -->
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    area.areaList.province_list[signForm.formData[extField.name][0]] +
                    area.areaList.city_list[signForm.formData[extField.name][1]] +
                    area.areaList.county_list[signForm.formData[extField.name][2]]
                  "
                  @click="onSignFormClick"
                  :data-extfield="extField"
                  is-link
                  :required="extField.required == '1'"
                />
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <van-cell
                  :key="extField._id"
                  :title="extField.nameDisp"
                  @click="onSignFormClick"
                  :data-extfield="extField"
                  :required="extField.required == '1'"
                >
                  <uni-data-picker
                    :key="'uniSignFormAreaPicker' + extField.name"
                    :ref="'uniSignFormAreaPicker' + extField.name"
                    :value="signForm.formData[extField.name]"
                    placeholder="请选择"
                    popup-title="请选择"
                    :localdata="area.areaList"
                    :map="{
                      text: 'label',
                      value: 'value'
                    }"
                    @change="areaConfirm"
                    :clear-icon="false"
                  ></uni-data-picker>
                </van-cell>
                <!-- #endif -->
              </block>
              <block v-else-if="extField.type == 'button'">
                <van-button
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
              <block v-else-if="extField.type == 'evaluate'">
                <van-field
                  :label="extField.nameDisp"
                  :value="signForm.formData[extField.name]"
                  @change="onSignFormChange"
                  :data-extfield="extField"
                  type="digit"
                  :required="extField.required == '1'"
                  input-align="right"
                ></van-field>
              </block>
              <block v-else-if="extField.type == 'stepper'">
                <view
                  class="van-cell van-cell--center"
                  :class="extField.required == '1' ? 'van-cell--required' : ''"
                  :style="extField.required == '1' ? 'padding-left: 16rpx;' : ''"
                >
                  <view class="van-cell__title c-flex-1">
                    {{ extField.nameDisp }}
                  </view>
                  <view class="van-cell__value c-flex-1">
                    <van-stepper
                      :value="signForm.formData[extField.name]"
                      :min="extField.frontEndConfig ? extField.frontEndConfig.min : 1"
                      :max="extField.frontEndConfig ? extField.frontEndConfig.max : 1"
                      @change="onSignFormChange"
                      :data-extfield="extField"
                      :show-plus="extField.frontEndConfig.showPlus"
                      :integer="extField.frontEndConfig.integer"
                    />
                  </view>
                </view>
              </block>
              <!-- 原生类型 text number idcard digit textarea 自定义计算类型evaluate-->
              <block v-else>
                <van-field
                  :label="extField.nameDisp"
                  :value="signForm.formData[extField.name]"
                  @blur="onSignFormBlur"
                  @change="onSignFormChange"
                  :data-extfield="extField"
                  :type="extField.type"
                  :required="extField.required == '1'"
                  input-align="right"
                ></van-field>
              </block>
            </block>
          </view>
        </van-cell-group>
      </view>
    </van-popup>

    <!-- 勘察-选择渗漏原因 -->
    <van-popup
      :show="leakageCauseSelect.show"
      position="bottom"
      @close="leakageCauseSelect.show = false"
      custom-style="z-index:100"
    >
      <!-- #ifdef MP-WEIXIN -->
      <van-tree-select
        :items="leakageCauseSelect.items"
        :main-active-index="leakageCauseSelect.mainActiveIndex"
        :active-id="leakageCauseSelect.activeId"
        @click-nav="leakageCauseClickNav"
        @click-item="leakageCauseClickItem"
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <view class="c-tree-select">
        <view class="c-tree-select-left">
          <view
            v-for="(item, i) in leakageCauseSelect.items"
            :key="i"
            :class="leakageCauseSelect.mainActiveIndex == i ? 'c-tree-select-left-item-active' : ''"
            @click="leakageCauseSelect.mainActiveIndex = i"
          >
            {{ item.text }}
          </view>
        </view>
        <view class="c-tree-select-right">
          <block
            v-if="
              leakageCauseSelect.mainActiveIndex > -1 &&
              leakageCauseSelect.items[leakageCauseSelect.mainActiveIndex]
            "
          >
            <view
              v-for="(item, i) in leakageCauseSelect.items[leakageCauseSelect.mainActiveIndex]
                .children"
              :key="i"
              :class="
                formData.leakageCause && formData.leakageCause.indexOf(item.id) != -1
                  ? 'c-tree-select-right-item-active'
                  : ''
              "
              @click="
                leakageCauseClickItem({
                  detail: {
                    id: item.id
                  }
                })
              "
            >
              {{ item.label }}
              <van-icon
                v-if="formData.leakageCause && formData.leakageCause.indexOf(item.id) != -1"
                name="success"
                color="#ee0a24"
                class="c-tree-select-right-item-icon"
              />
            </view>
          </block>
        </view>
      </view>
      <!-- #endif -->
    </van-popup>

    <!-- 勘察-渗漏原因弹窗 -->
    <van-dialog
      custom-class="leakageCause-dialog"
      use-slot
      title="渗漏原因"
      :show="leakageCause.show"
      @close="leakageCauseClose"
      custom-style="max-height: 80vh !important; display:flex;flex-direction:column;"
    >
      <view style="padding: 0 16px 16px; flex: 1; overflow-y: auto">
        <view v-for="(item, i) in leakageCause.data" :key="i">{{ i + 1 }}.{{ item }}</view>
      </view>
    </van-dialog>

    <!-- 选择服务商品 -->
    <van-popup
      position="bottom"
      :show="serviceGoods.show"
      :safe-area-inset-bottom="false"
      custom-style="height: 80%;overflow: hidden;display:flex;flex-direction:column;z-index:100"
    >
      <van-nav-bar
        title="选择服务商品"
        right-text="关闭"
        @click-right="serviceGoods.show = false"
      />
      <view class="c-content">
        <view class="c-selection c-h-100">
          <view class="c-selection-left">
            <view
              v-for="(item, index) in options.repairPartsOne"
              :key="index"
              @click="
                serviceGoods.repairPart === item.value
                  ? $set(serviceGoods, 'repairPart', '')
                  : $set(serviceGoods, 'repairPart', item.value)
              "
              :class="
                'c-selection-left-item ' +
                (serviceGoods.repairPart == item.value ? 'c-bg-white c-left-icon-blue' : '')
              "
            >
              {{ item.name }}
              <text class="c-selection-left-item-tag" v-if="projPackageTypeCount(item.value) > 0">
                {{ projPackageTypeCount(item.value) }}
              </text>
            </view>
          </view>
          <view class="c-selection-right c-flex-1">
            <view class="agelimit-tags">
              <view
                v-for="(item, index) in options.agelimitFilter"
                :key="index"
                @click="
                  serviceGoods.agelimit === item.value
                    ? $set(serviceGoods, 'agelimit', '')
                    : $set(serviceGoods, 'agelimit', item.value)
                "
                :class="
                  serviceGoods.agelimit == item.value
                    ? 'agelimit-tag agelimit-tag-active'
                    : 'agelimit-tag'
                "
              >
                {{ item.name }}
              </view>
            </view>
            <view class="c-flex-1 c-auto-y" style="padding-bottom: 30px">
              <block v-for="(item, index) in serviceGoods.data" :key="index">
                <view
                  :data-item="item"
                  :data-index="index"
                  v-if="
                    (serviceGoods.searchValue
                      ? item.name && item.name.indexOf(serviceGoods.searchValue) != -1
                      : true) &&
                    (!serviceGoods.repairPart ||
                      (item.exts &&
                        item.exts.repairPart &&
                        item.exts.repairPart.indexOf(`&quot;${serviceGoods.repairPart}&quot;`) !=
                          -1)) &&
                    (!serviceGoods.agelimit || serviceGoods.agelimit == item.agelimit)
                  "
                  class="c-selection-right-item"
                  style="padding-right: 16px"
                >
                  <image
                    :src="
                      (item.exts.images &&
                        JSON.parse(item.exts.images)[0] &&
                        JSON.parse(item.exts.images)[0].url) ||
                      'https://pub.fsgo365.cn/logo_square.png'
                    "
                    class="c-selection-right-item-image"
                    @click="
                      previewImage(
                        (item.exts.images &&
                          JSON.parse(item.exts.images)[0] &&
                          JSON.parse(item.exts.images)[0].url) ||
                          'https://pub.fsgo365.cn/logo_square.png'
                      )
                    "
                  />
                  <view class="c-selection-right-item-content">
                    <view>
                      <view class="c-size-14 c-ellipsis2">{{ item.name }}</view>
                      <view v-if="item.desc" class="desc" @click="toViewDescription(item.desc)">
                        描述：{{ item.desc }}
                      </view>
                      <view class="c-flex" style="margin: 4px 0">
                        <text class="desc-tag c-m-l-0">
                          {{ codelabel('select', 'packageType', item.type) }}
                        </text>
                        <text class="desc-tag" v-if="item.minimumPrice">
                          最低起算价：¥{{ item.minimumPrice }}
                        </text>
                      </view>
                    </view>
                    <view class="c-flex c-flex-between c-flex-center">
                      <view>
                        <text style="color: #f00; font-size: 14px">¥{{ item.price }}</text>
                        <text class="c-size-10 c-m-l-5">起</text>
                        <text class="c-size-10" v-if="item.unit">
                          {{ '/' + codelabel('select', 'unit', item.unit) }}
                        </text>
                      </view>
                      <view class="c-relative">
                        <van-button
                          v-if="
                            !formData.serviceGoods || formData.serviceGoods.indexOf(item._id) == -1
                          "
                          custom-class="c-spec-button"
                          round
                          @click="recommended(item._id)"
                        >
                          选择
                        </van-button>
                        <van-button
                          v-else
                          custom-class="c-spec-button c-spec-button-blue"
                          round
                          @click="recommended(item._id)"
                        >
                          已选择
                        </van-button>
                      </view>
                    </view>
                  </view>
                </view>
              </block>
            </view>
          </view>
        </view>
      </view>
    </van-popup>

    <!-- 合同签约二维码 -->
    <van-dialog
      use-slot
      title="契约锁签约二维码"
      :show="signatureUrl.show"
      confirmButtonText="保存图片"
      confirm-button-color="#106cff"
      @confirm="saveCode"
      showCancelButton
      cancelButtonText="关闭"
      @cancel="clearCode"
    >
      <tki-qrcode
        style="text-align: center; margin-bottom: 10px"
        ref="tkiQrcode"
        :val="signatureUrl.val"
        :size="400"
        icon="/static/images/qys.jpg"
        :iconSize="60"
        :onval="true"
      ></tki-qrcode>
    </van-dialog>

    <!-- C端小程序二维 -->
    <van-popup
      :show="QRcordShow"
      @close="QRcordShow = false"
      round
      closeable
      close-icon="close"
      custom-style="z-index:100"
    >
      <view style="padding: 14px 10px 5px; text-align: center; font-weight: 600">
        修链丨屋顶窗户厨卫漏水维修
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <view style="text-align: center; font-size: 14px; margin-bottom: 5px">
        可长按图片识别或分享
      </view>
      <!-- #endif -->
      <image
        src="https://pub.fsgo365.cn/miniprogram-c.jpg"
        mode="widthFix"
        style="display: flex"
        show-menu-by-longpress
      />
      <!-- #ifdef APP-PLUS -->
      <view class="c-flex c-item-center">
        <van-button
          type="info"
          @click="saveImageToPhotosAlbum('https://pub.fsgo365.cn/miniprogram-c.jpg')"
          style="margin: 10px auto"
        >
          保存到相册
        </van-button>
      </view>
      <!-- #endif -->
    </van-popup>

    <!-- 编辑备注 -->
    <van-popup
      position="bottom"
      :show="remark.show"
      :safe-area-inset-bottom="false"
      @close="remark.show = false"
      round
      custom-style="height: 375px;z-index:100"
    >
      <van-nav-bar
        title="编辑备注"
        left-text="取消"
        @click-left="
          remark.show = false;
          remark.content = '';
        "
      >
        <van-button type="info" plain slot="right" @click="saveRemark">提交</van-button>
      </van-nav-bar>
      <van-field
        :value="remark.content"
        type="textarea"
        placeholder="请输入备注"
        :autosize="{ minHeight: 300, maxHeight: 300 }"
        :border="false"
        @change="changeRemark"
      />
    </van-popup>

    <!-- 跟进记录 -->
    <van-popup
      position="bottom"
      :show="records.show"
      :safe-area-inset-bottom="false"
      @close="recordsClose"
      round
      custom-style="z-index:100;height:450px"
    >
      <van-nav-bar title="创建跟进记录" left-text="取消" @click-left="recordsCancel">
        <van-button type="info" plain slot="right" @click="recordsSave">提交</van-button>
      </van-nav-bar>
      <!-- #ifdef MP-WEIXIN -->
      <van-cell
        title="任务时间"
        :value="records.formData.taskTime"
        is-link
        @click="recordsTaskTimeClick"
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="任务时间" @click="recordsTaskTimeClick">
        <uni-datetime-picker
          key="taskTime"
          :value="records.formData.taskTime"
          placeholder=" "
          @change="datetimeConfirm($event, 'uni', 'taskTime')"
        />
      </van-cell>
      <!-- #endif -->
      <!-- <van-cell
          title="添加日程提醒"
          custom-class="c-flex-between"
          value-class="cell-value-remind"
          @click="recordsRemindClick"
        >
          <van-checkbox
            :value="records.formData.remind"
            class="records-remind"
            shape="square"
            @click.native.stop
            @change="recordsRemindChange"
          />
        </van-cell> -->
      <van-field
        v-if="records.show"
        key="recordsContent"
        :value="records.formData.content"
        type="textarea"
        placeholder="请输入跟进记录"
        :autosize="{ minHeight: 300, maxHeight: 300 }"
        input-class="c-gray"
        @change="recordsContentChange"
      />
    </van-popup>

    <!-- 跟进记录添加日程提醒 -->
    <van-dialog
      :show="records.remindShow"
      message="点击按钮将跟进记录添加到日程提醒"
      confirmButtonText="添加日程提醒"
      confirm-button-color="#106cff"
      :showCancelButton="true"
      @confirm="addReminder"
      @cancel="records.remindShow = false"
    ></van-dialog>

    <!-- 工单状态关联字典表(如上门未成交原因) -->
    <van-popup
      :show="changeStatus.reasonShow"
      title="原因"
      round
      position="bottom"
      :close-on-click-overlay="false"
      custom-style="z-index:100"
    >
      <view style="padding: 20rpx 32rpx">
        <view class="c-text-center c-bold c-m-b-20">请选择原因</view>
        <van-radio-group :value="changeStatus.reason" @change="reasonSelect">
          <van-radio
            :name="item.value"
            v-for="(item, i) in SAFormData.status == '104' || SAFormData.status == '105'
              ? opts.reasons1
              : opts.reasons2"
            :key="i"
            custom-class="reason-radio"
          >
            {{ item.name }}
          </van-radio>
        </van-radio-group>
      </view>
      <van-field
        :value="changeStatus.memo"
        label="原因备注"
        type="textarea"
        autosize
        placeholder="请输入备注信息"
        @change="reasonChange"
      />
      <view class="c-flex c-flex-around c-flex-center" style="padding: 10px">
        <van-button plain round custom-style="width:100px;" @click="reasonCancel">取 消</van-button>
        <van-button type="info" round custom-style="width:100px;" @click="reasonConfirm">
          确 认
        </van-button>
      </view>
    </van-popup>

    <!-- 弹出工单相册 -->
    <van-popup
      :show="album.show"
      round
      position="bottom"
      :close-on-click-overlay="false"
      custom-class="album-popup"
      custom-style="height:80%;z-index:100"
    >
      <van-nav-bar title="工单相册" left-text="取消" @click-left="albumHide">
        <van-button type="info" plain slot="right" @click="addFromAlbum">提交</van-button>
      </van-nav-bar>
      <view style="padding: 8px 16px" v-if="!album.addForStep">
        <view style="padding-bottom: 8px">将选中照片添加到：</view>
        <van-radio-group direction="horizontal" :value="album.addType" @change="albumAddTypeChange">
          <van-radio name="1">照片标签对应字段</van-radio>
          <van-radio name="2" custom-class="c-m-l-30">{{ album.field.nameDisp }}</van-radio>
        </van-radio-group>
      </view>
      <van-collapse
        :value="album.activeName"
        accordion
        class="collapse-item-album-view"
        custom-class="collapse-item-album"
        @change="albumLabelChange"
      >
        <van-checkbox-group :value="album.checkedPhotos" @change="checkedPhotosChange">
          <van-collapse-item
            v-for="(label, i) in opts.albumLabel"
            :key="i"
            :title="label.name"
            :name="label.value"
            :value="checkedPhotosCount(label.value)"
            :border="false"
            content-class="collapse-item-content-album"
          >
            <!-- 有子标签 -->
            <block v-if="albumSubLabel[label.value]">
              <block v-for="(subLabel, j) in albumSubLabel[label.value]" :key="j">
                <view
                  v-if="
                    album.data[label.value + '-' + subLabel.value] &&
                    album.data[label.value + '-' + subLabel.value].length > 0
                  "
                >
                  <view class="album-subLabelName">{{ subLabel.name }}</view>
                  <view
                    class="photos"
                    :style="
                      systemInfo.platform == 'ios' ||
                      systemInfo.platform == 'android' ||
                      systemInfo.platform == 'devtools'
                        ? 'padding-bottom:0'
                        : ''
                    "
                  >
                    <view
                      v-for="(url, k) in album.data[label.value + '-' + subLabel.value]"
                      :key="k"
                      class="photo-view"
                    >
                      <!-- #ifdef MP-WEIXIN -->
                      <van-image
                        width="80"
                        height="80"
                        fit="cover"
                        class="image-view"
                        image-class="image-item"
                        :src="url"
                        :data-url="url"
                        @click="
                          previewPhoto($event, album.data[label.value + '-' + subLabel.value])
                        "
                      ></van-image>
                      <!-- #endif -->
                      <!-- #ifdef APP-PLUS -->
                      <image
                        style="width: 80px; height: 80px; margin-bottom: 10px; border-radius: 8px"
                        mode="aspectFill"
                        class="image-view image-item"
                        :src="url"
                        :data-url="url"
                        @click="
                          previewPhoto($event, album.data[label.value + '-' + subLabel.value])
                        "
                      ></image>
                      <!-- #endif -->
                      <van-checkbox
                        :name="url"
                        icon-size="25px"
                        custom-class="checkbox-albumPhotoCheck"
                      ></van-checkbox>
                    </view>
                  </view>
                </view>
              </block>
              <view
                v-if="labelPhotoCount(label.value, albumSubLabel[label.value]) == 0"
                class="c-p-b-20 c-gray"
              >
                没有照片
              </view>
            </block>
            <!-- 只有一级标签 如default -->
            <block v-else>
              <view v-if="album.data[label.value] && album.data[label.value].length > 0">
                <view
                  class="photos c-p-t-0"
                  :style="
                    systemInfo.platform == 'ios' ||
                    systemInfo.platform == 'android' ||
                    systemInfo.platform == 'devtools'
                      ? 'padding-bottom:0'
                      : ''
                  "
                >
                  <view v-for="(url, k) in album.data[label.value]" :key="k" class="photo-view">
                    <!-- #ifdef MP-WEIXIN -->
                    <van-image
                      width="80"
                      height="80"
                      fit="cover"
                      class="image-view"
                      image-class="image-item"
                      :src="url"
                      :data-url="url"
                      @click="previewPhoto($event, album.data[label.value])"
                    ></van-image>
                    <!-- #endif -->
                    <!-- #ifdef APP-PLUS -->
                    <image
                      style="width: 80px; height: 80px; margin-bottom: 10px; border-radius: 8px"
                      mode="aspectFill"
                      class="image-view image-item"
                      :src="url"
                      :data-url="url"
                      @click="previewPhoto($event, album.data[label.value])"
                    ></image>
                    <!-- #endif -->
                    <van-checkbox
                      :name="url"
                      icon-size="25px"
                      custom-class="checkbox-albumPhotoCheck"
                    ></van-checkbox>
                  </view>
                </view>
              </view>
              <view v-else class="c-p-b-20 c-gray">没有照片</view>
            </block>
          </van-collapse-item>
        </van-checkbox-group>
      </van-collapse>
    </van-popup>

    <!--因为要用到canvas，而项目中不能显示canvas，所以对它进行了隐藏-->
    <view style="width: 0; height: 0; overflow: hidden; visibility: hidden">
      <canvas
        class="canvas"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
        canvas-id="watermarkCanvas"
      ></canvas>
    </view>
    <!-- 分享海报 -->
    <van-dialog
      use-slot
      title="选择海报"
      :show="choosePicShow"
      show-cancel-button
      confirm-button-color="#d6000f"
      cancel-button-color
      @confirm="confirmChoosePic(item)"
      @close="closeChoosePic"
    >
      <view>
        <view style="text-align: center">
          <image mode="widthFix" style="width: 160px" :src="backgroundpic"></image>
        </view>
        <!-- style="display: flex; justify-content: space-between" -->
        <view style="display: flex; justify-content: space-around">
          <view
            :class="chooseImgIndex === index ? 'chooseImg' : ''"
            v-for="(item, index) in activityDefData"
            :key="index"
          >
            <image
              mode="widthFix"
              style="width: 100px; height: 100px"
              :src="item.tplImageFileid[0].url"
              @click="getImg(item, index)"
            ></image>
          </view>
        </view>
      </view>
    </van-dialog>
    <!-- 选择后的图片 -->
    <van-dialog
      style="text-align: center"
      use-slot
      title="巡检海报"
      :show="posterShow"
      @confirm="closePosterQrcode"
    >
      <image
        show-menu-by-longpress="true"
        mode="widthFix"
        style="width: 200px"
        :src="savepicRoute"
      />
      <view style="display: flex; justify-content: space-around; padding-bottom: 10px">
        <view style="color: #6d6d6d; font-family: Inter; font-size: 12px">
          长按图片可保存至本地/分享好友
        </view>
        <!-- <van-button round size="small" @click="share">保存/分享图片</van-button> -->
      </view>
    </van-dialog>
    <!-- #ifdef MP-WEIXIN -->
    <poster id="poster" :config="posterConfig" @success="onPosterSuccess"></poster>
    <!-- #endif -->

    <!-- Api调用通过弹窗组件（如：子流程节点保存还是提交确认弹窗） -->
    <van-dialog id="van-dialog" />
    <van-toast id="van-toast" />
  </view>
</template>

<script>
var canvasWidth = 0;
//获取系统信息
uni.getSystemInfo({
  success: function (res) {
    canvasWidth = res.windowWidth;
  }
});
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
import drawQrcode from '@/resources/js/weapp.qrcode.esm.js';
import tkiQrcode from '@/wxcomponents/tki-qrcode/tki-qrcode.vue';
// #ifdef MP-WEIXIN
import poster from '../../wxcomponents/miniprogram_dist/poster';
import poster2 from '../../wxcomponents/miniprogram_dist/poster/poster';
// #endif
import {
  isIDNumber,
  isPassport,
  isHongKongID,
  isOfficerID,
  isMTPs
} from '../../resources/js/reg.js';
import Dialog from '../../wxcomponents/vant/dialog/dialog';
import Toast from '../../wxcomponents/vant/toast/toast';

export default {
  components: {
    tkiQrcode,
    // #ifdef MP-WEIXIN
    poster
    // #endif
  },
  data() {
    return {
      systemInfo: {},
      canvasWidth: '',
      canvasHeight: '',
      id: '', //工单id
      extId: '',
      userId: '', //当前登录用户id
      orgId: '', //当前登录人组织id
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
      subWorkflow: { def: { nodes: [] } }, //子流程定义加运行记录（已完成节点记录已覆盖）
      subflows: [], //节点关联的子流程列表
      extFields: [], //表单字段
      currentColName: '', //当前弹出表单的colName
      formData: {
        inspectionSOPData: [], //巡检SOP
        part: [],
        exts: {},
        serviceGoodsName: '' //已选择服务商品name
      }, //表单数据
      options: {
        codecfg_serviceType: { codeId: 'serviceType' },
        codecfg_status: { codeId: 'STATUS' },
        codecfg_reasons1: { codeId: 'reasons1' },
        codecfg_reasons2: { codeId: 'reasons2' },
        cascadeCode_parts: { codeId: 'parts' },
        codecfg_partsOne: { codeId: 'partsOne' },
        codecfg_qualified: { codeId: 'qualified' },
        codecfg_albumLabel: { codeId: 'albumLabel' },
        parts: []
      }, //字典表
      opts: {
        serviceType: [],
        status: [],
        reasons1: [],
        reasons2: [],
        partsOne: [],
        albumLabel: []
      },
      //是否显示核查单 按钮下拉列表
      btnShow: false,
      // 相册子标签
      albumSubLabel: {},

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
        options: [],
        field: ''
      },
      // 时间选择器
      datetime: {
        show: false,
        type: '',
        value: new Date(common.osg.readableTime(null, 'date') + ' 12:00:00').getTime()
      },
      // 省市区选择
      area: {
        show: false,
        field: '',
        // #ifdef APP-PLUS
        province_list: Object.assign({}, areajs.default.province_list),
        city_list: Object.assign({}, areajs.default.city_list),
        county_list: Object.assign({}, areajs.default.county_list),
        // #endif
        areaList: Object.assign({}, areajs.default)
      },
      // 增加服务项 选择产品
      product: {
        show: false,
        actions: []
      },

      abstractForm: {}, //摘要信息
      // 动态
      log: {
        open: false,
        collapse: [], // 折叠面板是否展开
        data: [], // 动态数据
        myActionTypes: [], // 当前角色可选动态类型对象
        myActionTypeValues: [], // 当前角色可选动态类型值
        type: [] // 已选中动态类型值
      },
      // 通话录音播放
      callRecord: {
        recordUrl: '', // 当前通话录音地址
        audio: null, // 背景音频实例
        currentTime: '00:00', // 当前播放时间 格式00:00
        endTime: '00:00', // 结束时间 格式00:00
        duration: 0, //  总时间 单位秒
        progress: 0, // 滑块当前进度
        state: 'pause', // 当前播放状态
        seek: false // 是否正在拖拽滑块
      },
      // 备注
      remark: {
        show: false,
        content: ''
      },
      // 跟进记录
      records: {
        show: false,
        remindShow: false,
        formData: {
          remind: false
        }
      },
      // 相册
      album: {
        show: false, // 弹窗工单相册供选择
        addForStep: false,
        step: {},
        field: '', // 当前上传照片的字段
        addType: '1', // 照片添加方式 1:添加到标签对应字段 2:添加到当前上传字段
        checkedPhotos: [], // 当前选中的照片
        activeName: '', // 展开的相册标签
        data: {}
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
          name: { nodeDef: {} }
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
        saveForm: false,
        process: false
      },
      // 弹窗(如阅读协议)
      dialog: {
        show: false,
        countdown: 0,
        timer: null,
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
      isHandler: false, // 是否是当前节点的处理人
      addFormBtn: true,
      newFormBtn: true,
      newFormSubmitBtn: true,
      placeOrderPage: {
        active: 'order'
      },
      // 修改工单状态
      changeStatus: {
        statusShow: false,
        reasonShow: false,
        status: '', // 选择的工单状态
        reason: '', // 暂时不需要上门原因/上门未成交原因
        memo: '' // 原因备注
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
        limit: '20000',
        customLimit: ''
      },
      longitude: '',
      latitude: '',
      // 修改工单状态权限
      changeStatusAuth: false,
      // 签约表单
      signForm: {
        type: '', //1线下签约
        show: false,
        options: {},
        allFields: [],
        fields: [],
        formData: { exts: {} }
      },
      // 勘察-选择渗漏原因
      leakageCauseSelect: {
        items: [],
        mainActiveIndex: 0,
        activeId: [],
        show: false
      },
      // 勘察-渗漏原因弹窗
      leakageCause: {
        show: false,
        data: []
      },
      // 查看契约锁签约二维码
      signatureUrl: {
        show: false,
        val: ''
      },
      // 定时查询勘察报告生成进度
      surveyTimer: null,
      // 勘察单推荐服务商品（套餐）
      serviceGoods: {
        show: false,
        repairPart: '',
        agelimit: '',
        data: []
      },
      QRcordShow: false,
      archivesData: [],
      currentRoleButtons: [],
      // 巡检内容
      inspectionSOP: {
        show: false,
        data: []
      },
      // 是否合格
      isQualified: {
        show: false
      },
      inspectionReason: {
        show: false,
        data: [],
        unCauseData: []
      },
      inspectionSuggest: {
        show: false,
        data: [],
        suggestData: []
      },
      inspectionSOPData: [], //巡检表单map
      inspectionSOPDataIndex: '',
      isQualifiedVal: '',
      reasonChangeData: [], //不合格原因勾选
      suggestChangeData: [], //巡检建议勾选
      downloadUrl: 'https://pub.fsgo365.cn/',
      otherReason: '',
      /**
       * canvas
       */
      canvas: {},
      // map: {
      //   show: true,
      //   longitude: null, //中心经度
      //   latitude: null, //中心纬度
      //   includePoints: [], //缩放视野以包含所有给定的坐标点
      //   polyline: [], //路线
      //   route: {} //路径规划
      // },
      showMore: true,
      //分享海报
      activityDefData: [], //海报模板数据
      choosePicShow: false, //选择海报弹框
      chooseImgIndex: '', // 选中的背景图的index
      backgroundpic: '', //背景图片地址
      //获取背景图片的宽高
      backgroundpicWidth: '',
      backgroundpicHeight: '',
      savepicRoute: '', //保存相册
      posterConfig: {}, //二维码画布数据
      posterShow: false, //保存图片弹框
      chooseImgData: {}, //选择图片的数据
      imgText1: '', //海报拼接的第一行文字
      imgText2: '', //海报拼接的第二行文字
      imgText3: '', //海报拼接的第四行文字
      imgY1: 0, //海报第一行文字的y轴位置
      imgY2: 0, //海报第二行文字的y轴位置
      chooseData: {} //选择时的data
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.systemInfo = app.globalData.systemInfo;
    this.roleId = wx.getStorageSync('currentRole')._id;
    this.roleIds = wx.getStorageSync('user').roleIds;
    this.orgId = wx.getStorageSync('user').orgId;
    this.id = common.osg.param('id');
    this.extId = common.osg.param('extId');
    this.userId = wx.getStorageSync('user')._id;
    this.currentRoleButtons = wx.getStorageSync('currentRoleButtons') || [];
    this.getSAData(() => {
      // 工单相册分类
      if (
        this.SAFormData.serviceType &&
        this.SAFormData.serviceType != '11' &&
        this.SAFormData.serviceType != '12'
      ) {
        this.options.codecfg_albumLabel = { codeId: 'albumLabel' + this.SAFormData.serviceType };
      }
      common.osg.codeoption(() => {
        this.opts.serviceType = common.osg.deepCopy(this.options.serviceType);
        this.opts.status = common.osg.deepCopy(this.options.status);
        this.opts.reasons1 = common.osg.deepCopy(this.options.reasons1);
        this.opts.reasons2 = common.osg.deepCopy(this.options.reasons2);
        this.opts.partsOne = common.osg.deepCopy(this.options.partsOne);
        this.opts.parts = common.osg.deepCopy(this.options.parts);
        this.opts.albumLabel = common.osg.deepCopy(this.options.albumLabel);
      });
    });
    this.getActivityDef();
    // 获取定位
    // common.osg.getLocation(location => {
    //   this.longitude = location.longitude;
    //   this.latitude = location.latitude;
    // });
    // #ifdef APP-PLUS
    this.getArea();
    // #endif
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
    // 从相机返回相册页面时，刷新相册。
    if (this.activeTab.detail.name == 'album') {
      this.getSubAlbum();
      this.getAlbum();
    }
    // 判断是否保存测绘工具返回的数据
    this.surveyToolSave();
  },
  onHide() {
    clearInterval(this.orderTimer);
    clearInterval(this.surveyTimer);
    if (this.activeTab.detail.name.nodeDef && this.activeTab.detail.name.nodeDef.temporary) {
      this.temporaryForm();
    }
  },
  onUnload() {
    clearInterval(this.orderTimer);
    clearInterval(this.surveyTimer);
    if (this.activeTab.detail.name.nodeDef && this.activeTab.detail.name.nodeDef.temporary) {
      this.temporaryForm();
    }
  },
  methods: {
    getArea() {
      common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
        this.area.areaList = res.areaList;
      });
    },
    //调用vant组件内部的onTap事件
    vantTabsOntap(index) {
      setTimeout(() => {
        // setTimeout解决iphone真机因获取不到this.$refs.tabs从而导致无法自动跳转到当前页签的问题
        this.$refs.tabs &&
          this.$refs.tabs.onTap({ currentTarget: { dataset: { index: index } }, data: {} });
        this.$refs.tabs && this.$refs.tabs.resize();
      }, 100);
    },
    /**
     * 获取工单信息、主流程记录
     */
    getSAData(callback) {
      common.osg.ajax(
        'biz/extForm/findByIdWithWorkflow.do',
        { extId: this.extId, id: this.id },
        res => {
          res.data.data.createTime = this.formattTime(res.data.data.createTime);
          // 赋值摘要信息和工单状态
          this.SAFormData = res.data.data;
          this.SAFormData.exts = this.SAFormData.exts || {};
          // 赋值工作流
          this.workflow = res.data.workflow;
          // 赋值节点
          this.nodesShow = false;
          let nodes = [];
          if (res.data.workflowNode) {
            for (let i = 0; i < res.data.workflowNode.length; i++) {
              let node = res.data.workflowNode[i];
              // 不展示：第一个虚拟节点、已删除的节点、分单派单接单节点
              if (
                node.nodeId == '0' ||
                node.state == -1 ||
                (node.nodeDef &&
                  (node.nodeDef.nodeType == 'accept' ||
                    node.nodeDef.nodeType == 'allot' ||
                    node.nodeDef.nodeType == 'dispatch')) ||
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
              // 节点定义了当前角色有查看权限
              if (
                node.nodeDef.viewableRoleIds &&
                node.nodeDef.viewableRoleIds.indexOf(this.roleId) != -1
              ) {
                node.visible = true;
              }
              if (node.visible) nodes.push(node);
            }
          }
          this.nodes = nodes;
          // #ifdef MP-WEIXIN
          this.nodesShow = true;
          // #endif
          // #ifdef APP-PLUS
          this.$nextTick(() => {
            this.nodesShow = true;
            this.$forceUpdate();
          });
          // #endif

          this.$nextTick(() => {
            // 自动跳转最新节点标签页
            this.vantTabsOntap(this.nodes.length - 1 < 0 ? 0 : this.nodes.length - 1);
            // 节点不切换时vantTabsOntap无效，需调用tabChange触发页面视图更新
            if (callback) callback();
            // 当只有1个节点时，vantTabsOntap方法无法刷新tab-content内视图，需要调用tabChange触发
            if (this.nodes.length == 1) {
              this.tabChange({
                detail: {
                  name: this.nodes[this.nodes.length - 1]
                }
              });
            } else if (this.nodes.length == 0) {
              // 当没有工作流时默认展示动态标签页
              this.tabChange({
                detail: {
                  name: 'log'
                }
              });
            }
          });
        },
        {
          noload: true
        }
      );
    },
    /**
     * 标签栏切换
     */
    tabChange(e, index) {
      // 取消生成勘察单进度查询定时器
      if (this.surveyTimer) clearInterval(this.surveyTimer);
      // #ifdef MP-WEIXIN
      if (index || index === 0) {
        this.activeTab = index;
      } else {
        this.activeTab = e.detail.index;
      }
      // #endif
      //保存当前激活标签页
      this.activeTab = e;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
      let node = e.detail.name;
      console.log('当前tab节点');
      console.log(node);
      this.fabShow = false;
      this.takebackShow = false;
      this.rollbackShow = false;

      if (node == 'log') {
        if (this.log.myActionTypes.length == 0) this.getMyActionTypes();
        this.getLog();
      } else if (node == 'album') {
        this.md({ act: 'SAOperation_album' });
        this.getSubAlbum();
        this.getAlbum();
        this.$nextTick(() => {
          this.album.activeName = 'default';
        });
      } else if (node == 'archives') {
        this.md({ act: 'SAOperation_archives' });
        this.archivesData = [];
        this.getContracts();
        // 创建2个请求
        const requests = [this.getSurveyPDFUrl(), this.getOrdersPDF()];
        Promise.all(requests)
          .then(results => {
            this.$nextTick(() => {
              this.$forceUpdate();
            });
            // 在这里执行最后一个函数
            this.getOrderInspectionRepor();
          })
          .catch(error => {
            console.error('请求失败:', error);
          });
      } else {
        //以下情况是主流程节点

        //保存当前节点
        this.currentNode = node;

        // 判断登录人是否为当前节点处理人
        if (
          node.handlerIds &&
          (node.handlerIds.indexOf(this.userId) != -1 ||
            node.handlerIds.indexOf(this.roleId) != -1 ||
            node.handlerIds.indexOf(this.orgId + '+' + this.roleId) != -1)
        ) {
          this.isHandler = true;
        } else {
          this.isHandler = false;
        }

        // 编辑表单悬浮球 条件:处理人有我 && 节点未处理 && 非子工作流和工作流列表
        if (
          node.handlerIds &&
          node.handlerIds.indexOf(this.userId) != -1 &&
          node.state == 0 &&
          node.nodeDef &&
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
            if (node.state == 0 && node.nodeDef && node.nodeDef.nodeType != 'placeOrder') {
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
        if (node.nodeDef && node.nodeDef.nodeType == 'subflows') {
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
          if (node.nodeDef && node.nodeDef.nodeType == 'placeOrder') {
            let hideNodeId = node.nodeDef.hideNodeId;
            if (hideNodeId) {
              for (let currentNode of this.nodes) {
                if (currentNode.nodeDef.nodeId == hideNodeId) {
                  if (currentNode.state == 10) {
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

          // 判断是否展示新增**表单按钮
          if (node.nodeDef && node.nodeDef.nodeType == 'forms') {
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

          // 判断是否展示新增表单按钮
          if (node.nodeDef && node.nodeDef.nodeType == 'repeat') {
            let hideNodeId = node.nodeDef.hideNodeId;
            if (hideNodeId) {
              for (let currentNode of this.nodes) {
                if (currentNode.nodeDef.nodeId == hideNodeId) {
                  if (currentNode.state == 10) {
                    this.newFormBtn = false;
                  }
                  break;
                }
              }
            }
          }

          // 获取多个表单
          if (node.nodeDef && node.nodeDef.nodeType == 'forms') {
            this.getForms();
          }

          // 关联重复提交表单
          if (node.nodeDef && node.nodeDef.nodeType == 'repeat') {
            this.getFormList();
          }

          this.$forceUpdate();
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
        {
          sortField: 'createTime,_id',
          sortOrder: 'asc'
        },
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
                if (node.handlerIds && node.handlerIds.indexOf(this.userId) != -1) {
                  node.visible = true;
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
              exts: {},
              part: []
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
          'is:state|integer#and': 1,
          _all: '1'
        },
        res => {
          // 赋值当前表单colName，部分表单支持从工单相册选择照片
          this.currentColName = res.data[0] ? res.data[0].colName : '';
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

            // 当showValue为数组时存到exts.showValue
            extField.showValue = extField.exts.showValue || extField.showValue;

            //特殊类型字段默认值
            if (
              extField.type == 'file' ||
              extField.type == 'area' ||
              extField.type == 'scan' ||
              extField.type == 'addItem' ||
              extField.type == 'bizSelect' ||
              extField.type == 'data'
            ) {
              this.$set(this.formData, extField.name, []);
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
            /**
             * canvas类型字段
             */
            if (extField.type == 'canvas') {
              this.initCanvas(extField);
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

          // 如果街道字段有值且为数字时，查询街道数组后返显
          if (formData.subdistrict && formData.subdistrict == parseInt(formData.subdistrict)) {
            common.osg.getSubdistricts(this.SAFormData.area, res => {
              this.$set(this.options, 'subdistricts', res);
              this.$forceUpdate();
            });
          }
          this.formData = formData;
          this.inspectionSOPData = this.formData.inspectionSOPData;
          this.$forceUpdate();
          this.getInspectionCause();
          if (edit) this.openForm = true;
        },
        {
          noload: true
        }
      );
    },
    // 确认是保存表单还是提交表单，提交表单时才校验是否必填并处理工作流
    saveFormConfirm() {
      if (
        this.currentNode.nodeDef.handleButtons.some(item => item.action == 'saveForm' && item.show)
      ) {
        let message;
        if (this.formData.signImageUrl) {
          message = '客户已签字，“提交”将生成新版pdf文件发送给客户，请确认填写完成后再提交！';
        } else {
          message = '“提交”将生成新版pdf文件发送给客户，请确认填写完成后再提交！';
        }
        Dialog.confirm({
          title: '确认',
          message,
          confirmButtonText: '提交',
          showCancelButton: true,
          cancelButtonText: '保存表单',
          confirmButtonColor: '#d6000f',
          cancelButtonColor: '#106cff'
        })
          .then(() => {
            // on confirm 提交表单
            // setTimeout 防止第1个未关闭 第2个就弹出会有层级问题
            setTimeout(() => {
              this.saveForm();
            }, 300);
          })
          .catch(() => {
            // on cancel 保存表单，不处理工作流
            setTimeout(() => {
              this.saveForm('saveOnly');
            }, 300);
          });
      } else {
        this.saveForm();
      }
    },
    /**
     * 保存表单
     */
    saveForm(type) {
      if (common.osg.isRepeatClick('saveForm')) {
        return; //判断是否重复点击
      } else {
        this.disabled.saveForm = true; //禁用提交表单按钮 非重复点击
        this.$forceUpdate();
      }

      // 仅保存表单不处理工作流，不校验必填
      if (type != 'saveOnly') {
        //检测是否必填
        for (var extField of this.extFields) {
          if (extField.type == 'gap') {
            delete this.formData[extField.name];
          }
          if (extField.type == 'switch' && !this.formData[extField.name]) {
            this.formData[extField.name] = '0';
          }
          if (
            extField.required == '1' &&
            this.currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1 &&
            this.activeTab.detail.name.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
          ) {
            if (extField.type == 'file' || extField.type == 'cascade' || extField.multiple) {
              if (
                (!this.formData[extField.name] || this.formData[extField.name].length == 0) &&
                common.osg.showType(extField, this.formData, this.roleId)
              ) {
                common.osg.alert(
                  extField.frontEndConfig.errorMsg || extField.nameDisp + '为必填项'
                );
                this.disabled.saveForm = false; //取消禁用提交表单按钮
                return;
              }
            } else {
              if (
                !this.formData[extField.name] &&
                this.formData[extField.name] !== 0 &&
                common.osg.showType(extField, this.formData, this.roleId)
              ) {
                if (extField.type == 'dialog') {
                  common.osg.alert(extField.nameDisp);
                } else {
                  //如果根据其他字段值展示 不展示则不需要必填
                  common.osg.alert(extField.nameDisp + '为必填项');
                }
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

          // 将扩展字段放入exts
          if (!extField.preset) {
            this.formData.exts = this.formData.exts || {};
            this.formData.exts[extField.name] = this.formData[extField.name];
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
            workflowFormDefId: workflowData.nodeDef && workflowData.nodeDef.nodeTypeDef //小流程定义id
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
      params.inspectionSOPData = this.inspectionSOPData;
      params.sid = this.id;
      params.smodule = 'inspectionAppointment';
      params.state = 1;
      // 判断inspectionSOPData中的数据是否为必填
      if (this.formData.inspectionSOPData.length > 0) {
        for (var item of this.formData.inspectionSOPData) {
          if (!item.isQualified && item.required == '1') {
            common.osg.alert('是否合格为必填项');
            this.disabled.saveForm = false; //取消禁用提交表单按钮
            return;
          }

          if (
            (item.isQualified && !item.inspectionImg) ||
            (item.isQualified && item.inspectionImg.length == 0)
          ) {
            common.osg.alert(`内容为${item.content}的巡检图片为必填项`);
            // common.osg.alert('巡检图片为必填项');
            this.disabled.saveForm = false; //取消禁用提交表单按钮
            return;
          }
        }
      }
      /*重复提交表单 子流程 子流程列表*/
      if (
        this.activeTab.detail.name.nodeDef &&
        (this.activeTab.detail.name.nodeDef.nodeType == 'repeat' ||
          this.activeTab.detail.name.nodeDef.nodeType == 'subflow' ||
          this.activeTab.detail.name.nodeDef.nodeType == 'subflows')
      ) {
        var nodeFormDefId = this.currentNode.nodeDef.formDefId;
        params.workflowId = this.currentNode.workflowId; //运行时子流程_id
        params.nodeId = this.currentNode._id; //运行时子流程节点_id

        //重复提交节点 删掉_id 否则不是新增是更新
        if (this.currentNode.nodeDef && this.currentNode.nodeDef.nodeType == 'repeat') {
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
      // 状态默认值有效
      if (!params.state && params.state !== 0) {
        params.state = 1;
      }
      console.log('saveForm-dataStr', params);
      // 保存表单
      common.osg.ajax(
        `biz/extForm/upsert/${nodeFormDefId}`,
        {
          dataStr: JSON.stringify(params)
        },
        res => {
          // 提交勘察单自动生成勘察报告
          if (
            this.currentNode.nodeDef &&
            this.currentNode.nodeDef.nodeType == 'repeat' &&
            this.activeTab.detail.name &&
            this.activeTab.detail.name.nodeDef &&
            this.activeTab.detail.name.nodeDef.formDefId == '3807435364983262382'
          ) {
            // 不查询列表，tabChange会查询
            // this.createSurveyPDFUrl(res.data, true);
            // 保存测绘工具数据到后台，然后删除缓存
            this.surveyToolUpsert(res.data._id);
          }
          // 提交预约表单后，需要上门的，添加日程到手机日历
          if (nodeFormDefId == '2522989775781119510' && this.formData.need == '1') {
            // #ifdef MP-WEIXIN
            let address =
              this.area.areaList.county_list[this.SAFormData.area[2]] + this.SAFormData.address;
            // #endif
            // #ifdef APP-PLUS
            let address = this.area.county_list[this.SAFormData.area[2]] + this.SAFormData.address;
            // #endif
            common.osg.addPhoneCalendar({
              title: '上门勘察',
              startTime: this.formData.datetime,
              alarmOffset: 3600, // 提前1小时提醒
              location: address,
              description: this.formData.note
            });
          }
          //处理工作流
          if (
            this.activeTab.detail.name.nodeDef &&
            (this.activeTab.detail.name.nodeDef.nodeType == 'repeat' ||
              this.currentNode.nodeDef.nodeType == 'repeat')
          ) {
            // 重复提交节点需要单独调用工作流处理

            //刷新当前页面-刷新子流程
            this.tabChange(this.activeTab);
          } else {
            if (
              this.activeTab.detail.name.nodeDef &&
              this.activeTab.detail.name.nodeDef.nodeType == 'forms'
            ) {
              this.saveNodeExts(res.data);
            } else {
              // saveOnly仅保存表单数据，不处理工作流
              if (type != 'saveOnly' && this.currentNode.state != 10) {
                this.process(res.data._id);
              }
            }
          }
          // 清除暂存数据
          wx.removeStorageSync('temporaryForm');
          this.openForm = false;
          this.disabled.saveForm = false; //取消禁用提交表单按钮
          this.inspectionSOPData = []; //清楚勘察表单内容
        },

        {
          noload: true,
          fail: () => {
            // 解决工单表单提交失败无法继续提交的问题
            this.disabled.saveForm = false;
          }
        }
      );
    },
    addPhoneCalendar() {
      // #ifdef MP-WEIXIN
      let address =
        this.area.areaList.county_list[this.SAFormData.area[2]] + this.SAFormData.address;
      // #endif
      // #ifdef APP-PLUS
      let address = this.area.county_list[this.SAFormData.area[2]] + this.SAFormData.address;
      // #endif
      common.osg.addPhoneCalendar(
        {
          title: '上门勘察',
          startTime: this.formData.datetime,
          alarmOffset: 3600, // 提前1小时提醒
          location: address,
          description: this.formData.note
        },
        null,
        '点击按钮将跟进记录添加到日程提醒'
      );
    },
    /**
     * 关闭form表单
     */
    closeForm() {
      if (this.activeTab.detail.name.nodeDef.temporary) {
        this.temporaryForm();
      }
      this.openForm = false;
      this.disabled.saveForm = false;
      // SOP数据清楚
      this.inspectionSOPData = [];
      // 取消勘察单删除测绘数据
      this.surveyToolClear();
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
    async process(nodeFormDataId) {
      // 如果配置了确认提示语
      let confirmMessage;
      if (
        this.activeTab.detail.name.nodeDef &&
        (this.activeTab.detail.name.nodeDef.nodeType == 'subflow' ||
          this.activeTab.detail.name.nodeDef.nodeType == 'subflows')
      ) {
        //子流程或子流程列表下 节点关联表单
        confirmMessage = this.currentNode.nodeDef.confirmMessage;
      } else {
        confirmMessage = this.activeTab.detail.name.nodeDef.confirmMessage;
      }
      if (confirmMessage) {
        try {
          await new Promise((resolve, reject) => {
            common.osg.confirm(
              confirmMessage,
              () => {
                resolve();
              },
              {
                fail: () => {
                  reject();
                }
              }
            );
          });
        } catch (error) {
          // 点了取消
          return;
        }
      }

      // 避免重复填表单
      this.disabled.process = true;

      if (nodeFormDataId == 'complate') {
        if (
          this.activeTab.detail.name.nodeDef &&
          (this.activeTab.detail.name.nodeDef.nodeType == 'repeat' ||
            this.activeTab.detail.name.nodeDef.nodeType == 'forms')
        ) {
          if (!this.formList || this.formList.length == 0) {
            common.osg.alert('请至少填写1份表单！');
            this.disabled.process = false;
            return;
          }
        }
        //完成当前工作流
        var params = {
          workflowNodeId: this.activeTab.detail.name._id, //当前节点运行时_id
          nodeFormDefId: this.activeTab.detail.name.nodeDef.formDefId, //节点表单定义id formDefId
          nodeFormDataId: '', //关联子流程列表的节点无数据id
          smodule: 'inspectionAppointment', //来源模块
          sid: this.id //工单id
        };
      } else {
        var params = {
          workflowNodeId: '', //当前节点运行时_id
          nodeFormDefId: '', //节点表单定义id formDefId
          nodeFormDataId: nodeFormDataId, //节点表单数据_id（就是填完表单后，返回的_id）
          smodule: 'inspectionAppointment', //来源模块
          sid: this.id //工单id
        };
        if (
          this.activeTab.detail.name.nodeDef &&
          (this.activeTab.detail.name.nodeDef.nodeType == 'subflow' ||
            this.activeTab.detail.name.nodeDef.nodeType == 'subflows')
        ) {
          //子流程或子流程列表下 节点关联表单
          params.nodeFormDefId = this.currentNode.nodeDef.formDefId;
          params.workflowNodeId = this.currentNode._id;
        } else {
          //主流程节点关联表单
          params.nodeFormDefId = this.activeTab.detail.name.nodeDef.formDefId;
          params.workflowNodeId = this.activeTab.detail.name._id;

          if (
            this.activeTab.detail.name.nodeDef &&
            this.activeTab.detail.name.nodeDef.nodeType == 'forms'
          ) {
            params.nodeFormDefId = '';
            params.nodeFormDataId = '';
          }
          //主流程节点 刷新表单需要提供表单数据id activeTab.detail.name.formDataId ,否则需要重新getSAData重新获取主流程
          this.activeTab.detail.name.formDataId = nodeFormDataId;
        }
      }

      common.osg.ajax('workflow/process', params, res => {
        if (this.currentNode.nodeDef.name == '签字') {
          this.disabled.process = true;
        } else {
          this.disabled.process = false;
        }
        //修改当前节点的工作流状态 禁用新增服务项和完成按钮
        if (nodeFormDataId == 'complate') {
          this.activeTab.detail.name.state = 10;
          //更新主工作流tab
          this.getSAData();
        } else if (
          this.activeTab.detail.name.nodeDef &&
          this.activeTab.detail.name.nodeDef.nodeType == 'subflows'
        ) {
          // 子流程列表内 某子流程的节点表单提交后 刷新当前子流程
          this.getSubWorkflow(this.subWorkflow.defId, this.subWorkflow.runId);
        } else if (
          this.activeTab.detail.name.nodeDef &&
          this.activeTab.detail.name.nodeDef.nodeType == 'forms'
        ) {
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
        smodule: 'inspectionAppointment', //来源模块
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
          smodule: 'inspectionAppointment',
          sid: this.id
        };
        common.osg.ajax('workflow/rollbackWorkflow', params, res => {
          if (
            this.activeTab.detail.name.nodeDef &&
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
          smodule: 'inspectionAppointment',
          sid: this.id
        };
        common.osg.ajax('workflow/takebackWorkflow', params, res => {
          if (
            this.activeTab.detail.name.nodeDef &&
            (this.activeTab.detail.name.nodeDef.nodeType == 'subflow' ||
              this.activeTab.detail.name.nodeDef.nodeType == 'subflows')
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
          smodule: 'inspectionAppointment',
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
        if (options.requestUrl || options.url) {
          // 请求业务档案列表
          common.osg.ajax(
            options.requestUrl || options.url,
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
        if (field == 'serviceGoods') {
          return this.formData.serviceGoods && this.formData.serviceGoods.length > 0
            ? `已选择${this.formData.serviceGoods.length}个服务商品`
            : '';
        }
        return common.osg.codelabel(
          options.option,
          options.value,
          this.signForm.show && this.signForm.options[options.option]
        );
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
      if (type == 'text' || type == 'phone') {
        this.formData[field] = String(value).trim();
      } else {
        this.formData[field] = value;
      }
      // 勘察单当部位是窗户时，输入长或宽自动计算平面面积
      if (
        this.activeTab.detail.name &&
        this.activeTab.detail.name.nodeDef &&
        this.activeTab.detail.name.nodeDef.formDefId == '3807435364983262382' &&
        this.formData.part &&
        this.formData.part[0] == '3' &&
        (field == 'length' || field == 'width')
      ) {
        if (this.formData.length && this.formData.width) {
          // 四舍五入保留两位小数，没有小数保留整数
          this.formData.planeArea = parseFloat(
            (Number(this.formData.length) * Number(this.formData.width)).toFixed(2)
          );
        } else if (this.formData.length === 0 || this.formData.width === 0) {
          this.formData.planeArea = 0;
        } else {
          this.formData.planeArea = '';
        }
      }
      // if (type == 'evaluate') {
      //   //根据脚本id匹配脚本公式
      //   let scritpId = e.target.dataset.extfield.frontEndConfig;
      //   let evaluate = this.options.script[scritpId];
      //   if (evaluate) {
      //     //变量赋值
      //     let arr = [];
      //     for (var item of evaluate.var) {
      //       arr.push(Number(this.formData[item]));
      //     }
      //     //公式计算
      //     let val = wx.binding.eval(evaluate.eval, arr, evaluate.func);
      //     if (val || val == 0) {
      //       this.formData[evaluate.res] = Math.abs((val.toFixed(2) * 100) / 100);
      //     }
      //     console.log(evaluate);
      //     console.log(this.formData[evaluate.res]);

      //     //计算"结果"关联的公式
      //     for (var extField of this.extFields) {
      //       if (extField.name == evaluate.res) {
      //         let resEvaluate = this.options.script[extField.frontEndConfig];
      //         if (resEvaluate) {
      //           //变量赋值
      //           let resArr = [];
      //           for (var item of resEvaluate.var) {
      //             resArr.push(Number(this.formData[item]));
      //           }
      //           //公式计算
      //           let resVal = wx.binding.eval(resEvaluate.eval, resArr, resEvaluate.func);
      //           console.log(resVal);
      //           if (resVal || resVal == 0) {
      //             this.formData[resEvaluate.res] = Math.abs((resVal.toFixed(2) * 100) / 100);
      //           }
      //           console.log('结果计算');
      //           console.log(evaluate);
      //           console.log(this.formData[evaluate.res]);
      //         }
      //         break;
      //       }
      //     }
      //   }
      // }
      //视图刷新
      this.$forceUpdate();
    },
    /**
     * 表单字段 失去焦点
     */
    onBlur(e) {
      let type = e.target.dataset.extfield.type;
      let field = e.target.dataset.extfield.name;
      let value = e.detail.value;
      if (
        (this.activeTab.detail.name &&
          this.activeTab.detail.name.nodeDef &&
          this.activeTab.detail.name.nodeDef.formDefId == '3807435364983262382' &&
          field == 'length') ||
        field == 'width'
      ) {
        this.formData[field] = parseFloat(Number(value.value).toFixed(2));
        this.$forceUpdate();
      }
      if (type == 'number') {
        // 只允许数字
        if (!/^\d+$/.test(String(value))) {
          this.formData[field] = '';
          this.$forceUpdate();
          common.osg.toast('输入格式不正确，请输入整数', 'none');
        }
      } else if (type == 'digit') {
        // 只允许数字和最多一个小数点
        if (!/^\d+(\.\d+)?$/.test(String(value))) {
          this.formData[field] = '';
          this.$forceUpdate();
          common.osg.toast('输入格式不正确，请输入整数或小数。', 'none');
        }
      }
    },
    onSignFormBlur(e) {
      let type = e.target.dataset.extfield.type;
      let field = e.target.dataset.extfield.name;
      let value = e.detail.value;
      if (type == 'number') {
        // 只允许数字
        if (!/^\d+$/.test(String(value))) {
          this.signForm.formData[field] = '';
          this.$forceUpdate();
          common.osg.toast('输入格式不正确，请输入整数', 'none');
        }
      } else if (type == 'digit') {
        // 只允许数字和最多一个小数点
        if (!/^\d+(\.\d+)?$/.test(String(value))) {
          this.signForm.formData[field] = '';
          this.$forceUpdate();
          common.osg.toast('输入格式不正确，请输入整数或小数。', 'none');
        }
      }
    },
    // 保留两位小数
    amountFilter(value) {
      if (!Number(value)) value = 0;
      return Number(value).toLocaleString('en-us', {
        maximumFractionDigits: 2, // 小数位最大保留位数：0-20
        minimumFractionDigits: 2 // 小数位最小保留位数：0-20
      });
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
      // 勘察-选择渗漏原因
      if (field == 'leakageCauseSelect') {
        if (!this.formData.leakageCause) {
          this.$set(this.formData, 'leakageCause', []);
        }
        if (this.leakageCauseSelect.items.length > 0) {
          let mainActiveIndex = this.leakageCauseSelect.items.findIndex(
            item => item.part == this.formData.part[0]
          );
          let leakageCauseSelect = {
            items: this.leakageCauseSelect.items,
            mainActiveIndex: mainActiveIndex != -1 ? mainActiveIndex : 0,
            activeId: this.formData.leakageCause,
            show: true
          };
          this.$set(this, 'leakageCauseSelect', leakageCauseSelect);
        } else {
          this.getLeakageCause(data => {
            let items = [];
            data.map(obj => {
              // 赋值组件需要用到的值
              obj.text = obj.label;
              obj.id = obj.leakageCause;
              // 处理成组件要求的数据结构
              if (items.find(item => item.part == obj.part)) {
                items.find(item => item.part == obj.part).children.push(obj);
              } else {
                items.push({
                  text: this.codelabel('select', 'partsOne', obj.part, this.opts.partsOne),
                  part: obj.part,
                  children: [obj]
                });
              }
            });
            let mainActiveIndex = items.findIndex(item => item.part == this.formData.part[0]);
            let leakageCauseSelect = {
              items,
              mainActiveIndex: mainActiveIndex != -1 ? mainActiveIndex : 0,
              activeId: this.formData.leakageCause,
              show: true
            };
            this.$set(this, 'leakageCauseSelect', leakageCauseSelect);
          });
        }
      } else if (field == 'serviceGoods') {
        if (!this.formData.serviceGoods) this.$set(this.formData, 'serviceGoods', []);
        this.getProjPackages();
        this.options['codecfg_repairPartsOne'] = { codeId: 'repairPartsOne' }; // 维修部位一级
        this.options['codecfg_agelimitFilter'] = { codeId: 'agelimitFilter' }; // 套餐质保年限过滤
        this.options['codecfg_packageType'] = { codeId: 'packageType' }; // 套餐类型
        this.options['codecfg_unit'] = { codeId: 'company' }; // 单位
        common.osg.codeoption();
        // 默认筛选当前部位的套餐
        if (this.formData.part && this.formData.part.length > 0) {
          this.serviceGoods.repairPart = this.formData.part[0];
        }
        this.serviceGoods.show = true;
      }
      //  else if (field == 'inspectionContent') {
      //   if (!this.formData.inspectionContent) this.$set(this.formData, 'inspectionContent', []);
      //   this.getInspectionSOP();
      //   // this.options['codecfg_repairPartsOne'] = { codeId: 'repairPartsOne' }; // 维修部位一级
      //   // this.options['codecfg_agelimitFilter'] = { codeId: 'agelimitFilter' }; // 套餐质保年限过滤
      //   // this.options['codecfg_packageType'] = { codeId: 'packageType' }; // 套餐类型
      //   // this.options['codecfg_unit'] = { codeId: 'company' }; // 单位
      //   common.osg.codeoption();
      //   // 默认筛选当前部位的套餐
      //   this.inspectionContent.show = true;
      // }
      // 巡检内容

      // 质量要求
      // 不合格原因
      else if (type == 'date' || type == 'time' || type == 'datetime') {
        this.datetime = {
          type,
          field,
          value:
            type == 'time'
              ? '12:00'
              : new Date(common.osg.readableTime(null, 'date') + ' 12:00:00').getTime(),
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
        // #ifdef APP-PLUS
        this.$refs.uniDataPicker &&
          this.$refs.uniDataPicker.show &&
          this.$refs.uniDataPicker.show();
        // #endif
      } else if (type == 'bizSelect') {
        var url = frontEndConfig.requestUrl || frontEndConfig.url;
        common.osg.ajax(
          frontEndConfig.requestUrl || frontEndConfig.url,
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
        // #ifdef MP-WEIXIN
        this.area.show = true;
        // #endif
        // #ifdef APP-PLUS
        this.$refs['uniAreaPicker' + field].show();
        // #endif
      } else if (type == 'dialog') {
        if (!common.osg.isRepeatClick('dialog')) {
          this.dialog.extField = extField;
          Object.assign(this.dialog, extField.frontEndConfig);
          clearInterval(this.dialog.timer);
          this.dialog.timer = setInterval(() => {
            this.dialog.countdown--;
            this.$forceUpdate();
            if (this.dialog.countdown <= 0) {
              this.dialog.countdown = 0;
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
        if (this.signForm.show) {
          this.signForm.formData[this.actionSheet.field] = e.detail.value;
        } else {
          this.formData[this.actionSheet.field] = e.detail.value;
        }
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
      // #ifdef MP-WEIXIN
      const { selectedOptions } = e.detail;
      // 组合value
      this.formData[this.cascader.field] = selectedOptions.map(item => item.value);
      // #endif
      // #ifdef APP-PLUS
      const { value } = e.detail;
      this.formData[this.cascader.field] = value.map(item => item.value);
      // #endif

      // 清空根据部位展示，但当前部位不展示的字段值
      if (this.cascader.field == 'part') {
        this.extFields.map(f => {
          // 清空根据部位展示，但当前部位不展示的字段值
          if (
            f.showField == 'part' &&
            !f.showValue.find(item => item.join() == this.formData.part.join())
          ) {
            if (f.type == 'file' || f.type == 'data' || f.multiple || f.type == 'cascade') {
              this.$set(this.formData, f.name, []);
            } else {
              this.$set(this.formData, f.name, '');
            }
          }
        });
      }
      if (this.formData.part.length > 0) {
        this.getInspectionSOP();
        this.getInspectionCause();
      }
      this.cascader.show = false;
      // #ifdef APP-PLUS
      this.$refs.uniDataPicker && this.$refs.uniDataPicker.hide && this.$refs.uniDataPicker.hide();
      // #endif
    },
    /**
     * 选择时间 提交
     */
    datetimeConfirm(e, type, field) {
      // APP端使用uni-datetime-picker组件
      if (type == 'uni') {
        e = { detail: e };
        this.datetime.type = 'datetime';
        this.datetime.field = field;
      }

      // #ifdef MP-WEIXIN
      let value = e.detail;
      // #endif
      // #ifdef APP-PLUS
      let value = e.detail || null; // uni-datetime-picker 清空时赋值为空字符串会显示NaN
      // #endif
      if (this.datetime.type == 'datetime') {
        // this.formData[this.datetime.field] = new Date(value)
        // 	.toLocaleString("chinese", {
        // 		hour12: false
        // 	})
        // 	.replace(/\//g, "-");
        // if (typeof this.formData[this.datetime.field] == "object") {
        if (this.signForm.show) {
          this.signForm.formData[this.datetime.field] = this.formattTime(value);
        } else if (this.records.show) {
          this.records.formData.taskTime = this.formattTime(value);
        } else {
          this.formData[this.datetime.field] = this.formattTime(value);
        }
        // }
      } else if (this.datetime.type == 'date') {
        if (this.signForm.show) {
          this.signForm.formData[this.datetime.field] = this.formattDate(value);
        } else {
          this.formData[this.datetime.field] = this.formattDate(value);
        }
      } else if (this.datetime.type == 'time') {
        if (this.signForm.show) {
          this.signForm.formData[this.datetime.field] = value;
        } else {
          this.formData[this.datetime.field] = value;
        }
      }
      this.datetime.show = false;
    },
    //时间格式转化（年月日时分秒）
    formattTime(dateValue) {
      let value = dateValue;
      if (typeof dateValue == 'object') {
        value == value.valueOf();
      }
      // 判断是否是日期格式 如果是就不需要处理了 iOS 真机调试 NAN
      const formattedDatePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      if (typeof dateValue === 'string' && formattedDatePattern.test(dateValue)) {
        return dateValue;
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
    //时间格式转化（年月日）
    formattDate(dateValue) {
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
      // let h = date.getHours();
      // let m = date.getMinutes();
      // let s = date.getSeconds();
      return Y + M + zeroFill(D);
    },
    // 时间类型清除
    dateClear(extField) {
      this.formData[extField.name] = '';
      this.$forceUpdate();
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
    areaConfirm(e, field) {
      let values = e.detail.values || e.detail.value;
      let areaVal = [];
      if (values.length >= 1) {
        this.formData.province = values[0].code || values[0].value;
        areaVal.push(values[0].code || values[0].value);
      }
      if (values.length >= 2) {
        this.formData.city = values[1].code || values[1].value;
        areaVal.push(values[1].code || values[1].value);
      }
      if (values.length >= 3) {
        this.formData.district = values[2].code || values[2].value;
        areaVal.push(values[2].code || values[2].value);
      }
      if (this.signForm.show) {
        this.signForm.formData[field || this.area.field] = areaVal; //adcode的数组
      } else {
        this.formData[field || this.area.field] = areaVal; //adcode的数组
      }
      // #ifdef MP-WEIXIN
      this.area.show = false;
      // #endif
      // #ifdef APP-PLUS
      if (this.signForm.show) {
        this.$refs['uniSignFormAreaPicker' + this.area.field].hide();
        this.area.show = false;
      } else {
        this.$refs['uniAreaPicker' + this.area.field].hide();
      }
      // #endif
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
     * 点击查看全部 弹窗展示
     */
    dataClick(field, data) {
      this[field] = {
        show: true,
        data
      };
    },
    /**
     * 上传图片
     * unlimited 上传测绘照片不限制张数，替换原有照片
     */
    afterRead(e, type) {
      let extfield = e.target.dataset.extfield || e.target.dataset.extField;
      if (!this.formData[extfield.name]) {
        this.$set(this.formData, extfield.name, []);
      }
      if (extfield && extfield.frontEndConfig && extfield.frontEndConfig.max) {
        if (extfield.frontEndConfig.max < this.formData[extfield.name].length + 1) {
          if (type == 'surveyTool') {
            // 测绘工具字段超出最大上传张数时，数删除最后1张，自动上传新的测绘照片
            e.detail.index = this.formData[extfield.name].length - 1;
            this.deleteFile(e);
          } else {
            common.osg.alert('只能上传' + extfield.frontEndConfig.max + '张！');
            return;
          }
        }
      }

      // 勘察单除测绘图、红外照片现场图外，最多允许上传18张照片
      if (
        this.activeTab.detail.name &&
        this.activeTab.detail.name.nodeDef &&
        this.activeTab.detail.name.nodeDef.formDefId == '3807435364983262382' &&
        extfield.name != 'surveyDrawing' &&
        extfield.name != 'infraredImageList'
      ) {
        let number = 0; // 统计已上传图片张数
        this.extFields.map(f => {
          if (
            f.type == 'file' &&
            f.name != 'surveyDrawing' &&
            f.name != 'infraredImageList' &&
            this.formData[f.name] &&
            this.formData[f.name].length > 0
          )
            number += this.formData[f.name].length;
        });
        // 已上传图片张数 + 本次上传张数
        if (number + e.detail.file.length > 18) {
          common.osg.alert(
            `除测绘图、红外照片现场图外，最多允许上传18张照片！已上传${number}张，本次上传${e.detail.file.length}张，请删除部分照片后重新上传！`
          );
          return;
        }
      }
      Toast.loading({
        message: '上传中',
        mask: true,
        forbidClick: true,
        duration: 0,
        position: 'top'
      });
      common.osg.afterRead(e, this, this.longitude, this.latitude, type => {
        if (type == 'fail') {
          Toast.clear();
          return;
        }
        Toast.clear();
        // 上传成功后的回调
        // 如果图片带渗漏原因，插入渗漏原因字段
        if (extfield.exts.leakageCause) {
          if (this.formData.leakageCause) {
            if (this.formData.leakageCause.indexOf(extfield.exts.leakageCause) == -1) {
              this.formData.leakageCause.push(extfield.exts.leakageCause);
            }
          } else {
            this.$set(this.formData, 'leakageCause', [extfield.exts.leakageCause]);
          }
        }
      });
    },
    /**
     * 删除图片
     */
    deleteFile(e) {
      let field = e.target.dataset.field;
      let extfield = e.target.dataset.extfield;
      let index = e.detail.index;
      if (this.signForm && this.signForm.show) {
        this.signForm.formData[field].splice(index, 1);
      } else {
        this.formData[field].splice(index, 1);
        // 如果图片带渗漏原因，图片全部删除后，删除渗漏原因中对应内容
        if (
          this.formData[field].length == 0 &&
          extfield.exts.leakageCause &&
          this.formData.leakageCause
        ) {
          this.formData.leakageCause.splice(
            this.formData.leakageCause.indexOf(extfield.exts.leakageCause),
            1
          );
        }
      }
      this.$forceUpdate();
    },
    // 点击上传文件组件
    uploaderClick(field, step) {
      this.album.field = field;
      if (step) {
        this.album.addForStep = true;
        this.album.step = step;
      } else {
        this.album.addForStep = false;
        this.album.step = {};
      }
    },
    /**
     * 监听用户下拉动作
     */
    onPullDownRefresh() {
      this.tabChange(this.activeTab);
    },

    /**
     * 获取活动
     */
    // 获取当前角色可查看的动态类型
    getMyActionTypes() {
      let myActionTypes = [];
      let myActionTypeValues = [];
      this.currentRoleButtons.map(item => {
        if (item.code.startsWith('serviceAppointment.actionType')) {
          myActionTypes.push({
            name: item.memo,
            type: item.code.slice(-1),
            text: item.memo,
            value: item.code.slice(-1)
          });
          myActionTypeValues.push(item.code.slice(-1));
        }
      });
      this.log.myActionTypes = myActionTypes.sort((a, b) => a.type - b.type);
      this.log.myActionTypeValues = myActionTypeValues.sort((a, b) => a - b);
    },
    getLog() {
      if (this.log.myActionTypeValues.length == 0) return;
      common.osg.ajax(
        'biz/action/query.do',
        {
          bizType: 'inspectionAppointment',
          sid: this.id,
          actionType:
            this.log.type.length > 0 ? this.log.type.join() : this.log.myActionTypeValues.join()
        },
        res => {
          this.log.data = res.data.reverse();
        },
        {
          noload: true
        }
      );
    },
    // 过滤活动折叠面板展开或收起
    logCollapseChange(e) {
      // #ifdef MP-WEIXIN
      this.log.collapse = e.detail;
      // #endif
      // #ifdef APP-PLUS
      this.log.collapse = e;
      // #endif
    },
    //动态列表 跳转页面
    JumplogDetails(type, typeId) {
      console.log(type, typeId);
      switch (type) {
        //施工日志跳转
        case '4':
          common.osg.open('./logDetails', { obj: typeId });
          break;
        default:
      }
    },
    // 点击动态类型单元格选中checkbox
    logTypeClick(e) {
      const { index } = e.currentTarget.dataset;
      const checkbox = this.selectComponent(`.logType-${index}`);
      checkbox.toggle();
    },
    // 动态类型变更
    logTypeChange(e) {
      // #ifdef MP-WEIXIN
      this.log.type = e.detail;
      // #endif
      // #ifdef APP-PLUS
      this.log.type = e.detail.value;
      // #endif
      this.getLog();
    },
    formatLogType() {
      let typeLabel = '';
      if (this.log.type.length == 0 || this.log.type.length == this.log.myActionTypes.length) {
        return '全部';
      }
      if (this.log.type.length > 3) {
        return `已选择${this.log.type.length}种类型`;
      }
      this.log.myActionTypes.map(item => {
        if (this.log.type.indexOf(item.type) != -1) {
          typeLabel += item.name + '、';
        }
      });
      return typeLabel.substring(0, typeLabel.length - 1);
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
        'basic/order/clearOrderFieldQuery',
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
            currentPage.route == 'subpackages2/inspectionAppointment/inspectionAppointment'
              ? true
              : false;
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
        serviceType: this.SAFormData.serviceType
      });
    },
    //编辑订单按钮
    openEditOrder(state, orderData) {
      common.osg.confirm('确定编辑订单吗？', () => {
        let path = '../order/placeOrders';
        common.osg.open(path, {
          editType: state, //修改订单的类型，1编辑，2增项，3减项
          orderId: orderData._id,
          id: orderData.serviceAppointmentId,
          workflowFormDefId: orderData.workflowId, //小流程的定义id
          orphanId: orderData.exts && orderData.exts.orphanId ? orderData.exts.orphanId : '', //下单业务节点的数据id
          serviceType: this.SAFormData.serviceType,
          sourceType: this.SAFormData.exts.sourceType
        });
      });
    },
    /**
     * 下单
     */
    placeOrder() {
      let workflowSet = this.activeTab.detail.name;
      let path = '../order/placeOrders';
      common.osg.open(path, {
        id: this.id,
        workflowFormDefId: workflowSet.nodeDef.nodeTypeDef, //小流程的定义id
        orphanId: workflowSet._id, //下单业务节点的数据id
        serviceType: this.SAFormData.serviceType,
        sourceType: this.SAFormData.exts.sourceType
      });
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
          // calleeId,
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
      this.paymentLimit.customLimit = '';
    },
    customLimitChange(e) {
      this.paymentLimit.customLimit = e.detail;
    },
    paymentLimitClick(limit) {
      this.paymentLimit.limit = limit;
      if (limit != 'other') {
        this.paymentLimit.customLimit = '';
      }
    },
    paymentLimitConfirm() {
      if (this.paymentLimit.limit == 'other') {
        if (Number(this.paymentLimit.customLimit)) {
          this.paymentLimit.show = false;
        } else {
          common.osg.toast('请输入自定义限额！', 'none');
          return;
        }
      }
      this.paymentLimit.show = false;
      this.pay(this.paymentLimit.order);
    },
    paymentLimitCancel() {
      this.paymentLimit.order = {};
      this.paymentLimit.show = false;
    },
    paymentLimitBeforeClose(e) {},
    /**
     * 去支付
     */
    pay(item) {
      // 判断是否重复点击
      if (common.osg.isRepeatClick('pay')) {
        return;
      }

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
      this.$forceUpdate();

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
          quota:
            this.paymentLimit.limit == 'other'
              ? this.paymentLimit.customLimit
              : this.paymentLimit.limit
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
            this.$nextTick(() => {
              drawQrcode({
                width: 200,
                height: 200,
                canvasId: 'qrcode',
                // ctx: wx.createCanvasContext('qrcode'),
                text: res.data.qrcodeUrl
              });
            });
          }

          // 更新收款码有效期倒计时
          this.payment.countDown =
            2 * 60 * 60 * 1000 - (new Date().getTime() - new Date(res.data.timeStr).getTime());
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
        let url = '/basic/pay/handlePartnerWechatPayUpdateQRCode.do';
        if ((this.payment.obj.payType = 'ALi')) {
          url = '/basic/pay/handlePartnerALiPayUpdateQRCode.do';
        }
        common.osg.ajax(
          url,
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
              this.$nextTick(() => {
                drawQrcode({
                  width: 200,
                  height: 200,
                  // ctx: wx.createCanvasContext('qrcode'),
                  canvasId: 'qrcode',
                  text: res.data.qrcodeUrl
                });
              });
            }

            // 更新收款码有效期倒计时
            this.payment.countDown =
              2 * 60 * 60 * 1000 - (new Date().getTime() - new Date(res.data.timeStr).getTime());
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
        let url = '/basic/pay/handlePartnerWechatPayCloseOrder.do';
        if (this.payment.obj.payType == 'ALi') {
          url = '/basic/pay/handlePartnerALiPayCloseOrder.do';
        }
        common.osg.ajax(
          url,
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
        codecfg_serviceType: { codeId: 'serviceType' },
        cascadeCode_parts: { codeId: 'parts' },
        parts: []
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
            if (this.activeTab.detail.name == 'archives') {
              let obj = {
                qiniuUrl: item.qiniuUrls && item.qiniuUrls[item.qiniuUrls.length - 1],
                id: item.contractdocNum,
                name: '合同编号'
              };
              this.archivesData.push(obj);
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
    signClick(item, type) {
      this.signForm = {
        type,
        show: false,
        options: {},
        allFields: [],
        fields: [],
        formData: { exts: {} }
      };
      // 获取订单提交时的字段和字典
      this.getOrderFields(fields => {
        // 将提交字段赋值
        fields.map(f => {
          if (f.preset) {
            if (f.type == 'file') {
              if (item[f.name]) {
                if (!Array.isArray(item[f.name])) {
                  this.signForm.formData[f.name] = item[f.name].split(',').map(str => {
                    return { url: str };
                  });
                }
              } else {
                this.signForm.formData[f.name] = [];
              }
            } else if (item[f.name]) {
              this.signForm.formData[f.name] = item[f.name];
            }
          } else {
            if (f.type == 'file') {
              if (item.exts[f.name]) {
                if (!Array.isArray(item.exts[f.name])) {
                  this.signForm.formData[f.name] = item.exts[f.name].split(',').map(str => {
                    return { url: str };
                  });
                }
              } else {
                this.signForm.formData[f.name] = [];
              }
            } else if (item.exts[f.name]) {
              this.signForm.formData[f.name] = item.exts[f.name];
            }
          }
        });
        this.signForm.formData.id = item._id;
        // 默认客户类型个人，并展示对应客户类型的字段
        this.signForm.formData.personType = item.exts.personType
          ? String(item.exts.personType)
          : '0';
        this.signForm.fields = this.signForm.allFields.filter(item =>
          item.frontEndConfig.personType
            ? this.signForm.formData.personType == item.frontEndConfig.personType
            : true
        );
        // 展示提交字段
        this.signForm.show = true;
      });
    },
    onSignFormChange(e) {
      let field = e.target.dataset.extfield.name;
      let value = e.detail;
      let type = e.target.dataset.extfield.type;
      if (type == 'text' || type == 'phone') {
        this.signForm.formData[field] = String(value).trim();
      } else {
        this.signForm.formData[field] = value;
      }

      if (field == 'personType') {
        this.signForm.fields = this.signForm.allFields.filter(item =>
          item.frontEndConfig.personType ? value == item.frontEndConfig.personType : true
        );
      }
    },
    onSignFormClick(e) {
      let extField = e.target.dataset.extfield || e.currentTarget.dataset.extfield;
      let type = extField.type;
      let field = extField.name;
      let value = e.detail;
      let valueOption = extField.valueOption;
      let frontEndConfig = extField.frontEndConfig;

      if (type == 'date' || type == 'time' || type == 'datetime') {
        this.datetime = {
          type,
          field,
          value:
            type == 'time'
              ? '12:00'
              : new Date(common.osg.readableTime(null, 'date') + ' 12:00:00').getTime(),
          show: true
        };
      } else if (type == 'select') {
        this.actionSheet = {
          actions: this.signForm.options[valueOption],
          field: field,
          type: '', //默认为空，type=addItem自定义项
          show: true
        };
      } else if (type == 'cascade') {
        this.cascader = {
          options: this.signForm.options[valueOption],
          field: field,
          type: '', //默认为空，type=addItem自定义项
          show: true
        };
        // #ifdef APP-PLUS
        this.$refs.uniDataPicker &&
          this.$refs.uniDataPicker.show &&
          this.$refs.uniDataPicker.show();
        // #endif
      } else if (type == 'bizSelect') {
        var url = frontEndConfig.requestUrl || frontEndConfig.url;
        common.osg.ajax(
          frontEndConfig.requestUrl || frontEndConfig.url,
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
            this.signForm.options[field] = res.data;
            this.actionSheet = {
              actions: this.signForm.options[field],
              field: field,
              type: 'bizSelect', //默认为空，type=addItem自定义项 , type=bizSelect选择对象列表
              show: false
            };
            this.actionSheet.show = true;
          }
        );
      } else if (type == 'area') {
        this.area.field = field;
        // #ifdef MP-WEIXIN
        this.area.show = true;
        // #endif
        // #ifdef APP-PLUS
        this.$refs['uniSignFormAreaPicker' + extField.name].show();
        // #endif
      } else if (type == 'dialog') {
        if (!common.osg.isRepeatClick('dialog')) {
          this.dialog.extField = extField;
          Object.assign(this.dialog, extField.frontEndConfig);
          clearInterval(this.dialog.timer);
          this.dialog.timer = setInterval(() => {
            this.dialog.countdown--;
            this.$forceUpdate();
            if (this.dialog.countdown <= 0) {
              this.dialog.countdown = 0;
              clearInterval(this.dialog.timer);
            }
          }, 1000);
          this.dialog.show = true;
        }
      }
      this.$forceUpdate();
    },
    signFormSubmit(type) {
      //防止按钮重复点击
      if (common.osg.isRepeatClick('placeOrder')) return;
      // 检测是否必填
      for (var extField of this.signForm.fields) {
        //对配置因为某个字段的值为某值的时候，不校验；dispensableField（某字段）dispensableValue（某值）
        if (extField.frontEndConfig && extField.frontEndConfig.dispensableField) {
          if (
            this.signForm.formData[extField.frontEndConfig.dispensableField] ==
            extField.frontEndConfig.dispensableValue
          )
            continue;
        }
        if (extField.type == 'switch' && !this.signForm.formData[extField.name]) {
          this.signForm.formData[extField.name] = '0';
        }
        if (
          extField.required == '1' &&
          !this.signForm.formData[extField.name] &&
          this.signForm.formData[extField.name] !== 0
        ) {
          common.osg.alert(extField.nameDisp + '为必填项');
          return;
        }

        //配置的下单名称校验，根据字典表配置的限制短词来校验
        if (extField.frontEndConfig && extField.frontEndConfig.placeOrderNameValidate) {
          //长度限制必须大于1
          if (!/^\p{Script=Han}+$/u.test(this.signForm.formData[extField.name])) {
            common.osg.alert(`${extField.nameDisp}格式错误，请输入中文`);
            return;
          }
          // 根据字典表配置的限制短词来校验
          for (let valiItem of this.signForm.options.placeOrderNameValidate) {
            if (this.signForm.formData[extField.name].indexOf(valiItem.name) != -1) {
              // common.osg.alert(`${extField.nameDisp}不符合姓名规范[${valiItem.name}]`);
              common.osg.alert(
                `输入的姓名不符合规范，请输入业主真实的姓名。若业主真实姓名确定为此，请联系开发人员处理！`
              );
              return;
            }
          }
          //长度限制必须大于1
          if (this.signForm.formData[extField.name].length <= 1) {
            common.osg.alert(`${extField.nameDisp}长度必须大于1`);
            return;
          }
        }

        if (extField.type == 'phone') {
          if (!this.checkMobile(this.signForm.formData[extField.name])) {
            common.osg.toast(extField.nameDisp + '格式错误', 'none');
            return;
          }
        } else if (extField.type == 'IDNumber') {
          if (!this.checkIDNumber(this.signForm.formData[extField.name])) {
            common.osg.toast(extField.nameDisp + '格式错误', 'none');
            return;
          }
        } else if (extField.type == 'select') {
          if (extField.frontEndConfig && extField.frontEndConfig.regular) {
            if (this.signForm.formData['certificateNum'])
              this.signForm.formData['certificateNum'] = this.signForm.formData[
                'certificateNum'
              ].replace(/\s+/g, ''); //去空格
            this.$forceUpdate();
            //TODO:写死的校验
            let str = String(this.signForm.formData[extField.name]);
            switch (str) {
              case '1':
                if (!isIDNumber(this.signForm.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
              case '2':
                if (!isPassport(this.signForm.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
              case '3':
                if (!isHongKongID(this.signForm.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
              case '4':
                if (!isOfficerID(this.signForm.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
              case '5':
                if (!isMTPs(this.signForm.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
            }
          }
          if (
            extField.required == '1' &&
            extField.name == 'contractType' &&
            Array.isArray(this.signForm.formData['contractType'])
              ? !this.signForm.formData['contractType'].length
              : false
          ) {
            common.osg.alert('请确认合同类型是否维护！');
            return;
          }
        } else if (extField.type == 'file') {
          if (
            extField.required == '1' && Array.isArray(this.signForm.formData[extField.name])
              ? !this.signForm.formData[extField.name].length
              : !this.signForm.formData[extField.name]
          ) {
            common.osg.alert(extField.nameDisp + '为必填项');
            return;
          }
        } else if (extField.required == '1' && extField.type == 'area') {
          if (this.signForm.formData[extField.name].length == 0) {
            common.osg.alert(extField.nameDisp + '为必填项');
            return;
          }
        }
      }
      let formData = common.osg.deepCopy(this.signForm.formData);
      for (let extField of this.signForm.fields) {
        //处理file类型，七牛下载地址为逗号隔开
        if (extField.type == 'file') {
          if (Array.isArray(formData[extField.name])) {
            formData[extField.name] = formData[extField.name].map(item => item.url).join(',');
          }
        }
        if (!extField.preset) {
          formData.exts[extField.name] = formData[extField.name];
          delete formData[extField.name];
        }
      }
      common.osg.ajax('basic/order/orderConfirm', { data: JSON.stringify(formData) }, res => {
        if (this.signForm.type) {
          this.offlineSign({ _id: this.signForm.formData.id });
        } else {
          this.sign({ _id: this.signForm.formData.id });
        }
        this.signForm.show = false;
      });
    },
    signFormClose() {
      this.signForm = {
        type: '',
        show: false,
        options: {},
        allFields: [],
        fields: [],
        formData: { exts: {} }
      };
    },
    getOrderFields(callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          colName: 'order',
          _all: '1',
          'is:state|integer#and': 1,
          'in:showList|string#and': '4',
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          // 赋值当前表单colName，部分表单支持从工单相册选择照片
          this.currentColName = 'order';
          for (let extField of res.data) {
            //解析frontEndConfig字段配置
            if (extField.frontEndConfig && common.osg.isJson(extField.frontEndConfig)) {
              extField.frontEndConfig = JSON.parse(extField.frontEndConfig);
            }
            //关联字典表codeType放到options,之后从字典表查询
            if (extField.valueOption) {
              this.signForm.options['codecfg_' + extField.valueOption] = {
                codeId: extField.valueOption
              };
            }
            //级联
            if (extField.type == 'cascade') {
              this.signForm.options['cascadeCode_' + extField.valueOption] = {
                codeId: extField.valueOption
              };
            }
          }
          // 提交订单时展示的字段
          this.signForm.allFields = res.data.filter(
            item =>
              item.frontEndConfig &&
              !item.frontEndConfig.signHide &&
              (item.frontEndConfig.showType == 'submitOrder' ||
                item.frontEndConfig.showType == 'sign') &&
              (item.frontEndConfig.serviceType && this.SAFormData.serviceType
                ? item.frontEndConfig.serviceType.indexOf(this.SAFormData.serviceType) != -1
                : true)
          );
          var cfgArr = [];
          var cascadeTypes = []; //级联的代码类型
          let opts = this.signForm.options;
          //配置的下单名称校验，根据字典表配置的限制短词来校验
          opts['codecfg_placeOrderNameValidate'] = {
            codeId: 'placeOrderNameValidate'
          };
          for (var o in opts) {
            if (o.startsWith('codecfg_')) {
              var cfg = opts[o];
              cfg['eleid'] = o.substring(8);
              cfgArr.push(cfg);
            }
            //组合级联代码类型
            if (o.startsWith('cascadeCode_')) {
              let type = o.substring(12);
              cascadeTypes.push(type);
            }
          }
          if (cfgArr.length > 0) {
            let params = JSON.stringify(cfgArr);
            common.osg.ajax(
              'i/code/selectCode.do',
              {
                jsonPara: params,
                tenantId: '1340835581184723420'
              },
              res => {
                if (res) {
                  for (var i = 0; i < res.length; i++) {
                    var opts = res[i],
                      os = opts.options;
                    var osArr = [];
                    for (var opt in os) {
                      osArr.push({
                        name: os[opt],
                        value: opt
                      });
                    }
                    // this.signForm.options[opts.eleid] = osArr;
                    this.$set(this.signForm.options, opts.eleid, osArr);
                    this.$forceUpdate();
                  }
                }
              },
              {
                noload: true
              }
            );
          }
          //查询级联代码表数据
          if (cascadeTypes.length > 0) {
            common.osg.ajax(
              'i/code/selectMultistageCode.do',
              {
                types: cascadeTypes.join(),
                tenantId: wx.getStorageSync('user').tenantId
              },
              res => {
                if (res) {
                  res.map(item => {
                    // 删除children为空数组的key，否则vant级联组件最后一级始终显示“请选择”
                    function deleteEmptyChildren(obj) {
                      if (obj.children.length == 0) {
                        delete obj.children;
                      } else {
                        obj.children.map(child => {
                          deleteEmptyChildren(child);
                        });
                      }
                    }
                    item.children.map(child => {
                      deleteEmptyChildren(child);
                    });
                    // this.signForm.options[item.type] = item.children;
                    this.$set(this.signForm.options, item.type, item.children);
                    this.$forceUpdate();
                  });
                }
              },
              {
                noload: true
              }
            );
          }
          if (callback) callback(this.signForm.allFields);
        },
        {
          noload: true
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
          // 关闭签约表单
          this.signFormClose();
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
                // 关闭签约表单
                this.signFormClose();
              });
            }
          );
        },
        {
          fail: () => {
            common.osg.clearRepeatClick('sign' + item._id);
          }
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
            return common.osg.formatCascade(option, val, opts);
          }
        } else if (type == 'CascadeMultiple') {
          return common.osg.formatCascadeMultiple(option, val);
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
    //合同状态
    checkContractStatus(item) {
      //没有完工日期 合同状态不等于签署成功  已撤回 已作废   是否超过了 10 分钟
      const currentTime = new Date();
      const createTime = new Date(item.createTime);
      const fiveMinutesInMilliseconds = 10 * 60 * 1000;
      const isTimeExceeded = currentTime - createTime > fiveMinutesInMilliseconds;

      return (
        item.state == '1' &&
        !item.endDate &&
        item.exts.contractStatus !== '10' &&
        item.exts.contractStatus !== '-1' &&
        item.exts.contractStatus !== '-2' &&
        this.isHandler &&
        isTimeExceeded
      );
    },
    //电子签约 超过10分钟  刷新合同签约状态
    contractStatusRefresh(id) {
      common.osg.ajax(
        '/signature/syncContract',
        {
          contractId: id
        },
        res => {
          common.osg.alert('操作成功');
        }
      );
    },
    //取消合同
    cancelContract(data) {
      let message =
        '发起取消合同后将无法恢复至可签约或已成功签署状态，请再次确认你是否要执行这一操作？';
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
    download(e, url) {
      if (!url && common.osg.isRepeatClick('download')) {
        return;
      }
      let filePath = url || e.currentTarget.dataset.filename;
      if (
        filePath.indexOf('.jpg') != -1 ||
        filePath.indexOf('.jpeg') != -1 ||
        filePath.indexOf('.png') != -1 ||
        filePath.indexOf('.gif') != -1
      ) {
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
            wx.openDocument({
              filePath: res.tempFilePath
            });
          }
        });
      }
    },
    // 下载文件
    // #ifdef MP-WEIXIN
    saveFile(e, url) {
      var fileName = url || e.currentTarget.dataset.filename;
      var filePath = fileName;
      wx.downloadFile({
        url: filePath,
        success(res) {
          if (res.statusCode === 200) {
            //重新改写文件后缀
            wx.getFileSystemManager().saveFile({
              tempFilePath: res.tempFilePath,
              filePath: wx.env.USER_DATA_PATH + '/file.pdf',
              success(res) {
                const savedFilePath = res.savedFilePath;
                // savedFilePath 为存储后的文件路径
                wx.openDocument({
                  filePath: savedFilePath,
                  showMenu: true,
                  fileType: 'pdf',
                  success() {},
                  fail(err) {
                    console.error('打开 PDF 失败', err);
                  }
                });
              },
              fail(err) {
                console.error('保存失败', err);
              }
            });
          }
        },
        fail(err) {
          console.log('downloadFile-err', err);
        }
      });
    },
    // #endif
    // #ifdef APP-PLUS
    saveFile(e, url) {
      uni.showLoading({
        title: '正在下载'
      });
      url = url || e.currentTarget.dataset.filename;

      plus.downloader
        .createDownload(url, {}, (d, status) => {
          //d为下载的文件对象
          if (status == 200) {
            uni.hideLoading();
            // 下载成功，d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
            let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
            common.osg.alert(
              '已保存到手机文件夹：' + fileSaveUrl.match(/(Android|android)\/data\/.*/i)[0],
              () => {
                plus.runtime.openFile(fileSaveUrl); // 选择软件打开文件
              },
              '下载成功',
              '打开文件'
            );
          } else {
            //下载失败
            uni.hideLoading();
            plus.downloader.clear(); //清除下载任务
            common.osg.toast('下载失败，请稍后重试', 'none');
          }
        })
        .start();
    },
    // #endif
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
      let formTitle =
        obj.name + (this.activeTab.detail.name.nodeDef && this.activeTab.detail.name.nodeDef.name);
      this.viewAddForm(formDefId, formTitle);
    },
    // 重复提交表单 新增表单
    newForm() {
      let formDefId = this.activeTab.detail.name.nodeDef.formDefId;
      let formTitle = this.activeTab.detail.name.nodeDef && this.activeTab.detail.name.nodeDef.name;
      this.newFormSubmitBtn = true;
      this.viewAddForm(formDefId, formTitle);
    },
    // 查看单个表单
    viewAddForm(formDefId, formTitle, formDataId, form) {
      if (formDataId) {
        this.currentForm = form;
        // 判断编辑repeat表单时是否展示提交按钮
        let currentNode = this.activeTab.detail.name;
        if (currentNode.nodeDef && currentNode.nodeDef.nodeType == 'repeat') {
          let submitHideNodeId = currentNode.nodeDef.submitHideNodeId;
          if (submitHideNodeId) {
            for (let node of this.nodes) {
              if (node.nodeDef.nodeId == submitHideNodeId) {
                if (node.state == 10) {
                  this.newFormSubmitBtn = false;
                }
                break;
              }
            }
          }
        }
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
            exts: {},
            part: []
          };
          this.getTemporaryForm();
          // 新增表单部位从工单上带来
          // this.formData.part = this.SAFormData.exts.parts;
          this.$set(this.formData, 'part', this.SAFormData.exts.parts);
          this.$forceUpdate();
          this.getInspectionSOP();
          this.getInspectionCause();
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
          // TODO:恢复原来自动处理工作流逻辑
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
          'is:workflowId|string#and': currentNode.workflowId,
          'ne:state|integer#and': -1
        },
        res => {
          let now = new Date().getTime();
          res.data.map(item => {
            if (item.progress) {
              // item.progress > 0 ，表示正在生成勘察单或已经生成完勘察单。
              if (item.progress == 100) {
                let updateTime = new Date(item.updateTime.replace(/-/g, '/')).getTime();
                if (now - updateTime <= 5000) {
                  // 如果是本次查询中生成到的100则展示进度条，如果是之前查询中已经生成到100则不展示进度条，解决进度条到100立即消失没有缓冲时间的问题。
                  item.progressShow = true;
                } else {
                  item.progressShow = false;
                }
              } else {
                item.progressShow = true;
              }
            } else {
              // 没有生成过勘察单不显示进度条
              item.progressShow = false;
            }
          });
          this.formList = res.data;
          // 判断是否有正在生成中的勘察单，如果有则定时查询进度
          if (res.data.find(item => item.progress > 0 && item.progress < 100)) {
            if (this.surveyTimer) clearInterval(this.surveyTimer);
            this.surveyTimer = setInterval(() => {
              this.getFormList();
            }, 5000);
          } else {
            if (this.surveyTimer) clearInterval(this.surveyTimer);
          }
        },
        {
          noload: true
        }
      );
    },
    // 删除重复提交节点表单
    removeRepeatForm(id) {
      common.osg.confirm('是否确认删除？', () => {
        common.osg.ajax(
          '/biz/extForm/remove/' + this.activeTab.detail.name.nodeDef.formDefId,
          { formDataId: id },
          () => {
            common.osg.toast('删除成功');
            this.getFormList();
          }
        );
      });
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
    contractCollapse(e) {
      this.activeNames = e.detail;
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
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    // 字段展示类型
    showType(field, formData) {
      return common.osg.showType(field, formData, this.roleId);
    },
    /**
     * 修改工单状态（不需要上门、上门未成交）
     */
    // 选择状态
    statusSelect(e) {
      this.changeStatus.status = e.detail.value;
      this.changeStatus.reasonShow = true;
    },
    // 选择原因
    reasonSelect(e) {
      this.changeStatus.reason = e.detail;
    },
    // 输入备注
    reasonChange(e) {
      this.changeStatus.memo = e.detail;
    },
    // 取消原因
    reasonCancel() {
      this.changeStatus.reasonShow = false;
      this.changeStatus.reason = '';
      this.changeStatus.memo = '';
    },
    // 保存原因
    reasonConfirm() {
      if (!this.changeStatus.reason) {
        common.osg.toast('请选择原因', 'none');
        return;
      }
      if (this.changeStatus.reason == 'other' && !this.changeStatus.memo) {
        common.osg.toast('请填写原因备注', 'none');
        return;
      }

      if (this.SAFormData.status == '104' || this.SAFormData.status == '105') {
        // 暂时不需要上门原因
        this.SAFormData.exts.reasons1 = this.changeStatus.reason;
        this.SAFormData.exts.memo1 = this.changeStatus.memo;
      } else {
        // 上门未成交
        this.SAFormData.exts.reason2 = this.changeStatus.reason;
        this.SAFormData.exts.memo2 = this.changeStatus.memo;
        this.SAFormData.exts.time204 = common.osg.readableTime();
      }
      this.SAFormData.status = this.changeStatus.status;
      this.SAFormData.exts = this.SAFormData.exts || {};
      this.statusUpsert();
      this.changeStatus = {
        statusShow: false,
        reasonShow: false,
        status: '', // 选择的工单状态
        reason: '', // 暂时不需要上门原因/上门未成交原因
        memo: '' // 其他原因备注
      };
    },
    // 更新工单状态和原因
    statusUpsert() {
      common.osg.ajax(
        'basic/inspectionAppointment/upsert.do',
        {
          inspectionAppointment: JSON.stringify(this.SAFormData)
        },
        res => {
          common.osg.toast('工单状态修改成功', 'none');
          this.getSAData();
        },
        {
          noload: true
        }
      );
    },
    // 获取全部渗漏原因
    getLeakageCause(callback) {
      common.osg.ajax(
        'biz/extForm/queryByColName/leakageCause',
        {
          _all: '1',
          sortField: 'partOrder,leakageCauseOrder',
          sortOrder: 'asc'
        },
        res => {
          if (callback) callback(res.data);
        }
      );
    },
    // 选择左侧部位
    leakageCauseClickNav({ detail = {} }) {
      this.leakageCauseSelect.mainActiveIndex = detail.index || 0;
    },
    // 选择右侧渗漏原因
    leakageCauseClickItem({ detail = {} }) {
      let index = this.formData.leakageCause.indexOf(detail.id);
      if (index == -1) {
        this.formData.leakageCause.push(detail.id);
      } else {
        this.formData.leakageCause.splice(index, 1);
      }
    },
    // 打开渗漏原因弹窗
    leakageCauseClick(data) {
      this.leakageCause = {
        show: true,
        data
      };
    },
    // 关闭渗漏原因弹窗
    leakageCauseClose() {
      this.leakageCause = {
        show: false,
        data: []
      };
    },
    // 生成勘察单
    createSurveyPDFUrl(form, doNotRequest) {
      common.osg.ajax('basic/survey/createSurveyPDFUrl', { sureyId: form._id }, () => {
        form.progress = 0;
        form.progressShow = true;
        if (!doNotRequest) this.getFormList();
      });
    },
    // 查看签约二维码
    getSignatureUrl(contractId) {
      common.osg.ajax(
        '/basic/contract/getContractSignatureUrl',
        { contractId },
        res => {
          this.signatureUrl.val = res.message;
          this.signatureUrl.show = true;
          this.$nextTick(() => {
            this.$refs.tkiQrcode._makeCode();
          });
        },
        {
          noload: true
        }
      );
    },
    clearCode() {
      this.signatureUrl.show = false;
      this.$refs.tkiQrcode._clearCode();
    },
    saveCode() {
      this.$refs.tkiQrcode._saveCode();
      this.signatureUrl.show = false;
    },
    /**
     * 推荐服务商品（套餐）
     */
    // 获取套餐列表
    getProjPackages() {
      common.osg.ajax(
        'biz/projPackage/queryWithRank',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'in:serviceType|array#and': this.SAFormData.serviceType,
          sourceType: this.SAFormData.exts.sourceType,
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          this.serviceGoods.data = res.data;
        },
        { noload: true }
      );
    },
    // 推荐、取消推荐
    recommended(id) {
      let index = this.formData.serviceGoods.indexOf(id);
      if (index == -1) {
        this.formData.serviceGoods.push(id);
      } else {
        this.formData.serviceGoods.splice(index, 1);
      }
    },
    // 当前部位推荐的服务商品数量
    projPackageTypeCount(type) {
      // 过滤的部位一级
      let count = 0;
      for (let i = 0; i < this.serviceGoods.data.length; i++) {
        let item = this.serviceGoods.data[i];
        if (
          this.formData.serviceGoods &&
          this.formData.serviceGoods.indexOf(item._id) != -1 &&
          item.exts &&
          item.exts.repairPart &&
          item.exts.repairPart.indexOf(`"${type}"`) != -1
        ) {
          count++;
        }
      }
      return count;
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    previewImage(filePath) {
      wx.previewImage({
        current: filePath, // 当前显示图片的http链接
        urls: [filePath] // 需要预览的图片http链接列表
      });
    },
    // 巡检SOP表
    getInspectionSOP() {
      if (common.osg.isJson(this.formData.part)) {
        this.formData.part = JSON.parse(this.formData.part);
      }
      common.osg.ajax(
        'biz/extForm/queryByColName/inspectionSOP',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'all:part|array#and': this.formData.part,
          sortField: 'sopOrder',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.isQualified = '';
          });
          this.$set(this, 'inspectionSOPData', res.data);
          this.$forceUpdate();
        }
      );
    },
    // 巡检原因表
    getInspectionCause() {
      common.osg.ajax(
        'biz/extForm/queryByColName/inspectionCause',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'all:part|array#and': this.formData.part,
          sortField: 'partOrder',
          sortOrder: 'asc'
        },
        res => {
          if (res.data.length > 0) {
            // 不合格原因
            let unCauseData = [];
            for (let i = 0; i < res.data[0].unCause.length; i++) {
              let obj = {
                name: res.data[0].unCause[i],
                text: res.data[0].unCause[i],
                value: res.data[0].unCause[i]
              };
              unCauseData.push(obj);
            }
            this.inspectionReason.unCauseData = unCauseData;
            // 巡检建议
            let suggestData = [];
            for (let i = 0; i < res.data[0].suggest.length; i++) {
              let obj = {
                name: res.data[0].suggest[i],
                text: res.data[0].suggest[i],
                value: res.data[0].suggest[i]
              };
              obj.name = res.data[0].suggest[i];
              suggestData.push(obj);
            }
            this.inspectionSuggest.suggestData = suggestData;
          }
        }
      );
    },
    // 是否合格内容关闭
    isQualifiedClose() {
      console.log('isQualifiedClose', this.inspectionSOPData, this.inspectionSOPDataIndex);
      this.inspectionSOPData[this.inspectionSOPDataIndex]['isQualified'] = '';
      this.inspectionSOPData[this.inspectionSOPDataIndex]['reason'] = [];
      this.inspectionSOPData[this.inspectionSOPDataIndex]['otherReason'] = '';
      this.inspectionSOPData[this.inspectionSOPDataIndex]['inspectionImg'] = [];
      this.isQualified.show = false;
    },
    // 不合格原因
    // reasonCloseDo() {
    //   this.inspectionReason.show = false;
    // },
    // reasonSelectDo(e) {
    //   // this.isQualifiedVal = e.detail.name;
    //   this.inspectionSOP.data.data[this.inspectionSOPDataIndex]['reason'] = e.detail.name;
    //   this.inspectionSOPData[this.inspectionSOPDataIndex]['reason'] = e.detail.name;
    //   console.log(this.inspectionSOPData);
    //   this.inspectionReason.show = false;
    // },
    // 不合格原因
    reasonChangeDo(e) {
      // #ifdef MP-WEIXIN
      this.reasonChangeData = e.detail;
      this.inspectionSOPData[this.inspectionSOPDataIndex]['reason'] = e.detail;
      // #endif
      // #ifdef APP-PLUS
      this.reasonChangeData = e.detail.value;
      this.inspectionSOPData[this.inspectionSOPDataIndex]['reason'] = e.detail.value;
      // #endif
    },
    // 其他原因字段
    otherCauseChange(e) {
      this.inspectionSOPData[this.inspectionSOPDataIndex]['otherReason'] = e.detail;
    },
    suggestChangeDo(e) {
      // #ifdef MP-WEIXIN
      this.suggestChangeData = e.detail;
      this.formData.suggest = e.detail;
      // #endif
      // #ifdef APP-PLUS
      this.suggestChangeData = e.detail.value;
      this.formData.suggest = e.detail.value;
      // #endif
    },
    // 是否合格
    isQualifiedSelect(e) {
      // 有不合格formState存1
      if (e.detail.value == 0) {
        this.formData.formState = 1;
      }
      this.inspectionSOPData[this.inspectionSOPDataIndex]['isQualified'] = e.detail.value;
      console.log(this.inspectionSOPData);
      this.isQualified.show = false;
    },
    inspectionSOPChange(e, i) {
      this.inspectionSOPData[i][e.target.dataset.extfield] = e.detail;
    },
    isQualifiedClick(e, val) {
      this.isQualified.show = true;
      this.inspectionSOPDataIndex = val;
    },
    // 不合格原因
    reasonClickDo(e, val) {
      this.inspectionSOPDataIndex = val;
      if (!this.inspectionSOPData[this.inspectionSOPDataIndex]['reason']) {
        this.reasonChangeData = [];
        this.$forceUpdate();
        this.inspectionReason.show = true;
      } else {
        this.reasonChangeData = this.inspectionSOPData[this.inspectionSOPDataIndex]['reason'];
        this.inspectionReason.show = true;
      }
      if (!this.inspectionSOPData[this.inspectionSOPDataIndex]['otherReason']) {
        this.otherReason = [];
        this.$forceUpdate();
        this.inspectionReason.show = true;
      } else {
        this.otherReason = this.inspectionSOPData[this.inspectionSOPDataIndex]['otherReason'];
        this.$forceUpdate();
        this.inspectionReason.show = true;
      }
    },
    // 巡检建议
    suggestClickDo() {
      this.inspectionSuggest.show = true;
    },
    format(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (!val || val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    formatT(option) {
      if (option) {
        var str = '';
        for (var j = 0; j < option.length; j++) {
          str += [j + 1] + '.' + option[j] + '、';
        }
        str = str.substring(0, str.length - 1);
        return str;
      } else {
        return;
      }
    },

    inspectionAfterRead(event, i, that, longitude, latitude, callback) {
      this.inspectionSOPDataIndex = i;
      const { file } = event.detail;
      //判断是否为数组，是则循环上传
      if (Array.isArray(file)) {
        for (let item of file) {
          this.fileUpToken(
            event,
            item.path,
            longitude,
            latitude,
            event.detail.capture,
            callback,
            item
          );
        }
      } else {
        this.fileUpToken(event, file.path, longitude, latitude, event.detail.capture, callback);
      }
    },
    //上传
    fileUpToken(event, filePath, longitude, latitude, capture, callback, currentFile) {
      let that = this;
      if (
        event.detail.file.url ||
        event.detail.file.path ||
        event.detail.file.tempFilePath ||
        event.detail.file.name
      ) {
        if (event.detail.file.url) {
          var strs = event.detail.file.url.split('.');
        } else if (event.detail.file.path) {
          var strs = event.detail.file.path.split('.');
        } else if (event.detail.file.tempFilePath) {
          var strs = event.detail.file.tempFilePath.split('.');
        } else {
          var strs = event.detail.file.name.split('.');
        }
      } else {
        var strs = event.detail.file[0] && event.detail.file[0].url.split('.');
      }
      let suffix = strs[strs.length - 1];
      common.osg.ajax(
        'back/super/file/upToken.do',
        {
          fileName: '12345.' + suffix
        },
        data => {
          filePath = Array.isArray(event.detail.file)
            ? currentFile.thumb || currentFile.url || currentFile.path
            : filePath ||
              event.detail.file.thumb ||
              event.detail.file.path ||
              event.detail.file.tempFilePath;
          // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
          wx.uploadFile({
            url: 'https://up-z1.qiniup.com',
            filePath,
            name: 'file',
            formData: data,
            success: res => {
              if (capture) {
                if ('album' == capture[0]) {
                  if (that.signForm && that.signForm.show) {
                    that.signForm.formData[event.target.dataset.field] =
                      that.signForm.formData[event.target.dataset.field] || [];
                    that.signForm.formData[event.target.dataset.field].push({
                      url: that.downloadUrl + JSON.parse(res.data).key
                    });
                  } else {
                    that.formData[event.target.dataset.field] =
                      that.formData[event.target.dataset.field] || [];
                    that.formData[event.target.dataset.field].push({
                      url: that.downloadUrl + JSON.parse(res.data).key
                    });
                  }

                  if (callback)
                    callback({
                      url: that.downloadUrl + JSON.parse(res.data).key
                    });
                  common.osg.toast('上传成功');
                  that.$forceUpdate();
                }
                if ('camera' == capture[0]) {
                  // 解析经纬度
                  let qiniuImagePath = that.downloadUrl + JSON.parse(res.data).key;
                  console.log('qiniuImagePath:===' + qiniuImagePath);
                  // 1.3 将获取到的 经纬度传值给 getAddress 解析出 具体的地址.
                  common.osg.ajax(
                    '/biz/image/uploadAddLogo.do',
                    {
                      qiniuImagePath: qiniuImagePath,
                      address: res,
                      latitude: latitude,
                      longitude: longitude
                    },
                    res => {
                      console.log('res.field:===' + res.field);
                      if (that.signForm && that.signForm.show) {
                        that.signForm.formData[event.target.dataset.field] =
                          that.signForm.formData[event.target.dataset.field] || [];
                        that.signForm.formData[event.target.dataset.field].push({
                          url: that.downloadUrl + res.field
                        });
                      } else {
                        that.formData[event.target.dataset.field] =
                          that.formData[event.target.dataset.field] || [];
                        that.formData[event.target.dataset.field].push({
                          url: that.downloadUrl + res.field
                        });
                      }
                      console.log('that.formData:===' + that.formData.url);
                      if (callback)
                        callback({
                          url: that.downloadUrl + res.field
                        });
                      common.osg.toast('上传成功');
                      that.$forceUpdate();
                    }
                  );
                }
              } else {
                // if (that.signForm && that.signForm.show) {
                //   that.signForm.formData[event.target.dataset.field] =
                //     that.signForm.formData[event.target.dataset.field] || [];
                //   that.signForm.formData[event.target.dataset.field].push({
                //     url: that.downloadUrl + JSON.parse(res.data).key,
                //     name: JSON.parse(res.data).key
                //   });
                // } else {
                that.inspectionSOPData[that.inspectionSOPDataIndex]['inspectionImg'] =
                  that.inspectionSOPData[that.inspectionSOPDataIndex]['inspectionImg'] || [];
                that.inspectionSOPData[that.inspectionSOPDataIndex]['inspectionImg'].push({
                  url: that.downloadUrl + JSON.parse(res.data).key,
                  name: JSON.parse(res.data).key
                });

                // that.formData[event.target.dataset.field] =
                //   that.formData[event.target.dataset.field] || [];
                // that.formData[event.target.dataset.field].push({
                //   url: that.downloadUrl + JSON.parse(res.data).key,
                //   name: JSON.parse(res.data).key
                // });
                // }

                if (callback)
                  callback({
                    url: that.downloadUrl + JSON.parse(res.data).key,
                    name: JSON.parse(res.data).key
                  });
                that.$forceUpdate();
              }
            }
          });
        },
        {
          noload: true
        }
      );
    },
    /**
     * 删除图片
     */
    inspectionDeleteFile(e) {
      let field = e.target.dataset.field;
      let extfield = e.target.dataset.extfield;
      let index = e.detail.index;
      if (this.signForm && this.signForm.show) {
        this.signForm.formData[field].splice(index, 1);
      } else {
        this.formData[field].splice(index, 1);
        // 如果图片带渗漏原因，图片全部删除后，删除渗漏原因中对应内容
        // if (
        //   this.formData[field].length == 0 &&
        //   extfield.exts.leakageCause &&
        //   this.formData.leakageCause
        // ) {
        //   this.formData.leakageCause.splice(
        //     this.formData.leakageCause.indexOf(extfield.exts.leakageCause),
        //     1
        //   );
        // }
      }
      this.$forceUpdate();
    },
    // 删除图片
    inspectionDeleteFile(e, i) {
      // if(){
      this.inspectionSOPData[i]['inspectionImg'].splice(e.detail.index, 1);
      // this.formData[f].splice(e.detail.index, 1);
      this.$forceUpdate();
      // }
    },
    // 点击测绘工具
    surveyToolClick(field) {
      wx.setStorageSync('surveyField', field);
      wx.removeStorageSync('surveyData');
      common.osg.open('../../subpackages2/survey/index');
    },
    // 将测绘工具保存的图片和统计数据保存到表单
    surveyToolSave() {
      // 当编辑表单状态、当前表单是勘察单时
      if (
        this.openForm &&
        this.activeTab.detail.name &&
        this.activeTab.detail.name.nodeDef &&
        this.activeTab.detail.name.nodeDef.formDefId == '3807435364983262382'
      ) {
        // 检查缓存中有测绘工具数据时，保存到表单
        let surveyField = wx.getStorageSync('surveyField');
        let surveyData = wx.getStorageSync('surveyData');
        if (surveyField && surveyData) {
          // 上传图片到七牛云再更新到表单
          this.afterRead(
            {
              detail: {
                file: [
                  {
                    url: surveyData.path
                  }
                ]
              },
              target: {
                dataset: {
                  extfield: surveyField,
                  field: surveyField.name
                }
              }
            },
            'surveyTool'
          );
          // 上传图片后会删除缓存中的surveyField，避免上传照片后触发onShow。
          wx.removeStorageSync('surveyField');
        }
      }
    },
    // 保存测绘工具数据到后台，然后删除缓存
    surveyToolUpsert(formDataId) {
      let surveyData = wx.getStorageSync('surveyData');
      if (!surveyData) return;
      common.osg.ajax(
        '/measurementData/upsert',
        {
          data: JSON.stringify({
            type: 'InspectionForm',
            typeId: formDataId,
            url: this.formData[surveyData.fieldName][0].url,
            statisticData: JSON.stringify(surveyData.statisticData),
            statisticTxt: surveyData.statisticTxt
          })
        },
        () => {
          wx.removeStorageSync('surveyField');
          wx.removeStorageSync('surveyData');
        }
      );
    },
    // 取消勘察单，删除测绘数据
    surveyToolClear() {
      if (
        this.activeTab.detail.name &&
        this.activeTab.detail.name.nodeDef &&
        this.activeTab.detail.name.nodeDef.formDefId == '3807435364983262382'
      ) {
        wx.removeStorageSync('surveyData');
      }
    },
    // 打开备注
    openRemark() {
      this.remark.content = this.SAFormData.describe;
      this.remark.show = true;
    },
    // 修改备注
    changeRemark(e) {
      this.remark.content = e.detail;
    },
    // 保存备注
    saveRemark() {
      if (!this.remark.content) {
        common.osg.toast('请输入备注内容', 'none');
        return;
      }
      this.SAFormData.describe = this.remark.content;
      common.osg.ajax(
        'basic/serviceAppointment/upsert.do',
        {
          serviceAppointment: JSON.stringify(this.SAFormData)
        },
        res => {
          common.osg.toast('备注保存成功', 'none');
          // 建单节点立即更新表单备注字段
          if (this.currentNode.nodeDef && this.currentNode.nodeDef.nodeId == '11582009884043') {
            this.formData.describe = this.remark.content;
          }
          this.remark.content = '';
        },
        {
          noload: true
        }
      );
      this.remark.show = false;
    },
    /**
     * 跟进记录
     */
    recordsShow() {
      this.$set(this, 'records', {
        show: true,
        formData: { remind: false, content: '' }
      });
    },
    recordsTaskTimeClick() {
      this.datetime = {
        type: 'datetime',
        field: 'taskTime',
        value: new Date(common.osg.readableTime(null, 'date') + ' 12:00:00').getTime(),
        show: true
      };
    },
    recordsRemindClick(e) {
      const checkbox = this.selectComponent(`.records-remind`);
      checkbox.toggle();
    },
    recordsRemindChange(e) {
      this.records.formData.remind = e.detail;
    },
    recordsContentChange(e) {
      this.records.formData.content = e.detail;
    },
    recordsSave() {
      if (this.records.formData.remind && !this.records.formData.taskTime) {
        common.osg.toast('请选择任务时间', 'none');
        return;
      }
      if (!this.records.formData.content) {
        common.osg.toast('请输入跟进记录内容', 'none');
        return;
      }
      common.osg.ajax(
        'biz/note/upsert',
        {
          data: JSON.strinigfy({
            sid: this.id,
            smodule: 'serviceAppointment',
            taskTime: this.records.formData.taskTime,
            content: this.records.formData.content,
            mediaContent: []
          })
        },
        res => {
          this.records.show = false;
          common.osg.toast('保存成功', 'none');
          // 刷新动态
          if (this.activeTab.detail.name == 'log') {
            this.getLog();
          }
          // 添加日程提醒
          if (this.records.formData.taskTime) {
            // #ifdef MP-WEIXIN
            this.records.remindShow = true;
            // #endif
            // #ifdef APP-PLUS
            common.osg.addPhoneCalendar({
              title: this.SAFormData.name + '的跟进记录',
              startTime: this.records.formData.taskTime,
              alarmOffset: 0, // 准时提醒
              location: this.area.county_list[this.SAFormData.area[2]] + this.SAFormData.address,
              description: this.records.formData.content
            });
            // #endif
          }
        }
      );
    },
    recordsCancel() {
      this.records.show = false;
    },
    // 添加日程提醒
    addReminder() {
      common.osg.addPhoneCalendar(
        {
          title: this.SAFormData.name + '的跟进记录',
          startTime: this.records.formData.taskTime,
          alarmOffset: 0, // 准时提醒 单位秒
          location:
            this.area.areaList.county_list[this.SAFormData.area[2]] + this.SAFormData.address,
          description: this.records.formData.content
        },
        null,
        '您已授权添加到日历，后续跟进记录可添加日程提醒！'
      );
    },
    /**
     * 通话录音
     */
    // 播放
    callPlay(item) {
      if (this.callRecord.audio && this.callRecord.state == 'paused') {
        this.callRecord.audio.play();
        return;
      }
      common.osg.md({ act: 'playCallRecording' });
      this.callRecord.recordUrl = item.recordUrl;
      const audio = wx.getBackgroundAudioManager(); // wx.createInnerAudioContext
      audio.title = this.SAFormData.name + '的通话录音' + item.createTime;
      audio.src = item.recordUrl; // 设置了 src 之后会自动播放
      this.callRecord.audio = audio;
      console.log('audio', audio);
      // 监听背景音频播放事件
      audio.onPlay(() => {
        this.callRecord.state = 'playing';
        // console.log('onPlay');
      });
      // 监听背景音频暂停事件
      audio.onPause(() => {
        this.callRecord.state = 'paused';
        // console.log('onPause');
      });
      // 监听背景音频完成跳转操作事件
      audio.onSeeked(() => {
        this.callRecord.seek = false;
        // console.log('onSeeked');
      });
      // 监听背景音频自然播放结束事件
      audio.onEnded(() => {
        this.callRecord.state = 'end';
        // console.log('onEnded');
      });
      // 监听背景音频停止事件
      audio.onStop(() => {
        this.callRecord.state = 'stop';
        // console.log('onStop');
      });
      // 监听背景音频播放进度更新事件，只有小程序在前台时会回调。
      audio.onTimeUpdate(() => {
        // 结束值(s)
        this.callRecord.max = Math.floor(this.callRecord.audio.duration);
        // 结束时间
        this.callRecord.endTime = this.formatCallRecordCurrentTime(this.callRecord.audio.duration);
        // 拖拽时不更新播放进度
        if (!this.callRecord.seek) {
          // 当前进度(s)
          this.callRecord.value = Math.floor(this.callRecord.audio.currentTime);
          // 当前时间
          this.callRecord.currentTime = this.formatCallRecordCurrentTime(
            this.callRecord.audio.currentTime
          );
        }
        // console.log('onTimeUpdate');
      });
      // 监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
      // audio.onCanplay(res => {
      //   console.log('onCanplay');
      // });
      // 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
      // audio.onWaiting(res => {
      //   console.log('onWaiting');
      // });
      // 监听背景音频播放错误事件
      audio.onError(res => {
        this.getLog();
        common.osg.alert('通话录音播放权限已超时，已为您自动最新，请点击播放按钮重试。');
        console.log('onError', res);
      });
      // 监听用户在系统音乐播放面板点击上一曲事件
      audio.onPrev(() => {
        // console.log('onNext');
        let callRecordUrls = [];
        let callRecords = [];
        this.log.data.map(item => {
          if (item.type == '3' && item.recordUrl) {
            callRecordUrls.push(item.recordUrl);
            callRecords.push(item);
          }
        });
        // 当有大于1条通话录音时
        if (callRecordUrls.length > 1) {
          // 当有上一曲时，即当前播放的不是第一曲。
          if (callRecordUrls.indexOf(this.callRecord.recordUrl) != 0) {
            this.callPlay(callRecords[callRecordUrls.indexOf(this.callRecord.recordUrl) - 1]);
          }
        }
      });
      // 监听用户在系统音乐播放面板点击下一曲事件
      audio.onNext(() => {
        // console.log('onNext');
        let callRecordUrls = [];
        let callRecords = [];
        this.log.data.map(item => {
          if (item.type == '3' && item.recordUrl) {
            callRecordUrls.push(item.recordUrl);
            callRecords.push(item);
          }
        });
        // 当有大于1条通话录音时
        if (callRecordUrls.length > 1) {
          // 当有下一曲时，即当前播放的不是最后一曲。
          if (callRecordUrls.indexOf(this.callRecord.recordUrl) != callRecordUrls.length - 1) {
            this.callPlay(callRecords[callRecordUrls.indexOf(this.callRecord.recordUrl) + 1]);
          }
        }
      });
    },
    // 暂停
    callPause() {
      this.callRecord.audio.pause();
    },
    // 拖拽当前时间进度条
    callProgressDrag(e) {
      this.callRecord.seek = true;
      this.callRecord.currentTime = this.formatCallRecordCurrentTime(e.detail.value);
      // console.log('callProgressDrag');
    },
    // 跳转到指定位置 单位s，精确到小数点后3位，即支持ms级别精确度。
    callSeek(e) {
      this.callRecord.seek = false;
      this.callRecord.audio.seek(e.detail);
      // console.log('callSeek');
    },
    // 停止
    // callStop() {
    //   this.callRecord.audio.stop();
    // },
    // 将秒转换为“天时:分:秒”
    formatCallRecordCurrentTime(s) {
      s = Math.floor(s);
      let str = '';
      let day = Math.floor(s / (60 * 60 * 24));
      if (day > 0) {
        str = day + '天';
        s = s % (60 * 60 * 24);
      }
      let hour = Math.floor(s / (60 * 60));
      if (hour > 0) {
        str += (hour < 10 ? '0' + hour : hour) + ':';
        s = s % (60 * 60);
      } else if (day > 0) {
        str += '00:';
      }
      let minute = Math.floor(s / 60);
      if (minute > 0) {
        str += (minute < 10 ? '0' + minute : minute) + ':';
        s = s % 60;
      } else {
        str += '00:';
      }
      str += s < 10 ? '0' + s : s;
      return str;
    },
    /**
     * 相册
     */
    // 查询相册子标签
    getSubAlbum() {
      if (Object.keys(this.albumSubLabel).length > 0) {
        // 已有子标签不再查询
        return;
      }
      let colNames = [];
      // 赋值子标签组空数组
      this.opts.albumLabel.map(item => {
        let colName = item.value;
        colNames.push(colName);
        this.albumSubLabel[colName] = [];
        // this.$set(this.albumSubLabel, colName, []);
      });
      // 查询所有子标签
      common.osg.ajax(
        'biz/extField/query',
        {
          _all: '1',
          'in:colName|array#and': colNames.join(),
          'is:type|string#and': 'file',
          sortField: 'order',
          sortOrder: 'asc',
          'is:state|integer#and': 1
        },
        res => {
          // 将所有子标签分组保存
          res.data.map(item => {
            this.albumSubLabel[item.colName].push({ name: item.nameDisp, value: item.name });
          });
          // 插入一级默认标签
          this.opts.albumLabel.unshift({ name: '默认', value: 'default' });
          // 没有子标签或大于1个子标签的，插入默认子标签
          colNames.map(colName => {
            if (this.albumSubLabel[colName].length != 1) {
              this.albumSubLabel[colName].unshift({ name: '默认', value: 'default' });
            }
          });
        },
        { noload: true }
      );
    },
    // 查询相册
    getAlbum() {
      common.osg.ajax(
        'biz/album/album',
        {
          data: JSON.stringify({
            bizType: 'serviceAppointment',
            bizId: this.id,
            labelName: 'ALL',
            handle: 'query'
          })
        },
        res => {
          this.album.data = res.data || [];
        }
      );
    },
    // 相册标签折叠面板
    albumLabelChange(e) {
      this.album.activeName = e.detail;
    },
    // 删除相册照片
    deletePhoto(e, labelName, i) {
      common.osg.ajax(
        'biz/album/album',
        {
          data: JSON.stringify({
            bizType: 'serviceAppointment', // 业务对象
            bizId: this.id, // 业务单据id
            labelName: labelName, // 标签名称
            handle: 'del', // add:新增照片
            photos: [e.target.dataset.url] // e.target.dataset解决直接传参uniapp编译问题
          })
        },
        res => {
          this.album.data[labelName].splice(i, 1);
        },
        { noload: true }
      );
    },
    labelPhotoCount(labelName, subLabels) {
      let count = 0;
      subLabels.map(subLabel => {
        let photos = this.album.data[labelName + '-' + subLabel.value];
        if (photos) {
          count += photos.length;
        }
      });
      return count;
    },
    // 打开工单相册
    albumShow() {
      this.getSubAlbum();
      this.getAlbum();
      this.album.addType = '1';
      this.album.checkedPhotos = []; // 不做：判断当前照片是否已存在，自动选中。
      this.album.show = true;
      this.$nextTick(() => {
        this.album.activeName = this.currentColName;
      });
    },
    // 关闭工单相册
    albumHide() {
      this.album.show = false;
    },
    // 修改照片添加方式
    albumAddTypeChange(e) {
      this.album.addType = e.detail;
    },
    // 点击选中或取消相片
    checkedPhotosChange(e) {
      this.album.checkedPhotos = e.detail;
    },
    // 从相册添加到表单
    addFromAlbum() {
      if (this.album.checkedPhotos.length == 0) {
        common.osg.toast('请至少勾选1张照片再提交', 'none');
        return;
      }
      common.osg.md({ act: 'uploadAlbumPhotos', photosCount: this.album.checkedPhotos.length });
      for (let labelName in this.album.data) {
        this.album.data[labelName].map(url => {
          // 已选中的图片（之前选中的，本次取消勾选不自动清空。）

          if (this.album.checkedPhotos.indexOf(url) != -1) {
            // 工序步骤上传图片
            if (this.album.addForStep) {
              let step = this.album.step;
              // 判断是否超过最大上传张数
              if (!step.max || step.urls.length < step.max) {
                // 判断当前照片是否已存在，不要重复添加
                if (!step.urls.find(item => item.url == url)) {
                  step.urls.push({ url: url });
                }
              } else {
                common.osg.toast(`${step.name}已达到最大上传张数，自动跳过。`, 'none');
              }
            } else {
              // 区分是签约表单还是节点关联表单
              let formData = {};
              if (this.signForm.show) {
                formData = this.signForm.formData;
              } else {
                formData = this.formData;
              }
              // 默认选项1 自动赋值到对应字段
              if (
                this.album.addType == '1' &&
                labelName.startsWith(this.currentColName) &&
                !labelName.endsWith('default')
              ) {
                // 1.1此表单标签-且非默认子标签，自动赋值到此表单对应字段
                let fieldName = labelName.split('-')[1];
                // 1.1.2字段子标签 添加到对应字段
                // 判断当前照片是否已存在，不要重复添加
                formData[fieldName] = formData[fieldName] || [];
                // 判断是否超过最大上传张数
                let field = this.signForm.show
                  ? this.signForm.allFields.filter(item => item.name == fieldName)[0]
                  : this.extFields.filter(item => item.name == fieldName)[0];
                if (field) {
                  let max = field.frontEndConfig.max || 0; // 0:不限制
                  if (max == 0 || formData[fieldName].length < max) {
                    if (!formData[fieldName].find(item => item.url == url)) {
                      formData[fieldName].push({ url: url });
                    }
                  } else {
                    common.osg.toast(`${field.nameDisp}已达到最大上传张数，自动跳过。`, 'none');
                  }
                }
              } else {
                // 1.2 default标签、此表单-默认子标签、非此表单标签、addType = 2，自动赋值到此表单当前字段
                // 判断当前照片是否已存在，不要重复添加
                formData[this.album.field.name] = formData[this.album.field.name] || [];
                // 判断是否超过最大上传张数
                let max = this.album.field.frontEndConfig.max || 0; // 0:不限制
                if (max == 0 || formData[this.album.field.name].length < max) {
                  if (!formData[this.album.field.name].find(item => item.url == url)) {
                    formData[this.album.field.name].push({ url: url });
                  }
                } else {
                  common.osg.toast(
                    `${this.album.field.nameDisp}已达到最大上传张数，自动跳过。`,
                    'none'
                  );
                }
              }
            }
          }
        });
      }
      this.albumHide();
    },
    // 按一级标签分类统计工单相册已勾选照片数
    checkedPhotosCount(label) {
      let checkedCount = 0; // 已选中数量
      let labelPhotosCount = 0; // 当前一级标签总标签数
      for (let key in this.album.data) {
        if (key.startsWith(label)) {
          let data = this.album.data[key];
          labelPhotosCount += data.length;
          data.map(url => {
            if (this.album.checkedPhotos.indexOf(url) != -1) {
              checkedCount += 1;
            }
          });
        }
      }
      return `${checkedCount} / ${labelPhotosCount} `;
    },
    // 预览照片
    previewPhoto(e, urls) {
      wx.previewImage({
        urls: urls,
        current: e.target.dataset.url,
        showmenu: true,
        fail() {
          common.osg.toast({ title: '预览图片失败', icon: 'none' });
        }
      });
    },
    // 取消从相册添加
    md(params) {
      common.osg.md(params);
    },
    // 主动触发暂存表单
    temporaryForm() {
      let params = {
        formData: this.formData, //表单数据
        formDefId: this.activeTab.detail.name.nodeDef.formDefId, //表单定义id
        formDataId: this.id //工单id
      };
      if (Object.keys(params.formData).length == 0) return;
      wx.setStorageSync('temporaryForm', params);
      common.osg.toast('已暂存', 'none');
    },
    getTemporaryForm() {
      let temporaryForm = wx.getStorageSync('temporaryForm');
      // 判断表单定义id和工单id相同才会赋值给表单
      if (
        temporaryForm.formDefId == this.activeTab.detail.name.nodeDef.formDefId &&
        temporaryForm.formDataId == this.id
      ) {
        this.formData = temporaryForm.formData;
        common.osg.toast('继续编辑', 'none');
      } else {
        this.formData = { exts: {} };
      }
      this.openForm = true;
    },
    // 获取勘察单
    getSurveyPDFUrl() {
      return new Promise(resolve => {
        common.osg.ajax(
          'biz/extForm/query/3807435364983262382',
          {
            sortField: 'createTime',
            sortOrder: 'desc',
            'is:sid|string#and': this.id
          },
          res => {
            res.data.map(item => {
              if (item.surveyPDFUrl) {
                let obj = {
                  surveyPDFUrl: item.surveyPDFUrl,
                  id: item.surveyNum,
                  name: '勘察编号'
                };
                this.archivesData.push(obj);
              }
            });
            resolve(`请求完成`);
          },
          {
            noload: true
          }
        );
      });
    },
    // 获取订单上的报价、质保Pdf
    getOrdersPDF() {
      return new Promise(resolve => {
        let params = {
          _all: '1',
          serviceAppointmentId: this.id,
          sortField: 'createTime',
          sortOrder: 'desc',
          'in:state|array-integer#and': '0,1'
        };
        common.osg.ajax(
          'basic/order/clearOrderFieldQuery',
          params,
          res => {
            res.data.map(item => {
              if (item.exts.bjdPDFurl) {
                let obj = {
                  bjdPDFurl: item.exts.bjdPDFurl,
                  warrentyYearPDFurl: item.exts.warrentyYearPDFurl,
                  id: item._id,
                  name: '订单编号'
                };
                this.archivesData.push(obj);
              }
            });
            resolve(`获取订单上的报价、质保Pdf`);
          },
          {
            noload: true
          }
        );
      });
    },
    // 获取上传状态
    uniFilePickerSelect(e, extField) {
      this.afterRead({
        detail: {
          file: e.tempFiles.map(item => {
            return {
              name: item.name,
              extname: item.extname,
              url: item.url,
              location: item.image.location
            };
          })
        },
        target: {
          dataset: {
            extfield: extField,
            field: extField.name
          }
        }
      });
    },
    // 上传失败
    uniFilePickerFail(e) {
      common.osg.toast('上传失败', 'none');
    },
    // 删除
    uniFilePickerDelete(e, extField) {
      console.log('删除文件：', e);
      this.deleteFile({
        target: {
          dataset: {
            extfield: extField,
            field: extField.name
          }
        },
        detail: {
          index: e.index
        }
      });
    },
    uniFilePickerClick(e, extField) {
      console.log('uniFilePickerClick', e, extField);
    },
    // 保存图片到手机相册
    saveImageToPhotosAlbum(url) {
      uni.downloadFile({
        url: url,
        success(res) {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              common.osg.toast('已保存到相册', 'none');
            }
          });
        }
      });
    },
    recordsClose() {
      console.log('recordsClose');
      this.records.show = false;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    // 获取订单上的勘查报告 -森
    getOrderInspectionRepor() {
      let params = {
        _all: '1',
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:sid|string#and': this.id
      };
      common.osg.ajax(
        'biz/extForm/query/3285058246984486156',
        params,
        res => {
          res.data.map(item => {
            if (item.acceptanceUrl) {
              let obj = {
                qiniuUrl: item.acceptanceUrl,
                id: item._id,
                name: '验收报告'
              };
              this.archivesData.push(obj);
            }
          });
          console.log('获取订单上的勘查报告', res);
        },
        {
          noload: true
        }
      );
    },
    //跳转施工日志
    JumpConstructionLog() {
      this.md({ act: 'SAOperation_constructionLog' });
      common.osg.open('../serviceAppointment/constructionlog', {
        id: this.id,
        serviceType: this.SAFormData.serviceType,
        sourceType: this.SAFormData.exts.sourceType
      });
    },
    /**
     * canvas
     */
    // 创建canvas
    initCanvas(field) {
      //获得Canvas的上下文
      this.canvas[field.name] = {
        ctx: uni.createCanvasContext(field.name + 'Canvas'),
        height: field.frontEndConfig.height || 200,
        touchs: []
      };
      if (field.frontEndConfig.type == 'tag') {
        // 设置背景图片
        this.bgImg(field);
      } else {
        //设置线的颜色
        this.canvas[field.name].ctx.setStrokeStyle('#000');
        //设置线的宽度
        this.canvas[field.name].ctx.setLineWidth(5);
        //设置线两端端点样式更加圆润
        this.canvas[field.name].ctx.setLineCap('round');
        //设置两条线连接处更加圆润
        this.canvas[field.name].ctx.setLineJoin('round');
      }
    },
    // 画布的触摸移动开始手势响应
    start(e, field) {
      console.log('start', e);
      if (field.frontEndConfig.type != 'tag') {
        let point = {
          x: e.touches[0].x,
          y: e.touches[0].y
        };
        this.canvas[field.name].touchs.push(point);
      }
    },

    // 画布的触摸移动手势响应
    move(e, field) {
      if (field.frontEndConfig.type != 'tag') {
        let point = {
          x: e.touches[0].x,
          y: e.touches[0].y
        };
        this.canvas[field.name].touchs.push(point);
        if (this.canvas[field.name].touchs.length >= 2) {
          this.draw(this.canvas[field.name].touchs, field);
        }
      }
    },

    // 画布的触摸移动结束手势响应
    end(e, field) {
      console.log(field.name, e);
      if (field.frontEndConfig.type == 'tag') {
        let point = {
          x: e.changedTouches[0].x,
          y: e.changedTouches[0].y
        };
        this.canvas[field.name].touchs.push(point);
        this.draw(this.canvas[field.name].touchs, field);
      } else {
        this.canvas[field.name].touchs = [];
      }
    },

    // 画布的触摸取消响应
    cancel: function (e, field) {
      console.log('cancel', e);
    },

    // 画布的长按手势响应
    tap: function (e, field) {
      console.log('tap', e);
    },

    // 当发生错误时触发
    error: function (e) {
      console.log('error', e);
    },

    //绘制
    draw(touchs, field) {
      let that = this;
      if (field.frontEndConfig.type == 'tag') {
        let point1 = touchs[0];
        console.log('draw', touchs);
        that.canvas[field.name].touchs = [];
        wx.downloadFile({
          url: field.frontEndConfig.tag,
          success(res) {
            wx.getImageInfo({
              src: res.tempFilePath,
              success(img) {
                that.canvas[field.name].ctx.drawImage(
                  res.tempFilePath,
                  point1.x - img.width / 2,
                  point1.y - img.height / 2
                );
                that.canvas[field.name].ctx.draw(true);
              }
            });
          }
        });
      } else {
        let point1 = touchs[0];
        let point2 = touchs[1];
        that.canvas[field.name].touchs.shift();
        that.canvas[field.name].ctx.moveTo(point1.x, point1.y);
        that.canvas[field.name].ctx.lineTo(point2.x, point2.y);
        that.canvas[field.name].ctx.stroke();
        that.canvas[field.name].ctx.draw(true);
      }
    },

    //清除画布
    canvasClear(field) {
      this.formData[field.name] = '';
      this.canvas[field.name].ctx.clearRect(0, 0, canvasWidth, this.canvas[field.name].height);
      this.canvas[field.name].ctx.draw();
      this.bgImg(field);
      this.$forceUpdate();
    },

    //保存图片
    canvasSave(field) {
      var that = this;
      uni.canvasToTempFilePath({
        canvasId: field.name + 'Canvas',
        success(res) {
          common.osg.ajax(
            'back/super/file/upToken.do',
            {
              fileName: '12345.' + res.tempFilePath.split('.')[1]
            },
            data => {
              wx.uploadFile({
                url: 'https://up-z1.qiniup.com',
                filePath: res.tempFilePath,
                name: 'file',
                formData: data,
                success: result => {
                  that.formData[field.name] = that.formData[field.name] || [];
                  that.formData[field.name] = common.osg.downloadUrl + JSON.parse(result.data).key;
                  common.osg.toast('图片保存成功');
                  that.$forceUpdate();
                }
              });
            },
            {
              noload: true
            }
          );
        }
      });
    },
    procedureDescClick(content, desc) {
      common.osg.alert(desc, null, content);
    },
    photograph() {
      // #ifdef MP-WEIXIN
      common.osg.open('/subpackages/serviceAppointment/camera', {
        bizId: this.id,
        serviceType: this.SAFormData.serviceType
      });
      // #endif
      // #ifdef APP-PLUS
      common.osg.open('/subpackages/serviceAppointment/camera2', {
        bizId: this.id,
        serviceType: this.SAFormData.serviceType
      });
      // #endif
    },
    //设置背景图片
    bgImg(field) {
      let that = this;
      wx.downloadFile({
        url: field.frontEndConfig.bgImg,
        success(res) {
          wx.getImageInfo({
            src: res.tempFilePath,
            success(img) {
              that.canvas[field.name].height = (canvasWidth * img.height) / img.width;
              that.canvas[field.name].ctx.drawImage(
                res.tempFilePath,
                0,
                0,
                canvasWidth,
                that.canvas[field.name].height
              );
              that.canvas[field.name].ctx.draw();
              that.$forceUpdate();
            }
          });
        }
      });
    },
    /**分享海报 */
    // 获取巡检海报
    getActivityDef() {
      var params = {
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1,
        'is:exts.activityDefType|string#and': '5'
      };
      common.osg.ajax('biz/activityDef/query', params, res => {
        res.data.map(item => {
          item.tplImageFileid = JSON.parse(item.tplImageFileid);
        });
        this.activityDefData = res.data;
        console.log(this.activityDefData, '---activityDefData');
      });
    },
    doChoosePic(e) {
      this.choosePicShow = true;
      this.chooseData = e;
    },
    getImg(e, i) {
      this.chooseImgData = e;
      this.backgroundpic = e.tplImageFileid[0].url;
      this.chooseImgIndex = i;
      console.log(this.backgroundpic, '---imgUrl');
    },
    confirmChoosePic() {
      // common.osg.md({ act: '保存巡检海报' });
      this.chooseImgData;
      this.choosePicShow = false;
      // 判断是默认海报就不去往图片上拼文字
      if (this.chooseImgData.name == '默认巡检海报') {
        this.savepicRoute = this.backgroundpic;
        this.posterShow = true;
        return;
      }
      if (this.chooseData.warrantyStartTime) {
        // 获取当前时间
        let warrantyStartTime = new Date(this.chooseData.warrantyStartTime);
        let startTime = warrantyStartTime.getTime();
        let time = new Date();
        let nowTime = time.getTime();
        let str = nowTime - startTime;
        str = +str + 1000;

        const day = parseInt(str / (1000 * 60 * 60 * 24));
        console.log(day, '---day');
        console.log(nowTime, '---nowTime');
        this.imgText1 = `您 的 ${this.codelabel(
          'select',
          'parts',
          this.chooseData.exts.parts[0]
        )} 已 于 ${this.chooseData.exts.subscribeTimeStr.slice(0, 10)} 完 成 巡 检`;
        this.imgText2 = `今 天 是 在 保 的 第 ${day + 1} 天`;
        this.imgText3 = `我 们 将 为 您 的 ${this.codelabel(
          'select',
          'parts',
          this.chooseData.exts.parts[0]
        )} 提 供 全 生 命 周 期 管 理`;
        this.imgY1 = 3600;
        this.imgY2 = 3830;
      } else {
        this.imgText1 = `您 的 ${this.codelabel(
          'select',
          'parts',
          this.chooseData.exts.parts[0]
        )} 已 于 ${this.chooseData.exts.subscribeTimeStr.slice(0, 9)} 完 成 巡 检`;
        this.imgText3 = `我 们 将 为 您 的 ${this.codelabel(
          'select',
          'parts',
          this.chooseData.exts.parts[0]
        )} 提 供 全 生 命 周 期 管 理`;
        this.imgY1 = 3830;
        this.imgY2 = '';
      }
      this.getBackgroundpicSize();
    },
    closeChoosePic() {
      this.choosePicShow = false;
    },
    getBackgroundpicSize() {
      let that = this;
      wx.getImageInfo({
        src: that.backgroundpic,
        success(res) {
          that.backgroundpicWidth = res.width;
          that.backgroundpicHeight = res.height;
          that.onCreateQrPoster();
          that.posterShow = true;
        }
      });
    },
    //分享给朋友
    share() {
      console.log(this.savepicRoute, '----this.savepicRoute');
      wx.showShareImageMenu({
        path: this.savepicRoute,
        success: res => {
          common.osg.toast('操作成功');
          console.log('分享成功：', res);
        },
        fail: err => {
          console.log('分享取消：', err);
        }
      });
    },
    onPosterSuccess(e) {
      this.savepicRoute = e;
      console.log(this.savepicRoute, '-----onPosterSuccess');
    },
    closePosterQrcode() {
      this.chooseImgIndex = '';
      this.chooseImgData = {};
      this.backgroundpic = '';
      this.imgText1 = ''; //海报拼接的第一行文字
      this.imgText2 = ''; //海报拼接的第二行文字
      this.imgText3 = '';
      this.savepicRoute = '';
      this.posterConfig = {};
      this.chooseData = {};
      //this.$refs.qrcode._clearCode()
      this.posterShow = false;
    },
    //二维码画布数据
    onCreateQrPoster() {
      console.log(this.backgroundpicWidth, this.backgroundpicHeight, '--图片的宽高');
      // setData配置数据
      this.posterConfig = {
        width: this.backgroundpicWidth,
        height: this.backgroundpicHeight,
        backgroundColor: '#ffffff',
        debug: false,
        pixelRatio: 1,
        // pixelRatio: 100,
        texts: [
          {
            x: 445,
            y: this.imgY1,
            text: this.imgText1,
            fontSize: 129,
            fontWeight: '1000',
            color: '#fff'
            // textAlign: 'center'
          },
          {
            x: 445,
            y: this.imgY2,
            text: this.imgText2,
            fontSize: 129,
            fontWeight: '1000',
            color: '#fff'
            // textAlign: 'center'
          },
          {
            x: 445,
            y: 4350,
            text: this.imgText3,
            fontSize: 129,
            fontWeight: '1000',
            color: '#fff'
            // textAlign: 'center'
          }
        ],
        images: [
          // 海报背景图
          {
            width: this.backgroundpicWidth,
            height: this.backgroundpicHeight,
            x: 0,
            y: 0,
            url: this.backgroundpic
            // zIndex: 1
          }
        ]
      };
      this.$nextTick(() => {
        poster2.create();
        this.$forceUpdate();
      });
      // this.backgroundpic = '';
      console.log(this.posterConfig, '二维码canvas数据');
    }
  }
};
</script>
<style>
.inspectionAppointment .van-cell__title {
  width: 130px !important;
  max-width: 130px !important;
  min-width: 130px !important;
  margin-right: 5px !important;
  flex: none !important;
}

.inspectionAppointment .van-cell__value {
  text-align: left !important;
}

.inspectionAppointment .van-cell__value .van-field__control {
  text-align: left;
}

.inspectionAppointment .c-radio-group,
.c-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  float: left;
}

.inspectionAppointment .c-radio-group .van-radio-group {
  display: flex;
}

.inspectionAppointment .c-checkbox-group .van-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}

.inspectionAppointment .c-card-tag {
  padding: 0 5px;
  border-radius: 2px;
  color: #fff;
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
  padding-bottom: 130rpx;
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

/* 渗漏原因弹窗 */
.inspectionAppointment .leakageCause-dialog {
  max-height: 80vh !important;
  top: 50% !important;
  display: flex;
  flex-direction: column;
}
.tki-qrcode {
  margin-bottom: 8px;
}

.inspectionAppointment .c-progress {
  margin: 15px 0 0;
}
.inspectionAppointment .c-progress .van-progress__portion {
  width: 0%;
  transition: width 2s;
}

.inspectionAppointment .van-field__label {
  color: #323233;
}

.van-uploader__preview .van-uploader__preview-delete:after {
  width: 20px;
  height: 20px;
  border-radius: 0 0 0 3px;
}
.van-uploader__preview .van-uploader__preview-delete .van-uploader__preview-delete-icon {
  font-size: 22px;
}
</style>
<style lang="scss">
.inspectionAppointment {
  .c-content {
    margin-top: 0;
    height: calc(100% - 142px);
    flex: 1;
    .c-selection-left {
      height: calc(100% - 5px);
      overflow: auto;
      background: #f5f5f7;
      padding-top: 5px;
      width: 80px;
      min-width: 80px;
      .c-selection-left-item {
        color: #999;
        font-size: 14px;
        text-align: center;
        padding: 10px;
      }
      .c-left-icon-blue {
        color: #106cff;
        font-weight: 600;
        font-size: 14px;
      }
      .c-left-icon-blue::before {
        position: absolute;
        top: 50%;
        left: 0;
        width: 4px;
        height: 23px;
        border-radius: 0px 5px 5px 0px;
        background-color: #106cff;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        content: '';
      }
    }
  }
  .c-selection-right {
    background-color: #f7f8fa;
    display: flex;
    flex-direction: column;
    .agelimit-tags {
      display: flex;
      justify-content: space-evenly;
      font-size: 14px;
      padding: 5px 0;
      background: #f5f5f7;
      .agelimit-tag {
        color: #999;
        padding: 3px 8px;
        border-radius: 20px;
      }
      .agelimit-tag-active {
        color: #106cff;
        background: #fff;
      }
    }
    .c-selection-right-item-icon {
      position: absolute;
      height: 16px;
      top: 26rpx;
      right: 10rpx;
    }
    .c-selection-right-item-image {
      min-width: 84px;
      width: 84px;
      height: 84px;
      border-radius: 16px;
      margin-right: 8px;
      background: #f7f7f7;
    }
  }

  .c-selection-right-item {
    background-color: #fff;
    margin: 8px 8px 0;
    padding: 8px !important;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .c-selection-right-item-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 84px;
      .desc {
        font-size: 12px;
        color: #999;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .desc-tag {
        margin-left: 10rpx;
        display: inline-flex;
        padding: 2rpx 10rpx;
        border-radius: 3px;
        color: #106cff;
        border: 0.5px solid #106cff;
        font-size: 8px;
      }
      .c-spec-button {
        background: #f9de55;
        font-size: 12px;
        width: 70px;
        height: 35px;
        box-sizing: border-box;
        color: #1a1a1a;
        display: flex;
        border: none;
      }
      .c-spec-button-blue {
        background: #106cff;
        color: #fff;
      }
    }
  }

  // 状态筛选折叠面板
  .collapse-type {
    &::after {
      border-top: none;
    }
    .van-collapse-item {
      // 筛选类型文字宽度
      .van-cell {
        .van-cell__title {
          width: 70px !important;
          max-width: 70px !important;
          min-width: 70px !important;
        }
        .van-cell__value {
          text-align: right !important;
        }
      }
      .collapse-item-type {
        padding: 0 20px;
        .cell-group-log {
          .van-cell {
            justify-content: space-between;
            box-shadow: none;
            .van-cell__value {
              flex: none;
              .van-checkbox__label {
                display: none;
              }
            }
          }
        }
      }
    }
  }

  // 操作区
  .actions-swiper {
    width: 100%;
    height: 90px;
    margin-bottom: -10px;
    .wx-swiper-dots {
      .wx-swiper-dot {
        width: 40rpx;
        height: 10rpx;
        border-radius: 4px;
      }
    }
  }

  // 跟进记录
  .cell-value-remind {
    flex: none;
    .van-checkbox__label {
      display: none;
    }
  }
  .confirm-button-addReminder {
    background: #07c160 !important;
  }

  // 通话录音
  .audio-wrapper {
    display: flex;
    align-items: center;
    flex: 1;
    .audio-slider {
      flex: 1;
      margin-left: 20px;
      margin-right: 30px;
      .slider-button {
        background-color: #106cff;
        color: #fff;
        border-radius: 20px;
        padding: 0 6px;
        min-width: 55px;
        text-align: center;
        box-sizing: border-box;
      }
    }
  }

  // 工单相册
  .album-popup {
    display: flex;
    flex-direction: column;
    .collapse-item-album-view {
      flex: 1;
      overflow-y: auto;
    }
  }
  // 相册
  .collapse-item-album {
    .van-cell__value {
      text-align: right !important;
    }
    .van-collapse-item__wrapper {
      background: #f7f8fa;
    }
    .collapse-item-content-album {
      margin: 10px;
      padding: 10px 0 0 10px;
      border-radius: 8px;
    }
  }
  .album-subLabelName {
    font-size: 14px;
    color: #646566;
  }
  .photos {
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    padding: 10px 0;
    .photo-view {
      display: flex;
      position: relative;
      .image-view {
        display: flex;
        margin-right: 10px;
        .image-item {
          border-radius: 3px;
          overflow: hidden;
        }
      }
      .image-delete {
        position: absolute;
        top: 5px;
        right: 15px;
        padding: 4px;
        color: #fff;
        background: #d6000f;
        border-radius: 50%;
      }
      .checkbox-albumPhotoCheck {
        width: 25px;
        height: 25px;
        position: absolute;
        top: 5px;
        right: 15px;
        .van-checkbox__icon {
          border-color: #fff;
        }
      }
    }
  }
  // 自定义分类选择器组件（勘察单渗漏原因）
  .c-tree-select {
    display: flex;
    .c-tree-select-left {
      display: flex;
      flex-direction: column;
      flex: 1;
      background-color: #f7f8fa;
      overflow-y: auto;
      > view {
        line-height: 44px;
        padding-left: 12px;
        font-size: 14px;
        font-weight: 500;
        border-left: 3px solid transparent;
        box-sizing: border-box;
      }
    }
    .c-tree-select-left-item-active {
      border-color: #ee0a24 !important;
      background-color: #fff;
    }
    .c-tree-select-right {
      display: flex;
      flex-direction: column;
      flex: 2;
      overflow-y: auto;
      > view {
        line-height: 44px;
        font-weight: 700;
        padding: 0 32px 0 16px;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .c-tree-select-right-item-icon {
          position: absolute;
          right: var(--padding-md, 16px);
          top: 50%;
          transform: translateY(-50%);
          align-items: center;
          display: inline-flex;
          justify-content: center;
        }
      }
      .c-tree-select-right-item-active {
        color: #ee0a24 !important;
      }
    }
  }
  .van-uploader__upload-text {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  ::v-deep .van-field__control--disabled {
    color: #323233 !important;
  }
  .canvas-view {
    border-top: 1px solid #ebedf0;
    border-bottom: 1px solid #ebedf0;
    background-color: #fff;

    .canvas-title {
      padding: 10px 16px;
    }

    .canvas-btns {
      padding: 10px 16px;
      display: flex;

      .canvas-btn {
        flex: 1;

        button {
          width: 100%;
        }
      }

      .canvas-btn:first-child {
        margin-right: 8px;
      }

      .canvas-btn:last-child {
        margin-left: 8px;
      }
    }
  }
}
.chooseImg {
  border: 3px solid #ff9800;
  border-radius: 5px;
}

.van-button-small {
  font-size: var(--button-small-font-size, 12px);
  height: var(--button-small-height, 30px);
  min-width: var(--button-small-min-width, 60px);
  padding: 0 var(--padding-xs, 8px);
  border: var(--button-border-width, 1px) solid var(--button-default-border-color, #ebedf0);
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-left: 20rpx;
  border-radius: 100px;
  box-sizing: border-box;
  .down {
    position: absolute;
    bottom: 120%;
    width: 100%;
    left: 0px;
    text-align: center;
    z-index: 2;
    background-color: #fff;
    padding: 10rpx;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 10px;
    view {
      margin: 10rpx 0px;
    }
  }
  .down::after {
    content: '';
    border-top: 16rpx solid #fff; /* 三角形的上边颜色 */
    border-left: 16rpx solid transparent; /* 左边透明 */
    border-right: 16rpx solid transparent; /* 右边透明 */
    position: absolute;
    bottom: -14rpx;
    left: 50%;
    transform: translateX(-50%);
  }
}
.mover {
  position: relative;
  width: 50rpx;
  margin-top: 10rpx;
  height: 30rpx;
  border: 2px solid #ddd;
  border-left: none;
  border-right: none;
  /* background-color: #ddd; */
}
.mover::before {
  content: '';
  position: absolute;
  width: 50rpx;
  top: 15rpx;
  border-top: 2px solid #ddd;
}
.active {
  box-shadow: 1px 1px 16rpx rgba(0, 0, 0, 0.1);
  background-color: #ecf9ff;
  border-bottom: none !important;
}
.l-drag {
  margin-bottom: -10px;
}
.l-drag-view {
  border-bottom: 1px solid #c8c9cc;
}
// #ifdef APP-PLUS
::v-deep .van-icon-arrow {
  transform: rotate(0deg) !important;
}
::v-deep .van-collapse-item__title--expanded .van-cell__right-icon {
  transform: rotate(-45deg) !important;
}
// #endif
</style>
