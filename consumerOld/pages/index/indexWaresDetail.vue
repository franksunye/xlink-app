<template>
  <view>
    <block v-for="(itemData, index) in list" :key="index">
      <view class="images" v-for="(item, index) in itemData.exts.imagesDetail" :key="index">
        <!-- <van-image :src="item.url" /> -->
        <image mode="widthFix" style="width: 100vw" :src="item.url" />
      </view>
    </block>
    <view class="BelowButton" style="padding: 16px 0 0">
      <van-button
        color="#1989fa"
        block
        @click="doOpen('/pages/declaration/declaration')"
        custom-style="border-radius:10px;font-size:20px;font-weight:600;background-color:#1989fa"
      >
        免费预约
      </van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      fpi: {
        data: [],
        page: 1,
        rows: 10
      },
      options: {},
      // 省市区
      areaList: Object.assign({}, areajs.default),
      waresId: '',
      list: []
    };
  },
  methods: {
    onLoad: function (param) {
      this.doInit(param);
    },
    doInit(param) {
      this.waresId = param._id;
      common.osg.init(this, param, app);
      this.getData();
    },
    onSearch: function (e) {},
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    //切换排序

    getData: function () {
      var params = {
        page: this.fpi.page,
        rows: this.fpi.rows,
        'regex:name|string#or': this.searchValue,
        'is:_id|string#and': this.waresId,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('/wares/query.do', params, res => {
        this.list = res.data;

        this.$nextTick(() => {});
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.BelowButton {
  position: fixed;
  bottom: 0;
  width: 100vw;
  padding-bottom: 5px;
  line-height: 45px;
  z-index: 99;
}
// .images :last-child {
//   padding-bottom: 40px;
// }
</style>
