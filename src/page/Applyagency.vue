<template>
	<div class="wrapper">
		<div class="apply-agency user-form-wrapper scroll-wrapper">
				<section>
					<label for="departname">机构名称</label>
					<input type="text" required="required" placeholder="请填写机构全称" v-model="data.departname" class="ui-input" />
					<i class="clear-input" @click="clearInput('departname')"></i>
				</section>
				<section>
					<label for="departmanager">机构负责人</label>
					<input type="text" required="required" placeholder="请填写机构负责人姓名" v-model="data.departmanager" class="ui-input" />
					<i class="clear-input" @click="clearInput('departmanager')"></i>
				</section>
				<section>
					<label for="departtel">联系电话</label>
					<input type="tel" required="required" placeholder="请填写负责人手机号" v-model="data.departtel" class="ui-input" maxlength="11" />
					<i class="clear-input" @click="clearInput('departtel')"></i>
				</section>
				<section  @click="choiceArea">
					<label for="departaddress">机构所在地</label>
					<input type="text" required="required" placeholder="请选择机构所在地" v-model="data.departaddress" class="ui-input"  readonly style="-webkit-user-select :none"/>
				</section>
				<section>
					<label for="departdetailaddress">机构详细地址</label>
					<input type="text" required="required" placeholder="请填写机构详细地址" v-model="data.departdetailaddress" class="ui-input"/>
					<i class="clear-input" @click="clearInput('departdetailaddress')"></i>
				</section>
				<mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
				<mt-picker :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
			</mt-popup>
		</div>
		<footer class="footer">
			<span class="btn"  @click="infoSave">提交</span>
		</footer>
		<!---地区picker-->
		<mt-popup v-model="areaPopupVisible" position="bottom" class="mint-popup-4" ref="addresspicker">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancelPicker">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="confirmArea">确定</span>
			</div>
			<mt-picker :slots="myAddressSlots" :itemHeight="30" @change="onMyAddressChange"></mt-picker>
		</mt-popup>
	</div>
</template>

<script>
	// 导入要用到的子组件
	import {Toast,Indicator , DatetimePicker} from 'mint-ui';
	import myaddress from '../utils/address3.json'
	//引入省市区数据
	export default {
		name: '',
		props: {},
		data() {
			return {
				data: {
					departname: '',
					departmanager: '',
					departdetailaddress: '',
					departaddress: '',
					departtel: '',
					province:'省',
					city:'市',
					county: '区/县',
				},
				id: this.$route.params.id,
				areaPopupVisible: false, //控制选择地区popup隐藏/展示
				popupVisible: false,
				myAddressSlots: [{
						flex: 1,
						defaultIndex: 1,
						values: Object.keys(myaddress), //省份数组
						className: 'slot1',
						textAlign: 'center'
					}, {
						divider: true,
						content: '-',
						className: 'slot2'
					}, {
						flex: 1,
						values: [],
						className: 'slot3',
						textAlign: 'center'
					},
					{
						divider: true,
						content: '-',
						className: 'slot4'
					},
					{
						flex: 1,
						values: [],
						className: 'slot5',
						textAlign: 'center'
					}
				]
				
			}
		},
		created() {
			console.log(this.data.departdetailaddress);
		},
		methods: {
			onMyAddressChange(picker, values) {
				//console.log(values);
				if(myaddress[values[0]]) { //这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
					var obj = myaddress[values[0]];;
					//console.log(Object.keys(myaddress[values[0]]));
					picker.setSlotValues(1, Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
					picker.setSlotValues(2, myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
					this.data.province = values[0];
					if(values[1] == undefined) {
						this.data.city = '';
					} else {
						this.data.city = values[1];
					}
					if(values[2] == undefined) {
						this.data.county = '';
					} else {
						this.data.county = values[2];
					}
					if(this.data.city != '' && this.data.county != '') {
						this.data.departaddress = this.data.province + '/' + this.data.city + '/' + this.data.county;
					} else {
						this.data.departaddress = this.data.province;
					}

				}
			},
			//打开地址所在地
			choiceArea() {
				this.ifReturn = false;
				this.areaPopupVisible = true
			},
			//确定地区
			confirmArea() {
				this.areaPopupVisible = false
			},
			//关闭picker
			cancelPicker() {
				this.areaPopupVisible = false;
				this.data.departaddress = '';
			},
			infoSave: function() {
				if(this.data.departname.trim() === '') {
					Toast('请输入机构名称')
				} else if(this.data.departtel.trim() === '') {
					Toast('请输入机构负责人手机号码')
				} else if(!this.$utils.validators.regMobile.test(this.data.departtel.trim())) {
					Toast('机构负责人手机号码格式不正确')
				} else if(this.data.departdetailaddress.toString().trim() === '') {
					Toast('请选择机构所在地')
				} else if(this.data.departaddress.trim() === '') {
					Toast('请输入机构详细地址')
				} else {
					this.doAdd()
				}
			},
			doAdd: function() {
				//提交机构信息
				var v = this;
				Indicator.open();
				var params = v.$utils.objToString(v.data);
				v.$api.post('depart/validation?' + params, '', function(r) {
						//v.$router.push({path:'/DepartDetail'});
							v.$router.push({
							name: "DepartDetail",
							params: {
								id: v.$route.params.id
							}
						})
						Indicator.close();
						
				})
			},
			//清除输入框文字
			clearInput(key) {
				this.$utils.clearInput(key, this.data);
			}
		},
		mounted() {
			this.$nextTick(() => { //vue里面全部加载好了再执行的函数  （类似于setTimeout）
				this.myAddressSlots[0].defaultIndex = 0
			});
		},
		watch: {　　　　　　　　
		
			'areaPopupVisible' () { //监听地区picker状态
				if(this.areaPopupVisible) {
					//阻止默认事件
					document.body.addEventListener("touchmove", this.preventDefault);
				} else {
					//取消默认事件
					document.body.removeEventListener("touchmove", this.preventDefault);
				}
			},
		
		
		}
	}
</script>

<style lang='sass'>
	@import "../../static/sass/pages/login";
</style>