<template>
	<div class="depart-wrapper">
		<div class="search-wrapper">
			<div class="choice-city ellipsis_" @click="choiceCity" >{{cityname}}</div>
			<div class="cut-line">|</div>
			<div class="icon-search"></div>
			<input type="text" class="ui-input-search" :placeholder="placeholder" @focus="inputFocus" />
			<!-- <router-link to="/map" class="icon-map"> 地图</router-link>-->
		</div>
		
		<div class="scroll-wrapper">
			<banner></banner>
			<div class="depart">
				<ul v-if="items.length != 0 " v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
					<li v-for="(item,index) in items" class="item" :key="index">
						<router-link :to="'departInfo/'+item.id" class="item-wrapper">
							<div class="item-img">
								<img :src="photoFilter(item.url,100,100)" onerror="this.onerror=null; this.src='../../static/image/companylogo.png';" />
								<span v-if="item.isapprove == 1"></span>
							</div>
							<div class="info">
								<h4><span class="name ellipsis_">{{item.departname}}</span><span class="subsidy" v-if="item.isassist == 1">补助</span></h4>
								<p class="icon-location"><span class="">{{item.cityname}}{{item.countryname}}</span></p>
								<p class="icon-comment"><em>{{item.commenttimes}}</em>评论</p>
								<!--<span class="icon-sign" v-if="item.isassist == 1">补助</span>-->
							</div>
						</router-link>
					</li>
				</ul>
				<div class="loading-more" v-if="!queryLoading">
					<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
				</div>
				<div class="no-content" v-if="moreLoading&&allLoaded && items.length == 0">没有内容！</div>
			</div>

		</div>

	</div>

</template>
<script>
	// 导入要用到的子组件
	import { Indicator, InfiniteScroll } from 'mint-ui';
	import Banner from '../components/Banner'
	export default {
		data() {
			return {
				items: [],
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				placeholder: sessionStorage.getItem('searchDepart') || '搜索您想要了解的机构',
				searchtext: sessionStorage.getItem('searchDepart')//搜索关键字
			}
		},
		props: ['cityname', 'citycode', 'cityid','cityFlag'],
		components: {
			Banner
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			//Indicator.open();
			//this.loadPageList();
		},
		methods: {
			//搜索
			inputFocus() {
				var v = this;
				sessionStorage.setItem('cityid',v.cityid);
				v.$router.push({
					name: "SearchDepart"
				})
			},
			loadPageList(params) {
				// 在main.js里导入并使用vue-resource之后，就可以通过this.$http来使用vue-resource了，这里我们用到了get方法
				var v = this;
				if(!params)
					params = {
						pageSize: v.pageSize,
						pageNum: v.pageNum,
						key: v.searchtext,
						region: v.citycode,
						lng: this.$utils.getCookie('currentLng'),
						lat: this.$utils.getCookie('currentLat'),
					}
				console.log(params)
				v.$api.get('depart/listdepart', params, function(r) {
					if(v.pageNum == 1) {
						v.items = [];
						Indicator.close();
					}
					v.items = v.items.concat(r.data.records);
					if(v.items.length == r.data.total) {
						v.allLoaded = true;
					}
					v.moreLoading = v.allLoaded;
				})
			},
			choiceCity() {
				this.$emit("chooseCity");
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
					v.loadPageList();
				}, 500);
			},
		},
		watch: {　　　　　　　　
			'citycode' () {
				 console.log('城市code:' + this.citycode)
				//Indicator.open();
				var v = this;
				setTimeout(() => {
					v.items = [];
					v.pageNum = 1;
					v.allLoaded = false;
					v.moreLoading = true;
					v.queryLoading = false;
					v.loadPageList();　
				}, 500);

			},
			'searchtext' () {
				var v = this;
				if(v.searchtext.trim() == '') {
					v.items = [];
					v.pageNum = 1;
					v.allLoaded = false;
					v.moreLoading = true;
					v.queryLoading = false;
					v.loadPageList();　　

				}
			}
		}
	}
</script>