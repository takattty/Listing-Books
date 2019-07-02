const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('account', { account_title: 'ここではアカウントの新規作成が出来ます。<br>名前、パスワード、自己紹介を書いてアカウントを作成しよう！'});
});

router.get('/id/edit', function(req, res, next) {
    res.render('account_edit', { account_edit: '編集しますか？' });
});

module.exports = router;