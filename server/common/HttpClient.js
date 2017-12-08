var http = require("http");
var base = require("./base");

var HttpClient = {
    //资源请求入口
    Get: function(path, loginCookie, callback) {
        var reqPath = path.indexOf("/") == 0 ? path.substring(1) : path;
        var options = this.ClientHeader(
            base.apiConfig.apiBasePath + path, //.replace("/api/", ""),
            loginCookie,
            "",
            "get"
        );
        console.log(options);
        this.HttpGet(options, callback);
    },

    Post: function(path, loginCookie, reqData, callback) {
        var reqPath = path.indexOf("/") == 0 ? path.substring(1) : path;
        var options = this.ClientHeader(
            base.apiConfig.apiBasePath + reqPath, //.replace("/api/", ""),
            loginCookie,
            reqData,
            "post"
        );
        console.log("post请求头");
        console.log(options);
        this.HttpPost(options, reqData, callback);
    },
    //登录注册请求入口
    GetByClientId: function(path, callback) {
        var options = this.ClientLoginHeader(path, "", "get");
        console.log(options);
        this.HttpLoginGet(options, callback);
    },

    PostByClientId: function(path, reqData, callback) {
        var options = this.ClientLoginHeader(path, reqData, "post");

        this.HttpPost(options, reqData, callback);
    },
    //Get方法
    HttpGet: function(options, callback, encode = "utf8") {
        try {
            var errorData = {
                flag: 0,
                msg: "异常"
            };
            var req = http.get(options, function(res) {
                if (res.statusCode == "200") {
                    var str = "";
                    res.setEncoding(encode);
                    res.on("data", function(chunk) {
                        str += chunk;
                    });
                    res.on("end", function() {
                        if (encode == "binary") {
                            callback(res.headers, str);
                        } else {
                            callback(str);
                        }
                    });
                } else if (res.statusCode == "401") {
                    callback('{ "flag": -1, "message": "拒绝访问","data":[] }');
                } else {
                    var str = "";
                    res.setEncoding("utf8");
                    res.on("data", function(chunk) {
                        str += chunk;
                    });
                    res.on("end", function() {
                        try {
                            var obj = JSON.parse(str);
                            console.error(obj.error);
                            if (obj.error != undefined) {
                                callback('{"code":"-1", "message": "' + obj.error + '" }');
                            } else if (obj.message != undefined) {
                                callback('{"code":"-1", "message": "' + obj.message + '" }');
                            } else {
                                callback('{"code":"-1", "message": "服务器异常" }');
                            }
                        } catch (ex) {
                            console.error(ex);
                            callback('{"code":"-1", "message": "服务器异常" }');
                        }
                    });
                }
                res.on("error", function(e) {
                    console.error(e);
                    console.log("problem with request: " + e.message);
                    if (callback) {
                        callback('{"code":"-1", "message": "' + e.message + '" }');
                    }
                });
            });
        } catch (err) {
            console.error(err);
            console.log("catch异常");
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
            console.log(errorMsg);
        }
    },
    //Get方法
    HttpLoginGet: function(options, callback, encode = "utf8") {
        try {
            var errorData = {
                flag: 0,
                msg: "异常"
            };
            console.log(options);
            var req = http.get(options, function(res) {
                if (res.statusCode == "200") {
                    var str = "";
                    res.setEncoding(encode);
                    res.on("data", function(chunk) {
                        str += chunk;
                    });
                    res.on("end", function() {
                        callback(res.headers, str);
                    });
                } else if (res.statusCode == "401") {
                    callback('{ "flag": -1, "message": "拒绝访问","data":[] }');
                } else {
                    var str = "";
                    res.setEncoding("utf8");
                    res.on("data", function(chunk) {
                        str += chunk;
                    });
                    res.on("end", function() {
                        try {
                            var obj = JSON.parse(str);
                            console.error(obj.error);
                            if (obj.error != undefined) {
                                callback('{"code":"-1", "message": "' + obj.error + '" }');
                            } else if (obj.message != undefined) {
                                callback('{"code":"-1", "message": "' + obj.message + '" }');
                            } else {
                                callback('{"code":"-1", "message": "服务器异常" }');
                            }
                        } catch (ex) {
                            console.error(ex);
                            callback('{"code":"-1", "message": "服务器异常" }');
                        }
                    });
                }
                res.on("error", function(e) {
                    console.error(e);
                    console.log("problem with request: " + e.message);
                    if (callback) {
                        callback('{"code":"-1", "message": "' + e.message + '" }');
                    }
                });
            });
        } catch (err) {
            console.error(err);
            console.log("catch异常");
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
            console.log(errorMsg);
        }
    },

    //Post方法
    HttpPost: function(options, reqData, callback) {
        try {
            var req = http.request(options, function(res) {
                console.log("headers:", JSON.stringify(res.headers));
                console.log("STATUS: " + res.statusCode);
                if (res.statusCode == "200") {
                    var str = "";
                    res.setEncoding("utf8");

                    res.on("data", function(chunk) {
                        str += chunk;
                    });
                    res.on("end", function() {
                        callback(str);
                    });
                } else if (res.statusCode == "401") {
                    callback('{ "flag": -1, "message": "拒绝访问","data":[] }');
                } else {
                    var str = "";
                    res.setEncoding("utf8");
                    res.on("data", function(chunk) {
                        str += chunk;
                    });
                    res.on("end", function() {
                        try {
                            var obj = JSON.parse(str);
                            if (obj.error != undefined) {
                                callback('{"code":"-1", "message": "' + obj.error + '" }');
                            } else if (obj.message != undefined) {
                                callback('{"code":"-1", "message": "' + obj.message + '" }');
                            } else {
                                console.error(obj.message);
                                callback('{"code":"-1", "message": "服务器异常" }');
                            }
                        } catch (ex) {
                            console.error(ex);
                            callback('{"code":"-1", "message": "服务器异常" }');
                        }
                    });
                }
            });
            req.on("error", function(e) {
                console.log("problem with request: " + e.message);
                if (callback) {
                    callback('{"code":"-1", "message": "' + e.message + '" }');
                }
            });
            req.write(reqData);
            req.end();

            console.log(req);
        } catch (err) {
            console.log("catch异常");
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
            console.log(errorMsg);
        }
    },
    //一般接口请求头
    ClientHeader: function(path, loginCookie, data, method) {
        var _contentType = "application/json";
        var options = {
            host: base.apiConfig.host,
            port: base.apiConfig.port,
            path: path,
            method: method,
            headers: {
                "Content-Type": _contentType,
                "Content-Length": Buffer.byteLength(data, "utf8")
            }
        };
        if (loginCookie && loginCookie != "") {
            options.headers.Cookie = loginCookie;
        }
        return options;
    },
    //登录头
    ClientLoginHeader: function(path, data, method) {
        var _contentType = "application/json";
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
    }
};

module.exports = HttpClient;