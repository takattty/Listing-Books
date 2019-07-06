const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/id', function(req, res, next) {
  res.render('profile', { bottom: '編集する' });
});

module.exports = router;
