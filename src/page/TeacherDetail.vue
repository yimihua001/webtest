<template>
	<div class="wrapper">
		<div class="scroll-wrapper teacher-info-wrapper">
			<div class="main-info">
				<div class="left">
					<h1>{{info.username}}</h1>
				</div>
				<div class="img-wrapper">
					<img :src="info.headimgurl" onerror="this.onerror=null; this.src='../../static/image/moren.png';"/>
				</div>
			</div>
			<p class="skills">{{info.skills}}</p>
			<div class="other-info">
				<h3>个人介绍</h3>
				<p v-if="info.resume == 0"> 无</p>
				<p>{{info.resume}}</p>
				<h3>工作经验</h3>
				<p v-if="info.experience == 0"> 无</p>

				<p>{{info.experience}}</p>
				<h3>成功案例</h3>
				<p v-if="info.sample == 0"> 无</p>

				<p>{{info.sample}}</p>
				<h3>培训经历</h3>
				<p v-if="info.training == 0"> 无</p>

				<p>{{info.training}}</p>

				<h3>获得证书：</h3>
				<p v-if="info.certlist == 0"> 无</p>
				<img-list-small :imglist="info.certlist"></img-list-small>

			</div>
		</div>
	</div>
</template>
<script>
	import { Indicator } from 'mint-ui';
	import ImgListSmall from '../components/ImgListSmall'
	export default {
		data() {
			return {
				info: JSON.parse(localStorage.getItem('teacher')),
				id: this.$route.params.id,

			}
		},
		components: {
			ImgListSmall
		},
		created() {
			console.log(this.info)
		},

	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/depart";
</style>