<template>
	<div class="info-wrapper pading-bottom">
		<div class="teacher scroll-wrapper">			
			<teacher-item :itemData="item" v-for="(item,index) in teacherList" class="item-wrapper-teacher" :key="index">				
			</teacher-item>
		</div>
		<div class="loading-more" v-if="!queryLoading">
			<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
		</div>
		<div class="no-content" v-if="moreLoading&&allLoaded && teacherList.length == 0">没有内容！</div>
	</div>
</template>

<script>
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	import teacherItem from "../../components/common/TeacherItem";
	export default {
		data() {
			return {
				id: this.$route.params.id,
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				tercherdesFlag: false,
				teacherList:[],
			}
		},
		created() {
			this.getTeacherDetail();
		},
		mounted(){			
		},
		methods: {
			//获取老师详情
			getTeacherDetail(params) { 
				var v = this;
				let localUrl = this.$route.path;
				let subjectTeacher = "";
				if(localUrl.indexOf('class') > -1){
					if(sessionStorage.getItem('classTeacher')){
						subjectTeacher = JSON.parse(sessionStorage.getItem('classTeacher'));
					}					
				}else{
					subjectTeacher = JSON.parse(sessionStorage.getItem('subjectTeacher'));
				}
				v.teacherList = subjectTeacher || [];
				if(v.teacherList.length == 0) {
					v.allLoaded = true;
				}
				v.moreLoading = v.allLoaded;
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
		},
		components:{
			teacherItem
		}
	}
</script>