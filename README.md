# Load-Image-Upload（HTML5图片缩放上传）

> 一个基于Load-Image库的，HTML5图片批量缩放、上传库。

## Demo
./file.html

## 描述

Load-Image-Upload是基于Load-Image库，并包含了[Load-Image库](https://github.com/blueimp/JavaScript-Load-Image)。在Load-Image的基础上，给它添加了批量上传功能。[Load-Image库](https://github.com/blueimp/JavaScript-Load-Image)主要包括，图片缩放，并可以返回二进制或Base64图片数据；还可以读取图片源数据，修正图片方向信息（iOS拍照上传BUG）。

## 使用
引入以下脚本，包含了Load-Image所有库，以及批量上传库。

```html
<script src="js/load-image.all.min.js"></script>
```

或者分别引用所需库：

新增库：

```html
<script src="js/load-image-dataURLtoBlob.js"></script>
<script src="js/load-image-upload.js"></script>
```

Load-Image的拆分库：

```html
<script src="js/load-image.js"></script>
<script src="js/load-image-ios.js"></script>
<script src="js/load-image-orientation.js"></script>
<script src="js/load-image-meta.js"></script>
<script src="js/load-image-exif.js"></script>
<script src="js/load-image-exif-map.js"></script>
```

## 使用

其中upload函数，必须返回一个promise对象，并支持then方法。

```html
<input type="file" name="upfile" id="upfile" multiple="multiple" accept="image/*" capture="camera" />
```

```js
    loadImage.upload({
        domid: "upfile",
        multiple: true,
        before: function(){console.log("before");},
        fail: function(failMsg,file){console.log("fail",failMsg,file);},
        success: function(result,file){console.log("success",result,file);},
        complete: function(){console.log("complete");},
        progress: function(total,remainder){console.log("progress",total,remainder);},
        uploadAction: upload,
        type: 'image/png',
        quality: 0.8,
        dataType: 'base64',
        maxWidth: 400,
        maxHeight: 400
    });
```

## 参数

* **domid**: <input type="file">对象的ID
* **multiple**: 是否开启批量上传
* **before**: 上传操作开始前回调
* **fail**: 单个图片上传失败
* **success**: 单个图片上传成功
* **complete**: 所有图片上传完成，不一定全部成功
* **progress**: 批量上传时，进度
* **uploadAction**: 服务器上传处理程序，必须返回promise对象，并支持then方法
* **type**: mime-type for thumbnail ('image/jpeg' | 'image/png')
* **quality**: Setting image quality with jpegs
* **dataType**: 返回的数据类型：blob | base64
* **maxWidth**: 最大的宽
* **maxHeight**: 最大的高

## 其它参数

可同时包含[Load-Image库](https://github.com/blueimp/JavaScript-Load-Image)的全部参数。