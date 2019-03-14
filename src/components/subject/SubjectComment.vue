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
				commentCount: 0,
				degreeWidth: 0,
				needstar: false,
			}
		},
		created() {
			var v = this;
			Indicator.open();
			v.getCommentList();

		},
		mounted() {
			var v = this;
			v.$nextTick(function() {
				var mod = this.subject.degree % 1;
				var integer = Math.floor(this.subject.degree);
				var score;
				if(mod >= 0.5) {
					score = integer + 0.5;
				} else if(mod < 0.5) {
					score = integer;
				}
				var totalScoreWidth = $('#big-star').width() / 5 * score + "px";
				v.degreeWidth = totalScoreWidth;
			})
		},
		methods: {
			//获取公开课评价列表
			getCommentList() {
				var v = this;
				var params = {
					pageSize: v.pageSize,
					pageNum: v.pageNum,
				}
				v.$api.get('group/commentlist/' + v.id + '', params, function(r) {
					if(v.pageNum == 1) {
						v.commentList = [];
						Indicator.close();
					}
					v.commentList = r.data.commentlist;
					if(v.commentList.length == r.data.commenttimes) {
						v.allLoaded = true;
					}
					v.moreLoading = v.allLoaded;
					v.commentCount = r.data.commenttimes;
					v.$nextTick(function() {
						if(v.commentList.length>0){
							$('.item-comment-wrapper').each(function() {
								var index = $(this).index();
								var degree = v.commentList[index].degree;
								var mod = degree % 1;
								var integer = Math.floor(degree);
								var score;
								if(mod >= 0.5) {
									degree = integer + 0.5;
								} else if(mod < 0.5) {
									degree = integer;
								}
								$(this).find('.over').css('width', $(this).find('.img-star').width() / 5 * degree + 'px')
							})
						}
					})
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
			},
			textFilter(value, count) {
				if(value) {
					if(value.length > count) {
						value = value.substring(0, count) + "..." + '<span class="more">&nbsp;&nbsp;阅读更多</span>';

					}
				}
				return value;
			},
			moreComment(index) {
				$('.item-comment-wrapper').eq(index).find('.content').show();
				$('.item-comment-wrapper').eq(index).find('.cut-content').hide();
			},
			cutComment(index) {
				console.log($('.item-comment-wrapper').size())
				$('.item-comment-wrapper').eq(index).find('.content').hide();
				$('.item-comment-wrapper').eq(index).find('.cut-content').show();
			},
			scoreWidth(degree, index) {
				var width;
				this.$nextTick(function() {
					console.log($('.item-comment-wrapper').size());
					width = $('.item-comment-wrapper').eq(index).find('.img-star').width() / 5 * degree + "px";
					console.log(width);
				})
				return 'width:' + width;
			}
		},
		components:{
			scoreItem
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>