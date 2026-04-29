<template>
  <view class="declaration">
    <view>
      <image
        mode="widthFix"
        style="width: 100vw; display: flex"
        src="https://pub.fsgo365.cn/5634263637504312944.jpg"
      />
    </view>
    <view class="form">
      <van-cell-group :border="false">
        <van-field
          :value="formData.name"
          @change="onChange"
          data-key="name"
          label="姓名："
          required
          clearable
          input-align="right"
        />
        <van-field
          :value="formData.phone"
          @change="onChange"
          data-key="phone"
          type="number"
          label="手机："
          required
          clearable
          input-align="right"
        />
        <!-- <van-cell
            title="服务类型："
            is-link
            :value="format('serviceType', formData.exts.workflowDefId, 'select')"
            required
            @click="onClick"
            data-key="exts.workflowDefId"
            data-actions="serviceTypeCode"
          /> -->
        <van-cell
          title="区域："
          is-link
          :value="
            area.areaList.province_list[formData.province] +
            area.areaList.city_list[formData.city] +
            area.areaList.county_list[formData.district]
          "
          required
          @click="area.show = true"
        />
        <van-cell
          title="街道："
          is-link
          :value="format('subdistricts', formData.subdistrict, 'select')"
          required
          @click="onClick"
          data-key="subdistrict"
          data-actions="subdistricts"
        />
        <van-field
          :value="formData.address"
          data-key="address"
          @change="onChange"
          label="地址："
          required
          clearable
          input-align="right"
          type="textarea"
          autosize
        >
          <template #button>
            <van-button
              @click="doOpen('../../pages/declaration/amap')"
              size="mini"
              color="#c83333"
              icon="location-o"
            >
              定位
            </van-button>
          </template>
        </van-field>
        <van-cell
          title="部位："
          is-link
          :value="format('repairParts', formData.exts.leakagesite_copy, 'multiple')"
          required
          @click="onClick"
          data-key="exts.leakagesite"
          data-actions="repairParts"
        />
        <!-- <van-cell title="上传相关照片(渗漏部位、房屋结构图等)" :border="false" title-width="100%" />
          <view>
            <van-uploader
              style="display: flex"
              multiple
              :file-list="formData.images"
              @afterread="afterRead"
              @delete="deleteFile"
              data-field="images"
              :max-count="5"
            />
          </view>
          <van-field
            :value="formData.describe"
            @change="onChange"
            data-key="describe"
            type="textarea"
            :autosize="{ minHeight: 80 }"
            label="描述"
            placeholder="请用简短的文字描述您遇到的渗漏问题，包括渗漏部位、渗漏程度，稍后将有专业防水服务人员为您解答。"
            clearable
            :border="false"
          /> -->
      </van-cell-group>
      <view style="padding: 10px 0 0">
        <van-button
          type="danger"
          block
          @click="doSave"
          custom-style="height:46px;border-radius:6px;font-size:20px;font-weight:600;background-color:#c83333;color:#f2e0cc"
        >
          立即预约
        </van-button>
      </view>
      <!-- 省市区 -->
      <van-popup :show="area.show" position="bottom">
        <van-area :area-list="area.areaList" @confirm="areaConfirm" @cancel="area.show = false" />
      </van-popup>
    </view>
    <view>
      <image
        mode="widthFix"
        style="width: 100vw"
        src="https://pub.fsgo365.cn/2035032411441350775.jpg"
      />
    </view>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="
        actionSheet = {
          show: false,
          key: '',
          actions: []
        }
      "
      @select="onSelect"
    />
    <!-- 成功提示 -->
    <van-overlay :show="prompt" bind:click="onClickHide">
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
    </van-overlay>
  </view>
</template>

<script>
const app = getApp();
const common = require('../../common/common.js');
const areajs = require('../../common/area.js');
const chooseLocation = requirePlugin('chooseLocation');
export default {
  data() {
    return {
      // parnterServiceType: [], //伙伴中的服务类型
      entryUrl: '', // 进入页面的url含参数
      params: {},
      options: {
        cascadeCode_repairParts: { codeId: 'repairParts' },
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
        tenantId: '4670873342363649607',
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
        show: false,
        areaList: Object.assign({}, areajs.default)
      },
      // 上拉菜单
      actionSheet: {
        show: false,
        key: '',
        actions: []
      },
      prompt: false, // 提交成功提示
      type: '',
      mapdata: '' //地图页面返回的值
    };
  },
  onLoad(params) {
    this.init(params);
  },
  onShow() {
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

    // 动态设置 tabBar 的整体样式，实现快速预约页导航栏文字黑色
    wx.setTabBarStyle({
      selectedColor: '#323233'
    });
  },
  // 设置转发内容
  onShareAppMessage() {
    return {
      title: '吉柿修房快速预约',
      path: '/pages/declaration/declaration'
    };
  },
  // 设置分享朋友圈内容
  onShareTimeline() {
    return {
      title: '吉柿修房快速预约',
      query: ''
    };
  },
  onHide() {
    // 移出缓存中的报单页携带参数
    // if (!type) {
    //   wx.removeStorageSync('declarationParams');
    // }
    // 动态设置 tabBar 的整体样式，实现快速预约页导航栏文字黑色
    wx.setTabBarStyle({
      selectedColor: '#231815'
    });
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
    // 移出缓存中的报单页携带参数
    // if (!type) {
    //   wx.removeStorageSync('declarationParams');
    // }
    // 动态设置 tabBar 的整体样式，实现快速预约页导航栏文字黑色
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
      common.osg.init(this, this.params, app);
      console.log('declaration-params', params);
      // 扫绑定的活动二维码报单shareUserId等于activity时，去查分销绑定码中的分享人id，并赋值给shareUserId
      if (this.params.shareUserId == this.params.activity) {
        this.getactivityBind();
      }
      // 静默登录
      common.osg.doLogin(
        {
          shareType: this.params.shareType || '1', //运营商
          shareTypeId: this.params.shareTypeId || this.params.partnerId, //运营商id
          shareUserId: this.params.shareUserId || '',
          channelId: this.params.channelId || '', //运营商报单码渠道
          allotOrgId: this.params.allotOrgId,
          activityId: this.params.activity //小微服务商扫码携带的活动模板id
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
          this.getArea(params);
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
    doSave() {
      console.log('formData', this.formData);
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
      debugger;
      /**
       * 处理进入方式
       */
      // 进入方式：①扫二维码 扫推广大使分享的报单海报进入，在工单上存推广大使id（promoterId）
      if (
        this.params.shareUserId &&
        (this.params.channelType == 'tg' || this.params.channelType == 'xiaov')
      ) {
        this.formData.exts.promoterId = this.params.shareUserId;
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
        this.leadSave();
        return;
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
        // 小微服务站活动码携带channelType:'xiaov'，信息渠道：小微服务站
        if (this.params.channelType == 'xiaov') {
          this.formData.channel = ['90'];
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
       * 1.雨虹自引单 2.雨虹平台单 3.吉柿修复自有单 4.吉柿修复平台单
       */
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
      // 信息来源：吉柿修复虚拟店铺-吉柿修复平台单
      if (this.params.partnerId == '7735960217998541408') {
        this.formData.exts.sourceType = '4';
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

      let obj = {
        data: JSON.stringify(this.formData),
        partnerId: this.params.partnerId || '', // 扫二维码报单或从门店首页-预约上门
        serviceResourceId: this.params.serviceResourceId || '' // 从管家详情页-预约上门(未开放)
      };

      common.osg.ajax('/basic/serviceAppointment/upsert', obj, res => {
        this.prompt = true;
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
          tenantId: '4670873342363649607',
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
      delete this.formData.exts.leakagesite_copy; //删除渗漏部位冗余字段
      this.formData.leadStatus = ['0']; //线索状态
      this.formData.customTime = common.osg.formatTime(); // 留咨时间
      this.formData.exts.leadDiscrepancy = '99'; // 线索呼入呼出状态-其他
      this.formData.exts.entryUrl = this.entryUrl; // 保存进入页面的网址含参数
      common.osg.ajax(
        '/basic/lead/upsert',
        {
          data: JSON.stringify(this.formData)
        },
        res => {
          common.osg.alert('提交成功', () => {
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
              tenantId: '4670873342363649607',
              exts: {
                workflowDefId: '8191527117502723955',
                leakagesite: [],
                leakagesite_copy: [],
                sourceType: '',
                entryUrl: ''
              }
            };
          });
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
        // console.log(this.options[option], val,'465');
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
     * 上拉菜单选择
     */
    onSelect(e) {
      let key = this.actionSheet.key;
      if (key.startsWith('exts.')) {
        this.$set(this.formData.exts, key.split('.')[1], e.detail.value);
      } else {
        this.$set(this.formData, key, e.detail.value);
      }
      if (key == 'exts.leakagesite') {
        this.formData.exts.leakagesite_copy = [this.formData.exts.leakagesite];
        this.formData.exts.leakagesite = [[this.formData.exts.leakagesite]];
      }
    },
    /**
     * 选择省市区 确认
     */
    areaConfirm(e) {
      let values = e.detail.values;
      let areaVal = [];
      if (values.length >= 1) {
        this.formData.province = values[0].code;
        areaVal.push(values[0].code);
      }
      if (values.length >= 2) {
        this.formData.city = values[1].code;
        areaVal.push(values[1].code);
      }
      if (values.length >= 3) {
        this.formData.district = values[2].code;
        areaVal.push(values[2].code);
      }
      this.formData.area = areaVal; //adcode的数组
      this.formData.subdistrict = '';
      this.area.show = false;
      this.getSubdistricts(this.formData.area, result => {
        this.$set(this.options, 'subdistricts', result);
      });
    },
    // 服务类型去重
    // getServiceType() {
    //   if (this.parnterServiceType == '') {
    //     this.options.serviceTypeCode = this.options.serviceType;
    //   } else {
    //     this.options.serviceTypeCode = [];
    //     for (var i = 0, len = this.options.serviceType.length; i < len; i++) {
    //       if (this.parnterServiceType.includes(this.options.serviceType[i].value)) {
    //         this.options.serviceTypeCode.push(this.options.serviceType[i]);
    //         console.log(this.options.serviceTypeCode, '------------this.options.serviceTypeCode');
    //       }
    //     }
    //   }
    // },
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
            console.log(obj, '--obj解析出来的code值');
            obj.area = [obj.province, obj.city, obj.district];
            this.getSubdistricts(obj.area, result => {
              if (!result.find(item => item.code == obj.subdistrict)) {
                obj.subdistrict = data.township;
              }
              this.$set(this.options, 'subdistricts', result);
              callback(obj);
              this.$forceUpdate();
            });
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
              item.label = item.name;
              item.leaf = true;
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
          console.log(this.params.shareUserId, 'this.IncomeData');
        }
      );
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
  .van-cell {
    background: #f2f2f2;
    min-height: 47px;
    border-radius: 6px;
    margin-top: 10px;
    .van-cell__title {
      flex: none;
      min-width: 60px;
    }
    .van-cell__value {
      flex: 1;
    }
  }
  van-uploader {
    background-color: #fff;
    padding-left: 16px;
  }
}
</style>
