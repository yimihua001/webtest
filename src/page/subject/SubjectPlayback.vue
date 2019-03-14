<template>
	<div class="wrapper ">
		<div class="scroll-wrapper playback-wrapper" style="overflow: hidden;">
			<div class="matter-wrapper" v-bind:style="{height: height+'px'}" v-show="matterScreenFlag">
				<img src="" v-show="picFlag" class="matter-img" />
				<div class="video-wrapper" v-show="videoFlag">
					<p>暂不支持播放视频，请下载app进行观看</p>
					<!--					<video id="video" x-webkit-airplay="true" x5-playsinline="true" webkit-playsinline="true" playsinline="true" src=""></video>
-->
				</div>
				<div class="audio-wrapper" v-show="audioFlag">
					<audio id="audio" src=""></audio>
					<span class="pause audio-state" @click="playAudio()"></span>
				</div>
				<iframe v-if="gameFlag" :src="matter.data.url" width="100%" height="100%" frameborder="0"  id="matter-game"></iframe>
				<div class="btn-screen" @click="videoScreen":class="{quit:screenFlag == true}"></div>
			</div>
			<div class="playback-video-wrapper" v-show="playStatus && videoScreenFlag" v-bind:style="{height: height+'px'}">
				<video ref="playbackVideo" id="playbackVideo" x-webkit-airplay="true" x5-playsinline="true" webkit-playsinline="true" playsinline="true" :src="course.recordurl" v-bind:style="{height: height+'px'}">
				</video>
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
			</div>
			<div class="controls" ref="controls">
				<div id="play" class="btn-play">
					播放
				</div>
				<div class="time">{{voteTime}}</div>
				<div id="box">
					<div id="strip"></div>
					<div id="circular"></div>

				</div>

			</div>
		</div>
	</div>
</template>

<style lang='sass'>
	@import "../../../static/sass/pages/subject";
</style>

<script>
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	import wx from 'weixin-js-sdk'
	//IM组件
	export default {
		data() {
			return {
				course: JSON.parse(sessionStorage.getItem('subjectCourse')),
				id: this.$route.params.id,
				//id: '4028b88162e09fd60162e0b6e8a80005',
				height: parseInt($(window).width() / 1.7),
				msglist: [],
				msgIdList: [],
				picFlag: false,
				videoFlag: false,
				audioFlag: false,
				gameFlag: false,
				playStatus: true,
				matterScreenFlag: true,
				commentScreenFlag: true,
				videoScreenFlag: true,
				screenFlag: false,
				matter: {},
				voteTime: '00:00',
				events: {
					timer: '',
					flag: true,
					list: []
				},

			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			//Indicator.open();
		},
		mounted() {
			this.initControls();
			$('.comment-wrapper').css('height', $('.scroll-wrapper').height() - this.height * 2)

		},
		methods: {
			//获取回放事件
			playbackEvent() {
				var v = this;
				var params = {
					pageNum: 1,
					pageSize: 10,
					timelenstamp: parseInt(v.$refs.playbackVideo.currentTime) * 1000
				}
				params = v.$utils.objToString(params);
				v.$api.get('live/recordeventlist/' + v.id + '?' + params, '', function(r) {
					console.log(r);
					Indicator.close();
					v.events.flag = false;
					console.log(r.data.events)
					if(r.data.events) {
						v.showMsg(r.data.events)
					}
					//清空素材
					v.emptyMatterArea();
					v.events.list = r.data.records;

				});
			},
			//全局event事件监听
			eventListen() {
				var v = this;
				v.events.timer = setInterval(function() {
					console.log(v.events.list.length)
					if(v.events.list.length == 5) {
						if(!v.events.flag) {
							v.events.flag = true;
							v.playbackEvent();
						}

					}
					if(v.events.list.length != 0) {
						//console.log(v.events.list[0].timelenstamp +"<="+ parseInt(v.$refs.playbackVideo.currentTime) * 1000)
						if(v.events.list[0].timelenstamp <= parseInt(v.$refs.playbackVideo.currentTime) * 1000) {
							console.log(v.$utils.s_to_hs(parseInt(v.$refs.playbackVideo.currentTime)))
							v.showMsg(v.events.list[0])
							v.events.list.shift();
						}
					}
				}, 50);
			},
			//展示素材
			showMsg(msg) {
				var v = this;
				if(msg.opertype == 'groupmsg') { //直播消息类型
					console.log('直播消息')
					console.log(msg);
					v.showChatMsg(msg);
				} else if(msg.opertype == 'galleryopen') { //直播素材打开
					console.log('素材消息开启')
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
					v.emptyMatterArea();
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
				}
			},
			//清空素材展示区域
			emptyMatterArea() {
				var v = this;
				v.picFlag = false;
				v.videoFlag = false;
				v.audioFlag = false;
				v.gameFlag = false;
			},
			//展示聊天消息
			showChatMsg(msg) {
				var v = this;
				if(v.msgIdList.indexOf(msg.id) < 0) {
					v.msgIdList.push(msg.id);
					v.msglist.push(msg.data);
				}
				$('.comment-wrapper').animate({
					scrollTop: $('.bottom').offset().top
				}, 800);
			},

			//展示图片
			showPic(msg) {
				var v = this;
				v.pauseSound()
				v.picFlag = true;
				v.videoFlag = false;
				v.audioFlag = false;
				v.gameFlag = false;
				msg.data.url = msg.data.url + '&imageView2/1/w/' + $(window).width() + '/h/' + v.height
				v.matter = msg;
				$('.matter-img').attr('src', msg.data.url)
			},

			//展示视频
			showVideo(msg) {
				var v = this;
				v.pauseSound()
				//				var video = document.querySelector('#video');
				//				if(v.videoFlag) {
				//					//v.playVideo(msg)
				//				} else {
				v.videoFlag = true;
				v.picFlag = false;
				v.audioFlag = false;
				v.gameFlag = false;
				//					v.matter = msg;
				//					video.src = msg.data.url;
				//					console.log(video)
				//					v.playVideo(msg)
				//			}
			},

			//播放/暂停/拖动视频
			playVideo(msg) {
				var v = this;
				var video = document.querySelector('#video');
				video.currentTime = v.matter.data.timepoint;
				if(v.matter.opertype == "open" || v.matter.opertype == "seek") {
					if(v.matter.data.timepoint == v.matter.data.timelen) {
						video.pause();
					} else {
						alert(1)
						video.play();
					}
				} else if(v.matter.opertype == "pause") {
					video.pause();
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
				v.pauseSound()
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
				//video.pause();
			},
			//素材屏幕放大缩小
			switchScreen() {
				var v = this;
				v.commentScreenFlag = !v.commentScreenFlag;
				v.videoScreenFlag = !v.videoScreenFlag;
				v.screenFlag = !v.screenFlag;
				if(!v.commentScreenFlag) {
					$('.matter-wrapper').css('height', $(window).height() - $('.controls').height())
				} else {
					$('.matter-wrapper').css('height', v.height)
				}
				if(v.matter){
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
					$('.playback-video-wrapper').css('height', $(window).height() - $('.controls').height());
				} else {
					$('.playback-video-wrapper').css('height', v.height)
				}
			},
			initControls() {
				var v = this;
				var oAudio = document.querySelector('#playbackVideo');
				var oDiv1 = document.querySelector('#box');
				var oDiv2 = document.querySelector('#strip');
				var oDiv3 = document.querySelector('#circular');
				var oPlay = document.querySelector('#play');
				var timer = '';
				//获取直播事件
				v.playbackEvent();
				oPlay.onclick = function() {
					if(oAudio.paused) {
						oAudio.play();
						$('#play').addClass('btn-pause')
						oPlay.innerHTML = '暂停';
						v.eventListen() //监听events事件
						timer = setInterval(function() {
							console.log(oAudio.currentTime)
							playPlayBackVideo(oAudio.currentTime / oAudio.duration)
							v.voteTime = v.$utils.s_to_hs(parseInt(oAudio.currentTime))
						}, 100)
						//是否播放素材音频
						if(v.matter){
							if(v.matter.opertype == "open" || v.matter.opertype == "seek") {
								if(v.matter.data.gtype == 3){//音频
									var audio = document.getElementById("audio");
									audio.play();
									$('.audio-state').addClass('play')
								}
							}
						}
					} else {
						oAudio.pause();
						$('#play').removeClass('btn-pause')
						oPlay.innerHTML = '播放'
						clearInterval(timer)
						clearInterval(v.events.timer); //移除events监听事件
						//暂停素材音频
						if(v.matter){
							if(v.matter.data.gtype == 3){//音频
								var audio = document.getElementById("audio");
								audio.pause();
								$('.audio-state').removeClass('play')
							}
						}
					}

				}

				function playPlayBackVideo(percent) {
					//oDiv2.style.width = percent * 100 + '%';
					//	console.log(percent * (oDiv1.offsetWidth) )
					oDiv2.style.width = percent * (oDiv1.offsetWidth) + "px"
					oDiv3.style.left = percent * (oDiv1.offsetWidth) + "px"
				}

				oDiv3.addEventListener('touchstart', function(ev) {
					clearInterval(timer)
					clearInterval(v.events.timer); //移除events监听事件
					var oDiv1W = oDiv1.offsetWidth;
					var oldX = ev.targetTouches[0].clientX - oDiv3.offsetLeft;

					document.addEventListener('touchmove', fnMove, false)
					document.addEventListener('touchend', fnEnd, false)

					function fnMove(ev) {
						var x = ev.targetTouches[0].clientX - oldX;
						if(x >= oDiv1W) {
							x = oDiv1W;
						} else if(x <= 0) {
							x = 0;
						}
						oDiv3.style.left = (x - 5) + 'px';
						oDiv2.style.width = x + 'px';
					}

					function fnEnd(ev) {
						document.removeEventListener('touchend', fnEnd, false)
						document.removeEventListener('touchmove', fnMove, false)
						var newX = ev.changedTouches[0].clientX;
						var oDiv2W = oDiv2.offsetWidth;
						var oDuration = oDiv2W / oDiv1W;
						oAudio.currentTime = oDuration * oAudio.duration;
						//	console.log(oAudio.currentTime )
						//获取直播事件
						v.playbackEvent();
						v.eventListen() //监听events事件
						timer = setInterval(function() {
							playPlayBackVideo(oAudio.currentTime / oAudio.duration);
							v.voteTime = v.$utils.s_to_hs(parseInt(oAudio.currentTime))
						}, 100)
						if(oAudio.paused) {
							v.voteTime = v.$utils.s_to_hs(parseInt(oAudio.currentTime))
							clearInterval(timer)
							clearInterval(v.events.timer); //移除events监听事件
						}
					}
				}, false);
			}
		}

	}
</script>