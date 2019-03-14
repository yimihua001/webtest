<template>
		<ul class="news-navs-wrapper">
			<li v-for="(item,index) in menuList" :key="index"  @click="go(item.id,index)" v-bind:class="{active:index==subIndex}">{{item.menuname}}</li>
		</ul>

</template>
<style lang='sass'>
	@import "../../../static/sass/pages/news";
</style>
<script>
	// 导入要用到的子组件
	import { Indicator } from 'mint-ui';
	export default {
		data() {
			return {
				menuList:[],
				subIndex:0
			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			this.getMenuList();
		},
		methods: {
			getMenuList() {
				var v = this;
				var params = v.$utils.getTokenVerify()
				v.$api.get('information/menulist?'+ params, '', function(r) {
					v.menuList = r.data;
					v.$parent.getNewsList(v.menuList[0].id);
				});
			},
			go(id, index) {
				var v = this;
				Indicator.open();
				v.$parent.getNewsList(id);
				v.subIndex = index;

			},
		}
	}
</script>