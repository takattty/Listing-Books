const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/edit', function(req, res, next) { //router.getメソッドで'/'にアクセスした際の表示を行う。
  res.render('account-edit');
});

module.exports = router;
