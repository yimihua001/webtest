<template>
	<div class="wrapper">
		<div class="scroll-wrapper group-detail-wrapper">
			<div class="item-img">
				<img :src="photoFilter(groupInfo.logo,width,width)" />
			</div>
			<h5 class="time">上课时间：{{timefilter(groupInfo.begindatetime)}}~{{timefilter(groupInfo.enddatetime)}}</h5>
			<h1 class="title">{{groupInfo.name}}</h1>
			<p v-if="!introduceStatus" @click="introduceStatus = !introduceStatus" v-html="introduceFilter(groupInfo.introduction,50)"></p>
			<p v-if="introduceStatus">{{groupInfo.introduction}}<span class="more" @click="introduceStatus = !introduceStatus">&nbsp;&nbsp;收起</span></p>
			<h1 class="title">小组教师</h1>
			<div class="teacher" v-if="teacherList.length != 0">
				<ul>
					<li v-for="(item,index) in teacherList" :key="index" class="item-wrapper-teacher" @click="getTeacherDetail(item.id)">
						<div class="top-wrapper">
							<!--  <img class="morenimg" v-if="item.headimgurl.length == 0" src="../../static/image/moren.png" /> -->
							<div class="img-wrapper">
								<img :src="photoFilter(item.headimgurl,100,100)" onerror="this.onerror=null; this.src='../../static/image/moren.png';" />
							</div>
							<div class="right">
								<span class="username ellipsis_">{{item.username}}</span>
								<span class="post ellipsis_" v-if="item.post != '' && item.post != null">{{item.post}}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="bottom">
			<div class="info">
				<h3><span>¥</span>{{groupInfo.price}}</h3>
				<h5>{{groupInfo.sellcount}}/{{groupInfo.membercount}}人已报名</h5>
			</div>
			<div class="btn" @click="gotoBuy()">立即购买</div>
		</div>

	</div>

</template>
<style lang='sass'>
	@import "../../../static/sass/pages/group";
</style>
<script>
	import { Indicator, Toast, MessageBox } from 'mint-ui';
	import wx from 'weixin-js-sdk'
	export default {
		data() {
			return {
				id: this.$route.params.id,
				groupInfo: '',
				width: $(window).width(),
				teacherList: [], //老师列表
				introduceStatus: false,
			}
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open()
			this.getGroupDetail();
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
					title: v.groupInfo.name,
					desc: v.groupInfo.introduction,
					link: location.href, // 分享链接
					imgUrl: v.groupInfo.logo, // 分享图片，使用逗号,隔开
				};
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
			//获取小组详情
			getGroupDetail() {
				var v = this;
				v.$api.get('group/classinfo/' + v.id + '', '', function(r) {
					v.groupInfo = r.data;
					v.teacherList = r.data.userlist;
					Indicator.close()
				})
			},
			//获取老师详情
			getTeacherDetail(id) {
				var v = this;
				for(var i = 0; i < v.teacherList.length; i++) {
					if(v.teacherList[i].id == id) {
						localStorage.setItem('teacher', JSON.stringify(v.teacherList[i]));
						this.$router.push({
							name: 'teacherdetail',
							params: {
								id: id
							}
						})
						return false;
					}
				}
			},
			timefilter(value) {
				var v = this;
				value = v.$utils.formatData(value, 'day');
				return value;
			},
			introduceFilter(value, count) {
				var v = this;
				if(value) {
					if(value.length > count) {
						value = value.substring(0, count) + "..." + '<span class="more">展开</span>';
					}
				}
				return value;
			},
			//购买
			gotoBuy() {
				//判断有没有登录
				var v = this;
				MessageBox.confirm('', {
					message: '请下载“你好”App完善信息并加入机构后进行购买',
					confirmButtonText: '去下载',
				}).then(action => {
					v.$router.push({
						path: '/apply/download'
					});
				});
			},
		}
	}
</script>