<template>
	<div class="descont">
		<div class="textcont" v-if="desitem.type == 0">
			{{desitem.introduce}}
		</div>
		<div class="piccont" v-if="desitem.type == 1">
			 <img :src="desitem.url"/>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			desitem: {
				type: [Object, Array]
			}
		},
		data() {
			return {		
				
			}
		}
	}	
</script>
<style>
</style>