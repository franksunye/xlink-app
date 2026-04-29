<template>
  <view class="addresses">
    <van-swipe-cell :right-width="65" v-for="(item, i) in data" :key="i" class="c-swipe-cell">
      <view class="c-swipe-view" @click="addressClick(item)">
        <van-icon
          v-if="selectedAddressId == item._id"
          name="checked"
          color="#1989fa"
          style="width: 30px; margin-left: 10px"
        />
        <view class="c-swipe-info">
          <view class="area">
            {{
              item.area
                ? areaList.province_list[item.area[0]] +
                  areaList.city_list[item.area[1]] +
                  areaList.county_list[item.area[2]]
                : ''
            }}{{ item.subdistrictName }}
          </view>
          <view class="address">{{ item.address }}</view>
          <view class="c-flex">
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.phone }}</text>
            <van-tag v-if="item.isDefault" type="primary">默认</van-tag>
          </view>
        </view>
        <view
          class="c-swipe-icon"
          @click.native.stop="
            doOpen('./address', { _id: item._id, selectedAddressId: selectedAddressId })
          "
        >
          <van-icon name="edit" />
        </view>
      </view>
      <view slot="right" @click="doRemove(item._id)">删除</view>
    </van-swipe-cell>
    <view class="button-bottom">
      <van-button type="info" round @click="doOpen('./address')">新建收货地址</van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../common/common.js');
var areajs = require('../../common/area.js');
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
    .van-swipe-cell {
      border-radius: 5px;
      margin: 10px;
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
      .van-swipe-cell__right {
        width: 65px;
        background: #ee0a24;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
    }
  }
  .button-bottom {
    width: 100vw;
    position: fixed;
    bottom: 30px;
    text-align: center;
  }
}
</style>
