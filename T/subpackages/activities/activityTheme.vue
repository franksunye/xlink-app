<template>
  <view class="user">
    <van-cell-group>
      <!-- <van-notice-bar left-icon="info-o" text="上传身份证、银行卡可自动识别并填写相关信息。" /> -->
      <van-field
        label="名称"
        :value="formData.name"
        placeholder="请填写"
        data-key="name"
        input-align="right"
        @change="onFieldChange"
      />
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
      <van-field
        label="地址"
        :value="formData.address"
        placeholder="请填写"
        required
        data-key="address"
        input-align="right"
        @change="onFieldChange"
      />
      <van-cell title="海报模板" custom-class="c-cell c-cell-image">
        <van-uploader
          :deletable="false"
          disabled
          accept="image"
          :file-list="formData.tplImageFileid"
          @after-read="afterRead($event, 'tplImageFileid')"
          @delete="deleteFile($event, 'tplImageFileid')"
          :max-count="1"
          data-field="tplImageFileid"
        />
      </van-cell>
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
      <van-field
        label="开始时间之前多少分钟可以签到"
        :value="formData.preStartSignMinites"
        placeholder="请填写"
        data-key="preStartSignMinites"
        input-align="right"
        @change="onFieldChange"
      />
      <van-cell
        title="开始时间"
        :value="formData.startDate"
        @click="onClick"
        data-extfield="startDate"
      ></van-cell>
      <van-cell
        title="结束时间"
        :value="formData.endDate"
        @click="onClick"
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
    <view class="button-bottom">
      <van-button round block color="#0078D0" @click="upsert">确 定</van-button>
    </view>
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
        codecfg_tags: { codeId: 'userTag' },
        codecfg_serviceYears: { codeId: 'serviceYears' }
      },
      formData: {
        defId: '', //推广活动定义id
        tuserId: '', //推广人员id
        area: '',
        province: '',
        city: '',
        district: '',
        startDate: ''
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
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: {}
      },
      activityThemeId: '' //活动主题id
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    this.activityThemeId = param.activityThemeId;
    console.log(this.activityThemeId, '---this.activityThemeId');
    let user = wx.getStorageSync('user');
    this.userId = user.user._id;
    common.osg.codeoption(() => {
      this.getData(this.activityThemeId);
    });
    // this.getOrgs();
    // this.getRoles();
    //   this.currentRole = wx.getStorageSync('currentRole');
  },
  methods: {
    // onLoad查询活动主题字段赋值
    getData(activityThemeId) {
      common.osg.ajax(
        'wmt/biz/activityDef/findById',
        {
          id: activityThemeId
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
    upsert() {
      if (!this.formData.name) {
        common.osg.toast('姓名不能为空', 'name');
        return;
      }
      if (!this.formData.area) {
        common.osg.toast('省市区不能为空', 'area');
        return;
      }
      if (!this.formData.address) {
        common.osg.toast('省市区不能为空', 'address');
        return;
      }
      // if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
      //   common.osg.toast('请填写正确格式的手机号', 'none');
      //   return;
      // }
      this.formData.defId = this.activityThemeId;
      console.log(this.formData, '---formData');
      this.formData.tuserId = this.userId;
      this.formData.tplImageFileid = JSON.stringify(this.formData.tplImageFileid);
      // 创建活动链接地址后拼接/hd，跳转c端活动落地页
      this.formData.tplQrcode = this.insertStr(
        this.formData.tplQrcode,
        this.formData.tplQrcode.lastIndexOf('/'),
        '/hd'
      );
      console.log(this.formData.tplQrcode, '链接');
      delete this.formData._id;
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
      console.log(value, '--时间提交value');
      // this.formData.startDate = value;
      if (this.datetime.type == 'startDate') {
        this.formData.startDate = new Date(value);
        // .toLocaleString('chinese', {
        //   hour12: false
        // })
        // .replace(/\//g, '-');
      } else if (this.datetime.type == 'endDate') {
        this.formData.endDate = new Date(value)
          .toLocaleString('chinese', {
            hour12: false
          })
          .replace(/\//g, '-');
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
