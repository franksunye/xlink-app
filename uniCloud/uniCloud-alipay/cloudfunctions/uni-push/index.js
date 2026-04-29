'use strict';
const uniPush = uniCloud.getPushManager({
	appId: "__UNI__778F8FF"
}) // 传入应用appId，用于指定接收消息的客户端
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 调用一次sendMessage，最大推送设备数是500，超过将直接忽略。有超过500台以上设备接收消息的应用场景，应当调用内置在uni-push-admin插件 中的云对象uni-push-co，调用参数与本api一致
	if (!event.body) return;
	let params = JSON.parse(event.body);
	return await uniPush.sendMessage({
		/**
		 * push_clientid
		 * 基于uni.getPushClientId获取的客户端推送标识，指定接收消息的设备。
		 * 支持多个以数组的形式指定多个设备，如["cid-1","cid-2"]，数组长度不大于1000全。
		 * 非必填，为空表示向所有启动过应用的设备推送。
		 */
		"push_clientid": params.push_clientid == "all" ? "" : params.push_clientid,
		"title": params.title, // 必填，通知栏标题，长度小于20
		"content": params.content, // 必填，通知栏内容，长度小于50
		"payload": params.payload, // 必填，推送透传数据，app程序接受的数据，长度小于800字符
		// "payload": {
		// 	"text": params.payload && params.payload.text, // 非必填，消息内容
		// 	"url": params.payload && params.payload.url // 非必填，客户端跳转页面路径，支持拼接参数
		//  "routerMode": "navigateTo" // 非必填，客户端跳转页面路由方式，不填默认为navigateTo
		// },
		"force_notification": true, // 默认false，true表示无论是离线推送还是在线推送，都会创建通知栏消息
		// "settings":{
		// 	"ttl": 3600000 // 非必填，消息离线时间设置，单位毫秒；小米离线推送要加上离线时间设置，不能为空。
		// },
		"channel": {
			"XM": "122701"
		},
		"options": {
			"HW": {
				"/message/android/category": "WORK"
			},
			"HO": {
				"/android/notification/importance": "NORMAL" //importance字段值为LOW：资讯营销类消息 ;importance字段值为NORMAL：服务与通讯类消息
			},
			"OP": {
				"/channel_id": "push_oplus_category_content", //填写OPPO平台登记的渠道ID
				"/category": "TODO", //填写Opush消息类别category
				"/notify_level": 2 //通知栏消息提醒等级取值定义。1：通知栏，2：通知栏+锁屏，16：通知栏+锁屏+横幅+震动+铃声（16当前仅限即时聊天、音频、视频通话应用）。使用notify_level参数时，category参数必传。
			},
			"VV": {
				"/category": "TODO", //二级分类
				"/notifyType": 4 //通知类型 1:无，2:响铃，3:振动，4:响铃和振动 注意：只对Android 8.0及以下系统有效
			}
		}
	})
};