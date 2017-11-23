var express = require("express");

var account = require("./server/controllers/account");
var goods = require("./server/controllers/goods");

var api = require("./src/api/index");

var router = express.Router();
router.get("/", function() {
    console.log(account);
});
var islogin = false;
//登录
router.get("/api/account/loginIn", account.loginIn);

//测试
router.get("/api/goods/test", goods.goodList);
//商城类目
router.get(api.goods.catlist, goods.goodsCat);

module.exports = router;