<template>
  <view class="addContacts" @click.capture="track">
    <view v-for="(item, i) in data" :key="i">
      <van-swipe-cell
        :right-width="65"
        class="c-swipe-cell"
        async-close
        @close="doRemove($event, i)"
      >
        <van-cell-group inset :border="false" custom-class="c-cell-group">
          <van-cell
            title="关系"
            :value="formatRelation(item.relation)"
            is-link
            @click="relationClick(i)"
          />
          <van-field
            label="姓名"
            :value="item.name"
            input-align="right"
            @change="nameChange($event, i)"
          />
          <van-field
            label="手机"
            :value="item.phone"
            type="number"
            :maxlength="11"
            input-align="right"
            :border="false"
            @change="phoneChange($event, i)"
            @blur="phoneBlur($event, i)"
          />
          <!-- <van-cell title="默认联系人" :border="false">
            <van-switch
              class="c-flex c-flex-end"
              :checked="item.default"
              @change="defaultChange($event, i)"
            />
          </van-cell> -->
        </van-cell-group>
        <view slot="right">删除</view>
      </van-swipe-cell>
    </view>
    <view class="c-button-group-bottom">
      <van-button
        type="info"
        block
        class="c-button-group-item c-m-r-20"
        @click="doNew"
        :data-event="{ id: 'n4BTuv8aSV' }"
      >
        新 增
      </van-button>
      <van-button
        type="info"
        block
        class="c-button-group-item"
        @click="doSave"
        :data-event="{ id: 'V27G1lDMb1' }"
      >
        保 存
      </van-button>
    </view>
    <!-- 关系 -->
    <van-action-sheet
      :show="relation.show"
      :actions="options.contactRelation"
      @close="relationClose"
      @select="relationSelect"
    />
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      id: '',
      phone: '', // 工单手机号
      data: [],
      options: {
        codecfg_contactRelation: { codeId: 'contactRelation' }
      },
      relation: {
        show: false,
        index: 0
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.id = param.id; // 工单id
    common.osg.codeoption(() => {
      this.getData();
    });
  },
  methods: {
    getData() {
      common.osg.ajax(
        'basic/serviceAppointment/queryById/' + this.id,
        { type: 'query' },
        res => {
          this.phone = res.data.serviceAppointment.phone;
          this.data = res.data.serviceAppointment.exts.phoneList || [];
          if (this.data.length == 0) {
            this.data.push({
              relation: '',
              name: '',
              phone: '',
              default: false
            });
          }
        },
        {
          noload: true
        }
      );
    },
    relationClick(index) {
      this.relation = {
        show: true,
        index
      };
    },
    relationSelect(e) {
      this.data[this.relation.index].relation = e.detail.value;
    },
    relationClose() {
      this.relation = {
        show: false,
        index: 0
      };
    },
    formatRelation(relation) {
      if (!relation) return;
      return common.osg.codelabel('contactRelation', relation);
    },
    nameChange(e, index) {
      this.data[index].name = e.detail;
    },
    phoneChange(e, index) {
      this.data[index].phone = e.detail;
    },
    phoneBlur(e, index) {
      // 校验手机号格式
      if (!/^1[3456789]\d{9}$/.test(e.detail.value)) {
        common.osg.toast('手机号格式错误', 'none');
        return;
      }
      // 校验重复手机号，如果开通中继号则不返回手机号，不会有和工单手机号相同的情况。
      if (this.phone == e.detail.value) {
        common.osg.alert('手机号不能与工单手机号相同', () => {
          this.data[index].phone = '';
        });
        return;
      }
      // 校验重复手机号
      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i];
        if (i != index && item.phone == e.detail.value) {
          common.osg.alert(`已存在手机号为${e.detail.value}的联系人`, () => {
            this.data[index].phone = '';
          });
          return;
        }
      }
    },
    defaultChange(e, index) {
      this.data[index].default = e.detail;
      // 设置当前联系人默认，其他联系人取消默认
      if (e.detail) {
        for (let i = 0; i < this.data.length; i++) {
          if (index != i) {
            this.data[i].default = false;
          }
        }
      }
    },
    doNew() {
      this.data.push({
        relation: '',
        name: '',
        phone: '',
        default: false
      });
    },
    doSave() {
      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i];
        if (!item.relation) {
          common.osg.toast('请选择关系', 'none');
          return;
        }
        if (!item.name) {
          common.osg.toast('姓名不能为空', 'none');
          return;
        }
        if (!item.phone) {
          common.osg.toast('手机号不能为空', 'none');
          return;
        }
        if (!/^1[3456789]\d{9}$/.test(item.phone)) {
          common.osg.toast('手机号格式错误', 'none');
          return;
        }
      }
      common.osg.ajax(
        'basic/serviceAppointment/upsertContact',
        {
          data: JSON.stringify({
            id: this.id,
            phoneList: this.data
          })
        },
        res => {
          common.osg.toast('保存成功', 'none');
          wx.navigateBack({
            delta: 1
          });
        }
      );
    },
    doRemove(e, index) {
      if (e.detail.position == 'right') {
        common.osg.confirm(
          '是否确认删除？',
          () => {
            this.data.splice(index, 1);
            e.detail.instance.close();
          },
          {
            fail: () => {
              e.detail.instance.close();
            }
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" slot="coped">
.addContacts {
  height: 100vh;
  padding-bottom: 65px;
  box-sizing: border-box;
  overflow-y: auto;
  .c-swipe-cell {
    .van-swipe-cell {
      margin: 10px;
      border-radius: 8px;
      .van-swipe-cell__right {
        width: 65px;
        background: #d6000f;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
    }
    .c-cell-group {
      margin: 0 !important;
      border-radius: 0;
    }
  }
}
</style>
