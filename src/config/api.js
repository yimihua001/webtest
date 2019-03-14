// 配置API接口地址
var root = '/api/v1';
//var root = '/hello-user-web/api/v1';
import util from '../utils/index'

// 引用axios
import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'

// 引用路由配置文件
// 导入 vue-router，并使用
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import routes from '../config/routes'

// axios 配置

//请求超时时间
axios.defaults.timeout = 10000;

//设置全局的请求次数，请求的间隙
axios.defaults.retry = 3;
axios.defaults.retryDelay = 1000;

const router = new VueRouter({
	routes
})


//全局设置header
axios.defaults.headers.molyfun_user_agent = 'MFParentsH5/1.0.0 (' + util.getUserAgents() + ')';

// 自定义判断元素类型JS
function toType(obj) {
	return({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
	for(var key in o) {
		if(o[key] === null) {
			delete o[key]
		}
		if(toType(o[key]) === 'string') {
			o[key] = o[key].trim()
		} else if(toType(o[key]) === 'object') {
			o[key] = filterNull(o[key])
		} else if(toType(o[key]) === 'array') {
			o[key] = filterNull(o[key])
		}
	}
	return o
}
// http request 拦截器
axios.interceptors.request.use(
	config => {
		if(localStorage.getItem('token')) {
			config.headers.token = localStorage.getItem('token');
		}
		return config;
	},
	err => {
		console.log(err)
		Indicator.close();//响应成功，关闭loading
		return Promise.reject(err);
	});

// http response 拦截器
axios.interceptors.response.use(function(response) {
	// token 已过期，重定向到登录页面  
	//Toast(JSON.stringify(response));
	// console.log(response.data.code);
	if(response.data.code == 1000) {
		Indicator.close();//响应成功，关闭loading
		Toast(response.data.msg);
		localStorage.setItem('token', '');
		var redirect_uri = window.location.hash.split('#')[1];
		if(util.isWeiXin()) { //调用微信授权
			router.go({
				name: 'wxlogin',
				query: {
					redirect_uri: redirect_uri
				}
			});
		}else if(util.mobileDetect() ==3) { //调用微信授权(pc扫码)
			router.go({
				name: 'wxlogin',
				query: {
					redirect_uri: redirect_uri
				}
			});
		}else { //调登录页面 
			router.go({
				name: 'login',
				query: {
					redirect_uri: redirect_uri
				}
			});
		}
	}
	return response
}, function axiosRetryInterceptor(err) {
	console.log(err)
	if(err && err.response) {
		switch(err.response.status) {
			case 400:
				err.message = '请求错误'
				Toast('请求错误');
				break

			case 403:
				Toast('拒绝访问');
				break

			case 404:
				Toast('请求地址出错');
				break

			case 500:
				Toast('服务器出错');
				break

			case 504:
				Toast('网络超时');
				break
			default:
		}
	}
	if(err.code == 'ECONNABORTED') {
		Toast('请求超时，请稍后重试');
	}
	return Promise.reject(err);
	//	var config = err.config;
	//	console.log(config)
	//	// If config does not exist or the retry option is not set, reject
	//	if(!config || !config.retry) return Promise.reject(err);
	//
	//	// Set the variable for keeping track of the retry count
	//	config.__retryCount = config.__retryCount || 0;
	//
	//	// Check if we've maxed out the total number of retries
	//	if(config.__retryCount >= config.retry) {
	//		// Reject with the error
	//		console.log(err);
	//		console.log(err.response.status);
	//		
	//	}
	//
	//	// Increase the retry count
	//	config.__retryCount += 1;
	//
	//	// Create new promise to handle exponential backoff
	//	var backoff = new Promise(function(resolve) {
	//		console.log(resolve)
	//		setTimeout(function() {
	//			console.log(1);
	//			resolve();
	//		}, config.retryDelay || 1);
	//	});
	//
	//	// Return the promise in which recalls axios to retry the request
	//	return backoff.then(function() {
	//		console.log(config);
	//		return axios(config);
	//	});
});
/*
  接口处理函数
*/

function apiAxios(method, url, params, success, failure) {
	if(params) {
		params = filterNull(params)
	}
	axios({
			method: method,
			url: url,
			data: method === 'POST' || method === 'PUT' ? params : null,
			params: method === 'GET' || method === 'DELETE' ? params : null,
			baseURL: root,
			withCredentials: false
		})
		.then(function(res) {
			if(res.data.code === 200) {
				if(success) {
					success(res.data)
				}
			} else {
				Indicator.close();
				if(failure) {
					//Toast(res.data.msg);
					failure(res.data)
				} else {
					console.log(res.status);
					if(res.status !=207){
						Toast(res.data.msg);
					}
					console.log('error: ' + JSON.stringify(res.data.msg))
				}
			}
		})
		.catch(function(error) {
			Indicator.close();
			console.log(error)
			let res = error.data;
			if(error) {
				console.log('api error, HTTP CODE: ' + error)
				return
			}
		})
}

// 返回在vue模板中的调用接口
export default {
	get: function(url, params, success, failure) {
		return apiAxios('GET', url, params, success, failure)
	},
	post: function(url, params, success, failure) {
		return apiAxios('POST', url, params, success, failure)
	},
	put: function(url, params, success, failure) {
		return apiAxios('PUT', url, params, success, failure)
	},
	delete: function(url, params, success, failure) {
		return apiAxios('DELETE', url, params, success, failure)
	}
}