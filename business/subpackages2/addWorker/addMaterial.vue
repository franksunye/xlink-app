<template>
  <view class="addMaterial">
    <van-tabs @change="tabChange" :active="active" line-width="40px" line-height="3px">
      <van-tab title="材料" :name="0"></van-tab>
      <van-tab title="机措" :name="1"></van-tab>
    </van-tabs>

    <view class="classify-content">
      <view class="classify-goods-item" v-for="(item, index) in goodsList[active]" :key="item._id">
        <view class="classify-image">
          <image
            style="width: 100%; height: 100%"
            :src="
              (item.images && item.images.length > 0 && item.images[0].url) ||
              'https://pub.fsgo365.cn/logo_square.png'
            "
          ></image>
        </view>
        <view class="classify-goods-item-view">
          <view class="item-view" v-if="item.typeId">
            <view class="title">
              {{ item.name }}
            </view>
          </view>
          <view v-else>
            <textarea
              disable-default-padding
              class="custom-materials"
              :value="item.name"
              @input="confirmText($event, index)"
              placeholder="请输入"
              rows="3"
              maxlength="30"
              :disabled="projectTaskStatus == 2"
            />
          </view>

          <view class="c-flex c-flex-between c-item-center">
            <van-tag
              color="#f2f3f5"
              text-color="#323233"
              size="large"
              v-if="active == 0 && item.typeId && item.spec"
            >
              {{ item.spec }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
            </van-tag>
            <view v-else></view>
            <van-stepper
              @change="stepperChange($event, item, index)"
              :min="item._id ? 0 : null"
              :value="item.quantity"
              input-width="50"
              button-size="30"
              :disabled="projectTaskStatus == 2"
            />
          </view>
        </view>
      </view>
      <view v-if="projectTaskStatus != 2" class="classifyBtn">
        <van-button icon="plus" block @click="doOpen('../addWorker/platformMaterials')">
          平台{{ active ? '机措' : '材料' }}
        </van-button>
        <van-button icon="plus" block @click="zdyBtn()">
          自定义{{ active ? '机措' : '材料' }}
        </van-button>
      </view>
    </view>
    <!-- <view class="bottom-bar">
      <van-button type="info" block @click="voiceBtn()">长按语音识别自动添加</van-button>
    </view> -->
    <view v-if="projectTaskStatus != 2" class="bottom-bar">
      <van-button type="info" block @click="doSave()">保存</van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      projectId: '',
      projectTaskStatus: '',
      active: 0,
      goodsList: [[], []], // 二维数组，第一个子数组存储材料，第二个子数组存储机措
      options: {
        codecfg_unit: { codeId: 'company' } // 单位
      }
    };
  },
  //计算属性 来计算当前勾选了多少个
  onLoad(param) {
    common.osg.init(this, param, app);
    this.projectId = param.projectId;
    this.projectTaskStatus = param.status;
    //商品类型（0：材料，1：机措）
    // this.getData();
    this.getProjectConsumption();
    common.osg.codeoption();
  },
  onShow() {},
  methods: {
    getProjectConsumption() {
      common.osg.ajax(
        'biz/projectConsumption/findByProjectId',
        {
          projectId: this.projectId
        },
        res => {
          let materialList = [];
          let measureList = [];
          res.data.map(item => {
            if (item.type == 'material') {
              materialList.push(item);
            } else if (item.type == 'measure') {
              measureList.push(item);
            }
          });
          this.goodsList = [materialList, measureList];
        }
      );
    },
    tabChange(e) {
      this.active = e.detail.name;
    },
    //点击跳转
    doOpen(path) {
      //拿到当前的数据
      const result = this.goodsList[this.active].reduce((acc, item) => {
        acc[item.typeId] = item.quantity;
        return acc;
      }, {});
      const jsonStr = JSON.stringify(result);
      const encoded = encodeURIComponent(jsonStr);

      wx.navigateTo({ url: `${path}?result=${encoded}&active=${this.active}` });
    },
    //长按语音识别
    voiceBtn() {},
    zdyBtn() {
      this.goodsList[this.active].push({
        type: this.active == 0 ? 'material' : 'measure',
        name: '',
        quantity: 1,
        changed: true,
        state: 1,
        projectId: this.projectId,
        images: []
      });
    },

    //自定义材料确认文本
    confirmText(e, index) {
      this.goodsList[this.active][index].name = e.detail.value;
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    //当选中的值发生改变的时候触发
    stepperChange(e, item, index) {
      this.goodsList[this.active][index].quantity = e.detail;
      item.changed = true;
      if (item.quantity == 0) {
        if (item._id) {
          item.state = -1;
        } else {
          this.goodsList[this.active].splice(index, 1);
        }
      }
    },
    //上一个页面带来的数据 更新当前页面
    goodsSelected(items) {
      let list = this.goodsList[this.active];
      items.forEach(newItem => {
        const index = list.findIndex(good => good.typeId === newItem._id);
        if (index !== -1) {
          this.$set(list[index], 'quantity', newItem.count);
          this.$set(list[index], 'changed', true);
          if (newItem.count == 0) {
            this.$set(list[index], 'state', -1);
          }
        } else if (newItem.count > 0) {
          let obj = {
            name: newItem.name,
            type: this.active == 0 ? 'material' : 'measure',
            typeId: newItem._id,
            quantity: newItem.count,
            unit: newItem.unit,
            spec: newItem.spec,
            specUnit: newItem.specUnit,
            projectId: this.projectId,
            state: 1,
            changed: true
          };
          if (this.active == 0) {
            obj.images =
              newItem.images && common.osg.isJson(newItem.images)
                ? JSON.parse(newItem.images).map(image => {
                    return { url: image.url };
                  })
                : [];
          } else {
            obj.images =
              newItem.exts.images && common.osg.isJson(newItem.exts.images)
                ? JSON.parse(newItem.exts.images).map(image => {
                    return { url: image.url };
                  })
                : [];
          }

          list.push(obj);
        }
      });
    },
    doSave() {
      let data = [];
      this.goodsList.map(list => {
        list.map(item => {
          if (item.changed) {
            delete item.changed;
            data.push(item);
          }
        });
      });
      if (data.length > 0) {
        common.osg.ajax('biz/projectConsumption/adjust', { data: JSON.stringify(data) }, res => {
          common.osg.toast('添加成功', 'none');
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000);
        });
      } else {
        wx.navigateBack({
          delta: 1
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.addMaterial {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

::v-deep.classify-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 70px;
  .classify-goods-item {
    display: flex;
    align-items: center;
    width: calc(100% - 32px);
    margin: 16px;
    padding: 5px 10px;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: #fff;
    .classify-image {
      width: 70px;
      height: 70px;
      border-radius: 5px;
      margin-right: 10px;
    }
  }
  .classifyBtn {
    display: grid;
    width: calc(100% - 32px);
    margin: 16px;
    grid-template-columns: repeat(2, 1fr); /* 每行 2 个宫格 */
    gap: 16px; /* 宫格之间的间距 */
    .van-button {
      border-radius: 6px;
    }
  }

  .classify-goods-item-view {
    flex: 1;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .item-view {
      display: flex;
      align-items: center;
      height: 40px;
      .title {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 20px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 限制最多显示 2 行 */
        -webkit-box-orient: vertical; /* 垂直排列 */
        text-overflow: ellipsis;
        white-space: normal;
      }
    }
  }
}

.custom-materials {
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  line-height: 1.4;
}

::v-deep .bottom-bar {
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
