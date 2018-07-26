var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');//網頁ICON有關
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//DATABASE
var session = require('express-session');//用戶和伺服器之間的對話資訊
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
//操作資訊顯示
var flash = require('connect-flash');
//
var app = express();
var router = require('./routes/index');
var port = process.env.PORT || 3003;

app.set('port', port);
//前端模板引擎設定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: settings.cookieSecret,//防止cookie竄改
    key: settings.db,//cookie名稱
    cookie: {maxAge: 1000*60*60*24*30},//保存30天
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port,
        url: 'mongodb://localhost:27017/cookie'
    }),
    resave: true,
    saveUninitialized: true
}));
//flash設定
app.use((req, res, next)=>{
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});
//路由
var io = require('socket.io').listen(app.listen(port));
router(app, io);
//
console.log('Express server listening on port ' + app.get('port'));
//
module.exports = app;

