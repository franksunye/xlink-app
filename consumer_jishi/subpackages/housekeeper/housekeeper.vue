<template>
  <view>
    <view class="info">
      <view class="info-top">
        <image
          src="https://pub.fsgo365.cn/housekeeper-avatar.png"
          style="width: 52px; height: 52px; border-radius: 50%; margin-right: 5px"
        ></image>
        <view>
          <view>朱迪</view>
          <view style="display: flex; align-items: center">
            <text style="margin-right: 20px">从业7年</text>
            <van-rate
              :value="5"
              color="#F9DE55"
              void-icon="star"
              void-color="#eee"
              style="display: flex"
            />
          </view>
        </view>
      </view>
      <view class="info-bottom">
        <text style="font-size: 16px; font-weight: 500; margin-right: 16px">擅长类型</text>
        <text style="margin-right: 12px">屋顶翻新</text>
        <text>卫生间防水维修</text>
      </view>
    </view>
    <view class="gap"></view>
    <view class="comments">
      <view class="title">
        <van-icon name="records" color="#357ABB" size="16px" style="margin-right: 5px" />
        用户评价（56）
      </view>
      <view class="tags" style="margin: 20px 20px 6px">
        <view class="tag">服务好（34）</view>
        <view class="tag">师傅专业（46）</view>
        <view class="tag">准时（50）</view>
      </view>
      <view class="tags" style="margin: 0 20px 0px">
        <view class="tag">性价比高（40）</view>
        <view class="tag">响应快（54）</view>
        <view class="tag">价格透明（56）</view>
      </view>
      <view class="comment" v-for="(item, i) in comments" :key="i">
        <view>
          <image
            src="https://pub.fsgo365.cn/littlesix.png"
            style="width: 35px; height: 35px; border-radius: 50%; margin-right: 8px"
          />
        </view>
        <view>
          <view class="comment-top">
            <text class="name">{{ item.name }}</text>
            <text class="time">发表于{{ item.createTime }}</text>
          </view>
          <view class="comment-second">
            <text class="scoring">打分</text>
            <van-rate
              :value="5"
              color="#F9DE55"
              void-icon="star"
              void-color="#eee"
              style="display: flex"
            />
            <text class="price">¥ {{ item.amount }}</text>
          </view>
          <view class="comment-content">
            {{ item.comment }}
          </view>
          <view class="comment-images">
            <image
              v-for="(image, index) in item.images"
              :key="index"
              :src="image.url"
              mode="aspectFill"
              style="
                width: 80px;
                height: 80px;
                border-radius: 2px;
                margin: 8px 8px 0 0;
                display: flex;
              "
              @click="
                previewImage(
                  image.url,
                  item.images.map(img => img.url)
                )
              "
            ></image>
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
      comments: [
        {
          name: '王先生',
          createTime: '2023年8月2日',
          amount: '8600',
          comment: '产品查验了防伪码，国标材料，工人施工操作也很规范，值得信赖！',
          images: [
            { url: 'https://pub.fsgo365.cn/commen1-1.jpeg' },
            { url: 'https://pub.fsgo365.cn/commen1-2.jpeg' }
          ]
        },
        {
          name: '宁先生',
          createTime: '2023年7月28日',
          amount: '48088.5',
          comment: '下完单客服马上就打电话了，约了管家第二天就上门了，整个流程的体验很专业，推荐！',
          images: [
            { url: 'https://pub.fsgo365.cn/commen2-1.jpeg' },
            { url: 'https://pub.fsgo365.cn/commen2-2.jpeg' },
            { url: 'https://pub.fsgo365.cn/commen2-3.jpeg' }
          ]
        },
        {
          name: '夏女士',
          createTime: '2023年7月16日',
          amount: '27500',
          comment:
            '管家上门勘察后给了报价单，维修前也签订了盖公章的正规的维修合同，质保10年，非常放心！',
          images: [
            { url: 'https://pub.fsgo365.cn/commen3-1.jpeg' },
            { url: 'https://pub.fsgo365.cn/commen3-2.jpeg' }
          ]
        },
        {
          name: '沈先生',
          createTime: '2023年7月10日',
          amount: '22000',
          comment: '一口价没有单独的恶意增项，消费很透明，主要是签订合同让人放心',
          images: [
            { url: 'https://pub.fsgo365.cn/commen4-1.jpeg' },
            { url: 'https://pub.fsgo365.cn/commen4-2.jpeg' }
          ]
        },
        {
          name: '马女士',
          createTime: '2023年7月5日',
          amount: '12900',
          comment:
            '下了几场雨，外墙漏水，预约了管家来上门勘察，很专业，修好了又下了两场雨，没再渗漏了，点赞！',
          images: [
            { url: 'https://pub.fsgo365.cn/commen5-1.jpeg' },
            { url: 'https://pub.fsgo365.cn/commen5-2.jpeg' }
          ]
        },
        {
          name: '唐先生',
          createTime: '2023年6月28日',
          amount: '5003.8',
          comment:
            '刚修了屋顶，给师傅点赞，也给吉柿修复点赞，服务流程非常完善，很多个步骤，从合同到具体的施工都讲解的很细致，值得一提的是还有10年的质保期，很是令人放心。非常感谢！',
          images: [
            { url: 'https://pub.fsgo365.cn/commen6-1.jpeg' },
            { url: 'https://pub.fsgo365.cn/commen6-2.jpeg' }
          ]
        }
      ]
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.id = params.id;
    this.getHousekeepers();
  },
  methods: {
    getHousekeepers() {
      common.osg.ajax(
        'parnter/queryhousekeeper',
        {
          _id: this.id,
          resourceType: 'technician',
          'in:resourceRoles|array#and': '1', //只查管家
          'ne:workType|integer#and': '-1', // 不展示离线管家
          'is:state|integer#and': 1,
          sortField: 'workType',
          sortOrder: 'desc'
        },
        res => {
          // 解析照片
          res.data.map(item => {
            item.users = item.users || {};
            if (item.users.profileImg && common.osg.isJson(item.users.profileImg)) {
              item.users.profileImg = JSON.parse(item.users.profileImg);
            } else {
              item.users.profileImg = [];
            }
          });
          this.housekeepers = res.data;
        }
      );
    },
    previewImage(url, urls) {
      wx.previewImage({
        current: url,
        urls: urls
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  margin: 25px 25px 0;
  .info-top {
    display: flex;
    align-items: center;
    color: #393838;
    font-size: 14px;
    border-bottom: 1px solid #d9d9d9;
    padding: 10px 20px;
  }
  .info-bottom {
    color: #454444;
    font-size: 12px;
    padding: 15px 20px;
  }
}
.gap {
  width: 100vw;
  height: 8px;
  background: #efefef;
}
.tags {
  display: flex;
  justify-content: space-evenly;
  .tag {
    flex: 1;
    padding: 5px;
    border-radius: 2px;
    background: #f9de55;
    color: #000;
    text-align: center;
    font-size: 10px;
    margin-right: 8px;
  }
}
.comments {
  padding: 20px 20px 30px;
  .title {
    color: #000;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
  }
  .comment {
    display: flex;
    padding: 15px;
    border-bottom: 1px solid #d9d9d9;
    .comment-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 22px;
      .name {
        color: #393838;
        font-size: 14px;
      }
      .time {
        color: #8f8f8f;
        font-size: 10px;
      }
    }
    .comment-second {
      display: flex;
      align-items: center;
      color: #454444;
      font-size: 12px;
      line-height: 22px;
      .scoring {
        margin-right: 7px;
      }
      .price {
        margin-left: 11px;
      }
    }
    .comment-content {
      color: #000;
      font-size: 12px;
      line-height: 22px;
    }
    .comment-images {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
