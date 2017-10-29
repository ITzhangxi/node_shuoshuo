const formidable = require('formidable');
const db = require('../models/db');
const md5 = require('../models/md5');
const path = require('path');
const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true})

//注册用户
exports.regist = function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.json({
                code: 500,
                msg: '未知异常，请联系管理员'
            })
        }
        ;
        let username = fields.username;
        let password = md5(fields.password);
        db.find('mange', 'users', {
            username: username
        }, (err, result) => {
            if (err) {
                res.json({
                    code: 500,
                    msg: '未知异常，请联系管理员'
                });
                return;
            }
            ;
            if (result.length != 0) {
                res.json({
                    code: -2,
                    msg: '此账户已存在'
                });
            } else {
                let falg = true;
                result.forEach(val => {
                    if (val.password == password) {
                        res.json({
                            code: -3,
                            msg: '此用用户已存在'
                        });
                        falg = false;
                    }
                    ;
                });
                if (true) {
                    db.insertOne('mange', 'users', {
                        username: username,
                        password: password,
                        date: new Date()
                    }, (err, result) => {
                        if (err) {
                            res.json({
                                code: -1,
                                msg: '新增失败'
                            });
                            return;
                        }
                        ;
                        req.session.login = 1;
                        req.session.username = username;
                        res.json({
                            code: 1,
                            msg: '添加成员成功'
                        })
                    });
                }
                ;
            }
        })
    })
};
//检测是否已经登录
exports.islogin = function (req, res, next) {
    let login = req.session.login;
    let username = req.session.username;
    let avatar = req.session.avatar || 'default.png';
    res.json({
        code: 0,
        data: {
            login: login,
            username: username,
            avatar:avatar
        }
    })
};
//获取头像
exports.getavatar = function (req, res, next) {
    let login = req.session.login;
    let username = req.session.username;
    let avatar = req.session.avatar || 'default.png';
    res.json({
        code: 0,
        data: {
            login: login,
            username: username,
            avatar:avatar
        }
    })
};
//登录
exports.login = function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.json({
                code: 500,
                msg: '未知异常，请联系管理员'
            });
            return;
        }
        ;
        let username = fields.username;
        let password = md5(fields.password);
        db.find('mange', 'users', {
            username: username
        }, (err, result) => {
            if (err) {
                res.json({
                    code: 500,
                    msg: '未知异常，请联系管理员'
                });
                return;
            }
            ;
            if (result.length == 0) {
                res.json({
                    code: '-1',
                    msg: '用户不存在'
                });
                return;
            } else {
                if (password === result[0].password) {
                    req.session.login = 1;
                    req.session.username = username;
                    res.json({
                        code: 1,
                        msg: '登录成功'
                    });
                    return;
                } else {
                    res.json({
                        code: -2,
                        msg: '密码错误'
                    });
                    return;
                }
            }
        })

    })
};
//上传头像
exports.dosetavatar = function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + '/../avatar');
    form.parse(req, (err, fields, files) => {
        let file = files.headerimg;
        let oldname = file.path;
        let newpath = path.normalize(__dirname + '/../avatar/') + req.session.username + '.' + file.type.substr(6);
        fs.rename(oldname, newpath, (err) => {
            if (err) {
                res.send(err);
                return;
            };
            req.session.avatar = req.session.username + '.' + file.type.substr(6);
            res.redirect('/cut');
        });

    })
};
//裁剪头像
exports.docut = function (req, res, next) {
    let w = req.query.w;
    let h = req.query.h;
    let x = req.query.x;
    let y = req.query.y;
    gm('./avatar/' + req.session.avatar)
        .crop(w, h, x, y)
        .write('./avatar/'+ req.session.avatar, (err) => {
            if (err) {
                res.json({
                    code: -1,
                    msg: '裁剪失败！'
                });
                return;
            }
            ;
            res.json({
                code: 1,
                msg: '裁剪成功！'
            });
        });
};