<template>
  <view class="serviceAppointments" @click.capture="track">
    <view class="header">
      <!-- #ifdef APP-PLUS -->
      <!-- 手机状态栏 -->
      <view
        :style="'width:100vw;height:' + systemInfo.statusBarHeight + 'px;background-color:#fff'"
      ></view>
      <!-- #endif -->
      <!-- 搜索栏 -->
      <view class="c-w-1 c-bg-white c-flex c-item-center">
        <van-search
          :value="searchValue"
          @clear="onSearch"
          @blur="onSearch"
          placeholder="搜索编号/姓名/地址/备注/手机号"
          clear-trigger="always"
          custom-class="c-search"
          class="c-flex-1"
        ></van-search>
        <van-icon
          name="filter-o"
          size="24"
          :color="
            filter.conditions.applyTimeStart ||
            filter.conditions.applyTimeEnd ||
            filter.conditions.etags.length > 0
              ? '#ff6900'
              : '#646566'
          "
          :style="
            filter.conditions.applyTimeStart ||
            filter.conditions.applyTimeEnd ||
            filter.conditions.etags.length > 0
              ? 'color:#ff6900'
              : 'color:#646566'
          "
          style="margin-right: 16px"
          @click="filterOpen"
          :data-event="{ id: '_frff_O9dN' }"
        />
      </view>
      <!-- 工单状态栏 -->
      <van-tabs
        @change="tabChange"
        :active="active"
        v-if="tabShow"
        :ellipsis="false"
        line-width="40px"
        line-height="3px"
        :data-event="{ id: '_Dt0zd9vyv', capture: false }"
        id="tabs"
      >
        <block v-for="(func, i) in functionList" :key="i">
          <van-tab
            :title="
              func.name
                ? func.name + (functionCount[func._id] ? '(' + functionCount[func._id] + ')' : '')
                : '待办工单'
            "
            :name="func._id"
          ></van-tab>
        </block>
      </van-tabs>
      <view v-else-if="isLogined" style="height: 44px; background-color: #fff"></view>
      <view v-else style="height: 10px; background-color: #fff"></view>
    </view>
    <!-- 工单列表 -->
    <scroll-view
      id="content"
      scroll-y
      @scrolltolower="scrollToLower"
      @refresherrefresh="refresherRefresh"
      @scroll="scroll"
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      refresher-background="#f7f8fa"
    >
      <view
        :id="'listitem-' + active + '-' + j"
        v-for="(listitem, j) in boundings"
        :key="j"
        :style="{
          height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
          margin:
            list[j] &&
            list[j].length > 0 &&
            list[j][list[j].length - 1].data &&
            list[j][list[j].length - 1].data.leadIds &&
            list[j][list[j].length - 1].data.leadIds.length > 0
              ? '10px 0px 44px 0px'
              : '10px 0px'
        }"
      >
        <block v-if="index - 1 <= j && j <= index + 1 && list[j]">
          <view
            :class="{
              card: true,
              'mb-44': isAfterApril21(item.data.createTime)
            }"
            v-for="(item, k) in list[j]"
            :key="k"
            @tap="toDetail(item.data._id, j, k, item.data)"
            :data-id="item.data._id"
            :id="'sa-' + item.data._id"
          >
            <view class="card-view c-flex c-flex-between">
              <view class="c-flex">
                <view class="card-icon-view c-bg-jishi">
                  <image
                    :src="
                      'https://pub.fsgo365.cn/icon-' +
                      (item.data.serviceType == '40' ? 'shuazi.png' : 'fangshui.png')
                    "
                  />
                </view>
                <text
                  @click.stop="copy(item.data.orderNum, '已复制完整工单编号 ' + item.data.orderNum)"
                  :data-event="{ id: '9cXxYY5Zz8' }"
                  class="c-m-l-20"
                >
                  {{ '#' + item.data.orderNum.slice(5) }}
                </text>
                <text
                  class="c-m-l-20"
                  v-if="item.data.exts.leakagesite_copy && item.data.exts.leakagesite_copy[0]"
                >
                  {{ formatLeakagesite([item.data.exts.leakagesite_copy[0]]) }}
                </text>
              </view>
              <text :class="item.state != 10 && 'c-blue'" class="c-flex-nowrap">
                {{ codelabel('select', 'status', item.data.status) || '' }}
              </text>
            </view>
            <view
              v-if="item.data.district || item.data.address"
              class="card-view c-flex c-flex-between"
            >
              <view class="c-flex-1 c-size-18 c-weight-600 c-ellipsis2">
                {{
                  (item.data.district ? formatDistrict(Number(item.data.district)) : '') +
                  ' ' +
                  (item.data.address || '')
                }}
              </view>
              <view
                v-if="
                  item.data.gpsPoint && item.data.gpsPoint.longitude && item.data.gpsPoint.latitude
                "
                class="c-m-l-20 c-flex c-item-center"
                style="height: 22px; line-height: 22px"
                @click.stop="openLocation(item.data.gpsPoint, item.data.area, item.data.address)"
                :data-event="{ id: '9c142Y5468' }"
              >
                <text
                  v-if="item.data.exts.distance || item.data.exts.distance == 0"
                  class="c-size-12 c-gray c-m-r-10"
                  :data-event="{ id: '9c142Y5468' }"
                >
                  {{ item.data.exts.distance }}
                  <text class="c-m-l-5">km</text>
                </text>
                <image
                  src="https://pub.fsgo365.cn/jishi/icon-car.png"
                  style="width: 20px; height: 20px"
                  :data-event="{ id: '9c142Y5468' }"
                ></image>
              </view>
            </view>
            <view
              v-if="(item.data.exts.applyTimeStr || item.data.applyTime) && item.data.status < 203"
              class="card-view"
              style="line-height: 20px"
            >
              预约上门 {{ formatApplyTime(item.data.exts.applyTimeStr || item.data.applyTime) }}
            </view>
            <view
              style="display: flex; flex-wrap: wrap; margin: -5px"
              v-if="
                (item.data && item.data.gpsPoint) ||
                (item.data.exts && item.data.exts.communityOrdersTotal > 0)
              "
            >
              <block
                v-if="
                  item.data.exts.communityOrdersTotal && item.data.exts.communityOrdersTotal > 0
                "
              >
                <van-tag
                  size="large"
                  color="#e0f1fe"
                  text-color="#ff6900"
                  @click.native.stop="navigateToMap(item.data, '1')"
                  class="c-m-10"
                >
                  同小区 {{ item.data.exts.communityOrdersTotal }}
                </van-tag>
                <van-tag
                  size="large"
                  color="#e0f1fe"
                  text-color="#ff6900"
                  @click.native.stop="navigateToMap(item.data, '2')"
                  class="c-m-10"
                >
                  同部位 {{ item.data.exts.communityLeakagesite || 0 }}
                </van-tag>
              </block>
              <block v-if="item.data && item.data.gpsPoint">
                <van-tag
                  size="large"
                  color="#fff0e5"
                  text-color="#ff6900"
                  @click.native.stop="navigateMap(item.data)"
                  class="c-m-10"
                >
                  工单附近客户
                </van-tag>
              </block>
              <van-tag
                v-if="item.data.channel && item.data.channel.indexOf('2005010') != -1"
                size="large"
                color="#e0f1fe"
                text-color="#ff6900"
                class="c-m-10"
                @click.native.stop
              >
                万师傅
              </van-tag>
              <van-tag
                v-if="item.data.exts.scheduleFlag && item.data.exts.scheduleFlag != '1'"
                size="large"
                color="#FFEACD"
                text-color="#646566"
                class="c-m-10"
                @click.native.stop
              >
                {{ codelabel('select', 'scheduleFlag', item.data.exts.scheduleFlag) }}
              </van-tag>
            </view>
            <view
              v-if="item.data.exts.tagIds && item.data.exts.tagIds.length > 0"
              style="display: flex; flex-wrap: wrap; margin: -5px"
            >
              <van-tag
                size="large"
                color="#e0f1fe"
                text-color="#ff6900"
                class="c-m-10"
                @click.native.stop="showTag(item)"
              >
                <van-icon name="label-o" color="#ff6900" style="margin-right: 8px" />
                {{ item.data.exts.tagShow ? '隐藏标签' : '查看标签' }}
              </van-tag>
              <block v-if="item.data.exts.tagShow">
                <van-tag
                  v-for="(tagId, tagIndex) in item.data.exts.tagIds"
                  :key="tagIndex"
                  size="large"
                  color="#f5f5f5"
                  text-color="#323233"
                  class="c-m-10"
                >
                  {{ codelabel('select', 'tags', tagId) }}
                </van-tag>
              </block>
            </view>
            <view class="card-view" v-if="item.data.describe">
              <view class="card-memo" @click.stop="describeClick(item.data.describe)">
                <van-icon name="comment-o" color="#646566" style="margin-right: 8px" />
                <view class="card-memo-text c-ellipsis2">备注：{{ item.data.describe }}</view>
              </view>
            </view>
            <view class="card-view c-flex c-flex-wrap" style="margin: -5px">
              <view class="c-flex c-item-center c-m-10">
                <view class="card-icon-view card-icon-border c-m-r-20">
                  <image
                    v-if="!item.data.exts.gender"
                    src="https://pub.fsgo365.cn/icon-character-unknown.png"
                    style="width: 22px; height: 24px"
                  ></image>
                  <image
                    v-else
                    :src="
                      item.data.exts.gender == '1'
                        ? 'https://pub.fsgo365.cn/icon-character-man.png'
                        : 'https://pub.fsgo365.cn/icon-character-woman.png'
                    "
                  ></image>
                </view>
                <text class="c-size-14">
                  {{
                    item.data.name &&
                    item.data.name.length > 4 &&
                    item.data.exts.supervisorName &&
                    item.data.exts.headmanName
                      ? item.data.name.substring(0, 4) + '...'
                      : item.data.name
                  }}
                </text>
              </view>
              <view v-if="item.data.exts.supervisorName" class="c-flex c-item-center c-m-10">
                <view class="card-icon-view card-icon-border c-m-r-20">
                  <image src="https://pub.fsgo365.cn/icon-character-supervisor.png"></image>
                </view>
                <text class="c-size-14">{{ item.data.exts.supervisorName }}</text>
              </view>
              <view v-if="item.data.exts.headmanName" class="c-flex c-item-center c-m-10">
                <view class="card-icon-view card-icon-border c-m-r-20">
                  <image src="https://pub.fsgo365.cn/icon-character-headman.png"></image>
                </view>
                <text class="c-size-14">{{ item.data.exts.headmanName }}</text>
              </view>
            </view>
            <view v-if="buttonGroupShow(item)" class="card-view card-buttons">
              <!-- 联系客户 -->
              <block v-if="Number(item.data.status) > 103">
                <van-button
                  v-if="item.data && item.data.phone"
                  plain
                  icon="phone"
                  block
                  class="c-flex-1"
                  @click.native.stop="makeCall(item.data.phone)"
                  :data-event="{ id: 'B43eOJcj6q' }"
                >
                  联系客户
                </van-button>
                <van-button
                  v-else
                  plain
                  icon="phone"
                  block
                  class="c-flex-1"
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
                  :data-event="{ id: 'k5NVc60iAz' }"
                >
                  联系客户
                </van-button>
              </block>
              <!--              <van-button-->
              <!--                v-if="currentRole._id == '6631748470755706348' && item.data.exts.pwGroupBind != '1'"-->
              <!--                plain-->
              <!--                icon="wechat"-->
              <!--                block-->
              <!--                class="c-flex-1"-->
              <!--                @click.native.stop="bindPWGroupNameClick(item.data)"-->
              <!--                :data-event="{ id: 'B43eOJc111' }"-->
              <!--              >-->
              <!--                绑定微信群-->
              <!--              </van-button>-->
              <!-- 重启工单（内勤：预约节点选不需要上门，工单状态改为201不需要上门，后续节点关闭，此时允许管家和内勤重启工单。） -->
              <van-button
                v-if="
                  (item.data.status == '201' || item.data.status == '999') &&
                  ((item.handlerIds &&
                    (item.handlerIds.indexOf(user._id) != -1 ||
                      item.handlerIds.indexOf(currentRole._id) != -1 ||
                      item.handlerIds.indexOf(user.orgId + '+' + currentRole._id) != -1)) ||
                    currentRole._id == '6631748470755706348')
                "
                plain
                icon="replay"
                block
                class="c-flex-1"
                @click.native.stop="openRestore(item.data._id)"
                :data-event="{ id: 'FYD4wqaIHZ' }"
              >
                重启工单
              </van-button>
              <!-- 内勤：重新派管家（102:待分派管家 201:不需要上门 204:上门未成交 300:待分派工队）  -->
              <!-- reassign 撤回节点 重新处理节点 -->
              <van-button
                v-if="
                  item.data.exts[currentRole._id + 'ReassignPermission'] == '1' &&
                  Number(item.data.status) > 102 &&
                  Number(item.data.status) < 203 &&
                  item.data.status != '201'
                "
                plain
                icon="user"
                block
                class="c-flex-1"
                @click.native.stop="openSR(item, 'reassign', '1')"
                :data-event="{ id: 'XAW6BuBB20' }"
              >
                重新派管家
              </van-button>
              <!-- 重新派工队（内勤：300:待分派工队 301:待工队接单 302:待进场交底 401:待验收 402:待完工 403:已完工） -->
              <!-- <van-button
                v-if="
                  currentRoleButtons.find(item => item.code == 'reassign') &&
                  Number(item.data.status) > 300 &&
                  Number(item.data.status) < 401
                "
                plain
                icon="user"
                block
                class="c-flex-1"
                @click.native.stop="openSR(item, 'reassign', '2')"
                :data-event="{ id: '1WHdRYyihx' }"
              >
                重新派工队
              </van-button> -->
              <!-- 运营中心内勤 分派工队 -->
              <van-button
                v-if="
                  currentRoleButtons.find(item => item.code == 'allocate') &&
                  item.data.status == 300
                "
                plain
                icon="user"
                block
                class="c-flex-1"
                @click.native.stop="openSR(item)"
                :data-event="{ id: 'XAW6BuB123' }"
              >
                分派工队
              </van-button>
              <!-- 运营人员、城市运营管理员、运营中心内勤、客服角色：分单 派单 重新分派 -->
              <van-button
                v-if="
                  currentRoleButtons.find(item => item.code == 'reallocate') &&
                  (!item.data.workflowId || item.data.exts.reallocate == '1')
                "
                plain
                icon="user"
                block
                class="c-flex-1"
                @click.native.stop="openSR(item, 'reallocate')"
                :data-event="{ id: '-xuFoVuxBa' }"
              >
                {{
                  item.data.status == '102'
                    ? '分派管家'
                    : item.data.status == '300'
                    ? '分派工队'
                    : item.data.exts.reallocate == '1'
                    ? '重新分派'
                    : '分派'
                }}
              </van-button>
              <!-- 节点处理人 首次分单 -->
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
                icon="shop"
                type="info"
                block
                class="c-flex-1"
                @click.native.stop="openSR(item)"
                :data-event="{ id: 'wUc1W9ty9G' }"
              >
                分单
              </van-button>
              <!-- 节点处理人 首次派单：包含分派管家和分派工队 -->
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
                icon="user"
                type="info"
                block
                class="c-flex-1"
                @click.native.stop="openSR(item)"
                :data-event="{ id: 'SYwV8Hk6ji' }"
              >
                派单
              </van-button>
              <!-- 接单 拒绝 -->
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
                  icon="cross"
                  block
                  class="c-flex-1"
                  @click.native.stop="openReject(item.data._id, item._id, item.nodeDef.rejectMode)"
                  :data-event="{ id: 'vhAG22kzz3' }"
                >
                  拒绝
                </van-button>
                <van-button
                  icon="success"
                  type="info"
                  block
                  class="c-flex-1"
                  @click.native.stop="acceptClick(item.data._id, item._id, item.data)"
                  :data-event="{ id: 'REM-KkIrYZ' }"
                >
                  接单
                </van-button>
              </block>
              <van-button
                v-if="
                  currentRole._id == '3481370558631265818' &&
                  (item.data.status == '104' ||
                    item.data.status == '105' ||
                    item.data.status == '200')
                "
                icon="notes"
                type="info"
                block
                class="c-flex-1"
                @click.native.stop="openSchedule(item.data._id)"
                :data-event="{ id: 'REM-KkI142' }"
              >
                查看日程
              </van-button>
            </view>
            <!-- 客户画像 -->
            <view
              v-if="isAfterApril21(item.data.createTime)"
              class="customer_profile"
              @click.stop="openCustomerProfile(item.data._id)"
            >
              <image
                style="width: 20px; height: 20px; border-radius: 2px"
                src="https://pub.fsgo365.cn/icon-ai.jpg"
              ></image>
              <view style="z-index: 100" class="c-m-l-20 c-gray-6">
                客户的详细画像已生成，快去看看吧！
              </view>
              <van-icon name="arrow" color="#969799" />
            </view>
          </view>
        </block>
      </view>
      <uni-load-more
        v-if="boundings.length > 0 && list.length > 0 && list[0] && list[0].length > 3"
        :status="loadStatus"
      ></uni-load-more>
      <!-- <view v-else style="height: 8px"></view> -->
    </scroll-view>

    <!-- 过滤条件、排序 -->
    <van-popup
      :show="filter.show"
      position="top"
      round
      custom-style="height:80%;display:flex;flex-direction:column;"
      @close="filterClose"
    >
      <view :class="['c-flex-1', { 'c-auto-y': isAutoY }]">
        <!-- #ifdef APP-PLUS -->
        <!-- 手机状态栏 -->
        <view
          :style="'width:100vw;height:' + systemInfo.statusBarHeight + 'px;background-color:#fff'"
        ></view>
        <!-- #endif -->
        <view class="c-p-30">
          <view class="c-bold">排序</view>
          <view class="tags">
            <van-tag
              class="tag"
              :color="filter.sort == '' ? '#fff0e5' : '#f2f3f4'"
              :text-color="filter.sort == '' ? '#ff6900' : '#3b4045'"
              size="large"
              @click.native="filter.sort = ''"
            >
              按更新时间倒序
            </van-tag>
            <van-tag
              class="tag"
              :color="filter.sort == 'applyTime' ? '#fff0e5' : '#f2f3f4'"
              :text-color="filter.sort == 'applyTime' ? '#ff6900' : '#3b4045'"
              size="large"
              @click.native="filter.sort = 'applyTime'"
            >
              按上门时间正序
            </van-tag>
            <van-tag
              class="tag"
              :color="filter.sort == 'priority' ? '#fff0e5' : '#f2f3f4'"
              :text-color="filter.sort == 'priority' ? '#ff6900' : '#3b4045'"
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
                      :color="filter.etags.indexOf(tag._id) != -1 ? '#fff0e5' : '#f2f3f4'"
                      :text-color="filter.etags.indexOf(tag._id) != -1 ? '#ff6900' : '#3b4045'"
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
                    :color="filter.etags.indexOf(tag._id) != -1 ? '#fff0e5' : '#f2f3f4'"
                    :text-color="filter.etags.indexOf(tag._id) != -1 ? '#ff6900' : '#3b4045'"
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

    <van-empty
      v-if="functionList.length == 0 && !isLogined"
      description="请先登录后再查看工单列表"
      class="c-empty"
    >
      <van-button
        round
        type="info"
        @click="doOpen('/subpackages/login/loginAuth')"
        :data-event="{ id: '4Sof4-nppN' }"
      >
        登 录
      </van-button>
    </van-empty>
    <!-- 分派资源弹出层 -->
    <van-popup
      :show="SR.show"
      position="bottom"
      round
      :close-on-click-overlay="false"
      custom-style="height: 90%"
    >
      <view class="c-h c-flex c-flex-col sr-popup">
        <view>
          <van-nav-bar
            :title="SR.workflowNode.nodeDef.name || '分派'"
            left-text="返回"
            right-text="确认"
            left-arrow
            @click-left="cancelSR"
            @click-right="saveSR"
          />
          <van-tabs
            v-if="SR.type == 'reallocate'"
            type="card"
            @change="dispatchTypeChange"
            :active="SR.dispatchType"
            custom-class="c-m-t-20"
          >
            <van-tab title="按组织架构派单" name="org"></van-tab>
            <van-tab title="按服务资源池派单" name="serviceResourceGroup"></van-tab>
          </van-tabs>
          <van-search
            v-if="SR.dispatchType == 'org'"
            :value="SR.searchValue"
            key="srSearchValue"
            clearable
            placeholder="请输入服务资源名称"
            @change="SRSearch"
            @clear="SRSearch"
            custom-class="c-sr-search"
          />
          <view v-if="SR.dispatchType == 'serviceResourceGroup'" class="c-sr-select">
            <uni-data-select
              v-model="SR.scheduleFlag"
              :localdata="options.scheduleFlag"
              @change="serviceResourceGroupChange"
              placeholder="选择服务资源池后，展示服务资源"
            ></uni-data-select>
          </view>
        </view>
        <view class="c-flex-1 c-auto-y">
          <van-radio-group :value="SR.selectId" @change="SRChange">
            <van-cell-group>
              <scroll-view scroll-x="false" scroll-y="true">
                <block v-if="SR.dispatchType == 'org'">
                  <block v-for="(item, i) of SR.fpi.data" :key="i">
                    <van-cell :title="item.name" clickable @click="SRClick(item)">
                      <van-radio slot="right-icon" :name="item._id" />
                    </van-cell>
                  </block>
                </block>
                <block v-if="SR.dispatchType == 'serviceResourceGroup'">
                  <block v-for="(item, i) of SR.fpi2.data" :key="i">
                    <van-cell :title="item.name" clickable @click="SRClick(item)">
                      <van-radio slot="right-icon" :name="item._id" />
                    </van-cell>
                  </block>
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
      @confirm="accept(acceptConfirm.sid, acceptConfirm.workflowNodeId, acceptConfirm.data)"
      @close="acceptConfirm = { show: false, sid: '', workflowNodeId: '', data: {} }"
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
    <van-dialog
      :show="wechatGroup.show"
      use-slot
      title="工单绑定微信群"
      show-cancel-button
      confirm-button-color="#ff6900"
      @close="wechatGroup.show = false"
      @confirm="bindPWGroupName"
    >
      <view style="margin: 6px 16px 16px">
        <uni-easyinput
          v-model="wechatGroup.pwGroupName"
          placeholder="请输入此工单创建的微信群的群名称"
          class="groupName-input"
        ></uni-easyinput>
      </view>
    </van-dialog>

    <van-dialog id="van-dialog" />
    <Tabbar></Tabbar>
    <!-- #ifdef APP-PLUS -->
    <permission ref="permission" />
    <!-- #endif -->
    <!-- 附近工单接单提醒 -->
    <van-overlay :show="distanceReminder.show" :lock-scroll="false" :z-index="101">
      <view class="out-of-time-notify-modal">
        <view class="overdue-notification-box">
          <van-icon
            @click="distanceReminder = { show: false, data: { exts: {} } }"
            name="close"
            size="24px"
            style="
              position: absolute;
              z-index: 102;
              color: #969799;
              right: 10px;
              top: 10px;
              font-size: 24px;
              font-weight: 600;
            "
            :data-event="{ id: 'i_DA32G13R' }"
          />
          <view class="reminder-view">
            <van-icon
              name="completed"
              size="44px"
              style="font-size: 44px; color: #fff"
              color="#ffffff"
            />
          </view>
        </view>
        <view style="border-radius: 16px; overflow: hidden">
          <view>
            <view style="font-size: 22px; font-weight: 600; text-align: center; margin: 10px 16px">
              接单成功
            </view>
            <view style="color: #646566; text-align: center; margin: 10px 16px">
              距离客户
              <text class="c-blue c-weight-600">{{ distanceReminder.data.exts.distance }}公里</text>
              ，建议您尽快联系客户确认上门时间，以便及时提供服务。
            </view>
            <view class="address-info">
              <view class="c-flex c-item-center">
                <!-- <van-icon name="location-o" size="20px" color="#ff6900" class="c-m-r-20" /> -->
                <view>
                  <view class="c-gray-6">客户地址：</view>
                  <view class="c-ellipsis2">
                    {{
                      distanceReminder.data.district
                        ? formatDistrict(Number(distanceReminder.data.district))
                        : ''
                    }}{{ distanceReminder.data.address }}
                  </view>
                </view>
              </view>

              <view
                style="
                  border-top: 1px solid #ebedf0;
                  border-bottom: 1px dashed #ebedf0;
                  margin: 10px 0;
                  padding: 10px 0;
                "
              >
                <view class="c-flex">
                  <view class="c-flex c-item-center c-flex-1">
                    <!-- <image
                      src="https://pub.fsgo365.cn/jishi/icon-car.png"
                      style="width: 20px; height: 20px; margin-right: 10px"
                      :data-event="{ id: '9c142Y1468' }"
                    ></image> -->
                    <view>
                      <view class="c-gray-6">驾车距离</view>
                      <view>{{ distanceReminder.data.exts.distance }}公里</view>
                    </view>
                  </view>
                  <view class="c-flex c-flex-center c-flex-1">
                    <!-- <van-icon name="underway-o" size="20px" color="#ff6900" class="c-m-r-20" /> -->
                    <view>
                      <view class="c-gray-6">预计车程</view>
                      <view>
                        {{ formatDistanceDuration(distanceReminder.data.exts.distanceDuration) }}
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view
                class="c-flex c-flex-center c-blue"
                style="line-height: 30px"
                @click="
                  openLocation(
                    distanceReminder.data.gpsPoint,
                    distanceReminder.data.area,
                    distanceReminder.data.address
                  )
                "
                :data-event="{ id: '9c1Yg52468' }"
              >
                <van-icon
                  name="guide-o"
                  color="#ff6900"
                  size="20px"
                  class="c-m-r-20"
                  style="line-height: 30px"
                  :data-event="{ id: '9c1Yg52468' }"
                />
                <text style="margin-right: 30px" :data-event="{ id: '9c1Yg52468' }">
                  点击查看路线并导航
                </text>
              </view>
            </view>
            <view
              style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
                gap: 16px;
                margin: 16px;
              "
            >
              <van-button
                v-if="distanceReminder.data.phone"
                type="info"
                icon="phone"
                block
                class="c-flex-1"
                @click="makeCall(distanceReminder.data.phone)"
                :data-event="{ id: 'B432O4cj6q' }"
              >
                联系客户
              </van-button>
              <van-button
                v-else
                type="info"
                icon="phone"
                block
                class="c-flex-1"
                @click="
                  call(
                    '1',
                    null,
                    distanceReminder.data.contactIds && distanceReminder.data.contactIds[0]
                      ? distanceReminder.data.contactIds[0]
                      : '',
                    distanceReminder.data._id
                  )
                "
                :data-event="{ id: 'B432O4cj6q' }"
              >
                联系客户
              </van-button>

              <van-button
                plain
                icon="notes"
                block
                class="c-flex-1"
                @click="openSchedule(distanceReminder.data._id)"
                :data-event="{ id: 'B4153J1j6q' }"
              >
                查看日程
              </van-button>
            </view>
          </view>
        </view>
      </view>
    </van-overlay>
  </view>
</template>

<script>
const app = getApp();
import { mapMutations } from 'vuex';
import Permission from '../../components/Permission/Permission.vue';
import watchPositionMixin from '../../resources/mixins/watchPositionMixin.js';
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  components: {
    Permission
  },
  mixins: [watchPositionMixin],
  data() {
    return {
      user: {},
      currentRole: {},
      isLogined: true,
      systemInfo: {},
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
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        },
        codecfg_status: {
          codeId: 'STATUS'
        },
        codecfg_scheduleFlag: { codeId: 'scheduleFlag' },
        tags: []
      },
      SR: {
        show: false,
        dispatchType: 'org',
        scheduleFlag: '',
        type: '',
        formData: {},
        reassign: '',
        fpi: { data: [] },
        fpi2: { data: [] },
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
      active: '', //当前激活的tab页
      tabShow: false,
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
      showType: '', //触发onShow的类型：如扫码绑定监控
      clickSA: {}, // 点击的工单，从工单详情返回时更新此工单数据
      host: common.osg.host,
      //存在重复手机号工单提示
      acceptConfirm: {
        show: false,
        sid: '',
        workflowNodeId: '',
        data: {}
      },
      // 附近工单提醒
      distanceReminder: { show: false, data: { exts: {} } },
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
      isAutoY: true, //时间过滤器是否允许滚动 overflow-y
      refresherTriggered: false, // 已触发下拉加载
      loadStatus: 'more', // 上拉加载状态
      wechatGroup: {
        show: false,
        sid: '',
        pwGroupName: ''
      },
      functionId: ''
    };
  },
  onLoad(param) {
    this.functionId = param.functionId || ''; // App通知直接跳转到待接单列表
    common.osg.init(this, {}, app);
    this.systemInfo = app.globalData.systemInfo;
    this.user = wx.getStorageSync('user') || {};
    common.osg.codeoption(() => {
      this.options.scheduleFlag.map(item => {
        item.text = item.name;
      });
    });
    this.getTags();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    common.osg.init(this, {}, app);
    //更新tabbar 列表
    this.updatTabbarList();

    if (this.showType == 'keep') {
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
          obj.data.exts.tagShow = this.clickSA.tagShow;
          obj.data.exts.distance = this.clickSA.distance;
          obj.data.exts.distanceDuration = this.clickSA.distanceDuration;
          obj.data.exts.communityOrdersTotal = this.clickSA.communityOrdersTotal;
          obj.data.exts.communityLeakagesite = this.clickSA.communityLeakagesite;
          this.$set(this.list[this.clickSA.index1], this.clickSA.index2, obj);
          // 更新此工单最新信息
          this.showType = '';
          this.clickSA = {
            id: '',
            index1: 0,
            index2: 0
          };
        },
        {
          noload: true
        }
      );
      this.getTags();
      return;
    }

    // 验证登录状态
    if (!common.osg.isLogined()) {
      this.isLogined = false;
      return;
    } else {
      this.isLogined = true;
      // #ifdef APP-PLUS
      // 检查授权管理
      this.$nextTick(() => {
        this.$refs.permission && this.$refs.permission.initPermissions();
        // App上架审核角色“管家App”角色，不弹窗
        if (
          this.currentRole._id != '7508867733715728438' &&
          this.currentRole._id != '2502061015987080147'
        ) {
          // 获取当前定位，用于查询当前定位到工单地址的距离
          common.osg.getLocation(
            res => {
              app.globalData.location = res.latitude + ',' + res.longitude;
            },
            null,
            {
              doNotRemind: true
            }
          );
          // 开启定位监听，用于自动打卡
          this.startWatchPosition();
        }
      });
      // #endif
    }

    // 清空过滤条件
    if (this.$refs && this.$refs.filter) {
      this.$refs.filter.filterParams = {};
    }

    // 保存当前角色、当前角色按钮
    this.currentRole = wx.getStorageSync('currentRole') || {};
    this.currentRoleButtons = wx.getStorageSync('currentRoleButtons') || [];
    this.getFunctions();
    this.getFunctionsCount(() => {
      this.activateFunction();
    });
  },
  methods: {
    ...mapMutations(['updatTabbarList']),
    // 获取当前角色工单列表菜单
    getFunctions() {
      this.tabShow = false;
      let saMenu = wx.getStorageSync('saMenu');
      if (!saMenu || saMenu.length == 0) {
        common.osg.toast('当前角色没有查询权限', 'none');
        return;
      }
      this.functionList = saMenu;
    },
    // 获取不同页签的工单数
    getFunctionsCount(callback) {
      common.osg.ajax(
        '/function/dataCount',
        { functions: JSON.stringify(this.functionList) },
        res => {
          this.functionCount = res.data;
          this.$nextTick(() => {
            if (this.selectComponent('#tabs')) {
              this.selectComponent('#tabs').resize();
            }
          });
          if (callback) callback();
        },
        {
          noload: true
        }
      );
    },
    // 激活菜单;
    activateFunction() {
      // 从App通知跳转到指定工单列表
      if (this.functionId) {
        app.globalData.funcId = this.functionId;
        this.functionId = '';
      }
      // 已有激活菜单，判断当前激活的菜单是否在工单列表展示
      if (app.globalData.funcId)
        var func = this.functionList.find(item => app.globalData.funcId == item._id);
      if (app.globalData.funcId && func) {
        /**
         * 找到了已激活菜单，默认激活该菜单
         * 场景：1.非首次点击底部导航栏进入工单列表。2.从其他页面跳转到工单列表。
         */
        this.func = func;
      } else {
        /**
         * 没有找到已激活菜单，默认激活第1个菜单
         * 场景：1.直接点击底部导航栏首次进入工单列表。2.登录或切换角色后会清空app.globalData.funcId。
         */
        this.func = this.functionList[0];
        app.globalData.funcId = this.func._id;
      }
      this.active = this.func._id;
      this.tabShow = true;
      // 由于标签栏组件默认激活第1个页签，所以进入页面时如果当前激活的是第1个标签，标签栏组件就不会触发tabChange，所以需要主动请求工单列表数据。
      if (this.func._id == this.functionList[0]._id) {
        this.boundings = [];
        this.index = 0;
        this.fpi.page = 1;
        this.fpi.rows = 10;
        this.getData();
      }
    },
    tabChange(e) {
      app.globalData.funcId = e.detail.name;
      for (let func of this.functionList) {
        if (func._id == e.detail.name) {
          this.func = func;
          this.active = this.func._id;
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

      this.getData();
      this.getFunctionsCount(); // 从工单详情返回工单列表，仍保留当前工单卡片，不更新页签角标，所以切换页签时需要更新角标
      // this.getMarkers();
    },
    onSearch(e) {
      this.searchValue = e && e.detail && e.detail.value ? e.detail.value.trim() : '';
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.map.region = null; // 不过滤视野范围
      this.getData();
      // this.getMarkers();
      // 搜索埋点
      if (e.detail && e.detail.value)
        common.osg.report('search', {
          id: 'saOnSearch',
          keywords: e.detail
        });
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
      this.getData();
      this.filter.show = false;
      // this.getMarkers();
    },
    getData() {
      let queryType = this.func.type;
      let that = this;

      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: queryType == 'SANode' ? 'updateTime' : 'createTime', // 按数据权限查询工单时按创建时间倒序，按工作流节点查询工单时按更新时间倒序
        sortOrder: 'desc',
        orderState: queryType == 'SANode' ? this.func.orderState : null,
        'is:state|integer#and': 1,
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
        'in:status|array#and': this.func.status || null,
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
        queryType == 'SANode'
          ? 'basic/serviceAppointment/querySAWorkflowNode'
          : 'basic/serviceAppointment/query',
        params,
        async res => {
          let dataList = [];
          let gpsPoints = [];
          let gpsPointsIndex = [];
          // 工单ID列表 用来查询小区部位数
          let nhIds = [];
          res.data.map((item, itemIndex) => {
            // 通过数据权限查询工单列表后，处理数据结构保持一致
            if (queryType != 'SANode') {
              if (item.workflowNodeList && item.workflowNodeList.length > 0) {
                item = Object.assign(
                  common.osg.deepCopy(item.workflowNodeList[item.workflowNodeList.length - 1]),
                  { data: item }
                );
              } else {
                item = {
                  nodeDef: {},
                  data: item
                };
              }
            }
            let obj = {
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
                district: item.data.district,
                community: item.data.community,
                leadIds: item.data.leadIds,
                createTime: item.data.createTime,
                exts: {
                  sourceType: item.data.exts.sourceType,
                  applyTimeStr: item.data.exts.applyTimeStr,
                  reallocate: item.data.exts.reallocate,
                  moKanNum: item.data.exts.moKanNum,
                  startDate: item.data.exts.startDate,
                  supervisorName: item.data.exts.supervisorName,
                  headmanName: item.data.exts.headmanName,
                  nhId: item.data.exts.nhId,
                  leakagesite: item.data.exts.leakagesite,
                  leakagesite_copy: item.data.exts.leakagesite_copy,
                  tagIds: item.data.exts.tagIds,
                  gender: item.data.exts.gender,
                  tagShow: false, // 标签默认不展示
                  distance: null, // 工单地址距离
                  distanceDuration: null, // 工单地址驾车时长，单位秒
                  pwGroupBind: item.data.exts.pwGroupBind,
                  pwGroupName: item.data.exts.pwGroupName,
                  scheduleFlag: item.data.exts.scheduleFlag
                }
              }
            };

            for (let key in item.data.exts) {
              if (key.endsWith('ReassignPermission')) {
                obj.data.exts[key] = item.data.exts[key];
              }
            }

            dataList.push(obj);

            // 收集目标地址经纬度，批量查询与当前位置的距离
            if (
              app.globalData.location &&
              item.data.gpsPoint &&
              item.data.gpsPoint.latitude &&
              item.data.gpsPoint.longitude
            ) {
              let gpsPoint = item.data.gpsPoint.latitude + ',' + item.data.gpsPoint.longitude;
              gpsPoints.push(gpsPoint);
              gpsPointsIndex.push(itemIndex);
            }

            // 收集小区id
            if (item.data.exts.nhId) {
              nhIds.push(item.data.exts.nhId);
            }
          });

          // 批量查询目标地址经纬度
          if (gpsPoints.length > 0) {
            common.osg.distance(app.globalData.location, gpsPoints, data => {
              data.map((item, index) => {
                dataList[gpsPointsIndex[index]].data.exts.distance =
                  item.distance / 1000 < 1
                    ? (item.distance / 1000).toFixed(1)
                    : (item.distance / 1000).toFixed(0);
                dataList[gpsPointsIndex[index]].data.exts.distanceDuration = item.duration;
              });
            });
          }

          // 更新成功案例数量
          let communityData = await this.getTotalCommunityWorkOrders(nhIds);
          const communityDataMap = new Map(communityData.map(item => [item.nhId, item]));
          dataList.map(item => {
            // 检查当前对象是否有 nhId 这个数据
            if (item.data.exts && item.data.exts.nhId) {
              const matchedCommunity = communityDataMap.get(item.data.exts.nhId); // 直接用 Map 查找
              if (matchedCommunity) {
                // 设置 communityOrdersTotal
                item.data.exts.communityOrdersTotal = matchedCommunity.total;
                const constructionSite = item.data.exts.leakagesite_copy?.[0];

                if (constructionSite) {
                  // 使用 Map 查找 leakagesite 的数据，避免重复查找
                  const leakagesiteDataMap = new Map(
                    matchedCommunity.data.map(d => [d.leakagesite, d])
                  );
                  const leakagesiteData = leakagesiteDataMap.get(constructionSite); // 查找对应部位数据
                  if (leakagesiteData) {
                    // 设置 communityLeakagesite 的值
                    item.data.exts.communityLeakagesite = leakagesiteData.scount || 0;
                  } else {
                    // 如果找不到对应的 leakagesite，可以设置为 0 或其他默认值
                    item.data.exts.communityLeakagesite = 0;
                  }
                }
              }
            }
          });

          // 将数据更新到工单列表
          if (this.reachBottom) {
            // 上拉加载更多（至少有1屏数据时才能触发上拉加载）
            if (res.data.length == 0) {
              if (this.list[this.list.length - 1].length == this.fpi.rows) {
                // 当最后1页数据等于10条时，本次请求的是下一页数据，下一页数据为0时，则页码恢复上一页，不需要更新列表数据。
                this.fpi.page--;
                this.reachBottom = false;
                this.loadStatus = 'noMore';
                this.$forceUpdate();
                return;
              } else {
                // 当最后1页数据不足10条时，请求的是最后一页数据，最后下一页数据为0时，则页码需要恢复上一页，需要删除最后一页的数据。
                this.fpi.page--;
                this.index--;
                this.list.pop();
                this.boundings.pop();
                this.reachBottom = false;
                this.loadStatus = 'noMore';
                this.$forceUpdate();
                return;
              }
            } else {
              // 请求到数据
              let lastPageIndex = this.fpi.page - 1;
              this.list[lastPageIndex] = dataList;
              this.boundings[lastPageIndex] = {};
              if (this.list.flat().length == res.total) {
                this.loadStatus = 'noMore';
              }
              this.$forceUpdate();
              this.getClientBounding();
            }
          } else {
            // onShow、下拉加载、搜索、处理工作流（请求数据时页码始终为1）
            if (res.data.length == 0) {
              this.list = [];
              this.boundings = [];
              this.index = 0;
              this.$forceUpdate();
              if (this.refresherTriggered) {
                common.osg.toast('当前列表没有数据', 'none');
                this.refresherTriggered = false;
              }
              return; // 直接清空列表数据，清空计算高度
            } else {
              this.list = [dataList];
              this.boundings = [{}];
              this.index = 0;
              this.$forceUpdate();
              this.getClientBounding();
              if (this.refresherTriggered) this.refresherTriggered = false; // 取消下拉刷新状态
            }
          }
        },
        { noload: true }
      );
    },
    // 计算当前工单列表最后一页高度
    getClientBounding() {
      this.$nextTick(() => {
        setTimeout(
          () => {
            let that = this;
            let index = this.fpi.page - 1; // 避免页面滚动时this.index变化影响
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
            this.reachBottom = false;
          },
          common.osg.appBaseInfo.uniPlatform == 'app' ? 500 : 200
        );
      });
    },
    toDetail(id, index1, index2, item) {
      this.showType = 'detail';
      this.clickSA = {
        id,
        index1,
        index2,
        tagShow: item.exts.tagShow,
        distance: item.exts.distance,
        distanceDuration: item.exts.distanceDuration,
        communityOrdersTotal: item.exts.communityOrdersTotal,
        communityLeakagesite: item.exts.communityLeakagesite
      };
      this.doOpen('/subpackages/serviceAppointment/serviceAppointment', { id });
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    openCustomerProfile(outId) {
      this.showType = 'keep';
      this.doOpen('../../subpackages2/customerProfile/customerProfile', {
        outId
      });
    },
    openSchedule(id) {
      this.showType = 'keep';
      this.doOpen('/subpackages2/schedule/schedule', { id });
    },
    navigateToMap(data, type) {
      this.showType = 'keep';
      let url = '../../subpackages/map/communityMap?data=';
      // #ifdef APP-PLUS
      url = '../../subpackages/map/communityMap2?data=';
      // #endif
      let leakageSite;
      if (data.exts && Array.isArray(data.exts.leakagesite_copy) && data.exts.leakagesite_copy[0]) {
        leakageSite = type == '2' ? data.exts.leakagesite_copy[0] : null;
      }

      uni.navigateTo({
        url:
          url +
          encodeURIComponent(
            JSON.stringify({
              gpsPoint: data.gpsPoint || {},
              address: data.address || '',
              area: data.area[0],
              nhId: data.exts.nhId || '',
              leakagesite: leakageSite || ''
            })
          )
      });
    },
    navigateMap(data) {
      this.showType = 'keep';
      let url = '../../subpackages/map/nearbyCustomers?data=';

      // #ifdef APP-PLUS
      url = '../../subpackages/map/nearbyCustomers2?data=';
      // #endif

      uni.navigateTo({
        url:
          url +
          encodeURIComponent(
            JSON.stringify({
              gpsPoint: data.gpsPoint || {}
            })
          )
      });
    },
    showTag(item) {
      item.data.exts.tagShow = !item.data.exts.tagShow;
      this.$forceUpdate();
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
     * type:reassign 表示重新派管家或工队
     * resourceRole:1管家 2工队 区分重新派管家还是工队
     */
    openSR(row, type, resourceRole) {
      this.serviceType = row.data.serviceType;
      this.SR.dispatchType = 'org';
      this.$set(this.SR, 'searchValue', '');
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
      if (this.SR.dispatchType == 'serviceResourceGroup' && !this.SR.scheduleFlag) {
        common.osg.toast('请选择服务资源池', 'none');
        return;
      }
      if (!this.SR.selectId) {
        common.osg.toast('请选择服务资源', 'none');
        return;
      }
      if (this.SR.dispatchType == 'serviceResourceGroup') {
        common.osg.confirm(`是否确认派单给 ${this.SR.selectRow.name}`, () => {
          common.osg.ajax(
            'basic/serviceAppointment/handleReallocateByScheduleFlag.do',
            {
              sid: this.SR.formData._id,
              serviceResourceId: this.SR.selectRow._id,
              scheduleFlag: this.SR.scheduleFlag
            },
            () => {
              common.osg.toast('派单成功', 'none');
              this.fpi.page = 1;
              this.getData();
              this.cancelSR();
            }
          );
        });
      } else {
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
                  this.fpi.page = 1;
                  this.getData();
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
        this.fpi.page = 1;
        this.getData();
        this.getFunctionsCount();
        this.cancelSR();
        // this.getMarkers();
      });
    },
    cancelSR() {
      this.SR = {
        show: false,
        dispatchType: 'org',
        scheduleFlag: '',
        fpi: { data: [] },
        fpi2: { data: [] },
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
    acceptClick(sid, workflowNodeId, data) {
      if (common.osg.isRepeatClick('accept')) {
        return; //判断是否重复点击
      }
      common.osg.ajax('basic/serviceAppointment/selfExamination', { saId: sid }, res => {
        if (res.data.length > 0) {
          this.acceptConfirm = {
            show: true,
            sid,
            workflowNodeId,
            data
          };
        } else {
          this.accept(sid, workflowNodeId, data);
        }
      });
    },
    accept(sid, workflowNodeId, data) {
      common.osg.ajax(
        'workflow/process',
        {
          sid,
          workflowNodeId,
          smodule: 'serviceAppointment'
        },
        res => {
          this.map.region = null; // 不过滤视野范围
          this.fpi.page = 1;
          this.getData();
          this.getFunctionsCount();
          // this.getMarkers();
          // 派单距离8公里内弹窗提醒
          if (
            this.currentRole._id == '3481370558631265818' &&
            (data.exts.sourceType == '2' ||
              data.exts.sourceType == '4' ||
              data.exts.sourceType == '5') &&
            data.exts.distance &&
            Number(data.exts.distance) <= 8
          ) {
            this.distanceReminder = {
              show: true,
              data
            };
            common.osg.report('click', { id: 'distanceReminder' });
          }
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
        this.getData();
        // this.getMarkers();
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
          this.getData();
          // this.getMarkers();
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
    formatLeakagesite(value) {
      if (!value || value.length == 0 || !Array.isArray(value)) return '';
      let leakagesite1 = [];
      value.map(item => {
        leakagesite1.push(item[0]);
      });
      if (leakagesite1.length > 0) {
        let str = common.osg.codelabelForArray('repairParts', leakagesite1, ' ');
        if (str && str.length > 7) {
          return str.substring(0, 7) + '...';
        } else {
          return str;
        }
      } else {
        return '';
      }
    },
    formatDistrict(value) {
      return this.areaList.county_list[value];
    },
    formatDistanceDuration(duration) {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;
      if (hours > 0) {
        return `${hours}小时${minutes}分钟`;
      } else {
        return `${minutes < 59 ? minutes + 1 : minutes}分钟`;
      }
    },
    formatApplyTime(value) {
      return common.osg.readableTime(value, 'shortDatetime');
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
      this.showType = 'keep';
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    /**
     * 扫码绑定监控
     * 已绑定其他工单时，传binding会绑定到当前工单
     */
    scanCode(item) {
      this.showType = 'keep';
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
              this.fpi.page = 1;
              this.getData();
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
          this.fpi.page = 1;
          this.getData();
        }
      );
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    scrollToLower() {
      if (!this.reachBottom) {
        this.loadStatus = 'loading';
        this.reachBottom = true;
        if (this.list[this.list.length - 1].length == this.fpi.rows) {
          // 当最后一页数据条数不足时，不请求下一页，仍然请求当前页数据
          this.fpi.page++;
        }
        this.getData();
      }
    },
    refresherRefresh() {
      this.refresherTriggered = true;
      this.fpi.page = 1;
      this.getData();
    },
    //滚动监听
    scroll(e) {
      if (this.reachBottom) return;
      let now = new Date().getTime();
      if (now - this.map.enterTime > 200) {
        this.map.enterTime = now;
        if (!this.windowHeight) {
          uni
            .createSelectorQuery()
            .select('#content')
            .boundingClientRect(rect => {
              if (rect) {
                this.windowHeight = rect.height;
              }
            })
            .exec();
        }

        // 循环每页高度
        for (let i = 0; i < this.boundings.length; i++) {
          // 如果没有在屏幕中，并且视野的高度小于我的结尾位置距离顶部的距离，也就是说，这个dom是我正在查看的dom
          if (
            this.boundings[i].top < e.detail.scrollTop + this.windowHeight &&
            e.detail.scrollTop + this.windowHeight <= this.boundings[i].bottom
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
      common.osg.ajax(
        'basic/serviceAppointment/queryById/' + sid,
        { type: 'query' },
        res => {
          if (callback) callback(res.data);
        },
        {
          noload: true
        }
      );
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
          // this.getMarkers();
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
        orderState: this.func.orderState,
        'regex:title|string#or': this.searchValue,
        'regex:name|string#or': this.searchValue,
        'regex:phone|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
        'in:status|array#and': this.func.status || null,
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
        this.getData();
        // this.getMarkers({ region: e.detail.region });
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
            this.currentRole._id == '6631748470755706348')
        ) &&
        !(
          this.currentRole._id == '6631748470755706348' &&
          Number(item.data.status) > 102 &&
          Number(item.data.status) < 203 &&
          item.data.status != '201'
        ) &&
        !(
          this.currentRole._id == '6631748470755706348' &&
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
    },
    //移动端工单列表查询同小区工单数
    async getTotalCommunityWorkOrders(params) {
      let aggr = [
        // {
        //   $match: {
        //     '_id.nhId': {
        //       $in: params
        //     }
        //     // status: { $gt: '204', $ne: '999' }
        //   }
        // },
        // {
        //   $group: {
        //     _id: { nhId: '$_id.nhId', leakagesite: '$_id.leakagesite' },
        //     scount: {
        //       $sum: '$scount'
        //     }
        //   }
        // }

        {
          $match: {
            $and: [
              { state: 1 },
              { status: { $gt: '204', $ne: '999' } },
              { 'exts.nhId': { $in: params } }
            ]
          }
        },
        {
          $addFields: {
            leakagesite: { $first: '$exts.leakagesite_copy' }
          }
        },
        {
          $group: {
            _id: {
              leakagesite: '$leakagesite',
              nhId: '$exts.nhId'
            },
            scount: { $sum: 1 }
          }
        }
      ];
      const dataList = await new Promise((resolve, reject) => {
        common.osg.ajax(
          '/stat/aggr/serviceAppointment.do',
          { aggr: JSON.stringify(aggr) },
          res => {
            // 使用 reduce 处理/合并数据
            let list = res.reduce((acc, { scount, _id }) => {
              const { nhId, leakagesite } = _id;
              // 查找是否已存在该 nhId 的项
              let nhItem = acc.find(item => item.nhId == nhId);
              // 如果没有该 nhId 的项，创建一个新的项并加入数组
              if (!nhItem) {
                nhItem = { nhId, data: [], total: 0 };
                acc.push(nhItem);
              }
              // 将当前项的 leakagesite 和 scount 添加到 data 数组中
              nhItem.data.push({ leakagesite, scount });
              nhItem.total += scount;
              return acc;
            }, []);

            resolve(list);
          },
          {
            noload: true
          }
        );
      });
      return dataList;
    },
    getTags() {
      common.osg.ajax(
        'basic/tag/query',
        { _all: '1', 'is:state|integer#and': 1, notFilterBelongTo: '1', notFilterOrgId: '1' },
        res => {
          res.data = res.data || [];
          res.data.map(item => {
            item.value = item._id;
          });
          this.options.tags = res.data;
        },
        { noload: true }
      );
    },
    openLocation(gpsPoint, area, address) {
      // #ifdef MP-WEIXIN
      // 微信小程序打开地图时，返回时会触发onShow，为了不刷新列表，设置showType
      this.showType = 'keep';
      // #endif
      uni.openLocation({
        latitude: gpsPoint.latitude,
        longitude: gpsPoint.longitude,
        name: address || '',
        address:
          (area.length == 3
            ? this.areaList.city_list[area[1]] + this.areaList.county_list[area[2]]
            : '') + address
      });
    },
    buttonGroupShow(item) {
      return (
        Number(item.data.status) > 103 ||
        (this.currentRole._id == '6631748470755706348' &&
          Number(item.data.status) > 102 &&
          Number(item.data.status) < 203 &&
          item.data.status != '201') ||
        (this.currentRoleButtons.find(item => item.code == 'reallocate') &&
          (!item.data.workflowId || item.data.exts.reallocate == '1')) ||
        (item.state == 0 &&
          item.nodeDef &&
          item.nodeDef.nodeType == 'allot' &&
          item.handlerIds &&
          (item.handlerIds.indexOf(this.user._id) != -1 ||
            item.handlerIds.indexOf(this.currentRole._id) != -1 ||
            item.handlerIds.indexOf(this.user.orgId + '+' + this.currentRole._id) != -1)) ||
        (item.state == 0 &&
          item.nodeDef &&
          item.nodeDef.nodeType == 'dispatch' &&
          item.handlerIds &&
          (item.handlerIds.indexOf(this.user._id) != -1 ||
            item.handlerIds.indexOf(this.currentRole._id) != -1 ||
            item.handlerIds.indexOf(this.user.orgId + '+' + this.currentRole._id) != -1)) ||
        (item.state == 0 &&
          item.nodeDef &&
          item.nodeDef.nodeType == 'accept' &&
          item.handlerIds &&
          (item.handlerIds.indexOf(this.user._id) != -1 ||
            item.handlerIds.indexOf(this.currentRole._id) != -1 ||
            item.handlerIds.indexOf(this.user.orgId + '+' + this.currentRole._id) != -1))
      );
    },
    describeClick(msg) {
      if (msg.length > 30) {
        common.osg.alert(msg, null, '备注');
      }
    },
    //检查一下当前参数日期 是否大于4月21日
    isAfterApril21(dateStr) {
      const inputDate = new Date(dateStr);
      const targetDate = new Date('2025-04-21T00:00:00');
      // 判断是否为有效日期
      if (isNaN(inputDate.getTime())) {
        return false;
      }
      return inputDate > targetDate;
    },
    bindPWGroupNameClick(row) {
      this.wechatGroup.sid = row._id;
      this.wechatGroup.pwGroupName = row.exts.pwGroupName || '';
      this.wechatGroup.show = true;
    },
    bindPWGroupName() {
      if (!this.wechatGroup.pwGroupName) {
        common.osg.toast('请填写微信群名称', 'none');
        return;
      }
      common.osg.ajax(
        'basic/serviceAppointment/bindPWGroupName',
        { sid: this.wechatGroup.sid, groupName: this.wechatGroup.pwGroupName },
        () => {
          this.wechatGroup.show = false;
          common.osg.toast('绑定成功', 'none');
          this.getData();
        }
      );
    },
    dispatchTypeChange(e) {
      this.SR.dispatchType = e.detail.name;
      this.SR.selectId = '';
      this.SR.selectRow = {};
    },
    serviceResourceGroupChange() {
      this.SR.selectId = '';
      this.SR.selectRow = {};
      if (this.SR.scheduleFlag) {
        common.osg.ajax(
          'biz/serviceResourceGroup/query.do',
          {
            _all: '1',
            'is:state|integer#and': 1,
            'is:resourceType|string#and': 'technician',
            'is:scheduleFlag|string#and': this.SR.scheduleFlag,
            'is:region|tring#and': this.SR.formData.province,
            notFilterBelongTo: '1',
            notFilterOrgId: '1'
          },
          res => {
            if (res.data.length > 0) {
              if (res.data[0].srIds.length > 0) {
                common.osg.ajax(
                  'biz/serviceResource/query.do',
                  {
                    _all: '1',
                    'is:state|integer#and': 1,
                    'in:_id|array#and': res.data[0].srIds.join()
                  },
                  result => {
                    if (result.data.length > 0) {
                      this.$set(this.SR, 'fpi2', result);
                    } else {
                      this.$set(this.SR, 'fpi2', []);
                      common.osg.toast('未查询到服务资源信息', 'none');
                    }
                  },
                  {
                    noload: true
                  }
                );
              } else {
                this.$set(this.SR, 'fpi2', []);
                common.osg.toast('所选服务资源池内没有服务资源', 'none');
              }
            } else {
              this.$set(this.SR, 'fpi2', []);
              common.osg.toast('未查询到该服务资源池的信息', 'none');
            }
          },
          {
            noload: true
          }
        );
      } else {
        this.SR.fpi2 = [];
      }
    }
  }
};
</script>
<style lang="scss">
.serviceAppointments {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .c-sr-search,
  .c-sr-select {
    padding: 10px 16px;
    .uni-select {
      border-radius: 2px;
      height: 34px;
    }
  }
  .header {
    // background-color: #ffffff;
    .c-search {
      padding: 0 16px;
      .van-search__content {
        background-color: #f7f8fa;
        border-radius: 8px;
        .van-icon-search {
          color: #c8c9cc;
        }
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
  #content {
    flex: 1;
    overflow-y: auto;
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

  .out-of-time-notify-modal {
    width: calc(100vw - 32px);
    border-radius: 16px;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 9999;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    background: #fff;
    .overdue-notification-box {
      position: relative;
      height: 45px;
      width: 100%;
      .reminder-view {
        width: 90px;
        height: 90px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background-color: #ff6900;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .address-info {
      margin: 16px;
      padding: 16px 16px 10px;
      border-radius: 16px;
      border: 1px solid #ebedf0;
      background-color: #f9fafc;
    }
    .more {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      min-height: 80rpx;
      color: #2c5bec;
      background-color: #fff;
      border-radius: 0px 0px 10px 10px;
    }
  }
}

.card {
  background-color: #fff;
  width: calc(100vw - 32px);
  margin: 16px;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
  display: grid;
  row-gap: 12px;
  position: relative;
  .card-view {
    line-height: 22px;
    .card-icon-view {
      width: 24px;
      height: 24px;
      box-sizing: border-box;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 20px;
        height: 20px;
      }
    }
    .card-icon-border {
      border: 1px solid #ebedf0;
      border-radius: 4px;
    }
    .card-memo {
      border: 1px solid #e0c697;
      border-radius: 4px;
      background-color: #fff9e6;
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      .card-memo-text {
        font-size: 14px;
        line-height: 20px;
        color: #646566;
      }
    }
  }
  .card-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    gap: 16px;
    .van-button {
      border-radius: 4px;
    }
  }
}
::v-deep .innerView-tag .van-tag {
  margin-right: 5px;
  padding: 2px 5px;
  opacity: 0.6;
}
.customer_profile {
  position: absolute;
  left: 0px;
  bottom: -28px;
  width: 100%;
  height: 32px;
  font-size: 12px;
  padding: 4px 16px 0px 16px;
  display: flex;
  box-sizing: border-box;
  border-radius: 0px 0px 8px 8px;
  align-items: center;
  z-index: 10;
  // background-color: #ebedf0;
  background: linear-gradient(to top, #ebedf0 0%, rgba(235, 237, 240, 0) 99%);

  image {
    width: 12px;
    height: 12px;
  }
}
.mb-44 {
  margin-bottom: 44px;
}
</style>
