<template>
	<ul class="product-type-wrapper">
		<li v-for="(item,index)  in  productTypeList" :key="index" class="ellipsis_ " @click="getList(item.id,index)" v-bind:class="{active:index==subNowIndex}">
			{{item.name}}
		</li>
	</ul>
</template>
<script>
	import { Indicator} from 'mint-ui';
	export default {
		data() {
			return {
				subNowIndex: 0, //导航索引值
				isShow: false,
				text: '全部',
				selected: '1',
				isHide: false
			}
		},
		props: ['productTypeList'],
		mounted() {
			$(".b").on(".a", "click", function() {

				console.log($(this));

			})

		},
		methods: {
			getList(id, index) {
				Indicator.open();
				this.$emit("productTypeId", id); //传递套餐类型id
				this.subNowIndex = index;
				console.log(this.subNowIndex + "==" + index);

			},
			cancel() {
				this.isHide = !this.isHide;
			}
		}
	}
</script>