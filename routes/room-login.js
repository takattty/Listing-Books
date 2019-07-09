const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/id/login', function(req, res, next) { 
  res.render('room-login');
});

module.exports = router;