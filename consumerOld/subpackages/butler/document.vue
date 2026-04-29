<template>
  <view>
    <van-cell-group>
      <van-cell
        title="客户姓名"
        :value="
          formData.exts.name ? formData.exts.name.replace(formData.exts.name.substr(1), '**') : ''
        "
      />
      <van-cell title="客户评分">
        <block v-if="formData.exts.rate || formData.exts.rate == 0">
          <van-rate readonly :value="formData.exts.rate" />
        </block>
        <block v-else>
          <van-rate readonly :value="5" />
        </block>
      </van-cell>
      <van-cell title="师傅姓名" :value="formData.exts.supervisorName" />
      <van-cell title="质保年限" :value="formData.exts.warrantyPeriod + '年'" />
      <van-cell
        title="维修部位"
        :value="
          codelabel('cascade', 'repairParts', formData.attribute, null, {
            multiple: true
          })
        "
      />
      <van-cell title="维修面积" :value="formData.exts.areaNum" />
      <van-cell title="施工工艺" value-class="wrap" :value="formData.exts.products" />
      <van-cell title="图片">
        <view class="img-wrap">
          <van-image
            fit="cover"
            v-for="(item, i) in formData.fileids"
            :key="i"
            width="40vw"
            height="40vw"
            :src="item.url"
            custom-class="c-img"
            @click="imgShowClick"
            :data-src="item.url"
          />
        </view>
      </van-cell>
    </van-cell-group>
    <c-imgshow
      @part_close="part_close"
      :ispart_imgshow="ispart_imgshow"
      :imgshow_url="imgshow_url"
    ></c-imgshow>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
import CImgshow from '../../components/c-imgshow';
export default {
  components: {
    CImgshow
  },
  data() {
    return {
      id: '',
      formData: { fileids: [], exts: {} },
      options: {
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        }
      },
      imgshow_url: '',
      ispart_imgshow: false
    };
  },
  onLoad(params) {
    this.doInit(params);
  },
  methods: {
    doInit(params) {
      common.osg.init(this, params, app);
      this.id = params.id;
      common.osg.codeoption(() => {
        this.getData();
      });
    },
    getData() {
      common.osg.ajax(
        'document/query.do',
        {
          _id: this.id
        },
        res => {
          let formData = res.data[0] || {};
          formData.exts = formData.exts || {};
          if (Array.isArray(formData.fileids)) {
            for (let i = 0; i < formData.fileids.length; i++) {
              if (common.osg.isJson(formData.fileids[i])) {
                formData.fileids[i] = JSON.parse(formData.fileids[i]);
              }
            }
          }
          this.formData = formData;
        }
      );
    },
    /**
     * 点击图片放大
     */
    imgShowClick(e) {
      var url = e.currentTarget.dataset.src;
      if (url) {
        this.imgshow_url = url;
        this.ispart_imgshow = true;
      }
    },
    /**
     * 取消图片全屏预览
     */
    part_close: function () {
      this.ispart_imgshow = false;
    },
    codelabel(type, option, val, opts, frontEndConfig) {
      if (type == 'select') {
        return common.osg.codelabel(option, val, opts);
      } else if (type == 'cascade') {
        if (frontEndConfig && frontEndConfig.multiple) {
          return common.osg.codelabelCascadeMultiple(option, val);
        } else {
          console.log(common.osg.formatCascade(option, val));
          return common.osg.formatCascade(option, val);
        }
      }
    }
  }
};
</script>

<style>
page {
  width: 100vw;
  overflow-x: hidden;
}
.wrap {
  width: 80%;
  text-align: left !important;
}
.c-img {
  border-radius: 8rpx;
  overflow: hidden;
  margin-left: 15rpx;
}
.img-wrap {
  width: 85vw;
  overflow: hidden;
  text-align: left;
}
</style>
