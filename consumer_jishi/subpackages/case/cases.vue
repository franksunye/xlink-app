<template>
  <view class="cases">
    <view class="filter-group">
      <view class="filter">
        <view class="filter-left">部位</view>
        <view class="filter-right">
          <text
            v-for="(item, i) in options.caseLocation"
            :key="i"
            @click="caseLocationClick1(item.value, i)"
            :class="caseLocation1 == item.value ? 'c-jishi' : ''"
          >
            {{ item.name }}
          </text>
        </view>
      </view>
      <view
        v-if="caseLocation1 && options.caseLocation[caseLocationIndex].children.length > 0"
        class="filter c-m-t-20"
      >
        <view class="filter-left">类型</view>
        <view class="filter-right">
          <text
            v-for="(item, i) in options.caseLocation[caseLocationIndex].children"
            :key="i"
            @click="caseLocationClick2(item.value)"
            :class="caseLocation2 == item.value ? 'c-jishi' : ''"
          >
            {{ item.name }}
          </text>
        </view>
      </view>
    </view>
    <view v-if="loaded && !data.length" class="c-uni-empty">
      <image src="https://pub.fsgo365.cn/empty.png"></image>
      <text>暂无数据</text>
    </view>
    <view class="content" v-if="data.length > 0">
      <view
        class="c-card"
        style="padding-top: 10px"
        v-for="(item, i) in data"
        :key="i"
        @tap="open('/subpackages/case/case', { id: item._id })"
        :data-id="item._id"
      >
        <view class="c-card-image-view">
          <image
            v-if="item.exts.image && item.exts.image.length > 0"
            :src="item.exts.image[0].url"
            mode="aspectFill"
            class="c-card-image"
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
        <view class="c-card-content">
          <view class="c-m-b-b">
            {{ item.maintainAreaNum }}㎡·{{ formatRepairParts(item.repairParts) }}
          </view>
          <view class="c-m-b-10 c-bold">
            {{ item.name }}
          </view>
          <view class="c-m-b-5 c-size-11">维修于{{ item.exts.repairTime }}</view>
          <view class="c-m-b-10 c-size-11">{{ formatTags(item.exts.tags) }}</view>
          <view class="c-size-10">技术工程师：{{ item.exts.serviceResourceIdLabel }}</view>
        </view>
      </view>
    </view>
    <view v-else class="c-uni-empty">
      <image src="https://pub.fsgo365.cn/empty.png"></image>
      <text>没有数据</text>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      loaded: false,
      data: [],
      options: {
        caseLocation: [],
        cascadeCode_caseLocation: { codeId: 'caseLocation' },
        codecfg_caseTag: { codeId: 'caseTag' }
      },
      caseLocationIndex: 0,
      caseLocation1: '',
      caseLocation2: ''
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    open(path, data) {
      common.osg.open(path, data);
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    getData() {
      common.osg.ajax(
        'basic/caseLibrary/query.do',
        {
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:repairParts|string#and[0]': this.caseLocation1 || null,
          'is:repairParts|string#and[1]': this.caseLocation2 || null
        },
        res => {
          this.data = res.data;
          this.loaded = true;
        },
        {
          noload: true
        }
      );
    },
    caseLocationClick(type, value, index) {
      if (this['caseLocation' + type] == value) {
        this['caseLocation' + type] = '';
      } else {
        this['caseLocation' + type] = value;
        if (type == 1) {
          this.caseLocationIndex = index;
          console.log('index', index);
        }
        this.$forceUpdate();
      }
    },
    caseLocationClick1(value, index) {
      if (this.caseLocation1 == value) {
        this.caseLocation1 = '';
        this.caseLocationIndex = 0;
      } else {
        this.caseLocation1 = value;
        this.caseLocationIndex = index;
      }
      this.caseLocation2 = '';
      this.getData();
    },
    caseLocationClick2(value) {
      if (this.caseLocation2 == value) {
        this.caseLocation2 = '';
      } else {
        this.caseLocation2 = value;
      }
      this.getData();
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
.cases {
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  background: #f7f7f7;
  .filter-group {
    padding: 12px;
    background-color: #ffffff;
    .filter {
      width: 100%;
      display: flex;
      align-items: center;
      .filter-left {
        width: 44px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        background-color: #ff6900;
        border-radius: 12px;
        font-size: 12px;
        color: #ffffff;
      }
      .filter-right {
        flex: 1;
        display: flex;
        text {
          min-width: 25%;
          text-align: center;
        }
      }
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    gap: 12px;
    box-sizing: border-box;
    width: 100vw;
    .c-card {
      width: calc((100vw - 36px) / 2);
      box-sizing: border-box;
      margin: 0;
      padding: 0 !important;
      border-radius: 8px;
      .c-card-image-view {
        position: relative;
        width: calc((100vw - 36px) / 2);
        height: calc((100vw - 36px) / 2);
        .c-card-image {
          display: flex;
          // width: calc((100vw - 36px) / 2);
          // height: calc((100vw - 36px) / 2);
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

      .c-card-content {
        padding: 12px;
        line-height: unset;
      }
    }
  }
}
</style>
