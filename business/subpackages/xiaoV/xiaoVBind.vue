<template>
  <view class="xiaoVBind" @click.capture="track">
    <van-cell-group>
      <!-- 校验二维码 -->
      <van-field
        label="扫码绑定渠道"
        use-right-icon-slot
        readonly
        required
        @click.native="doVerification"
      >
        <van-icon
          slot="right-icon"
          :color="verificationState ? '#07c160' : '#106cff'"
          :style="'color:' + (verificationState ? '#07c160' : '#106cff')"
          :name="verificationState ? 'checked' : 'scan'"
        />
      </van-field>
      <van-cell
        v-if="currentRole._id == '6284006356232419567'"
        title="绑定服务商"
        is-link
        required
        :value="format('partnerData', formData.bindOrgId, 'select')"
        @click.native="partnerShow = true"
      />
      <van-field
        label="活动名称"
        :value="formData.activityName"
        required
        placeholder="请填写"
        data-key="activityName"
        input-align="right"
        @change="onFieldChange"
      />
      <!-- #ifdef MP-WEIXIN -->
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
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="区域：" required>
        <uni-data-picker
          key="area"
          ref="area"
          :value="formData.area"
          placeholder=""
          popup-title="省市区"
          :localdata="area.areaList"
          :map="{
            text: 'label',
            value: 'value'
          }"
          @change="areaConfirm"
          :clear-icon="false"
          class="c-data-picker"
        ></uni-data-picker>
      </van-cell>
      <!-- #endif -->
      <van-cell
        title="街道："
        is-link
        :value="format('subdistricts', formData.subdistrict, 'select')"
        required
        @click="onClick"
        data-key="subdistrict"
        data-actions="subdistricts"
      />
      <!-- #ifdef MP-WEIXIN -->
      <van-field
        label="地址"
        :value="formData.address"
        placeholder="请填写"
        data-key="address"
        input-align="right"
        @change="onFieldChange"
      >
        <template #button>
          <van-button
            @click="doOpen('../../subpackages/map/amap')"
            size="mini"
            icon="location-o"
            color="#106cff"
            :data-event="{ id: 'E6SEnHbnIM' }"
            class="c-flex"
          >
            定位
          </van-button>
        </template>
      </van-field>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="地址">
        <view key="field-text" class="c-flex c-item-center">
          <input
            key="address"
            :value="formData.address"
            style="width: 100%; text-align: right; margin-right: 5px"
            @input="addressChange"
          />
          <van-button
            slot="button"
            type="info"
            size="mini"
            icon="location-o"
            @click="doOpen('../../subpackages/map/amap')"
            :data-event="{ id: 'E6SEnHbnIM' }"
            class="c-flex"
          >
            定位
          </van-button>
        </view>
      </van-cell>
      <!-- #endif -->
      <!-- <van-cell
        title="开始时间"
        :value="formData.startDate"
        @click="onTimeClick"
        data-extfield="startDate"
      ></van-cell>
      <van-cell
        title="结束时间"
        :value="formData.endDate"
        @click="onTimeClick"
        data-extfield="endDate"
      ></van-cell> -->
      <!-- <van-divider dashed />
      <van-cell title="身份证人像面识别" custom-class="c-cell c-cell-image">
        <van-uploader
          style="display: flex"
          multiple
          accept="image"
          :file-list="formData.idcardFrontUrl"
          @after-read="afterRead($event, 'idcardFrontUrl')"
          @delete="deleteFile($event, 'idcardFrontUrl')"
          :max-count="1"
          data-field="idcardFrontUrl"
        />
      </van-cell>
      <van-notice-bar left-icon="info-o" text="上传身份证、银行卡可自动识别并填写相关信息。" /> -->
      <!-- <van-cell title="身份证国徽面识别" custom-class="c-cell c-cell-image">
        <van-uploader
          style="display: flex"
          multiple
          accept="image"
          :file-list="formData.idcardBackUrl"
          @after-read="afterRead($event, 'idcardBackUrl')"
          @delete="deleteFile($event, 'idcardBackUrl')"
          :max-count="1"
          data-field="idcardBackUrl"
        />
      </van-cell> -->
      <van-field
        label="渠道联系人"
        :value="formData.name"
        placeholder="请填写"
        required
        data-key="name"
        input-align="right"
        @change="onFieldChange"
      />
      <van-field
        label="渠道联系人手机号"
        :value="formData.phone"
        placeholder="请填写"
        required
        type="number"
        data-key="phone"
        input-align="right"
        @change="onFieldChange"
      />
      <van-notice-bar left-icon="info-o" text="手机号作为修链帮帮人员登录账号。" />
    </van-cell-group>
    <view class="button-bottom">
      <van-button
        type="info"
        round
        block
        color="#106cff"
        @click="activityBind"
        :data-event="{ id: 'e3adDaHhQT' }"
      >
        确 定
      </van-button>
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
    <!-- 日期时间 -->
    <van-popup :show="datetime.show" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        type="datetime"
        :value="datetime.value"
        @confirm="datetimeConfirm"
        @cancel="datetimeCancel"
      ></van-datetime-picker>
    </van-popup>
    <!-- 省市区 -->
    <van-popup :show="area.show" position="bottom">
      <van-area :area-list="area.areaList" @confirm="areaConfirm" @cancel="area.show = false" />
    </van-popup>
    <!-- 伙伴 -->
    <van-popup
      :show="partnerShow"
      close-icon-position="top-left"
      position="bottom"
      custom-style="height: 500px"
      @close="sexShow = false"
    >
      <van-search
        :value="searchValue"
        @search="onSearch"
        @clear="onSearch"
        use-action-slot
        shape="round"
        placeholder="请输入搜索关键词"
        custom-class="c-p-10 c-p-v-20 c-search"
        background="#f9f9f9"
      ></van-search>
      <van-action-sheet
        :show="partnerShow"
        :actions="options.partnerData"
        @select="partnerSelect('bindOrgId', $event)"
        @close="partnerClose('bindOrgId')"
        close-on-click-action
        style="height: 300px"
        :overlay="false"
        :z-index="1"
      ></van-action-sheet>
    </van-popup>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
const areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      promoterLevelShow: false,
      levelShow: false,
      user: {},
      options: {
        orgs: [],
        roles: [],
        partnerData: [],
        subdistricts: []
      },
      formData: {
        activityName: '', //活动名称
        activityId: '', //活动id
        defId: '', //活动模板id
        startDate: '', //开始时间
        endDate: '', //结束时间
        exts: {},
        tplImageFileid: '',
        tplQrcode: '',
        tplQrcodeSize: '',
        tplQrcodex: '',
        tplQrcodey: '',
        preStartSignMinites: '',
        phone: '',
        idcardFrontUrl: '', //身份证人像面识别
        idcardBackUrl: '', //身份证国徽面识别
        // bankCardUrl: [], //银行卡照片
        // level: '1',
        area: '',
        province: '',
        city: '',
        district: '',
        subdistrict: '',
        bindOrgId: '' //伙伴orgid
      },
      // gFormData: {
      // }, //工人注册
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
      params: {},
      qrcodeUlr: '', //解析出的二维码url
      // 时间选择器
      datetime: {
        show: false,
        type: '',
        value: new Date().getTime()
      },
      verificationState: false, //扫码状态
      partnerShow: false, //伙伴弹框
      mapdata: '', //地图页面返回的值
      searchValue: '', //服务商搜索
      partnerId: '',
      currentRole: {}, //当前角色
      mapData: {} //地图页面返回的数据
    };
  },
  onLoad: function (params) {
    this.init(params);
    setTimeout(() => {
      this.doVerification();
    }, 500);
    this.currentRole = wx.getStorageSync('currentRole');
    // #ifdef APP-PLUS
    this.getArea();
    // #endif
  },
  onShow(params) {
    // 调用高德aip定位返回经纬度
    common.osg.init(this, {}, app);
    // #ifdef MP-WEIXIN
    this.area.areaList = areajs.default;
    // #endif
    if (this.mapData.address) {
      this.getAmapCode(data => {
        this.formData = common.osg.deepCopy(Object.assign(this.formData, data));
        this.formData.address = this.mapData.address;
      });
    }
  },
  methods: {
    init(params) {
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
      common.osg.codeoption(() => {
        this.getPartner();
        this.$forceUpdate();
      });
    },
    doVerification() {
      let that = this;
      wx.scanCode({
        scanType: ['qrCode'],
        success(res) {
          that.verification(res.result);
          // // 判断是否是7735960217998541408修链虚拟服务商，用来隐藏绑定服务商字段
          // const regex = /partnerId=(\d+)/;
          // const match = res.result.match(regex);
          // if (match) {
          //   that.partnerId = match[1];
          //   that.$forceUpdate();
          //   console.log(that.partnerId, '-----partnerId');
          // } else {
          //   console.log('partnerId 参数未找到');
          // }

          // console.log(res);
        }
      });
    },
    pickerConfirmG(val, e) {
      if (val == 'bindOrgId') {
        this.formData.bindOrgId = e.detail.value.value;
        this.formData.exts.bindOrgIdLabel = e.detail.value.name;

        console.log(this.formData.bindOrgId, '---formData.bindOrgId');
        this.partnerShow = false;
        this.searchValue = '';
        this.getPartner();
      }
    },
    pickerDefCloseG(val) {
      if (val == 'bindOrgId') {
        this.partnerShow = false;
        this.searchValue = '';
        this.getPartner();
      }
    },
    partnerSelect(val, e) {
      if (val == 'bindOrgId') {
        this.formData.bindOrgId = e.detail.value;
        this.formData.exts.bindOrgIdLabel = e.detail.name;

        console.log(this.formData.bindOrgId, '---formData.bindOrgId');
        this.partnerShow = false;
        this.searchValue = '';
        this.getPartner();
      }
    },
    partnerClose(val) {
      if (val == 'bindOrgId') {
        this.partnerShow = false;
        this.searchValue = '';
        this.getPartner();
      }
    },
    // 校验二维码
    verification(url) {
      common.osg.ajax('/biz/activity/verification', { url }, res => {
        if (res.success == true) {
          this.verificationState = true;
          this.formData.activityId = res.data._id;
          this.formData.defId = res.data.defId;
          this.formData.startDate = res.data.startDate;
          this.formData.endDate = res.data.endDate;
          this.formData.exts = res.data.exts;
          this.formData.tplImageFileid = res.data.tplImageFileid;
          this.formData.preStartSignMinites = res.data.preStartSignMinites;
          this.formData.tplQrcode = res.data.tplQrcode;
          this.formData.tplQrcodeSize = res.data.tplQrcodeSize;
          this.formData.tplQrcodex = res.data.tplQrcodex;
          this.formData.tplQrcodey = res.data.tplQrcodey;
          this.$forceUpdate();
        } else {
          that.doOpen('/pages/account/account', '', { mode: 'switchTab' });
        }
      });
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    onChange(e) {
      //   if (e.detail.name == 'g') {
      //     this.formData = {};
      //     this.getLabour();
      //     this.$forceUpdate();
      //   }
      //   if (e.detail.name == 't') {
      //     this.formData = {};
      //     this.formData.phone = this.user.user.phone;
      //     this.getPromoter();
      //     // this.formData.phone = this.user.user.phone;
      //     this.$forceUpdate();
      //   }
    },
    // 删除空的children，解决级联组件必须选到最后一级
    deleteEmptyChildren(orgList) {
      for (let item of orgList) {
        if (item.orgList.length) {
          this.deleteEmptyChildren(item.orgList);
        } else {
          delete item.orgList;
        }
      }
    },
    format(option, val, type) {
      if (!option) return;
      if (!type || type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        if (!val || val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    onFieldChange(e) {
      let key = e.target.dataset.key;
      this.formData[key] = e.detail;
    },
    addressChange(e) {
      this.formData.address = e.detail.value;
      this.$forceUpdate();
    },
    // 点击单元格
    onClick(e) {
      this.actionSheet = {
        show: true,
        key: e.target.dataset.key,
        actions: this.options[e.target.dataset.actions]
      };
    },
    onTimeClick(e) {
      this.datetime = {
        value: new Date().getTime(),
        type: e.target.dataset.extfield,
        show: true
      };
      console.log(this.datetime.value, 'this.datetime.value');
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
    // /**
    //  * 上拉菜单选择
    //  */
    // actionSheetSelect(e) {
    //   this.formData[this.actionSheet.field] = e.detail.value;
    // },
    // // 上拉菜单取消
    // actionSheetClose() {
    //   this.actionSheet.show = false;
    // },
    /**
     * 上传图片
     */
    afterRead(e, f) {
      this.formData[f] = this.formData[f] || [];
      common.osg.afterRead(e, this, null, null, res => {
        if (f == 'idcardFrontUrl') {
          this.idcardWithPerson(res.url);
        }
        if (f == 'idcardBackUrl') {
          this.idcardWithNationalEmblem(res.url);
        }
        if (f == 'bankCardUrl') {
          this.bankcard(res.url);
        }
      });
      this.$forceUpdate();
    },
    // 身份证人像面识别/basic/ocr/idcardWithPerson
    idcardWithPerson(url) {
      common.osg.ajax('basic/ocr/idcardWithPerson', { url }, res => {
        // this.formData.address = res.data.address;
        // this.formData.birthday = res.data.birthday;
        // this.formData.idcardNo = res.data.idcardNo;
        // this.formData.nationality = res.data.nationality;
        this.formData.name = res.data.realName;
        this.formData.sex = res.data.sex;
        this.$forceUpdate();
      });
    },
    // 身份证国徽面识别/basic/ocr/idcardWithNationalEmblem
    // idcardWithNationalEmblem(url) {
    //   common.osg.ajax('basic/ocr/idcardWithNationalEmblem', { url }, res => {
    //     // this.formData.expiringDate = res.data.expiringDate;
    //     // this.formData.issueDate = res.data.issueDate;
    //     // this.formData.organ = res.data.organ;
    //     this.$forceUpdate();
    //   });
    // },
    // 银行卡识别/basic/ocr/bankcard
    bankcard(url) {
      common.osg.ajax('basic/ocr/bankcard', { url }, res => {
        this.formData.bankCardNum = res.data.bankCardNum;
        // this.formData.bankCardType = res.data.bankCardType;
        // this.formData.bankCardTypeStr = res.data.bankCardTypeStr;
        this.formData.bankName = res.data.bankName;
        // this.formData.bankcardExpiringDate = res.data.expiringDate;
        this.$forceUpdate();
      });
    },
    // 删除图片
    deleteFile(e, f) {
      this.formData[f].splice(e.detail.index, 1);
      this.$forceUpdate();
    },
    doOpen(path, data, options) {
      common.osg.open(path, data, options);
    },
    pickerDefClose() {
      this.promoterLevelShow = false;
    },
    pickerConfirm(e) {
      this.formData.level = e.target.value.value;
      this.promoterLevelShow = false;
    },

    areaConfirm(e) {
      let values = e.detail.values || e.detail.value;
      let areaVal = [];
      if (values.length >= 1) {
        this.formData.province = values[0].code || values[0].value;
        areaVal.push(values[0].code || values[0].value);
      }
      if (values.length >= 2) {
        this.formData.city = values[1].code || values[1].value;
        areaVal.push(values[1].code || values[1].value);
      }
      if (values.length >= 3) {
        this.formData.district = values[2].code || values[2].value;
        areaVal.push(values[2].code || values[2].value);
      }
      this.formData.area = areaVal; //adcode的数组
      this.formData.subdistrict = '';

      // #ifdef MP-WEIXIN
      this.area.show = false;
      // #endif
      // #ifdef APP-PLUS
      this.$refs.area && this.$refs.area.hide();
      // #endif
      this.$forceUpdate();
      // 查询街道
      this.getSubdistricts(this.formData.area, result => {
        this.$set(this.options, 'subdistricts', result);
      });
    },
    // 通过点击单元格，切换多选组件的选中状态
    onCellToggle(e) {
      const { index, key } = e.currentTarget.dataset;
      const checkbox = this.selectComponent(`.${key}-${index}`);
      checkbox.toggle();
      this.$forceUpdate();
    },
    /**
     * 选择时间 提交
     */
    datetimeConfirm(e) {
      let value = e.detail;
      console.log(value, '--时间提交value');
      //   this.formData.startDate = value;
      if (this.datetime.type == 'startDate') {
        this.formData.startDate = new Date(value)
          .toLocaleString('chinese', {
            hour12: false
          })
          .replace(/\//g, '-');
        console.log(this.formData.startDate, '---开始时间');
      } else if (this.datetime.type == 'endDate') {
        this.formData.endDate = new Date(value)
          .toLocaleString('chinese', {
            hour12: false
          })
          .replace(/\//g, '-');
        console.log(this.formData.endDate, '---结束时间');
      }

      this.datetime.show = false;
    },
    /**
     * 选择时间 取消
     */
    datetimeCancel() {
      this.datetime = {
        show: false,
        type: '',
        field: '',
        value: ''
      };
    },
    // 创建活动、修链帮帮账号
    activityBind() {
      if (!this.verificationState) {
        common.osg.toast('请扫码绑定渠道', 'none');
        return;
      }
      if (this.currentRole._id == '6284006356232419567' && !this.formData.bindOrgId) {
        common.osg.toast('请绑定服务商', 'none');
        return;
      }
      if (!this.formData.activityName) {
        common.osg.toast('活动名称不能为空', 'none');
        return;
      }
      if (this.formData.area.length == 0) {
        common.osg.toast('请选择区域', 'none');
        return;
      }
      if (!this.formData.subdistrict) {
        common.osg.toast('请选择街道', 'none');
        return;
      }
      if (!this.formData.name) {
        common.osg.toast('渠道联系人不能为空', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请填写正确格式的手机号', 'none');
        return;
      }
      if (this.currentRole._id == '6284006356232419567') {
        this.formData.promoterLevel = '4';
      }
      if (this.currentRole._id == '5947016148116027190') {
        this.formData.promoterLevel = '5';
      }
      common.osg.ajax('/biz/activity/bind', { data: JSON.stringify(this.formData) }, res => {
        this.verificationState = false;
        common.osg.toast('绑定成功', 'success');
        this.doOpen('/pages/account/account', '', { mode: 'switchTab' });
      });
    },
    // 获取伙伴
    getPartner() {
      common.osg.ajax(
        'basic/partner/query.do',
        {
          'regex:name|string#or': this.searchValue,
          _all: '1',
          'in:exts.yuhong|array#and': '1,2' //标识是小微
        },
        res => {
          res.data.map(item => {
            item.value = item.orgId;
          });
          this.options.partnerData = res.data;
          this.$forceUpdate();
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
            sortOrder: 'asc'
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
    // 搜索
    onSearch(e) {
      this.searchValue = e.detail;
      // this.fpi.page = 1;
      // this.fpi.rows = 10;
      // this.list = [];
      // this.boundings = [];
      // this.index = 0;
      this.getPartner();
    },
    // 调用高德aip定位返回经纬度
    getAmapCode(callback) {
      common.osg.ajax(
        '~https://restapi.amap.com/v3/geocode/regeo',
        {
          key: '1544e78c6949e7843efff0691ce9dc67',
          location: this.mapData.location,
          extensions: 'base', // 返回结果控制
          batch: false // batch=true为批量查询;batch=false为单点查询;
        },
        res => {
          if (res.status == '1') {
            let data = res.regeocode.addressComponent;
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
            });
          } else {
            callback({});
          }
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
    getArea() {
      common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
        this.area = res;
      });
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #fff !important;
  .xiaoVBind {
    ::v-deep .van-cell__title {
      flex: auto;
      max-width: 110px;
    }
    padding-bottom: 80px;
    .van-cell-group--inset {
      margin: 10px;
    }
    .button-bottom {
      position: fixed;
      bottom: 3px;
      margin-top: 30px;
      width: 100vw;
      padding: 20rpx;
      box-sizing: border-box;
      padding: 20px;
      .c-btn-bottom {
        color: #fff;
        background: linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%);
        font-weight: 500;
        font-size: 18px;
        height: 40px;
        .van-button__icon {
          font-size: 10px;
          font-weight: 600;
        }
      }
    }
    .cell-value-class {
      flex: none;
      .van-checkbox__label--right {
        display: none;
      }
    }
    .c-cell {
      .van-cell__title {
        max-width: 6.2em;
        min-width: 6.2em;
        margin-right: 12px;
      }
      .van-uploader__upload {
        margin: 0;
      }
      .van-uploader__preview {
        margin: 0 !important;
      }
    }
    .c-checkbox-group {
      float: left;
    }
    .van-cell__value {
      color: #323233;
      .selected-list {
        justify-content: flex-end;
      }
    }
    .van-cell__title {
      color: #646566;
    }
    // .van-bottom-enter-to {
    //   overflow-y: hidden;
    // }
    .van-bottom-enter-active {
      height: 440px;
    }
  }
}
</style>
