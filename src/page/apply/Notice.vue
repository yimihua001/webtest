<template>
	<div class="wrapper">
		<div class="scroll-wrapper notice-wrapper pading-bottom">
			<h3>报名须知</h3>
			<p v-if='text!=""'><pre>{{text}}</pre></p>
			<p v-else class="no-content" style="text-align:left;">无报名须知</p>
		</div>
		<footer  class="footer">
			<router-link  class="btn" to="/apply/info">同意并报名</router-link>
		</footer>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				text:sessionStorage.getItem('applyNotice'),
			}
		},
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/apply";
</style>