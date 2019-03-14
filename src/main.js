// main.js
// 导入Vue，这个是必需的，在使用Vue之前，必须先导入
import Vue from 'vue'
// 导入 vue-router，并使用
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//引用加载中
import 'mint-ui/lib/style.css'
import Mint from 'mint-ui';
Vue.use(Mint);

//引用事件处理组件
import VueBus from 'vue-bus'
Vue.use(VueBus);

// 入口文件为 src/App.vue 文件 所以要引用
import App from './App.vue'

// 引用路由配置文件
import routes from './config/routes'

// 引用API文件
import api from './config/api'

// 引用工具文件
import utils from './utils/index'
import card from './utils/checkIdCard'

import $ from '../static/js/lib/jquery.min'

//引入微信分享jssdk
import wx from 'weixin-js-sdk'

//导入vue-lazyload
import VueLazyLoad from 'vue-lazyload'

Vue.use(VueLazyLoad, {
	error: './static/image/dafult-img.png',
	loading: './static/image/dafult-img.png'
})

//video-player
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'
import 'videojs-contrib-hls/dist/videojs-contrib-hls'
//VideoPlayer.config({
//youtube: true,
//switcher: true,
//hls: true
//})
//Vue.use(VideoPlayer)

// 将API方法绑定到全局
Vue.prototype.$api = api

// 将工具方法绑定到全局
Vue.prototype.$utils = utils
Vue.prototype.$card = card

//腾讯地图密钥key
Vue.prototype.$TencentKey = 'UD6BZ-JPECP-H35DB-LDDYW-DNXY6-KKBAW'

//微信个人开放平台appid
Vue.prototype.$openWxAppid = 'wx8f50294da175a200';

//微信公众号（你好children）appid
Vue.prototype.$weixinAppid = 'wxd52b8963d5d0fc8c'

//七牛上传域名
Vue.prototype.$qiniuDomain = 'http://media.molyfun.com/'

//app下载链接
Vue.prototype.$appDownloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.molyfun.parents&fromcase=40002'

//视频封面后缀
Vue.prototype.videoSuffix = '&vframe/png/offset/1/w/480/h/320';

let Base64 = require('js-base64').Base64;
require('es6-promise').polyfill()

//const ua = window.navigator.userAgent.toLowerCase()
//// 如果不在微信浏览器内，微信分享也没意义了对吧？这里判断一下
//if (ua.indexOf('micromessenger') < 0) {console.log('微信');return false}

// 创建路由实例
const router = new VueRouter({
	//mode: 'history',
	routes
})

Vue.prototype.photoFilter = function(orgurl, width, height) {
	var url = '';
	if(orgurl) {
		if(height != 0 && width != 0) {
			url = orgurl + "&imageView2/1/w/" + width + "/h/" + height;
		} else if(width != 0 && height == 0) {
			url = orgurl + "&imageView2/2/w/" + width;
		} else if(width == 0 && height != 0) {
			url = orgurl + "&imageView2/2/h/" + height;
		}
	}
	return url;
}

Vue.prototype.videoposterFilter = function(orgurl, width, height) {
	var url = '';
	if(orgurl) {
		if(height != 0 && width != 0) {
			url = orgurl + "&vframe/png/offset/1/w/" + width + "/h/" + height;
		} else if(width != 0 && height == 0) {
			url = orgurl + "&vframe/png/offset/2/w/" + width;
		} else if(width == 0 && height != 0) {
			url = orgurl + "&vframe/png/offset/2/h/" + height;
		}
	}
	return url;
}

router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	if(to.meta.title) {
		document.title = to.meta.title;
	}
	if(to.meta.requireAuth) { // 判断该路由是否需要登录权限
		if(localStorage.getItem('token')) { // 通过localStorage获取当前的token是否存在
			next();
		} else {
			//删除本地存储信息，
			localStorage.setItem('token', '');
			if(utils.isWeiXin()) { //调用微信授权
				router.push({
					name: 'wxlogin',
					query: {
						redirect_uri: to.fullPath
					}
				});
			} else if(utils.mobileDetect() == 3) { //调用微信授权（pc扫码）
				router.push({
					name: 'wxlogin',
					query: {
						redirect_uri: to.fullPath
					}
				});
			} else { //调登录页面
				router.push({
					name: 'login',
					query: {
						redirect_uri: to.fullPath
					}
				});
			}
		}
	} else {
		next();
	}
})

// 创建 Vue 实例
new Vue({
	el: '#app',
	data() {
		return {
			transitionName: 'slide',
			loadingRouteData: true
		}
	},
	mounted() {
		utils.pagePreventDefault();
	},
	updated() {
		utils.pagePreventDefault();
	},
	router,
	watch: {
		// 监视路由，参数为要目标路由和当前页面的路由
		'$route' (to, from) {
			const toDepth = to.path.substring(0, to.path.length - 2).split('/').length
			const fromDepth = from.path.substring(0, from.path.length - 2).split('/').length
			this.transitionName = toDepth < fromDepth ? 'slide_back' : 'slide'
		}
	}
})
export default router;