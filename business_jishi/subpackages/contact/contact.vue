<template>
  <view class="c-box" @click.capture="track">
    <view class="c-text-center c-bg-white">
      <view>
        <image
          aspectFit
          style="width: 128rpx; height: 128rpx; border-radius: 50%"
          src="https://pub.fsgo365.cn/7530523320819403425.png"
        ></image>
      </view>
      <view class="c-abstract-tool">
        <view @tap="doCall">
          <van-icon name="phone-o"></van-icon>
          <view>呼叫</view>
        </view>
        <view @tap="newNote">
          <van-icon name="records"></van-icon>
          <view>笔记</view>
        </view>
        <view @tap="doEdit">
          <van-icon name="edit"></van-icon>
          <view>编辑</view>
        </view>
      </view>
    </view>
    <view>
      <van-tabs
        swipeable
        sticky
        custom-class="c-h-1"
        @change="tabChange"
        :active="activeTab"
        :data-event="{ id: 'YfgiITmU43', capture: false }"
      >
        <van-tab title="信息" name="info">
          <view class="c-tab-content" :data-event="{ id: 'YfgiITmU43' }">
            <van-cell-group>
              <van-cell title="姓名" :value="formData.name"></van-cell>
              <van-cell title="手机" :value="formData.phone"></van-cell>
              <van-cell title="邮箱" :value="formData.email"></van-cell>
              <van-cell title="地址" :value="formData.address"></van-cell>
              <van-cell title="阶段" :value="formData.lifecycleStage"></van-cell>
              <van-cell title="状态" :value="formData.leadStatus"></van-cell>
            </van-cell-group>
          </view>
        </van-tab>
        <van-tab title="日志" name="log">
          <view class="c-tab-content" :data-event="{ id: 'YfgiITmU43' }">
            <view
              class="c-card"
              v-for="(item, index) in log.data"
              :key="index"
              :data-event="{ id: 'YfgiITmU43' }"
            >
              <view class="c-card-title" :data-event="{ id: 'YfgiITmU43' }">
                <view class="c-flex" :data-event="{ id: 'YfgiITmU43' }">
                  <van-icon
                    custom-class="c-card-icon"
                    name="todo-list-o"
                    :data-event="{ id: 'YfgiITmU43' }"
                  ></van-icon>
                  <text :data-event="{ id: 'YfgiITmU43' }">{{ item.title }}</text>
                </view>
                <view class="c-size-14" :data-event="{ id: 'YfgiITmU43' }">
                  {{ item.createTime }}
                </view>
              </view>
              <view class="c-p-20" :data-event="{ id: 'YfgiITmU43' }">
                <text :data-event="{ id: 'YfgiITmU43' }">{{ item.content }}</text>
              </view>
              <view class="c-p-v-20" :data-event="{ id: 'YfgiITmU43' }">
                <text :data-event="{ id: 'YfgiITmU43' }">操作人：{{ item.uaccount }}</text>
              </view>
            </view>
          </view>
        </van-tab>
        <van-tab title="笔记" name="note">
          <view
            class="c-card"
            v-for="(item, index) in note.data"
            :key="index"
            :data-event="{ id: 'YfgiITmU43' }"
          >
            <view class="c-card-title" :data-event="{ id: 'YfgiITmU43' }">
              <view class="c-flex" :data-event="{ id: 'YfgiITmU43' }">
                <van-icon
                  custom-class="c-card-icon"
                  name="todo-list-o"
                  :data-event="{ id: 'YfgiITmU43' }"
                ></van-icon>
                <text :data-event="{ id: 'YfgiITmU43' }">笔记</text>
              </view>
              <view class="c-size-14" :data-event="{ id: 'YfgiITmU43' }">
                {{ item.createTime }}
              </view>
            </view>
            <view class="c-p-20 c-auto" :data-event="{ id: 'YfgiITmU43' }">
              <rich-text :nodes="item.content"></rich-text>
            </view>
            <view class="c-p-v-20" :data-event="{ id: 'YfgiITmU43' }">
              <text :data-event="{ id: 'YfgiITmU43' }">操作人：{{ item.createUserName }}</text>
            </view>
          </view>
        </van-tab>
      </van-tabs>
    </view>
    <!-- 表单弹出层 -->
    <van-popup :show="openForm" position="bottom" @close="doCancel">
      <van-nav-bar
        title="信息"
        left-text="取消"
        right-text="保存"
        @click-left="doCancel"
        @click-right="doSave"
      ></van-nav-bar>
      <van-cell-group>
        <van-field
          label="姓名"
          :value="formData.name"
          data-key="name"
          @change="onChange"
        ></van-field>
        <van-field
          label="手机"
          :value="formData.phone"
          data-key="phone"
          @change="onChange"
        ></van-field>
        <van-field
          label="邮箱"
          :value="formData.email"
          data-key="email"
          @change="onChange"
        ></van-field>
        <van-field
          label="地址"
          :value="formData.address"
          data-key="address"
          @change="onChange"
        ></van-field>
        <van-cell
          title="阶段"
          :value="option.lifecycleStage.name"
          data-key="lifecycleStage"
          data-type="select"
          @click="onClick"
          title-class="c-cell-title"
          value-class="c-cell-value"
          is-link
        ></van-cell>
        <van-cell
          title="状态"
          :value="option.leadStatus.name"
          data-key="leadStatus"
          data-type="select"
          @click="onClick"
          title-class="c-cell-title"
          value-class="c-cell-value"
          is-link
        ></van-cell>
        <block v-for="(extField, index) in extFields" :key="index">
          <block v-if="extField.type == 'text'">
            <van-field
              :label="extField.nameDisp"
              :value="formData.exts[extField.name]"
              @change="onChange"
              :data-key="'exts.' + extField.name"
              :data-type="extField.type"
              title-class="c-cell-title"
              value-class="c-cell-value"
            ></van-field>
          </block>
          <block
            v-if="extField.type == 'date' || extField.type == 'time' || extField.type == 'datetime'"
          >
            <van-cell
              :title="extField.nameDisp"
              :value="formData.exts[extField.name]"
              @click="onClick"
              :data-key="'exts.' + extField.name"
              :data-type="extField.type"
              title-class="c-cell-title"
              value-class="c-cell-value"
              is-link
            ></van-cell>
          </block>
          <block
            v-if="
              extField.type == 'select' || extField.type == 'radio' || extField.type == 'checkbox'
            "
          >
            <van-cell
              :title="extField.nameDisp"
              :value="option.exts[extField.name].name"
              @click="onClick"
              :data-key="'exts.' + extField.name"
              :data-type="extField.type"
              title-class="c-cell-title"
              value-class="c-cell-value"
              is-link
            ></van-cell>
          </block>
          <block v-if="extField.type == 'textarea'">
            <van-field
              :label="extField.nameDisp"
              :value="formData.exts[extField.name]"
              @change="onChange"
              :data-key="'exts.' + extField.name"
              :data-type="extField.type"
              type="textarea"
              autosize
            ></van-field>
          </block>
          <block v-if="extField.type == 'switch'">
            <van-cell
              :title="extField.nameDisp"
              title-class="c-cell-title"
              value-class="c-cell-value"
            >
              <van-switch
                :checked="formData.exts[extField.name]"
                @change="onChange"
                :data-key="'exts.' + extField.name"
                :data-type="extField.type"
                active-value="1"
                inactive-value="0"
                size="18px"
              ></van-switch>
            </van-cell>
          </block>
          <block v-if="extField.type == 'rate'">
            <van-cell
              :title="extField.nameDisp"
              title-class="c-cell-title"
              value-class="c-cell-value"
            >
              <van-rate
                :value="formData.exts[extField.name]"
                @change="onChange"
                :data-key="'exts.' + extField.name"
                :data-type="extField.type"
                title-class="c-cell-title"
                value-class="c-cell-value"
                is-link
              ></van-rate>
            </van-cell>
          </block>
          <block
            v-if="extField.type == 'file'"
            title-class="c-cell-title"
            value-class="c-cell-value"
            is-link
          >
            <van-cell
              :title="extField.nameDisp"
              :value="formData.exts[extField.name]"
              :data-key="'exts.' + extField.name"
              :data-type="extField.type"
              value-class="c-flex-2"
              type="textarea"
              autosize
            ></van-cell>
          </block>
        </block>
      </van-cell-group>
    </van-popup>
    <!-- 笔记弹出层 -->
    <van-popup :show="note.open" position="bottom" @close="cancelNote">
      <van-nav-bar
        title="笔记"
        left-text="取消"
        right-text="保存"
        @click-left="cancelNote"
        @click-right="saveNote"
      ></van-nav-bar>
      <van-field
        :value="note.content"
        type="textarea"
        placeholder="请输入笔记内容"
        :autosize="{ maxHeight: 1000, minHeight: 350 }"
        border="false"
        @change="editNote"
      ></van-field>
    </van-popup>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionsheet.show"
      :actions="actionsheet.actions"
      @close="onClose"
      @select="onSelect"
    ></van-action-sheet>
    <!-- 日期时间picker -->
    <view class="c-fixed c-bottom-0 c-w-1" style="z-index: 101">
      <van-datetime-picker
        v-if="datetime.show"
        :type="datetime.type"
        :value="datetime.currentDate"
        @confirm="onConfirm"
        @cancel="cancelDatetimePicker"
      ></van-datetime-picker>
    </view>
    <!-- 时间日期遮罩层 -->
    <van-overlay :show="datetime.show" z-index="100" @click="cancelDatetimePicker"></van-overlay>
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  /**
   * 页面的初始数据
   */
  data() {
    return {
      openForm: false,
      extFields: [],
      extField: {}, //特殊字段类型 如rate值为number类型,checkbox值为数组不能为空
      formData: {},
      currentClickKey: '',
      activeTab: 'info',
      // 预置有选项的字段 返显
      option: {
        lifecycleStage: {
          valueOption: 'lifecycleStage'
        },
        leadStatus: {
          valueOption: 'leadStatus'
        }
      },
      options: {
        codecfg_lifecycleStage: {
          codeId: 'LIFECYCLESTAGE'
        },
        codecfg_leadStatus: {
          codeId: 'LEADSTATUS'
        }
      },
      // 上拉菜单
      actionsheet: {
        show: false,
        actions: []
      },
      // 时间选择器
      datetime: {
        show: false,
        type: 'datetime',
        currentDate: new Date().getTime()
      },
      log: {
        open: false,
        data: [],
        rows: 20
      },
      note: {
        open: false,
        data: [],
        content: '',
        rows: 20
      }
    };
  },
  methods: {
    onLoad: function (param) {
      common.osg.init(this, param, app);
      this.id = common.osg.param('id');
      this.getExtFields();
    },
    getExtFields: function () {
      common.osg.ajax(
        'biz/extField/query',
        {
          colName: 'contacts',
          _all: '1',
          'is:state|integer#and': 1,
          'nin:preset|array-integer#and': 1,
          sortField: 'order',
          sortOrder: 'asc'
        },
        res => {
          this.setData({
            extFields: res.data
          });
          for (var extField of res.data) {
            if (extField.valueOption) {
              this.setData({
                ['options.codecfg_' + extField.valueOption]: {
                  codeId: extField.valueOption //是选项放到options,之后从字典表查询
                },
                ['option.exts.' + extField.name]: {}, //是选项的字段单独放option,之后渲染值
                ['option.exts.' + extField.name + '.valueOption']: extField.valueOption //选项关联的字典表type
              });
            }
          }
          common.osg.codeoption(() => {
            this.getData();
          });
        }
      );
    },
    getData: function () {
      common.osg.ajax(
        'basic/contacts/queryById',
        {
          id: this.id
        },
        res => {
          this.formData = res;
          wx.stopPullDownRefresh();
          wx.setNavigationBarTitle({
            title: res.name
          });
          // 系统预置字段 传value返回name显示名称
          for (var key in this.option) {
            if (key != 'exts') {
              this.setData({
                ['option.' + key + '.name']: common.osg.codelabel(
                  this.option[key].valueOption,
                  this.formData[key]
                )
              });
            }
          }
          // 扩展字段 传value返回name显示名称
          for (var key in this.option.exts) {
            this.setData({
              ['option.exts.' + key + '.name']: common.osg.codelabel(
                this.option.exts[key].valueOption,
                this.formData.exts[key]
              )
            });
          }
        }
      );
    },
    doEdit() {
      this.setData({
        openForm: true
      });
    },
    doSave() {
      var params = {
        contacts: JSON.stringify(this.formData)
      };
      common.osg.ajax('basic/contacts/upsert.do', params, res => {
        this.getData();
        this.setData({
          openForm: false
        });
        common.osg.toast('操作成功');
      });
    },
    doCancel() {
      this.setData({
        openForm: false
      });
      this.getData();
    },
    tabChange(e) {
      let name = e.detail.name;
      this.activeTab = name;
      if (name == 'info') {
        this.getData();
      } else if (name == 'log') {
        this.getLog();
      } else if (name == 'note') {
        this.getNote();
      }
    },
    // 日志
    getLog: function () {
      common.osg.ajax(
        'biz/tenantLog/query',
        {
          sid: this.id,
          smodule: 'contacts',
          page: 1,
          rows: this.log.rows || 20
        },
        res => {
          this.setData({
            'log.data': res.data
          });
          wx.stopPullDownRefresh();
        }
      );
    },
    // 笔记
    getNote: function () {
      common.osg.ajax(
        'biz/note/query',
        {
          sid: this.id,
          smodule: 'contacts',
          page: 1,
          rows: this.note.rows || 20
        },
        res => {
          this.setData({
            'note.data': res
          });
          wx.stopPullDownRefresh();
        }
      );
    },
    newNote: function () {
      this.setData({
        'note.open': true
      });
    },
    editNote(e) {
      this.note.content = e.detail;
    },
    saveNote() {
      common.osg.ajax(
        'biz/note/upsert',
        {
          data: JSON.stringify({
            sid: this.id,
            smodule: 'contacts',
            content: this.note.content,
            mediaContent: []
          })
        },
        res => {
          this.setData({
            'note.open': false
          });
          this.getNote();
          common.osg.toast('保存成功');
        }
      );
    },
    cancelNote() {
      this.setData({
        'note.open': false,
        'note.content': ''
      });
    },
    // 拨打电话
    doCall: function () {
      wx.makePhoneCall({
        phoneNumber: this.formData.phone
      });
    },
    onChange(e) {
      var key = e.currentTarget.dataset.key;
      this.setData({
        ['formData.' + key]: e.detail
      });
    },
    /**
     * 表单字段 点击
     */
    onClick(e) {
      var key = e.currentTarget.dataset.key;
      var type = e.currentTarget.dataset.type;
      if (type == 'select' || type == 'radio' || type == 'checkbox') {
        if (key.startsWith('exts.')) {
          var extKey = key.split('.')[1];
          //预置字段 上拉菜单赋值并弹出
          this.setData({
            currentClickKey: key,
            'actionsheet.actions': this.options[this.option.exts[extKey].valueOption],
            'actionsheet.show': true
          });
        } else {
          //扩展字段 上拉菜单赋值并弹出
          this.setData({
            currentClickKey: key,
            'actionsheet.actions': this.options[this.option[key].valueOption],
            'actionsheet.show': true
          });
        }
      } else if (type == 'date' || type == 'time' || type == 'datetime') {
        if (type == 'time') {
          this.setData({
            'datetime.currentDate': '12:00'
          });
        }
        this.setData({
          'datetime.type': type,
          'datetime.show': true,
          currentClickKey: key
        });
      }
    },
    /**
     * 上拉菜单选择
     */
    onSelect(e) {
      var name = e.detail.name;
      var value = e.detail.value;
      this.setData({
        ['formData.' + this.currentClickKey]: value,
        ['option.' + this.currentClickKey + '.name']: name
      });
    },
    /**
     * 上拉菜单取消
     */
    onClose() {
      this.setData({
        'actionsheet.show': false
      });
    },
    /**
     * 提交选择时间
     */
    onConfirm(e) {
      if (this.datetime.type == 'datetime') {
        this.setData({
          ['formData.' + this.currentClickKey]: new Date(e.detail)
            .toLocaleString('chinese', {
              hour12: false
            })
            .replace(/\//g, '-'),
          'datetime.show': false
        });
      } else if (this.datetime.type == 'date') {
        this.setData({
          ['formData.' + this.currentClickKey]: new Date(e.detail)
            .toLocaleDateString()
            .replace(/\//g, '-'),
          'datetime.show': false
        });
      } else if (this.datetime.type == 'time') {
        this.setData({
          ['formData.' + this.currentClickKey]: e.detail,
          'datetime.show': false
        });
      }
    },
    /**
     * 取消选择时间
     */
    cancelDatetimePicker() {
      this.setData({
        'datetime.show': false
      });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      if (this.activeTab == 'info') {
        this.getData();
      } else if (this.activeTab == 'log') {
        this.getLog();
      } else if (this.activeTab == 'note') {
        this.getNote();
      }
    },
    onReachBottom() {
      if (this.activeTab == 'log') {
        this.log.rows += 10;
        this.getLog();
      } else if (this.activeTab == 'note') {
        this.note.rows += 10;
        this.getNote();
      }
    }
  }
};
</script>

<style>
.c-abstract-tool {
  display: inline-block;
  font-size: 12px;
  color: #323233;
  padding: 20rpx;
}

.c-abstract-tool > view {
  display: inline-block;
  margin: 0 20rpx;
}

.c-abstract-tool van-icon {
  background-color: #eaedf2;
  padding: 15rpx;
  font-size: 18px;
  border-radius: 50%;
  margin-bottom: 15rpx;
}

/* 隐藏tab标签页上边框 */
.van-hairline--top-bottom:after {
  border-width: 0 !important;
}
</style>
