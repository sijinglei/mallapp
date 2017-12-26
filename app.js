var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var compression = require("compression");
var RedisStore = require("connect-redis")(session);
var config = require("./site_config");


//node接口路由配置
var routes = require("./routes");

var app = express();
/**
 * 该模块创建了一个中间件，用于记录HTTP服务器中请求的响应时间。
 * 这里的“响应时间”定义为，当请求进入该中间件时，当头被写到客户端时的时间。
 */
//session 一个小时过期
app.use(
    session({
        secret: "mallapp",
        cookie: {
            maxAge: 1000 * 60 * 60
        },
        resave: true,
        saveUninitialized: true,
        secure: false,
        rolling: true,
        store: new RedisStore({
            host: config.sessionStore.host,
            port: config.sessionStore.port
        })
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
app.use(function (req, res, next) {
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