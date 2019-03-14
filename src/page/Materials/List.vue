<template>
	<div class="wrapper">
		<div class="search-wrapper" id="search-wrapper">
			<div class="icon-search"></div>
			<input type="text" class="ui-input-search" placeholder="搜索你想要的素材" @focus="inputFocus" readonly/>
		</div>
		<ul class="mat-tab">
			<li v-for='(item,index) in tabs' :key="index" :class='{active:index == activeIndex}' @click='tabToggle(index,item.type)'>{{item.name}}</li>
		</ul>
		<result :gtype="gtype" :searchtext="searchtext"></result>
	</div>
</template>
<script>
	// 导入要用到的子组件
	import { Indicator, InfiniteScroll } from 'mint-ui';
	import Result from '../Materials/Result'
//	import wx from 'weixin-js-sdk'
	export default {
		data() {
			return {
				gtype: 1,
				searchtext: '',
				tabs: [{
						'name': '图片',
						'type': 1
					},
					{
						'name': '视频',
						'type': 2
					},
					{
						'name': '音频',
						'type': 3
					}
				],
				activeIndex: 0,
			}
		},
		components: {
			Result
		},
		created() {
			Indicator.open();
		},
		mounted() {
			var v = this;
			var url = location.href.split('#')[0];
			v.$api.post('user/wxparams?url=' + encodeURIComponent(url), '', function(r) {
				var jsapi = {
					timestamp: r.data.timestamp,
					nonceStr: r.data.nonceStr,
					jsapi_ticket: r.data.jsapi_ticket,
					signature: r.data.signature,
					appid: r.data.appId
				};
				wx.config({
					debug: false,
					appId: r.data.appId,
					timestamp: r.data.timestamp,
					nonceStr: r.data.nonceStr,
					signature: r.data.signature,
					jsApiList: [
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo'
					]
				});
			})
			var shareData = {
				title: '自闭症康复教学素材',
				desc: "自闭症康复教学素材包括图片，视频，音频，游戏，测试",
				link: location.href, // 分享链接
				imgUrl: "http://h5.helloparents.molyfun.com/logo.png", // 分享图片，使用逗号,隔开
			};
			wx.ready(function() {
				wx.onMenuShareAppMessage(shareData);
				wx.onMenuShareTimeline(shareData);
				wx.onMenuShareQQ(shareData);
				wx.onMenuShareQZone(shareData);
			});
			wx.error(function(res) {
				alert(res.errMsg);
			});
		},
		methods: {
			//搜索
			inputFocus() {
				var v = this;
				v.$router.push({
					name: "MaterialsSearch",
					params: {
						type: v.gtype
					}
				})
			},
			//导航切换
			tabToggle(index, type) {
				var v = this;
				v.activeIndex = index;
				v.gtype = type;
			},
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/material";
</style>