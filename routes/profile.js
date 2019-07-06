const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/id', function(req, res, next) {
  res.render('profile', { bottom: '設定' });
});

module.exports = router;
