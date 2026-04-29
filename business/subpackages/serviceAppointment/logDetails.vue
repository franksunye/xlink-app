<template>
  <view class="body" @click.capture="track">
    <!-- 手写一个下拉列表 -->
    <view style="flex: 1; overflow-y: auto">
      <van-action-sheet
        :show="ProcesSelectionShow"
        :actions="ProcesSelectionActions"
        cancel-text="取消"
        @close="onClose"
        @select="onSelect"
        @cancel="onClose"
      />
      <van-popup :show="processListShow" round @close="processListClose">
        <view class="processListBox">
          <block v-if="ProcessChoiceModule === 0">
            <van-notice-bar left-icon="info-o" text="注意:同一个日志只允许有一个维修部位" />
            <view class="searchBox" v-if="newSelectedProcessList.length > 0">
              <view
                :style="{ flex: 1, minHeight: newSelectedProcessList.length <= 0 ? '3vh' : 'auto' }"
              >
                <van-tag
                  v-for="(item, index) in newSelectedProcessList"
                  :key="index"
                  closeable
                  size="medium"
                  type="primary"
                  id="primary"
                  @close="removeSelectedProcessList(item)"
                  style="margin-right: 10rpx"
                >
                  {{ item.content }}
                </van-tag>
              </view>
              <view
                @click="finishSelectedProcessList"
                style="width: fit-content; font-size: 28rpx; color: red"
                :data-event="{ id: '-vGY7hnaRh' }"
              >
                完成
              </view>
            </view>
          </block>
          <view class="processList">
            <!-- 工序中选择 -->
            <template v-if="ProcessChoiceModule === 1">
              <view
                style="
                  width: 100%;
                  top: 0;
                  background: #fff;
                  margin: 0px auto;
                  padding-top: 20rpx;
                  position: sticky;
                "
              >
                <van-search
                  :value="ProcessValue"
                  shape="round"
                  placeholder="请输入工序名称"
                  @change="updateProcessName"
                  @search="SearchProcessName"
                  @clear="SearchProcessName"
                />
              </view>

              <view v-if="allProcessListShow.length > 0">
                <view
                  class="ProcessBox"
                  v-for="(item, index) in allProcessListShow"
                  :key="index"
                  @click="handleParentClick(item)"
                  :data-event="{ id: 'F4YIzxSI-4' }"
                >
                  <view class="ProcessBox_name" :data-event="{ id: 'F4YIzxSI-4' }">
                    <view style="color: black" :data-event="{ id: 'F4YIzxSI-4' }">
                      {{ item.content }}
                    </view>
                  </view>
                  <view class="ProcessBox_desc" :data-event="{ id: 'F4YIzxSI-4' }">
                    {{ item.desc }}
                  </view>
                </view>
              </view>
              <view v-if="allProcessListShow.length === 0">
                <van-empty image="search" description="暂无符合条件的工序" />
              </view>
            </template>
            <!-- 订单中选择 -->
            <view v-if="ProcessChoiceModule === 0">
              <view
                :style="{
                  width: '95%',
                  height: 'auto',
                  margin: '20rpx auto',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px',
                  opacity: isButtonDisabled(I) ? 0.6 : 1
                }"
                v-for="(items, I) in Allparts"
                :key="I"
              >
                <block v-if="shouldShowPackage(items.procedures.data)">
                  <!-- 部位 -->
                  <view class="">
                    <van-collapse accordion :value="ActiveName1" @change="activeName1">
                      <van-collapse-item
                        :disabled="isButtonDisabled(I)"
                        :title="'部位 :'"
                        :value="items.constructionLocation"
                        :name="I"
                      >
                        <block v-for="(item, index) in items.procedures.data" :key="index">
                          <view
                            v-if="shouldShowPackage(item)"
                            class="ProcessBox"
                            @click="handleParentClick(item, I, items.constructionLocation)"
                            :data-event="{ id: '8bptSo2rXV' }"
                          >
                            <view class="ProcessBox_name">
                              <view style="color: black">{{ item.name }}</view>
                              <view class="ProcessBox_icon" v-if="item.checked">
                                <van-icon color="red" size="20" name="success" />
                              </view>
                            </view>
                            <view class="ProcessBox_desc">{{ item.desc }}</view>
                          </view>
                        </block>
                      </van-collapse-item>
                    </van-collapse>
                  </view>
                </block>

                <!-- 套餐 -->
                <view class="">
                  <view class="" v-for="(i, Ins) in items.projPackages.data" :key="Ins">
                    <block v-if="shouldShowPackage(i.procedureList)">
                      <van-collapse accordion :value="ActiveName" @change="activeName">
                        <van-collapse-item
                          :disabled="isButtonDisabled(I)"
                          :title="'套餐名称 :'"
                          :value="i.name"
                          :name="Ins.toString() + I"
                        >
                          <view class="" v-for="(J, is) in i.procedureList" :key="is">
                            <block v-if="shouldShowPackage(J)">
                              <view
                                style="width: 90%; margin: 20rpx auto"
                                class="ProcessBox"
                                @click="
                                  handleParentClick(J.procedure, I, items.constructionLocation)
                                "
                                :data-event="{ id: 'gU0tBIioih' }"
                              >
                                <view class="ProcessBox_name">
                                  <view style="color: black">
                                    {{ J.procedure.name }}
                                  </view>
                                  <view class="ProcessBox_icon" v-if="J.procedure.checked">
                                    <van-icon color="red" size="20" name="success" />
                                  </view>
                                </view>
                                <view class="ProcessBox_desc">{{ J.procedure.desc }}</view>
                              </view>
                            </block>
                          </view>
                        </van-collapse-item>
                      </van-collapse>
                    </block>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </van-popup>
      <!-- 查询到多笔订单订单 -->
      <van-dialog
        use-slot
        title="查询到多笔订单"
        :show="orderProcesSelectionShow"
        show-cancel-button
        @confirm="ConfirmOrderProcesSelection"
        @close="CloseorderProcesSelection"
        :width="screenWidth"
        :data-event="{ id: '9obbTBYfhe', capture: false }"
      >
        <view style="width: 95%; max-height: 70vh; overflow-y: auto; margin: 0 auto">
          <view hover-class="none" hover-stop-propagation="false"></view>
          <van-radio-group :value="radioIndex" @change="onChangeRadio">
            <van-radio v-for="(item, index) in orderProcesSelection" :key="index" :name="index">
              <view class="radioBox">
                <view class="">订单编号：{{ item._id }}</view>
                <view class="">创建时间：{{ item.createTime }}</view>
                <view class="">订单金额：{{ item.totalPrice }}</view>
              </view>
            </van-radio>
          </van-radio-group>
        </view>
      </van-dialog>

      <view class="ProcessCard" v-for="(item, index) in SelectedProcessList" :key="index">
        <view class="ProcessCardName">
          <view>{{ item.content }}</view>
          <view
            v-if="resJSON.state !== 1"
            class="ProcessCardIcon"
            @click="deleteSelectedProcessList(index)"
            :data-event="{ id: 'eec4J7NM9A' }"
          >
            <van-icon name="delete-o" />
          </view>
        </view>

        <!-- 步骤列表 -->
        <view>
          <template v-if="item.processStepDefinitions">
            <view class="ProcessCell" v-for="(i, inx) in item.processStepDefinitions" :key="inx">
              <van-cell-group inset :border="false">
                <!-- 可以实现渐变 -->
                <view class="">
                  <van-cell :border="false" title-style="flex:none;">
                    <template v-if="i.type === '1'">
                      <view slot="title" class="vanCellTitle" style="width: 70vw">
                        <view class="van-cell-text limitedWidthTextStyle" style="">
                          {{ i.name }}
                        </view>
                        <textarea
                          :disabled="resJSON.state === 1"
                          style="border-bottom: 1px solid #ccc; padding-bottom: 10px"
                          :value="i.txt"
                          confirm-type="done"
                          auto-height
                          maxlength="150"
                          placeholder="请输入内容"
                          @input="TextareaChange($event, i)"
                        ></textarea>
                      </view>
                    </template>
                    <template v-if="i.type === '2'">
                      <view class="vanCellTitle" slot="title">
                        <view class="van-cell-text limitedWidthTextStyle">
                          {{ i.name }}
                        </view>

                        <view class="Locations">
                          <van-uploader
                            :deletable="resJSON.state !== 1"
                            :disabled="resJSON.state === 1"
                            multiple
                            accept="image"
                            :file-list="i.urls"
                            @after-read="afterRead($event, i, index)"
                            @delete="deleteFile($event, i, index)"
                            :max-count="9"
                            @click.native="uploadedImageIndex(index, inx)"
                          />
                        </view>
                      </view>
                    </template>
                  </van-cell>
                </view>
              </van-cell-group>
            </view>
          </template>
        </view>
      </view>
    </view>

    <!-- 是否显示提交按钮 -->
    <view class="buttonBottom" v-if="resJSON.state !== 1">
      <van-button
        plain
        icon="notes-o"
        block
        round
        class="c-button-group-item c-m-r-20"
        @click="selectProcess"
        :data-event="{ id: 'hzGyGCSx2o' }"
      >
        选择工序
      </van-button>
      <van-button
        v-if="resJSON.state == null"
        @click="saveLogs(0)"
        type="info"
        icon="completed-o"
        block
        round
        class="c-button-group-item"
        :data-event="{ id: 'uja4-c12CS' }"
      >
        保存
      </van-button>
      <van-button
        v-if="resJSON.state === 1 || resJSON.state == 0"
        @click="saveLogs(1)"
        type="info"
        icon="completed-o"
        block
        round
        class="c-button-group-item"
        :data-event="{ id: '8jNqDkRzpa' }"
      >
        提交
      </van-button>
    </view>
    <!-- 轻提示节点 -->
    <van-toast id="van-toast" />
    <!-- dialog弹窗 节点 -->
    <van-dialog id="van-dialog" />

    <!-- 弹出工单相册 -->
    <van-popup
      :show="workOrderAlbum"
      close-on-click-overlay
      @click-overlay="clickOverlay"
      @close="clickOverlay"
      round
      position="bottom"
      custom-style="height:80%"
    >
      <view class="" v-for="(items, inx) in photoAlbumType" :key="items.name">
        <view class="" style="padding: 10px">
          <van-tag
            size="large"
            :type="
              inx === 0
                ? 'primary'
                : inx === 1
                ? 'success'
                : inx === 2
                ? 'danger'
                : inx === 3
                ? 'warning'
                : 'primary'
            "
          >
            {{ items.name + '图片' }}
          </van-tag>
        </view>
        <van-grid square column-num="3">
          <block v-if="result[items.value] && Object.keys(result[items.value]).length === 0">
            <van-grid-item use-slot>
              <image
                style="width: 80%; height: 80%"
                src="https://img.yzcdn.cn/vant/custom-empty-image.png"
              />
              <view style="font-size: 14px">暂无图片</view>
            </van-grid-item>
          </block>
          <block v-for="(value, key, index) in result[items.value]" :key="key">
            <van-grid-item use-slot v-for="(val, keys, i) in value" :key="keys">
              <image
                @click="GirdPic(val)"
                style="width: 80%; height: 80%"
                :src="val"
                :key="i"
                :data-event="{ id: 'yc63Bghny3' }"
              />
              <view style="font-size: 14px">{{ key }}</view>
            </van-grid-item>
          </block>
        </van-grid>
      </view>
    </van-popup>
  </view>
</template>

<script>
const app = getApp();
let common = require('../../resources/js/common.js');
import Toast from '../../wxcomponents/vant/toast/toast';
import Dialog from '../../wxcomponents/vant/dialog/dialog';

// 施工日志formDefId：9190357980804726357
var formDefId = '9190357980804726357';
export default {
  data() {
    return {
      resJSON: [], //原始数据
      ProcesSelectionShow: false, //工序选择列表
      ProcesSelectionActions: [{ name: '从订单中选择' }, { name: '从平台工序中选择' }],
      processListShow: false, //显示工序列表
      serviceType: '', //服务类型
      sourceType: '', //信息来源
      WorkOrderId: '', //工单ID
      Edit: false, //是否是从详情列表 中的工序点击进来的  是否是编辑模式
      PositionIndex: null, //当前选择的工序套餐 索引
      repairParts: undefined, //当前选择的部位数组
      allProcessListShow: [], // 所有的工序列表
      ProcessValue: '', //工序名称
      SelectedProcessList: [], //选中的工序列表
      newSelectedProcessList: [], //多选 工序列表
      order_id: null, //编辑订单的_id 当再次编辑或者保存的时候 不再生成新的施工日志
      orderProcesSelection: [], //从订单工序中选择 拿到的数据列表
      orderProcesSelectionShow: false, //订单工序弹窗显示
      radioIndex: 0, //选择的订单索引
      orderId: 0, //选择的订单id
      screenWidth: 300, //当前手机屏幕 的95vw宽度
      Allparts: [], //从订单工序中选择 拿到的数据所有的部位
      ProcessChoiceModule: 0, //是从订单中选择还是从工序中选择
      ActiveName: null,
      ActiveName1: null,
      workOrderAlbum: false, //是否开启工单相册弹窗
      //字典项目
      options: {
        codecfg_albumLabel: { codeId: 'albumLabel' }
      },
      photoAlbumType: [], //侦查 签约 进场 验收 字典项目
      result: {},
      uploaderIndex: null, //上传图片的索引
      processStepIndex: null //当前操作的步骤索引
    };
  },
  async onLoad(e) {
    common.osg.init(this, e, app);
    this.screenWidth = wx.getSystemInfoSync().windowWidth * 0.95;
    const { serviceType, sourceType, id, obj, sourceOfSelection, Edit } = e;
    //obj 上个页面携带过来的页面 再次编辑
    if (obj !== 'undefined' && obj !== 'null') {
      //_id 这个对象的下划线id  再次编辑的时候不再创建新的日志
      this.order_id = obj;
      this.getProcess(obj);
    }
    if (serviceType && sourceType && id) {
      this.serviceType = serviceType;
      this.sourceType = sourceType;
      this.WorkOrderId = id;
      //从订单中选择 从工序中选择
      this.ProcessChoiceModule = Number(sourceOfSelection);
      this.Edit = Edit !== 'false';
      await this.getOrderId();
      //调出来选择框
      if (this.resJSON.state !== 1 && !this.Edit) {
        this.selectProcess();
      }
    }
  },
  watch: {
    newSelectedProcessList: {
      handler(newVal, oldVal) {
        // 检查数组的长度变化
        if (newVal.length !== oldVal.length) {
          // 如果新数组长度为 0，则将 PositionIndex 设置为 null
          if (newVal.length === 0 && this.SelectedProcessList.length === 0) {
            this.PositionIndex = null;
          }
        }
      }
    },
    SelectedProcessList: {
      handler(newVal) {
        // 如果新数组长度为 0，则将 PositionIndex 设置为 null
        if (newVal.length === 0) {
          this.PositionIndex = null;
        }
      }
    }
  },
  methods: {
    getDate(name = null) {
      common.osg.ajax(
        'biz/procedure/queryWithRank',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'in:serviceType|array#and': this.serviceType,
          'regex:name|string#and': name,
          sourceType: this.sourceType,
          sortField: 'order,_id',
          sortOrder: 'asc',
          'is:isAccepted|string#and': '1',
          'regex:exts.repairParts|string#and': JSON.stringify(this.repairParts)
        },
        res => {
          this.allProcessListShow = res.data;
          console.log('所有的工序列表', this.allProcessListShow);
          //打开工序列表
          this.processListShow = true;
        },
        { noload: true }
      );
    },
    //从订单中选择
    // getOrderId() {
    //   common.osg.ajax(
    //     'basic/order/query',
    //     {
    //       notFilterBelongTo: '1',
    //       notFilterOrgId: '1',
    //       _all: '1',
    //       serviceAppointmentId: this.WorkOrderId,
    //       sortField: 'createTime',
    //       sortOrder: 'desc',
    //       // 'ne:processState|integer#and': '-2',//审核通过已作废，则不能签约查询了
    //       'in:state|array-integer#and': '0,1'
    //     },
    //     res => {
    //       //订单列表拿到的数据
    //       this.orderProcesSelection = res.data;
    //       console.log('订单列表', this.orderProcesSelection);
    //     },
    //     { noload: true }
    //   );
    // },
    getOrderId() {
      return new Promise(resolve => {
        common.osg.ajax(
          'basic/order/query',
          {
            notFilterBelongTo: '1',
            notFilterOrgId: '1',
            _all: '1',
            serviceAppointmentId: this.WorkOrderId,
            sortField: 'createTime',
            sortOrder: 'desc',
            // 'ne:processState|integer#and': '-2',//审核通过已作废，则不能签约查询了
            'in:state|array-integer#and': '0,1'
          },
          res => {
            // 订单列表拿到的数据
            this.orderProcesSelection = res.data;
            console.log('订单列表', this.orderProcesSelection);
            resolve(true); // 解析 Promise
          },
          {
            noload: true
          }
        );
      });
    },
    //数据回显
    getProcess(id) {
      common.osg.ajax(
        `biz/extForm/query/${formDefId}`,
        {
          sortField: 'createTime',
          sortOrder: 'asc',
          'is:serviceAppointmentId|string#and': this.WorkOrderId,
          'ne:state|integer#and': -1,
          'is:_id|string#and': id
        },
        res => {
          const { data } = res;
          this.resJSON = data[0];
          this.order_id = data[0]._id;
          // console.log('res', res);
          //   console.log('resJSON', this.resJSON);
          //   console.log('订单id是否收到了干扰', this.orderId);
          this.orderId = this.resJSON.orderId;
          this.SelectedProcessList = data[0].data;
          //拿到部位的索引
          this.PositionIndex = data[0].positionIndex;
          //拿到部位的数组项目
          this.repairParts = data[0].repairParts;
        },
        { noload: true }
      );
    },
    //是否显示工序列表选择
    selectProcess() {
      if (this.orderId && this.Edit) {
        this.ProcesSelectionShow = true;
      } else {
        this.onSelect();
      }
    },
    //关闭工序列表选择
    onClose() {
      this.ProcesSelectionShow = false;
    },
    //工序选择弹出层 从订单中选择还是从工序中选择
    onSelect(e) {
      if (this.orderId && this.Edit) {
        this.ProcessChoiceModule = this.ProcesSelectionActions.findIndex(
          item => item.name === e.detail.name
        );
        if (this.ProcessChoiceModule === 0) {
          this.radioIndex = this.orderProcesSelection.findIndex(item => item._id == this.orderId);
          console.log(this.order_id);
          console.log(this.orderId);

          this.ConfirmOrderProcesSelection();
          return;
        }
      }

      if (this.ProcessChoiceModule === 0) {
        // 设置 processListShow 状态
        if (this.Allparts.length > 0 && this.SelectedProcessList.length > 0) {
          this.processListShow = true;
          return;
        }
        // 处理多个订单情况
        if (this.orderProcesSelection.length >= 2) {
          this.orderProcesSelectionShow = true;
        } else {
          const selectedOrder = this.orderProcesSelection[0];
          // 检查订单的有效性
          if (!selectedOrder || !selectedOrder.bjProducts) {
            Toast.fail('订单错误');
            return;
          }
          console.log('当只有一个订单的时候拿到的数据', selectedOrder);
          // 获取订单 ID 和解析产品
          this.orderId = selectedOrder._id;
          console.log('保存的时候', this.orderId);
          this.Allparts = JSON.parse(selectedOrder.bjProducts).orderList;
          this.processListShow = true;
        }
      } else if (this.ProcessChoiceModule === 1) {
        this.getDate();
      }
    },
    //从订单中选择  多个订单 单选框状态改变事件
    onChangeRadio(e) {
      //勾选框选择的那个订单
      this.radioIndex = e.detail || 0;
    },
    //从订单中选择 多个订单弹出层取消事件
    CloseorderProcesSelection() {
      this.orderProcesSelectionShow = false;
    },
    //从订单中选择多个订单弹出层确定事件
    ConfirmOrderProcesSelection() {
      let NewOrderProcesSelection = JSON.parse(
        this.orderProcesSelection[this.radioIndex].bjProducts
      );
      //多个订单 选择的数据订单id
      this.orderId = this.orderProcesSelection[this.radioIndex]._id;
      this.Allparts = NewOrderProcesSelection.orderList;
      console.log('套餐列表', this.Allparts[0].projPackages.data);
      console.log('部位', this.Allparts[0].procedures.data);

      this.processListShow = true;
    },
    //检查是否显示该套餐的方法
    shouldShowPackage(item) {
      // 检查是否是数组
      if (Array.isArray(item)) {
        // 如果是数组，检查是否有任何元素的 isAccepted 属性为 '1'
        return item.some(i =>
          i.procedure ? i.procedure.isAccepted === '1' : i.isAccepted === '1'
        );
      } else {
        // 如果是对象，检查 isAccepted 属性
        // return item?.procedure?.isAccepted === '1';
        return item.procedure ? item.procedure.isAccepted === '1' : item.isAccepted === '1';
      }
    },
    //工序名称改变事件
    updateProcessName(e) {
      this.ProcessValue = e.detail;
    },
    //文本框输入事件
    TextareaChange(e, item) {
      item.txt = e.detail.value;
      this.resJSON.state = null;
    },
    //搜索框 搜索事件
    SearchProcessName() {
      this.getDate(this.ProcessValue);
    },
    //点击遮照层 关闭工序列表弹出层事件
    processListClose() {
      // 清除 newSelectedProcessList 中所有对象的 checked 属性
      this.newSelectedProcessList.forEach(item => {
        delete item.checked; // 移除 checked属性
      });
      this.newSelectedProcessList = [];
      this.processListShow = false;
    },
    //工序列表 部位点击事件
    handleParentClick(item, index) {
      if (this.ProcessChoiceModule === 0) {
        //当前选择的步骤列表
        this.PositionIndex = index;
        // 直接使用 Vue.set 来设置 checked 属性
        if (item.checked === undefined) {
          // 如果 checked 未定义，设置为 true
          this.$set(item, 'checked', true);
        } else {
          // 如果 checked 已定义，取反
          this.$set(item, 'checked', !item.checked);
          this.newSelectedProcessList = this.newSelectedProcessList.filter(
            item => item.checked === true
          );
        }
        if (item.checked) {
          this.newSelectedProcessList.push(item);
        }
      } else if (this.ProcessChoiceModule === 1) {
        this.SelectedProcessList.push({
          desc: item.desc,
          content: item.content,
          _id: item._id,
          processStepDefinitions: item.processStepDefinitions
        });
        this.processListClose();
      }
      this.resJSON.state = null;
    },
    //删除多选中的工序
    removeSelectedProcessList(item) {
      this.$set(item, 'checked', false);
      this.newSelectedProcessList = this.newSelectedProcessList.filter(
        item => item.checked === true
      );
      //显示保存按钮
      this.resJSON.state = null;
    },
    //删除已有的工序列表
    deleteSelectedProcessList(index) {
      console.log(index);

      Dialog.confirm({
        title: '删除',
        message: '您确定要删除该工序嘛?',
        dataEvent: { id: 'ypDblAOXFn' }
      })
        // 确定提交
        .then(() => {
          this.SelectedProcessList.splice(index, 1);
        })
        //取消提交
        .catch(() => {
          console.log('取消删除');
        });
      //显示保存按钮
      this.resJSON.state = null;
    },
    //从订单中选择 现在只可以选择同一个部位下的套餐  是否禁用规则
    isButtonDisabled(index) {
      return (
        this.PositionIndex !== index &&
        this.PositionIndex !== null &&
        this.newSelectedProcessList.length >= 0
      );
    },
    //多选列表 完成按钮
    finishSelectedProcessList() {
      this.SelectedProcessList = this.SelectedProcessList.concat(
        this.newSelectedProcessList.map(item => ({
          desc: item.desc,
          content: item.content,
          _id: item._id,
          processStepDefinitions: item.processStepDefinitions,
          checked: item.checked // 因为它当前被选中
        }))
      );
      //重置勾选列表的选中数据
      this.processListClose();
    },
    //上传图片   读取文件
    afterRead(e, item, index) {
      //修改数据后 显示保存按钮
      this.resJSON.state = null;
      if (!item.urls) {
        this.$set(item, 'urls', []);
      }
      //用户选择了几张图片
      console.log(e.detail.file);
      for (let i = 0; i < e.detail.file.length; i++) {
        //循环上传服务器
        this.uploadImage(e.detail.file[i].url, item.urls);
      }
    },
    //fileName的取值  知道这个图片是什么后缀
    getFileExtension(url) {
      // 获取小数点的位置
      const dotIndex = url.lastIndexOf('.');
      // 截取小数点后的部分
      const extension = url.slice(dotIndex + 1);
      return '12345.' + extension;
    },
    //上传服务器接口  //图片路径  选择了多少张图片 当前对象
    uploadImage(filePath, item) {
      common.osg.ajax(
        'back/super/file/upToken.do',
        { fileName: this.getFileExtension(filePath) },
        data => {
          wx.uploadFile({
            url: 'https://up-z1.qiniup.com',
            filePath, // 本地文件路径
            name: 'file', // 上传文件的名称
            formData: data, // 附带的额外数据
            success: res => {
              // 上传成功后的处理逻辑
              if (res.statusCode === 200) {
                // 文件上传成功
                const data = JSON.parse(res.data);
                let imgURL = 'https://pub.fsgo365.cn/' + data.key;
                item.push({ url: imgURL + '!convert.jpg' }); // 这里 'newImgURL' 是您要新添加的图片 URL
              } else {
                Toast.fail('上传失败');
              }
            },
            fail: err => {
              // 上传失败的处理逻辑
              console.error('上传失败：', err);
              // 在这里处理上传失败的情况，可以给出提示信息或重试等
            }
          });
        }
      );
    },
    //删除图片
    deleteFile(e, item, index) {
      item.urls = item.urls.filter(item => item.url !== e.detail.file.url);

      //显示 保存按钮
      this.resJSON.state = null;
    },
    //打开工单相册
    albumShow() {
      //打开工单相册弹出框
      this.workOrderAlbum = true;
      let colNames = [];
      //查询字典项目
      common.osg.codeoption(() => {
        this.photoAlbumType = this.options.albumLabel;
        this.photoAlbumType.map(item => {
          colNames.push(item.value);
        });
        console.log(this.photoAlbumType);
        // 查询所有子标签
        common.osg.ajax(
          'biz/extField/query',
          {
            _all: '1',
            'in:colName|array#and': colNames.join(),
            'is:type|string#and': 'file',
            sortField: 'order',
            sortOrder: 'asc',
            'is:state|integer#and': 1
          },
          ({ data }) => {
            this.getAlbum(data);
          },
          { noload: true }
        );
      });
    },
    // 查询相册
    getAlbum(newArray) {
      common.osg.ajax(
        'biz/album/album',
        {
          data: JSON.stringify({
            bizType: 'serviceAppointment',
            bizId: this.WorkOrderId,
            labelName: 'ALL',
            handle: 'query'
          })
        },
        ({ data }) => {
          // 初始化目标结构
          const result = {
            approach: {},
            order: {},
            survey: {},
            acceptance: {}
          };

          // 处理数据
          for (const key in data) {
            const value = data[key];
            if (key.startsWith('approach-')) {
              const newKey = key.split('-')[1]; // 获取后半部分
              result.approach[newKey] = value;
            } else if (key.startsWith('order-')) {
              const newKey = key.split('-')[1]; // 获取后半部分
              result.order[newKey] = value;
            } else if (key.startsWith('survey-')) {
              const newKey = key.split('-')[1]; // 获取后半部分
              result.survey[newKey] = value;
            } else if (key.startsWith('acceptance-')) {
              const newKey = key.split('-')[1]; // 获取后半部分
              result.acceptance[newKey] = value;
              // 处理直接放入的项，例如 default
            } else {
              result[key] = value;
            }
          }
          // 遍历对象的每一个键，并进行匹配
          for (const section in result) {
            if (result.hasOwnProperty(section)) {
              const sectionObj = result[section];
              // 遍历当前 section 对象的每一个键
              for (const key in sectionObj) {
                if (sectionObj.hasOwnProperty(key)) {
                  // 定义一个函数来处理键的替换逻辑
                  const updateKey = (oldKey, newKey) => {
                    // 将原始值赋给新键
                    sectionObj[newKey] = sectionObj[oldKey];
                    // 删除原始键
                    delete sectionObj[oldKey];
                    // 如果新键的值长度为 0，则删除新键
                    if (sectionObj[newKey] && sectionObj[newKey].length === 0) {
                      delete sectionObj[newKey];
                    }
                  };
                  if (key === 'default') {
                    updateKey(key, '默认');
                  } else {
                    const match = newArray.find(item => item.name === key);
                    if (match) {
                      updateKey(key, match.nameDisp);
                    }
                  }
                }
              }
            }
          }
          this.result = result;
        }
      );
    },
    //公格点击事件
    GirdPic(e) {
      const currentUrls =
        this.SelectedProcessList[this.processStepIndex].processStepDefinitions[this.uploaderIndex];
      if (!currentUrls.urls) {
        this.$set(currentUrls, 'urls', []);
      }
      currentUrls.urls.push({ url: e });
      this.resJSON.state = null;
      this.clickOverlay();
    },
    //拿到当前要工序，工序步骤的索引的索引
    uploadedImageIndex(index, inx) {
      // 拿到当前要工序的索引
      this.uploaderIndex = inx;
      //拿到当前要工序步骤的索引
      this.processStepIndex = index;

      console.log('拿到当前要工序的索引', this.uploaderIndex);
      console.log('拿到当前要工序步骤的索引', this.processStepIndex);
    },
    //保存 || 提交  默认是0 1是保存 2是提交
    saveLogs(state) {
      common.osg.md({ act: 'SavelogDetails' });
      if (this.SelectedProcessList.length == 0) {
        Toast.fail('还没选择工序');
        return;
      }
      //保存
      if (state === 0) {
        this.saveProcessData(state);
      } else {
        Dialog.confirm({
          title: '提交',
          message: '您确定要提交嘛? 提交后无法再次编辑',
          dataEvent: { id: 'QwM5KP3Cnm' }
        })
          // 确定提交
          .then(() => {
            this.saveProcessData(state);
          })
          //取消提交
          .catch(() => {
            console.log('取消提交');
          });
      }
    },
    //保存提交 调用的接口 准备的函数
    saveProcessData(state) {
      console.log('保存数据源', this.Allparts);

      let obj = {
        //维修部位
        repairParts:
          this.Allparts &&
          this.Allparts[this.PositionIndex] &&
          this.Allparts[this.PositionIndex].repairParts &&
          this.Allparts[this.PositionIndex].repairParts.length > 0
            ? this.Allparts[this.PositionIndex].repairParts
            : this.repairParts,
        //维修部位的索引
        positionIndex: this.PositionIndex,
        data: this.SelectedProcessList,
        serviceAppointmentId: this.WorkOrderId,
        orderId: this.orderId == 0 ? this.orderProcesSelection[0]._id : this.orderId,
        state,
        _id: this.order_id
      };
      common.osg.ajax(
        `biz/extForm/upsert/${formDefId}`,
        {
          dataStr: JSON.stringify(obj)
        },
        res => {
          const { data } = res;
          this.getProcess(data._id);
          Toast.success(state === 0 ? '保存成功' : '提交成功');
        },
        { noload: true }
      );
    },
    //
    activeName(e) {
      this.ActiveName = e.detail;
    },
    activeName1(e) {
      this.ActiveName1 = e.detail;
    },
    //工单相册点击弹出层遮罩层 关闭工单相册
    clickOverlay() {
      this.workOrderAlbum = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.buttonBottom {
  position: sticky;
  bottom: 0%;
  width: 100%;
  padding: 10rpx 20rpx 10rpx;
  box-sizing: border-box;
  display: flex;
}

.processListBox {
  position: relative;
  width: 95vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  .searchBox {
    width: 90%;
    margin: 10px auto 0px;
    border: 2px solid #3b86f6;
    padding: 5px;
    border-radius: 10px;
    display: flex;
    align-items: center;
  }
  .processList {
    flex: 1;
    overflow-y: auto;
    .ProcessBox {
      border-radius: 10px;
      // border: 1px solid #106cff;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

      padding: 24rpx;
      margin: 20rpx;
      .ProcessBox_name {
        font-size: 26rpx;
        margin-bottom: 20rpx;
        display: flex;
        justify-content: space-between;
      }
      .ProcessBox_desc {
        color: #ccc;
        font-size: 26rpx;
      }
    }
  }
}
.ProcessCard {
  width: 95vw;
  height: auto;
  min-height: 300rpx;
  position: relative;
  border-radius: 10px;
  margin: 20rpx auto;
  padding: 10px 0px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

  .ProcessCardName {
    font-size: 28rpx;
    color: red;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20rpx;
    .ProcessCardIcon {
      color: black;
      font-size: 34rpx;
    }
  }
}
.vanCellTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ProcessCell {
  position: relative;
  margin: 20px 0px;
  .reminder {
    font-size: 18rpx;
    position: absolute;
    left: 5%;
    bottom: -1%;
    color: #ccc;
  }
}
.ProcessCell ::v-deep .van-cell {
  padding: 0;
}
::v-deep .van-radio {
  width: 90%;
  height: auto;
  margin: 20rpx auto;
  padding: 20rpx;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
::v-deep .van-cell {
  background-color: transparent;
}
::v-deep .van-grid-item__content {
  padding: 0px !important;
}

::v-deep .van-cell__title,
::v-deep .van-cell__value {
  font-size: 30rpx;
  white-space: nowrap;
  width: 100%;
}
::v-deep .van-cell__value {
  min-width: 60%;
}
// ::v-deep .van-uploader__wrapper {
//   flex-wrap: nowrap;
// }

.Locations ::v-deep .van-uploader__wrapper {
  flex-wrap: wrap;
}
.Locations ::v-deep .van-uploader {
  width: 80vw;
}
.limitedWidthTextStyle {
  min-width: 140rpx;
  max-width: 140rpx;
  white-space: break-spaces;
}
.file-picker__box {
  width: 80px;
  height: 80px;
}
// #ifdef APP-PLUS
::v-deep .van-icon-arrow {
  transform: rotate(0deg);
}
::v-deep .van-collapse-item__title--expanded .van-cell__right-icon {
  transform: rotate(-45deg);
}
// #endif
</style>
