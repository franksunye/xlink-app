<template>
  <view class="orders">
    <block v-if="loaded">
      <block v-if="phone">
        <block v-if="viewType == 'data'">
          <view v-for="(item, i) in data" :key="i" class="c-card">
            <view class="c-card-title">
              <view>订单编号：{{ item._id }}</view>
            </view>
            <view class="c-card-content">
              <view v-if="item.contractNum">
                <text>合同编号：</text>
                <text>{{ item.contractNum }}</text>
              </view>
              <view>
                <text>施工地址：</text>
                <text>{{ item.exts.projectAddress }}</text>
              </view>
              <view v-if="item.exts.serviceType">
                <text>服务类型：</text>
                <text>{{ codelabel('serviceType', item.exts.serviceType) }}</text>
              </view>
              <view>
                <text>创建时间：</text>
                <text>{{ item.createTime }}</text>
              </view>
              <view>
                <text>创建人：</text>
                <text>{{ item.createUserName }}</text>
              </view>
              <view v-if="item.preferentialAmount">
                <text>优惠前金额：</text>
                <text>¥{{ item.originPrice }}</text>
              </view>
              <view v-if="item.preferentialAmount">
                <text>优惠的金额：</text>
                <text>¥{{ item.preferentialAmount }}</text>
              </view>
              <view>
                <text>{{ item.preferentialAmount ? '优惠后金额：' : '总金额：' }}</text>
                <text class="c-red">¥{{ item.totalPrice }}</text>
              </view>
              <view>
                <text>已付金额：</text>
                <text class="c-red">¥{{ item.paidAmount }}</text>
              </view>
              <view>
                <text>支付状态：</text>
                <text class="c-red">{{ codelabel('paystate', String(item.payState)) }}</text>
              </view>
            </view>
            <view class="c-card-footer">
              <view>
                <button
                  v-if="item.paidAmount > 0"
                  class="c-uni-button round small default border c-m-r-20"
                  hover-class="hover"
                  plain
                  @click="open('./payments', { orderId: item._id })"
                >
                  支付记录
                </button>
                <!-- payState 0:待支付 1:已付清 2:部分支付 -1:已退款 -->
                <button
                  v-if="
                    [1, 2, 3, -1].indexOf(item.processState) != -1 &&
                    (item.payState == 0 || item.payState == 2)
                  "
                  class="c-uni-button round small warning"
                  hover-class="hover"
                  plain
                  @click="open('./pay', { orderId: item._id })"
                >
                  去支付
                </button>
              </view>
              <button
                v-if="item.exts.bjdPDFurl"
                class="c-uni-button round small primary"
                hover-class="hover"
                plain
                @click="download"
                :data-filename="item.exts.bjdPDFurl"
              >
                查看报价单
              </button>
              <view v-else></view>
            </view>
          </view>
        </block>
        <block v-else-if="viewType == 'file'">
          <view v-for="(item, i) in data" :key="i" class="c-card">
            <view class="c-card-content">
              <button class="c-uni-button round small primary" plain @click="downloadFile(item)">
                查看报价单文件
              </button>
            </view>
          </view>
        </block>
        <view v-if="data.length == 0" class="c-uni-empty">
          <image src="https://pub.fsgo365.cn/empty.png"></image>
          <text>您当前还没有订单！</text>
        </view>
      </block>
      <view v-else class="c-uni-empty">
        <image src="https://pub.fsgo365.cn/empty.png"></image>
        <text>无权查看</text>
        <button
          class="c-uni-button round primary"
          hover-class="hover"
          plain
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          授权手机号查看
        </button>
      </view>
    </block>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      loaded: false,
      phone: '',
      options: {
        cascadeCode_state: { codeId: 'state' },
        codecfg_paystate: { codeId: 'PAYSTATE' },
        codecfg_serviceType: { codeId: 'serviceType' }
      },
      data: [],
      serviceAppointmentId: null, // 从进度条卡片点去支付，当前工单有多条待付款订单时跳转到当前列表，只展示该工单的订单
      _id: null,
      params: {},
      user: {},
      viewType: 'data' // data:数据视图，file：文件视图
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.serviceAppointmentId = params.serviceAppointmentId;
    this._id = params._id;
    this.params = params;
    common.osg.doLogin({}, () => {
      this.phone = wx.getStorageSync('user').phone;
      this.loaded = true;
      if (this.phone) {
        common.osg.md({ act: '报价单列表' });
        common.osg.codeoption(() => {
          this.params = {
            act: 'ykyq',
            type: 'order',
            typeId: '5300189274596131451'
          };
          if (this.params.act == 'ykyq' && this.params.type && this.params.typeId) {
            this.queryQWTaskFile();
          } else {
            this.getData(params);
          }
        });
      }
    });
  },
  onShow() {
    common.osg.init(this, {}, app);
    if (this.phone) {
      this.params = {
        act: 'ykyq',
        type: 'order',
        typeId: '5300189274596131451'
      };
      if (this.viewType == 'file') return;
      if (this.params.act != 'ykyq') {
        this.getData(params);
      }
    }
  },
  methods: {
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.user = user;
        this.phone = user.phone;
        if (this.phone) {
          common.osg.md({ act: '报价单列表' });
          common.osg.codeoption(() => {
            if (this.params.act == 'ykyq' && this.params.type && this.params.typeId) {
              this.queryQWTaskFile();
            } else {
              this.getData(params);
            }
          });
        }
      });
    },
    open(path, data) {
      common.osg.open(path, data);
    },
    getData() {
      common.osg.ajax(
        'basic/order/query',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:serviceAppointmentId|string#and': this.serviceAppointmentId,
          'is:_id|string#and': this._id,
          'in:processState|array-integer#and': '0,-1,1,2,3,4' // 已签约,待开工,待完工,已完工
        },
        res => {
          this.data = res.data;
        }
      );
    },
    queryQWTaskFile() {
      common.osg.ajax(
        'biz/extForm/queryQWTaskFile',
        {
          type: this.params.type,
          typeId: this.params.typeId
        },
        res => {
          res.data = res.data || [];
          if (res.data.length > 0) {
            let value = res.data[0];
            if (value) {
              if (typeof value === 'string') {
                this.viewType = 'file';
                if (res.data.length == 1) {
                  this.downloadFile(res.data[0]);
                }
              } else {
                this.viewType = 'data';
              }
            }

            common.osg.md({
              act: 'ykyq_' + this.$mp.page.route,
              userName: this.user.name,
              supervisorName: res.data[0].createUserName,
              orgName: res.data[0].orgName
            });
          } else {
            common.osg.md({
              act: 'ykyqview_' + this.$mp.page.route,
              userName: this.user.name,
              phone: this.user.phone,
              orgName: this.user.orgName
            });
          }
          this.data = res.data;
        }
      );
    },
    // 预览图片、查看文件
    download(e) {
      if (common.osg.isRepeatClick('download')) {
        return;
      }
      common.osg.md({ act: '报价单文件' });
      common.osg.download(e);
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    downloadFile(url) {
      wx.downloadFile({
        url,
        success: function (res) {
          wx.openDocument({
            filePath: res.tempFilePath
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.orders {
  background: #f8f8f8;
  height: 100vh;
  overflow-y: auto;
  .van-empty {
    height: 100vh;
  }
  .c-card-content {
    > view {
      display: flex;
      line-height: 26px;
      > text:first-child {
        min-width: 70px;
      }
      > text:last-child {
        color: #646566;
      }
    }
  }
  .c-card-footer {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
