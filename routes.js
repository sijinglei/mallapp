var express = require("express");

var controllers = require("./server/controllers");

var api = require("./src/api/index");

var account = controllers.account;
var goods = controllers.goods;
var cart = controllers.cart;
var com = controllers.com;

var order = controllers.order;

var router = express.Router();

var islogin = false;
//获取首页数据
router.get(api.goods.index, goods.indexData);
//登录
router.get("/api/account/loginIn", account.loginIn);

//发送手机验证码
router.get(api.account.getmobilecode, account.getMobileCode);
//统一get请求转发
router.get("/api/get", com.GetData);
//统一post请求转发
router.post("/api/post", com.PostData);

// //测试
// router.get("/api/goods/test", goods.goodList);
// //商城类目
// router.get(api.goods.cartlist, goods.goodsCat);

// //购物车总数
// router.get(api.cart.cartCount, cart.cartCount);
// //我的购物车
// router.get(api.cart.my, cart.cartMy);
// //添加购物车
// router.post(api.cart.cartAdd, cart.addCart);
// //编辑购物车
// router.post(api.cart.cartEdit, cart.editCart);
// //下单
// router.post(api.order.add, goods.orderAdd);
// //用户租赁详情
// router.get(api.order.leaseList, order.leaseList);

module.exports = router;