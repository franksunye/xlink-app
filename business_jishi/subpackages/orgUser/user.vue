<template>
  <view class="user" @click.capture="track">
    <van-cell-group>
      <!-- #ifdef MP-WEIXIN -->
      <van-cell title="照片" custom-class="c-cell c-cell-image">
        <view class="user-avatar">
          <van-button
            custom-class="avatar-wrapper"
            open-type="chooseAvatar"
            @chooseavatar="onChooseAvatar"
            custom-style=" min-height: 100px; max-width: 100px; border:none;"
          >
            <van-image width="80" height="80" class="c-flex" :src="formData.avatar" />
          </van-button>
        </view>
      </van-cell>
      <van-field
        label="编号"
        :value="formData.code"
        placeholder="请填写"
        required
        data-key="code"
        input-align="right"
        @change="onFieldChange"
      />
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
        placeholder="手机号将作为登录账号"
        required
        data-key="phone"
        input-align="right"
        @change="onFieldChange"
      />
      <van-field
        v-if="!formData._id"
        label="密码"
        :value="formData.passwd"
        placeholder="请填写至少6位密码"
        required
        data-key="passwd"
        input-align="right"
        @change="onFieldChange"
      />
      <van-field
        label="简介"
        :value="formData.describe"
        type="textarea"
        placeholder="请填写"
        autosize
        data-key="describe"
        input-align="right"
        @change="onFieldChange"
        :border="false"
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="照片" custom-class="c-cell c-cell-image" custom-style="margin-top:10px;">
        <van-uploader
          style="display: flex; margin-right: 0"
          multiple
          accept="image"
          :file-list="formData.avatar"
          @after-read="afterRead($event, 'avatar')"
          @delete="deleteFile($event, 'avatar')"
          :max-count="1"
          data-field="avatar"
          class="c-flex-end"
        />
      </van-cell>
      <van-cell title="编号" required>
        <input
          :value="formData.code"
          type="text"
          placeholder="请填写"
          data-key="code"
          @input="onFieldChange"
        />
      </van-cell>
      <van-cell title="姓名" required>
        <input
          :value="formData.name"
          type="text"
          placeholder="请填写"
          data-key="name"
          @input="onFieldChange"
        />
      </van-cell>
      <van-cell title="手机" required>
        <input
          :value="formData.phone"
          type="text"
          placeholder="手机号将作为登录账号"
          data-key="phone"
          @input="onFieldChange"
        />
      </van-cell>
      <van-cell title="密码" required v-if="!formData._id">
        <input
          :value="formData.passwd"
          type="text"
          placeholder="请填写至少6位密码"
          data-key="passwd"
          @input="onFieldChange"
        />
      </van-cell>
      <van-cell title="简介" required>
        <input
          :value="formData.describe"
          type="textarea"
          autosize
          placeholder="请填写"
          data-key="describe"
          @input="onFieldChange"
        />
      </van-cell>
      <!-- #endif -->
    </van-cell-group>

    <van-cell-group>
      <!-- 选择组织 -->
      <!-- #ifdef MP-WEIXIN -->
      <van-field
        :value="formData.orgName"
        is-link
        readonly
        label="组织"
        placeholder="请选择"
        input-align="right"
        @click.native="orgClick"
        required
        custom-style="margin-top: 10px"
      />
      <van-popup :show="orgShow" round position="bottom">
        <van-cascader
          v-if="orgShow"
          :value="formData.orgId"
          title="请选择所属组织"
          :options="options.orgs"
          :fieldNames="{
            text: 'orgName',
            value: '_id',
            children: 'orgList'
          }"
          @close="orgShow = false"
          @finish="onOrgFinish"
        />
      </van-popup>
      <!-- 选择角色 -->
      <van-field
        :value="format('roles', formData.roleIds, 'multiple')"
        is-link
        readonly
        label="角色"
        type="textarea"
        placeholder="请选择"
        autosize
        input-align="right"
        @click.native="roleShow = true"
        required
      />
      <van-popup
        :show="roleShow"
        round
        position="bottom"
        custom-style="height: 50%;"
        @close="roleShow = false"
      >
        <van-checkbox-group :value="formData.roleIds" data-key="roleIds" @change="onFieldChange">
          <van-cell-group>
            <block v-for="(item, i) in options.roles" :key="i">
              <!-- 当前角色类型为b时，只允许添加b类型的角色 -->
              <van-cell
                v-if="
                  currentRole.type == 'b'
                    ? item.type == 'b' || formData.roleIds.indexOf(item._id) != -1
                    : true
                "
                :title="item.name"
                value-class="cell-value-class"
                class="c-cell-check"
                clickable
                :data-index="i"
                data-key="roleIds"
                @click="onCellToggle"
              >
                <van-checkbox :class="'roleIds-' + i" :name="item._id" />
              </van-cell>
            </block>
          </van-cell-group>
        </van-checkbox-group>
      </van-popup>
      <!-- 选择服务类型 -->
      <!-- 角色满足管家、工队时展示服务类型 -->
      <van-field
        v-if="
          (formData.roleIds.indexOf('3481370558631265818') != -1 &&
            formData.roleIds.indexOf('1259263938717893739') != -1) ||
          formData.roleIds.indexOf('3481370558631265818') != -1 ||
          formData.roleIds.indexOf('1259263938717893739') != -1
            ? true
            : false
        "
        :value="format('serviceType', formData.serviceType, 'multiple')"
        is-link
        readonly
        label="服务类型"
        placeholder="请选择"
        autosize
        input-align="right"
        @click.native="serviceTypeShow = true"
        required
      />
      <van-popup
        :show="serviceTypeShow"
        round
        position="bottom"
        custom-style="height: 50%;"
        @close="serviceTypeShow = false"
      >
        <van-checkbox-group
          :value="formData.serviceType"
          data-key="serviceType"
          @change="onFieldChange"
        >
          <van-cell-group>
            <block v-for="(item, i) in options.serviceType" :key="i">
              <van-cell
                :title="item.name"
                value-class="cell-value-class"
                class="c-cell-check"
                clickable
                :data-index="i"
                data-key="serviceType"
                @click="onCellToggle"
              >
                <van-checkbox :class="'serviceType-' + i" :name="item.value" />
              </van-cell>
            </block>
          </van-cell-group>
        </van-checkbox-group>
      </van-popup>
      <!-- 省市区 -->
      <van-field
        :value="
          area.areaList.province_list[formData.area[0]] +
          area.areaList.city_list[formData.area[1]] +
          area.areaList.county_list[formData.area[2]]
        "
        is-link
        readonly
        label="省市区"
        type="area"
        placeholder="请选择省市区"
        autosize
        input-align="right"
        @click.native="area.show = true"
        required
      />
      <van-popup :show="area.show" position="bottom">
        <van-area :area-list="area.areaList" @confirm="areaConfirm" @cancel="area.show = false" />
      </van-popup>
      <!-- 选择标签 -->
      <van-field
        :value="format('tags', formData.tags, 'multiple')"
        is-link
        readonly
        label="标签"
        type="textarea"
        placeholder="请选择"
        autosize
        input-align="right"
        @click.native="tagShow = true"
      />
      <van-popup
        :show="tagShow"
        round
        position="bottom"
        custom-style="height: 50%;"
        @close="tagShow = false"
      >
        <van-checkbox-group :value="formData.tags" data-key="tags" @change="onFieldChange">
          <van-cell-group>
            <block v-for="(item, i) in options.tags" :key="i">
              <van-cell
                :title="item.name"
                value-class="cell-value-class"
                class="c-cell-check"
                clickable
                :data-index="i"
                data-key="tags"
                @click="onCellToggle"
              >
                <van-checkbox :class="'tags-' + i" :name="item.value" />
              </van-cell>
            </block>
          </van-cell-group>
        </van-checkbox-group>
      </van-popup>
      <van-field
        label="服务年限"
        :value="format('serviceYears', formData.serviceYears)"
        placeholder="请选择"
        data-key="serviceYears"
        is-link
        readonly
        input-align="right"
        :border="false"
        @click-input="onClick('serviceYears', 'serviceYears')"
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="组织" required>
        <uni-data-picker
          key="orgIdPicker"
          ref="orgIdPicker"
          :value="formData.orgId"
          placeholder="请选择"
          popup-title="请选择"
          :localdata="options.orgs"
          :map="{
            text: 'orgName',
            value: '_id',
            children: 'orgList'
          }"
          @change="onOrgFinish"
          :clear-icon="false"
        ></uni-data-picker>
      </van-cell>
      <van-cell title="角色" required>
        <van-checkbox-group
          key="roleIds"
          :value="formData.roleIds"
          data-key="roleIds"
          @change="onCheckboxChange"
        >
          <block v-for="(item, i) in options.roles">
            <van-checkbox
              v-if="
                currentRole.type == 'b'
                  ? item.type == 'b' || formData.roleIds.indexOf(item._id) != -1
                  : true
              "
              :key="i"
              :name="item.value"
              shape="square"
              custom-class="c-checkbox"
            >
              {{ item.name }}
            </van-checkbox>
          </block>
        </van-checkbox-group>
      </van-cell>
      <van-cell title="服务类型" required>
        <van-checkbox-group
          key="serviceType"
          data-key="serviceType"
          :value="formData.serviceType"
          @change="onCheckboxChange"
        >
          <van-checkbox
            v-for="(item, i) in options.serviceType"
            :key="i"
            :name="item.value"
            shape="square"
            custom-class="c-checkbox"
          >
            {{ item.name }}
          </van-checkbox>
        </van-checkbox-group>
      </van-cell>
      <van-cell title="省市区" required>
        <uni-data-picker
          key="uniAreaPickerarea"
          ref="uniAreaPickerarea"
          :value="formData.area"
          placeholder="请选择"
          popup-title="请选择"
          :localdata="area.areaList"
          :map="{
            text: 'label',
            value: 'value'
          }"
          @change="areaConfirm"
          :clear-icon="false"
        ></uni-data-picker>
      </van-cell>
      <van-cell title="标签" required>
        <van-checkbox-group
          key="tags"
          data-key="tags"
          :value="formData.tags"
          @change="onCheckboxChange"
        >
          <van-checkbox
            v-for="(item, i) in options.tags"
            :key="i"
            :name="item.value"
            shape="square"
            custom-class="c-checkbox"
          >
            {{ item.name }}
          </van-checkbox>
        </van-checkbox-group>
      </van-cell>
      <van-cell title="服务年限" required>
        <van-radio-group
          key="serviceYears"
          data-key="serviceYears"
          :value="formData.serviceYears"
          @change="onCheckboxChange"
        >
          <van-radio
            v-for="(item, i) in options.serviceYears"
            :key="i"
            :name="item.value"
            custom-class="c-checkbox"
          >
            {{ item.name }}
          </van-radio>
        </van-radio-group>
      </van-cell>
      <!-- #endif -->
    </van-cell-group>
    <van-cell-group>
      <van-cell title="照片" custom-class="c-cell c-cell-image" custom-style="margin-top:10px;">
        <van-uploader
          key="profileImg"
          style="display: flex"
          multiple
          accept="image"
          :file-list="formData.profileImg"
          @after-read="afterRead($event, 'profileImg')"
          @delete="deleteFile($event, 'profileImg')"
          :max-count="1"
          data-field="profileImg"
          class="c-flex-end"
        />
      </van-cell>
      <van-cell title="证件图片" custom-class="c-cell c-cell-image">
        <van-uploader
          key="badgePhoto"
          style="display: flex"
          multiple
          accept="image"
          :file-list="formData.badgePhoto"
          @after-read="afterRead($event, 'badgePhoto')"
          @delete="deleteFile($event, 'badgePhoto')"
          :max-count="1"
          data-field="badgePhoto"
          class="c-flex-end"
        />
      </van-cell>
    </van-cell-group>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="actionSheetClose"
      @select="actionSheetSelect"
    ></van-action-sheet>
    <view class="button-bottom">
      <van-button
        round
        block
        color="#ff6900"
        @click="upsertUser"
        :data-event="{ id: 'fk509vaETx' }"
      >
        确 定
      </van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      orgShow: false,
      roleShow: false,
      tagShow: false,
      serviceTypeShow: false,
      options: {
        orgs: [],
        roles: [],
        codecfg_tags: { codeId: 'userTag' },
        codecfg_serviceYears: { codeId: 'serviceYears' },
        codecfg_serviceType: { codeId: 'serviceType' }
      },
      formData: {
        // #ifdef MP-WEIXIN
        avatar: '',
        // #endif
        // #ifdef APP-PLUS
        avatar: [],
        // #endif
        code: '',
        passwd: '123456',
        roleIds: [],
        orgId: '',
        tags: [],
        profileImg: [],
        badgePhoto: [],
        serviceType: []
      },
      currentRole: {},
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: {}
      },
      // 省市区选择
      area: {
        show: false,
        areaList: Object.assign({}, areajs.default)
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.getOrgs();
    this.getRoles();
    common.osg.codeoption(() => {
      if (param.userId) {
        this.getUser(param.userId);
      } else if (param.orgId) {
        this.formData.orgId = param.orgId;
        this.formData.orgIds = [param.orgId];
        this.formData.orgName = decodeURIComponent(param.orgName);
      }
    });
    this.currentRole = wx.getStorageSync('currentRole');
    // #ifdef APP-PLUS
    this.getArea();
    // #endif
  },
  methods: {
    getUser(userId) {
      common.osg.ajax(
        'user/query',
        {
          'is:_id|string#and': userId
        },
        res => {
          // #ifdef APP-PLUS
          if (res.data[0].avatar) {
            res.data[0].avatar = [{ url: res.data[0].avatar }];
          } else {
            res.data[0].avatar = [];
          }
          // #endif
          res.data[0].profileImg = JSON.parse(res.data[0].profileImg);
          res.data[0].badgePhoto = JSON.parse(res.data[0].badgePhoto);
          this.$set(this, 'formData', res.data[0]);
          this.$forceUpdate();
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
    getOrgs() {
      common.osg.ajax(
        '/org/queryCascade.do',
        {
          notFilterOrgId: 1,
          sortField: 'order'
        },
        res => {
          res.data.orgName = wx.getStorageSync('user').orgName;
          if (res.data.orgList.length) {
            this.deleteEmptyChildren(res.data.orgList);
          } else {
            delete res.data.orgList;
          }
          this.options.orgs = [res.data];
        }
      );
    },
    orgClick() {
      this.orgShow = true;
    },
    onOrgFinish(e) {
      const { selectedOptions, value } = e.detail;
      this.formData.orgName = selectedOptions[selectedOptions.length - 1].orgName;
      this.formData.orgId = value;
      this.formData.orgIds = [value];
      this.orgShow = false;
    },
    getRoles() {
      common.osg.ajax(
        'role/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          notFilterOrgId: '1',
          notFilterBelongTo: '1'
        },
        res => {
          res.data.map(item => {
            item.value = item._id;
          });
          this.options.roles = res.data;
        }
      );
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
      // #ifdef MP-WEIXIN
      this.formData[key] = e.detail;
      // #endif
      // #ifdef APP-PLUS
      this.formData[key] = e.detail.value;
      // #endif
      this.$forceUpdate();
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
      common.osg.afterRead(e, this);
      this.$forceUpdate();
    },
    // 删除图片
    deleteFile(e, f) {
      this.formData[f].splice(e.detail.index, 1);
      this.$forceUpdate();
    },
    upsertUser() {
      if (!/^[\w\d_-]+$/.test(this.formData.code)) {
        common.osg.toast('编号填写有误，只能由英文、数字、下划线、横线组成', 'none', 3000);
        return;
      }
      if (!this.formData.name) {
        common.osg.toast('姓名不能为空', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请填写正确格式的手机号', 'none');
        return;
      }
      if (!this.formData._id && !/^\S{6,}$/.test(this.formData.passwd)) {
        common.osg.toast('请填写至少6位密码', 'none');
        return;
      }
      if (this.formData.roleIds.length == 0) {
        common.osg.toast('角色不能为空', 'none');
        return;
      }
      if (this.formData.serviceType == 0) {
        common.osg.toast('服务资源不能为空', 'none');
        return;
      }
      if (this.formData.area.length == 0) {
        common.osg.toast('省市区不能为空', 'none');
        return;
      }
      let params = common.osg.deepCopy(this.formData);
      params.accountType = this.formData.accountType || 'b';
      params.profileImg = JSON.stringify(this.formData.profileImg);
      params.badgePhoto = JSON.stringify(this.formData.badgePhoto);
      // #ifdef APP-PLUS
      params.avatar = this.formData.avatar[0] ? this.formData.avatar[0].url : '';
      // #endif
      common.osg.ajax('user/upsertWithJson', { data: JSON.stringify(params) }, res => {
        // #ifdef APP-PLUS
        if (res.data.avatar) {
          res.data.avatar = [{ url: res.data.avatar }];
        } else {
          res.data.avatar = [];
        }
        // #endif
        res.data.profileImg = JSON.parse(res.data.profileImg);
        res.data.badgePhoto = JSON.parse(res.data.badgePhoto);
        this.formData = res.data;
        common.osg.toast('保存成功', 'none');
      });
    },
    /**
     * 选择省市区 确认
     */
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
      // #ifdef MP-WEIXIN
      this.area.show = false;
      // #endif
      // #ifdef APP-PLUS
      this.$refs.uniAreaPickerarea && this.$refs.uniAreaPickerarea.hide();
      // #endif
    },
    // 获取省市区字典
    getArea() {
      common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
        this.area = res;
      });
    },
    // 获取上传状态
    uniFilePickerSelect(e) {
      this.afterRead(
        {
          detail: {
            file: e.tempFiles.map(item => {
              return {
                name: item.name,
                extname: item.extname,
                url: item.url,
                location: item.image.location
              };
            })
          },
          target: {
            dataset: {
              field: e.target.dataset.field
            }
          }
        },
        e.target.dataset.field
      );
    },
    // 上传失败
    uniFilePickerFail(e) {
      common.osg.toast('上传失败', 'none');
    },
    // 删除
    uniFilePickerDelete(e) {
      this.deleteFile(
        {
          target: {
            dataset: {
              field: e.target.dataset.field
            }
          },
          detail: {
            index: e.index
          }
        },
        e.target.dataset.field
      );
    },
    onRoleChange(e) {
      this.formData.roleIds = e.detail;
    },
    onCheckboxChange(e) {
      let key = e.target.dataset.key;
      this.$set(this.formData, key, e.detail);
    }
  }
};
</script>

<style lang="scss" scoped>
page {
  background-color: #fff !important;
  .user {
    height: 100vh;
    padding: 10px 0 100px;
    background: #fbfbfb;
    position: inherit;
    overflow-y: auto;
    &:after {
      position: fixed;
      content: '';
      border-bottom: 2rpx solid #efefef;
      width: 200%;
      top: 0;
      left: 0;
      transform: scale(0.5);
      transform-origin: 0 0;
      opacity: 0.99;
    }
    .user-avatar {
      text-align: right;
      .avatar-wrapper {
        width: 36px;
        height: 36px !important;
        border-radius: 5px !important;
      }
    }
    .c-cell-check {
      ::v-deep .van-cell__value {
        flex: none;
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
    .c-cell-image {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .van-cell__value {
        margin: 10px 0 0;
        .van-uploader__upload {
          width: 100px !important;
          height: 100px !important;
          border-radius: 8px;
        }
        .van-uploader__preview-image {
          width: 100px !important;
          height: 100px !important;
          border-radius: 8px;
        }
      }
    }
    .button-bottom {
      width: calc(100vw - 30px);
      padding: 0 15px;
      position: fixed;
      z-index: 2;
      bottom: 20px;
      text-align: center;
    }

    ::v-deep .c-checkbox {
      margin: 5px 0 !important;
    }
  }

  // ::v-deep .van-cell__title {
  //   color: #646566 !important;
  // }
}
</style>
