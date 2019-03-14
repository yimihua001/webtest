<template>
	<footer class="footer">
		<div style="width: 100%;" v-if="projectdat.gettopay == '1'">
			<span @click="goconsult()" class="btn-consult">咨询</span>
			<span class="btn" @click="gotoBuy()">立即购买</span>
		</div>
		<div style="width: 100%;" v-if="projectdat.gettopay != '1'">
			<span @click="goconsult()" class="btn-consult" v-if="projectdat.isapprove == 1">咨询</span>
			<span class="btn" @click="gotoapply()" v-if="projectdat.isapprove == 1">立即报名</span>
			<router-link class="btn" :to="{ name: 'Applyagency', params: { id: id }}" v-if="projectdat.isapprove != 1">申领机构</router-link>
		</div>

	</footer>
</template>
<script>
	import { Toast, Indicator, MessageBox } from 'mint-ui'
	export default {
		data() {
			return {
				code: '',
				id: this.$route.params.id,
			}
		},
		props: ['projectdat'],
		created() {},
		methods: {
			//跳转报名
			gotoapply() {
				//判断是否报过名
				var v = this;
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
					v.ifApplay();
				}
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
					Indicator.close()
					var list = r.data;
					if(Object.prototype.toString.call(list) == '[object Array]') {
						var html = '<div class="apply-message">';
						for(var i = 0; i < list.length; i++) {
							// html += '<p><span>' + list[i].name + '</span><span class="magl">报名成功</span><span>排名' + list[i].number + '</span></p>'
							if(list[i].sortflage) {
								html += `<p><span>${list[i].name}</span><span class="magl">${list[i].status}</span><span class="hasNum">排名${list[i].number}</span></p>`
							} else {
								html += `<p><span>${list[i].name}</span><span class="magl">${list[i].status}</span><span class="hasNum"></span></p>`
							}
						}
						html += '</div>';
						if(list.length < 3) {
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
						} else if(list.length == 3) {
							MessageBox.confirm('', {
								message: html,
								cancelButtonText: '确定',
								showConfirmButton: false
							}).then(action => {

							}, function() {
								//Indicator.close()
							});
						}
					} else {
						//获取报名须知
						setTimeout(() => {
							v.getDepartNotice();
						}, 500)
					}

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
					Indicator.close()
					localStorage.setItem('departid', r.data.departid);
					localStorage.setItem('departNoticeText', r.data.enrollrules);
					localStorage.setItem('studentagemax', r.data.studentagemax);
					localStorage.setItem('studentagemin', r.data.studentagemin);
					sessionStorage.setItem('applyNotice', r.data.enrollrules)
					v.$router.push({
						path: '/apply/notice'
					})
				})
			},

			//判断是否登录
			goconsult() {
				Indicator.open();
				var v = this;
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

				} else { //获取学生列表，根据列表判断是否先报名再咨询
					v.studentlist()
				}
			},

			//获取学生机构列表
			studentlist() {
				var v = this;
				var params = {
					status: 'pass',
					pageNum: 1,
					pageSize: 2
				}
				params = v.$utils.objToString(params);
				v.$api.get('depart/list?' + params, '', function(r) {
					v.records = r.data.records;
					Indicator.close();
					if(!v.records.length) {
						Toast('请先报名,再进行咨询');
					} else if(v.records.length == 1) {
						v.changedepart(v.records[0].id, v.records[0].studentid);
					} else {
						v.$router.push({
							name: "studentlist",
							params: {
								id: v.$route.params.id
							}
						})
					}

				}, function(r) {
					if(r.code == '1000') { //token验证失败
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
					}
				})
			},
			//学生信息
			getStudentInfo() {
				var v = this;
				v.$api.get('user/info/', '', function(r) {
					localStorage.setItem('userid', r.data.id);
					localStorage.setItem('username', r.data.username);
					localStorage.setItem('headimgurl', r.data.imgurl);
					localStorage.setItem('address', r.data.address);
					localStorage.setItem('phone', r.data.phone);
					localStorage.setItem('email', r.data.email);
					localStorage.setItem('txuserid', r.data.txuserid);
					localStorage.setItem('txusersign', r.data.txusersign);
					localStorage.setItem('studentid', r.data.studentid);
					v.customplanCreate(); //创建咨询
				}, function() {
					Toast('咨询创建失败,请重试');
				});
			},
			//创建咨询
			customplanCreate() {
				var v = this;
				v.$api.post('custom/customplanCreate', '', function(r) {
					console.log(r.data.imgroupid);
					localStorage.setItem('imgroupid', r.data.imgroupid);
					v.$router.push({
						name: "consulting",
						params: {
							id: r.data.id
						}
					})
				}, function(r) {
					if(r.code == 300) {
						var message = '<span>当前已有三条未完成咨询，请下载你好家长版客户端完成咨询后再发起新的咨询</span>';
						MessageBox.confirm(message, '').then(action => {
							window.location.href = v.url
						});
					} else {
						Toast('咨询创建失败,请重试');
					}
				})
			},
			//切换机构
			changedepart(departid, studentid) {
				var v = this;
				if(departid == '') {
					Toast('请选择学生');
					return false;
				}
				Indicator.open();
				var params = {
					departid: departid,
					studentid: studentid
				}
				console.log(params)
				params = v.$utils.objToString(params);
				v.$api.get('depart/changedepartfull?' + params, '', function(r) {
					v.getStudentInfo();
				}, function(r) {
					Toast('咨询创建失败,请重试');
				});
			},
			//购买
			gotoBuy() {
				//判断有没有登录
				var v = this;
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
					v.getStudentInfodata()
				}
			},
			//获取学生信息
			getStudentInfodata() {
				var v = this;
				v.$api.get('user/info/', '', function(r) {
					if(r.data.studentid == '') {
						//Toast('请使用APP绑定学生');
						MessageBox.confirm('', {
							message: '请下载“你好”App完善信息并加入机构后进行购买',
							confirmButtonText: '去下载',
						}).then(action => {
							v.$router.push({
								path: '/apply/download'
							});
						});
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
					id: v.id,
					type: 'subject'
				}
				sessionStorage.setItem('payInfo', JSON.stringify(payInfo));
				v.$api.post('order/addOrderSubject?subjectid=' + v.id, '', function(r) {
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
		},
	}
</script>