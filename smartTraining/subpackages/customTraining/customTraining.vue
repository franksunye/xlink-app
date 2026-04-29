<template>
  <view class="customTraining">
    <view class="top">
      <view
        :class="activeTab == 'scenario' ? 'tab-active' : ''"
        @click="activeTabClick('scenario')"
      >
        选场景
      </view>
      <view :class="activeTab == 'profile' ? 'tab-active' : ''" @click="activeTabClick('profile')">
        选客户画像
      </view>
    </view>
    <view class="content">
      <block v-if="activeTab == 'scenario'">
        <radio-group @change.prevent.stop="scenarioChange">
          <scroll-view
            style="height: 100%"
            scroll-y
            :scroll-into-view="scenarioScrollViewId"
            scroll-with-animation
          >
            <view
              v-for="(item, i) in scenarios"
              :key="i"
              class="card"
              :id="'scenario-' + item._id"
              @click="scenarioClick(item.value)"
            >
              <radio
                :value="item.value"
                :checked="scenario_id == item.value"
                color="#106cff"
                class="radio"
                @click.stop
              />
              <view>
                <view class="name">
                  <text>{{ item.text }}</text>
                </view>
                <view v-if="item.description" class="description">
                  {{ item.description }}
                </view>
              </view>
            </view>
          </scroll-view>
        </radio-group>
      </block>
      <block v-else-if="activeTab == 'profile'">
        <radio-group style="height: 100%" @change.prevent.stop="profileChange">
          <scroll-view
            style="height: 100%"
            scroll-y
            :scroll-into-view="profileScrollViewId"
            scroll-with-animation
          >
            <view
              v-for="(item, i) in profiles"
              :key="i"
              class="card"
              :id="'profile-' + item._id"
              @click="profileClick(item._id)"
            >
              <radio
                :value="item._id"
                :checked="profile_id == item._id"
                color="#106cff"
                class="radio"
                @click.stop
              />
              <view class="c-flex-1">
                <view class="c-flex c-flex-between c-item-center">
                  <text class="name">{{ item.name }}</text>
                  <view class="icons">
                    <i
                      v-if="item.staff_id == user.userId"
                      class="iconfont icon-edit"
                      @click.stop="edit(item._id)"
                    ></i>
                    <i
                      v-if="item.staff_id == user.userId"
                      class="iconfont icon-delete-o c-m-l-30"
                      @click.stop="remove(item._id, i)"
                    ></i>
                    <i class="iconfont icon-fuzhi c-m-l-30" @click.stop="copy(item)"></i>
                  </view>
                </view>
                <view class="basic-info" style="margin-top: 5px">
                  <text v-if="item.gender">{{ item.gender }}</text>
                  <text v-if="item.age" class="c-m-l-20">{{ item.age }}岁</text>
                  <text v-if="item.residence_type" class="c-m-l-20">{{ item.residence_type }}</text>
                  <text v-if="item.profession" class="c-m-l-20">{{ item.profession }}</text>
                  <text v-if="item.personality" class="c-m-l-20">性格{{ item.personality }}</text>
                </view>
                <view style="color: #969799; margin: 10px 0 5px 0; font-size: 14px">
                  客户需求：
                </view>
                <view>
                  <text style="font-weight: 600">{{ item.leak_location }}漏水</text>
                  <text v-if="item.is_question" class="c-m-l-20">仅咨询</text>
                </view>
                <view style="color: #969799; margin: 10px 0 5px 0; font-size: 14px">
                  房产信息：
                </view>
                <view>
                  <text>{{ item.property_info.is_villa ? '别墅' : '非别墅' }}</text>
                  <text v-if="item.property_info.structure" class="c-m-l-20">
                    {{ item.property_info.structure }}
                  </text>
                  <text
                    v-if="item.property_info.building_age || item.property_info.building_age == 0"
                    class="c-m-l-20"
                  >
                    房龄{{ item.property_info.building_age }}年
                  </text>
                  <text v-if="item.property_info.price_per_sqm" class="c-m-l-20">
                    房价{{ item.property_info.price_per_sqm }}元/㎡
                  </text>
                </view>
              </view>
            </view>
          </scroll-view>
        </radio-group>
      </block>
    </view>
    <button v-if="activeTab == 'profile'" class="footer footer-random" @click="randomProfile">
      生成客户画像
    </button>
    <button class="footer" @click="customTraining">开始对练</button>
  </view>
</template>
<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      user: {},
      activeTab: 'scenario',
      scenarios: [],
      profiles: [],
      scenario_id: '',
      profile_id: '',
      scenarioScrollViewId: '',
      profileScrollViewId: ''
    };
  },
  onLoad() {
    common.osg.init(this, {}, app);
    this.user = uni.getStorageSync('user');
    this.getScenarios();
  },
  onShow() {
    this.getProfiles();
  },
  methods: {
    getScenarios() {
      common.osg.ajax(
        '/scenarios/',
        {
          page: 1,
          per_page: 100
        },
        res => {
          let data = [];
          res.data.map(item => {
            data.push({
              text: item.name,
              value: item._id,
              description: item.description
            });
          });
          this.scenarios = data;
        },
        {
          noload: true,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    getProfiles(callback) {
      common.osg.ajax(
        '/profiles/',
        {
          page: 1,
          per_page: 100,
          source: 'custom',
          staff_id: '0,' + this.user.userId
        },
        res => {
          this.profiles = res.data;
          if (callback) callback();
        },
        {
          noload: true,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    scenarioChange(e) {
      this.scenario_id = e.detail.value;
    },
    scenarioClick(id) {
      this.scenario_id = id;
    },
    profileChange(e) {
      this.profile_id = e.detail.value;
    },
    profileClick(id) {
      this.profile_id = id;
    },
    activeTabClick(activeTab) {
      this.activeTab = activeTab;
      if (activeTab == 'scenario' && this.scenario_id)
        this.scenarioScrollViewId = 'scenario-' + this.scenario_id;
      if (activeTab == 'profile' && this.profile_id)
        this.profileScrollViewId = 'profile-' + this.profile_id;
    },
    randomProfile() {
      common.osg.ajax(
        '/profiles/random',
        {},
        res => {
          delete res._id;
          delete res.created_at;
          delete res.updated_at;
          delete res.source;
          res.staff_id = this.user.userId;
          common.osg.ajax(
            'profiles/',
            res,
            result => {
              res._id = result.profile_id;
              this.profiles.push(res);
              this.profile_id = res._id;
              this.$nextTick(() => {
                this.profileScrollViewId = 'profile-' + this.profile_id;
              });
            },
            {
              header: {
                'Content-Type': 'application/json'
              }
            }
          );
        },
        {
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    copy(item) {
      let params = common.osg.deepCopy(item);
      delete params._id;
      delete params.created_at;
      delete params.updated_at;
      params.staff_id = this.user.userId;
      common.osg.ajax(
        '/profiles/',
        params,
        res => {
          this.profile_id = res.profile_id;
          common.osg.toast('复制成功', 'none');
          this.getProfiles(() => {
            this.$nextTick(() => {
              this.profileScrollViewId = 'profile-' + this.profile_id;
            });
          });
        },
        {
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    edit(id) {
      common.osg.open('/subpackages/profile/profile', { id });
    },
    remove(id, index) {
      common.osg.confirm('是否确认删除此客户画像？', () => {
        common.osg.ajax(
          '/profiles/' + id,
          {},
          res => {
            this.profile_id = '';
            common.osg.toast('删除成功', 'none');
            this.profiles.splice(index, 1);
          },
          { method: 'DELETE' }
        );
      });
    },
    customTraining() {
      if (!this.scenario_id && !this.profile_id) {
        common.osg.toast('请选择场景和客户画像', 'none');
        return;
      } else if (!this.scenario_id) {
        common.osg.toast('请选择场景', 'none');
        return;
      } else if (!this.profile_id) {
        common.osg.toast('请选择客户画像', 'none');
        return;
      }
      common.osg.ajax(
        '/training/start',
        {
          scenario_id: this.scenario_id,
          profile_id: this.profile_id,
          staff_id: this.user.userId
        },
        res => {
          this.scenario_id = '';
          this.profile_id = '';
          common.osg.open('/subpackages/session/session', { sessionId: res.session_id });
        },
        {
          loadingMsg: '对练生成中...',
          header: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.customTraining {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: env(safe-area-inset-bottom);
  .top {
    display: flex;
    align-items: center;
    margin: 0 16px;
    height: 44px;
    > view {
      flex: 1;
      text-align: center;
      position: relative;
      height: 44px;
      line-height: 44px;
    }
    .tab-active {
      color: #106cff;
      &::after {
        position: absolute;
        content: '';
        background-color: #106cff;
        width: 40px;
        height: 4px;
        bottom: 0;
        left: calc(50% - 20px);
        border-radius: 2px;
      }
    }
  }
  .content {
    flex: 1;
    overflow-y: auto;
    .random {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #106cff;
      height: 46px;
      box-sizing: border-box;
    }
    .card {
      display: flex;
      align-items: center;
      background-color: #fff;
      margin: 16px;
      padding: 16px 16px 16px 12px;
      border-radius: 16px;
      .radio {
        display: flex;
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }
      .name {
        font-weight: 600;
        font-size: 18px;
      }
      .icons {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 22px;
          color: #646566;
        }
      }
      .description {
        margin-top: 10px;
        color: #646566;
      }
    }
  }
  .footer {
    margin: 16px 16px 0 16px;
    color: #ffffff;
    background-color: #106cff;
    border-color: #106cff;
    width: calc(100vw - 32px);
  }
  .footer-random {
    color: #646566;
    background-color: #fff;
    border-color: #646566;
  }
}
</style>
