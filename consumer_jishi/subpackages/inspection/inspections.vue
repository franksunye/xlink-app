<template>
  <view class="inspections">
    <block v-if="loaded">
      <block v-if="phone">
        <view v-if="data.length > 0">
          <view v-for="(item, i) in data" :key="i" class="c-card">
            <view class="c-card-title">
              <view>巡检工单编号：{{ item.code }}</view>
            </view>
            <view class="c-card-content">
              <!-- <view>
            <text>工单编号：</text>
            <text>{{ item.serviceAppointmentNum }}</text>
          </view> -->
              <view>
                <text>巡检部位：</text>
                <text>{{ codelabel('parts', item.exts.parts, 'cascade') }}</text>
              </view>
              <view>
                <text>项目地址：</text>
                <text>{{ item.inspectionAddress }}</text>
              </view>
              <!-- <view>
            <text>勘察时间：</text>
            <text>{{ item.createTime }}</text>
          </view> -->
              <!-- <view>
            <text>技术工程师：</text>
            <text>{{ item.supervisorName }}</text>
          </view> -->
              <!-- <view>
            <text>联系方式：</text>
            <text>{{ item.supervisorPhone }}</text>
          </view> -->
            </view>
            <view class="c-card-footer">
              <button
                v-if="item.status == 502"
                class="c-uni-button round small disabled"
                plain
                disabled
              >
                已评价
              </button>
              <button
                v-if="item.status != 502 && item.inspectionAppointmentUrl"
                class="c-uni-button round small primary border"
                hover-class="hover"
                plain
                @click="getSAData(item.extId, item._id)"
              >
                评价
              </button>
              <button
                style="margin-left: 5px"
                v-if="item.inspectionAppointmentUrl"
                class="c-uni-button round small primary border c-m-l-20"
                hover-class="hover"
                plain
                @click="download"
                :data-filename="item.inspectionAppointmentUrl"
              >
                查看文件
              </button>
              <!-- #ifdef MP-WEIXIN -->
              <button
                class="c-uni-button round small primary border c-m-l-20"
                hover-class="hover"
                plain
                @click="doChoosePic(item)"
                round
              >
                分享海报
              </button>
              <!-- #endif -->
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <poster
              id="poster"
              :config="posterConfig"
              @success="onPosterSuccess"
              @fail="onPosterFail"
            ></poster>
            <!-- #endif -->
          </view>
        </view>
        <view v-else class="c-uni-empty">
          <image src="https://pub.fsgo365.cn/empty.png"></image>
          <text>暂无报告</text>
        </view>
        <uni-popup ref="choosePicPopup" type="dialog" show-cancel-button>
          <uni-popup-dialog
            ref="choosePicDialog"
            title="选择海报"
            type="info"
            @confirm="confirmChoosePic(item)"
            @close="closeChoosePic"
          >
            <view>
              <view style="text-align: center">
                <image mode="widthFix" style="width: 160px" :src="backgroundpic"></image>
              </view>
              <view style="display: flex; justify-content: space-around">
                <view
                  :class="chooseImgIndex === index ? 'chooseImg' : ''"
                  v-for="(item, index) in activityDefData"
                  :key="index"
                >
                  <image
                    mode="widthFix"
                    style="width: 100px; height: 100px"
                    :src="item.tplImageFileid[0].url"
                    @click="getImg(item, index)"
                  ></image>
                </view>
              </view>
            </view>
          </uni-popup-dialog>
        </uni-popup>
        <!-- 选择后的图片 -->
        <uni-popup ref="posterPopup" type="dialog">
          <uni-popup-dialog
            ref="choosePicDialog"
            title="巡检海报"
            :showClose="false"
            type="info"
            @confirm="closePosterQrcode"
          >
            <view>
              <image
                show-menu-by-longpress="true"
                mode="widthFix"
                style="width: 200px"
                :src="savepicRoute"
              />
              <view style="display: flex; justify-content: space-around; padding-bottom: 10px">
                <view style="color: #6d6d6d; font-family: Inter; font-size: 12px">
                  长按图片可保存至本地/分享好友
                </view>
              </view>
            </view>
            <!-- <l-painter ref="painter" style="position: relative">
              <l-painter-image :src="backgroundpic" css="width: 100%; object-fit: contain;" />
              <l-painter-qrcode
                :text="`https://xlink.fsgo365.cn/qrcode/tg/?partnerId=${partnerId}&channelId=${channelId}`"
                :css="`width: ${qrsize}px; height: ${qrsize}px;position:absolute; left:${qrx}px;top:${qry}px`"
              />
              <l-painter-view
                :css="`position:absolute; left:${qrx}px;top:${
                  qry + qrsize + 3
                }px;width:${qrsize}px;text-align:center;line-height:10px;`"
              >
                <l-painter-text :text="picName" css="font-size:10px;" />
              </l-painter-view>
            </l-painter> -->
          </uni-popup-dialog>
        </uni-popup>
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
// #ifdef MP-WEIXIN
import poster from '../../wxcomponents/miniprogram_dist/poster';
import poster2 from '../../wxcomponents/miniprogram_dist/poster/poster';
// #endif
export default {
  // #ifdef MP-WEIXIN
  components: {
    poster
  },
  // #endif
  data() {
    return {
      loaded: false,
      phone: '',
      options: {
        cascadeCode_parts: { codeId: 'parts' },
        codecfg_unit: { codeId: 'UNIT' }
      },
      _id: null,
      data: [],
      wares: [],
      userData: {}, //当前登录人信息
      node: [],
      activityDefData: [], //海报模板数据
      chooseImgIndex: '', // 选中的背景图的index
      backgroundpic: '', //背景图片地址
      //获取背景图片的宽高
      backgroundpicWidth: '',
      backgroundpicHeight: '',
      savepicRoute: '', //保存相册
      posterConfig: {}, //二维码画布数据
      chooseImgData: {}, //选择图片的数据
      imgText1: '', //海报拼接的第一行文字
      imgText2: '', //海报拼接的第二行文字
      imgText3: '', //海报拼接的第四行文字
      imgY1: 0, //海报第一行文字的y轴位置
      imgY2: 0, //海报第二行文字的y轴位置
      chooseData: {} //选择时的data
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this._id = params._id;
    common.osg.doLogin({}, () => {
      this.userData = wx.getStorageSync('user') || {};
      this.phone = this.userData.phone;
      this.loaded = true;
      if (this.phone) {
        common.osg.md({ act: '巡检报告列表' });
        common.osg.codeoption(() => {
          this.getData();
          this.getActivityDef();
        });
      }
    });
  },
  onshow() {
    if (this.phone) this.getData();
  },
  methods: {
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.phone = user.phone;
        if (this.phone) {
          common.osg.md({ act: '巡检报告列表' });
          common.osg.codeoption(() => {
            this.getData();
            this.getActivityDef();
          });
        }
      });
    },
    open(path, data) {
      common.osg.open(path, data);
    },
    getData() {
      common.osg.ajax(
        'biz/extForm/queryByColName/inspectionAppointment.do',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:phone|string#and': '13146050328', // this.userData.phone,
          // 'in:status|array#and': '501,502',
          'is:_id|string#and': this._id,
          notFilterBelongTo: '1',
          notFilterOrgId: '1'
        },
        res => {
          this.data = res.data;
          console.log(this.data, '----this.data');
        }
      );
    },
    getSAData(extId, _id) {
      //   var params = {
      //     _all: '1',
      //     sortField: 'createTime',
      //     sortOrder: 'desc',
      //     colName: 'inspectionAppointment',
      //     'is:status|string#and': 501
      //   };
      common.osg.ajax(`/basic/inspectionAppointment/queryById/${_id}`, {}, res => {
        let node = res.data.workflowNode[res.data.workflowNode.length - 1];
        console.log(this.node, '----this.node');
        this.toEvaluate(node, _id);
      });
    },
    toEvaluate(node, _id) {
      common.osg.open('/subpackages/extForm/extForm', {
        formDefId: node.nodeDef.formDefId,
        formDataId: node.workflowFormDataId,
        workflowNodeId: node._id,
        tenantId: node.tenantId,
        sid: _id
      });
    },
    // 查询勘察单推荐的服务商品
    // getWares(callback) {
    //   common.osg.ajax(
    //     '/wares/query',
    //     {
    //       _all: '1',
    //       'is:state|integer#and': 1,
    //       'is:type|string#and': '3',
    //       sortField: 'createTime',
    //       sortOrder: 'desc'
    //     },
    //     res => {
    //       this.wares = res.data;
    //       if (callback) callback();
    //     }
    //   );
    // },
    alert(str, title) {
      common.osg.alert(str, null, title);
    },
    // 预览图片、查看文件
    download(e) {
      if (common.osg.isRepeatClick('download')) {
        return;
      }
      common.osg.md({ act: '巡检报告文件' });
      common.osg.download(e);
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    // 获取巡检海报
    getActivityDef() {
      var params = {
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1,
        'is:exts.activityDefType|string#and': '5'
      };
      common.osg.ajax('biz/activityDef/query', params, res => {
        res.data.map(item => {
          item.tplImageFileid = JSON.parse(item.tplImageFileid);
        });
        this.activityDefData = res.data;
        console.log(this.activityDefData, '---activityDefData');
      });
    },
    doChoosePic(e) {
      this.$refs.choosePicPopup.open('center');
      this.chooseData = e;
      console.log(this.chooseData, '------this.chooseData');
    },
    confirmChoosePic() {
      common.osg.md({ act: '保存巡检海报' });
      this.$refs.choosePicPopup.close();
      // 判断是默认海报就不去往图片上拼文字
      if (this.chooseImgData.name == '默认巡检海报') {
        this.savepicRoute = this.backgroundpic;
        this.$refs.posterPopup.open('center');
        return;
      }
      if (this.chooseData.warrantyStartTime) {
        // 获取当前时间
        let warrantyStartTime = new Date(this.chooseData.warrantyStartTime);
        let startTime = warrantyStartTime.getTime();
        let time = new Date();
        let nowTime = time.getTime();
        let str = nowTime - startTime;
        str = +str + 1000;

        const day = parseInt(str / (1000 * 60 * 60 * 24));
        console.log(day, '---day');
        console.log(nowTime, '---nowTime');
        this.imgText1 = `您 的 ${this.codelabel(
          'parts',
          this.chooseData.exts.parts[0]
        )} 已 于 ${this.chooseData.exts.subscribeTimeStr.slice(0, 10)} 完 成 巡 检`;
        this.imgText2 = `今 天 是 在 保 的 第 ${day + 1} 天`;
        this.imgText3 = `我 们 将 为 您 的 ${this.codelabel(
          'parts',
          this.chooseData.exts.parts[0]
        )} 提 供 全 生 命 周 期 管 理`;
        this.imgY1 = 3600;
        this.imgY2 = 3830;
      } else {
        this.imgText1 = `您 的 ${this.codelabel(
          'parts',
          this.chooseData.exts.parts[0]
        )} 已 于 ${this.chooseData.exts.subscribeTimeStr.slice(0, 9)} 完 成 巡 检`;
        this.imgText3 = `我 们 将 为 您 的 ${this.codelabel(
          'parts',
          this.chooseData.exts.parts[0]
        )} 提 供 全 生 命 周 期 管 理`;
        this.imgY1 = 3830;
        this.imgY2 = '';
      }
      this.getBackgroundpicSize();
    },
    closeChoosePic() {
      this.$refs.choosePicPopup.close();
    },
    getBackgroundpicSize() {
      let that = this;
      wx.getImageInfo({
        src: that.backgroundpic,
        success(res) {
          that.backgroundpicWidth = res.width;
          that.backgroundpicHeight = res.height;
          that.onCreateQrPoster();
          this.$refs.posterPopup.open('center');
        }
      });
    },
    getImg(e, i) {
      this.chooseImgData = e;
      this.backgroundpic = e.tplImageFileid[0].url;
      this.chooseImgIndex = i;
      console.log(this.backgroundpic, '---imgUrl');
    },
    //分享给朋友
    share() {
      console.log(this.savepicRoute, '----this.savepicRoute');
      wx.showShareImageMenu({
        path: this.savepicRoute,
        success: res => {
          common.osg.toast('操作成功');
          console.log('分享成功：', res);
        },
        fail: err => {
          console.log('分享取消：', err);
        }
      });
    },
    onPosterSuccess(e) {
      this.savepicRoute = e;
      console.log(this.savepicRoute, '-----onPosterSuccess');
    },
    closePosterQrcode() {
      this.chooseImgIndex = '';
      this.chooseImgData = {};
      this.backgroundpic = '';
      this.imgText1 = ''; //海报拼接的第一行文字
      this.imgText2 = ''; //海报拼接的第二行文字
      this.imgText3 = '';
      this.savepicRoute = '';
      this.posterConfig = {};
      this.chooseData = {};
      this.getData();
      this.$refs.posterPopup.close();
    },
    //二维码画布数据
    onCreateQrPoster() {
      console.log(this.backgroundpicWidth, this.backgroundpicHeight, '--图片的宽高');
      // setData配置数据
      this.posterConfig = {
        width: this.backgroundpicWidth,
        height: this.backgroundpicHeight,
        backgroundColor: '#ffffff',
        debug: false,
        pixelRatio: 1,
        // pixelRatio: 100,
        texts: [
          {
            x: 445,
            y: this.imgY1,
            text: this.imgText1,
            fontSize: 129,
            fontWeight: '1000',
            color: '#fff'
            // textAlign: 'center'
          },
          {
            x: 445,
            y: this.imgY2,
            text: this.imgText2,
            fontSize: 129,
            fontWeight: '1000',
            color: '#fff'
            // textAlign: 'center'
          },
          {
            x: 445,
            y: 4350,
            text: this.imgText3,
            fontSize: 129,
            fontWeight: '1000',
            color: '#fff'
            // textAlign: 'center'
          }
        ],
        images: [
          // 海报背景图
          {
            width: this.backgroundpicWidth,
            height: this.backgroundpicHeight,
            x: 0,
            y: 0,
            url: this.backgroundpic
            // zIndex: 1
          }
        ]
      };
      this.$nextTick(() => {
        poster2.create();
        this.$forceUpdate();
      });
      // this.backgroundpic = '';
      console.log(this.posterConfig, '二维码canvas数据');
    }
  }
};
</script>

<style lang="scss">
.inspections {
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
    justify-content: flex-end;
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
  .chooseImg {
    border: 3px solid #ff9800;
    border-radius: 5px;
  }
}
</style>
