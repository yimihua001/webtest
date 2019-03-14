<template>
	<div class="search-wrapper">
			<div class="icon-search" @click="search"></div>
			<input type="text" class="ui-input-search" v-model="searchtext" placeholder="搜索你想要了解的机构" />
			<div class="btn-search" @click="search">搜索</div>
	</div>

</template>
<script>
	// 导入要用到的子组件
	import { Indicator, InfiniteScroll } from 'mint-ui';
	export default {
		data() {
			return {
				searchtext:sessionStorage.getItem('searchDepart')
			}
		},
		props: ['cityname', 'citycode'],
		methods: {
			search(){
				var v = this;
				if(v.searchtext){
					sessionStorage.setItem('searchDepart', v.searchtext);
				}else{
					sessionStorage.setItem('searchDepart', '');
				}
				
				v.$router.push({
					path: "/"
				})
			}
		}
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/depart";
</style>