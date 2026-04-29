<template>
  <view class="outerBox" style="padding: 0px 20px 20px 20px; background-color: #fff">
    <block v-if="htmlContent">
      <mp-html :tag-style="tagStyle" scroll-table :content="htmlContent" />
    </block>
    <block v-else>
      <van-empty image="search" description="暂无人物画像" />
    </block>
  </view>
</template>

<script>
var common = require('../../resources/js/common.js');
import MarkdownIt from 'markdown-it';
import mpHtml from '../uni_modules/mp-html/components/mp-html/mp-html.vue';
export default {
  components: {
    'mp-html': mpHtml
  },
  data() {
    return {
      Id: '',
      outId: '', //线索id
      md: {},
      tagStyle: {
        // 文本与段落
        p: 'margin: 16px 0;',
        span: '',
        strong: 'font-weight: bold;',
        b: 'font-weight: bold;',
        i: 'font-style: italic;',
        em: 'font-style: italic;',
        u: 'text-decoration: underline;',
        del: 'text-decoration: line-through;',
        mark: 'background-color: yellow;',
        small: 'font-size: 80%;',
        sub: 'vertical-align: sub; font-size: smaller;',
        sup: 'vertical-align: super; font-size: smaller;',
        br: '',

        // 标题
        h1: 'margin: 16px 0;font-weight: bold;font-size: 2em;',
        h2: 'margin: 16px 0;font-weight: bold;font-size: 1.5em;',
        h3: 'margin: 16px 0;font-weight: bold;font-size: 1.17em;',
        h4: 'margin: 16px 0;font-weight: bold;font-size: 1em;',
        h5: 'margin: 16px 0;font-weight: bold;font-size: 0.83em;',
        h6: 'margin: 16px 0;font-weight: bold;font-size: 0.67em;',

        // 列表
        ul: 'margin: 1em 0;padding-left: 2em;list-style-type: disc;',
        ol: 'margin: 1em 0;padding-left: 2em;list-style-type: decimal;',
        li: 'margin: 0.6em 0;',

        // 图片和媒体
        img: 'max-width: 100%;height: auto;display: block;',
        video: 'max-width: 100%;display: block;',
        audio: 'width: 100%;',

        // 表格
        table: 'border-collapse: collapse;border-spacing: 0;width: 180%;',
        thead: '',
        tbody: '',
        tfoot: '',
        th: 'white-space: nowrap; max-width: 500px;text-align: left;padding: 8px;border: 1px solid #ddd;',

        tr: 'white-space: normal; max-width: 700px;padding: 8px;border: 1px solid #ddd;',
        td: 'white-space: normal; max-width: 700px;padding: 8px;border: 1px solid #ddd;',

        // 链接
        a: 'color: #007aff;text-decoration: underline;',

        // 引用 & 分隔
        blockquote: 'margin: 16px 0;padding-left: 1em;border-left: 4px solid #ccc;color: #666;',
        hr: 'border: none;border-top: 1px solid #ccc;margin: 16px 0;',

        // 代码
        pre: 'background-color: #f5f5f5;padding: 1em;overflow: auto;',
        code: 'font-family: monospace;background-color: #f5f5f5;padding: 0.2em 0.4em;border-radius: 4px;',

        // 表单基础（非核心）
        input: 'font: inherit;',
        textarea: 'font: inherit;',
        button: 'font: inherit;cursor: pointer;'
      },
      htmlContent: ``
    };
  },
  onLoad(param) {
    console.log(' onLoad(param)', param);

    const { Id, outId } = param;
    if (Id || outId) {
      this.Id = Id;
      this.outId = outId;
      console.log(' this.Id - this.outId', Id, outId);

      wx.setNavigationBarTitle({
        title: outId ? '客户画像' : 'AI 分析'
      });

      this.getData();
    } else {
      console.log('没有拿到的参数', Id);
    }
  },
  ///biz/extForm/queryByColName/AiPrompt.do
  onShow() {},
  methods: {
    getData() {
      let url;
      let params = {
        _all: '1',
        notFilterBelongTo: '1',
        notFilterOrgId: '1'
      };
      if (this.Id) {
        params['is:serviceAppointmentId|string#and'] = this.Id;
        url = 'AiSpeechEval';
      } else if (this.outId) {
        params['in:serviceAppointIds|string#and'] = this.outId;
        url = 'AiLeadEval';
      }
      console.log('传递的参数', `/biz/extForm/queryByColName/${url}.do`, params);

      common.osg.ajax(
        `/biz/extForm/queryByColName/${url}.do`,
        params,
        res => {
          console.log(res);
          if (res.data.length > 0) {
            const answer = res.data[0].answer;
            console.log('第一个 answer 是:', answer);
            // 你可以在这里把 answer 赋值给组件里的某个属性，比如 this.answer = answer
            if (answer && answer.trim()) {
              this.md = new MarkdownIt({
                html: false, // 禁用 HTML 标签，避免 XSS
                linkify: true, // 自动将链接文本转为 <a>
                typographer: true, // 更好的排版，比如自动替换引号等
                breaks: true
              });
              this.htmlContent = this.md.render(answer);
            }
          } else {
            console.log('数据为空');
          }
        },
        {
          noload: true
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.outerBox {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  padding: 0 20rpx 20rpx;
  background-color: #ffffff;
  box-sizing: border-box; /* 防止 padding 影响整体宽度高度 */
}
</style>
