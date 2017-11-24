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

//发送手机验证码
router.get(api.account.getmobilecode, account.getMobileCode);

//测试
router.get("/api/goods/test", goods.goodList);
//商城类目
router.get(api.goods.catlist, goods.goodsCat);

//商城类目
router.get(api.cart.my, cart.cartMy);
//下单
router.post(api.order.add, goods.orderAdd);

module.exports = router;