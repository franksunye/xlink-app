<template>
  <view>
    <!-- 过滤 -->
    <view class="c-header" style="z-index: 2">
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        use-action-slot
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20"
      >
        <!-- <view slot="action" class="c-flex">
          <van-icon
            custom-style="font-size: 44rpx;"
            name="filter-o"
            @click="filterSortingShow = !filterSortingShow"
          ></van-icon>
        </view> -->
      </van-search>
    </view>

    <!-- 新列表 -->
    <view class="c-content">
      <view>
        <view
          :id="'listitem-' + func._id + '-' + j"
          v-for="(listitem, j) in boundings"
          :key="j"
          :style="{
            height: boundings[j].height ? boundings[j].height + 'px' : 'auto',
            margin: '20rpx 0'
          }"
        >
          <view
            class="c-card"
            v-for="(item, k) in list[j]"
            :key="k"
            :data-id="item._id"
            @tap="doOpen(item._id)"
          >
            <view class="c-card-title">
              <view class="c-flex">
                <van-icon custom-class="c-card-icon" name="todo-list-o"></van-icon>
                <text style="font-weight: 600; font-size: 14px">编号：{{ item._id }}</text>
              </view>
              <view style="color: #0078d0; font-weight: 600; font-size: 14px">
                {{ codelabel('purchaseOrderStatus', item.state) }}
              </view>
            </view>

            <view class="c-card-content">
              <view>
                <text>采购地址：{{ item.purchaseAdress || '' }}</text>
              </view>

              <view>
                <text>
                  省市区：{{
                    item.area
                      ? areaList.province_list[item.area[0]] +
                        areaList.city_list[item.area[1]] +
                        areaList.county_list[item.area[2]]
                      : ''
                  }}
                </text>
              </view>
              <view>
                <text>创建时间：{{ item.createTime || '' }}</text>
              </view>
            </view>
            <view class="c-m-t-20" style="float: right">
              <van-button
                plain
                round
                color="#0078D0"
                size="small"
                @click.native.stop="doOpen(item._id)"
              >
                查看
              </van-button>
            </view>
          </view>
        </view>
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
      windowHeight: '',
      reachBottom: false, //是否触底 正在刷新
      boundings: [], //外层列表每页数据的边界值
      index: 0, //当前页码
      list: [], //全部已获取数据

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
      statusMap: {},
      options: {
        codecfg_stage: {
          codeId: 'STAGE'
        },
        codecfg_purchaseOrderStatus: {
          codeId: 'purchaseOrderStatus'
        },
        codecfg_priority: {
          codeId: 'PRIORITY'
        },
        codecfg_serviceType: {
          codeId: 'serviceType'
        },
        cascadeCode_channel: {
          codeId: 'channel'
        }
      },
      // 省市区
      areaList: Object.assign({}, areajs.default),

      // 工单状态分类
      filterSortingShow: false, //过滤/排序器
      dateTimeData: { dateTimeStart: '', dateTimeEnd: '' }, //时间排序
      // 时间选择器
      datetime: {
        show: false,
        type: '',
        value: new Date().getTime()
      },
      //过滤器的下拉菜单
      vanDropdownData: {
        open: false,
        index: ''
      },
      currentOrgid: '',
      purchaseOrderStatus: ''
    };
  },
  methods: {
    onLoad: function (option) {
      this.purchaseOrderStatus = option.purchaseOrderStatus;
      // this.serviceAppointmentId = option.id;
      // console.log(this.serviceAppointmentId, '----this.serviceAppointmentId');
      // this.getData();
    },
    doInit(param) {
      common.osg.init(this, param, app);
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
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }

      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        sortField: 'createTime',
        sortOrder: 'desc',
        orgId: this.currentOrgid,
        'regex:purchaseAdress|string#or': this.searchValue,
        'regex:createTime|string#or': this.searchValue,
        'regex:photo|string#or': this.searchValue,
        'regex:address|string#or': this.searchValue,
        'regex:describe|string#or': this.searchValue,
        'regex:orderNum|string#or': this.searchValue,
        'is:state|integer#or': this.purchaseOrderStatus || ''
      };
      common.osg.ajax('basic/purchaseOrder/query.do', params, res => {
        this.fpi.pages = res.pages;

        if (res.data.length == 0) {
          wx.stopPullDownRefresh();
          if (this.fpi.page > 1) {
            this.fpi.page--;
            this.index--;
          }
          this.$forceUpdate();
          this.reachBottom = false;
          common.osg.toast('没有更多数据', 'none', 5000);
          return;
        }
        let index = this.fpi.page - 1;
        // this.list = res.data;
        this.list.push(res.data);
        console.log(this.list, '----this.list');
        this.boundings.push({});

        this.$nextTick(() => {
          setTimeout(() => {
            //计算并记录外层列表数据的边界值
            this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
            wx.createSelectorQuery()
              .select(`#listitem-${this.func._id}-${index}`)
              .boundingClientRect(rect => {
                if (rect) {
                  that.boundings[index] = {
                    height: rect.height,
                    top:
                      index == 0
                        ? rect.top
                        : that.boundings[index - 1].top + that.boundings[index - 1].height,
                    bottom:
                      index == 0 ? rect.bottom : that.boundings[index - 1].bottom + rect.height
                  };
                }
              })
              .exec();
            wx.stopPullDownRefresh();
            this.reachBottom = false;
          }, 300);
        });
      });
    },
    doOpen: function (e) {
      common.osg.open('purchaseOrderItems', {
        purchaseOrderId: e
      });
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
    // codelabel(type, option, val) {
    //   if (!val) return;
    //   if (type == 'select') {
    //     return common.osg.codelabel(option, val);
    //   } else if (type == 'cascade') {
    //     return common.osg.formatCascade(option, val);
    //   }
    // },

    onPullDownRefresh: function () {
      this.fpi.page = 1;
      this.getData();
    },
    onReachBottom() {
      if (!this.reachBottom) {
        this.reachBottom = true;
        this.fpi.page++;
        this.getData();
      }
    },
    //滚动监听
    onPageScroll(e) {
      if (this.reachBottom) return;

      // 窗口高度
      this.windowHeight = this.windowHeight
        ? this.windowHeight
        : wx.getSystemInfoSync().windowHeight;

      // 循环每页高度
      for (let i = 0; i < this.boundings.length; i++) {
        // 如果没有在屏幕中，并且视野的高度小于我的结尾位置距离顶部的距离，也就是说，这个dom是我正在查看的dom
        if (
          this.boundings[i].top < e.scrollTop + this.windowHeight &&
          e.scrollTop + this.windowHeight <= this.boundings[i].bottom
        ) {
          this.index = i;
          break;
        }
      }
    },
    //渲染标签

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.doInit();
      common.osg.codeoption(() => {});
      let _currentUser = wx.getStorageSync('user');
      this.currentOrgid = _currentUser.orgId;
      this.getData();
    }
  }
};
</script>
<style lang="scss">
.c-card-content {
  > view {
    padding: 5px;
    > text {
      font-size: 14px;
    }
  }
}
.c-content {
  margin-top: 44px;
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
</style>
