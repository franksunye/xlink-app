<template>
  <view class="project">
    <view v-if="contract._id" class="info">
      <view class="card-view c-flex c-flex-between">
        <view class="c-flex c-item-center">
          <view
            class="card-icon-view"
            :class="['1', '2', '5'].includes(contract.exts.sourceType) ? 'c-bg-red' : 'c-bg-blue'"
          >
            <image
              :src="
                'https://pub.fsgo365.cn/icon-' +
                (contract.serviceType == '40' ? 'shuazi.png' : 'fangshui.png')
              "
            />
          </view>
          <text
            @click.stop="
              copy(contract.contractdocNum, '已复制完整项目编号 ' + contract.contractdocNum)
            "
            :data-event="{ id: '9cXxYY12z8' }"
            class="c-m-l-20"
          >
            {{ '#' + contract.contractdocNum.slice(13) }}
          </text>
          <text
            class="c-m-l-20"
            v-if="
              contract.exts.leakagesite_copy &&
              contract.exts.leakagesite_copy[0] &&
              contract.exts.leakagesite_copy[0][0]
            "
          >
            {{ formatLeakagesite([contract.exts.leakagesite_copy[0][0]]) }}
          </text>
        </view>
        <text :class="contract.state != 10 && 'c-blue'" class="c-flex-nowrap">
          {{ codelabel('select', 'projectStatus', contract.projectStatus) || '' }}
        </text>
      </view>
      <view
        v-if="contract.district || contract.address"
        class="card-view c-flex c-flex-between"
        style="margin-left: 34px"
      >
        <view class="c-flex-1 c-ellipsis2">
          {{ contract.address.slice(contract.address.indexOf(contract.area)) || '' }}
        </view>
      </view>
      <!-- <view class="card-view c-flex c-flex-wrap" style="margin: -5px">
        <view class="c-flex c-item-center c-m-10" @click="callClick">
          <view class="card-icon-view card-icon-border c-m-r-20">
            <image
              src="https://pub.fsgo365.cn/icon-character-unknown.png"
              style="width: 22px; height: 24px"
            ></image>
          </view>
          <text class="c-size-14">
            {{
              contract.contactsName &&
              contract.contactsName.length > 4 &&
              contract.serviceHousekeeper &&
              contract.projectManagerName
                ? contract.contactsName.substring(0, 4) + '...'
                : contract.contactsName
            }}
          </text>
          <van-icon
            name="phone"
            color="#ff6900"
            class="c-m-l-10"
            :data-event="{ id: 'L9VqrFcJwQ' }"
            @click="callClick"
          />
        </view>
        <view v-if="contract.serviceHousekeeper" class="c-flex c-item-center c-m-10">
          <view class="card-icon-view card-icon-border c-m-r-20">
            <image src="https://pub.fsgo365.cn/icon-character-supervisor.png"></image>
          </view>
          <text class="c-size-14">{{ contract.serviceHousekeeper }}</text>
        </view>
        <view v-if="contract.projectManagerName" class="c-flex c-item-center c-m-10">
          <view class="card-icon-view card-icon-border c-m-r-20">
            <image src="https://pub.fsgo365.cn/icon-character-headman.png"></image>
          </view>
          <text class="c-size-14">{{ contract.projectManagerName }}</text>
        </view>
      </view> -->
    </view>
    <scroll-view scroll-y class="chat-view">
      <view class="chat" v-for="(item, index) in projectTask" :key="index">
        <view class="chat-createTime">{{ readableTime(item.createTime, 'shortDatetime') }}</view>
        <view class="chat-content">
          <image src="https://pub.fsgo365.cn/icon-ai.jpg" class="chat-avatar"></image>
          <view class="chat-card">
            <block v-for="(field, fieldIndex) in item.fieldList" :key="fieldIndex">
              <view v-if="field.type == 'title'" class="c-size-18 c-weight-600 c-m-b-10">
                {{ field.nameDisp }}
              </view>
              <view v-if="field.type == 'displayText'">{{ field.nameDisp }}</view>
              <view
                v-if="field.type == 'text' || field.type == 'textarea' || field.type == 'number'"
                style="margin: 10px 0"
              >
                <uni-easyinput
                  v-model="item.fieldData[field.name]"
                  :type="field.type"
                  :placeholder="field.placeholder || '请输入'"
                  :clearable="false"
                  :autoHeight="true"
                  :disabled="item.status == 2"
                  :trim="true"
                  @change="inputChange($event, item, field)"
                ></uni-easyinput>
              </view>
              <view v-if="field.type == 'button'">
                <van-button
                  v-if="
                    item.status == 2 &&
                    field.frontEndConfig.eventType &&
                    field.frontEndConfig.eventType != item.fieldData.eventType
                      ? false
                      : true
                  "
                  block
                  plain
                  color="#ff6900"
                  :custom-class="item.status == 2 ? 'c-button-disabled c-m-t-20' : 'c-m-t-20'"
                  :custom-style="item.status == 2 ? '' : 'border-color: #ff6900;color: #ff6900;'"
                  :disabled="item.status == 2 && field.frontEndConfig.buttonType != 'route'"
                  @click="buttonClick(item, index, field)"
                >
                  {{
                    item.status == 2 && field.frontEndConfig.buttonType == 'route'
                      ? '查看'
                      : field.nameDisp
                  }}
                </van-button>
              </view>
              <van-uploader
                v-if="field.type == 'file'"
                multiple
                :deletable="item.status == 2 ? false : true"
                @after-read="afterRead($event, item, field)"
                @delete="deleteFile($event, item, field)"
                :accept="(field.frontEndConfig && field.frontEndConfig.fileType) || 'image'"
                :preview-size="(field.frontEndConfig && field.frontEndConfig.previewSize) || '80px'"
                :file-list="item.fieldData[field.name] || []"
                :max-count="(field.frontEndConfig && field.frontEndConfig.max) || 20"
                :upload-text="(field.frontEndConfig && field.frontEndConfig.uploadText) || ''"
                :disabled="item.status == 2 ? true : false"
              ></van-uploader>
              <view
                v-if="field.type == 'data'"
                class="c-ellipsis3"
                @click="checkTextLength(field.name, item.fieldData[field.name])"
              >
                <block v-if="item.fieldData && item.fieldData[field.name]">
                  <view
                    v-for="(data, fieldDataIndex) in item.fieldData[field.name]"
                    :key="fieldDataIndex"
                  >
                    {{ fieldDataIndex + 1 }}.{{ data }}
                  </view>
                </block>
              </view>
            </block>
          </view>
        </view>
      </view>
      <view style="height: 1px"></view>
    </scroll-view>
    <view class="tools">
      <block v-for="(item, index) in projectTask" :key="index">
        <block v-if="item.type == 2 && item.status != 2">
          <block v-for="(field, fieldIndex) in item.fieldList" :key="fieldIndex">
            <view v-if="field.type == 'file' && field.frontEndConfig.update" class="tool">
              <van-uploader
                multiple
                :accept="(field.frontEndConfig && field.frontEndConfig.fileType) || 'image'"
                @after-read="afterRead($event, item, field)"
              >
                <view class="tool">
                  <van-icon :name="field.frontEndConfig.toolIcon" size="24" />
                  <text>{{ field.frontEndConfig.toolText || field.nameDisp }}</text>
                </view>
              </van-uploader>
            </view>
            <view
              v-else-if="field.type == 'button'"
              class="tool"
              @click="open(`${field.frontEndConfig.route}`, { projectId })"
            >
              <van-icon :name="field.frontEndConfig.toolIcon" size="24" />
              <text>{{ field.frontEndConfig.toolText || field.nameDisp }}</text>
            </view>
          </block>
        </block>
      </block>
    </view>
    <!-- 施工验收单-选择注意事项原因 -->
    <van-popup :show="noteItemsSelect.show" position="bottom" @close="noteItemsSelectClose" round>
      <!-- #ifdef MP-WEIXIN -->
      <van-tree-select
        :items="noteItemsSelect.items"
        :main-active-index="noteItemsSelect.mainActiveIndex"
        :active-id="noteItemsSelect.activeId"
        @click-nav="noteItemsClickNav"
        @click-item="noteItemsClickItem"
      />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <view class="c-tree-select">
        <view class="c-tree-select-left">
          <view
            v-for="(item, i) in noteItemsSelect.items"
            :key="i"
            :class="noteItemsSelect.mainActiveIndex == i ? 'c-tree-select-left-item-active' : ''"
            @click="noteItemsSelect.mainActiveIndex = i"
            :data-event="{ id: 'FKTv7aQcpr' }"
          >
            {{ item.text }}
          </view>
        </view>
        <view class="c-tree-select-right">
          <block
            v-if="
              noteItemsSelect.mainActiveIndex > -1 &&
              noteItemsSelect.items[noteItemsSelect.mainActiveIndex]
            "
          >
            <view
              v-for="(item, i) in noteItemsSelect.items[noteItemsSelect.mainActiveIndex].children"
              :key="i"
              :class="
                projectTask[projectTaskIndex].fieldData.noteItems &&
                projectTask[projectTaskIndex].fieldData.noteItems.indexOf(item.id) != -1
                  ? 'c-tree-select-right-item-active'
                  : ''
              "
              @click="
                noteItemsClickItem({
                  detail: {
                    id: item.id
                  }
                })
              "
              :data-event="{ id: 'Tyn5sHz2gX' }"
            >
              {{ item.name }}
              <van-icon
                v-if="
                  projectTask[projectTaskIndex].fieldData.noteItems &&
                  projectTask[projectTaskIndex].fieldData.noteItems.indexOf(item.id) != -1
                "
                name="success"
                color="#ee0a24"
                class="c-tree-select-right-item-icon"
              />
            </view>
          </block>
        </view>
      </view>
      <!-- #endif -->
    </van-popup>
    <!-- 施工验收单-注意事项弹窗 -->
    <van-dialog
      custom-class="noteItems-dialog"
      use-slot
      title="注意事项"
      :show="noteItems.show"
      @close="noteItemsClose"
      :data-event="{ id: 'muAawd1Z_q', capture: false }"
    >
      <view style="padding: 0 16px 16px; overflow-y: auto">
        <view v-for="(item, i) in noteItems.data" :key="i">{{ i + 1 }}.{{ item }}</view>
      </view>
    </van-dialog>
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
      projectId: '',
      systemInfo: {},
      id: '', // 工单id
      sa: {
        serviceAppointment: { orderNum: '', exts: { distance: 0 } },
        workflow: {},
        workflowNode: []
      },
      contract: {},
      options: {
        cascadeCode_repairParts: {
          codeId: 'repairParts'
        },
        codecfg_status: {
          codeId: 'STATUS'
        },
        codecfg_partsOne: { codeId: 'partsOne' },
        codecfg_projectStatus: {
          codeId: 'projectStatus'
        }
      },
      areaList: Object.assign({}, areajs.default),
      refresherTriggered: false, // 已触发下拉加载
      reachBottom: false, // 触底
      fpi: {
        page: 1,
        rows: 10,
        data: []
      },
      projectTask: [],
      projectTaskIndex: 0,
      // 施工验收单-选择注意事项
      noteItemsSelect: {
        items: [],
        mainActiveIndex: 0,
        activeId: [],
        show: false
      },
      // 施工验收单-注意事项弹窗
      noteItems: {
        show: false,
        data: []
      },
      test: {
        session: '',
        code: '',
        entry: '',
        chatId: ''
      }
    };
  },
  onLoad(params) {
    this.systemInfo = app.globalData.systemInfo;
    common.osg.init(this, params, app);
    this.id = params.id;
    this.projectId = params.projectId;
    // TODO:直接编译到本页没有location
    common.osg.getLocation(
      res => {
        app.globalData.location = res.latitude + ',' + res.longitude;
        common.osg.codeoption(() => {
          this.getContract();
        });
      },
      null,
      {
        doNotRemind: true
      }
    );
    this.getProjectTask();
  },
  onShow() {
    common.osg.init(this, {}, app);
  },
  methods: {
    getContract() {
      common.osg.ajax(`basic/contract/queryById/${this.projectId}`, {}, res => {
        this.contract = res.entity;
      });
    },
    getProjectTask() {
      common.osg.ajax(
        `biz/projectTask/query`,
        { _all: '1', bizId: this.projectId, 'ne:status|integer#and': -1 },
        res => {
          res.data.map(item => {
            item.fieldList.map(field => {
              if (field.frontEndConfig) {
                if (common.osg.isJson(field.frontEndConfig)) {
                  field.frontEndConfig = JSON.parse(field.frontEndConfig);
                }
              } else {
                field.frontEndConfig = {};
              }
            });
          });
          this.projectTask = res.data;
        },
        {
          noload: true
        }
      );
    },
    buttonClick(projectTask, projectTaskIndex, field) {
      if (common.osg.isRepeatClick(field.name, 3000, '处理中，请勿重复点击')) return;
      this.projectTaskIndex = projectTaskIndex;
      if (
        field.frontEndConfig &&
        field.frontEndConfig.buttonType == 'route' &&
        field.frontEndConfig.route
      ) {
        let params = {
          projectId: this.projectId,
          projectTaskId: projectTask._id,
          status: projectTask.status
        };
        if (field.frontEndConfig.params) {
          params = Object.assign(params, field.frontEndConfig.params);
        }
        this.open(field.frontEndConfig.route, params);
      } else if (field.name == 'noteItemsSelect') {
        // 施工验收单-选择注意事项
        projectTask.fieldData.noteItems = projectTask.fieldData.noteItems || [];
        if (this.noteItemsSelect.items.length > 0) {
          let noteItemsSelect = {
            items: this.noteItemsSelect.items,
            mainActiveIndex: 0,
            activeId: projectTask.fieldData.noteItems,
            show: true
          };
          this.$set(this, 'noteItemsSelect', noteItemsSelect);
        } else {
          this.getNoteItems(data => {
            let items = [];
            data.map(obj => {
              // 赋值组件需要用到的值
              obj.text = obj.name || obj.label;
              obj.id = obj.content || obj.leakageCause;
              // 处理成组件要求的数据结构
              if (items.find(item => item.part == obj.part)) {
                items.find(item => item.part == obj.part).children.push(obj);
              } else {
                items.push({
                  text: this.codelabel('select', 'partsOne', obj.part, this.options.partsOne),
                  part: obj.part,
                  children: [obj]
                });
              }
            });
            let noteItemsSelect = {
              items,
              mainActiveIndex: 0,
              activeId: projectTask.fieldData.noteItems,
              show: true
            };
            this.$set(this, 'noteItemsSelect', noteItemsSelect);
          });
        }
      } else {
        this.saveProjectTask(projectTask, field);
      }
    },
    saveProjectTask(projectTask, field) {
      let obj = {
        taskId: projectTask._id,
        event: field.frontEndConfig.eventType || projectTask.exts.eventType //started开工 safety安全 material材料 labourer人员 work上工地 process施工 rest下工地 finished完工
      };
      let param = {};
      for (let item of projectTask.fieldList) {
        if (
          item.type == 'file' ||
          (item.type != 'title' && item.type != 'displayText' && item.type != 'button')
        ) {
          param[item.name] = projectTask.fieldData[item.name];
          if (
            item.required &&
            (Array.isArray(param[item.name])
              ? param[item.name].length == 0
              : !param[item.name] && param[item.name] !== 0)
          ) {
            common.osg.toast(`“${item.nameDisp}”为必填项`, 'none');
            return;
          }
        }
      }
      if (field.type == 'button' && field.frontEndConfig.eventType) {
        param.eventType = field.frontEndConfig.eventType;
      }
      obj.param = param;
      common.osg.ajax(
        `biz/projectTask/confirm`,
        obj,
        res => {
          this.getProjectTask();
        },
        {
          header: { 'Content-Type': 'application/json' },
          noload: true
        }
      );
    },
    openExtForm() {
      common.osg.open('/subpackages/extForm/extForm', {
        formDefId: '4111671741587344175',
        formDataId: '8205926800580427927',
        workflowNodeId: '2965072068821236022',
        sid: this.sa.serviceAppointment._id,
        serviceType: this.sa.serviceAppointment.serviceType,
        sourceType: this.sa.serviceAppointment.exts.sourceType
      });
    },
    open(path, data) {
      common.osg.open(path, data);
    },
    inputChange(value, projectTask, field) {
      if (field.frontEndConfig.update) this.saveProjectTask(projectTask, field);
    },
    afterRead(event, projectTask, field) {
      console.log('event', event);
      if (!projectTask.fieldData[field.name]) {
        projectTask.fieldData[field.name] = [];
      }
      const { file } = event.detail;
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      if (!Array.isArray(file)) {
        let item = file;
        common.osg.ajax(
          'back/super/file/upToken.do',
          {
            fileName: item.url.split('/')[item.url.split('/').length - 1]
          },
          data => {
            let that = this;
            common.osg.loading();
            wx.uploadFile({
              url: 'https://up-z1.qiniup.com',
              filePath: item.url,
              name: 'file',
              formData: data,
              success(res) {
                let currentFileType = item.fileType || item.type;
                console.log('currentFileType', currentFileType);
                projectTask.fieldData[field.name].push({
                  url:
                    common.osg.downloadUrl +
                    JSON.parse(res.data).key +
                    (currentFileType == 'image' ? '!convert.jpg' : '')
                });
                that.$forceUpdate();
                if (
                  projectTask.type == '1' ||
                  (projectTask.type == '2' && field.frontEndConfig && field.frontEndConfig.update)
                ) {
                  that.saveProjectTask(projectTask, field);
                }
                common.osg.unload();
              },
              fail() {
                common.osg.unload();
                common.osg.toast('上传失败', 'error');
              }
            });
          },
          {
            noload: true
          }
        );
      } else {
        for (let item of file) {
          common.osg.ajax(
            'back/super/file/upToken.do',
            {
              fileName: item.url.split('/')[item.url.split('/').length - 1]
            },
            data => {
              let that = this;
              common.osg.loading();
              wx.uploadFile({
                url: 'https://up-z1.qiniup.com',
                filePath: item.url,
                name: 'file',
                formData: data,
                success(res) {
                  let currentFileType = item.fileType || item.type;
                  console.log('currentFileType', currentFileType);
                  projectTask.fieldData[field.name].push({
                    url:
                      common.osg.downloadUrl +
                      JSON.parse(res.data).key +
                      (currentFileType == 'image' ? '!convert.jpg' : '')
                  });
                  that.$forceUpdate();
                  if (
                    projectTask.type == '1' ||
                    (projectTask.type == '2' && field.frontEndConfig && field.frontEndConfig.update)
                  ) {
                    that.saveProjectTask(projectTask, field);
                  }
                  common.osg.unload();
                },
                fail() {
                  common.osg.unload();
                  common.osg.toast('上传失败', 'error');
                }
              });
            },
            {
              noload: true
            }
          );
        }
      }
    },
    deleteFile(event, projectTask, field) {
      let index = event.detail.index;
      projectTask.fieldData[field.name].splice(index, 1);
      if (field.frontEndConfig && field.frontEndConfig.update) {
        this.saveProjectTask(projectTask, field);
      }
    },
    copy(data, msg) {
      common.osg.setClipboardData(data, msg);
    },
    codelabel(type, option, val) {
      if (!val) return;
      if (type == 'select') {
        return common.osg.codelabel(option, val);
      } else if (type == 'cascade') {
        return common.osg.formatCascade(option, val);
      }
    },
    formatLeakagesite(value) {
      if (!value || value.length == 0 || !Array.isArray(value)) return '';
      let leakagesite1 = [];
      value.map(item => {
        leakagesite1.push(item[0]);
      });
      if (leakagesite1.length > 0) {
        let str = common.osg.codelabelForArray('repairParts', leakagesite1, ' ');
        if (str && str.length > 7) {
          return str.substring(0, 7) + '...';
        } else {
          return str;
        }
      } else {
        return '';
      }
    },
    callClick() {
      let phone = this.sa.serviceAppointment.phone;
      if (phone) {
        this.makeCall(phone);
      } else {
        this.call();
      }
    },
    call() {
      common.osg.ajax(
        'basic/winnerlook/getMiddleNumberBySid',
        {
          sid: this.sa.serviceAppointment._id
        },
        res => {
          this.makeCall(res.data.phoneNumberX);
        }
      );
    },
    makeCall(phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },
    /**
     * 施工验收单-服务人员
     */
    getNoteItems(callback) {
      common.osg.ajax(
        'biz/extForm/queryByColName/noteItems',
        {
          _all: '1',
          sortField: 'partOrder,order',
          sortOrder: 'asc'
        },
        res => {
          if (callback) callback(res.data);
        }
      );
    },
    // 选择左侧部位
    noteItemsClickNav({ detail = {} }) {
      this.noteItemsSelect.mainActiveIndex = detail.index || 0;
    },
    // 选择右侧渗漏原因
    noteItemsClickItem({ detail = {} }) {
      let index = this.projectTask[this.projectTaskIndex].fieldData.noteItems.indexOf(detail.id);
      if (index == -1) {
        this.projectTask[this.projectTaskIndex].fieldData.noteItems.push(detail.id);
      } else {
        this.projectTask[this.projectTaskIndex].fieldData.noteItems.splice(index, 1);
      }
    },
    noteItemsSelectClose() {
      this.noteItemsSelect.show = false;
    },
    // 关闭渗漏原因弹窗
    noteItemsClose() {
      this.noteItems = {
        show: false,
        data: []
      };
    },
    checkTextLength(fieldName, data) {
      if (data && data.join('').length > 40) {
        this[fieldName] = {
          show: true,
          data
        };
      }
    },
    readableTime(val, type) {
      return common.osg.readableTime(val, type);
    }
  }
};
</script>

<style lang="scss">
.project {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .info {
    background-color: #fff;
    padding: 5px 16px;
    box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
    .card-view {
      line-height: 28px;
      .card-icon-view {
        width: 24px;
        height: 24px;
        box-sizing: border-box;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        image {
          width: 20px;
          height: 20px;
        }
      }
      .card-icon-border {
        border: 1px solid #ebedf0;
        border-radius: 4px;
      }
    }
  }
  .chat-view {
    flex: 1;
    overflow-y: auto;
    .chat {
      margin: 16px 0;
      .chat-createTime {
        margin-left: 60px;
        width: calc(100vw - 120px);
        box-sizing: border-box;
        text-align: center;
        margin-bottom: 16px;
        font-size: 14px;
        color: #969799;
      }
      .chat-content {
        display: flex;
      }
      .chat-avatar {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        margin: 0 10px;
      }
      .chat-card {
        border-radius: 8px;
        background-color: #fff;
        padding: 12px;
        width: calc(100vw - 120px);
        line-height: 24px;
        box-sizing: border-box;
        box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
        .c-button-disabled {
          background-color: #f5f5f5 !important;
          border-color: #969799 !important;
          color: #969799 !important;
          opacity: var(--button-disabled-opacity, 0.5);
        }
        .van-uploader__upload {
          margin: 8px 8px 0 0;
        }

        .van-uploader__preview {
          margin: 8px 8px 0 0 !important;
          .van-uploader__preview-delete:after {
            width: 20px;
            height: 20px;
            border-radius: 0 0 0 3px;
          }
          .van-uploader__preview-delete {
            .van-uploader__preview-delete-icon {
              font-size: 22px;
            }
          }
        }
      }
    }
  }

  .tools {
    display: flex;
    justify-content: space-evenly;
    padding-bottom: env(safe-area-inset-bottom);
    .tool {
      width: 70px;
      height: 70px;
      background-color: #fff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
      > text {
        font-size: 14px;
        color: #646566;
        margin-top: 5px;
      }
    }
  }
  .van-tree-select__nav {
    width: 80px;
  }
  .van-tree-select__content {
    width: calc(100vw - 80px);
  }
}
</style>
