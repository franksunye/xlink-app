<template>
  <view class="body" @click.capture="track">
    <view class="flexBox" v-if="SelectedProcessList.length > 0">
      <view
        class="c-card"
        style="
          font-size: 32rpx;
          padding-top: 10px;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        "
        v-for="(item, index) in SelectedProcessList"
        :key="index"
        @click="jumpTetails(item._id, 2, true)"
        :data-event="{ id: 'VCiY1ZtFrU' }"
      >
        <view class="c-card-title" :data-event="{ id: 'VCiY1ZtFrU' }">
          更新时间：{{ item.updateDateTime }}
        </view>

        <view class="c-card-content-item" :data-event="{ id: 'VCiY1ZtFrU' }">
          <view class="c-card-content-item-label" :data-event="{ id: 'VCiY1ZtFrU' }">
            订单编号：
          </view>
          <view :data-event="{ id: 'VCiY1ZtFrU' }">{{ item.orderId }}</view>
        </view>
        <view class="c-card-content-item" :data-event="{ id: 'VCiY1ZtFrU' }">
          <view class="c-card-content-item-label" :data-event="{ id: 'VCiY1ZtFrU' }">
            创建人&nbsp; &nbsp;：
          </view>
          <view :data-event="{ id: 'VCiY1ZtFrU' }">{{ item.updateUserName }}</view>
        </view>
        <view class="c-card-content-item" :data-event="{ id: 'VCiY1ZtFrU' }">
          <view class="c-card-content-item-label" :data-event="{ id: 'VCiY1ZtFrU' }">
            创建时间：
          </view>
          <view :data-event="{ id: 'VCiY1ZtFrU' }">{{ item.createTime }}</view>
        </view>
        <view
          class="c-card-content-item"
          v-if="Datadisplay(item.repairParts)"
          :data-event="{ id: 'VCiY1ZtFrU' }"
        >
          <view class="c-card-content-item-label" :data-event="{ id: 'VCiY1ZtFrU' }">
            维修部位：
          </view>
          <view :data-event="{ id: 'VCiY1ZtFrU' }">{{ Datadisplay(item.repairParts) }}</view>
        </view>
        <view class="c-card-content-item" :data-event="{ id: 'VCiY1ZtFrU' }">
          <view class="c-card-content-item-label" :data-event="{ id: 'VCiY1ZtFrU' }">
            包含工序：
          </view>
          <view :data-event="{ id: 'VCiY1ZtFrU' }">
            <view :data-event="{ id: 'VCiY1ZtFrU' }">
              <view
                class="c-flex"
                style="align-items: center"
                v-for="(items, inx) in item.data"
                :key="inx"
                :data-event="{ id: 'VCiY1ZtFrU' }"
              >
                <text class="circle" :data-event="{ id: 'VCiY1ZtFrU' }">
                  {{ inx + 1 }}
                </text>
                <text :data-event="{ id: 'VCiY1ZtFrU' }">{{ items.content }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="c-card-content-item BtnBox" :data-event="{ id: 'VCiY1ZtFrU' }">
          <van-button
            v-if="item.state != 1"
            size="small"
            round
            type="info"
            custom-class="c-m-l-20"
            @click.native.stop="submitLogs(item)"
            :data-event="{ id: 'pypDNjVW5-' }"
          >
            提 交
          </van-button>

          <van-button
            size="small"
            plain
            round
            custom-class="c-m-l-20"
            @click.native.stop="reomveLogs(item._id)"
            :data-event="{ id: 'NdWna2W3_b' }"
          >
            删 除
          </van-button>
        </view>
      </view>
    </view>
    <view style="flex: 1" v-if="SelectedProcessList.length == 0">
      <van-empty description="日志为空" />
    </view>
    <!-- <view class="CreatyTemplate" @click="jumpTetails()" :data-event="{id:'gsbNEvI9em'}">
      <van-icon name="plus" style="color: #fff" size="30px" :data-event="{id:'gsbNEvI9em'}" />
    </view> -->
    <view class="CreatyTemplate">
      <van-button
        style="margin-right: 20rpx"
        type="default"
        @click.native.stop="jumpTetails(null, 0, false)"
        round
        icon="balance-list-o"
        block
        class="c-button-group-item"
        :data-event="{ id: 'eIJPRDshNf' }"
      >
        选择订单
      </van-button>
      <van-button
        type="info"
        icon="add"
        block
        round
        class="c-button-group-item"
        @click.native.stop="jumpTetails(null, 1, false)"
        :data-event="{ id: 'U6PP0E5xwJ' }"
      >
        选择工序
      </van-button>
    </view>

    <!-- 轻提示节点 -->
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
let common = require('../../resources/js/common.js');
var formDefId = '9190357980804726357';
import Toast from '../../wxcomponents/vant/toast/toast';
import Dialog from '../../wxcomponents/vant/dialog/dialog';

export default {
  data() {
    return {
      serviceType: '11', //服务类型
      sourceType: '3', //信息来源
      SelectedProcessList: [], //选中的工序列表
      WorkOrderId: '', //工单ID
      //字典项目
      options: {
        cascadeCode_parts: { codeId: 'parts' }
        // codecfg_parts: { codeId: 'parts' }
      }
    };
  },
  onLoad(e) {
    const { serviceType, sourceType, id } = e;
    this.serviceType = serviceType;
    this.sourceType = sourceType;
    this.WorkOrderId = id;
  },
  onShow() {
    common.osg.init(this, {}, app);
    if (this.options.parts && this.options.parts.length > 0) {
      this.getDate();
    } else {
      common.osg.codeoption();
      //查询字典项目
      this.getDate();
    }
  },
  methods: {
    getDate() {
      common.osg.ajax(
        `biz/extForm/query/${formDefId}`,
        {
          sortField: 'createTime',
          sortOrder: 'asc',
          'is:serviceAppointmentId|string#and': this.WorkOrderId,
          'ne:state|integer#and': -1
        },
        res => {
          const { data } = res;
          this.SelectedProcessList = data;
          console.log(data);
        },
        { noload: true }
      );
    },
    //新建 跳转到日志详情页面 objs 订单的_id用来回显示数据 sourceOfSelection 是从订单中选择还是工序中选择 0订单 1工序
    jumpTetails(objs, sourceOfSelection, Edit) {
      common.osg.md({ act: 'SAOperation_logDetails' });
      wx.navigateTo({
        url: `../serviceAppointment/logDetails?serviceType=${this.serviceType}&obj=${objs}&sourceType=${this.sourceType}&id=${this.WorkOrderId}&sourceOfSelection=${sourceOfSelection}&Edit=${Edit}`
      });
    },
    // 提交日志
    submitLogs(e) {
      Dialog.confirm({
        title: '提交',
        message: '您确定要提交嘛? 提交后无法再次编辑',
        dataEvent: { id: 'OCyUmrIUwl' }
      })
        // 确定提交
        .then(() => {
          this.saveProcessData(e);
        })
        //取消提交
        .catch(() => {
          console.log(222222);
        });
    },
    //删除日志
    reomveLogs(id) {
      common.osg.ajax(
        `biz/extForm/remove/${formDefId}`,
        { formDataId: id },
        res => {
          this.getDate();
          Toast.success('删除成功');
        },
        { noload: true }
      );
    },
    //提交接口
    saveProcessData(item) {
      common.osg.md({ act: 'SavelogDetails' });
      let obj = {
        data: item.data,
        serviceAppointmentId: item.serviceAppointmentId,
        orderId: item.orderId,
        state: 1,
        _id: item._id
      };
      common.osg.ajax(
        `biz/extForm/upsert/${formDefId}`,
        {
          dataStr: JSON.stringify(obj)
        },
        res => {
          const { data } = res;
          this.getDate();
          Toast.success('提交成功');
        },
        { noload: true }
      );
    },
    //返显施工部位函数
    Datadisplay(msg) {
      let newVlaue = common.osg.formatCascade('parts', msg);
      return newVlaue;
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.body {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .flexBox {
    flex: 1;
    overflow-y: auto;
  }
}
.CreatyTemplate {
  width: 100%;
  padding: 10rpx;
  box-sizing: border-box;
  display: flex;
  background: #f7f8fa;
}

.BtnBox {
  flex-direction: row-reverse;
}
.circle {
  display: flex;
  width: 12px;
  height: 12px;
  border: 1px solid black;
  border-radius: 50%;
  font-size: 20rpx;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
}
</style>
