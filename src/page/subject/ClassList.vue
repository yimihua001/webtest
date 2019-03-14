<template>
	<div class="wrapper">
		<div class="subject-wrapper scroll-wrapper pading-bottom">
			<span class="title">班级课</span>
			<ul class="all" v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
				<course-item :itemData="item" v-for="(item,index) in classList" :itemtype="subjectType" :key="index">					
				</course-item>
			</ul>
			<div class="loading-more" v-if="!queryLoading">
				<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
			</div>
			<div class="no-content" v-if="moreLoading && allLoaded && classList.length == 0">没有内容！</div>
		</div>
	</div>

</template>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>
<script>
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	import courseItem from "../../components/common/courseItem";
	export default {
		data() {
			return {
				id: this.$route.params.id,
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				classList: [], //班级课列表
				subjectType:'class'
			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			this.getSubjectList();

		},
		methods: {
			getSubjectList() { //获取班级课列表
				var v = this;
				var params = {
					pageSize: v.pageSize,
					pageNum: v.pageNum,
					type:'group'
				}
				v.$api.get('depart/product/'+v.id+'', params, function(r) {
					if(v.pageNum == 1) {
						v.productList = [];
						Indicator.close();
						v.classList = r.data.grouppage.records;
					}else{
						v.classList = v.classList.concat(r.data.grouppage.records);
					}
					if(v.classList.length == r.data.grouppage.total) {
						v.allLoaded = true;
					}
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
					v.getSubjectList();
				}, 500);
			}
		},
		components:{
			courseItem,
		}
	}
</script>