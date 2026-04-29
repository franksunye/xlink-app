<template>
  <view class="page" @click="showTip = null">
    <view class="example">
      <!-- 基础用法，不包含校验规则 -->
      <uni-forms ref="baseForm" :label-width="0">
        <uni-forms-item>
          <uni-data-select
            v-model="rangeValue"
            :localdata="range"
            @change="handleRangeChange"
            placeholder="选择服务区域"
          ></uni-data-select>
        </uni-forms-item>
        <uni-forms-item>
          <uni-data-select
            v-model="selectPartsValue"
            :localdata="selectParts"
            @change="handlePartsChange"
            placeholder="选择部位"
          ></uni-data-select>
        </uni-forms-item>
      </uni-forms>
    </view>

    <view class="card">
      <block v-if="mergedOrderList.length > 0">
        <view class="cardBox">
          <view class="finalOrderList" v-for="(item, index) in mergedOrderList" :key="index">
            <view class="header">
              <view class="name">{{ item.name }}</view>
              <view v-if="item.memo" class="icon-container" @click.stop="setShowTip(index)">
                <van-icon color="#D8D8D8" size="20" name="question" />
                <view v-if="showTip === index" class="tooltip">
                  {{ item.memo }}
                  <view class="tooltip-arrow"></view>
                </view>
              </view>
            </view>
            <view class="bottomBar">
              <view class="info">
                <view class="">第1名</view>
                <view class="">{{ item.firstPlaceScore || 0 }}</view>
              </view>
              <view class="info">
                <view class="" style="flex: 1; flex-wrap: nowrap; white-space: nowrap">
                  第
                  <text style="font-weight: bolder; font-size: 20px; color: #000; margin: 0px 2px">
                    {{ item.targetUserScore || 0 }}
                  </text>
                  名
                  <text class="c-size-10">（我）</text>
                </view>
                <view style="font-weight: bolder; font-size: 20px; color: #000">
                  {{ item.myScore || 0 }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </block>
      <block v-else>
        <van-empty image="search" description="暂无数据" />
      </block>

      <view class="growth-bottom">
        <view
          class="icon-box"
          @click="
            md({ path: 'growth-shujutongji' });
            doOpen('../../subpackages/report/data?type=growth', {});
          "
          :data-event="{ id: 'LKNzlQYPYd' }"
        >
          <van-icon
            name="https://pub.fsgo365.cn/jishi/shujutongji.png"
            size="48px"
            custom-style="border-radius: 50%;overflow: hidden"
            :data-event="{ id: 'LKNzlQYPYd' }"
          />
          <text class="c-size-14" :data-event="{ id: 'LKNzlQYPYd' }">业绩数据</text>
        </view>
        <view
          class="icon-box"
          @click="
            md({ path: 'growth-shujutongji' });
            doOpen('../../subpackages2/scoringIndicators/scoringIndicators', {});
          "
          :data-event="{ id: 'LKNzlzYPYd' }"
        >
          <van-icon
            name="https://pub.fsgo365.cn/jishi/fendanjilu.png"
            size="48px"
            custom-style="border-radius: 50%;overflow: hidden"
            :data-event="{ id: 'LKNzlzYPYd' }"
          />
          <text class="c-size-14" :data-event="{ id: 'LKNzlzYPYd' }">分单记录</text>
        </view>
      </view>
    </view>

    <van-toast id="van-toast" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');

export default {
  data() {
    return {
      range: [], //选择服务区域下拉选项 数据源
      rangeValue: '', //选择服务区域下拉选项的值
      rangeValue1: '', //选择服务区域下拉选项的值
      selectParts: [], //部位下拉选项
      selectPartsValue: '', //部位下拉选项 数据源
      options: {
        // cascadeCode_scoreCalcRulePart: {
        //   codeId: 'scoreCalcRulePart'
        // },
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        }
      },
      // 省市区
      areaList: Object.assign({}, areajs.default),
      //查询到的资源组
      mergedOrderList: [],
      userId: '', //当前用户的userId
      showTip: null //当前显示的气泡
    };
  },
  onLoad() {
    common.osg.init(this, {}, app);
    this.userId = wx.getStorageSync('user')._id;
    this.getData();
    this.fetchData();
    common.osg.codeoption(() => {
      //处理部位下拉选项
      this.selectParts = this.options.repairParts.map(item => ({
        text: item.name,
        value: item.value
      }));
    });
  },
  onShow() {},
  methods: {
    //查询服务区域
    getData() {
      let params = {
        _all: '1',
        'is:state|integer#and': 1,
        sortField: 'territoryNum,createTime',
        sortOrder: 'asc'
      };
      common.osg.ajax(
        'basic/serviceTerritoryCustom/query',
        params,
        res => {
          console.log('查询服务区域111111111', res.data);
          this.range = res.data.map(item => {
            let stringValue = item.subdistrict ? item.subdistrict : item.district;
            // 确保 stringValue 是数组，否则 join 会报错
            return {
              text: item.name,
              value: item._id,
              subdistrict: stringValue.join(',') || ''
            };
          });
        },
        {
          noload: true
        }
      );
    },
    //查询列表数据
    fetchData() {
      let params = {
        _all: '1',
        notFilterBelongTo: '1',
        notFilterOrgId: '1',
        'is:state|integer#and': 1,
        // 'all:repairPart|array#and': this.selectPartsValue,
        // 'in:stcIds|array#and': this.rangeValue1
        repairPart: this.selectPartsValue,
        stcIds: this.rangeValue1
      };
      common.osg.ajax(
        '/biz/scoreCalcRuleGroup/queryWithMini.do',
        params,
        res => {
          console.log('查询到的指标', res.data);

          res.data.map((item, index) => {
            const { scoreDetailMapList } = item;
            if (scoreDetailMapList.length > 0) {
              console.log('所有人的排行', scoreDetailMapList);
              item.firstPlaceScore = scoreDetailMapList[0].allScore || 0;
              let targetUserScore = scoreDetailMapList.findIndex(
                item => item.userId == this.userId
              );
              let num = scoreDetailMapList[targetUserScore]?.allScore || 0;
              item.myScore = Number(num) < 0 ? Math.trunc(Number(num)) : num;
              //我的排名
              item.targetUserScore = targetUserScore + 1;
            }
          });

          this.mergedOrderList = res.data;
        },
        {
          noload: true
        }
      );
    },

    handleRangeChange(value) {
      // 这里可以执行相关逻辑，比如更新其他选项
      this.rangeValue1 = value;
      this.fetchData();
    },

    handlePartsChange(value) {
      this.selectPartsValue = value;
      this.fetchData();
    },
    //埋点
    md(params) {
      common.osg.md(params);
    },
    //跳转
    doOpen(path, data) {
      console.log(111222, path);

      common.osg.open(path, data);
    },
    //气泡显示
    setShowTip(index) {
      this.showTip = this.showTip === index ? null : index;
    }
  }
};
</script>

<style lang="scss">
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}
.example {
  width: 100vw;
  padding: 0px 16px;
  box-sizing: border-box;
}
.card {
  flex: 1;
  width: 100vw;
  overflow-y: auto;
  padding-bottom: 100px;
  position: relative;
  .cardBox {
    display: flex;
    width: 100vw;
    justify-content: center;
    flex-wrap: wrap; /* 允许换行 */
    justify-content: space-between; /* 从左开始排列 */
    height: auto;
    padding: 1px 16px;
    box-sizing: border-box;
    .finalOrderList {
      width: calc(50% - 28px);
      padding: 10px;
      margin-bottom: 16px;
      height: 220rpx;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .header {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        font-weight: bold;
        justify-content: space-between;
        width: 100%;
        position: relative;
        .name {
          /* 限制 name 容器宽度并使其文本超出时显示省略号 */
          max-width: calc(100% - 20px); /* 减去图标和空隙的宽度 */
          overflow: hidden; /* 隐藏超出部分 */
          text-overflow: ellipsis; /* 显示省略号 */
          display: -webkit-box; /* 使用弹性盒子布局 */
          -webkit-line-clamp: 2; /* 限制显示两行 */
          -webkit-box-orient: vertical; /* 垂直方向排列 */
          word-break: break-all; /* 允许在任意字符间换行 */
        }
      }
      .bottomBar {
        .info {
          font-size: 15px;
          display: flex;
          color: #646566;
          justify-content: space-between;
          align-items: baseline;
        }
      }
    }
  }
}
.growth-bottom {
  width: 100vw;
  height: 100px;
  position: fixed;
  bottom: 0;
  background-color: #f9f9f9;
  box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
  display: flex;
  align-items: center;
  .icon-box {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .icon-view {
    width: 48px;
    height: 48px;
    background: linear-gradient(301deg, #0071c6 0%, #0090d9 100%);
    box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
    border-radius: 50%;
    opacity: 0.99;
    border: 1rpx solid #0f6faf;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  > text {
    color: #444444;
  }
}

.icon-container {
  position: absolute;
  display: inline-block;
  right: 0px;
  top: 2px;
  .tooltip {
    position: absolute;
    top: 30px; /* 让提示框在图标下方 */
    right: 1%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 6px 10px;
    border-radius: 5px;
    font-size: 12px;
    // white-space: nowrap;
    z-index: 10;
    text-align: center;

    width: max-content;
    height: auto;
    max-width: 30vw;
  }

  .tooltip-arrow {
    position: absolute;
    top: -5px; /* 让小三角形贴在提示框上 */
    right: 5%;
    width: 0;
    height: 0;
    z-index: 1;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid rgba(0, 0, 0, 0.8); /* 小三角颜色要和提示框一样 */
  }
}

::v-deep .uni-forms-item {
  margin-bottom: 16px !important;
}
</style>
