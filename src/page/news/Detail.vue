<template>
	<div class="wrapper">
		<div class="scroll-wrapper">
			<div class="news-detail-wrapper" v-if="!commentFlag">
				<h2 class="title">{{news.name}}</h2>
				<h6 class="time">发布时间：{{timefilter(news.createdatetime)}}</h6>
				<div v-html="news.content"></div>
			</div>
			<Comment :id="id" ref="comment"></Comment>
		</div>
		<footer class="footer news-footer">
			<input type="text" class="ui-input" placeholder="请输入评论" v-model="content" @focus="focusInput" />
			<button @click="addComment()">发布</button>
			<!--<div class="icon">
				<span @click="showComment()">
					<img src="../../../static/image/news/pinglun.png"/>
					<i>{{commentnum}}</i>
				</span>
			</div>-->
		</footer>
		<Share ref="share" :title="news.name" :desc="news.content" imgUrl=""></Share>
	</div>
</template>
<script>
	// 导入要用到的子组件
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	// 分享组件
	import Share from '../../common/Share'

	// 评论组件
	import Comment from '../../components/news/comment'
	export default {
		data() {
			return {
				id: this.$route.params.id,
				news: '',
				content: '',
				commentnum: 0
			}
		},
		components: {
			Share,
			Comment
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			var v = this;
			v.getNewsDetail()
		},
		updated() {
			Indicator.close();
		},
		methods: {
			//获取内容详情
			getNewsDetail() {
				var v = this;
				v.$api.get('information/info/' + v.id, '', function(r) {
					v.news = r.data;
				});
			},
			timefilter(value) {
				var v = this;
				value = v.$utils.formatData(value, 'second');
				return value;
			},
//			//展示评论
//			showComment() {
//				var v = this;
//				v.commentFlag = !v.commentFlag;
//			},
			//添加评论
			addComment() {
				var v = this;
				if(v.content == '') {
					Toast('请输入评论')
					return false;
				}
				Indicator.open();
				var params = {
					id: v.id,
					content: v.content,
				}
				v.$api.post('information/addcomment', params, function(r) {
					v.content = '';
					v.commentnum++;
					v.$refs.comment.getCommentList();
					Indicator.close();
				}, function(r) {
					Indicator.close();
					Toast(r.msg);
				});
			},
			focusInput() {
				setTimeout(function() {
					document.body.scrollTop = document.body.scrollHeight;
				}, 300);
			},
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/news";
</style>