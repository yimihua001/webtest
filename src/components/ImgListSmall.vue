<template>
	<div>
		<ul class="list-img" v-if="!isHide">
			<li v-for="(item,index) in imglist" :type="item.type" :key="index">
			    <img  @click="previewImg(index)"  v-if="item.type==1 || item.type== null"  v-lazy="photoFilter(item.url,200,200)"/>
				<img  @click="playVideo(item.url)"  v-if="item.type==2" v-lazy="videoposterFilter(item.url,200,200)" />
			</li>
		</ul>
		<preview-img v-if="isHide" @on-cancel="cancel" :imgIndex="index" :imglist="imglist"></preview-img>
		<play-video v-if="isPlayHide" @on-cancel="cancelPlay" :videourl="videourl"></play-video>
	</div>	
</template>
<script>
	import PreviewImg from '../components/PreviewImg';
	import PlayVideo from '../components/PlayVideo'
	export default {
		data() {
			return {
				isHide: false,
				isPlayHide: false,
				index: '',
				videourl: '', //视频url
				defaultVideoImg: '../../static/image/videoPhoto.png'
			}
		},
		components: {
			PreviewImg,
			PlayVideo
		},
		methods: {
			previewImg(index) { //预览图片
				this.index = index;
				$('.main').removeClass('scroll-y');
				$('.product-detail-wrapper').removeClass('scroll-wrapper')
				this.isHide = true;
			},
			cancel() {
				this.isHide = false;
				$('.main').addClass('scroll-y');
				$('.product-detail-wrapper').addClass('scroll-wrapper')
			},
			cancelPlay() { //关闭视频播放
				this.isPlayHide = false;
				$('.main').addClass('scroll-y');
				$('.product-detail-wrapper').addClass('scroll-wrapper')

			},
			playVideo(url) {
				this.videourl = url;
				this.isPlayHide = true;
				$('.main').removeClass('scroll-y');
				$('.product-detail-wrapper').removeClass('scroll-wrapper')
			},
		},
		props: ['imglist'],
	}
</script>