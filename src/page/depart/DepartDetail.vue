<template>
	<div class="wrapper">
		<div class="scroll-wrapper depart-detail depart">
			<div class="depart-info">
				<div class="item-img">
					<img :src="photoFilter(dat.url,100,100)" onerror="this.onerror=null; this.src='../../../static/image/companylogo.png';" />
				</div>
				<div class="mapitem" @click="getTencentMap(dat.departAddress,dat.departname)"><i class="mapicon"></i>获取位置</div>
				<div class="nameitem">
					<h4><span class="departName ellipsis_" v-bind:class="{subsidy1:dat.isassist == 1}">{{dat.departname}}</span></h4>
					<h5 class="departaddress ellipsis_">{{dat.departAddress}}</h5>
					<h5 class="departtel">{{dat.departtel}}</h5>
					<span class="isapprove" v-if="dat.isapprove == 1">认证</span>
					<span class="isapprove isassist" v-if="dat.isassist == 1">补助</span>
				</div>
			</div>
			<!--选项卡-->
			<div class="tab">
				<ul>
					<li v-for="(item,index) in tabs" :key="index" :class="{active:index == currentIndex}" @click="toggleTab(index,item.content)">{{item.text}}</li>
				</ul>
			</div>
			<div class="scroll-wrapper depart-detail-wrapper pading-bottom">
				<subject :is="currentTab" :subject="subjectInfo" keep-alive></subject>
			</div>
		</div>
		<v-footer :projectdat="dat" v-if="isShow"></v-footer>
	</div>
</template>

<script>
	import { Indicator,Toast, InfiniteScroll,MessageBox } from 'mint-ui';
	import VFooter from '../../components/Footer'
	import DepartIntroduce from '../../page/depart/Introduce';	
	import DepartGroup from '../../page/depart/Group';
	import DepartProduct from '../../page/depart/Product';
	import DepartComment from '../../page/depart/Comment';
	import wx from 'weixin-js-sdk'
	export default {
		data() {
			return {
				id: this.$route.params.id,
				dat: {}, //机构详情							
				subjectInfo: '',
				currentTab: 'DepartIntroduce', // currentTab 用于标识当前触发的子组件
				currentIndex: 0,
				tabs: [{
					'text': "简介",
					'content': 'DepartIntroduce'
				}, {
					'text': "团队",
					'content': 'DepartGroup'
				}, {
					'text': "产品",
					'content': 'DepartProduct'
				}, {
					'text': "评价",
					'content': 'DepartComment'
				}],
				isShow:true
			}
		},
		components: {
			VFooter,
			DepartIntroduce,
			DepartGroup,
			DepartProduct,
			DepartComment
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			this.getDepartdata();
		},
		mounted() {
			var v = this;
			var url = location.href.split('#')[0];
			v.$api.post('user/wxparams?url=' + encodeURIComponent(url), '', function(r) {
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
				var shareData = {
					title: v.dat.departname,
					desc: v.dat.description,
					link: location.href, // 分享链接
					imgUrl: v.dat.url, // 分享图片，使用逗号,隔开
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
			})
		},		
		methods: {
			getDepartdata(params) { //获取机构详情
				var v = this;
				v.$api.get('depart/departInfo/' + v.id + '', params, function(r) {
					Indicator.close();
					v.dat = r.data;
					localStorage.setItem('orgcode', v.dat.orgcode);
					localStorage.setItem('code', v.dat.orgcode);
					sessionStorage.setItem('departInfo', JSON.stringify(v.dat));
				})
			},
			toggleTab: function(index, tab) {
				this.currentTab = tab; // tab 为当前触发标签页的组件名
				this.currentIndex = index;
				if(index != 0){
					this.isShow = false;
				}
			},			
			//根据api从地址获取经纬度
			getTencentMap(address, name) {
				var v = this;
				var data = {　　　　　
					address: address,
					key: v.$TencentKey　　　
				}
				var url = "http://apis.map.qq.com/ws/geocoder/v1/?";
				data.output = "jsonp";
				$.ajax({
					type: "get",
					dataType: 'jsonp',
					data: data,
					jsonp: "callback",
					jsonpCallback: "QQmap",
					url: url,
					success: function(res) {
						//console.log(res);
						if(res.status == 0) {
							var location = res.result.location;
							var url = 'http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:' + location.lat + ',' + location.lng + ';title:' + name + ';addr:' + address + '&key=' + v.$TencentKey + '&referer=molyfun-web'
							window.location.href = url;
						}
					},
					error: function(err) {
						alert("服务端错误，请刷新浏览器后重试")
					}
				})
			}			
// 			timefilter(value) {
// 				var v = this;
// 				value = v.$utils.formatData(value, 'minute');
// 				return value;
// 			},
// 			descriptionFilter(value) {
// 				if(value) {
// 					if(value.length > 20) {
// 						value = value.substring(0, 62) + "...";
// 					}
// 				}
// 				return value;
// 			}
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>