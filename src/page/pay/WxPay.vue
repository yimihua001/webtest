<template>
	<div class="payinfo">正在支付，请稍后</div>
</template>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>
<script>
	import { Indicator, Toast } from 'mint-ui'
	import wx from 'weixin-js-sdk'
	export default {
		data() {
			return {
				id: this.$route.params.id, //订单id
				redirect_uri: decodeURIComponent(this.$route.query.redirect_uri || '/'),
			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			this.getWxCode();
		},
		methods: {
			getWxCode() {
				Indicator.open();
				var v = this;
				if(v.$route.query.wxcode) {
					v.wxConfig();
				} else {
					if(v.$utils.isWeiXin()) { //微信浏览器中调用微信授权 
						var href = 'http://h5.dispathroute.molyfun.com/get-weixin-code.html?appid=' + v.$weixinAppid + '&scope=snsapi_userinfo&state=parents&redirect_uri=' + encodeURIComponent(location.href) + "&isMp=true"
						window.location.href = href;
					} else { //pc
						Toast('请使用微信打开');
						//Indicator.close();
					}
				}
			},
			wxConfig() {
				Indicator.open();
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
							'chooseWXPay'
						]
					});
					wx.ready(function() {
						v.payorderInfo()
					});
					wx.error(function(res) {
						alert(res.errMsg);
					});
				})
			},

			//订单微信支付
			payorderInfo() {
				var v = this;
				var params = {
					type: 'wxmp',
					code: v.$route.query.wxcode,
				}
				params = v.$utils.objToString(params);
				v.$api.post('order/payorderInfo/' + v.id + '?' + params, '', function(r) {
					Indicator.close();
					wx.chooseWXPay({
						appId: r.data.appId,
						timestamp: r.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						nonceStr: r.data.nonceStr, // 支付签名随机串，不长于 32 位
						package: r.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
						signType: r.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: r.data.paySign, // 支付签名
						success: function(res) {
							// 支付成功后的回调函数
							Toast('支付成功')
							v.$router.push({ //你需要接受路由的参数再跳转
								path: v.redirect_uri
							});
							
						}
					}, function(r) {
						Toast('支付失败');
						Indicator.close();
						v.$router.push({ //你需要接受路由的参数再跳转
							path: v.redirect_uri
						});
					});

				})
			},
		}

	}
</script>