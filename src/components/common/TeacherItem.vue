<!-- 老师组件 适用于机构团队、公开可教师、班级课教师等页面 -->
<template>
	<div>
		<div class="teacher-item">
			<div class="img-wrapper" @click="openDetail($event)">
				<img :src="photoFilter(itemData.headimgurl,100,100)" onerror="this.onerror=null; this.src='../../static/image/moren.png';" />
			</div>
			<span class="username ellipsis_">{{itemData.username}}</span>
			<div class="descriptions">
				<span class="skills" v-if="itemData.skills != '' && itemData.skills != null">
					{{descriptionFilter(itemData.skills)}}
					<span @click.stop = "toggleText($event)" class="showmore" v-if="needShowMore(itemData.skills)">{{showtext}}</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			itemData: {
				type: [Object, Array]
			}
		},
		data() {
			return {
				textlimit:50,
				showtext:"查看更多",
			}
		},
		created() {},
		methods: {
			//打开老师详情页面
			openDetail(event) {
				let itemId = this.itemData.id;
				var v = this;
				localStorage.setItem('teacherData', JSON.stringify(v.itemData));
				v.$router.push({
					name: 'teacherdetail',
					params: {
						id: itemId
					}
				})
			},
			descriptionFilter(value) {
   				if(value) {
   					if(value.length > 50) {
   						if(value.length > this.textlimit){
   							value = value.substring(0, this.textlimit) + "...";
   						}else{
   							value = value.substring(0, this.textlimit);
   						}
   						
   					}
   				}
   				return value;
   			},
			needShowMore(value) {
   				if(value && value.length > 50) {
   					return true;   					
   				}else{
   					return false;
   				}
   			},
   			toggleText(event){
   				if(this.textlimit == 50){
   					this.textlimit = 268;
   					this.showtext = "收起";
   				}else{
   					this.textlimit = 50;
   					this.showtext = "查看更多";
   				}
   			}
		}
	}
</script>

<style lang='sass'>
	@import "../../../static/sass/components/common/_teacher-item";
</style>
