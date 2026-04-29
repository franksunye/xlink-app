<template>
  <view class="warranties">
    <block v-if="loaded">
      <block v-if="phone">
        <block v-if="viewType == 'data'">
          <view v-for="(item, i) in data" :key="i" class="c-card">
            <view class="c-card-title">质保凭证流水号：{{ item.InsurancePolicyNum }}</view>
            <view class="c-card-content">
              <view>
                <text>维修地址：</text>
                <text>{{ item.serviceAppointmentAddress }}</text>
              </view>
              <view v-if="item.serviceType">
                <text>服务类型：</text>
                <text>{{ codelabel('serviceType', item.serviceType) }}</text>
              </view>
              <view>
                <text>服务中心：</text>
                <text>{{ item.partyB }}</text>
              </view>
              <view>
                <text>生效日期：</text>
                <text>{{ item.startTime }}</text>
              </view>
            </view>
            <view class="c-card-footer" v-if="item.warrentyPDFurl">
              <view></view>
              <button
                class="c-uni-button round small default border"
                hover-class="hover"
                plain
                @click="download"
                :data-filename="item.warrentyPDFurl"
              >
                查看文件
              </button>
            </view>
          </view>
        </block>
        <block v-else-if="viewType == 'file'">
          <view v-for="(item, i) in data" :key="i" class="c-card">
            <view class="c-card-content">
              <button class="c-uni-button round small primary" plain @click="downloadFile(item)">
                查看质保文件
              </button>
            </view>
          </view>
        </block>
        <view v-if="data.length == 0" class="c-uni-empty">
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
      data: [],
      options: {
        codecfg_serviceType: { codeId: 'serviceType' }
      },
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
        common.osg.md({ act: '质保单列表' });
        common.osg.codeoption(() => {
          if (this.params.act == 'ykyq' && this.params.type && this.params.typeId) {
            this.queryQWTaskFile();
          } else {
            this.getData();
          }
        });
      }
    });
  },
  methods: {
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.user = user;
        this.phone = user.phone;
        if (this.phone) {
          common.osg.md({ act: '质保单列表' });
          if (this.params.act == 'ykyq' && this.params.type && this.params.typeId) {
            this.queryQWTaskFile();
          } else {
            this.getData(params);
          }
        }
      });
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
    getData() {
      common.osg.ajax(
        '/document/myWarrantys',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:sid|string#and': this.serviceAppointmentId,
          'is:_id|string#and': this._id
        },
        res => {
          this.data = res.data;
          if (this.params.act == 'ykyq' && res.data.length > 0) {
            common.osg.md({
              act: 'ykyq_' + this.$mp.page.route,
              supervisorName: res.data[0].supervisorName,
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
      common.osg.md({ act: '质保单文件' });
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
.warranties {
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
