<template>
	<div class="preview-wrapper" @click="cancel">
		<div class="photoBox">
			<mt-swipe :auto="0" @change="handleChange" :defaultIndex='imgIndex'>
				<mt-swipe-item v-for="(item,index) in imglist" :key="index">
					<img :src="item.bigurl" alt="">
				</mt-swipe-item>
			</mt-swipe>
			<mt-spinner type="snake" class="loading-wrapper" v-if="!complete"></mt-spinner>
		</div>
	</div>
</template>
<script>
	import Loading from '../components/Loading'
	import { Swipe, SwipeItem } from 'mint-ui';
	export default {
		data() {
			return {
				url: '',
				loadingUrl: '../../static/image/loading.gif',
				complete: false,
			}
		},
		components: {
			Loading
		},
		created() {
			//判断素材是否过期
			var v = this;
			if(v.bigurl){
				v.imgIndex = 0;
				v.imglist = [];
				v.imglist.push({url:v.bigurl})
				v.checkUrlPast(v.bigurl,0);
			}else{
				var img = v.imglist[v.imgIndex];
				v.url = img.url;
				v.checkUrlPast(v.url,v.imgIndex);
			}
			
		},
		methods: {
			handleChange(index) {
				var v = this;
				var img = v.imglist[index];
				v.url = img.url;
				v.complete = false;
     			v.checkUrlPast(v.url,index)
			},
			//展示图片
			show(orgurl,index) {
				var v = this;
				if(orgurl.indexOf('imageMogr2/thumbnail') > -1) {
					var arr = orgurl.split("&");
					var dot = orgurl.lastIndexOf("?");
					if(dot > 0) {
						var switchurl = orgurl.substring(0, dot);
					} else {
						var switchurl = orgurl;
					}
					var url = switchurl + '?' + arr[1] + '&' + arr[2];
				} else {
					var url = orgurl;
				}
				v.imglist[index].bigurl = url + "&imageView2/2/w/" + $(window).width();
				v.$utils.imgLoad(v.imglist[index].bigurl, function(url) {
					v.imglist[index].bigurl = url;
					v.complete = true;
				})
			},
			cancel() {
				this.$emit("on-cancel");
			},
			//判断素材是否过期
			checkUrlPast(url,index) {
				var v = this;
				var arr = url.split('&');
				var time = arr[arr.length - 1].split('=')[1];
				time = parseInt(time, 16) * 1000;
				var nowTime = Date.parse(new Date());
				console.log('过期时间：' + v.$utils.formatData(time, 'second'))
				if(time < nowTime) {
					url = url.split('&')[0];
					v.complete = false;
					v.mediaurl(url,index);
				} else {
					v.show(url,index);
				}
			},
			//获取新的url链接（防盗链）
			mediaurl(url) {
				var v = this;
				var params = {
					url: url,
				};
				v.$api.post('gallery/mediaurl', params, function(r) {
					v.show(r.data,index)
				})
			},

		},
		props: ['imgIndex', 'imglist','bigurl']

	}
</script>