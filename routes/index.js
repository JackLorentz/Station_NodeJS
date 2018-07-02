var crypto = require('crypto');//建立散列值來加密
User = require('../models/user.js');

module.exports = (app)=>{
    app.get('/', (req, res)=>{
        res.render('index', {
            title: 'Station-Login'
        });
    })

    app.post('/reg', (req, res)=>{
        var usr = req.body.user,
            pwd = req.body.pwd;
        //建立密碼md5值
        var md5 = crypto.createHash('md5');
            pwd = md5.update(req.body.pwd).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: pwd
        });
        //檢查用戶是否已存在
        User.get(newUser.name, (err, user)=>{
            if(user){
                req.flash('error', '用戶已存在!');
                return res.redirect('/reg');
            }
            //若不存在則新增用戶
            newUser.save((err, user)=>{
                if(err){
                    req.flash('error', err);
                }
                //用戶資訊存入session
                req.session.user = user;
                req.flash('success', '註冊成功!');
                res.redirect('/');
            });
        });
    })

    app.get('/post', (req, res)=>{
        res.render('post', {
            title: 'Home'
        });
    })

    app.post('/post', (req, res)=>{})

    app.get('/logout', (req, res)=>{})
}