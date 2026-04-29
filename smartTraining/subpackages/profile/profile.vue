<template>
  <view class="profile">
    <view class="form">
      <uni-forms ref="form" :model="formData" :rules="rules" label-width="85px">
        <uni-section title="基本信息" type="line">
          <uni-forms-item label="名称" name="name" required>
            <uni-easyinput v-model="formData.name" placeholder="请输入名称" />
          </uni-forms-item>
          <uni-forms-item label="年龄">
            <uni-easyinput v-model="formData.age" placeholder="请输入年龄" type="number" />
          </uni-forms-item>
          <uni-forms-item label="性别">
            <uni-data-checkbox v-model="formData.gender" :localdata="genders" />
          </uni-forms-item>
          <uni-forms-item label="身份">
            <uni-data-checkbox v-model="formData.residence_type" :localdata="residenceTypes" />
          </uni-forms-item>
          <uni-forms-item label="职业">
            <uni-data-select
              v-model="formData.profession"
              :localdata="professions"
              placeholder="请选择职业"
            ></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="性格">
            <uni-data-select
              v-model="formData.personality"
              :localdata="personalities"
              placeholder="请选择性格"
            ></uni-data-select>
          </uni-forms-item>
        </uni-section>
        <uni-section title="客户需求" type="line">
          <uni-forms-item label="渗漏部位">
            <uni-data-select
              v-model="formData.leak_location"
              :localdata="leakLocations"
              placeholder="请选择渗漏部位"
            ></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="仅咨询">
            <uni-data-checkbox v-model="formData.is_question" :localdata="whether" />
          </uni-forms-item>
        </uni-section>
        <uni-section title="房产信息" type="line">
          <uni-forms-item label="是否别墅">
            <uni-data-checkbox v-model="formData.property_info.is_villa" :localdata="whether" />
          </uni-forms-item>
          <uni-forms-item label="房屋结构">
            <uni-data-select
              v-model="formData.property_info.structure"
              :localdata="structures"
              placeholder="请选择房屋结构"
            ></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="房龄(年)">
            <uni-easyinput
              v-model="formData.property_info.building_age"
              placeholder="请输入房龄"
              type="number"
            />
          </uni-forms-item>
          <uni-forms-item label="房价(元/㎡)">
            <uni-easyinput
              v-model="formData.property_info.price_per_sqm"
              placeholder="请输入房价"
              type="number"
            />
          </uni-forms-item>
        </uni-section>
      </uni-forms>
    </view>
    <button class="footer" @click="submit">提交</button>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      profileId: '',
      formData: {},
      rules: {
        name: {
          rules: [
            {
              required: true,
              errorMessage: '请填写名称'
            }
          ]
        }
      },
      genders: [
        {
          text: '男',
          value: '男'
        },
        {
          text: '女',
          value: '女'
        }
      ],
      residenceTypes: [
        {
          text: '业主',
          value: '业主'
        },
        {
          text: '租客',
          value: '租客'
        }
      ],
      professions: [
        { text: '教师', value: '教师' },
        { text: '医生', value: '医生' },
        { text: '工程师', value: '工程师' },
        { text: '公务员', value: '公务员' },
        { text: '自由职业者', value: '自由职业者' },
        { text: '退休人员', value: '退休人员' }
      ],
      leakLocations: [
        { text: '屋面', value: '屋面' },
        { text: '卫生间', value: '卫生间' },
        { text: '窗户', value: '窗户' },
        { text: '外墙', value: '外墙' },
        { text: '地下室', value: '地下室' }
      ],
      personalities: [
        { text: '温和', value: '温和' },
        { text: '急躁', value: '急躁' },
        { text: '理性', value: '理性' },
        { text: '情绪化', value: '情绪化' },
        { text: '多疑', value: '多疑' }
      ],
      whether: [
        { text: '是', value: true },
        { text: '否', value: false }
      ],
      structures: [
        { text: '砖混', value: '砖混' },
        { text: '框架', value: '框架' },
        { text: '钢结构', value: '钢结构' }
      ]
    };
  },
  onLoad(options) {
    common.osg.init(this, options, app);
    this.profileId = options.id;
    this.getProfile(this.profileId);
  },
  methods: {
    getProfile(profileId) {
      common.osg.ajax(
        'profiles/' + profileId,
        {},
        res => {
          this.formData = res;
        },
        {
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    submit() {
      console.log('formData', this.formData);
      this.$refs.form.validate().then(res => {
        delete this.formData._id;
        delete this.formData.created_at;
        delete this.formData.updated_at;
        delete this.formData.source;
        common.osg.ajax(
          'profiles/' + this.profileId,
          this.formData,
          res => {
            common.osg.toast('提交成功', 'none');
            uni.navigateBack();
          },
          {
            method: 'PUT',
            header: {
              'Content-Type': 'application/json'
            }
          }
        );
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
  box-sizing: border-box;
  .form {
    flex: 1;
    overflow-y: auto;
    margin: 4px 16px 0;
  }
  ::v-deep .uni-section-header {
    padding: 12px 0;
  }
  ::v-deep .uni-data-checklist {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .footer {
    color: #ffffff;
    background-color: #106cff;
    border-color: #106cff;
    width: calc(100% - 32px);
    margin-bottom: env(safe-area-inset-bottom);
  }
}
</style>
