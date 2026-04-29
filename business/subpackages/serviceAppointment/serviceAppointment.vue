<template>
  <view
    class="serviceAppointment c-box"
    :class="openForm || signForm.show ? 'c-hidden c-h-50rpx' : ''"
    @click.capture="track"
  >
    <!-- 摘要信息 -->
    <view class="c-card c-m-b-0" v-if="!canvas.canvasSignatureDataShow">
      <view class="c-card-title">
        <view
          v-if="
            SAFormData.exts.sourceType == '1' ||
            SAFormData.exts.sourceType == '2' ||
            SAFormData.exts.sourceType == '5'
          "
          class="c-card-tag"
          @click="copy(SAFormData.orderNum)"
          :data-event="{ id: 't7oxFDXyWj' }"
        >
          <view class="c-card-tag-title c-bg-red" :data-event="{ id: 't7oxFDXyWj' }">雨虹</view>
          <view class="c-card-tag-info c-red c-border-red" :data-event="{ id: 't7oxFDXyWj' }">
            <text :data-event="{ id: 't7oxFDXyWj' }">{{ SAFormData.orderNum || '' }}</text>
            <text class="c-size-13 c-weight-normar" :data-event="{ id: 't7oxFDXyWj' }">丨复制</text>
          </view>
        </view>
        <view
          v-else-if="
            SAFormData.exts.sourceType == '3' ||
            SAFormData.exts.sourceType == '4' ||
            SAFormData.exts.sourceType == '8'
          "
          class="c-card-tag"
          @click="copy(SAFormData.orderNum)"
          :data-event="{ id: 'floPujOG4n' }"
        >
          <view class="c-card-tag-title c-bg-blue" :data-event="{ id: 'floPujOG4n' }">修链</view>
          <view class="c-card-tag-info c-blue c-border-blue" :data-event="{ id: 'floPujOG4n' }">
            <text :data-event="{ id: 'floPujOG4n' }">{{ SAFormData.orderNum || '' }}</text>
            <text class="c-size-13 c-weight-normar" :data-event="{ id: 'floPujOG4n' }">丨复制</text>
          </view>
        </view>
        <view
          v-else-if="SAFormData._id"
          class="c-card-tag"
          @click="copy(SAFormData.orderNum)"
          :data-event="{ id: 'sryNB6FUfZ' }"
        >
          <view class="c-card-tag-title c-bg-gray" :data-event="{ id: 'sryNB6FUfZ' }">其他</view>
          <view class="c-card-tag-info c-gray c-border-gray" :data-event="{ id: 'sryNB6FUfZ' }">
            <text :data-event="{ id: 'sryNB6FUfZ' }">{{ SAFormData.orderNum || '' }}</text>
            <text class="c-size-13 c-weight-normar" :data-event="{ id: 'sryNB6FUfZ' }">丨复制</text>
          </view>
        </view>
        <view v-else></view>
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
			  custom-class="c-m-l-10" :data-event="{id:'oLqUXTGxpg'}">
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
        <view class="c-card-content-item">
          <view class="c-card-content-item-label">详细地址：</view>
          <view>{{ SAFormData.address || '' }}</view>
        </view>
        <view class="c-card-content-item">
          <view class="c-card-content-item-label">建单时间：</view>
          <view>{{ SAFormData.createTime || '' }}</view>
        </view>
      </view>
      <swiper
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
              :data-event="{ id: 'L9VXPFcJwQ' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: 'L9VXPFcJwQ' }">
                <van-icon name="phone-o" :data-event="{ id: 'L9VXPFcJwQ' }" />
              </view>
              <text :data-event="{ id: 'L9VXPFcJwQ' }">联系客户</text>
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
              :data-event="{ id: '4cgkuWrpxI' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: '4cgkuWrpxI' }">
                <van-icon name="phone-o" :data-event="{ id: '4cgkuWrpxI' }" />
              </view>
              <text :data-event="{ id: '4cgkuWrpxI' }">联系客户</text>
            </view>
            <view
              class="quick-actions"
              @click="
                md({ act: 'SAOperation_tag' });
                doOpen('/subpackages/tag/tag', {
                  target: 'serviceAppointment',
                  id: SAFormData._id
                });
              "
              :data-event="{ id: 'ZD0mIpqMHX' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: 'ZD0mIpqMHX' }">
                <van-icon name="label-o" :data-event="{ id: 'ZD0mIpqMHX' }" />
              </view>
              <text :data-event="{ id: 'ZD0mIpqMHX' }">客户标签</text>
            </view>
            <view
              class="quick-actions"
              @click="
                openRemark();
                md({ act: 'SAOperation_remark' });
              "
              :data-event="{ id: '9Uv3H4XsQQ' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: '9Uv3H4XsQQ' }">
                <van-icon name="edit" :data-event="{ id: '9Uv3H4XsQQ' }" />
              </view>
              <text :data-event="{ id: '9Uv3H4XsQQ' }">编辑备注</text>
            </view>
            <view
              class="quick-actions"
              @click="
                recordsShow();
                md({ act: 'SAOperation_followUpRecords' });
              "
              :data-event="{ id: 'H1-VSJOJtI' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: 'H1-VSJOJtI' }">
                <van-icon name="records-o" :data-event="{ id: 'H1-VSJOJtI' }" />
              </view>
              <text :data-event="{ id: 'H1-VSJOJtI' }">跟进记录</text>
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
              :data-event="{ id: 'MfFrT91WN2' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: 'MfFrT91WN2' }">
                <van-icon name="photograph" :data-event="{ id: 'MfFrT91WN2' }" />
              </view>
              <text :data-event="{ id: 'MfFrT91WN2' }">工单拍照</text>
            </view>
            <!-- #ifdef APP-PLUS -->
            <view
              class="quick-actions"
              @click="doOpen('/subpackages2/punch/punchPeriod', { serviceAppointmentId: id })"
              :data-event="{ id: '6rw1231Kel' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: '6rw1231Kel' }">
                <van-icon name="completed-o" :data-event="{ id: '6rw1231Kel' }" />
              </view>
              <text :data-event="{ id: '6rw1231Kel' }">打卡记录</text>
            </view>
            <!-- #endif -->
            <view
              class="quick-actions"
              @click="
                md({ act: 'SAOperation_addContacts' });
                doOpen('/subpackages/serviceAppointment/addContacts', { id: id });
              "
              :data-event="{ id: '6rwzub1Kel' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: '6rwzub1Kel' }">
                <van-icon name="friends-o" :data-event="{ id: '6rwzub1Kel' }" />
              </view>
              <text :data-event="{ id: '6rwzub1Kel' }">附加联系人</text>
            </view>
            <view
              class="quick-actions"
              @click="
                QRcordShow = true;
                md({ act: 'SAOperation_shareToC' });
              "
              :data-event="{ id: 'YLzXqnACM0' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: 'YLzXqnACM0' }">
                <van-icon name="miniprogram-o" :data-event="{ id: 'YLzXqnACM0' }" />
              </view>
              <text :data-event="{ id: 'YLzXqnACM0' }">客户分享</text>
            </view>
            <view
              v-if="SAFormData.status >= 302"
              class="quick-actions"
              @click="JumpConstructionLog"
              :data-event="{ id: 'YE_UKKQEgG' }"
            >
              <view class="quick-actions-icon" :data-event="{ id: 'YE_UKKQEgG' }">
                <van-icon name="records-o" :data-event="{ id: 'YE_UKKQEgG' }" />
              </view>
              <text :data-event="{ id: 'YE_UKKQEgG' }">施工日志</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <!-- tab标签页 -->
    <view>
      <van-tabs
        v-if="nodesShow"
        :active="activeTab.detail && activeTab.detail.name"
        swipeable
        :sticky="log != 'log'"
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
        :data-event="{ id: 'I2q-kme8RL', capture: false }"
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
                :data-event="{ id: 'wGt7JJ-MTa', capture: false }"
              >
                <van-tab title="订单" name="order">
                  <view
                    class="c-card c-relative"
                    v-for="(item, i) in order.data"
                    :key="i"
                    @click="toOrder(item._id)"
                    :data-event="{ id: 'I7ouddsTgm' }"
                  >
                    <view class="c-card-title c-weight-normal" :data-event="{ id: 'I7ouddsTgm' }">
                      <view @click.stop="copy(item._id)" :data-event="{ id: 'SisLRa7_4D' }">
                        <text :data-event="{ id: 'SisLRa7_4D' }">{{ item._id || '' }}</text>
                        <text :data-event="{ id: 'SisLRa7_4D' }">丨复制</text>
                      </view>
                      <text class="c-red" :data-event="{ id: 'I7ouddsTgm' }">
                        <!-- //processState 订单进展状态 0:未开工（待签约）;1:待开工;2:已开工（待完工）;3:已完工 -->
                        {{ item.state == '1' ? '有效' : '无效' }}·{{
                          commonEvent('codelabel', null, {
                            option: 'processState',
                            value: item.processState
                          })
                        }}
                      </text>
                    </view>
                    <view class="c-card-content" :data-event="{ id: 'I7ouddsTgm' }">
                      <view class="c-card-content-item" :data-event="{ id: 'I7ouddsTgm' }">
                        <view
                          class="c-card-content-item-label"
                          style="min-width: 80px"
                          :data-event="{ id: 'I7ouddsTgm' }"
                        >
                          委托方：
                        </view>
                        <view :data-event="{ id: 'I7ouddsTgm' }">
                          {{ item.exts.companyName || item.exts.clientname || item.ownerName }}
                        </view>
                      </view>
                      <view class="c-card-content-item" :data-event="{ id: 'I7ouddsTgm' }">
                        <view
                          class="c-card-content-item-label"
                          style="min-width: 80px"
                          :data-event="{ id: 'I7ouddsTgm' }"
                        >
                          手机号：
                        </view>
                        <view :data-event="{ id: 'I7ouddsTgm' }">
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
                      <view class="c-card-content-item" :data-event="{ id: 'I7ouddsTgm' }">
                        <view class="c-card-content-item-label" :data-event="{ id: 'I7ouddsTgm' }">
                          产品总额：
                        </view>
                        <view :data-event="{ id: 'I7ouddsTgm' }">
                          ¥ {{ item.originPrice || 0 }}
                        </view>
                      </view>
                      <view
                        v-if="
                          amountToFixed(
                            item.originPrice - amountToFixed(item.originPrice * item.discount)
                          )
                        "
                        class="c-card-content-item"
                        :data-event="{ id: 'I7ouddsTgm' }"
                      >
                        <view class="c-card-content-item-label" :data-event="{ id: 'I7ouddsTgm' }">
                          折扣金额：
                        </view>
                        <view :data-event="{ id: 'I7ouddsTgm' }">
                          - ¥
                          {{
                            amountToFixed(
                              item.originPrice - amountToFixed(item.originPrice * item.discount)
                            ) || 0
                          }}
                        </view>
                      </view>
                      <view
                        v-if="item.preferentialAmount"
                        class="c-card-content-item"
                        :data-event="{ id: 'I7ouddsTgm' }"
                      >
                        <view class="c-card-content-item-label" :data-event="{ id: 'I7ouddsTgm' }">
                          优惠金额：
                        </view>
                        <view :data-event="{ id: 'I7ouddsTgm' }">
                          - ¥ {{ item.preferentialAmount }}
                        </view>
                      </view>
                      <view
                        v-if="item.exts && item.exts.couponsVal"
                        class="c-card-content-item"
                        :data-event="{ id: 'I7ouddsTgm' }"
                      >
                        <view class="c-card-content-item-label" :data-event="{ id: 'I7ouddsTgm' }">
                          活动优惠金额：
                        </view>
                        <view :data-event="{ id: 'I7ouddsTgm' }">
                          - ¥ {{ item.exts.couponsVal }}
                        </view>
                      </view>
                      <view class="c-card-content-item" :data-event="{ id: 'I7ouddsTgm' }">
                        <view class="c-card-content-item-label" :data-event="{ id: 'I7ouddsTgm' }">
                          实际金额：
                        </view>
                        <view class="c-red" :data-event="{ id: 'I7ouddsTgm' }">
                          ¥ {{ item.totalPrice }}
                        </view>
                      </view>
                      <view class="c-card-content-item" :data-event="{ id: 'I7ouddsTgm' }">
                        <view class="c-card-content-item-label" :data-event="{ id: 'I7ouddsTgm' }">
                          实付金额：
                        </view>
                        <view class="c-red" :data-event="{ id: 'I7ouddsTgm' }">
                          ¥ {{ item.paidAmount || 0 }}
                        </view>
                      </view>
                      <view class="c-card-content-item" :data-event="{ id: 'I7ouddsTgm' }">
                        <view class="c-card-content-item-label" :data-event="{ id: 'I7ouddsTgm' }">
                          下单时间：
                        </view>
                        <view :data-event="{ id: 'I7ouddsTgm' }">{{ item.createTime }}</view>
                      </view>
                    </view>
                    <view
                      v-if="
                        item.exts.deliveryOrderState == '1' || item.exts.deliveryOrderState == '2'
                      "
                      style="justify-content: start; margin-top: 10px"
                      :data-event="{ id: 'I7ouddsTgm' }"
                    >
                      <text
                        v-if="item.exts.deliveryOrderState == '1'"
                        :data-event="{ id: 'I7ouddsTgm' }"
                      >
                        材料交割单状态：等待业主确认
                      </text>
                      <text
                        v-else-if="item.exts.deliveryOrderState == '2'"
                        :data-event="{ id: 'I7ouddsTgm' }"
                      >
                        材料交割单状态：业主已确认
                      </text>
                      <text
                        class="c-blue c-m-l-10"
                        @click.native.stop="openDeliveryOrder(item._id)"
                        :data-event="{ id: 'YWAYoCcnzf' }"
                      >
                        点击查看
                      </text>
                    </view>
                    <view class="c-card-footer" :data-event="{ id: 'I7ouddsTgm' }">
                      <!-- <van-button
						  round
						  type="info"
						  size="small"
						  plain
						  v-if="item.type == '1' && item.exts.bjdPDFurl && item.exts.confirm != '1'"
						  @click.native.stop="sendQuotation(item._id)" :data-event="{id:'PzCqvzzA0m'}">
						  {{ item.exts.confirm == '0' ? '重新发送报价单给业主' : '发送报价单给业主' }}
						</van-button> -->
                      <!-- icon="balance-list" -->
                      <van-button
                        v-if="item.exts.bjdPDFurl"
                        size="small"
                        round
                        plain
                        :data-filename="item.exts.bjdPDFurl"
                        custom-class="c-m-l-20"
                        @click.native.stop="download"
                        :data-event="{ id: '_s3FoFuJXd' }"
                      >
                        查看报价单
                      </van-button>
                      <!-- icon="link-o" -->
                      <van-button
                        v-if="item.exts.bjdPDFurl"
                        size="small"
                        round
                        plain
                        custom-class="c-m-l-20"
                        @click.native.stop="copy(item.exts.bjdPDFurl)"
                        :data-event="{ id: 'IHvI76su-e' }"
                      >
                        复制链接
                      </van-button>
                      <!-- icon="description" -->
                      <van-button
                        v-if="item.exts.warrentyYearPDFurl"
                        size="small"
                        round
                        plain
                        :data-filename="item.exts.warrentyYearPDFurl"
                        custom-class="c-m-l-20"
                        @click.native.stop="download"
                        :data-event="{ id: 'UDQmvrw7Ix' }"
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
                      :data-event="{ id: 'I7ouddsTgm' }"
                    >
                      <!-- 订单进度为已签约、待开工、施工中、已完工时展示 -->
                      <van-button
                        v-if="[-1, 1, 2, 3].indexOf(item.processState) != -1"
                        size="small"
                        round
                        plain
                        @click.native.stop="
                          doOpen('/subpackages/profit/profit', {
                            orderId: item._id,
                            serviceType: SAFormData.serviceType
                          })
                        "
                        :data-event="{ id: 'zH5x42jg19' }"
                      >
                        成本利润核算
                      </van-button>

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
                        @click.native.stop="sendDeliveryOrder(item._id)" :data-event="{id:'EN541gp1cl'}">
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
                        :data-event="{ id: 'D86HaghprY' }"
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
                        @click.native.stop="turnOrder(item)" :data-event="{id:'lZjxwP0lsW'}">
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
                        :data-event="{ id: 'Cf2ylIAJpZ' }"
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
                          :data-event="{ id: 'JlCbIvNfef' }"
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
                          :data-event="{ id: 'ASMa712kZJ' }"
                        >
                          电子签约
                        </van-button>
                      </block>
                    </view>
                  </view>
                </van-tab>
                <van-tab title="合同" name="contract">
                  <view
                    class="c-card c-relative"
                    v-for="(item, i) in contract.data"
                    :key="i"
                    :data-event="{ id: 'wGt7JJ-MTa' }"
                  >
                    <view class="c-card-title c-weight-normal" :data-event="{ id: 'wGt7JJ-MTa' }">
                      <view
                        @click.stop="copy(item.contractdocNum)"
                        :data-event="{ id: 'iZ_ONKvDG2' }"
                      >
                        <text :data-event="{ id: 'iZ_ONKvDG2' }">
                          {{ item.contractdocNum || '' }}
                        </text>
                        <text :data-event="{ id: 'iZ_ONKvDG2' }">丨复制</text>
                      </view>
                      <text class="c-red" :data-event="{ id: 'wGt7JJ-MTa' }">
                        {{
                          commonEvent('codelabel', null, {
                            option: 'contractStatus',
                            value: item.exts.contractStatus
                          })
                        }}
                      </text>
                    </view>
                    <view class="c-card-content" :data-event="{ id: 'wGt7JJ-MTa' }">
                      <view class="c-card-content-item" :data-event="{ id: 'wGt7JJ-MTa' }">
                        <view
                          class="c-card-content-item-label"
                          style="min-width: 80px"
                          :data-event="{ id: 'wGt7JJ-MTa' }"
                        >
                          委托方：
                        </view>

                        <view :data-event="{ id: 'wGt7JJ-MTa' }">
                          {{ item.contactsName || item.client || '' }}
                        </view>
                      </view>
                      <view class="c-card-content-item" :data-event="{ id: 'wGt7JJ-MTa' }">
                        <view
                          class="c-card-content-item-label"
                          style="min-width: 80px"
                          :data-event="{ id: 'wGt7JJ-MTa' }"
                        >
                          手机号：
                        </view>
                        <view :data-event="{ id: 'wGt7JJ-MTa' }">
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
                      <view class="c-card-content-item" :data-event="{ id: 'wGt7JJ-MTa' }">
                        <view class="c-card-content-item-label" :data-event="{ id: 'wGt7JJ-MTa' }">
                          合同类型：
                        </view>
                        <view :data-event="{ id: 'wGt7JJ-MTa' }">
                          {{
                            commonEvent('codelabel', null, {
                              option: 'contractType',
                              value: item.contractType
                            })
                          }}
                        </view>
                      </view>
                      <view class="c-card-content-item" :data-event="{ id: 'wGt7JJ-MTa' }">
                        <view class="c-card-content-item-label" :data-event="{ id: 'wGt7JJ-MTa' }">
                          合同金额：
                        </view>
                        <view :data-event="{ id: 'wGt7JJ-MTa' }">
                          ¥ {{ item.adjustRefundMoney }}（增减项后的）
                        </view>
                      </view>
                      <view class="c-card-content-item" :data-event="{ id: 'wGt7JJ-MTa' }">
                        <view class="c-card-content-item-label" :data-event="{ id: 'wGt7JJ-MTa' }">
                          登记时间：
                        </view>
                        <view :data-event="{ id: 'wGt7JJ-MTa' }">{{ item.createTime }}</view>
                      </view>
                      <view class="c-card-content-item" :data-event="{ id: 'wGt7JJ-MTa' }">
                        <view class="c-card-content-item-label" :data-event="{ id: 'wGt7JJ-MTa' }">
                          签约时间：
                        </view>
                        <view :data-event="{ id: 'wGt7JJ-MTa' }">{{ item.signedDate || '' }}</view>
                      </view>
                      <view
                        v-if="item.examinStatus !== undefined"
                        class="c-card-content-item"
                        :data-event="{ id: 'wGt7JJ-MTa' }"
                      >
                        <view class="c-card-content-item-label" :data-event="{ id: 'wGt7JJ-MTa' }">
                          审核状态：
                        </view>
                        <view :data-event="{ id: 'wGt7JJ-MTa' }">
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
                      :data-event="{ id: 'wGt7JJ-MTa' }"
                    >
                      <!-- contractStatus 合同状态 10:签署成功 -->
                      <!-- proportion 是否需要付款(需要付款比例)，值：0~1 -->
                      <!-- payState 支付状态，0：未支付，1：已付清，2/3：部分支付 -->
                      <!-- 需要付款时：已付款才展示增减项；不需要付款时，付没付都展示增减项。 -->
                      <block
                        v-if="
                          item.exts.contractStatus == '10' &&
                          (['11', '12'].includes(item.exts.serviceType)
                            ? item.proportion > 0
                            : true) &&
                          isHandler
                        "
                      >
                        <van-button
                          round
                          plain
                          type="default"
                          size="small"
                          icon="minus"
                          @click="openContractExt(2, item, 'contractDeductionForm')"
                          :data-event="{ id: '_pEb7WXSCi' }"
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
                          :data-event="{ id: 'vlRZWoMd8T' }"
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
                        :data-event="{ id: '-Ishiuwmbq' }"
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
                        :data-event="{ id: 'zIRYDhrgpW' }"
                      >
                        <view class="c-flex c-flex-center" :data-event="{ id: 'zIRYDhrgpW' }">
                          补充协议
                        </view>
                      </van-button>
                    </view>
                    <view class="c-card-footer c-m-t-20" :data-event="{ id: 'wGt7JJ-MTa' }">
                      <!-- 合同状态 不是已经刷新 -->
                      <van-button
                        v-if="checkContractStatus(item)"
                        round
                        size="small"
                        @click="contractStatusRefresh(item._id)"
                        :data-event="{ id: 'q5TY2uWCJd' }"
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
                        :data-event="{ id: 'M8a2Izreux' }"
                      >
                        取消合同
                      </van-button>
                      <van-button
                        round
                        size="small"
                        @click="signAgain(item._id)"
                        v-if="item.exts.contractStatus == '-3' && isHandler"
                        custom-class="c-m-l-20"
                        :data-event="{ id: 'vIrEAYbklU' }"
                      >
                        再次签约
                      </van-button>
                      <van-button
                        round
                        size="small"
                        @click="sendAgain(item._id)"
                        v-if="item.exts.contractStatus == '2' && isHandler"
                        custom-class="c-m-l-20"
                        :data-event="{ id: '-3kctdZ7iL' }"
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
                        :data-event="{ id: 'odmEiGS16f' }"
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
                        :data-event="{ id: 'kmPhjjMReD' }"
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
                        :data-event="{ id: '7dXlu-Rkn1' }"
                      >
                        <view class="c-flex c-flex-center" :data-event="{ id: '7dXlu-Rkn1' }">
                          合同附件
                        </view>
                      </van-button>

                      <!-- 森  填写和查看核查单   @click="editViewCheck('edit', item)" -->
                      <!-- 1756226030442688595 核查人员角色ID -->
                      <view
                        v-if="
                          roleId == '1756226030442688595' &&
                          (item.exts.contractStatus == 10 || item.exts.contractStatus == -2)
                        "
                        class="van-button-small"
                        @click="toggleButton(i)"
                        :data-event="{ id: 'pfgfI5LI2w' }"
                      >
                        施工核查单
                        <van-icon
                          v-if="btnShow !== i"
                          name="arrow-down"
                          :data-event="{ id: 'pfgfI5LI2w' }"
                        />
                        <van-icon
                          v-if="btnShow === i"
                          name="arrow-up"
                          :data-event="{ id: 'pfgfI5LI2w' }"
                        />

                        <view class="down" v-if="btnShow === i" :data-event="{ id: 'pfgfI5LI2w' }">
                          <view
                            @click="editViewCheck('edit', item)"
                            :data-event="{ id: 'ZOUsM8srf9' }"
                          >
                            填写核查单
                            <van-icon name="arrow" :data-event="{ id: 'ZOUsM8srf9' }" />
                          </view>
                          <view
                            @click="editViewCheck('view', item)"
                            :data-event="{ id: 'cHa6A4Ly5Z' }"
                          >
                            查看核查单
                            <van-icon name="arrow" :data-event="{ id: 'cHa6A4Ly5Z' }" />
                          </view>
                        </view>
                      </view>
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
              <view style="padding-bottom: 140rpx" :data-event="{ id: 'I2q-kme8RL' }">
                <block v-for="(subflow, index1) in subflows" :key="index1">
                  <view
                    v-if="subflow.state != '-1'"
                    class="c-card"
                    :data-event="{ id: 'I2q-kme8RL' }"
                  >
                    <view class="c-card-title" :data-event="{ id: 'I2q-kme8RL' }">
                      <view class="c-nowrap" :data-event="{ id: 'I2q-kme8RL' }">
                        {{ subflow.title }}
                      </view>
                      <view class="c-red c-nowrap" :data-event="{ id: 'I2q-kme8RL' }">
                        {{
                          subflow.workflowNodeList[subflow.workflowNodeList.length - 1].state == 10
                            ? '已完成'
                            : '待' +
                              subflow.workflowNodeList[subflow.workflowNodeList.length - 1].nodeDef
                                .name
                        }}
                      </view>
                    </view>
                    <view
                      class="c-card-content"
                      v-if="subflow.defId == '397319126375157199'"
                      :data-event="{ id: 'I2q-kme8RL' }"
                    >
                      <view :data-event="{ id: 'I2q-kme8RL' }">
                        验收编号：{{ subflow.workflowNodeList[0].formDataId }}
                      </view>
                      <view :data-event="{ id: 'I2q-kme8RL' }">
                        添加时间：{{ subflow.createTime }}
                      </view>
                    </view>
                    <view class="c-card-content" v-else :data-event="{ id: 'I2q-kme8RL' }">
                      <view @click="copy(subflow.formDataId)" :data-event="{ id: 'na1ae8IgcK' }">
                        订单编号：{{ subflow.formDataId }}
                      </view>
                      <view :data-event="{ id: 'I2q-kme8RL' }">
                        添加时间：{{ subflow.createTime }}
                      </view>
                    </view>
                    <view class="c-card-footer" :data-event="{ id: 'I2q-kme8RL' }">
                      <van-button
                        v-if="subflow.formColName == 'order' && subflow.formDataId"
                        round
                        plain
                        size="small"
                        @click.native.stop="
                          doOpen('/subpackages/profit/profit', {
                            orderId: subflow.formDataId,
                            serviceType: SAFormData.serviceType
                          })
                        "
                        :data-event="{ id: '8mTdBRNopd' }"
                      >
                        成本利润核算
                      </van-button>
                      <van-button
                        :data-subflow="subflow"
                        type="info"
                        :icon="subflow && subflow.state == 0 ? 'edit' : ''"
                        round
                        size="small"
                        custom-class="c-m-l-20"
                        @click="getSubWorkflow(subflow.defId, subflow._id)"
                        :data-event="{ id: 'rWKJHk43E4' }"
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
              <view style="padding-bottom: 140rpx" :data-event="{ id: 'I2q-kme8RL' }">
                <view
                  v-for="(form, index2) in formList"
                  :key="index2"
                  class="c-card"
                  :data-event="{ id: 'I2q-kme8RL' }"
                >
                  <view
                    class="c-card-title c-flex c-flex-between"
                    :data-event="{ id: 'I2q-kme8RL' }"
                  >
                    <view class="c-nowrap" :data-event="{ id: 'I2q-kme8RL' }">
                      {{ form.formTitle }}
                    </view>
                    <view class="c-red c-nowrap" :data-event="{ id: 'I2q-kme8RL' }">
                      {{ form.state == -1 ? '已删除' : '已完成' }}
                    </view>
                  </view>
                  <view class="c-card-content" :data-event="{ id: 'I2q-kme8RL' }">
                    创建时间：{{ form.createTime }}
                  </view>
                  <view class="c-card-footer" :data-event="{ id: 'I2q-kme8RL' }">
                    <van-button
                      v-if="form.state != -1"
                      @click="removeForm(form)"
                      round
                      size="small"
                      icon="delete-o"
                      :data-event="{ id: 'wqcpUOMxe3' }"
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
                      :data-event="{ id: '9j6bW-xkyc' }"
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
              <view style="padding-bottom: 60px" :data-event="{ id: 'I2q-kme8RL' }">
                <view
                  v-for="(form, index2) in formList"
                  :key="index2"
                  class="c-card"
                  style="padding-top: 10px"
                  :data-event="{ id: 'I2q-kme8RL' }"
                >
                  <view
                    v-if="
                      form.surveyNum &&
                      activeTab.detail.name &&
                      activeTab.detail.name.nodeDef &&
                      activeTab.detail.name.nodeDef.formDefId == '7971040108398070730'
                    "
                    class="c-card-title c-weight-normal"
                    :data-event="{ id: 'I2q-kme8RL' }"
                  >
                    <view :data-event="{ id: '5qEjCLVQr6' }" @click="copy(form.surveyNum)">
                      <text :data-event="{ id: '5qEjCLVQr6' }">{{ form.surveyNum || '' }}</text>
                      <text :data-event="{ id: '5qEjCLVQr6' }">丨复制</text>
                    </view>
                  </view>
                  <view
                    v-else
                    class="c-card-title c-weight-normal"
                    :data-event="{ id: 'I2q-kme8RL' }"
                  >
                    <van-icon
                      custom-class="c-card-icon"
                      name="description"
                      :data-event="{ id: 'I2q-kme8RL' }"
                    ></van-icon>
                    <text class="c-nowrap" :data-event="{ id: 'I2q-kme8RL' }">
                      {{ form.formTitle || '' }}
                    </text>
                  </view>
                  <view class="c-card-content" :data-event="{ id: 'I2q-kme8RL' }">
                    <!-- 防水勘察单 -->
                    <view
                      v-if="
                        activeTab.detail &&
                        activeTab.detail.name &&
                        activeTab.detail.name.nodeDef &&
                        activeTab.detail.name.nodeDef.formDefId == '7971040108398070730'
                      "
                      class="c-card-content-item"
                      :data-event="{ id: 'I2q-kme8RL' }"
                    >
                      <view class="c-card-content-item-label" :data-event="{ id: 'I2q-kme8RL' }">
                        勘察部位：
                      </view>
                      <view :data-event="{ id: 'I2q-kme8RL' }">
                        {{ codelabel('cascade', 'parts', form.part) || '' }}
                      </view>
                    </view>
                    <!-- 施工勘察单 -->
                    <view
                      v-else-if="
                        activeTab.detail &&
                        activeTab.detail.name &&
                        activeTab.detail.name.nodeDef &&
                        activeTab.detail.name.nodeDef.formDefId == '7900744778900065751'
                      "
                      class="c-card-content-item"
                      :data-event="{ id: 'I2q-kme8RL' }"
                    >
                      <view class="c-card-content-item-label" :data-event="{ id: 'I2q-kme8RL' }">
                        勘察部位：
                      </view>
                      <view :data-event="{ id: 'I2q-kme8RL' }">
                        {{
                          codelabel('select', 'constructionParts', form.constructionLocation) || ''
                        }}
                      </view>
                    </view>
                    <view class="c-card-content-item" :data-event="{ id: 'I2q-kme8RL' }">
                      <view class="c-card-content-item-label" :data-event="{ id: 'I2q-kme8RL' }">
                        创建时间：
                      </view>
                      <view :data-event="{ id: 'I2q-kme8RL' }">{{ form.createTime }}</view>
                    </view>
                    <view class="c-card-content-item" :data-event="{ id: 'I2q-kme8RL' }">
                      <view class="c-card-content-item-label" :data-event="{ id: 'I2q-kme8RL' }">
                        更新时间：
                      </view>
                      <view :data-event="{ id: 'I2q-kme8RL' }">{{ form.updateTime }}</view>
                    </view>
                  </view>
                  <view class="c-card-footer" :data-event="{ id: 'I2q-kme8RL' }">
                    <block
                      v-if="
                        activeTab.detail &&
                        activeTab.detail.name &&
                        activeTab.detail.name.nodeDef &&
                        activeTab.detail.name.nodeDef.formDefId == '7971040108398070730' &&
                        form.progress == 100
                      "
                    >
                      <van-button
                        v-if="form.surveyPDFUrl"
                        round
                        size="small"
                        type="default"
                        plain
                        :data-filename="form.surveyPDFUrl"
                        @click="download"
                        :data-event="{ id: 'ES_yeFNt-u' }"
                      >
                        查看报告
                      </van-button>
                      <van-button
                        v-if="form.surveyPDFUrl"
                        round
                        size="small"
                        type="default"
                        plain
                        custom-class="c-m-l-20"
                        @click="copy(form.surveyPDFUrl)"
                        :data-event="{ id: 'c7sqPxe_RO' }"
                      >
                        复制链接
                      </van-button>
                    </block>
                    <van-button
                      @click="removeRepeatForm(form._id)"
                      plain
                      icon="delete-o"
                      size="small"
                      round
                      custom-class="c-m-l-20"
                      :data-event="{ id: 'JqMNN8eUly' }"
                    >
                      删除
                    </van-button>
                    <van-button
                      @click="
                        viewAddForm(
                          activeTab.detail.name.nodeDef.formDefId,
                          form.formTitle,
                          form._id,
                          form
                        )
                      "
                      type="info"
                      icon="edit"
                      size="small"
                      round
                      custom-class="c-m-l-20"
                      :data-event="{ id: '0gKbgNIfm-' }"
                    >
                      编辑
                    </van-button>
                  </view>
                  <!-- <van-progress
                    v-if="
                      activeTab.detail.name &&
                      activeTab.detail.name.nodeDef &&
                      activeTab.detail.name.nodeDef.formDefId == '7971040108398070730' &&
                      form.progressShow
                    "
                    :percentage="form.progress"
                    stroke-width="8"
                    custom-class="c-progress"
                  /> -->

                  <!-- 手写一个 进度条  -->
                  <div
                    class="progress-container"
                    v-if="
                      activeTab.detail.name &&
                      activeTab.detail.name.nodeDef &&
                      activeTab.detail.name.nodeDef.formDefId == '7971040108398070730' &&
                      form.progressShow
                    "
                  >
                    <div class="progress-bar" :style="{ width: form.progress + '%' }">
                      <div class="progress-marker">{{ form.progress }}%</div>
                    </div>
                  </div>
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
                      <view
                        class="c-cell-view c-flex c-flex-between c-p-b-0"
                        :data-event="{ id: 'I2q-kme8RL' }"
                      >
                        <view class="c-cell_title" :data-event="{ id: 'I2q-kme8RL' }">
                          {{ extField.nameDisp }}
                        </view>
                        <view
                          class="c-cell_value"
                          v-if="formData[extField.name]"
                          :data-event="{ id: 'I2q-kme8RL' }"
                        >
                          （{{ formData[extField.name].length || 0 }} /
                          {{
                            extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                              ? extField.frontEndConfig.max
                              : '不限'
                          }}）
                        </view>
                      </view>
                      <view
                        :key="extField._id"
                        class="c-cell-view c-p-b-0"
                        :data-event="{ id: 'I2q-kme8RL' }"
                      >
                        <view
                          v-if="extField.frontEndConfig.fileType == 'video'"
                          class="c-flex"
                          :data-event="{ id: 'I2q-kme8RL' }"
                        >
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
                            :data-event="{ id: 'fxHLduPAJk', capture: false }"
                          ></video>
                        </view>
                        <van-uploader
                          style="display: flex"
                          v-else
                          multiple
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
                        :data-event="{ id: 'I2q-kme8RL' }"
                      ></view>
                    </block>
                    <block v-else-if="extField.type == 'gap'">
                      <view
                        :key="extField._id"
                        class="c-cell-gap"
                        :data-event="{ id: 'I2q-kme8RL' }"
                      >
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
                        :data-event="{ id: 'T07BZQNBMu' }"
                      >
                        {{ extField.nameDisp }}
                      </van-button>
                    </block>
                    <block v-else-if="extField.type == 'scan'">
                      <view
                        :key="extField._id"
                        class="c-flex c-flex-between c-item-center c-bg-white c-cell-view"
                        :data-event="{ id: 'I2q-kme8RL' }"
                      >
                        <text class="c-cell_title" :data-event="{ id: 'I2q-kme8RL' }">
                          {{ extField.nameDisp }}
                        </text>
                        <van-button
                          disabled
                          :plain="extField.frontEndConfig.plain"
                          :type="extField.frontEndConfig.type"
                          :color="extField.frontEndConfig.color"
                          :icon="extField.frontEndConfig.icon"
                          :size="extField.frontEndConfig.size || 'small'"
                          @click="commonEvent('scan', extField.name, extField.frontEndConfig)"
                          :data-event="{ id: 'bSmZiGTwPA' }"
                        >
                          {{ extField.frontEndConfig.buttonName }}
                        </van-button>
                      </view>
                    </block>
                    <block v-else-if="extField.type == 'addItem'">
                      <view
                        class="c-cell-view c-flex c-flex-between"
                        :data-event="{ id: 'I2q-kme8RL' }"
                      >
                        <text :data-event="{ id: 'I2q-kme8RL' }">{{ extField.nameDisp }}</text>
                        <van-button
                          disabled
                          @click="commonEvent('addItem', extField.name, extField.frontEndConfig)"
                          :plain="extField.frontEndConfig.plain"
                          :type="extField.frontEndConfig.type"
                          :color="extField.frontEndConfig.color"
                          :icon="extField.frontEndConfig.icon"
                          :size="extField.frontEndConfig.size || 'small'"
                          :data-event="{ id: 'Qkz04AmtG2' }"
                        >
                          {{ extField.frontEndConfig.buttonName }}
                        </van-button>
                      </view>
                      <view
                        :key="extField._id"
                        class="c-cell-view"
                        style="border-bottom: 1px solid #ebedf0"
                        :data-event="{ id: 'I2q-kme8RL' }"
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
                            :data-event="{ id: 'I2q-kme8RL' }"
                          >
                            {{ extField.frontEndConfig.buttonName }}
                          </van-button>
                        </van-field>
                      </van-cell-group>
                    </block>
                    <block v-else-if="extField.type == 'sort'">
                      <!-- 按类别展示 -->
                      <view
                        v-if="extField.frontEndConfig.showName"
                        :data-event="{ id: 'I2q-kme8RL' }"
                      >
                        {{ extField.name }}
                      </view>
                      <van-cell-group :key="extField._id" :border="false">
                        <view
                          v-for="(item, key) in formData[extField.name]"
                          :key="key"
                          class="c-cell-view c-flex c-flex-between"
                          style="padding: 10px 25px"
                          :data-event="{ id: 'I2q-kme8RL' }"
                        >
                          <view :data-event="{ id: 'I2q-kme8RL' }">
                            {{
                              commonEvent('codelabel', null, {
                                option: extField.option,
                                value: key
                              })
                            }}
                          </view>
                          <view :data-event="{ id: 'I2q-kme8RL' }">
                            <text :data-event="{ id: 'I2q-kme8RL' }">{{ item.length }}</text>
                            <text :data-event="{ id: 'I2q-kme8RL' }">
                              {{ extField.frontEndConfig.unit }}
                            </text>
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
                        :data-event="{ id: 'OoZOLO-JIZ' }"
                      >
                        <text
                          class="c-required"
                          v-if="
                            extField.required == '1' &&
                            currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                          "
                          :data-event="{ id: 'OoZOLO-JIZ' }"
                        >
                          *
                        </text>
                        <van-icon
                          custom-class="c-blue"
                          name="checked"
                          v-if="formData[extField.name]"
                          :data-event="{ id: 'OoZOLO-JIZ' }"
                        />
                        <rich-text :nodes="extField.frontEndConfig.text"></rich-text>
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
                        :key="extField._id + 'copy'"
                        :title="extField.nameDisp"
                        :value="formData[extField.name]"
                        @click.native="copy(formData[extField.name])"
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
          <view
            style="height: calc(100% - 44px); overflow-y: auto"
            :data-event="{ id: 'I2q-kme8RL' }"
          >
            <block v-for="(item, index) in log.data" :key="index">
              <view
                v-if="log.type.length == 0 || log.type.indexOf(item.type) != -1"
                class="c-card"
                @click="JumplogDetails(item.type, item.typeId)"
                :data-event="{ id: 'Z0xjLgBZB4' }"
              >
                <view class="c-card-title" :data-event="{ id: 'Z0xjLgBZB4' }">
                  <view class="c-flex" :data-event="{ id: 'Z0xjLgBZB4' }">
                    <van-icon
                      v-if="item.type == '1'"
                      name="edit"
                      custom-style="font-size: 44rpx"
                      class="c-blue c-m-r-10"
                      :data-event="{ id: 'Z0xjLgBZB4' }"
                    ></van-icon>
                    <van-icon
                      v-else-if="item.type == '2'"
                      name="description"
                      custom-style="font-size: 44rpx"
                      class="c-blue c-m-r-10"
                      :data-event="{ id: 'Z0xjLgBZB4' }"
                    ></van-icon>
                    <van-icon
                      v-else-if="item.type == '3'"
                      name="phone-circle"
                      custom-style="font-size: 44rpx"
                      class="c-blue c-m-r-10"
                      :data-event="{ id: 'Z0xjLgBZB4' }"
                    ></van-icon>
                    <van-icon
                      v-else-if="item.type == '4'"
                      name="notes"
                      custom-style="font-size: 44rpx"
                      class="c-blue c-m-r-10"
                      :data-event="{ id: 'Z0xjLgBZB4' }"
                    ></van-icon>
                    <van-icon
                      v-else-if="item.type == '5'"
                      name="map-marked"
                      custom-style="font-size: 44rpx"
                      class="c-blue c-m-r-10"
                      :data-event="{ id: 'Z0xjLgBZB4' }"
                    ></van-icon>
                    <van-icon
                      v-else
                      name="records"
                      custom-style="font-size: 44rpx"
                      class="c-blue c-m-r-10"
                      :data-event="{ id: 'Z0xjLgBZB4' }"
                    ></van-icon>
                    <text :data-event="{ id: 'Z0xjLgBZB4' }">{{ item.name }}</text>
                  </view>
                  <view v-if="item.type == '1' && item.taskTime" :data-event="{ id: 'Z0xjLgBZB4' }">
                    {{ item.taskTime }}
                  </view>
                  <view
                    v-if="item.type == '3' && item.typeId && item.recordUrl"
                    class="c-blue c-weight-normal"
                    @click="
                      doOpen('./speechText', {
                        colId: item.typeId,
                        audioTitle: SAFormData.name + '的通话录音' + item.createTime,
                        recordUrl: item.recordUrl
                      });
                      stopAudioPlayback();
                    "
                    :data-event="{ id: '4pd58xfhIn' }"
                  >
                    录音文本
                  </view>
                </view>
                <view
                  class="c-card-content"
                  style="color: #646566"
                  :data-event="{ id: 'Z0xjLgBZB4' }"
                >
                  <view
                    v-if="item.type == '3' && item.recordUrl"
                    class="c-flex c-item-center"
                    :data-event="{ id: 'Z0xjLgBZB4' }"
                  >
                    <van-icon
                      v-if="item.state != 'playing'"
                      name="play-circle"
                      class="call-button c-blue c-m-r-20"
                      custom-style="font-size: 66rpx"
                      @click="callPlay(item, index)"
                      :data-event="{ id: 'MH7TeNK3q6' }"
                    />
                    <van-icon
                      v-else
                      name="pause-circle"
                      custom-style="font-size: 66rpx"
                      class="call-button c-blue c-m-r-20"
                      @click="callPause()"
                      :data-event="{ id: '7N2JlVnnMA' }"
                    />
                    <!-- <view
                      v-if="callRecord.recordUrl == item.recordUrl && callRecord.max"
                      class="audio-wrapper"
                      :data-event="{ id: 'Z0xjLgBZB4' }"
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
                        <view
                          class="slider-button"
                          slot="button"
                          :data-event="{ id: 'Z0xjLgBZB4' }"
                        >
                          {{ callRecord.currentTime }}
                        </view>
                      </van-slider>
                      <view :data-event="{ id: 'Z0xjLgBZB4' }">{{ callRecord.endTime }}</view>
                    </view> -->
                    <view class="audio-wrapper">
                      <view class="audio-slider">
                        <slider
                          :value="item.value"
                          :max="item.callDuration"
                          @changing="callProgressDrag"
                          @change="callSeek"
                          step="1"
                          block-size="20"
                        />
                        <view class="audio-time-container">
                          <view class="audio-current-time">
                            {{ item.currentTime }}
                          </view>
                          <view class="audio-end-time">
                            {{ formatCallRecordCurrentTime(item.callDuration) }}
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                  <text v-else :data-event="{ id: 'Z0xjLgBZB4' }">
                    {{ item.content || '' }}
                  </text>
                  <view v-if="item.type == 1 && item.mediaContent && item.mediaContent.length > 0" class="c-m-t-10">
                    <van-uploader :file-list="item.mediaContent" :max-count="item.mediaContent.length" :deletable="false" />
                  </view>
                </view>
                <view
                  :class="['c-log-footer', item.type == '3' ? 'customer_profile' : '']"
                  :data-event="{ id: 'Z0xjLgBZB4' }"
                >
                  <view
                    v-if="item.type == 3 && item.ai == '1'"
                    class="profile"
                    @click.stop="
                      doOpen('../../subpackages2/customerProfile/customerProfile', {
                        Id: id
                      })
                    "
                  >
                    <image
                      style="width: 20px; height: 20px"
                      src="https://pub.fsgo365.cn/icon-ai.jpg"
                    ></image>
                    <view class="c-m-l-20 c-gray-6">Ai 分析</view>
                  </view>
                  <view v-else></view>
                  <view>
                    <text
                      v-if="
                        item.type == '2' && item.name == '新建工单'
                          ? currentRoleButtons.find(
                              item => item.code == 'serviceAppointment.createUserName'
                            )
                          : true
                      "
                      :data-event="{ id: 'Z0xjLgBZB4' }"
                    >
                      {{ item.createUserName || '系统' }}
                    </text>
                    <text class="c-m-l-20" :data-event="{ id: 'Z0xjLgBZB4' }">
                      {{ item.createTime }}
                    </text>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </van-tab>
        <van-tab title="相册" name="album">
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
                    :data-event="{ id: 'I2q-kme8RL' }"
                  >
                    <view class="album-subLabelName" :data-event="{ id: 'I2q-kme8RL' }">
                      {{ subLabel.name }}
                    </view>
                    <view
                      class="photos"
                      :style="
                        systemInfo.platform == 'ios' ||
                        systemInfo.platform == 'android' ||
                        systemInfo.platform == 'devtools'
                          ? 'padding-bottom:0'
                          : ''
                      "
                      :data-event="{ id: 'I2q-kme8RL' }"
                    >
                      <view
                        v-for="(url, k) in album.data[label.value + '-' + subLabel.value]"
                        :key="k"
                        class="photo-view"
                        :data-event="{ id: 'I2q-kme8RL' }"
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
                          :data-event="{ id: 'VhFqmLU3nq' }"
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
                          :data-event="{ id: 'vcbawROdiN' }"
                        ></image>
                        <!-- #endif -->
                        <van-icon
                          name="cross"
                          size="16px"
                          custom-class="image-delete"
                          :data-url="url"
                          @click="deletePhoto($event, label.value + '-' + subLabel.value, k)"
                          :data-event="{ id: 'fLU3zHXFbW' }"
                        />
                      </view>
                    </view>
                  </view>
                </block>
                <view
                  v-if="labelPhotoCount(label.value, albumSubLabel[label.value]) == 0"
                  class="c-p-b-20 c-gray"
                  :data-event="{ id: 'I2q-kme8RL' }"
                >
                  没有照片
                </view>
              </block>
              <!-- 只有一级标签 如default -->
              <block v-else>
                <view
                  v-if="album.data[label.value] && album.data[label.value].length > 0"
                  :data-event="{ id: 'I2q-kme8RL' }"
                >
                  <view
                    class="photos c-p-t-0"
                    :style="
                      systemInfo.platform == 'ios' ||
                      systemInfo.platform == 'android' ||
                      systemInfo.platform == 'devtools'
                        ? 'padding-bottom:0'
                        : ''
                    "
                    :data-event="{ id: 'I2q-kme8RL' }"
                  >
                    <view
                      v-for="(url, k) in album.data[label.value]"
                      :key="k"
                      class="photo-view"
                      :data-event="{ id: 'I2q-kme8RL' }"
                    >
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
                        :data-event="{ id: '2TZsrozZyV' }"
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
                        :data-event="{ id: 'uFyIlAQvtg' }"
                      ></image>
                      <!-- #endif -->
                      <van-icon
                        name="cross"
                        size="16px"
                        custom-class="image-delete"
                        :data-url="url"
                        @click="deletePhoto($event, label.value, k)"
                        :data-event="{ id: 'KUHPQWBtnr' }"
                      />
                    </view>
                  </view>
                </view>
                <view v-else class="c-p-b-20 c-gray" :data-event="{ id: 'I2q-kme8RL' }">
                  没有照片
                </view>
              </block>
            </van-collapse-item>
          </van-collapse>
        </van-tab>
        <van-tab title="档案" name="archives" icon="search">
          <view v-for="(item, i) in archivesData" :key="i" :data-event="{ id: 'I2q-kme8RL' }">
            <view class="c-card" :data-event="{ id: 'I2q-kme8RL' }">
              <view class="c-card-title c-weight-normal" :data-event="{ id: 'I2q-kme8RL' }">
                <view @click="copy(item.id)" :data-event="{ id: 'o5WByCLWL1' }">
                  {{ item ? item.name : '' }}：{{ item.id || '' }}
                </view>
              </view>
              <view
                class="c-card-footer c-m-t-20"
                key="c-uni-button"
                :data-event="{ id: 'I2q-kme8RL' }"
              >
                <view v-if="item.surveyPDFUrl" :data-event="{ id: 'I2q-kme8RL' }">
                  <van-button
                    plain
                    round
                    size="small"
                    icon="down"
                    :data-filename="item.surveyPDFUrl"
                    @click="saveFile"
                    :data-event="{ id: 'C3jekYq4L0' }"
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
                    :data-event="{ id: 'xT60THkLaN' }"
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
                    :data-event="{ id: 'akOpCFKY4O' }"
                  >
                    复制链接
                  </van-button>
                </view>
                <view v-if="item.qiniuUrl" :data-event="{ id: 'I2q-kme8RL' }">
                  <van-button
                    size="small"
                    round
                    plain
                    icon="down"
                    @click="saveFile"
                    :data-filename="item.qiniuUrl"
                    :data-event="{ id: 'l-Ieek3wv4' }"
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
                    :data-event="{ id: '2yhhTJVbOT' }"
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
                    :data-event="{ id: 'ifxUO5gx1Z' }"
                  >
                    复制链接
                  </van-button>
                </view>
                <view
                  v-if="item.bjdPDFurl"
                  style="margin-bottom: 10px"
                  :data-event="{ id: 'I2q-kme8RL' }"
                >
                  <van-button
                    size="small"
                    round
                    plain
                    icon="down"
                    @click="saveFile"
                    :data-filename="item.bjdPDFurl"
                    :data-event="{ id: 'dmP2bj2mh8' }"
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
                    :data-event="{ id: 'EICqEqv5nc' }"
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
                    :data-event="{ id: 'UabJbitT4x' }"
                  >
                    复制链接
                  </van-button>
                </view>
                <view v-if="item.warrentyYearPDFurl" :data-event="{ id: 'I2q-kme8RL' }">
                  <van-button
                    size="small"
                    round
                    plain
                    icon="down"
                    @click="saveFile"
                    :data-filename="item.warrentyYearPDFurl"
                    :data-event="{ id: 'fiN-sLNbyu' }"
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
                    :data-event="{ id: 'hK46HeMPN6' }"
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
                    :data-event="{ id: 'sYc8TG104k' }"
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
        :data-event="{ id: 'XPyeGmUkhL' }"
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
        :data-event="{ id: 'ILN64b2TTp' }"
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
        :data-event="{ id: 'dovajvVQd0' }"
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
        :data-event="{ id: 'HeEqeI5Ufm' }"
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
        :data-event="{ id: 'ClBnArEF41' }"
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
        :data-event="{ id: 's6JtDXLb2m' }"
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
        :data-event="{ id: 'gTP60hwjPj' }"
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
          :data-event="{ id: 'PB7PVunfVA' }"
        >
          <text
            v-if="
              activeTab.detail.name &&
              activeTab.detail.name.nodeDef &&
              activeTab.detail.name.nodeDef.formDefId == '7971040108398070730'
            "
            :data-event="{ id: 'PB7PVunfVA' }"
          >
            去下单
          </text>
          <text v-else :data-event="{ id: 'PB7PVunfVA' }">完成</text>
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
        :data-event="{ id: 'tqftYrhheC' }"
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
        :data-event="{ id: 'd-p5zgaAHl' }"
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
        :data-event="{ id: 'UWROFg7Ddb' }"
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
        :data-event="{ id: 'RSb44pbs-4' }"
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
        :data-event="{ id: 'b_e1Racq-I' }"
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
                  plain
                  size="small"
                  v-if="
                    (subNode.formDefId == '3285058246984486156' ||
                      subNode.formDefId == '3721799436069914536') &&
                    subNode.formDataId &&
                    acceptancePdf.acceptanceUrl
                  "
                  round
                  @click="viewAcceptance(acceptancePdf)"
                  :data-event="{ id: 'jC8vW9u5Dm' }"
                >
                  {{ acceptancePdf.signImageUrl ? '查看' : '预览' }}文件
                </van-button>
                <van-button
                  plain
                  size="small"
                  v-if="
                    (subNode.formDefId == '3285058246984486156' ||
                      subNode.formDefId == '3721799436069914536') &&
                    subNode.formDataId &&
                    acceptancePdf.acceptanceUrl
                  "
                  round
                  custom-class="c-m-l-20"
                  @click="copyAcceptance(acceptancePdf.acceptanceUrl)"
                  :data-event="{ id: 'thuuyBBt77' }"
                >
                  复制链接
                </van-button>
                <van-button
                  plain
                  size="small"
                  v-if="
                    subNode.state == 10 &&
                    (subNode.formDefId == '3285058246984486156' ||
                      subNode.formDefId == '3721799436069914536') &&
                    subNode.formDataId &&
                    acceptancePdf.acceptanceUrl &&
                    acceptancePdf.signable &&
                    !acceptancePdf.signImageUrl
                  "
                  round
                  custom-class="c-m-l-20"
                  @click="processClientSignature(subNode)"
                  :data-event="{ id: 'pmHVhgbnSt' }"
                >
                  客户签字
                </van-button>
              </view>
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
                  :data-event="{ id: 'gfUuiHZtRD' }"
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
                  :data-event="{ id: 'Ex2b_vthdO' }"
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
                  :data-event="{ id: 'vK_UifMM2k' }"
                >
                  {{
                    subNode.visible && subNode.state == '0'
                      ? subNode.nodeDef.nodeType == 'disable'
                        ? '等待处理'
                        : '处理'
                      : subNode.visible &&
                        subNode.state == '10' &&
                        (subNode.formDefId == '3285058246984486156' ||
                          subNode.formDefId == '3721799436069914536') &&
                        activeTab.detail &&
                        activeTab.detail.name &&
                        activeTab.detail.name.state == 0
                      ? '修改'
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
      <movable-area style="height: 100%; width: 100%">
        <movable-view
          style="z-index: 99"
          @click.stop="temporaryForm()"
          :y="systemInfo.windowHeight / 2"
          :x="systemInfo.windowWidth - 60"
          direction="all"
          out-of-bounds
        >
          <view
            v-if="
              currentNode.nodeDef &&
              currentNode.nodeDef.formDefId != '3285058246984486156' &&
              currentNode.nodeDef.formDefId != '3721799436069914536' &&
              (currentNode.state == 0 ||
                (addFormBtn &&
                  activeTab.detail.name.nodeDef &&
                  (activeTab.detail.name.nodeDef.nodeType == 'forms' ||
                    activeTab.detail.name.nodeDef.nodeType == 'repeat')))
            "
            class="temporaryBtn"
          >
            <image
              src="https://pub.fsgo365.cn/temporary.png"
              style="width: 20px; height: 20px; display: flex"
            />
            <view class="c-size-12 c-white c-white-space-nowrap">暂存</view>
          </view>
        </movable-view>
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
              :data-event="{ id: 'sMd35RUJZo' }"
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
              :data-event="{ id: 'NNndAA4AWY' }"
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
              :data-event="{ id: 'PgZvtXiCt5' }"
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
              :data-event="{ id: 'wQW7hQR24O' }"
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
                currentNode.nodeDef && currentNode.nodeDef.nodeType == 'repeat' && newFormSubmitBtn
              "
              :data-event="{ id: 'zorCWjCH26' }"
            >
              提交
            </van-button>
            <!-- 施工验收单在完成服务前可以重复提交 -->
            <van-button
              type="info"
              plain
              slot="right"
              @click="saveFormConfirm"
              :disabled="disabled.saveForm"
              v-else-if="
                workflow.state == 0 &&
                currentNode &&
                currentNode.state == 10 &&
                currentNode.nodeDef &&
                currentNode.nodeDef.nodeType != 'disable' &&
                currentNode.visible &&
                (currentNode.formDefId == '3285058246984486156' ||
                  currentNode.formDefId == '3721799436069914536') &&
                activeTab.detail &&
                activeTab.detail.name &&
                activeTab.detail.name.state == 0
              "
              :data-event="{ id: 'WwTYVT1Tju' }"
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
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                    ></van-switch>
                  </van-cell>
                </block>
                <block
                  v-else-if="
                    extField.type == 'date' ||
                    extField.type == 'time' ||
                    extField.type == 'datetime'
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
                      :class="
                        extField.frontEndConfig && extField.frontEndConfig.direction
                          ? extField.frontEndConfig.direction
                          : ''
                      "
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
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
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
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
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
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
                      :data-event="{ id: '7xravDwxi5' }"
                    >
                      <van-icon
                        name="edit"
                        color="#106cff"
                        class="c-m-r-10"
                        :data-event="{ id: '7xravDwxi5' }"
                      />
                      <text class="c-blue" :data-event="{ id: '7xravDwxi5' }">测绘工具</text>
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
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
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
                    :data-event="{ id: 'tbuciq3jgb' }"
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
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                      :data-event="{ id: 'lMTchnKD6x' }"
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
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                      :data-event="{ id: 'hGVIJ65P9K' }"
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
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
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
                        :data-event="{ id: '5G4IfXFRch' }"
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
                    :data-event="{ id: '-jbE4fcW-w' }"
                  >
                    <text
                      class="c-required"
                      v-if="
                        extField.required == '1' &&
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                      "
                      :data-event="{ id: '-jbE4fcW-w' }"
                    >
                      *
                    </text>
                    <van-icon
                      custom-class="c-blue"
                      name="checked"
                      v-if="formData[extField.name]"
                      :data-event="{ id: '-jbE4fcW-w' }"
                    />
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
                        :data-event="{ id: 's_F4yVs9DL' }"
                      >
                        <text class="c-m-r-5 c-color-value" :data-event="{ id: 's_F4yVs9DL' }">
                          查看全部
                        </text>
                        <van-icon
                          name="arrow"
                          class="c-color-value"
                          :data-event="{ id: 's_F4yVs9DL' }"
                        />
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
                <block v-else-if="extField.name == 'servicerNames'">
                  <van-cell
                    :title="extField.nameDisp"
                    :border="false"
                    :required="extField.required"
                  >
                    <view style="text-align: right">
                      <text
                        class="c-m-r-30 c-blue"
                        @click="getHeadman"
                        :data-event="{ id: 'PJ4Sm_xc7R' }"
                      >
                        选工队
                      </text>
                      <text class="c-blue" @click="getLabour" :data-event="{ id: 'IgxT0THkuV' }">
                        选工人
                      </text>
                    </view>
                  </van-cell>
                  <view v-if="formData.servicerNames" class="c-m-40 c-m-t-20 c-gray">
                    {{ formData.servicerNames }}
                  </view>
                </block>
                <!-- 服务过程 -->
                <block v-else-if="extField.name == 'serviceProcess'">
                  <van-cell :title="extField.nameDisp" :border="false">
                    <view class="c-flex c-flex-end c-size-14">
                      <van-icon name="bars" class="c-blue c-m-r-10" />
                      <text
                        v-if="!serviceProcess.sort"
                        class="c-blue"
                        @click="sortStart"
                        :data-event="{ id: 'uG4cp-cY9K' }"
                      >
                        工序步骤拖拽排序
                      </text>
                      <template v-else>
                        <text
                          class="c-blue c-m-r-20"
                          @click="sortConfirm"
                          :data-event="{ id: 'nZ958KA2T1' }"
                        >
                          完成排序
                        </text>
                        <text
                          class="c-gray-6"
                          @click="serviceProcess.sort = false"
                          :data-event="{ id: 'aYXhJeFnYz' }"
                        >
                          取消排序
                        </text>
                      </template>
                    </view>
                  </van-cell>
                  <view v-if="formData.serviceProcess" style="margin: 0 16px">
                    <view
                      v-for="(part, i) in formData.serviceProcess"
                      :key="i"
                      class="serviceProcess-part"
                    >
                      <view
                        class="c-p-b-20"
                        :style="
                          part.procedures && part.procedures.length > 0
                            ? 'border-bottom: 1px solid #c8c9cc'
                            : ''
                        "
                      >
                        <view class="c-bold c-text-center">
                          {{ part.constructionLocation || newCodelabel(part.repairParts) }}
                        </view>

                        <view v-if="!serviceProcess.sort" class="c-flex c-flex-around c-m-t-20">
                          <van-button
                            plain
                            round
                            size="small"
                            icon="delete-o"
                            @click="
                              deletePart(
                                i,
                                part.constructionLocation || newCodelabel(part.repairParts)
                              )
                            "
                            :data-event="{ id: '50egAuR0S4' }"
                          >
                            删除部位
                          </van-button>
                          <van-button
                            type="info"
                            plain
                            round
                            size="small"
                            icon="plus"
                            @click="
                              serviceProcess.part.index = i;
                              getProcedureFromPlatform();
                            "
                            :data-event="{ id: '9yNYChueMx' }"
                          >
                            添加工序
                          </van-button>
                          <van-button
                            type="info"
                            round
                            size="small"
                            icon="records-o"
                            @click="
                              serviceProcess.part.index = i;
                              getConstructionLog(part.repairParts);
                            "
                            :data-event="{ id: '9Ym1aXHcso' }"
                          >
                            选择日志
                          </van-button>
                        </view>
                      </view>
                      <l-drag
                        v-if="serviceProcess.sort"
                        :ref="'dragRef' + i"
                        :list="part.procedures"
                        :column="1"
                        gridHeight="76px"
                        @change="sortChange($event, i)"
                      >
                        <template #grid="{ active, content }">
                          <view class="l-drag-view" :class="{ active }">
                            <view
                              class="c-flex c-flex-between c-item-center c-size-14"
                              style="padding-top: 5px"
                            >
                              <text class="c-gray">服务内容：{{ content.content }}</text>
                            </view>
                            <view
                              class="c-size-14 c-gray c-ellipsis2"
                              style="padding-bottom: 4px"
                              @click="procedureDescClick(content.content, content.desc)"
                              :data-event="{ id: 'OcLWUm8ZEs' }"
                            >
                              服务描述：
                              <text>{{ content.desc || '' }}</text>
                            </view>
                          </view>
                        </template>
                      </l-drag>
                      <block v-else>
                        <view
                          v-for="(procedure, j) in part.procedures"
                          :key="j"
                          :style="
                            systemInfo.platform == 'ios' ||
                            systemInfo.platform == 'android' ||
                            systemInfo.platform == 'devtools'
                              ? j == part.procedures.length - 1
                                ? 'margin: 10px 0 0;'
                                : 'margin: 10px 0;padding-bottom: 10px;border-bottom: 1px solid #c8c9cc;'
                              : j == part.procedures.length - 1
                              ? 'margin: 10px 0 -8px;'
                              : 'margin: 10px 0;padding-bottom: 5px;border-bottom: 1px solid #c8c9cc;'
                          "
                        >
                          <view class="c-flex c-flex-between c-item-center">
                            <text class="c-gray c-size-14">服务内容：{{ procedure.content }}</text>
                            <van-icon
                              name="close"
                              class="c-gray c-size-20"
                              @click="deleteProcedure(procedure, i, j)"
                              :data-event="{ id: '2_U7396UvG' }"
                            />
                          </view>
                          <view
                            class="c-size-14 c-gray c-ellipsis2"
                            @click="procedureDescClick(procedure.content, procedure.desc)"
                            :data-event="{ id: 'kYJwjo2S1n' }"
                          >
                            服务描述：
                            <text>{{ procedure.desc || '' }}</text>
                          </view>
                          <view class="c-flex c-flex-col c-m-t-20">
                            <van-uploader
                              v-for="(step, k) in procedure.processStepDefinitions"
                              :key="k"
                              :file-list="step.urls"
                              multiple
                              @after-read="afterReadForStep($event, step)"
                              @delete="deleteFileForStep($event, step)"
                              :max-count="step.max || 10"
                              :upload-text="
                                (step.operationIds.indexOf(serviceProcess.operationId) != -1
                                  ? '* '
                                  : '') + step.name
                              "
                              @click.native="uploaderClick({ nameDisp: '工序步骤' }, step)"
                            />
                            <!-- <view v-for="(step, k) in procedure.processStepDefinitions" :key="k">
                              <view
                                class="c-flex"
                                :style="k == 0 ? 'margin-bottom:5px' : 'margin:10px 0 5px'"
                              >
                                <text
                                  v-if="step.operationIds.indexOf(serviceProcess.operationId) != -1"
                                  class="c-flex c-red"
                                  style="height: 23px; font-size: 23px"
                                >
                                  *
                                </text>
                                <text>{{ step.name }}</text>
                              </view>
                              <uni-file-picker
                                :key="'stepUrl' + j + k"
                                :value="step.urls"
                                :auto-upload="false"
                                :limit="step.max || 10"
                                @select="afterReadForStep($event, step)"
                                @delete="deleteFileForStep($event, step)"
                                @click.native="uploaderClick({ nameDisp: '工序步骤' }, step)"
                              ></uni-file-picker>
                            </view> -->
                          </view>
                        </view>
                      </block>
                    </view>
                    <view
                      v-if="!serviceProcess.sort"
                      class="c-text-center"
                      style="margin-bottom: 16px"
                    >
                      <van-button
                        type="info"
                        round
                        size="small"
                        @click="addPart"
                        :data-event="{ id: 'y7XRY0Mvnj' }"
                      >
                        添加部位
                      </van-button>
                    </view>
                    <!-- #ifdef APP-PLUS -->
                    <uni-data-picker
                      v-if="!serviceProcess.sort"
                      ref="addPartPicker"
                      :localdata="opts.parts"
                      :map="{
                        text: 'name',
                        value: 'value'
                      }"
                      @change="addPartConfirm"
                    >
                      <view></view>
                    </uni-data-picker>
                    <!-- #endif -->
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
      </movable-area>
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
            :data-event="{ id: '-tm5S5BFbe' }"
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
          <text
            class="c-red"
            @click="closePayment(order.row._id)"
            :data-event="{ id: 'O1unZlmi_e' }"
          >
            关闭当前支付
          </text>
          <view style="width: 1px; background-color: #ebedf0"></view>
          <text class="c-red" @click="payAgain(order.row)" :data-event="{ id: 'e8-O48nEsz' }">
            重新发起支付
          </text>
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
    <van-popup
      :show="area.show"
      position="bottom"
      :close-on-click-overlay="false"
      :z-index="999"
      custom-style="z-index:999"
    >
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
      :data-event="{ id: 'oWsYgwyOjO', capture: false }"
    >
      <view class="richText">
        <rich-text :nodes="dialog.content"></rich-text>
      </view>
    </van-dialog>

    <!-- 视频播放 -->
    <van-dialog
      use-slot
      :show="video.show"
      width="100vw"
      @confirm="closeVideo"
      :data-event="{ id: 'ho65QO10Ow', capture: false }"
    >
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
      :data-event="{ id: 'SXTo3U3Zha', capture: false }"
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
        <van-button
          type="info"
          plain
          slot="right"
          @click="cancelContractAjax"
          :data-event="{ id: 'nbNzcIOnD6' }"
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
          <van-button
            type="info"
            plain
            slot="right"
            @click="signFormSubmit"
            :data-event="{ id: 'LU-u0t3whb' }"
          >
            提交
          </van-button>
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
                  :placeholder="
                    (extField.frontEndConfig && extField.frontEndConfig.placeholder) || ''
                  "
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
                <!-- #ifdef MP-WEIXIN -->
                <van-cell
                  :title="extField.nameDisp"
                  :value="signForm.formData[extField.name]"
                  @click="onSignFormClick"
                  :data-extfield="extField"
                  :required="extField.required == '1'"
                ></van-cell>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <view slot="">
                    <uni-datetime-picker
                      :title="extField.nameDisp"
                      v-model="signForm.formData[extField.name]"
                      :type="extField.type"
                    ></uni-datetime-picker>
                  </view>
                </van-cell>
                <!-- #endif -->
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
                  :data-event="{ id: 'DfJqi_vkl5' }"
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
            :data-event="{ id: 'uQPtbzfgFO' }"
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
              :data-event="{ id: '2VzXChKsuM' }"
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
      :data-event="{ id: 'VJJkzuhtXm', capture: false }"
    >
      <view style="padding: 0 16px 16px; flex: 1; overflow-y: auto">
        <view v-for="(item, i) in leakageCause.data" :key="i">{{ i + 1 }}.{{ item }}</view>
      </view>
    </van-dialog>

    <!-- 施工验收单-选择注意事项原因 -->
    <van-popup :show="noteItemsSelect.show" position="bottom" @close="noteItemsSelect.show = false">
      <!-- #ifdef MP-WEIXIN -->
      <van-tree-select
        :items="noteItemsSelect.items"
        :main-active-index="noteItemsSelect.mainActiveIndex"
        :active-id="noteItemsSelect.activeId"
        @click-nav="noteItemsClickNav"
        @click-item="noteItemsClickItem"
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <view class="c-tree-select">
        <view class="c-tree-select-left">
          <view
            v-for="(item, i) in noteItemsSelect.items"
            :key="i"
            :class="noteItemsSelect.mainActiveIndex == i ? 'c-tree-select-left-item-active' : ''"
            @click="noteItemsSelect.mainActiveIndex = i"
            :data-event="{ id: 'FKTv7aQcpr' }"
          >
            {{ item.text }}
          </view>
        </view>
        <view class="c-tree-select-right">
          <block
            v-if="
              noteItemsSelect.mainActiveIndex > -1 &&
              noteItemsSelect.items[noteItemsSelect.mainActiveIndex]
            "
          >
            <view
              v-for="(item, i) in noteItemsSelect.items[noteItemsSelect.mainActiveIndex].children"
              :key="i"
              :class="
                formData.noteItems && formData.noteItems.indexOf(item.id) != -1
                  ? 'c-tree-select-right-item-active'
                  : ''
              "
              @click="
                noteItemsClickItem({
                  detail: {
                    id: item.id
                  }
                })
              "
              :data-event="{ id: 'Tyn5sHz2gX' }"
            >
              {{ item.name }}
              <van-icon
                v-if="formData.noteItems && formData.noteItems.indexOf(item.id) != -1"
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

    <!-- 施工验收单-注意事项弹窗 -->
    <van-dialog
      custom-class="noteItems-dialog"
      use-slot
      title="注意事项"
      :show="noteItems.show"
      @close="noteItemsClose"
      :data-event="{ id: 'muAawd1Z_q', capture: false }"
    >
      <view style="padding: 0 16px 16px; overflow-y: auto">
        <view v-for="(item, i) in noteItems.data" :key="i">{{ i + 1 }}.{{ item }}</view>
      </view>
    </van-dialog>

    <!-- 推荐服务商品 -->
    <van-popup
      position="bottom"
      :show="serviceGoods.show"
      :safe-area-inset-bottom="false"
      custom-style="height: 80%;overflow: hidden;display:flex;flex-direction:column;z-index:100"
    >
      <van-nav-bar
        title="推荐服务商品"
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
              :data-event="{ id: 'AiAKsohAJk' }"
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
                :data-event="{ id: 'eFFNIOUgaL' }"
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
                    :data-event="{ id: 'EphxxmusbG' }"
                  />
                  <view class="c-selection-right-item-content">
                    <view>
                      <view class="c-size-14 c-ellipsis2">{{ item.name }}</view>
                      <view
                        v-if="item.desc"
                        class="desc"
                        @click="toViewDescription(item.desc)"
                        :data-event="{ id: 'ZRPm17bB6r' }"
                      >
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
                          :data-event="{ id: 'JlJPkL4Gvf' }"
                        >
                          推荐
                        </van-button>
                        <van-button
                          v-else
                          custom-class="c-spec-button c-spec-button-blue"
                          round
                          @click="recommended(item._id)"
                          :data-event="{ id: 'AwgiTDeoav' }"
                        >
                          已推荐
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
      :data-event="{ id: 'uuas5wOKjm', capture: false }"
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
          :data-event="{ id: 'Nwk-PuwJis' }"
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
        <van-button
          type="info"
          plain
          slot="right"
          @click="saveRemark"
          :data-event="{ id: 'Vy0jPL6PEp' }"
        >
          提交
        </van-button>
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
        <van-button
          type="info"
          plain
          slot="right"
          @click="recordsSave"
          :data-event="{ id: 'rdEVlPrlPp' }"
        >
          提交
        </van-button>
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
        :autosize="{ minHeight: 100, maxHeight: 100 }"
        input-class="c-gray"
        @change="recordsContentChange"
      />
      <van-uploader
        style="display: flex; margin: 16px 0 0 16px"
        multiple
        upload-text="上传照片"
        :file-list="records.formData.mediaContent"
        @after-read="recordsAfterRead"
        data-field="mediaContent"
        @delete="recordsDeleteFile"
        :max-count="10"
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
      :data-event="{ id: 'LlLNPHvQLA', capture: false }"
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
        <van-button
          plain
          round
          custom-style="width:100px;"
          @click="reasonCancel"
          :data-event="{ id: '-Ft073qIuC' }"
        >
          取 消
        </van-button>
        <van-button
          type="info"
          round
          custom-style="width:100px;"
          @click="reasonConfirm"
          :data-event="{ id: '9UiCnUzAk_' }"
        >
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
        <van-button
          type="info"
          plain
          slot="right"
          @click="addFromAlbum"
          :data-event="{ id: 'H3ztVIt_sv' }"
        >
          提交
        </van-button>
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
                        :data-event="{ id: 'H20mvYZJYQ' }"
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
                        :data-event="{ id: '7_JNxDdsdf' }"
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
                      :data-event="{ id: 'ATmaB1lUqM' }"
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
                      :data-event="{ id: 'eE7HV9FNe1' }"
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

    <!-- 施工验收单-选工队 -->
    <van-popup
      :show="headman.show"
      round
      position="bottom"
      custom-style="height:80%"
      @close="headman.show = false"
    >
      <van-checkbox-group :value="formData.headmanIds" @change="headmanChange">
        <van-checkbox
          v-for="(item, i) in headman.data"
          :key="i"
          :name="item._id"
          shape="square"
          custom-class="c-m-40"
        >
          {{ item.name }}
        </van-checkbox>
      </van-checkbox-group>
    </van-popup>

    <!-- 施工验收单-选工人 -->
    <van-popup
      :show="labour.show"
      round
      position="bottom"
      custom-style="height:80%"
      @close="labour.show = false"
    >
      <van-checkbox-group :value="formData.labourIds" @change="labourChange">
        <van-checkbox
          v-for="(item, i) in labour.data"
          :key="i"
          :name="item._id"
          shape="square"
          custom-class="c-m-40"
        >
          {{ item.name }}
        </van-checkbox>
      </van-checkbox-group>
    </van-popup>

    <!-- Api调用通过弹窗组件（如：子流程节点保存还是提交确认弹窗） -->
    <van-dialog id="van-dialog" />
    <van-toast id="van-toast" />

    <!-- #ifdef MP-WEIXIN -->
    <!-- 施工验收单-服务流程添加部位 -->
    <van-popup
      v-if="serviceProcess.part.show"
      :show="serviceProcess.part.show"
      round
      position="bottom"
      custom-style="z-index:100"
    >
      <van-cascader
        v-if="serviceProcess.part.show"
        title="请选择要添加的部位"
        :options="SAFormData.serviceType === '40' ? opts.refreshParts : opts.parts"
        :field-names="{
          text: 'name',
          value: 'value',
          children: 'children'
        }"
        @close="serviceProcess.part.show = false"
        @finish="addPartConfirm"
      />
    </van-popup>
    <!-- #endif -->

    <!-- 施工验收单-从哪选择工序 -->
    <van-action-sheet
      :show="serviceProcess.procedure.selectShow"
      :actions="[
        {
          name: '从平台工序选择',
          value: 'platform'
        },
        {
          name: '从施工日志选择',
          value: 'constructionLog'
        }
      ]"
      @select="addProcedureSelect"
      @close="serviceProcess.procedure.selectShow = false"
      close-on-click-action
    ></van-action-sheet>

    <!-- 施工验收单-从平台选择工序 -->
    <van-popup
      v-if="serviceProcess.procedure.platformShow"
      :show="serviceProcess.procedure.platformShow"
      round
      position="bottom"
      custom-style="height:90%"
      :close-on-click-overlay="false"
    >
      <van-nav-bar title="添加工序" left-text="取消" @click-left="platformCancel">
        <van-button
          type="info"
          plain
          slot="right"
          @click="platformConfirm"
          :data-event="{ id: 'jKLxVLwIc1' }"
        >
          提交
        </van-button>
      </van-nav-bar>
      <view class="c-flex c-flex-col" style="height: calc(100% - 46px)">
        <van-search
          @search="getProcedureFromPlatform"
          placeholder="支持搜索工序服务内容或描述"
          shape="round"
        />
        <view class="c-flex-1 c-auto-y">
          <view
            v-for="(item, i) in serviceProcess.procedure.data"
            :key="i"
            class="serviceProcess-procedure c-flex c-item-center"
            @click="platformClick(item)"
            :style="i == 0 ? 'margin-top:6px' : ''"
            :data-event="{ id: '9sCj7rKoeY' }"
          >
            <van-checkbox
              :value="item.checked"
              shape="square"
              @change="
                e => {
                  item.checked = e.detail;
                }
              "
            ></van-checkbox>
            <view>
              <view>{{ item.content }}</view>
              <view class="c-size-14 c-gray">{{ item.desc }}</view>
            </view>
          </view>
        </view>
      </view>
    </van-popup>

    <!-- 施工验收单-从施工日志选择工序 -->
    <van-popup
      v-if="serviceProcess.procedure.constructionLogShow"
      :show="serviceProcess.procedure.constructionLogShow"
      round
      position="bottom"
      custom-style="height:90%"
      :close-on-click-overlay="false"
    >
      <van-nav-bar title="选择日志" left-text="取消" @click-left="constructionLogCancel">
        <van-button
          type="info"
          plain
          slot="right"
          @click="constructionLogConfirm"
          :data-event="{ id: 'mRun5yMOM6' }"
        >
          提交
        </van-button>
      </van-nav-bar>
      <view class="c-flex c-flex-col" style="height: calc(100% - 46px)">
        <view class="c-flex-1 c-auto-y" v-if="serviceProcess.procedure.data.length > 0">
          <view
            v-for="(item, i) in serviceProcess.procedure.data"
            :key="i"
            class="serviceProcess-procedure c-flex c-item-center"
            @click="constructionLogClick(item)"
            :data-event="{ id: 'SlfakOyJAk' }"
          >
            <van-checkbox
              :value="item.checked"
              shape="square"
              @change="
                e => {
                  item.checked = e.detail;
                }
              "
            ></van-checkbox>
            <view>
              <view v-if="item.orderId">订单编号：{{ item.orderId }}</view>
              <view>提交时间：{{ item.updateTime }}</view>
              <view>提交人员：{{ item.updateUserName }}</view>
              <view class="c-flex" v-if="item.data.length > 0">
                <view>工序名称：</view>
                <view>
                  <view v-for="(procedure, j) in item.data">
                    {{ j + 1 }}.{{ procedure.content }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <van-empty v-else description="还没有记录施工日志" />
      </view>
    </van-popup>

    <!-- canvas 画布手写签字功能 -->
    <van-popup
      :show="canvas.canvasSignatureDataShow"
      :safe-area-inset-bottom="false"
      position="left"
      @after-enter="clearClick()"
    >
      <view class="canvasModuleData">
        <view class="canvas_btnBox">
          <view class="canvas_btn1" @tap="clearClick">
            <text style="transform: rotate(90deg); white-space: nowrap; display: inline-block">
              重签
            </text>
          </view>
          <view class="canvas_btn2" @tap="overSign">
            <text style="transform: rotate(90deg); white-space: nowrap; display: inline-block">
              完成签名
            </text>
          </view>
        </view>
        <!-- <canvas
          class="firstCanvas"
          canvas-id="firstCanvas"
          @touchmove="move"
          @touchstart="start($event)"
          @touchend="end"
          @touchcancel="cancel"
          disable-scroll="true"
          @error="error"
        ></canvas> -->

        <!-- <view class="Landscape" v-if="!canvas.isEnd">请在该区域内，签署自己的名称</view> -->

        <view class="CanvasBox" style="width: calc(100vw - 140px)">
          <canvas
            style="z-index: 2; height: 100%; width: 100%"
            canvas-id="firstCanvas"
            @touchmove="move"
            @touchstart="start($event)"
            @touchend="end"
            @touchcancel="cancel"
            disable-scroll="true"
            @error="error"
          ></canvas>

          <view class="Landscape" v-if="!canvas.isEnd">
            <view>请</view>
            <view class="line"></view>
            <view>签</view>
            <view class="line"></view>
            <view>字</view>
          </view>
        </view>
        <view class="textReminder">
          <view class="">
            <text style="transform: rotate(90deg); white-space: nowrap; display: inline-block">
              您的签名将由系统生成在申请文书中，视同对申请文书的电子签名。
            </text>
          </view>
          <view class="">
            <text
              style="
                transform: rotate(90deg);
                color: yellow;
                white-space: nowrap;
                display: inline-block;
              "
            >
              请在线进行手写签名（请逆时针旋转手机至横屏签名）
            </text>
          </view>
        </view>
        <view class="Exitsignature" @click="Exitsignature" :data-event="{ id: 'TlSdVVWD9g' }">
          退出签字
        </view>
      </view>
    </van-popup>

    <van-overlay root-portal :z-index="9999" :show="canvas.showCanvasLoading">
      <view>
        <van-loading vertical size="32px" class="c-loading">处理中...</van-loading>
      </view>
    </van-overlay>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');

// canvas 相关变量
var content = null;
var touchs = [];
var canvasw = 0;
var canvash = 0;
var _that;

// require('../../resources/js/binding.js');
import drawQrcode from '@/resources/js/weapp.qrcode.esm.js';
import tkiQrcode from '@/wxcomponents/tki-qrcode/tki-qrcode.vue';
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
    tkiQrcode
  },
  data() {
    return {
      systemInfo: {},
      id: '', //工单id
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
        exts: {}
      }, //表单数据
      options: {
        codecfg_serviceType: { codeId: 'serviceType' },
        codecfg_status: { codeId: 'STATUS' },
        codecfg_reasons1: { codeId: 'reasons1' },
        codecfg_reasons2: { codeId: 'reasons2' },
        cascadeCode_parts: { codeId: 'parts' },
        codecfg_refreshParts: { codeId: 'refreshParts' }, // 刷新维修部位
        codecfg_partsOne: { codeId: 'partsOne' },
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
        // recordUrl: '', // 当前通话录音地址
        // audio: null, // 背景音频实例
        // currentTime: '00:00', // 当前播放时间 格式00:00
        // endTime: '00:00', // 结束时间 格式00:00
        // duration: 0, //  总时间 单位秒
        // // progress: 0, // 滑块当前进度
        // max: 100, //最大值
        // state: 'paused', // 当前播放状态
        playingIndex: '', //正在播放中的索引
        playingItem: {}, //正在播放中的item
        // checkDuration: null, //定时器
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
          remind: false,
          mediaContent: []
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
        activeName: '', // 展开的相册标签  //default 默认
        data: {}
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
        saveForm: false
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
      systemInfo: '',
      archivesData: [],
      // 施工验收单-服务人员
      headman: {
        show: false,
        data: []
      },
      labour: {
        show: false,
        data: []
      },
      // 施工验收单-选择注意事项
      noteItemsSelect: {
        items: [],
        mainActiveIndex: 0,
        activeId: [],
        show: false
      },
      // 施工验收单-注意事项弹窗
      noteItems: {
        show: false,
        data: []
      },
      // 施工验收单-服务过程
      serviceProcess: {
        sort: false,
        sortData: {},
        operationId: '',
        part: {
          show: false,
          index: 0 // 当前添加工序的部位下标
        },
        procedure: {
          selectShow: false,
          platformShow: false,
          constructionLogShow: false,
          show: false,
          data: []
        }
      },
      // 施工验收单-pdf
      acceptancePdf: {
        acceptanceUrl: '',
        signImageUrl: ''
      },
      // canvas 客户签字相关 数据变量
      canvas: {
        canvasSignatureDataShow: false, //是否显示客户签字弹出层
        isEnd: false, // 是否签名
        acceptanceId: '', //签订的PDF
        showCanvasLoading: false,
        extId: '' //表的Id
      },
      currentRoleButtons: []
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.systemInfo = app.globalData.systemInfo;
    this.roleId = wx.getStorageSync('currentRole')._id;
    this.roleIds = wx.getStorageSync('user').roleIds;
    this.orgId = wx.getStorageSync('user').orgId;
    this.id = common.osg.param('id');
    this.userId = wx.getStorageSync('user')._id;
    this.currentRoleButtons = wx.getStorageSync('currentRoleButtons') || [];

    // // 监听用户在系统音乐播放面板点击上一曲事件
    // audio.onPrev(() => {
    //   // console.log('onNext');
    //   let callRecordUrls = [];
    //   let callRecords = [];
    //   this.log.data.map(item => {
    //     if (item.type == '3' && item.recordUrl) {
    //       callRecordUrls.push(item.recordUrl);
    //       callRecords.push(item);
    //     }
    //   });
    //   // 当有大于1条通话录音时
    //   if (callRecordUrls.length > 1) {
    //     // 当有上一曲时，即当前播放的不是第一曲。
    //     if (callRecordUrls.indexOf(this.callRecord.recordUrl) != 0) {
    //       this.callPlay(callRecords[callRecordUrls.indexOf(this.callRecord.recordUrl) - 1]);
    //     }
    //   }
    // });
    // // 监听用户在系统音乐播放面板点击下一曲事件
    // audio.onNext(() => {
    //   // console.log('onNext');
    //   let callRecordUrls = [];
    //   let callRecords = [];
    //   this.log.data.map(item => {
    //     if (item.type == '3' && item.recordUrl) {
    //       callRecordUrls.push(item.recordUrl);
    //       callRecords.push(item);
    //     }
    //   });
    //   // 当有大于1条通话录音时
    //   if (callRecordUrls.length > 1) {
    //     // 当有下一曲时，即当前播放的不是最后一曲。
    //     if (callRecordUrls.indexOf(this.callRecord.recordUrl) != callRecordUrls.length - 1) {
    //       this.callPlay(callRecords[callRecordUrls.indexOf(this.callRecord.recordUrl) + 1]);
    //     }
    //   }
    // });

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
        this.opts.refreshParts = common.osg.deepCopy(this.options.refreshParts);
        this.opts.albumLabel = common.osg.deepCopy(this.options.albumLabel);
      });
    });
    // 获取定位
    // common.osg.getLocation(location => {
    //   this.longitude = location.longitude;
    //   this.latitude = location.latitude;
    // });
    // #ifdef APP-PLUS
    this.getArea();
    // #endif
    _that = this;
    let dev = uni.getSystemInfoSync();
    canvasw = dev.screenWidth - 20;
    canvash = dev.screenHeight - 70; //获得Canvas的上下文
    content = wx.createCanvasContext('firstCanvas'); //设置线的颜色
    content.setStrokeStyle('#000'); //设置线的宽度
    content.setLineWidth(5); //设置线两端端点样式更加圆润
    content.setLineCap('round'); //设置两条线连接处更加圆润
    content.setLineJoin('round');
    content.setFillStyle('white'); //填充白色
    content.fillRect(0, 0, canvasw, canvash); //画出矩形白色背景
    content.restore();
    content.save();
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
    clearInterval(this.payment.timer);
    clearInterval(this.orderTimer);
    clearInterval(this.surveyTimer);
    if (this.activeTab.detail.name.nodeDef && this.activeTab.detail.name.nodeDef.temporary) {
      this.temporaryForm();
    }
  },
  onUnload() {
    clearInterval(this.payment.timer);
    clearInterval(this.orderTimer);
    clearInterval(this.surveyTimer);
    if (this.activeTab.detail.name.nodeDef && this.activeTab.detail.name.nodeDef.temporary) {
      this.temporaryForm();
    }
    this.stopAudioPlayback();
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
      }, 200);
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
          console.log('赋值摘要信息和工单状态', this.SAFormData);

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
      console.log('当前tab节点', node);
      this.fabShow = false;
      this.takebackShow = false;
      this.rollbackShow = false;

      if (node == 'log') {
        this.md({ act: 'SAOperation_activity' });
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
      this.stopAudioPlayback();
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
          // 查询防水服务流程时，赋值施工验收单默认值，用于判断是否显示“查看文件”、“复制链接”、“客户签字”按钮。
          if (defId == '7211093939480933763') {
            this.acceptancePdf = {
              acceptanceUrl: '',
              signImageUrl: '',
              signable: false
            };
          }
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

              // 查询防水服务流程时，如果已生成施工验收单，查询施工验收单数据，用于判断是否显示“查看文件”、“复制链接”、“客户签字”按钮。
              if (defId == '7211093939480933763') {
                let arr = runNodes.filter(
                  node =>
                    node.state != -1 &&
                    (node.formDefId == '3285058246984486156' ||
                      node.formDefId == '3721799436069914536') &&
                    node.formDataId
                );
                if (arr.length > 0) {
                  this.getNodeFormData(arr[0].formDefId, arr[0].formDataId, formData => {
                    this.acceptancePdf = {
                      acceptanceUrl: formData.acceptanceUrl || '',
                      signImageUrl: formData.signImageUrl || '',
                      signable: formData.signable || false
                    };
                  });
                } else {
                  this.acceptancePdf = {
                    acceptanceUrl: '',
                    signImageUrl: '',
                    signable: false
                  };
                }
              }
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
              options.edit,
              node
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
    // 生成弹出客户签字功能模块  森
    processClientSignature(subNode) {
      this.canvas.acceptanceId = subNode.formDataId;
      this.canvas.extId = subNode.formDefId;
      this.canvas.canvasSignatureDataShow = true;
    },
    overSign() {
      if (this.canvas.isEnd) {
        this.canvas.showCanvasLoading = true;
        console.log('客户签字', this.canvas.showCanvasLoading);
        content.draw(
          true,
          setTimeout(() => {
            uni.canvasToTempFilePath({
              canvasId: 'firstCanvas',
              fileType: 'png',
              success: res => {
                //打印图片路径
                let url = res.tempFilePath;
                common.osg.ajax(
                  'back/super/file/upToken.do',
                  {
                    fileName: url
                  },
                  data => {
                    wx.uploadFile({
                      url: 'https://up-z1.qiniup.com',
                      filePath: url,
                      name: 'file',
                      formData: data,
                      success(res) {
                        if (res.statusCode === 200) {
                          // 文件上传成功
                          const data = JSON.parse(res.data);
                          let imgURL =
                            'https://pub.fsgo365.cn/' + data.key + '?imageMogr2/rotate/-90';
                          console.log('上传成功，返回的数据为：', imgURL);
                          // 在这里做上传成功后的操作，如显示上传成功信息、更新页面等

                          _that.generateAcceptanceReportPDF(
                            _that.canvas.acceptanceId,
                            imgURL,
                            _that.canvas.extId
                          );
                        } else {
                          _that.canvas.showCanvasLoading = false;
                          // 文件上传失败
                          console.error('上传失败，请检查网络或服务器配置');
                          // 在这里处理上传失败的情况，可以给出提示信息或重试等
                        }
                      },
                      fail(error) {
                        console.log(error);
                        _that.canvas.showCanvasLoading = false;
                        common.osg.toast('上传失败', 'error');
                      }
                    });
                  },
                  {
                    noload: true
                  }
                );
              }
            });
          }, 500)
        );
      } else {
        uni.showToast({
          title: '请先完成签名',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      }
    },
    //  工单id
    generateAcceptanceReportPDF(acceptanceId, signImageUrl, extId = '') {
      console.log('111111111111', extId);
      //这个是服务流程的 表单ID
      //console.log('222222222222', this.currentNode.nodeDef.formDefId);
      common.osg.ajax(
        '/basic/acceptance/generateAcceptanceReportPDF',
        { signImageUrl, acceptanceId, extId },
        data => {
          this.canvas.showCanvasLoading = false;
          if (data.success) {
            // 更新施工验收单模版pdf和签字链接
            // this.currentNode.nodeDef.formDefId;
            // this.getNodeFormData('3285058246984486156', acceptanceId, formData => {
            this.getNodeFormData(this.currentNode.nodeDef.formDefId, acceptanceId, formData => {
              this.acceptancePdf = {
                acceptanceUrl: formData.acceptanceUrl || '',
                signImageUrl: formData.signImageUrl || '',
                signable: formData.signable || false
              };

              if (signImageUrl) {
                common.osg.toast('签字成功', 'none');
                this.Exitsignature();
              }
            });
          }
        },
        {
          noload: signImageUrl ? true : false
        }
      );
    },
    // 画布的触摸移动开始手势响应
    start(event) {
      // console.log(event)
      // console.log("触摸开始" + event.changedTouches[0].x)
      // console.log("触摸开始" + event.changedTouches[0].y)
      //获取触摸开始的 x,y
      let point = {
        x: event.changedTouches[0].x,
        y: event.changedTouches[0].y
      }; // console.log(point)
      touchs.push(point);
    }, // 画布的触摸移动手势响应
    move(e) {
      if (this.canvas.showCanvasLoading) return;
      let point = {
        x: e.touches[0].x,
        y: e.touches[0].y
      }; // console.log(point)
      touchs.push(point);
      if (touchs.length >= 2) {
        this.draw(touchs);
      }
    }, // 画布的触摸移动结束手势响应
    end(e) {
      // console.log("触摸结束" + e)
      // 设置为已经签名
      this.canvas.isEnd = true; // 清空轨迹数组
      for (let i = 0; i < touchs.length; i++) {
        touchs.pop();
      }
    }, // 画布的触摸取消响应
    cancel(e) {
      console.log('触摸取消' + e);
    },
    error(e) {
      console.log('画布触摸错误' + e);
    }, //绘制
    draw(touchs) {
      // console.log(touchs[0], touchs[1])
      let point1 = touchs[0];
      let point2 = touchs[1];
      touchs.shift();
      content.moveTo(point1.x, point1.y);
      content.lineTo(point2.x, point2.y);
      content.stroke();
      content.draw(true);
    }, //清除操作
    clearClick() {
      setTimeout(() => {
        // 设置为未签名
        this.canvas.isEnd = false; //清除画布
        content.clearRect(0, 0, canvasw, canvash);
        content.draw(true);
      }, 100);
    },
    //退出签字
    Exitsignature() {
      //清空画布
      this.clearClick();
      //退出签字弹出层
      this.canvas.canvasSignatureDataShow = false;
    },

    // 到此结束 canvas 签字相关的函数方法变量

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
    getFormData(formDefId, formDataId, edit, node) {
      let url = 'biz/extForm/query/' + formDefId;
      let params = {
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:_id|string#and': formDataId,
        notFilterBelongTo:
          formDefId == '3285058246984486156' || formDefId == '3721799436069914536' ? '1' : null // 施工验收单是多人可填写，不过滤数据权限
      };
      if (formDefId == '3285058246984486156') {
        url = '/biz/extForm/findByIdWithWorkflow';
        params = {
          extId: formDefId,
          id: formDataId
        };
      }
      common.osg.ajax(
        url,
        params,
        res => {
          let formData = {};
          // 将扩展字段拿出来供列表返显
          if (formDefId == '3285058246984486156') {
            formData = res.data.data;
          } else {
            formData = res.data[0];
          }
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

          // TODO 施工验收单 默认赋值
          if (formDefId == '3285058246984486156' || formDefId == '3721799436069914536') {
            // 服务人员
            if (!formData.headmanIds) formData.headmanIds = [];
            if (!formData.headmanNames) formData.headmanNames = [];
            if (!formData.labourIds) formData.labourIds = [];
            if (!formData.labourNames) formData.labourNames = [];
            // 注意事项
            if (!formData.noteItems) formData.noteItems = [];
            // 获取当前登录人所属运营中心，用来判断工序步骤是否必填
            this.getMyOperation();
            // 处理工序步骤图片字段默认值
            if (formData.serviceProcess) {
              for (let i = 0; i < formData.serviceProcess.length; i++) {
                let part = formData.serviceProcess[i];
                for (let j = 0; j < part.procedures.length; j++) {
                  let procedure = part.procedures[j];
                  procedure.processStepDefinitions = procedure.processStepDefinitions || [];
                  for (let k = 0; k < procedure.processStepDefinitions.length; k++) {
                    let step = procedure.processStepDefinitions[k];
                    step.urls = step.urls || [];
                    step.operationIds = step.operationIds || [];
                  }
                }
              }
            }

            // 客户在C端签字后，编辑表单不会生成新的施工验收单pdf文件。
            if (node && node.state == 0 && formData.signImageUrl) {
              common.osg.alert('客户已签字，修改表单不会再生成新的施工验收单pdf文件。');
            }
          }

          this.formData = formData;

          if (edit) this.openForm = true;
        },
        {
          noload: true
        }
      );
    },
    // 确认是保存表单还是提交表单，提交表单时才校验是否必填并处理工作流
    saveFormConfirm() {
      if (this.serviceProcess.sort) {
        this.sortConfirm();
      }

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
          cancelButtonColor: '#106cff',
          dataEvent: { id: 'xvuuarfTlT' }
        })
          .then(() => {
            // on confirm 提交表单
            // setTimeout 防止第1个未关闭 第2个就弹出会有层级问题
            setTimeout(() => {
              this.saveForm();
            }, 500);
          })
          .catch(() => {
            // on cancel 保存表单，不处理工作流
            setTimeout(() => {
              this.saveForm('saveOnly');
            }, 500);
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
      params.sid = this.id;
      params.smodule = 'serviceAppointment';

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

      // 提交施工验收单时，处理多人编辑的情况：提交时查询表单最新数据，并将本地表单数据有值的字段覆盖最新数据后提交。
      if (
        (nodeFormDefId == '3285058246984486156' || nodeFormDefId == '3721799436069914536') &&
        params._id
      ) {
        // 校验工序步骤是否必填
        if (type != 'saveOnly') {
          for (let i = 0; i < params.serviceProcess.length; i++) {
            let part = params.serviceProcess[i];
            for (let j = 0; j < part.procedures.length; j++) {
              let procedure = part.procedures[j];
              for (let k = 0; k < procedure.processStepDefinitions.length; k++) {
                let step = procedure.processStepDefinitions[k];
                if (
                  step.operationIds.indexOf(this.serviceProcess.operationId) != -1 &&
                  (!step.urls || step.urls.length == 0)
                ) {
                  common.osg.alert(`请上传“${part.constructionLocation}”的“${step.name}”图片!`);
                  this.disabled.saveForm = false; //取消禁用提交表单按钮
                  return;
                }
              }
            }
          }
          // 存储全部部位供过滤
          params.constructionLocation = params.serviceProcess
            .map(item => item.constructionLocation)
            .join('、');
        }

        params.completionTimeOfConstruction = common.osg.readableTime('', 'date');

        common.osg.ajax(
          'biz/extForm/query/' + nodeFormDefId,
          {
            sortField: 'createTime',
            sortOrder: 'desc',
            'is:_id|string#and': params._id,
            notFilterBelongTo: '1' // 施工验收单是多人可填写，不过滤数据权限
          },
          res => {
            let newFormData = res.data[0];
            for (let key in newFormData) {
              if (key == 'exts') {
                for (let subKey in newFormData.exts) {
                  if (
                    (!params.exts[subKey] || params.exts[subKey].length == 0) &&
                    newFormData.exts[subKey]
                  ) {
                    params.exts[subKey] = newFormData.exts[subKey];
                  }
                }
              } else {
                if ((!params[key] || params[key].length == 0) && newFormData[key]) {
                  params[key] = newFormData[key];
                }
              }
            }

            // 保存和提交验收单，清空签名照片，重新生成pdf。
            if (type == 'saveOnly') {
              params.signable = false;
            } else {
              params.signable = true;
            }
            delete params.signImageUrl;

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
                  this.activeTab.detail.name.nodeDef.formDefId == '7971040108398070730'
                ) {
                  // 不查询列表，tabChange会查询
                  this.createSurveyPDFUrl(res.data, true);
                  // 保存测绘工具数据到后台，然后删除缓存
                  this.surveyToolUpsert(res.data._id);
                }
                // 提交预约表单后，需要上门的，添加日程到手机日历
                if (nodeFormDefId == '2522989775781119510' && this.formData.need == '1') {
                  // #ifdef MP-WEIXIN
                  let address =
                    this.area.areaList.county_list[this.SAFormData.area[2]] +
                    this.SAFormData.address;
                  // #endif
                  // #ifdef APP-PLUS
                  let address =
                    this.area.county_list[this.SAFormData.area[2]] + this.SAFormData.address;
                  // #endif
                  common.osg.addPhoneCalendar({
                    title: '上门勘察',
                    startTime: this.formData.datetime,
                    alarmOffset: 3600, // 提前1小时提醒
                    location: address,
                    description: this.formData.note
                  });
                }
                // 保存和提交施工验收单自动生成施工验收单pdf
                if (type != 'saveOnly') {
                  this.acceptancePdf = {
                    acceptanceUrl: '',
                    signImageUrl: '',
                    signable: true
                  };
                } else {
                  this.acceptancePdf = {
                    acceptanceUrl: '',
                    signImageUrl: '',
                    signable: false
                  };
                }
                // console.log(3333333, this.currentNode.nodeDef.formDefId, res);
                // console.log(4444444, this.currentNode, res);
                this.generateAcceptanceReportPDF(res.data._id, '', nodeFormDefId);

                // 处理工作流
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
              },
              {
                noload: true,
                fail: () => {
                  // 解决工单表单提交失败无法继续提交的问题
                  this.disabled.saveForm = false;
                }
              }
            );
          }
        );
      } else {
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
              this.activeTab.detail.name.nodeDef.formDefId == '7971040108398070730'
            ) {
              // 不查询列表，tabChange会查询
              this.createSurveyPDFUrl(res.data, true);
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
              let address =
                this.area.county_list[this.SAFormData.area[2]] + this.SAFormData.address;
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
                if (type != 'saveOnly') {
                  this.process(res.data._id);
                }
              }
            }
            // 清除暂存数据
            wx.removeStorageSync('temporaryForm');
            this.openForm = false;
            this.disabled.saveForm = false; //取消禁用提交表单按钮
          },
          {
            noload: true,
            fail: () => {
              // 解决工单表单提交失败无法继续提交的问题
              this.disabled.saveForm = false;
            }
          }
        );
      }
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
      if (this.serviceProcess.sort) this.serviceProcess.sort = false; // 取消拖拽排序
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
                setTimeout(() => {
                  resolve();
                }, 500);
              },
              {
                fail: () => {
                  setTimeout(() => {
                    reject();
                  }, 500);
                }
              }
            );
          });
        } catch (error) {
          // 点了取消
          return;
        }
      }

      if (nodeFormDataId == 'complate') {
        if (
          this.activeTab.detail.name.nodeDef &&
          (this.activeTab.detail.name.nodeDef.nodeType == 'repeat' ||
            this.activeTab.detail.name.nodeDef.nodeType == 'forms')
        ) {
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
          smodule: 'serviceAppointment',
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
            ? `已推荐${this.formData.serviceGoods.length}个服务商品`
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
        this.activeTab.detail.name.nodeDef.formDefId == '7971040108398070730' &&
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
      } else if (field == 'noteItemsSelect') {
        // 施工验收单-选择注意事项
        this.formData.noteItems = this.formData.noteItems || [];
        if (this.noteItemsSelect.items.length > 0) {
          // let mainActiveIndex = this.noteItemsSelect.items.findIndex(
          //   item => item.part == this.formData.part[0]
          // );
          let noteItemsSelect = {
            items: this.noteItemsSelect.items,
            mainActiveIndex: 0,
            // mainActiveIndex: mainActiveIndex != -1 ? mainActiveIndex : 0,
            activeId: this.formData.noteItems,
            show: true
          };
          this.$set(this, 'noteItemsSelect', noteItemsSelect);
        } else {
          this.getNoteItems(data => {
            let items = [];
            data.map(obj => {
              // 赋值组件需要用到的值
              obj.text = obj.name || obj.label;
              obj.id = obj.content || obj.leakageCause;
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
            // let mainActiveIndex = items.findIndex(item => item.part == this.formData.part[0]);
            let noteItemsSelect = {
              items,
              mainActiveIndex: 0,
              // mainActiveIndex: mainActiveIndex != -1 ? mainActiveIndex : 0,
              activeId: this.formData.noteItems,
              show: true
            };
            this.$set(this, 'noteItemsSelect', noteItemsSelect);
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
      } else if (type == 'date' || type == 'time' || type == 'datetime') {
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
        this.$refs.uniDataPicker && this.$refs.uniDataPicker.show();
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
          // this.signForm.formData[this.datetime.field] = new Date(value)
          //   .toLocaleDateString('en-CA')
          //   .replace(/\//g, '-');
          const date = new Date(value);
          // 获取年、月、日
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，因此加1，并且补充前导零
          const day = date.getDate().toString().padStart(2, '0'); // 补充前导零
          // 拼接成所需格式 YYYY-MM-DD
          const formattedDate = `${year}-${month}-${day}`;
          this.signForm.formData[this.datetime.field] = formattedDate;
        } else {
          this.formData[this.datetime.field] = new Date(value)
            .toLocaleDateString()
            .replace(/\//g, '-');
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
    //时间格式转化
    formattTime(dateValue) {
      let value = dateValue;
      if (typeof dateValue == 'object') {
        value == value.valueOf();
      }

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
        this.activeTab.detail.name.nodeDef.formDefId == '7971040108398070730' &&
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
        // 如果图片带渗漏原因，插入渗漏原因字段
        if (extfield.exts.noteItems) {
          if (this.formData.noteItems) {
            if (this.formData.noteItems.indexOf(extfield.exts.noteItems) == -1) {
              this.formData.noteItems.push(extfield.exts.noteItems);
            }
          } else {
            this.$set(this.formData, 'noteItems', [extfield.exts.noteItems]);
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
        // 如果图片带注意事项，图片全部删除后，删除渗漏原因中对应内容
        if (
          this.formData[field].length == 0 &&
          extfield.exts.noteItems &&
          this.formData.noteItems
        ) {
          this.formData.noteItems.splice(
            this.formData.noteItems.indexOf(extfield.exts.noteItems),
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
            currentPage.route == 'subpackages/serviceAppointment/serviceAppointment' ? true : false;
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
        parts: [],
        codecfg_status: { codeId: 'STATUS' }
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
        this.$refs.uniDataPicker && this.$refs.uniDataPicker.show();
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
          if (
            !/^[\p{Script=Han}\p{Script=Latin}\s]+$/u.test(this.signForm.formData[extField.name])
          ) {
            common.osg.alert(
              `${extField.nameDisp}格式错误，仅输入中文或英文字符，不要包含特殊符号`
            );
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
        // 取消七牛云压缩参数
        if (extField.type == 'file') {
          if (Array.isArray(this.signForm.formData[extField.name])) {
            for (let obj of this.signForm.formData[extField.name]) {
              if (obj.url.indexOf('?') != -1) {
                obj.url = obj.url.substring(0, obj.url.indexOf('?'));
              }
            }
          } else if (this.signForm.formData[extField.name]) {
            let arr = this.signForm.formData[extField.name].split(',');
            this.signForm.formData[extField.name] = this.signForm.formData[extField.name].map(
              item => {
                url: item;
              }
            );
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
          setTimeout(() => {
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
          }, 300); // 延迟解决App端请求的错误提示弹窗不展示问题
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
    //核查单按钮显示下拉
    toggleButton(i) {
      this.btnShow = this.btnShow === i ? false : i;
    },
    //电子签约 超过10分钟  刷新合同签约状态
    contractStatusRefresh(id) {
      console.log(1111, id);
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
      //如果合同使用了优惠券 限制一下 增 减项
      if ((type == 1 || type == 2) && row.exts.couponPrintingId) {
        common.osg.confirm(
          '由于您当前的合同已使用优惠券，不支持对该合同进行增项或减项操作。',
          () => {},
          { showCancel: 'hide' }
        );
        return;
      }

      let url =
        (type == '4' ? '../contract/appendixes' : '../contract/extForm') +
        '?t=' +
        new Date().getTime();
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
    //跳转填写核查单
    editViewCheck(type, item) {
      const {
        exts: { leakagesite_copy },
        _id
      } = item;
      console.log('合同ID', _id);
      //编辑核查单 activities/checksheet
      if (type == 'edit') {
        this.doOpen('/subpackages/check/checkSheet', {
          leakagesite_copy,
          _id
        });
        //查看核查单
      } else if (type == 'view') {
        this.doOpen('/subpackages/check/checkSheetList', {
          _id
        });
      }
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

      // plus.downloader
      //   .createDownload(url, {}, (d, status) => {
      //     console.log('是否触发了');
      //     //d为下载的文件对象
      //     if (status == 200) {
      //       uni.hideLoading();
      //       // 下载成功，d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
      //       let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
      //       common.osg.alert(
      //         '已保存到手机文件夹：' + fileSaveUrl.match(/(Android|android)\/data\/.*/i)[0],
      //         () => {

      //           plus.runtime.openFile(fileSaveUrl); // 选择软件打开文件
      //         },
      //         '下载成功',
      //         '打开文件'
      //       );
      //     } else {
      //       //下载失败
      //       uni.hideLoading();
      //       plus.downloader.clear(); //清除下载任务
      //       common.osg.toast('下载失败，请稍后重试', 'none');
      //     }
      //   })
      //   .start();

      plus.downloader
        .createDownload(url, {}, (d, status) => {
          if (status == 200) {
            uni.hideLoading();
            let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
            console.log('文件保存路径:', fileSaveUrl); // 打印文件路径
            // 检查文件是否存在
            plus.io.resolveLocalFileSystemURL(
              fileSaveUrl,
              entry => {
                console.log('文件存在:', entry);
                common.osg.alert(
                  '已保存到手机文件夹：' + d.filename,
                  () => {
                    plus.runtime.openFile(d.filename, {}, error => {
                      if (error) {
                        common.osg.toast('打开文件失败，请检查文件格式或路径', 'none');
                      }
                    });
                  },
                  '下载成功',
                  '打开文件'
                );
              },
              error => {
                console.error('文件不存在:', error);
                common.osg.toast('文件不存在，请检查下载是否成功', 'none');
              }
            );
          } else {
            uni.hideLoading();
            plus.downloader.clear();
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
      console.log('viewAddForm', form);
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
          // this.formData = {
          //   exts: {}
          // };
          // this.openForm = true;
          this.getTemporaryForm();
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
        this.statusUpsert({
          data: JSON.stringify({
            sid: this.SAFormData._id,
            'exts.reasons1': this.changeStatus.reason,
            'exts.memo1': this.changeStatus.memo,
            status: this.changeStatus.status
          })
        });
      } else {
        // 上门未成交
        this.SAFormData.exts.reason2 = this.changeStatus.reason;
        this.SAFormData.exts.memo2 = this.changeStatus.memo;
        this.SAFormData.exts.time204 = common.osg.readableTime();
        this.statusUpsert({
          data: JSON.stringify({
            sid: this.SAFormData._id,
            'exts.reason2': this.changeStatus.reason,
            'exts.memo2': this.changeStatus.memo,
            'exts.time204': common.osg.readableTime(),
            status: this.changeStatus.status
          })
        });
      }
      this.SAFormData.status = this.changeStatus.status;
      this.SAFormData.exts = this.SAFormData.exts || {};
      this.changeStatus = {
        statusShow: false,
        reasonShow: false,
        status: '', // 选择的工单状态
        reason: '', // 暂时不需要上门原因/上门未成交原因
        memo: '' // 其他原因备注
      };
    },
    // 更新工单状态和原因
    statusUpsert(params) {
      common.osg.ajax(
        'basic/serviceAppointment/handleServiceAppointmentFieldValues',
        params,
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
        this.activeTab.detail.name.nodeDef.formDefId == '7971040108398070730'
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
            type: 'survey',
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
        this.activeTab.detail.name.nodeDef.formDefId == '7971040108398070730'
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
        'basic/serviceAppointment/handleServiceAppointmentFieldValues',
        {
          data: JSON.stringify({
            sid: this.SAFormData._id,
            describe: this.remark.content
          })
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
          data: JSON.stringify({
            sid: this.id,
            smodule: 'serviceAppointment',
            taskTime: this.records.formData.taskTime,
            content: this.records.formData.content,
            mediaContent: this.records.formData.mediaContent || []
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
    callPlay(item, index) {
      if (item.state == 'paused' || item.state == 'end') {
        item.audio.title = this.SAFormData.name + '的通话录音' + item.createTime;
        item.audio.src = item.recordUrl; // 设置了 src 之后会自动播放
        // 暂停其他项的音频
        this.log.data.forEach((audioItem, i) => {
          if (i !== index) {
            // 只修改非当前播放项的状态
            audioItem.state = 'paused';
            if (audioItem.audio) {
              audioItem.audio.pause(); // 停止其他项的音频
            }
          }
        });
        this.callRecord.playingIndex = index;
        this.callRecord.playingItem = item;
        item.audio.play();
        return;
      }
      common.osg.md({ act: 'playCallRecording' });
    },
    // 暂停
    callPause() {
      this.callRecord.playingItem.audio.pause();
    },
    // 拖拽当前时间进度条
    callProgressDrag(e) {
      this.callRecord.seek = true;
      this.callRecord.playingItem.currentTime = this.formatCallRecordCurrentTime(e.detail.value);

      console.log('callProgressDrag', e.detail.value);
    },
    // 跳转到指定位置 单位s，精确到小数点后3位，即支持ms级别精确度。
    callSeek(e) {
      // this.callRecord.seek = false;
      this.callRecord.playingItem.audio.seek(e.detail.value);

      console.log('callSeek', e.detail.value);
    },
    getLog() {
      if (this.log.myActionTypeValues.length == 0) return;
      common.osg.ajax(
        'biz/action/query.do',
        {
          bizType: 'serviceAppointment',
          sid: this.id,
          actionType:
            this.log.type.length > 0 ? this.log.type.join() : this.log.myActionTypeValues.join()
        },
        async res => {
          let logData = [];
          for (let i = 0; i < res.data.length; i++) {
            const item = res.data[i];
            if (item.type == '3' && item.recordUrl) {
              const audio = uni.createInnerAudioContext(); // wx.createInnerAudioContext
              audio.src = item.recordUrl;
              item.audio = audio;
              // common.osg.alert(JSON.stringify(item.max));
              // await new Promise((resolve, reject) => {
              //   audio.onCanplay(async () => {
              //     // if (audio.duration) {
              //     //   await this.updateItemDuration.call(this, item, audio.duration, res.data);
              //     //   resolve(item);
              //     // } else {
              //     //   audio.startTime = 0;
              //     //   this.checkDuration = setInterval(async () => {
              //     //     if (audio.duration) {
              //     //       clearInterval(this.checkDuration);
              //     //       this.updateItemDuration.call(this, item, audio.duration, res.data);
              //     //       resolve(item);
              //     //     }
              //     //   }, 100);
              //     // }
              //   });
              //   // audio.onError(res => {
              //   //   console.log('onError', res);
              //   //   common.osg.alert(JSON.stringify(res));
              //   //   resolve(item);
              //   //   clearInterval(this.checkDuration);
              //   // });
              // });

              logData.push({
                ...item,
                currentTime: '00:00',
                state: 'paused',
                value: 0
              });

              audio.onPlay(() => {
                this.log.data[this.callRecord.playingIndex].state = 'playing';
                console.log('onPlay', item);
              });

              audio.onPause(() => {
                this.log.data[this.callRecord.playingIndex].state = 'paused';
                console.log('onPause');
              });

              audio.onSeeked(() => {
                this.callRecord.seek = false;
                console.log('操作完成');
              });

              audio.onEnded(() => {
                this.log.data[this.callRecord.playingIndex].state = 'end';
                console.log('onEnded');
              });

              audio.onStop(() => {
                this.log.data[this.callRecord.playingIndex].state = 'stop';
                console.log('onStop');
              });

              audio.onTimeUpdate(() => {
                if (!this.callRecord.seek) {
                  this.callRecord.playingItem.value = Math.floor(
                    this.callRecord.playingItem.audio.currentTime
                  );
                  this.callRecord.playingItem.currentTime = this.formatCallRecordCurrentTime(
                    this.callRecord.playingItem.audio.currentTime
                  );
                }
              });

              audio.onError(res => {
                console.log('onError', res);
                // common.osg.alert(JSON.stringify(res));
                // clearInterval(this.checkDuration);
              });
            } else {
              logData.push(item);
            }
          }
          this.log.data = [...logData];

          console.log('处理后的数据:', this.log.data);
        },
        {
          noload: true
        }
      );
    },
    // 停止
    stopAudioPlayback() {
      // 页签切换时 清理音频实例和事件监听
      if (this.callRecord.playingItem?.audio) {
        // 停止音频播放
        this.callRecord.playingItem.audio.stop();
        // 清理音频实例
        // this.callRecord.audio.destroy();
        console.log('音频监听已清除，音频已停止');
      }
    },
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
        // 撤回或退回的节点继续填表单时，且暂存数据中保存的不是最新数据，则不赋值暂存数据。
        if (!(this.formData._id && !temporaryForm._id)) {
          this.formData = temporaryForm.formData;
          common.osg.toast('继续编辑', 'none');
        }
      } else if (!this.formData._id) {
        this.formData = { exts: {} };
      }

      //当前是勘查单 并且是在新增勘查单的时候 并且没有这个字段的时候 给一个默认值 否
      if (
        this.activeTab.detail.name.nodeDef.formTitle == '勘察' &&
        this.formData &&
        !this.formData.isMoldRemoved
      ) {
        this.$set(this.formData, 'isMoldRemoved', '0');
        console.log(1, this.formData);
        setTimeout(() => {
          console.log(2, this.formData);
        }, 5000);
      }
      this.openForm = true;
    },
    // 获取勘察单
    getSurveyPDFUrl() {
      return new Promise(resolve => {
        common.osg.ajax(
          'biz/extForm/query/7971040108398070730',
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
    // 获取工单上的勘查报告 -森
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
          console.log('获取工单上的勘查报告', res);
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
     * 施工验收单-服务人员
     */
    getHeadman() {
      if (common.osg.isRepeatClick('getHeadman')) {
        return;
      }
      common.osg.ajax(
        'user/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:orgId|string#and': this.orgId,
          'in:roleIds|array#and': '5424993602217461538',
          sortField: 'createTime',
          sortOrder: 'asc',
          notFilterBelongTo: '1',
          notFilterOrgId: '1'
        },
        res => {
          this.headman.data = res.data;
          if (res.data.length > 0) {
            this.headman.show = true;
          } else {
            common.osg.toast('您的服务商没有添加工队，请先在[个人中心-用户管理]添加。', 'none');
          }
        },
        {
          noload: true
        }
      );
    },
    headmanChange(e) {
      // 保存已选中工队的id
      this.$set(this.formData, 'headmanIds', e.detail);

      // 保存已选中工队的姓名
      let headmanNames = [];
      if (e.detail.length > 0) {
        this.headman.data.map(item => {
          if (e.detail.indexOf(item._id) != -1) {
            headmanNames.push(item.name);
          }
        });
      }
      this.$set(this.formData, 'headmanNames', headmanNames);

      // 合并保存工队和工人的姓名
      this.$set(
        this.formData,
        'servicerNames',
        this.formData.headmanNames.concat(this.formData.labourNames).join('、')
      );
    },
    getLabour() {
      if (common.osg.isRepeatClick('getLabour')) {
        return;
      }
      common.osg.ajax(
        'biz/labour/query',
        {
          _all: '1',
          'in:state|array-integer#and': '0,1', // 不过滤认证状态
          'is:orgId|string#and': this.orgId,
          sortField: 'createTime',
          sortOrder: 'asc',
          notFilterBelongTo: '1'
        },
        res => {
          this.labour.data = res.data;
          if (res.data.length > 0) {
            this.labour.show = true;
            this.$nextTick(() => {
              this.$forceUpdate();
            });
          } else {
            common.osg.toast('您的服务商没有添加工人，请先在[个人中心-工人管理]添加。', 'none');
          }
        },
        {
          noload: true
        }
      );
    },
    labourChange(e) {
      // 保存已选中工队的id
      this.$set(this.formData, 'labourIds', e.detail);

      // 保存已选中工队的姓名
      let labourNames = [];
      if (e.detail.length > 0) {
        this.labour.data.map(item => {
          if (e.detail.indexOf(item._id) != -1) {
            labourNames.push(item.name);
          }
        });
      }
      this.$set(this.formData, 'labourNames', labourNames);

      // 合并保存工队和工人的姓名
      this.$set(
        this.formData,
        'servicerNames',
        this.formData.headmanNames.concat(this.formData.labourNames).join('、')
      );
    },
    /**
     * 施工验收单-服务人员
     */
    getNoteItems(callback) {
      common.osg.ajax(
        'biz/extForm/queryByColName/noteItems',
        {
          _all: '1',
          sortField: 'partOrder,order',
          sortOrder: 'asc'
        },
        res => {
          if (callback) callback(res.data);
        }
      );
    },
    // 选择左侧部位
    noteItemsClickNav({ detail = {} }) {
      this.noteItemsSelect.mainActiveIndex = detail.index || 0;
    },
    // 选择右侧渗漏原因
    noteItemsClickItem({ detail = {} }) {
      let index = this.formData.noteItems.indexOf(detail.id);
      if (index == -1) {
        this.formData.noteItems.push(detail.id);
      } else {
        this.formData.noteItems.splice(index, 1);
      }
    },
    // 关闭渗漏原因弹窗
    noteItemsClose() {
      this.noteItems = {
        show: false,
        data: []
      };
    },
    /**
     * 服务过程
     */
    addPart() {
      console.log('当前服务类型', this.SAFormData.serviceType);

      // #ifdef MP-WEIXIN
      this.formData.serviceProcess = this.formData.serviceProcess || [];
      this.serviceProcess.part.show = true;
      // #endif
      // #ifdef APP-PLUS
      this.$refs.addPartPicker[0] && this.$refs.addPartPicker[0].show();
      // #endif
    },
    deletePart(i, partName) {
      common.osg.confirm(`是否确认删除部位“${partName}”？`, () => {
        this.formData.serviceProcess.splice(i, 1);
        this.md({ act: 'acceptance_deletePart', orderId: this.formData.orderId });
      });
    },
    addPartConfirm(e) {
      // #ifdef MP-WEIXIN
      const { selectedOptions } = e.detail;
      let repairParts = selectedOptions.map(item => item.value);
      this.formData.serviceProcess.push({
        repairParts,
        constructionLocation: common.osg.formatCascade('', repairParts, this.opts.parts),
        procedures: []
      });
      this.serviceProcess.part.show = false;
      // #endif
      // #ifdef APP-PLUS
      let repairParts = e.detail.value.map(item => item.value);
      this.formData.serviceProcess.push({
        repairParts,
        constructionLocation: common.osg.formatCascade('', repairParts, this.opts.parts),
        procedures: []
      });
      this.$refs.addPartPicker[0] && this.$refs.addPartPicker[0].hide();
      // #endif
    },
    getProcedureFromPlatform(e) {
      common.osg.ajax(
        'biz/procedure/queryWithRank',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'in:serviceType|array#and': this.SAFormData.serviceType,
          'regex:name|string#and': e && e.detail,
          'is:isAccepted|string#and': '1', // 只查询需要验收的工序
          'regex:exts.repairParts|string#or': JSON.stringify(
            this.formData.serviceProcess[this.serviceProcess.part.index].repairParts
          ),
          'is:exts.repairParts|string#or': '[]', // 或过滤没有部位的施工日志
          sourceType: this.SAFormData.exts.sourceType,
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.checked = false;
          });
          this.serviceProcess.procedure.data = res.data;
          this.serviceProcess.procedure.platformShow = true;
        },
        { noload: true }
      );
    },
    getConstructionLog(repairParts) {
      common.osg.ajax(
        'biz/extForm/query/9190357980804726357',
        {
          sortField: 'createTime',
          sortOrder: 'asc',
          'is:serviceAppointmentId|string#and': this.SAFormData._id,
          'all:repairParts|array#or': repairParts, // 过滤当前部位的施工日志
          'exists:repairParts|boolean#or': false, // 或过滤没有部位的施工日志
          'is:state|integer#and': 1
        },
        res => {
          res.data.map(item => {
            item.checked = false;
          });
          this.serviceProcess.procedure.data = res.data;
          this.serviceProcess.procedure.constructionLogShow = true;
        }
      );
    },
    addProcedure(index) {
      this.serviceProcess.part.index = index;
      this.serviceProcess.procedure.selectShow = true;
    },
    addProcedureSelect(e) {
      if (e.detail.value == 'platform') {
        this.getProcedureFromPlatform();
      } else if (e.detail.value == 'constructionLog') {
        this.getConstructionLog();
      }
    },
    platformClick(item) {
      item.checked = !item.checked;
    },
    platformConfirm() {
      this.serviceProcess.procedure.data.map(item => {
        if (item.checked) {
          console.log('checked', item);
          // 步骤和步骤内图片字段赋值默认值
          if (item.processStepDefinitions) {
            item.processStepDefinitions.map(step => {
              step.urls = [];
            });
          } else {
            item.processStepDefinitions = [];
          }
          // 将工序添加到当前部位
          this.formData.serviceProcess[this.serviceProcess.part.index].procedures.push({
            _id: item._id,
            content: item.content,
            desc: item.desc,
            processStepDefinitions: item.processStepDefinitions
          });
        }
      });
      this.serviceProcess.procedure.platformShow = false;
      this.md({ act: 'acceptance_addProcedureFromPlatform' });
    },
    platformCancel() {
      this.serviceProcess.procedure.platformShow = false;
    },
    constructionLogClick(item) {
      item.checked = !item.checked;
    },
    constructionLogConfirm() {
      this.serviceProcess.procedure.data.map(item => {
        // 查找已选中的施工日志
        if (item.checked) {
          let array = item.data;
          for (let i = 0; i < array.length; i++) {
            // 步骤和步骤内图片字段赋值默认值
            if (array[i].processStepDefinitions) {
              array[i].processStepDefinitions.map(step => {
                step.urls = step.urls || [];
              });
            } else {
              array[i].processStepDefinitions = [];
            }
            // 查找相同的工序
            let sameProcedure = this.formData.serviceProcess[
              this.serviceProcess.part.index
            ].procedures.find(item => item._id == array[i]._id);
            // 1.存在相同的工序，将工序步骤图片合并到现有工序步骤，不再插入新工序
            if (sameProcedure) {
              sameProcedure.processStepDefinitions.map((step, index) => {
                step.urls = step.urls.concat(array[i].processStepDefinitions[index].urls);
              });
            } else {
              // 2.不存在相同工序，将工序插入到当前部位
              this.formData.serviceProcess[this.serviceProcess.part.index].procedures.push(
                array[i]
              );
            }
          }
        }
      });
      this.serviceProcess.procedure.constructionLogShow = false;
      this.md({ act: 'acceptance_addProcedureFromConstructionLog' });
    },
    constructionLogCancel() {
      this.serviceProcess.procedure.constructionLogShow = false;
    },
    deleteProcedure(procedure, partIndex, procedureIndex) {
      let deletable = false;
      if (procedure.processStepDefinitions && procedure.processStepDefinitions.length > 0) {
        // 判断工序中是否包含必填的工序步骤
        let required = procedure.processStepDefinitions.find(
          item => item.operationIds.indexOf(this.serviceProcess.operationId) != -1
        );
        if (required) {
          // 当前工序有必填项，在整个服务过程中至少保留1个相同_id的工序
          // 判断服务过程中是否还有相同_id的工序
          let count = 0;
          for (let i = 0; i < this.formData.serviceProcess.length; i++) {
            let part = this.formData.serviceProcess[i];
            for (let j = 0; j < part.procedures.length; j++) {
              let p = part.procedures[j];
              if (p._id == procedure._id) {
                count++;
              }
            }
          }
          if (count > 1) {
            // 有重复工序，允许删除
            deletable = true;
          } else {
            common.osg.alert('当前工序包含必填步骤，且服务过程中没有重复工序，不允许删除！');
            return;
          }
        } else {
          // 当前工序没有必填项允许删除工序
          deletable = true;
        }
      } else {
        deletable = true;
      }
      if (deletable) {
        common.osg.confirm(`是否确认删除工序“${procedure.content}”？`, () => {
          this.formData.serviceProcess[partIndex].procedures.splice(procedureIndex, 1);
          this.md({ act: 'acceptance_deleteProcedure', orderId: this.formData.orderId });
        });
      }
    },
    afterReadForStep(e, step) {
      if (step.max && step.max < step.urls.length + 1) {
        common.osg.alert('只能上传' + step.max + '张！');
        return;
      }
      let { file } = e.detail;
      for (let item of file) {
        common.osg.ajax(
          'back/super/file/upToken.do',
          {
            fileName: item.url.split('/')[item.url.split('/').length - 1]
          },
          data => {
            let that = this;
            wx.uploadFile({
              url: 'https://up-z1.qiniup.com',
              filePath: item.url,
              name: 'file',
              formData: data,
              success(res) {
                step.urls.push({
                  url: common.osg.downloadUrl + JSON.parse(res.data).key + '!convert.jpg'
                });
                that.$forceUpdate();
              },
              fail() {
                common.osg.toast('上传失败', 'error');
              }
            });
          },
          {
            noload: true
          }
        );
      }
    },
    deleteFileForStep(e, step) {
      // #ifdef MP-WEIXIN
      step.urls.splice(e.detail.index, 1);
      // #endif
      // #ifdef APP-PLUS
      step.urls.splice(e.index, 1);
      // #endif
    },
    getMyOperation() {
      common.osg.ajax('/basic/operation/currentOperation', {}, res => {
        this.serviceProcess.operationId = res.data._id;
      });
    },
    procedureDescClick(content, desc) {
      common.osg.alert(desc, null, content);
    },
    getNodeFormData(formDefId, formDataId, callback) {
      common.osg.ajax(
        'biz/extForm/findByIdWithWorkflow',
        {
          extId: formDefId,
          id: formDataId
        },
        res => {
          if (callback) callback(res.data.data);
        },
        {
          noload: true
        }
      );
    },
    viewAcceptance(item) {
      this.saveFile(null, item.acceptanceUrl);
      this.md({ act: 'acceptance_preview', type: item.signImageUrl ? '查看' : '预览' });
    },
    copyAcceptance(url) {
      this.copy(url);
    },
    sortChange(list, i) {
      let newList = list.map(item => (item = item.content));
      this.serviceProcess.sortData[i] = newList;
    },
    sortStart() {
      this.serviceProcess.sort = true;
      this.serviceProcess.sortData = {};
    },
    sortConfirm() {
      this.serviceProcess.sort = false;
      let serviceProcess = common.osg.deepCopy(this.formData.serviceProcess);
      for (let key in this.serviceProcess.sortData) {
        serviceProcess[key].procedures = this.serviceProcess.sortData[key];
      }
      this.formData.serviceProcess = serviceProcess;
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
    //区分 刷新部位反显 和防水的部位反显
    newCodelabel(part) {
      const { serviceType } = this.SAFormData;
      const partsList = serviceType === '40' ? this.opts.refreshParts : this.opts.parts;
      return this.codelabel('cascade', null, part, partsList);
    },
    recordsAfterRead(event) {
      if (!this.records.formData.mediaContent) {
        this.records.formData.mediaContent = [];
      }
      const { file } = event.detail;
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      if (!Array.isArray(file)) {
        let item = file;
        common.osg.ajax(
          'back/super/file/upToken.do',
          {
            fileName: item.url.split('/')[item.url.split('/').length - 1]
          },
          data => {
            let that = this;
            common.osg.loading();
            wx.uploadFile({
              url: 'https://up-z1.qiniup.com',
              filePath: item.url,
              name: 'file',
              formData: data,
              success(res) {
                let currentFileType = item.fileType || item.type;
                console.log('currentFileType', currentFileType);
                that.records.formData.mediaContent.push({
                  url:
                    common.osg.downloadUrl +
                    JSON.parse(res.data).key +
                    (currentFileType == 'image' ? '!convert.jpg' : '')
                });
                console.log(
                  'that.records.formData.mediaContent',
                  that.records.formData.mediaContent
                );
                that.$forceUpdate();
                common.osg.unload();
              },
              fail() {
                common.osg.unload();
                common.osg.toast('上传失败', 'error');
              }
            });
          },
          {
            noload: true
          }
        );
      } else {
        for (let item of file) {
          common.osg.ajax(
            'back/super/file/upToken.do',
            {
              fileName: item.url.split('/')[item.url.split('/').length - 1]
            },
            data => {
              let that = this;
              common.osg.loading();
              wx.uploadFile({
                url: 'https://up-z1.qiniup.com',
                filePath: item.url,
                name: 'file',
                formData: data,
                success(res) {
                  let currentFileType = item.fileType || item.type;
                  console.log('currentFileType', currentFileType);
                  that.records.formData.mediaContent.push({
                    url:
                      common.osg.downloadUrl +
                      JSON.parse(res.data).key +
                      (currentFileType == 'image' ? '!convert.jpg' : '')
                  });
                  console.log(
                    'that.records.formData.mediaContent',
                    that.records.formData.mediaContent
                  );
                  that.$forceUpdate();
                  common.osg.unload();
                },
                fail() {
                  common.osg.unload();
                  common.osg.toast('上传失败', 'error');
                }
              });
            },
            {
              noload: true
            }
          );
        }
      }
    },
    recordsDeleteFile(event) {
      let index = event.detail.index;
      this.records.formData.mediaContent.splice(index, 1);
      this.$forceUpdate();
    }
  }
};
</script>
<style>
.serviceAppointment .van-cell__title {
  width: 130px !important;
  max-width: 130px !important;
  min-width: 130px !important;
  margin-right: 5px !important;
  flex: none !important;
}

.serviceAppointment .van-cell__value {
  text-align: left !important;
}

.serviceAppointment .van-cell__value .van-field__control {
  text-align: left;
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
.richText {
  height: 60vh;
  overflow-y: auto;
  padding: 30rpx;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  text-align: justify;
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
.serviceAppointment .leakageCause-dialog {
  max-height: 80vh !important;
  top: 50% !important;
  display: flex;
  flex-direction: column;
}

/* 注意事项弹窗 */
.serviceAppointment .noteItems-dialog {
  max-height: 80vh !important;
  top: 50% !important;
  display: flex;
  flex-direction: column;
}

.tki-qrcode {
  margin-bottom: 8px;
}

/* .serviceAppointment .c-progress {
  margin: 15px 0 0;
}
.serviceAppointment .c-progress .van-progress__portion {
  width: 0%;
  transition: width 2s;
} */

/* 设置进度条容器的宽度和外观 */
.serviceAppointment .progress-container {
  width: 100%;
  background-color: #ebedf0;
  border-radius: 20px;
  margin: 15px 0 0;
}
/* 设置进度条的样式 */
.serviceAppointment .progress-bar {
  height: 15rpx;
  background-color: #1989fa;
  border-radius: 20px;
  position: relative;
  transition: width 1s ease-in-out;
}
.serviceAppointment .progress-marker {
  min-width: 3.6em;
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 10px;
  padding: 0 5px;
  color: #fff;
  font-size: 10px;
  line-height: 1.6;
  text-align: center;
  background-color: #1989fa;
  border-radius: 1em;
  transform: translate(0, -50%);
}
.serviceAppointment .van-field__label {
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
.serviceAppointment {
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
    // .audio-slider {
    //   flex: 1;
    //   margin-left: 20px;
    //   margin-right: 30px;
    //   .slider-button {
    //     background-color: #106cff;
    //     color: #fff;
    //     border-radius: 20px;
    //     padding: 0 6px;
    //     min-width: 55px;
    //     text-align: center;
    //     box-sizing: border-box;
    //   }
    // }

    .audio-slider {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end; /* 将内容对齐到底部 */
      .audio-time-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        position: absolute;
        bottom: -12px;
        padding: 0px 18px;
        box-sizing: border-box;
      }

      .audio-current-time,
      .audio-end-time {
        font-size: 14px;
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
  .serviceProcess-part {
    border: 1px solid #969799;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 16px;
  }
  .serviceProcess-procedure {
    border: 1px solid #c8c9cc;
    border-radius: 10px;
    padding: 10px;
    margin: 16px;
  }
  .van-uploader__upload-text {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
// 客户签字相关模块样式
// .canvasModuleData {
//   width: 100vw;
//   height: 100vh;
//   display: flex;
//   position: relative;
//   overflow: hidden;
//   .firstCanvas {
//     background-color: #fff;
//     width: calc(100vw - 70px);
//     height: 100vh;
//   }
//   .canvas_btnBox {
//     height: 100vh;
//     width: 70px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: space-evenly;
//     background-color: #ebf3f2;
//   }
//   .canvas_btnBox view {
//     width: 70%;
//     height: 40%;
//     display: flex;
//     border-radius: 5px;
//     align-items: center;
//     justify-content: center;
//     font-weight: 500;
//   }
//   .canvas_btn1 {
//     color: black;
//     background-color: var(--button-plain-background-color, #fff);
//   }

//   .canvas_btn2 {
//     color: #fff;
//     background-color: var(--button-info-background-color, #1989fa);
//   }
//   .Landscape {
//     position: absolute;
//     left: 60%;
//     top: 50%;
//     transform: translate(-50%, -50%) rotate(90deg);
//     white-space: nowrap;
//     color: #ccc;
//   }
//   .Exitsignature {
//     position: absolute;
//     transform: rotate(90deg);
//     white-space: nowrap;
//     right: 0%;
//     bottom: 5%;
//     z-index: 999;
//     color: red;
//     // width: fit-content; //宽度自适应文本
//   }
// }
// //签字加载提示 状态 旋转90度
// .c-loading {
//   transform: rotate(90deg);
// }
.canvasModuleData {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: #808080;
  // 设置按钮盒子和文本提醒的固定宽度
  .canvas_btnBox {
    width: 70px; // 设置固定宽度
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  .textReminder {
    width: 70px; // 设置固定宽度
    height: 100%;
    display: flex;
    view {
      width: 50%;
      height: 100%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      //   transform: rotate(90deg);
    }
  }

  .firstCanvas,
  .CanvasBox {
    // 画布应填充剩余宽度
    flex-grow: 1; // 允许画布增长，填充剩余空间
    height: 90%;
    background-color: #efefef;
  }

  .canvas_btnBox view {
    // 这两个容器内部内容的统一样式
    width: 70%; // 完全占据容器的宽度
    height: 15%; // 按钮盒子中每个按钮的高度
    display: flex;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color: #fff;
  }

  .canvas_btn1 {
    background-color: var(--button-plain-background-color, #f09e38);
  }

  .canvas_btn2 {
    background-color: var(--button-info-background-color, #ad2e33);
  }

  .Landscape {
    font-size: 260rpx;
    font-weight: 500;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%) rotate(90deg);
    transform: translate(-50%, -50%) rotate(90deg);
    display: flex;
    color: #fff;
    width: 100vh;
    justify-content: space-evenly;

    .line {
      width: 1px;
      background-color: #ccc;
    }
  }
}
.Exitsignature {
  position: absolute;
  transform: rotate(90deg);
  white-space: nowrap;
  right: 0%;
  bottom: 5%;
  z-index: 999;
  color: red;
  // width: fit-content; //宽度自适应文本
}
// 签字加载提示 状态 旋转90度
.c-loading {
  transform: rotate(90deg);
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

.customer_profile {
  height: 50px;
  align-items: center;
  justify-content: space-between;
  .profile {
    display: flex;
    align-items: center;
  }
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
