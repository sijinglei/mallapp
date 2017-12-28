var express = require("express");

var controllers = require("./server/controllers");

var api = require("./src/api/index");

var account = controllers.account;
var com = controllers.com;

var order = controllers.order;

var router = express.Router();

var islogin = false;
//注册
router.get(api.account.register, account.register);
//登录
router.get(api.account.login, account.loginIn);
//发送手机验证码
router.get(api.account.getmobilecode, account.getMobileCode);

//统一get请求转发
router.get(api.get, com.GetData);
//统一post请求转发
router.post(api.post, com.PostData);

//上传
router.post(api.upload, com.Upload);

module.exports = router;