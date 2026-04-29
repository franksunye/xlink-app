<template>
  <view class="lead" @click.capture="track">
    <van-tabs
      :active="activeTab"
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
      :data-event="{ id: '1Gazj3pgoo', capture: false }"
      class="c-tabs-margin-top"
    >
      <van-tab title="表单" name="form">
        <!-- 表单组件渲染 -->
        <view class="fields" :data-event="{ id: '1Gazj3pgoo' }">
          <van-cell-group :border="false">
            <block v-for="(extField, index) in fields" :key="index">
              <!-- 只展示已启用的字段-->
              <block v-if="extField.state == 1 && !extField.frontEndConfig.mpDetailHide">
                <block v-if="showType(extField, formData)">
                  <block v-if="extField.type == 'phone'">
                    <van-field
                      :label="extField.nameDisp"
                      :value="formData[extField.name]"
                      @change="onChange"
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      type="number"
                      :maxlength="extField.type == 'phone' ? 11 : -1"
                      :required="extField.required == '1'"
                      input-align="right"
                      :disabled="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                      "
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
                        :data-type="extField.type"
                        :data-name="extField.name"
                        :data-fec="extField.frontEndConfig"
                        active-value="1"
                        inactive-value="0"
                        size="18px"
                        :disabled="
                          extField.operationType == '2' ||
                          (extField.operationType == '3' && formData._id)
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
                      :data-field="extField"
                      :data-id="extField._id"
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      :data-valueoption="extField.valueOption"
                      :required="extField.required == '1'"
                      :is-link="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? false
                          : true
                      "
                      :value-class="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? 'value-class-disabled'
                          : ''
                      "
                    ></van-cell>
                  </block>
                  <block v-else-if="extField.type == 'select'">
                    <van-cell
                      :title="extField.nameDisp"
                      :value="
                        commonEvent('codelabel', null, {
                          option: extField.valueOption,
                          value: formData[extField.name]
                        })
                      "
                      @click="onClick"
                      :data-field="extField"
                      :data-id="extField._id"
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      :data-valueoption="extField.valueOption"
                      :required="extField.required == '1'"
                      :is-link="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? false
                          : true
                      "
                      :value-class="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? 'value-class-disabled'
                          : ''
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
                      @click="onClick"
                      :data-field="extField"
                      :data-id="extField._id"
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      :data-valueoption="extField.valueOption"
                      :required="extField.required == '1'"
                      :is-link="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? false
                          : true
                      "
                      :value-class="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? 'value-class-disabled'
                          : ''
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
                      @click="onClick"
                      :data-field="extField"
                      :data-id="extField._id"
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      :data-valueoption="extField.valueOption"
                      :required="extField.required == '1'"
                      :is-link="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? false
                          : true
                      "
                      :value-class="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? 'value-class-disabled'
                          : ''
                      "
                    ></van-cell>
                  </block>
                  <block v-else-if="extField.type == 'radio'">
                    <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                      <van-radio-group
                        :value="formData[extField.name]"
                        @change="onChange"
                        :data-type="extField.type"
                        :data-name="extField.name"
                        :data-fec="extField.frontEndConfig"
                        class="c-radio-group"
                        :disabled="
                          extField.operationType == '2' ||
                          (extField.operationType == '3' && formData._id)
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
                    <van-cell :title="extField.nameDisp" :required="extField.required == '1'">
                      <van-checkbox-group
                        :value="formData[extField.name]"
                        @change="onChange"
                        :data-type="extField.type"
                        :data-name="extField.name"
                        :data-fec="extField.frontEndConfig"
                        class="c-checkbox-group"
                        :disabled="
                          extField.operationType == '2' ||
                          (extField.operationType == '3' && formData._id)
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
                        :value="formData[extField.name]"
                        @change="onChange"
                        :data-type="extField.type"
                        :data-name="extField.name"
                        :data-fec="extField.frontEndConfig"
                        :disabled="
                          extField.operationType == '2' ||
                          (extField.operationType == '3' && formData._id)
                        "
                      ></van-rate>
                    </van-cell>
                  </block>
                  <block v-else-if="extField.type == 'file'">
                    <view
                      class="c-cell-view c-flex c-flex-between c-border-n c-relative"
                      :data-event="{ id: '1Gazj3pgoo' }"
                    >
                      <view class="c-cell_title" :data-event="{ id: '1Gazj3pgoo' }">
                        <text
                          class="c-required"
                          v-if="extField.required == '1'"
                          :data-event="{ id: '1Gazj3pgoo' }"
                        >
                          *
                        </text>
                        <text :data-event="{ id: '1Gazj3pgoo' }">{{ extField.nameDisp }}</text>
                      </view>
                      <view class="c-cell_value" :data-event="{ id: '1Gazj3pgoo' }">
                        {{
                          ((formData[extField.name] && formData[extField.name].length) || 0) +
                          ' / ' +
                          (extField.frontEndConfig.max || '10')
                        }}
                      </view>
                    </view>
                    <view class="c-cell-view" :data-event="{ id: '1Gazj3pgoo' }">
                      <van-uploader
                        style="display: flex"
                        :file-list="formData[extField.name]"
                        @after-read="afterRead"
                        :data-extField="extField"
                        :data-field="extField.name"
                        @delete="deleteFile"
                        :max-count="
                          extField.frontEndConfig.max || extField.frontEndConfig.max == 0
                            ? extField.frontEndConfig.max
                            : 10
                        "
                        :disabled="
                          extField.operationType == '2' ||
                          (extField.operationType == '3' && formData._id)
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
                      :data-event="{ id: '1Gazj3pgoo' }"
                    ></view>
                  </block>
                  <block v-else-if="extField.type == 'gap'">
                    <view class="c-cell-gap" :data-event="{ id: '1Gazj3pgoo' }">
                      {{ extField.frontEndConfig && extField.frontEndConfig.html }}
                    </view>
                  </block>
                  <block v-else-if="extField.type == 'area'">
                    <van-cell
                      :title="extField.nameDisp"
                      :value="
                        area.areaList.province_list[
                          formData[extField.name] && formData[extField.name][0]
                        ] +
                        area.areaList.city_list[
                          formData[extField.name] && formData[extField.name][1]
                        ] +
                        area.areaList.county_list[
                          formData[extField.name] && formData[extField.name][2]
                        ]
                      "
                      @click="onClick"
                      :data-field="extField"
                      :data-id="extField._id"
                      :data-type="extField.type"
                      :data-name="extField.name"
                      :data-fec="extField.frontEndConfig"
                      :data-valueoption="extField.valueOption"
                      :required="extField.required == '1'"
                      :is-link="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? false
                          : true
                      "
                      :value-class="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                          ? 'value-class-disabled'
                          : ''
                      "
                    />
                  </block>
                  <block v-else-if="extField.type == 'scan'">
                    <view
                      class="c-flex c-flex c-flex-between c-item-center c-bg-white c-cell-view"
                      :data-event="{ id: '1Gazj3pgoo' }"
                    >
                      <text class="c-cell_title" :data-event="{ id: '1Gazj3pgoo' }">
                        {{ extField.nameDisp }}
                      </text>
                      <van-button
                        type="info"
                        round
                        size="mini"
                        @click="commonEvent('scan', extField.name, extField.frontEndConfig)"
                        :disabled="
                          extField.operationType == '2' ||
                          (extField.operationType == '3' && formData._id)
                        "
                        :data-event="{ id: '1yWxDMPkpT' }"
                      >
                        {{ extField.nameDisp }}
                      </van-button>
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
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                      "
                      :data-event="{ id: 'jHonKkPwPK' }"
                    >
                      {{ extField.nameDisp }}
                    </van-button>
                  </block>
                  <block v-else-if="extField.type == 'download'">
                    <view
                      style="
                        background-color: #fff;
                        padding: 16rpx;
                        display: flex;
                        justify-content: space-between;
                      "
                      :data-event="{ id: '1Gazj3pgoo' }"
                    >
                      <view :data-event="{ id: '1Gazj3pgoo' }">{{ extField.nameDisp }}</view>
                      <view :data-event="{ id: '1Gazj3pgoo' }">
                        <van-button
                          icon="share"
                          plain
                          size="mini"
                          class="c-m-r-10"
                          round
                          @click="
                            copy(
                              extField.preset
                                ? formData[extField.name]
                                : formData.exts[extField.name]
                            )
                          "
                          custom-style="padding: 0 10rpx"
                          :data-event="{ id: 'GJn7ZeQv_A' }"
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
                          :data-event="{ id: '2iJNP-1TfB' }"
                        >
                          查看文件
                        </van-button>
                      </view>
                    </view>
                  </block>
                  <!-- 原生类型 text number idcard digit textarea 自定义计算类型evaluate-->
                  <block v-else>
                    <van-field
                      v-if="formData._id"
                      :label="extField.nameDisp"
                      :value="formData[extField.name]"
                      @change="onChange"
                      :data-extfield="extField"
                      :data-name="extField.name"
                      :data-type="extField.type == 'evaluate' ? 'digit' : extField.type"
                      :data-fec="extField.frontEndConfig"
                      :type="extField.type"
                      :required="extField.required == '1'"
                      :input-align="extField.type == 'textarea' ? 'left' : 'right'"
                      :autosize="extField.type == 'textarea' ? true : false"
                      :disabled="
                        extField.operationType == '2' ||
                        (extField.operationType == '3' && formData._id)
                      "
                    >
                      <van-button
                        v-if="extField.name == 'address'"
                        slot="button"
                        type="info"
                        size="small"
                        icon="location-o"
                        round
                        @click="doOpen('/subpackages/map/amap')"
                        :disabled="
                          extField.operationType == '2' ||
                          (extField.operationType == '3' && formData._id)
                        "
                        :data-event="{ id: 'kX4ZeFhQt1' }"
                      >
                        定位
                      </van-button>
                    </van-field>
                  </block>
                </block>
              </block>
            </block>
          </van-cell-group>
        </view>
        <!-- <view
      class="submit"
      :style="
        systemInfo.platform == 'ios' || systemInfo.platform == 'devtools'
          ? 'padding-bottom:25px'
          : 'padding-bottom:10px'
      " :data-event="{id:'1Gazj3pgoo'}">
      <van-button
        @click="doSave"
        type="info"
        block
        custom-style="width:calc(100% - 20px);border-radius:8px;" :data-event="{id:'vQ6pGgIjwE'}">
        提交
      </van-button>
    </view> -->
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
          <view class="c-flex-1 c-auto-y" :data-event="{ id: '1Gazj3pgoo' }">
            <block v-for="(item, i) in bizSelect.data" :key="i">
              <view
                v-if="bizSelect.searchValue ? item.name.indexOf(bizSelect.searchValue) != -1 : true"
                style="padding: 10px 16px"
                @click="bizSelectClick(item)"
                :data-event="{ id: 'Y-09zcj7wj' }"
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
      </van-tab>
      <van-tab title="动态" name="log">
        <!-- #ifdef MP-WEIXIN -->
        <van-collapse
          :value="log.collapse"
          @change="logCollapseChange"
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
          :data-event="{ id: '1Gazj3pgoo' }"
        >
          <block v-for="(item, index) in log.data" :key="index">
            <view class="c-card" :data-event="{ id: '1Gazj3pgoo' }">
              <view class="c-card-title" :data-event="{ id: '1Gazj3pgoo' }">
                <view class="c-flex" :data-event="{ id: '1Gazj3pgoo' }">
                  <van-icon
                    v-if="item.type == '1'"
                    name="edit"
                    size="20px"
                    class="c-blue c-m-r-10"
                    :data-event="{ id: '1Gazj3pgoo' }"
                  ></van-icon>
                  <van-icon
                    v-else-if="item.type == '2'"
                    name="description"
                    size="20px"
                    class="c-blue c-m-r-10"
                    :data-event="{ id: '1Gazj3pgoo' }"
                  ></van-icon>
                  <van-icon
                    v-else-if="item.type == '3'"
                    name="phone-circle"
                    size="20px"
                    class="c-blue c-m-r-10"
                    :data-event="{ id: '1Gazj3pgoo' }"
                  ></van-icon>
                  <van-icon
                    v-else-if="item.type == '4'"
                    name="notes"
                    size="20px"
                    class="c-blue c-m-r-10"
                    :data-event="{ id: '1Gazj3pgoo' }"
                  ></van-icon>
                  <van-icon
                    v-else-if="item.type == '5'"
                    name="map-marked"
                    size="20px"
                    class="c-blue c-m-r-10"
                    :data-event="{ id: '1Gazj3pgoo' }"
                  ></van-icon>
                  <van-icon
                    v-else
                    name="records"
                    size="20px"
                    class="c-blue c-m-r-10"
                    :data-event="{ id: '1Gazj3pgoo' }"
                  ></van-icon>
                  <text :data-event="{ id: '1Gazj3pgoo' }">{{ item.name }}</text>
                </view>
                <view
                  v-if="item.type == '1' && item.taskTime"
                  class="c-weight-normal"
                  :data-event="{ id: '1Gazj3pgoo' }"
                >
                  {{ item.taskTime }}
                </view>
                <view
                  v-if="item.type == '3' && item.typeId && item.recordUrl"
                  class="c-blue c-weight-normal"
                  @click="
                    doOpen('/subpackages/serviceAppointment/speechText', {
                      colId: item.typeId,
                      audioTitle: SAFormData.name + '的通话录音' + item.createTime,
                      recordUrl: item.recordUrl
                    })
                  "
                  :data-event="{ id: 'E0mfwGgXO2' }"
                >
                  录音文本
                </view>
              </view>
              <view
                class="c-card-content"
                style="color: #646566"
                :data-event="{ id: '1Gazj3pgoo' }"
              >
                <view
                  v-if="item.type == '3' && item.recordUrl"
                  class="c-flex c-item-center"
                  :data-event="{ id: '1Gazj3pgoo' }"
                >
                  <van-icon
                    v-if="callRecord.recordUrl != item.recordUrl || callRecord.state != 'playing'"
                    name="play-circle"
                    class="call-button c-blue c-m-r-20"
                    size="40px"
                    @click="callPlay(item)"
                    :data-event="{ id: 'c8lT5sDUrM' }"
                  />
                  <van-icon
                    v-else
                    name="pause-circle"
                    class="call-button c-blue c-m-r-20"
                    size="40px"
                    @click="callPause()"
                    :data-event="{ id: '3GroaPKijF' }"
                  />
                  <view
                    v-if="callRecord.recordUrl == item.recordUrl && callRecord.max"
                    class="audio-wrapper"
                    :data-event="{ id: '1Gazj3pgoo' }"
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
                      <view class="slider-button" slot="button" :data-event="{ id: '1Gazj3pgoo' }">
                        {{ callRecord.currentTime }}
                      </view>
                    </van-slider>
                    <view :data-event="{ id: '1Gazj3pgoo' }">{{ callRecord.endTime }}</view>
                  </view>
                </view>
                <view v-else :data-event="{ id: '1Gazj3pgoo' }">
                  <view
                    v-if="item.type == '6' && item.dedicateMode"
                    :data-event="{ id: '1Gazj3pgoo' }"
                  >
                    通话状态：{{ formatDedicateMode(item.dedicateMode) }}
                  </view>
                  <text v-if="item.type == '6' && item.content" :data-event="{ id: '1Gazj3pgoo' }">
                    备注内容：
                  </text>
                  <text :data-event="{ id: '1Gazj3pgoo' }">
                    {{ item.content || '' }}
                  </text>
                </view>
              </view>
              <view class="c-log-footer" :data-event="{ id: '1Gazj3pgoo' }">
                <text
                  v-if="
                    item.type == '2' && item.name == '新建工单'
                      ? currentRoleButtons.find(
                          item => item.code == 'serviceAppointment.createUserName'
                        )
                      : true
                  "
                  :data-event="{ id: '1Gazj3pgoo' }"
                >
                  {{ item.createUserName || '系统' }}
                </text>
                <text class="c-m-l-20" :data-event="{ id: '1Gazj3pgoo' }">
                  {{ item.createTime }}
                </text>
              </view>
            </view>
          </block>
        </view>
      </van-tab>
    </van-tabs>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      systemInfo: {},
      currentRole: {}, //当前切换的角色
      currentRoleButtons: [],
      user: {}, //当前登陆人（user）的信息
      id: '',
      fields: [],
      options: {
        subdistricts: []
      },
      formData: {
        exts: {}
      },
      //组件选项
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
      // 业务档案
      bizSelect: {
        show: false,
        searchValue: '',
        data: []
      },
      mapData: {}, //地图页面返回的数据
      activeTab: 'form',
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
      }
    };
  },
  onShow() {
    common.osg.init(this, {}, app);
    this.area.areaList = areajs.default;
    if (this.mapData.address) {
      this.formData.address = this.mapData.address;
      this.getAmapCode(data => {
        this.formData = common.osg.deepCopy(Object.assign(this.formData, data));
        this.$forceUpdate();
      });
    }
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.id = param.id;
    this.systemInfo = app.globalData.systemInfo;
    this.currentRole = wx.getStorageSync('currentRole');
    this.currentRoleButtons = wx.getStorageSync('currentRoleButtons') || [];
    this.user = wx.getStorageSync('user');
    if (param.activeTab == 'log') {
      this.activeTab = 'log';
    }
    common.osg.getFields(
      'lead',
      () => {
        this.getData();
      },
      {
        params: {
          'in:showList|string#and': '4'
        }
      }
    );
  },
  methods: {
    tabChange(e) {
      this.activeTab = e.detail.name;
      if (this.activeTab == 'log') {
        if (this.log.myActionTypes.length == 0) this.getMyActionTypes();
        this.getLog();
      }
    },
    getData() {
      common.osg.ajax('basic/lead/queryById', { id: this.id }, res => {
        this.formData = res;
        if (res.area && res.area.length > 0) {
          common.osg.getSubdistricts(res.area, res => {
            this.options.subdistricts = res;
          });
        }
      });
    },
    doSave() {
      common.osg.ajax('basic/lead/upsert', { data: JSON.stringify(this.formData) }, res => {
        common.osg.toast('保存成功', 'none');
      });
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
        return common.osg.codelabel(options.option, options.value);
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
          for (var extField of this.fields) {
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
      let extField = e.target.dataset.field;
      if (extField.operationType == '2' || (extField.operationType == '3' && formData._id)) return;
      let type = e.target.dataset.type;
      let field = e.target.dataset.name;
      let fieldId = e.target.dataset.id;
      let value = e.detail;
      let valueOption = e.target.dataset.valueoption;
      let frontEndConfig = e.target.dataset.fec;

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
        this.area.show = true;
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
      this.cascader.show = false;
    },
    /**
     * 选择时间 提交
     */
    datetimeConfirm(e) {
      let value = e.detail;
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
    // 字段展示类型
    showType(field, formData) {
      return common.osg.showType(field, formData, this.currentRole._id);
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
    /**
     * 动态
     */
    // 获取当前角色可查看的动态类型
    getMyActionTypes() {
      let myActionTypes = [];
      let myActionTypeValues = [];
      this.currentRoleButtons.map(item => {
        if (item.code.startsWith('lead.actionType')) {
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
          bizType: 'lead',
          sid: this.id,
          actionType:
            this.log.type.length > 0 ? this.log.type.join() : this.log.myActionTypeValues.join()
        },
        res => {
          this.log.data = res.data.reverse();
        }
      );
    },
    // 过滤活动折叠面板展开或收起
    logCollapseChange(e) {
      this.log.collapse = e.detail;
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
    formatDedicateMode(dedicateMode) {
      if (common.osg.isJson(dedicateMode) && Array.isArray(JSON.parse(dedicateMode))) {
        return common.osg.formatCascade('LEADSTATUS', JSON.parse(dedicateMode));
      } else {
        return '';
      }
    }
  }
};
</script>

<style lang="scss">
.lead {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .fields {
    border-radius: 8px;
    margin: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
    .van-cell {
      .van-cell__title {
        flex: unset !important;
        margin-right: 0 !important;
        min-width: 70px !important;
        max-width: unset !important;
      }
    }
  }
  .submit {
    width: 100vw;
    background: #f7f8fa;
  }
  ::v-deep .value-class-disabled {
    color: #c8c9cc !important;
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
}
</style>
