<template>
  <view class="good">
    <swiper
      v-if="data.images.length > 0"
      :autoplay="false"
      :interval="4000"
      :duration="500"
      :style="'height:' + systemInfo.windowWidth + 'px'"
      circular
      indicator-dots
      indicator-active-color="#fff"
    >
      <swiper-item v-for="(item, i) in data.images" :key="i">
        <video
          v-if="['mp4', 'MP4'].indexOf(item.name.split('.')[1]) != -1"
          class="c-video"
          id="video"
          :src="item.url"
          show-center-play-btn
          :autoplay="false"
          :controls="true"
          bindplay="play"
          bindpause="pause"
          bindended="ended"
          :style="'height:' + systemInfo.windowWidth + 'px'"
        ></video>
        <image
          v-else
          :src="getImgUrl(item.url)"
          style="width: 100vw; display: flex; margin: 0 auto"
          :style="'height:' + systemInfo.windowWidth + 'px'"
          mode="aspectFill"
        />
      </swiper-item>
    </swiper>

    <view class="activity" v-if="activityType == '1'">
      <view class="activity-left">
        <text class="text">秒杀价 ¥</text>
        <text class="price">{{ data.exts.activityPrice || 0 }}</text>
      </view>
      <view class="activity-right">
        <text class="text-top">修链限时秒杀</text>
        <view class="text-bottom c-item-center">
          <uni-icons type="fire-filled" color="#f9de55"></uni-icons>
          <text>即将结束</text>
        </view>
      </view>
    </view>
    <view class="activity" v-if="activityType == '2'">
      <view class="activity-left">
        <text class="text">拼团价 ¥</text>
        <text class="price">
          {{ data.exts.activityPrice || 0 }}
        </text>
      </view>
      <view class="activity-right">
        <view class="group">
          <image
            v-for="(item, i) in 5"
            :key="i"
            src="../../static/images/avatar-icon.png"
            class="group-image"
            :style="'left:' + 10 * i + 'px'"
          />
          <view class="group-text">正在拼</view>
        </view>
      </view>
    </view>
    <view class="info">
      <view style="display: flex; align-items: center">
        <text
          v-if="data.unit"
          class="price"
          :style="activityType ? 'text-decoration:line-through' : ''"
        >
          ¥ {{ data.price || 0 }}/{{ codelabel('UNIT', data.unit) }}
        </text>
        <text v-else class="price" :style="activityType ? 'text-decoration:line-through' : ''">
          ¥ {{ data.price || 0 }}
        </text>
        <view class="button">免费上门检测</view>
      </view>
      <view class="title">{{ data.name }}</view>
      <view class="tool">
        <view>
          <uni-icons type="location-filled"></uni-icons>
          <text>北京</text>
        </view>
        <view>
          <uni-icons type="cart-filled"></uni-icons>
          <text>30 已售出</text>
        </view>
        <view>
          <uni-icons type="star-filled" color="#FACC15"></uni-icons>
          <text>5.0</text>
        </view>
      </view>
      <view class="info-contain">
        <view v-if="data.exts.contain" class="info-contain-in">
          <view style="margin-right: 10px; width: 30%">包含项</view>
          <view class="info-contain-in-block">
            <view v-for="(itemIn, i) in data.exts.contain" :key="i">
              <image src="../../static/images/contain.png" style="width: 10px; height: 10px" />
              {{ itemIn }}
            </view>
          </view>
        </view>
        <view v-if="data.exts.unContain" class="info-contain-un">
          <view style="margin-right: 10px; width: 30%">不包含</view>
          <view class="info-contain-in-block">
            <view v-for="(itemUn, i) in data.exts.unContain" :key="i">
              <image src="../../static/images/unContain.png" style="width: 10px; height: 10px" />
              {{ itemUn }}
            </view>
          </view>
        </view>
      </view>
      <view class="guarantee">
        <text style="color: #000; font-size: 16px">服务保障</text>
        <text>极速响应</text>
        <text>绿色环保</text>
        <text>免费上门</text>
      </view>
      <!-- <view
        class="location c-item-center"
        @click="open('../address/addresses', { selectedAddressId: address._id })"
      >
        <view>
          <view class="address">
            <uni-icons type="location-filled" color="#D60F16"></uni-icons>
            <text class="text">
              地址：
              <text v-if="address._id">
                {{
                  address.area
                    ? areaList.province_list[address.area[0]] +
                      areaList.city_list[address.area[1]] +
                      areaList.county_list[address.area[2]]
                    : ''
                }}{{ address.subdistrictName }}{{ address.address }}
              </text>
            </text>
          </view>
          <view class="remind" v-if="!address._id">
            <text style="color: #f00">*</text>
            <text class="text">请补全或修改上门服务地址信息</text>
          </view>
        </view>
        <uni-icons type="right" color="#4B4B4B"></uni-icons>
      </view> -->
    </view>
    <view class="content">
      <view>
        <view class="c-uni-tabs">
          <view
            class="c-uni-tab"
            :class="activeTab == 'section1' ? 'c-uni-tab-active' : ''"
            @click="pageScrollTo('section1')"
          >
            常见问题
            <view
              v-if="activeTab == 'section1'"
              class="c-uni-tabs-line"
              style="background-color: #ffd700"
            ></view>
          </view>
          <view
            class="c-uni-tab"
            :class="activeTab == 'section2' ? 'c-uni-tab-active' : ''"
            @click="pageScrollTo('section2')"
          >
            用户评价
            <view
              v-if="activeTab == 'section2'"
              class="c-uni-tabs-line"
              style="background-color: #ffd700"
            ></view>
          </view>
          <view
            class="c-uni-tab"
            :class="activeTab == 'section3' ? 'c-uni-tab-active' : ''"
            @click="pageScrollTo('section3')"
          >
            服务内容
            <view
              v-if="activeTab == 'section3'"
              class="c-uni-tabs-line"
              style="background-color: #ffd700"
            ></view>
          </view>
        </view>
        <view class="questions" id="section1">
          <view class="c-flex c-flex-items-center c-flex-between questions-top">
            <view class="c-flex c-flex-items-center">
              <uni-icons type="help"></uni-icons>
              <text style="margin-left: 5px">常见问题</text>
            </view>
            <view
              class="c-flex c-flex-items-center"
              @click="
                open('../web/media', {
                  title: '常见问题',
                  fileName: 'changjianwenti.png'
                })
              "
            >
              <text style="color: #8f8f8f; margin-right: 5px">全部</text>
              <uni-icons type="right" color="#736E6E"></uni-icons>
            </view>
          </view>
          <view class="question">
            <view class="q">
              <view class="icon">
                <image
                  src="../../static/images/q.png"
                  style="width: 18px; height: 18px; display: flex"
                />
                <text>问</text>
              </view>
              <text>服务流程有哪些标准步骤？</text>
            </view>
            <view class="a">
              <view class="icon">
                <image
                  src="../../static/images/a.png"
                  style="width: 18px; height: 18px; display: flex"
                />
                <text>答</text>
              </view>
              <text>需求确认-上门勘察-出具方案-签订合同-进场施工-完工验收-质保生效-定期巡检；</text>
            </view>
          </view>
          <view class="question">
            <view class="q">
              <view class="icon">
                <image
                  src="../../static/images/q.png"
                  style="width: 18px; height: 18px; display: flex"
                />
                <text>问</text>
              </view>
              <text>预约后多久可以上门？</text>
            </view>
            <view class="a">
              <view class="icon">
                <image
                  src="../../static/images/a.png"
                  style="width: 18px; height: 18px; display: flex"
                />
                <text>答</text>
              </view>
              <text>
                预约后2小时内会有客服与您取得联系，确认需要上门后管家会在12小时内联系您确认上门时间；
              </text>
            </view>
          </view>
          <view class="question">
            <view class="q">
              <view class="icon">
                <image
                  src="../../static/images/q.png"
                  style="width: 18px; height: 18px; display: flex"
                />
                <text>问</text>
              </view>
              <text>服务范围有哪些？</text>
            </view>
            <view class="a">
              <view class="icon">
                <image
                  src="../../static/images/a.png"
                  style="width: 18px; height: 18px; display: flex"
                />
                <text>答</text>
              </view>
              <text>
                北京区域内屋顶、窗户、卫生间、外墙、地下室等部位发生渗漏水问题都可以预约上门勘察/维修；
              </text>
            </view>
          </view>
        </view>
        <view class="comments" id="section2">
          <view class="c-flex c-flex-items-center c-flex-between" style="font-size: 14px">
            <view class="c-flex c-flex-items-center">
              <uni-icons type="chat"></uni-icons>
              <text style="margin-left: 5px">用户评价</text>
            </view>
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
          <view :style="'transition:height 2s;overflow:hidden;height:' + commentsHeight">
            <view class="comment" v-for="(item, i) in comments" :key="i">
              <view>
                <image
                  src="https://pub.fsgo365.cn/littlesix.png?imageView2/2/w/100/format/webp/q/75"
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
                  <uni-rate readonly :value="5" color="#eee" size="18" active-color="#F9DE55" />
                  <text class="price">¥ {{ item.amount }}</text>
                </view>
                <view class="comment-content">
                  {{ item.comment }}
                </view>
                <view class="comment-images">
                  <image
                    v-for="(image, index) in item.images"
                    :key="index"
                    :src="getImgUrl(image.url, 'thumbnail')"
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
          <view v-if="commentsHeight == '0px'" class="c-flex c-flex-center">
            <view class="more" @click="commentsHeight = '1400px'">
              <uni-icons type="down" color="#8f8f8f"></uni-icons>
              <text class="c-m-l-20">展开评价</text>
            </view>
          </view>
          <view v-else class="c-flex c-flex-center">
            <view class="more" @click="commentsHeight = '0px'">
              <uni-icons type="up" color="#8f8f8f"></uni-icons>
              <text class="c-m-l-20">收起评价</text>
            </view>
          </view>
        </view>
      </view>
      <view
        id="section3"
        style="margin-top: 10px"
        v-if="data.exts.imagesDetail && data.exts.imagesDetail.length > 0"
      >
        <image
          v-for="(item, i) in data.exts.imagesDetail"
          :key="i"
          :src="getImgUrl(item.url)"
          style="width: 100%; display: flex"
          mode="widthFix"
        />
      </view>
    </view>
    <view class="services" style="padding: 25px" v-if="caseLibrary.length > 0">
      <view class="c-flex c-flex-items-center c-flex-between">
        <text style="font-size: 16px; font-weight: 700">精选服务案例</text>
      </view>
      <view
        class="c-m-t-20"
        style="padding-top: 10px"
        :style="i == 0 ? 'margin-top:0' : 'border-top: 1px solid #d9d9d9'"
        v-for="(item, i) in caseLibrary"
        :key="i"
      >
        <view>
          <text>{{ codelabel('parts', item.repairParts, 'cascade') }}</text>
          <text class="c-m-l-20">{{ item.maintainAreaNum }}㎡</text>
        </view>
        <view>{{ item.content }}</view>
        <view class="c-flex c-item-center c-flex-wrap">
          <image
            v-for="(img, i) in item.images"
            :key="i"
            :src="getImgUrl(img.url, 'thumbnail') || 'https://pub.fsgo365.cn/case2.png?imageView2/2/w/200/format/webp/q/75'"
            @click="
              previewImage(
                img.url,
                item.images.map(obj => obj.url)
              )
            "
            mode="aspectFill"
            style="
              width: 70px;
              height: 70px;
              border-radius: 8px;
              margin: 10px 10px 0 0;
              display: flex;
            "
          ></image>
          <video
            v-for="(video, i) in item.videos"
            :key="i"
            class="c-video"
            id="video"
            :src="video.url"
            show-center-play-btn
            :autoplay="false"
            :controls="true"
            bindplay="play"
            bindpause="pause"
            bindended="ended"
            style="
              width: 70px;
              height: 70px;
              border-radius: 8px;
              margin: 10px 10px 0 0;
              display: flex;
            "
          ></video>
        </view>
      </view>
    </view>
    <view style="width: 100vw; height: 8px; background: #efefef"></view>
    <view class="services">
      <view class="c-flex c-flex-items-center c-flex-between c-m-b-20">
        <text style="font-size: 16px; font-weight: 700">精选服务推荐</text>
        <view
          class="c-flex c-flex-items-center"
          @click="open('../good/goods', { partnerId: partnerId, promoterId: promoterId })"
        >
          <text style="font-size: 14px; color: #8f8f8f; margin-right: 5px">全部</text>
          <uni-icons type="right" color="#8f8f8f"></uni-icons>
        </view>
      </view>
      <uni-rate readonly :value="5" color="#eee" size="15" active-color="#F9DE55" />
      <view class="c-flex c-flex-wrap">
        <image
          v-for="(item, i) in wares"
          :key="i"
          :src="getImgUrl((item.images[0] && item.images[0].url), 'thumbnail') || 'https://pub.fsgo365.cn/case2.png?imageView2/2/w/200/format/webp/q/75'"
          mode="aspectFill"
          style="
            width: 70px;
            height: 70px;
            border-radius: 8px;
            margin: 10px 10px 0 0;
            display: flex;
          "
          @click="
            open('../good/good', { id: item._id, partnerId: partnerId, promoterId: promoterId })
          "
        ></image>
      </view>
    </view>
    <view class="c-uni-goods-nav">
      <uni-goods-nav
        :fill="true"
        :options="[
          { icon: 'chat', text: '消息' },
          { icon: 'phone', text: '电话' },
          { icon: 'headphones', text: '客服' }
        ]"
        :button-group="[
          {
            text: activityType == '1' ? '预约上门' : activityType == '2' ? '即刻拼团' : '预约上门',
            backgroundColor: '#F9DE55',
            color: '#323233'
          }
        ]"
        @click="goodsClick"
        @buttonClick="declaration"
      />
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
      id: '',
      systemInfo: {
        menuButtonObject: {}
      },
      activityType: '',
      promoterId: '',
      partnerId: '',
      data: { images: [], exts: { imagesDetail: [] } },
      areaList: Object.assign({}, areajs.default),
      address: {},
      contactNumber: '',
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
      wares: [],
      loadType: '',
      caseLibrary: [],
      options: {
        cascadeCode_parts: { codeId: 'parts' },
        cascadeCode_UNIT: { codeId: 'UNIT' }
      },
      commentsHeight: '0px', // 评论区域高度
      activeTab: 'section1'
    };
  },
  onLoad(params) {
    // 获取系统信息
    this.systemInfo = app.globalData.systemInfo;
    this.loadType = 'onLoad';

    // 扫二维码进入
    if (params.q) {
      // 解析链接携带参数
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
            params = obj;
          }
        }
      }
      this.params = params;
    } else {
      this.params = params;
    }
    common.osg.init(this, this.params, app);
    console.log('good-params', params);

    // 静默登录
    common.osg.doLogin(
      {
        shareType: this.params.shareType || '1', //运营商
        shareTypeId: this.params.shareTypeId || this.params.partnerId, //运营商id
        shareUserId: this.params.shareUserId || '',
        channelId: this.params.channelId || '', //运营商报单码渠道
        allotOrgId: this.params.allotOrgId
      },
      () => {
        if (this.params.id) {
          this.id = this.params.id;
          this.getData();
        } else if (this.params.activityType) {
          this.activityType = this.params.activityType;
          this.getActivityData();
        }
        this.getWares();
        // 推广大使id
        this.promoterId = this.params.promoterId || '';
        // 如果是从门店详情页进入
        this.partnerId = this.params.partnerId || '';
        this.contactNumber = wx.getStorageSync('contactNumber');

        // 获取地址
        let address = wx.getStorageSync('address');
        if (address) {
          this.address = address;
          wx.removeStorageSync('address');
        } else {
          this.getAddress();
        }
      }
    );
    common.osg.codeoption(() => {});
  },
  // 设置转发内容
  onShareAppMessage() {
    return {
      title: this.data.name,
      path: `/subpackages/good/good?id=${this.params.id || ''}&activityType=${
        this.params.activityType || ''
      }`
    };
  },
  // 设置分享朋友圈内容
  onShareTimeline() {
    return {
      title: this.data.name,
      query: ''
    };
  },
  onShow() {
    // 避免重复执行
    if (this.loadType == 'onLoad') {
      this.loadType = '';
      return;
    }
    let address = wx.getStorageSync('address');
    if (address) {
      this.address = address;
      wx.removeStorageSync('address');
    } else {
      this.getAddress();
    }
  },
  methods: {
    open(path, data, options) {
      common.osg.open(path, data, options);
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    goodsClick(e) {
      console.log('goodsClick', e);
      if (e.index == 0) {
        this.open('../message/messages');
      } else if (e.index == 1) {
        this.makeCall(this.contactNumber);
      } else if (e.index == 2) {
        this.chatEntry();
      }
    },
    declaration() {
      wx.setStorageSync('declarationParams', {
        waresId: this.id,
        promoterId: this.promoterId,
        partnerId: this.partnerId
      });
      common.osg.open('../../pages/declaration/declaration', {}, { mode: 'switchTab' });
    },
    getData() {
      common.osg.ajax('/wares/findById.do', { id: this.id }, res => {
        this.data = res.data;
        common.osg.md({ act: '查看商品', name: res.data.name });
        if (res.data.typeId) {
          common.osg.codeoption(() => {
            this.getCaseLibrary();
          });
        }
      });
    },
    getActivityData() {
      common.osg.ajax(
        '/wares/query.do',
        { 'in:exts.activityType|array#and': this.activityType },
        res => {
          this.data = res.data[0] || {};
        }
      );
    },
    getAddress() {
      common.osg.ajax(
        'basic/address/query',
        {
          _all: '1',
          userId: wx.getStorageSync('user')._id,
          'is:state|integer#and': 1,
          sortField: 'isDefault',
          sortOrder: 'desc'
        },
        res => {
          this.address = res.data[0] || {};
        }
      );
    },
    previewImage(url, urls) {
      wx.previewImage({
        current: url,
        urls: urls
      });
    },
    pageScrollTo(activeTab) {
      this.activeTab = activeTab;
      common.osg.pageScrollTo(activeTab);
    },
    // 查询C端服务商品
    getWares() {
      common.osg.ajax(
        '/wares/query',
        {
          page: 1,
          rows: 4,
          'in:state|integer#and': 1,
          'ne:_id|string#and': this.id,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.wares = res.data;
        }
      );
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
    },
    getCaseLibrary() {
      common.osg.ajax(
        '/basic/caseLibrary/query',
        {
          'in:procedures|array#or': this.data.typeId,
          'in:materials|array#or': this.data.typeId,
          'in:measures|array#or': this.data.typeId,
          'in:projPackages|array#or': this.data.typeId,
          'is:state|integer#and': 1
        },
        res => {
          this.caseLibrary = res.data;
        }
      );
    },

    // 图片优化代理方法
    getImgUrl(url, opt) {
        return common.osg.getImgUrl(url, opt);
    }
  }
};
</script>

<style lang="scss" scoped>
.good {
  .c-video {
    width: 100vw;
    height: 100%;
  }
  .c-uni-tab-active {
    color: #d60f16;
  }
}
.activity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #f75429 0%, #eb2b1e 100%);
  color: #fff;
  padding: 10px 15px 10px 25px;
  .activity-left {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    .text {
      margin-right: 7px;
    }
    .price {
      font-size: 28px;
      font-style: normal;
      font-weight: 500;
    }
  }
  .activity-right {
    .text-top {
      font-size: 14px;
      font-weight: 600;
    }
    .text-bottom {
      font-size: 12px;
      display: flex;
      justify-content: flex-end;
      > text {
        margin-left: 5px;
      }
    }
    .group {
      width: 120px;
      height: 25px;
      position: relative;
      border-radius: 50px;
      background: rgba(255, 255, 255, 0.3);
      .group-image {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 1px solid #fff;
        display: flex;
        position: absolute;
        box-sizing: border-box;
      }
      .group-text {
        margin-left: 70px;
        font-size: 12px;
        line-height: 25px;
      }
    }
  }
}
.c-flex {
  display: flex;
}
.c-flex-items-center {
  align-items: center;
}
.c-flex-between {
  justify-content: space-between;
}
.c-flex-wrap {
  flex-wrap: wrap;
}
.info {
  padding: 25px;
  .price {
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
  }
  .button {
    margin-left: 20px;
    padding: 3px 10px;
    background: #d60f16;
    color: #fff;
    border-radius: 50px;
    font-size: 12px;
    line-height: 20px;
  }
  .title {
    font-size: 32px;
    margin-top: 15px;
  }
  .tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 0;
    border-bottom: 1px solid #e3e7ec;
    > view {
      display: flex;
      align-items: center;
      > text {
        margin-left: 8px;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
  .guarantee {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 13px 0 0;
    color: #736e6e;
    font-size: 12px;
    line-height: 22px;
  }
  .location {
    display: flex;
    justify-content: space-between;
    // border-bottom: 1px solid #e3e7ec;
    // padding-bottom: 15px;
    // margin-bottom: 15px;
    .address {
      display: flex;
      align-items: center;
      .text {
        font-size: 14px;
        margin-left: 5px;
      }
    }
    .remind {
      display: flex;
      align-items: center;
      margin-left: 20px;
      .text {
        color: #736e6e;
        font-size: 12px;
      }
    }
  }
  .datetime {
    display: flex;
    justify-content: space-between;
    > view {
      > view {
        .text {
          font-size: 14px;
          margin-left: 5px;
        }
      }
    }
  }
  .info-contain {
    font-size: 12px;
    margin-top: 10px;
    border-bottom: 1px solid #e3e7ec;
    padding-bottom: 10px;

    .info-contain-in {
      display: flex;
      margin-bottom: 10px;
    }
    .info-contain-un {
      display: flex;
    }
    .info-contain-in-block {
      display: grid;
      grid-template-columns: repeat(3, 30%);
      grid-column-gap: 15px;
      grid-row-gap: 10px;
      color: #736e6e;
      width: 100vh;
    }
  }
}
.content {
  padding: 8px;
  background: #efefef;
  > view {
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
    .questions {
      padding: 20px 20px 0;
      .questions-top {
        font-size: 14px;
      }
      .question {
        margin-top: 15px;
        .q {
          display: flex;
          align-items: flex-start;
          > text {
            color: #000;
            font-size: 12px;
            line-height: 22px;
            margin-left: 10px;
          }
        }
        .a {
          display: flex;
          align-items: flex-start;
          margin-top: 6px;
          > text {
            font-size: 10px;
            font-style: normal;
            line-height: 15px;
            margin-left: 10px;
          }
        }
        .icon {
          width: 18px;
          height: 18px;
          position: relative;
          margin-top: 3px;
          > text {
            color: #fff;
            font-size: 10px;
            font-weight: 600;
            position: absolute;
            top: 0px;
            left: 4px;
            z-index: 1;
          }
        }
      }
    }
    .comments {
      padding: 20px 20px 0;
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
      .title {
        color: #000;
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
      }
      .comment {
        display: flex;
        padding: 15px 10px;
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
      .comment:last-child {
        border-bottom: none;
      }
    }
  }
}
.services {
  padding: 25px 25px 100px;
}
.good ::v-deep .van-goods-action {
  z-index: 1;
  padding: 20px;
}
.good ::v-deep .c-goods-action-button-red {
  color: #fff !important;
  background: linear-gradient(90deg, #f75429 0%, #eb2b1e 100%) !important;
}
.good ::v-deep .c-goods-action-button {
  color: #000 !important;
}
.more {
  display: flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 14px;
  color: #8f8f8f;
  background: #efefef;
  margin: 15px;
}
</style>
