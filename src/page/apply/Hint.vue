<template>
	<div class="wrapper">
		<div class="no-content">
			请使用扫一扫登录报名
		</div>
	</div>
</template>
<style lang='sass'>
	@import "../../../static/sass/pages/apply";
</style>
<script>
	export default {
		// 在组件创建完成时，执行的钩子函数
		created() {
			localStorage.clear();
		},
	}
</script>