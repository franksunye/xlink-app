<template>
  <view class="addresses" @click.capture="track">
    <view
      :right-width="65"
      v-for="(item, i) in data"
      :key="i"
      @click="addressClick(item)"
      class="c-swipe-cell"
    >
      <view class="c-swipe-view" :data-event="{ id: 'GivBgrJSOz' }">
        <van-icon
          v-if="selectedAddressId == item._id"
          name="checked"
          color="#ff6900"
          style="width: 30px; margin-left: 10px; color: #ff6900"
          :data-event="{ id: 'GivBgrJSOz' }"
        />
        <view class="c-swipe-info" :data-event="{ id: 'GivBgrJSOz' }">
          <view class="area" :data-event="{ id: 'GivBgrJSOz' }">
            {{
              item.area
                ? areaList.province_list[item.area[0]] +
                    areaList.city_list[item.area[1]] +
                    areaList.county_list[item.area[2]] || ''
                : ''
            }}{{ item.subdistrictName }}
          </view>
          <view class="address" :data-event="{ id: 'GivBgrJSOz' }">{{ item.address }}</view>
          <view class="c-flex" :data-event="{ id: 'GivBgrJSOz' }">
            <text class="name" :data-event="{ id: 'GivBgrJSOz' }">{{ item.name }}</text>
            <text class="phone" :data-event="{ id: 'GivBgrJSOz' }">{{ item.phone }}</text>
            <van-tag v-if="item.isDefault" type="primary">默认</van-tag>
          </view>
        </view>
      </view>
      <view class="c-flex c-flex-col c-flex-around c-item-center" style="width: 40px">
        <view
          class="c-swipe-icon"
          @click.stop="doOpen('./address', { _id: item._id, selectedAddressId: selectedAddressId })"
          :data-event="{ id: 'dIeFN27KU_' }"
        >
          <van-icon name="edit" :data-event="{ id: 'dIeFN27KU_' }" />
        </view>
        <view
          class="c-swipe-icon"
          @click.stop="doRemove(item._id)"
          :data-event="{ id: 's2tn4K8G-P' }"
        >
          <van-icon name="delete-o" :data-event="{ id: 's2tn4K8G-P' }" />
        </view>
      </view>
    </view>
    <view class="button-bottom">
      <van-button type="info" round @click="doOpen('./address')" :data-event="{ id: 'v_B44elSAo' }">
        新建收货地址1
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
      userId: '',
      selectedAddressId: '',
      data: [],
      areaList: Object.assign({}, areajs.default)
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.userId = wx.getStorageSync('user')._id;
    // 标记已选中地址
    this.selectedAddressId = param.selectedAddressId || '';
  },
  onShow() {
    this.getAddress();
  },
  methods: {
    doOpen(path, params) {
      common.osg.open(path, params);
    },
    getAddress() {
      common.osg.ajax(
        'basic/address/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          userId: this.userId
        },
        res => {
          this.data = res.data;
        }
      );
    },
    doRemove(_id) {
      common.osg.confirm('是否确认删除？', () => {
        common.osg.ajax(`basic/address/remove/${_id}`, {}, () => {
          common.osg.toast('删除成功！');
          if (this.selectedAddressId == _id) {
            wx.removeStorageSync('address');
          }
          this.getAddress();
        });
      });
    },
    addressClick(item) {
      // 将选择的地址放入购物车页面
      wx.setStorageSync('address', item);
      wx.navigateBack();
    }
  }
};
</script>

<style lang="scss">
.addresses {
  padding-bottom: 90px;
  .c-swipe-cell {
    border-radius: 5px;
    margin: 10px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    overflow: hidden;
    .c-swipe-view {
      background-color: #fff;
      display: flex;
      .c-swipe-info {
        flex: 1;
        padding: 10px;
        height: 90px;
        box-sizing: border-box;
        justify-content: space-around;
        display: flex;
        flex-direction: column;
        .area {
          font-size: 14px;
          color: #969799;
        }
        .address {
          font-weight: 600;
        }
        .name {
          font-size: 15px;
          display: inline-block;
          margin-right: 20px;
        }
        .phone {
          font-size: 15px;
          color: #969799;
          margin-right: 20px;
        }
        van-tag {
          display: flex;
        }
      }
      .c-swipe-icon {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    // .van-swipe-cell__right {
    //   width: 65px;
    //   background: #d6000f;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   color: #fff;
    // }
  }
  .button-bottom {
    width: 100vw;
    position: fixed;
    bottom: 30px;
    text-align: center;
  }
  .add {
    height: 100vh;
    padding-bottom: 90px;

    scroll-view {
      height: calc(100vh - 90px); // 减去底部按钮的高度
    }
  }
}
</style>
