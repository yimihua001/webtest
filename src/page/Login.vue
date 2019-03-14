<template>
	<div class="wrapper">
		<div class="scroll-wrapper">
			<div class="hello-welcome">
				<h1>欢迎加入我们,</h1>
				<p>登录继续浏览</p>
			</div>
			<div class="user-form-wrapper">
				<section>
					<label for="phone">手机号</label>
					<input type="tel" required="required" placeholder="请输入您的手机号" v-model="data.phone" class="ui-input" maxlength="11" />
					<i class="clear-input" @click="clearInput('phone')"></i>
				</section>
				<section>
					<label for="password">密码</label>
					<input type="password" required="required" placeholder="请输入您的密码" v-model="data.password" class="ui-input" maxlength="20" />
					<i class="clear-input" @click="clearInput('password')"></i>
				</section>
				<p class="fr" @click="gotoPwd">
					忘记密码？
				</p>
				<button class="btn" @click="login">登录</button>
				<p class="tc bottom-info">
					<span @click="gotoreg">新用户?注册</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import { Toast, Indicator, MessageBox } from 'mint-ui'
	export default {
		data() {
			return {
				data: {
					phone: '',
					password: '',
				},
				code: this.$route.query.code, //机构代码
				redirect_uri: decodeURIComponent(this.$route.query.redirect_uri || '/'),
				applyInfo:{},
				applyFlag: false
			}
		},
		created() {
			if(this.code) {
				localStorage.setItem('orgcode', this.code);
			}
			this.ifCodeNoNull()
			Indicator.close();
		},
		methods: {
			//判断code是否为空
			ifCodeNoNull() {
				let v = this;
				if(v.$utils.ifText(v.code) == '' && v.$route.query.type == "apply") {
					v.$router.push({
						path: '/apply/hint'
					})
				}
			},
			//登录
			login() {
				var v = this;
				if(v.data.phone.trim() === '') {
					Toast('请输入手机号');
					return false;
				} else if(v.data.password.trim() === '') {
					Toast('请输入密码');
					return false;
				}
				Indicator.open();
				var params = v.$utils.objToString(v.data);
				v.$api.post('user/login?' + params, '', function(r) {
					console.log(r);
					console.log(r.data.phone)
					v.applyInfo = r.data;
					//存储用户信息
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
					console.log(v.$route.query.type);
					console.log(v.redirect_uri);
					if(v.$route.query.type == 'apply') {
						console.log('跳转')
						v.getDepartList()
						//v.ifApplay() //判断是否报过名
					} else if(v.redirect_uri) {
						Indicator.close();
						v.$router.push({ //你需要接受路由的参数再跳转
							path: v.redirect_uri
						});
					} else {
						v.$router.push({
							path: '/',
						});
					}
				}, function(r) {
					Toast(r.msg);
				})
			},

			//判断是否报过名
			ifApplay() {
				Indicator.open()
				var v = this;
				var params = {
					web: "web",
					departcode: localStorage.getItem('orgcode'),
					type: 'enroll'
				};
				params = v.$utils.objToString(params);
				v.$api.get('enroll/notice?' + params, '', function(r) {
					var list = r.data;
					if(Object.prototype.toString.call(list) == '[object Array]') {
						var html = '<div class="apply-message">';
						for(var i = 0; i < list.length; i++) {
							if(list[i].sortflage) {
								html += `<p><span>${list[i].name}</span><span class="magl">${list[i].status}</span><span>排名${list[i].number}</span></p>`
							} else {
								html += `<p><span>${list[i].name}</span><span class="magl">${list[i].status}</span><span></span></p>`
							}
						}
						html += '</div>';
						if(list.length < 3) { //报名少于三条
							MessageBox.confirm('', {
								message: html,
								confirmButtonText: '继续报名',
								cancelButtonText: '确定'
							}).then(action => {
								//继续报名获取报名须知
								v.getDepartNotice();
							}, function() {
								Indicator.close()
							});
						} else if(list.length == 3) { //报名已经有三条，最多三条
							MessageBox.confirm('', {
								message: html,
								cancelButtonText: '确定',
								showConfirmButton: false
							}).then(action => {}, function() {
								Indicator.close()
								v.$router.push({
									path: '/apply/download'
								});
							});
						}
					} else {
						v.applyInfo = r.data;//报名信息（报名须知等等）
						v.storageApplyInfo()
					}

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
						v.ifApplay() //判断是否报过名
					}
				})
			},

			storageApplyInfo() {
				var v = this;
				localStorage.setItem('departid', v.applyInfo.departid);
				localStorage.setItem('studentagemax', v.applyInfo.studentagemax);
				localStorage.setItem('studentagemin', v.applyInfo.studentagemin);
				sessionStorage.setItem('applyNotice', v.applyInfo.enrollrules)
				Indicator.close()
				v.$router.push({
					path: '/apply/notice'
				})
			},

			//获取报名须知
			getDepartNotice() {
				Indicator.open()
				var v = this;
				var params = {
					departcode: localStorage.getItem('orgcode'),
					type: 'continue'
				};
				params = v.$utils.objToString(params);
				v.$api.get('enroll/notice?' + params, '', function(r) {
					Indicator.close();
					v.applyInfo = r.data;
					v.storageApplyInfo()
				})
			},

			//去注册
			gotoreg() {
				var v = this;
				if(v.$route.query.type == 'apply') {
					v.$router.push({
						name: 'register',
						query: {
							code: v.$route.query.code,
							departid: v.$route.query.departid,
							type: v.$route.query.type
						}
					});
				} else if(v.redirect_uri) {
					v.$router.push({
						name: 'register',
						query: {
							redirect_uri: v.redirect_uri
						}
					});
				}
			},
			//去修改密码
			gotoPwd() {
				var v = this;
				if(v.$route.query.type == 'apply') {
					v.$router.push({
						name: 'pwd',
						query: {
							code: v.$route.query.code,
							departid: v.$route.query.departid,
							type: v.$route.query.type
						}
					});
				} else if(v.redirect_uri) {
					v.$router.push({
						name: 'pwd',
						query: {
							redirect_uri: v.redirect_uri
						}
					});
				}
			},
			//清除输入框文字
			clearInput(key) {
				this.$utils.clearInput(key, this.data);
			},

		}
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/login";
</style>