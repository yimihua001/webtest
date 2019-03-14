/*global plupload */
/*global qiniu */
function FileProgress(file, targetID) {
    this.fileProgressID = file.id;
    this.file = file;
    this.opacity = 100;
    this.height = 0;
    this.fileProgressWrapper = $('#' + this.fileProgressID);
    if (!this.fileProgressWrapper.length) {
        this.fileProgressWrapper = $('<tr></tr>');
        var Wrappeer = this.fileProgressWrapper;
        Wrappeer.attr('id', this.fileProgressID).addClass('progressContainer');

        var progressText = $("<td/>");
        progressText.addClass('progressName').text(file.name);


        var fileSize = plupload.formatSize(file.size).toUpperCase();
        var progressSize = $("<td/>");
        progressSize.addClass("progressFileSize").text(fileSize);

        var progressBarTd = $("<td/>");
        var progressBarBox = $("<div/>");
        progressBarBox.addClass('info');

 


        var progressCancel = $('<td/>');
        progressCancel.show().addClass('progressCancel').text('×');

        var progressBarStatus = $('<div class="status text-center"/>');
        progressBarBox.append(progressBarStatus);
        progressBarTd.append(progressBarBox);

        Wrappeer.append(progressText);
        Wrappeer.append(progressSize);
        Wrappeer.append(progressBarTd);
		Wrappeer.append(progressCancel);

        $('#' + targetID).append(Wrappeer);
    } else {
        this.reset();
    }

    this.height = this.fileProgressWrapper.offset().top;
    this.setTimer(null);
}

FileProgress.prototype.setTimer = function(timer) {
    this.fileProgressWrapper.FP_TIMER = timer;
};

FileProgress.prototype.getTimer = function(timer) {
    return this.fileProgressWrapper.FP_TIMER || null;
};

FileProgress.prototype.reset = function() {
    this.fileProgressWrapper.attr('class', "progressContainer");
};

FileProgress.prototype.setChunkProgess = function(chunk_size) {//分块
    var chunk_amount = Math.ceil(this.file.size / chunk_size);
    if (chunk_amount === 1) {
        return false;
    }


};

FileProgress.prototype.setProgress = function(up,percentage, speed, chunk_size) {
    var file = this.file;
    var uploaded = file.loaded;
    if (this.fileProgressWrapper.find('.status').text() === ''){
		this.fileProgressWrapper.remove();
		up.removeFile(file);
        return;
    }
    percentage = parseInt(percentage, 10);
	this.fileProgressWrapper.find('.status').text(this.file.percent + "%");
    if (file.status !== plupload.DONE && percentage === 100) {
        percentage = 99;
    }

};



FileProgress.prototype.setComplete = function(up, info) {//上传完成
	this.fileProgressWrapper.remove();
  
};
FileProgress.prototype.setError = function() {//上传错误
    this.fileProgressWrapper.remove();
	if($('.icon-upload-list .count').text() > 0){
		$('.icon-upload-list .count').text(parseInt($('.icon-upload-list .count').text())-1);
	}
};

FileProgress.prototype.setCancelled = function(manual) {
    var progressContainer = 'progressContainer';
    if (!manual) {
        progressContainer += ' red';
    }
    this.fileProgressWrapper.attr('class', progressContainer);
    this.fileProgressWrapper.find('td:eq(2) .progressCancel').hide();
	
};

FileProgress.prototype.setStatus = function(status, isUploading) {
    if (!isUploading) {
        this.fileProgressWrapper.find('.status').text(status).attr('class', 'status text-left');
    }
};

FileProgress.prototype.editFileName = function(up,file){
	var self = this;
	file.realName = self.fileProgressWrapper.find('.progressName').attr('name');
	file.pid = self.fileProgressWrapper.find('.progressName').attr('pid');
};

// 绑定取消上传事件
FileProgress.prototype.bindUploadCancel = function(up) {
    var self = this;
    if (up) {
        self.fileProgressWrapper.find('.progressCancel').on('click', function(){
//            self.setCancelled(false);
 			up.removeFile(self.file);
		    self.fileProgressWrapper.remove();
            if($('.icon-upload-list .count').text() > 0){
				$('.icon-upload-list .count').text(parseInt($('.icon-upload-list .count').text())-1);
			}
        });
    }

};


