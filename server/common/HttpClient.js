var http = require("http");
var base = require("../../site_config").nodeServer;
var chalk = require('chalk');
const log = console.log;

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const green = chalk.keyword('green');

var HttpClient = {
    //资源请求入口
    Get: function (path, loginCookie, callback) {
        var reqPath = path.indexOf("/") == 0 ? path.substring(1) : path;
        var options = this.ClientHeader(
            base.apiConfig.apiBasePath + path, //.replace("/api/", ""),
            loginCookie,
            "",
            "get"
        );
        log(warning(options));
        this.HttpGet(options, callback);
    },

    Post: function (path, loginCookie, reqData, callback) {
        var reqPath = path.indexOf("/") == 0 ? path.substring(1) : path;
        var options = this.ClientHeader(
            base.apiConfig.apiBasePath + reqPath, //.replace("/api/", ""),
            loginCookie,
            reqData,
            "post"
        );
        log(green("post请求头"));
        log(warning(options));
        this.HttpPost(options, reqData, callback);
    },
    PostFile: function (path, loginCookie, reqData, callback) {
        var option = this.uploadHead(path, loginCookie);
        this.HttpPost(options, reqData, callback);
    },
    //登录注册请求入口
    GetByClientId: function (path, callback) {
        var options = this.ClientLoginHeader(path, "", "get");
        this.HttpLoginGet(options, callback);
    },

    PostByClientId: function (path, reqData, callback) {
        var options = this.ClientLoginHeader(path, reqData, "post");
        this.HttpPost(options, reqData, callback);
    },
    //Get方法
    HttpGet: function (options, callback, encode = "utf8") {
        try {
            var errorData = {
                code: 0,
                data: "",
                message: "异常"
            };
            var req = http.get(options, function (res) {
                res.setEncoding(encode);
                if (res.statusCode == "200") {
                    var str = "";
                    res.on("data", function (chunk) {
                        str += chunk;
                    });
                    res.on("end", function () {
                        if (encode == "binary") {
                            callback(res.headers, str);
                        } else {
                            callback(str);
                        }
                    });
                } else if (res.statusCode == "401") {
                    callback('{ "code": -1, "message": "拒绝访问" }');
                } else {
                    var str = "";
                    res.on("data", function (chunk) {
                        str += chunk;
                    });
                    res.on("end", function () {
                        try {
                            var obj = JSON.parse(str);
                            log(error(obj.error));
                            if (obj.error != undefined) {
                                callback('{"code":"-1", "message": "' + obj.error + '" }');
                            } else if (obj.message != undefined) {
                                callback('{"code":"-1", "message": "' + obj.message + '" }');
                            } else {
                                callback('{"code":"-1", "message": "服务器异常" }');
                            }
                        } catch (e) {
                            log(error(e));
                            callback('{"code":"-1", "message": "服务器异常" }');
                        }
                    });
                }

                res.on("error", function (e) {
                    log(error(e));
                    log(error("problem with request: " + e.message));
                    if (callback) {
                        callback('{"code":"-1", "message": "' + e.message + '" }');
                    }
                });
            });
            req.end();
        } catch (err) {
            log(error("HttpGet catch异常"));
            var errorMsg =
                "\n" +
                "Error " +
                new Date().toISOString() +
                " " +
                req.url +
                "\n" +
                err.stack ||
                err.message ||
                "unknow error" + "\n";
            log(error(errorMsg));
        }
    },
    //Get方法
    HttpLoginGet: function (options, callback, encode = "utf8") {
        try {
            var errorData = {
                code: 0,
                data: '',
                message: "异常"
            };
            log(warning(options));
            var req = http.get(options, function (res) {
                if (res.statusCode == "200") {
                    var str = "";
                    res.setEncoding(encode);
                    res.on("data", function (chunk) {
                        str += chunk;
                    });
                    res.on("end", function () {
                        callback(res.headers, str);
                    });
                } else if (res.statusCode == "401") {
                    callback('{ "code": -1, "message": "拒绝访问","data":[] }');
                } else {
                    var str = "";
                    res.setEncoding("utf8");
                    res.on("data", function (chunk) {
                        str += chunk;
                    });
                    res.on("end", function () {
                        try {
                            var obj = JSON.parse(str);
                            log(error(obj));
                            if (obj.error != undefined) {
                                callback('{"code":"-1", "message": "' + obj.error + '" }');
                            } else if (obj.message != undefined) {
                                callback('{"code":"-1", "message": "' + obj.message + '" }');
                            } else {
                                callback('{"code":"-1", "message": "服务器异常" }');
                            }
                        } catch (e) {
                            log(error(e));
                            callback('{"code":"-1", "message": "服务器异常" }');
                        }
                    });
                }
                res.on("error", function (e) {
                    log(error(e));
                    log("problem with request: " + e.message);
                    if (callback) {
                        callback('{"code":"-1", "message": "' + e.message + '" }');
                    }
                });
            });
            req.end();
        } catch (err) {
            log(error("HttpLoginGet catch异常"));
            var errorMsg =
                "\n" +
                "Error " +
                new Date().toISOString() +
                " " +
                req.url +
                "\n" +
                err.stack ||
                err.message ||
                "unknow error" + "\n";
            log(error(errorMsg));
            if (callback) {
                callback('{"code":"-1", "message": "' + err.message + '" }');
            }
        }
    },

    //Post方法
    HttpPost: function (options, reqData, callback) {
        try {
            var req = http.request(options, function (res) {
                if (res.statusCode == "200") {
                    var str = "";
                    res.setEncoding("utf8");

                    res.on("data", function (chunk) {
                        str += chunk;
                    });
                    res.on("end", function () {
                        callback(str);
                    });
                } else if (res.statusCode == "401") {
                    callback('{ "code": -1, "message": "拒绝访问" }');
                } else {
                    var str = "";
                    res.setEncoding("utf8");
                    res.on("data", function (chunk) {
                        str += chunk;
                    });
                    res.on("end", function () {
                        try {
                            var obj = JSON.parse(str);
                            if (obj.error != undefined) {
                                callback('{"code":"-1", "message": "' + obj.error + '" }');
                            } else if (obj.message != undefined) {
                                callback('{"code":"-1", "message": "' + obj.message + '" }');
                            } else {
                                log(error(obj.message));
                                callback('{"code":"-1", "message": "服务器异常" }');
                            }
                        } catch (e) {
                            log(error(e));
                            callback('{"code":"-1", "message": "服务器异常" }');
                        }
                    });
                }
            });
            req.on("error", function (e) {
                log(error(e));
                if (callback) {
                    callback('{"code":"-1", "message": "' + e.message + '" }');
                }
            });
            req.write(reqData);
            req.end();
        } catch (err) {
            log(error("HttpPost catch异常"));
            log(error(err));
            var errorMsg =
                "\n" +
                "Error " +
                new Date().toISOString() +
                " " +
                req.url +
                "\n" +
                err.stack ||
                err.message ||
                "unknow error" + "\n";
            log(error(errorMsg));
            if (callback) {
                callback('{"code":"-1", "message": "' + err.message + '" }');
            }
        }
    },
    //一般接口请求头
    ClientHeader: function (path, loginCookie, data, method) {
        var _contentType = "application/json; charset=utf-8";
        var options = {
            host: base.apiConfig.host,
            port: base.apiConfig.port,
            path: path,
            method: method,
            headers: {
                "Content-Type": _contentType,
                "Content-Length": Buffer.byteLength(data)
            }
        };
        if (loginCookie && loginCookie != "") {
            options.headers.Cookie = loginCookie;
        }
        return options;
    },
    //登录头
    ClientLoginHeader: function (path, data, method) {
        var _contentType = "application/json;charset=utf-8";
        var options = {
            host: base.loginConfig.host,
            port: base.loginConfig.port,
            path: path,
            method: method,
            headers: {
                "Content-Type": _contentType,
                "Content-Length": Buffer.byteLength(data, "utf8")
            }
        };
        return options;
    },
    uploadHead: function (path, loginCookie) {
        var boundaryKey = '----' + new Date().getTime();
        var options = {
            host: base.loginConfig.host,
            port: base.loginConfig.port,
            method: 'POST',
            path: path,//上传服务路径
            headers: {
                'Content-Type': 'multipart/form-data; boundary=' + boundaryKey,
                'Connection': 'keep-alive',
                'Cookie': loginCookie
            }
        };
    }
};

module.exports = HttpClient;