<template>
	<div class="wrapper pading-bottom">
		<div class="scroll-wrapper">
			<div class="student-list-wrapper" v-if="records.length != 0 " infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
				<ul class="option" v-for="(item,index) in records" :key="index">
					<li @click="choose(item.id,item.studentid,index)" :class="{active:index == nowIndex}">
						<span class="name">{{item.departname}}<em>（{{item.studentremakname}}）</em></span>
						<span class="status">{{item.status}}</span>
					</li>
				</ul>
				<div class="loading-more" v-if="!queryLoading">
					<mt-spinner color="rgb(100, 100, 100)" v-if="moreLoading&&!allLoaded"></mt-spinner>
				</div>
				<div class="no-content" v-if="moreLoading&&allLoaded && records.length == 0">没有内容</div>
			</div>
		</div>
		<footer class="footer" v-if="records.length != 0">
			<span @click="changedepart()" class="btn">提交</span>
		</footer>
	</div>

</template>

<script>
	import { Toast, Radio, Indicator, MessageBox } from 'mint-ui'
	export default {
		data() {
			return {
				nowIndex: -1,
				queryLoading: false,
				moreLoading: false,
				allLoaded: false,
				pageSize: 20,
				pageNum: 1,
				records: [],
				departid: '', //机构id
				studentid: '', //学生id
			}
		},
		created() {
			Indicator.open();
			var v = this;
			setTimeout(function() {
				v.list(); //页面刷新
			}, 500);

		},
		methods: {
			choose(departid, studentid, index) {
				var v = this;
				v.nowIndex = index;
				v.departid = departid;
				v.studentid = studentid
			},
			//学生机构列表
			list() {
				var v = this;
				var params = {
					status: 'pass',
					pageNum: v.pageNum,
					pageSize: v.pageSize
				}
				params = v.$utils.objToString(params);
				v.$api.get('depart/list?' + params, '', function(r) {
					Indicator.close();
					if(v.pageNum == 1) {
						v.records = [];
						Indicator.close();
					}
					v.records = v.records.concat(r.data.records);
					if(v.records.length == r.data.total) {
						v.allLoaded = true;
					}
					console.log(v.records);
					v.moreLoading = v.allLoaded;
				})
			},
			//学生信息
			getStudentInfo() {
				var v = this;
				v.$api.get('user/info/', '', function(r) {
					localStorage.setItem('txuserid', r.data.txuserid);
					localStorage.setItem('txusersign', r.data.txusersign);
					v.customplanCreate(); //创建咨询
				});
			},
			//创建咨询
			customplanCreate() {
				var v = this;
				v.$api.post('custom/customplanCreate', '', function(r) {
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
							window.location.href = v.$downloadUrl
						});
					}
				})

			},
			//切换机构
			changedepart() {
				var v = this;
				if(v.departid == '') {
					Toast('请选择学生');
					return false;
				}
				Indicator.open();
				var params = {
					departid: v.departid,
					studentid: v.studentid
				}
				console.log(params)
				params = v.$utils.objToString(params);
				v.$api.get('depart/changedepartfull?' + params, '', function(r) {
					v.getStudentInfo();
				});
			},
			loadmore() {
				var v = this;
				if(v.allLoaded) {
					v.moreLoading = true;
					return;
				}
				if(v.queryLoading) {
					return;
				}
				v.moreLoading = !this.queryLoading;
				v.pageNum++;
				setTimeout(() => {
					v.list();
				}, 500);
			},

		},
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/consult"
</style>