<template>
  <view
    style="height: 99.99%; overflow: scroll"
    :class="openForm ? 'c-hidden c-h-50rpx placeOrder' : 'placeOrder'"
    @click.capture="track"
  >
    <movable-area style="height: 100%; width: 100%">
      <!--      <movable-view-->
      <!--        v-if="type == '1'"-->
      <!--        style="z-index: 99"-->
      <!--        @click.stop="temporaryForm()"-->
      <!--        :y="systemInfo.windowHeight / 2"-->
      <!--        :x="systemInfo.windowWidth - 60"-->
      <!--        direction="all"-->
      <!--        out-of-bounds-->
      <!--      >-->
      <!--        <view v-if="!orderId" class="temporaryBtn">-->
      <!--          <image-->
      <!--            src="https://pub.fsgo365.cn/temporary.png"-->
      <!--            style="width: 20px; height: 20px; display: flex"-->
      <!--          />-->
      <!--          <view class="c-size-12 c-white c-white-space-nowrap">暂存</view>-->
      <!--        </view>-->
      <!--      </movable-view>-->
      <view style="padding-bottom: 93px">
        <!-- 字段 -->
        <van-cell-group
          :class="!editType || editType <= 1 ? 'c-popup-cells' : 'c-popup-cells c-no-pointer'"
          :border="false"
        >
          <block v-for="(extField, index) in placeOrderFields" :key="index">
            <block
              v-if="
                extField.frontEndConfig.showField
                  ? formData[extField.frontEndConfig.showField] == extField.frontEndConfig.showValue
                  : true
              "
            >
              <block v-if="extField.type == 'phone' || extField.type == 'IDNumber'">
                <van-field
                  :label="extField.nameDisp"
                  :value="formData[extField.name]"
                  @change="onChange"
                  :data-extfield="extField"
                  type="number"
                  :maxlength="extField.type == 'phone' ? 11 : -1"
                  :required="extField.required == '1'"
                  input-align="right"
                ></van-field>
              </block>
              <block v-else-if="extField.type == 'switch'">
                <van-cell
                  :title="extField.nameDisp"
                  class="c-cell-switch"
                  :required="extField.required == '1'"
                >
                  <van-switch
                    :checked="formData[extField.name]"
                    @change="onChange"
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
                  :value="formData[extField.name]"
                  @click="onClick"
                  is-link
                  :data-extfield="extField"
                  :required="extField.required == '1'"
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'select'">
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    commonEvent('codelabel', extField.name, {
                      option: extField.valueOption,
                      value: formData[extField.name]
                    })
                  "
                  @click="onClick"
                  :data-extfield="extField"
                  is-link
                  :required="extField.required == '1'"
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'cascade'">
                <!-- #ifdef MP-WEIXIN -->
                <van-cell
                  :title="extField.nameDisp"
                  :value="
                    commonEvent('cascade', null, {
                      option: extField.valueOption,
                      value: formData[extField.name]
                    })
                  "
                  @click="onClick"
                  :data-extfield="extField"
                  is-link
                  :required="extField.required == '1'"
                ></van-cell>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <van-cell
                  :title="extField.nameDisp"
                  @click="onClick"
                  :data-extfield="extField"
                  :required="extField.required == '1'"
                >
                  <uni-data-picker
                    :key="extField.name"
                    ref="uniDataPicker"
                    v-model="formData[extField.name]"
                    placeholder="请选择"
                    popup-title="请选择"
                    :localdata="options[extField.valueOption]"
                    :map="{
                      text: 'name',
                      value: 'value'
                    }"
                    @change="cascadeConfirm"
                    :clear-icon="false"
                  ></uni-data-picker>
                </van-cell>
                <!-- #endif -->
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
                  :required="extField.required == '1'"
                ></van-cell>
              </block>
              <block v-else-if="extField.type == 'radio'">
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <van-radio-group
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-extfield="extField"
                    class="c-radio-group c-rt"
                  >
                    <van-radio
                      checked-color="#106cff"
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
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <van-checkbox-group
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-extfield="extField"
                    class="c-checkbox-group"
                  >
                    <van-checkbox
                      v-for="(item, i) in options[extField.valueOption]"
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
                    :value="formData[extField.name]"
                    @change="onChange"
                    :data-extfield="extField"
                  ></van-rate>
                </van-cell>
              </block>
              <block v-else-if="extField.type == 'file'">
                <view class="c-cell-view c-flex c-flex-between c-relative">
                  <view class="c-cell_title">
                    <span class="c-required" v-if="extField.required == '1'">*</span>
                    {{ extField.nameDisp }}
                  </view>
                  <view class="c-cell_value">
                    ({{ (formData[extField.name] && formData[extField.name].length) || 0 }} /
                    {{ extField.frontEndConfig.max || '不限' }})
                  </view>
                </view>
                <view class="c-cell-view">
                  <van-uploader
                    style="display: flex"
                    multiple
                    :upload-text="extField.frontEndConfig ? extField.frontEndConfig.uploadText : ''"
                    :file-list="formData[extField.name]"
                    @after-read="afterRead"
                    :data-field="extField.name"
                    :data-extField="extField"
                    @delete="deleteFile"
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
                    (extField.frontEndConfig && extField.frontEndConfig.html) || extField.nameDisp
                  "
                ></view>
              </block>
              <block v-else-if="extField.type == 'gap'">
                <block v-if="extField.frontEndConfig ? !extField.frontEndConfig.gapHide : true">
                  <view class="c-cell-gap">
                    {{ (extField.frontEndConfig && extField.frontEndConfig.html) || '' }}
                  </view>
                </block>
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
                  is-link
                  :required="extField.required == '1'"
                />
              </block>
              <block v-else-if="extField.type == 'button'">
                <van-button
                  v-if="
                    (!editType || editType == '1' || editType == '2') &&
                    extField.frontEndConfig.appId
                  "
                  @click="
                    navigateToMiniProgram(
                      extField.frontEndConfig.appId,
                      extField.frontEndConfig.path,
                      extField.frontEndConfig.extraData
                    )
                  "
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :type="extField.frontEndConfig.type"
                  :color="extField.frontEndConfig.color"
                  :block="extField.frontEndConfig.type"
                  :round="extField.frontEndConfig.round"
                  :icon="extField.frontEndConfig.icon"
                  :plain="extField.frontEndConfig.plain"
                  :custom-style="
                    extField.frontEndConfig.style + 'pointer-events:all' || 'pointer-events:all'
                  "
                  :data-event="{ id: 'evEsOUcxX3' }"
                >
                  {{ extField.nameDisp }}
                </van-button>
                <van-button
                  v-else-if="!editType || editType == '1' || editType == '2'"
                  @click="commonEvent('button', null, { extField })"
                  :data-type="extField.type"
                  :data-name="extField.name"
                  :data-fec="extField.frontEndConfig"
                  :type="extField.frontEndConfig.type"
                  :color="extField.frontEndConfig.color"
                  :block="extField.frontEndConfig.type"
                  :round="extField.frontEndConfig.round"
                  :icon="extField.frontEndConfig.icon"
                  :plain="extField.frontEndConfig.plain"
                  :custom-style="
                    extField.frontEndConfig.style + 'pointer-events:all' || 'pointer-events:all'
                  "
                  :data-event="{ id: 'g0hGS-LMIw' }"
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
                    :data-event="{ id: 'It0C4S65Z2' }"
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
                    :data-event="{ id: 'I3kdsYH-RZ' }"
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
                      :data-event="{ id: 'Uo9DpiLoZ8' }"
                    >
                      {{ extField.frontEndConfig.buttonName }}
                    </van-button>
                  </van-field>
                </van-cell-group>
              </block>
              <block v-else-if="extField.type == 'bgImage'"></block>
              <!-- 按类别展示 -->
              <block v-else-if="extField.type == 'sort'">
                <view v-if="extField.frontEndConfig.showName">{{ extField.name }}</view>
                <van-cell-group :border="false">
                  <view
                    v-for="(item, key) in formData[extField.name]"
                    :key="key"
                    class="c-cell-view c-flex c-flex-between"
                    style="padding: 10px 25px"
                  >
                    <view>
                      {{ commonEvent('codelabel', null, { option: extField.option, value: key }) }}
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
                  :required="extField.required == '1'"
                  input-align="right"
                ></van-field>
              </block>
              <!-- 原生类型 text number idcard digit textarea 自定义计算类型evaluate-->
              <block v-else>
                <!-- #ifdef MP-WEIXIN -->
                <van-field
                  :key="extField.name"
                  :label="extField.nameDisp"
                  :value="formData[extField.name]"
                  @change="onChange"
                  @blur="onBlur"
                  :data-extfield="extField"
                  :type="extField.type"
                  :required="extField.required == '1'"
                  :placeholder="
                    serviceType === '40'
                      ? extField && extField.frontEndConfig && extField.frontEndConfig.placeholder
                        ? extField.frontEndConfig.placeholder
                        : extField.frontEndConfig.placeholder
                      : '请输入'
                  "
                  input-align="right"
                  input-class="input-class-form"
                ></van-field>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                  <view class="c-flex c-item-center">
                    <textarea
                      v-if="extField.type == 'textarea' || extField.name == 'address'"
                      :key="extField.name"
                      :value="formData[extField.name]"
                      :type="extField.type"
                      :data-extfield="extField"
                      :data-name="extField.name"
                      :data-type="extField.type"
                      :data-fec="extField.frontEndConfig"
                      auto-height
                      style="text-align: left"
                      @input="onInput"
                    />
                    <input
                      v-else
                      :key="extField.name"
                      :value="formData[extField.name]"
                      :type="extField.type"
                      :data-extfield="extField"
                      :data-name="extField.name"
                      :data-type="extField.type"
                      :data-fec="extField.frontEndConfig"
                      style="width: 100%; text-align: right"
                      @input="onInput"
                    />

                    <van-button
                      v-if="extField.name == 'address'"
                      slot="button"
                      type="info"
                      size="small"
                      icon="location-o"
                      @click="doOpen('../map/amap')"
                      :data-event="{ id: 'GtPvkcd1WA' }"
                    >
                      定位
                    </van-button>
                  </view>
                </van-cell>
                <!-- #endif -->
              </block>
            </block>
          </block>
        </van-cell-group>
        <!-- 已选择套餐、工序、材料、机措 -->
        <view class="c-content">
          <block v-if="orderListShow">
            <view class="c-order" v-for="(order, orderIndex) in orderList" :key="orderIndex">
              <view class="c-order-top">
                <view>
                  <van-cell
                    v-if="serviceType == '11' || serviceType == '12'"
                    title="维修部位"
                    :value="
                      commonEvent('cascade', null, {
                        option: 'parts',
                        value: order.repairParts
                      })
                    "
                    @click="orderRepairPartsClick(orderIndex)"
                    data-extfield="repairParts"
                    :border="false"
                  ></van-cell>
                  <van-cell
                    v-else-if="serviceType === '40'"
                    title="施工部位"
                    :value="
                      commonEvent('cascade', null, {
                        option: 'refreshParts',
                        value: order.repairParts
                      })
                    "
                    @click="orderRepairPartsClick(orderIndex)"
                    data-extfield="repairParts"
                    :border="false"
                  ></van-cell>
                  <van-field
                    @change="orderFieldChange($event, orderIndex, 'partDescription')"
                    label="部位描述"
                    :value="order.partDescription"
                    :border="false"
                    placeholder="请填写部位描述"
                    :error="order.partDescription ? false : true"
                  />
                  <van-cell
                    v-if="serviceType == '21' || serviceType == '22'"
                    title="施工位置"
                    :border="false"
                  >
                    <van-radio-group
                      :value="order.constructionSite"
                      @change="orderConstructionSiteChange($event, orderIndex)"
                      data-extfield="constructionSite"
                      class="c-order-radio-group"
                    >
                      <van-radio
                        v-for="(item, i) in options.constructionSite"
                        :key="i"
                        :name="item.value"
                      >
                        {{ item.name }}
                      </van-radio>
                    </van-radio-group>
                  </van-cell>
                  <van-cell
                    v-if="
                      (order.agelimitMax || order.agelimitMax === 0) &&
                      (order.agelimit || order.agelimit === 0)
                    "
                    title="质保年限"
                    :value="formatAgelimit(order.agelimit)"
                    @click="agelimitEdit(orderIndex)"
                    :border="false"
                  ></van-cell>
                  <van-field
                    @change="orderFieldChange($event, orderIndex, 'maintainAreaNum')"
                    label="质保工程量(平米)"
                    :value="order.maintainAreaNum"
                    :border="false"
                    type="number"
                    placeholder="请填写质保工程量"
                    :error="order.maintainAreaNum ? false : true"
                  />
                </view>
                <view class="c-flex c-flex-between" style="padding: 8px 10px 10px">
                  <van-button
                    round
                    plain
                    type="danger"
                    custom-style="width:75px;height:30px;"
                    @click="orderRemove(orderIndex)"
                    :data-event="{ id: 'Y-K6_cG8BM' }"
                  >
                    删除
                  </van-button>
                  <van-button
                    round
                    plain
                    color="#0078D0"
                    custom-style="width:75px;height:30px;"
                    @click="orderEdit(orderIndex)"
                    :data-event="{ id: 'hmu8q8mrno' }"
                  >
                    编辑
                  </van-button>
                </view>
              </view>

              <!-- 套餐 -->
              <view class="c-selected" v-if="projPackageCount(order.projPackages) > 0">
                <view class="c-selected-title">
                  <text>套餐</text>
                  <text class="c-size-13">
                    分类合计：
                    <text class="c-red">¥{{ projPackageTotalAmount(order.projPackages) }}</text>
                  </text>
                </view>
                <view class="c-selected-items">
                  <block v-for="(item, index) in order.projPackages.data" :key="index">
                    <view
                      :data-item="item"
                      :data-index="index"
                      v-if="item.number > 0"
                      class="c-selected-item"
                    >
                      <view>{{ item.name }}</view>
                      <view v-if="item.skuCode">{{ item.skuCode }}</view>
                      <!--  style="margin: 10rpx 0 20rpx" -->
                      <view>
                        <view class="c-flex" v-if="item.desc">
                          <view class="desc">描述：{{ item.desc }}</view>
                          <van-icon
                            name="info-o"
                            color="#b3d8ff"
                            style="color: #b3d8ff"
                            class="c-m-l-5"
                            @click="toViewDescription(item.desc)"
                            :data-event="{ id: 'z7SJjLh2ui' }"
                          />
                        </view>
                        <text class="desc-tag">
                          {{ codelabel('packageType', item.type) }}
                        </text>
                        <text class="desc-tag" v-if="item.minimumPrice">
                          最低起算价：¥{{ item.minimumPrice }}
                        </text>
                        <!-- <text
                          v-if="item.procedureList.length > 0"
                          @click="openProcedures(item.procedureList)"
                          class="desc-tag" :data-event="{id:'NhQvXJRAmM'}">
                          查看工序
                        </text>
                        <text
                          v-if="item.materialList.length > 0"
                          @click="openMaterials(item.materialList)"
                          class="desc-tag" :data-event="{id:'A1shwF1JlK'}">
                          查看材料
                        </text> -->
                      </view>
                      <view class="c-flex c-flex-between c-flex-center c-flex-wrap">
                        <view>
                          <text style="color: #f00; font-size: 14px">¥{{ item.amount }}</text>
                        </view>
                        <van-stepper
                          v-if="item.number > 0"
                          :value="item.number"
                          :min="0"
                          button-size="35"
                          input-class="input-class"
                          plus-class="plus-class"
                          minus-class="minus-class"
                          custom-class="c-flex c-item-center"
                          @change="numberChange($event, item, 'projPackage', orderIndex)"
                        />
                        <van-icon
                          v-else
                          name="add"
                          color="#F9DE55"
                          style="color: #f9de55; font-size: 35px"
                          size="35px"
                          @click="selectorPlus(item)"
                          :data-event="{ id: '-GoOGau04T' }"
                        />
                      </view>
                    </view>
                  </block>
                </view>
              </view>
              <!-- 工序 -->
              <view class="c-selected" v-if="procedureCount(order.procedures) > 0">
                <view class="c-selected-title">
                  <text>工序</text>
                  <text class="c-size-13">
                    分类合计：
                    <text class="c-red">¥{{ procedureTotalAmount(order.procedures) }}</text>
                  </text>
                </view>
                <view class="c-selected-items">
                  <block v-for="(item, index) in order.procedures.data" :key="index">
                    <view
                      :data-item="item"
                      :data-index="index"
                      v-if="item.number > 0"
                      class="c-selected-item"
                    >
                      <view>{{ item.content }}</view>
                      <view style="margin: 10rpx 0 20rpx">
                        <view class="c-flex" v-if="item.desc">
                          <view class="desc">描述：{{ item.desc }}</view>
                          <van-icon
                            name="info-o"
                            color="#b3d8ff"
                            style="color: #b3d8ff"
                            class="c-m-l-5"
                            @click="toViewDescription(item.desc)"
                            :data-event="{ id: '-vQz2sJqYC' }"
                          />
                        </view>
                        <text class="desc-tag c-m-l-0" v-if="item.minimumGuideTotalPrice">
                          最低起算价：¥{{ item.minimumGuideTotalPrice }}
                        </text>
                      </view>
                      <view class="c-flex c-flex-between c-flex-center c-flex-wrap">
                        <view>
                          <text style="color: #f00; font-size: 14px">
                            ¥{{ item.guideUnitPrice }}
                          </text>
                          <text class="c-gray c-size-12">
                            {{ '/' + codelabel('unit', item.unit) }}
                          </text>
                        </view>
                        <van-stepper
                          v-if="item.number > 0"
                          :value="item.number"
                          :min="0"
                          button-size="35"
                          input-class="input-class"
                          plus-class="plus-class"
                          minus-class="minus-class"
                          custom-class="c-flex c-item-center"
                          @change="numberChange($event, item)"
                        />
                        <van-icon
                          v-else
                          name="add"
                          color="#F9DE55"
                          style="color: #f9de55; font-size: 35px"
                          size="35px"
                          @click="selectorPlus(item)"
                          :data-event="{ id: 'TlvPmHQ7HI' }"
                        />
                      </view>
                    </view>
                  </block>
                </view>
              </view>
              <!-- 材料 -->
              <view class="c-selected" v-if="materialCount(order.materials) > 0">
                <view class="c-selected-title">
                  <text>材料</text>
                  <text class="c-size-13">
                    分类合计：
                    <text class="c-red">¥{{ materialTotalAmount(order.materials) }}</text>
                  </text>
                </view>
                <view class="c-selected-items">
                  <block v-for="(item, index) in order.materials.data" :key="index">
                    <block v-if="item.number > 0">
                      <block v-if="item.skus && item.skus.length > 0">
                        <block v-for="(sku, skuIndex) in item.skus" :key="skuIndex">
                          <view
                            v-if="sku.number > 0"
                            :data-item="sku"
                            :data-index="index"
                            class="c-selected-item"
                          >
                            <view>{{ sku.name }}</view>
                            <view class="c-flex">
                              <image
                                v-if="item.images.length > 0"
                                :src="item.images && item.images[0].url"
                                style="margin-top: 10rpx; display: flex; width: 80px; height: 80px"
                                image-class="c-images"
                                @click="previewImage(item.images && item.images[0].url)"
                                :data-event="{ id: 'f-Bs5cyzS5' }"
                              />
                              <view
                                class="c-flex c-flex-col c-flex-1"
                                :data-event="{ id: 'f-Bs5cyzS5' }"
                              >
                                <view style="margin: 0 0 10rpx" :data-event="{ id: 'f-Bs5cyzS5' }">
                                  <text
                                    class="desc-tag c-m-r-10"
                                    v-if="item.spec"
                                    :data-event="{ id: 'f-Bs5cyzS5' }"
                                  >
                                    规格：{{ item.spec || ''
                                    }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
                                  </text>
                                  <!-- <text class="desc-tag" v-if="item.model" :data-event="{id:'f-Bs5cyzS5'}">
                                  型号：{{ item.model || '' }}
                                </text> -->
                                  <text
                                    v-if="item.desc"
                                    @click="openMaterialDetail(item.name, item.desc)"
                                    class="desc-tag"
                                    :data-event="{ id: 'Ivfr_pyW5d' }"
                                  >
                                    材料介绍
                                  </text>
                                </view>
                                <view
                                  class="c-flex c-flex-between c-flex-center c-flex-wrap c-m-l-10"
                                  :data-event="{ id: 'f-Bs5cyzS5' }"
                                >
                                  <view :data-event="{ id: 'f-Bs5cyzS5' }">
                                    <text
                                      style="color: #f00; font-size: 14px"
                                      :data-event="{ id: 'f-Bs5cyzS5' }"
                                    >
                                      ¥{{ sku.price }}
                                    </text>
                                    <text
                                      class="c-gray c-size-12"
                                      :data-event="{ id: 'f-Bs5cyzS5' }"
                                    >
                                      {{ '/' + codelabel('unit', item.materialUnit) }}
                                    </text>
                                  </view>
                                  <van-stepper
                                    v-if="sku.number > 0"
                                    :value="sku.number"
                                    integer
                                    :min="0"
                                    button-size="35"
                                    input-class="input-class"
                                    plus-class="plus-class"
                                    minus-class="minus-class"
                                    custom-class="c-flex c-item-center"
                                    @change="skuNumberChange($event, item, sku)"
                                  />
                                </view>
                              </view>
                            </view>
                          </view>
                        </block>
                      </block>
                      <view
                        v-else
                        :data-item="item"
                        :data-index="index"
                        class="c-selected-item"
                        :data-event="{ id: 'f-Bs5cyzS5' }"
                      >
                        <view :data-event="{ id: 'f-Bs5cyzS5' }">{{ item.name }}</view>
                        <view class="c-flex" :data-event="{ id: 'f-Bs5cyzS5' }">
                          <image
                            v-if="item.images.length > 0"
                            :src="item.images && item.images[0].url"
                            style="margin-top: 10rpx; display: flex; width: 80px; height: 80px"
                            image-class="c-images"
                            @click="previewImage(item.images && item.images[0].url)"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          />
                          <view
                            class="c-flex c-flex-col c-flex-1"
                            :data-event="{ id: 'f-Bs5cyzS5' }"
                          >
                            <view style="margin: 0 0 10px" :data-event="{ id: 'f-Bs5cyzS5' }">
                              <text
                                class="desc-tag"
                                v-if="item.spec"
                                :data-event="{ id: 'f-Bs5cyzS5' }"
                              >
                                规格：{{ item.spec || ''
                                }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
                              </text>
                              <text
                                v-if="item.desc"
                                @click="openMaterialDetail(item.name, item.desc)"
                                class="desc-tag"
                                :data-event="{ id: '23r9vU-Iiu' }"
                              >
                                材料介绍
                              </text>
                            </view>
                            <view
                              class="c-flex c-flex-between c-flex-center c-flex-wrap c-m-l-10"
                              :data-event="{ id: 'f-Bs5cyzS5' }"
                            >
                              <view :data-event="{ id: 'f-Bs5cyzS5' }">
                                <text
                                  style="color: #f00; font-size: 14px"
                                  :data-event="{ id: 'f-Bs5cyzS5' }"
                                >
                                  ¥{{ item.price }}
                                </text>
                                <text class="c-gray c-size-12" :data-event="{ id: 'f-Bs5cyzS5' }">
                                  {{ '/' + codelabel('unit', item.materialUnit) }}
                                </text>
                              </view>
                              <van-stepper
                                v-if="item.number > 0"
                                :value="item.number"
                                integer
                                :min="0"
                                button-size="35"
                                input-class="input-class"
                                plus-class="plus-class"
                                minus-class="minus-class"
                                custom-class="c-flex c-item-center"
                                @change="numberChange($event, item)"
                              />
                              <van-icon
                                v-else
                                name="add"
                                color="#F9DE55"
                                style="color: #f9de55; font-size: 35px"
                                size="35px"
                                @click="selectorPlus(item)"
                                :data-event="{ id: '3p3VNgL4wK' }"
                              />
                            </view>
                          </view>
                        </view>
                      </view>
                    </block>
                  </block>
                </view>
              </view>
              <!-- 机措 -->
              <view
                class="c-selected"
                v-if="measureCount(order.measures) > 0"
                :data-event="{ id: '7p0_WkVkhm' }"
              >
                <view class="c-selected-title" :data-event="{ id: '7p0_WkVkhm' }">
                  <text :data-event="{ id: '7p0_WkVkhm' }">机措</text>
                  <text class="c-size-13" :data-event="{ id: '7p0_WkVkhm' }">
                    分类合计：
                    <text class="c-red" :data-event="{ id: '7p0_WkVkhm' }">
                      ¥{{ measureTotalAmount(order.measures) }}
                    </text>
                  </text>
                </view>
                <view class="c-selected-items" :data-event="{ id: '7p0_WkVkhm' }">
                  <block v-for="(item, index) in order.measures.data" :key="index">
                    <view
                      v-if="item.number > 0"
                      :data-item="item"
                      :data-index="index"
                      class="c-selected-item"
                      :data-event="{ id: '7p0_WkVkhm' }"
                    >
                      <view :data-event="{ id: '7p0_WkVkhm' }">{{ item.content }}</view>
                      <view style="margin: 10rpx 0 20rpx" :data-event="{ id: '7p0_WkVkhm' }">
                        <view class="c-flex" v-if="item.desc" :data-event="{ id: '7p0_WkVkhm' }">
                          <view class="desc" :data-event="{ id: '7p0_WkVkhm' }">
                            描述：{{ item.desc }}
                          </view>
                          <van-icon
                            name="info-o"
                            color="#b3d8ff"
                            style="color: #b3d8ff"
                            class="c-m-l-5"
                            @click="toViewDescription(item.desc)"
                            :data-event="{ id: 'DqB6JzuQ8Z' }"
                          />
                        </view>
                      </view>
                      <view
                        class="c-flex c-flex-between c-flex-center c-flex-wrap"
                        :data-event="{ id: '7p0_WkVkhm' }"
                      >
                        <view :data-event="{ id: '7p0_WkVkhm' }">
                          <text
                            style="color: #f00; font-size: 14px"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          >
                            ¥{{ item.guideUnitPrice }}
                          </text>
                          <text class="c-gray c-size-12" :data-event="{ id: '7p0_WkVkhm' }">
                            {{ '/' + codelabel('unit', item.unit) }}
                          </text>
                        </view>
                        <van-stepper
                          v-if="item.number > 0"
                          :value="item.number"
                          integer
                          :min="0"
                          button-size="35"
                          input-class="input-class"
                          plus-class="plus-class"
                          minus-class="minus-class"
                          custom-class="c-flex c-item-center"
                          @change="numberChange($event, item)"
                        />
                        <van-icon
                          v-else
                          name="add"
                          color="#F9DE55"
                          style="color: #f9de55; font-size: 35px"
                          size="35px"
                          @click="selectorPlus(item)"
                          :data-event="{ id: 'nal8OkG7wT' }"
                        />
                      </view>
                    </view>
                  </block>
                </view>
              </view>
            </view>
          </block>

          <!-- 自定义增项 -->
          <view
            class="c-selected"
            style="border-radius: 5px; margin: 10px; overflow: hidden"
            v-if="addItemCount() > 0"
            :data-event="{ id: '7p0_WkVkhm' }"
          >
            <view class="c-selected-title" :data-event="{ id: '7p0_WkVkhm' }">
              <text :data-event="{ id: '7p0_WkVkhm' }">自定义增项</text>
              <text class="c-size-13" :data-event="{ id: '7p0_WkVkhm' }">
                分类合计：
                <text class="c-red" :data-event="{ id: '7p0_WkVkhm' }">
                  ¥{{ addItems.totalAmount }}
                </text>
              </text>
            </view>
            <view class="c-selected-items" :data-event="{ id: '7p0_WkVkhm' }">
              <block v-for="(item, index) in addItems.data" :key="index">
                <view
                  v-if="item.number > 0"
                  :data-item="item"
                  :data-index="index"
                  class="c-selected-item"
                  :data-event="{ id: '7p0_WkVkhm' }"
                >
                  <van-field
                    :value="item.name"
                    @change="customItemchange($event, item)"
                    required
                    placeholder="请输入自定义增项名称"
                    size="small"
                    class="customItem-input"
                    custom-style="padding-top:0;font-size:12px;"
                  />
                  <view
                    class="c-flex c-flex-between c-flex-center c-flex-wrap"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <view :data-event="{ id: '7p0_WkVkhm' }">
                      <text style="color: #f00; font-size: 14px" :data-event="{ id: '7p0_WkVkhm' }">
                        ¥{{ item.price }}
                      </text>
                      <text class="c-gray c-size-12" :data-event="{ id: '7p0_WkVkhm' }">
                        {{ '/' + codelabel('unit', item.unit) }}
                      </text>
                    </view>
                    <van-stepper
                      v-if="item.number > 0"
                      :value="item.number"
                      integer
                      :min="0"
                      button-size="35"
                      input-class="input-class"
                      plus-class="plus-class"
                      minus-class="minus-class"
                      custom-class="c-flex c-item-center"
                      @change="numberChange($event, item)"
                    />
                    <van-icon
                      v-else
                      name="add"
                      color="#F9DE55"
                      style="color: #f9de55; font-size: 35px"
                      size="35px"
                      @click="selectorPlus(item)"
                      :data-event="{ id: '0WEXU-lmTF' }"
                    />
                  </view>
                </view>
              </block>
            </view>
          </view>
          <!-- 自定义减项 -->
          <view
            class="c-selected"
            style="border-radius: 5px; margin: 10px; overflow: hidden"
            v-if="deleteItemCount() > 0"
            :data-event="{ id: '7p0_WkVkhm' }"
          >
            <view class="c-selected-title" :data-event="{ id: '7p0_WkVkhm' }">
              <text :data-event="{ id: '7p0_WkVkhm' }">自定义减项</text>
              <text class="c-size-13" :data-event="{ id: '7p0_WkVkhm' }">
                分类合计：
                <text class="c-red" :data-event="{ id: '7p0_WkVkhm' }">
                  ¥{{ deleteItems.totalAmount }}
                </text>
              </text>
            </view>
            <view class="c-selected-items" :data-event="{ id: '7p0_WkVkhm' }">
              <block v-for="(item, index) in deleteItems.data" :key="index">
                <view
                  v-if="item.number > 0"
                  :data-item="item"
                  :data-index="index"
                  class="c-selected-item"
                  :data-event="{ id: '7p0_WkVkhm' }"
                >
                  <van-field
                    :value="item.name"
                    @change="customItemchange($event, item)"
                    required
                    placeholder="请输入自定义减项名称"
                    class="customItem-input"
                    custom-style="padding-top:0;font-size:12px;"
                  />
                  <view
                    class="c-flex c-flex-between c-flex-center c-flex-wrap"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <view :data-event="{ id: '7p0_WkVkhm' }">
                      <text style="color: #f00; font-size: 14px" :data-event="{ id: '7p0_WkVkhm' }">
                        ¥{{ item.price }}
                      </text>
                      <text class="c-gray c-size-12" :data-event="{ id: '7p0_WkVkhm' }">
                        {{ '/' + codelabel('unit', item.unit) }}
                      </text>
                    </view>
                    <van-stepper
                      v-if="item.number > 0"
                      :value="item.number"
                      integer
                      :min="0"
                      button-size="35"
                      input-class="input-class"
                      plus-class="plus-class"
                      minus-class="minus-class"
                      custom-class="c-flex c-item-center"
                      @change="numberChange($event, item)"
                    />
                    <van-icon
                      v-else
                      name="add"
                      color="#F9DE55"
                      style="color: #f9de55; font-size: 35px"
                      size="35px"
                      @click="selectorPlus(item)"
                      :data-event="{ id: 'KV3YqAZb2X' }"
                    />
                  </view>
                </view>
              </block>
            </view>
          </view>
        </view>

        <!-- 增减项 -->
        <view
          class="c-flex placeOrder-btn-wrapper"
          v-if="editType != '3'"
          :data-event="{ id: '7p0_WkVkhm' }"
        >
          <view class="c-flex-1" style="margin-right: 5px" :data-event="{ id: '7p0_WkVkhm' }">
            <van-button
              type="default"
              icon="plus"
              custom-style="border-radius:8px;width:100%;color:#0078D0"
              @click="addItem"
              :data-event="{ id: 'MzQ087aVt0' }"
            >
              增项
            </van-button>
          </view>
          <view class="c-flex-1" style="margin-left: 5px" :data-event="{ id: '7p0_WkVkhm' }">
            <van-button
              type="default"
              icon="minus"
              custom-style="border-radius:8px;width:100%;color:#0078D0"
              @click="deleteItem"
              :data-event="{ id: 'UGgbiVfMDn' }"
            >
              减项
            </van-button>
          </view>
        </view>
        <view
          class="c-bg-white"
          v-if="!(editType == 2)"
          :class="!editType || editType <= 1 ? '' : 'c-no-pointer'"
          :data-event="{ id: '7p0_WkVkhm' }"
        >
          <van-cell
            title="折扣"
            :value="commonEvent('codelabel', null, { option: 'discount', value: discount })"
            @click="onClickDiscount"
            is-link
            required
          ></van-cell>
        </view>
        <!-- 优惠金额 -->
        <view
          :class="!editType || editType <= 1 ? '' : 'c-no-pointer'"
          :data-event="{ id: '7p0_WkVkhm' }"
        >
          <van-cell-group>
            <!-- #ifdef MP-WEIXIN -->
            <van-field
              label="优惠金额（元）"
              placeholder="如有优惠需在此输入优惠金额"
              type="digit"
              title-width="150px"
              :value="preferentialAmount"
              :border="false"
              input-align="right"
              v-if="!(editType == 2)"
              input-class="input-class-form"
              class="c-field-preferentialAmount"
              @change="minus"
            ></van-field>
            <!-- #endif -->
            <!-- #ifdef APP-PLUS -->
            <van-cell title="优惠金额（元）" class="c-field-preferentialAmount">
              <input
                placeholder="如有优惠需在此输入优惠金额"
                type="digit"
                title-width="150px"
                :value="preferentialAmount"
                :border="false"
                input-align="right"
                v-if="!(editType == 2)"
                input-class="input-class-form"
                @input="minus"
              />
            </van-cell>
            <!-- #endif -->
          </van-cell-group>
        </view>
      </view>
      <!-- 生成报价 -->
      <van-submit-bar
        button-text="生成报价"
        @submit="submitOrder()"
        bar-class="c-flex c-flex-between"
        v-if="!loading && type == '0'"
        button-class="c-submit-bar-button"
        :data-event="{ id: 'S6_7Z2dCol', capture: false }"
      >
        <view style="font-size: 30rpx" :data-event="{ id: 'S6_7Z2dCol' }">
          <view class="c-flex" :data-event="{ id: 'S6_7Z2dCol' }">
            <text class="c-black" :data-event="{ id: 'S6_7Z2dCol' }">合计：</text>
            <text class="c-red" :data-event="{ id: 'S6_7Z2dCol' }">
              ￥{{ editType == 2 ? amountToFixed(showTotalPrice) : amountToFixed(totalPrice) }}
            </text>
          </view>
        </view>
      </van-submit-bar>
      <!-- 提交订单 生成报价 模拟计算 -->
      <van-submit-bar
        v-else-if="!loading"
        button-text="提交订单"
        @submit="submitOrder()"
        bar-class="c-flex c-flex-between"
        button-class="c-submit-bar-button"
        :data-event="{ id: 'rr1tjirGyM', capture: false }"
      >
        <view style="font-size: 30rpx" :data-event="{ id: 'rr1tjirGyM' }">
          <view class="c-flex" :data-event="{ id: 'rr1tjirGyM' }">
            <text class="c-black" :data-event="{ id: 'rr1tjirGyM' }">合计：</text>
            <text class="c-red" :data-event="{ id: 'rr1tjirGyM' }">
              ￥{{ editType == 2 ? amountToFixed(showTotalPrice) : amountToFixed(totalPrice) }}
            </text>
          </view>
        </view>
      </van-submit-bar>

      <!-- 选择套餐、工艺、材料、机措 -->
      <van-popup
        :show="selectorShow"
        position="bottom"
        custom-style="height: 100%;overflow: hidden;display:flex;flex-direction:column"
        @close="onSelectionClose"
        custom-class="c-flex"
        :safe-area-inset-bottom="false"
      >
        <van-nav-bar
          title="请选择"
          left-text="返回"
          right-text="确认"
          left-arrow
          @click-left="onSelectionClose"
          @click-right="onSelectionClose"
        />
        <van-search
          v-if="orderList[orderIndex] && activeTab == 'projPackage'"
          :value="orderList[orderIndex].projPackages.searchValue"
          @change="onSearch($event, 'projPackages')"
          placeholder="请输入套餐名称"
          use-action-slot
          custom-class="search"
        >
          <view slot="action" class="search-button" :data-event="{ id: '7p0_WkVkhm' }">搜索</view>
        </van-search>
        <van-search
          v-if="orderList[orderIndex] && activeTab == 'procedure'"
          :value="orderList[orderIndex].procedures.searchValue"
          @change="onSearch($event, 'procedures')"
          placeholder="请输入工序名称"
          use-action-slot
          custom-class="search"
        >
          <view slot="action" class="search-button" :data-event="{ id: '7p0_WkVkhm' }">搜索</view>
        </van-search>
        <van-search
          v-if="orderList[orderIndex] && activeTab == 'material'"
          :value="orderList[orderIndex].materials.searchValue"
          @change="onSearch($event, 'materials')"
          placeholder="请输入材料名称或编号"
          use-action-slot
          custom-class="search"
        >
          <view slot="action" class="search-button" :data-event="{ id: '7p0_WkVkhm' }">搜索</view>
        </van-search>
        <van-search
          v-if="orderList[orderIndex] && activeTab == 'measure'"
          :value="orderList[orderIndex].measures.searchValue"
          @change="onSearch($event, 'measures')"
          placeholder="请输入机措名称"
          use-action-slot
          custom-class="search"
        >
          <view slot="action" class="search-button" :data-event="{ id: '7p0_WkVkhm' }">搜索</view>
        </van-search>
        <van-tabs
          :active="activeTab"
          @change="tabChange"
          title-active-color="#106CFF"
          :data-event="{ id: '9KbHtOvL_t', capture: false }"
        >
          <van-tab
            title="套餐"
            name="projPackage"
            :info="projPackageCount() > 0 ? projPackageCount() : ''"
          ></van-tab>
          <van-tab
            title="工序"
            name="procedure"
            :info="procedureCount() > 0 ? procedureCount() : ''"
          ></van-tab>
          <van-tab
            title="材料"
            name="material"
            :info="materialCount() > 0 ? materialCount() : ''"
          ></van-tab>
          <van-tab
            title="机措"
            name="measure"
            :info="measureCount() > 0 ? measureCount() : ''"
          ></van-tab>
        </van-tabs>
        <view class="c-content" v-if="orderList.length > 0" :data-event="{ id: '7p0_WkVkhm' }">
          <!-- 套餐 -->
          <view
            class="c-selection c-h-100"
            v-if="orderList[orderIndex] && activeTab == 'projPackage'"
            :data-event="{ id: '7p0_WkVkhm' }"
          >
            <view class="c-selection-left" :data-event="{ id: '7p0_WkVkhm' }">
              <view
                v-for="(item, index) in options.filterParts"
                :key="index"
                @click="handleFilterPartSelection(orderIndex, item)"
                :class="
                  'c-selection-left-item ' +
                  (orderList[orderIndex].projPackages.filterPart == item.value
                    ? 'c-bg-white c-left-icon-blue'
                    : '')
                "
                :data-event="{ id: 'vguDzahZhp' }"
              >
                {{ item.name }}
                <text
                  class="c-selection-left-item-tag"
                  v-if="projPackageTypeCount(item.value) > 0"
                  :data-event="{ id: 'vguDzahZhp' }"
                >
                  {{ projPackageTypeCount(item.value) }}
                </text>
              </view>
            </view>
            <view class="c-selection-right c-flex-1 c-hidden-x" :data-event="{ id: '7p0_WkVkhm' }">
              <view class="agelimit-tags" :data-event="{ id: '7p0_WkVkhm' }">
                <view
                  v-for="(item, index) in options.agelimitFilter"
                  :key="index"
                  @click="
                    orderList[orderIndex].projPackages.agelimit === item.value
                      ? $set(orderList[orderIndex].projPackages, 'agelimit', '')
                      : $set(orderList[orderIndex].projPackages, 'agelimit', item.value)
                  "
                  :class="
                    orderList[orderIndex].projPackages.agelimit == item.value
                      ? 'agelimit-tag agelimit-tag-active'
                      : 'agelimit-tag'
                  "
                  :data-event="{ id: '_Suz8HDCTR' }"
                >
                  {{ item.name }}
                </view>
              </view>
              <view
                class="c-flex-1 c-auto-y"
                style="padding-bottom: 30px"
                :data-event="{ id: '7p0_WkVkhm' }"
              >
                <block
                  v-for="(item, index) in orderList[orderIndex].projPackages.data"
                  :key="index"
                >
                  <view
                    :data-item="item"
                    :data-index="index"
                    v-if="
                      (orderList[orderIndex].projPackages.searchValue
                        ? item.name &&
                          item.name.indexOf(orderList[orderIndex].projPackages.searchValue) != -1
                        : true) &&
                      (!orderList[orderIndex].projPackages.filterPart ||
                        (serviceType == '11' || serviceType == '12' || serviceType == '40'
                          ? item.exts &&
                            item.exts.repairParts &&
                            item.exts.repairParts.indexOf(
                              `&quot;${orderList[orderIndex].projPackages.filterPart}&quot;`
                            ) != -1
                          : item.exts &&
                            item.exts.constructionParts &&
                            item.exts.constructionParts.indexOf(
                              `&quot;${orderList[orderIndex].projPackages.filterPart}&quot;`
                            ) != -1)) &&
                      (!orderList[orderIndex].projPackages.agelimit ||
                        orderList[orderIndex].projPackages.agelimit == item.agelimit)
                    "
                    class="c-selection-right-item"
                    style="padding-right: 16px"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <image
                      :src="
                        (item.exts.images && item.exts.images[0] && item.exts.images[0].url) ||
                        'https://pub.fsgo365.cn/logo_square.png'
                      "
                      class="c-selection-right-item-image"
                      @click="
                        previewImage(
                          (item.exts.images && item.exts.images[0] && item.exts.images[0].url) ||
                            'https://pub.fsgo365.cn/logo_square.png'
                        )
                      "
                      :data-event="{ id: 'Gvy-b0qD0f' }"
                    />
                    <view class="c-selection-right-item-content" :data-event="{ id: '7p0_WkVkhm' }">
                      <!-- style="margin: 10rpx 0 20rpx" -->
                      <view :data-event="{ id: '7p0_WkVkhm' }">
                        <view class="c-size-14 c-ellipsis2" :data-event="{ id: '7p0_WkVkhm' }">
                          {{ item.name }}
                        </view>
                        <view
                          v-if="item.desc"
                          class="desc"
                          @click="toViewDescription(item.desc)"
                          :data-event="{ id: '3T3EPsmia4' }"
                        >
                          描述：{{ item.desc }}
                        </view>
                        <view
                          class="c-flex"
                          style="margin: 4px 0"
                          :data-event="{ id: '7p0_WkVkhm' }"
                        >
                          <text class="desc-tag c-m-l-0" :data-event="{ id: '7p0_WkVkhm' }">
                            {{ codelabel('packageType', item.type) }}
                          </text>
                          <text
                            class="desc-tag"
                            v-if="item.minimumPrice"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          >
                            最低起算价：¥{{ item.minimumPrice }}
                          </text>
                        </view>
                        <!-- <view class="c-m-t-10" :data-event="{id:'7p0_WkVkhm'}">
                      <van-button
                        v-if="item.procedureList.length > 0"
                        plain
                        hairline
                        type="info"
                        size="mini"
                        @click="openProcedures(item.procedureList)"
                        class="c-m-r-10" :data-event="{id:'EQk1dUC685'}">
                        查看工序
                      </van-button>
                      <van-button
                        v-if="item.materialList.length > 0"
                        plain
                        hairline
                        type="info"
                        size="mini"
                        @click="openMaterials(item.materialList)" :data-event="{id:'8w9mbC95g-'}">
                        查看材料
                      </van-button>
                    </view> -->
                      </view>
                      <view
                        class="c-flex c-flex-between c-flex-center c-flex-wrap"
                        :data-event="{ id: '7p0_WkVkhm' }"
                      >
                        <view :data-event="{ id: '7p0_WkVkhm' }">
                          <text
                            style="color: #f00; font-size: 14px"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          >
                            ¥{{ item.amount }}
                          </text>
                          <text class="c-size-10 c-m-l-5" :data-event="{ id: '7p0_WkVkhm' }">
                            起
                          </text>
                          <text
                            class="c-size-10"
                            v-if="item.unit"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          >
                            {{ '/' + codelabel('unit', item.unit) }}
                          </text>
                        </view>
                        <view class="c-relative" :data-event="{ id: '7p0_WkVkhm' }">
                          <van-button
                            custom-class="c-spec-button"
                            round
                            @click="openPackage(item, index)"
                            :data-event="{ id: 'TzE5gYczEq' }"
                          >
                            选规格
                          </van-button>
                          <view
                            class="c-spec-tag"
                            v-if="item.number > 0"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          >
                            {{ item.number }}
                          </view>
                        </view>
                        <!-- <view class="c-relative" v-if="item.exts.pricingMethod == '1' || true" :data-event="{id:'7p0_WkVkhm'}">
                      <van-button custom-class="c-spec-button" round @click="openPackageSpec(item)" :data-event="{id:'E4mudWBt7-'}">
                        选规格
                      </van-button>
                      <view class="c-spec-tag" v-if="item.number > 0" :data-event="{id:'7p0_WkVkhm'}">
                        {{ item.number }}
                      </view>
                    </view>
                    <block v-else>
                      <van-stepper
                        v-if="item.number > 0"
                        :value="item.number"
                        :min="0"
                        button-size="35"
                        input-class="input-class"
                        plus-class="plus-class"
                        minus-class="minus-class"
                        custom-class="c-flex c-item-center"
                        @change="numberChange($event, item)"
                      />
                      <van-icon
                        v-else
                        name="add"
                        color="#F9DE55"
                        style="color:#F9DE55;font-size:35px;"
                        size="35px"
                        @click="selectorPlus(item, 'projPackages')" :data-event="{id:'aRSTkfB4HO'}" />
                    </block> -->
                      </view>
                    </view>
                  </view>
                </block>
              </view>
            </view>
          </view>
          <!-- 工序 -->
          <view
            class="c-selection c-h-100"
            v-if="orderList[orderIndex] && activeTab == 'procedure'"
            :data-event="{ id: '7p0_WkVkhm' }"
          >
            <view class="c-selection-left" :data-event="{ id: '7p0_WkVkhm' }">
              <view
                v-for="(item, index) in options.filterParts"
                :key="index"
                @click="
                  orderList[orderIndex].procedures.filterPart === item.value
                    ? $set(orderList[orderIndex].procedures, 'filterPart', '')
                    : $set(orderList[orderIndex].procedures, 'filterPart', item.value)
                "
                :class="
                  'c-selection-left-item ' +
                  (orderList[orderIndex].procedures.filterPart == item.value
                    ? 'c-bg-white c-left-icon-blue'
                    : '')
                "
                :data-event="{ id: 'mjX_yCeTPA' }"
              >
                {{ item.name }}
                <text
                  class="c-selection-left-item-tag"
                  v-if="procedureTypeCount(item.value) > 0"
                  :data-event="{ id: 'mjX_yCeTPA' }"
                >
                  {{ procedureTypeCount(item.value) }}
                </text>
              </view>
            </view>
            <view class="c-selection-right c-flex-1 c-hidden-x" :data-event="{ id: '7p0_WkVkhm' }">
              <block v-for="(item, index) in orderList[orderIndex].procedures.data" :key="index">
                <view
                  :data-item="item"
                  :data-index="index"
                  v-if="
                    (orderList[orderIndex].procedures.searchValue
                      ? item.content &&
                        item.content.indexOf(orderList[orderIndex].procedures.searchValue) != -1
                      : true) &&
                    (!orderList[orderIndex].procedures.filterPart ||
                      (serviceType == '11' || serviceType == '12' || serviceType == '40'
                        ? item.exts &&
                          item.exts.repairParts &&
                          item.exts.repairParts.indexOf(
                            `&quot;${orderList[orderIndex].procedures.filterPart}&quot;`
                          ) != -1
                        : item.exts &&
                          item.exts.constructionParts &&
                          item.exts.constructionParts.indexOf(
                            `&quot;${orderList[orderIndex].procedures.filterPart}&quot;`
                          ) != -1))
                  "
                  class="c-selection-right-item"
                  :data-event="{ id: '7p0_WkVkhm' }"
                >
                  <image
                    :src="
                      (item.exts.images && item.exts.images[0] && item.exts.images[0].url) ||
                      'https://pub.fsgo365.cn/logo_square.png'
                    "
                    class="c-selection-right-item-image"
                    @click="
                      previewImage(
                        (item.exts.images && item.exts.images[0] && item.exts.images[0].url) ||
                          'https://pub.fsgo365.cn/logo_square.png'
                      )
                    "
                    :data-event="{ id: 'Ums6ngKZup' }"
                  />
                  <view class="c-selection-right-item-content" :data-event="{ id: '7p0_WkVkhm' }">
                    <view :data-event="{ id: '7p0_WkVkhm' }">
                      <view class="c-size-14 c-ellipsis2" :data-event="{ id: '7p0_WkVkhm' }">
                        {{ item.name }}
                      </view>
                      <view
                        v-if="item.desc"
                        class="desc"
                        @click="toViewDescription(item.desc)"
                        :data-event="{ id: '8Xcu0PkOeQ' }"
                      >
                        描述：{{ item.desc }}
                      </view>
                      <view class="c-flex" style="margin: 4px 0" :data-event="{ id: '7p0_WkVkhm' }">
                        <text
                          class="desc-tag c-m-l-0"
                          v-if="item.minimumGuideTotalPrice"
                          :data-event="{ id: '7p0_WkVkhm' }"
                        >
                          最低起算价：¥{{ item.minimumGuideTotalPrice }}
                        </text>
                      </view>
                    </view>

                    <view
                      class="c-flex c-flex-between c-flex-center c-flex-wrap"
                      :data-event="{ id: '7p0_WkVkhm' }"
                    >
                      <view :data-event="{ id: '7p0_WkVkhm' }">
                        <text
                          style="color: #f00; font-size: 14px"
                          :data-event="{ id: '7p0_WkVkhm' }"
                        >
                          ¥{{ item.guideUnitPrice }}
                        </text>
                        <text class="c-m-l-5 c-size-10" :data-event="{ id: '7p0_WkVkhm' }">
                          {{ '/' + codelabel('unit', item.unit) }}
                        </text>
                      </view>
                      <van-stepper
                        v-if="item.number > 0"
                        :value="item.number"
                        :min="0"
                        button-size="35"
                        input-class="input-class"
                        plus-class="plus-class"
                        minus-class="minus-class"
                        custom-class="c-flex c-item-center"
                        @change="numberChange($event, item)"
                      />
                      <van-icon
                        v-else
                        name="add"
                        color="#F9DE55"
                        style="color: #f9de55; font-size: 35px"
                        size="35px"
                        @click="selectorPlus(item, 'procedures')"
                        :data-event="{ id: 'whKdxbkgBx' }"
                      />
                    </view>
                  </view>
                </view>
              </block>
            </view>
          </view>
          <!-- 材料 -->
          <view
            class="c-selection c-h-100"
            v-if="orderList[orderIndex] && activeTab == 'material'"
            :data-event="{ id: '7p0_WkVkhm' }"
          >
            <view class="c-selection-left" :data-event="{ id: '7p0_WkVkhm' }">
              <view
                v-for="(item, index) in options.materialType"
                :key="index"
                @click="
                  orderList[orderIndex].materials.type === item.value
                    ? $set(orderList[orderIndex].materials, 'type', '')
                    : $set(orderList[orderIndex].materials, 'type', item.value)
                "
                :class="
                  'c-selection-left-item ' +
                  (orderList[orderIndex].materials.type == item.value
                    ? 'c-bg-white c-left-icon-blue'
                    : '')
                "
                :data-event="{ id: 'yjcfmAdEAL' }"
              >
                {{ item.name }}
                <text
                  class="c-selection-left-item-tag"
                  v-if="materialTypeCount(item.value) > 0"
                  :data-event="{ id: 'yjcfmAdEAL' }"
                >
                  {{ materialTypeCount(item.value) }}
                </text>
              </view>
            </view>
            <view class="c-selection-right c-flex-1 c-hidden-x" :data-event="{ id: '7p0_WkVkhm' }">
              <block v-for="(item, index) in orderList[orderIndex].materials.data" :key="index">
                <block
                  v-if="
                    orderList[orderIndex].materials.searchValue
                      ? (item.name &&
                          item.name.indexOf(orderList[orderIndex].materials.searchValue) != -1) ||
                        (item.code &&
                          item.code.indexOf(orderList[orderIndex].materials.searchValue) != -1)
                      : true
                  "
                >
                  <view
                    :data-item="item"
                    :data-index="index"
                    v-if="
                      !orderList[orderIndex].materials.type ||
                      orderList[orderIndex].materials.type == item.type
                    "
                    class="c-selection-right-item"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <image
                      :src="
                        (item.images[0] && item.images[0].url) ||
                        'https://pub.fsgo365.cn/logo_square.png'
                      "
                      class="c-selection-right-item-image"
                      @click="
                        previewImage(
                          (item.images[0] && item.images[0].url) ||
                            'https://pub.fsgo365.cn/logo_square.png'
                        )
                      "
                      :data-event="{ id: 'G50xJyECnp' }"
                    />
                    <view class="c-selection-right-item-content" :data-event="{ id: '7p0_WkVkhm' }">
                      <view :data-event="{ id: '7p0_WkVkhm' }">
                        <view class="c-size-14 c-ellipsis2" :data-event="{ id: '7p0_WkVkhm' }">
                          {{ item.name }}
                        </view>
                        <view
                          class="c-flex c-flex-wrap"
                          style="margin: 4px 0"
                          :data-event="{ id: '7p0_WkVkhm' }"
                        >
                          <text
                            class="desc-tag c-m-l-0"
                            v-if="item.spec"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          >
                            规格：{{ item.spec || ''
                            }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
                          </text>
                          <!-- <text class="desc-tag" v-if="item.model" :data-event="{id:'7p0_WkVkhm'}">型号：{{ item.model || '' }}</text> -->
                          <text
                            v-if="item.desc"
                            class="desc-tag"
                            @click="openMaterialDetail(item.name, item.desc)"
                            :data-event="{ id: '6rDtBwLYgN' }"
                          >
                            查看材料
                          </text>
                        </view>
                      </view>
                      <view
                        class="c-flex c-flex-between c-flex-center c-flex-wrap c-m-l-10"
                        :data-event="{ id: '7p0_WkVkhm' }"
                      >
                        <view :data-event="{ id: '7p0_WkVkhm' }">
                          <text
                            style="color: #f00; font-size: 14px"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          >
                            ¥{{ item.price }}
                          </text>
                          <text class="c-m-l-5 c-size-10" :data-event="{ id: '7p0_WkVkhm' }">
                            {{ '/' + codelabel('unit', item.materialUnit) }}
                          </text>
                        </view>
                        <view
                          v-if="specButtonShow(item)"
                          class="c-relative"
                          :data-event="{ id: '7p0_WkVkhm' }"
                        >
                          <van-button
                            custom-class="c-spec-button"
                            round
                            @click="openSpec(item)"
                            :data-event="{ id: '-YsXCGWGSl' }"
                          >
                            选规格
                          </van-button>
                          <view
                            class="c-spec-tag"
                            v-if="item.skus && item.skus.length > 0 && item.number > 0"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          >
                            {{ item.number }}
                          </view>
                        </view>
                        <view v-else :data-event="{ id: '7p0_WkVkhm' }">
                          <van-stepper
                            v-if="item.number > 0"
                            :value="item.number"
                            integer
                            :min="0"
                            button-size="35"
                            input-class="input-class"
                            plus-class="plus-class"
                            minus-class="minus-class"
                            custom-class="c-flex c-item-center"
                            @change="numberChange($event, item)"
                          />
                          <van-icon
                            v-else
                            name="add"
                            color="#F9DE55"
                            style="color: #f9de55; font-size: 35px"
                            size="35px"
                            @click="selectorPlus(item)"
                            :data-event="{ id: 'Ki1yQhJrGG' }"
                          />
                        </view>
                      </view>
                    </view>
                  </view>
                </block>
              </block>
            </view>
          </view>
          <!-- 机措 -->
          <view
            class="c-selection c-h-100"
            v-if="orderList[orderIndex] && activeTab == 'measure'"
            :data-event="{ id: '7p0_WkVkhm' }"
          >
            <view class="c-selection-right c-flex-1 c-hidden-x" :data-event="{ id: '7p0_WkVkhm' }">
              <block v-for="(item, index) in orderList[orderIndex].measures.data" :key="index">
                <view
                  v-if="
                    orderList[orderIndex].measures.searchValue
                      ? item.content &&
                        item.content.indexOf(orderList[orderIndex].measures.searchValue) != -1
                      : true
                  "
                  :data-item="item"
                  :data-index="index"
                  class="c-selection-right-item"
                  :data-event="{ id: '7p0_WkVkhm' }"
                >
                  <image
                    :src="
                      (item.exts.images && item.exts.images[0] && item.exts.images[0].url) ||
                      'https://pub.fsgo365.cn/logo_square.png'
                    "
                    class="c-selection-right-item-image"
                    @click="
                      previewImage(
                        (item.exts.images && item.exts.images[0] && item.exts.images[0].url) ||
                          'https://pub.fsgo365.cn/logo_square.png'
                      )
                    "
                    :data-event="{ id: 'b_AOSfpEvQ' }"
                  />
                  <view class="c-selection-right-item-content" :data-event="{ id: '7p0_WkVkhm' }">
                    <view :data-event="{ id: '7p0_WkVkhm' }">
                      <view class="c-size-14 c-ellipsis2" :data-event="{ id: '7p0_WkVkhm' }">
                        {{ item.content }}
                      </view>
                      <view
                        class="desc"
                        v-if="item.desc"
                        @click="toViewDescription(item.desc)"
                        :data-event="{ id: 'q-0_4cqpLq' }"
                      >
                        描述：{{ item.desc }}
                      </view>
                    </view>
                    <view
                      class="c-flex c-flex-between c-flex-center c-flex-wrap"
                      :data-event="{ id: '7p0_WkVkhm' }"
                    >
                      <view :data-event="{ id: '7p0_WkVkhm' }">
                        <text
                          style="color: #f00; font-size: 14px"
                          :data-event="{ id: '7p0_WkVkhm' }"
                        >
                          ¥{{ item.guideUnitPrice }}
                        </text>
                        <text class="c-m-l-5 c-size-10" :data-event="{ id: '7p0_WkVkhm' }">
                          {{ '/' + codelabel('unit', item.unit) }}
                        </text>
                      </view>
                      <van-stepper
                        v-if="item.number > 0"
                        :value="item.number"
                        integer
                        :min="0"
                        button-size="35"
                        input-class="input-class"
                        plus-class="plus-class"
                        minus-class="minus-class"
                        custom-class="c-flex c-item-center"
                        @change="numberChange($event, item)"
                      />
                      <van-icon
                        v-else
                        name="add"
                        color="#F9DE55"
                        style="color: #f9de55; font-size: 35px"
                        size="35px"
                        @click="selectorPlus(item)"
                        :data-event="{ id: 'MBrEBgneRD' }"
                      />
                    </view>
                  </view>
                </view>
              </block>
            </view>
          </view>
        </view>
      </van-popup>

      <!-- 表单弹出层 -->
      <van-popup :show="openForm" position="bottom" round custom-style="height: 90%;">
        <view class="c-popup" :data-event="{ id: '7p0_WkVkhm' }">
          <van-nav-bar
            custom-class="c-size-16 c-nav-bar"
            title="下单详细信息"
            left-text="取消"
            @click-left="closeForm"
          >
            <van-button
              type="info"
              plain
              slot="right"
              @click="placeOrder(1)"
              custom-class="c-border-n"
              :data-event="{ id: 'gGu_KS309K' }"
            >
              提交
            </van-button>
          </van-nav-bar>
          <!-- :class="!editType || editType<=1 ?'c-popup-cells-form':'c-popup-cells-form c-no-pointer'" -->
          <van-cell-group class="c-popup-cells">
            <view
              style="overflow-y: none"
              :class="!editType || editType <= 1 ? '' : 'c-no-pointer'"
              :data-event="{ id: '7p0_WkVkhm' }"
            >
              <block v-for="(extField, index) in submitOrderFields" :key="index">
                <block v-if="extField.type == 'phone' || extField.type == 'IDNumber'">
                  <van-field
                    :label="extField.nameDisp"
                    :value="formData[extField.name]"
                    @change="onChange"
                    :required="extField.required == '1'"
                    :data-extfield="extField"
                    input-align="right"
                  ></van-field>
                </block>
                <block v-else-if="extField.type == 'textarea'">
                  <van-field
                    :label="extField.nameDisp"
                    :value="formData[extField.name]"
                    @change="onChange"
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
                      :checked="formData[extField.name]"
                      @change="onChange"
                      :data-extfield="extField"
                      active-value="1"
                      inactive-value="0"
                      :size="extField.frontEndConfig.size || '24px'"
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
                  <van-cell
                    :title="extField.nameDisp"
                    :value="formData[extField.name]"
                    @click="onClick"
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
                        value: formData[extField.name]
                      })
                    "
                    @click="onClick"
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
                        value: formData[extField.name]
                      })
                    "
                    @click="onClick"
                    :data-extfield="extField"
                    :required="extField.required == '1'"
                  ></van-cell>
                </block>
                <block v-else-if="extField.type == 'radio'">
                  <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                    <van-radio-group
                      :value="formData[extField.name]"
                      @change="onChange"
                      :data-extfield="extField"
                      class="c-radio-group c-rt"
                    >
                      <van-radio
                        checked-color="#0078d0"
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
                  <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                    <van-checkbox-group
                      :value="formData[extField.name]"
                      @change="onChange"
                      :data-extfield="extField"
                      class="c-checkbox-group"
                    >
                      <van-checkbox
                        v-for="(item, i) in options[extField.valueOption]"
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
                      :value="formData[extField.name]"
                      @change="onChange"
                      :data-extfield="extField"
                    ></van-rate>
                  </van-cell>
                </block>
                <block v-else-if="extField.type == 'file'">
                  <view
                    class="c-cell-view c-flex c-flex-between"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <view class="c-cell_title" :data-event="{ id: '7p0_WkVkhm' }">
                      <span class="c-required" v-if="extField.required == '1'">*</span>
                      {{ extField.nameDisp }}
                    </view>
                    <view class="c-cell_value" :data-event="{ id: '7p0_WkVkhm' }">
                      （{{ (formData[extField.name] && formData[extField.name].length) || 0 }}
                      /
                      {{
                        extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                          ? extField.frontEndConfig.max
                          : '不限'
                      }}）
                    </view>
                  </view>
                  <view class="c-cell-view" :data-event="{ id: '7p0_WkVkhm' }">
                    <van-uploader
                      style="display: flex"
                      multiple
                      :upload-text="
                        extField.frontEndConfig ? extField.frontEndConfig.uploadText : ''
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
                    />
                  </view>
                </block>
                <block v-else-if="extField.type == 'title'">
                  <view
                    class="c-cell-headline"
                    v-html="
                      (extField.frontEndConfig && extField.frontEndConfig.html) || extField.nameDisp
                    "
                    :data-event="{ id: '7p0_WkVkhm' }"
                  ></view>
                </block>
                <block v-else-if="extField.type == 'gap'">
                  <view
                    class="c-cell-gap"
                    v-html="
                      (extField.frontEndConfig && extField.frontEndConfig.html) || extField.nameDisp
                    "
                    :data-event="{ id: '7p0_WkVkhm' }"
                  ></view>
                </block>
                <block v-else-if="extField.type == 'area'">
                  <!-- #ifdef MP-WEIXIN -->
                  <van-cell
                    v-if="formData[extField.name] && formData[extField.name].length > 0"
                    :title="extField.nameDisp"
                    :value="
                      area.areaList.province_list[formData[extField.name][0]] +
                      area.areaList.city_list[formData[extField.name][1]] +
                      area.areaList.county_list[formData[extField.name][2]]
                    "
                    @click="onClick"
                    :data-extfield="extField"
                    is-link
                    :required="extField.required == '1'"
                  />
                  <!-- #endif -->
                  <!-- #ifdef APP-PLUS -->
                  <van-cell
                    :key="extField._id"
                    :title="extField.nameDisp"
                    :data-extfield="extField"
                    :required="extField.required == '1'"
                  >
                    <uni-data-picker
                      class="c-uni-data-picker-right"
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
                      @change="areaConfirm($event, extField.name)"
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
                    :data-event="{ id: 'eAkSHvdM_M' }"
                  >
                    {{ extField.nameDisp }}
                  </van-button>
                </block>
                <block v-else-if="extField.type == 'scan'">
                  <view
                    class="c-flex c-flex c-flex-between c-item-center c-bg-white c-cell-view"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <view class="c-cell_title" :data-event="{ id: '7p0_WkVkhm' }">
                      <text
                        class="c-required"
                        v-if="extField.required == '1'"
                        :data-event="{ id: '7p0_WkVkhm' }"
                      >
                        *
                      </text>
                      {{ extField.nameDisp }}
                    </view>
                    <van-button
                      :plain="extField.frontEndConfig.plain"
                      :type="extField.frontEndConfig.type"
                      :color="extField.frontEndConfig.color"
                      :icon="extField.frontEndConfig.icon"
                      :size="extField.frontEndConfig.size || 'small'"
                      @click="commonEvent('scan', extField.name, extField.frontEndConfig)"
                      :data-event="{ id: 'pZzp87h47n' }"
                    >
                      {{ extField.frontEndConfig.buttonName }}
                    </van-button>
                  </view>
                </block>
                <block v-else-if="extField.type == 'addItem'">
                  <view
                    class="c-cell-view c-flex c-flex-between"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <view :data-event="{ id: '7p0_WkVkhm' }">
                      <text
                        class="c-required"
                        v-if="extField.required == '1'"
                        :data-event="{ id: '7p0_WkVkhm' }"
                      >
                        *
                      </text>
                      {{ extField.nameDisp }}
                    </view>
                    <van-button
                      @click="commonEvent('addItem', extField.name, extField.frontEndConfig)"
                      :plain="extField.frontEndConfig.plain"
                      :type="extField.frontEndConfig.type"
                      :color="extField.frontEndConfig.color"
                      :icon="extField.frontEndConfig.icon"
                      :size="extField.frontEndConfig.size || 'small'"
                      :data-event="{ id: '882e8fiJD7' }"
                    >
                      {{ extField.frontEndConfig.buttonName }}
                    </van-button>
                  </view>
                  <view
                    class="c-cell-view"
                    style="border-bottom: 1px solid #ebedf0"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <block v-for="(item, i) in formData[extField.name]" :key="i">
                      <van-tag
                        @close="tagClose(extField.name, i)"
                        round
                        type="primary"
                        size="large"
                        custom-class="c-m-10"
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
                        :data-event="{ id: 'pI91su6RNP' }"
                      >
                        {{ extField.frontEndConfig.buttonName }}
                      </van-button>
                    </van-field>
                  </van-cell-group>
                </block>
                <block v-else-if="extField.type == 'bgImage'"></block>
                <!-- 按类别展示 -->
                <block v-else-if="extField.type == 'sort'">
                  <view v-if="extField.frontEndConfig.showName" :data-event="{ id: '7p0_WkVkhm' }">
                    {{ extField.name }}
                  </view>
                  <van-cell-group :border="false">
                    <view
                      v-for="(item, key) in formData[extField.name]"
                      :key="key"
                      class="c-cell-view c-flex c-flex-between"
                      style="padding: 10px 25px"
                      :data-event="{ id: '7p0_WkVkhm' }"
                    >
                      <view :data-event="{ id: '7p0_WkVkhm' }">
                        {{
                          commonEvent('codelabel', null, {
                            option: extField.option,
                            value: key
                          })
                        }}
                      </view>
                      <view :data-event="{ id: '7p0_WkVkhm' }">
                        <text :data-event="{ id: '7p0_WkVkhm' }">{{ item.length }}</text>
                        <text :data-event="{ id: '7p0_WkVkhm' }">
                          {{ extField.frontEndConfig.unit }}
                        </text>
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
                    :required="extField.required == '1'"
                    input-align="right"
                  ></van-field>
                </block>

                <block v-else-if="extField.type == 'stepper'">
                  <view
                    class="van-cell van-cell--center"
                    :class="extField.required == '1' ? 'van-cell--required' : ''"
                    :style="extField.required == '1' ? 'padding-left: 16rpx;' : ''"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <view class="van-cell__title c-flex-1" :data-event="{ id: '7p0_WkVkhm' }">
                      {{ extField.nameDisp }}
                    </view>

                    <view class="van-cell__value c-flex-1" :data-event="{ id: '7p0_WkVkhm' }">
                      <van-stepper
                        :value="formData[extField.name]"
                        :min="extField.frontEndConfig ? extField.frontEndConfig.min : 1"
                        :max="extField.frontEndConfig ? extField.frontEndConfig.max : 1"
                        @change="onChange"
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
                    :value="formData[extField.name]"
                    @change="onChange"
                    @blur="onBlur"
                    :data-extfield="extField"
                    :type="extField.type"
                    :required="extField.required == '1'"
                    input-align="right"
                    input-class="input-class-form"
                    :placeholder="
                      (extField.frontEndConfig && extField.frontEndConfig.placeholder) || ''
                    "
                  ></van-field>
                </block>
              </block>
            </view>
          </van-cell-group>
        </view>
      </van-popup>

      <!-- 增减项修改  -->
      <van-dialog
        use-slot
        title="操作"
        :show="increaseDecreaseShow"
        show-cancel-button
        @close="increaseDecreaseOnClose"
        @confirm="increaseDecreaseConfirm"
        :data-event="{ id: 'S5i1UTh-xU', capture: false }"
      >
        <view class="popupWindow" :data-event="{ id: '7p0_WkVkhm' }">
          <van-icon name="info-o" :data-event="{ id: '7p0_WkVkhm' }" />
          <text class="c-m-l-10" :data-event="{ id: '7p0_WkVkhm' }">
            减少的细项会在列表最下边展示
          </text>
        </view>
        <view class="c-p-20 c-flex c-flex-center" :data-event="{ id: '7p0_WkVkhm' }">
          <van-stepper
            :value="increaseDecreaseNum"
            :max="increaseDecreaseMax"
            @change="increaseDecreaseNumChange"
            custom-class="c-flex c-item-center"
          />
        </view>
      </van-dialog>

      <!-- 折扣选择 -->
      <van-action-sheet
        :show="discountSheet.show"
        :actions="discountSheet.actions"
        @close="discountClose"
        @select="discountSelect"
      ></van-action-sheet>

      <!-- 展示套餐工序  -->
      <van-dialog
        title="套餐包含的工序"
        :show="projPackages.openProcedures"
        use-slot
        @confirm="projPackages.openProcedures = false"
        :data-event="{ id: '0MjAkskhAZ', capture: false }"
      >
        <view
          class="dialog-detail"
          v-for="(item, i) in projPackages.currentProcedures"
          :key="i"
          :data-event="{ id: '7p0_WkVkhm' }"
        >
          <view :data-event="{ id: '7p0_WkVkhm' }">服务内容：{{ item.procedure.content }}</view>
          <view v-if="item.procedure.minimumGuideTotalPrice" :data-event="{ id: '7p0_WkVkhm' }">
            最低起算价：¥{{ item.procedure.minimumGuideTotalPrice }}
          </view>
          <view :data-event="{ id: '7p0_WkVkhm' }">
            单价： ¥{{ item.procedure.guideUnitPrice }}/{{ codelabel('unit', item.procedure.unit) }}
          </view>
        </view>
      </van-dialog>

      <!-- 展示套餐材料  -->
      <van-dialog
        title="套餐包含的材料"
        :show="projPackages.openMaterials"
        use-slot
        @confirm="projPackages.openMaterials = false"
        :data-event="{ id: 'x6rW6hertv', capture: false }"
      >
        <view
          class="dialog-detail"
          v-for="(item, i) in projPackages.currentMaterials"
          :key="i"
          :data-event="{ id: '7p0_WkVkhm' }"
        >
          <view :data-event="{ id: '7p0_WkVkhm' }">名称：{{ item.material.name }}</view>
          <view :data-event="{ id: '7p0_WkVkhm' }">
            <view :data-event="{ id: '7p0_WkVkhm' }">
              类型：{{ codelabel('materialType', String(item.material.type)) }}
            </view>
          </view>
          <view :data-event="{ id: '7p0_WkVkhm' }">
            <view :data-event="{ id: '7p0_WkVkhm' }">编号：{{ item.material.code || '' }}</view>
            <view :data-event="{ id: '7p0_WkVkhm' }">型号：{{ item.material.model || '' }}</view>
          </view>
          <view :data-event="{ id: '7p0_WkVkhm' }">
            <view :data-event="{ id: '7p0_WkVkhm' }">
              规格：{{ item.material.spec || ''
              }}{{ item.material.specUnit ? codelabel('unit', item.material.specUnit) : '' }}
            </view>
            <view :data-event="{ id: '7p0_WkVkhm' }">
              单价： ¥{{ item.material.price }}/{{ codelabel('unit', item.material.materialUnit) }}
            </view>
          </view>
        </view>
      </van-dialog>

      <!-- 展示材料介绍  -->
      <van-dialog
        :title="materials.currentName"
        :show="materials.openMaterialDetail"
        use-slot
        @confirm="materials.openMaterialDetail = false"
        :data-event="{ id: 'KbQYC-VMrx', capture: false }"
      >
        <view
          style="height: 60vh; overflow-y: auto; font-size: 14px; padding: 20rpx"
          :data-event="{ id: '7p0_WkVkhm' }"
        >
          <rich-text :nodes="materials.currentDetail"></rich-text>
        </view>
      </van-dialog>

      <!-- 上拉菜单 -->
      <van-action-sheet
        :show="actionSheet.show"
        :actions="actionSheet.actions"
        @close="actionSheetClose"
        @select="actionSheetSelect"
      ></van-action-sheet>
      <!-- 级联 -->
      <!-- #ifdef MP-WEIXIN -->
      <van-popup :show="cascade.show" position="bottom">
        <van-cascader
          v-if="cascade.show"
          :value="cascade.value"
          title="请选择"
          :options="cascade.actions"
          :field-names="{
            text: 'name',
            value: 'value',
            children: 'children'
          }"
          @close="cascadeClose"
          @finish="cascadeConfirm"
        />
        <!-- <view class="c-flex c-flex-col c-h-100" :data-event="{id:'7p0_WkVkhm'}">
        <van-picker
          show-toolbar
          :columns="cascade.actions"
          value-key="name"
          @change="cascadeChange"
          @confirm="cascadeConfirm"
          @cancel="cascadeClose"
        />
      </view> -->
      </van-popup>
      <!-- #endif -->

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
      <!-- loading 遮罩层 -->
      <van-overlay :show="loading" style="z-index: 999999">
        <view class="wrapper" :data-event="{ id: '7p0_WkVkhm' }">
          <van-loading vertical size="50px" class="c-loading">处理中...</van-loading>
        </view>
      </van-overlay>
      <!-- 优惠券 -->
      <van-popup :show="coupons.show" position="bottom" custom-style="height: 70%;">
        <view class="c-flex c-flex-col c-h-100" :data-event="{ id: '7p0_WkVkhm' }">
          <van-nav-bar
            title="选择优惠券"
            left-text="取消"
            right-text="确认使用"
            @click-left="closeCoupon"
            @click-right="saveCoupon"
          ></van-nav-bar>
          <view class="couponFilter c-flex c-p-20" :data-event="{ id: '7p0_WkVkhm' }">
            <block v-for="(item, i) in options.discountType" :key="i">
              <view
                v-if="item.value == 1 || item.value == 2"
                @click="couponTypeClick(item.value)"
                :style="couponTypes == item.value ? 'border-color:red' : ''"
                :data-event="{ id: 'jpV4GNAWSy' }"
              >
                {{ item.name }}
              </view>
            </block>
          </view>
          <!-- v-if="type == '1' && coupons.fpi.total > 0" -->
          <view class="couponContent c-auto" :data-event="{ id: '7p0_WkVkhm' }">
            <block v-for="(item, i) in coupons.fpi.data" :key="i">
              <view
                v-if="couponTypes ? couponTypes == item.type : true"
                :class="
                  totalPrice + (Number(formData.couponsVal) || 0) < item.prerequisites ||
                  (new Date(item.activationDate.replace(/\//g, '-')).valueOf() > nowDate &&
                    new Date(item.dueDate.replace(/\//g, '-')).valueOf() < nowDate) ||
                  coupons.fpi.data.some((cItem, cIndex) => cItem.radio && cIndex != i)
                    ? 'c-opacity-5 coupon'
                    : 'coupon'
                "
                :data-event="{ id: '7p0_WkVkhm' }"
              >
                <view class="top" :data-event="{ id: '7p0_WkVkhm' }">
                  <view class="c-item-center" :data-event="{ id: '7p0_WkVkhm' }">
                    <van-radio-group
                      :value="item.radio"
                      :data-item="item"
                      @change="couponRadioChange($event, i, item)"
                    >
                      <van-radio
                        style="height: 100%"
                        custom-class="couponRadio"
                        label-class="couponRadio-label"
                        :name="true"
                        checked-color="#106cff"
                        :disabled="
                          totalPrice + (Number(formData.couponsVal) || 0) < item.prerequisites ||
                          (new Date(item.activationDate.replace(/\//g, '-')).valueOf() > nowDate &&
                            new Date(item.dueDate.replace(/\//g, '-')).valueOf() < nowDate) ||
                          coupons.fpi.data.some((cItem, cIndex) => cItem.radio && cIndex != i)
                        "
                      ></van-radio>
                    </van-radio-group>
                  </view>
                  <view class="coupon-left" :data-event="{ id: '7p0_WkVkhm' }">
                    <view class="info" :data-event="{ id: '7p0_WkVkhm' }">
                      <view
                        class="c-size-14 c-flex c-item-center"
                        :data-event="{ id: '7p0_WkVkhm' }"
                      >
                        <text
                          class="tag"
                          :class="
                            item.type == '1'
                              ? 'c-bg-blue'
                              : item.type == '2'
                              ? 'c-bg-orange'
                              : 'c-bg-red'
                          "
                          :data-event="{ id: '7p0_WkVkhm' }"
                        >
                          {{
                            commonEvent('codelabel', null, {
                              option: 'discountType',
                              value: item.type
                            })
                          }}
                        </text>
                        <text :data-event="{ id: '7p0_WkVkhm' }">{{ item.title }}</text>
                      </view>
                      <view class="c-size-12" :data-event="{ id: '7p0_WkVkhm' }">
                        {{
                          item.activationDate
                            ? item.activationDate.split(' ')[0].replace(/-/g, '.')
                            : ''
                        }}-{{ item.dueDate ? item.dueDate.split(' ')[0].replace(/-/g, '.') : '' }}
                      </view>
                      <view
                        class="c-size-12 c-flex c-flex-between c-item-center"
                        :data-event="{ id: '7p0_WkVkhm' }"
                      >
                        <text style="color: #8e8e8e" :data-event="{ id: '7p0_WkVkhm' }">
                          详细信息
                        </text>
                        <van-icon
                          :name="item.detailShow ? 'arrow-up' : 'arrow-down'"
                          style="border-radius: 50%; padding: 2px; background: #d9d9d9; color: #fff"
                          @click="couponDetailClick(item)"
                          :data-event="{ id: '2pSH2_rc2b' }"
                        />
                      </view>
                    </view>
                  </view>
                  <view
                    class="coupon-right"
                    :class="
                      item.type == '1' ? 'bg-blue' : item.type == '2' ? 'bg-yellow' : 'bg-red'
                    "
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <view :data-event="{ id: '7p0_WkVkhm' }">
                      <text class="c-size-12" :data-event="{ id: '7p0_WkVkhm' }">¥</text>
                      <text class="c-size-20 c-bold" :data-event="{ id: '7p0_WkVkhm' }">
                        {{ item.value }}
                      </text>
                    </view>
                    <view
                      class="c-size-12"
                      v-if="item.prerequisites"
                      :data-event="{ id: '7p0_WkVkhm' }"
                    >
                      满{{ item.prerequisites }}元可用
                    </view>
                  </view>
                </view>
                <view class="bottom" v-if="item.detailShow" :data-event="{ id: '7p0_WkVkhm' }">
                  <view :data-event="{ id: '7p0_WkVkhm' }">
                    <view :data-event="{ id: '7p0_WkVkhm' }">券号：{{ item._id }}</view>
                    <view :data-event="{ id: '7p0_WkVkhm' }">价格：{{ item.price || 0 }}元</view>
                    <view v-if="item.description" :data-event="{ id: '7p0_WkVkhm' }">
                      使用说明：{{ item.description }}
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </view>
      </van-popup>

      <!-- 取消合同弹窗 -->
      <van-popup :show="cancellationShow" position="bottom" round custom-style="height: 70%;">
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
            custom-class="c-border-n"
            :data-event="{ id: 'ktMPD00_ir' }"
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

      <!-- 套餐规格弹出框 -->
      <van-dialog
        use-slot
        :title="packageSpec.formData.name"
        :show="packageSpec.show"
        v-if="packageSpec.show"
        :show-confirm-button="false"
        :closeOnClickOverlay="false"
        class="c-spec-dialog"
        customStyle="display: flex;flex-direction: column;height: 70%;overflow:visible;"
        :data-event="{ id: 'KPLL7ng0E8', capture: false }"
      >
        <view class="c-flex-1 c-flex c-flex-col c-hidden" :data-event="{ id: '7p0_WkVkhm' }">
          <view class="c-flex-1 c-auto-y" :data-event="{ id: '7p0_WkVkhm' }">
            <view
              v-for="(m, index) in packageSpec.formData.materialList"
              :key="index"
              style="padding: 20rpx 0; border-top: 1px solid #ebedf0"
              :data-event="{ id: '7p0_WkVkhm' }"
            >
              <view class="c-m-l-20" :data-event="{ id: '7p0_WkVkhm' }">{{ m.material.name }}</view>
              <view
                v-if="specButtonShow(m.material) && m.skus && m.skus.find(sku => sku.number > 0)"
                style="
                  background: #f7f8fa;
                  margin: 5px 10px;
                  padding: 5px;
                  border-radius: 5px;
                  font-size: 12px;
                  color: #646566;
                "
                :data-event="{ id: '7p0_WkVkhm' }"
              >
                <block v-for="(sku, i) in m.skus" :key="i">
                  <view v-if="sku.number > 0" :data-event="{ id: '7p0_WkVkhm' }">
                    <text :data-event="{ id: '7p0_WkVkhm' }">已选：</text>
                    <text
                      v-for="(f, i) in attributeFields"
                      :key="i"
                      :data-event="{ id: '7p0_WkVkhm' }"
                    >
                      <block v-if="sku.exts[f.name]">
                        {{ formatAttributeValue(f.valueOption, sku.exts[f.name]) }}，
                      </block>
                    </text>
                    <text :data-event="{ id: '7p0_WkVkhm' }">
                      {{ sku.number }}{{ codelabel('unit', sku.materialUnit) }}
                    </text>
                  </view>
                </block>
              </view>
              <block v-for="(f, i) in attributeFields" :key="i">
                <view
                  class="c-m-20"
                  v-if="m.material.exts[f.name] && m.material.exts[f.name].length > 0"
                  :data-event="{ id: '7p0_WkVkhm' }"
                >
                  <view class="c-gray" :data-event="{ id: '7p0_WkVkhm' }">{{ f.nameDisp }}</view>
                  <view class="c-flex c-flex-wrap c-m-10" :data-event="{ id: '7p0_WkVkhm' }">
                    <view
                      v-for="(value, j) in m.material.exts[f.name]"
                      :key="j"
                      @click="packageSpecAttributeValueClick(index, f.name, value)"
                      :class="m.material.exts.attributeValues[f.name] == value ? 'c-bg-yellow' : ''"
                      style="
                        padding: 6px 8px;
                        margin-right: 6px;
                        margin-top: 6px;
                        border: 1px solid #f2f2f2;
                        border-radius: 5px;
                      "
                      :data-event="{ id: '9HgfNHzhhk' }"
                    >
                      {{ formatAttributeValue(f.valueOption, value) }}
                    </view>
                  </view>
                </view>
              </block>
              <!-- 材料维护了规格 -->
              <view
                v-if="specButtonShow(m.material)"
                class="c-text-right"
                :data-event="{ id: '7p0_WkVkhm' }"
              >
                <!-- 有sku -->
                <block v-if="m.skus && m.skus.length > 0">
                  <block v-if="allPackageSpecSelected(m.material)">
                    <!-- 选择全部规格后进行匹配 -->
                    <block v-for="(sku, i) in m.skus" :key="i">
                      <block v-if="skuMatch(m.material.exts.attributeValues, sku)">
                        <van-stepper
                          :value="sku.number"
                          integer
                          :min="0"
                          button-size="35"
                          input-class="input-class"
                          plus-class="plus-class"
                          minus-class="minus-class"
                          custom-class="c-stepper c-flex c-item-center"
                          @change="packageSkuNumberChange($event, sku)"
                        />
                      </block>
                    </block>
                  </block>
                </block>
                <!-- 无sku -->
                <block v-else>
                  <van-stepper
                    :value="m.number"
                    integer
                    :min="0"
                    button-size="35"
                    input-class="input-class"
                    plus-class="plus-class"
                    minus-class="minus-class"
                    custom-class="c-stepper c-flex c-item-center"
                    @change="packageNumberChange($event, m)"
                  />
                </block>
              </view>
              <!--材料没有维护规格 -->
              <view class="c-text-right" v-else :data-event="{ id: '7p0_WkVkhm' }">
                <van-stepper
                  :value="m.number"
                  integer
                  :min="0"
                  button-size="35"
                  input-class="input-class"
                  plus-class="plus-class"
                  minus-class="minus-class"
                  custom-class="c-stepper c-flex c-item-center"
                  @change="packageNumberChange($event, m)"
                />
              </view>
            </view>
          </view>
          <view
            class="c-flex c-item-center c-flex-between c-flex-wrap c-p-20 c-size-14"
            style="border-top: 1px solid #ebedf0"
            :data-event="{ id: '7p0_WkVkhm' }"
          >
            <view :data-event="{ id: '7p0_WkVkhm' }">
              <text class="c-black" :data-event="{ id: '7p0_WkVkhm' }">套餐单价：</text>
              <text class="c-red" :data-event="{ id: '7p0_WkVkhm' }">
                ￥{{ packageSpec.formData.price }}
              </text>
            </view>
            <view class="c-flex c-item-center" :data-event="{ id: '7p0_WkVkhm' }">
              <text class="c-m-r-20" :data-event="{ id: '7p0_WkVkhm' }">套餐数量</text>
              <van-stepper
                :value="packageSpec.formData.number"
                integer
                :min="0"
                button-size="35"
                input-class="input-class"
                plus-class="plus-class"
                minus-class="minus-class"
                custom-class="c-flex c-item-center"
                @change="numberChange($event, packageSpec.formData)"
              />
            </view>
          </view>
        </view>
        <view class="close-button" @click="closePackageSpec" :data-event="{ id: '88OAPTvXdv' }">
          <van-icon name="close" :data-event="{ id: '88OAPTvXdv' }" />
        </view>
      </van-dialog>

      <!-- 材料规格弹出框 -->
      <van-dialog
        use-slot
        :title="spec.formData.name"
        :show="spec.show"
        v-if="spec.show"
        :show-confirm-button="false"
        :closeOnClickOverlay="false"
        class="c-spec-dialog"
        customStyle="display: flex;flex-direction: column;height: 70%;overflow:visible;"
        :data-event="{ id: '78hSFbgjdC', capture: false }"
      >
        <view class="c-flex-1 c-auto-y" :data-event="{ id: '7p0_WkVkhm' }">
          <view
            v-if="spec.formData.skus && spec.formData.skus.find(sku => sku.number > 0)"
            style="
              background: #f7f8fa;
              margin: 5px 10px;
              padding: 5px;
              border-radius: 5px;
              font-size: 12px;
              color: #646566;
            "
            :data-event="{ id: '7p0_WkVkhm' }"
          >
            <block v-for="(sku, i) in spec.formData.skus" :key="i">
              <view v-if="sku.number > 0" :data-event="{ id: '7p0_WkVkhm' }">
                <text :data-event="{ id: '7p0_WkVkhm' }">已选：</text>
                <text v-for="(f, i) in attributeFields" :key="i" :data-event="{ id: '7p0_WkVkhm' }">
                  <block v-if="sku.exts[f.name]">
                    {{ formatAttributeValue(f.valueOption, sku.exts[f.name]) }}，
                  </block>
                </text>
                <text :data-event="{ id: '7p0_WkVkhm' }">
                  {{ sku.number }}{{ codelabel('unit', sku.materialUnit) }}
                </text>
              </view>
            </block>
          </view>
          <block v-for="(f, i) in attributeFields" :key="i">
            <view
              class="c-m-20"
              v-if="spec.formData.exts[f.name] && spec.formData.exts[f.name].length > 0"
              :data-event="{ id: '7p0_WkVkhm' }"
            >
              <view class="c-gray" :data-event="{ id: '7p0_WkVkhm' }">{{ f.nameDisp }}</view>
              <view class="c-flex c-flex-wrap c-m-10" :data-event="{ id: '7p0_WkVkhm' }">
                <view
                  v-for="(value, j) in spec.formData.exts[f.name]"
                  :key="j"
                  @click="attributeValueClick(f.name, value)"
                  :class="spec.formData.exts.attributeValues[f.name] == value ? 'c-bg-orange' : ''"
                  style="
                    padding: 6px 8px;
                    margin-right: 6px;
                    margin-top: 6px;
                    border: 1px solid #f2f2f2;
                    border-radius: 5px;
                  "
                  :data-event="{ id: 'OxTZB3W4My' }"
                >
                  {{ formatAttributeValue(f.valueOption, value) }}
                </view>
              </view>
            </view>
          </block>
        </view>
        <view
          v-if="allSpecSelected()"
          style="height: 30px; margin: 0 25px 20px"
          class="c-flex c-flex-between c-item-center c-flex-wrap"
          :data-event="{ id: '7p0_WkVkhm' }"
        >
          <block v-for="(sku, i) in spec.formData.skus" :key="i">
            <block v-if="skuMatch(spec.formData.exts.attributeValues, sku)">
              <view :data-event="{ id: '7p0_WkVkhm' }">
                <text class="c-black" :data-event="{ id: '7p0_WkVkhm' }">单价：</text>
                <text class="c-red" :data-event="{ id: '7p0_WkVkhm' }">￥{{ sku.price }}</text>
              </view>
              <!-- 选择全部规格后进行匹配 allSpecSelected -->
              <!-- 1.判断是否已选择---显示数量，支持增减 -->
              <!-- 2.判断此规格是否上架--已上架：支持加入购物车，加入后显示数量支持相加（进入第1条判断）；未上架：显示未上架/库存不足 -->
              <van-stepper
                :value="sku.number"
                integer
                :min="0"
                button-size="35"
                input-class="input-class"
                plus-class="plus-class"
                minus-class="minus-class"
                custom-class="c-flex c-item-center"
                @change="skuNumberChange($event, spec.formData, sku)"
              />
            </block>
          </block>
        </view>
        <view class="close-button" @click="spec.show = false" :data-event="{ id: '0sV5igZZrF' }">
          <van-icon name="close" :data-event="{ id: '0sV5igZZrF' }" />
        </view>
      </van-dialog>

      <!-- 质保年限上拉菜单 -->
      <van-action-sheet
        :show="agelimit.show"
        :actions="agelimit.actions"
        @close="agelimit.show = false"
        @select="agelimitSelect"
      />
      <van-toast id="van-toast" />

      <!-- 新版选择套餐 -->
      <van-popup
        key="packagesShowDialog"
        v-if="packages.show"
        :show="packages.show"
        position="bottom"
        custom-style="height: 100%;display:flex;flex-direction:column;"
        bind:close="onClose"
      >
        <van-nav-bar left-text="返回" left-arrow @click-left="packagesConfirm" />
        <view
          style="padding: 16px 16px 65px; flex: 1; overflow-y: auto"
          :data-event="{ id: '7p0_WkVkhm' }"
        >
          <view style="font-size: 18px" :data-event="{ id: '7p0_WkVkhm' }">
            {{ packages.formData.name }}
          </view>
          <view
            style="color: #4b4b4b; font-size: 12px; font-weight: 300; margin-top: 25px"
            :data-event="{ id: '7p0_WkVkhm' }"
          >
            <view :data-event="{ id: '7p0_WkVkhm' }">包含项</view>
            <view class="c-flex c-flex-wrap" :data-event="{ id: '7p0_WkVkhm' }">
              <view
                v-for="(item, i) in packages.formData.procedureList"
                :key="i"
                class="c-flex c-item-center"
                style="margin-top: 8px; margin-right: 20px"
                :data-event="{ id: '7p0_WkVkhm' }"
              >
                <text
                  style="
                    border: 1px solid #4b4b4b;
                    border-radius: 50%;
                    font-size: 8px;
                    width: 10px;
                    height: 10px;
                    display: inline-flex;
                    justify-content: center;
                    margin-right: 6px;
                  "
                  :data-event="{ id: '7p0_WkVkhm' }"
                >
                  {{ i + 1 }}
                </text>
                <text :data-event="{ id: '7p0_WkVkhm' }">{{ item.procedure.name }}</text>
              </view>
            </view>
            <view
              class="c-flex c-item-center c-flex-between c-flex-wrap"
              style="margin-top: 25px"
              :data-event="{ id: '7p0_WkVkhm' }"
            >
              <text class="c-size-14 c-black" :data-event="{ id: '7p0_WkVkhm' }">
                工程量
                <text v-if="packages.formData.unit" :data-event="{ id: '7p0_WkVkhm' }">
                  （{{ codelabel('unit', packages.formData.unit) }}）
                </text>
              </text>
              <van-stepper
                key="packages-number"
                :value="packages.formData.number"
                :min="0"
                button-size="35"
                input-class="p-input-class"
                plus-class="p-plus-class"
                minus-class="p-minus-class"
                custom-class="c-flex c-item-center p-stepper"
                @change="onPackageChange($event, packages.formData)"
              />
            </view>
            <view :data-event="{ id: '7p0_WkVkhm' }">
              <block v-for="(item, i) in packages.materialsLayer" :key="i">
                <!-- 如果没有某道，item为null -->
                <view v-if="item" style="margin-top: 15px" :data-event="{ id: '7p0_WkVkhm' }">
                  <view
                    class="c-size-16 c-black c-flex c-item-center"
                    style="margin-bottom: 10px"
                    :data-event="{ id: '7p0_WkVkhm' }"
                  >
                    <view class="c-vertical-line" :data-event="{ id: '7p0_WkVkhm' }"></view>
                    <text :data-event="{ id: '7p0_WkVkhm' }">
                      {{ codelabel('maintenanceLayer', item && item[0] && item[0].exts.layer) }}
                    </text>
                  </view>
                  <view style="width: 100vw; margin-left: -16px" :data-event="{ id: '7p0_WkVkhm' }">
                    <van-radio-group
                      :key="'packages-checkedIds' + i"
                      :value="packages.checkedIds[i]"
                      @change="onRadioGroupChange($event, i)"
                      class="m-radio-group"
                    >
                      <van-radio
                        :name="m._id"
                        v-for="(m, j) in item"
                        :key="j"
                        :custom-class="
                          packages.checkedIds[i] == m._id ? 'm-radio m-radio-checked' : 'm-radio'
                        "
                      >
                        <view class="m-top" :data-event="{ id: '7p0_WkVkhm' }">
                          <image
                            :src="
                              (m.material.images &&
                                m.material.images[0] &&
                                m.material.images[0].url) ||
                              'https://pub.fsgo365.cn/logo_square.png'
                            "
                            class="m-image"
                            mode="heightFix"
                            :data-event="{ id: '7p0_WkVkhm' }"
                          ></image>
                        </view>
                        <view class="m-title c-ellipsis2" :data-event="{ id: '7p0_WkVkhm' }">
                          {{ m.material.exts.commonName || m.material.name }}
                        </view>
                        <view class="m-price" :data-event="{ id: '7p0_WkVkhm' }">
                          ¥{{ m.exts.price }}
                        </view>
                      </van-radio>
                    </van-radio-group>
                  </view>
                </view>
              </block>
            </view>
          </view>
        </view>
        <view
          class="c-flex c-flex-between c-item-center c-w-1"
          style="
            height: 50px;
            border-top: 1px solid #e3e3e3;
            position: fixed;
            bottom: 0;
            background: #fff;
          "
        >
          <view></view>
          <view
            class="p-confirm-button"
            @click="packagesConfirm"
            :data-event="{ id: 'Gme21sqR10' }"
          >
            确认
          </view>
        </view>
      </van-popup>
    </movable-area>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
let common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
import Toast from '../../wxcomponents/vant/toast/toast';
import {
  isIDNumber,
  isPassport,
  isHongKongID,
  isOfficerID,
  isMTPs
} from '../../resources/js/reg.js';

export default {
  data() {
    return {
      partnerId: '', //伙伴id
      items: [],
      orderListShow: true,
      selectionShow: false,
      selectorShow: false,
      type: '',
      otherAmount: null,
      preferentialAmount: null,
      description: '',
      discountSheet: {
        show: false,
        actions: []
      },
      originPrice: 0,
      totalPrice: 0, //总计
      showTotalPrice: 0, //在页面上显示的总计
      discount: 1, //折扣
      extFields: [], //全部的表单字段
      placeOrderFields: [], //在页面显示的表单字段
      submitOrderFields: [], //在表单显示的表单字段
      formData: {
        exts: {}
      }, //表单数据//下单关联信息
      dataShow: true,
      //组件选项
      options: {
        codecfg_productType: {
          codeId: 'productType'
        },
        codecfg_UNIT: {
          codeId: 'UNIT'
        },
        codecfg_partUnit: {
          codeId: 'partUnit'
        },
        codecfg_discount: {
          codeId: 'discount'
        },
        codecfg_discountType: { codeId: 'CpsDiscountType' },
        codecfg_packageType: { codeId: 'packageType' }, // 套餐类型
        codecfg_materialType: { codeId: 'type1' }, // 材料类型
        codecfg_refreshMaterialType: { codeId: 'type2' }, // 刷新材料类型
        codecfg_partsOne: { codeId: 'partsOne' }, // 防水维修部位一级
        codecfg_refreshParts: { codeId: 'refreshParts' }, // 刷新维修部位
        codecfg_constructionParts: { codeId: 'constructionParts' }, // 防水施工/闭水验收部位一级
        filterParts: [],
        codecfg_unit: { codeId: 'company' }, // 单位
        codecfg_allContractType: { codeId: 'allContractType' }, // 全部合同类型（过滤后只保留服务商维护的服务类型）
        codecfg_contractType: { codeId: 'allContractType' }, // 全部合同类型（原数据不变）
        codecfg_agelimit: { codeId: 'agelimit' }, // 质保年限
        codecfg_refreshAgelimit: { codeId: 'refreshAgelimit' }, // 刷新质保年限
        codecfg_agelimitFilter: { codeId: 'agelimitFilter' }, // 套餐质保年限过滤
        codecfg_maintenanceLayer: { codeId: 'maintenanceLayer' }, // 维修层数
        parts: [], // 字段配置防水维修部位
        discount: []
      },
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: '',
        type: '' //默认为空，type=addItem自定义项
      },
      //级联选择
      cascade: {
        show: false,
        actions: [],
        field: '',
        type: '',
        value: []
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
      //图片
      bgImage: '', //背景图片
      // 是否显示遮罩层
      loading: false,
      openForm: '', //表单弹窗显示隐藏
      workflowFormDefId: '', //流程定义id
      orderData: {}, //订单对象
      editType: null, //修改订单的类型， 1 编辑， 2 增项， 3 减项
      increaseDecreaseShow: false, //增减项弹窗
      increaseDecreaseNum: 1,
      increaseDecreaseMax: 1,
      increaseDecreaseActive: {},
      selectItems: [],
      sid: '',
      formShow: false,
      turnOpenForm: false,
      coupons: { fpi: { data: [] }, show: false, field: '' }, //优惠券
      couponTypes: '',
      oldCouponId: '', //如果订单用编辑则把编辑前的旧的优惠券id存储，方便提交订单进行重新激活
      nowDate: '', //当前时间
      cancellationShow: false,
      cancelContractData: { reasonCancellation: '' }, //取消合同数据
      // 新报价
      orderId: '',
      activeTab: 'projPackage',
      projPackages: {
        searchValue: '',
        filterPart: '',
        agelimit: '',
        data: [],
        totalAmount: 0,
        openMaterials: false,
        currentMaterials: [],
        openProcedures: false,
        currentProcedures: []
      }, // 套餐
      procedures: { searchValue: '', filterPart: '', data: [], totalAmount: 0 }, // 工序
      materials: {
        searchValue: '',
        type: '',
        data: [],
        totalAmount: 0,
        openMaterialDetail: false,
        currentName: '',
        currentDetail: ''
      }, // 材料
      measures: { searchValue: '', type: '', data: [], totalAmount: 0 }, // 机措
      // 多部位订单
      orderList: [],
      orderIndex: 0,
      addItems: {
        data: [],
        totalPrice: 0
      },
      deleteItems: {
        data: [],
        totalPrice: 0
      },
      longitude: 0,
      latitude: 0,
      serviceType: '', //服务类型
      sourceType: '', //信息来源
      attributeFields: [],
      attributeOptions: {},
      packageSpec: {
        show: false,
        formData: { exts: {}, materialList: [] }
      },
      spec: {
        show: false,
        formData: { exts: { attributeValues: {} } }
      },
      // 质保年限
      agelimit: {
        show: false,
        actions: []
      },
      // 新版选择套餐
      packages: {
        show: false,
        formData: { exts: {} },
        materialsLayer: [],
        checkedIds: []
      },
      editOrder: {
        show: {},
        formData: {}
      },
      systemInfo: ''
      // temporaryFormType: false //是否自动暂存表单
    };
  },
  // onHide() {
  //   if (this.temporaryFormType && !this.orderId) {
  //     this.temporaryForm();
  //   }
  // },
  // onUnload() {
  //   if (this.temporaryFormType && !this.orderId) {
  //     this.temporaryForm();
  //   }
  // },
  methods: {
    onLoad: function (param) {
      common.osg.init(this, param, app);
      this.systemInfo = app.globalData.systemInfo;
      //初始化页面数据
      this.initData();
      // common.osg.getLocation(location => {
      //   this.longitude = location.longitude;
      //   this.latitude = location.latitude;
      // });
      this.getAttributes();
      // #ifdef APP-PLUS
      this.getArea();
      // #endif
    },
    // 获取当前登录人的伙伴服务类型
    getPartner() {
      common.osg.ajax(`basic/partner/queryById/${this.partnerId}`, null, res => {
        let partnerContractType = res.exts['contractType' + this.serviceType] || [];
        let allContractType = [];
        for (var i = 0; i < this.options.contractType.length; i++) {
          // 只运行选择当前服务商维护的服务类型
          if (partnerContractType.includes(this.options.contractType[i].value)) {
            allContractType.push(this.options.contractType[i]);
          }
        }
        this.options.allContractType = allContractType;

        // 默认选中第一种合同类型
        if (!this.orderId && allContractType.length > 0)
          this.formData.contractType = this.options.allContractType[0].value;
      });
    },
    //初始化页面数据
    initData() {
      //下单查询伙伴id
      this.partnerId = wx.getStorageSync('user').partnerIds[0];
      if (!this.partnerId) {
        this.getUserPartnerId();
      }

      // 获取页面传参
      this.type = common.osg.param('type'); //type 0:报价 1:下单
      if (this.type == '0') {
        uni.setNavigationBarTitle({
          title: '报价器'
        });
      } else {
        uni.setNavigationBarTitle({
          title: '下单'
        });
      }
      this.sid = common.osg.param('id'); //工单id
      this.orderId = common.osg.param('orderId'); //获取编辑订单时拿到的订单单据
      this.serviceType = common.osg.param('serviceType'); //服务类型
      this.sourceType = common.osg.param('sourceType'); //信息来源
      this.nowDate = new Date().valueOf(); //当前时间
      this.workflowFormDefId = common.osg.param('workflowFormDefId'); //小流程的定义id
      this.orphanId = common.osg.param('orphanId'); //下单业务节点的数据id
      this.turnOpenForm = common.osg.param('turnOpenForm');

      if (this.orderId) {
        // 编辑订单，查询订单
        this.editType = common.osg.param('editType'); //修改订单的类型，1编辑，2增项，3减项
        this.getOrderById(this.orderId);
      } else {
        this.orderData = null;
      }

      this.getFields(() => {
        common.osg.codeoption(() => {
          if (this.serviceType == '11' || this.serviceType == '12') {
            this.options.filterParts = this.options.partsOne;
            //刷新流程
          } else if (this.serviceType == '40') {
            this.options.filterParts = this.options.refreshParts;
            this.options.materialType = this.options.refreshMaterialType;
            console.log('看一下这个是什么分类', this.options.filterParts);
          } else {
            this.options.filterParts = this.options.constructionParts;
          }
          //折扣下拉选择
          this.discountSheet.actions = this.options['discount'];
          if (this.sid) this.getData(this.sid);
        });
      });
    },
    getAttributes() {
      // 获取材料属性
      common.osg.ajax(
        'biz/extField/query',
        {
          sortField: 'order',
          colName: 'material',
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          this.attributeFields = res.data.filter(item => {
            item.frontEndConfig = item.frontEndConfig ? JSON.parse(item.frontEndConfig) : {};
            if (item.frontEndConfig.salesAttribute) {
              this.attributeOptions['codecfg_' + item.valueOption] = { codeId: item.valueOption };
              return true;
            }
          });
          // 获取材料属性值
          var opts = this.attributeOptions;
          if (opts) {
            var cfgArr = [];
            for (var o in opts) {
              if (o.startsWith('codecfg_')) {
                var cfg = opts[o];
                cfg['eleid'] = o.substring(8);
                cfgArr.push(cfg);
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
                      this.attributeOptions[opts.eleid] = osArr;
                    }
                  }
                },
                {
                  noload: true
                }
              );
            } else {
              resolve();
            }
          }
        },
        {
          noload: true
        }
      );
    },
    formatAttributeValue(codeType, value) {
      return common.osg.codelabel(codeType, value, this.attributeOptions[codeType]);
    },
    getOrderById(id) {
      common.osg.ajax(
        `basic/order/queryById`,
        {
          id
        },
        res => {
          this.orderData = res;
          //将exts内的字段，放到外层
          for (let key in this.orderData.exts) {
            this.orderData[key] = this.orderData.exts[key];
          }
          //将订单数据渲染页面上
          this.otherAmount = this.orderData.otherAmount || 0; //其他金额
          this.originPrice = this.orderData.originPrice || 0; //原价
          this.preferentialAmount = this.orderData.preferentialAmount || 0; //优惠金额
          this.totalPrice = +this.orderData.totalPrice || 0; //总价
          this.description = this.orderData.description || ''; //备注
          // this.discount = this.amountToFixed(this.amountToFixed(this.orderData.discount) *
          // 	100) || 100 //折扣

          this.discount = this.amountToFixed(this.amountToFixed(this.orderData.discount) * 1) || 1; //折扣
          this.formData.name = this.orderData.ownerName || ''; //归属人姓名
          this.formData.phone = this.orderData.ownerPhone || ''; //归属人电话

          if (common.osg.isJson(res.bjProducts)) {
            let products = JSON.parse(res.bjProducts);
            this.addItems = products.addItems;
            this.deleteItems = products.deleteItems;
            // 查找所有sku的spu，重新组合数据，products.orderList  materials.data spuid
            let spuIds = [];
            products.orderList.map(order => {
              order.materials.data.map(sku => {
                if (spuIds.indexOf(sku.spuid) == -1) {
                  spuIds.push(sku.spuid);
                }
              });
            });
            if (spuIds.length > 0) {
              this.getMaterialSPU(spuIds, products.orderList);
            } else {
              this.$set(this, 'orderList', products.orderList);
            }
          }
        }
      );
    },
    getFields(callback) {
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
          for (let extField of res.data) {
            //解析frontEndConfig字段配置
            if (extField.frontEndConfig && common.osg.isJson(extField.frontEndConfig)) {
              extField.frontEndConfig = JSON.parse(extField.frontEndConfig);
            }
            //关联字典表codeType放到options,之后从字典表查询
            if (extField.valueOption) {
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
          this.extFields = res.data;
          // 下单时展示的字段
          this.placeOrderFields = this.extFields.filter(
            item =>
              item.frontEndConfig &&
              item.frontEndConfig.showType == 'placeOrder' &&
              (item.frontEndConfig.serviceType && this.serviceType
                ? item.frontEndConfig.serviceType.indexOf(this.serviceType) != -1
                : true)
          );
          // 提交订单时展示的字段
          // 默认客户类型为“客户”
          this.formData.personType = this.formData.personType || '0';
          this.submitOrderFields = this.extFields.filter(
            item =>
              item.frontEndConfig &&
              item.frontEndConfig.showType == 'submitOrder' &&
              (item.frontEndConfig.serviceType && this.serviceType
                ? item.frontEndConfig.serviceType.indexOf(this.serviceType) != -1
                : true) &&
              (item.frontEndConfig.personType
                ? this.formData.personType == item.frontEndConfig.personType
                : true)
          );
          if (callback) callback();
        },
        {
          noload: true
        }
      );
    },
    //字段修改
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
                if (resVal || resVal == 0) {
                  this.formData[resEvaluate.res] = Math.abs((resVal.toFixed(2) * 100) / 100);
                }
              }
              break;
            }
          }
        }
      } else if (type == 'radio') {
        if (field == 'personType') {
          this.submitOrderFields = this.extFields.filter(
            item =>
              item.frontEndConfig &&
              item.frontEndConfig.showType == 'submitOrder' &&
              (item.frontEndConfig.serviceType && this.serviceType
                ? item.frontEndConfig.serviceType.indexOf(this.serviceType) != -1
                : true) &&
              (item.frontEndConfig.personType
                ? this.formData.personType == item.frontEndConfig.personType
                : true)
          );
        }
      }
    },
    // App端输入框
    onInput(e) {
      let field = e.target.dataset.name;
      this.formData[field] = e.detail.value;
      this.$forceUpdate();
    },
    //失去焦点
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

    //获取工单信息，编辑不调用用于反显表单
    // TODO:
    getData(id, callback) {
      if (this.orderData) {
        this.formData = this.orderData;
        for (let vExtfiel of this.placeOrderFields) {
          for (let key in this.orderData.exts) {
            if (key == vExtfiel.name) {
              //将类型为级联的转为数组，vant组件会反显级联
              if (vExtfiel.type == 'cascade') {
                this.formData[key] = Array.isArray(this.orderData.exts[key])
                  ? this.orderData.exts[key]
                  : this.orderData.exts[key].split(',');
              } else {
                this.formData[key] = this.orderData.exts[key];
              }
            }
          }
        }
        if (callback) callback();
      } else {
        common.osg.ajax(
          `basic/serviceAppointment/queryById/${id}`,
          null,
          res => {
            this.setData({
              formData: res.data.serviceAppointment
            });
            res.data.workflowNode.map(item => {
              // if (item.nodeDef.name == '下单' && item.nodeDef.temporary) {
              //   this.temporaryFormType = true;
              //   this.getTemporaryForm();
              // }
            });
            if (callback) callback(res.data.serviceAppointment);
          },
          {
            noload: true
          }
        );
      }
    },
    //生成报价/订单操作按钮
    placeOrder: function (type) {
      //防止按钮重复点击
      if (common.osg.isRepeatClick('placeOrder')) return;

      for (let i = 0; i < this.addItems.data.length; i++) {
        if (this.addItems.data[i].number > 0 && !this.addItems.data[i].name) {
          common.osg.toast('请输入自定义增项名称', 'none');
          return;
        }
      }
      for (let i = 0; i < this.deleteItems.data.length; i++) {
        if (this.deleteItems.data[i].number > 0 && !this.deleteItems.data[i].name) {
          common.osg.toast('请输入自定义减项名称', 'none');
          return;
        }
      }

      if (this.totalPrice < 0) {
        common.osg.alert('合计不能为负!');
        return;
      }

      // //检测是否必填
      let extList = type == '1' ? this.submitOrderFields : this.placeOrderFields;

      for (var extField of extList) {
        //对配置因为某个字段的值为某值的时候，不校验；dispensableField（某字段）dispensableValue（某值）
        if (extField.frontEndConfig && extField.frontEndConfig.dispensableField) {
          if (
            this.formData[extField.frontEndConfig.dispensableField] ==
            extField.frontEndConfig.dispensableValue
          )
            continue;
        }
        if (extField.type == 'switch' && !this.formData[extField.name]) {
          this.formData[extField.name] = '0';
        }
        if (extField.required == '1') {
          if (
            (!this.formData[extField.name] && this.formData[extField.name] !== 0) ||
            (this.formData[extField.name] &&
              Array.isArray(this.formData[extField.name]) &&
              this.formData[extField.name].length == 0)
          ) {
            common.osg.alert(extField.nameDisp + '为必填项');
            return;
          }
        }

        //配置的下单名称校验，根据字典表配置的限制短词来校验（提交订单时不校验了）
        // if (extField.frontEndConfig && extField.frontEndConfig.placeOrderNameValidate) {
        //   //长度限制必须大于1
        //   if (!/^\p{Script=Han}+$/u.test(this.formData[extField.name])) {
        //     common.osg.alert(`${extField.nameDisp}格式错误，请输入中文`);
        //     return;
        //   }
        //   // 根据字典表配置的限制短词来校验
        //   for (let valiItem of this.options.placeOrderNameValidate) {
        //     if (this.formData[extField.name].indexOf(valiItem.name) != -1) {
        //       // common.osg.alert(`${extField.nameDisp}不符合姓名规范[${valiItem.name}]`);
        //       common.osg.alert(
        //         `输入的姓名不符合规范，请输入业主真实的姓名。若业主真实姓名确定为此，请联系开发人员处理！`
        //       );
        //       return;
        //     }
        //   }
        //   //长度限制必须大于1
        //   if (this.formData[extField.name].length <= 1) {
        //     common.osg.alert(`${extField.nameDisp}长度必须大于1`);
        //     return;
        //   }
        // }

        if (extField.type == 'phone') {
          if (!this.checkMobile(this.formData[extField.name])) {
            common.osg.toast(extField.nameDisp + '格式错误', 'none');
            return;
          }
        } else if (extField.type == 'IDNumber') {
          if (!this.checkIDNumber(this.formData[extField.name])) {
            common.osg.toast(extField.nameDisp + '格式错误', 'none');
            return;
          }
        } else if (extField.type == 'select') {
          if (extField.frontEndConfig && extField.frontEndConfig.regular) {
            if (this.formData['certificateNum'])
              this.formData['certificateNum'] = this.formData['certificateNum'].replace(/\s+/g, ''); //去空格
            this.$forceUpdate();
            //TODO:写死的校验
            let str = String(this.formData[extField.name]);
            switch (str) {
              case '1':
                if (!isIDNumber(this.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
              case '2':
                if (!isPassport(this.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
              case '3':
                if (!isHongKongID(this.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
              case '4':
                if (!isOfficerID(this.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
              case '5':
                if (!isMTPs(this.formData['certificateNum'])) {
                  common.osg.toast('证件号输入有误', 'none');
                  return;
                }
                break;
            }
          }
          if (
            extField.required == '1' &&
            extField.name == 'contractType' &&
            Array.isArray(this.formData['contractType'])
              ? !this.formData['contractType'].length
              : false
          ) {
            common.osg.alert('请确认合同类型是否维护！');
            return;
          }
        } else if (extField.type == 'file') {
          if (
            extField.required == '1' && Array.isArray(this.formData[extField.name])
              ? !this.formData[extField.name].length
              : !this.formData[extField.name]
          ) {
            common.osg.alert(extField.nameDisp + '为必填项');
            return;
          }
        } else if (extField.required == '1' && extField.type == 'area') {
          if (this.formData[extField.name].length == 0) {
            common.osg.alert(extField.nameDisp + '为必填项');
            return;
          }
        }
        // 取消七牛云压缩参数
        if (extField.type == 'file') {
          if (Array.isArray(this.formData[extField.name])) {
            for (let obj of this.formData[extField.name]) {
              if (obj.url.indexOf('?') != -1) {
                obj.url = obj.url.substring(0, obj.url.indexOf('?'));
              }
            }
          } else if (this.formData[extField.name]) {
            let arr = this.formData[extField.name].split(',');
            this.formData[extField.name] = this.formData[extField.name].map(item => {
              url: item;
            });
          }
        }
      }

      let coupons = this.formData.coupons || this.formData.exts.coupons;
      let couponsVal = Number(this.formData.couponsVal || 0);
      if (coupons) {
        for (let item of this.coupons.fpi.data) {
          if (item._id == coupons) {
            if (item.prerequisites > this.totalPrice + couponsVal) {
              common.osg.alert('当前选择的优惠券不满足使用条件！');
              return;
            }
          }
        }
      }

      common.osg.confirm('确认要提交吗？', () => {
        let orderList = [];
        let orderListTotalAmount = 0;
        console.log('这是什么', this.orderList[0].repairParts);
        console.log('怎么样', this.formatRepairParts(this.orderList[0].repairParts));
        for (let i = 0; i < this.orderList.length; i++) {
          let order = {
            repairParts: this.orderList[i].repairParts,
            constructionLocation: this.formatRepairParts(this.orderList[i].repairParts),
            // constructionLocation: this.orderList[i].constructionLocation,
            // otherConstructionLocation: this.orderList[i].otherConstructionLocation,
            partDescription: this.orderList[i].partDescription,
            constructionSite: this.orderList[i].constructionSite,
            maintainAreaNum: this.orderList[i].maintainAreaNum,
            agelimit: this.orderList[i].agelimit,
            agelimitMax: this.orderList[i].agelimitMax
          };
          // 整理各部位 已选套餐、工序、材料、机措的数据，计算分类合计
          order.projPackages = {
            totalAmount: 0,
            data: this.orderList[i].projPackages.data.filter(item => {
              if (item.number > 0) {
                item.describe = item.desc;
                // 计算套餐最低起算价
                if (item.amount * item.number < item.minimumPrice) {
                  item.totalAmount = item.minimumPrice;
                } else {
                  item.totalAmount = this.amountToFixed(item.amount * item.number);
                }
                // 一口价 套餐材料用量
                if (item.exts.pricingMethod == '1') {
                  item.materialList.map(material => {
                    // 删除材料中没选择的SKU
                    let skus = [];
                    material.skus.map(sku => {
                      if (sku.number > 0) skus.push(sku);
                    });
                    material.skus = skus;
                  });
                } else {
                  // 非一口价计算套餐内材料用量
                  item.materialList.map(material => {
                    material.number =
                      Math.ceil(
                        (Number(item.number) * material.coefficient) /
                          Number(material.material.spec)
                      ) || 0;
                  });
                }

                return true;
              }
            })
          };
          this.orderList[i].projPackages.data.map(item => {
            if (item.number > 0 && item.editType != '2') {
              // 计算套餐最低起算价
              if (item.amount * item.number < item.minimumPrice) {
                order.projPackages.totalAmount += item.minimumPrice;
              } else {
                order.projPackages.totalAmount += this.amountToFixed(item.amount * item.number);
              }
            }
          });
          order.projPackages.totalAmount = this.amountToFixed(order.projPackages.totalAmount);

          order.procedures = {
            totalAmount: 0,
            data: this.orderList[i].procedures.data.filter(item => {
              if (item.number > 0 && item.editType != '2') {
                item.name = item.content;
                item.describe = item.desc;
                item.amount = item.guideUnitPrice;
                // 计算工序最低起算价
                if (item.guideUnitPrice * item.number < item.minimumGuideTotalPrice) {
                  item.totalAmount = item.minimumGuideTotalPrice;
                } else {
                  item.totalAmount = this.amountToFixed(item.guideUnitPrice * item.number);
                }
                return true;
              }
            })
          };
          this.orderList[i].procedures.data.map(item => {
            if (item.number > 0 && item.editType != '2') {
              // 计算工序最低起算价
              if (item.guideUnitPrice * item.number < item.minimumGuideTotalPrice) {
                order.procedures.totalAmount += item.minimumGuideTotalPrice;
              } else {
                order.procedures.totalAmount += this.amountToFixed(
                  item.guideUnitPrice * item.number
                );
              }
            }
          });
          order.procedures.totalAmount = this.amountToFixed(order.procedures.totalAmount);

          order.materials = {
            totalAmount: 0,
            data: []
          };
          this.orderList[i].materials.data.map(item => {
            if (item.number > 0 && item.editType != '2') {
              if (item.skus && item.skus.length > 0) {
                item.totalAmount = 0;
                // 组装sku材料
                item.skus.map(sku => {
                  if (sku.number > 0) {
                    sku.describe = item.textarea;
                    sku.unit = item.materialUnit;
                    sku.amount = sku.price;
                    sku.totalAmount = this.amountToFixed(sku.price * sku.number);
                    item.totalAmount += sku.totalAmount;
                    order.materials.totalAmount += sku.totalAmount;
                    order.materials.data.push(sku);
                  }
                });
              } else {
                item.describe = item.textarea;
                item.unit = item.materialUnit;
                item.amount = item.price;
                item.totalAmount = this.amountToFixed(item.price * item.number);
                order.materials.totalAmount += item.totalAmount;
                order.materials.data.push(item);
              }
            }
          });

          order.measures = {
            totalAmount: 0,
            data: this.orderList[i].measures.data.filter(item => {
              if (item.number > 0) {
                item.describe = item.desc;
                item.amount = item.guideUnitPrice;
                item.totalAmount = this.amountToFixed(item.guideUnitPrice * item.number);
                return true;
              }
            })
          };
          this.orderList[i].measures.data.map(item => {
            if (item.number > 0) {
              order.measures.totalAmount += this.amountToFixed(item.guideUnitPrice * item.number);
            }
          });

          order.totalAmount =
            order.projPackages.totalAmount +
            order.procedures.totalAmount +
            order.materials.totalAmount +
            order.measures.totalAmount;

          orderListTotalAmount += order.totalAmount;
          orderList.push(order);
        }

        // 整理增项、减项
        let addItems = {
          totalAmount: this.addItems.totalAmount,
          data: this.addItems.data.filter(item => {
            if (item.number > 0) {
              item.amount = item.price;
              item.totalAmount = this.amountToFixed(item.price * item.number);
              return true;
            }
          })
        };
        let deleteItems = {
          totalAmount: this.deleteItems.totalAmount,
          data: this.deleteItems.data.filter(item => {
            if (item.number > 0) {
              item.amount = item.price;
              item.totalAmount = this.amountToFixed(item.price * item.number);
              return true;
            }
          })
        };
        // 计算其他项金额合计
        let otherItemsAmount = this.amountToFixed(addItems.totalAmount + deleteItems.totalAmount);
        // 计算优惠金额（公式：(人材机合计+增减项合计) * (1-折扣) + 优惠金额 + 优惠券）
        let test = this.amountToFixed(
          orderListTotalAmount + addItems.totalAmount + deleteItems.totalAmount
        );
        console.log('折扣前金额：', test);
        let test1 = this.amountToFixed(
          (orderListTotalAmount + addItems.totalAmount + deleteItems.totalAmount) *
            (1 - this.discount)
        );
        console.log('折扣金额：', test1);
        let test2 = this.amountToFixed(
          this.formData.couponsVal || this.formData.exts.couponsVal || 0
        );
        console.log('优惠金额：', this.amountToFixed(this.preferentialAmount) || 0);
        console.log('优惠券金额：', test2);
        let preferentialAmount = this.amountToFixed(
          (orderListTotalAmount + addItems.totalAmount + deleteItems.totalAmount) *
            (1 - this.discount) +
            (this.amountToFixed(this.preferentialAmount) || 0) +
            this.amountToFixed(this.formData.couponsVal || this.formData.exts.couponsVal || 0)
        );
        let bjProducts = {
          orderList,
          addItems,
          deleteItems,
          otherItemsAmount,
          preferentialAmount
        };
        console.log('otherItemsAmount', otherItemsAmount);
        console.log('preferentialAmount', preferentialAmount);
        let productIds = [];
        // type 0代表生成报价,1代表生成订单
        if (type == '0') {
          let params = {
            bjProducts: JSON.stringify(bjProducts),
            productIds: JSON.stringify(productIds), //产品和数量
            otherAmount: this.otherAmount || 0, //其他金额
            originPrice: this.originPrice, //原价
            preferentialAmount: this.preferentialAmount || 0, //优惠金额
            totalPrice: Number(this.totalPrice), //总价
            description: this.description, //备注
            discount: this.amountToFixed(this.amountToFixed(this.discount) * 1), //折扣
            ownerName: this.formData.name, //归属人姓名
            ownerPhone: this.formData.phone, //归属人电话
            serviceAppointmentId: this.sid, //工单id
            type: 0,
            exts: {
              serviceAppointmentNum: this.formData.orderNum || this.formData.serviceAppointmentNum, // 编辑订单时formData存的是订单数据
              coupons: this.formData.coupons || this.formData.exts.coupons || '',
              couponsVal: this.formData.couponsVal || this.formData.exts.couponsVal || 0,
              couponsName: this.formData.couponsName || this.formData.exts.couponsName || ''
            }
          };
          for (let extField of this.extFields) {
            //处理file类型，七牛下载地址为逗号隔开
            if (extField.type == 'file') {
              if (Array.isArray(this.formData[extField.name])) {
                this.formData[extField.name] = this.formData[extField.name]
                  .map(item => item.url)
                  .join(',');
              }
            }
            if (this.formData[extField.name] || this.formData[extField.name] === 0)
              params.exts[extField.name] = this.formData[extField.name];
          }
          this.doSaveOrder(params, '报价');
        } else if ((type = '1')) {
          let params = {
            bjProducts: JSON.stringify(bjProducts),
            productIds: JSON.stringify(productIds), //产品和数量
            otherAmount: this.otherAmount || 0, //其他金额
            originPrice: this.originPrice, //原价
            preferentialAmount: this.preferentialAmount || 0, //优惠金额
            totalPrice: Number(this.totalPrice), //总价
            description: this.description, //备注
            discount: this.amountToFixed(this.amountToFixed(this.discount) * 1), //折扣
            ownerName: this.formData.name, //归属人姓名
            ownerPhone: this.formData.phone, //归属人电话
            serviceAppointmentId: this.sid, //工单id
            type: 1,
            exts: {
              serviceAppointmentNum: this.formData.orderNum || this.formData.serviceAppointmentNum, // 编辑订单时formData存的是订单数据
              coupons: this.formData.coupons || this.formData.exts.coupons || '',
              couponsVal: this.formData.couponsVal || this.formData.exts.couponsVal || 0,
              couponsName: this.formData.couponsName || this.formData.exts.couponsName || ''
            }
          };
          for (let extField of this.extFields) {
            //处理file类型，七牛下载地址为逗号隔开
            if (extField.type == 'file') {
              if (Array.isArray(this.formData[extField.name])) {
                this.formData[extField.name] = this.formData[extField.name]
                  .map(item => item.url)
                  .join(',');
              }
            }
            if (this.formData[extField.name] || this.formData[extField.name] === 0)
              params.exts[extField.name] = this.formData[extField.name];
          }

          if (this.orderData && !this.turnOpenForm) {
            this.doSaveOrder(params, '下单');
          } else {
            this.startWorkflow(
              {
                collectionName: 'order',
                formDataId: null, //表单数据id
                workflowFormDefId: this.workflowFormDefId //小流程的定义id
              },
              workflowSet => {
                params.exts.orphanId = this.orphanId;
                params.workflowId = workflowSet._id;
                this.doSaveOrder(params, '下单');
              }
            );
          }
        }
      });
    },
    //保存订单
    doSaveOrder(params, msg) {
      //当为编辑订单时，将编辑的数据替换
      if (this.orderData && this.orderData._id) {
        params.exts.orphanId = this.orphanId;
        this.orderData.productIds = params.productIds; //产品和数量
        this.orderData.bjProducts = params.bjProducts; //新版人材机套餐增减项json
        this.orderData.otherAmount = params.otherAmount; //其他金额
        this.orderData.originPrice = params.originPrice; //原价
        this.orderData.preferentialAmount = params.preferentialAmount; //优惠金额
        this.orderData.totalPrice = params.totalPrice; //总价
        this.orderData.description = params.description; //备注
        this.orderData.discount = params.discount; //折扣
        if (this.turnOpenForm) {
          this.orderData.type = '1'; //type 0是报价 1为订单
          this.orderData.workflowId = params.workflowId;
        }
        if (this.oldCouponId) {
          //激活优惠券，更换优惠券把已使用的优惠券激活
          let oldCoupons = this.oldCouponId;
          let newCoupons = params.exts.coupons;
          if (oldCoupons != newCoupons) this.activateCoupons(oldCoupons);
        }
        //将扩展字段重新赋值到exts里，并删除多余的exts字段
        this.orderData.exts = params.exts;
        for (let key in this.orderData.exts) {
          delete this.orderData[key];
        }
        this.orderData.processState = '0';
        params = this.orderData;
      }
      // 如果有优惠券则将优惠券状态改为已使用
      if (params.exts.coupons) this.useCoupon(params.exts.coupons);

      // 存储服务类型
      params.exts.serviceType = this.serviceType;
      // 存储信息来源
      params.exts.sourceType = params.exts.sourceType || this.sourceType;

      // 生成报价单
      params.exts.isCreateBjdPDF = '1';
      common.osg.ajax(
        'basic/order/upsert',
        {
          order: JSON.stringify(params)
        },
        res => {
          // 清除暂存数据
          // wx.removeStorageSync('temporaryFormPlaceOrders');
          // this.temporaryFormType = false;
          common.osg.alert(`${msg ? msg : '下单'}成功！`, () => {
            common.osg.closeMe();
          });
        }
      );
    },
    //使用优惠券接口
    useCoupon(id) {
      common.osg.ajax(`basic/couponPrinting/useCoupon/` + id, {}, res => {}, {
        noload: true
      });
    },
    //启动工作流
    startWorkflow(param, callback) {
      let params = {
        collectionName: param.collectionName, //单据名称
        formDataId: param.formDataId, //表单数据id
        workflowFormDefId: param.workflowFormDefId //小流程定义id
      };
      common.osg.ajax(
        `workflow/startWorkflow/${params.collectionName}/${params.formDataId}/${params.workflowFormDefId}`,
        {
          saId: this.sid //工单id
        },
        res => {
          if (callback) callback(res.entity);
        },
        {
          noload: true
        }
      );
    },
    typeClick: function (e) {
      this.setData({
        type: e.currentTarget.dataset.item.value
      });
    },
    //获取当前可用优惠券
    getCoupons(frontEndConfig) {
      let contactsId = this.formData.ownerId || this.formData.contactIds[0];
      let couponPrintingId =
        this.oldCouponId || this.formData.coupons || this.formData.exts.coupons;
      if (!contactsId) {
        common.osg.alert('暂无可用优惠券.！');
        return;
      }
      common.osg.ajax(
        'basic/couponPrinting/queryByPhone.do',
        {
          contactsId,
          couponPrintingId
        },
        res => {
          if (res.data && res.data.length) {
            let ids = [];
            //数组去重
            res.data = res.data.filter(item => {
              if (!ids.includes(item._id)) {
                ids.push(item._id);
                return true;
              }
            });
            this.coupons.fpi.data = res.data.map(item => {
              item.radio = false; //是否选中
              item.detailShow = false; //是否展示详情‘
              return item;
            });
            this.options[frontEndConfig.valueOption] = this.coupons.fpi.data.map(cItem => {
              return {
                label: cItem.title,
                name: cItem.title,
                value: cItem._id
              };
            });
          }
        },
        {
          noload: true
        }
      );
    },
    async onSelectionOpen() {
      // 选择产品前需要先选择
      for (var extField of this.placeOrderFields) {
        if (extField.type == 'switch' && !this.formData[extField.name]) {
          this.formData[extField.name] = '0';
        }
        if (extField.required == '1') {
          if (
            (!this.formData[extField.name] && this.formData[extField.name] !== 0) ||
            (this.formData[extField.name] &&
              Array.isArray(this.formData[extField.name]) &&
              this.formData[extField.name].length == 0)
          ) {
            // 空数组也校验必填
            if (
              extField.frontEndConfig.showField
                ? this.formData[extField.frontEndConfig.showField] ==
                  extField.frontEndConfig.showValue
                : true
            ) {
              common.osg.alert(extField.nameDisp + '为必填项');
              return;
            }
          }
        }
        if (extField.type == 'phone') {
          if (!this.checkMobile(this.formData[extField.name])) {
            common.osg.toast(extField.nameDisp + '格式错误', 'none');
            return;
          }
        } else if (extField.type == 'IDNumber') {
          if (!this.checkIDNumber(this.formData[extField.name])) {
            common.osg.toast(extField.nameDisp + '格式错误', 'none');
            return;
          }
        }
        // 取消七牛云压缩参数
        if (extField.type == 'file') {
          if (Array.isArray(this.formData[extField.name])) {
            for (let obj of this.formData[extField.name]) {
              if (obj.url.indexOf('?') != -1) {
                obj.url = obj.url.substring(0, obj.url.indexOf('?'));
              }
            }
          }
        }
      }

      this.orderList.push({
        repairParts: this.formData.repairParts || this.options.refreshParts[0].value,
        // constructionLocation:
        //   this.serviceType == '21' || this.serviceType == '22'
        //     ? this.formData.constructionLocation
        //     : this.formatRepairParts(this.formData.repairParts),
        // otherConstructionLocation: this.formData.otherConstructionLocation,
        partDescription: this.formData.partDescription,
        constructionSite: this.formData.constructionSite,
        maintainAreaNum: this.formData.maintainAreaNum,
        projPackages: {
          searchValue: '',
          repairPart: '',
          agelimit: '',
          data: [],
          totalAmount: 0,
          openMaterials: false,
          currentMaterials: [],
          openProcedures: false,
          currentProcedures: []
        }, // 套餐
        procedures: { searchValue: '', type: '', data: [], totalAmount: 0 }, // 工序
        materials: {
          searchValue: '',
          type: '',
          data: [],
          totalAmount: 0,
          openMaterialDetail: false,
          currentName: '',
          currentDetail: ''
        }, // 材料
        measures: { searchValue: '', type: '', data: [], totalAmount: 0 } // 机措
      });
      console.log('是否在这里默认复制部位', this.orderList);
      console.log('this.options', this.options);
      console.log('部位反显', this.formatRepairParts('1'));
      // 当前小订单
      this.orderIndex = this.orderList.length - 1;
      this.selectorShow = true;
      this.orderListShow = false;
      // 编辑订单时 或者新增订单未查询时 需要请求数据
      if (this.orderId || this.orderList[this.orderIndex].projPackages.data.length == 0) {
        await new Promise(resolve => {
          this.getProjPackages(() => {
            console.log(1);
            resolve();
          });
        });
      }
      if (this.orderId || this.orderList[this.orderIndex].procedures.data.length == 0) {
        await new Promise(resolve => {
          this.getProcedures(() => {
            resolve();
          });
        });
      }
      if (this.orderId || this.orderList[this.orderIndex].materials.data.length == 0) {
        await new Promise(resolve => {
          this.getMaterials(() => {
            resolve();
          });
        });
      }
      if (this.orderId || this.orderList[this.orderIndex].measures.data.length == 0) {
        await new Promise(resolve => {
          this.getMeasures(() => {
            resolve();
          });
        });
      }
      // 防水维修清空部位描述
      if (this.serviceType == '11' || this.serviceType == '12' || this.serviceType == '40')
        this.$set(this.formData, 'partDescription', '');
      this.$set(this.formData, 'constructionSite', '');
      this.$set(this.formData, 'maintainAreaNum', '');
      // #ifdef APP-PLUS
      this.$forceUpdate();
      // #endif
    },
    onSelectionClose() {
      this.orderListShow = true;
      this.selectorShow = false;

      // 匹配套餐质保年限，如选择多个套餐则取其中最小的质保年限。
      let order = this.orderList[this.orderIndex];
      let projPackageIds = [];
      let agelimit = 10;
      order.projPackages.data.map(item => {
        if (item.number > 0) {
          projPackageIds.push(item._id);
          if (!item.agelimit || item.agelimit < agelimit) {
            agelimit = item.agelimit || 0;
          }
        }
      });
      //没有选择套餐的情况下
      if (projPackageIds.length == 0) {
        agelimit = this.serviceType === '40' ? 1 : 0;
        if (this.sourceType == '6' || this.sourceType == '7') {
          // 吉柿不选择套餐也允许自由选择质保年限
          this.$set(this.orderList[this.orderIndex], 'agelimitMax', 10);
          // 刷新服务不弹窗
          if (!agelimit)
            common.osg.alert('当前小订单未选择套餐，无法自动匹配质保年限，请手动选择。');
        } else {
          this.$set(this.orderList[this.orderIndex], 'agelimitMax', 0);
          // 刷新服务不弹窗
          if (!agelimit) common.osg.alert('当前小订单未选择套餐，无法自动匹配质保年限。');
        }
      } else {
        this.$set(this.orderList[this.orderIndex], 'agelimitMax', agelimit || 0);
      }
      this.$set(this.orderList[this.orderIndex], 'agelimit', agelimit || 0);
    },
    // 编辑小订单
    orderEdit(i) {
      this.orderIndex = i;

      // 编辑订单时 或者新增订单未查询时 需要请求数据
      if (this.orderId || this.orderList[this.orderIndex].projPackages.data.length == 0) {
        this.getProjPackages();
      }
      if (this.orderId || this.orderList[this.orderIndex].procedures.data.length == 0) {
        this.getProcedures();
      }
      if (this.orderId || this.orderList[this.orderIndex].materials.data.length == 0) {
        this.getMaterials();
      }
      if (this.orderId || this.orderList[this.orderIndex].measures.data.length == 0) {
        this.getMeasures();
      }

      this.selectorShow = true;
    },
    // 删除小订单
    orderRemove(i) {
      common.osg.confirm('是否确认删除当前部位的产品？', () => {
        this.orderIndex = 0;
        this.orderList.splice(i, 1);
      });
      this.calcTotalPrice();
    },
    orderConstructionSiteChange(e, orderIndex) {
      this.orderList[orderIndex][constructionSite] = e.detail;
    },
    cascadeConfirm(e) {
      let field = this.cascade.field;
      let selectedOptions = [];
      // #ifdef MP-WEIXIN
      selectedOptions = e.detail.selectedOptions;
      // #endif

      // #ifdef APP-PLUS
      selectedOptions = e.detail.value;
      // #endif

      if (this.cascade.type == 'order') {
        this.orderList[this.cascade.orderIndex][field] = selectedOptions.map(item => item.value);
      } else {
        this.formData[field] = selectedOptions.map(item => item.value);
      }
      this.cascade.show = false;
    },
    cascadeClose(e) {
      this.cascade.show = false;
    },
    cascadeChange(event) {
      const {
        picker,
        value,
        index //当前选择第几列
      } = event.detail;
      let Indexes = picker.getIndexes(); //获取选择的索引，类型是数组
      let cascadeArr = common.osg.deepCopy(this.cascade.actions);
      let pitch = cascadeArr[index].values[Indexes[index]];
      if (pitch.children) {
        //选中列有子项才刷新列
        picker.setColumnValues(index + 1, pitch.children); //刷新列的值
      } else {
        picker.setColumnValues(index + 1, []); //刷新列的值
      }
    },
    toViewDescription(msg) {
      Toast({ message: msg, duration: 5000 });
    },
    //保留两位小数的金额
    amountToFixed(money) {
      if (!money) return 0;
      let resultAmount = +(+money).toFixed(2);
      return resultAmount ? resultAmount : 0;
    },
    // 触发事件
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
        // console.log(common.osg.codelabel(options.option, options.value))
        return common.osg.codelabel(options.option, options.value);
      } else if (eventName == 'button') {
        let func = options.extField.frontEndConfig.func;
        if (func) {
          this[func]();
        }
      } else if (eventName == 'cascade') {
        let value = options.value;
        let ops = options.option;
        if (Array.isArray(value)) {
          let result = '';
          for (let item of value) {
            result += common.osg.codelabel(ops, item) + '/';
          }
          return result.substring(0, result.length - 1); //删除最后字符
        }
      } else if (eventName == 'coupons') {
        return common.osg.codelabel('coupons', options.value);
      }
    },
    // 点击折扣
    onClickDiscount() {
      this.discountSheet.show = true;
    },
    // 表单字段 点击
    onClick(e) {
      let extField = e.target.dataset.extfield;
      let type = e.target.dataset.extfield.type;
      let field = e.target.dataset.extfield.name;
      let value = e.detail;
      let valueOption = e.target.dataset.extfield.valueOption;
      let frontEndConfig = e.target.dataset.extfield.frontEndConfig;

      if (type == 'date' || type == 'time' || type == 'datetime') {
        this.datetime = {
          type,
          field,
          value: type == 'time' ? '12:00' : new Date().getTime(),
          show: true
        };
      } else if (type == 'select') {
        if (field == 'contractType' && this.orderData && this.orderData.contractId) {
          common.osg.confirm(
            '该订单已有关联合同，需要取消合同才能修改合同类型，是否确认取消合同？',
            () => {
              this.cancellationShow = true;
            }
          );
          return;
        }
        //下拉配置了优惠券
        if (frontEndConfig && frontEndConfig.coupons) {
          this.coupons.show = true;
          this.coupons.field = field;
          //获取优惠券id反显
          let couponsId = this.formData.coupons || this.formData.exts.coupons;
          // this.getCoupons();//获取优惠券列表
          if (couponsId) {
            this.coupons.fpi.data = this.coupons.fpi.data.map(item => {
              if (couponsId == item._id) item.radio = true; //是否选中
              return item;
            });
          }
          // this.$forceUpdate();
        } else {
          this.actionSheet = {
            actions: this.options[valueOption].filter(actionItem => !actionItem.hide),
            field: field,
            type: '', //默认为空，type=addItem自定义项
            show: true
          };
        }
      } else if (type == 'cascade') {
        this.cascade = {
          actions: this.options[valueOption],
          field: field,
          type: '',
          value:
            this.formData[field] && this.formData[field].length > 0
              ? this.formData[field][this.formData[field].length - 1]
              : '',
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
              show: false,
              cascade: false //级联
            };
            this.actionSheet.show = true;
          }
        );
      } else if (type == 'area') {
        this.area.field = field;
        this.area.show = true;
      }
      // this.$forceUpdate();
    },
    // 删除空数组
    removeEmpty(arr) {
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.children ? item.children.length === 0 : false) {
            delete item.children;
          } else {
            this.removeEmpty(item.children);
          }
        });
        return arr;
      }
    },
    //折扣关闭
    discountClose() {
      this.discountSheet.show = false;
    },
    // 折扣选择
    discountSelect(e) {
      this.discount = e.detail.value;
      this.calcTotalPrice();
    },
    /**
     * 上拉菜单取消
     */
    actionSheetClose() {
      this.actionSheet.show = false;
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
      // this.$forceUpdate();
    },
    //生成报价
    // generateQuotation() {
    //   common.osg.toast('此功能当前已停用', 'none');
    //   return;
    //   this.placeOrder(0);
    // },
    // 提交订单表单按钮
    submitOrder() {
      for (let order of this.orderList) {
        if (!order.partDescription) {
          common.osg.toast('请填写部位描述', 'none');
          return;
        }
        if (!order.maintainAreaNum) {
          common.osg.toast('请填写质保工程量', 'none');
          return;
        }
      }
      this.fillOrder();
    },
    //完善订单信息
    fillOrder(type, callback) {
      if (this.calcTotalPrice() < 0) {
        common.osg.alert('合计不能为负!');
        return;
      }

      for (let i = 0; i < this.addItems.data.length; i++) {
        if (this.addItems.data[i].number > 0 && !this.addItems.data[i].name) {
          common.osg.toast('请输入自定义增项名称', 'none');
          return;
        }
      }
      for (let i = 0; i < this.deleteItems.data.length; i++) {
        if (this.deleteItems.data[i].number > 0 && !this.deleteItems.data[i].name) {
          common.osg.toast('请输入自定义减项名称', 'none');
          return;
        }
      }

      if (this.orderList.length == 0) {
        common.osg.alert('请至少选择一个产品!');
        return;
      }

      for (let i = 0; i < this.orderList.length; i++) {
        let order = this.orderList[i];
        if (!order.projPackages.data.find(item => item.number > 0)) {
          if (
            !order.procedures.data.find(item => item.number > 0) &&
            !order.materials.data.find(item => item.number > 0)
          ) {
            common.osg.alert('请至少选择1个材料和1个工序！');
            return;
          }
          if (!order.materials.data.find(item => item.number > 0)) {
            common.osg.alert('请至少选择1个材料！');
            return;
          }
          if (!order.procedures.data.find(item => item.number > 0)) {
            common.osg.alert('请至少选择1个工序！');
            return;
          }
        }
      }

      // 清空防水维修部位
      this.formData.repairParts = [];
      // this.formData.constructionLocation = '';
      // :TODO 面积单位从选择产品身上取值
      this.formData.partUnit = '1';
      if (this.type == '0') {
        this.quote();
        return;
      }
      //填充表单
      this.fillField(data => {
        let isGetCoupons = false; //获取优惠券
        if (data) {
          for (let key in data) {
            for (let extField of this.extFields) {
              if (extField.type == 'select') {
                // dynamicOption，有这个配置字段将获取到的值，放到可让选择的list里
                if (
                  extField.frontEndConfig &&
                  extField.frontEndConfig.dynamicOption &&
                  key == extField.name
                ) {
                  let arr = common.osg.isJson(data[key]) ? JSON.parse(data[key]) : data[key];
                  this.options[extField.valueOption] = this.options[extField.valueOption].filter(
                    item => arr.includes(item.value)
                  );
                  try {
                    data[key] =
                      typeof data[key] == 'string'
                        ? data[key]
                        : this.options[extField.valueOption][0].value;
                  } catch (e) {
                    console.log('error,没有找到扩展字典表的数据');
                    //TODO handle the exception
                  }
                }
                if (extField.type == 'select') {
                  //给配置upperLimit（上限）添加hide属性，选择的时候隐藏
                  if (extField.frontEndConfig && extField.frontEndConfig.upperLimit) {
                    let maxNum = 0;
                    this.options[extField.valueOption] = this.options[extField.valueOption].map(
                      xitem => {
                        xitem.hide = false;
                        if (+xitem.value) {
                          if (!(+xitem.value <= +data[extField.name])) {
                            xitem.hide = true;
                          }
                        }
                        if (!xitem.hide) maxNum = +maxNum <= +xitem.value ? xitem.value : maxNum;
                        return xitem;
                      }
                    );
                    this.formData[extField.name] = +this.formData[extField.name];
                    if (maxNum < this.formData[extField.name])
                      this.formData[extField.name] = maxNum;
                  }
                  if (extField.frontEndConfig && extField.frontEndConfig.coupons && !isGetCoupons) {
                    isGetCoupons = true;
                    this.getCoupons(extField.frontEndConfig); //获取优惠券列表
                  }
                }
              }
            }
            this.formData[key] =
              this.formData[key] || this.formData[key] === 0 ? this.formData[key] : data[key];
            // 每次都更新质保年限
            if (key == 'agelimit') this.formData[key] = data[key];
          }
        }

        for (let extField of this.submitOrderFields) {
          if (extField.type == 'file') {
            if (!Array.isArray(this.formData[extField.name]) && this.formData[extField.name]) {
              let arr = this.formData[extField.name].split(',');
              if (Array.isArray(arr)) {
                this.$set(
                  this.formData,
                  [extField.name],
                  arr.map(item => {
                    return {
                      url: item
                    };
                  })
                );
              }
            }
          }
        }
        // common.osg.alert(
        //   '委托方信息需为真实有效信息，姓名与联系方式、身份证、公司名称与企业营业执照信息保持一致。！'
        // );
        this.$forceUpdate();
        this.openForm = true;
        this.getPartner();
      });

      // 默认客户类型为“客户”
      this.formData.personType = this.formData.personType || '0';
      if (callback) callback();
    },
    //填充表单字段
    fillField(callback) {
      let user = wx.getStorageSync('user');
      let params = {
        ext: 'order', //扩展标示
        saId: this.sid, //工单Id
        productId: [], //产品Id，是个数组
        partnerId: user.partnerIds[0] || '' //伙伴Id
      };

      common.osg.ajax('basic/order/fillField', params, res => {
        if (callback) callback(res.data);
      });
    },
    //获取user身上的partnerId
    getUserPartnerId() {
      common.osg.ajax('/function/query', {}, res => {
        let user = wx.getStorageSync('user');
        user.partnerIds = res.data.user.partnerIds;
        this.partnerId = res.data.user.partnerIds[0];
        wx.setStorageSync('user', user);
      });
    },
    //关闭表单弹窗
    closeForm() {
      this.openForm = false;
    },
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
      // common.osg.afterRead(
      //   e,
      //   this,
      //   extfield.frontEndConfig.max,
      //   this.formData[extfield.name].length
      // );
      // common.osg.afterRead(e, this, this.longitude, this.latitude);
      common.osg.afterRead(e, this);
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
    //关闭增减项数量
    increaseDecreaseOnClose() {
      this.increaseDecreaseShow = false;
    },
    //减少数量确认
    increaseDecreaseConfirm() {
      let nowId = this.increaseDecreaseActive._id;
      //找到相同ID
      let items = this.items.filter(item => item.selected && item._id == nowId);
      // console.log(this.increaseDecreaseActive, items, '减少数量确认');
      //找到相同ID，总数量相加大于0说明，没有超过原产品的数量
      let total = 0;
      let isMinus = false;
      for (let item of items) {
        total = total + +item.number;
      }
      if (total <= 0) isMinus = true;
      if (isMinus) {
        common.osg.alert('添加失败！减少数量不能比原项大！');
      } else {
        this.increaseDecreaseShow = false;
        // console.log(this.increaseDecreaseNum);
        this.increaseDecreaseActive.exts.laterItem = this.increaseDecreaseActive._id;
        this.increaseDecreaseActive.number = -Math.abs(this.increaseDecreaseNum);
        // delete this.increaseDecreaseActive._id;
        this.items.push(this.increaseDecreaseActive);
        // console.log(this.increaseDecreaseActive);
      }
      this.increaseDecreaseNum = 1;
    },
    //减项数量的按钮
    increaseDecreaseBtn(e, item) {
      this.increaseDecreaseShow = true;
      // console.log(item);
      // console.log(this.increaseDecreaseShow);
      item.editType = this.editType;
      this.increaseDecreaseActive = common.osg.deepCopy(item);
      this.increaseDecreaseMax = item.number;
    },
    //修改减项数量
    increaseDecreaseNumChange(e) {
      this.increaseDecreaseNum = e.detail;
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
        this.formData[this.datetime.field] = this.formattTime(value);
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
    // 选择省市区 提交
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
      this.formData[field || this.area.field] = areaVal; //adcode的数组
      this.area.show = false;
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
    },
    //优惠券查看详情
    couponDetailClick(item) {
      item.detailShow = !item.detailShow;
      this.$forceUpdate();
    },
    //优惠券类型点击
    couponTypeClick(val) {
      if (this.couponTypes == val) {
        this.couponTypes = '';
      } else {
        this.couponTypes = val;
      }
    },
    //关闭优惠券弹窗
    closeCoupon() {
      this.coupons.show = false;
    },
    //确定选择优惠券
    saveCoupon() {
      let titleStr = '';
      let valueStr = '';
      let nameStr = '';
      let index = 0;
      this.coupons.fpi.data = this.coupons.fpi.data.map(item => {
        if (item.radio) {
          if (this.totalPrice + (Number(this.formData.couponsVal) || 0) < item.prerequisites) {
            common.osg.alert('已选优惠券不满足使用条件，将会被取消选中！');
            item.radio = false;
          } else {
            index++;
            titleStr += item._id;
            valueStr += item.value;
            nameStr += item.title;
          }
        }
        return item;
      });
      if (index > 1) {
        common.osg.alert('有多张优惠券被选中，请联系管理员！');
      }
      if (this.coupons.field) {
        this.formData[this.coupons.field] = titleStr;
        this.formData[this.coupons.field + 'Val'] = valueStr;
        this.formData[this.coupons.field + 'Name'] = nameStr;
        delete this.formData.exts[this.coupons.field]; //删除旧的编辑来的
        delete this.formData.exts[this.coupons.field + 'Val']; //删除旧的编辑来的
        delete this.formData.exts[this.coupons.field + 'Name']; //删除旧的编辑来的
      }
      this.calcTotalPrice();
      this.$forceUpdate();
      this.coupons.show = false;
    },
    //选中优惠券
    couponRadioChange(e, index, row) {
      row.radio = !row.radio;
    },
    //激活优惠券
    activateCoupons(couponsId) {
      common.osg.ajax('basic/couponPrinting/activation/' + couponsId, {}, res => {});
    },
    //取消合同接口
    cancelContractAjax() {
      if (!this.cancelContractData.reasonCancellation) {
        common.osg.toast('取消合同原因不能为空!', 'none');
        return;
      }
      this.cancellationShow = false;
      common.osg.ajax(
        'basic/contract/remove',
        {
          id: this.orderData.contractId,
          cancelReason: this.cancelContractData.reasonCancellation
        },
        res => {
          this.cancelContractData.reasonCancellation = '';
          common.osg.alert('操作成功', () => {
            common.osg.closeMe(); //关闭当前页面
          });
        }
      );
    },
    //合同原因change事件
    reasonCancellationChange(e) {
      this.cancelContractData.reasonCancellation = e.detail;
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    previewImage(filePath) {
      wx.previewImage({
        current: filePath, // 当前显示图片的http链接
        urls: [filePath] // 需要预览的图片http链接列表
      });
    },
    // 增项
    addItem() {
      let addTemplate = {
        name: '',
        price: 1,
        number: 1,
        unit: '1',
        editType: '0'
      };
      if (this.editType == '2') addTemplate.exts.laterItem = true;
      this.addItems.data.push(addTemplate);
      this.calcTotalPrice();
    },
    // 减项
    deleteItem() {
      let addTemplate = {
        name: '',
        price: -1,
        number: 1,
        unit: '1',
        editType: 0
      };
      if (this.editType == '2') addTemplate.exts.laterItem = true;
      this.deleteItems.data.push(addTemplate);
      this.calcTotalPrice();
    },
    //修改自定义项
    customItemchange(e, item) {
      item.name = e.detail;
    },
    // 修改优惠金额
    minus(e) {
      // #ifdef MP-WEIXIN
      if (Number(e.detail) > Number(this.originPrice)) {
        common.osg.toast('优惠金额不能大于原价!', 'none');
        this.preferentialAmount = 0;
      } else {
        this.preferentialAmount = e.detail;
      }
      // #endif
      // #ifdef APP-PLUS
      if (Number(e.detail.value) > Number(this.originPrice)) {
        common.osg.toast('优惠金额不能大于原价!', 'none');
        this.preferentialAmount = 0;
      } else {
        this.preferentialAmount = e.detail.value;
      }
      // #endif
      this.calcTotalPrice();
    },
    // 获取套餐列表
    getProjPackages(callback) {
      common.osg.ajax(
        'biz/projPackage/queryWithRank',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'in:serviceType|array#and': this.serviceType,
          sourceType: this.sourceType,
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          for (let i = 0; i < res.data.length; i++) {
            // 简化套餐数据，只保留用到的字段
            let item = res.data[i];
            res.data[i] = {
              _id: item._id,
              orgId: item.orgId,
              orgName: item.orgName,
              type: item.type,
              name: item.name,
              desc: item.desc,
              price: item.price,
              amount: item.price,
              unit: item.unit,
              agelimit: item.agelimit,
              minimumPrice: item.minimumPrice,
              measureList: item.measureList,
              procedureList: item.procedureList,
              materialList: item.materialList,
              skuCode: item.skuCode,
              number: 0,
              exts: {
                images:
                  item.exts.images && common.osg.isJson(item.exts.images)
                    ? JSON.parse(item.exts.images).map(image => {
                        return { url: image.url };
                      })
                    : [],
                spuCode: item.exts.spuCode,
                repairParts: item.exts.repairParts,
                constructionParts: item.exts.constructionParts,
                constructionMethod: item.exts.constructionMethod || []
              }
            };

            // 编辑订单时已选择的套餐覆盖新套餐
            for (let j = 0; j < this.orderList[this.orderIndex].projPackages.data.length; j++) {
              if (res.data[i]._id == this.orderList[this.orderIndex].projPackages.data[j]._id) {
                res.data[i] = common.osg.deepCopy(
                  this.orderList[this.orderIndex].projPackages.data[j]
                );
                break;
              }
            }
          }
          this.orderList[this.orderIndex].projPackages.data = res.data;
          if (callback) callback();
        },
        { noload: true }
      );
    },
    // 获取工序列表
    getProcedures(callback) {
      common.osg.ajax(
        'biz/procedure/queryWithRank',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'in:serviceType|array#and': this.serviceType,
          sourceType: this.sourceType,
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          for (let i = 0; i < res.data.length; i++) {
            // 简化工序数据，只保留用到的字段
            let item = res.data[i];
            res.data[i] = {
              _id: item._id,
              orgId: item.orgId,
              orgName: item.orgName,
              name: item.name,
              content: item.name,
              shbCode: item.shbCode,
              desc: item.desc,
              unit: item.unit,
              guideUnitPrice: item.guideUnitPrice,
              minimumGuideTotalPrice: item.minimumGuideTotalPrice,
              processStepDefinitions: item.processStepDefinitions || [],
              isAccepted: item.isAccepted,
              number: 0,
              imagesDescription: item.exts.imagesDescription || '',
              exts: {
                images:
                  item.exts.images && common.osg.isJson(item.exts.images)
                    ? JSON.parse(item.exts.images).map(image => {
                        return { url: image.url };
                      })
                    : [],
                repairParts: item.exts.repairParts,
                constructionParts: item.exts.constructionParts,
                constructionMethod: item.exts.constructionMethod || [],
                imagesDescription: item.exts.imagesDescription || '',
                prompt: item.exts.prompt || ''
              }
            };

            // 保留已选择工序不覆盖
            for (let j = 0; j < this.orderList[this.orderIndex].procedures.data.length; j++) {
              if (res.data[i]._id == this.orderList[this.orderIndex].procedures.data[j]._id) {
                res.data[i] = common.osg.deepCopy(
                  this.orderList[this.orderIndex].procedures.data[j]
                );
                break;
              }
            }
          }
          this.orderList[this.orderIndex].procedures.data = res.data;
          if (callback) callback();
        },
        { noload: true }
      );
    },
    // 获取材料列表
    getMaterials(callback) {
      common.osg.ajax(
        'basic/material/queryWithRank',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'in:serviceType|array#and': this.serviceType,
          sourceType: this.sourceType,
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          for (let i = 0; i < res.data.length; i++) {
            // 简化材料数据，只保留用到的字段
            let item = res.data[i];
            res.data[i] = {
              _id: item._id,
              orgId: item.orgId,
              orgName: item.orgName,
              name: item.name,
              code: item.code,
              shbCode: item.shbCode,
              materialUnit: item.materialUnit,
              unit: item.unit,
              images:
                item.images && common.osg.isJson(item.images)
                  ? JSON.parse(item.images).map(image => {
                      return { url: image.url };
                    })
                  : [],
              type: item.type,
              price: item.price,
              serviceCostPrice: item.serviceCostPrice,
              spec: item.spec,
              specUnit: item.specUnit,
              number: 0,
              exts: {
                commonName: item.exts.commonName,
                attributeValues: {}
              }
            };

            // 保留已选择材料不覆盖
            for (let j = 0; j < this.orderList[this.orderIndex].materials.data.length; j++) {
              if (res.data[i]._id == this.orderList[this.orderIndex].materials.data[j]._id) {
                res.data[i] = this.orderList[this.orderIndex].materials.data[j];
                break;
              }
            }
          }
          this.orderList[this.orderIndex].materials.data = res.data;
          if (callback) callback();
        },
        { noload: true }
      );
    },
    // 获取机措列表
    getMeasures(callback) {
      common.osg.ajax(
        'biz/measure/queryWithRank',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'in:serviceType|array#and': this.serviceType,
          sourceType: this.sourceType,
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          for (let i = 0; i < res.data.length; i++) {
            // 简化机措数据，只保留用到的字段
            let item = res.data[i];
            res.data[i] = {
              _id: item._id,
              orgId: item.orgId,
              orgName: item.orgName,
              name: item.name,
              content: item.name,
              shbCode: item.shbCode,
              desc: item.desc,
              unit: item.unit,
              guideUnitPrice: item.guideUnitPrice,
              cost: item.cost,
              number: 0,
              exts: {
                images:
                  item.exts.images && common.osg.isJson(item.exts.images)
                    ? JSON.parse(item.exts.images).map(image => {
                        return { url: image.url };
                      })
                    : []
              },
              images:
                item.exts.images && common.osg.isJson(item.exts.images)
                  ? JSON.parse(item.exts.images).map(image => {
                      return { url: image.url };
                    })
                  : []
            };

            // 保留已选择机措不覆盖
            for (let j = 0; j < this.orderList[this.orderIndex].measures.data.length; j++) {
              if (res.data[i]._id == this.orderList[this.orderIndex].measures.data[j]._id) {
                res.data[i] = this.orderList[this.orderIndex].measures.data[j];
                break;
              }
            }
          }
          this.orderList[this.orderIndex].measures.data = res.data;
          if (callback) callback();
        },
        { noload: true }
      );
    },
    openProcedures(products) {
      this.projPackages.currentProcedures = products;
      this.projPackages.openProcedures = true;
    },
    openMaterials(materials) {
      this.projPackages.currentMaterials = materials;
      this.projPackages.openMaterials = true;
    },
    openMaterialDetail(name, detail) {
      this.materials.currentName = name;
      this.materials.currentDetail = detail.replace(/<img /g, '<br><img style="max-width:100%" ');
      this.materials.openMaterialDetail = true;
    },
    onSearch(e, type) {
      this.orderList[this.orderIndex][type].searchValue = e.detail;
    },
    tabChange(e) {
      this.activeTab = e.detail.name;
    },
    // 加减数量
    numberChange(e, item, type, orderIndex) {
      item.number = Number(e.detail) || 0;
      this.calcTotalPrice();

      // 当套餐数量改为0时，触发重新计算最低质保年限
      if (type == 'projPackage' && item.number == 0) {
        // 匹配套餐质保年限，如选择多个套餐则取其中最小的质保年限。
        let order = this.orderList[orderIndex];
        let projPackageIds = [];
        let agelimit = 10;
        order.projPackages.data.map(item => {
          if (item.number > 0) {
            projPackageIds.push(item._id);
            if (!item.agelimit || item.agelimit < agelimit) {
              agelimit = item.agelimit || 0;
            }
          }
        });
        if (projPackageIds.length == 0) {
          agelimit = 0;
          common.osg.alert('当前小订单未选择套餐，无法自动匹配质保年限，请手动选择。');
          this.$set(this.orderList[orderIndex], 'agelimitMax', 10);
        } else {
          this.$set(this.orderList[orderIndex], 'agelimitMax', agelimit || 0);
        }
        this.$set(this.orderList[orderIndex], 'agelimit', agelimit || 0);
      }
    },
    selectorPlus(item, type) {
      if (
        (type == 'projPackages' || type == 'procedures') &&
        this.orderList[this.orderIndex].maintainAreaNum
      ) {
        item.number = Number(this.orderList[this.orderIndex].maintainAreaNum);
      } else {
        item.number = item.number + 1;
      }
      this.calcTotalPrice();
    },
    calcTotalPrice() {
      let totalPrice = 0;
      for (let i = 0; i < this.orderList.length; i++) {
        // 计算套餐价
        for (let item of this.orderList[i].projPackages.data) {
          if (item.number > 0) {
            // 计算套餐内材料加价总和
            item.markup = 0;
            item.materialList.map(m => {
              if (m.exts.price > 0) {
                item.markup += m.exts.price;
              }
            });
            console.log(`套餐${item.name}加价总和为¥${item.markup}`);
            item.amount = item.price + item.markup;
            // 计算套餐最低起算价
            if (item.amount * item.number < item.minimumPrice) {
              totalPrice += item.minimumPrice;
            } else {
              totalPrice += item.amount * item.number;
            }
          } else {
            item.amount = item.price;
          }
        }
        // 计算工序价
        for (let item of this.orderList[i].procedures.data) {
          if (item.number > 0) {
            // 计算工序最低起算价
            if (item.guideUnitPrice * item.number < item.minimumGuideTotalPrice) {
              totalPrice += item.minimumGuideTotalPrice;
            } else {
              totalPrice += item.guideUnitPrice * item.number;
            }
          }
        }
        // 计算材料
        for (let item of this.orderList[i].materials.data) {
          if (item.number > 0) {
            if (item.skus && item.skus.length > 0) {
              let skuTotalPrice = 0;
              item.skus.map(sku => {
                if (sku.number > 0) {
                  skuTotalPrice += (sku.price || 0) * sku.number;
                }
              });
              totalPrice += skuTotalPrice;
            } else {
              totalPrice += (item.price || 0) * item.number;
            }
          }
        }

        // 计算机措
        for (let item of this.orderList[i].measures.data) {
          if (item.number > 0) {
            totalPrice += item.guideUnitPrice * item.number;
          }
        }
      }
      // 计算增项
      for (let item of this.addItems.data) {
        if (item.number > 0) {
          totalPrice += item.price * item.number;
        }
      }
      // 计算减项
      for (let item of this.deleteItems.data) {
        if (item.number > 0) {
          totalPrice += item.price * item.number;
        }
      }
      // 赋值原价
      this.originPrice = this.amountToFixed(totalPrice);
      // 减去优惠券金额
      let couponsVal = this.formData.couponsVal || this.formData.exts.couponsVal;
      totalPrice =
        this.amountToFixed(this.amountToFixed(totalPrice) - this.amountToFixed(couponsVal)) || 0;
      // 计算折扣后金额
      totalPrice = this.amountToFixed(
        this.amountToFixed(totalPrice) * this.amountToFixed(this.amountToFixed(this.discount))
      );
      // 计算折扣的金额
      // 减去优惠金额
      totalPrice =
        this.amountToFixed(
          this.amountToFixed(totalPrice) - this.amountToFixed(this.preferentialAmount)
        ) || 0;
      // 赋值总价
      this.totalPrice = totalPrice;
      // this.$forceUpdate();
      return totalPrice;
    },
    projPackageTypeCount(type) {
      if (this.orderList.length == 0) return;
      // 过滤的部位一级
      let count = 0;
      for (let i = 0; i < this.orderList[this.orderIndex].projPackages.data.length; i++) {
        let item = this.orderList[this.orderIndex].projPackages.data[i];
        if (
          item.number > 0 &&
          item.editType != '2' &&
          item.exts &&
          item.exts.repairParts &&
          item.exts.repairParts.indexOf(`"${type}"`) != -1
        ) {
          count += item.number;
        }
      }
      return this.amountToFixed(count);
    },
    projPackageCount(projPackages) {
      if (this.orderList.length == 0) return;
      projPackages = projPackages || this.orderList[this.orderIndex].projPackages || {};
      // 过滤的部位一级
      let count = 0;
      for (let i = 0; i < projPackages.data.length; i++) {
        let item = projPackages.data[i];
        if (item.number > 0 && item.editType != '2') {
          count += item.number;
        }
      }
      // 导致死循环
      // this.orderList[this.orderIndex].projPackages.totalAmount = this.amountToFixed(totalAmount);
      return this.amountToFixed(count);
    },
    projPackageTotalAmount(projPackages) {
      if (this.orderList.length == 0) return;
      projPackages = projPackages || this.orderList[this.orderIndex].projPackages || {};
      // 过滤的部位一级
      let totalAmount = 0;
      for (let i = 0; i < projPackages.data.length; i++) {
        let item = projPackages.data[i];
        if (item.number > 0 && item.editType != '2') {
          // 计算套餐最低起算价
          if (item.amount * item.number < item.minimumPrice) {
            totalAmount += item.minimumPrice;
          } else {
            totalAmount += this.amountToFixed(item.amount * item.number);
          }
        }
      }
      return this.amountToFixed(totalAmount);
    },
    procedureCount(procedures) {
      if (this.orderList.length == 0) return;
      procedures = procedures || this.orderList[this.orderIndex].procedures || {};
      let count = 0;
      for (let i = 0; i < procedures.data.length; i++) {
        let item = procedures.data[i];
        if (item.number > 0 && item.editType != '2') {
          count += item.number;
        }
      }
      return this.amountToFixed(count);
    },
    procedureTotalAmount(procedures) {
      if (this.orderList.length == 0) return;
      procedures = procedures || this.orderList[this.orderIndex].procedures || {};
      let totalAmount = 0;
      for (let i = 0; i < procedures.data.length; i++) {
        let item = procedures.data[i];
        if (item.number > 0 && item.editType != '2') {
          // 计算工序最低起算价
          if (item.guideUnitPrice * item.number < item.minimumGuideTotalPrice) {
            totalAmount += item.minimumGuideTotalPrice;
          } else {
            totalAmount += this.amountToFixed(item.guideUnitPrice * item.number);
          }
        }
      }
      return this.amountToFixed(totalAmount);
    },
    procedureTypeCount(type) {
      if (this.orderList.length == 0) return;
      // 过滤的部位一级
      let count = 0;
      for (let i = 0; i < this.orderList[this.orderIndex].procedures.data.length; i++) {
        let item = this.orderList[this.orderIndex].procedures.data[i];
        if (
          item.number > 0 &&
          item.editType != '2' &&
          item.exts &&
          item.exts.repairParts &&
          item.exts.repairParts.indexOf(`"${type}`) != -1
        ) {
          count += item.number;
        }
      }
      return this.amountToFixed(count);
    },
    materialCount(materials) {
      if (this.orderList.length == 0) return;
      materials = materials || this.orderList[this.orderIndex].materials || {};
      let count = 0;
      for (let i = 0; i < materials.data.length; i++) {
        let item = materials.data[i];
        if (item.number > 0 && item.editType != '2') {
          count += item.number;
        }
      }
      return this.amountToFixed(count);
    },
    materialTotalAmount(materials) {
      if (this.orderList.length == 0) return;
      materials = materials || this.orderList[this.orderIndex].materials || {};
      let totalAmount = 0;
      for (let i = 0; i < materials.data.length; i++) {
        let item = materials.data[i];
        if (item.number > 0 && item.editType != '2') {
          if (item.skus && item.skus.length > 0) {
            item.skus.map(sku => {
              if (sku.number > 0) {
                totalAmount += this.amountToFixed(sku.price * sku.number);
              }
            });
          } else {
            totalAmount += this.amountToFixed(item.price * item.number);
          }
        }
      }
      return this.amountToFixed(totalAmount);
    },
    materialTypeCount(type) {
      if (this.orderList.length == 0) return;
      // 过滤材料类型
      let count = 0;
      for (let i = 0; i < this.orderList[this.orderIndex].materials.data.length; i++) {
        let item = this.orderList[this.orderIndex].materials.data[i];
        if (item.number > 0 && item.editType != '2' && item.type == type) {
          count += item.number;
        }
      }
      return this.amountToFixed(count);
    },
    measureCount(measures) {
      if (this.orderList.length == 0) return;
      measures = measures || this.orderList[this.orderIndex].measures || {};
      let count = 0;
      for (let i = 0; i < measures.data.length; i++) {
        let item = measures.data[i];
        if (item.number > 0 && item.editType != '2') {
          count += item.number;
        }
      }
      return this.amountToFixed(count);
    },
    measureTotalAmount(measures) {
      if (this.orderList.length == 0) return;
      measures = measures || this.orderList[this.orderIndex].measures || {};
      let totalAmount = 0;
      for (let i = 0; i < measures.data.length; i++) {
        let item = measures.data[i];
        if (item.number > 0 && item.editType != '2') {
          totalAmount += this.amountToFixed(item.guideUnitPrice * item.number);
        }
      }
      return this.amountToFixed(totalAmount);
    },
    addItemCount() {
      let totalAmount = 0;
      let count = 0;
      for (let i = 0; i < this.addItems.data.length; i++) {
        let item = this.addItems.data[i];
        if (item.number > 0 && item.editType != '2') {
          totalAmount += this.amountToFixed(item.price * item.number);
          count += item.number;
        }
      }
      this.addItems.totalAmount = this.amountToFixed(totalAmount);
      return this.amountToFixed(count);
    },
    deleteItemCount() {
      let totalAmount = 0;
      let count = 0;
      for (let i = 0; i < this.deleteItems.data.length; i++) {
        let item = this.deleteItems.data[i];
        if (item.number > 0 && item.editType != '2') {
          totalAmount += this.amountToFixed(item.price * item.number);
          count += item.number;
        }
      }
      this.deleteItems.totalAmount = this.amountToFixed(totalAmount);
      return this.amountToFixed(count);
    },
    // 是否展示选规格按钮
    specButtonShow(item) {
      for (let i = 0; i < this.attributeFields.length; i++) {
        let fieldName = this.attributeFields[i].name;
        let fieldValue = item.exts[fieldName];
        // 维护了属性就显示“选规格”按钮
        if (fieldValue && fieldValue.length > 0) return true;
      }
      return false;
    },
    // 打开选规格弹窗
    openSpec(item) {
      this.spec.formData = item;
      this.getMaterialSKU(this.spec.formData);
      this.spec.show = true;
    },
    getMaterialSPU(spuIds, orderList) {
      common.osg.ajax(
        'basic/material/queryWithRank',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'in:serviceType|array#and': this.serviceType,
          'in:_id|array#and': spuIds.join(),
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          for (let i = 0; i < res.data.length; i++) {
            // 简化材料数据，只保留用到的字段
            let item = res.data[i];
            res.data[i] = {
              _id: item._id,
              orgId: item.orgId,
              orgName: item.orgName,
              name: item.name,
              code: item.code,
              shbCode: item.shbCode,
              materialUnit: item.materialUnit,
              unit: item.unit,
              images:
                item.images && common.osg.isJson(item.images)
                  ? JSON.parse(item.images).map(image => {
                      return { url: image.url };
                    })
                  : [],
              type: item.type,
              price: item.price,
              serviceCostPrice: item.serviceCostPrice,
              spec: item.spec,
              specUnit: item.specUnit,
              number: 0,
              exts: {
                commonName: item.exts.commonName,
                attributeValues: {}
              }
            };
          }

          orderList.map(order => {
            // 将所有sku按spuid进行分组
            let obj = {};
            order.materials.data.map(sku => {
              if (sku.spuid) {
                if (!obj[sku.spuid]) {
                  obj[sku.spuid] = [];
                  obj[sku.spuid].push(sku);
                } else {
                  obj[sku.spuid].push(sku);
                }
              }
            });
            // 将所有sku插入到spu下
            let arr = [];
            for (let spuid in obj) {
              for (let i = 0; i < res.data.length; i++) {
                let spu = res.data[i];
                if (spuid == spu._id) {
                  spu.skus = obj[spuid];
                  // 总数
                  spu.number = 0;
                  spu.totalAmount = 0;
                  spu.skus.map(sku => {
                    spu.number += sku.number;
                    spu.totalAmount += this.amountToFixed(sku.price * sku.number);
                  });
                  // 合计金额
                  arr.push(spu);
                  break;
                }
              }
            }
            // 替换新数组(嵌套)
            order.materials.data = order.materials.data.filter(item => !item.spuid).concat(arr);
          });
          // 返显赋值
          this.$set(this, 'orderList', orderList);
          // this.calcTotalPrice();
        }
      );
    },
    getMaterialSKU(spu) {
      common.osg.ajax(
        'basic/material/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          spuid: spu._id
        },
        res => {
          for (let i = 0; i < res.data.length; i++) {
            // 简化材料数据，只保留用到的字段
            let item = res.data[i];
            res.data[i] = {
              _id: item._id,
              orgId: item.orgId,
              orgName: item.orgName,
              name: item.name,
              code: item.code,
              shbCode: item.shbCode,
              materialUnit: item.materialUnit,
              unit: item.unit,
              images:
                item.images && common.osg.isJson(item.images)
                  ? JSON.parse(item.images).map(image => {
                      return { url: image.url };
                    })
                  : [],
              type: item.type,
              price: item.price,
              storeCostPrice: item.storeCostPrice,
              spec: item.spec,
              specUnit: item.specUnit,
              number: 0,
              exts: {
                commonName: item.exts.commonName,
                attributeValues: {}
              }
            };
          }

          if (!spu.skus || spu.skus.length == 0) {
            this.$set(this.spec.formData, 'skus', res.data);
          } else {
            // 去重
            let skuIds = spu.skus.map(item => item._id);
            res.data.map(item => {
              if (skuIds.indexOf(item._id) == -1) spu.skus.push(item);
            });
          }
        }
      );
    },
    attributeValueClick(attribute, value) {
      this.$set(this.spec.formData.exts.attributeValues, attribute, value);
    },
    allSpecSelected() {
      for (let i = 0; i < this.attributeFields.length; i++) {
        let values = this.spec.formData.exts[this.attributeFields[i].name];
        if (
          values &&
          values.length > 0 &&
          !this.spec.formData.exts.attributeValues[this.attributeFields[i].name]
        )
          return false;
      }
      return true;
    },
    // 匹配规格完全相同的sku
    skuMatch(attributeValues, sku) {
      for (let key in attributeValues) {
        let value = attributeValues[key];
        if (sku.exts[key] != value) return false;
      }
      return true;
    },
    // 加减数量
    skuNumberChange(e, spu, item) {
      item.number = Number(e.detail) || 0;

      let total = 0;
      spu.skus.map(sku => {
        total += Number(sku.number) || 0;
      });
      spu.number = total;

      this.calcTotalPrice();
    },
    /**
     * 套餐选规格
     */
    // 打开套餐选规格弹窗
    openPackageSpec(item) {
      this.$set(this.packageSpec, 'formData', item);
      for (let i = 0; i < this.packageSpec.formData.materialList.length; i++) {
        if (!this.packageSpec.formData.materialList[i].material.exts.attributeValues) {
          this.$set(this.packageSpec.formData.materialList[i].material.exts, 'attributeValues', {});
        }
      }
      this.getPackageMaterialSKU(this.packageSpec.formData.materialList);
      this.packageSpec.show = true;
    },
    // 关闭套餐选规格弹窗
    closePackageSpec() {
      if (this.packageSpec.formData.number > 0) {
        for (let material of this.packageSpec.formData.materialList) {
          if (material.number > 0 || (material.skus && material.skus.find(sku => sku.number > 0))) {
            this.packageSpec.show = false;
            return;
          }
        }
        common.osg.toast('请至少选择1个材料', 'none');
      } else {
        this.packageSpec.show = false;
      }
    },
    getPackageMaterialSKU(materialList) {
      if (materialList.length == 0) return;
      let spuIds = materialList.map(item => item.materialId);
      common.osg.ajax(
        'basic/material/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'in:spuid|array#and': spuIds.join()
        },
        res => {
          for (let i = 0; i < res.data.length; i++) {
            // 简化材料数据，只保留用到的字段
            let item = res.data[i];
            res.data[i] = {
              _id: item._id,
              orgId: item.orgId,
              orgName: item.orgName,
              name: item.name,
              code: item.code,
              shbCode: item.shbCode,
              materialUnit: item.materialUnit,
              unit: item.unit,
              images:
                item.images && common.osg.isJson(item.images)
                  ? JSON.parse(item.images).map(image => {
                      return { url: image.url };
                    })
                  : [],
              type: item.type,
              price: item.price,
              spec: item.spec,
              specUnit: item.specUnit,
              number: 0,
              exts: {
                commonName: item.exts.commonName,
                attributeValues: {}
              }
            };
          }

          // 将材料sku放到材料spu下
          for (let i = 0; i < this.packageSpec.formData.materialList.length; i++) {
            let spu = this.packageSpec.formData.materialList[i];
            if (!spu.skus || spu.skus.length == 0) {
              this.$set(
                this.packageSpec.formData.materialList[i],
                'skus',
                res.data.filter(item => {
                  return item.spuid == spu.materialId;
                })
              );
            } else {
              // 去重
              let skuIds = spu.skus.map(item => item._id);
              res.data.map(item => {
                if (skuIds.indexOf(item._id) == -1 && item.spuid == spu.materialId)
                  spu.skus.push(item);
              });
            }
          }
        }
      );
    },
    packageSpecAttributeValueClick(index, attribute, value) {
      this.$set(
        this.packageSpec.formData.materialList[index].material.exts.attributeValues,
        attribute,
        value
      );
    },
    allPackageSpecSelected(spu) {
      for (let i = 0; i < this.attributeFields.length; i++) {
        let values = spu.exts[this.attributeFields[i].name];
        if (
          values &&
          values.length > 0 &&
          !spu.exts.attributeValues[this.attributeFields[i].name]
        ) {
          return false;
        }
      }
      return true;
    },
    packageSkuNumberChange(e, item) {
      item.number = Number(e.detail) || 0;
    },
    // 加减套餐数量
    packageNumberChange(e, item) {
      item.number = Number(e.detail) || 0;
      this.calcTotalPrice();
    },
    // 新版选套餐
    openPackage(item, index) {
      this.packages = {
        show: true,
        formData: { exts: {} },
        materialsLayer: [],
        checkedIds: []
      };
      // 查询套餐下人材机
      common.osg.ajax(
        'biz/projPackage/findById/' + item._id,
        {},
        res => {
          // 套餐内材料按维修层数排序，拼接的spuCode顺序才正确
          res.entity.materialList.sort((a, b) => a.exts.layer - b.exts.layer);
          // 简化套餐内工序数据，只保留用到的数据
          for (let i = 0; i < res.entity.procedureList.length; i++) {
            let item = res.entity.procedureList[i];
            res.entity.procedureList[i] = {
              _id: item._id,
              procedure: {
                _id: item.procedure._id,
                name: item.procedure.name,
                content: item.procedure.content,
                desc: item.procedure.desc,
                unit: item.procedure.unit,
                processStepDefinitions: item.procedure.processStepDefinitions,
                imagesDescription: item.procedure.exts.imagesDescription || '',
                isAccepted: item.procedure.isAccepted,
                exts: {
                  imagesDescription: item.procedure.exts.imagesDescription || '',
                  prompt: item.procedure.exts.prompt || ''
                }
              }
            };
          }
          this.$set(
            this.orderList[this.orderIndex].projPackages.data[index],
            'procedureList',
            res.entity.procedureList
          );

          //  简化套餐内机措数据，只保留用到的数据
          for (let i = 0; i < res.entity.measureList.length; i++) {
            let item = res.entity.measureList[i];
            res.entity.measureList[i] = {
              _id: item._id,
              measure: {
                _id: item.measure._id,
                name: item.measure.name,
                content: item.measure.content,
                desc: item.measure.desc,
                unit: item.measure.unit,
                guideUnitPrice: item.measure.guideUnitPrice,
                cost: item.measure.cost,
                images:
                  item.measure.exts &&
                  item.measure.exts.images &&
                  common.osg.isJson(item.measure.exts.images)
                    ? JSON.parse(item.measure.exts.images).map(image => {
                        return { url: image.url };
                      })
                    : []
              }
            };
          }
          this.$set(
            this.orderList[this.orderIndex].projPackages.data[index],
            'measureList',
            res.entity.measureList
          );

          // 将未选中的材料合并后放到套餐下
          let checkedIds = item.materialList.map(item => item._id);
          for (let i = 0; i < res.entity.materialList.length; i++) {
            let m = res.entity.materialList[i];
            if (checkedIds.indexOf(m._id) == -1) {
              m.checked = false;
            } else {
              m.checked = true;
              m = item.materialList.find(item => item._id == m._id);
            }
            // 简化套餐内材料数据，只保留用到的数据
            res.entity.materialList[i] = {
              _id: m._id,
              coefficient: m.coefficient,
              material: {
                _id: m.material._id,
                exts: {
                  skuCode: m.material.exts.skuCode,
                  commonName: m.material.exts.commonName
                },
                name: m.material.name,
                code: m.material.code,
                spec: m.material.spec,
                materialUnit: m.material.materialUnit,
                unit: m.material.unit,
                specUnit: m.material.specUnit,
                price: m.material.price,
                serviceCostPrice: m.material.serviceCostPrice,
                images:
                  m.material.images && common.osg.isJson(m.material.images)
                    ? JSON.parse(m.material.images).map(image => {
                        return { url: image.url };
                      })
                    : []
              },
              exts: {
                price: m.exts.price,
                layer: m.exts.layer
              },
              checked: m.checked,
              number: m.number || 0
            };
          }
          this.$set(
            this.orderList[this.orderIndex].projPackages.data[index],
            'materialList',
            res.entity.materialList
          );

          // 将点击套餐赋值给弹窗
          this.packages.formData = this.orderList[this.orderIndex].projPackages.data[index];

          // 将材料字段处理为层级结构
          let materialsLayer = [];
          this.packages.formData.materialList.map(m => {
            let layer = Number(m.exts.layer);
            if (layer || layer === 0) {
              if (materialsLayer[layer]) {
                materialsLayer[layer].push(m);
              } else {
                materialsLayer[layer] = [m];
              }
              // 自动选中材料
              if (m.checked) {
                this.packages.checkedIds[layer] = m._id;
              }
            }
          });
          this.$set(this.packages, 'materialsLayer', materialsLayer);
          // #ifdef APP-PLUS
          this.$forceUpdate();
          // #endif
        },
        {
          noload: true
        }
      );
    },
    // 加减数量
    onPackageChange(e, item, type, index) {
      item.number = Number(e.detail) || 0;
    },
    onRadioGroupChange(e, i) {
      this.packages.checkedIds[i] = e.detail;
      this.packages.materialsLayer[i].map(m => {
        if (m._id == e.detail) {
          m.checked = true;
        } else {
          m.checked = false;
        }
      });
      this.$forceUpdate();
    },
    packagesConfirm() {
      if (this.packages.formData.number > 0) {
        for (let i = 0; i < this.packages.materialsLayer.length; i++) {
          if (this.packages.materialsLayer[i] && !this.packages.checkedIds[i]) {
            common.osg.toast('每一道都必须勾选1个材料', 'none');
            return;
          }
        }
        this.packages.show = false;
        let checkedMaterialList = [];
        let skuCode = this.packages.formData.exts.spuCode || '';
        let symbol = '-'; // 编号规则：套餐编号-材料编号+材料编号+材料编号
        this.packages.formData.materialList.map(item => {
          if (item.checked) {
            checkedMaterialList.push(item);
            // 拼接材料代码生成sku代码，维修层数是基层处理剂时不拼接
            if (item.material.exts.skuCode && item.exts.layer != '0') {
              if (symbol == '-') {
                skuCode += '-' + item.material.exts.skuCode;
                symbol = '+';
              } else {
                skuCode += '+' + item.material.exts.skuCode;
              }
            }
          }
        });
        this.packages.formData.skuCode = skuCode;
        this.$set(this.packages.formData, 'materialList', checkedMaterialList);
        this.calcTotalPrice();
      } else {
        common.osg.confirm(
          '套餐选择数量为0，是否确认退出？',
          () => {
            this.packages.formData.materialList = [];
            this.packages.show = false;
            let checkedMaterialList = [];
            this.packages.formData.materialList.map(item => {
              if (item.checked) {
                checkedMaterialList.push(item);
              }
            });
            this.packages.formData.skuCode = '';
            this.$set(this.packages.formData, 'materialList', checkedMaterialList);
            this.calcTotalPrice();
          },
          {
            confirmText: '确认退出',
            confirmColor: '#d6000f',
            cancelText: '返回'
          }
        );
      }
    },
    navigateToMiniProgram(appId, path, extraData) {
      wx.navigateToMiniProgram({
        appId,
        path: path || '',
        extraData: extraData || {},
        fail(res) {
          uni.showModal({
            content: '打开失败，请稍后重试！',
            showCancel: false
          });
          console.log(res.errMsg);
        }
      });
    },
    // 点击小订单维修部位
    orderRepairPartsClick(orderIndex) {
      let repairParts = this.orderList[orderIndex].repairParts;
      this.cascade = {
        actions:
          this.serviceType == '11' || this.serviceType == '12'
            ? this.options.parts
            : this.options.constructionParts,
        field: 'repairParts',
        type: 'order',
        value: repairParts && repairParts.length > 0 ? repairParts[repairParts.length - 1] : '',
        orderIndex: orderIndex,
        show: true
      };
    },
    // 小订单输入字段修改
    orderFieldChange(e, orderIndex, fieldName) {
      this.orderList[orderIndex][fieldName] = e.detail;
    },
    // 修改质保年限
    agelimitEdit(orderIndex) {
      this.orderIndex = orderIndex;
      //当前是刷新还是防水业务
      let isRefresh = this.serviceType === '40' ? 'refreshAgelimit' : 'agelimit';
      this.agelimit.actions = this.options[isRefresh].filter(item => {
        return Number(item.value) <= this.orderList[orderIndex].agelimitMax;
      });
      console.log('防水', this.agelimit.actions);

      this.agelimit.show = true;
    },
    // 选择质保年限
    agelimitSelect(e) {
      this.$set(this.orderList[this.orderIndex], 'agelimit', Number(e.detail.value));
    },
    formatAgelimit(value) {
      return common.osg.codelabel('agelimit', String(value));
    },
    formatRepairParts(value) {
      let partType = 'constructionParts'; // 默认值
      if (this.serviceType == '11' || this.serviceType == '12') {
        partType = 'parts';
      } else if (this.serviceType == '40') {
        partType = 'refreshParts';
      }
      // return common.osg.formatCascade(
      //   this.serviceType == '11' || this.serviceType == '12' ? 'parts' : 'constructionParts',
      //   value
      // );
      return common.osg.formatCascade(partType, value);
    },
    // 报价
    quote() {
      //防止按钮重复点击
      if (common.osg.isRepeatClick('placeOrder')) return;

      for (let i = 0; i < this.addItems.data.length; i++) {
        if (this.addItems.data[i].number > 0 && !this.addItems.data[i].name) {
          common.osg.toast('请输入自定义增项名称', 'none');
          return;
        }
      }
      for (let i = 0; i < this.deleteItems.data.length; i++) {
        if (this.deleteItems.data[i].number > 0 && !this.deleteItems.data[i].name) {
          common.osg.toast('请输入自定义减项名称', 'none');
          return;
        }
      }
      if (this.totalPrice < 0) {
        common.osg.alert('合计不能为负!');
        return;
      }

      common.osg.confirm('确认要提交吗？', () => {
        let orderList = [];
        let orderListTotalAmount = 0;
        for (let i = 0; i < this.orderList.length; i++) {
          let order = {
            repairParts: this.orderList[i].repairParts,
            constructionLocation: this.formatRepairParts(this.orderList[i].repairParts),
            partDescription: this.orderList[i].partDescription,
            constructionSite: this.orderList[i].constructionSite,
            maintainAreaNum: this.orderList[i].maintainAreaNum,
            agelimit: this.orderList[i].agelimit,
            agelimitMax: this.orderList[i].agelimitMax
          };
          // 整理各部位 已选套餐、工序、材料、机措的数据，计算分类合计
          order.projPackages = {
            totalAmount: 0,
            data: this.orderList[i].projPackages.data.filter(item => {
              if (item.number > 0) {
                item.describe = item.desc;
                // 计算套餐最低起算价
                if (item.amount * item.number < item.minimumPrice) {
                  item.totalAmount = item.minimumPrice;
                } else {
                  item.totalAmount = this.amountToFixed(item.amount * item.number);
                }
                // 一口价 套餐材料用量
                if (item.exts.pricingMethod == '1') {
                  item.materialList.map(material => {
                    // 删除材料中没选择的SKU
                    let skus = [];
                    material.skus.map(sku => {
                      if (sku.number > 0) skus.push(sku);
                    });
                    material.skus = skus;
                  });
                } else {
                  // 非一口价计算套餐内材料用量
                  item.materialList.map(material => {
                    material.number =
                      Math.ceil(
                        (Number(item.number) * material.coefficient) /
                          Number(material.material.spec)
                      ) || 0;
                  });
                }

                return true;
              }
            })
          };
          this.orderList[i].projPackages.data.map(item => {
            if (item.number > 0 && item.editType != '2') {
              // 计算套餐最低起算价
              if (item.amount * item.number < item.minimumPrice) {
                order.projPackages.totalAmount += item.minimumPrice;
              } else {
                order.projPackages.totalAmount += this.amountToFixed(item.amount * item.number);
              }
            }
          });
          order.projPackages.totalAmount = this.amountToFixed(order.projPackages.totalAmount);

          order.procedures = {
            totalAmount: 0,
            data: this.orderList[i].procedures.data.filter(item => {
              if (item.number > 0 && item.editType != '2') {
                item.describe = item.desc;
                item.amount = item.guideUnitPrice;
                // 计算工序最低起算价
                if (item.guideUnitPrice * item.number < item.minimumGuideTotalPrice) {
                  item.totalAmount = item.minimumGuideTotalPrice;
                } else {
                  item.totalAmount = this.amountToFixed(item.guideUnitPrice * item.number);
                }
                return true;
              }
            })
          };
          this.orderList[i].procedures.data.map(item => {
            if (item.number > 0 && item.editType != '2') {
              // 计算工序最低起算价
              if (item.guideUnitPrice * item.number < item.minimumGuideTotalPrice) {
                order.procedures.totalAmount += item.minimumGuideTotalPrice;
              } else {
                order.procedures.totalAmount += this.amountToFixed(
                  item.guideUnitPrice * item.number
                );
              }
            }
          });
          order.procedures.totalAmount = this.amountToFixed(order.procedures.totalAmount);

          order.materials = {
            totalAmount: 0,
            data: []
          };
          this.orderList[i].materials.data.map(item => {
            if (item.number > 0 && item.editType != '2') {
              if (item.skus && item.skus.length > 0) {
                item.totalAmount = 0;
                // 组装sku材料
                item.skus.map(sku => {
                  if (sku.number > 0) {
                    sku.describe = item.textarea;
                    sku.unit = item.materialUnit;
                    sku.amount = sku.price;
                    sku.totalAmount = this.amountToFixed(sku.price * sku.number);
                    item.totalAmount += sku.totalAmount;
                    order.materials.totalAmount += sku.totalAmount;
                    order.materials.data.push(sku);
                  }
                });
              } else {
                item.describe = item.textarea;
                item.unit = item.materialUnit;
                item.amount = item.price;
                item.totalAmount = this.amountToFixed(item.price * item.number);
                order.materials.totalAmount += item.totalAmount;
                order.materials.data.push(item);
              }
            }
          });

          order.measures = {
            totalAmount: 0,
            data: this.orderList[i].measures.data.filter(item => {
              if (item.number > 0) {
                item.describe = item.desc;
                item.amount = item.guideUnitPrice;
                item.totalAmount = this.amountToFixed(item.guideUnitPrice * item.number);
                return true;
              }
            })
          };
          this.orderList[i].measures.data.map(item => {
            if (item.number > 0) {
              order.measures.totalAmount += this.amountToFixed(item.guideUnitPrice * item.number);
            }
          });

          order.totalAmount =
            order.projPackages.totalAmount +
            order.procedures.totalAmount +
            order.materials.totalAmount +
            order.measures.totalAmount;

          orderListTotalAmount += order.totalAmount;
          orderList.push(order);
        }

        // 整理增项、减项
        let addItems = {
          totalAmount: this.addItems.totalAmount,
          data: this.addItems.data.filter(item => {
            if (item.number > 0) {
              item.amount = item.price;
              item.totalAmount = this.amountToFixed(item.price * item.number);
              return true;
            }
          })
        };
        let deleteItems = {
          totalAmount: this.deleteItems.totalAmount,
          data: this.deleteItems.data.filter(item => {
            if (item.number > 0) {
              item.amount = item.price;
              item.totalAmount = this.amountToFixed(item.price * item.number);
              return true;
            }
          })
        };
        // 计算其他项金额合计
        let otherItemsAmount = this.amountToFixed(addItems.totalAmount + deleteItems.totalAmount);
        // 计算优惠金额（公式：(人材机合计+增减项合计) * (1-折扣) + 优惠金额 + 优惠券）
        let test = this.amountToFixed(
          orderListTotalAmount + addItems.totalAmount + deleteItems.totalAmount
        );
        console.log('折扣前金额：', test);
        let test1 = this.amountToFixed(
          (orderListTotalAmount + addItems.totalAmount + deleteItems.totalAmount) *
            (1 - this.discount)
        );
        console.log('折扣金额：', test1);
        let test2 = this.amountToFixed(
          this.formData.couponsVal || this.formData.exts.couponsVal || 0
        );
        console.log('优惠金额：', this.amountToFixed(this.preferentialAmount) || 0);
        console.log('优惠券金额：', test2);
        let preferentialAmount = this.amountToFixed(
          (orderListTotalAmount + addItems.totalAmount + deleteItems.totalAmount) *
            (1 - this.discount) +
            (this.amountToFixed(this.preferentialAmount) || 0) +
            this.amountToFixed(this.formData.couponsVal || this.formData.exts.couponsVal || 0)
        );
        let bjProducts = {
          orderList,
          addItems,
          deleteItems,
          otherItemsAmount,
          preferentialAmount
        };
        console.log('otherItemsAmount', otherItemsAmount);
        console.log('preferentialAmount', preferentialAmount);
        let productIds = [];
        // type 0代表生成报价,1代表生成订单
        let params = {
          bjProducts: JSON.stringify(bjProducts),
          productIds: JSON.stringify(productIds), //产品和数量
          otherAmount: this.otherAmount || 0, //其他金额
          originPrice: this.originPrice, //原价
          preferentialAmount: this.preferentialAmount || 0, //优惠金额
          totalPrice: Number(this.totalPrice), //总价
          description: this.description, //备注
          discount: this.amountToFixed(this.amountToFixed(this.discount) * 1), //折扣
          ownerName: this.formData.name, //归属人姓名
          ownerPhone: this.formData.phone, //归属人电话
          serviceAppointmentId: this.sid, //工单id
          type: 0, //报价
          exts: {
            serviceAppointmentNum: this.formData.orderNum || this.formData.serviceAppointmentNum, // 编辑订单时formData存的是订单数据
            coupons: this.formData.coupons || this.formData.exts.coupons || '',
            couponsVal: this.formData.couponsVal || this.formData.exts.couponsVal || 0,
            couponsName: this.formData.couponsName || this.formData.exts.couponsName || ''
          }
        };
        for (let extField of this.extFields) {
          //处理file类型，七牛下载地址为逗号隔开
          if (extField.type == 'file') {
            if (Array.isArray(this.formData[extField.name])) {
              this.formData[extField.name] = this.formData[extField.name]
                .map(item => item.url)
                .join(',');
            }
          }
          if (this.formData[extField.name] || this.formData[extField.name] === 0)
            params.exts[extField.name] = this.formData[extField.name];
        }

        // 存储服务类型
        params.exts.serviceType = this.serviceType;
        // 存储信息来源
        params.exts.sourceType = params.exts.sourceType || this.sourceType;

        // 生成报价单
        params.exts.isCreateBjdPDF = '1';

        common.osg.ajax(
          'basic/order/creatQuotation',
          {
            data: JSON.stringify(params)
          },
          res => {
            common.osg.alert('报价成功！', () => {
              common.osg.closeMe();
            });
          }
        );
      });
    },
    getArea() {
      common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
        this.area = res;
      });
    },
    //选择商品左边 切换
    handleFilterPartSelection(orderIndex, item) {
      // orderList[orderIndex].projPackages.filterPart === item.value
      //               ? $set(orderList[orderIndex].projPackages, 'filterPart', '')
      //               : $set(orderList[orderIndex].projPackages, 'filterPart', item.value);

      //orderList[orderIndex].projPackages.data
      const projPackages = this.orderList[orderIndex].projPackages;
      if (projPackages.filterPart === item.value) {
        this.$set(projPackages, 'filterPart', '');
      } else {
        this.$set(projPackages, 'filterPart', item.value);
      }
      console.log('商品列表', this.orderList[orderIndex].projPackages.data);
    }
    // 主动触发暂存表单
    // temporaryForm() {
    //   if (this.type == '0') return;
    //   let params = {
    //     formData: this.formData, //表单数据
    //     orderList: this.orderList, //表单数据
    //     formDefId: 'placeOrders', //表单定义id
    //     formDataId: this.sid //工单id
    //   };
    //   console.log(params, '---temporaryFormparams');
    //   if (Object.keys(params.formData).length == 0 && params.orderList.length == 0) return;
    //   wx.setStorageSync('temporaryFormPlaceOrders', params);
    //   common.osg.toast('已暂存', 'none');
    // },
    // getTemporaryForm() {
    //   if (this.type == '0') return;
    //   let temporaryForm = wx.getStorageSync('temporaryFormPlaceOrders');
    //   // 判断表单定义id和工单id相同才会赋值给表单
    //   //
    //   if (temporaryForm.formDefId == 'placeOrders' && temporaryForm.formDataId == this.sid) {
    //     this.orderList = temporaryForm.orderList;
    //     this.formData = temporaryForm.formData;
    //     this.$forceUpdate();
    //     common.osg.toast('继续编辑', 'none');
    //   } else {
    //     this.orderList = [];
    //   }
    //   console.log(this.formData, '---获取缓存赋值到表单formData');
    //   console.log(this.orderList, '---获取缓存赋值到表单orderList');
    //   // this.openForm = true;
    // }
  }
};
</script>
<style lang="scss">
.placeOrder {
  .van-cell__value {
    color: #323233;
  }
  .c-radio-group {
    .van-radio-group {
      display: flex;
    }
  }
  .c-order-radio-group {
    .van-radio-group {
      display: flex;
      float: left;
      .van-radio {
        margin-right: 10px;
      }
    }
  }
  .c-nav-bar {
    .van-nav-bar__text {
      color: #242424;
    }
    .van-button__text {
      color: #106cff;
    }
  }
  .van-field__label {
    color: #333;
  }
  .search {
    padding: 0;
    border-radius: 50px;
    overflow: hidden;
    background: #f1f1f1;
    height: 32px;
    margin: 10px 20px 0;
    .van-search__content {
      background: #f1f1f1;
    }
    .van-cell__left-icon-wrap {
      color: #707070;
    }
    .van-field__control {
      color: #999 !important;
      font-size: 14px;
      font-weight: 400;
    }
    .van-search__action {
      background: #f1f1f1;
      height: 32px;
      display: flex;
      align-items: center;
    }
    .search-button {
      background: #106cff;
      color: #fff;
      font-size: 11px;
      width: 50px;
      text-align: center;
      border-radius: 50px;
      height: 24px;
      line-height: 24px;
      margin-right: 4px;
    }
  }
  .van-tab {
    font-size: 14px !important;
  }
}

.placeOrder-btn-wrapper {
  box-sizing: border-box;
  padding: 0 !important;
  margin: 10px 15px;
  width: calc(100vw - 30px) !important;
}

.material-card {
  background: #f2f2f2;
  width: 92%;
  border-radius: 10rpx;
  font-size: 26rpx;
  margin: 0 auto;
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

.van-submit-bar__tip {
  background: #fff !important;
  border-bottom: 2rpx #f2f2f2 solid;
}

.tabActive {
  background: red !important;
  color: #fff !important;
}

.tabClass {
  background: #f2f2f2;
  border-radius: 40rpx;
  padding: 50rpx;
  margin: 0 20rpx;
}

.nav-wrapper {
  margin: 10rpx 0;
}

.van-tabs__line {
  display: none !important;
}

.c-popup-cells-form {
  flex: 1;
}

.popupWindow {
  display: flex;
  text-align: center;
  font-size: 28rpx;
  color: #888;
  margin: 20rpx 0;
  justify-content: center;
}

.van-cell {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px;
  overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;
}

.van-cell__title {
  max-width: 110px !important;
  font-size: 16px;
}

.van-cell__value {
  position: relative;
  overflow: hidden;
  text-align: right;
  vertical-align: middle;
  word-wrap: break-word;
}

.van-cell--required:before {
  content: '*';
  left: 8px;
  left: var(--padding-xs, 8px);
  font-size: 14px;
  font-size: var(--cell-font-size, 14px);
  color: var(--cell-required-color, #d6000f);
}

// .van-stepper__minus:after,
// .van-stepper__plus:after {
//   width: 3px !important;
//   height: 15px !important;
// }

// .van-stepper__minus:before,
// .van-stepper__plus:before {
//   width: 15px !important;
//   height: 3px !important;
// }

.van-stepper__minus,
.van-stepper__plus {
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}
.p-stepper {
  .van-stepper__minus,
  .van-stepper__plus {
    border-radius: 50% !important;
  }
}
.van-stepper__input {
  padding: 0 !important;
  margin: 0 !important;
  height: 30px !important;
}
/* 优惠券样式 */
.couponFilter > view {
  padding: 1vw 3vw;
  margin-right: 3vw;
  border: 1px solid transparent;
  background-color: #f5f5f5;
  border-radius: 999px;
  font-size: 12px;
}
.couponContent {
  height: 100%;
  background: #f2f2f2;
  flex: 1;
  padding-bottom: 80px;
  .coupon {
    margin: 3vw;
    overflow: hidden;
    border-radius: 5px 5px 3px 3px;
    background: rgb(253, 253, 253);
    .bottom {
      background: rgb(253, 253, 253);
      margin-top: 3px;
      padding: 3vw;
      font-size: 12px;
      color: #646566;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn {
        padding: 2px 10px;
        font-size: 12px;
        border: 1px solid #646566;
        border-radius: 100px;
      }
    }
    .top {
      height: 100px;
      display: flex;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
      > view {
        position: relative;
        display: flex;
      }
    }
    .coupon-left {
      padding: 3vw;
      width: 54%;
      box-sizing: border-box;
      background-color: #fff;
      > view {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
      .img {
        margin-right: 3vw;
        image {
          width: 60px;
          height: 60px;
        }
      }
      .info {
        flex: 1;
      }
      .tag {
        color: #fff;
        background: rgb(49, 105, 249);
        font-size: 10px;
        border-radius: 100px;
        padding: 0 4px;
        margin-right: 5px;
        white-space: nowrap;
      }
    }
    .coupon-left::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 4px;
      border-radius: 0 0 0 4px;
      background: #f7f8fa;
    }
    .coupon-left::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 4px;
      height: 4px;
      border-radius: 4px 0 0 0;
      background: #f7f8fa;
    }
    .coupon-right {
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
    .bg-blue {
      background: linear-gradient(to bottom right, rgb(118, 180, 249), rgb(49, 105, 249));
    }
    .bg-yellow {
      background: linear-gradient(to bottom right, rgb(237, 205, 139), rgb(218, 172, 107));
    }
    .bg-red {
      background: linear-gradient(to bottom right, rgb(236, 93, 106), #d6000f);
    }
    .coupon-right::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: 0 0 4px 0;
      background: #f7f8fa;
    }
    .coupon-right::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: 0 4px 0 0;
      background: #f7f8fa;
    }
  }
}
.van-radio {
  height: 100%;
}
.couponRadio {
  margin-left: 10px;
}
.couponRadio-label {
  display: none;
}
.empty1 .van-empty {
  height: calc(100vh - 140px);
}
.empty2 .van-empty {
  height: calc(100vh - 100px);
}
.inconduigou > view > van-icon {
  padding: 22rpx;
}

.placeOrder {
  height: 100vh;
  .c-cell-gap {
    color: #de6a1c !important;
    background: linear-gradient(90deg, #faf7d3 0%, #fdfcf0 100%);
    border: 1rpx solid #eaeaea;
    font-size: 12px;
    padding: 6px 15px;
  }
  .customItem-input {
    .van-cell::after {
      display: none;
    }
  }
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
  .c-order {
    margin: 10px 15px;
    border-radius: 8px;
    overflow: hidden;
  }

  .c-order-top {
    background: #fff;
    padding: 2px 0 0;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    font-size: 13px;
    color: #333333;
    .van-cell {
      padding: 2px 10px !important;
      > view {
        margin-right: 0 !important;
      }
      .van-cell__title {
        min-width: 150px !important;
      }
      .van-cell__value {
        text-align: left;
      }
    }
    .c-order-top-label {
      display: inline-block;
      min-width: 85px;
    }
  }

  .c-selected {
    background: #fff;
    .c-selected-title {
      padding: 5px;
      border-top: 1px solid #f2f2f2;
      // border-bottom: 1px solid #f2f2f2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .c-selected-items {
      background-color: #fff;
      .c-selected-item {
        padding: 20rpx !important;
        display: flex;
        flex-direction: column;
      }
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
    }
  }
  .c-spec-dialog {
    .van-dialog__footer {
      display: none !important;
    }
  }
  .close-button {
    position: absolute;
    bottom: -65px;
    left: calc(50% - 20px);
    display: flex;
    font-size: 40px;
    height: 40px;
    z-index: 2100;
    color: #fff;
  }
  .c-images {
    border-radius: 5px;
    overflow: hidden;
  }
  .code {
    display: inline-block;
    min-width: 50rpx;
    text-align: center;
    font-size: 10px;
    background-color: rgb(241, 241, 241);
    padding: 4rpx 8rpx;
    border-radius: 3px;
    color: #999;
  }
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
  .input-class {
    border-radius: 12px;
    min-width: 42px;
    // background-color: #fff;
  }
  .input-class-form {
    border-radius: 0;
  }
  .plus-class {
    border-radius: 50%;
    overflow: hidden;
    // background: #106cff;
    background-color: #fff;
  }
  .minus-class {
    border-radius: 50%;
    overflow: hidden;
    // background-color: #f7f8fa;
    background-color: #fff;
  }
  .p-input-class {
    border-radius: 12px;
    min-width: 42px;
    background-color: #fff;
  }
  .p-plus-class {
    border-radius: 50%;
    overflow: hidden;
    background: #f9de55 !important;
  }
  .p-minus-class {
    border-radius: 50%;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #b7b7b7;
  }
  .c-plus {
    display: flex;
    align-items: center;
    justify-content: center;
    // color: #fff;
    // background: #106cff;
    color: #1a1a1a;
    background: #f9de55;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    margin: 1px;
    padding: 4px;
    box-sizing: border-box;
    font-size: 11.7px;
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
  .c-spec-tag {
    display: inline-block;
    position: absolute;
    right: 0;
    top: -10px;
    background: red;
    color: #fff;
    border-radius: 50%;
    font-size: 11px;
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 18px;
  }
  .c-spec-submit {
    background: #106cff;
    border-color: #106cff;
    color: #fff;
    height: 30px;
  }
  .dialog-detail {
    font-size: 13px;
    border-bottom: 1px solid #f2f2f2;
    padding: 5px;
    > view {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > view {
        flex: 1;
      }
    }
  }
  .c-submit-bar-button {
    background: #106cff;
    border-color: #106cff;
  }
  .c-vertical-line {
    width: 4px;
    height: 18px;
    margin-right: 6px;
    border-radius: 4px;
    background: #323233;
  }
  .m-radio-group {
    .van-radio-group {
      display: flex;
      flex-wrap: wrap;
      .m-radio {
        position: relative;
        margin-left: 7px;
        margin-bottom: 7px;
        background: #f7f7f7;
        border: 3px solid #f7f7f7;
        border-radius: 5px;
        align-items: start;
        height: auto;
        .van-radio__label {
          text-align: center;
          padding-left: 0;
          width: 110px;
        }
        .m-top {
          background: #fff;
          padding: 10px;
          height: 110px;
          box-sizing: border-box;
        }
        .m-title {
          width: 100%;
          height: 28px;
          line-height: 15px;
          margin-top: 5px;
          // 超过两行省略
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .m-price {
          line-height: 30px;
          font-size: 16px;
          font-weight: 600;
          color: #d6000f;
          text-align: left;
          padding-left: 5px;
        }
        .van-radio__icon-wrap {
          font-size: 20px;
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: #fff;
          border-radius: 50%;
        }
      }
      .m-radio-checked {
        border-color: #106cff;
        background: #fff;
      }
      .m-image {
        border-radius: 5px;
        height: 90px;
        max-width: 90px;
      }
    }
  }
  .p-confirm-button {
    border-radius: 1000px;
    background: #f9de55;
    height: 38px;
    color: #000;
    text-align: center;
    font-size: 16px;
    width: 150px;
    line-height: 38px;
    margin-right: 10px;
  }
  // 优惠金额（元）文字宽度
  .c-field-preferentialAmount {
    .van-cell__title {
      max-width: 135px !important;
    }
  }
}
</style>
