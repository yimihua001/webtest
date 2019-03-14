<template>
</template>
<script>
	export default {
		data() {
			return {
			}
		},
		props:['title','desc','imgUrl'],
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
					title: v.title,
					desc: v.desc,
					link: location.href, // 分享链接
					imgUrl: v.imgUrl, // 分享图片，使用逗号,隔开
				};
				console.log(shareData)
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
		}
	}
</script>