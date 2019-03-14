<template>
	<div class="banner-swipe" v-if="bannerList.length != 0">
		<mt-swipe :auto="4000">
			<mt-swipe-item v-for="(item,index) in bannerList" :key="index"><img :src="photoFilter(item.advertpic,width,0)" @click='detail(item.advertaddress)'></mt-swipe-item>
		</mt-swipe>
	</div>
</template>
<script>
	import { Swipe, SwipeItem } from 'mint-ui';
	export default {
		data() {
			return {
				bannerList: [],
				width:$(window).height()
			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			var v = this;
            v.getBannerList();
		},
		methods: {
			getBannerList() {
				var v = this;
				v.$api.get('advert/list/', '', function(r) {
					v.bannerList = r.data;
				})
			},
			detail(url){
				window.location.href=url
			}
		}
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/depart";
</style>