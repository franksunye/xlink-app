<template>
	<view class="index container" @click="doPositionBtnShow(1)" :style="'height:' + systemInfo.screenHeight + 'px;'">
		<movable-area style="height: 100%; width: 100%">
			<!-- <movable-view
        @click.stop="doPositionBtnShow(2)"
        class="levitateBall"
        style="display: flex"
        :y="bannerHeight"
        :x="movableViewX"
        direction="all"
        out-of-bounds
      > -->
			<!-- <view class="postionTest">
          <view v-if="positionChecked">开启定位</view>
          <view v-else>关闭定位</view>
        </view> -->

			<!-- <view>
          <view v-if="positionChecked" class="c-flex">
            <image style="width: 30px" mode="widthFix" src="../../static/images/positionIcon.png" />

            <van-button
              v-if="positionBtnShow"
              class="positionBtn"
              round
              type="info"
              @click="positionBtnClk()"
            >
              关闭定位
            </van-button>
          </view>
          <view v-else class="c-flex">
            <van-icon size="30px" name="clear" />
            <van-button
              v-if="positionBtnShow"
              class="positionBtn"
              round
              type="info"
              @click="positionBtnClk()"
            >
              开启定位
            </van-button>
          </view>
        </view> -->
			<!-- <view class="postionSwitch">
          <van-switch
            active-color="#106cff"
            inactive-color="#dcdee0"
            :checked="positionChecked"
            @change="positionChange"
          />
        </view> -->
			<!-- </movable-view> -->

			<!-- <view
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
        <text
          v-if="
            systemInfo.platform == 'ios' ||
            systemInfo.platform == 'mac' ||
            systemInfo.platform == 'devtools'
          "
          :style="
            'width:calc(100vw - ' +
            systemInfo.menuButtonObject.marginRight * 2 +
            'px);text-align:center'
          "
        >
          修链科技丨修链帮帮
        </text>
        <text v-else>修链科技丨修链帮帮</text>
      </view> -->
			<view style="background: #f9f9f9; display: flex; flex-direction: column; height: 100vh">
				<!-- 轮播图 -->
				<!-- :indicator-dots="
          notice.data.filter(item => item.isTop && item.fileids && item.fileids[0]).length > 1
        " -->
				<!-- :style="'height:' + bannerHeight" -->
				<swiper
					v-if="notice.data.length > 0"
					autoplay="true"
					:interval="4000"
					:duration="500"
					:style="'border-radius:' + '0 0 6% 6%' + ';height:' + bannerHeight"
					circular
				>
					<block v-for="(item, index) in notice.data" :key="index">
						<swiper-item v-if="item.isTop && item.fileids && item.fileids[0]" @click="toNotice(item)">
							<image
								:src="downloadUrl + '' + item.fileids[0]"
								mode="widthFix"
								@load="getHeight"
								:data-id="item._id"
							></image>
						</swiper-item>
					</block>
				</swiper>
				<view
					@click="doOpen('../declaration/declaration', '', {}, 'login')"
					class="declarationBtn"
					:style="'top:' + declarationBtnHeight + 'px;left:20px;'"
				>
					<view>代客下单</view>
					<view class="declarationBtnIcon">
						<van-icon name="arrow" />
						<!-- <view class="triangle"></view> -->
					</view>
				</view>
				<!-- <view class="donghua" style="width: 50px; height: 50px; background-color: blue">111</view> -->
				<!-- 公告 -->
				<!-- <view class="notice">
          <van-icon name="info-o" style="margin-left: 10px; margin-right: 10px" />
          <text>{{ (notice.data[0] && notice.data[0].title) || '' }}</text>
        </view> -->
				<!-- <van-notice-bar
        v-if="notice.data.length > 0"
        scrollable
        left-icon="bullhorn-o"
        :text="notice.data[noticeIndex].title"
        @click="toNotice(notice.data[noticeIndex])"
        custom-class="c-notice-bar"
      >
        <view
          slot="right-icon"
          class="c-notice-bar__right-icon"
          @click.native.stop="doOpen('/subpackages/noticeManage/noticeManage')"
        >
          <text>全部</text>
          <van-icon name="arrow" />
        </view>
      </van-notice-bar> -->
				<!-- <view class="line-top"></view> -->

				<!-- <view class="grid" v-if="promoterLevel && isLogined">
          <van-grid column-num="5" custom-class="c-grid" :border="false">
            <van-grid-item use-slot link-type="navigateTo" style="height: 90px">
              <image
                mode="widthFix"
                style="width: 29px"
                src="../../static/images/daikexiadan.png"
                @click="doOpen('../declaration/declaration', '', { mode: 'switchTab' }, 'login')"
              />
              <text class="gridText">代客下单</text>
            </van-grid-item>
            <van-grid-item use-slot link-type="navigateTo" style="height: 90px">
              <image
                mode="widthFix"
                style="width: 32px"
                src="../../static/images/kuaisufenxiang.png"
                @click="doOpen('../../subpackages/sharing/quickSharing', '', {}, 'login')"
              />
              <text class="gridText">快速分享</text>
            </van-grid-item>
            <van-grid-item
              use-slot
              link-type="navigateTo"
              style="height: 90px"
              @click="doOpen('../../pages/income/source', '', { mode: 'switchTab' }, 'login')"
            >
              <image
                mode="widthFix"
                style="width: 36px"
                src="../../static/images/jinxuansucai.png"
              />
              <text class="gridText">精选素材</text>
            </van-grid-item>
            <van-grid-item
              use-slot
              link-type="navigateTo"
              style="height: 90px"
              @click="doOpen('../../subpackages/study/courses', '', {}, 'login')"
            >
              <image
                mode="widthFix"
                style="width: 42px"
                src="../../static/images/tuiguangketang.png"
              />
              <text class="gridText">推广课堂</text>
            </van-grid-item>
            <van-grid-item
              use-slot
              link-type="navigateTo"
              style="height: 90px"
              @click="doOpen('../../subpackages/good/allGood', '', '', 'login')"
            >
              <image
                mode="widthFix"
                style="width: 30px"
                src="../../static/images/quanbushangpin.png"
              />
              <text class="gridText">全部商品</text>
            </van-grid-item> -->
				<!-- <block v-for="(item, index) in gridPart" :key="index">
          <van-grid-item
            @click="doOpen('/pages/index/indexWares', item)"
            :icon="item.imageUrl"
            :text="item.name"
          >
          </van-grid-item>
        </block> -->
				<!-- </van-grid>
        </view> -->

				<!-- <view>
          <movable-area style="height: 200px; width: 100%">
          <movable-view
            style="width: 30px; height: 30px; background-color: #f03a23"
            direction="all"
            out-of-bounds
          >
            块
          </movable-view>
        </movable-area>
          <view @click="start()">开启</view>
        <view @click="end()">关闭</view>
        </view> -->
				<view class="gridBlock" v-if="promoterLevel && isLogined">
					<view>
						<button plain="true" open-type="share" style="background-color: #f9f9f9">
							<view class="imgBlock" style="margin-bottom: -2px">
								<image mode="widthFix" style="width: 29px" src="../../static/images/daikexiadan.svg" />
							</view>

							<text class="gridText">分享链接</text>
						</button>
						<!-- <image
                mode="widthFix"
                style="width: 29px"
                src="../../static/images/daikexiadan.svg"
              /> -->
						<view>
							<!-- <text class="gridText">分享链接</text> -->
						</view>
					</view>
					<view>
						<view class="imgBlock">
							<image
								mode="widthFix"
								style="width: 25px"
								src="../../static/images/poster.svg"
								@click="doOpen('../../subpackages/sharing/quickSharing', '', {}, 'login')"
							/>
						</view>
						<view>
							<text class="gridText">分享海报</text>
						</view>
					</view>
					<view>
						<view class="imgBlock">
							<image
								mode="widthFix"
								style="width: 29px"
								src="../../static/images/promotingClassroom.svg"
								@click="doOpen('../../subpackages/study/courses', '', {}, 'login')"
							/>
						</view>
						<view>
							<text class="gridText">推广课堂</text>
						</view>
					</view>
				</view>

				<!-- 今日值得推 -->
				<!-- <view class="pushBlock" v-if="promoterLevel && isLogined">
          <view class="title">
            <text>今日值得推</text>
          </view>
          <view class="icon">
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
				<!-- <view v-for="(item, index) in activityDefData" :key="index">
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
                  <text style="color: #000; font-size: 14px; font-weight: 500">
                    {{ item.name }}
                  </text>
                </view>
                <view style="padding: 5px 0">
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
                        {{ item.exts.goodsPrice || '' }}
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
                        "
                      >
                        {{ item.exts.goodsTitle || '' }}¥{{ item.exts.initialGoodPrice || '' }}
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
                    <text
                      style="color: #fff; font-size: 11px; font-weight: 400; padding-right: 3px"
                    >
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
          </view> -->
				<!-- </view> -->
				<view v-else style="overflow-y: scroll; flex: 1">
					<view v-if="!isLogined">
						<!-- <van-empty description="请先登录后再查看功能菜单"> -->
						<view class="loginBtn">
							<van-button round @click="doOpen('/subpackages/authorize/authorize')">登 录</van-button>
						</view>
						<!-- </van-empty> -->
					</view>
					<view v-if="!promoterLevel" style="margin: 10px 0">
						<view class="unauthorized">
							<view class="unauthorizedTitle">您暂未取得认证</view>
							<view class="unauthorizedTitle">认证修链帮帮获得以下权益：</view>
							<view class="unauthorizedConter">精准获取爆品速递</view>
							<view class="unauthorizedConter">「有效线索」获取推客佣金</view>
							<view class="unauthorizedConter">「完成交付」获取提成佣金</view>
						</view>
						<view class="unauthorizedBtn">
							<van-button @click="doOpen('../../subpackages/orgUser/userT')">点击即刻认证</van-button>
						</view>
					</view>
				</view>

				<!-- 功能导航 -->
				<!-- 热门活动 -->
				<!-- <view @click="doOpen('/subpackages/activities/activityThemes')" style="margin: 10px">
        <image
          v-if="isLogined"
          style="width: 100%"
          src="../../static/images/index/activity.png"
          mode="widthFix"
        />
      </view> -->
				<!-- 待客下单 -->
				<!-- <view style="display: flex">
        <view style="width: 50%; margin: 0 5px 0px 10px">
          <image
            mode="widthFix"
            v-if="isLogined"
            style="width: 100%"
            src="../../static/images/index/daikexiadan.png"
          />
        </view>
        <view style="width: 50%; margin: 0px 10px 0px 5px">
          <view @click="doOpen('/subpackages/activities/activity')">
            <image
              mode="widthFix"
              v-if="isLogined"
              style="width: 100%"
              src="../../static/images/index/chuangjianhuodong.png"
            />
          </view>
          <view @click="doOpen('/subpackages/activities/activitys')">
            <image
              mode="widthFix"
              v-if="isLogined"
              style="width: 100%"
              src="../../static/images/index/hiabaofenxiang.png"
            />
          </view>
        </view>
      </view> -->
				<!-- <view style="display: flex">
        <image
          v-if="isLogined"
          style="width: 50%; margin: 10px 5px 10px 10px"
          mode="widthFix"
          src="../../static/images/index/shouche.png"
        />
        <image
          v-if="isLogined"
          style="width: 50%; margin: 10px 10px 10px 5px"
          mode="widthFix"
          src="../../static/images/index/changjianwenti.png"
        />
      </view> -->
				<!-- <van-image
        v-if="isLogined && notice.data.length > 0"
        width="100%"
        custom-class="c-banner-bottom"
        fit="widthFix"
        src="https://pub.fsgo365.cn/banner-bottom.png"
        @click="toNotice(notice.data[noticeIndex])"
      /> -->
			</view>
		</movable-area>
	</view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
	data() {
		return {
			params: {},
			isLogined: false,
			downloadUrl: common.osg.downloadUrl,
			notice: {
				data: []
			},
			noticeIndex: 0,
			functionList: [],
			funtionCount: {},
			bannerHeight: '',
			options: {
				codecfg_modules: { codeId: 'modules' },
				codecfg_activityDefTag: { codeId: 'activityDefTag' },
				modules: []
			},
			formData: { modules: [] },
			dialogShow: false, //开通提示
			systemInfo: {
				menuButtonObject: {}
			},
			newMessageCount: 0, //未读消息数量
			userPhone: '',
			activityDefData: {}, //商品模板
			promoterLevel: '', //推广大使级别用来判断认证
			points: {}, //定位经纬度
			resultCont: 0,
			latitude: '',
			longitude: '',
			positionChecked: false, //默认定位关闭
			positionBtnShow: false, //定位按钮显示
			movableViewX: '',
			declarationBtnHeight: '',
			userId: '' //当前登录人id
		};
	},
	onLoad(params) {
		this.init(params);
		console.log('index.vue onLoad');
		this.systemInfo = app.globalData.systemInfo;
		this.movableViewX = this.systemInfo.screenWidth;
		console.log(this.systemInfo, '----this.systemInfo手机屏幕');
	},
	// // 设置转发内容
	onShareAppMessage() {
		return {
			title: '修链房屋维修快速预约',
			path: `/pages/declaration/declaration?sharePromoterId=${this.userId}`
		};
	},
	// // 设置分享朋友圈内容
	// onShareTimeline() {
	//   return {
	//     title: '修链帮帮',
	//     query: ''
	//   };
	// },
	onShow(param) {
		common.osg.init(this, param, app);
		wx.getSetting({
			success(res) {
				let that = common.osg._cthis;
				if (res.authSetting['scope.userLocationBackground']) {
					that.positionChecked = true;
					that.$forceUpdate();
				} else {
					that.positionChecked = false;
					that.$forceUpdate();
				}
			}
		});
		common.osg.doLogin({}, (res) => {
			let user = wx.getStorageSync('user');
			this.userId = user.user._id;
			this.promoterLevel = user.user.promoterLevel;
			console.log(this.promoterLevel, '--this.promoterLevel');
			this.userPhone = user.user.phone;
			console.log(this.userPhone, '--this.userPhone');
			if (typeof (this.userPhone == 'undefined') && this.userPhone == '') {
				this.isLogined = false;
				//common.osg.open('../../subpackages/authorize/authorize', null, {});
			}
			if (!common.osg.isLogined()) {
				this.getNotice();
				this.isLogined = false;
				this.notice.data = [];
				this.functionList = [];
				return;
			} else {
				common.osg.codeoption(() => {
					this.getActivityDef();
					this.getNotice(); //全部
					this.$forceUpdate();
				});
				this.isLogined = true;
				// this.start();
			}
			if (typeof (this.userPhone == 'undefined') && this.userPhone == '') {
				this.isLogined = false;
			}
		});
	},

	methods: {
		init(params) {
			// 扫二维码进入报单页
			if (params.q) {
				// 扫码进入报单页不允许返回
				wx.hideHomeButton();
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

			common.osg.init(this, params, app);
			common.osg.doLogin({}, (res) => {
				let user = wx.getStorageSync('user');
				this.promoterLevel = user.user.promoterLevel;
				console.log(this.promoterLevel, '--this.promoterLevel');
				this.userPhone = user.user.phone;
				console.log(this.userPhone, '--this.userPhone');
				if (typeof (this.userPhone == 'undefined') && this.userPhone == '') {
					this.isLogined = false;
					//common.osg.open('../../subpackages/authorize/authorize', null, {});
				}
				if (!common.osg.isLogined()) {
					this.getNotice();
					this.isLogined = false;
					this.notice.data = [];
					this.functionList = [];
					return;
				} else {
					common.osg.codeoption(() => {
						this.getActivityDef();
						this.getNotice(); //全部
						this.$forceUpdate();
					});
					this.isLogined = true;
					// this.start();
				}
				if (typeof (this.userPhone == 'undefined') && this.userPhone == '') {
					this.isLogined = false;
				}
			});
		},

		start() {
			// 开启实时地理位置监听
			common.osg.startLocationUpdateBackground(() => {
				console.log('--开启实时地理位置监听');
				this.positionChecked = true;
				let that = this;
				that.timer = setInterval(() => {
					wx.onLocationChange((result) => {
						let now = new Date();
						console.log(
							`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} 位移返回值 latitude:${
								result.latitude
							},longitude:${result.longitude}`
						);
						// that.resultCont += 1;
						// console.log(that.resultCont, '-----resultCont');
						// if (that.resultCont > 10) {
						that.getPunch(result.latitude.toFixed(5), result.longitude.toFixed(5));
						that.punchToBeConfirmed();
						that.punchQuery();
						// that.resultCont = 0;
						// }
						// app.globalData.points = that.points;
						wx.offLocationChange();
					});
					console.log('定时器一次');
				}, 30000);
			});
		},
		end() {
			clearInterval(this.timer);
			wx.offLocationChange();
			wx.stopLocationUpdate();
			this.positionChecked = false;
		},
		positionChange(detail) {
			wx.showModal({
				title: '提示',
				content: `${detail.detail == true ? '是否开启定位？' : '是否关闭定位？'}`,
				success: (res) => {
					if (res.confirm) {
						if (detail.detail) {
							this.start();
							console.log(this.positionChecked, '----start');
						} else {
							this.end();
							console.log(this.positionChecked, '----end');
						}
						// this.setData({ positionChecked: detail.detail });
					}
				}
			});
		},
		positionBtnClk() {
			wx.showModal({
				title: '提示',
				content: `${this.positionChecked == false ? '是否开启定位？' : '是否关闭定位？'}`,
				success: (res) => {
					if (res.confirm) {
						if (!this.positionChecked) {
							this.start();
							console.log(this.positionChecked, '----start');
						} else {
							this.end();
							console.log(this.positionChecked, '----end');
						}
					}
				}
			});
		},
		doPositionBtnShow(val) {
			if (val == 1) {
				this.positionBtnShow = false;
				this.movableViewX = this.systemInfo.screenWidth;
			}
			if (val == 2) {
				this.positionBtnShow = true;
				this.movableViewX = this.systemInfo.screenWidth - 120;
			}
		},
		doOpen(path, data, options, login) {
			if (login && !this.isLogined) {
				common.osg.open('../../subpackages/authorize/authorize', null, {});
			} else {
				common.osg.open(path, data, options);
			}
		},
		getPunch(latitude, longitude) {
			console.log(this.points, '----打卡接口this.points');
			//  日坛：longitude: '116.441518', latitude: '39.919768'  其他longitude: '116.291424', latitude: '39.867774'
			//  华严北里 longitude: 116.38519, latitude: 39.984184
			common.osg.ajax('wmt/biz/punch/dot ', { longitude: longitude, latitude: latitude }, (res) => {
				console.log(res, '---打卡res');
			});
		},
		punchToBeConfirmed() {
			common.osg.ajax('wmt/biz/punch/toBeConfirmed', {}, (res) => {
				console.log(res, '---待确认打卡记录');
			});
		},
		// /biz/punch/query
		punchQuery() {
			common.osg.ajax('wmt/biz/punch/query', {}, (res) => {
				console.log(res, '---打卡记录query');
			});
		},
		getNotice: function () {
			let params = {
				page: 1,
				rows: 10,
				'is:type|integer#and': 3,
				'is:exts.chooseApplet|string#and': '3',
				sortField: 'createTime',
				sortOrder: 'desc'
			};
			common.osg.ajax(
				'wmt/document/query',
				params,
				(res) => {
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
		gridClick(func) {
			app.globalData.funcId = func._id; // 工单列表激活当前菜单页签
			// 测试埋点统计
			if (func.name == '云施工') {
				common.osg.md({ act: '云施工' });
			}
			if (!func.action) {
				if (func.name == '云店铺') {
					common.osg.open('/subpackages/partner/partnerApplication');
				} else {
					if (this.options.modules.length == 0) {
						common.osg.codeoption(() => {
							this.$forceUpdate();
						});
					}
					let user = wx.getStorageSync('user');
					this.formData.name = user.name;
					this.formData.phone = user.phone;
					this.formData.modules = [func.name];
					this.dialogShow = true;
				}
			} else if (func.action.indexOf('/menu/menu') != -1 || func.action.indexOf('/menu/storeMenu') != -1) {
				// 缓存二级菜单
				wx.setStorageSync('menu', func);
			}
		},
		scan(func) {
			common.osg.scanCode((code) => {
				common.osg.ajax('/basic/qrcode/scan', { param: code.result }, (res) => {
					common.osg.open(func.action, { id: res.data._id }, { mode: func.openType.split('-')[1] });
				});
			});
		},
		onPullDownRefresh: function () {
			if (!this.isLogined) return;
			this.getNotice(); //全部
		},
		// 获取banner高度
		getHeight(e) {
			//获取可使用窗口宽度
			var width = this.systemInfo.windowWidth;
			//获取图片实际高度
			var imgheight = e.detail.height;
			//获取图片实际宽度
			var imgwidth = e.detail.width;
			//等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
			var height = (width * imgheight) / imgwidth;
			// height += 'px';
			this.declarationBtnHeight = height - 20;
			this.bannerHeight = height += 'px';
		},
		makePhoneCall(phoneNumber) {
			wx.makePhoneCall({
				phoneNumber: phoneNumber
			});
		},
		onFieldChange(e) {
			let key = e.target.dataset.key;
			this.formData[key] = e.detail;
		},
		onHide() {
			// clearInterval(this.timer);
		},
		onUnload() {
			// clearInterval(this.timer);
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
		},
		getActivityDef() {
			common.osg.ajax(
				'wmt/biz/activityDef/query',
				{
					_all: '1',
					'is:state|integer#and': 1,
					'is:exts.activityDefType|string#and': '2',
					'is:exts.isRecommend|string#and': '1'
				},
				(res) => {
					this.activityDefData = res.data;
					console.log(this.activityDefData, 'this.activityDefData');
				}
			);
		},
		shareDaikexiadan() {
			wx.onShareAppMessage({
				title: '修链房屋维修快速预约',
				desc: '分享描述',
				path: `/pages/declaration/declaration?sharePromoterId=${this.userId}`, // 分享路径
				imageUrl: '', // 分享图片
				success(res) {
					common.osg.toast('分享成功', 'success');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background: #fff;
}
.container {
	width: 100%;
	overflow: hidden;
}
.unauthorized {
	margin-top: 40px;
	text-align: center;
	.unauthorizedTitle {
		padding-bottom: 5px;
		color: #d80111;
		font-size: 16px;
		font-weight: 600;
	}
	.unauthorizedConter {
		padding-bottom: 5px;
		color: #6d6d6d;
		text-align: center;
		font-size: 14px;
		font-weight: 500;
	}
}
.unauthorizedBtn {
	text-align: center;
	::v-deep .van-button {
		width: 205px;
		height: 41px;
		border-radius: 8px;
		background: linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%);
		color: #fff;
		font-family: Inter;
		font-size: 16px;
		font-weight: 600;
	}
}
.loginBtn {
	align-items: center;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 20px 0;
	margin-top: 40px;
	::v-deep .van-button {
		width: 205px;
		height: 41px;
		border-radius: 8px;
		background: linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%);
		color: #fff;
		font-family: Inter;
		font-size: 16px;
		font-weight: 600;
	}
}
.notice {
	width: 100vw;
	padding: 10px;
	background: #fff;
	color: #383838;
	font-size: 12px;
}
.grid {
	padding: 8px 15px 13px 15px;
	border-radius: 8px;
}
.good {
	justify-content: space-around;
	// margin-left: 17px;
	// padding: 10px 0 10px 17px;
	padding-bottom: 20px;

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
.van-grid-item {
	height: 100px;
}

.gridText {
	color: #484848;
	text-align: center;
	font-family: Source Serif 4;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	// padding-top: 11px;
}
.bg .img {
	width: 100%;
}
button[plain] {
	border: 0;
}
.btn {
	position: fixed;
	bottom: 30rpx;
}

.btn button {
	width: 200rpx;
}

/* 宫格内文字样式 */
.van-grid-item__text {
	font-size: 12px !important;
	margin-top: 20rpx;
}

.index {
	.c-notice-bar {
		padding: 0 10px;
		height: 50px;
		background: #fff;
		// border-radius: 15px 15px 0 0;
		margin-top: -25px;
		position: relative;
		.van-notice-bar__left-icon {
			margin-right: 10px;
		}
		.c-notice-bar__right-icon {
			margin-left: 10px;
		}
	}
	.c-checkbox-group-modules {
		.van-checkbox-group {
			display: flex;
			flex-wrap: wrap;
			padding-left: 6px;
			.c-checkbox {
				margin: 10px;
			}
		}
	}
	.c-grid-item-content {
		padding: 10px 8px;
		.van-grid-item__icon {
			width: 60px;
			height: 60px;
			position: relative;
			justify-content: center;
			// 缩放解决真机1rpx太粗的问题
			&:after {
				position: absolute;
				content: '';
				border: 2rpx solid #967c7c;
				border-radius: 50%;
				width: 200%;
				height: 200%;
				top: 0;
				left: 0;
				transform: scale(0.5);
				transform-origin: 0 0;
				opacity: 0.9;
			}
			.van-icon__image {
				border-radius: 50%;
			}
		}
		.van-grid-item__text {
			font-size: 14px !important;
			line-height: 20px;
			color: #666 !important;
			opacity: 0.8;
		}
	}
	.c-banner-bottom {
		margin: 20px 15px 70px;
		width: calc(100% - 30px) !important;
		box-sizing: border-box;
	}
	.line-top {
		width: calc(100vw - 36px);
		margin: 0 18px 15px;
		position: relative;
		// 缩放解决真机1rpx太粗的问题
		&:after {
			position: absolute;
			content: '';
			border: 2rpx solid #efefef;
			width: 200%;
			height: 200%;
			top: 0;
			left: 0;
			transform: scale(0.5);
			transform-origin: 0 0;
			opacity: 0.99;
		}
	}
	.line {
		width: 200vw;
		position: fixed;
		bottom: 0;
		border-bottom: 2rpx solid #d9d9d9;
		transform: scale(0.5);
		transform-origin: 0 0;
		opacity: 0.9;
	}
	.pushBlock {
		margin: 0 15px;
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
}
.levitateBall {
	border-radius: 1em;

	width: 30px;
	height: 30px;
	// background-color: #f03a23;
	z-index: 99;
}
.postionTest {
	border-radius: 1em;
	height: 30px;
	width: 60px;
	background-color: #dcdee0;
}

// .levitateBall:hover {
//   border-radius: 1em;
//   width: 80px;
//   height: 30px;
//   background-color: #f03a23;
//   z-index: 99;
// }
// .postionSwitch {
//   display: none;
// }
// .levitateBall:hover .postionSwitch {
//   display: block;
// }
.positionBtn {
	::v-deep .van-button {
		width: 90px;
		height: 30px;
	}
}
.declarationBtn {
	z-index: 1;
	width: 145px;
	height: 45px;
	background-color: #d60f16;
	color: #fff;
	text-align: center;
	border-radius: 1.5rem;
	font-size: 14px;
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	.declarationBtnIcon {
		width: 15px;
		height: 15px;
		line-height: 15px;
		border-radius: 50%;
		background-color: #fff;
		margin-left: 5px;
		color: #000;
		.triangle {
			width: 0px;
			height: 0px;
			border: 5px solid transparent black; /*以下四个样式对应四种三角形，任选其一即可实现*/
			/* border-top-color:lightseagreen; */
			border-left-color: #fff;
		}
	}
}
.gridBlock {
	margin-top: 50px;
	display: flex;
	justify-content: space-around;
	text-align: center;
	.imgBlock {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f3f3f3;
		border-radius: 50%;
		margin-bottom: 10px;
	}
}
// .levitateBall:hover .positionBtn {
//   display: block;
// }
</style>
