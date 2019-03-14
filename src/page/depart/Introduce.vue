<!-- 机构简介 -->
<template>
	<div class="wrapper">
		<div class="introduct-wrapper scroll-wrapper">
			<h3 class="name">机构介绍：</h3>
			<p v-if="item.description == 0">无</p>
			<p v-if="!descriptionFlag" v-html="item.description">
				<!-- <span @click="toggleText($event,0)" class="more" v-if="!descriptionFlag">展开</span> -->
			</p>
			<p v-if="descriptionFlag" v-html="item.description">
				{{item.description}}
			</p>
			<h3>服务范围：</h3>
			<p v-if="item.departbusiness == 0">无</p>
			<p v-if="!departbusinessFlag">
				{{item.departbusiness}}
				<!-- <span @click="toggleText($event,1)" class="more" v-if="!departbusinessFlag">展开</span> -->
			</p>
			<p v-if="departbusinessFlag">
				{{item.departbusiness}}
			</p>
			<h3>服务特色：</h3>
			<p v-if="item.departfeature == 0">无</p>
			<p v-if="!departfeatureFlag">
				{{item.departfeature}}
				<!--<span @click="toggleText($event,2)" class="more" v-if="!departfeatureFlag">展开</span>-->
			</p>
			<p v-if="departfeatureFlag">
				{{item.departfeature}}
			</p>
			<h3>资质证书：</h3>
			<p v-if="item.departcertificate == 0">无</p>
			<img-list-small :imglist="item.departcertificate"></img-list-small>
			<h3>机构图集：</h3>
			<p v-if="imgList == 0">无</p>
			<img-list-small :imglist="imgList"></img-list-small>
			<h3>机构视频：</h3>
			<p v-if="videoList == 0">无</p>
			<img-list-small :imglist="videoList"></img-list-small>
		</div>
	</div>
</template>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>
<script>
	import { Indicator } from 'mint-ui';
	import ImgListSmall from '../../components/ImgListSmall'
	export default {
		data() {
			return {
				id: this.$route.params.id,
				item: [],
				maxlength: 50,
				descriptionFlag: false,
				departbusinessFlag: false,
				departfeatureFlag: false,
				imgList:[],//机构图集
				videoList:[]//机构视频
			}
		},
		created() {
			Indicator.open();
			var v = this;
			setTimeout(function(){
				v.getInfoData();
			},800)			
		},
		mounted(){
			
		},
		methods: {
			getInfoData() { //获取机构详情
				Indicator.close();
				var v = this;
				v.item = JSON.parse(sessionStorage.getItem('departInfo'));
				var departimgrel = v.item.departimgrel;
				for(var i = 0;i<departimgrel.length;i++){
					if(departimgrel[i].type == 1){
						v.imgList.push(departimgrel[i])
					}else if(departimgrel[i].type == 2){
						v.videoList.push(departimgrel[i])
					}
				}
			},
			textFilter(value, index) {
				if(value) {
					if(value.length > this.maxlength) {
						value = value.substring(0, this.maxlength) + "...";
						if(index == 0) {
							this.descriptionFlag = false;
						} else if(index == 1) {
							this.departbusinessFlag = false;
						} else if(index == 2) {
							this.departfeatureFlag = false;
						}
					} else {
						if(index == 0) {
							this.descriptionFlag = true;
						} else if(index == 1) {
							this.departbusinessFlag = true;
						} else if(index == 2) {
							this.departfeatureFlag = true;
						}
					}
					// console.log(this.departfeatureFlag);
				}
				return value;
			},
			ifShowMore(value) {
				if(value) {
					if(value.length > this.maxlength) {
						return true
					} else {
						return false;
					}
				}
			},
			toggleText(event, index) {
				event.target.remove();
				if(index == 0) {
					this.descriptionFlag = !this.descriptionFlag;
				} else if(index == 1) {
					this.departbusinessFlag = !this.departbusinessFlag;
				} else if(index == 2) {
					this.departfeatureFlag = !this.departfeatureFlag;
				}
			}
		},
		components: {
			ImgListSmall
		}
	}
</script>
