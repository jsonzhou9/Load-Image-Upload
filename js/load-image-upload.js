/**
 * Base loadImage
 * by JasonZhou
 * upload
 */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['load-image','load-image-dataURLtoBlob','load-image-exif','load-image-exif-map',
        'load-image-ios','load-image-meta','load-image-orientation'], factory);
    } else {
        // Browser globals:
        factory(window.loadImage);
    }
}(function (loadImage) {
    var emptyFun = function(){};
    var setting = {
        multiple: false, //是否开启批量上传
        before: emptyFun, //上传操作开始前回调
        fail: emptyFun, //单个图片上传失败
        success: emptyFun, //单个图片上传成功
        complete: emptyFun, //所有图片上传完成，不一定全部成功
        progress: emptyFun, //批量上传时，进度
        uploadAction: null, //服务器上传处理程序，必须是promise对象，并支持then方法
        type: 'image/jpeg', // mime-type for thumbnail ('image/jpeg' | 'image/png')
        quality: 0.8, //Setting image quality with jpegs
        dataType: 'blob' //blob | base64
    };
    var fileDomObj;
    var fileQueue = [];
    var currentFile;
    var total;

    function extend(target,options){
        for(var name in options){
            target[name] = options[name];
        }
        return target;
    }

    function fileUpload(e){
        var files = e.target.files;
        total = files && files.length;
        if(total){
            fileQueue = Array.prototype.slice.call(files);
            currentFile = fileQueue.shift();
            imageOrientationHandle();
        }else{
            setting.fail('fileList.length is 0');
            setting.complete();
        }
    }

    //图片方向处理
    function imageOrientationHandle(){
        loadImage.parseMetaData(currentFile, function (data) {
            if (data.exif) {
                setting.orientation = data.exif.get('Orientation');
            }
            imageScaleHandle();
        });
    }

    //图片缩放处理
    function imageScaleHandle(){
        setting.canvas = true; //必须使用canvas
        loadImage(
            currentFile,
            function (img) {
                if(setting.dataType=="blob"){
                    img.toBlob(function(blob){
                        upload(blob);
                    },setting.type,setting.quality);
                }else{
                    var base64 = img.toDataURL(setting.type,setting.quality);
                    upload(base64);
                }
            },
            setting
        );
    }

    //图片上传处理
    function upload(imgData){
        setting.uploadAction(imgData).then(function(result){
            //result为服务器返回数据，仅进行透传
            setting.progress(total,fileQueue.length);
            setting.success(result,currentFile);
            uploadCompleteCheck();
        },function(errResult){
            setting.progress(total,fileQueue.length);
            setting.fail(errResult,currentFile);
            uploadCompleteCheck();
        });
    }

    //单个上传完成检测
    function uploadCompleteCheck(){
        if(fileQueue.length==0 || !setting.multiple){
            setting.complete();
        }else if(setting.multiple){
            currentFile = fileQueue.shift();
            imageOrientationHandle();
        }
    }

    loadImage.upload = function(options){
        extend(setting,options);

        setting.before();
        if(!options.domid) {
            setting.fail('options.domid Can not be empty');
            setting.complete();
            return;
        }

        fileDomObj = document.getElementById(options.domid);
        if(!fileDomObj){
            setting.fail('options.domid dom object is null');
            setting.complete();
            return;
        }

        if(!setting.uploadAction)
        {
            setting.fail('options.uploadAction must be promise object');
            setting.complete();
        }

        fileDomObj.onchange = fileUpload;
    };
}));