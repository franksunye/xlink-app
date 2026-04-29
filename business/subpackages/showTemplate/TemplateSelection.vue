<template>
  <view class="TemplateSelection" @click.capture="track">
    <!-- 新建按钮 -->
    <view class="container">
      <template v-if="MyTemplate.length > 0">
        <view class="TemplateCard" v-for="(item, index) in MyTemplate" :key="index">
          <view
            class="ImageCard"
            @click.stop="JumpTemplateDetails(item._id, item)"
            :data-event="{ id: 'htqLXm_uF2' }"
          >
            <image
              :src="ProcessPicturePath(item._id, item)"
              mode="widthFix"
              :data-event="{ id: 'htqLXm_uF2' }"
            ></image>
            <view class="CardMask" :data-event="{ id: 'htqLXm_uF2' }">编辑案例</view>
            <van-icon
              custom-style="position: absolute; top: 10px; right: 10px;z-index: 10; "
              size="18px"
              name="delete-o"
              @click.native.stop="operationTemplate(item, 0)"
              :data-event="{ id: 'Y14VDS46Ul' }"
            />
          </view>
          <view class="LowerPart">
            <view class="ellipsis">{{ item.name }}</view>
            <view class="LowerPart_Bottom">
              <view style="color: #ccc; font-size: 20rpx">{{ item.updateTime }}</view>
              <view
                style="width: 80rpx; height: auto; display: flex; justify-content: space-between"
              >
                <van-icon
                  @click="operationTemplate(item, 1)"
                  size="30rpx"
                  name="edit"
                  :data-event="{ id: 'iifByK5owy' }"
                />
                <van-icon
                  @click="operationTemplate(item, 3)"
                  name="share-o"
                  size="30rpx"
                  :data-event="{ id: 'bTqg_tK_ok' }"
                />
              </view>
            </view>
          </view>
        </view>
      </template>

      <template v-if="MyTemplate.length === 0">
        <van-empty class="vanEmpty" description="暂无案例" />
      </template>
    </view>

    <view class="CreatyTemplate" @click="EjectPopup" :data-event="{ id: 'ccRaIg0tcA' }">
      <van-icon name="plus" style="color: #fff" size="30px" />
    </view>
    <van-popup
      round
      :show="BottomPopup"
      close-icon="close"
      close-on-click-overlay
      position="bottom"
      custom-style="height: 65%;"
      z-index="20"
      @close="onClose"
    >
      <view class="NewCase">新建</view>

      <view class="NewCaseBox" @click="JumpTemplateDetails()" :data-event="{ id: 'b584OVxonR' }">
        <image
          style="width: 60rpx; height: 60rpx"
          src="https://pub.fsgo365.cn/icon-createCase.png"
          mode=""
        ></image>
        <text style="margin: 0px 30rpx">创建空白案例</text>
        <van-icon name="arrow" />
      </view>
      <view style="width: 90vw; margin: 0 auto">
        <van-divider
          contentPosition="center"
          customStyle="color: #1989fa; border-color: #1989fa; font-size: 26rpx;margin: 20px 0px 0px 0px; "
        >
          使用平台模版
        </van-divider>
      </view>
      <view class="" style="overflow: hidden">
        <view class="PtTemplateCard">
          <view class="TemplateCard" v-for="(item, index) in PtTemplate" :key="index">
            <view
              class="ImageCard"
              @click="JumpTemplateDetails(item._id, item)"
              :data-event="{ id: 'sB--voPnYO' }"
            >
              <image :src="ProcessPicturePath(item._id, item)" mode="widthFix"></image>
            </view>
            <view class="LowerPart">
              {{ item.name }}
            </view>
          </view>
        </view>
      </view>
    </van-popup>

    <van-dialog
      use-slot
      title="编辑"
      :show="EditPopup"
      show-cancel-button
      @close="onClose"
      @confirm="confirm"
      :data-event="{ id: 'XMD7gS2p81' }"
    >
      <van-field
        label-class="vanLabelStyle"
        input-class="vaninputStyle"
        placeholder-style="vanLabelStyle"
        title-width="4em"
        left-icon="smile-o"
        label="案例名称"
        placeholder="请输入案例名称"
        :border="false"
        clearable
        :value="EditMsg"
        extra-event-params
        @change="onChange"
      />
    </van-dialog>

    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
var common = require('../../resources/js/common.js');
import Dialog from '../../wxcomponents/vant/dialog/dialog';
let PlatformObj = {
  'is:type|integer#and': 0,
  notFilterBelongTo: '1',
  notFilterOrgId: '1',
  'is:state|integer#and': 1
}; //查询平台模版需要的参数
let mineObj = {
  'is:type|integer#and': 2,
  'is:createUser|string#and': wx.getStorageSync('user')._id,
  'is:state|integer#and': 1
}; //查询我的模版需要的参数

export default {
  data() {
    return {
      MyTemplate: [], //我的模版数据
      PtTemplate: [], //平台模版数据
      BottomPopup: false, //吊起弹出层
      EditMsg: '', //修改后的名称
      EditPopup: false, //是否开启编辑弹窗
      EditObj: {} //要修改的对象
    };
  },
  onLoad() {},
  onHide() {
    this.onClose();
  },

  onShow() {
    this.getData(mineObj);
  },

  methods: {
    getData(obj) {
      console.log('值是否一致？', obj === mineObj);

      //默认查询平台
      common.osg.ajax('/biz/showTemplate/query', obj, res => {
        if (obj === mineObj) {
          this.MyTemplate = res.data;
        } else {
          this.PtTemplate = res.data;
        }
      });
    },

    //点击模版跳转到详情页面
    JumpTemplateDetails(Id, item) {
      if (Id && item) {
        common.osg.open(
          `/subpackages/showTemplate/showTemplate?Id=${Id}&path=${this.ProcessPicturePath(
            Id,
            item
          )}`
        );
      } else {
        common.osg.open(`/subpackages/showTemplate/showTemplate?newlyBuild=${true}`);
      }
    },
    //拿到海报的地址
    ProcessPicturePath(id, item) {
      if (item.fileid) {
        return `https://pub.fsgo365.cn/${item.fileid}.png`;
      } else {
        return `${common.osg.host}/fsgo/wm/biz/showTemplate/imgFromTemplate?tplId=${id}&tenantId=${
          wx.getStorageSync('user').tenantId
        }&access_token_h5=${wx.getStorageSync('sessionId')}`;
      }
    },
    //模版上的编辑按钮 跟 删除按钮
    operationTemplate(item, type) {
      //编辑名称的操作
      if (type === 1) {
        this.EditPopup = true;
        this.EditObj = item;
        //删除案例的操作
      } else if (type === 0) {
        Dialog.confirm({
          title: '删除案例',
          message: `确定要删除${item.name}案例嘛`,
          dataEvent: { id: 'GMaR6NibCV' }
        })
          .then(() => {
            common.osg.ajax('/biz/showTemplate/removeMulti', { ids: item._id }, res => {
              this.getData(mineObj);
              common.osg.md({ act: 'case_delete' });
            });
          })
          .catch(() => {
            console.log('算了吧');
          });
        //点击分享功能
      } else if (type === 3) {
        console.log('点击了分享');
        //调用长按分享事件
        wx.downloadFile({
          url: this.ProcessPicturePath(item._id, item),
          success: res => {
            wx.showShareImageMenu({
              path: res.tempFilePath
            });
            common.osg.md({ act: 'case_share' });
          },
          fail: err => {
            // 在这里处理下载失败的情况，比如显示错误提示信息
            wx.showToast({
              title: '下载失败，请稍后重试',
              icon: 'none'
            });
          }
        });
      }
    },
    //编辑输入框修改事件
    onChange(e) {
      const { value, callback } = e.detail;
      this.EditMsg = value;
    },
    //编辑模版确定按钮
    confirm(item) {
      if (this.EditMsg.trim() === '') return common.osg.toast('编辑内容不能为空', 'none');
      console.log(this.EditMsg);
      this.EditObj.name = this.EditMsg;
      delete this.EditObj.def;
      common.osg.ajax(
        '/biz/showTemplate/upsert',
        { showTemplateStr: JSON.stringify(this.EditObj) },
        ({ data }) => {
          this.getData(mineObj);
          common.osg.md({ act: 'case_edit' });
        }
      );
    },
    //点击新建模版吊起弹出层
    EjectPopup() {
      this.BottomPopup = true;
      this.getData(PlatformObj);
    },
    //关闭下拉框
    onClose() {
      this.EditMsg = ''; //把编辑内容清空
      this.EditObj = {}; //重置编辑对象
      this.BottomPopup = false; //关闭底部弹窗
      this.EditPopup = false; //关闭编辑弹窗
    }
  }
};
</script>

<style lang="scss">
@mixin flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.TemplateSelection {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  background-color: #f6f6f6;
  position: relative;
}
.container {
  width: 95vw;
  max-height: 100vh;
  margin: 0 auto;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  .TemplateCard {
    width: 46vw;
    height: 67vw;
    margin: 10px 0px;
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 5px 0px;
    overflow: hidden;
    border-radius: 10px;
    .ImageCard {
      position: relative;
      width: 100%;
      height: 85%;
      overflow: hidden;
      background-color: #fff;
      image {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      .CardMask {
        position: absolute;
        width: auto;
        height: 50rpx;
        padding: 0px 14rpx;
        font-size: 24rpx;
        background-color: rgba(0, 0, 0, 0.2);
        color: #ffffff;
        border-radius: 100px;
        letter-spacing: 2px;
        bottom: 5%;
        right: 5%;
        z-index: 10;
        @include flex;
      }
    }
    .LowerPart {
      position: relative;
      width: 100%;
      height: 15%;
      font-size: 28rpx;
      @include flex;
      flex-direction: column;
      .ellipsis {
        width: 90%;
        font-size: 26rpx;
        white-space: nowrap; /* 文本不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
      }
      .LowerPart_Bottom {
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
//新建模版按钮
.CreatyTemplate {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007aff;
  position: absolute;
  bottom: 5%;
  left: 50%;
  @include flex;
  transform: translateX(-50%);
  // box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  box-shadow: 0 1px 5px 2px rgba(0, 0, 0, 0.3);
  z-index: 999;
}
.NewCase {
  width: 100vw;
  height: 90rpx;
  font-size: 38rpx;
  font-weight: bolder;
  border-bottom: 1px solid #ccc;
  background-color: white;
  @include flex;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
}
.NewCaseBox {
  width: 90vw;
  height: 60px;
  margin: 10px auto;
  background-color: #eef6fe;
  font-size: 32rpx;
  border-radius: 10px;
  @include flex;
}
.PtTemplateCard {
  width: 100vw;
  white-space: nowrap;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: -10px;
  .TemplateCard {
    width: 47vw;
    height: 67vw;
    margin: 10px;
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 5px 0px;
    overflow: hidden;
    border-radius: 10px;
    display: inline-block;
    .ImageCard {
      width: 100%;
      height: 85%;
      overflow: hidden;
      background-color: #fff;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .LowerPart {
      width: 100%;
      height: 15%;
      font-size: 28rpx;
      @include flex;
    }
  }
}
.vanLabelStyle {
  font-size: 26rpx;
}
.vaninputStyle {
  font-size: 26rpx;
}
.vanEmpty {
  width: 100vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
