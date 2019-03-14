<template>
	<div class="wrapper  pading-bottom">
		<div class="comment-wrapper scroll-wrapper">
			<ul v-if="commentList.length != 0" v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
				<li class="item-wrapper-comment" v-for="(item,index) in commentList" :key="index">
					<div class="top-wrapper">
						<div class="img-wrapper">
							<img class="item-img" src="../../static/image/moren.png" />
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
		<div class="submit-comment-wrapper">
			<input type="text" placeholder="请输入评论..." class="ui-input" v-model="text" />
			<button class="btn" @click="sendComment()"></button>
		</div>
	</div>

</template>
<style lang='sass'>
	@import "../../static/sass/pages/depart";
</style>
<script>
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	export default {
		data() {
			return {
				id: this.$route.params.id,
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				text: '',
				commentList: [] //评论列表
			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			this.getCommentList();

		},
		methods: {
			sendComment() {
				var v = this;
				//发送评论
				var params = {
					content: v.$utils.utf16toEntities(v.text),
					departid: v.id
				}
				var comment = {
					content: v.text,
					createdatetime: new Date()
				}
				v.commentList.unshift(comment);
				v.text = '';
				v.$api.post('/depart/adddepartcommentfull', params, function(r) {
					//v.loadmore();
					//v.getCommentList();
					Toast('发送成功');
					if(v.commentList.length != 0) {
						v.loading = false;
					}
				}, function(r) {
					v.text = comment.content;
					v.commentList.splice(0, 1);
					Toast(r.msg);
				})
			},

			getCommentList() { //获取评论列表
				var v = this;
				var params = {
					pageSize: v.pageSize,
					pageNum: v.page,
				}
				v.$api.get('depart/commentList/' + v.id + '', params, function(r) {
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
			},
			timefilter(value) {
				var v = this;
				value = v.$utils.formatData(value, 'minute');
				return value;
			}
		}
	}
</script>