<template>
	<div class="wrapper">
		<div class="scroll-wrapper">
			<div class="hello-welcome">
				<h1>您正在重置密码,</h1>
				<p>重置密码重新登录</p>
			</div>
			<div class="user-form-wrapper">
				<section>
					<label for="phone">手机号</label>
					<input type="tel" required="required" placeholder="请输入您的手机号" v-model="data.phone" class="ui-input" maxlength="11" />
					<i class="clear-input" @click="clearInput('phone')"></i>
				</section>
				<section>
					<label for="phone">验证码</label>
					<input type="number" required="required" placeholder="请输入您的验证码" v-model="data.captchacode" class="ui-input" maxlength="4" />
					<button class="get-code" @click="getCaptcha">{{captchaSendText}}</button>
				</section>
				<section>
					<label for="password">新密码</label>
					<input type="password" required="required" placeholder="请输入您的新密码" v-model="data.password" class="ui-input" maxlength="20" />
					<i class="clear-input" @click="clearInput('password')"></i>
				</section>
				<button class="btn" @click="changePwd">确定</button>
				<p class="note">非中国大陆手机号，请联系客服进行注册：029-88322523</p>
			</div>
		</div>
	</div>
</template>

<script>
	import { Toast,Indicator } from 'mint-ui'
	export default {
		data() {
			return {
				data: {
					phone: '',
					password: '',
					captchacode: '',

				},
				interval: '',
				time: 60, //验证码间隔时间
				captchaSendStatus: true, //验证码是否发送
				captchaSendText: '发送'
			}
		},
		methods: {
			back() {
				var v = this;
				v.$router.push({
					path: '/login',
					query: {
						code: v.code
					}
				});
			},
			//修改密码
			changePwd() {
				var v = this;
				if(v.data.phone.trim() === '') {
					Toast('请输入手机号');
					return false;
				} else if(this.data.captchacode.trim() === '') {
					Toast('请输入验证码');
					return false;
				} else if(this.data.password.trim() === '') {
					Toast('请输入密码');
					return false;
				} else if(v.data.password.length < 6) {
					Toast('密码不能少于6位');
					return false;
				}
				var params = v.$utils.objToString(v.data);
				Indicator.open();
				v.$api.post('user/recoverPasswordWithCode?' + params, '',
					function(r) {
						Indicator.close();
						if(v.$route.query.redirect_uri) {
							v.$router.push({ //你需要接受路由的参数再跳转
								path: v.$route.query.redirect_uri
							});
						} else if(v.$route.query.type == 'apply') {
							v.$router.push({
								name: 'login',
								query: {
									code: v.$route.query.code,
									departid: v.$route.query.departid,
									type: v.$route.query.type
								}
							});
						} else {
							v.$router.push({
								path: '/',
							});
						}

					})
			}, 
			//发送验证码
			getCaptcha() {
				var v = this;
				if(v.data.phone.trim() === '') {
					Toast('请输入手机号');
					return false;
				} else if(!this.$utils.validators.regMobile.test(this.data.phone.trim())) {
					Toast('手机号格式不正确');
					return false;
				}
				if(!v.captchaSendStatus) {
					return false;
				}
				v.captchaSendStatus = false;
				v.captchaSendText = '发送中';
				Indicator.open();
				v.$api.get('user/captcha/' + v.data.phone + '?type=recoverpass', '',
					function(r) {
						Indicator.close();
						v.interval = window.setInterval(function() {
							v.captchaSendText = v.time + 's';
							if((v.time--) <= 0) {
								v.time = 60;
								v.captchaSendStatus = true;
								v.captchaSendText = '重新获取';
								window.clearInterval(v.interval);
							}
						}, 1000);

					},
					function(r) {
						Indicator.close();
						Toast(r.msg);
						v.time = 60;
						v.captchaSendStatus = true;
						v.captchaSendText = '重新获取';
					}
				)
			},
			//清除输入框文字
			clearInput(key) {
				this.$utils.clearInput(key, this.data);
			}
		},
		watch: {
			'data.phone': function() {
				var v = this;
				if(v.data.phone.length == 11 && v.$utils.validators.regMobile.test(v.data.phone.trim())) {
					window.clearInterval(v.interval);
					v.captchaSendText = '发送';
					v.captchaSendStatus = true;
				}
			}
		}
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/login";
</style>