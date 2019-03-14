/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */
$(function() {
	$('#uptoken_url').val(domain+requestConfig.common.getUptoken);
	$('#domain').val("http://oa91iwip0.bkt.clouddn.com/");
	
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '100mb',
        flash_swf_url: 'js/plupload/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
		get_new_uptoken: false,  
        uptoken_url: $('#uptoken_url').val(),
		unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
        save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
        domain: $('#domain').val(),
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
            },
            'BeforeUpload': function(up, file) {
				 $('.coverage').show();
            },
            'UploadProgress': function(up, file) {
               
            },
            'UploadComplete': function() {
              
            },
            'FileUploaded': function(up, file, info) {
				var domain = up.getOption('domain');
				var res = JSON.parse(info);
				var url = domain +res.key;
				addCourseRecord(url,$.getUrlParam('id'),$.getUrlParam('planId'),1);
            },
            'Error': function(up, err, errTip) {
                 alert('上传错误');
            },
			'Key': function(up, file) {
				var ldot = file.name.lastIndexOf(".");
        		var type = file.name.substring(ldot + 1);
				var key = '';
           	 	if(type=="png" || type=="jpg" || type=="jpeg"|| type=="gif"|| type=="bmp"){
           	 		key = 'mf/courseKtjl/pics/ic_' + getNowFormatDate() + '.jpg';
				}else if(type=="mp4"  || type=="mov" || type=="arm"){
					key = 'mf/courseKtjl/video/ic_' + getNowFormatDate() + '.mp4';
				}
				return key;
        	}
        }
    });


});


