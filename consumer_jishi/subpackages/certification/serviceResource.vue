<template>
  <view class="serviceResource">
    <view class="top">
      <image
        v-if="data.exts.photo && data.exts.photo.length > 0"
        :src="data.exts.photo[0].url"
        mode="widthFix"
        class="c-w-100"
      ></image>
      <view class="info c-flex c-flex-between c-item-center">
        <view class="c-flex c-flex-col">
          <text class="c-bold">{{ data.name }}</text>
          <text class="c-size-12 c-color-value c-m-t-10">{{ data.exts.ID || '' }}</text>
        </view>
        <view class="c-size-12 c-flex c-item-center">
          <uni-icons type="star-filled" size="18" color="#FFD33C"></uni-icons>
          <text class="c-m-l-10 c-bold">{{ data.exts.score || 4.9 }}</text>
          <text class="c-color-value">（{{ data.exts.evaluationNumber || 335 }}人评价）</text>
        </view>
      </view>
    </view>

    <view class="data">
      <view class="c-flex c-flex-col c-item-center">
        <view class="icon">
          <image src="https://pub.fsgo365.cn/jishi/weixiushuliang.png" mode="widthFix"></image>
        </view>
        <text class="number">{{ item.exts.repairQuantity || '120+' }}</text>
        <text class="type">维修数量</text>
      </view>
      <view class="c-flex c-flex-col c-item-center">
        <view class="icon">
          <image src="https://pub.fsgo365.cn/jishi/congyenianxian.png" mode="widthFix"></image>
        </view>
        <text class="number">{{ data.exts.years || 7 }}+</text>
        <text class="type">从业年限</text>
      </view>
      <view class="c-flex c-flex-col c-item-center">
        <view class="icon">
          <image src="https://pub.fsgo365.cn/jishi/yonghupingfen.png" mode="widthFix"></image>
        </view>
        <text class="number">{{ data.exts.score || '4.9' }}</text>
        <text class="type">用户评分</text>
      </view>
      <view class="c-flex c-flex-col c-item-center">
        <view class="icon">
          <image src="https://pub.fsgo365.cn/jishi/fuwuquyu2.png" mode="widthFix"></image>
        </view>
        <text class="number">北京</text>
        <text class="type">服务区域</text>
      </view>
    </view>
    <view v-if="data.exts.introduction" style="padding: 12px 0">
      <view class="c-bold c-m-b-20">关于我</view>
      <view class="c-color-value c-size-12">
        {{ data.exts.introduction }}
      </view>
    </view>
    <view class="cases">
      <view class="c-bold c-m-b-20">维修案例</view>
      <view v-for="(item, i) in caseLibrary" :key="i" class="case">
        <view class="c-card-image-view">
          <image
            v-if="item.exts.image && item.exts.image.length > 0"
            :src="item.exts.image[0].url"
            mode="aspectFill"
            class="c-card-image"
            style="height: 130px"
          ></image>
          <view class="address">
            <image
              src="https://pub.fsgo365.cn/jishi/location2.png"
              mode="widthFix"
              style="width: 9px"
              class="c-m-r-10"
            ></image>
            <text>{{ item.exts.address }}</text>
          </view>
        </view>
        <view class="case-content">
          <view class="c-size-14">
            {{ item.maintainAreaNum }}㎡·{{ formatRepairParts(item.repairParts) }}
          </view>
          <view class="c-bold">{{ item.name }}</view>
          <view class="c-size-12 c-color-gray">维修于{{ item.exts.repairTime }}</view>
          <view v-if="item.exts.tags" class="c-size-12 c-color-gray">
            {{ formatTags(item.exts.tags) }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      id: '',
      data: { exts: {} },
      caseLibrary: [],
      options: {
        cascadeCode_caseLocation: { codeId: 'caseLocation' },
        codecfg_caseTag: { codeId: 'caseTag' }
      }
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.id = params.id;
    this.getData();
    common.osg.codeoption(() => {
      this.getCaseLibrary();
    });
  },
  methods: {
    getData() {
      common.osg.ajax(`/biz/serviceResource/findById/${this.id}.do`, {}, res => {
        if (common.osg.isJson(res.data.exts.photo)) {
          res.data.exts.photo = JSON.parse(res.data.exts.photo);
        } else {
          res.data.exts.photo = [];
        }
        this.data = res.data;
      });
    },
    getCaseLibrary() {
      common.osg.ajax(
        'basic/caseLibrary/query.do',
        {
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:exts.serviceResourceId|string#and': this.id
        },
        res => {
          this.caseLibrary = res.data;
        },
        {
          noload: true
        }
      );
    },
    formatRepairParts(value) {
      let str = common.osg.codelabelCascade('caseLocation', value);
      return str.split(' / ')[1];
    },
    formatTags(value) {
      return common.osg.codelabelForArray('caseTag', value)?.replace(/、/g, '·') || '';
    }
  }
};
</script>

<style lang="scss" scoped>
.serviceResource {
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom);
  .top {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0px 3px 30px 0px rgba(16, 16, 16, 0.04);
    .info {
      padding: 16px 12px;
    }
  }
  .data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 36px 0 24px;
    > view {
      .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #fcefed;
        display: flex;
        align-items: center;
        justify-content: center;
        image {
          width: 22px;
          max-height: 24px;
        }
      }
      .number {
        font-weight: 600;
        margin: 10px 0 5px;
      }
      .type {
        font-size: 12px;
        color: #939393;
      }
    }
  }
  .cases {
    margin-top: 12px;
    .case {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0px 3px 30px 0px rgba(0, 0, 0, 0.04);
      margin-bottom: 12px;
      .c-card-image-view {
        position: relative;
        width: 100%;
        .c-card-image {
          display: flex;
          width: 100%;
          height: 100%;
        }
        .address {
          display: flex;
          align-items: center;
          position: absolute;
          bottom: 12px;
          left: 12px;
          image {
            margin-bottom: 1px;
          }
          text {
            color: #fff;
            font-size: 11px;
          }
        }
      }
      .case-content {
        padding: 8px 12px;
      }
    }
  }
}
</style>
