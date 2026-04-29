<template>
  <view v-if="contract._id" class="project-profit">
    <view class="info">
      <view class="card-view c-flex c-flex-between">
        <view class="c-flex c-item-center">
          <view
            class="card-icon-view"
            :class="['1', '2', '5'].includes(contract.exts.sourceType) ? 'c-bg-red' : 'c-bg-blue'"
          >
            <image
              :src="
                'https://pub.fsgo365.cn/icon-' +
                (contract.serviceType == '40' ? 'shuazi.png' : 'fangshui.png')
              "
            />
          </view>
          <text
            @click.stop="
              copy(contract.contractdocNum, '已复制完整项目编号 ' + contract.contractdocNum)
            "
            :data-event="{ id: '9cXxYY12z8' }"
            class="c-m-l-20"
          >
            {{ '#' + contract.contractdocNum.slice(13) }}
          </text>
          <text
            class="c-m-l-20"
            v-if="
              contract.exts.leakagesite_copy &&
              contract.exts.leakagesite_copy[0] &&
              contract.exts.leakagesite_copy[0][0]
            "
          >
            {{ formatLeakagesite([contract.exts.leakagesite_copy[0][0]]) }}
          </text>
        </view>
        <text :class="item.state != 10 && 'c-blue'" class="c-flex-nowrap">
          {{ codelabel('select', 'projectStatus', contract.projectStatus) || '' }}
        </text>
      </view>
      <view v-if="contract.district || contract.address" class="card-view c-flex c-flex-between">
        <view class="c-flex-1 c-ellipsis2">
          {{ contract.address || '' }}
        </view>
      </view>
    </view>
    <scroll-view scroll-y class="profit-scroll">
      <view style="margin: 8px 16px; font-weight: 600">项目成本</view>
      <block v-if="contract.projectConsumptionList.length > 0">
        <view style="margin: 8px 16px 8px 16px; color: #646566">
          材料和机措（合计：¥ {{ contract.projectConsumptionCost || 0 }}）
        </view>
        <view class="consumption-card-group">
          <view
            v-for="(item, i) in contract.projectConsumptionList"
            :key="i"
            class="consumption-card"
          >
            <view class="c-ellipsis2">{{ item.name || '无' }}</view>
            <view class="c-flex c-flex-between c-item-center">
              <van-tag
                size="large"
                :color="item.type == 'material' ? '#e0f1fe' : '#fff9e6'"
                :text-color="item.type == 'material' ? '#106cff' : '#646566'"
                :style="item.type == 'material' ? 'opacity:0.8' : ''"
              >
                {{ item.type == 'material' ? '材料' : item.type == 'measure' ? '机措' : '其他' }}
              </van-tag>
              <view style="min-width: 36px">
                <text>{{ item.quantity }}</text>
                <text class="c-size-12">
                  {{ item.unit ? ' / ' + codelabel('select', 'unit', item.unit) : '' }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </block>
      <block v-if="contract.labourList.length > 0">
        <view style="margin: 16px 16px 8px 16px; color: #646566">
          工人（合计：¥ {{ contract.projectLabourCost || 0 }}）
        </view>
        <view class="consumption-card-group">
          <view
            v-for="(item, i) in contract.labourList"
            :key="i"
            class="consumption-card c-flex c-flex-between c-item-center"
          >
            <view>{{ item.name }}</view>
            <view>{{ item.phone }}</view>
          </view>
        </view>
      </block>
      <view style="margin: 16px 16px 8px; font-weight: 600">项目收入</view>
      <view class="consumption-card-group">
        <view class="consumption-card c-flex c-flex-between c-item-center">
          <view>合同签约金额（优惠后）</view>
          <view>¥ {{ contract.afterRefundMoney }}</view>
        </view>
        <view class="consumption-card c-flex c-flex-between c-item-center">
          <view>已收款总金额</view>
          <view>¥ {{ contract.paidAmount }}</view>
        </view>
      </view>
      <view class="consumption-card-group" style="margin-top: 10px">
        <view v-for="(item, i) in contract.payList" :key="i" class="consumption-card">
          <view class="c-flex c-flex-between c-item-center">
            <view>付款时间</view>
            <view>{{ item.payTime }}</view>
          </view>
          <view class="c-flex c-flex-between c-item-center">
            <view>付款人</view>
            <view>{{ item.executor }}</view>
          </view>
          <view class="c-flex c-flex-between c-item-center">
            <view>付款方式</view>
            <view>{{ formatterPayType(item.payType) }}</view>
          </view>
          <view class="c-flex c-flex-between c-item-center">
            <view>款项类型</view>
            <view>{{ formatterOrderType(item.orderType) }}</view>
          </view>
          <view v-if="item.paidAmount" class="c-flex c-flex-between c-item-center">
            <view>已收款金额</view>
            <view>¥ {{ item.paidAmount }}</view>
          </view>
          <view v-if="item.price" class="c-flex c-flex-between c-item-center">
            <view>本次审核金额</view>
            <view>¥ {{ item.price }}</view>
          </view>
        </view>
      </view>
      <view style="margin: 16px 16px 8px; font-weight: 600">
        项目利润（¥ {{ contract.projectProfit }}）
      </view>
      <view style="margin: 8px 16px; color: #969799; font-size: 14px">
        计算公式为：项目利润 = 合同增减项后金额 - 材料和机措成本价合计 - 人工费用合计
      </view>
    </scroll-view>
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
      projectId: '',
      systemInfo: {},
      id: '', // 工单id
      contract: {
        exts: {},
        projectConsumptionList: [],
        labourList: [],
        payList: []
      },
      options: {
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        },
        codecfg_projectStatus: {
          codeId: 'projectStatus'
        },
        codecfg_unit: { codeId: 'company' },
        codecfg_payType: { codeId: 'payType' },
        codecfg_orderPayType: { codeId: 'orderPayType' },
        codecfg_tradeIn: { codeId: 'tradeIn' }
      },
      areaList: Object.assign({}, areajs.default),
      refresherTriggered: false, // 已触发下拉加载
      reachBottom: false, // 触底
      fpi: {
        page: 1,
        rows: 10,
        data: []
      },
      projectTask: [],
      projectTaskIndex: 0,
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
      }
    };
  },
  onLoad(params) {
    this.systemInfo = app.globalData.systemInfo;
    common.osg.init(this, params, app);
    this.id = params.id;
    this.projectId = params.projectId;
    common.osg.getLocation(
      res => {
        app.globalData.location = res.latitude + ',' + res.longitude;
        common.osg.codeoption(() => {
          this.getData();
        });
      },
      null,
      {
        doNotRemind: true
      }
    );
  },
  onShow() {
    common.osg.init(this, {}, app);
  },
  methods: {
    getData() {
      common.osg.ajax('biz/project/getLedgerById', { id: this.projectId }, res => {
        this.contract = res.data;
      });
    },
    open(path, data) {
      common.osg.open(path, data);
    },
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
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
    openLocation(gpsPoint, area, address) {
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
    formatterPayType(value) {
      return common.osg.codelabel('payType', value);
    },
    formatterOrderType(value) {
      return common.osg.codelabel('orderPayType', value);
    }
  }
};
</script>

<style lang="scss">
.project-profit {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .info {
    background-color: #fff;
    padding: 5px 16px;
    box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
    .card-view {
      line-height: 28px;
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
    }
  }
  .profit-scroll {
    flex: 1;
    overflow-y: auto;
    margin-bottom: env(safe-area-inset-bottom);
    .consumption-card-group {
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
      margin: 8px 16px;
      .consumption-card {
        padding: 8px 16px;
        border-bottom: 1px solid #ebedf0;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
