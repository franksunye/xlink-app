<template>
  <view class="contracts">
    <block v-if="loaded">
      <block v-if="phone">
        <block v-if="data.length > 0">
          <view v-for="(item, i) in data" :key="i" class="c-card">
            <view class="c-card-title">
              <view>合同编号：{{ item.contractdocNum }}</view>
              <view>{{ codelabel('contractStatus', item.contractStatus) }}</view>
            </view>
            <view class="c-card-content">
              <view>
                <text>施工地址：</text>
                <text>{{ item.address }}</text>
              </view>
              <view>
                <text>合同金额：</text>
                <text>¥{{ item.adjustRefundMoney }}</text>
              </view>
              <view v-if="item.exts.serviceType">
                <text>服务类型：</text>
                <text>{{ codelabel('serviceType', item.exts.serviceType) }}</text>
              </view>
              <view>
                <text>服务商：</text>
                <text>{{ item.partyB }}</text>
              </view>
              <view>
                <text>签订日期：</text>
                <text>{{ item.exts.signedDateExts }}</text>
              </view>
            </view>
            <view class="c-card-footer" v-if="item.qiniuUrls && item.qiniuUrls.length > 0">
              <view></view>
              <button
                class="c-uni-button round small primary"
                hover-class="hover"
                plain
                @click="download"
                :data-filename="item.qiniuUrls[item.qiniuUrls.length - 1]"
              >
                查看文件
              </button>
            </view>
          </view>
        </block>
        <view v-else class="c-uni-empty">
          <image src="https://pub.fsgo365.cn/empty.png"></image>
          <text>没有数据</text>
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
      serviceAppointmentId: null,
      _id: null,
      options: {
        codecfg_contractStatus: { codeId: 'contractStatus' },
        codecfg_serviceType: { codeId: 'serviceType' }
      },
      data: [],
      params: {}
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
        common.osg.md({ act: '合同列表' });
        common.osg.codeoption(() => {
          this.getData();
        });
      }
    });
  },
  methods: {
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.phone = user.phone;
        if (this.phone) {
          common.osg.md({ act: '合同列表' });
          common.osg.codeoption(() => {
            this.getData();
          });
        }
      });
    },
    getData() {
      common.osg.ajax(
        '/basic/contract/myContract',

        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:serviceAppointmentId|string#and': this.serviceAppointmentId,
          'is:_id|string#and': this._id
        },
        res => {
          this.data = res.data;
          if (this.params.act == 'ykyq' && res.data.length > 0) {
            common.osg.md({
              act: 'ykyq_' + this.$mp.page.route,
              supervisorName: res.data[0].serviceHousekeeper,
              orgName: res.data[0].orgName
            });
          }
        }
      );
    },
    alert(str, title) {
      common.osg.alert(str, null, title);
    },
    // 预览图片、查看文件
    download(e) {
      if (common.osg.isRepeatClick('download')) {
        return;
      }
      common.osg.md({ act: '合同文件' });
      common.osg.download(e);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    }
  }
};
</script>

<style lang="scss">
.contracts {
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
