<template>
  <view style="width: 100vw; height: 100vh; position: relative" @click.capture="track">
    <l-echart ref="chart"></l-echart>
  </view>
</template>

<script>
import LEchart from '@/wxcomponents/l-echart/l-echart.vue';
import * as echarts from '@/subpackages2/js/echarts.min.js';
const app = getApp();
var common = require('../../resources/js/common.js');
var areajs = require('../../resources/js/area.js');
export default {
  components: {
    LEchart
  },
  data() {
    return {
      districtList: Object.assign({}, areajs.default.county_list),
      chartOption: {
        series: [
          {
            type: 'treemap',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            roam: false, // false:关闭。'scale' 或 'zoom'：只能够缩放。'move' 或 'pan'：只能够平移。true：缩放和平移均可。
            // 矩形内部自定义文字
            label: {
              position: 'insideTopLeft',
              formatter: params => {
                let arr = [
                  '{name|' + params.name + '}',
                  '{hr|}',
                  '{value| ' +
                    (params.value > 10
                      ? Math.floor(params.value / 10) + '0+'
                      : params.value >= 5
                      ? '较少'
                      : '很少') +
                    '}'
                ];
                return arr.join('\n');
              },
              rich: {
                name: {
                  fontSize: 13,
                  color: '#fff'
                },
                hr: {
                  width: '100%',
                  borderColor: 'rgba(255,255,255,0.2)',
                  borderWidth: 0.5,
                  height: 0,
                  lineHeight: 10
                },
                value: {
                  fontSize: 16,
                  lineHeight: 20,
                  color: 'yellow'
                }
              }
            },
            // 父节点标签
            upperLabel: {
              show: true,
              formatter: function (params) {
                // 同样确保返回的是字符串
                return params.name; // 或者根据实际需要返回其他字段
              }
            },
            itemStyle: {
              borderColor: '#fff'
            },
            // 层级设置
            levels: [
              {
                itemStyle: {
                  borderWidth: 0,
                  gapWidth: 1
                },
                upperLabel: {
                  show: false
                },
                color: [
                  '#ff6900',
                  '#3f83ff',
                  '#5397ff',
                  '#67abff',
                  '#7bbfff',
                  '#8fd3ff',
                  '#f9d749',
                  '#ffeb5d',
                  '#e5c335',
                  '#ffeb5d',
                  '#d1af21'
                ]
              },
              {
                itemStyle: {
                  borderColor: '#666',
                  borderWidth: 3,
                  gapWidth: 1
                },
                emphasis: {
                  itemStyle: {
                    borderColor: '#ddd'
                  }
                }
              }
            ],
            // 数据集
            data: [],
            // 底部面包屑
            breadcrumb: {
              top: 'auto',
              emptyItemWidth: '40',
              height: '40',
              bottom: '30'
            }
          }
        ]
      }
    };
  },
  onLoad(param) {
    common.osg.init(this, param, app);
    this.getST();
  },
  methods: {
    initChart() {
      this.$refs.chart.init(echarts, chart => {
        chart.setOption(this.chartOption);
      });
    },
    formatDistricts(district) {
      if (district.indexOf(',') == -1) {
        return this.districtList[district];
      } else {
        let str = '';
        let districts = district.split(',');
        districts.map(item => {
          str += this.districtList[item] + '、';
        });
        return str.substring(0, str.length - 1);
      }
    },
    getST() {
      common.osg.ajax(
        'basic/serviceTerritoryCustom/query',
        {
          _all: '1',
          'is:state|integer#and': 1,
          sortField: 'territoryNum,createTime',
          sortOrder: 'asc'
        },
        res => {
          let obj = {};
          res.data.map(item => {
            let district = item.district.join();
            if (!obj[district]) {
              obj[district] = {
                name: this.formatDistricts(district),
                value: item.relatedIds.length + item.bindRelatedIds.length,
                children: [
                  { name: item.name, value: item.relatedIds.length + item.bindRelatedIds.length }
                ]
              };
            } else {
              obj[district].value += item.relatedIds.length + item.bindRelatedIds.length;
              obj[district].children.push({
                name: item.name,
                value: item.relatedIds.length + item.bindRelatedIds.length
              });
            }
          });
          let data = [];
          for (let key in obj) {
            data.push(obj[key]);
          }
          this.chartOption.series[0].data = data;
          this.initChart();
        },
        {
          noload: true
        }
      );
    }
  }
};
</script>
<style></style>
