<template>
  <view class="c-size-14" style="padding-bottom: 200rpx">
    <view class="detail">
      <view class="c-flex c-item-center c-m-b-5 c-bold c-size-16">
        <view class="tips"></view>
        合同附件
      </view>
      <view style="margin-left: 26rpx; line-height: 44rpx">
        <view class="c-flex c-flex-between c-item-center">
          <text>合同编号：</text>
          <text>{{ contractData.contractdocNum || '' }}</text>
        </view>
      </view>
    </view>
    <view class="detail">
      <van-collapse :value="activeNames" @change="onChange">
        <van-collapse-item title="合同增项" name="1">
          <view
            class=""
            v-for="(item, i) of attachmentData.addAttachmentList"
            :key="i"
            style="border: 1px solid #dfe3eb; border-radius: 3px; padding: 8px; margin-bottom: 10px"
          >
            <view class="" v-if="item.supplementTreatyStatus">
              签署状态：{{ item.supplementTreatyStatus == '10' ? '已签约' : '待签约' }}
            </view>
            <p>签约方式：{{ item.qysTradeIn == 0 ? '线上' : '线下' }}</p>
            <view
              class=""
              style="display: flex; justify-content: flex-end; margin: 10rpx 0"
              v-if="item.contractSupplementTreatypdf"
            >
              <van-button
                color="#D32D26"
                plain
                round
                size="small"
                @click="download"
                :data-filename="item.contractSupplementTreatypdf"
              >
                查看附件
              </van-button>
            </view>
            <view class="" v-if="item.imagesName">上传资料名称：{{ item.imagesName }}</view>
            <view
              class=""
              style="display: flex; justify-content: flex-end; margin: 10rpx 0"
              v-if="item.images"
            >
              <van-button
                v-for="(imageItem, imageIndex) of item.images"
                :key="imageIndex"
                color="#D32D26"
                plain
                round
                size="small"
                @click="download"
                custom-style="margin-left:10rpx"
                :data-filename="imageItem.url"
              >
                查看上传资料
              </van-button>
            </view>
          </view>
        </van-collapse-item>
        <van-collapse-item title="合同减项" name="2">
          <view
            class=""
            v-for="(item, i) of attachmentData.deductionAttachmentList"
            :key="i"
            style="border: 1px solid #dfe3eb; border-radius: 3px; padding: 8px; margin-bottom: 10px"
          >
            <view class="" v-if="item.supplementTreatyStatus">
              签署状态：{{ item.supplementTreatyStatus == '10' ? '已签约' : '待签约' }}
            </view>
            <p>签约方式：{{ item.qysTradeIn == 0 ? '线上' : '线下' }}</p>
            <view
              class=""
              style="display: flex; justify-content: flex-end; margin: 10rpx 0"
              v-if="item.contractSupplementTreatypdf"
            >
              <van-button
                color="#D32D26"
                plain
                round
                size="small"
                @click="download"
                :data-filename="item.contractSupplementTreatypdf"
              >
                查看附件
              </van-button>
            </view>
            <view class="" v-if="item.imagesName">上传资料名称：{{ item.imagesName }}</view>
            <view
              class=""
              style="display: flex; justify-content: flex-end; margin: 10rpx 0"
              v-if="item.images"
            >
              <van-button
                v-for="(imageItem, imageIndex) of item.images"
                :key="imageIndex"
                color="#D32D26"
                plain
                round
                size="small"
                @click="download"
                custom-style="margin-left:10rpx"
                :data-filename="imageItem.url"
              >
                查看上传资料
              </van-button>
            </view>
          </view>
        </van-collapse-item>
        <van-collapse-item title="退款资料" name="3">
          <view
            class=""
            v-for="(item, i) of attachmentData.refundDataList"
            :key="i"
            style="border: 1px solid #dfe3eb; border-radius: 3px; padding: 8px; margin-bottom: 10px"
          >
            <view class="">
              {{ item.refundType == '1' ? '客户版' : '服务商垫资版' }}
              <view class="" v-if="item.contractRefundStatus">
                签署状态：{{ item.contractRefundStatus == '10' ? '已签约' : '待签约' }}
              </view>
              <p>签约方式：{{ item.qysTradeIn == 0 ? '线上' : '线下' }}</p>
            </view>
            <view
              style="display: flex; justify-content: flex-end; margin: 10rpx 0"
              v-if="item.refundUrl"
            >
              <view
                class=""
                @click="download"
                :data-filename="item.refundUrl"
                style="color: #409eff"
              >
                下载退款说明
                <van-icon name="down" />
              </view>
            </view>
            <view v-if="item.imagesName">
              <view class="">上传资料名称：{{ item.imagesName }}</view>
            </view>
            <view class="" style="display: flex; justify-content: flex-end; margin: 10rpx 0">
              <van-button
                v-for="(imageItem, imageIndex) of item.images"
                :key="imageIndex"
                color="#D32D26"
                plain
                round
                size="small"
                @click="download"
                custom-style="margin-left:10rpx"
                :data-filename="imageItem.url"
              >
                查看上传资料
              </van-button>
            </view>
          </view>
        </van-collapse-item>
        <!--  <van-collapse-item title="变更条款" name="4">
	     变更条款
	   </van-collapse-item> -->
        <van-collapse-item title="补充协议" name="5">
          <view
            class=""
            v-for="(item, i) of attachmentData.sideAgreementList"
            :key="i"
            style="border: 1px solid #dfe3eb; border-radius: 3px; padding: 8px; margin-bottom: 10px"
          >
            <view class="" v-if="itme.singleSupplementTreatyStatus">
              签署状态：{{ item.singleSupplementTreatyStatus == '10' ? '已签约' : '待签约' }}
            </view>
            <p>签约方式：{{ item.qysTradeIn == 0 ? '线上' : '线下' }}</p>
            <view
              class=""
              style="display: flex; justify-content: flex-end; margin: 10rpx 0"
              v-if="item.singleSupplementTreatypdf"
            >
              <van-button
                color="#D32D26"
                plain
                round
                size="small"
                @click="download"
                :data-filename="item.singleSupplementTreatypdf"
              >
                查看附件
              </van-button>
            </view>
            <view class="" v-if="item.imagesName">上传资料名称：{{ item.imagesName }}</view>
            <view
              class=""
              style="display: flex; justify-content: flex-end; margin: 10rpx 0"
              v-if="item.images"
            >
              <van-button
                v-for="(imageItem, imageIndex) of item.images"
                :key="imageIndex"
                color="#D32D26"
                plain
                round
                size="small"
                @click="download"
                custom-style="margin-left:10rpx"
                :data-filename="imageItem.url"
              >
                查看上传资料
              </van-button>
            </view>
          </view>
        </van-collapse-item>
      </van-collapse>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5'],
      contractData: {}, //合同对象
      options: {},
      //上传合同附件
      attachmentData: {
        openDetail: false,
        fileList: [], //表单的上头图片组件列表
        fileListName: '', //附件名字
        name: '', //更改的对象名称
        itemIndex: 0, //细项索引
        imagesName: '', //上传图片的名称
        attachmentList: [], //附件列表
        addAttachmentList: [], //增项列表
        deductionAttachmentList: [], //减项列表
        refundDataList: [], //退款资料列表
        changeClauseList: [], //变更条款列表
        sideAgreementList: [] //补充协议列表
      }
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    let row = decodeURI(common.osg.param('row') || '') || null;
    this.contractData = common.osg.isJson(row) && JSON.parse(row);
    // this.getContract(()=>{
    this.getExtForm();
    // });
    console.log(this.contractData);
  },
  methods: {
    onChange(event) {
      this.activeNames = event.detail;
    },
    // 获取增减项列表、退款说明列表
    getExtForm() {
      //获取增减项列表
      common.osg.ajax(
        'basic/contract/querySupplementTreaty.do',
        { contractId: this.contractData._id },
        res => {
          this.attachmentData.addAttachmentList = [];
          this.attachmentData.deductionAttachmentList = [];
          if (Array.isArray(res.data)) {
            // 1减项、0增项
            res.data.forEach(item => {
              if (item.type == '1') {
                this.attachmentData.deductionAttachmentList.push(item); //增项列表
              } else {
                this.attachmentData.addAttachmentList.push(item); //减项列表
              }
            });
          }
        }
      );
      //退款说明列表
      common.osg.ajax(
        'basic/contract/queryContractRefund.do',
        { contractId: this.contractData._id },
        res => {
          if (Array.isArray(res.data)) {
            this.attachmentData.refundDataList = res.data;
          }
        }
      );
      // 补充协议列表
      common.osg.ajax(
        'basic/contract/querySingleSupplementTreaty.do',
        { contractId: this.contractData._id },
        res => {
          this.attachmentData.sideAgreementList = [];
          if (Array.isArray(res.data)) {
            res.data.forEach(item => {
              this.attachmentData.sideAgreementList.push(item); //增项列表
            });
          }
        }
      );
    },
    //获取合同
    getContract(cb) {
      common.osg.ajax(
        'basic/contract/query.do',
        {
          'is:_id|string#and': this.contractData._id,
          'in:state|array-integer#and': '1',
          sortField: 'updateTime',
          sortOrder: 'asc'
        },
        res => {
          //解析合同存储退款资料列表
          // this.attachmentData.refundDataList = common.osg.isJson(res.data[0].exts.refundDataList)
          // ? JSON.parse(res.data[0].exts.refundDataList)
          // : res.data[0].exts.refundDataList || [];
          if (cb) cb();
        }
      );
    },
    /**
     * 文件预览
     */
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
    }
  }
};
</script>

<style></style>
