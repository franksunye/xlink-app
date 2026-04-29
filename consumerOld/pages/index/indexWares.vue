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
          <view v-if="index - 1 <= j && j <= index + 1">
            <view class="c-card" v-for="(item, k) in list[j]" :key="k" :data-id="item._id">
              <view class="card-item" @click="doOpen('/pages/index/indexWaresDetail', item)">
                <view class="card-item-left">
                  <view class="storeTag">
                    <van-image
                      width="88px"
                      height="88px"
                      :src="item.images[0].url"
                      fit="cover"
                    ></van-image>
                  </view>
                </view>
                <view class="card-item-right">
                  <view>
                    <view class="c-size-16">{{ item.name }}</view>
                  </view>
                  <view>
                    <view class="c-flex c-size-13 c-item-center">
                      <text style="color: #c2c0c0">{{ item.description }}</text>
                    </view>
                  </view>
                  <view>
                    <view style="color: red" class="c-flex c-item-center">
                      <text>￥{{ item.price }}</text>
                    </view>
                  </view>
                </view>
              </view>
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
      classifyId: '', //商品分类id
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
        codecfg_status: {
          codeId: 'STATUS'
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
      active: 'all', //当前激活的tab页
      functionList: [],
      rejectObj: {
        sid: '',
        workflowNodeId: '',
        show: false,
        remark: ''
      },
      tagType: {} //标签属性
    };
  },
  methods: {
    onLoad: function (param) {
      this.classifyId = param._id;
      this.doInit(param);
    },
    doInit(param) {
      common.osg.init(this, param, app);
      this.getData();
      // this.getFields(() => {
      //   // this.getFunction();
      // });
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
    doOpen(path, data) {
      common.osg.open(path, data);
    },

    getData: function (type) {
      let that = this;

      if (this.fpi.page == 1) {
        this.list = [];
        this.boundings = [];
        this.index = 0;
      }

      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        'regex:name|string#or': this.searchValue,
        'is:state|integer#and': 1,
        'is:classifyId|string#and': this.classifyId,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('/wares/query.do', params, res => {
        this.fpi.pages = res.pages;

        if (res.length == 0) {
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
        this.list.push(res.data);
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
    //获取工单扩展
    //   getFields(callback) {
    //     common.osg.ajax(
    //       'biz/extField/query',
    //       {
    //         colName: 'serviceAppointment',
    //         _all: '1',
    //         'is:state|integer#and': 1,
    //         sortField: 'order',
    //         sortOrder: 'asc'
    //       },
    //       res => {
    //         for (let field of res.data) {
    //           //解析frontEndConfig字段配置
    //           if (field.frontEndConfig && common.osg.isJson(field.frontEndConfig)) {
    //             field.frontEndConfig = JSON.parse(field.frontEndConfig);
    //           } else {
    //             field.frontEndConfig = {};
    //           }
    //           field.showList = field.showList || [];
    //           //列表展示字段 关联字典表codeType放到options,之后从字典表查询
    //           // field.showList.indexOf('3') != -1
    //           if (field.valueOption) {
    //             if (field.type == 'cascade') {
    //               this.options['cascadeCode_' + field.valueOption] = {
    //                 codeId: field.valueOption
    //               };
    //             } else {
    //               this.options['codecfg_' + field.valueOption] = {
    //                 codeId: field.valueOption
    //               };
    //             }
    //           }
    //           if (field.frontEndConfig.tagType) this.tagType = field.frontEndConfig.tagType;
    //           // 过滤器选中项
    //           field.value = [];
    //         }
    //         common.osg.codeoption(() => {
    //           this.fields = res.data;
    //           if (callback) callback();
    //         });
    //       },
    //       {
    //         noload: true
    //       }
    //     );
    //   },
    //   doOpen: function (e) {
    //     debugger;
    //     common.osg.open('newServiceAppointment', {
    //       id: e.currentTarget.dataset.id
    //     });
    //   },
    codelabel(type, option, val) {
      if (!val) return;
      if (type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
      }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.fpi.page = 1;
      if (this.func.type && this.func.type == 'SANode') {
        this.getSANode();
      } else {
        if (this.func.orderState == 'all') {
          this.getSA();
        } else {
          this.getData();
        }
      }
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
    renderTagType(value) {
      if (value) {
        return this.tagType[value];
      } else {
        return 'primary';
      }
    }
    /**
     * 生命周期函数--监听页面显示
     */
    // onShow: function () {
    //   debugger;
    //   let _currentUser = common.osg.get('_currentUser');
    //   this.currentPhone = _currentUser.user.phone;
    //   console.log(this.currentPhone, '---this.currentPhone');
    //   this.getData();
    //   //   this.functionType = common.osg.get('functionTypeValue');
    //   //   console.log(this.functionType, '-------拿到缓存中的this.functionType');
    //   if (this.loadType == 'onLoad') {
    //     this.loadType = 'onShow';
    //     return;
    //   }

    //   this.doInit({});
    // }
  }
};
</script>
<style lang="scss">
/* .c-content {
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
} */
.card-item {
  background: #fff;
  margin: 5px 0;
  padding: 5px 3vw;
  display: flex;
  .card-item-left {
    width: 90px;
    display: flex;
    .storeTag {
      width: 100%;
      height: 90px;
      display: flex;
      border-radius: 1px;
      box-sizing: border-box;
      border: 1px solid #bfbfbf;
    }
  }
  .card-item-right {
    flex: 1;
    padding-left: 3vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .num {
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      font-size: 14px;
    }
    > view {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
    }
  }
}
</style>
