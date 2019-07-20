const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

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

router.post('/signup', function(req, res, next) {
    let id = null;
    let name = req.body.name;

    function pass() {
        let pass1 = req.body.password1;
        let pass2 = req.body.password2;
            if (pass1 == pass2) {
                return pass1;
            } else {
                
                res.redirect('/signup');
            }
    }

    let password = pass(); 
    let si = req.body.comment;
    let date = {id, name, password, si};
    connection.connect();
    connection.query('INSERT INTO account SET ?', date,
        function (error, results, fields) {
            if (error) throw error;
            res.redirect('/');
        });
    console.log(date);
    connection.end();
});


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