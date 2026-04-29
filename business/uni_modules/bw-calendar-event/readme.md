# bw-calendar-event

> uni-app App日历提醒(ios)

### 开发文档
[UTS 语法](https://uniapp.dcloud.net.cn/tutorial/syntax-uts.html)
[UTS API插件](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)
[UTS 组件插件](https://uniapp.dcloud.net.cn/plugin/uts-component.html)
[Hello UTS](https://gitcode.net/dcloud/hello-uts)




### 使用介绍
> 插件声明
> 本插件纯属个人研究开发，并不能保证稳定性，只是给大家一个思路, uts、ts和iOS原生语法基本上都不太了解。
>> 大家可以参考下源码，根据自身业务改动源码
1. 使用 HBuilderx 导入插件，在相关文件中引入插件
2. ### (注意) 云端打包自定义基座

```
<template>
    <view class="content">
            <button @click="handleGet">查询提醒</button>
            <button @click="handleAddCalendar">创建提醒</button>
            <view class="list">
                <view v-for="(item, index) in list" :key="item.eventId" class="list-item">
                    {{ item.title }}
                    <button @click="removeEvent(item, index)">删除</button>
                </view>
            </view>
        </view>
</template>

<script>
	import {
		createEventCalendar,
		removeEventCalendar,
		getEventCalendar
	} from '@/uni_modules/bw-calendar-event';
	import {
		onMounted,
		ref
	} from 'vue'
	const list = ref([])

	function getCalendarList() {
		// 查询当前时间到未来一年内的提醒
		getEventCalendar((events) => {
			list.value = JSON.parse(events)
			console.log(list.value);
		})
	}

	onMounted(() => {
		getCalendarList()
	})

	function removeEvent(item, index) {
		removeEventCalendar({
			idfer: item.eventId,
			success: (e) => {
				console.log('删除成功', e);
				list.value.splice(index, 1)
			},
			fail: (e) => {
				console.log('删除失败', e);
			}
		})
	}

	function handleAddCalendar() {
		const title = `日历提醒_${Math.floor(Math.random() * 100)}`
		//日期格式yyyy-mm-dd MM:hh:ss
		createEventCalendar({
			title: title,
			notes: '日历提醒备注',
			startDate: '2024-07-04 10:00:10',
			endDate: '2024-07-04 13:00:10',
			alarmOffset: [-60 * 15],
			isAllDay: false,
			weeks: [],
			success: (e) => {
				console.log(e);
				getCalendarList()
			},
			fail: (e) => {
				console.log(e);
			}
		})
	}
</script>
```

3. 方法说明 
#### createEventCalendar

|参数|类型|必填|说明|
|--|:--|--|--|
|title|string|是|日历标题|
|notes|string|是|日历备注|
|startDate|yyyy-mm-dd MM:hh:ss|是|开始时间|
|endDate|yyyy-mm-dd MM:hh:ss|是|结束时间|
|alarmOffset|array|是|提醒时间(-60 * 15 : 提前15分钟提醒)|
|isAllDay|Boolean|是|是否全天|
|weeks|array|是|重复规则([0,1,2,3,4,5,6] 0:周日，1:周一...以此类推)|
|success|Function|否|接口调用成功的回调函数|
|fail|Function|否|接口调用失败的回调函数|

#### removeEventCalendar

|参数|类型|必填|说明|
|--|:--|--|--|
|idfer|string|是|事件ID|
|success|Function|否|接口调用成功的回调函数|
|fail|Function|否|接口调用失败的回调函数|

#### getEventCalendar(callback)

|参数|类型|必填|说明|
|--|:--|--|--|
|callback|Function|是|查询到的日历提醒事件列表|

> callback参数示例
 ```json
    {
        "notes": "日历提醒备注",
        "title": "日历提醒_40",
        "endDate": "2024-07-04T13:00:10+0800",
        "eventId": "BDAF720F-E341-46F8-851F-FE7F5A5DFD10:E26564A5-3AE8-4D41-982C-27A348B15F17",
        "startDate": "2024-07-04T10:00:10+0800",
        "rules": []
    } 
```       
### 鼓励作者
如果你觉得插件有帮到你，并且解决了你的问题。可以赞赏一下，你的鼓励会更有动力，感谢！。
