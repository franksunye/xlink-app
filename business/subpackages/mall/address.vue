<template>
  <view class="address" @click.capture="track">
    <van-cell-group inset :border="false">
      <!-- #ifdef MP-WEIXIN -->
      <van-field
        key="name"
        label="收货人"
        :value="formData.name"
        placeholder="请填写收货人姓名"
        required
        data-key="name"
        @change="onFieldChange"
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="收货人">
        <input
          type="text"
          placeholder="请填写收货人姓名"
          :value="formData.name"
          @input="onFieldChange"
          data-key="name"
          class="c-text-left"
          style="margin-left: 8px"
        />
      </van-cell>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <van-field
        key="phone"
        label="手机号"
        :value="formData.phone"
        placeholder="请填写收货人手机号"
        required
        data-key="phone"
        @change="onFieldChange"
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="手机号">
        <input
          type="number"
          placeholder="请填写收货人手机号"
          :value="formData.phone"
          @input="onFieldChange"
          data-key="phone"
          class="c-text-left"
          style="margin-left: 8px"
          :maxlength="11"
        />
      </van-cell>
      <van-cell title="所在地区" required value-class="c-m-l-20">
        <uni-data-picker
          key="area"
          ref="area"
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
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <van-field
        label="所在地区"
        :value="
          formData.area.length > 0
            ? area.areaList.province_list[formData.area[0]] +
              area.areaList.city_list[formData.area[1]] +
              area.areaList.county_list[formData.area[2]]
            : ''
        "
        placeholder="请选择所在地区"
        is-link
        readonly
        required
        @click.native="area.show = true"
      />
      <!-- 省市区 -->
      <van-popup :show="area.show" position="bottom">
        <van-area
          title="省市区"
          :area-list="area.areaList"
          @confirm="areaConfirm"
          @cancel="areaCancel"
        />
      </van-popup>
      <!-- #endif -->
      <van-cell
        title="所属街道"
        :value="formData.subdistrict ? codelabel('subdistricts', formData.subdistrict) : ''"
        is-link
        placeholder="请选择所属街道"
        @click.native="subdistrictClick"
        required
        value-class="c-text-left c-m-l-40"
      />
      <!-- 选择街道 -->
      <van-action-sheet
        :show="subdistrict.show"
        :actions="options.subdistricts"
        @select="subdistrictSelect"
        @close="subdistrict.show = false"
        close-on-click-action
      ></van-action-sheet>
      <!-- #ifdef MP-WEIXIN -->
      <van-field
        key="address"
        label="详细地址"
        :value="formData.address"
        placeholder="请填写详细地址、门牌号等"
        required
        data-key="address"
        @change="onFieldChange"
        type="textarea"
        autosize
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <van-cell title="详细地址">
        <textarea
          placeholder="请填写详细地址、门牌号等"
          :value="formData.address"
          @input="onFieldChange"
          data-key="address"
          class="c-text-left"
          style="margin-left: 8px"
          auto-height
        />
      </van-cell>
      <!-- #endif -->
      <van-cell title="设为默认地址" label="下单会优先使用该地址" :border="false">
        <van-switch
          :checked="formData.isDefault"
          size="24px"
          inactive-color="#f1f1f1"
          data-key="isDefault"
          :active-value="1"
          :inactive-value="0"
          @change="onFieldChange"
        />
      </van-cell>
    </van-cell-group>
    <view class="button-bottom">
      <van-button type="info" round @click="doSave" :data-event="{ id: 'qnHqrArrni' }">
        保 存
      </van-button>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  data() {
    return {
      _id: '',
      selectedAddressId: '',
      formData: {
        area: [],
        isDefault: 0,
        exts: {}
      },
      area: {
        show: false,
        areaList: Object.assign({}, areajs.default)
      },
      options: {
        subdistricts: []
      },
      subdistrict: {
        show: false
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this._id = param._id || '';
    this.selectedAddressId = param.selectedAddressId || '';
    if (this._id) {
      this.getAddress();
    } else {
      this.formData.userId = wx.getStorageSync('user')._id;
    }
    // #ifdef APP-PLUS
    this.getArea();
    // #endif
  },
  methods: {
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    onFieldChange(e) {
      let key = e.target.dataset.key;
      // #ifdef MP-WEIXIN
      this.formData[key] = e.detail;
      // #endif
      // #ifdef APP-PLUS
      this.formData[key] = e.detail.value || e.detail;
      // #endif
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
      this.formData.subdistrict = '';
      this.formData.area = areaVal;
      // #ifdef MP-WEIXIN
      this.area.show = false;
      // #endif
      // #ifdef APP-PLUS
      this.$refs.area.hide();
      // #endif
      // 查询街道
      common.osg.getSubdistricts(areaVal, res => {
        this.options.subdistricts = res;
        this.$forceUpdate();
      });
    },
    areaCancel() {
      this.area.show = false;
    },
    subdistrictClick() {
      if (this.formData.area.length == 0) {
        common.osg.toast('请先选择所在区域！', 'none');
      } else {
        this.subdistrict.show = true;
      }
    },
    subdistrictSelect(e) {
      this.formData.subdistrict = e.detail.value;
      this.formData.subdistrictName = e.detail.name;
      this.$forceUpdate();
    },
    getAddress() {
      common.osg.ajax('basic/address/query', { _id: this._id }, res => {
        this.formData = res.data[0];
        // 查询街道
        common.osg.getSubdistricts(this.formData.area, res => {
          this.options.subdistricts = res;
        });
        this.$forceUpdate();
      });
    },
    doSave() {
      if (!this.formData.name) {
        common.osg.toast('请填写收货人', 'none');
        return;
      }
      if (!/^1[3-9]{1}\d{9}$/.test(this.formData.phone)) {
        common.osg.toast('请填写正确格式的手机号', 'none');
        return;
      }
      if (this.formData.area.length == 0) {
        common.osg.toast('请选择所在地区', 'none');
        return;
      }
      if (!this.formData.subdistrict) {
        common.osg.toast('请选择所属街道', 'none');
        return;
      }
      if (!this.formData.address) {
        common.osg.toast('请填写详细地址', 'none');
        return;
      }
      common.osg.ajax('/basic/address/upsert', this.formData, res => {
        common.osg.alert('保存成功！', () => {
          if (res.data._id == this.selectedAddressId) wx.setStorageSync('address', res.data);
          wx.navigateBack({
            delta: 1
          });
        });
      });
    },
    // 获取省市区字典
    getArea() {
      common.osg.ajax('~https://pub.fsgo365.cn/cascadeArea202308041450.json', {}, res => {
        this.area = res;
      });
    }
  }
};
</script>

<style lang="scss">
.address {
  .van-cell-group--inset {
    margin: 10px;
  }
  .button-bottom {
    width: 100vw;
    position: fixed;
    bottom: 30px;
    text-align: center;
  }
  .van-cell__value {
    flex: 2;
  }
}
</style>
