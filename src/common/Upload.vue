<template>

</template>

<script>
	import '../../static/js/upload/plupload.dev.js'
	import '../../static/js/upload/qiniu.js'
	import { Indicator,Toast } from 'mint-ui'
	export default {
		data() {
			return {
				qiniutoken: '',
			}
		},
		methods: {
			getUploadToken() {
				Indicator.open();
				var v = this;
				v.$api.get('user/uploadTokenSimple', '', function(r) {
					v.qiniutoken = r.data.token;
					localStorage.setItem('qiniuToken', r.data.token);
					v.$parent.qiniuReady();
					Indicator.close();
					
				})
			},
			//获取新的url链接（防盗链）
			mediaurl(name, url, type, typeName) {
				Indicator.open()
				var v = this;
				var params = {
					url: url,
				};
				v.$api.post('gallery/mediaurl', params, function(r) {
					v.$emit('getUrl', name, r.data, type, typeName);

				})
			},
			//typeName上传文件的位置
			qiniuUploader(button, father, name, uploadType, typeName) { //uploadType = 0只允许上传图片,uploadType=1只允许上传图片和视频，uploadType=2只允许上传文件，uploadType=3只允许上传视频,uploadType=4只允许上传文件和图片
				var v = this;
				var videoTypeArry = ['mp4', 'wav', 'mov', 'avi','MP4','WAV','MOV','AVI'];
				var photoTypeArry = ['jpg', 'jpeg', 'gif', 'png', 'JPG', 'PNG','GIF','JPEG'];
				var fileTypeArry = ['docx', 'xlsx', 'doc', 'xls', 'pdf', 'pptx', 'ppt', 'txt','DOCX', 'XLSX', 'DOC', 'XLS', 'PDF', 'PPTX', 'PPT', 'TXT'];
				var mime_types;
				if(uploadType == 0) {
					mime_types = [{
							title: "files",
							extensions: photoTypeArry.toString()
						}, // 限定图片格式上传
					];
				} else if(uploadType == 1) {
					mime_types = [{
							title: "files",
							extensions: videoTypeArry.toString() + "," + photoTypeArry.toString()
						}, // 限定图片视频格式上传
					];
				} else if(uploadType == 2) {
					mime_types = [{
							title: "files",
							extensions: fileTypeArry.toString()
						}, // 限定文件格式上传
					];
				} else if(uploadType == 3) {
					mime_types = [{
							title: "files",
							extensions: videoTypeArry.toString()
						}, // 限定视频格式上传
					];
				} else if(uploadType == 4) { //限定图片和文件
					mime_types = [{
							title: "files",
							extensions: fileTypeArry.toString() + "," + photoTypeArry.toString()
						}, // 限定视频格式上传
					];
				}
				var uploader = Qiniu.uploader({
					runtimes: 'html5,flash,html4',
					browse_button: button,
					container: father,
					//drop_element: 'container',
					//max_file_size: '100mb',
					flash_swf_url: 'js/plupload/Moxie.swf',
					dragdrop: true,
					chunk_size: '4mb',
					max_retries: 3, //上传失败最大重试次数
					//get_new_uptoken: false,
					//uptoken_url: $('#uptoken_url').val(),
					uptoken: v.qiniutoken, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
					unique_names: false, // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
					save_key: false, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
					domain: v.$qiniuDomain,
					auto_start: true,
					filters: {
						mime_types: mime_types,
						prevent_duplicates: false //不允许选取重复文件  
					},
					init: {
						'FilesAdded': function(up, files) {
							//Indicator.open('开始上传');
						},
						'BeforeUpload': function(up, file) {},
						'UploadProgress': function(up, file) {
							//Indicator.open(file.percent + "%");
							Indicator.open('正在上传');
						},
						'UploadComplete': function() {
							Indicator.close();
						},
						'FileUploaded': function(up, file, info) {
							var domain = up.getOption('domain');
							var res = JSON.parse(info);
							var url = domain + res.key;
							var ldot = file.name.lastIndexOf(".");
							var name = file.name.substring(0, ldot);
							var type = file.name.substring(ldot + 1);
							if($.inArray(type, photoTypeArry) > -1) {
								v.mediaurl(name, url, 1, typeName) //获取新的防盗链url
							} else if($.inArray(type, videoTypeArry) > -1) {
								v.mediaurl(name, url, 2, typeName) //获取新的防盗链url
							} else if($.inArray(type, fileTypeArry) > -1) {
								v.mediaurl(name + "." + type, url, 3, typeName) //获取新的防盗链url
							}

						},
						'Error': function(up, err, errTip) {
							Toast(errTip);
							$('.upload-backdrop,.percent').remove();
						},
						'Key': function(up, file) {
							var ldot = file.name.lastIndexOf(".");
							var type = file.name.substring(ldot + 1);
							var key = '';
							if($.inArray(type, photoTypeArry) > -1) {
								key = 'mf/' + name + '/pics/ic_' + v.getNowFormatDate() + "." + type;
							} else if($.inArray(type, fileTypeArry) > -1) {
								key = 'mf/' + name + '/file_' + v.getNowFormatDate() + "." + type;
							} else if($.inArray(type, videoTypeArry) > -1) {
								key = 'mf/' + name + '/video/video_' + v.getNowFormatDate() + "." + type;
							}
							return key;
						}
					}
				});
			},

			//获取时间（年月日-时分秒）
			getNowFormatDate() {
				var date = new Date();
				var seperator1 = "-";
				var seperator2 = ":";
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				var hours = date.getHours(); //时
				var minutes = date.getMinutes(); //分
				var seconds = date.getSeconds(); //秒
				var maomiao = date.getMilliseconds(); //毫秒
				if(month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if(strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				if(hours >= 0 && hours <= 9) {
					hours = "0" + hours;
				}
				if(minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				}
				if(seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				}
				var currentdate = date.getFullYear() + month + strDate + seperator1 + hours + minutes + seconds + maomiao;
				return currentdate;
			}

		}

	}
</script>