<template>
  <view>
    <!-- <van-dropdown-menu
      custom-class="c-dropdown-menu"
      title-class="c-dropdown-menu-title"
      active-color="#106CFF"
    >
      <van-dropdown-item value="" :options="options.specialty" />
      <van-dropdown-item value="" :options="options.sort" />
    </van-dropdown-menu> -->
    <view class="housekeepers">
      <view
        class="housekeeper"
        v-for="(item, i) in housekeepers"
        :key="i"
        @click="open('./housekeeper', { id: item._id })"
      >
        <view class="housekeeper-left">
          <view class="housekeeper-top">
            <image
              src="https://pub.fsgo365.cn/housekeeper-avatar.png"
              style="width: 52px; height: 52px; border-radius: 50%"
            ></image>
            <view class="housekeeper-info">
              <view>{{ item.name }}</view>
              <view>
                从业{{ item.users.serviceYears ? item.users.serviceYears.replace(',', '~') : 7 }}年
              </view>
            </view>
          </view>
          <van-rate
            :value="5"
            color="#F9DE55"
            void-icon="star"
            void-color="#eee"
            style="display: flex"
          />
        </view>
        <view class="housekeeper-right">
          <view style="display: flex; width: 100%">
            <view class="housekeeper-tag" style="flex: 6">屋面翻新</view>
            <view class="housekeeper-tag" style="flex: 4">卫生间防水</view>
          </view>
          <view style="display: flex; width: 100%">
            <view class="housekeeper-tag" style="flex: 4">窗户防水</view>
            <view class="housekeeper-tag" style="flex: 6">屋面防水维修</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
export default {
  data() {
    return {
      options: {
        codecfg_specialty: { codeId: 'specialty' },
        specialty: [{ text: '擅长方向', value: '' }],
        sort: [{ text: '默认排序', value: '' }]
      },
      partnerOrgId: '',
      housekeepers: []
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    common.osg.codeoption(() => {
      this.options.specialty.map(item => {
        item.text = item.name;
      });
      this.options.specialty.unshift({ text: '擅长方向', value: '' });
    });
    this.partnerOrgId = params.partnerOrgId;
    this.getHousekeepers();
  },
  methods: {
    getHousekeepers() {
      common.osg.ajax(
        'parnter/queryhousekeeper',
        {
          orgId: this.partnerOrgId,
          resourceType: 'technician',
          'in:resourceRoles|array#and': '1', //只查管家
          'ne:workType|integer#and': '-1', // 不展示离线管家
          'is:state|integer#and': 1,
          sortField: 'workType',
          sortOrder: 'desc'
        },
        res => {
          // 解析照片
          res.data.map(item => {
            item.users = item.users || {};
            if (item.users.profileImg && common.osg.isJson(item.users.profileImg)) {
              item.users.profileImg = JSON.parse(item.users.profileImg);
            } else {
              item.users.profileImg = [];
            }
          });
          this.housekeepers = res.data;
        }
      );
    },
    open(path, data) {
      common.osg.open(path, data);
    }
  }
};
</script>

<style lang="scss" scoped>
// ::v-deep .c-dropdown-menu {
//   box-shadow: none;
// }
::v-deep .c-dropdown-menu-title {
  color: #595959;
  font-size: 14px;
}
.housekeepers {
  padding-bottom: 30px;
  .housekeeper {
    margin: 0 25px;
    border-bottom: 1px solid #d9d9d9;
    padding: 15px 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .housekeeper-left {
      margin-right: 10px;
      .housekeeper-top {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        .housekeeper-info {
          margin-left: 5px;
          color: #393838;
          font-size: 14px;
        }
      }
    }
    .housekeeper-right {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .housekeeper-tag {
        border-radius: 2px;
        background: #f9de55;
        color: #000;
        text-align: center;
        font-size: 10px;
        margin: 0 5px 5px 0;
        padding: 2px 5px;
      }
    }
  }
}
</style>
