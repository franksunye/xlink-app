<template>
  <view class="rankingList">
    <image
      class="banner"
      src="https://pub.fsgo365.cn/rankingList_banner.png"
      mode="widthFix"
    ></image>
    <view
      style="
        color: #fff;
        font-size: 20px;
        font-weight: 600;
        margin-top: -18vw;
        margin-left: 8vw;
        margin-bottom: 10px;
      "
    >
      2024年12月
    </view>
    <view class="content">
      <view class="index">
        <van-tabs
          :active="index"
          line-width="20px"
          line-height="4px"
          :ellipsis="false"
          color="#0287fb"
          title-active-color="#0287fb"
          title-inactive-color="#646566"
        >
          <van-tab title="产值信息比" name="1"></van-tab>
          <van-tab title="时效" name="2"></van-tab>
          <van-tab title="态度" name="3"></van-tab>
          <van-tab title="评价" name="4"></van-tab>
          <van-tab title="售后" name="5"></van-tab>
        </van-tabs>
      </view>
      <view class="row head">
        <text class="ranking">排名</text>
        <text class="name">姓名</text>
        <text class="score">得分</text>
      </view>
      <view class="list">
        <view class="row" v-for="(item, i) in data" :key="i">
          <view class="ranking">
            <image
              v-if="i == 0 || i == 1 || i == 2"
              :src="`https://pub.fsgo365.cn/icon-ranking${i + 1}.png`"
              mode="widthFix"
              style="width: 30px; height: 30px"
            ></image>
            <text v-else>{{ i + 1 }}</text>
          </view>
          <view class="name">
            <image
              :src="item.url || 'https://pub.fsgo365.cn/headportrait.png'"
              mode="widthFix"
              style="width: 40px; height: 40px"
              :class="'avatar avatar-border' + (i + 1)"
            ></image>
            <text class="c-m-l-30">{{ item.name }}</text>
          </view>
          <text class="score">{{ item.score }}</text>
        </view>
      </view>
      <view class="my row">
        <view class="ranking">
          <text>16</text>
        </view>
        <view class="name">
          <image
            src="https://pub.fsgo365.cn/user/dongcan.jpg"
            mode="widthFix"
            style="width: 40px; height: 40px"
            :class="'avatar avatar-border' + (i + 1)"
          ></image>
          <view class="c-m-l-30 c-flex c-flex-col">
            <text>董灿</text>
            <text style="font-size: 12px; font-weight: normal; color: #969799 !important">
              点击查看
              <text class="c-blue" style="margin-left: 3px">提升建议</text>
            </text>
          </view>
        </view>
        <text class="score">75.5</text>
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
      activeIndex: '1',
      data: [
        {
          name: '李卓',
          score: '100',
          url: 'https://pub.fsgo365.cn/user/lizhuo.jpg'
        },
        {
          name: '余金凤',
          score: '98.02',
          url: 'https://pub.fsgo365.cn/user/yujinfeng.jpg'
        },
        {
          name: '吕世军',
          score: '97.6',
          url: 'https://pub.fsgo365.cn/user/lvshijun.jpg'
        },
        {
          name: '文刘飞',
          score: '96.34',
          url: 'https://pub.fsgo365.cn/user/wenliufei.jpg'
        },
        {
          name: '张丁山',
          score: '92.94',
          url: 'https://pub.fsgo365.cn/user/zhangdingshan.jpg'
        },
        {
          name: '胡林波',
          score: '92.38',
          url: 'https://pub.fsgo365.cn/user/hulinbo.jpg'
        },
        {
          name: '王宁',
          score: '92',
          url: 'https://pub.fsgo365.cn/user/wangning.jpg'
        },
        {
          name: '赵芳德',
          score: '92',
          url: 'https://pub.fsgo365.cn/user/zhaofangde.jpg'
        },
        {
          name: '刘振海',
          score: '85.24',
          url: 'https://pub.fsgo365.cn/user/liuzhenhai.jpg'
        },
        {
          name: '韩飞飞',
          score: '85.06',
          url: 'https://pub.fsgo365.cn/user/hanfeifei.jpg'
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.rankingList {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .banner {
    width: 100vw;
  }
  .content {
    flex: 1;
    background-color: #fff;
    border-radius: 25px 25px 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .index {
      padding: 5px 5px 10px;
      border-bottom: 1px solid #ebedf0;
      // ::v-deep .van-tabs__nav {
      //   background: #f9fcfa;
      // }
      .van-tab {
        font-size: 18px !important;
      }
    }
    .row {
      display: flex;
      line-height: 50px;
    }
    .head {
      padding: 0 30px;
      color: #969799 !important;
    }
    .list {
      background-color: #fff;
      color: #323233;
      flex: 1;
      overflow-y: auto;
      padding: 0 30px;
      font-weight: 600;
    }
    .ranking {
      width: 40px;
      margin-right: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #969799;
    }
    .name {
      text-align: left;
      flex: 1;
      display: flex;
      align-items: center;
      .avatar {
        border: 1px solid #ebedf0;
        border-radius: 50%;
      }
      .avatar-border1 {
        border-color: #ffcd20;
      }
      .avatar-border2 {
        border-color: #dddfe9;
      }
      .avatar-border3 {
        border-color: #fbb46c;
      }
    }
    .score {
      text-align: right;
    }
  }
  .my {
    align-items: center;
    line-height: normal !important;
    height: 70px;
    background: #f7f8fa;
    padding: 0 30px;
    border-top: 1px solid #ebedf0;
    font-weight: 600;
  }
}
</style>
