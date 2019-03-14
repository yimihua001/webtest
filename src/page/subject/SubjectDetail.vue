<!-- 公开课详情 -->
<template>
	<div class="wrapper">
		<div class="scroll-wrapper">
			<div class="subject-top">
				<div class="cover">
					<img class="coverpic" :src="subjectInfo.url" />
				</div>
				<div class="depart-info" @click="openDepartdetail(departinfo.id)">
					<img class="logo" :src="photoFilter(departinfo.url,40,40)"></i>
					<h3 class="ellipsis_">{{departinfo.departname}}</h3>
					<i class="open"></i>
				</div>
				<div class="subject-des">
					<span class="title ellipsis_">{{subjectInfo.name}}</span>
					<div class="time">
						<i class="timecon"></i>
						<span class="timer">{{timefilter(subjectInfo.begindatetime)}}-{{timefilter(subjectInfo.enddatetime)}}</span>
					</div>
					<span class="price">￥{{subjectInfo.price}}</span>
					<span class="joninnum">{{subjectInfo.sellcount || '0'}}人报名</span>
				</div>
			</div>
			<div class="gray-block"></div>
			<div class="subject-wrapper">
				<div class="tab">
					<ul>
						<li v-for="(item,index) in tabs" :key="index" :class="{active:index == currentIndex}" @click="toggleTab(index,item.content)">{{item.text}}</li>
					</ul>
				</div>
			</div>
			<div class="subject-detail-wrapper subject-detail-padding pading-bottom">
				<subject :is="currentTab" :subject="subjectInfo" keep-alive></subject>
			</div>
			<v-footer :projectdat="dat" v-if="isShow"></v-footer>
		</div>
	</div>

</template>
<style lang='sass'>
	@import "../../../static/sass/pages/depart"
</style>
<script>
	import { Indicator, Toast, InfiniteScroll, MessageBox } from 'mint-ui';
	import SubjectComment from '../../components/subject/SubjectComment';
	import SubjectInfo from '../../components/subject/SubjectInfo'
	import teacherList from '../../components/subject/teacherList'
	import SubjectCatalog from '../../components/subject/SubjectCatalog'
	import VFooter from '../../components/Footer'
	import wx from 'weixin-js-sdk'
	export default {
		data() {
			return {
				id: this.$route.params.id,
				subjectInfo: '',
				currentTab: 'SubjectCatalog', // currentTab 用于标识当前触发的子组件
				currentIndex: 0,
				tabs: [{
					'text': "目录",
					'content': 'SubjectCatalog'
				}, {
					'text': "详情",
					'content': 'SubjectInfo'
				}, {
					'text': "教师",
					'content': 'teacherList'
				}, {
					'text': "评价",
					'content': 'SubjectComment'
				}],
				subjectList: [],
				departinfo: "",
				dat:{
					"gettopay": '1',
				},
				isShow:true
			}
		},
		components: {
			SubjectComment,
			SubjectInfo,
			teacherList,
			SubjectCatalog,
			VFooter			
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open()
			this.getdepartData();
			this.getSubjectDetail();
		},
		mounted() {
			var v = this;
			var url = location.href.split('#')[0];
			v.$api.post('user/wxparams?url=' + encodeURIComponent(url), '', function(r) {
				wx.config({
					debug: false,
					appId: r.data.appId,
					timestamp: r.data.timestamp,
					nonceStr: r.data.nonceStr,
					signature: r.data.signature,
					jsApiList: [
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo'
					]
				});
				var shareData = {
					title: v.subjectInfo.name,
					desc: v.subjectInfo.introduce,
					link: location.href, // 分享链接
					imgUrl: 'http://h5.helloparents.molyfun.com/logo.png', // 分享图片，使用逗号,隔开
				};
				//				console.log(shareData)
				wx.ready(function() {
					wx.onMenuShareAppMessage(shareData);
					wx.onMenuShareTimeline(shareData);
					wx.onMenuShareQQ(shareData);
					wx.onMenuShareQZone(shareData);
				});
				wx.error(function(res) {
					alert(res.errMsg);
				});
			})
		},
		methods: {
			//获取机构信息
			getdepartData() {
				Indicator.close();
				let data = JSON.parse(sessionStorage.getItem('departInfo'));
				let departinfo = {};
				departinfo['departname'] = data.departname;
				departinfo['url'] = data.url;
				departinfo['id'] = data.id;
				this.departinfo = departinfo;
			},
			//获取公开课详情
			getSubjectDetail(params) {
				let data = JSON.parse(sessionStorage.getItem('subjectItemdata'));
				this.subjectInfo = data;
				let itemdata = "";
				var v = this;
				v.$api.get('subject/info/' + v.id + '', params, function(r) {
					itemdata = r.data;
					let subjectTeacher = itemdata.userlist;
					sessionStorage.setItem('subjectTeacher', JSON.stringify(subjectTeacher));
					let introduceData = itemdata.introducepage;
					sessionStorage.setItem('introduceData', JSON.stringify(introduceData));
				})

			},
			//打开机构页面
			openDepartdetail(id) {
				var v = this;
				v.$router.push({
					path: '/departInfo/' + id
				})
			},
			timefilter(value) {
				var v = this;
				value = v.$utils.formatData(value, 'minute');
				return value;
			},
			toggleTab: function(index, tab) {
				this.currentTab = tab; // tab 为当前触发标签页的组件名
				this.currentIndex = index;
			}			
		}
	}
</script>