<template>
  <view class="user">
    <van-cell-group>
      <view class="user-avatar">
        <van-button
          custom-class="avatar-wrapper"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
        >
          <van-image width="80" height="80" class="c-flex" :src="formData.avatar" />
        </van-button>
      </view>
      <van-field
        label="编号"
        :value="formData.code"
        placeholder="请输入"
        required
        data-key="code"
        @change="onFieldChange"
      />
      <van-field
        label="姓名"
        :value="formData.name"
        placeholder="请输入"
        required
        data-key="name"
        @change="onFieldChange"
      />
      <van-field
        label="手机"
        :value="formData.phone"
        placeholder="请输入"
        required
        data-key="phone"
        @change="onFieldChange"
      />
      <van-field
        :value="formData.orgName"
        is-link
        readonly
        label="组织"
        placeholder="请选择"
        @click.native="orgClick"
        required
      />
      <!-- 选择组织 -->
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
      <van-field
        :value="formatRoles(formData.roleIds)"
        is-link
        readonly
        label="角色"
        type="textarea"
        placeholder="请选择"
        autosize
        @click.native="roleShow = true"
        required
      />
      <!-- 选择角色 -->
      <van-popup
        :show="roleShow"
        round
        position="bottom"
        custom-style="height: 50%;"
        @close="roleShow = false"
      >
        <van-checkbox-group :value="formData.roleIds" @change="onRoleChange">
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
                value-class="role-value-class"
                clickable
                :data-index="i"
                @click="onRoleToggle"
              >
                <van-checkbox @click="noop" :class="'checkboxes-' + i" :name="item._id" />
              </van-cell>
            </block>
          </van-cell-group>
        </van-checkbox-group>
      </van-popup>
    </van-cell-group>
    <view class="c-text-center c-m-t-100">
      <van-button type="info" round @click="upsertUser">确 定</van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      orgShow: false,
      roleShow: false,
      options: {
        orgs: [],
        roles: []
      },
      formData: { avatar: '', code: '', roleIds: [], orgId: '' },
      currentRole: {}
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    if (param.userId) {
      this.getUser(param.userId);
    } else if (param.orgId) {
      this.formData.orgId = param.orgId;
      this.formData.orgIds = [param.orgId];
      this.formData.orgName = decodeURIComponent(param.orgName);
    }
    this.getOrgs();
    this.getRoles();
    this.currentRole = wx.getStorageSync('currentRole');
  },
  methods: {
    getUser(userId) {
      common.osg.ajax(
        'user/query',
        {
          'is:_id|string#and': userId
        },
        res => {
          this.formData = res.data[0];
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
    onRoleChange(e) {
      this.formData.roleIds = e.detail;
    },
    // 通过点击单元格，切换多选组件的选中状态
    onRoleToggle(e) {
      const { index } = e.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },
    formatRoles(value) {
      return common.osg.codelabelForArray('roles', value);
    },
    onFieldChange(e) {
      let key = e.target.dataset.key;
      this.formData[key] = e.detail;
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
        common.osg.toast('请输入正确格式的手机号', 'none');
        return;
      }
      if (this.formData.roleIds.length == 0) {
        common.osg.toast('角色不能为空', 'none');
        return;
      }

      common.osg.ajax('user/upsert', this.formData, res => {
        this.formData = res.data;
        common.osg.alert('保存成功');
      });
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #fff !important;
  .user {
    .user-avatar {
      background: #fff;
      text-align: center;
      padding: 20px;
      .avatar-wrapper {
        width: 80px;
        height: 80px !important;
        border-radius: 5px !important;
      }
    }
    .role-value-class {
      flex: none;
      .van-checkbox__label--right {
        display: none;
      }
    }
  }
}
</style>
