<template>
  <view class="storeDetail">
    <image
      src="https://pub.fsgo365.cn/storeBanner.jpeg"
      mode="widthFix"
      style="width: 100vw; display: flex"
    ></image>
    <view class="info">
      <view class="left">
        <view class="name">
          <text>{{ storeData.name }}</text>
          <view class="gold">金牌商家</view>
        </view>
        <view>
          <van-rate
            :value="5"
            size="9"
            color="#F9DE55"
            void-icon="star"
            void-color="#eee"
            style="display: flex"
            gutter="1"
          />
          <text class="total">已服务578单</text>
        </view>
        <view>
          <van-icon name="location-o" size="10px" />
          <text class="address">
            {{
              areaList.city_list[storeData.area[1]] +
                areaList.county_list[storeData.area[2]] +
                storeData.address || ''
            }}
          </text>
        </view>
      </view>
      <view class="right" @click="open('./storeInfo', { partnerId: storeData._id })">
        门店信息
        <van-icon name="arrow" />
      </view>
    </view>
    <swiper
      v-if="activityDefs.length != 0"
      autoplay="true"
      :interval="4000"
      :duration="500"
      circular
      class="activityBanner"
    >
      <block v-for="(item, i) in activityDefs" :key="i">
        <swiper-item
          v-if="item.tplImageFileid.length > 0"
          @click="
            open('../activity/activity', {
              id: item._id,
              partnerId: partnerId,
              promoterId: promoterId
            })
          "
        >
          <image
            :src="item.tplImageFileid[0].url"
            style="width: 100vw; border-radius: 8px"
            mode="widthFix"
          ></image>
        </swiper-item>
      </block>
    </swiper>
    <view>
      <view class="title">修链房屋维修，专业打造好屋顶</view>
      <view class="desc">专业维修，优质服务</view>
      <view class="service">
        <view>
          <view
            style="margin-right: 6px"
            @click="open('../web/media', { title: '服务流程', fileName: 'fwlc.jpg' })"
          >
            <view class="service-title">
              <view>服务流程</view>
              <view class="service-en">Service process</view>
              <image
                src="https://pub.fsgo365.cn/service-icon1.png"
                mode="widthFix"
                style="width: 39px; height: 32.5px; display: flex"
              ></image>
            </view>
          </view>
          <view @click="open('../web/media', { title: '服务范围', fileName: 'fwfw.jpg' })">
            <view class="service-title">
              <view>服务范围</view>
              <view class="service-en">Service scope</view>
              <image
                src="https://pub.fsgo365.cn/service-icon2.png"
                mode="widthFix"
                style="width: 35px; height: 35px; display: flex"
              ></image>
            </view>
          </view>
        </view>
        <view style="margin-top: 6px">
          <view
            style="margin-right: 6px"
            @click="open('../web/media', { title: '服务优势', fileName: 'fwys.jpg' })"
          >
            <view class="service-title">
              <view>服务优势</view>
              <view class="service-en">Service advantages</view>
              <image
                src="https://pub.fsgo365.cn/service-icon3.png"
                mode="widthFix"
                style="width: 26px; height: 38px; display: flex"
              ></image>
            </view>
          </view>
          <view
            style="color: #673e00; background: linear-gradient(135deg, #ffdf32 0%, #fff2ab 100%)"
            @click="open('../web/media', { title: '服务报价', fileName: 'fwbj.jpg' })"
          >
            <view class="service-title">
              <view>服务报价</view>
              <view class="service-en">Service quotation</view>
              <image
                src="https://pub.fsgo365.cn/service-icon4.png"
                mode="widthFix"
                style="width: 40px; height: 49px; display: flex"
              ></image>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view>
      <view class="title">专业的服务，来自经验的积累</view>
      <view class="desc">服务案例，直观展现</view>
      <view class="cases scrollbar-hide">
        <!-- <view class="case">
          <view class="case-top">
            <image
              src="https://pub.fsgo365.cn/case1.png"
              mode="aspectFill"
              style="width: 140px; height: 140px; display: flex"
            ></image>
            <view class="case-play">
              <view>直播中/回放</view>
            </view>
            <view style="background: #106cff">
              <text>施工第5天</text>
              <view>进入直播间</view>
            </view>
          </view>
          <view class="case-info">
            <view class="case-title c-ellipsis2">日坛贸易大厦屋顶翻新</view>
            <view class="case-like">
              <van-icon name="play-circle-o" color="#B1B1B1" />
            </view>
          </view>
        </view> -->
        <view
          v-for="(item, i) in cases"
          :key="i"
          class="case"
          @click="
            open('../../subpackages/web/media', {
              title: item.title,
              fileName: item.fileName,
              fileType: item.fileType
            })
          "
        >
          <view class="case-top">
            <image
              :src="item.cover"
              mode="aspectFill"
              style="width: 140px; height: 140px; display: flex"
            ></image>
            <!-- <view :style="'background:' + item.color">
              <text>{{ item.duration }}完工</text>
              <view>点击查看</view>
            </view> -->
          </view>
          <view class="case-info">
            <view class="case-title c-ellipsis2">{{ item.title }}</view>
            <view class="case-like">
              <van-icon name="eye-o" color="#B1B1B1" />
              <text class="case-like-total">{{ item.like }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="cases">
        <view class="case">
          <image
            src="https://pub.fsgo365.cn/case1.png"
            mode="aspectFill"
            style="width: 139px; height: 141.818px; display: flex"
          ></image>
          <view>
            <view class="case-title">日坛贸易大厦屋顶翻新</view>
            <view class="case-like">
              <van-icon name="like-o" color="#B1B1B1" />
              <text class="case-like-total">800</text>
            </view>
          </view>
        </view>
        <view class="case">
          <image
            src="https://pub.fsgo365.cn/case2.png"
            mode="aspectFill"
            style="width: 139px; height: 141.818px; display: flex"
          ></image>
          <view>
            <view class="case-title">怡景园卫生间防水补漏</view>
            <view class="case-like">
              <van-icon name="like-o" color="#B1B1B1" />
              <text class="case-like-total">800</text>
            </view>
          </view>
        </view>
        <view class="case">
          <image
            src="https://pub.fsgo365.cn/case3.png"
            mode="aspectFill"
            style="width: 139px; height: 141.818px; display: flex"
          ></image>
          <view>
            <view class="case-title">华联小区窗户防水维修</view>
            <view class="case-like">
              <van-icon name="like-o" color="#B1B1B1" />
              <text class="case-like-total">800</text>
            </view>
          </view>
        </view>
      </view> -->
    </view>
    <view>
      <view class="title c-flex c-flex-between c-item-center">金牌管家，服务500+家庭</view>
      <view class="desc">
        <text>至真至诚，专业服务</text>
        <view @click="open('../housekeeper/housekeepers', { partnerOrgId: storeData.orgId })">
          <text>全部</text>
          <van-icon name="arrow" />
        </view>
      </view>
      <view class="housekeepers">
        <view
          class="housekeeper"
          v-for="(item, i) in housekeepers"
          :key="i"
          @click="open('../housekeeper/housekeeper', { id: item._id })"
        >
          <view class="housekeeper-top">
            <image
              src="https://pub.fsgo365.cn/housekeeper-avatar.png"
              style="width: 52px; height: 52px; border-radius: 50%"
            ></image>
            <view class="housekeeper-info">
              <view>{{ item.name }}</view>
              <view>金牌认证</view>
            </view>
          </view>
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
    <view>
      <view class="title">标准服务商品，透明报价</view>
      <view class="desc">可视化标准服务，可靠规范</view>
      <view class="products">
        <view
          v-for="(item, i) in wares"
          :key="i"
          class="product"
          @click="
            open('../good/good', {
              id: item._id,
              partnerId: params.partnerId,
              promoterId: promoterId
            })
          "
        >
          <image
            :src="(item.images[0] && item.images[0].url) || 'https://pub.fsgo365.cn/product1.png'"
            mode="aspectFill"
            style="width: 100%; display: flex"
            :style="'height:' + imageSize + 'px'"
          ></image>
          <view class="product-info">
            <view>
              <view class="product-title">{{ item.name }}</view>
              <view class="product-desc">{{ item.description || '' }}</view>
            </view>
            <view>
              <view class="product-area">{{ item.exts.applicableArea || '' }}</view>
              <view class="product-price">¥ {{ item.price }}</view>
            </view>
          </view>
        </view>
      </view>
      <view
        class="products-more"
        @click="
          open('../good/goods', {
            partnerId: params.partnerId,
            promoterId: promoterId
          })
        "
      >
        <view>查看更多服务商品</view>
        <van-icon name="arrow-down" size="20px" />
      </view>
    </view>
    <van-divider custom-style="margin:10px 20px" />
    <view>
      <view class="title">每一份评价，都是我们努力的方向</view>
      <view class="desc">用户评价，真实参考</view>
      <view class="comments">
        <view class="comment" v-for="(item, i) in comments" :key="i">
          <image
            src="https://pub.fsgo365.cn/littlesix.png"
            style="width: 52px; height: 52px; border-radius: 50%"
          ></image>
          <view class="comment-info">
            <view class="comment-info-top">
              <view>
                <text class="comment-name">{{ item.name }}</text>
                <van-rate
                  :value="5"
                  size="13"
                  color="#F9DE55"
                  void-icon="star"
                  void-color="#eee"
                  style="display: flex"
                />
              </view>
              <view v-if="true" class="comment-tag">已服务</view>
              <view v-else class="comment-tag comment-tag-gray">未服务</view>
            </view>
            <view class="comment-info-bottom c-ellipsis2">{{ item.comment }}</view>
          </view>
        </view>
      </view>
    </view>
    <van-goods-action>
      <van-goods-action-icon
        icon="chat-o"
        color="#000"
        text="消息"
        @click="open('../message/messages')"
      />
      <van-goods-action-icon
        icon="phone-o"
        color="#000"
        text="电话"
        @click="makeCall(storeData.phone)"
      />
      <van-goods-action-icon icon="service-o" color="#000" text="客服" @click="chatEntry" />
      <van-goods-action-button
        color="#F9DE55"
        text="预约上门"
        custom-class="c-goods-action-button"
        @click="declaration()"
      />
    </van-goods-action>

    <view class="vant-like-button primary" @click="declaration()">
      <text>立即预约</text>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
var areajs = require('../../common/area.js');
export default {
  data() {
    return {
      // 省市区
      areaList: Object.assign({}, areajs.default),
      params: {},
      promoterId: '',
      storeData: {},
      activityDefs: [],
      cases: [
        {
          title: '亦庄屋顶维修',
          duration: '3小时',
          color: '#106CFF',
          like: 658,
          cover: 'https://pub.fsgo365.cn/case1-cover.jpg',
          fileName: 'case1-content.jpg',
          fileType: 'image'
        },
        {
          title: '力鸿花园屋顶维修',
          duration: '3天',
          color: '#FF103B',
          like: 528,
          cover: 'https://pub.fsgo365.cn/case2-cover.jpg',
          fileName: 'case2-content.mov',
          fileType: 'video'
        },
        {
          title: '通嘉园屋顶维修',
          duration: '4小时',
          color: '#FFBC10',
          like: 319,
          cover: 'https://pub.fsgo365.cn/case3-cover.jpg',
          fileName: 'case3-content.mov',
          fileType: 'video'
        },
        {
          title: '滨江世纪花园屋顶维修',
          duration: '2天',
          color: '#106CFF',
          like: 389,
          cover: 'https://pub.fsgo365.cn/case4-cover.jpg',
          fileName: 'case4-content.mov',
          fileType: 'video'
        }
      ],
      housekeepers: [],
      wares: [],
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
            '刚修了屋顶，给师傅点赞，也给修链点赞，服务流程非常完善，很多个步骤，从合同到具体的施工都讲解的很细致，值得一提的是还有10年的质保期，很是令人放心。非常感谢！',
          images: [
            { url: 'https://pub.fsgo365.cn/commen6-1.jpeg' },
            { url: 'https://pub.fsgo365.cn/commen6-2.jpeg' }
          ]
        }
      ],
      imageSize: 156 // 商品图片宽高相等，根据屏幕宽度计算
    };
  },
  onLoad(params) {
    // 获取系统信息
    let systemInfo = app.globalData.systemInfo;
    // 计算商品照片宽高
    this.imageSize = (systemInfo.windowWidth - 60) / 2;

    if (params.q) {
      params.q = decodeURI(params.q);
      wx.hideHomeButton(); // 扫码进入不允许返回首页
      // 截取所有参数放到this.params
      var url = decodeURIComponent(params.q);
      if (url.indexOf('?') != -1) {
        let str = url.split('?')[1];
        if (str) {
          let arr = str.split('&');
          if (arr) {
            let obj = {};
            for (let item of arr) {
              obj[item.split('=')[0]] = item.split('=')[1];
            }
            this.params = obj;
          }
        }
      }
      // 扫店铺码进入
      if (this.params.partnerId) {
        if (
          this.params.partnerId == '3904066108544797157' ||
          this.params.partnerId == '7735960217998541408'
        ) {
          this.params.shareType = '2';
        } else {
          this.params.shareType = '1';
        }
        this.params.shareTypeId = this.params.partnerId;
      }
    } else {
      this.params = params;
    }
    common.osg.init(this, this.params, app);
    console.log('storeDetail-params', this.params);

    // 隐藏左上角回到首页按钮
    if (this.params.shareType == 1 || this.params.shareType == 2) {
      wx.hideHomeButton();
    }

    // 获取推广大使id
    this.promoterId =
      this.params.channelType == 'tg' && this.params.shareUserId ? this.params.shareUserId : '';

    // 静默登录
    common.osg.doLogin(
      {
        shareType: this.params.shareType,
        shareTypeId: this.params.shareTypeId,
        allotOrgId: this.params.allotOrgId,
        shareUserId: this.params.shareUserId,
        channelId: this.params.channelId
      },
      () => {
        this.getStore();
        this.getWares();
        this.getActivityDef();
      }
    );
  },
  // 设置转发内容
  onShareAppMessage() {
    return {
      title: this.storeData.name,
      path: `/subpackages/store/storeDetail?partnerId=${this.params.partnerId}`
    };
  },
  // 设置分享朋友圈内容
  onShareTimeline() {
    return {
      title: this.storeData.name,
      query: ''
    };
  },
  methods: {
    // 获取门店详情
    getStore() {
      if (!this.params.partnerId) this.params.partnerId = '7735960217998541408'; //没有扫码默认进入修链店铺
      common.osg.ajax('parnter/queryById/' + this.params.partnerId, {}, res => {
        res.entity.exts = res.entity.exts || {};
        this.storeData = res.entity;
        console.log(this.storeData, '---this.storeData');
        // 缓存门店电话，在从门店进入商品详情页时拨号联系门店
        wx.setStorageSync('contactNumber', res.entity.phone);
        this.getHousekeepers();
      });
    },
    // 获取活动
    getActivityDef() {
      common.osg.ajax('biz/activityDef/query', {}, res => {
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
    // 获取门店管家
    getHousekeepers() {
      // 获取管家列表
      common.osg.ajax(
        'parnter/queryhousekeeper',
        {
          orgId: this.storeData.orgId,
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
    // 查询C端服务商品
    getWares() {
      common.osg.ajax(
        '/wares/query',
        {
          page: 1,
          rows: 2,
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.wares = res.data;
        }
      );
    },
    open(path, data, options) {
      common.osg.open(path, data, options);
    },
    declaration() {
      wx.setStorageSync('declarationParams', {
        promoterId: this.promoterId || '',
        partnerId: this.params.partnerId,
        channelId: this.params.channelId || ''
      });
      wx.setStorageSync('declarationMethod', {
        declarationMethod: 'doSave'
      });

      this.open('/pages/declaration/declaration', {}, { mode: 'switchTab' });
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    // 发起聊天
    chatEntry() {
      common.osg.ajax('chatMessage/entry', {}, res => {
        common.osg.open('/subpackages/message/message', {
          relationId: res.data._id,
          sendUserName: '平台客服'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2b6ff6;
  height: 60px;
  margin: -60px 40px;
  color: #ffffff;
  border-radius: 15px 15px 0 0;
  position: absolute;
  width: calc(100vw - 80px);
  padding: 15px 15px 10px;
  box-sizing: border-box;
  .left {
    > view {
      line-height: 15px;
      display: flex;
      align-items: center;
    }
    .name {
      font-size: 12px;
      font-weight: 600;
      .gold {
        border-radius: 1000px;
        background: #f9de55;
        font-size: 7px;
        color: #000;
        margin-left: 9px;
        width: 44px;
        text-align: center;
        font-weight: 400;
        height: 12px;
        line-height: 12px;
        margin-bottom: 1px;
      }
    }
    .total {
      color: #f9de55;
      font-size: 9px;
      margin-left: 7px;
    }
    .address {
      font-size: 9px;
      margin-left: 5px;
    }
  }
  .right {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
  }
}
.activityBanner {
  display: flex;
  width: calc(100vw - 40px);
  margin: 20px;
  border-radius: 8px;
}
.title {
  font-size: 16px;
  font-weight: 800;
  margin: 35px 20px 6px;
}
.desc {
  font-size: 14px;
  color: #736e6e;
  margin: 0 0 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > view {
    margin-right: 20px;
  }
}
.service {
  width: calc(100vw - 40px);
  margin: 0 20px;
  display: flex;
  flex-wrap: wrap;
  > view {
    width: 100%;
    display: flex;
    > view {
      flex: 1;
      color: #fff;
      height: 114px;
      border-radius: 8px;
      background: linear-gradient(135deg, #3e88ff 0%, #8dbeff 100%);
      position: relative;
      .service-title {
        margin: 17px 0 0 17px;
        font-size: 16px;
        line-height: 16px;
        .service-en {
          font-size: 10px;
        }
      }
      image {
        position: absolute;
        right: 18px;
        bottom: 18px;
      }
    }
  }
}
.cases {
  margin-left: 20px;
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
  .case {
    width: 140px;
    min-width: 140px;
    height: 220px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 12px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
    .case-top {
      width: 140px;
      height: 140px;
      position: relative;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
      > view {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        > text {
          color: #fff;
          font-size: 12px;
          font-weight: 500;
        }
        > view {
          width: 56px;
          text-align: center;
          height: 15px;
          line-height: 15px;
          border-radius: 30px;
          background: #fff;
          font-size: 8px;
          font-weight: 500;
        }
      }
      .case-play {
        width: 100%;
        text-align: center;
        top: 17px;
        height: 22px;
        > view {
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          width: 88px;
          text-align: center;
          height: 22px;
          line-height: 22px;
          border-radius: 50px;
          background: #106cff;
        }
      }
    }
    .case-info {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .case-title {
        padding: 5px;
      }
      .case-like {
        margin-left: 5px;
        .case-like-total {
          color: #a8a8a8;
          margin-left: 5px;
        }
      }
    }
  }
}
// .cases {
//   margin-left: 20px;
//   display: flex;
//   overflow-x: auto;
//   padding-bottom: 10px;
//   .case {
//     width: 139px;
//     min-width: 139px;
//     height: 220px;
//     border-radius: 8px;
//     overflow: hidden;
//     margin-right: 12px;
//     background: #fff;
//     box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
//     .case-title {
//       padding: 5px;
//     }
//     .case-like {
//       margin-left: 5px;
//       .case-like-total {
//         color: #a8a8a8;
//         margin-left: 5px;
//       }
//     }
//   }
// }
.housekeepers {
  display: flex;
  margin: 20px;
  overflow-x: auto;
  .housekeeper {
    margin-right: 30px;
    .housekeeper-top {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      .housekeeper-info {
        margin-left: 5px;
        color: #393838;
        font-size: 14px;
      }
    }
  }
}
.products {
  padding: 0 10px;
  display: flex;
  flex-wrap: wrap;
  .product {
    margin: 10px;
    width: calc(50% - 20px);
    box-sizing: border-box;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 3px 5px 2px 0px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    .product-info {
      padding: 10px;
      color: #393838;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .product-title {
        font-size: 15px;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .product-desc {
        color: #d41e1e;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .product-area {
        font-size: 14px;
      }
      .product-price {
        font-size: 14px;
        font-weight: 600;
        margin-top: 10px;
      }
    }
  }
}
.products-more {
  text-align: center;
  color: #393838;
  font-size: 14px;
  margin-top: 10px;
}
.comments {
  // padding-bottom: 90px;
  padding-bottom: 17px;
  .comment {
    border-radius: 4px;
    background: #fff;
    box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.1);
    margin: 7px 20px;
    padding: 10px;
    display: flex;
    .comment-info {
      margin-left: 5px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .comment-info-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > view {
          display: flex;
          align-items: center;
          .comment-name {
            color: #393838;
            font-size: 14px;
            margin-right: 7px;
          }
        }
        .comment-tag {
          width: 44px;
          padding: 2px;
          flex-shrink: 0;
          border-radius: 1000px;
          background: #f9de55;
          color: #000;
          font-size: 8px;
          justify-content: center;
        }
        .comment-tag-gray {
          background: #d9d9d9;
        }
      }
      .comment-info-bottom {
        color: #736e6e;
        font-size: 12px;
      }
    }
  }
}
.van-goods-action {
  padding: 20px;
}
.storeDetail ::v-deep .van-goods-action {
  padding: 20px;
}
.storeDetail ::v-deep .c-goods-action-button {
  color: #000 !important;
}

/* 按钮基础样式 */
.vant-like-button {
  display: inline-block;
  box-sizing: border-box;
  height: 44px;
  padding: 0 15px;
  font-size: 16px;
  line-height: 42px;
  text-align: center;
  border-radius: 4px;
  transition: all 0.3s;
  border: 1px solid #ebedf0;
  background-color: #fff;
  color: #323233;
  width: calc(100vw - 40px);
  margin: 0px 20px;
  position: sticky;
  bottom: 10px;
  left: 0px;
}

/* 主要按钮样式 */
.vant-like-button.primary {
  background-color: #1989fa;
  border-color: #1989fa;
  color: #fff;
}

/* 主要按钮激活效果 */
.vant-like-button.primary:active {
  background-color: #096dd9;
  border-color: #096dd9;
}
</style>
