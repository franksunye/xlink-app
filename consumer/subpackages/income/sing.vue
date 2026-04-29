<template>
  <view class="user">
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
        placeholder="请填写"
        required
        data-key="phone"
        input-align="right"
        @change="onFieldChange"
      />

      <van-field
        label="公民身份号码"
        :value="formData.idcardNo"
        placeholder="请填写"
        data-key="idcardNo"
        input-align="right"
        @change="onFieldChange"
      />
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
        input-align="right"
        @change="onFieldChange"
        required
      />
      <!-- <van-field
        label="银行名"
        :value="formData.bankName"
        placeholder="请填写"
        data-key="bankName"
        input-align="right"
        @change="onFieldChange"
      /> -->
    </van-cell-group>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
    ></van-action-sheet>
    <view class="button-bottom">
      <van-button size="small" round block color="#0078D0" @click="upsertUser()">提 交</van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      orgShow: false,
      roleShow: false,
      tagShow: false,
      promoterLevelShow: false,
      options: {
        orgs: [],
        roles: [],
        codecfg_tags: { codeId: 'userTag' },
        codecfg_serviceYears: { codeId: 'serviceYears' },
        codecfg_promoterLevel: { codeId: 'promoterLevel' }
      },
      formData: {
        idcardFrontUrl: [], //身份证人像面识别
        idcardBackUrl: [], //身份证国徽面识别
        bankCardUrl: [], //银行卡照片
        bankCardNum: '',
        idcardNo: '',
        name: '',
        phone: ''
      },
      userId: '',
      currentRole: {},
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: {}
      }
    };
  },
  onLoad: function (param) {
    this.init(param);
    // common.osg.init(this, param, app);

    let user = wx.getStorageSync('user');
    this.formData.phone = user.user.phone;
    this.userId = user.user._id;

    // this.getOrgs();
    // this.getRoles();
    this.currentRole = wx.getStorageSync('currentRole');
  },
  methods: {
    init(param) {
      common.osg.init(this, param, app);
      common.osg.codeoption(() => {
        // this.getUser(this.userId);
        this.$forceUpdate();
      });
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    getUser(userId) {
      common.osg.ajax(
        'biz/promoter/show',
        {
          // 'is:_id|string#and': userId
        },
        res => {
          this.formData.idcardFrontUrl = JSON.parse(res.data.idcardFrontUrl);
          this.formData.idcardBackUrl = JSON.parse(res.data.idcardBackUrl);
          this.formData.bankCardUrl = JSON.parse(res.data.bankCardUrl);
          this.formData.bankCardNum = res.data.bankCardNum;
          this.formData.idcardNo = res.data.idcardNo;
          this.formData.name = res.data.name;
          this.formData.phone = res.data.phone;
          console.log(this.formData, '--this.formData');
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
    // 通过点击单元格，切换多选组件的选中状态
    onCellToggle(e) {
      const { index, key } = e.currentTarget.dataset;
      const checkbox = this.selectComponent(`.${key}-${index}`);
      checkbox.toggle();
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
      common.osg.ajax('basic/ocr/idcardWithPerson', { url }, res => {
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
      common.osg.ajax('basic/ocr/idcardWithNationalEmblem', { url }, res => {
        // this.formData.expiringDate = res.data.expiringDate;
        // this.formData.issueDate = res.data.issueDate;
        // this.formData.organ = res.data.organ;
        this.$forceUpdate();
      });
    },
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
    upsertUser() {
      if (common.osg.isRepeatClick('upsertUser')) {
        return;
      }
      if (!this.formData.name) {
        common.osg.toast('姓名不能为空', 'name');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请填写正确格式的手机号', 'none');
        return;
      }
      if (!this.formData.idcardFrontUrl) {
        common.osg.toast('身份证人像不能为空', 'name');
        return;
      }
      if (!this.formData.idcardBackUrl) {
        common.osg.toast('身份证国徽面不能为空', 'name');
        return;
      }
      if (!this.formData.bankCardNum) {
        common.osg.toast('银行卡卡号不能为空', 'name');
        return;
      }
      debugger;
      this.formData.idcardFrontUrl = this.formData.idcardFrontUrl[0].url;
      this.formData.idcardBackUrl = this.formData.idcardBackUrl[0].url;
      if (this.formData.bankCardUrl.length !== 0) {
        this.formData.bankCardUrl = this.formData.bankCardUrl[0].url;
      }
      //   this.formData.idcardFrontUrl = JSON.stringify(this.formData.idcardFrontUrl);
      //   this.formData.idcardBackUrl = JSON.stringify(this.formData.idcardBackUrl);
      //   this.formData.bankCardUrl = JSON.stringify(this.formData.bankCardUrl);
      common.osg.ajax(
        'biz/zhelong/sign',
        { data: JSON.stringify(this.formData) },

        res => {
          // res.data.idcardFrontUrl = JSON.parse(res.data.idcardFrontUrl);
          // res.data.idcardBackUrl = JSON.parse(res.data.idcardBackUrl);
          // res.data.bankCardUrl = JSON.parse(res.data.bankCardUrl);
          // this.formData = res.data;
          this.doOpen('../web/web', {
            url: res.data.data.signUrl
          });
          // common.osg.alert('保存成功');
        }
      );
      this.getUser();
    },
    doOpen(path, data, options) {
      common.osg.open(path, data, options);
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #fff !important;
  .user {
    padding-bottom: 80px;
    .van-cell-group--inset {
      margin: 10px;
    }
    .button-bottom {
      width: 100vw;
      position: fixed;
      z-index: 2;
      bottom: 3px;
      text-align: center;
    }
    .van-cell__title {
      max-width: 6.2em;
      min-width: 6.2em;
      padding-right: 7px;
      margin-right: 7px;
    }
    .van-uploader__upload {
      margin: 0;
    }
    .van-uploader__preview {
      margin: 0 !important;
    }
    .c-checkbox-group {
      float: left;
    }
  }
}
</style>
