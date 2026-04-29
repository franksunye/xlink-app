<template>
  <view class="page">
    <!-- 管家指标页面 -->
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
        <view class="item" v-for="item in mergedOrderList" :key="item._id">
          <view class="c-size-18">
            <text class="c-m-r-20">
              {{ '#' + item.orderNum.slice(-4) }}
            </text>
            <text class="c-m-r-20">
              {{ areaList.county_list[Number(item.district)] || '' }}
            </text>
            <block v-if="item.exts && item.exts.primaryLeakagesiteCode">
              <text class="c-m-r-20">
                {{ positionReversal('repairParts', item.exts.primaryLeakagesiteCode) || '未知' }}
              </text>
            </block>
          </view>
          <view class="c-flex" style="margin: 10px 0px">
            <view style="display: flex; align-items: baseline; margin-right: 15px">
              <text>接单人</text>
              <text
                :class="['c-size-18', item.isAccepted ? 'c-blue' : 'c-red']"
                style="margin-left: 5px; font-weight: bold"
              >
                {{ item.maxScore || '唯一' }}
              </text>
              <text class="c-size-12" v-if="item.isAccepted">（我）</text>
            </view>

            <view
              v-if="!userInResourcePool"
              style="display: flex; align-items: baseline; margin-right: 15px"
            >
              <block v-if="!item.isAccepted && item.individualScore">
                <text>我</text>
                <text class="c-size-18" style="margin-left: 5px; color: #000; font-weight: bold">
                  {{ item.individualScore || '' }}
                </text>
              </block>
            </view>
          </view>
          <van-divider v-if="!userInResourcePool" customStyle="margin: 10px 0px" />

          <view
            v-if="!userInResourcePool"
            class="c-size-16"
            style="display: flex; align-items: center"
          >
            <!-- <van-icon
              v-if="item.isAccepted"
              style="margin-right: 10px"
              color="#106cff"
              size="22"
              name="checked"
            />
            <van-icon v-else color="#d6000f" style="margin-right: 10px" size="20" name="clear" /> -->
            {{ item.content || '' }}
            <text :style="{ color: item.isAccepted ? '#106cff' : '#d6000f', marginLeft: '8px' }">
              {{ item.isAccepted ? '满足' : '不满足' }}
            </text>
          </view>
        </view>
      </block>
      <block v-else>
        <van-empty image="search" description="暂无数据" />
      </block>
    </view>
    <van-toast id="van-toast" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
import Toast from '../../wxcomponents/vant/toast/toast';

export default {
  data() {
    return {
      serviceResourceId: '',
      currentLoggedInName: '', //当前登录人的名称
      userId: '', //当前登录人的Id
      userInResourcePool: false, //当前登录人是否在新手资源池中
      orderList: [], //拿到的工单数据
      mergedOrderList: [], //处理好分单数据后 的数据源
      range: [], //选择服务区域下拉选项 数据源
      rangeValue: '', //选择服务区域下拉选项的值
      rangeValue1: '', //选择服务区域下拉选项的值
      selectParts: [], //部位下拉选项
      selectPartsValue: '', //部位下拉选项 数据源
      province: '', //运营中心 省
      options: {
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        }
      },
      // 省市区
      areaList: Object.assign({}, areajs.default)
    };
  },
  onLoad() {
    this.getMyOperation();
    this.serviceResourceId = wx.getStorageSync('user').serviceResourceId;
    this.currentLoggedInName = wx.getStorageSync('user').name;
    this.userId = wx.getStorageSync('user')._id;

    this.getData();
    common.osg.init(this, {}, app);
    common.osg.codeoption(() => {
      console.log('this.options', this.options);
      this.isInResourcePool();

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

      // sortField: territoryNum,createTime
      // sortOrder: asc
      // is:state|integer#and: 1

      common.osg.ajax(
        'basic/serviceTerritoryCustom/query',
        params,
        res => {
          console.log('查询服务区域111111111', res.data);

          // let stringValue = item.subdistrict ? item.subdistrict : item.district;
          // this.range = res.data.map(item => ({
          //   text: item.name,
          //   value: stringValue.join(',')
          // }));

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
    //查询历史10条工单 匹配分单记录
    getSA() {
      // let abc =
      //   'GD20241100029,GD20241100023,GD20241100022,GD20241100021,GD20241100020,GD20241100019,GD20241100018,GD20241100014,GD20241100013,GD20241100012';
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      });
      let params = {
        page: 1,
        rows: 10,
        sortField: 'createTime',
        sortOrder: 'desc',
        'in:state|integer#and': 1,
        'all:exts.primaryLeakagesiteCode|array#and': this.selectPartsValue,
        'in:subdistrict|array#and': this.rangeValue1,
        'is:province|string#and': this.province,
        notFilterBelongTo: '1',
        notFilterOrgId: '1',
        // 'in:orderNum|array#and': abc
        'is:exts.scheduleFlag|string#and': 1 //调度标识

        // 'nin:exts.leakagesite_copy|array#and': '2,7',
        // 'gte:status|string#and': '104', //工单状态大于104
        // 'exists:exts.specialFlag|boolean#and': false, //不要卫生间专项
        // 'exists:exts.assignServiceResourceId|boolean#and': false //不要指定服务资源的
      };
      common.osg.ajax('basic/serviceAppointment/query', params, res => {
        //存储一下当前拿到的工单数据
        this.orderList = res.data;
        const orderNumbersStr = res.data.map(item => item.orderNum).join(',');
        if (orderNumbersStr) {
          this.getFD(orderNumbersStr);
          // this.getFD('GD2025032955');
        } else {
          this.mergedOrderList = [...res.data];
          Toast.clear();
        }
      });
    },
    //查询分单日志
    getFD(ids) {
      console.log(1111, ids);
      let params = {
        _all: '1',
        'in:state|array-integer#and': '0,1',
        sortField: 'createTime',
        sortOrder: 'desc',
        'in:bizCode|array#and': ids,
        // 'ne:title|string#and': '匹配服务资源组',
        'ne:title|string#or': '综合得分调整',
        // 'exists:optimalUserName|boolean#and': false,
        notFilterBelongTo: '1',
        notFilterOrgId: '1'
      };
      common.osg.ajax('biz/schedulingRecord/query', params, res => {
        //循环处理判断数据 orderList 如果 res.data 的 bizCode === orderList 的 orderNum 向res.data里面添加orderList里面的数据结构
        //翻转一下数组
        let reversedArr = res.data.reverse();
        // 按 bizCode 分组
        let grouped = reversedArr.reduce((acc, item) => {
          let key = item.bizCode;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        // console.log('初始数据', res.data, '翻转后的数据', reversedArr, '分组数据', grouped);

        // 找到最后一个title === “匹配服务资源组” 然后丢弃它及其之前的数据。

        for (let key in grouped) {
          // let sss = [1, 2, 3, 4, 5, 6];
          // let ddd = sss.findLastIndex(item => item == '4');
          // console.log('单元测试', ddd);

          // 找到最后一个 '匹配服务资源组' 的索引
          // let lastIndex = grouped[key].findLastIndex(item => item.title == '匹配服务资源组');

          let lastIndex = -1;
          for (let i = grouped[key].length - 1; i >= 0; i--) {
            if (grouped[key][i].title === '匹配服务资源组') {
              lastIndex = i;
              break;
            }
          }

          if (lastIndex !== -1) {
            // 丢弃它及其之前的项
            let result = grouped[key].slice(lastIndex + 1);
            console.log(
              grouped[key][0].bizCode,
              "找到最后一个 '匹配服务资源组' 的索引丢弃它及其之前的项",
              result
            );

            for (let i = 0; i < result.length; i++) {
              //拿到每一条分单明细
              let order = result[i];

              let a = order.bizCode;
              let targetOrder = this.orderList.find(item => item.orderNum == order.bizCode);
              // console.log('分单策略匹配的工单', targetOrder);
              //是否有最优管家这个字段如果有,那就检查这个最优管家是不是我！
              if (order.optimalUserName) {
                //检查这个最优管家是不是我
                if (order.optimalUserName.trim() == this.currentLoggedInName.trim()) {
                  //是我接到单子
                  targetOrder.content = '最优选择（总分）';
                  //加一个接单的标识
                  targetOrder.isAccepted = true;
                  // 🚀 **跳过下一个 orderNum 等于当前 bizCode 的订单**
                  while (i + 1 < result.length && result[i + 1].bizCode == order.bizCode) {
                    i++; // 直接跳过下一个
                  }
                } else {
                  // let cs = i > 0 ? result[i - 1] : order;
                  //不是我
                  targetOrder.content = this.extractText(order.content);
                }

                //检查是否有得分排行榜
                if (order.cScoreDetailMap && order.cScoreDetailMap.length > 0) {
                  targetOrder.maxScore = order.cScoreDetailMap[0].allScore || 0;
                  const getAllScoreById =
                    order.cScoreDetailMap.find(item => item.userId === this.userId)?.allScore ??
                    null;
                  // console.log('个人的得分', getAllScoreById);
                  targetOrder.individualScore = getAllScoreById;
                } else {
                  // console.log('缺少order.cScoreDetailMap字段');
                }
              } else {
                let regex = new RegExp(`${this.currentLoggedInName}`);
                //没有最优管家这个字段 那就检查检查规则里面是否有我
                let checkNameInText = regex.test(order.content);
                //自己满足当前匹配规则
                if (!checkNameInText) {
                  targetOrder.content = this.extractText(order.content);
                  while (i + 1 < result.length && result[i + 1].bizCode == order.bizCode) {
                    let K = result[i + 1];
                    if (K.optimalUserName && K.cScoreDetailMap && K.cScoreDetailMap.length > 0) {
                      //检查是否有得分排行榜
                      targetOrder.maxScore = K.cScoreDetailMap[0].allScore || 0;
                      const getAllScoreById =
                        K.cScoreDetailMap.find(item => item.userId === this.userId)?.allScore ??
                        null;
                      // console.log('个人的得分', getAllScoreById);
                      targetOrder.individualScore = getAllScoreById;
                    }
                    // console.log(123223333, K);
                    i++; // 直接跳过下一个
                  }
                }
              }
            }
          }
        }

        this.mergedOrderList = [...this.orderList];
        Toast.clear();
        console.log(111222333, this.mergedOrderList);
      });
    },
    //部位反显
    positionReversal(options, value) {
      return common.osg.formatCascadeMultiple(options, value);
    },
    //查询自己是否在资源池
    isInResourcePool() {
      let params = {
        // 'in:exts.sourceType|array#and': '4,2',
        'is:defaultFlag|integer#and': 1,
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': '1',
        //'gte:status|string#and': '104'
        notFilterBelongTo: '1',
        notFilterOrgId: '1'
      };
      common.osg.ajax('biz/serviceResourceGroup/query', params, res => {
        let result = [...new Set(res.data.flatMap(item => item.srIds))];
        this.userInResourcePool = result.includes(this.serviceResourceId);
        console.log('当前我是否在资源池里面', this.userInResourcePool);
      });
    },

    handleRangeChange(value) {
      // 这里可以执行相关逻辑，比如更新其他选项
      const result = this.range.find(item => item.value == value);
      console.log(result);

      this.rangeValue1 = result ? result.subdistrict : '';
      this.getSA();
      // console.log('11111222', value, result.subdistrict);
    },

    handlePartsChange(value) {
      this.selectPartsValue = value;
      this.getSA();
      // 这里可以执行其他逻辑，比如动态更新数据
    },

    //
    getMyOperation() {
      common.osg.ajax('/basic/operation/currentOperation', {}, res => {
        this.province = res.data.province;
        this.getSA();
      });
    },

    //处理字符串的方法
    extractText(input) {
      //文字处理操作
      if (input.includes('匹配规则-')) {
        console.log(input.split('-')[0]);
        return input.split('-')[0];
      }

      if (input.includes(')-')) {
        //处理前 --->匹配的调度策略(北京刷新服务||1067897691739604801)-规则匹配成功只有一个服务资源,默认分派此服务资源:张洋洋
        //处理后 --->规则匹配成功只有一个服务资源,默认分派此服务资源:张洋洋
        return input.split(')-')[1].trim();
      }

      if (input.includes('||') && input.includes('标,综')) {
        //处理前 --->  按照调度策略的调度目标,综合得分信息比例分配为:周志敏||1701276900428460206||89.43
        //处理后 --->  按照调度策略的调度目标,综合得分信息比例分配为:周志敏
        //综合得分信息比例分配
        return input.split(',')[1].split('为:')[0];
      }

      if (input.includes('按照新人接单上限限制')) {
        // 处理前 ---> 按照新人接单上限限制,通过人员信息为:["林旭东(1|2)"];未通过人员信息为:[]
        // 处理后 ---> 新人接单上限限制
        return '新人接单上限限制';
      }
      return input;
    },
    // 如果你的运行环境（比如部分旧版浏览器、某些小程序环境）不支持
    findLastIndexPolyfill(arr, predicate) {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i], i, arr)) {
          return i;
        }
      }
      return -1;
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
  padding: 1px 0px;
  .item {
    width: 95vw;
    height: auto;
    padding: 10px 15px;
    margin: 0px auto 10px;
    box-sizing: border-box;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
  }
}
::v-deep .uni-forms-item {
  margin-bottom: 16px !important;
}
</style>
