<template>
  <view class="products">
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
    <van-tabs :active="activeTab" custom-class="c-tabs" style="flex: 1; overflow: hidden">
      <van-tab title="材料" name="material">
        <view class="goods">
          <block v-for="(item, i) in material.data" :key="i">
            <view
              class="goods-item"
              v-if="
                material.searchValue
                  ? item.name.toLowerCase().indexOf(material.searchValue.toLowerCase()) != -1
                  : true
              "
            >
              <van-checkbox
                :value="item.checked"
                @change="onCheck($event, item)"
                class="c-m-l-10"
              ></van-checkbox>
              <image
                :src="
                  (item.images && JSON.parse(item.images)[0].url) || '../../static/images/logo.png'
                "
                class="goods-item-image"
              />
              <view class="goods-item-view">
                <view>
                  <view>{{ item.name }}</view>
                  <view>
                    <text
                      class="desc-tag"
                      v-if="item.desc"
                      @click="openMaterialDetail(item.name, item.desc)"
                      style="border: 1px solid #1989fa; color: #1989fa"
                    >
                      材料介绍
                    </text>
                    <text class="desc-tag" v-if="item.code">编号：{{ item.code || '' }}</text>
                    <text class="desc-tag" v-if="item.type">
                      类型：{{ codelabel('materialType', String(item.type)) }}
                    </text>
                    <text class="desc-tag" v-if="item.exts.brand">
                      品牌：{{ item.exts.brand || '' }}
                    </text>
                    <text class="desc-tag" v-if="item.spec">
                      规格：{{ item.spec || ''
                      }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
                    </text>
                    <text class="desc-tag" v-if="item.model">型号：{{ item.model || '' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </van-tab>
      <van-tab title="工序" name="procedure">
        <view class="goods">
          <block v-for="(item, i) in procedure.data" :key="i">
            <view
              class="goods-item"
              v-if="
                procedure.searchValue
                  ? item.name.toLowerCase().indexOf(procedure.searchValue.toLowerCase()) != -1
                  : true
              "
            >
              <van-checkbox
                :value="item.checked"
                @change="onCheck($event, item)"
                class="c-m-l-10"
              ></van-checkbox>
              <image
                :src="
                  (item.images && JSON.parse(item.images)[0].url) || '../../static/images/logo.png'
                "
                class="goods-item-image"
              />
              <view class="goods-item-view">
                <view>
                  <view>{{ item.name }}</view>
                  <view class="c-flex" v-if="item.desc">
                    <view class="c-nowrap c-size-14 c-color-value">描述：{{ item.desc }}</view>
                    <van-icon
                      name="info-o"
                      color="#1989fa"
                      class="c-m-l-5"
                      @click="toViewDescription(item.desc)"
                    />
                  </view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </van-tab>
      <van-tab title="机措" name="measure">
        <view class="goods">
          <block v-for="(item, i) in measure.data" :key="i">
            <view
              class="goods-item"
              v-if="
                measure.searchValue
                  ? item.name.toLowerCase().indexOf(measure.searchValue.toLowerCase()) != -1
                  : true
              "
            >
              <van-checkbox
                :value="item.checked"
                @change="onCheck($event, item)"
                class="c-m-l-10"
              ></van-checkbox>
              <image
                :src="
                  (item.images && JSON.parse(item.images)[0].url) || '../../static/images/logo.png'
                "
                class="goods-item-image"
              />
              <view class="goods-item-view">
                <view>
                  <view>{{ item.name || item.content }}</view>
                  <view class="c-flex" v-if="item.desc">
                    <view class="c-nowrap c-size-14 c-color-value">描述：{{ item.desc }}</view>
                    <van-icon
                      name="info-o"
                      color="#1989fa"
                      class="c-m-l-5"
                      @click="toViewDescription(item.desc)"
                    />
                  </view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </van-tab>
      <van-tab title="套餐" name="projPackage">
        <view class="goods">
          <block v-for="(item, i) in projPackage.data" :key="i">
            <view
              class="goods-item"
              v-if="
                projPackage.searchValue
                  ? item.name.toLowerCase().indexOf(projPackage.searchValue.toLowerCase()) != -1
                  : true
              "
            >
              <van-checkbox
                :value="item.checked"
                @change="onCheck($event, item)"
                class="c-m-l-10"
              ></van-checkbox>
              <image
                :src="
                  (item.images && JSON.parse(item.images)[0].url) || '../../static/images/logo.png'
                "
                class="goods-item-image"
              />
              <view class="goods-item-view">
                <view>
                  <view>{{ item.name || item.content }}</view>
                  <view class="c-flex" v-if="item.desc">
                    <view class="c-nowrap c-size-14 c-color-value">描述：{{ item.desc }}</view>
                    <van-icon
                      name="info-o"
                      color="#1989fa"
                      class="c-m-l-5"
                      @click="toViewDescription(item.desc)"
                    />
                  </view>
                  <text class="desc-tag">
                    {{ codelabel('packageType', item.type) }}
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
    <view
      v-if="activeTab == 'material'"
      class="c-flex c-flex-between c-item-center c-bg-white"
      style="padding: 10px"
    >
      <van-checkbox :value="material.selectAll" @change="selectAllChange" class="c-m-l-10">
        全选
      </van-checkbox>
      <van-button type="info" size="small" round @click="shelfMaterials">批量上架</van-button>
    </view>
    <view
      v-if="activeTab == 'procedure'"
      class="c-flex c-flex-between c-item-center c-bg-white"
      style="padding: 10px"
    >
      <van-checkbox :value="procedure.selectAll" @change="selectAllChange" class="c-m-l-10">
        全选
      </van-checkbox>
      <van-button type="info" size="small" round @click="shelfProcedures">批量上架</van-button>
    </view>
    <view
      v-if="activeTab == 'measure'"
      class="c-flex c-flex-between c-item-center c-bg-white"
      style="padding: 10px"
    >
      <van-checkbox :value="measure.selectAll" @change="selectAllChange" class="c-m-l-10">
        全选
      </van-checkbox>
      <van-button type="info" size="small" round @click="shelfMeasures">批量上架</van-button>
    </view>
    <view
      v-if="activeTab == 'projPackage'"
      class="c-flex c-flex-between c-item-center c-bg-white"
      style="padding: 10px"
    >
      <van-checkbox :value="projPackage.selectAll" @change="selectAllChange" class="c-m-l-10">
        全选
      </van-checkbox>
      <van-button type="info" size="small" round @click="shelfProjPackages">批量上架</van-button>
    </view>
    <!-- 展示材料介绍  -->
    <van-dialog
      :title="material.currentName"
      :show="material.openMaterialDetail"
      use-slot
      @confirm="material.openMaterialDetail = false"
      confirm-button-color="#1989fa"
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
        codecfg_packageType: { codeId: 'packageType' }
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    common.osg.codeoption(() => {
      this.getMaterials();
      this.getProcedures();
      this.getMeasures();
      this.getProjPackages();
    });
  },
  methods: {
    doOpen(path) {
      common.osg.open(path);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    onSearch(e) {
      this[activeTab].searchValue = e.detail;
    },
    onSearchClear() {
      this[activeTab].searchValue = '';
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
        'basic/material/queryWithSales',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:approveState|integer#and': 1,
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
    shelfMaterials() {
      let ids = [];
      this.material.data.map(item => {
        if (item.checked) ids.push(item._id);
      });
      if (ids.length == 0) {
        common.osg.toast('请至少勾选1个材料！', 'none');
        return;
      }
      common.osg.ajax(
        'basic/material/handleSales',
        {
          ids: ids
        },
        res => {
          common.osg.alert('批量上架材料成功！', () => {
            this.getMaterials();
          });
        }
      );
    },
    getProcedures() {
      common.osg.ajax(
        'basic/procedure/queryWithSales',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:approveState|integer#and': 1,
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
    shelfProcedures() {
      let ids = [];
      this.procedure.data.map(item => {
        if (item.checked) ids.push(item._id);
      });
      if (ids.length == 0) {
        common.osg.toast('请至少勾选1个工序！', 'none');
        return;
      }
      common.osg.ajax(
        'basic/procedure/handleSales',
        {
          ids: ids
        },
        res => {
          common.osg.alert('批量上架工序成功！', () => {
            this.getProcedures();
          });
        }
      );
    },
    getMeasures() {
      common.osg.ajax(
        'basic/measure/queryWithSales',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:approveState|integer#and': 1,
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
    shelfMeasures() {
      let ids = [];
      this.measure.data.map(item => {
        if (item.checked) ids.push(item._id);
      });
      if (ids.length == 0) {
        common.osg.toast('请至少勾选1个机措！', 'none');
        return;
      }
      common.osg.ajax(
        'basic/measure/handleSales',
        {
          ids: ids
        },
        res => {
          common.osg.alert('批量上架机措成功！', () => {
            this.getMeasures();
          });
        }
      );
    },
    getProjPackages() {
      common.osg.ajax(
        'basic/projPackage/queryWithSales',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:approveState|integer#and': 1,
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
    shelfProjPackages() {
      let ids = [];
      this.projPackage.data.map(item => {
        if (item.checked) ids.push(item._id);
      });
      if (ids.length == 0) {
        common.osg.toast('请至少勾选1个套餐！', 'none');
        return;
      }
      common.osg.ajax(
        'basic/projPackage/handleSales',
        {
          ids: ids
        },
        res => {
          common.osg.alert('批量上架套餐成功！', () => {
            this.getProjPackages();
          });
        }
      );
    },
    onCheck(e, item) {
      let activeTab = this.activeTab;
      item.checked = e.detail;
      // 全选标识
      for (let i = 0; i < this[activeTab].data.length; i++) {
        if (!this[activeTab].data[i].checked) {
          this[activeTab].selectAll = false;
          return;
        }
      }
      this[activeTab].selectAll = true;
    },
    selectAllChange(e) {
      let activeTab = this.activeTab;
      this[activeTab].selectAll = e.detail;
      if (this[activeTab].selectAll) {
        this[activeTab].data.map(item => {
          item.checked = true;
        });
      } else {
        this[activeTab].data.map(item => {
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
            border-radius: 4px;
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
