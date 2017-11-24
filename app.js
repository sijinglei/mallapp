var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var compression = require("compression");
//node接口路由配置
var routes = require("./routes");

var app = express();
//session 30分钟
app.use(
    session({
        secret: "mallapp",
        cookie: {
            maxAge: 1000 * 60 * 30
        },
        resave: true,
        saveUninitialized: true,
        secure: false,
        rolling: true
    })
);
app.use(favicon(__dirname + "/static/favicon.ico"));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(cookieParser());
//添加gzip压缩
app.use(compression());
// app.use(express.static(path.join(__dirname, "public")));
//如果session过期
//刷新session的过期时间
app.use(function(req, res, next) {
    if (typeof req.session != "undefined") {
        if (typeof req.session.loginHeaders != "undefined") {
            if (typeof req.session.expire_time != "undefined") {
                if (new Date(req.session.expire_time) > new Date()) {
                    req.session._garbage = Date();
                    req.session.touch();
                }
            }
        }
    }
    next();
});
app.use("/", routes);

console.log("启动成功！");
module.exports = app;