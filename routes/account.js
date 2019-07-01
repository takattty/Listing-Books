const express = require('express');
const router = express.Router();

router.get('/createaccount', function(req, res, next) {
    res.render('account', {});
});

module.exports = router;