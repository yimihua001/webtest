export default {
	pictureDefalutPhoto: '../../static/image/img-default.png',
	headImgurl: '../../static/image/moren.png',
	letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
	toalPage: function(total, pageSize) { //计算总页数
		var totalPage = parseInt(total / pageSize);
		if(total % pageSize != 0) {
			totalPage = totalPage + 1;
		}
		return totalPage
	},
	formatData: function(value, formatType) { //时间戳格式化
		if(value == undefined) {
			var date = new Date();
		} else {
			var date = new Date(value);
		}
		var Y = date.getFullYear(),
			m = date.getMonth() + 1,
			d = date.getDate(),
			H = date.getHours(),
			i = date.getMinutes(),
			s = date.getSeconds();
		if(m < 10) {
			m = '0' + m;
		}
		if(d < 10) {
			d = '0' + d;
		}
		if(H < 10) {
			H = '0' + H;
		}
		if(i < 10) {
			i = '0' + i;
		}
		if(s < 10) {
			s = '0' + s;
		}
		var time;
		switch(formatType) {
			case "second":
				time = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
				break;
			case "minute":
				time = Y + '-' + m + '-' + d + ' ' + H + ':' + i;
				break;
			case "hour":
				time = Y + '-' + m + '-' + d + ' ' + H;
				break;
			case "day":
				time = Y + '-' + m + '-' + d;
				break;
			default:
				break;
		}
		return time;
	},
	//设置cookie
	setCookie: function(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		console.info(cname + "=" + cvalue + "; " + expires);
		document.cookie = cname + "=" + cvalue + "; " + expires;
		console.info(document.cookie);
	},
	//获取cookie
	getCookie: function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while(c.charAt(0) == ' ') c = c.substring(1);
			if(c.indexOf(name) != -1) return c.substring(name.length, c.length);
		}
		return "";
	},
	headImgLoad: function(url, callback) { //加载图片
		var v = this;
		var img = new Image();
		img.src = url;
		img.onerror = function() {
			callback(v.headImgurl);
		};
		img.onload = function() {
			console.log(img.complete);
			if(img.complete) {
				callback(img.src);
			}
		};
	},

	imgLoad: function(url, callback) { //加载头像
		var v = this;
		var img = new Image();
		img.src = url;
		img.onerror = function() {
			callback(v.pictureDefalutPhoto);
		};
		img.onload = function() {
			if(img.complete) {
				callback(img.src);
			}
		};
	},
	getUserAgents: function() {
		var device_type = navigator.userAgent; //获取userAgent信息
		return device_type;
		//var md = new MobileDetect(device_type);//初始化mobile-detect
		//		var os = md.os();//获取系统
		//		var model = "";
		//		if (os == "iOS") {//ios系统的处理
		//				os = md.os() + md.version("iPhone");
		//				model = md.mobile();
		//		} else if (os == "AndroidOS") {//Android系统的处理
		//				os = md.os() + md.version("Android");
		//				var sss = device_type.split(";");
		//				var i = sss.contains("Build/");
		//				if (i > -1) {
		//						model = sss[i].substring(0, sss[i].indexOf("Build/"));
		//				}
		//		}else{//PC端处理
		//			var name = device_type.split("(");
		//			var arr = name[1].split(")");
		//			model = arr[0]
		//		}
		//		if(os != null){
		//			return model+";"+os;
		//		}else{
		//			return model
		//		}
	},
	//获取操作系统
	mobileDetect: function() {
		var device_type = navigator.userAgent; //获取userAgent信息
		var md = new MobileDetect(device_type); //初始化mobile-detect
		var os = md.os(); //获取系统
		var model = "";
		if(os == "iOS") { //ios系统的处理
			return 1
		} else if(os == "AndroidOS") { //Android系统的处理
			return 2
		} else { //PC端处理
			return 3
		}

	},

	//sha1加密
	sha1Jiami: function(timestamp, nonce) {
		var arr = new Array();
		arr[0] = timestamp;
		arr[1] = "ea21ab6d95e14559a1be79620dbb6737";
		arr[2] = nonce;
		arr = arr.sort();
		var signature = hex_sha1(arr[0] + arr[1] + arr[2]);
		return signature;
	},
	//获取随机数
	getRandom: function(min, max) { //获取随机数
		var r = Math.random() * (max - min);
		var re = Math.round(r + min);
		re = Math.max(Math.min(re, max), min);
		return re;
	},
	//获取随机的大写字母
	getRandomLetter: function(num) {
		var le = "";
		for(var i = 0; i < num; i++) {
			var random = this.getRandom(0, 25);
			le = le + this.letter[random];
		}
		return le;
	},
	//家长版（验证）
	getTokenVerify: function() {
		var $timestamp = new Date().getTime(),
			$nonce = this.getRandomLetter(10);
		var commonParam = '';
		commonParam += 'nonce=' + $nonce;
		commonParam += '&timestamp=' + $timestamp;
		commonParam += '&signature=' + this.sha1Jiami($timestamp, $nonce);
		return commonParam;
	},
	//表单验证
	validators: {
		regMobile: /^0?1[3|4|5|7|8][0-9]\d{8}$/, //手机
		regTel: /^0[\d]{2,3}-[\d]{7,8}$/, //电话号码(限制开头一定为0)匹配格式：3/4位区号-7/8位电话号码
		regTelPar: /^0[\d]{2,3}[\d]{7,8}$/, //电话号码(限制开头一定为0),匹配格式：区号与电话号码之间没有一横
		regIdCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证号码
		number: /^[0-9]*$/, //数字
		date: /^(\d{4})-(\d{2})-(\d{2})$/, //日期
		pattern: /^[a-zA-Z0-9]{6,10}$/, //只包含字母和数字
		regIntegetOrFloat: /^[0-9]+([.]{1}[0-9]+){0,1}$/, //小数或者整数
		regSign: /#[^#]+#/g,
		email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ //邮箱
	},
	//对象转'&'拼接的字符串
	objToString(obj) {
		var params = '';
		for(var key in obj) {
			if(params == '') {
				params += key + '=' + obj[key];
			} else {
				params += '&' + key + '=' + obj[key];
			}
		}
		return params;
	},
	//判断是否为空
	ifText(str) {
		if(str == null || str == undefined) {
			return '';
		} else {
			return str;
		}
	},
	//检测emjoy表情
	utf16toEntities: function(str) {
		var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
		str = str.replace(patt, function(char) {
			var H, L, code;
			if(char.length === 2) {
				return "";
			} else {
				return char;
			}
		});
		return str;
	},
	//清除输入框文字
	clearInput(model, obj) {
		for(var key in obj) {
			if(key == model) {
				obj[key] = '';
			}
		}
	},
	//判断是否是微信浏览器
	isWeiXin() {
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},
	getDateDiff(startTime, endTime, diffType) {
		var timeType = 1;
		switch(diffType) {
			case "second":
				timeType = 1000;
				break;
			case "minute":
				timeType = 1000 * 60;
				break;
			case "hour":
				timeType = 1000 * 3600;
				break;
			case "day":
				timeType = 1000 * 3600 * 24;
				break;
			default:
				break;
		}
		if(endTime >= startTime) {
			var diff = endTime - startTime
		} else if(endTime < startTime) {
			var diff = startTime - endTime
		}
		return parseInt(diff / parseInt(timeType));
	},
	pagePreventDefault() {
		var overscroll = function(els, type) {
			for(var i = 0; i < els.length; ++i) {
				var el = els[i];
				el.addEventListener('touchstart', function() {
					if(type == 'top') {
						var top = this.scrollTop,
							totalScroll = this.scrollHeight,
							currentScroll = top + this.offsetHeight;
						
						//If we're at the top or the bottom of the containers
						//scroll, push up or down one pixel.
						//
						//this prevents the scroll from "passing through" to
						//the body.
						if(top === 0) {
							this.scrollTop = 1;
						} else if(currentScroll === totalScroll) {
							this.scrollTop = top - 1;
						}
					} else if(type == 'left') {
						var left = this.scrollLeft,
							totalScroll = this.scrollWidth,
							currentScroll = top + this.scrollWidth;
						//If we're at the top or the bottom of the containers
						//scroll, push up or down one pixel.
						//
						//this prevents the scroll from "passing through" to
						//the body.
						if(left === 0) {
							this.scrollLeft = 1;
						} else if(currentScroll === totalScroll) {
							this.scrollLeft = left - 1;
						}
					}

				});
				el.addEventListener('touchmove', function(evt) {
					//if the content is actually scrollable, i.e. the content is long enough
					//that scrolling can occur
					if(type == 'top'){
						if(this.offsetHeight < this.scrollHeight)
							evt._isScroller = true;
					}else if(type == 'left'){
						if(this.offsetWidth < this.scrollWidth)
							evt._isScroller = true;
					}
					
				});
			}
		};

		//禁止body的滚动事件
		document.body.addEventListener('touchmove', function(evt) {
			//In this case, the default behavior is scrolling the body, which
			//would result in an overflow.  Since we don't want that, we preventDefault.
			if(!evt._isScroller) {
				evt.preventDefault();
			}
		});

		//给class为.scroll的元素加上自定义的滚动事件
		overscroll(document.querySelectorAll('.xin-widget-citys'), 'top');
		overscroll(document.querySelectorAll('.xin-widget-citys-content'));
		overscroll(document.querySelectorAll('.scroll-wrapper'), 'top');
		overscroll(document.querySelectorAll('.news-navs-wrapper'), 'left');
	}

}
Array.prototype.contains = function(needle) {
	for(i in this) {
		if(this[i].indexOf(needle) > 0)
			return i;
	}
	return -1;
}