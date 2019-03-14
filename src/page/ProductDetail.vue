<template>
	<div class="wrapper">
		<ul class="product-detail-type">
			<li v-for="(item,index) in tabs" :key="index" :class="{active:index == nowIndex}" @click="toggleTab(index,item.view)">{{item.text}}</li>
		</ul>
		<div class="scroll-wrapper product-detail-wrapper">
			<product-info :is="currentView" :product="dat" keep-alive></product-info>
		</div>
		<div class="product-detail-footer">
			<div class="info">
				<h2 class="disprice"><em>￥</em>{{dat.discountprice}}<span class="price">￥{{dat.price}}</span></h2>
				<p class="sell">{{dat.sellcount}}人已报名</p>
			</div>
			<div class="btn" @click="btnDownload">立即购买<span class="stock">（剩余{{dat.stock}}人）</span></div>
		</div>
	</div>
</template>
<script>
	import ProductInfo from '../components/ProductInfo'
	import ProductServer from '../components/productServer'
	import { Indicator, Toast } from 'mint-ui'
	import wx from 'weixin-js-sdk'
	/*import VFooter from '../components/Footer'*/
	export default {
		data() {
			return {
				text3: "产品详情",
				id: this.$route.params.id,
				dat: {}, //套餐详情
				currentView: 'ProductInfo', //默认选中ListProduct子组件
				nowIndex: 0, //导航索引值
				tabs: [{
					'text': '基本信息',
					'view': 'ProductInfo'
				}, {
					'text': '服务内容',
					'view': 'ProductServer'
				}],
			}
		},
		components: {
			ProductInfo,
			ProductServer
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			this.getData();

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
					title: v.dat.name,
					desc: v.dat.introduce,
					link: location.href, // 分享链接
					imgUrl: v.dat.url, // 分享图片，使用逗号,隔开
				};
				console.log(shareData)
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
		updated() {
			Indicator.close()
		},
		methods: {
			getData(params) { //获取套餐详情
				var v = this;
				v.$api.get('product/infobydepart/' + v.id + '', params, function(r) {
					v.dat = r.data;
					Indicator.close();
					console.log(v.dat);
				})
			},
			toggleTab(index, view) { //切换导航
				this.currentView = view;
				this.nowIndex = index;
			},
			goback() { //返回上一页
				this.$router.go(-1)
			},
			cancel() {
				this.$emit("on-cancel3");
			},
			btnDownload() {
				//判断有没有登录
				var v = this;
				Indicator.open();
				if(!localStorage.getItem('token')) {
					if(v.$utils.isWeiXin()) { //调用微信授权
						v.$router.push({
							name: 'wxlogin',
							query: {
								redirect_uri: v.$route.path
							}
						});
					} else { //调登录页面
						v.$router.push({
							name: 'login',
							query: {
								redirect_uri: v.$route.path
							}
						});
					}
				} else {
					v.getStudentInfo()
				}
			},
			//获取学生信息
			getStudentInfo() {
				var v = this;
				v.$api.get('user/info/', '', function(r) {
					if(r.data.studentid == '') {
						Toast('请先绑定学生');
						Indicator.close();
					} else {
						localStorage.setItem('userid', r.data.id);
						localStorage.setItem('username', r.data.username);
						localStorage.setItem('headimgurl', r.data.imgurl);
						localStorage.setItem('address', r.data.address);
						localStorage.setItem('phone', r.data.phone);
						localStorage.setItem('email', r.data.email);
						localStorage.setItem('txuserid', r.data.txuserid);
						localStorage.setItem('txusersign', r.data.txusersign);
						localStorage.setItem('studentid', r.data.studentid);
						v.createOrder();
					}

				});
			},

			//创建订单
			createOrder() {
				Indicator.open();
				var v = this;
				//缓存支付类型（支付完成后跳转）
				var payInfo = {
					id:v.id,
					type:'product'
				}
				sessionStorage.setItem('payInfo',JSON.stringify(payInfo));
				console.log(JSON.parse(sessionStorage.getItem('payInfo')))
				var params = {
					productList: [{
						id: v.id
					}],
				}
				v.$api.post('order/add?studentid=' + localStorage.getItem('studentid'), params, function(r) {
					Indicator.close();
					v.$router.push({
						name: 'payway',
						params: {
							id: r.data.id
						},
						query: {
							redirect_uri: v.$route.path
						}
					});
				})
			},

		}
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/depart";
</style>