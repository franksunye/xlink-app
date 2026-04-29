<template>
  <view>
    <view class="header">
      <van-tabs :active="activeTab" @change="tabChange" sticky swipeable>
        <van-tab
          :title="item.title"
          :name="item.name"
          v-for="(item, index) in tabList"
          :key="index"
        >
          <view class="card-group">
            <view class="card" v-for="(item, i) in fpi.data" :key="i">
              <view class="card-header">
                <text class="card-title">单号：{{ item.orderNumber }}</text>
                <text class="c-yellow">{{ codelabel('payState', item.payState) }}</text>
              </view>
              <view class="card-content">
                <view>
                  <text>下单时间：</text>
                  <text>{{ item.createTime }}</text>
                </view>
                <view>
                  <text>产品总额：</text>
                  <text class="c-red c-m-l-20">¥ {{ item.originPrice }}</text>
                </view>
                <view v-if="item.discount != 1">
                  <text>折扣金额：</text>
                  <text class="c-red">
                    -¥&nbsp;{{
                      (item.originPrice - (item.originPrice * item.discount).toFixed(2)).toFixed(2)
                    }}
                  </text>
                </view>
                <view v-if="item.preferentialAmount">
                  <text>优惠金额：</text>
                  <text class="c-red">-¥ {{ item.preferentialAmount }}</text>
                </view>
                <view v-if="item.discount != 1 || item.preferentialAmount">
                  <text>实际金额：</text>
                  <text class="c-red c-m-l-20">¥ {{ item.totalPrice }}</text>
                </view>
              </view>
              <view class="card-footer">
                <view></view>
                <view>
                  <van-button
                    plain
                    round
                    size="small"
                    @click="download"
                    :data-filename="item.qiniuList[item.qiniuList.length - 1]"
                    v-if="item.qiniuList && item.qiniuList.length > 0"
                  >
                    查看合同
                  </van-button>
                  <van-button
                    plain
                    round
                    size="small"
                    @click="download"
                    :data-filename="item.warrantyUrl[item.warrantyUrl.length - 1]"
                    v-if="item.warrantyUrl && item.warrantyUrl.length > 0"
                  >
                    查看质保
                  </van-button>
                  <van-button plain round type="danger" size="small" @click="doOpen(item._id)">
                    查看订单
                  </van-button>
                </view>
              </view>
            </view>
            <van-empty v-if="fpi.data && fpi.data.length == 0" description="暂无订单" />
          </view>
        </van-tab>
      </van-tabs>
    </view>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      tabList: [
        {
          title: '全部',
          name: 'all'
        },
        {
          title: '待付款',
          name: '0,2'
        },
        {
          title: '已付款',
          name: '1'
        }
      ],
      activeTab: 'all',
      fpi: {
        page: 1,
        rows: 10,
        data: []
      },
      options: {
        codecfg_payState: {
          codeId: 'PAYSTATE'
        }
      }
    };
  },
  onLoad(params) {
    this.doInit(params);
  },
  methods: {
    /**
     * 页面初始化
     */
    doInit(params) {
      common.osg.init(this, params || {}, app);
      common.osg.codeoption(() => {
        this.getData();
      });
    },
    /**
     * 切换标签页
     */
    tabChange(e) {
      this.activeTab = e.detail.name;
      this.getData();
    },
    /**
     * 请求列表
     */
    getData() {
      common.osg.ajax(
        'order/query',
        {
          page: 1,
          rows: this.fpi.rows,
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:type|integer#and': 1, //0:报价单,1:订单
          'in:payState|array-integer#and': this.activeTab == 'all' ? null : this.activeTab
        },
        res => {
          this.fpi = res;
        }
      );
    },
    /**
     * 进入详情页
     */
    doOpen(id) {
      common.osg.open('order', {
        id
      });
    },
    /**
     * 预览图片、查看文件
     */
    download(e) {
      common.osg.download(e);
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
      this.fpi.page = 1;
      this.fpi.rows = 10;
      this.getData();
    },
    /**
     * 上拉加载更多
     */
    onReachBottom() {
      this.fpi.rows += 10;
      this.getData();
    },
    /**
     * 渲染字典
     */
    codelabel(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      }
    }
  }
};
</script>

<style lang="scss">
.card-group {
  padding: 0 3vw;

  .card {
    background: #fff;
    border-radius: 10px;
    margin-top: 3vw;

    .card-header {
      padding: 3vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #323233;

      .card-title {
        font-weight: 500;
      }
    }

    .card-content {
      padding: 0 3vw;
      color: #646566;
      font-size: 14px;
    }

    .card-footer {
      padding: 3vw;
      display: flex;
      justify-content: space-between;
      align-items: center;

      van-button:not(:first-child) {
        margin-left: 3vw;
      }
    }
  }
}
</style>
