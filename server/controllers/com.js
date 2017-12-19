var client = require("../common/HttpClient");
var chalk = require('chalk');
const log = console.log;

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const green = chalk.keyword('green');

//get转接服务
exports.GetData = function (req, res) {
    log(warning("get转接服务"));
    let apiPath = req.query.requrl;
    let params = param(req.query);
    if (params != "") {
        apiPath += (apiPath.indexOf("?") < 0 ? "?" : "&") + param(req.query);
    }
    client.Get(apiPath, req.session.loginHeaders["set-cookie"], chunk => {
        var data = JSON.parse(chunk);
        res.json(data);
    });


};

//post转接服务
exports.PostData = function (req, res) {
    log(warning("post转接服务"));
    let apiPath = req.body.requrl;
    delete req.body.requrl; //去掉多余的接口地址
    client.Post(
        apiPath,
        req.session.loginHeaders["set-cookie"],
        JSON.stringify(req.body),
        chunk => {
            var data = JSON.parse(chunk);
            res.json(data);
        }
    );
};
//处理参数
function param(data) {
    let url = "";
    for (var k in data) {
        if (k !== "requrl") {
            let value = data[k] !== undefined ? data[k] : "";
            url += `&${k}=${encodeURIComponent(value)}`;
        }
    }
    return url ? url.substring(1) : "";
}