<template>
  <view class="platformMaterials">
    <view class="">
      <view class="searchStyle">
        <uni-easyinput
          clearSize="22"
          class="uni-easyinput"
          prefixIcon="search"
          v-model="searchValue"
          placeholder="搜索材料名称"
          @confirm="onSearch"
          @clear="onClear"
          primaryColor="#c0c4cc"
        ></uni-easyinput>
      </view>
      <view class="tagStyle" v-if="active == 0">
        <van-tag
          v-for="(item, idnex) in tagList"
          :key="idnex"
          size="medium"
          :text-color="item.checked ? '#ff6900' : '#666666'"
          :color="item.checked ? '#e0f1fe' : ' #f2f3f5'"
          style="margin-right: 10px"
          @click.native="favClick(item)"
        >
          {{ item.name }}
        </van-tag>
      </view>
    </view>
    <view class="content">
      <block v-if="goodsList.length > 0">
        <view class="classify-goods-item" v-for="(item, index) in goodsList" :key="index">
          <view class="classify-image">
            <image
              style="width: 100%; height: 100%"
              :src="
                (item.images && JSON.parse(item.images)[0].url) ||
                'https://pub.fsgo365.cn/logo_jishi.jpg'
              "
            ></image>
          </view>
          <view class="classify-goods-item-view">
            <view class="item-view">
              <view class="title">
                {{ item.name }}
              </view>
            </view>
            <view class="c-flex c-flex-between c-item-center" style="height: 30px">
              <van-tag v-if="active == 0" color="#f2f3f5" text-color="#323233" size="large">
                {{ item.spec || '' }}{{ item.specUnit ? codelabel('unit', item.specUnit) : '' }}
              </van-tag>
              <view v-else></view>
              <van-stepper
                v-if="item.count > 0"
                :min="0"
                :value="item.count"
                input-width="50"
                button-size="32"
                @change="stepperChange($event, item)"
              />
              <view v-else class="c-plus" @click="onAdd(item)" :data-event="{ id: 'uWr7Fjk72m' }">
                <van-icon name="plus" :data-event="{ id: 'uWr7Fjk72m' }" />
              </view>
            </view>
          </view>
        </view>
      </block>
      <blcok v-else></blcok>
    </view>

    <view class="bottom-bar">
      <view class="">已选择:{{ selectedCount }}个材料</view>
      <van-button @click="submit" style="width: 200px" type="info" block>确定</van-button>
    </view>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      searchValue: '', //输入框的内容
      options: {
        codecfg_materialType: { codeId: 'type1' }, // 材料类型
        codecfg_unit: { codeId: 'company' } // 单位
      },
      paramMap: {}, //上个页面传递过来的的数组
      active: 0, // 商品类型（0：材料，1：机措）
      allGoodsList: [], // 拿到的全量数据
      goodsList: [], //列表显示的数据
      tagList: [], //标签列表
      selectedTypes: [] //选中标签的value值
    };
  },
  //计算属性 来计算当前勾选了多少个
  computed: {
    selectedCount() {
      // 统计所有已选择的材料数量，不管是否被过滤
      return this.allGoodsList.filter(item => item.count > 0).length;
    }
  },
  onLoad(params) {
    const { result, active } = params;
    if (result && active) {
      try {
        const decoded = decodeURIComponent(result);
        const resultObj = JSON.parse(decoded);
        console.log('收到的对象：', resultObj);
        // 你可以把它保存到 data 或使用它
        this.paramMap = resultObj;
        this.active = active;
      } catch (e) {
        console.error('参数解析失败', e);
      }
    }

    common.osg.init(this, params, app);
    common.osg.codeoption(() => {
      //不污染初时初始数据
      if (this.options && this.options.materialType) {
        let arr = JSON.parse(JSON.stringify(this.options.materialType));
        this.tagList = arr.map(item => ({
          ...item,
          checked: false
        }));
      }
      this.$forceUpdate();
    });
    this.getGoods(active);
  },
  onShow() {},
  methods: {
    //确定搜索时触发
    onSearch() {
      this.filterGoodsList();
    },
    onClear() {
      this.searchValue = '';
      this.filterGoodsList();
    },
    //请求数据
    getGoods(type) {
      let url = type == 0 ? 'basic/material/queryWithRank' : 'biz/measure/queryWithRank';
      common.osg.ajax(
        url,
        {
          _all: 1,
          'is:state|integer#and': 1,
          'in:serviceType|array#and': 11,
          sourceType: 1,
          sortField: 'order,_id',
          sortOrder: 'asc'
        },
        res => {
          // 初始化数据
          res.data.forEach(item => {
            let K = item._id;
            item.count = this.paramMap[K] !== undefined ? this.paramMap[K] : 0;
            console.log(item.count);
          });
          //排序
          res.data.sort((a, b) => b.count - a.count);
          // 保持引用关系
          this.allGoodsList = res.data;
          this.goodsList = res.data;
        },
        {
          noload: true
        }
      );
    },

    //复选框勾选按钮
    favClick(item) {
      this.$set(item, 'checked', !item.checked);
      this.filterGoodsList();
    },
    codelabel(options, value) {
      return common.osg.codelabel(options, value);
    },
    // 封装的过滤方法
    filterGoodsList() {
      const selectedTypes = this.tagList
        .filter(item => item.checked)
        .map(item => Number(item.value))
        .filter(val => !isNaN(val)); // 防止 NaN

      const keyword = this.searchValue.trim().toLowerCase(); // 忽略空格和大小写

      this.goodsList = this.allGoodsList.filter(good => {
        const matchType = selectedTypes.length === 0 || selectedTypes.includes(Number(good.type));
        const matchName = !keyword || (good.name && good.name.toLowerCase().includes(keyword));
        return matchType && matchName;
      });
    },

    //选择材料
    onAdd(item) {
      item.count = 1;
      item.changed = true;
    },
    //当选中的值发生改变的时候触发
    stepperChange(e, item) {
      item.count = e.detail;
      item.changed = true;
      item.state = 1;
    },
    //点击确定返回携带参数返回上一页面
    submit() {
      let arr = this.allGoodsList.filter(item => item.changed);

      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2]; // 上一个页面
      //调用上一个页面的方法
      if (typeof prevPage.$vm.goodsSelected === 'function') {
        prevPage.$vm.goodsSelected(arr);
      }
      // 返回上一页
      wx.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.platformMaterials {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

::v-deep .searchStyle {
  width: 100vw;
  padding: 10px 10px 5px 10px;
  box-sizing: border-box;
  background-color: #fff;
  .uni-easyinput > view {
    border-radius: 8px;
    border: none;
    background-color: var(--gray-2) !important;
  }
}
.tagStyle {
  width: 100vw;
  padding: 0px 10px 8px 10px;
  box-sizing: border-box;
  background-color: #fff;
}

.content {
  flex: 1;
  overflow-y: auto;
  background-color: #f7f8fa;

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

.c-plus {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #ff6900;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  margin: 1px;
  padding: 4px;
  box-sizing: border-box;
  font-size: 12px;
}

::v-deep .bottom-bar {
  width: 100vw;
  height: 75px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0px 10px 16px;
  justify-content: space-between;
  // box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
  border-top: 1rpx solid var(--gray-2);
  color: #1989fa;
  font-size: 14px;
  .van-button {
    border-radius: 6px;
  }
}
</style>
