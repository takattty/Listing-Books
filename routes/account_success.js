const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/success', function(req, res, next) { //router.getメソッドで'/'にアクセスした際の表示を行う。
  res.render('account_success', { user_name: 'ユーザー名が入ります。'});
});

module.exports = router;
