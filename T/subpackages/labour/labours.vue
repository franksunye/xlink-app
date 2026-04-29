<template>
  <view class="labours">
    <view class="top">
      <van-search
        placeholder="搜索您想要找的工人"
        shape="round"
        :value="searchValue"
        @search="onSearch"
        @clear="onSearchClear"
        custom-class="c-search"
      />
      <van-dropdown-menu active-color="#1989fa" custom-class="c-dropdown-menu">
        <van-dropdown-item
          :value="filter.district"
          :options="options.district"
          data-key="district"
          @change="dropdownItemChange"
        />
        <van-dropdown-item
          :value="filter.abilitys"
          :options="options.workerAbilitys"
          data-key="abilitys"
          @change="dropdownItemChange"
        />
        <van-dropdown-item
          :value="filter.sort"
          :options="options.sort"
          data-key="sort"
          @change="dropdownItemChange"
        />
        <van-dropdown-item
          :value="filter.recommend"
          :options="options.recommend"
          data-key="recommend"
          @change="dropdownItemChange"
        />
      </van-dropdown-menu>
    </view>
    <view class="c-cards">
      <view
        class="c-card"
        v-for="(item, i) in fpi.data"
        :key="i"
        @click="doOpen('labour', { id: item._id })"
      >
        <view class="c-flex c-item-start">
          <view class="c-flex">
            <van-image width="50px" height="50px" custom-class="c-card-image" :src="item.avatar" />
            <view class="c-flex c-flex-col c-flex-between">
              <view class="c-flex c-item-center">
                <text style="margin-right: 3px">{{ item.name }}</text>
                <view class="c-tag-warning" v-if="item.state === 1">
                  <i
                    class="iconfont icon-yirenzheng"
                    style="font-size: 10px; color: #09c161; margin-right: 2px"
                  ></i>
                  {{ codelabel('workerState', item.state) }}
                </view>
              </view>
              <view style="color: #888888; font-size: 14px">
                {{ codelabel('sex', item.sex) }}·{{ item.age }}岁
              </view>
            </view>
          </view>
          <view class="status" :style="item.status == '1' ? 'color:#07c160' : ''">
            {{ codelabel('workerStatus', String(item.status)) }}
          </view>
        </view>
        <view v-if="item.tags.length > 0" style="justify-content: normal; margin-top: 25rpx">
          <view v-for="(item, j) in item.tags" :key="j" class="c-tag-info">
            {{ codelabel('userTag', item) }}
          </view>
        </view>
        <view style="color: #333333; height: 25px; margin-top: 7px; font-size: 14px">
          期望工资：{{ item.salary }}元/日丨随时进场
        </view>
        <view v-if="item.abilitys.length > 0" style="justify-content: normal; margin-top: 5px">
          <view
            v-for="(item, j) in item.abilitys"
            :key="j"
            class="c-tag-info"
            style="background: rgba(249, 193, 12, 0.14); color: #675f47"
          >
            {{ codelabel('workerAbilitys', item) }}
          </view>
        </view>
        <view class="memo" v-if="item.memo">
          {{ item.memo }}
        </view>
        <view style="margin-top: 10px; align-items: center">
          <view class="c-flex c-item-center">
            <i
              class="iconfont icon-weizhi1"
              style="font-size: 13px; margin-right: 7rpx; color: #666666"
            ></i>
            <text style="color: #666666; font-size: 14px">
              距离您{{ String(item.distance).substring(0, 3) }}km
            </text>
          </view>
          <van-button
            plain
            type="info"
            round
            size="small"
            color="#0078D0"
            @click="makePhoneCall(item.phone)"
          >
            我要联系
          </van-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      latitude: '',
      longitude: '',
      searchValue: '',
      filter: {
        district: '110100',
        abilitys: '',
        sort: 'distance',
        recommend: 'recommend'
      },
      options: {
        district: [
          { text: '北京市', value: '110100' },
          { text: '东城区', value: '110101' },
          { text: '西城区', value: '110102' },
          { text: '朝阳区', value: '110105' },
          { text: '丰台区', value: '110106' },
          { text: '石景山区', value: '110107' },
          { text: '海淀区', value: '110108' },
          { text: '门头沟区', value: '110109' },
          { text: '房山区', value: '110111' },
          { text: '通州区', value: '110112' },
          { text: '顺义区', value: '110113' },
          { text: '昌平区', value: '110114' },
          { text: '大兴区', value: '110115' },
          { text: '怀柔区', value: '110116' },
          { text: '平谷区', value: '110117' },
          { text: '密云区', value: '110118' },
          { text: '延庆区', value: '110119' }
        ],
        codecfg_workerAbilitys: { codeId: 'workerAbilitys' },
        workerAbilitys: [],
        sort: [{ text: '按距离排序', value: 'distance' }],
        recommend: [{ text: '智能推荐', value: 'recommend' }],
        codecfg_workerStatus: { codeId: 'workerStatus' },
        codecfg_workerState: { codeId: 'workerState' },
        codecfg_sex: { codeId: 'SEX' },
        codecfg_userTag: { codeId: 'userTag' }
      },
      fpi: { data: [] }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    common.osg.codeoption(() => {
      this.options.workerAbilitys.map(item => {
        item.text = item.name;
      });
      this.options.workerAbilitys.unshift({ text: '全部工种', value: '' });
      this.$forceUpdate();
    });
    common.osg.getLocation(res => {
      this.latitude = res.latitude;
      this.longitude = res.longitude;
      this.getData();
    });
  },
  methods: {
    doOpen(path, data) {
      common.osg.open(path, data);
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    dropdownItemChange(e) {
      this.filter[e.target.dataset.key] = e.detail;
      this.getData();
    },
    makePhoneCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    onSearch(e) {
      this.searchValue = e.detail;
      this.getData();
    },
    onSearchClear() {
      this.searchValue = '';
      this.getData();
    },
    getData() {
      common.osg.ajax(
        'biz/labour/query',
        {
          latitude: this.latitude,
          longitude: this.longitude,
          'is:district|string#and': this.filter.district == '110100' ? '' : this.filter.district,
          'in:abilitys|array#and': this.filter.abilitys,
          'regex:name|string#or': this.searchValue,
          'regex:phone|string#or': this.searchValue
        },
        res => {
          this.fpi = res;
        }
      );
    },
    doSave() {
      for (let i = 0; i < this.fields.length; i++) {
        let f = this.fields[i];
        // 校验必填
        if (
          f.required == '1' &&
          ((!this.formData[f.name] && this.formData[f.name] !== 0) ||
            (f.type == 'file' && this.formData[f.name].length == 0))
        ) {
          if (f.frontEndConfig.showField) {
            //如果根据其他字段值展示 不展示则不需要必填
            if (
              f.frontEndConfig.showValue == 'exist'
                ? this.formData[f.frontEndConfig.showField]
                : this.formData[f.frontEndConfig.showField] == f.frontEndConfig.showValue
            ) {
              if (f.type == 'dialog') {
                common.osg.alert(f.nameDisp);
                return;
              } else {
                common.osg.alert(f.nameDisp + '为必填项');
                return;
              }
            }
          } else {
            if (f.type == 'dialog') {
              common.osg.alert(f.nameDisp);
              return;
            } else {
              common.osg.alert(f.nameDisp + '为必填项');
              return;
            }
          }
        }
        // 将exts字段值存在exts对象
        if (!f.preset) {
          this.formData.exts[f.name] = this.formData[f.name];
          delete this.formData[f.name];
        }
      }
      common.osg.ajax('basic/labours/upsert', { data: JSON.stringify(this.formData) }, () => {
        common.osg.alert('提交成功，请等待管理人员与您联系！', () => {
          wx.navigateBack({
            delta: 1
          });
        });
      });
    }
  }
};
</script>

<style lang="scss">
.labours {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .top {
    border-top: 0.5px solid rgba(0, 0, 0, 0.1);
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    .c-search {
      padding: 10px 15px 0;
    }
    .c-dropdown-menu {
      box-shadow: none !important;
      height: 40px;
      .van-dropdown-menu__title {
        font-size: 14px !important;
      }
    }
  }
  .c-cards {
    flex: 1;
    overflow-y: auto;
    .c-card {
      margin: 0 0 10px;
      .c-card-image {
        display: flex;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 7px;
      }
      .c-tag-warning {
        height: 15px;
        display: flex;
        align-items: center;
        padding: 0 5px;
        border-radius: 15rpx;
        background: #e1f9c7;
        font-size: 10px;
        font-weight: 500;
        color: #09c161;
        height: 28rpx;
        line-height: 28rpx;
      }
      .c-tag-info {
        height: 15px;
        background: #e5effb;
        border-radius: 15rpx;
        height: 14px;
        line-height: 14px;
        font-size: 10px;
        font-weight: 500;
        color: #0078d0;
        margin-right: 5rpx;
        padding: 1rpx 15rpx;
      }
      .status {
        font-size: 14px;
        color: #999999;
        font-weight: 600;
        height: 20px;
        line-height: 20px;
      }
      .memo {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
    }
  }
}
</style>
