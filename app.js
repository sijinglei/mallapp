var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var compression = require("compression");

var domain = require("domain");
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
/*----------异常处理----------*/
app.use(function(req, res, next) {
    var reqDomain = domain.create();
    reqDomain.on("error", function(err) {
        console.log("状态吗：" + res.statusCode);
        if (res.statusCode != 401) {
            try {
                // 强制退出机制
                var killTimer = setTimeout(function() {
                    process.exit(1);
                }, 30000);
                killTimer.unref(); // 非常重要

                // 自动退出机制，停止接收新链接，等待当前已建立连接的关闭
                server.close(function() {
                    // 此时所有连接均已关闭，此时 Node 会自动退出，不需要再调用
                    process.exit(1);
                });
            } catch (e) {
                console.error("err", e.stack);
            }

            console.error(err);
            res.send(500, err.stack); // 成功给用户返回了 500
        }
    });
    reqDomain.run(next);
});

process.on("uncaughtException", function(err) {
    console.error(err);
    try {
        var killTimer = setTimeout(function() {
            process.exit(1);
        }, 30000);
        killTimer.unref();

        server.close();
    } catch (e) {
        console.error("error when exit", e.stack);
    }
});
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