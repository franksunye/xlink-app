<template>
  <view class="account">
    <view class="bg" v-if="page != 3" style="min-height: 180px">
      <view class="bgTitle">免费估价 精准报价</view>
      <view class="bgCenter">
        <view class="bgCenterLine">——</view>
        <view class="bgCenterText">累计服务228万个家庭</view>
        <view class="bgCenterLine">——</view>
      </view>
      <view class="bgLastblok">
        <view class="bgLastblokCenter">选择部位</view>
        <view style="display: flex; align-items: center; padding: 0 10px 0 10px">
          <view class="triangle"></view>
          <view class="dotted"></view>
        </view>
        <view class="bgLastblokCenter">选择状态</view>
        <view style="display: flex; align-items: center; padding: 0 10px 0 10px">
          <view class="triangle"></view>
          <view class="dotted"></view>
        </view>
        <view class="bgLastblokCenter">生成报价</view>
      </view>
    </view>
    <!-- 选择部位 -->
    <view class="block" v-if="page == 1">
      <!-- 城市选择 -->
      <view style="padding: 10px 10px 5px 10px">
        <uni-data-select
          v-model="data.city"
          :localdata="options.city"
          placeholder="所在地"
        ></uni-data-select>
      </view>
      <!-- 标题 -->
      <view class="title">选择您的维修部位</view>
      <!-- 部位 -->
      <view class="repairParts">
        <view @click="select(item)" v-for="(item, i) in repairPartsData" :key="i" class="imgCard">
          <view class="img">
            <image :src="item.pic" mode="widthFix" style="width: 86px; border-radius: 8px"></image>
          </view>
          <view class="text">{{ item.name }}</view>
          <view style="padding: 0 8px 0px 8px; width: 100%; height: 23px">
            <image
              v-if="selectData.val == item.val"
              src="../../static/images/doCheck.png"
              mode="widthFix"
              style="width: 28px; height: 20px"
            ></image>
            <image
              v-if="selectData.val != item.val"
              src="../../static/images/check.png"
              mode="widthFix"
              style="width: 28px; height: 20px"
            ></image>
          </view>
        </view>
      </view>
    </view>
    <!-- 选择渗漏原因 -->
    <view class="block" v-if="page == 2">
      <view v-if="backShow">
        <page-container
          :show="backShow"
          :overlay="false"
          @beforeleave="beforeleave"
        ></page-container>
      </view>
      <!-- 标题 -->
      <view>
        <view v-if="data.repairParts.val == '6' || data.repairParts.val == '7'" class="title">
          请填写尺寸
        </view>
        <view v-if="data.repairParts.val == '6' || data.repairParts.val == '7'"></view>
        <view></view>
      </view>
      <view style="display: flex">
        <view class="title" style="padding: 20px 0px 10px 10px">选择您的渗漏状态</view>
        <view class="title2">（多选）</view>
      </view>
      <!-- 渗漏原因 -->
      <view class="repairParts">
        <!-- leakage[data.repairParts.type] -->
        <view
          @click="multiple(item)"
          v-for="(item, i) in leakage[data.repairParts.type]"
          :key="i"
          class="imgCard"
        >
          <view class="img">
            <image :src="item.pic" mode="widthFix" style="width: 86px; border-radius: 8px"></image>
          </view>
          <view class="text">{{ item.name }}</view>
          <view style="padding: 0 8px 0px 8px; width: 100%; height: 23px">
            <image
              v-if="multipleData.includes(item.val)"
              src="../../static/images/doAdd.png"
              mode="widthFix"
              style="width: 28px; height: 20px"
            ></image>
            <image
              v-if="!multipleData.includes(item.val)"
              src="../../static/images/add.png"
              mode="widthFix"
              style="width: 28px; height: 20px"
            ></image>
          </view>
        </view>
      </view>
    </view>
    <!-- 结果 -->
    <view v-if="page == 3 && quotationCalculatorData.length > 0">
      <view class="bg3">
        <!-- 选择质保年限 -->
        <view class="bg3Life">
          <view style="padding-right: 20px">质保年限选择</view>
          <view class="bg3LifeNum" v-for="(item, index) in quotationCalculatorData" :key="index">
            <view
              @click="doAgelimit(item)"
              :class="doAgelimitData._id == item._id ? 'numClick' : 'num'"
            >
              {{ item.agelimit }}年
            </view>
            <!-- <view class="numClick">5年</view>
            <view class="num">10年</view> -->
          </view>
        </view>
        <view class="windowType" v-if="selectData.val == '7'">
          <view :class="doAgelimitData.windowType == '1' ? 'windowTypeBlock1' : 'windowTypeBlock2'">
            <view>
              <image
                v-if="doAgelimitData.windowType == '1'"
                src="../../static/images/keepWarm.png"
                mode="widthFix"
                style="width: 22px; height: 22px"
              ></image>
              <image
                v-if="doAgelimitData.windowType == '0'"
                src="../../static/images/unKeepWarm.png"
                mode="widthFix"
                style="width: 22px; height: 22px"
              ></image>
            </view>
            <view style="padding-left: 30px">有保温</view>
          </view>
          <view :class="doAgelimitData.windowType == '0' ? 'windowTypeBlock1' : 'windowTypeBlock2'">
            <view>
              <image
                v-if="doAgelimitData.windowType == '0'"
                src="../../static/images/keepWarm.png"
                mode="widthFix"
                style="width: 22px; height: 22px"
              ></image>
              <image
                v-if="doAgelimitData.windowType == '1'"
                src="../../static/images/unKeepWarm.png"
                mode="widthFix"
                style="width: 22px; height: 22px"
              ></image>
            </view>
            <view style="padding-left: 30px">无保温</view>
          </view>
        </view>
        <!-- <view class="windowType" v-if="selectData.val == '7'">
          <view style="padding-right: 20px">窗户类型</view>
          <view class="windowTypeNum">
     
            <view :class="doAgelimitData.windowType == '0' ? 'numClick' : 'num'">无保温窗户</view>
            <view :class="doAgelimitData.windowType == '1' ? 'numClick' : 'num'">有保温窗户</view>
          </view>
        </view> -->
        <!-- 原因 -->
        <view class="bg3Reason">
          <view style="width: 30%">
            <view style="padding-bottom: 5px">参考价</view>
            <view style="display: flex">
              <view>¥</view>
              <!-- 单价 -->
              <view style="font-size: 30px; font-style: normal; font-weight: 600">
                {{ doAgelimitData.agelimitPrice || '' }}
              </view>
              <view style="padding-top: 15px">元</view>
              <view style="font-size: 30px; font-style: normal">/</view>
              <!-- 单位 -->
              <view style="padding-top: 15px; word-break: keep-all; white-space: nowrap">
                {{ codelabel('unit', doAgelimitData.unit) || '' }}
              </view>
            </view>
          </view>
          <view style="width: 70%" class="card">
            <!-- 部位、渗漏原因、套餐 -->
            <view>
              根据您已选情况“{{ selectData.name }}：{{
                codelabelForArray('QCleakageState', data.leakageReason) || ''
              }}”推荐您选用“{{ doAgelimitData.projPackagesLabel }}”
            </view>
            <view style="display: flex; justify-content: flex-end; padding-top: 15px">
              <uni-icons type="location-filled" size="12px" color="#fff" />
              <!-- 城市 -->
              <view>{{ codelabel('city', data.city) || '' }}</view>
            </view>
          </view>
        </view>
        <!-- 图片 -->
        <view class="bg3Img">
          <view>
            <view class="imgCard">
              <view class="img">
                <image
                  :src="selectData.pic"
                  mode="widthFix"
                  style="width: 86px; border-radius: 8px"
                ></image>
              </view>
              <view class="text">{{ selectData.name }}</view>
              <view style="padding: 0 8px 8px 8px; width: 100%; height: 23px">
                <image
                  src="../../static/images/doCheck.png"
                  mode="widthFix"
                  style="width: 28px"
                ></image>
              </view>
            </view>
          </view>
          <block v-for="(item, i) in leakage[selectData.type]" :key="i">
            <view class="imgCard" v-if="data.leakageReason.indexOf(item.val) != -1">
              <view class="img">
                <image
                  :src="item.pic"
                  mode="widthFix"
                  style="width: 86px; border-radius: 8px"
                ></image>
              </view>
              <view class="text">{{ item.name }}</view>
              <view style="padding: 0 8px 8px 8px; width: 100%; height: 23px">
                <image
                  src="../../static/images/doCheck.png"
                  mode="widthFix"
                  style="width: 28px"
                ></image>
              </view>
            </view>
          </block>
        </view>
      </view>
      <!-- 固定说明 -->
      <view
        style="
          color: #736e6e;

          font-family: Inter;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          margin: 15px;
        "
      >
        *{{ doAgelimitData.description }}
      </view>
    </view>
    <view v-if="page == 3 && quotationCalculatorData.length == 0" style="margin-top: 200px">
      <view class="c-uni-empty">
        <image src="https://pub.fsgo365.cn/empty.png"></image>
        <text>暂无报价，敬请期待！</text>
      </view>
    </view>
    <!-- 底部按钮群 -->
    <view class="flexBtn">
      <view v-if="page == 1" class="nextBtn" @click.native="doNext(1)">下一步</view>
      <view v-if="page == 2" class="doBtn" @click.native="doNext(2)">免费估价</view>
      <view v-if="page == 3" class="nextBtn" @click.native="doNext(3)">重新估算</view>
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../common/common.js');
export default {
  data() {
    return {
      params: {},
      systemInfo: {
        menuButtonObject: {}
      },
      options: {
        orgs: [],
        roles: [],
        codecfg_windowType: { codeId: 'keepWarm' },
        codecfg_unit: { codeId: 'UNIT' },
        codecfg_QCleakageState: { codeId: 'QCleakageState' },
        codecfg_agelimit: { codeId: 'agelimit' },
        codecfg_city: { codeId: 'regions' }
      },
      cityShow: false,
      // emptyShwo: false,
      page: 1,
      data: {
        isData: '', //有无数据
        city: '110000', //城市选择
        repairParts: { type: '' }, //维修部位
        leakageReason: [], //渗漏状态
        // agelimitFilter: '', //质保年限
        long: '',
        wide: '',
        sum: ''
      },

      repairPartsData: [
        {
          val: '1',
          name: '彩钢屋面',
          pic: 'https://pub.fsgo365.cn/caigangwumian.png',
          type: 'leakageStateDataOther'
        },
        {
          val: '2',
          name: '采光屋面',
          pic: 'https://pub.fsgo365.cn/caiguangwumian.png',
          type: 'leakageStateDataOther'
        },
        {
          val: '3',
          name: '外墙',
          pic: 'https://pub.fsgo365.cn/waiqiang.png',
          type: 'leakageStateDataWall'
        },
        {
          val: '4',
          name: '上人露台',
          pic: 'https://pub.fsgo365.cn/shangrenlutai.png',
          type: 'leakageStateDataOther'
        },
        {
          val: '5',
          name: '普通屋面',
          pic: 'https://pub.fsgo365.cn/putongwumian.png',
          type: 'leakageStateDataOther'
        },
        {
          val: '6',
          name: '卫生间',
          pic: 'https://pub.fsgo365.cn/weishengjian.png',
          type: 'leakageStateDataToilet'
        },
        {
          val: '7',
          name: '窗户',
          pic: 'https://pub.fsgo365.cn/chuanghu.png',
          type: 'leakageStateDataWall'
        },
        {
          val: '8',
          name: '地下室',
          pic: 'https://pub.fsgo365.cn/dixiashi.png',
          type: 'leakageStateDataOther'
        },
        {
          val: '9',
          name: '斜坡屋面',
          pic: 'https://pub.fsgo365.cn/xiepowumian.png',
          type: 'leakageStateDataOther'
        }
      ],
      leakage: {
        // 其他部位渗漏原因
        leakageStateDataOther: [
          { val: '1', name: '滴水', pic: 'https://pub.fsgo365.cn/qitadishui.png' },
          { val: '2', name: '洇湿', pic: 'https://pub.fsgo365.cn/qitayinshi.png' },
          { val: '3', name: '损坏', pic: 'https://pub.fsgo365.cn/qitasunhuai.png' },
          { val: '4', name: '发霉', pic: 'https://pub.fsgo365.cn/qitafamei.png' }
        ],
        // 外墙、窗户部位渗漏原因
        leakageStateDataWall: [
          { val: '4', name: '发霉', pic: 'https://pub.fsgo365.cn/waiqiangfamei.png' },
          { val: '5', name: '起皮', pic: 'https://pub.fsgo365.cn/waiqiangqipi.png' },
          { val: '2', name: '洇湿', pic: 'https://pub.fsgo365.cn/waiqiangyinshi.png' },
          { val: '3', name: '损坏', pic: 'https://pub.fsgo365.cn/waiqiangsunhuai.png' }
        ],
        // 卫生间部位渗漏原因
        leakageStateDataToilet: [
          { val: '5', name: '起皮', pic: 'https://pub.fsgo365.cn/weishengjianqipi.png' },
          { val: '6', name: '变形', pic: 'https://pub.fsgo365.cn/weishengjianbianxing.png' },
          { val: '2', name: '洇湿', pic: 'https://pub.fsgo365.cn/weishengjianyinshi.png' }
        ]
      },
      selectData: [], //部位单选数据
      multipleData: [], //渗漏原因多选数据
      quotationCalculatorData: [], //计算器数据
      backShow: true,
      doAgelimitData: {}, //选择年限数据
      userData: {} //缓存中的user信息
    };
  },

  onLoad(params) {
    // 扫二维码进入报单页
    if (params.q) {
      // 解析链接携带参数
      var url = decodeURIComponent(params.q);
      if (url.indexOf('?') != -1) {
        let str = url.split('?')[1];
        if (str) {
          let arr = str.split('&');
          if (arr) {
            let obj = {};
            for (let item of arr) {
              obj[item.split('=')[0]] = item.split('=')[1];
            }
            params = obj;
          }
        }
      }
      this.params = params;
    } else {
      this.params = params;
    }
    common.osg.init(this, params, app);

    this.systemInfo = app.globalData.systemInfo;
    this.userData = wx.getStorageSync('user') || {};
    common.osg.codeoption(() => {
      this.$forceUpdate();
    });
    // wx.enableAlertBeforeUnload({
    //   message: '请您填写数据',
    //   success: () => {
    //     this.page = 1;
    //   }
    // });
  },

  onShow() {},
  onunload() {},

  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    format(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (!val || val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    onChange(e) {
      let key = e.target.dataset.key;
      this.data[key] = e.detail;
    },
    //反显字典表
    codelabel: function (codeType, codeValue) {
      var opts = this.options[codeType];
      if (opts) {
        for (var i = 0; i < opts.length; i++) {
          if (codeValue == opts[i].value) return opts[i].name;
        }
      }
      if (!codeValue) {
        return codeValue;
      } else {
        return '未知';
      }
    },
    //value为数组、opt.value为字符串
    codelabelForArray: function (codeType, codeValue, opts) {
      var opts = this.options[codeType] || this.options[codeType.toLowerCase()]; // 避免有些字典表codeType是大写,预置没有
      if (opts && codeValue) {
        if (opts.constructor != Array) return;
        var str = '';
        for (var i = 0; i < opts.length; i++) {
          for (var j = 0; j < codeValue.length; j++) {
            if (codeValue[j] == opts[i].value) str += opts[i].name + '、';
          }
        }
        str = str.substring(0, str.length - 1);
        return str;
      }
      if (!codeValue) {
        return codeValue;
      } else {
        return '未知';
      }
    },
    pickerConfirmG(val, e) {
      if (val == 'city') {
        this.data.city = e.detail.value;
        console.log(this.data.city, '---data中的城市');
        this.cityShow = false;
      }
    },
    pickerDefCloseG(val) {
      if (val == 'city') {
        this.cityShow = false;
      }
    },
    // 页面返回事件
    beforeleave() {
      this.backShow = false;
      this.page = 1;
      this.multipleData = [];
      this.backShow = true;
    },
    doNext(val) {
      if (val == 1) {
        if (!this.data.city) {
          common.osg.toast('请选择所在城市', 'none');
          return;
        }
        if (this.selectData.length == 0) {
          common.osg.toast('请选择维修部位', 'none');
          return;
        }
        console.log(this.selectData, '---this.selectData');
        this.data.repairParts = this.selectData;
        this.page = this.page + 1;
        console.log(this.data.repairParts, '---data中的部位');
        console.log(this.data.repairParts.type, '---type');
      }
      if (val == 2) {
        if (this.multipleData.length == 0) {
          common.osg.toast('请选择渗漏原因', 'none');
          return;
        }
        if (this.data.repairParts.val == '6' || this.data.repairParts.val == '7') {
          if (!this.data.long && !this.data.wide) {
            common.osg.toast('请填写长和宽', 'none');
            return;
          }
          this.data.sum = this.data.long * this.data.wide;
          console.log(this.data.sum);
        }
        this.data.leakageReason = this.multipleData;
        console.log(this.data.leakageReason, '---this.data.leakageReason');
        this.getData();
        console.log(this.data, '------免费报价后的this.data');
        // this.emptyShwo = true;
        this.page = this.page + 1;
      }
      // 重新估算
      if (val == 3) {
        this.page = 1;
        this.data = {};
        this.selectData = [];
        this.multipleData = []; //渗漏原因多选数据
        this.quotationCalculatorData = []; //计算器数据
        this.doAgelimitData = {};
        this.data.isData = '';
        this.data.city = '110000';
        // this.emptyShwo = false;
      }
    },
    doBack() {
      this.page = this.page - 1;
    },
    getData() {
      common.osg.ajax(
        'biz/extForm/queryByColName/quotationCalculator.do',
        {
          // page: 1,
          // rows: 100,
          sortField: 'agelimit',
          sortOrder: 'asc',
          'is:state|integer#and': 1,
          'is:city|string#and': this.data.city,
          'is:repairParts|string#and': this.data.repairParts.val
        },
        res => {
          // if (res.data.length > 0) {
          //   this.data.isData = '1';
          // } else {
          //   this.data.isData = '0';
          // }
          if (this.data.sum) {
            // let arr = [];
            res.data.map(item => {
              if (item.maxiMum >= this.data.sum && this.data.sum >= item.miniMum) {
                this.quotationCalculatorData.push(item);
                console.log(item, '--iteitemm');
              }
            });
          } else {
            this.quotationCalculatorData = res.data;
          }
          this.doAgelimitData = this.quotationCalculatorData[0];
          if (this.quotationCalculatorData.length > 0) {
            this.data.isData = '1';
          } else {
            this.data.isData = '0';
          }
          this.doSaveData();
          // this.emptyShwo = false;
        }
      );
    },
    doSaveData() {
      var params = this.data;
      params.repairParts = params.repairParts.val;
      params.userPhone = this.userData.phone || '';
      params.userName = this.userData.name || '';
      params.tenantId = '1340835581184723420'; //默认租户id
      params.state = 1;
      // 缓存渠道信息
      if (this.params.channel) {
        params.channel = this.params.channel || '';
      } else {
        params.channel = this.userData.accountType || '';
      }
      console.log(params, '---保存的params');
      common.osg.ajax(
        'biz/extForm/upsert/8521033180460304868.do',
        {
          dataStr: JSON.stringify(params)
        },
        res => {}
      );
    },

    // 部位单选
    select(e) {
      this.selectData = e;
      // this.$forceUpdate();
      console.log(this.selectData, '---- this.selectData');
    },
    // 渗漏原因多选
    multiple(e) {
      if (!this.multipleData.includes(e.val)) {
        this.multipleData.push(e.val); // 判断已选列表中是否存在该id，不是则追加进去
        console.log(this.multipleData, '--this.multipleData1111');
      } else {
        let index = this.multipleData.indexOf(e.val); // 求出当前id的所在位置
        this.multipleData.splice(index, 1); // 否则则删除
        console.log(this.multipleData, '--this.multipleData2222');
      }
    },
    // 选择年限
    doAgelimit(e) {
      this.doAgelimitData = e;
      console.log(this.doAgelimitData, '---this.doAgelimitData');
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  height: 100vh;
  overflow-y: auto;
  // padding-bottom: 30px;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.bg {
  // padding-bottom: 35px;
  width: 100vw;
  height: 180px;
  background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
  text-align: center;
  .bgTitle {
    padding: 25px 0 10px 0;
    color: #fff;
    text-align: center;
    font-family: Inter;
    font-size: 30px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
  }
  .bgCenter {
    display: flex;
    justify-content: center;
    .bgCenterText {
      color: #fff;
      text-align: center;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
      line-height: 40px;
      padding: 0 5px 0 5px;
    }
    .bgCenterLine {
      color: #fff;
      text-align: center;
      font-family: Inter;
      font-size: 30px;
      font-style: normal;
      font-weight: 100;
      line-height: normal;
    }
  }
  .bgLastblok {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    .bgLastblokCenter {
      color: #fff;
      text-align: center;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
    }
    .triangle {
      width: 0px;
      height: 0px;
      border: 6px solid transparent; /*以下四个样式对应四种三角形，任选其一即可实现*/
      border-left-color: #f9de55;
      // border-right-color: #f9de55;
      // border-bottom-color: lightseagreen;
    }
    .dotted {
      width: 40px;
      border-bottom: 1px dotted #fff;
    }
  }
}
.block {
  padding: 5px 15px 15px 15px;
  background: #fff;
  margin: 0 15px;
  margin-top: -25px;
  border-radius: 8px;
  ::v-deep .van-cell {
    border-radius: 8px !important;
  }
  .title {
    padding: 10px 10px 10px 10px;
    color: #000;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .title2 {
    color: #736e6e;
    font-family: Inter;
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    padding: 25px 10px 10px 0px;
  }
  .imgCard {
    border-radius: 8px;
    background: #f8f8f8;
    .img {
      text-align: center;
      padding: 5px;
    }
    .text {
      padding: 3px 10px 3px 10px;
      color: #000;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }

  ::v-deep.van-field__label {
    color: #000 !important;
    text-align: center;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 200;
    line-height: normal;
  }
  ::v-deep .van-cell__title {
  }
  ::v-deep .van-cell__value {
    font-size: 14px;
  }
}

.repairParts {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 30%);
  grid-column-gap: 15px;
  place-items: center;
  grid-row-gap: 5px;
}
.bg3 {
  background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
  overflow: hidden;
  .bg3Life {
    padding: 30px 15px;
    display: flex;
    color: #fff;
    // text-align: center;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    .bg3LifeNum {
      display: flex;
      .num {
        border-radius: 50px;
        width: 40px;
        border: 0.6px solid #fff;
        text-align: center;
        margin-right: 10px;
      }
      .numClick {
        border-radius: 50px;
        width: 40px;
        border: 0.6px solid #f9de55;
        text-align: center;
        margin-right: 10px;
        color: #f9de55;
      }
    }
  }
  // .windowType {
  //   padding: 0 15px 5px 15px;
  //   margin-top: -15px;
  //   display: flex;
  //   color: #fff;
  //   // text-align: center;
  //   font-family: Inter;
  //   font-size: 14px;
  //   font-style: normal;
  //   font-weight: 500;
  //   line-height: normal;
  //   .windowTypeNum {
  //     display: flex;
  //     .num {
  //       width: 100px;
  //       border-radius: 50px;
  //       border: 0.6px solid #fff;
  //       text-align: center;
  //       margin-right: 10px;
  //     }
  //     .numClick {
  //       width: 100px;
  //       border-radius: 50px;
  //       border: 0.6px solid #f9de55;
  //       text-align: center;
  //       margin-right: 10px;
  //       color: #f9de55;
  //     }
  //   }
  // }
  .windowType {
    margin: 0 15px 5px 15px;
    margin-top: -15px !important;
    font-family: Inter;
    font-size: 14px;
    display: flex;
    text-align: center;
    border-radius: 8px;
    background: #f0f0f0;
    .windowTypeBlock1 {
      width: 50%;
      // width: 160px;
      height: 32px;
      display: flex;
      align-items: center;
      color: #000;
      border-radius: 6px;
      background: #fff;
      padding: 0 15px;
    }
    .windowTypeBlock2 {
      width: 50%;
      // width: 160px;
      height: 32px;
      display: flex;
      align-items: center;
      color: #999;
      border-radius: 6px;
      background: #f0f0f0;
      padding: 0 15px;
    }
  }
  .bg3Reason {
    display: flex;
    align-items: center;
    padding: 0 15px;
    color: #fff;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    .card {
      padding: 15px;
      font-size: 12px;
      margin-left: 55px;
      background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
      box-shadow: 0px 4px 8px 0px #1c69e2;
      border-radius: 8px;
    }
  }
  .bg3Img {
    padding: 25px 0 25px 30px;
    display: flex;
    grid-column-gap: 8px;
    width: 100%;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
    .imgCard {
      display: inline-block;
      border-radius: 8px;
      background: #f8f8f8;
      .img {
        text-align: center;
        padding: 5px;
      }
      .text {
        padding: 3px 10px 3px 10px;
        color: #000;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
    > view:last-child {
      margin-right: 40px;
    }
  }
}
.flexBtn {
  padding-bottom: 15px;
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  // margin-bottom: 15px;

  .nextBtn {
    width: 306px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 8px;
    background: #508af6;
    color: #fff;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 34px;
  }
  .doBtn {
    width: 306px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 8px;
    background: #f9de55;
    color: #000;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 34px;
  }
  // .returnBtn {
  //   width: 306px;
  //   height: 34px;
  //   flex-shrink: 0;
  //   border-radius: 8px;
  //   background: #71bafc;
  //   color: #000;
  //   font-family: Inter;
  //   font-size: 14px;
  //   font-style: normal;
  //   font-weight: 600;
  //   line-height: 34px;
  // }
}
// .doclick {
//   height: 100px;
//   width: 120px;
//   display: flex;
//   align-items: center;
//   border: 2px dashed #106cff;
//   border-radius: 8px;
// }
// .successIcon {
//   position: absolute;
//   left: 45px;
//   top: 70px;
// }
// .successIconNone {
//   display: none;
// }
// .title {
//   font-size: 18px;
//   font-weight: 600;
// }
// .title2 {
//   font-size: 16px;
// }

// .description {
//   margin: 20px 10px;
//   tab-size: 14px;
//   border: 2px solid #ffc658;
//   border-radius: 8px;
//   padding: 10px;
// }
// .agelimitText {
//   font-size: 14px;
//   font-weight: 600;
//   margin-bottom: 10px;
// }
</style>
