const express = require('express');
const router = express.Router();

router.get('/signup', function(req, res, next) {
    const signup_text = {
        title: 'ここではアカウントの新規作成が出来ます。名前、パスワード、自己紹介を書いてアカウントを作成しよう！'
    };
    res.render('account', signup_text);
});

router.get('/id/edit', function(req, res, next) {
    res.render('account_edit', { account_edit: '編集しますか？' });
});

module.exports = router;