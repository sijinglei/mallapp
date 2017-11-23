var express = require("express");

var controllers = require("./server/controllers");

var api = require("./src/api/index");

var account = controllers.account;
var goods = controllers.goods;
var cart = controllers.cart;

var router = express.Router();

var islogin = false;
//登录
router.get("/api/account/loginIn", account.loginIn);

//测试
router.get("/api/goods/test", goods.goodList);
//商城类目
router.get(api.goods.catlist, goods.goodsCat);

//商城类目
router.get(api.cart.my, cart.cartMy);

module.exports = router;