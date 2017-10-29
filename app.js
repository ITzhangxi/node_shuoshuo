const express = require('express');
const app = express();
const router = require('./routers/routers');
const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static('./node_modules'));
app.use(express.static('./views'));
app.use(express.static('./images'));
app.use(express.static('./avatar'));
app.use(express.static('./public'));
app.post('/regist',router.regist);
app.post('/login',router.login);
app.get('/islogin',router.islogin);
app.post('/dosetavatar',router.dosetavatar);
app.get('/docut',router.docut);
app.get('/api/avatar',router.getavatar);


app.listen(3000);