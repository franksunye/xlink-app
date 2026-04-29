<template>
  <view class="classification">
    <view
      :style="
        'position:fixed;z-index:1;height:' +
        systemInfo.navigationHeight +
        'px;padding-left:' +
        systemInfo.menuButtonObject.marginRight +
        'px;line-height:' +
        systemInfo.navigationHeight +
        'px;color:#red;display:flex;background: #fff;width:100%'
      "
    >
      <view
        :style="
          'margin-top:' +
          systemInfo.menuButtonObject.top +
          'px;height:' +
          systemInfo.menuButtonObject.height +
          'px'
        "
        class="search"
        @click="open('../../subpackages/good/search')"
      >
        <uni-icons type="search" color="#999999"></uni-icons>
        <text class="search-content">搜索名称</text>
        <view slot="action" class="search-button">搜索</view>
      </view>
    </view>
    <view class="content" :style="'margin-top:' + systemInfo.navigationHeight + 'px'">
      <view class="left">
        <view
          class="left-item"
          :class="classificationId == '' ? 'left-item-active' : ''"
          @click="onClick({ name: '全部', _id: '' })"
        >
          全部
        </view>
        <view
          v-for="(item, i) in classifications"
          :key="i"
          class="left-item"
          :class="classificationId == item._id ? 'left-item-active' : ''"
          @click="onClick(item)"
        >
          {{ item.name }}维修
        </view>
      </view>
      <view class="right">
        <swiper
          v-if="activityDefs.length > 0"
          autoplay="true"
          :interval="4000"
          :duration="500"
          :style="'height:' + bannerHeight"
          circular
          class="activityBanner"
        >
          <block v-for="(item, i) in activityDefs" :key="i">
            <swiper-item v-if="item.tplImageFileid.length > 0">
              <image
                :src="item.tplImageFileid[0].url"
                style="width: calc(100% - 20px); margin-left: 10px; border-radius: 8px"
                mode="widthFix"
                @load="getHeight"
                @click="open('../../subpackages/activity/activity', { id: item._id })"
              ></image>
            </swiper-item>
          </block>
        </swiper>
        <view class="slogan">
          <view>
            <image
              src="../../static/images/slogan-icon2.png"
              mode="widthFix"
              style="width: 14px"
            ></image>
            <text>标准服务</text>
          </view>
          <view>
            <image
              src="../../static/images/slogan-icon3.png"
              mode="widthFix"
              style="width: 14px"
            ></image>
            <text>价格透明</text>
          </view>
          <view>
            <image
              src="../../static/images/slogan-icon1.png"
              mode="widthFix"
              style="width: 14px"
            ></image>
            <text>准时保障</text>
          </view>
        </view>
        <view class="wares-title">{{ classificationName() }}</view>
        <view class="wares">
          <view
            v-for="(item, i) in wares"
            :key="i"
            class="wares-item"
            @click="open('../../subpackages/good/good', { id: item._id })"
          >
            <image
              :src="
                (item.images && item.images[0] && item.images[0].url) ||
                '../../static/images/logo_square.png'
              "
              mode="aspectFill"
              class="wares-image"
              :style="'width:' + waresWith + ';height:' + waresWith"
            />
            <view class="wares-text c-nowrap">{{ item.name }}</view>
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
      searchValue: '',
      classifications: [],
      classificationId: '',
      activityDefs: [],
      systemInfo: {
        menuButtonObject: {}
      },
      bannerHeight: '',
      waresWith: '75px',
      wares: []
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    this.classificationId = wx.getStorageSync('classificationId') || '';
    this.getClassifications();
    this.getActivityDef();
    this.getWaresSize();
  },
  onShow() {
    // 通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
    if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
      this.$mp.page.getTabBar().setData({
        active: 1
      });
    }

    this.classificationId = wx.getStorageSync('classificationId') || '';
    this.getWares();
  },
  methods: {
    open(path, data) {
      console.log('open', path, data);
      common.osg.open(path, data);
    },
    onChange(e) {
      this.searchValue = e.detail;
    },
    getClassifications() {
      common.osg.ajax(
        'wares/queryClassify.do',
        {
          _all: 1,
          parentId: '4417047658598871409', // C端小程序部位
          'is:state|integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          this.classifications = res.data;
        }
      );
    },
    onClick(item) {
      this.classificationId = item._id;
      wx.setStorageSync('classificationId', item._id);
      this.getWares();
    },
    classificationName() {
      if (!this.classificationId) {
        return '全部';
      } else {
        let arr = this.classifications.filter(item => item._id == this.classificationId);
        if (arr && arr.length > 0) return arr[0].name;
      }
    },
    // 查询商品分类下的服务商品
    getWares() {
      common.osg.ajax(
        '/wares/query',
        {
          page: 1,
          rows: 20,
          'is:state|integer#and': 1,
          'is:classifyId|string#and': this.classificationId,
          'regex:name|string#and': this.searchValue,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.wares = res.data;
        }
      );
    },
    // 获取活动
    getActivityDef() {
      var params = {
        sortField: 'createTime',
        sortOrder: 'desc',
        'is:state|integer#and': 1,
        'is:exts.activityDefType|string#and': '2'
      };
      common.osg.ajax('biz/activityDef/query', params, res => {
        res.data.map(item => {
          if (common.osg.isJson(item.tplImageFileid)) {
            item.tplImageFileid = JSON.parse(item.tplImageFileid);
          } else {
            item.tplImageFileid = [];
          }
        });
        this.activityDefs = res.data;
      });
    },
    // 获取banner高度
    getHeight(e) {
      // #ifdef MP-WEIXIN
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(this)
          .select('.activityBanner')
          .fields(
            {
              size: true
            },
            res => {
              //获取可使用窗口宽度
              var width = res.width - 20;
              //获取图片实际高度
              var imgheight = e.detail.height;
              //获取图片实际宽度
              var imgwidth = e.detail.width;
              //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
              var height = (width * imgheight) / imgwidth;
              height += 'px';
              this.bannerHeight = height;
            }
          )
          .exec();
      });
      // #endif
    },
    getWaresSize() {
      // #ifdef MP-WEIXIN
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(this)
          .select('.wares')
          .fields(
            {
              size: true
            },
            res => {
              this.waresWith = (res.width - 40) / 3 + 'px';
            }
          )
          .exec();
      });
      // #endif
    }
  }
};
</script>

<style lang="scss" scoped>
.classification {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .content {
    flex: 1;
    display: flex;
    width: 100vw;
    overflow: hidden;
    .left {
      width: 100px;
      text-align: center;
      background: #f5f5f7;
      .left-item {
        height: 50px;
        line-height: 50px;
        color: #000;
        font-size: 14px;
        font-weight: 500;
        position: relative;
      }
      .left-item-active {
        background: #fff;
        color: #d60f16;
        font-weight: 600;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 13px;
          border-radius: 0px 5px 5px 0px;
          background: #d60f16;
          width: 4px;
          height: 24px;
          flex-shrink: 0;
        }
      }
    }
    .right {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 50px;
      margin-bottom: env(safe-area-inset-bottom);
      .slogan {
        height: 40px;
        background: #fff;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        > view {
          display: flex;
          align-items: center;
          > text {
            color: #6d6d6d;
            font-family: Inter;
            font-size: 12px;
            margin-left: 3px;
          }
        }
      }
      .wares-title {
        font-size: 14px;
        font-weight: 600;
        margin-left: 10px;
        margin-top: 20px;
      }
      .wares {
        display: flex;
        flex-wrap: wrap;
        .wares-item {
          margin: 10px 0px 10px 10px;
          text-align: center;
          .wares-image {
            width: 75px;
            height: 75px;
            border-radius: 8px;
            display: flex;
            background: #eee;
          }
          .wares-text {
            width: 75px;
            color: #000;
            font-size: 12px;
            font-weight: 500;
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
