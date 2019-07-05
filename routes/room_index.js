const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) { //router.getメソッドで'/'にアクセスした際の表示を行う。
  res.render('room_index');
});

module.exports = router;