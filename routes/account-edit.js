const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/edit', function(req, res, next) {
  res.render('account-edit');
});

module.exports = router;
