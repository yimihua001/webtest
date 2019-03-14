<template>
	<div class="wrapper">
		<navs></navs>
		<div class="scroll-wrapper ">
			<div class="top-news-swipe" v-if="topList.length != 0">
				<mt-swipe :auto="4000">
					<mt-swipe-item v-for="(item,index) in topList" :key="index"><img :src="photoFilter(item.logourl,width,0)" @click='detail(item.id)'></mt-swipe-item>
				</mt-swipe>
			</div>
			<ul class="news-list-wrapper" v-if="newsList.length != 0" v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
				<li v-for="(item,index) in newsList" :key="index" @click='detail(item.id)'>
					<div class="info">
						<h3>{{item.name}}</h3>
						<p>{{item.browsnum}}浏览<span>{{item.commentnum}}评论</span></p>
					</div>
					<img :src="photoFilter(item.logourl,100,75)" />
				</li>
			</ul>
			<div class="loading-more" v-if="!queryLoading">
				<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
			</div>
			<div class="no-content" v-if="moreLoading&&allLoaded && newsList.length == 0">没有内容！</div>
		</div>
	</div>
</template>
<script>
	import { Swipe, SwipeItem } from 'mint-ui';
	import { Indicator } from 'mint-ui';
	import Navs from '../../components/news/Navs'
	export default {
		data() {
			return {
				newsList: [],
				topList: [],
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				width: $(window).height(),
				menuid: '',
			}
		},
		// 在components字段中，包含导入的子组件
		components: {
			Navs
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			var v = this;

		},
		methods: {
			getNewsList(id) {
				var v = this;
				if(id) {
					v.menuid = id;
					v.pageNum = 1;
				}
				var params = {
					pageSize: v.pageSize,
					pageNum: v.pageNum,
				}
				v.$api.get('information/informationlist/' + v.menuid + '', params, function(r) {
					console.log(r);
					if(v.pageNum == 1) {
						v.newsList = [];
						Indicator.close();
						v.topList = r.data.toplist;
					}
					v.newsList = v.newsList.concat(r.data.page.records);
					if(v.newsList.length == r.data.total) {
						v.allLoaded = true;
					}
					v.moreLoading = v.allLoaded;
				})
			},
			detail(id) {
				this.$router.push({
					name: 'newsDetail',
					params: {
						id: id
					}
				})
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
					v.getNewsList();
				}, 500);
			}
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/news";
</style>