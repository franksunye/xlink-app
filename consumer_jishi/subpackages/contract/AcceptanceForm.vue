<template>
  <view class="contracts">
    <block v-if="FirstLoading && loaded">
      <block v-if="phone">
        <view v-if="data.length == 0" class="c-uni-empty">
          <image src="https://pub.fsgo365.cn/empty.png"></image>
          <text>暂无数据</text>
          <button
            class="c-uni-button round primary"
            hover-class="hover"
            plain
            @click="getData(true)"
          >
            查看历史数据
          </button>
        </view>
        <view v-for="(item, i) in data" :key="i" class="c-card">
          <view class="c-card-title">
            <view>订单编号：{{ item.orderId }}</view>
          </view>
          <view class="c-card-content">
            <view>
              <text>合同编号：</text>
              <text>{{ item.contractdocNum }}</text>
            </view>
            <view>
              <text>施工地址：</text>
              <text>{{ item.projectAddress }}</text>
            </view>
            <view v-if="item.servicerNames">
              <view style="min-width: 100px">服务人员：</view>
              <view>
                <text
                  style="margin: 0px 2px; font-weight: bolder"
                  v-for="(i, inx) in item.servicerNames.split('、')"
                  :key="i"
                >
                  {{ i }}
                </text>
              </view>
            </view>

            <view>
              <text>服务商：</text>
              <text>{{ item.orgName }}</text>
            </view>
            <view>
              <text>签订日期：</text>
              <text>{{ item.updateTime }}</text>
            </view>
            <view v-if="item.confirmationStatement">
              <text>验收确认声明：</text>
              <text>{{ item.confirmationStatement }}</text>
            </view>
          </view>
          <!-- <view class="c-card-footer">
            <button
              class="c-uni-button round small default border"
              hover-class="hover"
              plain
              @click="ViewPdf(item.acceptanceUrl)"
            >
              查看文件
            </button>
            <button
              v-if="!item.signImageUrl && item.signable"
              class="c-uni-button round small primary c-m-l-20"
              hover-class="hover"
              plain
              @click="customerSignature(item._id)"
            >
              客户签字
            </button>
          </view> -->
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
      FirstLoading: false, //首次加载数据
      phone: '',
      data: [],
      // FilterConditions: null, //是否只显示全部的
      params: {} //拿到页面携带的参数
    };
  },
  onLoad(e) {
    common.osg.init(this, e, app);
    this.params = e;
  },
  onShow() {
    uni.$on('showToast', function (state) {
      //接受参数
      if (state) {
        setTimeout(() => {
          common.osg.toast('签字成功', 'success');
        }, 500);
      }
    });
    common.osg.doLogin({}, () => {
      this.phone = wx.getStorageSync('user').phone;
      this.loaded = true;
      if (this.phone) {
        common.osg.md({ act: '验收单' });
        this.getData();
      }
    });
  },
  methods: {
    //授权手机号
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.phone = user.phone;
        if (this.phone) {
          common.osg.md({ act: '验收单' });
          this.getData();
        }
      });
    },
    // C端查看验收单
    getData(viewAll = false) {
      const paramsObj = {
        _all: '1',
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1,
        'is:signable|boolean#and': true,
        'regex:acceptanceUrl|string#and': 'https'
      };

      if (!viewAll) {
        //如果type===1 证明是从验收单过来的页面
        if (this.params.type === '1') {
          paramsObj['exists:signImageUrl|boolean#and'] = false; // 是否只显示待签字的
          //如果有this.params.id 证明是从消息列表进来的
        } else if (this.params._id) {
          paramsObj['is:_id|string#and'] = this.params._id;
        }
      }
      common.osg.ajax(
        '/basic/acceptance/query',
        paramsObj,
        res => {
          this.data = res.data;
          this.FirstLoading = true; // 首次加载数据完成
          if (res.data.length == 0) {
            common.osg.toast('暂无更多', 'error');
          }
          if (this.params.act == 'ykyq' && res.data.length > 0) {
            common.osg.md({
              act: 'ykyq_' + this.$mp.page.route,
              supervisorName: res.data[0].supervisorName,
              orgName: res.data[0].orgName
            });
          }
        },
        {
          noload: true
        }
      );
    },
    //查看PDF
    ViewPdf(acceptanceUrl) {
      if (acceptanceUrl) {
        wx.downloadFile({
          url: acceptanceUrl,
          success: res => {
            const filePath = res.tempFilePath;
            wx.openDocument({
              filePath: filePath,
              fail: err => {
                common.osg.toast('文件打开失败', 'error');
              }
            });
          },
          fail: err => {
            common.osg.toast('文件打开失败', 'error');
          }
        });
      } else {
        common.osg.toast('未生成验收单', 'error');
      }
    },
    //点击跳转去签字
    customerSignature(_id) {
      common.osg.open('../../subpackages/contract/canvas', { _id });
    }
  }
};
</script>

<style lang="scss" scoped>
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
        min-width: 100px;
      }
      > text:last-child {
        color: #646566;
      }
    }
  }
  .c-card-footer {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
