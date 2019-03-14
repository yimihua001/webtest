// 引入子路由
import Frame from '../frame/subroute.vue'

// 引用模板
// import List from '../page/List'
import List from '../page/depart/List'
// import DepartDetail from '../page/DepartDetail'
import DepartDetail from '../page/depart/DepartDetail'
import SearchDepart from '../page/SearchDepart'
import ProductDetail from '../page/ProductDetail'
import Location from '../page/Location'
import Introduct from '../page/Introduct'
import Comment from '../page/Comment'
import Productlist from '../page/ProductList'
import TeacherList from '../page/TeacherList'
import Teacherdetail from '../page/depart/TeacherDetail'
// import Teacherdetail from '../page/TeacherDetail'
import Login from '../page/Login'
import Register from '../page/Register'
import Password from '../page/Password'
import Consulting from '../page/Consulting'
import WxReg from '../page/WxReg'
import WxLogin from '../components/Wxlogin'
import Studentlist from '../page/StudentList'
import Update from '../page/Update'
import Applyagency from '../page/Applyagency'

//素材库
import MaterialsList from '../page/Materials/List'
import MaterialsSearch from '../page/Materials/Search'

//公开课列表
import SubjectList from '../page/subject/SubjectList'
//班级课列表
import ClassList from '../page/subject/ClassList'
//公开课详情
import SubjectDetail from '../page/subject/SubjectDetail'
//班级课详情
import ClassDetail from '../page/subject/ClassDetail'

import SubjectLive from '../page/subject/SubjectLive'
import SubjectPlayback from '../page/subject/SubjectPlayback'
import SubjectCourse from '../page/subject/SubjectCourse'


//报名模板
import ApplyNotice from '../page/apply/Notice'
import ApplyStudentInfo from '../page/apply/StudentInfo'
import ApplyEvaluate from '../page/apply/Evaluate'
import ApplyHint from '../page/apply/Hint'
import ApplyDownload from '../page/apply/Download'
import DepartList from '../page/apply/DepartList'

//支付
import PayWay from '../page/pay/PayWay'
import WxPay from '../page/pay/WxPay'
import PayConnect from '../page/pay/PayConnect'

//新闻资讯
import NewsList from '../page/news/List'
import NewsDetail from '../page/news/Detail'

//小组
import GroupDetail from '../page/group/Detail'

// 定义配置路由
export default [
	{
		path: "*",
		component: List
	},
	{
		path: '/',
		name:'首页',
		component: List,
		meta: {
            title: '机构列表'
        }
	},
	{
		path: '/search',
		name:'SearchDepart',
		component: SearchDepart
	},
	{
		path: '/:cityid',
		name:'首页(带城市)',
		component: List
	},
	{
		path: '/departInfo/:id',
		name:'DepartDetail',
		component: DepartDetail,
		meta: {
            title: '机构详情'
        }
	},
	{
		path: '/product/detail/:id',
		name:'productDetail',
		component: ProductDetail,
		meta: {
            title: '产品详情'
        }
	},
	{
		path: '/location',
		name:'地理位置',
		component: Location
	},
	{
		path: '/introduct/:id',
		name:'introduct',
		component: Introduct,
		meta: {
            title: '机构介绍'
        }
	},
	{
		path: '/comment/:id',
		name:'comment',
		component: Comment,
		meta: {
            title: '评论'
       }
	},	
	{
		path: '/subject/list/:id',
		name:'subjectlist',
		component: SubjectList,
		meta: {
            title: '公开课'
        }
	},
	{
		path: '/subject/detail/:id',
		name:'subjectDetail',
		component: SubjectDetail,
		meta: {
            title: '公开课详情'
        }
	},
	{
		path: '/class/list/:id',
		name:'classlist',
		component: ClassList,
		meta: {
            title: '班级课'
        }
	},
	{
		path: '/class/detail/:id',
		name:'classDetail',
		component: ClassDetail,
		meta: {
            title: '班级课详情'
        }
	},
	{
		path: '/subject/live/:id',
		name:'subjectLive',
		component: SubjectLive,
		meta: {
            title: '直播',
             requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        }
	},
	{
		path: '/subject/playback/:id',
		name:'subjectPlayback',
		component: SubjectPlayback,
		meta: {
            title: '直播',
             requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        }
	},
	{
		path: '/subject/course/:id',
		name:'subjectCourse',
		component: SubjectCourse,
		meta: {
            title: '公开课课程详情',
             requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        }
	},
	{
		
		path: '/product/list/:id',
		name:'productlist',
		component: Productlist,
		meta: {
            title: '产品列表'
        }
	},
	{
		path: '/teacher/list/:id',
		name:'teacherList',
		component: TeacherList,
		meta: {
            title: '老师列表'
       }
	},
	{
		path: '/teacher/detail/:id',
		name:'teacherdetail',
		component: Teacherdetail,
		meta: {
            title: '老师介绍'
       }
	},
	{
		path: '/user/login',
		name:'login',
		component: Login,
		meta: {
            title: '登录'
        }
	},
	{
		path: '/user/register',
		name:'register',
		component: Register,
		meta: {
            title: '注册'
        }
	},
	{
		path: '/studentlist/:id',
		name:'studentlist',
		component: Studentlist,
		meta: {
			title: '选择学生',
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        }
	},
	{
		path: '/user/pwd',
		name:'pwd',
		component: Password,
		meta: {
            title: '忘记密码'
        }
	},
	{
		path: '/update/:id',
		name:'update',
		component: Update,
		meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: '资料上传'
        }
	},
	{
		path: '/consulting/:id',
		name:'consulting',
		component: Consulting,
		meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: '咨询'
        }
	},
	{
		path: '/wx/wxreg',
		name:'wxreg',
		component: WxReg,
		meta: {
            title: '完善信息'
        }
	},
	{
		path: '/wx/wxlogin',
		name:'wxlogin',
		component: WxLogin,
		meta: {
            title: '微信登录'
        }
	},
	{
		path: '/user/applyagency',
		name:'Applyagency',
		component: Applyagency,
		meta: {
            title: '申领机构'
        }
	},
	{
		path: '/materials/list',
		name:'MaterialsList',
		component: MaterialsList,
		meta: {
            title: '自闭症康复教学素材'
        }
	},
	{
		path: '/materials/search/:type',
		name:'MaterialsSearch',
		component: MaterialsSearch,
		meta: {
            title: '自闭症康复教学素材'
        }
	},
	{
		path: '/apply/notice',
		name:'applyNotice',
		component: ApplyNotice,
		meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: '报名须知'
        },
	},
	{
		path: '/apply/info',
		name:'报名学生基本信息',
		component: ApplyStudentInfo,
		meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: '报名信息'
        },
	},
	{
		path: '/apply/evaluate',
		name:'报名评估表',
		component: ApplyEvaluate,
		meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: '评测表'
        },
	},
	{
		path: '/apply/hint',
		name:'hint',
		component: ApplyHint,
		meta: {
            title: '扫码报名'
        }
		
	},
	{
		path: '/apply/depart',
		name:'depart',
		component: DepartList,
		meta: {
            title: '机构列表'
        }
		
	},
	
	{
		path: '/apply/download',
		name:'家长版下载',
		component: ApplyDownload,
		meta: {
            title: 'APP下载'
       }
	},
	{
		path: '/pay/way/:id',
		name:'payway',
		component: PayWay,
		meta: {
			requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: '支付选择页面'
        }
	},
	{
		path: '/pay/wxpay/:id',
		name:'wxpay',
		component: WxPay,
		meta: {
			requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: '微信支付'
        }
	},
	{
		path: '/pay/payconnect',
		name:'payconnect',
		component: PayConnect,
		meta: {
			requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: '支付宝回调跳转'
        }
	},
	{
		path: '/news/list',
		name:'newsList',
		component: NewsList,
		meta: {
            title: '精品推荐'
        }
	},
	{
		path: '/news/detail/:id',
		name:'newsDetail',
		component: NewsDetail,
		meta: {
            title: '精品推荐'
        }
	},
	{
		path: '/group/detail/:id',
		name:'groupDetail',
		component: GroupDetail,
	}

]