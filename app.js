var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');//網頁ICON有關
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//DATABASE
var session = require('express-session');//用戶和伺服器之間的對話資訊
var mongoStore = require('connect-mongo')(session);
//成功與否資訊顯示
var flash = require('connect-flash');

var routes = require('./routes/index');
var app = express();
app.set('port', process.env.PORT || 3003);

//網頁前端設定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: settings.cookieSecret,//防止cookie竄改
    key: settings.db,//cookie名稱
    cookie: {maxAge: 1000*60*60*24*30},//保存30天
    store: new mongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port
    })
}));

routes(app);

app.listen(app.get('port'), ()=>{
    console.log('Express server listening on port ' + app.get('port'));
})

