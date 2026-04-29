<template>
  <view class="products" @click.capture="track">
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
      :active="activeTab"
      @change="tabChange"
      custom-class="c-tabs"
      style="flex: 1; overflow: hidden"
      :data-event="{ id: '_4mJTlzQFS', capture: false }"
    >
      <van-tab title="材料" name="material">
        <view class="goods" :data-event="{ id: '_4mJTlzQFS' }">
          <block v-for="(item, i) in material.data" :key="i">
            <view
              class="goods-item"
              v-if="
                material.searchValue
                  ? item.name.toLowerCase().indexOf(material.searchValue.toLowerCase()) != -1
                  : true
              "
              :data-event="{ id: '_4mJTlzQFS' }"
            >
              <image
                :src="
                  (item.images && JSON.parse(item.images)[0].url) ||
                  'https://pub.fsgo365.cn/logo_square.png'
                "
                class="goods-item-image"
                :data-event="{ id: '_4mJTlzQFS' }"
              />
              <view class="goods-item-view c-flex-around" :data-event="{ id: '_4mJTlzQFS' }">
                <view :data-event="{ id: '_4mJTlzQFS' }">
                  <view :data-event="{ id: '_4mJTlzQFS' }">{{ item.name }}</view>
                  <view :data-event="{ id: '_4mJTlzQFS' }">
                    <text
                      class="desc-tag"
                      v-if="item.desc"
                      @click="openMaterialDetail(item.name, item.desc)"
                      style="border: 1px solid #106cff; color: #106cff"
                      :data-event="{ id: 'VWX8VPlagF' }"
                    >
                      材料介绍
                    </text>
                    <text class="desc-tag" v-if="item.brand" :data-event="{ id: '_4mJTlzQFS' }">
                      品牌：{{ codelabel('brand', item.brand) }}
                    </text>
                    <!-- <text
                      class="desc-tag"
                      v-if="item.sourceTypeList && item.sourceTypeList.length > 0" :data-event="{id:'_4mJTlzQFS'}">
                      面向客户：{{ codelabelForArray('sourceType', item.sourceTypeList) }}
                    </text> -->
                    <text class="desc-tag" v-if="item.spec" :data-event="{ id: '_4mJTlzQFS' }">
                      规格：{{ item.spec || ''
                      }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
                    </text>
                  </view>
                  <view
                    class="c-flex c-flex-between c-item-center c-m-t-20"
                    :data-event="{ id: '_4mJTlzQFS' }"
                  >
                    <view class="c-flex c-item-center" :data-event="{ id: '_4mJTlzQFS' }">
                      <text
                        v-if="item.price || item.price == 0"
                        class="c-red c-bold"
                        :data-event="{ id: '_4mJTlzQFS' }"
                      >
                        ¥ {{ item.price }}
                      </text>
                      <text
                        v-if="(item.price || item.price == 0) && item.materialUnit"
                        class="c-size-10 c-m-l-10"
                        :data-event="{ id: '_4mJTlzQFS' }"
                      >
                        / {{ item.materialUnit ? codelabel('unit', item.materialUnit) : '' }}
                      </text>
                    </view>
                    <van-button
                      round
                      size="mini"
                      class="c-rt c-flex"
                      @click="doOpen('./product', { type: 'material', id: item._id })"
                      :data-event="{ id: 'RrsvK81fCn' }"
                    >
                      编辑
                    </van-button>
                  </view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </van-tab>
      <van-tab title="工序" name="procedure">
        <view class="goods" :data-event="{ id: '_4mJTlzQFS' }">
          <block v-for="(item, i) in procedure.data" :key="i">
            <view
              class="goods-item"
              v-if="
                procedure.searchValue
                  ? item.name.toLowerCase().indexOf(procedure.searchValue.toLowerCase()) != -1
                  : true
              "
              :data-event="{ id: '_4mJTlzQFS' }"
            >
              <!-- <van-checkbox
                :value="item.checked"
                @change="onCheck($event, item)"
                class="c-m-l-10"
              ></van-checkbox> -->
              <image
                :src="
                  (item.images && JSON.parse(item.images)[0].url) ||
                  'https://pub.fsgo365.cn/logo_square.png'
                "
                class="goods-item-image"
                :data-event="{ id: '_4mJTlzQFS' }"
              />
              <view class="goods-item-view c-flex-around" :data-event="{ id: '_4mJTlzQFS' }">
                <view :data-event="{ id: '_4mJTlzQFS' }">
                  <view :data-event="{ id: '_4mJTlzQFS' }">{{ item.name }}</view>
                  <view
                    v-if="item.desc"
                    @click="toViewDescription(item.desc)"
                    class="c-ellipsis2 c-size-14 c-color-value"
                    :data-event="{ id: 'jtVYa8Osl-' }"
                  >
                    描述：{{ item.desc }}
                  </view>
                  <view :data-event="{ id: '_4mJTlzQFS' }">
                    <text class="desc-tag" v-if="item.brand" :data-event="{ id: '_4mJTlzQFS' }">
                      品牌：{{ codelabel('brand', item.brand) }}
                    </text>
                    <!-- <text
                      class="desc-tag"
                      v-if="item.sourceTypeList && item.sourceTypeList.length > 0" :data-event="{id:'_4mJTlzQFS'}">
                      面向客户：{{ codelabelForArray('sourceType', item.sourceTypeList) }}
                    </text> -->
                  </view>
                  <view
                    class="c-flex c-flex-between c-item-center c-m-t-20"
                    :data-event="{ id: '_4mJTlzQFS' }"
                  >
                    <view class="c-flex c-item-center" :data-event="{ id: '_4mJTlzQFS' }">
                      <text
                        v-if="item.guideUnitPrice || item.guideUnitPrice == 0"
                        class="c-red c-bold"
                        :data-event="{ id: '_4mJTlzQFS' }"
                      >
                        ¥ {{ item.guideUnitPrice }}
                      </text>
                      <text
                        v-if="(item.guideUnitPrice || item.guideUnitPrice == 0) && item.unit"
                        class="c-size-10 c-m-l-10"
                        :data-event="{ id: '_4mJTlzQFS' }"
                      >
                        / {{ item.unit ? codelabel('unit', item.unit) : '' }}
                      </text>
                    </view>
                    <van-button
                      round
                      size="mini"
                      class="c-rt c-flex"
                      @click="doOpen('./product', { type: 'procedure', id: item._id })"
                      :data-event="{ id: '-L63tNZkux' }"
                    >
                      编辑
                    </van-button>
                  </view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </van-tab>
      <van-tab title="机措" name="measure">
        <view class="goods" :data-event="{ id: '_4mJTlzQFS' }">
          <block v-for="(item, i) in measure.data" :key="i">
            <view
              class="goods-item"
              v-if="
                measure.searchValue
                  ? item.content.toLowerCase().indexOf(measure.searchValue.toLowerCase()) != -1
                  : true
              "
              :data-event="{ id: '_4mJTlzQFS' }"
            >
              <!-- <van-checkbox
                :value="item.checked"
                @change="onCheck($event, item)"
                class="c-m-l-10"
              ></van-checkbox> -->
              <image
                :src="
                  (item.images && JSON.parse(item.images)[0].url) ||
                  'https://pub.fsgo365.cn/logo_square.png'
                "
                class="goods-item-image"
                :data-event="{ id: '_4mJTlzQFS' }"
              />
              <view class="goods-item-view c-flex-around" :data-event="{ id: '_4mJTlzQFS' }">
                <view :data-event="{ id: '_4mJTlzQFS' }">
                  <view :data-event="{ id: '_4mJTlzQFS' }">{{ item.name || item.content }}</view>
                  <view
                    v-if="item.desc"
                    @click="toViewDescription(item.desc)"
                    class="c-ellipsis2 c-size-14 c-color-value"
                    :data-event="{ id: 'jnBvF6F3bR' }"
                  >
                    描述：{{ item.desc }}
                  </view>
                  <view :data-event="{ id: '_4mJTlzQFS' }">
                    <text class="desc-tag" v-if="item.brand" :data-event="{ id: '_4mJTlzQFS' }">
                      品牌：{{ codelabel('brand', item.brand) }}
                    </text>
                    <!-- <text
                      class="desc-tag"
                      v-if="item.sourceTypeList && item.sourceTypeList.length > 0" :data-event="{id:'_4mJTlzQFS'}">
                      面向客户：{{ codelabelForArray('sourceType', item.sourceTypeList) }}
                    </text> -->
                  </view>
                  <view
                    class="c-flex c-flex-between c-item-center c-m-t-20"
                    :data-event="{ id: '_4mJTlzQFS' }"
                  >
                    <view class="c-flex c-item-center" :data-event="{ id: '_4mJTlzQFS' }">
                      <text
                        v-if="item.guideUnitPrice || item.guideUnitPrice == 0"
                        class="c-red c-bold"
                        :data-event="{ id: '_4mJTlzQFS' }"
                      >
                        ¥ {{ item.guideUnitPrice }}
                      </text>
                      <text
                        v-if="(item.guideUnitPrice || item.guideUnitPrice == 0) && item.unit"
                        class="c-size-10 c-m-l-10"
                        :data-event="{ id: '_4mJTlzQFS' }"
                      >
                        / {{ item.unit ? codelabel('unit', item.unit) : '' }}
                      </text>
                    </view>
                    <van-button
                      round
                      size="mini"
                      class="c-rt c-flex"
                      @click="doOpen('./product', { type: 'measure', id: item._id })"
                      :data-event="{ id: 'i9oC30Qfqs' }"
                    >
                      编辑
                    </van-button>
                  </view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </van-tab>
      <van-tab title="套餐" name="projPackage">
        <view class="goods" :data-event="{ id: '_4mJTlzQFS' }">
          <block v-for="(item, i) in projPackage.data" :key="i">
            <view
              class="goods-item"
              v-if="
                projPackage.searchValue
                  ? item.name.toLowerCase().indexOf(projPackage.searchValue.toLowerCase()) != -1
                  : true
              "
              :data-event="{ id: '_4mJTlzQFS' }"
            >
              <!-- <van-checkbox
                :value="item.checked"
                @change="onCheck($event, item)"
                class="c-m-l-10"
              ></van-checkbox> -->
              <image
                :src="
                  (item.images && JSON.parse(item.images)[0].url) ||
                  'https://pub.fsgo365.cn/logo_square.png'
                "
                class="goods-item-image"
                :data-event="{ id: '_4mJTlzQFS' }"
              />
              <view class="goods-item-view c-flex-around" :data-event="{ id: '_4mJTlzQFS' }">
                <view :data-event="{ id: '_4mJTlzQFS' }">
                  <view :data-event="{ id: '_4mJTlzQFS' }">{{ item.name || item.content }}</view>
                  <view class="c-flex" v-if="item.desc" :data-event="{ id: '_4mJTlzQFS' }">
                    <view
                      class="c-nowrap c-size-14 c-color-value"
                      :data-event="{ id: '_4mJTlzQFS' }"
                    >
                      描述：{{ item.desc }}
                    </view>
                    <!-- <van-icon
                      name="info-o"
                      color="#106cff"
                      class="c-m-l-5"
                      @click="toViewDescription(item.desc)" :data-event="{id:'8-rX3yy25u'}" /> -->
                  </view>
                  <view :data-event="{ id: '_4mJTlzQFS' }">
                    <text class="desc-tag" v-if="item.brand" :data-event="{ id: '_4mJTlzQFS' }">
                      品牌：{{ codelabel('brand', item.brand) }}
                    </text>
                    <!-- <text
                      class="desc-tag"
                      v-if="item.sourceTypeList && item.sourceTypeList.length > 0" :data-event="{id:'_4mJTlzQFS'}">
                      面向客户：{{ codelabelForArray('sourceType', item.sourceTypeList) }}
                    </text> -->
                    <text class="desc-tag" :data-event="{ id: '_4mJTlzQFS' }">
                      {{ codelabel('packageType', item.type) }}
                    </text>
                  </view>
                  <view class="c-m-t-10" :data-event="{ id: '_4mJTlzQFS' }">
                    <van-button
                      v-if="item.procedureList.length > 0"
                      plain
                      hairline
                      type="info"
                      size="mini"
                      @click="openProcedures(item.procedureList)"
                      class="c-m-r-10"
                      :data-event="{ id: 'YkvgtTh3hD' }"
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
                      :data-event="{ id: 'MicZB0N3ii' }"
                    >
                      查看材料
                    </van-button>
                  </view>
                  <view
                    class="c-flex c-flex-between c-item-center c-m-t-20"
                    :data-event="{ id: '_4mJTlzQFS' }"
                  >
                    <view class="c-flex c-item-center" :data-event="{ id: '_4mJTlzQFS' }">
                      <text
                        v-if="item.price || item.price == 0"
                        class="c-red c-bold"
                        :data-event="{ id: '_4mJTlzQFS' }"
                      >
                        ¥ {{ item.price }}
                      </text>
                      <text
                        v-if="(item.price || item.price == 0) && item.unit"
                        class="c-size-10 c-m-l-10"
                        :data-event="{ id: '_4mJTlzQFS' }"
                      >
                        / {{ item.unit ? codelabel('unit', item.unit) : '' }}
                      </text>
                    </view>
                    <van-button
                      round
                      size="mini"
                      class="c-rt c-flex"
                      @click="doOpen('./product', { type: 'projPackage', id: item._id })"
                      :data-event="{ id: '2G0IgsRVZ8' }"
                    >
                      编辑
                    </van-button>
                  </view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </van-tab>
    </van-tabs>
    <view class="c-flex c-item-center c-flex-evenly c-bg-white" style="padding: 15px 0">
      <view v-if="activeTab == 'material'" class="c-text-center">
        <van-button
          type="info"
          size="small"
          round
          @click="doOpen('./product', { type: 'material' })"
          :data-event="{ id: 'J958jqtAvJ' }"
        >
          上架材料
        </van-button>
      </view>
      <view v-if="activeTab == 'procedure'" class="c-text-center">
        <van-button
          type="info"
          size="small"
          round
          @click="doOpen('./product', { type: 'procedure' })"
          :data-event="{ id: 'Hq1ZZxugiq' }"
        >
          上架工序
        </van-button>
      </view>
      <view v-if="activeTab == 'measure'" class="c-text-center">
        <van-button
          type="info"
          size="small"
          round
          @click="doOpen('./product', { type: 'measure' })"
          :data-event="{ id: 'WYjfsW3FPv' }"
        >
          上架机措
        </van-button>
      </view>
      <view v-if="activeTab == 'projPackage'" class="c-text-center">
        <van-button
          type="info"
          size="small"
          round
          @click="doOpen('./product', { type: 'projPackage' })"
          :data-event="{ id: 'bxZF48BThq' }"
        >
          上架套餐
        </van-button>
      </view>
      <view class="c-text-center">
        <van-button
          type="info"
          size="small"
          round
          @click="doOpen('./products', { type: activeTab })"
          :data-event="{ id: 'JfCv005odU' }"
        >
          批量上架
        </van-button>
      </view>
    </view>
    <!-- 展示材料介绍  -->
    <van-dialog
      :title="material.currentName"
      :show="material.openMaterialDetail"
      use-slot
      @confirm="material.openMaterialDetail = false"
      confirm-button-color="#106cff"
      :data-event="{ id: 'zRoAkLcy5Y', capture: false }"
    >
      <view style="height: 50vh; overflow-y: auto; font-size: 14px; padding: 20rpx">
        <rich-text :nodes="material.currentDetail"></rich-text>
      </view>
    </van-dialog>
    <!-- 展示套餐工序  -->
    <van-dialog
      title="套餐包含的工序"
      :show="projPackage.openProcedures"
      use-slot
      @confirm="projPackage.openProcedures = false"
      :data-event="{ id: '6puM4Pxf-W', capture: false }"
    >
      <view class="dialog-detail" v-for="(item, i) in projPackage.currentProcedures" :key="i">
        <view>服务内容：{{ item.procedure.content }}</view>
      </view>
    </van-dialog>

    <!-- 展示套餐材料  -->
    <van-dialog
      title="套餐包含的材料"
      :show="projPackage.openMaterials"
      use-slot
      @confirm="projPackage.openMaterials = false"
      :data-event="{ id: 'ipuwMsGl_S', capture: false }"
    >
      <view class="dialog-detail" v-for="(item, i) in projPackage.currentMaterials" :key="i">
        <view>名称：{{ item.material.name }}</view>
        <view>
          <view>类型：{{ codelabel('materialType', String(item.material.type)) }}</view>
          <view>品牌：{{ item.material.brand || '' }}</view>
        </view>
        <view>
          <view>编号：{{ item.material.code || '' }}</view>
          <view>型号：{{ item.material.model || '' }}</view>
        </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
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
      options: {
        codecfg_materialType: { codeId: 'type1' },
        codecfg_unit: { codeId: 'company' },
        codecfg_packageType: { codeId: 'packageType' },
        codecfg_brand: { codeId: 'brand' },
        codecfg_sourceType: { codeId: 'sourceType' }
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    common.osg.codeoption(() => {});
  },
  onShow() {
    common.osg.init(this, {}, app);
    this.getMaterials();
    this.getProcedures();
    this.getMeasures();
    this.getProjPackages();
  },
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    codelabelForArray(options, value) {
      return common.osg.codelabelForArray(options, value);
    },
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
    onCheck(e, item) {
      let activeTab = this.activeTab;
      item.checked = e.detail;
      // 全选标识
      for (let i = 0; i < this[this.activeTab].data.length; i++) {
        if (!this[this.activeTab].data[i].checked) {
          this[this.activeTab].selectAll = false;
          return;
        }
      }
      this[this.activeTab].selectAll = true;
    },
    selectAllChange(e) {
      let activeTab = this.activeTab;
      this[this.activeTab].selectAll = e.detail;
      if (this[this.activeTab].selectAll) {
        this[this.activeTab].data.map(item => {
          item.checked = true;
        });
      } else {
        this[this.activeTab].data.map(item => {
          item.checked = false;
        });
      }
    }
  }
};
</script>

<style lang="scss">
.products {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .c-tabs {
    height: 100%;
    .goods {
      height: 100%;
      overflow-y: auto;
      .goods-item {
        display: flex;
        align-items: center;
        width: calc(100% - 20px);
        margin: 10px;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 5px;
        background-color: #fff;
        .goods-item-image {
          width: 80px;
          height: 80px;
          border-radius: 5px;
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
