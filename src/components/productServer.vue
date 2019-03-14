<template>
	<div class="product-server-wrapper">
		<ul class="product-server-tab">
            <li 
            v-for="(item,index) in product.productitemlist" :key="index" :class="{active:index == nowIndex}" @click="toggleTab(index)">{{item.name}}</li>
        </ul>
		<div v-for="(item,index) in product.productitemlist" :key="index" class="other-productinfo" :class="{hide:index != nowIndex}">
			<div class="st1">
				<h4>服务人员</h4>
				<p>{{item.servicername}}</p>
			</div>
			<div class="st1">
				<h4>可用次数</h4>
				<p>{{item.times}}</p>
			</div>
			<div class="st1">
				<h4>可用时间</h4>
				<p>{{item.availabletime}}</p>
			</div>
			<div class="st1">
				<h4>是否预约</h4>
				<p v-if="item.appointment == 'y'">
					是
				</p>
				<p v-else>
					否
				</p>
			</div>
			<div class="st1">
				<h4>注意事项</h4>
				<p>{{item.attention}}</p>
			</div>
			<h4>图集</h4>
			<img-list-small :imglist="item.imglist"></img-list-small>
		</div>
	</div>

</template>

<script>
	import ImgListSmall from '../components/ImgListSmall'
	export default {
		data() {
			return {
				nowIndex: 0, //导航索引值
				isHide: false
			}
		},
		components: {
			ImgListSmall
		},
		methods: {
			toggleTab(index) {
				this.nowIndex = index;
			},
			cancel() {
				this.isHide = !this.isHide;
			}
		},
		props: ['product']
	}
</script>