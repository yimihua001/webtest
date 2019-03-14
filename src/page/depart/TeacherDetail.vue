<template>
	<div class="wrapper">
		<div class="scroll-wrapper teacher-info-wrapper">
			<div class="main-info">				
				<div class="img-wrapper">
					<img :src="info.headimgurl" onerror="this.onerror=null; this.src='../../../static/image/moren.png';"/>
				</div>
				<div class="left">
					<h1>{{info.username}}</h1>
				</div>
			</div>
			<div class="block"></div>
			<div class="content-box">
				<div class="tab">
					<ul >
					  <li :class="currentIndex == 0 ? 'active':''" @click="toggleTab(0,'tab-container1')">教师详情</li>
					  <li :class="currentIndex == 1 ? 'active':''" @click="toggleTab(1,'tab-container2')">主讲课程</li>
					</ul>
				</div>				
				<div class="page-tab-container pading-bottom">
				  <mt-tab-container class="page-tabbar-tab-container" v-model="active" >
				    <mt-tab-container-item id="tab-container1">
						<div class="other-info">
							<h3>特长</h3>
							<p v-if="info.skills == 0"> 无</p>
							<p>{{info.skills}}</p>
							<h3>简介</h3>
							<p v-if="info.resume == 0"> 无</p>
							<p>{{info.resume}}</p>
							<h3>经验</h3>
							<p v-if="info.experience == 0"> 无</p>
						
							<p>{{info.experience}}</p>
							<h3>成功案例</h3>
							<p v-if="info.sample == 0"> 无</p>
						
							<p>{{info.sample}}</p>
							<h3>培训经历</h3>
							<p v-if="info.training == 0"> 无</p>
						
							<p>{{info.training}}</p>
						
							<h3>证书：</h3>
							<p v-if="info.certlist == 0"> 无</p>
							<img-list-small :imglist="info.certlist"></img-list-small>
						</div>
				    </mt-tab-container-item>
					<!-- 主讲课程 -->
				    <mt-tab-container-item id="tab-container2">
						<div class="course-box">
							<h3>
								公开课
								<!--<em class="moreitem" @click="openMorelist(0)">更多</em>-->
							</h3>
							<div class="scroll-wrapper">			
								<course-item :itemData="item" v-for="(item,index) in subjectList" :key="index" :itemtype="subjectType1" class="item-wrapper-teacher">				
								</course-item>
							</div>
							<div class="loading-more" v-if="!queryLoading">
								<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
							</div>
							<div class="no-content" v-if="moreLoading && allLoaded && subjectList.length == 0">没有内容！</div>
						</div>
						<div class="course-box">
							<h3>
								班级课
								<!--<em class="moreitem" @click="openMorelist(1)">更多</em>-->
							</h3>
							<div class="scroll-wrapper">			
								<course-item :itemData="item" v-for="(item,index) in classList" :key="index" :itemtype="subjectType2" class="item-wrapper-teacher">				
								</course-item>
							</div>
							<div class="loading-more" v-if="!queryLoading">
								<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
							</div>
							<div class="no-content" v-if="moreLoading && allLoaded && classList.length == 0">没有内容！</div>
						</div>		
				    </mt-tab-container-item>				  
				  </mt-tab-container>
				</div>
			</div>
			
		</div>
	</div>
</template>
<script>
	import { Indicator } from 'mint-ui';
	import ImgListSmall from '../../components/ImgListSmall'
	import courseItem from "../../components/common/courseItem";
	export default {
		data() {
			return {
				info: JSON.parse(localStorage.getItem('teacherData')),
				id: this.$route.params.id,
				active:'tab-container1',
				currentIndex: 0,				
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
		components: {
			ImgListSmall,
			courseItem
		},
		created() {
			// console.log(this.info)
		},
		methods:{			
			toggleTab: function(index, tab) {
				this.active = tab;
				this.currentIndex = index;
				if(this.currentIndex == 1){
					this.getTeachercourse();						
				}
			},	
			getTeachercourse:function(){
				Indicator.open();
				var v = this;
				var params = {
					pageSize: v.pageSize,
					pageNum: v.pageNum,
				}
				v.$api.get('tuser/product/' + v.id + '', params, function(r) {
					Indicator.close();
					v.subjectList = r.data.subjectpage.records;
					if(v.subjectList.length == 0) {
						v.allLoaded = true;
					}
					v.moreLoading = v.allLoaded;
					
					v.classList = r.data.grouppage.records;
					if(v.classList.length == 0) {
						v.allLoaded = true;
					}
					v.moreLoading = v.allLoaded;
				})
			},
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
			}
		}

	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/teacher_detail";
</style>