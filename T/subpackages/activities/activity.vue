<template>
  <view class="user">
    <van-cell-group>
      <!-- <van-notice-bar left-icon="info-o" text="上传身份证、银行卡可自动识别并填写相关信息。" /> -->
      <!-- <van-cell
        title="活动模板"
        is-link
        :value="format('activityDef', formData.defId, 'select')"
        required
        @click="activityDef.show = true"
      /> -->
      <van-popup :show="activityDef.show" position="bottom" custom-style="height: 60%;">
        <view class="c-flex c-flex-col c-h-100">
          <van-picker
            show-toolbar
            :columns="options.activityDef"
            value-key="name"
            @confirm="activityDefConfirm"
            @cancel="activityDefClose"
          />
        </view>
      </van-popup>
      <van-field
        disabled
        label="活动名称"
        :value="formData.name"
        placeholder="请填写"
        required
        data-key="name"
        input-align="right"
        @change="onFieldChange"
      />
      <!-- @click="area.show = true" -->
      <van-cell
        disabled
        title="区域："
        is-link
        :value="
          area.areaList.province_list[formData.province] +
          area.areaList.city_list[formData.city] +
          area.areaList.county_list[formData.district]
        "
        required
      />
      <van-field
        disabled
        label="地址"
        :value="formData.address"
        placeholder="请填写"
        required
        data-key="address"
        input-align="right"
        @change="onFieldChange"
      />
      <!-- <van-cell title="海报模板" custom-class="c-cell c-cell-image">
        <van-uploader
          :deletable="false"
          disabled
          multiple
          accept="image"
          :file-list="formData.tplImageFileid"
          @after-read="afterRead($event, 'tplImageFileid')"
          @delete="deleteFile($event, 'tplImageFileid')"
          :max-count="1"
          data-field="tplImageFileid"
        />
      </van-cell> -->
      <!-- <van-field
        disabled
        label="海报二维码内容"
        :value="formData.tplQrcode"
        placeholder="请填写"
        data-key="tplQrcode"
        input-align="right"
        @change="onFieldChange"
      /> -->
      <!-- <van-field
        disabled
        label="海报二维码x坐标"
        :value="formData.tplQrcodex"
        placeholder="请填写"
        data-key="tplQrcodex"
        input-align="right"
        @change="onFieldChange"
      /> -->
      <!-- <van-field
        disabled
        label="海报二维码y坐标"
        :value="formData.tplQrcodey"
        placeholder="请填写"
        data-key="tplQrcodey"
        input-align="right"
        @change="onFieldChange"
      /> -->
      <!-- <van-field
        disabled
        label="海报二维码大小"
        :value="formData.tplQrcodeSize"
        placeholder="请填写"
        data-key="tplQrcodeSize"
        input-align="right"
        @change="onFieldChange"
      /> -->
      <!-- <van-field
        label="开始时间之前多少分钟可以签到"
        :value="formData.preStartSignMinites"
        placeholder="请填写"
        data-key="preStartSignMinites"
        input-align="right"
        @change="onFieldChange"
      /> -->
      <!-- @click="onClick" -->
      <van-cell
        disabled
        title="开始时间"
        :value="formData.startDate"
        data-extfield="startDate"
      ></van-cell>
      <!-- @click="onClick" -->
      <van-cell
        disabled
        title="结束时间"
        :value="formData.endDate"
        data-extfield="endDate"
      ></van-cell>
    </van-cell-group>

    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
    ></van-action-sheet>
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
    <!-- 选择推广活动定义id -->

    <!-- <view class="button-bottom">
      <van-button round block color="#0078D0" @click="upsert">确 定</van-button>
    </view> -->
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
      options: {
        orgs: [],
        roles: [],
        activityDef: [],
        codecfg_tags: { codeId: 'userTag' },
        codecfg_serviceYears: { codeId: 'serviceYears' }
      },
      formData: {
        exts: {
          desc: ''
        },
        defId: '', //推广活动定义id
        tuserId: '', //推广人员id
        area: '',
        province: '',
        city: '',
        district: '',
        startDate: '',
        tplQrcode: '',
        tplQrcodeSize: '',
        tplQrcodex: '',
        tplQrcodey: ''
      },
      userId: '',
      // currentRole: {},
      // 省市区选择
      area: {
        show: false,
        areaList: Object.assign({}, areajs.default)
      },
      // 时间选择器
      datetime: {
        show: false,
        type: '',
        value: new Date().getTime()
      },
      activityDef: {
        show: false,
        data: []
      },
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: {}
      },
      activityId: '' //活动id
    };
  },
  onLoad: function (param) {
    this.activityId = param.activityId;
    console.log(this.activityId, 'this.activityId');
    common.osg.init(this, param, app);
    let user = wx.getStorageSync('user');
    this.userId = user.user._id;
    common.osg.codeoption(() => {
      if (this.activityId) {
        this.getActivity(this.activityId);
        this.formData.defId = this.activityId;
      }
    });
    this.getActivityDef();

    // this.getOrgs();
    // this.getRoles();
    //   this.currentRole = wx.getStorageSync('currentRole');
  },
  methods: {
    // 查询出所有主题推广大使选择活动模板
    getActivityDef(_id, callback) {
      common.osg.ajax(
        'wmt/biz/activityDef/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:_id|string#and': _id || ''
        },
        res => {
          res.data.map(item => {
            item.value = item._id;
          });
          this.options.activityDef = res.data;
          if (callback) callback(res.data);
        }
      );
    },
    getActivity(activityId) {
      common.osg.ajax(
        'wmt/biz/activity/findById',
        {
          id: activityId
        },
        res => {
          res.data.tplImageFileid = JSON.parse(res.data.tplImageFileid);
          this.formData = res.data;
          console.log(this.formData, '--this.formData');
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
    onClick(e) {
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
    // 删除图片
    deleteFile(e, f) {
      this.formData[f].splice(e.detail.index, 1);
      this.$forceUpdate();
    },
    upsert() {
      //   if (!this.formData.name) {
      //     common.osg.toast('姓名不能为空', 'name');
      //     return;
      //   }
      //   if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
      //     common.osg.toast('请填写正确格式的手机号', 'none');
      //     return;
      //   }
      // this.formData.defId = this.activityId;
      // if (!this.formData._id) {
      //   this.formData.tplQrcode = this.insertStr(
      //     this.formData.tplQrcode,
      //     this.formData.tplQrcode.lastIndexOf('/'),
      //     '/hd'
      //   );
      // }
      // this.formData.tuserId = this.userId;
      this.formData.tplImageFileid = JSON.stringify(this.formData.tplImageFileid);
      common.osg.ajax('wmt/biz/activity/upsert', { data: JSON.stringify(this.formData) }, res => {
        common.osg.alert('保存成功');
        wx.navigateBack({
          delta: 1
        });
      });
      // this.getData();
    },
    // 字符串指定位置添加字符
    insertStr(source, start, newStr) {
      return source.slice(0, start) + newStr + source.slice(start);
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
      this.formData.subdistrict = '';
      this.area.show = false;
    },
    /**
     * 选择时间 提交
     */
    datetimeConfirm(e) {
      let value = e.detail;
      if (this.datetime.type == 'startDate') {
        // this.formData.startDate = new Date(value)
        //   .toLocaleString('chinese', {
        //     hour12: false
        //   })
        //   .replace(/\//g, '-');
        this.formData.startDate = this.formattTime(value);
        // console.log(this.formData.startDate, '---this.formData.startDate');
      } else if (this.datetime.type == 'endDate') {
        // this.formData.endDate = new Date(value)
        //   .toLocaleString('chinese', {
        //     hour12: false
        //   })
        //   .replace(/\//g, '-');
        this.formData.endDate = this.formattTime(value);
      }

      this.datetime.show = false;
    },
    //时间格式转化
    formattTime(dateValue) {
      let value = dateValue;
      if (typeof dateValue == 'object') {
        value == value.valueOf();
      }

      function zeroFill(num) {
        return num < 10 ? '0' + num : num;
      }
      let date = new Date(dateValue);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      return Y + M + zeroFill(D) + ' ' + zeroFill(h) + ':' + zeroFill(m) + ':' + zeroFill(s);
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
    /**
     * 选择推广活动定义id
     */
    // activityDefChange(e) {
    // },
    /**
     * 选择推广活动定义id 确定
     */
    activityDefConfirm(e) {
      this.formData.defId = e.target.value.value;
      console.log(this.formData.defId, '---选中后的主题defId');
      this.getActivityDef(this.formData.defId, res => {
        // this.formData = res[0];
        this.formData.tuserId = this.userId;
        this.formData.defId = res[0]._id;
        // console.log(this.formData, '--this.formData');
        this.formData.tplQrcode = res[0].tplQrcode;
        this.formData.tplImageFileid = JSON.parse(res[0].tplImageFileid);
        this.formData.preStartSignMinites = res[0].preStartSignMinites;
        this.formData.startDate = res[0].startDate;
        this.formData.endDate = res[0].endDate;
        this.formData.tplQrcodeSize = res[0].tplQrcodeSize;
        this.formData.tplQrcodex = res[0].tplQrcodex;
        this.formData.tplQrcodey = res[0].tplQrcodey;
        this.formData.exts.desc = res[0].exts.desc;
      });
      this.activityDef.show = false;
    },
    /**
     * 选择推广活动定义id 取消
     */
    activityDefClose(e) {
      this.formData = {};
      // this.formData.tplQrcodex='';
      // this.formData.tplQrcodey='';
      // this.formData.tplQrcodeSize='',
      // this.formData.tplQrcode = '';
      // this.formData.tuserId = '';
      // this.formData.preStartSignMinites = '';
      // this.formData.startDate = '';
      // this.formData.endDate = '';
      this.activityDef.show = false;
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
      bottom: 30px;
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
  //   .user {
  //     height: 100vh;
  //     padding: 10px 0 160px;
  //     background: #fbfbfb;
  //     position: inherit;
  //     &:after {
  //       position: fixed;
  //       content: '';
  //       border-bottom: 2rpx solid #efefef;
  //       width: 200%;
  //       top: 0;
  //       left: 0;
  //       transform: scale(0.5);
  //       transform-origin: 0 0;
  //       opacity: 0.99;
  //     }
  //     .user-avatar {
  //       text-align: right;
  //       .avatar-wrapper {
  //         width: 36px;
  //         height: 36px !important;
  //         border-radius: 5px !important;
  //       }
  //     }
  //     .cell-value-class {
  //       flex: none;
  //       .van-checkbox__label--right {
  //         display: none;
  //       }
  //     }
  //     .c-cell {
  //       .van-cell__title {
  //         max-width: 6.2em;
  //         min-width: 6.2em;
  //         margin-right: 12px;
  //       }
  //       .van-uploader__upload {
  //         margin: 0;
  //       }
  //       .van-uploader__preview {
  //         margin: 0 !important;
  //       }
  //     }
  //     .c-cell-image {
  //       display: flex;
  //       flex-direction: column;
  //       align-items: flex-start;
  //       .van-cell__value {
  //         margin: 10px 0 0;
  //         .van-uploader__upload {
  //           width: 100px !important;
  //           height: 100px !important;
  //           border-radius: 8px;
  //         }
  //         .van-uploader__preview-image {
  //           width: 100px !important;
  //           height: 100px !important;
  //           border-radius: 8px;
  //         }
  //       }
  //     }
  //     .button-bottom {
  //       width: calc(100vw - 30px);
  //       padding: 0 15px;
  //       position: fixed;
  //       z-index: 2;
  //       bottom: 20px;
  //       text-align: center;
  //     }
  //   }
}
</style>
