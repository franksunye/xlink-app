<template>
  <view class="serviceAppointments" @click.capture="track">
    <view class="header">
      <!-- 搜索、功能按钮 -->
      <view class="c-flex c-item-center c-w-1 c-bg-default">
        <van-search
          :value="searchValue"
          @search="onSearch"
          @clear="onSearch"
          use-action-slot
          shape="round"
          placeholder="请输入搜索关键词"
          class="c-flex-1"
          custom-class="c-search"
          background="#f7f8fa"
        ></van-search>
        <image
          style="min-width: 24px; width: 24px; height: 24px; margin: 10px 10px 0 0; display: flex"
          :src="
            map.show ? 'https://pub.fsgo365.cn/map-active.png' : 'https://pub.fsgo365.cn/map.png'
          "
          @click="mapClick"
          :data-event="{ id: 'zEkzp5YylE' }"
        />
        <image
          style="min-width: 24px; width: 24px; height: 24px; margin: 10px 10px 0 0; display: flex"
          :src="
            filter.conditions.applyTimeStart ||
            filter.conditions.applyTimeEnd ||
            filter.conditions.etags.length > 0
              ? 'https://pub.fsgo365.cn/filter-active.png'
              : 'https://pub.fsgo365.cn/filter.png'
          "
          @click="filterOpen"
          :data-event="{ id: '_frff_O9dN' }"
        />
      </view>
      <!-- 工单状态标签页 -->
      <van-tabs
        id="vantTabs"
        swipeable
        @change="tabChange"
        :active="active"
        v-if="activeShow"
        sticky
        offset-top="44"
        :ellipsis="false"
        custom-class="c-tabs"
        nav-class="c-bg-default"
        wrap-class="c-line-bottom"
        :data-event="{ id: '_Dt0zd9vyv', capture: false }"
      >
        <block v-for="(func, i) in functionList" :key="i">
          <van-tab
            :title="func.name || '待办工单'"
            :name="func._id"
            :info="functionCount[func._id] || ''"
          ></van-tab>
        </block>
      </van-tabs>
      <!-- 上门时间 -->
      <!-- <van-notice-bar
        v-if="filter.applyTimeStart || filter.applyTimeEnd"
        wrapable
        :scrollable="false"
        :text="`上门时间：${filter.applyTimeStart} ~ ${filter.applyTimeEnd}`" :data-event="{id:'_frff_O9dN'}" /> -->
      <!-- 地图 -->
      <view
        v-if="map.show && !filter.show && !SR.show"
        class="map-view"
        :style="map.zoom == 'expand' ? 'height:calc(100vh - 90px);' : 'height:250px;'"
        :data-event="{ id: '_frff_O9dN' }"
      >
        <!-- @regionchange="regionchange" -->
        <map
          id="SAMap"
          class="map"
          :style="map.zoom == 'expand' ? 'height:calc(100% - 65px);' : 'height:calc(100% - 50px);'"
          :longitude="map.longitude"
          :latitude="map.latitude"
          :includePoints="map.includePoints"
          :show-location="true"
          :markers="map.markers"
          @markertap="markerClick"
        ></map>
        <!-- <van-icon
          v-if="map.zoom == 'shrink'"
          class="map-zoom"
          name="expand-o"
          size="40"
          color="#323233"
          @click="map.zoom = 'expand'" :data-event="{id:'HLOY4YPk0q'}" />
        <van-icon
          v-else
          class="map-zoom"
          style="bottom: 70px"
          name="shrink"
          size="40"
          color="#323233"
          @click="map.zoom = 'shrink'" :data-event="{id:'NhvQ6pdmPt'}" /> -->
        <view class="map-bottom" :data-event="{ id: '_frff_O9dN' }">
          <!-- #ifdef MP-WEIXIN -->
          <van-image
            width="50px"
            height="25px"
            fit="cover"
            :src="
              map.zoom == 'shrink'
                ? 'https://pub.fsgo365.cn/arrow-down-large.png'
                : 'https://pub.fsgo365.cn/arrow-up-large.png'
            "
            class="c-flex c-flex-center"
            @click="map.zoom == 'shrink' ? (map.zoom = 'expand') : (map.zoom = 'shrink')"
            :data-event="{ id: 'K4eNGRiueW' }"
          ></van-image>
          <view class="map-total" :data-event="{ id: '_frff_O9dN' }">
            可视范围内共
            <text class="c-red" :data-event="{ id: '_frff_O9dN' }">{{ map.markers.length }}</text>
            单
          </view>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <image
            style="width: 50px; height: 25px; margin: 0 auto"
            :src="
              map.zoom == 'shrink'
                ? 'https://pub.fsgo365.cn/arrow-down-large.png'
                : 'https://pub.fsgo365.cn/arrow-up-large.png'
            "
            @click="map.zoom == 'shrink' ? (map.zoom = 'expand') : (map.zoom = 'shrink')"
            :data-event="{ id: 'esTQa8h-nH' }"
          ></image>
          <view
            class="map-total"
            style="margin-bottom: 5px; margin-top: -5px"
            :data-event="{ id: '_frff_O9dN' }"
          >
            可视范围内共
            <text class="c-red" :data-event="{ id: '_frff_O9dN' }">{{ map.markers.length }}</text>
            单
          </view>
          <!-- #endif -->
        </view>
      </view>
    </view>
    <!-- 过滤条件、排序 -->
    <van-popup
      :show="filter.show"
      position="top"
      round
      custom-style="height:80%;display:flex;flex-direction:column;"
      @close="filterClose"
    >
      <view :class="['c-flex-1', { 'c-auto-y': isAutoY }]">
        <view class="c-p-30">
          <view class="c-bold">排序</view>
          <view class="tags">
            <van-tag
              class="tag"
              :color="filter.sort == '' ? '#e0edfd' : '#f2f3f4'"
              :text-color="filter.sort == '' ? '#2A80F0' : '#3b4045'"
              size="large"
              @click.native="filter.sort = ''"
            >
              按更新时间倒序
            </van-tag>
            <van-tag
              class="tag"
              :color="filter.sort == 'applyTime' ? '#e0edfd' : '#f2f3f4'"
              :text-color="filter.sort == 'applyTime' ? '#2A80F0' : '#3b4045'"
              size="large"
              @click.native="filter.sort = 'applyTime'"
            >
              按上门时间正序
            </van-tag>
            <van-tag
              class="tag"
              :color="filter.sort == 'priority' ? '#e0edfd' : '#f2f3f4'"
              :text-color="filter.sort == 'priority' ? '#2A80F0' : '#3b4045'"
              size="large"
              @click.native="filter.sort = 'priority'"
            >
              按优先级
            </van-tag>
          </view>
        </view>
        <view style="width: 100vw; height: 10px; background: #f2f3f4"></view>
        <view class="c-p-30">
          <view class="c-bold">上门时间</view>
          <view class="c-radius-8 c-hidden c-m-t-20">
            <!-- #ifdef MP-WEIXIN -->
            <van-cell
              title="开始时间"
              :value="filter.applyTimeStart"
              @click="filterTimeClick"
              data-key="applyTimeStart"
              :is-link="true"
              custom-class="c-bg-tag"
            ></van-cell>
            <van-cell
              title="结束时间"
              :value="filter.applyTimeEnd"
              data-key="applyTimeEnd"
              @click="filterTimeClick"
              :is-link="true"
              :border="false"
              custom-class="c-bg-tag"
            ></van-cell>
            <!-- #endif -->
            <!-- #ifdef APP-PLUS -->
            <van-cell title="开始时间" data-key="applyTimeStart" custom-class="c-bg-tag">
              <uni-datetime-picker
                key="taskTime"
                :value="filter.applyTimeStart"
                placeholder=" "
                @change="datetimeConfirm($event, 'applyTimeStart')"
                @show="isAutoY = false"
                @maskClick="isAutoY = true"
                :clear-icon="false"
              />
            </van-cell>
            <van-cell
              title="结束时间"
              data-key="applyTimeEnd"
              :border="false"
              custom-class="c-bg-tag"
            >
              <uni-datetime-picker
                key="taskTimes"
                :value="filter.applyTimeEnd"
                placeholder=" "
                @change="datetimeConfirm($event, 'applyTimeEnd')"
                @show="isAutoY = false"
                @maskClick="isAutoY = true"
                :clear-icon="false"
              />
            </van-cell>
            <!-- #endif -->
          </view>
        </view>
        <view style="width: 100vw; height: 10px; background: #f2f3f4"></view>
        <view class="c-p-30">
          <view class="c-bold">客户标签</view>
          <view>
            <block v-for="(tagType, i) in filter.tagTypeData" :key="i">
              <view v-if="tagType.type == 0 && tagType.typeId == currentRole._id" class="tag-type">
                <view>{{ tagType.name }}</view>
                <view class="tags">
                  <block v-for="(tag, j) in filter.tagData" :key="j">
                    <van-tag
                      v-if="tag.tagTypeId == tagType._id"
                      class="tag"
                      :color="filter.etags.indexOf(tag._id) != -1 ? '#e0edfd' : '#f2f3f4'"
                      :text-color="filter.etags.indexOf(tag._id) != -1 ? '#2A80F0' : '#3b4045'"
                      size="large"
                      @click.native="tagClick(tag._id)"
                    >
                      {{ tag.name }}
                    </van-tag>
                  </block>
                </view>
              </view>
            </block>
          </view>
          <view>
            <view class="c-m-b-10 c-p-t-30">个人标签</view>
            <block v-for="(tagType, i) in filter.tagTypeData" :key="i">
              <view v-if="tagType.type == 1" class="tags">
                <block v-for="(tag, j) in filter.tagData" :key="j">
                  <van-tag
                    v-if="tag.tagTypeId == tagType._id && tag.typeId == user._id"
                    class="tag"
                    :color="filter.etags.indexOf(tag._id) != -1 ? '#e0edfd' : '#f2f3f4'"
                    :text-color="filter.etags.indexOf(tag._id) != -1 ? '#2A80F0' : '#3b4045'"
                    size="large"
                    @click.native="tagClick(tag._id)"
                  >
                    {{ tag.name }}
                  </van-tag>
                </block>
              </view>
            </block>
          </view>
        </view>
      </view>
      <view class="c-flex c-p-30">
        <van-button
          plain
          block
          class="c-flex-1 c-m-r-30"
          @click="filterReset"
          :data-event="{ id: 'aA2-Bh8kXR' }"
        >
          重置
        </van-button>
        <van-button
          type="info"
          block
          class="c-flex-1"
          @click="filterSave"
          :data-event="{ id: 's9JEkMCyiH' }"
        >
          保存
        </van-button>
      </view>
    </van-popup>
    <!-- 顶部占位 -->
    <view :style="map.show ? 'height:330px' : 'height:90px'"></view>
    <!-- 工单列表 -->
    <view v-if="!map.show || map.zoom != 'expand'" style="padding-bottom: 1px">
      <view
        :id="'listitem-' + active + '-' + j"
        v-for="(listitem, j) in boundings"
        :key="j"
        :style="{
          height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
          margin: '20rpx 0'
        }"
      >
        <view v-if="index - 1 <= j && j <= index + 1 && list[j]">
          <view
            class="c-card"
            :class="map.show && map.first == item.data._id ? 'c-card-first' : ''"
            style="padding-top: 10px"
            v-for="(item, k) in list[j]"
            :key="k"
            @tap="toDetail(item.data._id, j, k)"
            :data-id="item.data._id"
            :id="'sa-' + item.data._id"
          >
            <view class="c-card-title">
              <view
                v-if="
                  item.data.exts.sourceType == '1' ||
                  item.data.exts.sourceType == '2' ||
                  item.data.exts.sourceType == '5'
                "
                class="c-card-tag"
                @click.stop="copy(item.data.orderNum)"
                :data-event="{ id: 'P0nUkD1FpN' }"
              >
                <view class="c-card-tag-title c-bg-red" :data-event="{ id: 'P0nUkD1FpN' }">
                  雨虹
                </view>
                <view class="c-card-tag-info c-red c-border-red" :data-event="{ id: 'P0nUkD1FpN' }">
                  <text :data-event="{ id: 'P0nUkD1FpN' }">{{ item.data.orderNum }}</text>
                  <text class="c-size-13 c-weight-normar" :data-event="{ id: 'P0nUkD1FpN' }">
                    丨复制
                  </text>
                </view>
              </view>
              <view
                v-else-if="
                  item.data.exts.sourceType == '3' ||
                  item.data.exts.sourceType == '4' ||
                  item.data.exts.sourceType == '8'
                "
                class="c-card-tag"
                @click.stop="copy(item.data.orderNum)"
                :data-event="{ id: '2lyjcUpFBK' }"
              >
                <view class="c-card-tag-title c-bg-blue" :data-event="{ id: '2lyjcUpFBK' }">
                  修链
                </view>
                <view
                  class="c-card-tag-info c-blue c-border-blue"
                  :data-event="{ id: '2lyjcUpFBK' }"
                >
                  <text :data-event="{ id: '2lyjcUpFBK' }">{{ item.data.orderNum }}</text>
                  <text class="c-size-13 c-weight-normar" :data-event="{ id: '2lyjcUpFBK' }">
                    丨复制
                  </text>
                </view>
              </view>
              <view
                v-else
                class="c-card-tag"
                @click.stop="copy(item.data.orderNum)"
                :data-event="{ id: '2UgqZC3sxs' }"
              >
                <view class="c-card-tag-title c-bg-gray" :data-event="{ id: '2UgqZC3sxs' }">
                  其他
                </view>
                <view
                  class="c-card-tag-info c-gray c-border-gray"
                  :data-event="{ id: '2UgqZC3sxs' }"
                >
                  <text :data-event="{ id: '2UgqZC3sxs' }">{{ item.data.orderNum }}</text>
                  <text class="c-size-13 c-weight-normar" :data-event="{ id: '2UgqZC3sxs' }">
                    丨复制
                  </text>
                </view>
              </view>
              <view class="c-red">
                {{ codelabel('select', 'status', (item.data && item.data.status) || '') || '' }}
              </view>
            </view>
            <view class="c-card-content">
              <view class="c-card-content-item">
                <view class="c-card-content-item-label">客户名称：</view>
                <view>{{ item.data.name }}</view>
              </view>
              <view class="c-card-content-item">
                <view class="c-card-content-item-label">详细地址：</view>
                <view class="c-nowrap">{{ item.data.address || '' }}</view>
              </view>

              <view
                class="c-card-content-item"
                v-if="
                  !map.show &&
                  currentRoleButtons.find(item => item.code == 'serviceAppointments.channel')
                "
              >
                <view class="c-card-content-item-label">信息渠道：</view>
                <view class="c-nowrap">
                  {{
                    codelabel('cascade', 'channel', (item.data && item.data.channel) || '') || ''
                  }}
                </view>
              </view>
              <view
                v-if="item.data.exts && item.data.exts.applyTimeStr"
                class="c-card-content-item"
              >
                <view class="c-card-content-item-label">上门时间：</view>
                <view>{{ item.data.exts.applyTimeStr }}</view>
              </view>
              <view v-if="item.data.describe" class="c-card-content-item">
                <view class="c-card-content-item-label">备注信息：</view>
                <view
                  class="c-nowrap"
                  @click.stop="describeClick(item.data.describe)"
                  :data-event="{ id: 'Gz5FeToy35' }"
                >
                  {{ item.data.describe }}
                </view>
              </view>
              <view class="c-card-content-item" v-if="!map.show">
                <van-tag
                  :color="
                    ['40'].includes(item.data && item.data.serviceType) ? '#1989fa' : '#ad0000'
                  "
                  plain
                >
                  {{
                    codelabel(
                      'select',
                      'serviceType',
                      (item.data && item.data.serviceType) || ''
                    ) || ''
                  }}
                </van-tag>
              </view>
              <view v-if="sideCallButtonShow(item)" class="c-phone-position">
                <van-button
                  v-if="item.data && item.data.phone"
                  custom-class="c-button-round"
                  plain
                  round
                  icon="phone-o"
                  @click.native.stop="makeCall(item.data.phone)"
                  :data-event="{ id: 'N4O_YR92Lf' }"
                ></van-button>
                <van-button
                  v-else
                  plain
                  round
                  icon="phone-o"
                  custom-class="c-button-round"
                  @click.native.stop="
                    call(
                      '1',
                      null,
                      item.data.contactIds && item.data.contactIds[0]
                        ? item.data.contactIds[0]
                        : '',
                      item.data._id
                    )
                  "
                  :data-event="{ id: 'hepbzJk58K' }"
                ></van-button>
              </view>
            </view>
            <view v-if="!sideCallButtonShow(item)" class="c-card-footer c-flex-between">
              <!-- 联系客户 -->
              <block v-if="Number(item.data.status) > 103">
                <van-button
                  v-if="item.data && item.data.phone"
                  custom-class="c-button-round"
                  plain
                  round
                  icon="phone-o"
                  @click.native.stop="makeCall(item.data.phone)"
                  :data-event="{ id: 'NFQouD6S99' }"
                ></van-button>
                <van-button
                  v-else
                  plain
                  round
                  icon="phone-o"
                  custom-class="c-button-round"
                  @click.native.stop="
                    call(
                      '1',
                      null,
                      item.data.contactIds && item.data.contactIds[0]
                        ? item.data.contactIds[0]
                        : '',
                      item.data._id
                    )
                  "
                  :data-event="{ id: 'vydurZ04B_' }"
                ></van-button>
              </block>
              <view v-else></view>
              <view>
                <!-- 预约节点选不需要上门，工单状态改为201不需要上门，后续节点关闭，此时允许管家和内勤重启工单。 -->
                <van-button
                  v-if="
                    (item.data.status == '201' || item.data.status == '999') &&
                    ((item.handlerIds &&
                      (item.handlerIds.indexOf(user._id) != -1 ||
                        item.handlerIds.indexOf(currentRole._id) != -1 ||
                        item.handlerIds.indexOf(user.orgId + '+' + currentRole._id) != -1)) ||
                      currentRole._id == '7100212906800336051')
                  "
                  plain
                  round
                  icon="replay"
                  @click.native.stop="openRestore(item.data._id)"
                  :data-event="{ id: '15ymykbJIc' }"
                >
                  重启工单
                </van-button>
                <!-- 内勤 102:待分派管家 201:不需要上门 204:上门未成交 300:待分派工队  -->
                <van-button
                  v-if="
                    currentRole._id == '7100212906800336051' &&
                    Number(item.data.status) > 102 &&
                    Number(item.data.status) < 203 &&
                    item.data.status != '201'
                  "
                  plain
                  round
                  icon="manager-o"
                  @click.native.stop="openSR(item, 'reassign', '1')"
                  :data-event="{ id: 'ChGOHh_FB7' }"
                >
                  重新派管家
                </van-button>
                <!-- 内勤 300:待分派工队 301:待工队接单 302:待进场交底 401:待验收 402:待完工 403:已完工 -->
                <van-button
                  v-if="
                    currentRole._id == '7100212906800336051' &&
                    Number(item.data.status) > 300 &&
                    Number(item.data.status) < 401
                  "
                  plain
                  round
                  icon="user-o"
                  @click.native.stop="openSR(item, 'reassign', '2')"
                  :data-event="{ id: '-1PfKD0_Et' }"
                >
                  重新派工队
                </van-button>
                <!-- 运营 分派或重新分派工单 -->
                <van-button
                  v-if="
                    currentRoleButtons.find(item => item.code == 'reallocate') &&
                    (!item.data.workflowId || item.data.exts.reallocate == '1')
                  "
                  plain
                  round
                  icon="user-o"
                  @click.native.stop="openSR(item, 'reallocate')"
                  :data-event="{ id: 'QPbUAKCugQ' }"
                >
                  {{ item.data.exts.reallocate == '1' ? '重新分派' : '分派' }}
                </van-button>
                <van-button
                  v-if="
                    item.state == 0 &&
                    item.nodeDef &&
                    item.nodeDef.nodeType == 'allot' &&
                    item.handlerIds &&
                    (item.handlerIds.indexOf(user._id) != -1 ||
                      item.handlerIds.indexOf(currentRole._id) != -1 ||
                      item.handlerIds.indexOf(user.orgId + '+' + currentRole._id) != -1)
                  "
                  round
                  icon="shop"
                  type="info"
                  custom-class="c-m-l-20"
                  @click.native.stop="openSR(item)"
                  :data-event="{ id: '-OX8RR9gEv' }"
                >
                  分单
                </van-button>
                <van-button
                  v-if="
                    item.state == 0 &&
                    item.nodeDef &&
                    item.nodeDef.nodeType == 'dispatch' &&
                    item.handlerIds &&
                    (item.handlerIds.indexOf(user._id) != -1 ||
                      item.handlerIds.indexOf(currentRole._id) != -1 ||
                      item.handlerIds.indexOf(user.orgId + '+' + currentRole._id) != -1)
                  "
                  round
                  icon="friends"
                  type="info"
                  custom-class="c-m-l-20"
                  @click.native.stop="openSR(item)"
                  :data-event="{ id: 'FNKcdra6xt' }"
                >
                  派单
                </van-button>
                <block
                  v-if="
                    item.state == 0 &&
                    item.nodeDef &&
                    item.nodeDef.nodeType == 'accept' &&
                    item.handlerIds &&
                    (item.handlerIds.indexOf(user._id) != -1 ||
                      item.handlerIds.indexOf(currentRole._id) != -1 ||
                      item.handlerIds.indexOf(user.orgId + '+' + currentRole._id) != -1)
                  "
                >
                  <van-button
                    plain
                    round
                    icon="revoke"
                    custom-class="c-m-l-20"
                    @click.native.stop="
                      openReject(item.data._id, item._id, item.nodeDef.rejectMode)
                    "
                    :data-event="{ id: 'Xl2jYKAWqW' }"
                  >
                    拒绝
                  </van-button>
                  <van-button
                    round
                    icon="checked"
                    type="info"
                    custom-class="c-m-l-20"
                    @click.native.stop="acceptClick(item.data._id, item._id)"
                    :data-event="{ id: 'QeW4I2zWXC' }"
                  >
                    接单
                  </van-button>
                </block>
                <!-- 在103管家接单后，403已完工之前可以扫码绑定监控 -->
                <!-- <van-button
                        v-if="
                          !item.data.exts.moKanNum &&
                          Number(item.data.status) > 103 &&
                          Number(item.data.status) < 403
                        "
                        custom-class="c-m-l-20"
                        round
                        icon="scan"
                        type="info"
                        @click.native.stop="scanCode(item)" :data-event="{id:'rTX6whaClr'}">
                        绑定监控
                      </van-button>
                      <van-button
                        v-if="
                          item.data.exts.moKanNum &&
                          Number(item.data.status) > 103 &&
                          Number(item.data.status) < 403
                        "
                        custom-class="c-m-l-20"
                        round
                        icon="video-o"
                        type="info"
                        @click.native.stop="toMoKanDetail(item)" :data-event="{id:'3SbjV06Y-q'}">
                        查看监控
                      </van-button> -->
              </view>
            </view>
          </view>
        </view>
      </view>
      <uni-load-more
        v-if="list.length > 0 && list[0].length > 5"
        :status="loadStatus"
      ></uni-load-more>
    </view>
    <van-empty
      v-if="functionList.length == 0 && !isLogined"
      description="请先登录后再查看工单列表"
      class="c-empty"
    >
      <van-button
        round
        type="info"
        @click="open('/subpackages/login/loginAuth')"
        :data-event="{ id: '4Sof4-nppN' }"
      >
        登 录
      </van-button>
    </van-empty>
    <!-- 分派资源弹出层 -->
    <van-popup :show="SR.show" position="bottom" custom-style="height: 100%">
      <view class="c-h-1 c-flex c-flex-col sr-popup">
        <view>
          <van-nav-bar
            :title="SR.workflowNode.nodeDef.name || '分派'"
            left-text="返回"
            right-text="确认"
            left-arrow
            @click-left="cancelSR"
            @click-right="saveSR"
          />
          <van-search
            :value="SR.searchValue"
            clearable
            placeholder="请输入服务资源名称"
            @change="SRSearch"
            @clear="SRSearch"
          />
        </view>
        <view class="c-flex-1 c-auto-y">
          <van-radio-group :value="SR.selectId" @change="SRChange">
            <van-cell-group>
              <scroll-view scroll-x="false" scroll-y="true">
                <block v-for="(item, i) of SR.fpi.data" :key="i">
                  <van-cell :title="item.name" clickable @click="SRClick(item)">
                    <van-radio slot="right-icon" :name="item._id" />
                  </van-cell>
                </block>
              </scroll-view>
            </van-cell-group>
          </van-radio-group>
        </view>
      </view>
    </van-popup>
    <!-- 拒绝接单弹出框 -->
    <van-dialog
      use-slot
      title="是否拒绝接单"
      :show="rejectObj.show"
      show-cancel-button
      @confirm="reject"
      @close="closeReject"
      :data-event="{ id: 'UY9Psml-6z', capture: false }"
    >
      <van-field
        :value="rejectObj.remark"
        type="textarea"
        autosize
        placeholder="请输入拒绝原因"
        @change="rejectChange"
      />
    </van-dialog>

    <!-- 日期时间 -->
    <van-popup :show="datetime.show" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        :type="datetime.type"
        :value="datetime.value"
        @confirm="filterTimeConfirm"
        @cancel="datetime.show = false"
      ></van-datetime-picker>
    </van-popup>

    <!-- 重复手机号工单提示 -->
    <van-dialog
      :show="acceptConfirm.show"
      confirmButtonText="确认接单"
      confirm-button-color="#d6000f"
      showCancelButton
      cancelButtonText="取消接单"
      use-slot
      use-title-slot
      @confirm="accept(acceptConfirm.sid, acceptConfirm.workflowNodeId)"
      @close="acceptConfirm = { show: false, sid: '', workflowNodeId: '' }"
      :data-event="{ id: '39IXNXOj8n', capture: false }"
    >
      <view slot="title" class="c-red">重复工单提醒</view>
      <view class="c-red" style="padding: 0 16px 16px">
        已存在相同手机号工单，请与本服务商内勤核实是否建单重复，谨慎处理！
      </view>
    </van-dialog>

    <!-- 重启工单弹出框 -->
    <van-dialog
      use-slot
      title="是否重启工单"
      :show="restoreObj.show"
      show-cancel-button
      @confirm="restore"
      @close="cancelRestore"
      :data-event="{ id: 'Xg2OwSBClV', capture: false }"
    >
      <van-field
        :value="restoreObj.remark"
        type="textarea"
        autosize
        placeholder="请输入重启工单原因"
        @change="restoreChange"
      />
    </van-dialog>
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
      loadStatus: 'more', // 上拉加载状态
      param: {}, // 页面加载进入参数
      user: {},
      currentRole: {},
      isLogined: true,
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
        },
        codecfg_serviceType: {
          codeId: 'serviceType'
        }
      },
      SR: {
        show: false,
        type: '',
        formData: {},
        reassign: '',
        fpi: { data: [] },
        workflowNode: {
          nodeDef: {}
        },
        selectRow: {},
        selectId: '',
        searchValue: '',
        ids: [], //选择服务区域筛选出的关联的服务资源id
        resourceType: '', //筛选服务资源类型
        nodeType: '', //当前节点类型
        loading: false, //表格数据加载
        saveLoading: false //表格选中行数据提交（分单/派单）
      },
      // 省市区
      areaList: Object.assign({}, areajs.default),

      // 工单状态分类
      active: 'all', //当前激活的tab页
      activeShow: true,
      functionList: [],
      functionCount: {},
      // 拒单
      rejectObj: {
        sid: '',
        workflowNodeId: '',
        show: false,
        remark: ''
      },
      // 重启工单
      restoreObj: {
        show: false,
        sid: '',
        remark: ''
      },
      // onLoad onShow
      loadType: '',
      fields: [], //扩展字段
      tagType: {}, //标签属性
      // 过滤器
      filter: {
        show: false,
        applyTimeStart: '', // 上门时间开始
        applyTimeEnd: '', // 上门时间结束
        sort: '', // 排序
        etags: [], // 已选中客户标签
        tagTypeData: [], // 客户标签组
        tagData: [], // 客户标签
        tagTarget: 'serviceAppointment', // 客户标签对象
        // 应用的过滤条件
        conditions: {
          applyTimeStart: '', // 上门时间开始
          applyTimeEnd: '', // 上门时间结束
          sort: '', // 排序
          etags: [] // 已选中客户标签
        }
      },
      // 时间选择器
      datetime: {
        show: false,
        type: '',
        value: new Date().getTime()
      },
      serviceType: '', //工单服务类型
      functionType: [], //功能注册上维护的类型类型
      showType: '', //触发onShow的类型：如扫码绑定监控
      clickSA: {}, // 点击的工单，从工单详情返回时更新此工单数据
      host: common.osg.host,
      //存在重复手机号工单提示
      acceptConfirm: {
        show: false,
        sid: '',
        workflowNodeId: ''
      },
      // 工单地图
      map: {
        show: false,
        zoom: 'shrink', // shrink:缩小 expand:放大
        longitude: '', // 地图中心点经度
        latitude: '', // 地图中心点纬度
        markers: [],
        first: '', // 工单列表滚动到第一位的工单_id
        enterTime: 0, // 监听页面滚动节流触发时间
        region: null // 地图视野范围经纬度
      },
      currentRoleButtons: [],
      isAutoY: true //时间过滤器是否允许滚动 overflow-y
    };
  },
  onLoad(param) {
    this.loadType = 'onLoad';
    this.currentRoleButtons = wx.getStorageSync('currentRoleButtons') || [];
    this.doInit(param);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    common.osg.init(this, {}, app);
    // 扫码绑定监控触发的onShow
    if (this.showType == 'scanCode' || this.showType == 'makeCall') {
      this.showType = '';
      return;
    }
    // 从工单详情页返回触发的onShow
    if (this.showType == 'detail') {
      common.osg.ajax(
        'basic/serviceAppointment/queryById/' + this.clickSA.id,
        { type: 'query' },
        res => {
          // 将工单详情数据结构处理成工单列表数据结构
          let obj = res.data.workflowNode[res.data.workflowNode.length - 1];
          obj.data = res.data.serviceAppointment;
          this.list[this.clickSA.index1][this.clickSA.index2] = obj;
          // 更新此工单最新信息
          this.showType = '';
          this.clickSA = {
            id: '',
            index1: 0,
            index2: 0
          };
        }
      );
      return;
    }
    // 查询菜单角标数量
    this.getFunctionCount();
    this.functionType = wx.getStorageSync('functionTypeValue');
    if (!common.osg.isLogined()) {
      this.isLogined = false;
      return;
    } else {
      this.isLogined = true;
    }
    if (this.$refs && this.$refs.filter) {
      this.$refs.filter.filterParams = {};
    }
    if (this.loadType == 'onLoad') {
      this.loadType = 'onShow';
      return;
    }
    this.doInit(this.param);
  },
  methods: {
    doInit(param) {
      common.osg.init(this, param, app);
      this.param = param || {};
      this.user = wx.getStorageSync('user') || {};
      this.currentRole = wx.getStorageSync('currentRole') || {};
      this.activeShow = false;
      this.getFunction();
    },
    onSearch(e) {
      this.searchValue = e.detail;
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.map.region = null; // 不过滤视野范围

      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
          this.getSA();
        } else {
          this.getData();
        }
      }
      this.getMarkers();
    },
    getFunctionCount() {
      common.osg.ajax(
        '/function/dataCount',
        { functions: JSON.stringify(this.functionList) },
        res => {
          this.functionCount = res.data;
          if (this.selectComponent('#vantTabs')) {
            this.selectComponent('#vantTabs').resize();
          }
        }
      );
    },
    getFunction() {
      let menu = wx.getStorageSync('menu');
      let functionList = [];

      if (!menu) {
        if (this.param.orderState || this.param.status || this.param.type) {
          let action = '../serviceAppointment/serviceAppointments?';
          if (this.param.orderState) action += 'orderState=' + this.param.orderState + '&';
          if (this.param.status) action += 'status=' + this.param.status + '&';
          if (this.param.type) action += 'type=' + this.param.type + '&';
          action = action.substring(0, action.length - 1);
          functionList = [
            {
              _id: '7644873357811008394',
              name: '待办工单',
              action,
              openType: 'navigateTo',
              functionList: [],
              buttonList: []
            }
          ];
        }
      } else {
        // 补tab页的工单状态值
        functionList = menu.functionList.filter(item => {
          return (
            item.action &&
            item.action.indexOf('serviceAppointment/serviceAppointments') != -1 &&
            !item.openType.startsWith('scan-')
          );
        });
      }
      functionList.map(item => {
        let url = item.action;
        if (url) {
          if (url.indexOf('?') != -1) {
            let paramsUrl = url.split('?')[1];
            let paramArr = paramsUrl.split('&');
            let params = {};
            paramArr.map(item => {
              params[item.split('=')[0]] = item.split('=')[1];
            });
            item.orderState = params.orderState;
            item.status = params.status || 'all';
            item.type = params.type || '';
            item.template = params.template;
          } else {
            item.status = 'all';
          }
        }
      });
      this.functionList = functionList;
      // 解决不点击首页菜单直接通过底部导航进入工单列表（当前底部导航没有入口）
      if (app.globalData.funcId) {
        this.active = app.globalData.funcId;
      } else {
        this.functionList[0] = this.functionList[0] || {};
        this.active = this.functionList[0]._id;
      }

      for (let func of this.functionList) {
        if (func._id == this.active) {
          this.func = func;
          break;
        }
      }
      this.getFields(() => {
        if (this.active == (this.functionList[0] && this.functionList[0]._id)) {
          if (this.func.type == 'SANode') {
            this.getSANode();
          } else {
            if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
              this.getSA();
            } else {
              this.getData();
            }
          }
        }
        this.activeShow = true;
        this.$forceUpdate();
      });
    },
    tabChange(e) {
      app.globalData.funcId = e.detail.name;

      for (let func of this.functionList) {
        if (func._id == e.detail.name) {
          this.func = func;
          this.active = e.detail.name;
          break;
        }
      }
      this.loadStatus = 'more';
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.map.region = null; // 不过滤视野范围

      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
          this.getSA();
        } else {
          this.getData();
        }
      }
      this.getFunctionCount(); // 从工单详情返回工单列表，仍保留当前工单卡片，不更新页签角标，所以切换页签时需要更新角标
      this.getMarkers();
    },
    filterOpen() {
      this.getTagTypeData();
      this.getTagData();
      // 每次打开过滤器将应用的过滤条件返显。
      this.filter.applyTimeStart = this.filter.conditions.applyTimeStart;
      this.filter.applyTimeEnd = this.filter.conditions.applyTimeEnd;
      this.filter.sort = this.filter.conditions.sort;
      this.filter.etags = common.osg.deepCopy(this.filter.conditions.etags);
      this.filter.show = true;
    },
    filterClose() {
      this.filter.show = false;
    },
    filterTimeClick(e) {
      this.datetime = {
        type: 'datetime',
        field: e.target.dataset.key,
        value: new Date(common.osg.readableTime(null, 'date') + ' 12:00:00').getTime(),
        show: true
      };
    },
    filterTimeConfirm(e) {
      this.filter[this.datetime.field] = common.osg.readableTime(e.detail);
      this.datetime.show = false;
    },
    getTagTypeData() {
      common.osg.ajax(
        'basic/tagType/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:target|string#and': this.filter.tagTarget,
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          sortField: 'type',
          sortOrder: 'asc'
        },
        res => {
          this.filter.tagTypeData = res.data || [];
        },
        { noload: true }
      );
    },
    getTagData() {
      common.osg.ajax(
        'basic/tag/query',
        { _all: '1', 'is:state|integer#and': 1, notFilterBelongTo: '1', notFilterOrgId: '1' },
        res => {
          this.filter.tagData = res.data || [];
        },
        { noload: true }
      );
    },
    tagClick(tagId) {
      let index = this.filter.etags.indexOf(tagId);
      if (index == -1) {
        this.filter.etags.push(tagId);
      } else {
        this.filter.etags.splice(index, 1);
      }
    },
    filterReset() {
      this.filter.applyTimeStart = '';
      this.filter.applyTimeEnd = '';
      this.filter.sort = '';
      this.filter.etags = [];
    },
    filterSave() {
      // 保存应用的过滤条件，每次打开过滤器将应用的过滤条件返显。
      this.filter.conditions = {
        applyTimeStart: this.filter.applyTimeStart,
        applyTimeEnd: this.filter.applyTimeEnd,
        sort: this.filter.sort,
        etags: common.osg.deepCopy(this.filter.etags)
      };
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.map.region = null; // 不过滤视野范围
      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
          this.getSA();
        } else {
          this.getData();
        }
      }
      this.filter.show = false;
      this.getMarkers();
    },
    getSA(type) {
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }

      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1,
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
        'in:status|array#and': this.func.status == 'all' ? null : this.func.status || '',
        // 地图视野范围内的工单
        'gte:gpsPoint.longitude|double#and':
          this.map.show && this.map.region ? this.map.region.southwest.longitude : null,
        'lte:gpsPoint.longitude|double#and':
          this.map.show && this.map.region ? this.map.region.northeast.longitude : null,
        'gte:gpsPoint.latitude|double#and':
          this.map.show && this.map.region ? this.map.region.southwest.latitude : null,
        'lte:gpsPoint.latitude|double#and':
          this.map.show && this.map.region ? this.map.region.northeast.latitude : null
      };
      // 过滤器-排序
      if (this.filter.conditions.sort == 'priority') {
        params['sortField'] = 'priority,createTime';
        params['sortOrder'] = 'desc';
      } else if (this.filter.conditions.sort == 'applyTime') {
        params['sortField'] = 'exts.applyTimeStr,createTime';
        params['sortOrder'] = 'asc';
      }
      // 过滤器-上门时间
      params['gte:exts.applyTimeStr|string#and'] = this.filter.conditions.applyTimeStart;
      params['lte:exts.applyTimeStr|string#and'] = this.filter.conditions.applyTimeEnd;
      // 过滤器-客户标签
      if (this.filter.conditions.etags.length > 0) {
        params['in:exts.tagIds|array#and'] = this.filter.conditions.etags;
      }
      common.osg.ajax(
        'basic/serviceAppointment/query.do',
        params,
        res => {
          let dataList = [];
          res.data.map(row => {
            let item = (row.workflowNodeList &&
              row.workflowNodeList.length > 0 &&
              common.osg.deepCopy(row.workflowNodeList[row.workflowNodeList.length - 1])) || {
              nodeDef: {}
            };
            item.data = row;
            dataList.push({
              _id: item._id,
              handlerIds: item.handlerIds,
              state: item.state,
              nodeDef: {
                nodeType: item.nodeDef.nodeType,
                rejectMode: item.nodeDef.rejectMode,
                name: item.nodeDef.name,
                resourceType: item.nodeDef.resourceType,
                resourceRoles: item.nodeDef.resourceRoles
              },
              data: {
                _id: item.data._id,
                orderNum: item.data.orderNum,
                status: item.data.status,
                name: item.data.name,
                address: item.data.address,
                channel: item.data.channel,
                describe: item.data.describe,
                serviceType: item.data.serviceType,
                phone: item.data.phone,
                contactIds: item.data.contactIds,
                workflowId: item.data.workflowId,
                area: item.data.area,
                gpsPoint: item.data.gpsPoint,
                community: item.data.community,
                exts: {
                  sourceType: item.data.exts.sourceType,
                  applyTimeStr: item.data.exts.applyTimeStr,
                  reallocate: item.data.exts.reallocate,
                  moKanNum: item.data.exts.moKanNum,
                  startDate: item.data.exts.startDate,
                  supervisorName: item.data.exts.supervisorName,
                  headmanName: item.data.exts.headmanName
                }
              }
            });
          });

          if (res.data.length == 0) {
            wx.stopPullDownRefresh();
            if (this.fpi.page > 1) {
              this.fpi.page--;
            }
            this.$forceUpdate();
            this.reachBottom = false;
            this.loadStatus = 'noMore';
            common.osg.toast(
              this.map.show && this.map.region
                ? this.fpi.page >= 1
                  ? '视野范围内没有更多工单'
                  : '视野范围内没有工单'
                : '没有更多数据了',
              'none',
              5000
            );
            return;
          }
          let index = this.fpi.page - 1;
          this.list.push(dataList);
          this.boundings.push({});

          this.$nextTick(() => {
            setTimeout(
              () => {
                //计算并记录外层列表数据的边界值
                this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
                uni
                  .createSelectorQuery()
                  .select(`#listitem-${this.func._id}-${index}`)
                  .boundingClientRect(rect => {
                    if (rect) {
                      // 解决列表最后一页数据未渲染出的问题
                      if (rect.height == 0) {
                        this.list.pop();
                        this.boundings.pop();
                        this.fpi.page--;
                        this.reachBottom = false;
                        this.loadStatus = 'more';
                        common.osg.toast('加载失败，请重新上拉加载', 'none');
                        return;
                      }
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
                this.loadStatus = 'more';
              },
              common.osg.appBaseInfo.uniPlatform == 'app' ? 800 : 200
            );
          });
        },
        { noload: true }
      );
    },
    getData(type) {
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }

      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'createTime',
        sortOrder: 'desc',
        orderState: this.func.orderState || 'todo', //'todo'、'done'
        'is:state|integer#and': 1,
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
        'in:status|array#and': this.func.status == 'all' ? null : this.func.status || '',
        // 地图视野范围内的工单
        'gte:gpsPoint.longitude|double#and':
          this.map.show && this.map.region ? this.map.region.southwest.longitude : null,
        'lte:gpsPoint.longitude|double#and':
          this.map.show && this.map.region ? this.map.region.northeast.longitude : null,
        'gte:gpsPoint.latitude|double#and':
          this.map.show && this.map.region ? this.map.region.southwest.latitude : null,
        'lte:gpsPoint.latitude|double#and':
          this.map.show && this.map.region ? this.map.region.northeast.latitude : null
      };
      // 过滤器-排序
      if (this.filter.conditions.sort == 'priority') {
        params['sortField'] = 'priority,createTime';
        params['sortOrder'] = 'desc';
      } else if (this.filter.conditions.sort == 'applyTime') {
        params['sortField'] = 'exts.applyTimeStr,createTime';
        params['sortOrder'] = 'asc';
      }
      // 过滤器-上门时间
      params['gte:exts.applyTimeStr|string#and'] = this.filter.conditions.applyTimeStart;
      params['lte:exts.applyTimeStr|string#and'] = this.filter.conditions.applyTimeEnd;
      // 过滤器-客户标签
      if (this.filter.conditions.etags.length > 0) {
        params['in:exts.tagIds|array#and'] = this.filter.conditions.etags;
      }
      common.osg.ajax(
        'basic/serviceAppointment/queryWorkflowNode.do',
        params,
        res => {
          let dataList = [];
          res.data.map(item => {
            dataList.push({
              _id: item._id,
              handlerIds: item.handlerIds,
              state: item.state,
              nodeDef: {
                nodeType: item.nodeDef.nodeType,
                rejectMode: item.nodeDef.rejectMode,
                name: item.nodeDef.name,
                resourceType: item.nodeDef.resourceType,
                resourceRoles: item.nodeDef.resourceRoles
              },
              data: {
                _id: item.data._id,
                orderNum: item.data.orderNum,
                status: item.data.status,
                name: item.data.name,
                address: item.data.address,
                channel: item.data.channel,
                describe: item.data.describe,
                serviceType: item.data.serviceType,
                phone: item.data.phone,
                contactIds: item.data.contactIds,
                workflowId: item.data.workflowId,
                area: item.data.area,
                gpsPoint: item.data.gpsPoint,
                community: item.data.community,
                exts: {
                  sourceType: item.data.exts.sourceType,
                  applyTimeStr: item.data.exts.applyTimeStr,
                  reallocate: item.data.exts.reallocate,
                  moKanNum: item.data.exts.moKanNum,
                  startDate: item.data.exts.startDate,
                  supervisorName: item.data.exts.supervisorName,
                  headmanName: item.data.exts.headmanName
                }
              }
            });
          });

          if (res.data.length == 0) {
            wx.stopPullDownRefresh();
            if (this.fpi.page > 1) {
              this.fpi.page--;
            }
            this.$forceUpdate();
            this.reachBottom = false;
            this.loadStatus = 'noMore';
            common.osg.toast(
              this.map.show && this.map.region
                ? this.fpi.page >= 1
                  ? '视野范围内没有更多工单'
                  : '视野范围内没有工单'
                : '没有更多数据了',
              'none',
              5000
            );
            return;
          }
          let index = this.fpi.page - 1;
          this.list.push(dataList);
          this.boundings.push({});

          this.$nextTick(() => {
            setTimeout(
              () => {
                //计算并记录外层列表数据的边界值
                this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
                uni
                  .createSelectorQuery()
                  .select(`#listitem-${this.func._id}-${index}`)
                  .boundingClientRect(rect => {
                    if (rect) {
                      // 解决列表最后一页数据未渲染出的问题
                      if (rect.height == 0) {
                        this.list.pop();
                        this.boundings.pop();
                        this.fpi.page--;
                        this.reachBottom = false;
                        this.loadStatus = 'more';
                        common.osg.toast('加载失败，请重新上拉加载', 'none');
                        return;
                      }
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
                this.loadStatus = 'more';
              },
              common.osg.appBaseInfo.uniPlatform == 'app' ? 800 : 200
            );
          });
        },
        { noload: true }
      );
    },
    getSANode(process) {
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }

      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'updateTime',
        sortOrder: 'desc',
        orderState: this.func.orderState || '',
        'is:state|integer#and': 1,
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
        'in:status|array#and': this.func.status == 'all' ? null : this.func.status || '',
        'is:exts.workflowDefId|string#and': this.functionType,
        // 地图视野范围内的工单
        'gte:gpsPoint.longitude|double#and':
          this.map.show && this.map.region ? this.map.region.southwest.longitude : null,
        'lte:gpsPoint.longitude|double#and':
          this.map.show && this.map.region ? this.map.region.northeast.longitude : null,
        'gte:gpsPoint.latitude|double#and':
          this.map.show && this.map.region ? this.map.region.southwest.latitude : null,
        'lte:gpsPoint.latitude|double#and':
          this.map.show && this.map.region ? this.map.region.northeast.latitude : null
      };
      // 过滤器-排序
      if (this.filter.conditions.sort == 'priority') {
        params['sortField'] = 'priority,createTime';
        params['sortOrder'] = 'desc';
      } else if (this.filter.conditions.sort == 'applyTime') {
        params['sortField'] = 'exts.applyTimeStr,createTime';
        params['sortOrder'] = 'asc';
      }
      // 过滤器-上门时间
      params['gte:exts.applyTimeStr|string#and'] = this.filter.conditions.applyTimeStart;
      params['lte:exts.applyTimeStr|string#and'] = this.filter.conditions.applyTimeEnd;
      // 过滤器-客户标签
      if (this.filter.conditions.etags.length > 0) {
        params['in:exts.tagIds|array#and'] = this.filter.conditions.etags;
      }
      common.osg.ajax(
        'basic/serviceAppointment/querySAWorkflowNode.do',
        params,
        res => {
          let dataList = [];
          res.data.map(item => {
            dataList.push({
              _id: item._id,
              handlerIds: item.handlerIds,
              state: item.state,
              nodeDef: {
                nodeType: item.nodeDef.nodeType,
                rejectMode: item.nodeDef.rejectMode,
                name: item.nodeDef.name,
                resourceType: item.nodeDef.resourceType,
                resourceRoles: item.nodeDef.resourceRoles
              },
              data: {
                _id: item.data._id,
                orderNum: item.data.orderNum,
                status: item.data.status,
                name: item.data.name,
                address: item.data.address,
                channel: item.data.channel,
                describe: item.data.describe,
                serviceType: item.data.serviceType,
                phone: item.data.phone,
                contactIds: item.data.contactIds,
                workflowId: item.data.workflowId,
                area: item.data.area,
                gpsPoint: item.data.gpsPoint,
                community: item.data.community,
                exts: {
                  sourceType: item.data.exts.sourceType,
                  applyTimeStr: item.data.exts.applyTimeStr,
                  reallocate: item.data.exts.reallocate,
                  moKanNum: item.data.exts.moKanNum,
                  startDate: item.data.exts.startDate,
                  supervisorName: item.data.exts.supervisorName,
                  headmanName: item.data.exts.headmanName
                }
              }
            });
          });
          if (res.data.length == 0) {
            wx.stopPullDownRefresh();
            if (this.fpi.page > 1) {
              this.fpi.page--;
            }
            this.$forceUpdate();
            this.reachBottom = false;
            this.loadStatus = 'noMore';
            common.osg.toast(
              this.map.show && this.map.region
                ? this.fpi.page >= 1
                  ? '视野范围内没有更多工单'
                  : '视野范围内没有工单'
                : '没有更多数据了',
              'none',
              5000
            );
            return;
          }
          let index = this.fpi.page - 1;
          if (process) {
            this.list[index] = dataList;
            this.boundings[index] = {};
          } else {
            this.list.push(dataList);
            this.boundings.push({});
          }
          this.$forceUpdate();

          this.$nextTick(() => {
            setTimeout(
              () => {
                //计算并记录外层列表数据的边界值
                this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
                uni
                  .createSelectorQuery()
                  .select(`#listitem-${this.func._id}-${index}`)
                  .boundingClientRect(rect => {
                    if (rect) {
                      // 解决列表最后一页数据未渲染出的问题
                      if (rect.height == 0) {
                        this.list.pop();
                        this.boundings.pop();
                        this.fpi.page--;
                        this.reachBottom = false;
                        this.loadStatus = 'more';
                        common.osg.toast('加载失败，请重新上拉加载', 'none');
                        return;
                      }
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
                this.loadStatus = 'more';
              },
              common.osg.appBaseInfo.uniPlatform == 'app' ? 800 : 200
            );
          });
        },
        { noload: true }
      );
    },
    //获取工单扩展
    getFields(callback) {
      common.osg.ajax(
        'biz/extField/query',
        {
          colName: 'serviceAppointment',
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          for (let field of res.data) {
            //解析frontEndConfig字段配置
            if (field.frontEndConfig && common.osg.isJson(field.frontEndConfig)) {
              field.frontEndConfig = JSON.parse(field.frontEndConfig);
            } else {
              field.frontEndConfig = {};
            }
            field.showList = field.showList || [];
            //列表展示字段 关联字典表codeType放到options,之后从字典表查询
            // field.showList.indexOf('3') != -1
            if (field.valueOption) {
              if (field.type == 'cascade') {
                this.options['cascadeCode_' + field.valueOption] = {
                  codeId: field.valueOption
                };
              } else {
                this.options['codecfg_' + field.valueOption] = {
                  codeId: field.valueOption
                };
              }
            }
            if (field.frontEndConfig.tagType) this.tagType = field.frontEndConfig.tagType;
            // 过滤器选中项
            field.value = [];
          }
          common.osg.codeoption(() => {
            this.fields = res.data;
            if (callback) callback();
          });
        },
        {
          noload: true
        }
      );
    },
    toDetail(id, index1, index2) {
      this.showType = 'detail';
      this.clickSA = {
        id,
        index1,
        index2
      };
      this.doOpen('./serviceAppointment', { id });
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    toMoKanDetail(item) {
      common.osg.open('../web/web', {
        url: `${this.host}/fsgo/wm/h5/mokan/detail/${item.data.exts.moKanNum}?address=${
          this.areaList.province_list[item.data.area[0]] +
          this.areaList.city_list[item.data.area[1]] +
          this.areaList.county_list[item.data.area[2]] +
          item.data.address
        }&startDate=${item.data.exts.startDate || ''}&supervisorName=${
          item.data.exts.supervisorName || ''
        }&headmanName=${item.data.exts.headmanName || ''}&client=b`
      });
    },
    /**
     * 打开分派单弹窗
     * row当前卡片节点
     * type:reassign 表示重新分单
     * resourceRole:1管家 2工队 区分重新派管家还是工队
     */
    openSR(row, type, resourceRole) {
      this.serviceType = row.data.serviceType;
      if (common.osg.isRepeatClick('openSR')) {
        return; //判断是否重复点击
      }
      if (type == 'reallocate') {
        this.SR.type = 'reallocate';
        this.SR.formData = row.data;
        this.getSRs();
        this.SR.show = true;
      } else if (type == 'reassign') {
        this.SR.reassign = resourceRole;
        // 重新派单
        this.getSAById(row.data._id, res => {
          let node;
          // 查找派单节点
          if (
            res.workflowNode[res.workflowNode.length - 1] &&
            res.workflowNode[res.workflowNode.length - 1].state != 10
          ) {
            // 判断流程未结束
            if (resourceRole == '1') {
              // 刷新 重新分派技术工程师 nodeId== '21732156850739'
              // 重新派管家
              node = res.workflowNode.filter(
                item => item.nodeId == '31596542169173' || item.nodeId == '21732156850739'
              )[0];
            } else if (resourceRole == '2') {
              // 重新派工队
              node = res.workflowNode.filter(
                item => item.nodeId == '81596873713369' || item.nodeId == '71732158922619'
              )[0];
            }
          }

          if (node) {
            node.data = row.data; // 派单节点补工单数据
            this.SR.workflowNode = node;
            this.getSRs();
            this.SR.show = true;
          } else {
            common.osg.toast('当前状态不允许重新派单', 'none');
          }
        });
      } else {
        // 首次派单
        this.SR.reassign = ''; // 非重新派单
        this.SR.workflowNode = row;
        this.getSRs();
        this.SR.show = true;
      }
    },
    /**
     * 服务资源
     */
    SRSearch(e) {
      this.SR.searchValue = e.detail;
      this.SR.selectId = '';
      this.SR.selectRow = {};
      this.getSRs();
    },
    getSRs() {
      let params = {
        _all: '1',
        sortField: 'createTime',
        sortOrder: 'desc',
        'regex:name|string#and': this.SR.searchValue,
        'is:state|integer#and': 1,
        'in:serviceType|array#and': this.serviceType //工单服务类型
      };
      if (this.SR.type != 'reallocate') {
        params['in:resourceType|array#and'] =
          this.SR.workflowNode.nodeDef.resourceType &&
          this.SR.workflowNode.nodeDef.resourceType.join();
        params['in:resourceRoles|array#and'] =
          this.SR.workflowNode.nodeDef.resourceRoles &&
          this.SR.workflowNode.nodeDef.resourceRoles.join();
      }
      common.osg.ajax('biz/serviceResource/query', params, res => {
        this.SR.fpi = res;
      });
    },
    SRClick(row) {
      this.SR.selectId = row._id;
      this.SR.selectRow = row;
    },
    SRChange(e) {
      this.SR.selectId = e.detail;
    },
    saveSR() {
      if (!this.SR.selectId) {
        common.osg.toast('请选择服务资源', 'none');
        return;
      }
      if (this.SR.type == 'reallocate') {
        common.osg.confirm(
          `是否确认选择 ${this.SR.selectRow.name} ？`,
          () => {
            if (common.osg.isRepeatClick('saveSR')) {
              common.osg.toast('操作过于频繁', 'none');
              return;
            }
            // 先撤回工单到派单节点
            common.osg.ajax(
              'basic/serviceAppointment/allot.do',
              {
                id: this.SR.formData._id,
                currentOrgId: this.SR.selectRow._id,
                reallocate: this.SR.formData.exts.reallocate
              },
              () => {
                common.osg.toast(
                  this.SR.formData.exts.reallocate == '1' ? '重新分配成功' : '分派成功',
                  'none'
                );
                if (this.func.type && this.func.type == 'SANode') {
                  this.getSANode('process');
                } else {
                  if (this.func.orderState == 'all') {
                    this.getSA('process');
                  } else {
                    this.getData('process');
                  }
                }
                this.cancelSR();
              },
              { noload: true }
            );
          },
          {
            title: this.SR.formData.exts.reallocate == '1' ? '分派工单' : '重新分派工单'
          }
        );
      } else if (this.SR.reassign) {
        common.osg.confirm(
          `是否确认选择 ${this.SR.selectRow.name} ？`,
          () => {
            if (common.osg.isRepeatClick('saveSR')) {
              common.osg.toast('操作过于频繁', 'none');
              return;
            }
            // 先撤回工单到派单节点
            common.osg.ajax(
              'workflow/takebackWorkflow.do',
              {
                workflowNodeId: this.SR.workflowNode._id,
                smodule: 'serviceAppointment',
                sid: this.SR.workflowNode.data._id
              },
              () => {
                // 再调用处理工作流派单
                this.process();
              },
              { noload: true }
            );
          },
          {
            title: '重新' + this.SR.workflowNode.nodeDef.name
          }
        );
      } else {
        // 非重新派单
        common.osg.confirm(
          `是否确认选择 ${this.SR.selectRow.name} ？`,
          () => {
            if (common.osg.isRepeatClick('saveSR')) {
              common.osg.toast('操作过于频繁', 'none');
              return;
            }
            this.process();
          },
          {
            title: this.SR.workflowNode.nodeDef.name
          }
        );
      }
    },
    process() {
      let params = {
        sid: this.SR.workflowNode.data._id,
        smodule: 'serviceAppointment',
        workflowNodeId: this.SR.workflowNode._id
      };
      if (
        this.SR.selectRow.resourceType == 'partner' ||
        this.SR.selectRow.resourceType == 'serviceCrew'
      ) {
        params.currentOrgId = this.SR.selectRow.serviceCrewId;
      } else {
        params.handlerId = this.SR.selectRow.relatedRecordId;
      }
      common.osg.ajax('workflow/process', params, res => {
        this.map.region = null; // 不过滤视野范围
        if (this.func.type && this.func.type == 'SANode') {
          this.getSANode('process');
        } else {
          if (this.func.orderState == 'all') {
            this.getSA('process');
          } else {
            this.getData('process');
          }
        }
        this.getFunctionCount();
        this.cancelSR();
        this.getMarkers();
      });
    },
    cancelSR() {
      this.SR = {
        show: false,
        fpi: {},
        workflowNode: {
          nodeDef: {}
        },
        selectRow: {},
        selectId: '',
        searchValue: '',
        ids: [], //选择服务区域筛选出的关联的服务资源id
        resourceType: '', //筛选服务资源类型
        nodeType: '', //当前节点类型
        loading: false, //表格数据加载
        saveLoading: false //表格选中行数据提交（分单/派单）
      };
    },
    /**
     * 接单/处理工作流节点
     */
    acceptClick(sid, workflowNodeId) {
      if (common.osg.isRepeatClick('accept')) {
        return; //判断是否重复点击
      }
      common.osg.ajax('basic/serviceAppointment/selfExamination', { saId: sid }, res => {
        if (res.data.length > 0) {
          this.acceptConfirm = {
            show: true,
            sid,
            workflowNodeId
          };
        } else {
          this.accept(sid, workflowNodeId);
        }
      });
    },
    accept(sid, workflowNodeId) {
      common.osg.ajax(
        'workflow/process',
        {
          sid,
          workflowNodeId,
          smodule: 'serviceAppointment'
        },
        res => {
          this.map.region = null; // 不过滤视野范围
          if (this.func.type && this.func.type == 'SANode') {
            this.getSANode('process');
          } else {
            if (this.func.orderState == 'all') {
              this.getSA('process');
            } else {
              this.getData('process');
            }
          }
          this.getFunctionCount();
          this.getMarkers();
        }
      );
    },
    /**
     * 点击拒绝
     */
    openReject(sid, workflowNodeId, rejectMode) {
      if (common.osg.isRepeatClick('reject')) {
        return; //判断是否重复点击
      }
      this.rejectObj = {
        sid,
        workflowNodeId,
        rejectMode,
        remark: '',
        show: true
      };
    },
    /**
     * 取消拒绝
     */
    closeReject() {
      this.rejectObj.show = false;
    },
    /**
     * 填写拒绝原因
     */
    rejectChange(e) {
      this.rejectObj.remark = e.detail;
    },
    /**
     * 确认拒绝/工作流回退
     */
    reject() {
      if (!this.rejectObj.remark || this.rejectObj.remark.trim().length == 0) {
        common.osg.toast('请填写拒绝原因', 'none');
        return;
      }
      let url = '';
      let params = {};
      // 拒单逻辑
      if (this.rejectObj.rejectMode == 1) {
        // 后台判断
        url = 'basic/serviceAppointment/handleRefused';
        params = {
          sid: this.rejectObj.sid,
          remark: this.rejectObj.remark
        };
      } else {
        // 退回节点
        url = 'workflow/rollbackWorkflow';
        params = {
          sid: this.rejectObj.sid,
          workflowNodeId: this.rejectObj.workflowNodeId,
          remark: this.rejectObj.remark,
          smodule: 'serviceAppointment'
        };
      }
      common.osg.ajax(url, params, res => {
        this.map.region = null; // 不过滤视野范围
        if (this.func.type && this.func.type == 'SANode') {
          this.getSANode();
        } else {
          if (this.func.orderState == 'all') {
            this.getSA();
          } else {
            this.getData();
          }
        }
        this.getMarkers();
      });
    },
    /**
     * 点击拒绝
     */
    openRestore(sid) {
      this.restoreObj = {
        show: true,
        sid,
        remark: ''
      };
    },
    /**
     * 取消拒绝
     */
    cancelRestore() {
      this.restoreObj.show = false;
    },
    /**
     * 填写拒绝原因
     */
    restoreChange(e) {
      this.restoreObj.remark = e.detail;
    },
    /**
     * 确认重启工单
     */
    restore(sid) {
      if (common.osg.isRepeatClick('restore')) {
        return; //判断是否重复点击
      }
      if (!this.restoreObj.remark || this.restoreObj.remark.trim().length == 0) {
        common.osg.toast('请填写重启工单原因', 'none');
        return;
      }
      common.osg.ajax(
        '/basic/serviceAppointment/handleRestore',
        { sid: this.restoreObj.sid, reason: this.restoreObj.remark },
        res => {
          common.osg.toast('已重启工单', 'none');
          this.map.region = null; // 不过滤视野范围
          if (this.func.type && this.func.type == 'SANode') {
            this.getSANode();
          } else {
            if (this.func.orderState == 'all') {
              this.getSA();
            } else {
              this.getData();
            }
          }
          this.getMarkers();
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
     * 拨打电话
     */
    call(type, callerId, calleeId, sid) {
      common.osg.ajax(
        'basic/winnerlook/getMiddleNumberBySid',
        {
          // type,
          // callerId: callerId || wx.getStorageSync('user')._id,
          // calleeId: calleeId,
          sid
        },
        res => {
          this.makeCall(res.data.phoneNumberX);
        }
      );
    },
    makeCall(phoneNumber) {
      this.showType = 'makeCall';
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    /**
     * 扫码绑定监控
     * 已绑定其他工单时，传binding会绑定到当前工单
     */
    scanCode(item) {
      this.showType = 'scanCode';
      common.osg.scanCode(code => {
        common.osg.ajax(
          'moKan/bind',
          { serviceAppointmentId: item.data._id, moKanNum: code.result },
          res => {
            if (!res.success) {
              common.osg.confirm(
                '当前设备已被其他工单绑定，是否解绑并绑定到本工单？',
                () => {
                  this.bindingConfirm(item, code, 'binding');
                },
                {
                  title: '绑定冲突',
                  confirmText: '确认替换',
                  showCancel: true,
                  cancelText: '放弃绑定'
                }
              );
            } else {
              common.osg.alert(`监控设备${code.result} 绑定成功！`);
              if (this.func.type && this.func.type == 'SANode') {
                this.getSANode('process');
              } else {
                if (this.func.orderState == 'all') {
                  this.getSA('process');
                } else {
                  this.getData('process');
                }
              }
            }
          }
        );
      });
    },
    bindingConfirm(item, code, binding) {
      common.osg.ajax(
        'moKan/bind',
        { serviceAppointmentId: item.data._id, moKanNum: code.result, binding },
        res => {
          common.osg.alert(`监控设备${code.result} 绑定成功！`);
          if (this.func.type && this.func.type == 'SANode') {
            this.getSANode('process');
          } else {
            if (this.func.orderState == 'all') {
              this.getSA('process');
            } else {
              this.getData('process');
            }
          }
        }
      );
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
        this.loadStatus = 'loading';
        this.reachBottom = true;
        this.fpi.page++;

        if (this.func.type && this.func.type == 'SANode') {
          this.getSANode();
        } else {
          if (this.func.orderState == 'all') {
            this.getSA();
          } else {
            this.getData();
          }
        }
      }
    },
    //滚动监听
    onPageScroll(e) {
      if (this.reachBottom) return;
      let now = new Date().getTime();
      if (now - this.map.enterTime > 200) {
        this.map.enterTime = now;
        // 窗口高度
        this.windowHeight = this.windowHeight
          ? this.windowHeight
          : wx.getSystemInfoSync().windowHeight;

        // 循环每页高度
        for (let i = 0; i < this.boundings.length; i++) {
          // 如果没有在屏幕中，并且视野的高度小于我的结尾位置距离顶部的距离，也就是说，这个dom是我正在查看的dom
          if (
            e &&
            this.boundings[i].top < e.scrollTop + this.windowHeight &&
            e.scrollTop + this.windowHeight <= this.boundings[i].bottom
          ) {
            this.index = i;
            break;
          }
        }

        // 获取地图下方第一个工单
        if (this.map.show && this.map.zoom == 'shrink') {
          let data = this.list[this.index < 0 ? 0 : this.index];
          if (this.index > 0) {
            data = this.list[this.index - 1].concat(data);
          }

          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            uni
              .createSelectorQuery()
              .select(`#sa-${item.data._id}`)
              .boundingClientRect(rect => {
                if (rect) {
                  if (rect.top >= 178 && rect.top <= 400) {
                    if (this.map.first != item.data._id) {
                      this.map.first = item.data._id;
                      // 查找工单对应角标改为蓝色
                      if (
                        item.data.gpsPoint &&
                        item.data.gpsPoint.longitude &&
                        item.data.gpsPoint.latitude
                      ) {
                        let markers = common.osg.deepCopy(this.map.markers);
                        markers.map(marker => {
                          if (marker.id == item.data._id) {
                            marker.iconPath = '../../static/images/location-blue.png';
                            marker.callout.display = 'ALWAYS';
                            marker.zIndex = 10;
                            marker.joinCluster = false; // 不参与点聚合
                            let map = uni.createMapContext('SAMap', this);
                            map.moveToLocation({
                              longitude: item.data.gpsPoint.longitude,
                              latitude: item.data.gpsPoint.latitude
                            });
                          } else {
                            marker.iconPath = '../../static/images/location-red.png';
                            marker.callout.display = 'BYCLICK';
                            marker.zIndex = 1;
                            marker.joinCluster = true; // 参与点聚合
                          }
                        });
                        this.map.markers = markers;
                      }
                    }
                  }
                }
              })
              .exec();
          }
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
    // 复制到剪切板
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    getSAById(sid, callback) {
      common.osg.ajax('basic/serviceAppointment/queryById/' + sid, { type: 'query' }, res => {
        if (callback) callback(res.data);
      });
    },
    /**
     * 工单地图
     */
    mapClick() {
      if (this.map.show) {
        this.map.show = false;
      } else {
        // 以当前定位设置地图中心经纬度
        common.osg.getLocation(res => {
          this.map = {
            show: true,
            zoom: 'shrink', // shrink:缩小 expand:放大
            longitude: res.longitude, // 地图中心点经度
            latitude: res.latitude, // 地图中心点纬度
            markers: [], // 标记点
            first: '', // 工单列表滚动到第一位的工单_id
            enterTime: 0, // 监听页面滚动节流触发时间
            region: null // 地图视野范围经纬度
          };
          this.getMarkers();
        });
      }
    },
    // 获取当前工单列表的全部工单经纬度标记点
    getMarkers() {
      if (!this.map.show) {
        return;
      }
      // 收集标记点
      this.map.markers = [];
      // 请求参数
      let params = {
        _all: '1',
        orderState: this.func.orderState || '',
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
        'in:status|array#and': this.func.status == 'all' ? null : this.func.status || '',
        'is:exts.workflowDefId|string#and': this.functionType,
        'gte:exts.applyTimeStr|string#and': this.filter.applyTimeStart || null,
        'lte:exts.applyTimeStr|string#and': this.filter.applyTimeEnd || null,
        // 地图视野范围内的工单
        'gte:gpsPoint.longitude|double#and': this.map.region
          ? this.map.region.southwest.longitude
          : null,
        'lte:gpsPoint.longitude|double#and': this.map.region
          ? this.map.region.northeast.longitude
          : null,
        'gte:gpsPoint.latitude|double#and': this.map.region
          ? this.map.region.southwest.latitude
          : null,
        'lte:gpsPoint.latitude|double#and': this.map.region
          ? this.map.region.northeast.latitude
          : null
      };
      let url;
      if (this.func.type && this.func.type == 'SANode') {
        url = 'basic/serviceAppointment/querySAWorkflowNode.do';
      } else {
        if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
          params['is:state|integer#and'] = 1;
          url = 'basic/serviceAppointment/query.do';
        } else {
          url = 'basic/serviceAppointment/queryWorkflowNode.do';
        }
      }
      common.osg.ajax(
        url,
        params,
        res => {
          // 获取经纬度标记
          let data = [];
          let markers = [];
          let gpsPoint = {};
          res.data.map((item, index) => {
            if (
              !(this.func.type && this.func.type == 'SANode') &&
              (this.func.orderState == 'all' || this.func.orderState == 'concern')
            ) {
              item.data = item;
            }
            // 地图只展示有经纬度的坐标点
            if (item.data.gpsPoint && item.data.gpsPoint.longitude && item.data.gpsPoint.latitude) {
              // 手动触发视野变更，工单列表只展示视野范围内的工单
              data.push(item);

              let longitude = item.data.gpsPoint.longitude;
              let latitude = item.data.gpsPoint.latitude;
              let marker = {
                longitude,
                latitude,
                width: '30',
                height: '30',
                id: Number(item.data._id),
                code: item.data.orderNum,
                zIndex: 1,
                joinCluster: true,
                iconPath: '../../static/images/location-red.png',
                callout: {
                  content: item.data.community || item.data.address || ''
                }
              };
              // 当第一个工单有经纬度时，默认高亮标记点。
              if (index == 0) {
                this.map.first = item.data._id;
                marker.iconPath = '../../static/images/location-blue.png';
                marker.callout.display = 'ALWAYS';
                marker.zIndex = 10;
                marker.joinCluster = false; // 不参与点聚合
              }
              // 经纬度完全相同，旋转标记点
              // if (!gpsPoint[longitude + '-' + latitude]) {
              //   gpsPoint[longitude + '-' + latitude] = 1;
              // } else {
              //   // 旋转方案：当存在重复经纬度时，每增加一个旋转45度，最多展示8个，超过8个的在默认点重叠。
              //   // marker.rotate =
              //   //   gpsPoint[longitude + '-' + latitude] * 45 >= 360
              //   //     ? 0
              //   //     : gpsPoint[longitude + '-' + latitude] * 45;
              //   // 偏移方案：当存在重复经纬度时，每增加一个经度向右偏移0.0002，每10个换行纬度减少0.0002。会导致视野范围过滤时原点超出屏幕则所有偏移点也消失。
              //   marker.longitude += (gpsPoint[longitude + '-' + latitude] % 10) * 0.0002;
              //   marker.latitude -= Math.floor(gpsPoint[longitude + '-' + latitude] / 10) * 0.0002;
              //   gpsPoint[longitude + '-' + latitude] += 1;
              // }
              markers.push(marker);
            }
          });
          this.map.markers = markers;
          if (this.map.region) {
            // 手动触发视野变更时，不自动缩放视野以包含所有给定的坐标点
            this.map.includePoints = [];
          } else {
            // 非手动触发视野变更时，自动缩放视野以包含所有给定的坐标点
            this.map.includePoints = common.osg.deepCopy(markers);
          }
          // common.osg.toast(`当前视野范围内有${data.length}个工单`, 'none');
        },
        {
          noload: true
        }
      );
    },
    /**
     * 视野发生变化时触发
     * e = {causedBy, type, detail: {rotate, skew, scale, centerLocation, region}}
     * begin 阶段返回 causedBy，有效值为 gesture（手势触发） & update（接口触发）
     * end 阶段返回 causedBy，有效值为 drag（拖动导致）、scale（缩放导致）、update（调用更新接口导致）
     * 此页面中 滚动工单列表（地图自动平移显示当前查看的第一个工单）、搜索、过滤、切换标签页、处理工作流（派单、接单、拒绝、重启工单）时会触发causedBy:update，此时不需要过滤视野范围内的工单。
     */
    regionchange(e) {
      // 主动拖拽、缩放地图时查询视野范围内的工单
      if (e.type == 'end' && (e.causedBy == 'drag' || e.causedBy == 'scale')) {
        this.fpi.page = 1;
        this.fpi.rows = 10;
        this.map.region = e.detail.region; // 赋值视野范围

        if (this.func.type && this.func.type == 'SANode') {
          this.getSANode();
        } else {
          if (this.func.orderState == 'all' || this.func.orderState == 'concern') {
            this.getSA();
          } else {
            this.getData();
          }
        }

        this.getMarkers({ region: e.detail.region });
      }
    },
    // 点击标记点
    markerClick(e) {
      // 通过工单id查找工单编号
      for (let i = 0; i < this.map.markers.length; i++) {
        if (this.map.markers[i].id == e.detail.markerId) {
          this.copy(this.map.markers[i].code, '已复制工单编号');
          return;
        }
      }
    },
    // 点击备注内容
    describeClick(str) {
      common.osg.toast(str, 'none', 4000);
    },
    // 当打开地图且仅有拨号按钮时，按钮定位在卡片右侧节省空间。
    sideCallButtonShow(item) {
      if (
        this.map.show &&
        Number(item.data.status) > 103 &&
        !(
          (item.data.status == '201' || item.data.status == '999') &&
          ((item.handlerIds &&
            (item.handlerIds.indexOf(this.user._id) != -1 ||
              item.handlerIds.indexOf(this.currentRole._id) != -1 ||
              item.handlerIds.indexOf(this.user.orgId + '+' + this.currentRole._id) != -1)) ||
            this.currentRole._id == '7100212906800336051')
        ) &&
        !(
          this.currentRole._id == '7100212906800336051' &&
          Number(item.data.status) > 102 &&
          Number(item.data.status) < 203 &&
          item.data.status != '201'
        ) &&
        !(
          this.currentRole._id == '7100212906800336051' &&
          Number(item.data.status) > 300 &&
          Number(item.data.status) < 401
        ) &&
        !(
          item.state == 0 &&
          item.nodeDef &&
          item.nodeDef.nodeType == 'allot' &&
          item.handlerIds &&
          (item.handlerIds.indexOf(this.user._id) != -1 ||
            item.handlerIds.indexOf(this.currentRole._id) != -1 ||
            item.handlerIds.indexOf(this.user.orgId + '+' + this.currentRole._id) != -1)
        ) &&
        !(
          item.state == 0 &&
          item.nodeDef &&
          item.nodeDef.nodeType == 'dispatch' &&
          item.handlerIds &&
          (item.handlerIds.indexOf(this.user._id) != -1 ||
            item.handlerIds.indexOf(this.currentRole._id) != -1 ||
            item.handlerIds.indexOf(this.user.orgId + '+' + this.currentRole._id) != -1)
        ) &&
        !(
          item.state == 0 &&
          item.nodeDef &&
          item.nodeDef.nodeType == 'accept' &&
          item.handlerIds &&
          (item.handlerIds.indexOf(this.user._id) != -1 ||
            item.handlerIds.indexOf(this.currentRole._id) != -1 ||
            item.handlerIds.indexOf(this.user.orgId + '+' + this.currentRole._id) != -1)
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    datetimeConfirm(e, field) {
      this.filter[field] = common.osg.readableTime(e);
    }
  }
};
</script>
<style lang="scss">
.serviceAppointments {
  .header {
    position: fixed;
    top: 0;
    z-index: 1;
    .c-search {
      padding: 10px 10px 0 !important;
      .van-search__content {
        background: #fff;
        // border: 1rpx solid rgba(195, 195, 205, 0.5);
        border: 1rpx solid #969799;
      }
    }
    .c-tabs {
      .van-tabs__scroll {
        background: #f7f8fa;
      }
    }
    .map-view {
      position: relative;
      display: flex;
      flex-direction: column;
      .map {
        width: 100vw;
        border-radius: 0 8px 8px 0;
      }
      .map-zoom {
        position: absolute;
        bottom: 55px;
        left: 5px;
      }
      .map-bottom {
        text-align: center;
        background: #f7f8fa;
        font-weight: 600;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
        z-index: 1;
      }
    }
  }

  // 服务资源
  .sr-popup .van-cell__title,
  .van-cell__value {
    -webkit-flex: auto;
    flex: auto;
    max-width: none !important;
  }
  .sr-title {
    width: calc(100% - 70px);
  }

  .uni-date__x-input {
    background-color: #f2f3f4;
  }
}
</style>
