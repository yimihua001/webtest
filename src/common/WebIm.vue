<template>
</template>
<script>
	export default {
		data() {
			return {
				loginInfo: {
					identifier: localStorage.getItem('txuserid'),
					userSig: localStorage.getItem('txusersign'),
					accountMode: '1',
					sdkAppID: '1400056850',
					accountType: '20730',
					identifierNick: '',
					loginStatus: false //是否登录成功
				},
				webImEmoji: WebImEmoji.getEmoji(),
			}
		},
		props: ['type'],
		created() {
			var v = this;
			console.log(v.type)
			v.webimLogin(); //登录im
		},
		methods: {
			//sdk登录
			webimLogin() {
				var v = this;
				//监听事件
				var listeners = {
					onConnNotify: v.onConnNotify, //监听连接状态回调变化事件,必填
					jsonpCallback: '', //IE9(含)以下浏览器用到的jsonp回调函数，
					onMsgNotify: v.onMsgNotify, //监听新消息(私聊，普通群(非直播聊天室)
					onKickedEventCall: v.onKickedEventCall //被其他登录实例踢下线     
				};
				//初始化时，其他对象，选填
				var options = {
					'isLogOn': false //是否开启控制台打印日志,默认开启，选填
				};
				webim.login(
					v.loginInfo, listeners, options,
					function(resp) {
						v.loginInfo.loginStatus = true;
						console.log('登录成功');
					},
					function(err) {
						console.log(err.ErrorInfo);
					}
				);
			},
			//newMsgList 为新消息数组，结构为[Msg]
			onMsgNotify(newMsgList) {
				var v = this;
				var newMsg;
				console.log(newMsgList);
				for(var j = 0; j < newMsgList.length; j++) { //遍历新消息
					newMsg = newMsgList[j];
					var isSelfSend = newMsg.getIsSend(); //消息是否为自己发的
					var msg = newMsg.elems[0].content.text;
					msg = msg.replace(/&quot;/g, '"');
					msg = JSON.parse(msg);
					console.log(msg);
					//遍历消息中的数组
					for(var i = 0; i < msg.length; i++) {
						console.log(msg[i].hasOwnProperty("eventtype"))
						console.log(v.type)
						if(msg[i].hasOwnProperty("eventtype")) {
                            v.giveMsg(msg[i], isSelfSend, newMsg)
						}
					}
				}
			},
			
			//消息分发
			giveMsg(msg, isSelfSend, newMsg) {
				var v = this;
				if(v.type == 'live') {
					//直播透传消息
					if(msg.eventtype == 'live') {
						v.$emit('showMsg', msg);
					}
				} else if(v.type == 'consult') { //咨询
					//咨询透传消息
					if(newMsg.getSession().id() == msg.data.imgroupid) { //为当前聊天对象的消息
						if(msg.eventtype == 'customplan' && msg.opertype == 'groupmsg') {
							if(isSelfSend && msg.fromdev != 'web') {
								//在聊天窗体中新增一条消息
								v.$emit('showMsg', msg.data);
							} else if(!isSelfSend) {
								console.log(msg)
								//在聊天窗体中新增一条消息
								v.$emit('showMsg', msg.data);
							}
						}

					}
				}
			},
			//监听连接状态回调变化事件
			onConnNotify(resp) {
				var info;
				switch(resp.ErrorCode) {
					case webim.CONNECTION_STATUS.ON:
						console.log('建立连接成功: ' + resp.ErrorInfo);
						break;
					case webim.CONNECTION_STATUS.OFF:
						info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
						console.log(info);
						break;
					case webim.CONNECTION_STATUS.RECONNECT:
						info = '连接状态恢复正常: ' + resp.ErrorInfo;
						console.log(info);
						break;
					default:
						webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
						break;
				}
			},
			//判断素材是否过期
			checkUrlPast(url, index) {
				var v = this;
				var arr = url.split('&');
				var time = arr[arr.length - 1].split('=')[1];
				time = parseInt(time, 16) * 1000;
				var nowTime = Date.parse(new Date());
				console.log('过期时间：' + v.$utils.formatData(time, 'second'))
				if(time < nowTime) {
					url = url.split('&')[0];
					v.complete = false;
					v.mediaurl(url, index);
				} else {
					v.playNewAudio(url, index);
				}
			},
			//被新实例踢下线的回调处理
			onKickedEventCall() {
				var v = this;
				console.log('其他地方登录，被T了');
				Toast('其他地方登录，被T了');
				v.loginInfo.loginStatus = false;

			}
		}

	}
</script>