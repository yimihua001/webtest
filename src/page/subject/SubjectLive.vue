<template>
	<div class="wrapper live-wrapper">
		<div class="scroll-wrapper">
			<div class="course-header">
				<div>
					<span class="name ellipsis_">{{course.name}}</span>
					<span class="username ellipsis_">上课老师：{{course.username}}/人数：{{course.usercount}}</span>
				</div>
				<button>举报</button>
			</div>
			<div class="matter-wrapper" v-bind:style="{height: height+'px'}" v-show="matterScreenFlag">
				<img :src="matter.data.url" v-if="picFlag" class="matter-img" />
				<div class="video-wrapper" v-show="videoFlag">
					<p>暂不支持播放视频，请下载app进行观看</p>
					<!--<video id="video" x-webkit-airplay="true" x5-playsinline="true" webkit-playsinline="true" playsinline="true" src="" controls=""></video>
					<div class="pause video-state" @click="playVideo()"></div>-->
				</div>
				<div class="audio-wrapper" v-show="audioFlag">
					<audio id="audio"></audio>
					<span class="pause audio-state" @click="playAudio()"></span>
				</div>
				<iframe v-if="gameFlag" :src="matter.data.url" width="100%" height="100%" frameborder="0" id="matter-game"></iframe>
				<div class="btn-screen" @click="switchScreen" :class="{quit:screenFlag == true}"></div>
			</div>
			<div class="live-video-wrapper" v-show="playStatus && videoScreenFlag" v-bind:style="{height: height+'px'}">
				<video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" webkit-playsinline="true" x-webkit-airplay="true" playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true">
				</video-player>
				<div class="btn-screen" @click="videoScreen" :class="{quit:screenFlag == true}"></div>
			</div>
			<div class="live-info-wrapper" v-show="!playStatus" v-bind:style="{height: height+'px'}">
				<p>{{roomInfo}}</p>
				<div class="btn-screen" @click="videoScreen" :class="{quit:screenFlag == true}"></div>
			</div>
			<div class="live-comment-wrapper" v-show="commentScreenFlag">
				<ul class="list">
					<li v-for="(item,index) in msglist" :key="index">
						<span class="msg" v-if="item.type=='msg'">{{item.username}}：</span>
						<span class="ques" v-if="item.type=='ques'">{{item.username}}：</span>
						<span class="notice" v-if="item.type=='notice'">{{item.username}}：</span>
						<span style="color:#f00" v-if="item.usertype==3">{{item.content}}</span>
						<span v-if="item.usertype==1">{{item.content}}</span>
						<span class="bg" v-if="item.usertype==2">{{item.content}}</span>
					</li>
				</ul>
				<div class="bottom"></div>
				<div class="btn-msg-type" v-if="msgType == 'msg'" @click="toggleMsgtype('ques')">提问</div>
				<div class="btn-msg-type" v-if="msgType == 'ques'" @click="toggleMsgtype('msg')">消息</div>
			</div>
		</div>
		<div class="live-submit-wrapper" v-show="commentScreenFlag">
			<input type="text" placeholder="请输入聊天内容..." class="ui-input" v-model="content" v-if="msgType == 'msg'" @focus="focusInput" />
			<input type="text" placeholder="请输入提问内容（最多三条）..." class="ui-input" v-model="content" v-if="msgType == 'ques'" @focus="focusInput" />
			<button class="send" @click="msgAdd()"></button>
		</div>
		<WebIm ref="webim" @showMsg='showMsg' type="live"></WebIm>
	</div>

</template>
<style lang='sass'>
	@import "../../../static/sass/pages/subject";
</style>
<script>
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	import wx from 'weixin-js-sdk'
	//IM组件
	import WebIm from '../../common/WebIm'
	export default {
		data() {
			return {
				course: JSON.parse(sessionStorage.getItem('subjectCourse')),
				id: this.$route.params.id,
				height: parseInt($(window).width() / 1.777),
				msgType: 'msg',
				content: '',
				msglist: [],
				picFlag: false,
				videoFlag: false,
				audioFlag: false,
				gameFlag: false,
				playStatus: false,
				roomInfo: '老师还没有进入直播间',
				matterScreenFlag: true,
				commentScreenFlag: true,
				videoScreenFlag: true,
				screenFlag: false,
				matter: '',
				playerOptions: {
					playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
					overNative: true,
					autoplay: false, //如果true,浏览器准备好时开始回放。
					controls: false, //是否显示控制条
					techOrder: ['flash', 'html5'],
					language: 'zh-CN',
					aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					sourceOrder: true,
					notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
					flash: {
						hls: {
							withCredentials: false
						},
						swf: '/static/media/video-js.swf'
					},
					html5: {
						hls: {
							withCredentials: false
						}
					},
					sources: [{
						withCredentials: false,
						type: 'application/x-mpegURL',
						src: ''
					}],
					//poster: '/static/images/logo.png',
					width: document.documentElement.clientWidth,
					height: this.height,
				}

			}
		},
		components: {
			WebIm
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
		},
		computed: {
			player() {
				return this.$refs.videoPlayer.player
			},
		},
		mounted() {
			//进入直播间
			this.enterRoom();
			$('.live-comment-wrapper').css('height', $('.scroll-wrapper').height() - this.height * 2);
			//微信分享配置
			//	this.shareConfig();
		},
		methods: {
			//进入直播间
			enterRoom() {
				var v = this;
				v.$api.post('live/userenter?id=' + v.id, '', function(r) {
					console.log(r);
					Indicator.close();
					v.course.username = r.data.username;
					v.course.usercount = r.data.usercount
					if(r.data.livestatus == 'prog') {
						v.playStatus = true;
						v.roomInfo = '老师已进入直播间';
						var msg = {
							'username': '系统公告',
							'content': r.data.tips,
							'usertype': 3,
							'type': 'notice'
						}
						console.log(r.data)
						v.playerOptions.sources[0].src = r.data.livehls
						//v.playerOptions.autoplay = true
						v.msglist.push(msg);
						if(r.data.events.length > 0) {
							console.log(r.data.events[0])
							v.showMsg(r.data.events[0])
						}
					}
				});
			},
			showMsg(msg) {
				var v = this;
				if(msg.opertype == 'groupmsg') { //直播消息类型
					console.log('直播消息')
					console.log(msg.data);
					v.showChatMsg(msg.data);
				} else if(msg.opertype == 'galleryopen') { //直播素材打开
					console.log('素材消息开启')
					console.log(msg.data.gtype + "==" + 3 + "&&" + msg.data.timepoint + "!=" + 0)
					if(msg.data.gtype == 1) { //图片
						v.showPic(msg)
					} else if(msg.data.gtype == 2) { //视频(进度不为0)
						v.showVideo(msg);
					} else if(msg.data.gtype == 3) { //音频
						v.showAudio(msg)
					} else if(msg.data.gtype == 4) { //游戏
						v.showGame(msg);
					}
				} else if(msg.opertype == 'galleryclose') { //直播素材关闭
					console.log('素材消息关闭')
					removeGallery(msg.data);
				} else if(msg.opertype == 'galleryseek') { //直播素材拖进度
					if(msg.data.gtype == 2) { //视频拖进度
						console.log('视频进度');
						v.showVideo(msg);
					} else if(msg.data.gtype == 3) { //音频拖进度
						v.showAudio(msg)
					}
				} else if(msg.opertype == 'gallerypause') { //直播素材暂停
					if(msg.data.gtype == 2) { //视频暂停
						console.log('视频暂停');
						v.showVideo(msg);
					} else if(msg.data.gtype == 3) { //音频暂停
						v.showAudio(msg)
					}
				} else if(msg.opertype == 'errorstop') { //老师异常离开直播间
					v.playStatus = false;
					v.roomInfo = '老师离开直播间,请稍等';
					v.pauseSound();
					v.matter = '';
					console.log('异常离开房间')
				} else if(msg.opertype == 'stop') { //老师离开直播间
					v.playStatus = false;
					v.roomInfo = '直播结束';
					v.pauseSound();
					console.log('直播结束')
				} else if(msg.opertype == 'start') { //老师进入直播间
					v.playStatus = true;
					v.roomInfo = '老师进入直播间';
					console.log('进入房间')
				}
			},
			//展示聊天消息
			showChatMsg(msg) {
				var v = this;
				v.msglist.push(msg);
				if(v.msglist.length > 200) {
					v.msglist.splice(0, 10);
				}
				$('.comment-wrapper').animate({
					scrollTop: $('.bottom').offset().top
				}, 800);
			},
			//展示图片
			showPic(msg) {
				var v = this;
				console.log(msg.data.url)
				v.pauseSound();
				v.picFlag = true;
				v.videoFlag = false;
				v.audioFlag = false;
				v.gameFlag = false;
				v.matter = msg;
				v.matter.data.url = msg.data.url + '&imageView2/1/w/' + $(window).width() + '/h/' + v.height
				//				console.log($('.matter-img').attr('src'))
				//				$('.matter-img').attr('src',msg.data.url + '&imageView2/1/w/' + $(window).width() + '/h/' + v.height)
			},

			//展示视频
			showVideo(msg) {
				var v = this;
				v.pauseSound();
				var video = document.getElementById("video");
				//				if(v.videoFlag) {
				//					v.playVideo(msg)
				//				} else {
				v.picFlag = false;
				v.videoFlag = true;
				v.audioFlag = false;
				v.gameFlag = false;
				//					v.matter = msg;
				//					video.src = msg.data.url;
				//					v.playVideo(msg)
				//}
			},

			//播放/暂停/拖动视频
			playVideo(msg) {
				var v = this;
				var video = document.querySelector('#video');
				if(msg) {
					video.currentTime = msg.data.timepoint;
					if(msg.opertype == "open" || msg.opertype == "seek") {
						if(msg.data.timepoint == msg.data.timelen) {
							video.pause();
							$('.video-state').removeClass('hide')
						} else {
							video.play();
							$('.video-state').addClass('hide')
						}
					} else if(msg.opertype == "pause") {
						video.pause();
						$('.video-state').removeClass('hide')
					}
				} else {
					video.play();
					$('.video-state').addClass('hide')
				}
			},
			//展示音频
			showAudio(msg) {
				var v = this;
				v.pauseSound();
				var audio = document.getElementById("audio");
				v.matter = msg;
				audio.src = v.matter.data.url;
				if(v.audioFlag) {
					v.playAudio()
				} else {
					v.picFlag = false;
					v.videoFlag = false;
					v.audioFlag = true;
					v.gameFlag = false;
					v.playAudio()
				}
			},

			//播放/暂停/拖动音频
			playAudio() {
				var v = this;
				var audio = document.getElementById("audio");
				audio.currentTime = v.matter.data.timepoint;
				if(v.matter.opertype == "open" || v.matter.opertype == "seek") {
					if(v.matter.data.timepoint == v.matter.data.timelen) {
						audio.pause();
					} else {
						audio.play();
					}
				} else if(v.matter.opertype == "pause") {
					$('.audio-state').removeClass('play')
					audio.pause();
				}
				audio.addEventListener('ended', function() {
					$('.audio-state').removeClass('play')
				}, false);
				audio.addEventListener('playing', function() {
					$('.audio-state').addClass('play')
				}, false);
				audio.addEventListener('paused', function() {
					$('.audio-state').removeClass('play')
				}, false);
				if(v.$utils.mobileDetect() == 1 ){//ios
					audio.addEventListener("canplay", function() {
						//设置播放时间  
						audio.currentTime = v.matter.data.timepoint;
					});
				}
				
			},
			//打开游戏
			showGame(msg) {
				var v = this;
				v.pauseSound();
				v.picFlag = false;
				v.videoFlag = false;
				v.audioFlag = false;
				v.gameFlag = true;
				v.matter = msg;
			},

			//暂停音频和视频
			pauseSound() {
				var audio = document.getElementById("audio");
				//var video = document.getElementById("video");
				audio.pause();
				$('.audio-state').removeClass('play')
				//video.pause();
			},
			//切换消息类型
			toggleMsgtype(type) {
				this.msgType = type;
			},
			msgAdd() {
				var v = this;
				Indicator.open();
				if(v.msgType == '' && v.content == '') {
					Toast('内容不能为空');
					return false;
				}
				var params = {
					content: v.content,
					type: v.msgType,
					id: v.id
				}
				v.$api.post('live/sendmsg', params, function(r) {
					v.content = '';
					console.log(r)
					v.msglist.push(r);
					console.log(v.msglist)
					Indicator.close();
				});
			},
			//素材屏幕放大缩小
			switchScreen() {
				var v = this;
				v.commentScreenFlag = !v.commentScreenFlag;
				v.videoScreenFlag = !v.videoScreenFlag;
				v.screenFlag = !v.screenFlag;
				if(!v.commentScreenFlag) {
					$('.matter-wrapper').css('height', $(window).height())
				} else {
					$('.matter-wrapper').css('height', v.height);
				}
				if(v.matter) {
					if(v.matter.data.gtype == 4) {
						$('#matter-game').attr('src', v.matter.data.url)
					}
				}

			},

			//视频屏幕放大缩小
			videoScreen() {
				var v = this;
				v.matterScreenFlag = !v.matterScreenFlag;
				v.commentScreenFlag = !v.commentScreenFlag;
				v.screenFlag = !v.screenFlag;
				if(!v.commentScreenFlag) {
					$('.live-info-wrapper,.live-video-wrapper').css('height', $(window).height());
					v.playerOptions.height = $(window).height()
				} else {
					$('.live-info-wrapper').css('height', v.height)
					$('.live-video-wrapper').css('height', v.height)
					v.playerOptions.height = v.height;
					//v.playerOptions.autoplay = true
				}
			},
			focusInput() {
				setTimeout(function() {
					document.body.scrollTop = document.body.scrollHeight;
				}, 300);
			},
			shareConfig() {
				var v = this;
				var url = location.href.split('#')[0];
				v.$api.post('user/wxparams?url=' + encodeURIComponent(url), '', function(r) {
					wx.config({
						debug: false,
						appId: r.data.appId,
						timestamp: r.data.timestamp,
						nonceStr: r.data.nonceStr,
						signature: r.data.signature,
						jsApiList: [
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo'
						]
					});
					var shareData = {
						title: v.course.name,
						desc: v.course.target,
						link: location.href, // 分享链接
						imgUrl: v.course.subjectcourselist[0].url, // 分享图片，使用逗号,隔开
					};
					console.log(shareData)
					wx.ready(function() {
						wx.onMenuShareAppMessage(shareData);
						wx.onMenuShareTimeline(shareData);
						wx.onMenuShareQQ(shareData);
						wx.onMenuShareQZone(shareData);
					});
					wx.error(function(res) {
						alert(res.errMsg);
					});
				})
			}
		}

	}
</script>