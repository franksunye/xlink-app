<template>
  <view class="index">
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
    <swiper
      v-if="notice.data.length > 0"
      autoplay="true"
      :interval="4000"
      :duration="500"
      :style="'border-radius:0 0 6% 6%;margin-top:' + systemInfo.navigationHeight + 'px'"
      circular
    >
      <block v-for="(item, index) in notice.data" :key="index">
        <swiper-item v-if="item.fileids && item.fileids[0]">
          <image
            :src="downloadUrl + item.fileids[0]"
            :style="'width: 100vw;height:' + bannerHeight"
            @click="toNotice(item)"
            @load="getHeight"
          ></image>
        </swiper-item>
      </block>
    </swiper>
    <view
      @click="open('/pages/declaration/declaration', {}, { mode: 'switchTab' })"
      class="declarationBtn"
    >
      <text>预约免费勘察</text>
      <view class="declarationBtnIcon">
        <uni-icons type="right"></uni-icons>
      </view>
    </view>
    <!-- #ifdef MP-ALIPAY -->
    <view class="subscribe">
      <view>
        <uni-icons type="notification"></uni-icons>
        <text class="c-m-l-10">订阅服务订单状态变更通知</text>
      </view>
      <button
        class="c-uni-button round mini default"
        plain
        @click="requestSubscribeMessage(['de95495461294d22bd401db0bb7c528a'])"
      >
        {{ subscribed ? '再次订阅' : '点击订阅' }}
      </button>
    </view>
    <!-- #endif -->
    <view class="order" v-if="!phone || sa._id">
      <view class="service-top" :style="!phone ? 'margin-bottom:10px;' : ''">
        <view style="flex: 1; font-size: 14px; font-weight: 600; margin-right: 5px">
          {{ sa.address || '' }}
        </view>
        <view
          v-if="phone"
          class="c-uni-button text"
          @click="open('../../subpackages/serviceAppointment/serviceAppointments')"
        >
          <text>查看全部工单</text>
          <uni-icons type="right" color="#666666" size="12"></uni-icons>
        </view>
        <button
          v-else
          class="c-uni-button round small default"
          open-type="getPhoneNumber"
          plain
          @getphonenumber="getPhoneNumber"
        >
          <image
            src="../../static/images/click.png"
            style="width: 12px; height: 12px; margin-right: 5px"
          />
          <text>授权手机号查看</text>
        </button>
      </view>
      <view v-if="ordersBjProducts.length > 0" style="color: #999999; font-size: 10px; margin: 5px">
        {{
          codelabel(
            'parts',
            ordersBjProducts.orderList && ordersBjProducts.orderList[0].repairParts[0],
            'cascade'
          ) || ''
        }}
        {{ ordersBjProducts.orderList[0].maintainAreaNum || '' }}㎡
      </view>
      <view class="content" v-if="phone">
        <view class="progress">
          <!-- 待上门 -->
          <view class="progress-item" style="flex: none">
            <view class="progress-icon">
              <view
                class="progress-center"
                :class="Number(sa.status) <= 202 ? 'progress-center-white' : ''"
              ></view>
            </view>
          </view>
          <!-- 待签约 -->
          <view class="progress-item">
            <view class="progress-icon">
              <view
                class="progress-line"
                :class="
                  Number(sa.status) == 206
                    ? 'progress-line-doing'
                    : Number(sa.status) < 205
                    ? 'progress-line-todo'
                    : 'progress-line-done'
                "
              ></view>
              <view
                class="progress-center"
                :class="
                  Number(sa.status) == 206 || Number(sa.status) < 205 ? 'progress-center-white' : ''
                "
              ></view>
            </view>
          </view>
          <!-- 待支付 -->
          <view class="progress-item">
            <view class="progress-icon">
              <view
                class="progress-line"
                :class="
                  Number(sa.status) == 205
                    ? 'progress-line-doing'
                    : Number(sa.status) == 206 || Number(sa.status) < 205
                    ? 'progress-line-todo'
                    : 'progress-line-done'
                "
              ></view>
              <view
                class="progress-center"
                :class="Number(sa.status) <= 206 ? 'progress-center-white' : ''"
              ></view>
            </view>
          </view>
          <!-- 施工中 -->
          <view class="progress-item">
            <view class="progress-icon">
              <view
                class="progress-line"
                :class="
                  Number(sa.status) == 302
                    ? 'progress-line-doing'
                    : Number(sa.status) < 302
                    ? 'progress-line-todo'
                    : 'progress-line-done'
                "
              ></view>
              <view
                class="progress-center"
                :class="Number(sa.status) < 302 ? 'progress-center-white' : ''"
              ></view>
            </view>
          </view>
          <!-- 待验收 -->
          <view class="progress-item">
            <view class="progress-icon">
              <view
                class="progress-line"
                :class="
                  Number(sa.status) == 401
                    ? 'progress-line-doing'
                    : Number(sa.status) < 401
                    ? 'progress-line-todo'
                    : 'progress-line-done'
                "
              ></view>
              <view
                class="progress-center"
                :class="Number(sa.status) < 401 ? 'progress-center-white' : ''"
              ></view>
            </view>
          </view>
          <!-- 待完工 -->
          <view class="progress-item">
            <view class="progress-icon">
              <view
                class="progress-line"
                :class="
                  Number(sa.status) == 402
                    ? 'progress-line-doing'
                    : Number(sa.status) < 402
                    ? 'progress-line-todo'
                    : 'progress-line-done'
                "
              ></view>
              <view
                class="progress-center"
                :class="Number(sa.status) <= 402 ? 'progress-center-white' : ''"
              ></view>
            </view>
          </view>
          <!-- 待评价 -->
          <view class="progress-item">
            <view class="progress-icon">
              <view
                class="progress-line"
                :class="
                  Number(sa.status) == 403 || Number(sa.status) == 407
                    ? 'progress-line-doing'
                    : Number(sa.status) < 403
                    ? 'progress-line-todo'
                    : 'progress-line-done'
                "
              ></view>
              <view
                class="progress-center"
                :class="Number(sa.status) < 502 ? 'progress-center-white' : ''"
              ></view>
            </view>
          </view>
        </view>
        <view class="progress-text">
          <text
            :class="
              Number(sa.status) == 202
                ? 'progress-text-doing'
                : Number(sa.status) < 202
                ? 'progress-text-todo'
                : 'progress-text-done'
            "
          >
            {{ Number(sa.status) <= 202 ? '待上门' : '已上门' }}
          </text>
          <text
            :class="
              Number(sa.status) == 206
                ? 'progress-text-doing'
                : Number(sa.status) < 205
                ? 'progress-text-todo'
                : 'progress-text-done'
            "
          >
            {{ Number(sa.status) == 206 || Number(sa.status) < 205 ? '待签约' : '已签约' }}
          </text>
          <text
            :class="
              Number(sa.status) == 205
                ? 'progress-text-doing'
                : Number(sa.status) == 206 || Number(sa.status) < 205
                ? 'progress-text-todo'
                : 'progress-text-done'
            "
          >
            {{ Number(sa.status) <= 206 ? '待付款' : '已付款' }}
          </text>
          <text
            :class="
              Number(sa.status) == 302
                ? 'progress-text-doing'
                : Number(sa.status) < 302
                ? 'progress-text-todo'
                : 'progress-text-done'
            "
          >
            {{
              Number(sa.status) < 302 ? '待施工' : Number(sa.status) == 302 ? '施工中' : '已施工'
            }}
          </text>
          <text
            :class="
              Number(sa.status) == 401
                ? 'progress-text-doing'
                : Number(sa.status) < 401
                ? 'progress-text-todo'
                : 'progress-text-done'
            "
          >
            {{ Number(sa.status) <= 401 ? '待验收' : '已验收' }}
          </text>
          <text
            :class="
              Number(sa.status) == 402
                ? 'progress-text-doing'
                : Number(sa.status) < 402
                ? 'progress-text-todo'
                : 'progress-text-done'
            "
          >
            {{ Number(sa.status) <= 402 ? '待完工' : '已完工' }}
          </text>
          <text
            :class="
              Number(sa.status) == 403 || Number(sa.status) == 407
                ? 'progress-text-doing'
                : Number(sa.status) < 403
                ? 'progress-text-todo'
                : 'progress-text-done'
            "
          >
            {{ Number(sa.status) < 502 ? '待评价' : '已评价' }}
          </text>
        </view>
        <view class="buttons">
          <view
            class="c-flex c-flex-center"
            v-if="sa.status == '205' || sa.status == '407'"
            @click="toPay"
          >
            <image
              src="../../static/images/click.png"
              style="width: 10px; height: 10px; margin-right: 3px"
            />
            <text>去支付</text>
          </view>
          <view
            class="c-flex c-flex-center"
            v-if="sa.exts.supervisorName && sa.exts.supervisorPhone"
            @click="$refs.serviceTeamPopup.open()"
          >
            <image
              src="../../static/images/click.png"
              style="width: 10px; height: 10px; margin-right: 3px"
            />
            <text>服务团队</text>
          </view>
          <view
            class="c-flex c-flex-center"
            v-if="sa.exts.moKanNum && Number(sa.status) > 103 && Number(sa.status) < 403"
            @click="toMoKanDetail(sa)"
          >
            <image
              src="../../static/images/click.png"
              style="width: 10px; height: 10px; margin-right: 3px"
            />
            <text>施工视频</text>
          </view>
          <view
            class="c-flex c-flex-center"
            v-if="surveys.length > 0"
            :data-filename="surveys[0].surveyPDFUrl"
            @click="surveyClick"
          >
            <image
              src="../../static/images/click.png"
              style="width: 10px; height: 10px; margin-right: 3px"
            />
            <text>勘察报告</text>
          </view>
          <view
            class="c-flex c-flex-center"
            v-if="Number(sa.status) == 403 || Number(sa.status) == 407 || Number(sa.status) == 501"
            @click="toEvaluate(sa)"
          >
            <image
              src="../../static/images/click.png"
              style="width: 10px; height: 10px; margin-right: 3px"
            />
            <text>去评价</text>
          </view>
        </view>
      </view>
      <!-- 服务团队 -->
      <uni-popup ref="serviceTeamPopup" type="dialog">
        <uni-popup-dialog
          ref="serviceTeamDialog"
          title="服务团队"
          :showClose="false"
          type="info"
          @confirm="$refs.serviceTeamPopup.close()"
        >
          <view style="width: 100%">
            <view
              class="c-flex c-item-center c-flex-between"
              style="background: #f6f8fe; border-radius: 8px; padding: 10px 15px"
            >
              <view>
                <view class="c-flex c-item-center">
                  <text>{{ sa.exts.supervisorName }}</text>
                </view>
                <view class="c-flex c-item-center">
                  <uni-tag
                    text="管家"
                    type="primary"
                    size="mini"
                    custom-style="background-color: #F9DE55; border-color: #F9DE55;margin-right:5px;"
                  />
                  <uni-rate readonly :value="5" color="#eee" active-color="#F9DE55" />
                </view>
              </view>
              <view class="phone-button" @click="makeCall(sa.exts.supervisorPhone)">
                <image
                  src="../../static/images/phone.png"
                  style="width: 15px; display: flex"
                  mode="widthFix"
                ></image>
              </view>
            </view>
            <view
              class="c-flex c-item-center c-flex-between"
              style="background: #f6f8fe; border-radius: 8px; padding: 10px 15px; margin-top: 10px"
              v-if="sa.exts.headmanName && sa.exts.headmanPhone"
            >
              <view>
                <view class="c-flex c-item-center">
                  <text>{{ sa.exts.headmanName }}</text>
                </view>
                <view class="c-flex c-item-center">
                  <view class="c-flex c-item-center">
                    <uni-tag
                      text="工队"
                      type="primary"
                      size="mini"
                      custom-style="background-color: #F9DE55; border-color: #F9DE55;margin-right:10px;"
                    />
                    <uni-rate readonly :value="5" color="#eee" active-color="#F9DE55" />
                  </view>
                </view>
              </view>
              <view class="phone-button" @click="makeCall(sa.exts.headmanPhone)">
                <image
                  src="../../static/images/phone.png"
                  style="width: 15px; display: flex"
                  mode="widthFix"
                ></image>
              </view>
            </view>
          </view>
        </uni-popup-dialog>
      </uni-popup>
      <!-- </van-dialog> -->
    </view>

    <view class="service2">
      <view style="width: 47%">
        <view
          class="service2-item"
          @click="
            open('../../subpackages/quotationCalculator/quotationCalculator');
            doMd('报价计算器');
          "
        >
          <view>
            <view class="service2-item-title">维修估价</view>
            <view class="service2-item-content">价格计算器</view>
          </view>
          <view class="service2-item-imgBlock">
            <image
              class="service2-item-img"
              src="../../static/images/weixiugujia.png"
              style="width: 25px"
              mode="widthFix"
            ></image>
          </view>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="service2-item" style="margin-top: 10px" @click="openCustomerServiceChat()">
          <view>
            <view class="service2-item-title">专属客服</view>
            <view class="service2-item-content">1v1在线咨询</view>
          </view>
          <view class="service2-item-imgBlock">
            <image
              class="service2-item-img"
              src="../../static/images/zhuanshukefu.png"
              style="width: 25px"
              mode="widthFix"
            ></image>
          </view>
        </view>
        <!-- #endif -->
      </view>
      <view style="width: 47%" class="service-coupon">
        <view class="service2-item" @click="open('../../subpackages/coupon/mall')">
          <view>
            <view class="service2-item-title">优惠活动</view>
            <view class="service2-item-content">限时优惠券</view>
          </view>
          <view class="service2-item-imgBlock">
            <image
              class="service2-item-img"
              src="../../static/images/youhuihuodong.png"
              style="width: 25px"
              mode="widthFix"
            ></image>
          </view>
        </view>
      </view>
    </view>
    <view class="parts">
      <block v-for="(item, i) in options.classifications" :key="i">
        <view v-if="i < 4" @click="partClick(item.value)">
          <view class="parts-imgView">
            <image
              class="parts-img"
              :src="item.imageUrl || '../../static/images/part1.png'"
              mode="widthFix"
              style="width: 38px; height: 38px"
            ></image>
          </view>
          <view class="parts-name">
            <text>{{ item.label }}</text>
          </view>
        </view>
      </block>
      <view @click="partClick('')" v-if="options.classifications.length > 0">
        <view class="parts-imgView">
          <image
            class="parts-img"
            src="../../static/images/part5.png"
            mode="widthFix"
            style="width: 38px; height: 38px"
          ></image>
        </view>
        <view class="parts-name">
          <text>更多部位</text>
        </view>
      </view>
    </view>
    <view v-if="caseLibrary.length > 0">
      <view
        style="
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-right: 20px;
        "
      >
        <view class="title" style="margin-top: 20px">案例推荐</view>
        <!-- <view>
          <view class="more-button">更多 ></view>
        </view> -->
      </view>
      <!-- 部位 -->
      <view style="display: flex; margin: 10px 20px; justify-content: space-between">
        <view
          :class="repairPartsOneIndex == index ? 'doRepairPartsOne' : 'unRepairPartsOne'"
          @click="doRepairPartsOne(index, item)"
          v-for="(item, index) in options.repairPartsOne"
          :key="index"
        >
          <view>{{ item.name }}</view>
          <view :class="repairPartsOneIndex == index ? 'drop' : ''"></view>
        </view>
      </view>
      <!-- <view class="desc">修链案例，时刻关注</view> -->
      <view class="cases scrollbar-hide">
        <view
          style="background-color: #cb9c70; padding: 10px"
          v-for="(item, i) in caseLibrary"
          :key="i"
          class="case"
          @click="
            open('../../subpackages/web/media', {
              title: item.content,
              fileName: item.exts.imagesDetail[0].name || item.videos[0].name,
              fileType: item.videos && item.videos.length > 0 ? 'video' : ''
            })
          "
        >
          <view class="case-view">
            <view class="case-view-title">
              {{ codelabel('parts', item.repairParts[0], 'cascade') || '' }}
            </view>
            <view>
              <uni-icons type="location" size="8" color="#fefdff" />
              <text style="color: #fefdff; font-size: 8px">
                {{ codelabel('regions', item.exts.regions) || '' }}
              </text>
            </view>
          </view>
          <view class="case-view-img">
            <image
              :src="item.images[0].url"
              mode="aspectFill"
              style="border-radius: 8px; width: 140px; height: 140px; display: flex"
            ></image>
          </view>
          <view class="case-view-content">{{ item.name }}</view>
        </view>
      </view>
    </view>
    <view>
      <!-- <view class="title">套餐推荐</view>
      <view class="desc">北京20000个家庭的选择</view> -->
      <view
        style="
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-right: 20px;
          margin-bottom: 35px;
        "
      >
        <view class="title" style="margin-top: 20px">套餐推荐</view>
        <view @click="open('../../pages/classification/classification', {}, { mode: 'switchTab' })">
          <view class="more-button">
            更多
            <uni-icons type="right" size="10" color="#666666"></uni-icons>
          </view>
        </view>
        <!-- <view>
          
          <image
            src="../../static/images/more.png"
            mode="widthFix"
            style="width: 40px; height: 40px"
          ></image>
        </view> -->
      </view>
      <!-- <view class="products">
        <view
          class="product"
          v-for="(item, i) in wares"
          :key="i"
          @click="open('../../subpackages/good/good', { id: item._id })"
        >
          <image
            :src="(item.images[0] && item.images[0].url) || 'https://pub.fsgo365.cn/product1.png'"
            mode="scaleToFill"
            style="width: 100%; display: flex; margin: 0 auto"
            :style="'height:' + imageSize + 'px'" 
          ></image>
          <view class="product-info">
            <view>
              <view class="product-title">{{ item.name }}</view>
              <view class="product-desc">{{ item.description || '' }}</view>
            </view>
            <view>
              <view class="product-area">{{ item.exts.applicableArea || '' }}</view>
              <view class="product-price" v-if="item.unit">
                ¥ {{ item.price }}/{{ codelabel('UNIT', item.unit) }}
              </view>
              <view class="product-price" v-else>¥ {{ item.price }}</view>
            </view>
          </view>
        </view>
      </view> -->
      <view class="products">
        <view
          class="product"
          v-for="(item, i) in wares"
          :key="i"
          @click="open('../../subpackages/good/good', { id: item._id })"
        >
          <!-- :style="'height:' + imageSize + 'px'" -->
          <view>
            <image
              :src="getImgUrl((item.images[0] && item.images[0].url) || 'https://pub.fsgo365.cn/product1.png', 'default')"
              mode="widthFix"
              style="width: 100%; display: flex; margin: 0 auto; border-radius: 8px"
              :style="'height:' + imageSize + 'px'"
            ></image>
          </view>
          <view class="product-info">
            <view style="display: flex; margin: 10px 0 0 5px; justify-content: space-between">
              <view class="product-info-left">
                <view style="display: flex; align-items: center">
                  <view class="product-info-left-name">{{ item.name }}</view>
                  <view class="product-info-left-icon">
                    {{ codelabel('classifications', item.classifyId) }}
                  </view>
                </view>
                <view class="product-info-left-description">{{ item.description }}</view>
              </view>
              <view class="product-info-right">
                <view class="product-info-right-icon">￥</view>
                <view class="product-info-right-price">{{ item.price }}</view>
                <view style="padding-top: 15px">
                  <view class="product-info-right-applicableArea">
                    {{ item.exts.applicableArea }}
                  </view>
                  <view class="product-info-right-unit">元/{{ codelabel('UNIT', item.unit) }}</view>
                </view>
              </view>
            </view>
            <view style="display: flex">
              <view
                style="
                  font-size: 10px;
                  background-color: #f6f6f6;
                  padding-left: 5px;
                  margin: 0 5px;
                  padding: 0 5px;
                "
                v-for="(tiems, i) in item.exts.applicableParts"
                :key="i"
              >
                {{ codelabelForArray('repairPartsOne', tiems) }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 通知弹窗 -->
    <uni-popup ref="popup" type="dialog" :animation="false">
      <view class="notification">
        <view class="notification-bg">
          <view class="icon-close">
            <uni-icons
              type="close"
              color="#ffffff"
              size="32"
              style="font-size: 32px"
              @click="$refs.popup.close()"
            />
          </view>
          <image
            src="../../static/images/notice-image.png"
            style="width: 90px; height: 90px; display: flex; border-radius: 50%"
          />
          <view v-if="notification.data.length == 1" class="content">
            <view class="triangle">
              <view class="triangle-small"></view>
            </view>
            <view class="content-title" style="color: #2c5bec">
              <view class="line-left"></view>
              {{ notification.data[0].content }}
              <view class="line-right"></view>
            </view>
            <view
              class="button"
              @click="
                read(notification.data[0]._id);
                open(notification.data[0].jumpUrl, { _id: notification.data[0].typeId });
              "
            >
              点击查看
            </view>
          </view>
          <view v-else class="contents">
            <view class="triangle">
              <view class="triangle-small"></view>
            </view>
            <view class="content-views">
              <view class="content-view" v-for="(item, i) in notification.data" :key="i">
                <view>
                  <view class="content-text">{{ item.content }}</view>
                  <view class="content-date">创建时间：{{ item.createTime.split(' ')[0] }}</view>
                </view>
                <view
                  class="button"
                  style="margin-top: 0"
                  @click="
                    read(item._id);
                    open(item.jumpUrl, { _id: item.typeId });
                  "
                >
                  查 看
                </view>
              </view>
            </view>
            <view
              class="more"
              @click="
                read();
                open('/pages/account/account', {}, { mode: 'switchTab' });
              "
            >
              <text class="c-m-r-10">前往个人中心查看更多</text>
              <uni-icons type="right" color="#2c5bec" size="14" />
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
var areajs = require('../../common/area.js');
export default {
  data() {
    return {
      notice: { data: [] },
      bannerHeight: '',
      declarationBtnHeight: '',
      systemInfo: {
        menuButtonObject: {}
      },
      downloadUrl: common.osg.downloadUrl,
      classifications: [],
      cases: [
        {
          title: '亦庄屋顶维修',
          duration: '3小时',
          color: '#D60F16',
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
          color: '#D60F16',
          like: 389,
          cover: 'https://pub.fsgo365.cn/case4-cover.jpg',
          fileName: 'case4-content.mov',
          fileType: 'video'
        }
      ],
      wares: [],
      params: {},
      storeData: {},
      housekeepers: [],
      QRcordShow: false,
      phone: '',
      sa: { exts: {} },
      // nodes: [],
      serviceTeamShow: false, // 服务团队是否展示
      areaList: Object.assign({}, areajs.default),
      surveys: [],
      notification: {
        show: false,
        data: []
      },
      imageSize: 156, // 商品图片宽高相等，根据屏幕宽度计算
      options: {
        codecfg_serviceType: { codeId: 'serviceType' },
        cascadeCode_UNIT: { codeId: 'UNIT' },
        cascadeCode_parts: { codeId: 'parts' },
        codecfg_repairPartsOne: { codeId: 'repairPartsOne' }, // 维修部位一级
        codecfg_regions: { codeId: 'regions' },
        classifications: [] //商品分类部位
      },
      repairPartsOneIndex: null, //部位的index
      repairPartSearch: null, //部位的值
      caseLibrary: [], //案例数据
      ordersBjProducts: {},
      subscribed: true // 订阅状态
    };
  },
  onLoad(params) {
    // 获取系统信息
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        // 整个导航栏的高度
        let navigationHeight =
          res.statusBarHeight +
          menuButtonObject.height +
          (menuButtonObject.top - res.statusBarHeight) * 2;
        // 导航栏的高度 = 整个导航栏高度 - 状态栏高度
        let navHeight = navigationHeight - res.statusBarHeight;
        // 胶囊与屏幕右侧边距
        menuButtonObject.marginRight = res.windowWidth - menuButtonObject.right;
        // 挂载到globalData
        this.systemInfo = Object.assign(res, {
          navigationHeight,
          statusBarHeight: res.statusBarHeight,
          navHeight,
          menuButtonObject
        });
      }
    });

    // 计算商品照片宽高
    this.imageSize = (this.systemInfo.windowWidth - 60) / 2;

    // 处理扫码进入参数
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
    } else {
      this.params = params;
    }
    common.osg.init(this, this.params, app);
    if (params.act == 'ykyq') {
      common.osg.md({ act: 'ykyq_' + this.$mp.page.route });
    }

    // 静默登录
    common.osg.doLogin(
      {
        shareType: this.params.shareType,
        shareTypeId: this.params.shareTypeId,
        allotOrgId: this.params.allotOrgId,
        shareUserId: this.params.shareUserId,
        channelId: this.params.channelId
      },
      res => {
        this.phone = wx.getStorageSync('user').phone;
        if (this.phone) {
          this.getServiceAppointments();
          this.getMessages();
        }
        common.osg.codeoption();
        // 如果扫过店铺码，则锁定（自动跳转）到店铺
        // if ((res.user.shareType == 1 || res.user.shareType == 2) && res.user.shareTypeId) {
        //   common.osg.open(
        //     '../../subpackages/store/storeDetail',
        //     {
        //       shareType: this.params.shareType,
        //       shareTypeId: this.params.shareTypeId,
        //       allotOrgId: this.params.allotOrgId,
        //       shareUserId: this.params.shareUserId,
        //       channelId: this.params.channelId
        //     },
        //     {
        //       mode: 'redirect'
        //     }
        //   );
        //   return;
        // }
        this.getNotice();
        this.getClassifications();
        this.getWares();
        this.getCaseLibrary();
        this.getOrders();
      }
    );

    // 缓存平台电话，在从平台进入商品详情页时拨号联系平台
    wx.setStorageSync('contactNumber', '13898448806');
    // 展示消息订阅状态
    this.subscribed = wx.getStorageSync('subscribed');
  },
  onShow() {
    // 通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
    if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
      this.$mp.page.getTabBar().setData({
        active: 0
      });
    }

    common.osg.init(this, {}, app);

    if (!this.phone && wx.getStorageSync('user').phone) {
      this.getMessages();
    }
    this.phone = wx.getStorageSync('user').phone;
    if (this.phone) {
      this.getServiceAppointments();
    }
  },
  // 设置转发内容
  onShareAppMessage() {
    return {
      title: '修链房屋维修',
      path: '/pages/index/index'
    };
  },
  // 设置分享朋友圈内容
  onShareTimeline() {
    return {
      title: '修链房屋维修',
      query: ''
    };
  },
  methods: {
    openCustomerServiceChat() {
      // VIP客服修修 https://work.weixin.qq.com/kfid/kfc9f975e9e814a10df
      // 修链科技客服 https://work.weixin.qq.com/kfid/kfcfe0104cc3194d18b
      // 修链房屋维修官方客服 https://work.weixin.qq.com/kfid/kfc5dd7ee01d88fcf16
      wx.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfc9f975e9e814a10df' },
        corpId: 'wwb580bbf2548e6123',
        success(res) {
          console.log('openCustomerServiceChat success', res);
        },
        fail(res) {
          console.log('openCustomerServiceChat fail', res);
        }
      });
    },
    doRepairPartsOne(index, item) {
      this.repairPartsOneIndex = index;
      this.repairPartSearch = item.value;
      this.getCaseLibrary();
    },
    // 查询案例库
    getCaseLibrary() {
      let params = {
        'all:repairParts|array#and': this.repairPartSearch || '',
        'is:state|integer#and': 1,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax('/basic/caseLibrary/query', params, res => {
        this.caseLibrary = res.data;
      });
    },
    doMd(act) {
      common.osg.md({ act });
    },
    open(path, data, options) {
      common.osg.open(path, data, options);
    },
    getNotice: function () {
      let params = {
        _all: '1',
        'is:type|integer#and': 3,
        'is:exts.chooseApplet|string#and': '2', //2:C端小程序
        'is:isTop|integer#and': 1,
        sortField: 'createTime',
        sortOrder: 'desc'
      };
      common.osg.ajax(
        'document/query',
        params,
        res => {
          this.notice.data = res.data || [];
        },
        {
          noload: true
        }
      );
    },
    toNotice(item) {
      if (item.path) {
        common.osg.open(item.path, {
          documentId: item._id
        });
      } else if (item._id) {
        common.osg.open('../../subpackages/noticeManage/detail', {
          id: item._id
        });
      }
    },
    // 获取banner高度
    getHeight(e) {
      if (this.bannerHeight) return;
      //获取可使用窗口宽度
      var width = this.systemInfo.windowWidth;
      //获取图片实际高度
      var imgheight = e.detail.height;
      //获取图片实际宽度
      var imgwidth = e.detail.width;
      //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      var height = (width * imgheight) / imgwidth;
      // height += 'px';
      this.declarationBtnHeight = height + this.systemInfo.navigationHeight - 20;
      this.bannerHeight = height += 'px';
    },
    // 查询商品分类
    getClassifications() {
      common.osg.ajax(
        'wares/queryClassify.do',
        {
          page: 1,
          rows: 4,
          parentId: '4417047658598871409', // C端小程序部位
          'is:state|integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          res.data.map(item => {
            item.label = item.name;
            item.value = item._id;
          });
          this.options.classifications = res.data;
        }
      );
    },
    // 点击商品分类
    partClick(id) {
      wx.setStorageSync('classificationId', id);
      common.osg.open('../classification/classification', { id }, { mode: 'switchTab' });
    },
    // 查询C端服务商品
    getWares() {
      common.osg.ajax(
        '/wares/query',
        {
          page: 1,
          rows: 20,
          'is:state|integer#and': 1,
          'is:exts.isShow|integer#and': 1, //查询在首页展示的商品
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.wares = res.data;
        }
      );
    },
    /**
     * 授权手机号绑定当前账号
     */
    getPhoneNumber(e) {
      common.osg.getPhoneNumber(e, user => {
        this.phone = user.phone;
        this.getServiceAppointments();
        this.getMessages();
      });
    },
    // 查询最新工单
    getServiceAppointments() {
      common.osg.ajax(
        'basic/serviceAppointment/query',
        {
          page: 1,
          rows: 1,
          sortField: 'updateTime',
          sortOrder: 'desc'
          // 'is:state|integer#and': 1
        },
        res => {
          this.sa = res.data[0] || { exts: {} };
          if (res.data.length > 0) {
            common.osg.codeoption();
          }
          // if (res.data[0]) {
          //   let sa = res.data[0];
          //   let nodes = [];
          //   let defNodes = sa.workflow.def.nodes;
          //   let runNodes = sa.workflowNodeList.filter(
          //     node => node.nodeId != '0' && (node.state == 1 || node.state == 10)
          //   );
          //   for (let i = 0; i < defNodes.length; i++) {
          //     nodes.push(runNodes[i] || { nodeDef: defNodes[i] });
          //   }
          //   this.nodes = nodes;
          // } else {
          //   this.sa = {exts:{}};
          //   this.nodes = [];
          // }
          // 勘查中或已勘察时查询勘察单数量
          if (Number(this.sa.status) >= 202) {
            this.getSurveys();
          } else {
            this.surveys = [];
          }
          if (res.data.length == 0) {
            common.osg.toast('您当前还没有订单！', 'none');
          }
        }
      );
    },
    // 去支付
    toPay() {
      common.osg.ajax(
        'basic/order/query',
        {
          'is:serviceAppointmentId|string#and': this.sa._id,
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          let payData = res.data.filter(item => item.payState == 0 || item.payState == 2);
          if (payData.length == 0) {
            common.osg.alert('未查询到需要支付的订单！', 'none');
          } else if (payData.length == 1) {
            this.open('/subpackages/order/pay', {
              orderId: payData[0]._id
            });
          } else {
            this.open('/subpackages/order/orders', { serviceAppointmentId: this.sa._id });
          }
        },
        {
          noload: true
        }
      );
    },
    getOrders() {
      common.osg.ajax(
        'basic/order/query',
        {
          _all: '1',
          sortField: 'createTime',
          sortOrder: 'desc',
          'is:serviceAppointmentId|string#and': this.sa._id
        },
        res => {
          let orders = [];
          orders = res.data;
          if (orders.length > 0) {
            this.ordersBjProducts = JSON.parse(orders[0].bjProducts);
          } else {
            this.ordersBjProducts = {};
          }
        }
      );
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    toMoKanDetail(item) {
      common.osg.open('../../subpackages/web/web', {
        url: `${common.osg.host}/fsgo/wm/h5/mokan/detail/${item.exts.moKanNum}?address=${
          this.areaList.province_list[item.area[0]] +
          this.areaList.city_list[item.area[1]] +
          this.areaList.county_list[item.area[2]] +
          item.address
        }&startDate=${item.exts.startDate || ''}&supervisorName=${
          item.exts.supervisorName || ''
        }&headmanName=${item.exts.headmanName || ''}&client=b`
      });
    },
    getSurveys() {
      common.osg.ajax(
        'biz/extForm/query/7971040108398070730.do',
        { tenantId: '1340835581184723420', sid: this.sa._id },
        res => {
          this.surveys = res.data;
        }
      );
    },
    surveyClick(e) {
      if (this.surveys.length == 1) {
        this.doMd('勘察报告文件');
        common.osg.download(e);
      } else if (this.surveys.length > 1) {
        this.open('../../subpackages/survey/surveys', {
          serviceAppointmentId: this.sa._id
        });
      }
    },
    toEvaluate(sa) {
      let node = sa.workflowNodeList[sa.workflowNodeList.length - 1];
      common.osg.open('/subpackages/extForm/extForm', {
        formDefId: node.nodeDef.formDefId,
        formDataId: node.formDataId,
        workflowNodeId: node._id,
        tenantId: node.tenantId,
        sid: sa._id
      });
    },
    getMessages() {
      common.osg.ajax(
        'basic/message/query',
        {
          'is:state|integer#and': 1,
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          this.notification.data = res.data;
          if (res.data.length > 0) {
            this.$refs.popup.open('center');
          } else {
            this.$refs.popup.close();
          }
        }
      );
    },
    read(id) {
      common.osg.ajax('basic/message/disable/' + id, {}, () => {}, { noload: true });
    },
    codelabel(options, value, type) {
      if (type == 'cascade') {
        return common.osg.codelabelCascade(options, value);
      } else {
        return common.osg.codelabel(options, value);
      }
    },
    //value为数组、opt.value为字符串
    codelabelForArray(codeType, codeValue, opts) {
      var $this = common.osg._cthis;
      if (!$this || !$this.options || !codeType || !codeValue) {
        return;
      }
      var opts = $this.options[codeType] || $this.options[codeType.toLowerCase()]; // 避免有些字典表codeType是大写,预置没有
      if (opts && codeValue) {
        if (opts.constructor != Array) return;
        var str = '';
        for (var i = 0; i < opts.length; i++) {
          for (var j = 0; j < codeValue.length; j++) {
            if (codeValue[j] == opts[i].value) str += opts[i].name + '  ';
          }
        }
        str = str.substring(0, str.length - 1);
        return str;
      }
      if (!codeValue) {
        return codeValue;
      } else {
        return '未知';
      }
    },
    // 图片优化代理方法
    getImgUrl(url, opt) {
        return common.osg.getImgUrl(url, opt);
    },
    requestSubscribeMessage(entityIds) {
      common.osg.requestSubscribeMessage(entityIds, res => {
        if (res.success) {
          common.osg.toast('订阅成功（每订阅1次可接收1次消息，可重复订阅）', 'none', 4000);
          this.subscribed = true;
          wx.setStorageSync('subscribed', true);
        } else if (res.errorMessage) {
          common.osg.toast(res.errorMessage, 'none');
          this.subscribed = false;
          wx.setStorageSync('subscribed', false);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.index {
  width: 100vw;
  overflow-x: hidden;
  background: #fff;
  width: 100%;
  overflow: hidden;
  padding-bottom: 50px;
  margin-bottom: env(safe-area-inset-bottom);
  .notification {
    width: 85vw;
    max-width: 85vw;
    height: 90vh;
    margin-top: calc(10vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    .notification-bg {
      position: relative;
      background: linear-gradient(#3b66e0, #6589e7);
      width: 100%;
      border-radius: 10px;
      .icon-close {
        position: absolute;
        right: -28px;
        top: -28px;
      }
      image {
        margin: -35px auto 0;
      }
      .triangle {
        width: 10px;
        height: 10px;
        box-sizing: border-box;
        border-left: 10px solid #5376db;
        border-bottom: 10px solid #5376db;
        border-top: 10px solid transparent;
        border-right: 10px solid transparent;
        rotate: -45deg;
        position: absolute;
        top: -10px;
        left: calc(50% - 10px);
        border-radius: 0 0 0 5px;
        .triangle-small {
          width: 6px;
          height: 6px;
          box-sizing: border-box;
          border-left: 6px solid #0f193b;
          border-bottom: 6px solid #0f193b;
          border-top: 6px solid transparent;
          border-right: 6px solid transparent;
          position: absolute;
          top: -6px;
          left: calc(50% - 6px);
          border-radius: 3px;
        }
      }
      .content {
        background: #fff;
        border-radius: 10px;
        margin-top: 10px;
        padding: 20px;
        text-align: center;
        position: relative;
        .content-title {
          display: flex;
          align-items: center;
          justify-content: center;
          .line-left {
            width: 30px;
            height: 1px;
            background: linear-gradient(90deg, #fff, #9cb5f3);
            margin-right: 5px;
          }
          .line-right {
            width: 30px;
            height: 1px;
            background: linear-gradient(90deg, #9cb5f3, #fff);
            margin-left: 5px;
          }
        }
        .button {
          background: linear-gradient(#3b66e0, #6589e7);
          color: #fff;
          height: 40px;
          line-height: 40px;
          border-radius: 8px;
          margin-top: 20px;
        }
      }
      .contents {
        background: #fff;
        border-radius: 10px;
        margin-top: 10px;
        padding: 20px 15px 15px;
        position: relative;
        .content-views {
          max-height: calc(100vh - 350px);
          overflow-y: auto;
        }
        .content-views::-webkit-scrollbar {
          display: none;
        }
        .content-view {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #ebedf0;
          padding-bottom: 15px;
          margin-bottom: 15px;
          color: #646566;
          &:last-child {
            margin-bottom: 0;
          }
          > view {
            line-height: 24px;
          }
          .button {
            background: linear-gradient(#3b66e0, #6589e7);
            color: #fff;
            width: 60px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            border-radius: 4px;
          }
        }
        .more {
          color: #2c5bec;
          text-align: center;
          font-size: 14px;
          padding-top: 15px;
        }
      }
    }
  }
  .subscribe {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 20px;
    padding: 10px;
    box-sizing: border-box;
    width: calc(100vw - 40px);
    border-radius: 8px;
    background-color: #f7f7f7;
  }
}
.notice {
  width: 100vw;
  padding: 10px;
  background: #f1f1f1;
  color: #383838;
  font-size: 12px;
  box-sizing: border-box;
}
.declarationBtn {
  width: 145px;
  height: 44px;
  background-color: #d60f16;
  color: #fff;
  text-align: center;
  border-radius: 1.5rem;
  font-size: 14px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-left: 20px;
  margin-top: -22px;
  .declarationBtnIcon {
    border-radius: 50%;
    background-color: #fff;
    margin-left: 5px;
    width: 16px;
    height: 16px;
    line-height: 17px;
  }
}
.order {
  margin: 10px 20px 20px;
  padding: 6px;
  box-sizing: border-box;
  width: calc(100vw - 40px);
  border-radius: 8px;
  // background: linear-gradient(316deg, #f8d7a1 0%, #ffc658 97.8%);
  background-color: #f7f7f7;
  .service-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin: 10px 5px 5px 5px;
  }
  .content {
    border-radius: 2px;
    padding: 6px;
    background: #f7f7f7;
    .progress {
      margin: 5px 0;
      background-color: #fff;
      border-radius: 8px;
      position: relative;
      display: flex;
      // padding: 0 calc((((100vw - 56px) / 6) - 11px) / 2);
      .progress-item {
        opacity: 0.7;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .progress-icon {
          width: 100%;
          display: flex;
          align-items: center;
          .progress-line {
            flex: 1;
            height: 0;
          }
          .progress-line-todo {
            border-bottom: 0.8px solid #b6b6b6;
          }
          .progress-line-doing {
            border-bottom: 1px dashed #e50012;
          }
          .progress-line-done {
            border-bottom: 1px solid #e50012;
          }
          .progress-center {
            width: 8px;
            height: 8px;
            box-sizing: border-box;
            border: 1px solid #e50012;
            background-color: #e50012;
            // background: linear-gradient(316deg, #f8d7a1 0%, #ffc658 97.8%);
            border-radius: 50%;
            margin: 5px;
          }
          .progress-center-white {
            border: 1px solid #b2b2b2;
            background: #fff;
          }
        }
      }
    }
    .progress-text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      .progress-text-todo {
        color: #b6b6b6;
      }
      .progress-text-doing {
        color: #d60f16;
      }
      .progress-text-done {
        color: #666666;
      }
    }
    .buttons {
      // color: #fff;
      display: flex;
      margin-top: 10px;
      > view {
        margin-right: 10px;
        width: 65px;
        text-align: center;
        height: 18px;
        line-height: 18px;
        border-radius: 50px;
        background: linear-gradient(316deg, #e89093 0%, #ec6064 97.8%);
        font-size: 10px;
      }
    }
  }
  .phone-button {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: linear-gradient(219deg, #508af6 0%, #1a62f1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.parts {
  margin: 30px 0;
  width: 100vw;
  // height: 55px;
  display: flex;
  justify-content: space-evenly;
  > view {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    align-items: center;

    // > text {
    //   font-size: 13px;
    // }
  }
  .parts-imgView {
    width: 52px;
    height: 50px;
    background-color: #f3f3f3;
    border-radius: 15px;
    position: relative;
    margin-bottom: 10px;
  }
  .parts-img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .parts-name {
    font-size: 13px;
  }
}

.title {
  font-size: 16px;
  font-weight: 800;
  margin: 35px 20px 6px;
}
.more-button {
  color: #666666;
  font-size: 10px;
  border: 1px solid #666666;
  width: 40px;
  border-radius: 50px;
  text-align: center;
  height: 15px;
  line-height: 15px;
  padding: 3px;
}
.desc {
  font-size: 14px;
  color: #736e6e;
  margin: 0 0 14px 20px;
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
}
.unRepairPartsOne {
  font-size: 14px;
  color: #c0bebe;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.doRepairPartsOne {
  font-size: 14px;
  color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.drop {
  width: 11px;
  height: 1px;
  border-top: solid #d60f16 4px;
  border-radius: 1.5rem;
  margin-top: 5px;
}
.case-view {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: center;
  .case-view-title {
    color: #fefdff;
    font-size: 12px;
    font-weight: 600;
  }
}
.case-view-content {
  color: #fffeff;
  font-size: 12px;
  font-weight: 100;
  margin-top: 10px;
}
.service {
  width: calc(100vw - 40px);
  height: 158px;
  margin: 0 20px;
  display: flex;
  .service-item {
    flex: 1;
    color: #fff;
    position: relative;
    border-radius: 8px;
    font-size: 16px;
    line-height: 16px;
    .service-item-title {
      font-size: 13px;
      font-weight: 600;
      margin-top: 12px;
      margin-left: 12px;
    }
    .service-item-desc {
      font-size: 12px;
      margin-left: 12px;
      margin-top: 4px;
    }
    image {
      position: absolute;
    }
  }
}
.service2 {
  margin: 20px 20px 20px 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .service2-item {
    height: 85px;
    background-color: #f3f3f3;
    border-radius: 8px;
    padding: 10px;
  }
  .service2-item-title {
    font-size: 14px;
    font-weight: 600;
    display: block;
  }
  .service2-item-content {
    font-size: 12px;
  }
  .service2-item-imgBlock {
    float: right;
    margin-top: 10px;
    background-color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    text-align: center;
    position: relative;
  }
  .service2-item-img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .service-coupon {
    // #ifdef MP-WEIXIN
    .service2-item {
      height: 200px;
    }
    .service2-item-imgBlock {
      margin-top: 125px;
    }
    // #endif
  }
}
.slogan {
  background: #f8f8f8;
  padding: 5px 0;
  margin-top: 20px;
  > view {
    height: 50px;
    background: #fff;
    padding: 0 20px;
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
    // .case-top {
    //   width: 140px;
    //   height: 140px;
    //   position: relative;
    //   border-radius: 8px 8px 0 0;
    //   overflow: hidden;
    //   > view {
    //     position: absolute;
    //     left: 0;
    //     bottom: 0;
    //     width: 100%;
    //     height: 50px;
    //     display: flex;
    //     flex-direction: column;
    //     align-items: center;
    //     justify-content: space-evenly;
    //     > text {
    //       color: #fff;
    //       font-size: 12px;
    //       font-weight: 500;
    //     }
    //     > view {
    //       width: 56px;
    //       text-align: center;
    //       height: 15px;
    //       line-height: 15px;
    //       border-radius: 30px;
    //       background: #fff;
    //       font-size: 8px;
    //       font-weight: 500;
    //     }
    //   }
    //   .case-play {
    //     width: 100%;
    //     text-align: center;
    //     top: 17px;
    //     height: 22px;
    //     > view {
    //       color: #fff;
    //       font-size: 12px;
    //       font-weight: 500;
    //       width: 88px;
    //       text-align: center;
    //       height: 22px;
    //       line-height: 22px;
    //       border-radius: 50px;
    //       background: #106cff;
    //     }
    //   }
    // }
    // .case-info {
    //   height: 80px;
    //   display: flex;
    //   flex-direction: column;
    //   justify-content: space-evenly;
    //   .case-title {
    //     padding: 5px;
    //   }
    //   .case-like {
    //     margin-left: 5px;
    //     .case-like-total {
    //       color: #a8a8a8;
    //       margin-left: 5px;
    //     }
    //   }
    // }
  }
}
.housekeepers {
  display: flex;
  margin: 20px;
  overflow-x: auto;
  .housekeeper {
    width: 192px;
    min-width: 192px;
    height: 269px;
    margin-right: 20px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #d9d9d9;
    .housekeeper-top {
      padding: 17px 14px 12px;
      .housekeeper-title {
        color: #fff;
        font-family: Inter;
        font-size: 12px;
        font-weight: 700;
      }
      .housekeeper-part {
        color: #fff;
        font-size: 16px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
      }
    }
    .housekeeper-bottom {
      padding: 15px;
      > view {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .housekeeper-icon {
          width: 16px;
          height: 20px;
          line-height: 16px;
          margin-right: 15px;
          position: relative;
          text-align: center;
          > text {
            color: #fff;
            font-size: 12px;
            font-weight: 700;
          }
        }
        .housekeeper-info {
          .housekeeper-name {
            color: #393838;
            font-size: 12px;
            font-weight: 700;
          }
          .housekeeper-tag {
            color: #393838;
            font-size: 10px;
            font-weight: 700;
          }
        }
        &:last-child {
          margin-bottom: 20px;
        }
      }
    }
  }
}
// .products {
//   margin-bottom: 30px;
//   padding: 0 10px;
//   // display: flex;
//   flex-wrap: wrap;
//   background: #fff;
//   .product {
//     margin: 10px;
//     // width: calc(50% - 20px);
//     box-sizing: border-box;
//     border-radius: 8px;
//     overflow: hidden;
//     box-shadow: 3px 5px 2px 0px rgba(0, 0, 0, 0.08);
//     display: flex;
//     flex-direction: column;
//     .product-info {
//       padding: 10px;
//       color: #393838;
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       justify-content: space-between;
//       .product-title {
//         font-size: 15px;
//         font-weight: 700;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         white-space: nowrap;
//       }
//       .product-desc {
//         color: #d41e1e;
//         font-size: 12px;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         display: -webkit-box;
//         -webkit-line-clamp: 2;
//         line-clamp: 2;
//         -webkit-box-orient: vertical;
//       }
//       .product-area {
//         font-size: 14px;
//       }
//       .product-price {
//         font-size: 14px;
//         font-weight: 600;
//         margin-top: 10px;
//       }
//     }
//   }
// }
.products {
  margin: 20px 20px 30px 20px;
  .product {
    margin: -20px 0 50px 0;
    .product-info-left-name {
      font-size: 14px;
      font-weight: 600;
    }
    .product-info-left-icon {
      background-color: #d60f16;
      border-radius: 4px;
      font-size: 8px;
      color: #ffffff;
      width: 27px;
      height: 12px;
      text-align: center;
      margin-left: 5px;
    }
    .product-info-left-description {
      font-size: 12px;
      margin: 5px 0;
    }
    .product-info-right {
      display: flex;
      .product-info-right-icon {
        font-size: 10px;
        font-weight: 600;
        padding-top: 5px;
      }
      .product-info-right-price {
        font-size: 38px;
        font-weight: 900;
      }
      .product-info-right-applicableArea {
        background-color: #f3f3f3;
        border-radius: 3px;
        font-size: 8px;
      }
      .product-info-right-unit {
        font-size: 10px;
        font-weight: 600;
      }
    }
  }
}
</style>
