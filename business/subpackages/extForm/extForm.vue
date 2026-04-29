<template>
  <!-- TODO:currentNode.state == 10 -->
  <view class="extForm" @click.capture="track">
    <view class="c-extForm">
      <block v-if="bgImage">
        <image :src="bgImage" mode="widthFix" style="width: 100vw"></image>
      </block>
      <!-- 表单组件渲染 -->
      <view v-if="dataShow && urlParams.leadId">
        <van-cell-group :border="false">
          <!-- #ifdef MP-WEIXIN -->
          <van-cell
            title="通话状态"
            :value="codelabel('cascade', 'LEADSTATUS', formData.dedicateMode)"
            @click="onClick"
            data-type="cascade"
            data-name="dedicateMode"
            data-valueoption="LEADSTATUS"
            required
            is-link
          ></van-cell>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <van-cell
            key="dedicateMode"
            title="通话状态"
            @click="onClick"
            data-type="cascade"
            data-name="dedicateMode"
            data-field="dedicateMode"
            data-valueoption="LEADSTATUS"
            required
          >
            <uni-data-picker
              ref="dedicateMode"
              v-model="formData.dedicateMode"
              placeholder=""
              popup-title="通话状态"
              :localdata="options.LEADSTATUS"
              :map="{
                text: 'name',
                value: 'value'
              }"
              @change="onCascaderFinish"
              :clear-icon="false"
              class="c-data-picker"
            ></uni-data-picker>
          </van-cell>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <van-cell
            title="下次联系时间"
            :value="formData.nextTime"
            @click="onClick"
            data-type="datetime"
            data-name="nextTime"
            is-link
          ></van-cell>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <van-cell title="下次联系时间" data-type="datetime" data-name="nextTime" is-link>
            <uni-datetime-picker
              key="nextTime"
              :value="formData.nextTime"
              placeholder=" "
              @change="datetimeConfirm($event, 'uni', 'nextTime')"
              :clear-icon="false"
            />
          </van-cell>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <van-field
            key="memo"
            label="跟进记录"
            :value="formData.memo || ''"
            @change="onChange"
            type="textarea"
            input-align="right"
            data-name="memo"
            autosize
          ></van-field>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <van-cell title="跟进记录">
            <view key="field-text" class="c-flex c-item-center">
              <input
                key="memo"
                :value="formData.memo || ''"
                data-name="memo"
                style="width: 100%; text-align: right"
                @input="onInput"
              />
            </view>
          </van-cell>
          <!-- #endif -->
        </van-cell-group>
      </view>
      <view :class="bgImage ? 'bgView' : ''">
        <van-cell-group v-if="dataShow" :border="false">
          <block v-for="(extField, index) in extFields" :key="index">
            <!-- 只展示已启用的字段-->
            <block v-if="extField.state == 1 && !extField.frontEndConfig.mpDetailHide">
              <block v-if="showType(extField, formData)">
                <block v-if="extField.type == 'phone'">
                  <!-- #ifdef MP-WEIXIN -->
                  <van-field
                    :key="extField._id"
                    :label="extField.nameDisp"
                    :value="formData[extField.name] || ''"
                    @change="onChange"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    type="number"
                    :maxlength="extField.type == 'phone' ? 11 : -1"
                    :required="extField.required == '1'"
                    :readonly="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                    input-align="right"
                  ></van-field>
                  <!-- #endif -->
                  <!-- #ifdef APP-PLUS -->
                  <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                    <view key="field-text" class="c-flex c-item-center">
                      <input
                        :key="extField._id"
                        :value="formData[extField.name] || ''"
                        type="number"
                        :data-type="extField.type"
                        :data-name="extField.name"
                        :data-fec="extField.frontEndConfig"
                        :data-extfield="extField"
                        :maxlength="extField.type == 'phone' ? 11 : -1"
                        :disabled="
                          currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        "
                        :class="
                          currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
                        style="width: 100%; text-align: right"
                        @input="onInput"
                      />
                    </view>
                  </van-cell>
                  <!-- #endif -->
                </block>
                <block v-else-if="extField.type == 'switch'">
                  <van-cell
                    :key="extField._id"
                    :title="extField.nameDisp"
                    class="c-cell-switch"
                    :required="extField.required == '1'"
                  >
                    <van-switch
                      :checked="formData[extField.name]"
                      @change="onChange"
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      active-value="1"
                      inactive-value="0"
                      size="18px"
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                      :class="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                          ? 'c-disabled'
                          : ''
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
                  <van-cell
                    :title="extField.nameDisp"
                    :value="formData[extField.name]"
                    @click="onClick"
                    :data-id="extField._id"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    :data-valueoption="extField.valueOption"
                    is-link
                    :required="extField.required == '1'"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                    :class="
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        ? 'c-disabled'
                        : ''
                    "
                  ></van-cell>
                </block>
                <block v-else-if="extField.type == 'select'">
                  <!-- 后期优化 -->
                  <van-cell
                    :title="extField.nameDisp"
                    :value="
                      commonEvent('codelabel', null, {
                        option: extField.valueOption,
                        value: formData[extField.name]
                      })
                    "
                    @click="onClick"
                    :data-id="extField._id"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    :data-valueoption="extField.valueOption"
                    is-link
                    :required="extField.required == '1'"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                    :class="
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        ? 'c-disabled'
                        : ''
                    "
                  ></van-cell>
                </block>
                <block v-else-if="extField.type == 'cascade'">
                  <!-- #ifdef MP-WEIXIN -->
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
                    :data-id="extField._id"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    :data-valueoption="extField.valueOption"
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
                    :key="extField._id"
                    :title="extField.nameDisp"
                    @click="onClick"
                    :data-extfield="extField"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    :data-valueoption="extField.valueOption"
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
                      :key="extField._id"
                      ref="uniDataPicker"
                      v-model="formData[extField.name]"
                      placeholder=""
                      :popup-title="extField.nameDisp"
                      :localdata="options[extField.valueOption]"
                      :map="{
                        text: 'name',
                        value: 'value'
                      }"
                      @change="onCascaderFinish"
                      :clear-icon="false"
                      class="c-data-picker"
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
                    :data-id="extField._id"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    :data-valueoption="extField.valueOption"
                    is-link
                    :required="extField.required == '1'"
                  ></van-cell>
                </block>
                <block v-else-if="extField.type == 'radio'">
                  <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                    <van-radio-group
                      :key="extField._id"
                      :value="formData[extField.name]"
                      @change="onChange"
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      class="c-radio-group"
                    >
                      <van-radio
                        v-for="(item, i) in options[extField.valueOption]"
                        :key="i"
                        :name="item.value"
                        :disabled="
                          currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        "
                        :class="
                          currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                            ? 'c-disabled'
                            : ''
                        "
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
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      class="c-checkbox-group"
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                      :class="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                          ? 'c-disabled'
                          : ''
                      "
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
                      :key="extField._id"
                      :value="formData[extField.name]"
                      @change="onChange"
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                      :class="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                          ? 'c-disabled'
                          : ''
                      "
                    ></van-rate>
                  </van-cell>
                </block>
                <block v-else-if="extField.type == 'file'">
                  <view class="c-cell-view c-flex c-flex-between c-border-n c-relative">
                    <view class="c-cell_title">
                      <text class="c-required" v-if="extField.required == '1'">*</text>
                      <text>{{ extField.nameDisp }}</text>
                    </view>
                    <view class="c-cell_value">
                      {{
                        ((formData[extField.name] && formData[extField.name].length) || 0) +
                        ' / ' +
                        (extField.frontEndConfig.max || '10')
                      }}
                    </view>
                  </view>
                  <view class="c-cell-view">
                    <van-uploader
                      :key="extField._id"
                      style="display: flex"
                      :file-list="formData[extField.name]"
                      @after-read="afterRead"
                      :data-extfield="extField"
                      :data-field="extField.name"
                      @delete="deleteFile"
                      :max-count="
                        extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                          ? extField.frontEndConfig.max
                          : 10
                      "
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                      :class="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                          ? 'c-disabled'
                          : ''
                      "
                    />
                  </view>
                </block>
                <block v-else-if="extField.name == 'image'">
                  <view class="cell-wrapper-p14">
                    <view class="cell-item">
                      <van-cell :title="extField.nameDisp" :border="false" />
                      <view class="image-sample">
                        <view style="padding: 10rpx; flex: 1">
                          <view
                            style="
                              margin-bottom: 20rpx;
                              width: 100%;
                              text-align: center;
                              font-size: 16px;
                            "
                          >
                            水位刻度标识
                          </view>
                          <image
                            mode="widthFix"
                            style="width: 100%"
                            :src="extField.frontEndConfig.list[0]"
                            :data-src="extField.frontEndConfig.list[0]"
                          ></image>
                        </view>
                        <view style="padding: 10rpx; flex: 1">
                          <view
                            style="
                              margin-bottom: 20rpx;
                              width: 100%;
                              text-align: center;
                              font-size: 16px;
                            "
                          >
                            蓄水后的全景
                          </view>
                          <image
                            mode="widthFix"
                            style="width: 100%"
                            :src="extField.frontEndConfig.list[1]"
                            :data-src="extField.frontEndConfig.list[1]"
                          ></image>
                        </view>
                      </view>
                    </view>
                  </view>
                </block>
                <block v-else-if="extField.type == 'title'">
                  <view
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
                    class="c-cell-gap"
                    v-html="extField.frontEndConfig && extField.frontEndConfig.html"
                  ></view>
                </block>
                <block v-else-if="extField.type == 'area'">
                  <!-- #ifdef MP-WEIXIN -->
                  <van-cell
                    :title="extField.nameDisp"
                    :value="
                      area.areaList.province_list[formData[extField.name][0]] +
                      area.areaList.city_list[formData[extField.name][1]] +
                      area.areaList.county_list[formData[extField.name][2]]
                    "
                    @click="onClick"
                    :data-id="extField._id"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    :data-valueoption="extField.valueOption"
                    is-link
                    :required="extField.required == '1'"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                    :class="
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        ? 'c-disabled'
                        : ''
                    "
                  />
                  <!-- #endif -->
                  <!-- #ifdef APP-PLUS -->
                  <van-cell
                    :title="extField.nameDisp"
                    :data-id="extField._id"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    :data-valueoption="extField.valueOption"
                    :required="extField.required == '1'"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                    :class="
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        ? 'c-disabled'
                        : ''
                    "
                  >
                    <uni-data-picker
                      :key="'uniAreaPicker' + extField.name"
                      :ref="'uniAreaPicker' + extField.name"
                      :value="formData[extField.name]"
                      placeholder=""
                      popup-title="省市区"
                      :localdata="area.areaList"
                      :map="{
                        text: 'label',
                        value: 'value'
                      }"
                      :data-name="extField.name"
                      @change="areaConfirm($event, 'area')"
                      :clear-icon="false"
                      class="c-data-picker"
                    ></uni-data-picker>
                  </van-cell>
                  <!-- #endif -->
                </block>
                <block v-else-if="extField.type == 'scan'">
                  <view class="c-flex c-flex c-flex-between c-item-center c-bg-white c-cell-view">
                    <text class="c-cell_title">{{ extField.nameDisp }}</text>
                    <van-button
                      type="info"
                      round
                      size="mini"
                      @click="commonEvent('scan', extField.name, extField.frontEndConfig)"
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                      :class="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                          ? 'c-disabled'
                          : ''
                      "
                      :data-event="{ id: 'PSSv9SEjgF' }"
                    >
                      {{ extField.nameDisp }}
                    </van-button>
                  </view>
                </block>
                <block v-else-if="extField.type == 'addItem'">
                  <view class="c-cell-view c-flex c-flex-between">
                    <text>
                      <span class="c-red" v-if="extField.required == '1'">*</span>
                      {{ extField.nameDisp }}
                    </text>
                    <van-button
                      @click="commonEvent('addItem', extField.name, extField.frontEndConfig)"
                      :plain="extField.frontEndConfig.plain"
                      :type="extField.frontEndConfig.type"
                      :icon="extField.frontEndConfig.icon"
                      :disabled="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                      "
                      :class="
                        currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                          ? 'c-disabled'
                          : ''
                      "
                      size="mini"
                      :data-event="{ id: 'WwGBWJtjHM' }"
                    >
                      {{ extField.frontEndConfig.buttonName }}
                    </van-button>
                  </view>
                  <view class="c-cell-view" style="border-bottom: 1px solid #ebedf0">
                    <block v-for="(item, i) in formData[extField.name]" :key="i">
                      <van-tag
                        @close="tagClose(extField.name, i)"
                        :closeable="
                          currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) == -1
                        "
                        round
                        type="primary"
                        size="medium"
                        custom-class="c-m-10"
                        closeable
                      >
                        {{ commonEvent('codelabel', null, { option: extField.name, value: item }) }}
                      </van-tag>
                    </block>
                  </view>
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
                    :disabled="
                      extField.frontEndConfig.disabled ||
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                    "
                    :class="
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        ? 'c-disabled'
                        : ''
                    "
                    :data-event="{ id: 'MPzd70y6gl' }"
                  >
                    {{ extField.nameDisp }}
                  </van-button>
                </block>
                <block v-else-if="extField.type == 'bgImage'"></block>
                <!-- 按类别展示 -->
                <block v-else-if="extField.type == 'sort'">
                  <view v-if="extField.frontEndConfig.showName">{{ extField.name }}</view>
                  <van-cell :border="false">
                    <view
                      v-for="(item, key) in formData[extField.name]"
                      :key="key"
                      class="c-cell-view c-flex c-flex-between"
                      style="padding: 10px 25px"
                    >
                      <view>
                        {{
                          commonEvent('codelabel', null, { option: extField.option, value: key })
                        }}
                      </view>
                      <view>
                        <text>{{ item.length }}</text>
                        <text>{{ extField.frontEndConfig.unit }}</text>
                      </view>
                    </view>
                  </van-cell>
                </block>
                <block v-else-if="extField.type == 'download'">
                  <view
                    style="
                      background-color: #fff;
                      padding: 16rpx;
                      display: flex;
                      justify-content: space-between;
                    "
                  >
                    <view>{{ extField.nameDisp }}</view>
                    <view>
                      <van-button
                        icon="share"
                        plain
                        size="mini"
                        class="c-m-r-10"
                        round
                        @click="
                          copy(
                            extField.preset ? formData[extField.name] : formData.exts[extField.name]
                          )
                        "
                        custom-style="padding: 0 10rpx"
                        :data-event="{ id: 'idULHsfMP_' }"
                      >
                        复制链接
                      </van-button>
                      <van-button
                        icon="eye-o"
                        size="mini"
                        @click="download"
                        plain
                        round
                        custom-style="padding: 0 10rpx"
                        :data-filename="
                          extField.preset ? formData[extField.name] : formData.exts[extField.name]
                        "
                        :data-event="{ id: 'HYQsXKiXWg' }"
                      >
                        查看文件
                      </van-button>
                    </view>
                  </view>
                </block>
                <!-- 地图选址 -->
                <block v-else-if="extField.type == 'map'">
                  <van-field
                    :label="extField.nameDisp"
                    :value="formData[extField.name] || ''"
                    @change="onChange"
                    :data-extfield="extField"
                    :data-name="extField.name"
                    :data-type="extField.type == 'evaluate' ? 'digit' : extField.type"
                    :data-fec="extField.frontEndConfig"
                    :type="extField.type"
                    :readonly="!formData[extField.name]"
                    :required="extField.required == '1'"
                    input-align="right"
                    :right-icon="extField.name == 'address' ? 'location' : ''"
                    @click-input="isAddressEmptyClick"
                    @click-icon.stop="doOpen('../map/amap')"
                  ></van-field>
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
                  <view v-if="formData.serviceProcess" class="c-bg-white">
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
                              ? 'margin: 10px 0 -8px;border-bottom:none'
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
                                (step.operationIds &&
                                step.operationIds.indexOf(serviceProcess.operationId) != -1
                                  ? '* '
                                  : '') + step.name
                              "
                            />
                          </view>
                        </view>
                      </block>
                    </view>
                    <view v-if="!serviceProcess.sort" class="c-text-center c-p-b-20">
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
                      :localdata="options.parts"
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
                <!-- 原生类型 text number idcard digit textarea 自定义计算类型evaluate-->
                <block v-else>
                  <!-- #ifdef MP-WEIXIN -->
                  <van-field
                    :label="extField.nameDisp"
                    :value="formData[extField.name] || ''"
                    @change="onChange"
                    :data-extfield="extField"
                    :data-name="extField.name"
                    :data-type="extField.type == 'evaluate' ? 'digit' : extField.type"
                    :data-fec="extField.frontEndConfig"
                    :type="extField.type"
                    :readonly="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                    :class="
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        ? 'c-disabled'
                        : ''
                    "
                    :required="extField.required == '1'"
                    input-align="right"
                    :autosize="extField.type == 'textarea' ? true : false"
                    :right-icon="extField.name == 'address' ? 'location' : ''"
                    @click-icon="doOpen('../map/amap')"
                  >
                    <!-- <van-button
                    v-if="extField.name == 'address'"
                    slot="button"
                    type="info"
                    size="mini"
                    icon="location-o"
                    round
                    @click="doOpen('../map/amap')"
                    :data-event="{ id: 'MpOyQ-rssR' }"
                  >
                    定位
                  </van-button> -->
                  </van-field>
                  <!-- #endif -->
                  <!-- #ifdef APP-PLUS -->
                  <van-cell
                    :title="extField.nameDisp"
                    :data-id="extField._id"
                    :data-type="extField.type"
                    :data-name="extField.name"
                    :data-fec="extField.frontEndConfig"
                    :required="extField.required == '1'"
                    :disabled="currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1"
                    :class="
                      currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        ? 'c-disabled'
                        : ''
                    "
                  >
                    <view key="field-text" class="c-flex c-item-center">
                      <textarea
                        v-if="extField.type == 'textarea' || extField.name == 'address'"
                        :key="extField.name"
                        :value="formData[extField.name]"
                        :disabled="
                          currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        "
                        :data-extfield="extField"
                        :data-name="extField.name"
                        :data-type="
                          extField.type == 'evaluate'
                            ? 'digit'
                            : extField.type == 'number' || extField.type == 'digit'
                            ? extField.type
                            : 'text'
                        "
                        :data-fec="extField.frontEndConfig"
                        auto-height
                        style="text-align: left"
                        @input="onInput"
                      />
                      <input
                        v-else
                        :key="extField._id"
                        :value="formData[extField.name]"
                        :type="
                          extField.type == 'evaluate'
                            ? 'digit'
                            : extField.type == 'number' || extField.type == 'digit'
                            ? extField.type
                            : 'text'
                        "
                        :maxlength="extField.type == 'phone' ? 11 : -1"
                        :disabled="
                          currentNode.nodeDef.formFieldIdsReadOnly.indexOf(extField._id) != -1
                        "
                        :data-extfield="extField"
                        :data-name="extField.name"
                        :data-type="
                          extField.type == 'evaluate'
                            ? 'digit'
                            : extField.type == 'number' || extField.type == 'digit'
                            ? extField.type
                            : 'text'
                        "
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
                        :data-event="{ id: 'fcwmeMTM8m' }"
                      >
                        定位
                      </van-button>
                    </view>
                  </van-cell>
                  <!-- #endif -->
                </block>
              </block>
            </block>
          </block>
        </van-cell-group>
      </view>
    </view>
    <!-- TODO:currentNode.state == 10 -->
    <van-button
      v-if="currentNode.state == 10"
      class="submit-button"
      style="margin-top: 16px"
      @click="saveFormData"
      color="#106cff"
      block
    >
      提交
    </van-button>
    <!-- 上拉菜单 -->
    <van-popup
      :show="bizSelect.show"
      round
      position="bottom"
      custom-style="display:flex;flex-direction:column;height: 80%;"
      close-on-click-overlay
      @close="bizSelect.show = false"
    >
      <van-search
        :value="bizSelect.searchValue"
        placeholder="支持搜索名称"
        @change="bizSelectSearch"
      />
      <view class="c-flex-1 c-auto-y">
        <block v-for="(item, i) in bizSelect.data" :key="i">
          <view
            v-if="bizSelect.searchValue ? item.name.indexOf(bizSelect.searchValue) != -1 : true"
            style="padding: 10px 16px"
            @click="bizSelectClick(item)"
            :data-event="{ id: '6GWEFXB1TL' }"
          >
            {{ item.name }}
          </view>
        </block>
      </view>
    </van-popup>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
    ></van-action-sheet>
    <!-- 级联选择器 -->
    <!-- #ifdef MP-WEIXIN -->
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
    <!-- #ifdef MP-WEIXIN -->
    <van-popup :show="area.show" position="bottom">
      <van-area
        title="省市区"
        :area-list="area.areaList"
        @confirm="areaConfirm"
        @cancel="areaCancel"
      />
    </van-popup>
    <!-- #endif -->
    <!-- loading 遮罩层 -->
    <van-overlay :show="loading">
      <view class="wrapper">
        <van-loading vertical size="50px" class="c-loading">处理中...</van-loading>
      </view>
    </van-overlay>
    <!-- 公共弹窗 -->
    <van-dialog id="van-dialog" />
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
        :options="serviceType === '40' ? options.refreshParts : options.parts"
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
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      urlParams: {
        colName: '', //根据对象名称查询字段
        formDefId: '', //表单定义id
        formDataId: '', //表单数据id
        workflowNodeId: '', //节点id
        tenantId: '', //租户id
        userId: '', //用户id
        smodule: '', //模块
        sid: '' //模块id
      },
      //当前运行时节点
      currentNode: {
        nodeDef: {
          formFieldIdsReadOnly: []
        }
      },
      //表单定义
      formDef: {},
      //表单字段
      extFields: [],
      // 表单数据
      formData: {
        address: '',
        exts: {}
      },
      dataShow: true,
      //组件选项
      options: {
        serviceType: [],
        subdistricts: [],
        cascadeCode_parts: { codeId: 'parts' },
        codecfg_refreshParts: { codeId: 'refreshParts' }, // 刷新维修部位
        codecfg_partsOne: { codeId: 'partsOne' }
      },
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
        field: '',
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
      user: {}, //当前登陆人（user）的信息
      currentRole: {}, //当前切换的角色
      mapData: {}, //地图页面返回的数据
      bizSelect: {
        show: false,
        searchValue: '', // 业务档案弹出层搜索
        data: []
      },
      // 线索跟进记录
      followingUpNote: { dedicateMode: [] },
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
      projectTask: {}
    };
  },
  onShow() {
    common.osg.init(this, {}, app);
    // #ifdef MP-WEIXIN
    this.area.areaList = areajs.default;
    // #endif
    const { address = null, location = null } = this.mapData;
    if (address) {
      this.formData.address = address;
      // 补上经纬度字段
      const [longitude, latitude] = location.split(',').map(Number);
      this.formData.gpsPoint = { longitude, latitude };
      this.getAmapCode(data => {
        this.formData = common.osg.deepCopy(Object.assign(this.formData, data));
        this.$forceUpdate();
      });
    }
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.systemInfo = app.globalData.systemInfo;
    this.currentRole = wx.getStorageSync('currentRole');
    this.user = wx.getStorageSync('user');
    this.urlParams = {
      colName: common.osg.param('colName') || '',
      formDefId: common.osg.param('formDefId') || '',
      formDataId: common.osg.param('formDataId') || '',
      workflowNodeId: common.osg.param('workflowNodeId') || '',
      tenantId: common.osg.param('tenantId') || '1340835581184723420',
      userId: common.osg.param('userId') || '',
      smodule: common.osg.param('smodule') || '',
      sid: common.osg.param('sid') || '',
      leadId: common.osg.param('leadId') || '',
      sourceType: common.osg.param('sourceType') || '',
      serviceType: common.osg.param('serviceType') || '',
      projectTaskId: common.osg.param('projectTaskId') || ''
    };
    // 动态修改页面标题
    // #ifdef MP-WEIXIN || APP-PLUS
    if (this.urlParams.colName == 'declaration') {
      uni.setNavigationBarTitle({
        title: '报单'
      });
    }
    // #endif
    this.getFormData();
    if (this.urlParams.projectTaskId) {
      this.getProjectTask(this.urlParams.projectTaskId);
    }
    if (this.urlParams.colName == 'declaration') {
      this.options['codecfg_sourceType4'] = {
        codeId: 'sourceType4'
      };
    }
    this.getFields(() => {
      // 报单查询当前登录人可选的工单服务类型
      if (this.urlParams.colName == 'declaration') this.getMyServiceType();
    });
    if (this.urlParams.workflowNodeId) this.getNode();
    if (this.urlParams.leadId) {
      this.getLead(this.urlParams.leadId);
    }
    // #ifdef APP-PLUS
    this.getArea();
    // #endif
  },
  methods: {
    /**
     * 获取表单信息(标题)
     */
    getFormDef() {
      common.osg.ajax(
        'biz/ext/query.do',
        {
          tenantId: this.urlParams.tenantId,
          'is:_id|string#and': this.urlParams.formDefId
        },
        res => {
          this.formDef = res.data[0];
        }
      );
    },
    /**
     * 获取运行时节点信息
     */
    getNode() {
      common.osg.ajax(
        `workflow/queryWorkflowNode/${this.urlParams.workflowNodeId}.do`,
        null,
        res => {
          this.currentNode = res;
          if (res.state == 10) {
            common.osg.toast('已完成，请勿重复提交！', 'none');
          }
          this.$forceUpdate();
        }
      );
    },
    /**
     * 获取表单字段
     */
    getFields(callback) {
      if (this.urlParams.colName) {
        var url = `s/queryByColName/${this.urlParams.colName}/${this.urlParams.tenantId}.do`;
        var params = {};
      } else {
        var url = 'biz/extField/query.do';
        var params = {
          tenantId: this.urlParams.tenantId,
          extId: this.urlParams.formDefId,
          sortField: 'order',
          sortOrder: 'asc',
          _all: '1'
        };
      }
      common.osg.ajax(
        url,
        params,
        res => {
          if (this.urlParams.colName) {
            var extFields = res.entity.extFieldList;
          } else {
            var extFields = res.data;
          }
          extFields = extFields.filter(
            item => item.state == 1 && item.showList && item.showList.indexOf('4') != -1
          );
          //公式脚本id
          let scriptIds = [];
          for (var extField of extFields) {
            if (!extField.frontEndConfig) {
              extField.frontEndConfig = {};
            }

            //解析frontEndConfig字段配置
            if (extField.frontEndConfig && common.osg.isJson(extField.frontEndConfig)) {
              extField.frontEndConfig = JSON.parse(extField.frontEndConfig);
              if (extField.type == 'bgImage') {
                this.bgImage = extField.frontEndConfig.list[0];
              }
            }

            //特殊类型字段默认值
            if (
              extField.type == 'file' ||
              extField.type == 'area' ||
              extField.type == 'scan' ||
              extField.type == 'addItem' ||
              extField.type == 'bizSelect'
            ) {
              this.formData[extField.name] = this.formData[extField.name] || [];
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
          // 解决外部调用
          this.options['codecfg_tenantId'] = {
            eleid: 'tenantId',
            tenantId: this.urlParams.tenantId
          };
          // 从线索建单，需要选择通话状态
          if (this.urlParams.leadId) {
            this.options.cascadeCode_LEADSTATUS = {
              codeId: 'LEADSTATUS'
            };
          }
          //查询options 赋值extFields
          common.osg.codeoption(() => {
            this.extFields = extFields;
            if (callback) callback();
            // console.log(this.options, '--this.options111');
            // this.options.repairParts.map(item => {
            //   item.text = item.name;
            //   if (item.children) {
            //     item.children.map(itemData => {
            //       itemData.text = itemData.name;
            //     });
            //   }
            // });
            // console.log(this.options, '--this.options222');
          }, this.urlParams.tenantId);

          //批量查询公式脚本 并保存到options
          if (scriptIds.length > 0) {
            common.osg.ajax(
              'groovyScript/query.do',
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
     */
    getFormData() {
      //当通过colName查询时没有formDefId
      if (!this.urlParams.formDefId) return;
      common.osg.ajax(
        `biz/extForm/query/${this.urlParams.formDefId}.do`,
        {
          tenantId: this.urlParams.tenantId,
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:_id|string#and': this.urlParams.formDataId
        },
        res => {
          res.data[0] = res.data[0] || {};
          this.formData = res.data[0];
        },
        {
          noload: true
        }
      );
    },
    /**
     * 提交表单数据
     */
    saveFormData(frontEndConfig) {
      if (this.currentNode.state == 10) {
        common.osg.alert('已完成，请勿重复提交！');
        return;
      }
      //检测是否必填
      for (var extField of this.extFields) {
        // 展示的字段才校验
        if (
          common.osg.showType(extField, this.formData, this.currentRole._id) &&
          !extField.frontEndConfig.mpDetailHide
        ) {
          // 校验是否必填
          if (extField.required == '1') {
            if (
              extField.type == 'file' ||
              extField.type == 'area' ||
              extField.type == 'scan' ||
              extField.type == 'addItem' ||
              extField.multiple
            ) {
              if (!this.formData[extField.name] || this.formData[extField.name].length == 0) {
                common.osg.alert(extField.nameDisp + '为必填项');
                return;
              }
            } else if (!this.formData[extField.name] && this.formData[extField.name] !== 0) {
              extField.type == 'dialog'
                ? common.osg.alert(extField.nameDisp)
                : common.osg.alert(extField.nameDisp + '为必填项');
              return;
            }
          }
          // 校验手机号格式
          if (extField.type == 'phone' && this.formData[extField.name]) {
            if (!this.checkMobile(this.formData[extField.name])) {
              common.osg.alert(extField.nameDisp + '格式错误');
              return;
            }
          }
          // 需要正则校验
          if (extField.frontEndConfig.verify && this.formData[extField.name]) {
            if (!this.verify(extField)) {
              common.osg.alert(extField.nameDisp + '格式错误');
              return;
            }
          }
        }
      }

      // 显示遮罩层 禁止点击
      this.loading = true;
      let params = this.formData;
      params.tentantId = this.urlParams.tenantId; //租户id
      params.smodule = this.urlParams.smodule || 'serviceAppointment'; //模块
      params.sid = this.urlParams.sid; //模块数据id
      common.osg.ajax(
        `biz/extForm/upsert/${this.urlParams.formDefId}.do`,
        {
          dataStr: JSON.stringify(params)
        },
        res => {
          //处理工作流节点
          if (this.urlParams.workflowNodeId) {
            this.process(res.data._id);
          } else {
            // 隐藏遮罩层
            this.loading = false;

            // 如果配置了提示信息展示提示信息 否则展示"提交成功"
            if (frontEndConfig && frontEndConfig.success) {
              common.osg.alert(frontEndConfig.success, () => {
                // #ifdef H5
                location.reload();
                // #endif

                // #ifdef MP-WEIXIN || APP-PLUS
                this.formData = {
                  exts: {}
                };
                this.$forceUpdate();
                // #endif
              });
            } else {
              common.osg.alert('提交成功', () => {
                // #ifdef H5
                location.reload();
                // #endif

                // #ifdef MP-WEIXIN || APP-PLUS
                this.formData = {
                  exts: {}
                };
                this.$forceUpdate();
                // #endif
              });
            }
          }
        }
      );
    },
    /**
     * 处理工作流节点
     */
    process(formDataId) {
      let params = {
        workflowNodeId: this.urlParams.workflowNodeId,
        nodeFormDefId: this.urlParams.formDefId,
        nodeFormDataId: formDataId || this.urlParams.formDataId,
        smodule: this.urlParams.smodule || 'serviceAppointment',
        tenantId: this.urlParams.tenantId,
        userId: this.urlParams.userId,
        context: this.user.orgIds
      };
      common.osg.ajax(
        '/s/processWorkflow.do',
        params,
        res => {
          // 隐藏遮罩层
          this.loading = false;

          // 弹窗提示
          common.osg.alert('提交成功', () => {
            //工作流处理成功后不再发请求 修改工作流状态 实现禁止重复点击
            // #ifdef H5
            this.currentNode.state = 10;
            // location.reload();
            // #endif

            // #ifdef MP-WEIXIN || APP-PLUS
            this.currentNode.state = 10;
            // this.formData = {
            // 	exts: {}
            // };
            // this.$forceUpdate();
            // #endif
          });
        },
        {
          method: 'GET'
        }
      );
    },
    /**
     * 提交表单
     */
    submit() {
      if (this.formData.subdistrict && Array.isArray(this.formData.subdistrict)) {
        common.osg.toast('无法自动识别街道，请手动选择街道', 'none', 4000);
        return;
      }

      // 从线索建单时，校验跟进记录必填字段
      if (this.urlParams.leadId) {
        if (!this.formData.dedicateMode || this.formData.dedicateMode.length == 0) {
          common.osg.alert('通话状态为必填项');
          return;
        }
      }

      for (var extField of this.extFields) {
        // 展示的字段才校验
        if (
          common.osg.showType(extField, this.formData, this.currentRole._id) &&
          !extField.frontEndConfig.mpDetailHide
        ) {
          // 校验是否必填
          if (extField.required == '1') {
            if (
              extField.type == 'file' ||
              extField.type == 'area' ||
              extField.type == 'scan' ||
              extField.type == 'addItem' ||
              extField.multiple
            ) {
              if (!this.formData[extField.name] || this.formData[extField.name].length == 0) {
                common.osg.alert(extField.nameDisp + '为必填项');
                return;
              }
            } else if (!this.formData[extField.name] && this.formData[extField.name] !== 0) {
              extField.type == 'dialog'
                ? common.osg.alert(extField.nameDisp)
                : common.osg.alert(extField.nameDisp + '为必填项');
              return;
            }
          }
          // 校验手机号格式
          if (extField.type == 'phone' && this.formData[extField.name]) {
            if (!this.checkMobile(this.formData[extField.name])) {
              common.osg.alert(extField.nameDisp + '格式错误');
              return;
            }
          }
          // 需要正则校验
          if (extField.frontEndConfig.verify && this.formData[extField.name]) {
            if (!this.verify(extField)) {
              common.osg.alert(extField.nameDisp + '格式错误');
              return;
            }
          }
          // 校验闭水深度字段
          if (extField.name == 'depth' && !this.checkDeth(this.formData.depth)) {
            common.osg.alert('深度需要在1-10之间，并且只保留一位小数！');
            return;
          }
        }
      }

      //显示遮罩层 禁止点击
      this.loading = true;
      // 提交表单时扩展移动到formData.exts
      this.formData.exts = this.formData.exts || {};
      for (var extField of this.extFields) {
        // 展示的字段才校验
        if (
          common.osg.showType(extField, this.formData, this.currentRole._id) &&
          !extField.frontEndConfig.mpDetailHide
        ) {
          if (!extField.preset) {
            this.formData.exts[extField.name] = this.formData[extField.name];
            if (
              extField.type != 'file' &&
              extField.type != 'area' &&
              extField.type != 'scan' &&
              extField.type != 'addItem' &&
              extField.type != 'bizSelect'
            ) {
              delete this.formData[extField.name];
            }
          }
        }
      }

      // 创建工单标题
      if (this.formData.serviceType == '30') {
        this.formData.title = this.formData.exts.headmanName + '的报单';
      } else {
        this.formData.title = this.formData.name + '的报单';
      }
      // #ifdef MP-WEIXIN || APP-PLUS
      // let roleIds = this.user.roleIds; //查询当前登录人角色
      let currentRole = this.currentRole._id; //查询当前登录的角色id
      //赋值工单的信息渠道 8050029062726074247管家    7100212906800336051内勤  5424993602217461538工队
      // 只有当前登录人是管家、内勤、工队才会给channel赋值
      if (
        currentRole == '8050029062726074247' ||
        currentRole == '7100212906800336051' ||
        currentRole == '5424993602217461538'
      ) {
        // if (roleIds.includes('7100212906800336051')) {
        //   // 如果有合伙人内勤则信息渠道为
        //   this.formData.channel = ['46', '4610', '4610070'];
        // } else if (roleIds.includes('8050029062726074247')) {
        //   //如果有管家角色信息渠道则为
        //   this.formData.channel = ['46', '4610', '4610080'];
        // } else if (roleIds.includes('5424993602217461538')) {
        //   //如果有工队角色信息渠道则为
        //   this.formData.channel = ['46', '4610', '4610060'];
        // }
        if (currentRole == '7100212906800336051') {
          // 如果有合伙人内勤则信息渠道为
          this.formData.channel = ['46', '4610', '4610070'];
        } else if (currentRole == '8050029062726074247') {
          //如果有管家角色信息渠道则为
          this.formData.channel = ['46', '4610', '4610080'];
        } else if (currentRole == '5424993602217461538') {
          //如果有工队角色信息渠道则为
          this.formData.channel = ['46', '4610', '4610060'];
        }
      }
      //  服务类型为闭水检测时处理部位字段类型
      if (this.formData.serviceType == '30') {
        this.formData.exts.leakagesite_copy = common.osg.deepCopy(this.formData.exts.leakagesite);
        let arr = [];
        for (let i = 0; i < this.formData.exts.leakagesite.length; i++) {
          this.formData.exts.leakagesite[i] = [this.formData.exts.leakagesite[i]];
          arr.push(this.formData.exts.leakagesite[i]);
        }
        this.formData.exts.leakagesite = arr;
      } else {
        //TODO:不通用，如果维修部位单一值则需要改为级联
        if (this.formData.exts.leakagesite) {
          this.formData.exts.leakagesite_copy = common.osg.deepCopy(this.formData.exts.leakagesite);
          this.formData.exts.leakagesite = [this.formData.exts.leakagesite];
        }
      }
      // #endif

      let param = {};
      let header = null;
      let url = '';
      if (this.urlParams.h5UserId) this.formData.exts.h5UserId = this.urlParams.h5UserId;

      if (this.urlParams.leadId) {
        var followingUpNote = {
          _id: this.randomUUid(),
          bizType: 'Lead',
          bizId: this.urlParams.leadId || '',
          dedicateMode: this.formData.dedicateMode || [],
          nextTime: this.formData.nextTime || '',
          memo: this.formData.memo || '',
          name: this.formData.name || '',
          phone: this.formData.phone || '',
          province: this.formData.province || '',
          city: this.formData.city || '',
          district: this.formData.district || '',
          address: this.formData.address || '',
          channel: this.formData.channel || [],
          leakagesite: this.formData.leakagesite || []
        };
        delete this.formData.dedicateMode;
        delete this.formData.nextTime;
        delete this.formData.memo;
      }

      //只有当前的角色为管家的时候 才添加这个字段
      if (this.currentRole._id == '8050029062726074247') {
        this.formData.assignServiceResourceId = this.user.serviceResourceId || null;
        this.formData.exts.assignServiceResourceId = this.user.serviceResourceId || null;
        let params = {
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc',
          _all: '1',
          notFilterBelongTo: '1',
          notFilterOrgId: '1'
        };
        common.osg.ajax('biz/serviceResource/query.do', params, res => {
          // 查找名称为 '刘亦森' 的项并返回 _id
          const result = res.data.find(item => item._id == this.formData.assignServiceResourceId);
          this.formData.assignServiceResourceIdLabel = result.name || '';
        });
        console.log('管家报单的时候才会执行', this.formData);
      }
      console.log('客服报单', this.formData);

      // #ifdef H5
      param = JSON.stringify(this.formData);
      url = `s/upsert.do?id=${this.urlParams.userId}`;
      header = {
        'Content-type': 'application/json;charset=utf-8'
      };
      // #endif
      // #ifdef MP-WEIXIN || APP-PLUS
      param['serviceAppointment'] = JSON.stringify(this.formData);
      url = 'basic/serviceAppointment/upsert.do';
      // #endif

      common.osg.ajax(
        url,
        param,
        res => {
          if (res.success) {
            this.loading = false;
            common.osg.alert('报单成功', () => {
              // #ifdef H5
              location.reload();
              // #endif
              // #ifdef MP-WEIXIN || APP-PLUS
              this.$set(this, 'formData', {
                exts: {}
              });
              this.$set(this.formData, 'name', '');
              this.$set(this.formData, 'phone', '');
              this.$set(this.formData, 'address', '');
              this.$set(this.formData, 'memo', '');
              this.$set(this.formData, 'describe', '');
              this.$forceUpdate();
              // #endif
              // 从线索建单后返回线索列表
              if (this.urlParams.leadId) {
                common.osg.ajax(
                  'followingUpNote/upsert',
                  followingUpNote,
                  () => {
                    wx.navigateBack({
                      delta: 1
                    });
                  },
                  {
                    noload: true
                  }
                );
              }
            });
          } else {
            common.osg.alert('请稍后重试');
          }
        },
        {
          header: header,
          noload: true
        }
      );
    },
    /**
     * 表单组件触发特殊事件
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
        // 后期优化
        let newOption =
          this.formData.serviceType === '40' && options.option.startsWith('sourceType')
            ? 'sourceType4'
            : options.option;

        let str = common.osg.codelabel(newOption, options.value);
        return str == '未知' ? '' : str;
      } else if (eventName == 'button') {
        let func = options.extField.frontEndConfig.func;
        if (func) {
          this[func](options.extField.frontEndConfig);
        }
      }
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
     * 表单字段 输入
     */
    onChange(e) {
      let type = e.target.dataset.type;
      let field = e.target.dataset.name;
      let frontEndConfig = e.target.dataset.frontEndConfig;
      let value = e.detail;
      // 字段赋值
      this.formData[field] = value;
      if (type == 'evaluate') {
        //根据脚本id匹配脚本公式
        let scritpId = frontEndConfig;
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
    // App端输入框
    onInput(e) {
      let field = e.target.dataset.name;
      this.formData[field] = e.detail.value;
      this.$forceUpdate();
    },
    /**
     * 表单字段 点击
     */
    onClick(e) {
      let type = e.target.dataset.type;
      let field = e.target.dataset.name;
      let fieldId = e.target.dataset.id;
      let valueOption = e.target.dataset.valueoption;
      let frontEndConfig = e.target.dataset.fec;
      //只读字段
      if (this.currentNode.nodeDef.formFieldIdsReadOnly.indexOf(fieldId) != -1) {
        return;
      }
      if (field == 'noteItemsSelect') {
        // 施工验收单-选择注意事项
        this.formData.noteItems = this.formData.noteItems || [];
        if (this.noteItemsSelect.items.length > 0) {
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
                  text: this.codelabel('select', 'partsOne', obj.part, this.options.partsOne),
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
        let optionsType =
          this.formData.serviceType === '40' && valueOption.startsWith('sourceType')
            ? 'sourceType4'
            : valueOption;

        let actions = this.options[optionsType];

        if (this.formData.serviceType !== '40') {
          actions = actions.filter(item => item.value !== '8');
        }

        this.actionSheet = {
          actions,
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
        common.osg.ajax(frontEndConfig.url, frontEndConfig.params, res => {
          res.data.map(item => {
            item.label = item[frontEndConfig.label];
            item.value = item[frontEndConfig.value];
          });
          this.options[field] = res.data;
          this.bizSelect = {
            show: true,
            field: field,
            data: this.options[field],
            searchValue: ''
          };
        });
      } else if (type == 'area') {
        this.area.field = field;
        // #ifdef MP-WEIXIN
        this.area.show = true;
        // #endif
        // #ifdef APP-PLUS
        this.$refs['uniAreaPicker' + field][0] && this.$refs['uniAreaPicker' + field][0].show();
        // #endif
      }
      this.$forceUpdate();
    },
    /**
     * 上拉菜单选择
     */
    actionSheetSelect(e) {
      if (this.actionSheet.field == 'serviceType' && !this.urlParams.leadId)
        this.formData = { exts: {} };
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
      this.actionSheet;
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
      this.cascader.show = false;
      // #ifdef APP-PLUS
      this.$refs &&
        this.$refs.uniDataPicker &&
        this.$refs.uniDataPicker.hide &&
        this.$refs.uniDataPicker.hide();
      this.$refs &&
        this.$refs.dedicateMode &&
        this.$refs.dedicateMode.hide &&
        this.$refs.dedicateMode.hide();
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
        this.formData[this.datetime.field] = new Date(value)
          .toLocaleString('chinese', {
            hour12: false
          })
          .replace(/\//g, '-');
      } else if (this.datetime.type == 'date') {
        this.formData[this.datetime.field] = new Date(value)
          .toLocaleDateString()
          .replace(/\//g, '-');
      } else if (this.datetime.type == 'time') {
        this.formData[this.datetime.field] = value;
      }
      this.datetime.show = false;
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
      this.formData[field || this.area.field] = areaVal; //adcode的数组
      // #ifdef MP-WEIXIN
      this.area.show = false;
      // #endif
      // #ifdef APP-PLUS
      this.$refs['uniAreaPicker' + this.area.field] &&
        this.$refs['uniAreaPicker' + this.area.field].hide();
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
      // #ifdef MP-WEIXIN
      this.area.show = false;
      // #endif
      // #ifdef APP-PLUS
      this.$refs['uniAreaPicker' + this.area.field][0].hide();
      // #endif
      this.area.field = '';
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
      common.osg.afterRead(
        e,
        this,
        extfield.frontEndConfig.max,
        this.formData[extfield.name].length
      );
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
    //验证手机号
    checkMobile(sMobile) {
      if (!/^1[3456789]\d{9}$/.test(sMobile)) {
        return false;
      } else {
        return true;
      }
    },
    //验证 深度 1-10 保留一位小数点
    checkDeth(num) {
      if (!/^([1-9](\.\d)?|10)$/.test(num)) {
        return false;
      } else {
        return true;
      }
    },
    // 正则校验
    verify(extField) {
      //多个正则表达式的对象
      let regexpObj = extField.frontEndConfig.regexpObj;
      if (!regexpObj) return false;
      //根据某字段值选择不同正则表达式
      let verifyField = extField.frontEndConfig.verifyField;
      if (verifyField) {
        let key = this.formData[extField.frontEndConfig.verifyField];
        if (key) {
          let regexp = new RegExp(regexpObj[key]);
          if (regexp) {
            if (regexp.test(this.formData[extField.name])) {
              return true;
            }
          }
        }
      } else {
        // 默认正则表达式，无需根据其他字段值选择不同正则表达式
        let regexp = new RegExp(regexpObj.regexp);
        if (regexp) {
          if (regexp.test(this.formData[extField.name])) {
            return true;
          }
        }
      }
      return false;
    },
    // 复制到剪切板
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    // 查看文件
    download: function (e) {
      var fileName = e.currentTarget.dataset.filename;
      var fileType = fileName.split('.')[fileName.split('.').length - 1];
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
    // 业主确认报价单
    confirmQuotation() {
      common.osg.ajax('/i/bjd/quotation.do', { id: this.urlParams.formDataId }, res => {
        this.loading = false;
        common.osg.alert('确认成功', () => {
          // #ifdef H5
          location.reload();
          // #endif
          // #ifdef MP-WEIXIN || APP-PLUS
          this.$forceUpdate();
          // #endif
        });
      });
    },
    // 字段展示类型
    showType(field, formData) {
      return common.osg.showType(field, formData, this.currentRole._id);
    },
    getMyServiceType() {
      // 默认平台和城市运营可选全部服务类型。数据权限是“全部”的角色也需要return，否则下面查询到全部伙伴默认排序第一条数据不一定有服务类型。
      if (
        this.user.orgId == '0' ||
        this.user.orgId == '1340835581184723420' ||
        this.currentRole.dataAuth == 4 ||
        this.currentRole.code == 'operation'
      ) {
        return;
      }
      common.osg.ajax(
        'basic/partner/query.do',
        {
          notFilterBelongTo: '1'
        },
        res => {
          let partner = res.data[0] || {};
          let myServiceType = [];
          for (let i = 0; i < this.options.serviceType.length; i++) {
            if (
              partner.serviceType &&
              partner.serviceType.indexOf(this.options.serviceType[i].value) != -1
            ) {
              myServiceType.push(this.options.serviceType[i]);
            }
          }
          this.$set(this.options, 'serviceType', myServiceType);
          console.log('serviceType 赋值', this.options);
        },
        { noload: true }
      );
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    // 调用高德aip定位返回经纬度
    getAmapCode(callback) {
      common.osg.ajax(
        '~https://restapi.amap.com/v3/geocode/regeo',
        {
          key: '1544e78c6949e7843efff0691ce9dc67',
          location: this.mapData.location,
          extensions: 'base', // 返回结果控制
          batch: false // batch=true为批量查询;batch=false为单点查询;
        },
        res => {
          if (res.status == '1') {
            let data = res.regeocode.addressComponent;
            // 高德地图API无法识别街道时，towncode字段会返回数组
            if (Array.isArray(data.towncode)) {
              common.osg.toast('无法自动识别街道，请手动选择街道', 'none', 4000);
            }
            let obj = {
              province: data.adcode.slice(0, 2) + '0000',
              city: data.adcode.slice(0, 4) + '00',
              district: data.adcode,
              subdistrict: data.towncode.slice(0, 9)
            };
            obj.area = [obj.province, obj.city, obj.district];
            this.getSubdistricts(obj.area, result => {
              if (!result.find(item => item.code == obj.subdistrict)) {
                obj.subdistrict = data.township;
              }
              this.$set(this.options, 'subdistricts', result);
              callback(obj);
            });
          } else {
            callback({});
          }
        }
      );
    },
    /**
     * 获取街道
     */
    getSubdistricts(arr, callback) {
      if (arr && arr.length >= 3) {
        common.osg.ajax(
          'area/query.do',
          {
            _all: '1',
            notFilterOrgId: '1',
            notFilterTenantId: '1',
            parentCode: arr[2],
            level: '4',
            sortField: 'code',
            sortOrder: 'asc',
            areaTranslation: '1' // 同时返回补充的街道
          },
          res => {
            res.data.map(item => {
              item.value = item.code;
              item.label = item.name;
              item.leaf = true;
            });
            if (callback) {
              callback(res.data);
            }
          },
          {
            noload: true
          }
        );
      } else {
        if (callback) {
          callback([]);
        }
      }
    },
    bizSelectSearch(e) {
      this.bizSelect.searchValue = e.detail;
    },
    bizSelectClick(item) {
      this.formData[this.bizSelect.field] = item.value;
      this.formData[this.bizSelect.field + 'Label'] = item.label;
      this.bizSelect.show = false;
    },
    // 线索转工单，将线索部分字段赋值到报单表单
    getLead(leadId) {
      common.osg.ajax(
        'basic/lead/queryById',
        {
          id: leadId
        },
        res => {
          this.formData.leadIds = [leadId];
          this.formData.title = res.name + '的工单 ' + common.osg.readableTime();
          this.formData.name = res.name;
          this.formData.phone = res.phone;
          this.formData.serviceType = res.serviceType;
          this.formData.area = res.area || [];
          if (this.formData.area.length > 0) {
            common.osg.getSubdistricts(this.formData.area, res => {
              this.options.subdistricts = res;
            });
          }
          this.formData.province = res.province || res.area[0] || '';
          this.formData.city = res.city || '';
          this.formData.district = res.district || res.area[1] || '';
          this.formData.subdistrict = res.subdistrict || res.area[2] || '';
          this.formData.community = res.community || '';
          this.formData.address = res.address;
          this.formData.channel = res.channel;
          this.formData.sourceType = res.exts.sourceType;
          let leakagesite = common.osg.isJson(res.exts.leakagesite)
            ? JSON.parse(res.exts.leakagesite)
            : res.exts.leakagesite;
          this.formData.leakagesite = (leakagesite && leakagesite[0]) || [];
        }
      );
    },
    // 生成uuid（18位），随机数（5位）+时间戳（13位）
    randomUUid() {
      let num = '';
      for (var i = 0; i < 5; i++) {
        num += Math.floor(Math.random() * 10);
      }
      return num + new Date().valueOf();
    },
    // 获取省市区字典
    getArea() {
      common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
        this.area = res;
      });
    },

    isAddressEmptyClick() {
      if (this.formData.address) return;
      // 当用户地址为空的时候 点击跳转到地图选点
      this.doOpen('../map/amap');
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
        },
        {
          noload: true
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
      });
    },
    addPartConfirm(e) {
      // #ifdef MP-WEIXIN
      const { selectedOptions } = e.detail;
      let repairParts = selectedOptions.map(item => item.value);
      this.formData.serviceProcess.push({
        repairParts,
        constructionLocation: common.osg.formatCascade('', repairParts, this.options.parts),
        procedures: []
      });
      this.serviceProcess.part.show = false;
      // #endif
      // #ifdef APP-PLUS
      let repairParts = e.detail.value.map(item => item.value);
      this.formData.serviceProcess.push({
        repairParts,
        constructionLocation: common.osg.formatCascade('', repairParts, this.options.parts),
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
          'in:serviceType|array#and': this.urlParams.serviceType,
          'regex:name|string#and': e && e.detail,
          'is:isAccepted|string#and': '1', // 只查询需要验收的工序
          'regex:exts.repairParts|string#or': JSON.stringify(
            this.formData.serviceProcess[this.serviceProcess.part.index].repairParts
          ),
          'is:exts.repairParts|string#or': '[]', // 或过滤没有部位的施工日志
          sourceType: this.urlParams.sourceType,
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
          'is:serviceAppointmentId|string#and': this.urlParams.sid,
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
    /**
     * 点击查看全部 弹窗展示
     */
    dataClick(field, data) {
      this[field] = {
        show: true,
        data
      };
    },
    getProjectTask(projectTaskId) {
      common.osg.ajax('biz/projectTask/query', { _id: projectTaskId }, res => {
        if (res.data.length > 0) {
          this.projectTask = res.data[0];
          this.formData = res.data[0].fieldData;
          if (this.formData.serviceProcess) {
            for (let i = 0; i < this.formData.serviceProcess.length; i++) {
              let part = this.formData.serviceProcess[i];
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
        }
      });
    },
    saveProjectTask() {
      if (common.osg.isRepeatClick('saveProjectTask')) {
        return; //判断是否重复点击
      }
      let obj = {
        taskId: this.urlParams.projectTaskId,
        event: 'process' //started开工 safety安全 material材料 labourer人员 work上工地 process施工 rest下工地 finished完工
      };
      let param = {
        eventType: 'process'
      };
      for (let item of this.projectTask.fieldList) {
        let frontEndConfig = {};
        if (item.frontEndConfig && common.osg.isJson(item.frontEndConfig))
          frontEndConfig = JSON.parse(item.frontEndConfig);
        if (
          item.type == 'file' ||
          (item.type != 'title' && item.type != 'displayText' && item.type != 'button') ||
          frontEndConfig.dataType == 'form'
        ) {
          param[item.name] = this.projectTask.fieldData[item.name];
          if (
            item.required == '1' &&
            (Array.isArray(param[item.name])
              ? param[item.name].length == 0
              : !param[item.name] && param[item.name] !== 0)
          ) {
            common.osg.toast(`“${item.nameDisp}”为必填项`, 'none');
            return;
          }
        }
      }
      obj.param = param;
      common.osg.ajax(
        `biz/projectTask/confirm`,
        obj,
        res => {
          common.osg.toast('提交成功', 'none');
          wx.navigateBack({
            delta: 1
          });
        },
        {
          header: { 'Content-Type': 'application/json' },
          noload: true
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.extForm {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: env(safe-area-inset-bottom);
  ::v-deep .van-cell__title {
    flex: auto;
    max-width: 110px;
  }
  .c-extForm {
    border-radius: 8px;
    flex: 1;
    overflow-y: auto;
    margin: 16px 16px 0;
    background-color: #fff;
  }
  .uni-data-tree .input-value-border .selected-list {
    justify-content: flex-end !important;
  }
  .bgView {
    margin-top: -30px;
    border-radius: 20rpx;
  }

  /* 示例图片 */
  .cell-wrapper-p14 {
    background-color: #fff;
    padding: 20rpx 14rpx;
  }

  .cell-title-bottom-30 {
    margin-bottom: 30rpx;
  }

  .image-sample {
    display: flex;
  }

  .accordingButton {
    margin: 0;
    margin-right: 16rpx;
  }

  .c-cell-view {
    border-bottom: 1px solid #ebedf0;
  }

  .c-data-picker {
    ::v-deep .uni-data-tree-input {
      .selected-list {
        justify-content: flex-end;
      }
    }
  }
  .submit-button {
    width: calc(100vw - 32px);
    margin: 0 16px;
  }
}
</style>
<style lang="scss">
.extForm {
  padding-bottom: 1px;
  .van-cell {
    .van-cell__title {
      flex: unset !important;
      margin-right: 0 !important;
      min-width: 70px !important;
      max-width: unset !important;
    }
    .van-field__body--textarea {
      padding: 0;
    }
  }
  .uni-date-x {
    height: 24px;
  }
  .uni-data-tree {
    .input-value {
      height: 24px;
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

  .serviceProcess-part {
    border: 1px solid #969799;
    border-radius: 10px;
    padding: 10px;
    margin: 0 10px 10px;
    > view:last-of-type {
      border-bottom: none !important;
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
    }
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
  // 图片关闭按钮放大
  .van-uploader__preview .van-uploader__preview-delete:after {
    width: 20px;
    height: 20px;
    border-radius: 0 0 0 3px;
  }
  .van-uploader__preview .van-uploader__preview-delete .van-uploader__preview-delete-icon {
    font-size: 22px;
  }
}
</style>
