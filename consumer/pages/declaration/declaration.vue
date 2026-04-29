<template>
  <view class="declaration">
    <view>
      <image
        mode="widthFix"
        style="width: 100vw; display: flex"
        src="https://pub.fsgo365.cn/newDeclaration0.png?imageView2/2/w/750/format/webp/q/75"
      />
    </view>

    <view class="form">
      <view v-if="declarationMethod == 'doSave'">
        <uni-forms>
          <view class="c-form-item">
            <uni-forms-item label="姓名：">
              <uni-easyinput
                v-model="formData.name"
                :inputBorder="false"
                primaryColor="#c0c4cc"
              ></uni-easyinput>
            </uni-forms-item>
          </view>
          <view class="c-form-item">
            <uni-forms-item label="手机：">
              <uni-easyinput
                v-model="formData.phone"
                :inputBorder="false"
                primaryColor="#c0c4cc"
                type="number"
              ></uni-easyinput>
            </uni-forms-item>
          </view>
          <view class="c-form-item">
            <uni-forms-item label="区域：">
              <uni-data-picker
                placeholder=" "
                popup-title="请选择区域"
                :localdata="area.areaList"
                :map="{
                  text: 'label',
                  value: 'value'
                }"
                v-model="formData.area"
                @change="areaChange"
                @clear="areaClear"
              ></uni-data-picker>
            </uni-forms-item>
          </view>
          <view class="c-form-item">
            <uni-forms-item label="街道：">
              <uni-data-select
                v-model="formData.subdistrict"
                :localdata="options.subdistricts"
                placeholder=" "
              ></uni-data-select>
            </uni-forms-item>
          </view>
          <view class="c-form-item">
            <uni-forms-item label="地址：">
              <uni-easyinput v-model="formData.address" :inputBorder="false" primaryColor="#c0c4cc">
                <template #right>
                  <view
                    style="
                      background-color: #c83333;
                      color: #fff;
                      border-radius: 2px;
                      padding: 5px;
                      display: flex;
                      align-items: center;
                    "
                    @click="doOpen('../../pages/declaration/amap')"
                  >
                    <uni-icons type="location" color="#fff" size="14"></uni-icons>
                    <text>定位</text>
                  </view>
                </template>
              </uni-easyinput>
            </uni-forms-item>
          </view>
          <view class="c-form-item">
            <uni-forms-item label="部位：">
              <uni-data-select
                v-model="formData.exts.leakagesite"
                :localdata="options.repairParts"
                placeholder=" "
              ></uni-data-select>
            </uni-forms-item>
          </view>
        </uni-forms>
        <view style="padding: 10px 0 0">
          <view
            style="
              height: 44px;
              line-height: 44px;
              text-align: center;
              border-radius: 6px;
              font-size: 20px;
              font-weight: 600;
              background-color: #c83333;
              color: #f2e0cc;
            "
            @click="doSave"
          >
            立即预约
          </view>
        </view>
      </view>
      <view v-else>
        <uni-forms>
          <view class="c-form-item">
            <uni-forms-item label="您的姓名">
              <uni-easyinput
                v-model="formData.name"
                :inputBorder="false"
                primaryColor="#c0c4cc"
              ></uni-easyinput>
            </uni-forms-item>
          </view>
          <view class="c-form-item">
            <uni-forms-item label="您的手机">
              <uni-easyinput
                v-model="formData.phone"
                :inputBorder="false"
                primaryColor="#c0c4cc"
                type="number"
                placeholder="（仅限北京和上海业主）"
              ></uni-easyinput>
            </uni-forms-item>
          </view>
        </uni-forms>
        <view style="padding: 10px 0 0">
          <view
            @click="leadSave"
            style="
              color: #fccc04;
              height: 44px;
              border-radius: 6px;
              font-size: 20px;
              font-weight: 600;
              background-color: #fccc04;
              color: #000;
              text-align: center;
              line-height: 44px;
            "
          >
            一键预约上门
          </view>
        </view>
      </view>
    </view>
    <view>
      <image
        mode="widthFix"
        style="width: 100vw"
        src="https://pub.fsgo365.cn/newDeclaration2.jpg?imageView2/2/w/750/format/webp/q/75"
      />
      <image
        mode="widthFix"
        style="width: 100vw; display: flex"
        src="https://pub.fsgo365.cn/newDeclaration3.jpg?imageView2/2/w/750/format/webp/q/75"
      />
      <!-- <image
        mode="widthFix"
        style="width: 100vw"
        src="https://pub.fsgo365.cn/newDeclaration4.jpg"
      />
      <image
        mode="widthFix"
        style="width: 100vw"
        src="https://pub.fsgo365.cn/newDeclaration5.jpg"
      /> -->
    </view>
    <!-- 成功提示 -->
    <uni-popup ref="upsertDialog" type="dialog">
      <view class="prompt-view">
        <image
          src="../../static/images/prompt-success.png"
          style="width: 100px; height: 100px; border-radius: 50%; display: flex"
          class="prompt-image"
        />
        <view class="prompt-info">
          <view class="prompt-info-title">预约成功</view>
          <view class="prompt-info-desc">我们将在24小时内联系您</view>
          <view class="prompt-info-desc" style="margin-bottom: 20px">确认预约细节和时间</view>
          <view class="prompt-info-button" @click="$refs.upsertDialog.close()">我知道了</view>
        </view>
      </view>
    </uni-popup>
    <!-- <uni-popup :show="prompt" bind:click="onClickHide">
      <view class="prompt-view">
        <image
          src="../../static/images/prompt-success.png"
          style="width: 100px; height: 100px; border-radius: 50%; display: flex"
          class="prompt-image"
        />
        <view class="prompt-info">
          <view class="prompt-info-title">预约成功</view>
          <view class="prompt-info-desc">我们将在24小时内联系您</view>
          <view class="prompt-info-desc" style="margin-bottom: 20px">确认预约细节和时间</view>
          <view class="prompt-info-button" @click="prompt = false">我知道了</view>
        </view>
      </view>
    </uni-popup> -->
  </view>
</template>

<script>
const app = getApp();
const common = require('../../common/common.js');
// const chooseLocation = requirePlugin('chooseLocation');
export default {
  data() {
    return {
      // parnterServiceType: [], //伙伴中的服务类型
      entryUrl: '', // 进入页面的url含参数
      params: {},
      options: {
        // codecfg_repairParts: { codeId: 'repairParts' },
        codecfg_repairParts: { codeId: 'repairPartsOne' }, //只查一级部位
        // cascadeCode_serviceType: { codeId: 'serviceType' },
        // serviceTypeCode: [], //去重后的数据
        subdistricts: []
      },
      formData: {
        address: '',
        title: '',
        name: '',
        phone: '',
        area: '',
        province: '',
        city: '',
        district: '',
        subdistrict: '',
        images: [],
        describe: '',
        tenantId: '1340835581184723420',
        serviceType: '11', //服务类型防水维修双包类型
        exts: {
          // 服务类型默认为“防水维修服务”
          workflowDefId: '8191527117502723955',
          leakagesite: [],
          leakagesite_copy: [],
          sourceType: ''
        }
      },
      // 省市区选择
      area: {
        areaList: []
      },
      // 上拉菜单
      actionSheet: {
        show: false,
        key: '',
        actions: []
      },
      prompt: false, // 提交成功提示
      type: '',
      mapdata: '', //地图页面返回的值
      declarationMethod: '' //服务商端门店详情页报单报工单
    };
  },
  onLoad(e) {
    let params;
    const isEmpty = !e || Object.keys(e).length === 0;

    if (isEmpty) {
      // 如果是空对象，从缓存中读取参数
      params = wx.getStorageSync('declarationParams') || {};
    } else {
      params = e;
    }

    this.init(params);
    this.getAreaData();
  },
  onShow() {
    // 通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
    if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
      this.$mp.page.getTabBar().setData({
        active: 2
      });
    }

    common.osg.init(this, {}, app);
    // 调用高德aip定位返回经纬度
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    if (currPage.data.mapdata.data) {
      this.mapdata = currPage.data.mapdata.data; //高德地图页面传参
      this.formData.address = this.mapdata.addName;
      this.getAmapCode(data => {
        this.formData = common.osg.deepCopy(Object.assign(this.formData, data));
        this.$forceUpdate();
      });
    }
    // this.type = '';
    // 根据返回的经纬度，请求解析对应省市区code值
    // const location = chooseLocation.getLocation();
    // if (location) {
    //   this.getGeocoder(location, data => {
    //     data.address = location.name; //详细地址
    //     this.formData = common.osg.deepCopy(Object.assign(this.formData, data));
    //   });
    // }

    // 动态设置 tabBar 的整体样式，实现快速下单页导航栏文字黑色
    wx.setTabBarStyle({
      selectedColor: '#323233'
    });
  },
  // 设置转发内容
  onShareAppMessage() {
    return {
      title: '修链房屋维修快速下单',
      path: '/pages/declaration/declaration'
    };
  },
  // 设置分享朋友圈内容
  onShareTimeline() {
    return {
      title: '修链房屋维修快速下单',
      query: ''
    };
  },
  onHide() {
    // 移出缓存中的报单页携带参数
    // if (!type) {
    //   wx.removeStorageSync('declarationParams');
    // }
    // 动态设置 tabBar 的整体样式，实现快速下单页导航栏文字黑色
    wx.setTabBarStyle({
      selectedColor: '#231815'
    });
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    // chooseLocation.setLocation(null);
    // 移出缓存中的报单页携带参数
    // if (!type) {
    //   wx.removeStorageSync('declarationParams');
    // }
    // 动态设置 tabBar 的整体样式，实现快速下单页导航栏文字黑色
    wx.setTabBarStyle({
      selectedColor: '#231815'
    });
  },
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    init(params) {
      // 扫二维码进入报单页
      if (params.q) {
        // 扫码进入报单页不允许返回
        wx.hideHomeButton();
        // 解析链接携带参数
        var url = decodeURIComponent(params.q);
        this.entryUrl = url;
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
      // 扫码如果携带declarationMethod参数值为doSave，报单类型为工单
      if (this.params.declarationMethod) {
        this.declarationMethod = this.params.declarationMethod;
      } else {
        // 门店详情页跳转declarationMethod: 'doSave' 报单类型报工单
        let dParams = wx.getStorageSync('declarationMethod') || {};
        this.declarationMethod = dParams.declarationMethod || '';
        wx.removeStorageSync('declarationMethod');
      }
      common.osg.init(this, this.params, app);
      console.log('declaration-params', params);
      // 扫绑定的活动二维码报单shareUserId等于activity时，去查分销绑定码中的分享人id，并赋值给shareUserId
      if (this.params.shareUserId && this.params.shareUserId == this.params.activity) {
        this.getactivityBind();
      }
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
          // 查字典表
          common.osg.codeoption(() => {
            if (this.options.repairParts) {
              this.options.repairParts.map(item => {
                item.label = item.name;
              });
            }
            this.$forceUpdate();
          });
          // 查询可报单的省市区
          // this.getArea(params);
        }
      );
    },
    // 查询可报单的省市区
    async getArea(params) {
      common.osg.ajax('basic/serviceTerritory/queryById/2151144444645192862', {}, res => {
        let province = res.province || [];
        let city = res.city || [];
        let district = res.district || [];
        let area = require('../../common/area.js');
        let obj = { province_list: {}, city_list: {}, county_list: {} };
        province.map(item => {
          obj.province_list[item] = area.default.province_list[item];
        });
        city.map(item => {
          obj.city_list[item] = area.default.city_list[item];
        });
        district.map(item => {
          obj.county_list[item] = area.default.county_list[item];
        });
        this.area.areaList = obj;
        this.$forceUpdate();
      });
    },
    // 新建工单
    doSave() {
      if (!this.formData.name) {
        common.osg.toast('请输入姓名', 'none');
        return;
      }
      if (!this.formData.phone || !/^1[3456789]\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请输入正确的手机号', 'none');
        return;
      }
      if (this.formData.area.length == 0) {
        common.osg.toast('请选择地区', 'none');
        return;
      }

      if (!this.formData.subdistrict) {
        common.osg.toast('请选择街道', 'none');
        return;
      }
      if (!this.formData.address) {
        common.osg.toast('请输入地址', 'none');
        return;
      }
      if (this.formData.exts.leakagesite.length == 0) {
        common.osg.toast('请选择渗漏部位', 'none');
        return;
      }
      // if (!this.formData.exts.workflowDefId) {
      //   common.osg.toast('请选择服务类型', 'none');
      //   return;
      // }

      /**
       * 处理进入方式
       */
      // 进入方式：①扫二维码 扫推广大使分享的报单海报进入，在工单上存推广大使id（promoterId）
      if (
        this.params.shareUserId &&
        (this.params.channelType == 'tg' || this.params.channelType == 'xiaov')
      ) {
        this.formData.exts.promoterId = this.params.shareUserId;
        this.formData.exts.activityName = this.params.activityName;
      }
      // 进入方式：②点击卡片 点击c端分享得现金卡片进入的，在工单上存分享人id（cUserId）
      if (this.params.cUserId) {
        this.formData.exts.cUserId = this.params.cUserId;
      }

      // C端小程序内switchTab跳转，获取缓存参数
      let dParams = wx.getStorageSync('declarationParams');
      if (dParams) {
        // 进入方式：③点击商品详情页-预约上门
        // 1.点击商品详情页-预约上门，在工单上存商品id（waresId）
        if (dParams.waresId) {
          this.formData.exts.waresId = dParams.waresId;
        }
        // 2.如果是推广大使端推广过来的
        // 2.1门店-立即预约 2.2商品-立即预约 2.3门店-活动-商品-立即预约 2.4门店-商品列表-商品-立即预约，在工单上存推广大使id（promoterId）和伙伴id（partnerId）
        if (dParams.promoterId) {
          this.formData.exts.promoterId = dParams.promoterId;
        }

        // 进入方式：④点击门店详情页-预约上门
        if (dParams.partnerId) {
          this.formData.exts.partnerId = dParams.partnerId;
        }

        // 保存参数，统一从this.params取值
        this.params = Object.assign(this.params, dParams);
      }

      /**
       * 处理信息渠道
       */
      // 1.只有扫平台报单码进入的params.channel才会有值
      if (this.params.channel && this.declarationMethod != 'doSave') {
        this.formData.channel = this.params.channel.split(',');
        this.leadSave();
        return;
      } else {
        // 2.非扫码进入下面判断逻辑
        // 1.只有扫平台报单码进入的params.channel才会有值
        if (this.params.channel) {
          this.formData.channel = this.params.channel.split(',');
        } else {
          // 携带服务商partnerId或管家服务资源id
          if (this.params.partnerId || this.params.serviceResourceId) {
            // if (this.params.fromChannel) {
            //   this.formData.channel = this.params.fromChannel.split(',');
            //   // 门店首页-立即预约(未开放)，信息渠道：推广活动-小程序-门店页面 ['60', '6040', '6040020']
            //   // 门店首页-管家详情页-立即预约(未开放)，信息渠道：推广活动-小程序-门店管家页面 ['60', '6040', '6040030']
            //   // 平台首页-管家详情页-立即预约(未开放)，信息渠道：推广活动-小程序-管家页面 ['60', '6040', '6040040']
            // } else {
            //门店首页或管家首页-立即预约，信息渠道：自引单/自引单/微信小程序自引单  自引单/自引单/支付宝小程序自引单
            // #ifdef MP-WEIXIN
            this.formData.channel = ['46', '4610', '4610040'];
            // #endif
            // #ifdef MP-ALIPAY
            this.formData.channel = ['46', '4610', '4610050'];
            // #endif
            // }
          }
          // 存在推广活动小区名称，信息渠道：推广活动/线下推广/地推
          if (this.params.community) {
            this.formData.exts.community = this.params.community;
            this.formData.channel = ['60', '6020', '602010'];
          }
          // 推广端小程序码携带channelType:'tg'，信息渠道：推广活动/线上活动/推广大使
          if (this.params.channelType == 'tg') {
            this.formData.channel = ['60', '6010', '601010'];
          }
          // 默认信息渠道：呼出/腾讯/小程序 呼出/C端小程序/支付宝
          if (!this.formData.channel || this.formData.channel.length == 0) {
            // #ifdef MP-WEIXIN
            this.formData.channel = ['9', '920', '920020'];
            // #endif
            // #ifdef MP-ALIPAY
            this.formData.channel = ['9', '990', '990010'];
            // #endif
          }
        }
      }

      /**
       * 处理信息来源
       * 1.雨虹自引单 2.雨虹平台单 3.修链自有单 4.修链平台单
       */
      if (this.params.sourceType) {
        // 码上指定信息来源
        this.formData.exts.sourceType = this.params.sourceType;
      } else {
        if (this.params.partnerId || this.params.serviceResourceId) {
          // 点门店首页-预约上门；点管家详情页-预约上门（未开发）
          // this.formData.exts.sourceType = '3';
          this.formData.exts.sourceType = '1';
        } else {
          this.formData.exts.sourceType = '4';
        }
        // 信息来源：雨虹虚拟店铺-雨虹平台单
        if (this.params.partnerId == '3904066108544797157') {
          this.formData.exts.sourceType = '2';
        }
        // 信息来源：修链虚拟店铺-修链平台单
        if (this.params.partnerId == '7735960217998541408') {
          this.formData.exts.sourceType = '4';
        }
      }

      // 扫渠道二维码报单，保存渠道id到工单
      if (this.params.channelId) {
        this.formData.channelId = this.params.channelId;
      }

      // 保存分享人id到工单
      if (this.params.shareUserId) {
        this.formData.exts.shareUserId = this.params.shareUserId;
      }

      // 活动
      if (this.params.activity) {
        this.formData.exts.activityId = this.params.activity;
      }

      // 保存进入页面的网址含参数
      this.formData.exts.entryUrl = this.entryUrl;

      // 处理其他字段
      this.formData.title = this.formData.name + '的报单';
      this.formData.exts.image = this.formData.images;

      this.formData.exts.leakagesite_copy = [this.formData.exts.leakagesite];
      this.formData.exts.leakagesite = [[this.formData.exts.leakagesite]];
      let obj = {
        data: JSON.stringify(this.formData),
        partnerId: this.params.partnerId || '', // 扫二维码报单或从门店首页-预约上门
        serviceResourceId: this.params.serviceResourceId || '' // 从管家详情页-预约上门(未开放)
      };

      common.osg.ajax('/basic/serviceAppointment/upsert', obj, res => {
        this.$refs.upsertDialog.open('center');
        this.formData = {
          channel: this.formData.channel,
          title: '',
          name: '',
          phone: '',
          area: '',
          province: '',
          city: '',
          district: '',
          address: '',
          images: [],
          describe: '',
          tenantId: '1340835581184723420',
          exts: {
            workflowDefId: '8191527117502723955',
            leakagesite: [],
            leakagesite_copy: [],
            sourceType: '',
            entryUrl: ''
          }
        };
      });
    },
    /**
     * 保存线索
     */
    leadSave() {
      if (!this.formData.name) {
        common.osg.toast('请输入姓名', 'none');
        return;
      }
      if (!this.formData.phone || !/^1[3456789]\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请输入正确的手机号', 'none');
        return;
      }
      /**
       * 处理进入方式
       */
      // 进入方式：①扫二维码 扫推广大使分享的报单海报进入，在工单上存推广大使id（promoterId）
      if (
        this.params.shareUserId &&
        (this.params.channelType == 'tg' || this.params.channelType == 'xiaov')
      ) {
        this.formData.exts.promoterId = this.params.shareUserId;
        this.formData.exts.activityName = this.params.activityName;
      }
      // 进入方式：②点击卡片 点击c端分享得现金卡片进入的，在工单上存分享人id（cUserId）
      if (this.params.cUserId) {
        this.formData.exts.cUserId = this.params.cUserId;
      }

      // C端小程序内switchTab跳转，获取缓存参数
      let dParams = wx.getStorageSync('declarationParams');
      if (dParams) {
        // 进入方式：③点击商品详情页-预约上门
        // 1.点击商品详情页-预约上门，在工单上存商品id（waresId）
        if (dParams.waresId) {
          this.formData.exts.waresId = dParams.waresId;
        }
        // 2.如果是推广大使端推广过来的
        // 2.1门店-立即预约 2.2商品-立即预约 2.3门店-活动-商品-立即预约 2.4门店-商品列表-商品-立即预约，在工单上存推广大使id（promoterId）和伙伴id（partnerId）
        if (dParams.promoterId) {
          this.formData.exts.promoterId = dParams.promoterId;
        }

        // 进入方式：④点击门店详情页-预约上门
        if (dParams.partnerId) {
          this.formData.exts.partnerId = dParams.partnerId;
        }

        // 保存参数，统一从this.params取值
        this.params = Object.assign(this.params, dParams);
      }

      /**
       * 处理信息渠道
       */
      // 1.只有扫平台报单码进入的params.channel才会有值
      if (this.params.channel) {
        this.formData.channel = this.params.channel.split(',');
        // this.leadSave();
        // return;
      } else {
        // 2.非扫码进入下面判断逻辑
        // 携带服务商partnerId或管家服务资源id
        if (this.params.partnerId || this.params.serviceResourceId) {
          // if (this.params.fromChannel) {
          //   this.formData.channel = this.params.fromChannel.split(',');
          //   // 门店首页-立即预约(未开放)，信息渠道：推广活动-小程序-门店页面 ['60', '6040', '6040020']
          //   // 门店首页-管家详情页-立即预约(未开放)，信息渠道：推广活动-小程序-门店管家页面 ['60', '6040', '6040030']
          //   // 平台首页-管家详情页-立即预约(未开放)，信息渠道：推广活动-小程序-管家页面 ['60', '6040', '6040040']
          // } else {
          //门店首页或管家首页-立即预约，信息渠道：自引单/自引单/微信小程序自引单 自引单/自引单/支付宝小程序自引单
          // #ifdef MP-WEIXIN
          this.formData.channel = ['46', '4610', '4610040'];
          // #endif
          // #ifdef MP-ALIPAY
          this.formData.channel = ['46', '4610', '4610050'];
          // #endif
          // }
        }
        // 存在推广活动小区名称，信息渠道：推广活动/线下推广/地推
        if (this.params.community) {
          this.formData.exts.community = this.params.community;
          this.formData.channel = ['60', '6020', '602010'];
        }
        // 推广端小程序码携带channelType:'tg'，信息渠道：推广活动/线上活动/推广大使
        if (this.params.channelType == 'tg') {
          this.formData.channel = ['60', '6010', '601010'];
        }
        // 默认信息渠道：呼出/腾讯/小程序  呼出/C端小程序/支付宝
        if (!this.formData.channel || this.formData.channel.length == 0) {
          // #ifdef MP-WEIXIN
          this.formData.channel = ['9', '920', '920020'];
          // #endif
          // #ifdef MP-ALIPAY
          this.formData.channel = ['9', '990', '990010'];
          // #endif
        }
      }

      /**
       * 处理信息来源
       * 1.雨虹自引单 2.雨虹平台单 3.修链自有单 4.修链平台单
       */
      if (this.params.sourceType) {
        // 码上指定信息来源
        this.formData.exts.sourceType = this.params.sourceType;
      } else {
        if (this.params.partnerId || this.params.serviceResourceId) {
          // 点门店首页-预约上门；点管家详情页-预约上门（未开发）
          this.formData.exts.sourceType = '3';
        } else {
          this.formData.exts.sourceType = '4';
        }
        // 信息来源：雨虹虚拟店铺-雨虹平台单
        if (this.params.partnerId == '3904066108544797157') {
          this.formData.exts.sourceType = '2';
        }
        // 信息来源：修链虚拟店铺-修链平台单
        if (this.params.partnerId == '7735960217998541408') {
          this.formData.exts.sourceType = '4';
        }
      }

      // 扫渠道二维码报单，保存渠道id到工单
      if (this.params.channelId) {
        this.formData.channelId = this.params.channelId;
      }

      // 保存分享人id到工单
      if (this.params.shareUserId) {
        this.formData.exts.shareUserId = this.params.shareUserId;
      }

      // 活动
      if (this.params.activity) {
        this.formData.exts.activityId = this.params.activity;
      }

      // 保存进入页面的网址含参数
      this.formData.exts.entryUrl = this.entryUrl;

      this.formData.exts.leakagesite = [[this.formData.exts.leakagesite]]; // 渗漏部位
      this.formData.leadStatus = ['0']; //线索状态
      this.formData.customTime = common.osg.formatTime(); // 留咨时间
      this.formData.exts.leadDiscrepancy = '99'; // 线索呼入呼出状态-其他

      common.osg.ajax(
        '/basic/lead/upsert',
        {
          data: JSON.stringify(this.formData)
        },
        res => {
          this.$refs.upsertDialog.open('center');
          this.formData = {
            channel: this.formData.channel,
            title: '',
            name: '',
            phone: '',
            area: '',
            province: '',
            city: '',
            district: '',
            address: '',
            images: [],
            describe: '',
            tenantId: '1340835581184723420',
            exts: {
              workflowDefId: '8191527117502723955',
              leakagesite: [],
              sourceType: '',
              entryUrl: ''
            }
          };
        }
      );
    },
    /**
     * 渲染字典
     */
    format(option, val, type) {
      this.options;
      if (!option) return;
      if (!type || type == 'select') {
        if (val === '') return;
        let str = common.osg.codelabel(option, val);
        if (option == 'subdistricts' && str == '未知') {
          return val;
        } else {
          return str;
        }
      } else if (type == 'multiple') {
        if (val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    /**
     * 输入
     */
    onChange(e) {
      let key = e.target.dataset.key;
      if (key.startsWith('exts.')) {
        this.formData.exts[key.split('.')[1]] = e.detail;
      } else {
        this.formData[key] = e.detail;
      }
    },
    /**
     * 点击
     */
    onClick(e) {
      // this.getServiceType();
      this.actionSheet = {
        show: true,
        key: e.target.dataset.key,
        actions: this.options[e.target.dataset.actions]
      };
    },
    /**
     * 上传图片
     */
    afterRead(e) {
      common.osg.afterRead(e, this);
      this.$forceUpdate();
    },
    /**
     * 删除图片
     */
    deleteFile(e) {
      let index = e.detail.index;
      this.formData.images.splice(index, 1);
      this.$forceUpdate();
    },
    /**
     * 获取登录用户小程序地理位置
     */
    location(callback) {
      // 获取地理位置
      wx.getLocation({
        // 获取地理位置成功
        success(res) {
          if (callback) callback(res);
        },
        // 获取地理位置失败
        fail(res) {}
      });
    },
    // 调用高德aip定位返回经纬度
    getAmapCode(callback) {
      common.osg.ajax(
        '~https://restapi.amap.com/v3/geocode/regeo',
        {
          key: '1544e78c6949e7843efff0691ce9dc67',
          location: this.mapdata.location,
          extensions: 'base', // 返回结果控制
          batch: false //batch=true为批量查询。batch=false为单点查询
        },
        res => {
          let data = res.regeocode.addressComponent;
          if (res.status == '1') {
            let obj = {
              province: data.adcode.slice(0, 2) + '0000',
              city: data.adcode.slice(0, 4) + '00',
              district: data.adcode,
              subdistrict: data.towncode.slice(0, 9)
            };
            obj.area = [obj.province, obj.city, obj.district];
            this.getSubdistricts(obj.area, result => {
              if (!result.find(item => item.code == obj.subdistrict)) {
                obj.subdistrict = data.township;
              }
              this.$set(this.options, 'subdistricts', result);
              callback(obj);
              this.$forceUpdate();
            });
            callback(obj);
          } else callback({});
        }
      );
    },
    /**
     * 获取街道
     */
    getSubdistricts(arr, callback) {
      if (arr && arr.length >= 3) {
        common.osg.ajax(
          'area/query.do',
          {
            _all: '1',
            notFilterOrgId: '1',
            notFilterTenantId: '1',
            parentCode: arr[2],
            level: '4',
            sortField: 'code',
            sortOrder: 'asc',
            areaTranslation: '1' // 同时返回补充的街道
          },
          res => {
            res.data.map(item => {
              item.value = item.code;
              item.text = item.name;
            });
            if (callback) {
              callback(res.data);
            }
          },
          {
            noload: true
          }
        );
      } else {
        if (callback) {
          callback([]);
        }
      }
    },
    getLocation: function (callback, fail) {
      let that = this;
      wx.authorize({
        scope: 'scope.userLocation',
        // 授权-获取地理位置
        success() {
          // 获取地理位置
          that.location(callback);
        },
        // 拒绝-获取地理位置
        fail() {
          // 获取用户当前设置
          wx.getSetting({
            // 获取用户当前设置-成功
            success(res) {
              // 没有授权-则请求设置
              if (!res.authSetting['scope.userLocation']) {
                // 提示需求授权
                wx.showModal({
                  title: '请求授权当前位置',
                  content: '需要获取你的地理位置来查询附近门店',
                  // 确认-打开设置
                  success: function (result) {
                    if (result.confirm) {
                      // 打开设置(不管是否授权，返回后都会执行onShow)
                      wx.openSetting({
                        success(res) {
                          wx.getSetting({
                            success() {
                              if (!res.authSetting['scope.userLocation']) {
                                if (fail) fail();
                              } else {
                                that.location(callback);
                              }
                            }
                          });
                        }
                      });
                    } else {
                      // 取消打开设置
                      if (fail) fail();
                    }
                  }
                });
              } else {
                // 已经授权-则直接获取地理位置
                that.location(callback);
              }
            }
          });
        }
      });
    },
    // 查询绑定活动码上的分享人id
    getactivityBind() {
      common.osg.ajax(
        'biz/extForm/queryByColName/activityBind',
        {
          'is:state|integer#and': 1,
          'is:activityId|string#and': this.params.activity
        },
        res => {
          this.params.shareUserId = res.data[0].promoterId;
          this.params.activityName = res.data[0].activityName;
        }
      );
    },
    getAreaData() {
      common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
        this.area = res;
      });
    },
    areaChange(e) {
      let values = e.detail.value.map(item => item.value);
      if (values.length >= 1) {
        this.formData.province = values[0];
      }
      if (values.length >= 2) {
        this.formData.city = values[1];
      }
      if (values.length >= 3) {
        this.formData.district = values[2];
      }
      this.formData.area = values; //adcode的数组
      this.formData.subdistrict = '';
      this.getSubdistricts(this.formData.area, result => {
        this.$set(this.options, 'subdistricts', result);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
page {
  background-color: #fff;
  .declaration {
    ::v-deep .van-field__label {
      color: #323233;
    }
    padding-bottom: 50px;
    margin-bottom: env(safe-area-inset-bottom);
    .prompt-view {
      width: 210px;
      text-align: center;
      margin: auto;
      margin-top: calc(50vh - 150px);
      position: relative;
      .prompt-image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: flex;
        position: absolute;
        top: -25px;
        left: calc(50% - 50px);
      }
      .prompt-info {
        background: #fff;
        border-radius: 8px;
        padding: 100px 0 20px;
        .prompt-info-title {
          color: #000;
        }
        .prompt-info-desc {
          color: #b0b0b0;
        }
        .prompt-info-button {
          color: #fff;
          background: #2b6ff6;
          width: 115px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          margin: 0 auto;
          border-radius: 14px;
        }
      }
    }
  }
}

.form {
  width: calc(100vw - 32px);
  margin: 10px auto 0;
  ::v-deep .van-cell {
    background-color: #ececec;
    min-height: 40px;
    border-radius: 6px;
    margin-top: 10px;
    .van-cell__title {
      flex: none;
      min-width: 60px;
      font-size: 14px;
    }
    .van-field__label {
      color: #6c6c6c;
    }
    .van-field__control {
      font-size: 14px;
      color: #6c6c6c;
    }
    .van-cell__value {
      flex: 1;
    }
  }
  van-uploader {
    background-color: #fff;
    padding-left: 16px;
  }
  .c-form-item {
    ::v-deep .uni-forms-item {
      background-color: #ececec;
      min-height: 44px;
      border-radius: 6px;
      padding: 0 10px 0 12px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      // uni-data-picker uni-data-select
      .input-value-border,
      .uni-select {
        border: none;
        padding-right: 0;
      }
      // uni-easyinput
      .uni-easyinput__content {
        background-color: #ececec !important;
        .uni-easyinput__content-input {
          background-color: #ececec;
        }
      }
    }
  }
}
</style>
