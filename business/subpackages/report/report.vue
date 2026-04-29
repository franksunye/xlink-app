<template>
  <view class="report" @click.capture="track">
    <view>
      <view
        @click="navigateBack"
        :style="
          'position:absolute;z-index:1;top:' +
          systemInfo.statusBarHeight +
          'px;left:' +
          systemInfo.menuButtonObject.marginRight +
          'px;height:' +
          systemInfo.navHeight +
          'px;line-height:' +
          systemInfo.navHeight +
          'px;color:#fff;display:flex;align-items:center;font-weight:500;'
        "
        :data-event="{ id: 'UKsdqXdenj' }"
      >
        <van-icon
          name="arrow-left"
          style="font-size: 20px; margin-right: 5px"
          :data-event="{ id: 'UKsdqXdenj' }"
        />
        <text
          v-if="
            systemInfo.osName == 'ios' ||
            systemInfo.osName == 'mac' ||
            systemInfo.osName == 'devtools'
          "
          :style="
            'width:calc(100vw - ' +
            systemInfo.menuButtonObject.marginRight * 2 +
            'px - 50px);text-align:center'
          "
          :data-event="{ id: 'UKsdqXdenj' }"
        >
          {{ type == 'boss' ? '老板通' : type == 'growth' ? '成长通' : '' }}
        </text>
        <text v-else :data-event="{ id: 'UKsdqXdenj' }">
          {{ type == 'boss' ? '老板通' : type == 'growth' ? '成长通' : '' }}
        </text>
      </view>
      <view
        :style="
          'width:100vw;text-align:center;position:absolute;z-index:1;left:0;top:' +
          (imageHeight / 2 - 20) +
          'px;height:40px;line-height:40px;color:#fff;font-size:25px;font-weight:600;font-style:italic;'
        "
      >
        工作效率好帮手
      </view>
      <image
        style="width: 100vw; position: relative"
        mode="widthFix"
        src="https://pub.fsgo365.cn/25376750398128123.png"
        @load="getImageInfo"
      />
    </view>
    <view class="card-data" style="margin-top: -40px" v-if="loaded && type == 'boss'">
      <view class="c-bold">本月经营概况</view>
      <view class="c-flex">
        <view class="c-flex-1 c-text-center">
          <view class="c-color-value">接单</view>
          <view class="c-bold c-size-22">{{ report1.accept || 0 }}</view>
          <view>上月 {{ report1.lastAccept || 0 }}</view>
        </view>
        <view class="c-flex-1 c-text-center">
          <view class="c-color-value">签合同</view>
          <view class="c-bold c-size-22">{{ report1.sign || 0 }}</view>
          <view>上月 {{ report1.lastSign || 0 }}</view>
        </view>
        <view class="c-flex-1 c-text-center">
          <view class="c-color-value">签约额(万元)</view>
          <view class="c-bold c-size-22">
            {{
              report1.contractAmount ? (parseInt(report1.contractAmount / 100) / 100).toFixed(2) : 0
            }}
          </view>
          <view>
            上月
            {{
              report1.lastContractAmount
                ? (parseInt(report1.lastContractAmount / 100) / 100).toFixed(2)
                : 0
            }}
          </view>
        </view>
      </view>
    </view>
    <view class="card-data" v-if="loaded && type == 'boss'">
      <view class="c-bold">技术工程师数据详情</view>
      <view class="c-flex c-item-center" style="padding: 15px 0">
        <text class="c-gray c-size-14">日期范围</text>
        <text
          :class="dateType == 'yesterday' ? 'tag-active tag' : 'tag'"
          @click="dateTypeClick('yesterday')"
          :data-event="{ id: 'AF1bRsVdnR' }"
        >
          昨日
        </text>
        <text
          :class="dateType == 'today' ? 'tag-active tag' : 'tag'"
          @click="dateTypeClick('today')"
          :data-event="{ id: 'lu5kbBSKgn' }"
        >
          今日
        </text>
        <text
          :class="dateType == 'thisMonth' ? 'tag-active tag' : 'tag'"
          @click="dateTypeClick('thisMonth')"
          :data-event="{ id: 'cbdZbTL5qW' }"
        >
          本月
        </text>
      </view>
      <view>
        <view class="th">
          <view class="td">姓名</view>
          <view class="td">接单</view>
          <view class="td">签合同</view>
          <view class="td">签约额(元)</view>
        </view>
        <view class="tr" v-for="(item, i) in report2" :key="i">
          <view class="td">{{ item.userName || '' }}</view>
          <view class="td">{{ item.accept || 0 }}</view>
          <view class="td">{{ item.sign || 0 }}</view>
          <view class="td">{{ formatContractAmount(item.contractAmount) }}</view>
        </view>
        <view v-if="report2.length == 0" class="tr c-flex-center c-size-14 c-gray">暂无数据</view>
      </view>
    </view>
    <!-- 排名数据 -->
    <view class="card-data" style="margin-top: -40px" v-if="loaded && type == 'growth'">
      <view class="c-bold">排名数据，区域与部位</view>
    </view>
    <view v-if="loaded && type == 'growth'" class="rank-view">
      <view v-for="(st, i) in rank" :key="i" class="card-data">
        <view class="c-bold">{{ st.name }}</view>
        <view class="c-flex c-item-center" style="padding: 15px 0">
          <text class="c-gray c-size-14 c-white-space-nowrap">部位</text>
          <block v-for="(part, partIndex) in st.parts" :key="partIndex">
            <text
              :class="st.currentPart == part ? 'tag-active tag' : 'tag'"
              @click="partClick(st, part)"
              :data-event="{ id: '3lR5oosjae' }"
            >
              {{ formatPart(part) }}
            </text>
          </block>
        </view>
        <view>
          <view class="th">
            <view
              class="td"
              v-for="(indexKey, indexIndex) in st[st.currentPart].indexs"
              :key="indexIndex"
            >
              {{ formatIndexName(st.ruleNameMap, indexKey) }}
            </view>
          </view>
          <block>
            <view class="tr">
              <view
                v-for="(indexKey, indexIndex) in st[st.currentPart].indexs"
                :key="indexIndex"
                class="td"
              >
                {{ st[st.currentPart].first[indexKey] + ' (第一)' }}
              </view>
            </view>

            <view class="tr">
              <view
                v-for="(indexKey, indexIndex) in st[st.currentPart].indexs"
                :key="indexIndex"
                class="td"
                :class="
                  Number(st[st.currentPart].avg[indexKey]) >
                  Number(st[st.currentPart].mine[indexKey])
                    ? 'c-yellow'
                    : 'c-blue'
                "
              >
                {{
                  Number(st[st.currentPart].avg[indexKey]) >
                  Number(st[st.currentPart].mine[indexKey])
                    ? st[st.currentPart].avg[indexKey] + ' (平均)'
                    : st[st.currentPart].mine[indexKey] + ' (你)'
                }}
              </view>
            </view>

            <view class="tr">
              <view
                v-for="(indexKey, indexIndex) in st[st.currentPart].indexs"
                :key="indexIndex"
                class="td"
                :class="
                  Number(st[st.currentPart].avg[indexKey]) <=
                  Number(st[st.currentPart].mine[indexKey])
                    ? 'c-yellow'
                    : 'c-blue'
                "
              >
                {{
                  Number(st[st.currentPart].avg[indexKey]) <=
                  Number(st[st.currentPart].mine[indexKey])
                    ? st[st.currentPart].avg[indexKey] + ' (平均)'
                    : st[st.currentPart].mine[indexKey] + ' (你)'
                }}
              </view>
            </view>
          </block>
        </view>
      </view>
    </view>
    <!-- 底部卡片：数据统计、数据图表 -->
    <view class="growth-bottom">
      <view class="card" v-if="loaded && type == 'growth'">
        <view
          class="function"
          @click="
            md({ path: type + '-shujutongji' });
            doOpen('data', {});
          "
          :data-event="{ id: 'LKNzlQYPYd' }"
        >
          <view class="icon-view" :data-event="{ id: 'LKNzlQYPYd' }">
            <van-icon
              name="description"
              style="font-size: 20px; color: #fff"
              :data-event="{ id: 'LKNzlQYPYd' }"
            />
          </view>
          <text class="c-size-14" :data-event="{ id: 'LKNzlQYPYd' }">数据统计</text>
        </view>
      </view>
    </view>
    <view class="card" v-if="loaded && type == 'boss'">
      <view
        class="function"
        @click="
          md({ path: type + '-shujutongji' });
          doOpen('data', {});
        "
        :data-event="{ id: 'nWpCiEt9je' }"
      >
        <view class="icon-view" :data-event="{ id: 'nWpCiEt9je' }">
          <van-icon
            name="description"
            style="font-size: 20px; color: #fff"
            :data-event="{ id: 'nWpCiEt9je' }"
          />
        </view>
        <text class="c-size-14" :data-event="{ id: 'nWpCiEt9je' }">数据统计</text>
      </view>
      <view
        v-if="type == 'boss'"
        class="function"
        @click="
          md({ path: type + '-shujutubiao' });
          doOpen('../web/web', {
            url: `${host}/fsgo/wm/h5/report/dashboard?id=735324410356779517`
          });
        "
        :data-event="{ id: 'dM_MUfv22D' }"
      >
        <view class="icon-view" :data-event="{ id: 'dM_MUfv22D' }">
          <van-icon
            name="chart-trending-o"
            style="font-size: 20px; color: #fff"
            :data-event="{ id: 'dM_MUfv22D' }"
          />
        </view>
        <text class="c-size-14" :data-event="{ id: 'dM_MUfv22D' }">数据图表</text>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      type: '', // role 成长通
      loaded: false,
      systemInfo: {
        menuButtonObject: {}
      },
      imageHeight: '',
      host: common.osg.host,
      dateType: 'yesterday',
      report1: {},
      report2: [],
      options: {
        codecfg_scoreCalcRulePart: {
          codeId: 'scoreCalcRulePart'
        }
      },
      rank: []
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.type = params.type;
    this.systemInfo = app.globalData.systemInfo;
    common.osg.codeoption(() => {
      this.getRank();
    });
    if (this.type == 'boss') {
      this.getReport1();
      this.getReport2();
    }
  },
  onShow() {
    common.osg.init(this, {}, app);
  },
  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    doOpen(path, data) {
      data.type = this.type;
      common.osg.open(path, data);
    },
    getImageInfo(e) {
      this.loaded = true;
      //获取窗口宽度
      var width = this.systemInfo.windowWidth;
      //获取图片实际高度
      var imgheight = e.detail.height;
      //获取图片实际宽度
      var imgwidth = e.detail.width;
      //获取图片当前屏幕内高度， 屏幕宽度 / 图片高度 = 图片宽度 / 图片高度  ==》图片高度 = 屏幕宽度 * 图片高度 / 图片宽度
      this.imageHeight = (width * imgheight) / imgwidth;
    },
    getReport1() {
      common.osg.ajax('/biz/cc/boss', {}, res => {
        this.report1 = res.data;
      });
    },
    getReport2() {
      let startDate, endDate;
      if (this.dateType == 'yesterday') {
        let newDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let date = newDate.getDate();
        startDate =
          year + '-' + (month >= 10 ? month : '0' + month) + '-' + (date >= 10 ? date : '0' + date);
        endDate = startDate;
      } else if (this.dateType == 'today') {
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let date = newDate.getDate();
        startDate =
          year + '-' + (month >= 10 ? month : '0' + month) + '-' + (date >= 10 ? date : '0' + date);
        endDate = startDate;
      } else if (this.dateType == 'thisMonth') {
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let date = newDate.getDate();
        startDate = year + '-' + (month >= 10 ? month : '0' + month) + '-' + '01';
        endDate =
          year +
          '-' +
          (month >= 10 ? month : '0' + month) +
          '-' +
          new Date(year, month, 0).getDate();
      }
      common.osg.ajax(
        '/biz/cc/employee',
        {
          startDate,
          endDate
        },
        res => {
          this.report2 = res.data || [];
        },
        {
          noload: true
        }
      );
    },
    dateTypeClick(dateType) {
      this.dateType = dateType;
      this.getReport2();
    },
    formatContractAmount(contractAmount) {
      // 截取两位小数 不四舍五入，然后增加千分位
      return Number((parseInt(contractAmount * 100) / 100).toFixed(2)).toLocaleString('en-us', {
        maximumFractionDigits: 2, // 小数位最大保留位数：0-20
        minimumFractionDigits: 2 // 小数位最小保留位数：0-20
      });
    },
    md(params) {
      common.osg.md(params);
    },
    getRank() {
      common.osg.ajax('basic/growth/technicianStatistics', {}, res => {
        res.data.map(st => {
          // 处理当前区域有哪些部位的指标
          st.parts = [];
          let keys = Object.keys(st);
          for (let i = 0; i < keys.length; i++) {
            // 非0数字即部位
            let key = keys[i];
            //  && key != '0'
            if (!isNaN(key)) {
              st.parts.push(key);
            }
          }

          // 设置默认选中部位
          st.currentPart = st.parts[0];

          // 处理当前区域每个部位有哪些指标，取first对象内的值，最后将总分也插入indexs数组。
          st.parts.map(part => {
            // 将客单价指标排在第一列，实现不同部位的每一列是相同的。
            st[part].indexs = [];
            let values = [];
            for (let key in st[part].first) {
              if (key != 'ALL_SCOREVAL') {
                values.push({ key, value: st[part].first[key] });
              }
            }
            values = values.sort(
              (a, b) =>
                (b.value.indexOf('%') != -1
                  ? Number(b.value.substring(0, b.value.length - 1))
                  : Number(b.value)) -
                (a.value.indexOf('%') != -1
                  ? Number(a.value.substring(0, a.value.length - 1))
                  : Number(a.value))
            );
            values.map(item => {
              st[part].indexs.push(item.key);
            });
            st[part].indexs.push('ALL_SCOREVAL');
          });
        });

        this.rank = res.data;
      });
    },
    // 返显区域有哪些部位
    formatPart(part) {
      return common.osg.codelabel('scoreCalcRulePart', part);
    },
    // 简化指标规则名称
    formatIndexName(indexMap, key) {
      if (key == 'ALL_SCOREVAL') {
        return '总分';
      } else {
        key = key.split('_')[0];
        let name = indexMap[key];
        if (name.indexOf('转化率') != -1) {
          name = '转化率';
        } else if (name.indexOf('客单价') != -1) {
          name = '客单价';
        } else if (name.indexOf('合同额') != -1 || name.indexOf('合同金额') != -1) {
          name = '合同额';
        }
        return name || '';
      }
    },
    partClick(st, part) {
      st.currentPart = part;
    }
  }
};
</script>

<style lang="scss">
.report {
  overflow-y: auto;
  .card-data {
    width: calc(100vw - 20px);
    margin: 10px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 8px;
    background: #fff;
    position: relative;
    > view {
      > view {
        > view {
          line-height: 30px;
        }
      }
    }
    .tag {
      width: 60px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      background: #f2f2f2;
      margin-left: 15px;
      border-radius: 15px;
      font-size: 14px;
    }
    .tag-active {
      // color: #fff;
      // background: #106cff;
      color: #106cff;
      background: rgba(25, 137, 250, 0.2);
    }
  }
  .card {
    width: calc(100vw - 20px);
    margin: 10px;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    background: #fff;
    position: relative;
    .function {
      width: 84px;
      height: 84px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      font-size: 13px;
      margin-right: 20px;
      .icon-view {
        width: 48px;
        height: 48px;
        background: linear-gradient(301deg, #0071c6 0%, #0090d9 100%);
        box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0, 117, 200, 0.37);
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
  }
  .rank-view {
    .th {
      .td {
        line-height: 22px;
        &:first-child {
          min-width: 102px;
        }
        &:nth-child(2) {
          min-width: 93px;
        }
      }
    }
    .tr {
      .td {
        line-height: 22px;
        &:first-child {
          min-width: 102px;
        }
        &:nth-child(2) {
          min-width: 93px;
        }
      }
    }
  }
  .th {
    display: flex;
    font-weight: 500;
    padding: 6px 0;
    border-bottom: 3rpx solid #ebedf0;
    .td {
      flex: 1;
      text-align: left;
      font-size: 14px;
      color: #646566;
      &:first-child {
        margin-left: 5px;
      }
      &:last-child {
        text-align: right;
      }
    }
  }
  .tr {
    display: flex;
    border-bottom: 1px solid #ebedf0;
    padding: 6px 0;
    .td {
      flex: 1;
      text-align: left;
      font-size: 14px;
      color: #646566;
      &:first-child {
        margin-left: 5px;
      }
      &:last-child {
        text-align: right;
      }
    }
    &:last-child {
      border-bottom: none;
    }
  }
  .rank-view {
    padding-bottom: 124px;
  }
  .growth-bottom {
    position: fixed;
    bottom: 0;
    background-color: #f9f9f9;
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.12);
    .card {
      padding: 10px;
    }
  }
}
</style>
