<!-- 机构评价 -->
<template>
	<div class="suject-comment-wrapper">
		<div class="overall-score" v-if="needstar">
			<div class="score-star"><span class="img-star" id="big-star"><em class="over"  v-bind:style="{ width:degreeWidth}"></em></span><span class="score">{{subject.degree}}分</span></div>
			<span>{{commentCount}}人评价</span>
		</div>
		<div v-if="commentList.length != 0" v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
			<score-item :itemData="item" :isneedstar="needstar" class="item-comment-wrapper" v-for="(item,index) in commentList" :key="index">				
			</score-item>
		</div>
		<div class="loading-more" v-if="!queryLoading">
			<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
		</div>
		<div class="no-content" v-if="commentList.length == 0">没有内容！</div>
		<div class="submit-comment-wrapper">
			<input type="text" placeholder="请输入评论..." class="ui-input" v-model="text" />
			<button class="btns" @click="sendComment()"></button>
		</div>
	</div>
</template>
<script>
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	import scoreItem from "../../components/common/ScoreItem";
	export default {
		data() {
			return {
				id: this.$route.params.id,
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				commentList: [], //评论列表
				needstar: false, //评论列表
				commentCount: 0,
				degreeWidth: 0,
				text: '',
			}
		},		
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			this.getCommentList();
		},		
		methods: {
			//获取公开课评价列表
			getCommentList() {
				var v = this;
				var params = {
						pageSize: v.pageSize,
						pageNum: v.pageNum,
					}
				v.$api.get('depart/commentList/' + v.id + '', params, function(r) {
					if(v.pageNum == 1) {
						v.commentList = [];
						Indicator.close();
					}
					v.commentList = r.data.records;
					if(v.commentList.length == r.data.commenttimes) {
						v.allLoaded = true;
					}
					v.moreLoading = v.allLoaded;
					v.commentCount = r.data.commenttimes;
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

		},
		components:{
			scoreItem,
		}
	}
</script>

<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>