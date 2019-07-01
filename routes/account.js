const express = require('express');
const router = express.Router();

router.get('/account/create', function(req, res, next) {
    res.render('account', {});
});

router.get('/account/id/edit', function(req, res, next) {
    res.render('account_edit', {});
});

module.exports = router;