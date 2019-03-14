<template>
	<div class="payinfo">正在跳转，请稍后</div>
</template>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>
<script>
	import { Indicator, Toast } from 'mint-ui'
	export default {
		// 在组件创建完成时，执行的钩子函数
		created() {
		    var payInfo = JSON.parse(sessionStorage.getItem('payInfo'))
		    if(payInfo.type == 'product'){
		    	this.$router.push({
					name: 'productDetail',
					params: {
						id: payInfo.id
					}
				})
		    }else if(payInfo.type == 'subject'){
		    	this.$router.push({
					name: 'subjectDetail',
					params: {
						id: payInfo.id
					}
				})
		    }
		}

	}
</script>
