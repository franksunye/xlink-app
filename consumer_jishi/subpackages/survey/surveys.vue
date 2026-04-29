<template>
  <view class="surveys">
    <block v-if="loaded">
      <block v-if="phone">
        <block v-if="viewType == 'data'">
          <view v-for="(item, i) in data" :key="i" class="c-card">
            <view class="c-card-title">
              <view>勘察报告编号：{{ item.surveyNum || '' }}</view>
            </view>
            <view class="c-card-content">
              <view>
                <text>工单编号：</text>
                <text>{{ item.serviceAppointmentNum }}</text>
              </view>
              <view v-if="item.serviceType">
                <text>服务类型：</text>
                <text>{{ codelabel('serviceType', item.serviceType) }}</text>
              </view>
              <view>
                <text>勘察部位：</text>
                <text>
                  {{ item.constructionLocation || codelabel('parts', item.part, 'cascade') }}
                </text>
              </view>
              <view>
                <text>项目地址：</text>
                <text>{{ item.address }}</text>
              </view>
              <view>
                <text>勘察时间：</text>
                <text>{{ item.createTime }}</text>
              </view>
              <view>
                <text>技术工程师：</text>
                <text>{{ item.supervisorName }}</text>
              </view>
              <view>
                <text>联系方式：</text>
                <text>{{ item.supervisorPhone }}</text>
              </view>
            </view>
            <view class="c-card-footer" v-if="item.surveyPDFUrl">
              <view></view>
              <button
                class="c-uni-button round small primary"
                hover-class="hover"
                plain
                @click="download"
                :data-filename="item.surveyPDFUrl"
              >
                查看文件
              </button>
            </view>
            <view
              v-for="(item, j) in item.wares"
              :key="j"
              class="sa-detail-card c-flex c-item-center product"
              style="margin-top: 8px; color: #736e6e"
            >
              <image
                :src="
                  (item.images[0] && item.images[0].url) || 'https://pub.fsgo365.cn/product1.png'
                "
                style="width: 80px; height: 80px; display: flex"
                class="product-image"
              />
              <view class="product-info">
                <view class="product-info-top">
                  <view class="product-title-view">
                    <image
                      src="../../static/images/slogan-logo.png"
                      mode="widthFix"
                      style="width: 37px; min-width: 37px; display: flex; margin-right: 7px"
                    />
                    <view class="product-title">{{ item.name }}</view>
                  </view>
                  <view class="tags">
                    <text class="tag tag-recommend">推荐产品</text>
                    <text class="tag">免费上门出具方案</text>
                    <text class="tag" v-if="item.agelimit && item.agelimit != '0'">
                      {{ item.agelimit }}年质保
                    </text>
                  </view>
                </view>
                <view class="c-flex c-item-center c-flex-between">
                  <view class="product-info-bottom">
                    <text class="product-price">{{ item.price }}</text>
                    <text class="product-area">
                      元
                      <text v-if="item.unit">/{{ codelabel('unit', item.unit) || '' }}</text>
                    </text>
                  </view>
                  <button
                    class="c-uni-button round small primary"
                    hover-class="hover"
                    plain
                    @click="open('../../subpackages/good/good', { id: item._id })"
                  >
                    查看
                  </button>
                </view>
              </view>
            </view>
          </view>
        </block>
        <block v-else-if="viewType == 'file'">
          <view v-for="(item, i) in data" :key="i" class="c-card">
            <view class="c-card-content">
              <button class="c-uni-button round small primary" plain @click="downloadFile(item)">
                查看勘察单文件
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
      options: {
        cascadeCode_parts: { codeId: 'parts' },
        codecfg_unit: { codeId: 'UNIT' },
        codecfg_serviceType: { codeId: 'serviceType' }
      },
      serviceAppointmentId: null,
      _id: null,
      data: [],
      wares: [],
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
        common.osg.md({ act: '勘察报告列表' });
        common.osg.codeoption(() => {
          this.getWares(() => {
            this.data = [];
            if (this.params.act == 'ykyq' && this.params.type && this.params.typeId) {
              this.queryQWTaskFile();
            } else {
              this.querySurvey(params);
              this.querySurvey20();
            }
          });
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
          common.osg.md({ act: '勘察报告列表' });
          common.osg.codeoption(() => {
            this.getWares(() => {
              this.data = [];
              if (this.params.act == 'ykyq' && this.params.type && this.params.typeId) {
                this.queryQWTaskFile();
              } else {
                this.querySurvey();
                this.querySurvey20();
              }
            });
          });
        }
      });
    },
    open(path, data) {
      common.osg.open(path, data);
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
                common.osg.md({
                  act: 'ykyqview_' + this.$mp.page.route,
                  userName: this.user.name,
                  phone: this.user.phone,
                  orgName: this.user.orgName
                });
              } else {
                this.viewType = 'data';
                common.osg.md({
                  act: 'ykyq_' + this.$mp.page.route,
                  userName: this.user.name,
                  supervisorName: res.data[0].createUserName,
                  orgName: res.data[0].orgName
                });
              }
            }
          }
          this.data = res.data;
        }
      );
    },
    querySurvey() {
      common.osg.ajax(
        'basic/survey/querySurvey',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          sid: this.serviceAppointmentId,
          'is:_id|string#and': this._id
        },
        res => {
          res.data.map(item => {
            if (item.serviceGoods && item.serviceGoods.length > 0) {
              item.wares = this.wares.filter(ware => item.serviceGoods.indexOf(ware.typeId) != -1);
            } else {
              item.wares = [];
            }
          });
          this.data = this.data.concat(res.data);
        }
      );
    },
    querySurvey20() {
      common.osg.ajax(
        'basic/survey/querySurvey20',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          sid: this.serviceAppointmentId,
          'is:_id|string#and': this._id
        },
        res => {
          res.data.map(item => {
            if (item.serviceGoods && item.serviceGoods.length > 0) {
              item.wares = this.wares.filter(ware => item.serviceGoods.indexOf(ware.typeId) != -1);
            } else {
              item.wares = [];
            }
          });
          this.data = this.data.concat(res.data);
          if (this.params.act == 'ykyq' && this.data.length > 0) {
            common.osg.md({
              act: 'ykyq_' + this.$mp.page.route,
              supervisorName: this.data[0].supervisorName,
              orgName: this.data[0].orgName
            });
          }
        }
      );
    },
    // 查询勘察单推荐的服务商品
    getWares(callback) {
      common.osg.ajax(
        '/wares/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:type|string#and': '3',
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.wares = res.data;
          if (callback) callback();
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
      common.osg.md({ act: '勘察报告文件' });
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
.surveys {
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
  .product {
    border: 1px solid #ebedf0;
    border-radius: 8px;
    padding: 8px;
    .product-image {
      margin-right: 8px;
      border-radius: 8px;
      overflow: hidden;
    }
    .product-info {
      color: #393838;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      .product-title-view {
        display: flex;
        align-items: center;
        .product-title {
          color: #000;
          font-size: 16px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        .tag {
          border-radius: 4px;
          border: 0.8px solid #d9d9d9;
          padding: 2px 5px;
          color: #878787;
          text-align: center;
          font-family: Inter;
          font-size: 10px;
          margin-right: 5px;
          margin-bottom: 5px;
        }
        .tag-recommend {
          background-color: #f9de55;
          border-color: #f9de55;
        }
      }
      .product-info-bottom {
        color: #f75429;
        font-size: 16px;
        font-weight: 600;
        .product-area {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
