<template>
	<div class="wrapper pading-bottom">
		<div class="update-wrapper scroll-wrapper">
			<div class="dataup " v-for="(item,index) in records" :key="index">
				<p>{{item.name}}</p>
				<div class="doc-list-img">
					<ul>
						<li id="container" class="btn-upload" v-if="index==0 && isEval==0">
							<img src="../../static/image/icon-upload.png" id="pickfiles" />
						</li>
						<li id="container2" class="btn-upload" v-if="index==1 && isEval==0">
							<img src="../../static/image/icon-upload.png" id="pickfiles2" />
						</li>
						<li id="container3" class="btn-upload" v-if="index==2 && isEval==0">
							<img src="../../static/image/icon-upload.png" id="pickfiles3" />
						</li>
						<li v-for="(img,index) in item.mediaobjectlist" :key="index">
							<img :src="photoFilter(img.url,100,100)" v-if="img.type == 1" @click="previewImg(img.url)" onerror="this.onerror=null; this.src='../../static/image/moren.png';"/>
							<img :src="videoposterFilter(img.url,100,100)" v-if="img.type == 2" @click="playVideo(img.url)" onerror="this.onerror=null; this.src='../../static/image/moren.png';"/>
						</li>
					</ul>
				</div>
				<div class="box"><textarea class="ui-textarea" rows="2" placeholder="请输入描述内容..." v-model="item.content"></textarea></div>
			</div>
		</div>
		<footer class="footer" v-if="isEval == 0">
			<span @click="docUpdate()" class="btn">提交</span>
		</footer>
		<upload ref="upload" @getUrl="qiuniuDealImg"></upload>
		<preview-img v-if="isHide" @on-cancel="cancel" :bigurl="bigurl" :imgIndex="0" :imglist="''"></preview-img>
		<play-video v-if="isPlayHide" @on-cancel="cancelPlay" :videourl="videourl" :posterurl="posterurl"></play-video>
	</div>
</template>

<script>
	import { Toast, Indicator } from 'mint-ui'
	import Upload from '../common/Upload'
	import PreviewImg from '../components/PreviewImg';
	import PlayVideo from '../components/PlayVideo'
	export default {
		data() {
			return {
				customplanid: this.$route.params.id,
				isEval:localStorage.getItem('isEval'),
				pageNum: '1',
				pageSize: '10',
				records: [],
				content: '',
				domFlag: true,
				isHide: false,
				isPlayHide: false,
				bigurl: '',
				videourl: '', //视频url
				posterurl: '', //视频封面,
			}
		},
		components: {
			Upload,
			PreviewImg,
			PlayVideo
		},
		created() {
			Indicator.open();
			this.doclist();
		},
		mounted() {
            this.$refs.upload.getUploadToken();
		},
		updated (){
			this.qiniuReady();
		},
		methods: {
			//七牛上传token已经获取到
			qiniuReady(){
				var v = this;
                v.$refs.upload.qiniuUploader('pickfiles','container','im', 1, 0); //本地图片和视频
				v.$refs.upload.qiniuUploader('pickfiles2','container2','im', 1, 1); //本地图片和视频
				v.$refs.upload.qiniuUploader('pickfiles3','container3','im',1, 2); //本地图片和视频			
			},
			//咨询定制资料列表
			doclist() {
				var v = this;
				var params = {
					pageNum: v.pageNum,
					pageSize: v.pageSize
				};
				params = v.$utils.objToString(params);
				v.$api.get('custom/doclist/' + v.customplanid + '?' + params, '', function(r) {
					v.records = r.data.records;
					Indicator.close();
				})
			},
			//修改咨询定制资料
			docUpdate(type, url) {
				Indicator.open()
				var v = this;
				var params = {
					customplanid: v.customplanid,
					list: v.records
				};
				v.$api.post('custom/docUpdate', params, function(r) {
					Toast('上传成功')
					v.$router.push({
						name: "consulting",
						params: {
							id: v.customplanid
						}
					})
				})
			},
			//上传图片/视频后处理图片
			qiuniuDealImg(filename, url, fileType, uploadName) { //filetype=1图片，2视频，3文件
				var v = this;
				var img = {
					'type': fileType,
					'url': url
				}
				if(!v.records[uploadName].mediaobjectlist) {
					v.records[uploadName].mediaobjectlist = [];
				}
				v.records[uploadName].mediaobjectlist.push(img)
				Indicator.close();
			},
			previewImg(url) { //预览图片
				this.bigurl = url;
				this.isHide = true;
			},
			cancel() {
				this.isHide = false;
			},
			cancelPlay() { //关闭视频播放
				this.isPlayHide = false;
			},
			playVideo(url, cover) {
				this.videourl = url;
				this.isPlayHide = true;
			},

		}
	}
</script>
<style lang='sass'>
	@import "../../static/sass/pages/consult";
</style>