const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');
const { check, validationResult } = require('express-validator'); 

router.get('/signup', function(req, res, next) {
    const signup_text = {
        title1: 'ここではアカウントの新規作成が出来ます。',
        title2: '名前、パスワード、自己紹介を書いてアカウントを作成しよう！',
        create: 'アカウント新規作成',
        name: '名前',
        text: '自己紹介',
        bottom: 'アカウントを作成する' 
    };
    res.render('account', signup_text);
});

router.post('/signup', (req, res, next) => {
    function pass() {
        let pass1 = req.body.password1;
        let pass2 = req.body.password2;
            if (pass1 == pass2) {
                return pass1;
            } else {
                res.redirect('/account/signup');
            }
    }
    let id = null;
    let name = req.body.name;
    let password = pass(); 
    let si = req.body.comment;
    let date = {id, name, password, si};
    connection.query('INSERT INTO account SET ?', date,
        (error, results, fields) => {
            res.redirect('/id/success');
        });
    console.log(date);
});

router.get('/login', function(req, res, next) {
    const login_text = {
        title1: 'ここではログインが出来ます。',
        title2: '名前、パスワード、自己紹介を書いてログインしよう！',
        create: 'ログイン',
        name: '名前',
        text: '自己紹介',
        bottom: 'ログインする' 
    };
    res.render('account', login_text);
});

router.post('/login', (req, res, next) => {
    function pass() {
        let pass1 = req.body.password1;
        let pass2 = req.body.password2;
            if (pass1 == pass2) {
                return pass1;
            } else {
                res.redirect('/account/login');
            }
    }
    let name = req.body.name;
    let password = pass();
    let query = 'SELECT id FROM account WHERE name="' + name + '" AND password = "' + password + '" LIMIT 1';
    connection.query(query, (error, rows) => {
        if (error) {
            console.log("ここでエラーになってるよ！");
            res.end();
        } else {
            let userId = rows.length? rows[0].id: false;
            if (userId) {
                req.session.user_id = userId;
                console.log(userId);
                console.log("セッションID登録完了！！！");
                res.redirect('/id/success');
            } else {
                res.redirect('/account/login');
                console.log("falseだよ");
            }
        }
    })
})


router.get('/id/edit', function(req, res, next) {
    const edit_text = {
        title1: 'ここではアカウントの編集が出来ます。',
        title2: '編集を終えたら、保存ボタンを押しましょう！',
        create: 'アカウント編集',
        name: '名前',
        text: '自己紹介',
        bottom: '保存する'
    }
    res.render('account', edit_text);
});

module.exports = router;