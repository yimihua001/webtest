<template>
	<div class="wrapper">
		<list-type :productTypeList="productTypeList" :id="id" v-on:productTypeId="listenProductTypeId"></list-type>
		<div class="scroll-wrapper">
			<ul v-if="productList.length != 0" class="listProduct" v-infinite-scroll="loadmore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
				<li v-for="(item,index) in productList" :key="index" @click="getDetail(item.id)" class="item-wrapperproduct">
					<h4 class="ellipsis_">{{item.name}}</h4>
					<div class="info">
						<h6>学习人数{{item.sellcount}}人&nbsp;&nbsp;剩余{{item.stock}}人</h6>
						<h6 class="fr disprice">￥{{item.discountprice}}<span class="price">￥{{item.price}}</span></h6>
					</div>
				</li>
			</ul>
			<div class="loading-more" v-if="!queryLoading">
				<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
			</div>
			<div class="no-content" v-if="moreLoading&&allLoaded && productList.length == 0">没有内容！</div>
		</div>
	</div>

</template>
<script>
	import { Indicator, InfiniteScroll } from 'mint-ui';
	import ListType from '../components/ProductTypeList'
	export default {
		data() {
			return {
				id: this.$route.params.id,
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				typeid: '', //套餐类型id
				productList: [], //套餐列表
				productTypeList: [], //套餐类型列表
			}
		},
		components: {
			ListType
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			this.getProductType()
			this.getProductList()
		},
		methods: {
			listenProductTypeId(data) {
				Indicator.open();
				var v = this;
				v.productList = [];
				v.typeid = data;
				v.pageNum = 1;
				v.allLoaded = false;
				v.moreLoading = true;
				v.queryLoading = false;
				v.getProductList();

			},
			getProductType(params) { //获取套餐类型列表
				var v = this;
				v.$api.get('/product/typelistbydepart/' + v.id + '', params, function(r) {
					v.productTypeList = r.data;
					v.productTypeList.unshift({
						'name': '全部',
						'id': ''
					})
				})
			},
			getProductList(params) { //获取套餐列表
				var v = this;
				if(!params)
					params = {
						pageSize: v.pageSize,
						pageNum: v.pageNum,
						typeid: v.typeid

					}
				console.log(params);
				v.$api.get('/product/listbydepart/' + v.id + '', params, function(r) {
					if(v.pageNum == 1) {
						v.productList = [];
						Indicator.close();
					}
					v.productList = v.productList.concat(r.data.records);
					if(v.productList.length == r.data.total) {
						v.allLoaded = true;
					}
					console.log(v.productList);
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
					v.getProductList();
				}, 500);
			},
			btnDownload() {
				window.location.href = this.$appDownloadUrl
			},
			getDetail(id) {
				this.$router.push({
					name: 'productDetail',
					params: {
						id: id
					}
				})
			},
			cancel() {
				this.$emit("on-cancel3");
			}
		},

		/**name 套餐名称
		   url 图片
		   price 原价
		   discountprice 折扣价
		   sellcount 销售量
		   stock 库存量
		**/
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/depart";
</style>