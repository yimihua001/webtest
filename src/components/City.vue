<template>
	<transition name="slide">
		<div class="xin-widget-citys animated" v-if="isShow">
			<div class="xin-widget-citys-header">
				<a href="javascript:void(0)" @click="hide">取消</a>
				<input type="text" placeholder=" 城市中文名或拼音" v-model="input">
			</div>
			<div class="xin-widget-citys-local bdb" @click="_chooseOne(localCity)">当前城市：{{localCity.cityName || "无法定位当前城市"}}</div>
			<div class="xin-widget-citys-content">
				<div class="xin-widget-citys-list" v-if="input == ''">
					<dl>
						<div v-for="(item, index) in letterList" :key="index">
							<div v-if="index == 'star'">
								<dt><em class="star-big"></em>热门城市</dt>
							</div>
							<div v-else>
								<dt v-if="isNaN(index)">{{index}}</dt>
							</div>
							<div v-for="(item2, index) in item" :key="index">
								<dd class="bdb" @click="_chooseOne(item2)">{{item2.cityName}}</dd>
							</div>
						</div>
					</dl>
				</div>
				<div class="xin-widget-citys-searchlist" v-if="input !== ''">
					<ul v-if="searchList.length!==0">
						<li class="bdb" v-for="(item,index) in searchList" :key="index"  @click="_chooseOne(item)">{{item.cityName}}</li>
					</ul>
					<div v-else class="nomatch">没有匹配城市</div>
				</div>
			</div>
			<div class="xin-widget-citys-letnav" v-if="isShow && input == '' && !simple" @touchmove="_touchLetters">
				<ol>
					<div v-for="(item, index) in letterList" :key="index">
						<li v-if="isNaN(index) && index=='star'" @click="_chooseLetter"><em class='star-small'></em></li>
						<li v-else @click="_chooseLetter" data-type="letter">{{index}}</li>
					</div>
				</ol>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		props: {
			isShow: {
				type: Boolean,
				default: false,
				required: false
			},
			simple: {
				type: Boolean,
				default: false
			},
			localCity: {
				type: Object
			},
			cityData: {
				type: Array
			},
			onChoose: {
				type: Function
			},
			initCity: {
				type: Function,
				default: null
			},
			/**
			 * call back when click cancel button
			 */
			close: {
				type: Function
			}
		},
		data: function() {
			return {
				input: '',
				list: '',
				targetLetter: '',
				searchList: [], //搜索结果
				hotList: [],
				letterList: [],
				result: '',
				defaultTrigger: true
			}
		},
		updated: function() {
			this.$utils.pagePreventDefault();
		},
		watch: {
			cityData: function() {
				console.log('l');
				if(this.cityData && this.cityData.length > 0) {
					this._formatCityList(this.cityData);
				}
			},
			input: function() {
				this._search();
			},
			targetLetter: function() {
				this._scrollView();
			}
		},
		activate: function(done) {
			var _this = this;

			done();
			if(this.cityData && this.cityData.length > 0) {
				this._formatCityList(this.cityData);
			}
		},
		methods: {
			show: function() {
				// this.isShow = true;
			},
			hide: function() {
				// this.isShow = false;
				this.input = '';
				this.searchList = [];
				this.close && this.close()
			},
			_chooseDefault: function() {
				var _this = this;
				var arr = this.list.filter(function(item) {
					return _this.localCity.cityId == item.cityId
				})
				if(arr.length > 0) {
					_this._chooseOne(arr[0]);
				} else {
					_this._chooseOne(this.list[0]);
				}
			},
			/**
			 * 点击字母
			 */
			_chooseLetter: function(e) {
				var symbol = e.target.getAttribute('data-type')
				this.targetLetter = e.target.innerText;
			},
			/**
			 * slide letters list
			 */
			_touchLetters: function(e) {
				e.preventDefault();

				var ol = document.querySelector('.xin-widget-citys-letnav ol'),
					liNum = document.querySelectorAll('.xin-widget-citys-letnav li').length,
					olHei = ol.clientHeight, //ol height
					liHei = Math.round(olHei / liNum), //li height
					olTop = ol.offsetTop + ol.offsetParent.offsetTop,
					olBot = olTop + olHei,
					touchY = e.touches[0].pageY,
					$wrapper = document.querySelector('.xin-widget-citys')

				switch(e.type) {
					case 'touchstart':
						if(touchY < olTop) {
							// 回顶
							$wrapper.scrollTop = 0;
						} else if(touchY > olBot) {
							// 到底
							$wrapper.scrollTop = 10000;
						}
						break;
					case 'touchmove':
						if(touchY < olBot && touchY > olTop) {
							var olTouchY = touchY - olTop,
								targetIndex = Math.ceil(olTouchY / liHei),
								target = document.querySelectorAll('.xin-widget-citys-letnav li')[targetIndex - 1]
							this.targetLetter = target.innerText;
						} else if(touchY <= olTop) {
							// 回顶
							$wrapper.scrollTop = 0;
						} else {
							// 到底
							$wrapper.scrollTop = 10000;
						}
						break;
				}
			},
			/**
			 * 滚动可视区 - Triggered by '_chooseLetter'
			 */
			_scrollView: function() {
				var dtList = document.querySelectorAll('.xin-widget-citys-list dt'),
					_this = this,
					_dtList = Array.prototype.slice.call(dtList)

				if(_dtList) {
					_dtList.forEach((value, index, array) => {
						if(value.innerText === _this.targetLetter) {
							var wrapper = document.querySelector('.xin-widget-citys-content')
							var scrollTop = value.offsetTop

							wrapper.scrollTop = scrollTop

							// setTimeout(function() {
							//     // 解决ios下 元素滚动的bug  现象是触发scroll时会导致部分滚动元素消失到二次元
							//     wrapper.style.width = (100 + (Math.round(Math.random() * 1000)) / 1000) + '%';
							// }, 0);
							return false;
						}
					})
				}
			},
			/**
			 * search city
			 */
			_search: function() {
				var reg = new RegExp(this.input == '' ? 'xxyy' :
					this.input, 'ig');
				var _arr = [];
				for(var i in this.letterList) {
					for(var j = 0; j < this.letterList[i].length; j++) {
						if(
							reg.test(this.letterList[i][j][
								'cityName'
							]) ||
							reg.test(this.letterList[i][j][
								'cityFirstLetter'
							]) ||
							reg.test(this.letterList[i][j][
								'citySpell'
							])
						) {
							_arr.push(this.letterList[i][j]);
						}
					}
				}
				this.searchList = _arr;
			},
			/**
			 * format data of city
			 * @param  {[Array]} arr [cityList]
			 */
			_formatCityList: function(arr) {
				var letterArr = {};

				if(this.simple) {
					for(var i = 0; i < arr.length; i++) {
						letterArr[i] = [];
						letterArr[i].push(arr[i]);
					}
				} else {

					for(var i = 0; i < arr.length; i++) {
						if(!(arr[i]['cityFirstLetter'] in letterArr)) {
							letterArr[arr[i]['cityFirstLetter']] = [];
							letterArr[arr[i]['cityFirstLetter']].push(arr[i]);
						} else {
							letterArr[arr[i]['cityFirstLetter']].push(arr[i]);
						}
					}
				}
				this.letterList = letterArr;
			},
			_chooseOne: function(obj) {
				this.onChoose && this.onChoose(JSON.parse(JSON.stringify(obj)));
				// this.hide();
			}
		}
	}
</script>