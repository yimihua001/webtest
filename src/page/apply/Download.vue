<template>
	<div class="wrapper-swiper">
		<div class="top">
			<mt-swipe :auto="4000">
				<mt-swipe-item><img src="../../../static/image/apply/banner1.png" alt=""></mt-swipe-item>
				<mt-swipe-item><img src="../../../static/image/apply/banner2.png" alt=""></mt-swipe-item>
				<mt-swipe-item><img src="../../../static/image/apply/banner3.png" alt=""></mt-swipe-item>
				<mt-swipe-item><img src="../../../static/image/apply/banner4.png" alt=""></mt-swipe-item>
				<mt-swipe-item><img src="../../../static/image/apply/banner5.png" alt=""></mt-swipe-item>
			</mt-swipe>

		</div>
		<p>下载APP查看报名信息及进度</p>
		<footer class="footer">
			<span class="btn" @click="btnDownload">下载APP</span>
		</footer>

	</div>
</template>
<script>
	import { Swipe, SwipeItem } from 'mint-ui';

	export default {
		methods: {
			btnDownload() {
				window.location.href = this.$appDownloadUrl
			},
		},
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/apply";
</style>