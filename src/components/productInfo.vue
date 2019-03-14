<template>
	<div class="other-productinfo">
		<h4>套餐介绍</h4>
		<p>{{product.introduce}}</p>
		<div class="st2">
			<h5 class="icon-applicablescope">使用范围：{{product.applicablescope}}</h5>
			<h5 class="icon-expdate">有效期限：{{product.expdate}}天</h5>
		</div>
		<div class="st1">
			<h4>服务特色</h4>
			<p>{{product.feature}}</p>
		</div>
		<div class="st1">
			<h4>注意事项</h4>
			<p>{{product.attention}}</p>
		</div>
		<div class="st1">
			<h4>备注</h4>
			<p>{{product.remarks}}</p>
		</div>
		<div class="st1">
			<h4>套餐图集</h4>
			<img-list-small :imglist="product.imglist"></img-list-small>
		</div>
	</div>
</template>

<script>
	import ImgListSmall from '../components/ImgListSmall'
	export default {
		data() {
			return {
				isHide: false,
			}
		},
		components: {
			ImgListSmall
		},
		mounted() {
			console.log(this.product);
		},
		methods: {
			cancel() {
				this.isHide = !this.isHide;
			},
		},
		props: ['product']
	}
</script>