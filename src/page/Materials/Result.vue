<template>
	<div class="scroll-wrapper media-wrapper">
		<preview-img v-if="isHide" @on-cancel="cancel" :bigurl="bigurl" :imgIndex="0" :imglist="''"></preview-img>
		<play-video v-if="isPlayHide" @on-cancel="cancelPlay" :videourl="videourl"></play-video>
		<ul v-if='list.length != 0' v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
			<li v-for='(item,index) in list' :key="index" v-if="gtype==1" class="pic-item">
				<img v-lazy="photoFilter(item.url,imgWidth,imgWidth)" alt="" v-if="item.gtype == 1" @click="previewImg(item.url)">
				<p>{{item.name}}</p>
			</li>
			<li v-for='(item,index) in list' :key="index" v-if="gtype==2" class="pic-item">
				<img v-lazy="videoposterFilter(item.url,imgWidth,imgWidth)" alt="" v-if="item.gtype == 2" @click="playVideo(item.url)">
				<p>{{item.name}}</p>
			</li>
			<li v-for='(item,index) in list' :key="index" v-if="gtype==3" class="audio-item">
				<div class="audio-img" v-if="item.gtype == 3" @click="playAudio(item.url,index)"></div>
				<p>{{item.name}}</p>
				<audio :src="item.url" controls="controls" preload hidden ref="audio"></audio>
			</li>
		</ul>
		<div class="loading-more" v-if="!queryLoading">
			<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
		</div>
		<div class="no-content" v-if="moreLoading&&allLoaded && list.length == 0">没有内容！</div>
	</div>

</template>
<script>
	// 导入要用到的子组件
	import { Indicator, InfiniteScroll } from 'mint-ui';
	import PreviewImg from '../../components/PreviewImg';
	import PlayVideo from '../../components/PlayVideo'
	export default {
		data() {
			return {
				list: [],
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				isHide: false,
				isPlayHide: false,
				bigurl: '',
				videourl: '', //视频url
				imgWidth:parseInt(document.body.clientWidth / 2)
			}
		},
		props: ['gtype', 'searchtext'],
		components: {
			PreviewImg,
			PlayVideo
		},
		created() {
			Indicator.open();
			this.listfree();
		},
		methods: {
			//搜索
			inputFocus() {
				var v = this;
				v.$router.push({
					name: "MaterialsSearch",
					params: {
						type: v.gtype
					}
				})
			},
			//导航切换
			tabToggle(index, type) {
				var v = this;
				v.list = [];
				v.pageNum = 1;
				v.activeIndex = index;
				v.gtype = type;
				v.allLoaded = false;
				v.moreLoading = true;
				v.queryLoading = false;
				v.listfree();
			},
			listfree() {
				var v = this;
				var params = {
					content: v.searchtext,
					pageSize: v.pageSize,
					pageNum: v.pageNum,
					typelist: [{
						'gtype': v.gtype
					}]
				};
				v.$api.post('gallery/listfree', params, function(r) {
					if(v.pageNum == 1) {
						Indicator.close();
						v.list = [];
					}
					v.list = v.list.concat(r.data.records);
					if(v.list.length == r.data.total) {
						v.allLoaded = true;
					}
					v.moreLoading = v.allLoaded;
				});
			},
			loadmore() {
				var v = this;
				if(v.allLoaded) {
					v.moreLoading = true;
					return;
				}
				if(v.queryLoading) {
					return;
				}
				v.moreLoading = !this.queryLoading;
				v.pageNum++;
				setTimeout(() => {
					v.listfree();
				}, 500);
			},
			//播放声音
			playAudio(url, index) {
				this.checkUrlPast(url, index)

			},
			playNewAudio(url, index) {
				var audio = $('.audio-item').eq(index).find('audio')[0]
				if(audio != null) {
					//检测播放是否已暂停.audio.paused 在播放器播放时返回false
					$('audio').each(function() {
						$(this)[0].pause(); //其他声音暂停
						$(this).parents(".audio-item").find('.audio-img').removeClass("audio-play");
					});
					if(audio.paused) {
						$(audio).parents(".audio-item").find('.audio-img').addClass("audio-play");
						audio.play(); // 是播放
						/*判断声音是否播放完成，播放完成之后执行回调函数*/
						audio.addEventListener('ended', function() {
							$(audio).parents(".audio-item").find('.audio-img').removeClass("audio-play");
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
			previewImg(url) { //预览图片
				this.bigurl = url;
				this.isHide = true;
				$('.media-wrapper').removeClass('scroll-wrapper');
				
			},
			cancel() {
				this.isHide = false;
				$('.media-wrapper').addClass('scroll-wrapper');
			},
			cancelPlay() { //关闭视频播放
				this.isPlayHide = false;
				$('.media-wrapper').addClass('scroll-wrapper');

			},
			playVideo(url) {
				this.videourl = url;
				this.isPlayHide = true;
				$('.media-wrapper').removeClass('scroll-wrapper');
			}
		},
		watch: {　　　　　　　　
			'gtype' () {
				var v = this;
				v.pageNum = 1;
				v.list = [];
				v.allLoaded = false;
				v.moreLoading = true;
				v.queryLoading = false;
				v.listfree();
			},
			'searchtext'() {
				var v = this;
				v.list = [];
				v.pageNum = 1;
				v.allLoaded = false;
				v.moreLoading = true;
				v.queryLoading = false;
				v.listfree();
			},
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/material";
</style>