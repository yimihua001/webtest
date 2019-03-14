<template>
	<div class="wrapper">
		<div class="scroll-wrapper depart-detail-wrapper depart">
			<div class="item-wrapper depart-info">
				<div class="item-img">
					<img :src="photoFilter(dat.url,100,100)" onerror="this.onerror=null; this.src='../../static/image/companylogo.png';" />
					<span v-if="dat.isapprove == 1"></span>
				</div>
				<div class="info">
					<h4><span class="departName" v-bind:class="{subsidy1:dat.isassist == 1}">{{dat.departname}}</span></h4>
				</div>
			</div>
			<div class="otherinfo">
				<div class="icon-item">
					<h5 class="departaddress" @click="getTencentMap(dat.departAddress,dat.departname)">{{dat.departAddress}}</h5>
					<h5 class="departtel">{{dat.departtel}}</h5>
				</div>
				<h3 class="name">
					<router-link :to="{ name: 'introduct', params: { id: id }}">
						机构简介
					</router-link>
				</h3>
				<p>{{descriptionFilter(dat.description)}}</p>
			</div>
			<div class="comment" v-if="commentList.length != 0">
				<h3 class="name">
					<router-link :to="{ name: 'comment', params: { id: id }}">
						评论
					</router-link>
				</h3>
				<ul>
					<li class="item-wrapper-comment" v-for="(item,index) in commentList" :key="index" v-if="commentList.length != 0" style="border-bottom:none;">
						<div class="top-wrapper">
							<div class="img-wrapper">
								<img class="item-img" src="../../static/image/moren.png" />
							</div>
							<div class="right">
								<h4>游客</h4>
								<h4>{{timefilter(item.createdatetime)}}</h4>
							</div>
						</div>
						<p>{{item.content}}</p>
					</li>
				</ul>
			</div>
			<div class="subject-wrapper" v-if="subjectList.length != 0">
				<h3 class="name">
					<router-link :to="{ name: 'subjectlist', params: { id: id }}">
						公开课
					</router-link>
				</h3>
				<ul>
					<li v-for="(item,index) in subjectList" :key="index" class="item" @click="getSubjectDetail(item.id)">
						<h4 class="ellipsis_">{{item.name}}</h4>
						<h5><em>开课时间：</em>{{timefilter(item.begindatetime)}}</h5>
						<ul class="user-wrapper">
							<li v-for="(user,index) in item.userlist" :key="index" class="user">
								<img class="photo" :src="user.headimgurl" onerror="this.onerror=null; this.src='../../static/image/moren.png';"  />
								<p class="ellipsis_">{{user.username}}</p>
							</li>
						</ul>
						<div class="note">
							<p class="price"><span>¥</span>{{item.price}}</p>
							<p class="num">{{item.sellcount}}人已报名</p>
						</div>
					</li>
				</ul>
			</div>
			<div class="teacher" v-if="teacherList.length != 0">
				<h3 class="name">
					<router-link :to="{ name: 'teacherList', params: { id: id }}">
						团队介绍
					</router-link>
				</h3>
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
						<p v-if="item.skills != ''">{{item.skills}}</p>
					</li>
				</ul>
			</div>
		</div>

		<v-footer :projectdat="dat"></v-footer>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui';
	import VFooter from '../components/Footer'
	import wx from 'weixin-js-sdk'
	export default {
		data() {
			return {
				id: this.$route.params.id,
				dat: {}, //机构详情
				commentList: [], //评论列表,
				subjectList: [], //主题列表
				teacherList: [], //老师列表
			}
		},
		components: {
			VFooter
		},
		// 在组件创建完成时，执行的钩子函数
		created() {
			Indicator.open();
			this.getData();
			this.getCommentList();
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
					title: v.dat.departname,
					desc: v.dat.description,
					link: location.href, // 分享链接
					imgUrl: v.dat.url, // 分享图片，使用逗号,隔开
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
		updated() {
			Indicator.close()
		},
		methods: {
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
			getData(params) { //获取机构详情
				var v = this;
				v.$api.get('depart/departInfo/' + v.id + '', params, function(r) {
					v.dat = r.data;
					v.subjectList = v.dat.subjectlist;
					v.teacherList = v.dat.departuser;
					localStorage.setItem('orgcode', v.dat.orgcode);
					localStorage.setItem('code', v.dat.orgcode);
				})
			},

			//根据api从地址获取经纬度
			getTencentMap(address, name) {
				var v = this;
				var data = {　　　　　
					address: address,
					key: v.$TencentKey　　　
				}
				var url = "http://apis.map.qq.com/ws/geocoder/v1/?";
				data.output = "jsonp";
				$.ajax({
					type: "get",
					dataType: 'jsonp',
					data: data,
					jsonp: "callback",
					jsonpCallback: "QQmap",
					url: url,
					success: function(res) {
						//console.log(res);
						if(res.status == 0) {
							var location = res.result.location;
							var url = 'http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:' + location.lat + ',' + location.lng + ';title:' + name + ';addr:' + address + '&key=' + v.$TencentKey + '&referer=molyfun-web'
							window.location.href = url;
						}
					},
					error: function(err) {
						alert("服务端错误，请刷新浏览器后重试")
					}
				})
			},
			getCommentList(params) { //获取评论列表
				var v = this;
				params = {
					pageSize: 2,
					pageNum: 1,
				}
				v.$api.get('depart/commentList/' + v.id + '', params, function(r) {
					v.commentList = r.data.records;
				})
			},
			//获取主题详情
			getSubjectDetail(id) {
				var v = this;
				v.$router.push({
					path: '/subject/detail/' + id
				})
			},
			timefilter(value) {
				var v = this;
				value = v.$utils.formatData(value, 'minute');
				return value;
			},
			descriptionFilter(value) {
				if(value) {
					if(value.length > 20) {
						value = value.substring(0, 62) + "...";
					}
				}
				return value;
			}
		}
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/depart";
</style>