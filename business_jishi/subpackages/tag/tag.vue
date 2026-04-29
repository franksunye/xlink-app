<template>
  <view class="tag-view" @click.capture="track">
    <view class="c-flex-1 c-auto-y">
      <view class="c-p-30 c-m-b-30" style="padding-bottom: 0 !important">
        <view class="c-gray-6">企业标签</view>
        <block v-for="(tagType, i) in tagTypeData" :key="i">
          <view
            v-if="tagType.type == 0 && tagType.typeId == roleId"
            class="tag-type"
            :style="lastIndex == i ? 'border:none' : ''"
          >
            <view class="c-bold">{{ tagType.name }}</view>
            <view class="tags">
              <block v-for="(tag, j) in tagData" :key="j">
                <van-tag
                  v-if="tag.tagTypeId == tagType._id"
                  class="tag"
                  :color="etags[roleId].indexOf(tag._id) != -1 ? '#e0edfd' : '#f2f3f4'"
                  :text-color="etags[roleId].indexOf(tag._id) != -1 ? '#2A80F0' : '#3b4045'"
                  size="large"
                  @click.native="tagClick(tag.type, tag._id)"
                >
                  {{ tag.name }}
                </van-tag>
              </block>
            </view>
          </view>
        </block>
      </view>
      <view style="width: 100vw; height: 10px; background: #f2f3f4"></view>
      <view class="c-p-30 c-p-b-0">
        <view class="c-gray-6 c-m-b-10">自定义标签</view>
        <block v-for="(tagType, i) in tagTypeData" :key="i">
          <view v-if="tagType.type == 1" style="border: none">
            <view class="tags">
              <van-tag
                class="tag"
                color="#f2f3f4"
                text-color="#3b4045"
                size="large"
                @click.native="customTagOpen"
              >
                <van-icon name="plus" />
              </van-tag>
              <block v-for="(tag, j) in tagData" :key="j">
                <van-tag
                  v-if="tag.tagTypeId == tagType._id && tag.typeId == userId"
                  class="tag"
                  :color="etags[userId].indexOf(tag._id) != -1 ? '#e0edfd' : '#f2f3f4'"
                  :text-color="etags[userId].indexOf(tag._id) != -1 ? '#2A80F0' : '#3b4045'"
                  size="large"
                  @click.native="tagClick(tag.type, tag._id)"
                >
                  {{ tag.name }}
                </van-tag>
              </block>
            </view>
          </view>
        </block>
        <view v-if="!tagTypeData.find(tagType => tagType.type == 1)" class="c-m-t-10">
          <van-tag
            class="tag"
            color="#f2f3f4"
            text-color="#3b4045"
            size="large"
            @click.native="customTagOpen"
          >
            <van-icon name="plus" />
          </van-tag>
        </view>
      </view>
    </view>
    <view class="c-flex c-p-30">
      <van-button
        plain
        block
        class="c-flex-1 c-m-r-30"
        @click="getEtags"
        :data-event="{ id: 'Y0dyQ6PZIR' }"
      >
        重置
      </van-button>
      <van-button
        type="info"
        block
        class="c-flex-1"
        @click="tagSave"
        :data-event="{ id: 'KI9CYPF9sz' }"
      >
        保存
      </van-button>
    </view>
    <!-- 添加自定义标签 -->
    <van-popup
      :show="customTagShow"
      custom-style="height: 50%;"
      position="bottom"
      round
      @close="customTagCancel"
    >
      <van-nav-bar
        custom-class="c-size-16"
        title="添加自定义标签"
        left-text="取消"
        @click-left="customTagCancel"
      >
        <van-button
          type="info"
          plain
          slot="right"
          @click="customTagSave"
          custom-class="c-border-n"
          :data-event="{ id: 'F3eOWdq33J' }"
        >
          保 存
        </van-button>
      </van-nav-bar>
      <van-cell-group>
        <van-field
          label="标签名"
          :value="customTagValue"
          placeholder="请输入"
          :border="false"
          @change="customTagChange"
        />
      </van-cell-group>
    </van-popup>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
const app = getApp();
var common = require('../../resources/js/common.js');
export default {
  data() {
    return {
      roleId: '',
      userId: '',
      target: '', // 需要打标签的对象
      id: '', // 需要打标签的数据id
      tagTypeData: [], // 全部客户标签组
      tagData: [], // 全部客户标签
      etags: {}, // 已选中客户标签，key为id（角色id或用户id），value为tag表id的列表。
      lastIndex: 0, // 最后一个企业标签分类索引，去掉底部边框。
      customTagShow: false, // 添加自定义标签
      customTagValue: '' // 自定义标签值
    };
  },
  onLoad(params) {
    common.osg.init(this, params, app);
    this.roleId = wx.getStorageSync('currentRole')._id;
    this.userId = wx.getStorageSync('user')._id;
    this.target = params.target;
    this.id = params.id;
    this.getTagTypeData();
    this.getTagData();
    this.getEtags();
  },
  methods: {
    getTagTypeData() {
      common.osg.ajax(
        'basic/tagType/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          'is:target|string#and': this.target,
          notFilterBelongTo: '1',
          notFilterOrgId: '1',
          sortField: 'type',
          sortOrder: 'asc'
        },
        res => {
          for (let i = 0; i < res.data.length; i++) {
            let tagType = res.data[i];
            if (tagType.type == 0 && tagType.typeId == this.roleId) {
              this.lastIndex = i;
            }
          }
          this.tagTypeData = res.data;
        },
        { noload: true }
      );
    },
    getTagData() {
      common.osg.ajax(
        'basic/tag/query',
        { _all: '1', 'is:state|integer#and': 1, notFilterBelongTo: '1', notFilterOrgId: '1' },
        res => {
          this.tagData = res.data;
        },
        { noload: true }
      );
    },
    getEtags() {
      common.osg.ajax(
        'basic/tag/getEtags',
        { data: JSON.stringify({ target: this.target, id: this.id }) },
        res => {
          if (!res[this.roleId]) res[this.roleId] = [];
          if (!res[this.userId]) res[this.userId] = [];
          this.$set(this, 'etags', res);
        },
        { noload: true }
      );
    },
    tagClick(tagType, tagId) {
      if (tagType == 0) {
        let index = this.etags[this.roleId].indexOf(tagId);
        if (index == -1) {
          this.etags[this.roleId].push(tagId);
        } else {
          this.etags[this.roleId].splice(index, 1);
        }
      } else {
        let index = this.etags[this.userId].indexOf(tagId);
        if (index == -1) {
          this.etags[this.userId].push(tagId);
        } else {
          this.etags[this.userId].splice(index, 1);
        }
      }
    },
    tagSave() {
      common.osg.ajax(
        'basic/tag/tagging',
        {
          data: JSON.stringify({
            target: this.target,
            id: this.id,
            etags: this.etags
          })
        },
        () => {
          wx.navigateBack({
            delta: 1
          });
        },
        { noload: true }
      );
    },
    customTagOpen() {
      this.customTagShow = true;
    },
    customTagCancel() {
      this.customTagShow = false;
      this.customTagValue = '';
    },
    customTagChange(e) {
      this.customTagValue = e.detail;
    },
    customTagSave() {
      if (!this.customTagValue || this.customTagValue.trim().length == 0) {
        common.osg.toast('标签名不能为空', 'none');
        return;
      }
      // 获取自定义标签
      let customTagType = this.tagTypeData.find(tagType => tagType.type == 1);
      if (!customTagType) {
        common.osg.toast('没有自定义标签组，无法创建自定义标签。', 'none');
        return;
      }
      common.osg.ajax(
        'basic/tag/upsert',
        {
          data: JSON.stringify({
            name: this.customTagValue,
            type: 1, // 0角色 1自定义
            tagTypeId: customTagType._id, // 标签分组id
            typeId: this.userId
          })
        },
        res => {
          this.etags[this.userId].push(res.data._id);
          this.getTagData();
          this.customTagShow = false;
        },
        {
          noload: true
        }
      );
    }
  }
};
</script>

<style lang="scss">
.tag-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}
</style>
