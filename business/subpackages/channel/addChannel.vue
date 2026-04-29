<template>
  <view class="addChannel" @click.capture="track">
    <van-cell-group>
      <van-field
        label="渠道名称"
        :value="formData.name"
        placeholder="请输入"
        required
        data-key="name"
        @change="onFieldChange"
      />
      <van-field
        label="渠道手机号"
        :value="formData.phones"
        placeholder="请输入"
        required
        data-key="phones"
        @change="onFieldChange"
      />
      <!-- #ifdef MP-WEIXIN -->
      <van-field
        :value="format('resourcPartner', formData.serviceOrgId)"
        is-link
        readonly
        label="直达服务商"
        type="textarea"
        placeholder="请选择"
        autosize
        @click.native="resourcPartnerShow = true"
        required
      />
      <van-popup
        :show="resourcPartnerShow"
        round
        position="bottom"
        custom-style="height: 50%;"
        @close="resourcPartnerShow = false"
      >
        <van-checkbox-group
          :value="formData.serviceOrgId"
          data-key="serviceOrgId"
          @change="onFieldChange"
        >
          <van-cell-group>
            <block v-for="(item, i) in options.resourcPartner" :key="i">
              <van-cell
                :title="item.name"
                value-class="cell-value-class"
                clickable
                :data-index="i"
                data-key="serviceOrgId"
                @click="onCellToggle"
              >
                <van-checkbox :class="'serviceOrgId-' + i" :name="item.serviceCrewId" />
              </van-cell>
            </block>
          </van-cell-group>
        </van-checkbox-group>
      </van-popup>
      <!-- 直达管家 -->
      <van-field
        :value="format('resourcRole', formData.supervisorId)"
        is-link
        readonly
        label="直达管家"
        type="textarea"
        placeholder="请选择"
        autosize
        @click.native="resourcRoleShow = true"
      />
      <van-popup
        :show="resourcRoleShow"
        round
        position="bottom"
        custom-style="height: 50%;"
        @close="resourcRoleShow = false"
      >
        <van-checkbox-group
          :value="formData.supervisorId"
          data-key="supervisorId"
          @change="onFieldChange"
        >
          <van-cell-group>
            <block v-for="(item, i) in options.resourcRole" :key="i">
              <van-cell
                :title="item.name"
                value-class="cell-value-class"
                clickable
                :data-index="i"
                data-key="supervisorId"
                @click="onCellToggle"
              >
                <van-checkbox :class="'supervisorId-' + i" :name="item.relatedRecordId" />
              </van-cell>
            </block>
          </van-cell-group>
        </van-checkbox-group>
      </van-popup>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="直达服务商" required>
        <van-radio-group
          key="serviceOrgId"
          data-key="serviceOrgId"
          :value="formData.serviceOrgId"
          @change="onRadioChange"
        >
          <van-radio
            v-for="(item, i) in options.resourcPartner"
            :key="i"
            :name="item.value"
            custom-class="c-radio"
          >
            {{ item.name }}
          </van-radio>
        </van-radio-group>
      </van-cell>
      <van-cell title="直达管家" required>
        <van-radio-group
          key="supervisorId"
          data-key="supervisorId"
          :value="formData.supervisorId"
          @change="onRadioChange"
        >
          <van-radio
            v-for="(item, i) in options.resourcRole"
            :key="i"
            :name="item.value"
            custom-class="c-radio"
          >
            {{ item.name }}
          </van-radio>
        </van-radio-group>
      </van-cell>
      <!-- #endif -->
      <van-field
        label="备注"
        :value="formData.memo"
        placeholder="请输入"
        data-key="memo"
        @change="onFieldChange"
      />
    </van-cell-group>
    <view class="button-bottom">
      <van-button type="info" round @click="upsertChannel" :data-event="{ id: 'J97x5og_K2' }">
        确 定
      </van-button>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      resourcRoleShow: false,
      resourcPartnerShow: false,
      tagShow: false,
      options: {
        resourcRole: [],
        resourcPartner: [],
        codecfg_tags: { codeId: 'userTag' },
        codecfg_serviceYears: { codeId: 'serviceYears' }
      },
      formData: {
        serviceOrgId: [],
        supervisorId: [],
        exts: { partnerId: '' }
      },
      user: {},
      // 上拉菜单
      actionSheet: {
        show: false,
        actions: [],
        field: {}
      }
    };
  },
  onLoad: function (param) {
    common.osg.init(this, param, app);
    common.osg.codeoption(() => {
      if (param.channelId) {
        this.getChannel(param.channelId);
      }
    });
    this.user = wx.getStorageSync('user');
    this.getResourcPartner();
    this.getResourcRole();
  },
  methods: {
    // 获取当前编辑的用户渠道 channel/query.do
    getChannel(channelId) {
      common.osg.ajax(
        'channel/query.do',
        {
          'is:_id|string#and': channelId
        },
        res => {
          res.data.map(item => {
            let partnerId = item.partnerId || '';
            item.partnerId = partnerId;
          });
          this.formData = res.data[0];
          console.log(this.formData, '---this.formData');
        }
      );
    },
    // 获取当前登录服务资源伙伴
    getResourcPartner() {
      common.osg.ajax(
        'biz/serviceResource/query.do',
        {
          _all: '1',
          'is:state|integer#and': 1,
          resourceType: 'partner',
          'is:serviceCrewId|string#and': this.user.orgId || '',
          notFilterBelongTo: '1'
        },
        res => {
          res.data.map(item => {
            item.value = item.serviceCrewId;
          });
          this.options.resourcPartner = res.data;
        }
      );
    },
    // 获取当前登录服务资源人员
    getResourcRole() {
      common.osg.ajax(
        'biz/serviceResource/query.do',
        {
          _all: '1',
          'is:state|integer#and': 1,
          resourceType: 'technician',
          'is:orgId|string#and': this.user.orgId || '',
          notFilterBelongTo: '1'
        },
        res => {
          res.data.map(item => {
            item.value = item.relatedRecordId;
          });
          this.options.resourcRole = res.data;
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
        if (common.osg.codelabel(option, val) == '未知') {
          return '';
        }
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
    upsertChannel() {
      if (!this.formData.name) {
        common.osg.toast('姓名不能为空', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phones)) {
        common.osg.toast('请输入正确格式的手机号', 'none');
        return;
      }
      if (this.formData.serviceOrgId == 0) {
        common.osg.toast('直达服务商', 'none');
        return;
      }
      // if (this.formData.supervisorId == 0) {
      //   common.osg.toast('直达管家', 'none');
      //   return;
      // }
      this.formData.partnerId = this.user.partnerIds[0];
      console.log(this.formData, '---upsertformData');
      common.osg.ajax('channel/upsert', this.formData, res => {
        this.formData = res.data;
        common.osg.alert('保存成功');
      });
    },
    onRadioChange(e) {
      let key = e.target.dataset.key;
      this.$set(this.formData, key, e.detail);
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #fff !important;
  .addChannel {
    // .user-avatar {
    //   background: #fff;
    //   text-align: center;
    //   padding: 20px;
    //   .avatar-wrapper {
    //     width: 80px;
    //     height: 80px !important;
    //     border-radius: 5px !important;
    //   }
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
    .button-bottom {
      width: 100vw;
      position: fixed;
      z-index: 2;
      bottom: 30px;
      text-align: center;
    }
    ::v-deep .c-radio {
      margin: 5px 0 !important;
    }
  }
}
</style>
