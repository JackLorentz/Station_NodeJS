var express = require('express');
var router = express.Router();
var crypto = require('crypto');//建立散列值來加密
var message;
User = require('../models/user.js');

module.exports = (app, io) => {
    app.get('/', (req, res)=>{
        res.render('index', {
            title: 'Station'
        });
    })

    app.post('/', (req, res)=>{
        var name = req.body.name,
            md5 = crypto.createHash('md5'),
            pwd = md5.update(req.body.pwd).digest('hex');
        //
        User.get(req.body.name, (err, user)=>{
            if(!user){
                console.log("error: 用戶不存在");
                req.flash('error', '用戶不存在');
                message = "error: 用戶不存在";
                return res.redirect('/');
            }
            if(user.password != pwd){
                console.log("error: 密碼錯誤");
                req.flash('error', '密碼錯誤');
                message = "error: 密碼錯誤";
                return res.redirect('/');
            }
            req.session.user = user;
            req.flash('info', '登錄成功!');
            message = "success: 登錄成功 !";
            io.sockets.on('connection', (socket)=>{
                socket.emit('msg', message);
            });
            res.redirect('/home');
        });
    })
    
    app.get('/reg', (req, res)=>{
        res.render('reg', {
            title: 'Register'
        });
    })
    
    app.post('/reg', (req, res)=>{
        var name = req.body.name,
            pwd = req.body.pwd,
            pwd_re = req.body['pwd-re'];
        if(pwd != pwd_re){
            req.flash('error', '兩次輸入不一樣!');
            io.sockets.on('connection', (socket)=>{
                socket.emit('msg', 'error: 兩次輸入不一樣');
            });
            return res.redirect('/reg');
        }
        //建立密碼md5值
        var md5 = crypto.createHash('md5'),
            pwd = md5.update(req.body.pwd).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: pwd
        });
        //檢查用戶是否已存在
        User.get(newUser.name, (err, user)=>{
            if(user){
                req.flash('error', '用戶已存在!');
                io.sockets.on('connection', (socket)=>{
                    socket.emit('msg', 'error: 用戶已存在 !');
                });
                return res.redirect('/reg');
            }
            //若不存在則新增用戶
            newUser.save(newUser, (err, user)=>{
                if(err){
                    req.flash('error', err);
                }
                //用戶資訊存入session
                req.session.user = user;
                req.flash('info', '註冊成功!');
                io.sockets.on('connection', (socket)=>{
                    socket.emit('msg', 'success: 註冊成功 !');
                });
                res.redirect('/');
            });
        });
    })

    app.get('/logout', (req, res)=>{})
    
    app.get('/home', (req, res)=>{
        res.render('home', {
            title: 'Home'
        });
    })
};