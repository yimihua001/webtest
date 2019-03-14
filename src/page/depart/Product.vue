<!-- 机构产品 -->
<template>
	<div class="wrapper">
		<div class="paoduct-box">
			<h3>公开课<em class="moreitem" @click="openMorelist(0)"  v-if="subjectList.length != 0">更多</em></h3>
			<div class="teacher scroll-wrapper">			
				<course-item :itemData="item" v-for="(item,index) in subjectList" :itemtype="subjectType1" class="item-wrapper-teacher" :key="index">				
				</course-item>
			</div>
			<div class="loading-more" v-if="!queryLoading">
				<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
			</div>
			<div class="no-content" v-if="moreLoading&&allLoaded && subjectList.length == 0">没有内容！</div>
		</div>
		<div class="paoduct-box">
			<h3>班级课<em class="moreitem" @click="openMorelist(1)" v-if="classList.length != 0">更多</em></h3>
			<div class="teacher scroll-wrapper">			
				<course-item :itemData="item" v-for="(item,index) in classList" :key="index" :itemtype="subjectType2" class="item-wrapper-teacher">				
				</course-item>
			</div>
			<div class="loading-more" v-if="!queryLoading">
				<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
			</div>
			<div class="no-content" v-if="moreLoading&&allLoaded && classList.length == 0">没有内容！</div>
		</div>		
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui';
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
				subjectList:[],
				classList:[],
				subjectType1:"subject",
				subjectType2:"class"
			}
		},
		created() {
			Indicator.open();
			this.getProductlist();
		},
		mounted(){			
		},
		methods: {			
			//获取更多产品列表
			openMorelist(type){
				var v = this;
				let id = v.id;
				if(type == 0){
					v.$router.push({
							name: 'subjectlist',
							params: {
								id: id
							}
						})
				}else if(type == 1){
					v.$router.push({
							name: 'classlist',
							params: {
								id: id
							}
						})
				}
			},
			//获取产品列表
			getProductlist(params) { 
				var v = this;
				var params = {
					pageSize: v.pageSize,
					pageNum: v.pageNum,
					}
				v.$api.get('depart/product/' + v.id + '', params, function(r) {
					Indicator.close();
					v.subjectList = r.data.subjectpage.records;
					if(v.subjectList.length == 0) {
						v.allLoaded = true;
					}
					v.classList = r.data.grouppage.records;
					if(v.classList.length == 0) {
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
					v.getProductlist();
				}, 500);
			},
		},
		components:{
			courseItem,
		}
	}	
</script>
