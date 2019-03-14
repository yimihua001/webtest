<template>
	<div class="preview-wrapper" @click="cancel">
		<video id="video" webkit-playsinline playsinline :src="url"></video>
		<mt-spinner type="snake" v-show="isLoadingShow" :src="loadingUrl" class="btn"></mt-spinner>
		<!-- <img v-on:click.stop="play(videourl)" id="playBtn" v-show="isPlayBtnShow" src="../../static/image/ic_music_play.png" alt="" class="btn"> -->
		<img v-on:click.stop="play()" id="playBtn" v-show="isPlayBtnShow" src="../../static/image/ic_music_play.png" alt="" class="btn">
	</div>
</template>
<script>
	export default {
		data() {
			return {
				isLoadingShow: false,
				isPlayBtnShow: true,
				reciveVideoUrl: '',
				loadingUrl: '../../static/image/loading.gif',
				url:''
			}
		},
		created() {
			//判断素材是否过期
			this.checkUrlPast(this.videourl)
		},
		methods: {
			show(videourl){
				this.url = videourl;
			},
			//  点击播放按钮播放视屏
			play:function(){
				this.isLoadingShow = true;
				this.isPlayBtnShow = false;
			 	var video = document.getElementById('video')
			 	 video.play()
           		this.isLoadingShow = false;
			},
			cancel() {
				this.$emit("on-cancel");
			},
			//判断素材是否过期
			checkUrlPast(url) {
				console.log(url);
				var v = this;
				var arr = url.split('&');
				var time = arr[arr.length - 1].split('=')[1];
				time = parseInt(time, 16) * 1000;
				var nowTime = Date.parse(new Date());
				console.log('过期时间：' + v.$utils.formatData(time,'second'))
				if(time < nowTime) {
					url = url.split('&')[0];
					v.complete = false;
					v.mediaurl(url);
				} else {
				  v.show(url);
				}
			},
			//获取新的url链接（防盗链）
			mediaurl(url) {
				var v = this;
				var params = {
					url: url,
				};
				v.$api.post('gallery/mediaurl', params, function(r) {
					v.show(r.data)
				})
			},
		},
		props: ['videourl'],

	}
</script>