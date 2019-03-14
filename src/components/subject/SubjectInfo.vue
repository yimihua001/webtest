<template>
	<div class="info-wrapper pading-bottom">
		<h4>班级简介</h4>
		<div class="content" v-if="otype == '1'">
			{{subjectInfo.introduction}}
		</div>
		<div class="content" v-if="otype == '2'">
			<subject-des v-for ="(list,index) in  subjectDeslist" :desitem = "list" :key="index" ></subject-des>
		</div>
	</div>

</template>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>
<script>
	import { Indicator, Toast, InfiniteScroll } from 'mint-ui';
	import SubjectDes from '../../components/subject/subjectDes'
	export default {
		data() {
			return {
				id: this.$route.params.id,
				subjectInfo:"",
				subjectDeslist:[],
				otype:'1'
			}
		},
		created() {
			this.getSubjectDes();
		},
		methods: {			
			getSubjectDes(){
				var itemdata ="";
				let localUrl = this.$route.path;
				if(localUrl.indexOf('class') > -1){
					itemdata =  JSON.parse(sessionStorage.getItem('classItemdata'));
					this.subjectInfo = itemdata;
					this.otype = '1';
				}else{
					this.subjectDeslist = JSON.parse(sessionStorage.getItem('introduceData'));
					this.otype = '2';
					console.log(this.subjectDeslist[0].introduce)
				}				
			}			
		},
		components: {
			SubjectDes
		}
	}
</script>