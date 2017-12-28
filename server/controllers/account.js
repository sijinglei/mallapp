const qs = require("querystring");
const client = require("../common/HttpClient");
const config = require("../../site_config").nodeServer.loginConfig;
const chalk = require('chalk');
const log = console.log;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const green = chalk.keyword('green');

//登录
exports.loginIn = function (req, res) {
    log(warning("=======请求开始======="));
    var username = req.query.username;
    var reqData = {
        username: req.query.username,
        userpwd: req.query.userpwd,
        appKey: config.appKey,
        method: config.method,
        v: config.version,
        format: config.format,
        loginType: config.loginType
    };
    //不可改变
    // var secret = "a4160d00-b083-40f9-a749-07aef8782001";
    reqData.sign = getSign(reqData, config.secret);
    var data = qs.stringify(reqData);
    log(green(data));
    client.GetByClientId(
        "/newmobile/router/user.login?" + data,
        (headers, chunk) => {
            var obj = JSON.parse(chunk);
            log(warning("------------保存session---------------"));
            log(obj);
            if (obj.code == "999") {
                req.session.loginHeaders = headers;
                //最终过期时间，如果没有任何操作，2小时过期
                var expire_time = new Date();
                expire_time.setHours(expire_time.getHours() + 2);
                req.session.expire_time = expire_time.toLocaleString();
                res.cookie("username", reqData.username);
            }
            res.json(obj);
        }
    );
};
//注册
exports.register = function (req, res) {
    var reqData = {
        mobile: req.query.mobile,
        code: req.query.code
    }
    client.GetByClientId(
        "/user.mobile.register?" + qs.stringify(reqData),
        (headers, chunk) => {
            var obj = JSON.parse(chunk);
            log(warning("------------注册成功---------------"));
            log(obj);
            res.json(obj);
        }
    );
};

//获取手机验证码
exports.getMobileCode = function (req, res) {
    var mobile = req.query.mobile;
    client.GetByClientId(
        "/user.register.mobile.code?mobile=" + mobile,
        (headers, chunk) => {
            log('发送验证码')
            log(headers);
            var obj = JSON.parse(headers);
            res.json(obj);
        }
    );
};


//生成签名方法
function getSign(data, secret) {
    var string = raw1(data);
    string = secret + string + secret;
    var crypto = require("crypto");
    return crypto
        .createHash("sha1")
        .update(string)
        .digest("hex")
        .toUpperCase();
}
//处理签名数据
function raw1(args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key] = args[key];
    });
    var string = "";
    for (var k in newArgs) {
        string += k + newArgs[k];
    }
    string = string.substr(0);
    return string;
}