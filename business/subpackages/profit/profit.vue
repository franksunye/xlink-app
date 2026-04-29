<template>
  <view class="profit" @click.capture="track">
    <view class="c-flex c-flex-between c-item-center">
      <text class="title">项目信息</text>
      <text class="unit"></text>
    </view>
    <view class="info">
      <van-field
        label="合同总额（元）"
        :value="order.totalPrice"
        :border="false"
        input-align="right"
        placeholder="请输入"
        label-class="label"
        input-class="value"
        disabled
      />
      <van-field
        v-if="currentRoleType == '2'"
        label="计划成本（元）"
        :value="formData.cosPlanTotal"
        :border="false"
        input-align="right"
        placeholder="请输入"
        label-class="label"
        input-class="value"
        data-key="cosPlanTotal"
        @change="onFieldChange"
        disabled
      />
      <van-field
        v-if="currentRoleType == '2'"
        label="实际成本（元）"
        :value="formData.cosOptTotal"
        :border="false"
        input-align="right"
        placeholder="请输入"
        label-class="label"
        input-class="value"
        data-key="cosOptTotal"
        @change="onFieldChange"
        disabled
      />
      <van-field
        v-if="currentRoleType == '2'"
        label="成本差额（元）"
        :value="formData.cosTotalGap"
        :border="false"
        input-align="right"
        label-class="label"
        input-class="value"
        data-key="cosTotalGap"
        @change="onFieldChange"
        disabled
      />
      <van-field
        label="计划工期（天）"
        :value="formData.cosPlanDays"
        :border="false"
        input-align="right"
        placeholder="请输入"
        label-class="label"
        input-class="value"
        data-key="cosPlanDays"
        @change="onFieldChange"
        :disabled="formDisable"
        placeholder-style="color:#999"
      />
      <van-field
        label="实际工期（天）"
        :value="formData.cosOptDays"
        :border="false"
        input-align="right"
        placeholder="请输入"
        label-class="label"
        input-class="value"
        data-key="cosOptDays"
        @change="onFieldChange"
        :disabled="formDisable"
        placeholder-style="color:#999"
      />
      <!-- <van-field
        label="进场日期"
        :value="formData.cosStartDate"
        :border="false"
        input-align="right"
        label-class="label"
        :input-class="currentRoleType == '1' ? 'c-value' : 'value'"
        data-key="cosStartDate"
        is-link
        disabled
        @click-input="onCalendarDisplay"
        placeholder="请选择"
        :placeholder-style="currentRoleType == '1' ? 'color:#999' : ''"
      />
      <van-field
        label="交付验收日期"
        :value="formData.cosEndDate"
        :border="false"
        input-align="right"
        label-class="label"
        :input-class="currentRoleType == '1' ? 'c-value' : 'value'"
        data-key="cosEndDate"
        is-link
        disabled
        @click-input="onCalendarDisplay"
        placeholder="请选择"
        :placeholder-style="currentRoleType == '1' ? 'color:#999' : ''"
      /> -->
      <!-- 日历 -->
      <van-calendar
        :show="calendarShow"
        :show-confirm="false"
        @close="onCalendarClose"
        @confirm="onCalendarConfirm"
        :first-day-of-week="1"
        :min-date="minDate"
        :default-date="defaultDate"
        color="#0068b0"
      />
    </view>
    <view class="title">日工作项拆解</view>
    <view class="day" v-for="(day, i) in list" :key="i">
      <view class="top">
        <text class="title">第{{ i + 1 }}天</text>
        <!-- 只要有1个工作项不允许删除，该工作项所属天就不允许删除。 -->
        <van-icon
          v-if="!formDisable && day && !day.find(obj => obj._id)"
          name="delete-o"
          style="color: #cfcfcf"
          @click="deleteDay(i)"
        ></van-icon>
      </view>
      <view class="item" v-for="(item, j) in day" :key="j">
        <view>
          <view class="name">
            <text class="c-nowrap">{{ j + 1 }}：{{ item.typeName }}</text>
          </view>
          <view class="block">
            <view
              class="count"
              style="margin: 7px 7px 7px 0"
              @click="onEditItemClick(item)"
              :data-event="{ id: 'pxW42jvjvQ' }"
            >
              <text class="value" :data-event="{ id: 'pxW42jvjvQ' }">{{ item.planCount }}</text>
              <text class="label" :data-event="{ id: 'pxW42jvjvQ' }">计划用量</text>
            </view>
            <view class="count" @click="onEditItemClick(item)" :data-event="{ id: 'yyutR9zNpo' }">
              <text class="value" :data-event="{ id: 'yyutR9zNpo' }">{{ item.optCount }}</text>
              <text class="label" :data-event="{ id: 'yyutR9zNpo' }">实际用量</text>
            </view>
            <view
              class="count"
              @click="onEditItemClick(item)"
              v-if="currentRoleType == '2'"
              :data-event="{ id: '7-hm2gGruk' }"
            >
              <text class="value" :data-event="{ id: '7-hm2gGruk' }">
                {{ item.planPrice || 0 }}
              </text>
              <text class="label" :data-event="{ id: '7-hm2gGruk' }">成本单价</text>
            </view>
            <view class="c-flex c-flex-col c-flex-between" style="margin-left: 7px; height: 60px">
              <van-icon
                name="edit"
                style="color: #cfcfcf"
                @click="onEditItemClick(item)"
              ></van-icon>
              <van-icon
                v-if="!formDisable && !item._id"
                name="delete-o"
                style="color: #cfcfcf"
                @click="onDeleteItem(i, j, item.typeName)"
              ></van-icon>
            </view>
          </view>
          <view class="remark" :class="j == (day && day.length - 1) ? 'last-remark' : ''">
            <view class="c-ellipsis2" v-if="item.planMemo">管家备注：{{ item.planMemo }}</view>
            <view class="c-ellipsis2" v-if="item.optMemo">工队备注：{{ item.optMemo }}</view>
          </view>
        </view>
      </view>
      <view
        class="add-item"
        @click="addItem(i)"
        v-if="!formDisable"
        :data-event="{ id: '_ebZSvc82m' }"
      >
        +添加工作项
      </view>
    </view>
    <view class="c-flex" style="margin-top: 30px">
      <view
        class="add-day"
        @click="addDay('click')"
        v-if="!formDisable"
        :data-event="{ id: '3WW4Vb_3Vh' }"
      >
        +添加天数
      </view>
      <view v-if="!formDisable" style="width: 10px"></view>
      <van-button
        v-if="!formDisable"
        type="info"
        color="#07c160"
        block
        @click="doSave"
        custom-style="border-radius:8px;"
        style="flex: 1"
        :data-event="{ id: 'Yq4lEl6rOM' }"
      >
        保 存
      </van-button>
    </view>
    <!-- 添加工作项类型 -->
    <van-action-sheet
      :show="addItemType.show"
      :actions="addItemType.actions"
      @close="onAddItemTypeClose"
      @select="onAddItemTypeSelect"
    />
    <!-- 从订单添加 -->
    <van-popup
      :show="orderShow"
      position="bottom"
      custom-style="height: 100%;display:flex;flex-direction:column;"
      custom-class="c-popup-order"
      @close="
        () => {
          orderShow = false;
        }
      "
    >
      <van-nav-bar
        title="从订单选择工作项"
        left-text="取消"
        right-text="确认"
        @click-left="addOrderItemCancel"
        @click-right="addOrderItemConfirm"
      />
      <!-- 多部位订单 -->
      <view class="c-content" v-if="orderShow">
        <view class="c-order" v-for="(order, i) in orderList" :key="i">
          <view class="c-order-top">
            <view class="c-flex c-flex-between c-item-center">
              <view>部位：{{ order.constructionLocation }}</view>
              <view v-if="order.partDescription">部位描述：{{ order.partDescription }}</view>
            </view>
            <view v-if="order.constructionSite">施工位置：{{ order.constructionSite }}</view>
            <view class="c-flex c-flex-between c-item-center">
              <view class="c-flex c-item-center" v-if="order.agelimit || order.agelimit === 0">
                质保年限：{{ codelabel('agelimit', String(order.agelimit)) }}
              </view>
              <view>质保工程量：{{ order.maintainAreaNum }}</view>
            </view>
          </view>

          <!-- 套餐 -->
          <view class="c-selected c-orders-selected" v-if="order.projPackages.data.length">
            <view class="c-selected-title">
              <text>套餐</text>
              <text class="c-size-13">
                分类合计：
                <text class="c-red">¥{{ order.projPackages.totalAmount }}</text>
              </text>
            </view>
            <view class="c-selected-items">
              <view
                v-for="(item, index) in order.projPackages.data"
                :key="index"
                class="c-flex c-item-center"
              >
                <van-checkbox
                  :value="item.checked"
                  @change="onCheck($event, item)"
                  custom-class="c-m-l-20"
                ></van-checkbox>
                <view :data-item="item" :data-index="index" class="c-selected-item">
                  <view>{{ item.name }}</view>
                  <view style="margin: 10rpx 0 20rpx">
                    <view class="c-flex" v-if="item.desc">
                      <view class="desc">描述：{{ item.desc }}</view>
                      <van-icon
                        name="info-o"
                        color="#b3d8ff"
                        class="c-m-l-5"
                        @click="toViewDescription(item.desc)"
                        :data-event="{ id: 'k78jKYdBGY' }"
                      />
                    </view>
                    <text class="desc-tag" style="margin-left: 0">
                      {{ codelabel('packageType', item.type) }}
                    </text>
                    <text class="desc-tag" v-if="item.minimumPrice || item.minimumPrice === 0">
                      最低起算价：¥{{ item.minimumPrice }}
                    </text>
                    <view class="c-m-t-10">
                      <van-button
                        v-if="item.procedureList.length > 0"
                        plain
                        hairline
                        type="info"
                        size="mini"
                        @click="openProcedures(item.procedureList)"
                        class="c-m-r-10"
                        :data-event="{ id: 'SSoq1H9gOC' }"
                      >
                        查看工序
                      </van-button>
                      <van-button
                        v-if="item.materialList.length > 0"
                        plain
                        hairline
                        type="info"
                        size="mini"
                        @click="openMaterials(item.materialList)"
                        :data-event="{ id: 'uxQiDAfYWn' }"
                      >
                        查看材料
                      </van-button>
                    </view>
                  </view>
                  <view class="c-flex c-flex-between c-flex-center">
                    <view>
                      <text class="c-red c-bold">¥{{ item.price }}</text>
                    </view>
                    <van-stepper
                      :value="item.number"
                      integer
                      :min="0"
                      button-size="24"
                      input-class="input-class"
                      plus-class="plus-class"
                      minus-class="minus-class"
                      disabled
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!-- 工序 -->
          <view class="c-selected c-orders-selected" v-if="order.procedures.data.length">
            <view class="c-selected-title">
              <text>工序</text>
              <text class="c-size-13">
                分类合计：
                <text class="c-red">¥{{ order.procedures.totalAmount }}</text>
              </text>
            </view>
            <view class="c-selected-items">
              <view
                v-for="(item, index) in order.procedures.data"
                :key="index"
                class="c-flex c-item-center"
              >
                <van-checkbox
                  :value="item.checked"
                  @change="onCheck($event, item)"
                  custom-class="c-m-l-20"
                ></van-checkbox>
                <view :data-item="item" :data-index="index" class="c-selected-item">
                  <view>{{ item.content }}</view>
                  <view style="margin: 10rpx 0 20rpx">
                    <view class="c-flex" v-if="item.desc">
                      <view class="desc">描述：{{ item.desc }}</view>
                      <van-icon
                        name="info-o"
                        color="#b3d8ff"
                        class="c-m-l-5"
                        @click="toViewDescription(item.desc)"
                        :data-event="{ id: 'Uw-HfuLIwG' }"
                      />
                    </view>
                    <text
                      class="desc-tag c-m-l-0"
                      v-if="
                        item.currentMinimumGuideTotalPrice ||
                        item.currentMinimumGuideTotalPrice === 0
                      "
                    >
                      最低起算价：¥{{ item.currentMinimumGuideTotalPrice }}
                    </text>
                  </view>
                  <view class="c-flex c-flex-between c-flex-center">
                    <view>
                      <text class="c-red c-bold">¥{{ item.guideUnitPrice }}</text>
                      <text class="c-gray c-size-12">
                        {{ ' /' + codelabel('unit', item.unit) }}
                      </text>
                    </view>
                    <van-stepper
                      :value="item.number"
                      integer
                      :min="0"
                      button-size="24"
                      input-class="input-class"
                      plus-class="plus-class"
                      minus-class="minus-class"
                      disabled
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!-- 材料 -->
          <view class="c-selected c-orders-selected" v-if="order.materials.data.length">
            <view class="c-selected-title">
              <text>材料</text>
              <text class="c-size-13">
                分类合计：
                <text class="c-red">¥{{ order.materials.totalAmount }}</text>
              </text>
            </view>
            <view class="c-selected-items">
              <view
                v-for="(item, index) in order.materials.data"
                :key="index"
                class="c-flex c-item-center"
              >
                <van-checkbox
                  :value="item.checked"
                  @change="onCheck($event, item)"
                  custom-class="c-m-l-20"
                ></van-checkbox>
                <view :data-item="item" :data-index="index" class="c-selected-item">
                  <view>{{ item.name }}</view>
                  <view class="c-flex">
                    <van-image
                      v-if="item.images.length > 0"
                      fit="widthFix"
                      width="80"
                      height="80"
                      :src="item.images[0].url"
                      style="margin-top: 10rpx; display: flex"
                      image-class="c-images"
                      @click="previewImage(item.images[0].url)"
                      :data-event="{ id: 'Y7NS9KAWg5' }"
                    />
                    <view class="c-flex c-flex-col c-flex-1">
                      <view style="margin: 0 0 10rpx">
                        <text class="desc-tag" v-if="item.type">
                          类型：{{ codelabel('materialType', String(item.type)) }}
                        </text>
                        <text class="desc-tag" v-if="item.exts.brand">
                          品牌：{{ item.exts.brand || '' }}
                        </text>
                        <text class="desc-tag" v-if="item.code">编号：{{ item.code || '' }}</text>
                        <text class="desc-tag" v-if="item.spec">
                          规格：{{ item.spec || ''
                          }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
                        </text>
                        <text class="desc-tag" v-if="item.model">型号：{{ item.model || '' }}</text>
                        <view class="c-m-l-10 c-m-t-10" v-if="item.desc">
                          <van-button
                            plain
                            hairline
                            type="info"
                            size="mini"
                            @click="openMaterialDetail(item.name, item.desc)"
                            :data-event="{ id: 'GZDTK3PbAl' }"
                          >
                            材料介绍
                          </van-button>
                        </view>
                      </view>
                      <view class="c-flex c-flex-between c-flex-center c-m-l-10">
                        <view>
                          <text class="c-red c-bold">¥{{ item.price }}</text>
                          <text class="c-gray c-size-12">
                            {{ ' /' + codelabel('unit', item.unit) }}
                          </text>
                        </view>
                        <van-stepper
                          :value="item.number"
                          integer
                          :min="0"
                          button-size="24"
                          input-class="input-class"
                          plus-class="plus-class"
                          minus-class="minus-class"
                          disabled
                        />
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!-- 机措 -->
          <view class="c-selected c-orders-selected" v-if="order.measures.data.length">
            <view class="c-selected-title">
              <text>机措</text>
              <text class="c-size-13">
                分类合计：
                <text class="c-red">¥{{ order.measures.totalAmount }}</text>
              </text>
            </view>
            <view class="c-selected-items">
              <view
                v-for="(item, index) in order.measures.data"
                :key="index"
                class="c-flex c-item-center"
              >
                <van-checkbox
                  :value="item.checked"
                  @change="onCheck($event, item)"
                  custom-class="c-m-l-20"
                ></van-checkbox>
                <view :data-item="item" :data-index="index" class="c-selected-item">
                  <view>{{ item.content }}</view>
                  <view style="margin: 10rpx 0 20rpx">
                    <view class="c-flex" v-if="item.desc">
                      <view class="desc">描述：{{ item.desc }}</view>
                      <van-icon
                        name="info-o"
                        color="#b3d8ff"
                        class="c-m-l-5"
                        @click="toViewDescription(item.desc)"
                        :data-event="{ id: '7F8jyfe4Rh' }"
                      />
                    </view>
                  </view>
                  <view class="c-flex c-flex-between c-flex-center">
                    <view>
                      <text class="c-red c-bold">¥{{ item.guideUnitPrice }}</text>
                      <text class="c-gray c-size-12">
                        {{ ' /' + codelabel('unit', item.unit) }}
                      </text>
                    </view>
                    <van-stepper
                      :value="item.number"
                      integer
                      :min="0"
                      button-size="24"
                      input-class="input-class"
                      plus-class="plus-class"
                      minus-class="minus-class"
                      disabled
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 自定义增项 -->
        <view class="c-selected" v-if="addItems.data.length">
          <view class="c-selected-title">
            <text>自定义增项</text>
            <text class="c-size-13">
              分类合计：
              <text class="c-red">¥{{ addItems.totalAmount }}</text>
            </text>
          </view>
          <view class="c-selected-items">
            <view v-for="(item, index) in addItems.data" :key="index" class="c-flex c-item-center">
              <van-checkbox
                :value="item.checked"
                @change="onCheck($event, item)"
                custom-class="c-m-l-20"
              ></van-checkbox>
              <view :data-item="item" :data-index="index" class="c-selected-item c-flex-1">
                <van-field
                  :value="item.name"
                  placeholder="请输入自定义增项名称"
                  size="small"
                  class="customItem-input"
                  custom-style="padding-top:0;padding-left:0;font-size:12px;"
                  disabled
                  :border="false"
                />
                <view class="c-flex c-flex-between c-flex-center">
                  <view>
                    <text class="c-red c-bold">¥{{ item.price }}</text>
                    <text class="c-gray c-size-12">{{ ' /' + codelabel('unit', item.unit) }}</text>
                  </view>
                  <van-stepper
                    :value="item.number"
                    integer
                    :min="0"
                    button-size="24"
                    input-class="input-class"
                    plus-class="plus-class"
                    minus-class="minus-class"
                    disabled
                  />
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 自定义减项 -->
        <view class="c-selected" v-if="deleteItems.data.length">
          <view class="c-selected-title">
            <text>自定义减项</text>
            <text class="c-size-13">
              分类合计：
              <text class="c-red">¥{{ deleteItems.totalAmount }}</text>
            </text>
          </view>
          <view class="c-selected-items">
            <view
              v-for="(item, index) in deleteItems.data"
              :key="index"
              class="c-flex c-item-center"
            >
              <van-checkbox
                :value="item.checked"
                @change="onCheck($event, item)"
                custom-class="c-m-l-20"
              ></van-checkbox>
              <view :data-item="item" :data-index="index" class="c-selected-item c-flex-1">
                <van-field
                  :value="item.name"
                  placeholder="请输入自定义减项名称"
                  class="customItem-input"
                  custom-style="padding-top:0;padding-left:0;font-size:12px;"
                  disabled
                  :border="false"
                />
                <view class="c-flex c-flex-between c-flex-center">
                  <view>
                    <text class="c-red c-bold">¥{{ item.price }}</text>
                    <text class="c-gray c-size-12">{{ ' /' + codelabel('unit', item.unit) }}</text>
                  </view>
                  <van-stepper
                    :value="item.number"
                    integer
                    :min="0"
                    button-size="24"
                    input-class="input-class"
                    plus-class="plus-class"
                    minus-class="minus-class"
                    disabled
                  />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </van-popup>
    <!-- 从产品中心添加 -->
    <van-popup
      :show="productShow"
      position="bottom"
      custom-style="height: 100%;display:flex;flex-direction:column;"
      custom-class="c-popup-order"
      @close="
        () => {
          productShow = false;
        }
      "
    >
      <van-nav-bar
        title="从产品中心选择工作项"
        left-text="取消"
        right-text="确认"
        @click-left="addProductItemCancel"
        @click-right="addProductItemConfirm"
      />
      <van-search
        v-if="activeTab == 'material'"
        placeholder="搜索材料"
        shape="round"
        :value="material.searchValue"
        @search="onSearch"
        @clear="onSearchClear"
      />
      <van-search
        v-if="activeTab == 'procedure'"
        placeholder="搜索工序"
        shape="round"
        :value="procedure.searchValue"
        @search="onSearch"
        @clear="onSearchClear"
      />
      <van-search
        v-if="activeTab == 'measure'"
        placeholder="搜索机措"
        shape="round"
        :value="measure.searchValue"
        @search="onSearch"
        @clear="onSearchClear"
      />
      <van-search
        v-if="activeTab == 'projPackage'"
        placeholder="搜索套餐"
        shape="round"
        :value="projPackage.searchValue"
        @search="onSearch"
        @clear="onSearchClear"
      />
      <van-tabs
        v-if="productShow"
        :active="activeTab"
        @change="tabChange"
        custom-class="c-product-tabs"
        style="flex: 1; overflow: hidden"
        ref="product"
        :data-event="{ id: 'g4tKnkiuJ1', capture: false }"
      >
        <van-tab title="材料" name="material">
          <view class="goods" :data-event="{ id: 'g4tKnkiuJ1' }">
            <block v-for="(item, i) in material.data" :key="i">
              <view
                class="goods-item"
                v-if="
                  material.searchValue
                    ? item.name.toLowerCase().indexOf(material.searchValue.toLowerCase()) != -1
                    : true
                "
                :data-event="{ id: 'g4tKnkiuJ1' }"
              >
                <van-checkbox
                  :value="item.checked"
                  @change="onCheck($event, item)"
                  class="c-m-l-10"
                ></van-checkbox>
                <image
                  :src="
                    (item.images && JSON.parse(item.images)[0].url) ||
                    'https://pub.fsgo365.cn/logo_square.png'
                  "
                  class="goods-item-image"
                  :data-event="{ id: 'g4tKnkiuJ1' }"
                />
                <view class="goods-item-view c-flex-around" :data-event="{ id: 'g4tKnkiuJ1' }">
                  <view :data-event="{ id: 'g4tKnkiuJ1' }">
                    <view :data-event="{ id: 'g4tKnkiuJ1' }">{{ item.name }}</view>
                    <view :data-event="{ id: 'g4tKnkiuJ1' }">
                      <text
                        class="desc-tag"
                        v-if="item.desc"
                        @click="openMaterialDetail(item.name, item.desc)"
                        style="border: 1px solid #106cff; color: #106cff"
                        :data-event="{ id: 'FlloPbFePC' }"
                      >
                        材料介绍
                      </text>
                      <text class="desc-tag" v-if="item.code" :data-event="{ id: 'g4tKnkiuJ1' }">
                        编号：{{ item.code || '' }}
                      </text>
                      <text class="desc-tag" v-if="item.type" :data-event="{ id: 'g4tKnkiuJ1' }">
                        类型：{{ codelabel('materialType', String(item.type)) }}
                      </text>
                      <text
                        class="desc-tag"
                        v-if="item.exts.brand"
                        :data-event="{ id: 'g4tKnkiuJ1' }"
                      >
                        品牌：{{ item.exts.brand || '' }}
                      </text>
                      <text class="desc-tag" v-if="item.spec" :data-event="{ id: 'g4tKnkiuJ1' }">
                        规格：{{ item.spec || ''
                        }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
                      </text>
                      <text class="desc-tag" v-if="item.model" :data-event="{ id: 'g4tKnkiuJ1' }">
                        型号：{{ item.model || '' }}
                      </text>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </van-tab>
        <van-tab title="工序" name="procedure">
          <view class="goods" :data-event="{ id: 'g4tKnkiuJ1' }">
            <block v-for="(item, i) in procedure.data" :key="i">
              <view
                class="goods-item"
                v-if="
                  procedure.searchValue
                    ? item.name.toLowerCase().indexOf(procedure.searchValue.toLowerCase()) != -1
                    : true
                "
                :data-event="{ id: 'g4tKnkiuJ1' }"
              >
                <van-checkbox
                  :value="item.checked"
                  @change="onCheck($event, item)"
                  class="c-m-l-10"
                ></van-checkbox>
                <image
                  :src="
                    (item.images && JSON.parse(item.images)[0].url) ||
                    'https://pub.fsgo365.cn/logo_square.png'
                  "
                  class="goods-item-image"
                  :data-event="{ id: 'g4tKnkiuJ1' }"
                />
                <view class="goods-item-view c-flex-around" :data-event="{ id: 'g4tKnkiuJ1' }">
                  <view :data-event="{ id: 'g4tKnkiuJ1' }">
                    <view :data-event="{ id: 'g4tKnkiuJ1' }">{{ item.name }}</view>
                    <view
                      v-if="item.desc"
                      @click="toViewDescription(item.desc)"
                      class="c-ellipsis2 c-size-14 c-color-value"
                      :data-event="{ id: 'po3CU8OpYA' }"
                    >
                      描述：{{ item.desc }}
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </van-tab>
        <van-tab title="机措" name="measure">
          <view class="goods" :data-event="{ id: 'g4tKnkiuJ1' }">
            <block v-for="(item, i) in measure.data" :key="i">
              <view
                class="goods-item"
                v-if="
                  measure.searchValue
                    ? item.content.toLowerCase().indexOf(measure.searchValue.toLowerCase()) != -1
                    : true
                "
                :data-event="{ id: 'g4tKnkiuJ1' }"
              >
                <van-checkbox
                  :value="item.checked"
                  @change="onCheck($event, item)"
                  class="c-m-l-10"
                ></van-checkbox>
                <image
                  :src="
                    (item.images && JSON.parse(item.images)[0].url) ||
                    'https://pub.fsgo365.cn/logo_square.png'
                  "
                  class="goods-item-image"
                  :data-event="{ id: 'g4tKnkiuJ1' }"
                />
                <view class="goods-item-view c-flex-around" :data-event="{ id: 'g4tKnkiuJ1' }">
                  <view :data-event="{ id: 'g4tKnkiuJ1' }">
                    <view :data-event="{ id: 'g4tKnkiuJ1' }">{{ item.name || item.content }}</view>
                    <view
                      v-if="item.desc"
                      @click="toViewDescription(item.desc)"
                      class="c-ellipsis2 c-size-14 c-color-value"
                      :data-event="{ id: 'TLkjoC22tH' }"
                    >
                      描述：{{ item.desc }}
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </van-tab>
        <van-tab title="套餐" name="projPackage">
          <view class="goods" :data-event="{ id: 'g4tKnkiuJ1' }">
            <block v-for="(item, i) in projPackage.data" :key="i">
              <view
                class="goods-item"
                v-if="
                  projPackage.searchValue
                    ? item.name.toLowerCase().indexOf(projPackage.searchValue.toLowerCase()) != -1
                    : true
                "
                :data-event="{ id: 'g4tKnkiuJ1' }"
              >
                <van-checkbox
                  :value="item.checked"
                  @change="onCheck($event, item)"
                  class="c-m-l-10"
                ></van-checkbox>
                <image
                  :src="
                    (item.images && JSON.parse(item.images)[0].url) ||
                    'https://pub.fsgo365.cn/logo_square.png'
                  "
                  class="goods-item-image"
                  :data-event="{ id: 'g4tKnkiuJ1' }"
                />
                <view class="goods-item-view c-flex-around" :data-event="{ id: 'g4tKnkiuJ1' }">
                  <view :data-event="{ id: 'g4tKnkiuJ1' }">
                    <view :data-event="{ id: 'g4tKnkiuJ1' }">{{ item.name || item.content }}</view>
                    <view class="c-flex" v-if="item.desc" :data-event="{ id: 'g4tKnkiuJ1' }">
                      <view
                        class="c-nowrap c-size-14 c-color-value"
                        :data-event="{ id: 'g4tKnkiuJ1' }"
                      >
                        描述：{{ item.desc }}
                      </view>
                      <van-icon
                        name="info-o"
                        color="#106cff"
                        class="c-m-l-5"
                        @click="toViewDescription(item.desc)"
                        :data-event="{ id: 'ommwPDJw08' }"
                      />
                    </view>
                    <text class="desc-tag" :data-event="{ id: 'g4tKnkiuJ1' }">
                      {{ codelabel('packageType', item.type) }}
                    </text>
                    <view class="c-m-t-10" :data-event="{ id: 'g4tKnkiuJ1' }">
                      <van-button
                        v-if="item.procedureList.length > 0"
                        plain
                        hairline
                        type="info"
                        size="mini"
                        @click="openProcedures(item.procedureList)"
                        class="c-m-r-10"
                        :data-event="{ id: 'sGOQ-eD95v' }"
                      >
                        查看工序
                      </van-button>
                      <van-button
                        v-if="item.materialList.length > 0"
                        plain
                        hairline
                        type="info"
                        size="mini"
                        @click="openMaterials(item.materialList)"
                        :data-event="{ id: 'uSX3TDuro4' }"
                      >
                        查看材料
                      </van-button>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </van-tab>
      </van-tabs>
    </van-popup>
    <!-- 添加自定义工作项 -->
    <van-dialog
      use-slot
      title="自定义工作项"
      :show="customShow"
      confirm-button-color="#106cff"
      show-cancel-button
      @confirm="addCustomItemConfirm"
      @cancel="addCustomItemCancel"
      :before-close="beforeItemClose"
      width="90%"
      :data-event="{ id: 'HaWET401IM', capture: false }"
    >
      <van-cell-group>
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.typeName"
          label="工作项名称"
          placeholder="请输入"
          data-key="typeName"
          @change="onEditItemChange"
        />
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.planCount"
          label="计划用量"
          placeholder="请输入"
          data-key="planCount"
          @change="onEditItemChange"
        />
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.optCount"
          label="实际用量"
          placeholder="请输入"
          data-key="optCount"
          @change="onEditItemChange"
        />
        <van-field
          v-if="currentRoleType == '2'"
          :value="editItem.formData.planPrice"
          label="成本单价"
          placeholder="请输入"
          data-key="planPrice"
          @change="onEditItemChange"
          :disabled="formDisable"
        />
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.planMemo"
          label="管家备注"
          type="textarea"
          autosize
          placeholder="请输入"
          data-key="planMemo"
          @change="onEditItemChange"
        />
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.optMemo"
          label="工队备注"
          type="textarea"
          autosize
          placeholder="请输入"
          data-key="optMemo"
          @change="onEditItemChange"
          :border="false"
        />
      </van-cell-group>
    </van-dialog>

    <!-- 展示材料介绍  -->
    <van-dialog
      :title="material.currentName"
      :show="material.openMaterialDetail"
      use-slot
      @confirm="
        material.openMaterialDetail = false;
        $forceUpdate();
      "
      :data-event="{ id: '6Z_BFDdw18', capture: false }"
    >
      <view style="height: 60vh; overflow-y: auto; font-size: 14px; padding: 20rpx">
        <rich-text :nodes="material.currentDetail"></rich-text>
      </view>
    </van-dialog>

    <!-- 编辑工作项 -->
    <van-dialog
      use-slot
      title="编辑工作项"
      :show="editItem.show"
      @confirm="onEditItemConfirm"
      :before-close="beforeItemClose"
      width="90%"
      confirm-button-color="#106cff"
      :data-event="{ id: '6eQKEXRetU', capture: false }"
    >
      <van-cell-group>
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.typeName"
          label="工作项名称"
          placeholder="请输入"
          data-key="typeName"
          @change="onEditItemChange"
        />
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.planCount"
          label="计划用量"
          placeholder="请输入"
          data-key="planCount"
          @change="onEditItemChange"
        />
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.optCount"
          label="实际用量"
          placeholder="请输入"
          data-key="optCount"
          @change="onEditItemChange"
        />
        <van-field
          v-if="currentRoleType == '2'"
          :value="editItem.formData.planPrice"
          label="成本单价"
          placeholder="请输入"
          data-key="planPrice"
          @change="onEditItemChange"
          :disabled="formDisable"
        />
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.planMemo"
          label="管家备注"
          type="textarea"
          autosize
          placeholder="请输入"
          data-key="planMemo"
          @change="onEditItemChange"
        />
        <van-field
          :disabled="formDisable"
          :value="editItem.formData.optMemo"
          label="工队备注"
          type="textarea"
          autosize
          placeholder="请输入"
          data-key="optMemo"
          @change="onEditItemChange"
          :border="false"
        />
      </van-cell-group>
    </van-dialog>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      serviceType: '',
      currentRoleType: '', // 0管家:8050029062726074247 1工队:5424993602217461538 2内勤:7100212906800336051
      options: {
        codecfg_packageType: { codeId: 'packageType' }, // 套餐类型
        codecfg_materialType: { codeId: 'type1' }, // 材料类型
        codecfg_unit: { codeId: 'company' }, // 单位
        codecfg_agelimit: { codeId: 'agelimit' }
      },
      formDisable: false, // 全部表单禁用
      // 顶部表单
      formData: {
        orderId: ''
      },
      // 进场和交付验收日期
      calendarShow: false,
      calendarKey: '',
      minDate: new Date('2023/04/01').getTime(), // 可选择的最小日期
      defaultDate: new Date().getTime(), // 默认选中的日期 昨天
      // 订单数据
      order: {},
      // 所有day
      list: [],
      // 添加工作项类型
      addItemType: {
        show: false,
        dayIndex: null,
        actions: [
          { name: '从订单选择', value: 'order' },
          { name: '从产品中心选择', value: 'product' },
          { name: '自定义', value: 'custom' }
        ]
      },
      /**
       * 从订单添加工作项
       */
      orderShow: false,
      orderList: [],
      addItems: [],
      deleteItems: [],
      /**
       * 从我的产品选择工作项
       */
      productShow: false,
      activeTab: 'material',
      material: {
        searchValue: '',
        data: [],
        openMaterialDetail: false,
        currentName: '',
        currentDetail: '',
        selectAll: false
      },
      procedure: {
        searchValue: '',
        data: [],
        selectAll: false
      },
      measure: {
        searchValue: '',
        data: [],
        selectAll: false
      },
      projPackage: {
        searchValue: '',
        data: [],
        selectAll: false,
        openMaterials: false,
        currentMaterials: [],
        openProcedures: false,
        currentProcedures: []
      },
      /**
       * 添加自定义工作项
       */
      customShow: false,
      /**
       * 添加/编辑工作项
       */
      editItem: {
        show: false,
        formData: {}
      },
      /**
       * 阻止dialog默认关闭
       */
      beforeItemClose(action) {
        return new Promise(resolve => {
          setTimeout(() => {
            if (action === 'confirm') {
              // 拦截确认操作
              resolve(false);
            } else {
              resolve(true);
            }
          }, 0);
        });
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.serviceType = params.serviceType;
    this.formData.orderId = params.orderId;
    let currentRoleId = wx.getStorageSync('currentRole')._id;
    switch (currentRoleId) {
      case '8050029062726074247': // 管家
        this.currentRoleType = '0';
        break;
      case '5424993602217461538': // 工队
        this.currentRoleType = '1';
        break;
      case '7100212906800336051': // 内勤
        this.currentRoleType = '2';
        break;
    }
    common.osg.codeoption();
    this.getOrder();
    this.getCostingEntry();
    this.getMaterials();
    this.getProcedures();
    this.getMeasures();
    this.getProjPackages();
    wx.enableAlertBeforeUnload({
      message: '退出后未保存的内容将会丢失，确认退出吗？'
    });
  },
  methods: {
    toast(msg) {
      common.osg.toast(msg, 'none', 5000);
    },
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    onFieldChange(e) {
      let key = e.target.dataset.key;
      this.$set(this.formData, key, e.detail);
      if (key == 'cosPlanDays' || key == 'cosOptDays') {
        let newDays = Number(e.detail);
        let oldDays = this.list.length;
        if (newDays > oldDays) {
          if (newDays > 30 && oldDays <= 30) {
            common.osg.confirm(`确认计划天数为${newDays}天？`, () => {
              for (let i = 0; i < newDays - oldDays; i++) {
                this.addDay();
              }
            });
          } else {
            for (let i = 0; i < newDays - oldDays; i++) {
              this.addDay();
            }
          }
        }
      }
    },
    formatDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}-${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
    },
    onCalendarDisplay(e) {
      if (this.formDisable || this.currentRoleType != '1') return; // 只允许工队长修改
      this.calendarShow = true;
      this.calendarKey = e.target.dataset.key;
    },
    onCalendarConfirm(e) {
      this.calendarShow = false;
      let key = e.target.dataset.key;
      this.$set(this.formData, this.calendarKey, this.formatDate(e.detail));
    },
    onCalendarClose() {
      this.calendarShow = false;
    },
    addDay(type) {
      this.list.push([]);
      if (type == 'click') {
        if (this.currentRoleType == '0') {
          // 计算计划工期
          this.formData.cosPlanDays = this.list.length;
        } else if (this.currentRoleType == '1') {
          // 计算实际工期
          this.formData.cosOptDays = this.list.length;
        }
      }
    },
    deleteDay(i) {
      common.osg.confirm(`是否确认删除第${i + 1}天所有工作项？`, () => {
        this.list.splice(i, 1);
        if (this.currentRoleType == '0') {
          // 计算计划工期
          this.formData.cosPlanDays = this.list.length;
        } else if (this.currentRoleType == '1') {
          // 计算实际工期
          this.formData.cosOptDays = this.list.length;
        }
        this.calcCost();
      });
    },
    onAddItemTypeSelect(e) {
      if (e.detail.value == 'order') {
        this.orderShow = true;
      } else if (e.detail.value == 'product') {
        this.productShow = true;
      } else {
        this.editItem.formData = {};
        this.customShow = true;
      }
    },
    onAddItemTypeClose() {
      this.addItemType.show = false;
    },
    getOrder() {
      common.osg.ajax(
        'basic/order/query',
        {
          _id: this.formData.orderId,
          notFilterBelongTo: '1',
          notFilterOrgId: '1'
        },
        res => {
          let formData = res.data[0];
          this.order = formData;
          this.formData.cosPlanTotal = formData.cosPlanTotal;
          this.formData.cosOptTotal = formData.cosOptTotal;
          this.formData.cosTotalGap = formData.cosTotalGap;
          this.formData.cosPlanDays = formData.cosPlanDays;
          this.formData.cosOptDays = formData.cosOptDays;
          this.formData.cosStartDate = formData.cosStartDate;
          this.formData.cosEndDate = formData.cosEndDate;

          // 如果今天已经超过交付验收日期，整个单据不允许修改
          if (
            this.formData.cosEndDate &&
            new Date().getTime() > new Date(this.formData.cosEndDate + ' 23:59:59').getTime()
          ) {
            this.formDisable = true;
          }

          if (common.osg.isJson(formData.bjProducts)) {
            let products = JSON.parse(formData.bjProducts);
            products.orderList.map(obj => {
              obj.projPackages.data.map(item => {
                item.checked = false;
              });
              obj.procedures.data.map(item => {
                item.checked = false;
              });
              obj.materials.data.map(item => {
                item.checked = false;
              });
              obj.measures.data.map(item => {
                item.checked = false;
              });
            });
            this.$set(this, 'orderList', products.orderList);
            products.addItems.data.map(item => {
              item.checked = false;
            });
            this.addItems = products.addItems;
            products.deleteItems.data.map(item => {
              item.checked = false;
            });
            this.deleteItems = products.deleteItems;
          }
        }
      );
    },
    // 计算计划成本和实际成本
    calcCost() {
      let cosPlanTotal = 0;
      let cosOptTotal = 0;
      this.list.map(day => {
        day.map(item => {
          cosPlanTotal += Number(item.planPrice || 0) * Number(item.planCount || 0);
          cosOptTotal += Number(item.planPrice || 0) * Number(item.optCount || 0);
        });
      });
      this.formData.cosPlanTotal = common.osg.amountToFixed(cosPlanTotal);
      this.formData.cosOptTotal = common.osg.amountToFixed(cosOptTotal);
      this.formData.cosTotalGap = common.osg.amountToFixed(cosPlanTotal - cosOptTotal);
    },
    getCostingEntry() {
      common.osg.ajax(
        '/costingEntry/query',
        {
          orderId: this.formData.orderId,
          sortField: 'day,order',
          notFilterBelongTo: '1',
          notFilterOrgId: '1'
        },
        res => {
          let list = [];
          // 按天分组、默认order排序
          res.data.map(item => {
            if (!list[item.day]) {
              list[item.day] = [];
            }
            list[item.day].push(item);
          });
          this.list = list;
        }
      );
    },
    toViewDescription(msg) {
      common.osg.toast(msg, 'none', 5000);
    },
    onCheck(e, item) {
      item.checked = e.detail;
    },
    /**
     * private int day;
     * private int order; //排序
     * private String orderId; //订单id
     * private String type; //1报价单条目 2产品中心材料 3产品中心机措 4产品中心套餐 5产品中心工序 0自定义
     * private String typeId;
     * private String typeName; //自定义有名称 无id
     * private double planPrice; //计划 单价
     * private int planCount; //计划 数量
     * private double planTotal; //计划总金额
     * private String planMemo;
     * private double optPrice; //实际 单价
     * private int optCount; //实际 数量
     * private double optTotal; //实际总金额
     * private String optMemo;
     * private double totalGap; //差额 计划总金额-实际总金额 planTotal-optTotal
     * private int createType; //0管家 1工队 2内勤
     */
    addOrderItemConfirm() {
      let items = [];
      for (let i = 0; i < this.orderList.length; i++) {}
      this.orderList.map((obj, i) => {
        obj.projPackages.data.map((item, j) => {
          if (item.checked) {
            items.push({
              day: this.addItemType.dayIndex,
              orderId: this.formData.orderId,
              type: '1',
              typeId: i + '-projPackage-' + j,
              typeName: item.name,
              planPrice: item.serviceCostPrice || 0,
              planCount: item.number,
              unit: item.unit,
              planTotal: item.totalAmount,
              planMemo: '',
              optPrice: 0,
              optCount: 0,
              optTotal: 0,
              optMemo: '',
              totalGap: 0,
              createType: Number(this.currentRoleType) || 0
            });
            item.checked = false;
          }
        });
        obj.procedures.data.map((item, j) => {
          if (item.checked) {
            items.push({
              day: this.addItemType.dayIndex,
              orderId: this.formData.orderId,
              type: '1',
              typeId: i + '-procedure-' + j,
              typeName: item.name,
              planPrice: item.serviceCostPrice || 0,
              planCount: item.number,
              unit: item.unit,
              planTotal: item.totalAmount,
              planMemo: '',
              optPrice: 0,
              optCount: 0,
              optTotal: 0,
              optMemo: '',
              totalGap: 0,
              createType: Number(this.currentRoleType) || 0
            });
            item.checked = false;
          }
        });
        obj.materials.data.map((item, j) => {
          if (item.checked) {
            items.push({
              day: this.addItemType.dayIndex,
              orderId: this.formData.orderId,
              type: '1',
              typeId: i + '-material-' + j,
              typeName: item.name,
              planPrice: item.serviceCostPrice || 0,
              planCount: item.number,
              unit: item.unit,
              planTotal: item.totalAmount,
              planMemo: '',
              optPrice: 0,
              optCount: 0,
              optTotal: 0,
              optMemo: '',
              totalGap: 0,
              createType: Number(this.currentRoleType) || 0
            });
            item.checked = false;
          }
        });
        obj.measures.data.map((item, j) => {
          if (item.checked) {
            items.push({
              day: this.addItemType.dayIndex,
              orderId: this.formData.orderId,
              type: '1',
              typeId: i + '-measure-' + j,
              typeName: item.name,
              planPrice: item.serviceCostPrice || 0,
              planCount: item.number,
              unit: item.unit,
              planTotal: item.totalAmount,
              planMemo: '',
              optPrice: 0,
              optCount: 0,
              optTotal: 0,
              optMemo: '',
              totalGap: 0,
              createType: Number(this.currentRoleType) || 0
            });
            item.checked = false;
          }
        });
      });
      this.addItems.data.map((item, j) => {
        if (item.checked) {
          items.push({
            day: this.addItemType.dayIndex,
            orderId: this.formData.orderId,
            type: '1',
            typeId: 'addItem-' + j,
            typeName: item.name,
            planPrice: item.serviceCostPrice || 0,
            planCount: item.number,
            unit: item.unit,
            planTotal: item.totalAmount,
            planMemo: '',
            optPrice: 0,
            optCount: 0,
            optTotal: 0,
            optMemo: '',
            totalGap: 0,
            createType: Number(this.currentRoleType) || 0
          });
          item.checked = false;
        }
      });
      this.deleteItems.data.map((item, j) => {
        if (item.checked) {
          items.push({
            day: this.addItemType.dayIndex,
            orderId: this.formData.orderId,
            type: '1',
            typeId: 'deleteItem-' + j,
            typeName: item.name,
            planPrice: item.serviceCostPrice || 0,
            planCount: item.number,
            unit: item.unit,
            planTotal: item.totalAmount,
            planMemo: '',
            optPrice: 0,
            optCount: 0,
            optTotal: 0,
            optMemo: '',
            totalGap: 0,
            createType: Number(this.currentRoleType) || 0
          });
          item.checked = false;
        }
      });
      let dayIndex = this.addItemType.dayIndex;
      this.list[dayIndex] = this.list[dayIndex] || [];
      this.list[dayIndex] = this.list[dayIndex].concat(items);
      this.calcCost();
      this.orderShow = false;
    },
    addOrderItemCancel() {
      this.orderShow = false;
    },
    doSave() {
      if (this.currentRoleType == '0') {
        // 管家：计划工期必填
        if (!this.formData.cosPlanDays && this.formData.cosPlanDays != '0') {
          common.osg.toast('请填写计划工期', 'none');
          return;
        }
      }
      let maxDay = 0;
      let params = this.formData;
      params.costingEntryList = [];
      this.list.map((day, index) => {
        day.map((item, j) => {
          item.order = j;
          params.costingEntryList.push(item);
        });
        if (day.length > 0) {
          maxDay = index + 1;
        }
      });
      // 保存时去掉最后没有工作项的天
      if (this.currentRoleType == '0') {
        // 计算计划工期
        this.formData.cosPlanDays = maxDay;
      } else if (this.currentRoleType == '1') {
        // 计算实际工期
        this.formData.cosOptDays = maxDay;
      }
      common.osg.ajax('/costingEntry/totalUpdate', { data: JSON.stringify(params) }, () => {
        common.osg.alert('保存成功', () => {
          this.getOrder();
          this.getCostingEntry();
        });
      });
    },
    /**
     * 从我的产品添加工作项
     */
    tabChange(e) {
      this.activeTab = e.detail.name;
    },
    onSearch(e) {
      this[this.activeTab].searchValue = e.detail;
    },
    onSearchClear() {
      this[this.activeTab].searchValue = '';
    },
    toViewDescription(msg) {
      common.osg.toast(msg, 'none', 5000);
    },
    openProcedures(products) {
      this.projPackage.currentProcedures = products;
      this.projPackage.openProcedures = true;
    },
    openMaterials(materials) {
      this.projPackage.currentMaterials = materials;
      this.projPackage.openMaterials = true;
    },
    openMaterialDetail(name, detail) {
      this.material.currentName = name;
      this.material.currentDetail = detail.replace(/<img /g, '<br><img style="max-width:100%" ');
      this.material.openMaterialDetail = true;
    },
    getMaterials() {
      common.osg.ajax(
        'basic/material/queryWithRank',
        {
          _all: '1',
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.checked = false;
          });
          this.material.data = res.data;
        }
      );
    },
    getProcedures() {
      common.osg.ajax(
        'biz/procedure/queryWithRank',
        {
          _all: '1',
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.checked = false;
          });
          this.procedure.data = res.data;
        }
      );
    },
    getMeasures() {
      common.osg.ajax(
        'biz/measure/queryWithRank',
        {
          _all: '1',
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.checked = false;
          });
          this.measure.data = res.data;
        }
      );
    },
    getProjPackages() {
      common.osg.ajax(
        'biz/projPackage/queryWithRank',
        {
          _all: '1',
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.checked = false;
          });
          this.projPackage.data = res.data;
        }
      );
    },
    /**
     * private int day;
     * private int order; //排序
     * private String orderId; //订单id
     * private String type; //1报价单条目 2产品中心材料 3产品中心机措 4产品中心套餐 5产品中心工序 0自定义
     * private String typeId;
     * private String typeName; //自定义有名称 无id
     * private double planPrice; //计划 单价
     * private int planCount; //计划 数量
     * private double planTotal; //计划总金额
     * private String planMemo;
     * private double optPrice; //实际 单价
     * private int optCount; //实际 数量
     * private double optTotal; //实际总金额
     * private String optMemo;
     * private double totalGap; //差额 计划总金额-实际总金额 planTotal-optTotal
     * private int createType; //0管家 1工队 2内勤
     */
    addProductItemConfirm() {
      let items = [];
      this.material.data.map((item, i) => {
        if (item.checked) {
          items.push({
            day: this.addItemType.dayIndex,
            orderId: this.formData.orderId,
            type: '2',
            typeId: item._id,
            typeName: item.name,
            planPrice: item.serviceCostPrice || 0,
            planCount: 0,
            unit: item.unit,
            planTotal: item.totalAmount,
            planMemo: '',
            optPrice: 0,
            optCount: 0,
            optTotal: 0,
            optMemo: '',
            totalGap: 0,
            createType: Number(this.currentRoleType) || 0
          });
          item.checked = false;
        }
      });
      this.measure.data.map((item, i) => {
        if (item.checked) {
          items.push({
            day: this.addItemType.dayIndex,
            orderId: this.formData.orderId,
            type: '3',
            typeId: item._id,
            typeName: item.name,
            planPrice: item.serviceCostPrice || 0,
            planCount: 0,
            unit: item.unit,
            planTotal: item.totalAmount,
            planMemo: '',
            optPrice: 0,
            optCount: 0,
            optTotal: 0,
            optMemo: '',
            totalGap: 0,
            createType: Number(this.currentRoleType) || 0
          });
          item.checked = false;
        }
      });
      this.projPackage.data.map((item, i) => {
        if (item.checked) {
          items.push({
            day: this.addItemType.dayIndex,
            orderId: this.formData.orderId,
            type: '4',
            typeId: item._id,
            typeName: item.name,
            planPrice: item.serviceCostPrice || 0,
            planCount: 0,
            unit: item.unit,
            planTotal: item.totalAmount,
            planMemo: '',
            optPrice: 0,
            optCount: 0,
            optTotal: 0,
            optMemo: '',
            totalGap: 0,
            createType: Number(this.currentRoleType) || 0
          });
          item.checked = false;
        }
      });
      this.procedure.data.map((item, i) => {
        if (item.checked) {
          items.push({
            day: this.addItemType.dayIndex,
            orderId: this.formData.orderId,
            type: '5',
            typeId: item._id,
            typeName: item.name,
            planPrice: item.serviceCostPrice || 0,
            planCount: 0,
            unit: item.unit,
            planTotal: item.totalAmount,
            planMemo: '',
            optPrice: 0,
            optCount: 0,
            optTotal: 0,
            optMemo: '',
            totalGap: 0,
            createType: Number(this.currentRoleType) || 0
          });
          item.checked = false;
        }
      });
      let dayIndex = this.addItemType.dayIndex;
      this.list[dayIndex] = this.list[dayIndex] || [];
      this.list[dayIndex] = this.list[dayIndex].concat(items);
      this.calcCost();
      this.productShow = false;
    },
    addProductItemCancel() {
      this.productShow = false;
    },
    /**
     * 添加自定义工作项
     */
    addCustomItemConfirm() {
      if (!this.editItem.formData.typeName && this.editItem.formData.typeName != '0') {
        common.osg.toast('请填写工作项名称', 'none');
        return;
      }
      let obj = {
        day: this.addItemType.dayIndex,
        orderId: this.formData.orderId,
        type: '0',
        typeId: '',
        typeName: this.editItem.formData.typeName,
        planPrice: this.editItem.formData.planPrice || 0,
        planCount: this.editItem.formData.planCount || 0,
        unit: this.editItem.formData.unit || '',
        planTotal: this.editItem.formData.planTotal || 0,
        planMemo: this.editItem.formData.planMemo,
        optPrice: 0,
        optCount: this.editItem.formData.optCount || 0,
        optTotal: 0,
        optMemo: this.editItem.formData.optMemo,
        totalGap: 0,
        createType: Number(this.currentRoleType) || 0
      };
      let dayIndex = this.addItemType.dayIndex;
      this.list[dayIndex] = this.list[dayIndex] || [];
      this.list[dayIndex].push(obj);
      this.calcCost();
      this.customShow = false;
    },
    addCustomItemCancel() {
      this.customShow = false;
    },
    /**
     * 新增/编辑工作项
     */
    addItem(i) {
      this.addItemType.dayIndex = i;
      this.addItemType.show = true;
    },
    onEditItemClick(item) {
      this.editItem.formData = item;
      this.editItem.show = true;
    },
    onEditItemChange(e) {
      // if (['planPrice', 'planCount', 'optCount'].indexOf(e.target.dataset.key) != -1 && !e.detail) {
      //   this.editItem.formData[e.target.dataset.key] = 0;
      // } else {
      this.editItem.formData[e.target.dataset.key] = e.detail;
      // }
    },
    onEditItemConfirm() {
      if (!this.editItem.formData.typeName && this.editItem.formData.typeName != '0') {
        common.osg.toast('请填写工作项名称', 'none');
        return;
      }
      this.editItem.formData.planPrice = this.editItem.formData.planPrice || 0;
      this.calcCost();
      this.editItem.show = false;
    },
    onDeleteItem(i, j, typeName) {
      common.osg.confirm(`是否确认删除第${i + 1}天第${j + 1}项：${typeName}？`, () => {
        this.list[i].splice(j, 1);
        this.$forceUpdate();
      });
    }
  }
};
</script>

<style lang="scss">
.profit {
  padding: 0 15px 30px;
  .title {
    color: #333;
    font-size: 15px;
    font-weight: 600;
    line-height: 40px;
  }
  .unit {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
  }
  .info {
    background: #fefefe;
    border-radius: 8px;
    border: 1rpx solid #ebebeb;
    padding: 10px 15px;
    .van-cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 !important;
      line-height: 30px;
      font-size: 14px;
      .label {
        font-size: 14px;
        color: #666666 !important;
      }
      .c-value {
        font-size: 14px;
        color: #323233 !important;
      }
      .value {
        font-size: 14px;
        // color: #333333 !important;
      }
    }
  }
  .day {
    background: #ffffff;
    border-radius: 8px;
    border: 1rpx solid #ebebeb;
    margin-bottom: 10px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      padding-right: 15px;
      .title {
        margin-left: 10px;
        font-size: 14px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 3px;
        height: 15px;
        background: #067cd2;
      }
    }
    .item {
      padding: 0 15px;
      .name {
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        line-height: 37rpx;
      }
      .block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .count {
          flex: 1;
          height: 60px;
          background: #f5f5f5;
          border-radius: 3px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 7px;
          .value {
            font-size: 16px;
            font-weight: 600;
            color: #106cff;
            line-height: 45rpx;
          }
          .label {
            font-size: 12px;
            font-weight: 400;
            color: #333333;
            line-height: 33rpx;
          }
        }
      }
      .remark {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 33rpx;
        padding-bottom: 10px;
        margin-bottom: 10px;
        position: relative;
        &:after {
          position: absolute;
          content: '';
          border-bottom: 2rpx solid #eaeaea;
          width: 200%;
          height: 0;
          bottom: 0;
          left: 0;
          transform: scale(0.5);
          transform-origin: 0 0;
        }
      }
      .last-remark {
        margin-bottom: 0;
        &:after {
          display: none;
        }
      }
    }
    .add-item {
      font-size: 15px;
      font-weight: 500;
      color: #106cff;
      height: 45px;
      line-height: 45px;
      text-align: center;
      position: relative;
      &:before {
        position: absolute;
        content: '';
        border-bottom: 2rpx solid #eaeaea;
        width: 200%;
        height: 0;
        top: 0;
        left: 0;
        transform: scale(0.5);
        transform-origin: 0 0;
      }
    }
  }
  .add-day {
    // width: 100%;
    flex: 1;
    height: 45px;
    line-height: 45px;
    background: #106cff;
    border-radius: 8px;
    border: 1rpx solid #ebebeb;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    color: #ffffff;
    box-sizing: border-box;
  }
  .c-popup-order {
    background: #f9f9f9;
  }
  .c-content {
    flex: 1;
    overflow: auto;
    margin-top: 0;
    height: calc(100% - 142px);
    .c-selection-left {
      height: 100%;
      overflow: auto;
      .c-selection-left-item {
        color: #999;
        font-size: 14px;
      }
    }
  }
  .c-order {
    margin: 15px;
    border-radius: 8px;
    overflow: hidden;
  }

  .c-order-top {
    background: #fff;
    padding: 10px;
  }
  .c-selected {
    background: #fff;
    margin: 15px;
    border-radius: 8px;
    overflow: hidden;
    .c-selected-title {
      padding: 10px;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .c-selected-items {
      background-color: #fff;
      .c-selected-item {
        // border-bottom: 1px solid #f2f2f2;
        padding: 20rpx 20rpx 20rpx 0 !important;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .c-orders-selected {
    margin: 0;
    border-radius: 0;
    // border-top: 1px solid #f2f2f2;
    .c-selected-title {
      border-top: 1px solid #f2f2f2;
      border-bottom: none;
    }
    .c-selected-item {
      border-bottom: none !important;
      flex: 1;
      overflow: hidden;
    }
  }
  .c-selection-right-item {
    background-color: #fff;
    margin: 10px;
    padding-right: 20rpx !important;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
  .c-images {
    border-radius: 8px;
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
    font-size: 10px;
    display: inline-flex;
    background-color: rgb(241, 241, 241);
    padding: 4rpx 8rpx;
    border-radius: 3px;
    color: #999;
  }
  .input-class {
    background-color: #fff;
  }
  .plus-class {
    border-radius: 50%;
    overflow: hidden;
    color: #999;
    background: #f3bb62;
  }
  .minus-class {
    border-radius: 50%;
    overflow: hidden;
    color: #999;
    background-color: #f7f8fa;
  }
  .c-plus {
    background: #f3bb62;
    border-radius: 50%;
    font-size: 11px;
    width: 24px;
    height: 24px;
    margin: 1px;
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
  .c-product-tabs {
    height: 100%;
    .goods {
      height: 100%;
      overflow-y: auto;
      .goods-item {
        display: flex;
        align-items: center;
        width: calc(100% - 30px);
        margin: 15px;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 8px;
        background-color: #fff;
        .goods-item-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          margin-right: 10px;
        }
        .goods-item-view {
          flex: 1;
          min-height: 80px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .desc-tag {
            margin: 6px 6px 0 0;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 11px;
            display: inline-flex;
            border: 1px solid #ebedf0;
            color: #646566;
          }
        }
      }
    }
  }
}
</style>
