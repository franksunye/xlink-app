<template>
  <view class="account">
    <view class="tab">
      <view :class="tabClick == '0' ? 'doTabClick' : 'unDoTabClick'" @click="tabChange('0')">
        全部
      </view>
      <view
        :class="tabClick == item.value ? 'doTabClick' : 'unDoTabClick'"
        v-for="(item, index) in options.repairPartsOne"
        :key="index"
        @click="tabChange(item.value)"
      >
        <view>
          {{ item.name }}
        </view>
      </view>
    </view>
    <view class="pushBlock" v-for="(item, index) in activityDefData" :key="index">
      <!-- <view class="title">
        <text>全部商品</text>
      </view> -->
      <!-- <view class="icon">
        <view>
          <image
            style="width: 20px; position: relative"
            mode="widthFix"
            src="../../static/images/Ellipse1.png"
          />
          <image style="width: 20px" mode="widthFix" src="../../static/images/Ellipse2.png" />
          <image
            style="width: 20px; position: absolute; left: 58px"
            mode="widthFix"
            src="../../static/images/Ellipse4.png"
          />
        </view>
        <view class="iconTitle">
          <text>368个帮客正在推</text>
        </view>
      </view> -->
      <!-- 商品列表 -->
      <view>
        <view
          class="c-flex good"
          @click="doOpen('../../subpackages/good/goodDetail', { _id: item._id })"
        >
          <view style="padding-right: 15px">
            <image style="width: 116px" mode="widthFix" :src="item.exts.goodsImg[0].url" />
          </view>
          <view>
            <view class="c-flex">
              <image
                style="width: 41px; padding-right: 8px"
                mode="widthFix"
                src="../../static/images/goodsLogo.png"
              />
              <text style="color: #000; font-size: 14px; font-weight: 500">{{ item.name }}</text>
            </view>
            <view style="padding: 5px 0">
              <!-- <van-tag style="padding-right: 5px" plain color="#EF3922" text-color="#EF3922">
                19元勘查券
              </van-tag> -->
              <van-tag plain color="#D9D9D9" text-color="#878787">
                {{ format('activityDefTag', item.exts.activityTag, 'multiple') }}
              </van-tag>
            </view>
            <view style="display: flex; padding-bottom: 5px">
              <view style="padding-right: 10px">
                <text class="textTitle">有效线索</text>
                <text class="textIcon">￥</text>
                <text class="textNum">{{ item.exts.effectiveCluesCost }}</text>
              </view>
              <view>
                <text class="textTitle">佣金比例</text>
                <text class="textNum">{{ item.exts.commissionRate }}%</text>
                <text class="textNum2">(￥200±)</text>
              </view>
            </view>
            <view style="position: relative">
              <image
                style="width: 80px; width: 80px; height: 40px; z-index: 1; position: absolute"
                mode="widthFix"
                src="../../static/images/Vector1.png"
              />
              <view style="position: relative; z-index: 2">
                <view style="display: flex">
                  <text
                    style="
                      color: #fff;
                      font-size: 12px;
                      font-weight: 500;
                      position: absolute;
                      left: 3px;
                      top: 12px;
                    "
                  >
                    ￥
                  </text>
                  <text
                    style="
                      color: #fff;
                      font-size: 20px;
                      font-weight: 600;
                      position: absolute;
                      left: 14px;
                      top: 5px;
                    "
                  >
                    {{ item.exts.goodsPrice }}
                  </text>
                </view>
                <view style="position: relative; top: 25px">
                  <text
                    style="
                      color: #fff;
                      font-size: 8px;
                      font-weight: 400;
                      position: absolute;
                      left: 8px;
                      top: 4px;
                      width: 40px;
                    "
                  >
                    上门费¥19
                  </text>
                  <view
                    style="
                      width: 45px;
                      height: 1px;
                      overflow: hidden;
                      z-index: 2;
                      background: #fff;
                      position: absolute;
                      top: 10px;
                      left: 5px;
                    "
                  ></view>
                </view>
              </view>

              <image
                style="width: 90px; position: absolute; left: 55px; top: 10px"
                mode="widthFix"
                src="../../static/images/Vector2.png"
              />
              <view style="z-index: 2; position: absolute; left: 80px; top: 15px">
                <text
                  style="
                    color: #f03a23;
                    font-size: 10px;
                    font-weight: 500;
                    position: relative;
                    bottom: 4px;
                    right: 4px;
                  "
                >
                  赚￥
                </text>

                <text
                  style="
                    color: #f03a23;
                    font-size: 17px;
                    font-weight: 600;
                    position: relative;
                    right: 4px;
                  "
                >
                  {{ item.exts.earnedPrice }}
                </text>
              </view>
              <image
                style="width: 15px; position: absolute; left: 135px; top: 10px"
                mode="widthFix"
                src="../../static/images/Vector3.png"
              />
              <image
                style="width: 62px; position: absolute; left: 135px; top: 10px"
                mode="widthFix"
                src="../../static/images/Vector4.png"
              />
              <view style="position: absolute; z-index: 2; left: 150px; top: 12px">
                <text style="color: #fff; font-size: 11px; font-weight: 400; padding-right: 3px">
                  马上推
                </text>
                <image
                  style="width: 6px"
                  mode="widthFix"
                  src="../../static/images/VectorIcon.png"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      options: {
        codecfg_activityDefTag: { codeId: 'activityDefTag' },
        codecfg_repairPartsOne: { codeId: 'repairPartsOne' } // 维修部位一级
      },
      systemInfo: {
        menuButtonObject: {}
      },
      activityDefData: {}, //商品模板
      tabClick: '0'
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.systemInfo = app.globalData.systemInfo;
    common.osg.codeoption(() => {
      this.getActivityDef();
      this.$forceUpdate();
    });
    // console.log(this.options, '---options');
  },
  onShow() {},
  methods: {
    doOpen(path, data, options) {
      common.osg.open(path, data, options);
    },
    tabChange(e) {
      this.tabClick = e;
      // console.log(this.tabClick, '---this.tabClick');
      this.getActivityDef(e);
    },
    getActivityDef(e) {
      common.osg.ajax(
        'wmt/biz/activityDef/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:exts.activityDefType|string#and': '2',
          'is:exts.repairPartsOne|string#and': e == '0' ? '' : e
        },
        res => {
          this.activityDefData = res.data;
          console.log(this.activityDefData, 'this.activityDefData');
        }
      );
    },
    //反显字典表
    format(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (!val || val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 10px;
  background: #f8f8f8;
}

.tab {
  background: #fff;
  // display: flex;
  line-height: 24px;
  text-align: center;
  width: 100%;
  overflow-x: scroll;
  white-space: nowrap;
  // > view {
  //   display: inline-block;
  //   margin: 5px;
  //   height: 24px;
  //   width: 47px;
  //   border-radius: 4px;
  //   background: #f7f7f7;
  //   color: #000;
  //   font-size: 12px;
  //   font-weight: 400;
  // }
  .unDoTabClick {
    display: inline-block;
    margin: 5px;
    height: 24px;
    width: 47px;
    border-radius: 4px;
    background: #f7f7f7;
    color: #000;
    font-size: 12px;
    font-weight: 400;
  }
  .doTabClick {
    display: inline-block;
    margin: 5px;
    height: 24px;
    width: 47px;
    border-radius: 4px;
    color: #106cff;
    border: 1px solid #106cff;
    background: #fff;
    font-size: 12px;
    font-weight: 400;
  }
}
.pushBlock {
  margin: 15px;
  border-radius: 8px;
  background: #fff;
  .title {
    padding: 22px 0 0 17px;
    color: #000;
    font-size: 16px;
    font-weight: 400;
  }
  .icon {
    padding: 5px 0 0 17px;
    display: flex;
    justify-content: initial;
  }
  .iconTitle {
    padding-left: 15px;
    color: #696969;
    font-size: 12px;
    font-weight: 400;
  }
}
.good {
  justify-content: space-around;
  // padding: 5px;
  //   padding: 10px 0 10px 17px;
  margin-bottom: 20px;
  .textTitle {
    color: #6d6d6d;
    font-family: Inter;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding-right: 2px;
  }
  .textIcon {
    color: #f03a23;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .textNum {
    color: #f03a23;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .textNum2 {
    color: #f03a23;
    font-family: Inter;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
</style>
