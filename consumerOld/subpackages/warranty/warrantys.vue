<template>
  <view style="padding: 1px 0 20px">
    <block v-if="fpi.data && fpi.data.length > 0">
      <view v-for="(item, i) in fpi.data" :key="i" class="c-card">
        <view class="c-card-title">
          <text>{{ formatPart(item) }}</text>
          <text class="c-yellow">{{ item.state == 1 ? '有效' : '无效' }}</text>
        </view>
        <view class="c-card-content">
          <view>客户姓名：{{ item.ownerName }}</view>
          <view>联系电话：{{ item.ownerPhone }}</view>
          <view>施工地址：{{ item.serviceAppointmentAddress }}</view>
          <view>质保部位：{{ formatPart(item) }}</view>
          <view>涂膜面积：{{ formatArea(item) }}㎡</view>
          <view>保障生效时间：{{ item.startTime }}</view>
          <view>保障结束时间：{{ item.guaranteedTime }}</view>
        </view>
        <view class="c-card-footer" v-if="item.state == 1">
          <view></view>
          <!-- #ifdef MP-WEIXIN -->
          <van-button
            color="#D32D26"
            plain
            round
            size="small"
            @click="download"
            :data-filename="item.pdfUrl"
          >
            查看文件
          </van-button>
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <a :href="item.pdfUrl" class="btn-a">查看文件</a>
          <!-- #endif -->
        </view>
      </view>
    </block>
    <van-empty v-else description="暂无数据" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      fpi: {
        data: []
      }
    };
  },
  onLoad(params) {
    this.doInit(params);
  },
  methods: {
    doInit(params) {
      common.osg.init(params);
      this.getData();
    },
    /**
     * 查询质保
     */
    getData() {
      // 判断是否登录超时或未登录（1天内无需重复登录）
      let login = wx.getStorageSync('login');
      if (!login || new Date().getTime() - login.time > 1000 * 60 * 60 * 24 * 1) {
        common.osg.alert('登录超时，请重新登录', () => {
          common.osg.open('../../subpackages/login/login');
        });
        return;
      } else {
        var ownerPhone = login.phone;
      }

      common.osg.ajax(
        `~${common.osg.host}/fsgo/i/zDocument/zqueryWarranty.do`,
        {
          ownerPhone,
          tenantId: '4551453470943235290',
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.fpi = res;
        }
      );
    },
    /**
     * 展示部位名称
     */
    formatPart(item) {
      if (item.part1 != '-') {
        return '普通卫生间';
      }
      if (item.part2 != '-') {
        return '降板卫生间';
      }
      if (item.part3 != '-') {
        return '厨房';
      }
      if (item.part4 != '-') {
        return '阳台';
      }
    },
    /**
     * 展示部位名称面积
     */
    formatArea(item) {
      if (item.part1 != '-') {
        return item.part1;
      }
      if (item.part2 != '-') {
        return item.part2;
      }
      if (item.part3 != '-') {
        return item.part3;
      }
      if (item.part4 != '-') {
        return item.part4;
      }
    },
    /**
     * 文件预览
     */
    download(e) {
      var fileName = e.currentTarget.dataset.filename;
      var fileType = fileName.split('.')[1];
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

<style>
.btn-a {
  color: #323233;
  text-decoration: none;
  border: 1px solid rgb(211, 45, 38);
  border-radius: 999px;
  font-size: 12px;
  padding: 5px 10px;
}
.van-empty {
  height: 100vh;
}
</style>
