<!-- 产品组件 适用于机构产品、公开课列表、班级课列表、老师主讲课程等页面 -->
<template>
	<div class="product-item" @click="getSubjectDetail(itemData.id)">
		<div class="pro-pic">
			<img class="picitem" :src="photoFilter(itemData.url,540,310)" mode=""></img>
			<span class="timetip">时间：{{timefilter(itemData.begindatetime)}}-{{timefilter(itemData.enddatetime)}}</span>
			<span class="flag" v-if="itemData.livestatus =='prog'">直播中</span>
		</div>
		<div class="pro-title">
			{{itemData.name}}
		</div>
		<div class="pro-price">
			<span class="price">￥<em>{{itemData.price}}</em></span>
			<span class="sign" v-if="!itemData.membercount"><em>{{itemData.membercount}}</em>人报名</span>
			 <span class="sign" v-if="itemData.membercount">暂无报名</span> 
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			itemData: {
				type: [Object, Array]
			},
			itemtype: {
				type: String
			}
		},
		data() {
			return {				
				degreeWidth: 0
			}
		},		
		created() {
			var v = this;
		},
		mounted() {
			
		},
		methods: {
			timefilter(value) {
				var v = this;
				value = v.$utils.formatData(value, 'day');
				return value;
			},
			//获取公开课详情
			getSubjectDetail(id) {
				var v = this;
				if(v.itemtype == "subject"){
					sessionStorage.setItem('subjectItemdata', JSON.stringify(v.itemData));
					v.$router.push({
						path: '/subject/detail/' + id
					})
				}else if(v.itemtype == "class"){
					sessionStorage.setItem('classItemdata', JSON.stringify(v.itemData));
					v.$router.push({
						path: '/class/detail/' + id
					})
				}
			},
		}
	}
	
</script>

<style lang='sass'>
	@import "../../../static/sass/components/common/_course-item";
</style>
