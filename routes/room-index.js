const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) { //今回はここでDatabaseからRoom情報を取得して、ejsファイルに表示する処理を書く。
  res.render('room-index');
});

module.exports = router;