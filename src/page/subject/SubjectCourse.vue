<template>
	<div class="wrapper">
		<div class="scroll-wrapper teacher-info-wrapper">
			<div class="main-info">
				<div class="left">
					<h1>{{course.name}}</h1>
				</div>
			</div>
			<div class="other-info">
				<h3>目标</h3>
				<p v-if="course.target == 0"> 无</p>
				<p>{{course.target}}</p>
				<h3>内容</h3>
				<p v-if="course.process == 0"> 无</p>

				<p>{{course.process}}</p>

				<h3>课件：</h3>
				<p v-if="course.certlist == 0"> 无</p>
				<img-list-small :imglist="course.subjectcourselist"></img-list-small>
			</div>
		</div>
		<div v-if="course.teachway == 'live'" class="footer">
			<span v-if="course.livestatus == 'prog'" class="btn" @click="attend(course.id)">观看直播</span>
			<span v-if="course.livestatus == 'playbacking'" class="un-btn">回放生成中</span>
			<span v-if="course.livestatus == 'playback'" class="btn" @click="playback(course.id)">观看回放</span>
		</div>
	</div>
</template>
<script>
	import { Indicator } from 'mint-ui';
	import ImgListSmall from '../../components/ImgListSmall'
	export default {
		data() {
			return {
				id: this.$route.params.id,
				course: ''

			}
		},
		components: {
			ImgListSmall
		},
		created() {
			clearInterval();
			this.getCourseInfo()
		},
		methods: {
			//获取公开课目录列表
			getCourseInfo() {
				var v = this;
				v.$api.get('subject/cataloginfo/' + v.id + '', '', function(r) {
					v.course = r.data;
				})
			},
			//观看直播
			attend(id) {
				var v = this;
				v.$router.push({
					name: 'subjectLive',
					params: {
						id: id
					}
				})
				sessionStorage.setItem('subjectCourse',JSON.stringify(v.course))
				console.log( JSON.parse(sessionStorage.getItem('subjectCourse')));
			},
			//观看回放
			playback(id) {
				var v = this;
				v.$router.push({
					name: 'subjectPlayback',
					params: {
						id: id
					}
				})
				sessionStorage.setItem('subjectCourse',JSON.stringify(v.course))
				console.log( JSON.parse(sessionStorage.getItem('subjectCourse')));
			}
		}

	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>