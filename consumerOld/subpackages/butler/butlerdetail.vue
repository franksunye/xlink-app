<template>
  <view :class="dialog.show ? 'c-hidden c-h-200rpx' : ''">
    <!-- 管家详情页 -->
    <view class="bg-red">
      <view
        @click.native="navigateBack"
        :style="
          'position:absolute;z-index:1;top:' +
          systemInfo.statusBarHeight +
          'px;left:' +
          systemInfo.menuButtonObject.marginRight +
          'px;height:' +
          systemInfo.navHeight +
          'px;line-height:' +
          systemInfo.navHeight +
          'px;color:#fff;display:flex;align-items:center;font-weight:500;'
        "
      >
        <van-icon name="arrow-left" style="font-size: 20px; margin-right: 5px" />
        <!-- <view @click="navigateBack">
            <text style="font-weight: 600">云店铺</text>
          </view> -->

        <text
          v-if="
            systemInfo.platform == 'ios' ||
            systemInfo.platform == 'mac' ||
            systemInfo.platform == 'devtools'
          "
          :style="
            'width:calc(100vw - ' +
            systemInfo.menuButtonObject.marginRight * 2 +
            'px - 50px);text-align:center'
          "
        >
          管家详情
        </text>
        <text v-else>管家详情</text>
      </view>
    </view>
    <view class="card">
      <view class="c-flex c-flex-between">
        <!-- 照片 -->
        <view style="width: 75px" class="card-top-left">
          <image
            v-if="butlerData.users.profileImg && butlerData.users.profileImg.length > 0"
            :src="butlerData.users.profileImg[0].url"
            mode="widthFix"
            style="width: 100%"
          ></image>
          <image v-else :src="normalImg" mode="widthFix" style="width: 100%"></image>
        </view>
        <!-- 姓名 简介 好评率 -->
        <view class="card-top-right">
          <view>
            <text style="font-weight: 600" class="c-size-16">
              {{ butlerData.users.name || '' }}
            </text>
            <!-- <text class="c-m-l-10" style="font-size: 24rpx;">技术工程师 </text> -->
            <image
              v-if="butlerData.users.badgePhoto && butlerData.users.badgePhoto.length > 0"
              class="c-m-l-10"
              style="width: 60rpx"
              src="../../static/images/IDcard.png"
              mode="widthFix"
              @click="
                openImgDialog(
                  Array.isArray(butlerData.users.badgePhoto) && butlerData.users.badgePhoto[0]
                )
              "
            />
          </view>
          <view>
            <text class="c-size-14 c-c-9">{{ butlerData.users.describe || '' }}</text>
          </view>
          <view>
            <van-icon
              v-for="index of Number(butlerStar)"
              :key="index"
              name="star"
              color="#FFCC5A"
              custom-class="c-size-14 c-m-r-10"
            />
            <text style="color: #0078d0; font-weight: 500" class="c-size-13">
              好评率{{ butlerData.users.highOpinion || '100%' }}
            </text>
          </view>
          <!-- 标签 -->
          <view style="">
            <view
              class="c-flex c-flex-wrap"
              v-if="butlerData.users.tags && butlerData.users.tags.length > 0"
            >
              <view
                v-for="(item, i) in butlerData.users.tags"
                :key="i"
                style="margin: 20rpx 20rpx 0 0"
              >
                <van-tag round color="#E5EFFB" text-color="#0078D0" size="medium">
                  {{ codelabel('select', 'userTag', item) }}
                </van-tag>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 服务 -->
      <view
        class="c-text-center"
        style="display: flex; justify-content: space-between; margin: 15px"
      >
        <view>
          <view style="font-weight: normal" class="c-size-20 c-c-2">
            {{ butlerData.exts.serviceAppointCount || '0' }}
          </view>
          <view class="c-size-13">服务数量(单)</view>
        </view>
        <view>
          <view style="font-weight: normal" class="c-size-20 c-c-2">
            {{ codelabel('select', 'serviceYears', butlerData.users.serviceYears) || '1-2' }}
          </view>
          <view class="c-size-13">服务年限(年)</view>
        </view>
        <view>
          <view style="font-weight: normal" class="c-size-20 c-c-2">
            {{ butlerData.users.score || '0' }}
          </view>
          <view class="c-size-13">服务分</view>
        </view>
      </view>

      <!-- <view>
        <view class="c-size-14 c-m-t-10">
          <text>{{ butlerData.exts.serviceAppointCount || '0' }}单</text>
          <text class="c-c-9">服务数量：</text>
        </view>
        <view class="c-size-14">
          <text>
            {{ codelabel('select', 'serviceYears', butlerData.users.serviceYears) || '1-2年' }}
          </text>
          <text class="c-c-9">服务年限：</text>
        </view>

        <view class="c-size-14 c-m-t-10">
          <text>{{ butlerData.users.score || '0' }}</text>
          <text class="c-c-9">技术服务分：</text>
        </view>
        <van-divider contentPosition="center" custom-style="padding:0 16px;margin:20rpx 0 0">
          <text class="c-size-18 c-bold c-black">技术服务分</text>
        </van-divider>
        <view class="c-text-center" style="line-height: 72rpx">
          <view class="c-bold c-black" style="font-size: 52rpx; margin-top: 8rpx">
            {{ butlerData.users.score || '0' }}
          </view>
        <view class="c-size-14" v-if="butlerData.users.exts && (butlerData.users.exts.rank || butlerData.users.exts.rank == 0)">打败{{ butlerData.users.exts?butlerData.users.exts && butlerData.users.exts.rank:'0' }} 的管家</view>
        <view class="c-flex c-flex-center" style="color: #9E9E9E;">
          <text>什么是技术服务分</text>
          <van-icon name="question" color="#ccc" />
          <text style="margin-left: 20rpx;">查看详情</text>
        </view>
        <view class="c-size-14" style="line-height: 42rpx;margin-top: 8rpx;">按照表现得分从高到低划分为：五星、四星、三星、二星、一星5个等级</view>
        </view>
      </view> -->
      <!-- 门店 -->
      <view>
        <van-divider borderColor="#EAEAEA" />
        <van-cell
          custom-class="cell-store"
          is-link
          :clickable="false"
          @click="
            open('../../subpackages/store/storeDetail', {
              partnerId: butlerData.users.partnerIds[0],
              type: params.tgType
            })
          "
        >
          <view slot="title" style="padding: 0">
            <view class="van-cell-text">
              <text style="font-size: 16px; margin-right: 15rpx; font-weight: 600">
                {{ butlerData.users.partnerName || '' }}
              </text>
            </view>
            <view class="van-cell-text" style="width: 270px; font-size: 14px">
              {{
                butlerData.users.exts ? butlerData.users.exts && butlerData.users.exts.address : ''
              }}
            </view>
          </view>
        </van-cell>
      </view>
    </view>

    <!-- 客户评价 -->
    <view style="padding: 0 5vw; margin-top: 150px">
      <view class="c-flex c-flex-between c-item-center">
        <view>
          <text style="font-weight: 600; color: #41414d" class="c-size-16 c-m-r-5">客户评价</text>
          <!-- {{ butlerStar || '5.0' }}分 |  -->
          <text v-if="custEval.data && custEval.data.length > 0">
            （共{{ custEval.data.length || 0 }}个）
          </text>
        </view>
        <view
          v-if="custEval.data && custEval.data.length > 0"
          style="color: #9e9e9e"
          class="c-flex"
          @click="
            open('../../subpackages/butler/customerReviews', {
              userId: butlerData.users._id
            })
          "
        >
          <text>查看全部</text>
          <van-icon name="arrow" />
        </view>
      </view>
      <view class="custEvalCont c-size-14">
        <van-tabs :active="activeTab" @change="tabChange" sticky v-if="false">
          <block>
            <van-tab
              :title="item.name + '(' + item.number + ')'"
              :name="item.value"
              v-for="(item, index) in tabList"
              :key="index"
            ></van-tab>
          </block>
        </van-tabs>
        <view>
          <scroll-view
            :scroll-top="scrollTop"
            scroll-y="true"
            style="height: 100%"
            class="scroll-Y"
            @scrolltoupper="upper"
            @scrolltolower="lower"
            @scroll="scroll"
          >
            <van-empty v-if="!custEval.total" description="还没有评论!" />
            <block v-for="(item, i) in custEval.data" :key="i">
              <view class="uni-bg-red custEvalItem" v-if="i < 2">
                <view class="">
                  <view class="c-flex c-flex-between c-padul-10">
                    <view class="custEvalItemL c-size-18 c-m-r-10">
                      <van-icon
                        v-for="index of item.rate"
                        :key="index"
                        name="star"
                        color="#f7c85b"
                      />
                      <van-icon
                        v-for="index of 5 - item.rate"
                        :key="index"
                        name="star"
                        color="#ccc"
                      />
                    </view>
                    <view class="custEvalItemR fcol-cf999">
                      <!-- <text>{{ item.leakagesite }}</text> -->
                      <text>
                        {{
                          codelabel('cascade', 'repairParts', item.leakagesite, null, {
                            multiple: true
                          })
                        }}
                      </text>
                    </view>
                  </view>
                  <view class="c-padul-10">
                    <view style="margin-bottom: 15rpx">
                      {{ item.memo || '暂无评价' }}
                    </view>
                    <view class="c-flex c-flex-between" v-if="Array.isArray(item.image)">
                      <view
                        :style="'width: ' + viewWidth + 'px;' + 'height:' + viewWidth + 'px;'"
                        v-for="(imgItem, index) in item.image"
                        :key="index"
                      >
                        <image
                          class="commentImage"
                          mode="cover"
                          :src="imgItem.url"
                          @click="openImgDialog(imgItem)"
                        ></image>
                      </view>
                    </view>
                  </view>
                  <view class="c-flex c-flex-between c-padul-10">
                    <view class="custEvalItemL fcol-cf999">
                      <text>
                        {{
                          item.phone.substr(0, 3) +
                          item.phone.substr(3).replace(item.phone.substr(3, 4), '****')
                        }}
                      </text>
                    </view>
                    <view class="custEvalItemR fcol-cf999">
                      <text>{{ item.createTime }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </scroll-view>
        </view>
      </view>
    </view>
    <!-- 维修案例 -->
    <!-- <view style="padding: 5vw 5vw 0">
        <view class="c-size-20 c-bold c-m-r-5">维修案例</view>
        <view class="c-table" v-if="document.data && document.data.length > 0">
          <view class="c-th">
            <view class="c-td">客户姓名</view>
            <view class="c-td">维修部位</view>
            <view class="c-td">维修面积</view>
          </view>
          <view
            v-for="(item, i) in document.data"
            :key="i"
            class="c-tr"
            @click="open('document', { id: item._id })"
          >
            <view class="c-td">
              {{ item.exts.name ? item.exts.name.replace(item.exts.name.substr(1), '**') : '' }}
            </view>
            <view class="c-td">
              {{
                codelabel('cascade', 'repairParts', item.attribute, null, {
                  multiple: true
                })
              }}
            </view>
            <view class="c-td">{{ item.exts.areaNum || '' }}</view>
            <van-icon name="arrow" color="#676767" />
          </view>
        </view>
        <van-empty v-else description="还没有上传维修案例!" />
      </view> -->

    <!-- 底部按钮群 -->
    <view class="bottBtns c-flex c-flex-around c-item-center">
      <view class="toShare" @click="toShare">
        <view class="toShareImgWrap">
          <image src="../../static/images/share2.png" mode="widthFix"></image>
        </view>
        <view class="c-text-center">
          <text style="font-size: 10px; color: #707070">分享</text>
        </view>
      </view>

      <view
        v-if="params.from == 'butler'"
        style="background: #0078d0"
        class="bottomBtnWrap corred c-flex c-flex-center"
        @click="
          open(
            '../../pages/declaration/declaration' +
              '?serviceResourceId=' +
              params.serviceResourceId,
            {
              fromChannel: '60,6040,6040040',
              shareUserId: params.shareUserId || ''
            }
          )
        "
      >
        立即预约
      </view>
      <view
        v-else-if="params.from == 'store'"
        style="background: #0078d0"
        class="bottomBtnWrap corred c-flex c-flex-center"
        @click="
          open(
            '../../pages/declaration/declaration' +
              '?serviceResourceId=' +
              params.serviceResourceId,
            {
              fromChannel: '60,6040,6040030',
              shareUserId: params.shareUserId || ''
            }
          )
        "
      >
        立即预约
      </view>
      <view
        v-else
        class="bottomBtnWrap corred c-flex c-flex-center"
        style="background: #0078d0"
        @click="
          open(
            '../../pages/declaration/declaration' +
              '?serviceResourceId=' +
              params.serviceResourceId,
            {
              shareUserId: params.shareUserId || '',
              channelId: params.channelId || ''
            }
          )
        "
      >
        立即预约
      </view>

      <view
        v-if="butlerData.users.phone && butlerData.workType != -1"
        class="bottomBtnWrap corgreen c-flex c-flex-center"
        style="background: #f9c10c"
        @click="makeCall(butlerData.users.phone)"
      >
        咨询管家
      </view>
      <!-- type=2:c端客户联系管家 type=7:联系管家转到内勤 -->
      <view
        v-else-if="butlerData.workType != -1"
        style="background: #f9c10c"
        class="bottomBtnWrap corgreen c-flex c-flex-center"
        @click="call('7', null, butlerData.users._id, null)"
      >
        咨询管家
      </view>
    </view>

    <!-- 查看大图 -->
    <van-popup
      closeable
      custom-style="height:100%;background: #000;z-index: 999;width: 100%;"
      :show="imgDialog.show"
      @close="imgDialog.show = false"
    >
      <view class="c-w" style="height: 100%; display: flex; align-items: center">
        <image
          style="min-width: 100%"
          :src="imgDialog.data"
          mode="widthFix"
          @click="imgDialog.show = false"
        ></image>
      </view>
    </van-popup>

    <!-- 分享面板 -->
    <van-action-sheet
      @close="showShare = false"
      @cancel="showShare = false"
      cancel-text="取消"
      :title="butlerData.tenantId == '1340835581184723420' ? '推荐管家赚佣金' : '推荐分享'"
      :show="showShare"
      :overlay="false"
    >
      <view class="shareBox">
        <view class="shareBox-wrapper" style="flex: 2">
          <button open-type="share" @click="showShare = false">
            <!-- <van-icon name="friends" size="30" color="#fff" /> -->
            <image
              style="width: 80rpx; height: 80rpx"
              src="../../static/images/wechat.png"
              mode=""
            ></image>
            <view style="margin-left: 15rpx; color: #fff">分享到微信</view>
          </button>
        </view>
        <van-button
          v-if="butlerData.tenantId == '1340835581184723420'"
          type="warning"
          @click="goWallet"
        >
          佣金
        </van-button>
      </view>
    </van-action-sheet>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      document: {
        data: []
      },
      porjectList: [],
      activeTab: '',
      tabList: [],
      custEval: {},
      scrollTop: 0,
      old: {
        scrollTop: 0
      },
      dialog: {
        show: false,
        data: ''
      },
      imgDialog: {
        show: false,
        data: ''
      },
      butlerId: '',
      butlerData: {
        users: {
          partnerIds: []
        }
      },
      butlerStar: '5',
      initParams: {}, //页面初始参数
      params: {}, //页面参数
      normalImg: '',
      userinfo: {}, //user对象
      showShare: false, //分享面板
      options: {
        codecfg_score: {
          codeId: 'score'
        },
        codecfg_userTag: {
          codeId: 'userTag'
        },
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        },
        codecfg_serviceYears: {
          codeId: 'serviceYears'
        }
      },
      viewWidth: 0, //屏幕宽度
      systemInfo: {
        menuButtonObject: {}
      }
    };
  },
  onLoad: function (params) {
    this.doInit(params);
    this.systemInfo = app.globalData.systemInfo;
    console.log(this.systemInfo, '---this.systemInfo');
  },
  //设置分享的参数
  onShareAppMessage: function (res) {
    console.log(
      `../../subpackages/butler/butlerdetail?shareType=1&shareTypeId=${this.butlerData.users.partnerIds[0]}&shareUserId=${this.userinfo._id}&serviceResourceId=${this.params.serviceResourceId}`
    );
    return {
      title: this.butlerData.users.name,
      path: `subpackages/butler/butlerdetail?shareType=1&shareTypeId=${this.butlerData.users.partnerIds[0]}&shareUserId=${this.userinfo._id}&serviceResourceId=${this.params.serviceResourceId}` //这里是被分享的人点击进来之后的页面
      // imageUrl: '../../images/icon-logo.png'//这里是图片的路径
    };
  },
  onShow: function () {
    common.osg.init(this, {}, app);
  },
  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    doInit(params) {
      // 保存初始参数 跳转到授权页携带 授权后返回此页面时携带
      this.initParams = common.osg.deepCopy(params);
      console.log('initParams', this.initParams);

      this.viewWidth = ((wx.getSystemInfoSync().windowWidth * 0.9) / 2).toFixed(2) - 4;
      console.log(this.viewWidth);
      this.normalImg = common.osg.butlerNorImg;
      // 扫二维码进入小程序 处理参数风格统一
      if (params.q) {
        var url = decodeURIComponent(params.q);
        // 截取所有参数放到this.params
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
      }
      this.params = params;
      common.osg.init(this, params, app);
      this.userinfo = common.osg.currentUser();

      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage']
      });
      if (!common.osg.isLogined()) {
        common.osg.doLogin(
          {
            shareType: this.params.shareType,
            shareTypeId: this.params.shareTypeId,
            allotOrgId: this.params.allotOrgId,
            shareUserId: this.params.shareUserId,
            channelId: this.params.channelId
          },
          () => {
            common.osg.codeoption(() => {
              // 获取服务资源详情
              this.getData(() => {
                this.getCustEvalData(this.butlerData.users._id, true);
                this.getInitCustEvalData(this.butlerData.users._id, true); //初始化tabs
                this.getDocuments();
              });
              // this.getProjectData(); //施工案例
            });
          }
        );
      } else {
        common.osg.codeoption(() => {
          // 获取服务资源详情
          this.getData(() => {
            this.getCustEvalData(this.butlerData.users._id, true);
            this.getInitCustEvalData(this.butlerData.users._id, true); //初始化tabs
            this.getDocuments();
          });
          // this.getProjectData(); //施工案例
        });
      }
    },
    tabChange(e) {
      this.activeTab = e.detail.name;
      this.getCustEvalData(this.butlerData.users._id, true);
    },
    scroll: function (e) {
      this.old.scrollTop = e.detail.scrollTop;
    },
    lower: function (e) {
      if (this.custEval.rows >= this.custEval.total) {
        common.osg.toast('没有更多数据', 'none');
        return;
      }
      this.getCustEvalData(this.butlerData.users._id, false);
      console.log('lower', e);
    },
    upper: function (e) {
      console.log('upper', e);
    },
    open(url, params, options) {
      if (url.indexOf('declaration/declaration') != -1) {
        var u = common.osg.currentUser();
        if (u && u._id && u.nickname && u.phone) {
          common.osg.open(url, params, options);
        } else {
          common.osg.confirm('请先授权用户信息', () => {
            common.osg.open(
              '../../subpackages/authorize/authorize',
              Object.assign(this.initParams, { url: '../../subpackages/store/storeDetail' }),
              {
                mode: 'redirect'
              }
            );
          });
        }
      } else {
        common.osg.open(url, params, options);
      }
    },
    call(type, callerId, calleeId, sid) {
      var u = common.osg.currentUser();
      if (u && u._id && u.nickname && u.phone) {
        common.osg.ajax(
          'basic/winnerlook/getMiddleNumber',
          {
            type,
            callerId: callerId || common.osg.currentUser()._id,
            calleeId: calleeId || '',
            sid: sid || ''
          },
          res => {
            this.makeCall(res.data.phoneNumberX);
          }
        );
      } else {
        common.osg.confirm('请先授权用户信息', () => {
          common.osg.open(
            '../../subpackages/authorize/authorize',
            Object.assign(this.initParams, { url: '../../subpackages/butler/butlerdetail' }),
            {
              mode: 'redirect'
            }
          );
        });
      }
    },
    makeCall(phoneNumber) {
      var u = common.osg.currentUser();
      if (u && u._id && u.nickname && u.phone) {
        wx.makePhoneCall({
          phoneNumber: phoneNumber
        });
      } else {
        common.osg.confirm('请先授权用户信息', () => {
          common.osg.open(
            '../../subpackages/authorize/authorize',
            Object.assign(this.initParams, { url: '../../subpackages/butler/butlerdetail' }),
            {
              mode: 'redirect'
            }
          );
        });
      }
    },
    // 获取管家详情
    getData(callback) {
      // console.log(this.params.serviceResourceId, 'this.params.serviceResourceId');
      common.osg.ajax('parnter/queryHouseKeeperById/' + this.params.serviceResourceId, {}, res => {
        if (res.entity != null && res.entity != undefined && res.entity.users != undefined) {
          this.butlerStar = res.entity.users.level == undefined ? '5' : res.entity.users.level;
        }
        // 解析照片
        if (res.entity.users.profileImg)
          res.entity.users.profileImg = this.renderUserImg(res.entity.users.profileImg);
        if (res.entity.users.badgePhoto)
          res.entity.users.badgePhoto = this.renderUserImg(res.entity.users.badgePhoto);

        this.butlerData = res.entity;
        // 通过分享进入管家页
        if (this.butlerData.tenantId != '1340835581184723420') {
          this.params.tgType = 'tgx'; //小微门店管家 返回所属门店
          if (!this.params.from) {
            wx.hideHomeButton();
            // 小微门店管家 首页跳转到小微门店
            wx.setStorageSync('shareParams', {
              type: 'tgx',
              partnerId: res.entity.users.partnerIds[0]
            });
          }
        }

        if (callback) callback();
      });
    },
    //分享按钮
    toShare() {
      this.showShare = true;
    },
    goWallet() {
      this.showShare = false;
      common.osg.open('../../subpackages/wallet/wallet');
    },
    getDocuments() {
      common.osg.ajax(
        'document/query.do',
        {
          'is:exts.supervisorId|string#and': this.butlerData.users._id,
          page: 1,
          rows: 20,
          'is:state|integer#and': 1,
          'is:type|integer#and': '4',
          sortField: 'createTime',
          sortOrder: 'desc'
        },
        res => {
          res.data.map(item => {
            item.exts = item.exts || {};
          });
          this.document = res;
        },
        {
          noload: true
        }
      );
    },
    onReachBottom() {
      this.document.rows = !this.document.rows ? 5 : this.document.rows + 10;
      this.getDocuments();
    },
    // 获取案例详情先用静态数据
    getProjectData() {
      common.osg.ajax(
        'document/query.do',
        {
          'is:type|integer#and': '4',
          sortField: 'isTop',
          sortOrder: 'desc'
        },
        res => {
          this.porjectList = res.data.map(item => {
            item.imageUrl = item.fileids ? common.osg.downloadUrl + item.fileids[0] : '';
            return item;
          });
        }
      );
      // this.porjectList = [
      //   // {
      //   //   imageUrl: 'https://pub.fsgo365.cn/3556826550299310791.jpg',
      //   //   desc: '朝阳区瑞新里小区',
      //   //   imageDetail: 'https://pub.fsgo365.cn/5155905875712914808.jpg'
      //   // },
      //   {
      //     imageUrl: 'https://pub.fsgo365.cn/4814890596860148978.jpg',
      //     desc: '卫生间吊顶板缝滴水治理',
      //     imageDetail: 'https://pub.fsgo365.cn/8375716089073582421.jpg'
      //   },
      //   {
      //     imageUrl: 'https://pub.fsgo365.cn/4254538912039481451.jpg',
      //     desc: '沥青瓦屋面渗漏施工',
      //     imageDetail: 'https://pub.fsgo365.cn/467219771344371952.jpg'
      //   },
      //   {
      //     imageUrl: 'https://pub.fsgo365.cn/2136587564801831458.jpg',
      //     desc: '卫生间门口木地板处理',
      //     imageDetail: 'https://pub.fsgo365.cn/5753193875062832116.jpg'
      //   },
      //   {
      //     imageUrl: 'https://pub.fsgo365.cn/2324857400615258411.jpg',
      //     desc: '屋檐角落滴水治理',
      //     imageDetail: 'https://pub.fsgo365.cn/49015235996793259.jpg'
      //   },
      //   {
      //     imageUrl: 'https://pub.fsgo365.cn/5310889397227176350.jpg',
      //     desc: '阳光房室内墙面维护',
      //     imageDetail: 'https://pub.fsgo365.cn/2098291388268787450.jpg'
      //   }
      // ];
    },
    //解析图片
    renderUserImg(imgData) {
      if (imgData) {
        if (common.osg.isJson(imgData)) {
          imgData = JSON.parse(imgData);
        }
      } else {
        imgData = [];
      }
      return imgData;
    },
    /**
     * 工程详情弹出框
     */
    openDialog(rows) {
      console.log(rows);
      if (!rows || rows.length == 0) {
        common.osg.toast('暂无数据');
      }

      let imgStr = `<img style="width:${wx.getSystemInfoSync().windowWidth - 20}px;"`;
      this.dialog.data = rows.content.replace(/<img/g, imgStr);

      // 静态资源
      // this.dialog.data = `<img style="width:${wx.getSystemInfoSync().windowWidth - 20}px;" src="${
      //   rows.imageDetail
      // }"></img>`;

      this.dialog.show = true;
    },
    /**
     * 查看图片
     */
    openImgDialog(imgData) {
      if (imgData.url) {
        this.imgDialog.data = imgData.url;
        this.imgDialog.show = true;
      } else {
        common.osg.toast('暂无证件图片!', 'none');
      }
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
    },
    // // 上拉加载
    // onReachBottom: function () {
    //   if (this.custEval.rows >= this.custEval.total) {
    //     common.osg.toast('没有更多数据', 'none');
    //     return;
    //   }
    //   this.getCustEvalData(this.butlerData.users._id, false);
    // },
    //初始化客户评价的tabs
    getInitCustEvalData(userId) {
      common.osg.ajax(
        'evaluation/query.do',
        {
          supervisorId: userId,
          _all: '1'
        },
        res => {
          this.tabList = this.options.score
            .sort((a, b) => b.value.length - a.value.length)
            .map(item => {
              item.number = 0;
              res.data.forEach(cItem => {
                if (item.value.indexOf(cItem.rate) != -1) item.number = +item.number + 1;
              });
              return item;
            });
          this.activeTab = this.activeTab || this.tabList[0].value;
        }
      );

      // this.tabList = this.options.score
      //   .sort((a, b) => b.value.length - a.value.length)
      //   .map(item => {
      //     item.number = 0;
      //     this.custEval.data.forEach(cItem => {
      //       if (item.value.indexOf(cItem.rate) != -1) item.number = +item.number + 1;
      //     });
      //     return item;
      //   });
      // this.activeTab = this.activeTab || this.tabList[0].value;
    },
    // 获取客户评价
    getCustEvalData(userId, isIndex) {
      if (isIndex) {
        this.custEval.rows = 10;
      } else {
        this.custEval.rows = this.custEval.rows + 10;
      }
      common.osg.ajax(
        'evaluation/query.do',
        {
          supervisorId: userId,
          'in:rate|array-integer#and': this.activeTab,
          // rate:'1',
          rows: this.custEval.rows
        },
        res => {
          this.custEval = res;
        }
      );
    }
  }
};
</script>

<style lang="scss">
page {
  background: #fff;
}
.container {
  padding-bottom: 130rpx;
}

.bg-red {
  width: 100vw;
  height: 25vh;
  background: #067cd2;
  position: absolute;
  top: 0;
  left: 0;
}

image {
  max-width: 100%;
  display: inline-block;
  position: relative;
  z-index: 0;
}

.card {
  /* width: 100%; */
  width: 90vw;
  margin: 5vw auto;
  padding: 3vw;
  box-sizing: border-box;
  background: #ffffff;
  // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10rpx;
  position: relative;
  top: 120px;
}

.card-top-left {
  width: 25vw;
  height: 25vw;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  /* align-items: center;
  justify-content: center; */
}

.card-top-right {
  flex: 1;
  padding-left: 3vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  > view {
    display: flex;
    align-items: center;
  }
}

.rowOneScore {
  border-radius: 12px;
  background: #ffcbcf;
  padding: 2px 20rpx;
  height: 20px;
}

.rowOneScoreKey {
  border-radius: 10px 0 0 10px;
  background: #ffff;
  width: 40px;
  text-align: center;
}

.rowOneScoreNum {
  margin-left: 5px;
  color: red;
  font-weight: bold;
}

.c-padul-10 {
  padding: 10rpx 0;
}

.porjectListCont {
  margin-top: 20rpx;
}

.porjectOne {
  width: 40%;
  border-radius: 20rpx;
  position: relative;
  margin-left: 10px;
}

.porjectOneDesc {
  position: absolute;
  bottom: 0;
  background: #dbdbe1;
  width: 100%;
  padding: 10rpx 0;
  opacity: 0.6;
}

.scroll-view_H {
  white-space: nowrap;
}

.scroll-view-item_H {
  display: inline-block;
}

.porjectList {
  margin-bottom: 130rpx;
}

.custEvalCont {
  background: #ffffff;
}

.c-border-rad20 {
  border-radius: 20rpx;
}

.showMoreProject {
  padding: 20rpx 0;
}

.custEvalItem {
  border-bottom: 1px solid #f1f1f1;
}

.fcol-cf999 {
  color: #676767;
}

.bottBtns {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #f2f2f2;
  height: 130rpx;
  z-index: 9;
  background: #ffffff;
}

.bottomBtnWrap {
  width: 35%;
  color: #ffffff;
  border-radius: 45px;
  height: 38px;
  font-size: 18px;
  line-height: 38px;
  font-weight: 400;
}

.corred {
  background: #ff3a3a;
}

.corgreen {
  background: #56ba5d;
}

.porjectOneImg {
  padding: 0 !important;
}

.toShare {
  width: 15%;
}

.toShareImgWrap {
  margin: auto;
  width: 18.5px;
}

/* 分享面板 */
.shareBox {
  padding: 20rpx;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}

.shareBox-wrapper {
  margin-right: 30rpx;
}

.shareBox-wrapper button::after {
  border: none;
}

.shareBox-wrapper button {
  /* height: 80rpx; */
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #07c160;
}

.commentImage {
  border-radius: 20rpx;
  width: 100%;
  height: 100%;
}
.c-h-200rpx {
  height: 200rpx;
}

.c-table {
  font-size: 14px;
}
.c-th,
.c-tr {
  display: flex;
  border-bottom: 1px solid #f1f1f1;
  min-height: 30px;
}
.c-th .c-td {
  text-align: center;
}
.c-td {
  width: 33%;
  box-sizing: border-box;
  line-height: 35px;
  text-align: center;
}
.c-tr .c-td {
  font-size: 12px;
}
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
  // text-indent: 2vw;
}
.cell-store .van-cell__title {
  width: 100%;
}
</style>
