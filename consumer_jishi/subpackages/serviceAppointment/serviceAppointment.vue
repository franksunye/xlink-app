<template>
  <view>
    <van-empty v-if="list.length == 0" description="暂无订单" />
    <block v-else>
      <view class="content">
        <view class="title">
          <view>
            <view>单号：{{ data.orderNum }}</view>
            <view v-if="data.address">地址：{{ data.address }}</view>
          </view>
          <van-button
            v-if="data.exts.moKanNum && Number(data.status) > 103 && Number(data.status) < 403"
            size="small"
            icon="video-o"
            @click="toMoKanDetail(data)"
          >
            查看监控
          </van-button>
        </view>
        <view class="c-flex" style="margin: 0 0 1vw">
          <van-button
            icon="chat-o"
            class="c-flex-1"
            type="default"
            size="small"
            block
            @click="chatEntry(data)"
          >
            门店客服
          </van-button>
          <block v-if="data.exts.supervisorId">
            <van-button
              v-if="data.exts.supervisorPhone == '9999'"
              icon="phone-o"
              class="c-flex-1"
              type="default"
              size="small"
              block
              @click="call('2', null, data.exts.supervisorId, data._id)"
            >
              联系管家
            </van-button>
            <van-button
              v-else-if="data.exts.supervisorPhone"
              icon="phone-o"
              class="c-flex-1"
              type="default"
              size="small"
              block
              @click="makeCall(data.exts.supervisorPhone)"
            >
              联系管家
            </van-button>
          </block>
          <block v-if="data.exts.headmanId">
            <van-button
              v-if="data.exts.headmanPhone == '9999'"
              icon="phone-o"
              class="c-flex-1"
              type="default"
              size="small"
              block
              @click="call('6', null, data.exts.headmanId, data._id)"
            >
              联系工队
            </van-button>
            <van-button
              v-else-if="data.exts.headmanPhone"
              icon="phone-o"
              class="c-flex-1"
              type="default"
              size="small"
              block
              @click="makeCall(data.exts.headmanPhone)"
            >
              联系工队
            </van-button>
          </block>
        </view>
        <view class="middle" v-if="activeNode._id">
          <view class="sidebar">
            <block v-for="(node, i) in data.workflowNodeList" :key="i">
              <!-- 不展示第一个虚拟节点 nodeId=0 -->
              <block v-if="i != 0">
                <!-- 不展示分单、派单、节点节点 -->
                <block
                  v-if="
                    node.nodeDef.nodeType != 'auto' &&
                    node.nodeDef.nodeType != 'allot' &&
                    node.nodeDef.nodeType != 'dispatch' &&
                    node.nodeDef.nodeType != 'accept'
                  "
                >
                  <view
                    :class="activeNode._id == node._id ? 'sidebar-item-active' : 'sidebar-item'"
                    @click="nodeClick(node)"
                  >
                    <view
                      :class="
                        node.nodeDef.name &&
                        node.nodeDef.name.indexOf('评价') != -1 &&
                        !node.formDataId
                          ? 'notice'
                          : ''
                      "
                    >
                      {{ node.nodeDef.nodeType == 'placeOrder' ? '订单' : node.nodeDef.name || '' }}
                    </view>
                  </view>
                </block>
              </block>
            </block>
          </view>
          <view class="main">
            <!-- 订单列表 -->
            <block v-if="activeNode.nodeDef.nodeType == 'placeOrder'">
              <view class="card-group">
                <view class="card" v-for="(item, i) in orders.fpi.data" :key="i">
                  <view class="card-header">
                    <text class="card-title">单号：{{ item._id }}</text>
                    <text class="c-yellow">{{ codelabel('payState', item.payState) }}</text>
                  </view>
                  <view class="card-content">
                    <view>
                      <text>下单时间：</text>
                      <text>{{ item.createTime }}</text>
                    </view>
                    <view>
                      <text>产品总额：</text>
                      <text class="c-red c-m-l-20">¥ {{ item.originPrice }}</text>
                    </view>
                    <view v-if="item.discount != 1">
                      <text>折扣金额：</text>
                      <text class="c-red">
                        -¥&nbsp;{{
                          (
                            item.originPrice - (item.originPrice * item.discount).toFixed(2)
                          ).toFixed(2)
                        }}
                      </text>
                    </view>
                    <view v-if="item.preferentialAmount">
                      <text>优惠金额：</text>
                      <text class="c-red">-¥ {{ item.preferentialAmount }}</text>
                    </view>
                    <view v-if="item.discount != 1 || item.preferentialAmount">
                      <text>实际金额：</text>
                      <text class="c-red c-m-l-20">¥ {{ item.totalPrice }}</text>
                    </view>
                  </view>
                  <view style="display: flex; justify-content: space-between; margin: 10px 10px 0">
                    <view>
                      <van-button plain round type="info" size="small" @click="doOpen(item._id)">
                        查看订单
                      </van-button>
                    </view>
                    <view>
                      <van-button
                        plain
                        round
                        size="small"
                        @click="download"
                        :data-filename="item.exts.bjdPDFurl"
                        v-if="item.exts && item.exts.bjdPDFurl"
                      >
                        查看报价单
                      </van-button>
                      <van-button
                        plain
                        round
                        size="small"
                        @click="download"
                        :data-filename="item.qiniuList[item.qiniuList.length - 1]"
                        v-if="item.qiniuList && item.qiniuList.length > 0"
                      >
                        查看合同
                      </van-button>
                      <van-button
                        plain
                        round
                        size="small"
                        @click="download"
                        :data-filename="
                          'https://pub.fsgo365.cn/' + item.warrantyUrl[item.warrantyUrl.length - 1]
                        "
                        v-if="item.warrantyUrl && item.warrantyUrl.length > 0"
                      >
                        查看质保
                      </van-button>
                    </view>
                  </view>
                </view>
              </view>
            </block>
            <!-- 工作流列表 -->
            <block v-else-if="activeNode.nodeDef.nodeType == 'subflows'">
              <view class="card-group">
                <view class="card" v-for="(item, i) in subflows" :key="i">
                  <view class="card-header">
                    <text class="card-title">{{ item.title }}</text>
                  </view>
                  <view class="card-content">
                    <view>
                      <text>创建时间：</text>
                      <text>{{ item.createTime }}</text>
                    </view>
                  </view>
                  <view class="card-footer">
                    <view></view>
                    <view>
                      <van-button
                        plain
                        round
                        type="info"
                        size="small"
                        @click="getWorkflow(item.defId, item._id)"
                      >
                        查看流程
                      </van-button>
                    </view>
                  </view>
                </view>
              </view>
            </block>
            <!-- 关联多个不同表单 -->
            <block v-else-if="activeNode.nodeDef.nodeType == 'forms'">
              <view class="card-group">
                <view class="card" v-for="(item, i) in activeNode.exts.formList" :key="i">
                  <view class="card-header">
                    <text class="card-title">{{ item.formTitle }}</text>
                  </view>
                  <view class="card-content">
                    <view>
                      <text>创建时间：</text>
                      <text>{{ item.createTime }}</text>
                    </view>
                  </view>
                  <view class="card-footer">
                    <view></view>
                    <view>
                      <van-button
                        plain
                        round
                        type="info"
                        size="small"
                        @click="viewForm({ formDefId: item.formDefId, formData: item, show: true })"
                      >
                        查看表单
                      </van-button>
                    </view>
                  </view>
                </view>
              </view>
            </block>
            <!-- 关联表单 -->
            <block
              v-else-if="
                activeNode.nodeDef.formDefId &&
                !activeNode.formDataId &&
                activeNode.nodeDef.name &&
                activeNode.nodeDef.name.indexOf('评价') != -1
              "
            >
              <van-cell-group class="c-popup-cells">
                <block v-for="(field, index) in fields" :key="index">
                  <block v-if="!field.frontEndConfig.mpDetailHide && field.state == '1'">
                    <block v-if="field.type == 'phone' || field.type == 'IDNumber'">
                      <van-field
                        :label="field.nameDisp"
                        :value="formData[field.name]"
                        @change="onChange"
                        :data-field="field"
                        type="number"
                        :maxlength="field.type == 'phone' ? 11 : -1"
                        :disabled="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? true
                            : false
                        "
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                        input-align="right"
                      ></van-field>
                    </block>
                    <block v-else-if="field.type == 'switch'">
                      <van-cell
                        :title="field.nameDisp"
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled c-cell-switch'
                            : 'c-cell-switch'
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                      >
                        <van-switch
                          :checked="formData[field.name]"
                          @change="onChange"
                          :data-field="field"
                          active-value="1"
                          inactive-value="0"
                          :size="field.frontEndConfig.size || '24px'"
                          :disabled="
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                          "
                        ></van-switch>
                      </van-cell>
                    </block>
                    <block
                      v-else-if="
                        field.type == 'date' || field.type == 'time' || field.type == 'datetime'
                      "
                    >
                      <van-cell
                        v-if="
                          field.frontEndConfig && field.frontEndConfig.showField
                            ? formData[field.frontEndConfig.showField] ==
                              field.frontEndConfig.showValue
                            : true
                        "
                        :title="field.nameDisp"
                        :value="formData[field.name]"
                        @click="onClick"
                        :data-field="field"
                        :is-link="activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1"
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                      ></van-cell>
                    </block>
                    <block v-else-if="field.type == 'select'">
                      <!-- 根据其他字段值展示，如“不需要上门原因” -->
                      <block
                        v-if="
                          field.frontEndConfig && field.frontEndConfig.showField
                            ? formData[field.frontEndConfig.showField] ==
                              field.frontEndConfig.showValue
                            : true
                        "
                      >
                        <van-cell
                          :title="field.nameDisp"
                          :value="
                            commonEvent('codelabel', null, {
                              option: field.name == 'workType' ? 'workTypes' : field.valueOption,
                              value: formData[field.name]
                            })
                          "
                          @click="onClick"
                          :data-field="field"
                          :is-link="
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                          "
                          :class="
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                              ? 'c-disabled'
                              : ''
                          "
                          :required="
                            field.required == '1' &&
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                          "
                        ></van-cell>
                      </block>
                    </block>
                    <block v-else-if="field.type == 'cascade'">
                      <van-cell
                        v-if="
                          field.frontEndConfig && field.frontEndConfig.showField
                            ? formData[field.frontEndConfig.showField] ==
                              field.frontEndConfig.showValue
                            : true
                        "
                        :title="field.nameDisp"
                        :value="
                          codelabel(
                            'cascade',
                            field.valueOption,
                            formData[field.name],
                            null,
                            field.frontEndConfig
                          )
                        "
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                      ></van-cell>
                    </block>
                    <block v-else-if="field.type == 'bizSelect'">
                      <van-cell
                        :title="field.nameDisp"
                        :value="
                          commonEvent('codelabel', null, {
                            option: field.name,
                            value: formData[field.name]
                          })
                        "
                        @click="onClick"
                        :data-field="field"
                        :is-link="activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1"
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                      ></van-cell>
                    </block>
                    <block v-else-if="field.type == 'radio'">
                      <van-cell
                        v-if="
                          field.frontEndConfig && field.frontEndConfig.showField
                            ? formData[field.frontEndConfig.showField] ==
                              field.frontEndConfig.showValue
                            : true
                        "
                        :title="field.nameDisp"
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                      >
                        <van-radio-group
                          :value="formData[field.name]"
                          @change="onChange"
                          :data-field="field"
                          class="c-cell-radio-group c-rt"
                          :disabled="
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                          "
                        >
                          <van-radio
                            v-for="(item, i) in options[field.valueOption]"
                            :key="i"
                            :name="item.value"
                          >
                            {{ item.name }}
                          </van-radio>
                        </van-radio-group>
                      </van-cell>
                    </block>
                    <block v-else-if="field.type == 'checkbox'">
                      <van-cell
                        v-if="
                          field.frontEndConfig && field.frontEndConfig.showField
                            ? formData[field.frontEndConfig.showField] ==
                              field.frontEndConfig.showValue
                            : true
                        "
                        :title="field.nameDisp"
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                      >
                        <van-checkbox-group
                          :value="formData[field.name]"
                          @change="onChange"
                          :data-field="field"
                          class="c-cell-checkbox-group"
                          :disabled="
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                          "
                        >
                          <van-checkbox
                            v-for="(item, i) in options[field.valueOption]"
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
                    <block v-else-if="field.type == 'rate'">
                      <van-cell
                        v-if="
                          field.frontEndConfig && field.frontEndConfig.showField
                            ? formData[field.frontEndConfig.showField] ==
                              field.frontEndConfig.showValue
                            : true
                        "
                        :title="field.nameDisp"
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                      >
                        <van-rate
                          :value="formData[field.name]"
                          @change="onChange"
                          :data-field="field"
                          :disabled="
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                          "
                        ></van-rate>
                      </van-cell>
                    </block>
                    <block v-else-if="field.type == 'file'">
                      <block
                        v-if="
                          field.frontEndConfig && field.frontEndConfig.showField
                            ? formData[field.frontEndConfig.showField] ==
                              field.frontEndConfig.showValue
                            : true
                        "
                      >
                        <view class="c-cell-view c-flex c-flex-between c-relative">
                          <view
                            :class="
                              activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                                ? 'c-disable c-cell_title c-size-14'
                                : 'c-cell_title c-size-14'
                            "
                          >
                            <span
                              class="c-required"
                              v-if="
                                field.required == '1' &&
                                activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                              "
                            >
                              *
                            </span>
                            {{ field.nameDisp }}
                          </view>
                          <view class="c-cell_value">
                            ({{ (formData[field.name] && formData[field.name].length) || 0 }} /
                            {{ field.frontEndConfig.max || '不限' }})
                          </view>
                        </view>
                        <view class="c-cell-view">
                          <view v-if="field.frontEndConfig.fileType == 'video'" class="c-flex">
                            <video
                              v-for="(item, i) in formData[field.name]"
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
                            :accept="field.frontEndConfig.fileType || 'image'"
                            :upload-text="
                              field.frontEndConfig ? field.frontEndConfig.uploadText : ''
                            "
                            :file-list="formData[field.name]"
                            @afterread="afterRead"
                            :data-field="field"
                            @delete="deleteFile"
                            :max-count="
                              field.frontEndConfig.max || field.frontEndConfig.max == 0
                                ? field.frontEndConfig.max
                                : 20
                            "
                            :disabled="
                              activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            "
                          />
                        </view>
                      </block>
                    </block>
                    <block v-else-if="field.type == 'title'">
                      <view
                        class="c-cell-headline"
                        v-html="
                          (field.frontEndConfig && field.frontEndConfig.html) || field.nameDisp
                        "
                      ></view>
                    </block>
                    <block v-else-if="field.type == 'gap'">
                      <view
                        class="c-cell-gap"
                        v-html="field.frontEndConfig && field.frontEndConfig.html"
                      ></view>
                    </block>
                    <block v-else-if="field.type == 'area'">
                      <van-cell
                        :title="field.nameDisp"
                        :value="
                          area.areaList.province_list[formData[field.name][0]] +
                          area.areaList.city_list[formData[field.name][1]] +
                          area.areaList.county_list[formData[field.name][2]]
                        "
                        @click="onClick"
                        :data-field="field"
                        :is-link="activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1"
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                      />
                    </block>
                    <block v-else-if="field.type == 'button'">
                      <van-button
                        @click="commonEvent('button', null, { field })"
                        :data-type="field.type"
                        :data-name="field.name"
                        :data-fec="field.frontEndConfig"
                        :type="field.frontEndConfig.type"
                        :color="field.frontEndConfig.color"
                        :block="field.frontEndConfig.type"
                        :round="field.frontEndConfig.round"
                        :plain="field.frontEndConfig.plain"
                        :disabled="activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1"
                      >
                        {{ field.nameDisp }}
                      </van-button>
                    </block>
                    <block v-else-if="field.type == 'scan'">
                      <view
                        class="c-flex c-flex c-flex-between c-item-center c-bg-white c-cell-view"
                      >
                        <view class="c-cell_title">
                          <text class="c-required" v-if="field.required == '1'">*</text>
                          {{ field.nameDisp }}
                        </view>
                        <van-button
                          :plain="field.frontEndConfig.plain"
                          :type="field.frontEndConfig.type"
                          :color="field.frontEndConfig.color"
                          :icon="field.frontEndConfig.icon"
                          :size="field.frontEndConfig.size || 'small'"
                          @click="commonEvent('scan', field.name, field.frontEndConfig)"
                          :disabled="
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                          "
                        >
                          {{ field.frontEndConfig.buttonName }}
                        </van-button>
                      </view>
                    </block>
                    <block v-else-if="field.type == 'addItem'">
                      <view class="c-cell-view c-flex c-flex-between">
                        <view>
                          <text class="c-required" v-if="field.required == '1'">*</text>
                          {{ field.nameDisp }}
                        </view>
                        <van-button
                          @click="commonEvent('addItem', field.name, field.frontEndConfig)"
                          :plain="field.frontEndConfig.plain"
                          :type="field.frontEndConfig.type"
                          :color="field.frontEndConfig.color"
                          :icon="field.frontEndConfig.icon"
                          :size="field.frontEndConfig.size || 'small'"
                          :disabled="
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                          "
                        >
                          {{ field.frontEndConfig.buttonName }}
                        </van-button>
                      </view>
                      <view class="c-cell-view" style="border-bottom: 1px solid #ebedf0">
                        <block v-for="(item, i) in formData[field.name]" :key="i">
                          <van-tag
                            @close="tagClose(field.name, i)"
                            round
                            type="info"
                            size="large"
                            custom-class="c-m-10"
                            :closeable="
                              activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                            "
                          >
                            {{
                              commonEvent('codelabel', null, {
                                option: field.valueOption,
                                value: item
                              })
                            }}
                          </van-tag>
                        </block>
                      </view>
                    </block>
                    <block v-else-if="field.type == 'pushItem'">
                      <van-cell-group>
                        <van-field
                          :label="field.nameDisp"
                          :value="formData[field.name]"
                          @change="onChange"
                          :data-field="field"
                          :type="field.type"
                          :disabled="
                            activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                          "
                          :required="field.required == '1'"
                          center
                          clearable
                          :border="false"
                          use-button-slot
                        >
                          <van-button
                            @click="commonEvent('pushItem', field.name, field.frontEndConfig)"
                            slot="button"
                            :plain="field.frontEndConfig.plain"
                            :type="field.frontEndConfig.type"
                            :color="field.frontEndConfig.color"
                            :icon="field.frontEndConfig.icon"
                            :size="field.frontEndConfig.size || 'small'"
                            :disabled="
                              activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            "
                          >
                            {{ field.frontEndConfig.buttonName }}
                          </van-button>
                        </van-field>
                      </van-cell-group>
                    </block>
                    <block v-else-if="field.type == 'bgImage'"></block>
                    <!-- 按类别展示 -->
                    <block v-else-if="field.type == 'sort'">
                      <view v-if="field.frontEndConfig.showName">{{ field.name }}</view>
                      <van-cell-group :border="false">
                        <view
                          v-for="(item, key) in formData[field.name]"
                          :key="key"
                          class="c-cell-view c-flex c-flex-between"
                          style="padding: 10px 25px"
                        >
                          <view>
                            {{
                              commonEvent('codelabel', null, {
                                option: field.option,
                                value: key
                              })
                            }}
                          </view>
                          <view>
                            <text>{{ item.length }}</text>
                            <text>{{ field.frontEndConfig.unit }}</text>
                          </view>
                        </view>
                      </van-cell-group>
                    </block>
                    <block v-else-if="field.type == 'evaluate'">
                      <van-field
                        :label="field.nameDisp"
                        :value="formData[field.name]"
                        @change="onChange"
                        :data-field="field"
                        type="digit"
                        :disabled="activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1"
                        :required="field.required == '1'"
                        input-align="right"
                      ></van-field>
                    </block>
                    <block v-else-if="field.type == 'dialog'">
                      <view
                        class="c-cell-view c-flex"
                        :data-field="field"
                        :type="field.type"
                        @click="onClick"
                      >
                        <van-icon
                          custom-class="c-green"
                          name="checked"
                          v-if="formData[field.name]"
                        />
                        <rich-text :nodes="field.frontEndConfig.text"></rich-text>
                      </view>
                    </block>
                    <!-- 签字 -->
                    <block v-else-if="field.type == 'canvas'">
                      <view class="canvas-view">
                        <view class="canvas-title" style="background-color: #f7f8fa">
                          {{ field.nameDisp }}
                        </view>
                        <img
                          v-if="formData._id && formData[field.name]"
                          :src="formData[field.name]"
                          :style="'width: 100%;height:' + canvas[field.name].height + 'px'"
                        />
                        <canvas
                          v-show="!formData._id || !formData[field.name]"
                          class="canvas"
                          :canvas-id="field.name + 'Canvas'"
                          @touchstart="start($event, field)"
                          @touchmove="move($event, field)"
                          @touchend="end($event, field)"
                          @touchcancel="cancel($event, field)"
                          @longtap="tap($event, field)"
                          @error="error"
                          :disable-scroll="true"
                          :style="'width:100%;height:' + canvas[field.name].height + 'px'"
                        ></canvas>
                        <view class="canvas-btns" v-if="!formData._id || !currentNode.state">
                          <van-button
                            plain
                            type="default"
                            size="small"
                            @click="canvasClear(field)"
                            class="canvas-btn"
                          >
                            清除
                          </van-button>
                          <van-button
                            plain
                            type="default"
                            size="small"
                            @click="canvasSave(extField)"
                            class="canvas-btn"
                          >
                            保存
                          </van-button>
                        </view>
                      </view>
                    </block>
                    <!-- 原生类型 text number idcard digit textarea 自定义计算类型evaluate-->
                    <block v-else>
                      <van-field
                        v-if="
                          field.frontEndConfig && field.frontEndConfig.showField
                            ? formData[field.frontEndConfig.showField] ==
                              field.frontEndConfig.showValue
                            : true
                        "
                        :label="field.nameDisp"
                        :value="formData[field.name]"
                        @change="onChange"
                        :data-field="field"
                        :type="field.type"
                        placeholder="请输入"
                        :autosize="field.type == 'textarea' ? true : false"
                        :disabled="activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1"
                        :class="
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        :required="
                          field.required == '1' &&
                          activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
                        "
                        input-align="right"
                      ></van-field>
                    </block>
                  </block>
                </block>
              </van-cell-group>
            </block>
            <!-- 关联表单 -->
            <block v-else-if="activeNode.nodeDef.formDefId">
              <block v-for="(field, index) in fields" :key="index">
                <!-- 不展示隐藏字段 -->
                <block
                  v-if="!field.frontEndConfig.mpDetailHide && !field.frontEndConfig.cmpDetailHide"
                >
                  <!-- TODO:根据其他字段值展示 -->
                  <block
                    v-if="
                      field.frontEndConfig.showField
                        ? field.frontEndConfig.showValue == formData[field.frontEndConfig.showField]
                        : true
                    "
                  >
                    <!--  -->
                    <block v-if="!(field.type == 'button' && field.frontEndConfig.func)">
                      <van-cell-group>
                        <!-- 下拉 -->
                        <block v-if="field.type == 'select' && field.frontEndConfig.multiple">
                          <!-- 多选 -->
                          <block v-if="field.frontEndConfig.multiple">
                            <van-cell :title="field.nameDisp" :value="format(field)" />
                          </block>
                          <!-- 单选 -->
                          <block v-else>
                            <van-cell :title="field.nameDisp" :value="format(field)" />
                          </block>
                        </block>
                        <!-- 级联 -->
                        <block v-else-if="field.type == 'cascade' && field.frontEndConfig.multiple">
                          <!-- 多选 -->
                          <block v-if="field.frontEndConfig.multiple">
                            <van-cell :title="field.nameDisp" :value="format(field)" />
                          </block>
                          <!-- 单选 -->
                          <block v-else>
                            <van-cell :title="field.nameDisp" :value="format(field)" />
                          </block>
                        </block>
                        <!-- 单选 -->
                        <block v-else-if="field.type == 'radio'">
                          <van-cell :title="field.nameDisp">
                            <van-radio-group
                              :value="formData[field.name]"
                              disabled
                              class="c-cell-radio-group"
                            >
                              <van-radio
                                v-for="(item, i) in options[field.valueOption]"
                                :key="i"
                                :name="item.value"
                              >
                                {{ item.name }}
                              </van-radio>
                            </van-radio-group>
                          </van-cell>
                        </block>
                        <!-- 多选 -->
                        <block v-else-if="field.type == 'checkbox'">
                          <van-cell :title="field.nameDisp">
                            <van-checkbox-group
                              :value="formData[field.name]"
                              disabled
                              class="c-cell-checkbox-group"
                            >
                              <van-checkbox
                                v-for="(item, i) in options[field.valueOption]"
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
                        <!-- 开关 -->
                        <block v-else-if="field.type == 'switch'">
                          <van-cell :title="field.nameDisp" class="c-cell-switch">
                            <van-switch
                              :checked="formData[field.name]"
                              disabled
                              active-value="1"
                              inactive-value="0"
                              :size="field.frontEndConfig.size || '24px'"
                            ></van-switch>
                          </van-cell>
                        </block>
                        <!-- 评分 -->
                        <block v-else-if="field.type == 'rate'">
                          <van-cell :title="field.nameDisp">
                            <van-rate :value="formData[field.name]" readonly></van-rate>
                          </van-cell>
                        </block>
                        <!-- 文件 -->
                        <block v-else-if="field.type == 'file'">
                          <view class="c-cell-view c-flex c-flex-between">
                            <view class="c-cell_title c-size-14">{{ field.nameDisp }}</view>
                            <view class="c-cell_value">
                              ({{ formData[field.name].length || 0 }} /
                              {{
                                field.frontEndConfig.max || field.frontEndConfig.max == 0
                                  ? field.frontEndConfig.max
                                  : '不限'
                              }})
                            </view>
                          </view>
                          <view class="c-cell-view">
                            <view v-if="field.frontEndConfig.fileType == 'video'" class="c-flex">
                              <video
                                v-for="(item, i) in formData[field.name]"
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
                              ></video>
                            </view>
                            <van-uploader
                              style="display: flex"
                              v-else
                              multiple
                              :accept="field.frontEndConfig.fileType || 'image'"
                              :upload-text="
                                field.frontEndConfig ? field.frontEndConfig.uploadText : ''
                              "
                              disabled
                              :deletable="false"
                              :file-list="formData[field.name]"
                              :max-count="
                                field.frontEndConfig.max || field.frontEndConfig.max == 0
                                  ? field.frontEndConfig.max
                                  : 20
                              "
                            />
                          </view>
                        </block>
                        <!-- 省市区 -->
                        <block v-else-if="field.type == 'area'">
                          <van-cell
                            :title="field.nameDisp"
                            :value="
                              area.areaList.province_list[formData[field.name][0]] +
                              area.areaList.city_list[formData[field.name][1]] +
                              area.areaList.county_list[formData[field.name][2]]
                            "
                          />
                        </block>
                        <!-- 渲染类型字段 -->
                        <!-- 标题 -->
                        <block v-else-if="field.type == 'title'">
                          <view
                            class="c-cell-headline"
                            v-html="field.frontEndConfig.html || field.nameDisp"
                          ></view>
                        </block>
                        <!-- 分隔槽 -->
                        <block v-else-if="field.type == 'gap'">
                          <view class="c-cell-gap">
                            {{ field.frontEndConfig.html || '' }}
                          </view>
                        </block>
                        <!-- 按钮 -->
                        <block v-else-if="field.type == 'button'">
                          <van-button
                            disabled
                            :data-type="field.type"
                            :data-name="field.name"
                            :data-fec="field.frontEndConfig"
                            :type="field.frontEndConfig.type"
                            :color="field.frontEndConfig.color"
                            :block="field.frontEndConfig.type"
                            :round="field.frontEndConfig.round"
                            :plain="field.frontEndConfig.plain"
                          >
                            {{ field.nameDisp }}
                          </van-button>
                        </block>
                        <!-- 弹出框 -->
                        <block v-else-if="field.type == 'dialog'">
                          <view class="c-cell-view c-flex" @click="dialogClick" :data-field="field">
                            <van-icon
                              custom-class="c-green"
                              name="checked"
                              v-if="formData[field.name]"
                            />
                            <rich-text :nodes="field.frontEndConfig.text"></rich-text>
                          </view>
                        </block>
                        <!-- text textarea number digit date time datetime phone idcard IDNumber evaluate -->
                        <block v-else>
                          <van-cell :title="field.nameDisp" :value="formData[field.name]" />
                        </block>
                      </van-cell-group>
                    </block>
                  </block>
                </block>
              </block>
            </block>
            <!-- 弹出层 -->
            <!-- 查看表单 -->
            <van-popup
              :show="form.show"
              z-index="101"
              position="bottom"
              round
              closeable
              custom-style="height: 90%;"
              @close="form.show = false"
            >
              <block v-for="(field, index) in fields" :key="index">
                <!-- 不展示隐藏字段 -->
                <block v-if="!field.frontEndConfig.mpDetailHide">
                  <!-- TODO:根据其他字段值展示 -->
                  <block
                    v-if="
                      field.frontEndConfig.showField
                        ? field.frontEndConfig.showValue == formData[field.frontEndConfig.showField]
                        : true
                    "
                  >
                    <van-cell-group>
                      <!-- 下拉 -->
                      <block v-if="field.type == 'select' && field.frontEndConfig.multiple">
                        <!-- 多选 -->
                        <block v-if="field.frontEndConfig.multiple">
                          <van-cell :title="field.nameDisp" :value="format(field)" />
                        </block>
                        <!-- 单选 -->
                        <block v-else>
                          <van-cell :title="field.nameDisp" :value="format(field)" />
                        </block>
                      </block>
                      <!-- 级联 -->
                      <block v-else-if="field.type == 'cascade' && field.frontEndConfig.multiple">
                        <!-- 多选 -->
                        <block v-if="field.frontEndConfig.multiple">
                          <van-cell :title="field.nameDisp" :value="format(field)" />
                        </block>
                        <!-- 单选 -->
                        <block v-else>
                          <van-cell :title="field.nameDisp" :value="format(field)" />
                        </block>
                      </block>
                      <!-- 单选 -->
                      <block v-else-if="field.type == 'radio'">
                        <van-cell :title="field.nameDisp">
                          <van-radio-group
                            :value="formData[field.name]"
                            disabled
                            class="c-cell-radio-group"
                          >
                            <van-radio
                              v-for="(item, i) in options[field.valueOption]"
                              :key="i"
                              :name="item.value"
                            >
                              {{ item.name }}
                            </van-radio>
                          </van-radio-group>
                        </van-cell>
                      </block>
                      <!-- 多选 -->
                      <block v-else-if="field.type == 'checkbox'">
                        <van-cell :title="field.nameDisp">
                          <van-checkbox-group
                            :value="formData[field.name]"
                            disabled
                            class="c-cell-checkbox-group"
                          >
                            <van-checkbox
                              v-for="(item, i) in options[field.valueOption]"
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
                      <!-- 开关 -->
                      <block v-else-if="field.type == 'switch'">
                        <van-cell :title="field.nameDisp" class="c-cell-switch">
                          <van-switch
                            :checked="formData[field.name]"
                            disabled
                            active-value="1"
                            inactive-value="0"
                            :size="field.frontEndConfig.size || '24px'"
                          ></van-switch>
                        </van-cell>
                      </block>
                      <!-- 评分 -->
                      <block v-else-if="field.type == 'rate'">
                        <van-cell :title="field.nameDisp">
                          <van-rate :value="formData[field.name]" readonly></van-rate>
                        </van-cell>
                      </block>
                      <!-- 文件 -->
                      <block v-else-if="field.type == 'file'">
                        <view class="c-cell-view c-flex c-flex-between">
                          <view class="c-cell_title c-size-14">{{ field.nameDisp }}</view>
                          <view class="c-cell_value">
                            ({{ formData[field.name].length || 0 }} /
                            {{
                              field.frontEndConfig.max || field.frontEndConfig.max == 0
                                ? field.frontEndConfig.max
                                : '不限'
                            }})
                          </view>
                        </view>
                        <view class="c-cell-view">
                          <view v-if="field.frontEndConfig.fileType == 'video'" class="c-flex">
                            <video
                              v-for="(item, i) in formData[field.name]"
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
                            ></video>
                          </view>
                          <van-uploader
                            style="display: flex"
                            v-else
                            multiple
                            :accept="field.frontEndConfig.fileType || 'image'"
                            :upload-text="
                              field.frontEndConfig ? field.frontEndConfig.uploadText : ''
                            "
                            disabled
                            :deletable="false"
                            :file-list="formData[field.name]"
                            :max-count="
                              field.frontEndConfig.max || field.frontEndConfig.max == 0
                                ? field.frontEndConfig.max
                                : 20
                            "
                          />
                        </view>
                      </block>
                      <!-- 省市区 -->
                      <block v-else-if="field.type == 'area'">
                        <van-cell
                          :title="field.nameDisp"
                          :value="
                            area.areaList.province_list[formData[field.name][0]] +
                            area.areaList.city_list[formData[field.name][1]] +
                            area.areaList.county_list[formData[field.name][2]]
                          "
                        />
                      </block>
                      <!-- 渲染类型字段 -->
                      <!-- 标题 -->
                      <block v-else-if="field.type == 'title'">
                        <view
                          class="c-cell-headline"
                          v-html="field.frontEndConfig.html || field.nameDisp"
                        ></view>
                      </block>
                      <!-- 分隔槽 -->
                      <block v-else-if="field.type == 'gap'">
                        <view class="c-cell-gap" v-html="field.frontEndConfig.html"></view>
                      </block>
                      <!-- 按钮 -->
                      <block v-else-if="field.type == 'button'">
                        <van-button
                          disabled
                          :data-type="field.type"
                          :data-name="field.name"
                          :data-fec="field.frontEndConfig"
                          :type="field.frontEndConfig.type"
                          :color="field.frontEndConfig.color"
                          :block="field.frontEndConfig.type"
                          :round="field.frontEndConfig.round"
                          :plain="field.frontEndConfig.plain"
                        >
                          {{ field.nameDisp }}
                        </van-button>
                      </block>
                      <!-- 弹出框 -->
                      <block v-else-if="field.type == 'dialog'">
                        <view class="c-cell-view c-flex" @click="dialogClick" :data-field="field">
                          <van-icon
                            custom-class="c-green"
                            name="checked"
                            v-if="formData[field.name]"
                          />
                          <rich-text :nodes="field.frontEndConfig.text"></rich-text>
                        </view>
                      </block>
                      <!-- text textarea number digit date time datetime phone idcard IDNumber evaluate -->
                      <block v-else>
                        <van-cell :title="field.nameDisp" :value="formData[field.name]" />
                      </block>
                    </van-cell-group>
                  </block>
                </block>
              </block>
            </van-popup>
            <!-- 工作流节点 -->
            <van-popup
              :show="workflow.show"
              position="bottom"
              round
              closeable
              custom-style="height: 90%;"
              @close="workflow.show = false"
            >
              <view class="card-group">
                <view class="card" v-for="(item, i) in workflow.def.nodes" :key="i">
                  <view class="card-header">
                    <text class="card-title">{{ item.nodeDef.name }}</text>
                  </view>
                  <view class="card-content">
                    <view>
                      <text>创建时间：</text>
                      <text>{{ item.createTime }}</text>
                    </view>
                  </view>
                  <view class="card-footer">
                    <view></view>
                    <view>
                      <van-button
                        plain
                        round
                        type="info"
                        size="small"
                        @click="
                          viewForm({
                            formDefId: item.nodeDef.formDefId,
                            formDataId: item.formDataId,
                            show: true
                          })
                        "
                      >
                        查看表单
                      </van-button>
                    </view>
                  </view>
                </view>
              </view>
            </van-popup>
            <!-- 富文本弹出框(阅读协议) -->
            <van-dialog
              use-slot
              :title="dialog.title"
              :class="dialog.countdown ? 'countdown' : ''"
              :show="dialog.show"
              :show-cancel-button="dialog.showCancelButton && !formData[dialog.field.name]"
              :confirm-button-text="
                dialog.confirmText + (dialog.countdown ? '（' + dialog.countdown + 's）' : '')
              "
              :cancel-button-text="dialog.cancelText"
              @confirm="dialogConfirm"
              @cancel="dialogCancel"
            >
              <view style="height: 60vh; overflow-y: auto; font-size: 14px; padding: 20rpx">
                <rich-text :nodes="dialog.content"></rich-text>
              </view>
            </van-dialog>
          </view>
        </view>
        <van-empty v-else description="暂无可查看数据" />
      </view>
    </block>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../common/common.js');
const areajs = require('../../common/area.js');
export default {
  data() {
    return {
      id: '',
      host: common.osg.host,
      //用户信息
      userinfo: {},
      //全部工单
      list: [],
      // 当前工单
      data: {},
      //当前点击的节点
      activeNode: {
        nodeDef: {
          name: ''
        }
      },
      // 表单字段
      fields: [],
      // 表单数据
      formData: {},
      // 弹出表单
      form: {
        show: false
      },
      // 子流程列表
      subflows: [],
      // 工作流定义:含运行时节点+定义节点
      workflow: {},
      //订单列表
      orders: {
        fpi: {
          data: []
        }
      },
      // 字典表
      options: {
        // 支付状态
        payState: [
          {
            name: '未支付',
            value: 0
          },
          {
            name: '已结清',
            value: 1
          },
          {
            name: '部分支付',
            value: 2
          }
        ],
        cascadeCode_repairParts: { codeId: 'repairParts' }
      },
      // 省市区选择
      area: {
        field: '',
        areaList: Object.assign({}, areajs.default)
      },
      // 弹窗(如阅读协议)
      dialog: {
        show: false,
        field: {
          // frontEndConfig:{
          // confirmText:"同意",
          // cancelText:"不同意",
          // time:10, //至少阅读多少秒
          // must:true, //是否必须同意
          // title:"",
          // text:"",
          // content:""
          // }
        }
      }
    };
  },
  onLoad(params) {
    this.init(params);
  },
  methods: {
    init(params) {
      common.osg.init(this, params, app);
      this.id = params.id;
      //用户信息
      this.userinfo = wx.getStorageSync('user');
      common.osg.codeoption(() => {
        if (this.options.repairParts) {
          this.options.repairParts.map(item => {
            item.label = item.name;
          });
        }
        this.getData();
      });
    },
    getData() {
      common.osg.ajax('basic/serviceAppointment/query', {}, res => {
        // 赋值全部工单
        this.list = res;
        if (this.list.length == 0) {
          return;
        }
        // 默认展示第一个工单
        this.data = res.filter(item => item._id == this.id)[0] || {};
        // 寻找展示的第一个节点
        for (let i = 0; i < this.data.workflowNodeList.length; i++) {
          let node = this.data.workflowNodeList[i];
          if (
            i != 0 &&
            node.nodeDef.nodeType != 'auto' &&
            node.nodeDef.nodeType != 'allot' &&
            node.nodeDef.nodeType != 'dispatch' &&
            node.nodeDef.nodeType != 'accept'
          ) {
            this.nodeClick(node);
            break;
          }
        }
      });
    },
    /**
     * 点击侧边栏节点
     */
    nodeClick(node) {
      /**
       * 保存当前节点
       */
      node.nodeDef.name = node.nodeDef.name || ''; //防止indexOf报错
      this.activeNode = node;
      console.log('当前节点', this.activeNode);
      this.$forceUpdate(); //刷新侧边栏
      /**
       * 查询订单
       */
      if (this.activeNode.nodeDef.nodeType == 'placeOrder') {
        this.getOrders();
      }
      /**
       * 渲染不同类型节点
       */
      if (node.nodeDef.nodeType == 'subflows') {
        /**
         * 子流程列表
         */
        this.getSubflows(node._id);
      } else if (node.nodeDef.nodeType == 'forms') {
        /**
         * 多个表单
         */
      } else if (node.nodeDef.formDefId) {
        /**
         * 查询表单(formDefId,colName)
         */
        this.getFields(node.nodeDef.formDefId, null, fields => {
          this.getOptions(fields, () => {
            this.getFormData(node.nodeDef.formDefId, node.formDataId);
          });
        });
      }
    },
    getFields(formDefId, colName, callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          extId: formDefId || null,
          colName: colName || null,
          sortField: 'order',
          sortOrder: 'asc',
          'in:state|array-integer#and': '1',
          _all: '1',
          tenantId: this.data.tenantId
        },
        res => {
          this.fields = res.data;
          if (callback) callback(res.data);
        },
        {
          noload: true
        }
      );
    },
    /**
     * 查询字典表
     */
    getOptions(fields, callback) {
      fields = fields || this.fields;
      for (var field of fields) {
        //解析frontEndConfig字段配置
        if (field.frontEndConfig && common.osg.isJson(field.frontEndConfig)) {
          field.frontEndConfig = JSON.parse(field.frontEndConfig);
        } else {
          field.frontEndConfig = {};
        }
        //特殊类型字段默认值
        if (field.type == 'file' || field.type == 'area') {
          this.formData[field.name] = [];
        }
        // 获取字典表codeType 之后批量查询
        if (field.valueOption)
          this.options['codecfg_' + field.valueOption] = {
            codeId: field.valueOption
          };
        if (field.type == 'cascade')
          this.options['cascadeCode_' + field.valueOption] = {
            codeId: field.valueOption
          };
      }
      common.osg.codeoption(() => {
        if (callback) callback();
      });
    },
    /**
     * 查询表单数据
     */
    getFormData(formDefId, formDataId, show) {
      if (!formDataId) {
        this.formData = {};
        return;
      }
      common.osg.ajax(
        'biz/extForm/query/' + formDefId,
        {
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:_id|string#and': formDataId,
          tenantId: this.data.tenantId
        },
        res => {
          res.data[0] = res.data[0] || {};
          this.formData = res.data[0];
          this.form.show = show || false;
        },
        {
          noload: true
        }
      );
    },
    // saveFormData() {
    //   if (common.osg.isRepeatClick('saveFormData')) {
    //     return;
    //   }
    //   //检测是否必填
    //   for (var field of this.fields) {
    //     if (field.type == 'switch' && !this.formData[field.name]) {
    //       this.formData[field.name] = '0';
    //     }
    //     if (
    //       field.required == '1' &&
    //       !this.formData[field.name] &&
    //       this.formData[field.name] !== 0 &&
    //       this.activeNode.nodeDef.formFieldIdsReadOnly.indexOf(field._id) == -1
    //     ) {
    //       if (field.frontEndConfig.showField) {
    //         //如果根据其他字段值展示 不展示则不需要必填
    //         if (this.formData[field.frontEndConfig.showField] == field.frontEndConfig.showValue) {
    //           if (field.type == 'dialog') {
    //             common.osg.alert(field.nameDisp);
    //             return;
    //           } else {
    //             common.osg.alert(field.nameDisp + '为必填项');
    //             return;
    //           }
    //         }
    //       } else {
    //         if (field.type == 'dialog') {
    //           common.osg.alert(field.nameDisp);
    //           return;
    //         } else {
    //           common.osg.alert(field.nameDisp + '为必填项');
    //           return;
    //         }
    //       }
    //     }

    //     if (field.type == 'phone' && this.formData[field.name]) {
    //       if (!this.checkMobile(this.formData[field.name])) {
    //         common.osg.toast(field.nameDisp + '格式错误', 'none');
    //         return;
    //       }
    //     } else if (field.type == 'IDNumber' && this.formData[field.name]) {
    //       if (!this.checkIDNumber(this.formData[field.name])) {
    //         common.osg.toast(field.nameDisp + '格式错误', 'none');
    //         return;
    //       }
    //     }
    //   }
    //   // 补字段
    //   this.formData.smodule = 'serviceAppointment';
    //   this.formData.tenantId = this.data.tenantId;
    //   this.formData.sid = this.data._id;
    //   // this.formData.orgId = this.data.orgId;
    //   // 保存表单
    //   common.osg.ajax(
    //     `biz/extForm/upsert/${this.activeNode.nodeDef.formDefId}`,
    //     {
    //       dataStr: JSON.stringify(this.formData)
    //     },
    //     res => {
    //       common.osg.toast('保存成功', 'none');
    //       this.process(res.data._id);
    //     }
    //   );
    // },
    /**
     * 查看表单
     */
    viewForm({ formDefId, formDataId, formData, show }) {
      if (common.osg.isRepeatClick('viewForm')) {
        return;
      }
      this.getFields(formDefId, null, fields => {
        this.getOptions(fields, res => {
          if (formData) {
            this.formData = formData;
            this.form.show = show || false;
          } else {
            this.getFormData(formDefId, formDataId, show);
          }
        });
      });
    },
    /**
     * 查询子流程列表
     */
    getSubflows(parentNodeId) {
      if (common.osg.isRepeatClick('getSubflows')) {
        return;
      }
      common.osg.ajax(
        `/workflow/queryByParentWorkflowNodeId/${parentNodeId}`,
        {},
        res => {
          this.subflows = res.data;
          console.log('子流程列表', this.subflows);
        },
        {
          noload: true
        }
      );
    },
    /**
     * 查询工作流定义并覆盖运行时工作流节点
     */
    getWorkflow(defId, runId) {
      if (common.osg.isRepeatClick('getWorkflow')) {
        return;
      }
      common.osg.ajax(
        'workflowDef/queryById/' + defId,
        null,
        res => {
          let workflow = res.entity;
          let defNodes = workflow.def.nodes;
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
              workflow.show = true;
              workflow.defId = defId;
              workflow.runId = runId;

              // 操作权限
              // for (let node of workflow.def.nodes) {
              //   for (let defRoleId of node.nodeDef.userChoose) {
              //     for (let currentRoleId of this.roleIds) {
              //       if (currentRoleId == defRoleId) {
              //         node.visible = true;
              //       }
              //     }
              //   }
              // }

              this.workflow = workflow;
              this.$forceUpdate();
              console.log('运行时节点+定义节点', workflow);
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
     * 处理工作流
     */
    process(nodeFormDataId) {
      let params = {
        workflowNodeId: this.activeNode._id,
        nodeFormDefId: this.activeNode.nodeDef.formDefId,
        nodeFormDataId: nodeFormDataId,
        smodule: 'serviceAppointment',
        tenantId: this.data.tenantId,
        sid: this.data._id
      };
      common.osg.ajax(
        'workflow/process',
        params,
        res => {
          this.getData();
        },
        { noload: true }
      );
    },
    /**
     * 查询订单
     */
    getOrders() {
      common.osg.ajax(
        'order/query',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:type|integer#and': 1, //0:报价单,1:订单
          'is:serviceAppointmentId|string#and': this.data._id
        },
        res => {
          this.orders.fpi = res;
        }
      );
    },
    tabChange(e) {
      this.data = this.list[e.detail.index];
      console.log('当前工单', this.data);
      // 寻找展示的第一个节点
      this.activeNode = { nodeDef: {}, exts: {} };
      for (let i = 0; i < this.data.workflowNodeList.length; i++) {
        let node = this.data.workflowNodeList[i];
        if (
          i != 0 &&
          node.nodeDef.nodeType != 'auto' &&
          node.nodeDef.nodeType != 'allot' &&
          node.nodeDef.nodeType != 'dispatch' &&
          node.nodeDef.nodeType != 'accept'
        ) {
          this.nodeClick(node);
          break;
        }
      }
    },
    /**
     * 打开页面
     */
    doOpen(id) {
      common.osg.open('../../subpackages/order/order', {
        id
      });
    },
    /**
     * 渲染字典
     */
    codelabel(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      }
    },
    /**
     * 渲染表单字段
     * name,type,valueOption,frontEndConfig
     */
    format(field) {
      // 未关联字典表或值为空，渲染为空字符串
      if (
        !field.valueOption ||
        (!field.value &&
          (this.formData[field.name] == undefined || this.formData[field.name] == null))
      ) {
        return '';
      }
      // 字段扩展
      field.frontEndConfig = field.frontEndConfig || {};
      // 字段值
      let valueOption = field.valueOption;
      let value = field.value || this.formData[field.name];
      // 通过字典表返显
      if (field.type == 'select' && field.frontEndConfig.multiple) {
        return common.osg.codelabelForArray(valueOption, value);
      } else if (field.type == 'select') {
        return common.osg.codelabel(valueOption, value);
      } else if (field.type == 'cascade' && field.frontEndConfig.multiple) {
        return common.osg.codelabelCascadeMultiple(valueOption, value);
      } else if (field.type == 'cascade') {
        return common.osg.codelabelCascade(valueOption, value);
      }
    },
    /**
     * 预览图片、查看文件
     */
    download(e) {
      if (common.osg.isRepeatClick('download')) {
        return;
      }
      common.osg.download(e);
    },
    /**
     * 弹窗类型字段(如阅读协议)
     */
    dialogClick(e) {
      if (!common.osg.isRepeatClick('dialog')) {
        let field = e.target.dataset.field || e.currentTarget.dataset.field;
        this.dialog.field = field;
        Object.assign(this.dialog, field.frontEndConfig);
        this.dialog.timer = setInterval(() => {
          this.dialog.countdown--;
          this.$forceUpdate();
          if (this.dialog.countdown <= 0) {
            clearInterval(this.dialog.timer);
          }
        }, 1000);
        this.dialog.show = true;
      }
    },
    dialogConfirm() {
      if (this.dialog.timer) {
        clearInterval(this.dialog.timer);
      }
      this.formData[this.dialog.field.name] = true;
      this.dialog.show = false;
    },
    dialogCancel() {
      if (this.dialog.timer) {
        clearInterval(this.dialog.timer);
      }
      this.dialog.show = false;
    },
    /**
     * 表单字段 点击
     */
    onChange(e) {
      let type = e.target.dataset.field.type;
      let field = e.target.dataset.field.name;
      let value = e.detail;
      // 字段赋值
      this.formData[field] = value;
      this.$forceUpdate();
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
        let func = options.field.frontEndConfig.func;
        if (func) {
          this[func]();
        }
      }
    },
    /**
     * 上传图片
     */
    afterRead(e) {
      let field = e.target.dataset.field;
      this.formData[field.name] = this.formData[field.name] || [];
      if (field && field.frontEndConfig && field.frontEndConfig.max) {
        if (field.frontEndConfig.max < this.formData[field.name].length + 1) {
          common.osg.alert('只能上传' + field.frontEndConfig.max + '个！');
          return;
        }
      }
      common.osg.afterRead(e, this, field.frontEndConfig.max, this.formData[field.name].length);
    },
    /**
     * 删除图片
     */
    deleteFile(e) {
      let field = e.target.dataset.field;
      let index = e.detail.index;
      this.formData[field.name].splice(index, 1);
      this.$forceUpdate();
    },
    call(type, callerId, calleeId, sid) {
      let user = wx.getStorageSync('user');
      if (user && user._id && user.nickname && user.phone) {
        common.osg.ajax(
          'basic/winnerlook/getMiddleNumber',
          {
            type,
            callerId: callerId || user._id,
            calleeId: calleeId || '',
            sid: sid || ''
          },
          res => {
            this.makeCall(res.data.phoneNumberX);
          }
        );
      } else {
        common.osg.confirm('请先授权用户信息', () => {
          common.osg.open(
            '../../subpackages/authorize/authorize',
            Object.assign(this.initParams, { url: '../../subpackages/store/storeDetail' }),
            {
              mode: 'redirect'
            }
          );
        });
      }
    },
    makeCall(phoneNumber) {
      var user = wx.getStorageSync('user');
      if (user && user._id && user.nickname && user.phone) {
        wx.makePhoneCall({
          phoneNumber: phoneNumber
        });
      } else {
        common.osg.confirm('请先授权用户信息', () => {
          common.osg.open(
            '../../subpackages/authorize/authorize',
            Object.assign(this.initParams, { url: '../../subpackages/store/storeDetail' }),
            {
              mode: 'redirect'
            }
          );
        });
      }
    },
    // 跳转监控详情
    toMoKanDetail(item) {
      common.osg.open('../web/web', {
        url: `${this.host}/fsgo/wm/h5/mokan/detail/${item.exts.moKanNum}?address=${
          this.area.areaList.province_list[item.area[0]] +
          this.area.areaList.city_list[item.area[1]] +
          this.area.areaList.county_list[item.area[2]] +
          item.address
        }&startDate=${item.exts.startDate || ''}&supervisorName=${
          item.exts.supervisorName || ''
        }&headmanName=${item.exts.headmanName || ''}&client=c`
      });
    },
    // 发起聊天
    chatEntry(data) {
      common.osg.ajax('chatMessage/entry', { orgId: data.orgId }, res => {
        console.log('res', res);
        common.osg.open('/subpackages/message/message', {
          relationId: res.data._id,
          sendUserName: data.orgName
        });
      });
    }
  },
  onShow: function () {
    common.osg.init(this, {}, app);
  }
};
</script>

<style lang="scss">
page > view {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    width: 100vw;
    // height: 30vw;
    // padding: 0 4vw;
    padding: 3vw 3vw 6vw 10vw;
    box-sizing: border-box;
    background-color: #107ad0;
    display: flex;
    align-items: center;

    .userinfo {
      display: flex;
      .face {
        width: 15vw;
        height: 15vw;
        border-radius: 10rpx;
        overflow: hidden;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        padding-left: 4vw;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }
  }

  .bg {
    width: 100vw;
    border-radius: 0 0 100% 100%;
    background-color: #107ad0;
    .tabs {
      margin: 0 3vw;
      box-sizing: border-box;
      border-radius: 20rpx;
      overflow: hidden;
    }
  }

  .content {
    font-size: 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .title {
      background-color: #fff;
      margin: 1vw 0;
      padding: 1vw 3vw;
      color: #121212;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .middle {
      flex: 1;
      display: flex;
      color: #515151;
      .sidebar {
        background-color: #fff;
        margin-right: 1vw;
        height: 100%;
        overflow-y: auto;
        .sidebar-item {
          padding: 3vw;
          position: relative;
          max-width: 25vw;
          box-sizing: border-box;
        }
        .sidebar-item-active {
          padding: 3vw;
          position: relative;
          max-width: 25vw;
          box-sizing: border-box;
          color: #ec4d45;
          font-weight: 500;
        }
        .sidebar-item-active::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 1vw;
          height: 100%;
          background-color: #ec4d45;
          content: '';
        }
        c-red {
          color: red;
        }
      }
      .main {
        flex: 1;
        background-color: #fff;
        height: 100%;
        overflow-y: auto;
        .card-group {
          // padding: 0 3vw;

          .card {
            background: #fff;
            // border-radius: 10px;
            // margin-top: 3vw;
            border-bottom: 1px solid #f5f5f5;

            .card-header {
              padding: 3vw;
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #323233;

              .card-title {
                font-weight: 500;
              }
            }

            .card-content {
              padding: 0 3vw;
              color: #646566;
              font-size: 14px;
            }

            .card-footer {
              padding: 3vw;
              display: flex;
              justify-content: space-between;
              align-items: center;

              van-button:not(:first-child) {
                margin-left: 3vw;
              }
            }
          }
        }
      }
    }
  }

  .notice::after {
    position: absolute;
    top: calc(50% - 0.5vw);
    right: 1vw;
    width: 1vw;
    height: 1vw;
    border-radius: 50%;
    background-color: #ec4d45;
    content: '';
  }
}
</style>
