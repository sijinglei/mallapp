var client = require("../common/HttpClient");
var qs = require("querystring");
var api = require("../../src/api/index");

/*****========购物车相关controls=========******/
//购物车数量
exports.cartCount = function(req, res) {
    client.Get(
        api.cart.cartCount,
        req.session.loginHeaders["set-cookie"],
        chunk => {
            console.log("购物车总数");
            var data = JSON.parse(chunk);
            console.log(data);
            res.json(data);
        }
    );
};
//我的购物车
exports.cartMy = function(req, res) {
    client.Get(api.cart.my, req.session.loginHeaders["set-cookie"], chunk => {
        console.log("我的购物车");
        var data = JSON.parse(chunk);
        console.log(data);
        res.json(data);
    });
};

//我的购物车
exports.addCart = function(req, res) {
    console.log(req.body);
    client.Post(
        api.cart.cartAdd,
        req.session.loginHeaders["set-cookie"],
        qs.stringify(req.body),
        chunk => {
            console.log("我的购物车");
            var data = JSON.parse(chunk);
            console.log(data);
            res.json(data);
        }
    );
};

//我的购物车
exports.editCart = function(req, res) {
    console.log(req.body);
    client.Post(
        api.cart.cartEdit,
        req.session.loginHeaders["set-cookie"],
        JSON.stringify(req.body),
        chunk => {
            console.log("编辑购物车");
            var data = JSON.parse(chunk);
            console.log(data);
            res.json(data);
        }
    );
};
