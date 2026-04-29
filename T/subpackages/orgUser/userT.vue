<template>
  <view class="user">
    <van-tabs color="#106CFF" :active="active" @change="onChange">
      <van-tab title="推广大使认证" name="t" v-if="labourShow == false">
        <van-cell-group>
          <van-notice-bar left-icon="info-o" text="上传身份证、银行卡可自动识别并填写相关信息。" />
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
          <van-cell title="身份证国徽面识别" custom-class="c-cell c-cell-image">
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
          </van-cell>
          <van-field
            label="姓名"
            :value="formData.name"
            placeholder="请填写"
            required
            data-key="name"
            input-align="right"
            @change="onFieldChange"
          />
          <van-field
            label="手机"
            :value="formData.phone"
            type="number"
            placeholder="请填写"
            required
            data-key="phone"
            input-align="right"
            @change="onFieldChange"
          />
          <!-- <van-field
        label="民族"
        :value="formData.nationality"
        placeholder="请填写"
        data-key="nationality"
        input-align="right"
        @change="onFieldChange"
      /> -->
          <van-field
            label="住址"
            :value="formData.address"
            placeholder="请填写"
            data-key="address"
            input-align="right"
            @change="onFieldChange"
          />
          <van-field
            label="公民身份号码"
            :value="formData.idcardNo"
            placeholder="请填写"
            data-key="idcardNo"
            type="idcard"
            input-align="right"
            @change="onFieldChange"
          />
          <!-- <van-field
        label="出生"
        :value="formData.birthday"
        placeholder="请填写"
        data-key="birthday"
        input-align="right"
        @change="onFieldChange"
      /> -->
          <van-field
            label="性别"
            :value="formData.sex"
            placeholder="请填写"
            data-key="sex"
            input-align="right"
            @change="onFieldChange"
          />
          <!-- <van-field
        label="失效日期"
        :value="formData.expiringDate"
        placeholder="请填写"
        data-key="expiringDate"
        input-align="right"
        @change="onFieldChange"
      /> -->
          <!-- <van-field
        label="签发日期"
        :value="formData.issueDate"
        placeholder="请填写"
        data-key="issueDate"
        input-align="right"
        @change="onFieldChange"
      /> -->
          <!-- <van-field
        label="签发机关"
        :value="formData.organ"
        placeholder="请填写"
        data-key="organ"
        input-align="right"
        @change="onFieldChange"
      /> -->
        </van-cell-group>

        <van-cell-group>
          <van-cell title="银行卡识别" custom-class="c-cell c-cell-image">
            <van-uploader
              style="display: flex"
              multiple
              accept="image"
              :file-list="formData.bankCardUrl"
              @after-read="afterRead($event, 'bankCardUrl')"
              @delete="deleteFile($event, 'bankCardUrl')"
              :max-count="1"
              data-field="bankCardUrl"
            />
          </van-cell>
          <van-field
            label="卡号"
            :value="formData.bankCardNum"
            placeholder="请填写"
            data-key="bankCardNum"
            type="number"
            input-align="right"
            @change="onFieldChange"
          />
          <van-field
            label="银行名"
            :value="formData.bankName"
            placeholder="请填写"
            data-key="bankName"
            input-align="right"
            @change="onFieldChange"
          />
          <van-field
            label="持卡人"
            :value="formData.holderName"
            placeholder="请填写"
            data-key="holderName"
            input-align="right"
            @change="onFieldChange"
          />
          <!-- <van-field
        label="卡片类型编码"
        :value="formData.bankCardType"
        placeholder="请填写"
        data-key="bankCardType"
        input-align="right"
        @change="onFieldChange"
      /> -->
          <!-- <van-field
        label="卡片类型文字"
        :value="formData.bankCardTypeStr"
        placeholder="请填写"
        data-key="bankCardTypeStr"
        input-align="right"
        @change="onFieldChange"
      /> -->
          <!-- <van-field
        label="有效期"
        :value="formData.bankcardExpiringDate"
        placeholder="请填写"
        data-key="bankcardExpiringDate"
        input-align="right"
        @change="onFieldChange"
      /> -->
        </van-cell-group>
        <!-- <van-cell-group>
          <van-cell
            title="我是"
            is-link
            :value="format('promoterLevel', formData.level, 'select')"
            @click.native="promoterLevelShow = true"
          />
          <van-cell
            v-if="formData.level == '2' || formData.level == '3'"
            title="证件上传"
            custom-class="c-cell c-cell-image"
          >
            <van-uploader
              style="display: flex"
              multiple
              accept="image"
              :file-list="formData.cardUrl"
              @after-read="afterRead($event, 'cardUrl')"
              @delete="deleteFile($event, 'cardUrl')"
              :max-count="1"
              data-field="cardUrl"
            />
          </van-cell>
        </van-cell-group> -->
        <!-- <view class="button-bottom">
          <van-button
            size="small"
            style="height: 40px"
            round
            block
            color="#0078D0"
            @click="upsertPromoter"
          >
            确 定
          </van-button>
        </view> -->
        <view class="button-bottom">
          <van-button
            color="linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%)"
            size="normal"
            block
            round
            custom-class="c-btn-bottom"
            @click="upsertPromoter()"
          >
            确 定
          </van-button>
        </view>
      </van-tab>
      <van-tab title="工人认证" name="g">
        <van-cell-group>
          <van-cell required title="头像" custom-class="c-cell c-cell-image">
            <van-uploader
              style="display: flex"
              multiple
              accept="image"
              :file-list="formData.avatar"
              @after-read="afterRead($event, 'avatar')"
              @delete="deleteFile($event, 'avatar')"
              :max-count="1"
              data-field="avatar"
            />
          </van-cell>
          <van-field
            label="姓名"
            :value="formData.name"
            placeholder="请填写"
            required
            data-key="name"
            input-align="right"
            @change="onFieldChange"
          />
          <van-field
            label="年龄"
            required
            :value="formData.age"
            type="digit"
            placeholder="请填写"
            data-key="age"
            input-align="right"
            @change="onFieldChange"
          />
          <van-cell
            title="性别"
            is-link
            :value="format('SEX', formData.sex, 'select')"
            @click.native="sexShow = true"
          />
          <van-cell
            title="工作状态"
            required
            is-link
            :value="format('workerStatus', formData.status, 'select')"
            @click.native="statusShow = true"
          />
          <van-field
            label="联系方式"
            :value="formData.phone"
            required
            type="number"
            placeholder="请填写"
            data-key="phone"
            input-align="right"
            @change="onFieldChange"
          />
          <van-field
            label="其他联系方式"
            :value="formData.otherPhone"
            type="number"
            placeholder="请填写"
            data-key="otherPhone"
            input-align="right"
            @change="onFieldChange"
          />
          <van-cell
            title="省市区"
            is-link
            :value="
              area.areaList.province_list[formData.province] +
              area.areaList.city_list[formData.city] +
              area.areaList.county_list[formData.district]
            "
            required
            @click="area.show = true"
          />
          <van-field
            :value="formData.address"
            data-key="address"
            label="详细地址"
            input-align="right"
            required
            @change="onFieldChange"
          />
          <van-cell
            title="技能"
            is-link
            readonly
            autosize
            input-align="right"
            type="textarea"
            :value="format('workerAbilitys', formData.abilitys, 'multiple')"
            @click.native="abilitysShow = true"
          />
          <van-cell
            title="标签"
            is-link
            readonly
            autosize
            :value="format('userTag', formData.tags, 'multiple')"
            @click.native="tagsShow = true"
          />
          <van-cell title="证书" custom-class="c-cell c-cell-image">
            <van-uploader
              style="display: flex"
              multiple
              accept="image"
              :file-list="formData.credentials"
              @after-read="afterRead($event, 'credentials')"
              @delete="deleteFile($event, 'credentials')"
              :max-count="5"
              data-field="credentials"
            />
          </van-cell>
          <van-field
            label="积分"
            :value="formData.integral"
            type="number"
            placeholder="请填写"
            data-key="integral"
            input-align="right"
            @change="onFieldChange"
          />
          <van-cell
            title="等级"
            is-link
            :value="format('technicalGrade', formData.level, 'select')"
            @click.native="levelShow = true"
          />
          <van-field
            label="期望日薪（元）"
            required
            :value="formData.salary"
            placeholder="请填写"
            data-key="salary"
            input-align="right"
            @change="onFieldChange"
          />
          <van-field
            label="简介"
            :value="formData.memo"
            placeholder="请填写"
            data-key="memo"
            input-align="right"
            @change="onFieldChange"
          />
        </van-cell-group>
        <view class="button-bottom">
          <van-button
            color="linear-gradient(144.73deg, #ff737c 18.98%, #d7000d 97.3%)"
            size="normal"
            block
            round
            custom-class="c-btn-bottom"
            @click="upsertLabour"
          >
            确 定
          </van-button>
        </view>
      </van-tab>
    </van-tabs>
    <!-- 性别弹出框 -->
    <van-popup
      :show="sexShow"
      close-icon-position="top-left"
      position="bottom"
      custom-style="height: 50%"
      @close="sexShow = false"
    >
      <van-picker
        show-toolbar
        :columns="options.SEX"
        value-key="name"
        @confirm="pickerConfirmG('sex', $event)"
        @cancel="pickerDefCloseG('sex')"
      />
    </van-popup>
    <!-- 工作状态弹出框 -->
    <van-popup
      :show="statusShow"
      close-icon-position="top-left"
      position="bottom"
      custom-style="height: 50%"
      @close="sexShow = false"
    >
      <van-picker
        show-toolbar
        :columns="options.workerStatus"
        value-key="name"
        @confirm="pickerConfirmG('status', $event)"
        @cancel="pickerDefCloseG('status')"
      />
    </van-popup>
    <!-- 推广大使等级弹窗框 -->
    <van-popup
      :show="promoterLevelShow"
      close-icon-position="top-left"
      position="bottom"
      custom-style="height: 50%"
      @close="promoterLevelShow = false"
    >
      <van-picker
        show-toolbar
        :columns="options.promoterLevel"
        value-key="name"
        @confirm="pickerConfirm"
        @cancel="pickerDefClose"
      />
    </van-popup>
    <!-- 技能 -->
    <van-popup
      :show="abilitysShow"
      round
      position="bottom"
      custom-style="height: 50%;"
      @close="abilitysShow = false"
    >
      <van-checkbox-group :value="formData.abilitys" data-key="abilitys" @change="onFieldChange">
        <van-cell-group>
          <block v-for="(item, i) in options.workerAbilitys" :key="i">
            <van-cell
              :title="item.name"
              value-class="cell-value-class"
              clickable
              :data-index="i"
              data-key="abilitys"
              @click="onCellToggle"
            >
              <van-checkbox @click="noop" :class="'abilitys-' + i" :name="item.value" />
            </van-cell>
          </block>
        </van-cell-group>
      </van-checkbox-group>
    </van-popup>
    <!-- 标签 -->
    <van-popup
      :show="tagsShow"
      round
      position="bottom"
      custom-style="height: 50%;"
      @close="tagsShow = false"
    >
      <van-checkbox-group :value="formData.tags" data-key="tags" @change="onFieldChange">
        <van-cell-group>
          <block v-for="(item, i) in options.userTag" :key="i">
            <van-cell
              :title="item.name"
              value-class="cell-value-class"
              clickable
              :data-index="i"
              data-key="tags"
              @click="onCellToggle"
            >
              <van-checkbox @click="noop" :class="'tags-' + i" :name="item.value" />
            </van-cell>
          </block>
        </van-cell-group>
      </van-checkbox-group>
    </van-popup>
    <!-- <van-popup
      :show="tagsShow"
      close-icon-position="top-left"
      position="bottom"
      custom-style="height: 50%"
      @close="tagsShow = false"
    >
      <van-picker
        show-toolbar
        :columns="options.userTag"
        value-key="name"
        @confirm="pickerConfirmG('tags', $event)"
        @cancel="pickerDefCloseG('tags')"
      />
    </van-popup> -->
    <!-- 等级 -->
    <van-popup
      :show="levelShow"
      close-icon-position="top-left"
      position="bottom"
      custom-style="height: 50%"
      @close="levelShow = false"
    >
      <van-picker
        show-toolbar
        :columns="options.technicalGrade"
        value-key="name"
        @confirm="pickerConfirmG('level', $event)"
        @cancel="pickerDefCloseG('level')"
      />
    </van-popup>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
    ></van-action-sheet>
    <!-- 省市区 -->
    <van-popup :show="area.show" position="bottom">
      <van-area :area-list="area.areaList" @confirm="areaConfirm" @cancel="area.show = false" />
    </van-popup>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
const areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      orgShow: false,
      roleShow: false,
      tagShow: false,
      promoterLevelShow: false,
      sexShow: false,
      statusShow: false,
      abilitysShow: false,
      tagsShow: false,
      levelShow: false,
      user: {},
      options: {
        orgs: [],
        roles: [],
        codecfg_userTag: { codeId: 'userTag' },
        codecfg_serviceYears: { codeId: 'serviceYears' },
        codecfg_promoterLevel: { codeId: 'promoterLevel' },
        codecfg_SEX: { codeId: 'SEX' },
        codecfg_workerStatus: { codeId: 'workerStatus' },
        codecfg_workerAbilitys: { codeId: 'workerAbilitys' },
        workerAbilitys: [],
        codecfg_technicalGrade: { codeId: 'technicalGrade' }
      },
      formData: {
        phone: '',
        idcardFrontUrl: [], //身份证人像面识别
        idcardBackUrl: [], //身份证国徽面识别
        bankCardUrl: [], //银行卡照片
        level: 1,
        avatar: [], //工人头像
        credentials: [], //工人证书
        area: '',
        province: '',
        city: '',
        district: '',
        abilitys: [] //技能
      },
      // gFormData: {
      // }, //工人注册
      // 省市区选择
      area: {
        show: false,
        areaList: Object.assign({}, areajs.default)
      },
      userId: '',
      currentRole: {},
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: {}
      },
      active: 't', // t推广大使  g工人
      params: {},
      labourShow: false
    };
  },
  onLoad: function (params) {
    this.init(params);
    // common.osg.init(this, param, app);

    // this.user = wx.getStorageSync('user');
    // this.formData.phone = this.user.user.phone;
    // this.userId = this.user.user._id;

    // // this.getOrgs();
    // // this.getRoles();
    // this.currentRole = wx.getStorageSync('currentRole');
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
        if (params.shareType == 'grzc') {
          this.active = 'g';
          this.labourShow = true;
        }
        console.log(this.params, '---扫码进来的参数');
      } else {
        this.params = params;
      }
      common.osg.init(this, params, app);
      common.osg.doLogin({ inviteUserId: this.params.userId || '' }, res => {
        this.user = wx.getStorageSync('user');
        this.formData.phone = this.user.user.phone;
        this.userId = this.user.user._id;
        if (this.user.user.promoterLevel == 4) {
          this.formData.level = this.user.user.promoterLevel;
        }
        this.currentRole = wx.getStorageSync('currentRole');
        if (!common.osg.isLogined()) {
          this.isLogined = false;
          this.formData = {};
          return;
        } else {
          common.osg.codeoption(() => {
            if (this.active == 't') {
              this.getPromoter();
            }
            if (this.active == 'g') {
              this.getLabour();
            }
            this.$forceUpdate();
          });
          this.isLogined = true;
        }
      });
      // common.osg.codeoption(() => {
      //   this.getPromoter(this.userId);
      //   this.$forceUpdate();
      // });
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    onChange(e) {
      if (e.detail.name == 'g') {
        this.formData = {};
        this.getLabour();
        this.$forceUpdate();
      }
      if (e.detail.name == 't') {
        this.formData = {};
        this.formData.phone = this.user.user.phone;
        this.getPromoter();

        // this.formData.phone = this.user.user.phone;
        this.$forceUpdate();
      }
    },
    getPromoter(userId) {
      common.osg.ajax(
        'wmt/biz/promoter/show',
        {
          // 'is:_id|string#and': userId
        },
        res => {
          if (res.data) {
            if (common.osg.isJson(res.data.idcardFrontUrl)) {
              res.data.idcardFrontUrl = JSON.parse(res.data.idcardFrontUrl);
            } else {
              res.data.idcardFrontUrl = [];
            }
            if (common.osg.isJson(res.data.idcardBackUrl)) {
              res.data.idcardBackUrl = JSON.parse(res.data.idcardBackUrl);
            } else {
              res.data.idcardBackUrl = [];
            }
            if (common.osg.isJson(res.data.bankCardUrl)) {
              res.data.bankCardUrl = JSON.parse(res.data.bankCardUrl);
            } else {
              res.data.bankCardUrl = [];
            }
            this.formData = res.data;
            if (this.user.user.promoterLevel == 4) {
              this.formData.level = this.user.user.promoterLevel;
            }
          }
          // res.data.idcardFrontUrl = JSON.parse(res.data.idcardFrontUrl);
          // res.data.idcardBackUrl = JSON.parse(res.data.idcardBackUrl);
          // res.data.bankCardUrl = JSON.parse(res.data.bankCardUrl);
        }
      );
    },
    getLabour(userId) {
      common.osg.ajax(
        'wmt/biz/labour/show',
        {
          // 'is:_id|string#and': userId
        },
        res => {
          if (res.data) {
            let arr = [];
            arr.push({ url: res.data.avatar });
            this.formData = res.data;
            this.formData.avatar = arr;
          }
        }
      );
    },
    // 选择头像
    onChooseAvatar(e) {
      let filePath = e.detail.avatarUrl;
      common.osg.ajax(
        'back/super/file/upToken.do',
        {
          fileName: filePath.split('/')[filePath.split('/').length - 1]
        },
        data => {
          let that = this;
          wx.uploadFile({
            url: 'https://up-z1.qiniup.com',
            filePath: e.detail.avatarUrl,
            name: 'file',
            formData: data,
            success(res) {
              that.formData.avatar = common.osg.downloadUrl + JSON.parse(res.data).key;
            },
            fail() {
              common.osg.toast('上传失败', 'error');
            }
          });
        },
        {
          noload: true
        }
      );
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
    orgClick() {
      this.orgShow = true;
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
    // 点击单元格
    onClick(f, valueOption) {
      this.actionSheet = {
        show: true,
        actions: this.options[valueOption],
        field: f
      };
    },
    /**
     * 上拉菜单选择
     */
    actionSheetSelect(e) {
      this.formData[this.actionSheet.field] = e.detail.value;
    },
    // 上拉菜单取消
    actionSheetClose() {
      this.actionSheet.show = false;
    },
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
      common.osg.ajax('wmt/basic/ocr/idcardWithPerson', { url }, res => {
        this.formData.address = res.data.address;
        // this.formData.birthday = res.data.birthday;
        this.formData.idcardNo = res.data.idcardNo;
        // this.formData.nationality = res.data.nationality;
        this.formData.name = res.data.realName;
        this.formData.sex = res.data.sex;
        this.$forceUpdate();
      });
    },
    // 身份证国徽面识别/basic/ocr/idcardWithNationalEmblem
    idcardWithNationalEmblem(url) {
      common.osg.ajax('wmt/basic/ocr/idcardWithNationalEmblem', { url }, res => {
        // this.formData.expiringDate = res.data.expiringDate;
        // this.formData.issueDate = res.data.issueDate;
        // this.formData.organ = res.data.organ;
        this.$forceUpdate();
      });
    },
    // 银行卡识别/basic/ocr/bankcard
    bankcard(url) {
      common.osg.ajax('wmt/basic/ocr/bankcard', { url }, res => {
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
    // 推广大使认证
    upsertPromoter() {
      if (!this.formData.name) {
        common.osg.toast('姓名不能为空', 'name');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请填写正确格式的手机号', 'none');
        return;
      }
      let params = common.osg.deepCopy(this.formData);
      params.idcardFrontUrl = JSON.stringify(this.formData.idcardFrontUrl);
      params.idcardBackUrl = JSON.stringify(this.formData.idcardBackUrl);
      params.bankCardUrl = JSON.stringify(this.formData.bankCardUrl);
      debugger;
      params.level = JSON.parse(this.formData.level);
      console.log(params.level, '保存时的level');
      // 删除多余字段
      delete params.avatar;
      delete params.credentials;
      delete params.abilitys;
      delete params.area;
      delete params.province;
      delete params.city;
      delete params.district;
      common.osg.ajax(
        'wmt/biz/promoter/authentication',
        { data: JSON.stringify(params) },

        res => {
          // res.data.idcardFrontUrl = JSON.parse(res.data.idcardFrontUrl);
          // res.data.idcardBackUrl = JSON.parse(res.data.idcardBackUrl);
          // res.data.bankCardUrl = JSON.parse(res.data.bankCardUrl);
          // this.formData = res.data;
          this.getPromoter();
          common.osg.alert('保存成功');
          this.doOpen('/pages/index/index', '', { mode: 'switchTab' });
          // common.osg.doLogin();
        }
      );
    },
    // 工人认证
    upsertLabour() {
      if (!this.formData.name) {
        common.osg.toast('姓名不能为空', 'name');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请填写正确格式的手机号', 'none');
        return;
      }
      this.formData.avatar = this.formData.avatar[0].url;
      // this.formData.avatar = JSON.stringify(this.formData.avatar);
      // this.formData.idcardBackUrl = JSON.stringify(this.formData.idcardBackUrl);
      // this.formData.bankCardUrl = JSON.stringify(this.formData.bankCardUrl);
      common.osg.ajax(
        'wmt/biz/labour/authentication',
        { data: JSON.stringify(this.formData) },

        res => {
          this.getLabour();
          common.osg.alert('保存成功');
          this.doOpen('/pages/index/index', '', { mode: 'switchTab' });
        },
        {
          failCallback: this.doOpen('/pages/index/index', '', { mode: 'switchTab' })
        }
      );
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
    pickerDefCloseG(val) {
      if (val == 'sex') {
        this.sexShow = false;
      }
      if (val == 'status') {
        this.statusShow = false;
      }
      // if (val == 'abilitys') {
      //   this.abilitysShow = false;
      // }
      if (val == 'tags') {
        this.tagsShow = false;
      }
      if (val == 'level') {
        this.levelShow = false;
      }
    },
    pickerConfirmG(val, e) {
      if (val == 'sex') {
        this.formData.sex = e.target.value.value;
        this.sexShow = false;
      }
      if (val == 'status') {
        this.formData.status = e.target.value.value;
        this.statusShow = false;
      }
      // if (val == 'abilitys') {
      //   this.formData.abilitys = e.target.value.value;
      //   this.abilitysShow = false;
      // }
      if (val == 'tags') {
        this.formData.tags = e.target.value.value;
        this.tagsShow = false;
      }
      if (val == 'level') {
        this.formData.level = e.target.value.value;
        this.levelShow = false;
      }
    },
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
      this.area.show = false;
    },
    // 通过点击单元格，切换多选组件的选中状态
    onCellToggle(e) {
      const { index, key } = e.currentTarget.dataset;
      const checkbox = this.selectComponent(`.${key}-${index}`);
      checkbox.toggle();
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
page {
  background-color: #fff !important;
  .user {
    padding-bottom: 80px;
    .van-cell-group--inset {
      margin: 10px;
    }
    // .button-bottom {
    //   width: 100vw;
    //   position: fixed;
    //   z-index: 2;
    //   bottom: 3px;
    //   text-align: center;
    // }
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
    }
  }
  .button-bottom {
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
}
</style>
