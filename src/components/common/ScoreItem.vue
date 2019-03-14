<!-- 评分组件 适用于机构评分、公开课评分、班级课评分等页面 -->
<template>
	<div>
		<div class="top-wrapper">
			<div class="img-wrapper">
				<img class="item-img" src="../../../static/image/username-default.png" />
			</div>
			<div class="right ellipsis_">
				<h4 class="ellipsis_">{{itemData.commentusername || "游客"}}</h4>
				<h5 class="time">{{timefilter(itemData.createdatetime)}}</h5>
			</div>
			<div class="img-star" v-if="isneedstar">
				<em class="over" v-bind:style="{ width:itemData.starWidth}"></em>
			</div>
		</div>
		<p v-html="textFilter(itemData.content,40)" @click="moreComment(index)" class="cut-content"></p>
		<p class="content">
			{{itemData.content}}
			<span @click.stop = "toggleText($event)" class="showmore" v-if="needShowMore(itemData.skills)">{{showtext}}</span>
		</p>
	</div>
</template>
<script>
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	export default {
		props: {
			itemData: {
				type: [Object, Array]
			},
			isneedstar: ""
		},
		data() {
			return {				
				degreeWidth: 0,
				textlimit:50,
				showtext:"查看更多"
			}
		},		
		// 在组件创建完成时，执行的钩子函数
		created() {
			var v = this;
		},
		mounted() {
			var v = this;
			v.$nextTick(function() {
				var mod = this.itemData.degree % 1;
				var integer = Math.floor(this.itemData.degree);
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
//			moreComment(index) {
//				$('.item-comment-wrapper').eq(index).find('.content').show();
//				$('.item-comment-wrapper').eq(index).find('.cut-content').hide();
//			},
//			cutComment(index) {
//				console.log($('.item-comment-wrapper').size())
//				$('.item-comment-wrapper').eq(index).find('.content').hide();
//				$('.item-comment-wrapper').eq(index).find('.cut-content').show();
//			},
			scoreWidth(degree, index) {
				var width;
				this.$nextTick(function() {
					console.log($('.item-comment-wrapper').size());
					width = $('.item-comment-wrapper').eq(index).find('.img-star').width() / 5 * degree + "px";
					console.log(width);
				})
				return 'width:' + width;
			},
			descriptionFilter(value) {
   				if(value) {
   					if(value.length > 50) {
   						if(value.length > this.textlimit){
   							value = value.substring(0, this.textlimit) + "...";
   						}else{
   							value = value.substring(0, this.textlimit);
   						}
   						
   					}
   				}
   				return value;
   			},
			needShowMore(value) {
   				if(value && value.length > 50) {
   					return true;   					
   				}else{
   					return false;
   				}
   			},
   			toggleText(event){
   				if(this.textlimit == 50){
   					this.textlimit = 268;
   					this.showtext = "收起";
   				}else{
   					this.textlimit = 50;
   					this.showtext = "查看更多";
   				}
   			}
		}
	}
</script>

<style lang='sass'>
	@import "../../../static/sass/components/common/_score-item";
</style>
