<template>
	<div class="wrapper">
		<!--<mt-header title="基本信息" v-if="!isHide">
			<router-link to="/apply/notice" slot="left">
				<mt-button icon="back"></mt-button>
			</router-link>
		</mt-header>-->
		<div class="scroll-wrapper apply-baseInfo pading-bottom" v-if="!isHide">
			<h3>学生信息</h3>
			<div class="form-cell">
				<label class="form-cell-title">姓名</label>
				<input type="text" class="form-cell-value" v-model="data.studentEnrol.name" placeholder="请输入学生姓名(必填)" />
			</div>
			<div class="form-cell form-cell-picker" @click="choiceSex(2)">
				<label class="form-cell-title">性别</label>
				<div class="form-picker-value">
					<span v-if="data.studentEnrol.sex == ''">请选择(必填)</span>
					<span v-else>{{data.studentEnrol.sex}}</span>
				</div>
			</div>
			<div class="form-cell form-cell-picker" @click="openPicker">
				<label class="form-cell-title">出生日期</label>
				<div class="form-picker-value">
					<span v-if="data.studentEnrol.birthdatetime == ''">请选择(必填)</span>
					<span v-else>{{data.studentEnrol.birthdatetime}}</span>
				</div>
			</div>
			<div class="form-cell form-cell-picker" @click="choiceParity">
				<label class="form-cell-title">胎次</label>
				<div class="form-picker-value">
					<span v-if="data.studentEnrol.parityName == ''">请选择</span>
					<span v-else>{{data.studentEnrol.parityName}}</span>
				</div>
			</div>
			<div class="form-cell form-cell-picker" @click="choiceArea">
				<label class="form-cell-title">户籍</label>
				<div class="form-picker-value ellipsis_">
					<span v-if="data.studentEnrol.area == ''">请选择</span>
					<span v-else>{{data.studentEnrol.area}}</span>
				</div>
			</div>
			<div class="form-cell">
				<label class="form-cell-title">身份证</label>
				<input type="text" class="form-cell-value" v-model="data.studentEnrol.cardid" placeholder="请输入身份证号码" id="idCard" />
			</div>
			<h3>预留信息</h3>
			<div class="form-cell">
				<label class="form-cell-title">绑定邮箱</label>
				<input type="email" class="form-cell-value" v-model="data.email" placeholder="请输入绑定验证邮箱" />
			</div>
			<div class="form-cell">
				<label class="form-cell-title">绑定手机</label>
				<input type="tel" class="form-cell-value" v-model="data.phone" readonly/>
			</div>
			<div class="form-cell">
				<label class="form-cell-title">家庭住址</label>
				<input type="text" class="form-cell-value" v-model="data.address" placeholder="请输入家庭住址" />
			</div>
			<div v-for="(contact,index) in data.contactlist" :key="index">
				<h3>监护人<em>（监护人信息必须完整预留一个）</em></h3>
				<div class="form-cell">
					<label class="form-cell-title">关系</label>
					<input type="text" class="form-cell-value" v-model="contact.relationship" placeholder="请输入关系" />
				</div>
				<div class="form-cell">
					<label class="form-cell-title">姓名</label>
					<input type="text" class="form-cell-value" v-model="contact.name" placeholder="请输入姓名" />
				</div>
				<div class="form-cell form-cell-picker" @click="choiceSex(index)">
					<label class="form-cell-title">性别</label>
					<div class="form-picker-value">
						<span v-if="contact.sex == ''">请选择</span>
						<span v-else>{{contact.sex}}</span>
					</div>
				</div>
				<div class="form-cell">
					<label class="form-cell-title">身份证</label>
					<input type="text" class="form-cell-value" v-model="contact.cardid" placeholder="请输入身份证号码" />
				</div>
				<div class="form-cell form-cell-picker" @click="choiceEducation(index)">
					<label class="form-cell-title">文化程度</label>
					<div class="form-picker-value">
						<span v-if="contact.education == ''">请选择</span>
						<span v-else>{{contact.education}}</span>
					</div>
				</div>
				<div class="form-cell">
					<label class="form-cell-title">职业</label>
					<input type="text" class="form-cell-value" v-model="contact.occupation" placeholder="请输入职业" />
				</div>
				<div class="form-cell">
					<label class="form-cell-title">QQ</label>
					<input type="tel" class="form-cell-value" v-model="contact.qq" placeholder="请输入QQ" />
				</div>
				<div class="form-cell">
					<label class="form-cell-title">联系电话</label>
					<input type="tel" class="form-cell-value" v-model="contact.phone" placeholder="请输入联系电话" />
				</div>
				<p class="note">非中国大陆手机号，请联系客服进行注册：029-88322523</p>
			</div>
		</div>
		<footer class="footer" v-if="!isHide">
			<span class="btn" @click="infoSave">下一步</span>
		</footer>
		<!---时间picker-->
		<mt-datetime-picker ref="birthdatepicker" type="date" :endDate="endDate" :startDate="startDate" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm">
		</mt-datetime-picker>
		<!---胎次picker-->
		<mt-popup v-model="parityPopupVisible" position="bottom" class="mint-popup-4">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancelPicker">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="confirmParity">确定</span>
			</div>
			<mt-picker :slots="paritySlots" value-key="name" :itemHeight="40" :showToolbar="true" @change="onParityChange"></mt-picker>
		</mt-popup>
		<!---地区picker-->
		<mt-popup v-model="areaPopupVisible" position="bottom" class="mint-popup-4" ref="addresspicker">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancelPicker">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="confirmArea">确定</span>
			</div>
			<mt-picker :slots="myAddressSlots" :itemHeight="30" @change="onMyAddressChange"></mt-picker>
		</mt-popup>
		<!---学历picker-->
		<mt-popup v-model="educationVisible0" position="bottom" class="mint-popup-4">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancelPicker">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="confirmEducation">确定</span>
			</div>
			<mt-picker :slots="educationSlots0" value-key="name" :itemHeight="30" :showToolbar="true" @change="onEducationChange"></mt-picker>
		</mt-popup>

		<!---学历picker-->
		<mt-popup v-model="educationVisible1" position="bottom" class="mint-popup-4">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancelPicker">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="confirmEducation">确定</span>
			</div>
			<mt-picker :slots="educationSlots1" value-key="name" :itemHeight="30" :showToolbar="true" @change="onEducationChange"></mt-picker>
		</mt-popup>

		<!---性别picker-->
		<mt-popup v-model="sexPopupVisible0" position="bottom" class="mint-popup-4">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancelPicker">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="confirmSex">确定</span>
			</div>
			<mt-picker :slots="sexSlots0" :itemHeight="30" :showToolbar="true" @change="onSexChange"></mt-picker>
		</mt-popup>

		<!---性别picker-->
		<mt-popup v-model="sexPopupVisible1" position="bottom" class="mint-popup-4">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancelPicker">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="confirmSex">确定</span>
			</div>
			<mt-picker :slots="sexSlots1" :itemHeight="30" :showToolbar="true" @change="onSexChange"></mt-picker>
		</mt-popup>

		<!---性别picker-->
		<mt-popup v-model="sexPopupVisible2" position="bottom" class="mint-popup-4">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancelPicker">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="confirmSex">确定</span>
			</div>
			<mt-picker :slots="sexSlots2" :itemHeight="30" :showToolbar="true" @change="onSexChange"></mt-picker>
		</mt-popup>
		<!--<evaluate v-if="isHide" @on-cancel="cancel"></evaluate>-->
	</div>
</template>
<script>
	import { Toast, DatetimePicker } from 'mint-ui'
	import myaddress from '../../utils/address3.json'
	import mycountyList from '../../utils/address3-1.json'
	import Evaluate from '../apply/Evaluate'
	export default {
		data() {
			return {
				startDate: new Date('1970-01-01'),
				endDate: new Date(),
				isHide: false,
				ifReturn: false,
				data: {
					studentEnrol: { //基本信息
						name: '', //姓名
						birthdatetime: '', //出生日期
						sex: '', //性别
						parity: '', //胎次（value）
						parityName: '', //胎次（name)
						area: '', //地区
						province: '省',
						city: '市',
						county: '区/县',
						cardid: '', //身份证号，
						countryid: '', //城市id
					},
					email: localStorage.getItem('email'), //绑定邮箱
					phone: localStorage.getItem('phone'), //绑定电话
					address: localStorage.getItem('address'), //地址
					evaluatelist: [], //评估答案
					contactlist: [{
							relationship: "", //关系
							name: "", //姓名
							cardid: "", //身份证号
							education: "", //文化程度
							occupation: "", //职业
							qq: "", //qq
							phone: "", //联系电话
							sex: '', //性别
						},
						{
							relationship: "", //关系
							name: "", //姓名
							cardid: "", //身份证号
							education: "", //文化程度
							occupation: "", //职业
							qq: "", //qq
							phone: "", //联系电话
							sex: '', //性别
						},
					],
				},
				flag: false,
				parityPopupVisible: false, //控制胎次popup隐藏/展示
				areaPopupVisible: false, //控制选择地区popup隐藏/展示
				pickerVisible: false,
				educationVisible0: false, //控制选择学历popup隐藏/展示
				educationVisible1: false, //控制选择学历popup隐藏/展示
				sexPopupVisible0: false, //控制性别popup隐藏/展示
				sexPopupVisible1: false, //控制性别popup隐藏/展示
				sexPopupVisible2: false, //控制性别popup隐藏/展示
				educationIndex: -1, //学历index
				sexIndex: -1, //性别index
				ifOpenPicker: false,
				paritySlots: [{ //胎次数组
					flex: 1,
					values: ['一胎', '二胎', '三胎'],
					className: 'slot1',
					textAlign: 'center',
					defaultIndex: 0,
					value: "一胎",

				}],
				educationSlots0: [{ //学历数组
					flex: 1,
					values: ['小学', '初中', '高中', '中专', '大专', '本科', '硕士', '博士'],
					className: 'slot1',
					textAlign: 'center',
					defaultIndex: 0,
					value: '小学',
				}],
				educationSlots1: [{ //学历数组
					flex: 1,
					values: ['小学', '初中', '高中', '中专', '大专', '本科', '硕士', '博士'],
					className: 'slot1',
					textAlign: 'center',
					defaultIndex: 0,
					value: '小学',
				}],
				sexSlots0: [{ //性别数组
					flex: 1,
					values: ['男', '女'],
					className: 'slot1',
					textAlign: 'center',
					defaultIndex: 0,
					value: '男'
				}],
				sexSlots1: [{ //性别数组
					flex: 1,
					values: ['男', '女'],
					className: 'slot1',
					textAlign: 'center',
					defaultIndex: 0,
					value: '男',
				}],
				sexSlots2: [{ //性别数组
					flex: 1,
					values: ['男', '女'],
					className: 'slot1',
					textAlign: 'center',
					defaultIndex: 0,
					value: '男',
				}],
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
				],
				dateString: Object, //日期字符串转数组
				startDateString: Object, // 区间开始日期字符串转数组
				endDateString: Object, // 区间结束日期字符串转数组

			}
		},
		components: {
			Evaluate
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			this.getStudentInfo();
			if(sessionStorage.getItem('studentInfo') != null && sessionStorage.getItem('studentInfo') != '') {
				this.data = JSON.parse(sessionStorage.getItem('studentInfo'));
				this.ifReturn = true;
			}
			if(sessionStorage.getItem('address') == "null") {
				this.data.address = ""
			}

		},
		mounted() {
			var v = this;
			console.log(v.data);
			v.$nextTick(() => { //vue里面全部加载好了再执行的函数  （类似于setTimeout）
				v.myAddressSlots[0].defaultIndex = 0;

				//设置胎次选中值
				if(v.data.studentEnrol.parityName) {
					v.paritySlots[0].value = v.data.studentEnrol.parityName;
					v.paritySlots[0].defaultIndex = v.paritySlots[0].values.indexOf(v.data.studentEnrol.parityName)
				}
				//设置性别选中值
				if(v.data.studentEnrol.sex) {
					v.sexSlots0[0].value = v.data.studentEnrol.sex;
					v.sexSlots0[0].defaultIndex = v.sexSlots0[0].values.indexOf(v.data.studentEnrol.sex)
				}
				//设置性别选中值
				if(v.data.contactlist[0].sex) {
					v.sexSlots1[0].value = v.data.contactlist[0].sex;
					v.sexSlots1[0].defaultIndex = v.sexSlots1[0].values.indexOf(v.data.contactlist[0].sex)
				}
				//设置性别选中值
				if(v.data.contactlist[1].sex) {
					v.sexSlots2[0].value = v.data.contactlist[1].sex;
					v.sexSlots2[0].defaultIndex = v.sexSlots2[0].values.indexOf(v.data.contactlist[1].sex)
				}
				//设置学历选中值
				if(v.data.contactlist[0].education) {
					v.sexSlots1[0].value = v.data.contactlist[0].education;
					v.sexSlots1[0].defaultIndex = v.sexSlots1[0].values.indexOf(v.data.contactlist[0].education)
				}
				//设置学历选中值
				if(v.data.contactlist[1].education) {
					v.sexSlots2[0].value = v.data.contactlist[1].education;
					v.sexSlots2[0].defaultIndex = v.sexSlots2[0].values.indexOf(v.data.contactlist[1].education)
				}
			});
		},
		methods: {
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
					v.data.email = r.data.email; //绑定邮箱
					v.data.phone = r.data.phone; //绑定电话
					v.data.address = r.data.address; //地址
				});
			},
			infoSave() {
				var v = this;
				//查找城市id
				var citylist = [],
					countrylist = [];
				for(var i = 0; i < mycountyList.length; i++) {
					if(mycountyList[i].province.indexOf(v.data.studentEnrol.province) > -1) {
						citylist = mycountyList[i].citylist;
						break;
					}
				}
				for(var j = 0; j < citylist.length; j++) {
					if(citylist[j].city.indexOf(v.data.studentEnrol.city) > -1) {
						countrylist = citylist[j].countrylist;
						break;
					}
				}
				for(var j = 0; j < countrylist.length; j++) {
					if(countrylist[j].country.indexOf(v.data.studentEnrol.county) > -1) {
						v.data.studentEnrol.countryid = countrylist[j].id;
						break;
					}
				}
				v.dateString = new Date(v.data.studentEnrol.birthdatetime);
				v.startDateString = new Date(localStorage.getItem("studentagemin"));
				v.endDateString = new Date(localStorage.getItem("studentagemax"));
				console.log(v.startDateString);
				console.log(v.endDateString)
				var flag = v.validateForm();
				//				if(!flag) {
				//					return false;
				//				}
				sessionStorage.setItem('studentInfo', JSON.stringify(v.data));
				v.$router.push({
					path: '/apply/evaluate'
				});

			},
			//打开日历组件
			openPicker(picker) {
				this.ifOpenPicker = true;
				this.$refs['birthdatepicker'].open();
			},
			//选择日期
			handleConfirm(value) {
				var formatType = "second"
				this.data.studentEnrol.birthdatetime = this.$utils.formatData(value, formatType).split(' ')[0]
				document.body.removeEventListener("touchmove", this.preventDefault);
			},
			//打开胎次
			choiceParity() {
				this.ifOpenPicker = true;
				this.parityPopupVisible = true;
			},
			//打开性别picker
			choiceSex(index) {
				var v = this;
				v.ifOpenPicker = true;
				v.sexIndex = index;
				if(index == 0) {
					v.sexPopupVisible2 = true;
				} else if(index == 1) {
					v.sexPopupVisible1 = true;
				} else if(index == 2) {
					v.sexPopupVisible0 = true;
				}

			},
			//打开户口所在地
			choiceArea() {
				this.ifReturn = false;
				this.areaPopupVisible = true
				this.ifOpenPicker = true;
			},
			//打开学历
			choiceEducation(index) {
				var v = this;
				v.educationIndex = index;
				v.ifOpenPicker = true;
				if(index == 0) {
					v.educationVisible0 = true;
				} else if(index == 1) {
					v.educationVisible1 = true;
				}
			},
			//选择胎次
			onParityChange(picker, values) {
				if(this.parityPopupVisible == true) {
					this.data.studentEnrol.parityName = values[0];
				}
			},
			//选择学历
			onEducationChange(picker, values) {
				console.log(values);
				var v = this;
				if(v.educationIndex == 1) {
					v.data.contactlist[1].education = values[0];
				} else if(v.educationIndex == 0) {
					v.data.contactlist[0].education = values[0];
				}

			},

			//选择性别
			onSexChange(picker, values) {
				var v = this;
				console.log(picker);
				if(v.sexIndex == 2) {
					v.data.studentEnrol.sex = values[0];
				} else if(v.sexIndex == 0) {
					v.data.contactlist[0].sex = values[0];
				} else if(v.sexIndex == 1) {
					v.data.contactlist[1].sex = values[0];
				}
			},

			//确定胎次
			confirmParity() {
				this.parityPopupVisible = false
				this.ifOpenPicker = false
				//解决用户不滑动默认选择的问题
				if(this.data.studentEnrol.parityName == '') {
					this.data.studentEnrol.parityName = '一胎';
				}
			},

			//确定性别
			confirmSex() {
				//解决用户不滑动默认选择的问题
				var v = this;
				v.sexPopupVisible0 = false;
				v.sexPopupVisible1 = false;
				v.sexPopupVisible2 = false;
				v.ifOpenPicker = false
				console.log(v.sexIndex);
				if(v.sexIndex == 2) {
					if(v.data.studentEnrol.sex == '') {
						v.data.studentEnrol.sex = '男';
					}
				} else if(v.sexIndex == 1) {
					console.log(v.data.contactlist[1].sex)
					if(v.data.contactlist[1].sex == '') {
						v.data.contactlist[1].sex = '男';

					}
				} else if(v.sexIndex == 0) {
					if(v.data.contactlist[0].sex == '') {
						v.data.contactlist[0].sex = '男';
					}
				}

			},

			//确定地区
			confirmArea() {
				this.areaPopupVisible = false
				this.ifOpenPicker = false;
			},

			//确定学历
			confirmEducation() {
				var v = this;
				v.educationVisible0 = false;
				v.educationVisible1 = false;
				v.ifOpenPicker = false
				//解决用户不滑动默认选择的问题
				if(v.educationIndex == 0) {
					if(v.data.contactlist[0].education == '') {
						v.data.contactlist[0].education = '小学'
					}
				} else if(v.educationIndex == 1) {
					if(v.data.contactlist[1].education == '') {
						v.data.contactlist[1].education = '小学'
					}
				}
			},

			//关闭picker
			cancelPicker() {
				this.parityPopupVisible = false;
				this.sexPopupVisible0 = false;
				this.sexPopupVisible1 = false;
				this.sexPopupVisible2 = false;
				this.areaPopupVisible = false;
				this.educationVisible0 = false;
				this.educationVisible1 = false;
				v.ifOpenPicker = false;
			},

			onMyAddressChange(picker, values) {
				console.log(values);
				if(myaddress[values[0]]) {
					picker.setSlotValues(1, Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
					picker.setSlotValues(2, myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
					this.data.studentEnrol.province = values[0];
					if(values[1] == undefined) {
						this.data.studentEnrol.city = '';
					} else {
						this.data.studentEnrol.city = values[1];
					}
					if(values[2] == undefined) {
						this.data.studentEnrol.county = '';
					} else {
						this.data.studentEnrol.county = values[2];
					}
					console.log(this.data.studentEnrol.city + "/" + this.data.studentEnrol.county)
					if(this.ifReturn == false) {
						if(this.data.city != '' && this.data.studentEnrol.county != '') {
							this.data.studentEnrol.area = this.data.studentEnrol.province + '/' + this.data.studentEnrol.city + '/' + this.data.studentEnrol.county;
						} else {
							this.data.studentEnrol.area = this.data.studentEnrol.province;
						}
					}
					console.log(this.data.studentEnrol.area)
				}

			},
			validateForm() {
				var v = this;
				if(v.data.studentEnrol.name.trim() === '') {
					Toast('请填写姓名');
					return false;
				}
				if(v.data.studentEnrol.sex.trim() === '') {
					Toast('请选性别');
					return false;
				}
				if(v.data.studentEnrol.birthdatetime.trim() === '') {
					Toast('请选择出生年月');
					return false;
				}
				if(v.data.studentEnrol.birthdatetime.trim() != '' && v.dateString < v.startDateString) {
					Toast('年龄不符合该校入学要求');
					return false;
				}
				if(v.data.studentEnrol.birthdatetime.trim() != '' && v.dateString > v.endDateString) {
					Toast('年龄不符合该校入学要求');
					return false;
				}
				//				if(v.data.studentEnrol.parityName.trim() === '') {
				//					Toast('请选择胎次');
				//					return false;
				//				}
				//				if(v.data.studentEnrol.countryid.trim() === '') {
				//					Toast('请选择户口所在地');
				//					return false;
				//				}
				//				if(v.data.email === '' || v.data.email == null) {
				//					Toast('请输入绑定邮箱');
				//					return false;
				//				}
				if(v.data.phone === '' || v.data.phone == null) {
					Toast('请输入绑定手机号');
					return false;
				}
				//				if(v.data.address === '' || v.data.address == null) {
				//					Toast('请输入家庭地址');
				//					return false;
				//				}
//				if($("#idCard").val() != '' & !v.$card.checkCard(v.data.studentEnrol.cardid) && v.data.cardid != '') {
//					Toast('学生身份证格式不正确');
//					return false;
//				}
//				if(!v.$utils.validators.regMobile.test(v.data.phone.trim())) {
//					Toast('绑定手机号格式不正确');
//					return false;
//				}
				//				if(!(v.data.email === '' || v.data.email == null)){
				//					if(!v.$utils.validators.email.test(v.data.email.trim())) {
				//						Toast('绑定邮箱格式不正确');
				//						return false;
				//					}
				//				}

				//				if(v.data.contactlist[0].phone.trim() == '' && v.data.contactlist[1].phone.trim() == '') {
				//					Toast('监护人信息必须完整填写一个');
				//					return false;
				//				} else if(v.data.contactlist[0].name.trim() == '' && v.data.contactlist[1].name.trim() == '') {
				//					Toast('监护人信息必须完整填写一个');
				//					return false;
				//				} else if(v.data.contactlist[0].sex.trim() == '' && v.data.contactlist[1].sex.trim() == '') {
				//					Toast('监护人信息必须完整填写一个');
				//					return false;
				//				} else if(v.data.contactlist[0].cardid.trim() == '' && v.data.contactlist[1].cardid.trim() == '') {
				//					Toast('监护人信息必须完整填写一个');
				//					return false;
				//				} else if(v.data.contactlist[0].education.trim() == '' && v.data.contactlist[1].education.trim() == '') {
				//					Toast('监护人信息必须完整填写一个');
				//					return false;
				//				} else if(v.data.contactlist[0].occupation.trim() == '' && v.data.contactlist[1].occupation.trim() == '') {
				//					Toast('监护人信息必须完整填写一个');
				//					return false;
				//				} else if(v.data.contactlist[0].qq.trim() == '' && v.data.contactlist[1].qq.trim() == '') {
				//					Toast('监护人信息必须完整填写一个');
				//					return false;
				//				}
				//判断监护人1的信息
				//var obj = v.data.contactlist[0],
				//	flag = true;
				//				for(var key in obj) {
				//					if(!obj[key]) flag = false;
				//				}
				//				if(!flag) {
				//					Toast('请完善监护人1的信息');
				//					return false;
				//				}
//				if(!v.$utils.validators.regMobile.test(obj.phone.trim()) && obj.phone.trim() != '') {
//					Toast('监护人1联系电话格式不正确');
//					return false;
//				} else if(!v.$card.checkCard(obj.cardid.trim()) && obj.cardid.trim() != '') {
//					Toast('监护人1身份证号码格式不正确');
//					return false;
//				} else if(!v.$utils.validators.number.test(obj.qq.trim()) && obj.qq.trim() != '') {
//					Toast('监护人1qq号格式不正确');
//					return false;
//				}
				//判断监护人2的信息
				//var obj = v.data.contactlist[1],
					//flag = true;
				//				for(var key in obj) {
				//					if(!obj[key]) flag = false;
				//				}
				//				if(!flag) {
				//					Toast('请完善监护人2的信息');
				//					return false;
				//				}
//				if(!v.$utils.validators.regMobile.test(obj.phone.trim()) && obj.phone.trim() != '') {
//					Toast('监护人2联系电话格式不正确');
//					return false;
//				} else if(!v.$card.checkCard(obj.cardid.trim()) && obj.cardid.trim() != '') {
//					Toast('监护人2身份证号码格式不正确');
//					return false;
//				} else if(!v.$utils.validators.number.test(obj.qq.trim()) && obj.qq.trim() != '') {
//					Toast('监护人2qq号格式不正确');
//					return false;
//				} else {
//					return true;
//				}

			},
			//默认事件
			preventDefault(event) {
				event.preventDefault();
			},

		},
		watch: {　　
			'ifOpenPicker' () { //监听胎次picker状态
				console.log(this.ifOpenPicker)
				if(this.ifOpenPicker) {
					//阻止默认事件
					document.body.addEventListener("touchmove", this.preventDefault);
				} else {
					//取消默认事件
					document.body.removeEventListener("touchmove", this.preventDefault);
				}
			}
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/apply";
</style>