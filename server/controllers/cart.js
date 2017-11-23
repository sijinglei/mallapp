var client = require("../common/HttpClient");
var qs = require("querystring");
var api = require("../../src/api/index");

/*****========购物车相关controls=========******/
//我的购物车
exports.cartMy = function(req, res) {
    client.Get(api.cart.my, req.session.loginHeaders["set-cookie"], chunk => {
        console.log("我的购物车");
        var data = JSON.parse(chunk);
        console.log(data);
        res.json(data);
    });
};