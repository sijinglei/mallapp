var client = require("../common/HttpClient");
var qs = require("querystring");
var api = require("../../src/api/index");

exports.goodList = function(req, res) {
    console.log("调用列表成功");
    client.Get("goods/test", req.session.loginHeaders["set-cookie"], chunk => {
        console.log("调用列表成功，返回");
        var data = JSON.parse(chunk);
        console.log(data);
        res.json(data);
    });
};

exports.goodsCat = function(req, res) {
    console.log("调用列表成功");
    client.Get(
        api.goods.catlist,
        req.session.loginHeaders["set-cookie"],
        chunk => {
            console.log("调用列表成功，返回");
            var data = JSON.parse(chunk);
            console.log(data);
            res.json(data);
        }
    );
};