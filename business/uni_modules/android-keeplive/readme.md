# android-keeplive
### 长期维护，有任何问题在插件群联系
### 推荐使用作者一像素保活[链接](https://ext.dcloud.net.cn/plugin?id=20324)
### 需要自定义基座
### 
###  uniappx
~~~
	import { KeepLive } from '@/uni_modules/android-keeplive'
	
	
	  var keep=new KeepLive();
		keep.setTitle("app");
		keep.setContent("app is runing");
		// keep.setLargeIcon("icon");
		keep.setSmallIcon("icon"); //图标名字  图标放在 插件下面的 res/drawable 文件夹下
		keep.setWorkerEnabled(true);
		keep.onAddBackgroundCallback(function(res:boolean){
			console.log("后台运行 "+res)
			
		})
		keep.onAddScrrenListenerCallback(function(res:boolean){
			console.log("屏幕开启状态 "+res)
	
		})	
	  keep.register();
		
		
		 // // android 原生定时任何状态一秒误差, 开始时间 1000为1秒  0是马上执行, 开启周期 65*1000, 循环时间 大于60s 精准有效 低于60秒偏差误差
		//	keep.startAleraTask(0,65*1000,function(){
		//			console.log("onAleraTaskListener ")
		//	}); 
		
		//取消循环定时
		//	keep.cancleAleraTask()
~~~


###  uniapp
~~~
	import { KeepLive } from '@/uni_modules/android-keeplive'
	
	
	  var keep=new KeepLive();
		keep.setTitle("app");
		keep.setContent("app is runing");
		// keep.setLargeIcon("icon");
		keep.setSmallIcon("icon"); //图标名字  图标放在 插件下面的 res/drawable 文件夹下
		keep.setWorkerEnabled(true);
		keep.onAddBackgroundCallback(function(res){
			console.log("后台运行 "+res)
			
		})
		keep.onAddScrrenListenerCallback(function(res){
			console.log("屏幕开启状态 "+res)
			
		})	
	  keep.register();
	  
	  
	 // // android 原生定时任何状态一秒误差, 开始时间 1000为1秒0是马上执行, 开启周期 65*1000, 循环时间 大于60s 精准有效 低于60秒偏差误差
	//	 keep.startAleraTask(0,65*1000,function(){
	//			console.log("onAleraTaskListener ")
	//	 }); 
	  
		//取消循环定时
		//keep.cancleAleraTask()
~~~

### 根据用户测试
~~~

保活一周用户案例
定时器间隔最少70秒   小米 vivo 荣耀实测活一周多还不死
小米 vivo  唤醒cpu更新通知栏最少三分钟一次
荣耀  唤醒cpu更新通知栏最少20分钟一次

~~~
### 注册开启运行

#### register

### 重启

#### restart


### 取消运行

#### unregister


### 是否运行
#### isRunning
return  boolean


### 通过包名打开应用程序
#### doStartApplicationWithPackageName
参数1 应用包名 string 


### 开启应用省电后台运行 
#### requestIgnoreBatteryOptimizations

### 判断应用是否开启省电后台运行 
#### isIgnoringBatteryOptimizations
return  boolean 

### 设置后台无声音乐是否开启 
#### setBackgroundMusicEnabled
参数1 boolean

### 是否隐藏通知栏 
#### hideNotification
参数1 boolean

### 静音通知
#### setNotifaicationSoundEnable
 参数1 boolean
 
### 设置通知栏 ChannelId 默认keeplive
#### setChannelId
参数1 string 

### 更新通知栏 
#### updateNotification


### 设置通知栏标题
#### setTitle
参数1 string 


### 设置通知栏内容
#### setContent
参数1 string 


### 设置通知栏小图标
#### setSmallIcon
参数1 string   插件的res  drawable 目录下 名称



### 设置通知栏大图标
#### setLargeIcon
参数1 string   插件的res  drawable 目录下 名称


### 设置唤醒cpu类型
#### setWakeLock
参数1 number   
1:保持CPU 运转，屏幕和键盘灯有可能是关闭的。

6：保持CPU 运转，允许保持屏幕显示但有可能是灰的，允许关闭键盘灯

10：保持CPU 运转，允许保持屏幕高亮显示，允许关闭键盘灯

26：保持CPU 运转，保持屏幕高亮显示，键盘灯也保持亮度

268435456：一旦有请求锁时强制打开Screen和/或keyboard light
参数2 string tag

~~~
keep.setWakeLock(1,"tag");
~~~

### 唤醒cpu  需先设置唤醒cpu 类型
#### acquire
参数1 number 时间

~~~
keep.acquire(-1);
~~~
### 释放cpu  需先设置唤醒cpu 类型
####  releaseAcquire
~~~
keep.releaseAcquire();
~~~


### 后台背景音乐测试
~~~
keep.setDebug(true);
keep.setMusicId("music")   // 将音乐放进  插件目录 /res/raw/music.mp3  
~~~

### 主动退出应用后台运行，相当于单击home 
~~~
keep.toBackground();
~~~

### 待测试功能 *定时器*
~~~
     //开启定时器     60时间为秒
	 keep.startCSystemTimer(60,function(){
		console.log("startCSystemTimer ")
    });
	
	//keep.cancelCSystemTimer();
~~~



###
### 打赏
感谢您使用此插件，如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。



[UTS 语法](https://uniapp.dcloud.net.cn/tutorial/syntax-uts.html)
[UTS API插件](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)
[UTS 组件插件](https://uniapp.dcloud.net.cn/plugin/uts-component.html)
[Hello UTS](https://gitcode.net/dcloud/hello-uts)

