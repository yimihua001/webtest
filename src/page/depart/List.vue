<template>
	<div class="wrapper">
		<depart-list :cityname="yourcityname" :citycode="yourcitycode" :cityid="cityid" @chooseCity="choiceCity" :hide="hide"></depart-list>
		<city :is-show.sync='city.isShow' :on-choose='city.onChoose' :city-data='city.cityData' :local-city='city.localCity' :close="close"></city>
	</div>
</template>
<script>
	import cityData from '../../utils/city.json'
	// 导入要用到的子组件
	import DepartList from '../../components/DepartList'
	import { Indicator } from 'mint-ui'
	import City from '../../components/City'
	export default {
		data() {
			return {
				lng: '',
				lat: '',
				yourcityname: '全国',
				yourcitycode: '',
				city: {
					isShow: false,
					cityData: [],
					onChoose: null,
					localCity: {}
				},
				cityid: null,
				hide: true,
				pageSize: 10,
				timer: ''
			}
		},
		// 在components字段中，包含导入的子组件
		components: {
			DepartList,
			City,
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			var v = this;
			//判断来源(区别今日头条和微信)
			if(v.$route.query.from){
				localStorage.setItem('comefrom', v.$route.query.from);
			}
			//百度地图根据ip定位
			var myCity = new BMap.LocalCity();
			console.log(myCity)
			myCity.get(this.getCurrentCity);
			//百度地图精准定位
			//v.getLocation();
			//Indicator.open();
			// this.loadPageList()
			
		},
		mounted() {
			var v = this;
			//初始化城市列表
			this.city.cityData = cityData;
			this.city.localCity = {}
			var cityId = sessionStorage.getItem('cityId');
			//sessionStorage.setItem('cityId',null);
			// console.log(cityId);
			//验证城市id是否正确
			for(var i = 0; i < v.city.cityData.length; i++) {
				if(v.city.cityData[i].cityId == cityId) {
					v.cityid = v.city.cityData[i].cityId;
					break;
				}
			}
			//选择城市不为空,根据城市id获取城市名称和code
			console.log(v.cityid)
			if(v.cityid != null) {
				for(var i = 0; i < v.city.cityData.length; i++) {
					if(v.city.cityData[i].cityId == v.cityid) {
						v.yourcitycode = v.city.cityData[i].citySpell;
						v.yourcityname = v.city.cityData[i].cityName;
						console.log("v.yourcitycode="+v.yourcitycode)
						v.cityid = v.city.cityData[i].cityId;
						sessionStorage.setItem('cityId', v.cityid);
						break;
					}
				}
			}
			//选择城市
			this.city.onChoose = function(res) {
				if(res.cityName != undefined) {
					//ToDo: 选完城市后......
					v.city.isShow = false;
					v.yourcityname = res.cityName;
					v.yourcitycode = res.citySpell;
					v.cityid = res.cityId;
					sessionStorage.setItem('cityId', v.cityid);
				}
			}
		},
		methods: {
			//选择城市
			choiceCity: function() {
				this.city.isShow = true;
			},
			//关闭地图列表
			close() {
				this.city.isShow = false;
			},
			//百度地图根据ip定位城市
			getCurrentCity(result) {
				console.log(result)
				var v = this;
				var cityName = result.name;
				for(var i = 0; i < v.city.cityData.length; i++) {
					if(cityName.indexOf(v.city.cityData[i].cityName) > -1) {
						v.city.localCity = v.city.cityData[i];
						console.log(v.city.localCity)
						console.log(v.cityid)
						if(v.cityid == null) {
							v.yourcitycode = v.city.cityData[i].citySpell;
							v.yourcityname = v.city.cityData[i].cityName;
							v.cityid = v.city.cityData[i].cityId;
							sessionStorage.setItem('cityId', v.cityid);
						}
						break;
					}
				}
			},
			//百度地图定位(精准定位)
			getLocation() {
				// 百度地图API功能
				var v = this;
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					if(this.getStatus() == BMAP_STATUS_SUCCESS) {
						console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
						v.$utils.setCookie('currentLng', r.point.lng);
						v.$utils.setCookie('currentLat', r.point.lat);
						window.clearInterval(v.timer);
					} else {
						console.log('failed' + this.getStatus());
					}
				}, {
					enableHighAccuracy: true
				})
			},
		}
	}
</script>
<style lang='sass'>
	@import "../../../static/sass/pages/depart";
</style>