<template>
	<div class="wrapper">
		<div class="scroll-wrapper teacher">
			<ul class="all" v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
				<li v-for="(item,index) in teacherList" :key="index" class="item-wrapper-teacher" @click="getTeacherDetail(item.id)">
					<div class="top-wrapper">
						<!--  <img class="morenimg" v-if="item.headimgurl.length == 0" src="../../static/image/moren.png" /> -->
						<div class="img-wrapper">
							<img :src="photoFilter(item.headimgurl,100,100)" onerror="this.onerror=null; this.src='../../static/image/moren.png';" />
						</div>
						<div class="right">
							<span class="username ellipsis_">{{item.username}}</span>
							<span class="post ellipsis_" v-if="item.post != '' && item.post != null">{{item.post}}</span>
						</div>
					</div>
					<p v-if="item.skills != ''">{{item.skills}}</p>
				</li>
			</ul>
			<div class="loading-more" v-if="!queryLoading">
				<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
			</div>
			<div class="no-content" v-if="moreLoading&&allLoaded && teacherList.length == 0">没有内容！</div>
		</div>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui';
	export default {
		data() {
			return {
				id: this.$route.params.id,
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				teacherList: [], //老师列表
			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			this.getData();
		},
		methods: {
			//获取老师详情
			getTeacherDetail(id) {
				var v = this;
				for(var i = 0; i < v.teacherList.length; i++) {
					if(v.teacherList[i].id == id) {
						localStorage.setItem('teacher', JSON.stringify(v.teacherList[i]));
						v.$router.push({
							name: 'teacherdetail',
							params: {
								id: id
							}
						})
						return false;
					}
				}
			},
			getData(params) { //获取机构详情
				var v = this;
				var params = {
					pageSize: v.pageSize,
					pageNum: v.pageNum,
					departid: v.id
				}
				v.$api.get('depart/userlistfree/' + v.id + '', params, function(r) {
					if(v.pageNum == 1) {
						v.productList = [];
						Indicator.close();
					}
					v.teacherList = r.data.records;
					if(v.teacherList.length == 0) {
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
					v.getData();
				}, 500);
			},
		}
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/depart";
</style>