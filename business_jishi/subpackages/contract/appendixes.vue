<template>
  <view class="appendixes" @click.capture="track">
    <view class="top">
      <view @click="copy(contract.contractdocNum)" :data-event="{ id: 'DZ7vH6qhT8' }">
        合同编号：{{ contract.contractdocNum || '' }}
      </view>
    </view>
    <view class="content">
      <view v-for="(item, i) of attachment" :key="i" class="c-card">
        <view class="c-card-title">{{ item.type == 0 ? '增项' : '减项' }}</view>
        <view class="c-card-content">
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">签署状态：</view>
            <view>
              {{ codelabel('contractStatus', String(item.supplementTreatyStatus)) }}
            </view>
          </view>
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">签约方式：</view>
            <view>{{ item.qysTradeIn == 0 ? '电子签约' : '线下签约' }}</view>
          </view>
          <view v-if="item.imagesName" class="c-card-content-item">
            <view class="c-card-content-item-label">资料名称：</view>
            <view>{{ item.imagesName }}</view>
          </view>
          <view
            v-for="(imageItem, imageIndex) of item.images"
            :key="imageIndex"
            class="c-card-content-item"
          >
            <view class="c-card-content-item-label">上传资料：</view>
            <view
              class="c-blue"
              :data-filename="imageItem.url"
              @click="download"
              :data-event="{ id: 'H_GxEZPxud' }"
            >
              点击查看
            </view>
          </view>
        </view>
        <view class="c-card-footer">
          <van-button
            v-if="item.supplementTreatyStatus == 0 && item.qysTradeIn == 0"
            plain
            round
            size="small"
            @click="getSignatureUrl(item)"
            :data-event="{ id: 'FkYTH6RMTb' }"
          >
            签约二维码
          </van-button>
          <van-button
            v-if="item.contractSupplementTreatypdf"
            plain
            round
            size="small"
            class="c-m-l-20"
            :data-filename="item.contractSupplementTreatypdf"
            @click="download"
            :data-event="{ id: 'KCquBJJJsb' }"
          >
            查看附件
          </van-button>
        </view>
      </view>
      <view v-for="(item, i) of refund" :key="i" class="c-card">
        <view class="c-card-title">
          退款说明（{{ item.refundType == '1' ? '客户版' : '服务商垫资版' }}）
        </view>
        <view class="c-card-content">
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">签署状态：</view>
            <view>
              {{ codelabel('contractStatus', String(item.contractRefundStatus)) }}
            </view>
          </view>
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">签约方式：</view>
            <view>{{ item.qysTradeIn == 0 ? '电子签约' : '线下签约' }}</view>
          </view>
          <view v-if="item.imagesName" class="c-card-content-item">
            <view class="c-card-content-item-label">资料名称：</view>
            <view>{{ item.imagesName }}</view>
          </view>
          <view
            v-for="(imageItem, imageIndex) of item.images"
            :key="imageIndex"
            class="c-card-content-item"
          >
            <view class="c-card-content-item-label">上传资料：</view>
            <view
              class="c-blue"
              :data-filename="imageItem.url"
              @click="download"
              :data-event="{ id: '560ngjuwb3' }"
            >
              点击查看
            </view>
          </view>
        </view>
        <view class="c-card-footer">
          <van-button
            v-if="item.contractRefundStatus == 0 && item.qysTradeIn == 0"
            plain
            round
            size="small"
            @click="getSignatureUrl(item)"
            :data-event="{ id: '0lNTV4legp' }"
          >
            签约二维码
          </van-button>
          <van-button
            v-if="item.refundUrl"
            plain
            round
            size="small"
            class="c-m-l-20"
            :data-filename="item.refundUrl"
            @click="download"
            :data-event="{ id: 'ygdPLeetLi' }"
          >
            查看附件
          </van-button>
        </view>
      </view>
      <view v-for="(item, i) of singleSupplementTreaty" :key="i" class="c-card">
        <view class="c-card-title">补充协议</view>
        <view class="c-card-content">
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">签署状态：</view>
            <view>
              {{ codelabel('contractStatus', String(item.singleSupplementTreatyStatus)) }}
            </view>
          </view>
          <view class="c-card-content-item">
            <view class="c-card-content-item-label">签约方式：</view>
            <view>{{ item.qysTradeIn == 0 ? '电子签约' : '线下签约' }}</view>
          </view>
          <view v-if="item.imagesName" class="c-card-content-item">
            <view class="c-card-content-item-label">资料名称：</view>
            <view>{{ item.imagesName }}</view>
          </view>
          <view
            v-for="(imageItem, imageIndex) of item.images"
            :key="imageIndex"
            class="c-card-content-item"
          >
            <view class="c-card-content-item-label">上传资料：</view>
            <view
              class="c-blue"
              :data-filename="imageItem.url"
              @click="download"
              :data-event="{ id: 'MIVfrnSRbR' }"
            >
              点击查看
            </view>
          </view>
        </view>
        <view class="c-card-footer">
          <van-button
            v-if="item.singleSupplementTreatyStatus == 0 && item.qysTradeIn == 0"
            plain
            round
            size="small"
            @click="getSignatureUrl(item)"
            :data-event="{ id: 'BiYg0pWl_m' }"
          >
            签约二维码
          </van-button>
          <view v-else></view>
          <van-button
            v-if="item.singleSupplementTreatypdf"
            plain
            round
            size="small"
            class="c-m-l-20"
            :data-filename="item.singleSupplementTreatypdf"
            @click="download"
            :data-event="{ id: 'LhoTIHEzIj' }"
          >
            查看附件
          </van-button>
        </view>
      </view>
    </view>
    <van-empty
      v-if="
        requestTimes == 3 &&
        attachment.length == 0 &&
        refund.length == 0 &&
        singleSupplementTreaty.length == 0
      "
      description="没有合同附件"
      class="c-empty"
    ></van-empty>
    <!-- 合同签约二维码 -->
    <van-dialog
      use-slot
      title="契约锁签约二维码"
      :show="signatureUrl.show"
      confirmButtonText="保存图片"
      confirm-button-color="#ff6900"
      @confirm="saveCode"
      showCancelButton
      cancelButtonText="关闭"
      @cancel="clearCode"
      :data-event="{ id: 'O6Isn7jErY', capture: false }"
    >
      <tki-qrcode
        style="text-align: center; margin-bottom: 10px"
        ref="tkiQrcode"
        :val="signatureUrl.val"
        :size="400"
        icon="/static/images/qys.jpg"
        :iconSize="60"
        :onval="true"
      ></tki-qrcode>
    </van-dialog>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
import tkiQrcode from '@/wxcomponents/tki-qrcode/tki-qrcode.vue';
export default {
  components: {
    tkiQrcode
  },
  data() {
    return {
      requestTimes: 0,
      contract: {}, // 合同
      attachment: [], // 增减项
      refund: [], // 退款说明
      singleSupplementTreaty: [], // 补充协议
      // 查看契约锁签约二维码
      signatureUrl: {
        show: false,
        val: ''
      },
      options: {
        codecfg_contractStatus: { codeId: 'contractStatus' }
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    let row = decodeURI(common.osg.param('row') || '') || null;
    this.contract = common.osg.isJson(row) && JSON.parse(row);
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    // 获取增减项列表、退款说明、补充协议
    getData() {
      // 增减项
      common.osg.ajax(
        'basic/contract/querySupplementTreaty.do',
        { _all: '1', contractId: this.contract._id, sortField: 'type', sortOrder: 'asc' },
        res => {
          this.attachment = res.data || [];
          this.requestTimes += 1;
        }
      );
      // 退款说明
      common.osg.ajax(
        'basic/contract/queryContractRefund.do',
        { _all: '1', contractId: this.contract._id },
        res => {
          this.refund = res.data || [];
          this.requestTimes += 1;
        }
      );
      // 补充协议
      common.osg.ajax(
        'basic/contract/querySingleSupplementTreaty.do',
        { _all: '1', contractId: this.contract._id },
        res => {
          this.singleSupplementTreaty = res.data || [];
          this.requestTimes += 1;
        }
      );
    },
    // 获取签约二维码
    getSignatureUrl(item) {
      common.osg.ajax(
        '/basic/contract/getSignatureUrl',
        { sid: item._id, phone: item.contractPhone },
        res => {
          this.signatureUrl.val = res.message;
          this.signatureUrl.show = true;
          this.$nextTick(() => {
            this.$refs.tkiQrcode._makeCode();
          });
        },
        {
          noload: true
        }
      );
    },
    // 文件预览
    download(e) {
      var fileName = e.currentTarget.dataset.filename;
      var fileType = fileName.substring(
        fileName.lastIndexOf('.') + 1,
        fileName.lastIndexOf('?') != -1 ? fileName.lastIndexOf('?') : fileName.length
      );
      var filePath = fileName;
      if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif') {
        //图片预览
        wx.previewImage({
          current: filePath, // 当前显示图片的http链接
          urls: [filePath] // 需要预览的图片http链接列表
        });
      } else {
        //文件下载
        wx.downloadFile({
          url: filePath,
          success: function (res) {
            let filePath = res.tempFilePath;
            wx.openDocument({
              filePath: filePath,
              fileType,
              showMenu: true,
              success: function (res) {
                console.log(res);
              },
              fail: function (res) {
                console.log(res);
              },
              complete: function (res) {
                console.log(res);
              }
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    },
    clearCode() {
      this.signatureUrl.show = false;
      this.$refs.tkiQrcode._clearCode();
    },
    saveCode() {
      this.$refs.tkiQrcode._saveCode();
      this.signatureUrl.show = false;
    },
    // 复制到剪切板
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    }
  }
};
</script>

<style lang="scss" scoped>
.appendixes {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .top {
    background: #fff;
    font-weight: 600;
    padding: 10px 20px;
  }
  .content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
