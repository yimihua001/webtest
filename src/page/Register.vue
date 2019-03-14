<template>
	<div class="wrapper">
		<div class="scroll-wrapper">
			<div class="hello-welcome">
				<h1>欢迎注册账号,</h1>
				<p>注册继续浏览</p>
			</div>
			<div class="user-form-wrapper register-wrapper">
				<section>
					<label for="phone">手机号码</label>
					<input type="tel" required="required" placeholder="请输入您的手机号" v-model="data.phone" class="ui-input" maxlength="11" />
					<i class="clear-input" @click="clearInput('phone')"></i>
				</section>
				<section>
					<label for="phone">用户名</label>
					<input type="text" required="required" placeholder="请输入您的用户名" v-model="data.username" class="ui-input" maxlength="20" />
					<i class="clear-input" @click="clearInput('username')"></i>
				</section>
				<section>
					<label for="password">密码</label>
					<input type="password" required="required" placeholder="请输入您的密码" v-model="data.password" class="ui-input" maxlength="20" />
					<i class="clear-input" @click="clearInput('password')"></i>
				</section>
				<section>
					<label for="phone">验证码</label>
					<input type="number" required="required" placeholder="请输入您的验证码" v-model="data.captchacode" class="ui-input" maxlength="4" />
					<button class="get-code" @click="getCaptcha">{{captchaSendText}}</button>
				</section>
				<button class="btn" @click="reg">注册</button>
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
					username: '',
					password: '',
					captchacode: ''
				},
				interval: '',
				time: 60, //验证码间隔时间
				captchaSendStatus: true, //验证码是否发送
				captchaSendText: '发送'
			}
		},
		methods: {
			//注册
			reg() {
				var v = this;
				if(this.data.phone.trim() === '') {
					Toast('请输入手机号');
					return false;
				} else if(this.data.username.trim() === '') {
					Toast('请输入用户名');
					return false;
				} else if(this.data.password.trim() === '') {
					Toast('请输入密码');
					return false;
				} else if(this.data.captchacode.trim() === '') {
					Toast('请输入验证码');
					return false;
				} else if(this.data.password.length < 6) {
					Toast('密码不能少于6位');
					return false;
				} 
				var params = v.$utils.objToString(v.data);
				Indicator.open();
				v.$api.post('user/regSimple?' + params, '', function(r) {
					localStorage.setItem('token', r.data.token);
					localStorage.setItem('userid', r.data.id);
					localStorage.setItem('username', r.data.username);
					localStorage.setItem('headimgurl', r.data.imgurl);
					localStorage.setItem('address', r.data.address);
					localStorage.setItem('phone', r.data.phone);
					localStorage.setItem('email', r.data.email);
					localStorage.setItem('txuserid', r.data.txuserid);
					localStorage.setItem('txusersign', r.data.txusersign);
					if(v.$route.query.redirect_uri) {
						v.$router.push({ //你需要接受路由的参数再跳转
							path: v.$route.query.redirect_uri
						});
					}else if(v.$route.query.type == 'apply') {
						v.getDepartList()//获取报名机构列表
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
				} else if(!this.$utils.validators.regMobile.test(v.data.phone.trim())) {
					Toast('手机号格式不正确');
					return false;
				}
				if(!v.captchaSendStatus) {
					return false;
				}
				Indicator.open();
				v.captchaSendStatus = false;
				v.captchaSendText = '发送中';
				v.$api.get('user/captcha/' + v.data.phone + '?type=reg', '',
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
					},function(r) {
						Indicator.close();
						Toast(r.msg);
						v.time = 60;
						v.captchaSendStatus = true;
						v.captchaSendText = '重新获取';
						window.clearInterval(v.interval);
					}
				)
			},
			//清除输入框文字
			clearInput(key) {
				this.$utils.clearInput(key, this.data);
			},
			//获取报名须知
			getDepartNotice() {
				Indicator.open()
				var v = this;
				var params = {
					web:"web",
					departcode: localStorage.getItem('orgcode'),
					type: 'continue'
				};
				params = v.$utils.objToString(params);
				v.$api.get('enroll/notice?' + params, '', function(r) {
					Indicator.close()
					localStorage.setItem('departid', r.data.departid);
					localStorage.setItem('studentagemax', r.data.studentagemax);
					localStorage.setItem('studentagemin', r.data.studentagemin);
					sessionStorage.setItem('applyNotice', r.data.enrollrules)
					v.$router.push({
						path: '/apply/notice'
					})
				})
			},
			
			//获取机构列表
			getDepartList() {
				Indicator.open()
				var v = this;
				v.$api.get('enroll/enrolldepartlist/' + localStorage.getItem('orgcode'), '', function(r) {
					Indicator.close();
					if(r.data.length > 1){
						localStorage.setItem('departList', JSON.stringify(r.data));
						v.$router.push({
							path: '/apply/depart'
						});
					}else{
						v.getDepartNotice()
					}
				})
			},
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