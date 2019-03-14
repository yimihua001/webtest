<template>
	<div class="wrapper">
		<div class="scroll-wrapper notice-wrapper pading-bottom">
			<h3>机构列表</h3>
			<ul v-if="list.length != 0">
				<li v-for="(item,index) in list" :key="index"  @click="toggle(index)">
					<span :class="{current:index == departIndex}"></span>{{item.departname}}
				</li>
			</ul>
		</div>
		<footer class="footer" @click="confirm()">
			<span class="btn">确定</span>
		</footer>
	</div>
</template>

<script>
	import { Toast, Indicator, MessageBox } from 'mint-ui'
	export default {
		data() {
			return {
				list: JSON.parse(localStorage.getItem('departList')),
				departIndex:-1,
				applyInfo:{},
			}
		},
		methods: {
			toggle(index){
				var v = this;
				v.departIndex = index;
			},
			confirm(){
				var v = this;
				if(v.departIndex == -1){
					Toast('请选择机构');
					return false;
				}
				v.ifApplay()
			},
			
			//判断是否报过名
			ifApplay() {
				Indicator.open()
				var v = this;
				var params = {
					web: "web",
					departcode: v.list[v.departIndex].orgcode,
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
								Indicator.close();
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
			
			//获取报名须知
			getDepartNotice() {
				Indicator.open()
				var v = this;
				var params = {
					departcode: v.list[v.departIndex].orgcode,
					type: 'continue'
				};
				params = v.$utils.objToString(params);
				v.$api.get('enroll/notice?' + params, '', function(r) {
					Indicator.close();
					v.applyInfo = r.data;//报名信息（报名须知等等）
					v.storageApplyInfo()
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
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/apply";
</style>