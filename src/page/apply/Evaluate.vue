<template>
	<div class="wrapper pading-bottom">
		<!--<mt-header title="测评表">
			<mt-button slot="left" icon="back" @click="cancel"></mt-button>
		</mt-header>-->
		<div class="scroll-wrapper evaluate-wrapper">
			<ul  v-if="items.length != 0">
				<li v-for="(item,index) in items" :key="index">
					<!---type 1单选，2多选，3填空，4判断-->
					<mt-radio :title="item.content+'(单选)'" v-model="item.radioValue" :options="item.options" v-if="item.type == 1">
					</mt-radio>
					<!-- <mt-radio :title="item.content+'(单选)'" v-model="item.radioValue" :options="item.options" v-if="item.type == 3">
					</mt-radio> -->
					<mt-checklist :title="item.content+'(多选)'" v-model="item.checklistValue" :options="item.options" v-if="item.type == 2">
					</mt-checklist>

				</li>
			</ul>
			<p v-else>暂无评测</p>
		</div>
		<footer class="footer">
			<span class="btn" @click="infoSave">提交</span>
		</footer>
	</div>
</template>

<script>
	import { Toast, DatetimePicker, MessageBox,Indicator } from 'mint-ui'
	export default {
		data() {
			return {
				departid: localStorage.getItem('departid'), //机构id
				items: [],
				data: JSON.parse(sessionStorage.getItem('studentInfo')) //要提交的数据
			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			this.getData();
		},
		methods: {
			//获取评估表信息
			getData() {
				var v = this;
				var params = {
					departid: v.departid,
				};
				params = v.$utils.objToString(params);
				v.$api.get('enroll/evaluatelist?' + params, '', function(r) {
					v.items = r.data.records;

					for(var i = 0; i < v.items.length; i++) {
						v.items[i].options = [];
						v.items[i].radioValue = '';
						v.items[i].checklistValue = [];
						var option = v.items[i].option;
						for(var j = 0; j < option.length; j++) {
							v.items[i].options.push({
								'label': option[j].content,
								'value': option[j].id
							})
						}

					}
				})
			},

			infoSave() {
				/*var message = `<img src="../../../static/image/1.jpg"><h3>报名成功</h3>当前排名：<span class="message">` + 1 + `</span>`;
						MessageBox.alert(message,'')*/
				var v = this;
				//形成评测列表答案
				if(v.items.length != 0) {
					for(var i = 0; i < v.items.length; i++) {
						if(v.items[i].type == 1) { //单选
							if(v.items[i].radioValue == '') {
								Toast('请将评测表填写完整');
								return false;
							}
							v.data.evaluatelist.push({
								'id': v.items[i].radioValue
							})
						} else if(v.items[i].type == 2) { //多选
							if(v.items[i].checklistValue.length == []) {
								Toast('请将评测表填写完整');
								return false;
							}
							var checklistValue = v.items[i].checklistValue;
							for(var j = 0; j < checklistValue.length; j++) {
								v.data.evaluatelist.push({
									'id': checklistValue[j]
								})
							}
						}
					}
				}
				var contactlist = v.data.contactlist;
				for(var i = 0; i < contactlist.length; i++) {
					if(v.data.contactlist[i].name == '' && v.data.contactlist[i].phone == '' && v.data.contactlist[i].cardid == '' && v.data.contactlist[i].education == '' && v.data.contactlist[i].occupation == '' && v.data.contactlist[i].qq == '' && v.data.contactlist[i].relationship == '') {
						v.data.contactlist.splice(i, 1);
					}
				}
				if(v.data.studentEnrol.parityName == '一胎'){
					v.data.studentEnrol.parity = '1'
				}else if(v.data.studentEnrol.parityName == '二胎'){
					v.data.studentEnrol.parity = '2'
				}else if(v.data.studentEnrol.parityName == '三胎'){
					v.data.studentEnrol.parity = '3'
				}
				console.log(v.data.studentEnrol);
				Indicator.open();
				//提交报名信息
				var params = {
					departid: v.departid
				};
				params = v.$utils.objToString(params);
				v.$api.post('enroll/infosubmit?' + params, v.data, function(r) {
					sessionStorage.removeItem('studentInfo');//清空基本信息
					if(r.data.orderflag == 0) { //不排名
						var message = '<h3  class="tc">报名成功</h3>';
						MessageBox.alert(message,'').then(action => {
							v.$router.push({
								path: '/apply/download'
							});
						});
					} else if(r.data.orderflag == 1) { //排名
						var message = '<h3 class="tc">报名成功</h3><p>当前排名：<span class="message tc">' + r.data.count + '</span></p>';
						MessageBox.alert(message,'').then(action => {
							v.$router.push({
								path: '/apply/download'
							});
						});
					}
					Indicator.close();
				})
			},
			cancel() {
				this.$emit("on-cancel");
			}
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/apply";
</style>