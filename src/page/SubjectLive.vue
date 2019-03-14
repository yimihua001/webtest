<template>
	<div class="wrapper">
		<div class="scroll-wrapper" style="overflow: hidden;">
			<div class="matter-wrapper" v-bind:style="{height: height+'px'}">
				<!--<img :src="matter.url" v-if="picFlag" />-->
<!--				<img src="http://media.molyfun.com/helloimg/gallery/20170509/20170509161741X07xZ6Zj.jpg?sign=b3d24cf3d93b7c98c85a2cc36c8c9c3f&t=5abcb73c&imageView2/2/w/375/h/220" />
-->				<!--<video id="video" webkit-playsinline playsinline :src="matter.url" v-if="videoFlag" controls=""></video>-->
				<!--<video id="video" webkit-playsinline playsinline src="http://media.molyfun.com/helloimg/gallery/20161027/20161027111714369vDs8j.mp4?sign=2b6ca9eebbf9fcae327501ed5e24110e&t=5abcb7ac" controls=""></video>
				<div class="audio-wrapper" v-if="audioFlag">
					<audio id="audio" :src="matter.url" controls=""></audio>
					<span class="pause play"></span>
				</div>-->
				<div class="audio-wrapper">
					<audio id="audio" src="http://media.molyfun.com/helloimg/gallery/20161026/20161026161311MHWfzJKe.mp3?sign=d4319a42aaa9fa9513605c0411d04c53&t=5abcb851" controls=""></audio>
					<span class="pause"></span>
				</div>
			</div>
			<div class="video-wrapper" v-bind:style="{height: height+'px'}"></div>
			<div class="comment-wrapper">
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
				<div class="btn-msg-type" v-if="msgType == 'msg'" @click="toggleMsgtype('ques')">提问</div>
				<div class="btn-msg-type" v-if="msgType == 'ques'" @click="toggleMsgtype('msg')">消息</div>
			</div>
		</div>
		<div class="submit-wrapper">
			<input type="text" placeholder="请输入聊天内容..." class="ui-input" v-model="content" v-if="msgType == 'msg'" />
			<input type="text" placeholder="请输入提问内容（最多三条）..." class="ui-input" v-model="content" v-if="msgType == 'ques'" />
			<button class="send" @click="msgAdd()"></button>
		</div>
		<WebIm ref="webim" @showMsg='showMsg'></WebIm>
	</div>

</template>
<style lang='sass'>
	@import "../../static/sass/pages/subject";
</style>
<script>
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	import wx from 'weixin-js-sdk'
	//IM组件
	import WebIm from '../common/WebIm'
	export default {
		data() {
			return {
				//id: this.$route.params.id,
				id: '4028b881628f36ea01629034dd6b0021',
				height: $(window).width() / 1.7,
				msgType: 'msg',
				content: '',
				msglist: [],
				picFlag:false,
				videoFlag:false,
				audioFlag:false,
				matter:'',
			}
		},
		components: {
			WebIm
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			//进入直播间
			this.enterRoom();
			console.log($(window).width())
		},
		mounted() {
			$('.comment-wrapper').css('height', $('.scroll-wrapper').height() - this.height * 2)
		},
		methods: {
			//进入直播间
			enterRoom(){
				var v = this;
				v.$api.post('live/userenter?id='+v.id, '', function(r) {
					console.log(r);
					Indicator.close();
					var msg = {'username':'系统公告','content':r.data.tips,'usertype':3,'type':'notice'}
					v.msglist.push(msg);
				});
			},
			showMsg(msg) {
				var v = this;
				if(msg.eventtype == 'msg' && msg.opertype == 'send') { //直播消息类型
					console.log('直播消息')
					console.log(msg.data);
					v.showChatMsg(msg.data);
				} else if(msg.eventtype == 'gallery' && msg.opertype == 'open') { //直播素材打开
					console.log('素材消息开启')
					console.log(msg.data.gtype +"=="+ 3 +"&&"+ msg.data.timepoint +"!="+ 0)
					if(msg.data.gtype == 1) { //图片
						v.showPic(msg.data)
					} else if(msg.data.gtype == 2 && msg.data.timepoint == 0) { //视频(进度为0)
						v.showVideo(msg.data)
					} else if(msg.data.gtype == 2 && msg.data.timepoint != 0) { //视频(进度不为0)
						v.playTimeVideo(msg.data.timepoint);
					} else if(msg.data.gtype == 3 && msg.data.timepoint == 0) { //音频
						v.showAudio(msg.data)
					} else if(msg.data.gtype == 3 && msg.data.timepoint != 0) {//音频
						playTimeAudio(msg.data.timepoint)
					} else if(msg.data.gtype == 4) { //游戏
						v.showGame(msg.data);
					}
				} else if(msg.eventtype == 'gallery' && msg.opertype == 'close') { //直播素材关闭
					console.log('素材消息关闭')
					removeGallery(msg.data);
				} else if(msg.eventtype == 'gallery' && msg.opertype == 'seek') { //直播素材拖进度
					if(msg.data.gtype == 2) { //视频拖进度
						console.log('视频进度');
						v.playTimeVideo(msg.data.timepoint);
					} else if(msg.data.gtype == 3) { //音频拖进度
						v.playTimeAudio(msg.data.timepoint)
					}
				} else if(msg.eventtype == 'gallery' && msg.opertype == 'pause') { //直播素材暂停
					if(msg.data.gtype == 2) { //视频暂停
						console.log('视频进度');
						v.pauseVideo(msg.data.timepoint);
					} else if(msg.data.gtype == 3) { //音频暂停
						v.pauseAudio(msg.data.timepoint)
					}
				}
			},
			//展示聊天消息
			showChatMsg(msg){
				var v = this;
				v.msglist.push(msg);
				if(v.msglist.length>200){
					splice.splice(0,10);
				}
			},
			
			//展示图片
			showPic(msg){
				var v = this;
				v.picFlag = true;
				v.matter.url = v.matter.url+'&imageView2/1/w/'+$(window).width()+'/h/'+height
				v.matter = msg;
			},
			
			//展示视频
			showVideo(msg){
				var v = this;
				v.videoFlag = true;
				v.matter = msg;
				
			},
			
			//展示音频
			showAudio(msg){
				var v = this;
				v.audioFlag = true;
				v.matter = msg;
			},
			//打开游戏
			showGame(msg) {
				$url = msg.url;
				$type = msg.gtype;
				$('#live-matter').empty().html('<iframe src="' + $url + '" width="100%"  height="100%" frameborder="0" id="matterIframe"></iframe>');
			}
			
			//指定时间播放视频
			playTimeVideo(){
				
			}
			
			//指定时间播放音频
			playTimeAudio(){
				
			}
			
			//视频暂停
			pauseVideo(){
				
			}
			
			//音频暂停
			pauseAudio(){
				
			}
			
			//切换消息类型
			toggleMsgtype(type) {
				this.msgType = type;
			},
			msgAdd() {
				var v = this;
				console.log(1);
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
				});
			}
		}
	}
</script>