<template>
	<div class="wrapper">
		<div class="consult-wrapper" id="js-list">
			<div class="top" @click='goupdate()'>
				资料上传({{docNumberStr}})
			</div>
			<div class="scroll-wrapper pading-bottom" @click="hideDialog()">
				<mt-loadmore :top-method="loadTop" :top-all-loaded="allLoaded" ref="loadmore">
					<div class="webim-msg-container rel" v-for="(item,index) in list" :key="index">
						<p class="time" v-if="item.time!=''"><span>{{item.time}}</span></p>
						<div class="rel right fr" v-if="item.userid==userid && item.type!=6">
							<div class="webim-avatar-icon right small fr">
								<img class="w100" :src="item.headimgurl" onerror="this.onerror=null; this.src='../../static/image/moren.png';" />
							</div>
							<div class="right box fr">
								<div class="webim-msg-value">
									<div class="picture" v-if="item.type==1" @click="previewImg(item.url)">
										<img class="webim-msg-img" v-lazy="photoFilter(item.url,0,200)" onerror="this.onerror=null; this.src='../../static/image/dafult-img.png';" />
									</div>
									<div class="video" v-if="item.type==2" @click="playVideo(item.url)">
										<img class="webim-msg-img" v-lazy="videoposterFilter(item.url,0,200)" onerror="this.onerror=null; this.src='../../static/image/dafult-img.png';" />
									</div>
									<div class="webim-audio-msg" v-if="item.type==3" v-bind:style="item.videoStyle" @click="playAudio(item.url,index)">
										<span>{{item.timelen}}''</span>
										<audio :src="item.url" controls="controls" preload hidden ref="audio"></audio>
									</div>
									<pre v-if="item.type==4" v-html="item.content"></pre>
								</div>
							</div>
						</div>
						<div class="rel left fl" v-if="item.userid!=userid && item.type!=6">
							<div class="webim-avatar-icon left small fl">
								<img class="w100" :src="item.headimgurl" onerror="this.onerror=null; this.src='../../static/image/moren.png';" />
							</div>
							<div class="left box fl">
								<div class="webim-msg-value">
									<div class="picture" v-if="item.type==1" @click="previewImg(item.url)">
										<img class="webim-msg-img" v-lazy="photoFilter(item.url,0,200)" onerror="this.onerror=null; this.src='../../static/image/dafult-img.png';" />
									</div>
									<div class="video" v-if="item.type==2" @click="playVideo(item.url)">
										<img class="webim-msg-img" v-lazy="videoposterFilter(item.url,0,200)" onerror="this.onerror=null; this.src='../../static/image/dafult-img.png';" />
									</div>
									<div class="webim-audio-msg" v-if="item.type==3" v-bind:style="item.videoStyle" @click="playAudio(item.url,index)">
										<span>{{item.timelen}}</span>
										<audio :src="item.url" controls="controls" preload hidden ref="audio"></audio>
									</div>
									<pre v-if="item.type==4" v-html="item.content"></pre>
									<div class="webim-msg-product" v-if="item.type==5" @click="getProductDetail(item.extendfield1)">
										<h4 class="ellipsis_">{{item.extendfield2}}</h4>
										<p><span class="sale">学习人数{{item.extendfield5}}人</span><span class="stock">剩余{{item.extendfield6}}人</span></p>
										<div class="bottom">
											<div>
												<span class="price">￥{{item.extendfield4}}</span>
												<span class="orgprice">￥{{item.extendfield4}}</span>
											</div>
											<button>购买</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="consult-praise" v-if="item.type==6">
							<p v-if="item.extendfield1 != -1">本次计划定制已完成</p>

							<ul class="answer" v-if="item.extendfield1 == 1">
								<li>满意</li>
							</ul>
							<ul class="answer" v-if="item.extendfield1 == 2">
								<li>一般</li>
							</ul>
							<ul class="answer" v-if="item.extendfield1 == 3">
								<li>不满意</li>
							</ul>
							<p v-if="item.extendfield1 == -1">本次计划定制已完成，请对该老师的服务做一评价！</p>
							<ul class="answer" v-if="item.extendfield1 == -1">
								<li @click="eval(1,item.id)">满意</li>
								<li @click="eval(2,item.id)">一般</li>
								<li @click="eval(3,item.id)">不满意</li>
							</ul>
						</div>
					</div>
				</mt-loadmore>
			</div>
			<div class="im-footer">
				<div class="submit-wrapper">
					<span class="face" @click="showEmotionDialog()"></span>
					<input type="text" placeholder="请输入聊天内容..." class="ui-input" v-model="content" />
					<div class="upload-wrapper" id="container" @click="hideDialog()">
						<span id="pickfiles"></span>
					</div>
					<button class="send" @click="msgAdd(4,'')"></button>
				</div>
				<div class="emoji-list wl_faces_main">
					<ul id="emotionUL">
					</ul>
				</div>
			</div>

		</div>
		<upload ref="upload" @getUrl = "qiuniuDealImg"></upload>
		<WebIm ref="webim" @showMsg = 'showMsg' type="consult"></WebIm>
		<preview-img v-if="isHide" @on-cancel="cancel" :bigurl="bigurl" :imgIndex="0" :imglist="''"></preview-img>
		<play-video v-if="isPlayHide" @on-cancel="cancelPlay" :videourl="videourl" :posterurl="posterurl"></play-video>
	</div>
</template>
<style lang='sass'>
	@import "../../static/sass/pages/consult";
</style>
<script>
	import { Toast, Indicator } from 'mint-ui'
	import PreviewImg from '../components/PreviewImg';
	import PlayVideo from '../components/PlayVideo'
	// 上传组件
	import Upload from '../common/Upload'
	//IM组件
	import WebIm from '../common/WebIm'
	export default {
		data() {
			return {
				content: '',
				customplanid: this.$route.params.id,
				pageNum: '1',
				pageSize: '10',
				type: '',
				allLoaded: false,
				list: [],
				degree: '',
				docNumberStr: '0/0', //资料计数
				userid: localStorage.getItem('userid'),
				imgroupid: localStorage.getItem('imgroupid'),
				isEval: 0, //是否评价
				emotionFlag: false, //表情dialog是否显示
				uploadFlag: false, //上传按钮是否显示
				isHide: false,
				isPlayHide: false,
				bigurl: '',
				videourl: '', //视频url
				posterurl: '', //视频封面
			}
		},
		// 在components字段中，包含导入的子组件
		components: {
			Upload,
			PreviewImg,
			PlayVideo,
			WebIm
		},
		created() {
			var v = this;
			//判断群组id是否存在，不存在调回首页
			if(!v.imgroupid) {
				v.$router.push({
					name: "/"
				})
			}
			Indicator.open();
			v.msglist();
			v.docnumber();
		},
		mounted() {
			var v = this;
			v.$refs.upload.getUploadToken();
		},
		methods: {
			//七牛上传token已经获取到
			qiniuReady(){
				var v = this;
				v.$refs.upload.qiniuUploader('pickfiles', 'container', 'im', 1, ''); //本地图片和视频
			},
			//获取消息记录列表
			msglist() {
				var v = this;
				var params = 'pageNum=' + v.pageNum + '&pageSize=' + v.pageSize;
				v.$api.get('custom/msgList/' + v.customplanid + '?' + params, '', function(r) {
					Indicator.close();
					var records = r.data.records;
					if(records.length == 0) {
						v.allLoaded = true;
					}
					for(var i = 0; i < records.length; i++) {
						records[i].content = WebImEmoji.parseEmoji(WebImEmoji.encode(records[i].content).replace(/\n/mg, ''));
						if(records[i].type == 3) {
							records[i].videoStyle = {
								width: records[i].timelen * 25 + "px",
							};
						}
						if(i == 0) {
							if(v.list.length == 0) {
								var dateDiff = v.$utils.getDateDiff(records[i].createdatetime, new Date(), 'minute');
							} else {
								var dateDiff = v.$utils.getDateDiff(records[i].createdatetime, v.list[i].createdatetime, 'minute');
							}
						} else {
							var dateDiff = v.$utils.getDateDiff(records[i].createdatetime, records[i - 1].createdatetime, 'minute');
						}
						if(dateDiff >= 5) { //两个时间间隔5分钟显示时间
							records[i].time = records[i].createdatetime
						} else {
							records[i].time = '';
						}
						if(records[i].time != '') {
							if(v.$utils.formatData(records[i].time, 'day') != v.$utils.formatData(new Date(), 'day')) { //判断显示full时间还是显示时分
								records[i].time = v.$utils.formatData(records[i].time, 'minute')
							} else {
								records[i].time = v.$utils.formatData(records[i].time, 'minute').split(' ')[1];
							}
						}
					}
					records = records.concat(v.list);
					v.list = records;
					if(v.list.length == r.data.total && v.list.length != 0) {
						v.list[0].time = v.list[0].createdatetime;
						if(v.$utils.getDateDiff(v.list[0].time, new Date(), 'day') > 1) { //判断显示full时间还是显示时分
							v.list[0].time = v.$utils.formatData(v.list[0].time, 'minute')
						} else {
							v.list[0].time = v.$utils.formatData(v.list[0].time, 'minute').split(' ')[1];
						}
					}
					if(v.list.length != 0) {
						v.$refs.loadmore.onTopLoaded(); // 固定方法，查询完要调用一次，用于重新定位 
					}
				});
			},

			//获取资料计数
			docnumber() {
				var v = this;
				v.$api.get('custom/docNum/' + v.customplanid, '', function(r) {
					v.docNumberStr = r.data;
				});
			},
			//咨询评价
			eval(degree, id) {
				Indicator.open();
				var v = this;
				var params = {
					commentid: id,
					degree: degree,
				};
				var params = v.$utils.objToString(params);
				v.$api.post('custom/eval/' + v.customplanid + '?' + params, '', function(r) {
					Indicator.close();
					v.list = [];
					v.pageNum = 1;
					v.isEval = 1;
					v.msglist();
					$('.im-footer').remove();
				});
			},
			//添加消息
			msgAdd(type, url) {
				var v = this;
				if(type == 4 && v.content == '') {
					Toast('内容不能为空');
					return false;
				}
				var content = v.$utils.utf16toEntities(v.content);
				v.content = '';
				if(v.list.length == 0) {
					var time = v.$utils.formatData(new Date(), 'minute').split(' ')[1];
				} else {
					var dateDiff = v.$utils.getDateDiff(new Date(), v.list[v.list.length - 1].createdatetime, 'minute');
					if(dateDiff >= 5) {
						var time = v.$utils.formatData(new Date(), 'minute').split(' ')[1];
					} else {
						var time = '';
					}
				}
				var msg = {
					content: WebImEmoji.parseEmoji(WebImEmoji.encode(content).replace(/\n/mg, '')),
					type: type,
					customplanid: v.customplanid,
					url: url,
					userid: v.userid,
					createdatetime: new Date(),
					time: time,
					username: localStorage.getItem('username'),
					headimgurl: localStorage.getItem('headimgurl'),
				}
				//v.list.push(msg);
				var params = {
					content: WebImEmoji.encode(content),
					type: type,
					customplanid: v.customplanid,
					url: url
				}
				v.$api.post('custom/msgAddFull', params, function(r) {
					v.content = '';
					var div = document.getElementById('js-list');
					div.scrollTop = $('#js-list').height() + 20;
				}, function(r) {
					Toast(r.msg);
				});
			},
			goupdate() {
				var v = this;
				v.$router.push({
					name: "update",
					params: {
						id: v.customplanid
					}
				})
				localStorage.setItem('isEval', v.isEval)
			},
			getProductDetail(id) {
				this.$router.push({
					path: '/product/detail/' + id
				})
			},
			showMsg(msg) {
				var v = this;
				var dateDiff = v.$utils.getDateDiff(msg.createdatetime, v.list[v.list.length - 1].createdatetime, 'minute');
				if(dateDiff >= 5) {
					msg.time = v.$utils.formatData(msg.createdatetime, 'minute').split(' ')[1];
				} else {
					msg.time = '';
				}
				msg.content = decodeURIComponent(msg.content);
				msg.content = WebImEmoji.parseEmoji(WebImEmoji.encode(msg.content).replace(/\n/mg, '').replace(/&lt;/g, '<'));
				if(msg.type == 3) {
					msg.videoStyle = {
						width: msg.timelen * 25 + "px",
					};
				} else if(msg.type == 5) {
					msg.extendfield2 = decodeURIComponent(msg.extendfield2);
					msg.extendfield2 = WebImEmoji.parseEmoji(WebImEmoji.encode(msg.extendfield2).replace(/\n/mg, '').replace(/&lt;/g, '<'));
				}
				v.list.push(msg)
				var div = document.getElementById('js-list');
				div.scrollTop = $('#js-list').height() + 20;
			},
			//打开表情窗体
			showEmotionDialog() {
				var v = this;
				if(v.emotionFlag) {
					$('.wl_faces_main').css({
						"display": "block"
					});
					return;
				}
				$('.zxdetails .main .container').css({
					'height': '62%',
					'padding-bottom': '0'
				});
				v.emotionFlag = true;
				var data = v.$refs.webim.webImEmoji.map;
				var path = v.$refs.webim.webImEmoji.path;
				for(var index in data) {
					var emotions = $('<img>').attr({
						"id": index,
						"src": path + data[index],
						"style": "cursor:pointer;"
					}).click(function() {
						v.selectEmotionImg(this);
					});
					$('<li>').append(emotions).appendTo($('#emotionUL'));
				}
				$('.wl_faces_main').css({
					"display": "block"
				});
			},
			//关闭表情/上传窗体
			hideDialog() {
				var v = this;
				$('.wl_faces_main').css({
					"display": "none"
				});
				$('.zxdetails .main .container').css({
					'height': '100%',
					'padding-bottom': '3.33333rem'
				});
				v.emotionFlag = false;
				v.uploadFlag = false;
				$('.wl_faces_main').css({
					"display": "none"
				});

				$('#emotionUL').html('');
			},
			//选中表情
			selectEmotionImg(selImg) {
				var v = this;
				v.content = v.content + selImg.id;
				//txt.focus();
			},
			//上传图片/视频后处理图片
			qiuniuDealImg(filename, url, fileType, uploadName) { //filetype=1图片，2视频，3文件
				this.msgAdd(fileType, url);
				Indicator.close()

			},
			loadTop() {
				var v = this;
				//if(!v.isfinish) {
				setTimeout(() => {
					v.pageNum++;
					v.msglist();
				}, 1000);
				//}
			},
			previewImg(url) { //预览图片
				this.bigurl = url;
				this.isHide = true;
			},
			cancel() {
				this.isHide = false;
			},
			cancelPlay() { //关闭视频播放
				this.isPlayHide = false;
			},
			//播放视频
			playVideo(url, cover) {
				this.videourl = url;
				this.isPlayHide = true;
			},
			//播放声音
			playAudio(url, index) {
				this.checkUrlPast(url, index)

			},
			playNewAudio(url, index) {
				var audio = $('.webim-msg-container').eq(index).find('audio')[0]
				//				var audioArry = document.getElementsByTagName('audio');
				//				var audio = audioArry[index];
				if(audio != null) {
					//检测播放是否已暂停.audio.paused 在播放器播放时返回false
					$('audio').each(function() {
						$(this)[0].pause(); //其他声音暂停
						$(this).parents(".webim-audio-msg").removeClass("webim-audio-msg-current");
					});
					if(audio.paused) {
						$(audio).parents(".webim-audio-msg").addClass("webim-audio-msg-current");
						audio.play(); // 是播放
						/*判断声音是否播放完成，播放完成之后执行回调函数*/
						audio.addEventListener('ended', function() {
							$(audio).parents(".webim-audio-msg").removeClass("webim-audio-msg-current");
						}, false);
					}
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
			//获取新的url链接（防盗链）
			mediaurl(url, index) {
				var v = this;
				var params = {
					url: url,
				};
				v.$api.post('gallery/mediaurl', params, function(r) {
					v.playNewAudio(r.data, index)
				})
			},
		}

	}
</script>