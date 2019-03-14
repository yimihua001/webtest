<template>
	<div class="wrapper">
		<div class="scroll-wrapper">
			<div class="hello-welcome">
				<h1>请完善信息</h1>
			</div>
			<div class="user-form-wrapper">
				<section>
					<label for="phone">手机号</label>
					<input type="tel" required="required" placeholder="请输入您的预留手机号" v-model="data.phone" class="ui-input" maxlength="11" @blur="checkPhone(data.phone)" />
					<i class="clear-input" @click="clearInput('phone')"></i>
				</section>
				<section v-show="isHide">
					<label for="phone">验证码</label>
					<input type="number" required="required" placeholder="请输入您的验证码" v-model="data.captchacode" class="ui-input" maxlength="4" />
					<button class="get-code" @click="getCaptcha">{{captchaSendText}}</button>
				</section>
				<div v-if="offpwd">
					<section>
						<label for="password">设置密码</label>
						<input type="password" required="required" placeholder="请设置至少6位密码" v-model="data.password" class="ui-input" maxlength="20" v-if="offpwd" />
						<i class="clear-input" @click="clearInput('password')"></i>
					</section>
				</div>
				<button class="btn" @click='wxRegUser()' v-show="isHide">登录</button>
				<p>非中国大陆手机号，请联系客服进行注册：029-88322523</p>
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
					code: '', //机构代码
					captchacode: '',

				},
				interval: '',
				time: 60, //验证码间隔时间
				offpwd: false, //密码框是否禁用
				captchaSendText: '发送',
				captchaSendStatus: true, //验证码是否发送
				openid: this.$route.query.openid,
				isHide:true,

			}
		},
		created(){
				this.pushHistory(); 
		},
		mounted() {
			$(function(){  
		            pushHistory();  
		            var bool=false;  
		            setTimeout(function(){  
		                  bool=true;  
		            },1500);  
		            window.addEventListener("popstate", function(e) {  
		              if(bool)  
		                {  
		                  console.log("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能  
		                }  
		                pushHistory();  
		                  
		        }, false);  
		             function pushHistory() {  
		        var state = {  
		            title: "title",  
		            url: "#"  
		        };  
		        window.history.pushState(state, "title", "#");  
		    }  
		        });
		},
		methods: {
			//验证手机号是否存在
			checkPhone(phone) {
				console.log(phone);
				var v = this;
				if(phone) {
					var params = v.$utils.getTokenVerify() + '&phone=' + phone;
					v.$api.post('user/checkPhoneThirdparty?' + params, '', function(r) {
						//手机号被注册	
						v.offpwd = false;
						v.isHide = true;
					}, function(r) {
						if(r.code == '1030') { //手机号没有注册,需要输入密码
							v.offpwd = true;
							v.isHide = true;
						}else if(r.code == '1070') { //该手机号已被第三方绑定
							v.offpwd = false;
							v.isHide = false;
							Toast(r.msg);
						}else {
							Toast(r.msg);
							v.isHide = false;
						}
					})
				}

			},
			//第三方注册(微信)
			wxRegUser() {
				var v = this;
				if(v.data.phone.trim() === '') {
					Toast('请输入手机号');
					return false;
				} else if(v.data.captchacode.trim() === '') {
					Toast('请输入验证码');
					return false;
				} else if(v.data.password.length == 0 && v.offpwd){
					Toast('请输入密码');
					return false;
				} else if(v.data.password.length < 6 && v.offpwd) {
					Toast('密码不能少于6位');
					return false;
				}
				var params = 'phone=' + v.data.phone + '&captchacode=' + v.data.captchacode + '&openid=' + v.openid + '&password=' + v.data.password + '&type=2';
				v.$api.post('user/regThirdparty?' + params, '',
					function(r) {
						localStorage.setItem('token', r.data.token);
						localStorage.setItem('userid', r.data.id);
						localStorage.setItem('username', r.data.username);
						localStorage.setItem('headimgurl', r.data.imgurl);
						localStorage.setItem('address', r.data.address);
						localStorage.setItem('phone', r.data.phone);
						localStorage.setItem('email', r.data.email);
						localStorage.setItem('txuserid', r.data.txuserid);
						localStorage.setItem('txusersign', r.data.txusersign);
						Toast('登录成功');
						if(v.$route.query.redirect_uri) {
							 v.$router.push({//你需要接受路由的参数再跳转
	                            path: v.$route.query.redirect_uri
	                         });
						} else {
							v.$router.push({
								path: '/',
							});
						}
					},

					function(r) {
						Toast(r.msg);
						Indicator.close();
					}
				)
			},
			//获取验证码
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
				v.$api.get('user/captcha/' + v.data.phone + '?type=regthirdparty', '',
					function(r) {
						v.interval = window.setInterval(function() {
							v.captchaSendText = v.time + 's';
							if((v.time--) <= 0) {
								v.time = 60;
								v.captchaSendStatus = true;
								v.captchaSendText = '重新获取';
								window.clearInterval(v.interval);
							}
						}, 1000);
						v.$emit("get_captcha_success"); //验证码获取成功
						console.log('成功')

					},
					function(r) {
						v.time = 60;
						v.captchaSendStatus = true;
						v.captchaSendText = '重新获取';
						v.$emit("get_captcha_error"); //验证码获取失败
					})
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