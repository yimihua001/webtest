<template>
</template>
<script>
	import { Toast, Indicator } from 'mint-ui'
	export default {
		data() {
			return {
				redirect_uri: this.$route.query.redirect_uri,
			}
		},
		created() {
			var v = this;
			v.doRedirect();
		},
		methods: {
			//是否调用微信授权
			doRedirect() {
				Indicator.open();
				var v = this;
				var redirect_uri = location.href;
				var base = location.href.split('#')[0];
				if(base.indexOf('?') > 0 ){
					redirect_uri = base.split('?')[0]+'#'+location.href.split('#')[1];
				}
				if(v.$route.query.wxcode) {
					v.thirdWxLogin();
				} else {
					if(v.$utils.mobileDetect() == 1 || v.$utils.mobileDetect() == 2) { //移动端
						var href = 'http://h5.dispathroute.molyfun.com/get-weixin-code.html?appid=' + v.$weixinAppid + '&scope=snsapi_userinfo&state=parents&redirect_uri=' + encodeURIComponent(redirect_uri) + "&isMp=true"
					} else { //pc
						var href = 'http://h5.dispathroute.molyfun.com/get-weixin-code.html?appid=' + v.$openWxAppid + '&scope=snsapi_login&state=parents&redirect_uri=' + encodeURIComponent(location.href)
					} 
					window.location.href = href;
				}
			},

			//第三方登录
			thirdWxLogin() {
				var v = this;
				if(v.$utils.mobileDetect() == 1 || v.$utils.mobileDetect() == 2) { //移动端
					var webtype = 'authorize'
				} else { //pc
					var webtype = 'qrconnect'
				}
				var params = v.$utils.getTokenVerify() + '&code=' + v.$route.query.wxcode + '&webtype=' + webtype;
				v.$api.post('user/loginthirdparty?' + params, '', function(r) {
					localStorage.setItem('token', r.data.token);
					localStorage.setItem('userid', r.data.id);
					localStorage.setItem('username', r.data.username);
					localStorage.setItem('headimgurl', r.data.imgurl);
					localStorage.setItem('address', r.data.address);
					localStorage.setItem('phone', r.data.phone);
					localStorage.setItem('email', r.data.email);
					localStorage.setItem('txuserid', r.data.txuserid);
					localStorage.setItem('txusersign', r.data.txusersign);
					localStorage.setItem('studentid', r.data.studentid);
					Toast('登录成功');
					if(v.redirect_uri) {
						v.$router.push({ //你需要接受路由的参数再跳转
							path: v.redirect_uri
						});
					} else {
						v.$router.push({
							path: '/',
						});
					}
				}, function(r) {
					if(r.code == '1020') {
						v.$router.push({
							name: "wxreg",
							query: {
								redirect_uri: v.redirect_uri,
								openid: r.msg
							}
						})
					} else {
						Toast(r.msg);
					}
				})
			},
		},
	}
</script>