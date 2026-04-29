<template>
  <view class="order" style="padding-bottom: 200rpx" @click.capture="track">
    <view class="c-card">
      <view class="c-card-title">
        <view
          class="c-card-tag-default"
          @click.native.stop="copy(formData._id)"
          :data-event="{ id: '3VV8HHFiS3' }"
        >
          <text :data-event="{ id: '3VV8HHFiS3' }">{{ formData._id || '' }}</text>
          <text class="c-size-13 c-weight-normar" :data-event="{ id: '3VV8HHFiS3' }">丨复制</text>
        </view>
        <view class="c-red">
          {{ codelabel('payState', String(formData.payState)) || '' }}
        </view>
      </view>
      <view class="c-card-content">
        <view class="c-card-content-item" v-if="type == 1">
          <view class="c-card-content-item-label">客户姓名：</view>
          <view>{{ formData.ownerName || '' }}</view>
        </view>
        <view class="c-card-content-item" v-if="type == 1">
          <view class="c-card-content-item-label">客户手机：</view>
          <view>
            {{ formData.ownerPhone || '' }}
          </view>
        </view>
        <view class="c-card-content-item">
          <view class="c-card-content-item-label">产品总额：</view>
          <view>¥ {{ formData.originPrice || 0 }}</view>
        </view>
        <view class="c-card-content-item" v-if="formData.otherAmount">
          <view class="c-card-content-item-label">其他费用：</view>
          <view>¥ {{ formData.otherAmount }}</view>
        </view>
        <view class="c-card-content-item" v-if="formData.discount != 1">
          <view class="c-card-content-item-label">折扣金额：</view>
          <view>
            ¥ -{{
              amountToFixed(
                formData.originPrice - amountToFixed(formData.originPrice * formData.discount)
              )
            }}
          </view>
        </view>
        <view class="c-card-content-item" v-if="formData.preferentialAmount">
          <view class="c-card-content-item-label">优惠金额：</view>
          <view>¥ -{{ formData.preferentialAmount }}</view>
        </view>
        <view class="c-card-content-item">
          <view class="c-card-content-item-label">合计金额：</view>
          <view class="c-red">¥ {{ formData.totalPrice || 0 }}</view>
        </view>
        <view class="c-card-content-item">
          <view class="c-card-content-item-label">下单时间：</view>
          <view>{{ formData.createTime || '' }}</view>
        </view>
      </view>
    </view>
    <!-- 旧版订单 -->
    <view class="detail" v-if="formData.productIds && formData.productIds.length > 0">
      <view
        class="c-flex c-flex-between c-item-center"
        v-if="formData.productIds && formData.productIds.length > 0"
      >
        <view class="c-flex c-item-center c-m-b-5 c-bold">
          <view class="tips"></view>
          初始订单
        </view>
        <view class="c-flex" @tap="originalOrderSwitchShow">
          初始订单内容
          <van-icon :name="originalOrderShow ? 'arrow-up' : 'arrow-down'"></van-icon>
        </view>
      </view>
      <view class="detail-wrapper" v-if="originalOrderShow">
        <view class="detail">
          <view class="c-flex c-flex-between c-item-center">
            <view class="c-flex c-item-center c-m-b-5 c-bold">
              <view class="tips"></view>
              产品价格
            </view>
            <view class="c-flex" @tap="productSwitchShow">
              产品内容
              <van-icon :name="productShow ? 'arrow-up' : 'arrow-down'"></van-icon>
            </view>
          </view>
          <view style="margin-left: 26rpx">
            <block v-for="(item, index) in originalOrder.productsDetail" :key="index">
              <block v-if="productShow">
                <view class="c-p-10">
                  <view
                    class="c-flex c-item-center"
                    @click="changeProcedures(true, item)"
                    :data-event="{ id: 'nhgsRjKGrI' }"
                  >
                    {{ item.product.name }}
                    <van-icon
                      custom-class="c-m-l-10"
                      :name="item.proceduresActive ? 'arrow-up' : 'arrow-down'"
                      :data-event="{ id: 'nhgsRjKGrI' }"
                    ></van-icon>
                  </view>
                  <view v-if="item.proceduresActive" style="color: #999; font-size: 22rpx">
                    <!-- 服务工序列表 -->
                    <view
                      class="c-flex c-flex-between c-m-l-10"
                      v-if="item.proceduresList && item.proceduresList.length"
                    >
                      <view class="procedures-notLast" style="flex: 3">
                        <view v-for="(pItem, i) in item.proceduresList" :key="i">
                          {{ pItem.name }}
                        </view>
                      </view>
                    </view>
                    <view style="color: #ccc" v-else>暂无工序</view>
                  </view>
                  <view>{{ item.product.description }}</view>
                  <view class="c-flex c-flex-between">
                    <view>
                      <text class="c-red">¥{{ item.product.price }}</text>
                      <text>/{{ codelabel('unit', item.product.unit) }}</text>
                    </view>
                    <view>× {{ item.number }}</view>
                  </view>
                </view>
                <view
                  style="background: #f2f2f2; padding: 10rpx; border-radius: 14rpx"
                  v-if="false && item.product.materials && item.product.materials.length"
                >
                  <block v-for="(material, mIndex) in item.product.materials" :key="mIndex">
                    <view class="c-p-10">
                      <view>{{ material.material.name }}</view>
                      <view class="c-flex c-flex-between">
                        <view>
                          <text></text>
                          材料合计：
                          <text class="c-red">
                            ¥{{
                              amountToFixed(
                                amountToFixed(material.material.price) *
                                  amountToFixed(material.consumption)
                              )
                            }}
                          </text>
                          <text>/{{ codelabel('unit', material.material.materialUnit) }}</text>
                        </view>
                      </view>
                      <view class="c-flex c-flex-between">
                        <text>材料消耗量：</text>
                        <view v-show="material.consumption">
                          {{ material.consumption }}
                        </view>
                      </view>
                      <view class="c-flex c-flex-between">
                        <text>材料单价：</text>
                        <view v-show="material.material.price || material.material.price == 0">
                          ¥ {{ material.material.price }}
                        </view>
                      </view>
                      <view class="c-flex c-flex-between">
                        <text style="min-width: 150rpx">规格：</text>
                        <view>
                          {{ material.material.spec || ''
                          }}{{
                            material.material.specUnit
                              ? codelabel('unit', material.material.specUnit)
                              : ''
                          }}
                        </view>
                      </view>
                    </view>
                  </block>
                </view>
              </block>
            </block>
          </view>
        </view>
      </view>
    </view>

    <!-- 多部位订单 -->
    <view class="c-content" v-if="orderListShow">
      <view class="c-order" v-for="(order, i) in orderList" :key="i">
        <view class="c-order-top">
          <view
            v-if="serviceType == '11' || serviceType == '12'"
            class="c-flex c-flex-between c-item-center"
          >
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
            <block v-for="(item, index) in order.projPackages.data" :key="index">
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
                      :data-event="{ id: '-SHpR2iUn8' }"
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
                      :data-event="{ id: 'upY48tTLsS' }"
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
                      :data-event="{ id: 'VAoxaU4ZvX' }"
                    >
                      查看材料
                    </van-button>
                  </view>
                </view>
                <view class="c-flex c-flex-between c-flex-center">
                  <view>
                    <text class="c-red c-bold">¥{{ item.amount || item.price }}</text>
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
            </block>
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
            <block v-for="(item, index) in order.procedures.data" :key="index">
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
                      :data-event="{ id: 'JYFL4kTdhC' }"
                    />
                  </view>
                  <text
                    class="desc-tag c-m-l-0"
                    v-if="
                      item.currentMinimumGuideTotalPrice || item.currentMinimumGuideTotalPrice === 0
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
            </block>
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
            <block v-for="(item, index) in order.materials.data" :key="index">
              <view :data-item="item" :data-index="index" class="c-selected-item">
                <view>{{ item.name }}</view>
                <view class="c-flex">
                  <van-image
                    v-if="item.images.length > 0"
                    fit="widthFix"
                    width="80"
                    height="80"
                    :src="item.images[0].url"
                    style="margin-top: 10rpx; display: flex; overflow: hidden"
                    image-class="c-images"
                    @click="previewImage(item.images[0].url)"
                    :data-event="{ id: 'zDo1-ehh4r' }"
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
                          :data-event="{ id: 'T97VLkDQOX' }"
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
            </block>
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
            <block v-for="(item, index) in order.measures.data" :key="index">
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
                      :data-event="{ id: 'SS7CK0skWu' }"
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
            </block>
          </view>
        </view>
      </view>
    </view>

    <!-- 新版单部位订单 套餐、工序、材料、机措-->
    <view class="c-content" v-else>
      <!-- 套餐 -->
      <view class="c-selected" v-if="projPackages.data.length">
        <view class="c-selected-title">
          <text>套餐</text>
          <text class="c-size-13">
            分类合计：
            <text class="c-red">¥{{ projPackages.totalAmount }}</text>
          </text>
        </view>
        <view class="c-selected-items">
          <block v-for="(item, index) in projPackages.data" :key="index">
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
                    :data-event="{ id: 'rc9Z76ygHe' }"
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
                    :data-event="{ id: 'ptGZS2NaKF' }"
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
                    :data-event="{ id: 'aZ_7grdePQ' }"
                  >
                    查看材料
                  </van-button>
                </view>
              </view>
              <view class="c-flex c-flex-between c-flex-center">
                <view>
                  <text class="c-red c-bold">¥{{ item.amount || item.price }}</text>
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
          </block>
        </view>
      </view>
      <!-- 工序 -->
      <view class="c-selected" v-if="procedures.data.length">
        <view class="c-selected-title">
          <text>工序</text>
          <text class="c-size-13">
            分类合计：
            <text class="c-red">¥{{ procedures.totalAmount }}</text>
          </text>
        </view>
        <view class="c-selected-items">
          <block v-for="(item, index) in procedures.data" :key="index">
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
                    :data-event="{ id: 'm6MFA1Y4GR' }"
                  />
                </view>
                <text
                  class="desc-tag c-m-l-0"
                  v-if="
                    item.currentMinimumGuideTotalPrice || item.currentMinimumGuideTotalPrice === 0
                  "
                >
                  最低起算价：¥{{ item.currentMinimumGuideTotalPrice }}
                </text>
              </view>
              <view class="c-flex c-flex-between c-flex-center">
                <view>
                  <text class="c-red c-bold">¥{{ item.currentGuideUnitPrice }}</text>
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
          </block>
        </view>
      </view>
      <!-- 材料 -->
      <view class="c-selected" v-if="materials.data.length">
        <view class="c-selected-title">
          <text>材料</text>
          <text class="c-size-13">
            分类合计：
            <text class="c-red">¥{{ materials.totalAmount }}</text>
          </text>
        </view>
        <view class="c-selected-items">
          <block v-for="(item, index) in materials.data" :key="index">
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
                  :data-event="{ id: 'vH8tIW02KP' }"
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
                        :data-event="{ id: 'dJCWKSGoJI' }"
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
          </block>
        </view>
      </view>
      <!-- 机措 -->
      <view class="c-selected" v-if="measures.data.length">
        <view class="c-selected-title">
          <text>机措</text>
          <text class="c-size-13">
            分类合计：
            <text class="c-red">¥{{ measures.totalAmount }}</text>
          </text>
        </view>
        <view class="c-selected-items">
          <block v-for="(item, index) in measures.data" :key="index">
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
                    :data-event="{ id: '97xcbFfkcT' }"
                  />
                </view>
              </view>
              <view class="c-flex c-flex-between c-flex-center">
                <view>
                  <text class="c-red c-bold">¥{{ item.currentGuideUnitPrice }}</text>
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
          </block>
        </view>
      </view>
    </view>

    <!-- 展示套餐工序  -->
    <van-dialog
      title="套餐包含的工序"
      :show="projPackages.openProcedures"
      use-slot
      @confirm="
        projPackages.openProcedures = false;
        $forceUpdate();
      "
      :data-event="{ id: 'HqIy93cE3K', capture: false }"
    >
      <view class="dialog-detail" v-for="(item, i) in projPackages.currentProcedures" :key="i">
        <view>服务内容：{{ item.procedure.content }}</view>
        <view
          v-if="
            item.procedure.minimumGuideTotalPrice || item.procedure.minimumGuideTotalPrice === 0
          "
        >
          最低起算价：¥{{ item.procedure.minimumGuideTotalPrice }}
        </view>
      </view>
    </van-dialog>

    <!-- 展示套餐材料  -->
    <van-dialog
      title="套餐包含的材料"
      :show="projPackages.openMaterials"
      use-slot
      @confirm="
        projPackages.openMaterials = false;
        $forceUpdate();
      "
      :data-event="{ id: 'hF6XXXpXMQ', capture: false }"
    >
      <view class="dialog-detail" v-for="(item, i) in projPackages.currentMaterials" :key="i">
        <view>名称：{{ item.material.name }}</view>
        <view>
          <view>类型：{{ codelabel('materialType', String(item.material.type)) }}</view>
          <view>品牌：{{ item.material.brand || '' }}</view>
        </view>
        <view>
          <view>编号：{{ item.material.code || '' }}</view>

          <view>型号：{{ item.material.model || '' }}</view>
        </view>
        <view>
          <view>
            规格：{{ item.material.spec || ''
            }}{{ item.material.specUnit ? codelabel('unit', item.material.specUnit) : '' }}
          </view>
          <view>
            单价： ¥{{ item.exts.price || '' }}/{{
              item.material.materialUnit ? codelabel('unit', item.material.materialUnit) : ''
            }}
          </view>
        </view>
      </view>
    </van-dialog>

    <!-- 展示材料介绍  -->
    <van-dialog
      :title="materials.currentName"
      :show="materials.openMaterialDetail"
      use-slot
      @confirm="
        materials.openMaterialDetail = false;
        $forceUpdate();
      "
      :data-event="{ id: 'z5Cfkw3lto', capture: false }"
    >
      <view style="height: 60vh; overflow-y: auto; font-size: 14px; padding: 20rpx">
        <rich-text :nodes="materials.currentDetail"></rich-text>
      </view>
    </van-dialog>

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
        <block v-for="(item, index) in addItems.data" :key="index">
          <view :data-item="item" :data-index="index" class="c-selected-item">
            <van-field
              :value="item.name"
              placeholder="请输入自定义增项名称"
              size="small"
              class="customItem-input"
              custom-style="padding-top:0;font-size:12px;"
              disabled
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
        </block>
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
        <block v-for="(item, index) in deleteItems.data" :key="index">
          <view :data-item="item" :data-index="index" class="c-selected-item">
            <van-field
              :value="item.name"
              placeholder="请输入自定义减项名称"
              class="customItem-input"
              custom-style="padding-top:0;font-size:12px;"
              disabled
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
        </block>
      </view>
    </view>

    <view class="detail" v-if="newOrder.productsDetail.length">
      <view class="c-flex c-flex-between c-item-center">
        <view class="c-flex c-item-center c-m-b-5 c-bold">
          <view class="tips"></view>
          增减项订单
        </view>
        <view class="c-flex" @tap="newOrderSwitchShow">
          增减项订单内容
          <van-icon :name="newOrderShow ? 'arrow-up' : 'arrow-down'"></van-icon>
        </view>
      </view>
      <view class="detail-wrapper" v-if="newOrderShow">
        <view class="detail">
          <view class="c-flex c-flex-between c-item-center">
            <view class="c-flex c-item-center c-m-b-5 c-bold">
              <view class="tips"></view>
              产品价格
            </view>
            <view class="c-flex" @tap="newProductSwitchShow">
              产品内容
              <van-icon :name="newProductShow ? 'arrow-up' : 'arrow-down'"></van-icon>
            </view>
          </view>
          <view style="margin-left: 26rpx">
            <block
              v-for="(item, index) in newOrder.productsDetail"
              :key="index"
              v-if="newProductShow"
            >
              <view class="c-p-10">
                <view>{{ item.product.name }}</view>
                <view>{{ item.product.description }}</view>
                <view class="c-flex c-flex-between">
                  <view>
                    <text class="c-red">¥{{ item.product.price }}</text>
                    <text>/{{ codelabel('unit', item.product.unit) }}</text>
                  </view>
                  <view>× {{ item.number }}</view>
                </view>
              </view>
              <view
                style="background: #f2f2f2; padding: 10rpx; border-radius: 14rpx"
                v-if="false && item.product.materials && item.product.materials.length"
              >
                <block v-for="(material, mIndex) in item.product.materials" :key="mIndex">
                  <view class="c-p-10">
                    <view>{{ material.material.name }}</view>
                    <view class="c-flex c-flex-between">
                      <view>
                        <text></text>
                        材料合计：
                        <text class="c-red">
                          ¥{{
                            amountToFixed(
                              amountToFixed(material.material.price) *
                                amountToFixed(material.consumption)
                            )
                          }}
                        </text>
                        <text>/{{ codelabel('unit', material.material.materialUnit) }}</text>
                      </view>
                    </view>
                    <view class="c-flex c-flex-between">
                      <text>材料消耗量：</text>
                      <view v-show="material.consumption">
                        {{ material.consumption }}
                      </view>
                    </view>
                    <view class="c-flex c-flex-between">
                      <text>材料单价：</text>
                      <view v-show="material.material.price || material.material.price == 0">
                        ¥ {{ material.material.price }}
                      </view>
                    </view>
                    <view class="c-flex c-flex-between">
                      <text style="min-width: 150rpx">规格：</text>
                      <view>
                        {{ material.material.spec || ''
                        }}{{ codelabel('unit', material.material.specUnit) }}
                      </view>
                    </view>
                  </view>
                </block>
              </view>
            </block>
          </view>
        </view>
      </view>
    </view>
    <!-- //processState 订单进展状态 0:未开工;1:待开工;2:已开工;3:已完工 -->
    <view
      class="c-button-group-bottom"
      v-if="isEdit && !(formData.type == 0) && !(formData.processState == 3)"
    >
      <van-button
        v-if="formData.payState == 0 && !formData.contractId"
        icon="delete-o"
        plain
        block
        class="c-button-group-item"
        :data-subflow="subflow"
        @click="cancelWorkflow"
        :data-event="{ id: 'CUmX7G9jWS' }"
      >
        取消
      </van-button>
      <van-button
        v-if="
          formData.type == 1 &&
          (formData.exts.isAgain == 1 || !formData.contractId) &&
          (formData.processState == '0' || formData.processState == '4') &&
          !formData.exts.confirm
        "
        type="info"
        icon="edit"
        block
        class="c-button-group-item c-m-l-20"
        @click="openPlaceOrder(1)"
        :data-event="{ id: 'GKrN-P2yI6' }"
      >
        编辑
      </van-button>
    </view>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </view>
</template>
<script>
const app = getApp();
let common = require('../../resources/js/common.js');
import Toast from '../../wxcomponents/vant/toast/toast';
export default {
  data() {
    return {
      type: '', // 0:报价单 1:订单
      extFields: [],
      fields: {},
      formData: {},
      options: {
        codecfg_payState: {
          codeId: 'PAYSTATE'
        },
        codecfg_packageType: { codeId: 'packageType' }, // 套餐类型
        codecfg_materialType: { codeId: 'type1' }, // 材料类型
        codecfg_repairPartsOne: { codeId: 'repairPartsOne' }, // 维修部位一级
        codecfg_unit: { codeId: 'company' }, // 单位
        codecfg_agelimit: { codeId: 'agelimit' }
      },
      originalOrderShow: true, //初始订单
      productShow: true, //原-产品
      materialShow: true, //原-材料
      newOrderShow: true, //增减项的订单
      newProductShow: true, //增减项-产品
      newMaterialShow: true, //增减项-材料
      originalOrder: { productsDetail: [] },
      newOrder: { productsDetail: [] },
      // userId:""
      isEdit: false,
      orderList: [],
      orderListShow: true,
      projPackages: {
        data: [],
        totalAmount: 0,
        openMaterials: false,
        currentMaterials: [],
        openProcedures: false,
        currentProcedures: []
      }, // 套餐
      procedures: { data: [], totalAmount: 0 }, // 工序
      materials: {
        data: [],
        totalAmount: 0,
        openMaterialDetail: false,
        currentName: '',
        currentDetail: ''
      }, // 材料
      measures: { data: [], totalAmount: 0 }, // 机措
      addItems: {
        data: [],
        totalAmount: 0
      },
      deleteItems: {
        data: [],
        totalAmount: 0
      },
      serviceType: ''
    };
  },
  methods: {
    onLoad: function (param) {
      common.osg.init(this, param, app);
      this.id = common.osg.param('id');
      this.type = common.osg.param('type');
      this.isEdit = common.osg.param('isEdit');
      this.serviceType = common.osg.param('serviceType');
      if (this.type == '0') {
        uni.setNavigationBarTitle({
          title: '报价单详情'
        });
      } else {
        uni.setNavigationBarTitle({
          title: '订单详情'
        });
      }
    },
    onShow: function (param) {
      common.osg.codeoption(() => {
        this.getData();
      });
    },
    getData: function () {
      common.osg.ajax(
        'basic/order/query',
        {
          _id: this.id,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          let formData = res.data[0];
          if (common.osg.isJson(formData.bjProducts)) {
            let products = JSON.parse(formData.bjProducts);

            if (products.orderList) {
              this.orderList = products.orderList;
              this.orderListShow = true;
            } else {
              this.orderListShow = false;
              this.projPackages = products.projPackages;
              this.procedures = products.procedures;
              this.materials = products.materials;
              this.measures = products.measures;
            }

            this.addItems = products.addItems;
            this.deleteItems = products.deleteItems;
            if (common.osg.isJson(formData.productIds)) {
              formData.productIds = JSON.parse(formData.productIds);
            }
          } else if (common.osg.isJson(formData.productIds)) {
            formData.productIds = JSON.parse(formData.productIds);
            this.originalOrder = {
              productIds: [],
              productsDetail: [],
              materialDetail: []
            };
            this.newOrder = {
              productIds: [],
              productsDetail: [],
              materialDetail: []
            };
            formData.productsDetail.forEach(item => {
              console.log(item);
              if (Array.isArray(item.product.materials)) {
                //材料总计，将材料总计加到产品金额上
                let totalMaterials = item.product.materials
                  .map(mItem => {
                    return this.amountToFixed(
                      this.amountToFixed(mItem.material.price) *
                        this.amountToFixed(mItem.consumption)
                    );
                  })
                  .reduce((q, n) => q + n, 0);
                item.product.price =
                  this.amountToFixed(item.product.price) + this.amountToFixed(totalMaterials);
              }
              if (item.product.exts && item.product.exts.laterItem) {
                this.newOrder.productsDetail.push(item);
              } else {
                this.originalOrder.productsDetail.push(item);
              }
            });
          }
          this.setData({
            formData: formData
          });
        }
      );
    },
    //进入下单页面
    openPlaceOrder(state) {
      if (state == '2') {
        common.osg.alert('合同已签署，请下新的订单！');
      } else if (state == '3') {
        common.osg.alert('合同已签署，请先取消合同后再编辑订单！');
      } else if (this.formData.exts.isAgain != 1 && this.formData.contractId) {
        //如果契约锁平台签约失败了，可以编辑订单formDat
        common.osg.alert('合同已签署，请先取消合同后再编辑订单！');
      } else {
        // common.osg.confirm('修改订单后，需业主同意废弃合同，再次签署新合同！', () => {
        common.osg.confirm('确定编辑订单吗？', () => {
          let path = '../order/placeOrders';
          common.osg.open(path, {
            editType: state, //修改订单的类型，1编辑，2增项，3减项
            orderId: this.formData._id,
            id: this.formData.serviceAppointmentId,
            workflowFormDefId: this.formData.workflowId, //小流程的定义id
            orphanId:
              this.formData.exts && this.formData.exts.orphanId ? this.formData.exts.orphanId : '', //下单业务节点的数据id
            serviceType: this.serviceType,
            sourceType: this.formData.exts ? this.formData.exts.sourceType : ''
          });
        });
      }
    },
    //原产品缩放展开
    productSwitchShow() {
      if (this.productShow) {
        this.setData({
          productShow: false
        });
      } else {
        this.setData({
          productShow: true
        });
      }
    },
    //原材料缩放展开
    materialSwitchShow() {
      if (this.materialShow) {
        this.setData({
          materialShow: false
        });
      } else {
        this.setData({
          materialShow: true
        });
      }
    },
    //初始订单缩放展开
    originalOrderSwitchShow() {
      if (this.originalOrderShow) {
        this.setData({
          originalOrderShow: false
        });
      } else {
        this.setData({
          originalOrderShow: true
        });
      }
    },
    //新订单缩放展开
    newOrderSwitchShow() {
      if (this.newOrderShow) {
        this.setData({
          newOrderShow: false
        });
      } else {
        this.setData({
          newOrderShow: true
        });
      }
    },
    //新订单产品缩放展开
    newProductSwitchShow() {
      if (this.newProductShow) {
        this.setData({
          newProductShow: false
        });
      } else {
        this.setData({
          newProductShow: true
        });
      }
    },
    //新订单材料缩放展开
    newMaterialSwitchShow() {
      if (this.newMaterialShow) {
        this.setData({
          newMaterialShow: false
        });
      } else {
        this.setData({
          newMaterialShow: true
        });
      }
    },
    //保留两位小数的金额
    amountToFixed(money) {
      if (!money) return 0;
      let resultAmount = +(+money).toFixed(2);
      return resultAmount ? resultAmount : 0;
    },
    /**
     * 取消工作流
     */
    cancelWorkflow(subflow) {
      if (this.formData.contractId) {
        common.osg.alert('请先取消合同后再取消订单！');
      } else {
        common.osg.confirm('是否确认取消订单？', () => {
          let params = {
            // workflowId: this.formData.workflowId,
            // smodule: 'serviceAppointment',
            // sid: this.formData.serviceAppointmentId
            id: this.formData._id
          };
          if (this.formData.exts.coupons) this.activateCoupons(this.formData.exts.coupons); //激活优惠券，取消订单把已使用的优惠券激活
          common.osg.ajax('basic/order/cancelById', params, res => {
            common.osg.alert('操作成功！', () => {
              this.$forceUpdate();
              common.osg.closeMe();
            });
          });
        });
      }
    },
    //激活优惠券
    activateCoupons(couponsId) {
      common.osg.ajax('basic/couponPrinting/activation/' + couponsId, {}, res => {});
    },
    //工序的折叠面板
    changeProcedures(event, row) {
      if (row.proceduresActive) {
        row.proceduresActive = false;
      } else {
        row.proceduresActive = true;
        if (row.product.procedures) {
          let showProcedureIds = []; //只有配置了show才会显示工艺
          for (let pItem of row.product.procedures) {
            if (pItem.show) showProcedureIds.push(pItem.procedureId);
          }
          let pIds = row.product.procedures.map(item => item.procedureId);
          if (pIds && pIds.length) {
            //获取工艺
            this.getAddedProcedures(pIds, res => {
              row.proceduresList = res.data.filter(item => showProcedureIds.includes(item._id));
              this.$forceUpdate();
            });
          }
        }
      }
      this.$forceUpdate();
    },
    //获取工序列表
    getAddedProcedures(ids, callback) {
      common.osg.ajax(
        'biz/extForm/query/6192129160179695921.do',
        {
          _all: '1',
          'in:_id|array#and': ids.toString()
        },
        res => {
          if (callback) callback(res);
        },
        {
          noload: true
        }
      );
    },
    openProcedures(products) {
      this.projPackages.currentProcedures = products;
      this.projPackages.openProcedures = true;
      this.$forceUpdate();
    },
    openMaterials(materials) {
      this.projPackages.currentMaterials = materials;
      this.projPackages.openMaterials = true;
      this.$forceUpdate();
    },
    openMaterialDetail(name, detail) {
      this.materials.currentName = name;
      this.materials.currentDetail = detail.replace(/<img /g, '<br><img style="max-width:100%" ');
      this.materials.openMaterialDetail = true;
      this.$forceUpdate();
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
    toViewDescription(msg) {
      Toast({ message: msg, duration: 5000 });
    },
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    }
  }
};
</script>
<style lang="scss">
.order {
  .detail {
    border-radius: 5px;
    margin: 10px;
  }
  .c-button-group-bottom {
    z-index: 2;
  }
  .c-cell-gap {
    background-color: #f0f3f6 !important;
  }
  .customItem-input {
    .van-cell::after {
      display: none;
    }
  }
  .c-content {
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
    margin: 10px;
    border-radius: 5px;
    overflow: hidden;
  }

  .c-order-top {
    background: #fff;
    padding: 10px;
  }
  .c-selected {
    background: #fff;
    margin: 10px;
    border-radius: 5px;
    overflow: hidden;
    .c-selected-title {
      padding: 5px;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .c-selected-items {
      background-color: #fff;
      .c-selected-item {
        border-bottom: 1px solid #f2f2f2;
        padding: 20rpx !important;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .c-orders-selected {
    margin: 0;
    border-radius: 0;
    border-top: 1px solid #f2f2f2;
    .c-selected-title {
      border-top: 1px solid #f2f2f2;
      border-bottom: none;
    }
    .c-selected-item {
      border-bottom: none !important;
    }
  }
  .c-selection-right-item {
    background-color: #fff;
    margin: 10px;
    padding-right: 20rpx !important;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
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
}
</style>
