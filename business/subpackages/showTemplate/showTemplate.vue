<template>
  <view class="content" @click.capture="track">
    <image
      v-if="TemplateId"
      style="width: 100vw; height: auto; display: flex"
      mode="widthFix"
      :src="downloadUrl"
      @load="downImageLoad"
    ></image>
    <image
      v-if="newDownloadUrl"
      style="position: absolute; width: 0vw; height: 0"
      @load="onImageLoad"
      :src="newDownloadUrl"
      mode="widthFix"
      @error="imageLoadFailed"
    ></image>
    <view style="position: absolute; inset: 0">
      <view
        v-for="(item, index) in list"
        :style="[methodAfterPageLoad(item)]"
        @click="SkipPage(item._id, item.def, index)"
        :key="index"
        :class="showBtn === index ? 'boxShadow ' : ''"
        :data-event="{ id: '2u22ns19lU' }"
      >
        <view
          v-if="showBtn === index"
          :class="[index === list.length - 1 ? 'additional' : '', 'OperationBut']"
          :data-event="{ id: '2u22ns19lU' }"
        >
          <view
            @click.stop="DetailsTemplate(item, index, 3)"
            class="btn c-radius"
            :data-event="{ id: '9DDm2GJceQ' }"
          >
            <van-icon
              name="https://pub.fsgo365.cn/icon-add.png"
              size="22px"
              :data-event="{ id: '9DDm2GJceQ' }"
            />
          </view>
          <view
            @click.stop="operationTemplate(item, index, 1)"
            class="btn c-radius"
            :data-event="{ id: 'CDCGt2YUhR' }"
          >
            <van-icon
              name="https://pub.fsgo365.cn/icon-copy.png"
              size="22px"
              :data-event="{ id: 'CDCGt2YUhR' }"
            />
          </view>
          <view
            @click.stop="JumpEdit(item._id, item.def, index)"
            class="btn c-radius"
            :data-event="{ id: 'TEdBZspZ2T' }"
          >
            <van-icon
              style="color: #646566"
              name="edit"
              size="22px"
              :data-event="{ id: 'TEdBZspZ2T' }"
            />
          </view>
          <view
            @click.stop="operationTemplate(item, index, 0)"
            class="btn c-radius"
            :data-event="{ id: 'aPiIBZK9ne' }"
          >
            <van-icon
              name="https://pub.fsgo365.cn/icon-delete.png"
              size="22px"
              :data-event="{ id: 'aPiIBZK9ne' }"
            />
          </view>
        </view>
      </view>
      <!-- 新建模版页面样式 -->
      <view v-if="initialized && (newlyBuild || list.length === 0)">
        <view class="NewCaseBox" @click="SelectComponents()" :data-event="{ id: 'N13MmqFBcD' }">
          <image
            style="width: 60rpx; height: 60rpx"
            src="https://pub.fsgo365.cn/icon-createCase.png"
            mode=""
            :data-event="{ id: 'N13MmqFBcD' }"
          ></image>
          <text style="margin: 0px 30rpx" :data-event="{ id: 'N13MmqFBcD' }">选择组件</text>
        </view>
      </view>
    </view>
    <!-- 遮照层 -->
    <van-overlay :show="overlayShow" z-index="15" :lock-scroll="true" />
    <!-- 底部弹出层 -->
    <van-popup
      round
      :show="BottomPopup"
      close-icon="close"
      close-on-click-overlay
      position="bottom"
      custom-style="height: 70%;"
      z-index="20"
      @close="onClose"
    >
      <view class="vanPopup">
        <view class="PopupTitle">
          <text style="font-weight: bolder">
            {{ BatchSelection ? `已选择(${SelectedComponentList.length})` : '请选择要插入的组件' }}
          </text>
          <view class="BatchSelectStyle" @click="ProcessingData" :data-event="{ id: 'c0pMs99j-w' }">
            <view
              :class="{ BatchSelectTxtStyle: BatchSelection }"
              :data-event="{ id: 'c0pMs99j-w' }"
            >
              {{ BatchSelection ? '完成' : '批量选择' }}
            </view>
          </view>
        </view>
        <view class="ComponentStyle">
          <view class="ComponentList" v-for="(item, index) in ChildrenList" :key="index">
            <view
              class="ComponentImage"
              @click="onChangeCheckbox(item, index)"
              :data-event="{ id: 'AnHX1299to' }"
            >
              <view
                v-if="BatchSelection"
                :class="['CheckoutBox', { AfterClicking: item.Checkout }]"
                :data-event="{ id: 'AnHX1299to' }"
              >
                <view
                  v-if="item.value !== 0 && item.value"
                  style="color: red"
                  :data-event="{ id: 'AnHX1299to' }"
                >
                  {{ item.value }}
                </view>
              </view>
              <image
                :src="BinaryStream(item._id, 'compId', 'biz/showTemplate/imgFromComponent')"
                mode="widthFix"
                :data-event="{ id: 'AnHX1299to' }"
              ></image>
            </view>
            <view style="font-size: 26rpx">{{ item.name }}</view>
          </view>
        </view>
      </view>
    </van-popup>
    <van-toast id="van-toast" />
    <van-share-sheet
      :show="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onShareSelect"
      @close="onShareClose"
    />
    <uni-fab
      ref="fab"
      :pattern="pattern"
      :content="content"
      :horizontal="horizontal"
      :vertical="vertical"
      :direction="direction"
      @trigger="trigger"
      @fabClick="fabClick"
    />
    <van-dialog
      use-slot
      title="请填写模版名称"
      :show="createTemplateName"
      show-cancel-button
      @close="CreateTemplateNameClose"
      @confirm="getUserInfo"
      :before-close="beforeClose"
      :data-event="{ id: '8bO6ZUIamR', capture: false }"
    >
      <view class="weuiInputBox">
        <view class="">案例名称:</view>
        <input
          :value="TemplateName"
          focus
          auto-focus
          :selection-start="30"
          :selection-end="100"
          confirm-type="done"
          @input="bindKeyInput"
        />
      </view>
    </van-dialog>
  </view>
</template>

<script>
var common = require('../../resources/js/common.js');
import Toast from '../../wxcomponents/vant/toast/toast';
var CheckName = ''; //弹出窗回调前的检查对象
export default {
  data() {
    return {
      initialized: false, //当前数据是否
      TemplateId: '', //模版ID
      res: [], //模版案例总数据
      cloneRes: {}, //放弃修改的时候 恢复初始数据
      downloadUrl: '',
      newDownloadUrl: '', //新的海报地址
      list: [], //外层组件盒子
      defWidth: '800', //后端人员返回的宽度   用来计算宽高比
      showBtn: null, //长按操作模版
      overlayShow: false, //是否显示遮罩层
      BottomPopup: false, //是否开启底部弹出层
      ChildrenList: [], //拿到所有的组件列表
      SelectedComponentList: [], //勾选的组件列表
      BatchSelection: false, // 是否组件开启批量选择
      isFirstLoad: true, //首次不触发加载 onImageLoad函数
      showShare: false, //是否开启分享面板
      options: [
        { name: '微信', icon: 'wechat', openType: 'share' },
        { name: '保存到相册', icon: 'poster' }
      ],
      newlyBuild: false, //检查当前是否是新建
      createTemplateName: false, //保存的时候 显示弹窗 填写模版名称
      TemplateName: '', //模版名称
      //悬浮球配置项目
      pattern: {
        color: '#7A7E83',
        backgroundColor: '#fff',
        selectedColor: '#007AFF',
        buttonColor: '#007AFF',
        iconColor: '#fff'
      },
      horizontal: 'right',
      vertical: 'bottom',
      direction: 'horizontal',
      content: [
        {
          iconPath: 'https://pub.fsgo365.cn/icon-share.png',
          selectedIconPath: 'https://pub.fsgo365.cn/icon-share.png',
          text: '分享',
          active: false
        },
        {
          iconPath: 'https://pub.fsgo365.cn/icon-save.png',
          selectedIconPath: 'https://pub.fsgo365.cn/icon-save.png',
          text: '保存',
          active: false
        },
        {
          iconPath: 'https://pub.fsgo365.cn/icon-revoke.png',
          selectedIconPath: 'https://pub.fsgo365.cn/icon-revoke.png',
          text: '放弃更改',
          active: false
        }
      ]
    };
  },
  onReady() {},
  onLoad({ Id, path, newlyBuild }) {
    if (Id && path && !newlyBuild) {
      setTimeout(() => {
        Toast.loading({
          message: '海报加载中...',
          forbidClick: true,
          mask: true,
          duration: 0
        });
      }, 0);
      this.TemplateId = Id;
      this.getData();
      //检查这个图片是不是七牛云服务器的地址
      if (path.includes('https://pub.fsgo365.cn')) {
        this.downloadUrl = path;
      } else {
        this.downloadUrl = this.getImagePath();
      }
    } else {
      //当前是新建模版
      this.newlyBuild = newlyBuild;
      //分享面板配置项
      let TemplateOptions = {
        color: '#FFFFFF',
        type: 2,
        name: '234232',
        state: 1,
        def: [],
        width: 800,
        typeId: wx.getStorageSync('user')._id
      };
      this.res = TemplateOptions;
      this.list = TemplateOptions.def;
      this.defWidth = TemplateOptions.width;
      if (Object.keys(this.cloneRes).length === 0) {
        this.cloneRes = JSON.parse(JSON.stringify(TemplateOptions));
      }
    }
    this.$nextTick(() => {
      this.initialized = true;
    });
  },
  onShow() {
    //上个页面带来的ID
    uni.$on('id', ({ Pageid, lastPageUrl }) => {
      if (Pageid) {
        console.log('走没有走onshow');
        this.TemplateId = Pageid;
        this.getData();
        this.downloadUrl = lastPageUrl;
        this.newDownloadUrl = this.getImagePath();
      }
    });
  },
  methods: {
    getImagePath(tplId = this.TemplateId) {
      return `${common.osg.host}/fsgo/wm/biz/showTemplate/imgFromTemplate?tplId=${tplId}&tenantId=${
        wx.getStorageSync('user').tenantId
      }&access_token_h5=${wx.getStorageSync('sessionId')}&_=${this.getRandomNumber()}`;
    },
    //拿到选择的模版数据 渲染页面
    getData(ID = this.TemplateId) {
      common.osg.ajax('/biz/showTemplate/queryById', { id: ID }, res => {
        const { def, width } = res;
        this.res = res;
        this.list = def;
        this.defWidth = width;
        console.log('this.res', this.res);
        if (Object.keys(this.cloneRes).length === 0) {
          this.cloneRes = JSON.parse(JSON.stringify(res));
          console.log('第一次克隆后的数据格式', this.cloneRes);
        }
      });
    },
    //随机数
    getRandomNumber() {
      return Math.floor(Math.random() * 1000000000);
    },
    //拿到海报的地址
    BinaryStream(id, parasm, url) {
      return `${common.osg.host}/fsgo/wm/${url}?${parasm}=${id}&width=${this.defWidth}&tenantId=${
        wx.getStorageSync('user').tenantId
      }&access_token_h5=${wx.getStorageSync('sessionId')}`;
    },
    //修改后的海报加载完成
    onImageLoad() {
      this.downloadUrl = this.newDownloadUrl;
      this.overlayShow = false;
      this.isFirstLoad = false;
      Toast.clear();
      common.osg.toast('海报模版修改成功', 'none');
    },
    downImageLoad() {
      Toast.clear();
    },
    imageLoadFailed() {
      Toast.clear();
      this.overlayShow = false;
      this.isFirstLoad = false;
      common.osg.toast('海报加载失败', 'none');
    },
    //拿到的所有子模版数据
    getShowComponent() {
      common.osg.ajax(
        '/biz/showComponent/query',
        {
          'is:state|integer#and': 1,
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          sortField: 'createTime',
          sortOrder: 'asc'
        },
        res => {
          // 添加响应式数据 为了以后复选框使用
          res.data.forEach(item => {
            this.$set(item, 'Checkout', false);
            this.$set(item, 'value', 0);
          });
          this.ChildrenList = res.data;
          console.log('所有的组件列表', this.ChildrenList);
        }
      );
    },
    //外层盒子的高度
    methodAfterPageLoad(item) {
      let style = {
        width: '100vw',
        position: 'relative',
        float: 'right',
        clear: 'both'
      };
      //检查这个组件是不是循环组件 高度计算*2
      let countType = item.def.filter(item => item.type === 'dup');
      if (countType.length > 0) {
        let count = typeof countType[0].def.length === 'number' ? countType[0].def.length : 1;
        const total = item.def
          .filter(items => items.type !== 'dup') // 筛选出type不等于dup的元素
          .reduce((sum, items) => sum + items.top + items.bottom, 0);
        //重复组件的高度 等于 重复组件自身的高度*出现的次数 * 宽高比
        let RepeatModule = countType[0].height * count + total;
        style.height = this.VWcalculationratio(this.defWidth, RepeatModule);
      } else {
        style.height = this.VWcalculationratio(this.defWidth, item.height);
      }
      //上左下右
      let marginTop = this.VWcalculationratio(this.defWidth, item.marginTop);
      let marginLeft = this.VWcalculationratio(this.defWidth, item.marginLeft);
      let marginBottom = this.VWcalculationratio(this.defWidth, item.marginBottom);
      let marginRight = this.VWcalculationratio(this.defWidth, item.marginRight);
      style.margin = ` ${marginTop} ${marginLeft} ${marginBottom} ${marginRight}`;
      // style.backgroundColor = `rgba(0, 0, 0, 0.5)`;
      return style;
    },
    SkipPage(Id, def, i) {
      if (this.showBtn == i) return (this.showBtn = null);

      this.showBtn = i;
      if (this.ChildrenList.length > 0) return;
      this.getShowComponent();
    },
    //点击编辑按钮能跳转
    JumpEdit(Id, def, i) {
      //检查这个组件是不是循环组件
      let repeatType = def.filter(item => item.type === 'dup');
      //检查是否处在编辑状态 如果处在编辑状态 点击后不会进行跳转
      // if (this.showBtn) return (this.showBtn = null);
      // 如果这个块盒子 是分割线则不进行点击跳转逻辑
      if (def.length === 1 && def[0].type === 'line') return;
      let JSON_starts = JSON.stringify(repeatType);
      common.osg.open(
        `/subpackages/showTemplate/EditShowTemplate?Id=${Id}&index=${i}&TemplateId=${this.TemplateId}&starts=${JSON_starts}&imageURL=${this.downloadUrl}`
      );
    },
    // //长按事件 打开分享面板
    // handleLongPress(item, index) {
    // 	this.showShare = true;
    // },
    //关闭分享面板
    onShareClose() {
      this.showShare = false;
    },
    //点击了分享面板哪一个按钮
    onShareSelect(e) {
      console.log(e);
      if (e.detail.name === '保存到相册' && e.detail.index === 1) {
        this.downloadImg(this.downloadUrl);
      }
    },
    // 点击下载图片事件
    downloadImg(url) {
      let that = this;
      Toast.loading({
        message: '保存中...',
        mask: true,
        forbidClick: true,
        duration: 0
      });
      //wx.downloadFile方法：下载文件资源到本地
      wx.downloadFile({
        url: url, //图片地址
        success: function (res) {
          //wx.saveImageToPhotosAlbum方法：保存图片到系统相册
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath, //图片文件路径
            success: function (data) {
              wx.hideLoading(); //隐藏 loading 提示框
              wx.showModal({
                title: '提示',
                content: '保存成功',
                modalType: false,
                complete() {
                  Toast.clear();
                }
              });
            },
            // 接口调用失败的回调函数
            fail: function (err) {
              if (
                err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' ||
                err.errMsg === 'saveImageToPhotosAlbum:fail auth deny' ||
                err.errMsg === 'saveImageToPhotosAlbum:fail authorize no response'
              ) {
                wx.showModal({
                  title: '提示',
                  content: '需要您授权保存相册',
                  modalType: false,
                  success: modalSuccess => {
                    wx.openSetting({
                      success(settingdata) {
                        console.log('settingdata', settingdata);
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          wx.showModal({
                            title: '提示',
                            content: '获取权限成功,再次点击图片即可保存',
                            modalType: false
                          });
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '获取权限失败，将无法保存到相册哦~',
                            modalType: false
                          });
                        }
                      },
                      fail(failData) {
                        console.log('failData', failData);
                      },
                      complete(finishData) {
                        console.log('finishData', finishData);
                      }
                    });
                  }
                });
              }
            },
            complete(res) {
              wx.hideLoading(); //隐藏 loading 提示框
            }
          });
        }
      });
    },

    //克隆模版
    operationTemplate(item, index, type) {
      if (type === 1) {
        //克隆
        this.list.splice(index, 0, item); // 在索引位置2插入数据3
      } else {
        //删除
        this.list.splice(index, 1);
        //删除最后一个组件要做的事情
        if (index === 0 && this.list.length === 0) {
          this.res.def = [{ delete: 1 }];
        }
      }
      this.showBtn = null;
      console.log('操作后的数据', this.res);
      this.modifyTemplateRequest();
    },
    //模版详情 吊起底部弹出框选择模版
    DetailsTemplate() {
      //弹出底部弹出层
      this.BottomPopup = true;
      //恢复默认值 文字显示为批量
      this.BatchSelection = false;
    },
    //关闭底部弹出层
    onClose() {
      this.BottomPopup = false;
      //恢复数据原本模样
      this.SelectedComponentList.forEach((item, index) => {
        item.value = 0;
        item.Checkout = false;
      });
    },

    //复选框状态改变
    onChangeCheckbox(item, index) {
      //是否开启了批量选择
      if (this.BatchSelection) {
        this.$set(this.ChildrenList[index], 'Checkout', !item.Checkout);
        if (item.Checkout) {
          item.value = this.SelectedComponentList.length + 1;
          this.SelectedComponentList.push(item);
        } else {
          item.value = 0;
          this.SelectedComponentList = this.SelectedComponentList.filter(item => item.Checkout).map(
            (item, index) => {
              item.value = index + 1;
              return item;
            }
          );
        }
      } else {
        console.log('没有开启批量选择 而是选择的单个组件', item);
        let wrapObjectInArray = [item];
        let splicePosition = this.showBtn ? Number(this.showBtn) + 1 : this.list.length;
        this.list.splice(splicePosition, 0, ...this.removeKeysFromObjects(wrapObjectInArray));
        this.modifyTemplateRequest();
      }
    },
    //当底部弹出层选择批量操作或者完成的时候触发的逻辑
    ProcessingData() {
      //用户点击的是完成 并且选择的有数据
      if (this.BatchSelection && this.SelectedComponentList.length > 0) {
        //删除不需要的属性
        // let AfterModificationDef = this.removeKeysFromObjects(this.SelectedComponentList);
        let splicePosition = this.showBtn ? Number(this.showBtn) + 1 : this.list.length;
        this.list.splice(
          splicePosition,
          0,
          ...this.removeKeysFromObjects(this.SelectedComponentList)
        );
        console.log(2222, this.list);
        this.modifyTemplateRequest();
        //用户点击的是批量
      } else {
        console.log('勾选的列表', this.ChildrenList);
        this.SelectedComponentList = [];
      }
      this.BatchSelection = !this.BatchSelection;
    },
    //模版计算比例
    VWcalculationratio(X, Y) {
      if (X && Y) {
        let AspectRatio = X / Y;
        return 100 / AspectRatio + 'vw';
      } else {
        return 0 + 'vw';
      }
    },
    //处理要给后端的数据 删除数组中不需要的key键
    removeKeysFromObjects(arr, keysToRemove) {
      //要删除的键
      let KeysToRemove = [
        'Checkout',
        'belongTo',
        'collectionName',
        'createTime',
        'createUser',
        'createUserName',
        'value',
        'orgId',
        'orgName',
        'updateUserName',
        'updateUser',
        'updateTime',
        'tenantId',
        'etags',
        'exts',
        'state'
      ];
      if (keysToRemove) {
        KeysToRemove = keysToRemove;
      }
      return arr.map(obj => {
        KeysToRemove.forEach(key => delete obj[key]);
        return obj;
      });
    },
    //修改模版请求 name参数 保存模版的时候是否需要修改名称
    modifyTemplateRequest(name = false) {
      let user = wx.getStorageSync('user'); //当前用户的ID
      //如果type是0，保存时将typeId改为当前登录人userId，将type改为2，删除_id。
      if (this.res && this.res.type === 0) {
        this.$set(this.res, `typeId`, user._id);
        this.res.type = 2;
        this.res.orgId = user.orgId;
        delete this.res._id; // 删除_id 属性
      }
      if (name) {
        this.res.name = name;
      }
      if (this.res && this.res.type === 2 && this.res.typeId === user._id) {
        let newResObj = this.removeKeysFromObjects([this.res]);
        if (newResObj[0].def.length === 0) {
          common.osg.toast('不支持保存空白模版', 'none');
          return;
        }
        this.overlayShow = true;
        common.osg.ajax(
          '/biz/showTemplate/upsert',
          { showTemplateStr: JSON.stringify(newResObj[0]) },
          ({ data }) => {
            if (!this.TemplateId) {
              this.downloadUrl = this.getImagePath(data);
            }
            this.onClose();
            this.TemplateId = data;
            this.showBtn = null; //关闭长按选中状态
            // this.getData(this.TemplateId);
            this.getData(data);
            Toast.loading({
              message: '加载中...',
              mask: true,
              forbidClick: true,
              duration: 0
            });
            // this.newDownloadUrl = this.getImagePath(this.TemplateId);
            this.newDownloadUrl = this.getImagePath(data);
            return;
          }
        );
      }
    },
    //新建模版
    SelectComponents() {
      //调子组件接口
      this.getShowComponent();
      //打开弹出框
      this.DetailsTemplate();
    },

    trigger(e) {
      //分享海报
      if (e.index === 0) {
        if (this.downloadUrl != '') {
          Toast.loading({
            message: '加载中...',
            mask: true,
            forbidClick: true,
            duration: 0
          });
          //调用长按分享事件
          wx.downloadFile({
            url: this.downloadUrl,
            success: res => {
              // #ifdef MP-WEIXIN
              // 微信小程序环境
              wx.showShareImageMenu({
                path: res.tempFilePath,
                complete: () => {
                  Toast.clear();
                }
              });
              // #endif

              // #ifdef APP-PLUS
              // 在这里添加 App 环境下的分享逻辑
              Toast.clear();
              wx.showToast({
                title: 'App目前不支持分享',
                icon: 'none'
              });
              // #endif
            },
            fail: err => {
              Toast.clear();
              // 在这里处理下载失败的情况，比如显示错误提示信息
              wx.showToast({
                title: '下载失败，请稍后重试',
                icon: 'none'
              });
            }
          });
        } else {
          wx.showToast({
            title: '分享海报为空',
            icon: 'none'
          });
        }
      } else if (e.index === 1) {
        //调用保存按钮  传递参数 修改模版名称
        this.createTemplateName = true;
      } else if (e.index === 2) {
        this.AbandonSaving();
      }
    },
    //关闭表单填写弹窗
    CreateTemplateNameClose() {
      this.createTemplateName = false;
      this.TemplateName = '';
    },
    //表单输入的名称
    bindKeyInput(e) {
      this.TemplateName = e.detail.value;
      CheckName = e.detail.value;
    },
    //确定
    getUserInfo() {
      if (CheckName.trim()) {
        this.modifyTemplateRequest(this.TemplateName);
        this.TemplateName = '';
      }
      // this.createTemplateName = false;
    },
    //确定框 关闭前的会调用 检查名称是否为空
    beforeClose(action) {
      return new Promise((resolve, reject) => {
        if (action === 'confirm') {
          if (!CheckName.trim()) {
            console.log(1111, CheckName);
            Toast({
              message: '请填写案例名称',
              icon: 'info-o',
              zIndex: 9999
            });
            resolve(false);
          } else {
            CheckName = '';
            resolve(true);
          }
        } else {
          CheckName = '';
          resolve(true);
        }
      });
    },
    fabClick() {
      console.log('悬浮球事件2');
    },
    //点击保存
    // SavetoMy() {
    // this.modifyTemplateRequest(1);
    // },
    //放弃保存
    AbandonSaving() {
      //当前为平台模版 并且已经修改过模版了
      if (this.cloneRes.type === 0 && this.res.type !== 0) {
        common.osg.ajax('/biz/showTemplate/removeMulti', { ids: this.res._id }, res => {
          this.getData(this.cloneRes._id);
          Toast.loading({
            message: '加载中...',
            mask: true,
            forbidClick: true,
            duration: 0
          });
          this.TemplateId = this.cloneRes._id;
          this.newDownloadUrl = this.getImagePath(this.cloneRes._id);
        });
      } else if (this.cloneRes.type === 0 && this.res.type === 0) {
        common.osg.toast('你还没有操作', 'none');
      } else if (this.cloneRes.type !== 0) {
        //传递一个初始案例
        common.osg.ajax(
          '/biz/showTemplate/upsert',
          { showTemplateStr: JSON.stringify(this.cloneRes) },
          ({ data }) => {
            if (!this.TemplateId) {
              this.downloadUrl = this.getImagePath(data);
            }
            this.onClose();
            this.TemplateId = data;
            this.showBtn = null; //关闭长按选中状态
            this.getData(this.TemplateId);
            // this.getData(data);
            Toast.loading({
              message: '加载中...',
              mask: true,
              forbidClick: true,
              duration: 0
            });
            this.newDownloadUrl = this.getImagePath(this.TemplateId);
            return;
          }
        );
      }
      // //传递一个初始案例
      // common.osg.ajax(
      // 	'/biz/showTemplate/upsert',
      // 	{ showTemplateStr: JSON.stringify(this.cloneRes) },
      // 	({ data }) => {
      // 		if (!this.TemplateId) {
      // 			this.downloadUrl = this.getImagePath(data);
      // 		}
      // 		this.onClose();
      // 		this.TemplateId = data;
      // 		this.showBtn = null; //关闭长按选中状态
      // 		this.getData(this.TemplateId);
      // 		// this.getData(data);
      // 		Toast.loading({
      // 			message: '加载中...',
      // 			mask: true,
      // 			forbidClick: true,
      // 			duration: 0
      // 		});
      // 		this.newDownloadUrl = this.getImagePath(this.TemplateId);
      // 		return;
      // 	}
      // );
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
[v-cloak] {
  display: none;
}
.content {
  height: 100vh;
  width: 100vw;
  position: relative;
}
.boxShadow {
  border-radius: 10px;
  // box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.6), 0 12px 24px 0 rgba(0, 0, 0, 0.7);
  box-shadow: rgba(0, 0, 0, 0.6) 0px 2px 4px, rgba(0, 0, 0, 0.5) 0px 7px 13px -3px,
    rgba(0, 0, 0, 0.4) 0px -3px 0px inset;
}
.OperationBut {
  width: 140px;
  height: 25px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  right: 10px;
  bottom: -30px;
  z-index: 12;
  .btn {
    min-width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 30px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  }
}
.additional {
  bottom: 0px;
}
.vanPopup {
  width: 100%;
  height: 100%;
  overflow: auto; /* 添加滚动条 */
  .PopupTitle {
    position: sticky;
    left: 0;
    right: 0;
    top: 0; /* 在距离顶部 0px 处固定 */
    height: 90rpx;
    line-height: 90rpx;
    z-index: 10;
    background-color: white;
    text-align: center;
    border-bottom: 1rpx solid #ccc;
  }
  .ComponentStyle {
    display: flex;
    flex-wrap: wrap;
    .ComponentList {
      width: 50vw;
      height: 40vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      .ComponentImage {
        position: relative;
        width: 90%;
        aspect-ratio: 2 / 1; /* 保证正方形 */
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
          rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
        image {
          width: 80%;
          height: 80%;
        }
      }
    }
  }
}
.CheckoutBox {
  width: 35rpx;
  height: 35rpx;
  border-radius: 5px;
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 35rpx;
}
.AfterClicking {
  background-color: #fcfcfc;
  font-weight: bolder;
}
.BatchSelectStyle {
  display: flex;
  position: absolute;
  font-size: 26rpx;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  font-weight: bolder;
  .BatchSelectTxtStyle {
    color: red;
  }
}
//选中后添加的类名
.boxShadow::after,
.boxShadow::before {
  content: '';
  position: absolute;
  border: 2px solid #81d8d0;
  width: 100%;
  height: 100%;
  border-radius: 10px; /* 简写为 */
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  /* 添加动画 */
  animation: pathRotate 3s infinite linear;
}
.boxShadow::before {
  border: 2px solid red;
}
@keyframes pathRotate {
  0%,
  100% {
    clip-path: inset(0 0 98% 0);
  }
  25% {
    clip-path: inset(0 98% 0 0);
  }
  50% {
    clip-path: inset(98% 0 0 0);
  }
  75% {
    clip-path: inset(0 0 0 98%);
  }
}
.boxShadow::after {
  animation-delay: -1.5s;
}

.NewCaseBox {
  width: 90vw;
  height: 60px;
  margin: 10px auto;
  background-color: #eef6fe;
  border-radius: 10px;
  @include flex;
}
.weuiInputBox {
  width: 100%;
  height: 40px;
  @include flex;
  input {
    margin-left: 38rpx;
    border-bottom: 1px solid #ccc;
  }
}

::v-deep .uni-fab__content--other-platform {
  bottom: 180rpx !important;
}
::v-deep .uni-fab--rightBottom {
  bottom: 180rpx !important;
}
</style>
