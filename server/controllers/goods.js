var client = require("../common/HttpClient");
var qs = require("querystring");
var api = require("../../src/api/index");

/*****========商品相关controls=========******/
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

exports.orderAdd = function(req, res) {
    console.log("调用列表成功");
    var reqData = {
        addressId: 1,
        myCouponId: null,
        remark: "变态辣",
        leasePayType: 2,
        products: [{
                productId: 35,
                num: 1,
                leaseMonth: 6,
                serviceIds: [9]
            },
            {
                productId: 34,
                num: 2,
                leaseMonth: 3,
                serviceIds: [8, 9]
            }
        ]
    };

    client.Post(
        api.order.add,
        req.session.loginHeaders["set-cookie"],
        qs.stringify(reqData),
        chunk => {
            console.log("调用列表成功，返回");
            var data = JSON.parse(chunk);
            console.log(data);
            res.json(data);
        }
    );
};