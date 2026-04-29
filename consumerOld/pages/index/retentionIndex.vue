<template>
  <view>
    <view>
      <image
        mode="widthFix"
        style="width: 100vw"
        src="https://pub.fsgo365.cn/4522510596947922256.jpg"
      />
    </view>
    <view class="form">
      <van-cell-group :border="false">
        <van-field
          :value="formData.name"
          @change="onChange"
          data-key="name"
          label="姓名："
          placeholder="请输入您的称呼"
          required
          clearable
          input-align="right"
        />
        <van-field
          :value="formData.phone"
          @change="onChange"
          data-key="phone"
          type="number"
          label="手机："
          placeholder="请输入您的手机号码"
          required
          clearable
          input-align="right"
        />
        <van-cell
          title="服务类型："
          is-link
          :value="format('serviceType', formData.exts.workflowDefId, 'select')"
          required
          @click="onClick"
          data-key="exts.workflowDefId"
          data-actions="serviceTypeCode"
        />
        <van-cell
          title="区域："
          is-link
          :value="
            area.areaList.province_list[formData.province] +
            area.areaList.city_list[formData.city] +
            area.areaList.county_list[formData.district]
          "
          required
          @click="area.show = true"
        />
        <van-cell
          title="街道："
          is-link
          :value="format('subdistricts', formData.subdistrict, 'select')"
          required
          @click="onClick"
          data-key="subdistrict"
          data-actions="subdistricts"
        />
        <van-field
          :value="formData.address"
          data-key="address"
          @change="onChange"
          label="详细地址："
          placeholder="请输入详细地址"
          required
          clearable
          input-align="right"
        >
          <template #button>
            <van-button @click="openMap" size="small" color="#E50211" icon="location-o">
              定位
            </van-button>
          </template>
        </van-field>
        <van-cell
          title="部位："
          is-link
          :value="format('repairParts', formData.exts.leakagesite_copy, 'multiple')"
          required
          @click="onClick"
          data-key="exts.leakagesite"
          data-actions="repairParts"
        />
        <!-- <van-cell title="上传相关照片(渗漏部位、房屋结构图等)" :border="false" title-width="100%" />
        <view>
          <van-uploader
            style="display: flex"
            multiple
            :file-list="formData.images"
            @afterread="afterRead"
            @delete="deleteFile"
            data-field="images"
            :max-count="5"
          />
        </view>
        <van-field
          :value="formData.describe"
          @change="onChange"
          data-key="describe"
          type="textarea"
          :autosize="{ minHeight: 80 }"
          label="描述"
          placeholder="请用简短的文字描述您遇到的渗漏问题，包括渗漏部位、渗漏程度，稍后将有专业防水服务人员为您解答。"
          clearable
          :border="false"
        /> -->
      </van-cell-group>
      <view style="padding: 16px 0 0">
        <van-button
          type="danger"
          block
          @click="doSave"
          custom-style="border-radius:10px;font-size:20px;font-weight:600;background-color:#E50211"
        >
          免费预约
        </van-button>
      </view>
      <!-- 省市区 -->
      <van-popup :show="area.show" position="bottom">
        <van-area :area-list="area.areaList" @confirm="areaConfirm" @cancel="area.show = false" />
      </van-popup>
    </view>
    <view>
      <image
        mode="widthFix"
        style="width: 100vw"
        src="https://pub.fsgo365.cn/6131076428580014928.jpg"
      />
    </view>
    <!-- 上拉菜单 -->
    <van-action-sheet
      :show="actionSheet.show"
      :actions="actionSheet.actions"
      @close="
        actionSheet = {
          show: false,
          key: '',
          actions: []
        }
      "
      @select="onSelect"
    />
  </view>
</template>

<script>
const app = getApp();
const common = require('../../resources/js/common.js');
const areajs = require('../../resources/js/area.js');
const chooseLocation = requirePlugin('chooseLocation');
export default {
  data() {
    return {
      parnterServiceType: [], //伙伴中的服务类型
      params: {},
      options: {
        cascadeCode_repairParts: { codeId: 'repairParts' },
        cascadeCode_serviceType: { codeId: 'serviceType' },
        serviceTypeCode: [], //去重后的数据
        subdistricts: []
      },
      formData: {
        address: '',
        title: '',
        name: '',
        phone: '',
        area: '',
        province: '',
        city: '',
        district: '',
        subdistrict: '',
        images: [],
        describe: '',
        exts: {
          leakagesite: [],
          leakagesite_copy: []
        }
      },
      // 省市区选择
      area: {
        show: false,
        areaList: Object.assign({}, areajs.default)
      },
      // 上拉菜单
      actionSheet: {
        show: false,
        key: '',
        actions: []
      },
      mapKey: 'XDQBZ-N6MCX-4FZ4K-ZYE24-BFEAF-YKBJY' //使用在腾讯位置服务申请的key
    };
  },
  onLoad(params) {
    this.init(params);
  },
  onShow() {
    const location = chooseLocation.getLocation(); // map 点击确认选点按钮，则返回选点map结果对象，否则返回null
    if (location) {
      //根据返回的经纬度，请求解析对应省市区code值
      this.getGeocoder(location, data => {
        data.address = location.name; //详细地址
        this.formData = common.osg.deepCopy(Object.assign(this.formData, data));
      });
    }
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  },
  methods: {
    init(params) {
      common.osg.init(this, params, app);
      common.osg.codeoption(() => {
        if (this.options.repairParts) {
          this.options.repairParts.map(item => {
            item.label = item.name;
          });
        }
      });
      // 扫二维码进入小程序 处理参数风格统一
      // if (params.q || params.channel) {
      //   // 扫码进入报单页不允许返回
      //   wx.hideHomeButton();

      //   // 截取所有参数放到this.params
      //   var url = decodeURIComponent(params.q);
      //   if (url.indexOf('?') != -1) {
      //     let str = url.split('?')[1];
      //     if (str) {
      //       let arr = str.split('&');
      //       if (arr) {
      //         let obj = {};
      //         for (let item of arr) {
      //           obj[item.split('=')[0]] = item.split('=')[1];
      //         }
      //         params = obj;
      //       }
      //     }
      //   }

      //   //扫码进入
      //   if (params.channel) {
      //     this.formData.channel = params.channel.split(','); //扫描平台获客码(如:基金经理)
      //   } else {
      //     this.formData.channel = ['46', '4610', '4610030']; // 扫描合伙人或小微门店获客码(即:扫码自引单)
      //   }

      //   this.params = params;

      //   // 登录
      //   common.osg.doLogin(
      //     {
      //       shareType: '1', //运营商
      //       shareTypeId: params.partnerId, //运营商id
      //       shareUserId: params.shareUserId || '',
      //       channelId: params.channelId || '' //运营商报单码渠道
      //     },
      //     () => {
      //       // 查字典表
      //       common.osg.codeoption(() => {
      //         if (this.options.repairParts) {
      //           this.options.repairParts.map(item => {
      //             item.label = item.name;
      //           });
      //         }
      //       });
      //     }
      //   );
      // } else {
      //   this.params = params;
      //   // 查字典表
      //   common.osg.codeoption(() => {
      //     if (this.options.repairParts) {
      //       this.options.repairParts.map(item => {
      //         item.label = item.name;
      //       });
      //     }
      //   });
      // }

      // 从智能问诊进入此页面，“预约”改为“智能问诊”
      if (params.title) {
        wx.setNavigationBarTitle({
          title: decodeURIComponent(params.title)
        });
      }
      // this.getTenantId(params);
    },
    // async getTenantId(params) {
    //   let tenantId = '';
    //   await new Promise(resolve => {
    //     if (params.partnerId) {
    //       common.osg.ajax('parnter/queryById/' + params.partnerId, {}, res => {
    //         tenantId = res.entity.tenantId;
    //         this.parnterServiceType = res.entity.serviceType;
    //         resolve();
    //       });
    //     } else if (params.serviceResourceId) {
    //       common.osg.ajax('parnter/queryHouseKeeperById/' + params.serviceResourceId, {}, res => {
    //         tenantId = res.entity.tenantId;
    //         resolve();
    //       });
    //     } else {
    //       tenantId = '1340835581184723420';
    //       resolve();
    //     }
    //   });
    //   if (tenantId == '1340835581184723420') {
    //     common.osg.ajax('basic/serviceTerritory/queryById/1871510430459576605', {}, res => {
    //       let province = res.province || [];
    //       let city = res.city || [];
    //       let district = res.district || [];
    //       let area = require('../../resources/js/area.js');
    //       let obj = { province_list: {}, city_list: {}, county_list: {} };
    //       province.map(item => {
    //         obj.province_list[item] = area.default.province_list[item];
    //       });
    //       city.map(item => {
    //         obj.city_list[item] = area.default.city_list[item];
    //       });
    //       district.map(item => {
    //         obj.county_list[item] = area.default.county_list[item];
    //       });
    //       this.area.areaList = obj;
    //       this.$forceUpdate();
    //     });
    //   }
    // },
    // doSave() {
    //   console.log(this.formData);
    //   if (!this.formData.name) {
    //     common.osg.toast('请输入姓名', 'none');
    //     return;
    //   }
    //   if (!this.formData.phone || !/^1[3456789]\d{9}$/.test(this.formData.phone)) {
    //     common.osg.toast('请输入正确的手机号', 'none');
    //     return;
    //   }
    //   if (this.formData.area.length == 0) {
    //     common.osg.toast('请选择所在地区', 'none');
    //     return;
    //   }
    //   if (this.formData.exts.leakagesite.length == 0) {
    //     common.osg.toast('请选择渗漏部位', 'none');
    //     return;
    //   }
    //   if (!this.formData.exts.workflowDefId) {
    //     common.osg.toast('请选择服务类型', 'none');
    //     return;
    //   }
    //   if (!this.formData.subdistrict) {
    //     common.osg.toast('请选择街道', 'none');
    //     return;
    //   }
    //   if (!this.formData.address) {
    //     common.osg.toast('请输入详细地址', 'none');
    //     return;
    //   }

    //   //扫平台获客码-创建线索(只有扫平台获客码params.channel才有值)
    //   if (this.params.channel) {
    //     this.leadSave();
    //     return;
    //   }

    //   this.formData.title = this.formData.name + '的报单';
    //   this.formData.exts.image = this.formData.images;

    //   /**
    //    * 只有扫码进入formData.channel才会有值
    //    */
    //   // 非扫码进入
    //   if (!this.formData.channel) {
    //     if (this.params.partnerId || this.params.serviceResourceId) {
    //       if (this.params.fromChannel) {
    //         this.formData.channel = this.params.fromChannel.split(',');
    //         // 推广活动-小程序-门店页面 ['60', '6040', '6040020']    首页-找门店-门店详情-立即预约
    //         // 推广活动-小程序-门店管家页面 ['60', '6040', '6040030'] 首页-找门店-门店详情-管家详情-立即预约
    //         // 推广活动-小程序-管家页面 ['60', '6040', '6040040']    首页-找管家-管家详情-立即预约
    //       } else {
    //         this.formData.channel = ['46', '4610', '4610040']; // 通过门店首页或管家首页立即预约(小程序自引单)
    //       }
    //     } else {
    //       // 获取缓存信息
    //       if (wx.getStorageSync('shareParams')) {
    //         let shareParams = wx.getStorageSync('shareParams');
    //         if (shareParams.type == 'tg' || shareParams.type == 'tgx') {
    //           // 被锁定到门店的，点我的，点底部预约进入
    //           this.params.partnerId = shareParams.partnerId;
    //           this.formData.channel = ['60', '6040', '6040020'];
    //         } else {
    //           this.formData.channel = ['9', '920', '920020']; // 首页智能问诊->呼出-腾讯-小程序
    //         }
    //       }
    //       this.formData.channel = ['9', '920', '920020']; // 首页智能问诊->呼出-腾讯-小程序
    //     }
    //   }

    //   // 信息来源:自引单
    //   if (this.params.partnerId || this.params.serviceResourceId) {
    //     this.formData.exts.sourceType == '1';
    //   } else {
    //     this.formData.exts.sourceType == '2';
    //   }

    //   // 报单渠道id
    //   if (this.params.channelId) {
    //     this.formData.channelId = this.params.channelId;
    //   }

    //   // 分享人id
    //   if (this.params.shareUserId) {
    //     this.formData.exts.shareUserId = this.params.shareUserId;
    //   }
    //   // this.formData.tenantId = "1340835581184723420";
    //   let obj = {
    //     data: JSON.stringify(this.formData)
    //   };
    //   if (!this.params.partnerId && !this.params.serviceResourceId) {
    //     // 智能问诊
    //     obj.tenantId = '1340835581184723420';
    //   } else {
    //     // 扫获客码或从门店预约
    //     if (this.params.partnerId) {
    //       obj.partnerId = this.params.partnerId;
    //     }
    //     // 从管家预约
    //     if (this.params.serviceResourceId) {
    //       obj.serviceResourceId = this.params.serviceResourceId;
    //     }
    //   }
    //   common.osg.ajax('/basic/serviceAppointment/upsert', obj, res => {
    //     common.osg.alert('提交成功', () => {
    //       this.formData = {
    //         channel: this.formData.channel,
    //         title: '',
    //         name: '',
    //         phone: '',
    //         area: '',
    //         province: '',
    //         city: '',
    //         district: '',
    //         address: '',
    //         images: [],
    //         describe: '',
    //         exts: {
    //           leakagesite: [],
    //           leakagesite_copy: []
    //         }
    //       };
    //     });
    //   });
    // },
    /**
     * 保存线索
     */
    // leadSave() {
    //   if (!this.params.partnerId) {
    //     this.formData.tenantId = '1340835581184723420';
    //   }
    //   delete this.formData.exts.leakagesite_copy; //删除渗漏部位冗余字段
    //   this.formData.leadStatus = ['0']; //线索状态
    //   this.formData.customTime = common.osg.formatTime(); // 留咨时间
    //   this.formData.exts.leadDiscrepancy = '99'; // 线索呼入呼出状态-其他
    //   let obj = {
    //     data: JSON.stringify(this.formData)
    //   };

    //   common.osg.ajax('/basic/lead/upsert', obj, res => {
    //     common.osg.alert('提交成功', () => {
    //       this.formData = {
    //         channel: this.formData.channel,
    //         title: '',
    //         name: '',
    //         phone: '',
    //         area: '',
    //         province: '',
    //         city: '',
    //         district: '',
    //         address: '',
    //         images: [],
    //         describe: '',
    //         exts: {
    //           leakagesite: [],
    //           leakagesite_copy: []
    //         }
    //       };
    //     });
    //   });
    // },
    /**
     * 渲染字典
     */
    format(option, val, type) {
      // debugger;
      this.options;
      if (!option) return;
      if (!type || type == 'select') {
        if (val === '') return;
        return common.osg.codelabel(option, val);
      } else if (type == 'multiple') {
        // console.log(this.options[option], val,'465');
        if (val.length == 0) return;
        return common.osg.codelabelForArray(option, val);
      }
    },
    /**
     * 输入
     */
    onChange(e) {
      let key = e.target.dataset.key;
      if (key.startsWith('exts.')) {
        this.formData.exts[key.split('.')[1]] = e.detail;
      } else {
        this.formData[key] = e.detail;
      }
    },
    /**
     * 点击
     */
    onClick(e) {
      this.getServiceType();
      this.actionSheet = {
        show: true,
        key: e.target.dataset.key,
        actions: this.options[e.target.dataset.actions]
      };
    },
    /**
     * 上拉菜单选择
     */
    onSelect(e) {
      let key = this.actionSheet.key;
      if (key.startsWith('exts.')) {
        this.formData.exts[key.split('.')[1]] = e.detail.value;
      } else {
        this.formData[key] = e.detail.value;
      }
      if (key == 'exts.leakagesite') {
        this.formData.exts.leakagesite_copy = [this.formData.exts.leakagesite];
        this.formData.exts.leakagesite = [[this.formData.exts.leakagesite]];
      }
    },
    /**
     * 选择省市区 确认
     */
    areaConfirm(e) {
      let values = e.detail.values;
      let areaVal = [];
      if (values.length >= 1) {
        this.formData.province = values[0].code;
        areaVal.push(values[0].code);
      }
      if (values.length >= 2) {
        this.formData.city = values[1].code;
        areaVal.push(values[1].code);
      }
      if (values.length >= 3) {
        this.formData.district = values[2].code;
        areaVal.push(values[2].code);
      }
      this.formData.area = areaVal; //adcode的数组
      this.formData.subdistrict = '';
      this.area.show = false;
    },
    // 服务类型去重
    getServiceType() {
      if (this.parnterServiceType == '') {
        this.options.serviceTypeCode = this.options.serviceType;
      } else {
        this.options.serviceTypeCode = [];
        for (var i = 0, len = this.options.serviceType.length; i < len; i++) {
          if (this.parnterServiceType.includes(this.options.serviceType[i].value)) {
            this.options.serviceTypeCode.push(this.options.serviceType[i]);
            console.log(this.options.serviceTypeCode, '------------this.options.serviceTypeCode');
          }
        }
      }
    },
    /**
     * 上传图片
     */
    afterRead(e) {
      common.osg.afterRead(e, this);
      this.$forceUpdate();
    },
    /**
     * 删除图片
     */
    deleteFile(e) {
      let index = e.detail.index;
      this.formData.images.splice(index, 1);
      this.$forceUpdate();
    },
    openMap() {
      const referer = '修链科技丨防水补漏'; //调用插件的app的名称
      this.location(res => {
        const location = JSON.stringify({
          latitude: res.latitude,
          longitude: res.longitude
        });
        const category = '生活服务,娱乐休闲';
        wx.navigateTo({
          url:
            'plugin://chooseLocation/index?key=' +
            this.mapKey +
            '&referer=' +
            referer +
            '&location=' +
            location +
            '&category=' +
            category
        });
      });
    },
    /**
     * 获取登录用户小程序地理位置
     */
    location(callback) {
      // 获取地理位置
      wx.getLocation({
        // 获取地理位置成功
        success(res) {
          if (callback) callback(res);
        },
        // 获取地理位置失败
        fail(res) {}
      });
    },
    //根据返回的经纬度，请求解析对应省市区code值
    getGeocoder(location, callback) {
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        data: {
          location: `${location.latitude},${location.longitude}`,
          key: this.mapKey
        },
        success(res) {
          let data = res.data.result;
          console.log(data);
          if (res.statusCode === 200) {
            let obj = {
              province:
                data.ad_info.city_code.replace(data.ad_info.nation_code, '').slice(0, 2) + '0000',
              city: data.ad_info.adcode.slice(0, 4) + '00',
              district: data.ad_info.adcode,
              subdistrict: data.address_reference.town.id,
              address: data.address
            };
            obj.area = [obj.province, obj.city, obj.district];
            callback(obj);
          } else callback({});
        }
      });
    },
    /**
     * 获取街道
     */
    getSubdistricts(arr, callback) {
      if (arr && arr.length >= 3) {
        common.osg.ajax(
          'area/query.do',
          {
            _all: '1',
            notFilterOrgId: '1',
            notFilterTenantId: '1',
            parentCode: arr[2],
            level: '4',
            sortField: 'code',
            sortOrder: 'asc'
          },
          res => {
            res.data.map(item => {
              item.value = item.code;
              item.label = item.name;
              item.leaf = true;
            });
            if (callback) {
              callback(res.data);
            }
          },
          {
            noload: true
          }
        );
      } else {
        if (callback) {
          callback([]);
        }
      }
    },
    getLocation: function (callback, fail) {
      let that = this;
      wx.authorize({
        scope: 'scope.userLocation',
        // 授权-获取地理位置
        success() {
          // 获取地理位置
          that.location(callback);
        },
        // 拒绝-获取地理位置
        fail() {
          // 获取用户当前设置
          wx.getSetting({
            // 获取用户当前设置-成功
            success(res) {
              // 没有授权-则请求设置
              if (!res.authSetting['scope.userLocation']) {
                // 提示需求授权
                wx.showModal({
                  title: '请求授权当前位置',
                  content: '需要获取你的地理位置来查询附近门店',
                  // 确认-打开设置
                  success: function (result) {
                    if (result.confirm) {
                      // 打开设置(不管是否授权，返回后都会执行onShow)
                      wx.openSetting({
                        success(res) {
                          wx.getSetting({
                            success() {
                              if (!res.authSetting['scope.userLocation']) {
                                if (fail) fail();
                              } else {
                                that.location(callback);
                              }
                            }
                          });
                        }
                      });
                    } else {
                      // 取消打开设置
                      if (fail) fail();
                    }
                  }
                });
              } else {
                // 已经授权-则直接获取地理位置
                that.location(callback);
              }
            }
          });
        }
      });
    }
  },
  watch: {
    'formData.area'(area) {
      this.getSubdistricts(area, result => {
        this.options.subdistricts = result;
        // this.$forceUpdate();
      });
    }
  }
};
</script>

<style lang="scss">
van-uploader {
  background-color: #fff;
  padding-left: 16px;
}
page {
  background-color: #fff;
}
.form {
  width: 85vw;
  margin: 0 auto;
}
.van-cell__title {
  flex: 1 !important;
}
.van-cell__value {
  flex: 2 !important;
}
</style>
