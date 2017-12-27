const client = require("../common/HttpClient");
const path = require("path");
const needle = require('needle');
const formidable = require('formidable');
const fs = require('fs');
const siteConfig = require("../../site_config");

const chalk = require('chalk');
const log = console.log;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const green = chalk.keyword('green');

//get转接服务
exports.GetData = function (req, res) {
    log(warning("get转接服务"));
    let apiPath = req.query.requrl;
    let params = param(req.query);
    if (params != "") {
        apiPath += (apiPath.indexOf("?") < 0 ? "?" : "&") + param(req.query);
    }
    client.Get(apiPath, req.session.loginHeaders["set-cookie"], chunk => {
        var data = JSON.parse(chunk);
        res.json(data);
    });


};

//post转接服务
exports.PostData = function (req, res) {
    log(warning("post转接服务"));
    let apiPath = req.body.requrl;
    delete req.body.requrl; //去掉多余的接口地址
    client.Post(
        apiPath,
        req.session.loginHeaders["set-cookie"],
        JSON.stringify(req.body),
        chunk => {
            var data = JSON.parse(chunk);
            res.json(data);
        }
    );
};
var fileOpt = {
    httpFiles: '', //上传图片路径
    filePath: '', //原图路径
    contentType: 'image/*'
}
exports.Upload = function (req, res, next) {
    let form = new formidable.IncomingForm();
    var tmpPath = path.join(__dirname, '../../', 'tmp');
    form.uploadDir = tmpPath;   //文件保存的临时目录为当前项目下的tmp文件夹
    if (!fs.existsSync(tmpPath)) {
        fs.mkdir(tmpPath);
    }
    //maxFieldsSize是单个表单域能够申请到的最大内存值，不是限定文件的大小。
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.keepExtensions = true;        //使用文件的原扩展名
    var maxByte = 5 * 1024 * 1024;//设置上传文件的大小，默认值为5M
    log(maxByte);
    form.parse(req, function (err, fields, file) {
        var filePath = '';
        //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
        if (file.tmpFile) {
            filePath = file.tmpFile.path;
        } else {
            for (var key in file) {
                if (file[key].path && filePath === '') {
                    filePath = file[key].path;
                    break;
                }
            }
        }
        fileOpt.httpFiles = filePath;

        // //文件移动的目录文件夹，不存在时创建目标文件夹
        // var targetDir = path.join(__dirname, '../../', 'upload');
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        var fileStats = fs.statSync(filePath);//获取文件信息
        log('文件信息')
        log(fileStats)
        // //判断文件类型是否允许上传
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
            var err = new Error('此文件类型不允许上传');
            deleteFolderRecursive(tmpPath);
            res.json({ code: -1, message: '此文件类型不允许上传' });
        } else if (fileStats.size > maxByte) {
            var err = new Error('此文件类型不允许上传');
            deleteFolderRecursive(tmpPath);
            res.json({ code: -1, message: '超出文件大小限制' });
        }
        else {
            //这里上传到阿里云服务器
            postFile(req.session.loginHeaders["set-cookie"], (chunk) => {
                log('上传成功！！！！！！');
                res.json({ code: 999, data: chunk.toString() });
            })
        }

        //下面代码上传到本地服务器
        // if (!fs.existsSync(targetDir)) {
        //     fs.mkdir(targetDir);
        // }
        // var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        // //判断文件类型是否允许上传
        // if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
        //     var err = new Error('此文件类型不允许上传');
        //     res.json({ code: -1, message: '此文件类型不允许上传' });
        // } else {
        //     //以当前时间戳对上传文件进行重命名
        //     var fileName = new Date().getTime() + fileExt;
        //     var targetFile = path.join(targetDir, fileName);
        //     //移动文件
        //     fs.rename(filePath, targetFile, function (err) {
        //         if (err) {
        //             console.info(err);
        //             res.json({ code: -1, message: '操作失败' });
        //         } else {
        //             //上传成功，返回文件的相对路径
        //             var fileUrl = '/upload/' + fileName;
        //             res.json({ code: 999, data: fileUrl });
        //         }
        //     });
        // }
    });
    var deleteFolderRecursive = function (url) {
        var files = [];
        //判断给定的路径是否存在
        if (fs.existsSync(url)) {
            //返回文件和子目录的数组
            files = fs.readdirSync(url);
            files.forEach(function (file, index) {
                var curPath = path.join(url, file);
                //fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                    // 是文件delete file
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            //清除文件夹
            fs.rmdirSync(url);
        } else {
            console.log("给定的路径不存在，请给出正确的路径");
        }
    };
    //服务器上传
    var postFile = function (loginCookie, callback) {
        var data = {
            image: {
                file: fileOpt.httpFiles,
                content_type: fileOpt.contentType
            }
        };
        var options = {
            multipart: true,
            headers: {
                'Content-Disposition': 'form-data; name=\'media\';filename=\'' + path.basename(fileOpt.httpFiles) + '\'',
                'Cookie': loginCookie
            },
            parse: true
        };
        needle.post(siteConfig.nodeServer.OSSUploadApiPath, data, options)
            .on('readable', function (err, res) { /* eat your chunks */
                let chunk;
                while (chunk = this.read()) {
                    log(chunk)
                    callback(chunk.data);
                }
            })
            .on('end', function () {
                log('Ready-o, friend-o.');
            });
    }
    // log(warning("post转接上传服务"));
    // log(form);
    // client.PostFile(
    //     '/file/uploadImage',
    //     req.session.loginHeaders["set-cookie"],
    //     JSON.stringify(req.body),
    //     chunk => {
    //         var data = JSON.parse(chunk);
    //         res.json(data);
    //     }
    // );
};
//处理参数
function param(data) {
    let url = "";
    for (var k in data) {
        if (k !== "requrl") {
            let value = data[k] !== undefined ? data[k] : "";
            url += `&${k}=${encodeURIComponent(value)}`;
        }
    }
    return url ? url.substring(1) : "";
}