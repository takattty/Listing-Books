const express = require('express');
const router = express.Router();

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

router.get('/edit', function(req, res, next) {
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