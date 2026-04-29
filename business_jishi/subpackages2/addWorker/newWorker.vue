<template>
  <view class="user">
    <van-cell-group inset :border="false" class="user-cell-group">
      <!-- #ifdef MP-WEIXIN -->
      <van-cell title="照片">
        <view class="user-avatar">
          <van-button
            open-type="chooseAvatar"
            @chooseavatar="onChooseAvatar"
            custom-style=" min-height: 100px; max-width: 100px; border:none;"
          >
            <van-image width="80" height="80" class="c-flex" :src="formData.avatar" />
          </van-button>
        </view>
      </van-cell>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="照片">
        <van-uploader
          multiple
          accept="image"
          :file-list="formData.avatar"
          @after-read="afterRead($event, 'avatar')"
          @delete="deleteFile($event, 'avatar')"
          :max-count="1"
          data-field="avatar"
        />
      </van-cell>
      <!-- #endif -->
      <van-field
        label="姓名"
        :value="formData.name"
        placeholder="请填写姓名"
        required
        data-key="name"
        input-align="right"
        @change="onFieldChange"
      />
      <van-field
        label="手机"
        :border="false"
        :value="formData.phone"
        placeholder="请填写手机号"
        required
        :maxlength="11"
        data-key="phone"
        input-align="right"
        @change="onFieldChange"
      />
    </van-cell-group>

    <view class="bottom-bar">
      <van-button type="info" block @click="doSave()">确定</van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      formData: {
        // #ifdef MP-WEIXIN
        avatar: '',
        // #endif
        // #ifdef APP-PLUS
        avatar: [],
        // #endif
        name: '',
        phone: '',
        state: 1 // 默认已认证
      }
    };
  },
  onLoad(param) {},
  methods: {
    // 上传图片
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
    doSave() {
      const { name, phone } = this.formData;

      if (!name || !phone) {
        uni.showToast({
          title: !name ? '请输入姓名' : '请输入手机号',
          icon: 'none'
        });
        return;
      }

      if (!/^1[3-9]\d{9}$/.test(phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }

      common.osg.ajax('biz/labour/upsert', { data: JSON.stringify(this.formData) }, res => {
        common.osg.toast('创建成功', 'none');
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1000);
      });
    }
  }
};
</script>

<style lang="scss">
::v-deep .user {
  width: 100vw;
  height: 100vh;
  padding: 16px 0px;
  background: #fbfbfb;
}

.bottom-bar {
  width: 100vw;
  height: 50px;
  padding: 0px 16px;
  box-sizing: border-box;
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
  z-index: 100;
  .van-button {
    flex: 1;
    border-radius: 6px;
  }
}
</style>
