<template>
  <view>
    <!-- 过滤 -->
    <!-- <view class="c-header" style="z-index: 2">
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        use-action-slot
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20"
      ></van-search>
    </view> -->

    <!-- 新列表 -->
    <view class="c-content">
      <view>
        <view class="c-card">
          <view style="margin: 5px 0">
            <view>
              <text style="font-weight: bolder; font-size: 16px">
                {{ activityDefData.name }}
              </text>
            </view>
            <view style="margin-left: 20px; float: right">
              <van-tag color="#1989fa" size="medium">
                {{ codelabel('state', activityDefData.state) || '' }}
              </van-tag>
            </view>
          </view>
          <view class="c-card-content" style="margin: 5px 0; padding: 0">
            <text>{{ activityDefData.startDate }}~{{ activityDefData.endDate }}</text>
          </view>
          <view v-for="(item, index) in activityDefData.exts.desc" :key="index">
            <image style="width: 100%" :src="item.url" mode="widthFix" />
          </view>
        </view>
        <!-- </view> -->
      </view>
    </view>
    <!-- exts.myState     0报名 1签到, 当到达开始时间点击报名myState=1 -->
    <view class="orgUser-add">
      <view
        v-show="activityDefData.exts.myState !== 1 && activityDefData.exts.myState !== 0"
        @click="doEnroll()"
      >
        <van-icon name="add" class="c-blue" />
        <text>报名</text>
      </view>
      <view v-show="activityDefData.exts.myState == 0 && signIn" @click="doSignIn()">
        <van-icon name="add" class="c-blue" />
        <text>签到</text>
      </view>
      <view
        @click="
          doOpen('../../pages/declaration/declaration' + '?partnerId=' + params.partnerId, {
            shareUserId: params.shareUserId || '',
            channelType: params.channelType || ''
            // channelId: params.channelId || ''
          })
        "
      >
        <van-icon name="orders-o" class="c-blue" />
        <text>预约报单</text>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      phone: '',
      windowHeight: '',
      reachBottom: false, //是否触底 正在刷新
      boundings: [], //外层列表每页数据的边界值
      index: 0, //当前页码
      list: [], //全部已获取数据
      initParams: {}, //页面初始参数
      params: {}, //页面参数
      userinfo: {}, //user对象
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
        codecfg_state: {
          codeId: 'enable'
        }
      },
      // 省市区
      areaList: Object.assign({}, areajs.default),
      activityDefData: {},
      signIn: false, //是否可以签到
      enroll: false //是否可以报名
    };
  },
  methods: {
    onLoad: function (params) {
      this.doInit(params);
    },
    doInit(params) {
      // 收起服务内容
      // this.tabClick('1');
      // 收起收费标准

      // 保存初始参数 跳转到授权页携带 授权后返回此页面时携带
      if (params.q && params.url) {
        params.q = decodeURI(params.q);
      }
      this.initParams = common.osg.deepCopy(params);
      console.log('initParams', this.initParams);
      // 扫二维码进入小程序 处理参数风格统一
      if (params.q) {
        wx.hideHomeButton(); // 扫码进入不允许返回首页
        // 截取所有参数放到this.params
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
      }
      this.params = params;
      console.log('params', params);
      common.osg.init(this, params, app);
      this.userinfo = common.osg.currentUser();

      //调用登陆接口的参数
      if (params.shareType == 1 || params.shareType == 2) {
        if (!params.from) {
          wx.setStorageSync('shareParams', {
            shareType: this.params.shareType,
            shareTypeId: this.params.shareTypeId,
            allotOrgId: this.params.allotOrgId,
            shareUserId: this.params.shareUserId,
            channelId: this.params.channelId,
            partnerId: this.params.partnerId
          });
          wx.hideHomeButton();
        }
      }

      // 分享
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage']
      });

      // 判断是否登录
      if (!common.osg.isLogined()) {
        common.osg.doLogin(
          {
            shareType: this.params.shareType,
            shareTypeId: this.params.shareTypeId,
            allotOrgId: this.params.allotOrgId,
            shareUserId: this.params.shareUserId,
            channelId: this.params.channelId
          },
          () => {
            // 获取门店详情和门店下管家列表
            common.osg.codeoption(() => {
              this.getData();
            });
          }
        );
      } else {
        // 获取门店详情和门店下管家列表
        common.osg.codeoption(() => {
          this.getData();
        });
      }
    },
    onSearch: function (e) {
      this.searchValue = e.detail;
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.list = [];
      this.boundings = [];
      this.index = 0;
      this.getData();
    },

    getData() {
      common.osg.ajax(
        '/biz/activity/findById',
        {
          id: this.params.activity
        },
        res => {
          res.data.tplImageFileid = JSON.parse(res.data.tplImageFileid);
          this.activityDefData = res.data;
          console.log(this.activityDefData, '--this.activityDefData');
          // time 当前时间  time.getMinutes   time.getTime
          // 签到时间： startDate >time>startDate-(preStartSignMinites*60*1000)
          // 截取startDate 分 startDate.lastIndexOf(':')   2023-07-11 16:45:55
          this.ifSignIn();
          var timer = setInterval(() => {
            this.ifSignIn();
            if (this.signIn) {
              clearInterval(timer);
            }
          }, 10000);
          // var timer = setInterval(function () {
          //   this.ifSignIn();
          // }, 1000);
        }
      );
    },
    // 判断是否签到
    ifSignIn() {
      // var timer = setInterval(function () {
      console.log('调用1次');
      let time = new Date();
      let thisTime = time.getTime();
      let startTime = new Date(this.activityDefData.startDate).getTime();
      let preTime = this.activityDefData.preStartSignMinites * 60 * 1000;
      console.log(thisTime, '当前时间');
      console.log(startTime, '活动开始时间');
      console.log(preTime, '起止时间段');
      // startTime >
      if (thisTime > startTime - preTime) {
        this.signIn = true;
      } else {
        this.signIn = false;
      }
      // }, 1000);
      // if ((this.signIn = true)) {
      //   clearInterval(timer);
      // }
      console.log(this.signIn, '----this.signIn');
    },
    // 报名
    doEnroll() {
      common.osg.ajax(
        'biz/activityDetail/enroll',
        {
          aid: this.params.activity
        },
        res => {
          this.getData();
          common.osg.toast('报名成功', 'none');
        }
      );
    },
    // 签到
    doSignIn() {
      common.osg.ajax(
        'biz/activityDetail/signIn',
        {
          aid: this.params.activity
        },
        res => {
          this.getData();
          common.osg.toast('签到成功', 'none');
        }
      );
    },
    doOpen(path, params, options) {
      common.osg.open(path, params, options);
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
    }
    // codelabel(type, option, val) {
    //   if (!val) return;
    //   if (type == 'select') {
    //     return common.osg.codelabel(option, val);
    //   } else if (type == 'cascade') {
    //     return common.osg.formatCascade(option, val);
    //   }
    // },

    /**
     * 生命周期函数--监听页面显示
     */
    // onShow: function (option) {
    //   this.doInit();
    //   common.osg.codeoption(() => {
    //     this.getData();
    //   });
    // }
  }
};
</script>
<style lang="scss">
.c-content {
  margin-top: 54px;
  padding-bottom: 50px;
}

.sr-popup .van-cell__title,
.van-cell__value {
  -webkit-flex: auto;
  flex: auto;
  max-width: none !important;
}

.tabclass {
  font-size: 18px !important;
  min-width: 20vw !important;
  margin-top: 10rpx;
}

.text-content view {
  line-height: 35px;
  border-bottom: 1px solid #ebedf0;
}
.orgUser-add {
  position: fixed;
  bottom: 0;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fff;
  height: 60px;
  box-sizing: border-box;
  border-top: 1px solid #f7f8fa;
  > view {
    text {
      margin-left: 10px;
    }
  }
}
.van-button {
  color: #1989fa !important;
  border-color: #1989fa !important;
}
.c-card-content {
  > view {
    margin: 5px;
  }
}
</style>
