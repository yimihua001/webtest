<template>
	<div class="wrapper">
		<div class="search-wrapper">
			<div class="icon-search"></div>
			<input type="text" class="ui-input-search" placeholder="搜索你想要的素材"  v-model="text" ref="input" />
			<div class="btn-search" @click="search()">搜索</div>
		</div>
		<result :gtype="gtype" :searchtext="searchtext"></result>
	</div>

</template>
<script>
	// 导入要用到的子组件
	import { Indicator, InfiniteScroll } from 'mint-ui';
	import Result from '../Materials/Result'
	export default {
		data() {
			return {
				list: [],
				gtype: this.$route.params.type,
				searchtext: '',
				text:''
			}
		},
		components: {
			Result
		},
		created() {
			Indicator.open();
		},
		mounted: function() {
			//this.$refs['input'].focus();
		},
		methods: {
			search() {
				var v = this;
				v.searchtext = v.text;
			},
			
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/material";
</style>

<!-- https://github.com/surmon-china/vue-awesome-swiper -->