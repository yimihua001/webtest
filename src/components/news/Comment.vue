<template>
		<div class="news-comment-wrapper pading-bottom" >
			<h4 class="title">留言</h4>
			<ul v-if="commentList.length != 0" v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
				<li class="item" v-for="(item,index) in commentList" :key="index">
					<div class="top-wrapper">
						<div class="img-wrapper">
							<img class="item-img" src="../../../static/image/moren.png" />
						</div>
						<div class="right">
							<h4>游客</h4>
							<h6>{{timefilter(item.createdatetime)}}</h6>
						</div>
					</div>
					<p>{{item.content}}</p>
				</li>
			</ul>
			<div class="loading-more" v-if="!queryLoading">
				<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
			</div>
			<div class="no-content" v-if="moreLoading&&allLoaded && commentList.length == 0">没有内容！</div>
		</div>
</template>
<script>
	// 导入要用到的子组件
	import { Indicator,Toast,InfiniteScroll } from 'mint-ui';
	export default {
		data() {
			return {
				commentList:[],
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
			}
		},
		props:['id'],
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			var v = this;
			v.getCommentList()
		},
		updated (){
			Indicator.close();
		},
		methods: {
			//获取评论列表
			getCommentList(){
				var v = this;
				var params = {
					pageSize: v.pageSize,
					pageNum: v.pageNum,
				}
				v.$api.get('information/commentlist/' + v.id + '', params, function(r) {
					if(v.pageNum == 1) {
						v.commentList = [];
						Indicator.close();
					}
					v.commentList = v.commentList.concat(r.data.records);
					if(v.commentList.length == r.data.total) {
						v.allLoaded = true;
					}
					console.log(v.commentList);
					v.moreLoading = v.allLoaded;
				})
			},
			timefilter(value) {
				var v = this;
				value = v.$utils.formatData(value, 'second');
				return value;
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
					v.getCommentList();
				}, 500);
			}
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/news";
</style>