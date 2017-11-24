// var OAuthHelp = require("../common/AuthorizationHelp");

var qs = require("querystring");
var client = require("../common/HttpClient");

//登录
exports.loginIn = function(req, res) {
    console.log("=======请求开始=======");
    var reqData = {
        username: req.query.username,
        userpwd: req.query.userpwd,
        appKey: "100001",
        method: "user.login",
        v: "1.0",
        format: "json",
        loginType: "3"
    };
    var secret = "a4160d00-b083-40f9-a749-07aef8782001";
    reqData.sign = getSign(reqData, secret);
    console.log("sign=" + reqData.sign);
    //url传值用qs,  body传值使用json
    var data = qs.stringify(reqData);
    client.GetByClientId(
        "/newmobile/router/user.login?" + data,
        (headers, chunk) => {
            var obj = JSON.parse(chunk);
            console.log("------------保存session---------------");
            req.session.loginHeaders = headers;
            console.log(obj);
            //最终过期时间，如果没有任何操作，2小时过期
            var expire_time = new Date();
            expire_time.setHours(expire_time.getHours() + 2);
            req.session.expire_time = expire_time.toLocaleString();
            res.json(obj);
        }
    );
};
//注册
exports.register = function(req, res) {
    var mobile = req.query.mobile;
};
//获取手机验证码
exports.getMobileCode = function(req, res) {
    var mobile = req.query.mobile;
    client.GetByClientId(
        "/user.register.mobile.code?mobile=" + mobile,
        (headers, chunk) => {
            console.log(chunk);
        }
    );
};
//生成签名方法
function getSign(data, secret) {
    var string = raw1(data);
    string = secret + string + secret;
    console.log(string);
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
    keys.forEach(function(key) {
        newArgs[key] = args[key];
    });
    var string = "";
    for (var k in newArgs) {
        string += k + newArgs[k];
    }
    string = string.substr(0);
    return string;
}