<template>
	<div class="wrapper">
		<div class="scroll-wrapper">
			<div class="hello-welcome">
				<h1>支付方式</h1>
			</div>
			<div class="user-form-wrapper">
<!--				<button class="btn" @click="wxpay()">微信</button>
-->				<button class="btn" @click="alipay()">支付宝</button>
			</div>
		</div>
	</div>
</template>
<style lang='sass'>
	@import "../../../static/sass/pages/login";
</style>
<script>
	import { Indicator, Toast } from 'mint-ui'
	export default {
		data() {
			return {
				id: this.$route.params.id, //订单id
			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			//Indicator.open();
			//this.getWxCode();
		},
		methods: {
			//微信支付跳转
			wxpay() {
				var v = this;
				if(v.$utils.isWeiXin()) { //微信浏览器中调用微信授权 
					v.$router.push({
						name: 'wxpay',
						params: {
							id: v.id
						},
						query: {
							redirect_uri: v.$route.query.redirect_uri
						}
					});
				} else { //pc
					Toast('请使用微信打开');
					Indicator.close();
				}

			},
			//订单支付宝支付
			alipay() {
				var v = this;
				localStorage.setItem('paytype','')
				var params = {
					type: 'alimobileweb',
					code: '',
				}
				params = v.$utils.objToString(params);
				v.$api.post('order/payorderInfo/' + v.id + '?' + params, '', function(r) {
					console.log(r);
					var alipayUrl = 'https://openapi.alipay.com/gateway.do?' + r.data;
					window.location.href = alipayUrl;
//					e.preventDefault();
//					e.stopPropagation();
//					e.stopImmediatePropagation();
					//ele.href 是GET到支付宝收银台的URL
//					console.log(_AP)
				//	_AP.pay(alipayUrl);
				})
			},
		}

	}
</script>
