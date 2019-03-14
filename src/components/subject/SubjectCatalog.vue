<template>
	<div class="catalog-wrapper">
		<h4 class="title">总览</h4>
		<h4 class="num">直播课{{subject.livenum}}节&nbsp;&nbsp;&nbsp;&nbsp;视频课{{subject.medianum}}节</h4>
		<h4 class="title">目录</h4>
		<ul class="catalog-wrapper pading-bottom scroll-wrapper" v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
			<li v-for="(item,index) in catalogList" :key="index" class="item" @click="courseInfo(item.id)">
				<h4 v-if="item.teachway == 'live'" class="text ellipsis_" :class="statusClassFilter(item.livestatus)">
					{{item.name}}
					<span v-if = "item.livestatus == 'prog'" class="status">上课中</span>
				</h4>
				<p v-if="item.teachway == 'live'" class="time">
					{{timeFilter(item.livestatus,item.teachway,item.begindatetime,item.enddatetime)}}
				</p>
				<h4 v-if="item.teachway == 'media'" class="text ellipsis_ media">{{item.name}}</h4>
				<p v-if="item.teachway == 'media'" class="time">
					{{timeFilter(item.livestatus,item.teachway)}}
				</p>
				<h4 class="text target">目标：{{item.target}}</h4>
			</li>
		</ul>
		<div class="loading-more" v-if="!queryLoading">
			<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
		</div>
		<div class="no-content" v-if="moreLoading&&allLoaded && catalogList.length == 0">没有内容！</div>
	</div>
</template>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
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
				catalogList: [] //目录列表
			}
		},
		props: ['subject'],
		// 在组件创建完成时，执行的钩子函数
		created() {
			//获取公开课目录
			this.getCatalogList()
		},
		// 在组件创建完成时，执行的钩子函数
		methods: {
			//获取公开课目录列表
			getCatalogList() {
				var v = this;
				var params = {
					pageSize: v.pageSize,
					pageNum: v.pageNum,
				}
				v.$api.get('subject/catalog/' + v.id + '', params, function(r) {
					if(v.pageNum == 1) {
						v.catalogList = [];
						Indicator.close();
					}
					v.catalogList = v.catalogList.concat(r.data.records);
					if(v.catalogList.length == r.data.total) {
						v.allLoaded = true;
					}
					v.moreLoading = v.allLoaded;
					console.log(v.catalogList);
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
					v.getCatalogList();
				}, 500);
			},
			timeFilter(status, teachway, begin, end) {
				var value;
				var v = this;
				if(teachway == 'live') {
					if(status == 'init') { //直播生成
						value = '上课时间：' + v.$utils.formatData(begin, 'minute') + "-" + v.$utils.formatData(end, 'minute').split(' ')[1];
					} else if(status == 'prog') { //
						value = '正在上课：' + v.$utils.formatData(begin, 'minute') + "-" + v.$utils.formatData(end, 'minute').split(' ')[1];
					} else if(status == 'playbacking') {
						value = '回放生成中，请稍后';
					} else if(status == 'playback') {
						value = '直播回放';
					}
				} else if(teachway == 'media') {
					value = '多媒体课随时可观看';
				}
				console.log(value);
				return value;
			},
			statusClassFilter(status) {
				var value;
				if(status == 'init') { //直播生成
					value = 'init';
				} else if(status == 'prog') { //直播中
					value = 'process';
				} else if(status == 'playbacking') { //回放生成中
					value = 'playbacking';
				} else if(status == 'playback') { //回放
					value = 'playback';
				}
				return value;
			},
			showTarget(e) {
				//				console.log(e.currentTarget.querySelector(".target"));
				//				if(e.currentTarget.querySelector(".target").style.display == 'block') {
				//					e.currentTarget.querySelector(".target").style.display = "none"
				//				} else {
				//					e.currentTarget.querySelector(".target").style.display = "block"
				//				}

			},
			courseInfo(id) {
				//判断购买后可以进入课程详情
				var v = this;
				if(v.subject.purchasestatus) {
					v.$router.push({
						name: 'subjectCourse',
						params: {
							id: id
						}
					})
				} else {
					Toast('请先购买课程')
				}
			}
		}
	}
</script>